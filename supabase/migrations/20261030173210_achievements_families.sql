-- Logros por familias con niveles: métricas nuevas, país y foto en el perfil público y
-- estadísticas competitivas por período. El catálogo va en la migración siguiente (generada).

-- ---------- métricas ----------
-- goal_days: días en que el tiempo de estudio alcanzó el objetivo diario actual.
-- reviews_completed: repasos espaciados terminados.
-- fast_answers: respuestas correctas al primer intento en menos de 2 segundos.
create or replace function public.achievement_metrics(p_user_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'lessons_completed', (select count(*) from public.user_lesson_progress
                           where user_id = p_user_id and times_completed > 0),
    'perfect_lessons', (select count(*) from public.user_lesson_progress
                         where user_id = p_user_id and best_accuracy >= 1),
    'stars_earned', (public.lesson_star_totals(p_user_id) -> 'stars_earned'),
    'fast_answers', (select count(*) from public.exercise_attempts
                      where user_id = p_user_id and is_correct and is_first_try and response_ms < 2000),
    'words_seen', (select count(*) from public.user_word_progress
                    where user_id = p_user_id and seen_count > 0),
    'words_mastered', (select count(*) from public.user_word_progress
                        where user_id = p_user_id and stage >= (public.srs_config() ->> 'masteredStage')::int),
    'reviews_completed', (select count(*) from public.learning_sessions
                           where user_id = p_user_id and kind = 'review'),
    -- Racha más larga histórica: islas de días consecutivos (activity_date ya es fecha local).
    'best_streak_days', (select coalesce(max(len), 0) from (
                           select count(*) as len from (
                             select activity_date - (row_number() over (order by activity_date))::int as grp
                             from public.user_daily_activity where user_id = p_user_id
                           ) d group by grp
                         ) s),
    'goal_days', (select count(*) from public.user_daily_activity d
                   join public.profiles p on p.id = d.user_id
                   where d.user_id = p_user_id and d.seconds_spent >= p.daily_goal_minutes * 60),
    'games_played', (select coalesce(sum(games_played), 0) from public.player_ratings where user_id = p_user_id),
    'wins', (select coalesce(sum(wins), 0) from public.player_ratings where user_id = p_user_id),
    'best_win_streak', (select coalesce(max(best_win_streak), 0) from public.player_ratings where user_id = p_user_id),
    -- El rango cuenta recién después de la colocación (RATING_CONFIG.placementMatches = 5): todos
    -- arrancan en 1000, que ya es Plata, y la app muestra "Sin rango" hasta terminarla.
    'peak_rating', (select coalesce(max(peak_rating), 0) from public.player_ratings
                    where user_id = p_user_id and games_played >= 5)
  );
$$;

-- ---------- perfil público: país (si el usuario lo muestra) ----------
create or replace function public.get_public_profile(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  visibility text;
  show_region boolean;
  is_open boolean;
  result jsonb;
  m jsonb;
  stars jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into prof from public.profiles where id = p_user_id and username is not null;
  if not found then
    return null;
  end if;

  select s.profile_visibility, s.show_region into visibility, show_region
  from public.user_settings s where s.user_id = p_user_id;
  is_open := p_user_id = uid or coalesce(visibility, 'private') = 'public';

  result := jsonb_build_object(
    'id', prof.id,
    'username', prof.username,
    'display_name', prof.display_name,
    'avatar_id', prof.avatar_id,
    'avatar_path', prof.avatar_path,
    'public_code', prof.public_code,
    'created_at', prof.created_at,
    'is_public', is_open,
    -- El país sólo se muestra si el usuario lo activó (o es su propio perfil).
    'region', case when p_user_id = uid or coalesce(show_region, false) then prof.region end,
    'rating', (select jsonb_build_object('rating', r.rating, 'games_played', r.games_played)
               from public.player_ratings r
               where r.user_id = p_user_id and r.language_code = prof.target_language)
  );

  if is_open then
    m := public.achievement_metrics(p_user_id);
    stars := public.lesson_star_totals(p_user_id);
    result := result || jsonb_build_object(
      'stats', (select jsonb_build_object(
                  'wins', r.wins, 'losses', r.losses, 'draws', r.draws,
                  'peak_rating', r.peak_rating, 'best_win_streak', r.best_win_streak)
                from public.player_ratings r
                where r.user_id = p_user_id and r.language_code = prof.target_language),
      'learning', jsonb_build_object(
                  'lessons_completed', m -> 'lessons_completed',
                  'words_mastered', m -> 'words_mastered',
                  'best_streak_days', m -> 'best_streak_days',
                  'stars_earned', stars -> 'stars_earned',
                  'golden_lessons', stars -> 'golden_lessons'),
      'achievements', (select coalesce(jsonb_agg(jsonb_build_object(
                          'id', a.id, 'title', a.title_es, 'icon', a.icon, 'category', a.category,
                          'unlocked_at', ua.unlocked_at) order by a.position), '[]'::jsonb)
                       from public.user_achievements ua
                       join public.achievements a on a.id = ua.achievement_id
                       where ua.user_id = p_user_id and a.is_active)
    );
  end if;

  return result;
end;
$$;

-- ---------- estadísticas competitivas por período ----------
-- Invoker: por RLS cada jugador sólo lee sus propias filas de battle_players y sus partidas.
-- p_days null = desde siempre.
create or replace function public.get_competitive_stats(p_days integer)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with mine as (
    select bp.result, bp.rating_before, bp.rating_after, b.is_ranked,
           coalesce(b.ended_at, b.created_at) as at
    from public.battle_players bp
    join public.battles b on b.id = bp.battle_id
    where bp.user_id = (select auth.uid())
      and b.status in ('completed','forfeited')
      and bp.result is not null
      and (p_days is null or coalesce(b.ended_at, b.created_at) >= now() - make_interval(days => p_days))
  ),
  -- Rachas de victorias: cada no-victoria abre un grupo nuevo.
  streaks as (
    select count(*) as len
    from (select result, count(*) filter (where result <> 'win') over (order by at rows unbounded preceding) as grp
          from mine) s
    where result = 'win'
    group by grp
  )
  select jsonb_build_object(
    'games', (select count(*) from mine),
    'wins', (select count(*) from mine where result = 'win'),
    'draws', (select count(*) from mine where result = 'draw'),
    'losses', (select count(*) from mine where result = 'loss'),
    'rating_delta', (select coalesce(sum(rating_after - rating_before), 0) from mine
                     where is_ranked and rating_before is not null and rating_after is not null),
    'best_win_streak', (select coalesce(max(len), 0) from streaks));
$$;

revoke all on function public.achievement_metrics(uuid) from public, anon;
grant execute on function public.achievement_metrics(uuid) to authenticated;
revoke all on function public.get_public_profile(uuid) from public, anon;
grant execute on function public.get_public_profile(uuid) to authenticated;
revoke all on function public.get_competitive_stats(integer) from public, anon;
grant execute on function public.get_competitive_stats(integer) to authenticated;

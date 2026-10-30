-- Estrellas del camino de lecciones: logros, perfil público y clasificación.
-- Requiere 20261030153550_achievements_stars_metric (métrica 'stars_earned').

-- ---------- estrellas ----------
-- Misma regla que lessonStars() en src/features/learning/path.ts: 3 sin errores (lección dorada),
-- 2 desde 80 % de precisión al primer intento, 1 por completarla. Sólo lecciones publicadas.
-- Invoker: con RLS un cliente sólo ve su propio progreso; las funciones definer pasan el id real.
create or replace function public.lesson_star_totals(p_user_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'stars_earned', coalesce(sum(case when p.best_accuracy >= 1 then 3
                                      when p.best_accuracy >= 0.8 then 2
                                      else 1 end), 0)::int,
    'golden_lessons', (count(*) filter (where p.best_accuracy >= 1))::int)
  from public.user_lesson_progress p
  join public.lessons l on l.id = p.lesson_id and l.is_published
  where p.user_id = p_user_id and p.times_completed > 0;
$$;

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
    'words_seen', (select count(*) from public.user_word_progress
                    where user_id = p_user_id and seen_count > 0),
    'words_mastered', (select count(*) from public.user_word_progress
                        where user_id = p_user_id and stage >= (public.srs_config() ->> 'masteredStage')::int),
    -- Racha más larga histórica: islas de días consecutivos (activity_date ya es fecha local).
    'best_streak_days', (select coalesce(max(len), 0) from (
                           select count(*) as len from (
                             select activity_date - (row_number() over (order by activity_date))::int as grp
                             from public.user_daily_activity where user_id = p_user_id
                           ) d group by grp
                         ) s),
    'games_played', (select coalesce(sum(games_played), 0) from public.player_ratings where user_id = p_user_id),
    'wins', (select coalesce(sum(wins), 0) from public.player_ratings where user_id = p_user_id),
    'best_win_streak', (select coalesce(max(best_win_streak), 0) from public.player_ratings where user_id = p_user_id),
    'peak_rating', (select coalesce(max(peak_rating), 0) from public.player_ratings where user_id = p_user_id)
  );
$$;

-- ---------- catálogo: logros de estrellas y lecciones doradas ----------
-- Las posiciones son únicas: se corren fuera de rango antes de reordenar.
update public.achievements set position = position + 100 where position < 100;

insert into public.achievements (id, category, metric, threshold, title_es, description_es, icon, position) values
  ('first_lesson',     'learning',    'lessons_completed', 1,    'Primer paso',        'Completá tu primera lección.',                       'footprints', 1),
  ('lessons_5',        'learning',    'lessons_completed', 5,    'Constante',          'Completá 5 lecciones distintas.',                    'book-open',  2),
  ('lessons_15',       'learning',    'lessons_completed', 15,   'Base sólida',        'Completá 15 lecciones distintas.',                   'graduation-cap', 3),
  ('perfect_lesson',   'learning',    'perfect_lessons',   1,    'Impecable',          'Terminá una lección sin errores en el primer intento.', 'sparkles', 4),
  ('perfect_5',        'learning',    'perfect_lessons',   5,    'Precisión quirúrgica', 'Terminá 5 lecciones distintas sin errores.',       'target',     5),
  ('golden_25',        'learning',    'perfect_lessons',   25,   'Toque de oro',       'Convertí 25 lecciones en doradas (3 estrellas).',    'crown',      6),
  ('stars_30',         'learning',    'stars_earned',      30,   'Primeras estrellas', 'Juntá 30 estrellas en el camino de lecciones.',      'star',       7),
  ('stars_120',        'learning',    'stars_earned',      120,  'Constelación',       'Juntá 120 estrellas en el camino de lecciones.',     'medal',      8),
  ('stars_300',        'learning',    'stars_earned',      300,  'Galaxia',            'Juntá 300 estrellas en el camino de lecciones.',     'orbit',      9),
  ('words_25',         'vocabulary',  'words_seen',        25,   'Curioso',            'Estudiá 25 palabras.',                               'eye',        10),
  ('mastered_10',      'vocabulary',  'words_mastered',    10,   'Memoria firme',      'Dominá 10 palabras con repasos espaciados.',         'brain',      11),
  ('mastered_50',      'vocabulary',  'words_mastered',    50,   'Diccionario andante', 'Dominá 50 palabras con repasos espaciados.',        'library',    12),
  ('streak_3',         'streak',      'best_streak_days',  3,    'En marcha',          'Estudiá 3 días seguidos.',                           'flame',      13),
  ('streak_7',         'streak',      'best_streak_days',  7,    'Semana completa',    'Estudiá 7 días seguidos.',                           'calendar-check', 14),
  ('streak_30',        'streak',      'best_streak_days',  30,   'Imparable',          'Estudiá 30 días seguidos.',                          'zap',        15),
  ('placement_done',   'competitive', 'games_played',      5,    'Clasificado',        'Terminá tus 5 partidas de colocación.',              'shield',     16),
  ('first_win',        'competitive', 'wins',              1,    'Primera victoria',   'Ganá una partida ranked.',                           'swords',     17),
  ('wins_10',          'competitive', 'wins',              10,   'Competidor',         'Ganá 10 partidas ranked.',                           'trophy',     18),
  ('win_streak_5',     'competitive', 'best_win_streak',   5,    'En racha',           'Ganá 5 partidas ranked seguidas.',                   'trending-up', 19),
  ('peak_platinum',    'competitive', 'peak_rating',       1200, 'Platino',            'Alcanzá 1200 de ELO.',                               'gem',        20)
on conflict (id) do update set
  category = excluded.category, metric = excluded.metric, threshold = excluded.threshold,
  title_es = excluded.title_es, description_es = excluded.description_es, icon = excluded.icon,
  position = excluded.position;

-- ---------- perfil público: suma estrellas y lecciones doradas ----------
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

  select s.profile_visibility into visibility from public.user_settings s where s.user_id = p_user_id;
  is_open := p_user_id = uid or coalesce(visibility, 'private') = 'public';

  result := jsonb_build_object(
    'id', prof.id,
    'username', prof.username,
    'display_name', prof.display_name,
    'avatar_id', prof.avatar_id,
    'public_code', prof.public_code,
    'created_at', prof.created_at,
    'is_public', is_open,
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

-- ---------- clasificación: estrellas de los jugadores con perfil público ----------
-- Definer para leer el progreso ajeno, pero sólo de perfiles públicos (o el propio), como
-- get_public_profile. Hasta 100 ids por llamada.
create or replace function public.get_public_stars(p_user_ids uuid[])
returns table (user_id uuid, stars_earned integer)
language sql
stable
security definer
set search_path = ''
as $$
  select u.id, (public.lesson_star_totals(u.id) ->> 'stars_earned')::int
  from unnest(p_user_ids[1:100]) as u(id)
  left join public.user_settings s on s.user_id = u.id
  where (select auth.uid()) is not null
    and (u.id = (select auth.uid()) or coalesce(s.profile_visibility, 'private') = 'public');
$$;

revoke all on function public.lesson_star_totals(uuid) from public, anon;
grant execute on function public.lesson_star_totals(uuid) to authenticated;
revoke all on function public.achievement_metrics(uuid) from public, anon;
grant execute on function public.achievement_metrics(uuid) to authenticated;
revoke all on function public.get_public_profile(uuid) from public, anon;
grant execute on function public.get_public_profile(uuid) to authenticated;
revoke all on function public.get_public_stars(uuid[]) from public, anon;
grant execute on function public.get_public_stars(uuid[]) to authenticated;

-- ---------- logros ya alcanzados por usuarios existentes ----------
select public.evaluate_achievements(id) from public.profiles;

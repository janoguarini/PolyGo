-- La mejor racha histórica (logros "En llamas" e hitos de racha de Polys) respeta los días cubiertos:
-- un día salvado con protector o recuperado con Polys no suma, pero tampoco corta la racha. Es la
-- misma regla que la racha actual (get_learning_summary).

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
    -- Racha más larga histórica: islas de días consecutivos (activity_date ya es fecha local). Los
    -- días cubiertos (protector o recuperación) unen la isla pero no suman.
    'best_streak_days', (select coalesce(max(len), 0) from (
                           select count(*) filter (where studied) as len from (
                             select studied, day - (row_number() over (order by day))::int as grp
                             from (
                               select activity_date as day, true as studied
                               from public.user_daily_activity where user_id = p_user_id
                               union all
                               select f.frozen_date, false
                               from public.user_frozen_days f
                               where f.user_id = p_user_id
                                 and not exists (select 1 from public.user_daily_activity a
                                                 where a.user_id = p_user_id
                                                   and a.activity_date = f.frozen_date)
                             ) days
                           ) d group by grp
                         ) s),
    'goal_days', (select count(*) from public.user_daily_activity d
                   join public.profiles p on p.id = d.user_id
                   where d.user_id = p_user_id and d.seconds_spent >= p.daily_goal_minutes * 60),
    'games_played', (select coalesce(sum(games_played), 0) from public.player_ratings where user_id = p_user_id),
    'wins', (select coalesce(sum(wins), 0) from public.player_ratings where user_id = p_user_id),
    'best_win_streak', (select coalesce(max(best_win_streak), 0) from public.player_ratings where user_id = p_user_id),
    -- El rango cuenta recién al posicionarse (primera victoria): antes la app muestra "Sin posicionar".
    'peak_rating', (select coalesce(max(peak_rating), 0) from public.player_ratings
                    where user_id = p_user_id and wins > 0)
  );
$$;


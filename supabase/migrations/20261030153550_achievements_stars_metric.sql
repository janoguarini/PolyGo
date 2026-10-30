-- Métrica nueva para logros: estrellas ganadas en el camino de lecciones.
-- Aplicada a mano en el SQL Editor (el conector MCP rechaza sentencias con DROP).
alter table public.achievements drop constraint achievements_metric_check;
alter table public.achievements add constraint achievements_metric_check check (metric in (
  'lessons_completed','perfect_lessons','stars_earned','words_seen','words_mastered','best_streak_days',
  'games_played','wins','best_win_streak','peak_rating'));

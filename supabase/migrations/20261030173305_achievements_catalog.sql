-- =====================================================================
-- Catálogo de logros generado por scripts/build-achievements-sql.ts desde shared/achievements.ts.
-- NO editar el catálogo a mano: editar shared/achievements.ts y regenerar.
-- 76 niveles
-- =====================================================================

-- Las posiciones son únicas: se corren fuera de rango antes de reordenar.
update public.achievements set position = position + 1000 where position < 1000;

insert into public.achievements (id, category, metric, threshold, title_es, description_es, icon, position, is_active) values
  ('streak_3', 'streak', 'best_streak_days', 3, 'En llamas · Nivel 1', 'Estudiá 3 días seguidos.', 'flame', 1, true),
  ('streak_7', 'streak', 'best_streak_days', 7, 'En llamas · Nivel 2', 'Estudiá 7 días seguidos.', 'flame', 2, true),
  ('streak_14', 'streak', 'best_streak_days', 14, 'En llamas · Nivel 3', 'Estudiá 14 días seguidos.', 'flame', 3, true),
  ('streak_30', 'streak', 'best_streak_days', 30, 'En llamas · Nivel 4', 'Estudiá 30 días seguidos.', 'flame', 4, true),
  ('streak_60', 'streak', 'best_streak_days', 60, 'En llamas · Nivel 5', 'Estudiá 60 días seguidos.', 'flame', 5, true),
  ('streak_100', 'streak', 'best_streak_days', 100, 'En llamas · Nivel 6', 'Estudiá 100 días seguidos.', 'flame', 6, true),
  ('streak_180', 'streak', 'best_streak_days', 180, 'En llamas · Nivel 7', 'Estudiá 180 días seguidos.', 'flame', 7, true),
  ('streak_365', 'streak', 'best_streak_days', 365, 'En llamas · Nivel 8', 'Estudiá 365 días seguidos.', 'flame', 8, true),
  ('goal_1', 'streak', 'goal_days', 1, 'Objetivo cumplido · Nivel 1', 'Cumplí tu objetivo diario 1 día.', 'target', 9, true),
  ('goal_5', 'streak', 'goal_days', 5, 'Objetivo cumplido · Nivel 2', 'Cumplí tu objetivo diario 5 días.', 'target', 10, true),
  ('goal_15', 'streak', 'goal_days', 15, 'Objetivo cumplido · Nivel 3', 'Cumplí tu objetivo diario 15 días.', 'target', 11, true),
  ('goal_30', 'streak', 'goal_days', 30, 'Objetivo cumplido · Nivel 4', 'Cumplí tu objetivo diario 30 días.', 'target', 12, true),
  ('goal_60', 'streak', 'goal_days', 60, 'Objetivo cumplido · Nivel 5', 'Cumplí tu objetivo diario 60 días.', 'target', 13, true),
  ('goal_100', 'streak', 'goal_days', 100, 'Objetivo cumplido · Nivel 6', 'Cumplí tu objetivo diario 100 días.', 'target', 14, true),
  ('goal_200', 'streak', 'goal_days', 200, 'Objetivo cumplido · Nivel 7', 'Cumplí tu objetivo diario 200 días.', 'target', 15, true),
  ('first_lesson', 'learning', 'lessons_completed', 1, 'Erudito · Nivel 1', 'Completá tu primera lección.', 'book-open', 16, true),
  ('lessons_5', 'learning', 'lessons_completed', 5, 'Erudito · Nivel 2', 'Completá 5 lecciones distintas.', 'book-open', 17, true),
  ('lessons_15', 'learning', 'lessons_completed', 15, 'Erudito · Nivel 3', 'Completá 15 lecciones distintas.', 'book-open', 18, true),
  ('lessons_30', 'learning', 'lessons_completed', 30, 'Erudito · Nivel 4', 'Completá 30 lecciones distintas.', 'book-open', 19, true),
  ('lessons_60', 'learning', 'lessons_completed', 60, 'Erudito · Nivel 5', 'Completá 60 lecciones distintas.', 'book-open', 20, true),
  ('lessons_120', 'learning', 'lessons_completed', 120, 'Erudito · Nivel 6', 'Completá 120 lecciones distintas.', 'book-open', 21, true),
  ('perfect_lesson', 'learning', 'perfect_lessons', 1, 'Perfeccionista · Nivel 1', 'Terminá una lección sin errores (lección dorada).', 'crown', 22, true),
  ('perfect_5', 'learning', 'perfect_lessons', 5, 'Perfeccionista · Nivel 2', 'Terminá 5 lecciones distintas sin errores.', 'crown', 23, true),
  ('perfect_15', 'learning', 'perfect_lessons', 15, 'Perfeccionista · Nivel 3', 'Terminá 15 lecciones distintas sin errores.', 'crown', 24, true),
  ('golden_25', 'learning', 'perfect_lessons', 25, 'Perfeccionista · Nivel 4', 'Terminá 25 lecciones distintas sin errores.', 'crown', 25, true),
  ('perfect_50', 'learning', 'perfect_lessons', 50, 'Perfeccionista · Nivel 5', 'Terminá 50 lecciones distintas sin errores.', 'crown', 26, true),
  ('perfect_100', 'learning', 'perfect_lessons', 100, 'Perfeccionista · Nivel 6', 'Terminá 100 lecciones distintas sin errores.', 'crown', 27, true),
  ('stars_10', 'learning', 'stars_earned', 10, 'Coleccionista · Nivel 1', 'Juntá 10 estrellas en el camino de lecciones.', 'star', 28, true),
  ('stars_30', 'learning', 'stars_earned', 30, 'Coleccionista · Nivel 2', 'Juntá 30 estrellas en el camino de lecciones.', 'star', 29, true),
  ('stars_75', 'learning', 'stars_earned', 75, 'Coleccionista · Nivel 3', 'Juntá 75 estrellas en el camino de lecciones.', 'star', 30, true),
  ('stars_120', 'learning', 'stars_earned', 120, 'Coleccionista · Nivel 4', 'Juntá 120 estrellas en el camino de lecciones.', 'star', 31, true),
  ('stars_200', 'learning', 'stars_earned', 200, 'Coleccionista · Nivel 5', 'Juntá 200 estrellas en el camino de lecciones.', 'star', 32, true),
  ('stars_300', 'learning', 'stars_earned', 300, 'Coleccionista · Nivel 6', 'Juntá 300 estrellas en el camino de lecciones.', 'star', 33, true),
  ('fast_10', 'learning', 'fast_answers', 10, 'Rayo · Nivel 1', 'Respondé bien 10 veces en menos de 2 segundos.', 'zap', 34, true),
  ('fast_50', 'learning', 'fast_answers', 50, 'Rayo · Nivel 2', 'Respondé bien 50 veces en menos de 2 segundos.', 'zap', 35, true),
  ('fast_150', 'learning', 'fast_answers', 150, 'Rayo · Nivel 3', 'Respondé bien 150 veces en menos de 2 segundos.', 'zap', 36, true),
  ('fast_400', 'learning', 'fast_answers', 400, 'Rayo · Nivel 4', 'Respondé bien 400 veces en menos de 2 segundos.', 'zap', 37, true),
  ('fast_1000', 'learning', 'fast_answers', 1000, 'Rayo · Nivel 5', 'Respondé bien 1000 veces en menos de 2 segundos.', 'zap', 38, true),
  ('words_25', 'vocabulary', 'words_seen', 25, 'Explorador · Nivel 1', 'Estudiá 25 palabras.', 'eye', 39, true),
  ('words_50', 'vocabulary', 'words_seen', 50, 'Explorador · Nivel 2', 'Estudiá 50 palabras.', 'eye', 40, true),
  ('words_100', 'vocabulary', 'words_seen', 100, 'Explorador · Nivel 3', 'Estudiá 100 palabras.', 'eye', 41, true),
  ('words_200', 'vocabulary', 'words_seen', 200, 'Explorador · Nivel 4', 'Estudiá 200 palabras.', 'eye', 42, true),
  ('mastered_10', 'vocabulary', 'words_mastered', 10, 'Memoria de elefante · Nivel 1', 'Dominá 10 palabras con repasos espaciados.', 'brain', 43, true),
  ('mastered_25', 'vocabulary', 'words_mastered', 25, 'Memoria de elefante · Nivel 2', 'Dominá 25 palabras con repasos espaciados.', 'brain', 44, true),
  ('mastered_50', 'vocabulary', 'words_mastered', 50, 'Memoria de elefante · Nivel 3', 'Dominá 50 palabras con repasos espaciados.', 'brain', 45, true),
  ('mastered_100', 'vocabulary', 'words_mastered', 100, 'Memoria de elefante · Nivel 4', 'Dominá 100 palabras con repasos espaciados.', 'brain', 46, true),
  ('mastered_200', 'vocabulary', 'words_mastered', 200, 'Memoria de elefante · Nivel 5', 'Dominá 200 palabras con repasos espaciados.', 'brain', 47, true),
  ('reviews_1', 'vocabulary', 'reviews_completed', 1, 'Repasador · Nivel 1', 'Completá tu primer repaso.', 'repeat', 48, true),
  ('reviews_5', 'vocabulary', 'reviews_completed', 5, 'Repasador · Nivel 2', 'Completá 5 repasos.', 'repeat', 49, true),
  ('reviews_15', 'vocabulary', 'reviews_completed', 15, 'Repasador · Nivel 3', 'Completá 15 repasos.', 'repeat', 50, true),
  ('reviews_40', 'vocabulary', 'reviews_completed', 40, 'Repasador · Nivel 4', 'Completá 40 repasos.', 'repeat', 51, true),
  ('reviews_100', 'vocabulary', 'reviews_completed', 100, 'Repasador · Nivel 5', 'Completá 100 repasos.', 'repeat', 52, true),
  ('placement_done', 'competitive', 'games_played', 5, 'Gladiador · Nivel 1', 'Terminá tus 5 partidas de colocación.', 'shield', 53, true),
  ('games_25', 'competitive', 'games_played', 25, 'Gladiador · Nivel 2', 'Jugá 25 partidas ranked.', 'shield', 54, true),
  ('games_50', 'competitive', 'games_played', 50, 'Gladiador · Nivel 3', 'Jugá 50 partidas ranked.', 'shield', 55, true),
  ('games_100', 'competitive', 'games_played', 100, 'Gladiador · Nivel 4', 'Jugá 100 partidas ranked.', 'shield', 56, true),
  ('games_250', 'competitive', 'games_played', 250, 'Gladiador · Nivel 5', 'Jugá 250 partidas ranked.', 'shield', 57, true),
  ('games_500', 'competitive', 'games_played', 500, 'Gladiador · Nivel 6', 'Jugá 500 partidas ranked.', 'shield', 58, true),
  ('first_win', 'competitive', 'wins', 1, 'Campeón · Nivel 1', 'Ganá una partida ranked.', 'trophy', 59, true),
  ('wins_10', 'competitive', 'wins', 10, 'Campeón · Nivel 2', 'Ganá 10 partidas ranked.', 'trophy', 60, true),
  ('wins_25', 'competitive', 'wins', 25, 'Campeón · Nivel 3', 'Ganá 25 partidas ranked.', 'trophy', 61, true),
  ('wins_50', 'competitive', 'wins', 50, 'Campeón · Nivel 4', 'Ganá 50 partidas ranked.', 'trophy', 62, true),
  ('wins_100', 'competitive', 'wins', 100, 'Campeón · Nivel 5', 'Ganá 100 partidas ranked.', 'trophy', 63, true),
  ('wins_250', 'competitive', 'wins', 250, 'Campeón · Nivel 6', 'Ganá 250 partidas ranked.', 'trophy', 64, true),
  ('win_streak_3', 'competitive', 'best_win_streak', 3, 'Imparable · Nivel 1', 'Ganá 3 partidas ranked seguidas.', 'trending-up', 65, true),
  ('win_streak_5', 'competitive', 'best_win_streak', 5, 'Imparable · Nivel 2', 'Ganá 5 partidas ranked seguidas.', 'trending-up', 66, true),
  ('win_streak_10', 'competitive', 'best_win_streak', 10, 'Imparable · Nivel 3', 'Ganá 10 partidas ranked seguidas.', 'trending-up', 67, true),
  ('win_streak_15', 'competitive', 'best_win_streak', 15, 'Imparable · Nivel 4', 'Ganá 15 partidas ranked seguidas.', 'trending-up', 68, true),
  ('win_streak_20', 'competitive', 'best_win_streak', 20, 'Imparable · Nivel 5', 'Ganá 20 partidas ranked seguidas.', 'trending-up', 69, true),
  ('peak_silver', 'competitive', 'peak_rating', 900, 'Escalador · Nivel 1', 'Llegá a Plata (900 de ELO).', 'gem', 70, true),
  ('peak_gold', 'competitive', 'peak_rating', 1050, 'Escalador · Nivel 2', 'Llegá a Oro (1050 de ELO).', 'gem', 71, true),
  ('peak_platinum', 'competitive', 'peak_rating', 1200, 'Escalador · Nivel 3', 'Llegá a Platino (1200 de ELO).', 'gem', 72, true),
  ('peak_emerald', 'competitive', 'peak_rating', 1350, 'Escalador · Nivel 4', 'Llegá a Esmeralda (1350 de ELO).', 'gem', 73, true),
  ('peak_diamond', 'competitive', 'peak_rating', 1500, 'Escalador · Nivel 5', 'Llegá a Diamante (1500 de ELO).', 'gem', 74, true),
  ('peak_master', 'competitive', 'peak_rating', 1700, 'Escalador · Nivel 6', 'Llegá a Maestro (1700 de ELO).', 'gem', 75, true),
  ('peak_grandmaster', 'competitive', 'peak_rating', 1900, 'Escalador · Nivel 7', 'Llegá a Gran Maestro (1900 de ELO).', 'gem', 76, true)
on conflict (id) do update set
  category = excluded.category, metric = excluded.metric, threshold = excluded.threshold,
  title_es = excluded.title_es, description_es = excluded.description_es, icon = excluded.icon,
  position = excluded.position, is_active = true;

-- Niveles retirados del catálogo: se desactivan (quien los tenía los conserva en su historial).
update public.achievements set is_active = false
where id not in ('streak_3', 'streak_7', 'streak_14', 'streak_30', 'streak_60', 'streak_100', 'streak_180', 'streak_365', 'goal_1', 'goal_5', 'goal_15', 'goal_30', 'goal_60', 'goal_100', 'goal_200', 'first_lesson', 'lessons_5', 'lessons_15', 'lessons_30', 'lessons_60', 'lessons_120', 'perfect_lesson', 'perfect_5', 'perfect_15', 'golden_25', 'perfect_50', 'perfect_100', 'stars_10', 'stars_30', 'stars_75', 'stars_120', 'stars_200', 'stars_300', 'fast_10', 'fast_50', 'fast_150', 'fast_400', 'fast_1000', 'words_25', 'words_50', 'words_100', 'words_200', 'mastered_10', 'mastered_25', 'mastered_50', 'mastered_100', 'mastered_200', 'reviews_1', 'reviews_5', 'reviews_15', 'reviews_40', 'reviews_100', 'placement_done', 'games_25', 'games_50', 'games_100', 'games_250', 'games_500', 'first_win', 'wins_10', 'wins_25', 'wins_50', 'wins_100', 'wins_250', 'win_streak_3', 'win_streak_5', 'win_streak_10', 'win_streak_15', 'win_streak_20', 'peak_silver', 'peak_gold', 'peak_platinum', 'peak_emerald', 'peak_diamond', 'peak_master', 'peak_grandmaster');

-- Logros ya alcanzados por usuarios existentes (p. ej. niveles nuevos por debajo de los que tenían).
select public.evaluate_achievements(id) from public.profiles;

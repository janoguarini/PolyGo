-- Reversión manual de 20261227120000_word_rush_bank (+ 20261227120100_word_rush_bank_data). No es una
-- migración. Sin aplicar (la migración tampoco está aplicada).
--
-- Borra las dos tablas del banco de Word Rush y sus funciones. No toca lecciones, ejercicios,
-- palabras, partidas ni ratings. El servidor de partidas sigue funcionando: si las tablas no existen,
-- loadSentences registra word_rush_bank_unavailable y usa sólo las frases de las lecciones.
begin;

drop table if exists public.word_rush_exercise_variants;
drop table if exists public.word_rush_sentences;
drop function if exists public.word_rush_exercise_variants_check();
drop function if exists public.word_rush_sentences_check_unit();

commit;

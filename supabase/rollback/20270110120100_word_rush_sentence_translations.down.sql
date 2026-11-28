-- Rollback de supabase/pending/20270110120100_word_rush_sentence_translations.sql: quita la tabla de
-- consignas por idioma de apoyo y su trigger. No toca word_rush_sentences ni ninguna otra tabla. Sin la
-- tabla, el servidor de partidas muestra la consigna canónica a los cursos localizados (y registra
-- word_rush_translations_unavailable). LOCAL: no aplicado.
drop table if exists public.word_rush_sentence_translations;
drop function if exists public.word_rush_sentence_translations_check();

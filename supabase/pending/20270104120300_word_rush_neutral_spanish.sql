-- =====================================================================
-- Español neutro en las traducciones del banco de Word Rush (docs/NEUTRAL_SPANISH.md). Las mismas
-- 16 frases que cambian en supabase/pending/20261227120100_word_rush_bank_data.sql (regenerado desde
-- content/word-rush/), para una base donde ese banco ya está cargado. NO APLICADA EN PRODUCCIÓN.
-- Vive en supabase/pending/ junto al banco (20261227120000/120100): se aplica a mano, después de él.
--
-- Sólo cambia la traducción al español que se muestra; la frase en inglés, sus fichas y las respuestas
-- aceptadas no cambian. Si el banco no existe (base sin la fase 5), no hace nada. Si una traducción ya
-- no es la vieja (se editó a mano o se aplicó el banco regenerado), no la toca.
-- Rollback: las mismas filas con old/new intercambiados.
-- =====================================================================

do $$
begin
  if to_regclass('public.word_rush_sentences') is null then
    return;
  end if;
  update public.word_rush_sentences s set translation = x.new_translation
  from (values
    ('en.wr.u01-is-your-name-tom', '¿Te llamás Tom?', '¿Te llamas Tom?'),
    ('en.wr.u01-excuse-me-are-you-ana', 'Disculpá, ¿sos Ana?', 'Disculpa, ¿eres Ana?'),
    ('en.wr.u02-you-are-my-friend', 'Sos mi amigo.', 'Eres mi amigo.'),
    ('en.wr.u03-are-you-from-spain', '¿Sos de España?', '¿Eres de España?'),
    ('en.wr.u08-do-you-work-at-home', '¿Trabajás desde casa?', '¿Trabajas desde casa?'),
    ('en.wr.u08-where-do-you-live', '¿Dónde vivís?', '¿Dónde vives?'),
    ('en.wr.u09-what-time-do-you-eat-lunch', '¿A qué hora almorzás?', '¿A qué hora almuerzas?'),
    ('en.wr.u10-turn-left-at-the-bank', 'Doblá a la izquierda en el banco.', 'Dobla a la izquierda en el banco.'),
    ('en.wr.u10-go-straight-on', 'Seguí derecho.', 'Sigue derecho.'),
    ('en.wr.u11-can-you-swim', '¿Sabés nadar?', '¿Sabes nadar?'),
    ('en.wr.u12-can-you-repeat-that-please', '¿Podés repetir eso, por favor?', '¿Puedes repetir eso, por favor?'),
    ('en.wr.u12-do-you-speak-spanish', '¿Hablás español?', '¿Hablas español?'),
    ('en.wr.u12-how-many-brothers-do-you-have', '¿Cuántos hermanos tenés?', '¿Cuántos hermanos tienes?'),
    ('en.wr.u12-when-do-you-work', '¿Cuándo trabajás?', '¿Cuándo trabajas?'),
    ('en.wr.u12-which-book-do-you-want', '¿Qué libro querés?', '¿Qué libro quieres?'),
    ('en.wr.u12-please-speak-slowly', 'Hablá despacio, por favor.', 'Habla despacio, por favor.')
  ) as x(id, old_translation, new_translation)
  where s.id = x.id and s.translation = x.old_translation;
end;
$$;

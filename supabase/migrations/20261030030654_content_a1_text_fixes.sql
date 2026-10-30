-- =====================================================================
-- Retoques de texto en las unidades 1 y 2 (mismo resultado que regenerarlas con
-- scripts/build-content-sql.ts, sin reenviar la unidad entera).
-- "not" deja de traducirse como "no (...)": chocaba con la palabra inglesa "no" en Word Rush y en
-- el widget (validación nueva en content/__tests__/content.test.ts).
-- =====================================================================

update public.words
set example_en = 'Yes, I am a student.', example_es = 'Sí, soy estudiante.'
where id = 'en-yes';

update public.words
set translation_es = 'negación (is not, am not)'
where id = 'en-not';

update public.exercises
set answer = 'negación (is not, am not)',
    payload = jsonb_set(payload, '{options,0}', to_jsonb('negación (is not, am not)'::text))
where id = 'a1-u02-l05-e07' and payload -> 'options' ->> 0 = 'no (para negar)';

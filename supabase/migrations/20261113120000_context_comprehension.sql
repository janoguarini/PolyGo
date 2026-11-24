-- Fase C: comprensión lectora y auditiva en contexto (docs/LEARNING_PHASE_C.md).
--
-- Amplía tres listas cerradas para admitir el tipo de ejercicio `context_choice` (estímulo + pregunta
-- + opciones; shared/exercises.ts) y la habilidad de interfaz `reading`:
--   1. exercises.type y exercise_items.type: + 'context_choice'.
--   2. exercises.skill: + 'reading' (columna de la interfaz de hoy; no se usa en ninguna evidencia,
--      arquitectura de datos §4.3).
--   3. exercises_choice_option_set_check: un context_choice es de elección (exact_option), así que
--      su ubicación necesita conjunto de opciones, como los otros tipos de elección (V8).
--
-- Sólo AMPLÍA: toda fila válida antes sigue siéndolo; no toca datos, funciones, permisos ni RLS. Un
-- CHECK no se puede ampliar sin quitarlo y volver a crearlo: cada `drop constraint` va en la misma
-- sentencia ALTER que su `add constraint` (atómica). Como lleva DROP, la herramienta MCP la rechaza
-- (§18): si se aprueba, se aplica desde el SQL Editor o la CLI, con autorización explícita.
--
-- Desviación documentada de §18 («C · Comprensión: esquema ninguno»): el esquema ya tenía los modos
-- reading_comprehension y listening_comprehension, pero los tipos de ejercicio son una lista cerrada y
-- ninguno admite un estímulo con preguntas. Decisión del 2026-11-09: tipo nuevo con migración mínima.
--
-- Nada más cambia: ref_mode_formats ya admite (reading|listening)_comprehension × select,
-- ref_input_modalities ya tiene text y audio, y la corrección exact_option.v1 no depende del tipo.
--
-- Idempotente: reaplicarla deja las mismas restricciones.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/comprehension.test.mjs). NO aplicada en
-- producción.

alter table public.exercises
  drop constraint if exists exercises_type_check,
  add constraint exercises_type_check check (type in (
    'image_choice', 'translation_choice', 'translate_write', 'complete_word', 'fill_blank',
    'order_words', 'listen_choice', 'match_pairs', 'short_answer', 'context_choice'));

alter table public.exercises
  drop constraint if exists exercises_skill_check,
  add constraint exercises_skill_check check (skill in (
    'vocabulary', 'translation', 'listening', 'grammar', 'sentence_building', 'reading'));

alter table public.exercise_items
  drop constraint if exists exercise_items_type_check,
  add constraint exercise_items_type_check check (type in (
    'image_choice', 'translation_choice', 'translate_write', 'complete_word', 'fill_blank',
    'order_words', 'listen_choice', 'match_pairs', 'short_answer', 'context_choice'));

alter table public.exercises
  drop constraint if exists exercises_choice_option_set_check,
  add constraint exercises_choice_option_set_check
    check (type not in ('image_choice', 'translation_choice', 'fill_blank', 'listen_choice', 'context_choice')
           or option_set_id is not null);

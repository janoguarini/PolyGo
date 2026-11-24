import type { PathUnit } from '../content';
import type { ObjectiveDef } from '../content/objectives';
import { PLANNED_OBJECTIVES } from '../content/planned-objectives';
import { PLANNED_PATH } from '../content/planned';
import {
  CATALOG_AFTER_EXERCISES_SQL,
  CATALOG_BEFORE_EXERCISES_SQL,
  catalogPayload,
  EXERCISE_CATALOG_COLUMNS,
  EXERCISE_CATALOG_JOINS,
  EXERCISE_CATALOG_VALUES,
} from './catalog-sql';
import { contentDocument } from './content-document';
import { assertNoDelimiters } from './content-sql';

/**
 * Migración de las lecciones escritas L1–L5 de las unidades planificadas (fase C.3,
 * docs/LEARNING_PHASE_C.md §C3), generada por scripts/build-planned-units-sql.ts. La prueba
 * supabase/tests/planned.test.mjs.
 *
 * Sólo agrega (add-only): nada que ya esté cargado se actualiza.
 * - Unidades: las creó la fase C.2 sin publicar (20261113120200). Si faltan, se crean igual, sin
 *   publicar; si existen con otros datos, aborta.
 * - Palabras, lecciones y ejercicios nacen con is_published = false (`on conflict do nothing`): RLS no
 *   los muestra, ni el camino de la app, ni learning_lesson_plan, ni is_lesson_unlocked los ven.
 *   Si ya existen con otro contenido, aborta en vez de dejarlos distintos en silencio.
 * - Ítems en status = 'draft': ninguna ruta de repasos los toma (review_item_candidates y sus
 *   variantes exigen ítems activos), aunque practiquen palabras que el alumno ya conoce. Los conceptos
 *   de las palabras nuevas nacen en 'draft' (su palabra no está publicada).
 * - exercise_words: los vínculos de siempre (hacen falta para el SRS léxico v1 cuando se publiquen).
 *   Con los ejercicios sin publicar nadie puede responderlos, así que no generan progreso.
 * - Catálogo, objetivos (reutilizados, draft), versiones y conjuntos de opciones con las plantillas de
 *   siempre (scripts/catalog-sql.ts), que también abortan si algo ya cargado difiere.
 */
export function plannedUnitsSql(
  path: readonly PathUnit[] = PLANNED_PATH,
  objectives: readonly ObjectiveDef[] = PLANNED_OBJECTIVES,
) {
  const document = contentDocument(path, { objectives });
  const { catalog, versions, optionSets, units, words, lessons, exercises } = document;
  const base = catalogPayload(catalog, versions, optionSets);
  const payload = JSON.stringify({
    units,
    words,
    lessons,
    exercises,
    catalog: { ...base, items: base.items.map((i) => ({ ...i, status: 'draft' })) },
  });
  assertNoDelimiters(payload);

  const sql = `-- =====================================================================
-- Fase C.3: lecciones escritas L1–L5 de las unidades planificadas (${units.map((u) => u.id).join(', ')}),
-- generadas por scripts/build-planned-units-sql.ts. NO editar a mano: editar
-- content/en/a1/unit13-*.ts y unit14-*.ts, correr npm test y regenerar.
-- Requiere 20261113120200_comprehension_en_a1_u13_u14.sql (unidades, persona y objetivos de la fase C).
-- Sólo agrega: lo ya cargado no cambia; si difiere, aborta. No publica nada.
-- ${units.length} unidades (sin publicar) · ${lessons.length} lecciones (sin publicar) · ${words.length} palabras (sin publicar) · ${exercises.length} ejercicios (sin publicar)
-- Catálogo: ${catalog.concepts.length} conceptos (draft) · ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
-- ${catalog.objectives.length} objetivos reutilizados (draft) · ${catalog.lesson_objectives.length} lecciones-objetivo · ${catalog.item_objectives.length} ítems-objetivo nuevos
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/planned.test.mjs). NO aplicada en producción.
-- =====================================================================

do $polygo_content$
declare
  d constant jsonb := $content$${payload}$content$::jsonb;
  v_bad text;
begin

-- Unidades planificadas: ya existen (fase C.2). Si faltan, se crean sin publicar.
insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji,
  objective_es, grammar, review_status, is_published)
select x.id, x.language_code, x.level, x.position, x.title_es, x.title_en, x.description_es, x.emoji,
  x.objective_es, x.grammar, x.review_status, false
from jsonb_to_recordset(d -> 'units')
  as x(id text, language_code text, level text, position smallint, title_es text, title_en text, description_es text,
       emoji text, objective_es text, grammar jsonb, review_status text)
on conflict (id) do nothing;

select string_agg(x.id, ', ') into v_bad
from jsonb_to_recordset(d -> 'units')
  as x(id text, language_code text, level text, position smallint, title_es text, title_en text, description_es text,
       emoji text, objective_es text, grammar jsonb, review_status text)
join public.curriculum_units u on u.id = x.id
where (u.language_code, u.level, u.position, u.title_es, u.title_en, u.description_es, u.emoji, u.objective_es,
       u.grammar, u.review_status)
   is distinct from (x.language_code, x.level, x.position, x.title_es, x.title_en, x.description_es, x.emoji,
       x.objective_es, x.grammar, x.review_status);
if v_bad is not null then
  raise exception 'planned_units: unidades ya cargadas con otros datos: %', v_bad;
end if;

insert into public.words (id, language_code, unit_id, text, translation_es, accepted_translations, ipa, romanization,
  emoji, example_en, example_es, difficulty, tags, is_published)
select x.id, x.language_code, x.unit_id, x.text, x.translation_es, x.accepted_translations, x.ipa, x.romanization,
  x.emoji, x.example_en, x.example_es, x.difficulty, x.tags, false
from jsonb_to_recordset(d -> 'words')
  as x(id text, language_code text, unit_id text, text text, translation_es text, accepted_translations text[],
       ipa text, romanization text, emoji text, example_en text, example_es text, difficulty smallint, tags text[])
on conflict (id) do nothing;

select string_agg(x.id, ', ') into v_bad
from jsonb_to_recordset(d -> 'words')
  as x(id text, language_code text, unit_id text, text text, translation_es text, accepted_translations text[],
       ipa text, romanization text, emoji text, example_en text, example_es text, difficulty smallint, tags text[])
join public.words w on w.id = x.id
where (w.language_code, w.unit_id, w.text, w.translation_es, w.accepted_translations, w.ipa, w.romanization, w.emoji,
       w.example_en, w.example_es, w.difficulty, w.tags)
   is distinct from (x.language_code, x.unit_id, x.text, x.translation_es, x.accepted_translations, x.ipa,
       x.romanization, x.emoji, x.example_en, x.example_es, x.difficulty, x.tags);
if v_bad is not null then
  raise exception 'planned_units: palabras ya cargadas con otros datos: %', v_bad;
end if;

insert into public.lessons (id, unit_id, position, title_es, objective_es, intro, takeaways, is_published)
select x.id, x.unit_id, x.position, x.title_es, x.objective_es, x.intro, x.takeaways, false
from jsonb_to_recordset(d -> 'lessons')
  as x(id text, unit_id text, position smallint, title_es text, objective_es text, intro jsonb, takeaways text[])
on conflict (id) do nothing;

select string_agg(x.id, ', ') into v_bad
from jsonb_to_recordset(d -> 'lessons')
  as x(id text, unit_id text, position smallint, title_es text, objective_es text, intro jsonb, takeaways text[])
join public.lessons l on l.id = x.id
where (l.unit_id, l.position, l.title_es, l.objective_es, l.intro, l.takeaways)
   is distinct from (x.unit_id, x.position, x.title_es, x.objective_es, x.intro, x.takeaways);
if v_bad is not null then
  raise exception 'planned_units: lecciones ya cargadas con otros datos: %', v_bad;
end if;
${CATALOG_BEFORE_EXERCISES_SQL()}

insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer, accepted_answers,
  explanation_es, difficulty, recommended_seconds, is_published, ${EXERCISE_CATALOG_COLUMNS})
select x.id, x.lesson_id, x.position, x.type, x.skill, x.prompt_es, x.payload, x.answer, x.accepted_answers,
  x.explanation_es, x.difficulty, x.recommended_seconds, false, ${EXERCISE_CATALOG_VALUES}
from jsonb_to_recordset(d -> 'exercises')
  as x(id text, lesson_id text, position smallint, type text, skill text, prompt_es text, payload jsonb, answer text,
       accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint)${EXERCISE_CATALOG_JOINS}
on conflict (id) do nothing;

select string_agg(x.id, ', ') into v_bad
from jsonb_to_recordset(d -> 'exercises')
  as x(id text, lesson_id text, position smallint, type text, skill text, prompt_es text, payload jsonb, answer text,
       accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint)
join public.exercises e on e.id = x.id
where (e.lesson_id, e.position, e.type, e.skill, e.prompt_es, e.payload, e.answer, e.accepted_answers,
       e.explanation_es, e.difficulty, e.recommended_seconds)
   is distinct from (x.lesson_id, x.position, x.type, x.skill, x.prompt_es, x.payload, x.answer, x.accepted_answers,
       x.explanation_es, x.difficulty, x.recommended_seconds);
if v_bad is not null then
  raise exception 'planned_units: ejercicios ya cargados con otro contenido: %', v_bad;
end if;

insert into public.exercise_words (exercise_id, word_id)
select x ->> 'id', w
from jsonb_array_elements(d -> 'exercises') x, jsonb_array_elements_text(x -> 'words') w
on conflict do nothing;
${CATALOG_AFTER_EXERCISES_SQL()}
end
$polygo_content$;
`;
  return { sql, document };
}

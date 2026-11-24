import type { PathUnit } from '../content';
import {
  CATALOG_AFTER_EXERCISES_SQL,
  CATALOG_BEFORE_EXERCISES_SQL,
  catalogPayload,
  EXERCISE_CATALOG_COLUMNS,
  EXERCISE_CATALOG_JOINS,
  EXERCISE_CATALOG_VALUES,
} from './catalog-sql';
import { contentDocument, type CatalogDefs } from './content-document';

/** Falla si el contenido contiene los delimitadores del bloque DO. */
export function assertNoDelimiters(payload: string) {
  if (payload.includes('$content$') || payload.includes('$polygo_content$'))
    throw new Error(
      'El contenido no puede incluir los delimitadores $content$ ni $polygo_content$',
    );
}

/**
 * Migración SQL idempotente con el contenido de un tramo del currículo (la usa
 * scripts/build-content-sql.ts y la prueban supabase/tests/items.test.mjs).
 *
 * El contenido viaja como un único documento JSON dentro de un bloque DO, sin sentencias destructivas.
 * - Unidades, lecciones, palabras y ejercicios quedan publicados; la revisión de la unidad sale de
 *   content (UnitDef.review, 'draft' por defecto) y las palabras quedan en 'draft'.
 * - Los ejercicios que ya no estén en el contenido se despublican (no se borran: conservan intentos).
 * - Catálogo de aprendizaje: conceptos léxicos de las palabras, ítems de los ejercicios y sus
 *   conceptos por dimensión, personas ficticias, objetivos y sus relaciones, y el ítem de cada
 *   ejercicio (`exercises.item_id`) (scripts/catalog-sql.ts).
 * - Versiones de los ítems (content/versions.ts, scripts/versions-sql.ts): una por (ítem, hash), la
 *   vigente de cada ítem y la de cada ubicación, con el checksum de la copia en exercises.
 * - Conjuntos de opciones (content/option-sets.ts, scripts/option-sets-sql.ts): el de cada ubicación de
 *   elección; si cambia, la asignación anterior queda en exercise_option_set_assignments.
 * - Orden: el catálogo, las versiones y los conjuntos se cargan antes de escribir exercises, así un
 *   ejercicio nuevo nace con su ítem, su versión y su conjunto (V8); las ubicaciones y los checksums,
 *   después.
 */
export function contentSql(path: readonly PathUnit[], defs: CatalogDefs = {}) {
  const levels = [...new Set(path.map((p) => `${p.language} ${p.level}`))].join(' y ');
  const document = contentDocument(path, defs);
  const { catalog, versions, optionSets, ...rows } = document;
  const payload = JSON.stringify({
    ...rows,
    catalog: catalogPayload(catalog, versions, optionSets),
  });
  assertNoDelimiters(payload);

  const sql = `-- =====================================================================
-- Contenido ${levels} generado por scripts/build-content-sql.ts. NO editar a mano:
-- editar content/*/*.ts, correr los tests (npm test) y regenerar.
-- ${document.units.length} unidades · ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios
-- Catálogo: ${catalog.concepts.length} conceptos · ${catalog.items.length} ítems · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · ${versions.placement_versions.length} ubicaciones con versión · ${versions.variable_options.length} ítems con las opciones fuera de la versión (V5)
-- Conjuntos de opciones: ${optionSets.option_sets.length} · ${optionSets.placement_option_sets.length} ubicaciones de elección
-- ${catalog.personas.length} personas · ${catalog.objectives.length} objetivos
-- =====================================================================

do $polygo_content$
declare
  d constant jsonb := $content$${payload}$content$::jsonb;
begin

insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji,
  objective_es, grammar, review_status, is_published)
select x.id, x.language_code, x.level, x.position, x.title_es, x.title_en, x.description_es, x.emoji,
  x.objective_es, x.grammar, x.review_status, true
from jsonb_to_recordset(d -> 'units')
  as x(id text, language_code text, level text, position smallint, title_es text, title_en text, description_es text,
       emoji text, objective_es text, grammar jsonb, review_status text)
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es, title_en = excluded.title_en,
  description_es = excluded.description_es, emoji = excluded.emoji, objective_es = excluded.objective_es,
  grammar = excluded.grammar, review_status = excluded.review_status, is_published = true;

insert into public.words (id, language_code, unit_id, text, translation_es, accepted_translations, ipa, romanization,
  emoji, example_en, example_es, difficulty, tags, is_published)
select x.id, x.language_code, x.unit_id, x.text, x.translation_es, x.accepted_translations, x.ipa, x.romanization,
  x.emoji, x.example_en, x.example_es, x.difficulty, x.tags, true
from jsonb_to_recordset(d -> 'words')
  as x(id text, language_code text, unit_id text, text text, translation_es text, accepted_translations text[],
       ipa text, romanization text, emoji text, example_en text, example_es text, difficulty smallint, tags text[])
on conflict (id) do update set unit_id = excluded.unit_id, text = excluded.text, translation_es = excluded.translation_es,
  accepted_translations = excluded.accepted_translations, ipa = excluded.ipa, romanization = excluded.romanization,
  emoji = excluded.emoji,
  example_en = excluded.example_en, example_es = excluded.example_es, difficulty = excluded.difficulty,
  tags = excluded.tags, is_published = true;

-- Las posiciones son únicas por unidad: liberarlas antes de reordenar (se intercalan lecciones).
update public.lessons set position = position + 1000
where id in (select x ->> 'id' from jsonb_array_elements(d -> 'lessons') x) and position < 1000;

insert into public.lessons (id, unit_id, position, title_es, objective_es, intro, takeaways, is_published)
select x.id, x.unit_id, x.position, x.title_es, x.objective_es, x.intro, x.takeaways, true
from jsonb_to_recordset(d -> 'lessons')
  as x(id text, unit_id text, position smallint, title_es text, objective_es text, intro jsonb, takeaways text[])
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es,
  objective_es = excluded.objective_es, intro = excluded.intro, takeaways = excluded.takeaways, is_published = true;
${CATALOG_BEFORE_EXERCISES_SQL()}

-- Las posiciones son únicas por lección: liberarlas antes de reordenar.
update public.exercises set position = position + 1000
where lesson_id in (select x ->> 'id' from jsonb_array_elements(d -> 'lessons') x);

insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer, accepted_answers,
  explanation_es, difficulty, recommended_seconds, is_published, ${EXERCISE_CATALOG_COLUMNS})
select x.id, x.lesson_id, x.position, x.type, x.skill, x.prompt_es, x.payload, x.answer, x.accepted_answers,
  x.explanation_es, x.difficulty, x.recommended_seconds, true, ${EXERCISE_CATALOG_VALUES}
from jsonb_to_recordset(d -> 'exercises')
  as x(id text, lesson_id text, position smallint, type text, skill text, prompt_es text, payload jsonb, answer text,
       accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint)${EXERCISE_CATALOG_JOINS}
on conflict (id) do update set lesson_id = excluded.lesson_id, position = excluded.position, type = excluded.type,
  skill = excluded.skill, prompt_es = excluded.prompt_es, payload = excluded.payload, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, explanation_es = excluded.explanation_es,
  difficulty = excluded.difficulty, recommended_seconds = excluded.recommended_seconds, is_published = true;

-- Ejercicios retirados del contenido: se despublican y se corre su posición fuera del rango usado.
update public.exercises set is_published = false
where lesson_id in (select x ->> 'id' from jsonb_array_elements(d -> 'lessons') x)
  and id not in (select x ->> 'id' from jsonb_array_elements(d -> 'exercises') x);

-- Sin sentencias destructivas: sólo se agregan vínculos. Si se quita una palabra de un ejercicio,
-- el vínculo viejo debe borrarse con una migración escrita a mano.
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

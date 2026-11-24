import { CURRICULUM_PATH, unitId, type PathUnit } from '../content';
import { COMPREHENSION_OBJECTIVES, COMPREHENSION_PATH } from '../content/comprehension';
import type { ObjectiveDef } from '../content/objectives';
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
 * Migración de las lecciones «En contexto» de la fase C (docs/LEARNING_PHASE_C.md), generada por
 * scripts/build-comprehension-sql.ts. La prueban supabase/tests/comprehension.test.mjs.
 *
 * Diferencias con content:sql (scripts/content-sql.ts), que publica todo lo que carga:
 * - No toca las unidades escritas ni palabras: los ejercicios no usan palabras nuevas. Sólo crea las
 *   unidades planificadas del mapa (U13, U14: fase C.2), sin publicar y sin palabras.
 * - Carga la persona ficticia que citan las preguntas (content_personas, PERSONAS_SQL).
 * - Lecciones y ejercicios nacen con is_published = false y la migración nunca cambia ese valor: ni
 *   el camino de la app, ni learning_lesson_plan, ni is_lesson_unlocked los ven hasta que una
 *   revisión pedagógica los publique a mano (fuera de esta fase).
 * - Los ítems nacen en status = 'draft' (no 'active'): ninguna ruta de repasos los toma
 *   (review_item_candidates y sus variantes exigen ítems activos).
 * - Sin exercise_words: la comprensión no entra en el SRS léxico v1.
 * - Catálogo, objetivos (draft), versiones y conjuntos de opciones con las mismas plantillas que el
 *   resto del contenido (scripts/catalog-sql.ts): idempotente y aborta si algo ya cargado difiere.
 */
export function comprehensionSql(
  path: readonly PathUnit[] = COMPREHENSION_PATH,
  objectives: readonly ObjectiveDef[] = COMPREHENSION_OBJECTIVES,
) {
  const document = contentDocument(path, { objectives });
  const { catalog, versions, optionSets, lessons, exercises } = document;
  const base = catalogPayload(catalog, versions, optionSets);
  // Sólo las unidades planificadas (U13, U14): las escritas ya están cargadas y no se tocan.
  const written = new Set(CURRICULUM_PATH.map((p) => unitId(p.language, p.level, p.unit)));
  const units = document.units.filter((u) => !written.has(u.id));
  const payload = JSON.stringify({
    units,
    lessons,
    exercises: exercises.map(({ words: _words, ...e }) => e),
    catalog: {
      ...base,
      // Los conceptos léxicos ya existen (son las palabras del currículo cargado).
      concepts: [],
      items: base.items.map((i) => ({ ...i, status: 'draft' })),
    },
  });
  assertNoDelimiters(payload);
  const stimuli = new Set(
    exercises.flatMap((e) => {
      const p = e.payload as { type?: string; stimulus?: { id: string } };
      return p.type === 'context_choice' && p.stimulus ? [p.stimulus.id] : [];
    }),
  );

  const sql = `-- =====================================================================
-- Fase C: lecciones «En contexto» (comprensión lectora y auditiva) generadas por
-- scripts/build-comprehension-sql.ts. NO editar a mano: editar content/en/a1/context*.ts, correr
-- npm test y regenerar. Requiere 20261113120000_context_comprehension.sql. Idempotente: carga todo el
-- contenido de la fase C, así que reaplica sin cambios lo que ya cargó una migración anterior de la fase.
-- ${lessons.length} lecciones (sin publicar) · ${exercises.length} preguntas · ${stimuli.size} estímulos
-- Catálogo: ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
-- ${catalog.objectives.length} objetivos (draft) · ${catalog.lesson_objectives.length} lecciones-objetivo · ${catalog.item_objectives.length} ítems-objetivo
-- ${units.length} unidades planificadas sin publicar (${units.map((u) => u.id).join(', ') || 'ninguna'}) · ${catalog.personas.length} personas ficticias
-- Sin palabras ni exercise_words. No publica nada.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/comprehension.test.mjs). NO aplicada en
-- producción.
-- =====================================================================

do $polygo_content$
declare
  d constant jsonb := $content$${payload}$content$::jsonb;
begin

-- Unidades planificadas (sin lecciones escritas todavía): sin publicar y sin palabras. Reaplicar no
-- cambia is_published; la posición es provisional (el orden del mapa necesita separar id y posición).
insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji,
  objective_es, grammar, review_status, is_published)
select x.id, x.language_code, x.level, x.position, x.title_es, x.title_en, x.description_es, x.emoji,
  x.objective_es, x.grammar, x.review_status, false
from jsonb_to_recordset(d -> 'units')
  as x(id text, language_code text, level text, position smallint, title_es text, title_en text, description_es text,
       emoji text, objective_es text, grammar jsonb, review_status text)
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es, title_en = excluded.title_en,
  description_es = excluded.description_es, emoji = excluded.emoji, objective_es = excluded.objective_es,
  grammar = excluded.grammar, review_status = excluded.review_status;

if exists (select 1 from jsonb_to_recordset(d -> 'lessons') as x(unit_id text)
           where not exists (select 1 from public.curriculum_units u where u.id = x.unit_id)) then
  raise exception 'comprehension: falta la unidad de una lección en contexto';
end if;

-- Lecciones sin publicar. Reaplicar no cambia is_published (una publicación posterior no se revierte).
insert into public.lessons (id, unit_id, position, title_es, objective_es, intro, takeaways, is_published)
select x.id, x.unit_id, x.position, x.title_es, x.objective_es, x.intro, x.takeaways, false
from jsonb_to_recordset(d -> 'lessons')
  as x(id text, unit_id text, position smallint, title_es text, objective_es text, intro jsonb, takeaways text[])
on conflict (id) do update set position = excluded.position, title_es = excluded.title_es,
  objective_es = excluded.objective_es, intro = excluded.intro, takeaways = excluded.takeaways;
${CATALOG_BEFORE_EXERCISES_SQL()}

insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer, accepted_answers,
  explanation_es, difficulty, recommended_seconds, is_published, ${EXERCISE_CATALOG_COLUMNS})
select x.id, x.lesson_id, x.position, x.type, x.skill, x.prompt_es, x.payload, x.answer, x.accepted_answers,
  x.explanation_es, x.difficulty, x.recommended_seconds, false, ${EXERCISE_CATALOG_VALUES}
from jsonb_to_recordset(d -> 'exercises')
  as x(id text, lesson_id text, position smallint, type text, skill text, prompt_es text, payload jsonb, answer text,
       accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint)${EXERCISE_CATALOG_JOINS}
on conflict (id) do update set lesson_id = excluded.lesson_id, position = excluded.position, type = excluded.type,
  skill = excluded.skill, prompt_es = excluded.prompt_es, payload = excluded.payload, answer = excluded.answer,
  accepted_answers = excluded.accepted_answers, explanation_es = excluded.explanation_es,
  difficulty = excluded.difficulty, recommended_seconds = excluded.recommended_seconds;
${CATALOG_AFTER_EXERCISES_SQL()}
end
$polygo_content$;
`;
  return { sql, document };
}

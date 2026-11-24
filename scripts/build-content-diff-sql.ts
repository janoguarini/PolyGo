/**
 * Migración con sólo lo que cambió del contenido respecto de una foto anterior
 * (scripts/dump-content.ts). Mucho más chica que regenerar unidades enteras y corrige los
 * vínculos ejercicio→palabra sin DELETE: si en una posición la palabra pasa de «hotel» a
 * «hospital», el vínculo se actualiza (la regeneración completa sólo agrega vínculos y dejaría
 * el viejo, acreditando los repasos a la palabra equivocada).
 *
 * Uso: npm run content:diff -- antes.json supabase/migrations/<timestamp>_content_fix.sql
 *
 * Limitaciones (falla con un mensaje en vez de generar algo incorrecto): no agrega ni quita
 * unidades, lecciones ni palabras, y un ejercicio no puede perder palabras.
 *
 * Catálogo de aprendizaje: incluye los ítems de los ejercicios cambiados o nuevos y los conceptos de
 * las palabras cambiadas, con la misma clasificación que el backfill y content:sql
 * (content/catalog.ts). Un ítem no cambia nunca (arquitectura de datos §5): si un ejercicio cambia de
 * tipo, modo, conceptos target o privacidad bajo el mismo id, falla y explica qué id nuevo hace
 * falta (content/ids.lock.json, docs/LEARNING_CATALOG_PHASE1.md §2).
 *
 * Versiones (content/versions.ts): las de los ítems de los ejercicios cambiados o nuevos. Un
 * contenido nuevo es una versión nueva y pasa a ser la vigente; si vuelve a uno anterior, se
 * reutiliza esa versión (scripts/versions-sql.ts).
 */
import { readFileSync, writeFileSync } from 'node:fs';

import {
  CATALOG_AFTER_EXERCISES_SQL,
  CATALOG_BEFORE_EXERCISES_SQL,
  catalogPayload,
  EXERCISE_CATALOG_COLUMNS,
  EXERCISE_CATALOG_JOINS,
  EXERCISE_CATALOG_VALUES,
  optionSetsOf,
  versionsOf,
} from './catalog-sql';
import { contentDocument, type ContentDocument } from './content-document';
import { assertNoDelimiters } from './content-sql';
import { assertContentCatalog } from './ids-lock-file';

const [beforeFile, out] = process.argv.slice(2);
if (!beforeFile || !out) {
  console.error('Uso: npm run content:diff -- <antes.json> <archivo.sql>');
  process.exit(1);
}

const before = JSON.parse(readFileSync(beforeFile, 'utf8')) as ContentDocument;
const after = contentDocument();

type Row = { id: string };
const changedRows = <T extends Row>(old: readonly T[], next: readonly T[], what: string): T[] => {
  const oldById = new Map(old.map((r) => [r.id, JSON.stringify(r)]));
  const nextIds = new Set(next.map((r) => r.id));
  const missing = old.filter((r) => !nextIds.has(r.id)).map((r) => r.id);
  const added = next.filter((r) => !oldById.has(r.id)).map((r) => r.id);
  if (what !== 'exercises' && (missing.length || added.length)) {
    throw new Error(
      `${what}: hay altas o bajas (${[...added, ...missing].join(', ')}); usá content:sql`,
    );
  }
  return next.filter((r) => oldById.get(r.id) !== JSON.stringify(r));
};

const units = changedRows(before.units, after.units, 'units');
const lessons = changedRows(before.lessons, after.lessons, 'lessons');
const words = changedRows(before.words, after.words, 'words');
const exercises = changedRows(before.exercises, after.exercises, 'exercises');
if (units.length || lessons.length) {
  throw new Error('Cambiaron unidades o lecciones: usá content:sql para esas unidades');
}

const oldExercises = new Map(before.exercises.map((e) => [e.id, e]));
const removed = before.exercises
  .filter((e) => !after.exercises.some((n) => n.id === e.id))
  .map((e) => e.id);

// Vínculos: dentro de cada ejercicio, las palabras que salen se reemplazan por las que entran.
const relinks: { exercise_id: string; old_word: string; new_word: string }[] = [];
const newLinks: { exercise_id: string; word_id: string }[] = [];
for (const e of exercises) {
  const old = oldExercises.get(e.id);
  if (!old) {
    for (const w of e.words) newLinks.push({ exercise_id: e.id, word_id: w });
    continue;
  }
  const gone = old.words.filter((w) => !e.words.includes(w)).sort();
  const come = e.words.filter((w) => !old.words.includes(w)).sort();
  if (gone.length > come.length) {
    throw new Error(
      `${e.id} pierde palabras (${gone.join(', ')}): requiere borrar vínculos a mano`,
    );
  }
  gone.forEach((w, i) => relinks.push({ exercise_id: e.id, old_word: w, new_word: come[i]! }));
  for (const w of come.slice(gone.length)) newLinks.push({ exercise_id: e.id, word_id: w });
}

// Catálogo: ítems de los ejercicios cambiados o nuevos, con sus conceptos.
// Un ítem no cambia (§5): el registro de ids detecta cambios de tipo, modo, conceptos target o
// privacidad bajo el mismo id y pide un id nuevo explícito (content/ids-lock.ts).
assertContentCatalog(after.catalog);
const itemOf = new Map(after.catalog.placements.map((p) => [p.exercise_id, p.item_id]));
const itemIds = new Set(exercises.flatMap((e) => itemOf.get(e.id) ?? []));
const wordIds = new Set(words.map((w) => w.id));
// Ubicaciones: las de los ejercicios cambiados o nuevos. Personas y objetivos: completos (son pocos y
// la carga es idempotente), así un cambio en content/personas.ts o content/objectives.ts también entra.
const changedIds = new Set(exercises.map((e) => e.id));
const versions = versionsOf(after.versions, itemIds, changedIds);
// Conjuntos: los de las ubicaciones cambiadas o nuevas. Si cambian las opciones, entra un conjunto
// nuevo y la asignación anterior queda en la historia (scripts/option-sets-sql.ts).
const optionSets = optionSetsOf(after.optionSets, itemIds, changedIds);
const catalog = catalogPayload(
  {
    ...after.catalog,
    concepts: after.catalog.concepts.filter((c) => wordIds.has(c.id)),
    items: after.catalog.items.filter((i) => itemIds.has(i.id)),
    item_concepts: after.catalog.item_concepts.filter((r) => itemIds.has(r.item_id)),
    placements: after.catalog.placements.filter((p) => changedIds.has(p.exercise_id)),
  },
  versions,
  optionSets,
);

const document = { words, exercises, removed, relinks, newLinks, catalog };
const payload = JSON.stringify(document);
assertNoDelimiters(payload);

const sql = `-- =====================================================================
-- Diferencia de contenido generada por scripts/build-content-diff-sql.ts. NO editar a mano.
-- ${words.length} palabras · ${exercises.length} ejercicios · ${removed.length} retirados · ${relinks.length} vínculos corregidos
-- Catálogo: ${catalog.concepts.length} conceptos · ${catalog.items.length} ítems · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · ${versions.placement_versions.length} ubicaciones con versión · ${versions.variable_options.length} ítems con las opciones fuera de la versión (V5)
-- Conjuntos de opciones: ${optionSets.option_sets.length} · ${optionSets.placement_option_sets.length} ubicaciones de elección
-- ${catalog.personas.length} personas · ${catalog.objectives.length} objetivos
-- =====================================================================

do $polygo_content$
declare
  d constant jsonb := $content$${payload}$content$::jsonb;
begin

update public.words w set unit_id = x.unit_id, text = x.text, translation_es = x.translation_es,
  accepted_translations = x.accepted_translations, ipa = x.ipa, emoji = x.emoji,
  example_en = x.example_en, example_es = x.example_es, difficulty = x.difficulty, tags = x.tags
from jsonb_to_recordset(d -> 'words')
  as x(id text, unit_id text, text text, translation_es text, accepted_translations text[], ipa text, emoji text,
       example_en text, example_es text, difficulty smallint, tags text[])
where w.id = x.id;
${CATALOG_BEFORE_EXERCISES_SQL()}

-- Las posiciones son únicas por lección: liberarlas antes de reordenar.
update public.exercises set position = position + 1000
where id in (select x ->> 'id' from jsonb_array_elements(d -> 'exercises') x);

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

update public.exercises set is_published = false, position = position + 1000
where id in (select jsonb_array_elements_text(d -> 'removed')) and position < 1000;

update public.exercise_words ew set word_id = x.new_word
from jsonb_to_recordset(d -> 'relinks') as x(exercise_id text, old_word text, new_word text)
where ew.exercise_id = x.exercise_id and ew.word_id = x.old_word
  -- Reaplicada, ya no encuentra el vínculo viejo (o el nuevo ya existe): no hace nada.
  and not exists (select 1 from public.exercise_words n where n.exercise_id = x.exercise_id and n.word_id = x.new_word);

insert into public.exercise_words (exercise_id, word_id)
select x.exercise_id, x.word_id
from jsonb_to_recordset(d -> 'newLinks') as x(exercise_id text, word_id text)
on conflict do nothing;
${CATALOG_AFTER_EXERCISES_SQL()}
end
$polygo_content$;
`;

writeFileSync(out, sql, 'utf8');
console.log(
  `OK ${out}: ${words.length} palabras, ${exercises.length} ejercicios, ${removed.length} retirados, ` +
    `${relinks.length} vínculos corregidos, ${Buffer.byteLength(sql)} bytes`,
);

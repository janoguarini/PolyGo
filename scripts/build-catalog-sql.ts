/**
 * Migración con sólo el catálogo de aprendizaje del contenido ya cargado: el backfill de la fase 1
 * (arquitectura de datos rev. 8, §18). No toca unidades, lecciones, palabras, contenido de ejercicios
 * ni vínculos.
 *
 * Uso: npm run content:catalog -- supabase/migrations/<timestamp>_learning_items_en.sql --language en
 *        [--language it,pt] [--exclude-loaded <migración.sql> ...] [--only placements|versions|option-sets]
 *
 * Sin --only: conceptos léxicos, ítems y sus conceptos, personas, objetivos con sus relaciones, el
 * ítem de cada ejercicio (exercises.item_id) y las versiones, en ese orden (scripts/catalog-sql.ts).
 *
 * --exclude-loaded: deja afuera los conceptos, ítems, conceptos de ítems, ubicaciones y versiones de
 * los ítems que ya trae otra migración del catálogo (su documento jsonb), para escribir sólo lo que
 * falta sin reescribir migraciones existentes (así se generó 20261107140100_learning_items_match_pairs.sql).
 *
 * --only placements: sólo exercises.item_id de todos los ejercicios de esos idiomas, para el backfill
 * de las ubicaciones sobre ítems ya cargados (así se generó 20261107150100_learning_item_placements.sql).
 *
 * --only versions: sólo las versiones de los ítems de esos idiomas (content/versions.ts), la vigente de
 * cada ítem y la de cada ubicación, sobre ítems y ubicaciones ya cargados (así se generaron
 * 20261108120101…04_learning_item_versions_<idioma>.sql). Incluye los 176 ítems de distractores
 * variables, con payload.options fuera de la versión (V5 (a)).
 *
 * --only option-sets: sólo los conjuntos de opciones (content/option-sets.ts) y el de cada ubicación de
 * elección, sobre versiones ya cargadas (así se generaron
 * 20261108130101…04_learning_option_sets_<idioma>.sql).
 *
 * Idempotente: reaplicarla no cambia nada, y aborta si algo ya cargado difiere (scripts/catalog-sql.ts,
 * scripts/versions-sql.ts). Antes de escribir exige que el currículo respete content/ids.lock.json y
 * que objetivos, personas, orígenes y versiones sean válidos (scripts/ids-lock-file.ts). Determinista:
 * no sortea ids ni usa la hora.
 */
import { readFileSync, writeFileSync } from 'node:fs';

import { CURRICULUM_PATH } from '../content';
import type { Catalog } from '../content/catalog';
import {
  catalogPayload,
  FULL_CATALOG_SQL,
  optionSetsOf,
  optionSetsPayload,
  PLACEMENTS_SQL,
  versionsOf,
  versionsPayload,
} from './catalog-sql';
import { contentDocument } from './content-document';
import { assertNoDelimiters } from './content-sql';
import { assertContentCatalog } from './ids-lock-file';
import { OPTION_SETS_SQL } from './option-sets-sql';
import { VERSIONS_SQL } from './versions-sql';

const args = process.argv.slice(2);
const out = args[0];
const valuesOf = (flag: string) =>
  args.flatMap((a, i) => (args[i - 1] === flag ? a.split(',') : [])).filter(Boolean);
const languages = valuesOf('--language');
const only = valuesOf('--only')[0];
const exclude = (() => {
  const i = args.indexOf('--exclude-loaded');
  if (i < 0) return [];
  const next = args.findIndex((a, j) => j > i && a.startsWith('--'));
  return args.slice(i + 1, next < 0 ? undefined : next);
})();
if (
  !out ||
  out.startsWith('--') ||
  languages.length === 0 ||
  (only !== undefined && only !== 'placements' && only !== 'versions' && only !== 'option-sets') ||
  (only && exclude.length)
) {
  console.error(
    'Uso: npm run content:catalog -- <archivo.sql> --language <código>[,<código>] ' +
      '[--exclude-loaded <migración.sql> ...] [--only placements|versions|option-sets]',
  );
  process.exit(1);
}

const path = CURRICULUM_PATH.filter((p) => languages.includes(p.language));
for (const l of languages) {
  if (!path.some((p) => p.language === l)) throw new Error(`Idioma ${l} sin contenido`);
}

assertContentCatalog();

/** Documento del catálogo que trae una migración generada (entre $content$ … $content$). */
function loadedCatalog(file: string): ReturnType<typeof catalogPayload> {
  const sql = readFileSync(file, 'utf8');
  const m = /\$content\$([\s\S]*?)\$content\$/.exec(sql);
  if (!m) throw new Error(`${file}: no es una migración generada del catálogo`);
  const doc = JSON.parse(m[1]!) as { catalog?: ReturnType<typeof catalogPayload> };
  if (!doc.catalog) throw new Error(`${file}: sin catálogo`);
  return doc.catalog;
}

const document = contentDocument(path);
const full = document.catalog;
let catalog: Catalog = full;
let versions = document.versions;
let optionSets = document.optionSets;
if (only) {
  catalog = {
    ...full,
    concepts: [],
    items: [],
    item_concepts: [],
    lessons: [],
    personas: [],
    objectives: [],
    objective_concepts: [],
    lesson_objectives: [],
    item_objectives: [],
  };
} else if (exclude.length) {
  const loaded = exclude.map(loadedCatalog);
  const concepts = new Set(loaded.flatMap((c) => c.concepts.map((x) => x.id)));
  const items = new Set(loaded.flatMap((c) => c.items.map((x) => x.id)));
  catalog = {
    ...full,
    concepts: full.concepts.filter((c) => !concepts.has(c.id)),
    items: full.items.filter((i) => !items.has(i.id)),
    item_concepts: full.item_concepts.filter((r) => !items.has(r.item_id)),
    placements: full.placements.filter((p) => !items.has(p.item_id)),
  };
  versions = versionsOf(versions, new Set(catalog.items.map((i) => i.id)));
  optionSets = optionSetsOf(optionSets, new Set(catalog.items.map((i) => i.id)));
}

const payload =
  only === 'versions'
    ? JSON.stringify({ catalog: versionsPayload(versions) })
    : only === 'option-sets'
      ? JSON.stringify({ catalog: optionSetsPayload(optionSets) })
      : only === 'placements'
        ? JSON.stringify({ catalog: catalogPayload(catalog) })
        : JSON.stringify({ catalog: catalogPayload(catalog, versions, optionSets) });
assertNoDelimiters(payload);

const tally = (keys: string[]) =>
  Object.entries(
    keys.reduce<Record<string, number>>((acc, k) => {
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, n]) => `${k} ${n}`)
    .join(', ');
const byType = tally(catalog.items.map((i) => `${i.origin} ${i.type}`));
const byPlacement = tally(catalog.placements.map((p) => p.kind));
const excluded = exclude.length
  ? ` (sin lo que ya cargan ${exclude.map((f) => f.split(/[\\/]/).pop()).join(', ')})`
  : '';
const itemById = new Map(full.items.map((i) => [i.id, i]));
const kindOf = new Map(full.placements.map((p) => [p.exercise_id, p.kind]));
const variablePlacements = versions.variable_options.reduce((n, h) => n + h.exercises.length, 0);
const variableItems = new Set(versions.variable_options.map((h) => h.item_id));

const headers = {
  placements: `-- Ubicaciones de ${languages.join(', ')}: el ítem de cada ejercicio (exercises.item_id; fase 1,
-- arquitectura de datos rev. 8, §5 y §18), generado por scripts/build-catalog-sql.ts --only placements.
-- NO editar a mano.
-- ${catalog.placements.length} ejercicios: ${byPlacement}
-- Las copias de la consolidación apuntan al ítem escrito original. Las versiones (item_version_id) no se
-- cargan: esperan aprobación (docs/EXERCISE_ITEM_VERSIONS_PENDING.md).
-- Requiere 20261107150000_learning_item_versions.sql y los ítems ya cargados.
-- ESTADO: probada en PGlite (supabase/tests/versions.test.mjs). NO aplicada en producción.`,
  versions: `-- Versiones de los ítems de ${languages.join(', ')} (exercise_item_versions; arquitectura de datos rev. 8,
-- §5 y §8; decisiones V1–V7 de docs/EXERCISE_ITEM_VERSIONS_PENDING.md), generado por
-- scripts/build-catalog-sql.ts --only versions. NO editar a mano.
-- ${versions.versions.length} versiones: ${tally(versions.versions.map((v) => `${itemById.get(v.item_id)!.origin} ${itemById.get(v.item_id)!.type}`))}
-- ${versions.placement_versions.length} ubicaciones con versión: ${tally(versions.placement_versions.map((p) => kindOf.get(p.exercise_id)!))}
-- Distractores variables (V5 (a)): ${versions.variable_options.length} ítems con payload.options fuera de la versión, ${variablePlacements} ubicaciones
-- (content/variable-options.ts); sus opciones van en los conjuntos (--only option-sets).
-- content_hash: v1 = sha256 del JSON canónico RFC 8785 en NFC (content/canonical-json.ts), calculado en Node.
-- Requiere 20261108120000_learning_grading_modes.sql, los ítems y las ubicaciones ya cargados.
-- ESTADO: probada en PGlite (supabase/tests/versions.test.mjs). NO aplicada en producción.`,
  'option-sets': `-- Conjuntos de opciones de ${languages.join(', ')} (exercise_option_sets; decisiones V5.1–V5.3 de
-- docs/EXERCISE_ITEM_VERSIONS_PENDING.md §5), generado por scripts/build-catalog-sql.ts --only option-sets.
-- NO editar a mano.
-- ${optionSets.option_sets.length} conjuntos (${optionSets.option_sets.filter((s) => variableItems.has(s.item_id)).length} de ítems de distractores variables) · ${optionSets.placement_option_sets.length} ubicaciones de elección con conjunto
-- Por tipo: ${tally(optionSets.placement_option_sets.map((p) => itemById.get(p.item_id)!.type))}
-- options_hash: v1 = sha256 del JSON canónico RFC 8785 de {format, options, answer_index}, calculado en Node.
-- Requiere 20261108130000_learning_option_sets.sql y las versiones ya cargadas.
-- ESTADO: probada en PGlite (supabase/tests/presentations.test.mjs). NO aplicada en producción.`,
  full: `-- Catálogo de aprendizaje de ${languages.join(', ')} (fase 1, arquitectura de datos rev. 8, §18),
-- generado por scripts/build-catalog-sql.ts. NO editar a mano.
-- ${catalog.concepts.length} conceptos léxicos · ${catalog.items.length} ítems · ${catalog.item_concepts.length} conceptos de ítems
-- ${catalog.placements.length} ejercicios ubicados en estos ítems${excluded}
-- Ítems: ${byType || 'ninguno'}
-- ${versions.versions.length} versiones · ${optionSets.option_sets.length} conjuntos de opciones
-- ${catalog.personas.length} personas · ${catalog.objectives.length} objetivos
-- Requiere las migraciones de esquema de la fase 1 (20261107120000 a 20261108130000).`,
};

const body =
  only === 'placements'
    ? PLACEMENTS_SQL
    : only === 'versions'
      ? VERSIONS_SQL
      : only === 'option-sets'
        ? OPTION_SETS_SQL
        : FULL_CATALOG_SQL();

const sql = `-- =====================================================================
${headers[(only ?? 'full') as keyof typeof headers]}
-- =====================================================================

do $polygo_content$
declare
  d constant jsonb := $content$${payload}$content$::jsonb;
begin
${body}
end
$polygo_content$;
`;

writeFileSync(out, sql, 'utf8');
console.log(
  `OK ${out}: ${catalog.items.length} ítems, ${catalog.item_concepts.length} conceptos de ítems, ` +
    `${catalog.placements.length} ubicaciones, ${versions.versions.length} versiones ` +
    `(${versions.variable_options.length} con opciones fuera), ${optionSets.option_sets.length} conjuntos, ` +
    `${catalog.objectives.length} objetivos, ` +
    `${catalog.personas.length} personas, ${Buffer.byteLength(sql)} bytes`,
);

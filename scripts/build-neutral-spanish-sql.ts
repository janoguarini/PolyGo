/**
 * Español neutro en el contenido ya cargado (docs/NEUTRAL_SPANISH.md): migración diferencial de los
 * textos en español de TODOS los tramos de content/ (el mismo registro que content/ids.lock.json,
 * ITEM_REGISTRY_PATH), sin altas ni bajas y sin tocar publicación ni estado.
 *
 *   1. Antes de editar content/:  npm run content:neutral -- dump <antes.json>
 *   2. Editar content/ y correr npm test.
 *   3. Generar:                   npm run content:neutral -- diff <antes.json> <migración.sql>
 *
 * Qué cambia y qué no (para conservar el progreso y el repaso espaciado):
 * - Unidades, lecciones, palabras y objetivos: UPDATE sólo de los campos de texto. Ids, posiciones,
 *   idioma, nivel, publicación y estado quedan igual.
 * - Ejercicios (ubicaciones): mismo id, misma lección, posición, tipo y habilidad; se actualizan la
 *   consigna, el payload, la respuesta, las aceptadas y la explicación. `is_published` no cambia.
 * - Ítems: el mismo `item_id` (un ítem no cambia, arquitectura de datos §5). El texto nuevo es una
 *   versión nueva (version = máx + 1) que pasa a ser la vigente; las versiones anteriores quedan,
 *   así los intentos guardados (exercise_attempts.item_version_id) siguen apuntando a la que se
 *   respondió. El repaso espaciado (user_word_progress, user_concept_state) depende de la palabra y
 *   del concepto, que no cambian.
 * - Sin DELETE. Falla con un mensaje si cambia algo fuera de los textos (tipo, habilidad, palabras
 *   vinculadas, ids), en vez de generar algo incorrecto.
 */
import { readFileSync, writeFileSync } from 'node:fs';

import { CURRICULUM_PATH, type PathUnit } from '../content';
import { A2_EXPANSION_PATH } from '../content/a2-expansion';
import { B1_PATH } from '../content/b1';
import { B2_PATH } from '../content/b2';
import { COMPREHENSION_OBJECTIVES, COMPREHENSION_PATH } from '../content/comprehension';
import { ES_PATH } from '../content/es-course';
import { FR_PATH } from '../content/fr-course';
import { IT_PATH } from '../content/it-course';
import type { ObjectiveDef } from '../content/objectives';
import { PLANNED_PATH } from '../content/planned';
import { PLANNED_OBJECTIVES } from '../content/planned-objectives';
import { PT_PATH } from '../content/pt-course';
import { SUPPLEMENT_PATH } from '../content/supplement';
import { ZH_PATH } from '../content/zh-course';
import { optionSetsOf, optionSetsPayload, versionsOf, versionsPayload } from './catalog-sql';
import { contentDocument, type ContentDocument } from './content-document';
import { assertNoDelimiters } from './content-sql';
import { OPTION_SETS_INSERT_SQL, OPTION_SETS_PLACE_SQL } from './option-sets-sql';
import { VERSIONS_INSERT_SQL, VERSIONS_PLACE_SQL } from './versions-sql';

/** Cada tramo con el documento que usó su generador (scripts/build-*-sql.ts). */
export const TRANCHES: Record<
  string,
  { path: readonly PathUnit[]; objectives?: readonly ObjectiveDef[] }
> = {
  curriculum: { path: CURRICULUM_PATH },
  comprehension: { path: COMPREHENSION_PATH, objectives: COMPREHENSION_OBJECTIVES },
  planned: { path: PLANNED_PATH, objectives: PLANNED_OBJECTIVES },
  supplement: { path: SUPPLEMENT_PATH, objectives: [] },
  a2: { path: A2_EXPANSION_PATH, objectives: [] },
  b1: { path: B1_PATH, objectives: [] },
  b2: { path: B2_PATH, objectives: [] },
  pt: { path: PT_PATH, objectives: [] },
  it: { path: IT_PATH, objectives: [] },
  zh: { path: ZH_PATH, objectives: [] },
  fr: { path: FR_PATH, objectives: [] },
  es: { path: ES_PATH, objectives: [] },
};

export type Snapshot = Record<string, ContentDocument>;

export function snapshot(): Snapshot {
  return Object.fromEntries(
    Object.entries(TRANCHES).map(([name, t]) => [
      name,
      contentDocument(t.path, t.objectives ? { objectives: t.objectives } : {}),
    ]),
  );
}

/** Campos que la neutralización puede cambiar; el resto tiene que quedar idéntico. */
export const TEXT_FIELDS = {
  units: ['title_es', 'description_es', 'objective_es', 'grammar'],
  lessons: ['title_es', 'objective_es', 'intro', 'takeaways'],
  words: ['translation_es', 'accepted_translations', 'example_es'],
  exercises: ['prompt_es', 'payload', 'answer', 'accepted_answers', 'explanation_es'],
  objectives: ['can_do_es', 'description_es'],
} as const;
type Table = keyof typeof TEXT_FIELDS;

type Row = { id: string } & Record<string, unknown>;

const rowsOf = (doc: ContentDocument, table: Table): Row[] =>
  (table === 'objectives' ? doc.catalog.objectives : doc[table]) as unknown as Row[];

/** Filas de todos los tramos por id; un mismo id en dos tramos tiene que ser idéntico. */
function union(snap: Snapshot, table: Table): Map<string, Row> {
  const out = new Map<string, Row>();
  const seenIn = new Map<string, string>();
  for (const [tranche, doc] of Object.entries(snap)) {
    for (const r of rowsOf(doc, table)) {
      const prev = out.get(r.id);
      if (!prev) {
        out.set(r.id, r);
        seenIn.set(r.id, tranche);
        continue;
      }
      // Las lecciones «En contexto» repiten sus unidades sin palabras ni lecciones: sólo importan
      // los textos, que tienen que coincidir.
      const keys = TEXT_FIELDS[table] as readonly string[];
      for (const k of keys)
        if (JSON.stringify(prev[k]) !== JSON.stringify(r[k]))
          throw new Error(`${table} ${r.id}: ${k} distinto en ${seenIn.get(r.id)} y ${tranche}`);
    }
  }
  return out;
}

export interface NeutralPatch {
  units: Row[];
  lessons: Row[];
  words: Row[];
  exercises: Row[];
  objectives: Row[];
}

/** Lo que cambió entre la foto y el contenido actual, validando que sólo cambien textos. */
export function textPatch(before: Snapshot, after: Snapshot): NeutralPatch {
  const patch = {
    units: [],
    lessons: [],
    words: [],
    exercises: [],
    objectives: [],
  } as NeutralPatch;
  for (const table of Object.keys(TEXT_FIELDS) as Table[]) {
    const old = union(before, table);
    const next = union(after, table);
    const added = [...next.keys()].filter((id) => !old.has(id));
    const removed = [...old.keys()].filter((id) => !next.has(id));
    if (added.length || removed.length)
      throw new Error(`${table}: altas o bajas (${[...added, ...removed].slice(0, 5).join(', ')})`);
    const text = new Set<string>(TEXT_FIELDS[table]);
    for (const [id, n] of next) {
      const o = old.get(id)!;
      if (JSON.stringify(o) === JSON.stringify(n)) continue;
      const other = Object.keys({ ...o, ...n }).filter(
        (k) => !text.has(k) && JSON.stringify(o[k]) !== JSON.stringify(n[k]),
      );
      if (other.length) throw new Error(`${table} ${id}: cambió ${other.join(', ')} (sólo textos)`);
      patch[table].push(n);
    }
  }
  return patch;
}

/**
 * La identidad del catálogo no cambia: cada ubicación sigue siendo del mismo ítem y no aparecen ni
 * desaparecen ítems (un cambio de traducción no puede, p. ej., volver ambiguo un generado o hacerlo
 * coincidir con un escrito). Si pasa, hay que ajustar el texto en content/, no la migración.
 */
export function assertSameCatalog(before: Snapshot, after: Snapshot) {
  const placements = (s: Snapshot) => {
    const m = new Map<string, string>();
    for (const d of Object.values(s))
      for (const p of d.catalog.placements) m.set(p.exercise_id, p.item_id);
    return m;
  };
  const items = (s: Snapshot) =>
    new Set(Object.values(s).flatMap((d) => d.catalog.items.map((i) => i.id)));
  const [pb, pa] = [placements(before), placements(after)];
  const moved = [...pb]
    .filter(([e, i]) => pa.get(e) !== i)
    .map(([e, i]) => `${e}: ${i} → ${pa.get(e)}`);
  const [ib, ia] = [items(before), items(after)];
  const gone = [...ib].filter((i) => !ia.has(i));
  const born = [...ia].filter((i) => !ib.has(i));
  if (moved.length || gone.length || born.length || pa.size !== pb.size)
    throw new Error(
      `El catálogo cambió de identidad (corregir el texto en content/):\n` +
        [
          ...moved.slice(0, 10).map((m) => `  ubicación ${m}`),
          ...gone.map((i) => `  falta ${i}`),
          ...born.map((i) => `  nuevo ${i}`),
        ].join('\n'),
    );
}

export function neutralSql(before: Snapshot, after: Snapshot) {
  assertSameCatalog(before, after);
  const patch = textPatch(before, after);
  const changedIds = new Set(patch.exercises.map((e) => e.id));
  // Catálogo: versiones y conjuntos de las ubicaciones cambiadas, de todos los tramos.
  const versions = {
    versions: [],
    current_versions: [],
    placement_versions: [],
    variable_options: [],
  } as ReturnType<typeof versionsOf>;
  const optionSets = { option_sets: [], placement_option_sets: [] } as unknown as ReturnType<
    typeof optionSetsOf
  >;
  const seen = {
    v: new Set<string>(),
    cv: new Set<string>(),
    pv: new Set<string>(),
    os: new Set<string>(),
    pos: new Set<string>(),
  };
  for (const doc of Object.values(after)) {
    const itemOf = new Map(doc.catalog.placements.map((p) => [p.exercise_id, p.item_id]));
    const itemIds = new Set([...changedIds].flatMap((id) => itemOf.get(id) ?? []));
    if (!itemIds.size) continue;
    // Todas las ubicaciones de cada ítem tocado (no sólo las que cambiaron): así la versión y el
    // conjunto de cada una quedan fijados y verificados, y el documento coincide con el del generador.
    const v = versionsOf(doc.versions, itemIds);
    for (const r of v.versions)
      if (!seen.v.has(`${r.item_id}@${r.content_hash}`))
        (seen.v.add(`${r.item_id}@${r.content_hash}`), versions.versions.push(r));
    for (const r of v.current_versions)
      if (!seen.cv.has(r.item_id)) (seen.cv.add(r.item_id), versions.current_versions.push(r));
    for (const r of v.placement_versions)
      if (!seen.pv.has(r.exercise_id))
        (seen.pv.add(r.exercise_id), versions.placement_versions.push(r));
    const o = optionSetsOf(doc.optionSets, itemIds);
    for (const r of o.option_sets)
      if (!seen.os.has(`${r.item_id}@${r.options_hash}`))
        (seen.os.add(`${r.item_id}@${r.options_hash}`), optionSets.option_sets.push(r));
    for (const r of o.placement_option_sets)
      if (!seen.pos.has(r.exercise_id))
        (seen.pos.add(r.exercise_id), optionSets.placement_option_sets.push(r));
  }
  const document = {
    ...patch,
    catalog: { ...versionsPayload(versions), ...optionSetsPayload(optionSets) },
  };
  const payload = JSON.stringify(document);
  assertNoDelimiters(payload);

  const sql = `-- =====================================================================
-- Español neutro en el contenido de los cursos (docs/NEUTRAL_SPANISH.md). Generada por
-- scripts/build-neutral-spanish-sql.ts (diff contra la foto previa). NO editar a mano.
-- ${patch.units.length} unidades · ${patch.lessons.length} lecciones · ${patch.words.length} palabras · ${patch.exercises.length} ejercicios · ${patch.objectives.length} objetivos
-- Versiones nuevas: ${versions.versions.length} · ubicaciones con versión: ${versions.placement_versions.length} · conjuntos de opciones: ${optionSets.option_sets.length}
--
-- Sólo textos: mismos ids, posiciones, publicación y estado; sin altas, bajas ni DELETE. El texto
-- nuevo de cada ejercicio es una versión nueva de su ítem (las anteriores quedan para los intentos
-- guardados). El progreso y el repaso espaciado dependen de ids de lección, ubicación, palabra y
-- concepto, que no cambian. Reaplicable: una segunda corrida no cambia nada.
--
-- ESTADO: NO aplicada en producción.
-- =====================================================================

do $polygo_content$
declare
  d constant jsonb := $content$${payload}$content$::jsonb;
begin

update public.curriculum_units u set title_es = x.title_es, description_es = x.description_es, grammar = x.grammar,
  objective_es = x.objective_es
from jsonb_to_recordset(d -> 'units') as x(id text, title_es text, description_es text, objective_es text, grammar jsonb)
where u.id = x.id
  and (u.title_es, u.description_es, u.objective_es, u.grammar)
    is distinct from (x.title_es, x.description_es, x.objective_es, x.grammar);

update public.lessons l set title_es = x.title_es, objective_es = x.objective_es, intro = x.intro,
  takeaways = x.takeaways
from jsonb_to_recordset(d -> 'lessons') as x(id text, title_es text, objective_es text, intro jsonb, takeaways text[])
where l.id = x.id
  and (l.title_es, l.objective_es, l.intro, l.takeaways) is distinct from (x.title_es, x.objective_es, x.intro, x.takeaways);

update public.words w set translation_es = x.translation_es, accepted_translations = x.accepted_translations,
  example_es = x.example_es
from jsonb_to_recordset(d -> 'words') as x(id text, translation_es text, accepted_translations text[], example_es text)
where w.id = x.id
  and (w.translation_es, w.accepted_translations, w.example_es)
    is distinct from (x.translation_es, x.accepted_translations, x.example_es);

update public.learning_objectives o set can_do_es = x.can_do_es, description_es = x.description_es
from jsonb_to_recordset(d -> 'objectives') as x(id text, can_do_es text, description_es text)
where o.id = x.id
  and (o.can_do_es, o.description_es) is distinct from (x.can_do_es, x.description_es);
${VERSIONS_INSERT_SQL}${OPTION_SETS_INSERT_SQL}
update public.exercises e set prompt_es = x.prompt_es, payload = x.payload, answer = x.answer,
  accepted_answers = x.accepted_answers, explanation_es = x.explanation_es
from jsonb_to_recordset(d -> 'exercises')
  as x(id text, prompt_es text, payload jsonb, answer text, accepted_answers text[], explanation_es text)
where e.id = x.id
  and (e.prompt_es, e.payload, e.answer, e.accepted_answers, e.explanation_es)
    is distinct from (x.prompt_es, x.payload, x.answer, x.accepted_answers, x.explanation_es);
${VERSIONS_PLACE_SQL}${OPTION_SETS_PLACE_SQL}
end
$polygo_content$;
`;
  return { sql, patch, versions, optionSets };
}

const [mode, a, b] = process.argv.slice(2);
if (mode === 'dump' && a) {
  writeFileSync(a, JSON.stringify(snapshot()), 'utf8');
  console.log(`OK ${a}`);
} else if (mode === 'diff' && a && b) {
  const before = JSON.parse(readFileSync(a, 'utf8')) as Snapshot;
  const { sql, patch, versions } = neutralSql(before, snapshot());
  writeFileSync(b, sql, 'utf8');
  console.log(
    `OK ${b}: ${patch.units.length} unidades, ${patch.lessons.length} lecciones, ${patch.words.length} palabras, ` +
      `${patch.exercises.length} ejercicios, ${patch.objectives.length} objetivos, ${versions.versions.length} versiones, ` +
      `${Buffer.byteLength(sql)} bytes`,
  );
} else if (mode) {
  console.error(
    'Uso: npm run content:neutral -- dump <antes.json> | diff <antes.json> <archivo.sql>',
  );
  process.exit(1);
}

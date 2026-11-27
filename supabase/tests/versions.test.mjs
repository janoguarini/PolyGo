// Versiones de ítems y ubicaciones, probadas en PGlite (arquitectura de datos rev. 8, §5, §8 y §17;
// decisiones V1–V8 de docs/EXERCISE_ITEM_VERSIONS_PENDING.md). Migraciones:
// 20261107150000_learning_item_versions.sql, 20261107150100_learning_item_placements.sql,
// 20261108120000_learning_grading_modes.sql, 20261108120101…04_learning_item_versions_<idioma>.sql y
// 20261108140000_learning_versions_required.sql (V8 y V8.1).
// Las pruebas que cargan contenido de prueba lo hacen dentro de transacciones que se revierten.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { CURRICULUM_PATH } from '../../content/index.ts';
import { VARIABLE_OPTION_ITEMS } from '../../content/variable-options.ts';
import { versionHash } from '../../content/versions.ts';
import { contentDocument } from '../../scripts/content-document.ts';
import { COMPREHENSION_OBJECTIVES, COMPREHENSION_PATH } from '../../content/comprehension.ts';
import { PLANNED_PATH } from '../../content/planned.ts';
import { SUPPLEMENT_PATH } from '../../content/supplement.ts';
import { A2_EXPANSION_PATH } from '../../content/a2-expansion.ts';
import { B1_PATH } from '../../content/b1.ts';
import { B2_PATH } from '../../content/b2.ts';
import { PT_PATH } from '../../content/pt-course.ts';
import { IT_PATH } from '../../content/it-course.ts';
import { ZH_PATH } from '../../content/zh-course.ts';
import { ES_PATH } from '../../content/es-course.ts';
import { FR_PATH } from '../../content/fr-course.ts';
import { PLANNED_OBJECTIVES } from '../../content/planned-objectives.ts';
import { catalogPayload, FULL_CATALOG_SQL, PLACEMENTS_SQL } from '../../scripts/catalog-sql.ts';
import { VERSIONS_SQL } from '../../scripts/versions-sql.ts';
import { GRADING_MODES, gradingSpecFor } from '../../shared/grading.ts';
import { NEUTRAL_ITEMS, neutralAddedVersions, withNeutralSpanish } from './neutralHistory.mjs';

let db;
let alice;
const doc = contentDocument(CURRICULUM_PATH);
// Fase C (docs/LEARNING_PHASE_C.md): 72 ítems context_choice con versión y conjunto, en lecciones sin
// publicar. La base tiene el currículo y además esto.
const phaseC = contentDocument(COMPREHENSION_PATH, { objectives: COMPREHENSION_OBJECTIVES });
const PHASE_C_ITEMS = phaseC.catalog.items.length;
// Fase C.3 (docs/LEARNING_PHASE_C.md §C3): U13 y U14 escritas, sin publicar. Sus generados de elección
// llevan las opciones fuera de la versión, como todo generado nuevo (content/inline-option-items.ts).
const c3Doc = contentDocument(PLANNED_PATH, { objectives: PLANNED_OBJECTIVES });
// Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): agregados sin publicar, ítems en draft. Se suman a los
// de la C.3 (mismo estado).
const closureDoc = contentDocument(SUPPLEMENT_PATH, { objectives: [] });
// Inglés A2 completo (docs/A2_EN_COMPLETION.md): U13–U17 sin publicar, ítems en draft. Mismo estado.
const a2Doc = contentDocument(A2_EXPANSION_PATH, { objectives: [] });
const b1Doc = contentDocument(B1_PATH, { objectives: [] });
const b2Doc = contentDocument(B2_PATH, { objectives: [] });
const ptDoc = contentDocument(PT_PATH, { objectives: [] });
const itDoc = contentDocument(IT_PATH, { objectives: [] });
const zhDoc = contentDocument(ZH_PATH, { objectives: [] });
const frDoc = contentDocument(FR_PATH, { objectives: [] });
const esDoc = contentDocument(ES_PATH, { objectives: [] });
const planned = {
  catalog: {
    items: [
      ...c3Doc.catalog.items,
      ...closureDoc.catalog.items,
      ...a2Doc.catalog.items,
      ...b1Doc.catalog.items,
      ...b2Doc.catalog.items,
      ...ptDoc.catalog.items,
      ...itDoc.catalog.items,
      ...zhDoc.catalog.items,
      ...frDoc.catalog.items,
      ...esDoc.catalog.items,
    ],
  },
  versions: {
    versions: [
      ...c3Doc.versions.versions,
      ...closureDoc.versions.versions,
      ...a2Doc.versions.versions,
      ...b1Doc.versions.versions,
      ...b2Doc.versions.versions,
      ...ptDoc.versions.versions,
      ...itDoc.versions.versions,
      ...zhDoc.versions.versions,
      ...frDoc.versions.versions,
      ...esDoc.versions.versions,
    ],
    variable_options: [
      ...c3Doc.versions.variable_options,
      ...closureDoc.versions.variable_options,
      ...a2Doc.versions.variable_options,
      ...b1Doc.versions.variable_options,
      ...b2Doc.versions.variable_options,
      ...ptDoc.versions.variable_options,
      ...itDoc.versions.variable_options,
      ...zhDoc.versions.variable_options,
      ...frDoc.versions.variable_options,
      ...esDoc.versions.variable_options,
    ],
  },
  optionSets: {
    option_sets: [
      ...c3Doc.optionSets.option_sets,
      ...closureDoc.optionSets.option_sets,
      ...a2Doc.optionSets.option_sets,
      ...b1Doc.optionSets.option_sets,
      ...b2Doc.optionSets.option_sets,
      ...ptDoc.optionSets.option_sets,
      ...itDoc.optionSets.option_sets,
      ...zhDoc.optionSets.option_sets,
      ...frDoc.optionSets.option_sets,
      ...esDoc.optionSets.option_sets,
    ],
    placement_option_sets: [
      ...c3Doc.optionSets.placement_option_sets,
      ...closureDoc.optionSets.placement_option_sets,
      ...a2Doc.optionSets.placement_option_sets,
      ...b1Doc.optionSets.placement_option_sets,
      ...b2Doc.optionSets.placement_option_sets,
      ...ptDoc.optionSets.placement_option_sets,
      ...itDoc.optionSets.placement_option_sets,
      ...zhDoc.optionSets.placement_option_sets,
      ...frDoc.optionSets.placement_option_sets,
      ...esDoc.optionSets.placement_option_sets,
    ],
  },
};
const PLANNED_ITEMS = planned.catalog.items.length;
const plannedByMode = (m) =>
  planned.versions.versions.filter((v) => v.grading_spec.mode === m).length;
const { catalog, versions } = doc;
const items = new Map(catalog.items.map((i) => [i.id, i]));
const variable = new Set(VARIABLE_OPTION_ITEMS);
/** Generados de elección nuevos de la C.3: opciones fuera de la versión (su conjunto las guarda). */
const outside = new Set(planned.versions.variable_options.map((v) => v.item_id));
const VERSION_FILES = ['en', 'it', 'pt', 'zh'].map(
  (l, i) => `2026110812010${i + 1}_learning_item_versions_${l}.sql`,
);

before(async () => {
  db = await createDb();
  alice = await createUser(db, 'alice@test.dev');
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;
const migration = (name) => readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8');
// V8 y V8.1: en supabase/migrations/ (el arnés la aplica); las pruebas la reaplican.
const V8_SQL = migration('20261108140000_learning_versions_required.sql');

async function inRollback(fn) {
  await db.exec('begin');
  try {
    return await fn();
  } finally {
    await db.exec('rollback');
  }
}

/** Ejecuta un fragmento de los generadores con su documento, como lo hace una migración generada. */
const docSql = (fragment, catalogDoc) => `do $polygo_content$
declare
  d constant jsonb := $content$${JSON.stringify({ catalog: catalogDoc })}$content$::jsonb;
begin
${fragment}
end
$polygo_content$;`;
const runDoc = (fragment, catalogDoc) => db.exec(docSql(fragment, catalogDoc));

/** Error de una sentencia (con los triggers diferidos comprobados), dentro de un savepoint. */
async function failure(sql) {
  await db.exec('savepoint s');
  try {
    await db.exec(sql);
    await db.exec('set constraints all immediate');
    await db.exec('release savepoint s');
    return null;
  } catch (err) {
    await db.exec('rollback to savepoint s');
    return err;
  }
}

const CONTENT_COLUMNS = `prompt_es, payload, answer, accepted_answers, explanation_es, difficulty,
  recommended_seconds`;

/** Contenido publicado de una ubicación, con la forma de una fila de versión. */
const contentOf = (exerciseId) =>
  one(`select ${CONTENT_COLUMNS} from public.exercises where id = $1`, [exerciseId]);

const placementsOf = (itemId) =>
  catalog.placements.filter((p) => p.item_id === itemId).map((p) => p.exercise_id);

const specOf = (itemId) => gradingSpecFor(items.get(itemId).type);

const versionRows = (itemId) =>
  all(
    `select version, content_hash, generator, generator_version from public.exercise_item_versions
     where item_id = $1 order by version`,
    [itemId],
  );

const currentOf = async (itemId) =>
  (await one(`select current_version_id v from public.exercise_items where id = $1`, [itemId])).v;

test('esquema de §5: versiones inmutables con sus unique, las FK compuestas y el modo de corrección', async () => {
  const cons = await all(`select conrelid::regclass::text t, conname, contype, condeferrable d,
      condeferred dd, pg_get_constraintdef(oid) def
    from pg_constraint
    where conrelid in ('public.exercise_item_versions'::regclass, 'public.exercises'::regclass,
                       'public.exercise_items'::regclass)
      and (conname like 'exercise_item_versions_%' or conname like 'exercises_item%'
           or conname = 'exercise_items_current_version_fkey')
    order by conname`);
  const by = Object.fromEntries(cons.map((c) => [c.conname, c]));
  assert.match(by.exercise_item_versions_item_version_key.def, /UNIQUE \(item_id, version\)/);
  assert.match(by.exercise_item_versions_id_item_key.def, /UNIQUE \(id, item_id\)/);
  assert.match(by.exercise_item_versions_item_hash_key.def, /UNIQUE \(item_id, content_hash\)/);
  const current = by.exercise_items_current_version_fkey;
  assert.match(
    current.def,
    /FOREIGN KEY \(current_version_id, id\) REFERENCES exercise_item_versions\(id, item_id\)/,
  );
  assert.deepEqual([current.d, current.dd], [true, true], 'diferible');
  assert.match(
    by.exercises_item_fkey.def,
    /FOREIGN KEY \(item_id\) REFERENCES exercise_items\(id\)/,
  );
  assert.match(
    by.exercises_item_version_fkey.def,
    /FOREIGN KEY \(item_version_id, item_id\) REFERENCES exercise_item_versions\(id, item_id\)/,
  );
  assert.ok(by.exercises_item_version_needs_item_check);
  assert.match(
    by.exercise_item_versions_grading_mode_fkey.def,
    /FOREIGN KEY \(grading_mode_id\) REFERENCES ref_grading_modes\(id\)/,
  );
  assert.match(by.exercise_item_versions_grading_mode_check.def, /grading_mode_id IS NOT NULL/);
  const idx = await one(
    `select indexdef from pg_indexes where indexname = 'exercises_item_id_idx'`,
  );
  assert.match(idx.indexdef, /\(item_id\)/);
  // Sin pg_jsonschema: las migraciones no instalan extensiones (V7).
  const ext = await all(`select extname from pg_extension where extname = 'pg_jsonschema'`);
  assert.deepEqual(ext, []);
});

test('ref_grading_modes: los esquemas de shared/grading.ts, inmutables', async () => {
  const rows = await all(
    `select id, mode, version, schema from public.ref_grading_modes order by id`,
  );
  assert.deepEqual(
    rows,
    GRADING_MODES.map(({ id, mode, version, schema }) => ({ id, mode, version, schema })),
  );
  await inRollback(async () => {
    for (const set of [`schema = '{}'`, `mode = 'x'`, `version = 2`, `id = 'pair_set.v9'`]) {
      const err = await failure(
        `update public.ref_grading_modes set ${set} where id = 'normalized_text.v1'`,
      );
      assert.match(String(err?.message), /inmutable/, set);
    }
    // Un modo usado por versiones no se borra.
    const del = await failure(`delete from public.ref_grading_modes where id = 'exact_option.v1'`);
    assert.match(String(del?.message), /grading_mode_fkey/);
    // Un esquema nuevo es una fila nueva.
    assert.equal(
      await failure(`insert into public.ref_grading_modes (id, mode, version, schema)
        values ('normalized_text.v2', 'normalized_text', 2, '{"type":"object"}')`),
      null,
    );
    const bad = await failure(`insert into public.ref_grading_modes (id, mode, version, schema)
      values ('x.v1', 'y', 1, '{}')`);
    assert.match(String(bad?.message), /ref_grading_modes_id_check/);
  });
});

test('versiones cargadas: 4.198, una vigente por ítem, iguales a content/ y con el hash recalculable', async () => {
  // La vigente de cada ítem es la de content/. Los ítems que corrigió el español neutro
  // (20270104120000) tienen además su versión 1 de antes: son exactamente las que agregó la corrección.
  const loaded = await all(`select v.item_id, v.version, v.content_hash, ${CONTENT_COLUMNS
    .split(',')
    .map((c) => `v.${c.trim()}`)
    .join(', ')}, v.grading_spec, v.generator, v.generator_version, v.grading_mode_id
    from public.exercise_items i join public.exercise_item_versions v on v.id = i.current_version_id
    order by v.item_id`);
  assert.equal(loaded.length, 4198 + PHASE_C_ITEMS + PLANNED_ITEMS);
  const total = await one(`select count(*)::int n,
      count(*) filter (where version > 1)::int later from public.exercise_item_versions`);
  const added = await neutralAddedVersions(db);
  assert.ok(added > 0);
  assert.deepEqual(total, { n: loaded.length + added, later: added });
  const expected = [
    ...versions.versions,
    ...phaseC.versions.versions,
    ...planned.versions.versions,
  ].sort((a, b) => (a.item_id < b.item_id ? -1 : 1));
  for (const [i, row] of loaded.entries()) {
    const { version, grading_mode_id, ...rest } = row;
    if (!NEUTRAL_ITEMS.has(row.item_id)) assert.equal(version, 1, row.item_id);
    else assert.ok(version <= 2, row.item_id);
    assert.deepEqual(rest, expected[i], row.item_id);
    assert.equal(grading_mode_id, `${row.grading_spec.mode}.v${row.grading_spec.mode_version}`);
    // V4: el hash se calcula en Node; recalcularlo desde lo que guardó la base da lo mismo.
    assert.equal(versionHash(row, row.grading_spec), row.content_hash, row.item_id);
    // V5 (a): los de distractores variables no guardan payload.options.
    if (variable.has(row.item_id) || outside.has(row.item_id))
      assert.ok(!('options' in row.payload), row.item_id);
  }
  const modes = await all(`select v.grading_mode_id m, count(*)::int n
    from public.exercise_items i join public.exercise_item_versions v on v.id = i.current_version_id
    group by 1 order by 1`);
  // exact_option: 1.499 escritos + 958 generados (176 de distractores variables); normalized_text:
  // 772 + 530; pair_set: 139 + 300.
  assert.deepEqual(modes, [
    { m: 'exact_option.v1', n: 2457 + PHASE_C_ITEMS + plannedByMode('exact_option') },
    { m: 'normalized_text.v1', n: 1302 + plannedByMode('normalized_text') },
    { m: 'pair_set.v1', n: 439 + plannedByMode('pair_set') },
  ]);
});

test('cada ejercicio publicado apunta a su ítem y a su versión, también los 176 de distractores variables', async () => {
  const rows = await all(`select e.id, e.item_id, e.item_version_id, v.content_hash
    from public.exercises e
    join public.lessons l on l.id = e.lesson_id
    left join public.exercise_item_versions v on v.id = e.item_version_id
    where e.is_published and l.unit_id not like 'test-%'`);
  const expected = new Map(catalog.placements.map((p) => [p.exercise_id, p]));
  const hashOf = new Map(versions.placement_versions.map((p) => [p.exercise_id, p.content_hash]));
  assert.equal(rows.length, 5410);
  const byKind = {};
  let withVersion = 0;
  for (const r of rows) {
    const p = expected.get(r.id);
    assert.ok(p, `${r.id} no está en el catálogo`);
    assert.equal(r.item_id, p.item_id, r.id);
    assert.equal(r.content_hash, hashOf.get(r.id), r.id);
    if (r.item_version_id) withVersion++;
    byKind[p.kind] = (byKind[p.kind] ?? 0) + 1;
    if (p.kind === 'copy') assert.equal(items.get(r.item_id).origin, 'authored', r.id);
  }
  assert.deepEqual(byKind, { authored: 2410, copy: 948, generated: 2052 });
  assert.equal(withVersion, 5410);
  const totals = await one(`select
    (select count(*)::int from public.exercise_item_versions) versions,
    (select count(*)::int from public.exercise_items where current_version_id is not null) with_current,
    (select count(distinct item_id)::int from public.exercises where is_published) items_placed,
    (select count(*)::int from public.exercise_items) items`);
  // Los ítems de la fase C (y de la C.3) tienen versión vigente pero ninguna ubicación publicada.
  assert.deepEqual(totals, {
    versions: 4198 + PHASE_C_ITEMS + PLANNED_ITEMS + (await neutralAddedVersions(db)),
    with_current: 4198 + PHASE_C_ITEMS + PLANNED_ITEMS,
    items_placed: 4198,
    items: 4198 + PHASE_C_ITEMS + PLANNED_ITEMS,
  });
});

test('la vigente es la única versión de cada ítem; el checksum de §5 se cumple en todas las ubicaciones', async () => {
  const bad = await one(
    `select
    (select count(*)::int from public.exercise_items i
       left join public.exercise_item_versions v on v.id = i.current_version_id
       where v.id is null) current_mismatch,
    (select count(*)::int from public.exercises e
       join public.exercise_item_versions v on v.id = e.item_version_id
       -- V5 (a): sin payload.options en los de distractores variables (los compara su conjunto).
       where (e.prompt_es, case when v.payload ? 'options' then e.payload else e.payload - 'options' end, e.answer, e.accepted_answers, e.explanation_es, e.difficulty,
              e.recommended_seconds)
         is distinct from (v.prompt_es, v.payload, v.answer, v.accepted_answers, v.explanation_es,
              v.difficulty, v.recommended_seconds)) checksum,
    (select count(*)::int from public.exercises e
       join public.exercise_items i on i.id = e.item_id
       where e.item_version_id is distinct from i.current_version_id) placement_not_current,
    (select count(*)::int from public.exercise_item_versions v
       where (v.payload ? 'options') = (v.item_id = any($1))
         and v.grading_mode_id = 'exact_option.v1') options_rule`,
    [[...variable, ...outside]],
  );
  assert.deepEqual(bad, {
    current_mismatch: 0,
    checksum: 0,
    placement_not_current: 0,
    options_rule: 0,
  });
});

test('las 948 copias de la consolidación comparten la versión de su escrito original', async () => {
  const rows = await all(
    `select e.id, e.item_id, e.item_version_id from public.exercises e
    where e.id = any($1)`,
    [catalog.placements.filter((p) => p.kind !== 'generated').map((p) => p.exercise_id)],
  );
  const versionOf = new Map(rows.map((r) => [r.id, r.item_version_id]));
  const original = new Map(
    catalog.placements.filter((p) => p.kind === 'authored').map((p) => [p.item_id, p.exercise_id]),
  );
  const copies = catalog.placements.filter((p) => p.kind === 'copy');
  assert.equal(copies.length, 948);
  for (const c of copies) {
    assert.ok(versionOf.get(c.exercise_id), c.exercise_id);
    assert.equal(
      versionOf.get(c.exercise_id),
      versionOf.get(original.get(c.item_id)),
      c.exercise_id,
    );
  }
});

test('ubicación e ítem: mismo idioma y mismo tipo', async () => {
  const bad = await one(`select count(*)::int n from public.exercises e
    join public.lessons l on l.id = e.lesson_id
    join public.curriculum_units u on u.id = l.unit_id
    join public.exercise_items i on i.id = e.item_id
    where u.language_code <> i.language_code or e.type <> i.type`);
  assert.equal(bad.n, 0);
});

const snapshot = async () => ({
  versions: await all(`select id, item_id, version, content_hash, created_at
    from public.exercise_item_versions order by id`),
  exercises: await all(
    `select id, item_id, item_version_id, updated_at from public.exercises order by id`,
  ),
  items: await all(`select id, current_version_id from public.exercise_items order by id`),
});

test('las migraciones de ubicaciones y versiones son idempotentes', async () => {
  const before = await snapshot();
  await db.exec(migration('20261107150000_learning_item_versions.sql'));
  await db.exec(migration('20261107150100_learning_item_placements.sql'));
  await db.exec(migration('20261108120000_learning_grading_modes.sql'));
  // Las cargas de versiones, con la corrección de español neutro aplicada a su documento: la carga
  // histórica tal cual fallaría a propósito (su copia de exercises ya no coincide con la versión vigente).
  for (const f of VERSION_FILES) await db.exec(withNeutralSpanish(migration(f)));
  for (const f of VERSION_FILES) await db.exec(withNeutralSpanish(migration(f)));
  await db.exec(migration('20270104120000_neutral_spanish_content.sql'));
  assert.deepEqual(await snapshot(), before);
});

test('regenerar todo el catálogo con versiones (content:catalog) sobre la base cargada no cambia nada', async () => {
  const before = await snapshot();
  await inRollback(async () => {
    await runDoc(FULL_CATALOG_SQL(), catalogPayload(catalog, versions));
    await db.exec('set constraints all immediate');
    assert.deepEqual(await snapshot(), before);
  });
});

test('una ubicación que cambia de ítem pasa a la versión del ítem nuevo; sin versión, V8 la rechaza', async () => {
  // Dos escritos del mismo idioma y tipo.
  const [a, b] = ['a1-u01-l01-e01', 'a1-u01-l01-e02'];
  assert.equal(items.get(a).type, items.get(b).type);
  const hb = versions.versions.find((v) => v.item_id === b).content_hash;
  await inRollback(async () => {
    assert.ok((await one(`select item_version_id v from public.exercises where id = $1`, [a])).v);
    await runDoc(PLACEMENTS_SQL, {
      placements: [{ exercise_id: a, item_id: b }],
      placement_versions: [{ exercise_id: a, item_id: b, content_hash: hb }],
    });
    assert.deepEqual(
      await one(`select item_id, item_version_id from public.exercises where id = $1`, [a]),
      { item_id: b, item_version_id: await currentOf(b) },
    );
  });
  // Un documento sin versiones la dejaría sin versión: NOT NULL (V8) aborta sin cambiar nada.
  const noVersion = await inRollback(() =>
    failure(docSql(PLACEMENTS_SQL, { placements: [{ exercise_id: a, item_id: b }] })),
  );
  assert.match(String(noVersion?.message), /item_version_id/);
  // Otro idioma u otro tipo: aborta sin cambiar nada.
  for (const other of ['it-a1-u01-l01-e01', 'a1-u01-l01-e06']) {
    const err = await inRollback(() =>
      failure(docSql(PLACEMENTS_SQL, { placements: [{ exercise_id: a, item_id: other }] })),
    );
    assert.match(String(err?.message), /catalog_placements/, other);
  }
});

test('versiones: inmutables; un escrito no tiene generador; grading_spec con un modo existente', async () => {
  const id = 'a1-u01-l01-e01';
  const vid = (await one(`select id from public.exercise_item_versions where item_id = $1`, [id]))
    .id;
  await inRollback(async () => {
    for (const set of [
      `prompt_es = 'otro'`,
      `content_hash = 'test:y'`,
      `version = 2`,
      `grading_spec = '{"mode":"pair_set","mode_version":1}'`,
      `generator_version = '9'`,
    ]) {
      const err = await failure(
        `update public.exercise_item_versions set ${set} where id = ${vid}`,
      );
      assert.match(String(err?.message), /inmutable/, set);
    }
    const insert = (cols, values) =>
      failure(`insert into public.exercise_item_versions (item_id, version, content_hash,
        ${CONTENT_COLUMNS}, grading_spec${cols})
      select ${values}, ${CONTENT_COLUMNS}, grading_spec${cols}
      from public.exercise_item_versions where id = ${vid}`);
    const gen =
      await failure(`insert into public.exercise_item_versions (item_id, version, content_hash,
        ${CONTENT_COLUMNS}, grading_spec, generator, generator_version)
      select item_id, 2, 'test:g', ${CONTENT_COLUMNS}, grading_spec, 'f', '1'
      from public.exercise_item_versions where id = ${vid}`);
    assert.match(String(gen?.message), /no puede tener generador/);
    const half =
      await failure(`insert into public.exercise_item_versions (item_id, version, content_hash,
        ${CONTENT_COLUMNS}, grading_spec, generator)
      select 'en.gen.translate_write.en-hello', 9, 'test:h', ${CONTENT_COLUMNS}, grading_spec, 'f'
      from public.exercise_item_versions where id = ${vid}`);
    assert.match(String(half?.message), /generator_check/);
    const dup = await insert('', `item_id, 2, content_hash`);
    assert.match(String(dup?.message), /item_hash_key/);
    for (const [spec, expected] of [
      [`'{}'`, /grading_mode_check/],
      [`'{"mode":"normalized_set","mode_version":1}'`, /grading_mode_fkey/],
      [`'{"mode":"exact_option","mode_version":2}'`, /grading_mode_fkey/],
    ]) {
      const err =
        await failure(`insert into public.exercise_item_versions (item_id, version, content_hash,
          ${CONTENT_COLUMNS}, grading_spec)
        select item_id, 2, 'test:s', ${CONTENT_COLUMNS}, ${spec}::jsonb
        from public.exercise_item_versions where id = ${vid}`);
      assert.match(String(err?.message), expected, spec);
    }
    const orphan = await failure(
      `update public.exercises set item_id = null, item_version_id = ${vid} where id = '${id}'`,
    );
    // Con V8, el NOT NULL de item_id rechaza antes que el CHECK (que sigue en su lugar).
    assert.match(String(orphan?.message), /column "item_id" .* not-null|needs_item_check/);
  });
});

test('deduplicación por (ítem, hash), numeración e idempotencia; A → B → A reutiliza A', async () => {
  // Un escrito con copias en la consolidación: todas sus ubicaciones comparten la versión.
  // Uno con varias ubicaciones que la corrección de español neutro no tocó (todos los que tienen
  // copias cambiaron de texto): una sola versión de partida.
  const id = catalog.items.find(
    (i) => !NEUTRAL_ITEMS.has(i.id) && placementsOf(i.id).length > 1,
  ).id;
  const placements = placementsOf(id);
  assert.ok(placements.length > 1, 'el escrito tiene copias en la consolidación');
  const a = versions.versions.find((v) => v.item_id === id);
  const docA = {
    versions: [a],
    current_versions: [{ item_id: id, content_hash: a.content_hash }],
    placement_versions: placements.map((exercise_id) => ({
      exercise_id,
      item_id: id,
      content_hash: a.content_hash,
    })),
  };
  await inRollback(async () => {
    const vA = await currentOf(id);
    await runDoc(VERSIONS_SQL, docA);
    assert.deepEqual(
      (await versionRows(id)).map((r) => r.version),
      [1],
    );
    // B: otra explicación es otra versión (hash nuevo); la vigente pasa a B.
    const contentB = { ...a, explanation_es: 'Otra explicación' };
    const b = { ...contentB, content_hash: versionHash(contentB, a.grading_spec) };
    assert.notEqual(b.content_hash, a.content_hash);
    await runDoc(VERSIONS_SQL, {
      versions: [b],
      current_versions: [{ item_id: id, content_hash: b.content_hash }],
      placement_versions: [],
    });
    assert.deepEqual(
      (await versionRows(id)).map((r) => [r.version, r.content_hash]),
      [
        [1, a.content_hash],
        [2, b.content_hash],
      ],
    );
    assert.notEqual(await currentOf(id), vA);
    // Vuelve A: se reutiliza la versión 1, no se crea otra.
    await runDoc(VERSIONS_SQL, docA);
    assert.equal((await versionRows(id)).length, 2);
    assert.equal(await currentOf(id), vA);
    // Mismo hash con otro contenido: aborta.
    const err = await failure(
      docSql(VERSIONS_SQL, {
        versions: [{ ...a, prompt_es: 'otro' }],
        current_versions: [],
        placement_versions: [],
      }),
    );
    assert.match(String(err?.message), /mismo hash y otro contenido/);
    // Una ubicación cuya copia no coincide con la versión: aborta (checksum de §5).
    const sum = await failure(
      docSql(VERSIONS_SQL, {
        versions: [],
        current_versions: [],
        placement_versions: [
          { exercise_id: placements[0], item_id: id, content_hash: b.content_hash },
        ],
      }),
    );
    assert.match(String(sum?.message), /no coincide con su versión/);
  });
});

test('procedencia (V6): fuera del hash, inmutable; A → B → A conserva la de A', async () => {
  const a = versions.versions.find((v) => v.generator && !NEUTRAL_ITEMS.has(v.item_id));
  const id = a.item_id;
  assert.equal(a.generator_version, '1.0.0');
  await inRollback(async () => {
    // Mismo contenido con otra versión del generador: no aborta, no crea versión, no la sobrescribe.
    const a2 = { ...a, generator_version: '2.0.0' };
    const current = (hash) => [{ item_id: id, content_hash: hash }];
    await runDoc(VERSIONS_SQL, {
      versions: [a2],
      current_versions: current(a.content_hash),
      placement_versions: [],
    });
    assert.deepEqual(await versionRows(id), [
      {
        version: 1,
        content_hash: a.content_hash,
        generator: a.generator,
        generator_version: '1.0.0',
      },
    ]);
    // B con el generador nuevo, y vuelta a A.
    const contentB = { ...a, prompt_es: `${a.prompt_es} (B)` };
    const b = {
      ...contentB,
      generator_version: '2.0.0',
      content_hash: versionHash(contentB, a.grading_spec),
    };
    await runDoc(VERSIONS_SQL, {
      versions: [b],
      current_versions: current(b.content_hash),
      placement_versions: [],
    });
    await runDoc(VERSIONS_SQL, {
      versions: [a2],
      current_versions: current(a.content_hash),
      placement_versions: [],
    });
    assert.deepEqual(await versionRows(id), [
      {
        version: 1,
        content_hash: a.content_hash,
        generator: a.generator,
        generator_version: '1.0.0',
      },
      {
        version: 2,
        content_hash: b.content_hash,
        generator: a.generator,
        generator_version: '2.0.0',
      },
    ]);
    const cur = await one(
      `select v.version from public.exercise_items i
      join public.exercise_item_versions v on v.id = i.current_version_id where i.id = $1`,
      [id],
    );
    assert.equal(cur.version, 1);
  });
});

test('referencias: ni una ubicación ni un ítem pueden apuntar a la versión de otro ítem', async () => {
  const [x, y] = ['a1-u01-l01-e01', 'a1-u01-l01-e02'];
  const vx = (await one(`select id from public.exercise_item_versions where item_id = $1`, [x])).id;
  const hx = versions.versions.find((v) => v.item_id === x).content_hash;
  await inRollback(async () => {
    const placement = await failure(
      `update public.exercises set item_version_id = ${vx} where id = '${y}'`,
    );
    assert.match(String(placement?.message), /exercises_item_version_fkey/);
    const current = await failure(
      `update public.exercise_items set current_version_id = ${vx} where id = '${y}'`,
    );
    assert.match(String(current?.message), /exercise_items_current_version_fkey/);
    const wrong = await failure(
      docSql(VERSIONS_SQL, {
        versions: [],
        current_versions: [],
        placement_versions: [{ exercise_id: y, item_id: x, content_hash: hx }],
      }),
    );
    assert.match(String(wrong?.message), /de otro ítem/);
  });
});

test('V5 resuelto: los 176 tienen versión y sus 371 ubicaciones, conjunto propio; exercise_attempts no cambia', async () => {
  const r = await one(
    `select
    (select count(*)::int from public.exercise_items where id = any($1) and current_version_id is not null) items,
    (select count(*)::int from public.exercise_item_versions where item_id = any($1)) versions,
    (select count(*)::int from public.exercises
       where item_id = any($1) and item_version_id is not null and option_set_id is not null) placements`,
    [[...variable]],
  );
  assert.deepEqual(r, {
    items: 176,
    versions: 176 + (await neutralAddedVersions(db, variable)),
    placements: 371,
  });
  // El intento no se tocó: lo que se mostró vive en exercise_presentations y el vínculo, aparte
  // (supabase/tests/presentations.test.mjs).
  const cols = await all(`select column_name c from information_schema.columns
    where table_schema = 'public' and table_name = 'exercise_attempts' order by 1`);
  assert.deepEqual(
    cols.map((x) => x.c),
    [
      'answer',
      'created_at',
      'exercise_id',
      'id',
      'is_correct',
      'is_first_try',
      'response_ms',
      'session_id',
      'skill',
      'user_id',
      'word_id',
    ],
  );
  const tables = await all(`select table_name from information_schema.tables
    where table_schema = 'public' and table_name in ('exercise_option_sets', 'exercise_presentations',
      'exercise_attempt_presentations') order by 1`);
  assert.equal(tables.length, 3);
});

test('V8: la migración está aplicada; su validación previa aborta con una fila incompleta', async () => {
  const cols = await all(`select c.relname t, a.attname col, a.attnotnull nn from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    where c.relnamespace = 'public'::regnamespace
      and (c.relname, a.attname) in (('exercise_items', 'current_version_id'),
                                     ('exercises', 'item_id'), ('exercises', 'item_version_id'))
    order by 1, 2`);
  // V8.1: current_version_id sin NOT NULL (sería circular); lo garantiza el trigger diferido.
  assert.deepEqual(cols, [
    { t: 'exercise_items', col: 'current_version_id', nn: false },
    { t: 'exercises', col: 'item_id', nn: true },
    { t: 'exercises', col: 'item_version_id', nn: true },
  ]);
  const checks = await all(`select conname, convalidated from pg_constraint
    where conname in ('exercises_item_id_not_null', 'exercises_item_version_id_not_null',
                      'exercises_choice_option_set_check')
    order by 1`);
  assert.deepEqual(
    checks.map((c) => [c.conname, c.convalidated]),
    [
      ['exercises_choice_option_set_check', true],
      ['exercises_item_id_not_null', true],
      ['exercises_item_version_id_not_null', true],
    ],
  );
  // Constraint trigger diferible, inicialmente diferido, en INSERT y UPDATE, por fila, activo.
  const trg = await one(`select t.tgconstraint <> 0 is_constraint, t.tgdeferrable "deferrable",
      t.tginitdeferred initially_deferred, t.tgenabled enabled, t.tgtype::int tgtype,
      p.proname fn, p.prosecdef secdef
    from pg_trigger t join pg_proc p on p.oid = t.tgfoid
    where t.tgrelid = 'public.exercise_items'::regclass
      and t.tgname = 'exercise_items_require_current_version'`);
  // tgtype: ROW (1) + INSERT (4) + UPDATE (16) = 21; AFTER no suma.
  assert.deepEqual(trg, {
    is_constraint: true,
    deferrable: true,
    initially_deferred: true,
    enabled: 'O',
    tgtype: 21,
    fn: 'exercise_items_check_current_version',
    secdef: true,
  });
  // La FK compuesta diferible de current_version_id sigue en su lugar.
  const fk = await one(`select condeferrable, condeferred, pg_get_constraintdef(oid) def
    from pg_constraint where conname = 'exercise_items_current_version_fkey'`);
  assert.deepEqual(fk, {
    condeferrable: true,
    condeferred: true,
    def: 'FOREIGN KEY (current_version_id, id) REFERENCES exercise_item_versions(id, item_id) DEFERRABLE INITIALLY DEFERRED',
  });

  // Idempotente: reaplicarla no cambia nada.
  const before = await snapshot();
  await inRollback(async () => {
    await db.exec(V8_SQL);
    await db.exec(V8_SQL);
    assert.deepEqual(await snapshot(), before);
  });

  // Validación previa: para fabricar una fila incompleta hay que quitar antes la restricción (dentro
  // de una transacción que se revierte); la migración la detecta y aborta.
  const relax = {
    item_version: `alter table public.exercises alter column item_version_id drop not null;
      alter table public.exercises drop constraint exercises_item_version_id_not_null;`,
    option_set: `alter table public.exercises drop constraint exercises_choice_option_set_check;`,
    current: `alter table public.exercise_items disable trigger exercise_items_require_current_version;`,
  };
  for (const [relaxing, sql, expected] of [
    [
      relax.option_set,
      `update public.exercises set option_set_id = null where id = 'a1-u01-l01-e01'`,
      /ubicación a1-u01-l01-e01 sin conjunto de opciones/,
    ],
    [
      `${relax.item_version}${relax.option_set}`,
      `update public.exercises set option_set_id = null, item_version_id = null where id = 'a1-u01-l01-e01'`,
      /ubicación a1-u01-l01-e01 sin versión/,
    ],
    [
      relax.current,
      `update public.exercise_items set current_version_id = null where id = 'a1-u01-l01-e02'`,
      /ítem a1-u01-l01-e02 sin versión vigente/,
    ],
  ]) {
    const err = await inRollback(async () => {
      await db.exec('set constraints all immediate');
      await db.exec(relaxing);
      await db.exec(sql);
      return failure(V8_SQL);
    });
    assert.match(String(err?.message), /backfill de versiones no está completo/, sql);
    assert.match(String(err?.message), expected, sql);
  }
  assert.deepEqual(await snapshot(), before);
});

/** Ítem escrito nuevo de prueba, con la clase y el contenido de uno real (a1-u01-l01-e02). */
const NEW_ITEM = 'zz-v81-item';
const insertItem = (id = NEW_ITEM) => `insert into public.exercise_items (id, language_code, level,
    origin, type, assessment_mode, response_format, input_modality, response_privacy, status)
  select '${id}', language_code, level, origin, type, assessment_mode, response_format, input_modality,
    response_privacy, status
  from public.exercise_items where id = 'a1-u01-l01-e02'`;
const insertVersion = (
  id = NEW_ITEM,
) => `insert into public.exercise_item_versions (item_id, version,
    content_hash, prompt_es, payload, answer, accepted_answers, explanation_es, difficulty,
    recommended_seconds, grading_spec)
  select '${id}', 1, content_hash, prompt_es, payload, answer, accepted_answers, explanation_es,
    difficulty, recommended_seconds, grading_spec
  from public.exercise_item_versions where item_id = 'a1-u01-l01-e02'`;
const pointItem = (id = NEW_ITEM) => `update public.exercise_items set current_version_id =
  (select id from public.exercise_item_versions where item_id = '${id}' and version = 1) where id = '${id}'`;

/** Corre `sql` en una transacción real; devuelve el error de una sentencia o del COMMIT, o null. */
async function committed(sql) {
  await db.exec('begin');
  try {
    await db.exec(sql);
  } catch (err) {
    await db.exec('rollback');
    return err;
  }
  try {
    await db.exec('commit');
    return null;
  } catch (err) {
    return err;
  }
}

test('V8.1: ítem, primera versión y puntero en una transacción confirman, en cualquier orden', async () => {
  const before = await snapshot();
  // Orden de los generadores: ítem sin versión → versión → puntero.
  assert.equal(await committed(`${insertItem()}; ${insertVersion()}; ${pointItem()};`), null);
  const r = await one(
    `select i.current_version_id = v.id ok, v.version
     from public.exercise_items i join public.exercise_item_versions v on v.item_id = i.id
     where i.id = $1`,
    [NEW_ITEM],
  );
  assert.deepEqual(r, { ok: true, version: 1 });
  // Limpieza (las versiones admiten DELETE; sólo UPDATE es inmutable).
  assert.equal(
    await committed(`delete from public.exercise_item_versions where item_id = '${NEW_ITEM}';
      delete from public.exercise_items where id = '${NEW_ITEM}';`),
    null,
  );
  // Con el puntero puesto antes que la versión (la FK es diferible): también confirma.
  const second = 'zz-v81-item-b';
  const vid = (
    await one(
      `select nextval(pg_get_serial_sequence('public.exercise_item_versions', 'id'))::int n`,
    )
  ).n;
  assert.equal(
    await committed(`${insertItem(second)};
      update public.exercise_items set current_version_id = ${vid} where id = '${second}';
      insert into public.exercise_item_versions (id, item_id, version, content_hash, prompt_es, payload,
        answer, accepted_answers, explanation_es, difficulty, recommended_seconds, grading_spec)
      overriding system value
      select ${vid}, '${second}', 1, content_hash, prompt_es, payload, answer, accepted_answers,
        explanation_es, difficulty, recommended_seconds, grading_spec
      from public.exercise_item_versions where item_id = 'a1-u01-l01-e02';`),
    null,
  );
  assert.equal(
    await committed(`delete from public.exercise_item_versions where item_id = '${second}';
      delete from public.exercise_items where id = '${second}';`),
    null,
  );
  assert.deepEqual(await snapshot(), before);
});

test('V8.1: una transacción que deja un ítem sin current_version_id falla al confirmar', async () => {
  const before = await snapshot();
  // Ítem sin versión: la sentencia pasa; el COMMIT no.
  const noVersion = await committed(`${insertItem()};`);
  assert.match(String(noVersion?.message), /el ítem zz-v81-item no tiene versión vigente/);
  assert.equal(noVersion?.code, '23502');
  // Con versión pero sin puntero: tampoco.
  const noPointer = await committed(`${insertItem()}; ${insertVersion()};`);
  assert.match(String(noPointer?.message), /no tiene versión vigente/);
  // Nada quedó escrito.
  const left = await one(
    `select (select count(*)::int from public.exercise_items where id = $1) i,
       (select count(*)::int from public.exercise_item_versions where item_id = $1) v`,
    [NEW_ITEM],
  );
  assert.deepEqual(left, { i: 0, v: 0 });
  assert.deepEqual(await snapshot(), before);
});

test('V8.1: un UPDATE que deja current_version_id nulo falla al confirmar; restaurarlo antes, no', async () => {
  const before = await snapshot();
  const id = 'a1-u01-l01-e02';
  const cleared = await committed(
    `update public.exercise_items set current_version_id = null where id = '${id}'`,
  );
  assert.match(String(cleared?.message), new RegExp(`el ítem ${id} no tiene versión vigente`));
  // Un UPDATE de otra columna también se comprueba (sigue teniendo vigente: confirma).
  assert.equal(
    await committed(`update public.exercise_items set status = status where id = '${id}'`),
    null,
  );
  // Quitarlo y restaurarlo dentro de la misma transacción: confirma (se mira el estado final).
  const vid = await currentOf(id);
  assert.equal(
    await committed(`update public.exercise_items set current_version_id = null where id = '${id}';
      update public.exercise_items set current_version_id = ${vid} where id = '${id}';`),
    null,
  );
  // Con la restricción inmediata, falla en la misma sentencia.
  const immediate = await inRollback(async () => {
    await db.exec('set constraints public.exercise_items_require_current_version immediate');
    await db.exec('savepoint s');
    try {
      await db.exec(
        `update public.exercise_items set current_version_id = null where id = '${id}'`,
      );
      return null;
    } catch (err) {
      await db.exec('rollback to savepoint s');
      return err;
    }
  });
  assert.match(String(immediate?.message), /no tiene versión vigente/);
  assert.deepEqual(await snapshot(), before);
});

test('V8.1: referencias compuestas: la vigente, la versión y el conjunto de cada ubicación son de su ítem', async () => {
  const before = await snapshot();
  const [x, y] = ['a1-u01-l01-e01', 'a1-u01-l01-e02'];
  const vx = await currentOf(x);
  // La vigente de otro ítem: la FK compuesta diferible y el trigger la rechazan al confirmar.
  const current = await committed(
    `update public.exercise_items set current_version_id = ${vx} where id = '${y}'`,
  );
  assert.match(
    String(current?.message),
    /exercise_items_current_version_fkey|no es una versión del ítem/,
  );
  // Sin la FK (dentro de una transacción que se revierte), el trigger sigue rechazándola.
  const triggerOnly = await inRollback(async () => {
    await db.exec('set constraints all immediate');
    await db.exec(
      'alter table public.exercise_items drop constraint exercise_items_current_version_fkey',
    );
    return failure(`update public.exercise_items set current_version_id = ${vx} where id = '${y}'`);
  });
  assert.match(
    String(triggerOnly?.message),
    new RegExp(`la versión vigente ${vx} no es una versión del ítem ${y}`),
  );
  assert.equal(triggerOnly?.code, '23503');
  // Una versión inexistente.
  const missing = await committed(
    `update public.exercise_items set current_version_id = -1 where id = '${y}'`,
  );
  assert.match(
    String(missing?.message),
    /exercise_items_current_version_fkey|no es una versión del ítem/,
  );
  // Ubicación: la versión de otro ítem (FK compuesta), sin ítem o sin versión (NOT NULL).
  const placement = await committed(
    `update public.exercises set item_version_id = ${vx} where id = '${y}'`,
  );
  assert.match(String(placement?.message), /exercises_item_version_fkey/);
  for (const col of ['item_id', 'item_version_id']) {
    const err = await committed(`update public.exercises set ${col} = null where id = '${y}'`);
    assert.match(String(err?.message), new RegExp(col), col);
  }
  // Conjunto de opciones de otra versión (FK compuesta diferida).
  const sx = (await one(`select option_set_id s from public.exercises where id = $1`, [x])).s;
  const other = (
    await one(
      `select e.id from public.exercises e
       where e.option_set_id is not null and e.item_id <> $1 order by e.id limit 1`,
      [x],
    )
  ).id;
  const set = await committed(
    `update public.exercises set option_set_id = ${sx} where id = '${other}'`,
  );
  assert.match(String(set?.message), /exercises_option_set_fkey/);
  assert.deepEqual(await snapshot(), before);
});

test('anon y authenticated no acceden a las versiones ni a los modos; la app lee exercises igual que antes', async () => {
  for (const [role, user] of [
    ['anon', null],
    ['authenticated', alice],
  ]) {
    for (const table of ['exercise_item_versions', 'ref_grading_modes']) {
      await assert.rejects(
        as(db, role, user, () => db.query(`select 1 from public.${table} limit 1`)),
        /permission denied/,
        `${role} ${table}`,
      );
    }
  }
  for (const fn of [
    'exercise_item_versions_immutable()',
    'exercise_item_versions_check_origin()',
    'ref_grading_modes_immutable()',
  ]) {
    for (const role of ['anon', 'authenticated']) {
      const r = await one(`select has_function_privilege($1, $2, 'execute') ok`, [
        role,
        `public.${fn}`,
      ]);
      assert.equal(r.ok, false, `${role} ejecuta ${fn}`);
    }
  }
  const rows = await as(db, 'authenticated', alice, () =>
    db.query(
      `select count(*)::int n, count(item_id)::int with_item from public.exercises where is_published`,
    ),
  );
  assert.ok(rows.rows[0].n >= 5410);
  for (const table of ['exercise_item_versions', 'ref_grading_modes']) {
    const rls = await one(`select relrowsecurity from pg_class where oid = $1::regclass`, [
      `public.${table}`,
    ]);
    assert.equal(rls.relrowsecurity, true, table);
  }
});

test('el SRS v1 no cambia', async () => {
  const defs = await all(`
    select p.proname, pg_get_functiondef(p.oid) def from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and p.proname in ('submit_learning_session', 'apply_word_result', 'srs_config')`);
  assert.equal(defs.length, 3);
  for (const d of defs) assert.ok(!/item_version|exercise_item|item_id/.test(d.def), d.proname);
});

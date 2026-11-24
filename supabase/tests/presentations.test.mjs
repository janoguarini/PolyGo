// Conjuntos de opciones inmutables, historia de asignación y presentaciones, probados en PGlite
// (decisiones V5.1–V5.3 del 2026-11-08, docs/EXERCISE_ITEM_VERSIONS_PENDING.md §5). Migraciones:
// 20261108130000_learning_option_sets.sql y 20261108130101…04_learning_option_sets_<idioma>.sql.
// Las pruebas que escriben lo hacen dentro de transacciones que se revierten.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { CURRICULUM_PATH } from '../../content/index.ts';
import { VARIABLE_OPTION_ITEMS } from '../../content/variable-options.ts';
import { buildOptionSets, isChoiceType, optionSetHash } from '../../content/option-sets.ts';
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
import { catalogPayload, FULL_CATALOG_SQL } from '../../scripts/catalog-sql.ts';
import { OPTION_SETS_SQL } from '../../scripts/option-sets-sql.ts';
import { EXERCISE_TYPES } from '../../shared/exercises.ts';
import { SHUFFLE_V1, choiceSeed, shuffleOrderV1 } from '../../shared/shuffle.ts';
import { shuffle as appShuffle } from '../../src/features/learning/random.ts';

let db;
let alice;
let bob;
const doc = contentDocument(CURRICULUM_PATH);
// Fase C (docs/LEARNING_PHASE_C.md): 72 ítems context_choice con versión y conjunto, en lecciones sin
// publicar. La base tiene el currículo y además esto.
const phaseC = contentDocument(COMPREHENSION_PATH, { objectives: COMPREHENSION_OBJECTIVES });
const PHASE_C_ITEMS = phaseC.catalog.items.length;
// Fase C.3 (docs/LEARNING_PHASE_C.md §C3): U13 y U14 escritas, sin publicar, con sus conjuntos.
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
const { catalog, versions, optionSets } = doc;
const items = new Map(catalog.items.map((i) => [i.id, i]));
const rows = new Map(doc.exercises.map((e) => [e.id, e]));
const variable = new Set(VARIABLE_OPTION_ITEMS);
const LANGS = ['en', 'it', 'pt', 'zh'];
const SET_FILES = LANGS.map((l, i) => `2026110813010${i + 1}_learning_option_sets_${l}.sql`);
const VERSION_FILES = LANGS.map((l, i) => `2026110812010${i + 1}_learning_item_versions_${l}.sql`);
const MIGRATIONS = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, MIGRATIONS), 'utf8');

before(async () => {
  db = await createDb();
  alice = await createUser(db, 'alice@test.dev');
  bob = await createUser(db, 'bob@test.dev');
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;

async function inRollback(fn) {
  await db.exec('begin');
  try {
    return await fn();
  } finally {
    await db.exec('rollback');
  }
}

/** Error de una sentencia (con los triggers y FK diferidos comprobados), dentro de un savepoint. */
async function failure(sql, params = []) {
  await db.exec('savepoint s');
  try {
    await db.query(sql, params);
    await db.exec('set constraints all immediate');
    await db.exec('release savepoint s');
    return null;
  } catch (err) {
    await db.exec('rollback to savepoint s');
    return err;
  }
}

const docSql = (fragment, catalogDoc) => `do $polygo_content$
declare
  d constant jsonb := $content$${JSON.stringify({ catalog: catalogDoc })}$content$::jsonb;
begin
${fragment}
end
$polygo_content$;`;

const placementsOf = (itemId) =>
  catalog.placements.filter((p) => p.item_id === itemId).map((p) => p.exercise_id);

/** Ubicación, versión y conjunto vigentes de un ejercicio. */
const placement = (exerciseId) =>
  one(
    `select e.id, e.item_id, e.item_version_id, e.option_set_id, e.payload, e.answer,
            jsonb_array_length(s.options) n
     from public.exercises e left join public.exercise_option_sets s on s.id = e.option_set_id
     where e.id = $1`,
    [exerciseId],
  );

/**
 * Lo que hará el servidor al mostrar un ejercicio: toma la versión y el conjunto vigentes de la
 * ubicación, mezcla con polygo.shuffle.v1 y registra el orden. Devuelve el id y el orden.
 */
async function present(userId, sessionId, exerciseId, { order, seed, position } = {}) {
  const p = await placement(exerciseId);
  const s = seed ?? choiceSeed(sessionId, exerciseId);
  const o = p.option_set_id ? (order ?? shuffleOrderV1(p.n, s)) : null;
  const r = await one(
    `insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id,
       exercise_id, option_set_id, option_order, shuffle_algorithm, shuffle_seed)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
    [
      userId,
      sessionId,
      position ?? null,
      p.item_id,
      p.item_version_id,
      exerciseId,
      p.option_set_id,
      o,
      o ? SHUFFLE_V1 : null,
      o ? s : null,
    ],
  );
  return { id: r.id, order: o };
}

const snapshot = async (id) =>
  (await one(`select public.exercise_presentation_snapshot($1) s`, [id])).s;

/** Sesión y un intento de la ruta vieja, como los escribe submit_learning_session. */
async function legacySession(userId, sessionId, attempts, target = db) {
  await target.query(
    `insert into public.learning_sessions (id, user_id, kind, started_at, duration_seconds, total_answers,
       first_try_total, first_try_correct, local_date)
     values ($1, $2, 'review', now() - interval '3 minutes', 120, $3, $3, 0, current_date)`,
    [sessionId, userId, attempts.length],
  );
  const ids = [];
  for (const a of attempts) {
    const r = await target.query(
      `insert into public.exercise_attempts (session_id, user_id, exercise_id, word_id, skill, answer,
         is_correct, is_first_try, response_ms, created_at)
       values ($1, $2, $3, $4, 'vocabulary', $5, $6, true, 1500, coalesce($7::timestamptz, now()))
       returning id`,
      [
        sessionId,
        userId,
        a.exercise_id ?? null,
        a.word_id ?? null,
        a.answer ?? 'x',
        a.correct ?? false,
        a.at ?? null,
      ],
    );
    ids.push(r.rows[0].id);
  }
  return ids;
}

const link = (attemptId, presentationId) =>
  db.query(
    `insert into public.exercise_attempt_presentations (attempt_id, presentation_id) values ($1, $2)`,
    [attemptId, presentationId],
  );

// Ubicaciones de prueba: un ítem de distractores variables con dos ubicaciones y dos conjuntos, uno en
// chino con pinyin, y uno escrito de elección.
const VAR_ITEM = VARIABLE_OPTION_ITEMS.find((id) => placementsOf(id).length >= 2);
const [VAR_A, VAR_B] = placementsOf(VAR_ITEM);
const ZH_SET = optionSets.option_sets.find(
  (s) => s.options.filter((o) => o.reading).length >= 2 && variable.has(s.item_id),
);
const ZH_EX = optionSets.placement_option_sets.find(
  (p) => p.item_id === ZH_SET.item_id && p.options_hash === ZH_SET.options_hash,
).exercise_id;
const AUTHORED_EX = catalog.placements.find(
  (p) => p.kind === 'authored' && items.get(p.item_id).type === 'translation_choice',
).exercise_id;
const WRITE_EX = catalog.placements.find(
  (p) => items.get(p.item_id).type === 'translate_write',
).exercise_id;

// --- Esquema y backfill --------------------------------------------------------------------------

test('esquema: tablas, FK compuestas, unique e índices de §5', async () => {
  const cons =
    await all(`select conrelid::regclass::text t, conname, condeferrable d, condeferred dd,
      pg_get_constraintdef(oid) def
    from pg_constraint
    where conrelid in ('public.exercise_option_sets'::regclass, 'public.exercise_option_set_assignments'::regclass,
                       'public.exercise_presentations'::regclass, 'public.exercise_attempt_presentations'::regclass,
                       'public.exercises'::regclass)
    order by conname`);
  const by = Object.fromEntries(cons.map((c) => [c.conname, c]));
  assert.match(
    by.exercise_option_sets_version_fkey.def,
    /FOREIGN KEY \(item_version_id, item_id\) REFERENCES exercise_item_versions\(id, item_id\)/,
  );
  assert.match(
    by.exercise_option_sets_version_hash_key.def,
    /UNIQUE \(item_version_id, options_hash\)/,
  );
  assert.match(by.exercise_option_sets_id_version_key.def, /UNIQUE \(id, item_version_id\)/);
  const fk = by.exercises_option_set_fkey;
  assert.match(
    fk.def,
    /FOREIGN KEY \(option_set_id, item_version_id\) REFERENCES exercise_option_sets\(id, item_version_id\)/,
  );
  assert.deepEqual([fk.d, fk.dd], [true, true], 'diferible');
  assert.match(
    by.exercise_option_set_assignments_set_fkey.def,
    /FOREIGN KEY \(option_set_id, item_version_id\) REFERENCES exercise_option_sets\(id, item_version_id\)/,
  );
  assert.match(
    by.exercise_presentations_version_fkey.def,
    /FOREIGN KEY \(item_version_id, item_id\) REFERENCES exercise_item_versions\(id, item_id\)/,
  );
  assert.match(
    by.exercise_presentations_set_fkey.def,
    /FOREIGN KEY \(option_set_id, item_version_id\) REFERENCES exercise_option_sets\(id, item_version_id\)/,
  );
  assert.match(
    by.exercise_presentations_user_id_fkey.def,
    /REFERENCES profiles\(id\) ON DELETE CASCADE/,
  );
  assert.match(by.exercise_presentations_exercise_id_fkey.def, /REFERENCES exercises\(id\)$/);
  assert.match(
    by.exercise_attempt_presentations_attempt_id_fkey.def,
    /REFERENCES exercise_attempts\(id\) ON DELETE CASCADE/,
  );
  // Sin FK a learning_sessions: la ruta vieja inserta la sesión recién al enviar.
  assert.ok(!cons.some((c) => /learning_sessions/.test(c.def)));
  const idx = (await all(`select indexname from pg_indexes where tablename like 'exercise_%'`)).map(
    (r) => r.indexname,
  );
  for (const name of [
    'exercise_option_sets_item_idx',
    'exercise_option_set_assignments_exercise_idx',
    'exercise_presentations_user_idx',
    'exercise_presentations_session_idx',
    'exercise_presentations_version_idx',
    'exercise_presentations_set_idx',
    'exercise_presentations_exercise_idx',
    'exercise_attempt_presentations_presentation_idx',
  ]) {
    assert.ok(idx.includes(name), name);
  }
  const algos = await all(`select id from public.ref_shuffle_algorithms`);
  assert.deepEqual(algos, [{ id: 'polygo.shuffle.v1' }]);
});

test('backfill: 2.652 conjuntos, uno en cada una de las 3.139 ubicaciones de elección, iguales a content/', async () => {
  const n = await one(`select (select count(*)::int from public.exercise_option_sets) sets,
      (select count(*)::int from public.exercises where option_set_id is not null) placed,
      (select count(*)::int from public.exercise_option_set_assignments) assigned,
      (select count(*)::int from public.exercises
         where type in ('image_choice','translation_choice','fill_blank','listen_choice','context_choice') and option_set_id is null) missing,
      (select count(*)::int from public.exercises
         where type not in ('image_choice','translation_choice','fill_blank','listen_choice','context_choice') and option_set_id is not null) extra`);
  const extra = phaseC.optionSets.option_sets.length;
  assert.equal(extra, PHASE_C_ITEMS);
  const c3 = planned.optionSets;
  assert.deepEqual(n, {
    sets: 2652 + extra + c3.option_sets.length,
    placed: 3139 + extra + c3.placement_option_sets.length,
    assigned: 3139 + extra + c3.placement_option_sets.length,
    missing: 0,
    extra: 0,
  });
  assert.equal(optionSets.option_sets.length, 2652);
  assert.equal(optionSets.placement_option_sets.length, 3139);
  // El SQL nombra los tipos de elección a mano: son los de exact_option.
  assert.deepEqual(EXERCISE_TYPES.filter(isChoiceType).sort(), [
    'context_choice',
    'fill_blank',
    'image_choice',
    'listen_choice',
    'translation_choice',
  ]);

  const db_sets =
    await all(`select s.item_id, v.content_hash version_hash, s.options_hash, s.format,
      s.options, s.answer_index, s.origin, s.generator, s.generator_version
    from public.exercise_option_sets s join public.exercise_item_versions v on v.id = s.item_version_id
    order by s.id`);
  const sort = (xs) =>
    [...xs].sort((a, b) =>
      `${a.item_id}${a.options_hash}` < `${b.item_id}${b.options_hash}` ? -1 : 1,
    );
  assert.deepEqual(
    sort(db_sets),
    sort([
      ...optionSets.option_sets,
      ...phaseC.optionSets.option_sets,
      ...planned.optionSets.option_sets,
    ]),
  );
  // El hash se recalcula igual desde la fila leída de la base (Node, V4).
  for (const s of db_sets) assert.equal(optionSetHash(s), s.options_hash);

  // Checksum: la copia de exercises son los textos del conjunto, y answer es la opción de answer_index.
  const bad = await all(`select e.id from public.exercises e
    join public.exercise_option_sets s on s.id = e.option_set_id
    where (select jsonb_agg(o -> 'text' order by k) from jsonb_array_elements(s.options) with ordinality t(o, k))
          is distinct from e.payload -> 'options'
       or s.options -> s.answer_index::int ->> 'text' is distinct from e.answer
       or s.item_version_id is distinct from e.item_version_id`);
  assert.deepEqual(bad, []);
  // Asignación inicial: una por ubicación y la última es la vigente.
  const hist = await all(`select e.id from public.exercises e
    where e.option_set_id is distinct from (select a.option_set_id from public.exercise_option_set_assignments a
                                            where a.exercise_id = e.id order by a.id desc limit 1)`);
  assert.deepEqual(hist, []);
});

test('los 176 ítems de distractores variables: una versión cada uno, sin options; 371 ubicaciones con versión y conjunto propio', async () => {
  const r = await one(
    `select count(distinct v.item_id)::int items, count(*)::int versions,
            count(*) filter (where v.payload ? 'options')::int with_options,
            (select count(*)::int from public.exercise_items i where i.id = any($1) and i.current_version_id is null) no_current
     from public.exercise_item_versions v where v.item_id = any($1)`,
    [[...variable]],
  );
  assert.deepEqual(r, { items: 176, versions: 176, with_options: 0, no_current: 0 });
  const p = await one(
    `select count(*)::int placements, count(item_version_id)::int with_version,
            count(option_set_id)::int with_set, count(distinct option_set_id)::int sets
     from public.exercises where item_id = any($1)`,
    [[...variable]],
  );
  assert.deepEqual(p, { placements: 371, with_version: 371, with_set: 371, sets: 371 });
  // Y los demás ítems de elección guardan sus opciones en la versión, iguales a las del conjunto.
  const mismatch = await all(`select e.id from public.exercises e
    join public.exercise_item_versions v on v.id = e.item_version_id
    join public.exercise_option_sets s on s.id = e.option_set_id
    where v.payload ? 'options'
      and (select jsonb_agg(o -> 'text' order by k) from jsonb_array_elements(s.options) with ordinality t(o, k))
          is distinct from v.payload -> 'options'`);
  assert.deepEqual(mismatch, []);
});

test('formato polygo.options.v1: texto literal, pinyin fotografiado en chino, sin audio ni imagen', async () => {
  const s = await one(
    `select s.options from public.exercise_option_sets s
     join public.exercise_item_versions v on v.id = s.item_version_id
     where s.item_id = $1 and s.options_hash = $2`,
    [ZH_SET.item_id, ZH_SET.options_hash],
  );
  assert.deepEqual(s.options, ZH_SET.options);
  for (const o of s.options) {
    assert.deepEqual(Object.keys(o).sort(), ['audio', 'image', 'reading', 'text']);
    assert.equal(o.audio, null);
    assert.equal(o.image, null);
    if (o.reading) assert.equal(o.reading.map((x) => x.text).join(''), o.text);
  }
  const counts = await one(`select
      count(*) filter (where o -> 'reading' <> 'null')::int with_reading,
      count(*) filter (where o -> 'audio' <> 'null' or o -> 'image' <> 'null')::int media
    from public.exercise_option_sets s, jsonb_array_elements(s.options) o`);
  assert.ok(counts.with_reading > 0);
  assert.equal(counts.media, 0);
  const nonHan = await one(`select count(*)::int n from public.exercise_option_sets s
    join public.exercise_items i on i.id = s.item_id, jsonb_array_elements(s.options) o
    where i.language_code <> 'zh' and o -> 'reading' <> 'null'`);
  assert.equal(nonHan.n, 0);
});

// --- Pruebas obligatorias ------------------------------------------------------------------------

test('cambiar el texto (y el pinyin) de una palabra no modifica una presentación histórica', async () => {
  await inRollback(async () => {
    const session = randomUUID();
    const { id } = await present(alice, session, ZH_EX);
    const before = await snapshot(id);
    const order = shuffleOrderV1(ZH_SET.options.length, choiceSeed(session, ZH_EX));
    assert.deepEqual(
      before.options_shown,
      order.map((i) => ZH_SET.options[i]),
    );
    // Se reescriben todas las palabras del idioma y la copia de la ubicación (contenido mutable).
    await db.exec(`update public.words set text = text || 'X', romanization = 'cambiado', translation_es = 'otra'
                   where language_code = 'zh'`);
    await db.query(
      `update public.exercises set payload = jsonb_set(payload, '{options}', '["a","b","c","d"]'),
         prompt_es = 'cambiado', answer = 'a' where id = $1`,
      [ZH_EX],
    );
    assert.deepEqual(await snapshot(id), before);
  });
});

test('cambiar los distractores de una ubicación crea un conjunto nuevo, conserva el anterior y su asignación', async () => {
  await inRollback(async () => {
    const before = await placement(VAR_A);
    const oldSet = await one(`select * from public.exercise_option_sets where id = $1`, [
      before.option_set_id,
    ]);
    const shown = await present(alice, randomUUID(), VAR_A);
    const shownBefore = await snapshot(shown.id);
    const versionsBefore = await one(
      `select count(*)::int n from public.exercise_item_versions where item_id = $1`,
      [VAR_ITEM],
    );

    // Otro distractor (el texto de otra opción de su otra ubicación que no esté ya) en la misma ubicación.
    const row = rows.get(VAR_A);
    const other = rows.get(VAR_B).payload.options.find((o) => !row.payload.options.includes(o));
    assert.ok(other, 'la otra ubicación tiene un distractor distinto');
    const replaced = row.payload.options.find((o) => o !== row.answer);
    const options = row.payload.options.map((o) => (o === replaced ? other : o));
    const changed = { ...row, payload: { ...row.payload, options } };
    const plan = buildOptionSets(
      {
        items: [items.get(VAR_ITEM)],
        placements: catalog.placements.filter((p) => p.exercise_id === VAR_A),
      },
      [changed],
      versions,
      doc.words.map((w) => ({
        language_code: w.language_code,
        text: w.text,
        romanization: w.romanization,
      })),
    );
    // Lo que haría content:sql/content:diff: escribe la copia de exercises y carga los conjuntos.
    await db.query(`update public.exercises set payload = $2 where id = $1`, [
      VAR_A,
      changed.payload,
    ]);
    await db.exec(docSql(OPTION_SETS_SQL, plan));
    await db.exec('set constraints all immediate');

    const after = await placement(VAR_A);
    assert.notEqual(after.option_set_id, before.option_set_id);
    assert.equal(after.item_version_id, before.item_version_id, 'misma versión principal');
    const versionsAfter = await one(
      `select count(*)::int n from public.exercise_item_versions where item_id = $1`,
      [VAR_ITEM],
    );
    assert.deepEqual(versionsAfter, versionsBefore, 'sin versión nueva');
    const oldStill = await one(`select * from public.exercise_option_sets where id = $1`, [
      before.option_set_id,
    ]);
    assert.deepEqual(oldStill, oldSet, 'el conjunto anterior no cambia');
    const hist = await all(
      `select option_set_id from public.exercise_option_set_assignments where exercise_id = $1 order by id`,
      [VAR_A],
    );
    assert.deepEqual(
      hist.map((h) => h.option_set_id),
      [before.option_set_id, after.option_set_id],
    );
    // La presentación anterior sigue mostrando las opciones de entonces.
    assert.deepEqual(await snapshot(shown.id), shownBefore);
    // Reaplicar el mismo documento no agrega nada.
    await db.exec(docSql(OPTION_SETS_SQL, plan));
    const again = await one(
      `select count(*)::int n from public.exercise_option_set_assignments where exercise_id = $1`,
      [VAR_A],
    );
    assert.equal(again.n, 2);
  });
});

test('dos presentaciones del mismo ítem pueden tener conjuntos distintos (ubicaciones y sesión, V5.3)', async () => {
  await inRollback(async () => {
    const session = randomUUID();
    const a = await present(alice, session, VAR_A, { position: 1 });
    const b = await present(alice, session, VAR_B, { position: 2 });
    const [sa, sb] = [await snapshot(a.id), await snapshot(b.id)];
    assert.equal(sa.item_version_id, sb.item_version_id);
    assert.notEqual(sa.option_set_id, sb.option_set_id);
    assert.notDeepEqual(
      sa.options_shown.map((o) => o.text).sort(),
      sb.options_shown.map((o) => o.text).sort(),
    );
    // Distractores elegidos por el servidor en una sesión (repaso): conjunto materializado, sin ubicación.
    const v = await one(`select id, answer from public.exercise_item_versions where item_id = $1`, [
      VAR_ITEM,
    ]);
    const opts = [v.answer, 'zz-1', 'zz-2', 'zz-3'].map((text) => ({
      text,
      reading: null,
      audio: null,
      image: null,
    }));
    const hash = optionSetHash({ format: 'polygo.options.v1', options: opts, answer_index: 0 });
    const set = await one(
      `insert into public.exercise_option_sets (item_id, item_version_id, options_hash, format, options,
         answer_index, origin) values ($1, $2, $3, 'polygo.options.v1', $4, 0, 'session') returning id`,
      [VAR_ITEM, v.id, hash, JSON.stringify(opts)],
    );
    const c = await one(
      `insert into public.exercise_presentations (user_id, session_id, item_id, item_version_id, option_set_id,
         option_order, shuffle_algorithm, shuffle_seed)
       values ($1, $2, $3, $4, $5, '{2,0,3,1}', 'polygo.shuffle.v1', 'servidor') returning id`,
      [alice, session, VAR_ITEM, v.id, set.id],
    );
    const sc = await snapshot(c.id);
    assert.equal(sc.exercise_id, null);
    assert.deepEqual(
      sc.options_shown.map((o) => o.text),
      ['zz-2', v.answer, 'zz-3', 'zz-1'],
    );
    assert.equal(
      (
        await one(
          `select count(distinct option_set_id)::int n from public.exercise_presentations where item_id = $1`,
          [VAR_ITEM],
        )
      ).n,
      3,
    );
  });
});

test('se reconstruye exactamente el orden mostrado; el orden registrado manda sobre la semilla', async () => {
  await inRollback(async () => {
    const session = randomUUID();
    const sample = optionSets.placement_option_sets.filter((_, i) => i % 97 === 0);
    assert.ok(sample.length >= 30);
    for (const p of sample) {
      const { id } = await present(alice, session, p.exercise_id);
      const s = await snapshot(id);
      // Lo que dibuja la app (ChoiceInput): shuffle(payload.options, `${sessionId}:${exerciseId}`).
      const app = appShuffle(
        rows.get(p.exercise_id).payload.options,
        choiceSeed(session, p.exercise_id),
      );
      assert.deepEqual(
        s.options_shown.map((o) => o.text),
        app,
        p.exercise_id,
      );
      assert.equal(s.shuffle_algorithm, 'polygo.shuffle.v1');
      assert.equal(s.options_shown[s.option_order.indexOf(s.answer_index)].text, s.answer);
    }
    // Un orden que no es el de la semilla: se guarda y se reconstruye ése.
    const n = (await placement(AUTHORED_EX)).n;
    const order = [...Array(n).keys()].reverse();
    const { id } = await present(alice, session, AUTHORED_EX, { order, seed: 'otra' });
    const s = await snapshot(id);
    assert.deepEqual(s.option_order, order);
    const texts = rows.get(AUTHORED_EX).payload.options;
    assert.deepEqual(
      s.options_shown.map((o) => o.text),
      order.map((i) => texts[i]),
    );
  });
});

test('un orden inválido o un conjunto que no corresponde se rechazan', async () => {
  await inRollback(async () => {
    const p = await placement(AUTHORED_EX);
    const w = await placement(WRITE_EX);
    const insert = (vals) =>
      failure(
        `insert into public.exercise_presentations (user_id, session_id, item_id, item_version_id, exercise_id,
           option_set_id, option_order, shuffle_algorithm) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        vals,
      );
    const s = randomUUID();
    const base = [alice, s, p.item_id, p.item_version_id, AUTHORED_EX, p.option_set_id];
    assert.equal(p.n, 4);
    for (const bad of [
      [0, 0, 1, 2],
      [0, 1, 2],
      [0, 1, 2, 4],
      [1, 2, 3, 4],
      [0, 1, 2, null],
    ]) {
      assert.match(
        String(await insert([...base, bad, 'polygo.shuffle.v1'])),
        /permutación/,
        JSON.stringify(bad),
      );
    }
    // Elección sin conjunto, conjunto sin orden, orden sin algoritmo, algoritmo inexistente.
    assert.match(
      String(await insert([alice, s, p.item_id, p.item_version_id, AUTHORED_EX, null, null, null])),
      /conjunto/,
    );
    assert.match(String(await insert([...base, null, null])), /permutación|order_check/);
    assert.match(String(await insert([...base, [0, 1, 2, 3], null])), /shuffle_check/);
    assert.match(String(await insert([...base, [0, 1, 2, 3], 'polygo.shuffle.v9'])), /foreign key/);
    // Un ítem que no es de elección no lleva conjunto.
    assert.match(
      String(
        await insert([
          alice,
          s,
          w.item_id,
          w.item_version_id,
          WRITE_EX,
          p.option_set_id,
          [0, 1, 2, 3],
          'polygo.shuffle.v1',
        ]),
      ),
      /conjunto|foreign key/,
    );
    // La ubicación tiene que mostrar hoy esa versión y ese conjunto.
    const other = await placement(VAR_B);
    const varA = await placement(VAR_A);
    assert.match(
      String(
        await insert([
          alice,
          s,
          varA.item_id,
          varA.item_version_id,
          VAR_A,
          other.option_set_id,
          [0, 1, 2, 3],
          'polygo.shuffle.v1',
        ]),
      ),
      /no muestra hoy/,
    );
    // Sin ubicación, el texto de un ejercicio sin elección sí se registra sin conjunto.
    assert.equal(
      await insert([alice, s, w.item_id, w.item_version_id, WRITE_EX, null, null, null]),
      null,
    );
  });
});

test('un ejercicio abandonado conserva su presentación; las presentaciones no se modifican ni se borran', async () => {
  await inRollback(async () => {
    const session = randomUUID();
    const answered = await present(alice, session, VAR_A, { position: 1 });
    const abandoned = await present(alice, session, VAR_B, { position: 2 });
    // La app envía la sesión al final, sólo con lo respondido (ruta vieja).
    const [attemptId] = await legacySession(alice, session, [{ exercise_id: VAR_A }]);
    await link(attemptId, answered.id);
    const kept = await one(
      `select p.id, l.attempt_id from public.exercise_presentations p
       left join public.exercise_attempt_presentations l on l.presentation_id = p.id where p.id = $1`,
      [abandoned.id],
    );
    assert.deepEqual(kept, { id: abandoned.id, attempt_id: null });
    const s = await snapshot(abandoned.id);
    assert.equal(s.exercise_id, VAR_B);
    assert.equal(s.options_shown.length, (await placement(VAR_B)).n);

    for (const sql of [
      `update public.exercise_presentations set option_order = '{0,1,2,3}' where id = ${abandoned.id}`,
      `delete from public.exercise_presentations where id = ${abandoned.id}`,
      `truncate public.exercise_presentations cascade`,
      `update public.exercise_attempt_presentations set presentation_id = ${abandoned.id}`,
      `delete from public.exercise_attempt_presentations`,
    ]) {
      assert.match(String(await failure(sql)), /inmutables/, sql);
    }
    // Borrar la cuenta sí las elimina (cascada desde profiles).
    const carol = await createUser(db, 'carol@test.dev');
    const c = await present(carol, randomUUID(), VAR_A);
    await db.query(`delete from auth.users where id = $1`, [carol]);
    assert.equal(
      (await one(`select count(*)::int n from public.exercise_presentations where id = $1`, [c.id]))
        .n,
      0,
    );
  });
});

test('un intento referencia la presentación que recibió: mismo usuario, sesión y ubicación, después de mostrarse', async () => {
  await inRollback(async () => {
    const session = randomUUID();
    const pa = await present(alice, session, VAR_A);
    const pb = await present(alice, session, VAR_B);
    const otherSession = randomUUID();
    const po = await present(alice, otherSession, VAR_A);
    const pbob = await present(bob, session, VAR_A);
    const [a1, a2, early] = await legacySession(alice, session, [
      { exercise_id: VAR_A },
      { exercise_id: VAR_A },
      { exercise_id: VAR_A, at: new Date(Date.now() - 3_600_000).toISOString() },
    ]);
    await link(a1, pa.id);
    await link(a2, pa.id); // reintento sobre la misma presentación
    for (const [attempt, pres, why] of [
      [early, pa.id, 'respondido antes de mostrarse'],
      [early, pb.id, 'otra ubicación'],
      [early, po.id, 'otra sesión'],
      [early, pbob.id, 'otro usuario'],
    ]) {
      assert.match(
        String(
          await failure(`insert into public.exercise_attempt_presentations values ($1, $2)`, [
            attempt,
            pres,
          ]),
        ),
        /no es de la presentación/,
        why,
      );
    }
    assert.match(
      String(
        await failure(`insert into public.exercise_attempt_presentations values ($1, $2)`, [
          a1,
          pa.id,
        ]),
      ),
      /duplicate key|unique/,
    );
    const view = await all(
      `select attempt_id, presentation_id, status, reason from public.exercise_attempt_reconstruction
       where session_id = $1 order by attempt_id`,
      [session],
    );
    assert.deepEqual(view, [
      { attempt_id: a1, presentation_id: pa.id, status: 'reconstructible', reason: null },
      { attempt_id: a2, presentation_id: pa.id, status: 'reconstructible', reason: null },
      {
        attempt_id: early,
        presentation_id: null,
        status: 'not_reconstructible',
        reason: 'no_presentation_record',
      },
    ]);
    // Borrar el intento (cascada de la sesión) elimina el vínculo, no la presentación.
    await db.query(`delete from public.learning_sessions where id = $1`, [session]);
    assert.equal(
      (
        await one(
          `select count(*)::int n from public.exercise_attempt_presentations where presentation_id = $1`,
          [pa.id],
        )
      ).n,
      0,
    );
    assert.equal(
      (
        await one(`select count(*)::int n from public.exercise_presentations where id = $1`, [
          pa.id,
        ])
      ).n,
      1,
    );
  });
});

test('regenerar el catálogo y reaplicar las migraciones no sobrescribe ni destruye opciones históricas', async () => {
  const digest = () =>
    one(`select (select md5(string_agg(to_jsonb(s)::text, '|' order by s.id)) from public.exercise_option_sets s) sets,
                (select md5(string_agg(to_jsonb(a)::text, '|' order by a.id)) from public.exercise_option_set_assignments a) asg,
                (select md5(string_agg(e.id || ':' || coalesce(e.option_set_id::text, '-') || ':' || coalesce(e.item_version_id::text, '-'),
                                       '|' order by e.id)) from public.exercises e) placed`);
  const before = await digest();
  await inRollback(async () => {
    await db.exec(migration('20261108130000_learning_option_sets.sql'));
    for (const f of [...VERSION_FILES, ...SET_FILES]) await db.exec(migration(f));
    await db.exec(docSql(FULL_CATALOG_SQL(), catalogPayload(catalog, versions, optionSets)));
    await db.exec('set constraints all immediate');
    assert.deepEqual(await digest(), before);

    // Un documento con el mismo hash y otras opciones aborta en vez de pisar el conjunto.
    const s = optionSets.option_sets[0];
    const tampered = {
      option_sets: [{ ...s, options: [...s.options].reverse() }],
      placement_option_sets: [],
    };
    assert.match(
      String(await failure(docSql(OPTION_SETS_SQL, tampered))),
      /mismo hash y otras opciones/,
    );
    // Y nada se puede modificar ni borrar a mano.
    for (const sql of [
      `update public.exercise_option_sets set answer_index = 0`,
      `delete from public.exercise_option_sets`,
      `truncate public.exercise_option_sets cascade`,
      `update public.exercise_option_set_assignments set assigned_at = now()`,
      `delete from public.exercise_option_set_assignments`,
      `update public.ref_shuffle_algorithms set description = 'x'`,
    ]) {
      assert.match(String(await failure(sql)), /inmutables/, sql);
    }
  });
  assert.deepEqual(await digest(), before);
});

test('los intentos antiguos no reciben información inventada: quedan no reconstruibles y sin cambios', async () => {
  // Una base con las migraciones previas a esta, intentos de la ruta vieja, y después el resto.
  const files = readdirSync(MIGRATIONS)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  const cut = files.indexOf('20261108130000_learning_option_sets.sql');
  assert.ok(cut > 0);
  const old = await createDb({ files: files.slice(0, cut) });
  const user = (
    await old.query(`insert into auth.users (email) values ('old@test.dev') returning id`)
  ).rows[0].id;
  const ex = (await old.query(`select id from public.exercises where id = $1`, [VAR_A])).rows[0].id;
  const session = randomUUID();
  await legacySession(
    user,
    session,
    [
      { exercise_id: ex, answer: 'algo', correct: true },
      { word_id: null, answer: 'repaso' },
    ],
    old,
  );
  const before = (
    await old.query(`select to_jsonb(a) j from public.exercise_attempts a order by id`)
  ).rows;
  const sessions = (
    await old.query(`select to_jsonb(s) j from public.learning_sessions s order by id`)
  ).rows;

  // El resto, incluida 20261108140000_learning_versions_required.sql (V8 y V8.1).
  assert.ok(files.slice(cut).includes('20261108140000_learning_versions_required.sql'));
  for (const f of files.slice(cut)) await old.exec(readFileSync(new URL(f, MIGRATIONS), 'utf8'));

  assert.deepEqual(
    (await old.query(`select to_jsonb(a) j from public.exercise_attempts a order by id`)).rows,
    before,
  );
  assert.deepEqual(
    (await old.query(`select to_jsonb(s) j from public.learning_sessions s order by id`)).rows,
    sessions,
  );
  const counts = (
    await old.query(`select (select count(*)::int from public.exercise_presentations) p,
      (select count(*)::int from public.exercise_attempt_presentations) l`)
  ).rows[0];
  assert.deepEqual(counts, { p: 0, l: 0 });
  const view = (
    await old.query(
      `select status, reason, presentation_id from public.exercise_attempt_reconstruction`,
    )
  ).rows;
  assert.equal(view.length, 2);
  for (const v of view) {
    assert.deepEqual(v, {
      status: 'not_reconstructible',
      reason: 'no_presentation_record',
      presentation_id: null,
    });
  }
  // Las columnas de exercise_attempts no cambiaron.
  const cols = (
    await old.query(`select column_name from information_schema.columns
     where table_schema = 'public' and table_name = 'exercise_attempts' order by ordinal_position`)
  ).rows;
  assert.deepEqual(
    cols.map((c) => c.column_name),
    [
      'id',
      'session_id',
      'user_id',
      'exercise_id',
      'word_id',
      'skill',
      'answer',
      'is_correct',
      'is_first_try',
      'response_ms',
      'created_at',
    ],
  );
  await old.close();
});

test('integridad: FK y coherencia entre ubicación, versión y conjunto', async () => {
  await inRollback(async () => {
    const a = await placement(VAR_A);
    const w = await placement(WRITE_EX);
    const auth = await placement(AUTHORED_EX);
    // Un conjunto de otra versión no se puede asignar (FK compuesta diferida).
    assert.match(
      String(
        await failure(`update public.exercises set option_set_id = $2 where id = $1`, [
          AUTHORED_EX,
          a.option_set_id,
        ]),
      ),
      /foreign key/,
    );
    // Conjunto sin versión en la ubicación: con V8 lo rechaza primero el NOT NULL de item_version_id
    // (el trigger diferido sigue en su lugar).
    assert.match(
      String(
        await failure(`update public.exercises set item_version_id = null where id = $1`, [
          AUTHORED_EX,
        ]),
      ),
      /column "item_version_id" .* not-null|sin versión|foreign key/,
    );
    const v = await one(
      `select id, answer, payload from public.exercise_item_versions where item_id = $1`,
      [VAR_ITEM],
    );
    const entry = (text, extra = {}) => ({
      text,
      reading: null,
      audio: null,
      image: null,
      ...extra,
    });
    const insertSet = (itemId, versionId, options, answerIndex = 0) =>
      failure(
        `insert into public.exercise_option_sets (item_id, item_version_id, options_hash, format, options, answer_index, origin)
         values ($1, $2, 'v1:' || $5, 'polygo.options.v1', $3, $4, 'session')`,
        [
          itemId,
          versionId,
          JSON.stringify(options),
          answerIndex,
          randomUUID().replace(/-/g, '').repeat(2),
        ],
      );
    const ok = [v.answer, 'b', 'c'].map((t) => entry(t));
    assert.equal(await insertSet(VAR_ITEM, v.id, ok), null);
    for (const [opts, idx, re] of [
      [[entry('b'), entry(v.answer)], 0, /no es la respuesta/],
      [[entry(v.answer), entry(v.answer)], 0, /repetidas/],
      [[entry(v.answer)], 0, /opciones/],
      [[entry(v.answer), entry('b', { audio: { kind: 'tts' } })], 0, /formato/],
      [[entry(v.answer), { text: 'b', reading: null, audio: null }], 0, /formato/],
      [[entry(v.answer), entry('b', { reading: [{ text: 'c', reading: 'x' }] })], 0, /formato/],
      [[entry(v.answer), entry('')], 0, /formato/],
    ]) {
      assert.match(String(await insertSet(VAR_ITEM, v.id, opts, idx)), re, JSON.stringify(opts));
    }
    // Un ítem que guarda sus opciones en la versión sólo admite esas opciones.
    const av = await one(
      `select id, answer, payload from public.exercise_item_versions where id = $1`,
      [auth.item_version_id],
    );
    assert.match(
      String(
        await insertSet(
          auth.item_id,
          av.id,
          [av.answer, 'zzz'].map((t) => entry(t)),
        ),
      ),
      /no son las de la versión/,
    );
    // Un ítem que no es de elección no tiene conjuntos; un conjunto de otro ítem no pasa la FK.
    assert.match(String(await insertSet(w.item_id, w.item_version_id, ok)), /no es de elección/);
    assert.match(String(await insertSet(auth.item_id, v.id, ok)), /foreign key|no es la respuesta/);
  });
});

test('la reconstrucción no lee contenido mutable; nada nuevo es accesible para anon ni authenticated', async () => {
  const fn = await one(
    `select prosrc from pg_proc where proname = 'exercise_presentation_snapshot'`,
  );
  for (const mutable of [
    /public\.exercises\b/,
    /public\.words\b/,
    /public\.exercise_items\b/,
    /public\.lessons\b/,
  ]) {
    assert.ok(!mutable.test(fn.prosrc), String(mutable));
  }
  for (const [role, user] of [
    ['anon', null],
    ['authenticated', alice],
  ]) {
    for (const t of [
      'exercise_option_sets',
      'exercise_option_set_assignments',
      'exercise_presentations',
      'exercise_attempt_presentations',
      'exercise_attempt_reconstruction',
      'ref_shuffle_algorithms',
    ]) {
      await assert.rejects(
        as(db, role, user, () => db.query(`select 1 from public.${t} limit 1`)),
        /permission denied/,
        `${role} ${t}`,
      );
    }
    await assert.rejects(
      as(db, role, user, () => db.query(`select public.exercise_presentation_snapshot(1)`)),
      /permission denied/,
    );
  }
  for (const t of [
    'exercise_option_sets',
    'exercise_option_set_assignments',
    'exercise_presentations',
    'exercise_attempt_presentations',
    'ref_shuffle_algorithms',
  ]) {
    const r = await one(`select relrowsecurity from pg_class where oid = $1::regclass`, [
      `public.${t}`,
    ]);
    assert.equal(r.relrowsecurity, true, t);
  }
  // La app sigue leyendo exercises igual (opciones incluidas).
  const r = await as(db, 'authenticated', alice, () =>
    db.query(`select payload from public.exercises where id = $1`, [VAR_A]),
  );
  assert.deepEqual(r.rows[0].payload, rows.get(VAR_A).payload);
});

test('el SRS v1 y Ranked no cambian', async () => {
  const defs = await all(`
    select p.proname, pg_get_functiondef(p.oid) def from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and (p.proname in ('submit_learning_session', 'apply_word_result', 'srs_config', 'parse_learning_attempts')
           or p.proname like '%ranked%' or p.proname like '%battle%')`);
  assert.ok(defs.length >= 4);
  for (const d of defs) {
    assert.ok(!/option_set|presentation|item_version|shuffle_algorithm/.test(d.def), d.proname);
  }
  const triggers = await all(`select tgrelid::regclass::text t, tgname from pg_trigger
    where not tgisinternal and tgname ~ '(option_set|presentation)'`);
  for (const t of triggers) {
    assert.ok(
      [
        'exercises',
        'exercise_option_sets',
        'exercise_option_set_assignments',
        'exercise_presentations',
        'exercise_attempt_presentations',
        // Fase 4: respuestas corregidas durante un repaso del servidor (20261110120000).
        'review_presentation_answers',
        // Cierre de la fase 4: repeticiones de errores (20261110140000, P4).
        'review_presentation_retries',
      ].includes(t.t),
      `${t.t}.${t.tgname}`,
    );
  }
});

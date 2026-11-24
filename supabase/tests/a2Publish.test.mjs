// Publicación de inglés A2 U13–U17 (docs/A2_EN_COMPLETION.md §5, supabase/pending/), probada en PGlite sobre la base que
// dejan TODAS las migraciones anteriores (incluida la carga 20261120120000). Comprueba que sólo cambia
// el estado de las filas de la carga, que es idempotente, que aborta ante datos inesperados, que la app
// y el desbloqueo encadenan U13 después de U12 y qué toman los repasos y Ranked. Todo en una base
// desechable: nada se aplica en otra parte.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { answerAll, helpers } from './learningHelpers.mjs';
import { A2_PUBLISH_MIGRATION, a2PublishSql } from '../../scripts/build-a2-publish-sql.ts';
import { A2_EXPANSION_PATH } from '../../content/a2-expansion.ts';

const MIGRATION = A2_PUBLISH_MIGRATION;
const migrationsDir = new URL('../migrations/', import.meta.url);
// La publicación vive en supabase/pending/ hasta el día de publicar (no la aplica quien aplique las
// migraciones pendientes): se prueba sobre la base que dejan TODAS las migraciones de migrations/.
const pendingDir = new URL('../pending/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, pendingDir), 'utf8');
const { ids } = a2PublishSql();
const LESSONS = A2_EXPANSION_PATH.flatMap((p) => p.lessons);

const TABLES = [
  'curriculum_units',
  'words',
  'lessons',
  'exercises',
  'exercise_words',
  'concepts',
  'exercise_items',
  'item_concepts',
  'exercise_item_versions',
  'exercise_option_sets',
  'exercise_option_set_assignments',
  'curriculum_routes',
  'curriculum_route_units',
  'learning_objectives',
];

let db;
let h;
let beforeRows;
let afterRows;

async function snapshot() {
  const out = {};
  for (const t of TABLES) {
    out[t] = (
      await db.query(
        `select (to_jsonb(x) - 'created_at' - 'updated_at')::text r from public.${t} x order by 1`,
      )
    ).rows.map((r) => r.r);
  }
  return out;
}

async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err;
  }
}

before(async () => {
  const all = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  assert.ok(all.includes('20261120120000_a2_en_completion.sql'));
  // Posteriores a esta publicación sólo están las cargas del B1, del B2 y del portugués A1/A2 (sin
  // publicar): la publicación del A2 sobre una base con el B1 (y el B2) cargado se prueba en b1Content y
  // b2Content.test.mjs; el portugués no enlaza nada del inglés.
  assert.deepEqual(
    all.filter((f) => f > MIGRATION),
    [
      '20261122120000_b1_en.sql',
      '20261124120000_b2_en.sql',
      '20261126120000_pt_a1_a2.sql',
      '20261128120000_it_a1_a2.sql',
      '20261130120000_zh_a1_a2.sql',
      '20261202120000_fr_a1_a2.sql',
      '20261204120000_es_a1_a2.sql',
    ],
    'migraciones posteriores a la publicación',
  );
  const files = all.filter((f) => f < MIGRATION);
  db = await createDb({ files });
  h = helpers(db);
  beforeRows = await snapshot();
});

test('la migración es la salida exacta del generador y sólo hace UPDATE de estado', () => {
  const sql = migration(MIGRATION);
  assert.equal(sql, a2PublishSql().sql);
  const text = sql
    .replace(/\$ids\$[\s\S]*?\$ids\$/, '')
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('--'))
    .join('\n')
    .toLowerCase();
  for (const word of [
    'delete ',
    'drop ',
    'truncate',
    'alter ',
    'create ',
    'insert ',
    'grant ',
    'revoke ',
    'policy',
    'ranked',
    'battle',
    'srs_v2',
    'mastery',
    'adaptive',
    'curriculum_route',
  ]) {
    assert.ok(!text.includes(word), `menciona ${word}`);
  }
  const updates = [...text.matchAll(/update public\.(\w+)/g)].map((m) => m[1]);
  assert.deepEqual(updates, [
    'curriculum_units',
    'words',
    'lessons',
    'exercises',
    'concepts',
    'exercise_items',
  ]);
});

test('aborta si los datos no son los de la carga (y no cambia nada)', async () => {
  await db.query(`update public.curriculum_units set position = 18 where id = 'a2-u17'`);
  const err = await errorOf(db.exec(migration(MIGRATION)));
  assert.match(String(err?.message), /a2_publish: unidades que no existen o no son de inglés A2/);
  await db.query(`update public.curriculum_units set position = 17 where id = 'a2-u17'`);
  assert.deepEqual(await snapshot(), beforeRows);
});

test('publica exactamente la carga; todo lo demás (A2 U1–U12, A1, otros idiomas) queda igual', async () => {
  await db.exec(migration(MIGRATION));
  afterRows = await snapshot();
  const changed = {};
  for (const t of TABLES) {
    const after = new Set(afterRows[t]);
    const gone = beforeRows[t].filter((r) => !after.has(r));
    assert.equal(afterRows[t].length, beforeRows[t].length, `${t}: cambió la cantidad de filas`);
    changed[t] = gone.map((r) => JSON.parse(r).id ?? JSON.parse(r).unit_id).sort();
  }
  const sorted = (a) => [...a].sort();
  assert.deepEqual(changed, {
    curriculum_units: sorted(ids.units),
    words: sorted(ids.words),
    lessons: sorted(ids.lessons),
    exercises: sorted(ids.exercises),
    exercise_words: [],
    concepts: sorted(ids.words),
    exercise_items: sorted(ids.items),
    item_concepts: [],
    exercise_item_versions: [],
    exercise_option_sets: [],
    exercise_option_set_assignments: [],
    curriculum_routes: [],
    curriculum_route_units: [],
    learning_objectives: [],
  });
  // Sólo cambió el estado: el resto de cada fila es idéntico.
  const strip = (t, key) =>
    afterRows[t]
      .map((r) => {
        const o = JSON.parse(r);
        delete o[key];
        return JSON.stringify(o);
      })
      .sort();
  const stripBefore = (t, key) =>
    beforeRows[t]
      .map((r) => {
        const o = JSON.parse(r);
        delete o[key];
        return JSON.stringify(o);
      })
      .sort();
  for (const [t, key] of [
    ['curriculum_units', 'is_published'],
    ['words', 'is_published'],
    ['lessons', 'is_published'],
    ['exercises', 'is_published'],
    ['concepts', 'status'],
    ['exercise_items', 'status'],
  ])
    assert.deepEqual(strip(t, key), stripBefore(t, key), `${t}: cambió algo más que ${key}`);

  const a2 = await h.one(
    `select count(*) filter (where is_published)::int pub, count(*)::int n from public.curriculum_units
      where language_code = 'en' and level = 'A2'`,
  );
  assert.deepEqual(a2, { pub: 17, n: 17 });
  const draft = await h.one(
    `select count(*) filter (where status = 'draft')::int n, count(*) filter (where type = 'context_choice')::int cc
       from public.exercise_items where id = any($1)`,
    [ids.draft_items],
  );
  assert.deepEqual(draft, { n: ids.draft_items.length, cc: ids.draft_items.length });
});

test('reaplicar no cambia nada', async () => {
  await db.exec(migration(MIGRATION));
  assert.deepEqual(await snapshot(), afterRows);
});

test('la app ve U13–U17 y el desbloqueo las encadena después de U12', async () => {
  const user = await createUser(db, 'a2publish-app@test.dev');
  const seen = await as(
    db,
    'authenticated',
    user,
    async () =>
      (
        await db.query(
          `select (select count(*)::int from public.curriculum_units where id = any($1)) units,
                (select count(*)::int from public.words where id = any($2)) words,
                (select count(*)::int from public.lessons where id = any($3)) lessons`,
          [ids.units, ids.words, ids.lessons],
        )
      ).rows[0],
  );
  assert.deepEqual(seen, {
    units: ids.units.length,
    words: ids.words.length,
    lessons: ids.lessons.length,
  });
  assert.equal(
    (await h.one(`select public.is_lesson_unlocked($1, 'a2-u13-l01') ok`, [user])).ok,
    false,
  );
  const afterU12 = await h.learner('a2-u12-final');
  assert.equal(
    (await h.one(`select public.is_lesson_unlocked($1, 'a2-u13-l01') ok`, [afterU12])).ok,
    true,
  );
  // A2 U1 sigue siendo la primera del nivel.
  assert.equal(
    (await h.one(`select public.is_lesson_unlocked($1, 'a2-u01-l01') ok`, [user])).ok,
    true,
  );
});

test(
  'cada lección publicada se juega completa con la corrección del servidor',
  { timeout: 600_000 },
  async () => {
    let previous = 'a2-u12-final';
    for (const l of LESSONS) {
      const user = await h.learner(previous);
      const session = randomUUID();
      const started = await h.startLesson(user, session, l.id);
      assert.equal(started.presentations.length, l.exercises.length, l.id);
      const r = await h.submitLesson(
        user,
        session,
        l.id,
        answerAll(await h.snapshotsOf(user, session)),
      );
      assert.deepEqual(
        [l.id, r.first_try_correct, r.first_try_total],
        [l.id, l.exercises.length, l.exercises.length],
      );
      previous = l.id;
    }
  },
);

test('repasos: entran los ítems activos; la comprensión (draft) no', async () => {
  const rows = await h.all(`select item_id from public.review_item_candidates('en')`);
  const candidates = new Set(rows.map((r) => r.item_id));
  assert.ok(
    ids.items.some((id) => candidates.has(id)),
    'ningún ítem nuevo es candidato',
  );
  assert.deepEqual(
    ids.draft_items.filter((id) => candidates.has(id)),
    [],
  );
});

test('Ranked: A2 no tiene rutas, así que sus unidades nuevas entran al conjunto común', async () => {
  const a = await createUser(db, 'a2publish-ranked-a@test.dev');
  const b = await createUser(db, 'a2publish-ranked-b@test.dev');
  const units = (
    await h.one(`select public.rush_common_unit_ids('en', $1::uuid[], null) r`, [[a, b]])
  ).r;
  for (const u of ids.units) assert.ok(units.includes(u), u);
  const words = await h.one(
    `select count(*)::int n from public.words where id = any($1) and is_published`,
    [ids.words],
  );
  assert.equal(words.n, ids.words.length);
});

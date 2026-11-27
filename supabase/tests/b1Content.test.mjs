// Inglés B1 (docs/B1_EN.md): las 12 unidades nuevas, probadas en PGlite. La base se arma con todas las
// migraciones anteriores (incluida la carga del A2 nuevo) y después se aplica 20261122120000_b1_en.sql:
// se comprueba fila a fila que sólo agrega, que el único cambio de esquema es el CHECK de nivel y que no
// publica nada. La última parte, DENTRO de esta base desechable (nunca en otra parte), aplica la
// publicación del A2 nuevo y la del B1 (supabase/pending/), comprueba que es idempotente y juega cada
// lección del B1 con la corrección del servidor, encadenada por el desbloqueo.
import { withNeutralSpanish } from '../../scripts/neutral-patch.ts';
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { answerAll, helpers } from './learningHelpers.mjs';
import { B1_LEVEL_SQL, B1_MIGRATION, b1Sql } from '../../scripts/build-b1-sql.ts';
import { B1_PUBLISH_MIGRATION, b1PublishSql } from '../../scripts/build-b1-publish-sql.ts';
import { A2_PUBLISH_MIGRATION } from '../../scripts/build-a2-publish-sql.ts';
import { B1_PATH } from '../../content/b1.ts';

const migrationsDir = new URL('../migrations/', import.meta.url);
const pendingDir = new URL('../pending/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, migrationsDir), 'utf8');
const pending = (name) => readFileSync(new URL(name, pendingDir), 'utf8');

const UNITS = B1_PATH.map((p) => `b1-u${String(p.unit.position).padStart(2, '0')}`);
const LESSONS = B1_PATH.flatMap((p) => p.lessons);
const LESSON_IDS = LESSONS.map((l) => l.id);
const WORDS = B1_PATH.flatMap((p) => p.unit.words.map((w) => w.id));
const EXERCISE_IDS = LESSONS.flatMap((l) =>
  l.exercises.map((_, i) => `${l.id}-e${String(i + 1).padStart(2, '0')}`),
);

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
  'content_personas',
  'curriculum_routes',
  'curriculum_route_units',
  'learning_objectives',
  'objective_concepts',
  'lesson_objectives',
  'item_objectives',
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

const levelCheck = async () =>
  (
    await db.query(
      `select pg_get_constraintdef(oid) def from pg_constraint
        where conrelid = 'public.curriculum_units'::regclass and conname = 'curriculum_units_level_check'`,
    )
  ).rows.map((r) => r.def);

before(async () => {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && f < B1_MIGRATION)
    .sort();
  db = await createDb({ files });
  h = helpers(db);
  beforeRows = await snapshot();
  await db.exec(migration(B1_MIGRATION));
  afterRows = await snapshot();
});

test('la migración es la salida exacta del generador; fuera del CHECK de nivel no tiene sentencias destructivas', () => {
  const { sql } = b1Sql();
  assert.equal(withNeutralSpanish(migration(B1_MIGRATION)), sql);
  assert.ok(sql.includes(B1_LEVEL_SQL));
  const text = sql
    .replace(B1_LEVEL_SQL, '')
    .replace(/\$content\$[\s\S]*?\$content\$/, '')
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
    'grant ',
    'revoke ',
    'policy',
    'set is_published',
    'is_published = true',
    'ranked',
    'battle',
    'user_word_progress',
    'srs_v2',
    'mastery',
    'adaptive',
    'is_lesson_unlocked',
    'curriculum_route',
  ]) {
    assert.ok(!text.includes(word), `menciona ${word}`);
  }
});

test('el CHECK de nivel admite B1 (y nada más nuevo)', async () => {
  const [def] = await levelCheck();
  assert.match(def, /'A1'/);
  assert.match(def, /'A2'/);
  assert.match(def, /'B1'/);
  assert.doesNotMatch(def, /'B2'/);
});

test('add-only: ninguna fila anterior cambia y se agregan exactamente las del B1', () => {
  const added = {};
  for (const t of TABLES) {
    const after = new Set(afterRows[t]);
    assert.deepEqual(
      beforeRows[t].filter((r) => !after.has(r)),
      [],
      `${t}: filas cambiadas o borradas`,
    );
    added[t] = afterRows[t].length - beforeRows[t].length;
  }
  const doc = b1Sql().document;
  assert.deepEqual(added, {
    curriculum_units: UNITS.length,
    words: WORDS.length,
    lessons: LESSON_IDS.length,
    exercises: EXERCISE_IDS.length,
    exercise_words: doc.exercises.reduce((n, e) => n + new Set(e.words).size, 0),
    concepts: WORDS.length,
    exercise_items: doc.catalog.items.length,
    item_concepts: doc.catalog.item_concepts.length,
    exercise_item_versions: doc.versions.versions.length,
    exercise_option_sets: doc.optionSets.option_sets.length,
    exercise_option_set_assignments: doc.optionSets.placement_option_sets.length,
    content_personas: 0,
    curriculum_routes: 0,
    curriculum_route_units: 0,
    learning_objectives: 0,
    objective_concepts: 0,
    lesson_objectives: 0,
    item_objectives: 0,
  });
});

test('reaplicar no cambia nada; si una fila cargada difiere, aborta', async () => {
  await db.exec(migration(B1_MIGRATION));
  assert.deepEqual(await snapshot(), afterRows);
  assert.equal((await levelCheck()).length, 1);
  await db.query(`update public.words set translation_es = 'otra' where id = 'en-gone'`);
  const err = await errorOf(db.exec(migration(B1_MIGRATION)));
  assert.match(String(err?.message), /b1_load: palabras ya cargadas con otros datos/);
  await db.query(`update public.words set translation_es = 'ido (go)' where id = 'en-gone'`);
  assert.deepEqual(await snapshot(), afterRows);
});

test('todo nace sin publicar, en B1 y con los ítems en draft; A1 y A2 siguen igual', async () => {
  const units = await h.all(
    `select id, level, position, is_published from public.curriculum_units where id = any($1) order by id`,
    [UNITS],
  );
  assert.deepEqual(
    units.map((u) => [u.id, u.level, u.position, u.is_published]),
    B1_PATH.map((p) => [
      `b1-u${String(p.unit.position).padStart(2, '0')}`,
      'B1',
      p.unit.position,
      false,
    ]),
  );
  for (const [table, ids] of [
    ['words', WORDS],
    ['lessons', LESSON_IDS],
    ['exercises', EXERCISE_IDS],
  ]) {
    const r = await h.one(
      `select count(*)::int n, count(*) filter (where is_published)::int pub from public.${table} where id = any($1)`,
      [ids],
    );
    assert.deepEqual(r, { n: ids.length, pub: 0 }, table);
  }
  const items = await h.one(
    `select count(*) filter (where i.status <> 'draft')::int n,
            count(*) filter (where i.level <> 'B1')::int other_level
       from public.exercises e join public.exercise_items i on i.id = e.item_id where e.id = any($1)`,
    [EXERCISE_IDS],
  );
  assert.deepEqual(items, { n: 0, other_level: 0 });
});

test('la app no ve las unidades, palabras, lecciones ni ejercicios nuevos, ni puede empezarlos', async () => {
  const user = await createUser(db, 'b1-app@test.dev');
  const seen = await as(
    db,
    'authenticated',
    user,
    async () =>
      (
        await db.query(
          `select (select count(*)::int from public.curriculum_units where id = any($1)) units,
                (select count(*)::int from public.words where id = any($2)) words,
                (select count(*)::int from public.lessons where id = any($3)) lessons,
                (select count(*)::int from public.exercises where id = any($4)) exercises`,
          [UNITS, WORDS, LESSON_IDS, EXERCISE_IDS],
        )
      ).rows[0],
  );
  assert.deepEqual(seen, { units: 0, words: 0, lessons: 0, exercises: 0 });
  const err = await errorOf(h.startLesson(user, randomUUID(), 'b1-u01-l01'));
  assert.match(String(err?.message), /lesson_not_found/);
});

test('los ítems nuevos no son candidatos de ningún repaso', async () => {
  const ids = new Set(
    (await h.all(`select item_id from public.exercises where id = any($1)`, [EXERCISE_IDS])).map(
      (r) => r.item_id,
    ),
  );
  const exists = await h.one(
    `select count(*)::int n from pg_proc where proname = 'review_item_candidates'`,
  );
  if (exists.n) {
    const rows = await h.all(`select item_id from public.review_item_candidates('en')`);
    assert.equal(rows.filter((r) => ids.has(r.item_id)).length, 0);
  }
});

test(
  'publicación (en la base desechable): idempotente, sólo cambia el estado y cada lección se juega',
  { timeout: 1_800_000 },
  async () => {
    // Orden de publicación: primero el A2 nuevo (B1 enlaza palabras de A2 U13–U17), después el B1.
    await db.exec(pending(A2_PUBLISH_MIGRATION));
    const beforePublish = await snapshot();
    const sql = pending(B1_PUBLISH_MIGRATION);
    assert.equal(sql, b1PublishSql().sql);
    await db.exec(sql);
    const published = await snapshot();
    await db.exec(sql);
    assert.deepEqual(await snapshot(), published, 'reaplicar la publicación no cambia nada');

    // Sólo cambian filas del B1 (unidades, palabras, lecciones, ejercicios, conceptos e ítems).
    const { ids } = b1PublishSql();
    const own = new Set([
      ...ids.units,
      ...ids.words,
      ...ids.lessons,
      ...ids.exercises,
      ...ids.items,
      ...ids.draft_items,
    ]);
    for (const t of TABLES) {
      const after = new Set(published[t]);
      for (const r of beforePublish[t].filter((x) => !after.has(x))) {
        const id = JSON.parse(r).id;
        assert.ok(own.has(id), `${t}: cambió ${id}, que no es del B1`);
      }
    }
    const state = await h.one(
      `select (select count(*)::int from public.curriculum_units where id = any($1) and is_published) units,
              (select count(*)::int from public.exercise_items where id = any($2) and status = 'active') active,
              (select count(*)::int from public.exercise_items where id = any($3) and status = 'draft') draft`,
      [ids.units, ids.items, ids.draft_items],
    );
    assert.deepEqual(state, {
      units: UNITS.length,
      active: ids.items.length,
      draft: ids.draft_items.length,
    });

    // La primera lección del B1 abre el nivel (como la primera del A2); las demás se encadenan.
    const fresh = await createUser(db, 'b1-fresh@test.dev');
    assert.equal(
      (await h.one(`select public.is_lesson_unlocked($1, 'b1-u01-l01') ok`, [fresh])).ok,
      true,
    );
    assert.equal(
      (await h.one(`select public.is_lesson_unlocked($1, 'b1-u01-l02') ok`, [fresh])).ok,
      false,
    );

    let previous = null;
    for (const l of LESSONS) {
      const user = await h.learner(previous);
      assert.equal(
        (await h.one(`select public.is_lesson_unlocked($1, $2) ok`, [user, l.id])).ok,
        true,
        l.id,
      );
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

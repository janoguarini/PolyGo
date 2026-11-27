// Español A1 U1–U17 y A2 U1–U12 (docs/ES_A1_A2.md), probado en PGlite. La base se arma con
// todas las migraciones anteriores (las cargas de los demás idiomas incluidas) y después se
// aplica 20261204120000_es_a1_a2.sql: se comprueba fila a fila que sólo agrega, que no cambia el esquema y
// que no publica nada. La última parte, DENTRO de esta base desechable (nunca en otra parte), aplica la
// publicación (supabase/pending/), comprueba que es idempotente y que sólo cambia filas propias, y juega
// cada lección con la corrección del servidor, encadenada por el desbloqueo.
import { withNeutralSpanish } from '../../scripts/neutral-patch.ts';
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { answerAll, helpers } from './learningHelpers.mjs';
import { ES_MIGRATION, esSql } from '../../scripts/build-es-sql.ts';
import { ES_PUBLISH_MIGRATION, esPublishSql } from '../../scripts/build-es-publish-sql.ts';
import { ES_PATH } from '../../content/es-course.ts';

const migrationsDir = new URL('../migrations/', import.meta.url);
const pendingDir = new URL('../pending/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, migrationsDir), 'utf8');
const pending = (name) => readFileSync(new URL(name, pendingDir), 'utf8');

const unitKey = (p) => `es-${p.level.toLowerCase()}-u${String(p.unit.position).padStart(2, '0')}`;
const UNITS = ES_PATH.map(unitKey);
const LESSONS = ES_PATH.flatMap((p) => p.lessons);
const LESSON_IDS = LESSONS.map((l) => l.id);
const WORDS = ES_PATH.flatMap((p) => p.unit.words.map((w) => w.id));
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
let checkBefore;

before(async () => {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && f < ES_MIGRATION)
    .sort();
  db = await createDb({ files });
  h = helpers(db);
  beforeRows = await snapshot();
  checkBefore = await levelCheck();
  await db.exec(migration(ES_MIGRATION));
  afterRows = await snapshot();
});

test('la migración es la salida exacta del generador y no tiene sentencias destructivas ni de esquema', () => {
  const { sql } = esSql();
  assert.equal(withNeutralSpanish(migration(ES_MIGRATION)), sql);
  const text = sql
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

test('no cambia el esquema: el CHECK de nivel queda como estaba', async () => {
  assert.deepEqual(await levelCheck(), checkBefore);
});

test('add-only: ninguna fila anterior cambia y se agregan exactamente las nuevas', () => {
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
  const doc = esSql().document;
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
  await db.exec(migration(ES_MIGRATION));
  assert.deepEqual(await snapshot(), afterRows);
  const { translation_es: original } = await h.one(
    `select translation_es from public.words where id = 'es-la-oficina'`,
  );
  await db.query(`update public.words set translation_es = 'otra' where id = 'es-la-oficina'`);
  const err = await errorOf(db.exec(migration(ES_MIGRATION)));
  assert.match(String(err?.message), /es_load: palabras ya cargadas con otros datos/);
  await db.query(`update public.words set translation_es = $1 where id = 'es-la-oficina'`, [
    original,
  ]);
  assert.deepEqual(await snapshot(), afterRows);
});

test('todo nace sin publicar, en su nivel y con los ítems en draft', async () => {
  const units = await h.all(
    `select id, level, position, is_published from public.curriculum_units where id = any($1) order by id`,
    [UNITS],
  );
  assert.deepEqual(
    units.map((u) => [u.id, u.level, u.position, u.is_published]),
    ES_PATH.map((p) => [unitKey(p), p.level, p.unit.position, false]).sort((a, b) =>
      a[0] < b[0] ? -1 : 1,
    ),
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
            count(*) filter (where i.language_code <> 'es' or i.level not in ('A1', 'A2'))::int other
       from public.exercises e join public.exercise_items i on i.id = e.item_id where e.id = any($1)`,
    [EXERCISE_IDS],
  );
  assert.deepEqual(items, { n: 0, other: 0 });
});

test('la app no ve las unidades, palabras, lecciones ni ejercicios nuevos, ni puede empezarlos', async () => {
  const user = await createUser(db, 'es-app@test.dev');
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
  const err = await errorOf(h.startLesson(user, randomUUID(), 'es-a2-u01-l01'));
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
    const rows = await h.all(`select item_id from public.review_item_candidates('es')`);
    assert.equal(rows.filter((r) => ids.has(r.item_id)).length, 0);
  }
});

test(
  'publicación (en la base desechable): idempotente, sólo cambia el estado y cada lección se juega',
  { timeout: 1_800_000 },
  async () => {
    // No depende de ninguna otra publicación: el español sólo enlaza palabras propias.
    const beforePublish = await snapshot();
    const sql = pending(ES_PUBLISH_MIGRATION);
    assert.equal(sql, esPublishSql().sql);
    await db.exec(sql);
    const published = await snapshot();
    await db.exec(sql);
    assert.deepEqual(await snapshot(), published, 'reaplicar la publicación no cambia nada');

    // Sólo cambian filas propias (unidades, palabras, lecciones, ejercicios, conceptos e ítems).
    const { ids } = esPublishSql();
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
        assert.ok(own.has(id), `${t}: cambió ${id}, que no es de esta carga`);
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

    // La primera lección de cada nivel lo abre; las demás esperan a la anterior.
    const fresh = await createUser(db, 'es-fresh@test.dev');
    for (const [lesson, open] of [
      ['es-a1-u01-l01', true],
      ['es-a2-u01-l01', true],
      ['es-a1-u01-l02', false],
      ['es-a1-u02-l01', false],
    ])
      assert.equal(
        (await h.one(`select public.is_lesson_unlocked($1, $2) ok`, [fresh, lesson])).ok,
        open,
        lesson,
      );

    let previous = null;
    for (const l of LESSONS) {
      // A1 U1 y A2 U1 abren su nivel.
      if (l.id === 'es-a1-u01-l01' || l.id === 'es-a2-u01-l01') previous = null;
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

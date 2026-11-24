// Inglés A2 completo (docs/A2_EN_COMPLETION.md): unidades nuevas U13–U17, probadas en PGlite. La base
// se arma con todas las migraciones anteriores y después se aplica 20261120120000_a2_en_completion.sql,
// así se comprueba fila a fila que sólo agrega y no publica nada. La última parte publica las unidades
// DENTRO de esta base desechable (nunca en otra parte) para jugar cada lección con la corrección del
// servidor y comprobar que el desbloqueo del A2 las encadena después de U12.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { answerAll, helpers } from './learningHelpers.mjs';
import { a2ExpansionSql } from '../../scripts/build-a2-expansion-sql.ts';
import { A2_EXPANSION_PATH } from '../../content/a2-expansion.ts';

const MIGRATION = '20261120120000_a2_en_completion.sql';
const migrationsDir = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, migrationsDir), 'utf8');

const UNITS = A2_EXPANSION_PATH.map((p) => `a2-u${p.unit.position}`);
const LESSONS = A2_EXPANSION_PATH.flatMap((p) => p.lessons);
const LESSON_IDS = LESSONS.map((l) => l.id);
const WORDS = A2_EXPANSION_PATH.flatMap((p) => p.unit.words.map((w) => w.id));
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

before(async () => {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && f < MIGRATION)
    .sort();
  db = await createDb({ files });
  h = helpers(db);
  beforeRows = await snapshot();
  await db.exec(migration(MIGRATION));
  afterRows = await snapshot();
});

test('la migración es la salida exacta del generador y no tiene sentencias destructivas', () => {
  const { sql } = a2ExpansionSql();
  assert.equal(migration(MIGRATION), sql);
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

test('add-only: ninguna fila anterior cambia y se agregan exactamente las del A2 nuevo', () => {
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
  const doc = a2ExpansionSql().document;
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
    learning_objectives: 0,
    objective_concepts: 0,
    lesson_objectives: 0,
    item_objectives: 0,
  });
});

test('reaplicar no cambia nada; si una fila cargada difiere, aborta', async () => {
  await db.exec(migration(MIGRATION));
  assert.deepEqual(await snapshot(), afterRows);
  await db.query(`update public.words set translation_es = 'otra' where id = 'en-menu'`);
  const err = await errorOf(db.exec(migration(MIGRATION)));
  assert.match(String(err?.message), /a2_completion: palabras ya cargadas con otros datos/);
  await db.query(`update public.words set translation_es = 'menú' where id = 'en-menu'`);
});

test('todo nace sin publicar e ítems en draft; U1–U12 de A2 siguen igual', async () => {
  const units = await h.all(
    `select id, level, position, is_published from public.curriculum_units where id = any($1) order by id`,
    [UNITS],
  );
  assert.deepEqual(
    units.map((u) => [u.id, u.level, u.position, u.is_published]),
    A2_EXPANSION_PATH.map((p) => [`a2-u${p.unit.position}`, 'A2', p.unit.position, false]),
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
    `select count(*) filter (where i.status <> 'draft')::int n from public.exercises e
       join public.exercise_items i on i.id = e.item_id where e.id = any($1)`,
    [EXERCISE_IDS],
  );
  assert.equal(items.n, 0);
  const loaded = await h.one(
    `select count(*)::int n from public.curriculum_units
      where language_code = 'en' and level = 'A2' and position <= 12 and is_published`,
  );
  assert.equal(loaded.n, 12);
});

test('la app no ve las unidades, palabras, lecciones ni ejercicios nuevos, ni puede empezarlos', async () => {
  const user = await createUser(db, 'a2completion-app@test.dev');
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
  const err = await errorOf(h.startLesson(user, randomUUID(), 'a2-u13-l01'));
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
  'publicadas en la base desechable: U13 sigue a U12 y cada lección se juega con la corrección del servidor',
  { timeout: 600_000 },
  async () => {
    await db.query(`update public.curriculum_units set is_published = true where id = any($1)`, [
      UNITS,
    ]);
    await db.query(`update public.words set is_published = true where id = any($1)`, [WORDS]);
    await db.query(`update public.lessons set is_published = true where id = any($1)`, [
      LESSON_IDS,
    ]);
    await db.query(`update public.exercises set is_published = true where id = any($1)`, [
      EXERCISE_IDS,
    ]);

    // El desbloqueo encadena el A2 nuevo después del repaso final de U12.
    const fresh = await createUser(db, 'a2completion-locked@test.dev');
    assert.equal(
      (await h.one(`select public.is_lesson_unlocked($1, 'a2-u13-l01') ok`, [fresh])).ok,
      false,
    );
    const afterU12 = await h.learner('a2-u12-final');
    assert.equal(
      (await h.one(`select public.is_lesson_unlocked($1, 'a2-u13-l01') ok`, [afterU12])).ok,
      true,
    );

    let previous = 'a2-u12-final';
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

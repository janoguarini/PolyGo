// Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): agregados del mapa a unidades cargadas, probados en
// PGlite. La base se arma con todas las migraciones anteriores y después se aplica
// 20261119120000_a1_en_closure.sql, así se comprueba fila a fila que sólo agrega y no publica nada.
// La última parte publica los agregados DENTRO de esta base desechable (nunca en otra parte) para
// jugarlos con la corrección del servidor.
import { withNeutralSpanish } from '../../scripts/neutral-patch.ts';
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { answerAll, helpers } from './learningHelpers.mjs';
import { a1ClosureSql } from '../../scripts/build-a1-closure-sql.ts';
import { SUPPLEMENT_PATH } from '../../content/supplement.ts';

const MIGRATION = '20261119120000_a1_en_closure.sql';
const migrationsDir = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, migrationsDir), 'utf8');

const LESSONS = SUPPLEMENT_PATH.flatMap((p) => p.lessons);
const NEW_LESSONS = LESSONS.filter((l) => !l.exerciseOffset);
const APPENDED = LESSONS.filter((l) => l.exerciseOffset);
const WORDS = SUPPLEMENT_PATH.flatMap((p) => p.unit.words.map((w) => w.id));
const EXERCISE_IDS = LESSONS.flatMap((l) =>
  l.exercises.map((_, i) => `${l.id}-e${String((l.exerciseOffset ?? 0) + i + 1).padStart(2, '0')}`),
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
  const { sql } = a1ClosureSql();
  assert.equal(withNeutralSpanish(migration(MIGRATION)), sql);
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

test('add-only: ninguna fila anterior cambia y se agregan exactamente las del cierre', () => {
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
  const doc = a1ClosureSql().document;
  assert.deepEqual(added, {
    curriculum_units: 0,
    words: WORDS.length,
    lessons: NEW_LESSONS.length,
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
  await db.query(`update public.words set translation_es = 'otra' where id = 'en-zero'`);
  const err = await errorOf(db.exec(migration(MIGRATION)));
  assert.match(String(err?.message), /a1_closure: palabras ya cargadas con otros datos/);
  await db.query(`update public.words set translation_es = 'cero' where id = 'en-zero'`);
});

test('todo nace sin publicar e ítems en draft; las lecciones cargadas siguen publicadas', async () => {
  const ex = await h.one(
    `select count(*)::int n, count(*) filter (where is_published)::int pub from public.exercises where id = any($1)`,
    [EXERCISE_IDS],
  );
  assert.deepEqual(ex, { n: EXERCISE_IDS.length, pub: 0 });
  const items = await h.one(
    `select count(*) filter (where i.status <> 'draft')::int n from public.exercises e
       join public.exercise_items i on i.id = e.item_id where e.id = any($1)`,
    [EXERCISE_IDS],
  );
  assert.equal(items.n, 0);
  const words = await h.one(
    `select count(*) filter (where is_published)::int n from public.words where id = any($1)`,
    [WORDS],
  );
  assert.equal(words.n, 0);
  const lessons = await h.all(
    `select id, position, is_published from public.lessons where id = any($1) order by id`,
    [NEW_LESSONS.map((l) => l.id)],
  );
  assert.deepEqual(
    lessons.map((l) => [l.id, l.is_published, l.position >= 12]),
    NEW_LESSONS.map((l) => [l.id, false, true]).sort(),
  );
  const loaded = await h.one(
    `select count(*) filter (where not is_published)::int n from public.lessons where id = any($1)`,
    [APPENDED.map((l) => l.id).filter((id) => !/^a1-u1[34]-/.test(id))],
  );
  assert.equal(loaded.n, 0);
});

test('el plan de una lección publicada no cambia: los agregados no se presentan', async () => {
  for (const l of APPENDED.filter((x) => !/^a1-u1[34]-/.test(x.id))) {
    // learning_lesson_plan arma la lección con `e.is_published` (20261108150000): lo mismo que se cuenta acá.
    const plan = await h.one(
      `select count(*)::int n from public.exercises where lesson_id = $1 and is_published`,
      [l.id],
    );
    assert.equal(plan.n, l.exerciseOffset, l.id);
  }
});

test('la app no ve las palabras, lecciones ni ejercicios nuevos, ni puede empezar las lecciones nuevas', async () => {
  const user = await createUser(db, 'a1closure-app@test.dev');
  const seen = await as(
    db,
    'authenticated',
    user,
    async () =>
      (
        await db.query(
          `select (select count(*)::int from public.words where id = any($1)) words,
                (select count(*)::int from public.lessons where id = any($2)) lessons,
                (select count(*)::int from public.exercises where id = any($3)) exercises`,
          [WORDS, NEW_LESSONS.map((l) => l.id), EXERCISE_IDS],
        )
      ).rows[0],
  );
  assert.deepEqual(seen, { words: 0, lessons: 0, exercises: 0 });
  const err = await errorOf(h.startLesson(user, randomUUID(), 'a1-u09-l06'));
  assert.match(String(err?.message), /lesson_not_found/);
});

test('los ítems nuevos no son candidatos de ningún repaso', async () => {
  const ids = new Set(
    (await h.all(`select item_id from public.exercises where id = any($1)`, [EXERCISE_IDS])).map(
      (r) => r.item_id,
    ),
  );
  for (const fn of ['review_item_candidates']) {
    const exists = await h.one(`select count(*)::int n from pg_proc where proname = $1`, [fn]);
    if (!exists.n) continue;
    const rows = await h.all(`select item_id from public.${fn}('en')`);
    assert.equal(rows.filter((r) => ids.has(r.item_id)).length, 0, fn);
  }
});

test(
  'publicados en la base desechable: cada lección tocada se juega y el servidor acepta cada respuesta',
  { timeout: 300_000 },
  async () => {
    await db.query(`update public.words set is_published = true where id = any($1)`, [WORDS]);
    await db.query(`update public.lessons set is_published = true where id = any($1)`, [
      NEW_LESSONS.map((l) => l.id),
    ]);
    await db.query(`update public.exercises set is_published = true where id = any($1)`, [
      EXERCISE_IDS,
    ]);
    for (const l of LESSONS.filter((x) => !/^a1-u1[34]-/.test(x.id))) {
      const unit = l.id.slice(0, 6);
      const prev = await h.one(
        `select id from public.lessons where unit_id = $1 and is_published and position < $2 order by position desc limit 1`,
        [unit, l.position],
      );
      // La primera lección de una unidad: la de antes es el repaso final de la unidad anterior en el
      // camino publicado (ruta v1); la primera del nivel se abre sola.
      const previous =
        prev ??
        (await h.one(
          `select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
          where u.language_code = 'en' and u.level = 'A1' and u.is_published and l.is_published
            and u.position < (select position from public.curriculum_units where id = $1)
          order by u.position desc, l.position desc limit 1`,
          [unit],
        ));
      const user = previous
        ? await h.learner(previous.id)
        : await createUser(db, `a1closure-${l.id}@test.dev`);
      assert.equal(
        (await h.one(`select public.is_lesson_unlocked($1, $2) ok`, [user, l.id])).ok,
        true,
        l.id,
      );
      const session = randomUUID();
      const started = await h.startLesson(user, session, l.id);
      const total = (l.exerciseOffset ?? 0) + l.exercises.length;
      assert.equal(started.presentations.length, total, l.id);
      const r = await h.submitLesson(
        user,
        session,
        l.id,
        answerAll(await h.snapshotsOf(user, session)),
      );
      assert.deepEqual([l.id, r.first_try_correct, r.first_try_total], [l.id, total, total]);
    }
  },
);

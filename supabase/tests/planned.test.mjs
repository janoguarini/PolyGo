// Fase C.3: lecciones escritas L1–L5 de U13 y U14 de inglés A1 (docs/LEARNING_PHASE_C.md §C3), probadas
// en PGlite. La base se arma con todas las migraciones hasta la C.2 y después se aplica la C.3
// (20261113120300_planned_lessons_en_a1_u13_u14.sql), así se comprueba fila a fila que sólo agrega.
//
// Todo se carga SIN publicar. La última parte del archivo publica U13 y U14 dentro de esta base
// desechable (nunca en otra parte) para jugar las 20 lecciones con la corrección del servidor.
import { withNeutralSpanish } from '../../scripts/neutral-patch.ts';
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { answerAll, helpers } from './learningHelpers.mjs';
import { plannedUnitsSql } from '../../scripts/planned-units-sql.ts';
import { comprehensionSql } from '../../scripts/comprehension-sql.ts';
import { PLANNED_PATH } from '../../content/planned.ts';
import { PLANNED_OBJECTIVES, PLANNED_OBJECTIVE_LINKS } from '../../content/planned-objectives.ts';
import { CONTENT_PERSONAS } from '../../content/personas.ts';

const C2 = '20261113120200_comprehension_en_a1_u13_u14.sql';
const C2_SHA256 = '45ed577ed17447e7d68cb350e6377fc691ccecf17aae15a1867dc6f8a628509e';
const C3 = '20261113120300_planned_lessons_en_a1_u13_u14.sql';
const UNITS = ['a1-u13', 'a1-u14'];
const migrationsDir = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, migrationsDir), 'utf8');

const LESSONS = PLANNED_PATH.flatMap((p) => p.lessons);
const WRITTEN = LESSONS.filter((l) => l.kind === 'lesson');
const EXERCISES = LESSONS.reduce((n, l) => n + l.exercises.length, 0);
const WORDS = PLANNED_PATH.flatMap((p) => p.unit.words.map((w) => w.id));
const IN_UNITS = `in (select id from public.lessons where unit_id in ('a1-u13', 'a1-u14') and id not like '%-context')`;

/** Tablas que la migración puede tocar: cada fila como texto, sin las marcas de tiempo. */
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
let beforeC3;
let afterC3;

async function snapshot() {
  const out = {};
  for (const t of TABLES) {
    const rows = (
      await db.query(
        `select (to_jsonb(x) - 'created_at' - 'updated_at')::text r from public.${t} x order by 1`,
      )
    ).rows.map((r) => r.r);
    out[t] = rows;
  }
  return out;
}

before(async () => {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && f < C3)
    .sort();
  db = await createDb({ files });
  h = helpers(db);
  beforeC3 = await snapshot();
  await db.exec(migration(C3));
  afterC3 = await snapshot();
});

async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err;
  }
}

// --- Generación -----------------------------------------------------------------------------

test('la migración es la salida exacta del generador (determinista) y es la última de contenido de la fase C', () => {
  const a = plannedUnitsSql().sql;
  assert.equal(a, plannedUnitsSql().sql);
  assert.equal(withNeutralSpanish(migration(C3)), a);
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  // Después sólo vienen la C.4 (rutas curriculares), la C.5 (compatibilidad), la C.6 (vocabulario por
  // ruta), la C.7 (aislamiento curricular) y el cierre del Learning Machine, que no cargan contenido.
  assert.deepEqual(files.slice(files.indexOf(C3) + 1), [
    '20261114120000_curriculum_routes.sql',
    '20261115120000_client_compatibility.sql', // C.5: compatibilidad de clientes, sin contenido
    '20261116120000_route_vocabulary_access.sql', // C.6: lectura del vocabulario por ruta, sin contenido
    '20261117120000_curriculum_isolation.sql', // C.7: aislamiento curricular de repasos, Ranked y Mastery
    '20261118120000_learning_machine_hardening.sql', // cierre: concurrencia de los trabajos, sin contenido
    // Cierre de inglés A1: contenido sin publicar en unidades cargadas; no toca U13/U14 salvo agregar
    // dos ejercicios al final de a1-u14-l01 (supabase/tests/a1Closure.test.mjs).
    '20261119120000_a1_en_closure.sql',
    // Inglés A2 completo: unidades nuevas a2-u13…a2-u17 sin publicar; no toca U13/U14 de A1
    // (supabase/tests/a2Completion.test.mjs).
    '20261120120000_a2_en_completion.sql',
    // Inglés B1: unidades nuevas b1-u01…b1-u12 sin publicar y el CHECK de nivel con B1; no toca A1
    // (supabase/tests/b1Content.test.mjs).
    '20261122120000_b1_en.sql',
    // Inglés B2: unidades nuevas b2-u01…b2-u12 sin publicar y el CHECK de nivel con B2; no toca A1
    // (supabase/tests/b2Content.test.mjs).
    '20261124120000_b2_en.sql',
    // Portugués A1 U13–U16 y A2: unidades nuevas pt-a1-u13…, pt-a2-u01… sin publicar; sin cambios de
    // esquema; no toca el piloto ni el inglés (supabase/tests/ptContent.test.mjs).
    '20261126120000_pt_a1_a2.sql',
    // Italiano A1 U13–U16 y A2: unidades nuevas it-a1-u13…, it-a2-u01… sin publicar; sin cambios de
    // esquema; no toca el piloto ni otros idiomas (supabase/tests/itContent.test.mjs).
    '20261128120000_it_a1_a2.sql',
    // Chino A1 U13–U16 y A2: unidades nuevas zh-a1-u13…, zh-a2-u01… sin publicar; sin cambios de
    // esquema; no toca el piloto ni otros idiomas (supabase/tests/zhContent.test.mjs).
    '20261130120000_zh_a1_a2.sql',
    // Francés A1 U1–U17 y A2: unidades nuevas fr-a1-u01…, fr-a2-u01… sin publicar; sin cambios de
    // esquema; no toca otros idiomas (supabase/tests/frContent.test.mjs).
    '20261202120000_fr_a1_a2.sql',
    '20261204120000_es_a1_a2.sql',
  ]);
  // La C.2 no se tocó (ni su archivo ni su generador).
  assert.equal(createHash('sha256').update(migration(C2)).digest('hex'), C2_SHA256);
  assert.equal(withNeutralSpanish(migration(C2)), comprehensionSql().sql);
});

test('sin sentencias destructivas ni cambios fuera del contenido', () => {
  const text = plannedUnitsSql()
    .sql.replace(/\$content\$[\s\S]*?\$content\$/, '')
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
    'is_published = true',
    'is_published=true',
    'set is_published',
    'do update set is_published',
    'ranked',
    'battle',
    'energy',
    'streak',
    'achievement',
    'user_word_progress',
    'srs_v2',
    'mastery',
    'adaptive',
    'learning_job',
    'cron',
    'submit_learning_session',
    'is_lesson_unlocked',
  ]) {
    assert.ok(!text.includes(word), `menciona ${word}`);
  }
});

// --- Sólo agrega ------------------------------------------------------------------------------

test('add-only: ninguna fila anterior cambia; sólo se agregan las de U13 y U14', () => {
  const added = {};
  for (const t of TABLES) {
    const after = new Set(afterC3[t]);
    const lost = beforeC3[t].filter((r) => !after.has(r));
    assert.deepEqual(lost, [], `${t}: filas cambiadas o borradas`);
    added[t] = afterC3[t].length - beforeC3[t].length;
  }
  const doc = plannedUnitsSql().document;
  assert.deepEqual(added, {
    curriculum_units: 0,
    words: WORDS.length,
    lessons: LESSONS.length,
    exercises: EXERCISES,
    exercise_words: doc.exercises.reduce((n, e) => n + new Set(e.words).size, 0),
    concepts: WORDS.length,
    exercise_items: doc.catalog.items.length,
    item_concepts: doc.catalog.item_concepts.length,
    exercise_item_versions: doc.versions.versions.length,
    exercise_option_sets: doc.optionSets.option_sets.length,
    exercise_option_set_assignments: doc.optionSets.placement_option_sets.length,
    content_personas: 0,
    learning_objectives: 0,
    objective_concepts:
      PLANNED_OBJECTIVES.reduce((n, o) => n + o.concepts.length, 0) -
      beforeC3.objective_concepts.filter((r) =>
        PLANNED_OBJECTIVES.some((o) => r.includes(`"objective_id": "${o.id}"`)),
      ).length,
    lesson_objectives: PLANNED_OBJECTIVE_LINKS.length,
    item_objectives: PLANNED_OBJECTIVE_LINKS.reduce((n, l) => n + l.items.length, 0),
  });
});

test('reaplicar la migración no cambia nada', async () => {
  await db.exec(migration(C3));
  assert.deepEqual(await snapshot(), afterC3);
});

test('si una fila ya cargada difiere, la migración aborta en vez de pisarla', async () => {
  await db.exec('begin');
  try {
    await db.query(`update public.words set translation_es = 'otra' where id = 'en-surname'`);
    const err = await errorOf(db.exec(migration(C3)));
    assert.match(String(err?.message), /palabras ya cargadas con otros datos: en-surname/);
  } finally {
    await db.exec('rollback');
  }
});

// --- Contenido cargado (sin publicar) ----------------------------------------------------------

test('unidades, palabras, lecciones y ejercicios sin publicar; la En contexto sigue en la posición 11', async () => {
  const units = await h.all(
    `select u.id, u.position, u.is_published,
            (select count(*)::int from public.words w where w.unit_id = u.id) words,
            (select count(*)::int from public.words w where w.unit_id = u.id and w.is_published) published_words,
            (select array_agg(l.position order by l.position) from public.lessons l where l.unit_id = u.id) positions,
            (select count(*)::int from public.lessons l where l.unit_id = u.id and l.is_published) published_lessons
     from public.curriculum_units u where u.id = any($1) order by u.id`,
    [UNITS],
  );
  assert.deepEqual(
    units,
    PLANNED_PATH.map((p) => ({
      id: `a1-u${p.unit.position}`,
      position: p.unit.position,
      is_published: false,
      words: p.unit.words.length,
      published_words: 0,
      positions: Array.from({ length: 11 }, (_, i) => i + 1),
      published_lessons: 0,
    })),
  );
  const context = await h.all(
    `select id, position from public.lessons where id in ('a1-u13-context', 'a1-u14-context') order by id`,
  );
  assert.deepEqual(context, [
    { id: 'a1-u13-context', position: 11 },
    { id: 'a1-u14-context', position: 11 },
  ]);
  const ex = await h.one(
    `select count(*)::int n, count(*) filter (where is_published)::int published,
            count(*) filter (where item_id is null or item_version_id is null)::int incomplete,
            count(*) filter (where option_set_id is null and type in
              ('image_choice', 'translation_choice', 'listen_choice', 'fill_blank'))::int choice_without_set
     from public.exercises where lesson_id ${IN_UNITS}`,
  );
  assert.deepEqual(ex, { n: EXERCISES, published: 0, incomplete: 0, choice_without_set: 0 });
  // Las 12 unidades escritas siguen en sus posiciones, publicadas.
  const written = await h.all(
    `select id, position, is_published from public.curriculum_units
     where language_code = 'en' and level = 'A1' and not (id = any($1)) order by position`,
    [UNITS],
  );
  assert.deepEqual(
    written,
    Array.from({ length: 12 }, (_, i) => ({
      id: `a1-u${String(i + 1).padStart(2, '0')}`,
      position: i + 1,
      is_published: true,
    })),
  );
});

test('ítems y conceptos nuevos en draft; las palabras reutilizadas siguen activas', async () => {
  const items = await h.one(
    `select count(distinct i.id)::int n, count(distinct i.id) filter (where i.status <> 'draft')::int not_draft,
            count(distinct i.id) filter (where i.response_privacy = 'fictional')::int fictional
     from public.exercise_items i join public.exercises e on e.item_id = i.id where e.lesson_id ${IN_UNITS}`,
  );
  const doc = plannedUnitsSql().document;
  assert.equal(items.n, doc.catalog.items.length);
  assert.equal(items.not_draft, 0);
  assert.ok(items.fictional > 0, 'las respuestas libres sobre Sofia son de una persona ficticia');
  const concepts = await h.all(
    `select id, status from public.concepts where id = any($1) order by id`,
    [WORDS],
  );
  assert.equal(concepts.length, WORDS.length);
  assert.ok(concepts.every((c) => c.status === 'draft'));
  const borrowed = await h.all(
    `select c.id, c.status, w.unit_id from public.concepts c join public.words w on w.id = c.id
     where c.id = any($1) order by c.id`,
    [['en-what', 'en-city', 'en-email', 'en-how-much', 'en-price']],
  );
  assert.deepEqual(
    borrowed.map((b) => [b.id, b.status, b.unit_id]),
    [
      ['en-city', 'active', 'a1-u10'],
      ['en-email', 'active', 'a2-u10'],
      ['en-how-much', 'active', 'a1-u12'],
      ['en-price', 'active', 'a2-u06'],
      ['en-what', 'active', 'a1-u12'],
    ],
  );
});

test('los ítems nuevos no son candidatos de ningún repaso', async () => {
  const ids = new Set(
    (await h.all(`select item_id from public.exercises where lesson_id ${IN_UNITS}`)).map(
      (r) => r.item_id,
    ),
  );
  for (const fn of ['review_item_candidates', 'learning_review_item_candidates']) {
    const exists = await h.one(`select count(*)::int n from pg_proc where proname = $1`, [fn]);
    if (!exists.n) continue;
    const rows = await h.all(`select item_id from public.${fn}('en')`);
    assert.ok(rows.length > 0, `${fn} devuelve candidatos`);
    assert.equal(rows.filter((r) => ids.has(r.item_id)).length, 0, fn);
  }
});

test('objetivos reutilizados: cuatro de comprensión, sin objetivos nuevos', async () => {
  const lo = await h.all(
    `select lesson_id, objective_id, role from public.lesson_objectives where lesson_id ${IN_UNITS} order by 1`,
  );
  assert.deepEqual(lo, [
    { lesson_id: 'a1-u13-l01', objective_id: 'en.a1.obj.cl01', role: 'practice' },
    { lesson_id: 'a1-u13-l02', objective_id: 'en.a1.obj.cl02', role: 'practice' },
    { lesson_id: 'a1-u13-l05', objective_id: 'en.a1.obj.cr01', role: 'practice' },
    { lesson_id: 'a1-u14-l02', objective_id: 'en.a1.obj.cl03', role: 'practice' },
  ]);
  const io = await h.all(
    `select io.objective_id, e.type, count(distinct io.item_id)::int n from public.item_objectives io
     join public.exercises e on e.item_id = io.item_id where e.lesson_id ${IN_UNITS}
     group by 1, 2 order by 1, 2`,
  );
  assert.deepEqual(io, [
    { objective_id: 'en.a1.obj.cl01', type: 'listen_choice', n: 3 },
    { objective_id: 'en.a1.obj.cr01', type: 'short_answer', n: 2 },
  ]);
  assert.equal(beforeC3.learning_objectives.length, afterC3.learning_objectives.length);
});

test('privacidad: los datos de contacto son sólo los de la persona ficticia, en U13', async () => {
  const [guest] = CONTENT_PERSONAS;
  const rows = await h.all(
    `select e.lesson_id, i.response_privacy, e.type
     from public.exercises e join public.exercise_items i on i.id = e.item_id
     join public.exercise_item_versions v on v.id = e.item_version_id
     where e.lesson_id ${IN_UNITS} and (strpos(v.payload::text || v.answer, $1) > 0 or strpos(v.payload::text || v.answer, $2) > 0)`,
    [guest.email, guest.phone],
  );
  assert.ok(rows.length > 0);
  assert.ok(rows.every((r) => r.lesson_id.startsWith('a1-u13-')));
  for (const r of rows)
    assert.equal(
      r.response_privacy,
      ['short_answer', 'translate_write'].includes(r.type) ? 'fictional' : 'closed',
    );
  const others = await h.one(
    `select count(*)::int n from public.exercise_item_versions v join public.exercises e on e.item_version_id = v.id
     where e.lesson_id ${IN_UNITS} and (v.payload::text || v.answer) ~ '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]+'
       and strpos(v.payload::text || v.answer, $1) = 0`,
    [guest.email],
  );
  assert.equal(others.n, 0);
});

// --- Aislamiento --------------------------------------------------------------------------------

test('la app no ve las unidades, palabras, lecciones ni ejercicios, ni puede empezarlos', async () => {
  const user = await createUser(db, 'phasec3-app@test.dev');
  const seen = await as(
    db,
    'authenticated',
    user,
    async () =>
      (
        await db.query(
          `select (select count(*)::int from public.curriculum_units where id in ('a1-u13', 'a1-u14')) units,
                (select count(*)::int from public.words where unit_id in ('a1-u13', 'a1-u14')) words,
                (select count(*)::int from public.lessons where unit_id in ('a1-u13', 'a1-u14')) lessons,
                (select count(*)::int from public.exercises where lesson_id like 'a1-u13-%' or lesson_id like 'a1-u14-%') exercises`,
        )
      ).rows[0],
  );
  assert.deepEqual(seen, { units: 0, words: 0, lessons: 0, exercises: 0 });
  const err = await errorOf(h.startLesson(user, randomUUID(), 'a1-u13-l01'));
  assert.match(String(err?.message), /lesson_not_found/);
  // La palabra del día sólo elige palabras publicadas.
  for (let d = 0; d < 40; d++) {
    const w = await as(
      db,
      'authenticated',
      user,
      async () =>
        (await db.query(`select id from public.word_of_the_day(current_date + $1::int, 'en')`, [d]))
          .rows[0],
    );
    assert.ok(!WORDS.includes(w?.id), `día ${d}: ${w?.id}`);
  }
});

test('el desbloqueo no cambia: quien terminó U12 sigue igual y U1 se desbloquea como antes', async () => {
  const user = await createUser(db, 'phasec3-unlock@test.dev');
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
       last_accuracy, first_completed_at, last_completed_at)
     values ($1, 'a1-u01-final', 1, 1, 1, now(), now())`,
    [user],
  );
  assert.equal(
    (await h.one(`select public.is_lesson_unlocked($1, 'a1-u02-l01') ok`, [user])).ok,
    true,
  );
  assert.equal(
    (await h.one(`select public.is_lesson_unlocked($1, 'a1-u13-l01') ok`, [user])).ok,
    false,
  );
});

// --- Jugadas en la base desechable --------------------------------------------------------------

test(
  'publicadas en la base desechable: las 20 lecciones se juegan y el servidor acepta cada respuesta',
  { timeout: 300_000 },
  async () => {
    await db.query(`update public.curriculum_units set is_published = true where id = any($1)`, [
      UNITS,
    ]);
    await db.query(`update public.words set is_published = true where unit_id = any($1)`, [UNITS]);
    await db.query(`update public.lessons set is_published = true where id ${IN_UNITS}`);
    await db.query(`update public.exercises set is_published = true where lesson_id ${IN_UNITS}`);

    // Orden de desbloqueo: lo que precede a cada lección publicada (U13 va después de U12, U14 de U13).
    const order = ['a1-u12-final', ...LESSONS.map((l) => l.id)];
    for (let i = 1; i < order.length; i++) {
      const lesson = order[i];
      const user = await h.learner(order[i - 1]);
      assert.equal(
        (await h.one(`select public.is_lesson_unlocked($1, $2) ok`, [user, lesson])).ok,
        true,
        lesson,
      );
      const session = randomUUID();
      const started = await h.startLesson(user, session, lesson);
      const def = LESSONS.find((l) => l.id === lesson);
      assert.equal(started.presentations.length, def.exercises.length, lesson);
      const snaps = await h.snapshotsOf(user, session);
      const r = await h.submitLesson(user, session, lesson, answerAll(snaps));
      assert.deepEqual(
        [lesson, r.first_try_correct, r.first_try_total],
        [lesson, def.exercises.length, def.exercises.length],
      );
      // El SRS léxico v1 recibe las palabras de la lección (exercise_words) como en cualquier lección.
      if (def.kind === 'lesson') {
        const words = await h.one(
          `select count(*)::int n from public.user_word_progress where user_id = $1`,
          [user],
        );
        assert.ok(words.n > 0, `${lesson}: sin progreso de palabras`);
      }
    }
    assert.equal(WRITTEN.length, 10);
  },
);

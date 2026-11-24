import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { SRS_CONFIG } from '../../shared/srs.ts';
import { createDb, createUser, as } from './harness.mjs';
import { exercisesFixtureSql } from './fixtures.mjs';
import { ALL_WORDS, CURRICULUM_PATH } from '../../content/index.ts';
import { contentDocument } from '../../scripts/content-document.ts';
import { COMPREHENSION_PATH } from '../../content/comprehension.ts';
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

/** Preguntas «En contexto» de la fase C (75 desde la C.1). */
// Más las preguntas context_choice (LM y RQ) del cierre de inglés A1 (docs/A1_EN_CLOSURE.md) y las de
// A2 U13–U17 (docs/A2_EN_COMPLETION.md), sin palabras.
const COMPREHENSION_QUESTIONS =
  COMPREHENSION_PATH.reduce((n, p) => n + p.lessons[0].exercises.length, 0) +
  [
    ...SUPPLEMENT_PATH,
    ...A2_EXPANSION_PATH,
    ...B1_PATH,
    ...B2_PATH,
    ...PT_PATH,
    ...IT_PATH,
    ...ZH_PATH,
    ...FR_PATH,
    ...ES_PATH,
  ]
    .flatMap((p) => p.lessons.flatMap((l) => l.exercises))
    .filter((e) => e.type === 'context_choice').length;

// Totales esperados calculados desde el contenido fuente (content/, todos los niveles): las
// migraciones deben cargarlo entero.
const CONTENT_TOTALS = {
  units: CURRICULUM_PATH.length,
  lessons: CURRICULUM_PATH.reduce((n, p) => n + p.lessons.length, 0),
  exercises: CURRICULUM_PATH.reduce(
    (n, p) => n + p.lessons.reduce((m, l) => m + l.exercises.length, 0),
    0,
  ),
  words: ALL_WORDS.length,
};
const CONTENT_LINKS = CURRICULUM_PATH.flatMap((p) => p.lessons.flatMap((l) => l.exercises)).reduce(
  (n, e) => n + new Set(e.words).size,
  0,
);
// Vínculos de las lecciones escritas de U13 y U14 (fase C.3): cargados, pero sin publicar.
// Y los del cierre de inglés A1, también sin publicar.
// Y los de A2 U13–U17 (docs/A2_EN_COMPLETION.md), sin publicar.
const PLANNED_LINKS = [
  ...PLANNED_PATH,
  ...SUPPLEMENT_PATH,
  ...A2_EXPANSION_PATH,
  ...B1_PATH,
  ...B2_PATH,
  ...PT_PATH,
  ...IT_PATH,
  ...ZH_PATH,
  ...FR_PATH,
  ...ES_PATH,
]
  .flatMap((p) => p.lessons.flatMap((l) => l.exercises))
  .reduce((n, e) => n + new Set(e.words).size, 0);

// Contenido real de todos los idiomas: ids a1-…/a2-… (inglés) o it-a1-…, pt-…, zh-… (sin el
// fixture de este archivo, que usa ids t-…).
const REAL = `~ '^([a-z]{2}-)?a[12]-'`;

let db;
let alice;
let bob;

// Contenido mínimo de prueba (el contenido real se prueba en content/__tests__). Va en portugués
// para no chocar con las unidades reales ni compartir su orden de desbloqueo (posición 99: pt A2
// U1–U12 son reales desde docs/PT_A1_A2.md).
const FIXTURE = `
  insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji, is_published)
  values ('t-u1', 'pt', 'A2', 99, 'Unidad', 'Unit', 'desc', '👋', true);
  insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published) values
    ('t-l1', 't-u1', 1, 'Lección 1', 'obj', true),
    ('t-l2', 't-u1', 2, 'Lección 2', 'obj', true);
  insert into public.words (id, language_code, unit_id, text, translation_es, is_published) values
    ('t-hello', 'en', 't-u1', 'hello', 'hola', true),
    ('t-bye', 'en', 't-u1', 'bye', 'chau', true),
    ('t-draft', 'en', 't-u1', 'draft', 'borrador', false);
  ${exercisesFixtureSql([
    {
      id: 't-e1',
      lesson_id: 't-l1',
      position: 1,
      type: 'translation_choice',
      skill: 'vocabulary',
      payload: { type: 'translation_choice', word: 'hello', options: ['hola', 'chau'] },
      answer: 'hola',
      language: 'pt',
      level: 'A2',
    },
    {
      id: 't-e2',
      lesson_id: 't-l1',
      position: 2,
      type: 'translate_write',
      skill: 'translation',
      payload: { type: 'translate_write', source: 'chau' },
      answer: 'bye',
      language: 'pt',
      level: 'A2',
    },
    {
      id: 't-e3',
      lesson_id: 't-l2',
      position: 1,
      type: 'translate_write',
      skill: 'translation',
      payload: { type: 'translate_write', source: 'hola' },
      answer: 'hello',
      language: 'pt',
      level: 'A2',
    },
  ])}
  insert into public.exercise_words values ('t-e1', 't-hello'), ('t-e2', 't-bye'), ('t-e3', 't-hello');
`;

before(async () => {
  db = await createDb();
  await db.exec(FIXTURE);
  alice = await createUser(db, 'alice@test.dev');
  bob = await createUser(db, 'bob@test.dev');
});

const attempt = (exercise_id, correct, first_try = true) => ({
  exercise_id,
  answer: 'x',
  correct,
  first_try,
  response_ms: 1500,
});

async function submit(
  userId,
  { id = randomUUID(), kind = 'lesson', lesson = 't-l1', attempts, startedOffset = '2 minutes' },
) {
  // Repasos: la app ya no puede enviarlos por esta RPC (20261112120000); el cuerpo v1 de repasos sigue
  // vigente para el servidor y se prueba como service_role.
  return as(db, kind === 'review' ? 'service_role' : 'authenticated', userId, async () => {
    const { rows } = await db.query(
      `select public.submit_learning_session($1, $2, $3, now() - $4::interval, $5::jsonb, 'America/Argentina/Buenos_Aires') as r`,
      [id, kind, kind === 'lesson' ? lesson : null, startedOffset, JSON.stringify(attempts)],
    );
    return rows[0].r;
  });
}

async function wordProgress(userId, wordId) {
  const { rows } = await db.query(
    `select stage, seen_count, correct_count, incorrect_count, mastered_at,
            round(extract(epoch from (next_review_at - now())) / 86400.0)::int as due_in_days
       from public.user_word_progress where user_id = $1 and word_id = $2`,
    [userId, wordId],
  );
  return rows[0];
}

test('la configuración SRS del SQL coincide con shared/srs.ts', async () => {
  const { rows } = await db.query('select public.srs_config() as c');
  assert.deepEqual(rows[0].c, {
    intervalsDays: [...SRS_CONFIG.intervalsDays],
    masteredStage: SRS_CONFIG.masteredStage,
    maintenanceDays: SRS_CONFIG.maintenanceDays,
  });
});

test('anon no puede leer contenido; authenticated sólo lo publicado', async () => {
  await as(db, 'anon', null, async () => {
    await assert.rejects(db.query('select * from public.lessons'), /permission denied/);
  });
  await as(db, 'authenticated', alice, async () => {
    const { rows } = await db.query(`select id from public.words where id like 't-%' order by id`);
    assert.deepEqual(
      rows.map((r) => r.id),
      ['t-bye', 't-hello'],
    );
  });
});

test('la lección 2 está bloqueada hasta completar la 1', async () => {
  await assert.rejects(
    submit(alice, { lesson: 't-l2', attempts: [attempt('t-e3', true)] }),
    /lesson_locked/,
  );
});

test('rechaza lecciones incompletas o con ejercicios ajenos', async () => {
  await assert.rejects(submit(alice, { attempts: [attempt('t-e1', true)] }), /incomplete_lesson/);
  await assert.rejects(
    submit(alice, { attempts: [attempt('t-e1', true), attempt('t-e3', true)] }),
    /invalid_exercise/,
  );
  await assert.rejects(
    submit(alice, {
      attempts: [attempt('t-e1', true), attempt('t-e2', true)],
      startedOffset: '5 hours',
    }),
    /invalid_started_at/,
  );
});

test('completar una lección registra progreso, palabras y actividad', async () => {
  const r = await submit(alice, {
    attempts: [attempt('t-e1', true), attempt('t-e2', false), attempt('t-e2', true, false)],
  });
  assert.equal(r.duplicate, false);
  assert.equal(r.first_try_correct, 1);
  assert.equal(r.first_try_total, 2);
  assert.equal(Number(r.accuracy), 0.5);

  const hello = await wordProgress(alice, 't-hello');
  assert.equal(hello.stage, 1, 'acierto en primer intento → etapa 1');
  assert.equal(hello.due_in_days, SRS_CONFIG.intervalsDays[0]);

  const bye = await wordProgress(alice, 't-bye');
  assert.equal(bye.stage, 0, 'fallo en primer intento → etapa 0 aunque luego acierte');
  assert.equal(bye.due_in_days, 0, 'queda para repasar ya');

  const { rows } = await db.query(
    'select times_completed, best_accuracy::float from public.user_lesson_progress where user_id = $1',
    [alice],
  );
  assert.deepEqual(rows, [{ times_completed: 1, best_accuracy: 0.5 }]);
});

test('reenviar la misma sesión es idempotente', async () => {
  const id = randomUUID();
  const attempts = [attempt('t-e1', true), attempt('t-e2', true)];
  await submit(alice, { id, attempts });
  const again = await submit(alice, { id, attempts });
  assert.equal(again.duplicate, true);
  const { rows } = await db.query(
    'select times_completed from public.user_lesson_progress where user_id = $1 and lesson_id = $2',
    [alice, 't-l1'],
  );
  assert.equal(rows[0].times_completed, 2, 'la segunda llamada no suma');
  const attempts_ = await db.query(
    'select count(*)::int as n from public.exercise_attempts where session_id = $1',
    [id],
  );
  assert.equal(attempts_.rows[0].n, 2);
});

test('otro usuario no puede reutilizar un id de sesión ajeno', async () => {
  const id = randomUUID();
  await submit(alice, { id, attempts: [attempt('t-e1', true), attempt('t-e2', true)] });
  await assert.rejects(
    submit(bob, { id, attempts: [attempt('t-e1', true), attempt('t-e2', true)] }),
    /session_conflict/,
  );
});

test('acertar una palabra que no está vencida no acelera el dominio', async () => {
  const before = await wordProgress(alice, 't-hello');
  await submit(alice, { attempts: [attempt('t-e1', true), attempt('t-e2', true)] });
  const after = await wordProgress(alice, 't-hello');
  assert.equal(after.stage, before.stage);
  assert.equal(after.correct_count, before.correct_count + 1);
});

test('repasos espaciados llevan a "dominada" y un fallo la quita', async () => {
  const review = (correct) =>
    submit(alice, {
      kind: 'review',
      attempts: [{ word_id: 't-hello', answer: 'x', correct, first_try: true, response_ms: 900 }],
    });
  const makeDue = () =>
    db.query(
      `update public.user_word_progress set next_review_at = now() - interval '1 minute'
        where user_id = $1 and word_id = 't-hello'`,
      [alice],
    );

  for (let stage = 2; stage <= SRS_CONFIG.masteredStage; stage++) {
    await makeDue();
    await review(true);
    const p = await wordProgress(alice, 't-hello');
    assert.equal(p.stage, stage);
    const expectedDays = SRS_CONFIG.intervalsDays[stage - 1] ?? SRS_CONFIG.maintenanceDays;
    assert.equal(p.due_in_days, expectedDays);
  }
  assert.ok(
    (await wordProgress(alice, 't-hello')).mastered_at,
    'dominada al llegar a la etapa configurada',
  );

  await review(false);
  const failed = await wordProgress(alice, 't-hello');
  assert.equal(failed.stage, 0);
  assert.equal(failed.mastered_at, null);
});

test('el repaso valida palabras publicadas y únicas', async () => {
  const bad = (word_id) =>
    submit(alice, {
      kind: 'review',
      attempts: [{ word_id, answer: 'x', correct: true, first_try: true, response_ms: 1 }],
    });
  await assert.rejects(bad('t-draft'), /invalid_review/);
  await assert.rejects(bad('no-existe'), /invalid_review/);
  await assert.rejects(
    submit(alice, {
      kind: 'review',
      attempts: [
        { word_id: 't-bye', answer: 'x', correct: true, first_try: true, response_ms: 1 },
        { word_id: 't-bye', answer: 'x', correct: true, first_try: true, response_ms: 1 },
      ],
    }),
    /invalid_review/,
  );
});

test('resumen: racha, lecciones, palabras y habilidades', async () => {
  await db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed)
     values ($1, (now() at time zone 'America/Argentina/Buenos_Aires')::date - 1, 1),
            ($1, (now() at time zone 'America/Argentina/Buenos_Aires')::date - 2, 1),
            ($1, (now() at time zone 'America/Argentina/Buenos_Aires')::date - 4, 1)`,
    [alice],
  );
  const summary = await as(db, 'authenticated', alice, async () => {
    const { rows } = await db.query(
      `select public.get_learning_summary('America/Argentina/Buenos_Aires') as s`,
    );
    return rows[0].s;
  });
  assert.equal(summary.streak_days, 3, 'hoy + ayer + anteayer; el hueco corta la racha');
  assert.equal(summary.active_today, true);
  assert.equal(summary.lessons_completed, 1);
  assert.equal(summary.words_seen, 2);
  assert.ok(summary.skills.some((s) => s.skill === 'translation'));
  assert.ok(summary.frequent_mistakes.some((m) => m.word_id === 't-bye'));
});

test('el progreso es privado y no se escribe directamente', async () => {
  await as(db, 'authenticated', bob, async () => {
    const { rows } = await db.query('select * from public.user_word_progress');
    assert.equal(rows.length, 0);
    await assert.rejects(
      db.query(
        `insert into public.user_lesson_progress (user_id, lesson_id, times_completed) values ($1, 't-l2', 1)`,
        [bob],
      ),
      /permission denied/,
    );
    await assert.rejects(
      db.query(`select public.apply_word_result($1, 't-hello', true, now())`, [bob]),
      /permission denied/,
    );
  });
});

test('palabra del día determinista y sólo publicada', async () => {
  const pick = () =>
    as(db, 'authenticated', alice, async () => {
      const { rows } = await db.query(`select id from public.word_of_the_day('2026-10-29')`);
      return rows[0].id;
    });
  const a = await pick();
  assert.equal(await pick(), a);
  assert.notEqual(a, 't-draft');
});

test('zona horaria inválida cae a UTC', async () => {
  const { rows } = await db.query(
    `select public.safe_time_zone('Mars/Olympus') as tz, public.safe_time_zone('Europe/Madrid') as ok`,
  );
  assert.deepEqual(rows[0], { tz: 'UTC', ok: 'Europe/Madrid' });
});

test('contenido real (todos los idiomas): se carga completo y la primera lección se puede completar', async () => {
  const { rows } = await db.query(`
    select (select count(*)::int from public.curriculum_units where id ${REAL} and is_published) as units,
           (select count(*)::int from public.lessons where id ${REAL} and is_published) as lessons,
           (select count(*)::int from public.exercises where id ${REAL} and is_published) as exercises,
           (select count(*)::int from public.words where unit_id ${REAL} and is_published) as words,
           (select count(*)::int from public.exercises e where id ${REAL} and e.type <> 'context_choice'
              and not exists (select 1 from public.exercise_words w where w.exercise_id = e.id)) as orphan_exercises,
           -- Fase C: la comprensión no tiene exercise_words a propósito (no alimenta el SRS v1) y no se publica.
           (select count(*)::int from public.exercises e where e.type = 'context_choice'
              and not e.is_published
              and not exists (select 1 from public.exercise_words w where w.exercise_id = e.id)) as comprehension_without_words,
           (select count(*)::int from public.exercises e where e.type = 'context_choice') as comprehension`);
  assert.deepEqual(rows[0], {
    ...CONTENT_TOTALS,
    orphan_exercises: 0,
    comprehension_without_words: COMPREHENSION_QUESTIONS,
    comprehension: COMPREHENSION_QUESTIONS,
  });

  const carol = await createUser(db, 'carol@test.dev');
  const lessonExercises = await db.query(
    // Sólo los publicados: los agregados del cierre de inglés A1 están en la lección sin publicar y el
    // servidor los rechaza (invalid_exercise), igual que a cualquier ejercicio que la app no recibió.
    `select id from public.exercises where lesson_id = 'a1-u01-l01' and is_published order by position`,
  );
  await assert.rejects(
    submit(carol, {
      lesson: 'a1-u01-l02',
      attempts: [
        {
          exercise_id: 'a1-u01-l02-e01',
          answer: 'x',
          correct: true,
          first_try: true,
          response_ms: 1,
        },
      ],
    }),
    /lesson_locked/,
  );
  const r = await submit(carol, {
    lesson: 'a1-u01-l01',
    attempts: lessonExercises.rows.map((e) => attempt(e.id, true)),
  });
  assert.equal(Number(r.accuracy), 1);
  const unlocked = await db.query(`select public.is_lesson_unlocked($1, 'a1-u01-l02') as ok`, [
    carol,
  ]);
  assert.equal(unlocked.rows[0].ok, true);
});

/** Contenido publicado en la base, con la misma forma que scripts/content-document.ts. */
async function dbContent() {
  const q = async (sql) => (await db.query(sql)).rows;
  const byId = (a, b) => a.id.localeCompare(b.id);
  const exercises = await q(`
    select e.id, e.lesson_id, e.position, e.type, e.skill, e.prompt_es, e.payload, e.answer, e.accepted_answers,
           e.explanation_es, e.difficulty, e.recommended_seconds,
           coalesce((select array_agg(w.word_id order by w.word_id) from public.exercise_words w
                     where w.exercise_id = e.id), '{}') as words
    from public.exercises e where e.id ${REAL} and e.is_published`);
  return {
    units: (
      await q(`select id, language_code, level, position, title_es, title_en, description_es, emoji,
                       objective_es, grammar, review_status
                from public.curriculum_units where id ${REAL} and is_published`)
    ).sort(byId),
    words: (
      await q(`select id, language_code, unit_id, text, translation_es, accepted_translations, ipa,
                       romanization, emoji, example_en, example_es, difficulty, tags
                from public.words where unit_id ${REAL} and is_published`)
    ).sort(byId),
    lessons: (
      await q(`select id, unit_id, position, title_es, objective_es, intro, takeaways from public.lessons
                where id ${REAL} and is_published`)
    ).sort(byId),
    exercises: exercises.sort(byId),
  };
}

function expectedContent() {
  const doc = contentDocument();
  const byId = (a, b) => a.id.localeCompare(b.id);
  return {
    units: [...doc.units].sort(byId),
    words: [...doc.words].sort(byId),
    lessons: [...doc.lessons].sort(byId),
    exercises: doc.exercises.map((e) => ({ ...e, words: [...new Set(e.words)].sort() })).sort(byId),
  };
}

test('las migraciones dejan la base idéntica a content/ (incluidos los vínculos)', async () => {
  assert.deepEqual(await dbContent(), expectedContent());
});

test('reaplicar la última migración de contenido no cambia nada', async () => {
  const { readFileSync, readdirSync } = await import('node:fs');
  const dir = new URL('../migrations/', import.meta.url);
  const last = readdirSync(dir)
    .filter((f) => /_content_/.test(f))
    .sort()
    .at(-1);
  await db.exec(readFileSync(new URL(last, dir), 'utf8'));
  assert.deepEqual(await dbContent(), expectedContent());
  const { rows } = await db.query(`select count(*)::int as links from public.exercise_words`);
  // + los de U13 y U14 sin publicar (fase C.3) + 3 vínculos del fixture de este archivo.
  assert.equal(rows[0].links, CONTENT_LINKS + PLANNED_LINKS + 3);
});

test('V8: PostgreSQL rechaza una ubicación sin ítem o sin versión, y un ítem sin versión vigente', async () => {
  const exercise = (cols, vals) =>
    `insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer,
       is_published${cols}) values ('t-e9', 't-l2', 9, 'translate_write', 'translation', 'p',
       '{"type":"translate_write","source":"chau"}', 'bye', true${vals})`;
  await assert.rejects(db.exec(exercise('', '')), /item_id/);
  await assert.rejects(db.exec(exercise(', item_id', ", 't-e3'")), /item_version_id/);
  // El ítem sin versión se inserta, pero la transacción no confirma.
  await assert.rejects(
    db.exec(`insert into public.exercise_items (id, language_code, level, origin, type, assessment_mode,
      response_format, input_modality, response_privacy, status)
      select 't-e9', language_code, level, origin, type, assessment_mode, response_format,
        input_modality, response_privacy, status
      from public.exercise_items where id = 't-e3'`),
    /no tiene versión vigente/,
  );
  const left = await db.query(
    `select (select count(*)::int from public.exercises where id = 't-e9') e,
       (select count(*)::int from public.exercise_items where id = 't-e9') i`,
  );
  assert.deepEqual(left.rows[0], { e: 0, i: 0 });
});

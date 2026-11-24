// Fase 2: presentación, corrección en el servidor y registro de intentos, probados en PGlite con el
// contenido real (migración 20261108150000_learning_attempt_gradings.sql). `start` y `submit`
// reproducen exactamente lo que hace la Edge Function learning-session (index.ts): las mismas
// funciones SQL, como service_role, con el núcleo shared/learningSession.ts.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import {
  gradeLessonAttempts,
  LEARNING_GRADER,
  LearningSessionError,
  presentationOrders,
} from '../../shared/learningSession.ts';
import { verdictForText } from '../../shared/answers.ts';
import { SHUFFLE_V1, choiceSeed, shuffleOrderV1 } from '../../shared/shuffle.ts';
import { shuffle as appShuffle } from '../../src/features/learning/random.ts';
import { bundle, FUNCTION_BUNDLES } from '../../scripts/build-functions.ts';

let db;

before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;
const service = (fn) => as(db, 'service_role', null, fn);
const fn = async (name, args) => {
  const ph = args.map((_, i) => `$${i + 1}`).join(', ');
  return (await one(`select public.${name}(${ph}) r`, args)).r;
};
const j = (v) => JSON.stringify(v);

/** La Edge Function, acción start. */
async function start(user, sessionId, lessonId) {
  return service(async () => {
    const plan = await fn('learning_lesson_plan', [user, lessonId]);
    const orders = presentationOrders(sessionId, plan);
    return fn('learning_start_lesson', [user, sessionId, lessonId, j(orders)]);
  });
}

/** La Edge Function, acción submit. */
async function submit(
  user,
  sessionId,
  lessonId,
  attempts,
  startedAt = new Date(Date.now() - 60000),
) {
  return service(async () => {
    const snapshots = await fn('learning_session_presentations', [user, sessionId]);
    const graded = gradeLessonAttempts(snapshots, attempts);
    return fn('learning_submit_graded', [
      user,
      sessionId,
      lessonId,
      startedAt.toISOString(),
      'America/Argentina/Buenos_Aires',
      j(graded.attempts),
      j(graded.gradings),
      j(LEARNING_GRADER),
    ]);
  });
}

async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err;
  }
}

let userNo = 0;
/** Usuario nuevo (energía llena) con la lección desbloqueada (repetición, como si ya la hubiera hecho). */
async function learner(lessonId) {
  const id = await createUser(db, `learner${++userNo}@test.dev`);
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
       last_accuracy, first_completed_at, last_completed_at)
     values ($1, $2, 1, 0.5, 0.5, now(), now())`,
    [id, lessonId],
  );
  return id;
}

/** Una lección inglesa publicada que tenga todos esos tipos. */
async function lessonWith(...types) {
  const r = await one(
    `select e.lesson_id from public.exercises e
     join public.lessons l on l.id = e.lesson_id
     join public.curriculum_units u on u.id = l.unit_id
     where u.language_code = 'en' and l.is_published and e.is_published
     group by e.lesson_id
     having array_agg(distinct e.type) @> $1::text[]
     order by count(*), e.lesson_id limit 1`,
    [types],
  );
  assert.ok(r, `no hay lección con ${types}`);
  return r.lesson_id;
}

/** Respuesta correcta de una presentación, según su versión (nunca según exercises). */
function rightAnswer(s) {
  const p = s.payload;
  switch (s.grading_mode_id) {
    case 'exact_option.v1':
      return { kind: 'option', value: s.answer };
    case 'pair_set.v1':
      return { kind: 'pairs', value: [...p.pairs].reverse() };
    default:
      if (p.type === 'order_words') return { kind: 'tokens', value: tokensOf(s) };
      return { kind: 'text', value: s.answer };
  }
}

/** Las fichas del ítem en el orden de la respuesta (la respuesta lleva la puntuación). */
function tokensOf(s) {
  const pool = [...s.payload.tokens];
  const out = [];
  for (const word of s.answer.split(/\s+/)) {
    const k = pool.findIndex((t) => word === t || word.replace(/[.,!?。，！？]+$/u, '') === t);
    assert.ok(k >= 0, `${s.item_id}: ${word}`);
    out.push(pool.splice(k, 1)[0]);
  }
  assert.equal(pool.length, 0, s.item_id);
  return out;
}

function wrongAnswer(s) {
  const p = s.payload;
  switch (s.grading_mode_id) {
    case 'exact_option.v1':
      return { kind: 'option', value: s.option_texts.find((t) => t !== s.answer) };
    case 'pair_set.v1': {
      const rights = p.pairs.map((x) => x.right);
      return {
        kind: 'pairs',
        value: p.pairs.map((x, i) => ({ left: x.left, right: rights[(i + 1) % rights.length] })),
      };
    }
    default:
      if (p.type === 'order_words') return { kind: 'tokens', value: [...tokensOf(s)].reverse() };
      return { kind: 'text', value: 'zzzz' };
  }
}

const snapshotsOf = (user, sessionId) =>
  service(() => fn('learning_session_presentations', [user, sessionId]));

const answerAll = (snaps, make = rightAnswer, extra = {}) =>
  snaps.map((s) => ({
    presentation_id: s.presentation_id,
    answer: make(s),
    client_verdict: 'correct',
    response_ms: 1800.4,
    ...extra,
  }));

const gradings = (sessionId) =>
  all(
    `select g.*, a.is_correct, a.is_first_try, a.exercise_id
     from public.exercise_attempt_gradings g join public.exercise_attempts a on a.id = g.attempt_id
     where g.session_id = $1 order by a.id`,
    [sessionId],
  );

test('start registra una presentación por ejercicio con la versión, el conjunto y el orden vigentes', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  const r = await start(user, session, lesson);
  assert.equal(r.duplicate, false);

  const expected = await all(
    `select e.id, e.position, e.item_id, e.item_version_id, e.option_set_id, s.options
     from public.exercises e left join public.exercise_option_sets s on s.id = e.option_set_id
     where e.lesson_id = $1 and e.is_published order by e.position, e.id`,
    [lesson],
  );
  assert.equal(r.presentations.length, expected.length);
  for (const [i, e] of expected.entries()) {
    const p = r.presentations[i];
    assert.equal(p.exercise_id, e.id);
    assert.equal(Number(p.item_version_id), Number(e.item_version_id));
    if (e.option_set_id === null) {
      assert.equal(p.option_order, null);
      continue;
    }
    const order = shuffleOrderV1(e.options.length, choiceSeed(session, e.id));
    assert.deepEqual(p.option_order, order);
    const texts = e.options.map((o) => o.text);
    // Lo que la app muestra es exactamente lo registrado, y es lo que mostraba la app antes.
    assert.deepEqual(
      p.options_shown,
      order.map((k) => texts[k]),
    );
    assert.deepEqual(p.options_shown, appShuffle(texts, choiceSeed(session, e.id)));
    const row = await one(
      `select shuffle_algorithm, shuffle_seed from public.exercise_presentations where id = $1`,
      [p.presentation_id],
    );
    assert.equal(row.shuffle_algorithm, SHUFFLE_V1);
    assert.equal(row.shuffle_seed, choiceSeed(session, e.id));
  }

  // Reintento de red: mismas presentaciones, nada nuevo.
  const again = await start(user, session, lesson);
  assert.equal(again.duplicate, true);
  assert.deepEqual(
    again.presentations.map((p) => p.presentation_id),
    r.presentations.map((p) => p.presentation_id),
  );
  const n = await one(
    `select count(*)::int n from public.exercise_presentations where session_id = $1`,
    [session],
  );
  assert.equal(n.n, expected.length);
});

test('lección correcta: veredicto del servidor, intentos vinculados a la versión y SRS v1 por su vía', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const snaps = await snapshotsOf(user, session);
  const r = await submit(user, session, lesson, answerAll(snaps));
  assert.equal(r.duplicate, false);
  assert.equal(r.first_try_total, snaps.length);
  assert.equal(r.first_try_correct, snaps.length);
  assert.equal(r.verdicts.length, snaps.length);
  assert.ok(r.verdicts.every((v) => v.status === 'valid' && v.verdict === 'correct'));

  const rows = await gradings(session);
  assert.equal(rows.length, snaps.length);
  for (const [i, g] of rows.entries()) {
    const s = snaps[i];
    assert.equal(Number(g.presentation_id), s.presentation_id);
    assert.equal(Number(g.item_version_id), Number(s.item_version_id));
    assert.equal(g.grading_mode_id, s.grading_mode_id);
    assert.equal(g.input_modality, s.input_modality);
    assert.equal(g.attempt_no, 1);
    assert.equal(g.is_correct, true);
    assert.equal(g.is_first_try, true);
    assert.equal(g.grader, LEARNING_GRADER.grader);
    if (s.grading_mode_id === 'exact_option.v1') {
      assert.equal(s.option_texts[g.selected_option], s.answer);
    } else {
      assert.equal(g.selected_option, null);
    }
  }
  const links = await one(
    `select count(*)::int n from public.exercise_attempt_presentations l
     join public.exercise_attempts a on a.id = l.attempt_id where a.session_id = $1`,
    [session],
  );
  assert.equal(links.n, snaps.length);
  const recon = await all(
    `select status from public.exercise_attempt_reconstruction where session_id = $1`,
    [session],
  );
  assert.ok(recon.every((x) => x.status === 'reconstructible'));
  // Lo de siempre de submit_learning_session: sesión, progreso, SRS.
  const s = await one(`select kind, lesson_id from public.learning_sessions where id = $1`, [
    session,
  ]);
  assert.deepEqual(s, { kind: 'lesson', lesson_id: lesson });
  const progress = await one(
    `select times_completed from public.user_lesson_progress where user_id = $1 and lesson_id = $2`,
    [user, lesson],
  );
  assert.equal(progress.times_completed, 2);
  const words = await one(
    `select count(*)::int n from public.user_word_progress where user_id = $1`,
    [user],
  );
  assert.ok(words.n > 0);
});

test('error y reintento: número de intento, primer intento y el veredicto del cliente no decide', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const snaps = await snapshotsOf(user, session);
  const [first, ...rest] = snaps;
  const attempts = [
    // El cliente dice «correcta» sobre una respuesta equivocada.
    {
      presentation_id: first.presentation_id,
      answer: wrongAnswer(first),
      client_verdict: 'correct',
      response_ms: 900,
    },
    ...answerAll(rest),
    {
      presentation_id: first.presentation_id,
      answer: rightAnswer(first),
      client_verdict: 'correct',
      response_ms: 700,
    },
  ];
  const r = await submit(user, session, lesson, attempts);
  assert.equal(r.first_try_correct, snaps.length - 1);
  const rows = await gradings(session);
  const mine = rows.filter((g) => Number(g.presentation_id) === first.presentation_id);
  assert.deepEqual(
    mine.map((g) => [g.attempt_no, g.verdict, g.client_verdict, g.is_correct, g.is_first_try]),
    [
      [1, 'incorrect', 'correct', false, true],
      [2, 'correct', 'correct', true, false],
    ],
  );
  // El SRS v1 recibió el veredicto del servidor: la palabra del ejercicio fallado no subió como acertada.
  const att = await one(
    `select count(*)::int n from public.exercise_attempts where session_id = $1 and is_correct = false`,
    [session],
  );
  assert.equal(att.n, 1);
});

test('cada modo: exact_option, normalized_text (texto, fichas y tipeo) y pair_set', async () => {
  for (const types of [['order_words'], ['translate_write'], ['complete_word'], ['match_pairs']]) {
    const lesson = await lessonWith(...types);
    const user = await learner(lesson);
    const session = randomUUID();
    await start(user, session, lesson);
    const snaps = await snapshotsOf(user, session);
    const r = await submit(user, session, lesson, answerAll(snaps));
    assert.ok(
      r.verdicts.every((v) => v.verdict === 'correct'),
      `${types}: ${j(r.verdicts)}`,
    );
    const modes = new Set(snaps.map((s) => s.grading_mode_id));
    if (types[0] === 'match_pairs') assert.ok(modes.has('pair_set.v1'));
    if (types[0] === 'order_words') {
      const rows = await gradings(session);
      assert.ok(
        rows.some(
          (g) => g.response_kind === 'tokens' && g.grading_mode_id === 'normalized_text.v1',
        ),
      );
    }
  }

  // Tipeo (polygo.answers.v1: distancia 1 desde 8 caracteres) sólo donde typo_tolerance es true.
  const { lesson_id: lesson } = await one(
    `select e.lesson_id from public.exercises e
     join public.lessons l on l.id = e.lesson_id join public.curriculum_units u on u.id = l.unit_id
     where u.language_code = 'en' and e.type = 'translate_write' and e.answer ~ '^[A-Za-z]{4}'
       and char_length(e.answer) >= 10
     order by e.lesson_id limit 1`,
  );
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const snaps = await snapshotsOf(user, session);
  // Una letra cambiada en el medio; el ítem se elige donde el contrato v1 lo da por tipeo.
  const misspell = (a) => a.slice(0, 3) + (a[3] === 'q' ? 'z' : 'q') + a.slice(4);
  const target = snaps.find(
    (s) =>
      s.grading_spec.typo_tolerance === true &&
      /^[a-z]{4}/i.test(s.answer) &&
      verdictForText(misspell(s.answer), [s.answer, ...s.accepted_answers], true).typo === true,
  );
  assert.ok(target, 'hace falta un ítem con tipeo en la lección');
  {
    const typo = { kind: 'text', value: misspell(target.answer) };
    const attempts = answerAll(snaps).map((a) =>
      a.presentation_id === target.presentation_id ? { ...a, answer: typo } : a,
    );
    const r = await submit(user, session, lesson, attempts);
    const v = r.verdicts.find((x) => Number(x.presentation_id) === target.presentation_id);
    assert.equal(v.verdict, 'typo');
  }
});

test('respuesta imposible para lo presentado: invalid_response, sin veredicto y como incorrecta', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const snaps = await snapshotsOf(user, session);
  const choice = snaps.find((s) => s.grading_mode_id === 'exact_option.v1');
  const attempts = answerAll(snaps).map((a) =>
    a.presentation_id === choice.presentation_id
      ? { ...a, answer: { kind: 'option', value: choice.answer + ' (inventada)' } }
      : a,
  );
  attempts.push({
    presentation_id: choice.presentation_id,
    answer: rightAnswer(choice),
    response_ms: 500,
  });
  await submit(user, session, lesson, attempts);
  const rows = (await gradings(session)).filter(
    (g) => Number(g.presentation_id) === choice.presentation_id,
  );
  assert.deepEqual(
    rows.map((g) => [g.status, g.verdict, g.is_correct, g.selected_option]),
    [
      ['invalid_response', null, false, null],
      ['valid', 'correct', true, choice.option_texts.indexOf(choice.answer)],
    ],
  );
});

test('reintentos de red: el mismo envío no duplica nada y devuelve los mismos veredictos', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const snaps = await snapshotsOf(user, session);
  const attempts = answerAll(snaps);
  const first = await submit(user, session, lesson, attempts);
  const energy = await one(`select units from public.user_energy where user_id = $1`, [user]);
  const second = await submit(user, session, lesson, attempts);
  assert.equal(second.duplicate, true);
  assert.deepEqual(second.verdicts, first.verdicts);
  assert.equal(second.first_try_correct, first.first_try_correct);
  const counts = await one(
    `select (select count(*)::int from public.exercise_attempts where session_id = $1) a,
            (select count(*)::int from public.exercise_attempt_gradings where session_id = $1) g,
            (select count(*)::int from public.learning_sessions where id = $1) s`,
    [session],
  );
  assert.deepEqual(counts, { a: snaps.length, g: snaps.length, s: 1 });
  assert.deepEqual(
    await one(`select units from public.user_energy where user_id = $1`, [user]),
    energy,
  );
  // Una vez enviada, la sesión no admite presentaciones nuevas.
  const closed = await errorOf(start(user, session, lesson));
  assert.match(String(closed?.message), /session_closed/);
});

test('sesiones ajenas: ni presentar, ni leer, ni enviar con la sesión de otra cuenta', async () => {
  const lesson = await lessonWith('translation_choice');
  const alice = await learner(lesson);
  const bob = await learner(lesson);
  const session = randomUUID();
  await start(alice, session, lesson);
  const snaps = await snapshotsOf(alice, session);

  assert.match(String((await errorOf(start(bob, session, lesson)))?.message), /session_conflict/);
  assert.deepEqual(await snapshotsOf(bob, session), []);
  // Bob con las presentaciones de Alice: su lectura no las ve, el núcleo las rechaza.
  const err = await errorOf(submit(bob, session, lesson, answerAll(snaps)));
  assert.ok(err instanceof LearningSessionError && err.code === 'presentation_not_found');
  // Y si alguien llamara la SQL directamente con esas presentaciones:
  const graded = gradeLessonAttempts(snaps, answerAll(snaps));
  const direct = await errorOf(
    service(() =>
      fn('learning_submit_graded', [
        bob,
        session,
        lesson,
        new Date(Date.now() - 60000).toISOString(),
        'UTC',
        j(graded.attempts),
        j(graded.gradings),
        j(LEARNING_GRADER),
      ]),
    ),
  );
  assert.match(String(direct?.message), /session_conflict/);
  // Después de que Alice envía, Bob tampoco puede reclamar la sesión por la ruta vieja.
  await submit(alice, session, lesson, answerAll(snaps));
  const legacy = await errorOf(
    as(db, 'authenticated', bob, () =>
      db.query(
        `select public.submit_learning_session($1, 'lesson', $2, now() - interval '1 minute', $3::jsonb, 'UTC')`,
        [session, lesson, j(graded.attempts)],
      ),
    ),
  );
  assert.match(String(legacy?.message), /session_conflict/);
});

test('presentaciones inexistentes o manipuladas y correcciones incoherentes se rechazan sin guardar nada', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  const other = randomUUID();
  await start(user, session, lesson);
  await start(user, other, lesson);
  const snaps = await snapshotsOf(user, session);
  const otherSnaps = await snapshotsOf(user, other);

  // Núcleo: id que no existe.
  const missing = answerAll(snaps);
  missing[0] = { ...missing[0], presentation_id: 999999999 };
  const e1 = await errorOf(submit(user, session, lesson, missing));
  assert.equal(e1?.code, 'presentation_not_found');

  const valid = gradeLessonAttempts(snaps, answerAll(snaps));
  const call = (attempts, grads) =>
    errorOf(
      service(() =>
        fn('learning_submit_graded', [
          user,
          session,
          lesson,
          new Date(Date.now() - 60000).toISOString(),
          'UTC',
          j(attempts),
          j(grads),
          j(LEARNING_GRADER),
        ]),
      ),
    );
  // SQL: presentación de otra sesión (de la misma cuenta).
  const foreign = valid.gradings.map((g, i) =>
    i === 0 ? { ...g, presentation_id: otherSnaps[0].presentation_id } : g,
  );
  assert.match(String((await call(valid.attempts, foreign))?.message), /invalid_gradings/);
  // SQL: el intento dice «correcta» pero la corrección dice «incorrecta».
  const lie = valid.gradings.map((g, i) => (i === 0 ? { ...g, verdict: 'incorrect' } : g));
  assert.match(String((await call(valid.attempts, lie))?.message), /invalid_gradings/);
  // Trigger: la opción elegida no es la de la respuesta.
  const choiceAt = valid.gradings.findIndex((g) => g.selected_option !== null);
  const badOption = valid.gradings.map((g, i) =>
    i === choiceAt
      ? { ...g, selected_option: (g.selected_option + 1) % snaps[i].option_texts.length }
      : g,
  );
  assert.match(String((await call(valid.attempts, badOption))?.message), /opción elegida/);
  // Trigger: ayuda que no existe.
  const badAssist = valid.gradings.map((g, i) =>
    i === 0 ? { ...g, assists: { cheat_mode: 1 } } : g,
  );
  assert.match(String((await call(valid.attempts, badAssist))?.message), /ref_assists/);
  // Núcleo: reintento después de acertar.
  const after = [...answerAll(snaps), answerAll(snaps)[0]];
  assert.equal((await errorOf(submit(user, session, lesson, after)))?.code, 'invalid_sequence');

  const left = await one(
    `select (select count(*)::int from public.learning_sessions where id = $1) s,
            (select count(*)::int from public.exercise_attempt_gradings where session_id = $1) g`,
    [session],
  );
  assert.deepEqual(left, { s: 0, g: 0 });
  // Y después, el envío honesto funciona.
  const ok = await submit(user, session, lesson, answerAll(snaps));
  assert.equal(ok.duplicate, false);
});

test('cambio de contenido después de presentar: se corrige con la versión presentada', async () => {
  const lesson = await lessonWith('translate_write');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const before = await snapshotsOf(user, session);
  const target = before.find(
    (s) => s.grading_mode_id === 'normalized_text.v1' && s.payload.type === 'translate_write',
  );

  // Se publica una versión nueva del ítem con otra respuesta y la ubicación pasa a mostrarla.
  await db.exec('begin');
  await db.query(
    `insert into public.exercise_item_versions (item_id, version, content_hash, prompt_es, payload, answer,
       accepted_answers, explanation_es, difficulty, recommended_seconds, grading_spec, generator, generator_version)
     select item_id, version + 1, 'test:phase2', prompt_es, payload, 'respuesta nueva', '{}', explanation_es,
       difficulty, recommended_seconds, grading_spec, generator, generator_version
     from public.exercise_item_versions where id = $1`,
    [target.item_version_id],
  );
  await db.query(
    `update public.exercise_items set current_version_id = (select id from public.exercise_item_versions
       where item_id = $1 and content_hash = 'test:phase2') where id = $1`,
    [target.item_id],
  );
  await db.query(
    `update public.exercises set answer = 'respuesta nueva', accepted_answers = '{}',
       item_version_id = (select current_version_id from public.exercise_items where id = $1)
     where id = $2`,
    [target.item_id, target.exercise_id],
  );
  await db.exec('commit');

  const after = await snapshotsOf(user, session);
  assert.deepEqual(after, before);
  const r = await submit(user, session, lesson, answerAll(before));
  assert.ok(r.verdicts.every((v) => v.verdict === 'correct'));
  const g = (await gradings(session)).find(
    (x) => Number(x.presentation_id) === target.presentation_id,
  );
  assert.equal(Number(g.item_version_id), Number(target.item_version_id));
  // Una sesión nueva ya presenta la versión nueva.
  const fresh = randomUUID();
  const user2 = await learner(lesson);
  await start(user2, fresh, lesson);
  const now = (await snapshotsOf(user2, fresh)).find((s) => s.exercise_id === target.exercise_id);
  assert.equal(now.answer, 'respuesta nueva');
  assert.notEqual(Number(now.item_version_id), Number(target.item_version_id));
});

test('atomicidad: sin energía no queda ni sesión, ni intentos, ni vínculos, ni correcciones', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const snaps = await snapshotsOf(user, session);
  await db.query(
    `insert into public.user_energy (user_id, units, anchor_at) values ($1, 0, now())
     on conflict (user_id) do update set units = 0, anchor_at = now()`,
    [user],
  );
  const err = await errorOf(submit(user, session, lesson, answerAll(snaps)));
  assert.match(String(err?.message), /no_energy/);
  const left = await one(
    `select (select count(*)::int from public.learning_sessions where id = $1) s,
            (select count(*)::int from public.exercise_attempts where session_id = $1) a,
            (select count(*)::int from public.exercise_attempt_gradings where session_id = $1) g,
            (select count(*)::int from public.exercise_presentations where session_id = $1) p`,
    [session],
  );
  assert.deepEqual(left, { s: 0, a: 0, g: 0, p: snaps.length });
  // Los claims del JWT quedaron como estaban.
  assert.equal((await one(`select current_setting('request.jwt.claim.sub', true) c`)).c, '');
});

test('lección incompleta: la regla de submit_learning_session sigue valiendo', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  const snaps = await snapshotsOf(user, session);
  const err = await errorOf(submit(user, session, lesson, answerAll(snaps.slice(1))));
  assert.match(String(err?.message), /incomplete_lesson/);
});

test('permisos: la app no puede llamar las funciones ni leer las correcciones; son inmutables', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const session = randomUUID();
  await start(user, session, lesson);
  await submit(user, session, lesson, answerAll(await snapshotsOf(user, session)));
  for (const role of ['anon', 'authenticated']) {
    for (const sql of [
      `select public.learning_lesson_plan('${user}', '${lesson}')`,
      `select public.learning_start_lesson('${user}', '${randomUUID()}', '${lesson}', '{}')`,
      `select public.learning_session_presentations('${user}', '${session}')`,
      `select public.learning_submit_graded('${user}', '${session}', '${lesson}', now(), 'UTC', '[]', '[]', '{}')`,
      `select * from public.exercise_attempt_gradings`,
    ]) {
      const err = await errorOf(as(db, role, user, () => db.query(sql)));
      assert.match(String(err?.message), /permission denied/, `${role}: ${sql}`);
    }
  }
  for (const sql of [
    `update public.exercise_attempt_gradings set verdict = 'correct' where session_id = '${session}'`,
    `delete from public.exercise_attempt_gradings where session_id = '${session}'`,
  ]) {
    assert.match(String((await errorOf(db.query(sql)))?.message), /inmutables/);
  }
});

test('compatibilidad: la ruta vieja (lecciones y repasos) sigue igual y queda no reconstruible', async () => {
  const lesson = await lessonWith('translation_choice');
  const user = await learner(lesson);
  const exercises = await all(
    `select id, answer from public.exercises where lesson_id = $1 and is_published order by position`,
    [lesson],
  );
  const session = randomUUID();
  const r = await as(db, 'authenticated', user, () =>
    one(
      `select public.submit_learning_session($1, 'lesson', $2, now() - interval '1 minute', $3::jsonb, 'UTC') r`,
      [
        session,
        lesson,
        j(
          exercises.map((e) => ({
            exercise_id: e.id,
            answer: e.answer,
            correct: true,
            first_try: true,
            response_ms: 1000,
          })),
        ),
      ],
    ),
  );
  assert.equal(r.r.duplicate, false);
  const recon = await all(
    `select status from public.exercise_attempt_reconstruction where session_id = $1`,
    [session],
  );
  assert.ok(recon.length > 0 && recon.every((x) => x.status === 'not_reconstructible'));
  const word = await one(
    `select id from public.words where language_code = 'en' and is_published limit 1`,
  );
  const review = randomUUID();
  // Repaso por el cuerpo v1: desde 20261112120000 sólo el servidor (service_role), no la app.
  const rr = await as(db, 'service_role', user, () =>
    one(
      `select public.submit_learning_session($1, 'review', '', now() - interval '1 minute', $2::jsonb, 'UTC') r`,
      [
        review,
        j([{ word_id: word.id, answer: 'x', correct: false, first_try: true, response_ms: 1000 }]),
      ],
    ),
  );
  assert.equal(rr.r.duplicate, false);
});

test('el paquete de la Edge Function está al día con shared/', () => {
  for (const { entry, out } of FUNCTION_BUNDLES) {
    const current = readFileSync(new URL(`../../${out}`, import.meta.url), 'utf8');
    assert.equal(current, bundle(entry), `${out}: npm run functions:build`);
  }
});

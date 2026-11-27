// Cierre de la fase 4 (migración 20261110140000_learning_phase4_close.sql, docs/LEARNING_PHASE4.md §10)
// en PGlite: P3 repasos Plus por el servidor, P4 repeticiones de errores, P7 vencimiento por día local,
// P6 retención y P2 dominio en el perfil público. Reproduce lo que hace la Edge Function learning-session
// con las mismas funciones SQL y el mismo núcleo TS.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, as } from './harness.mjs';
import { helpers, answerAll, rightAnswer, wrongAnswer, TZ, j } from './learningHelpers.mjs';
import { buildFocusPlan } from '../../shared/focusReview.ts';
import {
  gradeReviewAnswer,
  gradeReviewAttempts,
  LEARNING_GRADER,
  MAX_REVIEW_ATTEMPTS,
  reviewPresentationOrders,
} from '../../shared/learningSession.ts';

let db;
let h;
let lesson;

before(async () => {
  db = await createDb();
  h = helpers(db);
  lesson = await h.lessonWith('translation_choice', 'translate_write');
  await h.setEnabled(false);
});

const grantPlus = (user) =>
  db.query(
    `insert into public.user_entitlements (user_id, entitlement, source) values ($1, 'plus', 'manual')`,
    [user],
  );

/** Alumno con una lección corregida (progreso v1) y sus palabras vencidas en el v1. */
async function studied(make = rightAnswer) {
  const user = await h.learner(lesson);
  const s = randomUUID();
  await h.startLesson(user, s, lesson);
  const snaps = await h.snapshotsOf(user, s);
  await h.submitLesson(user, s, lesson, answerAll(snaps, make), new Date(Date.now() - 5 * 60000));
  await db.query(
    `update public.user_word_progress set next_review_at = now() - interval '1 hour' where user_id = $1`,
    [user],
  );
  return user;
}

/** La Edge Function, start_review con `focus` (P3). */
async function startFocus(user, session, focus, lang = 'en') {
  return h.service(async () => {
    const state = await h.call('learning_review_prepare', [user, session, TZ]);
    if (state.session === 'open' || state.session === 'expired') {
      return { state, items: await h.call('learning_review_content', [user, session]) };
    }
    const cand = await h.call('learning_focus_candidates', [user, lang, new Date().toISOString()]);
    if (cand.plus !== true) return { state, error: 'plus_required' };
    const plan = buildFocusPlan({ ...cand, seed: session }, focus);
    if (plan.items.length === 0) return { state, plan, cand };
    await h.call('learning_start_focus_review', [
      user,
      session,
      lang,
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]);
    return { state, plan, cand, items: await h.call('learning_review_content', [user, session]) };
  });
}

/** La Edge Function, answer_review (attempt_no 1 → learning_review_answer; 2–3 → learning_review_retry). */
async function answer(user, session, attempt, attemptNo = 1) {
  return h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const one = gradeReviewAnswer(snaps, attempt, words, attemptNo);
    return h.call(attemptNo === 1 ? 'learning_review_answer' : 'learning_review_retry', [
      user,
      session,
      j(one.grading),
      one.responseMs,
      j(LEARNING_GRADER),
    ]);
  });
}

async function submit(user, session, attempts) {
  return h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const graded = gradeReviewAttempts(snaps, attempts, words);
    return h.call('learning_submit_review_graded', [
      user,
      session,
      new Date(Date.now() - 60000).toISOString(),
      TZ,
      j(graded.attempts),
      j(graded.gradings),
      j(LEARNING_GRADER),
    ]);
  });
}

const snapshotsOf = (user, session) =>
  h.service(() => h.call('learning_session_presentations', [user, session]));
const prepare = (user, session) =>
  h.service(() => h.call('learning_review_prepare', [user, session, TZ]));
const count = async (sql, params) => (await h.one(`select count(*)::int n from ${sql}`, params)).n;

test('P3: el repaso inteligente lo arma, registra y corrige el servidor, y exige Plus en el servidor', async () => {
  await h.setEnabled(false);
  const user = await studied();
  const session = randomUUID();
  // Sin Plus: el servidor no lo arma (ni con un plan armado a mano).
  const denied = await startFocus(user, session, { kind: 'smart' });
  assert.equal(denied.error, 'plus_required');
  const cand = await h.service(() =>
    h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]),
  );
  const forged = buildFocusPlan({ ...cand, seed: session }, { kind: 'smart' });
  assert.ok(forged.items.length > 0);
  await assert.rejects(
    h.service(() =>
      h.call('learning_start_focus_review', [
        user,
        session,
        'en',
        TZ,
        j(forged),
        j(reviewPresentationOrders(session, forged.items)),
      ]),
    ),
    /plus_required/,
  );
  await assert.rejects(
    as(db, 'authenticated', user, () =>
      h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]),
    ),
    /permission denied/,
  );

  await grantPlus(user);
  const r = await startFocus(user, session, { kind: 'smart' });
  assert.ok(r.items.length > 0 && r.items.length <= 15);
  for (const it of r.items) {
    assert.equal(it.answered, null);
    assert.ok(!JSON.stringify(it.payload).includes('"answer"'), 'sin la respuesta');
    assert.equal(it.reason, 'due', 'palabras vencidas del v1 primero');
  }
  const plan = await h.one(
    'select source, planner_version, focus, time_zone, local_date::text d from public.srs_session_plans where session_id = $1',
    [session],
  );
  assert.equal(plan.source, 'focus_review');
  assert.equal(plan.planner_version, 'focus-1.1.0'); // fase 5
  assert.deepEqual(plan.focus, { kind: 'smart' });
  assert.equal(plan.time_zone, TZ);
  // Con el v2 apagado sigue siendo un repaso del servidor (no el modo declarado del repaso básico).
  assert.equal((await prepare(user, session)).source, 'focus_review');

  // Corrección del servidor, envío por la misma vía de repasos: v1 actualizado, evidencias corregidas.
  const snaps = await snapshotsOf(user, session);
  const attempts = snaps.map((s, i) => ({
    presentation_id: s.presentation_id,
    answer: i === 0 ? wrongAnswer(s) : rightAnswer(s),
    client_verdict: 'correct',
    response_ms: 1500,
  }));
  const a0 = await answer(user, session, attempts[0]);
  assert.equal(a0.verdict, 'incorrect', 'el cliente no decide');
  const before = await h.one(
    `select incorrect_count from public.user_word_progress where user_id = $1 and word_id = $2`,
    [user, r.items[0].concept_id],
  );
  const res = await submit(user, session, attempts);
  assert.equal(res.first_try_total, snaps.length);
  assert.equal(res.first_try_correct, snaps.length - 1);
  assert.equal(
    (await h.one('select kind from public.learning_sessions where id = $1', [session])).kind,
    'review',
  );
  assert.equal(
    await count('public.exercise_attempt_gradings where session_id = $1', [session]),
    snaps.length,
  );
  const after = await h.one(
    `select incorrect_count from public.user_word_progress where user_id = $1 and word_id = $2`,
    [user, r.items[0].concept_id],
  );
  assert.equal(after.incorrect_count, before.incorrect_count + 1);
  // v2 apagado: nada del SRS v2.
  assert.equal(await count('public.srs_applied_sessions where session_id = $1', [session]), 0);
  // Reenvío idempotente.
  assert.equal((await submit(user, session, attempts)).duplicate, true);
});

test('P3: el plan Plus se valida en el servidor (palabra no estudiada, otra unidad, motivo, tipo de sesión)', async () => {
  const user = await studied();
  await grantPlus(user);
  const cand = await h.service(() =>
    h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]),
  );
  const unit = cand.words[0].word.unit_id;
  const topic = buildFocusPlan({ ...cand, seed: 'x' }, { kind: 'topic', unit_id: unit });
  assert.ok(topic.items.length > 0);
  assert.ok(topic.items.every((i) => i.reason === 'topic'));
  const start = (session, plan) =>
    h.service(() =>
      h.call('learning_start_focus_review', [
        user,
        session,
        'en',
        TZ,
        j(plan),
        j(reviewPresentationOrders(session, plan.items)),
      ]),
    );

  // Una palabra que el usuario nunca estudió.
  const other = await h.one(
    `select c.id, w.unit_id from public.concepts c join public.words w on w.id = c.word_id
    where c.kind = 'lexical' and w.language_code = 'en' and w.is_published
      and not exists (select 1 from public.user_word_progress p where p.user_id = $1 and p.word_id = w.id)
      and exists (select 1 from public.review_item_candidates('en') r where r.concept_id = c.id and r.dimension = 'vocabulary')
    order by c.id limit 1`,
    [user],
  );
  const item = await h.one(
    `select item_id, rung, option_count from public.review_item_candidates('en') where concept_id = $1 and dimension = 'vocabulary' order by item_id limit 1`,
    [other.id],
  );
  const s1 = randomUUID();
  const bad = {
    ...topic,
    focus: { kind: 'smart' },
    items: [
      {
        position: 1,
        item_id: item.item_id,
        concept_id: other.id,
        dimension: 'vocabulary',
        rung: item.rung,
        reason: 'due',
        option_count: item.option_count,
      },
    ],
  };
  await assert.rejects(start(s1, bad), /invalid_plan/);
  // Motivo que no es de ese foco.
  await assert.rejects(
    start(s1, { ...topic, items: topic.items.map((i) => ({ ...i, reason: 'due' })) }),
    /invalid_plan/,
  );
  // Otra unidad.
  await assert.rejects(
    start(s1, { ...topic, focus: { kind: 'topic', unit_id: 'otra-unidad' } }),
    /invalid_plan/,
  );
  assert.equal(await count('public.srs_session_plans where session_id = $1', [s1]), 0);
  // El bueno. prepare informa el origen: la Edge Function no mezcla un session_id de un repaso Plus con
  // el adaptativo (session_conflict).
  await start(s1, topic);
  const plan = await h.one('select focus from public.srs_session_plans where session_id = $1', [
    s1,
  ]);
  assert.deepEqual(plan.focus, { kind: 'topic', unit_id: unit });
  assert.equal((await prepare(user, s1)).source, 'focus_review');
  // Repetir el inicio es idempotente (misma sesión, mismo plan).
  assert.equal((await start(s1, topic)).duplicate, true);
});

test('P3: un repaso Plus no consume el «primer repaso del día» del armador adaptativo (AL8)', async () => {
  await h.setEnabled(true);
  const user = await studied();
  await grantPlus(user);
  const session = randomUUID();
  await h.service(() => h.call('learning_review_prepare', [user, session, TZ])); // migra al usuario
  const r = await startFocus(user, session, { kind: 'smart' });
  assert.ok(r.items?.length > 0);
  const snaps = await snapshotsOf(user, session);
  await submit(
    user,
    session,
    answerAll(snaps, rightAnswer).map((a) => ({ ...a, client_verdict: 'correct' })),
  );
  const cand = await h.service(() =>
    h.call('learning_review_candidates', [user, 'en', TZ, new Date().toISOString()]),
  );
  assert.equal(cand.budget.first_review_today, true);
  // Con el v2 encendido el repaso Plus va por la vía única con su origen.
  assert.equal(
    (await h.one('select source from public.srs_applied_sessions where session_id = $1', [session]))
      .source,
    'focus_review',
  );
  await h.setEnabled(false);
});

test('P4: repeticiones de un error corregidas por el servidor, acotadas, idempotentes y fuera de la evidencia', async () => {
  const user = await studied();
  await grantPlus(user);
  const session = randomUUID();
  await startFocus(user, session, { kind: 'smart' });
  const snaps = await snapshotsOf(user, session);
  assert.ok(snaps.length >= 2);
  const [s0, s1] = snaps;
  const att = (s, ans) => ({
    presentation_id: s.presentation_id,
    answer: ans,
    client_verdict: 'correct',
    response_ms: 1000,
  });

  // Repetir antes de responder, o repetir un acierto: no.
  await assert.rejects(answer(user, session, att(s0, rightAnswer(s0)), 2), /retry_not_allowed/);
  await answer(user, session, att(s1, rightAnswer(s1)));
  await assert.rejects(answer(user, session, att(s1, rightAnswer(s1)), 2), /retry_not_allowed/);
  // La primera respuesta no admite attempt_no > 1 por la otra vía.
  await assert.rejects(
    h.service(async () => {
      const one = gradeReviewAnswer(
        snaps,
        att(s0, wrongAnswer(s0)),
        await h.call('learning_review_words', [user, session]),
        2,
      );
      return h.call('learning_review_answer', [
        user,
        session,
        j(one.grading),
        1000,
        j(LEARNING_GRADER),
      ]);
    }),
    /invalid_request/,
  );

  // Falla, repite mal, repite bien.
  const first = await answer(user, session, att(s0, wrongAnswer(s0)));
  assert.equal(first.verdict, 'incorrect');
  await assert.rejects(
    answer(user, session, att(s0, rightAnswer(s0)), 3),
    /retry_not_allowed/,
    'el 3 exige el 2',
  );
  const r2 = await answer(user, session, att(s0, wrongAnswer(s0)), 2);
  assert.equal(r2.attempt_no, 2);
  assert.equal(r2.verdict, 'incorrect');
  const r3 = await answer(user, session, att(s0, rightAnswer(s0)), 3);
  assert.equal(r3.verdict, 'correct', 'el servidor corrige la repetición');
  assert.equal(r3.duplicate, false);
  // Reintento de red: la misma corrección, sin duplicar.
  const again = await answer(user, session, att(s0, wrongAnswer(s0)), 3);
  assert.equal(again.duplicate, true);
  assert.equal(again.verdict, 'correct');
  assert.equal(
    await count('public.review_presentation_retries where presentation_id = $1', [
      s0.presentation_id,
    ]),
    2,
  );
  // Tope: no hay intento 4.
  assert.throws(
    () => gradeReviewAnswer(snaps, att(s0, rightAnswer(s0)), {}, MAX_REVIEW_ATTEMPTS + 1),
    /invalid_attempt_no/,
  );
  await assert.rejects(
    db.query('update public.review_presentation_retries set verdict = $1', ['incorrect']),
    /inmutable/,
  );

  // Retomar trae las repeticiones; la primera respuesta sigue siendo la que vale.
  const content = await h.service(() => h.call('learning_review_content', [user, session]));
  const c0 = content.find((c) => c.presentation_id === s0.presentation_id);
  assert.equal(c0.answered.verdict, 'incorrect');
  assert.deepEqual(
    c0.retries.map((r) => [r.attempt_no, r.verdict]),
    [
      [2, 'incorrect'],
      [3, 'correct'],
    ],
  );

  // Envío: sólo primeros intentos (una corrección por presentación); las repeticiones no son evidencia.
  const all = snaps.map((s) => att(s, s === s0 ? wrongAnswer(s) : rightAnswer(s)));
  const res = await submit(user, session, all);
  assert.equal(
    res.first_try_correct,
    snaps.length - 1,
    'el error del primer intento cuenta como error',
  );
  assert.equal(
    await count('public.exercise_attempt_gradings where session_id = $1', [session]),
    snaps.length,
  );
  assert.equal(
    await count('public.exercise_attempt_gradings where session_id = $1 and attempt_no <> 1', [
      session,
    ]),
    0,
  );
  assert.equal(
    await count('public.exercise_attempts where session_id = $1', [session]),
    snaps.length,
  );
  // Cerrada: no admite más repeticiones.
  await assert.rejects(answer(user, session, att(s0, rightAnswer(s0)), 2), /session_closed/);
});

test('P7: retomar sólo el mismo día local de la zona registrada; vencida no admite respuestas pero se envía completa', async () => {
  const user = await studied();
  await grantPlus(user);
  const session = randomUUID();
  await startFocus(user, session, { kind: 'smart' });
  const plan = await h.one(
    'select local_date::text d, time_zone from public.srs_session_plans where session_id = $1',
    [session],
  );
  assert.equal(plan.time_zone, TZ);
  // El criterio es la zona del plan, no la del dispositivo de ahora: 23:30 en Buenos Aires sigue siendo hoy.
  await db.query(
    `update public.srs_session_plans set local_date = '2026-11-08', created_at = '2026-11-08T15:00:00Z',
                    expires_at = '2027-02-06T15:00:00Z' where session_id = $1`,
    [session],
  );
  const exp = (at) =>
    h.one('select public.review_plan_expired($1, $2) e', [session, at]).then((r) => r.e);
  assert.equal(await exp('2026-11-09T02:30:00Z'), false, '23:30 del 8 en Buenos Aires');
  assert.equal(await exp('2026-11-09T03:30:00Z'), true, '00:30 del 9 en Buenos Aires');
  assert.equal(await exp('2027-02-07T00:00:00Z'), true, 'plan vencido');

  // Hoy es otro día para el plan: vencida, incompleta.
  const snaps = await snapshotsOf(user, session);
  const att = (s) => ({
    presentation_id: s.presentation_id,
    answer: rightAnswer(s),
    client_verdict: 'correct',
    response_ms: 900,
  });
  // Una respuesta registrada a tiempo (el plan es de hoy) y después cambia el día.
  await db.query(
    `update public.srs_session_plans set local_date = (now() at time zone $2)::date where session_id = $1`,
    [session, TZ],
  );
  const a0 = await answer(user, session, att(snaps[0]));
  await db.query(
    `update public.srs_session_plans set local_date = (now() at time zone $2)::date - 1 where session_id = $1`,
    [session, TZ],
  );
  let st = await prepare(user, session);
  assert.equal(st.session, 'expired');
  assert.equal(st.complete, false);
  await assert.rejects(answer(user, session, att(snaps[1])), /session_expired/);
  // Un reintento de lo ya registrado devuelve lo mismo (nada se pierde ni se duplica).
  const dup = await answer(user, session, att(snaps[0]));
  assert.equal(dup.duplicate, true);
  assert.equal(dup.verdict, a0.verdict);
  const status = await h.service(() => h.call('learning_jobs_status', []));
  assert.ok(status.review_sessions.abandoned >= 1);

  // Completa (respuestas registradas a tiempo) y vencida: se puede enviar; la evidencia no se pierde.
  await db.query(
    `update public.srs_session_plans set local_date = (now() at time zone $2)::date where session_id = $1`,
    [session, TZ],
  );
  for (const s of snaps.slice(1)) await answer(user, session, att(s));
  await db.query(
    `update public.srs_session_plans set local_date = (now() at time zone $2)::date - 1 where session_id = $1`,
    [session, TZ],
  );
  st = await prepare(user, session);
  assert.equal(st.session, 'expired');
  assert.equal(st.complete, true);
  const status2 = await h.service(() => h.call('learning_jobs_status', []));
  assert.ok(status2.review_sessions.expired_complete >= 1);
  const res = await submit(user, session, snaps.map(att));
  assert.equal(res.first_try_total, snaps.length);
  assert.equal((await prepare(user, session)).session, 'closed');
});

test('P6: la retención borra sólo registros operativos viejos, conserva el último por trabajo y es idempotente', async () => {
  await db.query('delete from public.learning_job_runs');
  const ins = (job, days, status) =>
    db.query(
      `insert into public.learning_job_runs (job, started_at, status) values ($1, now() - make_interval(days => $2), $3)`,
      [job, days, status],
    );
  await ins('mastery_queue', 200, 'ok'); // vieja: se borra
  await ins('mastery_queue', 100, 'ok'); // vieja: se borra
  await ins('mastery_queue', 100, 'failed'); // fallida de < 180 días: se conserva
  await ins('mastery_queue', 200, 'failed'); // fallida de > 180 días: se borra
  await ins('mastery_queue', 1, 'ok'); // reciente
  await ins('me_hint', 300, 'skipped'); // la única (la última) de su trabajo: se conserva
  const presentations = await count('public.exercise_presentations', []);
  const gradings = await count('public.exercise_attempt_gradings', []);
  const answers = await count('public.review_presentation_answers', []);
  const plans = await count('public.srs_session_plans', []);

  const r = await h.service(() => h.call('learning_run_job', ['retention', 500]));
  assert.equal(r.status, 'ok');
  assert.equal(r.processed, 3);
  assert.equal(r.remaining, 0);
  const left = await h.all(
    `select job, status, (now() - started_at > interval '50 days') old from public.learning_job_runs order by id`,
  );
  assert.deepEqual(
    left.map((x) => [x.job, x.status, x.old]),
    [
      ['mastery_queue', 'failed', true],
      ['mastery_queue', 'ok', false],
      ['me_hint', 'skipped', true],
      ['retention', 'ok', false],
    ],
  );
  // Idempotente.
  assert.equal(
    (await h.service(() => h.call('learning_run_job', ['retention', 500]))).processed,
    0,
  );
  // Nada de aprendizaje.
  assert.equal(await count('public.exercise_presentations', []), presentations);
  assert.equal(await count('public.exercise_attempt_gradings', []), gradings);
  assert.equal(await count('public.review_presentation_answers', []), answers);
  assert.equal(await count('public.srs_session_plans', []), plans);
  await assert.rejects(
    as(db, 'authenticated', null, () => h.call('learning_run_job', ['retention', 10])),
    /permission denied/,
  );
});

test('P2: el perfil público no presenta el SRS v1 como dominio; el conteo del motor sólo con enabled_for_display', async () => {
  const owner = await studied();
  const viewer = await h.learner();
  await db.query(
    `update public.profiles set username = 'p2_' || substr(replace(id::text, '-', ''), 1, 12) where id in ($1, $2)`,
    [owner, viewer],
  );
  await db.query(
    `insert into public.user_settings (user_id, profile_visibility) values ($1, 'public')
                  on conflict (user_id) do update set profile_visibility = 'public'`,
    [owner],
  );
  const profile = () =>
    as(db, 'authenticated', viewer, () => h.call('get_public_profile', [owner]));
  const p = await profile();
  assert.ok(p.learning);
  assert.equal(p.learning.concepts_mastered, null, 'motor sin habilitar: no hay dominio');
  assert.equal(
    typeof p.learning.words_mastered,
    'number',
    'compatibilidad con las builds publicadas',
  );
  // Con el motor habilitado para mostrarse: el conteo del motor (aunque sea 0), no el del v1.
  await db.query(
    `update public.mastery_model_versions set enabled_for_display = true where status = 'active'`,
  );
  try {
    const q = await profile();
    assert.equal(typeof q.learning.concepts_mastered, 'number');
    const expected = await h.one(
      `select count(*)::int n from public.user_concept_state u join public.mastery_model_versions m on m.version = u.model_version
      where u.user_id = $1 and m.enabled_for_display and u.evidence_count > 0 and u.status = 'mastered'`,
      [owner],
    );
    assert.equal(q.learning.concepts_mastered, expected.n);
  } finally {
    await db.query(`update public.mastery_model_versions set enabled_for_display = false`);
  }
  // P1: todo sigue apagado.
  assert.equal((await h.one('select enabled from public.srs_v2_settings')).enabled, false);
  assert.equal(
    await count(
      'public.mastery_model_versions where enabled_for_display or enabled_for_adaptive',
      [],
    ),
    0,
  );
});

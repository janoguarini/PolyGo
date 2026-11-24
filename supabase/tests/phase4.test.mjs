// Fase 4 (migración 20261110120000_learning_phase4.sql, docs/LEARNING_PHASE4.md) en PGlite: repasos del
// servidor con respuestas corregidas una por una y bloqueadas, retomar una sesión, modo declarado con el
// v2 apagado, cobertura de producción, historial de errores por unidad (R5 / AL17) y estados visibles
// del motor para la app. Reproduce lo que hace la Edge Function learning-session con las mismas
// funciones SQL y el mismo núcleo TS.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, as } from './harness.mjs';
import { helpers, answerAll, rightAnswer, wrongAnswer, TZ, j } from './learningHelpers.mjs';
import { buildReviewPlan, persistentUnits } from '../../shared/adaptivePlanner.ts';
import {
  gradeReviewAnswer,
  gradeReviewAttempts,
  LEARNING_GRADER,
  reviewPresentationOrders,
} from '../../shared/learningSession.ts';

let db;
let h;
let lesson;
const PRODUCTION_LESSON = 'a1-u08-rev1';

before(async () => {
  db = await createDb();
  h = helpers(db);
  lesson = await h.lessonWith('translation_choice', 'translate_write');
});

/** La Edge Function, start_review (fase 4). */
async function startReview(user, session, lang = 'en') {
  return h.service(async () => {
    const state = await h.call('learning_review_prepare', [user, session, TZ]);
    if (state.session === 'closed') return { state };
    if (state.session === 'open') return { state, items: await h.call('learning_review_content', [user, session]) };
    if (!state.enabled) return { state, status: 'srs_v2_disabled' };
    const cand = await h.call('learning_review_candidates', [user, lang, TZ, new Date().toISOString()]);
    const input = { ...cand, seed: session };
    const plan = buildReviewPlan(input);
    if (plan.items.length === 0) return { state, plan, cand, persistent: persistentUnits(input) };
    await h.call('learning_start_review', [user, session, lang, TZ, j(plan), j(reviewPresentationOrders(session, plan.items))]);
    return { state, plan, cand, items: await h.call('learning_review_content', [user, session]), persistent: persistentUnits(input) };
  });
}

/** La Edge Function, answer_review. */
async function answerOne(user, session, attempt) {
  return h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const one = gradeReviewAnswer(snaps, attempt, words);
    return h.call('learning_review_answer', [user, session, j(one.grading), one.responseMs, j(LEARNING_GRADER)]);
  });
}

/** La Edge Function, submit_review. */
async function submitReview(user, session, attempts) {
  return h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const graded = gradeReviewAttempts(snaps, attempts, words);
    return h.call('learning_submit_review_graded', [user, session, new Date(Date.now() - 60000).toISOString(), TZ,
      j(graded.attempts), j(graded.gradings), j(LEARNING_GRADER)]);
  });
}

const snapshotsOf = (user, session) => h.service(() => h.call('learning_session_presentations', [user, session]));

/** Alumno con una lección corregida y sus unidades vencidas (como si hubiera pasado un día). */
async function learnerWithDue(lessonId = lesson, make = rightAnswer) {
  const user = await h.learner(lessonId);
  const s = randomUUID();
  await h.startLesson(user, s, lessonId);
  const snaps = await h.snapshotsOf(user, s);
  await h.submitLesson(user, s, lessonId, answerAll(snaps, make), new Date(Date.now() - 5 * 60000));
  await db.query(`update public.user_srs_state set t_last = now() - interval '1 day', last_seen_at = now() - interval '1 day',
                    due_at = now() - interval '1 hour', due_effective_at = now() - interval '1 hour' where user_id = $1`, [user]);
  await db.query(`update public.learning_sessions set local_date = local_date - 1 where user_id = $1`, [user]);
  return user;
}

test('v2 apagado: start_review declara el modo (srs_v2_disabled) y no escribe nada', async () => {
  await h.setEnabled(false);
  const user = await h.learner();
  const session = randomUUID();
  const r = await startReview(user, session);
  assert.equal(r.status, 'srs_v2_disabled');
  assert.deepEqual(r.state, { session: 'new', enabled: false });
  assert.equal((await h.one('select count(*)::int n from public.srs_user_head where user_id = $1', [user])).n, 0);
  assert.equal((await h.one('select count(*)::int n from public.srs_session_plans where session_id = $1', [session])).n, 0);
  // La app no puede llamar a las funciones de servicio.
  await assert.rejects(as(db, 'authenticated', user, () => h.call('learning_review_prepare', [user, session, TZ])), /permission denied/);
  await h.setEnabled(true);
});

test('encendido: start migra en línea, el contenido no trae la respuesta y respeta lo presentado', async () => {
  await h.setEnabled(true);
  const user = await learnerWithDue();
  const session = randomUUID();
  const r = await startReview(user, session);
  assert.equal(r.state.session, 'new');
  assert.equal(r.state.enabled, true);
  assert.ok(r.items.length > 0);
  const snaps = await snapshotsOf(user, session);
  for (const it of r.items) {
    assert.equal(it.answered, null);
    assert.ok(!('answer' in it) && !('accepted_answers' in it), 'sin respuesta en lo que ve la app');
    assert.ok(!JSON.stringify(it.payload).includes('"answer"'));
    const snap = snaps.find((s) => s.presentation_id === it.presentation_id);
    assert.equal(Number(it.item_version_id), Number(snap.item_version_id));
    if (it.options_shown) assert.deepEqual(it.payload.options, it.options_shown, 'opciones en el orden registrado');
    assert.equal(it.word.id, it.concept_id);
  }
  // Retomar: el mismo session_id devuelve la misma sesión sin rearmar el plan.
  const again = await startReview(user, session);
  assert.equal(again.state.session, 'open');
  assert.deepEqual(again.items.map((i) => i.presentation_id), r.items.map((i) => i.presentation_id));
  assert.equal((await h.one('select count(*)::int n from public.srs_session_plans where session_id = $1', [session])).n, 1);
});

test('answer_review: la primera respuesta vale; el envío tiene que coincidir; retomar trae las corregidas', async () => {
  const user = await learnerWithDue();
  const session = randomUUID();
  await startReview(user, session);
  const snaps = await snapshotsOf(user, session);
  const first = snaps[0];
  const wrong = { presentation_id: first.presentation_id, answer: wrongAnswer(first), client_verdict: 'correct', response_ms: 2100 };
  const a1 = await answerOne(user, session, wrong);
  assert.equal(a1.duplicate, false);
  assert.equal(a1.verdict, 'incorrect', 'el veredicto es del servidor, no el del cliente');
  assert.equal(a1.answer, first.answer, 'la respuesta correcta llega recién después de responder');
  // Un segundo intento con la respuesta correcta no cambia nada: vale la primera.
  const a2 = await answerOne(user, session, { ...wrong, answer: rightAnswer(first) });
  assert.equal(a2.duplicate, true);
  assert.equal(a2.matches, false);
  assert.equal(a2.verdict, 'incorrect');
  assert.deepEqual(a2.response, wrong.answer);
  await assert.rejects(db.query('update public.review_presentation_answers set verdict = $1', ['correct']), /inmutable/);
  // Retomar: la presentación respondida trae su corrección.
  const resumed = await startReview(user, session);
  const done = resumed.items.find((i) => i.presentation_id === first.presentation_id);
  assert.equal(done.answered.verdict, 'incorrect');
  assert.deepEqual(done.answered.response, wrong.answer);
  // Enviar otra respuesta para esa presentación se rechaza sin guardar nada.
  const tampered = answerAll(snaps, rightAnswer);
  await assert.rejects(submitReview(user, session, tampered), /answer_mismatch/);
  assert.equal((await h.one('select count(*)::int n from public.learning_sessions where id = $1', [session])).n, 0);
  // El envío honesto (la registrada + las demás) se guarda con la corrección registrada.
  const honest = answerAll(snaps, (s) => (s.presentation_id === first.presentation_id ? wrong.answer : rightAnswer(s)));
  const res = await submitReview(user, session, honest);
  assert.equal(res.duplicate, false);
  const g = await h.one('select verdict, response from public.exercise_attempt_gradings where presentation_id = $1', [first.presentation_id]);
  assert.equal(g.verdict, 'incorrect');
  assert.deepEqual(g.response, wrong.answer);
  // Sesión cerrada: ni responder ni retomar.
  await assert.rejects(answerOne(user, session, wrong), /session_closed/);
  assert.equal((await startReview(user, session)).state.session, 'closed');
  // Otro usuario no puede tocar la sesión.
  const other = await h.learner();
  await assert.rejects(h.service(() => h.call('learning_review_prepare', [other, session, TZ])), /session_conflict/);
});

test('historial por unidad: errores plenos con t_srs, inmutable, en los candidatos y en R5', async () => {
  const user = await learnerWithDue(lesson, wrongAnswer);
  const rows = await h.all('select * from public.srs_unit_updates where user_id = $1', [user]);
  assert.ok(rows.length > 0);
  const applied = await h.one('select seq, t_srs from public.srs_applied_sessions where user_id = $1', [user]);
  assert.ok(rows.every((r) => Number(r.seq) === Number(applied.seq) && +r.t_srs === +applied.t_srs));
  const full = rows.filter((r) => r.full_error);
  assert.ok(full.length > 0, 'errores plenos registrados');
  const srs = await h.all('select concept_id, dimension, lapses from public.user_srs_state where user_id = $1', [user]);
  for (const r of rows) {
    const s = srs.find((x) => x.concept_id === r.concept_id && x.dimension === r.dimension);
    assert.equal(r.lapses_after, s.lapses, 'λ del historial = λ del estado');
  }
  await assert.rejects(db.query('update public.srs_unit_updates set full_error = false where user_id = $1', [user]), /inmutable/);
  const cand = await h.service(() => h.call('learning_review_candidates', [user, 'en', TZ, new Date().toISOString()]));
  const unit = cand.units.find((u) => u.concept_id === full[0].concept_id && u.dimension === full[0].dimension);
  assert.equal(unit.errors_30d, 1);
  assert.equal(unit.errors_window_complete, true);
  assert.deepEqual(unit.objective_ids, [], 'el catálogo no tiene objetivos: no se inventan');
  assert.equal(typeof unit.intro_lesson_id, 'string');
  // Fuera de la ventana de 30 días ya no cuenta.
  const later = await h.service(() => h.call('learning_review_candidates', [user, 'en', TZ, new Date(Date.now() + 31 * 86400000).toISOString()]));
  assert.ok(later.units.every((u) => u.errors_30d === 0));
});

test('cobertura: producción entra en los repasos con su ítem de escalón P y se aplica en el SRS v2', async () => {
  const user = await learnerWithDue(PRODUCTION_LESSON);
  const prod = await h.all(`select s.concept_id from public.user_srs_state s where s.user_id = $1 and s.dimension = 'production'
                             and exists (select 1 from public.review_item_candidates('en') r where r.concept_id = s.concept_id and r.dimension = 'production')`, [user]);
  assert.ok(prod.length > 0, 'hay unidades de producción repasables');
  const target = prod[0].concept_id;
  // Sólo esa unidad vencida.
  await db.query(`update public.user_srs_state set due_at = now() + interval '20 days', due_effective_at = now() + interval '20 days', n = 5
                  where user_id = $1 and not (concept_id = $2 and dimension = 'production')`, [user, target]);
  await db.query(`update public.user_srs_state set rung = 'P' where user_id = $1 and concept_id = $2 and dimension = 'production'`, [user, target]);
  const session = randomUUID();
  const r = await startReview(user, session);
  const entry = r.plan.items.find((i) => i.concept_id === target);
  assert.ok(entry, JSON.stringify(r.plan));
  assert.equal(entry.dimension, 'production');
  assert.equal(entry.rung, 'P');
  const snaps = await snapshotsOf(user, session);
  assert.equal(snaps.length, r.plan.items.length, 'una presentación por entrada del plan');
  const res = await submitReview(user, session, answerAll(snaps, rightAnswer));
  assert.equal(res.duplicate, false);
  const up = await h.all('select dimension from public.srs_unit_updates where session_id = $1 and concept_id = $2 order by 1', [session, target]);
  assert.ok(up.some((x) => x.dimension === 'production'));
});

test('get_learning_mastery: «Para repasar» del SRS vigente; dominio sólo con el motor habilitado para mostrarse', async () => {
  const user = await learnerWithDue();
  const call = () => as(db, 'authenticated', user, () => h.call('get_learning_mastery', ['en', TZ]));
  await h.setEnabled(false);
  let m = await call();
  assert.equal(m.available, false);
  assert.equal(m.review.source, 'srs_v1');
  await h.setEnabled(true);
  m = await call();
  assert.equal(m.review.source, 'srs_v2');
  assert.ok(m.review.due_now > 0);
  assert.equal(m.available, false, 'enabled_for_display apagado: no se muestra dominio');
  await db.query(`update public.mastery_model_versions set enabled_for_display = true where version = 'me-1.0.0'`);
  try {
    m = await call();
    assert.equal(m.available, true);
    assert.equal(m.computed_at, null, 'sin procesar la cola no hay estimaciones');
    await h.service(() => h.call('mastery_process_queue', [1000, new Date().toISOString()]));
    m = await call();
    const st = await h.all(`select status, weak, evidence_count from public.user_concept_state where user_id = $1`, [user]);
    const sum = Object.values(m.dimensions).reduce((a, c) => a + c.no_evidence + c.insufficient + c.weak + c.in_progress + c.mastered, 0);
    assert.equal(sum, st.length, 'cada unidad en exactamente un estado');
    const mastered = Object.values(m.dimensions).reduce((a, c) => a + c.mastered, 0);
    assert.equal(mastered, st.filter((s) => s.status === 'mastered').length, '«Dominada» sólo con status mastered');
    const insufficient = Object.values(m.dimensions).reduce((a, c) => a + c.insufficient, 0);
    assert.equal(insufficient, st.filter((s) => s.status === 'insufficient' && s.evidence_count > 0).length);
    assert.ok(m.units.length > 0);
    for (const u of m.units) {
      assert.equal(u.total, u.not_seen + u.no_evidence + u.insufficient + u.weak + u.in_progress + u.mastered);
    }
    // Sólo los datos propios; anon no puede llamarla.
    const other = await h.learner();
    const mine = await as(db, 'authenticated', other, () => h.call('get_learning_mastery', ['en', TZ]));
    assert.deepEqual(mine.dimensions, {});
    await assert.rejects(as(db, 'anon', null, () => h.call('get_learning_mastery', ['en', TZ])), /permission denied/);
  } finally {
    await db.query(`update public.mastery_model_versions set enabled_for_display = false where version = 'me-1.0.0'`);
  }
});

test('srs_applied_sessions registra la versión real del armador de la sesión', async () => {
  const user = await learnerWithDue();
  const session = randomUUID();
  const r = await startReview(user, session);
  await submitReview(user, session, answerAll(await snapshotsOf(user, session)));
  const a = await h.one('select planner_version from public.srs_applied_sessions where session_id = $1', [session]);
  assert.equal(a.planner_version, r.plan.planner_version);
  assert.equal(a.planner_version, 'planner-2.2.0'); // fase 5
});

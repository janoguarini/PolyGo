// Ayudas compartidas por las pruebas de la fase 3 (srs2, mastery, review): ejecutan exactamente lo que
// hace la Edge Function learning-session con las mismas funciones SQL, como service_role.
import assert from 'node:assert/strict';

import { createUser, as } from './harness.mjs';
import { gradeLessonAttempts, LEARNING_GRADER, presentationOrders } from '../../shared/learningSession.ts';

export const TZ = 'America/Argentina/Buenos_Aires';
export const j = (v) => JSON.stringify(v);

export function helpers(db) {
  const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
  const all = async (sql, params = []) => (await db.query(sql, params)).rows;
  const service = (fn) => as(db, 'service_role', null, fn);
  const call = async (name, args) => {
    const ph = args.map((_, i) => `$${i + 1}`).join(', ');
    return (await one(`select public.${name}(${ph}) r`, args)).r;
  };
  const setEnabled = (on) => db.query('update public.srs_v2_settings set enabled = $1', [on]);
  let n = 0;
  const learner = async (lessonId) => {
    const id = await createUser(db, `p3-${Date.now()}-${++n}@test.dev`);
    if (lessonId) {
      await db.query(
        `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
           last_accuracy, first_completed_at, last_completed_at)
         values ($1, $2, 1, 0.5, 0.5, now(), now())`,
        [id, lessonId],
      );
    }
    return id;
  };
  /** La Edge Function, start de lección. */
  const startLesson = (user, sessionId, lessonId) =>
    service(async () => {
      const plan = await call('learning_lesson_plan', [user, lessonId]);
      const orders = presentationOrders(sessionId, plan);
      return call('learning_start_lesson', [user, sessionId, lessonId, j(orders)]);
    });
  const snapshotsOf = (user, sessionId) => service(() => call('learning_session_presentations', [user, sessionId]));
  /** La Edge Function, submit de lección (ruta corregida). */
  const submitLesson = (user, sessionId, lessonId, attempts, startedAt = new Date(Date.now() - 60000)) =>
    service(async () => {
      const snapshots = await call('learning_session_presentations', [user, sessionId]);
      const graded = gradeLessonAttempts(snapshots, attempts);
      return call('learning_submit_graded', [user, sessionId, lessonId, startedAt.toISOString(), TZ,
        j(graded.attempts), j(graded.gradings), j(LEARNING_GRADER)]);
    });
  /**
   * La RPC vieja (veredicto del cliente). Lecciones: como la app (authenticated). Repasos: desde la
   * retirada de la ruta antigua de repasos (20261112120000) la app ya no puede; el cuerpo v1 de repasos
   * sigue vigente para el servidor, así que las pruebas que lo necesitan lo llaman como service_role
   * (el rechazo a authenticated lo prueba legacyReviewRetirement.test.mjs).
   */
  const submitOld = (user, sessionId, kind, lessonId, attempts, startedAt = new Date(Date.now() - 60000)) =>
    as(db, kind === 'review' ? 'service_role' : 'authenticated', user, () =>
      call('submit_learning_session', [sessionId, kind, lessonId, startedAt.toISOString(), j(attempts), TZ]));
  const lessonWith = async (...types) => {
    const r = await one(
      `select e.lesson_id from public.exercises e
       join public.lessons l on l.id = e.lesson_id join public.curriculum_units u on u.id = l.unit_id
       where u.language_code = 'en' and l.is_published and e.is_published
       group by e.lesson_id having array_agg(distinct e.type) @> $1::text[]
       order by count(*), e.lesson_id limit 1`,
      [types],
    );
    assert.ok(r);
    return r.lesson_id;
  };
  return { one, all, service, call, setEnabled, learner, startLesson, snapshotsOf, submitLesson, submitOld, lessonWith };
}

/** Respuesta correcta de una presentación, según su versión. */
export function rightAnswer(s) {
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

function tokensOf(s) {
  const pool = [...s.payload.tokens];
  const out = [];
  for (const word of s.answer.split(/\s+/)) {
    const k = pool.findIndex((t) => word === t || word.replace(/[.,!?。，！？]+$/u, '') === t);
    out.push(pool.splice(k, 1)[0]);
  }
  return out;
}

export function wrongAnswer(s) {
  const p = s.payload;
  switch (s.grading_mode_id) {
    case 'exact_option.v1':
      return { kind: 'option', value: s.option_texts.find((t) => t !== s.answer) };
    case 'pair_set.v1': {
      const rights = p.pairs.map((x) => x.right);
      return { kind: 'pairs', value: p.pairs.map((x, i) => ({ left: x.left, right: rights[(i + 1) % rights.length] })) };
    }
    default:
      if (p.type === 'order_words') return { kind: 'tokens', value: [...tokensOf(s)].reverse() };
      return { kind: 'text', value: 'zzzz' };
  }
}

export const answerAll = (snaps, make = rightAnswer, extra = {}) =>
  snaps.map((s) => ({
    presentation_id: s.presentation_id,
    answer: make(s),
    client_verdict: 'correct',
    response_ms: 1800,
    ...extra,
  }));

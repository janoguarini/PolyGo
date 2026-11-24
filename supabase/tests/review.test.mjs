// Repasos generados en el servidor (migración 20261109140000_adaptive_review.sql) de punta a punta en
// PGlite: lección corregida → estado SRS v2 → candidatos → armador (shared/adaptivePlanner.ts) →
// presentaciones exactas → envío corregido → SRS v2, SRS v1 y cola del motor. Reproduce lo que hace
// la Edge Function learning-session (start_review / submit_review) con las mismas funciones SQL.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb } from './harness.mjs';
import { helpers, answerAll, rightAnswer, wrongAnswer, TZ, j } from './learningHelpers.mjs';
import { buildReviewPlan, PLANNER_VERSION } from '../../shared/adaptivePlanner.ts';
import {
  gradeRecordedAttempts,
  gradeReviewAttempts,
  LEARNING_GRADER,
  LearningSessionError,
  reviewPresentationOrders,
} from '../../shared/learningSession.ts';
import { shuffleOrderV1 } from '../../shared/shuffle.ts';

let db;
let h;
let lesson;
before(async () => {
  db = await createDb();
  h = helpers(db);
  await h.setEnabled(true);
  lesson = await h.lessonWith('translation_choice', 'translate_write');
});

/** La Edge Function, start_review. */
async function startReview(user, session, lang = 'en') {
  return h.service(async () => {
    const cand = await h.call('learning_review_candidates', [
      user,
      lang,
      TZ,
      new Date().toISOString(),
    ]);
    const plan = buildReviewPlan({ ...cand, seed: session });
    if (plan.items.length === 0) return { plan, started: null, cand };
    const started = await h.call('learning_start_review', [
      user,
      session,
      lang,
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]);
    return { plan, started, cand };
  });
}

/** La Edge Function, submit_review (fase 5: record_learning_session). */
async function submitReview(user, session, make = rightAnswer) {
  return h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const gradings = gradeRecordedAttempts(snaps, answerAll(snaps, make), words);
    return h.call('record_learning_session', [
      user,
      session,
      new Date(Date.now() - 60000).toISOString(),
      TZ,
      j(gradings),
      j(LEARNING_GRADER),
      j({ contract: 2 }),
    ]);
  });
}

/** submit_review de la fase 4 (learning_submit_review_graded, sin uso desde la fase 5; sigue protegida). */
async function submitReviewPhase4(user, session, make = rightAnswer, tamper = (x) => x) {
  return h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const graded = tamper(gradeReviewAttempts(snaps, answerAll(snaps, make), words));
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

/** Alumno con una lección corregida hecha y sus unidades vencidas (como si hubiera pasado un día). */
async function learnerWithDue() {
  const user = await h.learner(lesson);
  const s = randomUUID();
  await h.startLesson(user, s, lesson);
  const snaps = await h.snapshotsOf(user, s);
  await h.submitLesson(user, s, lesson, answerAll(snaps), new Date(Date.now() - 5 * 60000));
  await db.query(
    `update public.user_srs_state set t_last = now() - interval '1 day', last_seen_at = now() - interval '1 day',
                    due_at = now() - interval '1 hour', due_effective_at = now() - interval '1 hour' where user_id = $1`,
    [user],
  );
  // El día de la lección no gasta el presupuesto de hoy en esta prueba.
  await db.query(
    `update public.learning_sessions set local_date = local_date - 1 where user_id = $1`,
    [user],
  );
  return user;
}

test('sin nada elegible: el plan dice «al día» y no se registra nada', async () => {
  const user = await h.learner();
  const session = randomUUID();
  const { plan, started } = await startReview(user, session);
  assert.equal(plan.status, 'up_to_date');
  assert.equal(started, null);
  await assert.rejects(
    h.service(() =>
      h.call('learning_start_review', [user, session, 'en', TZ, j({ items: [] }), '{}']),
    ),
    /nothing_to_review/,
  );
  assert.equal(
    (
      await h.one(
        'select count(*)::int n from public.exercise_presentations where session_id = $1',
        [session],
      )
    ).n,
    0,
  );
});

test('start: plan del servidor con vencidos del SRS v2 e ítems del catálogo con versión y conjunto vigentes', async () => {
  const user = await learnerWithDue();
  const session = randomUUID();
  const { plan, started, cand } = await startReview(user, session);
  assert.equal(plan.status, 'ok');
  assert.ok(plan.items.length > 0 && plan.items.length <= plan.capacity && plan.capacity <= 15);
  assert.ok(plan.items.every((i) => i.reason === 'due'));
  // Fase 4: cualquier dimensión de un concepto léxico (vocabulario y producción en el catálogo).
  const units = await h.all(
    `select concept_id, dimension, rung from public.user_srs_state s join public.words w on w.id = s.concept_id
                             where user_id = $1`,
    [user],
  );
  assert.equal(
    new Set(plan.items.map((i) => i.concept_id)).size,
    plan.items.length,
    'un concepto por sesión',
  );
  for (const it of plan.items) {
    const u = units.find((x) => x.concept_id === it.concept_id && x.dimension === it.dimension);
    assert.ok(u, it.concept_id);
    assert.equal(it.rung, u.rung, 'escalón = k de la unidad (8.4)');
  }
  // Lo registrado es exactamente lo planificado, con el orden polygo.shuffle.v1 y sin ubicación.
  assert.equal(started.duplicate, false);
  const pres = await h.all(
    `select p.*, i.current_version_id, (select count(*) from public.exercise_option_sets s where s.item_version_id = p.item_version_id) sets,
                              (select jsonb_array_length(options) from public.exercise_option_sets s where s.id = p.option_set_id) n
                            from public.exercise_presentations p join public.exercise_items i on i.id = p.item_id
                            where p.session_id = $1 order by p.position`,
    [session],
  );
  assert.deepEqual(
    pres.map((p) => p.item_id),
    plan.items.map((i) => i.item_id),
  );
  for (const p of pres) {
    assert.equal(p.exercise_id, null);
    assert.equal(Number(p.item_version_id), Number(p.current_version_id));
    if (p.option_set_id !== null) {
      assert.equal(Number(p.sets), 1, 'un único conjunto del catálogo: no se eligen distractores');
      assert.deepEqual(p.option_order, shuffleOrderV1(p.n, `${session}:${p.item_id}`));
      assert.equal(p.shuffle_seed, `${session}:${p.item_id}`);
    }
  }
  const row = await h.one('select * from public.srs_session_plans where session_id = $1', [
    session,
  ]);
  assert.equal(row.source, 'adaptive_review');
  assert.equal(row.planner_version, PLANNER_VERSION);
  assert.equal(row.items.length, plan.items.length);
  // Idempotente: un segundo start devuelve lo mismo sin recalcular.
  const again = await startReview(user, session);
  assert.equal(again.started.duplicate, true);
  assert.deepEqual(
    again.started.presentations.map((p) => p.presentation_id),
    started.presentations.map((p) => p.presentation_id),
  );
  assert.ok(cand.budget.B > 0);
});

test('submit: corrige en el servidor, aplica el SRS v2 (adaptive_review), el v1 y encola al motor; reenvío idempotente', async () => {
  const user = await learnerWithDue();
  const session = randomUUID();
  const { plan } = await startReview(user, session);
  const before = await h.all(
    'select concept_id, n, exposures from public.user_srs_state where user_id = $1',
    [user],
  );
  const v1before = await h.all(
    'select word_id, seen_count from public.user_word_progress where user_id = $1',
    [user],
  );
  const r = await submitReview(user, session, (s) =>
    s.presentation_id % 2 ? wrongAnswer(s) : rightAnswer(s),
  );
  assert.equal(r.duplicate, false);
  assert.equal(r.verdicts.length, plan.items.length);
  const applied = await h.one('select * from public.srs_applied_sessions where session_id = $1', [
    session,
  ]);
  assert.equal(applied.source, 'adaptive_review');
  assert.equal(applied.origin, 'online');
  assert.equal(applied.items_served, plan.items.length);
  // Fase 5: un ítem de varios conceptos atiende todas sus unidades target.
  const targets = await h.all(
    `select distinct ic.concept_id, ic.dimension, c.word_id from public.item_concepts ic
     join public.concepts c on c.id = ic.concept_id where ic.item_id = any($1::text[]) and ic.role = 'target'`,
    [plan.items.map((i) => i.item_id)],
  );
  assert.equal(applied.units_attended, targets.length);
  const result = await h.service(() => h.call('srs_v2_session_result', [user, session]));
  assert.equal(result.units.length, targets.length);
  for (const it of plan.items) {
    const u = await h.one(
      'select * from public.user_srs_state where user_id = $1 and concept_id = $2 and dimension = $3',
      [user, it.concept_id, it.dimension],
    );
    const b = before.find((x) => x.concept_id === it.concept_id);
    assert.equal(u.n, b.n + 1);
    assert.equal(u.last_session_id, session);
    assert.ok(u.recent_item_ids.includes(it.item_id));
  }
  // SRS v1: cada palabra de cada concepto léxico target, una vez por sesión.
  for (const word of new Set(targets.map((x) => x.word_id))) {
    const w = await h.one(
      'select seen_count from public.user_word_progress where user_id = $1 and word_id = $2',
      [user, word],
    );
    assert.equal(
      w.seen_count,
      (v1before.find((x) => x.word_id === word)?.seen_count ?? 0) + 1,
      word,
    );
  }
  const g = await h.all('select * from public.exercise_attempt_gradings where session_id = $1', [
    session,
  ]);
  assert.equal(g.length, plan.items.length);
  assert.ok(g.every((x) => x.attempt_no === 1 && x.status === 'valid'));
  const q = await h.one(
    `select count(*)::int n from public.knowledge_recompute_queue where user_id = $1 and processed_at is null`,
    [user],
  );
  assert.ok(q.n >= plan.items.length);
  // Reenvío: mismo resultado, nada nuevo.
  const again = await submitReview(user, session);
  assert.equal(again.duplicate, true);
  assert.equal(
    (await h.one('select last_seq from public.srs_user_head where user_id = $1', [user])).last_seq,
    applied.seq,
  );
  // Al día siguiente del repaso, la misma unidad no vuelve el mismo día (I3b).
  const next = await startReview(user, randomUUID());
  assert.ok(next.plan.items.every((i) => !plan.items.some((p) => p.concept_id === i.concept_id)));
});

test('protección: palabra, presentación o plan manipulados se rechazan sin guardar nada', async () => {
  const user = await learnerWithDue();
  const session = randomUUID();
  const { plan } = await startReview(user, session);
  await assert.rejects(
    submitReviewPhase4(user, session, rightAnswer, (g) => ({
      ...g,
      attempts: g.attempts.map((a, i) => (i === 0 ? { ...a, word_id: 'en-zzz' } : a)),
    })),
    /invalid_gradings/,
  );
  await assert.rejects(
    submitReviewPhase4(user, session, rightAnswer, (g) => ({
      ...g,
      attempts: g.attempts.map((a, i) => (i === 0 ? { ...a, correct: !a.correct } : a)),
    })),
    /invalid_gradings/,
  );
  assert.equal(
    (await h.one('select count(*)::int n from public.learning_sessions where id = $1', [session]))
      .n,
    0,
  );
  // La app no puede elegir la palabra: la fija el plan del servidor.
  const snaps = await h.service(() => h.call('learning_session_presentations', [user, session]));
  assert.throws(() => gradeReviewAttempts(snaps, answerAll(snaps), {}), LearningSessionError);
  assert.throws(
    () =>
      gradeReviewAttempts(
        snaps,
        [...answerAll(snaps), answerAll(snaps)[0]],
        Object.fromEntries(plan.items.map((i) => [i.item_id, i.concept_id])),
      ),
    LearningSessionError,
  );
  // Un plan con un ítem que no es candidato (otro concepto) o un escalón inventado no se registra.
  const other = randomUUID();
  const bad = {
    ...plan,
    items: plan.items.map((i, k) => (k === 0 ? { ...i, rung: i.rung === 'L' ? 'R' : 'L' } : i)),
  };
  await assert.rejects(
    h.service(() =>
      h.call('learning_start_review', [
        user,
        other,
        'en',
        TZ,
        j(bad),
        j(reviewPresentationOrders(other, bad.items)),
      ]),
    ),
    /invalid_plan/,
  );
  const foreign = await h.one(
    `select item_id from public.review_item_candidates('en') r where r.concept_id <> all($1::text[]) limit 1`,
    [plan.items.map((i) => i.concept_id)],
  );
  const bad2 = { ...plan, items: [{ ...plan.items[0], item_id: foreign.item_id }] };
  await assert.rejects(
    h.service(() => h.call('learning_start_review', [user, other, 'en', TZ, j(bad2), j({})])),
    /invalid_plan|invalid_orders/,
  );
  assert.equal(
    (
      await h.one('select count(*)::int n from public.srs_session_plans where session_id = $1', [
        other,
      ])
    ).n,
    0,
  );
});

test('compatibilidad con la fase 2: una lección por learning-session sigue igual y su envío lleva el SRS v2', async () => {
  const user = await h.learner(lesson);
  const s = randomUUID();
  const started = await h.startLesson(user, s, lesson);
  assert.equal(started.duplicate, false);
  const snaps = await h.snapshotsOf(user, s);
  const r = await h.submitLesson(user, s, lesson, answerAll(snaps));
  assert.equal(r.duplicate, false);
  assert.equal(r.verdicts.length, snaps.length);
  const srs = await h.service(() => h.call('srs_v2_session_result', [user, s]));
  assert.equal(Number(srs.srs_seq), 1);
  assert.equal(srs.origin, 'online');
});

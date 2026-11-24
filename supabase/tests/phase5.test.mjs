// Fase 5 (migración 20261111120000_learning_phase5.sql, docs/LEARNING_PHASE5.md) en PGlite:
// record_learning_session con ítems de varios conceptos y dimensiones, idempotencia, respuestas
// duplicadas o modificadas, sesiones retomadas, idiomas separados, cobertura por idioma, compatibilidad
// con la ruta vieja y con la de la fase 4, SRS v1, SRS v2 (encendido sólo dentro de la prueba) y la
// verificación de la migración 15.3. Reproduce la Edge Function learning-session con las mismas
// funciones SQL y el mismo núcleo TS.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, as } from './harness.mjs';
import { helpers, answerAll, rightAnswer, wrongAnswer, TZ, j } from './learningHelpers.mjs';
import { buildBasicPlan, buildFocusPlan, pickBasicReview } from '../../shared/focusReview.ts';
import { buildReviewPlan } from '../../shared/adaptivePlanner.ts';
import {
  gradeRecordedAttempts,
  gradeReviewAnswer,
  gradeReviewAttempts,
  LEARNING_CONTRACT,
  LEARNING_GRADER,
  LearningSessionError,
  reviewPresentationOrders,
} from '../../shared/learningSession.ts';

let db;
let h;
let lesson;

before(async () => {
  db = await createDb();
  h = helpers(db);
  await h.setEnabled(false);
  // Una lección con ítems de varios conceptos (huecos y ordenar) además de traducción y escritura.
  lesson = await h.lessonWith('fill_blank', 'order_words', 'translate_write');
});

const CLIENT = { contract: LEARNING_CONTRACT, app_version: '0.2.0', platform: 'android' };
const count = async (sql, params) => (await h.one(`select count(*)::int n from ${sql}`, params)).n;
const grantPlus = (user) =>
  db.query(
    `insert into public.user_entitlements (user_id, entitlement, source) values ($1, 'plus', 'manual')`,
    [user],
  );

/** Alumno con la lección corregida hecha (progreso v1 y, si el v2 está encendido, estado v2). */
async function studied(lessonId = lesson, make = rightAnswer, { due = true } = {}) {
  const user = await h.learner(lessonId);
  const s = randomUUID();
  await h.startLesson(user, s, lessonId);
  const snaps = await h.snapshotsOf(user, s);
  await h.submitLesson(user, s, lessonId, answerAll(snaps, make), new Date(Date.now() - 5 * 60000));
  if (!due) return user;
  await db.query(
    `update public.user_word_progress set next_review_at = now() - interval '1 hour' where user_id = $1`,
    [user],
  );
  await db.query(
    `update public.learning_sessions set local_date = local_date - 1 where user_id = $1`,
    [user],
  );
  return user;
}

/** Candidatos presentables para el usuario (lo mismo que filtran las funciones de inicio). */
const candidates = (user, mode, lang = 'en', extra = '') =>
  h.all(
    `select r.*, (select count(distinct x.concept_id)::int from public.item_concepts x where x.item_id = r.item_id and x.role = 'target') nc
     from public.review_item_candidates($2) r where public.review_item_known($1, r.item_id, $3) ${extra}
     order by r.item_id, r.concept_id, r.dimension`,
    [user, lang, mode],
  );

/** Plan armado a mano (válido) para learning_start_review / learning_start_focus_review. */
const planOf = (picks, extra = {}) => ({
  planner_version: 'test',
  capacity: picks.length,
  ...extra,
  items: picks.map((p, i) => ({
    position: i + 1,
    item_id: p.item_id,
    concept_id: p.concept_id,
    dimension: p.dimension,
    rung: p.rung,
    reason: extra.focus ? (extra.focus.kind === 'topic' ? 'topic' : 'due') : 'due',
    option_count: p.option_count ?? null,
    prio: 1,
    due: new Date().toISOString(),
  })),
});

const startAdaptive = (user, session, plan, lang = 'en') =>
  h.service(() =>
    h.call('learning_start_review', [
      user,
      session,
      lang,
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]),
  );
const startFocus = (user, session, plan, lang = 'en') =>
  h.service(() =>
    h.call('learning_start_focus_review', [
      user,
      session,
      lang,
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]),
  );
const snapshotsOf = (user, session) =>
  h.service(() => h.call('learning_session_presentations', [user, session]));

/** La Edge Function, answer_review (primer intento). */
const answer = (user, session, attempt) =>
  h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const one = gradeReviewAnswer(snaps, attempt, words, 1);
    return h.call('learning_review_answer', [
      user,
      session,
      j(one.grading),
      one.responseMs,
      j(LEARNING_GRADER),
    ]);
  });

/** La Edge Function, submit_review de la fase 5 (record_learning_session). */
const gradingsOf = (user, session, attempts) =>
  h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    return gradeRecordedAttempts(snaps, attempts, words);
  });
const record = (
  user,
  session,
  gradings,
  startedAt = new Date(Date.now() - 60000),
  client = CLIENT,
) =>
  h.service(() =>
    h.call('record_learning_session', [
      user,
      session,
      startedAt.toISOString(),
      TZ,
      j(gradings),
      j(LEARNING_GRADER),
      j(client),
    ]),
  );
const submit = async (user, session, make = rightAnswer) => {
  const snaps = await snapshotsOf(user, session);
  return record(user, session, await gradingsOf(user, session, answerAll(snaps, make)));
};

const v1 = (user) =>
  h.all(
    `select word_id, stage, seen_count, correct_count, incorrect_count, next_review_at, last_result
         from public.user_word_progress where user_id = $1 order by word_id`,
    [user],
  );
const targetsOf = (items) =>
  h.all(
    `select distinct ic.concept_id, ic.dimension, c.word_id from public.item_concepts ic
         join public.concepts c on c.id = ic.concept_id where ic.item_id = any($1::text[]) and ic.role = 'target'
         order by 1, 2`,
    [items],
  );
const switchesOff = async () => {
  assert.equal(
    (await h.one('select enabled from public.srs_v2_settings')).enabled,
    false,
    'SRS v2 apagado',
  );
  assert.equal(
    await count('public.mastery_model_versions where enabled_for_display or enabled_for_adaptive'),
    0,
    'motor apagado',
  );
};

test('A: un repaso Plus con un ítem de varios conceptos acredita todas sus palabras en el v1, una vez cada una', async () => {
  await h.setEnabled(false);
  const user = await studied();
  await grantPlus(user);
  const multi = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`)).filter(
    (c) => c.nc > 1,
  );
  assert.ok(multi.length > 0, 'la lección deja ítems de varios conceptos presentables');
  const single = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`)).filter(
    (c) => c.nc === 1,
  );
  const pick = multi[0];
  const covered = (await targetsOf([pick.item_id])).map((t) => t.concept_id);
  const other = single.find((c) => !covered.includes(c.concept_id));
  const session = randomUUID();
  const plan = planOf([pick, other], { focus: { kind: 'smart' } });
  await startFocus(user, session, plan);
  const content = await h.service(() => h.call('learning_review_content', [user, session]));
  const multiItem = content.find((c) => c.item_id === pick.item_id);
  assert.equal(multiItem.words.length, covered.length, 'la app recibe todas las palabras del ítem');
  assert.equal(multiItem.words[0].id, pick.concept_id, 'la del plan primero');
  assert.ok(!JSON.stringify(multiItem.payload).includes('"answer"'));

  const before = await v1(user);
  const dailyBefore = await h.one(
    'select coalesce(sum(sessions_completed), 0)::int s from public.user_daily_activity where user_id = $1',
    [user],
  );
  const energyBefore = await h.one('select * from public.user_energy where user_id = $1', [user]);
  const snaps = await snapshotsOf(user, session);
  // El ítem de varios conceptos, mal; el otro, bien.
  const gradings = await gradingsOf(
    user,
    session,
    answerAll(snaps, (s) => (s.item_id === pick.item_id ? wrongAnswer(s) : rightAnswer(s))),
  );
  const r = await record(user, session, gradings);
  assert.equal(r.duplicate, false);
  assert.equal(r.route, 'record_learning_session');
  assert.equal(r.first_try_total, 2);
  assert.equal(r.first_try_correct, 1);
  assert.equal(r.verdicts.length, 2);

  const after = await v1(user);
  for (const w of covered) {
    const a = after.find((x) => x.word_id === w);
    const b = before.find((x) => x.word_id === w);
    assert.equal(a.seen_count, b.seen_count + 1, `${w}: una vez por sesión`);
    assert.equal(
      a.incorrect_count,
      b.incorrect_count + 1,
      `${w}: el error cuenta para cada palabra (v1)`,
    );
  }
  const ok = after.find((x) => x.word_id === other.concept_id);
  assert.equal(
    ok.correct_count,
    before.find((x) => x.word_id === other.concept_id).correct_count + 1,
  );
  // Ninguna otra palabra cambió.
  const touched = new Set([...covered, other.concept_id]);
  for (const b of before.filter((x) => !touched.has(x.word_id))) {
    assert.deepEqual(
      after.find((x) => x.word_id === b.word_id),
      b,
    );
  }
  // Intentos: sin ejercicio; palabra sólo en el de un único concepto. Correcciones y vínculos completos.
  const attempts = await h.all(
    `select a.word_id, a.exercise_id, a.skill, a.is_first_try, g.item_id, g.attempt_no, g.status
                                from public.exercise_attempts a join public.exercise_attempt_gradings g on g.attempt_id = a.id
                                where a.session_id = $1 order by a.id`,
    [session],
  );
  assert.equal(attempts.length, 2);
  assert.equal(attempts.find((a) => a.item_id === pick.item_id).word_id, null);
  assert.equal(attempts.find((a) => a.item_id === other.item_id).word_id, other.concept_id);
  assert.ok(
    attempts.every(
      (a) =>
        a.exercise_id === null && a.skill === 'vocabulary' && a.is_first_try && a.attempt_no === 1,
    ),
  );
  assert.equal(
    await count(
      'public.exercise_attempt_presentations l join public.exercise_attempts a on a.id = l.attempt_id where a.session_id = $1',
      [session],
    ),
    2,
  );
  // Repaso: actividad diaria (racha) +1; sin energía; motor encolado para cada concepto.
  const dailyAfter = await h.one(
    'select coalesce(sum(sessions_completed), 0)::int s from public.user_daily_activity where user_id = $1',
    [user],
  );
  assert.equal(dailyAfter.s, dailyBefore.s + 1);
  assert.deepEqual(
    await h.one('select * from public.user_energy where user_id = $1', [user]),
    energyBefore,
  );
  for (const w of covered) {
    assert.equal(
      await count(
        `public.knowledge_recompute_queue where user_id = $1 and concept_id = $2 and dimension = 'vocabulary'`,
        [user, w],
      ),
      1,
      w,
    );
  }
  // Cliente registrado (medición de rutas).
  const cl = await h.one(
    'select route, contract, app_version, platform from public.learning_session_clients where session_id = $1',
    [session],
  );
  assert.deepEqual(cl, {
    route: 'record_learning_session',
    contract: 2,
    app_version: '0.2.0',
    platform: 'android',
  });
  // v2 apagado: nada del v2.
  assert.equal(await count('public.srs_applied_sessions where session_id = $1', [session]), 0);
  await switchesOff();
});

test('A: idempotencia, reintentos de red y respuestas duplicadas o modificadas', async () => {
  await h.setEnabled(false);
  const user = await studied();
  await grantPlus(user);
  const cands = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`))
    .filter((c) => c.nc === 1)
    .slice(0, 3);
  const session = randomUUID();
  await startFocus(user, session, planOf(cands, { focus: { kind: 'smart' } }));
  const snaps = await snapshotsOf(user, session);
  const attempts = answerAll(snaps);

  // Durante el repaso se registró una respuesta mala: el envío no puede cambiarla.
  const first = await answer(user, session, { ...attempts[0], answer: wrongAnswer(snaps[0]) });
  assert.equal(first.verdict, 'incorrect');
  await assert.rejects(
    record(user, session, await gradingsOf(user, session, attempts)),
    /answer_mismatch/,
  );
  // Correcciones manipuladas (sin pasar por el núcleo TS) se rechazan sin guardar nada.
  const good = await gradingsOf(user, session, [
    { ...attempts[0], answer: wrongAnswer(snaps[0]) },
    ...attempts.slice(1),
  ]);
  await assert.rejects(
    record(user, session, [good[0], good[1], good[1]]),
    /invalid_gradings/,
    'presentación repetida',
  );
  await assert.rejects(
    record(
      user,
      session,
      good.map((g, i) => (i === 1 ? { ...g, attempt_no: 2 } : g)),
    ),
    /invalid_gradings/,
  );
  await assert.rejects(
    record(
      user,
      session,
      good.map((g, i) => (i === 1 ? { ...g, status: 'invalid_response' } : g)),
    ),
    /invalid_gradings/,
    'estado sin veredicto',
  );
  await assert.rejects(
    record(
      user,
      session,
      good.map((g, i) => (i === 1 ? { ...g, verdict: 'perfect' } : g)),
    ),
    /invalid_gradings/,
  );
  await assert.rejects(
    record(
      user,
      session,
      good.map((g, i) => (i === 1 ? { ...g, presentation_id: 999999999 } : g)),
    ),
    /invalid_gradings/,
  );
  await assert.rejects(record(user, session, []), /invalid_attempts/);
  assert.equal(
    await count('public.learning_sessions where id = $1', [session]),
    0,
    'nada guardado',
  );
  // La respuesta registrada (aunque mala) es la que se guarda.
  const saved = await record(user, session, good);
  assert.equal(saved.first_try_correct, good.length - 1);
  // El núcleo TS también rechaza duplicados y presentaciones ajenas.
  const words = await h.service(() => h.call('learning_review_words', [user, session]));
  assert.throws(
    () => gradeRecordedAttempts(snaps, [...attempts, attempts[0]], words),
    LearningSessionError,
  );
  assert.throws(
    () => gradeRecordedAttempts(snaps, [{ ...attempts[0], presentation_id: -1 }], words),
    LearningSessionError,
  );
});

test('A: reenvío idempotente, sesión de otra cuenta y retomar una sesión de más de 3 horas', async () => {
  await h.setEnabled(false);
  const user = await studied();
  await grantPlus(user);
  const cands = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`))
    .filter((c) => c.nc === 1)
    .slice(0, 2);
  const session = randomUUID();
  await startFocus(user, session, planOf(cands, { focus: { kind: 'smart' } }));
  const snaps = await snapshotsOf(user, session);
  // Sesión interrumpida: una respuesta registrada, la app se cierra, vuelve 5 horas después el mismo día.
  await answer(user, session, answerAll(snaps)[0]);
  await db.query(
    `update public.srs_session_plans set created_at = now() - interval '5 hours' where session_id = $1`,
    [session],
  );
  const gradings = await gradingsOf(user, session, answerAll(snaps));
  const v1Before = await v1(user);
  const r = await record(user, session, gradings, new Date(Date.now() - 5 * 3600000));
  assert.equal(
    r.duplicate,
    false,
    'el inicio es el del plan del servidor: no hay invalid_started_at',
  );
  assert.equal(r.duration_seconds, 3 * 3600, 'duración acotada como en v1');
  const v1After = await v1(user);
  // Reintento de red: mismo resultado, nada dos veces.
  const again = await record(user, session, gradings);
  assert.equal(again.duplicate, true);
  assert.deepEqual(again.verdicts, r.verdicts);
  assert.deepEqual(await v1(user), v1After);
  assert.notDeepEqual(v1After, v1Before);
  assert.equal(await count('public.exercise_attempts where session_id = $1', [session]), 2);
  assert.equal(await count('public.learning_session_clients where session_id = $1', [session]), 1);
  // La RPC vieja con el mismo id tampoco duplica (una build vieja que reenvía).
  const old = await h.submitOld(user, session, 'review', null, [
    { word_id: cands[0].concept_id, answer: 'x', correct: true, first_try: true, response_ms: 1 },
  ]);
  assert.equal(old.duplicate, true);
  assert.deepEqual(await v1(user), v1After);
  // Otra cuenta no puede registrar ni leer esa sesión.
  const intruder = await h.learner();
  await assert.rejects(record(intruder, session, gradings), /session_conflict/);
  // Nada de esto lo puede llamar la app.
  await assert.rejects(
    as(db, 'authenticated', user, () =>
      h.call('record_learning_session', [
        user,
        randomUUID(),
        new Date().toISOString(),
        TZ,
        '[]',
        '{}',
        '{}',
      ]),
    ),
    /permission denied/,
  );
});

test('A: con el SRS v2 encendido, un ítem de producción actualiza vocabulario y producción, y uno de varios conceptos cada unidad', async () => {
  await h.setEnabled(true);
  try {
    const user = await studied();
    const cands = await candidates(user, 'srs');
    const units = await h.all(
      'select concept_id, dimension, n from public.user_srs_state where user_id = $1',
      [user],
    );
    const has = (c) =>
      units.some((u) => u.concept_id === c.concept_id && u.dimension === c.dimension);
    const prod = cands.find((c) => c.dimension === 'production' && has(c));
    assert.ok(prod, 'hay un ítem de producción presentable');
    const prodTargets = await targetsOf([prod.item_id]);
    assert.ok(
      new Set(prodTargets.map((t) => t.dimension)).size === 2,
      'producción: vocabulario y producción',
    );
    const taken = new Set(prodTargets.map((t) => t.concept_id));
    let multi = null;
    for (const c of cands.filter((x) => x.nc > 1 && x.dimension === 'vocabulary' && has(x))) {
      const t = await targetsOf([c.item_id]);
      if (t.every((x) => !taken.has(x.concept_id))) {
        multi = c;
        break;
      }
    }
    assert.ok(multi, 'hay un ítem de varios conceptos sin conceptos compartidos');
    const session = randomUUID();
    const plan = planOf([prod, multi]);
    await startAdaptive(user, session, plan);
    // Un plan con dos entradas que comparten un concepto se rechaza (también si es secundario).
    const multiTargets = await targetsOf([multi.item_id]);
    const secondary = multiTargets.find((t) => t.concept_id !== multi.concept_id);
    const sharing = cands.find(
      (c) =>
        c.concept_id === secondary.concept_id &&
        c.item_id !== multi.item_id &&
        c.dimension === 'vocabulary' &&
        has(c),
    );
    if (sharing) {
      await assert.rejects(
        startAdaptive(user, randomUUID(), planOf([multi, sharing])),
        /invalid_plan/,
      );
    }
    const before = await h.all(
      'select concept_id, dimension, n from public.user_srs_state where user_id = $1',
      [user],
    );
    const r = await submit(user, session);
    assert.equal(r.first_try_correct, 2);
    const all = await targetsOf([prod.item_id, multi.item_id]);
    const applied = await h.one('select * from public.srs_applied_sessions where session_id = $1', [
      session,
    ]);
    assert.equal(applied.origin, 'online');
    assert.equal(applied.source, 'adaptive_review');
    assert.equal(applied.units_attended, all.length);
    for (const t of all) {
      const u = await h.one(
        'select n, last_session_id from public.user_srs_state where user_id = $1 and concept_id = $2 and dimension = $3',
        [user, t.concept_id, t.dimension],
      );
      const b = before.find((x) => x.concept_id === t.concept_id && x.dimension === t.dimension);
      assert.equal(u.n, (b?.n ?? 0) + 1, `${t.concept_id}/${t.dimension}: una observación`);
      assert.equal(u.last_session_id, session);
    }
    // Reenvío: el v2 no aplica dos veces.
    const seq = (
      await h.one('select last_seq from public.srs_user_head where user_id = $1', [user])
    ).last_seq;
    assert.equal((await submit(user, session)).duplicate, true);
    assert.equal(
      (await h.one('select last_seq from public.srs_user_head where user_id = $1', [user]))
        .last_seq,
      seq,
    );
  } finally {
    await h.setEnabled(false);
  }
  await switchesOff();
});

test('A/B: el armador adaptativo no repite un concepto en dos entradas, contando los secundarios', async () => {
  await h.setEnabled(true);
  try {
    const user = await studied();
    await db.query(
      `update public.user_srs_state set t_last = now() - interval '1 day', last_seen_at = now() - interval '1 day',
                      due_at = now() - interval '1 hour', due_effective_at = now() - interval '1 hour' where user_id = $1`,
      [user],
    );
    const cand = await h.service(() =>
      h.call('learning_review_candidates', [user, 'en', TZ, new Date().toISOString()]),
    );
    // Los ítems llevan sus conceptos y son todos conocidos por el usuario.
    const known = new Set(
      (
        await h.all('select distinct concept_id from public.user_srs_state where user_id = $1', [
          user,
        ])
      ).map((x) => x.concept_id),
    );
    const items = cand.units.flatMap((u) => u.items);
    assert.ok(
      items.some((i) => i.concepts.length > 1),
      'hay candidatos de varios conceptos',
    );
    assert.ok(items.every((i) => i.concepts.every((c) => known.has(c))));
    const session = randomUUID();
    const plan = buildReviewPlan({ ...cand, seed: session });
    assert.ok(plan.items.length > 0);
    const byItem = new Map(items.map((i) => [i.item_id, i.concepts]));
    const seen = plan.items.flatMap((p) => byItem.get(p.item_id));
    assert.equal(new Set(seen).size, seen.length, 'ningún concepto en dos entradas');
    await startAdaptive(user, session, plan);
    const r = await submit(user, session);
    assert.equal(r.first_try_total, plan.items.length);
  } finally {
    await h.setEnabled(false);
  }
});

test('B: paridad con la ruta de la fase 4 para ítems de un concepto (v1, racha, logros, intentos)', async () => {
  await h.setEnabled(false);
  const a = await studied();
  const b = await studied();
  await grantPlus(a);
  await grantPlus(b);
  const picks = (await candidates(a, 'v1', 'en', `and r.dimension = 'vocabulary'`))
    .filter((c) => c.nc === 1)
    .slice(0, 4);
  const plan = planOf(picks, { focus: { kind: 'smart' } });
  const sa = randomUUID();
  const sb = randomUUID();
  await startFocus(a, sa, plan);
  await startFocus(b, sb, plan);
  const make = (s) => (s.position % 2 ? wrongAnswer(s) : rightAnswer(s));
  // a: fase 4 (learning_submit_review_graded); b: fase 5 (record_learning_session).
  const ra = await h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [a, sa]);
    const words = await h.call('learning_review_words', [a, sa]);
    const g = gradeReviewAttempts(snaps, answerAll(snaps, make), words);
    return h.call('learning_submit_review_graded', [
      a,
      sa,
      new Date(Date.now() - 60000).toISOString(),
      TZ,
      j(g.attempts),
      j(g.gradings),
      j(LEARNING_GRADER),
    ]);
  });
  const rb = await submit(b, sb, make);
  for (const k of ['first_try_total', 'first_try_correct', 'accuracy'])
    assert.equal(rb[k], ra[k], k);
  const strip = (rows) =>
    rows.map(({ next_review_at, ...x }) => ({ ...x, due: next_review_at !== null }));
  assert.deepEqual(strip(await v1(b)), strip(await v1(a)), 'mismo efecto en el SRS v1');
  const day = (u) =>
    h.one(
      `select sessions_completed, answers, correct_answers from public.user_daily_activity
                            where user_id = $1 order by activity_date desc limit 1`,
      [u],
    );
  assert.deepEqual(await day(b), await day(a), 'misma actividad diaria (racha)');
  const att = (s) =>
    h.all(
      `select word_id, skill, answer, is_correct, is_first_try, response_ms from public.exercise_attempts
                            where session_id = $1 order by id`,
      [s],
    );
  assert.deepEqual(await att(sb), await att(sa), 'mismos intentos');
  const ach = (u) =>
    h.all('select achievement_id from public.user_achievements where user_id = $1 order by 1', [u]);
  assert.deepEqual(await ach(b), await ach(a), 'mismos logros');
  const grd = (s) =>
    h.all(
      'select item_id, status, verdict, attempt_no from public.exercise_attempt_gradings where session_id = $1 order by attempt_id',
      [s],
    );
  assert.deepEqual(await grd(sb), await grd(sa));
});

test('C: idiomas separados, sin mezclar contenido ni tocar el progreso de otro idioma', async () => {
  await h.setEnabled(false);
  const itLesson = (
    await h.one(`select e.lesson_id from public.exercises e join public.lessons l on l.id = e.lesson_id
    join public.curriculum_units u on u.id = l.unit_id where u.language_code = 'it' and l.is_published and e.is_published
    group by e.lesson_id having array_agg(distinct e.type) @> array['fill_blank']::text[] order by count(*), e.lesson_id limit 1`)
  ).lesson_id;
  const user = await studied();
  // El mismo usuario estudia también italiano.
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy,
    first_completed_at, last_completed_at) values ($1, $2, 1, 0.5, 0.5, now(), now()) on conflict do nothing`,
    [user, itLesson],
  );
  const s0 = randomUUID();
  await h.startLesson(user, s0, itLesson);
  await h.submitLesson(
    user,
    s0,
    itLesson,
    answerAll(await h.snapshotsOf(user, s0)),
    new Date(Date.now() - 5 * 60000),
  );
  await grantPlus(user);
  const enBefore = await h.all(
    `select p.* from public.user_word_progress p join public.words w on w.id = p.word_id
                                where p.user_id = $1 and w.language_code = 'en' order by p.word_id`,
    [user],
  );
  const itCands = (await candidates(user, 'v1', 'it', `and r.dimension = 'vocabulary'`)).slice(
    0,
    3,
  );
  assert.ok(itCands.length > 0);
  // Un plan italiano con un ítem inglés no se registra.
  const enCand = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`))[0];
  await assert.rejects(
    startFocus(
      user,
      randomUUID(),
      planOf([itCands[0], enCand], { focus: { kind: 'smart' } }),
      'it',
    ),
    /invalid_plan/,
  );
  const session = randomUUID();
  const chosen = [];
  const used = new Set();
  for (const c of itCands) {
    const t = (await targetsOf([c.item_id])).map((x) => x.concept_id);
    if (t.some((x) => used.has(x))) continue;
    t.forEach((x) => used.add(x));
    chosen.push(c);
  }
  await startFocus(user, session, planOf(chosen, { focus: { kind: 'smart' } }), 'it');
  // Una presentación de otro idioma metida a mano en la sesión: record la rechaza (invalid_plan).
  const tampered = randomUUID();
  await startFocus(user, tampered, planOf(chosen.slice(0, 1), { focus: { kind: 'smart' } }), 'it');
  const enItem =
    await h.one(`select i.id, i.current_version_id from public.exercise_items i join public.exercise_item_versions v
    on v.id = i.current_version_id where i.language_code = 'en' and v.grading_mode_id = 'normalized_text.v1' limit 1`);
  await db.query(
    `insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id)
                  values ($1, $2, 9, $3, $4)`,
    [user, tampered, enItem.id, enItem.current_version_id],
  );
  const tSnaps = await snapshotsOf(user, tampered);
  const tg = await gradingsOf(
    user,
    tampered,
    answerAll(tSnaps.filter((s) => s.item_id !== enItem.id)),
  );
  await assert.rejects(record(user, tampered, tg), /invalid_plan/);

  await submit(user, session);
  const enAfter = await h.all(
    `select p.* from public.user_word_progress p join public.words w on w.id = p.word_id
                               where p.user_id = $1 and w.language_code = 'en' order by p.word_id`,
    [user],
  );
  assert.deepEqual(enAfter, enBefore, 'el inglés no cambia');
  const g = await h.all(
    `select i.language_code from public.exercise_attempt_gradings g join public.exercise_items i on i.id = g.item_id
                         where g.session_id = $1`,
    [session],
  );
  assert.ok(g.length > 0 && g.every((x) => x.language_code === 'it'));
});

test('C: cobertura de repasos por idioma (sin contenido = no disponible, nunca «al día»)', async () => {
  const cov = async (l) => h.service(() => h.call('learning_review_coverage', [l]));
  for (const l of ['en', 'it', 'pt', 'zh']) {
    const c = await cov(l);
    assert.equal(c.available, true, l);
    assert.ok(c.reviewable_items > 0 && c.reviewable_concepts > 0, l);
    assert.ok(c.multi_concept_items > 0, `${l}: ítems de varios conceptos`);
    assert.ok(c.by_dimension.vocabulary > 0 && c.by_dimension.production > 0, l);
  }
  for (const l of ['es', 'fr']) {
    const c = await cov(l);
    assert.equal(c.available, false, l);
    assert.equal(c.reviewable_items, 0, l);
  }
  assert.equal(await cov('xx'), null);
  await assert.rejects(
    as(db, 'authenticated', null, () => h.call('learning_review_coverage', ['en'])),
    /permission denied/,
  );
  // pair_set (parejas) sigue fuera de los repasos: su payload es la respuesta.
  assert.equal(
    await count(`public.review_item_candidates('en') r join public.exercise_item_versions v on v.id = r.item_version_id
                            where v.grading_mode_id = 'pair_set.v1'`),
    0,
  );
});

test('E: la ruta vieja sigue intacta y learning_route_usage distingue cada ruta', async () => {
  await h.setEnabled(false);
  const since = new Date(Date.now() - 1000).toISOString();
  const user = await studied();
  // Build publicada: repaso con veredicto del cliente por submit_learning_session.
  const words = (await v1(user)).slice(0, 2).map((w) => w.word_id);
  const old = randomUUID();
  const r = await h.submitOld(
    user,
    old,
    'review',
    null,
    words.map((w) => ({
      word_id: w,
      answer: 'x',
      correct: true,
      first_try: true,
      response_ms: 900,
    })),
  );
  assert.equal(r.duplicate, false);
  assert.equal(await count('public.exercise_attempt_gradings where session_id = $1', [old]), 0);
  // Lección por learning-session con el cliente registrado.
  const s = randomUUID();
  await h.startLesson(user, s, lesson);
  await h.submitLesson(user, s, lesson, answerAll(await h.snapshotsOf(user, s)));
  await h.service(() =>
    h.call('learning_note_client', [
      user,
      s,
      'lesson_graded',
      j({ contract: 2, app_version: '0.2.0', platform: 'ios' }),
    ]),
  );
  // Cliente mal formado o sesión ajena: se ignora sin fallar.
  await h.service(() =>
    h.call('learning_note_client', [user, randomUUID(), 'lesson_graded', j({ contract: 2 })]),
  );
  await h.service(() => h.call('learning_note_client', [user, old, 'nope', j({ contract: 2 })]));
  // Repaso de la fase 5.
  await grantPlus(user);
  const c = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`))
    .filter((x) => x.nc === 1)
    .slice(0, 1);
  const sr = randomUUID();
  await startFocus(user, sr, planOf(c, { focus: { kind: 'smart' } }));
  await submit(user, sr);
  const usage = await h.service(() => h.call('learning_route_usage', [since]));
  const mine = (route) =>
    usage.routes.filter((x) => x.route === route).reduce((n, x) => n + x.sessions, 0);
  assert.ok(mine('legacy_review') >= 1);
  assert.ok(mine('lesson_graded') >= 2);
  assert.ok(
    usage.routes.some(
      (x) => x.route === 'lesson_graded' && x.contract === 2 && x.app_version === '0.2.0',
    ),
  );
  assert.ok(usage.routes.some((x) => x.route === 'record_learning_session' && x.contract === 2));
  assert.ok(usage.legacy_review_users >= 1);
  assert.equal(await count('public.learning_session_clients where session_id = $1', [old]), 0);
  // Inmutable.
  await assert.rejects(
    db.query(`update public.learning_session_clients set contract = 9 where session_id = $1`, [s]),
    /inmutables/,
  );
});

test('15.3: la migración al v2 verifica las palabras de un repaso de varios conceptos (no quedan sin reconstruir)', async () => {
  await h.setEnabled(false);
  // Sin tocar el v1 a mano (eso solo ya haría fallar la verificación).
  const user = await studied(lesson, rightAnswer, { due: false });
  await grantPlus(user);
  const multi = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`)).find(
    (c) => c.nc > 1,
  );
  const session = randomUUID();
  await startFocus(user, session, planOf([multi], { focus: { kind: 'smart' } }));
  await submit(user, session, wrongAnswer);
  const words = (await targetsOf([multi.item_id])).map((t) => t.word_id);
  await h.setEnabled(true);
  try {
    const res = await h.service(() => h.call('srs_v2_migrate_user', [user, TZ]));
    assert.equal(
      Number(res.category_c_ratio),
      0,
      'los intentos de record_learning_session no son categoría C',
    );
    assert.equal(res.converted, 0, 'todo verificado contra el v1');
    for (const w of words) {
      const u = await h.one(
        `select migration_source from public.user_srs_state where user_id = $1 and concept_id = $2 and dimension = 'vocabulary'`,
        [user, w],
      );
      assert.notEqual(u?.migration_source, 'converted', w);
    }
  } finally {
    await h.setEnabled(false);
  }
});

test('Aislamiento: Ranked, energía y los interruptores no cambian', async () => {
  const ranked = async () =>
    h.one(`select
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.battles t) b,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.player_ratings t) r,
      (select md5(coalesce(string_agg(p.prosrc, ',' order by p.proname), '')) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and (p.proname like '%battle%' or p.proname like '%ranked%' or p.proname like '%match%')) f`);
  const user = await studied();
  const before = await ranked();
  await grantPlus(user);
  const c = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`))
    .filter((x) => x.nc === 1)
    .slice(0, 2);
  const energy = await h.one('select * from public.user_energy where user_id = $1', [user]);
  const s = randomUUID();
  await startFocus(user, s, planOf(c, { focus: { kind: 'smart' } }));
  await submit(user, s);
  assert.deepEqual(
    await h.one('select * from public.user_energy where user_id = $1', [user]),
    energy,
  );
  assert.deepEqual(await ranked(), before);
  // Ninguna función de la fase 5 menciona tablas de Ranked.
  const src =
    await h.all(`select proname, prosrc from pg_proc where proname in ('record_learning_session', 'review_item_known',
    'learning_review_coverage', 'learning_route_usage', 'learning_note_client')`);
  assert.equal(src.length, 5);
  for (const f of src)
    assert.ok(!/battle|ranked|player_ratings|rating_history/.test(f.prosrc), f.proname);
  await switchesOff();
});

test('la migración 20261111120000 está al día con scripts/build-phase5-sql.ts', async () => {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/build-phase5-sql.ts', '--check'],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 0, r.stderr || r.stdout);
});

// ---------------------------------------------------------------------------------------------
// Cierre de la fase 5: repaso básico autoritativo con el SRS v1 (v2 apagado) y condiciones de Plus.

/** La Edge Function, start_review sin foco con el v2 apagado (contrato 2). */
const startBasic = (user, session, lang = 'en') =>
  h.service(async () => {
    const state = await h.call('learning_review_prepare', [user, session, TZ]);
    if (state.session === 'open' || state.session === 'expired') {
      return { state, items: await h.call('learning_review_content', [user, session]) };
    }
    assert.equal(state.enabled, false);
    const cand = await h.call('learning_focus_candidates', [user, lang, new Date().toISOString()]);
    const plan = buildBasicPlan({ ...cand, seed: session });
    if (plan.items.length === 0) return { state, plan, cand };
    const started = await h.call('learning_start_basic_review', [
      user,
      session,
      lang,
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]);
    return {
      state,
      plan,
      cand,
      started,
      items: await h.call('learning_review_content', [user, session]),
    };
  });

test('Cierre A: repaso básico con el v2 apagado: lo elige, registra, corrige y guarda el servidor con las reglas del v1', async () => {
  await h.setEnabled(false);
  const user = await studied(); // todas sus palabras vencidas en el v1
  // Errores distintos para ver el orden; una palabra NO vencida no puede entrar.
  const words = await v1(user);
  await db.query(
    `update public.user_word_progress set incorrect_count = 3 where user_id = $1 and word_id = $2`,
    [user, words[1].word_id],
  );
  await db.query(
    `update public.user_word_progress set incorrect_count = 1 where user_id = $1 and word_id = $2`,
    [user, words[2].word_id],
  );
  await db.query(
    `update public.user_word_progress set next_review_at = now() + interval '3 days' where user_id = $1 and word_id = $2`,
    [user, words[0].word_id],
  );
  assert.equal(await count('public.user_entitlements where user_id = $1', [user]), 0, 'sin Plus');

  const session = randomUUID();
  const r = await startBasic(user, session);
  assert.equal(r.plan.planner_version, 'basic-1.0.0');
  assert.ok(r.plan.items.length > 0 && r.plan.items.length <= 10);
  assert.ok(r.plan.items.every((i) => i.reason === 'due'));
  // La regla de la app vieja sobre las palabras presentables: vencidas, más errores primero.
  const order = pickBasicReview(
    r.cand.words.filter((w) => w.items.length > 0),
    Date.now(),
  ).map((w) => w.word.id);
  const chosen = r.plan.items.map((i) => i.concept_id);
  assert.deepEqual(
    chosen,
    order.filter((id) => chosen.includes(id)),
    'mismo orden que la regla',
  );
  assert.equal(chosen[0], words[1].word_id, 'la de más errores primero');
  assert.ok(!chosen.includes(words[0].word_id), 'la no vencida no entra');
  // Registro del servidor: plan basic_review, presentaciones, contenido sin respuesta.
  const plan = await h.one(
    'select source, focus, planner_version from public.srs_session_plans where session_id = $1',
    [session],
  );
  assert.deepEqual(plan, {
    source: 'basic_review',
    focus: { kind: 'basic' },
    planner_version: 'basic-1.0.0',
  });
  assert.equal(
    await count('public.exercise_presentations where session_id = $1', [session]),
    r.plan.items.length,
  );
  assert.ok(
    r.items.every((it) => it.answered === null && !JSON.stringify(it.payload).includes('"answer"')),
  );

  // Corrección autoritativa: el cliente dice «correcta» y el servidor corrige.
  const snaps = await snapshotsOf(user, session);
  const make = (s) => (s.position === 1 ? wrongAnswer(s) : rightAnswer(s));
  const attempts = answerAll(snaps, make);
  const a1 = await answer(user, session, attempts[0]);
  assert.equal(a1.verdict, 'incorrect');
  // Reintento de red de la misma respuesta: misma corrección, sin duplicar.
  assert.equal((await answer(user, session, attempts[0])).duplicate, true);
  // Sesión interrumpida: al volver se retoma con lo ya corregido.
  const resumed = await startBasic(user, session);
  assert.equal(resumed.state.session, 'open');
  assert.equal(resumed.state.source, 'basic_review');
  assert.equal(resumed.items.filter((i) => i.answered).length, 1);

  const before = await v1(user);
  const energy = await h.one('select * from public.user_energy where user_id = $1', [user]);
  const day = await h.one(
    'select coalesce(sum(sessions_completed), 0)::int s from public.user_daily_activity where user_id = $1',
    [user],
  );
  const res = await submit(user, session, make);
  assert.equal(res.duplicate, false);
  assert.equal(res.route, 'record_learning_session');
  assert.equal(res.first_try_correct, snaps.length - 1);
  // SRS v1: cada palabra evaluada una vez; el resto igual.
  const after = await v1(user);
  const targets = await targetsOf(snaps.map((s) => s.item_id));
  const evaluated = new Set(targets.map((t) => t.word_id));
  for (const b of before) {
    const a = after.find((x) => x.word_id === b.word_id);
    if (evaluated.has(b.word_id)) assert.equal(a.seen_count, b.seen_count + 1, b.word_id);
    else assert.deepEqual(a, b, `${b.word_id} no evaluada`);
  }
  assert.deepEqual(
    await h.one('select * from public.user_energy where user_id = $1', [user]),
    energy,
    'sin energía',
  );
  const dayAfter = await h.one(
    'select coalesce(sum(sessions_completed), 0)::int s from public.user_daily_activity where user_id = $1',
    [user],
  );
  assert.equal(dayAfter.s, day.s + 1, 'cuenta para la racha');
  assert.equal(
    await count('public.srs_applied_sessions where session_id = $1', [session]),
    0,
    'v2 apagado',
  );
  // Reenvío idempotente y sesión cerrada.
  assert.equal((await submit(user, session)).duplicate, true);
  assert.deepEqual(await v1(user), after);
  assert.equal(
    (await h.service(() => h.call('learning_review_prepare', [user, session, TZ]))).session,
    'closed',
  );
  const usage = await h.service(() =>
    h.call('learning_route_usage', [new Date(Date.now() - 600000).toISOString()]),
  );
  assert.ok(usage.routes.some((x) => x.route === 'record_learning_session'));
  await switchesOff();
});

test('Cierre A: el SRS v1 recibe lo mismo que con la ruta vieja de la app (mismas palabras y resultados)', async () => {
  await h.setEnabled(false);
  const a = await studied();
  const b = await studied();
  const session = randomUUID();
  await startBasic(a, session);
  const make = (s) => (s.position % 2 ? wrongAnswer(s) : rightAnswer(s));
  await submit(a, session, make);
  const graded = await h.all(
    'select word_id, is_correct from public.exercise_attempts where session_id = $1 order by id',
    [session],
  );
  const single = graded.every((g) => g.word_id !== null);
  // La misma sesión por la ruta vieja de la app (una palabra por intento, el mismo resultado).
  if (single) {
    await h.submitOld(
      b,
      randomUUID(),
      'review',
      null,
      graded.map((g) => ({
        word_id: g.word_id,
        answer: 'x',
        correct: g.is_correct,
        first_try: true,
        response_ms: 1000,
      })),
    );
    const strip = (rows) =>
      rows.map(({ next_review_at, ...x }) => ({ ...x, due: next_review_at !== null }));
    assert.deepEqual(strip(await v1(a)), strip(await v1(b)));
  } else {
    // Con un ítem de varios conceptos se compara contra la regla de v1 por palabra (bool_and).
    const t = await h.all(
      `select c.word_id, bool_and(a.is_correct) ok from public.exercise_attempts a
      join public.exercise_attempt_gradings g on g.attempt_id = a.id
      join public.item_concepts ic on ic.item_id = g.item_id and ic.role = 'target'
      join public.concepts c on c.id = ic.concept_id where a.session_id = $1 group by c.word_id`,
      [session],
    );
    await h.submitOld(
      b,
      randomUUID(),
      'review',
      null,
      t.map((x) => ({
        word_id: x.word_id,
        answer: 'x',
        correct: x.ok,
        first_try: true,
        response_ms: 1000,
      })),
    );
    const strip = (rows) =>
      rows.map(({ next_review_at, ...x }) => ({ ...x, due: next_review_at !== null }));
    assert.deepEqual(strip(await v1(a)), strip(await v1(b)));
  }
});

test('Cierre A: validación del plan básico en el servidor', async () => {
  await h.setEnabled(false);
  const user = await studied();
  const cand = await h.service(() =>
    h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]),
  );
  const plan = buildBasicPlan({ ...cand, seed: 's' });
  const start = (session, p) =>
    h.service(() =>
      h.call('learning_start_basic_review', [
        user,
        session,
        'en',
        TZ,
        j(p),
        j(reviewPresentationOrders(session, p.items)),
      ]),
    );
  // Palabra no vencida.
  await db.query(
    `update public.user_word_progress set next_review_at = now() + interval '1 day' where user_id = $1 and word_id = $2`,
    [user, plan.items[0].concept_id],
  );
  await assert.rejects(start(randomUUID(), plan), /invalid_plan/);
  await db.query(
    `update public.user_word_progress set next_review_at = now() - interval '1 hour' where user_id = $1`,
    [user],
  );
  // Motivo distinto de «due».
  await assert.rejects(
    start(randomUUID(), {
      ...plan,
      items: plan.items.map((i, k) => (k === 0 ? { ...i, reason: 'weak' } : i)),
    }),
    /invalid_plan/,
  );
  // Más de 10 entradas.
  const eleven = {
    ...plan,
    items: Array.from({ length: 11 }, (_, k) => ({ ...plan.items[0], position: k + 1 })),
  };
  await assert.rejects(start(randomUUID(), eleven), /invalid_plan/);
  // Idempotente; un session_id de otro tipo de repaso no se mezcla.
  const s = randomUUID();
  await start(s, plan);
  assert.equal((await start(s, plan)).duplicate, true);
  await grantPlus(user);
  const focusPlan = buildFocusPlan({ ...cand, seed: s }, { kind: 'smart' });
  await assert.rejects(startFocus(user, s, focusPlan), /session_conflict/);
  // La app no puede llamarla.
  await assert.rejects(
    as(db, 'authenticated', user, () =>
      h.call('learning_start_basic_review', [
        user,
        randomUUID(),
        'en',
        TZ,
        j(plan),
        j(reviewPresentationOrders('x', plan.items)),
      ]),
    ),
    /permission denied/,
  );
  // Sin vencidas: «al día», sin escribir nada.
  const fresh = await h.learner();
  const none = await startBasic(fresh, randomUUID());
  assert.equal(none.plan.status, 'up_to_date');
});

test('Cierre C: Plus con varios conceptos sólo actualiza conceptos target evaluados y ya estudiados, una vez cada uno', async () => {
  await h.setEnabled(false);
  const user = await studied();
  await grantPlus(user);
  const multi = (await candidates(user, 'v1', 'en', `and r.dimension = 'vocabulary'`)).find(
    (c) => c.nc > 1,
  );
  const targets = await targetsOf([multi.item_id]);
  // Un concepto RELACIONADO al ítem (rol context) y estudiado: no se evalúa, no debe cambiar.
  const related = (await v1(user)).find((w) => !targets.some((t) => t.word_id === w.word_id));
  await db.query('set session_replication_role = replica');
  await db.query(
    `insert into public.item_concepts (item_id, concept_id, dimension, role, language_code) values ($1, $2, 'vocabulary', 'context', 'en')`,
    [multi.item_id, related.word_id],
  );
  await db.query('set session_replication_role = origin');
  // Un ítem con una palabra NO estudiada no es presentable ni registrable.
  const unstudied = await h.one(
    `select r.* from public.review_item_candidates('en') r
    where r.dimension = 'vocabulary' and not public.review_item_known($1, r.item_id, 'v1')
      and exists (select 1 from public.user_word_progress p where p.user_id = $1 and p.word_id = r.concept_id) limit 1`,
    [user],
  );
  assert.ok(unstudied, 'hay un ítem que mezcla una palabra estudiada con otra no estudiada');
  await assert.rejects(
    startFocus(user, randomUUID(), planOf([unstudied], { focus: { kind: 'smart' } })),
    /invalid_plan/,
  );
  const session = randomUUID();
  await startFocus(user, session, planOf([multi], { focus: { kind: 'smart' } }));
  const before = await v1(user);
  const energy = await h.one('select * from public.user_energy where user_id = $1', [user]);
  await submit(user, session);
  const after = await v1(user);
  for (const t of targets) {
    assert.equal(
      after.find((x) => x.word_id === t.word_id).seen_count,
      before.find((x) => x.word_id === t.word_id).seen_count + 1,
      t.word_id,
    );
  }
  assert.deepEqual(
    after.find((x) => x.word_id === related.word_id),
    before.find((x) => x.word_id === related.word_id),
    'relacionado no evaluado: sin cambios',
  );
  assert.deepEqual(
    await h.one('select * from public.user_energy where user_id = $1', [user]),
    energy,
    'sin energía',
  );
  // Evidencias inmutables.
  await assert.rejects(
    db.query(
      `update public.exercise_attempt_gradings set verdict = 'correct' where session_id = $1`,
      [session],
    ),
    /inmutables/,
  );
  await assert.rejects(
    db.query('delete from public.exercise_attempt_gradings where session_id = $1', [session]),
    /inmutables/,
  );
  await db.query('set session_replication_role = replica');
  await db.query(
    `delete from public.item_concepts where item_id = $1 and concept_id = $2 and role = 'context'`,
    [multi.item_id, related.word_id],
  );
  await db.query('set session_replication_role = origin');
});

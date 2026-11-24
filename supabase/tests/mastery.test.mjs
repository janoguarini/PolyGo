// Mastery Engine me-1.0.0 en PGlite (migración 20261109130000_mastery_engine.sql): canónico SQL en
// numeric = réplica TS (5.8.4 criterios 1, 3 y 4), evidencia desde las correcciones del servidor,
// cola de recálculo, P9, independencia del SRS (7.4) y trabajo de sugerencias R1 (I1–I6).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb } from './harness.mjs';
import { helpers, answerAll, wrongAnswer, TZ } from './learningHelpers.mjs';
import { betaP5, modelEval } from '../../shared/mastery.ts';

let db;
let h;
before(async () => {
  db = await createDb();
  h = helpers(db);
});

const r4 = (x) => (x === null || x === undefined ? null : Math.round(Number(x) * 10000) / 10000);

test('P5 numérico: SQL numeric = referencia (≤ 1e−10) = TS, y falla si la fracción continua no converge', async () => {
  const cases = [[1, 1, 0.05], [2, 2, 0.135350362172], [10, 10, 0.320086529589], [100, 100, 0.441969842058],
    [0.5, 0.5, 0.00615582970243], [20, 1, 0.860891659332], [13, 4, 0.583427719294], [2, 8, 0.041023167507],
    [100, 25, 0.738740832823], [1.5, 0.5, 0.228519813806], [0.5, 1.5, 0.00154291930267], [1, 0.05, 0.641514077591],
    [0.2, 0.01, 0.603706725956], [0.1, 0.005, 0.64642695334], [0.01, 0.01, 0], [0.05, 1, 0]];
  for (const [a, b, ref] of cases) {
    const q = Number((await h.one('select public.mastery_beta_p5($1::numeric, $2::numeric) q', [a, b])).q);
    if (ref > 1e-6) assert.ok(Math.abs(q - ref) <= 1e-10, `Q(${a}, ${b}) = ${q}`);
    assert.equal(r4(q), r4(betaP5(a, b)), `${a}, ${b}`);
  }
  await assert.rejects(db.query('select public.mastery_beta_cf(0.5, 1000000, 1000000)'), /no convergió/);
});

test('evidencia de lecciones corregidas → cola → user_concept_state; SQL = TS en cada unidad; P9', async () => {
  const lesson = await h.lessonWith('translation_choice', 'translate_write');
  const user = await h.learner(lesson);
  for (let k = 0; k < 2; k++) {
    const session = randomUUID();
    await h.startLesson(user, session, lesson);
    const snaps = await h.snapshotsOf(user, session);
    const attempts = answerAll(snaps).map((a, i) => (k === 1 && i === 0 ? { ...a, answer: wrongAnswer(snaps[0]) } : a));
    await h.submitLesson(user, session, lesson, attempts);
  }
  const queued = await h.one('select count(*)::int n from public.knowledge_recompute_queue where user_id = $1 and processed_at is null', [user]);
  assert.ok(queued.n > 0);
  const asOf = new Date(Date.now() + 2 * 86_400_000).toISOString();
  const done = await h.service(() => h.call('mastery_process_queue', [1000, asOf]));
  assert.equal(done, queued.n);
  const states = await h.all('select * from public.user_concept_state where user_id = $1 order by concept_id, dimension', [user]);
  assert.equal(states.length, queued.n);
  let compared = 0;
  for (const st of states) {
    if (st.status === 'insufficient') {
      assert.equal(st.mastery, null);
      assert.equal(st.confidence, null);
    }
    const rows = await h.service(() => h.call('mastery_evidence_rows', [user, st.concept_id, st.dimension, asOf]));
    if (rows.length === 0) continue;
    const concept = await h.one('select level from public.concepts where id = $1', [st.concept_id]);
    const lastExp = st.last_exposed_at ? st.last_exposed_at.getTime() : null;
    const ts = modelEval({ dimension: st.dimension, level: concept.level, rows, asOfMs: Date.parse(asOf), lastExposureMs: lastExp });
    assert.equal(st.status, ts.status, st.concept_id);
    assert.equal(r4(st.mastery), r4(ts.mastery), `m ${st.concept_id}`);
    assert.equal(r4(st.confidence), r4(ts.confidence), `c ${st.concept_id}`);
    assert.equal(r4(st.model_detail.n_eff), r4(ts.detail.nEff), `n_eff ${st.concept_id}`);
    assert.equal(r4(st.model_detail.alpha), r4(ts.detail.alpha), `α ${st.concept_id}`);
    assert.equal(r4(st.model_detail.beta), r4(ts.detail.beta), `β ${st.concept_id}`);
    assert.equal(r4(st.recall_speed), r4(ts.recallSpeed), `v ${st.concept_id}`);
    assert.equal(st.model_detail.direct_items, ts.detail.directItems);
    assert.equal(r4(st.model_detail.transfer.s_nov), r4(ts.detail.transfer.sNov));
    compared++;
  }
  assert.ok(compared > 0);
  // La evidencia vieja (sólo intentos) no aporta: un repaso de la app vieja no crea evidencia.
  const ex = await h.one(`select count(*)::int n from public.exercise_attempt_gradings where user_id = $1`, [user]);
  assert.ok(ex.n > 0);
});

test('E0 en la base: la canónica numeric da los valores publicados', async () => {
  const DAY = 86_400_000;
  const rows = [
    { t: 0, item: 'w1' }, { t: 0.002, item: 'w2' }, { t: 0.004, item: 'w3', recog: true }, { t: 1, item: 'w1' }, { t: 3, item: 'w4' },
  ];
  // El motor se prueba con la misma entrada que da mastery_evidence_rows, sin pasar por el contenido.
  const ev = [];
  const last = new Map();
  let prev = null;
  rows.forEach((r, i) => {
    const at = r.t * DAY;
    ev.push({ eventId: i + 1, recordedAtMs: at, itemId: r.item, itemType: r.recog ? 'translation_choice' : 'translate_write',
      inputModality: 'text', assessmentMode: r.recog ? 'recognition' : 'free_recall', responseFormat: r.recog ? 'select' : 'typed',
      verdict: 'correct', score: null, isFirstTry: true, responseMs: 4000, sinceLastSeenS: prev === null ? null : (at - prev) / 1000,
      choices: r.recog ? 4 : null, assists: {}, recommendedSeconds: 20, prevItemFirstTryMs: last.get(r.item) ?? null });
    prev = at;
    last.set(r.item, at);
  });
  // Réplica del cuerpo de mastery_eval sobre una entrada dada: se sustituye la lectura de la evidencia.
  await db.query(`create or replace function public.mastery_evidence_rows(p_user uuid, p_concept text, p_dim text, p_as_of timestamptz)
                  returns jsonb language sql stable as $$ select current_setting('test.ev')::jsonb $$`);
  await db.query(`select set_config('test.ev', $1, false)`, [JSON.stringify(ev)]);
  const user = await h.learner();
  const concept = (await h.one(`select id from public.concepts where language_code = 'en' and level = 'A1' and kind = 'lexical' limit 1`)).id;
  const r = await h.call('mastery_eval', [user, concept, 'vocabulary', new Date(3 * DAY).toISOString()]);
  assert.equal(r.mastery, 0.7637);
  assert.equal(r.lower, 0.3917);
  assert.equal(r.confidence, 0.3507);
  assert.equal(r.detail.n_eff, 2.0897);
  assert.equal(r.status, 'in_progress');
  assert.equal(r.detail.transfer.s_nov, 1.4886);
});

test('independencia (7.4): ninguna función del motor menciona tablas del SRS, de Adaptive ni v1', async () => {
  const fns = await h.all(`select proname, prosrc from pg_proc where proname like 'mastery\\_%' and proname <> 'mastery_enqueue_hint'`);
  assert.ok(fns.length >= 9);
  for (const f of fns) {
    for (const banned of ['user_srs_state', 'srs_session_plans', 'srs_algorithm_versions', 'srs_weights', 'user_word_progress', 'srs_v2_']) {
      assert.ok(!f.prosrc.includes(banned), `${f.proname} menciona ${banned}`);
    }
  }
});

test('R1 (7.2): el trabajo de sugerencias respeta E, I1–I4 e I6', async () => {
  await h.setEnabled(true);
  try {
    const user = await h.learner();
    const concept = (await h.one(`select id from public.concepts where language_code = 'en' and kind = 'lexical' order by id limit 1 offset 5`)).id;
    await db.query(`insert into public.srs_user_head (user_id, v2_since, time_zone) values ($1, now() - interval '30 days', $2)
                    on conflict (user_id) do update set time_zone = excluded.time_zone`, [user, TZ]);
    // V1: t_last = last_seen = hace 10 días; due en 10 días (I_srs = 20 d); due_ME en −4 días.
    await db.query(`insert into public.user_srs_state (user_id, concept_id, dimension, language_code, algorithm_version, weights_version,
                      stability, difficulty, n, lapses, t_last, last_seen_at, due_at, due_effective_at, exposures, rung)
                    values ($1, $2, 'vocabulary', 'en', 'srs-2.0.0', 'srs-2.0.0-w-initial', 12, 5, 3, 0,
                            now() - interval '10 days', now() - interval '10 days', now() + interval '10 days', now() + interval '10 days', 3, 'L')`, [user, concept]);
    const hl = 6 / Math.log2(1 / 0.85);
    await db.query(`insert into public.user_concept_state (user_id, concept_id, dimension, language_code, status, mastery, confidence,
                      model_version, computed_at, last_exposed_at, model_detail)
                    values ($1, $2, 'vocabulary', 'en', 'in_progress', 0.7, 0.5, 'me-1.0.0', now(), now() - interval '10 days',
                            jsonb_build_object('half_life_days', $3::numeric, 'retention_sufficient', true))`, [user, concept, hl]);
    // Con la versión sin habilitar no adelanta nada.
    assert.equal(await h.service(() => h.call('srs_apply_me_hint', [100, null])), 0);
    const s0 = await h.one('select * from public.user_srs_state where user_id = $1', [user]);
    assert.equal(s0.due_effective_at.getTime(), s0.due_at.getTime());
    await db.query(`update public.mastery_model_versions set enabled_for_adaptive = true where version = 'me-1.0.0'`);
    await db.query(`update public.srs_hint_queue set processed_at = null where user_id = $1`, [user]);
    assert.equal(await h.service(() => h.call('srs_apply_me_hint', [100, null])), 1);
    const s1 = await h.one('select * from public.user_srs_state where user_id = $1', [user]);
    // Adelanto máximo: piso = t_last + β·I_srs = hoy (I2: ≤ la mitad del intervalo); nunca atrasa (I1).
    assert.ok(s1.due_effective_at < s1.due_at);
    assert.ok(Math.abs(s1.due_effective_at.getTime() - (s1.t_last.getTime() + 0.5 * (s1.due_at - s1.t_last))) < 2000);
    assert.equal(s1.stability, s0.stability);
    assert.equal(s1.difficulty, s0.difficulty);
    assert.equal(s1.updated_at.getTime(), s0.updated_at.getTime());
    assert.ok(s1.me_hint_expires_at > s1.me_hint_at);
    // I4: con el rol del trabajo, cualquier otra columna se rechaza.
    await db.query('begin');
    await db.query(`select set_config('polygo.srs_writer', 'hint', true)`);
    await assert.rejects(db.query(`update public.user_srs_state set stability = 1 where user_id = $1`, [user]), /I4/);
    await db.query('rollback');
    // I6: una sesión aplicada a la unidad restablece due_effective_at = due_at y anula la sugerencia.
    const { session } = { session: randomUUID() };
    await h.submitOld(user, session, 'review', null, [{ word_id: concept, answer: 'x', correct: true, first_try: true, response_ms: 1000 }]);
    const s2 = await h.one('select * from public.user_srs_state where user_id = $1', [user]);
    assert.equal(s2.due_effective_at.getTime(), s2.due_at.getTime());
    assert.equal(s2.me_hint_at, null);
  } finally {
    await db.query(`update public.mastery_model_versions set enabled_for_adaptive = false where version = 'me-1.0.0'`);
    await h.setEnabled(false);
  }
});

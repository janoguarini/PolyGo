// SRS v2 en PGlite (migración 20261109120000_srs_v2.sql): una sola vía de aplicación, SQL = TS,
// ruta vieja y ruta corregida, idempotencia, rollback, migración por usuario (15.3), orden canónico,
// recálculo determinista, barrido de reparación y AL19 (9.7).
//
// La concurrencia real (K1–K11, dos conexiones) no se puede probar en PGlite: ver
// supabase/tests/pg17/srs2-concurrency.mjs (PostgreSQL 17 local).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb } from './harness.mjs';
import { helpers, answerAll, wrongAnswer, TZ, j } from './learningHelpers.mjs';
import {
  al19Rebuild,
  assistFactor4,
  initialDebtState,
  quantizeQ,
  SRS_INITIAL_WEIGHTS,
  TAU,
  unitHash,
  updateUnit,
} from '../../shared/srs2.ts';

let db;
let h;

before(async () => {
  db = await createDb();
  h = helpers(db);
});

const DAY = 86_400_000;
const iso = (days) => new Date(Math.round(days * DAY)).toISOString();
const daysOf = (ts) => (ts === null ? null : new Date(ts).getTime() / DAY);

/** Un repaso por la ruta vieja: una palabra publicada por intento, todos primeros intentos. */
async function oldReview(user, words, correct = true) {
  const session = randomUUID();
  const r = await h.submitOld(user, session, 'review', null,
    words.map((w, i) => ({ word_id: w, answer: 'x', correct: Array.isArray(correct) ? correct[i] : correct, first_try: true, response_ms: 1500 })));
  return { session, r };
}

/** Una lección por la ruta vieja con todos sus ejercicios publicados. */
async function oldLesson(user, lesson, correct = true) {
  const ex = await h.all(`select id from public.exercises where lesson_id = $1 and is_published order by position, id`, [lesson]);
  const session = randomUUID();
  const r = await h.submitOld(user, session, 'lesson', lesson,
    ex.map((e) => ({ exercise_id: e.id, answer: 'x', correct, first_try: true, response_ms: 1500 })));
  return { session, r };
}

const enWords = async (n, offset = 0) =>
  (await h.all(`select w.id from public.words w join public.concepts c on c.id = w.id
                where w.language_code = 'en' and w.is_published order by w.id limit $1 offset $2`, [n, offset])).map((x) => x.id);

test('apagado por defecto: la RPC vieja guarda igual y no escribe nada del v2', async () => {
  assert.equal((await h.one('select enabled from public.srs_v2_settings')).enabled, false);
  const user = await h.learner();
  const { r } = await oldReview(user, await enWords(3));
  assert.equal(r.duplicate, false);
  assert.equal(r.srs, undefined);
  assert.equal((await h.one('select count(*)::int n from public.srs_user_head where user_id = $1', [user])).n, 0);
  assert.equal((await h.one('select count(*)::int n from public.srs_applied_sessions where user_id = $1', [user])).n, 0);
  assert.equal((await h.one('select count(*)::int n from public.user_word_progress where user_id = $1', [user])).n, 3);
  // La función pública es el envoltorio; el cuerpo vigente quedó intacto como _v1 y sin permisos.
  const fns = await h.all(`select proname, has_function_privilege('authenticated', p.oid, 'execute') x
                           from pg_proc p where proname in ('submit_learning_session', 'submit_learning_session_v1') order by 1`);
  assert.deepEqual(fns.map((f) => [f.proname, f.x]), [['submit_learning_session', true], ['submit_learning_session_v1', false]]);
  const body = (await h.one(`select prosrc from pg_proc where proname = 'submit_learning_session_v1'`)).prosrc;
  assert.match(body, /consume_lesson_energy/);
  assert.match(body, /apply_word_result/);
});

test('SQL = TS: cuantización, ayudas y hash de la unidad', async () => {
  let x = 11;
  const rnd = () => ((x = (x * 48271) % 2147483647) / 2147483647);
  const pairs = Array.from({ length: 2000 }, () => [Math.floor(rnd() * 10001), Math.floor(rnd() * 10001)]);
  const sql = await h.all(`select public.srs_v2_quantize(p[1], p[2]) q from jsonb_array_elements($1::jsonb) e,
                           lateral (select array[(e->>0)::int, (e->>1)::int] p) z`, [j(pairs)]);
  assert.deepEqual(sql.map((r) => r.q), pairs.map(([s, a]) => quantizeQ(s, a)));
  const assists = [{}, { reading_visible: true }, { audio_replays: 4 }, { slow_audio_plays: 2, prompt_audio_plays: 1 },
    { hints_revealed: 3, reading_visible: true }, { reading_toggles: 3 }, { audio_replays: 2, slow_audio_plays: 1, prompt_audio_plays: 1, reading_visible: true }];
  for (const a of assists) {
    assert.equal((await h.one('select public.srs_v2_assist_factor4($1) v', [j(a)])).v, assistFactor4(a), j(a));
  }
  for (const [u, c, d] of [['7f0c7d52-3a3a-4f63-9f41-0a7e3c1f3b10', 'en-hello', 'vocabulary'], ['00000000-0000-0000-0000-000000000001', 'zh-你好', 'grammar'], ['00000000-0000-0000-0000-000000000002', '𝄞-emoji', 'production']]) {
    const sqlH = (await h.one('select public.srs_v2_unit_hash($1, $2, $3) v', [u, c, d])).v;
    assert.equal(sqlH, unitHash(u, c, d), c);
  }
});

test('SQL = TS: srs_v2_update en 1 500 sesiones aleatorias (núcleo + capa, q real y discretizado)', async () => {
  let x = 5;
  const rnd = () => ((x = (x * 48271) % 2147483647) / 2147483647);
  const cases = [];
  for (let i = 0; i < 1500; i++) {
    const hasRow = rnd() < 0.85;
    const exposed = hasRow && rnd() < 0.1;
    const S = 0.01 + rnd() * 27;
    const tLast = Math.round((19000 + rnd() * 50) * DAY) / DAY;
    const due = Math.round((tLast + rnd() * 60) * DAY) / DAY;
    const t = Math.round((tLast + rnd() * 120) * DAY) / DAY;
    const obs = Array.from({ length: 1 + Math.floor(rnd() * 4) }, () => {
      const r = [-2, -1, 0, 1][Math.floor(rnd() * 4)];
      const nT = [1, 2, 3, 5][Math.floor(rnd() * 4)];
      return rnd() < 0.5 ? { q4: [0, 2500, 4999, 5000, 5001, 5400, 6000, 9000, 10000][Math.floor(rnd() * 9)], r, nT }
                         : { q: [0, 0.25, 0.4, 0.4999999, 0.5, 0.5000001, 0.54, 0.6, 0.9, 1][Math.floor(rnd() * 10)], r, nT };
    });
    const imax = rnd() < 0.8 ? 45 : 90;
    const f = 0.95 + rnd() * 0.1;
    const dim = ['vocabulary', 'grammar', 'production', 'comprehension'][Math.floor(rnd() * 4)];
    const target = dim === 'production' ? (rnd() < 0.5 ? 'P' : 'F') : dim === 'comprehension' ? 'U' : 'L';
    const ladder = dim === 'production' ? ['P', 'F'] : dim === 'comprehension' ? ['U'] : ['R', 'G', 'L'];
    const okObs = obs.map((o) => ({ ...o, r: dim === 'comprehension' ? 0 : dim === 'production' ? (target === 'P' ? (o.r > 0 ? 1 : 0) : (o.r < 0 ? -1 : 0)) : Math.min(0, o.r) }));
    const prev = !hasRow ? null : exposed
      ? { S: null, D: null, n: 0, lapses: 0, exposures: 1, tLast: null, lastSeen: tLast, due, rung: ladder[0], relearning: false, lastA: null, lastZMinus: null }
      : { S, D: 1 + rnd() * 9, n: 2, lapses: 1, exposures: 3, tLast, lastSeen: tLast, due, rung: ladder[Math.floor(rnd() * ladder.length)], relearning: false, lastA: 0.5, lastZMinus: 0 };
    cases.push({ prev, obs: okObs, t, imax, f, dim, target, nextDay: Math.floor(t) + 1 });
  }
  const rows = await h.all(
    `select (e->>'i')::int i, u.*
     from jsonb_array_elements($1::jsonb) e,
     lateral public.srs_v2_update((e->>'has')::boolean, (e->>'S')::float8, (e->>'D')::float8, (e->>'n')::int,
       (e->>'lapses')::int, (e->>'exposures')::int, (e->>'tLast')::timestamptz, (e->>'due')::timestamptz, e->>'rung',
       (e->>'relearning')::boolean, (e->>'la')::float8, (e->>'lz')::float8, e->'obs', (e->>'t')::timestamptz,
       (e->>'f')::float8, (e->>'imax')::int, (e->>'nextDay')::timestamptz, e->>'dim', e->>'target',
       $2::float8[], 0.85) u order by 1`,
    [j(cases.map((c, i) => ({
      i, has: c.prev !== null, S: c.prev?.S ?? null, D: c.prev?.D ?? null, n: c.prev?.n ?? 0, lapses: c.prev?.lapses ?? 0,
      exposures: c.prev?.exposures ?? 0, tLast: c.prev?.tLast == null ? null : iso(c.prev.tLast), due: c.prev ? iso(c.prev.due) : null,
      rung: c.prev?.rung ?? null, relearning: c.prev?.relearning ?? false, la: c.prev?.lastA ?? null, lz: c.prev?.lastZMinus ?? null,
      obs: c.obs, t: iso(c.t), f: c.f, imax: c.imax, nextDay: iso(c.nextDay), dim: c.dim, target: c.target,
    }))), SRS_INITIAL_WEIGHTS],
  );
  assert.equal(rows.length, cases.length);
  for (const r of rows) {
    const c = cases[r.i];
    const ts = updateUnit(c.prev, c.obs, { t: c.t, f: c.f, imax: c.imax, nextLocalDayStart: c.nextDay, dim: c.dim, target: c.target });
    const s = ts.state;
    assert.equal(r.kind, ts.kind, `caso ${r.i}`);
    if (s.S === null) assert.equal(r.stability, null);
    else assert.ok(Math.abs(r.stability - s.S) <= 1e-9 * Math.max(1, s.S), `S ${r.i}: ${r.stability} vs ${s.S}`);
    if (s.D === null) assert.equal(r.difficulty, null);
    else assert.ok(Math.abs(r.difficulty - s.D) <= 1e-9, `D ${r.i}`);
    assert.ok(Math.abs(daysOf(r.due_at) - s.due) * 86400 < 0.002, `due ${r.i}: ${daysOf(r.due_at)} vs ${s.due}`);
    if (s.tLast !== null) assert.ok(Math.abs(daysOf(r.t_last) - s.tLast) * 86400 < 0.002, `t_last ${r.i}`);
    assert.deepEqual([r.n, r.lapses, r.exposures, r.rung, r.relearning], [s.n, s.lapses, s.exposures, s.rung, s.relearning], `contadores ${r.i}`);
  }
});

test('encendido, usuario nuevo por la ruta vieja: migra en línea, aplica online y el v1 no cambia', async () => {
  const words = await enWords(4, 10);
  const control = await h.learner();
  await oldReview(control, words, [true, false, true, true]);
  await h.setEnabled(true);
  try {
    const user = await h.learner();
    const { session, r } = await oldReview(user, words, [true, false, true, true]);
    assert.equal(r.duplicate, false);
    const head = await h.one('select * from public.srs_user_head where user_id = $1', [user]);
    assert.ok(head.v2_since);
    assert.equal(head.time_zone, TZ);
    assert.equal(Number(head.last_seq), 1);
    const applied = await h.one('select * from public.srs_applied_sessions where session_id = $1', [session]);
    assert.equal(applied.origin, 'online');
    assert.equal(applied.source, 'srs_review');
    assert.equal(applied.units_attended, 4);
    const units = await h.all('select * from public.user_srs_state where user_id = $1 order by concept_id', [user]);
    assert.equal(units.length, 4);
    // Repaso de la app vieja: escalón desconocido → acierto como R (κ 0,25), error como objetivo (ψ 1).
    const failed = units.find((u) => u.concept_id === words[1]);
    assert.equal(failed.relearning, true);
    assert.equal(Number(failed.stability), 0.2);
    const ok = units.find((u) => u.concept_id === words[0]);
    assert.equal(Number(ok.stability), Number((0.2 * Math.pow(3, 0.25)).toFixed(4)));
    assert.ok(units.every((u) => u.due_effective_at.getTime() === u.due_at.getTime() && u.migration_source === null));
    // El v1 da exactamente lo mismo que sin v2.
    const v1 = async (u) => (await h.all(`select word_id, stage, seen_count, correct_count, incorrect_count, last_result
                                          from public.user_word_progress where user_id = $1 order by word_id`, [u]));
    assert.deepEqual(await v1(user), await v1(control));
    // Primer día: el corte no se mide (evaluated_on = hoy, sin filas de deuda).
    const debt = await h.one('select * from public.srs_user_debt_state where user_id = $1', [user]);
    assert.equal(debt.init_source, 'new');
    assert.equal(debt.measured_days, 0);
    assert.equal((await h.one('select count(*)::int n from public.srs_user_debt_days where user_id = $1', [user])).n, 0);
    assert.deepEqual(await h.all('select * from public.srs_v2_recompute_check($1)', [user]), []);
  } finally {
    await h.setEnabled(false);
  }
});

test('ruta corregida (fase 2): observaciones del servidor por item_concepts, escalón del ítem y resultado por unidad', async () => {
  await h.setEnabled(true);
  try {
    const lesson = await h.lessonWith('translation_choice', 'translate_write');
    const user = await h.learner(lesson);
    const session = randomUUID();
    await h.startLesson(user, session, lesson);
    const snaps = await h.snapshotsOf(user, session);
    const wrongIdx = snaps.findIndex((s) => s.grading_mode_id === 'normalized_text.v1');
    const attempts = answerAll(snaps).map((a, i) => (i === wrongIdx ? { ...a, answer: wrongAnswer(snaps[i]) } : a));
    const r = await h.submitLesson(user, session, lesson, attempts);
    assert.equal(r.duplicate, false);
    const applied = await h.one('select * from public.srs_applied_sessions where session_id = $1', [session]);
    assert.equal(applied.origin, 'online');
    assert.equal(applied.source, 'lesson');
    const obs = await h.all('select * from public.srs_v2_observations($1)', [session]);
    const expected = await h.all(
      `select distinct ic.concept_id, ic.dimension from public.exercise_attempt_gradings g
       join public.item_concepts ic on ic.item_id = g.item_id and ic.role = 'target'
       where g.session_id = $1 and g.attempt_no = 1 and g.status = 'valid' order by 1, 2`, [session]);
    const got = [...new Set(obs.map((o) => `${o.concept_id}|${o.dimension}`))].sort();
    assert.ok(got.length > 0 && got.length <= expected.length);
    assert.ok(obs.every((o) => [-2, -1, 0, 1].includes(o.r)));
    const units = await h.all('select * from public.user_srs_state where user_id = $1', [user]);
    assert.equal(units.length, got.length);
    // El ítem fallado deja sus unidades (culpa 1/n_t) con dificultad por encima de la inicial.
    const failedItem = snaps[wrongIdx].item_id;
    const failedUnits = obs.filter((o) => o.item_id === failedItem);
    assert.ok(failedUnits.length > 0);
    for (const f of failedUnits) {
      const u = units.find((x) => x.concept_id === f.concept_id && x.dimension === f.dimension);
      assert.ok(Number(u.difficulty) > 5.1618, `${f.concept_id}`);
    }
    const result = await h.service(() => h.call('srs_v2_session_result', [user, session]));
    assert.equal(Number(result.srs_seq), 1);
    assert.equal(result.units.length, units.length);
  } finally {
    await h.setEnabled(false);
  }
});

test('idempotencia: reenvío y segunda aplicación no cambian nada; un envío que falla no deja rastro', async () => {
  await h.setEnabled(true);
  try {
    const user = await h.learner();
    const words = await enWords(2, 30);
    const { session } = await oldReview(user, words);
    const before = await h.all('select concept_id, exposures, n, due_at from public.user_srs_state where user_id = $1 order by 1', [user]);
    const again = await h.submitOld(user, session, 'review', null,
      words.map((w) => ({ word_id: w, answer: 'x', correct: true, first_try: true, response_ms: 1500 })));
    assert.equal(again.duplicate, true);
    await db.query('begin');
    let dup;
    try {
      await h.call('srs_user_lock', [user, TZ]);
      dup = await h.call('srs_v2_apply_session', [session, 'online', TZ]);
    } finally {
      await db.query('commit');
    }
    assert.equal(dup.duplicate, true);
    assert.deepEqual(await h.all('select concept_id, exposures, n, due_at from public.user_srs_state where user_id = $1 order by 1', [user]), before);
    assert.equal(Number((await h.one('select last_seq from public.srs_user_head where user_id = $1', [user])).last_seq), 1);

    // Sin energía: la lección se rechaza y no queda ni sesión aplicada ni seq consumido (K5).
    const lesson = await h.lessonWith('translate_write');
    await db.query(`update public.user_lesson_progress set times_completed = 1 where user_id = $1`, [user]);
    await db.query(`insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy, first_completed_at, last_completed_at)
                    values ($1, $2, 1, 0.5, 0.5, now(), now()) on conflict do nothing`, [user, lesson]);
    await db.query(`insert into public.user_energy (user_id, units, anchor_at) values ($1, 0, now())
                    on conflict (user_id) do update set units = 0, anchor_at = now()`, [user]);
    const failed = await oldLesson(user, lesson).catch((e) => e);
    assert.match(String(failed.message ?? failed), /no_energy/);
    assert.equal(Number((await h.one('select last_seq from public.srs_user_head where user_id = $1', [user])).last_seq), 1);
    assert.equal((await h.one('select count(*)::int n from public.srs_applied_sessions where user_id = $1', [user])).n, 1);
  } finally {
    await h.setEnabled(false);
  }
});

test('migración (15.3): replay en orden canónico, verificación contra v1, conversión, corte y AL19 inicial', async () => {
  const user = await h.learner();
  const words = await enWords(6, 50);
  // Historial con el v2 apagado: dos repasos y uno con un error.
  await oldReview(user, words.slice(0, 3));
  const s2 = await oldReview(user, words.slice(2, 5), [false, true, true]);
  // Mismo completed_at para dos sesiones: el orden canónico desempata por session_id. La fila de v1
  // se ajusta a esa hora para que la sesión siga verificándose.
  const s3 = await oldReview(user, [words[5]]);
  await db.query('update public.learning_sessions set completed_at = (select completed_at from public.learning_sessions where id = $1) where id = $2', [s2.session, s3.session]);
  await db.query(`update public.user_word_progress set last_reviewed_at = (select completed_at from public.learning_sessions where id = $3),
                    next_review_at = (select completed_at from public.learning_sessions where id = $3) + interval '1 day'
                  where user_id = $1 and word_id = $2`, [user, words[5], s2.session]);
  // Una fila de v1 manipulada no puede verificarse: se convierte.
  await db.query(`update public.user_word_progress set stage = 2 where user_id = $1 and word_id = $2`, [user, words[0]]);

  await h.setEnabled(true);
  try {
    const { session: online } = await oldReview(user, [words[1]]);
    const applied = await h.all('select session_id, seq, origin, t_srs from public.srs_applied_sessions where user_id = $1 order by seq', [user]);
    assert.deepEqual(applied.map((a) => a.origin), ['replay', 'replay', 'replay', 'online']);
    const canon = await h.all(`select id from public.learning_sessions where user_id = $1 and id <> $2 order by completed_at, id`, [user, online]);
    assert.deepEqual(applied.slice(0, 3).map((a) => a.session_id), canon.map((c) => c.id));
    for (let i = 1; i < applied.length; i++) assert.ok(applied[i].t_srs >= applied[i - 1].t_srs);
    const cut = await h.one('select * from public.srs_migration_cutoff where user_id = $1', [user]);
    assert.equal(cut.sessions, 3);
    assert.equal(cut.converted_units, 1);
    assert.equal(cut.verified_units, 5);
    const conv = await h.one('select * from public.user_srs_state where user_id = $1 and concept_id = $2', [user, words[0]]);
    assert.equal(conv.migration_source, 'converted');
    assert.equal(conv.migration_reason, 'v1_mismatch');
    assert.equal(Number(conv.stability), Number((await h.one('select public.srs_v2_conversion_stability(2, 45)::numeric(10,4) v')).v));
    const rep = await h.all(`select migration_source from public.user_srs_state where user_id = $1 and concept_id <> $2`, [user, words[0]]);
    assert.ok(rep.every((r) => r.migration_source === 'replay'));
    // AL19 se inicializa en el corte: inactivo, 45, sin filas; la sesión online del mismo día no evalúa.
    const debt = await h.one('select * from public.srs_user_debt_state where user_id = $1', [user]);
    assert.deepEqual([debt.init_source, debt.al19_active, debt.imax_effective, debt.measured_days], ['migration', false, 45, 0]);
    assert.equal((await h.one('select count(*)::int n from public.srs_user_debt_days where user_id = $1', [user])).n, 0);
    assert.equal((await h.one('select imax from public.srs_applied_sessions where session_id = $1', [online])).imax, 45);
    // Determinismo: recalcular por seq con el t_srs guardado da lo guardado (las convertidas, aparte).
    assert.deepEqual(await h.all('select * from public.srs_v2_recompute_check($1)', [user]), []);
    assert.equal(await h.service(() => h.call('srs_v2_repair_sweep', [])), 0);
    // Repetir la migración no hace nada.
    assert.deepEqual(await h.service(() => h.call('srs_v2_migrate_user', [user, TZ])), { already_migrated: true });
  } finally {
    await h.setEnabled(false);
  }
});

test('migración: más de 5 % de intentos irrecuperables → el usuario se convierte entero', async () => {
  const user = await h.learner();
  const words = await enWords(2, 80);
  await oldReview(user, words);
  // Intentos sin ejercicio ni palabra (lección cuyo ejercicio se borró): categoría C.
  const s = randomUUID();
  await db.query(`insert into public.learning_sessions (id, user_id, kind, lesson_id, started_at, duration_seconds,
                    total_answers, first_try_total, first_try_correct, local_date)
                  values ($1, $2, 'lesson', 'a1-u01-l01', now() - interval '5 minutes', 300, 2, 2, 2, current_date)`, [s, user]);
  await db.query(`insert into public.exercise_attempts (session_id, user_id, exercise_id, word_id, skill, answer, is_correct, is_first_try, response_ms)
                  values ($1, $2, null, null, 'vocabulary', 'x', true, true, 1000), ($1, $2, null, null, 'vocabulary', 'x', true, true, 1000)`, [s, user]);
  await h.setEnabled(true);
  try {
    const r = await h.service(() => h.call('srs_v2_migrate_user', [user, TZ]));
    assert.equal(r.converted, 2);
    assert.ok(Number(r.category_c_ratio) > 0.05);
    const u = await h.all('select migration_reason from public.user_srs_state where user_id = $1', [user]);
    assert.deepEqual(u.map((x) => x.migration_reason), ['user_category_c', 'user_category_c']);
  } finally {
    await h.setEnabled(false);
  }
});

test('AL19 en la base: entra exactamente el 15.º día de estudio medido y coincide con la réplica TS', async () => {
  await h.setEnabled(true);
  try {
    const user = await h.learner();
    await oldReview(user, (await enWords(1, 120)));
    // Conceptos que el alumno todavía no tiene (los nuevos de content/ desplazan cualquier ventana por id).
    const concepts = (await h.all(`select id from public.concepts where language_code = 'en' and kind = 'lexical'
                                      and id not in (select concept_id from public.user_srs_state where user_id = $1)
                                    order by id limit 120 offset 200`, [user])).map((c) => c.id);
    // 120 unidades vencidas hace un mes (deuda 120 × 1,65 = 198 > B 75 todos los días).
    await db.query(`insert into public.user_srs_state (user_id, concept_id, dimension, language_code, algorithm_version, weights_version,
                      stability, difficulty, n, lapses, t_last, last_seen_at, due_at, due_effective_at, exposures, rung)
                    select $1, c, 'vocabulary', 'en', 'srs-2.0.0', 'srs-2.0.0-w-initial', 3, 5, 1, 0,
                           now() - interval '40 days', now() - interval '40 days', now() - interval '30 days', now() - interval '30 days', 1, 'G'
                    from unnest($2::text[]) c`, [user, concepts]);
    const base = (await h.one('select evaluated_on from public.srs_user_debt_state where user_id = $1', [user])).evaluated_on;
    const days = [];
    let enteredOn = null;
    for (let k = 1; k <= 16; k++) {
      const d = new Date(base.getTime() + k * DAY).toISOString().slice(0, 10);
      days.push(d);
      const st = await h.one('select * from public.srs_v2_al19_evaluate($1, $2, $3, $4, $5, $6)', [user, 'en', d, TZ, new Date().toISOString(), null]);
      if (st.al19_active && !enteredOn) enteredOn = k;
    }
    assert.equal(enteredOn, 15);
    const rows = await h.all('select * from public.srs_user_debt_days where user_id = $1 order by study_date', [user]);
    assert.equal(rows.length, 16);
    // Reconstrucción con la réplica TS desde el estado inicial y las medidas guardadas.
    const ts = al19Rebuild(initialDebtState(new Date(base).toISOString().slice(0, 10)), rows.map((r) => ({
      studyDate: new Date(r.study_date).toISOString().slice(0, 10), B: r.budget, ipu: Number(r.ipu),
      pendUnits: r.pend_units, debtPrevUnits: r.debt_prev_units, load45: r.load45 === null ? null : Number(r.load45),
    })));
    const stored = await h.one('select * from public.srs_user_debt_state where user_id = $1', [user]);
    assert.deepEqual([ts.state.active, ts.state.imaxEffective, ts.state.entries, ts.state.enterStreak, ts.state.measuredDays],
      [stored.al19_active, stored.imax_effective, stored.entries, stored.enter_streak, stored.measured_days]);
    assert.deepEqual(rows.map((r) => r.al19_active), ts.rows.map((r) => r.al19Active));
    // Mientras rige, las actualizaciones informativas usan I_max 90 (S_max 55).
    assert.equal(stored.imax_effective, 90);
    assert.ok(Math.abs(90 / TAU - 54.96) < 0.01);
    // Un día ya evaluado no se vuelve a evaluar.
    const again = await h.one('select * from public.srs_v2_al19_evaluate($1, $2, $3, $4, $5, $6)', [user, 'en', days[15], TZ, new Date().toISOString(), null]);
    assert.equal(again.measured_days, 16);
  } finally {
    await h.setEnabled(false);
  }
});

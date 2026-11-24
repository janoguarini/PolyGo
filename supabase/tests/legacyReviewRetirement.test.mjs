// Retirada de la ruta antigua de repasos (migración 20261112120000_retire_legacy_review_route.sql) en
// PGlite: la app (rol authenticated) ya no puede guardar un repaso con su propio veredicto por
// submit_learning_session; las lecciones y los flujos internos del servidor (service_role) siguen igual.
// Los roles se simulan con `set role`, como PostgREST (harness.mjs).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createDb, as } from './harness.mjs';
import { helpers, answerAll, rightAnswer, wrongAnswer, TZ, j } from './learningHelpers.mjs';
import { buildBasicPlan } from '../../shared/focusReview.ts';
import {
  gradeRecordedAttempts,
  gradeReviewAnswer,
  LEARNING_CONTRACT,
  LEARNING_GRADER,
  reviewPresentationOrders,
} from '../../shared/learningSession.ts';

const MIGRATION = '20261112120000_retire_legacy_review_route.sql';
const SIG = 'public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text)';

let db;
let h;
let lesson;

before(async () => {
  db = await createDb();
  h = helpers(db);
  await h.setEnabled(false);
  lesson = await h.lessonWith('translation_choice');
});

const count = async (sql, params) => (await h.one(`select count(*)::int n from ${sql}`, params)).n;

/** Todo lo que un envío puede tocar de una cuenta (hechos, SRS v1, recompensas, energía, v2). */
const footprint = (user) =>
  h.one(
    `select
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.learning_sessions t where user_id = $1) sessions,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.exercise_attempts t where user_id = $1) attempts,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.user_word_progress t where user_id = $1) srs_v1,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.user_lesson_progress t where user_id = $1) lessons,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.user_daily_activity t where user_id = $1) streak,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.user_energy t where user_id = $1) energy,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.user_achievements t where user_id = $1) achievements,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.profiles t where id = $1) profile,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.srs_user_head t where user_id = $1) srs_v2_head,
      (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.user_srs_state t where user_id = $1) srs_v2_state`,
    [user],
  );

const ranked = () =>
  h.one(`select
    (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.battles t) b,
    (select md5(coalesce(string_agg(t::text, ',' order by t::text), '')) from public.player_ratings t) r`);

const oldReviewAttempts = (words) =>
  words.map((w) => ({ word_id: w, answer: 'x', correct: true, first_try: true, response_ms: 900 }));

const oldLessonAttempts = async (lessonId) =>
  (
    await h.all(
      `select id from public.exercises where lesson_id = $1 and is_published order by position, id`,
      [lessonId],
    )
  ).map((e) => ({
    exercise_id: e.id,
    answer: 'x',
    correct: true,
    first_try: true,
    response_ms: 900,
  }));

const legacyAs = (role, user, session, kind, lessonId, attempts) =>
  as(db, role, user, () =>
    h.call('submit_learning_session', [
      session,
      kind,
      lessonId,
      new Date(Date.now() - 60000).toISOString(),
      j(attempts),
      TZ,
    ]),
  );

/** Alumno con una lección corregida hecha y sus palabras vencidas en el v1. */
async function studied() {
  const user = await h.learner(lesson);
  const s = randomUUID();
  await h.startLesson(user, s, lesson);
  await h.submitLesson(
    user,
    s,
    lesson,
    answerAll(await h.snapshotsOf(user, s)),
    new Date(Date.now() - 5 * 60000),
  );
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

const wordsOf = async (user) =>
  (
    await h.all(
      'select word_id from public.user_word_progress where user_id = $1 order by word_id',
      [user],
    )
  ).map((w) => w.word_id);

test('1 y 6: authenticated no puede guardar un repaso por submit_learning_session, y el rechazo no toca nada', async () => {
  const user = await studied();
  const words = (await wordsOf(user)).slice(0, 2);
  const beforeUser = await footprint(user);
  const beforeRanked = await ranked();
  const session = randomUUID();

  let err;
  try {
    await legacyAs('authenticated', user, session, 'review', null, oldReviewAttempts(words));
  } catch (e) {
    err = e;
  }
  assert.ok(err, 'rechazado');
  assert.equal(err.message, 'legacy_review_retired', 'error identificable');
  assert.equal(err.code, '42501', 'SQLSTATE insufficient_privilege (PostgREST → 403)');

  // También con p_lesson_id vacío (lo que manda la app vieja) y con el v2 encendido: el rechazo va
  // antes del bloqueo del usuario y de cualquier escritura.
  await assert.rejects(
    legacyAs('authenticated', user, randomUUID(), 'review', '', oldReviewAttempts(words)),
    /legacy_review_retired/,
  );
  await h.setEnabled(true);
  try {
    await assert.rejects(
      legacyAs('authenticated', user, randomUUID(), 'review', null, oldReviewAttempts(words)),
      /legacy_review_retired/,
    );
  } finally {
    await h.setEnabled(false);
  }

  assert.deepEqual(
    await footprint(user),
    beforeUser,
    'sesiones, intentos, v1, lecciones, racha, energía, logros y v2 iguales',
  );
  assert.deepEqual(await ranked(), beforeRanked, 'Ranked igual');
  assert.equal(await count('public.learning_sessions where id = $1', [session]), 0);
  // anon nunca tuvo permiso: sigue rechazado (por permisos, antes de entrar).
  await assert.rejects(
    legacyAs('anon', user, randomUUID(), 'review', null, oldReviewAttempts(words)),
    /permission denied/,
  );
});

test('1: un repaso viejo ya guardado y reenviado por la app recibe el rechazo, no duplicate (sin cambios)', async () => {
  const user = await studied();
  const words = (await wordsOf(user)).slice(0, 1);
  const session = randomUUID();
  // Guardado antes de la retirada (simulado con el rol de servicio, que sigue pudiendo).
  const first = await legacyAs(
    'service_role',
    user,
    session,
    'review',
    null,
    oldReviewAttempts(words),
  );
  assert.equal(first.duplicate, false);
  const before = await footprint(user);
  await assert.rejects(
    legacyAs('authenticated', user, session, 'review', null, oldReviewAttempts(words)),
    /legacy_review_retired/,
  );
  assert.deepEqual(await footprint(user), before);
});

test('2: authenticated sigue guardando lecciones por la ruta vieja, con el mismo contrato', async () => {
  const user = await h.learner(lesson); // con la lección desbloqueada
  const attempts = await oldLessonAttempts(lesson);
  const session = randomUUID();
  const r = await legacyAs('authenticated', user, session, 'lesson', lesson, attempts);
  assert.equal(r.session_id, session);
  assert.equal(r.duplicate, false);
  assert.equal(r.first_try_total, attempts.length);
  assert.equal(typeof r.energy_left, 'number', 'consume energía como siempre');
  assert.ok(Array.isArray(r.achievements_unlocked));
  assert.equal(
    await count('public.learning_sessions where id = $1 and kind = $2', [session, 'lesson']),
    1,
  );
  assert.equal(
    await count('public.user_lesson_progress where user_id = $1 and lesson_id = $2', [
      user,
      lesson,
    ]),
    1,
  );
  assert.ok(
    (await count('public.user_word_progress where user_id = $1', [user])) > 0,
    'SRS v1 actualizado',
  );
  assert.ok((await count('public.user_daily_activity where user_id = $1', [user])) > 0, 'racha');
  // Reenvío idempotente.
  const dup = await legacyAs('authenticated', user, session, 'lesson', lesson, attempts);
  assert.equal(dup.duplicate, true);
  // Las reglas de siempre siguen: una lección inexistente se rechaza con su código de siempre.
  await assert.rejects(
    legacyAs('authenticated', user, randomUUID(), 'lesson', 'no-existe', attempts),
    /lesson_not_found/,
  );
});

test('2: con el SRS v2 encendido la lección vieja sigue pasando por el envoltorio (bloqueo + aplicación)', async () => {
  await h.setEnabled(true);
  try {
    const user = await h.learner(lesson);
    const r = await legacyAs(
      'authenticated',
      user,
      randomUUID(),
      'lesson',
      lesson,
      await oldLessonAttempts(lesson),
    );
    assert.equal(r.duplicate, false);
    assert.equal(
      await count('public.srs_user_head where user_id = $1', [user]),
      1,
      'el v2 vio la sesión',
    );
  } finally {
    await h.setEnabled(false);
  }
});

test('3: service_role conserva la ruta interna de repasos y sus permisos', async () => {
  const user = await studied();
  const words = (await wordsOf(user)).slice(0, 2);
  const before = await h.all(
    'select word_id, seen_count from public.user_word_progress where user_id = $1 and word_id = any($2::text[]) order by 1',
    [user, words],
  );
  const session = randomUUID();
  const r = await legacyAs('service_role', user, session, 'review', null, oldReviewAttempts(words));
  assert.equal(r.duplicate, false);
  const after = await h.all(
    'select word_id, seen_count from public.user_word_progress where user_id = $1 and word_id = any($2::text[]) order by 1',
    [user, words],
  );
  assert.deepEqual(
    after.map((x) => x.seen_count),
    before.map((x) => x.seen_count + 1),
    'el cuerpo v1 de repasos sigue funcionando para el servidor',
  );
  // service_role también puede las lecciones.
  const lr = await legacyAs(
    'service_role',
    user,
    randomUUID(),
    'lesson',
    lesson,
    await oldLessonAttempts(lesson),
  );
  assert.equal(lr.duplicate, false);
  // Conexión directa como dueño (migraciones, SQL editor): rol de sesión `none`, no se rechaza.
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [user]);
  try {
    const direct = await h.call('submit_learning_session', [
      randomUUID(),
      'review',
      null,
      new Date(Date.now() - 60000).toISOString(),
      j(oldReviewAttempts(words.slice(0, 1))),
      TZ,
    ]);
    assert.equal(direct.duplicate, false);
  } finally {
    await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
  }
});

test('4: learning_submit_graded (lecciones de la Edge Function) sigue funcionando', async () => {
  // Fija claims con role=authenticated a propósito; el rol de sesión es service_role.
  const user = await h.learner(lesson);
  const s = randomUUID();
  await h.startLesson(user, s, lesson);
  const snaps = await h.snapshotsOf(user, s);
  const r = await h.submitLesson(
    user,
    s,
    lesson,
    answerAll(snaps, (x) => (x.position === 1 ? wrongAnswer(x) : rightAnswer(x))),
  );
  assert.equal(r.duplicate, false);
  assert.equal(r.first_try_total, snaps.length);
  assert.equal(r.first_try_correct, snaps.length - 1, 'veredicto del servidor');
  assert.equal(
    await count('public.exercise_attempt_gradings where session_id = $1', [s]),
    snaps.length,
  );
  assert.equal(
    await count('public.user_lesson_progress where user_id = $1 and lesson_id = $2', [
      user,
      lesson,
    ]),
    1,
  );
  const dup = await h.submitLesson(user, s, lesson, answerAll(snaps));
  assert.equal(dup.duplicate, true);
});

// La Edge Function: start_review (básico, v2 apagado) / answer_review / submit_review.
const startBasic = (user, session) =>
  h.service(async () => {
    const state = await h.call('learning_review_prepare', [user, session, TZ]);
    if (state.session === 'open')
      return { state, items: await h.call('learning_review_content', [user, session]) };
    const cand = await h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]);
    const plan = buildBasicPlan({ ...cand, seed: session });
    await h.call('learning_start_basic_review', [
      user,
      session,
      'en',
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]);
    return { state, plan, items: await h.call('learning_review_content', [user, session]) };
  });
const answerReview = (user, session, attempt) =>
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
const submitReview = (user, session, attempts) =>
  h.service(async () => {
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    return h.call('record_learning_session', [
      user,
      session,
      new Date(Date.now() - 60000).toISOString(),
      TZ,
      j(gradeRecordedAttempts(snaps, attempts, words)),
      j(LEARNING_GRADER),
      j({ contract: LEARNING_CONTRACT, app_version: '0.2.0', platform: 'android' }),
    ]);
  });

test('5: start_review, answer_review y submit_review siguen funcionando', async () => {
  const user = await studied();
  const session = randomUUID();
  const started = await startBasic(user, session);
  assert.ok(started.plan.items.length > 0, 'hay repaso');
  assert.ok(started.items.every((i) => i.answered === null));
  const snaps = await h.snapshotsOf(user, session);
  const make = (s) => (s.position === 1 ? wrongAnswer(s) : rightAnswer(s));
  const attempts = answerAll(snaps, make);
  const a1 = await answerReview(user, session, attempts[0]);
  assert.equal(a1.verdict, 'incorrect', 'corrige el servidor');
  assert.equal((await answerReview(user, session, attempts[0])).duplicate, true);
  const resumed = await startBasic(user, session);
  assert.equal(resumed.state.session, 'open');
  const res = await submitReview(user, session, attempts);
  assert.equal(res.duplicate, false);
  assert.equal(res.route, 'record_learning_session');
  assert.equal(res.first_try_correct, snaps.length - 1);
  assert.equal((await submitReview(user, session, attempts)).duplicate, true);
  // learning_route_usage: lo nuevo sigue contándose como record_learning_session.
  const usage = await h.service(() =>
    h.call('learning_route_usage', [new Date(Date.now() - 600000).toISOString()]),
  );
  assert.ok(usage.routes.some((x) => x.route === 'record_learning_session'));
});

test('firmas, permisos, seguridad y alcance de la migración (sólo cambia el envoltorio)', async () => {
  const fn = await h.one(
    `select p.prosecdef, p.proconfig, pg_get_function_identity_arguments(p.oid) args,
            pg_get_function_result(p.oid) res, r.rolname owner,
            has_function_privilege('authenticated', p.oid, 'execute') auth,
            has_function_privilege('service_role', p.oid, 'execute') svc,
            has_function_privilege('anon', p.oid, 'execute') anon
     from pg_proc p join pg_roles r on r.oid = p.proowner where p.oid = '${SIG}'::regprocedure`,
  );
  assert.equal(fn.prosecdef, true);
  assert.deepEqual(fn.proconfig, ['search_path=""']);
  assert.equal(
    fn.args,
    'p_session_id uuid, p_kind text, p_lesson_id text, p_started_at timestamp with time zone, p_attempts jsonb, p_time_zone text',
  );
  assert.equal(fn.res, 'jsonb');
  assert.deepEqual([fn.auth, fn.svc, fn.anon], [true, true, false], 'EXECUTE no revocado');
  const internal = await h.all(
    `select p.proname, p.prosecdef, has_function_privilege('authenticated', p.oid, 'execute') auth,
            has_function_privilege('service_role', p.oid, 'execute') svc
     from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname in
       ('submit_learning_session_v1', 'learning_submit_graded', 'learning_submit_review_graded', 'record_learning_session')
     order by 1`,
  );
  assert.deepEqual(
    internal.map((f) => [f.proname, f.prosecdef, f.auth, f.svc]),
    [
      ['learning_submit_graded', true, false, true],
      ['learning_submit_review_graded', true, false, true],
      ['record_learning_session', true, false, true],
      ['submit_learning_session_v1', true, false, true],
    ],
  );
  assert.match(
    (
      await h.one(
        `select obj_description('public.learning_submit_review_graded(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb)'::regprocedure, 'pg_proc') d`,
      )
    ).d,
    /OBSOLETA/,
  );

  // Alcance: la misma base sin esta migración difiere SÓLO en el cuerpo del envoltorio y el comentario.
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  // Después sólo vienen las de la fase C (docs/LEARNING_PHASE_C.md, incluida la C.3), que no cambian
  // funciones, columnas, permisos ni RLS: la base sin esta migración sigue difiriendo sólo en el envoltorio.
  assert.deepEqual(files.slice(files.indexOf(MIGRATION) + 1), [
    '20261113120000_context_comprehension.sql',
    '20261113120100_comprehension_en_a1.sql',
    '20261113120200_comprehension_en_a1_u13_u14.sql',
    '20261113120300_planned_lessons_en_a1_u13_u14.sql',
    '20261114120000_curriculum_routes.sql',
    // C.5: compatibilidad de clientes (agrega funciones y políticas de lectura; no toca las de repaso).
    '20261115120000_client_compatibility.sql',
    // C.6: políticas restrictivas de lectura del vocabulario por ruta (no toca las de repaso).
    '20261116120000_route_vocabulary_access.sql',
    // C.7: filtro curricular en candidatos de repaso, Ranked y Mastery (no toca las funciones de envío
    // que cambia esta migración; está en ambas bases de la comparación).
    '20261117120000_curriculum_isolation.sql',
    // Cierre del Learning Machine: concurrencia de srs_apply_me_hint y mastery_process_queue_safe (no toca
    // las funciones de envío; está en ambas bases de la comparación).
    '20261118120000_learning_machine_hardening.sql',
    // Cierre de inglés A1: sólo contenido sin publicar (add-only), sin funciones, columnas, permisos ni RLS.
    '20261119120000_a1_en_closure.sql',
    // Inglés A2 completo: sólo contenido sin publicar (add-only), sin funciones, columnas, permisos ni RLS.
    '20261120120000_a2_en_completion.sql',
    // Inglés B1: contenido sin publicar (add-only) y el CHECK de nivel con B1; sin funciones, columnas,
    // permisos ni RLS.
    '20261122120000_b1_en.sql',
    // Inglés B2: contenido sin publicar (add-only) y el CHECK de nivel con B2; sin funciones, columnas,
    // permisos ni RLS.
    '20261124120000_b2_en.sql',
    // Portugués A1 U13–U16 y A2: sólo contenido sin publicar (add-only), sin funciones, columnas,
    // permisos ni RLS.
    '20261126120000_pt_a1_a2.sql',
    // Italiano A1 U13–U16 y A2: sólo contenido sin publicar (add-only), sin funciones, columnas,
    // permisos ni RLS.
    '20261128120000_it_a1_a2.sql',
    // Chino A1 U13–U16 y A2: sólo contenido sin publicar (add-only), sin funciones, columnas,
    // permisos ni RLS.
    '20261130120000_zh_a1_a2.sql',
    // Francés A1 y A2: sólo contenido sin publicar (add-only), sin funciones, columnas, permisos ni RLS.
    '20261202120000_fr_a1_a2.sql',
    '20261204120000_es_a1_a2.sql',
  ]);
  const prev = await createDb({ files: files.filter((f) => f !== MIGRATION) });
  const catalog = `select p.oid::regprocedure::text sig, md5(p.prosrc) src, p.proacl::text acl, p.prosecdef sd,
                          p.proconfig::text cfg, obj_description(p.oid, 'pg_proc') cmt
                   from pg_proc p where p.pronamespace = 'public'::regnamespace order by 1`;
  const tables = `select c.relname, md5(string_agg(a.attname || ':' || format_type(a.atttypid, a.atttypmod), ',' order by a.attnum)) cols,
                         c.relacl::text acl, c.relrowsecurity rls
                  from pg_class c join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
                  where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v', 'm') group by c.oid order by 1`;
  const [a, b] = [(await prev.query(catalog)).rows, (await db.query(catalog)).rows];
  assert.equal(a.length, b.length, 'mismas funciones');
  const changed = b.filter((x, i) => JSON.stringify(x) !== JSON.stringify(a[i])).map((x) => x.sig);
  assert.deepEqual(changed.sort(), [
    'learning_submit_review_graded(uuid,uuid,timestamp with time zone,text,jsonb,jsonb,jsonb)',
    'submit_learning_session(uuid,text,text,timestamp with time zone,jsonb,text)',
  ]);
  const sigA = a.find((x) => x.sig.startsWith('submit_learning_session('));
  const sigB = b.find((x) => x.sig.startsWith('submit_learning_session('));
  assert.equal(sigB.acl, sigA.acl, 'misma ACL');
  assert.equal(sigB.sd, sigA.sd);
  assert.equal(sigB.cfg, sigA.cfg);
  assert.deepEqual(
    (await db.query(tables)).rows,
    (await prev.query(tables)).rows,
    'tablas y permisos iguales',
  );
  // El cuerpo de SRS v1 y las funciones de Ranked no cambian (cubierto arriba; explícito).
  for (const name of ['submit_learning_session_v1', 'apply_word_result']) {
    assert.deepEqual(
      a.filter((x) => x.sig.startsWith(name + '(')),
      b.filter((x) => x.sig.startsWith(name + '(')),
      name,
    );
  }
  await prev.close();
});

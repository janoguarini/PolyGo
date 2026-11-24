// Francés habilitado para todos (docs/FR_A1_A2_INTEGRATION.md), de punta a punta en PGlite: la base
// con todas las migraciones más la publicación y la activación de supabase/pending/. Una cuenta común
// (sin content_testers) se registra en francés, juega lecciones, gana XP, evalúa logros, ve sus
// estadísticas y hace un repaso de francés; una cuenta de inglés no recibe nada del francés.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { helpers, answerAll, rightAnswer, TZ, j } from './learningHelpers.mjs';
import { buildReviewPlan } from '../../shared/adaptivePlanner.ts';
import { buildBasicPlan } from '../../shared/focusReview.ts';
import {
  gradeRecordedAttempts,
  LEARNING_GRADER,
  reviewPresentationOrders,
} from '../../shared/learningSession.ts';

const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');

let db;
let h;
let n = 0;

before(async () => {
  db = await createDb();
  await db.exec(pending('20261203120000_publish_fr_a1_a2.sql'));
  await db.exec(pending('20261203130000_enable_fr.sql'));
  h = helpers(db);
});

async function registered(language, level) {
  n += 1;
  const u = await createUser(db, `fr-avail-${n}@test.dev`);
  await as(db, 'authenticated', u, () =>
    db.query(`select public.complete_onboarding($1, 'bolt', $2, $3, 10::smallint)`, [
      `fr_avail_${n}`,
      language,
      level,
    ]),
  );
  return u;
}

async function playLesson(user, lessonId) {
  const session = randomUUID();
  const started = await h.startLesson(user, session, lessonId);
  const r = await h.submitLesson(
    user,
    session,
    lessonId,
    answerAll(await h.snapshotsOf(user, session)),
  );
  return { started, r };
}

/** Repaso como la Edge Function: con SRS v2 apagado (producción hoy), el básico (v1); si no, el adaptativo. */
async function review(user, lang, v2) {
  return h.service(async () => {
    const session = randomUUID();
    const now = new Date().toISOString();
    const cand = v2
      ? await h.call('learning_review_candidates', [user, lang, TZ, now])
      : await h.call('learning_focus_candidates', [user, lang, now]);
    const plan = v2
      ? buildReviewPlan({ ...cand, seed: session })
      : buildBasicPlan({ ...cand, seed: session });
    if (plan.items.length === 0) return { plan, cand, result: null };
    await h.call(v2 ? 'learning_start_review' : 'learning_start_basic_review', [
      user,
      session,
      lang,
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]);
    const snaps = await h.call('learning_session_presentations', [user, session]);
    const words = await h.call('learning_review_words', [user, session]);
    const gradings = gradeRecordedAttempts(snaps, answerAll(snaps, rightAnswer), words);
    const result = await h.call('record_learning_session', [
      user,
      session,
      new Date(Date.now() - 60000).toISOString(),
      TZ,
      j(gradings),
      j(LEARNING_GRADER),
      j({ contract: 2 }),
    ]);
    return { plan, cand, result };
  });
}

test('la base tiene el francés completo y disponible, sin Ranked', async () => {
  const s = await h.one(
    `select (select content_status from public.languages where code = 'fr') status,
            (select ranked_available from public.languages where code = 'fr') ranked,
            (select count(*)::int from public.curriculum_units where language_code = 'fr' and level = 'A1' and is_published) a1,
            (select count(*)::int from public.curriculum_units where language_code = 'fr' and level = 'A2' and is_published) a2,
            (select count(*)::int from public.lessons l join public.curriculum_units u on u.id = l.unit_id
              where u.language_code = 'fr' and l.is_published) lessons,
            (select count(*)::int from public.words where language_code = 'fr' and is_published) words`,
  );
  assert.deepEqual(s, {
    status: 'available',
    ranked: false,
    a1: 17,
    a2: 13,
    lessons: 300,
    words: 548,
  });
  // Los ids de unidades, lecciones y ejercicios del francés no chocan con otros idiomas.
  const clash = await h.one(
    `select count(*)::int c from public.lessons l join public.curriculum_units u on u.id = l.unit_id
      where (u.language_code = 'fr') <> (l.id like 'fr-%')`,
  );
  assert.equal(clash.c, 0);
});

test('una cuenta común se registra en francés A1 o A2 y juega la primera lección de cada nivel', async () => {
  const a1 = await registered('fr', 'A1');
  const a2 = await registered('fr', 'A2');
  for (const [u, level] of [
    [a1, 'A1'],
    [a2, 'A2'],
  ]) {
    const p = await h.one(
      `select target_language, start_level, (select count(*)::int from public.content_testers t where t.user_id = $1) testers,
              (select count(*)::int from public.player_ratings r where r.user_id = $1 and r.language_code = 'fr') fr_ratings
         from public.profiles where id = $1`,
      [u],
    );
    assert.deepEqual(p, { target_language: 'fr', start_level: level, testers: 0, fr_ratings: 0 });
  }
  const { started, r } = await playLesson(a1, 'fr-a1-u01-l01');
  assert.ok(started.presentations.length > 0);
  assert.equal(r.first_try_correct, r.first_try_total);
  // Progreso: la lección queda completa y abre la siguiente.
  const progress = await h.one(
    `select times_completed from public.user_lesson_progress where user_id = $1 and lesson_id = 'fr-a1-u01-l01'`,
    [a1],
  );
  assert.equal(progress.times_completed, 1);
  assert.equal(
    (await h.one(`select public.is_lesson_unlocked($1, 'fr-a1-u01-l02') ok`, [a1])).ok,
    true,
  );
  assert.equal(
    (await h.one(`select public.is_lesson_unlocked($1, 'fr-a2-u01-l01') ok`, [a2])).ok,
    true,
  );
  await playLesson(a2, 'fr-a2-u01-l01');
});

test('XP, logros y estadísticas funcionan con el francés', async () => {
  const u = await registered('fr', 'A1');
  await playLesson(u, 'fr-a1-u01-l01');
  await playLesson(u, 'fr-a1-u01-l02');
  await as(db, 'authenticated', u, () => db.query('select public.sync_xp()'));
  const xp = await h.one(
    `select coalesce(sum(amount), 0)::int total, count(*) filter (where source like 'lesson%')::int lessons
       from public.xp_events where user_id = $1`,
    [u],
  );
  assert.ok(xp.total > 0, 'las lecciones de francés dan XP');
  assert.ok(xp.lessons >= 2, 'cada lección de francés acredita XP');
  await db.query('select public.evaluate_achievements($1)', [u]);
  const achievements = await as(db, 'authenticated', u, () =>
    db.query('select id from public.get_my_achievements()'),
  );
  assert.ok(achievements.rows.length > 0);
  const stats = await as(db, 'authenticated', u, () =>
    db.query('select public.get_competitive_stats(null) as s'),
  );
  assert.ok(stats.rows[0].s);
});

/** Como si hubiera pasado un día: lo aprendido vence en SRS v1 y v2, y el día de la lección no gasta el cupo. */
async function ageProgress(user) {
  await db.query(
    `update public.user_word_progress set last_reviewed_at = now() - interval '1 day',
       next_review_at = now() - interval '1 hour' where user_id = $1`,
    [user],
  );
  await db.query(
    `update public.user_srs_state set t_last = now() - interval '1 day', last_seen_at = now() - interval '1 day',
       due_at = now() - interval '1 hour', due_effective_at = now() - interval '1 hour' where user_id = $1`,
    [user],
  );
  await db.query(
    `update public.learning_sessions set local_date = local_date - 1 where user_id = $1`,
    [user],
  );
}

const languagesOf = async (plan) =>
  (
    await h.all(
      `select distinct i.language_code from public.exercise_items i where i.id = any($1) order by 1`,
      [plan.items.map((x) => x.item_id)],
    )
  ).map((r) => r.language_code);

for (const v2 of [false, true]) {
  test(`repasos de francés con SRS v2 ${v2 ? 'encendido' : 'apagado (producción)'}: la sesión es solo de francés`, async () => {
    await h.setEnabled(v2);
    try {
      const u = await registered('fr', 'A1');
      await playLesson(u, 'fr-a1-u01-l01');
      await playLesson(u, 'fr-a1-u01-l02');
      await ageProgress(u);
      const { plan, result } = await review(u, 'fr', v2);
      assert.ok(plan.items.length > 0, 'hay repaso de francés');
      assert.ok(result, 'el repaso se registra');
      assert.deepEqual(await languagesOf(plan), ['fr']);
    } finally {
      await h.setEnabled(false);
    }
  });
}

test('una cuenta de inglés no recibe nada del francés en su repaso', async () => {
  const en = await registered('en', 'A1');
  await playLesson(en, 'a1-u01-l01');
  await playLesson(en, 'a1-u01-l02');
  await ageProgress(en);
  const { plan } = await review(en, 'en', false);
  assert.ok(plan.items.length > 0);
  assert.deepEqual(await languagesOf(plan), ['en']);
});

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { MISSION_IDS } from '../../shared/missions.ts';

let db;
let lessonId;

before(async () => {
  db = await createDb();
  lessonId = (await db.query(`select id from public.lessons order by id limit 1`)).rows[0].id;
});

const TZ = 'UTC';
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const today = async () => (await one(`select (now() at time zone 'UTC')::date::text as d`)).d;
const daysAgo = async (n) =>
  (await one(`select ((now() at time zone 'UTC')::date - $1::int)::text as d`, [n])).d;

async function player(email) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, email.split('@')[0]],
  );
  return id;
}

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]?.r);
const missions = (u) => rpc(u, 'select public.get_daily_missions($1) as r', [TZ]);
const claim = (u) => rpc(u, 'select public.claim_mission_reward($1) as r', [TZ]);
const summary = (u) => rpc(u, 'select public.get_learning_summary($1) as r', [TZ]);

/** Un día de estudio (como lo deja submit_learning_session). */
const study = (u, day, seconds = 300, correct = 10) =>
  db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
     values ($1, $2, 1, $4, $4, $3)
     on conflict (user_id, activity_date) do update set
       seconds_spent = public.user_daily_activity.seconds_spent + excluded.seconds_spent,
       correct_answers = public.user_daily_activity.correct_answers + excluded.correct_answers`,
    [u, day, seconds, correct],
  );

const lessonSession = (u, day, firstCorrect, firstTotal) =>
  db.query(
    `insert into public.learning_sessions (id, user_id, kind, lesson_id, started_at, duration_seconds,
       total_answers, first_try_total, first_try_correct, local_date)
     values (gen_random_uuid(), $1, 'lesson', $2, now(), 60, $4, $4, $3, $5)`,
    [u, lessonId, firstCorrect, firstTotal, day],
  );

const setFreezes = (u, n) =>
  db.query(
    `insert into public.user_streak_freezes (user_id, available) values ($1, $2)
     on conflict (user_id) do update set available = excluded.available`,
    [u, n],
  );

/** Completa las tres misiones que le tocaron hoy. */
async function completeAll(u) {
  const day = await today();
  const { missions: list } = await missions(u);
  for (const m of list) {
    if (m.id === 'lessons' || m.id === 'perfect') {
      for (let i = 0; i < m.target; i++) await lessonSession(u, day, 10, 10);
    } else if (m.id === 'minutes') {
      await study(u, day, m.target * 60, 0);
    } else if (m.id === 'correct') {
      await study(u, day, 0, m.target);
    } else {
      for (let i = 0; i < m.target; i++) {
        const { id } = await one(
          `insert into public.battles (language_code, mode, is_ranked, status, protocol_version, started_at, ended_at)
           values ('en', 'word_rush', true, 'completed', 1, now(), now()) returning id`,
        );
        await db.query(
          `insert into public.battle_players (battle_id, slot, user_id, rating_before, rating_after, result)
           values ($1, 1, $2, 1000, 1016, 'win')`,
          [id, u],
        );
      }
    }
  }
}

test('misiones: 3 por día (aprender, precisión, ranked), iguales todo el día y distintas entre usuarios', async () => {
  const a = await player('mis_a@test.dev');
  const first = await missions(a);
  assert.equal(first.missions.length, 3);
  assert.ok(['lessons', 'minutes'].includes(first.missions[0].id));
  assert.ok(['correct', 'perfect'].includes(first.missions[1].id));
  assert.ok(['ranked_play', 'ranked_win'].includes(first.missions[2].id));
  for (const m of first.missions) {
    assert.equal(m.progress, 0);
    assert.equal(m.done, false);
  }
  assert.equal(first.all_done, false);
  assert.equal(first.claimed, false);
  assert.equal(first.freezes, 0);
  assert.deepEqual((await missions(a)).missions, first.missions);

  // Sobre muchos usuarios y días salen todas las variantes.
  const { rows } = await db.query(
    `select distinct m ->> 'id' as id from generate_series(1, 60) g,
       jsonb_array_elements(public.daily_missions_for(gen_random_uuid(), current_date + g)) m`,
  );
  // Todas tienen texto en la app (shared/missions.ts) y todas pueden tocar.
  assert.deepEqual(rows.map((r) => r.id).sort(), [...MISSION_IDS].sort());
});

test('el progreso sale de la base y la recompensa se reclama una vez: +1 protector, máximo 2', async () => {
  const u = await player('mis_claim@test.dev');
  await assert.rejects(claim(u), /missions_incomplete/);

  await completeAll(u);
  const done = await missions(u);
  assert.equal(done.all_done, true);
  for (const m of done.missions) assert.equal(m.progress, m.target);

  assert.deepEqual(await claim(u), { granted: true, freezes: 1 });
  assert.equal((await missions(u)).claimed, true);
  await assert.rejects(claim(u), /already_claimed/);

  // Con el máximo, reclamar no suma.
  const full = await player('mis_full@test.dev');
  await setFreezes(full, 2);
  await completeAll(full);
  assert.deepEqual(await claim(full), { granted: false, freezes: 2 });
});

test('una lección con errores no cuenta como perfecta; ranked amistoso no cuenta', async () => {
  const u = await player('mis_perfect@test.dev');
  const day = await today();
  await lessonSession(u, day, 7, 10);
  const p = await one(`select public.mission_progress($1, 'perfect', $2::date, 'UTC') as v`, [
    u,
    day,
  ]);
  assert.equal(p.v, 0);
  const l = await one(`select public.mission_progress($1, 'lessons', $2::date, 'UTC') as v`, [
    u,
    day,
  ]);
  assert.equal(l.v, 1);

  const { id } = await one(
    `insert into public.battles (language_code, mode, is_ranked, status, protocol_version, started_at, ended_at)
     values ('en', 'word_rush', false, 'completed', 1, now(), now()) returning id`,
  );
  await db.query(
    `insert into public.battle_players (battle_id, slot, user_id, rating_before, rating_after, result)
     values ($1, 1, $2, 1000, 1000, 'win')`,
    [id, u],
  );
  const r = await one(`select public.mission_progress($1, 'ranked_win', $2::date, 'UTC') as v`, [
    u,
    day,
  ]);
  assert.equal(r.v, 0);
});

test('protector: cubre el día que faltaste, la racha sigue y el día cubierto no suma', async () => {
  const u = await player('frz_one@test.dev');
  await setFreezes(u, 1);
  await study(u, await daysAgo(3));
  await study(u, await daysAgo(2));
  // Ayer no estudió. Antes de volver: la racha sigue viva con el protector pendiente.
  let s = await summary(u);
  assert.equal(s.streak_days, 2);
  assert.equal(s.freeze_pending, 1);
  assert.equal(s.active_today, false);

  // Vuelve hoy: se gasta el protector y ayer queda cubierto.
  await study(u, await today());
  s = await summary(u);
  assert.equal(s.streak_days, 3);
  assert.equal(s.streak_freezes, 0);
  assert.equal(s.freeze_pending, 0);
  assert.deepEqual(s.frozen_dates, [await daysAgo(1)]);
});

test('protector: si faltaste más días de los que cubre, la racha se corta y no se gasta', async () => {
  const u = await player('frz_short@test.dev');
  await setFreezes(u, 1);
  await study(u, await daysAgo(4));
  await study(u, await daysAgo(3));
  let s = await summary(u);
  assert.equal(s.streak_days, 0);
  assert.equal(s.freeze_pending, 0);

  await study(u, await today());
  s = await summary(u);
  assert.equal(s.streak_days, 1);
  assert.equal(s.streak_freezes, 1);
  assert.deepEqual(s.frozen_dates, []);
});

test('protector: dos protectores cubren dos días seguidos', async () => {
  const u = await player('frz_two@test.dev');
  await setFreezes(u, 2);
  await study(u, await daysAgo(3));
  await study(u, await today());
  const s = await summary(u);
  assert.equal(s.streak_days, 2);
  assert.equal(s.streak_freezes, 0);
  assert.deepEqual(s.frozen_dates, [await daysAgo(2), await daysAgo(1)]);
});

test('permisos: las tablas no se escriben desde la app y anon no ve misiones', async () => {
  const u = await player('mis_perm@test.dev');
  await assert.rejects(
    as(db, 'authenticated', u, () =>
      db.query(`insert into public.user_streak_freezes (user_id, available) values ($1, 2)`, [u]),
    ),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', u, () =>
      db.query(
        `insert into public.user_mission_rewards (user_id, mission_date) values ($1, now())`,
        [u],
      ),
    ),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'anon', null, () => db.query(`select public.get_daily_missions('UTC')`)),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', u, () =>
      db.query(`select public.mission_progress($1, 'lessons', current_date, 'UTC')`, [u]),
    ),
    /permission denied/,
  );
});

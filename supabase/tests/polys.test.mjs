import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { POLYS } from '../../shared/polys.ts';
import { TIERS } from '../../shared/ranking.ts';

let db;

before(async () => {
  db = await createDb();
});

const TZ = 'UTC';
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

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
const sync = (u) => rpc(u, 'select public.sync_polys($1) as r', [TZ]);
const buyFreeze = (u) => rpc(u, 'select public.buy_streak_freeze() as r');
const balance = async (u) =>
  (await one(`select balance from public.poly_wallets where user_id = $1`, [u])).balance;
const reasons = (granted) => granted.map((g) => g.reason).sort();

/** Lección terminada; accuracy 1 = 3 estrellas. */
const finishLesson = (u, lessonId, accuracy = 1) =>
  db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy, first_completed_at, last_completed_at)
     values ($1, $2, 1, $3, $3, now(), now())
     on conflict (user_id, lesson_id) do update set best_accuracy = excluded.best_accuracy`,
    [u, lessonId, accuracy],
  );

/** Victoria ranked de hoy, con su registro de rating en la temporada activa. */
async function rankedWin(u, ratingAfter = 120) {
  const { id } = await one(
    `insert into public.battles (language_code, mode, is_ranked, status, protocol_version, started_at, ended_at)
     values ('en', 'word_rush', true, 'completed', 1, now(), now()) returning id`,
  );
  await db.query(
    `insert into public.battle_players (battle_id, slot, user_id, rating_before, rating_after, result)
     values ($1, 1, $2, 100, $3, 'win')`,
    [id, u, ratingAfter],
  );
  await db.query(
    `insert into public.rating_history (user_id, language_code, season_id, battle_id, reason, rating_before, rating_after)
     values ($1, 'en', (select id from public.seasons where status = 'active'), $2, 'battle', 100, $3)`,
    [u, id, ratingAfter],
  );
}

test('poly_config replica shared/polys.ts', async () => {
  const { c } = await one('select public.poly_config() as c');
  assert.deepEqual(c, JSON.parse(JSON.stringify(POLYS)));
});

test('primera sincronización: sólo el regalo; lo logrado antes queda contado', async () => {
  const u = await player('poly_first@test.dev');
  const { id: lesson } = await one(`select id from public.lessons order by id limit 1`);
  await finishLesson(u, lesson);

  const first = await sync(u);
  assert.deepEqual(reasons(first.granted), ['welcome']);
  assert.equal(first.balance, POLYS.welcome);

  // Volver a sincronizar no da nada nuevo.
  const again = await sync(u);
  assert.deepEqual(again.granted, []);
  assert.equal(again.balance, POLYS.welcome);
});

test('lecciones con 3★ y unidades se pagan una sola vez', async () => {
  const u = await player('poly_lessons@test.dev');
  await sync(u);
  const { unit_id } = await one(
    `select unit_id from public.lessons where is_published order by unit_id limit 1`,
  );
  const { rows: lessons } = await db.query(
    `select id from public.lessons where unit_id = $1 and is_published order by position`,
    [unit_id],
  );

  // Una lección con 2★ no paga; con 3★ sí.
  await finishLesson(u, lessons[0].id, 0.8);
  assert.deepEqual((await sync(u)).granted, []);
  await finishLesson(u, lessons[0].id, 1);
  assert.deepEqual(reasons((await sync(u)).granted), ['lesson_perfect']);

  // Terminar el resto de la unidad (sin 3★) paga la unidad.
  for (const l of lessons.slice(1)) await finishLesson(u, l.id, 0.5);
  const unit = await sync(u);
  assert.deepEqual(unit.granted, [{ reason: 'unit', ref: unit_id, amount: POLYS.unit }]);
  assert.equal(await balance(u), POLYS.welcome + POLYS.lessonPerfect + POLYS.unit);
  assert.deepEqual((await sync(u)).granted, []);
});

test('victorias ranked: 3 cada una, hasta 5 por día; los rangos de la temporada pagan una vez', async () => {
  const u = await player('poly_wins@test.dev');
  await sync(u);
  for (let i = 0; i < 7; i++) await rankedWin(u);
  const res = await sync(u);
  const wins = res.granted.filter((g) => g.reason === 'ranked_win');
  assert.equal(wins.length, POLYS.rankedWinsPerDay);
  assert.ok(wins.every((g) => g.amount === POLYS.rankedWin));
  // Ganar misiones ranked de hoy también paga; acá sólo miramos victorias y rangos.
  assert.ok(!res.granted.some((g) => g.reason === 'rank'));

  // Los umbrales de rango de la base coinciden con shared/ranking.ts.
  for (const tier of TIERS.filter((t) => t.id !== 'bronze')) {
    const below = await player(`pb_${tier.id.slice(0, 10)}@test.dev`);
    await sync(below);
    await rankedWin(below, tier.minRating - 1);
    assert.ok(
      !(await sync(below)).granted.some((g) => g.ref.endsWith(`:${tier.id}`)),
      `${tier.id} no antes de ${tier.minRating}`,
    );
    const at = await player(`pa_${tier.id.slice(0, 10)}@test.dev`);
    await sync(at);
    await rankedWin(at, tier.minRating);
    const got = (await sync(at)).granted.find((g) => g.ref.endsWith(`:${tier.id}`));
    assert.equal(got?.amount, POLYS.rankReached[tier.id], tier.id);
  }
});

test('hito de racha: 7 días seguidos pagan una vez', async () => {
  const u = await player('poly_streak@test.dev');
  await sync(u);
  await db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
     select $1, (now() at time zone 'UTC')::date - g, 1, 1, 1, 60 from generate_series(1, 7) g`,
    [u],
  );
  const res = await sync(u);
  assert.deepEqual(
    res.granted.filter((g) => g.reason === 'streak'),
    [{ reason: 'streak', ref: '7', amount: POLYS.streakMilestones[0].polys }],
  );
});

test('cofre: Polys al azar y bonus semanal al 5.º cofre de la semana', async () => {
  const u = await player('poly_chest@test.dev');
  await sync(u);
  const { d } = await one(`select (now() at time zone 'UTC')::date as d`);
  // Las misiones de hoy completas, sin depender de cuáles tocaron.
  const { m } = await one(`select public.daily_missions_for($1, $2::date) as m`, [u, d]);
  await db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
     values ($1, $2, 3, 50, 50, 1200)`,
    [u, d],
  );
  const { id: lesson } = await one(`select id from public.lessons order by id limit 1`);
  for (let i = 0; i < 3; i++) {
    await db.query(
      `insert into public.learning_sessions (id, user_id, kind, lesson_id, started_at, duration_seconds, total_answers, first_try_total, first_try_correct, local_date)
       values (gen_random_uuid(), $1, 'lesson', $2, now(), 60, 10, 10, 10, $3)`,
      [u, lesson, d],
    );
    await rankedWin(u);
  }
  assert.equal(m.length, 3);
  // Otros 4 días de esta misma semana con el cofre abierto.
  await db.query(
    `insert into public.user_mission_rewards (user_id, mission_date)
     select $1, x from generate_series(date_trunc('week', $2::date)::date, date_trunc('week', $2::date)::date + 6, '1 day') x
     where x::date <> $2::date limit 4`,
    [u, d],
  );
  const before = await balance(u);
  const chest = await rpc(u, 'select public.claim_mission_reward($1) as r', [TZ]);
  assert.ok(
    (chest.polys >= POLYS.chest.min && chest.polys <= POLYS.chest.max) ||
      chest.polys === POLYS.chest.jackpot,
  );
  assert.equal(chest.weekly_bonus, POLYS.weekly.bonus);
  assert.equal(chest.balance, before + chest.polys + POLYS.weekly.bonus);

  // Las 3 misiones completas pagan 5 cada una.
  const missions = (await sync(u)).granted.filter((g) => g.reason === 'mission');
  assert.equal(missions.length, 3);
});

test('protector: se compra con Polys, máximo 2 y sin saldo negativo', async () => {
  const u = await player('poly_shop@test.dev');
  await sync(u); // 100 de bienvenida
  const first = await buyFreeze(u);
  assert.deepEqual(first, { balance: POLYS.welcome - POLYS.prices.streakFreeze, freezes: 1 });
  await assert.rejects(buyFreeze(u), /insufficient_polys/);
  assert.equal(await balance(u), 0);

  await db.query(`update public.poly_wallets set balance = 500 where user_id = $1`, [u]);
  await buyFreeze(u);
  await assert.rejects(buyFreeze(u), /freezes_full/);
  assert.equal(await balance(u), 400);
});

test('permisos: la app no escribe Polys ni llama a las funciones internas', async () => {
  const u = await player('poly_perm@test.dev');
  await sync(u);
  await assert.rejects(
    rpc(u, `select public.poly_credit($1, 1000, 'welcome', 'x') as r`, [u]),
    /permission denied/,
  );
  await assert.rejects(
    rpc(u, `update public.poly_wallets set balance = 9999 where user_id = $1`, [u]),
    /permission denied/,
  );
  await assert.rejects(
    rpc(
      u,
      `insert into public.poly_transactions (user_id, amount, reason, ref) values ($1, 5, 'welcome', 'y')`,
      [u],
    ),
    /permission denied/,
  );
  // Sólo ve lo propio.
  const other = await player('poly_perm2@test.dev');
  await sync(other);
  const seen = await as(db, 'authenticated', u, async () =>
    (await db.query(`select user_id from public.poly_wallets`)).rows.map((r) => r.user_id),
  );
  assert.deepEqual(seen, [u]);
  await assert.rejects(as(db, 'anon', null, () => db.query(`select public.sync_polys('UTC')`)));
});

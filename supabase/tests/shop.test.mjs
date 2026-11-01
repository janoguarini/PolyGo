import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { COSMETICS } from '../../shared/cosmetics.ts';
import { POLYS } from '../../shared/polys.ts';

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
const setBalance = (u, n) =>
  db.query(`update public.poly_wallets set balance = $2 where user_id = $1`, [u, n]);
const balance = async (u) =>
  (await one(`select balance from public.poly_wallets where user_id = $1`, [u])).balance;
const buy = (u, item) => rpc(u, 'select public.buy_cosmetic($1) as r', [item]);
const equip = (u, kind, item) => rpc(u, 'select public.equip_cosmetic($1, $2) as r', [kind, item]);
const equipped = (u) => one(`select frame_id, background_id from public.profiles where id = $1`, [u]);
const offer = (u) => rpc(u, 'select public.get_streak_repair($1) as r', [TZ]);
const repair = (u) => rpc(u, 'select public.repair_streak($1) as r', [TZ]);

/** Días de estudio a `ago` días de hoy (0 = hoy). */
const studied = (u, ago) =>
  db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
     select $1, (now() at time zone 'UTC')::date - g, 1, 1, 1, 60 from unnest($2::int[]) g`,
    [u, ago],
  );
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const streakNow = async (u) =>
  (await rpc(u, 'select public.get_learning_summary($1) as r', [TZ])).streak_days;

test('cosmetic_items replica shared/cosmetics.ts', async () => {
  const { rows } = await db.query(
    `select id, kind, rarity, price, source from public.cosmetic_items order by position`,
  );
  assert.deepEqual(
    rows,
    COSMETICS.map(({ id, kind, rarity, price, source }) => ({ id, kind, rarity, price, source })),
  );
});

test('comprar un marco: descuenta, queda puesto y no se compra dos veces', async () => {
  const u = await player('shop_buy@test.dev');
  await sync(u);
  await setBalance(u, 1000);
  const res = await buy(u, 'frame_mint');
  assert.deepEqual(res, { balance: 850, item_id: 'frame_mint' });
  assert.equal((await equipped(u)).frame_id, 'frame_mint');
  await assert.rejects(buy(u, 'frame_mint'), /item_owned/);
  assert.equal(await balance(u), 850);

  // Sin saldo suficiente no queda nada a medias.
  await assert.rejects(buy(u, 'frame_crown'), /insufficient_polys/);
  const owned = await rpc(u, `select count(*)::int as r from public.user_cosmetics`);
  assert.equal(owned, 1);
});

test('legendarios y exclusivos no se venden por Polys', async () => {
  const u = await player('shop_legend@test.dev');
  await sync(u);
  await setBalance(u, 99999);
  for (const item of COSMETICS.filter((c) => c.rarity === 'legendary')) {
    await assert.rejects(buy(u, item.id), /item_not_for_sale/, item.id);
  }
  await assert.rejects(buy(u, 'no_existe'), /item_not_found/);
  assert.equal(await balance(u), 99999);
});

test('equipar: sólo lo propio y del tipo correcto; null lo saca', async () => {
  const u = await player('shop_equip@test.dev');
  await sync(u);
  await setBalance(u, 1000);
  await buy(u, 'bg_forest');
  await buy(u, 'frame_coral');
  await assert.rejects(equip(u, 'frame', 'frame_sky'), /item_not_owned/);
  await assert.rejects(equip(u, 'frame', 'bg_forest'), /item_not_owned/);
  await equip(u, 'frame', null);
  assert.deepEqual(await equipped(u), { frame_id: null, background_id: 'bg_forest' });
  await equip(u, 'frame', 'frame_coral');
  assert.equal((await equipped(u)).frame_id, 'frame_coral');

  // La app no puede ponerse un marco directo en el perfil.
  await assert.rejects(
    rpc(u, `update public.profiles set frame_id = 'frame_crown' where id = $1`, [u]),
    /permission denied/,
  );
  // Y el perfil público lo muestra.
  const pub = await rpc(u, 'select public.get_public_profile($1) as r', [u]);
  assert.equal(pub.frame_id, 'frame_coral');
  assert.equal(pub.background_id, 'bg_forest');
});

test('recuperar la racha: paga los días que faltaron y la racha sigue', async () => {
  const u = await player('shop_repair@test.dev');
  await sync(u);
  await setBalance(u, 1000);
  // Racha de 5 días que terminó hace 3 (faltó anteayer y ayer).
  await studied(u, range(3, 7));
  assert.equal(await streakNow(u), 0);

  const o = await offer(u);
  assert.equal(o.lost_streak, 5);
  assert.equal(o.missed_days, 2);
  assert.equal(o.price, POLYS.streakRepair.price);

  const res = await repair(u);
  assert.deepEqual(res, { balance: 1000 - POLYS.streakRepair.price, streak: 5 });
  assert.equal(await streakNow(u), 5);
  assert.equal(await offer(u), null);
  await assert.rejects(repair(u), /streak_not_repairable/);

  // Estudiar hoy la sigue sumando.
  await studied(u, [0]);
  assert.equal(await streakNow(u), 6);
});

test('recuperar la racha: también si ya estudiaste hoy, y las largas cuestan más', async () => {
  const u = await player('shop_repair_big@test.dev');
  await sync(u);
  await setBalance(u, 1000);
  await studied(u, [0, ...range(2, 31)]); // 30 días, faltó ayer y hoy volvió
  assert.equal(await streakNow(u), 1);
  const o = await offer(u);
  assert.equal(o.lost_streak, 30);
  assert.equal(o.price, POLYS.streakRepair.bigPrice);
  assert.equal((await repair(u)).streak, 31);
});

test('recuperar la racha: no aplica si los protectores alcanzan, si pasó mucho o si era corta', async () => {
  const withFreeze = await player('shop_rep_frz@test.dev');
  await sync(withFreeze);
  await studied(withFreeze, range(2, 6));
  await db.query(`insert into public.user_streak_freezes (user_id, available) values ($1, 1)`, [
    withFreeze,
  ]);
  assert.equal(await offer(withFreeze), null);

  const tooLate = await player('shop_rep_late@test.dev');
  await sync(tooLate);
  await studied(tooLate, range(POLYS.streakRepair.maxMissedDays + 2, 12));
  assert.equal(await offer(tooLate), null);

  const short = await player('shop_rep_short@test.dev');
  await sync(short);
  await studied(short, range(2, POLYS.streakRepair.minStreak));
  assert.equal(await offer(short), null);

  const poor = await player('shop_rep_poor@test.dev');
  await sync(poor);
  await setBalance(poor, 10);
  await studied(poor, range(2, 6));
  await assert.rejects(repair(poor), /insufficient_polys/);
  assert.equal(await streakNow(poor), 0);
});

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
const equipped = (u) =>
  one(`select frame_id, background_id from public.profiles where id = $1`, [u]);
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
    `select id, kind, rarity, price, source, is_available as available, is_retired as retired
     from public.cosmetic_items order by position`,
  );
  assert.deepEqual(
    rows,
    COSMETICS.map(({ id, kind, rarity, price, source, available, retired }) => ({
      id,
      kind,
      rarity,
      price,
      source,
      available,
      retired,
    })),
  );
});

test('comprar un marco: descuenta, queda puesto y no se compra dos veces', async () => {
  const u = await player('shop_buy@test.dev');
  await sync(u);
  await setBalance(u, 1000);
  const res = await buy(u, 'frame_leaf');
  assert.deepEqual(res, { balance: 850, item_id: 'frame_leaf', equipped: true });
  assert.equal((await equipped(u)).frame_id, 'frame_leaf');
  await assert.rejects(buy(u, 'frame_leaf'), /item_owned/);
  assert.equal(await balance(u), 850);

  // Sin saldo suficiente no queda nada a medias: ni la compra ni el cobro.
  await assert.rejects(buy(u, 'frame_master'), /insufficient_polys/);
  const owned = await rpc(u, `select count(*)::int as r from public.user_cosmetics`);
  assert.equal(owned, 1);
  assert.equal(await balance(u), 850);
  assert.equal((await equipped(u)).frame_id, 'frame_leaf');
});

test('no se vende: exclusivos, gratis, de rango, sin arte ni el catálogo retirado', async () => {
  const u = await player('shop_legend@test.dev');
  await sync(u);
  await setBalance(u, 99999);
  const notForSale = COSMETICS.filter((c) => c.price === null || c.retired || !c.available);
  assert.ok(notForSale.some((c) => c.source === 'plus'));
  assert.ok(notForSale.some((c) => c.source === 'referral'));
  for (const item of notForSale) {
    await assert.rejects(buy(u, item.id), /item_not_for_sale/, item.id);
  }
  await assert.rejects(buy(u, 'no_existe'), /item_not_found/);
  assert.equal(await balance(u), 99999);
});

test('legendarios y míticos con arte se compran por Polys', async () => {
  const u = await player('shop_mythic@test.dev');
  await sync(u);
  await setBalance(u, 3400);
  assert.equal((await buy(u, 'bg_dimension')).balance, 1400);
  assert.equal((await buy(u, 'bg_galaxy')).balance, 0);
});

test('equipar: sólo lo propio y del tipo correcto; null lo saca', async () => {
  const u = await player('shop_equip@test.dev');
  await sync(u);
  await setBalance(u, 1000);
  await buy(u, 'bg_forest');
  await buy(u, 'frame_stellar');
  await assert.rejects(equip(u, 'frame', 'frame_crystal'), /item_not_owned/);
  await assert.rejects(equip(u, 'frame', 'bg_forest'), /item_not_owned/);
  await equip(u, 'frame', null);
  assert.deepEqual(await equipped(u), { frame_id: null, background_id: 'bg_forest' });
  await equip(u, 'frame', 'frame_stellar');
  assert.equal((await equipped(u)).frame_id, 'frame_stellar');

  // Los gratis se ponen sin comprarlos.
  await equip(u, 'frame', 'frame_basic');
  await equip(u, 'background', 'bg_solid');
  assert.deepEqual(await equipped(u), { frame_id: 'frame_basic', background_id: 'bg_solid' });
  // Sin arte aprobado no se puede poner, aunque fuera tuyo.
  await db.query(
    `insert into public.user_cosmetics (user_id, item_id, source) values ($1, 'frame_diamond', 'gift')`,
    [u],
  );
  await assert.rejects(equip(u, 'frame', 'frame_diamond'), /item_unavailable/);
  await equip(u, 'frame', 'frame_stellar');

  // La app no puede ponerse un marco directo en el perfil.
  await assert.rejects(
    rpc(u, `update public.profiles set frame_id = 'frame_master' where id = $1`, [u]),
    /permission denied/,
  );
  // Y el perfil público lo muestra.
  const pub = await rpc(u, 'select public.get_public_profile($1) as r', [u]);
  assert.equal(pub.frame_id, 'frame_stellar');
  assert.equal(pub.background_id, 'bg_solid');
});

test('lo comprado del catálogo retirado se conserva y se sigue usando', async () => {
  const u = await player('shop_legacy@test.dev');
  await db.query(
    `insert into public.user_cosmetics (user_id, item_id, source) values ($1, 'bg_ocean', 'polys')`,
    [u],
  );
  await equip(u, 'background', 'bg_ocean');
  assert.equal((await equipped(u)).background_id, 'bg_ocean');
});

const avatarOf = async (u) =>
  (await one(`select avatar_id from public.profiles where id = $1`, [u])).avatar_id;
const setAvatar = (u, id) =>
  rpc(u, `update public.profiles set avatar_id = $2 where id = $1`, [u, id]);

test('skins: comprar, equipar y no poder ponerse una ajena', async () => {
  const u = await player('shop_skin@test.dev');
  await sync(u);
  await setBalance(u, 600);

  // Clásico es gratis para todos; Ninja hay que comprarla.
  await setAvatar(u, 'skin-classic');
  assert.equal(await avatarOf(u), 'skin-classic');
  await assert.rejects(setAvatar(u, 'skin-ninja'), /item_not_owned/);
  await assert.rejects(equip(u, 'skin', 'skin-ninja'), /item_not_owned/);
  await assert.rejects(setAvatar(u, 'skin-inventada'), /invalid_avatar/);
  await assert.rejects(setAvatar(u, 'skin-omega'), /item_unavailable/);
  assert.equal(await avatarOf(u), 'skin-classic');

  assert.deepEqual(await buy(u, 'skin-ninja'), {
    balance: 350,
    item_id: 'skin-ninja',
    equipped: true,
  });
  assert.equal(await avatarOf(u), 'skin-ninja');
  // Se puede volver a un avatar de siempre y otra vez a la skin.
  await setAvatar(u, 'bolt');
  await setAvatar(u, 'skin-ninja');
  await equip(u, 'skin', 'skin-classic');
  assert.equal(await avatarOf(u), 'skin-classic');
  await assert.rejects(equip(u, 'skin', null), /invalid_item/);

  // Ninguna escritura directa sirve de atajo.
  const v = await player('shop_skin2@test.dev');
  await assert.rejects(
    rpc(v, `update public.profiles set avatar_id = 'skin-cyber' where id = $1`, [v]),
    /item_not_owned/,
  );
});

test('marco de rango: sólo posicionado, y se dibuja con el ELO real', async () => {
  const u = await player('shop_rank@test.dev');
  await assert.rejects(equip(u, 'frame', 'frame_rank'), /rank_required/);
  const lang = (await one(`select target_language from public.profiles where id = $1`, [u]))
    .target_language;
  await db.query(
    `insert into public.player_ratings
       (user_id, language_code, rating, peak_rating, wins, losses, games_played)
     values ($1, $2, 1650, 1650, 0, 3, 3)
     on conflict (user_id, language_code) do update
       set rating = 1650, peak_rating = 1650, wins = 0, losses = 3, games_played = 3`,
    [u, lang],
  );
  await assert.rejects(equip(u, 'frame', 'frame_rank'), /rank_required/);
  await db.query(
    `update public.player_ratings set wins = 1, games_played = 4 where user_id = $1 and language_code = $2`,
    [u, lang],
  );
  await equip(u, 'frame', 'frame_rank');
  // El perfil público trae el rating: la app elige el tier (Diamante) con shared/ranking.ts.
  const pub = await rpc(u, 'select public.get_public_profile($1) as r', [u]);
  assert.equal(pub.frame_id, 'frame_rank');
  assert.equal(pub.rating.rating, 1650);
});

const grantPlus = (u, expires = null) =>
  db.query(
    `insert into public.user_entitlements (user_id, entitlement, source, starts_at, expires_at)
     values ($1, 'plus', 'manual', now() - interval '1 day', $2)
     on conflict (user_id, entitlement) do update set expires_at = excluded.expires_at,
       starts_at = excluded.starts_at, updated_at = now()`,
    [u, expires],
  );

test('marco Plus: con Plus se equipa; al vencer se suspende sin borrar nada y vuelve al renovar', async () => {
  const u = await player('shop_plus@test.dev');
  await sync(u);
  await setBalance(u, 1000);
  await buy(u, 'bg_aurora');
  await assert.rejects(equip(u, 'frame', 'frame_plus'), /plus_required/);
  await assert.rejects(buy(u, 'frame_plus'), /item_not_for_sale/);

  await grantPlus(u);
  await equip(u, 'frame', 'frame_plus');
  assert.equal((await equipped(u)).frame_id, 'frame_plus');

  // Vence (el webhook o el dashboard actualiza la fila): el trigger lo suspende al instante.
  await db.query(
    `update public.user_entitlements set expires_at = now() - interval '1 minute' where user_id = $1`,
    [u],
  );
  const after = await one(
    `select frame_id, background_id, suspended_cosmetics from public.profiles where id = $1`,
    [u],
  );
  assert.equal(after.frame_id, null);
  assert.deepEqual(after.suspended_cosmetics, { frame: 'frame_plus' });
  // Lo comprado con Polys sigue intacto (puesto y en el inventario).
  assert.equal(after.background_id, 'bg_aurora');
  const inv = await rpc(u, `select array_agg(item_id order by item_id) as r from public.user_cosmetics`);
  assert.deepEqual(inv, ['bg_aurora']);
  await assert.rejects(equip(u, 'frame', 'frame_plus'), /plus_required/);

  // Renueva: vuelve solo.
  await grantPlus(u);
  const back = await one(`select frame_id, suspended_cosmetics from public.profiles where id = $1`, [
    u,
  ]);
  assert.equal(back.frame_id, 'frame_plus');
  assert.deepEqual(back.suspended_cosmetics, {});
});

test('marco Plus: si vence sin que nadie toque la fila, sync_cosmetics lo suspende', async () => {
  const u = await player('shop_plus_lazy@test.dev');
  await grantPlus(u, new Date(Date.now() + 60_000).toISOString());
  await equip(u, 'frame', 'frame_plus');
  // Simula que el tiempo pasó: se adelanta el vencimiento sin disparar el trigger.
  await db.query(`alter table public.user_entitlements disable trigger user_entitlements_reconcile`);
  await db.query(
    `update public.user_entitlements set expires_at = now() - interval '1 second' where user_id = $1`,
    [u],
  );
  await db.query(`alter table public.user_entitlements enable trigger user_entitlements_reconcile`);
  assert.equal((await equipped(u)).frame_id, 'frame_plus');
  const res = await rpc(u, 'select public.sync_cosmetics() as r');
  assert.deepEqual(res, { suspended: ['frame_plus'], restored: [] });
  assert.equal((await equipped(u)).frame_id, null);
  // Idempotente.
  assert.deepEqual(await rpc(u, 'select public.sync_cosmetics() as r'), {
    suspended: [],
    restored: [],
  });

  // Si mientras tanto eligió otro marco, renovar no se lo pisa.
  await equip(u, 'frame', 'frame_basic');
  await grantPlus(u);
  assert.equal((await equipped(u)).frame_id, 'frame_basic');
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

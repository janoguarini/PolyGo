// Compatibilidad avatar ↔ marcos/fondos (20261222120300_cosmetic_compatibility): espejo de
// shared/cosmeticCompatibility.ts y cumplimiento en la base (trigger + buy_cosmetic).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { COSMETICS } from '../../shared/cosmetics.ts';
import { SKIN_COMPATIBILITY, isCosmeticCompatible } from '../../shared/cosmeticCompatibility.ts';

let db;

before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

async function player(email) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, email.split('@')[0].slice(0, 20)],
  );
  return id;
}

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]?.r);
const give = (u, ...items) =>
  db.query(
    `insert into public.user_cosmetics (user_id, item_id, source)
     select $1, unnest($2::text[]), 'polys' on conflict do nothing`,
    [u, items],
  );
const equip = (u, kind, item) => rpc(u, 'select public.equip_cosmetic($1, $2) as r', [kind, item]);
const look = (u) =>
  one(`select avatar_id, frame_id, background_id from public.profiles where id = $1`, [u]);

test('cosmetic_compatibility replica shared/cosmeticCompatibility.ts', async () => {
  const { rows } = await db.query(
    `select skin_id, item_id from public.cosmetic_compatibility order by skin_id, item_id`,
  );
  const expected = Object.entries(SKIN_COMPATIBILITY)
    .flatMap(([skin, c]) =>
      [...c.frames, ...c.backgrounds].map((item) => ({ skin_id: skin, item_id: item })),
    )
    .sort((a, b) => (a.skin_id + a.item_id < b.skin_id + b.item_id ? -1 : 1));
  assert.deepEqual(rows, expected);
});

test('cosmetic_compatible coincide con la app para cada avatar y cada ítem', async () => {
  const avatars = [
    ...COSMETICS.filter((c) => c.kind === 'skin').map((c) => c.id),
    'bolt',
    'panda-red',
  ];
  const items = COSMETICS.filter((c) => c.kind !== 'skin').map((c) => c.id);
  const { rows } = await db.query(
    `select a, i, public.cosmetic_compatible(a, i) ok
     from unnest($1::text[]) a cross join unnest($2::text[]) i`,
    [avatars, items],
  );
  assert.equal(rows.length, avatars.length * items.length);
  for (const r of rows) assert.equal(r.ok, isCosmeticCompatible(r.a, r.i), `${r.a} + ${r.i}`);
  // Sin marco/fondo siempre combina.
  assert.equal((await one(`select public.cosmetic_compatible('skin-cyber', null) ok`)).ok, true);
});

test('cada skin con lista tiene al menos 3 marcos y 4 fondos con arte, y lo temático tiene dueño', () => {
  const byId = new Map(COSMETICS.map((c) => [c.id, c]));
  for (const [skin, c] of Object.entries(SKIN_COMPATIBILITY)) {
    assert.ok(byId.get(skin)?.available, `${skin} sin arte`);
    assert.ok(c.frames.filter((f) => byId.get(f)?.available).length >= 3, `${skin}: marcos`);
    assert.ok(c.backgrounds.filter((b) => byId.get(b)?.available).length >= 3, `${skin}: fondos`);
    for (const id of [...c.frames, ...c.backgrounds]) {
      const item = byId.get(id);
      assert.ok(item && item.source === 'polys' && !item.retired, `${skin}: ${id} no es temático`);
    }
  }
  // Todo marco/fondo temático con arte combina con al menos una skin temática.
  const listed = new Set(
    Object.values(SKIN_COMPATIBILITY).flatMap((c) => [...c.frames, ...c.backgrounds]),
  );
  for (const item of COSMETICS) {
    if (item.kind !== 'skin' && item.source === 'polys' && !item.retired && item.available) {
      assert.ok(listed.has(item.id), `${item.id} no combina con ninguna skin`);
    }
  }
});

test('equipar: un marco o fondo incompatible con la skin se rechaza en la base', async () => {
  const u = await player('compat_equip@test.dev');
  await give(u, 'skin-ninja', 'frame_leaf', 'frame_master', 'bg_forest', 'bg_galaxy');
  await equip(u, 'skin', 'skin-ninja');
  await equip(u, 'frame', 'frame_leaf');
  await equip(u, 'background', 'bg_forest');
  assert.deepEqual(await look(u), {
    avatar_id: 'skin-ninja',
    frame_id: 'frame_leaf',
    background_id: 'bg_forest',
  });
  await assert.rejects(equip(u, 'frame', 'frame_master'), /cosmetic_incompatible/);
  await assert.rejects(equip(u, 'background', 'bg_galaxy'), /cosmetic_incompatible/);
  assert.equal((await look(u)).frame_id, 'frame_leaf');
  // Quitar (null) siempre se puede.
  await equip(u, 'frame', null);
  assert.equal((await look(u)).frame_id, null);
});

test('cambiar de avatar mantiene lo compatible y devuelve lo demás al predeterminado', async () => {
  const u = await player('compat_switch@test.dev');
  await give(u, 'skin-cyber', 'skin-academic', 'frame_stellar', 'bg_neon');
  await equip(u, 'frame', 'frame_stellar'); // avatar básico: neutro
  await equip(u, 'background', 'bg_neon');
  await equip(u, 'skin', 'skin-academic'); // Estelar sí, Ciudad Neón no
  assert.deepEqual(await look(u), {
    avatar_id: 'skin-academic',
    frame_id: 'frame_stellar',
    background_id: null,
  });
  // Por la vía de profiles (Editar perfil cambia avatar_id directo) también.
  await equip(u, 'skin', 'skin-cyber');
  await equip(u, 'background', 'bg_neon');
  await rpc(
    u,
    `update public.profiles set avatar_id = 'bolt' where id = auth.uid() returning 1 as r`,
  );
  assert.deepEqual(await look(u), {
    avatar_id: 'bolt',
    frame_id: 'frame_stellar',
    background_id: 'bg_neon',
  });
});

test('lo ganado, lo gratuito y lo retirado es universal', async () => {
  const u = await player('compat_universal@test.dev');
  await give(u, 'skin-ninja', 'bg_ocean');
  await equip(u, 'skin', 'skin-ninja');
  await equip(u, 'frame', 'frame_basic');
  await equip(u, 'background', 'bg_ocean'); // catálogo retirado: lo conserva quien lo tiene
  assert.deepEqual(await look(u), {
    avatar_id: 'skin-ninja',
    frame_id: 'frame_basic',
    background_id: 'bg_ocean',
  });
  for (const id of ['frame_plus', 'frame_rank', 'frame_referral_legend', 'bg_solid']) {
    assert.equal(
      (await one(`select public.cosmetic_compatible('skin-ninja', $1) ok`, [id])).ok,
      true,
      id,
    );
  }
});

test('comprar algo incompatible: se cobra y queda en el inventario, sin ponerse', async () => {
  const u = await player('compat_buy@test.dev');
  await rpc(u, `select public.sync_polys('UTC') as r`);
  await db.query(`update public.poly_wallets set balance = 3000 where user_id = $1`, [u]);
  await give(u, 'skin-cyber');
  await equip(u, 'skin', 'skin-cyber');
  const res = await rpc(u, `select public.buy_cosmetic('frame_master') as r`);
  assert.deepEqual(res, { balance: 1500, item_id: 'frame_master', equipped: false });
  assert.equal((await look(u)).frame_id, null);
  const owned = await one(
    `select count(*)::int n from public.user_cosmetics where user_id = $1 and item_id = 'frame_master'`,
    [u],
  );
  assert.equal(owned.n, 1);
  // Uno compatible se pone como siempre.
  const ok = await rpc(u, `select public.buy_cosmetic('frame_crystal') as r`);
  assert.deepEqual(ok, { balance: 1100, item_id: 'frame_crystal', equipped: true });
  assert.equal((await look(u)).frame_id, 'frame_crystal');
});

test('ni siquiera un UPDATE directo (service_role) guarda una combinación incompatible', async () => {
  const u = await player('compat_direct@test.dev');
  await give(u, 'skin-explorer');
  await equip(u, 'skin', 'skin-explorer');
  await assert.rejects(
    as(db, 'service_role', null, () =>
      db.query(`update public.profiles set frame_id = 'frame_master' where id = $1`, [u]),
    ),
    /cosmetic_incompatible/,
  );
  await assert.rejects(
    db.query(`update public.profiles set background_id = 'bg_neon' where id = $1`, [u]),
    /cosmetic_incompatible/,
  );
  // Avatar y marco juntos se validan contra el avatar nuevo.
  await db.query(
    `update public.profiles set avatar_id = 'bolt', frame_id = 'frame_master' where id = $1`,
    [u],
  );
  assert.equal((await look(u)).frame_id, 'frame_master');
});

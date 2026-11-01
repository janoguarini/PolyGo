import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';

let db;

before(async () => {
  db = await createDb();
});

async function player(email) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, email.split('@')[0]],
  );
  return id;
}

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows);
const service = async (sql, params = []) =>
  as(db, 'service_role', null, async () => (await db.query(sql, params)).rows);
const register = (u, token, platform = 'ios') =>
  rpc(u, 'select public.register_push_token($1, $2)', [token, platform]);
const claim = async (host, code) =>
  (await service('select public.claim_battle_invite_push($1, $2) as r', [host, code]))[0].r;
const tokensOf = async (u) =>
  (
    await db.query(
      'select token from public.push_tokens where user_id = $1 and active order by token',
      [u],
    )
  ).rows.map((r) => r.token);

async function friends(prefix) {
  const a = await player(`${prefix}_a@test.dev`);
  const b = await player(`${prefix}_b@test.dev`);
  await rpc(a, 'select public.send_friend_request($1)', [b]);
  await rpc(b, 'select public.respond_friend_request($1, true)', [a]);
  return [a, b];
}
const invite = async (host, guest) =>
  (await rpc(host, 'select public.invite_friend_to_battle($1) as r', [guest]))[0].r;

test('registrar: valida el formato, es idempotente y el token pasa a la cuenta que lo registra', async () => {
  const a = await player('tok_a@test.dev');
  const b = await player('tok_b@test.dev');
  await register(a, 'ExponentPushToken[abc123]');
  await register(a, 'ExponentPushToken[abc123]');
  assert.deepEqual(await tokensOf(a), ['ExponentPushToken[abc123]']);
  await assert.rejects(register(a, 'no-es-un-token'), /invalid_push_token/);
  await assert.rejects(register(a, 'ExponentPushToken[x]', 'web'), /invalid_push_token/);

  // Otra cuenta en el mismo teléfono.
  await register(b, 'ExponentPushToken[abc123]', 'android');
  assert.deepEqual(await tokensOf(a), []);
  assert.deepEqual(await tokensOf(b), ['ExponentPushToken[abc123]']);

  // Cerrar sesión sólo desactiva el propio.
  await rpc(a, 'select public.unregister_push_token($1)', ['ExponentPushToken[abc123]']);
  assert.deepEqual(await tokensOf(b), ['ExponentPushToken[abc123]']);
  await rpc(b, 'select public.unregister_push_token($1)', ['ExponentPushToken[abc123]']);
  assert.deepEqual(await tokensOf(b), []);
});

test('tope de teléfonos por cuenta: se desactivan los más viejos', async () => {
  const a = await player('cap_a@test.dev');
  for (let i = 1; i <= 6; i++) {
    await register(a, `ExponentPushToken[t${i}]`);
    await db.query(
      `update public.push_tokens set updated_at = now() - make_interval(mins => $2) where token = $1`,
      [`ExponentPushToken[t${i}]`, 10 - i],
    );
  }
  await register(a, 'ExponentPushToken[t6]');
  const active = await tokensOf(a);
  assert.equal(active.length, 5);
  assert.ok(!active.includes('ExponentPushToken[t1]'));
});

test('destinatarios: sólo para la invitación de quien llama, una vez, respetando ajustes y bloqueos', async () => {
  const [host, guest] = await friends('push');
  await register(guest, 'ExponentPushToken[guest1]');
  const other = await player('push_other@test.dev');

  const { code } = await invite(host, guest);
  assert.deepEqual((await claim(other, code)).tokens, []);
  const res = await claim(host, code);
  assert.deepEqual(res.tokens, ['ExponentPushToken[guest1]']);
  assert.equal(res.host_username, 'push_a');
  assert.equal(res.code, code);
  // Segunda vez: ya notificada.
  assert.deepEqual((await claim(host, code)).tokens, []);

  // Avisos apagados.
  await db.query(`update public.user_settings set notify_challenges = false where user_id = $1`, [
    guest,
  ]);
  assert.deepEqual((await claim(host, (await invite(host, guest)).code)).tokens, []);
  await db.query(`update public.user_settings set notify_challenges = true where user_id = $1`, [
    guest,
  ]);

  // Invitación cancelada (se creó otra).
  const first = await invite(host, guest);
  await invite(host, guest);
  assert.deepEqual((await claim(host, first.code)).tokens, []);

  // Desafío con código (sin invitado): nada.
  const open = (await rpc(host, 'select public.create_friend_challenge() as r'))[0].r;
  assert.deepEqual((await claim(host, open.code)).tokens, []);
});

test('tokens no registrados se desactivan; permisos', async () => {
  const a = await player('perm_push@test.dev');
  await register(a, 'ExponentPushToken[dead1]');
  await service('select public.deactivate_push_tokens($1)', [['ExponentPushToken[dead1]']]);
  assert.deepEqual(await tokensOf(a), []);

  await assert.rejects(rpc(a, 'select * from public.push_tokens'), /permission denied/);
  await assert.rejects(
    rpc(a, 'select public.claim_battle_invite_push($1, $2)', [a, 'ABCDEF']),
    /permission denied/,
  );
  await assert.rejects(
    rpc(a, 'select public.deactivate_push_tokens($1)', [['x']]),
    /permission denied/,
  );
});

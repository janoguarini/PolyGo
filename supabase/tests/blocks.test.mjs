import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';

let db;

before(async () => {
  db = await createDb();
});

async function player(email, rating = 1000) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, email.split('@')[0]],
  );
  await db.query(
    `update public.player_ratings set rating = $2, peak_rating = greatest(peak_rating, $2) where user_id = $1`,
    [id, rating],
  );
  return id;
}

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows);
const block = (u, target) => rpc(u, 'select public.block_user($1)', [target]);
const unblock = (u, target) => rpc(u, 'select public.unblock_user($1)', [target]);
const blocked = (u) => rpc(u, 'select * from public.get_blocked_users()');
const join = async (u) => (await rpc(u, 'select public.join_human_queue() as r'))[0].r;
const leave = (u) => rpc(u, 'select public.leave_human_queue()');
const createChallenge = async (u) =>
  (await rpc(u, 'select public.create_friend_challenge() as r'))[0].r;
const accept = async (u, code) =>
  (await rpc(u, 'select public.accept_friend_challenge($1) as r', [code]))[0].r;

test('bloquear y desbloquear: idempotente, la lista es sólo de quien bloquea', async () => {
  const a = await player('blk_a@test.dev');
  const b = await player('blk_b@test.dev');

  await block(a, b);
  await block(a, b);
  const list = await blocked(a);
  assert.equal(list.length, 1);
  assert.equal(list[0].user_id, b);
  assert.equal(list[0].username, 'blk_b');
  // El bloqueado no ve nada.
  assert.deepEqual(await blocked(b), []);

  await unblock(a, b);
  assert.deepEqual(await blocked(a), []);
  // Volver a bloquear después de desbloquear.
  await block(a, b);
  assert.equal((await blocked(a)).length, 1);
  await unblock(a, b);

  await assert.rejects(block(a, a), /cannot_block_self/);
  await assert.rejects(block(a, '00000000-0000-0000-0000-000000000000'), /user_not_found/);
});

test('la cola ranked no empareja a quienes se bloquearon, en ningún sentido', async () => {
  const a = await player('q_a@test.dev', 1000);
  const b = await player('q_b@test.dev', 1000);
  await block(b, a); // b bloqueó a a

  assert.equal((await join(a)).status, 'waiting');
  assert.equal((await join(b)).status, 'waiting');
  assert.equal((await join(a)).status, 'waiting');

  // Al desbloquear, se emparejan.
  await unblock(b, a);
  assert.equal((await join(b)).status, 'matched');
  await leave(a);
  await leave(b);
});

test('un bloqueado no puede entrar al desafío, en ningún sentido', async () => {
  const host = await player('ch_host@test.dev');
  const guest = await player('ch_guest@test.dev');

  const { code } = await createChallenge(host);
  await block(host, guest);
  await assert.rejects(accept(guest, code), /challenge_not_found/);
  // El desafío sigue abierto para otros: sólo el bloqueado no puede entrar.
  const status = (await rpc(host, 'select public.friend_challenge_status($1) as r', [code]))[0].r;
  assert.equal(status.status, 'waiting');
  const other = await player('ch_other@test.dev');
  assert.equal((await accept(other, code)).status, 'matched');

  const again = await createChallenge(host);
  await assert.rejects(accept(guest, again.code), /challenge_not_found/);

  // Al revés: si el invitado bloqueó al anfitrión, tampoco.
  await unblock(host, guest);
  await block(guest, host);
  const third = await createChallenge(host);
  await assert.rejects(accept(guest, third.code), /challenge_not_found/);

  await unblock(guest, host);
  const fourth = await createChallenge(host);
  assert.equal((await accept(guest, fourth.code)).status, 'matched');
});

test('permisos: la tabla no se lee ni escribe desde la app y anon no bloquea', async () => {
  const a = await player('perm_blk_a@test.dev');
  const b = await player('perm_blk_b@test.dev');
  await assert.rejects(
    as(db, 'authenticated', a, () =>
      db.query(`insert into public.user_blocks (blocker_id, blocked_id) values ($1, $2)`, [a, b]),
    ),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', a, () => db.query(`select * from public.user_blocks`)),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', a, () => db.query(`select public.is_blocked_between($1, $2)`, [a, b])),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'anon', null, () => db.query(`select public.block_user($1)`, [b])),
    /permission denied/,
  );
});

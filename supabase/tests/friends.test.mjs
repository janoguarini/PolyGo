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
const send = async (u, target) =>
  (await rpc(u, 'select public.send_friend_request($1) as r', [target]))[0].r;
const respond = async (u, from, accept) =>
  (await rpc(u, 'select public.respond_friend_request($1, $2) as r', [from, accept]))[0].r;
const remove = (u, target) => rpc(u, 'select public.remove_friend($1)', [target]);
const friends = (u) => rpc(u, 'select * from public.get_friends()');
const search = (u, q) => rpc(u, 'select * from public.search_players($1)', [q]);
const profile = async (u, target) =>
  (await rpc(u, 'select public.get_public_profile($1) as r', [target]))[0].r;

test('solicitud, aceptar y sacar; la lista muestra el estado desde cada lado', async () => {
  const a = await player('fr_a@test.dev');
  const b = await player('fr_b@test.dev');

  assert.equal(await send(a, b), 'outgoing');
  assert.equal(await send(a, b), 'outgoing');
  assert.equal((await friends(a))[0].state, 'outgoing');
  assert.equal((await friends(b))[0].state, 'incoming');
  assert.equal((await profile(b, a)).friendship, 'incoming');

  assert.equal(await respond(b, a, true), 'friends');
  const [row] = await friends(a);
  assert.equal(row.user_id, b);
  assert.equal(row.state, 'friends');
  assert.equal(row.username, 'fr_b');
  assert.equal((await profile(a, b)).friendship, 'friends');

  await remove(b, a);
  assert.deepEqual(await friends(a), []);
  // Volver a pedir después de sacar reusa la fila.
  assert.equal(await send(b, a), 'outgoing');
  assert.equal((await friends(a))[0].state, 'incoming');
  // Mandarle al que ya me mandó = aceptar.
  assert.equal(await send(a, b), 'friends');

  await assert.rejects(send(a, a), /cannot_friend_self/);
  await assert.rejects(send(a, '00000000-0000-0000-0000-000000000000'), /user_not_found/);
  await assert.rejects(respond(a, b, true), /friend_request_not_found/);
});

test('rechazar: no se avisa y no se puede reenviar enseguida; cancelar la propia', async () => {
  const a = await player('dec_a@test.dev');
  const b = await player('dec_b@test.dev');
  await send(a, b);
  assert.equal(await respond(b, a, false), 'none');
  assert.deepEqual(await friends(b), []);
  // a no se entera: sigue viéndola como enviada en la respuesta, pero no le llega a b.
  assert.equal(await send(a, b), 'outgoing');
  assert.deepEqual(await friends(b), []);
  // b sí puede mandarle después.
  assert.equal(await send(b, a), 'outgoing');
  // Quien la mandó la puede cancelar.
  await remove(b, a);
  assert.deepEqual(await friends(a), []);
});

test('bloquear termina la amistad y oculta en la búsqueda; sacar no deja solicitudes ajenas', async () => {
  const a = await player('blkf_a@test.dev');
  const b = await player('blkf_b@test.dev');
  await send(a, b);
  await respond(b, a, true);
  await rpc(a, 'select public.block_user($1)', [b]);
  assert.deepEqual(await friends(a), []);
  assert.deepEqual(await friends(b), []);
  await assert.rejects(send(b, a), /user_not_found/);
  assert.deepEqual(await search(b, 'blkf_a'), []);
  await rpc(a, 'select public.unblock_user($1)', [b]);
  assert.equal((await search(b, 'blkf_a')).length, 1);

  // Sacar una solicitud recibida no la anula (eso es rechazar).
  await send(b, a);
  await remove(a, b);
  assert.equal((await friends(a))[0].state, 'incoming');
});

test('buscar por nombre o código; sin uno mismo', async () => {
  const me = await player('srch_me@test.dev');
  const other = await player('srch_other@test.dev');
  const names = (rows) => rows.map((r) => r.username);
  assert.deepEqual(names(await search(me, 'srch_')), ['srch_other']);
  assert.deepEqual(names(await search(me, '@SRCH_OT')), ['srch_other']);
  assert.deepEqual(await search(me, 's'), []);
  const code = (await db.query('select public_code from public.profiles where id = $1', [other]))
    .rows[0].public_code;
  assert.deepEqual(names(await search(me, code.toLowerCase())), ['srch_other']);
  assert.deepEqual(names(await search(me, code.replace('-', ''))), ['srch_other']);
  assert.equal((await search(me, code))[0].state, 'none');
});

test('«Sólo amigos» abre el perfil únicamente a los amigos', async () => {
  const owner = await player('vis_owner@test.dev');
  const friend = await player('vis_friend@test.dev');
  const stranger = await player('vis_stranger@test.dev');
  await db.query(`update public.user_settings set profile_visibility = 'friends' where user_id = $1`, [
    owner,
  ]);
  await send(friend, owner);
  await respond(owner, friend, true);
  assert.equal((await profile(friend, owner)).is_public, true);
  assert.equal((await profile(stranger, owner)).is_public, false);
  assert.equal((await profile(owner, owner)).friendship, 'self');
});

test('permisos: la tabla no se lee desde la app y anon no manda solicitudes', async () => {
  const a = await player('perm_fr_a@test.dev');
  const b = await player('perm_fr_b@test.dev');
  await assert.rejects(
    as(db, 'authenticated', a, () => db.query(`select * from public.friendships`)),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', a, () => db.query(`select public.are_friends($1, $2)`, [a, b])),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'anon', null, () => db.query(`select public.send_friend_request($1)`, [b])),
    /permission denied/,
  );
});

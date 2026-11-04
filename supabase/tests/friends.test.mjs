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
  await db.query(
    `update public.user_settings set profile_visibility = 'friends' where user_id = $1`,
    [owner],
  );
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

// ---------- en línea, invitaciones, actividad y retos ----------
const ping = async (u) => (await rpc(u, 'select public.ping_presence() as r'))[0].r;
const friendsV2 = (u) => rpc(u, 'select * from public.get_friends_v2()');
const invite = async (u, target) =>
  (await rpc(u, 'select public.invite_friend_to_battle($1) as r', [target]))[0].r;
const challengeStatus = async (u, code) =>
  (await rpc(u, 'select public.friend_challenge_status($1) as r', [code]))[0].r;
const acceptChallenge = async (u, code) =>
  (await rpc(u, 'select public.accept_friend_challenge($1) as r', [code]))[0].r;
const finish = (u, id, score) =>
  rpc(u, 'select public.finish_human_match($1, $2, $3, $4, false)', [id, score, 5, 8]);
const TZ = 'America/Argentina/Buenos_Aires';
const daily = async (u) =>
  (await rpc(u, 'select public.get_friend_daily_missions($1) as r', [TZ]))[0].r;
const claim = async (u, id) =>
  (await rpc(u, 'select public.claim_friend_daily_mission($1, $2) as r', [id, TZ]))[0].r;

async function friendsPair(prefix) {
  const a = await player(`${prefix}_a@test.dev`);
  const b = await player(`${prefix}_b@test.dev`);
  await send(a, b);
  await respond(b, a, true);
  return [a, b];
}

test('en línea: el latido marca presencia y se puede ocultar', async () => {
  const [a, b] = await friendsPair('onl');
  assert.equal((await friendsV2(a))[0].online, false);
  await ping(b);
  let [row] = await friendsV2(a);
  assert.equal(row.online, true);
  assert.ok(row.last_seen_at);
  await db.query(`update public.user_settings set show_online = false where user_id = $1`, [b]);
  [row] = await friendsV2(a);
  assert.equal(row.online, false);
  assert.equal(row.last_seen_at, null);
  // Latido viejo = desconectado.
  await db.query(`update public.user_settings set show_online = true where user_id = $1`, [b]);
  await db.query(
    `update public.user_presence set last_seen_at = now() - interval '3 minutes' where user_id = $1`,
    [b],
  );
  assert.equal((await friendsV2(a))[0].online, false);
});

test('invitar a un amigo: sólo él la ve y la acepta; rechazar avisa a quien desafía', async () => {
  const [host, guest] = await friendsPair('inv');
  const stranger = await player('inv_stranger@test.dev');
  await assert.rejects(invite(host, stranger), /not_friends/);

  const { code } = await invite(host, guest);
  assert.equal((await ping(guest)).invites[0].code, code);
  assert.deepEqual((await ping(stranger)).invites, []);
  assert.equal((await friendsV2(host))[0].invited_by_me, true);
  assert.equal((await friendsV2(guest))[0].invite_code, code);
  await assert.rejects(acceptChallenge(stranger, code), /challenge_not_found/);

  await rpc(guest, 'select public.decline_battle_invite($1)', [code]);
  assert.equal((await challengeStatus(host, code)).status, 'declined');
  assert.deepEqual((await ping(guest)).invites, []);

  // Una invitación nueva anula la anterior y se juega.
  const second = await invite(host, guest);
  const third = await invite(host, guest);
  assert.equal((await challengeStatus(host, second.code)).status, 'expired');
  assert.equal((await acceptChallenge(guest, third.code)).status, 'matched');

  // Si quien desafía deja de consultar, la invitación desaparece.
  const fourth = await invite(host, guest);
  await db.query(
    `update public.friend_challenges set seen_at = now() - interval '11 seconds' where code = $1`,
    [fourth.code],
  );
  assert.deepEqual((await ping(guest)).invites, []);
});

test('misiones diarias: progreso real, se cobran una vez por día y muestran amigos que las completaron', async () => {
  const [a, b] = await friendsPair('wk');
  let state = await daily(a);
  assert.equal(state.challenges.length, 3);
  const friendly = () => state.challenges.find((c) => c.id === 'friendly_1');
  assert.equal(friendly().progress, 0);
  await assert.rejects(claim(a, 'friendly_1'), /challenge_incomplete/);

  // Un amistoso entre los dos, terminado.
  const { code } = await invite(a, b);
  const { battle_id } = await acceptChallenge(b, code);
  await db.query(
    `update public.battles set started_at = now() - interval '76 seconds' where id = $1`,
    [battle_id],
  );
  await finish(a, battle_id, 500);
  await finish(b, battle_id, 300);

  state = await daily(a);
  assert.equal(friendly().progress, 1);
  assert.equal(friendly().friends_done, 1);
  assert.equal(friendly().friends[0].username, 'wk_b');
  const play = state.challenges.find((c) => c.id === 'play_3');
  assert.equal(play.progress, 1);

  const res = await claim(a, 'friendly_1');
  assert.equal(res.polys, 15);
  await assert.rejects(claim(a, 'friendly_1'), /already_claimed/);
  state = await daily(a);
  assert.equal(friendly().claimed, true);
});

test('actividad: subidas de rango y logros de amigos; un perfil privado sólo muestra el rango', async () => {
  const [me, friend] = await friendsPair('act');
  await db.query(
    `with b as (insert into public.battles (language_code) select target_language from public.profiles where id = $1 returning id, language_code)
     insert into public.rating_history (user_id, language_code, battle_id, reason, rating_before, rating_after)
     select $1, b.language_code, b.id, 'battle', 395, 412 from b`,
    [friend],
  );
  await db.query(
    `insert into public.learning_sessions (id, user_id, kind, started_at, duration_seconds, total_answers, first_try_total, first_try_correct, local_date)
     values (gen_random_uuid(), $1, 'review', now(), 60, 25, 25, 20, current_date)`,
    [friend],
  );
  const kinds = async () =>
    (await rpc(me, 'select * from public.get_friend_activity()')).map((e) => e.kind).sort();
  // user_settings arranca en 'private' o 'public' según el alta: forzarlo.
  await db.query(
    `update public.user_settings set profile_visibility = 'friends' where user_id = $1`,
    [friend],
  );
  assert.deepEqual(await kinds(), ['new_friend', 'rank_up', 'reviews_week']);
  const rank = (await rpc(me, 'select * from public.get_friend_activity()')).find(
    (e) => e.kind === 'rank_up',
  );
  assert.equal(rank.value, 395);
  assert.equal(rank.value2, 412);

  await db.query(
    `update public.user_settings set profile_visibility = 'private' where user_id = $1`,
    [friend],
  );
  assert.deepEqual(await kinds(), ['new_friend', 'rank_up']);
});

test('los valores de las misiones diarias coinciden con shared/friendChallenges.ts', async () => {
  const { FRIEND_DAILY_MISSIONS } = await import('../../shared/friendChallenges.ts');
  const sql = (await db.query('select public.friend_daily_config() as c')).rows[0].c;
  assert.deepEqual(
    sql,
    FRIEND_DAILY_MISSIONS.map(({ id, target, reward }) => ({ id, target, reward })),
  );
});

test('rechazo silencioso: quien la mandó la sigue viendo pendiente y la puede cancelar', async () => {
  const a = await player('sil_a@test.dev');
  const b = await player('sil_b@test.dev');
  await send(a, b);
  await respond(b, a, false);
  assert.equal((await friendsV2(a))[0].state, 'outgoing');
  assert.equal((await search(a, 'sil_b'))[0].state, 'outgoing');
  assert.equal((await profile(a, b)).friendship, 'outgoing');
  // Para quien la rechazó, no hay nada.
  assert.deepEqual(await friendsV2(b), []);
  assert.equal((await search(b, 'sil_a'))[0].state, 'none');

  await remove(a, b);
  assert.deepEqual(await friendsV2(a), []);
  assert.equal((await search(a, 'sil_b'))[0].state, 'none');

  // Pasada la ventana, desaparece sola.
  await send(a, b);
  await respond(b, a, false);
  await db.query(
    `update public.friendships set responded_at = now() - interval '8 days' where requester_id = $1`,
    [a],
  );
  assert.deepEqual(await friendsV2(a), []);
  assert.equal(await send(a, b), 'outgoing');
  assert.equal((await friendsV2(b))[0].state, 'incoming');
});

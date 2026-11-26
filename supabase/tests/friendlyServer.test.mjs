import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

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

async function friends(prefix) {
  const a = await player(`${prefix}_a@test.dev`);
  const b = await player(`${prefix}_b@test.dev`);
  await rpc(a, 'select public.send_friend_request($1)', [b]);
  await rpc(b, 'select public.respond_friend_request($1, true)', [a]);
  return [a, b];
}
const invite = async (host, guest) =>
  (await rpc(host, 'select public.invite_friend_to_battle($1) as r', [guest]))[0].r;
const hostWait = async (code, host) =>
  (await service('select public.battle_server_challenge_host($1, $2) as r', [code, host]))[0].r;
const join = async (code, guest) =>
  (await service('select public.battle_server_challenge_join($1, $2) as r', [code, guest]))[0].r;
const startFriendly = (id, code, host, guest) =>
  service('select public.start_friendly_battle($1, $2, $3, $4, 3::smallint)', [
    id,
    code,
    host,
    guest,
  ]);

test('amistoso en el servidor: espera, entra, se guarda sin ELO y cuenta para «Jugá un amistoso»', async () => {
  const [host, guest] = await friends('fs');
  const { code } = await invite(host, guest);

  const waiting = await hostWait(code, host);
  assert.equal(typeof waiting.language_code, 'string');
  assert.equal(waiting.invitee_id, guest);
  assert.ok(waiting.expires_at > Date.now());

  assert.deepEqual(await join(code.toLowerCase(), guest), {
    host_id: host,
    language_code: waiting.language_code,
  });

  const battleId = randomUUID();
  await startFriendly(battleId, code, host, guest);
  await startFriendly(battleId, code, host, guest); // reintento: idempotente
  const battle = (await db.query('select * from public.battles where id = $1', [battleId])).rows[0];
  assert.equal(battle.is_ranked, false);
  assert.equal(battle.protocol_version, 3);
  const seats = (
    await db.query(
      'select slot, user_id from public.battle_players where battle_id = $1 order by slot',
      [battleId],
    )
  ).rows;
  assert.deepEqual(
    seats.map((s) => s.user_id),
    [host, guest],
  );
  const challenge = (
    await db.query('select * from public.friend_challenges where code = $1', [code])
  ).rows[0];
  assert.equal(challenge.battle_id, battleId);
  assert.equal(challenge.guest_id, guest);

  // Otra partida con el mismo código: no.
  await assert.rejects(startFriendly(randomUUID(), code, host, guest), /challenge_taken/);
  await assert.rejects(join(code, guest), /challenge_taken/);

  // settle_battle liquida el amistoso sin tocar el rating.
  const ratingBefore = (
    await db.query('select rating from public.player_ratings where user_id = $1', [host])
  ).rows[0]?.rating;
  await service(`select public.settle_battle($1, 'completed', $2::jsonb)`, [
    battleId,
    JSON.stringify([
      {
        slot: 1,
        score: 900,
        correct: 9,
        answered: 10,
        result: 'win',
        forfeited: false,
        rating_before: null,
        games_played_before: null,
        rating_after: null,
      },
      {
        slot: 2,
        score: 400,
        correct: 4,
        answered: 8,
        result: 'loss',
        forfeited: false,
        rating_before: null,
        games_played_before: null,
        rating_after: null,
      },
    ]),
  ]);
  const ratingAfter = (
    await db.query('select rating from public.player_ratings where user_id = $1', [host])
  ).rows[0]?.rating;
  assert.equal(ratingAfter, ratingBefore);
  const progress = (
    await service(
      `select public.friend_challenge_progress($1, 'friendly_1', now() - interval '1 day') as r`,
      [guest],
    )
  )[0].r;
  assert.equal(progress, 1);
});

test('reglas: el código es del anfitrión, el dirigido sólo para su amigo, sin bloqueos ni vencidos', async () => {
  const [host, guest] = await friends('fr');
  const other = await player('fr_other@test.dev');
  const { code } = await invite(host, guest);

  await assert.rejects(hostWait(code, other), /challenge_not_found/);
  await assert.rejects(join(code, other), /challenge_not_found/);
  await assert.rejects(join(code, host), /own_challenge/);
  await assert.rejects(join('ZZZZZZ', guest), /challenge_not_found/);

  await db.query(
    `update public.friend_challenges set expires_at = now() - interval '1 second' where code = $1`,
    [code],
  );
  await assert.rejects(hostWait(code, host), /challenge_expired/);
  await assert.rejects(join(code, guest), /challenge_expired/);
});

test('sólo el servidor (service_role) puede usarlas', async () => {
  const [host, guest] = await friends('fp');
  const { code } = await invite(host, guest);
  await assert.rejects(
    rpc(host, 'select public.battle_server_challenge_host($1, $2)', [code, host]),
    /permission denied/,
  );
  await assert.rejects(
    rpc(guest, 'select public.battle_server_challenge_join($1, $2)', [code, guest]),
    /permission denied/,
  );
  await assert.rejects(
    rpc(host, 'select public.start_friendly_battle($1, $2, $3, $4, 3::smallint)', [
      randomUUID(),
      code,
      host,
      guest,
    ]),
    /permission denied/,
  );
});

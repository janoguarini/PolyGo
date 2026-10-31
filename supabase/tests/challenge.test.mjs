import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';

let db;

before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

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
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]?.r);

const create = (u) => rpc(u, 'select public.create_friend_challenge() as r');
const status = (u, code) => rpc(u, 'select public.friend_challenge_status($1) as r', [code]);
const accept = (u, code) => rpc(u, 'select public.accept_friend_challenge($1) as r', [code]);
const cancel = (u, code) => rpc(u, 'select public.cancel_friend_challenge($1) as r', [code]);
const match = (u, id) => rpc(u, 'select public.get_human_match($1) as r', [id]);
const finish = (u, id, score, correct, answered, forfeit = false) =>
  rpc(u, 'select public.finish_human_match($1, $2, $3, $4, $5) as r', [
    id,
    score,
    correct,
    answered,
    forfeit,
  ]);

const rejects = (promise, code) => assert.rejects(promise, new RegExp(code));

test('desafío: el amigo entra con el código (sin importar mayúsculas) y juegan la misma partida', async () => {
  const host = await player('chal_host@test.dev', 1000);
  const guest = await player('chal_guest@test.dev', 1600);

  const { code, expires_at } = await create(host);
  assert.match(code, /^[A-HJKMNP-Z2-9]{6}$/);
  assert.ok(expires_at > Date.now());
  assert.deepEqual(await status(host, code), { status: 'waiting', battle_id: null });

  const accepted = await accept(guest, ` ${code.toLowerCase()} `);
  assert.equal(accepted.status, 'matched');
  // Reintento del mismo amigo: la misma partida.
  assert.deepEqual(await accept(guest, code), accepted);
  assert.deepEqual(await status(host, code), { status: 'matched', battle_id: accepted.battle_id });

  const a = await match(host, accepted.battle_id);
  const b = await match(guest, accepted.battle_id);
  assert.equal(a.ranked, false);
  assert.equal(a.your_slot, 1);
  assert.equal(b.your_slot, 2);
  assert.deepEqual(a.questions, b.questions);
  assert.equal(a.questions.length, 40);

  // Un tercero ya no puede entrar.
  const third = await player('chal_third@test.dev');
  await rejects(accept(third, code), 'challenge_taken');
});

test('amistoso: guarda el resultado pero no mueve ELO, partidas jugadas ni historial', async () => {
  const host = await player('fr_host@test.dev', 1200);
  const guest = await player('fr_guest@test.dev', 1200);
  const { code } = await create(host);
  const { battle_id } = await accept(guest, code);
  await db.query(
    `update public.battles set started_at = now() - interval '76 seconds' where id = $1`,
    [battle_id],
  );

  assert.deepEqual(await finish(host, battle_id, 900, 9, 10), { pending: true });
  const res = await finish(guest, battle_id, 400, 4, 8);
  assert.equal(res.pending, false);
  assert.equal(res.ranked, false);
  assert.equal(res.status, 'completed');
  const [p1, p2] = res.players;
  assert.equal(p1.result, 'win');
  assert.equal(p2.result, 'loss');
  assert.equal(p1.rating_after, null);
  assert.deepEqual(res.achievements, {});

  const ratings = (
    await db.query(
      `select rating, games_played, wins, losses from public.player_ratings where user_id = any($1)`,
      [[host, guest]],
    )
  ).rows;
  for (const r of ratings)
    assert.deepEqual(r, { rating: 1200, games_played: 0, wins: 0, losses: 0 });
  const history = await one(
    `select count(*)::int as n from public.rating_history where battle_id = $1`,
    [battle_id],
  );
  assert.equal(history.n, 0);
});

test('códigos inválidos: propio, inexistente, vencido, cancelado o con el anfitrión ausente', async () => {
  const host = await player('bad_host@test.dev');
  const guest = await player('bad_guest@test.dev');

  const { code } = await create(host);
  await rejects(accept(host, code), 'own_challenge');
  await rejects(accept(guest, 'ZZZZZZ'), 'challenge_not_found');

  // Si el anfitrión dejó de consultar, el código ya no sirve.
  await db.query(
    `update public.friend_challenges set seen_at = now() - interval '11 seconds' where code = $1`,
    [code],
  );
  await rejects(accept(guest, code), 'host_gone');

  await db.query(
    `update public.friend_challenges set seen_at = now(), expires_at = now() - interval '1 second' where code = $1`,
    [code],
  );
  await rejects(accept(guest, code), 'challenge_expired');
  assert.equal((await status(host, code)).status, 'expired');

  // Crear uno nuevo anula el anterior; cancelar también.
  const first = await create(host);
  const second = await create(host);
  await rejects(accept(guest, first.code), 'challenge_expired');
  await cancel(host, second.code);
  await rejects(accept(guest, second.code), 'challenge_expired');

  // Sólo el anfitrión consulta su desafío.
  await rejects(status(guest, second.code), 'challenge_not_found');
});

test('permisos: anon no crea desafíos y la tabla no se lee directo', async () => {
  await assert.rejects(
    as(db, 'anon', null, () => db.query('select public.create_friend_challenge()')),
    /permission denied/,
  );
  const host = await player('perm_host@test.dev');
  await assert.rejects(
    as(db, 'authenticated', host, () => db.query('select * from public.friend_challenges')),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', host, () => db.query('select public.new_challenge_code()')),
    /permission denied/,
  );
});

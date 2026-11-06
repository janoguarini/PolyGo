// Migración 20261106150000_stale_sweep_server_only: el barrido del servidor de partidas
// (cancel_stale_battles, server/src/index.ts) sólo cancela partidas creadas por el servidor; las del
// flujo viejo sin servidor se cierran con sus propias reglas (abandono, liquidación y cupo).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, createUser, as } from './harness.mjs';

let db;

before(async () => {
  db = await createDb();
});

/** Como server/src/index.ts: partidas abiertas con más de 5 min. */
const STALE_AFTER_SECONDS = 300;

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const server = (sql, params = []) =>
  as(db, 'service_role', null, async () => (await db.query(sql, params)).rows[0]);
const client = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]?.r);

/** Jugador posicionado (perder le resta ELO). */
async function player(email, { rating = 500, wins = 3 } = {}) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now(), target_language = 'en'
     where id = $1`,
    [id, email.split('@')[0]],
  );
  await db.query(
    `update public.player_ratings set rating = $2, peak_rating = $2, wins = $3, games_played = $3
     where user_id = $1 and language_code = 'en'`,
    [id, rating, wins],
  );
  return id;
}

/** Lleva la partida al pasado: creada e iniciada hace `seconds`. */
const age = (id, seconds) =>
  db.query(
    `update public.battles set created_at = now() - make_interval(secs => $2),
       started_at = now() - make_interval(secs => $2) where id = $1`,
    [id, seconds],
  );

const sweep = async () =>
  (await server('select public.cancel_stale_battles($1) as n', [STALE_AFTER_SECONDS])).n;
const statusOf = async (id) =>
  (await one('select status from public.battles where id = $1', [id])).status;
const used = async (u) =>
  (await server(`select public.bot_calibration_used($1, 'en') as n`, [u])).n;
const ratingOf = (u) =>
  one(
    `select rating, games_played from public.player_ratings where user_id = $1 and language_code = 'en'`,
    [u],
  );

test('flujo viejo contra bot: el barrido no cancela el abandono; cuenta en el cupo y se cierra como derrota', async () => {
  const u = await player('viejobot@sw.dev');
  const before = await ratingOf(u);
  // El jugador empieza una partida en la app vieja y la cierra perdiendo.
  const m = await client(u, 'select public.start_bot_match() as r');
  assert.equal(await used(u), 1);

  await age(m.battle_id, 6 * 60);
  assert.equal(await sweep(), 0, 'no es una partida del servidor');
  assert.equal(await statusOf(m.battle_id), 'in_progress');
  assert.equal(await used(u), 1, 'el abandono sigue consumiendo cupo');

  // Regla del flujo viejo: al empezar otra, la abierta se cierra como abandono (con ELO).
  await client(u, 'select public.start_bot_match() as r');
  assert.equal(await statusOf(m.battle_id), 'forfeited');
  const after = await ratingOf(u);
  assert.ok(after.rating < before.rating, 'el abandono resta ELO');
  assert.equal(after.games_played, before.games_played + 1);
  assert.equal(await used(u), 2);
});

test('flujo viejo contra bot: un cierre tardío (entre 5 y 15 min) se sigue liquidando', async () => {
  const u = await player('tarde@sw.dev');
  const m = await client(u, 'select public.start_bot_match() as r');
  await age(m.battle_id, 8 * 60);
  assert.equal(await sweep(), 0);
  const r = await client(u, 'select public.finish_bot_match($1, 0, 0, 0, false) as r', [
    m.battle_id,
  ]);
  assert.equal(r.status, 'completed');
  assert.notEqual(r.me.rating_after, null);
});

test('flujo viejo entre personas: el barrido no cancela la partida abierta', async () => {
  const a = await player('viejoa@sw.dev');
  const b = await player('viejob@sw.dev');
  assert.equal((await client(a, 'select public.join_human_queue() as r')).status, 'waiting');
  const m = await client(b, 'select public.join_human_queue() as r');
  assert.equal(m.status, 'matched');

  await age(m.battle_id, 6 * 60);
  assert.equal(await sweep(), 0);
  assert.equal(await statusOf(m.battle_id), 'in_progress');
});

test('partidas del servidor: el barrido cancela las huérfanas (sin ELO y sin consumir cupo)', async () => {
  const u = await player('srvbot@sw.dev');
  const a = await player('srva@sw.dev');
  const b = await player('srvb@sw.dev');
  const before = await ratingOf(u);

  const botId = randomUUID();
  const started = (
    await server(
      `select public.start_bot_battle_v2($1, 'en', $2, 'Kiko', 'crown', 500, 2::smallint, true) as r`,
      [botId, u],
    )
  ).r;
  assert.equal(started.rated, true);
  assert.equal(await used(u), 1);

  const humanId = randomUUID();
  await server(`select public.start_battle($1, 'en', $2, $3, 2::smallint)`, [humanId, a, b]);

  // Recientes: el barrido no las toca (una partida dura ~2 min).
  assert.equal(await sweep(), 0);

  await age(botId, 6 * 60);
  await age(humanId, 6 * 60);
  assert.equal(await sweep(), 2);
  assert.equal(await statusOf(botId), 'cancelled');
  assert.equal(await statusOf(humanId), 'cancelled');
  // Cancelada = no consume cupo y no mueve el ELO.
  assert.equal(await used(u), 0);
  assert.deepEqual(await ratingOf(u), before);
});

test('el barrido no toca partidas terminadas', async () => {
  const u = await player('fin@sw.dev');
  const id = randomUUID();
  await server(
    `select public.start_bot_battle_v2($1, 'en', $2, 'Luna', 'bolt', 500, 2::smallint, true) as r`,
    [id, u],
  );
  await db.query(`update public.battles set status = 'forfeited', ended_at = now() where id = $1`, [
    id,
  ]);
  await age(id, 60 * 60);
  assert.equal(await sweep(), 0);
  assert.equal(await statusOf(id), 'forfeited');
  assert.equal(await used(u), 1, 'el abandono liquidado sigue contando');
});

test('permisos: el barrido sólo lo llama el servidor', async () => {
  const u = await player('perm@sw.dev');
  await assert.rejects(
    as(db, 'authenticated', u, () => db.query('select public.cancel_stale_battles(300)')),
    /permission denied/,
  );
});

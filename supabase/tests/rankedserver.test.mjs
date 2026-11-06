// Migración 20261104150000_ranked_server_authority: cupo de calibración contra bots, partidas no
// ranked, contexto de liquidación con victorias y la corrección del guion del bot en chino.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, createUser, as } from './harness.mjs';
import { BOT_CALIBRATION } from '../../shared/bots.ts';
import { computeRatingChange, isPlaced, RATING_CONFIG } from '../../shared/ranking.ts';
import { answerPoints, applyPoints } from '../../shared/wordRush.ts';

let db;

before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const server = (sql, params = []) =>
  as(db, 'service_role', null, async () => (await db.query(sql, params)).rows);
const client = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]);

async function player(email, { rating = 300, wins = 1, language = 'en' } = {}) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now(), target_language = $3
     where id = $1`,
    [id, email.split('@')[0], language],
  );
  await db.query(
    `insert into public.player_ratings (user_id, language_code) values ($1, $2) on conflict do nothing`,
    [id, language],
  );
  await db.query(
    `update public.player_ratings set rating = $3, peak_rating = $3, wins = $4, games_played = $4
     where user_id = $1 and language_code = $2`,
    [id, language, rating, wins],
  );
  return id;
}

/** Como server/src/supabaseStore.ts: start_bot_battle_v2 pidiendo calibración. */
async function startBot(userId, { id = randomUUID(), language = 'en', rated = true } = {}) {
  const [{ r }] = await server(
    `select public.start_bot_battle_v2($1, $2, $3, 'Kiko', 'crown', 320, 2::smallint, $4) as r`,
    [id, language, userId, rated],
  );
  return { id, ...r };
}

const context = (id) =>
  server('select * from public.battle_settlement_context_v2($1, $2) order by slot', [
    id,
    RATING_CONFIG.repeatOpponentWindowHours,
  ]);

/** Como server/src/settlement.ts: el jugador (slot 1) gana o pierde contra el bot. */
async function settleBot(id, outcome) {
  const ctx = await context(id);
  const me = ctx[0];
  const rated = ctx.every((c) => c.is_ranked);
  const change = computeRatingChange({
    rating: me.rating,
    opponentRating: 320,
    outcome,
    placed: isPlaced({ wins: me.wins }),
  });
  const players = [
    {
      slot: 1,
      score: outcome === 'win' ? 800 : 100,
      correct: 6,
      answered: 8,
      result: outcome,
      forfeited: false,
      rating_before: rated ? me.rating : null,
      games_played_before: rated ? me.games_played : null,
      rating_after: rated ? change.after : null,
    },
    {
      slot: 2,
      score: outcome === 'win' ? 100 : 800,
      correct: 3,
      answered: 5,
      result: outcome === 'win' ? 'loss' : 'win',
      forfeited: false,
      rating_before: null,
      games_played_before: null,
      rating_after: null,
    },
  ];
  const [{ r }] = await server(`select public.settle_battle($1, 'completed', $2::jsonb) as r`, [
    id,
    JSON.stringify(players),
  ]);
  return { r, change };
}

const ratingOf = (userId, language = 'en') =>
  one('select * from public.player_ratings where user_id = $1 and language_code = $2', [
    userId,
    language,
  ]);

test('el tope de calibración de la base coincide con BOT_CALIBRATION', async () => {
  const { n } = await one('select public.bot_calibration_limit() as n');
  assert.equal(n, BOT_CALIBRATION.ratedGames);
});

test('cupo: las primeras 3 partidas contra bots son de calibración y mueven el ELO; la 4.ª no', async () => {
  const u = await player('cupo@rs.dev');
  for (let i = 1; i <= BOT_CALIBRATION.ratedGames; i++) {
    const b = await startBot(u);
    assert.equal(b.rated, true, `partida ${i} de calibración`);
    assert.equal(b.calibration_used, i);
    assert.equal(b.calibration_limit, BOT_CALIBRATION.ratedGames);
    const before = await ratingOf(u);
    const { change } = await settleBot(b.id, 'win');
    const after = await ratingOf(u);
    assert.equal(after.rating, change.after);
    assert.equal(after.games_played, before.games_played + 1);
  }

  const before = await ratingOf(u);
  const history = await one(
    'select count(*)::int as c from public.rating_history where user_id = $1',
    [u],
  );
  const practice = await startBot(u);
  assert.equal(practice.rated, false, 'sin cupo: práctica');
  assert.equal(practice.calibration_used, BOT_CALIBRATION.ratedGames);
  const { is_ranked } = await one('select is_ranked from public.battles where id = $1', [
    practice.id,
  ]);
  assert.equal(is_ranked, false);

  const { r } = await settleBot(practice.id, 'win');
  assert.equal(r.duplicate, false);
  assert.deepEqual(r.achievements, {});
  const after = await ratingOf(u);
  assert.deepEqual(
    { rating: after.rating, games: after.games_played, wins: after.wins },
    { rating: before.rating, games: before.games_played, wins: before.wins },
    'no toca rating, partidas ni victorias',
  );
  const history2 = await one(
    'select count(*)::int as c from public.rating_history where user_id = $1',
    [u],
  );
  assert.equal(history2.c, history.c, 'sin historial de rating');
  const line = await one(
    'select result, score, rating_after from public.battle_players where battle_id = $1 and slot = 1',
    [practice.id],
  );
  assert.equal(line.result, 'win', 'el resultado se guarda');
  assert.equal(line.rating_after, null);
});

test('cupo: lo cancelado no lo consume; lo abandonado sí; reintentar el inicio no consume dos veces', async () => {
  const u = await player('cancel@rs.dev');
  const a = await startBot(u);
  await server('select public.cancel_battle($1)', [a.id]);
  const again = await startBot(u);
  assert.equal(again.calibration_used, 1, 'la cancelada no cuenta');

  // Mismo id: devuelve lo decidido y no usa otro lugar del cupo.
  const retry = await startBot(u, { id: again.id });
  assert.equal(retry.rated, true);
  assert.equal(retry.calibration_used, 1);
  const { c } = await one('select count(*)::int as c from public.battles where id = $1', [
    again.id,
  ]);
  assert.equal(c, 1);

  // Abandonar cuenta como partida jugada (y consume el cupo).
  await server(`select public.settle_battle($1, 'forfeited', $2::jsonb)`, [
    again.id,
    JSON.stringify([
      {
        slot: 1,
        score: 0,
        correct: 0,
        answered: 0,
        result: 'loss',
        forfeited: true,
        rating_before: 300,
        games_played_before: 1,
        rating_after: 300,
      },
      {
        slot: 2,
        score: 300,
        correct: 2,
        answered: 2,
        result: 'win',
        forfeited: false,
        rating_before: null,
        games_played_before: null,
        rating_after: null,
      },
    ]),
  ]);
  const third = await startBot(u);
  assert.equal(third.calibration_used, 2);

  // Reliquidar una partida no ranked tampoco duplica nada.
  const [{ r }] = await server(`select public.settle_battle($1, 'completed', '[]'::jsonb) as r`, [
    again.id,
  ]);
  assert.equal(r.duplicate, true);
});

test('cupo por idioma y contando las partidas del flujo viejo sin servidor', async () => {
  const u = await player('idiomas@rs.dev');
  // Partidas contra bots del flujo viejo (start_bot_match): cuentan para el cupo.
  for (let i = 0; i < 2; i++) {
    await client(u, 'select public.start_bot_match() as r');
  }
  const { n } = await one('select public.bot_calibration_used($1, $2) as n', [u, 'en']);
  // start_bot_match cierra como abandono la abierta anterior: las dos cuentan.
  assert.equal(n, 2);
  const en = await startBot(u);
  assert.equal(en.calibration_used, 3);
  assert.equal((await startBot(u)).rated, false, 'inglés agotado');

  // Otro idioma: cupo propio.
  await db.query(`insert into public.player_ratings (user_id, language_code) values ($1, 'it')`, [
    u,
  ]);
  const it = await startBot(u, { language: 'it' });
  assert.equal(it.rated, true);
  assert.equal(it.calibration_used, 1);

  // Sin rating en ese idioma no se puede jugar.
  await assert.rejects(startBot(u, { language: 'pt' }), /language_unavailable/);
});

test('práctica pedida sin calibración (p_rated = false) no consume el cupo', async () => {
  const u = await player('practica@rs.dev');
  const p = await startBot(u, { rated: false });
  assert.equal(p.rated, false);
  assert.equal(p.calibration_used, 0);
  assert.equal((await startBot(u)).rated, true);
});

test('contexto v2: victorias para "sin posicionar" y si la partida es ranked', async () => {
  const nuevo = await player('nuevo@rs.dev', { rating: 100, wins: 0 });
  const b = await startBot(nuevo);
  const [me, bot] = await context(b.id);
  assert.equal(me.wins, 0);
  assert.equal(me.is_ranked, true);
  assert.equal(bot.user_id, null);
  assert.equal(me.matches_in_window, 1, 'contra un bot no hay rival repetido');

  // Sin posicionar, perder no mueve el rating (lo calcula el servidor con shared/ranking.ts).
  const { change } = await settleBot(b.id, 'loss');
  assert.equal(change.delta, 0);
  assert.equal((await ratingOf(nuevo)).rating, 100);
});

test('permisos: las funciones nuevas sólo las llama el servidor', async () => {
  const u = await player('permisos@rs.dev');
  for (const sql of [
    `select public.start_bot_battle_v2(gen_random_uuid(), 'en', '${u}', 'Kiko', 'crown', 300, 2::smallint, true)`,
    `select public.bot_calibration_used('${u}', 'en')`,
    `select * from public.battle_settlement_context_v2(gen_random_uuid(), 24)`,
    `select public.settle_battle(gen_random_uuid(), 'completed', '[]'::jsonb)`,
  ]) {
    await assert.rejects(client(u, sql), /permission denied/, sql);
    await assert.rejects(
      as(db, 'anon', null, () => db.query(sql)),
      /permission denied/,
      sql,
    );
  }
  await assert.rejects(
    server(
      `select public.start_bot_battle_v2(gen_random_uuid(), 'en', $1, '', 'crown', 300, 2::smallint, true)`,
      [u],
    ),
    /invalid_players/,
  );
});

test('flujo viejo en chino desde Oro: la base puntúa al bot igual que la app (sin preguntas para escribir)', async () => {
  const u = await player('chino@rs.dev', { rating: 800, wins: 5, language: 'zh' });
  const { r: m } = await client(u, 'select public.start_bot_match() as r');
  assert.equal(m.writing, false, 'en chino no se escribe');
  await db.query(
    `update public.battles set started_at = now() - interval '80 seconds' where id = $1`,
    [m.battle_id],
  );
  // Puntaje del bot como lo calcula la app (localMatch.ts): sin margen extra en ninguna pregunta.
  let elapsed = 0;
  let score = 0;
  let streak = 0;
  let answered = 0;
  for (const move of m.script) {
    elapsed += move.d;
    if (elapsed > 75_000) break;
    streak = move.c ? streak + 1 : 0;
    score = applyPoints(score, answerPoints(move.c, move.d, streak));
    answered += 1;
  }
  const { r } = await client(u, 'select public.finish_bot_match($1, 0, 0, 0, false) as r', [
    m.battle_id,
  ]);
  assert.equal(r.bot.answered, answered);
  assert.equal(r.bot.score, score, 'antes la base le daba más bonus de velocidad al bot');
});

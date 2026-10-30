import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, createUser, as } from './harness.mjs';
import { computeRatingChange, RATING_CONFIG } from '../../shared/ranking.ts';

let db;
let alice;
let bob;
let carol;

before(async () => {
  db = await createDb();
  alice = await createUser(db, 'alice@test.dev');
  bob = await createUser(db, 'bob@test.dev');
  carol = await createUser(db, 'carol@test.dev');
  for (const [id, name] of [
    [alice, 'alice'],
    [bob, 'bob'],
    [carol, 'carol'],
  ]) {
    await db.query('update public.profiles set username = $2 where id = $1', [id, name]);
  }
});

const server = (sql, params = []) =>
  as(db, 'service_role', null, async () => (await db.query(sql, params)).rows);

async function start(a, b) {
  const id = randomUUID();
  await server(`select public.start_battle($1, 'en', $2, $3, 1::smallint)`, [id, a, b]);
  return id;
}

async function context(id) {
  return server('select * from public.battle_settlement_context($1, $2) order by slot', [
    id,
    RATING_CONFIG.repeatOpponentWindowHours,
  ]);
}

/** Lo mismo que hace server/src/settlement.ts: calcula con shared/ranking y liquida. */
async function settle(id, outcomes, { status = 'completed', forfeited = [false, false] } = {}) {
  const ctx = await context(id);
  const players = ctx.map((p, i) => {
    const opp = ctx[1 - i];
    const change = computeRatingChange({
      rating: p.rating,
      opponentRating: opp.rating,
      outcome: outcomes[i],
      gamesPlayed: p.games_played,
      matchesAgainstOpponentInWindow: p.matches_in_window,
    });
    return {
      slot: p.slot,
      score: outcomes[i] === 'win' ? 900 : 400,
      correct: 7,
      answered: 9,
      result: outcomes[i],
      forfeited: forfeited[i],
      rating_before: p.rating,
      games_played_before: p.games_played,
      rating_after: change.after,
    };
  });
  const [{ r }] = await server('select public.settle_battle($1, $2, $3::jsonb) as r', [
    id,
    status,
    JSON.stringify(players),
  ]);
  return { result: r, players };
}

const rating = async (userId) =>
  (await db.query('select * from public.player_ratings where user_id = $1', [userId])).rows[0];

test('sólo el servidor puede crear o liquidar partidas', async () => {
  const id = randomUUID();
  await as(db, 'authenticated', alice, async () => {
    await assert.rejects(
      db.query(`select public.start_battle($1, 'en', $2, $3, 1::smallint)`, [id, alice, bob]),
      /permission denied/,
    );
    await assert.rejects(
      db.query(`select public.settle_battle($1, 'completed', '[]'::jsonb)`, [id]),
      /permission denied/,
    );
    await assert.rejects(db.query('select public.cancel_battle($1)', [id]), /permission denied/);
  });
  await as(db, 'anon', null, async () => {
    await assert.rejects(
      db.query('select * from public.battle_settlement_context($1, 24)', [id]),
      /permission denied/,
    );
  });
});

test('start_battle es idempotente y guarda el rating de partida', async () => {
  const id = randomUUID();
  for (let i = 0; i < 2; i++) {
    await server(`select public.start_battle($1, 'en', $2, $3, 1::smallint)`, [id, alice, bob]);
  }
  const { rows } = await db.query(
    'select slot, user_id, rating_before from public.battle_players where battle_id = $1 order by slot',
    [id],
  );
  assert.deepEqual(rows, [
    { slot: 1, user_id: alice, rating_before: 1000 },
    { slot: 2, user_id: bob, rating_before: 1000 },
  ]);
  const { rows: battles } = await db.query(
    'select status, season_id, started_at from public.battles where id = $1',
    [id],
  );
  assert.equal(battles[0].status, 'in_progress');
  assert.ok(battles[0].season_id);
  assert.ok(battles[0].started_at);
  await server('select public.cancel_battle($1)', [id]);

  await assert.rejects(
    server(`select public.start_battle($1, 'en', $2, $2, 1::smallint)`, [randomUUID(), alice]),
    /invalid_players/,
  );
});

test('liquidación completa: ratings, historial, partida y logros en una transacción', async () => {
  const id = await start(alice, bob);
  const { result, players } = await settle(id, ['win', 'loss']);

  assert.equal(result.duplicate, false);
  // Ambos en colocación (K = 48), mismo rating: ±24.
  assert.equal(players[0].rating_after, 1024);
  assert.equal(players[1].rating_after, 976);

  const a = await rating(alice);
  const b = await rating(bob);
  assert.equal(a.rating, 1024);
  assert.equal(a.peak_rating, 1024);
  assert.equal(a.games_played, 1);
  assert.equal(a.wins, 1);
  assert.equal(a.win_streak, 1);
  assert.equal(a.best_win_streak, 1);
  assert.equal(b.rating, 976);
  assert.equal(b.peak_rating, 1000);
  assert.equal(b.losses, 1);
  assert.equal(b.win_streak, 0);

  const { rows: history } = await db.query(
    `select user_id, reason, rating_before, rating_after, delta from public.rating_history
     where battle_id = $1 order by delta desc`,
    [id],
  );
  assert.deepEqual(history, [
    { user_id: alice, reason: 'battle', rating_before: 1000, rating_after: 1024, delta: 24 },
    { user_id: bob, reason: 'battle', rating_before: 1000, rating_after: 976, delta: -24 },
  ]);

  const { rows: bp } = await db.query(
    'select slot, score, result, rating_before, rating_after from public.battle_players where battle_id = $1 order by slot',
    [id],
  );
  assert.deepEqual(bp, [
    { slot: 1, score: 900, result: 'win', rating_before: 1000, rating_after: 1024 },
    { slot: 2, score: 400, result: 'loss', rating_before: 1000, rating_after: 976 },
  ]);
  const { rows: battle } = await db.query(
    'select status, ended_at from public.battles where id = $1',
    [id],
  );
  assert.equal(battle[0].status, 'completed');
  assert.ok(battle[0].ended_at);

  assert.deepEqual(
    result.achievements[alice].map((x) => x.id),
    ['first_win'],
  );
  assert.equal(result.achievements[alice][0].title, 'Campeón · Nivel 1');
  assert.deepEqual(result.achievements[bob], []);

  // Aparece en el historial del jugador.
  const [last] = await as(
    db,
    'authenticated',
    alice,
    async () => (await db.query('select * from public.get_match_history(1, null)')).rows,
  );
  assert.equal(last.battle_id, id);
  assert.equal(last.opponent_username, 'bob');
});

test('reliquidar la misma partida no duplica nada', async () => {
  const id = await start(alice, carol);
  await settle(id, ['loss', 'win']);
  const before = await rating(alice);
  const { result } = await settle(id, ['win', 'loss']);
  assert.equal(result.duplicate, true);
  assert.deepEqual(await rating(alice), before);
  const { rows } = await db.query(
    'select count(*)::int as n from public.rating_history where battle_id = $1',
    [id],
  );
  assert.equal(rows[0].n, 2);
});

test('rating desactualizado: la liquidación falla entera y no escribe nada', async () => {
  const id = await start(bob, carol);
  const ctx = await context(id);
  const stale = ctx.map((p) => ({
    slot: p.slot,
    score: 100,
    correct: 1,
    answered: 1,
    result: p.slot === 1 ? 'win' : 'loss',
    forfeited: false,
    rating_before: p.rating,
    games_played_before: p.games_played,
    rating_after: p.rating,
  }));
  stale[1].rating_before += 5;
  const bobBefore = await rating(bob);
  await assert.rejects(
    server('select public.settle_battle($1, $2, $3::jsonb)', [
      id,
      'completed',
      JSON.stringify(stale),
    ]),
    /stale_rating/,
  );
  assert.deepEqual(await rating(bob), bobBefore);
  const { rows } = await db.query('select status from public.battles where id = $1', [id]);
  assert.equal(rows[0].status, 'in_progress');
  await server('select public.cancel_battle($1)', [id]);
});

test('datos inválidos se rechazan', async () => {
  const id = await start(bob, carol);
  await assert.rejects(
    server(`select public.settle_battle($1, 'cancelled', '[]'::jsonb)`, [id]),
    /invalid_status/,
  );
  await assert.rejects(
    server(`select public.settle_battle($1, 'completed', '[]'::jsonb)`, [id]),
    /invalid_players/,
  );
  await assert.rejects(
    server(`select public.settle_battle($1, 'completed', '[]'::jsonb)`, [randomUUID()]),
    /battle_not_found/,
  );
  await server('select public.cancel_battle($1)', [id]);
});

test('anti-farming: el mismo rival en 24 h baja el K y luego deja de mover el rating', async () => {
  const dave = await createUser(db, 'dave@test.dev');
  const erin = await createUser(db, 'erin@test.dev');
  const windows = [];
  const deltas = [];
  for (let i = 0; i < 5; i++) {
    const id = await start(dave, erin);
    const ctx = await context(id);
    windows.push(ctx[0].matches_in_window);
    const { players } = await settle(id, ['win', 'loss']);
    deltas.push(players[0].rating_after - players[0].rating_before);
  }
  assert.deepEqual(windows, [1, 2, 3, 4, 5]);
  assert.ok(deltas[0] > 0 && deltas[1] > 0);
  assert.ok(deltas[2] > 0 && deltas[2] < deltas[1], 'K a la mitad en la 3ª');
  assert.equal(deltas[4], 0, 'la 5ª no mueve el rating');
  const d = await rating(dave);
  assert.equal(d.games_played, 5, 'igual cuenta como partida jugada');
  assert.equal(d.win_streak, 5);

  const placement = await server(
    `select a.id from public.user_achievements ua join public.achievements a on a.id = ua.achievement_id
     where ua.user_id = $1 order by a.position`,
    [dave],
  );
  assert.deepEqual(
    placement.map((x) => x.id),
    // Con la colocación terminada (5 partidas) el rango máximo ya cuenta: Plata y Oro.
    ['placement_done', 'first_win', 'win_streak_3', 'win_streak_5', 'peak_silver', 'peak_gold'],
  );
});

test('abandono: se guarda forfeited y el que abandona pierde', async () => {
  const id = await start(alice, bob);
  await settle(id, ['loss', 'win'], { status: 'forfeited', forfeited: [true, false] });
  const { rows } = await db.query(
    'select slot, forfeited, result from public.battle_players where battle_id = $1 order by slot',
    [id],
  );
  assert.deepEqual(rows, [
    { slot: 1, forfeited: true, result: 'loss' },
    { slot: 2, forfeited: false, result: 'win' },
  ]);
  const { rows: b } = await db.query('select status from public.battles where id = $1', [id]);
  assert.equal(b[0].status, 'forfeited');
});

test('cuenta borrada a mitad de partida: se liquida al rival y la fila queda anonimizada', async () => {
  const fred = await createUser(db, 'fred@test.dev');
  const gina = await createUser(db, 'gina@test.dev');
  const id = await start(fred, gina);
  const ctx = await context(id);
  await db.query('delete from auth.users where id = $1', [fred]);
  const players = [
    {
      slot: 1,
      score: 0,
      correct: 0,
      answered: 0,
      result: 'loss',
      forfeited: true,
      rating_before: null,
      games_played_before: null,
      rating_after: null,
    },
    {
      slot: 2,
      score: 300,
      correct: 2,
      answered: 2,
      result: 'win',
      forfeited: false,
      rating_before: ctx[1].rating,
      games_played_before: ctx[1].games_played,
      rating_after: ctx[1].rating + 24,
    },
  ];
  await server('select public.settle_battle($1, $2, $3::jsonb)', [
    id,
    'forfeited',
    JSON.stringify(players),
  ]);
  assert.equal((await rating(gina)).rating, 1024);
  const { rows } = await db.query(
    'select user_id, rating_after from public.battle_players where battle_id = $1 order by slot',
    [id],
  );
  assert.deepEqual(rows, [
    { user_id: null, rating_after: null },
    { user_id: gina, rating_after: 1024 },
  ]);
});

test('cancelar: no toca ratings ni historial; las partidas viejas abiertas se cancelan al reiniciar', async () => {
  const before = await rating(carol);
  const id = await start(carol, bob);
  assert.equal((await server('select public.cancel_battle($1) as ok', [id]))[0].ok, true);
  assert.equal((await server('select public.cancel_battle($1) as ok', [id]))[0].ok, false);
  assert.deepEqual(await rating(carol), before);
  const { result } = await settle(id, ['win', 'loss']);
  assert.equal(result.duplicate, true, 'una partida cancelada no se puede liquidar');

  const stale = await start(carol, alice);
  await db.query(
    `update public.battles set created_at = now() - interval '10 minutes' where id = $1`,
    [stale],
  );
  const fresh = await start(alice, bob);
  const [{ n }] = await server('select public.cancel_stale_battles(300) as n');
  assert.equal(n, 1);
  const { rows } = await db.query(
    'select id, status from public.battles where id = any($1) order by status',
    [[stale, fresh]],
  );
  assert.deepEqual(rows, [
    { id: stale, status: 'cancelled' },
    { id: fresh, status: 'in_progress' },
  ]);
});

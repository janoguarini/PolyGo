import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { BOT_CONFIG, botSkill } from '../../shared/bots.ts';
import { computeRatingChange } from '../../shared/ranking.ts';
import {
  answerPoints,
  applyPoints,
  decideOutcomes,
  isWriteIndex,
  pointsElapsed,
  streakBonus,
  WRITING,
} from '../../shared/wordRush.ts';

let db;

before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

async function player(email, name) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, name],
  );
  return id;
}

const call = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]);

const start = (userId) => call(userId, 'select public.start_bot_match() as r').then((x) => x.r);
const finish = (userId, id, score, correct, answered, forfeit = false) =>
  call(userId, 'select public.finish_bot_match($1, $2, $3, $4, $5) as r', [
    id,
    score,
    correct,
    answered,
    forfeit,
  ]).then((x) => x.r);

/** Simula que pasaron los 75 s (la base no acepta terminar antes). */
const elapse = (id) =>
  db.query(`update public.battles set started_at = now() - interval '80 seconds' where id = $1`, [
    id,
  ]);

/** Puntaje del bot a partir de su guion, con las reglas de la app. */
function botLine(script, writing = false) {
  let elapsed = 0;
  let score = 0;
  let correct = 0;
  let answered = 0;
  let streak = 0;
  for (const [i, m] of script.entries()) {
    elapsed += m.d;
    if (elapsed > 75_000) break;
    streak = m.c ? streak + 1 : 0;
    const write = writing && isWriteIndex(i);
    score = applyPoints(score, answerPoints(m.c, pointsElapsed({ write }, m.d), streak));
    answered += 1;
    if (m.c) correct += 1;
  }
  return { score, correct, answered, forfeited: false };
}

// ---------- paridad con shared/ ----------
test('bot_skill coincide con botSkill de la app', async () => {
  for (const rating of [0, 50, 100, 250, 400, 401, 700, 1000, 1234, 1600, 1999, 2200, 2500]) {
    const row = await one('select * from public.bot_skill($1)', [rating]);
    const ts = botSkill(rating);
    assert.ok(Math.abs(row.accuracy - ts.accuracy) < 1e-9, `precisión ${rating}`);
    assert.ok(Math.abs(row.mean_ms - ts.meanMs) < 1e-6, `tiempo ${rating}`);
  }
});

test('rush_points coincide con answerPoints (incluido el redondeo de .5)', async () => {
  for (const [correct, ms] of [
    [true, 0],
    [true, 50],
    [true, 1234],
    [true, 2500],
    [true, 4950],
    [true, 5000],
    [true, 9000],
    [false, 300],
  ]) {
    const row = await one('select public.rush_points($1, $2) as p', [correct, ms]);
    assert.equal(row.p, answerPoints(correct, ms), `${correct} ${ms}`);
  }
});

test('rush_streak_bonus coincide con streakBonus', async () => {
  for (let streak = 0; streak <= 12; streak++) {
    const row = await one('select public.rush_streak_bonus($1) as b', [streak]);
    assert.equal(row.b, streakBonus(streak), `racha ${streak}`);
  }
});

test('ranked_rating_after coincide con computeRatingChange', async () => {
  const outcomes = { win: 1, draw: 0.5, loss: 0 };
  const multipliers = { 1: 1, 3: 0.5, 5: 0 };
  for (const [rating, opponent] of [
    [100, 100],
    [100, 140],
    [1000, 1024],
    [1500, 1300],
    [120, 400],
    [1003, 1037],
  ]) {
    for (const placed of [true, false]) {
      for (const [matches, mult] of Object.entries(multipliers)) {
        for (const [outcome, s] of Object.entries(outcomes)) {
          const row = await one('select public.ranked_rating_after($1, $2, $3, $4, $5) as r', [
            rating,
            opponent,
            placed,
            s,
            mult,
          ]);
          const ts = computeRatingChange({
            rating,
            opponentRating: opponent,
            outcome,
            placed,
            matchesAgainstOpponentInWindow: Number(matches),
          });
          const label = `${rating} vs ${opponent} placed=${placed} x${mult} ${outcome}`;
          assert.equal(row.r, ts.after, label);
        }
      }
    }
  }
});

test('el guion del bot respeta tiempos, duración y precisión de su rating', async () => {
  let hits = 0;
  let moves = 0;
  for (let i = 0; i < 40; i++) {
    const { s } = await one('select public.bot_script(1000) as s');
    let total = 0;
    for (const m of s) {
      assert.ok(m.d >= BOT_CONFIG.minMs && m.d <= BOT_CONFIG.maxMs);
      total += m.d;
      hits += m.c ? 1 : 0;
    }
    assert.ok(total <= 75_000);
    moves += s.length;
  }
  assert.ok(Math.abs(hits / moves - botSkill(1000).accuracy) < 0.06);
});

// ---------- partida completa ----------
test('partida contra bot: bot a su altura, resultado y ELO calculados en la base', async () => {
  const ana = await player('ana@bot.dev', 'ana');
  const m = await start(ana);
  // Arranca sin posicionar en 100; el bot está a su altura y nunca debajo del piso.
  assert.ok(m.bot.rating >= 100 && m.bot.rating <= 140);
  assert.deepEqual(m.me, { rating: 100, games_played: 0 });
  assert.ok(m.script.length > 5);

  await assert.rejects(finish(ana, m.battle_id, 0, 0, 0), /too_early/);
  await elapse(m.battle_id);

  const bot = botLine(m.script);
  const mine = { score: bot.score + 100, correct: bot.correct + 1, answered: bot.answered + 1 };
  const r = await finish(ana, m.battle_id, mine.score, mine.correct, mine.answered);
  const [outcome] = decideOutcomes({ ...mine, forfeited: false }, bot);
  const expected = computeRatingChange({
    rating: 100,
    opponentRating: m.bot.rating,
    outcome,
    placed: false,
  });
  assert.equal(r.status, 'completed');
  assert.equal(r.me.result, outcome);
  assert.equal(r.me.rating_after, expected.after);
  assert.equal(r.me.placed_before, false);
  assert.deepEqual(
    { score: r.bot.score, correct: r.bot.correct, answered: r.bot.answered },
    { score: bot.score, correct: bot.correct, answered: bot.answered },
    'la base juega el mismo guion que mostró la app',
  );
  assert.deepEqual(
    r.achievements.map((a) => a.id),
    ['first_win'],
  );

  const rating = await one(
    'select rating, games_played, wins from public.player_ratings where user_id = $1',
    [ana],
  );
  assert.deepEqual(rating, { rating: expected.after, games_played: 1, wins: 1 });

  // Reenviar no vuelve a liquidar.
  const again = await finish(ana, m.battle_id, 99999, 1, 1);
  assert.equal(again.me.rating_after, expected.after);
  const after = await one(
    'select rating, games_played from public.player_ratings where user_id = $1',
    [ana],
  );
  assert.equal(after.games_played, 1);

  // La siguiente ya la juega posicionada.
  const next = await start(ana);
  await elapse(next.battle_id);
  const lost = await finish(ana, next.battle_id, 0, 0, 0);
  assert.equal(lost.me.placed_before, true);
  assert.ok(lost.me.rating_after < lost.me.rating_before || lost.me.rating_before === 100);
});

test('desde Oro el bot tarda el doble en las preguntas para escribir y la base lo puntúa igual que la app', async () => {
  const oro = await player('oro@bot.dev', 'oro');
  await db.query(
    'update public.player_ratings set rating = $2, peak_rating = $2, wins = 5, games_played = 5 where user_id = $1',
    [oro, WRITING.minRating + 50],
  );
  const m = await start(oro);
  assert.equal(m.writing, true);
  const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const writes = m.script.filter((_, i) => isWriteIndex(i)).map((x) => x.d);
  const others = m.script.filter((_, i) => !isWriteIndex(i)).map((x) => x.d);
  assert.ok(avg(writes) > avg(others) * 1.4, 'tarda más en las de escribir');

  await elapse(m.battle_id);
  const bot = botLine(m.script, true);
  const r = await finish(oro, m.battle_id, 0, 0, 0);
  assert.deepEqual(
    { score: r.bot.score, correct: r.bot.correct, answered: r.bot.answered },
    { score: bot.score, correct: bot.correct, answered: bot.answered },
  );

  const plata = await player('plata@bot.dev', 'plata');
  await db.query(
    'update public.player_ratings set rating = 500, peak_rating = 500 where user_id = $1',
    [plata],
  );
  assert.equal((await start(plata)).writing, false);
  for (const rating of [0, 699, 700, 2000]) {
    const { w } = await one('select public.rush_writing($1) as w', [rating]);
    assert.equal(w, rating >= WRITING.minRating);
  }
});

test('puntajes imposibles se rechazan', async () => {
  const beto = await player('beto@bot.dev', 'beto');
  const m = await start(beto);
  await elapse(m.battle_id);
  for (const [score, correct, answered] of [
    [1000, 5, 10], // más de 180 por acierto
    [100, 11, 10], // más aciertos que respuestas
    [0, 0, 500], // más respuestas de las posibles
    [-10, 0, 0],
  ]) {
    await assert.rejects(finish(beto, m.battle_id, score, correct, answered), /invalid_result/);
  }
});

test('abandonar o dejar una partida abierta cuenta como derrota', async () => {
  const caro = await player('caro@bot.dev', 'caro');
  const first = await start(caro);
  // Empieza otra sin terminar la primera (p. ej. cerró la app): la primera se pierde.
  const second = await start(caro);
  const closed = await one(
    `select b.status, bp.result from public.battles b
     join public.battle_players bp on bp.battle_id = b.id and bp.slot = 1 where b.id = $1`,
    [first.battle_id],
  );
  assert.deepEqual(closed, { status: 'forfeited', result: 'loss' });

  // Abandono explícito: se puede en cualquier momento y pierde.
  const r = await finish(caro, second.battle_id, 0, 0, 0, true);
  assert.equal(r.status, 'forfeited');
  assert.equal(r.me.result, 'loss');
  const rating = await one(
    'select games_played, losses from public.player_ratings where user_id = $1',
    [caro],
  );
  assert.deepEqual(rating, { games_played: 2, losses: 2 });
  // Sin posicionar, perder no resta.
  assert.equal(
    (await one('select rating from public.player_ratings where user_id = $1', [caro])).rating,
    100,
  );
});

test('nadie termina la partida de otro y las funciones internas no son públicas', async () => {
  const dani = await player('dani@bot.dev', 'dani');
  const eli = await player('eli@bot.dev', 'eli');
  const m = await start(dani);
  await elapse(m.battle_id);
  await assert.rejects(finish(eli, m.battle_id, 0, 0, 0), /battle_not_found/);

  for (const sql of [
    'select public.bot_script(1000)',
    'select public.rush_points(true, 0)',
    `select public.settle_bot_match('${m.battle_id}', '${dani}', 0, 0, 0, true)`,
  ]) {
    await as(db, 'authenticated', eli, async () => {
      await assert.rejects(db.query(sql), /permission denied/);
    });
  }
  await as(db, 'anon', null, async () => {
    await assert.rejects(db.query('select public.start_bot_match()'), /permission denied/);
  });

  // Sin onboarding no se puede jugar.
  const nuevo = await createUser(db, 'nuevo@bot.dev');
  await assert.rejects(start(nuevo), /onboarding_required/);
});

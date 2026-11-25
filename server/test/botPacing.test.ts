/**
 * Bot a la altura del jugador (shared/botPacing.ts): con el motor real de Word Rush (ArcadeBattle,
 * puntaje con combos y Frenesí, reloj manual), el bot termina cerca del puntaje al que apunta, y contra
 * un jugador que juega como su promedio gana más o menos la mitad de las veces.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import { ARCADE, createChallengeStream } from '../../shared/arcade';
import { TIERS } from '../../shared/ranking';
import {
  BOT_PACING,
  botTargetScore,
  expectedScoreFraction,
  pacedBotMove,
} from '../../shared/botPacing';
import { BOT_CALIBRATION, BOT_CONFIG } from '../../shared/bots';
import {
  ARCADE_PROTOCOL_VERSION,
  type BattleFinish,
  type BattleSnapshot,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { ArcadeBattle } from '../src/arcadeBattle';
import type { BattleHooks } from '../src/battle';
import { ManualClock } from '../src/clock';
import { createBattleServer } from '../src/server';
import { silentLogger, type PlayerInfo } from '../src/types';
import { ARCADE_SENTENCES, ARCADE_WORDS, FakeStore, flush, player, seededRandom } from './helpers';

const hooks: BattleHooks = {
  send: () => {},
  onStart: () => Promise.resolve(),
  onFinish: () => {},
  onCancel: () => {},
};

/** Juega una partida completa: el bot con objetivo contra alguien que no responde. Devuelve su puntaje. */
async function botScore(target: number | null, seed: number, rating = 180): Promise<number> {
  const clock = new ManualClock();
  const random = seededRandom(seed);
  const challenges = createChallengeStream(ARCADE_WORDS, ARCADE_SENTENCES, random);
  const bot: PlayerInfo = {
    ...player('bot:1', rating),
    isBot: true,
    username: 'Fede Martínez',
    botTargetScore: target,
  };
  const battle = new ArcadeBattle(
    'sim',
    'ranked',
    'en',
    [player('ana', rating), bot],
    challenges,
    clock,
    hooks,
    random,
  );
  battle.begin();
  battle.markReady('ana');
  clock.advance(2_500); // el bot confirma solo
  await flush();
  clock.advance(ARCADE.countdownMs);
  for (let t = 0; t < ARCADE.durationMs + 1_000; t += 250) clock.advance(250);
  await flush();
  return battle.finalLines().find((l) => l.info.isBot)!.score;
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
};

const BRONZE = 182;

test('objetivo: mediana de las últimas partidas × factor del rango, con variación; sin historial, null', () => {
  assert.equal(
    botTargetScore(undefined, BRONZE, () => 0.5),
    null,
  );
  assert.equal(
    botTargetScore([8000], BRONZE, () => 0.5),
    null,
  );
  // u = v = 0.5 → gaussiana = -1.177…; con random constante el valor es determinista.
  const fixed = () => 0.5;
  const a = botTargetScore([8000, 9000, 100_000, 7000], BRONZE, fixed)!;
  const b = botTargetScore([8000, 9000, 9000, 7000], BRONZE, fixed)!;
  assert.ok(a > 0 && b > 0);
  // Robusto a un valor aislado: la mediana de [7000, 8000, 9000, 100000] es 8500, igual que la otra.
  assert.equal(a, b);
  // Sólo mira las últimas `historySize`.
  const many = Array.from({ length: 30 }, (_, i) => (i < BOT_PACING.historySize ? 5000 : 50_000));
  assert.equal(botTargetScore(many, BRONZE, fixed), botTargetScore([5000, 5000], BRONZE, fixed));
  // Ignora puntajes inválidos.
  assert.equal(botTargetScore([0, -5, Number.NaN, 4000], BRONZE, fixed), null);
});

test('objetivo por rango: en Bronce un 10 % menos y cada rango más exigente', () => {
  const factors = TIERS.map((t) => BOT_PACING.targetFactorByTier[t.id]);
  assert.equal(factors[0], 0.9);
  for (let i = 1; i < factors.length; i++) assert.ok(factors[i]! > factors[i - 1]!);
  // Sin variación (gaussiana 0: u = 1, v = 0,25), el objetivo es exactamente mediana × factor.
  const noSpread = (() => {
    const seq = [1, 0.25];
    let i = 0;
    return () => seq[i++ % 2]!;
  })();
  for (const tier of TIERS) {
    const rating = Math.max(tier.minRating, 150);
    assert.equal(
      botTargetScore([10_000, 10_000], rating, noSpread),
      Math.round(10_000 * BOT_PACING.targetFactorByTier[tier.id]),
      tier.id,
    );
  }
});

test('fracción esperada: pareja hasta el Frenesí y el doble de rápido en los últimos 15 s', () => {
  assert.equal(expectedScoreFraction(0, ARCADE), 0);
  assert.equal(expectedScoreFraction(45_000, ARCADE), 45 / 75);
  assert.equal(expectedScoreFraction(60_000, ARCADE), 1);
  assert.equal(expectedScoreFraction(90_000, ARCADE), 1);
});

test('jugada: nunca más rápida que una persona y corrige hacia el plan', () => {
  const r = seededRandom(1);
  for (let i = 0; i < 500; i++) {
    const m = pacedBotMove({
      target: 9000,
      score: 0,
      elapsedMs: 50_000,
      kind: 'swipe',
      rules: ARCADE,
      random: r,
    });
    assert.ok(m.delayMs >= 350);
  }
  // Muy atrás del plan acierta más y va más rápido que muy adelante.
  const behind = Array.from({ length: 400 }, (_, i) =>
    pacedBotMove({
      target: 9000,
      score: 0,
      elapsedMs: 40_000,
      kind: 'swipe',
      rules: ARCADE,
      random: seededRandom(i),
    }),
  );
  const ahead = Array.from({ length: 400 }, (_, i) =>
    pacedBotMove({
      target: 9000,
      score: 9000,
      elapsedMs: 10_000,
      kind: 'swipe',
      rules: ARCADE,
      random: seededRandom(i),
    }),
  );
  const rate = (ms: { correct: boolean }[]) => ms.filter((m) => m.correct).length / ms.length;
  const avg = (ms: { delayMs: number }[]) => ms.reduce((s, m) => s + m.delayMs, 0) / ms.length;
  assert.ok(rate(behind) > rate(ahead) + 0.2);
  assert.ok(avg(behind) < avg(ahead) * 0.6);
});

test('simulación: el bot termina cerca del objetivo en todo el rango (motor real)', async (t) => {
  const failures: string[] = [];
  for (const target of [1_500, 4_000, 8_000, 12_000]) {
    const ratios: number[] = [];
    for (let seed = 1; seed <= 72; seed++) ratios.push((await botScore(target, seed)) / target);
    const m = median(ratios);
    const within = ratios.filter((x) => x > 0.7 && x < 1.3).length / ratios.length;
    t.diagnostic(
      `objetivo ${target}: mediana ${m.toFixed(2)}, ${(within * 100).toFixed(0)} % a ±30 %`,
    );
    if (!(m > 0.85 && m < 1.15)) failures.push(`objetivo ${target}: mediana ${m.toFixed(2)}`);
    if (within < 0.8) failures.push(`objetivo ${target}: ${(within * 100).toFixed(0)} % a ±30 %`);
  }
  assert.deepEqual(failures, []);
});

/** Partidas simuladas contra alguien que juega como su promedio (±12 % por partida): % que gana. */
async function playerWinRate(rating: number, games = 200): Promise<number> {
  // El jugador de la prueba de producción: 8048, 9132, 11554…
  const history = [9132, 8048, 8600, 8900, 8300];
  const playerMedian = median(history);
  const random = seededRandom(99);
  let playerWins = 0;
  for (let g = 0; g < games; g++) {
    const target = botTargetScore(history, rating, random)!;
    const bot = await botScore(target, 1_000 + g);
    const u = Math.max(random(), 1e-9);
    const v = random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    const human = playerMedian * Math.exp(0.12 * z);
    if (human > bot) playerWins++;
  }
  return playerWins / games;
}

test('simulación: en Bronce se le gana seguido; en Diamante, menos de la mitad', async (t) => {
  const bronze = await playerWinRate(BRONZE);
  const diamond = await playerWinRate(1_700);
  t.diagnostic(`Bronce: el jugador ganó ${(bronze * 100).toFixed(0)} %`);
  t.diagnostic(`Diamante: el jugador ganó ${(diamond * 100).toFixed(0)} %`);
  assert.ok(bronze >= 0.65, `Bronce ${(bronze * 100).toFixed(0)} %`);
  assert.ok(diamond <= 0.5, `Diamante ${(diamond * 100).toFixed(0)} %`);
  assert.ok(bronze > diamond + 0.15);
});

test('sin objetivo (sin historial) juega como siempre, por rating', async () => {
  // A 180 de rating el bot de siempre suma poco: es lo que pasaba en producción (≈ 1000).
  const scores: number[] = [];
  for (let seed = 1; seed <= 8; seed++) scores.push(await botScore(null, seed));
  assert.ok(median(scores) < 3_000, `mediana ${median(scores)}`);
});

// ---------- de punta a punta: el servidor lee el historial y el bot juega a esa altura ----------

async function serverBotScore(recentScores: number[]): Promise<number> {
  const store = new FakeStore().add(player('ana', 180, 12));
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  store.calibrationUsed.set('ana:en', BOT_CALIBRATION.ratedGames);
  store.recentScores.set('ana', recentScores);
  const clock = new ManualClock();
  const server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    clock,
    random: seededRandom(31),
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = connect(
    `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`,
    {
      transports: ['websocket'],
      auth: { token: 'tok-ana', protocolVersion: ARCADE_PROTOCOL_VERSION },
      reconnection: false,
      forceNew: true,
    },
  );
  try {
    await new Promise<void>((resolve, reject) => {
      socket.once('connect', () => resolve());
      socket.once('connect_error', reject);
    });
    const found = new Promise<BattleSnapshot>((resolve) => socket.once('match:found', resolve));
    const finish = new Promise<BattleFinish>((resolve) => socket.once('battle:finish', resolve));
    const status = new Promise((resolve) => socket.once('queue:status', resolve));
    socket.emit('queue:join', { mode: 'ranked' }, () => {});
    await status;
    clock.advance(BOT_CONFIG.afterMs);
    const snap = await found;
    await socket.emitWithAck('match:ready', { battleId: snap.battleId });
    clock.advance(BOT_CONFIG.readyMs.max);
    await flush();
    clock.advance(ARCADE.countdownMs);
    for (let t = 0; t < ARCADE.durationMs + 1_000; t += 250) clock.advance(250);
    const result = await finish;
    return result.players.find((p) => p.isBot)!.score;
  } finally {
    socket.disconnect();
    await server.close();
  }
}

test('servidor: con historial (≈ 8500) el bot juega a esa altura; sin historial, como siempre', async () => {
  const strong = await serverBotScore([9132, 8048, 8600, 8900, 8300]);
  const legacy = await serverBotScore([]);
  assert.ok(strong > 5_500, `con historial: ${strong}`);
  assert.ok(legacy < 3_000, `sin historial: ${legacy}`);
});

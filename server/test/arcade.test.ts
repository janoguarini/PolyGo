import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

import { connect, type Socket } from 'socket.io-client';

import {
  ARCADE,
  generateChallenges,
  type ArcadeAnswer,
  type ArcadeAnswerResult,
  type ArcadeChallenge,
  type ChallengeView,
} from '../../shared/arcade';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH,
  WORD_RUSH_PROTOCOL_VERSION,
  type Ack,
  type BattleFinish,
  type BattleSnapshot,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { ArcadeBattle } from '../src/arcadeBattle';
import type { BattleHooks } from '../src/battle';
import { ManualClock } from '../src/clock';
import { createBattleServer, type BattleServer } from '../src/server';
import { settleBattle } from '../src/settlement';
import { silentLogger } from '../src/types';
import { ARCADE_SENTENCES, ARCADE_WORDS, FakeStore, flush, player, seededRandom } from './helpers';

const CHALLENGES = generateChallenges(ARCADE_WORDS, ARCADE_SENTENCES, seededRandom(3));

/** Respuesta correcta (o equivocada) para un desafío; en Connect, para la primera pareja libre. */
function answerFor(
  c: ArcadeChallenge,
  right: boolean,
  solved: ReadonlySet<number> = new Set(),
): ArcadeAnswer {
  switch (c.kind) {
    case 'swipe':
      return { kind: 'swipe', accept: right ? c.truthful : !c.truthful };
    case 'audio':
      return {
        kind: 'audio',
        option: right ? c.correctOption : (c.correctOption + 1) % c.options.length,
      };
    case 'connect': {
      const left = c.left.findIndex((_, i) => !solved.has(i));
      const usedRight = new Set([...solved].map((l) => c.solution[l]));
      const wrong = c.right.findIndex((_, r) => r !== c.solution[left] && !usedRight.has(r));
      return { kind: 'connect', left, right: right || wrong < 0 ? c.solution[left]! : wrong };
    }
    case 'sentence': {
      const words = c.answers[0]!.replace(/[.!?]$/, '').split(' ');
      const order = words.map((w) => c.tokens.indexOf(w));
      return { kind: 'sentence', order: right ? order : [...order].reverse() };
    }
  }
}

function setup({ withBot = false, mode = 'ranked' as 'ranked' | 'practice' } = {}) {
  const clock = new ManualClock();
  const sent: { userId: string; event: string; payload: unknown }[] = [];
  const finished: string[] = [];
  const cancelled: string[] = [];
  const hooks: BattleHooks = {
    send: (userId, event, ...args) => sent.push({ userId, event, payload: args[0] }),
    onStart: () => Promise.resolve(),
    onFinish: (_b, status) => finished.push(status),
    onCancel: (_b, reason) => cancelled.push(reason),
  };
  const bot = { ...player('bot:1', 1000), isBot: true, username: 'Kiko' };
  const players =
    mode === 'practice'
      ? [player('alice')]
      : [player('alice'), withBot ? bot : player('bob', 1050)];
  const battle = new ArcadeBattle(
    'a1',
    mode,
    'en',
    players,
    CHALLENGES,
    clock,
    hooks,
    seededRandom(5),
  );
  const events = (userId: string, event: string) =>
    sent.filter((s) => s.userId === userId && s.event === event).map((s) => s.payload);
  const progress = new Map<string, { index: number; solved: Set<number> }>();
  /** Responde el desafío actual de `userId` (lleva la cuenta como lo haría la app). */
  const play = (
    userId: string,
    right: boolean,
    override?: { index?: number; answer?: unknown },
  ) => {
    const p = progress.get(userId) ?? { index: 0, solved: new Set<number>() };
    progress.set(userId, p);
    const challenge = CHALLENGES[p.index]!;
    const answer = override?.answer ?? answerFor(challenge, right, p.solved);
    let result: Parameters<Ack<ArcadeAnswerResult>>[0] | undefined;
    battle.arcadeAnswer(userId, override?.index ?? p.index, answer, (r) => (result = r));
    if (result?.ok) {
      if (result.data.pair && result.data.correct) p.solved.add(result.data.pair[0]);
      if (result.data.done) {
        p.index += 1;
        p.solved = new Set();
      }
    }
    return result!;
  };
  return { clock, sent, finished, cancelled, battle, events, play, progress };
}

async function startPlaying(s: ReturnType<typeof setup>) {
  s.battle.begin();
  s.battle.markReady('alice');
  if (s.battle.players.some((p) => p.userId === 'bob')) s.battle.markReady('bob');
  // El bot confirma solo con una demora.
  s.clock.advance(2_500);
  await flush();
  s.clock.advance(ARCADE.countdownMs);
}

// ---------------------------------------------------------------------------------------------
// Motor

test('arcade: 60 s de juego tras la cuenta regresiva; llegan el desafío actual y el siguiente', async () => {
  const s = setup();
  s.battle.begin();
  s.battle.markReady('alice');
  s.battle.markReady('bob');
  await flush();
  const start = s.events('alice', 'battle:start')[0] as BattleSnapshot;
  assert.equal(start.endsAt! - start.startsAt!, ARCADE.durationMs);
  assert.equal(start.arcade?.frenzyAt, start.endsAt! - ARCADE.frenzyMs);
  assert.equal(s.battle.protocolVersion, ARCADE_PROTOCOL_VERSION);
  assert.equal(s.events('alice', 'arcade:challenge').length, 0, 'nada antes de empezar');

  s.clock.advance(ARCADE.countdownMs);
  assert.equal(s.battle.status, 'in_progress');
  const views = s.events('alice', 'arcade:challenge') as ChallengeView[];
  assert.deepEqual(
    views.map((v) => v.index),
    [0, 1],
  );
  // Los dos reciben exactamente lo mismo.
  assert.deepEqual(s.events('bob', 'arcade:challenge'), views);
  // Ninguna vista trae la respuesta.
  for (const v of views) {
    for (const secret of ['truthful', 'correctOption', 'solution', 'answers']) {
      assert.equal(secret in v, false, `${secret} no se manda`);
    }
  }
});

test('arcade: al responder entra en la ventana el desafío siguiente', async () => {
  const s = setup();
  await startPlaying(s);
  // Swipe/audio/sentence se cierran de una; Connect necesita cuatro parejas.
  let guard = 0;
  while (s.progress.get('alice')?.index !== 1 && guard++ < 10) s.play('alice', true);
  const views = s.events('alice', 'arcade:challenge') as ChallengeView[];
  assert.deepEqual(
    views.map((v) => v.index),
    [0, 1, 2],
  );
});

test('arcade: combo sube el multiplicador y un fallo lo rompe', async () => {
  const s = setup();
  await startPlaying(s);
  const results: ArcadeAnswerResult[] = [];
  for (let i = 0; i < 5; i++) {
    const r = s.play('alice', true);
    assert.ok(r.ok);
    results.push(r.data);
  }
  assert.deepEqual(
    results.map((r) => r.combo),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(
    results.map((r) => r.multiplier),
    [1, 1, 2, 2, 3],
  );
  const miss = s.play('alice', false);
  assert.ok(miss.ok);
  assert.equal(miss.data.correct, false);
  assert.equal(miss.data.points, 0);
  assert.equal(miss.data.combo, 0);
  const total = results.reduce((sum, r) => sum + r.points, 0);
  assert.equal(miss.data.score, total, 'el fallo no resta');
  const line = s.battle.finalLines().find((l) => l.info.userId === 'alice')!;
  assert.equal(line.arcade?.bestCombo, 5);
  assert.equal(line.correct, 5);
  assert.equal(line.answered, 6);
});

test('arcade: Frenesí desde el segundo 45 duplica y no reinicia el combo', async () => {
  const s = setup();
  await startPlaying(s);
  s.play('alice', true);
  s.play('alice', true);
  s.clock.advance(45_000 - 1);
  const before = s.play('alice', true);
  assert.ok(before.ok);
  assert.equal(before.data.frenzy, false);
  s.clock.advance(1);
  const during = s.play('alice', true);
  assert.ok(during.ok);
  assert.equal(during.data.frenzy, true);
  assert.equal(during.data.combo, 4, 'el combo sigue');
  // (base + 0 de velocidad: pasó menos de 1 ms… se calcula igual que el servidor) × 2 × 2.
  assert.equal(during.data.points % 2, 0);
  const line = s.battle.finalLines().find((l) => l.info.userId === 'alice')!;
  assert.equal(line.arcade?.frenzyPoints, during.data.points);
});

test('arcade: respuesta duplicada, adelantada o de otro formato no puntúa dos veces', async () => {
  const s = setup();
  await startPlaying(s);
  const first = CHALLENGES[0]!;
  const ok = s.play('alice', true);
  assert.ok(ok.ok);
  // Reenvío del mismo desafío (p. ej. tras reconectar) cuando ya se cerró.
  if (first.kind !== 'connect') {
    const dup = s.play('alice', true, { index: 0, answer: answerFor(first, true) });
    assert.deepEqual(dup, { ok: false, code: 'stale_question' });
  }
  const ahead = s.play('alice', true, { index: 7 });
  assert.deepEqual(ahead, { ok: false, code: 'stale_question' });
  const wrongShape = s.play('alice', true, { answer: { kind: 'nope' } });
  assert.deepEqual(wrongShape, { ok: false, code: 'invalid_payload' });
  const badIndex = s.play('alice', true, { index: 1.5 as unknown as number });
  assert.deepEqual(badIndex, { ok: false, code: 'invalid_payload' });
  // Nada de eso cambió el puntaje ni rompió el combo.
  const line = s.battle.finalLines().find((l) => l.info.userId === 'alice')!;
  assert.equal(line.score, ok.data.score);
  const next = s.play('alice', true);
  assert.ok(next.ok);
  assert.equal(next.data.combo, 2);
});

test('arcade: el cliente no puede mandar puntos, combo ni tiempo', async () => {
  const s = setup();
  await startPlaying(s);
  const challenge = CHALLENGES[0]!;
  const forged = {
    ...answerFor(challenge, true),
    points: 99_999,
    combo: 50,
    frenzy: true,
    elapsedMs: 0,
  };
  const r = s.play('alice', true, { answer: forged });
  assert.ok(r.ok);
  assert.ok(r.data.points <= 250, `puntos del servidor: ${r.data.points}`);
  assert.equal(r.data.combo, 1);
  assert.equal(r.data.frenzy, false);
});

test('arcade: Connect pareja por pareja; un error rompe el combo pero no cierra el tablero', async () => {
  const s = setup();
  await startPlaying(s);
  // Avanza hasta el primer Connect.
  s.progress.set('alice', { index: 0, solved: new Set() });
  while (CHALLENGES[s.progress.get('alice')?.index ?? 0]!.kind !== 'connect') s.play('alice', true);
  const index = s.progress.get('alice')!.index;
  const wrong = s.play('alice', false);
  assert.ok(wrong.ok);
  assert.equal(wrong.data.correct, false);
  assert.equal(wrong.data.done, false);
  assert.equal(wrong.data.combo, 0);
  const pairs: ArcadeAnswerResult[] = [];
  for (let i = 0; i < 4; i++) {
    const r = s.play('alice', true);
    assert.ok(r.ok);
    pairs.push(r.data);
  }
  assert.deepEqual(
    pairs.map((p) => p.done),
    [false, false, false, true],
  );
  assert.equal(s.progress.get('alice')!.index, index + 1);
});

test('arcade: a los 60 s se cierra y no acepta respuestas tardías', async () => {
  const s = setup();
  await startPlaying(s);
  s.play('alice', true);
  s.clock.advance(ARCADE.durationMs);
  assert.deepEqual(s.finished, ['completed']);
  const late = s.play('alice', true);
  assert.deepEqual(late, { ok: false, code: 'battle_over' });
});

test('arcade: desconexión y reconexión no reinician el reloj ni duplican puntos', async () => {
  const s = setup();
  await startPlaying(s);
  // Deja un Connect a medio resolver si toca; si no, un par de aciertos.
  s.play('alice', true);
  s.play('alice', true);
  const endsAt = s.battle.endsAt;
  const scoreBefore = s.battle.finalLines()[0]!.score;
  s.battle.disconnect('alice');
  assert.equal(s.battle.status, 'reconnecting');
  s.clock.advance(5_000);
  s.battle.reconnect('alice');
  assert.equal(s.battle.status, 'in_progress');
  assert.equal(s.battle.endsAt, endsAt, 'el reloj no se reinicia');
  const state = s.events('alice', 'battle:state').at(-1) as BattleSnapshot;
  const current = s.progress.get('alice')!;
  assert.equal(state.arcade?.current, current.index);
  assert.equal(state.arcade?.challenges[0]?.index, current.index);
  const view = state.arcade!.challenges[0]!;
  if (view.kind === 'connect') {
    assert.deepEqual(
      new Set(view.solved.map(([l]) => l)),
      current.solved,
      'retoma el tablero con las parejas resueltas',
    );
  }
  assert.equal(s.battle.finalLines()[0]!.score, scoreBefore);
  // La respuesta vieja reenviada no vuelve a contar.
  const replay = s.play('alice', true, { index: Math.max(0, current.index - 1) });
  if (current.index > 0) assert.deepEqual(replay, { ok: false, code: 'stale_question' });
});

test('arcade: si no vuelve dentro de la gracia, abandono (reglas actuales)', async () => {
  const s = setup();
  await startPlaying(s);
  s.battle.disconnect('bob');
  // El rival ve que se desconectó (conserva el último marcador válido).
  assert.ok(s.events('alice', 'battle:opponent_status').length > 0);
  s.clock.advance(ARCADE.reconnectGraceMs);
  assert.deepEqual(s.finished, ['forfeited']);
  assert.equal(s.battle.finalLines().find((l) => l.info.userId === 'bob')!.forfeited, true);
});

test('arcade: el bot juega la misma secuencia por el mismo camino de puntaje', async () => {
  const s = setup({ withBot: true });
  await startPlaying(s);
  assert.equal(s.battle.status, 'in_progress');
  s.clock.advance(30_000);
  const bot = s.battle.finalLines().find((l) => l.info.isBot)!;
  assert.ok(bot.answered >= 5, `el bot respondió ${bot.answered}`);
  assert.ok(bot.score > 0);
  // Marcador en vivo para la barra Tug of War.
  const scores = s.events('alice', 'battle:score');
  assert.ok(scores.length >= bot.answered);
  s.clock.advance(30_000);
  assert.deepEqual(s.finished, ['completed']);
});

test('arcade: la liquidación conserva puntos/aciertos/respuestas y agrega estadísticas', async () => {
  const s = setup();
  await startPlaying(s);
  for (let i = 0; i < 4; i++) s.play('alice', true);
  s.play('bob', false);
  s.clock.advance(ARCADE.durationMs);
  const store = new FakeStore().add(player('alice'), player('bob', 1050));
  await store.startBattle('a1', 'en', 'alice', 'bob', ARCADE_PROTOCOL_VERSION);
  const settled = await settleBattle(store, s.battle, 'completed');
  const alice = settled.players.find((p) => p.username === 'alice')!;
  assert.equal(alice.outcome, 'win');
  assert.ok(alice.arcade && alice.arcade.bestCombo >= 1);
  assert.ok(alice.ratingAfter! > alice.ratingBefore!, 'ELO con las reglas de siempre');
  const saved = store.settled.get('a1')!.players.find((p) => p.slot === 1)!;
  assert.equal(saved.correct, 4);
  assert.equal(store.protocolOf.get('a1'), ARCADE_PROTOCOL_VERSION);
});

// ---------------------------------------------------------------------------------------------
// Servidor (Socket.IO)

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const ARCADE_RULES = {
  ...ARCADE,
  countdownMs: 50,
  durationMs: 1_500,
  frenzyMs: 500,
  readyTimeoutMs: 2_000,
  reconnectGraceMs: 300,
};

let server: BattleServer;
let url: string;
let store: FakeStore;
const clients: Client[] = [];

before(async () => {
  store = new FakeStore().add(player('ana'), player('beto', 1020), player('ceci'), player('dani'));
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: {
      ...WORD_RUSH,
      countdownMs: 50,
      durationMs: 1_500,
      readyTimeoutMs: 2_000,
      reconnectGraceMs: 300,
    },
    arcadeRules: ARCADE_RULES,
    tickMs: 20,
    random: seededRandom(9),
    botAfterMs: null,
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
});

after(async () => {
  for (const c of clients) c.disconnect();
  await server.close();
});

function client(userId: string, protocolVersion: number): Client {
  const socket: Client = connect(url, {
    transports: ['websocket'],
    auth: { token: `tok-${userId}`, protocolVersion },
    reconnection: false,
    forceNew: true,
  });
  clients.push(socket);
  return socket;
}

function next<E extends keyof ServerToClientEvents>(
  socket: Client,
  event: E,
  timeoutMs = 3_000,
): Promise<Parameters<ServerToClientEvents[E]>[0]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout esperando ${event}`)), timeoutMs);
    // @ts-expect-error: el listener genérico recibe el payload del evento E.
    socket.once(event, (payload) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}

const connected = (socket: Client) =>
  new Promise<void>((resolve, reject) => {
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });

test('servidor: un cliente v3 y uno v2 nunca se emparejan; una versión desconocida se rechaza', async () => {
  const unknown = client('ceci', 99);
  await assert.rejects(connected(unknown), /protocol_mismatch/);

  const v3 = client('ceci', ARCADE_PROTOCOL_VERSION);
  const v2 = client('dani', WORD_RUSH_PROTOCOL_VERSION);
  await Promise.all([connected(v3), connected(v2)]);
  await v3.emitWithAck('queue:join', { mode: 'ranked' });
  await v2.emitWithAck('queue:join', { mode: 'ranked' });
  // Mismo idioma y rating: con la misma versión se emparejarían en el primer tick.
  await new Promise((r) => setTimeout(r, 200));
  assert.equal(server.stats().battles, 0);
  assert.equal(server.stats().queued, 2);
  await v3.emitWithAck('queue:leave');
  await v2.emitWithAck('queue:leave');
  v3.disconnect();
  v2.disconnect();
});

test('servidor: partida arcade completa entre dos clientes v3', async () => {
  const a = client('ana', ARCADE_PROTOCOL_VERSION);
  const b = client('beto', ARCADE_PROTOCOL_VERSION);
  await Promise.all([connected(a), connected(b)]);
  const foundA = next(a, 'match:found');
  const foundB = next(b, 'match:found');
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  const found = await foundA;
  await foundB;
  assert.ok(found.arcade, 'la foto trae la parte arcade');

  const challengesA: ChallengeView[] = [];
  const challengesB: ChallengeView[] = [];
  a.on('arcade:challenge', (c) => challengesA.push(c));
  b.on('arcade:challenge', (c) => challengesB.push(c));
  const scoreSeen = next(b, 'battle:score', 4_000);
  await a.emitWithAck('match:ready', { battleId: found.battleId });
  await b.emitWithAck('match:ready', { battleId: found.battleId });
  await new Promise((r) => setTimeout(r, 200));
  assert.deepEqual(
    challengesA.map((c) => c.index),
    [0, 1],
  );
  assert.deepEqual(challengesA, challengesB, 'mismo contenido y secuencia');

  // Una respuesta válida en forma (puede ser correcta o no: el cliente no sabe la respuesta).
  const view = challengesA[0]!;
  const answer: ArcadeAnswer =
    view.kind === 'swipe'
      ? { kind: 'swipe', accept: true }
      : view.kind === 'audio'
        ? { kind: 'audio', option: 0 }
        : view.kind === 'connect'
          ? { kind: 'connect', left: 0, right: 0 }
          : { kind: 'sentence', order: view.tokens.map((_, i) => i) };
  const res = await a.emitWithAck('arcade:answer', {
    battleId: found.battleId,
    challengeIndex: 0,
    answer,
  });
  assert.ok(res.ok);
  // El rival ve el marcador (Tug of War).
  const scores = await scoreSeen;
  assert.equal(scores.scores.length, 2);
  // Una respuesta por el canal de Word Rush no sirve en una partida arcade.
  const legacy = await a.emitWithAck('battle:answer', {
    battleId: found.battleId,
    questionIndex: 0,
    option: 0,
  });
  assert.equal(legacy.ok, false);

  const finish = (await next(a, 'battle:finish', 5_000)) as BattleFinish;
  assert.equal(finish.players.length, 2);
  assert.ok(finish.players.every((p) => p.arcade !== undefined));
  assert.equal(store.protocolOf.get(found.battleId), ARCADE_PROTOCOL_VERSION);
  // Tarde: la partida ya no existe.
  const late = await a.emitWithAck('arcade:answer', {
    battleId: found.battleId,
    challengeIndex: 1,
    answer,
  });
  assert.equal(late.ok, false);
});

// ---------------------------------------------------------------------------------------------
// Seguridad y compatibilidad (integración con el servidor de producción)

test('arcade: reliquidar no duplica el ELO y un rating desactualizado se recalcula', async () => {
  const s = setup();
  await startPlaying(s);
  for (let i = 0; i < 3; i++) s.play('alice', true);
  s.clock.advance(ARCADE.durationMs);
  const store = new FakeStore().add(player('alice'), player('bob', 1050));
  await store.startBattle('a1', 'en', 'alice', 'bob', ARCADE_PROTOCOL_VERSION);
  store.staleTimes = 1; // otra partida movió el rating entre la lectura y la escritura
  const first = await settleBattle(store, s.battle, 'completed');
  assert.equal(store.settleCalls, 2, 'reintentó con el rating vigente');
  const after = store.players.get('alice')!.rating;
  const second = await settleBattle(store, s.battle, 'completed');
  assert.equal(second.duplicate, true);
  assert.equal(store.players.get('alice')!.rating, after, 'el ELO se aplicó una sola vez');
  assert.ok(first.players.find((p) => p.username === 'alice')!.ratingAfter !== null);
  for (const p of second.players) assert.equal(p.ratingAfter, null);
});

test('servidor: quien no está en la partida (o manda otro battleId) no puede responder', async () => {
  const a = client('ana', ARCADE_PROTOCOL_VERSION);
  const b = client('beto', ARCADE_PROTOCOL_VERSION);
  const outsider = client('dani', ARCADE_PROTOCOL_VERSION);
  await Promise.all([connected(a), connected(b), connected(outsider)]);
  const foundA = next(a, 'match:found');
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  const found = await foundA;
  const answer = { kind: 'swipe' as const, accept: true };
  const fromOutsider = await outsider.emitWithAck('arcade:answer', {
    battleId: found.battleId,
    challengeIndex: 0,
    answer,
  });
  assert.deepEqual(fromOutsider, { ok: false, code: 'not_in_battle' });
  const wrongBattle = await a.emitWithAck('arcade:answer', {
    battleId: '00000000-0000-0000-0000-000000000000',
    challengeIndex: 0,
    answer,
  });
  assert.deepEqual(wrongBattle, { ok: false, code: 'not_in_battle' });
  // Antes de que empiece el juego tampoco se acepta nada.
  const early = await a.emitWithAck('arcade:answer', {
    battleId: found.battleId,
    challengeIndex: 0,
    answer,
  });
  assert.equal(early.ok, false);
  const cancelled = next(a, 'battle:cancel', 4_000);
  a.disconnect();
  b.disconnect();
  outsider.disconnect();
  await cancelled.catch(() => {});
});

test('servidor: un cliente v3 sin rival juega contra un bot de calibración (arcade, mueve ELO)', async () => {
  const botStore = new FakeStore().add(player('eva', 1000, 0, 1));
  botStore.words = ARCADE_WORDS;
  botStore.sentences = ARCADE_SENTENCES;
  const s = createBattleServer({
    store: botStore,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    arcadeRules: ARCADE_RULES,
    tickMs: 20,
    random: seededRandom(4),
    botAfterMs: 50,
  });
  await new Promise<void>((resolve) => s.http.listen(0, resolve));
  const u = `http://127.0.0.1:${(s.http.address() as AddressInfo).port}`;
  const eva: Client = connect(u, {
    transports: ['websocket'],
    auth: { token: 'tok-eva', protocolVersion: ARCADE_PROTOCOL_VERSION },
    reconnection: false,
    forceNew: true,
  });
  await connected(eva);
  const found = next(eva, 'match:found', 3_000);
  await eva.emitWithAck('queue:join', { mode: 'ranked' });
  const snap = await found;
  assert.ok(snap.arcade, 'partida arcade');
  assert.equal(snap.rating, 'calibration');
  assert.ok(snap.players.some((p) => p.isBot));
  const finish = next(eva, 'battle:finish', 6_000);
  await eva.emitWithAck('match:ready', { battleId: snap.battleId });
  const end = (await finish) as BattleFinish;
  assert.equal(end.rating, 'calibration');
  const bot = end.players.find((p) => p.isBot)!;
  assert.ok(bot.arcade, 'el bot jugó arcade');
  assert.equal(botStore.protocolOf.get(snap.battleId), ARCADE_PROTOCOL_VERSION);
  assert.equal(botStore.calibrationUsed.get('eva:en'), 1);
  eva.disconnect();
  await s.close();
});

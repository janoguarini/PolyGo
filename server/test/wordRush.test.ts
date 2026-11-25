/**
 * Word Rush unificado (motor Arcade, protocolo 3) integrado al servidor: flujo continuo de desafíos,
 * memoria de contenido reciente, bot a los 3 s (con o sin cupo de calibración), carreras de la cola,
 * sincronización entre jugadores, reloj de 60 s y los seis cursos en sus dos franjas de nivel.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, test } from 'node:test';

import { connect, type Socket } from 'socket.io-client';

import {
  ARCADE,
  RecentContentMemory,
  createChallengeStream,
  type ArcadeAnswer,
  type ArcadeAnswerResult,
  type ArcadeChallenge,
  type ArcadeRules,
  type ArcadeSentence,
  type ChallengeView,
} from '../../shared/arcade';
import { BOT_CALIBRATION, BOT_CONFIG, botSkill } from '../../shared/bots';
import { LANGUAGES } from '../../shared/languages';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH_PROTOCOL_VERSION,
  type BattleFinish,
  type BattleSnapshot,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { TIERS } from '../../shared/ranking';
import type { RushWord } from '../../shared/wordRush';
import { ArcadeBattle } from '../src/arcadeBattle';
import type { BattleHooks } from '../src/battle';
import { ManualClock } from '../src/clock';
import { createBattleServer, type BattleServer } from '../src/server';
import { silentLogger, type PlayerInfo, type RushPlayer } from '../src/types';
import { ARCADE_SENTENCES, ARCADE_WORDS, FakeStore, flush, player, seededRandom } from './helpers';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

/** Deja correr la red y las promesas (el reloj del servidor no avanza solo). */
const settle = (ms = 40) => new Promise((r) => setTimeout(r, ms));

const openServers: { close(): Promise<void> }[] = [];
const openClients: Client[] = [];
after(async () => {
  for (const c of openClients) c.disconnect();
  for (const s of openServers) await s.close();
});

/** Store cuya lectura de unidades se puede frenar: simula una base lenta mientras se arma la partida. */
class GatedStore extends FakeStore {
  private gate: Promise<void> | null = null;
  private open: () => void = () => {};
  hold() {
    this.gate = new Promise<void>((resolve) => {
      this.open = () => {
        this.gate = null;
        resolve();
      };
    });
  }
  release() {
    this.open();
  }
  override async rushUnits(languageCode: string, players: readonly RushPlayer[]) {
    if (this.gate) await this.gate;
    return super.rushUnits(languageCode, players);
  }
}

interface Harness {
  server: BattleServer;
  clock: ManualClock;
  client(userId: string, protocolVersion?: number): Client;
}

async function harness(
  store: FakeStore,
  options: {
    botAfterMs?: number | null;
    botRatedAfterCalibration?: boolean;
    arcadeRules?: ArcadeRules;
    protocolVersions?: readonly number[];
    recentContent?: RecentContentMemory;
    seed?: number;
  } = {},
): Promise<Harness> {
  const clock = new ManualClock();
  const server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    clock,
    // Tick lento: lo que se prueba acá son los temporizadores por jugador, no el tick.
    tickMs: 600_000,
    random: seededRandom(options.seed ?? 7),
    botAfterMs: options.botAfterMs === undefined ? BOT_CONFIG.afterMs : options.botAfterMs,
    botRatedAfterCalibration: options.botRatedAfterCalibration,
    arcadeRules: options.arcadeRules ?? ARCADE,
    ...(options.protocolVersions ? { protocolVersions: options.protocolVersions } : {}),
    ...(options.recentContent ? { recentContent: options.recentContent } : {}),
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  openServers.push(server);
  const url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
  return {
    server,
    clock,
    client(userId, protocolVersion = ARCADE_PROTOCOL_VERSION) {
      const socket: Client = connect(url, {
        transports: ['websocket'],
        auth: { token: `tok-${userId}`, protocolVersion },
        reconnection: false,
        forceNew: true,
      });
      openClients.push(socket);
      return socket;
    },
  };
}

const connected = (socket: Client) =>
  new Promise<void>((resolve, reject) => {
    if (socket.connected) return resolve();
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });

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

/** Cuenta los eventos de un tipo que recibe un socket. */
function counter(socket: Client, event: keyof ServerToClientEvents) {
  const box = { count: 0, last: null as unknown };
  socket.on(event, ((payload: unknown) => {
    box.count += 1;
    box.last = payload;
  }) as never);
  return box;
}

const bankStore = (...players: PlayerInfo[]) => {
  const store = new GatedStore().add(...players);
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  return store;
};

// =================================================================================================
// Bot a los 3 s
// =================================================================================================

test('bot: entra exactamente a los 3 s sin rival humano (ni antes, ni por el tick)', async () => {
  const h = await harness(bankStore(player('solo', 1000, 0, 1)));
  const solo = h.client('solo');
  await connected(solo);
  const found = counter(solo, 'match:found');
  const joinedAt = h.clock.now();
  assert.equal((await solo.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);

  h.clock.advance(BOT_CONFIG.afterMs - 1);
  await settle();
  assert.equal(found.count, 0, 'a los 2.999 ms todavía busca una persona');
  assert.equal(h.server.stats().queued, 1);
  assert.equal(h.server.stats().battles, 0);

  const match = next(solo, 'match:found');
  h.clock.advance(1);
  const snap = (await match) as BattleSnapshot;
  assert.equal(snap.serverNow - joinedAt, 3_000, 'la partida se arma a los 3.000 ms justos');
  assert.ok(snap.arcade, 'Word Rush (motor Arcade)');
  const bot = snap.players.find((p) => p.slot !== snap.yourSlot)!;
  assert.equal(bot.isBot, true);
  assert.ok(Math.abs(bot.rating - 1000) <= BOT_CONFIG.ratingJitter, 'a la altura del jugador');
  assert.equal(snap.rating, 'calibration');
  solo.disconnect();
});

test('bot: reentrar a la cola no reinicia la espera (el bot vence a los 3 s de la primera entrada)', async () => {
  const h = await harness(bankStore(player('again', 1000, 0, 1)));
  const s = h.client('again');
  await connected(s);
  const joinedAt = h.clock.now();
  await s.emitWithAck('queue:join', { mode: 'ranked' });
  h.clock.advance(2_000);
  await s.emitWithAck('queue:join', { mode: 'ranked' });
  const match = next(s, 'match:found');
  h.clock.advance(1_000);
  const snap = (await match) as BattleSnapshot;
  assert.equal(snap.serverNow - joinedAt, 3_000);
  s.disconnect();
});

test('humano primero: quien llega antes del límite empareja con una persona y no aparece ningún bot', async () => {
  const h = await harness(bankStore(player('ana', 1000), player('beto', 1010)));
  const a = h.client('ana');
  const b = h.client('beto');
  await Promise.all([connected(a), connected(b)]);
  const foundA = counter(a, 'match:found');
  const foundB = counter(b, 'match:found');
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  h.clock.advance(BOT_CONFIG.afterMs - 1);
  const match = next(a, 'match:found');
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  const snap = (await match) as BattleSnapshot;
  assert.ok(
    snap.players.every((p) => !p.isBot),
    'contra la persona, no contra el bot',
  );
  // Pasan los plazos del bot de ana (3 s) y de beto (3 s desde su entrada), sin llegar al vencimiento
  // de la confirmación: no se arma ninguna otra partida.
  h.clock.advance(4_000);
  await settle();
  assert.equal(foundA.count, 1);
  assert.equal(foundB.count, 1);
  assert.equal(h.server.stats().battles, 1);
  a.disconnect();
  b.disconnect();
});

test('humano después del límite: el primero ya tiene su bot y el segundo espera el suyo; nadie en dos partidas', async () => {
  const h = await harness(bankStore(player('cami', 1000), player('dante', 1000)));
  const c = h.client('cami');
  const d = h.client('dante');
  await Promise.all([connected(c), connected(d)]);
  const foundC = counter(c, 'match:found');
  await c.emitWithAck('queue:join', { mode: 'ranked' });
  const matchC = next(c, 'match:found');
  h.clock.advance(BOT_CONFIG.afterMs);
  const snapC = (await matchC) as BattleSnapshot;
  assert.ok(snapC.players.some((p) => p.isBot));
  const dJoined = h.clock.now();
  await d.emitWithAck('queue:join', { mode: 'ranked' });
  await settle();
  assert.equal(h.server.stats().queued, 1, 'dante no se empareja con alguien que ya juega');
  const matchD = next(d, 'match:found');
  h.clock.advance(BOT_CONFIG.afterMs);
  const snapD = (await matchD) as BattleSnapshot;
  assert.equal(snapD.serverNow - dJoined, 3_000);
  assert.ok(snapD.players.some((p) => p.isBot));
  assert.equal(foundC.count, 1);
  c.disconnect();
  d.disconnect();
});

// Con el interruptor encendido (producción) la partida es clasificatoria: integrity.test.ts y
// botIdentity.test.ts. Acá, apagado (BOT_CALIBRATION.ratedAfterCalibration = false).
test('interruptor apagado, sin cupo: bot a los 3 s igual, sin ELO, guardado y sin consumir cupo', async () => {
  const store = bankStore(player('veterana', 1200, 30, 12));
  store.calibrationUsed.set('veterana:en', BOT_CALIBRATION.ratedGames);
  const h = await harness(store, { botRatedAfterCalibration: false });
  const s = h.client('veterana');
  await connected(s);
  await s.emitWithAck('queue:join', { mode: 'ranked' });
  const match = next(s, 'match:found');
  h.clock.advance(BOT_CONFIG.afterMs);
  const snap = (await match) as BattleSnapshot;
  assert.equal(snap.mode, 'ranked');
  assert.equal(snap.rating, 'unrated');
  assert.equal(snap.calibration, null);
  const finish = next(s, 'battle:finish', 5_000);
  await s.emitWithAck('match:ready', { battleId: snap.battleId });
  h.clock.advance(3_000); // el bot confirma
  await settle();
  h.clock.advance(ARCADE.countdownMs);
  await settle();
  h.clock.advance(ARCADE.durationMs);
  const result = (await finish) as BattleFinish;
  assert.equal(result.rating, 'unrated');
  for (const p of result.players) assert.equal(p.ratingAfter, null);
  assert.equal(store.players.get('veterana')!.rating, 1200, 'el ELO no cambia');
  assert.equal(store.calibrationUsed.get('veterana:en'), BOT_CALIBRATION.ratedGames);
  assert.ok(store.unranked.has(snap.battleId));
  assert.ok(store.settled.has(snap.battleId), 'queda en el historial');
  s.disconnect();
});

// =================================================================================================
// Carreras de la cola mientras se arma la partida
// =================================================================================================

test('carreras: reingresar mientras se arma la partida no crea otra (y pedir práctica se rechaza)', async () => {
  const store = bankStore(player('eli', 1000, 0, 1));
  const h = await harness(store);
  const s = h.client('eli');
  await connected(s);
  const found = counter(s, 'match:found');
  await s.emitWithAck('queue:join', { mode: 'ranked' });
  store.hold();
  h.clock.advance(BOT_CONFIG.afterMs);
  await settle();
  assert.equal(h.server.stats().matching, 1, 'la partida se está armando');
  // El cliente reintenta (p. ej. al reconectar): se acepta sin crear nada nuevo.
  assert.deepEqual(await s.emitWithAck('queue:join', { mode: 'ranked' }), {
    ok: true,
    data: { mode: 'ranked' },
  });
  assert.deepEqual(await s.emitWithAck('queue:join', { mode: 'practice' }), {
    ok: false,
    code: 'already_in_battle',
  });
  assert.equal(h.server.stats().queued, 0);
  store.release();
  await settle(80);
  assert.equal(found.count, 1);
  assert.equal(h.server.stats().battles, 1);
  assert.equal(h.server.stats().matching, 0);
  // Ni el tick ni otro plazo arman otra.
  h.clock.advance(10_000);
  await settle();
  assert.equal(found.count, 1);
  s.disconnect();
});

test('carreras: si uno sale de la cola mientras se arma, no hay partida y el otro vuelve con su espera', async () => {
  const store = bankStore(player('fran', 1000), player('gabi', 1000));
  const h = await harness(store);
  const f = h.client('fran');
  const g = h.client('gabi');
  await Promise.all([connected(f), connected(g)]);
  const foundF = counter(f, 'match:found');
  const foundG = counter(g, 'match:found');
  const gJoined = h.clock.now();
  await g.emitWithAck('queue:join', { mode: 'ranked' });
  store.hold();
  await f.emitWithAck('queue:join', { mode: 'ranked' });
  await settle();
  assert.equal(h.server.stats().matching, 2, 'emparejados al entrar fran');
  await f.emitWithAck('queue:leave');
  store.release();
  await settle(80);
  assert.equal(foundF.count, 0);
  assert.equal(foundG.count, 0);
  assert.equal(h.server.stats().battles, 0);
  assert.equal(h.server.stats().queued, 1, 'gabi sigue buscando');
  // Conserva su espera: el bot le llega a los 3 s de SU entrada, no de la vuelta a la cola.
  const match = next(g, 'match:found');
  h.clock.advance(BOT_CONFIG.afterMs);
  const snap = (await match) as BattleSnapshot;
  assert.equal(snap.serverNow - gJoined, 3_000);
  assert.ok(snap.players.some((p) => p.isBot));
  f.disconnect();
  g.disconnect();
});

test('carreras: si uno se desconecta mientras se arma, no hay partida y el otro vuelve a la cola', async () => {
  const store = bankStore(player('hugo', 1000), player('ines', 1000));
  const h = await harness(store, { botAfterMs: null });
  const a = h.client('hugo');
  const b = h.client('ines');
  await Promise.all([connected(a), connected(b)]);
  const foundB = counter(b, 'match:found');
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  store.hold();
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  await settle();
  a.disconnect();
  await settle();
  store.release();
  await settle(80);
  assert.equal(foundB.count, 0);
  assert.equal(h.server.stats().battles, 0);
  assert.equal(h.server.stats().queued, 1);
  b.disconnect();
});

test('carreras: si vuelve a conectarse (misma versión) mientras se arma, la partida le llega a la conexión nueva', async () => {
  const store = bankStore(player('juli', 1000, 0, 1));
  const h = await harness(store);
  const first = h.client('juli');
  await connected(first);
  await first.emitWithAck('queue:join', { mode: 'ranked' });
  store.hold();
  h.clock.advance(BOT_CONFIG.afterMs);
  await settle();
  first.disconnect();
  await settle();
  const second = h.client('juli');
  await connected(second);
  const match = next(second, 'match:found');
  // Como hace la app al reconectarse buscando: vuelve a pedir la cola.
  assert.equal((await second.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  store.release();
  const snap = (await match) as BattleSnapshot;
  assert.ok(snap.players.some((p) => p.isBot));
  assert.equal(h.server.stats().battles, 1);
  second.disconnect();
});

test('carreras: si la base falla al armar la partida, se avisa y no se reintenta en bucle', async () => {
  const store = bankStore(player('kevin', 1000), player('lola', 1000));
  store.rushUnits = async () => {
    throw new Error('sin unidades');
  };
  const h = await harness(store, { botAfterMs: null });
  const a = h.client('kevin');
  const b = h.client('lola');
  await Promise.all([connected(a), connected(b)]);
  const errA = next(a, 'server:error');
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  assert.equal((await errA).code, 'server_error');
  await settle(80);
  assert.equal(h.server.stats().battles, 0);
  assert.equal(h.server.stats().queued, 0);
  assert.equal(h.server.stats().matching, 0);
  a.disconnect();
  b.disconnect();
});

// =================================================================================================
// Motor: secuencia continua, sincronización, reloj de 60 s y bot
// =================================================================================================

function engine(
  players: PlayerInfo[],
  stream = createChallengeStream(ARCADE_WORDS, ARCADE_SENTENCES, seededRandom(3)),
  seed = 5,
) {
  const clock = new ManualClock();
  const sent: { userId: string; event: string; payload: unknown; at: number }[] = [];
  const finished: { status: string; at: number }[] = [];
  const hooks: BattleHooks = {
    send: (userId, event, ...args) =>
      sent.push({ userId, event, payload: args[0], at: clock.now() }),
    onStart: () => Promise.resolve(),
    onFinish: (_b, status) => finished.push({ status, at: clock.now() }),
    onCancel: () => {},
  };
  const battle = new ArcadeBattle(
    'w1',
    'ranked',
    'en',
    players,
    stream,
    clock,
    hooks,
    seededRandom(seed),
  );
  return { clock, sent, finished, battle, stream };
}

async function start(e: ReturnType<typeof engine>) {
  e.battle.begin();
  for (const p of e.battle.players) if (!p.isBot) e.battle.markReady(p.userId);
  e.clock.advance(BOT_CONFIG.readyMs.max);
  await flush();
  e.clock.advance(ARCADE.countdownMs);
  assert.equal(e.battle.status, 'in_progress');
}

/** La respuesta correcta de una persona que conoce la respuesta (Connect: la primera pareja libre). */
function rightAnswer(c: ArcadeChallenge, solved: ReadonlySet<number>): ArcadeAnswer {
  switch (c.kind) {
    case 'swipe':
      return { kind: 'swipe', accept: c.truthful };
    case 'audio':
      return { kind: 'audio', option: c.correctOption };
    case 'connect': {
      const left = c.left.findIndex((_, i) => !solved.has(i));
      return { kind: 'connect', left, right: c.solution[left]! };
    }
    case 'sentence': {
      const order = c.answers[0]!.replace(/[.!?]$/, '')
        .split(' ')
        .map((w) => c.tokens.indexOf(w));
      return { kind: 'sentence', order };
    }
  }
}

test('motor: nunca se agota — 60 s respondiendo cada 250 ms; termina sólo por el reloj', async () => {
  const small = { ...ARCADE, challengeCount: 4, challengeBlock: 3 };
  const stream = createChallengeStream(ARCADE_WORDS, ARCADE_SENTENCES, seededRandom(8), small);
  const e = engine([player('rápida'), player('quieta', 1000)], stream);
  await start(e);
  const endsAt = e.battle.endsAt!;
  let index = 0;
  const solved = new Set<number>();
  let accepted = 0;
  while (e.clock.now() + 250 < endsAt) {
    e.clock.advance(250);
    let res: { ok: boolean; data?: ArcadeAnswerResult } | undefined;
    e.battle.arcadeAnswer('rápida', index, rightAnswer(e.stream.at(index), solved), (r) => {
      res = r as typeof res;
    });
    assert.ok(res?.ok, `respuesta aceptada en el desafío ${index}`);
    accepted++;
    if (res!.data!.pair) solved.add(res!.data!.pair[0]);
    if (res!.data!.done) {
      index++;
      solved.clear();
    }
  }
  assert.ok(index > 50, `avanzó ${index} desafíos (más de los 4 iniciales)`);
  assert.equal(e.finished.length, 0, 'no terminó por quedarse sin desafíos');
  // Siempre recibió el desafío siguiente por adelantado.
  const views = e.sent.filter((s) => s.userId === 'rápida' && s.event === 'arcade:challenge');
  const maxIndex = Math.max(...views.map((v) => (v.payload as ChallengeView).index));
  assert.ok(maxIndex >= index + ARCADE.lookahead - 1);
  // A los 60 s justos (y no antes) termina, y ya no acepta nada.
  e.clock.advance(endsAt - 1 - e.clock.now());
  assert.equal(e.finished.length, 0);
  e.clock.advance(1);
  assert.deepEqual(
    e.finished.map((f) => f.at - (endsAt - ARCADE.durationMs)),
    [ARCADE.durationMs],
  );
  let late: unknown;
  e.battle.arcadeAnswer('rápida', index, rightAnswer(e.stream.at(index), solved), (r) => {
    late = r;
  });
  assert.deepEqual(late, { ok: false, code: 'battle_over' });
  assert.ok(accepted > 200);
});

test('motor: la última respuesta válida es 1 ms antes de los 60 s; en el segundo 60 ya no', async () => {
  const e = engine([player('ana'), player('beto', 1000)]);
  await start(e);
  const endsAt = e.battle.endsAt!;
  e.clock.advance(endsAt - 1 - e.clock.now());
  let ok: unknown;
  e.battle.arcadeAnswer('ana', 0, rightAnswer(e.stream.at(0), new Set()), (r) => (ok = r));
  assert.equal((ok as { ok: boolean }).ok, true);
  e.clock.advance(1);
  let late: unknown;
  e.battle.arcadeAnswer('beto', 0, rightAnswer(e.stream.at(0), new Set()), (r) => (late = r));
  assert.deepEqual(late, { ok: false, code: 'battle_over' });
});

test('motor: los dos jugadores reciben los mismos desafíos en el mismo orden, a cualquier ritmo', async () => {
  const small = { ...ARCADE, challengeCount: 5, challengeBlock: 5 };
  const stream = createChallengeStream(ARCADE_WORDS, ARCADE_SENTENCES, seededRandom(11), small);
  const e = engine([player('liebre'), player('tortuga', 1000)], stream);
  await start(e);
  const endsAt = e.battle.endsAt!;
  const pace = { liebre: 300, tortuga: 1_700 } as const;
  const state = {
    liebre: { index: 0, solved: new Set<number>(), nextAt: e.clock.now() + pace.liebre },
    tortuga: { index: 0, solved: new Set<number>(), nextAt: e.clock.now() + pace.tortuga },
  };
  for (;;) {
    const who = state.liebre.nextAt <= state.tortuga.nextAt ? 'liebre' : 'tortuga';
    const s = state[who];
    if (s.nextAt >= endsAt) break;
    e.clock.advance(s.nextAt - e.clock.now());
    let res: { ok: boolean; data?: ArcadeAnswerResult } | undefined;
    e.battle.arcadeAnswer(who, s.index, rightAnswer(e.stream.at(s.index), s.solved), (r) => {
      res = r as typeof res;
    });
    assert.ok(res?.ok);
    if (res!.data!.pair) s.solved.add(res!.data!.pair[0]);
    if (res!.data!.done) {
      s.index++;
      s.solved.clear();
    }
    s.nextAt += pace[who];
  }
  const viewsOf = (userId: string) =>
    new Map(
      e.sent
        .filter((x) => x.userId === userId && x.event === 'arcade:challenge')
        .map((x) => [(x.payload as ChallengeView).index, JSON.stringify(x.payload)]),
    );
  const fast = viewsOf('liebre');
  const slow = viewsOf('tortuga');
  assert.ok(fast.size > slow.size * 2, `la liebre vio ${fast.size} y la tortuga ${slow.size}`);
  for (const [index, view] of slow) assert.equal(fast.get(index), view, `desafío ${index}`);
  assert.ok(e.stream.challenges.length > small.challengeCount, 'el flujo creció para la liebre');
});

test('bot: juega los 60 s completos y nunca queda trabado, aunque haya contenido roto', async () => {
  // Frases cuyos bloques no forman la respuesta: no existe respuesta correcta.
  const broken: ArcadeSentence[] = Array.from({ length: 6 }, (_, i) => ({
    id: `roto${i}`,
    tokens: ['uno', 'dos', `tres${i}`],
    answer: `otra cosa ${i}`,
    acceptedAnswers: [],
    translation: `roto ${i}`,
    unitId: 'a1-u01',
  }));
  const stream = createChallengeStream(ARCADE_WORDS, broken, seededRandom(13));
  const bot = { ...player('bot:x', 1600), isBot: true, username: 'Kiko' };
  const e = engine([player('mirona'), bot], stream);
  await start(e);
  const startsAt = e.battle.endsAt! - ARCADE.durationMs;
  e.clock.advance(ARCADE.durationMs);
  assert.equal(e.finished[0]?.status, 'completed');
  const scoreTimes = e.sent
    .filter((x) => x.userId === 'mirona' && x.event === 'battle:score')
    .map((x) => x.at - startsAt);
  assert.ok(scoreTimes.length > 15, `el bot respondió ${scoreTimes.length} veces`);
  assert.ok(Math.max(...scoreTimes) > ARCADE.durationMs - 8_000, 'siguió jugando hasta el final');
  assert.ok(
    scoreTimes.every((t) => t < ARCADE.durationMs),
    'nada después de los 60 s',
  );
  const line = e.battle.finalLines().find((l) => l.info.isBot)!;
  assert.ok(line.answered > 15);
});

test('bot: en partidas reales acierta lo de su rating, por el mismo camino de puntaje', async () => {
  for (const rating of [400, 1_000, 1_600]) {
    let correct = 0;
    let answered = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const bot = { ...player(`bot:${seed}`, rating), isBot: true, username: 'Luna' };
      const stream = createChallengeStream(ARCADE_WORDS, ARCADE_SENTENCES, seededRandom(seed));
      const e = engine([player('espectadora'), bot], stream, seed * 31);
      await start(e);
      e.clock.advance(ARCADE.durationMs);
      const line = e.battle.finalLines().find((l) => l.info.isBot)!;
      correct += line.correct;
      answered += line.answered;
    }
    const accuracy = correct / answered;
    assert.ok(
      Math.abs(accuracy - botSkill(rating).accuracy) < 0.05,
      `rating ${rating}: acertó ${accuracy.toFixed(3)} (base ${botSkill(rating).accuracy})`,
    );
  }
});

// =================================================================================================
// Memoria de contenido reciente y seis cursos
// =================================================================================================

/** Lo que identifica el contenido de un desafío visto por el cliente. */
function contentOf(c: ChallengeView): string[] {
  switch (c.kind) {
    case 'swipe':
    case 'audio':
      return [c.prompt];
    case 'connect':
      return [...c.left];
    case 'sentence':
      return [c.translation];
  }
}

function anyTexts(c: ChallengeView): string[] {
  switch (c.kind) {
    case 'swipe':
      return [c.prompt, c.candidate];
    case 'audio':
      return [c.prompt, ...c.options];
    case 'connect':
      return [...c.left, ...c.right];
    case 'sentence':
      return [...c.tokens, c.translation];
  }
}

/**
 * Una práctica sola de Word Rush jugada como la app (sin saber las respuestas): avanza `count`
 * desafíos y sale. Devuelve los desafíos que recibió, por índice.
 */
async function practice(h: Harness, userId: string, count: number) {
  const s = h.client(userId);
  await connected(s);
  const views = new Map<number, ChallengeView>();
  s.on('arcade:challenge', (c) => views.set(c.index, c));
  // La práctica sola no espera confirmación: arranca directo con la cuenta regresiva.
  const started = next(s, 'battle:start');
  assert.equal((await s.emitWithAck('queue:join', { mode: 'practice' })).ok, true);
  const snap = (await started) as BattleSnapshot;
  assert.ok(snap.arcade, 'Word Rush (motor Arcade)');
  await settle();
  h.clock.advance(ARCADE.countdownMs);
  await settle();
  let index = 0;
  let tries = 0;
  const solved = new Map<number, Set<number>>();
  while (index < count && tries++ < 400) {
    const c = views.get(index);
    assert.ok(c, `llegó el desafío ${index}`);
    let answer: ArcadeAnswer;
    if (c.kind === 'connect') {
      // Sin saber la solución: prueba parejas hasta acertar (los errores no cierran el tablero).
      const done = solved.get(index) ?? new Set<number>();
      solved.set(index, done);
      const left = c.left.findIndex((_, i) => !done.has(i));
      const right = tries % c.right.length;
      answer = { kind: 'connect', left, right };
    } else if (c.kind === 'swipe') answer = { kind: 'swipe', accept: true };
    else if (c.kind === 'audio') answer = { kind: 'audio', option: 0 };
    else answer = { kind: 'sentence', order: c.tokens.map((_, i) => i) };
    h.clock.advance(300);
    const res = await s.emitWithAck('arcade:answer', {
      battleId: snap.battleId,
      challengeIndex: index,
      answer,
    });
    if (!res.ok) continue;
    if (res.data.pair && res.data.correct) solved.get(index)!.add(res.data.pair[0]);
    if (res.data.done) index++;
    await settle(5);
  }
  const finish = next(s, 'battle:finish');
  await s.emitWithAck('battle:leave');
  await finish;
  s.disconnect();
  await settle();
  return views;
}

const BIG_WORDS: RushWord[] = Array.from({ length: 100 }, (_, i) => ({
  id: `bw${i}`,
  text: `bigword${i}`,
  translationEs: `palabrota${i}`,
  level: 'A1',
  unitId: 'a1-u01',
}));
const BIG_SENTENCES: ArcadeSentence[] = Array.from({ length: 30 }, (_, i) => ({
  id: `bs${i}`,
  tokens: [`frase${i}`, 'kk', 'zz'],
  answer: `frase${i} kk zz`,
  acceptedAnswers: [],
  translation: `traducción ${i}`,
  unitId: 'a1-u01',
}));

test('memoria: la partida siguiente del mismo jugador no repite lo que vio en la anterior', async () => {
  const store = new FakeStore().add(player('memo', 1000));
  store.words = BIG_WORDS;
  store.sentences = BIG_SENTENCES;
  const memory = new RecentContentMemory();
  const h = await harness(store, { recentContent: memory });
  const first = await practice(h, 'memo', 12);
  assert.ok(memory.recentFor(['memo:en']).words.size > 0, 'se registró lo visto');
  const second = await practice(h, 'memo', 12);
  const seenBefore = new Set([...first.values()].flatMap(contentOf));
  const repeated = [...second.values()].flatMap(contentOf).filter((t) => seenBefore.has(t));
  assert.deepEqual(repeated, [], 'nada de la partida anterior');
  // Con otro idioma la memoria no cruza: es por usuario e idioma.
  assert.equal(memory.recentFor(['memo:fr']).words.size, 0);
});

const silver = TIERS.find((t) => t.id === 'silver')!.minRating;

/** Banco de un curso: palabras y frases A1 y A2 con ids de unidad como los del contenido real. */
function courseBank(lang: string) {
  const unit = (level: 'a1' | 'a2') => `${lang === 'en' ? '' : `${lang}-`}${level}-u01`;
  const words: RushWord[] = [];
  const sentences: ArcadeSentence[] = [];
  for (const level of ['a1', 'a2'] as const) {
    for (let i = 0; i < 30; i++) {
      words.push({
        id: `${lang}-${level}-w${i}`,
        text: `${lang}${level}palabra${i}`,
        translationEs: `${lang}${level}significado${i}`,
        level: level.toUpperCase(),
        unitId: unit(level),
      });
    }
    for (let i = 0; i < 8; i++) {
      sentences.push({
        id: `${lang}-${level}-s${i}`,
        tokens: [`${lang}${level}frase${i}`, 'kk', 'zz'],
        answer: `${lang}${level}frase${i} kk zz`,
        acceptedAnswers: [],
        translation: `${lang}${level}traducción${i}`,
        unitId: unit(level),
      });
    }
  }
  return { words, sentences };
}

for (const { code } of LANGUAGES.filter((l) => l.ranked)) {
  for (const [band, rating] of [
    ['A1', 0],
    ['A1+A2', silver],
  ] as const) {
    test(`seis cursos · ${code} · ${band}: Word Rush con los cuatro formatos y sólo contenido del nivel`, async () => {
      const { words, sentences } = courseBank(code);
      const store = new FakeStore().add({ ...player(`p-${code}`, rating), languageCode: code });
      store.words = words;
      store.sentences = sentences;
      const h = await harness(store);
      const views = [...(await practice(h, `p-${code}`, 24)).values()];
      const kinds = new Set(views.map((v) => v.kind));
      assert.deepEqual([...kinds].sort(), ['audio', 'connect', 'sentence', 'swipe']);
      const texts = views.flatMap(anyTexts);
      assert.ok(
        texts.every((t) => t.startsWith(code) || t === 'kk' || t === 'zz'),
        'sólo su idioma',
      );
      const a2 = texts.filter((t) => t.startsWith(`${code}a2`));
      if (rating < silver) assert.equal(a2.length, 0, 'en Bronce sólo A1');
      else assert.ok(a2.length > 0, 'desde Plata también A2');
    });
  }
}

// =================================================================================================
// Transición de protocolo
// =================================================================================================

test('transición: por defecto acepta 2 y 3 (Word Rush clásico sigue para las builds anteriores)', async () => {
  const store = new FakeStore().add(player('vieja', 1000, 0, 1));
  const h = await harness(store);
  const v2 = h.client('vieja', WORD_RUSH_PROTOCOL_VERSION);
  await connected(v2);
  await v2.emitWithAck('queue:join', { mode: 'ranked' });
  const match = next(v2, 'match:found');
  h.clock.advance(BOT_CONFIG.afterMs);
  const snap = (await match) as BattleSnapshot;
  assert.equal(snap.arcade, undefined, 'la build anterior sigue con su formato');
  assert.ok(snap.question === null || snap.question === undefined);
  v2.disconnect();
});

test('transición: con protocolVersions [3] (el corte), una build v2 recibe protocol_mismatch', async () => {
  const store = new FakeStore().add(player('corte', 1000));
  const h = await harness(store, { protocolVersions: [ARCADE_PROTOCOL_VERSION] });
  const v2 = h.client('corte', WORD_RUSH_PROTOCOL_VERSION);
  await assert.rejects(connected(v2), /protocol_mismatch/);
  const v3 = h.client('corte', ARCADE_PROTOCOL_VERSION);
  await connected(v3);
  const port = (h.server.http.address() as AddressInfo).port;
  const health = (await (await fetch(`http://127.0.0.1:${port}/health`)).json()) as {
    protocolVersion: number;
    protocolVersions: number[];
  };
  assert.deepEqual(health.protocolVersions, [ARCADE_PROTOCOL_VERSION]);
  assert.equal(health.protocolVersion, ARCADE_PROTOCOL_VERSION);
  v3.disconnect();
});

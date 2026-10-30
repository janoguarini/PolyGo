import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import { BOT_CONFIG } from '../../shared/bots';
import {
  PROTOCOL_VERSION,
  WORD_RUSH,
  type BattleFinish,
  type BattleSnapshot,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { generateQuestions } from '../../shared/wordRush';
import { Battle, type BattleHooks } from '../src/battle';
import { ManualClock } from '../src/clock';
import { Matchmaker } from '../src/matchmaking';
import { createBattleServer, type BattleServer } from '../src/server';
import { settleBattle } from '../src/settlement';
import { silentLogger, type PlayerInfo } from '../src/types';
import { FakeStore, WORDS, flush, player, seededRandom } from './helpers';

const bot = (rating = 1000): PlayerInfo => ({
  userId: 'bot:1',
  username: 'Kiko',
  avatarId: 'crown',
  avatarPath: null,
  isBot: true,
  languageCode: 'en',
  rating,
  gamesPlayed: BOT_CONFIG.displayedGames,
});

function botBattle(botRating = 1000) {
  const clock = new ManualClock();
  const sent: { userId: string; event: string; payload: unknown }[] = [];
  const finished: string[] = [];
  const hooks: BattleHooks = {
    send: (userId, event, ...args) => sent.push({ userId, event, payload: args[0] }),
    onStart: () => Promise.resolve(),
    onFinish: (_b, status) => finished.push(status),
    onCancel: () => {},
  };
  const questions = generateQuestions(WORDS, 40, seededRandom(2));
  const battle = new Battle(
    'bb1',
    'ranked',
    'en',
    [player('alice'), bot(botRating)],
    questions,
    clock,
    hooks,
    WORD_RUSH,
    seededRandom(5),
  );
  return { clock, sent, finished, battle };
}

/** Confirma, deja pasar la cuenta atrás y juega toda la partida sin que alice responda. */
async function playOut(s: ReturnType<typeof botBattle>) {
  s.battle.begin();
  s.battle.markReady('alice');
  s.clock.advance(BOT_CONFIG.readyMs.max);
  await flush();
  s.clock.advance(WORD_RUSH.countdownMs + WORD_RUSH.durationMs);
}

test('el bot confirma solo y juega toda la partida por el mismo camino que una persona', async () => {
  const s = botBattle();
  s.battle.begin();
  const found = s.sent.find((x) => x.event === 'match:found')!.payload as BattleSnapshot;
  assert.equal(found.players[1]!.isBot, true, 'el rival llega marcado como bot');
  assert.equal(found.players[0]!.isBot, false);

  s.battle.markReady('alice');
  s.clock.advance(BOT_CONFIG.readyMs.max);
  await flush();
  assert.equal(s.battle.status, 'ready', 'el bot confirmó sin intervención');

  s.clock.advance(WORD_RUSH.countdownMs);
  assert.equal(s.battle.status, 'in_progress');
  s.clock.advance(WORD_RUSH.durationMs);
  assert.deepEqual(s.finished, ['completed']);

  const [, botLine] = s.battle.finalLines();
  assert.ok(botLine!.answered > 8, `el bot respondió (${botLine!.answered})`);
  assert.ok(botLine!.score > 0);
  assert.ok(botLine!.correct <= botLine!.answered);
  // Ninguna pregunta se le "envía" al bot: las responde internamente.
  assert.ok(!s.sent.some((x) => x.userId === 'bot:1' && x.event === 'battle:question'));
});

test('un bot de más rating suma más puntos', async () => {
  const score = async (rating: number) => {
    const s = botBattle(rating);
    await playOut(s);
    return s.battle.finalLines()[1]!.score;
  };
  assert.ok((await score(1700)) > (await score(700)));
});

test('liquidación contra un bot: el ELO usa el rating del bot y el bot no guarda ELO', async () => {
  const s = botBattle(1100);
  await playOut(s);

  const store = new FakeStore().add(player('alice', 1000, 10));
  await store.startBotBattle('bb1', 'en', 'alice', {
    name: 'Kiko',
    avatarId: 'crown',
    rating: 1100,
  });
  const result = await settleBattle(store, s.battle, 'completed');
  const [alice, kiko] = result.players;
  // Alice no respondió nada: pierde contra un rival de 1100.
  const expected = 1 / (1 + 10 ** (100 / 400));
  assert.equal(alice!.outcome, 'loss');
  assert.equal(alice!.ratingBefore, 1000);
  assert.equal(alice!.ratingAfter, 1000 - Math.round(32 * expected));
  assert.equal(kiko!.isBot, true);
  assert.equal(kiko!.ratingAfter, null);
});

test('matchmaker: saca de la cola a quien esperó demasiado', () => {
  const m = new Matchmaker();
  m.join({ userId: 'a', languageCode: 'en', rating: 1000, joinedAt: 0 });
  m.join({ userId: 'b', languageCode: 'en', rating: 1000, joinedAt: 5_000 });
  assert.deepEqual(
    m.takeWaitingLongerThan(10_000, 12_000).map((e) => e.userId),
    ['a'],
  );
  assert.equal(m.size, 1);
});

// ---------- servidor completo ----------
type Client = Socket<ServerToClientEvents, ClientToServerEvents>;
let server: BattleServer;
let url: string;
let store: FakeStore;
const clients: Client[] = [];

before(async () => {
  store = new FakeStore().add(player('solo', 1000, 10), player('p1'), player('p2', 1020));
  server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    // Un bot de 1000 tarda unos 3,6 s por pregunta: la partida tiene que darle tiempo.
    rules: { ...WORD_RUSH, countdownMs: 50, durationMs: 8_000, readyTimeoutMs: 2_000 },
    tickMs: 20,
    random: seededRandom(11),
    botAfterMs: 300,
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
});

after(async () => {
  for (const c of clients) c.disconnect();
  await server.close();
});

function client(userId: string): Client {
  const socket: Client = connect(url, {
    transports: ['websocket'],
    auth: { token: `tok-${userId}`, protocolVersion: PROTOCOL_VERSION },
    reconnection: false,
    forceNew: true,
  });
  clients.push(socket);
  return socket;
}

const connected = (socket: Client) =>
  new Promise<void>((resolve, reject) => {
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });

function next<E extends keyof ServerToClientEvents>(
  socket: Client,
  event: E,
  timeoutMs = 12_000,
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

test('sin rival humano a tiempo juega contra un bot de su nivel, y la partida se liquida', async () => {
  const solo = client('solo');
  await connected(solo);
  const found = next(solo, 'match:found');
  solo.emit('queue:join', { mode: 'ranked' }, () => {});
  const snap = (await found) as BattleSnapshot;
  const opponent = snap.players.find((p) => p.slot !== snap.yourSlot)!;
  assert.equal(opponent.isBot, true);
  assert.ok(Math.abs(opponent.rating - 1000) <= BOT_CONFIG.ratingJitter);

  const finish = next(solo, 'battle:finish');
  solo.emit('match:ready', { battleId: snap.battleId }, () => {});
  const result = (await finish) as BattleFinish;
  assert.equal(store.botBattles.get(snap.battleId)?.player, 'solo');
  const botLine = result.players.find((p) => p.slot !== result.yourSlot)!;
  assert.equal(botLine.isBot, true);
  assert.ok(botLine.answered > 0, 'el bot jugó');
  const me = result.players.find((p) => p.slot === result.yourSlot)!;
  assert.equal(me.outcome, 'loss', 'no respondió nada');
  assert.ok(me.ratingAfter! < 1000);
});

test('si hay un humano en la cola, tiene prioridad sobre el bot', async () => {
  const a = client('p1');
  const b = client('p2');
  await Promise.all([connected(a), connected(b)]);
  const found = next(a, 'match:found');
  a.emit('queue:join', { mode: 'ranked' }, () => {});
  b.emit('queue:join', { mode: 'ranked' }, () => {});
  const snap = (await found) as BattleSnapshot;
  assert.ok(snap.players.every((p) => !p.isBot));
  a.emit('battle:leave', () => {});
});

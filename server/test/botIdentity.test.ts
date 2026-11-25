/**
 * Identidades de los bots (shared/botIdentities.ts): makeBot sólo cambia el nombre que se muestra.
 * El rating sigue saliendo de pickBot, la base recibe uno de los zorros de BOT_AVATARS, la identidad
 * no cambia durante la partida y no se repite en partidas seguidas del mismo jugador. v2 y v3.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import { ARCADE } from '../../shared/arcade';
import { BOT_IDENTITIES, botIdentityByName } from '../../shared/botIdentities';
import { BOT_AVATARS, BOT_CALIBRATION, BOT_CONFIG } from '../../shared/bots';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH,
  WORD_RUSH_PROTOCOL_VERSION,
  type BattleFinish,
  type BattleSnapshot,
  type ClientToServerEvents,
  type PublicPlayer,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { createBattleServer, type BattleServer } from '../src/server';
import { silentLogger } from '../src/types';
import { ARCADE_SENTENCES, ARCADE_WORDS, FakeStore, player, seededRandom } from './helpers';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;
let server: BattleServer;
let url: string;
let store: FakeStore;
const clients: Client[] = [];

before(async () => {
  store = new FakeStore().add(
    player('practica', 1000, 10),
    player('nueva', 600, 0),
    player('veterana', 1400, 30),
    player('clasico', 800, 0),
  );
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  store.calibrationUsed.set('veterana:en', BOT_CALIBRATION.ratedGames);
  server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: { ...WORD_RUSH, countdownMs: 30, durationMs: 400, readyTimeoutMs: 3_000 },
    arcadeRules: {
      ...ARCADE,
      countdownMs: 30,
      durationMs: 400,
      frenzyMs: 100,
      readyTimeoutMs: 3_000,
    },
    tickMs: 20,
    random: seededRandom(17),
    botAfterMs: 60,
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
});

after(async () => {
  for (const c of clients) c.disconnect();
  await server.close();
});

async function client(userId: string, protocolVersion: number): Promise<Client> {
  const socket: Client = connect(url, {
    transports: ['websocket'],
    auth: { token: `tok-${userId}`, protocolVersion },
    reconnection: false,
    forceNew: true,
  });
  clients.push(socket);
  await new Promise<void>((resolve, reject) => {
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });
  return socket;
}

function next<E extends keyof ServerToClientEvents>(
  socket: Client,
  event: E,
  timeoutMs = 5_000,
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

const rival = (snap: BattleSnapshot): PublicPlayer =>
  snap.players.find((p) => p.slot !== snap.yourSlot)!;

/** El bot tal como lo arma makeBot: identidad del catálogo, zorro para la base, rating de pickBot. */
function assertCatalogBot(bot: PublicPlayer, playerRating: number, playerAvatarId = 'bolt') {
  assert.equal(bot.isBot, true);
  const identity = botIdentityByName(bot.username);
  assert.ok(identity, `«${bot.username}» es del catálogo`);
  assert.notEqual(identity.avatarId, playerAvatarId, 'no se ve igual que el jugador');
  assert.ok(
    (BOT_AVATARS as readonly string[]).includes(bot.avatarId),
    'avatar aceptado por la base',
  );
  assert.ok(Math.abs(bot.rating - playerRating) <= BOT_CONFIG.ratingJitter, 'rating de pickBot');
  assert.equal(bot.gamesPlayed, BOT_CONFIG.displayedGames);
  return identity;
}

test('práctica contra bot, una tras otra: siempre del catálogo y nunca la misma dos veces seguidas', async () => {
  const socket = await client('practica', WORD_RUSH_PROTOCOL_VERSION);
  const names: string[] = [];
  for (let i = 0; i < 10; i++) {
    // Pausa para no pasar el límite de eventos por segundo del socket (maxEventsPerSecond).
    await new Promise((r) => setTimeout(r, 150));
    const found = next(socket, 'match:found');
    socket.emit('queue:join', { mode: 'bot_practice' }, () => {});
    const snap = (await found) as BattleSnapshot;
    assertCatalogBot(rival(snap), 1000);
    names.push(rival(snap).username);
    const cancelled = next(socket, 'battle:cancel');
    socket.emit('battle:leave', () => {});
    await cancelled;
  }
  for (let i = 1; i < names.length; i++) assert.notEqual(names[i], names[i - 1]);
  assert.ok(new Set(names).size > 1);
  assert.ok(names.every((n) => BOT_IDENTITIES.some((identity) => identity.name === n)));
  socket.disconnect();
});

/** Ranked hasta que entra el bot, juega sin responder y devuelve la foto, el inicio y el final. */
async function rankedBotMatch(socket: Client) {
  const found = next(socket, 'match:found');
  const start = next(socket, 'battle:start');
  const finish = next(socket, 'battle:finish');
  socket.emit('queue:join', { mode: 'ranked' }, () => {});
  const snap = (await found) as BattleSnapshot;
  socket.emit('match:ready', { battleId: snap.battleId }, () => {});
  return { snap, start: (await start) as BattleSnapshot, result: (await finish) as BattleFinish };
}

for (const [label, userId, protocol, rating, expected] of [
  ['v3 con cupo: calibración', 'nueva', ARCADE_PROTOCOL_VERSION, 600, 'calibration'],
  ['v3 sin cupo: sin ELO', 'veterana', ARCADE_PROTOCOL_VERSION, 1400, 'unrated'],
  [
    'v2 (Word Rush clásico): calibración',
    'clasico',
    WORD_RUSH_PROTOCOL_VERSION,
    800,
    'calibration',
  ],
] as const) {
  test(`ranked ${label}: la misma identidad del principio al final y en la base`, async () => {
    const socket = await client(userId, protocol);
    const before = { ...store.players.get(userId)! };
    const { snap, start, result } = await rankedBotMatch(socket);
    const identity = assertCatalogBot(rival(snap), rating);

    // Igual en la foto inicial, al empezar y en el resultado.
    assert.equal(rival(start).username, identity.name);
    assert.equal(rival(start).avatarId, rival(snap).avatarId);
    assert.equal(rival(start).rating, rival(snap).rating);
    const botLine = result.players.find((p) => p.slot !== result.yourSlot)!;
    assert.equal(botLine.username, identity.name);
    assert.equal(botLine.isBot, true);

    // La base recibió el mismo nombre (entra en bot_name) y un zorro de BOT_AVATARS.
    const saved = store.botBattles.get(snap.battleId)!;
    assert.equal(saved.bot.name, identity.name);
    assert.ok(saved.bot.name.length <= 20);
    assert.ok((BOT_AVATARS as readonly string[]).includes(saved.bot.avatarId));
    assert.equal(saved.bot.rating, rival(snap).rating);
    assert.equal(store.protocolOf.get(snap.battleId), protocol);

    // Ranked/unrated como antes de las identidades.
    assert.equal(snap.rating, expected);
    assert.equal(result.rating, expected);
    if (expected === 'unrated') {
      assert.ok(store.unranked.has(snap.battleId));
      assert.equal(store.players.get(userId)!.rating, before.rating);
      assert.equal(store.players.get(userId)!.gamesPlayed, before.gamesPlayed);
      for (const p of result.players) assert.equal(p.ratingAfter, null);
    } else {
      assert.ok(!store.unranked.has(snap.battleId));
      assert.equal(store.calibrationUsed.get(`${userId}:en`), 1);
    }
    socket.disconnect();
  });
}

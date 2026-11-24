/**
 * Bot de respaldo en Ranked: a los BOT_CONFIG.afterMs (3 s) sin rival humano entra un bot. Con cupo
 * de calibración la partida es de calibración; sin cupo, sin ELO (unrated). El reloj es manual y el
 * tick y la espera son los de producción (botAfterMs y tickMs por defecto).
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import { BOT_CALIBRATION, BOT_CONFIG } from '../../shared/bots';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH_PROTOCOL_VERSION,
  type BattleSnapshot,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { ManualClock } from '../src/clock';
import { createBattleServer, type BattleServer } from '../src/server';
import { silentLogger } from '../src/types';
import { ARCADE_SENTENCES, ARCADE_WORDS, FakeStore, flush, player, seededRandom } from './helpers';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

async function start(store: FakeStore) {
  const clock = new ManualClock();
  const server: BattleServer = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    clock,
    random: seededRandom(5),
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  const url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
  const clients: Client[] = [];
  const client = async (userId: string, protocolVersion = WORD_RUSH_PROTOCOL_VERSION) => {
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
  };
  const close = async () => {
    for (const c of clients) c.disconnect();
    await server.close();
  };
  return { clock, server, client, close };
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

/** Entra a la cola ranked y espera el primer queue:status (la entrada ya quedó registrada). */
async function join(socket: Client) {
  const status = next(socket, 'queue:status');
  socket.emit('queue:join', { mode: 'ranked' }, () => {});
  return status;
}

test('la espera por defecto antes del bot es de 3000 ms', () => {
  assert.equal(BOT_CONFIG.afterMs, 3_000);
});

test('con cupo de calibración: a los 3000 ms (no antes) entra un bot de calibración', async () => {
  const store = new FakeStore().add(player('nuevo', 1000, 0));
  const s = await start(store);
  try {
    const socket = await s.client('nuevo');
    const found = next(socket, 'match:found');
    assert.equal((await join(socket)).botCalibrationLeft, BOT_CALIBRATION.ratedGames);

    s.clock.advance(BOT_CONFIG.afterMs - 1);
    await flush();
    assert.equal(s.server.stats().battles, 0, 'antes de 3000 ms no hay bot');
    assert.equal(s.server.stats().queued, 1);

    s.clock.advance(1);
    const snap = (await found) as BattleSnapshot;
    assert.equal(snap.mode, 'ranked');
    assert.equal(snap.rating, 'calibration');
    assert.deepEqual(snap.calibration, { used: 1, limit: BOT_CALIBRATION.ratedGames });
    assert.equal(snap.players.find((p) => p.slot !== snap.yourSlot)!.isBot, true);
    assert.equal(s.server.stats().queued, 0);
    // Al confirmar los dos (el bot, tras su demora), se pide a la base como de calibración y la cuenta.
    await socket.emitWithAck('match:ready', { battleId: snap.battleId });
    s.clock.advance(BOT_CONFIG.readyMs.max);
    await flush();
    assert.equal(store.botBattles.size, 1);
    assert.equal(store.unranked.size, 0);
    assert.equal(store.calibrationUsed.get('nuevo:en'), 1);
  } finally {
    await s.close();
  }
});

test('sin cupo (v3): a los 3000 ms entra un bot sin ELO que la base guarda como no ranked', async () => {
  const store = new FakeStore().add(player('veterano', 1200, 30));
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  store.calibrationUsed.set('veterano:en', BOT_CALIBRATION.ratedGames);
  const s = await start(store);
  try {
    const socket = await s.client('veterano', ARCADE_PROTOCOL_VERSION);
    const found = next(socket, 'match:found');
    assert.equal((await join(socket)).botCalibrationLeft, 0);

    s.clock.advance(BOT_CONFIG.afterMs - 1);
    await flush();
    assert.equal(s.server.stats().battles, 0);

    s.clock.advance(1);
    const snap = (await found) as BattleSnapshot;
    assert.equal(snap.mode, 'ranked');
    assert.equal(snap.rating, 'unrated');
    assert.equal(snap.calibration, null);
    assert.equal(snap.players.find((p) => p.slot !== snap.yourSlot)!.isBot, true);
    await socket.emitWithAck('match:ready', { battleId: snap.battleId });
    s.clock.advance(BOT_CONFIG.readyMs.max);
    await flush();
    assert.ok(store.unranked.has(snap.battleId), 'guardada con p_rated = false');
    assert.equal(store.protocolOf.get(snap.battleId), ARCADE_PROTOCOL_VERSION);
    assert.equal(store.calibrationUsed.get('veterano:en'), BOT_CALIBRATION.ratedGames);
  } finally {
    await s.close();
  }
});

test('un rival humano en el mismo tick tiene prioridad sobre el bot y no hay partida doble', async () => {
  const store = new FakeStore().add(player('primera', 1000, 10), player('segunda', 1000, 10));
  const s = await start(store);
  try {
    const a = await s.client('primera');
    const foundA = next(a, 'match:found');
    await join(a);
    // La segunda llega cuando a la primera le falta medio segundo para el bot.
    s.clock.advance(BOT_CONFIG.afterMs - 500);
    await flush();
    assert.equal(s.server.stats().battles, 0);
    const b = await s.client('segunda');
    const foundB = next(b, 'match:found');
    await join(b);

    // En el tick de los 3000 ms la primera ya cumple la espera del bot, pero primero se empareja.
    s.clock.advance(500);
    const [snapA, snapB] = (await Promise.all([foundA, foundB])) as BattleSnapshot[];
    assert.equal(snapA!.battleId, snapB!.battleId);
    assert.equal(snapA!.rating, 'competitive');
    for (const p of snapA!.players) assert.notEqual(p.isBot, true);

    // Más ticks después: ni un bot ni una segunda partida para ninguna de las dos.
    s.clock.advance(BOT_CONFIG.afterMs);
    await flush();
    assert.equal(s.server.stats().battles, 1);
    assert.equal(s.server.stats().queued, 0);
    for (const socket of [a, b]) {
      assert.deepEqual(await socket.emitWithAck('queue:join', { mode: 'ranked' }), {
        ok: false,
        code: 'already_in_battle',
      });
    }
    // Al confirmar las dos, la base la guarda como partida entre personas, sin bot.
    await a.emitWithAck('match:ready', { battleId: snapA!.battleId });
    await b.emitWithAck('match:ready', { battleId: snapA!.battleId });
    await flush();
    assert.deepEqual(store.started.get(snapA!.battleId), ['primera', 'segunda']);
    assert.equal(store.botBattles.size, 0);
    assert.equal(s.server.stats().battles, 1);
  } finally {
    await s.close();
  }
});

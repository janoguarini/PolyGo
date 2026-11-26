// Amistosos en el servidor de partidas: la MISMA partida que Ranked (Arcade), sin ELO, por código.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import { ARCADE } from '../../shared/arcade';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH,
  WORD_RUSH_PROTOCOL_VERSION,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { createBattleServer, type BattleServer } from '../src/server';
import { silentLogger } from '../src/types';
import { ARCADE_SENTENCES, ARCADE_WORDS, FakeStore, player, seededRandom } from './helpers';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const RULES = { ...WORD_RUSH, countdownMs: 50, durationMs: 1_500, readyTimeoutMs: 3_000 };
const ARCADE_RULES = { ...ARCADE, countdownMs: 50, durationMs: 1_500, readyTimeoutMs: 3_000 };

const clients: Client[] = [];
const servers: BattleServer[] = [];

after(async () => {
  for (const c of clients) c.disconnect();
  for (const s of servers) await s.close();
});

function setup() {
  const store = new FakeStore().add(player('ana', 1200), player('beto', 900), player('caro', 1000));
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  return store;
}

async function startServer(store: FakeStore): Promise<string> {
  const server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: RULES,
    arcadeRules: ARCADE_RULES,
    tickMs: 20,
    random: seededRandom(3),
    botAfterMs: null,
  });
  servers.push(server);
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  return `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
}

async function client(url: string, userId: string, protocolVersion = ARCADE_PROTOCOL_VERSION) {
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
  timeoutMs = 4_000,
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

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('amistoso: el anfitrión espera, el amigo entra con el código y juegan la partida de Ranked sin ELO', async () => {
  const store = setup().addChallenge('ABC123', 'ana', 'beto');
  const url = await startServer(store);
  const ana = await client(url, 'ana');
  const beto = await client(url, 'beto');

  assert.deepEqual(await ana.emitWithAck('challenge:host', { code: 'abc123' }), {
    ok: true,
    data: { code: 'ABC123' },
  });
  const foundAna = next(ana, 'match:found');
  const foundBeto = next(beto, 'match:found');
  assert.equal((await beto.emitWithAck('challenge:join', { code: 'ABC123' })).ok, true);
  const [snapA, snapB] = await Promise.all([foundAna, foundBeto]);

  // La misma partida de Ranked: motor Arcade (microjuegos), 2 jugadores, sin ELO.
  assert.equal(snapA.mode, 'friendly');
  assert.equal(snapA.battleId, snapB.battleId);
  assert.deepEqual(
    snapA.players.map((p) => p.username),
    ['ana', 'beto'],
  );

  const finishA = next(ana, 'battle:finish', 6_000);
  const finishB = next(beto, 'battle:finish', 6_000);
  await ana.emitWithAck('match:ready', { battleId: snapA.battleId });
  await beto.emitWithAck('match:ready', { battleId: snapA.battleId });
  const [resA] = await Promise.all([finishA, finishB]);

  assert.equal(resA.mode, 'friendly');
  assert.equal(resA.friendly, true);
  assert.equal(resA.rating, 'unrated');
  assert.ok(resA.players.every((p) => p.ratingAfter === null));
  // Guardado como amistoso (atado al desafío) y liquidado, sin tocar el rating.
  assert.deepEqual(
    store.friendlyStarts.map((f) => [f.code, f.host, f.guest, f.protocol]),
    [['ABC123', 'ana', 'beto', ARCADE_PROTOCOL_VERSION]],
  );
  assert.ok(store.settled.has(snapA.battleId));
  assert.equal(store.players.get('ana')!.rating, 1200);
  assert.equal(store.players.get('beto')!.rating, 900);
});

test('si el anfitrión no está esperando, el amigo recibe host_gone', async () => {
  const store = setup().addChallenge('NOHOST', 'ana');
  const url = await startServer(store);
  const beto = await client(url, 'beto');
  assert.deepEqual(await beto.emitWithAck('challenge:join', { code: 'NOHOST' }), {
    ok: false,
    code: 'host_gone',
  });
});

test('el anfitrión que sale de la espera ya no recibe al amigo', async () => {
  const store = setup().addChallenge('LEAVE1', 'ana');
  const url = await startServer(store);
  const ana = await client(url, 'ana');
  const beto = await client(url, 'beto');
  assert.equal((await ana.emitWithAck('challenge:host', { code: 'LEAVE1' })).ok, true);
  await ana.emitWithAck('queue:leave');
  assert.deepEqual(await beto.emitWithAck('challenge:join', { code: 'LEAVE1' }), {
    ok: false,
    code: 'host_gone',
  });
});

test('reglas del desafío: dirigido a otro, propio, ajeno y código inválido', async () => {
  const store = setup().addChallenge('FORBET', 'ana', 'beto');
  const url = await startServer(store);
  const ana = await client(url, 'ana');
  const caro = await client(url, 'caro');
  assert.equal((await ana.emitWithAck('challenge:host', { code: 'FORBET' })).ok, true);
  // Dirigido a beto: caro no puede entrar (como si no existiera).
  assert.deepEqual(await caro.emitWithAck('challenge:join', { code: 'FORBET' }), {
    ok: false,
    code: 'challenge_not_found',
  });
  // Nadie puede esperar con el código de otro.
  assert.deepEqual(await caro.emitWithAck('challenge:host', { code: 'FORBET' }), {
    ok: false,
    code: 'challenge_not_found',
  });
  assert.deepEqual(await caro.emitWithAck('challenge:join', { code: '12' }), {
    ok: false,
    code: 'invalid_payload',
  });
});

test('una build vieja (Word Rush clásico) no juega amistosos por el servidor', async () => {
  const store = setup().addChallenge('OLDONE', 'ana');
  const url = await startServer(store);
  const ana = await client(url, 'ana', WORD_RUSH_PROTOCOL_VERSION);
  assert.deepEqual(await ana.emitWithAck('challenge:host', { code: 'OLDONE' }), {
    ok: false,
    code: 'protocol_mismatch',
  });
});

test('el desafío vence mientras el anfitrión espera: se le avisa', async () => {
  const store = setup().addChallenge('EXPIRE', 'ana', null, Date.now() + 200);
  const url = await startServer(store);
  const ana = await client(url, 'ana');
  const expired = next(ana, 'server:error', 2_000);
  assert.equal((await ana.emitWithAck('challenge:host', { code: 'EXPIRE' })).ok, true);
  assert.deepEqual(await expired, { code: 'challenge_expired' });
  await wait(50);
});

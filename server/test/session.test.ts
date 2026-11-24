// Correcciones pre-deploy de Ranked Arcade (docs/RANKED_ARCADE_INTEGRATION.md):
// P1: si falla crear una práctica (sola o contra bot) después del ack ok, el cliente recibe UN
//     server:error y no se queda esperando.
// P2: una conexión de otra versión de protocolo no puede heredar una partida en curso
//     (protocol_mismatch) y saca de la cola la entrada de la otra versión; con la misma versión, la
//     reconexión y la cola se comportan como siempre.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

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

const RULES = { ...WORD_RUSH, countdownMs: 50, durationMs: 3_000, readyTimeoutMs: 3_000 };
const ARCADE_RULES = { ...ARCADE, countdownMs: 50, durationMs: 3_000, readyTimeoutMs: 3_000 };

const clients: Client[] = [];
const servers: BattleServer[] = [];

async function startServer(store: FakeStore): Promise<string> {
  const server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: RULES,
    arcadeRules: ARCADE_RULES,
    tickMs: 20,
    random: seededRandom(7),
    botAfterMs: null,
  });
  servers.push(server);
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  return `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
}

function client(url: string, userId: string, protocolVersion: number): Client {
  const socket: Client = connect(url, {
    transports: ['websocket'],
    auth: { token: `tok-${userId}`, protocolVersion },
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

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

after(async () => {
  for (const c of clients) c.disconnect();
  for (const s of servers) await s.close();
});

// ---------------------------------------------------------------------------------------------
// P1

for (const version of [WORD_RUSH_PROTOCOL_VERSION, ARCADE_PROTOCOL_VERSION]) {
  for (const mode of ['practice', 'bot_practice'] as const) {
    test(`P1 · v${version} ${mode}: si falla la creación, ack ok y UN server:error`, async () => {
      const store = new FakeStore().add(player('pia'));
      store.words = ARCADE_WORDS;
      store.sentences = ARCADE_SENTENCES;
      store.rushUnits = async () => {
        throw new Error('rush_common_unit_ids: sin unidades');
      };
      const url = await startServer(store);
      const c = client(url, 'pia', version);
      await connected(c);
      const errors: unknown[] = [];
      c.on('server:error', (e) => errors.push(e));
      let started = false;
      c.on('battle:start', () => (started = true));
      c.on('match:found', () => (started = true));
      const res = await c.emitWithAck('queue:join', { mode });
      assert.deepEqual(res, { ok: true, data: { mode } });
      await wait(250);
      assert.deepEqual(errors, [{ code: 'server_error' }], 'un solo aviso');
      assert.equal(started, false);
      // Puede volver a intentar: no quedó ninguna partida a su nombre.
      const again = await c.emitWithAck('queue:join', { mode });
      assert.equal(again.ok, true);
      c.disconnect();
    });
  }
}

test('P1 · si la creación funciona, no hay server:error (comportamiento de siempre)', async () => {
  const store = new FakeStore().add(player('lu'));
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  const url = await startServer(store);
  for (const version of [WORD_RUSH_PROTOCOL_VERSION, ARCADE_PROTOCOL_VERSION]) {
    const c = client(url, 'lu', version);
    await connected(c);
    const errors: unknown[] = [];
    c.on('server:error', (e) => errors.push(e));
    const start = next(c, 'battle:start');
    assert.equal((await c.emitWithAck('queue:join', { mode: 'practice' })).ok, true);
    const snap = await start;
    assert.equal(Boolean(snap.arcade), version === ARCADE_PROTOCOL_VERSION);
    await wait(100);
    assert.deepEqual(errors, []);
    await c.emitWithAck('battle:leave');
    c.disconnect();
    await wait(50);
  }
});

// ---------------------------------------------------------------------------------------------
// P2

let url: string;
let shared: FakeStore;
let p2: BattleServer;

before(async () => {
  shared = new FakeStore().add(
    player('ana'),
    player('beto', 1020),
    player('ceci'),
    player('dani'),
    player('eli'),
    player('fede', 1010),
  );
  shared.words = ARCADE_WORDS;
  shared.sentences = ARCADE_SENTENCES;
  url = await startServer(shared);
  p2 = servers.at(-1)!;
});

const p2Server = () => p2;

/** Dos jugadores de la misma versión entran a la cola y se emparejan. */
async function match(a: string, b: string, version: number) {
  const ca = client(url, a, version);
  const cb = client(url, b, version);
  await Promise.all([connected(ca), connected(cb)]);
  const found = next(ca, 'match:found');
  await ca.emitWithAck('queue:join', { mode: 'ranked' });
  await cb.emitWithAck('queue:join', { mode: 'ranked' });
  const snap = await found;
  return { ca, cb, snap };
}

test('P2 · otra versión no hereda una partida en curso: protocol_mismatch y la original sigue', async () => {
  const { ca, cb, snap } = await match('ana', 'beto', ARCADE_PROTOCOL_VERSION);
  assert.ok(snap.arcade);
  const intruder = client(url, 'ana', WORD_RUSH_PROTOCOL_VERSION);
  await assert.rejects(connected(intruder), /protocol_mismatch/);
  await wait(100);
  assert.equal(ca.connected, true, 'la conexión que juega no se cortó');
  // Sigue pudiendo jugar con normalidad.
  const ready = await ca.emitWithAck('match:ready', { battleId: snap.battleId });
  assert.deepEqual(ready, { ok: true, data: null });
  ca.disconnect();
  cb.disconnect();
  await wait(100);
});

test('P2 · lo mismo al revés: un cliente v3 no hereda una partida Word Rush (v2)', async () => {
  const { ca, cb, snap } = await match('eli', 'fede', WORD_RUSH_PROTOCOL_VERSION);
  assert.equal(snap.arcade, undefined);
  const intruder = client(url, 'eli', ARCADE_PROTOCOL_VERSION);
  await assert.rejects(connected(intruder), /protocol_mismatch/);
  await wait(100);
  assert.equal(ca.connected, true);
  ca.disconnect();
  cb.disconnect();
  await wait(100);
});

test('P2 · la reconexión con la misma versión sigue igual: retoma la partida', async () => {
  const { ca, cb, snap } = await match('ceci', 'dani', ARCADE_PROTOCOL_VERSION);
  const again = client(url, 'ceci', ARCADE_PROTOCOL_VERSION);
  const state = next(again, 'battle:state');
  const oldClosed = new Promise<void>((resolve) => ca.once('disconnect', () => resolve()));
  await connected(again);
  const s = await state;
  assert.equal(s.battleId, snap.battleId);
  assert.ok(s.arcade);
  await oldClosed;
  again.disconnect();
  cb.disconnect();
  await wait(100);
});

test('P2 · cola: la entrada de otra versión se saca; con la misma versión se conserva', async () => {
  const server = p2Server();
  const before = server.stats().queued;
  const v3 = client(url, 'ana', ARCADE_PROTOCOL_VERSION);
  await connected(v3);
  await v3.emitWithAck('queue:join', { mode: 'ranked' });
  assert.equal(server.stats().queued, before + 1);

  // Misma versión que reemplaza la conexión: la espera se conserva (como siempre).
  const sameVersion = client(url, 'ana', ARCADE_PROTOCOL_VERSION);
  await connected(sameVersion);
  await wait(50);
  assert.equal(server.stats().queued, before + 1);

  // Otra versión: la entrada vieja desaparece (nada de jugadores fantasma).
  const v2 = client(url, 'ana', WORD_RUSH_PROTOCOL_VERSION);
  await connected(v2);
  await wait(50);
  assert.equal(server.stats().queued, before);

  // Puede entrar a la cola con su versión: una sola entrada, sin duplicados.
  await v2.emitWithAck('queue:join', { mode: 'ranked' });
  await v2.emitWithAck('queue:join', { mode: 'ranked' });
  assert.equal(server.stats().queued, before + 1);

  // Un rival v3 en la misma cola no se empareja con ella.
  const rival = client(url, 'beto', ARCADE_PROTOCOL_VERSION);
  await connected(rival);
  let found = false;
  rival.on('match:found', () => (found = true));
  await rival.emitWithAck('queue:join', { mode: 'ranked' });
  await wait(200);
  assert.equal(found, false);
  assert.equal(server.stats().battles, 0);
  await v2.emitWithAck('queue:leave');
  await rival.emitWithAck('queue:leave');
  v2.disconnect();
  rival.disconnect();
});

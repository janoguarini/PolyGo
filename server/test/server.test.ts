import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import {
  PROTOCOL_VERSION,
  WORD_RUSH,
  type BattleFinish,
  type BattleSnapshot,
  type ClientToServerEvents,
  type QuestionView,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { createBattleServer, type BattleServer } from '../src/server';
import { silentLogger } from '../src/types';
import { FakeStore, WORDS, player, seededRandom } from './helpers';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const RULES = {
  ...WORD_RUSH,
  questionCount: 4,
  countdownMs: 50,
  durationMs: 5_000,
  readyTimeoutMs: 2_000,
  reconnectGraceMs: 300,
};

let server: BattleServer;
let url: string;
let store: FakeStore;
const clients: Client[] = [];

before(async () => {
  store = new FakeStore().add(
    player('alice'),
    player('bob', 1040),
    player('carol', 1900),
    player('dave'),
    player('erin'),
    player('fran'),
    player('gus'),
  );
  server = createBattleServer({
    store,
    // En tests el token es "tok-<userId>".
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: RULES,
    tickMs: 20,
    random: seededRandom(9),
    // Los bots tienen su propio archivo de tests (bots.test.ts).
    botAfterMs: null,
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
});

after(async () => {
  for (const c of clients) c.disconnect();
  await server.close();
});

function client(userId: string, protocolVersion = PROTOCOL_VERSION): Client {
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

const correctOptionFor = (q: QuestionView) => {
  const word = WORDS.find((w) => w.text === q.prompt || w.translationEs === q.prompt)!;
  return q.options.indexOf(q.direction === 'en_es' ? word.translationEs : word.text);
};

test('rechaza conexiones sin token válido o con otra versión de protocolo', async () => {
  const noToken = connect(url, {
    transports: ['websocket'],
    auth: { protocolVersion: PROTOCOL_VERSION },
    reconnection: false,
  });
  clients.push(noToken);
  const e1 = await new Promise<Error>((resolve) => noToken.once('connect_error', resolve));
  assert.equal(e1.message, 'unauthorized');

  const bad = connect(url, {
    transports: ['websocket'],
    auth: { token: 'nope', protocolVersion: PROTOCOL_VERSION },
    reconnection: false,
  });
  clients.push(bad);
  assert.equal(
    (await new Promise<Error>((resolve) => bad.once('connect_error', resolve))).message,
    'unauthorized',
  );

  const old = client('alice', PROTOCOL_VERSION + 1);
  assert.equal(
    (await new Promise<Error>((resolve) => old.once('connect_error', resolve))).message,
    'protocol_mismatch',
  );
});

test('sin onboarding no puede entrar a la cola', async () => {
  const ghost = client('ghost');
  await connected(ghost);
  const res = await ghost.emitWithAck('queue:join', { mode: 'ranked' });
  assert.deepEqual(res, { ok: false, code: 'onboarding_required' });
  ghost.disconnect();
});

test('partida ranked completa: cola → rival → listos → preguntas → liquidación', async () => {
  const alice = client('alice');
  const bob = client('bob');
  await Promise.all([connected(alice), connected(bob)]);

  const aliceFound = next(alice, 'match:found');
  const bobFound = next(bob, 'match:found');
  assert.deepEqual(await alice.emitWithAck('queue:join', { mode: 'ranked' }), {
    ok: true,
    data: { mode: 'ranked' },
  });
  await bob.emitWithAck('queue:join', { mode: 'ranked' });

  const found: BattleSnapshot = await aliceFound;
  await bobFound;
  assert.deepEqual(found.players.map((p) => p.username).sort(), ['alice', 'bob']);

  // No puede volver a la cola estando en partida.
  assert.deepEqual(await alice.emitWithAck('queue:join', { mode: 'ranked' }), {
    ok: false,
    code: 'already_in_battle',
  });

  const aliceQ = next(alice, 'battle:question');
  const bobQ = next(bob, 'battle:question');
  const started = next(alice, 'battle:start');
  await alice.emitWithAck('match:ready', { battleId: found.battleId });
  await bob.emitWithAck('match:ready', { battleId: found.battleId });
  const start = await started;
  assert.equal(start.endsAt! - start.startsAt!, RULES.durationMs);
  assert.equal(store.started.has(found.battleId), true, 'la partida se guardó al empezar');

  // Alice responde todo bien; Bob todo mal.
  const play = async (socket: Client, first: Promise<QuestionView>, right: boolean) => {
    let q = await first;
    for (;;) {
      const option = right ? correctOptionFor(q) : (correctOptionFor(q) + 1) % q.options.length;
      const nextQ = q.index + 1 < RULES.questionCount ? next(socket, 'battle:question') : null;
      const res = await socket.emitWithAck('battle:answer', {
        battleId: found.battleId,
        questionIndex: q.index,
        option,
      });
      assert.equal(res.ok, true);
      if (res.ok) assert.equal(res.data.correct, right);
      if (!nextQ) return;
      q = await nextQ;
    }
  };
  const aliceFinish = next(alice, 'battle:finish');
  const bobFinish = next(bob, 'battle:finish');
  await Promise.all([play(alice, aliceQ, true), play(bob, bobQ, false)]);

  const fa: BattleFinish = await aliceFinish;
  const fb: BattleFinish = await bobFinish;
  assert.equal(fa.status, 'completed');
  const me = fa.players.find((p) => p.slot === fa.yourSlot)!;
  const rival = fa.players.find((p) => p.slot !== fa.yourSlot)!;
  assert.equal(me.username, 'alice');
  assert.equal(me.outcome, 'win');
  assert.equal(me.correct, RULES.questionCount);
  assert.equal(rival.outcome, 'loss');
  assert.equal(rival.score, 0);
  assert.ok(me.ratingAfter! > me.ratingBefore!);
  assert.deepEqual(
    fa.achievementsUnlocked.map((a) => a.id),
    ['first_win'],
  );
  assert.deepEqual(fb.achievementsUnlocked, []);
  assert.equal(store.settled.get(fa.battleId)!.status, 'completed');

  // Liberados: pueden volver a buscar.
  assert.equal((await alice.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  await alice.emitWithAck('queue:leave');
  alice.disconnect();
  bob.disconnect();
});

test('ratings muy distintos no se emparejan de entrada', async () => {
  const dave = client('dave');
  const carol = client('carol');
  await Promise.all([connected(dave), connected(carol)]);
  await dave.emitWithAck('queue:join', { mode: 'ranked' });
  await carol.emitWithAck('queue:join', { mode: 'ranked' });
  const status = await next(carol, 'queue:status');
  assert.equal(status.searching, true);
  assert.equal(status.window, 100);
  await new Promise((r) => setTimeout(r, 150));
  assert.equal(server.stats().battles, 0);
  assert.equal(server.stats().queued, 2);
  dave.disconnect();
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(server.stats().queued, 1, 'desconectarse saca de la cola');
  carol.disconnect();
});

test('reconexión: el jugador vuelve a su partida con la misma pregunta; si no vuelve, pierde', async () => {
  const erin = client('erin');
  const fran = client('fran');
  await Promise.all([connected(erin), connected(fran)]);
  const found = next(erin, 'match:found');
  await erin.emitWithAck('queue:join', { mode: 'ranked' });
  await fran.emitWithAck('queue:join', { mode: 'ranked' });
  const { battleId } = await found;
  const firstQ = next(fran, 'battle:question');
  await erin.emitWithAck('match:ready', { battleId });
  await fran.emitWithAck('match:ready', { battleId });
  const q0 = await firstQ;

  const offline = next(erin, 'battle:opponent_status');
  fran.disconnect();
  assert.equal((await offline).connected, false);

  const fran2 = client('fran');
  const state = next(fran2, 'battle:state');
  const online = next(erin, 'battle:opponent_status');
  const snapshot = await state;
  assert.equal(snapshot.battleId, battleId);
  assert.equal(snapshot.status, 'in_progress');
  assert.equal(snapshot.question!.index, q0.index);
  assert.equal(snapshot.question!.sentAt, q0.sentAt, 'el reloj de la pregunta no se reinicia');
  assert.equal((await online).connected, true);

  // Ahora se va del todo: tras la gracia, derrota por abandono.
  const finish = next(erin, 'battle:finish');
  fran2.disconnect();
  const result = await finish;
  assert.equal(result.status, 'forfeited');
  const franLine = result.players.find((p) => p.username === 'fran')!;
  assert.equal(franLine.forfeited, true);
  assert.equal(franLine.outcome, 'loss');
  assert.equal(result.players.find((p) => p.username === 'erin')!.outcome, 'win');
  erin.disconnect();
});

test('práctica: sin rival, sin confirmación y sin tocar el ELO', async () => {
  const gus = client('gus');
  await connected(gus);
  const settledBefore = store.settled.size;
  const start = next(gus, 'battle:start');
  const firstQ = next(gus, 'battle:question');
  assert.deepEqual(await gus.emitWithAck('queue:join', { mode: 'practice' }), {
    ok: true,
    data: { mode: 'practice' },
  });
  const snapshot = await start;
  assert.equal(snapshot.mode, 'practice');
  assert.equal(snapshot.players.length, 1);
  const q = await firstQ;
  await gus.emitWithAck('battle:answer', {
    battleId: snapshot.battleId,
    questionIndex: q.index,
    option: correctOptionFor(q),
  });

  // Salir de la práctica la termina con lo que llevaba, sin resultado ni ELO.
  const finish = next(gus, 'battle:finish');
  assert.deepEqual(await gus.emitWithAck('battle:leave'), { ok: true, data: null });
  const result = await finish;
  assert.equal(result.mode, 'practice');
  assert.equal(result.players[0]!.correct, 1);
  assert.equal(result.players[0]!.outcome, null);
  assert.equal(result.players[0]!.ratingAfter, null);
  assert.equal(store.settled.size, settledBefore);
  assert.equal(store.started.has(snapshot.battleId), false);
  gus.disconnect();
});

test('rate limit: un socket que inunda eventos sólo recibe respuesta a los primeros', async () => {
  const flood = client('alice');
  await connected(flood);
  const results = await Promise.allSettled(
    Array.from({ length: 30 }, () => flood.timeout(500).emitWithAck('battle:sync')),
  );
  const answered = results.filter((r) => r.status === 'fulfilled').length;
  assert.equal(answered, 20);
  flood.disconnect();
});

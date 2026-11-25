// Fases C.7 y C.8 (docs/LEARNING_PHASE_C.md §C7, §C8): el servidor de partidas arma el mazo sólo con el
// vocabulario común a los jugadores humanos (rush_common_unit_ids) y ambos reciben las mismas
// preguntas, en el mismo orden. Desde la C.8 cada cliente declara su nivel curricular en el handshake
// (campo opcional `curriculumApi`, misma PROTOCOL_VERSION): sin él cuenta como 0. Sin cambios en
// reglas, ELO ni contratos.
//
// El FakeStore modela rush_player_unit_ids: `unitsByUser` es lo que ve un jugador con un cliente de
// nivel 0 (la ruta de respaldo + sus desbloqueos) y `unitsByUserCompatible` lo que ve con nivel ≥ 1 (su
// ruta asignada). La regla real (ruta persistente, publicación y desbloqueos) está en SQL y se prueba en
// supabase/tests/curriculumIsolation.test.mjs y curriculumPropagation.test.mjs.
//
// Portado del servidor original (PolyGo/server/test/curriculum.test.ts) al servidor con Ranked Arcade:
// los casos de Word Rush van con el protocolo 2 y al final se repiten para Arcade (protocolo 3), donde el
// filtro de unidades vale también para las frases de Sentence Rush.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import { ARCADE, type ArcadeSentence, type ChallengeView } from '../../shared/arcade';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH_PROTOCOL_VERSION as PROTOCOL_VERSION,
  WORD_RUSH,
  parseCurriculumApi,
  type BattleSnapshot,
  type ClientToServerEvents,
  type QuestionView,
  type ServerToClientEvents,
} from '../../shared/protocol';
import type { RushWord } from '../../shared/wordRush';
import { createBattleServer, type BattleServer } from '../src/server';
import { silentLogger } from '../src/types';
import { FakeStore, player, seededRandom } from './helpers';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const RULES = {
  ...WORD_RUSH,
  questionCount: 12,
  countdownMs: 30,
  durationMs: 10_000,
  readyTimeoutMs: 2_000,
  reconnectGraceMs: 300,
};

const word = (id: string, es: string, unitId: string): RushWord => ({
  id: `en-${id}`,
  text: id,
  translationEs: es,
  unitId,
});

// U1: común a todos. U2: desbloqueada por «v1-ahead» y las cuentas v2. U13/U14: sólo la ruta v2.
const U1 = [
  word('hello', 'hola', 'a1-u01'),
  word('goodbye', 'adiós', 'a1-u01'),
  word('yes', 'sí', 'a1-u01'),
  word('no', 'no', 'a1-u01'),
  word('please', 'por favor', 'a1-u01'),
  word('thanks', 'gracias', 'a1-u01'),
];
const U2 = [word('mother', 'madre', 'a1-u02'), word('father', 'padre', 'a1-u02')];
const U13 = [word('surname', 'apellido', 'a1-u13'), word('email', 'correo', 'a1-u13')];
const U14 = [word('a cup of', 'una taza de', 'a1-u14'), word('price', 'precio', 'a1-u14')];
const ALL = [...U1, ...U2, ...U13, ...U14];

/** Arcade: seis frases de U1 y seis de U13 (alcanza para que Sentence Rush entre en la rotación). */
const sentence = (id: string, text: string, unitId: string): ArcadeSentence => ({
  id,
  tokens: text.replace(/[.?]$/, '').split(' '),
  answer: text,
  acceptedAnswers: [],
  translation: `(${id})`,
  unitId,
});
const S1 = [
  sentence('s1-1', 'I am Ana.', 'a1-u01'),
  sentence('s1-2', 'You are Tom.', 'a1-u01'),
  sentence('s1-3', 'She is here.', 'a1-u01'),
  sentence('s1-4', 'We are friends.', 'a1-u01'),
  sentence('s1-5', 'He is my teacher.', 'a1-u01'),
  sentence('s1-6', 'They are at school.', 'a1-u01'),
];
const S13 = [
  sentence('s13-1', 'My surname is Smith.', 'a1-u13'),
  sentence('s13-2', 'Write your email here.', 'a1-u13'),
  sentence('s13-3', 'Spell your surname please.', 'a1-u13'),
  sentence('s13-4', 'What is your email?', 'a1-u13'),
  sentence('s13-5', 'This is my new email.', 'a1-u13'),
  sentence('s13-6', 'His surname is very long.', 'a1-u13'),
];

const ARCADE_RULES = {
  ...ARCADE,
  countdownMs: 30,
  durationMs: 1_200,
  frenzyMs: 400,
  readyTimeoutMs: 2_000,
  reconnectGraceMs: 300,
};

/** Nivel de la build C.5+ (src/lib/clientInfo.ts). */
const NEW = 1;
/** Build anterior a la C.8: el handshake no trae `curriculumApi`. */
const OLD = undefined;

let server: BattleServer;
let url: string;
let store: FakeStore;
const clients: Client[] = [];

before(async () => {
  store = new FakeStore().add(
    player('v1-a', 1000),
    player('v1-b', 1000),
    player('v1-ahead', 1000),
    player('v2-a', 1000),
    player('v2-b', 1000),
    player('v2-new', 1000),
    player('solo', 1000),
  );
  store.words = ALL;
  store.sentences = [...S1, ...S13];
  // Con cliente de nivel 0: la ruta de respaldo (v1) y sus desbloqueos.
  store.unitsByUser.set('v1-a', ['a1-u01']);
  store.unitsByUser.set('v1-b', ['a1-u01']);
  store.unitsByUser.set('v1-ahead', ['a1-u01', 'a1-u02']);
  store.unitsByUser.set('v2-a', ['a1-u01', 'a1-u02']);
  store.unitsByUser.set('v2-b', ['a1-u01', 'a1-u02']);
  store.unitsByUser.set('v2-new', ['a1-u01']);
  store.unitsByUser.set('solo', ['a1-u01']);
  // Con cliente compatible: la ruta asignada. Las cuentas v1 no tienen otra (sin entrada = igual).
  store.unitsByUserCompatible.set('v2-a', ['a1-u01', 'a1-u02', 'a1-u13', 'a1-u14']);
  store.unitsByUserCompatible.set('v2-b', ['a1-u01', 'a1-u02', 'a1-u13', 'a1-u14']);
  // v2 con progreso menor: sólo desbloqueó U1 y U13 (U13 va tras U3 en la v2: aquí sólo importa que
  // lo desbloqueado es distinto).
  store.unitsByUserCompatible.set('v2-new', ['a1-u01', 'a1-u13']);
  server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: RULES,
    arcadeRules: ARCADE_RULES,
    tickMs: 20,
    random: seededRandom(11),
    botAfterMs: null,
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
});

after(async () => {
  for (const c of clients) c.disconnect();
  await server.close();
});

/** api undefined = build anterior (el handshake no trae el campo); cualquier otro valor viaja tal cual. */
function client(userId: string, api: unknown = OLD, protocolVersion = PROTOCOL_VERSION): Client {
  const auth: Record<string, unknown> = {
    token: `tok-${userId}`,
    protocolVersion,
  };
  if (api !== undefined) auth.curriculumApi = api;
  const socket: Client = connect(url, {
    transports: ['websocket'],
    auth,
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

/** Lo que el jugador ve de cada pregunta (sin tiempos). */
const view = (q: QuestionView) => ({
  index: q.index,
  kind: q.kind,
  direction: q.direction,
  prompt: q.prompt,
  options: q.options,
});

/** Responde todas las preguntas (siempre la opción 0) y devuelve lo que vio, en orden. */
async function playAll(socket: Client, battleId: string, first: Promise<QuestionView>) {
  const seen: ReturnType<typeof view>[] = [];
  let q = await first;
  for (;;) {
    seen.push(view(q));
    const nextQ = q.index + 1 < RULES.questionCount ? next(socket, 'battle:question') : null;
    const res = await socket.emitWithAck('battle:answer', {
      battleId,
      questionIndex: q.index,
      ...(q.kind === 'write' ? { text: 'x' } : { option: 0 }),
    });
    assert.equal(res.ok, true);
    if (!nextQ) return seen;
    q = await nextQ;
  }
}

/** Una partida ranked entre a y b (cada uno con el nivel de su cliente): lo que vio cada uno. */
async function rankedMatch([a, apiA]: [string, unknown], [b, apiB]: [string, unknown]) {
  const ca = client(a, apiA);
  const cb = client(b, apiB);
  await Promise.all([connected(ca), connected(cb)]);
  const fa = next(ca, 'match:found');
  const fb = next(cb, 'match:found');
  assert.equal((await ca.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  assert.equal((await cb.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  const found: BattleSnapshot = await fa;
  await fb;
  const qa = next(ca, 'battle:question');
  const qb = next(cb, 'battle:question');
  const finishA = next(ca, 'battle:finish', 8_000);
  const finishB = next(cb, 'battle:finish', 8_000);
  await ca.emitWithAck('match:ready', { battleId: found.battleId });
  await cb.emitWithAck('match:ready', { battleId: found.battleId });
  const [seenA, seenB] = await Promise.all([
    playAll(ca, found.battleId, qa),
    playAll(cb, found.battleId, qb),
  ]);
  const [endA, endB] = await Promise.all([finishA, finishB]);
  ca.disconnect();
  cb.disconnect();
  return { seenA, seenB, battleId: found.battleId, endA, endB };
}

/** Todos los textos que aparecieron (enunciados y opciones). */
const texts = (seen: ReturnType<typeof view>[]) => seen.flatMap((q) => [q.prompt, ...q.options]);
const textsOf = (words: RushWord[]) => words.flatMap((w) => [w.text, w.translationEs]);

function assertOnly(seen: ReturnType<typeof view>[], allowed: RushWord[]) {
  const ok = new Set(textsOf(allowed));
  for (const t of texts(seen)) assert.ok(ok.has(t), `«${t}» fuera del contenido común`);
}

/** Niveles con que el servidor pidió el conjunto común de la última partida, por usuario. */
const lastApis = () => Object.fromEntries(store.rushApiCalls.at(-1)![1]);

test('handshake: curriculumApi opcional; ausente o inválido = 0 (misma regla que parse_curriculum_api)', () => {
  assert.equal(parseCurriculumApi(undefined), 0);
  assert.equal(parseCurriculumApi(null), 0);
  assert.equal(parseCurriculumApi(1), 1);
  assert.equal(parseCurriculumApi(' 2 '), 2);
  assert.equal(parseCurriculumApi('1'), 1);
  assert.equal(parseCurriculumApi(999), 999);
  for (const bad of [-1, 1000, 1.5, Number.NaN, '1a', '', '1000', true, {}, [1]]) {
    assert.equal(parseCurriculumApi(bad), 0, `valor ${JSON.stringify(bad)}`);
  }
});

test('dos v1 con cliente antiguo (protocolo anterior): mismas preguntas y orden, sólo U1', async () => {
  const { seenA, seenB } = await rankedMatch(['v1-a', OLD], ['v1-b', OLD]);
  assert.equal(seenA.length, RULES.questionCount);
  assert.deepEqual(seenA, seenB);
  assertOnly(seenA, U1);
  assert.deepEqual(store.rushUnitCalls.at(-1), ['en', ['v1-a', 'v1-b']]);
  assert.deepEqual(lastApis(), { 'v1-a': 0, 'v1-b': 0 });
});

test('dos v1 con cliente nuevo: el nivel viaja, la ruta sigue siendo la v1 (sólo U1)', async () => {
  const { seenA, seenB } = await rankedMatch(['v1-a', NEW], ['v1-b', NEW]);
  assert.deepEqual(seenA, seenB);
  assertOnly(seenA, U1);
  assert.deepEqual(lastApis(), { 'v1-a': 1, 'v1-b': 1 });
});

test('dos v2 con cliente compatible: lo común a ambos, U13/U14 incluidas, mismas preguntas', async () => {
  const { seenA, seenB } = await rankedMatch(['v2-a', NEW], ['v2-b', NEW]);
  assert.deepEqual(seenA, seenB);
  assertOnly(seenA, ALL);
  assert.ok(
    texts(seenA).some((t) => textsOf([...U13, ...U14]).includes(t)),
    'con 12 preguntas sobre 12 palabras aparece vocabulario de U13/U14',
  );
  assert.deepEqual(lastApis(), { 'v2-a': 1, 'v2-b': 1 });
});

test('v2 con cliente compatible + v2 con cliente antiguo: sin U13/U14 (lo que el antiguo puede mostrar)', async () => {
  const { seenA, seenB } = await rankedMatch(['v2-a', NEW], ['v2-b', OLD]);
  assert.deepEqual(seenA, seenB);
  assertOnly(seenA, [...U1, ...U2]);
  assert.deepEqual(lastApis(), { 'v2-a': 1, 'v2-b': 0 });
});

test('rutas distintas (v2 + v1, ambos con cliente nuevo): sólo lo común (U1)', async () => {
  const { seenA, seenB } = await rankedMatch(['v2-a', NEW], ['v1-b', NEW]);
  assert.deepEqual(seenA, seenB);
  assertOnly(seenA, U1);
});

test('progreso distinto: v1 adelantado + v1 nuevo = U1; v2 + v2 con menos progreso = U1 + U13', async () => {
  const v1 = await rankedMatch(['v1-ahead', NEW], ['v1-a', OLD]);
  assert.deepEqual(v1.seenA, v1.seenB);
  assertOnly(v1.seenA, U1);

  const v2 = await rankedMatch(['v2-a', NEW], ['v2-new', NEW]);
  assert.deepEqual(v2.seenA, v2.seenB);
  assertOnly(v2.seenA, [...U1, ...U13]); // U2 y U14 no las desbloqueó v2-new
});

test('un nivel inválido o falsificado no da más: cuenta v1 con «999» sigue en U1; basura = 0', async () => {
  const forged = await rankedMatch(['v1-a', '999'], ['v1-b', 'abc']);
  assert.deepEqual(forged.seenA, forged.seenB);
  assertOnly(forged.seenA, U1);
  assert.deepEqual(lastApis(), { 'v1-a': 999, 'v1-b': 0 });
});

test('los resultados no cambian de forma: battle:finish igual para clientes antiguos y nuevos', async () => {
  const oldMatch = await rankedMatch(['v1-a', OLD], ['v1-b', OLD]);
  const newMatch = await rankedMatch(['v1-a', NEW], ['v1-b', NEW]);
  const shape = (o: object) => Object.keys(o).sort();
  assert.deepEqual(shape(oldMatch.endA), shape(newMatch.endA));
  assert.deepEqual(shape(oldMatch.endA.players[0]!), shape(newMatch.endA.players[0]!));
  assert.equal(oldMatch.endA.mode, 'ranked');
  assert.equal(newMatch.endA.mode, 'ranked');
});

test('práctica: sólo las unidades de ese jugador con su cliente; el caché de palabras no cruza jugadores', async () => {
  const solo = client('solo', NEW);
  await connected(solo);
  const start = next(solo, 'battle:start');
  const first = next(solo, 'battle:question');
  await solo.emitWithAck('queue:join', { mode: 'practice' });
  const snapshot = await start;
  const seen = await playAll(solo, snapshot.battleId, first);
  assertOnly(seen, U1);
  assert.deepEqual(store.rushUnitCalls.at(-1), ['en', ['solo']]);
  assert.deepEqual(lastApis(), { solo: 1 });
  solo.disconnect();
});

test('contra un bot del servidor: sólo cuenta el humano, con el nivel de su cliente', async () => {
  const c = client('v2-a', NEW);
  await connected(c);
  const found = next(c, 'match:found');
  await c.emitWithAck('queue:join', { mode: 'bot_practice' });
  assert.equal((await found).mode, 'bot_practice');
  assert.deepEqual(store.rushApiCalls.at(-1), ['en', [['v2-a', 1]]]);
  c.disconnect();
});

test('el nivel es el de la conexión que entra a la cola (una reconexión con build vieja vuelve a 0)', async () => {
  const fresh = client('v2-a', NEW);
  await connected(fresh);
  fresh.disconnect();
  const { seenA } = await rankedMatch(['v2-a', OLD], ['v2-b', NEW]);
  assertOnly(seenA, [...U1, ...U2]);
  assert.deepEqual(lastApis(), { 'v2-a': 0, 'v2-b': 1 });
});

test('sin conjunto de unidades no hay partida (nunca «todas las palabras»)', async () => {
  const failing = new FakeStore().add(player('x1'), player('x2'));
  failing.rushUnits = async () => {
    throw new Error('rush_common_unit_ids: sin unidades');
  };
  const s = createBattleServer({
    store: failing,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: RULES,
    tickMs: 20,
    random: seededRandom(3),
    botAfterMs: null,
  });
  await new Promise<void>((resolve) => s.http.listen(0, resolve));
  const u = `http://127.0.0.1:${(s.http.address() as AddressInfo).port}`;
  const mk = (id: string) =>
    connect(u, {
      transports: ['websocket'],
      auth: { token: `tok-${id}`, protocolVersion: PROTOCOL_VERSION, curriculumApi: NEW },
      reconnection: false,
      forceNew: true,
    }) as Client;
  const a = mk('x1');
  const b = mk('x2');
  await Promise.all([connected(a), connected(b)]);
  let found = false;
  a.on('match:found', () => (found = true));
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  await new Promise((r) => setTimeout(r, 300));
  assert.equal(found, false);
  assert.equal(failing.started.size, 0);
  a.disconnect();
  b.disconnect();
  await s.close();
});

// =================================================================================================
// Ranked Arcade (protocolo 3): mismo filtro de unidades, también para las frases
// =================================================================================================

/** Todos los textos que puede mostrar un desafío arcade. */
function challengeTexts(c: ChallengeView): string[] {
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

const sentenceTexts = (list: ArcadeSentence[]) => list.flatMap((x) => [...x.tokens, x.translation]);

function assertArcadeOnly(seen: ChallengeView[], words: RushWord[], sentences: ArcadeSentence[]) {
  const ok = new Set([...textsOf(words), ...sentenceTexts(sentences)]);
  for (const t of seen.flatMap(challengeTexts)) {
    assert.ok(ok.has(t), `«${t}» fuera del contenido común`);
  }
}

/** Una respuesta con forma válida (sin saber la correcta) para hacer avanzar la ventana. */
function anyAnswer(c: ChallengeView) {
  switch (c.kind) {
    case 'swipe':
      return { kind: 'swipe' as const, accept: true };
    case 'audio':
      return { kind: 'audio' as const, option: 0 };
    case 'connect':
      return { kind: 'connect' as const, left: 0, right: 0 };
    case 'sentence':
      return { kind: 'sentence' as const, order: c.tokens.map((_, k) => k) };
  }
}

/** Partida arcade entre a y b: los desafíos que recibió cada uno (el tiempo la cierra). */
async function arcadeMatch([a, apiA]: [string, unknown], [b, apiB]: [string, unknown]) {
  const ca = client(a, apiA, ARCADE_PROTOCOL_VERSION);
  const cb = client(b, apiB, ARCADE_PROTOCOL_VERSION);
  await Promise.all([connected(ca), connected(cb)]);
  const fa = next(ca, 'match:found');
  const fb = next(cb, 'match:found');
  assert.equal((await ca.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  assert.equal((await cb.emitWithAck('queue:join', { mode: 'ranked' })).ok, true);
  const found: BattleSnapshot = await fa;
  await fb;
  assert.ok(found.arcade, 'la partida es arcade');
  const seenA: ChallengeView[] = [];
  const seenB: ChallengeView[] = [];
  ca.on('arcade:challenge', (c) => seenA.push(c));
  cb.on('arcade:challenge', (c) => seenB.push(c));
  const endA = next(ca, 'battle:finish', 6_000);
  const endB = next(cb, 'battle:finish', 6_000);
  await ca.emitWithAck('match:ready', { battleId: found.battleId });
  await cb.emitWithAck('match:ready', { battleId: found.battleId });
  await new Promise((r) => setTimeout(r, 150));
  // Responde varios desafíos para que entren más en la ventana.
  let current = 0;
  for (let i = 0; i < 12; i++) {
    const c = seenA.find((x) => x.index === current);
    if (!c) break;
    const res = await ca.emitWithAck('arcade:answer', {
      battleId: found.battleId,
      challengeIndex: c.index,
      answer: anyAnswer(c),
    });
    if (!res.ok) break;
    if (res.data.done) current += 1;
  }
  await Promise.all([endA, endB]);
  ca.disconnect();
  cb.disconnect();
  return { seenA, seenB };
}

const byIndex = (list: ChallengeView[]) =>
  new Map(
    list.map((c) => [c.index, JSON.stringify(c.kind === 'connect' ? { ...c, solved: [] } : c)]),
  );

test('arcade · dos v1 (cliente viejo): sólo U1, también en las frases; mismos desafíos', async () => {
  const { seenA, seenB } = await arcadeMatch(['v1-a', OLD], ['v1-b', OLD]);
  assert.ok(seenA.length >= 3, `vio ${seenA.length} desafíos`);
  const a = byIndex(seenA);
  for (const [i, v] of byIndex(seenB)) if (a.has(i)) assert.equal(a.get(i), v, `desafío ${i}`);
  assertArcadeOnly([...seenA, ...seenB], U1, S1);
  assert.deepEqual(lastApis(), { 'v1-a': 0, 'v1-b': 0 });
});

test('arcade · dos v2 compatibles: lo común incluye U13 (palabras y frases)', async () => {
  const { seenA } = await arcadeMatch(['v2-a', NEW], ['v2-b', NEW]);
  assertArcadeOnly(seenA, ALL, [...S1, ...S13]);
  assert.deepEqual(lastApis(), { 'v2-a': 1, 'v2-b': 1 });
});

test('arcade · v2 compatible + v2 viejo: nada de U13/U14 (ni frases de U13)', async () => {
  const { seenA, seenB } = await arcadeMatch(['v2-a', NEW], ['v2-b', OLD]);
  assertArcadeOnly([...seenA, ...seenB], [...U1, ...U2], S1);
  assert.deepEqual(lastApis(), { 'v2-a': 1, 'v2-b': 0 });
});

test('arcade · un nivel falsificado no da más contenido', async () => {
  const { seenA } = await arcadeMatch(['v1-a', '999'], ['v1-b', 'abc']);
  assertArcadeOnly(seenA, U1, S1);
  assert.deepEqual(lastApis(), { 'v1-a': 999, 'v1-b': 0 });
});

test('arcade · práctica contra bot: sólo cuenta el humano, con el nivel de su cliente', async () => {
  const c = client('v2-a', NEW, ARCADE_PROTOCOL_VERSION);
  await connected(c);
  const found = next(c, 'match:found');
  await c.emitWithAck('queue:join', { mode: 'bot_practice' });
  const snap = await found;
  assert.equal(snap.mode, 'bot_practice');
  assert.ok(snap.arcade, 'partida arcade');
  assert.deepEqual(store.rushApiCalls.at(-1), ['en', [['v2-a', 1]]]);
  await new Promise((r) => setTimeout(r, 1_600));
  c.disconnect();
});

test('arcade · sin conjunto de unidades no hay partida', async () => {
  const failing = new FakeStore().add(player('y1'), player('y2'));
  failing.rushUnits = async () => {
    throw new Error('rush_common_unit_ids: sin unidades');
  };
  const s = createBattleServer({
    store: failing,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: RULES,
    arcadeRules: ARCADE_RULES,
    tickMs: 20,
    random: seededRandom(3),
    botAfterMs: null,
  });
  await new Promise<void>((resolve) => s.http.listen(0, resolve));
  const u = `http://127.0.0.1:${(s.http.address() as AddressInfo).port}`;
  const mk = (id: string) =>
    connect(u, {
      transports: ['websocket'],
      auth: { token: `tok-${id}`, protocolVersion: ARCADE_PROTOCOL_VERSION, curriculumApi: NEW },
      reconnection: false,
      forceNew: true,
    }) as Client;
  const a = mk('y1');
  const b = mk('y2');
  await Promise.all([connected(a), connected(b)]);
  let found = false;
  a.on('match:found', () => (found = true));
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  await new Promise((r) => setTimeout(r, 300));
  assert.equal(found, false);
  assert.equal(failing.started.size, 0);
  a.disconnect();
  b.disconnect();
  await s.close();
});

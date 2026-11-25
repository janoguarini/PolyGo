// Fase 5: banco propio de Word Rush unido a las frases de las lecciones (loadSentences).
// Cubre la lectura de las dos fuentes con un Supabase falso, la unión sin duplicados, los filtros
// (idioma, nivel, unidades publicadas y desbloqueadas), las variantes, la secuencia compartida, la
// falta de repeticiones, las fallas de una fuente y que el protocolo 2 (y los desafíos con amigos,
// que no pasan por este servidor) no lean el banco.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

import { connect, type Socket } from 'socket.io-client';

import {
  ARCADE,
  createChallengeStream,
  gradeArcade,
  sentencePool,
  type ArcadeChallenge,
  type ArcadeSentence,
  type ChallengeView,
} from '../../shared/arcade';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH,
  WORD_RUSH_PROTOCOL_VERSION,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { rushLevels } from '../../shared/wordRush';
import { createBattleServer, type BattleServer } from '../src/server';
import { createSupabaseStore } from '../src/supabaseStore';
import { silentLogger, type Logger } from '../src/types';
import {
  isValidVariant,
  mergeSentenceSources,
  type WordRushSentenceRow,
} from '../src/wordRushBank';
import { ARCADE_WORDS, FakeStore, player, seededRandom } from './helpers';

// ---------------------------------------------------------------------------------------------
// Supabase falso: from(t).select().eq().in() resuelve { data, error } sobre filas en memoria.

type Row = Record<string, unknown>;
type Failure = { message: string; code?: string };

function fakeDb(tables: Record<string, Row[]>, failures: Record<string, Failure> = {}) {
  const reads: string[] = [];
  const db = {
    from(table: string) {
      const filters: ((r: Row) => boolean)[] = [];
      const query = {
        select: () => query,
        eq: (column: string, value: unknown) => {
          filters.push((r) => r[column] === value);
          return query;
        },
        in: (column: string, values: unknown[]) => {
          filters.push((r) => values.includes(r[column]));
          return query;
        },
        then(resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) {
          reads.push(table);
          const failure = failures[table];
          const result = failure
            ? { data: null, error: failure }
            : tables[table] === undefined
              ? {
                  data: null,
                  error: { message: `relation "public.${table}" does not exist`, code: 'PGRST205' },
                }
              : { data: tables[table]!.filter((r) => filters.every((f) => f(r))), error: null };
          return Promise.resolve(result).then(resolve, reject);
        },
      };
      return query;
    },
  };
  return { db: db as never, reads };
}

function recordingLogger() {
  const warnings: { message: string; data?: Record<string, unknown> }[] = [];
  const logger: Logger = {
    info: () => {},
    error: () => {},
    warn: (message, data) => warnings.push({ message, data }),
  };
  return { logger, warnings };
}

const order = (id: string, lesson: string, sentence: string, translation: string) => ({
  id,
  lesson_id: lesson,
  type: 'order_words',
  is_published: true,
  payload: { type: 'order_words', tokens: sentence.replace(/[.!?]$/, '').split(' '), translation },
  answer: sentence,
  accepted_answers: [] as string[],
});

const bankRow = (
  id: string,
  unit: string,
  sentence: string,
  translation: string,
  extra: Partial<Row> = {},
): Row & WordRushSentenceRow => ({
  id,
  language_code: 'en',
  unit_id: unit,
  tokens: sentence.replace(/[.!?]$/, '').split(' '),
  answer: sentence,
  accepted_answers: [],
  translation,
  is_published: true,
  ...extra,
});

/** Base del curso «en»: U1 y U2 de A1 y U1 de A2 publicadas; U3 de A1 sin publicar. */
function baseTables(): Record<string, Row[]> {
  return {
    curriculum_units: [
      { id: 'a1-u01', language_code: 'en', is_published: true },
      { id: 'a1-u02', language_code: 'en', is_published: true },
      { id: 'a1-u03', language_code: 'en', is_published: false },
      { id: 'a2-u01', language_code: 'en', is_published: true },
      { id: 'it-a1-u01', language_code: 'it', is_published: true },
    ],
    lessons: [
      { id: 'a1-u01-l01', unit_id: 'a1-u01', is_published: true },
      { id: 'a1-u02-l01', unit_id: 'a1-u02', is_published: true },
    ],
    exercises: [
      order('a1-u01-l01-e01', 'a1-u01-l01', 'I went home yesterday.', 'Fui a casa ayer.'),
      order('a1-u01-l01-e02', 'a1-u01-l01', 'They eat chicken and rice.', 'Comen pollo y arroz.'),
      order('a1-u02-l01-e01', 'a1-u02-l01', 'She is a student.', 'Ella es estudiante.'),
    ],
    word_rush_sentences: [
      bankRow('en.wr.u01-we-are-friends', 'a1-u01', 'We are friends.', 'Somos amigos.'),
      bankRow('en.wr.u02-he-is-tall', 'a1-u02', 'He is very tall.', 'Él es muy alto.'),
      bankRow('en.wr.a2-we-went-out', 'a2-u01', 'We went out last night.', 'Salimos anoche.'),
      // Unidad sin publicar: no entra.
      bankRow('en.wr.u03-locked', 'a1-u03', 'The cat is black.', 'El gato es negro.'),
      // Sin publicar: no entra.
      bankRow('en.wr.u01-draft', 'a1-u01', 'You are my friend.', 'Sos mi amigo.', {
        is_published: false,
      }),
      // Otro curso: no entra.
      bankRow('it.wr.u01-ciao', 'it-a1-u01', 'Ciao a tutti.', 'Hola a todos.', {
        language_code: 'it',
      }),
      // La misma frase que una lección: gana la lección.
      bankRow('en.wr.u02-dup', 'a1-u02', 'She is a student.', 'Ella es alumna.'),
      // Con variante válida y una inválida (otras palabras).
      bankRow('en.wr.u01-today-i-work', 'a1-u01', 'Today I work at home.', 'Hoy trabajo en casa.', {
        accepted_answers: ['I work at home today.', 'I work at school today.'],
      }),
      // Fichas que no forman la respuesta: contenido roto, no entra.
      bankRow('en.wr.u01-broken', 'a1-u01', 'I like tea.', 'Me gusta el té.', {
        tokens: ['I', 'like', 'coffee'],
      }),
    ],
    word_rush_exercise_variants: [
      {
        exercise_id: 'a1-u01-l01-e02',
        accepted_answers: ['They eat rice and chicken.', 'They eat rice and fish.'],
      },
      { exercise_id: 'a1-u01-l01-e01', accepted_answers: ['Yesterday I went home.'] },
      // Ejercicio de otro curso o sin publicar: se ignora.
      { exercise_id: 'it-a1-u01-l01-e01', accepted_answers: ['Ciao tutti a.'] },
    ],
  };
}

async function load(tables = baseTables(), failures: Record<string, Failure> = {}) {
  const { db, reads } = fakeDb(tables, failures);
  const { logger, warnings } = recordingLogger();
  const store = createSupabaseStore(db, logger);
  const sentences = await store.loadSentences('en');
  return { sentences, reads, warnings, store };
}

const byId = (list: readonly ArcadeSentence[], id: string) => list.find((s) => s.id === id);

// ---------------------------------------------------------------------------------------------
// 1–2. Lectura de las dos fuentes y unión sin duplicados

test('banco: loadSentences lee las lecciones publicadas y el banco, con su unidad', async () => {
  const { sentences, reads } = await load();
  assert.deepEqual(
    sentences.map((s) => s.id),
    [
      'a1-u01-l01-e01',
      'a1-u01-l01-e02',
      'a1-u02-l01-e01',
      'en.wr.u01-we-are-friends',
      'en.wr.u02-he-is-tall',
      'en.wr.a2-we-went-out',
      'en.wr.u01-today-i-work',
    ],
  );
  assert.equal(byId(sentences, 'en.wr.u02-he-is-tall')!.unitId, 'a1-u02');
  assert.deepEqual(byId(sentences, 'en.wr.u01-we-are-friends')!.tokens, ['We', 'are', 'friends']);
  assert.ok(reads.includes('word_rush_sentences') && reads.includes('word_rush_exercise_variants'));
});

test('banco: sin duplicados — ni el mismo id ni la misma frase; gana la lección', async () => {
  const tables = baseTables();
  tables.word_rush_sentences!.push(
    bankRow('en.wr.u01-we-are-friends', 'a1-u01', 'We are good friends.', 'Somos buenos amigos.'),
  );
  // Misma frase con otra puntuación/mayúsculas: canonicalForm la iguala.
  tables.word_rush_sentences!.push(
    bankRow('en.wr.u01-went-home', 'a1-u01', 'i went home yesterday!', 'Volví a casa ayer.'),
  );
  const { sentences, warnings } = await load(tables);
  const ids = sentences.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(byId(sentences, 'a1-u02-l01-e01')!.translation, 'Ella es estudiante.');
  assert.ok(!ids.includes('en.wr.u02-dup') && !ids.includes('en.wr.u01-went-home'));
  const skipped = warnings.find((w) => w.message === 'word_rush_bank_rows_skipped');
  assert.equal(skipped?.data?.duplicatesSkipped, 3);
});

// ---------------------------------------------------------------------------------------------
// 3–4. Idioma, nivel y unidades

test('banco: sólo el idioma pedido, publicadas y de unidades publicadas', async () => {
  const { sentences } = await load();
  const ids = sentences.map((s) => s.id);
  for (const out of ['it.wr.u01-ciao', 'en.wr.u01-draft', 'en.wr.u03-locked', 'en.wr.u01-broken'])
    assert.ok(!ids.includes(out), out);
  // Aunque una fila de otro idioma llegara (defensa), mergeSentenceSources la descarta.
  const merged = mergeSentenceSources(
    'en',
    [],
    {
      sentences: [
        bankRow('it.wr.u01-x', 'a1-u01', 'We are friends.', 'Somos amigos.', {
          language_code: 'it',
        }),
      ],
      variants: [],
    },
    new Set(['a1-u01']),
  );
  assert.equal(merged.sentences.length, 0);
  assert.equal(merged.report.bankSkipped, 1);
});

/** Lo mismo que hace createBattle (server.ts) con las frases: unidades comunes → sentencePool. */
const forMatch = (all: readonly ArcadeSentence[], units: readonly string[], rating: number) =>
  sentencePool(
    all.filter((s) => s.unitId != null && units.includes(s.unitId)),
    'en',
    rating,
  );

const A1_ONLY = [0, 500, 1000, 2000, 5000, 100_000].find((r) => !rushLevels(r).includes('A2'))!;
const WITH_A2 = [0, 500, 1000, 2000, 5000, 100_000].find((r) => rushLevels(r).includes('A2'))!;

test('banco: el nivel del jugador decide si entran las frases de A2', async () => {
  const { sentences } = await load();
  const units = ['a1-u01', 'a1-u02', 'a2-u01'];
  assert.ok(!forMatch(sentences, units, A1_ONLY).some((s) => s.id === 'en.wr.a2-we-went-out'));
  assert.ok(forMatch(sentences, units, WITH_A2).some((s) => s.id === 'en.wr.a2-we-went-out'));
});

test('banco: las unidades desbloqueadas filtran las frases del banco igual que las de lecciones', async () => {
  const { sentences } = await load();
  const onlyU1 = forMatch(sentences, ['a1-u01'], A1_ONLY).map((s) => s.id);
  assert.ok(onlyU1.includes('en.wr.u01-we-are-friends'));
  assert.ok(!onlyU1.includes('en.wr.u02-he-is-tall'), 'U2 bloqueada');
  assert.ok(!onlyU1.includes('a1-u02-l01-e01'), 'lección de U2 bloqueada');
  assert.ok(
    forMatch(sentences, ['a1-u01', 'a1-u02'], A1_ONLY).some((s) => s.id === 'en.wr.u02-he-is-tall'),
  );
});

// ---------------------------------------------------------------------------------------------
// 5. Variantes

test('banco: variantes válidas se suman (sólo en Word Rush); las inválidas se descartan', async () => {
  const { sentences, warnings } = await load();
  assert.deepEqual(byId(sentences, 'a1-u01-l01-e02')!.acceptedAnswers, [
    'They eat rice and chicken.',
  ]);
  assert.deepEqual(byId(sentences, 'a1-u01-l01-e01')!.acceptedAnswers, ['Yesterday I went home.']);
  assert.deepEqual(byId(sentences, 'en.wr.u01-today-i-work')!.acceptedAnswers, [
    'I work at home today.',
  ]);
  // La frase de la lección sin variante sigue igual.
  assert.deepEqual(byId(sentences, 'a1-u02-l01-e01')!.acceptedAnswers, []);
  const skipped = warnings.find((w) => w.message === 'word_rush_bank_rows_skipped');
  // «rice and fish» y «at school»: otras palabras.
  assert.equal(skipped?.data?.variantsSkipped, 2);
});

test('banco: isValidVariant exige las mismas fichas en otro orden', () => {
  const tokens = ['They', 'eat', 'chicken', 'and', 'rice'];
  assert.ok(isValidVariant(tokens, 'They eat rice and chicken.'));
  assert.ok(isValidVariant(tokens, 'they eat rice and chicken'));
  assert.ok(!isValidVariant(tokens, 'They eat rice and fish.'));
  assert.ok(!isValidVariant(tokens, 'They eat rice.'));
  assert.ok(!isValidVariant(tokens, 'They eat rice and chicken and rice.'));
  assert.ok(!isValidVariant(tokens, ''));
  assert.ok(isValidVariant(['我', '早上', '吃', '早饭'], '早上我吃早饭。'));
});

test('banco: el corrector acepta la variante y rechaza un orden incorrecto', async () => {
  const { sentences } = await load();
  const s = byId(sentences, 'a1-u01-l01-e02')!;
  const challenge: ArcadeChallenge = {
    index: 0,
    kind: 'sentence',
    sentenceId: s.id,
    tokens: [...s.tokens],
    translation: s.translation,
    answers: [s.answer, ...s.acceptedAnswers],
  };
  const orderOf = (text: string) =>
    text
      .replace(/[.!?]$/, '')
      .split(' ')
      .map((w) => s.tokens.indexOf(w));
  const grade = (order: number[]) => gradeArcade(challenge, { kind: 'sentence', order });
  assert.deepEqual(grade(orderOf('They eat chicken and rice.')), {
    valid: true,
    correct: true,
    done: true,
    solution: s.answer,
  });
  assert.equal(
    (grade(orderOf('They eat rice and chicken.')) as { correct: boolean }).correct,
    true,
  );
  assert.equal(
    (grade(orderOf('rice eat They and chicken')) as { correct: boolean }).correct,
    false,
  );
});

// ---------------------------------------------------------------------------------------------
// 6–7. Misma secuencia para los dos y sin repetir dentro de la partida

/** Banco grande (60 frases) para que una partida entera no tenga que repetir. */
function bigTables(): Record<string, Row[]> {
  const tables = baseTables();
  const subjects = ['I', 'You', 'We', 'They'];
  const verbs = ['like', 'want', 'see', 'have', 'need'];
  const objects = ['tea', 'water', 'bread', 'apples'];
  for (const s of subjects)
    for (const v of verbs)
      for (const o of objects)
        tables.word_rush_sentences!.push(
          bankRow(
            `en.wr.u01-${s}-${v}-${o}`.toLowerCase(),
            'a1-u01',
            `${s} ${v} some ${o}.`,
            `${s}/${v}/${o}`,
          ),
        );
  return tables;
}

test('banco: dos flujos con la misma semilla dan el mismo contenido y orden', async () => {
  const { sentences } = await load(bigTables());
  const pool = forMatch(sentences, ['a1-u01', 'a1-u02'], A1_ONLY);
  const a = createChallengeStream(ARCADE_WORDS, pool, seededRandom(42));
  const b = createChallengeStream(ARCADE_WORDS, pool, seededRandom(42));
  for (let i = 0; i < 80; i++) assert.deepEqual(a.at(i), b.at(i));
});

test('banco: una partida no repite frases (con banco suficiente)', async () => {
  const { sentences } = await load(bigTables());
  const pool = forMatch(sentences, ['a1-u01', 'a1-u02'], A1_ONLY);
  assert.ok(pool.length >= 60);
  const stream = createChallengeStream(ARCADE_WORDS, pool, seededRandom(7));
  const seen: string[] = [];
  for (let i = 0; i < 60; i++) {
    const c = stream.at(i);
    if (c.kind === 'sentence') seen.push(c.sentenceId);
  }
  assert.ok(seen.length > 0, 'hubo desafíos de frases');
  assert.equal(new Set(seen).size, seen.length);
});

// ---------------------------------------------------------------------------------------------
// 8. Una fuente que falla

test('banco: si falla la tabla de frases, sigue sólo con las lecciones (y avisa)', async () => {
  const { sentences, warnings } = await load(baseTables(), {
    word_rush_sentences: { message: 'timeout', code: '57014' },
  });
  assert.deepEqual(
    sentences.map((s) => s.id),
    ['a1-u01-l01-e01', 'a1-u01-l01-e02', 'a1-u02-l01-e01'],
  );
  // Nada del banco a medias: tampoco las variantes, aunque esa tabla sí se pudo leer.
  assert.deepEqual(byId(sentences, 'a1-u01-l01-e02')!.acceptedAnswers, []);
  assert.equal(warnings[0]!.message, 'word_rush_bank_unavailable');
  assert.equal(warnings[0]!.data!.code, '57014');
});

test('banco: si falla la tabla de variantes, tampoco usa las frases nuevas', async () => {
  const { sentences, warnings } = await load(baseTables(), {
    word_rush_exercise_variants: { message: 'permission denied', code: '42501' },
  });
  assert.equal(sentences.length, 3);
  assert.ok(sentences.every((s) => !s.id.includes('.wr.')));
  assert.equal(warnings[0]!.message, 'word_rush_bank_unavailable');
});

test('banco: sin las tablas (migración sin aplicar) el servidor funciona como antes', async () => {
  const tables = baseTables();
  delete tables.word_rush_sentences;
  delete tables.word_rush_exercise_variants;
  const { sentences, warnings } = await load(tables);
  assert.equal(sentences.length, 3);
  assert.deepEqual(byId(sentences, 'a1-u01-l01-e02')!.acceptedAnswers, []);
  assert.equal(warnings[0]!.data!.code, 'PGRST205');
});

test('banco: si fallan las lecciones, lanza como antes (la partida no se crea)', async () => {
  const { db } = fakeDb(baseTables(), { exercises: { message: 'boom' } });
  const store = createSupabaseStore(db, silentLogger);
  await assert.rejects(store.loadSentences('en'), { message: 'boom' });
});

// ---------------------------------------------------------------------------------------------
// 9–10. Protocolos: v3 usa el banco con la misma secuencia para los dos; v2 no lo lee

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

/** FakeStore que cuenta las lecturas de frases. */
class CountingStore extends FakeStore {
  sentenceLoads = 0;
  override async loadSentences() {
    this.sentenceLoads += 1;
    return this.sentences;
  }
}

let server: BattleServer;
let url: string;
let store: CountingStore;
const clients: Client[] = [];

before(async () => {
  store = new CountingStore().add(
    player('ana'),
    player('beto', 1020),
    player('ceci'),
    player('dani'),
  );
  store.words = ARCADE_WORDS;
  // Lo que devolvería loadSentences con el banco cargado (lecciones + banco + variantes).
  const loaded = (await load(bigTables())).sentences;
  // Una frase del banco de una unidad publicada que nadie desbloqueó (U4): no puede aparecer.
  store.sentences = [
    ...loaded,
    {
      ...loaded.find((s) => s.id === 'en.wr.u02-he-is-tall')!,
      id: 'en.wr.u04-locked',
      unitId: 'a1-u04',
      translation: 'Bloqueada.',
    },
  ];
  for (const u of ['ana', 'beto', 'ceci', 'dani']) store.unitsByUser.set(u, ['a1-u01', 'a1-u02']);
  server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: {
      ...WORD_RUSH,
      countdownMs: 50,
      durationMs: 800,
      readyTimeoutMs: 2_000,
      reconnectGraceMs: 300,
    },
    arcadeRules: {
      ...ARCADE,
      countdownMs: 50,
      durationMs: 800,
      frenzyMs: 400,
      readyTimeoutMs: 2_000,
      reconnectGraceMs: 300,
    },
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

const connected = (socket: Client) =>
  new Promise<void>((resolve, reject) => {
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });

function next<E extends keyof ServerToClientEvents>(socket: Client, event: E, timeoutMs = 3_000) {
  return new Promise<Parameters<ServerToClientEvents[E]>[0]>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout esperando ${event}`)), timeoutMs);
    // @ts-expect-error: el listener genérico recibe el payload del evento E.
    socket.once(event, (payload) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}

test('servidor: partida v3 con el banco — misma secuencia para los dos y sin unidades bloqueadas', async () => {
  const a = client('ana', ARCADE_PROTOCOL_VERSION);
  const b = client('beto', ARCADE_PROTOCOL_VERSION);
  await Promise.all([connected(a), connected(b)]);
  const foundA = next(a, 'match:found');
  const foundB = next(b, 'match:found');
  await a.emitWithAck('queue:join', { mode: 'ranked' });
  await b.emitWithAck('queue:join', { mode: 'ranked' });
  const found = await foundA;
  await foundB;
  const seenA: ChallengeView[] = [];
  const seenB: ChallengeView[] = [];
  a.on('arcade:challenge', (c) => seenA.push(c));
  b.on('arcade:challenge', (c) => seenB.push(c));
  const finished = next(a, 'battle:finish', 5_000);
  await a.emitWithAck('match:ready', { battleId: found.battleId });
  await b.emitWithAck('match:ready', { battleId: found.battleId });

  // Los dos responden lo mismo (siempre la primera opción) para avanzar por la secuencia.
  for (let i = 0; i < 12; i++) {
    for (const [socket, seen] of [
      [a, seenA],
      [b, seenB],
    ] as const) {
      const view = seen.find((c) => c.index === i);
      if (!view) continue;
      const answer =
        view.kind === 'swipe'
          ? { kind: 'swipe' as const, accept: true }
          : view.kind === 'audio'
            ? { kind: 'audio' as const, option: 0 }
            : view.kind === 'connect'
              ? { kind: 'connect' as const, left: 0, right: 0 }
              : { kind: 'sentence' as const, order: view.tokens.map((_, k) => k) };
      await socket.emitWithAck('arcade:answer', {
        battleId: found.battleId,
        challengeIndex: i,
        answer,
      });
    }
    await new Promise((r) => setTimeout(r, 15));
  }
  await finished;
  const common = Math.min(seenA.length, seenB.length);
  assert.ok(common >= 2);
  const key = (c: ChallengeView) => c.index;
  const sortedA = [...seenA].sort((x, y) => key(x) - key(y)).slice(0, common);
  const sortedB = [...seenB].sort((x, y) => key(x) - key(y)).slice(0, common);
  assert.deepEqual(sortedA, sortedB, 'mismo contenido y orden');
  // Ninguna frase de una unidad bloqueada (U4).
  const translations = [...seenA, ...seenB]
    .filter((c): c is Extract<ChallengeView, { kind: 'sentence' }> => c.kind === 'sentence')
    .map((c) => c.translation);
  assert.ok(!translations.includes('Bloqueada.'));
  assert.ok(seenA.length >= 2, 'la partida avanzó');
  // La vista nunca trae el id ni las respuestas aceptadas.
  for (const c of seenA) {
    if (c.kind === 'sentence')
      assert.deepEqual(Object.keys(c).sort(), ['index', 'kind', 'tokens', 'translation']);
  }
});

test('servidor: una partida v2 (Word Rush clásico) no lee el banco de frases', async () => {
  const before = store.sentenceLoads;
  const c = client('ceci', WORD_RUSH_PROTOCOL_VERSION);
  const d = client('dani', WORD_RUSH_PROTOCOL_VERSION);
  await Promise.all([connected(c), connected(d)]);
  const found = next(c, 'match:found');
  await c.emitWithAck('queue:join', { mode: 'ranked' });
  await d.emitWithAck('queue:join', { mode: 'ranked' });
  const snapshot = await found;
  assert.equal(snapshot.arcade, undefined, 'v2 sin parte arcade');
  assert.equal(snapshot.mode, 'ranked');
  assert.equal(store.sentenceLoads, before, 'v2 nunca llama a loadSentences');
  c.disconnect();
  d.disconnect();
});

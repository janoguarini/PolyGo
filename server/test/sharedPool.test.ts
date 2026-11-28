// Ranked compartido entre cursos del mismo idioma (docs/RANKED_SHARED_POOL.md): un hispanohablante
// (en-from-es) y un brasileño (en-from-pt) que estudian inglés juegan la MISMA partida (mismo inglés,
// mismo orden, misma respuesta correcta); cada uno ve los textos de apoyo de su curso. Una partida de
// un solo curso queda exactamente como antes.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';

import { connect, type Socket } from 'socket.io-client';

import {
  ARCADE,
  createChallengeStream,
  gradeArcade,
  localizeChallenge,
  toChallengeView,
  type ArcadeAnswer,
  type ArcadeChallenge,
  type ArcadeSentence,
  type ChallengeView,
} from '../../shared/arcade';
import {
  ARCADE_PROTOCOL_VERSION,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from '../../shared/protocol';
import type { RushWord } from '../../shared/wordRush';
import { createBattleServer } from '../src/server';
import {
  canonicalCourse,
  seatCourse,
  unitKey,
  withSentenceSupport,
  withWordSupport,
} from '../src/sharedPool';
import { silentLogger, type CourseInfo, type Logger } from '../src/types';
import { ARCADE_SENTENCES, ARCADE_WORDS, FakeStore, player, seededRandom } from './helpers';

const COURSES: CourseInfo[] = [
  { code: 'en-from-es', targetLanguage: 'en', sourceLanguage: 'es', isDefault: true },
  { code: 'en-from-pt', targetLanguage: 'en', sourceLanguage: 'pt', isDefault: false },
  { code: 'es-from-en', targetLanguage: 'es', sourceLanguage: 'en', isDefault: true },
];

const PT: Record<string, string> = {
  hello: 'olá',
  goodbye: 'tchau',
  'thank you': 'obrigado',
  please: 'por favor',
  yes: 'sim',
  water: 'água',
  apple: 'maçã',
  house: 'casa',
  dog: 'cachorro',
  cat: 'gato',
};

/** en-from-pt: el mismo inglés, ids y unidades propios (ept-*), traducciones en portugués. */
const PT_WORDS: RushWord[] = ARCADE_WORDS.map((w) => ({
  ...w,
  id: `ept-${w.id}`,
  translationEs: PT[w.text]!,
  unitId: `ept-${w.unitId}`,
}));

const PT_SENTENCE: Record<string, string> = {
  'I went home yesterday.': 'Eu fui para casa ontem.',
  'She is a student.': 'Ela é estudante.',
  'We like green tea.': 'Nós gostamos de chá verde.',
  'My name is Sofía.': 'Meu nome é Sofía.',
  'The dog is very big.': 'O cachorro é muito grande.',
  'They live in Rome.': 'Eles moram em Roma.',
};

/** Las frases de las lecciones de en-from-pt: otros ids, la misma respuesta en inglés. */
const PT_SENTENCES: ArcadeSentence[] = ARCADE_SENTENCES.map((s, i) => ({
  ...s,
  id: `ept.ex.${i}`,
  translation: PT_SENTENCE[s.answer]!,
  unitId: `ept-${s.unitId}`,
}));

const ES_SUPPORT = new Set(ARCADE_WORDS.map((w) => w.translationEs));
const PT_SUPPORT = new Set(Object.values(PT));
const ES_SENTENCES = new Set(ARCADE_SENTENCES.map((s) => s.translation));
const PT_SENTENCES_TEXT = new Set(Object.values(PT_SENTENCE));

// ---------------------------------------------------------------------------------------------
// Cruce de contenido (puro)

test('compartido: unitKey quita el prefijo de idioma o de curso', () => {
  assert.equal(unitKey('a1-u03'), 'a1-u03');
  assert.equal(unitKey('ept-a1-u03'), 'a1-u03');
  assert.equal(unitKey('it-a2-u10'), 'a2-u10');
  assert.equal(unitKey('ept-b1-u12'), 'b1-u12');
  assert.equal(unitKey(null), null);
  assert.equal(unitKey('otra-cosa'), null);
});

test('compartido: las palabras se cruzan por el inglés y prefieren la misma posición curricular', () => {
  const canonical: RushWord[] = [
    { id: 'en-light-a', text: 'light', translationEs: 'luz', unitId: 'a1-u02' },
    { id: 'en-light-b', text: 'Light ', translationEs: 'liviano', unitId: 'a1-u05' },
    { id: 'en-only', text: 'only here', translationEs: 'sólo acá', unitId: 'a1-u01' },
  ];
  const pt: RushWord[] = [
    { id: 'ept-light-b', text: 'light', translationEs: 'leve', unitId: 'ept-a1-u05' },
    { id: 'ept-light-a', text: 'light', translationEs: 'luz', unitId: 'ept-a1-u02' },
  ];
  const { words, missing } = withWordSupport(canonical, 'en-from-pt', pt);
  assert.deepEqual(
    words.map((w) => w.support),
    [{ 'en-from-pt': 'luz' }, { 'en-from-pt': 'leve' }, undefined],
  );
  assert.deepEqual(missing, ['en-only']);
  // Lo canónico no cambia: mismo id, inglés, traducción y unidad.
  assert.deepEqual(
    words.map(({ support: _s, ...w }) => w),
    canonical,
  );
});

test('compartido: las frases se cruzan por id (banco) o por la respuesta en inglés (lecciones)', () => {
  const bank: ArcadeSentence = { ...ARCADE_SENTENCES[0]!, id: 'en.wr.u01-x' };
  const canonical = [bank, ARCADE_SENTENCES[1]!, ARCADE_SENTENCES[2]!];
  const pt = [
    { ...bank, translation: 'Consigna do banco' },
    { ...PT_SENTENCES[1]!, answer: 'she is a student.' }, // misma respuesta (canonicalForm)
  ];
  const { sentences, missing } = withSentenceSupport(canonical, 'en-from-pt', pt);
  assert.deepEqual(
    sentences.map((s) => s.support?.['en-from-pt']),
    ['Consigna do banco', 'Ela é estudante.', undefined],
  );
  assert.deepEqual(missing, [ARCADE_SENTENCES[2]!.id]);
});

test('compartido: curso canónico y curso de cada asiento', () => {
  assert.equal(canonicalCourse(COURSES, 'en')?.code, 'en-from-es');
  assert.equal(canonicalCourse(null, 'en'), null);
  const pt = { courseCode: 'en-from-pt' };
  assert.equal(seatCourse(COURSES, 'en', pt)?.code, 'en-from-pt');
  assert.equal(seatCourse(COURSES, 'en', { courseCode: 'en-from-es' }), null, 'canónico');
  assert.equal(seatCourse(COURSES, 'es', pt), null, 'curso de otro idioma');
  assert.equal(seatCourse(COURSES, 'en', { courseCode: 'en-from-xx' }), null, 'desconocido');
  assert.equal(seatCourse(COURSES, 'en', { ...pt, isBot: true }), null, 'bot');
  assert.equal(seatCourse(null, 'en', pt), null, 'sin catálogo');
});

// ---------------------------------------------------------------------------------------------
// Flujo de desafíos con dos cursos (shared/arcade.ts)

const supported = () => {
  const words = withWordSupport(ARCADE_WORDS, 'en-from-pt', PT_WORDS).words;
  const sentences = withSentenceSupport(ARCADE_SENTENCES, 'en-from-pt', PT_SENTENCES).sentences;
  return { words, sentences };
};

/** La parte de un desafío que no depende del idioma de apoyo (lo que se corrige y el inglés). */
function invariant(c: ArcadeChallenge) {
  switch (c.kind) {
    case 'swipe':
      return { i: c.index, k: c.kind, w: c.wordId, p: c.prompt, t: c.truthful };
    case 'audio':
      return {
        i: c.index,
        k: c.kind,
        w: c.wordId,
        p: c.prompt,
        c: c.correctOption,
        n: c.options.length,
      };
    case 'connect':
      return { i: c.index, k: c.kind, w: c.wordIds, l: c.left, s: c.solution };
    case 'sentence':
      return { i: c.index, k: c.kind, s: c.sentenceId, t: c.tokens, a: c.answers };
  }
}

/** Todas las respuestas posibles de un desafío (para comparar la corrección de los dos asientos). */
function answersOf(c: ArcadeChallenge): ArcadeAnswer[] {
  switch (c.kind) {
    case 'swipe':
      return [
        { kind: 'swipe', accept: true },
        { kind: 'swipe', accept: false },
      ];
    case 'audio':
      return c.options.map((_, option) => ({ kind: 'audio', option }));
    case 'connect':
      return c.left.flatMap((_, left) =>
        c.right.map((__, right) => ({ kind: 'connect', left, right })),
      );
    case 'sentence':
      return [
        { kind: 'sentence', order: c.tokens.map((_, i) => i) },
        {
          kind: 'sentence',
          order: c.answers[0]!.replace(/[.!?]$/, '')
            .split(' ')
            .map((w) => c.tokens.indexOf(w)),
        },
      ];
  }
}

test('compartido: un solo flujo; cada curso ve sus textos, con la misma corrección', () => {
  const { words, sentences } = supported();
  const stream = createChallengeStream(words, sentences, seededRandom(7));
  stream.ensure(80);
  const kinds = new Set(stream.challenges.map((c) => c.kind));
  assert.deepEqual([...kinds].sort(), ['audio', 'connect', 'sentence', 'swipe']);
  for (const c of stream.challenges) {
    const es = localizeChallenge(c, null);
    const pt = localizeChallenge(c, 'en-from-pt');
    assert.deepEqual(invariant(pt), invariant(es), `desafío ${c.index}: mismo inglés y respuesta`);
    const vEs = toChallengeView(es);
    const vPt = toChallengeView(pt);
    switch (vPt.kind) {
      case 'swipe':
        assert.ok(PT_SUPPORT.has(vPt.candidate) && ES_SUPPORT.has((vEs as typeof vPt).candidate));
        break;
      case 'audio':
        assert.ok(vPt.options.every((o) => PT_SUPPORT.has(o)));
        assert.ok((vEs as typeof vPt).options.every((o) => ES_SUPPORT.has(o)));
        assert.equal(new Set(vPt.options).size, vPt.options.length, 'opciones distintas en pt');
        break;
      case 'connect':
        assert.ok(vPt.right.every((o) => PT_SUPPORT.has(o)));
        assert.equal(new Set(vPt.right).size, vPt.right.length);
        break;
      case 'sentence':
        assert.ok(PT_SENTENCES_TEXT.has(vPt.translation));
        assert.ok(ES_SENTENCES.has((vEs as typeof vPt).translation));
        break;
    }
    // La misma respuesta se corrige igual en los dos asientos (índices compatibles).
    for (const answer of answersOf(c)) {
      const a = gradeArcade(es, answer);
      const b = gradeArcade(pt, answer);
      assert.equal(a.valid, b.valid);
      if (a.valid && b.valid) {
        assert.equal(a.correct, b.correct);
        assert.equal(a.done, b.done);
        assert.equal(a.correctOption, b.correctOption);
        if (c.kind !== 'swipe') assert.equal(a.solution, b.solution);
      }
    }
    // Swipe: la solución revelada sale en el idioma del asiento.
    if (c.kind === 'swipe') {
      const b = gradeArcade(pt, { kind: 'swipe', accept: true });
      assert.ok(b.valid && PT_SUPPORT.has(b.solution!));
    }
  }
});

test('compartido: sin support (un solo curso) el flujo es idéntico al de siempre', () => {
  const plain = createChallengeStream(ARCADE_WORDS, ARCADE_SENTENCES, seededRandom(7));
  const again = createChallengeStream(
    ARCADE_WORDS.map((w) => ({ ...w })),
    ARCADE_SENTENCES.map((s) => ({ ...s })),
    seededRandom(7),
  );
  plain.ensure(80);
  again.ensure(80);
  assert.deepEqual(again.challenges, plain.challenges);
  assert.ok(
    plain.challenges.every((c) => !('localized' in c)),
    'ningún desafío lleva localized',
  );
  for (const c of plain.challenges) assert.equal(localizeChallenge(c, 'en-from-pt'), c);
});

test('compartido: dos palabras que se confunden sólo en portugués nunca son distractor una de otra', () => {
  // «bye» y «goodbye» → «adiós» / «chau» en español (distintas), pero las dos «tchau» en portugués.
  const words: RushWord[] = [
    ...ARCADE_WORDS.filter((w) => w.text !== 'goodbye'),
    { id: 'bye', text: 'goodbye', translationEs: 'adiós', unitId: 'a1-u01' },
    { id: 'bye2', text: 'bye', translationEs: 'chau', unitId: 'a1-u01' },
  ];
  const pt = [
    ...PT_WORDS,
    { id: 'ept-bye2', text: 'bye', translationEs: 'tchau', unitId: 'ept-a1-u01' },
  ];
  const withPt = withWordSupport(words, 'en-from-pt', pt).words;
  const stream = createChallengeStream(withPt, [], seededRandom(11));
  stream.ensure(200);
  for (const c of stream.challenges) {
    const pt = localizeChallenge(c, 'en-from-pt');
    if (pt.kind === 'audio')
      assert.equal(pt.options.filter((o) => o === 'tchau').length <= 1, true);
    if (pt.kind === 'connect')
      assert.equal(pt.right.filter((o) => o === 'tchau').length <= 1, true);
    if (pt.kind === 'swipe' && pt.candidate === 'tchau' && !pt.truthful) {
      // La «mentira» nunca es la otra palabra que en portugués significa lo mismo.
      assert.ok(
        !['bye', 'goodbye'].includes(pt.prompt),
        `desafío ${pt.index}: «tchau» sería verdad`,
      );
    }
  }
});

// ---------------------------------------------------------------------------------------------
// Servidor (Socket.IO): partida mixta es + pt y partida de un solo curso

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const RULES = {
  ...ARCADE,
  countdownMs: 50,
  durationMs: 1_200,
  frenzyMs: 300,
  readyTimeoutMs: 2_000,
  reconnectGraceMs: 300,
};

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

/** Lo que vio cada jugador de una partida ranked entre `a` y `b`, y la corrección de una respuesta. */
async function playMatch(store: FakeStore, a: string, b: string, logger: Logger = silentLogger) {
  const server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger,
    arcadeRules: RULES,
    tickMs: 20,
    random: seededRandom(21),
    botAfterMs: null,
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  const url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
  const open = (userId: string): Client =>
    connect(url, {
      transports: ['websocket'],
      auth: { token: `tok-${userId}`, protocolVersion: ARCADE_PROTOCOL_VERSION },
      reconnection: false,
      forceNew: true,
    });
  const ca = open(a);
  const cb = open(b);
  try {
    await Promise.all(
      [ca, cb].map(
        (c) =>
          new Promise<void>((resolve, reject) => {
            c.once('connect', () => resolve());
            c.once('connect_error', reject);
          }),
      ),
    );
    const views: Record<string, ChallengeView[]> = { [a]: [], [b]: [] };
    ca.on('arcade:challenge', (v) => views[a]!.push(v));
    cb.on('arcade:challenge', (v) => views[b]!.push(v));
    const foundA = next(ca, 'match:found');
    const foundB = next(cb, 'match:found');
    await ca.emitWithAck('queue:join', { mode: 'ranked' });
    await cb.emitWithAck('queue:join', { mode: 'ranked' });
    const found = await foundA;
    await foundB;
    await ca.emitWithAck('match:ready', { battleId: found.battleId });
    await cb.emitWithAck('match:ready', { battleId: found.battleId });
    await new Promise((r) => setTimeout(r, 200));
    // Los dos responden lo mismo a sus primeros desafíos: la corrección tiene que coincidir.
    const results: Record<string, unknown[]> = { [a]: [], [b]: [] };
    for (let i = 0; i < 6; i++) {
      const view = views[a]![i];
      if (!view) break;
      const answer: ArcadeAnswer =
        view.kind === 'swipe'
          ? { kind: 'swipe', accept: true }
          : view.kind === 'audio'
            ? { kind: 'audio', option: 1 }
            : view.kind === 'connect'
              ? { kind: 'connect', left: 0, right: 0 }
              : { kind: 'sentence', order: view.tokens.map((_, k) => k) };
      for (const [user, socket] of [
        [a, ca],
        [b, cb],
      ] as const) {
        await new Promise((r) => setTimeout(r, 5));
        const res = await socket.emitWithAck('arcade:answer', {
          battleId: found.battleId,
          challengeIndex: i,
          answer,
        });
        results[user]!.push(res);
      }
      // Connect: el desafío sigue hasta resolver el tablero; se pasa al siguiente sólo si `done`.
      const first = results[a]![results[a]!.length - 1] as {
        ok: boolean;
        data?: { done: boolean };
      };
      if (!first.ok || !first.data?.done) break;
    }
    const finish = next(ca, 'battle:finish', 5_000);
    await finish;
    return { views, results, server };
  } finally {
    ca.disconnect();
    cb.disconnect();
    await server.close();
  }
}

const strip = (r: unknown) => {
  const res = r as { ok: boolean; data?: Record<string, unknown> };
  if (!res.ok || !res.data) return res;
  // El puntaje depende del tiempo de cada uno: se compara la corrección.
  const {
    points: _p,
    score: _s,
    multiplier: _m,
    frenzy: _f,
    combo: _c,
    solution: _sol,
    ...rest
  } = res.data;
  return { ok: true, ...rest };
};

function mixedStore() {
  const store = new FakeStore().add(
    { ...player('sofia'), courseCode: 'en-from-es' },
    { ...player('joao', 1010), courseCode: 'en-from-pt' },
  );
  store.courseCatalog = COURSES;
  store.words = ARCADE_WORDS;
  store.sentences = ARCADE_SENTENCES;
  store.wordsByCourse.set('en-from-es', ARCADE_WORDS);
  store.wordsByCourse.set('en-from-pt', PT_WORDS);
  store.sentencesByCourse.set('en-from-es', ARCADE_SENTENCES);
  store.sentencesByCourse.set('en-from-pt', PT_SENTENCES);
  return store;
}

const sameEnglish = (v: ChallengeView) => {
  switch (v.kind) {
    case 'swipe':
      return { i: v.index, k: v.kind, p: v.prompt };
    case 'audio':
      return { i: v.index, k: v.kind, p: v.prompt, n: v.options.length };
    case 'connect':
      return { i: v.index, k: v.kind, l: v.left, s: v.solved };
    case 'sentence':
      return { i: v.index, k: v.kind, t: v.tokens };
  }
};

test('servidor: partida mixta es + pt: mismo inglés en el mismo orden, cada uno en su idioma', async () => {
  const store = mixedStore();
  const warnings: string[] = [];
  const logger: Logger = { ...silentLogger, warn: (m) => warnings.push(m) };
  const { views, results } = await playMatch(store, 'sofia', 'joao', logger);
  const es = views.sofia!;
  const pt = views.joao!;
  assert.ok(es.length >= 2 && pt.length >= 2);
  const n = Math.min(es.length, pt.length);
  assert.deepEqual(pt.slice(0, n).map(sameEnglish), es.slice(0, n).map(sameEnglish));
  // Cada asiento, sus textos de apoyo.
  let checked = 0;
  for (let i = 0; i < n; i++) {
    const [a, b] = [es[i]!, pt[i]!];
    if (a.kind === 'swipe' && b.kind === 'swipe') {
      assert.ok(ES_SUPPORT.has(a.candidate) && PT_SUPPORT.has(b.candidate));
      checked++;
    } else if (a.kind === 'audio' && b.kind === 'audio') {
      assert.ok(
        a.options.every((o) => ES_SUPPORT.has(o)) && b.options.every((o) => PT_SUPPORT.has(o)),
      );
      // Mismo orden: la opción k de uno es la traducción de la misma palabra que la k del otro.
      const esOf = new Map(ARCADE_WORDS.map((w) => [w.translationEs, w.text]));
      const ptOf = new Map(PT_WORDS.map((w) => [w.translationEs, w.text]));
      assert.deepEqual(
        b.options.map((o) => ptOf.get(o)),
        a.options.map((o) => esOf.get(o)),
      );
      checked++;
    } else if (a.kind === 'connect' && b.kind === 'connect') {
      const esOf = new Map(ARCADE_WORDS.map((w) => [w.translationEs, w.text]));
      const ptOf = new Map(PT_WORDS.map((w) => [w.translationEs, w.text]));
      assert.deepEqual(
        b.right.map((o) => ptOf.get(o)),
        a.right.map((o) => esOf.get(o)),
      );
      checked++;
    } else if (a.kind === 'sentence' && b.kind === 'sentence') {
      assert.ok(ES_SENTENCES.has(a.translation) && PT_SENTENCES_TEXT.has(b.translation));
      checked++;
    }
  }
  assert.ok(checked >= 2);
  // La misma respuesta se corrige igual para los dos (índices compatibles; ELO y puntaje de siempre).
  assert.ok(results.sofia!.length >= 1);
  assert.deepEqual(results.joao!.map(strip), results.sofia!.map(strip));
  // Contenido canónico (en-from-es) más los textos de en-from-pt; nada faltó.
  assert.deepEqual([...new Set(store.wordLoads.map(([, c]) => c))].sort(), [
    'en-from-es',
    'en-from-pt',
  ]);
  assert.ok(!warnings.includes('shared_pool_support_missing'), warnings.join(','));
});

test('servidor: lo que falta en el curso de apoyo se muestra canónico y se registra', async () => {
  const store = mixedStore();
  store.wordsByCourse.set(
    'en-from-pt',
    PT_WORDS.filter((w) => w.text !== 'water'),
  );
  const warnings: { m: string; d?: Record<string, unknown> }[] = [];
  const logger: Logger = { ...silentLogger, warn: (m, d) => warnings.push({ m, d }) };
  await playMatch(store, 'sofia', 'joao', logger);
  const missing = warnings.find((w) => w.m === 'shared_pool_support_missing');
  assert.ok(missing, 'se registra');
  assert.deepEqual(missing.d?.sample, ['water']);
  assert.equal(missing.d?.course, 'en-from-pt');
});

test('servidor: dos jugadores del mismo curso juegan exactamente como antes de los cursos', async () => {
  // Con catálogo (los dos en en-from-es) y sin catálogo (servidor de antes): mismas vistas, mismas
  // correcciones, sin textos de otro curso.
  const withCatalog = mixedStore();
  withCatalog.players.set('joao', {
    ...withCatalog.players.get('joao')!,
    courseCode: 'en-from-es',
  });
  const legacy = new FakeStore().add(player('sofia'), player('joao', 1010));
  legacy.words = ARCADE_WORDS;
  legacy.sentences = ARCADE_SENTENCES;
  const a = await playMatch(withCatalog, 'sofia', 'joao');
  const b = await playMatch(legacy, 'sofia', 'joao');
  assert.deepEqual(a.views.sofia, a.views.joao, 'los dos ven lo mismo');
  assert.deepEqual(a.views.sofia, b.views.sofia, 'igual que el servidor de antes');
  assert.deepEqual(a.results.sofia!.map(strip), b.results.sofia!.map(strip));
  assert.deepEqual(
    withCatalog.wordLoads.map(([, c]) => c),
    ['en-from-es'],
  );
  assert.deepEqual(
    legacy.wordLoads.map(([, c]) => c),
    [null],
  );
});

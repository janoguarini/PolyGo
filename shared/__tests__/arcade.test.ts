import {
  ARCADE,
  CHALLENGE_KINDS,
  KIND_ROTATION,
  KIND_RULES,
  MAX_ARCADE_POINTS,
  RecentContentMemory,
  arcadeScore,
  availableKinds,
  botArcadeMove,
  comboMultiplier,
  contentIds,
  createChallengeStream,
  generateChallenges,
  gradeArcade,
  isDescriptiveTranslation,
  isFrenzy,
  kindSequence,
  sentencePool,
  toChallengeView,
  translationKeys,
  translationsOverlap,
  tugPosition,
  type ArcadeChallenge,
  type ArcadeSentence,
  type ChallengeKind,
} from '../arcade';
import { LANGUAGES } from '../languages';
import type { RushWord } from '../wordRush';

function mulberry(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const word = (id: string, text: string, translationEs: string, level = 'A1'): RushWord => ({
  id,
  text,
  translationEs,
  level,
});

const WORDS: RushWord[] = [
  word('apple', 'apple', 'manzana'),
  word('house', 'house', 'casa'),
  word('dog', 'dog', 'perro'),
  word('water', 'water', 'agua'),
  word('cat', 'cat', 'gato'),
  word('book', 'book', 'libro'),
  word('sun', 'sun', 'sol'),
  word('bread', 'bread', 'pan'),
  word('milk', 'milk', 'leche'),
  word('car', 'car', 'auto'),
];

const sentence = (
  id: string,
  text: string,
  extra: Partial<ArcadeSentence> = {},
): ArcadeSentence => ({
  id,
  tokens: text.replace(/[.!?。]$/, '').split(' '),
  answer: text,
  acceptedAnswers: [],
  translation: `(${id})`,
  unitId: 'a1-u01',
  ...extra,
});

const SENTENCES: ArcadeSentence[] = [
  sentence('s1', 'I went home yesterday.'),
  sentence('s2', 'She is a student.'),
  sentence('s3', 'We like green tea.'),
  sentence('s4', 'My name is Sofía.'),
  sentence('s5', 'The dog is very big.'),
  sentence('s6', 'They live in Rome.'),
];

describe('puntuación', () => {
  it('puntos base por microjuego sin combo ni velocidad', () => {
    for (const kind of CHALLENGE_KINDS) {
      const s = arcadeScore({
        kind,
        correct: true,
        elapsedMs: KIND_RULES[kind].speedWindowMs,
        comboBefore: 0,
        frenzy: false,
      });
      expect(s.points).toBe(KIND_RULES[kind].base);
      expect(s.combo).toBe(1);
      expect(s.multiplier).toBe(1);
    }
  });

  it('el bonus de velocidad es como mucho un 25 % y es entero', () => {
    const fast = arcadeScore({
      kind: 'sentence',
      correct: true,
      elapsedMs: 0,
      comboBefore: 0,
      frenzy: false,
    });
    expect(fast.points).toBe(250);
    // Ejemplo del documento: Swipe en 800 ms → 50 + floor(50·0,25·1200/2000) = 57.
    const swipe = arcadeScore({
      kind: 'swipe',
      correct: true,
      elapsedMs: 800,
      comboBefore: 0,
      frenzy: false,
    });
    expect(swipe.speedBonus).toBe(7);
    expect(swipe.points).toBe(57);
    expect(Number.isInteger(swipe.points)).toBe(true);
  });

  it('fallo: 0 puntos y rompe el combo; nunca negativo', () => {
    const s = arcadeScore({
      kind: 'audio',
      correct: false,
      elapsedMs: 500,
      comboBefore: 7,
      frenzy: true,
    });
    expect(s).toMatchObject({ correct: false, points: 0, combo: 0, multiplier: 1 });
  });

  it('multiplicadores de combo: 1–2 ×1, 3–4 ×2, 5–7 ×3, 8+ ×4', () => {
    expect([1, 2, 3, 4, 5, 7, 8, 20].map(comboMultiplier)).toEqual([1, 1, 2, 2, 3, 3, 4, 4]);
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(-3)).toBe(1);
  });

  it('el combo incluye el acierto actual', () => {
    const third = arcadeScore({
      kind: 'swipe',
      correct: true,
      elapsedMs: 2_000,
      comboBefore: 2,
      frenzy: false,
    });
    expect(third.combo).toBe(3);
    expect(third.points).toBe(100);
  });

  it('Frenesí duplica después del combo (orden fijo)', () => {
    // Audio en 1 s con combo 4 → 5.º acierto: (100 + 18) × 3 × 2 = 708.
    const s = arcadeScore({
      kind: 'audio',
      correct: true,
      elapsedMs: 1_000,
      comboBefore: 4,
      frenzy: true,
    });
    expect(s.speedBonus).toBe(18);
    expect(s.multiplier).toBe(3);
    expect(s.points).toBe(708);
  });

  it('respuestas no humanas (Swipe < 200 ms) cuentan como fallo', () => {
    const s = arcadeScore({
      kind: 'swipe',
      correct: true,
      elapsedMs: 120,
      comboBefore: 5,
      frenzy: false,
    });
    expect(s).toMatchObject({ correct: false, points: 0, combo: 0, tooFast: true });
  });

  it('tope por respuesta', () => {
    expect(MAX_ARCADE_POINTS).toBe(2_000);
    const max = arcadeScore({
      kind: 'sentence',
      correct: true,
      elapsedMs: 0,
      comboBefore: 50,
      frenzy: true,
    });
    expect(max.points).toBe(MAX_ARCADE_POINTS);
  });

  it('equilibrio: ~40 puntos base por segundo en cada microjuego a ritmo de quien sabe', () => {
    const typicalMs: Record<ChallengeKind, number> = {
      swipe: 1_250,
      connect: 1_250,
      audio: 2_500,
      sentence: 5_000,
    };
    for (const kind of CHALLENGE_KINDS) {
      const perSecond = (KIND_RULES[kind].base * 1_000) / typicalMs[kind];
      expect(perSecond).toBeGreaterThanOrEqual(38);
      expect(perSecond).toBeLessThanOrEqual(42);
    }
  });
});

describe('Frenesí', () => {
  const endsAt = 1_000_000;
  it('empieza exactamente a los 45 s de juego y termina a los 60', () => {
    const startsAt = endsAt - ARCADE.durationMs;
    expect(isFrenzy(startsAt + 44_999, endsAt)).toBe(false);
    expect(isFrenzy(startsAt + 45_000, endsAt)).toBe(true);
    expect(isFrenzy(endsAt - 1, endsAt)).toBe(true);
    expect(isFrenzy(endsAt, endsAt)).toBe(false);
    expect(isFrenzy(startsAt, null)).toBe(false);
  });
});

describe('Tug of War', () => {
  it('centro con empate, simétrica y del lado de quien gana', () => {
    expect(tugPosition(0, 0)).toBe(0);
    expect(tugPosition(500, 500)).toBe(0);
    expect(tugPosition(300, 100)).toBeGreaterThan(0);
    expect(tugPosition(100, 300)).toBeCloseTo(-tugPosition(300, 100));
  });

  it('una diferencia chica no llega al extremo y nunca pasa de ±0,92', () => {
    expect(Math.abs(tugPosition(100, 0))).toBeLessThan(0.3);
    expect(tugPosition(100_000, 0)).toBeLessThanOrEqual(0.92);
    expect(tugPosition(0, 100_000)).toBeGreaterThanOrEqual(-0.92);
  });

  it('la misma ventaja pesa menos con más puntos en juego', () => {
    expect(tugPosition(600, 400)).toBeLessThan(tugPosition(300, 100));
  });
});

/** Racha más larga de cada formato y hueco más largo (desafíos seguidos sin un formato disponible). */
function runsAndGaps(seq: readonly ChallengeKind[], available: readonly ChallengeKind[]) {
  const maxRun: Partial<Record<ChallengeKind, number>> = {};
  let run = 0;
  for (let i = 0; i < seq.length; i++) {
    run = i > 0 && seq[i] === seq[i - 1] ? run + 1 : 1;
    maxRun[seq[i]!] = Math.max(maxRun[seq[i]!] ?? 0, run);
  }
  let maxGap = 0;
  for (const kind of available) {
    let last = -1;
    seq.forEach((k, i) => {
      if (k !== kind) return;
      maxGap = Math.max(maxGap, i - last - 1);
      last = i;
    });
    maxGap = Math.max(maxGap, seq.length - last - 1);
  }
  return { maxRun, maxGap };
}

describe('rotación de microjuegos', () => {
  it('rachas y huecos acotados: Swipe/Audio hasta 2 seguidos, Connect/Sentence nunca; nadie falta más de 6', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const seq = kindSequence(CHALLENGE_KINDS, 120, mulberry(seed));
      expect(seq).toHaveLength(120);
      expect(new Set(seq.slice(0, 10)).size).toBe(4);
      const { maxRun, maxGap } = runsAndGaps(seq, CHALLENGE_KINDS);
      for (const kind of CHALLENGE_KINDS) {
        expect(maxRun[kind] ?? 0).toBeLessThanOrEqual(KIND_ROTATION.maxRun[kind]);
      }
      expect(maxGap).toBeLessThanOrEqual(KIND_ROTATION.maxGap);
    }
  });

  it('arranca siempre con un formato rápido (Swipe o Audio), y los dos aparecen como primero', () => {
    const firsts = new Set<ChallengeKind>();
    for (let seed = 1; seed <= 200; seed++) {
      firsts.add(kindSequence(CHALLENGE_KINDS, 1, mulberry(seed))[0]!);
    }
    expect([...firsts].sort()).toEqual(['audio', 'swipe']);
  });

  it('distribución estadística: cada formato a ±2 puntos de su proporción (4.000 partidas de 60)', () => {
    const counts = new Map<ChallengeKind, number>();
    const N = 4_000;
    for (let seed = 1; seed <= N; seed++) {
      for (const k of kindSequence(CHALLENGE_KINDS, 60, mulberry(seed * 7_919))) {
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    for (const kind of CHALLENGE_KINDS) {
      const share = counts.get(kind)! / (N * 60);
      expect(Math.abs(share - KIND_ROTATION.weights[kind])).toBeLessThanOrEqual(0.02);
    }
  });

  it('equilibrio dentro de una partida típica: en los primeros 25 hay al menos 3 de cada formato', () => {
    for (let seed = 1; seed <= 2_000; seed++) {
      const first = kindSequence(CHALLENGE_KINDS, 25, mulberry(seed));
      for (const kind of CHALLENGE_KINDS) {
        expect(first.filter((k) => k === kind).length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('no es predecible: ningún par de formatos anteriores anticipa el siguiente más del 60 %', () => {
    const contexts = new Map<string, Map<ChallengeKind, number>>();
    for (let seed = 1; seed <= 3_000; seed++) {
      const seq = kindSequence(CHALLENGE_KINDS, 60, mulberry(seed));
      for (let i = 2; i < seq.length; i++) {
        const key = `${seq[i - 2]},${seq[i - 1]}`;
        const next = contexts.get(key) ?? new Map<ChallengeKind, number>();
        next.set(seq[i]!, (next.get(seq[i]!) ?? 0) + 1);
        contexts.set(key, next);
      }
    }
    let checked = 0;
    for (const next of contexts.values()) {
      const total = [...next.values()].reduce((a, b) => a + b, 0);
      if (total < 500) continue;
      checked++;
      expect(Math.max(...next.values()) / total).toBeLessThanOrEqual(0.6);
    }
    expect(checked).toBeGreaterThan(5);
  });

  it('con menos formatos disponibles respeta las mismas reglas y no inventa el que falta', () => {
    const subsets: ChallengeKind[][] = [
      ['swipe', 'audio', 'connect'],
      ['swipe', 'audio', 'sentence'],
      ['swipe', 'audio'],
    ];
    for (const available of subsets) {
      for (let seed = 1; seed <= 200; seed++) {
        const seq = kindSequence(available, 80, mulberry(seed));
        expect(seq.every((k) => available.includes(k))).toBe(true);
        const { maxRun, maxGap } = runsAndGaps(seq, available);
        for (const kind of available) {
          expect(maxRun[kind] ?? 0).toBeLessThanOrEqual(KIND_ROTATION.maxRun[kind]);
        }
        expect(maxGap).toBeLessThanOrEqual(KIND_ROTATION.maxGap);
      }
    }
  });

  it('el orden cambia entre partidas', () => {
    const a = kindSequence(CHALLENGE_KINDS, 20, mulberry(1)).join();
    const b = kindSequence(CHALLENGE_KINDS, 20, mulberry(2)).join();
    expect(a).not.toBe(b);
  });

  it('distribución equilibrada: cada formato es al menos un 15 % de los desafíos', () => {
    const seq = kindSequence(CHALLENGE_KINDS, 60, mulberry(9));
    for (const kind of CHALLENGE_KINDS) {
      expect(seq.filter((k) => k === kind).length).toBeGreaterThanOrEqual(9);
    }
  });

  it('sin frases suficientes, Sentence Rush queda fuera (no se inventa contenido)', () => {
    expect(availableKinds(WORDS, SENTENCES.slice(0, 2))).toEqual(['swipe', 'audio', 'connect']);
    const challenges = generateChallenges(WORDS, [], mulberry(3));
    expect(challenges.some((c) => c.kind === 'sentence')).toBe(false);
  });

  it('con pocas palabras no hay Connect; sin 4 palabras no hay partida', () => {
    expect(availableKinds(WORDS.slice(0, 5), SENTENCES)).toEqual(['swipe', 'audio', 'sentence']);
    expect(availableKinds(WORDS.slice(0, 3), SENTENCES)).toEqual([]);
    expect(() => generateChallenges(WORDS.slice(0, 3), SENTENCES, mulberry(1))).toThrow();
  });

  it('misma semilla → misma secuencia (los dos jugadores reciben la misma)', () => {
    const a = generateChallenges(WORDS, SENTENCES, mulberry(42));
    const b = generateChallenges(WORDS, SENTENCES, mulberry(42));
    expect(a).toEqual(b);
    expect(a).toHaveLength(ARCADE.challengeCount);
  });
});

describe('microjuegos', () => {
  const all = generateChallenges(WORDS, SENTENCES, mulberry(7));
  const first = <K extends ChallengeKind>(kind: K) =>
    all.find((c): c is Extract<ArcadeChallenge, { kind: K }> => c.kind === kind)!;

  it('la vista para el cliente no tiene la respuesta', () => {
    for (const c of all) {
      const keys = Object.keys(toChallengeView(c));
      for (const secret of [
        'truthful',
        'correctOption',
        'solution',
        'answers',
        'wordId',
        'sentenceId',
      ]) {
        expect(keys).not.toContain(secret);
      }
    }
    const swipe = toChallengeView(first('swipe'));
    expect(Object.keys(swipe).sort()).toEqual(['candidate', 'index', 'kind', 'prompt']);
  });

  it('Swipe: aceptar la verdadera / rechazar la falsa es correcto', () => {
    const s = first('swipe');
    expect(gradeArcade(s, { kind: 'swipe', accept: s.truthful })).toMatchObject({
      correct: true,
      done: true,
    });
    expect(gradeArcade(s, { kind: 'swipe', accept: !s.truthful })).toMatchObject({
      correct: false,
      done: true,
    });
    expect(gradeArcade(s, { kind: 'swipe', accept: 'yes' })).toEqual({ valid: false });
  });

  it('Swipe: la traducción falsa nunca es otra traducción válida de la palabra', () => {
    for (const c of all) {
      if (c.kind !== 'swipe' || c.truthful) continue;
      expect(c.candidate).not.toBe(c.translation);
    }
  });

  it('Connect: cuatro parejas inequívocas, en órdenes mezclados', () => {
    const boards = all.filter(
      (c): c is Extract<ArcadeChallenge, { kind: 'connect' }> => c.kind === 'connect',
    );
    for (const c of boards) {
      expect(c.left).toHaveLength(4);
      expect(new Set(c.left).size).toBe(4);
      expect(new Set(c.right).size).toBe(4);
      expect(new Set(c.solution).size).toBe(4);
      for (let i = 0; i < 4; i++) {
        const w = WORDS.find((x) => x.text === c.left[i])!;
        expect(c.right[c.solution[i]!]).toBe(w.translationEs);
      }
    }
    // No siempre en el mismo orden.
    expect(new Set(boards.map((b) => b.solution.join())).size).toBeGreaterThan(1);
  });

  it('Connect: pareja correcta, incorrecta, repetida y limpiar el tablero', () => {
    const c = first('connect');
    const solved = new Set<number>();
    const wrongRight = (c.solution[0]! + 1) % 4;
    expect(gradeArcade(c, { kind: 'connect', left: 0, right: wrongRight }, solved)).toMatchObject({
      valid: true,
      correct: false,
      done: false,
    });
    for (let i = 0; i < 4; i++) {
      const r = gradeArcade(c, { kind: 'connect', left: i, right: c.solution[i] }, solved);
      expect(r).toMatchObject({
        valid: true,
        correct: true,
        done: i === 3,
        pair: [i, c.solution[i]],
      });
      solved.add(i);
    }
    // Una pareja ya resuelta (o su derecha) no se puede volver a mandar.
    expect(
      gradeArcade(c, { kind: 'connect', left: 0, right: c.solution[0] }, new Set([0])),
    ).toEqual({ valid: false });
    expect(
      gradeArcade(c, { kind: 'connect', left: 1, right: c.solution[0] }, new Set([0])),
    ).toEqual({ valid: false });
    expect(gradeArcade(c, { kind: 'connect', left: 9, right: 0 })).toEqual({ valid: false });
  });

  it('Sentence Rush: orden válido, inválido y forma inválida', () => {
    const c = first('sentence');
    const target = c.answers[0]!.replace(/[.]$/, '').split(' ');
    const order = target.map((t) => c.tokens.indexOf(t));
    expect(gradeArcade(c, { kind: 'sentence', order })).toMatchObject({
      correct: true,
      done: true,
    });
    expect(gradeArcade(c, { kind: 'sentence', order: [...order].reverse() })).toMatchObject({
      correct: false,
    });
    expect(gradeArcade(c, { kind: 'sentence', order: [0, 0, 1] })).toEqual({ valid: false });
    expect(gradeArcade(c, { kind: 'sentence', order: order.slice(1) })).toEqual({ valid: false });
  });

  it('Sentence Rush: acepta las variantes cargadas explícitamente', () => {
    const s = sentence('v', 'Yesterday I went home.', {
      acceptedAnswers: ['I went home yesterday.'],
    });
    const copies = Array.from({ length: 6 }, (_, i) => ({ ...s, id: `v${i}` }));
    const c = generateChallenges(WORDS, copies, mulberry(1)).find(
      (x): x is Extract<ArcadeChallenge, { kind: 'sentence' }> => x.kind === 'sentence',
    )!;
    // Los bloques conservan mayúsculas; el corrector no las distingue (como en las lecciones).
    const variant = ['I', 'went', 'home', 'Yesterday'].map((t) => c.tokens.indexOf(t));
    const canonical = ['Yesterday', 'I', 'went', 'home'].map((t) => c.tokens.indexOf(t));
    expect(gradeArcade(c, { kind: 'sentence', order: variant })).toMatchObject({ correct: true });
    expect(gradeArcade(c, { kind: 'sentence', order: canonical })).toMatchObject({ correct: true });
    const other = ['home', 'went', 'I', 'Yesterday'].map((t) => c.tokens.indexOf(t));
    expect(gradeArcade(c, { kind: 'sentence', order: other })).toMatchObject({ correct: false });
  });

  it('Audio Blitz: opción correcta y la palabra se revela al responder', () => {
    const c = first('audio');
    expect(c.options).toHaveLength(4);
    expect(new Set(c.options).size).toBe(4);
    expect(gradeArcade(c, { kind: 'audio', option: c.correctOption })).toMatchObject({
      correct: true,
      solution: c.prompt,
      correctOption: c.correctOption,
    });
    expect(gradeArcade(c, { kind: 'audio', option: (c.correctOption + 1) % 4 })).toMatchObject({
      correct: false,
    });
    expect(gradeArcade(c, { kind: 'audio', option: 4 })).toEqual({ valid: false });
  });

  it('una respuesta de otro formato se rechaza sin corregir', () => {
    expect(gradeArcade(first('audio'), { kind: 'swipe', accept: true })).toEqual({ valid: false });
    expect(gradeArcade(first('swipe'), null)).toEqual({ valid: false });
  });
});

describe('frases aptas', () => {
  it('filtra por nivel, largo, contenido roto y conectores reordenables', () => {
    const pool = sentencePool(
      [
        ...SENTENCES,
        sentence('a2', 'I have been there.', { unitId: 'a2-u03' }),
        sentence('long', 'I want to go to the big park today.'),
        sentence('two', 'Hi there.'),
        sentence('and', 'Marco is Italian and Claire is French.'),
        sentence('broken', 'She is a student.', { tokens: ['She', 'is', 'teacher'] }),
      ],
      'en',
      100,
    );
    expect(pool.map((s) => s.id)).toEqual(['s1', 's2', 's3', 's4', 's5', 's6']);
  });

  it('con un conector se usa sólo si tiene variantes cargadas', () => {
    const ok = sentence('and2', 'Tea and milk.', { acceptedAnswers: ['Milk and tea.'] });
    expect(sentencePool([ok], 'en', 100)).toHaveLength(1);
  });

  it('A2 entra desde Plata (mismo criterio que Word Rush)', () => {
    const a2 = sentence('a2', 'I have been there.', { unitId: 'a2-u03' });
    expect(sentencePool([a2], 'en', 100)).toHaveLength(0);
    expect(sentencePool([a2], 'en', 2_000)).toHaveLength(1);
  });

  it('chino: frase con caracteres y bloques sin espacios', () => {
    const zh = sentence('zh1', '我叫王明。', { tokens: ['我', '叫', '王明'], unitId: 'zh-a1-u01' });
    const [pool] = [sentencePool([zh], 'zh', 100)];
    expect(pool).toHaveLength(1);
    const [c] = generateChallenges(
      WORDS,
      Array(6)
        .fill(zh)
        .map((s, i) => ({ ...s, id: `z${i}` })),
      mulberry(2),
    ).filter((x): x is Extract<ArcadeChallenge, { kind: 'sentence' }> => x.kind === 'sentence');
    const order = ['我', '叫', '王明'].map((t) => c!.tokens.indexOf(t));
    expect(gradeArcade(c!, { kind: 'sentence', order })).toMatchObject({ correct: true });
  });
});

describe('los seis cursos', () => {
  it('todos los cursos con Ranked arman una partida con los cuatro microjuegos', () => {
    const ranked = LANGUAGES.filter((l) => l.ranked);
    expect(ranked.map((l) => l.code).sort()).toEqual(['en', 'es', 'fr', 'it', 'pt', 'zh']);
    for (const lang of ranked) {
      const unit = lang.code === 'en' ? 'a1-u01' : `${lang.code}-a1-u01`;
      const sentences = SENTENCES.map((s) => ({ ...s, unitId: unit }));
      const pool = sentencePool(sentences, lang.code, 100);
      const challenges = generateChallenges(WORDS, pool, mulberry(lang.code.charCodeAt(0)));
      expect(new Set(challenges.map((c) => c.kind)).size).toBe(4);
    }
  });
});

// ---------------------------------------------------------------------------------------------
// Flujo continuo, sincronización, memoria y calidad

/** Banco grande y sin significados compartidos: cien palabras, treinta frases. */
const BIG_WORDS: RushWord[] = Array.from({ length: 100 }, (_, i) =>
  word(`w${i}`, `word${i}`, `palabra${i}`),
);
const BIG_SENTENCES: ArcadeSentence[] = Array.from({ length: 30 }, (_, i) =>
  sentence(`s${i}`, `We see item ${i} now.`),
);

/** Palabras de la consigna en el orden en que aparecen (Connect: sus cuatro). */
const promptWords = (challenges: readonly ArcadeChallenge[]) => contentIds(challenges).words;

describe('flujo continuo de desafíos', () => {
  it('arranca con challengeCount y crece por bloques; at() genera lo que falta', () => {
    const stream = createChallengeStream(WORDS, SENTENCES, mulberry(1));
    expect(stream.challenges).toHaveLength(ARCADE.challengeCount);
    stream.ensure(ARCADE.challengeCount + 1);
    expect(stream.challenges).toHaveLength(ARCADE.challengeCount + ARCADE.challengeBlock);
    const far = stream.at(500);
    expect(far.index).toBe(500);
    expect(stream.challenges.length).toBeGreaterThanOrEqual(501);
    stream.challenges.forEach((c, i) => expect(c.index).toBe(i));
    expect(() => stream.at(-1)).toThrow();
  });

  it('cada desafío depende sólo de la semilla y su posición, no de cuándo se pidió el bloque', () => {
    const once = createChallengeStream(WORDS, SENTENCES, mulberry(77));
    once.ensure(400);
    const stepwise = createChallengeStream(WORDS, SENTENCES, mulberry(77));
    for (let n = 61; n <= 400; n += 7) stepwise.ensure(n);
    stepwise.ensure(400);
    expect(stepwise.challenges.slice(0, 400)).toEqual(once.challenges.slice(0, 400));
    // generateChallenges es el mismo flujo cortado.
    expect(generateChallenges(WORDS, SENTENCES, mulberry(77), ARCADE, 150)).toEqual(
      once.challenges.slice(0, 150),
    );
  });

  it('60 s sin agotarse: aunque alguien responda cada 200 ms, siempre tiene el actual y el siguiente', () => {
    // Como lo haría el servidor: antes de cada respuesta asegura la ventana del jugador más adelantado.
    const fastestMs = KIND_RULES.swipe.minMs;
    const answers = Math.ceil(ARCADE.durationMs / fastestMs);
    const stream = createChallengeStream(WORDS, SENTENCES, mulberry(3));
    for (let current = 0; current < answers; current++) {
      stream.ensure(current + ARCADE.lookahead);
      for (let i = current; i < current + ARCADE.lookahead; i++) {
        expect(stream.challenges[i]).toBeDefined();
      }
    }
    expect(stream.challenges.length).toBeGreaterThanOrEqual(answers + ARCADE.lookahead);
    const { maxRun, maxGap } = runsAndGaps(
      stream.challenges.map((c) => c.kind),
      CHALLENGE_KINDS,
    );
    expect(maxGap).toBeLessThanOrEqual(KIND_ROTATION.maxGap);
    for (const kind of CHALLENGE_KINDS) {
      expect(maxRun[kind] ?? 0).toBeLessThanOrEqual(KIND_ROTATION.maxRun[kind]);
    }
  });

  it('sincronización: dos jugadores (o jugador y bot) a distinto ritmo ven exactamente lo mismo en cada índice', () => {
    const stream = createChallengeStream(BIG_WORDS, BIG_SENTENCES, mulberry(12));
    const seenBy = { fast: [] as ArcadeChallenge[], slow: [] as ArcadeChallenge[] };
    // El rápido avanza 5 por cada 1 del lento; el flujo crece a pedido del más adelantado.
    for (let step = 0; step < 60; step++) {
      for (let k = 0; k < 5; k++) seenBy.fast.push(stream.at(seenBy.fast.length));
      seenBy.slow.push(stream.at(seenBy.slow.length));
    }
    expect(seenBy.slow).toEqual(seenBy.fast.slice(0, seenBy.slow.length));
    // Y es el mismo arreglo para los dos: no hay copias que puedan divergir.
    expect(seenBy.fast[10]).toBe(stream.challenges[10]);
  });

  it('sin repeticiones dentro de una partida mientras el banco alcanza', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const challenges = generateChallenges(BIG_WORDS, BIG_SENTENCES, mulberry(seed));
      // 60 desafíos usan ~84 palabras y ~13 frases: con 100 y 30 no se repite ninguna.
      const words = promptWords(challenges);
      expect(new Set(words).size).toBe(words.length);
      const sentences = contentIds(challenges).sentences;
      expect(new Set(sentences).size).toBe(sentences.length);
    }
  });

  it('con un banco chico (10 palabras, 6 frases): parejo y nunca lo mismo en dos desafíos seguidos', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const challenges = generateChallenges(WORDS, SENTENCES, mulberry(seed), ARCADE, 200);
      for (let i = 1; i < challenges.length; i++) {
        const before = new Set(promptWords([challenges[i - 1]!]));
        expect(promptWords([challenges[i]!]).some((w) => before.has(w))).toBe(false);
      }
      const sentences = contentIds(challenges).sentences;
      for (let i = 1; i < sentences.length; i++) expect(sentences[i]).not.toBe(sentences[i - 1]);
      // Todas las palabras salen la misma cantidad de veces, ±1.
      const counts = new Map<string, number>();
      for (const id of promptWords(challenges)) counts.set(id, (counts.get(id) ?? 0) + 1);
      expect(counts.size).toBe(WORDS.length);
      expect(Math.max(...counts.values()) - Math.min(...counts.values())).toBeLessThanOrEqual(1);
    }
  });
});

describe('memoria de contenido reciente (sin base de datos)', () => {
  /** Partida típica de 25 desafíos para `key`, con la memoria; registra lo que vio. */
  function playMatch(memory: RecentContentMemory | null, keys: string[], seed: number) {
    const recent = memory?.recentFor(keys);
    const stream = createChallengeStream(BIG_WORDS, BIG_SENTENCES, mulberry(seed), ARCADE, {
      recent,
    });
    const seen = stream.challenges.slice(0, 25);
    for (const key of keys) memory?.record(key, seen);
    return contentIds(seen);
  }

  const overlap = (a: readonly string[], b: readonly string[]) => {
    const set = new Set(a);
    return b.filter((x) => set.has(x)).length;
  };

  it('partidas seguidas del mismo jugador no repiten contenido si el banco alcanza', () => {
    const memory = new RecentContentMemory();
    let previous = playMatch(memory, ['ana:en'], 1);
    for (let match = 2; match <= 4; match++) {
      const current = playMatch(memory, ['ana:en'], match);
      // 25 desafíos ≈ 35 palabras y 5–6 frases; con 100 y 30, la siguiente partida no repite nada.
      expect(overlap(previous.words, current.words)).toBe(0);
      expect(overlap(previous.sentences, current.sentences)).toBe(0);
      previous = current;
    }
  });

  it('reduce la repetición respecto de no tener memoria', () => {
    let withMemory = 0;
    let without = 0;
    for (let trial = 0; trial < 20; trial++) {
      const memory = new RecentContentMemory();
      const a = playMatch(memory, ['u:en'], trial * 2 + 1);
      const b = playMatch(memory, ['u:en'], trial * 2 + 2);
      withMemory += overlap(a.words, b.words) + overlap(a.sentences, b.sentences);
      const c = playMatch(null, ['u:en'], trial * 2 + 1);
      const d = playMatch(null, ['u:en'], trial * 2 + 2);
      without += overlap(c.words, d.words) + overlap(c.sentences, d.sentences);
    }
    expect(without).toBeGreaterThan(0);
    expect(withMemory).toBeLessThan(without);
  });

  it('en una partida entre dos, se evita lo que vio cualquiera de los dos', () => {
    const memory = new RecentContentMemory();
    const ana = playMatch(memory, ['ana:en'], 1);
    const bo = playMatch(memory, ['bo:en'], 2);
    const together = playMatch(memory, ['ana:en', 'bo:en'], 3);
    // Frases: entre los dos vieron ≤ 12 de 30, así que la partida conjunta no repite ninguna.
    expect(overlap(ana.sentences, together.sentences)).toBe(0);
    expect(overlap(bo.sentences, together.sentences)).toBe(0);
    // Palabras: si no alcanzan las no vistas, vuelven primero las más viejas (las de ana), nunca las
    // más recientes (las de bo).
    expect(overlap(bo.words, together.words)).toBe(0);
  });

  it('nunca excluye: con todo visto, la partida se arma igual (lo más viejo primero)', () => {
    const memory = new RecentContentMemory();
    const matches = Array.from({ length: 10 }, (_, i) => playMatch(memory, ['x:en'], i + 1));
    const recent = memory.recentFor(['x:en']);
    expect(recent.words.size).toBe(BIG_WORDS.length);
    const stream = createChallengeStream(BIG_WORDS, BIG_SENTENCES, mulberry(99), ARCADE, {
      recent,
    });
    expect(stream.challenges).toHaveLength(ARCADE.challengeCount);
    expect(new Set(stream.challenges.map((c) => c.kind)).size).toBe(4);
    // Lo último que vio no vuelve en el arranque de la partida siguiente.
    const first = contentIds(stream.challenges.slice(0, 10)).words;
    expect(overlap(matches.at(-1)!.words, first)).toBe(0);
  });

  it('acotada: por clave y en cantidad de claves', () => {
    const memory = new RecentContentMemory({ words: 10, sentences: 2, keys: 3 });
    const challenges = generateChallenges(BIG_WORDS, BIG_SENTENCES, mulberry(4));
    memory.record('a', challenges);
    const recent = memory.recentFor(['a']);
    expect(recent.words.size).toBe(10);
    expect(recent.sentences.size).toBe(2);
    // Guarda las más recientes.
    const lastWords = promptWords(challenges).slice(-10);
    expect([...recent.words.keys()].sort()).toEqual([...new Set(lastWords)].sort());
    for (const key of ['b', 'c', 'd']) memory.record(key, challenges.slice(0, 1));
    expect(memory.size).toBe(3);
    expect(memory.recentFor(['a']).words.size).toBe(0);
  });
});

describe('calidad de las respuestas', () => {
  it('significados de una traducción: alternativas, aclaraciones y artículos', () => {
    expect(translationKeys('casa / hogar')).toEqual(expect.arrayContaining(['casa', 'hogar']));
    expect(translationKeys('viejo; años')).toEqual(expect.arrayContaining(['viejo', 'años']));
    expect(translationKeys('por favor, informal')).toEqual(['por favor']);
    expect(translationKeys('la mañana')).toEqual(expect.arrayContaining(['mañana']));
    expect(translationKeys('fui / fue (go)')).toEqual(expect.arrayContaining(['fui', 'fue']));
    expect(translationKeys('¿y tú?, informal')).toEqual(['y tú']);
  });

  it('detecta significados compartidos que harían correcta una «mentira» de Swipe', () => {
    expect(translationsOverlap('casa / hogar', 'casa')).toBe(true);
    expect(translationsOverlap('pequeño / chico', 'chico')).toBe(true);
    expect(translationsOverlap('hora / tiempo', 'tiempo')).toBe(true);
    expect(translationsOverlap('short, not tall', 'short, not long')).toBe(true);
    expect(translationsOverlap('mañana', 'la mañana')).toBe(true);
    expect(translationsOverlap('manzana', 'perro')).toBe(false);
    expect(translationsOverlap('nosotros', 'nosotros, informal')).toBe(true);
  });

  it('traducciones descriptivas (gramática) no son un significado', () => {
    for (const t of [
      'negación',
      'auxiliar con he, she, it',
      'no + verbo',
      'auxiliar del pasado',
      'artículo masculino ante s + consonante o z',
      'partícula de pregunta',
      'partícula: ¿y…?',
      'clasificador',
      'clasificador de libros',
    ]) {
      expect(isDescriptiveTranslation(t)).toBe(true);
    }
    for (const t of ['no', 'hola', 'casa / hogar', 'por favor, informal', 'partido', 'artista']) {
      expect(isDescriptiveTranslation(t)).toBe(false);
    }
  });

  // Banco con los casos reales del contenido: significados compartidos y gramática.
  const TRICKY: RushWord[] = [
    ...WORDS,
    word('home', 'home', 'casa / hogar'),
    word('small', 'small', 'pequeño / chico'),
    word('boy', 'boy', 'chico'),
    word('time', 'time', 'hora / tiempo'),
    word('weather', 'weather', 'tiempo'),
    word('low', 'bajo', 'short, not tall'),
    word('brief', 'corto', 'short, not long'),
    word('does', 'does', 'auxiliar con he, she, it'),
    word('dont', "don't", 'no + verbo'),
    word('ma', '吗', 'partícula de pregunta'),
  ];
  const DESCRIPTIVE_IDS = new Set(['does', 'dont', 'ma']);
  const byId = new Map(TRICKY.map((w) => [w.id, w]));
  const byText = new Map(TRICKY.map((w) => [w.text, w]));
  const label = (text: string) => byText.get(text)!.translationEs;

  it('Swipe: la «mentira» nunca comparte un significado con la traducción correcta', () => {
    let lies = 0;
    for (let seed = 1; seed <= 60; seed++) {
      for (const c of generateChallenges(TRICKY, SENTENCES, mulberry(seed), ARCADE, 120)) {
        if (c.kind !== 'swipe' || c.truthful) continue;
        lies++;
        expect(translationsOverlap(c.candidate, c.translation)).toBe(false);
      }
    }
    expect(lies).toBeGreaterThan(500);
  });

  it('Audio y Connect: ninguna opción ni pareja se confunde con otra', () => {
    for (let seed = 1; seed <= 60; seed++) {
      for (const c of generateChallenges(TRICKY, SENTENCES, mulberry(seed), ARCADE, 120)) {
        if (c.kind === 'audio') {
          expect(c.options).toHaveLength(ARCADE.audioOptions);
          for (let i = 0; i < c.options.length; i++) {
            for (let j = i + 1; j < c.options.length; j++) {
              expect(translationsOverlap(c.options[i]!, c.options[j]!)).toBe(false);
            }
          }
        }
        if (c.kind === 'connect') {
          expect(c.left).toHaveLength(ARCADE.connectPairs);
          const labels = c.left.map(label);
          for (let i = 0; i < labels.length; i++) {
            for (let j = i + 1; j < labels.length; j++) {
              expect(translationsOverlap(labels[i]!, labels[j]!)).toBe(false);
            }
          }
          c.wordIds.forEach((id, i) => expect(byId.get(id)!.text).toBe(c.left[i]));
        }
      }
    }
  });

  it('las palabras con traducción descriptiva no entran en ningún microjuego', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const challenges = generateChallenges(TRICKY, SENTENCES, mulberry(seed), ARCADE, 120);
      for (const id of promptWords(challenges)) expect(DESCRIPTIVE_IDS.has(id)).toBe(false);
      for (const c of challenges) {
        const shown =
          c.kind === 'swipe'
            ? [c.candidate]
            : c.kind === 'audio'
              ? c.options
              : c.kind === 'connect'
                ? c.right
                : [];
        for (const text of shown) expect(isDescriptiveTranslation(text)).toBe(false);
      }
    }
  });

  it('sin cuatro significados distintos no hay Audio ni Connect (nunca dos respuestas correctas)', () => {
    // Ocho palabras que significan «casa» cuentan como un solo significado.
    const same = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((x) => word(x, x, 'casa'));
    const three = [...same, word('x', 'x', 'perro'), word('y', 'y', 'gato')];
    expect(availableKinds(three, SENTENCES)).toEqual([]);
    expect(() => generateChallenges(three, SENTENCES, mulberry(1))).toThrow();
    // Con un cuarto significado alcanza para un tablero inequívoco.
    const four = [...three, word('z', 'z', 'sol')];
    expect(availableKinds(four, SENTENCES)).toEqual(['swipe', 'audio', 'connect', 'sentence']);
    for (const c of generateChallenges(four, SENTENCES, mulberry(2), ARCADE, 80)) {
      if (c.kind !== 'connect') continue;
      expect(c.right.filter((t) => t === 'casa')).toHaveLength(1);
    }
  });
});

describe('bots', () => {
  it('nunca responden más rápido que lo que se acepta de una persona', () => {
    const random = mulberry(5);
    for (let i = 0; i < 500; i++) {
      for (const kind of CHALLENGE_KINDS) {
        const move = botArcadeMove(2_400, kind, random);
        expect(move.delayMs).toBeGreaterThanOrEqual(Math.max(KIND_RULES[kind].minMs + 150, 350));
      }
    }
  });

  it('más rating, más aciertos', () => {
    const rate = (rating: number) => {
      const random = mulberry(11);
      let hits = 0;
      for (let i = 0; i < 2_000; i++) if (botArcadeMove(rating, 'audio', random).correct) hits++;
      return hits / 2_000;
    };
    expect(rate(1_600)).toBeGreaterThan(rate(100));
  });
});

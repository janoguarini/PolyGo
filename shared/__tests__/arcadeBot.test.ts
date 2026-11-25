import {
  CHALLENGE_KINDS,
  generateChallenges,
  gradeArcade,
  kindSequence,
  type ArcadeChallenge,
  type ArcadeSentence,
  type ChallengeKind,
} from '../arcade';
import { ARCADE_BOT, ArcadeBotBrain, botArcadeAnswer, botMinDelayMs } from '../arcadeBot';
import { BOT_CONFIG, botSkill } from '../bots';
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

interface Played {
  kind: ChallengeKind;
  correct: boolean;
  delayMs: number;
  afterMiss: boolean;
}

/**
 * Una partida de 60 s del bot solo, con la rotación real: Connect pide cuatro parejas (la última no se
 * puede fallar), los demás se cierran con una respuesta. Devuelve cada respuesta.
 */
function simulateMatch(rating: number, seed: number): Played[] {
  const random = mulberry(seed * 7_919 + rating);
  const brain = new ArcadeBotBrain(rating, random);
  const played: Played[] = [];
  let t = 0;
  let afterMiss = false;
  for (const kind of kindSequence(CHALLENGE_KINDS, 300, mulberry(seed))) {
    const pairs = kind === 'connect' ? 4 : 1;
    let solved = 0;
    let attempts = 0;
    while (solved < pairs) {
      const plan = brain.plan(kind, kind === 'connect' && attempts > 0);
      attempts++;
      t += plan.delayMs;
      if (t >= 60_000) return played;
      const correct = kind === 'connect' && solved === pairs - 1 ? true : plan.correct;
      brain.observe(correct);
      played.push({ kind, correct, delayMs: plan.delayMs, afterMiss });
      afterMiss = !correct;
      if (correct) solved++;
      else if (kind !== 'connect') solved = pairs;
    }
  }
  return played;
}

const RATINGS = [100, 400, 700, 1_000, 1_600, 2_200];
const MATCHES = 600;
const byRating = new Map(
  RATINGS.map((r) => [r, Array.from({ length: MATCHES }, (_, i) => simulateMatch(r, i + 1))]),
);
const flat = (r: number) => byRating.get(r)!.flat();
const rate = (xs: readonly Played[]) => xs.filter((x) => x.correct).length / xs.length;
const mean = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

describe('bot de Word Rush: dificultad según el rating', () => {
  it('en promedio acierta lo que corresponde a su rating (no le da ventaja ni lo regala)', () => {
    for (const r of RATINGS) {
      const tolerance = r <= 100 ? 0.04 : 0.025;
      expect(Math.abs(rate(flat(r)) - botSkill(r).accuracy)).toBeLessThanOrEqual(tolerance);
    }
  });

  it('más rating: más aciertos, más rápido y más respuestas por partida, sin saltos bruscos', () => {
    for (let i = 1; i < RATINGS.length; i++) {
      const lo = RATINGS[i - 1]!;
      const hi = RATINGS[i]!;
      expect(rate(flat(hi))).toBeGreaterThan(rate(flat(lo)));
      expect(mean(flat(hi).map((x) => x.delayMs))).toBeLessThan(
        mean(flat(lo).map((x) => x.delayMs)),
      );
      expect(flat(hi).length).toBeGreaterThan(flat(lo).length);
    }
    // Dos ratings vecinos (± 40, el margen con que se elige el bot) juegan casi igual.
    const near = (r: number) =>
      rate(Array.from({ length: 300 }, (_, i) => simulateMatch(r, i + 1)).flat());
    expect(Math.abs(near(1_000) - near(1_040))).toBeLessThan(0.02);
  });

  it('cada formato tiene su dificultad: Sentence Rush le cuesta más que Swipe', () => {
    for (const r of [400, 1_000, 1_600]) {
      const kindRate = (k: ChallengeKind) => rate(flat(r).filter((x) => x.kind === k));
      expect(kindRate('swipe')).toBeGreaterThan(kindRate('sentence'));
      expect(kindRate('audio')).toBeGreaterThan(kindRate('sentence'));
    }
  });
});

describe('bot de Word Rush: comportamiento humano', () => {
  it('rachas: después de acertar acierta más seguido que después de fallar', () => {
    for (const r of [400, 700, 1_000]) {
      const pairs = byRating.get(r)!.flatMap((m) => m.slice(1).map((x, i) => [m[i]!, x] as const));
      const afterHit = pairs.filter(([a]) => a.correct).map(([, b]) => b);
      const afterMiss = pairs.filter(([a]) => !a.correct).map(([, b]) => b);
      expect(rate(afterHit) - rate(afterMiss)).toBeGreaterThan(0.08);
    }
  });

  it('forma del día: unas partidas le salen mejor que otras (más que el puro azar)', () => {
    for (const r of [400, 1_000]) {
      const perMatch = byRating.get(r)!.map(rate);
      const m = mean(perMatch);
      const sd = Math.sqrt(mean(perMatch.map((x) => (x - m) ** 2)));
      const n = mean(byRating.get(r)!.map((x) => x.length));
      const binomialSd = Math.sqrt((m * (1 - m)) / n);
      expect(sd).toBeGreaterThan(binomialSd * 1.15);
    }
  });

  it('tiempos variables, nunca más rápido de lo que se acepta de una persona', () => {
    for (const r of RATINGS) {
      const all = flat(r);
      for (const x of all) {
        expect(x.delayMs).toBeGreaterThanOrEqual(botMinDelayMs(x.kind));
        expect(x.delayMs).toBeLessThanOrEqual(BOT_CONFIG.maxMs);
      }
      const delays = all.filter((x) => x.kind === 'audio').map((x) => x.delayMs);
      const m = mean(delays);
      const cv = Math.sqrt(mean(delays.map((d) => (d - m) ** 2))) / m;
      expect(cv).toBeGreaterThan(0.25);
      // No responde siempre en el mismo intervalo: ningún tiempo se repite de forma notable y casi
      // nunca tarda exactamente lo mismo dos veces seguidas.
      const counts = new Map<number, number>();
      for (const d of delays) counts.set(d, (counts.get(d) ?? 0) + 1);
      expect(Math.max(...counts.values())).toBeLessThanOrEqual(Math.max(3, delays.length * 0.01));
      const sameInARow = all.slice(1).filter((x, i) => x.delayMs === all[i]!.delayMs).length;
      expect(sameInARow).toBeLessThan(all.length * 0.01);
    }
  });

  it('los errores suelen tardar más y después de un error va más lento', () => {
    for (const r of [400, 1_000]) {
      const audio = flat(r).filter((x) => x.kind === 'audio');
      const hits = audio.filter((x) => x.correct).map((x) => x.delayMs);
      const misses = audio.filter((x) => !x.correct).map((x) => x.delayMs);
      expect(mean(misses)).toBeGreaterThan(mean(hits));
      const afterMiss = audio.filter((x) => x.afterMiss && x.correct).map((x) => x.delayMs);
      const afterHit = audio.filter((x) => !x.afterMiss && x.correct).map((x) => x.delayMs);
      expect(mean(afterMiss)).toBeGreaterThan(mean(afterHit));
    }
  });

  it('paga la demora de feedback entre desafíos (menor entre parejas de Connect), no en el primero', () => {
    const steady = {
      ...ARCADE_BOT,
      formLogitSigma: 0,
      formTimeSigma: 0,
      timeSigma: 0,
      distraction: { chance: 0, minMs: 0, maxMs: 0 },
      missTimeFactor: 1,
      rushedMissChance: 0,
      postErrorFactor: 1,
    };
    const brain = new ArcadeBotBrain(1_000, mulberry(1), steady);
    const thinking = botSkill(1_000).meanMs;
    const first = brain.plan('audio');
    expect(first.delayMs).toBe(Math.round(thinking * 0.9));
    brain.observe(true);
    for (let i = 0; i < 50; i++) {
      const next = brain.plan('audio');
      const feedback = next.delayMs - Math.round(thinking * 0.9);
      expect(feedback).toBeGreaterThanOrEqual(ARCADE_BOT.feedbackMs.min - 1);
      expect(feedback).toBeLessThanOrEqual(ARCADE_BOT.feedbackMs.max + 1);
      const pair = brain.plan('connect', true);
      const pairFeedback = pair.delayMs - Math.round(thinking * 0.5);
      expect(pairFeedback).toBeLessThanOrEqual(ARCADE_BOT.pairFeedbackMs.max + 1);
      brain.observe(true);
    }
  });
});

// ---------------------------------------------------------------------------------------------
// Respuestas válidas

const word = (id: string, text: string, translationEs: string): RushWord => ({
  id,
  text,
  translationEs,
  level: 'A1',
});
const WORDS: RushWord[] = [
  ['apple', 'manzana'],
  ['house', 'casa'],
  ['dog', 'perro'],
  ['water', 'agua'],
  ['cat', 'gato'],
  ['book', 'libro'],
  ['sun', 'sol'],
  ['bread', 'pan'],
  ['milk', 'leche'],
  ['car', 'auto'],
].map(([t, tr]) => word(t!, t!, tr!));

const sentence = (id: string, tokens: string[], answer: string, accepted: string[] = []) =>
  ({
    id,
    tokens,
    answer,
    acceptedAnswers: accepted,
    translation: id,
    unitId: 'a1-u01',
  }) satisfies ArcadeSentence;

const SENTENCES: ArcadeSentence[] = [
  sentence('s1', ['I', 'went', 'home'], 'I went home.'),
  sentence('s2', ['an', 'apple', 'a', 'day'], 'An apple a day.'),
  // Bloques repetidos: invertirla da la misma frase (el bot de antes «fallaba» acertando).
  sentence('s3', ['no', 'sé', 'no'], 'no sé no'),
  sentence('s4', ['Yesterday', 'I', 'went', 'home'], 'Yesterday I went home.', [
    'I went home yesterday.',
  ]),
  sentence('s5', ['She', 'is', 'a', 'student'], 'She is a student.'),
  sentence('s6', ['We', 'like', 'green', 'tea'], 'We like green tea.'),
];

describe('bot de Word Rush: siempre responde algo válido (nunca traba la partida)', () => {
  const challenges = generateChallenges(WORDS, SENTENCES, mulberry(4), undefined, 300);

  /** Juega cada desafío completo pidiendo acertar o fallar y verifica con el corrector del servidor. */
  function playAll(wantCorrect: boolean): { hits: number; misses: number } {
    let misses = 0;
    let hits = 0;
    for (const c of challenges) {
      const solved = new Map<number, number>();
      for (let guard = 0; guard < 20; guard++) {
        const move = botArcadeAnswer(c, solved, wantCorrect, mulberry(c.index + guard));
        expect(move).not.toBeNull();
        const outcome = gradeArcade(c, move!.answer, new Set(solved.keys()));
        expect(outcome.valid).toBe(true);
        if (!outcome.valid) throw new Error(`respuesta inválida del bot en el desafío ${c.index}`);
        expect(outcome.correct).toBe(move!.correct);
        if (outcome.correct) hits++;
        else misses++;
        if (c.kind === 'connect') {
          if (outcome.correct && outcome.pair) solved.set(outcome.pair[0], outcome.pair[1]);
          if (outcome.done) break;
          // Fallando a propósito el tablero no se cierra: alcanza con verificar unas parejas.
          if (!wantCorrect && guard > 3) break;
        } else break;
      }
    }
    return { hits, misses };
  }

  it('pidiendo acertar, acierta siempre (también con bloques repetidos o variantes)', () => {
    expect(playAll(true).misses).toBe(0);
  });

  it('pidiendo fallar, falla (salvo cuando no existe un error posible)', () => {
    const { hits, misses } = playAll(false);
    expect(misses).toBeGreaterThan(hits * 5);
    // Frase con bloques repetidos: hay un orden equivocado y lo encuentra.
    const s3 = challenges.find(
      (c): c is Extract<ArcadeChallenge, { kind: 'sentence' }> =>
        c.kind === 'sentence' && c.sentenceId === 's3',
    )!;
    const wrong = botArcadeAnswer(s3, new Map(), false, mulberry(1))!;
    expect(wrong.correct).toBe(false);
    expect(gradeArcade(s3, wrong.answer)).toMatchObject({ valid: true, correct: false });
  });

  it('última pareja de Connect: no hay error posible, acierta', () => {
    const board = challenges.find(
      (c): c is Extract<ArcadeChallenge, { kind: 'connect' }> => c.kind === 'connect',
    )!;
    const solved = new Map<number, number>();
    for (let i = 0; i < 3; i++) solved.set(i, board.solution[i]!);
    const move = botArcadeAnswer(board, solved, false, mulberry(2))!;
    expect(move.correct).toBe(true);
    expect(gradeArcade(board, move.answer, new Set(solved.keys()))).toMatchObject({
      valid: true,
      correct: true,
      done: true,
    });
  });

  it('una frase rota (los bloques no forman la respuesta) no tiene respuesta correcta', () => {
    const broken: ArcadeChallenge = {
      index: 0,
      kind: 'sentence',
      sentenceId: 'x',
      tokens: ['a', 'b', 'c'],
      translation: 'x',
      answers: ['totally different'],
    };
    expect(botArcadeAnswer(broken, new Map(), true, mulberry(3))).toBeNull();
    // Fallar sí puede: cualquier orden es válido en forma y equivocado.
    const wrong = botArcadeAnswer(broken, new Map(), false, mulberry(3));
    expect(wrong?.correct ?? false).toBe(false);
  });
});

/**
 * Ranked Arcade (protocolo 3): reglas puras de la partida de 60 s con cuatro microjuegos.
 * Las usa el servidor para decidir (server/src/arcadeBattle.ts) y la app para mostrar. Diseño, fórmula
 * y ejemplos: docs/RANKED_ARCADE.md. Tests: shared/__tests__/arcade.test.ts.
 *
 * Todo es determinista dado `random` y trabaja con enteros: el servidor es la única autoridad sobre
 * tiempo, corrección, combo, Frenesí y puntos; el cliente sólo dice qué hizo en qué desafío.
 */

import { verdictForText } from './answers';
import { BOT_CONFIG, botSkill, type BotSkill } from './bots';
import { rushLabel, rushLevels, wordLevel, type RushWord } from './wordRush';

// ---------------------------------------------------------------------------------------------
// Reglas

export interface ArcadeRules {
  durationMs: number;
  frenzyMs: number;
  frenzyMultiplier: number;
  countdownMs: number;
  readyTimeoutMs: number;
  reconnectGraceMs: number;
  challengeCount: number;
  lookahead: number;
  connectPairs: number;
  audioOptions: number;
  sentenceTokens: { min: number; max: number };
  minSentences: number;
  minWords: number;
  audioReplays: number;
}

export const ARCADE: Readonly<ArcadeRules> = {
  /** Juego efectivo. La presentación (rival + cuenta regresiva de 3 s) va antes y no descuenta. */
  durationMs: 60_000,
  /** Los últimos 15 s: puntos ×2. */
  frenzyMs: 15_000,
  frenzyMultiplier: 2,
  countdownMs: 3_000,
  readyTimeoutMs: 10_000,
  reconnectGraceMs: 15_000,
  /** Más desafíos de los que alguien puede resolver en 60 s: el tiempo es el límite real. */
  challengeCount: 60,
  /** Desafíos que el cliente tiene por adelantado (el actual y el siguiente): cero espera entre uno y otro. */
  lookahead: 2,
  /** Parejas por tablero de Connect. */
  connectPairs: 4,
  /** Opciones de Audio Blitz. */
  audioOptions: 4,
  /** Frases de Sentence Rush: entre 3 y 6 bloques (cortas, de un vistazo). */
  sentenceTokens: { min: 3, max: 6 },
  /** Mínimo de frases y palabras para incluir un microjuego en la rotación de un curso. */
  minSentences: 6,
  minWords: 8,
  /** Repeticiones del audio permitidas además de la primera reproducción (sólo en el cliente). */
  audioReplays: 2,
};

export const CHALLENGE_KINDS = ['swipe', 'connect', 'sentence', 'audio'] as const;
export type ChallengeKind = (typeof CHALLENGE_KINDS)[number];

/**
 * Puntos base de un acierto y ventana del bonus de velocidad, por microjuego. Calibrados para que un
 * jugador que conoce la respuesta haga ~40 puntos base por segundo en cualquiera de los cuatro
 * (docs/RANKED_ARCADE.md §Equilibrio): Swipe es rápido pero vale poco; Sentence es lento y vale más.
 * En Connect cada pareja es un acierto.
 *
 * minMs: respuestas más rápidas que esto no son humanas (tocar sin leer): cuentan como fallo.
 */
export const KIND_RULES: Record<
  ChallengeKind,
  { base: number; speedWindowMs: number; minMs: number }
> = {
  swipe: { base: 50, speedWindowMs: 2_000, minMs: 200 },
  connect: { base: 50, speedWindowMs: 2_500, minMs: 0 },
  sentence: { base: 200, speedWindowMs: 8_000, minMs: 0 },
  audio: { base: 100, speedWindowMs: 4_000, minMs: 0 },
};

/** El bonus de velocidad es como mucho un 25 % de la base: rápido suma, pero no desproporciona. */
export const SPEED_BONUS_PERCENT = 25;

/** Combo: aciertos seguidos (contando el actual) → multiplicador. */
export const COMBO_TIERS: readonly { from: number; multiplier: number }[] = [
  { from: 1, multiplier: 1 },
  { from: 3, multiplier: 2 },
  { from: 5, multiplier: 3 },
  { from: 8, multiplier: 4 },
];

export function comboMultiplier(combo: number): number {
  let multiplier = 1;
  for (const tier of COMBO_TIERS) if (combo >= tier.from) multiplier = tier.multiplier;
  return multiplier;
}

/** Si un instante del servidor cae en Frenesí (los últimos `frenzyMs` antes de `endsAt`). */
export function isFrenzy(now: number, endsAt: number | null, rules: ArcadeRules = ARCADE): boolean {
  return endsAt !== null && now >= endsAt - rules.frenzyMs && now < endsAt;
}

export interface ArcadeScoreInput {
  kind: ChallengeKind;
  correct: boolean;
  /** Ms desde que el desafío (o, en Connect, la pareja anterior) quedó activo, con el reloj del servidor. */
  elapsedMs: number;
  /** Combo ANTES de esta respuesta. */
  comboBefore: number;
  frenzy: boolean;
}

export interface ArcadeScore {
  correct: boolean;
  points: number;
  /** Combo después de la respuesta (0 si falló). */
  combo: number;
  multiplier: number;
  /** Bonus de velocidad incluido en `points` antes de multiplicar. */
  speedBonus: number;
  /** true si se descartó por demasiado rápida (cuenta como fallo). */
  tooFast: boolean;
}

/**
 * Puntos de una respuesta, siempre enteros y en este orden:
 *   1. base del microjuego + bonus de velocidad (entero, ≤ 25 % de la base)
 *   2. × multiplicador de combo (1–4, según el combo que incluye este acierto)
 *   3. × 2 si es Frenesí
 * Fallo: 0 puntos y el combo vuelve a 0. Nunca hay puntos negativos.
 */
export function arcadeScore(input: ArcadeScoreInput): ArcadeScore {
  const rule = KIND_RULES[input.kind];
  const elapsed = Math.max(0, Math.floor(input.elapsedMs));
  const tooFast = input.correct && elapsed < rule.minMs;
  if (!input.correct || tooFast) {
    return { correct: false, points: 0, combo: 0, multiplier: 1, speedBonus: 0, tooFast };
  }
  const remaining = Math.max(0, rule.speedWindowMs - elapsed);
  const speedBonus = Math.floor(
    (rule.base * SPEED_BONUS_PERCENT * remaining) / (100 * rule.speedWindowMs),
  );
  const combo = Math.max(0, input.comboBefore) + 1;
  const multiplier = comboMultiplier(combo);
  const frenzy = input.frenzy ? ARCADE.frenzyMultiplier : 1;
  return {
    correct: true,
    points: (rule.base + speedBonus) * multiplier * frenzy,
    combo,
    multiplier,
    speedBonus,
    tooFast: false,
  };
}

/** Tope teórico de una respuesta (para validar en tests y documentar). */
export const MAX_ARCADE_POINTS = Math.max(
  ...CHALLENGE_KINDS.map(
    (k) =>
      Math.floor(KIND_RULES[k].base * (1 + SPEED_BONUS_PERCENT / 100)) *
      COMBO_TIERS[COMBO_TIERS.length - 1]!.multiplier *
      ARCADE.frenzyMultiplier,
  ),
);

// ---------------------------------------------------------------------------------------------
// Tug of War

/**
 * Posición del indicador de la barra, de −1 (todo del lado del rival) a +1 (todo del tuyo).
 * La escala crece con el total de la partida: 100 puntos de ventaja al principio se notan, al final
 * casi no. Nunca llega al extremo (|x| ≤ 0,92) para que siempre se vea que se puede dar vuelta.
 */
export function tugPosition(myScore: number, opponentScore: number): number {
  const diff = myScore - opponentScore;
  if (diff === 0) return 0;
  const scale = 400 + 0.2 * (Math.max(0, myScore) + Math.max(0, opponentScore));
  const x = diff / (Math.abs(diff) + scale);
  return Math.max(-0.92, Math.min(0.92, x * 1.3));
}

// ---------------------------------------------------------------------------------------------
// Contenido

/** Frase de Sentence Rush: un ejercicio order_words publicado (mismo corrector que las lecciones). */
export interface ArcadeSentence {
  id: string;
  /** Bloques en el orden correcto (payload.tokens). */
  tokens: string[];
  /** Respuesta canónica y variantes aceptadas (exercises.answer / accepted_answers). */
  answer: string;
  acceptedAnswers: string[];
  /** Traducción al idioma de apoyo (payload.translation): la consigna. */
  translation: string;
  /** Unidad (curriculum_units.id): de ahí sale el nivel. */
  unitId: string | null;
}

/**
 * Conectores que permiten reordenar la frase («Marco es italiano y Claire es francesa» admite los dos
 * órdenes): esas frases no entran en Sentence Rush salvo que tengan variantes cargadas. Por idioma.
 */
const REORDERABLE: Record<string, readonly string[]> = {
  en: ['and', 'or', 'but'],
  es: ['y', 'e', 'o', 'u', 'pero'],
  fr: ['et', 'ou', 'mais'],
  it: ['e', 'ed', 'o', 'ma'],
  pt: ['e', 'ou', 'mas'],
  zh: ['和', '跟', '或者', '还是', '但是', '可是'],
};

/** Frases aptas para Sentence Rush en un curso y nivel. */
export function sentencePool(
  sentences: readonly ArcadeSentence[],
  languageCode: string,
  rating: number,
  rules: ArcadeRules = ARCADE,
): ArcadeSentence[] {
  const levels = rushLevels(rating);
  const connectors = new Set(REORDERABLE[languageCode] ?? []);
  const seen = new Set<string>();
  return sentences.filter((s) => {
    const level = wordLevel(s.unitId);
    if (level === null || !levels.includes(level)) return false;
    if (s.tokens.length < rules.sentenceTokens.min || s.tokens.length > rules.sentenceTokens.max)
      return false;
    if (!s.answer.trim() || !s.translation.trim()) return false;
    // Los bloques tienen que formar la respuesta: si no, el contenido está roto y no se usa.
    if (!verdictForText(s.tokens.join(' '), [s.answer], false).correct) return false;
    const hasConnector = s.tokens.some((t) => connectors.has(t.toLowerCase()));
    if (hasConnector && s.acceptedAnswers.length === 0) return false;
    const key = s.tokens.join(' ').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Palabras usables: texto y traducción no vacíos, sin repetir texto (lo mismo que Word Rush). */
function usableWords(words: readonly RushWord[]): RushWord[] {
  const seen = new Set<string>();
  const result: RushWord[] = [];
  for (const w of words) {
    const translation = rushLabel(w.translationEs);
    const key = norm(w.text);
    if (!key || !norm(translation) || seen.has(key)) continue;
    seen.add(key);
    result.push({ ...w, translationEs: translation });
  }
  return result;
}

// ---------------------------------------------------------------------------------------------
// Desafíos

/** Desafío completo, sólo en el servidor (tiene la respuesta). */
export type ArcadeChallenge =
  | {
      index: number;
      kind: 'swipe';
      wordId: string;
      /** Palabra en el idioma que se aprende. */
      prompt: string;
      /** Traducción propuesta (idioma de apoyo). */
      candidate: string;
      /** Si la traducción propuesta es la correcta. */
      truthful: boolean;
      /** La traducción correcta (se revela al responder). */
      translation: string;
    }
  | {
      index: number;
      kind: 'audio';
      wordId: string;
      /** Lo que se escucha (idioma que se aprende). */
      prompt: string;
      options: string[];
      correctOption: number;
    }
  | {
      index: number;
      kind: 'connect';
      /** Palabras (idioma que se aprende), en orden mezclado. */
      left: string[];
      /** Traducciones, en otro orden mezclado. */
      right: string[];
      /** solution[i] = índice en `right` de la traducción de left[i]. */
      solution: number[];
    }
  | {
      index: number;
      kind: 'sentence';
      sentenceId: string;
      /** Bloques mezclados. */
      tokens: string[];
      translation: string;
      answers: string[];
    };

/** Lo que el cliente ve de un desafío: nunca la respuesta. */
export type ChallengeView =
  | { index: number; kind: 'swipe'; prompt: string; candidate: string }
  | { index: number; kind: 'audio'; prompt: string; options: string[] }
  | {
      index: number;
      kind: 'connect';
      left: string[];
      right: string[];
      /** Parejas ya resueltas por este jugador [izquierda, derecha] (para retomar tras reconectar). */
      solved: [number, number][];
    }
  | { index: number; kind: 'sentence'; tokens: string[]; translation: string };

/** Lo que manda el cliente. Cualquier otro campo se ignora. */
export type ArcadeAnswer =
  | { kind: 'swipe'; accept: boolean }
  | { kind: 'audio'; option: number }
  | { kind: 'connect'; left: number; right: number }
  | { kind: 'sentence'; order: number[] };

export interface ArcadeAnswerResult {
  challengeIndex: number;
  kind: ChallengeKind;
  correct: boolean;
  points: number;
  score: number;
  combo: number;
  multiplier: number;
  frenzy: boolean;
  /** true = el desafío terminó y el jugador pasa al siguiente (en Connect, al limpiar el tablero). */
  done: boolean;
  /** Respuesta revelada al responder: traducción (swipe), opción correcta (audio), frase (sentence). */
  solution?: string;
  correctOption?: number;
  /** Connect: la pareja intentada. */
  pair?: [number, number];
  /** true si se descartó por demasiado rápida. */
  tooFast?: boolean;
}

/** Estado propio de la partida arcade en la foto de reconexión. */
export interface ArcadeSnapshot {
  /** Desafío actual del jugador y el siguiente. */
  challenges: ChallengeView[];
  current: number;
  combo: number;
  bestCombo: number;
  /** Instante del servidor en que empieza el Frenesí (null antes de empezar). */
  frenzyAt: number | null;
  durationMs: number;
}

/** Estadísticas que se muestran al final (no se guardan: la base guarda puntos, aciertos y respuestas). */
export interface ArcadeStats {
  bestCombo: number;
  frenzyPoints: number;
}

/**
 * Orden de los microjuegos: rondas con los formatos disponibles en orden mezclado (Swipe va de a dos
 * tarjetas porque es el más corto). Una ronda nunca empieza con el formato con que terminó la
 * anterior: como mucho hay dos Swipe seguidos y ningún otro formato se repite.
 */
export function kindSequence(
  available: readonly ChallengeKind[],
  count: number,
  random: () => number,
): ChallengeKind[] {
  const kinds = CHALLENGE_KINDS.filter((k) => available.includes(k));
  if (kinds.length === 0) throw new Error('arcade: ningún microjuego disponible');
  const sequence: ChallengeKind[] = [];
  while (sequence.length < count) {
    let round = shuffle(kinds, random);
    const last = sequence[sequence.length - 1];
    if (round.length > 1 && round[0] === last) round = [...round.slice(1), round[0]!];
    for (const kind of round) {
      sequence.push(kind);
      if (kind === 'swipe' && kinds.length > 1) sequence.push('swipe');
    }
  }
  return sequence.slice(0, count);
}

/** Qué microjuegos tienen contenido suficiente en esta partida. Sin contenido, no se inventa: se excluye. */
export function availableKinds(
  words: readonly RushWord[],
  sentences: readonly ArcadeSentence[],
  rules: ArcadeRules = ARCADE,
): ChallengeKind[] {
  const usable = usableWords(words);
  if (usable.length < rules.audioOptions) return [];
  const kinds: ChallengeKind[] = ['swipe', 'audio'];
  if (usable.length >= rules.minWords) kinds.push('connect');
  if (sentences.length >= rules.minSentences) kinds.push('sentence');
  return kinds;
}

/**
 * Secuencia de desafíos de una partida: la misma para los dos jugadores. `words` ya filtradas por
 * nivel (rushPool) y `sentences` por sentencePool. `random` en [0, 1); el servidor usa una fuente
 * criptográfica.
 */
export function generateChallenges(
  words: readonly RushWord[],
  sentences: readonly ArcadeSentence[],
  random: () => number,
  rules: ArcadeRules = ARCADE,
  count: number = rules.challengeCount,
): ArcadeChallenge[] {
  const usable = usableWords(words);
  const kinds = availableKinds(usable, sentences, rules);
  if (kinds.length === 0) {
    throw new Error(`arcade: hacen falta al menos ${rules.audioOptions} palabras distintas`);
  }
  const wordDeck = cycler(usable, random, (w) => w.id);
  const sentenceDeck = cycler(sentences, random, (s) => s.id);

  return kindSequence(kinds, count, random).map((kind, index): ArcadeChallenge => {
    switch (kind) {
      case 'swipe': {
        const word = wordDeck.next();
        const others = distinctFrom(usable, [word]);
        const truthful = others.length === 0 || random() < 0.5;
        const lie = others.length > 0 ? others[Math.floor(random() * others.length)]! : word;
        return {
          index,
          kind,
          wordId: word.id,
          prompt: word.text,
          candidate: truthful ? word.translationEs : lie.translationEs,
          truthful,
          translation: word.translationEs,
        };
      }
      case 'audio': {
        const word = wordDeck.next();
        const distractors = uniqueBy(shuffle(distinctFrom(usable, [word]), random), (w) =>
          norm(w.translationEs),
        )
          .slice(0, rules.audioOptions - 1)
          .map((w) => w.translationEs);
        const options = shuffle([word.translationEs, ...distractors], random);
        return {
          index,
          kind,
          wordId: word.id,
          prompt: word.text,
          options,
          correctOption: options.indexOf(word.translationEs),
        };
      }
      case 'connect': {
        // Cuatro palabras sin texto ni traducción compartidos: cada pareja tiene una sola solución.
        const board: RushWord[] = [];
        for (
          let tries = 0;
          board.length < rules.connectPairs && tries < usable.length * 3;
          tries++
        ) {
          const candidate = wordDeck.next();
          if (distinctFrom([candidate], board).length === 1) board.push(candidate);
        }
        const left = shuffle(board, random);
        const right = shuffle(board, random);
        return {
          index,
          kind,
          left: left.map((w) => w.text),
          right: right.map((w) => w.translationEs),
          solution: left.map((w) => right.indexOf(w)),
        };
      }
      case 'sentence': {
        const sentence = sentenceDeck.next();
        let tokens = shuffle(sentence.tokens, random);
        // Que no aparezca ya armada (si hay otro orden posible).
        for (let i = 0; i < 4 && tokens.join(' ') === sentence.tokens.join(' '); i++) {
          tokens = shuffle(sentence.tokens, random);
        }
        return {
          index,
          kind,
          sentenceId: sentence.id,
          tokens,
          translation: sentence.translation,
          answers: [sentence.answer, ...sentence.acceptedAnswers],
        };
      }
    }
  });
}

/** Vista para el cliente: sin respuesta. `solved` sólo en Connect. */
export function toChallengeView(
  challenge: ArcadeChallenge,
  solved: readonly [number, number][] = [],
): ChallengeView {
  switch (challenge.kind) {
    case 'swipe':
      return {
        index: challenge.index,
        kind: 'swipe',
        prompt: challenge.prompt,
        candidate: challenge.candidate,
      };
    case 'audio':
      return {
        index: challenge.index,
        kind: 'audio',
        prompt: challenge.prompt,
        options: [...challenge.options],
      };
    case 'connect':
      return {
        index: challenge.index,
        kind: 'connect',
        left: [...challenge.left],
        right: [...challenge.right],
        solved: solved.map(([l, r]) => [l, r]),
      };
    case 'sentence':
      return {
        index: challenge.index,
        kind: 'sentence',
        tokens: [...challenge.tokens],
        translation: challenge.translation,
      };
  }
}

/** Progreso del jugador en un tablero de Connect: índices izquierdos ya resueltos. */
export type ConnectProgress = ReadonlySet<number>;

export type GradeOutcome =
  | { valid: false }
  | {
      valid: true;
      correct: boolean;
      /** El desafío terminó (en Connect, sólo al resolver la última pareja). */
      done: boolean;
      solution?: string;
      correctOption?: number;
      pair?: [number, number];
    };

/**
 * Corrige una respuesta del cliente. `valid: false` = forma inválida (otro formato, índices fuera de
 * rango, pareja ya resuelta, orden que no es una permutación): se rechaza sin puntuar ni romper combo.
 */
export function gradeArcade(
  challenge: ArcadeChallenge,
  raw: unknown,
  connectSolved: ConnectProgress = new Set(),
): GradeOutcome {
  const answer = (raw ?? {}) as Record<string, unknown>;
  if (answer.kind !== challenge.kind) return { valid: false };
  switch (challenge.kind) {
    case 'swipe': {
      if (typeof answer.accept !== 'boolean') return { valid: false };
      return {
        valid: true,
        correct: answer.accept === challenge.truthful,
        done: true,
        solution: challenge.translation,
      };
    }
    case 'audio': {
      const option = answer.option;
      if (!isIndex(option, challenge.options.length)) return { valid: false };
      return {
        valid: true,
        correct: option === challenge.correctOption,
        done: true,
        correctOption: challenge.correctOption,
        solution: challenge.prompt,
      };
    }
    case 'connect': {
      const { left, right } = answer;
      if (!isIndex(left, challenge.left.length) || !isIndex(right, challenge.right.length))
        return { valid: false };
      if (connectSolved.has(left)) return { valid: false };
      // La derecha ya usada por otra pareja resuelta tampoco vale.
      for (const l of connectSolved) if (challenge.solution[l] === right) return { valid: false };
      const correct = challenge.solution[left] === right;
      const solvedAfter = connectSolved.size + (correct ? 1 : 0);
      return {
        valid: true,
        correct,
        done: solvedAfter === challenge.left.length,
        pair: [left, right],
      };
    }
    case 'sentence': {
      const order = answer.order;
      if (!Array.isArray(order) || order.length !== challenge.tokens.length)
        return { valid: false };
      const used = new Set<number>();
      for (const i of order) {
        if (!isIndex(i, challenge.tokens.length) || used.has(i)) return { valid: false };
        used.add(i);
      }
      const built = (order as number[]).map((i) => challenge.tokens[i]!).join(' ');
      return {
        valid: true,
        correct: verdictForText(built, challenge.answers, false).correct,
        done: true,
        solution: challenge.answers[0],
      };
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Bots

/**
 * Tiempo de un bot por microjuego, relativo a su tiempo medio de Word Rush (botMove): Swipe es la
 * mitad, una pareja de Connect también, una frase lleva más del doble.
 */
export const BOT_KIND_FACTOR: Record<ChallengeKind, number> = {
  swipe: 0.5,
  connect: 0.5,
  audio: 0.9,
  sentence: 2.2,
};

/** Qué hace el bot con el desafío (o la pareja) actual: si acierta y cuánto tarda. */
export function botArcadeMove(
  rating: number,
  kind: ChallengeKind,
  random: () => number,
): { correct: boolean; delayMs: number } {
  const skill: BotSkill = botSkill(rating);
  const correct = random() < skill.accuracy;
  const u = Math.max(random(), 1e-9);
  const v = random();
  const gaussian = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  const delay = skill.meanMs * BOT_KIND_FACTOR[kind] * Math.exp(BOT_CONFIG.timeSpread * gaussian);
  // Nunca más rápido que lo que se acepta de una persona.
  const min = Math.max(KIND_RULES[kind].minMs + 150, 350);
  return { correct, delayMs: Math.round(Math.min(BOT_CONFIG.maxMs, Math.max(min, delay))) };
}

// ---------------------------------------------------------------------------------------------
// Auxiliares

function norm(value: string): string {
  return value.trim().toLowerCase();
}

function isIndex(value: unknown, length: number): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) < length;
}

/** Palabras que no comparten texto ni traducción con ninguna de `taken` (sin ambigüedad). */
function distinctFrom(words: readonly RushWord[], taken: readonly RushWord[]): RushWord[] {
  return words.filter((w) =>
    taken.every(
      (t) =>
        w.id !== t.id &&
        norm(w.text) !== norm(t.text) &&
        norm(w.translationEs) !== norm(t.translationEs),
    ),
  );
}

function uniqueBy<T>(items: readonly T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Mazo que se rearma mezclado al agotarse, sin repetir el mismo elemento dos veces seguidas. */
function cycler<T>(items: readonly T[], random: () => number, id: (item: T) => string) {
  let deck: T[] = [];
  let previous: string | null = null;
  return {
    next(): T {
      if (items.length === 0) throw new Error('arcade: mazo vacío');
      if (deck.length === 0) deck = shuffle(items, random);
      if (deck.length > 1 && id(deck[0]!) === previous) deck.push(deck.shift()!);
      const item = deck.shift()!;
      previous = id(item);
      return item;
    },
  };
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

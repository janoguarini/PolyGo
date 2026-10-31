/**
 * Reglas puras de Word Rush: preguntas, puntuación y resultado.
 * Las usa el servidor para decidir y la app para explicar las reglas. Tests: shared/__tests__/wordRush.test.ts.
 */

import { WORD_RUSH, type QuestionKind, type QuestionView } from './protocol';
import { TIERS, type MatchOutcome } from './ranking';

export interface RushWord {
  id: string;
  text: string;
  translationEs: string;
  emoji?: string | null;
  /** Nivel del currículo (A1, A2); ver wordLevel. */
  level?: string | null;
}

const silver = TIERS.find((t) => t.id === 'silver')!.minRating;

/**
 * Niveles del currículo que entran en las preguntas según el rating: el ranked se pone más
 * difícil a medida que subís de rango. Espejo en SQL: public.rush_levels.
 */
export const RUSH_LEVELS: readonly { minRating: number; levels: readonly string[] }[] = [
  { minRating: 0, levels: ['A1'] },
  { minRating: silver, levels: ['A1', 'A2'] },
];

export function rushLevels(rating: number): readonly string[] {
  let levels = RUSH_LEVELS[0]!.levels;
  for (const step of RUSH_LEVELS) if (rating >= step.minRating) levels = step.levels;
  return levels;
}

/** Nivel de una palabra según su unidad: los ids son a1-uNN, a2-uNN (content/index.ts). */
export function wordLevel(unitId: string | null | undefined): string | null {
  const match = /^(a\d)-u\d+$/i.exec(unitId ?? '');
  return match ? match[1]!.toUpperCase() : null;
}

/**
 * Palabras para una partida con ese rating (en partidas entre personas, el más bajo de los dos).
 * Si de esos niveles no alcanzan para armar preguntas, se usan todas.
 */
export function rushPool<T extends RushWord>(words: readonly T[], rating: number): T[] {
  const levels = rushLevels(rating);
  const pool = words.filter((w) => w.level != null && levels.includes(w.level));
  return dedupeWords(pool).length >= WORD_RUSH.optionsPerQuestion ? pool : [...words];
}

/**
 * Traducción tal como se muestra en Word Rush: sin las aclaraciones entre paréntesis, que en
 * una pregunta rápida sobran («fui / fue (go)» → «fui / fue»). Espejo: public.rush_label.
 */
export function rushLabel(translation: string): string {
  return translation.replace(/\s*\([^)]*\)/g, '').trim();
}

export interface RushQuestion {
  index: number;
  wordId: string;
  direction: QuestionView['direction'];
  prompt: string;
  options: string[];
  correctOption: number;
  /** Imagen de la palabra si es inequívoca (ver pictureEmojis): habilita preguntas con imagen. */
  emoji?: string;
}

/**
 * Genera la secuencia de preguntas de una partida (la misma para ambos jugadores).
 * `random` debe devolver [0, 1); el servidor usa una fuente criptográfica.
 */
export function generateQuestions(
  words: readonly RushWord[],
  count: number,
  random: () => number,
  optionsPerQuestion: number = WORD_RUSH.optionsPerQuestion,
): RushQuestion[] {
  const usable = dedupeWords(words).map((w) => ({
    ...w,
    translationEs: rushLabel(w.translationEs),
  }));
  if (usable.length < optionsPerQuestion) {
    throw new Error(`Word Rush necesita al menos ${optionsPerQuestion} palabras distintas`);
  }

  const questions: RushQuestion[] = [];
  let deck: RushWord[] = [];
  let previous: string | null = null;
  for (let index = 0; index < count; index++) {
    if (deck.length === 0) deck = shuffle(usable, random);
    // Evita repetir la misma palabra dos veces seguidas al rearmar el mazo.
    if (deck[0]!.id === previous && deck.length > 1) deck.push(deck.shift()!);
    const word = deck.shift()!;
    previous = word.id;

    const direction: QuestionView['direction'] = random() < 0.5 ? 'en_es' : 'es_en';
    const display = (w: RushWord) => (direction === 'en_es' ? w.translationEs : w.text);
    const correct = display(word);
    // Un distractor no puede compartir texto ni traducción con la palabra: "hi" y "hello" → "hola"
    // dejarían dos opciones válidas.
    const distractors = shuffle(
      usable.filter(
        (w) =>
          w.id !== word.id &&
          normalize(w.text) !== normalize(word.text) &&
          normalize(w.translationEs) !== normalize(word.translationEs),
      ),
      random,
    )
      .map(display)
      .filter((value, i, all) => all.findIndex((v) => normalize(v) === normalize(value)) === i)
      .slice(0, optionsPerQuestion - 1);
    const options = shuffle([correct, ...distractors], random);

    questions.push({
      index,
      wordId: word.id,
      direction,
      prompt: direction === 'en_es' ? word.text : word.translationEs,
      options,
      correctOption: options.indexOf(correct),
    });
  }
  return questions;
}

/** Bonus por racha: `streak` = correctas seguidas contando la actual. */
export function streakBonus(streak: number): number {
  let bonus = 0;
  for (const step of WORD_RUSH.streakBonus) if (streak >= step.from) bonus = step.bonus;
  return bonus;
}

/** Nivel de racha (0 = sin racha, 1..3 = escalón de streakBonus): para sonidos y colores. */
export function streakLevel(streak: number): number {
  return WORD_RUSH.streakBonus.filter((step) => streak >= step.from).length;
}

/**
 * Puntos de una respuesta: correcta = 100 + bonus de velocidad (≤ 50) + bonus de racha (≤ 30);
 * incorrecta = −50. `streak` = correctas seguidas contando ésta (sólo cuenta si es correcta).
 */
export function answerPoints(correct: boolean, elapsedMs: number, streak = 0): number {
  if (!correct) return -WORD_RUSH.wrongPenalty;
  const elapsed = Math.max(0, elapsedMs);
  const ratio = Math.max(0, 1 - elapsed / WORD_RUSH.speedBonusWindowMs);
  return (
    WORD_RUSH.correctPoints + Math.round(WORD_RUSH.maxSpeedBonus * ratio) + streakBonus(streak)
  );
}

/** El puntaje acumulado nunca baja de 0. */
export function applyPoints(score: number, points: number): number {
  return Math.max(0, score + points);
}

export interface FinalLine {
  score: number;
  correct: number;
  answered: number;
  forfeited: boolean;
}

/**
 * Resultado de cada jugador. Abandono pierde siempre; si no, gana el mayor puntaje,
 * después la mayor precisión y, si persiste, empate.
 */
export function decideOutcomes(a: FinalLine, b: FinalLine): [MatchOutcome, MatchOutcome] {
  if (a.forfeited !== b.forfeited) return a.forfeited ? ['loss', 'win'] : ['win', 'loss'];
  if (a.forfeited && b.forfeited) return ['loss', 'loss'];
  if (a.score !== b.score) return a.score > b.score ? ['win', 'loss'] : ['loss', 'win'];
  const accA = accuracy(a);
  const accB = accuracy(b);
  if (Math.abs(accA - accB) > 1e-9) return accA > accB ? ['win', 'loss'] : ['loss', 'win'];
  return ['draw', 'draw'];
}

export function accuracy(line: { correct: number; answered: number }): number {
  return line.answered === 0 ? 0 : line.correct / line.answered;
}

/**
 * Palabras abstractas o cuyo emoji confunde: nunca se preguntan con imagen (texto en inglés en
 * minúsculas).
 */
const NO_PICTURE = new Set([
  'favorite',
  'know',
  'slowly',
  'name',
  'question',
  'hate',
  'how much',
  'repeat',
  'half past',
  "o'clock",
  'help',
  'fine',
  'country',
  'year',
  'time',
  'england',
  'english',
  'evening',
  'morning',
]);

/**
 * Emoji de cada palabra que se puede preguntar con imagen: tiene emoji, no está en NO_PICTURE y
 * ninguna otra palabra comparte ese emoji (☕ es «coffee» y «cup»: no sirve).
 */
export function pictureEmojis(words: readonly RushWord[]): Map<string, string> {
  const uses = new Map<string, number>();
  for (const w of words) if (w.emoji) uses.set(w.emoji, (uses.get(w.emoji) ?? 0) + 1);
  const result = new Map<string, string>();
  for (const w of words) {
    if (w.emoji && uses.get(w.emoji) === 1 && !NO_PICTURE.has(normalize(w.text))) {
      result.set(w.id, w.emoji);
    }
  }
  return result;
}

/** Agrega la imagen a las preguntas cuya palabra la tiene (las de la base vienen sin ella). */
export function withPictures(
  questions: readonly RushQuestion[],
  pictures: ReadonlyMap<string, string>,
): RushQuestion[] {
  return questions.map((q) => {
    const emoji = pictures.get(q.wordId);
    return emoji ? { ...q, emoji } : q;
  });
}

/**
 * Cómo se presenta una pregunta. Determinístico (sale de la pregunta misma), así los dos
 * jugadores ven lo mismo: español → inglés con imagen se muestra la imagen; de inglés → español,
 * dos de cada tres se escuchan en vez de leerse.
 */
export function questionKind(question: RushQuestion): QuestionKind {
  if (question.direction === 'es_en' && question.emoji) return 'image';
  if (question.direction === 'en_es' && question.index % 3 !== 0) return 'audio';
  return 'text';
}

/** Opciones de una pregunta sin la respuesta correcta, para enviar al cliente. */
export function toQuestionView(question: RushQuestion, sentAt: number): QuestionView {
  const kind = questionKind(question);
  return {
    index: question.index,
    direction: question.direction,
    prompt: question.prompt,
    options: question.options,
    kind,
    ...(kind === 'image' ? { emoji: question.emoji } : {}),
    sentAt,
  };
}

function dedupeWords(words: readonly RushWord[]): RushWord[] {
  const seen = new Set<string>();
  return words.filter((w) => {
    const key = normalize(w.text);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

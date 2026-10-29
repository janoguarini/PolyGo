/**
 * Reglas puras de Word Rush: preguntas, puntuación y resultado.
 * Las usa el servidor para decidir y la app para explicar las reglas. Tests: shared/__tests__/wordRush.test.ts.
 */

import { WORD_RUSH, type QuestionView } from './protocol';
import type { MatchOutcome } from './ranking';

export interface RushWord {
  id: string;
  text: string;
  translationEs: string;
}

export interface RushQuestion {
  index: number;
  wordId: string;
  direction: QuestionView['direction'];
  prompt: string;
  options: string[];
  correctOption: number;
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
  const usable = dedupeWords(words);
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

/** Puntos de una respuesta: correcta = 100 + bonus de velocidad (≤ 50); incorrecta = −50. */
export function answerPoints(correct: boolean, elapsedMs: number): number {
  if (!correct) return -WORD_RUSH.wrongPenalty;
  const elapsed = Math.max(0, elapsedMs);
  const ratio = Math.max(0, 1 - elapsed / WORD_RUSH.speedBonusWindowMs);
  return WORD_RUSH.correctPoints + Math.round(WORD_RUSH.maxSpeedBonus * ratio);
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

/** Opciones de una pregunta sin la respuesta correcta, para enviar al cliente. */
export function toQuestionView(question: RushQuestion, sentAt: number): QuestionView {
  return {
    index: question.index,
    direction: question.direction,
    prompt: question.prompt,
    options: question.options,
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

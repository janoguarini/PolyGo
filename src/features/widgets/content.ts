import { generateQuestions, type RushWord } from '@shared/wordRush';

import type { WordProgressEntry, WordRow } from '@/features/learning/api';
import { seededRandom } from '@/features/learning/random';

/**
 * Contenido de los widgets, calculado en la app (con red y sesión) y entregado al widget como props.
 * El widget corre aislado: no tiene red, sesión ni acceso a Supabase. Todo lo que muestre tiene que
 * viajar acá, como JSON plano.
 */

export const WIDGET_LINKS = {
  word: 'polygo://vocabulary',
  quiz: 'polygo://review',
} as const;

/** Horas de contenido que se precargan en el timeline de iOS (cada hora, una palabra). */
export const WORD_TIMELINE_HOURS = 12;
export const QUIZ_SIZE = 10;

export type WordCardKind = 'daily' | 'review' | 'new';

export interface WordCardProps {
  kind: WordCardKind;
  label: string;
  text: string;
  translation: string;
  ipa: string;
  emoji: string;
  example: string;
  url: string;
}

export interface QuizQuestion {
  prompt: string;
  /** 'en_es': el enunciado está en inglés; 'es_en': en español. */
  direction: 'en_es' | 'es_en';
  options: string[];
  correct: number;
}

export interface QuizProps {
  questions: QuizQuestion[];
  /** Pregunta actual; === questions.length cuando terminó la ronda. */
  index: number;
  /** Opción elegida en la pregunta actual, −1 si todavía no respondió. */
  chosen: number;
  correctCount: number;
  url: string;
}

const LABELS: Record<WordCardKind, string> = {
  daily: 'PALABRA DEL DÍA',
  review: 'PARA REPASAR',
  new: 'PALABRA NUEVA',
};

export const EMPTY_WORD_CARD: WordCardProps = {
  kind: 'new',
  label: 'POLYGO',
  text: 'Abrí Polygo',
  translation: 'para cargar tus palabras',
  ipa: '',
  emoji: '',
  example: '',
  url: WIDGET_LINKS.word,
};

export function toWordCard(word: WordRow, kind: WordCardKind): WordCardProps {
  return {
    kind,
    label: LABELS[kind],
    text: word.text,
    translation: word.translation_es,
    ipa: word.ipa ?? '',
    emoji: word.emoji ?? '',
    example: word.example_en ?? '',
    url: WIDGET_LINKS.word,
  };
}

/**
 * Orden de las palabras del widget: la del día, después las del usuario que más le cuestan
 * (vencidas primero), después palabras publicadas que todavía no vio. Sin repetidas.
 */
export function rankWidgetWords(
  myWords: readonly WordProgressEntry[],
  pool: readonly WordRow[],
  wordOfDay: WordRow | null,
  now: number,
): { word: WordRow; kind: WordCardKind }[] {
  const seen = new Set<string>();
  const result: { word: WordRow; kind: WordCardKind }[] = [];
  const push = (word: WordRow, kind: WordCardKind) => {
    if (seen.has(word.id)) return;
    seen.add(word.id);
    result.push({ word, kind });
  };

  if (wordOfDay) push(wordOfDay, 'daily');

  const studied = [...myWords]
    .filter((e) => e.seenCount > 0)
    .sort((a, b) => {
      const dueA = a.nextReviewAt !== null && new Date(a.nextReviewAt).getTime() <= now;
      const dueB = b.nextReviewAt !== null && new Date(b.nextReviewAt).getTime() <= now;
      if (dueA !== dueB) return dueA ? -1 : 1;
      if (a.incorrectCount !== b.incorrectCount) return b.incorrectCount - a.incorrectCount;
      return a.stage - b.stage;
    });
  for (const entry of studied) push(entry.word, 'review');

  const studiedIds = new Set(myWords.map((e) => e.word.id));
  for (const word of pool) {
    if (word.is_published && !studiedIds.has(word.id)) push(word, 'new');
  }
  return result;
}

/** Comienzo de la hora siguiente a `date` (hora local). */
export function nextHour(date: Date): Date {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}

/**
 * Timeline de iOS: la primera entrada es ahora y las siguientes al comienzo de cada hora.
 * iOS decide cuándo recarga de verdad; precargar evita depender de la red o de abrir la app.
 */
export function buildWordTimeline(
  ranked: readonly { word: WordRow; kind: WordCardKind }[],
  now: Date,
  hours = WORD_TIMELINE_HOURS,
): { date: Date; props: WordCardProps }[] {
  if (ranked.length === 0) return [{ date: now, props: EMPTY_WORD_CARD }];
  const entries: { date: Date; props: WordCardProps }[] = [];
  let at = now;
  for (let i = 0; i < hours; i++) {
    const item = ranked[i % ranked.length]!;
    entries.push({ date: at, props: toWordCard(item.word, item.kind) });
    at = nextHour(at);
  }
  return entries;
}

/**
 * Ronda de preguntas rápidas. Prioriza palabras que el usuario ya estudió (es repaso, no examen);
 * si tiene menos de 4, completa con el resto del currículo publicado.
 */
export function buildQuiz(
  myWords: readonly WordProgressEntry[],
  pool: readonly WordRow[],
  seed: string,
  size = QUIZ_SIZE,
): QuizProps | null {
  const toRush = (w: WordRow): RushWord => ({
    id: w.id,
    text: w.text,
    translationEs: w.translation_es,
  });
  const studied = myWords.filter((e) => e.seenCount > 0).map((e) => toRush(e.word));
  const published = pool.filter((w) => w.is_published).map(toRush);
  // Con 8 o más estudiadas hay distractores variados; con menos se suma el currículo publicado.
  const source = studied.length >= 8 ? studied : dedupeById([...studied, ...published]);
  let questions;
  try {
    questions = generateQuestions(source, size, seededRandom(seed));
  } catch {
    return null;
  }
  return {
    questions: questions.map((q) => ({
      prompt: q.prompt,
      direction: q.direction,
      options: q.options,
      correct: q.correctOption,
    })),
    index: 0,
    chosen: -1,
    correctCount: 0,
    url: WIDGET_LINKS.quiz,
  };
}

function dedupeById(words: RushWord[]): RushWord[] {
  const seen = new Set<string>();
  return words.filter((w) => (seen.has(w.id) ? false : (seen.add(w.id), true)));
}

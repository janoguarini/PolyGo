import type { ExerciseDef } from './types';

/**
 * Atajos para escribir ejercicios. Las opciones se guardan con la respuesta primero;
 * la app las mezcla en tiempo de ejecución.
 */

type Extra = Pick<
  ExerciseDef,
  'explanation' | 'difficulty' | 'recommendedSeconds' | 'acceptedAnswers'
>;

/** Tokens de una oración para "ordenar palabras": sin comas ni puntuación final. */
export function tokensOf(sentence: string): string[] {
  return sentence
    .replace(/[.!?]+$/, '')
    .replace(/,/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export const ex = {
  imageChoice: (
    emoji: string,
    answer: string,
    distractors: string[],
    words: string[],
    extra: Extra = {},
  ): ExerciseDef => ({
    type: 'image_choice',
    skill: 'vocabulary',
    prompt: '¿Qué muestra la imagen?',
    payload: { type: 'image_choice', emoji, options: [answer, ...distractors] },
    answer,
    words,
    recommendedSeconds: 12,
    ...extra,
  }),

  translationChoice: (
    word: string,
    answer: string,
    distractors: string[],
    words: string[],
    extra: Extra = {},
  ): ExerciseDef => ({
    type: 'translation_choice',
    skill: 'vocabulary',
    prompt: `¿Qué significa «${word}»?`,
    payload: { type: 'translation_choice', word, options: [answer, ...distractors] },
    answer,
    words,
    recommendedSeconds: 12,
    ...extra,
  }),

  translateWrite: (
    source: string,
    answer: string,
    words: string[],
    extra: Extra = {},
  ): ExerciseDef => ({
    type: 'translate_write',
    skill: 'translation',
    prompt: 'Traducí al inglés',
    payload: { type: 'translate_write', source },
    answer,
    words,
    recommendedSeconds: 30,
    ...extra,
  }),

  completeWord: (
    masked: string,
    answer: string,
    hint: string,
    words: string[],
    extra: Extra = {},
  ): ExerciseDef => ({
    type: 'complete_word',
    skill: 'vocabulary',
    prompt: 'Escribí la palabra completa',
    payload: { type: 'complete_word', masked, hint },
    answer,
    words,
    recommendedSeconds: 20,
    ...extra,
  }),

  fillBlank: (
    sentence: string,
    translation: string,
    answer: string,
    distractors: string[],
    words: string[],
    extra: Extra & { skill?: ExerciseDef['skill'] } = {},
  ): ExerciseDef => {
    const { skill = 'grammar', ...rest } = extra;
    return {
      type: 'fill_blank',
      skill,
      prompt: 'Completá la frase',
      payload: { type: 'fill_blank', sentence, translation, options: [answer, ...distractors] },
      answer,
      words,
      recommendedSeconds: 15,
      ...rest,
    };
  },

  orderWords: (
    sentence: string,
    translation: string,
    words: string[],
    extra: Extra = {},
  ): ExerciseDef => ({
    type: 'order_words',
    skill: 'sentence_building',
    prompt: 'Ordená las palabras',
    payload: { type: 'order_words', tokens: tokensOf(sentence), translation },
    answer: sentence,
    words,
    recommendedSeconds: 25,
    ...extra,
  }),

  listenChoice: (
    audioText: string,
    distractors: string[],
    words: string[],
    extra: Extra = {},
  ): ExerciseDef => ({
    type: 'listen_choice',
    skill: 'listening',
    prompt: 'Escuchá y elegí lo que oís',
    payload: { type: 'listen_choice', audioText, options: [audioText, ...distractors] },
    answer: audioText,
    words,
    recommendedSeconds: 15,
    ...extra,
  }),

  matchPairs: (pairs: [string, string][], words: string[], extra: Extra = {}): ExerciseDef => ({
    type: 'match_pairs',
    skill: 'vocabulary',
    prompt: 'Uní cada palabra con su significado',
    payload: { type: 'match_pairs', pairs: pairs.map(([left, right]) => ({ left, right })) },
    answer: '',
    words,
    recommendedSeconds: 30,
    ...extra,
  }),

  shortAnswer: (
    question: string,
    translation: string,
    answer: string,
    accepted: string[],
    words: string[],
    extra: Extra = {},
  ): ExerciseDef => ({
    type: 'short_answer',
    skill: 'sentence_building',
    prompt: 'Respondé en inglés',
    payload: { type: 'short_answer', question, translation },
    answer,
    acceptedAnswers: accepted,
    words,
    recommendedSeconds: 30,
    ...extra,
  }),
};

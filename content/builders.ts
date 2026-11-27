import { HAN, languageConfig, type LanguageConfig } from '../shared/languages';
import type { ExerciseDef } from './types';

/**
 * Atajos para escribir ejercicios. Las opciones se guardan con la respuesta primero;
 * la app las mezcla en tiempo de ejecución. Cada idioma tiene los suyos (exercisesFor): cambian
 * las consignas («Traduce al italiano») y, en chino, cómo se arman las oraciones y qué se escribe.
 */

type Extra = Pick<
  ExerciseDef,
  | 'id'
  | 'explanation'
  | 'difficulty'
  | 'recommendedSeconds'
  | 'acceptedAnswers'
  | 'consolidate'
  | 'personalData'
>;

/**
 * Tokens de una oración para "ordenar palabras": sin comas ni puntuación final. En chino la oración
 * se escribe con espacios entre fichas («我 叫 王明。») y la respuesta va sin ellos (joinHan).
 */
export function tokensOf(sentence: string): string[] {
  return sentence
    .replace(/[.!?。！？]+$/, '')
    .replace(/[,，]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/** Quita los espacios junto a caracteres chinos: «我 叫 王明。» → «我叫王明。». */
export function joinHan(sentence: string): string {
  return sentence.replace(/\s+/g, (space, at: number, all: string) =>
    HAN.test(all[at - 1] ?? '') || HAN.test(all[at + space.length] ?? '') ? '' : space,
  );
}

/** Consignas en el idioma de apoyo: español (todos los cursos) o inglés (el curso de español). */
function promptsFor(language: LanguageConfig) {
  const han = language.script === 'han';
  if (language.support?.code === 'en') {
    const name = language.support.targetName;
    return {
      image: 'What does the picture show?',
      meaning: (word: string) => `What does “${word}” mean?`,
      translate: han ? 'Write it in pinyin' : `Translate into ${name}`,
      complete: 'Write the whole word',
      fill: 'Complete the sentence',
      order: 'Put the words in order',
      listen: 'Listen and choose what you hear',
      match: 'Match each word with its meaning',
      answer: `Answer in ${han ? 'pinyin' : name}`,
    };
  }
  // En chino se escribe en pinyin (con marcas de tono o números: ni3 hao3).
  const writeIn = han ? 'en pinyin' : language.inName;
  return {
    image: '¿Qué muestra la imagen?',
    meaning: (word: string) => `¿Qué significa «${word}»?`,
    translate: han ? 'Escribe en pinyin' : `Traduce ${language.alName}`,
    complete: 'Escribe la palabra completa',
    fill: 'Completa la frase',
    order: 'Ordena las palabras',
    listen: 'Escucha y elige lo que oyes',
    match: 'Une cada palabra con su significado',
    answer: `Responde ${writeIn}`,
  };
}

export function exercisesFor(language: LanguageConfig) {
  const han = language.script === 'han';
  const t = promptsFor(language);
  return {
    imageChoice: (
      emoji: string,
      answer: string,
      distractors: string[],
      words: string[],
      extra: Extra = {},
    ): ExerciseDef => ({
      type: 'image_choice',
      skill: 'vocabulary',
      prompt: t.image,
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
      prompt: t.meaning(word),
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
      prompt: t.translate,
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
      prompt: t.complete,
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
        prompt: t.fill,
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
      prompt: t.order,
      payload: { type: 'order_words', tokens: tokensOf(sentence), translation },
      answer: han ? joinHan(sentence) : sentence,
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
      prompt: t.listen,
      payload: { type: 'listen_choice', audioText, options: [audioText, ...distractors] },
      answer: audioText,
      words,
      recommendedSeconds: 15,
      ...extra,
    }),

    matchPairs: (pairs: [string, string][], words: string[], extra: Extra = {}): ExerciseDef => ({
      type: 'match_pairs',
      skill: 'vocabulary',
      prompt: t.match,
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
      prompt: t.answer,
      payload: { type: 'short_answer', question, translation },
      answer,
      acceptedAnswers: accepted,
      words,
      recommendedSeconds: 30,
      ...extra,
    }),
  };
}

/** Atajos del inglés (el currículo original). */
export const ex = exercisesFor(languageConfig('en'));

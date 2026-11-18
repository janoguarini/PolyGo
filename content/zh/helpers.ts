import { languageConfig } from '../../shared/languages';
import type { ContextStimulus, ReadingDocument, StimulusVoice } from '../../shared/exercises';
import { exercisesFor } from '../builders';
import { pinyinVariants } from '../path';
import type { ExerciseDef, WordDef } from '../types';

/**
 * Atajos del chino A1 (U13–U16) y A2 (docs/ZH_A1_A2.md). Los mismos tipos de ejercicio que el piloto
 * y que el resto de los idiomas: no hay tipos nuevos.
 *
 * - Lo que el alumno escribe es pinyin (con marcas o con números de tono: ni3 hao3), como en el
 *   piloto. También se aceptan los caracteres y el pinyin sin espacios.
 * - 不 y 一 se escriben con su cambio de tono (bú shì, yí ge), como en el piloto; se acepta también
 *   el tono de diccionario (bù shì, yī ge).
 */

export const ex = exercisesFor(languageConfig('zh'));

type Extra = { id: string; explanation?: string; accepted?: string[] };

/** Palabra: caracteres, pinyin, traducción, ejemplo en chino y en español. */
export const w = (
  id: string,
  text: string,
  romanization: string,
  translation: string,
  exampleZh: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({
  id,
  text,
  romanization,
  translation,
  exampleEn: exampleZh,
  exampleEs,
  tags,
  ...extra,
});

/** Variante con el tono de diccionario de 不 y 一 (bú → bù, yí / yì → yī). */
export function sandhiVariants(pinyin: string, hanzi: string): string[] {
  let base = pinyin;
  if (hanzi.includes('不')) base = base.replace(/(^|[\s,])bú(?=\s|$)/g, '$1bù');
  if (hanzi.includes('一'))
    base = base.replace(/(^|[\s,])y[íì](?=[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü\s]|$)/g, '$1yī');
  return base === pinyin ? [] : [base];
}

/** Respuestas aceptadas de una respuesta en pinyin: sin espacios, en caracteres y sin el cambio de tono. */
export function pinyinAccepted(pinyin: string, hanzi: string, more: string[] = []): string[] {
  const out = [
    ...pinyinVariants(pinyin, hanzi),
    ...sandhiVariants(pinyin, hanzi).flatMap((v) => [v, v.replace(/\s+/g, '')]),
    ...more,
  ];
  return [...new Set(out)].filter((v) => v !== pinyin);
}

/** Traducir al chino escribiendo pinyin (o caracteres). */
export const write = (
  source: string,
  pinyin: string,
  hanzi: string,
  words: string[],
  extra: Extra,
): ExerciseDef =>
  ex.translateWrite(source, pinyin, words, {
    id: extra.id,
    acceptedAnswers: pinyinAccepted(pinyin, hanzi, extra.accepted),
    ...(extra.explanation ? { explanation: extra.explanation } : {}),
  });

/** Responder una pregunta en chino escribiendo pinyin (o caracteres). */
export const reply = (
  question: string,
  instruction: string,
  pinyin: string,
  hanzi: string,
  words: string[],
  extra: Extra,
): ExerciseDef =>
  ex.shortAnswer(
    question,
    instruction,
    pinyin,
    pinyinAccepted(pinyin, hanzi, extra.accepted),
    words,
    {
      id: extra.id,
      ...(extra.explanation ? { explanation: extra.explanation } : {}),
    },
  );

/**
 * Escuchar y elegir el pinyin con el tono correcto (como en el piloto): el audio son los caracteres y
 * las opciones, el mismo pinyin con otros tonos.
 */
export const tone = (
  hanzi: string,
  pinyin: string,
  others: string[],
  words: string[],
  extra: { id: string; explanation?: string },
): ExerciseDef => ({
  type: 'listen_choice',
  skill: 'listening',
  prompt: 'Escuchá y elegí el tono correcto',
  payload: { type: 'listen_choice', audioText: hanzi, options: [pinyin, ...others] },
  answer: pinyin,
  words,
  recommendedSeconds: 15,
  ...extra,
});

/** Velocidad del audio: A1 más lento, A2 un poco menos (nunca acelerado). */
export const ZH_A1_RATE = 0.8;
export const ZH_A2_RATE = 0.85;

export const dialogue = (
  id: string,
  setting: string,
  lines: [speaker: string, text: string][],
  rate = ZH_A2_RATE,
): ContextStimulus => {
  const speakers = [...new Set(lines.map(([s]) => s))].map((name, i) => ({
    name,
    voice: (i % 2 === 0 ? 'a' : 'b') as StimulusVoice,
  }));
  return {
    kind: 'listening',
    id,
    setting,
    speakers,
    rate,
    lines: lines.map(([speaker, text]) => ({ speaker, text })),
  };
};

export const reading = (
  id: string,
  document: ReadingDocument,
  setting: string,
  lines: string[],
  extra: { title?: string; from?: string; to?: string } = {},
): ContextStimulus => ({ kind: 'reading', id, document, setting, ...extra, lines });

/** Pregunta en español sobre un estímulo. La respuesta va primera: la app mezcla las opciones. */
export const question = (
  id: string,
  stimulus: ContextStimulus,
  q: string,
  answer: string,
  distractors: string[],
  concepts: string[],
  explanation: string,
): ExerciseDef => ({
  id,
  type: 'context_choice',
  skill: stimulus.kind === 'reading' ? 'reading' : 'listening',
  prompt: stimulus.kind === 'reading' ? 'Leé y respondé' : 'Escuchá y respondé',
  payload: { type: 'context_choice', stimulus, question: q, options: [answer, ...distractors] },
  answer,
  words: [],
  concepts,
  explanation,
  recommendedSeconds: stimulus.kind === 'reading' ? 50 : 60,
  consolidate: false,
});

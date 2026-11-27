import { languageConfig } from '../../shared/languages';
import type { ContextStimulus, ReadingDocument, StimulusVoice } from '../../shared/exercises';
import { exercisesFor } from '../builders';
import type { ExerciseDef, WordDef } from '../types';

/**
 * Atajos del italiano A1 (U13–U16) y A2 (docs/IT_A1_A2.md). Los mismos ejercicios y la misma
 * comprensión en contexto (context_choice) que el inglés A2/B1 y el portugués: no hay tipos nuevos.
 */

export const ex = exercisesFor(languageConfig('it'));

/** Palabra (mismo orden que las unidades piloto, sin IPA: el piloto de italiano no la usa). */
export const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/** Velocidad del audio: A1 más lento, A2 un poco menos (nunca acelerado). */
export const IT_A1_RATE = 0.85;
export const IT_A2_RATE = 0.9;

export const dialogue = (
  id: string,
  setting: string,
  lines: [speaker: string, text: string][],
  rate = IT_A2_RATE,
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
  prompt: stimulus.kind === 'reading' ? 'Lee y responde' : 'Escucha y responde',
  payload: { type: 'context_choice', stimulus, question: q, options: [answer, ...distractors] },
  answer,
  words: [],
  concepts,
  explanation,
  recommendedSeconds: stimulus.kind === 'reading' ? 50 : 60,
  consolidate: false,
});

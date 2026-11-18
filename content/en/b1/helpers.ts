import type { ContextStimulus, ReadingDocument, StimulusVoice } from '../../../shared/exercises';
import type { ExerciseDef } from '../../types';

/**
 * Atajos de inglés B1 (docs/B1_EN.md): comprensión en contexto con los mismos ejercicios context_choice
 * que el A2 (content/en/a2/context-helpers.ts). En B1 los textos son más largos y el audio va a
 * velocidad normal.
 */

/** Velocidad del audio sintetizado en B1: la normal (el A2 usa 0.9). */
export const B1_LISTENING_RATE = 1;

export const dialogue = (
  id: string,
  setting: string,
  lines: [speaker: string, text: string][],
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
    rate: B1_LISTENING_RATE,
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
  recommendedSeconds: stimulus.kind === 'reading' ? 60 : 75,
  consolidate: false,
});

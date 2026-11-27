import type { ContextStimulus, ReadingDocument, StimulusVoice } from '../../../shared/exercises';
import type { ExerciseDef } from '../../types';

/**
 * Atajos para la comprensión en contexto de las unidades nuevas del A2 (U13–U17): cada pregunta sobre
 * un texto o un audio es un ejercicio context_choice (como en el cierre de A1, content/en/a1/closure.ts).
 */

/** Velocidad del audio sintetizado en A2: un poco más lenta que la normal, nunca acelerada. */
export const A2_LISTENING_RATE = 0.9;

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
    rate: A2_LISTENING_RATE,
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
  recommendedSeconds: stimulus.kind === 'reading' ? 45 : 60,
  consolidate: false,
});

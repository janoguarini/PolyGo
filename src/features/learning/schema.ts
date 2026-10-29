import { z } from 'zod';

import { EXERCISE_TYPES, SKILLS, type Exercise, type ExercisePayload } from '@shared/exercises';

/** Valida el payload que llega de la base de datos: nunca se confía en un cast. */
const options = z.array(z.string()).min(2);

export const payloadSchema: z.ZodType<ExercisePayload> = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image_choice'), emoji: z.string(), options }),
  z.object({ type: z.literal('translation_choice'), word: z.string(), options }),
  z.object({ type: z.literal('translate_write'), source: z.string() }),
  z.object({ type: z.literal('complete_word'), masked: z.string(), hint: z.string() }),
  z.object({
    type: z.literal('fill_blank'),
    sentence: z.string(),
    translation: z.string(),
    options,
  }),
  z.object({
    type: z.literal('order_words'),
    tokens: z.array(z.string()).min(2),
    translation: z.string(),
  }),
  z.object({ type: z.literal('listen_choice'), audioText: z.string(), options }),
  z.object({
    type: z.literal('match_pairs'),
    pairs: z.array(z.object({ left: z.string(), right: z.string() })).min(2),
  }),
  z.object({ type: z.literal('short_answer'), question: z.string(), translation: z.string() }),
]);

export interface ExerciseRow {
  id: string;
  lesson_id: string;
  position: number;
  type: string;
  skill: string;
  prompt_es: string;
  payload: unknown;
  answer: string;
  accepted_answers: string[];
  explanation_es: string | null;
  difficulty: number;
  recommended_seconds: number;
}

export function parseExercise(row: ExerciseRow, wordIds: string[]): Exercise {
  const type = z.enum(EXERCISE_TYPES).parse(row.type);
  const skill = z.enum(SKILLS).parse(row.skill);
  const payload = payloadSchema.parse(row.payload);
  if (payload.type !== type)
    throw new Error(`Ejercicio ${row.id}: payload de tipo ${payload.type} ≠ ${type}`);
  return {
    id: row.id,
    lessonId: row.lesson_id,
    position: row.position,
    type,
    skill,
    prompt: row.prompt_es,
    payload,
    answer: row.answer,
    acceptedAnswers: row.accepted_answers,
    explanation: row.explanation_es,
    difficulty: row.difficulty,
    recommendedSeconds: row.recommended_seconds,
    wordIds,
  };
}

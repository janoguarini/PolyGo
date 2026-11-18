import { z } from 'zod';

import {
  EXERCISE_TYPES,
  READING_DOCUMENTS,
  SKILLS,
  STIMULUS_VISUAL_DISPLAYS,
  STIMULUS_VISUAL_ID,
  STIMULUS_VISUAL_KINDS,
  STIMULUS_VISUAL_LIMITS,
  visualAspectOk,
  type ContextStimulus,
  type Exercise,
  type ExercisePayload,
} from '@shared/exercises';

/** Valida el payload que llega de la base de datos: nunca se confía en un cast. */
const options = z.array(z.string()).min(2);

/**
 * Imagen de apoyo de un estímulo (fase C.9.1). Si llega mal formada se descarta (`catch`) y el
 * estímulo se muestra sin imagen: el texto o el audio alcanzan para responder; nunca se dibuja una
 * imagen sin descripción accesible o con una proporción que no sea la suya.
 */
export const visualSchema = z
  .object({
    id: z.string().regex(STIMULUS_VISUAL_ID),
    kind: z.enum(STIMULUS_VISUAL_KINDS),
    display: z.enum(STIMULUS_VISUAL_DISPLAYS),
    alt: z.string().trim().min(STIMULUS_VISUAL_LIMITS.minAlt),
    width: z.number().int().min(STIMULUS_VISUAL_LIMITS.minSide).max(STIMULUS_VISUAL_LIMITS.maxSide),
    height: z
      .number()
      .int()
      .min(STIMULUS_VISUAL_LIMITS.minSide)
      .max(STIMULUS_VISUAL_LIMITS.maxSide),
    sha256: z.string().regex(/^[0-9a-f]{64}$/),
  })
  .refine((v) => visualAspectOk(v.width, v.height), { message: 'proporción fuera de 3:4–16:9' });

const optionalVisual = visualSchema.optional().catch(undefined);

/** Estímulo de comprensión en contexto (fase C). Un estímulo sin texto no se muestra. */
const stimulusSchema: z.ZodType<ContextStimulus> = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('reading'),
    id: z.string().min(1),
    document: z.enum(READING_DOCUMENTS),
    setting: z.string(),
    title: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    lines: z.array(z.string().min(1)).min(1),
    visual: optionalVisual,
  }),
  z.object({
    kind: z.literal('listening'),
    id: z.string().min(1),
    setting: z.string(),
    speakers: z
      .array(z.object({ name: z.string().min(1), voice: z.enum(['a', 'b']) }))
      .min(1),
    rate: z.number().positive().max(1),
    lines: z.array(z.object({ speaker: z.string().min(1), text: z.string().min(1) })).min(1),
    visual: optionalVisual,
  }),
]);

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
  z.object({
    type: z.literal('context_choice'),
    stimulus: stimulusSchema,
    question: z.string().min(1),
    options,
  }),
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

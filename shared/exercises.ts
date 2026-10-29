/**
 * Contrato de los ejercicios. El contenido (content/), la base de datos (exercises.payload)
 * y el motor de la app usan estos tipos.
 */

export const EXERCISE_TYPES = [
  'image_choice', //       imagen → palabra en inglés
  'translation_choice', // palabra inglesa → traducción
  'translate_write', //    español → inglés escrito
  'complete_word', //      completar una palabra (ortografía)
  'fill_blank', //         completar una frase / palabra en contexto
  'order_words', //        ordenar palabras para formar una oración
  'listen_choice', //      escuchar y elegir
  'match_pairs', //        relacionar vocabulario con significado
  'short_answer', //       respuesta breve escrita
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const SKILLS = [
  'vocabulary',
  'translation',
  'listening',
  'grammar',
  'sentence_building',
] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<Skill, string> = {
  vocabulary: 'Vocabulario',
  translation: 'Traducción',
  listening: 'Comprensión auditiva',
  grammar: 'Gramática',
  sentence_building: 'Construcción de frases',
};

/** Datos específicos de cada tipo (columna exercises.payload). */
export type ExercisePayload =
  | { type: 'image_choice'; emoji: string; options: string[] }
  | { type: 'translation_choice'; word: string; options: string[] }
  | { type: 'translate_write'; source: string }
  | { type: 'complete_word'; masked: string; hint: string }
  | { type: 'fill_blank'; sentence: string; translation: string; options: string[] }
  | { type: 'order_words'; tokens: string[]; translation: string }
  | { type: 'listen_choice'; audioText: string; options: string[] }
  | { type: 'match_pairs'; pairs: { left: string; right: string }[] }
  | { type: 'short_answer'; question: string; translation: string };

/** Ejercicio tal como lo recibe el motor de la app. */
export interface Exercise {
  id: string;
  lessonId: string | null;
  position: number;
  type: ExerciseType;
  skill: Skill;
  /** Enunciado en español. */
  prompt: string;
  payload: ExercisePayload;
  /** Respuesta canónica. En match_pairs no se usa (las parejas son la respuesta). */
  answer: string;
  /** Variantes aceptadas explícitamente además de `answer`. */
  acceptedAnswers: string[];
  explanation: string | null;
  difficulty: number;
  recommendedSeconds: number;
  wordIds: string[];
}

/** Respuesta del usuario según el tipo de ejercicio. */
export type UserAnswer =
  | { kind: 'text'; value: string }
  | { kind: 'option'; value: string }
  | { kind: 'tokens'; value: string[] }
  | { kind: 'pairs'; value: { left: string; right: string }[] };

export function answerKindFor(type: ExerciseType): UserAnswer['kind'] {
  switch (type) {
    case 'image_choice':
    case 'translation_choice':
    case 'fill_blank':
    case 'listen_choice':
      return 'option';
    case 'order_words':
      return 'tokens';
    case 'match_pairs':
      return 'pairs';
    case 'translate_write':
    case 'complete_word':
    case 'short_answer':
      return 'text';
  }
}

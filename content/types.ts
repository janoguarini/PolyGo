import type { ExercisePayload, ExerciseType, Skill } from '../shared/exercises';

/**
 * Formato de autoría del currículo. scripts/build-content-sql.ts lo convierte en una migración SQL;
 * content/__tests__/content.test.ts valida su integridad.
 * IDs: palabra "en-<slug>", unidad "a1-u01", lección "a1-u01-l01", ejercicio "a1-u01-l01-e01"
 * (con el prefijo del nivel: a1-…, a2-…).
 */

/** Niveles del MCER con contenido (la base admite los mismos en curriculum_units.level). */
export type Level = 'A1' | 'A2';

export interface WordDef {
  id: string;
  text: string;
  translation: string;
  /** Otras traducciones válidas al español. */
  acceptedTranslations?: string[];
  /** Otras formas válidas en inglés al escribirla (p. ej. «a lot» para «very much»). */
  acceptedTexts?: string[];
  /** Transcripción fonética (inglés general americano). */
  ipa: string;
  emoji?: string;
  exampleEn: string;
  exampleEs: string;
  difficulty?: number;
  tags: string[];
}

export interface ExerciseDef {
  type: ExerciseType;
  skill: Skill;
  prompt: string;
  payload: ExercisePayload;
  answer: string;
  acceptedAnswers?: string[];
  explanation?: string;
  /** IDs de palabras que el ejercicio practica (alimentan la repetición espaciada). */
  words: string[];
  difficulty?: number;
  recommendedSeconds?: number;
}

export interface LessonDef {
  title: string;
  objective: string;
  exercises: ExerciseDef[];
}

export interface UnitDef {
  /** 1-based dentro de su nivel; define el id a1-uNN / a2-uNN. */
  position: number;
  title: string;
  titleEn: string;
  description: string;
  emoji: string;
  words: WordDef[];
  lessons: LessonDef[];
}

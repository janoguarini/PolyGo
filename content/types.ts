import type { ExercisePayload, ExerciseType, Skill } from '../shared/exercises';

/**
 * Formato de autoría del currículo (estándar en docs/CONTENT_STANDARD.md).
 * scripts/build-content-sql.ts lo convierte en una migración SQL; content/__tests__/content.test.ts
 * valida su integridad.
 *
 * Organización: idioma → nivel → unidad → lección → ejercicios (content/<idioma>/<nivel>/).
 * IDs: palabra "<idioma>-<slug>". Unidad, lección y ejercicio llevan el prefijo del idioma salvo en
 * inglés, que conserva los ids históricos para no perder el progreso de nadie:
 *   inglés   a1-u01, a1-u01-l01, a1-u01-l01-e01
 *   italiano it-a1-u01, it-a1-u01-l01, it-a1-u01-l01-e01
 */

/** Niveles del MCER con contenido (la base admite los mismos en curriculum_units.level). */
export type Level = 'A1' | 'A2';

/** Estado de la revisión lingüística: lo redactado sin revisión humana queda en 'draft'. */
export type ReviewStatus = 'draft' | 'in_review' | 'reviewed';

export interface WordDef {
  id: string;
  /** La palabra o frase en el idioma que se aprende (en chino, en caracteres). */
  text: string;
  translation: string;
  /** Otras traducciones válidas al español. */
  acceptedTranslations?: string[];
  /** Otras formas válidas en el idioma al escribirla (p. ej. «a lot» para «very much»). */
  acceptedTexts?: string[];
  /** Transcripción fonética (en inglés, general americano). Opcional en los demás idiomas. */
  ipa?: string;
  /** Chino: pinyin con marcas de tono («nǐ hǎo»). Es lo que se escribe en los ejercicios. */
  romanization?: string;
  emoji?: string;
  /** Ejemplo en el idioma que se aprende (la columna se llama example_en por historia). */
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
  /**
   * false: no se reutiliza en las lecciones de consolidación. Para ejercicios agregados a una unidad
   * ya cargada: así la consolidación generada (y sus vínculos con palabras) no cambia.
   */
  consolidate?: boolean;
}

/** Ejemplo natural: en el idioma que se aprende y en español. */
export interface ExampleDef {
  target: string;
  base: string;
  note?: string;
}

/** Introducción breve de la lección: se muestra antes del primer ejercicio y no puntúa. */
export interface LessonIntro {
  explanation: string;
  examples: ExampleDef[];
}

export interface LessonDef {
  title: string;
  objective: string;
  intro?: LessonIntro;
  /** Cierre: qué aprendiste («Ahora podés…»). Se muestra en los resultados. */
  takeaways?: string[];
  exercises: ExerciseDef[];
}

export interface UnitDef {
  /** 1-based dentro de su nivel; define el id a1-uNN / it-a1-uNN. */
  position: number;
  title: string;
  titleEn: string;
  description: string;
  emoji: string;
  /** Objetivo comunicativo («Podés…»). */
  objective?: string;
  /** Estructura principal de la unidad, cuando corresponde. */
  grammar?: { title: string; explanation: string; examples: ExampleDef[] };
  review?: { status: ReviewStatus; reviewer?: string; notes?: string };
  words: WordDef[];
  lessons: LessonDef[];
}

export interface LevelDef {
  level: Level;
  units: UnitDef[];
}

/** Curso de un idioma (desde español). */
export interface CourseDef {
  language: string;
  levels: LevelDef[];
}

import type { ExpansionUnitDef } from './a2-expansion';
import { ES_A1_UNITS } from './es/a1';
import { ES_A2_UNITS } from './es/a2';
import { ES_B1_UNITS } from './es/b1';
import { unitId, type PathUnit } from './index';
import { unitPath } from './path';
import type { Level } from './types';

/**
 * Español A1 y A2 completos (docs/ES_A1_A2.md), para quien no habla español. No había piloto: todo el
 * curso es nuevo.
 *
 * - A1 U1–U17 y A2 U1–U12, en español neutro de Latinoamérica con tú y ustedes
 *   (docs/ES_NEUTRAL_GUIDE.md; el voseo sólo se menciona en la gramática de U2 y se acepta como
 *   variante en algunas respuestas), con el inglés como idioma de apoyo (shared/languages.ts
 *   `support`): las traducciones, consignas, explicaciones y preguntas de comprensión están en inglés.
 *   Publicado en producción; disponible y con Ranked desde 20261226120000_ranked_all_courses.
 * - Como los demás cursos nuevos, vive en su propio camino, fuera de COURSES y de CURRICULUM_PATH.
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, con ids es-a1-u01-… y es-a2-u01-…, y los títulos de los
 *   repasos en inglés.
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`).
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-es-sql.ts).
 */

export interface EsUnitDef extends ExpansionUnitDef {
  /**
   * Vocabulario de apoyo: formas que aparecen en textos, audios y frases sin ser palabras que se
   * practican (no entran a los repasos). Desde la unidad siguiente cuentan como conocidas. El
   * validador (content/es-checks.ts) exige que se usen y que no estén ya enseñadas.
   */
  support: string[];
  /**
   * Formas del tuteo (tú, eres, tienes…) que la unidad muestra a propósito para compararlas con el
   * voseo. Sólo valen en los ejemplos de la introducción y de la gramática, nunca en los ejercicios.
   */
  contrast?: string[];
}

export interface EsLevelDef {
  language: 'es';
  level: Level;
  first: number;
  units: readonly EsUnitDef[];
}

export const ES_COURSE: readonly EsLevelDef[] = [
  { language: 'es', level: 'A1', first: 1, units: ES_A1_UNITS },
  { language: 'es', level: 'A2', first: 1, units: ES_A2_UNITS },
];

/** Palabras con las que el generador descarta traducciones ambiguas: todo el español. */
export function esKnownWords() {
  return ES_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words));
}

export const ES_PATH: PathUnit[] = ES_COURSE.flatMap(({ language, level, units }) =>
  units.map(({ unit }) => ({
    language,
    level,
    unit,
    lessons: unitPath(unit, esKnownWords(), unitId(language, level, unit), language, {
      unitWordsOnly: true,
    }),
  })),
);

/**
 * Español B1 U1–U12 (docs/ES_B1.md). Como el inglés B1, vive en su propio camino (`ES_B1_PATH`), fuera
 * de `ES_PATH`: la carga y la publicación del A1/A2, la nivelación y Ranked no cambian.
 */
export const ES_B1: EsLevelDef = { language: 'es', level: 'B1', first: 1, units: ES_B1_UNITS };

/** Niveles del curso en orden (A1, A2, B1): el validador cuenta lo enseñado en este orden. */
export const ES_LEVELS: readonly EsLevelDef[] = [...ES_COURSE, ES_B1];

/** Palabras con las que el generador del B1 descarta traducciones ambiguas: todo el español con B1. */
export function esB1KnownWords() {
  return [...esKnownWords(), ...ES_B1.units.flatMap((u) => u.unit.words)];
}

export const ES_B1_PATH: PathUnit[] = ES_B1.units.map(({ unit }) => ({
  language: ES_B1.language,
  level: ES_B1.level,
  unit,
  lessons: unitPath(unit, esB1KnownWords(), unitId(ES_B1.language, ES_B1.level, unit), 'es', {
    unitWordsOnly: true,
  }),
}));

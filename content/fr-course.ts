import type { ExpansionUnitDef } from './a2-expansion';
import { FR_A1_UNITS } from './fr/a1';
import { FR_A2_UNITS } from './fr/a2';
import { unitId, type PathUnit } from './index';
import { unitPath } from './path';
import type { Level } from './types';

/**
 * Francés A1 y A2 completos (docs/FR_A1_A2.md). El francés no tenía piloto: todo el curso es nuevo.
 *
 * - A1 U1–U16 y A2 U1–U12, en francés estándar de Francia, con traducciones al español rioplatense
 *   como los demás idiomas.
 * - Como el portugués, el italiano y el chino nuevos, vive en su propio camino, fuera de COURSES y de
 *   CURRICULUM_PATH: no cambia la consolidación de lo cargado, sus ids, los totales que comparan la
 *   base con content/ ni lo que ve la app hoy (el idioma sigue oculto: shared/languages.ts).
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, con ids fr-a1-u01-… y fr-a2-u01-…
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`).
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-fr-sql.ts).
 */

export interface FrUnitDef extends ExpansionUnitDef {
  /**
   * Vocabulario de apoyo: formas que aparecen en textos, audios y frases sin ser palabras que se
   * practican (no entran a los repasos). Desde la unidad siguiente cuentan como conocidas. El
   * validador (content/fr-checks.ts) exige que se usen y que no estén ya enseñadas.
   */
  support: string[];
}

export interface FrLevelDef {
  language: 'fr';
  level: Level;
  first: number;
  units: readonly FrUnitDef[];
}

export const FR_COURSE: readonly FrLevelDef[] = [
  { language: 'fr', level: 'A1', first: 1, units: FR_A1_UNITS },
  { language: 'fr', level: 'A2', first: 1, units: FR_A2_UNITS },
];

/** Palabras con las que el generador descarta traducciones ambiguas: todo el francés. */
export function frKnownWords() {
  return FR_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words));
}

export const FR_PATH: PathUnit[] = FR_COURSE.flatMap(({ language, level, units }) =>
  units.map(({ unit }) => ({
    language,
    level,
    unit,
    lessons: unitPath(unit, frKnownWords(), unitId(language, level, unit), language, {
      unitWordsOnly: true,
    }),
  })),
);

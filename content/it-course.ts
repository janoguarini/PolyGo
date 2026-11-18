import { expansionKnownWords, type ExpansionUnitDef } from './a2-expansion';
import { unitId, type PathUnit } from './index';
import { unitPath } from './path';
import { IT_A1_EXTRA_UNITS } from './it/a1/extra';
import { IT_A2_UNITS } from './it/a2';
import type { Level } from './types';

/**
 * Italiano A1 completo y A2 (docs/IT_A1_A2.md).
 *
 * - A1 U13–U16: completan el A1 piloto (U1–U12, cargado y publicado), que no se toca: profesiones y
 *   el plural de los verbos, descripciones y estados, fechas y clima, transporte, tiempo libre y un
 *   primer passato prossimo.
 * - A2 U1–U12: el nivel nuevo completo.
 *
 * Como el inglés A2 U13–U17, B1, B2 y el portugués, viven en su propio camino, fuera de COURSES y de
 * CURRICULUM_PATH: no cambian la consolidación de lo cargado, sus ids, los totales que comparan la
 * base con content/ ni lo que ve la app hoy.
 *
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, con ids it-a1-u13-… y it-a2-u01-…
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`).
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-it-sql.ts).
 */

export interface ItUnitDef extends ExpansionUnitDef {
  /**
   * Vocabulario de apoyo: formas que aparecen en textos, audios y frases sin ser palabras que se
   * practican (no entran a los repasos). Desde la unidad siguiente cuentan como conocidas. El
   * validador (content/it-checks.ts) exige que se usen y que no estén ya enseñadas.
   */
  support: string[];
}

export interface ItLevelDef {
  language: 'it';
  level: Level;
  /** Primera posición: el A1 sigue a las 12 unidades piloto. */
  first: number;
  units: readonly ItUnitDef[];
}

export const IT_COURSE: readonly ItLevelDef[] = [
  { language: 'it', level: 'A1', first: 13, units: IT_A1_EXTRA_UNITS },
  { language: 'it', level: 'A2', first: 1, units: IT_A2_UNITS },
];

/** Palabras con las que el generador descarta traducciones ambiguas: todo el italiano. */
export function itKnownWords() {
  return [
    ...expansionKnownWords('it'),
    ...IT_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words)),
  ];
}

export const IT_PATH: PathUnit[] = IT_COURSE.flatMap(({ language, level, units }) =>
  units.map(({ unit }) => ({
    language,
    level,
    unit,
    lessons: unitPath(unit, itKnownWords(), unitId(language, level, unit), language, {
      unitWordsOnly: true,
    }),
  })),
);

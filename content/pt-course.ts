import { expansionKnownWords, type ExpansionUnitDef } from './a2-expansion';
import { unitId, type PathUnit } from './index';
import { unitPath } from './path';
import { PT_A1_EXTRA_UNITS } from './pt/a1/extra';
import { PT_A2_UNITS } from './pt/a2';
import type { Level } from './types';

/**
 * Portugués de Brasil A1 completo y A2 (docs/PT_A1_A2.md).
 *
 * - A1 U13–U16: completan el A1 piloto (U1–U12, cargado y publicado), que no se toca: profesiones y
 *   el plural de los verbos, estar y las descripciones, fechas y clima, transporte y tiempo libre.
 * - A2 U1–U12: el nivel nuevo completo.
 *
 * Como el inglés A2 U13–U17, B1 y B2, viven en su propio camino, fuera de COURSES y de CURRICULUM_PATH:
 * no cambian la consolidación de lo cargado, sus ids, los totales que comparan la base con content/ ni
 * lo que ve la app hoy.
 *
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, con ids pt-a1-u13-… y pt-a2-u01-…
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`).
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-pt-sql.ts).
 */

export interface PtUnitDef extends ExpansionUnitDef {
  /**
   * Vocabulario de apoyo: formas que aparecen en textos, audios y frases sin ser palabras que se
   * practican (no entran a los repasos). Desde la unidad siguiente cuentan como conocidas. El
   * validador (content/pt-checks.ts) exige que se usen y que no estén ya enseñadas.
   */
  support: string[];
}

export interface PtLevelDef {
  language: 'pt';
  level: Level;
  /** Primera posición: el A1 sigue a las 12 unidades piloto. */
  first: number;
  units: readonly PtUnitDef[];
}

export const PT_COURSE: readonly PtLevelDef[] = [
  { language: 'pt', level: 'A1', first: 13, units: PT_A1_EXTRA_UNITS },
  { language: 'pt', level: 'A2', first: 1, units: PT_A2_UNITS },
];

/** Palabras con las que el generador descarta traducciones ambiguas: todo el portugués. */
export function ptKnownWords() {
  return [
    ...expansionKnownWords('pt'),
    ...PT_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words)),
  ];
}

export const PT_PATH: PathUnit[] = PT_COURSE.flatMap(({ language, level, units }) =>
  units.map(({ unit }) => ({
    language,
    level,
    unit,
    lessons: unitPath(unit, ptKnownWords(), unitId(language, level, unit), language, {
      unitWordsOnly: true,
    }),
  })),
);

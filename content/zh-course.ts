import { expansionKnownWords, type ExpansionUnitDef } from './a2-expansion';
import { unitId, type PathUnit } from './index';
import { unitPath } from './path';
import { ZH_A1_EXTRA_UNITS } from './zh/a1/extra';
import { ZH_A2_UNITS } from './zh/a2';
import type { Level } from './types';

/**
 * Chino mandarín A1 completo y A2 (docs/ZH_A1_A2.md). Caracteres simplificados, pinyin con marcas de
 * tono y traducciones al español rioplatense.
 *
 * - A1 U13–U16: completan el A1 piloto (U1–U12, cargado y publicado), que no se toca: profesiones e
 *   idiomas, descripciones y comparaciones, fechas y clima, direcciones y el primer pasado con 了.
 * - A2 U1–U12: el nivel nuevo completo.
 *
 * Como el portugués y el italiano, viven en su propio camino, fuera de COURSES y de CURRICULUM_PATH:
 * no cambian la consolidación de lo cargado, sus ids ni lo que ve la app hoy.
 *
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, con ids zh-a1-u13-… y zh-a2-u01-…
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`).
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-zh-sql.ts).
 */

export interface ZhUnitDef extends ExpansionUnitDef {
  /**
   * Vocabulario de apoyo: palabras (en caracteres) que aparecen en textos, audios y frases sin ser
   * palabras que se practican (no entran a los repasos). Su pinyin está en
   * shared/zh-course-readings.ts, para que la app lo muestre encima. Desde la unidad siguiente
   * cuentan como conocidas. El validador (content/zh-checks.ts) exige que se usen, que tengan lectura
   * y que no estén ya enseñadas.
   */
  support: string[];
}

export interface ZhLevelDef {
  language: 'zh';
  level: Level;
  /** Primera posición: el A1 sigue a las 12 unidades piloto. */
  first: number;
  units: readonly ZhUnitDef[];
}

export const ZH_COURSE: readonly ZhLevelDef[] = [
  { language: 'zh', level: 'A1', first: 13, units: ZH_A1_EXTRA_UNITS },
  { language: 'zh', level: 'A2', first: 1, units: ZH_A2_UNITS },
];

/** Palabras con las que el generador descarta traducciones ambiguas: todo el chino. */
export function zhKnownWords() {
  return [
    ...expansionKnownWords('zh'),
    ...ZH_COURSE.flatMap((l) => l.units.flatMap((u) => u.unit.words)),
  ];
}

export const ZH_PATH: PathUnit[] = ZH_COURSE.flatMap(({ language, level, units }) =>
  units.map(({ unit }) => ({
    language,
    level,
    unit,
    lessons: unitPath(unit, zhKnownWords(), unitId(language, level, unit), language, {
      unitWordsOnly: true,
    }),
  })),
);

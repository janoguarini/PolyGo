import { expansionKnownWords, type ExpansionUnitDef } from './a2-expansion';
import { EN_B1_U01 } from './en/b1/unit01-life-experiences';
import { EN_B1_U02 } from './en/b1/unit02-habits-hobbies';
import { EN_B1_U03 } from './en/b1/unit03-anecdotes';
import { EN_B1_U04 } from './en/b1/unit04-plans-goals';
import { EN_B1_U05 } from './en/b1/unit05-work-studies';
import { EN_B1_U06 } from './en/b1/unit06-travel-culture';
import { EN_B1_U07 } from './en/b1/unit07-health';
import { EN_B1_U08 } from './en/b1/unit08-technology';
import { EN_B1_U09 } from './en/b1/unit09-environment';
import { EN_B1_U10 } from './en/b1/unit10-news';
import { EN_B1_U11 } from './en/b1/unit11-opinions';
import { EN_B1_U12 } from './en/b1/unit12-problems-solutions';
import { unitId, type PathUnit } from './index';
import { unitPath } from './path';
import type { Level } from './types';

/**
 * Inglés B1 (docs/B1_EN.md): 12 unidades nuevas que siguen al A2 completo.
 *
 * Igual que las unidades nuevas de A2 (content/a2-expansion.ts), viven en su propio camino, fuera de
 * COURSES y de CURRICULUM_PATH: no cambian la consolidación de lo cargado, sus ids, los totales que
 * comparan la base con content/ ni lo que ve la app hoy.
 *
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, en las posiciones 1–10, con ids b1-u01-…
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`).
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-b1-sql.ts).
 */

export interface B1UnitDef extends ExpansionUnitDef {
  /**
   * Vocabulario de apoyo: formas que aparecen en los textos, los audios y las frases de la unidad sin
   * ser palabras que se practican (no entran a los repasos). Un texto B1 natural necesita más palabras
   * que las enseñadas como vocabulario; se declaran acá, explícitas para la revisión, y desde la unidad
   * siguiente cuentan como conocidas. El validador (content/b1-checks.ts) exige que se usen.
   */
  support: string[];
}

export const B1: { language: string; level: Level; units: readonly B1UnitDef[] } = {
  language: 'en',
  level: 'B1',
  units: [
    EN_B1_U01,
    EN_B1_U02,
    EN_B1_U03,
    EN_B1_U04,
    EN_B1_U05,
    EN_B1_U06,
    EN_B1_U07,
    EN_B1_U08,
    EN_B1_U09,
    EN_B1_U10,
    EN_B1_U11,
    EN_B1_U12,
  ],
};

/** Palabras con las que el generador descarta traducciones ambiguas: todo lo del idioma, con B1. */
export function b1KnownWords() {
  return [...expansionKnownWords(B1.language), ...B1.units.flatMap((u) => u.unit.words)];
}

export const B1_PATH: PathUnit[] = B1.units.map(({ unit }) => ({
  language: B1.language,
  level: B1.level,
  unit,
  lessons: unitPath(unit, b1KnownWords(), unitId(B1.language, B1.level, unit), B1.language, {
    unitWordsOnly: true,
  }),
}));

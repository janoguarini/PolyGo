import type { B1UnitDef } from './b1';
import { b1KnownWords } from './b1';
import { EN_B2_U01 } from './en/b2/unit01-nuance';
import { EN_B2_U02 } from './en/b2/unit02-negotiation';
import { EN_B2_U03 } from './en/b2/unit03-society';
import { EN_B2_U04 } from './en/b2/unit04-innovation';
import { EN_B2_U05 } from './en/b2/unit05-money';
import { EN_B2_U06 } from './en/b2/unit06-relationships';
import { EN_B2_U07 } from './en/b2/unit07-global-issues';
import { EN_B2_U08 } from './en/b2/unit08-media';
import { EN_B2_U09 } from './en/b2/unit09-learning';
import { EN_B2_U10 } from './en/b2/unit10-debate';
import { EN_B2_U11 } from './en/b2/unit11-stories';
import { EN_B2_U12 } from './en/b2/unit12-decisions';
import { unitId, type PathUnit } from './index';
import { unitPath } from './path';
import type { Level } from './types';

/**
 * Inglés B2 (docs/B2_EN.md): 12 unidades nuevas que siguen al B1.
 *
 * Misma arquitectura que el B1 (content/b1.ts): camino propio, fuera de COURSES y de CURRICULUM_PATH,
 * así no cambian la consolidación de lo cargado, sus ids ni los totales que comparan la base con
 * content/.
 *
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, en las posiciones 1–10, con ids b2-u01-…
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`).
 * - Cada unidad declara su vocabulario de apoyo (`support`), como en B1.
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-b2-sql.ts).
 */

export type B2UnitDef = B1UnitDef;

export const B2: { language: string; level: Level; units: readonly B2UnitDef[] } = {
  language: 'en',
  level: 'B2',
  units: [
    EN_B2_U01,
    EN_B2_U02,
    EN_B2_U03,
    EN_B2_U04,
    EN_B2_U05,
    EN_B2_U06,
    EN_B2_U07,
    EN_B2_U08,
    EN_B2_U09,
    EN_B2_U10,
    EN_B2_U11,
    EN_B2_U12,
  ],
};

/** Palabras con las que el generador descarta traducciones ambiguas: todo lo del idioma, con B2. */
export function b2KnownWords() {
  return [...b1KnownWords(), ...B2.units.flatMap((u) => u.unit.words)];
}

export const B2_PATH: PathUnit[] = B2.units.map(({ unit }) => ({
  language: B2.language,
  level: B2.level,
  unit,
  lessons: unitPath(unit, b2KnownWords(), unitId(B2.language, B2.level, unit), B2.language, {
    unitWordsOnly: true,
  }),
}));

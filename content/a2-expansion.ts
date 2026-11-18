import { EN_A2_U13 } from './en/a2/unit13-eating-out';
import { EN_A2_U14 } from './en/a2/unit14-free-time';
import { EN_A2_U15 } from './en/a2/unit15-describing';
import { EN_A2_U16 } from './en/a2/unit16-messages';
import { EN_A2_U17 } from './en/a2/unit17-stories';
import { COURSES, unitId, type PathUnit } from './index';
import { unitPath } from './path';
import { PLANNED_PATH } from './planned';
import { SUPPLEMENT_PATH } from './supplement';
import type { Level, UnitDef } from './types';

/**
 * Inglés A2 completo (docs/A2_EN_COMPLETION.md): las unidades U13–U17, que cubren lo que las 12
 * unidades cargadas del A2 no tocan (restaurante, tiempo libre e invitaciones, describir personas y
 * lugares, mensajes y correos, contar historias con el past continuous).
 *
 * Como las unidades planificadas de A1 (content/planned.ts) viven en su propio camino, fuera de
 * COURSES y de CURRICULUM_PATH: no cambian la consolidación de las unidades cargadas, sus ids, los
 * totales que comparan la base con content/ ni lo que ve la app hoy.
 *
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, en las posiciones 1–10, con ids a2-u13-…
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`): un generado
 *   de una palabra de otra unidad sería un ítem ya activo en esa unidad.
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-a2-expansion-sql.ts). Publicarlas
 *   es una migración aparte.
 */

export interface ExpansionUnitDef {
  unit: UnitDef;
  /** Nombres propios de personajes y lugares ficticios: no son vocabulario. */
  names: string[];
}

export const A2_EXPANSION: readonly {
  language: string;
  level: Level;
  units: readonly ExpansionUnitDef[];
}[] = [
  { language: 'en', level: 'A2', units: [EN_A2_U13, EN_A2_U14, EN_A2_U15, EN_A2_U16, EN_A2_U17] },
];

/** Primera posición de las unidades nuevas: las 12 cargadas del nivel quedan igual. */
export const A2_EXPANSION_FIRST_UNIT = 13;

/** Palabras con las que el generador descarta traducciones ambiguas: todo lo del idioma. */
export function expansionKnownWords(language: string) {
  const course = COURSES.find((c) => c.language === language);
  return [
    ...(course?.levels.flatMap((l) => l.units.flatMap((u) => u.words)) ?? []),
    ...[...PLANNED_PATH, ...SUPPLEMENT_PATH]
      .filter((p) => p.language === language)
      .flatMap((p) => p.unit.words),
    ...A2_EXPANSION.filter((c) => c.language === language).flatMap((c) =>
      c.units.flatMap((u) => u.unit.words),
    ),
  ];
}

export const A2_EXPANSION_PATH: PathUnit[] = A2_EXPANSION.flatMap(({ language, level, units }) =>
  units.map(({ unit }) => ({
    language,
    level,
    unit,
    lessons: unitPath(
      unit,
      expansionKnownWords(language),
      unitId(language, level, unit),
      language,
      {
        unitWordsOnly: true,
      },
    ),
  })),
);

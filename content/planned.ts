import { EN_A1_PLANNED_UNITS } from './en/a1/context-planned';
import { EN_A1_U13 } from './en/a1/unit13-letters-personal-details';
import { EN_A1_U14 } from './en/a1/unit14-prices-shopping';
import { COURSES, unitId, type PathUnit } from './index';
import { unitPath } from './path';
import type { Level, PlannedUnitDef, PlannedWrittenUnitDef } from './types';

/**
 * Fase C.3 (docs/LEARNING_PHASE_C.md §C3): las lecciones escritas L1–L5 de las unidades planificadas
 * del mapa curricular (U13 y U14 de inglés A1).
 *
 * - Viven en su propio camino (PLANNED_PATH), fuera de COURSES y de CURRICULUM_PATH: no cambian la
 *   consolidación de las unidades cargadas, los ids publicados ni los totales que comparan la base con
 *   content/ (como las lecciones «En contexto», content/comprehension.ts).
 * - Cada unidad tiene el camino de siempre (content/path.ts): L1 · L2 · Repaso · L3 · L4 · Repaso ·
 *   L5 · Escucha · Palabras · Repaso final, en las posiciones 1–10 que la fase C.2 reservó
 *   (`PlannedUnitDef.reservedPositions`). Su «En contexto» sigue en la 11.
 * - Los repasos sólo generan ejercicios de las palabras de la unidad (`unitWordsOnly`): un ejercicio
 *   generado de una palabra de otra unidad sería un ítem generado ya activo en esa unidad.
 * - Se cargan sin publicar y con los ítems en `draft` (scripts/build-planned-units-sql.ts). Publicar,
 *   ordenar las unidades como dice el mapa y desbloquearlas es la fase siguiente.
 */

export interface PlannedWrittenCourse {
  language: string;
  level: Level;
  /** Unidades planificadas del mapa (fase C.2) de las que se escriben las lecciones. */
  planned: readonly PlannedUnitDef[];
  units: readonly PlannedWrittenUnitDef[];
}

export const PLANNED_WRITTEN: readonly PlannedWrittenCourse[] = [
  { language: 'en', level: 'A1', planned: EN_A1_PLANNED_UNITS, units: [EN_A1_U13, EN_A1_U14] },
];

/** Lecciones escritas de la unidad planificada de esa posición, o undefined. */
export const plannedWrittenDef = (language: string, level: Level, unit: number) =>
  PLANNED_WRITTEN.find((c) => c.language === language && c.level === level)?.units.find(
    (u) => u.unit.position === unit,
  );

/**
 * Palabras con las que el generador descarta traducciones ambiguas: todo el curso del idioma (A1 y
 * A2: las unidades planificadas reutilizan palabras de A2) más las de las unidades planificadas.
 */
function knownWords(language: string) {
  const course = COURSES.find((c) => c.language === language);
  const written = course?.levels.flatMap((l) => l.units.flatMap((u) => u.words)) ?? [];
  const planned = PLANNED_WRITTEN.filter((c) => c.language === language).flatMap((c) =>
    c.units.flatMap((u) => u.unit.words),
  );
  return [...written, ...planned];
}

export const PLANNED_PATH: PathUnit[] = PLANNED_WRITTEN.flatMap(
  ({ language, level, planned, units }) =>
    units.map(({ unit }) => {
      const meta = planned.find((p) => p.position === unit.position);
      if (!meta) throw new Error(`U${unit.position}: no es una unidad planificada del mapa`);
      for (const k of ['title', 'titleEn', 'description', 'emoji', 'objective'] as const) {
        if (unit[k] !== meta[k])
          throw new Error(`U${unit.position}: ${k} distinto de la unidad planificada`);
      }
      const lessons = unitPath(
        unit,
        knownWords(language),
        unitId(language, level, unit),
        language,
        {
          unitWordsOnly: true,
        },
      );
      if (lessons.length !== meta.reservedPositions) {
        throw new Error(
          `U${unit.position}: el camino tiene ${lessons.length} lecciones y la unidad reserva ${meta.reservedPositions}`,
        );
      }
      return { language, level, unit, lessons };
    }),
);

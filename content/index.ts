import { A1_UNITS } from './a1';
import { A2_UNITS } from './a2';
import { unitPath, type PathLesson } from './path';
import type { Level, UnitDef } from './types';

/** Currículo completo, nivel por nivel (ver docs/LEARNING_CURRICULUM.md). */
export const LEVELS: { level: Level; units: UnitDef[] }[] = [
  { level: 'A1', units: A1_UNITS },
  { level: 'A2', units: A2_UNITS },
];

export const unitId = (level: Level, unit: UnitDef) =>
  `${level.toLowerCase()}-u${String(unit.position).padStart(2, '0')}`;

/** Todas las palabras del currículo. */
export const ALL_WORDS = LEVELS.flatMap((l) => l.units.flatMap((u) => u.words));

export interface PathUnit {
  level: Level;
  unit: UnitDef;
  /** Lecciones escritas + consolidación generada (content/path.ts). */
  lessons: PathLesson[];
}

/**
 * Camino completo de cada unidad. La consolidación de un nivel sólo mira las palabras de ese nivel y
 * los anteriores: así agregar un nivel nuevo no cambia lo ya cargado de los anteriores.
 */
export const CURRICULUM_PATH: PathUnit[] = LEVELS.flatMap(({ level, units }, i) => {
  const known = LEVELS.slice(0, i + 1).flatMap((l) => l.units.flatMap((u) => u.words));
  return units.map((unit) => ({
    level,
    unit,
    lessons: unitPath(unit, known, unitId(level, unit)),
  }));
});

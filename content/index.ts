import { A1_UNITS } from './en/a1';
import { A2_UNITS } from './en/a2';
import { IT_A1_UNITS } from './it/a1';
import { unitPath, type PathLesson } from './path';
import { PT_A1_UNITS } from './pt/a1';
import type { CourseDef, Level, LevelDef, UnitDef } from './types';
import { ZH_A1_UNITS } from './zh/a1';

/**
 * Cursos de cada idioma, nivel por nivel (ver docs/LEARNING_CURRICULUM.md y
 * docs/CONTENT_STANDARD.md). Sólo se listan los niveles que tienen al menos una unidad.
 */
export const COURSES: CourseDef[] = [
  {
    language: 'en',
    levels: [
      { level: 'A1', units: A1_UNITS },
      { level: 'A2', units: A2_UNITS },
    ],
  },
  { language: 'it', levels: [{ level: 'A1', units: IT_A1_UNITS }] },
  { language: 'pt', levels: [{ level: 'A1', units: PT_A1_UNITS }] },
  { language: 'zh', levels: [{ level: 'A1', units: ZH_A1_UNITS }] },
];

/** Niveles del inglés (el currículo original). */
export const LEVELS: LevelDef[] = COURSES[0]!.levels;

/** Prefijo de los ids de unidad y lección: el inglés conserva los históricos (a1-u01). */
export const idPrefix = (language: string) => (language === 'en' ? '' : `${language}-`);

export const unitId = (language: string, level: Level, unit: UnitDef) =>
  `${idPrefix(language)}${level.toLowerCase()}-u${String(unit.position).padStart(2, '0')}`;

/** Todas las palabras del currículo, de todos los idiomas. */
export const ALL_WORDS = COURSES.flatMap((c) =>
  c.levels.flatMap((l) => l.units.flatMap((u) => u.words)),
);

export interface PathUnit {
  language: string;
  level: Level;
  unit: UnitDef;
  /** Lecciones escritas + consolidación generada (content/path.ts). */
  lessons: PathLesson[];
}

/**
 * Camino completo de cada unidad. La consolidación de un nivel sólo mira las palabras de su idioma,
 * de ese nivel y de los anteriores: así agregar un nivel o un idioma no cambia lo ya cargado.
 */
export const CURRICULUM_PATH: PathUnit[] = COURSES.flatMap(({ language, levels }) =>
  levels.flatMap(({ level, units }, i) => {
    const known = levels.slice(0, i + 1).flatMap((l) => l.units.flatMap((u) => u.words));
    return units.map((unit) => ({
      language,
      level,
      unit,
      lessons: unitPath(unit, known, unitId(language, level, unit), language),
    }));
  }),
);

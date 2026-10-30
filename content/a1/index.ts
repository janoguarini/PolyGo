import { unitPath } from '../path';
import type { UnitDef } from '../types';
import { unit01 } from './unit01-greetings';
import { unit02 } from './unit02-to-be';
import { unit03 } from './unit03-numbers-countries';
import { unit04 } from './unit04-family';
import { unit05 } from './unit05-objects';
import { unit06 } from './unit06-home';
import { unit07 } from './unit07-food';
import { unit08 } from './unit08-routines';
import { unit09 } from './unit09-time';
import { unit10 } from './unit10-city';
import { unit11 } from './unit11-likes';
import { unit12 } from './unit12-questions';

/**
 * Currículo de inglés A1 (ver docs/LEARNING_CURRICULUM.md).
 * Todo el contenido está en review_status = 'draft' hasta pasar revisión editorial humana.
 */
export const A1_UNITS: UnitDef[] = [
  unit01,
  unit02,
  unit03,
  unit04,
  unit05,
  unit06,
  unit07,
  unit08,
  unit09,
  unit10,
  unit11,
  unit12,
];

export const unitId = (unit: UnitDef) => `a1-u${String(unit.position).padStart(2, '0')}`;
export const lessonId = (unit: UnitDef, index: number) =>
  `${unitId(unit)}-l${String(index + 1).padStart(2, '0')}`;
export const exerciseId = (unit: UnitDef, lessonIndex: number, index: number) =>
  `${lessonId(unit, lessonIndex)}-e${String(index + 1).padStart(2, '0')}`;

/** Todas las palabras del A1 (para detectar ambigüedades al generar consolidación). */
export const A1_WORDS = A1_UNITS.flatMap((u) => u.words);

/** Camino completo de cada unidad: lecciones escritas + consolidación generada. */
export const A1_PATH = A1_UNITS.map((unit) => ({ unit, lessons: unitPath(unit, A1_WORDS) }));

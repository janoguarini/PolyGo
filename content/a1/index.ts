import type { UnitDef } from '../types';
import { unit01 } from './unit01-greetings';
import { unit02 } from './unit02-to-be';
import { unit03 } from './unit03-numbers-countries';

/**
 * Currículo de inglés A1 (ver docs/LEARNING_CURRICULUM.md).
 * Unidades 4–12 planificadas, todavía sin contenido.
 * Todo el contenido está en review_status = 'draft' hasta pasar revisión editorial humana.
 */
export const A1_UNITS: UnitDef[] = [unit01, unit02, unit03];

export const unitId = (unit: UnitDef) => `a1-u${String(unit.position).padStart(2, '0')}`;
export const lessonId = (unit: UnitDef, index: number) =>
  `${unitId(unit)}-l${String(index + 1).padStart(2, '0')}`;
export const exerciseId = (unit: UnitDef, lessonIndex: number, index: number) =>
  `${lessonId(unit, lessonIndex)}-e${String(index + 1).padStart(2, '0')}`;

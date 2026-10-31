import type { UnitDef } from '../types';
import { unit01 } from './unit01-was-were';
import { unit02 } from './unit02-past-regular';
import { unit03 } from './unit03-past-irregular';
import { unit04 } from './unit04-travel';
import { unit05 } from './unit05-present-continuous';
import { unit06 } from './unit06-clothes-shopping';
import { unit07 } from './unit07-comparatives';
import { unit08 } from './unit08-future';
import { unit09 } from './unit09-health';
import { unit10 } from './unit10-work';
import { unit11 } from './unit11-weather';
import { unit12 } from './unit12-experiences';

/**
 * Currículo de inglés A2 (ver docs/LEARNING_CURRICULUM.md). Supone el A1 completo: los ejercicios
 * pueden usar todas sus palabras. Todo en review_status = 'draft' hasta la revisión editorial humana.
 */
export const A2_UNITS: UnitDef[] = [
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

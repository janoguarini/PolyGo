import type { WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { ES_B1_U01, ES_B1_U01_WRITING } from './unit01-experiencias';
import { ES_B1_U02, ES_B1_U02_WRITING } from './unit02-pasatiempos';
import { ES_B1_U03, ES_B1_U03_WRITING } from './unit03-anecdotas';
import { ES_B1_U04, ES_B1_U04_WRITING } from './unit04-planes-metas';
import { ES_B1_U05, ES_B1_U05_WRITING } from './unit05-trabajo-estudios';
import { ES_B1_U06, ES_B1_U06_WRITING } from './unit06-viajes-cultura';
import { ES_B1_U07, ES_B1_U07_WRITING } from './unit07-salud-bienestar';
import { ES_B1_U08, ES_B1_U08_WRITING } from './unit08-tecnologia';
import { ES_B1_U09, ES_B1_U09_WRITING } from './unit09-medio-ambiente';
import { ES_B1_U10, ES_B1_U10_WRITING } from './unit10-noticias';
import { ES_B1_U11, ES_B1_U11_WRITING } from './unit11-opiniones';
import { ES_B1_U12, ES_B1_U12_WRITING } from './unit12-problemas';

/** Español B1 U1–U12 (docs/ES_B1.md). Vive en su propio camino (ES_B1_PATH, content/es-course.ts). */
export const ES_B1_UNITS: readonly EsUnitDef[] = [
  ES_B1_U01,
  ES_B1_U02,
  ES_B1_U03,
  ES_B1_U04,
  ES_B1_U05,
  ES_B1_U06,
  ES_B1_U07,
  ES_B1_U08,
  ES_B1_U09,
  ES_B1_U10,
  ES_B1_U11,
  ES_B1_U12,
];

/** Escritura del B1: una guiada por unidad y tres libres (U4, U8 y U12). */
export const ES_B1_WRITING_TASKS: readonly WritingTaskDef[] = [
  ...ES_B1_U01_WRITING,
  ...ES_B1_U02_WRITING,
  ...ES_B1_U03_WRITING,
  ...ES_B1_U04_WRITING,
  ...ES_B1_U05_WRITING,
  ...ES_B1_U06_WRITING,
  ...ES_B1_U07_WRITING,
  ...ES_B1_U08_WRITING,
  ...ES_B1_U09_WRITING,
  ...ES_B1_U10_WRITING,
  ...ES_B1_U11_WRITING,
  ...ES_B1_U12_WRITING,
];

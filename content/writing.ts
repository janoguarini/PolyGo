import type { WritingTaskDef } from '../shared/writing';
import { EN_A1_WRITING_TASKS } from './en/a1/writing';
import { EN_A2_WRITING_TASKS } from './en/a2/writing';
import { EN_B1_WRITING_TASKS } from './en/b1/writing';
import { EN_B2_WRITING_TASKS } from './en/b2/writing';
import { ES_WRITING_TASKS } from './es/writing';
import { ES_B1_WRITING_TASKS } from './es/b1';
import { FR_WRITING_TASKS } from './fr/writing';
import { IT_WRITING_TASKS } from './it/writing';
import { PT_WRITING_TASKS } from './pt/writing';
import { ZH_WRITING_TASKS } from './zh/writing';

/**
 * Todas las tareas de escritura que viajan con la app (A1: docs/A1_EN_CLOSURE.md §6; A2:
 * docs/A2_EN_COMPLETION.md §5; B1: docs/B1_EN.md; B2: docs/B2_EN.md). Práctica opcional: no se guardan ni cuentan para el progreso.
 */
export const WRITING_TASKS: readonly WritingTaskDef[] = [
  ...EN_A1_WRITING_TASKS,
  ...EN_A2_WRITING_TASKS,
  ...EN_B1_WRITING_TASKS,
  ...EN_B2_WRITING_TASKS,
  // Portugués de Brasil A1 y A2 (docs/PT_A1_A2.md).
  ...PT_WRITING_TASKS,
  // Italiano A1 y A2 (docs/IT_A1_A2.md).
  ...IT_WRITING_TASKS,
  // Chino mandarín A1 y A2 (docs/ZH_A1_A2.md).
  ...ZH_WRITING_TASKS,
  // Francés A1 y A2 (docs/FR_A1_A2.md).
  ...FR_WRITING_TASKS,
  // Español rioplatense A1 y A2, con apoyo en inglés (docs/ES_A1_A2.md).
  ...ES_WRITING_TASKS,
  ...ES_B1_WRITING_TASKS,
];

export const writingTask = (id: string) => WRITING_TASKS.find((t) => t.id === id);

/** Tareas que se ofrecen al terminar una lección (la guiada de la lección o la libre del bloque). */
export const writingTasksForLesson = (lessonId: string) =>
  WRITING_TASKS.filter((t) => t.lesson === lessonId);

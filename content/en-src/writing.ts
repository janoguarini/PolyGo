import type { WritingTaskDef } from '../../shared/writing';
import { EN_A1_WRITING_TASKS } from '../en/a1/writing';
import { EN_A2_WRITING_TASKS } from '../en/a2/writing';
import { EN_B1_WRITING_TASKS } from '../en/b1/writing';
import { EN_B2_WRITING_TASKS } from '../en/b2/writing';
import type { SupportFn } from './support';

/**
 * Tareas de escritura del inglés A1–B1 (content/en/<nivel>/writing.ts), con la unidad a la que
 * pertenecen. Se localizan como el resto de la capa de apoyo: título, consigna, glosario, requisitos y
 * lista de control. Las preguntas guía y el modelo están en inglés y no cambian.
 */
export function enWritingTasks(): { unit: string; task: WritingTaskDef }[] {
  return [
    ...EN_A1_WRITING_TASKS,
    ...EN_A2_WRITING_TASKS,
    ...EN_B1_WRITING_TASKS,
    ...EN_B2_WRITING_TASKS,
  ].map((task) => {
    const unit = /^([ab]\d-u\d{2})-/.exec(task.lesson ?? '')?.[1];
    if (!unit) throw new Error(`${task.id}: sin lección de unidad`);
    return { unit, task };
  });
}

export function mapWritingSupport(t: WritingTaskDef, f: SupportFn): WritingTaskDef {
  return {
    ...t,
    title: f(t.title, 'writing.title'),
    instructions: f(t.instructions, 'writing.instructions'),
    ...(t.glossary
      ? { glossary: t.glossary.map((g) => ({ term: g.term, meaning: f(g.meaning, 'writing.glossary', g.term) })) }
      : {}),
    requirements: t.requirements.map((r) => ({ ...r, label: f(r.label, 'writing.requirement') })),
    checklist: t.checklist.map((c) => f(c, 'writing.checklist')),
  };
}

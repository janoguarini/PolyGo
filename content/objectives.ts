import type { Level } from './types';

/**
 * Objetivos de aprendizaje (arquitectura de datos rev. 8, §4.3 y §4.5; tablas `learning_objectives`,
 * `objective_concepts`, `lesson_objectives` e `item_objectives`, migración
 * 20261107160000_learning_objectives.sql).
 *
 * Hoy está vacío a propósito. §18 limita la fase 1 a objetivos de inglés A1 en `draft` hasta la
 * revisión pedagógica (P8), y la definición editorial no está escrita: id, actividad del MCER,
 * descriptor, conceptos core/support, rol en cada lección e ítems que lo evalúan. No se deducen de
 * `UnitDef.objective` ni de `LessonDef.objective` (son textos para la interfaz, sin actividad ni
 * relaciones) ni se inventan equivalencias entre idiomas (`groupKey`). Qué falta definir:
 * docs/LEARNING_CATALOG_PHASE1.md, §8.
 */

export type CefrActivity =
  'listening' | 'reading' | 'speaking' | 'writing' | 'interaction' | 'mediation';

export type ObjectiveStatus = 'draft' | 'active' | 'retired';
export type ObjectiveConceptRole = 'core' | 'support';
export type LessonObjectiveRole = 'introduce' | 'practice' | 'consolidate' | 'assess';

export interface ObjectiveDef {
  /** `<idioma>.<nivel>.obj.<slug>` (p. ej. `en.a1.obj.introduce-yourself`). */
  id: string;
  language: string;
  level: Level;
  /** Obligatoria (§4.3). */
  cefrActivity: CefrActivity;
  /** «Podés…». */
  canDo: string;
  description?: string;
  /** Descriptor del MCER. */
  cefrRef?: string;
  /** Equivalencia entre idiomas (D5): sólo si está definida editorialmente. */
  groupKey?: string;
  position: number;
  /** `draft` hasta la revisión pedagógica (P8). */
  status: ObjectiveStatus;
  concepts: { concept: string; role: ObjectiveConceptRole }[];
  lessons: { lesson: string; role: LessonObjectiveRole }[];
  /** Ids de ítem que evalúan el objetivo. */
  items: string[];
}

export const LEARNING_OBJECTIVES: readonly ObjectiveDef[] = [];

const OBJECTIVE_ID = /^([a-z]{2,3})\.([a-c][12])\.obj\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CEFR_ACTIVITIES: readonly CefrActivity[] = [
  'listening',
  'reading',
  'speaking',
  'writing',
  'interaction',
  'mediation',
];

/** Lo que el catálogo conoce para validar las relaciones de un objetivo. */
export interface ObjectiveScope {
  /** concepto → idioma */
  concepts: ReadonlyMap<string, string>;
  /** lección → idioma */
  lessons: ReadonlyMap<string, string>;
  /** ítem → idioma */
  items: ReadonlyMap<string, string>;
}

/**
 * Problemas de un conjunto de objetivos (vacío si son válidos). Sin `scope`, sólo los propios de cada
 * objetivo (id, idioma, nivel, actividad, textos, repetidos); con `scope` (el currículo completo),
 * además que cada concepto, lección e ítem exista y sea del idioma del objetivo.
 */
export function objectiveProblems(defs: readonly ObjectiveDef[], scope?: ObjectiveScope): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  const groups = new Set<string>();
  for (const o of defs) {
    const m = OBJECTIVE_ID.exec(o.id);
    if (!m) problems.push(`${o.id}: el id tiene que ser <idioma>.<nivel>.obj.<slug>`);
    else if (m[1] !== o.language || m[2] !== o.level.toLowerCase())
      problems.push(`${o.id}: el prefijo no es ${o.language}.${o.level.toLowerCase()}`);
    if (seen.has(o.id)) problems.push(`${o.id}: id duplicado`);
    seen.add(o.id);
    if (!(['draft', 'active', 'retired'] as const).includes(o.status))
      problems.push(`${o.id}: estado ${String(o.status)} inválido`);
    if (!CEFR_ACTIVITIES.includes(o.cefrActivity))
      problems.push(`${o.id}: actividad del MCER ${String(o.cefrActivity)} inexistente`);
    if (!o.canDo.trim()) problems.push(`${o.id}: falta canDo`);
    if (!Number.isInteger(o.position) || o.position <= 0)
      problems.push(`${o.id}: posición inválida`);
    if (o.groupKey !== undefined) {
      const key = `${o.groupKey}|${o.language}`;
      if (groups.has(key))
        problems.push(`${o.id}: groupKey ${o.groupKey} repetido en ${o.language}`);
      groups.add(key);
    }
    for (const c of o.concepts)
      if (c.role !== 'core' && c.role !== 'support')
        problems.push(`${o.id}: rol ${String(c.role)} inválido para ${c.concept}`);
    for (const l of o.lessons)
      if (!['introduce', 'practice', 'consolidate', 'assess'].includes(l.role))
        problems.push(`${o.id}: rol ${String(l.role)} inválido para ${l.lesson}`);
    const twice = (list: string[], what: string) => {
      const dup = list.find((x, i) => list.indexOf(x) !== i);
      if (dup) problems.push(`${o.id}: ${what} ${dup} repetido`);
    };
    twice(
      o.concepts.map((c) => c.concept),
      'concepto',
    );
    twice(
      o.lessons.map((l) => l.lesson),
      'lección',
    );
    twice(o.items, 'ítem');
    if (!scope) continue;
    const check = (ids: string[], known: ReadonlyMap<string, string>, what: string) => {
      for (const id of ids) {
        const language = known.get(id);
        if (!language) problems.push(`${o.id}: ${what} ${id} inexistente`);
        else if (language !== o.language)
          problems.push(`${o.id}: ${what} ${id} es de ${language}, no de ${o.language}`);
      }
    };
    check(
      o.concepts.map((c) => c.concept),
      scope.concepts,
      'concepto',
    );
    check(
      o.lessons.map((l) => l.lesson),
      scope.lessons,
      'lección',
    );
    check(o.items, scope.items, 'ítem');
  }
  return problems;
}

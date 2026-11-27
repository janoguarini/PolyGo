import type { ContextStimulus } from '../shared/exercises';
import { A2_EXPANSION_PATH } from './a2-expansion';
import { B1_PATH } from './b1';
import { B2_PATH } from './b2';
import { ES_PATH } from './es-course';
import { FR_PATH } from './fr-course';
import { IT_PATH } from './it-course';
import { PT_PATH } from './pt-course';
import { ZH_PATH } from './zh-course';
import {
  COMPREHENSION_CODES,
  EN_A1_COMPREHENSION_MAP,
  comprehensionObjectiveId,
  curriculumCode,
  type ComprehensionCode,
} from './comprehension-map';
import { EN_A1_CONTEXT_LESSONS } from './en/a1/context';
import { EN_A1_PLANNED_CONTEXT_LESSONS, EN_A1_PLANNED_UNITS } from './en/a1/context-planned';
import { COURSES, CURRICULUM_PATH, unitId, type PathUnit } from './index';
import { buildCatalog, type Catalog } from './catalog';
import type { CefrActivity, ObjectiveDef } from './objectives';
import type { PathLesson } from './path';
import { PLANNED_PATH } from './planned';
import { SUPPLEMENT_PATH } from './supplement';
import type { ContextLessonDef, ExerciseDef, Level, PlannedUnitDef, UnitDef } from './types';

/**
 * Fase C: comprensión lectora y auditiva en contexto (docs/LEARNING_PHASE_C.md).
 *
 * - Las lecciones «En contexto» viven en su propio camino (COMPREHENSION_PATH), fuera de
 *   CURRICULUM_PATH: no cambian la consolidación generada, los ids publicados ni los totales que
 *   comparan la base con content/. Van al final de su unidad y se cargan SIN publicar
 *   (scripts/build-comprehension-sql.ts): ningún recorrido activo las ve hasta la revisión pedagógica.
 * - Cada pregunta es un ítem `context_choice` con modo reading_comprehension o
 *   listening_comprehension (dimensión `comprehension`), formato select, corrección exact_option.
 * - `words` queda vacío (no entra en exercise_words ni en el SRS léxico v1); los conceptos target van
 *   en `concepts` (§4.3: cada concepto léxico target da vocabulary + comprehension).
 * - Objetivos: los de comprensión del mapa curricular (content/comprehension-map.ts), en `draft`;
 *   `cL01` ↔ `en.a1.obj.cl01` (fase C.1, docs/LEARNING_PHASE_C.md §C1).
 * - Posición: `lessons.position` es la del camino (después de la consolidación de la unidad, D2); el
 *   número de lección del mapa (L6/L7) va aparte, en `ContextLessonDef.curriculumLesson`.
 */

/**
 * Lecciones «En contexto» de cada idioma y nivel. Sólo inglés A1: U1–U12 (fase C y C.1) y U13–U14
 * (fase C.2), estas dos en unidades planificadas (`plannedUnits`): las del mapa curricular que
 * todavía no tienen lecciones escritas. Se cargan sin publicar, sin palabras ni lecciones propias.
 */
export const CONTEXT_LESSONS: readonly {
  language: string;
  level: Level;
  lessons: readonly ContextLessonDef[];
  plannedUnits: readonly PlannedUnitDef[];
}[] = [
  {
    language: 'en',
    level: 'A1',
    lessons: [...EN_A1_CONTEXT_LESSONS, ...EN_A1_PLANNED_CONTEXT_LESSONS],
    plannedUnits: EN_A1_PLANNED_UNITS,
  },
];

/** Unidad planificada (sin lecciones escritas) de esa posición, o undefined. */
export const plannedUnitDef = (language: string, level: Level, unit: number) =>
  CONTEXT_LESSONS.find((c) => c.language === language && c.level === level)?.plannedUnits.find(
    (u) => u.position === unit,
  );

/**
 * Hasta qué unidad escrita se mide el vocabulario enseñado a una lección «En contexto»: la propia
 * unidad, o la unidad tras la que el mapa intercala una planificada (U13 → U3, U14 → U7).
 */
export const taughtThrough = (language: string, level: Level, unit: number) =>
  plannedUnitDef(language, level, unit)?.after ?? unit;

/** La unidad planificada como UnitDef: sin palabras ni lecciones (no entra en COURSES). */
const plannedAsUnit = ({
  after: _after,
  reservedPositions: _reserved,
  plannedLessons: _planned,
  ...unit
}: PlannedUnitDef): UnitDef => ({ ...unit, words: [], lessons: [] });

export const contextLessonId = (unitId: string) => `${unitId}-context`;

/** Definición de la lección «En contexto» de una unidad (o undefined). */
export const contextLessonDef = (language: string, level: Level, unit: number) =>
  CONTEXT_LESSONS.find((c) => c.language === language && c.level === level)?.lessons.find(
    (l) => l.unit === unit,
  );

/**
 * Camino de la fase C: una PathUnit por lección «En contexto», con la unidad real (para su id) pero
 * sin palabras ni lecciones propias (ya están en CURRICULUM_PATH). La lección va después de la última
 * de la unidad. En una unidad planificada (U13, U14) va después de las posiciones reservadas para sus
 * lecciones escritas y su consolidación (11, como en las unidades escritas de inglés A1).
 */
export const COMPREHENSION_PATH: PathUnit[] = CONTEXT_LESSONS.flatMap(
  ({ language, level, lessons, plannedUnits }) =>
    lessons.map((def) => {
      const written = CURRICULUM_PATH.find(
        (p) => p.language === language && p.level === level && p.unit.position === def.unit,
      );
      const planned = plannedUnits.find((u) => u.position === def.unit);
      if (written && planned) throw new Error(`U${def.unit} es escrita y planificada a la vez`);
      const base = written ?? (planned && { unit: plannedAsUnit(planned), lessons: [] });
      if (!base) throw new Error(`Lección en contexto de una unidad inexistente: ${def.unit}`);
      const position = (written ? written.lessons.length : planned!.reservedPositions) + 1;
      const id = contextLessonId(unitId(language, level, base.unit));
      const lesson: PathLesson = {
        title: def.title,
        objective: def.objective,
        ...(def.intro ? { intro: def.intro } : {}),
        ...(def.takeaways ? { takeaways: def.takeaways } : {}),
        exercises: def.exercises,
        id,
        kind: 'context',
        position,
      };
      return { language, level, unit: { ...base.unit, words: [], lessons: [] }, lessons: [lesson] };
    }),
);

/**
 * Todo lo que registra content/ids.lock.json: el currículo, las lecciones «En contexto», las
 * lecciones escritas de las unidades planificadas (fase C.3, content/planned.ts), el cierre de A1
 * (content/supplement.ts), las unidades nuevas de A2 (content/a2-expansion.ts), el B1 (content/b1.ts), el B2 (content/b2.ts) el portugués A1 U13–U16 / A2 (content/pt-course.ts), el italiano A1 U13–U16 / A2 (content/it-course.ts) y el chino A1 U13–U16 / A2 (content/zh-course.ts), el francés A1 / A2 (content/fr-course.ts) y el español A1 / A2 (content/es-course.ts).
 */
export const ITEM_REGISTRY_PATH: PathUnit[] = [
  ...CURRICULUM_PATH,
  ...COMPREHENSION_PATH,
  ...PLANNED_PATH,
  ...SUPPLEMENT_PATH,
  ...A2_EXPANSION_PATH,
  ...B1_PATH,
  ...B2_PATH,
  ...PT_PATH,
  ...IT_PATH,
  ...ZH_PATH,
  ...FR_PATH,
  ...ES_PATH,
];

/**
 * Catálogo que valida el registro de ids: el del currículo (o el que arma un generador, p. ej. el
 * del diff) más los ítems de la fase C y de las unidades planificadas. Sólo items, conceptos y
 * ubicaciones: lo que mira content/ids-lock.ts. Un ítem de un tramo no puede repetir el id de otro
 * (un generado de las unidades planificadas sería el mismo ítem activo de su unidad).
 */
export function registryCatalog(base: Catalog = buildCatalog(CURRICULUM_PATH)): Catalog {
  const extras = [
    buildCatalog(COMPREHENSION_PATH),
    buildCatalog(PLANNED_PATH),
    buildCatalog(SUPPLEMENT_PATH),
    buildCatalog(A2_EXPANSION_PATH),
    buildCatalog(B1_PATH),
    buildCatalog(B2_PATH),
    buildCatalog(PT_PATH),
    buildCatalog(IT_PATH),
    buildCatalog(ZH_PATH),
    buildCatalog(FR_PATH),
    buildCatalog(ES_PATH),
  ];
  const items = [...base.items, ...extras.flatMap((e) => e.items)];
  const seen = new Set<string>();
  for (const i of items) {
    if (seen.has(i.id)) throw new Error(`Ítem ${i.id} repetido entre tramos del registro`);
    seen.add(i.id);
  }
  return {
    ...base,
    items,
    item_concepts: [...base.item_concepts, ...extras.flatMap((e) => e.item_concepts)],
    placements: [...base.placements, ...extras.flatMap((e) => e.placements)],
  };
}

/** Objetivo del mapa que evalúa un ejercicio «En contexto» (por su estímulo). */
export function exerciseObjective(def: ContextLessonDef, e: ExerciseDef): ComprehensionCode {
  if (e.payload.type !== 'context_choice') throw new Error(`${e.id}: no es context_choice`);
  const code = def.stimulusObjectives[e.payload.stimulus.id];
  if (!code) throw new Error(`${e.payload.stimulus.id}: estímulo sin objetivo del mapa`);
  return code;
}

/**
 * Objetivos de comprensión del mapa curricular (content/comprehension-map.ts): uno por código, en
 * `draft`, compartido por todas las lecciones que lo practican. Sólo los que tienen ejercicios en
 * esta fase (los once de inglés A1). Relaciones derivadas del contenido: los ítems de los estímulos
 * asignados al objetivo, sus conceptos target como `core` y cada lección con rol `practice`.
 */
export const COMPREHENSION_OBJECTIVES: readonly ObjectiveDef[] = CONTEXT_LESSONS.flatMap(
  ({ language, level }) =>
    COMPREHENSION_CODES.flatMap((code, i) => {
      const linked = COMPREHENSION_PATH.filter(
        (p) => p.language === language && p.level === level,
      ).flatMap(({ unit, lessons }) => {
        const def = contextLessonDef(language, level, unit.position)!;
        const lesson = lessons[0]!;
        const exercises = lesson.exercises.filter((e) => exerciseObjective(def, e) === code);
        return exercises.length ? [{ lesson: lesson.id, exercises }] : [];
      });
      if (!linked.length) return [];
      const meta = EN_A1_COMPREHENSION_MAP[code];
      const exercises = linked.flatMap((l) => l.exercises);
      const concepts = [...new Set(exercises.flatMap((e) => e.concepts ?? []))].sort();
      return [
        {
          id: comprehensionObjectiveId(language, level, code),
          language,
          level,
          cefrActivity: meta.activity satisfies CefrActivity,
          canDo: `Puedes ${meta.objective.charAt(0).toLowerCase()}${meta.objective.slice(1)}.`,
          description:
            `Código curricular ${curriculumCode(language, level, code)} del mapa curricular de ` +
            `inglés A1 (docs/polygo-ingles-a1-mapa-curricular.md). Borrador: pendiente de revisión ` +
            `pedagógica (P8) y del cotejo de las anclas con el MCER 2020.`,
          cefrRef: meta.anchors,
          position: 1000 + i + 1,
          status: 'draft' as const,
          concepts: concepts.map((concept) => ({ concept, role: 'core' as const })),
          lessons: linked.map((l) => ({ lesson: l.lesson, role: 'practice' as const })),
          items: exercises.map((e) => e.id!),
        },
      ];
    }),
);

/** Formas sueltas (por palabra) de las unidades de un idioma y nivel hasta `upTo` inclusive. */
export function taughtTokens(language: string, level: Level, upTo: number): Set<string> {
  const course = COURSES.find((c) => c.language === language)!;
  const units = course.levels
    .filter((l) => l.level <= level)
    .flatMap((l) => (l.level === level ? l.units.filter((u) => u.position <= upTo) : l.units));
  const out = new Set<string>();
  for (const w of units.flatMap((u) => u.words)) {
    for (const form of [w.text, ...(w.acceptedTexts ?? [])]) {
      for (const t of tokensOfText(form)) out.add(t);
    }
  }
  return out;
}

/** Palabras de un texto en minúsculas, sin puntuación ni números. */
export function tokensOfText(text: string): string[] {
  return (
    text
      .toLowerCase()
      .replace(/[’]/g, "'")
      .match(/[a-z]+(?:'[a-z]+)?/g) ?? []
  );
}

/** Variantes con las que una palabra flexionada puede estar enseñada (keys → key, studies → study). */
export function lemmaCandidates(token: string): string[] {
  const out = [token];
  if (token.endsWith('ies')) out.push(`${token.slice(0, -3)}y`);
  if (token.endsWith('es')) out.push(token.slice(0, -2));
  if (token.endsWith('s')) out.push(token.slice(0, -1));
  if (token.endsWith("'s")) out.push(token.slice(0, -2));
  return out;
}

/** Texto en el idioma que se aprende de un estímulo (lo que se lee o se oye). */
export const stimulusText = (s: ContextStimulus) =>
  s.kind === 'reading'
    ? [s.title ?? '', ...s.lines].join(' ')
    : s.lines.map((l) => l.text).join(' ');

/** Nombres propios del estímulo (emisor, destinatario y hablantes): no son vocabulario. */
export const stimulusNames = (s: ContextStimulus) =>
  s.kind === 'reading'
    ? [s.from, s.to].filter((x): x is string => !!x)
    : s.speakers.map((p) => p.name);

import { COMPREHENSION_CODES, type ComprehensionCode } from './comprehension-map';
import { COMPREHENSION_OBJECTIVES } from './comprehension';
import type { ObjectiveDef } from './objectives';
import { PLANNED_PATH, plannedWrittenDef } from './planned';
import type { ExerciseDef } from './types';

/**
 * Objetivos de las lecciones escritas de las unidades planificadas (fase C.3, docs/LEARNING_PHASE_C.md
 * §C3). No se crea ningún objetivo: sólo se reutilizan los de comprensión del mapa que ya existen
 * (content/comprehension.ts, fase C.1) y que el mapa asigna a estas lecciones:
 *
 *   U13 L1 El alfabeto       → cL01 (secundario)   ítems: las escuchas (LC, «escuchar → transcripción»)
 *   U13 L2 Deletrear         → cL02 (secundario)   sin ítems: el mapa la practica con LQ/LM, que no hay
 *   U13 L5 Formulario        → cR01 (secundario)   ítems: las preguntas sobre el formulario (RQ)
 *   U14 L2 Precios y dinero  → cL03 (secundario)   sin ítems: el mapa la practica con LD/LQ, que no hay
 *
 * Un ítem sólo se vincula si su formato es uno de los que el mapa lista en «Practicar» para ese
 * objetivo (§2, tabla «Comprehension»). La lección se vincula siempre, con rol `practice`.
 *
 * Los objetivos principales de estas lecciones (v02, v03, g16, g23, p01, p10) todavía no existen en la
 * base: como en las fases C.1 y C.2 no se inventan acá (su actividad del MCER y sus relaciones con el
 * resto del currículo son una decisión editorial). Quedan en `PlannedWrittenUnitDef.curriculum`.
 */

/** Formatos del mapa («Practicar») que existen hoy, por objetivo de comprensión. */
const PRACTICE_FORMATS: Partial<Record<ComprehensionCode, (e: ExerciseDef) => boolean>> = {
  // LC: escuchar → elegir la transcripción.
  cL01: (e) => e.type === 'listen_choice',
  // RQ: texto breve → pregunta con un dato. Las respuestas breves sobre un formulario (campo: dato).
  cR01: (e) =>
    e.type === 'short_answer' &&
    /\b[A-Z][a-z ]+: /.test(e.payload.type === 'short_answer' ? e.payload.question : ''),
};

const isComprehension = (code: string): code is ComprehensionCode =>
  (COMPREHENSION_CODES as readonly string[]).includes(code);

/** Vínculos lección → objetivo de comprensión, con los ítems de esa lección que lo practican. */
export const PLANNED_OBJECTIVE_LINKS = PLANNED_PATH.flatMap(
  ({ language, level, unit, lessons }) => {
    const def = plannedWrittenDef(language, level, unit.position)!;
    return lessons
      .filter((l) => l.kind === 'lesson')
      .flatMap((lesson, i) => {
        const codes = [...def.curriculum[i]!.primary, ...def.curriculum[i]!.secondary].filter(
          isComprehension,
        );
        return codes.map((code) => ({
          language,
          level,
          code,
          lesson: lesson.id,
          items: lesson.exercises.filter((e) => PRACTICE_FORMATS[code]?.(e) ?? false),
        }));
      });
  },
);

/**
 * Los objetivos de comprensión que las lecciones escritas reutilizan, con sus relaciones de la fase C
 * más las nuevas: la lección (`practice`), sus ítems y los conceptos target de esos ítems (`core`).
 * Es lo que carga la migración de la fase C.3 (scripts/build-planned-units-sql.ts): OBJECTIVES_SQL
 * exige el conjunto completo de conceptos de cada objetivo que el documento incluye.
 */
export const PLANNED_OBJECTIVES: readonly ObjectiveDef[] = COMPREHENSION_OBJECTIVES.flatMap((o) => {
  const links = PLANNED_OBJECTIVE_LINKS.filter(
    (l) =>
      l.language === o.language &&
      l.level === o.level &&
      o.id.endsWith(`.obj.${l.code.toLowerCase()}`),
  );
  if (!links.length) return [];
  const items = links.flatMap((l) => l.items);
  const concepts = [
    ...new Set([...o.concepts.map((c) => c.concept), ...items.flatMap((e) => e.words)]),
  ].sort();
  return [
    {
      ...o,
      concepts: concepts.map((concept) => ({ concept, role: 'core' as const })),
      lessons: [
        ...o.lessons,
        ...links.map((l) => ({ lesson: l.lesson, role: 'practice' as const })),
      ],
      items: [...o.items, ...items.map((e) => e.id!)],
    },
  ];
});

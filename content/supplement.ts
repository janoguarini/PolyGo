import { EN_A1_SUPPLEMENTS } from './en/a1/closure';
import { CURRICULUM_PATH, type PathUnit } from './index';
import type { PathLesson } from './path';
import { PLANNED_PATH } from './planned';
import type { Level, UnitSupplementDef } from './types';

/**
 * Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): camino de los agregados del mapa curricular a unidades
 * que ya tienen lecciones (content/en/a1/closure.ts). Como la fase C y la C.3, vive fuera de
 * COURSES y de CURRICULUM_PATH: la consolidación generada, los ids publicados y los totales que
 * comparan la base con content/ no cambian.
 *
 * - Agregado a una lección cargada: la misma lección (mismo id, posición, título e introducción) con
 *   sólo los ejercicios nuevos, a partir de la posición siguiente a la última cargada
 *   (`exerciseOffset`). La migración la encuentra igual y sólo agrega los ejercicios, sin publicar.
 * - Lección nueva del mapa: después de la «En contexto» (posición 11), en la 12, 13… Ordenarla como
 *   dice el mapa (antes de la «En contexto») es la decisión D2 pendiente (docs/LEARNING_PHASE_C.md).
 * - La unidad es la cargada, con sólo sus palabras nuevas (que nacen sin publicar).
 */

export const CONTEXT_POSITION = 11;

export const SUPPLEMENTS: readonly {
  language: string;
  level: Level;
  units: readonly UnitSupplementDef[];
}[] = [{ language: 'en', level: 'A1', units: EN_A1_SUPPLEMENTS }];

/** Unidad cargada (escrita o planificada) a la que se agrega. */
export function baseUnit(language: string, level: Level, unit: number): PathUnit {
  const base = [...CURRICULUM_PATH, ...PLANNED_PATH].find(
    (p) => p.language === language && p.level === level && p.unit.position === unit,
  );
  if (!base) throw new Error(`${language} ${level} U${unit}: no hay una unidad cargada`);
  return base;
}

export const SUPPLEMENT_PATH: PathUnit[] = SUPPLEMENTS.flatMap(({ language, level, units }) =>
  units.map((s) => {
    const base = baseUnit(language, level, s.unit);
    const appended: PathLesson[] = s.appendices.map((a) => {
      const loaded = base.lessons.find((l) => l.id === a.lesson);
      if (!loaded || loaded.kind !== 'lesson')
        throw new Error(`${a.lesson}: no es una lección escrita de U${s.unit}`);
      if (s.appendices.filter((x) => x.lesson === a.lesson).length > 1)
        throw new Error(`${a.lesson}: dos agregados a la misma lección`);
      const { exercises: _loaded, ...rest } = loaded;
      return { ...rest, exercises: a.exercises, exerciseOffset: loaded.exercises.length };
    });
    const added: PathLesson[] = s.lessons.map((l, i) => {
      const { curriculumLesson: _n, curriculum: _c, ...lesson } = l;
      return { ...lesson, kind: 'lesson', position: CONTEXT_POSITION + 1 + i };
    });
    return {
      language,
      level,
      unit: { ...base.unit, words: s.words, lessons: [] },
      lessons: [...appended, ...added],
    };
  }),
);

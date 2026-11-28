import { A2_EXPANSION_PATH } from '../a2-expansion';
import { B1_PATH } from '../b1';
import { COMPREHENSION_PATH } from '../comprehension';
import { CURRICULUM_PATH, type PathUnit } from '../index';
import { PLANNED_PATH } from '../planned';
import { SUPPLEMENT_PATH } from '../supplement';
import type { ExerciseDef, LessonDef, Level, UnitDef, WordDef } from '../types';

/**
 * Inglés para hablantes de portugués, italiano y francés (docs/EN_MULTI_SOURCE.md): el curso de
 * inglés desde español, APLANADO en una sola lista de unidades A1 → A2 → B1.
 *
 * El curso de inglés desde español creció por capas (unidades cargadas, cierre de A1, lecciones «En
 * contexto», unidades planificadas U13–U14, A2 U13–U17 y B1), cada una fuera del camino anterior para
 * no tocar ids publicados. Los cursos nuevos no tienen ids publicados que cuidar: cada unidad junta
 * todas sus lecciones escritas en orden (las de la unidad, con los ejercicios del cierre agregados al
 * final de su lección, las lecciones nuevas del cierre y la «En contexto») y el camino de repasos se
 * vuelve a generar (content/path.ts) con el idioma de apoyo del curso.
 *
 * Lo que se enseña en inglés queda IGUAL: palabras, oraciones, audios, respuestas. Sólo cambia la capa
 * de apoyo (traducciones, consignas, explicaciones), que se localiza aparte (content/en-src/strings.ts).
 */

export interface FlatUnit {
  level: Level;
  /** Unidad de origen en el curso desde español: a1-u01, b1-u12. */
  source: string;
  unit: UnitDef;
}

const LEVELS: readonly Level[] = ['A1', 'A2', 'B1'];

const pad = (n: number) => String(n).padStart(2, '0');
const sourceKey = (level: Level, position: number) => `${level.toLowerCase()}-u${pad(position)}`;

/** Las capas del inglés que aportan unidades con lecciones escritas. */
const WRITTEN: readonly PathUnit[] = [
  ...CURRICULUM_PATH,
  ...PLANNED_PATH,
  ...A2_EXPANSION_PATH,
  ...B1_PATH,
].filter((p) => p.language === 'en' && LEVELS.includes(p.level));

const stripLesson = ({ title, objective, intro, takeaways, exercises }: LessonDef): LessonDef => ({
  title,
  objective,
  ...(intro ? { intro } : {}),
  ...(takeaways ? { takeaways } : {}),
  exercises,
});

function flatten(base: PathUnit): FlatUnit {
  const { level } = base;
  const key = sourceKey(level, base.unit.position);
  const words: WordDef[] = [...base.unit.words];
  const lessons: LessonDef[] = base.unit.lessons.map((l) => ({
    ...stripLesson(l),
    exercises: [...l.exercises],
  }));

  // Cierre de A1: ejercicios agregados a lecciones escritas y lecciones nuevas del mapa.
  for (const s of SUPPLEMENT_PATH.filter(
    (p) => p.language === 'en' && p.level === level && p.unit.position === base.unit.position,
  )) {
    words.push(...s.unit.words);
    for (const l of s.lessons) {
      if (l.exerciseOffset !== undefined) {
        const n = Number(/-l(\d+)$/.exec(l.id)?.[1]);
        const target = lessons[n - 1];
        if (!target) throw new Error(`${l.id}: el cierre agrega a una lección inexistente`);
        target.exercises.push(...l.exercises);
      } else {
        lessons.push(stripLesson(l));
      }
    }
  }

  // Lecciones «En contexto».
  for (const c of COMPREHENSION_PATH.filter(
    (p) => p.language === 'en' && p.level === level && p.unit.position === base.unit.position,
  )) {
    lessons.push(...c.lessons.map(stripLesson));
  }

  const { lessons: _l, words: _w, ...meta } = base.unit;
  return { level, source: key, unit: { ...meta, words, lessons } };
}

/** El inglés A1–B1 completo, unidad por unidad y en orden. */
export function flatEnglish(): FlatUnit[] {
  const seen = new Set<string>();
  const units = WRITTEN.map((p) => {
    const key = sourceKey(p.level, p.unit.position);
    if (seen.has(key)) throw new Error(`${key}: dos capas con lecciones escritas`);
    seen.add(key);
    return flatten(p);
  });
  return units.sort(
    (a, b) =>
      LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.unit.position - b.unit.position,
  );
}

/** Ejercicios de todas las lecciones de una unidad (para recorrer la capa de apoyo). */
export const unitExercises = (u: UnitDef): ExerciseDef[] => u.lessons.flatMap((l) => l.exercises);

import { createHash } from 'node:crypto';

import type { PathUnit } from '../index';
import { unitPath } from '../path';
import type { ExerciseDef, Level, UnitDef, WordDef } from '../types';
import type { WritingTaskDef } from '../../shared/writing';
import { localize, readTranslation, type EnSource } from './localize';
import { flatEnglish } from './flat';
import { supportId } from './strings';
import { enWritingTasks, mapWritingSupport } from './writing';
import { EN_SRC_NAMESPACES } from './texts';

/**
 * Curso de inglés localizado (docs/EN_MULTI_SOURCE.md §2) como PathUnit, listo para el SQL de contenido
 * (scripts/build-en-src-sql.ts).
 *
 * - `language` de cada PathUnit = el espacio de ids del curso (ept, eit, efr): unidades
 *   ept-a1-u01, lecciones ept-a1-u01-l01, palabras ept-hello, ítems ept.ex.… y ept.gen.…, estímulos
 *   ept.stim.…. La carga lo convierte en language_code = 'en' y la base asigna el curso por el prefijo.
 * - Ítems escritos: id determinista sacado del id del inglés desde español (o de su ubicación), así
 *   dos corridas dan los mismos ids sin registro aparte.
 * - Camino: el de siempre (content/path.ts), con los repasos sólo de las palabras de la unidad.
 */

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

/** 14 caracteres [0-9a-z] estables para un ítem. */
function itemSuffix(seed: string): string {
  const bytes = createHash('sha256').update(seed, 'utf8').digest();
  return Array.from(bytes.subarray(0, 14), (b) => ALPHABET[b % ALPHABET.length]).join('');
}

/** en-hello → ept-hello; en.stim.x → ept.stim.x. Sólo ids, nunca texto. */
const renameId = (ns: string, id: string) => id.replace(/^en(?=[.-])/, ns);

function renameExercise(ns: string, e: ExerciseDef, location: string): ExerciseDef {
  const payload =
    e.payload.type === 'context_choice'
      ? {
          ...e.payload,
          stimulus: { ...e.payload.stimulus, id: renameId(ns, e.payload.stimulus.id) },
        }
      : e.payload;
  return {
    ...e,
    id: `${ns}.ex.${itemSuffix(`${ns}:${e.id ?? location}`)}`,
    payload,
    words: e.words.map((w) => renameId(ns, w)),
    ...(e.concepts ? { concepts: e.concepts.map((c) => renameId(ns, c)) } : {}),
    // Las personas ficticias del catálogo son del inglés desde español: el ítem queda como texto
    // cerrado sin persona (la respuesta sigue siendo una opción).
    personalData: undefined,
  };
}

function renameUnit(ns: string, key: string, u: UnitDef): UnitDef {
  return {
    ...u,
    words: u.words.map((w: WordDef) => ({ ...w, id: renameId(ns, w.id) })),
    lessons: u.lessons.map((l, i) => ({
      ...l,
      exercises: l.exercises.map((e, j) => renameExercise(ns, e, `${key}-l${i + 1}-e${j + 1}`)),
    })),
  };
}

/**
 * Pares de un match_pairs generado en orden fijo (por la palabra en inglés). El ítem generado se
 * identifica por su conjunto de palabras: si dos repasos eligen las mismas cuatro en otro orden, serían
 * dos versiones del mismo ítem (content/versions.ts lo rechaza). La app mezcla las columnas igual.
 */
function canonicalPairs<L extends { exercises: ExerciseDef[] }>(lesson: L): L {
  return {
    ...lesson,
    exercises: lesson.exercises.map((e) =>
      e.payload.type === 'match_pairs'
        ? {
            ...e,
            payload: {
              ...e.payload,
              pairs: [...e.payload.pairs].sort((a, b) => a.left.localeCompare(b.left, 'en')),
            },
            words: [...e.words].sort(),
          }
        : e,
    ),
  };
}

export interface EnSrcCourse {
  source: EnSource;
  namespace: string;
  /** public.courses.code */
  code: string;
  path: PathUnit[];
  problems: string[];
  missing: string[];
}

export function enSrcCourse(source: EnSource): EnSrcCourse {
  const ns = EN_SRC_NAMESPACES[source];
  const { units, problems, missing } = localize(source);
  const renamed = units.map((u) => ({
    level: u.level,
    unit: renameUnit(ns, `${ns}-${u.source}`, u.unit),
  }));
  // Palabras conocidas para descartar traducciones ambiguas: todo el curso (como el español). A1–B1
  // se cargó en producción con las palabras de A1–B1: B2 (agregado después) no cambia sus repasos
  // generados; B2 mira todo el curso.
  const firstLoad = renamed.filter((u) => u.level !== 'B2').flatMap((u) => u.unit.words);
  const all = renamed.flatMap((u) => u.unit.words);
  const path: PathUnit[] = renamed.map(({ level, unit }) => ({
    language: ns,
    level: level as Level,
    unit,
    lessons: unitPath(
      unit,
      level === 'B2' ? all : firstLoad,
      `${ns}-${level.toLowerCase()}-u${String(unit.position).padStart(2, '0')}`,
      ns,
      { unitWordsOnly: true },
    ).map((l) => (l.kind === 'lesson' || l.kind === 'context' ? l : canonicalPairs(l))),
  }));
  return { source, namespace: ns, code: `en-from-${source}`, path, problems, missing };
}

/**
 * Tareas de escritura del curso localizado: las del inglés desde español con la capa de apoyo
 * traducida, la lección del curso (a1-u01-l05 → ept-a1-u01-l05) y el id en su espacio
 * (en.a1.wt.x → ept.a1.wt.x). La app las lleva en un archivo generado (scripts/build-en-src-writing.ts).
 */
export function enSrcWritingTasks(source: EnSource): WritingTaskDef[] {
  const ns = EN_SRC_NAMESPACES[source];
  // Cada texto se traduce en la unidad donde aparece primero: se buscan en todas.
  const all: Record<string, string> = {};
  for (const u of flatEnglish()) Object.assign(all, readTranslation(source, u.source)?.strings ?? {});
  const lookup = (text: string) => {
    const v = all[supportId(text)];
    if (v === undefined) throw new Error(`${source}: falta la traducción de «${text}»`);
    return v;
  };
  return enWritingTasks().map(({ task }) => ({
    ...mapWritingSupport(task, lookup),
    id: renameId(ns, task.id),
    lesson: task.lesson && `${ns}-${task.lesson}`,
  }));
}

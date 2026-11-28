import type { Exercise } from '../../shared/exercises';
import { languageConfig } from '../../shared/languages';
import { readingDictionary, segmentReadings } from '../../shared/readings';
import { COURSES as COURSE_CATALOG, courseLevels } from '../../shared/courses';
import {
  BAND_SIZE,
  PLACEMENT_VERSION,
  type PlacementBand,
  type PlacementBank,
  type PlacementDimension,
  type PlacementItem,
} from '../../shared/placement';
import { enSrcCourse } from '../en-src/course';
import { ES_PATH } from '../es-course';
import { FR_PATH } from '../fr-course';
import { CURRICULUM_PATH, type PathUnit } from '../index';
import { IT_PATH } from '../it-course';
import { PT_PATH } from '../pt-course';
import { ZH_PATH } from '../zh-course';
import { lessonExerciseIndex, pathExerciseId } from '../path';
import type { ExerciseDef } from '../types';

/**
 * Banco del test de nivel (Fase 4, docs/PLACEMENT_TEST.md). NO se escriben preguntas nuevas: cada
 * pregunta es, tal cual, un ejercicio de una lección escrita de una unidad publicada del curso. La
 * selección es determinista (sin azar): scripts/build-placement-bank.ts la vuelca en
 * banks.generated.ts, que es lo que viaja con la app (no se carga el curso entero en el teléfono), y
 * content/__tests__/placement.test.ts comprueba que el archivo esté al día y que cada pregunta exista.
 *
 * - Niveles: los publicados del curso (shared/courses.ts `courseLevels`: los suyos o los del destino). Un curso con un solo nivel no
 *   tiene banco: no hay nada que distinguir (empieza en A1).
 * - Bandas: cada nivel se parte en dos mitades de unidades; cada banda, 3 preguntas.
 * - Progresión: las dimensiones de cada banda (SLOTS) van de vocabulario y gramática a estructuras y
 *   uso en contexto a medida que sube la dificultad.
 * - Tipos: sólo los que se responden rápido y sin audio (opción, ordenar, respuesta breve). Se dejan
 *   afuera escuchar (depende de la voz del dispositivo), unir parejas y traducir/escribir palabras.
 */

interface CourseSource {
  /** Unidades publicadas del curso, de todos sus niveles. */
  path: readonly PathUnit[];
  /**
   * Inglés: sólo los ejercicios de la carga original (id por posición). Los que declaran id fueron
   * agregados después a unidades ya cargadas y no todos están publicados (docs/A1_EN_CLOSURE.md).
   * Francés: todo el curso se cargó y publicó junto (2026-11-21), con ids declarados.
   */
  declaredIdsPublished: boolean;
}

/**
 * Italiano, portugués y chino: el piloto A1 U1–U12 (CURRICULUM_PATH, ids por posición, ninguno
 * declarado) y, en su propio camino, A1 U13–U16 y A2 U1–U12, cargados y publicados juntos con ids
 * declarados (2026-11-23). Español: todo el curso se cargó y publicó junto, con ids declarados.
 */
const pilotPlus = (language: string, rest: readonly PathUnit[]): CourseSource => ({
  path: [...CURRICULUM_PATH.filter((u) => u.language === language), ...rest],
  declaredIdsPublished: true,
});

/** De dónde sale el contenido publicado de cada curso con más de un nivel. */
const SOURCES: Record<string, CourseSource> = {
  'en-from-es': {
    path: CURRICULUM_PATH.filter((u) => u.language === 'en'),
    declaredIdsPublished: false,
  },
  'fr-from-es': { path: FR_PATH, declaredIdsPublished: true },
  'it-from-es': pilotPlus('it', IT_PATH),
  'pt-from-es': pilotPlus('pt', PT_PATH),
  'zh-from-es': pilotPlus('zh', ZH_PATH),
  'es-from-en': { path: ES_PATH, declaredIdsPublished: true },
  // Inglés para hablantes de portugués, italiano y francés (docs/EN_MULTI_SOURCE.md): A1–B1 cargado y
  // publicado junto (2026-11-27), todos los ítems con id declarado.
  'en-from-pt': { path: enSrcCourse('pt').path, declaredIdsPublished: true },
  'en-from-it': { path: enSrcCourse('it').path, declaredIdsPublished: true },
  'en-from-fr': { path: enSrcCourse('fr').path, declaredIdsPublished: true },
};

/** Dimensiones de las tres preguntas de cada banda, de la más fácil a la más difícil. */
export const SLOTS: readonly (readonly PlacementDimension[])[] = [
  ['vocabulary', 'grammar', 'sentences'],
  ['grammar', 'sentences', 'structures'],
  ['sentences', 'structures', 'context'],
  ['structures', 'context', 'grammar'],
];
export const slotsFor = (band: number) => SLOTS[Math.min(band, SLOTS.length - 1)]!;

const hasLetters = (s: string) => /\p{L}/u.test(s);
const choiceOk = (options: readonly string[], answer: string) =>
  options.length >= 3 && new Set(options).size === options.length && options.includes(answer);

/** Si un ejercicio sirve para una dimensión (tipo y calidad mínima para un test rápido). */
export function fitsDimension(e: ExerciseDef, dimension: PlacementDimension): boolean {
  const p = e.payload;
  switch (dimension) {
    case 'vocabulary':
      // Palabras con significado propio: sin notas gramaticales entre paréntesis en las opciones.
      return (
        p.type === 'translation_choice' &&
        hasLetters(p.word) &&
        choiceOk(p.options, e.answer) &&
        !p.options.some((o) => /[()]/.test(o))
      );
    case 'grammar':
      return p.type === 'fill_blank' && e.skill === 'grammar' && choiceOk(p.options, e.answer);
    case 'sentences':
      return p.type === 'fill_blank' && e.skill === 'vocabulary' && choiceOk(p.options, e.answer);
    case 'structures':
      return p.type === 'order_words' && p.tokens.length >= 3 && p.tokens.length <= 9;
    case 'context':
      if (p.type === 'context_choice') {
        const length = p.stimulus.kind === 'reading' ? p.stimulus.lines.join(' ').length : 0;
        return p.stimulus.kind === 'reading' && length <= 400 && choiceOk(p.options, e.answer);
      }
      return p.type === 'short_answer' && hasLetters(p.question);
  }
}

/** En uso en contexto se prefiere leer un mensaje; si el curso no tiene, responder en situación. */
const preference = (e: ExerciseDef) => (e.type === 'context_choice' ? 0 : 1);

interface Candidate {
  sourceId: string;
  unit: number;
  def: ExerciseDef;
  stimulus: string | null;
}

function candidates(unit: PathUnit, declaredIdsPublished: boolean): Candidate[] {
  const out: Candidate[] = [];
  // Las lecciones del final de la unidad primero: son las más avanzadas de la unidad.
  const lessons = unit.lessons.filter((l) => l.kind === 'lesson').reverse();
  for (const lesson of lessons) {
    lesson.exercises.forEach((def, i) => {
      if (def.id && !declaredIdsPublished) return;
      out.push({
        sourceId: def.id ?? pathExerciseId(lesson.id, lessonExerciseIndex(lesson, i)),
        unit: unit.unit.position,
        def,
        stimulus: def.payload.type === 'context_choice' ? def.payload.stimulus.id : null,
      });
    });
  }
  return out;
}

function toExercise(c: Candidate, position: number): Exercise {
  const d = c.def;
  return {
    id: `placement.${c.sourceId}`,
    lessonId: null,
    position,
    type: d.type,
    skill: d.skill,
    prompt: d.prompt,
    payload: d.payload,
    answer: d.answer,
    acceptedAnswers: d.acceptedAnswers ?? [],
    // El test no explica: sólo dice si estuvo bien (y cuál era la respuesta).
    explanation: null,
    difficulty: d.difficulty ?? 1,
    recommendedSeconds: d.recommendedSeconds ?? 20,
    wordIds: [],
  };
}

/** Banco de un curso; null si el curso tiene menos de dos niveles publicados. */
export function buildPlacementBank(courseCode: string): PlacementBank | null {
  const course = COURSE_CATALOG.find((c) => c.code === courseCode);
  if (!course) throw new Error(`unknown course ${courseCode}`);
  const levels = courseLevels(course);
  if (levels.length < 2) return null;
  const source = SOURCES[courseCode];
  if (!source) {
    throw new Error(
      `${courseCode} tiene ${levels.join('/')} publicados pero no tiene fuente de banco`,
    );
  }

  const bands: PlacementBand[] = [];
  const used = new Set<string>();
  const usedStimuli = new Set<string>();
  const levelInfo = levels.map((level) => {
    const units = source.path
      .filter((u) => u.level === level)
      .sort((a, b) => a.unit.position - b.unit.position);
    if (units.length < 2) throw new Error(`${courseCode} ${level}: faltan unidades`);
    const middle = Math.ceil(units.length / 2);
    const halves = [units.slice(0, middle), units.slice(middle)] as const;
    halves.forEach((half, h) => {
      const bandIndex = bands.length;
      const items: PlacementItem[] = slotsFor(bandIndex).map((dimension, slot) => {
        // Cada pregunta de la banda sale de una zona distinta de la mitad (repartidas).
        const start = Math.floor(((slot + 1) * half.length) / (BAND_SIZE + 1));
        const order = [...half.slice(start), ...half.slice(0, start)];
        const pool = order
          .flatMap((u) => candidates(u, source.declaredIdsPublished))
          .filter(
            (c) =>
              !used.has(c.sourceId) &&
              !(c.stimulus && usedStimuli.has(c.stimulus)) &&
              fitsDimension(c.def, dimension),
          );
        // Orden estable: preferencia de tipo; a igualdad, el orden de recorrido.
        const pick = pool
          .map((c, i) => ({ c, i }))
          .sort((a, b) => preference(a.c.def) - preference(b.c.def) || a.i - b.i)[0]?.c;
        if (!pick) throw new Error(`${courseCode} ${level}·${h + 1}: sin pregunta de ${dimension}`);
        used.add(pick.sourceId);
        if (pick.stimulus) usedStimuli.add(pick.stimulus);
        return {
          sourceId: pick.sourceId,
          dimension,
          unit: pick.unit,
          exercise: toExercise(pick, bandIndex * BAND_SIZE + slot + 1),
        };
      });
      bands.push({ level, half: (h + 1) as 1 | 2, items });
    });
    return { level, firstUnitTitle: units[0]!.unit.title, units: units.length };
  });

  const bank: PlacementBank = { courseCode, version: PLACEMENT_VERSION, levels: levelInfo, bands };
  if (languageConfig(course.target).script === 'han') {
    bank.readings = bankReadings(
      bands,
      source.path.flatMap((u) => u.unit.words),
    );
  }
  return bank;
}

/**
 * Pinyin de lo que muestran las preguntas: se segmenta cada pregunta con el mismo diccionario que usa
 * la app en las lecciones (vocabulario del curso + EXTRA_READINGS) y se guardan sólo las entradas
 * usadas, en orden alfabético (determinista).
 */
function bankReadings(
  bands: readonly PlacementBand[],
  words: readonly { text: string; romanization?: string }[],
): Record<string, string> {
  const dict = readingDictionary(words);
  const used = new Map<string, string>();
  for (const item of bands.flatMap((b) => b.items)) {
    for (const s of segmentReadings(JSON.stringify(item.exercise), dict)) {
      if (s.reading) used.set(s.text, s.reading);
    }
  }
  return Object.fromEntries([...used].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/** Bancos de todos los cursos que lo necesitan (dos o más niveles publicados). */
export function buildPlacementBanks(): Record<string, PlacementBank> {
  const banks: Record<string, PlacementBank> = {};
  for (const course of COURSE_CATALOG) {
    const bank = buildPlacementBank(course.code);
    if (bank) banks[course.code] = bank;
  }
  return banks;
}

/** El ejercicio de origen de una pregunta del banco (para la prueba de trazabilidad). */
export function sourceExercise(courseCode: string, sourceId: string): ExerciseDef | null {
  const source = SOURCES[courseCode];
  if (!source) return null;
  for (const unit of source.path) {
    for (const c of candidates(unit, true)) if (c.sourceId === sourceId) return c.def;
  }
  return null;
}

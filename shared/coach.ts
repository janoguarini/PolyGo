/**
 * Coach de PolyGo (primera versión): diagnóstico y selección con reglas fijas, sin IA generativa.
 *
 * Trabaja sobre el historial real del alumno (user_word_progress: vistas, errores y etapa de cada
 * palabra estudiada, agrupadas por la unidad que las enseña). No inventa ejercicios: la sesión usa
 * ítems ya publicados y corregibles del catálogo, elegidos y corregidos por el servidor
 * (buildFocusPlan con foco 'coach'). Nunca afirma una debilidad sin evidencia mínima: con pocos datos
 * el diagnóstico es 'insufficient_data' y la app muestra un mensaje neutral.
 *
 * Lo usan la app (para mostrar el diagnóstico) y la Edge Function (para armar la sesión).
 */
import type { FocusProgress, TopicUnit } from './focusReview';
import { COACH } from './plus';

/** Umbrales de evidencia. Cambiarlos acá; los tests los fijan. */
export const COACH_EVIDENCE = {
  /** Palabras estudiadas (en total) para dar cualquier diagnóstico. */
  minStudiedWords: 8,
  /** Palabras estudiadas de una unidad para opinar sobre ella. */
  minUnitWords: 3,
  /** Errores en una unidad para llamarla débil. */
  minUnitMistakes: 2,
  /** Errores / vistas a partir del cual una unidad es débil. */
  weakErrorRate: 0.2,
  /** Por debajo de esto (y con etapa ≥ 2 de media) una unidad es fuerte. */
  strongErrorRate: 0.08,
} as const;

/** Segundos por ejercicio para estimar la duración (mismo rango que el repaso inteligente). */
const SECONDS_PER_EXERCISE = { low: 20, high: 28 } as const;

export interface CoachArea {
  unit: TopicUnit;
  /** Palabras de la unidad que estudiaste. */
  studied: number;
  /** Veces que viste sus palabras (suma de vistas). */
  seen: number;
  /** Errores en total en sus palabras. */
  mistakes: number;
  /** Palabras que te siguen costando (2+ errores, ≥ ⅓ de errores o etapa 0 tras 3 vistas). */
  struggling: number;
  /** mistakes / seen, entre 0 y 1. */
  errorRate: number;
}

export type CoachDiagnosis =
  | { status: 'insufficient_data'; studied: number; needed: number }
  | { status: 'all_good'; studied: number; strong: CoachArea[] }
  | {
      status: 'ok';
      studied: number;
      /** Hasta COACH.maxAreas, la más débil primero. */
      weak: CoachArea[];
      strong: CoachArea[];
      /** Ejercicios de la sesión propuesta y su duración estimada. */
      exercises: number;
      minutes: { low: number; high: number };
    };

const struggles = (e: FocusProgress) =>
  e.incorrectCount >= 2 ||
  (e.seenCount > 0 && e.incorrectCount / e.seenCount >= 1 / 3) ||
  (e.stage === 0 && e.seenCount >= 3);

function areaOf(unit: TopicUnit, mine: readonly FocusProgress[]): CoachArea {
  const seen = mine.reduce((n, e) => n + e.seenCount, 0);
  const mistakes = mine.reduce((n, e) => n + e.incorrectCount, 0);
  return {
    unit,
    studied: mine.length,
    seen,
    mistakes,
    struggling: mine.filter(struggles).length,
    errorRate: seen > 0 ? Math.min(1, mistakes / seen) : 0,
  };
}

/** Prioridad entre áreas débiles: más palabras que cuestan, después más tasa de error, después id. */
const byWeakness = (a: CoachArea, b: CoachArea) =>
  b.struggling - a.struggling ||
  b.errorRate - a.errorRate ||
  b.mistakes - a.mistakes ||
  a.unit.id.localeCompare(b.unit.id);

export function diagnose(
  units: readonly TopicUnit[],
  entries: readonly FocusProgress[],
): CoachDiagnosis {
  const studiedEntries = entries.filter((e) => e.seenCount > 0);
  const studied = studiedEntries.length;
  if (studied < COACH_EVIDENCE.minStudiedWords) {
    return { status: 'insufficient_data', studied, needed: COACH_EVIDENCE.minStudiedWords };
  }
  const areas = units.flatMap((unit) => {
    const mine = studiedEntries.filter((e) => e.word.unit_id === unit.id);
    return mine.length >= COACH_EVIDENCE.minUnitWords ? [areaOf(unit, mine)] : [];
  });
  const weak = areas
    .filter(
      (a) =>
        a.mistakes >= COACH_EVIDENCE.minUnitMistakes &&
        a.errorRate >= COACH_EVIDENCE.weakErrorRate &&
        a.struggling > 0,
    )
    .sort(byWeakness)
    .slice(0, COACH.maxAreas);
  const weakIds = new Set(weak.map((a) => a.unit.id));
  const strong = areas
    .filter((a) => !weakIds.has(a.unit.id) && a.errorRate < COACH_EVIDENCE.strongErrorRate)
    .sort((a, b) => a.errorRate - b.errorRate || b.studied - a.studied)
    .slice(0, 2);
  if (weak.length === 0) return { status: 'all_good', studied, strong };
  const exercises = Math.min(
    COACH.sessionSize,
    pickCoachReview(
      studiedEntries,
      weak.map((a) => a.unit.id),
    ).length,
  );
  return {
    status: 'ok',
    studied,
    weak,
    strong,
    exercises,
    minutes: {
      low: Math.max(1, Math.round((exercises * SECONDS_PER_EXERCISE.low) / 60)),
      high: Math.max(1, Math.round((exercises * SECONDS_PER_EXERCISE.high) / 60)),
    },
  };
}

/**
 * Palabras de la sesión de Coach: sólo de las unidades pedidas, las que más cuestan primero
 * (más errores, después etapa más baja, después id), repartidas por turnos entre unidades para que
 * ninguna se quede sin práctica.
 */
export function pickCoachReview<T extends FocusProgress>(
  entries: readonly T[],
  unitIds: readonly string[],
  size: number = COACH.sessionSize,
): T[] {
  const queues = unitIds.map((unitId) =>
    entries
      .filter(
        (e) =>
          e.seenCount > 0 && e.word.unit_id === unitId && (e.incorrectCount > 0 || struggles(e)),
      )
      .sort(
        (a, b) =>
          Number(struggles(b)) - Number(struggles(a)) ||
          b.incorrectCount - a.incorrectCount ||
          a.stage - b.stage ||
          a.word.id.localeCompare(b.word.id),
      ),
  );
  const out: T[] = [];
  const seen = new Set<string>();
  for (let round = 0; out.length < size; round++) {
    let added = false;
    for (const queue of queues) {
      const entry = queue[round];
      if (!entry || seen.has(entry.word.id)) continue;
      seen.add(entry.word.id);
      out.push(entry);
      added = true;
      if (out.length >= size) break;
    }
    if (!added && queues.every((q) => round >= q.length)) break;
  }
  return out;
}

/** Valida los ids de unidad de un pedido de Coach: 1 a COACH.maxAreas, sin repetir. */
export function parseCoachUnits(raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > COACH.maxAreas) return null;
  if (!raw.every((u) => typeof u === 'string' && /^[\w-]{1,100}$/.test(u))) return null;
  const units = raw as string[];
  return new Set(units).size === units.length ? [...units] : null;
}

/** Duración estimada de una sesión de n ejercicios. */
export function sessionMinutes(exercises: number): { low: number; high: number } {
  return {
    low: Math.max(1, Math.round((exercises * SECONDS_PER_EXERCISE.low) / 60)),
    high: Math.max(1, Math.round((exercises * SECONDS_PER_EXERCISE.high) / 60)),
  };
}

export interface CoachSessionPlan {
  /** focus = tus áreas débiles; maintenance = sin áreas débiles, pero hay palabras con errores. */
  kind: 'focus' | 'maintenance';
  unitIds: string[];
  exercises: number;
  minutes: { low: number; high: number };
}

/**
 * Qué sesión proponer. Con áreas débiles, esas. Si no hay (o no alcanza la evidencia para llamarlas
 * débiles) pero hay palabras con errores, una sesión de mantenimiento con las unidades que más errores
 * tienen. Usa las mismas reglas que el servidor (pickCoachReview), así que lo prometido es lo que se
 * practica. null = no hay nada que entrenar.
 */
export function coachSessionPlan(
  diagnosis: CoachDiagnosis,
  entries: readonly FocusProgress[],
): CoachSessionPlan | null {
  if (diagnosis.status === 'ok' && diagnosis.exercises > 0) {
    return {
      kind: 'focus',
      unitIds: diagnosis.weak.map((a) => a.unit.id),
      exercises: diagnosis.exercises,
      minutes: diagnosis.minutes,
    };
  }
  const mistakesByUnit = new Map<string, number>();
  for (const e of entries) {
    if (e.seenCount <= 0 || !e.word.unit_id) continue;
    if (e.incorrectCount > 0 || struggles(e)) {
      mistakesByUnit.set(
        e.word.unit_id,
        (mistakesByUnit.get(e.word.unit_id) ?? 0) + Math.max(1, e.incorrectCount),
      );
    }
  }
  const unitIds = [...mistakesByUnit.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, COACH.maxAreas)
    .map(([id]) => id);
  if (unitIds.length === 0) return null;
  const exercises = pickCoachReview(entries, unitIds).length;
  if (exercises === 0) return null;
  return { kind: 'maintenance', unitIds, exercises, minutes: sessionMinutes(exercises) };
}

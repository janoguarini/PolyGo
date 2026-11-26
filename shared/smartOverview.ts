/**
 * Resumen del repaso inteligente para su pantalla de presentación. Sale de las mismas reglas que
 * usa el servidor para armar la sesión (shared/focusReview.ts), así que lo que se promete acá es lo
 * que después se practica.
 */
import {
  SMART_REVIEW_SIZE,
  pickSmartReview,
  topicSummaries,
  type FocusProgress,
  type SmartReason,
  type TopicUnit,
} from './focusReview';

/** Segundos por ejercicio para estimar la duración (rango bajo y alto). */
const SECONDS_PER_EXERCISE = { low: 20, high: 28 } as const;

export type MemoryLevel = 'strong' | 'good' | 'building' | 'weak';

export interface SmartOverview {
  /** Palabras estudiadas. */
  studied: number;
  /** % de las estudiadas que están firmes: no toca repasarlas y casi no tienen errores. */
  memory: number;
  memoryLevel: MemoryLevel;
  /** Palabras que cumplen alguna regla del repaso inteligente (sin tope). */
  toReinforce: number;
  /** Unidades con palabras vencidas o con errores. */
  topicsToImprove: number;
  /** Ejercicios de la sesión de hoy (tope SMART_REVIEW_SIZE). */
  exercises: number;
  minutes: { low: number; high: number };
  /** Qué trabaja la sesión, en orden de prioridad (sólo motivos presentes). */
  focus: { reason: SmartReason; count: number }[];
  /**
   * Las palabras estudiadas en tres grupos que no se pisan y suman studied (lo que se muestra al
   * usuario en vez de un % abstracto):
   *   struggling  te cuestan: te equivocás en al menos un tercio de las veces, o siguen en la etapa
   *               inicial después de verlas 3 veces;
   *   due         para repasar hoy: no te cuestan, pero el repaso espaciado ya las pide;
   *   mastered    dominadas: el resto (las sabés y no hace falta repasarlas hoy).
   */
  groups: WordGroups;
}

export interface WordGroups {
  mastered: number;
  due: number;
  struggling: number;
}

/** ¿Te cuesta esta palabra? (misma regla que «difíciles» del repaso inteligente). */
const struggles = (e: FocusProgress) =>
  e.incorrectCount / e.seenCount >= 1 / 3 || (e.stage === 0 && e.seenCount >= 3);

/** Agrupa las palabras estudiadas en dominadas / para repasar hoy / te cuestan. */
export function wordGroups(entries: readonly FocusProgress[], now: number): WordGroups {
  const groups: WordGroups = { mastered: 0, due: 0, struggling: 0 };
  for (const e of entries) {
    if (e.seenCount <= 0) continue;
    if (struggles(e)) groups.struggling++;
    else if (e.nextReviewAt !== null && new Date(e.nextReviewAt).getTime() <= now) groups.due++;
    else groups.mastered++;
  }
  return groups;
}

const REASON_ORDER: SmartReason[] = ['due', 'frequent_mistakes', 'difficult', 'due_soon'];

export function memoryLevel(percent: number): MemoryLevel {
  if (percent >= 85) return 'strong';
  if (percent >= 60) return 'good';
  if (percent >= 35) return 'building';
  return 'weak';
}

export function smartOverview(
  entries: readonly FocusProgress[],
  units: readonly TopicUnit[],
  now: number,
): SmartOverview {
  const studied = entries.filter((e) => e.seenCount > 0);
  const firm = studied.filter((e) => {
    const due = e.nextReviewAt !== null && new Date(e.nextReviewAt).getTime() <= now;
    return !due && e.incorrectCount / e.seenCount < 1 / 3;
  });
  const memory = studied.length === 0 ? 0 : Math.round((firm.length / studied.length) * 100);
  const session = pickSmartReview(entries, now, SMART_REVIEW_SIZE);
  const exercises = session.length;
  const counts = new Map<SmartReason, number>();
  for (const { reason } of session) counts.set(reason, (counts.get(reason) ?? 0) + 1);
  return {
    studied: studied.length,
    memory,
    memoryLevel: memoryLevel(memory),
    toReinforce: pickSmartReview(entries, now, Number.POSITIVE_INFINITY).length,
    topicsToImprove: topicSummaries(units, entries, now).filter(
      (t) => t.due > 0 || t.withMistakes > 0,
    ).length,
    exercises,
    minutes: {
      low: Math.max(1, Math.round((exercises * SECONDS_PER_EXERCISE.low) / 60)),
      high: Math.max(1, Math.round((exercises * SECONDS_PER_EXERCISE.high) / 60)),
    },
    groups: wordGroups(entries, now),
    focus: REASON_ORDER.filter((r) => counts.has(r)).map((reason) => ({
      reason,
      count: counts.get(reason)!,
    })),
  };
}

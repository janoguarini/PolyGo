/**
 * Progreso del Coach a partir de las sesiones guardadas (get_coach_status). Sólo números reales: si
 * no hay al menos dos sesiones terminadas, no se muestra ninguna tendencia.
 */
import type { CoachSessionRecord } from './api';

export interface CoachProgress {
  /** Sesiones terminadas (con resultado guardado). */
  completed: number;
  /** % de aciertos al primer intento de la última sesión terminada. */
  lastAccuracy: number | null;
  /** Diferencia en puntos entre la última y la primera sesión terminada (null con menos de 2). */
  delta: number | null;
}

const accuracyOf = (s: CoachSessionRecord) =>
  s.correct !== null && s.total ? Math.round((s.correct / s.total) * 100) : null;

export function coachProgress(sessions: readonly CoachSessionRecord[]): CoachProgress {
  // get_coach_status devuelve la más reciente primero.
  const done = sessions.filter((s) => s.completedAt !== null && accuracyOf(s) !== null);
  if (done.length === 0) return { completed: 0, lastAccuracy: null, delta: null };
  const last = accuracyOf(done[0]!)!;
  const first = accuracyOf(done[done.length - 1]!)!;
  return {
    completed: done.length,
    lastAccuracy: last,
    delta: done.length >= 2 ? last - first : null,
  };
}

/** % de aciertos de una sesión, o null si no terminó. */
export const sessionAccuracy = accuracyOf;

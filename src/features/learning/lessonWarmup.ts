import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { lessonContentQuery, lessonPresentationQuery } from './hooks';
import { uuid } from './random';

/**
 * Precarga de la próxima lección: que al tocarla abra al instante, sin «Cargando lección…».
 *
 * Se baja el contenido y se registra por adelantado la presentación en el servidor (learning-session
 * `start`: qué ejercicios y en qué orden se muestran; idempotente por session_id, no gasta energía).
 * El session_id de esa presentación se guarda acá y la pantalla de la lección lo usa al entrar
 * (takeWarmSession), así encuentra todo en caché. Si la precarga falló, la lección arranca como
 * siempre, con una sesión nueva.
 */

/** lessonId → session_id con la presentación ya pedida (en memoria: dura lo que la app abierta). */
const warm = new Map<string, string>();

/** Precarga la lección (contenido y presentación). Sin id, no hace nada. */
export function warmLesson(qc: QueryClient, lessonId: string): void {
  void qc.prefetchQuery(lessonContentQuery(lessonId));
  let sessionId = warm.get(lessonId);
  if (!sessionId) {
    sessionId = uuid();
    warm.set(lessonId, sessionId);
  }
  void qc.prefetchQuery(lessonPresentationQuery(sessionId, lessonId));
}

/**
 * El session_id precargado para esta lección, si está listo o en camino (y se consume: una sesión se
 * juega una vez). undefined si no hay o si su presentación falló: la lección usa uno nuevo.
 */
export function takeWarmSession(qc: QueryClient, lessonId: string): string | undefined {
  const sessionId = warm.get(lessonId);
  if (!sessionId) return undefined;
  warm.delete(lessonId);
  const state = qc.getQueryState(lessonPresentationQuery(sessionId, lessonId).queryKey);
  return state && state.status !== 'error' ? sessionId : undefined;
}

/** Precarga mientras la pantalla (el camino, o el resultado con «Siguiente lección») está a la vista. */
export function useWarmLesson(lessonId: string | null | undefined): void {
  const qc = useQueryClient();
  useEffect(() => {
    if (lessonId) warmLesson(qc, lessonId);
  }, [qc, lessonId]);
}

/** Lo mismo como componente, para pantallas que conocen la lección después de sus returns. */
export function WarmLesson({ lessonId }: { lessonId: string | null | undefined }) {
  useWarmLesson(lessonId);
  return null;
}

/** Sólo para tests. */
export function __resetWarmLessons() {
  warm.clear();
}

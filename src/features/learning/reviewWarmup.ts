import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { coachKeys, fetchCoachStatus } from '@/features/coach/api';
import { useMyProfile } from '@/features/profile/hooks';

import {
  LearningSessionHttpError,
  localDateString,
  type ReviewFocus,
  type ServerReviewStart,
} from './api';
import { serverReviewQuery, useMyWords, wordPoolQuery } from './hooks';
import { uuid } from './random';
import {
  clearOpenReview,
  loadOpenReview,
  reviewKind,
  saveOpenReview,
  type OpenReview,
} from './serverReview';

/**
 * Precarga del repaso: que al tocar «Repasar» abra al instante, sin «Preparando repaso…» (igual que
 * lessonWarmup.ts con las lecciones).
 *
 * Con repasos pendientes, la app le pide el repaso al servidor en segundo plano (start_review: arma el
 * plan y registra lo que se va a mostrar; idempotente por session_id, no gasta nada) y guarda ese
 * session_id como la sesión abierta del repaso, así que la pantalla del repaso lo retoma tal cual. Al
 * entrar, la pantalla toma esa sesión (takeWarmReview) y encuentra todo en caché. Si la precarga falló o
 * no hay nada que repasar, la pantalla arranca como siempre.
 *
 * Nunca se precarga el Coach (cada sesión creada cuenta como sesión del Coach, y sin Plus gasta una
 * prueba) ni los repasos por tema (no se sabe cuál se va a elegir).
 */

/** Sesiones con las que start_review ya no sirve: se empieza otra (los mismos que review.tsx). */
export const RESTART_CODES = new Set(['session_closed', 'session_conflict']);

export const newOpenReview = (): OpenReview => ({
  sessionId: uuid(),
  startedAt: new Date().toISOString(),
  date: localDateString(),
});

/** Una respuesta sin repaso («al día», sin contenido) se reutiliza sólo un rato: puede cambiar. */
const EMPTY_FRESH_MS = 2 * 60_000;

/** `${idioma}|${tipo}` → sesión precargada (en memoria: dura lo que la app abierta). */
const warm = new Map<string, OpenReview>();
const inflight = new Set<string>();
const slot = (language: string, kind: string) => `${language}|${kind}`;

/** ¿La precarga sigue sirviendo? Una sesión lista vale en el día; una vacía, unos minutos. */
function usable(
  qc: QueryClient,
  open: OpenReview,
  language: string,
  focus: ReviewFocus | undefined,
  now = Date.now(),
): boolean {
  const state = qc.getQueryState<ServerReviewStart>(
    serverReviewQuery(open.sessionId, language, focus).queryKey,
  );
  if (!state || state.status !== 'success' || !state.data) return false;
  if (state.data.status === 'ok' && state.data.items.length > 0) {
    return open.date === localDateString();
  }
  return state.data.status !== 'session_expired' && now - state.dataUpdatedAt < EMPTY_FRESH_MS;
}

/** Precarga el repaso (básico, o un foco de Plus) en segundo plano. Nunca falla. */
export async function warmReview(
  qc: QueryClient,
  language: string,
  focus?: ReviewFocus,
): Promise<void> {
  if (focus?.kind === 'coach') return;
  const kind = reviewKind(focus);
  const k = slot(language, kind);
  if (inflight.has(k)) return;
  const have = warm.get(k);
  if (have && usable(qc, have, language, focus)) return;
  warm.delete(k);
  inflight.add(k);
  try {
    let open = (await loadOpenReview(language, kind)) ?? newOpenReview();
    let query = serverReviewQuery(open.sessionId, language, focus);
    // Un repaso en pantalla no se toca (volver a pedirlo cambiaría lo que se está jugando).
    if (qc.getQueryCache().find({ queryKey: query.queryKey })?.getObserversCount()) return;
    let data: ServerReviewStart;
    try {
      // staleTime 0: una sesión retomada vuelve con las respuestas que ya se registraron.
      data = await qc.fetchQuery({ ...query, staleTime: 0 });
    } catch (err) {
      qc.removeQueries({ queryKey: query.queryKey, exact: true });
      if (!(err instanceof LearningSessionHttpError && RESTART_CODES.has(err.code))) return;
      // La guardada ya se envió (otro dispositivo) o es de otro tipo: se empieza otra.
      await clearOpenReview(language, kind);
      open = newOpenReview();
      query = serverReviewQuery(open.sessionId, language, focus);
      data = await qc.fetchQuery(query);
    }
    if (data.status === 'session_expired') {
      // De otro día: la pantalla del repaso la envía o la descarta (P7). No se precarga.
      return;
    }
    // Recién cuando el servidor registró el plan se guarda para poder retomarlo (como review.tsx).
    if (data.status === 'ok' && data.items.length > 0) await saveOpenReview(language, open, kind);
    warm.set(k, open);
  } catch {
    // Sin red o el servidor no respondió: la pantalla lo pide al entrar, como siempre.
  } finally {
    inflight.delete(k);
  }
}

/**
 * La sesión precargada para este repaso, si sigue sirviendo (y se consume). undefined si no hay: la
 * pantalla busca la sesión guardada o empieza una nueva.
 */
export function takeWarmReview(
  qc: QueryClient,
  language: string,
  focus?: ReviewFocus,
): OpenReview | undefined {
  const k = slot(language, reviewKind(focus));
  const open = warm.get(k);
  if (!open) return undefined;
  warm.delete(k);
  return usable(qc, open, language, focus) ? open : undefined;
}

/** Precarga mientras la pantalla está a la vista (p. ej. la presentación del repaso inteligente). */
export function useWarmReview(language: string | undefined, focus: ReviewFocus | null) {
  const qc = useQueryClient();
  const key = focus ? reviewKind(focus) : null;
  useEffect(() => {
    if (language && focus) void warmReview(qc, language, focus);
    // focus se identifica por su tipo (key): un objeto nuevo con el mismo foco no vuelve a precargar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qc, language, key]);
}

/** Pausa antes de precargar: lo que está en pantalla carga primero. */
const IDLE_DELAY_MS = 600;

/**
 * Lo que sigue desde las pestañas, en segundo plano: el repaso del día (si hay pendientes), el banco de
 * palabras de Práctica libre y Puntos débiles, y el estado del Coach. Corre al volver a las pestañas
 * (p. ej. al cerrar un repaso o una lección) y al volver a la app.
 */
export function useWarmNextSteps() {
  const qc = useQueryClient();
  const userId = useAuth().session?.user.id;
  const language = useMyProfile().data?.profile.target_language;
  const words = useMyWords().data;

  const run = useCallback(() => {
    if (!language) return;
    const now = Date.now();
    const due = (words ?? []).some(
      (e) => e.nextReviewAt && new Date(e.nextReviewAt).getTime() <= now,
    );
    void qc.prefetchQuery(wordPoolQuery(language));
    if (userId) {
      void qc.prefetchQuery({
        queryKey: coachKeys.status(userId),
        queryFn: fetchCoachStatus,
      });
    }
    if (due) void warmReview(qc, language);
  }, [qc, language, userId, words]);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(run, IDLE_DELAY_MS);
      return () => clearTimeout(timer);
    }, [run]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') run();
    });
    return () => sub.remove();
  }, [run]);
}

/** Sólo para tests. */
export function __resetWarmReviews() {
  warm.clear();
  inflight.clear();
}

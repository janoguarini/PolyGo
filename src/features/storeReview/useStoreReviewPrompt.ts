import { useQuery } from '@tanstack/react-query';
import { useSegments } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { TIERS } from '@shared/ranking';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCurriculum, useLearningSummary } from '@/features/learning/hooks';
import { profileKeys } from '@/features/profile/hooks';
import { requireSupabase } from '@/lib/supabase';
import { deviceStorage } from '@/lib/secureStorage';

/** Racha que demuestra que la app ya es parte de la rutina. */
export const REVIEW_STREAK_DAYS = 7;

/** Rating mínimo de Plata (fuente única: shared/ranking.ts). */
export const SILVER_MIN_RATING = TIERS.find((t) => t.id === 'silver')!.minRating;

/** Marca en el dispositivo: la valoración se pide una sola vez. */
const ASKED_KEY = 'polygo.storeReview.asked';

/** Espera tras volver a una pestaña: que se vea la pantalla antes del cuadro de estrellas. */
const DELAY_MS = 1500;

/** En memoria para no repetir el pedido mientras se escribe la marca. */
let askedThisSession = false;

export interface ReviewMoments {
  /** Racha actual en días. */
  streakDays: number;
  /** Mejor rating Ranked alcanzado en cualquier idioma. */
  peakRating: number;
  /** Unidades con todas sus lecciones completadas. */
  unitsCompleted: number;
}

/**
 * ¿Vivió alguno de los momentos felices? Racha de 7 días, llegar a Plata en Ranked o terminar una
 * unidad entera. Exportada para las pruebas.
 */
export function reachedReviewMoment(m: ReviewMoments): boolean {
  return (
    m.streakDays >= REVIEW_STREAK_DAYS ||
    m.peakRating >= SILVER_MIN_RATING ||
    m.unitsCompleted >= 1
  );
}

/** Mejor rating Ranked histórico, entre todos los idiomas. Al terminar una partida se invalida ['profile']. */
function usePeakRating() {
  const userId = useAuth().session?.user.id;
  return useQuery({
    queryKey: [...profileKeys.ratings(userId ?? 'anonymous'), 'peak-rating'],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from('player_ratings')
        .select('peak_rating')
        .eq('user_id', userId!);
      if (error) throw error;
      return data.reduce((max, r) => Math.max(max, r.peak_rating), 0);
    },
    enabled: Boolean(userId),
  });
}

/**
 * Pide valorar la app con estrellas (cuadro nativo de App Store o Play Store, según el teléfono)
 * justo después de un momento feliz: primera racha de 7 días, primera vez en Plata o primera unidad
 * terminada (lo que llegue primero). Una sola vez por dispositivo, al volver a una pestaña (nunca en
 * medio de una lección o partida), o sea apenas termina la lección o partida que lo logró.
 *
 * Apple y Google deciden si el cuadro aparece de verdad (Apple lo limita a 3 veces por año y no lo
 * muestra en TestFlight). No se ofrece un botón propio: las guías piden no pedirlo desde un botón.
 */
export function useStoreReviewPrompt(enabled = true) {
  const streakDays = useLearningSummary().data?.streak_days ?? 0;
  const peakRating = usePeakRating().data ?? 0;
  const unitsCompleted =
    useCurriculum().data?.units.filter(
      (u) => u.lessons.length > 0 && u.completedCount === u.lessons.length,
    ).length ?? 0;
  const onTabs = useSegments()[0] === '(tabs)';
  const ready =
    enabled &&
    Platform.OS !== 'web' &&
    onTabs &&
    reachedReviewMoment({ streakDays, peakRating, unitsCompleted });

  useEffect(() => {
    if (!ready || askedThisSession) return;
    let cancelled = false;
    const id = setTimeout(() => {
      void (async () => {
        try {
          if ((await deviceStorage.getItem(ASKED_KEY)) || cancelled || askedThisSession) return;
          if (!(await StoreReview.isAvailableAsync())) return;
          askedThisSession = true;
          await deviceStorage.setItem(ASKED_KEY, new Date().toISOString());
          await StoreReview.requestReview();
        } catch (error) {
          if (__DEV__) console.warn('store-review', error);
        }
      })();
    }, DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [ready]);
}

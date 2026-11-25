import { useQuery } from '@tanstack/react-query';
import { useSegments } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { useLearningSummary } from '@/features/learning/hooks';
import { profileKeys } from '@/features/profile/hooks';
import { requireSupabase } from '@/lib/supabase';
import { deviceStorage } from '@/lib/secureStorage';

/** Lecciones o partidas Ranked (lo que se cumpla primero) para pedir la valoración. */
export const REVIEW_AFTER = 5;

/** Marca en el dispositivo: la valoración se pide una sola vez. */
const ASKED_KEY = 'polygo.storeReview.asked';

/** Espera tras volver a una pestaña: que se vea la pantalla antes del cuadro de estrellas. */
const DELAY_MS = 1500;

/** En memoria para no repetir el pedido mientras se escribe la marca. */
let askedThisSession = false;

/** ¿Ya alcanzó el umbral? Exportada para las pruebas. */
export function reachedReviewThreshold(lessons: number, rankedGames: number): boolean {
  return lessons >= REVIEW_AFTER || rankedGames >= REVIEW_AFTER;
}

/** Partidas Ranked jugadas, sumando todos los idiomas. Al terminar una partida se invalida ['profile']. */
function useRankedGamesPlayed() {
  const userId = useAuth().session?.user.id;
  return useQuery({
    queryKey: [...profileKeys.ratings(userId ?? 'anonymous'), 'games-played'],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from('player_ratings')
        .select('games_played')
        .eq('user_id', userId!);
      if (error) throw error;
      return data.reduce((sum, r) => sum + r.games_played, 0);
    },
    enabled: Boolean(userId),
  });
}

/**
 * Pide valorar la app con estrellas (cuadro nativo de App Store o Play Store, según el teléfono)
 * después de 5 lecciones o 5 partidas Ranked, lo que se cumpla primero. Una sola vez por
 * dispositivo, al volver a una pestaña (nunca en medio de una lección o partida).
 *
 * Apple y Google deciden si el cuadro aparece de verdad (Apple lo limita a 3 veces por año y no lo
 * muestra en TestFlight). No se ofrece un botón propio: las guías piden no pedirlo desde un botón.
 */
export function useStoreReviewPrompt(enabled = true) {
  const lessons = useLearningSummary().data?.lessons_completed ?? 0;
  const rankedGames = useRankedGamesPlayed().data ?? 0;
  const onTabs = useSegments()[0] === '(tabs)';
  const ready =
    enabled &&
    Platform.OS !== 'web' &&
    onTabs &&
    reachedReviewThreshold(lessons, rankedGames);

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

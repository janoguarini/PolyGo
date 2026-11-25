import { useQuery } from '@tanstack/react-query';
import { router, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { useLearningSummary } from '@/features/learning/hooks';
import { fetchMatchHistory } from '@/features/profile/api';
import { profileKeys } from '@/features/profile/hooks';

import { hasWelcomeRewardToday, useWelcomeRewards } from './api';

/** Una vez por sesión de la app: no vuelve a abrirse si el usuario la cerró sin cobrar. */
let openedThisSession = false;

/** Fecha local YYYY-MM-DD de un instante (la misma zona que usa el servidor para `date`). */
export function localDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * ¿Jugó hoy al menos una Ranked? Las partidas no cuentan como actividad de aprendizaje
 * (active_today), así que se mira la última partida. Vive bajo ['profile', 'matches']: al terminar
 * una partida se invalida ['profile'] y se vuelve a pedir.
 */
function usePlayedRankedToday(today: string | undefined) {
  const userId = useAuth().session?.user.id;
  const recent = useQuery({
    queryKey: [...profileKeys.matches(userId ?? 'anonymous'), 'recent'],
    queryFn: () => fetchMatchHistory(null, 5),
    enabled: Boolean(userId && today),
  });
  return Boolean(today && recent.data?.some((m) => m.isRanked && localDate(m.endedAt) === today));
}

/**
 * Abre la recompensa diaria sola cuando hay un premio para cobrar hoy y el usuario ya hizo algo en
 * el día: al menos una lección (o repaso) o una partida Ranked. Se monta en el layout de pestañas,
 * así aparece al volver de la lección o de la partida, en la pestaña donde esté. Nunca tapa una
 * lección o una partida en curso: sólo se abre con una pestaña a la vista.
 * Con la migración sin aplicar, el estado es null y no pasa nada.
 */
export function useWelcomeAutoOpen(enabled: boolean) {
  const rewards = useWelcomeRewards();
  const summary = useLearningSummary();
  const claimable = enabled && hasWelcomeRewardToday(rewards.data);
  const rankedToday = usePlayedRankedToday(claimable ? rewards.data?.date : undefined);
  const didSomethingToday = Boolean(summary.data?.active_today) || rankedToday;
  const onTabs = useSegments()[0] === '(tabs)';
  const show = claimable && didSomethingToday && onTabs;

  useEffect(() => {
    if (!show || openedThisSession) return;
    // Deja que la pestaña termine de aparecer antes de presentar la pantalla.
    const id = setTimeout(() => {
      openedThisSession = true;
      router.push('/welcome-rewards');
    }, 600);
    return () => clearTimeout(id);
  }, [show]);
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { userTimeZone } from '@/features/learning/api';
import { callPendingRpc, isMissingRpc } from '@/lib/pendingRpc';

/**
 * Calendario de bienvenida (20261225120000_welcome_rewards). El servidor decide qué día toca, si
 * hoy se puede cobrar y qué se entrega; la app sólo manda la zona horaria.
 */

export interface WelcomeDay {
  day: number;
  kind: 'polys' | 'item';
  polys: number;
  item?: string;
  claimed_at: string | null;
  /** Lo que se entregó de verdad (un cosmético repetido se paga en Polys). */
  granted_polys: number | null;
  granted_item: string | null;
}

export interface WelcomeRewards {
  date: string;
  claimed: number;
  total: number;
  completed: boolean;
  claimable_today: boolean;
  next_day: number;
  days: WelcomeDay[];
}

export interface WelcomeClaim {
  day: number;
  polys: number;
  item: string | null;
  balance: number;
  completed: boolean;
}

/** Dentro de ['learning']: se refresca junto con misiones y saldo. */
export const welcomeRewardKeys = {
  state: (userId: string) => ['learning', 'welcome-rewards', userId] as const,
};

/** null = la migración todavía no está aplicada (no se muestra nada). */
export async function fetchWelcomeRewards(): Promise<WelcomeRewards | null> {
  try {
    return await callPendingRpc<WelcomeRewards>('get_welcome_rewards', {
      p_time_zone: userTimeZone(),
    });
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}

export function useWelcomeRewards() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: welcomeRewardKeys.state(userId ?? 'anonymous'),
    queryFn: fetchWelcomeRewards,
    enabled: Boolean(userId),
  });
}

export function useClaimWelcomeReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      callPendingRpc<WelcomeClaim>('claim_welcome_reward', { p_time_zone: userTimeZone() }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['learning'] });
      void qc.invalidateQueries({ queryKey: ['cosmetics'] });
    },
  });
}

/** Hay algo para cobrar hoy (para abrir la pantalla sola o marcar la entrada). */
export function hasWelcomeRewardToday(data: WelcomeRewards | null | undefined): boolean {
  return Boolean(data && !data.completed && data.claimable_today);
}

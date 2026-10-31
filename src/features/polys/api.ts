import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PolyReason } from '@shared/polys';

import { useAuth } from '@/features/auth/AuthProvider';
import { userTimeZone } from '@/features/learning/api';
import { requireSupabase } from '@/lib/supabase';

export interface PolyGrant {
  reason: PolyReason;
  ref: string;
  amount: number;
}

export interface PolysState {
  balance: number;
  /** Lo acreditado en esta sincronización (vacío si no había nada nuevo). */
  granted: PolyGrant[];
}

/**
 * Dentro de ['learning']: se vuelve a sincronizar solo al terminar una lección, un repaso o al
 * abrir el cofre. Las partidas lo invalidan aparte.
 */
export const polysKeys = {
  wallet: (userId: string) => ['learning', 'polys', userId] as const,
};

/** Acredita lo ganado que falte (idempotente: la base decide) y devuelve el saldo. */
export async function syncPolys(): Promise<PolysState> {
  const { data, error } = await requireSupabase().rpc('sync_polys', {
    p_time_zone: userTimeZone(),
  });
  if (error) throw error;
  return data as unknown as PolysState;
}

export function usePolys() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: polysKeys.wallet(userId ?? 'anonymous'),
    queryFn: syncPolys,
    enabled: Boolean(userId),
  });
}

export async function buyStreakFreeze(): Promise<{ balance: number; freezes: number }> {
  const { data, error } = await requireSupabase().rpc('buy_streak_freeze');
  if (error) throw error;
  return data as unknown as { balance: number; freezes: number };
}

/** Compra un protector de racha y refresca saldo, misiones y racha. */
export function useBuyStreakFreeze() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: buyStreakFreeze,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning'] }),
  });
}

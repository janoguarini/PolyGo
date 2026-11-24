import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CosmeticKind } from '@shared/cosmetics';
import type { BadgeId } from '@shared/referrals';

import { useAuth } from '@/features/auth/AuthProvider';
import { callPendingRpc, isMissingRpc } from '@/lib/pendingRpc';
import { requireSupabase } from '@/lib/supabase';

export const cosmeticKeys = {
  owned: (userId: string) => ['cosmetics', 'owned', userId] as const,
  flair: (userId: string) => ['cosmetics', 'flair', userId] as const,
};

export interface ProfileFlair {
  /** Plus activo según el servidor (has_plus). */
  plus: boolean;
  badges: BadgeId[];
}

const NO_FLAIR: ProfileFlair = { plus: false, badges: [] };

/** Insignias de un perfil (propio o ajeno): Plus e invitaciones. Sin la migración, ninguna. */
export async function fetchProfileFlair(userId: string): Promise<ProfileFlair> {
  try {
    return await callPendingRpc<ProfileFlair>('get_profile_flair', { p_user_id: userId });
  } catch (error) {
    if (isMissingRpc(error)) return NO_FLAIR;
    throw error;
  }
}

export function useProfileFlair(userId: string | null | undefined) {
  return useQuery({
    queryKey: cosmeticKeys.flair(userId ?? 'none'),
    queryFn: () => fetchProfileFlair(userId!),
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
  });
}

/**
 * Pone en pausa lo exclusivo de Plus si Plus venció, o lo devuelve si se renovó (lo decide la base;
 * no borra nada). Se llama al abrir la app. Sin la migración aplicada no hace nada.
 */
export async function syncCosmetics(): Promise<{ suspended: string[]; restored: string[] }> {
  try {
    return await callPendingRpc('sync_cosmetics');
  } catch (error) {
    if (isMissingRpc(error)) return { suspended: [], restored: [] };
    throw error;
  }
}

/** Ids de los cosméticos que el usuario tiene. */
export async function fetchOwnedCosmetics(): Promise<string[]> {
  const { data, error } = await requireSupabase().from('user_cosmetics').select('item_id');
  if (error) throw error;
  return data.map((row) => row.item_id);
}

export function useOwnedCosmetics() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: cosmeticKeys.owned(userId ?? 'anonymous'),
    queryFn: fetchOwnedCosmetics,
    enabled: Boolean(userId),
  });
}

/** Después de comprar o equipar: el perfil, la clasificación, lo propio y el saldo. */
function useRefreshCosmetics() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['cosmetics'] }),
      qc.invalidateQueries({ queryKey: ['profile'] }),
      qc.invalidateQueries({ queryKey: ['leaderboard'] }),
      qc.invalidateQueries({ queryKey: ['learning', 'polys'] }),
    ]);
}

export interface BuyResult {
  balance: number;
  item_id: string;
  /**
   * Si quedó puesto. Con la compatibilidad de cosméticos (20261222120300), un marco/fondo que no
   * combina con el avatar actual se compra igual pero queda en el inventario (false). Sin esa
   * migración el campo no llega: siempre queda puesto.
   */
  equipped?: boolean;
}

export async function buyCosmetic(itemId: string): Promise<BuyResult> {
  const { data, error } = await requireSupabase().rpc('buy_cosmetic', { p_item_id: itemId });
  if (error) throw error;
  return data as unknown as BuyResult;
}

/** Compra con Polys; el ítem queda puesto si combina con tu avatar. */
export function useBuyCosmetic() {
  const refresh = useRefreshCosmetics();
  return useMutation({ mutationFn: buyCosmetic, onSuccess: refresh });
}

export async function equipCosmetic(kind: CosmeticKind, itemId: string | null) {
  const { error } = await requireSupabase().rpc('equip_cosmetic', {
    p_kind: kind,
    p_item_id: itemId,
  });
  if (error) throw error;
}

/** Se pone un ítem propio, o se lo saca con itemId = null. */
export function useEquipCosmetic() {
  const refresh = useRefreshCosmetics();
  return useMutation({
    mutationFn: ({ kind, itemId }: { kind: CosmeticKind; itemId: string | null }) =>
      equipCosmetic(kind, itemId),
    onSuccess: refresh,
  });
}

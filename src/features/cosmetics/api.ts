import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CosmeticKind } from '@shared/cosmetics';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

export const cosmeticKeys = {
  owned: (userId: string) => ['cosmetics', 'owned', userId] as const,
};

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

export async function buyCosmetic(itemId: string): Promise<{ balance: number; item_id: string }> {
  const { data, error } = await requireSupabase().rpc('buy_cosmetic', { p_item_id: itemId });
  if (error) throw error;
  return data as unknown as { balance: number; item_id: string };
}

/** Compra con Polys; el ítem queda puesto. */
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

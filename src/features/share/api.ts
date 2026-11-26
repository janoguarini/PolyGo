import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { shareRef, type ShareAchievement } from '@shared/share';

import { useAuth } from '@/features/auth/AuthProvider';
import { polysKeys, type PolysState } from '@/features/polys/api';
import { callPendingRpc, isMissingRpc } from '@/lib/pendingRpc';
import { deviceStorage } from '@/lib/secureStorage';

/** Logros ya premiados en este teléfono (sólo para no prometer "+20" de nuevo; manda la base). */
const CLAIMED_KEY = 'polygo.share.claimed';

async function readClaimed(): Promise<string[]> {
  try {
    const raw = await deviceStorage.getItem(CLAIMED_KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export async function wasShareClaimed(a: ShareAchievement): Promise<boolean> {
  return (await readClaimed()).includes(shareRef(a));
}

async function markClaimed(ref: string): Promise<void> {
  try {
    const list = await readClaimed();
    if (!list.includes(ref))
      await deviceStorage.setItem(CLAIMED_KEY, JSON.stringify([...list, ref]));
  } catch {
    // Sin almacenamiento sólo se vuelve a mostrar el "+20"; la base no paga dos veces.
  }
}

/**
 * Pide el premio por compartir. La base valida que el logro sea real y paga una vez por logro
 * (idempotente). Devuelve null si la migración todavía no está aplicada o si no hubo premio.
 */
export async function claimShareReward(a: ShareAchievement): Promise<PolysState | null> {
  try {
    const state = await callPendingRpc<PolysState>('claim_share_reward', {
      p_kind: a.kind,
      p_ref: shareRef(a),
    });
    await markClaimed(shareRef(a));
    return state;
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}

/** Reclama el premio y lo anuncia con el aviso de Polys (PolysToast lee la billetera). */
export function useClaimShareReward() {
  const qc = useQueryClient();
  const userId = useAuth().session?.user.id;
  return useCallback(
    async (a: ShareAchievement) => {
      try {
        const state = await claimShareReward(a);
        if (userId && state && Array.isArray(state.granted)) {
          qc.setQueryData<PolysState>(polysKeys.wallet(userId), state);
        }
      } catch {
        // El premio es un extra: si falla, compartir igual salió bien.
      }
    },
    [qc, userId],
  );
}

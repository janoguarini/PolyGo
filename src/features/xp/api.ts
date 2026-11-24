import { useQuery } from '@tanstack/react-query';

import type { XpSource } from '@shared/xp';

import { useAuth } from '@/features/auth/AuthProvider';
import { callPendingRpc, isMissingRpc } from '@/lib/pendingRpc';

import { xpPreview } from './previewGate';

export interface XpGrant {
  source: XpSource;
  ref: string;
  amount: number;
}

/** Respuesta de sync_xp (20261222120200_player_xp). */
export interface XpState {
  total: number;
  level: number;
  /** XP dentro del nivel actual. */
  into: number;
  /** XP que pide el nivel actual. */
  need: number;
  remaining: number;
  /** Nivel antes de esta sincronización. */
  level_before: number;
  /** Primera sincronización: acreditó la historia (no se celebra). */
  initial: boolean;
  /** Lo acreditado ahora (vacío si no había nada nuevo o si es la primera vez). */
  granted: XpGrant[];
  granted_total: number;
  /** Sólo en el modo PREVIEW de desarrollo (datos de ejemplo); sync_xp nunca lo manda. */
  preview?: true;
}

/** Lo que las pantallas usan de la consulta de XP (la real o la de PREVIEW). */
export interface XpQuery {
  data: XpState | null | undefined;
  isError: boolean;
  refetch: () => Promise<unknown>;
}

/**
 * Dentro de ['learning']: se vuelve a sincronizar sola al terminar una lección, un repaso o al abrir
 * el cofre (esas acciones invalidan ['learning']). Las partidas la invalidan aparte, junto con Polys.
 */
export const xpKeys = {
  state: (userId: string) => ['learning', 'xp', userId] as const,
};

/**
 * Acredita el XP que falte (lo decide la base, idempotente) y devuelve nivel y progreso.
 * null = la migración todavía no está aplicada: la app oculta el nivel en vez de inventarlo.
 */
export async function syncXp(): Promise<XpState | null> {
  try {
    return await callPendingRpc<XpState>('sync_xp');
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}

function useServerXp(): XpQuery {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: xpKeys.state(userId ?? 'anonymous'),
    queryFn: syncXp,
    enabled: Boolean(userId),
  });
}

/**
 * XP del jugador. Normalmente, sync_xp. Con el modo PREVIEW de desarrollo (./previewGate), datos de
 * ejemplo en memoria: la consulta real ni se monta, así que no se llama a sync_xp. La elección es fija
 * durante toda la ejecución (la compuerta es una constante), por eso no rompe las reglas de los hooks.
 */
export const useXp: () => XpQuery = xpPreview ? xpPreview.usePreviewXpQuery : useServerXp;

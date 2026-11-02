import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deviceStorage } from '@/lib/secureStorage';

/**
 * Tutorial guiado sobre las pantallas reales. Se marca como pendiente al terminar el registro y se
 * borra al completarlo o saltearlo: sólo lo ven las cuentas nuevas, una vez, en este dispositivo.
 */
const storageKey = (userId: string) => `polygo.tour-pending.${userId}`;
export const tourKey = (userId: string) => ['onboarding', 'tour', userId] as const;

export async function markTourPending(userId: string) {
  try {
    await deviceStorage.setItem(storageKey(userId), '1');
  } catch {
    // Sin almacenamiento, el tutorial igual se muestra en esta sesión (ver setQueryData).
  }
}

export function useTourPending(userId: string | undefined) {
  return useQuery({
    queryKey: tourKey(userId ?? 'anonymous'),
    enabled: Boolean(userId),
    staleTime: Infinity,
    queryFn: async () => {
      try {
        return (await deviceStorage.getItem(storageKey(userId!))) === '1';
      } catch {
        return false;
      }
    },
  });
}

export function useFinishTour(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!userId) return;
      qc.setQueryData(tourKey(userId), false);
      await deviceStorage.removeItem(storageKey(userId)).catch(() => undefined);
    },
  });
}

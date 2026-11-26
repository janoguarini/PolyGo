import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { profileKeys, useMyProfile } from '@/features/profile/hooks';
import type { MyProfile } from '@/features/profile/api';
import { polysKeys, type PolysState } from '@/features/polys/api';
import { track } from '@/lib/analytics';
import { requireSupabase } from '@/lib/supabase';

/**
 * Tutorial guiado sobre las pantallas reales. Es por cuenta: está pendiente mientras
 * profiles.tutorial_completed_at sea nulo (las cuentas previas a la función ya lo tienen marcado).
 * «Rehacer» lo vuelve a abrir sólo en esta sesión, sin tocar la base.
 */
const replayKey = (userId: string) => ['onboarding', 'tour-replay', userId] as const;

export function useTourPending(userId: string | undefined) {
  const me = useMyProfile();
  const replay = useQuery({
    queryKey: replayKey(userId ?? 'anonymous'),
    queryFn: () => false,
    initialData: false,
    staleTime: Infinity,
  });
  const profile = me.data?.profile;
  const pending = Boolean(profile?.onboarding_completed_at && !profile.tutorial_completed_at);
  return replay.data || pending;
}

export function useReplayTour(userId: string | undefined) {
  const qc = useQueryClient();
  return () => qc.setQueryData(replayKey(userId ?? 'anonymous'), true);
}

/** Pausa entre que se cierra el tutorial y aparece el regalo: que se vea sobre el inicio, de sorpresa. */
const GIFT_DELAY_MS = 900;

export function useFinishTour(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    /**
     * Cerrar el tutorial (terminado o saltado, `finished` sólo distingue para la analítica) acredita
     * las 100 Polys de bienvenida en la base, una sola vez. No se anuncian antes: aparecen de sorpresa
     * con el aviso de siempre («+100 Polys · Regalo de bienvenida») un momento después, ya en el inicio.
     */
    mutationFn: async (finished: boolean) => {
      if (!userId) return;
      qc.setQueryData(replayKey(userId), false);
      track(finished ? 'tutorial_completed' : 'tutorial_skipped');
      // Se cierra al instante; la base se actualiza por detrás.
      const alreadyDone = qc.getQueryData<MyProfile>(profileKeys.me(userId))?.profile
        .tutorial_completed_at;
      if (alreadyDone) return;
      qc.setQueryData<MyProfile>(profileKeys.me(userId), (old) =>
        old
          ? { ...old, profile: { ...old.profile, tutorial_completed_at: new Date().toISOString() } }
          : old,
      );
      const { data, error } = await requireSupabase().rpc('complete_tutorial');
      if (error) throw error;
      const wallet = data as unknown as PolysState | null;
      if (wallet && Array.isArray(wallet.granted) && wallet.granted.length > 0) {
        setTimeout(
          () => qc.setQueryData<PolysState>(polysKeys.wallet(userId), wallet),
          GIFT_DELAY_MS,
        );
      }
    },
  });
}

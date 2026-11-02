import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { profileKeys, useMyProfile } from '@/features/profile/hooks';
import type { MyProfile } from '@/features/profile/api';
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

export function useFinishTour(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!userId) return;
      qc.setQueryData(replayKey(userId), false);
      // Se cierra al instante; la base se actualiza por detrás.
      const alreadyDone = qc.getQueryData<MyProfile>(profileKeys.me(userId))?.profile
        .tutorial_completed_at;
      if (alreadyDone) return;
      qc.setQueryData<MyProfile>(profileKeys.me(userId), (old) =>
        old
          ? { ...old, profile: { ...old.profile, tutorial_completed_at: new Date().toISOString() } }
          : old,
      );
      const { error } = await requireSupabase().rpc('complete_tutorial');
      if (error) throw error;
    },
  });
}

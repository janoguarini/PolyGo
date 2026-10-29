import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';

import {
  completeOnboarding,
  fetchActiveSeason,
  fetchMyProfile,
  updateSettings,
  type OnboardingInput,
} from './api';

export const profileKeys = {
  me: (userId: string) => ['profile', 'me', userId] as const,
  season: ['season', 'active'] as const,
};

export function useMyProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: profileKeys.me(userId ?? 'anonymous'),
    queryFn: () => fetchMyProfile(userId!),
    enabled: Boolean(userId),
  });
}

export function useActiveSeason() {
  return useQuery({
    queryKey: profileKeys.season,
    queryFn: fetchActiveSeason,
    staleTime: 10 * 60_000,
  });
}

export function useCompleteOnboarding() {
  const qc = useQueryClient();
  const { session } = useAuth();
  return useMutation({
    mutationFn: (input: OnboardingInput) => completeOnboarding(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: profileKeys.me(session?.user.id ?? 'anonymous') }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id ?? 'anonymous';
  return useMutation({
    mutationFn: (patch: Parameters<typeof updateSettings>[1]) => updateSettings(userId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.me(userId) }),
  });
}

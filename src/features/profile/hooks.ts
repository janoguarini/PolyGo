import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';

import {
  MATCH_PAGE_SIZE,
  completeOnboarding,
  fetchActiveSeason,
  fetchMatchHistory,
  fetchMyAchievements,
  fetchMyProfile,
  fetchPublicProfile,
  fetchRatingHistory,
  updateProfile,
  updateSettings,
  type OnboardingInput,
  type ProfilePatch,
} from './api';

export const profileKeys = {
  me: (userId: string) => ['profile', 'me', userId] as const,
  season: ['season', 'active'] as const,
  ratingHistory: (userId: string, language: string) =>
    ['profile', 'rating-history', userId, language] as const,
  matches: (userId: string) => ['profile', 'matches', userId] as const,
  achievements: (userId: string) => ['profile', 'achievements', userId] as const,
  player: (userId: string) => ['profile', 'player', userId] as const,
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

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id ?? 'anonymous';
  return useMutation({
    mutationFn: (patch: ProfilePatch) => updateProfile(userId, patch),
    // El nombre y el avatar también se ven en la clasificación.
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: profileKeys.me(userId) }),
        qc.invalidateQueries({ queryKey: ['leaderboard'] }),
      ]),
  });
}

export function useRatingHistory() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const language = useMyProfile().data?.profile.target_language;
  return useQuery({
    queryKey: profileKeys.ratingHistory(userId ?? 'anonymous', language ?? 'none'),
    queryFn: () => fetchRatingHistory(userId!, language!),
    enabled: Boolean(userId && language),
  });
}

export function useMatchHistory(pageSize = MATCH_PAGE_SIZE) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useInfiniteQuery({
    queryKey: [...profileKeys.matches(userId ?? 'anonymous'), pageSize],
    queryFn: ({ pageParam }) => fetchMatchHistory(pageParam, pageSize),
    initialPageParam: null as string | null,
    getNextPageParam: (last) =>
      last.length < pageSize ? undefined : (last[last.length - 1]?.endedAt ?? undefined),
    enabled: Boolean(userId),
  });
}

export function useMyAchievements() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: profileKeys.achievements(userId ?? 'anonymous'),
    queryFn: fetchMyAchievements,
    enabled: Boolean(userId),
  });
}

export function usePublicProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.player(userId ?? 'none'),
    queryFn: () => fetchPublicProfile(userId!),
    enabled: Boolean(userId),
  });
}

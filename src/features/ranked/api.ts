import { useQuery } from '@tanstack/react-query';

import { requireSupabase } from '@/lib/supabase';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  rating: number;
  gamesPlayed: number;
}

/**
 * Clasificación global real: jugadores con onboarding completo y posicionados (ganaron alguna
 * ranked), ordenados por rating.
 */
export async function fetchLeaderboard(
  languageCode: string,
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const { data, error } = await requireSupabase()
    .from('player_ratings')
    .select('user_id, rating, games_played, profiles!inner(username, avatar_id, avatar_path)')
    .eq('language_code', languageCode)
    .not('profiles.username', 'is', null)
    .gt('wins', 0)
    .order('rating', { ascending: false })
    .order('games_played', { ascending: false })
    .limit(limit);
  if (error) throw error;

  return data.flatMap((row) => {
    const profile = row.profiles;
    if (!profile.username) return [];
    return [
      {
        userId: row.user_id,
        username: profile.username,
        avatarId: profile.avatar_id,
        avatarPath: profile.avatar_path,
        rating: row.rating,
        gamesPlayed: row.games_played,
      },
    ];
  });
}

export function useLeaderboard(languageCode: string | undefined) {
  return useQuery({
    queryKey: ['leaderboard', languageCode],
    queryFn: () => fetchLeaderboard(languageCode!),
    enabled: Boolean(languageCode),
  });
}

/** Estrellas de los jugadores con perfil público (y las propias); el resto no aparece. */
export async function fetchPublicStars(userIds: string[]): Promise<Record<string, number>> {
  if (userIds.length === 0) return {};
  const { data, error } = await requireSupabase().rpc('get_public_stars', {
    p_user_ids: userIds,
  });
  if (error) throw error;
  return Object.fromEntries(data.map((r) => [r.user_id, r.stars_earned]));
}

export function useLeaderboardStars(userIds: string[] | undefined) {
  return useQuery({
    queryKey: ['leaderboard', 'stars', userIds],
    queryFn: () => fetchPublicStars(userIds!),
    enabled: Boolean(userIds?.length),
  });
}

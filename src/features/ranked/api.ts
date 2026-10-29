import { useQuery } from '@tanstack/react-query';

import { requireSupabase } from '@/lib/supabase';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarId: string;
  rating: number;
  gamesPlayed: number;
}

/** Clasificación global real: jugadores con onboarding completo, ordenados por rating. */
export async function fetchLeaderboard(
  languageCode: string,
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const { data, error } = await requireSupabase()
    .from('player_ratings')
    .select('user_id, rating, games_played, profiles!inner(username, avatar_id)')
    .eq('language_code', languageCode)
    .not('profiles.username', 'is', null)
    .order('rating', { ascending: false })
    .order('games_played', { ascending: false })
    .limit(limit);
  if (error) throw error;

  // Los tipos escritos a mano no declaran relaciones; con tipos generados por Supabase este cast desaparece.
  type Row = {
    user_id: string;
    rating: number;
    games_played: number;
    profiles:
      | { username: string | null; avatar_id: string }
      | { username: string | null; avatar_id: string }[];
  };
  return (data as unknown as Row[]).flatMap((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    if (!profile?.username) return [];
    return [
      {
        userId: row.user_id,
        username: profile.username,
        avatarId: profile.avatar_id,
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

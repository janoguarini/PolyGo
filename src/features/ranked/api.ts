import { useQuery } from '@tanstack/react-query';

import { requireSupabase } from '@/lib/supabase';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  region: string | null;
  /** Idioma del rating mostrado (en la global, el mejor del jugador). */
  languageCode: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  position: number;
}

/**
 * Clasificación: jugadores con onboarding completo y posicionados (ganaron alguna ranked),
 * ordenados por rating. Sin idioma = global (el mejor rating de cada uno entre sus idiomas).
 */
export async function fetchLeaderboard(
  languageCode: string | null,
  limit = 100,
): Promise<LeaderboardEntry[]> {
  const { data, error } = await requireSupabase().rpc('get_leaderboard', {
    p_language_code: languageCode,
    p_limit: limit,
  });
  if (error) throw error;
  return data.map((row) => ({
    userId: row.user_id,
    username: row.username,
    avatarId: row.avatar_id,
    avatarPath: row.avatar_path,
    region: row.region,
    languageCode: row.language_code,
    rating: row.rating,
    gamesPlayed: row.games_played,
    wins: row.wins,
    position: Number(row.position),
  }));
}

export function useLeaderboard(languageCode: string | null) {
  return useQuery({
    queryKey: ['leaderboard', languageCode ?? 'all'],
    queryFn: () => fetchLeaderboard(languageCode),
  });
}

export interface LeaderboardPosition {
  /** null = todavía sin posicionar. */
  position: number | null;
  total: number;
}

export async function fetchMyPosition(languageCode: string | null): Promise<LeaderboardPosition> {
  const { data, error } = await requireSupabase().rpc('get_my_leaderboard_position', {
    p_language_code: languageCode,
  });
  if (error) throw error;
  const row = data[0];
  return {
    position: row?.position == null ? null : Number(row.position),
    total: Number(row?.total ?? 0),
  };
}

/** Tu puesto en la clasificación (global si languageCode es null). */
export function useMyLeaderboardPosition(languageCode: string | null) {
  return useQuery({
    queryKey: ['leaderboard', 'me', languageCode ?? 'all'],
    queryFn: () => fetchMyPosition(languageCode),
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

import { useQuery } from '@tanstack/react-query';

import { requireSupabase } from '@/lib/supabase';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  /** Marco puesto (shared/cosmetics.ts) o null. */
  frameId: string | null;
  region: string | null;
  /** Idioma del rating mostrado; null en la global, donde rating es la suma de sus idiomas. */
  languageCode: string | null;
  rating: number;
  gamesPlayed: number;
  wins: number;
  position: number;
}

/**
 * Clasificación: jugadores con onboarding completo y posicionados (ganaron alguna ranked),
 * ordenados por rating. Sin idioma = global: la suma de los ratings de los idiomas en los que
 * cada uno está posicionado.
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
  const frames = await fetchFrames(data.map((row) => row.user_id));
  return data.map((row) => ({
    userId: row.user_id,
    username: row.username,
    avatarId: row.avatar_id,
    avatarPath: row.avatar_path,
    frameId: frames.get(row.user_id) ?? null,
    region: row.region,
    languageCode: row.language_code,
    rating: row.rating,
    gamesPlayed: row.games_played,
    wins: row.wins,
    position: Number(row.position),
  }));
}

/** Marcos puestos de esos jugadores (los perfiles se leen entre usuarios con sesión). */
async function fetchFrames(userIds: string[]): Promise<Map<string, string>> {
  if (userIds.length === 0) return new Map();
  const { data, error } = await requireSupabase()
    .from('profiles')
    .select('id, frame_id')
    .in('id', userIds)
    .not('frame_id', 'is', null);
  if (error) throw error;
  return new Map(data.flatMap((p) => (p.frame_id ? [[p.id, p.frame_id] as const] : [])));
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
  /** Lo que se muestra en tu fila en ese alcance (en la global, la suma); null sin posicionar. */
  rating: number | null;
  gamesPlayed: number;
  wins: number;
}

export async function fetchMyPosition(languageCode: string | null): Promise<LeaderboardPosition> {
  const { data, error } = await requireSupabase().rpc('get_my_leaderboard_entry', {
    p_language_code: languageCode,
  });
  if (error) throw error;
  const row = data[0];
  return {
    position: row?.position == null ? null : Number(row.position),
    total: Number(row?.total ?? 0),
    rating: row?.rating ?? null,
    gamesPlayed: row?.games_played ?? 0,
    wins: row?.wins ?? 0,
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

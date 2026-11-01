import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

/** Desde mi lado: amigos, solicitud que mandé, solicitud que recibí o nada. */
export type FriendshipState = 'friends' | 'outgoing' | 'incoming' | 'none';

export interface FriendEntry {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  frameId: string | null;
  state: Exclude<FriendshipState, 'none'>;
  /** ELO en el idioma que estudia (null si no tiene). */
  rating: number | null;
  placed: boolean;
  /** Racha de días de estudio (sólo para amigos aceptados). */
  streak: number;
  since: string;
}

export interface PlayerSearchResult {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  frameId: string | null;
  rating: number | null;
  placed: boolean;
  state: FriendshipState;
}

export async function fetchFriends(): Promise<FriendEntry[]> {
  const { data, error } = await requireSupabase().rpc('get_friends');
  if (error) throw error;
  return data.map((r) => ({
    userId: r.user_id,
    username: r.username,
    avatarId: r.avatar_id,
    avatarPath: r.avatar_path,
    frameId: r.frame_id,
    state: r.state as FriendEntry['state'],
    rating: r.rating,
    placed: r.placed,
    streak: r.streak,
    since: r.since,
  }));
}

export async function searchPlayers(query: string): Promise<PlayerSearchResult[]> {
  const { data, error } = await requireSupabase().rpc('search_players', { p_query: query });
  if (error) throw error;
  return data.map((r) => ({
    userId: r.user_id,
    username: r.username,
    avatarId: r.avatar_id,
    avatarPath: r.avatar_path,
    frameId: r.frame_id,
    rating: r.rating,
    placed: r.placed,
    state: r.state as FriendshipState,
  }));
}

export async function sendFriendRequest(userId: string) {
  const { error } = await requireSupabase().rpc('send_friend_request', { p_user_id: userId });
  if (error) throw error;
}

export async function respondFriendRequest({ userId, accept }: { userId: string; accept: boolean }) {
  const { error } = await requireSupabase().rpc('respond_friend_request', {
    p_user_id: userId,
    p_accept: accept,
  });
  if (error) throw error;
}

export async function removeFriend(userId: string) {
  const { error } = await requireSupabase().rpc('remove_friend', { p_user_id: userId });
  if (error) throw error;
}

/** Amigos y solicitudes pendientes, en los dos sentidos. */
export function useFriends() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['friends', userId ?? 'anonymous'],
    queryFn: fetchFriends,
    enabled: Boolean(userId),
  });
}

/** Busca desde 2 letras (nombre) o con un código PG- completo. */
export function usePlayerSearch(query: string) {
  const clean = query.trim();
  return useQuery({
    queryKey: ['friends', 'search', clean.toLowerCase()],
    queryFn: () => searchPlayers(clean),
    enabled: clean.replace(/^@/, '').length >= 2,
    staleTime: 30_000,
  });
}

function useRefreshFriends() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['friends'] }),
      qc.invalidateQueries({ queryKey: ['profile', 'player'] }),
    ]);
}

export function useSendFriendRequest() {
  const refresh = useRefreshFriends();
  return useMutation({ mutationFn: sendFriendRequest, onSuccess: refresh });
}

export function useRespondFriendRequest() {
  const refresh = useRefreshFriends();
  return useMutation({ mutationFn: respondFriendRequest, onSuccess: refresh });
}

export function useRemoveFriend() {
  const refresh = useRefreshFriends();
  return useMutation({ mutationFn: removeFriend, onSuccess: refresh });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

export interface BlockedUser {
  userId: string;
  username: string;
  avatarId: string;
  blockedAt: string;
}

export async function fetchBlockedUsers(): Promise<BlockedUser[]> {
  const { data, error } = await requireSupabase().rpc('get_blocked_users');
  if (error) throw error;
  return data.map((r) => ({
    userId: r.user_id,
    username: r.username,
    avatarId: r.avatar_id,
    blockedAt: r.blocked_at,
  }));
}

export async function blockUser(userId: string) {
  const { error } = await requireSupabase().rpc('block_user', { p_user_id: userId });
  if (error) throw error;
}

export async function unblockUser(userId: string) {
  const { error } = await requireSupabase().rpc('unblock_user', { p_user_id: userId });
  if (error) throw error;
}

/** Jugadores que bloqueé. La app los oculta de la clasificación y de su perfil. */
export function useBlockedUsers() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['blocks', userId ?? 'anonymous'],
    queryFn: fetchBlockedUsers,
    enabled: Boolean(userId),
  });
}

/** Ids bloqueados como Set (vacío mientras carga). */
export function useBlockedIds(): Set<string> {
  const blocked = useBlockedUsers();
  return new Set(blocked.data?.map((b) => b.userId) ?? []);
}

function useRefreshAfterBlock() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['blocks'] }),
      qc.invalidateQueries({ queryKey: ['leaderboard'] }),
    ]);
}

export function useBlockUser() {
  const refresh = useRefreshAfterBlock();
  return useMutation({ mutationFn: blockUser, onSuccess: refresh });
}

export function useUnblockUser() {
  const refresh = useRefreshAfterBlock();
  return useMutation({ mutationFn: unblockUser, onSuccess: refresh });
}

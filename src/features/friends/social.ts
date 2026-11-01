import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { PRESENCE_PING_MS, type FriendWeeklyChallengeId } from '@shared/friendChallenges';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

// ---------- en línea e invitaciones a amistosos ----------

export interface BattleInvite {
  code: string;
  hostId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  frameId: string | null;
  createdAt: number;
}

interface RawInvite {
  code: string;
  host_id: string;
  username: string;
  avatar_id: string;
  avatar_path: string | null;
  frame_id: string | null;
  created_at: number;
}

/** Latido: me marca en línea y trae las invitaciones a partidas que siguen en pie. */
export async function pingPresence(): Promise<BattleInvite[]> {
  const { data, error } = await requireSupabase().rpc('ping_presence');
  if (error) throw error;
  const invites = ((data as { invites?: RawInvite[] } | null)?.invites ?? []) as RawInvite[];
  return invites.map((i) => ({
    code: i.code,
    hostId: i.host_id,
    username: i.username,
    avatarId: i.avatar_id,
    avatarPath: i.avatar_path,
    frameId: i.frame_id,
    createdAt: i.created_at,
  }));
}

export async function declineBattleInvite(code: string) {
  const { error } = await requireSupabase().rpc('decline_battle_invite', { p_code: code });
  if (error) throw error;
}

function useAppActive(): boolean {
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => setActive(s === 'active'));
    return () => sub.remove();
  }, []);
  return active;
}

export const presenceKey = (userId: string) => ['friends', 'presence', userId] as const;

/**
 * Mientras la app está abierta (y en primer plano) avisa cada PRESENCE_PING_MS que sigue ahí.
 * Los datos son las invitaciones recibidas: el layout de pestañas las muestra en un aviso.
 */
export function usePresence() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const active = useAppActive();
  return useQuery({
    queryKey: presenceKey(userId ?? 'anonymous'),
    queryFn: pingPresence,
    enabled: Boolean(userId) && active,
    refetchInterval: PRESENCE_PING_MS,
    refetchIntervalInBackground: false,
    staleTime: 0,
    retry: false,
  });
}

export function useDeclineBattleInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: declineBattleInvite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  });
}

// ---------- actividad reciente ----------

export type FriendActivityKind =
  | 'rank_up'
  | 'wins_week'
  | 'reviews_week'
  | 'lessons_week'
  | 'achievement'
  | 'streak'
  | 'new_friend';

export interface FriendActivity {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  frameId: string | null;
  kind: FriendActivityKind;
  value: number | null;
  value2: number | null;
  label: string | null;
  happenedAt: string;
}

export async function fetchFriendActivity(): Promise<FriendActivity[]> {
  const { data, error } = await requireSupabase().rpc('get_friend_activity');
  if (error) throw error;
  return data.map((r) => ({
    userId: r.user_id,
    username: r.username,
    avatarId: r.avatar_id,
    avatarPath: r.avatar_path,
    frameId: r.frame_id,
    kind: r.kind as FriendActivityKind,
    value: r.value,
    value2: r.value2,
    label: r.label,
    happenedAt: r.happened_at,
  }));
}

export function useFriendActivity() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['friends', 'activity', userId ?? 'anonymous'],
    queryFn: fetchFriendActivity,
    enabled: Boolean(userId),
  });
}

// ---------- retos semanales ----------

export interface ChallengeFriend {
  user_id: string;
  username: string;
  avatar_id: string;
  avatar_path: string | null;
}

export interface WeeklyChallengeState {
  id: FriendWeeklyChallengeId;
  target: number;
  reward: number;
  progress: number;
  claimed: boolean;
  /** Amigos (con estadísticas visibles) que ya lo completaron. */
  friends_done: number;
  /** Hasta 5 de ellos. */
  friends: ChallengeFriend[];
}

export interface WeeklyChallenges {
  week: string;
  /** Fin de la semana (ms). */
  ends_at: number;
  challenges: WeeklyChallengeState[];
}

export async function fetchWeeklyChallenges(): Promise<WeeklyChallenges> {
  const { data, error } = await requireSupabase().rpc('get_friend_weekly_challenges');
  if (error) throw error;
  return data as unknown as WeeklyChallenges;
}

export async function claimWeeklyChallenge(id: FriendWeeklyChallengeId) {
  const { data, error } = await requireSupabase().rpc('claim_friend_challenge', { p_id: id });
  if (error) throw error;
  return data as unknown as { polys: number; balance: number };
}

export function useWeeklyChallenges() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['friends', 'weekly', userId ?? 'anonymous'],
    queryFn: fetchWeeklyChallenges,
    enabled: Boolean(userId),
  });
}

export function useClaimWeeklyChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: claimWeeklyChallenge,
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: ['friends', 'weekly'] }),
        qc.invalidateQueries({ queryKey: ['learning', 'polys'] }),
      ]),
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { MissionId } from '@shared/missions';

import { useAuth } from '@/features/auth/AuthProvider';
import { userTimeZone } from '@/features/learning/api';
import { requireSupabase } from '@/lib/supabase';

export interface DailyMission {
  id: MissionId;
  target: number;
  progress: number;
  done: boolean;
}

export interface DailyMissions {
  date: string;
  missions: DailyMission[];
  all_done: boolean;
  claimed: boolean;
  freezes: number;
  max_freezes: number;
}

/** Dentro de ['learning']: se refresca solo al terminar una lección o un repaso. */
export const missionKeys = {
  today: (userId: string) => ['learning', 'missions', userId] as const,
};

export async function fetchDailyMissions(): Promise<DailyMissions> {
  const { data, error } = await requireSupabase().rpc('get_daily_missions', {
    p_time_zone: userTimeZone(),
  });
  if (error) throw error;
  return data as unknown as DailyMissions;
}

/** Lo que trae el cofre del día. */
export interface ChestReward {
  polys: number;
  jackpot: boolean;
  /** Bonus por abrir el cofre 5 días de la semana (0 si no tocó). */
  weekly_bonus: number;
  balance: number;
  freezes: number;
}

export async function claimMissionReward(): Promise<ChestReward> {
  const { data, error } = await requireSupabase().rpc('claim_mission_reward', {
    p_time_zone: userTimeZone(),
  });
  if (error) throw error;
  return data as unknown as ChestReward;
}

export function useDailyMissions() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: missionKeys.today(userId ?? 'anonymous'),
    queryFn: fetchDailyMissions,
    enabled: Boolean(userId),
  });
}

/** Abre el cofre del día y refresca misiones, racha y saldo. */
export function useClaimMissionReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: claimMissionReward,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning'] }),
  });
}

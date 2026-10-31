import { requireSupabase } from '@/lib/supabase';

import type { HumanMatchApi, HumanMatchResult, HumanMatchSetup } from './localMatch';

export type ChallengeStatus =
  { status: 'waiting' | 'expired'; battle_id: null } | { status: 'matched'; battle_id: string };

export type QueueResponse =
  | { status: 'waiting'; window: number; waited_ms: number }
  | { status: 'matched'; battle_id: string };

/** Partidas ranked entre personas guardadas en Supabase (sin servidor de partidas). */
export const humanMatchApi: HumanMatchApi & {
  join(): Promise<QueueResponse>;
  leave(): Promise<{ battle_id: string | null }>;
  get(battleId: string): Promise<HumanMatchSetup>;
  createChallenge(): Promise<{ code: string; expires_at: number }>;
  challengeStatus(code: string): Promise<ChallengeStatus>;
  acceptChallenge(code: string): Promise<{ status: 'matched'; battle_id: string }>;
  cancelChallenge(code: string): Promise<void>;
} = {
  async join() {
    const { data, error } = await requireSupabase().rpc('join_human_queue');
    if (error) throw error;
    return data as unknown as QueueResponse;
  },
  async leave() {
    const { data, error } = await requireSupabase().rpc('leave_human_queue');
    if (error) throw error;
    return data as unknown as { battle_id: string | null };
  },
  async get(battleId) {
    const { data, error } = await requireSupabase().rpc('get_human_match', {
      p_battle_id: battleId,
    });
    if (error) throw error;
    return data as unknown as HumanMatchSetup;
  },
  async createChallenge() {
    const { data, error } = await requireSupabase().rpc('create_friend_challenge');
    if (error) throw error;
    return data as unknown as { code: string; expires_at: number };
  },
  async challengeStatus(code) {
    const { data, error } = await requireSupabase().rpc('friend_challenge_status', {
      p_code: code,
    });
    if (error) throw error;
    return data as unknown as ChallengeStatus;
  },
  async acceptChallenge(code) {
    const { data, error } = await requireSupabase().rpc('accept_friend_challenge', {
      p_code: code,
    });
    if (error) throw error;
    return data as unknown as { status: 'matched'; battle_id: string };
  },
  async cancelChallenge(code) {
    const { error } = await requireSupabase().rpc('cancel_friend_challenge', { p_code: code });
    if (error) throw error;
  },
  async finish(battleId, line, forfeit) {
    const { data, error } = await requireSupabase().rpc('finish_human_match', {
      p_battle_id: battleId,
      p_score: line.score,
      p_correct: line.correct,
      p_answered: line.answered,
      p_forfeit: forfeit,
    });
    if (error) throw error;
    return data as unknown as HumanMatchResult;
  },
  async result(battleId) {
    const { data, error } = await requireSupabase().rpc('human_match_result', {
      p_battle_id: battleId,
    });
    if (error) throw error;
    return data as unknown as HumanMatchResult;
  },
};

type Line = { score: number; correct: number; answered: number };

/**
 * Canal en vivo de la partida (Supabase Realtime, broadcast): cada uno publica su puntaje después
 * de cada respuesta y ve el del rival. Sólo para mostrar: el resultado lo decide la base.
 */
export function openLiveChannel(
  battleId: string,
  mySlot: 1 | 2,
  onOpponent: (line: Line) => void,
): { send(line: Line): void; close(): void } {
  const db = requireSupabase();
  const channel = db.channel(`battle:${battleId}`, {
    config: { broadcast: { self: false } },
  });
  channel
    .on('broadcast', { event: 'line' }, ({ payload }) => {
      const p = payload as Line & { slot: number };
      if (p.slot !== mySlot)
        onOpponent({ score: p.score, correct: p.correct, answered: p.answered });
    })
    .subscribe();
  return {
    send(line) {
      void channel.send({ type: 'broadcast', event: 'line', payload: { slot: mySlot, ...line } });
    },
    close() {
      void db.removeChannel(channel);
    },
  };
}

import type { ErrorCode } from '@shared/protocol';

import { requireSupabase } from '@/lib/supabase';

import type { FinishedBotMatch, LocalMatchApi, StartedBotMatch } from './localMatch';

/** Partidas contra bots guardadas en Supabase (sin servidor de partidas). */
export const botMatchApi: LocalMatchApi = {
  async start() {
    const { data, error } = await requireSupabase().rpc('start_bot_match');
    if (error) throw error;
    return data as unknown as StartedBotMatch;
  },
  async finish(battleId, line, forfeit) {
    const { data, error } = await requireSupabase().rpc('finish_bot_match', {
      p_battle_id: battleId,
      p_score: line.score,
      p_correct: line.correct,
      p_answered: line.answered,
      p_forfeit: forfeit,
    });
    if (error) throw error;
    return data as unknown as FinishedBotMatch;
  },
};

const KNOWN: ErrorCode[] = [
  'onboarding_required',
  'language_unavailable',
  'match_rate_limited',
  'unauthorized',
];

/** Traduce un error de las funciones de la base al código que muestra la pantalla. */
export function botMatchErrorCode(error: unknown): ErrorCode | 'connection' {
  const message =
    error instanceof Error
      ? error.message
      : String((error as { message?: unknown })?.message ?? '');
  if (message.includes('not_authenticated')) return 'unauthorized';
  const known = KNOWN.find((code) => message.includes(code));
  if (known) return known;
  if (/network|fetch/i.test(message)) return 'connection';
  return 'server_error';
}

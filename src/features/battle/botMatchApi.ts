import type { ErrorCode } from '@shared/protocol';

import { requireSupabase } from '@/lib/supabase';

import type { FinishedBotMatch, LocalMatchApi, StartedBotMatch } from './localMatch';

/**
 * Sólo para las RPC del Ranked viejo sin servidor (start_bot_match, finish_bot_match,
 * join_human_queue, leave_human_queue). Cuando se cierren para las versiones viejas de la app
 * (docs/DEPLOYMENT.md, paso 3), PostgREST responde 42501 «permission denied for function»: se
 * traduce a protocol_mismatch para pedir que actualice. Cualquier otro error pasa igual.
 */
export function legacyRankedError(error: unknown): unknown {
  const e = error as { code?: unknown; message?: unknown } | null;
  const message = String(e?.message ?? '');
  if (e?.code === '42501' || /permission denied for function/i.test(message)) {
    return new Error('protocol_mismatch');
  }
  return error;
}

/** Partidas contra bots guardadas en Supabase (sin servidor de partidas). */
export const botMatchApi: LocalMatchApi = {
  async start() {
    const { data, error } = await requireSupabase().rpc('start_bot_match');
    if (error) throw legacyRankedError(error);
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
    if (error) throw legacyRankedError(error);
    return data as unknown as FinishedBotMatch;
  },
};

const KNOWN: ErrorCode[] = [
  'onboarding_required',
  'language_unavailable',
  'match_rate_limited',
  'unauthorized',
  'challenge_not_found',
  'challenge_expired',
  'challenge_taken',
  'own_challenge',
  'host_gone',
  'language_mismatch',
  'challenge_declined',
  'not_friends',
  'protocol_mismatch',
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

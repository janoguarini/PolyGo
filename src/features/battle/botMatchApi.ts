import type { ErrorCode } from '@shared/protocol';
import { rushUnitsFromRpc } from '@shared/wordRush';

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

export { localRushWords, rushWordsInUnits } from '@shared/wordRush';

/**
 * Fases C.7/C.8: unidades cuyo vocabulario puede usar este jugador en Ranked (rush_my_unit_ids: su ruta
 * persistente vista con el nivel de esta build —la cabecera global del cliente—, unidades publicadas y
 * desbloqueadas). null sólo si el backend todavía no tiene la función (anterior a la C.7). Cualquier
 * otro error se propaga: la partida no empieza (antes de la C.8 se jugaba sin el filtro).
 */
export async function fetchRushUnits(language: string): Promise<ReadonlySet<string> | null> {
  const { data, error } = await requireSupabase().rpc('rush_my_unit_ids', {
    p_language_code: language,
  });
  return rushUnitsFromRpc(data, error);
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

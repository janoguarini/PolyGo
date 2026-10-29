import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database, Json } from '../../src/lib/database.generated';
import { PROTOCOL_VERSION } from '../../shared/protocol';
import { RATING_CONFIG } from '../../shared/ranking';
import type { RushWord } from '../../shared/wordRush';
import {
  StaleRatingError,
  type BattleStore,
  type PlayerInfo,
  type SettleResponse,
  type SettlementContextRow,
  type VerifyToken,
} from './types';

/** Cliente con la service_role key: salta RLS. Sólo existe en este proceso. */
export function createServiceClient(url: string, serviceRoleKey: string): SupabaseClient<Database> {
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function createSupabaseStore(db: SupabaseClient<Database>): BattleStore {
  return {
    async getPlayer(userId) {
      const { data: profile, error } = await db
        .from('profiles')
        .select('id, username, avatar_id, target_language, onboarding_completed_at')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      if (!profile?.username || !profile.onboarding_completed_at) return null;

      const { data: rating, error: ratingError } = await db
        .from('player_ratings')
        .select('rating, games_played')
        .eq('user_id', userId)
        .eq('language_code', profile.target_language)
        .maybeSingle();
      if (ratingError) throw ratingError;
      if (!rating) return null;

      return {
        userId,
        username: profile.username,
        avatarId: profile.avatar_id,
        languageCode: profile.target_language,
        rating: rating.rating,
        gamesPlayed: rating.games_played,
      } satisfies PlayerInfo;
    },

    async loadWords(languageCode) {
      const { data, error } = await db
        .from('words')
        .select('id, text, translation_es')
        .eq('language_code', languageCode)
        .eq('is_published', true);
      if (error) throw error;
      return (data ?? []).map((w): RushWord => ({
        id: w.id,
        text: w.text,
        translationEs: w.translation_es,
      }));
    },

    async startBattle(battleId, languageCode, player1, player2) {
      const { error } = await db.rpc('start_battle', {
        p_battle_id: battleId,
        p_language_code: languageCode,
        p_player1: player1,
        p_player2: player2,
        p_protocol_version: PROTOCOL_VERSION,
      });
      if (error) throw error;
    },

    async settlementContext(battleId) {
      const { data, error } = await db.rpc('battle_settlement_context', {
        p_battle_id: battleId,
        p_window_hours: RATING_CONFIG.repeatOpponentWindowHours,
      });
      if (error) throw error;
      // Los tipos generados no marcan como nullable las columnas de un LEFT JOIN (cuenta borrada).
      return data.map((row): SettlementContextRow => ({
        slot: row.slot as 1 | 2,
        userId: row.user_id ?? null,
        rating: row.rating ?? null,
        gamesPlayed: row.games_played ?? null,
        matchesInWindow: row.matches_in_window,
      }));
    },

    async settleBattle(battleId, status, players) {
      const { data, error } = await db.rpc('settle_battle', {
        p_battle_id: battleId,
        p_status: status,
        p_players: players as unknown as Json,
      });
      if (error) {
        if (error.code === '40001' || error.message.includes('stale_rating')) {
          throw new StaleRatingError();
        }
        throw error;
      }
      return data as unknown as SettleResponse;
    },

    async cancelBattle(battleId) {
      const { error } = await db.rpc('cancel_battle', { p_battle_id: battleId });
      if (error) throw error;
    },

    async cancelStaleBattles(olderThanSeconds) {
      const { data, error } = await db.rpc('cancel_stale_battles', {
        p_older_than_seconds: olderThanSeconds,
      });
      if (error) throw error;
      return data as number;
    },
  };
}

/** Valida el access token del usuario contra Supabase Auth (sirve con claves simétricas o asimétricas). */
export function createTokenVerifier(db: SupabaseClient<Database>): VerifyToken {
  return async (token) => {
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  };
}

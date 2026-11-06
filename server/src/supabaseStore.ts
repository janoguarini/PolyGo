import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database, Json } from '../../src/lib/database.generated';
import { BOT_CALIBRATION } from '../../shared/bots';
import { PROTOCOL_VERSION } from '../../shared/protocol';
import { RATING_CONFIG } from '../../shared/ranking';
import { wordLevel, type RushWord } from '../../shared/wordRush';
import {
  StaleRatingError,
  type BattleStore,
  type BotBattleStart,
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
        .select(
          'id, username, avatar_id, avatar_path, frame_id, target_language, onboarding_completed_at',
        )
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      if (!profile?.username || !profile.onboarding_completed_at) return null;

      const { data: rating, error: ratingError } = await db
        .from('player_ratings')
        .select('rating, games_played, wins')
        .eq('user_id', userId)
        .eq('language_code', profile.target_language)
        .maybeSingle();
      if (ratingError) throw ratingError;
      if (!rating) return null;

      // Sólo para decidir si ofrecer un bot de calibración: la base lo vuelve a contar al empezar.
      const { data: used, error: usedError } = await db.rpc('bot_calibration_used', {
        p_user_id: userId,
        p_language_code: profile.target_language,
      });
      if (usedError) throw usedError;

      return {
        userId,
        username: profile.username,
        avatarId: profile.avatar_id,
        avatarPath: profile.avatar_path,
        frameId: profile.frame_id,
        languageCode: profile.target_language,
        rating: rating.rating,
        gamesPlayed: rating.games_played,
        wins: rating.wins,
        botCalibrationLeft: Math.max(0, BOT_CALIBRATION.ratedGames - (used ?? 0)),
      } satisfies PlayerInfo;
    },

    async loadWords(languageCode) {
      const { data, error } = await db
        .from('words')
        .select('id, text, translation_es, unit_id, emoji')
        .eq('language_code', languageCode)
        .eq('is_published', true);
      if (error) throw error;
      return (data ?? []).map((w): RushWord => ({
        id: w.id,
        text: w.text,
        translationEs: w.translation_es,
        emoji: w.emoji,
        level: wordLevel(w.unit_id),
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

    async startBotBattle(battleId, languageCode, player, bot, rated) {
      const { data, error } = await db.rpc('start_bot_battle_v2', {
        p_battle_id: battleId,
        p_language_code: languageCode,
        p_player: player,
        p_bot_name: bot.name,
        p_bot_avatar_id: bot.avatarId,
        p_bot_rating: bot.rating,
        p_protocol_version: PROTOCOL_VERSION,
        p_rated: rated,
      });
      if (error) throw error;
      const res = data as unknown as {
        rated: boolean;
        calibration_used: number;
        calibration_limit: number;
      };
      return {
        rated: res.rated,
        calibration: { used: res.calibration_used, limit: res.calibration_limit },
      } satisfies BotBattleStart;
    },

    async settlementContext(battleId) {
      const { data, error } = await db.rpc('battle_settlement_context_v2', {
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
        wins: row.wins ?? null,
        matchesInWindow: row.matches_in_window,
        isRanked: row.is_ranked,
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

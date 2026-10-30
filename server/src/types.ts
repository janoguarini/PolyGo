import type { AchievementUnlock } from '../../shared/protocol';
import type { MatchOutcome } from '../../shared/ranking';
import type { RushWord } from '../../shared/wordRush';

export interface PlayerInfo {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath?: string | null;
  languageCode: string;
  rating: number;
  gamesPlayed: number;
}

export interface SettlementContextRow {
  slot: 1 | 2;
  userId: string | null;
  rating: number | null;
  gamesPlayed: number | null;
  matchesInWindow: number;
}

export interface SettlementPlayer {
  slot: 1 | 2;
  score: number;
  correct: number;
  answered: number;
  result: MatchOutcome;
  forfeited: boolean;
  rating_before: number | null;
  games_played_before: number | null;
  rating_after: number | null;
}

export interface SettleResponse {
  duplicate: boolean;
  /** Logros recién desbloqueados por user_id. */
  achievements: Record<string, AchievementUnlock[]>;
}

export class StaleRatingError extends Error {
  constructor() {
    super('stale_rating');
  }
}

/** Todo lo que el servidor lee o escribe en Supabase. En tests se reemplaza por uno en memoria. */
export interface BattleStore {
  /** null si el usuario no existe o no completó el onboarding. */
  getPlayer(userId: string): Promise<PlayerInfo | null>;
  loadWords(languageCode: string): Promise<RushWord[]>;
  startBattle(
    battleId: string,
    languageCode: string,
    player1: string,
    player2: string,
  ): Promise<void>;
  settlementContext(battleId: string): Promise<SettlementContextRow[]>;
  /** Lanza StaleRatingError si el rating cambió desde el contexto. */
  settleBattle(
    battleId: string,
    status: 'completed' | 'forfeited',
    players: SettlementPlayer[],
  ): Promise<SettleResponse>;
  cancelBattle(battleId: string): Promise<void>;
  cancelStaleBattles(olderThanSeconds: number): Promise<number>;
}

/** Verifica el JWT de Supabase y devuelve el user id, o null si no es válido. */
export type VerifyToken = (token: string) => Promise<string | null>;

export interface Logger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
}

export const consoleLogger: Logger = {
  info: (message, data) => console.log(JSON.stringify({ level: 'info', message, ...data })),
  warn: (message, data) => console.warn(JSON.stringify({ level: 'warn', message, ...data })),
  error: (message, data) => console.error(JSON.stringify({ level: 'error', message, ...data })),
};

export const silentLogger: Logger = { info: () => {}, warn: () => {}, error: () => {} };

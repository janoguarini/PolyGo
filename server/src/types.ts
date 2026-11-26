import type { AchievementUnlock, CalibrationInfo, ErrorCode } from '../../shared/protocol';
import type { MatchOutcome } from '../../shared/ranking';
import type { ArcadeSentence } from '../../shared/arcade';
import type { RushWord } from '../../shared/wordRush';

export interface PlayerInfo {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath?: string | null;
  frameId?: string | null;
  /** Bot de shared/bots.ts: no tiene cuenta y nunca se conecta. */
  isBot?: boolean;
  languageCode: string;
  rating: number;
  gamesPlayed: number;
  /** Victorias ranked en este idioma: con 0 está sin posicionar (shared/ranking.ts: isPlaced). */
  wins?: number;
  /** Partidas de calibración contra bots que le quedan en este idioma (la base decide al empezar). */
  botCalibrationLeft?: number;
  /**
   * Puntajes de sus últimas partidas de Word Rush (protocolo 3) completas en este idioma, más nuevas
   * primero. Sólo para elegir el objetivo del bot (shared/botPacing.ts).
   */
  recentScores?: number[];
  /** Bot: puntaje al que apunta en esta partida (null o ausente = bot de siempre, por rating). */
  botTargetScore?: number | null;
  /**
   * Fase C.8: nivel curricular que declaró su cliente en el handshake (0 si no lo declaró). Sólo vive
   * en memoria; no lo lee ni lo escribe la base salvo como argumento de rush_common_unit_ids.
   */
  curriculumApi?: number;
}

/** Un jugador humano de la partida, para calcular el vocabulario común (rush_common_unit_ids). */
export interface RushPlayer {
  userId: string;
  /** Nivel curricular de su cliente; ausente = 0. */
  curriculumApi?: number;
}

/** Lo que la base decidió al crear una partida contra un bot (start_bot_battle_v2). */
export interface BotBattleStart {
  /** true = de calibración (mueve el ELO); false = práctica, sin ELO. */
  rated: boolean;
  calibration: CalibrationInfo;
}

export interface SettlementContextRow {
  slot: 1 | 2;
  userId: string | null;
  rating: number | null;
  gamesPlayed: number | null;
  /** Victorias antes de la partida (null si la cuenta se borró). */
  wins: number | null;
  matchesInWindow: number;
  /** false = la partida no mueve el ELO (bot fuera del cupo de calibración). */
  isRanked: boolean;
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

/** Lo que la base dice de un desafío al anfitrión que se pone a esperar. */
export interface ChallengeHost {
  languageCode: string;
  /** Amigo invitado (desafío dirigido) o null (cualquiera con el código). */
  inviteeId: string | null;
  /** Vence (ms). */
  expiresAt: number;
}

/** Lo que la base dice de un desafío al amigo que entra con el código. */
export interface ChallengeJoin {
  hostId: string;
  languageCode: string;
}

/** Códigos con los que la base rechaza un desafío (se le reenvían al cliente tal cual). */
export const CHALLENGE_ERRORS: readonly ErrorCode[] = [
  'challenge_not_found',
  'challenge_expired',
  'challenge_taken',
  'own_challenge',
  'host_gone',
  'language_mismatch',
  'challenge_declined',
  'onboarding_required',
];

export class ChallengeError extends Error {
  constructor(readonly code: ErrorCode) {
    super(code);
  }
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
  /**
   * Fases C.7/C.8: unidades cuyo contenido pueden usar TODOS los humanos de la partida, cada uno con el
   * nivel de su cliente (public.rush_common_unit_ids). Sin conjunto, lanza: la partida no se crea
   * (nunca «todas las palabras»). Vale para Word Rush (v2) y Arcade (v3).
   */
  rushUnits(languageCode: string, players: readonly RushPlayer[]): Promise<ReadonlySet<string>>;
  /**
   * Arcade: frases de Sentence Rush (ejercicios order_words publicados, de lecciones publicadas, del
   * curso) más el banco propio de Word Rush (Fase 5, ver wordRushBank.ts; si no se puede leer, sólo
   * las lecciones). Sólo lectura; el filtro de
   * nivel y de ambigüedad lo hace shared/arcade.ts (sentencePool).
   */
  loadSentences(languageCode: string): Promise<ArcadeSentence[]>;
  /** protocolVersion: 2 (Word Rush) o 3 (Arcade), se guarda en battles.protocol_version. */
  startBattle(
    battleId: string,
    languageCode: string,
    player1: string,
    player2: string,
    protocolVersion: number,
  ): Promise<void>;
  /**
   * Partida contra un bot: el slot 2 queda sin usuario, con nombre y avatar del bot. Con `rated`
   * pide que sea de calibración; la base decide según el cupo que le quede al jugador.
   */
  startBotBattle(
    battleId: string,
    languageCode: string,
    player: string,
    bot: { name: string; avatarId: string; rating: number },
    rated: boolean,
    protocolVersion: number,
  ): Promise<BotBattleStart>;
  /**
   * Desafío a un amigo: el anfitrión confirma que el código es suyo y sigue vivo (y renueva seen_at).
   * Lanza ChallengeError si no.
   */
  challengeHost(code: string, hostId: string): Promise<ChallengeHost>;
  /**
   * El amigo entra con el código: mismas reglas que accept_friend_challenge (bloqueos, desafío dirigido
   * a otro, vencido, idioma), sin crear la partida. Lanza ChallengeError si no puede.
   */
  challengeJoin(code: string, guestId: string): Promise<ChallengeJoin>;
  /** Guarda el amistoso (sin ELO) y lo ata al desafío (friend_challenges.battle_id). */
  startFriendlyBattle(
    battleId: string,
    code: string,
    host: string,
    guest: string,
    protocolVersion: number,
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

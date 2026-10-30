/**
 * Contrato tipado entre la app y el servidor de partidas (Socket.IO).
 * Diseño y reglas: docs/BATTLE_PROTOCOL.md. Subir PROTOCOL_VERSION ante cualquier cambio incompatible:
 * el servidor rechaza clientes con otra versión y la cola se separa por versión.
 */

import type { MatchOutcome } from './ranking';

export const PROTOCOL_VERSION = 1;

export const WORD_RUSH = {
  durationMs: 75_000,
  /** Más preguntas de las que alguien puede responder en 75 s: el tiempo es el límite real. */
  questionCount: 40,
  optionsPerQuestion: 4,
  readyTimeoutMs: 10_000,
  countdownMs: 3_000,
  reconnectGraceMs: 15_000,
  correctPoints: 100,
  maxSpeedBonus: 50,
  /** El bonus de velocidad baja linealmente de maxSpeedBonus a 0 en esta ventana. */
  speedBonusWindowMs: 5_000,
  wrongPenalty: 50,
} as const;

export const MATCHMAKING = {
  initialWindow: 100,
  widenBy: 50,
  widenEveryMs: 5_000,
  maxWindow: 400,
  /** Tras este tiempo sin rival la app ofrece el modo práctica (sin ELO). */
  suggestPracticeAfterMs: 30_000,
} as const;

// ---------- máquina de estados ----------

export type BattleStatus =
  'matched' | 'ready' | 'in_progress' | 'reconnecting' | 'completed' | 'forfeited' | 'cancelled';

const TRANSITIONS: Record<BattleStatus, readonly BattleStatus[]> = {
  matched: ['ready', 'cancelled'],
  ready: ['in_progress', 'cancelled'],
  in_progress: ['reconnecting', 'completed'],
  reconnecting: ['in_progress', 'completed', 'forfeited'],
  completed: [],
  forfeited: [],
  cancelled: [],
};

export function canTransition(from: BattleStatus, to: BattleStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function isTerminalStatus(status: BattleStatus): boolean {
  return TRANSITIONS[status].length === 0;
}

// ---------- payloads ----------

export type BattleMode = 'ranked' | 'practice';

export interface PublicPlayer {
  slot: 1 | 2;
  username: string;
  avatarId: string;
  /** Foto propia (ruta en el bucket avatars) o null si usa un zorro. */
  avatarPath?: string | null;
  rating: number;
  gamesPlayed: number;
}

/** Lo único que el cliente ve de una pregunta antes de responder: nunca la respuesta correcta. */
export interface QuestionView {
  index: number;
  direction: 'en_es' | 'es_en';
  prompt: string;
  options: string[];
  /** Hora del servidor (ms) en que se emitió: el bonus de velocidad se mide desde acá. */
  sentAt: number;
}

export interface ScoreLine {
  slot: 1 | 2;
  score: number;
  correct: number;
  answered: number;
  connected: boolean;
}

export type CancelReason = 'ready_timeout' | 'opponent_left' | 'server_error' | 'settlement_failed';

export interface PlayerResult {
  slot: 1 | 2;
  username: string;
  score: number;
  correct: number;
  answered: number;
  /** null en práctica: no hay rival ni resultado. */
  outcome: MatchOutcome | null;
  forfeited: boolean;
  ratingBefore: number | null;
  ratingAfter: number | null;
}

export interface AchievementUnlock {
  id: string;
  title: string;
  icon: string;
}

export interface BattleFinish {
  battleId: string;
  mode: BattleMode;
  status: 'completed' | 'forfeited';
  yourSlot: 1 | 2;
  players: PlayerResult[];
  achievementsUnlocked: AchievementUnlock[];
}

/** Foto completa para retomar la partida tras reconectar. */
export interface BattleSnapshot {
  battleId: string;
  mode: BattleMode;
  status: BattleStatus;
  yourSlot: 1 | 2;
  players: PublicPlayer[];
  serverNow: number;
  readyDeadline: number | null;
  startsAt: number | null;
  endsAt: number | null;
  question: QuestionView | null;
  scores: ScoreLine[];
}

export type ErrorCode =
  | 'unauthorized'
  | 'protocol_mismatch'
  | 'onboarding_required'
  | 'language_unavailable'
  | 'already_in_battle'
  | 'not_in_battle'
  | 'stale_question'
  | 'battle_over'
  | 'invalid_payload'
  | 'server_error';

export interface AnswerResult {
  questionIndex: number;
  correct: boolean;
  correctOption: number;
  points: number;
  score: number;
}

export interface ServerToClientEvents {
  'queue:status': (p: { searching: boolean; window: number; waitedMs: number }) => void;
  'match:found': (p: BattleSnapshot) => void;
  'battle:start': (p: BattleSnapshot) => void;
  'battle:question': (p: QuestionView) => void;
  'battle:score': (p: { scores: ScoreLine[] }) => void;
  'battle:opponent_status': (p: { connected: boolean; graceEndsAt: number | null }) => void;
  'battle:state': (p: BattleSnapshot) => void;
  'battle:finish': (p: BattleFinish) => void;
  'battle:cancel': (p: { battleId: string; reason: CancelReason }) => void;
  'server:error': (p: { code: ErrorCode; message?: string }) => void;
}

export type Ack<T> = (response: { ok: true; data: T } | { ok: false; code: ErrorCode }) => void;

export interface ClientToServerEvents {
  'queue:join': (p: { mode: BattleMode }, ack: Ack<{ mode: BattleMode }>) => void;
  'queue:leave': (ack: Ack<null>) => void;
  'match:ready': (p: { battleId: string }, ack: Ack<null>) => void;
  'battle:answer': (
    p: { battleId: string; questionIndex: number; option: number },
    ack: Ack<AnswerResult>,
  ) => void;
  /** Abandono voluntario: antes de empezar cancela; en juego es derrota inmediata. */
  'battle:leave': (ack: Ack<null>) => void;
  /** Pide la foto actual (p. ej. al volver de segundo plano). */
  'battle:sync': (ack: Ack<BattleSnapshot | null>) => void;
}

/** Datos del handshake (`io(url, { auth })`). */
export interface HandshakeAuth {
  token: string;
  protocolVersion: number;
}

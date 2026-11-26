import type {
  AnswerResult,
  BattleFinish,
  BattleMode,
  BattleSnapshot,
  CalibrationInfo,
  CancelReason,
  ErrorCode,
  MatchRating,
  PublicPlayer,
  QuestionView,
  ScoreLine,
} from '@shared/protocol';

import {
  arcadeFromSnapshot,
  arcadeReducer,
  type ArcadeAction,
  type ArcadeClientState,
} from './arcade/arcadeState';

/**
 * Estado de la pantalla de batalla. Es sólo un reflejo de lo que dice el servidor: el cliente nunca
 * decide puntos, tiempo ni resultado.
 */
export type BattlePhase =
  | 'idle'
  | 'connecting'
  | 'searching'
  | 'found'
  | 'countdown'
  | 'playing'
  | 'finished'
  | 'cancelled'
  | 'error';

export interface AnswerFeedback {
  questionIndex: number;
  chosen: number;
  correctOption: number;
  correct: boolean;
  points: number;
  /** Correctas seguidas tras esta respuesta. */
  streak: number;
  /** Preguntas para escribir: cómo se escribía. */
  correctText?: string;
}

export interface BattleState {
  phase: BattlePhase;
  mode: BattleMode;
  /** Desafío a un amigo: partida entre personas que no mueve el ELO. */
  friendly: boolean;
  /** Quien desafía, mientras espera al amigo. */
  challenge: { code: string; expiresAt: number } | null;
  errorCode: ErrorCode | 'connection' | null;
  /** botCalibrationLeft: partidas contra bots con ELO que le quedan (sólo con servidor de partidas). */
  queue: { window: number; waitedMs: number; botCalibrationLeft?: number } | null;
  battleId: string | null;
  /** Si la partida mueve el ELO (lo dice el servidor); null = flujo sin servidor (ranked de siempre). */
  rating: MatchRating | null;
  calibration: CalibrationInfo | null;
  yourSlot: 1 | 2;
  players: PublicPlayer[];
  /** serverNow − Date.now() al recibir la última foto: para mostrar relojes del servidor. */
  clockOffset: number;
  readyDeadline: number | null;
  startsAt: number | null;
  endsAt: number | null;
  iAmReady: boolean;
  question: QuestionView | null;
  /** Pregunta que llegó mientras se mostraba el feedback de la anterior. */
  queuedQuestion: QuestionView | null;
  feedback: AnswerFeedback | null;
  /** Correctas seguidas propias en esta partida. */
  streak: number;
  answering: boolean;
  scores: ScoreLine[];
  opponent: { connected: boolean; graceEndsAt: number | null };
  result: BattleFinish | null;
  cancelReason: CancelReason | null;
  /**
   * Word Rush con el servidor de partidas (protocolo 3, motor interno «Arcade»); null en el formato
   * clásico de 75 s (desafíos con amigos y el flujo sin servidor de desarrollo).
   */
  arcade: ArcadeClientState | null;
  /**
   * Si la conexión con el servidor de partidas está activa. Socket.IO reconecta solo; mientras tanto
   * la partida sigue corriendo en el servidor y la pantalla lo avisa.
   */
  online: boolean;
}

export type BattleAction =
  | { type: 'connecting'; mode: BattleMode; friendly?: boolean }
  | { type: 'connection_error'; code: ErrorCode | 'connection' }
  | { type: 'joined'; mode: BattleMode }
  | { type: 'queue_status'; window: number; waitedMs: number; botCalibrationLeft?: number }
  | { type: 'challenge_waiting'; code: string; expiresAt: number }
  | { type: 'snapshot'; snapshot: BattleSnapshot; receivedAt: number }
  | { type: 'question'; question: QuestionView }
  | { type: 'scores'; scores: ScoreLine[] }
  | { type: 'opponent_status'; connected: boolean; graceEndsAt: number | null }
  | { type: 'ready_sent' }
  | { type: 'answer_sent' }
  | { type: 'answer_result'; result: AnswerResult; chosen: number }
  | { type: 'answer_rejected' }
  | { type: 'feedback_done' }
  | { type: 'finished'; result: BattleFinish }
  | { type: 'cancelled'; reason: CancelReason }
  /** Al reconectar, el servidor ya no tiene la partida (terminó mientras no estábamos). */
  | { type: 'lost' }
  | { type: 'reset' }
  /** La conexión con el servidor de partidas se cayó o volvió. */
  | { type: 'socket_status'; online: boolean }
  | ArcadeAction;

export const initialBattleState: BattleState = {
  phase: 'idle',
  mode: 'ranked',
  friendly: false,
  challenge: null,
  errorCode: null,
  queue: null,
  battleId: null,
  rating: null,
  calibration: null,
  yourSlot: 1,
  players: [],
  clockOffset: 0,
  readyDeadline: null,
  startsAt: null,
  endsAt: null,
  iAmReady: false,
  question: null,
  queuedQuestion: null,
  feedback: null,
  streak: 0,
  answering: false,
  scores: [],
  opponent: { connected: true, graceEndsAt: null },
  result: null,
  cancelReason: null,
  arcade: null,
  online: true,
};

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'connecting':
      return {
        ...initialBattleState,
        phase: 'connecting',
        mode: action.mode,
        friendly: action.friendly ?? false,
      };

    case 'connection_error':
      // Una caída de red en medio de la partida no es un error: Socket.IO reconecta solo.
      if (action.code === 'connection' && isInBattle(state)) return state;
      return { ...state, phase: 'error', errorCode: action.code };

    case 'joined':
      return {
        ...initialBattleState,
        // Contra un bot de práctica el rival llega enseguida (match:found).
        phase:
          action.mode === 'ranked'
            ? 'searching'
            : action.mode === 'bot_practice'
              ? 'connecting'
              : 'countdown',
        mode: action.mode,
        friendly: state.friendly,
        clockOffset: state.clockOffset,
      };

    case 'queue_status':
      if (state.phase !== 'searching') return state;
      return {
        ...state,
        queue: {
          window: action.window,
          waitedMs: action.waitedMs,
          botCalibrationLeft: action.botCalibrationLeft,
        },
      };

    case 'challenge_waiting':
      return {
        ...state,
        phase: 'searching',
        challenge: { code: action.code, expiresAt: action.expiresAt },
      };

    case 'snapshot':
      return applySnapshot(state, action.snapshot, action.receivedAt);

    case 'question':
      if (state.phase === 'finished' || state.phase === 'cancelled') return state;
      if (state.feedback) return { ...state, phase: 'playing', queuedQuestion: action.question };
      return { ...state, phase: 'playing', question: action.question, answering: false };

    case 'scores':
      return { ...state, scores: action.scores };

    case 'opponent_status':
      return {
        ...state,
        opponent: { connected: action.connected, graceEndsAt: action.graceEndsAt },
      };

    case 'ready_sent':
      return { ...state, iAmReady: true };

    case 'answer_sent':
      return { ...state, answering: true };

    case 'answer_result':
      if (state.question?.index !== action.result.questionIndex) return state;
      return {
        ...state,
        feedback: {
          questionIndex: action.result.questionIndex,
          chosen: action.chosen,
          correctOption: action.result.correctOption,
          correct: action.result.correct,
          points: action.result.points,
          streak: action.result.streak ?? 0,
          correctText: action.result.correctText,
        },
        streak: action.result.streak ?? 0,
        scores: state.scores.map((line) =>
          line.slot === state.yourSlot ? { ...line, score: action.result.score } : line,
        ),
      };

    case 'answer_rejected':
      return { ...state, answering: false };

    case 'feedback_done':
      return {
        ...state,
        feedback: null,
        answering: false,
        question: state.queuedQuestion ?? null,
        queuedQuestion: null,
      };

    case 'finished':
      return {
        ...state,
        phase: 'finished',
        result: action.result,
        rating: action.result.rating ?? state.rating,
        answering: false,
      };

    case 'cancelled':
      return { ...state, phase: 'cancelled', cancelReason: action.reason, answering: false };

    case 'lost':
      return { ...state, phase: 'cancelled', cancelReason: null, answering: false };

    case 'reset':
      return initialBattleState;

    case 'socket_status':
      return state.online === action.online ? state : { ...state, online: action.online };

    case 'arcade_challenge':
    case 'arcade_submit':
    case 'arcade_result':
    case 'arcade_rejected': {
      if (!state.arcade || (state.phase !== 'playing' && state.phase !== 'countdown')) return state;
      const arcade = arcadeReducer(state.arcade, action);
      if (action.type !== 'arcade_result') {
        return {
          ...state,
          arcade,
          phase: action.type === 'arcade_challenge' ? 'playing' : state.phase,
        };
      }
      return {
        ...state,
        arcade,
        // El puntaje propio confirmado por el servidor (el del rival llega con battle:score).
        scores: state.scores.map((line) =>
          line.slot === state.yourSlot ? { ...line, score: action.result.score } : line,
        ),
      };
    }
  }
}

function applySnapshot(state: BattleState, s: BattleSnapshot, receivedAt: number): BattleState {
  if (s.status === 'completed' || s.status === 'forfeited' || s.status === 'cancelled') {
    return state;
  }
  const phase: BattlePhase =
    s.status === 'matched' ? 'found' : s.status === 'ready' ? 'countdown' : 'playing';
  const sameQuestion = state.question?.index === s.question?.index;
  return {
    ...state,
    phase,
    mode: s.mode,
    // El amistoso en el servidor de partidas llega como su propio modo.
    friendly: state.friendly || s.mode === 'friendly',
    errorCode: null,
    battleId: s.battleId,
    rating: s.rating ?? null,
    calibration: s.calibration ?? null,
    yourSlot: s.yourSlot,
    players: s.players,
    clockOffset: s.serverNow - receivedAt,
    // Una foto del servidor llega por una conexión activa.
    online: true,
    readyDeadline: s.readyDeadline,
    startsAt: s.startsAt,
    endsAt: s.endsAt,
    iAmReady: s.battleId === state.battleId ? state.iAmReady : false,
    // Tras reconectar, la pregunta del servidor manda; se descarta un feedback a medias.
    question: s.question,
    queuedQuestion: null,
    feedback: sameQuestion ? state.feedback : null,
    answering: sameQuestion ? state.answering : false,
    scores: s.scores,
    // La foto del servidor manda: tras reconectar se descartan respuestas sin confirmar.
    arcade: s.arcade ? arcadeFromSnapshot(state.arcade, s.arcade) : null,
  };
}

/**
 * Si la partida mueve el ELO: abandonarla cuesta rating. Sin dato del servidor (flujo viejo), toda
 * ranked lo mueve.
 */
export function isRated(state: Pick<BattleState, 'mode' | 'rating' | 'friendly'>): boolean {
  return state.mode === 'ranked' && !state.friendly && state.rating !== 'unrated';
}

export function isInBattle(state: BattleState): boolean {
  return state.phase === 'found' || state.phase === 'countdown' || state.phase === 'playing';
}

export function myLine(state: BattleState): ScoreLine | undefined {
  return state.scores.find((l) => l.slot === state.yourSlot);
}

export function opponentLine(state: BattleState): ScoreLine | undefined {
  return state.scores.find((l) => l.slot !== state.yourSlot);
}

export function opponentPlayer(state: BattleState): PublicPlayer | undefined {
  return state.players.find((p) => p.slot !== state.yourSlot);
}

/** Milisegundos restantes hasta un instante del servidor, según el reloj local corregido. */
export function remainingMs(serverInstant: number | null, clockOffset: number, localNow: number) {
  if (serverInstant === null) return null;
  return Math.max(0, serverInstant - (localNow + clockOffset));
}

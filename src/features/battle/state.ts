import type {
  AnswerResult,
  BattleFinish,
  BattleMode,
  BattleSnapshot,
  CancelReason,
  ErrorCode,
  PublicPlayer,
  QuestionView,
  ScoreLine,
} from '@shared/protocol';

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
}

export interface BattleState {
  phase: BattlePhase;
  mode: BattleMode;
  /** Desafío a un amigo: partida entre personas que no mueve el ELO. */
  friendly: boolean;
  /** Quien desafía, mientras espera al amigo. */
  challenge: { code: string; expiresAt: number } | null;
  errorCode: ErrorCode | 'connection' | null;
  queue: { window: number; waitedMs: number } | null;
  battleId: string | null;
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
  answering: boolean;
  scores: ScoreLine[];
  opponent: { connected: boolean; graceEndsAt: number | null };
  result: BattleFinish | null;
  cancelReason: CancelReason | null;
}

export type BattleAction =
  | { type: 'connecting'; mode: BattleMode; friendly?: boolean }
  | { type: 'connection_error'; code: ErrorCode | 'connection' }
  | { type: 'joined'; mode: BattleMode }
  | { type: 'queue_status'; window: number; waitedMs: number }
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
  | { type: 'reset' };

export const initialBattleState: BattleState = {
  phase: 'idle',
  mode: 'ranked',
  friendly: false,
  challenge: null,
  errorCode: null,
  queue: null,
  battleId: null,
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
  answering: false,
  scores: [],
  opponent: { connected: true, graceEndsAt: null },
  result: null,
  cancelReason: null,
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
        phase: action.mode === 'ranked' ? 'searching' : 'countdown',
        mode: action.mode,
        friendly: state.friendly,
        clockOffset: state.clockOffset,
      };

    case 'queue_status':
      if (state.phase !== 'searching') return state;
      return { ...state, queue: { window: action.window, waitedMs: action.waitedMs } };

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
        },
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
      return { ...state, phase: 'finished', result: action.result, answering: false };

    case 'cancelled':
      return { ...state, phase: 'cancelled', cancelReason: action.reason, answering: false };

    case 'lost':
      return { ...state, phase: 'cancelled', cancelReason: null, answering: false };

    case 'reset':
      return initialBattleState;
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
    errorCode: null,
    battleId: s.battleId,
    yourSlot: s.yourSlot,
    players: s.players,
    clockOffset: s.serverNow - receivedAt,
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
  };
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

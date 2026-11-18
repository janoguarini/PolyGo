import type { AnswerVerdict } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

/**
 * Estado puro del reproductor de lecciones/repasos.
 * - Los ejercicios fallados vuelven al final de la cola ("repaso de errores").
 * - Cada ejercicio puede reintentarse como máximo MAX_RETRIES veces para que la sesión siempre termine.
 * - La precisión se mide sobre el primer intento de cada ejercicio.
 */

export const MAX_RETRIES = 2;

export interface Attempt {
  exerciseId: string;
  answer: string;
  correct: boolean;
  firstTry: boolean;
  responseMs: number;
  /** La respuesta tal cual (la corrige el servidor en la ruta nueva). */
  response?: UserAnswer;
  /** Ayudas usadas al responder (ref_assists). */
  assists?: Record<string, number | boolean>;
}

export interface PlayerState {
  exercises: Exercise[];
  /**
   * Repeticiones por ejercicio fallado (MAX_RETRIES). En los repasos del servidor también: las corrige
   * el servidor, pero sólo el primer intento es evidencia (cierre de la fase 4, P4).
   */
  maxRetries: number;
  queue: string[];
  attempts: Attempt[];
  retries: Record<string, number>;
  phase: 'answering' | 'feedback' | 'finished';
  lastVerdict: AnswerVerdict | null;
  lastAnswer: string | null;
}

export type PlayerAction =
  | {
      type: 'answer';
      verdict: AnswerVerdict;
      answer: string;
      responseMs: number;
      response?: UserAnswer;
      assists?: Record<string, number | boolean>;
    }
  | { type: 'continue' };

export interface PlayerOptions {
  maxRetries?: number;
  /**
   * Intentos ya registrados (retomar una sesión del servidor interrumpida), en orden: el primero de cada
   * ejercicio con firstTry y después sus repeticiones. Un ejercicio acertado o sin repeticiones
   * disponibles queda resuelto; uno fallado con repeticiones disponibles vuelve al final de la cola,
   * después de los que no se respondieron.
   */
  answered?: Attempt[];
}

export function createPlayer(exercises: Exercise[], options: PlayerOptions = {}): PlayerState {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  const answered = options.answered ?? [];
  const attempts: Attempt[] = [];
  const fresh: string[] = [];
  const again: string[] = [];
  const retries: Record<string, number> = {};
  for (const e of exercises) {
    // A lo sumo el primer intento y maxRetries repeticiones.
    const mine = answered.filter((a) => a.exerciseId === e.id).slice(0, maxRetries + 1);
    attempts.push(...mine.map((a, i) => ({ ...a, firstTry: i === 0 })));
    if (mine.length === 0) {
      fresh.push(e.id);
      continue;
    }
    if (mine.length > 1) retries[e.id] = mine.length - 1;
    if (!mine[mine.length - 1]!.correct && mine.length - 1 < maxRetries) again.push(e.id);
  }
  const queue = [...fresh, ...again];
  return {
    exercises,
    maxRetries,
    queue,
    attempts,
    retries,
    phase: queue.length === 0 ? 'finished' : 'answering',
    lastVerdict: null,
    lastAnswer: null,
  };
}

export function currentExercise(state: PlayerState): Exercise | null {
  const id = state.queue[0];
  return id ? (state.exercises.find((e) => e.id === id) ?? null) : null;
}

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'answer': {
      const exercise = currentExercise(state);
      if (state.phase !== 'answering' || !exercise) return state;
      const firstTry = !state.attempts.some((a) => a.exerciseId === exercise.id);
      return {
        ...state,
        phase: 'feedback',
        lastVerdict: action.verdict,
        lastAnswer: action.answer,
        attempts: [
          ...state.attempts,
          {
            exerciseId: exercise.id,
            answer: action.answer,
            correct: action.verdict.correct,
            firstTry,
            responseMs: Math.max(0, action.responseMs),
            ...(action.response ? { response: action.response } : {}),
            ...(action.assists ? { assists: action.assists } : {}),
          },
        ],
      };
    }
    case 'continue': {
      if (state.phase !== 'feedback') return state;
      const [id, ...rest] = state.queue;
      if (!id) return { ...state, phase: 'finished' };
      const failed = state.lastVerdict && !state.lastVerdict.correct;
      const used = state.retries[id] ?? 0;
      const requeue = failed && used < state.maxRetries;
      const queue = requeue ? [...rest, id] : rest;
      return {
        ...state,
        queue,
        retries: requeue ? { ...state.retries, [id]: used + 1 } : state.retries,
        phase: queue.length === 0 ? 'finished' : 'answering',
        lastVerdict: null,
        lastAnswer: null,
      };
    }
  }
}

/** Progreso visible: ejercicios resueltos (acertados o sin más reintentos) sobre el total. */
export function progress(state: PlayerState): number {
  if (state.exercises.length === 0) return 1;
  const pending = new Set(state.queue);
  return (state.exercises.length - pending.size) / state.exercises.length;
}

export interface SessionStats {
  total: number;
  firstTryCorrect: number;
  accuracy: number;
  mistakes: Exercise[];
}

export function sessionStats(state: PlayerState): SessionStats {
  const first = state.attempts.filter((a) => a.firstTry);
  const firstTryCorrect = first.filter((a) => a.correct).length;
  const wrongIds = new Set(first.filter((a) => !a.correct).map((a) => a.exerciseId));
  return {
    total: first.length,
    firstTryCorrect,
    accuracy: first.length === 0 ? 0 : firstTryCorrect / first.length,
    mistakes: state.exercises.filter((e) => wrongIds.has(e.id)),
  };
}

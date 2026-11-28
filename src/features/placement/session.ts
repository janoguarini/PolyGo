import type { AnswerVerdict } from '@shared/answers';
import { courseLevels, type CourseDef } from '@shared/courses';
import {
  answerPlacement,
  createPlacement,
  limitBankToLevels,
  placementResult,
  placementUseful,
  type PlacementBank,
  type PlacementResult,
  type PlacementState,
} from '@shared/placement';

import { PLACEMENT_BANKS } from '../../../content/placement/banks.generated';

/**
 * Banco y estado de pantalla del test de nivel (docs/PLACEMENT_TEST.md). Lógica pura: el motor está en
 * shared/placement.ts; acá se agrega lo que ve el usuario (bienvenida, pregunta, feedback, resultado).
 */

/**
 * Banco de un curso, acotado a los niveles publicados hoy del curso (shared/courses.ts). null = el curso no
 * tiene test (un solo nivel publicado o sin banco): empieza en A1.
 */
export function placementBankFor(
  course: CourseDef,
  banks: Readonly<Record<string, PlacementBank>> = PLACEMENT_BANKS,
): PlacementBank | null {
  const bank = banks[course.code];
  if (!bank) return null;
  const limited = limitBankToLevels(bank, courseLevels(course));
  return placementUseful(limited) ? limited : null;
}

export type PlacementPhase = 'intro' | 'question' | 'feedback' | 'result';

export interface PlacementSession {
  phase: PlacementPhase;
  test: PlacementState;
  /** Veredicto y respuesta de la última pregunta (en el feedback). */
  last: { verdict: AnswerVerdict; answer: string } | null;
  /** La última respuesta superó una banda y el test sigue en un nivel nuevo (para festejarlo). */
  levelUp: string | null;
}

export type PlacementSessionAction =
  | { type: 'start' }
  | { type: 'answer'; verdict: AnswerVerdict; answer: string }
  | { type: 'continue' }
  | { type: 'restart' };

export const createSession = (bank: PlacementBank): PlacementSession => ({
  phase: 'intro',
  test: createPlacement(bank),
  last: null,
  levelUp: null,
});

export function sessionReducer(
  state: PlacementSession,
  action: PlacementSessionAction,
): PlacementSession {
  switch (action.type) {
    case 'start':
      return state.phase === 'intro' ? { ...state, phase: 'question' } : state;
    case 'answer': {
      if (state.phase !== 'question') return state;
      const test = answerPlacement(state.test, action.verdict.correct);
      const before = state.test.bank.bands[state.test.band]!.level;
      const now = test.bank.bands[test.band]!.level;
      return {
        ...state,
        phase: 'feedback',
        test,
        last: { verdict: action.verdict, answer: action.answer },
        levelUp: !test.finished && now !== before ? now : null,
      };
    }
    case 'continue':
      if (state.phase !== 'feedback') return state;
      return { ...state, phase: state.test.finished ? 'result' : 'question', last: null };
    case 'restart':
      return createSession(state.test.bank);
  }
}

export const sessionResult = (state: PlacementSession): PlacementResult | null =>
  state.phase === 'result' ? placementResult(state.test) : null;

/** Número de la pregunta en pantalla (1-based). */
export const questionNumber = (state: PlacementSession) =>
  state.test.answers.length + (state.phase === 'question' ? 1 : 0);

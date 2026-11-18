import type { Exercise } from '@shared/exercises';

import {
  canFallBack,
  LearningSessionHttpError,
  startLessonPresentation,
  submitLearningSession,
  type LessonPresentation,
} from '../api';
import { createPlayer, playerReducer } from '../player';
import { matchPresentations, toGradedAttempts } from '../presentation';

const mockRpc = jest.fn();
const mockInvoke = jest.fn();
jest.mock('@/lib/supabase', () => ({
  requireSupabase: () => ({ rpc: mockRpc, functions: { invoke: mockInvoke } }),
}));

/** Cómo devuelve supabase-js un error HTTP de la función: el cuerpo en error.context. */
const httpError = (code: string) => ({
  data: null,
  error: { name: 'FunctionsHttpError', context: { json: async () => ({ error: code }) } },
});

const lessonInput = {
  sessionId: '00000000-0000-4000-8000-000000000001',
  kind: 'lesson' as const,
  lessonId: 'a1-u01-l01',
  startedAt: new Date('2026-11-08T12:00:00Z'),
  attempts: [{ exerciseId: 'e1', answer: 'hola', correct: true, firstTry: true, responseMs: 900 }],
  graded: [
    {
      presentationId: 7,
      answer: { kind: 'option' as const, value: 'hola' },
      clientVerdict: 'correct' as const,
      responseMs: 900,
    },
  ],
};

beforeEach(() => {
  mockRpc
    .mockReset()
    .mockResolvedValue({ data: { session_id: 's', duplicate: false }, error: null });
  mockInvoke.mockReset();
});

describe('submitLearningSession', () => {
  it('lección con presentaciones: va a learning-session con la respuesta estructurada', async () => {
    mockInvoke.mockResolvedValue({
      data: { session_id: 's', duplicate: false, verdicts: [] },
      error: null,
    });
    const r = await submitLearningSession(lessonInput);
    expect(r.verdicts).toEqual([]);
    expect(mockRpc).not.toHaveBeenCalled();
    const [name, options] = mockInvoke.mock.calls[0]!;
    expect(name).toBe('learning-session');
    expect(options.timeout).toBeGreaterThan(0);
    expect(options.body).toMatchObject({
      action: 'submit',
      session_id: lessonInput.sessionId,
      lesson_id: 'a1-u01-l01',
      attempts: [
        {
          presentation_id: 7,
          answer: { kind: 'option', value: 'hola' },
          client_verdict: 'correct',
          response_ms: 900,
          assists: {},
        },
      ],
    });
  });

  it('repasos: siempre la ruta vieja, nunca la función', async () => {
    await submitLearningSession({
      ...lessonInput,
      kind: 'review',
      lessonId: null,
      attempts: [{ wordId: 'w1', answer: 'x', correct: false, firstTry: true, responseMs: 1 }],
    });
    expect(mockInvoke).not.toHaveBeenCalled();
    expect(mockRpc).toHaveBeenCalledWith(
      'submit_learning_session',
      expect.objectContaining({ p_kind: 'review', p_session_id: lessonInput.sessionId }),
    );
  });

  it('lección sin presentaciones: ruta vieja', async () => {
    await submitLearningSession({ ...lessonInput, graded: undefined });
    expect(mockInvoke).not.toHaveBeenCalled();
    expect(mockRpc).toHaveBeenCalledTimes(1);
  });

  it.each([
    [
      'red o tiempo agotado',
      { data: null, error: { name: 'FunctionsFetchError', message: 'timeout' } },
    ],
    ['función caída', httpError('server_error')],
    ['rechazo del corrector', httpError('invalid_sequence')],
  ])('%s: respaldo por la ruta vieja con el mismo session_id', async (_, response) => {
    mockInvoke.mockResolvedValue(response);
    await submitLearningSession(lessonInput);
    expect(mockRpc).toHaveBeenCalledWith(
      'submit_learning_session',
      expect.objectContaining({ p_session_id: lessonInput.sessionId, p_kind: 'lesson' }),
    );
  });

  it.each(['no_energy', 'lesson_locked', 'session_conflict', 'incomplete_lesson', 'unauthorized'])(
    '%s: no hay respaldo, el error llega a la pantalla con su código',
    async (code) => {
      mockInvoke.mockResolvedValue(httpError(code));
      await expect(submitLearningSession(lessonInput)).rejects.toThrow(code);
      expect(mockRpc).not.toHaveBeenCalled();
    },
  );

  it('canFallBack: sólo los errores que no son reglas de la lección', () => {
    expect(canFallBack(new Error('Failed to fetch'))).toBe(true);
    expect(canFallBack(new LearningSessionHttpError('attempts_mismatch'))).toBe(true);
    expect(canFallBack(new LearningSessionHttpError('no_energy'))).toBe(false);
  });
});

describe('startLessonPresentation', () => {
  it('devuelve las presentaciones y usa un tiempo límite', async () => {
    mockInvoke.mockResolvedValue({ data: { presentations: [] }, error: null });
    await expect(startLessonPresentation('s', 'l')).resolves.toEqual([]);
    expect(mockInvoke.mock.calls[0]![1].timeout).toBeGreaterThan(0);
  });

  it('falla (y la lección usa la ruta vieja) con una respuesta inesperada o un error', async () => {
    mockInvoke.mockResolvedValue({ data: { nope: true }, error: null });
    await expect(startLessonPresentation('s', 'l')).rejects.toThrow();
    mockInvoke.mockResolvedValue(httpError('server_error'));
    await expect(startLessonPresentation('s', 'l')).rejects.toThrow('server_error');
  });
});

const ex = (id: string): Exercise => ({
  id,
  lessonId: 'l',
  position: 1,
  type: 'translation_choice',
  skill: 'vocabulary',
  prompt: '',
  payload: { type: 'translation_choice', word: 'hello', options: ['hola', 'chau'] },
  answer: 'hola',
  acceptedAnswers: [],
  explanation: null,
  difficulty: 1,
  recommendedSeconds: 10,
  wordIds: [],
});
const pres = (
  exercise_id: string,
  presentation_id: number,
  item_version_id = 1,
): LessonPresentation => ({
  presentation_id,
  exercise_id,
  item_version_id,
  option_set_id: 3,
  option_order: [1, 0],
  options_shown: ['chau', 'hola'],
});

describe('matchPresentations', () => {
  const content = { exercises: [ex('e1'), ex('e2')], versions: { e1: 1, e2: 1 } };

  it('cubre todos los ejercicios con la misma versión → se usa', () => {
    const m = matchPresentations([pres('e1', 1), pres('e2', 2)], content);
    expect(m?.shownOptions).toEqual({ e1: ['chau', 'hola'], e2: ['chau', 'hola'] });
  });

  it('otra versión, un ejercicio de menos o de más → ruta vieja', () => {
    expect(matchPresentations([pres('e1', 1), pres('e2', 2, 9)], content)).toBeNull();
    expect(matchPresentations([pres('e1', 1)], content)).toBeNull();
    expect(matchPresentations([pres('e1', 1), pres('e2', 2), pres('e3', 3)], content)).toBeNull();
    expect(matchPresentations(undefined, content)).toBeNull();
    expect(
      matchPresentations([pres('e1', 1), pres('e2', 2)], {
        ...content,
        versions: { e1: 1, e2: null },
      }),
    ).toBeNull();
  });
});

describe('toGradedAttempts', () => {
  it('cada intento con su presentación y su respuesta estructurada, en orden', () => {
    let state = createPlayer([ex('e1')]);
    state = playerReducer(state, {
      type: 'answer',
      verdict: { correct: false, expected: 'hola' },
      answer: 'chau',
      responseMs: 500,
      response: { kind: 'option', value: 'chau' },
    });
    state = playerReducer(state, { type: 'continue' });
    state = playerReducer(state, {
      type: 'answer',
      verdict: { correct: true, typo: false, expected: 'hola' },
      answer: 'hola',
      responseMs: 400,
      response: { kind: 'option', value: 'hola' },
      assists: { reading_visible: true },
    });
    const m = matchPresentations([pres('e1', 7)], { exercises: [ex('e1')], versions: { e1: 1 } })!;
    expect(toGradedAttempts(state, m.byExercise)).toEqual([
      {
        presentationId: 7,
        answer: { kind: 'option', value: 'chau' },
        clientVerdict: 'incorrect',
        responseMs: 500,
      },
      {
        presentationId: 7,
        answer: { kind: 'option', value: 'hola' },
        clientVerdict: 'correct',
        responseMs: 400,
        assists: { reading_visible: true },
      },
    ]);
  });

  it('un intento sin respuesta estructurada → ruta vieja', () => {
    let state = createPlayer([ex('e1')]);
    state = playerReducer(state, {
      type: 'answer',
      verdict: { correct: true, typo: false, expected: 'hola' },
      answer: 'hola',
      responseMs: 1,
    });
    const m = matchPresentations([pres('e1', 7)], { exercises: [ex('e1')], versions: { e1: 1 } })!;
    expect(toGradedAttempts(state, m.byExercise)).toBeUndefined();
  });
});

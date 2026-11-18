import type { Exercise } from '@shared/exercises';
import type { ReviewGradingKey } from '@shared/learningSession';

import type { ReviewAnswerResult, ReviewItem } from '../api';
import { createPlayer, playerReducer, sessionStats, type PlayerState } from '../player';
import {
  clientVerdictOf,
  gradingKeys,
  localReviewGrade,
  reconcileWithServer,
  reviewExercise,
  reviewSubmission,
} from '../serverReview';

/**
 * Corrección instantánea de los repasos: claves de start_review, veredicto local y la corrección del
 * servidor, que prevalece (reductor `reconcile` y antes del envío).
 */

jest.mock('@/lib/supabase', () => ({ requireSupabase: jest.fn() }));
jest.mock('@/lib/secureStorage', () => ({
  deviceStorage: { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} },
}));

const KEY: ReviewGradingKey = {
  grader_version: '1.0.0',
  grading_spec: { mode: 'exact_option', mode_version: 1 },
  answer: 'perro',
  accepted_answers: [],
  payload: { type: 'translation_choice', word: 'dog' },
  option_texts: ['perro', 'gato', 'casa'],
  option_order: [1, 0, 2],
  explanation: 'Dog = perro.',
};

function item(id: number, over: Partial<ReviewItem> = {}): ReviewItem {
  return {
    presentation_id: id,
    position: id,
    item_id: `en.item.${id}`,
    item_version_id: 10 + id,
    concept_id: 'en-dog',
    dimension: 'vocabulary',
    reason: 'due',
    type: 'translation_choice',
    skill: 'vocabulary',
    prompt: '¿Qué significa «dog»?',
    payload: { type: 'translation_choice', word: 'dog', options: ['gato', 'perro', 'casa'] },
    options_shown: ['gato', 'perro', 'casa'],
    difficulty: 1,
    recommended_seconds: 20,
    word: { id: 'en-dog', text: 'dog' } as unknown as ReviewItem['word'],
    answered: null,
    ...over,
  };
}

const ok = { correct: true as const, typo: false, expected: 'perro' };
const bad = { correct: false as const, expected: 'perro' };
const opt = (value: string) => ({ kind: 'option' as const, value });

const answer = (state: PlayerState, verdict: typeof ok | typeof bad, value = 'perro') =>
  playerReducer(state, {
    type: 'answer',
    verdict,
    answer: value,
    responseMs: 800,
    response: opt(value),
  });
const next = (state: PlayerState) => playerReducer(state, { type: 'continue' });
const reconcile = (
  state: PlayerState,
  exerciseId: string,
  verdict: typeof ok | typeof bad,
  attemptNo = 1,
  value = 'perro',
) =>
  playerReducer(state, {
    type: 'reconcile',
    exerciseId,
    attemptNo,
    verdict,
    response: opt(value),
    answer: value,
  });

const exercises = (n: number): Exercise[] =>
  Array.from({ length: n }, (_, i) => reviewExercise(item(i + 1)));

describe('claves de corrección (start_review)', () => {
  it('sólo los ítems con una clave válida; el ejercicio sigue sin la respuesta', () => {
    const keys = gradingKeys([
      item(1, { grading_key: KEY }),
      item(2),
      item(3, { grading_key: { ...KEY, answer: 5 } as unknown as ReviewGradingKey }),
    ]);
    expect(Object.keys(keys)).toEqual(['presentation-1']);
    expect(reviewExercise(item(1, { grading_key: KEY })).answer).toBe('');
  });

  it('una clave sin versión del corrector, o con una desconocida, no se usa', () => {
    const { grader_version: _omit, ...unversioned } = KEY;
    const keys = gradingKeys([
      item(1, { grading_key: unversioned as unknown as ReviewGradingKey }),
      item(2, { grading_key: { ...KEY, grader_version: '2.0.0' } }),
    ]);
    expect(Object.keys(keys)).toEqual(['presentation-2']);
    // La versión desconocida llega, pero no corrige: el reproductor espera al servidor.
    expect(localReviewGrade(keys['presentation-2'], opt('perro'))).toBeNull();
  });

  it('learning-session anterior (sin grading_key): ninguna clave → se espera al servidor', () => {
    expect(gradingKeys([item(1), item(2)])).toEqual({});
    expect(localReviewGrade(undefined, opt('perro'))).toBeNull();
  });

  it('veredicto local con la regla del servidor, con la respuesta correcta y la explicación', () => {
    expect(localReviewGrade(KEY, opt('perro'))).toEqual({
      verdict: { correct: true, typo: false, expected: 'perro' },
      explanation: 'Dog = perro.',
    });
    expect(localReviewGrade(KEY, opt('gato'))).toEqual({
      verdict: { correct: false, expected: 'perro' },
      explanation: 'Dog = perro.',
    });
    // Una opción que no se presentó es invalid_response: incorrecta, como en el servidor.
    expect(localReviewGrade(KEY, opt('otra'))!.verdict.correct).toBe(false);
    expect(clientVerdictOf(ok)).toBe('correct');
    expect(clientVerdictOf({ correct: true, typo: true, expected: 'x' })).toBe('typo');
    expect(clientVerdictOf(bad)).toBe('incorrect');
  });
});

describe('reconcile: la corrección del servidor prevalece', () => {
  it('igual que la local: no cambia nada visible', () => {
    let s = answer(createPlayer(exercises(2)), ok);
    const before = s;
    s = reconcile(s, 'presentation-1', ok);
    expect(s.lastVerdict).toEqual(ok);
    expect(s.queue).toEqual(before.queue);
    expect(s.attempts).toEqual(before.attempts);
  });

  it('distinta y todavía en el feedback: se muestra la del servidor y «Continuar» decide con ella', () => {
    let s = answer(createPlayer(exercises(2)), ok);
    s = reconcile(s, 'presentation-1', bad);
    expect(s.lastVerdict).toEqual(bad);
    expect(s.attempts[0]!.correct).toBe(false);
    s = next(s);
    expect(s.queue).toEqual(['presentation-2', 'presentation-1']);
  });

  it('la app dijo bien, el servidor mal, ya se siguió: vuelve al final de la cola', () => {
    let s = next(answer(createPlayer(exercises(2)), ok));
    expect(s.queue).toEqual(['presentation-2']);
    s = reconcile(s, 'presentation-1', bad);
    expect(s.queue).toEqual(['presentation-2', 'presentation-1']);
    expect(s.retries['presentation-1']).toBe(1);
    expect(sessionStats(s).firstTryCorrect).toBe(0);
  });

  it('la app dijo mal, el servidor bien, ya se siguió: deja de preguntarse', () => {
    let s = next(answer(createPlayer(exercises(2)), bad, 'gato'));
    expect(s.queue).toEqual(['presentation-2', 'presentation-1']);
    s = reconcile(s, 'presentation-1', ok, 1, 'gato');
    expect(s.queue).toEqual(['presentation-2']);
    expect(s.phase).toBe('answering');
    expect(sessionStats(s).firstTryCorrect).toBe(1);
  });

  it('si era el que estaba en pantalla para repetir, se pasa al siguiente o termina', () => {
    let s = next(answer(createPlayer(exercises(1)), bad, 'gato'));
    expect(s.queue).toEqual(['presentation-1']);
    s = reconcile(s, 'presentation-1', ok, 1, 'gato');
    expect(s.queue).toEqual([]);
    expect(s.phase).toBe('finished');
  });

  it('una sesión terminada no se reabre: sólo se corrige el intento', () => {
    let s = next(answer(createPlayer(exercises(1)), ok));
    expect(s.phase).toBe('finished');
    s = reconcile(s, 'presentation-1', bad);
    expect(s.phase).toBe('finished');
    expect(s.queue).toEqual([]);
    expect(s.attempts[0]!.correct).toBe(false);
  });

  it('sin repeticiones disponibles no se vuelve a encolar', () => {
    let s = createPlayer(exercises(1), { maxRetries: 0 });
    s = answer(s, ok);
    s = reconcile(next(s), 'presentation-1', bad);
    expect(s.queue).toEqual([]);
  });

  it('un intento que no existe se ignora', () => {
    const s = answer(createPlayer(exercises(1)), ok);
    expect(reconcile(s, 'presentation-1', bad, 2)).toBe(s);
    expect(reconcile(s, 'presentation-9', bad)).toBe(s);
  });

  it('la respuesta registrada por el servidor reemplaza a la local (se envía esa)', () => {
    let s = answer(createPlayer(exercises(1)), ok, 'perro');
    s = reconcile(s, 'presentation-1', bad, 1, 'gato');
    expect(s.attempts[0]!.response).toEqual(opt('gato'));
    expect(reviewSubmission(s)).toEqual([
      expect.objectContaining({ presentationId: 1, answer: opt('gato') }),
    ]);
  });
});

describe('reconcileWithServer (antes del envío)', () => {
  const result = (id: number, attempt: number, verdict: 'correct' | 'incorrect', value: string) =>
    ({
      presentation_id: id,
      attempt_no: attempt,
      duplicate: false,
      matches: true,
      response: opt(value),
      status: 'valid',
      verdict,
      response_ms: 800,
      assists: {},
      answer: 'perro',
      explanation: null,
    }) as ReviewAnswerResult;

  it('aplica la corrección del servidor a cada intento, sin reabrir la sesión', () => {
    let s = createPlayer(exercises(2));
    s = next(answer(s, ok)); // 1: la app dijo bien
    s = next(answer(s, bad, 'gato')); // 2: la app dijo mal → se repite
    s = next(answer(s, ok)); // 2, repetición
    expect(s.phase).toBe('finished');
    const results = new Map([
      ['1#1', result(1, 1, 'incorrect', 'perro')],
      ['2#1', result(2, 1, 'correct', 'gato')],
    ]);
    const settled = reconcileWithServer(s, results);
    expect(settled.phase).toBe('finished');
    expect(settled.attempts.map((a) => [a.exerciseId, a.correct, a.firstTry])).toEqual([
      ['presentation-1', false, true],
      ['presentation-2', true, true],
      ['presentation-2', true, false],
    ]);
    expect(sessionStats(settled).firstTryCorrect).toBe(1);
    expect(reviewSubmission(settled)).toHaveLength(2);
  });

  it('sin correcciones del servidor devuelve el mismo estado', () => {
    const s = next(answer(createPlayer(exercises(1)), ok));
    expect(reconcileWithServer(s, new Map())).toBe(s);
  });
});

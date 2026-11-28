import { MAX_REVIEW_ATTEMPTS } from '@shared/learningSession';

import type { ReviewItem } from '../api';
import { createPlayer, playerReducer, type PlayerAction } from '../player';
import {
  SERVER_REVIEW_RETRIES,
  answeredAttempts,
  clearOpenReview,
  loadOpenReview,
  reviewKind,
  presentationIdOf,
  remoteGrade,
  reviewExercise,
  reviewSession,
  reviewSubmission,
  saveOpenReview,
  serverVerdict,
} from '../serverReview';

jest.mock('@/lib/secureStorage', () => {
  const store = new Map<string, string>();
  return {
    deviceStorage: {
      getItem: async (k: string) => store.get(k) ?? null,
      setItem: async (k: string, v: string) => void store.set(k, v),
      removeItem: async (k: string) => void store.delete(k),
    },
  };
});

const word = {
  id: 'en-dog',
  text: 'dog',
  translation_es: 'perro',
} as unknown as ReviewItem['word'];

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
    word,
    answered: null,
    ...over,
  };
}

describe('repasos del servidor en la app (fase 4)', () => {
  test('el ejercicio no trae la respuesta hasta que el servidor corrige', () => {
    const e = reviewExercise(item(1));
    expect(e.id).toBe('presentation-1');
    expect(presentationIdOf(e.id)).toBe(1);
    expect(e.answer).toBe('');
    expect(e.wordIds).toEqual(['en-dog']);
    const s = reviewSession([item(1)]);
    expect(s.shownOptions['presentation-1']).toEqual(['gato', 'perro', 'casa']);
    expect(s.exercises[0]!.lessonId).toBeNull();
  });

  test('un payload que la app no entiende es un error, no se saltea', () => {
    expect(() => reviewExercise(item(1, { payload: { type: 'translation_choice' } }))).toThrow();
  });

  test('veredicto del servidor: typo cuenta como acierto, invalid_response como error', () => {
    expect(serverVerdict({ status: 'valid', verdict: 'typo', answer: 'perro' })).toEqual({
      correct: true,
      typo: true,
      expected: 'perro',
    });
    expect(
      serverVerdict({ status: 'invalid_response', verdict: null, answer: 'perro' }).correct,
    ).toBe(false);
    const g = remoteGrade({
      presentation_id: 1,
      duplicate: true,
      matches: false,
      response: { kind: 'option', value: 'gato' },
      status: 'valid',
      verdict: 'incorrect',
      response_ms: 900,
      assists: {},
      answer: 'perro',
      explanation: null,
    });
    // Con una respuesta ya registrada vale ésa, no la recién enviada.
    expect(g.response).toEqual({ kind: 'option', value: 'gato' });
    expect(g.verdict.correct).toBe(false);
  });

  test('retomar: las respondidas salen de la cola; sin reintentos; el envío trae una por presentación', () => {
    const answered = item(1, {
      answered: {
        response: { kind: 'option', value: 'perro' },
        status: 'valid',
        verdict: 'correct',
        response_ms: 1200,
        assists: {},
        answer: 'perro',
        explanation: null,
      },
    });
    const items = [answered, item(2)];
    const s = reviewSession(items);
    expect(answeredAttempts(items)).toHaveLength(1);
    let state = createPlayer(s.exercises, { maxRetries: 0, answered: s.answered });
    expect(state.queue).toEqual(['presentation-2']);
    state = playerReducer(state, {
      type: 'answer',
      verdict: { correct: false, expected: 'perro' },
      answer: 'gato',
      responseMs: 800,
      response: { kind: 'option', value: 'gato' },
    });
    state = playerReducer(state, { type: 'continue' });
    expect(state.phase).toBe('finished');
    expect(reviewSubmission(state)).toEqual([
      { presentationId: 1, answer: { kind: 'option', value: 'perro' }, responseMs: 1200 },
      { presentationId: 2, answer: { kind: 'option', value: 'gato' }, responseMs: 800 },
    ]);
  });

  test('todo respondido: la sesión retomada termina enseguida (sólo falta enviar)', () => {
    const done = item(1, {
      answered: {
        response: { kind: 'option', value: 'perro' },
        status: 'valid',
        verdict: 'correct',
        response_ms: 1,
        assists: {},
        answer: 'perro',
        explanation: null,
      },
    });
    const s = reviewSession([done]);
    expect(createPlayer(s.exercises, { maxRetries: 0, answered: s.answered }).phase).toBe(
      'finished',
    );
  });

  test('sesión abierta: una por idioma y tipo; la vigencia la decide el servidor (P7)', async () => {
    const open = { sessionId: 's1', startedAt: '2026-11-08T12:00:00.000Z', date: '2026-11-08' };
    await saveOpenReview('en', open);
    const at = (iso: string) => Date.parse(iso);
    expect(await loadOpenReview('en', 'review', at('2026-11-08T13:00:00Z'))).toEqual(open);
    // Al día siguiente (o en otra zona horaria) se le pregunta al servidor: puede estar completa y
    // faltar sólo enviarla.
    expect(await loadOpenReview('en', 'review', at('2026-11-09T13:00:00Z'))).toEqual(open);
    // Más allá del vencimiento del plan (90 días) no hay nada que retomar.
    expect(await loadOpenReview('en', 'review', at('2027-02-07T12:00:00Z'))).toBeNull();
    expect(await loadOpenReview('it', 'review', at('2026-11-08T13:00:00Z'))).toBeNull();
    // Los repasos Plus guardan su propia sesión.
    expect(reviewKind({ kind: 'smart' })).toBe('smart');
    expect(reviewKind({ kind: 'topic', unit_id: 'a1-u02' })).toBe('topic.a1-u02');
    // Coach: el orden de las unidades no cambia la sesión guardada.
    expect(reviewKind({ kind: 'coach', unit_ids: ['a1-u03', 'a1-u01'] })).toBe(
      'coach.a1-u01+a1-u03',
    );
    expect(await loadOpenReview('en', 'smart', at('2026-11-08T13:00:00Z'))).toBeNull();
    await saveOpenReview('en', { ...open, sessionId: 's2' }, 'smart');
    expect((await loadOpenReview('en', 'smart', at('2026-11-08T13:00:00Z')))?.sessionId).toBe('s2');
    await clearOpenReview('en', 'smart');
    expect((await loadOpenReview('en', 'review', at('2026-11-08T13:00:00Z')))?.sessionId).toBe(
      's1',
    );
  });

  test('P4: un error vuelve al final hasta 2 veces; las repeticiones no entran en el envío', () => {
    expect(SERVER_REVIEW_RETRIES).toBe(MAX_REVIEW_ATTEMPTS - 1);
    const s = reviewSession([item(1), item(2)]);
    let state = createPlayer(s.exercises, { maxRetries: SERVER_REVIEW_RETRIES });
    const wrong: PlayerAction = {
      type: 'answer',
      verdict: { correct: false, expected: 'perro' },
      answer: 'gato',
      responseMs: 500,
      response: { kind: 'option', value: 'gato' },
    };
    const right: PlayerAction = {
      ...wrong,
      verdict: { correct: true, typo: false, expected: 'perro' },
      answer: 'perro',
    };
    const step = (a: PlayerAction) => {
      state = playerReducer(state, a);
      state = playerReducer(state, { type: 'continue' });
    };
    step(wrong); // 1: falla
    step(right); // 2: acierta
    expect(state.queue).toEqual(['presentation-1']);
    step(wrong); // 1, repetición 1
    step(wrong); // 1, repetición 2: ya no vuelve
    expect(state.phase).toBe('finished');
    expect(state.attempts.filter((a) => a.exerciseId === 'presentation-1')).toHaveLength(3);
    expect(reviewSubmission(state).map((a) => a.presentationId)).toEqual([1, 2]);
  });

  test('P4: retomar con una repetición pendiente la pone al final; agotadas o acertadas, no', () => {
    const graded = (verdict: 'correct' | 'incorrect') => ({
      response: { kind: 'option' as const, value: verdict === 'correct' ? 'perro' : 'gato' },
      status: 'valid' as const,
      verdict,
      response_ms: 700,
      assists: {},
    });
    const items = [
      // Falló y le queda una repetición.
      item(1, {
        answered: { ...graded('incorrect'), answer: 'perro', explanation: null },
        retries: [{ attempt_no: 2, ...graded('incorrect') }],
      }),
      // Falló y acertó en la repetición.
      item(2, {
        answered: { ...graded('incorrect'), answer: 'perro', explanation: null },
        retries: [{ attempt_no: 2, ...graded('correct') }],
      }),
      item(3),
    ];
    const s = reviewSession(items);
    expect(s.answered.map((a) => [a.exerciseId, a.firstTry, a.correct])).toEqual([
      ['presentation-1', true, false],
      ['presentation-1', false, false],
      ['presentation-2', true, false],
      ['presentation-2', false, true],
    ]);
    const state = createPlayer(s.exercises, {
      maxRetries: SERVER_REVIEW_RETRIES,
      answered: s.answered,
    });
    expect(state.queue).toEqual(['presentation-3', 'presentation-1']);
    expect(state.retries).toEqual({ 'presentation-1': 1, 'presentation-2': 1 });
    expect(reviewSubmission(state).map((a) => a.presentationId)).toEqual([1, 2]);
  });
});

describe('fase 5: ítems de varios conceptos y contrato', () => {
  test('el ejercicio lleva todas las palabras del ítem y el mapa de palabras las incluye', () => {
    const cat = {
      id: 'en-cat',
      text: 'cat',
      translation_es: 'gato',
    } as unknown as ReviewItem['word'];
    const multi = item(1, { words: [word, cat] });
    expect(reviewExercise(multi).wordIds).toEqual(['en-dog', 'en-cat']);
    expect(Object.keys(reviewSession([multi, item(2)]).words).sort()).toEqual(['en-cat', 'en-dog']);
    // Respuestas viejas sin `words` siguen funcionando.
    expect(reviewExercise(item(3)).wordIds).toEqual(['en-dog']);
  });
});

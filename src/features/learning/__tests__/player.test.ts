import type { Exercise } from '@shared/exercises';

import { withStatus } from '../curriculum';
import {
  createPlayer,
  currentExercise,
  MAX_RETRIES,
  playerReducer,
  progress,
  sessionStats,
} from '../player';
import { shuffle, shuffleDifferent } from '../random';
import { buildReviewExercises } from '../review';
import type { WordRow } from '../api';

const ex = (id: string): Exercise => ({
  id,
  lessonId: 'l1',
  position: 1,
  type: 'translate_write',
  skill: 'translation',
  prompt: '',
  payload: { type: 'translate_write', source: 'x' },
  answer: 'x',
  acceptedAnswers: [],
  explanation: null,
  difficulty: 1,
  recommendedSeconds: 20,
  wordIds: [],
});

const ok = { correct: true as const, typo: false, expected: 'x' };
const bad = { correct: false as const, expected: 'x' };

function run(exercises: Exercise[], verdicts: (typeof ok | typeof bad)[]) {
  let state = createPlayer(exercises);
  for (const verdict of verdicts) {
    state = playerReducer(state, { type: 'answer', verdict, answer: 'a', responseMs: 1000 });
    state = playerReducer(state, { type: 'continue' });
  }
  return state;
}

describe('playerReducer', () => {
  it('recorre todos los ejercicios y termina', () => {
    const state = run([ex('a'), ex('b')], [ok, ok]);
    expect(state.phase).toBe('finished');
    expect(sessionStats(state)).toMatchObject({ total: 2, firstTryCorrect: 2, accuracy: 1 });
  });

  it('reencola los errores al final y mide la precisión sobre el primer intento', () => {
    let state = createPlayer([ex('a'), ex('b')]);
    state = playerReducer(state, { type: 'answer', verdict: bad, answer: 'z', responseMs: 500 });
    state = playerReducer(state, { type: 'continue' });
    expect(state.queue).toEqual(['b', 'a']);
    state = run([ex('a'), ex('b')], [bad, ok, ok]);
    expect(state.phase).toBe('finished');
    expect(state.attempts.map((a) => [a.exerciseId, a.firstTry, a.correct])).toEqual([
      ['a', true, false],
      ['b', true, true],
      ['a', false, true],
    ]);
    expect(sessionStats(state)).toMatchObject({ total: 2, firstTryCorrect: 1, accuracy: 0.5 });
    expect(sessionStats(state).mistakes.map((m) => m.id)).toEqual(['a']);
  });

  it('limita los reintentos para que la sesión siempre termine', () => {
    const state = run(
      [ex('a')],
      Array.from({ length: MAX_RETRIES + 1 }, () => bad),
    );
    expect(state.phase).toBe('finished');
    expect(state.attempts).toHaveLength(MAX_RETRIES + 1);
  });

  it('ignora acciones fuera de fase', () => {
    const state = createPlayer([ex('a')]);
    expect(playerReducer(state, { type: 'continue' })).toBe(state);
    const answered = playerReducer(state, {
      type: 'answer',
      verdict: ok,
      answer: 'a',
      responseMs: 1,
    });
    expect(
      playerReducer(answered, { type: 'answer', verdict: ok, answer: 'a', responseMs: 1 }),
    ).toBe(answered);
  });

  it('informa progreso y ejercicio actual', () => {
    let state = createPlayer([ex('a'), ex('b')]);
    expect(progress(state)).toBe(0);
    expect(currentExercise(state)?.id).toBe('a');
    state = run([ex('a'), ex('b')], [ok]);
    expect(progress(state)).toBe(0.5);
    expect(currentExercise(state)?.id).toBe('b');
  });
});

describe('random', () => {
  it('mezcla de forma determinista', () => {
    expect(shuffle([1, 2, 3, 4, 5], 'seed')).toEqual(shuffle([1, 2, 3, 4, 5], 'seed'));
    expect(shuffle([1, 2, 3, 4, 5], 'seed').sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('shuffleDifferent nunca devuelve el orden original', () => {
    for (let i = 0; i < 50; i++) {
      expect(shuffleDifferent(['The', 'chair', 'is'], `s${i}`)).not.toEqual(['The', 'chair', 'is']);
    }
  });
});

describe('withStatus (desbloqueo)', () => {
  const units = [
    {
      id: 'u1',
      level: 'A1',
      position: 1,
      title: '',
      titleEn: '',
      description: '',
      emoji: '',
      lessons: [
        { id: 'l1', unitId: 'u1', position: 1, title: '', objective: '', exerciseCount: 5 },
        { id: 'l2', unitId: 'u1', position: 2, title: '', objective: '', exerciseCount: 5 },
      ],
    },
    {
      id: 'u2',
      level: 'A1',
      position: 2,
      title: '',
      titleEn: '',
      description: '',
      emoji: '',
      lessons: [
        { id: 'l3', unitId: 'u2', position: 1, title: '', objective: '', exerciseCount: 5 },
      ],
    },
  ];
  const a2 = {
    id: 'a2u1',
    level: 'A2',
    position: 1,
    title: '',
    titleEn: '',
    description: '',
    emoji: '',
    lessons: [
      { id: 'm1', unitId: 'a2u1', position: 1, title: '', objective: '', exerciseCount: 5 },
      { id: 'm2', unitId: 'a2u1', position: 2, title: '', objective: '', exerciseCount: 5 },
    ],
  };

  it('la primera lección está disponible y el resto bloqueado', () => {
    const { units: result, currentByLevel } = withStatus(units, []);
    expect(result.flatMap((u) => u.lessons.map((l) => l.status))).toEqual([
      'current',
      'locked',
      'locked',
    ]);
    expect(currentByLevel.A1?.id).toBe('l1');
  });

  it('completar desbloquea la siguiente, incluso en otra unidad', () => {
    const { units: result, currentByLevel } = withStatus(units, [
      { lessonId: 'l1', timesCompleted: 1, bestAccuracy: 0.8 },
      { lessonId: 'l2', timesCompleted: 2, bestAccuracy: 1 },
    ]);
    expect(result.flatMap((u) => u.lessons.map((l) => l.status))).toEqual([
      'completed',
      'completed',
      'current',
    ]);
    expect(result[0]?.completedCount).toBe(2);
    expect(currentByLevel.A1?.id).toBe('l3');
  });

  it('cada nivel tiene su propio orden y arranca desbloqueado (como el servidor)', () => {
    const { units: result, currentByLevel } = withStatus(
      [a2, ...units],
      [{ lessonId: 'm1', timesCompleted: 1, bestAccuracy: 1 }],
    );
    expect(result.map((u) => u.id)).toEqual(['u1', 'u2', 'a2u1']);
    expect(result.flatMap((u) => u.lessons.map((l) => l.status))).toEqual([
      'current',
      'locked',
      'locked',
      'completed',
      'current',
    ]);
    expect(currentByLevel).toMatchObject({ A1: { id: 'l1' }, A2: { id: 'm2' } });
  });
});

describe('buildReviewExercises', () => {
  const word = (id: string, text: string, translation: string): WordRow => ({
    id,
    text,
    translation_es: translation,
    language_code: 'en',
    unit_id: 'u',
    accepted_translations: [],
    ipa: null,
    emoji: null,
    example_en: null,
    example_es: null,
    difficulty: 1,
    tags: [],
    is_published: true,
    review_status: 'draft',
    reviewed_by: null,
    reviewed_at: null,
    created_at: '',
    updated_at: '',
  });
  const pool = [
    word('en-a', 'apple', 'manzana'),
    word('en-b', 'bread', 'pan'),
    word('en-c', 'cat', 'gato'),
    word('en-d', 'dog', 'perro'),
    word('en-e', 'egg', 'huevo'),
  ];

  it('rota tipos, incluye la respuesta y no repite opciones', () => {
    const exercises = buildReviewExercises(pool.slice(0, 3), pool, 's');
    expect(exercises.map((e) => e.type)).toEqual([
      'translation_choice',
      'listen_choice',
      'translate_write',
    ]);
    for (const e of exercises) {
      expect(e.wordIds).toHaveLength(1);
      if ('options' in e.payload) {
        expect(e.payload.options).toContain(e.answer);
        expect(new Set(e.payload.options).size).toBe(4);
      }
    }
  });

  it('si no hay suficientes distractores usa escritura', () => {
    const [first] = buildReviewExercises([pool[0]!], pool.slice(0, 2), 's');
    expect(first?.type).toBe('translate_write');
  });
});

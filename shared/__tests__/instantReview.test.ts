import type { UserAnswer } from '../exercises';
import { gradingSpecFor } from '../grading';
import {
  gradeReviewAnswer,
  gradeWithKey,
  reviewGradingKey,
  withGradingKeys,
  type PresentationSnapshot,
} from '../learningSession';

/**
 * Corrección instantánea de los repasos: la clave que manda start_review corrige exactamente como el
 * servidor (answer_review), porque las dos usan la misma regla.
 */

const review = (p: Omit<PresentationSnapshot, 'exercise_id'>): PresentationSnapshot => ({
  ...p,
  exercise_id: null,
});

const choice = review({
  presentation_id: 1,
  item_id: 'it-1',
  item_version_id: 10,
  grading_spec: { mode: 'exact_option', mode_version: 1 },
  grading_mode_id: 'exact_option.v1',
  answer: 'hola',
  accepted_answers: [],
  payload: { type: 'translation_choice', word: 'hello' },
  option_set_id: 5,
  option_order: [2, 0, 1],
  option_texts: ['hola', 'chau', 'sí'],
  explanation_es: 'Hello = hola.',
});
const write = review({
  presentation_id: 2,
  item_id: 'it-2',
  item_version_id: 11,
  grading_spec: gradingSpecFor('translate_write'),
  grading_mode_id: 'normalized_text.v1',
  answer: "I'm from Argentina",
  accepted_answers: ['I am from Argentina'],
  payload: { type: 'translate_write', source: 'Soy de Argentina' },
  option_set_id: null,
  option_order: null,
  option_texts: null,
});
const order = review({
  ...write,
  presentation_id: 3,
  item_id: 'it-3',
  grading_spec: gradingSpecFor('order_words'),
  answer: 'I am happy.',
  accepted_answers: [],
  payload: { type: 'order_words', tokens: ['I', 'am', 'happy'], translation: 'Estoy feliz.' },
});
const pairs = review({
  ...write,
  presentation_id: 4,
  item_id: 'it-4',
  grading_spec: { mode: 'pair_set', mode_version: 1 },
  grading_mode_id: 'pair_set.v1',
  answer: '',
  accepted_answers: [],
  payload: {
    type: 'match_pairs',
    pairs: [
      { left: 'cat', right: 'gato' },
      { left: 'dog', right: 'perro' },
    ],
  },
});
const ALL = [choice, write, order, pairs];
const WORDS = { 'it-1': 'w1', 'it-2': 'w2', 'it-3': 'w3', 'it-4': 'w4' };

const ANSWERS: [PresentationSnapshot, UserAnswer][] = [
  [choice, { kind: 'option', value: 'hola' }],
  [choice, { kind: 'option', value: 'chau' }],
  [choice, { kind: 'option', value: 'no estaba' }],
  [choice, { kind: 'text', value: 'hola' }],
  [write, { kind: 'text', value: "I'm from Argentina" }],
  [write, { kind: 'text', value: 'i am from argentina' }],
  [write, { kind: 'text', value: "I'm from Argentin" }],
  [write, { kind: 'text', value: 'I live in Spain' }],
  [write, { kind: 'option', value: 'x' }],
  [order, { kind: 'tokens', value: ['I', 'am', 'happy'] }],
  [order, { kind: 'tokens', value: ['am', 'I', 'happy'] }],
  [order, { kind: 'tokens', value: ['I', 'am', 'sad'] }],
  [
    pairs,
    {
      kind: 'pairs',
      value: [
        { left: 'cat', right: 'gato' },
        { left: 'dog', right: 'perro' },
      ],
    },
  ],
  [
    pairs,
    {
      kind: 'pairs',
      value: [
        { left: 'cat', right: 'perro' },
        { left: 'dog', right: 'gato' },
      ],
    },
  ],
];

describe('gradeWithKey (corrección instantánea)', () => {
  it.each(ANSWERS.map(([p, a]) => [p.presentation_id, a, p] as const))(
    'presentación %s, %j: el mismo veredicto que answer_review',
    (_id, answer, p) => {
      const server = gradeReviewAnswer(
        ALL,
        { presentation_id: p.presentation_id, answer, response_ms: 500 },
        WORDS,
      ).grading;
      expect(gradeWithKey(reviewGradingKey(p), answer)).toEqual({
        status: server.status,
        verdict: server.verdict,
      });
    },
  );

  it('una clave con un grading_spec desconocido no corrige: la app espera al servidor', () => {
    const key = {
      ...reviewGradingKey(choice),
      grading_spec: { mode: 'otro', mode_version: 9 },
    } as unknown as ReturnType<typeof reviewGradingKey>;
    expect(gradeWithKey(key, { kind: 'option', value: 'hola' })).toBeNull();
  });
});

describe('withGradingKeys (start_review)', () => {
  it('agrega a cada ítem la clave de su presentación, con la explicación', () => {
    const items = [
      { presentation_id: 1, prompt: 'a' },
      { presentation_id: 2, prompt: 'b' },
    ];
    const out = withGradingKeys(items, ALL);
    expect(out[0]).toEqual({
      presentation_id: 1,
      prompt: 'a',
      grading_key: {
        grading_spec: choice.grading_spec,
        answer: 'hola',
        accepted_answers: [],
        payload: choice.payload,
        option_texts: ['hola', 'chau', 'sí'],
        option_order: [2, 0, 1],
        explanation: 'Hello = hola.',
      },
    });
    expect(out[1]!.grading_key).toMatchObject({
      answer: "I'm from Argentina",
      accepted_answers: ['I am from Argentina'],
      explanation: null,
    });
  });

  it('sin presentación de repaso (o de una lección) el ítem queda sin clave', () => {
    const lesson = { ...choice, presentation_id: 9, exercise_id: 'a1-x-e1' };
    const out = withGradingKeys(
      [{ presentation_id: 9 }, { presentation_id: 77 }],
      [...ALL, lesson],
    );
    expect(out.map((i) => i.grading_key)).toEqual([null, null]);
  });
});

import { checkAnswer, TEXT_RULES } from '../answers';
import type { Exercise, UserAnswer } from '../exercises';
import { gradingSpecFor } from '../grading';
import {
  gradeReviewAnswer,
  gradeWithKey,
  LEARNING_GRADER,
  reviewGradingKey,
  TEXT_RULES_BY_GRADER,
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
        grader_version: '1.0.0',
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

describe('versión del corrector (apóstrofos)', () => {
  // Producción (corrector 1.0.0) acepta como error de tipeo una diferencia sólo de apóstrofos; la app
  // (TEXT_RULES, Aprender) no. La clave lleva la versión y la app corrige el repaso con SUS reglas.
  const wasnt = review({
    ...write,
    presentation_id: 7,
    item_id: 'it-7',
    answer: "It is three o'clock.",
    accepted_answers: [],
    payload: { type: 'translate_write', source: 'Son las tres.' },
  });
  const lesson: Exercise = {
    id: 'x',
    lessonId: 'l',
    position: 1,
    type: 'translate_write',
    skill: 'translation',
    prompt: '',
    payload: { type: 'translate_write', source: 'Son las tres.' },
    answer: "It is three o'clock.",
    acceptedAnswers: [],
    explanation: null,
    difficulty: 1,
    recommendedSeconds: 20,
    wordIds: [],
  };
  const CASES: UserAnswer[] = [
    { kind: 'text', value: 'It is three oclock' },
    { kind: 'text', value: "It is three o'clock" },
    { kind: 'text', value: 'It is three o´clock' },
    { kind: 'text', value: "It is thre o'clock" },
    { kind: 'text', value: 'It is three' },
    // Contracción: «wasnt» no es «wasn't» (se expande a «was not»), con cualquier versión.
    { kind: 'text', value: 'It isnt three oclock' },
  ];

  it('el servidor corrige con las reglas de LEARNING_GRADER, no con las de la app', () => {
    expect(LEARNING_GRADER.grader_version).toBe('1.0.0');
    expect(TEXT_RULES_BY_GRADER['1.0.0']).toEqual({ apostropheTypo: true });
    expect(TEXT_RULES).toEqual({ apostropheTypo: false });
    const server = gradeReviewAnswer(
      [wasnt],
      { presentation_id: 7, answer: CASES[0], response_ms: 1 },
      { 'it-7': 'w7' },
    ).grading;
    expect(server.verdict).toBe('typo');
    // La regla de la app (Aprender) es otra: por eso la clave lleva la versión.
    expect(checkAnswer(lesson, CASES[0]!).correct).toBe(false);
  });

  it.each(CASES.map((c) => [c.value, c] as const))(
    '«%s»: la app con la clave da lo mismo que el servidor',
    (_v, answer) => {
      const server = gradeReviewAnswer(
        [wasnt],
        { presentation_id: 7, answer, response_ms: 1 },
        { 'it-7': 'w7' },
      ).grading;
      expect(gradeWithKey(reviewGradingKey(wasnt), answer)).toEqual({
        status: server.status,
        verdict: server.verdict,
      });
    },
  );

  it('una versión del corrector que la app no conoce (o ninguna): espera al servidor', () => {
    const key = reviewGradingKey(wasnt);
    expect(gradeWithKey({ ...key, grader_version: '9.9.9' }, CASES[0]!)).toBeNull();
    expect(gradeWithKey({ ...key, grader_version: 'toString' }, CASES[0]!)).toBeNull();
    expect(
      gradeWithKey({ ...key, grader_version: undefined as unknown as string }, CASES[0]!),
    ).toBeNull();
  });
});

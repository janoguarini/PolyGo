import { checkAnswer } from '../answers';
import type { Exercise, UserAnswer } from '../exercises';
import { gradingSpecFor } from '../grading';
import {
  gradeLessonAttempts,
  gradeRecordedAttempts,
  LEARNING_CONTRACT,
  parseClientInfo,
  LearningSessionError,
  parseUserAnswer,
  presentationOrders,
  type PresentationSnapshot,
} from '../learningSession';
import { choiceSeed, shuffleOrderV1 } from '../shuffle';

const choice: PresentationSnapshot = {
  presentation_id: 1,
  exercise_id: 'a1-x-e1',
  item_id: 'a1-x-e1',
  item_version_id: 10,
  grading_spec: { mode: 'exact_option', mode_version: 1 },
  grading_mode_id: 'exact_option.v1',
  answer: 'hola',
  accepted_answers: [],
  payload: { type: 'translation_choice', word: 'hello' },
  option_set_id: 5,
  option_order: [2, 0, 1],
  option_texts: ['hola', 'chau', 'sí'],
};
const write: PresentationSnapshot = {
  presentation_id: 2,
  exercise_id: 'a1-x-e2',
  item_id: 'a1-x-e2',
  item_version_id: 11,
  grading_spec: gradingSpecFor('translate_write'),
  grading_mode_id: 'normalized_text.v1',
  answer: "I'm from Argentina",
  accepted_answers: [],
  payload: { type: 'translate_write', source: 'Soy de Argentina' },
  option_set_id: null,
  option_order: null,
  option_texts: null,
};
const order: PresentationSnapshot = {
  ...write,
  presentation_id: 3,
  exercise_id: 'a1-x-e3',
  item_id: 'a1-x-e3',
  grading_spec: gradingSpecFor('order_words'),
  answer: 'I am happy.',
  payload: { type: 'order_words', tokens: ['I', 'am', 'happy'], translation: 'Estoy feliz.' },
};
const pairs: PresentationSnapshot = {
  ...write,
  presentation_id: 4,
  exercise_id: 'a1-x-e4',
  item_id: 'a1-x-e4',
  grading_spec: { mode: 'pair_set', mode_version: 1 },
  grading_mode_id: 'pair_set.v1',
  answer: '',
  payload: {
    type: 'match_pairs',
    pairs: [
      { left: 'cat', right: 'gato' },
      { left: 'dog', right: 'perro' },
    ],
  },
};
const ALL = [choice, write, order, pairs];
const at = (p: PresentationSnapshot, answer: UserAnswer, extra: Record<string, unknown> = {}) => ({
  presentation_id: p.presentation_id,
  answer,
  response_ms: 1234.6,
  ...extra,
});

function codeOf(fn: () => unknown): string | null {
  try {
    fn();
  } catch (e) {
    return e instanceof LearningSessionError ? e.code : String(e);
  }
  return null;
}

describe('gradeLessonAttempts', () => {
  it('corrige con la versión presentada y arma las filas de submit_learning_session', () => {
    const r = gradeLessonAttempts(ALL, [
      at(choice, { kind: 'option', value: 'hola' }, { client_verdict: 'correct' }),
      at(write, { kind: 'text', value: 'i am from argentina' }),
      at(order, { kind: 'tokens', value: ['I', 'am', 'happy'] }),
      at(pairs, {
        kind: 'pairs',
        value: [
          { left: 'dog', right: 'perro' },
          { left: 'cat', right: 'gato' },
        ],
      }),
    ]);
    expect(r.gradings.map((g) => [g.status, g.verdict, g.attempt_no])).toEqual([
      ['valid', 'correct', 1],
      ['valid', 'correct', 1],
      ['valid', 'correct', 1],
      ['valid', 'correct', 1],
    ]);
    expect(r.gradings[0]!.selected_option).toBe(0);
    expect(r.attempts[0]).toEqual({
      exercise_id: 'a1-x-e1',
      answer: 'hola',
      correct: true,
      first_try: true,
      response_ms: 1235,
    });
    expect(r.attempts[3]!.answer).toBe('dog=perro|cat=gato');
  });

  it('mismo veredicto que checkAnswer (contrato polygo.answers.v1), incluido el tipeo', () => {
    const cases: [PresentationSnapshot, UserAnswer][] = [
      [write, { kind: 'text', value: "I'm from Argentinq" }],
      [write, { kind: 'text', value: 'I from Argentina' }],
      [order, { kind: 'tokens', value: ['am', 'I', 'happy'] }],
    ];
    for (const [p, answer] of cases) {
      const ex = {
        id: p.exercise_id,
        type: (p.payload as { type: Exercise['type'] }).type,
        payload: p.payload,
        answer: p.answer,
        acceptedAnswers: [],
      } as unknown as Exercise;
      const local = checkAnswer(ex, answer);
      const [g] = gradeLessonAttempts([p], [at(p, answer)]).gradings;
      expect(g!.verdict).toBe(local.correct ? (local.typo ? 'typo' : 'correct') : 'incorrect');
    }
    expect(gradeLessonAttempts([write], [at(write, cases[0]![1])]).gradings[0]!.verdict).toBe(
      'typo',
    );
  });

  it('el veredicto del cliente no decide', () => {
    const r = gradeLessonAttempts(
      [choice],
      [at(choice, { kind: 'option', value: 'chau' }, { client_verdict: 'correct' })],
    );
    expect(r.gradings[0]).toMatchObject({ verdict: 'incorrect', client_verdict: 'correct' });
    expect(r.attempts[0]!.correct).toBe(false);
  });

  it('respuestas que la presentación no pudo producir son invalid_response', () => {
    const r = gradeLessonAttempts(ALL, [
      at(choice, { kind: 'option', value: 'inventada' }),
      at(write, { kind: 'option', value: 'x' }),
      at(order, { kind: 'tokens', value: ['I', 'am', 'sad'] }),
      at(pairs, {
        kind: 'pairs',
        value: [
          { left: 'cat', right: 'gato' },
          { left: 'cat', right: 'perro' },
        ],
      }),
    ]);
    expect(r.gradings.map((g) => [g.status, g.verdict, g.selected_option])).toEqual([
      ['invalid_response', null, null],
      ['invalid_response', null, null],
      ['invalid_response', null, null],
      ['invalid_response', null, null],
    ]);
    expect(r.attempts.every((a) => !a.correct)).toBe(true);
  });

  it('número de intento, máximo de reintentos y nada después de acertar', () => {
    const wrong = at(choice, { kind: 'option', value: 'chau' });
    const right = at(choice, { kind: 'option', value: 'hola' });
    const r = gradeLessonAttempts([choice], [wrong, wrong, right]);
    expect(r.gradings.map((g) => g.attempt_no)).toEqual([1, 2, 3]);
    expect(r.attempts.map((a) => a.first_try)).toEqual([true, false, false]);
    expect(codeOf(() => gradeLessonAttempts([choice], [wrong, wrong, wrong, wrong]))).toBe(
      'invalid_sequence',
    );
    expect(codeOf(() => gradeLessonAttempts([choice], [right, wrong]))).toBe('invalid_sequence');
    expect(codeOf(() => gradeLessonAttempts([choice], [{ ...right, presentation_id: 99 }]))).toBe(
      'presentation_not_found',
    );
    expect(codeOf(() => gradeLessonAttempts([choice], []))).toBe('invalid_attempts');
    expect(codeOf(() => gradeLessonAttempts([choice], [{ ...right, assists: { x: -1 } }]))).toBe(
      'invalid_assists',
    );
    expect(codeOf(() => gradeLessonAttempts([choice], [{ ...right, client_verdict: 'meh' }]))).toBe(
      'invalid_client_verdict',
    );
  });

  it('valida la forma de las respuestas', () => {
    expect(codeOf(() => parseUserAnswer({ kind: 'option', value: 3 }))).toBe('invalid_answer');
    expect(codeOf(() => parseUserAnswer({ kind: 'text', value: 'x'.repeat(501) }))).toBe(
      'invalid_answer',
    );
    expect(codeOf(() => parseUserAnswer({ kind: 'pairs', value: [{ left: 'a' }] }))).toBe(
      'invalid_answer',
    );
    expect(codeOf(() => parseUserAnswer(null))).toBe('invalid_answer');
    expect(parseUserAnswer({ kind: 'tokens', value: ['a', 'b'], extra: 1 })).toEqual({
      kind: 'tokens',
      value: ['a', 'b'],
    });
  });
});

describe('presentationOrders', () => {
  it('polygo.shuffle.v1 con la semilla <sesión>:<ejercicio>, sólo para los de elección', () => {
    const orders = presentationOrders('s-1', [
      { exercise_id: 'e1', option_set_id: 3, option_count: 4 },
      { exercise_id: 'e2', option_set_id: null, option_count: null },
    ]);
    expect(orders).toEqual({ e1: shuffleOrderV1(4, choiceSeed('s-1', 'e1')) });
    expect(
      codeOf(() =>
        presentationOrders('s', [{ exercise_id: 'e', option_set_id: 1, option_count: null }]),
      ),
    ).toBe('invalid_plan');
  });
});

describe('fase 5: gradeRecordedAttempts y contrato de cliente', () => {
  const review = (p: PresentationSnapshot): PresentationSnapshot => ({ ...p, exercise_id: null });
  const snaps = [review(choice), review(write), review(order)];
  const plan = Object.fromEntries(snaps.map((s) => [s.item_id, `concept.${s.item_id}`]));
  const ok = [
    { presentation_id: 1, answer: { kind: 'option', value: 'hola' }, response_ms: 1200 },
    {
      presentation_id: 2,
      answer: { kind: 'text', value: 'nope' },
      response_ms: 999999,
      client_verdict: 'correct',
    },
  ];

  test('corrige en el servidor y agrega lo que guarda exercise_attempts', () => {
    const g = gradeRecordedAttempts(snaps, ok, plan);
    expect(g.map((x) => [x.presentation_id, x.attempt_no, x.status, x.verdict])).toEqual([
      [1, 1, 'valid', 'correct'],
      [2, 1, 'valid', 'incorrect'],
    ]);
    expect(g[0]).toMatchObject({ response_ms: 1200, answer_text: 'hola', selected_option: 0 });
    expect(g[1]).toMatchObject({ response_ms: 600000, client_verdict: 'correct' });
  });

  test('rechaza duplicados, presentaciones fuera del plan, de lección o de más', () => {
    expect(codeOf(() => gradeRecordedAttempts(snaps, [ok[0], ok[0]], plan))).toBe(
      'invalid_sequence',
    );
    expect(codeOf(() => gradeRecordedAttempts(snaps, [ok[0]], {}))).toBe('presentation_not_found');
    expect(codeOf(() => gradeRecordedAttempts([choice], [ok[0]], plan))).toBe(
      'presentation_not_found',
    );
    expect(codeOf(() => gradeRecordedAttempts(snaps, [], plan))).toBe('invalid_attempts');
    expect(codeOf(() => gradeRecordedAttempts([snaps[0]!], ok, plan))).toBe('invalid_attempts');
  });

  test('parseClientInfo: sin campo o mal formado = contrato 1', () => {
    expect(LEARNING_CONTRACT).toBe(2);
    expect(parseClientInfo(undefined)).toEqual({ contract: 1, app_version: null, platform: null });
    expect(parseClientInfo({ contract: 2, app_version: '0.2.0', platform: 'ios' })).toEqual({
      contract: 2,
      app_version: '0.2.0',
      platform: 'ios',
    });
    expect(parseClientInfo({ contract: '2', app_version: 'x y', platform: 'windows' })).toEqual({
      contract: 1,
      app_version: null,
      platform: null,
    });
  });
});

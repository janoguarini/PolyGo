import { canonicalForm, checkAnswer, verdictForText } from '../answers';
import { EXERCISE_TYPES, answerKindFor, type Exercise, type ExercisePayload } from '../exercises';
import {
  GRADING_MODES,
  gradeWithSpec,
  gradingSpecFor,
  gradingSpecProblems,
  InvalidResponseError,
  NORMALIZER_V1,
  schemaProblems,
  type GradingSpec,
} from '../grading';

/**
 * grading_spec (decisiones V1, V2 y V7, docs/EXERCISE_ITEM_VERSIONS_PENDING.md). La equivalencia con
 * checkAnswer sobre todas las versiones del currículo está en content/__tests__/versions.test.ts.
 */

function exercise(
  payload: ExercisePayload,
  answer: string,
  acceptedAnswers: string[] = [],
): Exercise {
  return {
    id: 'x',
    lessonId: 'l',
    position: 1,
    type: payload.type,
    skill: 'translation',
    prompt: '',
    payload,
    answer,
    acceptedAnswers,
    explanation: null,
    difficulty: 1,
    recommendedSeconds: 20,
    wordIds: [],
  };
}

const grade = (e: Exercise, a: Parameters<typeof checkAnswer>[1]) =>
  gradeWithSpec(
    gradingSpecFor(e.type),
    { answer: e.answer, accepted_answers: e.acceptedAnswers, payload: e.payload },
    a,
  );

describe('esquemas de los modos (V7)', () => {
  it('tres modos v1 con id <modo>.v<versión>', () => {
    expect(GRADING_MODES.map((m) => m.id)).toEqual([
      'exact_option.v1',
      'normalized_text.v1',
      'pair_set.v1',
    ]);
    for (const m of GRADING_MODES) expect(m.id).toBe(`${m.mode}.v${m.version}`);
  });

  it('el spec de cada tipo valida contra el esquema de su modo', () => {
    for (const type of EXERCISE_TYPES)
      expect(gradingSpecProblems(gradingSpecFor(type))).toEqual([]);
  });

  it('rechaza claves de más, claves que faltan, valores fuera del esquema y modos desconocidos', () => {
    const ok = gradingSpecFor('translate_write');
    expect(gradingSpecProblems({ ...ok, accepted: ['x'] })).toEqual(['$.accepted: no permitido']);
    const { typo_tolerance: _, ...missing } = ok as Extract<
      GradingSpec,
      { mode: 'normalized_text' }
    >;
    expect(gradingSpecProblems(missing)).toEqual(['$.typo_tolerance: falta']);
    expect(gradingSpecProblems({ ...ok, normalizer: 'polygo.answers.v2' })).toEqual([
      '$.normalizer: debe ser "polygo.answers.v1"',
    ]);
    expect(gradingSpecProblems({ ...ok, typo_tolerance: 1 })).toEqual([
      '$.typo_tolerance: debe ser booleano',
    ]);
    expect(gradingSpecProblems({ mode: 'normalized_set', mode_version: 1 })[0]).toMatch(
      /desconocido/,
    );
    expect(gradingSpecProblems({ mode: 'exact_option', mode_version: 2 })[0]).toMatch(
      /desconocido/,
    );
    expect(gradingSpecProblems(null)[0]).toMatch(/desconocido/);
    expect(schemaProblems({ type: 'object' }, [])).toEqual(['$: debe ser un objeto']);
  });
});

describe('grading_spec de cada tipo (V1)', () => {
  it('opciones → exact_option; fichas y ortografía → normalized_text sin tipeo; escritura → con tipeo; parejas → pair_set', () => {
    const table = Object.fromEntries(EXERCISE_TYPES.map((t) => [t, gradingSpecFor(t)]));
    expect(table).toEqual({
      image_choice: { mode: 'exact_option', mode_version: 1 },
      translation_choice: { mode: 'exact_option', mode_version: 1 },
      fill_blank: { mode: 'exact_option', mode_version: 1 },
      listen_choice: { mode: 'exact_option', mode_version: 1 },
      context_choice: { mode: 'exact_option', mode_version: 1 },
      order_words: {
        mode: 'normalized_text',
        mode_version: 1,
        normalizer: NORMALIZER_V1,
        typo_tolerance: false,
      },
      complete_word: {
        mode: 'normalized_text',
        mode_version: 1,
        normalizer: NORMALIZER_V1,
        typo_tolerance: false,
      },
      translate_write: {
        mode: 'normalized_text',
        mode_version: 1,
        normalizer: NORMALIZER_V1,
        typo_tolerance: true,
      },
      short_answer: {
        mode: 'normalized_text',
        mode_version: 1,
        normalizer: NORMALIZER_V1,
        typo_tolerance: true,
      },
      match_pairs: { mode: 'pair_set', mode_version: 1 },
    });
  });

  it('no duplica answer, accepted_answers ni el payload', () => {
    for (const type of EXERCISE_TYPES) {
      const keys = Object.keys(gradingSpecFor(type));
      for (const k of ['answer', 'accepted', 'accepted_answers', 'pairs', 'options', 'tokens']) {
        expect(keys).not.toContain(k);
      }
    }
  });

  it('free_production queda bloqueado hasta las rúbricas', () => {
    expect(() => gradingSpecFor('short_answer', 'free_production')).toThrow(/rúbricas/);
  });
});

describe('gradeWithSpec = checkAnswer', () => {
  const cases: [Exercise, Parameters<typeof checkAnswer>[1][]][] = [
    [
      exercise({ type: 'translation_choice', word: 'chair', options: ['silla', 'mesa'] }, 'silla'),
      [
        { kind: 'option', value: 'silla' },
        { kind: 'option', value: 'Silla' },
        { kind: 'option', value: 'mesa' },
      ],
    ],
    [
      exercise({ type: 'translate_write', source: 'Soy de Argentina.' }, "I'm from Argentina", [
        'I am from Argentina',
      ]),
      [
        { kind: 'text', value: 'i am from argentina.' },
        { kind: 'text', value: "I'm from Argentin" },
        { kind: 'text', value: 'I from Argentina' },
        { kind: 'text', value: '' },
      ],
    ],
    [
      exercise({ type: 'complete_word', masked: 'b_a_t_f_l', hint: 'hermoso' }, 'beautiful'),
      [
        { kind: 'text', value: 'beautiful' },
        { kind: 'text', value: 'beautifull' },
      ],
    ],
    [
      exercise(
        { type: 'order_words', tokens: ['is', 'big', 'The', 'chair'], translation: '' },
        'The chair is big',
      ),
      [
        { kind: 'tokens', value: ['The', 'chair', 'is', 'big'] },
        { kind: 'tokens', value: ['The', 'chair', 'big', 'is'] },
        { kind: 'tokens', value: ['the', 'chair', 'is', 'bi'] },
      ],
    ],
    [
      exercise({ type: 'short_answer', question: '你叫什么名字?', translation: '' }, '我叫王明', [
        'wo3 jiao4 wang2 ming2',
      ]),
      [
        { kind: 'text', value: '我 叫 王明。' },
        { kind: 'text', value: 'wǒ jiào wáng míng' },
        { kind: 'text', value: 'wo jiao wang ming' },
      ],
    ],
    [
      exercise(
        {
          type: 'match_pairs',
          pairs: [
            { left: 'a', right: '1' },
            { left: 'b', right: '2' },
          ],
        },
        '',
      ),
      [
        {
          kind: 'pairs',
          value: [
            { left: 'b', right: '2' },
            { left: 'a', right: '1' },
          ],
        },
        {
          kind: 'pairs',
          value: [
            { left: 'a', right: '2' },
            { left: 'b', right: '1' },
          ],
        },
        { kind: 'pairs', value: [{ left: 'a', right: '1' }] },
      ],
    ],
  ];

  it.each(cases.map(([e, answers]) => [e.type, e, answers] as const))('%s', (_, e, answers) => {
    for (const a of answers) expect(grade(e, a)).toEqual(checkAnswer(e, a));
  });

  it('una respuesta de otro tipo se rechaza antes de corregir (§9: invalid_response)', () => {
    for (const type of EXERCISE_TYPES) {
      const spec = gradingSpecFor(type);
      const content = { answer: 'x', accepted_answers: [], payload: { type } };
      for (const kind of ['option', 'text', 'tokens', 'pairs'] as const) {
        const a =
          kind === 'tokens' || kind === 'pairs'
            ? ({ kind, value: [] } as never)
            : { kind, value: 'x' };
        const accepts =
          kind === answerKindFor(type) ||
          (spec.mode === 'normalized_text' && kind !== 'option' && kind !== 'pairs');
        if (accepts) expect(() => gradeWithSpec(spec, content, a)).not.toThrow();
        else expect(() => gradeWithSpec(spec, content, a)).toThrow(InvalidResponseError);
      }
    }
  });

  it('un spec inválido no corrige', () => {
    expect(() =>
      gradeWithSpec(
        { mode: 'pair_set', mode_version: 1, extra: 1 } as never,
        { answer: '', accepted_answers: [], payload: null },
        { kind: 'pairs', value: [] },
      ),
    ).toThrow(/grading_spec inválido/);
  });
});

/**
 * polygo.answers.v1 congelado (V2): estas salidas son el comportamiento de shared/answers.ts al
 * 2026-11-08. Si una cambia, el cambio de comportamiento necesita un normalizador nuevo
 * (polygo.answers.v2, un esquema nuevo de normalized_text y pruebas de compatibilidad); no se edita
 * esta tabla para que pase.
 */
describe('polygo.answers.v1 congelado', () => {
  const cp = (...points: number[]) => String.fromCodePoint(...points);
  it.each([
    ['  I’M  fine, THANKS!  ', 'i am fine thanks'],
    ['¿Dónde está?', 'dónde está'],
    ['Adios', 'adios'],
    ["they've gone.", 'they have gone'],
    ["y'all", "y'all"],
    ['我 叫 王明。', '我叫王明'],
    ['你好，世界！', '你好世界'],
    ['ni3 hao3', 'nǐ hǎo'],
    ['lv4', 'lǜ'],
    ['ma5', 'ma'],
    ['Ni3hao3', 'nǐhǎo'],
    ['nü3', 'nǚ'],
    ['nv3', 'nǚ'],
    ["won't", 'will not'],
    ["Who's there?", 'who is there'],
    ["It's 5 o'clock.", "it is 5 o'clock"],
    ['a,b;c:d', 'a b c d'],
    ['Hello...', 'hello'],
    [cp(0x65, 0x301), cp(0xe9)],
  ])('canonicalForm(%j) = %j', (input, expected) => {
    expect(canonicalForm(input)).toBe(expected);
  });

  it('tipeo: distancia 1 desde 8 caracteres, sólo con typo_tolerance', () => {
    expect(verdictForText('beautifull', ['beautiful'], true)).toEqual({
      correct: true,
      typo: true,
      expected: 'beautiful',
    });
    expect(verdictForText('beautifull', ['beautiful'], false).correct).toBe(false);
    expect(verdictForText('chairs', ['chair'], true).correct).toBe(false);
    expect(verdictForText('chairr x', ['chair x'], true).correct).toBe(false);
    expect(verdictForText('', ['a'], true).correct).toBe(false);
    expect(verdictForText('I am fine', ["I'm fine"], false)).toEqual({
      correct: true,
      typo: false,
      expected: "I'm fine",
    });
  });
});

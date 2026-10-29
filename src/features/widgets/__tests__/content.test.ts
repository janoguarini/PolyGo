import type { WordProgressEntry, WordRow } from '@/features/learning/api';

import {
  EMPTY_WORD_CARD,
  WIDGET_LINKS,
  buildQuiz,
  buildWordTimeline,
  nextHour,
  rankWidgetWords,
  toWordCard,
} from '../content';

const word = (
  id: string,
  text: string,
  translation: string,
  extra: Partial<WordRow> = {},
): WordRow =>
  ({
    id,
    text,
    translation_es: translation,
    ipa: `/${text}/`,
    emoji: null,
    example_en: null,
    is_published: true,
    ...extra,
  }) as WordRow;

const POOL = [
  word('hello', 'hello', 'hola'),
  word('bye', 'goodbye', 'adiós'),
  word('thanks', 'thank you', 'gracias'),
  word('please', 'please', 'por favor'),
  word('yes', 'yes', 'sí'),
  word('water', 'water', 'agua'),
  word('draft', 'draft', 'borrador', { is_published: false }),
];

const entry = (w: WordRow, over: Partial<WordProgressEntry> = {}): WordProgressEntry => ({
  word: w,
  stage: 1,
  seenCount: 1,
  incorrectCount: 0,
  nextReviewAt: null,
  ...over,
});

const NOW = new Date('2026-10-29T10:20:00').getTime();

describe('rankWidgetWords', () => {
  it('palabra del día, luego vencidas y difíciles, luego nuevas publicadas, sin repetir', () => {
    const mine = [
      entry(POOL[1]!, { incorrectCount: 3, nextReviewAt: '2026-11-05T00:00:00Z' }),
      entry(POOL[2]!, { incorrectCount: 0, nextReviewAt: '2026-10-28T00:00:00Z' }),
      entry(POOL[0]!, { incorrectCount: 1 }),
    ];
    const ranked = rankWidgetWords(mine, POOL, POOL[0]!, NOW);
    expect(ranked.map((r) => [r.word.id, r.kind])).toEqual([
      ['hello', 'daily'],
      ['thanks', 'review'],
      ['bye', 'review'],
      ['please', 'new'],
      ['yes', 'new'],
      ['water', 'new'],
    ]);
  });

  it('ignora palabras sin publicar y entradas nunca vistas', () => {
    const ranked = rankWidgetWords([entry(POOL[3]!, { seenCount: 0 })], POOL, null, NOW);
    expect(ranked.map((r) => r.word.id)).not.toContain('draft');
    expect(ranked.find((r) => r.word.id === 'please')).toBeUndefined();
  });
});

describe('buildWordTimeline', () => {
  it('empieza ahora y sigue al comienzo de cada hora, rotando las palabras', () => {
    const ranked = rankWidgetWords([], POOL.slice(0, 2), null, NOW);
    const timeline = buildWordTimeline(ranked, new Date(NOW), 4);
    expect(timeline.map((e) => e.date.getTime())).toEqual([
      NOW,
      new Date('2026-10-29T11:00:00').getTime(),
      new Date('2026-10-29T12:00:00').getTime(),
      new Date('2026-10-29T13:00:00').getTime(),
    ]);
    expect(timeline.map((e) => e.props.text)).toEqual(['hello', 'goodbye', 'hello', 'goodbye']);
  });

  it('sin palabras muestra una tarjeta que invita a abrir la app', () => {
    expect(buildWordTimeline([], new Date(NOW))).toEqual([
      { date: new Date(NOW), props: EMPTY_WORD_CARD },
    ]);
  });

  it('nextHour cruza el día', () => {
    expect(nextHour(new Date('2026-10-29T23:40:00')).getTime()).toBe(
      new Date('2026-10-30T00:00:00').getTime(),
    );
  });
});

describe('toWordCard', () => {
  it('props planas, sin nulls y con deep link', () => {
    const card = toWordCard(POOL[0]!, 'daily');
    expect(card).toEqual({
      kind: 'daily',
      label: 'PALABRA DEL DÍA',
      text: 'hello',
      translation: 'hola',
      ipa: '/hello/',
      emoji: '',
      example: '',
      url: WIDGET_LINKS.word,
    });
    expect(JSON.parse(JSON.stringify(card))).toEqual(card);
  });
});

describe('buildQuiz', () => {
  it('arma una ronda determinista de preguntas válidas', () => {
    const quiz = buildQuiz([], POOL, 'seed-1')!;
    expect(quiz.questions).toHaveLength(10);
    expect(quiz).toMatchObject({ index: 0, chosen: -1, correctCount: 0, url: WIDGET_LINKS.quiz });
    for (const q of quiz.questions) {
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.options).not.toContain('borrador');
    }
    expect(buildQuiz([], POOL, 'seed-1')).toEqual(quiz);
    expect(buildQuiz([], POOL, 'seed-2')).not.toEqual(quiz);
  });

  it('con 8 o más palabras estudiadas sólo pregunta por ellas', () => {
    const extra = Array.from({ length: 8 }, (_, i) => word(`w${i}`, `word${i}`, `palabra${i}`));
    const quiz = buildQuiz(
      extra.map((w) => entry(w)),
      [...POOL, ...extra],
      's',
    )!;
    const studied = new Set(extra.flatMap((w) => [w.text, w.translation_es]));
    for (const q of quiz.questions) expect(studied.has(q.prompt)).toBe(true);
  });

  it('sin palabras suficientes devuelve null', () => {
    expect(buildQuiz([], POOL.slice(0, 2), 's')).toBeNull();
  });
});

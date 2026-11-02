import type { WordProgressEntry, WordRow } from '@/features/learning/api';

import { pickTopicReview, topicSummaries } from '../topicReview';

const NOW = Date.parse('2026-11-01T12:00:00Z');
const H = 3600 * 1000;

const entry = (
  id: string,
  unit: string,
  over: Partial<WordProgressEntry> = {},
): WordProgressEntry => ({
  word: { id, text: id, translation_es: id, unit_id: unit } as WordRow,
  stage: 1,
  seenCount: 2,
  incorrectCount: 0,
  nextReviewAt: new Date(NOW + 48 * H).toISOString(),
  ...over,
});

const UNITS = [
  { id: 'u1', level: 'A1', title: 'Saludos', emoji: '👋' },
  { id: 'u2', level: 'A1', title: 'Comida', emoji: '🍎' },
  { id: 'u3', level: 'A2', title: 'Viajes', emoji: '✈️' },
];

const WORDS = [
  entry('hola', 'u1'),
  entry('chau', 'u1', { incorrectCount: 2 }),
  entry('gracias', 'u1', { nextReviewAt: new Date(NOW - H).toISOString() }),
  entry('nunca', 'u1', { seenCount: 0 }),
  entry('apple', 'u2', { stage: 0 }),
  entry('bread', 'u2'),
];

describe('topicSummaries', () => {
  it('sólo unidades con palabras estudiadas, en orden del currículo, con sus conteos', () => {
    expect(topicSummaries(UNITS, WORDS, NOW)).toEqual([
      { unit: UNITS[0], studied: 3, due: 1, withMistakes: 1 },
      { unit: UNITS[1], studied: 2, due: 0, withMistakes: 0 },
    ]);
  });
});

describe('pickTopicReview', () => {
  it('sólo palabras vistas de la unidad: vencidas, después errores, después etapa baja', () => {
    expect(pickTopicReview(WORDS, 'u1', NOW).map((e) => e.word.id)).toEqual([
      'gracias',
      'chau',
      'hola',
    ]);
    expect(pickTopicReview(WORDS, 'u2', NOW).map((e) => e.word.id)).toEqual(['apple', 'bread']);
    expect(pickTopicReview(WORDS, 'u3', NOW)).toEqual([]);
  });

  it('respeta el tamaño', () => {
    const many = Array.from({ length: 30 }, (_, i) => entry(`w${i}`, 'u1'));
    expect(pickTopicReview(many, 'u1', NOW, 15)).toHaveLength(15);
  });
});

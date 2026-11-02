import type { WordProgressEntry, WordRow } from '@/features/learning/api';

import { pickSmartReview } from '../smartReview';

const NOW = Date.parse('2026-11-01T12:00:00Z');
const H = 3600 * 1000;

const entry = (id: string, over: Partial<WordProgressEntry> = {}): WordProgressEntry => ({
  word: { id, text: id, translation_es: id } as WordRow,
  stage: 1,
  seenCount: 4,
  incorrectCount: 0,
  nextReviewAt: new Date(NOW + 10 * 24 * H).toISOString(),
  ...over,
});

describe('pickSmartReview', () => {
  it('ordena: vencidas, errores frecuentes, difíciles y por olvidar; sin repetidas', () => {
    const picked = pickSmartReview(
      [
        entry('fine'),
        entry('soon', { nextReviewAt: new Date(NOW + 5 * H).toISOString() }),
        entry('hard', { seenCount: 3, incorrectCount: 1 }),
        entry('often', { seenCount: 10, incorrectCount: 3 }),
        entry('due', { nextReviewAt: new Date(NOW - H).toISOString(), incorrectCount: 2 }),
      ],
      NOW,
    );
    expect(picked.map((p) => [p.entry.word.id, p.reason])).toEqual([
      ['due', 'due'],
      ['often', 'frequent_mistakes'],
      ['hard', 'difficult'],
      ['soon', 'due_soon'],
    ]);
  });

  it('respeta el tamaño y deja afuera lo que no encaja en ninguna regla', () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      entry(`w${i}`, { nextReviewAt: new Date(NOW - H).toISOString() }),
    );
    expect(pickSmartReview(many, NOW, 15)).toHaveLength(15);
    expect(pickSmartReview([entry('fine'), entry('unseen', { seenCount: 0 })], NOW)).toEqual([]);
  });
});

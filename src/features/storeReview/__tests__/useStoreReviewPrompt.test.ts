import { REVIEW_AFTER, reachedReviewThreshold } from '../useStoreReviewPrompt';

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));

describe('reachedReviewThreshold', () => {
  it('pide la valoración con 5 lecciones o 5 Ranked, lo que llegue primero', () => {
    expect(REVIEW_AFTER).toBe(5);
    expect(reachedReviewThreshold(4, 4)).toBe(false);
    expect(reachedReviewThreshold(5, 0)).toBe(true);
    expect(reachedReviewThreshold(0, 5)).toBe(true);
    expect(reachedReviewThreshold(12, 9)).toBe(true);
  });
});

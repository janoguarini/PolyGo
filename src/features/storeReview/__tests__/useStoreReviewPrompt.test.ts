import {
  REVIEW_STREAK_DAYS,
  SILVER_MIN_RATING,
  reachedReviewMoment,
} from '../useStoreReviewPrompt';

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));

const none = { streakDays: 0, peakRating: 100, unitsCompleted: 0 };

describe('reachedReviewMoment', () => {
  it('usa racha de 7 días y Plata (400) como umbrales', () => {
    expect(REVIEW_STREAK_DAYS).toBe(7);
    expect(SILVER_MIN_RATING).toBe(400);
  });

  it('no pide nada sin un momento feliz', () => {
    expect(reachedReviewMoment(none)).toBe(false);
    expect(reachedReviewMoment({ streakDays: 6, peakRating: 399, unitsCompleted: 0 })).toBe(false);
  });

  it('pide tras la primera racha de 7 días', () => {
    expect(reachedReviewMoment({ ...none, streakDays: 7 })).toBe(true);
  });

  it('pide al llegar a Plata por primera vez (aunque después baje)', () => {
    expect(reachedReviewMoment({ ...none, peakRating: 400 })).toBe(true);
  });

  it('pide al terminar la primera unidad', () => {
    expect(reachedReviewMoment({ ...none, unitsCompleted: 1 })).toBe(true);
  });
});

import { isStreakShareMilestone, shareRef } from '../share';

describe('isStreakShareMilestone', () => {
  it('festeja los hitos pedidos', () => {
    for (const d of [7, 14, 30, 50, 100, 200, 365]) expect(isStreakShareMilestone(d)).toBe(true);
  });

  it('pasado el año, cada 100 días', () => {
    expect(isStreakShareMilestone(400)).toBe(true);
    expect(isStreakShareMilestone(1000)).toBe(true);
    expect(isStreakShareMilestone(366)).toBe(false);
  });

  it('no festeja días comunes', () => {
    for (const d of [0, 1, 6, 8, 29, 99, 101]) expect(isStreakShareMilestone(d)).toBe(false);
  });
});

describe('shareRef', () => {
  it('es estable por logro (una vez por logro)', () => {
    expect(shareRef({ kind: 'rank', tier: 'gold' })).toBe('rank:gold');
    expect(shareRef({ kind: 'streak', days: 30, language: 'en' })).toBe('streak:30');
    expect(shareRef({ kind: 'streak', days: 30, language: 'fr' })).toBe('streak:30');
    expect(shareRef({ kind: 'level', level: 'A1', language: 'fr' })).toBe('level:fr:A1');
  });
});

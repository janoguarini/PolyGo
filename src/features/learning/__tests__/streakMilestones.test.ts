import { hoursUntilMidnight, monthGrid, monthStats, nextMilestone } from '../streak';

describe('nextMilestone', () => {
  it('apunta al próximo hito con el progreso desde el anterior', () => {
    expect(nextMilestone(0)).toEqual({ target: 3, previous: 0, progress: 0, polys: null });
    expect(nextMilestone(5)).toEqual({ target: 7, previous: 3, progress: 0.5, polys: 25 });
    expect(nextMilestone(20).polys).toBe(75);
    expect(nextMilestone(7).target).toBe(14);
    expect(nextMilestone(1000).target).toBe(1500);
  });
});

describe('monthStats', () => {
  it('cuenta días estudiados y la tanda más larga; el protector no corta', () => {
    const weeks = monthGrid(
      2026,
      10,
      ['2026-11-02', '2026-11-03', '2026-11-05', '2026-11-10', '2026-11-11'],
      ['2026-11-04'],
      new Date(2026, 10, 23, 12),
    );
    expect(monthStats(weeks)).toEqual({ studied: 5, bestRun: 3 });
  });
});

describe('hoursUntilMidnight', () => {
  it('redondea hacia arriba y nunca da cero', () => {
    expect(hoursUntilMidnight(new Date(2026, 10, 23, 20, 30))).toBe(4);
    expect(hoursUntilMidnight(new Date(2026, 10, 23, 23, 59, 59))).toBe(1);
  });
});

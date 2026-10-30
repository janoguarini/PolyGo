import { ACHIEVEMENT_FAMILIES, achievementRows } from '@shared/achievements';

import type { Achievement } from '../api';
import { familyLevels, familyOfAchievement, familyProgress, featuredFamilies } from '../families';

/** Simula get_my_achievements para un valor de métrica por familia. */
function mine(values: Record<string, number>, unlockedAt = '2026-10-30T10:00:00Z'): Achievement[] {
  return achievementRows().map((r) => {
    const value = values[r.metric] ?? 0;
    return {
      id: r.id,
      category: r.category,
      title: r.title_es,
      description: r.description_es,
      icon: r.icon,
      threshold: r.threshold,
      progress: Math.min(value, r.threshold),
      unlockedAt: value >= r.threshold ? unlockedAt : null,
    };
  });
}

describe('catálogo compartido', () => {
  it('ids únicos y umbrales crecientes en cada familia', () => {
    const ids = ACHIEVEMENT_FAMILIES.flatMap((f) => f.tiers.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of ACHIEVEMENT_FAMILIES) {
      const t = f.tiers.map((x) => x.threshold);
      expect([f.metric, t]).toEqual([f.metric, [...t].sort((a, b) => a - b)]);
      expect(new Set(t).size).toBe(t.length);
    }
  });

  it('conserva los ids de los logros que ya existían', () => {
    for (const id of ['first_lesson', 'perfect_lesson', 'golden_25', 'stars_30', 'streak_30']) {
      expect(familyOfAchievement(id)).not.toBeNull();
    }
    for (const id of ['mastered_50', 'placement_done', 'first_win', 'peak_platinum']) {
      expect(familyOfAchievement(id)).not.toBeNull();
    }
  });
});

describe('familyProgress', () => {
  it('calcula nivel, próximo nivel y avance entre umbrales', () => {
    // Racha: niveles 3, 7, 14… → con 10 días, nivel 2 y 3/7 del camino de 7 a 14.
    const streak = familyProgress(mine({ best_streak_days: 10 })).find(
      (f) => f.family.metric === 'best_streak_days',
    )!;
    expect(streak.level).toBe(2);
    expect(streak.current?.threshold).toBe(7);
    expect(streak.next?.threshold).toBe(14);
    expect(streak.value).toBe(10);
    expect(streak.ratio).toBeCloseTo(3 / 7);
  });

  it('sin niveles: avance desde 0 al primero', () => {
    const goal = familyProgress(mine({})).find((f) => f.family.metric === 'goal_days')!;
    expect(goal).toMatchObject({ level: 0, current: null, value: 0, ratio: 0 });
  });

  it('familia completa', () => {
    const reviews = familyProgress(mine({ reviews_completed: 500 })).find(
      (f) => f.family.metric === 'reviews_completed',
    )!;
    expect(reviews).toMatchObject({ level: reviews.maxLevel, next: null, ratio: 1 });
  });

  it('una familia por métrica, en el orden del catálogo', () => {
    expect(familyProgress(mine({})).map((f) => f.family.metric)).toEqual(
      ACHIEVEMENT_FAMILIES.map((f) => f.metric),
    );
  });
});

it('familyLevels cuenta niveles por familia desde ids', () => {
  const levels = familyLevels(['first_win', 'wins_10', 'streak_3', 'desconocido']);
  expect(levels.map((l) => [l.family.metric, l.level])).toEqual([
    ['best_streak_days', 1],
    ['wins', 2],
  ]);
});

it('featuredFamilies prioriza lo último desbloqueado y después lo más cercano', () => {
  const families = familyProgress([
    ...mine({ wins: 1 }, '2026-10-01T00:00:00Z').filter(
      (a) => a.id.startsWith('wins') || a.id === 'first_win',
    ),
    ...mine({ best_streak_days: 3 }, '2026-10-20T00:00:00Z').filter((a) =>
      a.id.startsWith('streak'),
    ),
    // Sin niveles: 20 de 25 palabras (80 %) va antes que 0 repasos.
    ...mine({ words_seen: 20 }).filter((a) => /^words_/.test(a.id)),
    ...mine({ reviews_completed: 0 }).filter((a) => a.id.startsWith('reviews')),
  ]);
  expect(featuredFamilies(families, 3).map((f) => f.family.metric)).toEqual([
    'best_streak_days',
    'wins',
    'words_seen',
  ]);
});

import type { AchievementCategory } from '@shared/achievements';

import { defineStrings } from '..';

/** Lista completa de logros (src/app/achievements.tsx). */
export const achievementsScreenStrings = defineStrings({
  es: {
    loading: 'Cargando logros…',
    title: 'Logros',
    levels: (levels: number, max: number) => `${levels} de ${max} niveles`,
    levelsA11y: 'Niveles de logros alcanzados',
    hint: 'Cada logro sube de nivel a medida que avanzás. ¡Seguí sumando!',
    categories: {
      streak: 'Constancia',
      learning: 'Lecciones',
      vocabulary: 'Vocabulario',
      competitive: 'Competitivo',
    } satisfies Record<AchievementCategory, string>,
  },
  en: {
    loading: 'Loading achievements…',
    title: 'Achievements',
    levels: (levels: number, max: number) => `${levels} of ${max} levels`,
    levelsA11y: 'Achievement levels reached',
    hint: 'Each achievement levels up as you progress. Keep going!',
    categories: {
      streak: 'Consistency',
      learning: 'Lessons',
      vocabulary: 'Vocabulary',
      competitive: 'Competitive',
    },
  },
});

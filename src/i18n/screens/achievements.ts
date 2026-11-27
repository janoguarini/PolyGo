import type { AchievementCategory } from '@shared/achievements';

import { defineStrings } from '..';

/** Lista completa de logros (src/app/achievements.tsx). */
export const achievementsScreenStrings = defineStrings({
  es: {
    loading: 'Cargando logros…',
    title: 'Logros',
    levels: (levels: number, max: number) => `${levels} de ${max} niveles`,
    levelsA11y: 'Niveles de logros alcanzados',
    hint: 'Cada logro sube de nivel a medida que avanzas. ¡Sigue sumando!',
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
  'pt-BR': {
    loading: 'Carregando conquistas…',
    title: 'Conquistas',
    levels: (levels: number, max: number) => `${levels} de ${max} níveis`,
    levelsA11y: 'Níveis de conquistas alcançados',
    hint: 'Cada conquista sobe de nível conforme você avança. Continue assim!',
    categories: {
      streak: 'Constância',
      learning: 'Lições',
      vocabulary: 'Vocabulário',
      competitive: 'Competitivo',
    },
  },
  it: {
    loading: 'Caricamento traguardi…',
    title: 'Traguardi',
    levels: (levels: number, max: number) => `${levels} di ${max} livelli`,
    levelsA11y: 'Livelli raggiunti nei traguardi',
    hint: 'Ogni traguardo sale di livello man mano che avanzi. Continua così!',
    categories: {
      streak: 'Costanza',
      learning: 'Lezioni',
      vocabulary: 'Vocabolario',
      competitive: 'Competitivo',
    },
  },
});

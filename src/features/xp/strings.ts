import type { XpSource } from '@shared/xp';

import { defineStrings } from '@/i18n';

/**
 * Títulos por nivel (src/features/xp/titles.ts). El título se guarda en el teléfono por su texto en
 * español, que funciona como id estable: acá sólo se traduce para mostrarlo.
 */
const EN_TITLES: Record<string, string> = {
  Novato: 'Rookie',
  Principiante: 'Beginner',
  Aprendiz: 'Apprentice',
  Explorador: 'Explorer',
  Intermedio: 'Intermediate',
  Avanzado: 'Advanced',
  Experto: 'Expert',
  Especialista: 'Specialist',
  Maestro: 'Master',
  'Gran Maestro': 'Grandmaster',
  'Políglota Élite': 'Elite Polyglot',
};

/** Etiquetas de cada ganancia de XP (shared/xp.ts las guarda en español; se mapean por fuente). */
const EN_SOURCES: Record<XpSource, string> = {
  lesson_first: 'Lesson complete',
  lesson_repeat: 'Lesson practice',
  review: 'Review complete',
  ranked_win: 'Ranked win',
  ranked_loss: 'Ranked match',
  daily_challenge: 'Daily challenge',
};

export const xpStrings = defineStrings({
  es: {
    /** Recibe el título guardado (en español) y lo devuelve tal cual. */
    title: (title: string) => title,
    titleA11y: (title: string) => `Título: ${title}`,
    sourceLabel: (_source: XpSource, fallback: string) => fallback,
    experience: 'Experiencia',
    level: (n: number) => `Nivel ${n}`,
    levelCaps: 'NIVEL',
    levelMaxA11y: (n: number) => `Nivel ${n}, máximo`,
    levelA11y: (level: number, into: number, need: number, remaining: number) =>
      `Nivel ${level}. ${into} de ${need} XP. Faltan ${remaining} XP para el nivel ${level + 1}`,
    sampleData: 'Datos de ejemplo',
    maxReached: 'Nivel máximo alcanzado',
    remaining: (xp: string, nextLevel: number) => `Faltan ${xp} XP para el nivel ${nextLevel}`,
    toastA11y: (preview: boolean, total: number, label: string) =>
      `${preview ? 'Vista previa: ' : ''}Ganaste ${total} de experiencia: ${label}`,
    levelUp: (preview: boolean): string =>
      preview ? 'PREVIEW · ¡SUBISTE DE NIVEL!' : '¡SUBISTE DE NIVEL!',
    levelUpHint: 'Cada lección, repaso y partida te acerca al próximo nivel.',
    continue: 'Continuar',
    // XpRewardCard (resultados de la lección)
    rewardTitle: 'EXPERIENCIA',
    rewardAdding: 'Sumando experiencia…',
    rewardLevelUp: (n: number) => `¡SUBISTE AL NIVEL ${n}!`,
    rewardA11y: (gained: number, level: number) =>
      `Ganaste ${gained} de experiencia. Nivel ${level}`,
  },
  en: {
    title: (title: string) => EN_TITLES[title] ?? title,
    titleA11y: (title: string) => `Title: ${title}`,
    sourceLabel: (source: XpSource, fallback: string) => EN_SOURCES[source] ?? fallback,
    experience: 'Experience',
    level: (n: number) => `Level ${n}`,
    levelCaps: 'LEVEL',
    levelMaxA11y: (n: number) => `Level ${n}, max`,
    levelA11y: (level: number, into: number, need: number, remaining: number) =>
      `Level ${level}. ${into} of ${need} XP. ${remaining} XP to level ${level + 1}`,
    sampleData: 'Sample data',
    maxReached: 'Max level reached',
    remaining: (xp: string, nextLevel: number) => `${xp} XP to level ${nextLevel}`,
    toastA11y: (preview: boolean, total: number, label: string) =>
      `${preview ? 'Preview: ' : ''}You earned ${total} experience: ${label}`,
    levelUp: (preview: boolean) => (preview ? 'PREVIEW · LEVEL UP!' : 'LEVEL UP!'),
    levelUpHint: 'Every lesson, review and match brings you closer to the next level.',
    continue: 'Continue',
    rewardTitle: 'EXPERIENCE',
    rewardAdding: 'Adding up your experience…',
    rewardLevelUp: (n: number) => `YOU REACHED LEVEL ${n}!`,
    rewardA11y: (gained: number, level: number) =>
      `You earned ${gained} experience. Level ${level}`,
  },
});

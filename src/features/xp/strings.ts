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

const PT_TITLES: Record<string, string> = {
  Novato: 'Novato',
  Principiante: 'Iniciante',
  Aprendiz: 'Aprendiz',
  Explorador: 'Explorador',
  Intermedio: 'Intermediário',
  Avanzado: 'Avançado',
  Experto: 'Craque',
  Especialista: 'Especialista',
  Maestro: 'Mestre',
  'Gran Maestro': 'Grão-Mestre',
  'Políglota Élite': 'Poliglota de Elite',
};

const IT_TITLES: Record<string, string> = {
  Novato: 'Novellino',
  Principiante: 'Principiante',
  Aprendiz: 'Apprendista',
  Explorador: 'Esploratore',
  Intermedio: 'Intermedio',
  Avanzado: 'Avanzato',
  Experto: 'Esperto',
  Especialista: 'Specialista',
  Maestro: 'Maestro',
  'Gran Maestro': 'Gran Maestro',
  'Políglota Élite': 'Poliglotta d’élite',
};

const PT_SOURCES: Record<XpSource, string> = {
  lesson_first: 'Lição concluída',
  lesson_repeat: 'Prática de lição',
  review: 'Revisão concluída',
  ranked_win: 'Vitória no Ranked',
  ranked_loss: 'Partida Ranked',
  daily_challenge: 'Desafio diário',
};

const IT_SOURCES: Record<XpSource, string> = {
  lesson_first: 'Lezione completata',
  lesson_repeat: 'Ripetizione della lezione',
  review: 'Ripasso completato',
  ranked_win: 'Vittoria Ranked',
  ranked_loss: 'Partita Ranked',
  daily_challenge: 'Sfida del giorno',
};

const FR_TITLES: Record<string, string> = {
  Novato: 'Débutant',
  Principiante: 'Novice',
  Aprendiz: 'Apprenti',
  Explorador: 'Explorateur',
  Intermedio: 'Intermédiaire',
  Avanzado: 'Avancé',
  Experto: 'Expert',
  Especialista: 'Spécialiste',
  Maestro: 'Maître',
  'Gran Maestro': 'Grand Maître',
  'Políglota Élite': 'Polyglotte d’élite',
};

const FR_SOURCES: Record<XpSource, string> = {
  lesson_first: 'Leçon terminée',
  lesson_repeat: 'Leçon révisée',
  review: 'Révision terminée',
  ranked_win: 'Victoire en Ranked',
  ranked_loss: 'Partie Ranked',
  daily_challenge: 'Défi du jour',
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
  'pt-BR': {
    title: (title: string) => PT_TITLES[title] ?? title,
    titleA11y: (title: string) => `Título: ${title}`,
    sourceLabel: (source: XpSource, fallback: string) => PT_SOURCES[source] ?? fallback,
    experience: 'Experiência',
    level: (n: number) => `Nível ${n}`,
    levelCaps: 'NÍVEL',
    levelMaxA11y: (n: number) => `Nível ${n}, máximo`,
    levelA11y: (level: number, into: number, need: number, remaining: number) =>
      `Nível ${level}. ${into} de ${need} XP. Faltam ${remaining} XP para o nível ${level + 1}`,
    sampleData: 'Dados de exemplo',
    maxReached: 'Nível máximo alcançado',
    remaining: (xp: string, nextLevel: number) => `Faltam ${xp} XP para o nível ${nextLevel}`,
    toastA11y: (preview: boolean, total: number, label: string) =>
      `${preview ? 'Prévia: ' : ''}Você ganhou ${total} de experiência: ${label}`,
    levelUp: (preview: boolean) =>
      preview ? 'PREVIEW · VOCÊ SUBIU DE NÍVEL!' : 'VOCÊ SUBIU DE NÍVEL!',
    levelUpHint: 'Cada lição, revisão e partida te deixa mais perto do próximo nível.',
    continue: 'Continuar',
    rewardTitle: 'EXPERIÊNCIA',
    rewardAdding: 'Somando experiência…',
    rewardLevelUp: (n: number) => `VOCÊ CHEGOU AO NÍVEL ${n}!`,
    rewardA11y: (gained: number, level: number) =>
      `Você ganhou ${gained} de experiência. Nível ${level}`,
  },
  it: {
    title: (title: string) => IT_TITLES[title] ?? title,
    titleA11y: (title: string) => `Titolo: ${title}`,
    sourceLabel: (source: XpSource, fallback: string) => IT_SOURCES[source] ?? fallback,
    experience: 'Esperienza',
    level: (n: number) => `Livello ${n}`,
    levelCaps: 'LIVELLO',
    levelMaxA11y: (n: number) => `Livello ${n}, massimo`,
    levelA11y: (level: number, into: number, need: number, remaining: number) =>
      `Livello ${level}. ${into} di ${need} XP. Mancano ${remaining} XP al livello ${level + 1}`,
    sampleData: 'Dati di esempio',
    maxReached: 'Livello massimo raggiunto',
    remaining: (xp: string, nextLevel: number) => `Mancano ${xp} XP al livello ${nextLevel}`,
    toastA11y: (preview: boolean, total: number, label: string) =>
      `${preview ? 'Anteprima: ' : ''}Hai guadagnato ${total} di esperienza: ${label}`,
    levelUp: (preview: boolean) =>
      preview ? 'PREVIEW · SEI SALITO DI LIVELLO!' : 'SEI SALITO DI LIVELLO!',
    levelUpHint: 'Ogni lezione, ripasso e partita ti avvicina al prossimo livello.',
    continue: 'Continua',
    rewardTitle: 'ESPERIENZA',
    rewardAdding: 'Sto sommando l’esperienza…',
    rewardLevelUp: (n: number) => `HAI RAGGIUNTO IL LIVELLO ${n}!`,
    rewardA11y: (gained: number, level: number) =>
      `Hai guadagnato ${gained} di esperienza. Livello ${level}`,
  },
  fr: {
    title: (title: string) => FR_TITLES[title] ?? title,
    titleA11y: (title: string) => `Titre : ${title}`,
    sourceLabel: (source: XpSource, fallback: string) => FR_SOURCES[source] ?? fallback,
    experience: 'Expérience',
    level: (n: number) => `Niveau ${n}`,
    levelCaps: 'NIVEAU',
    levelMaxA11y: (n: number) => `Niveau ${n}, max`,
    levelA11y: (level: number, into: number, need: number, remaining: number) =>
      `Niveau ${level}. ${into} XP sur ${need}. Encore ${remaining} XP avant le niveau ${level + 1}`,
    sampleData: 'Données d’exemple',
    maxReached: 'Niveau max atteint',
    remaining: (xp: string, nextLevel: number) => `Encore ${xp} XP avant le niveau ${nextLevel}`,
    toastA11y: (preview: boolean, total: number, label: string) =>
      `${preview ? 'Aperçu : ' : ''}Tu as gagné ${total} d’expérience : ${label}`,
    levelUp: (preview: boolean) =>
      preview ? 'PREVIEW · NIVEAU SUPÉRIEUR !' : 'NIVEAU SUPÉRIEUR !',
    levelUpHint: 'Chaque leçon, révision et partie te rapproche du niveau suivant.',
    continue: 'Continuer',
    rewardTitle: 'EXPÉRIENCE',
    rewardAdding: 'On compte ton expérience…',
    rewardLevelUp: (n: number) => `TU PASSES AU NIVEAU ${n} !`,
    rewardA11y: (gained: number, level: number) =>
      `Tu as gagné ${gained} d’expérience. Niveau ${level}`,
  },
});

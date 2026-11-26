import { defineStrings } from '@/i18n';

/** Tarjetas de logros para compartir (src/features/share). */
export const shareStrings = defineStrings({
  es: {
    // Encabezado de la tarjeta
    rankOverline: 'NUEVO RANGO',
    streakOverline: 'RACHA',
    levelOverline: 'NIVEL COMPLETO',
    // Frase grande de la tarjeta (language = nombre del idioma en minúscula)
    rankHeadline: (rank: string) => `¡Llegué a ${rank}!`,
    rankSub: 'en las partidas Ranked',
    streakHeadline: (days: number) => `¡${days} días seguidos!`,
    streakSub: (language: string) => `aprendiendo ${language}`,
    levelHeadline: (level: string) => `¡Terminé el nivel ${level}!`,
    levelSub: (language: string) => `de ${language}`,
    // Pie de la tarjeta
    joinWithCode: (code: string) => `Sumate con mi código ${code}`,
    // Pantalla para compartir
    shareTitle: '¡Contale a tus amigos!',
    shareBody: (polys: number) => `Compartí tu logro y ganá ${polys} Polys.`,
    shareBodyDone: 'Compartí tu logro con tus amigos.',
    shareButton: (polys: number) => `Compartir · +${polys}`,
    shareButtonDone: 'Compartir',
    notNow: 'Ahora no',
    shareError: 'No se pudo compartir. Probá de nuevo.',
    shareDialogTitle: 'Compartir logro',
    shareMessage: (code: string | null) =>
      code
        ? `¡Mirá mi logro en PolyGo! Sumate con mi código ${code} 👉 https://polygoidiomas.com`
        : '¡Mirá mi logro en PolyGo! 👉 https://polygoidiomas.com',
    cardA11y: (headline: string, sub: string) => `Tarjeta para compartir: ${headline} ${sub}`,
    // Festejos que abren la tarjeta
    shareAchievement: 'Compartir logro',
    levelDoneTitle: (level: string) => `¡Terminaste ${level}!`,
    streakMilestone: (days: number) => `¡Hito de ${days} días!`,
  },
  en: {
    rankOverline: 'NEW RANK',
    streakOverline: 'STREAK',
    levelOverline: 'LEVEL COMPLETE',
    rankHeadline: (rank: string) => `I reached ${rank}!`,
    rankSub: 'in Ranked matches',
    streakHeadline: (days: number) => `${days} days in a row!`,
    streakSub: (language: string) => `learning ${language}`,
    levelHeadline: (level: string) => `I finished level ${level}!`,
    levelSub: (language: string) => `in ${language}`,
    joinWithCode: (code: string) => `Join with my code ${code}`,
    shareTitle: 'Tell your friends!',
    shareBody: (polys: number) => `Share your achievement and earn ${polys} Polys.`,
    shareBodyDone: 'Share your achievement with your friends.',
    shareButton: (polys: number) => `Share · +${polys}`,
    shareButtonDone: 'Share',
    notNow: 'Not now',
    shareError: "Couldn't share. Try again.",
    shareDialogTitle: 'Share achievement',
    shareMessage: (code: string | null) =>
      code
        ? `Check out my achievement on PolyGo! Join with my code ${code} 👉 https://polygoidiomas.com`
        : 'Check out my achievement on PolyGo! 👉 https://polygoidiomas.com',
    cardA11y: (headline: string, sub: string) => `Share card: ${headline} ${sub}`,
    shareAchievement: 'Share achievement',
    levelDoneTitle: (level: string) => `You finished ${level}!`,
    streakMilestone: (days: number) => `${days}-day milestone!`,
  },
});

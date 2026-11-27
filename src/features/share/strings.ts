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
    joinWithCode: (code: string) => `Súmate con mi código ${code}`,
    // Pantalla para compartir
    shareTitle: '¡Cuéntale a tus amigos!',
    shareBody: (polys: number) => `Comparte tu logro y gana ${polys} Polys.`,
    shareBodyDone: 'Comparte tu logro con tus amigos.',
    shareButton: (polys: number) => `Compartir · +${polys}`,
    shareButtonDone: 'Compartir',
    notNow: 'Ahora no',
    shareError: 'No se pudo compartir. Inténtalo de nuevo.',
    shareDialogTitle: 'Compartir logro',
    shareMessage: (code: string | null) =>
      code
        ? `¡Mira mi logro en PolyGo! Súmate con mi código ${code} 👉 https://polygoidiomas.com`
        : '¡Mira mi logro en PolyGo! 👉 https://polygoidiomas.com',
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
  'pt-BR': {
    rankOverline: 'NOVO RANK',
    streakOverline: 'SEQUÊNCIA',
    levelOverline: 'NÍVEL CONCLUÍDO',
    rankHeadline: (rank: string) => `Agora sou ${rank}!`,
    rankSub: 'nas partidas Ranked',
    streakHeadline: (days: number) => `${days} dias seguidos!`,
    streakSub: (language: string) => `aprendendo ${language}`,
    levelHeadline: (level: string) => `Terminei o nível ${level}!`,
    levelSub: (language: string) => `de ${language}`,
    joinWithCode: (code: string) => `Entre com meu código ${code}`,
    shareTitle: 'Conte para seus amigos!',
    shareBody: (polys: number) => `Compartilhe sua conquista e ganhe ${polys} Polys.`,
    shareBodyDone: 'Compartilhe sua conquista com seus amigos.',
    shareButton: (polys: number) => `Compartilhar · +${polys}`,
    shareButtonDone: 'Compartilhar',
    notNow: 'Agora não',
    shareError: 'Não foi possível compartilhar. Tente de novo.',
    shareDialogTitle: 'Compartilhar conquista',
    shareMessage: (code: string | null) =>
      code
        ? `Olha minha conquista no PolyGo! Entre com meu código ${code} 👉 https://polygoidiomas.com`
        : 'Olha minha conquista no PolyGo! 👉 https://polygoidiomas.com',
    cardA11y: (headline: string, sub: string) => `Cartão para compartilhar: ${headline} ${sub}`,
    shareAchievement: 'Compartilhar conquista',
    levelDoneTitle: (level: string) => `Você terminou o ${level}!`,
    streakMilestone: (days: number) => `Marco de ${days} dias!`,
  },
  it: {
    rankOverline: 'NUOVO RANGO',
    streakOverline: 'SERIE',
    levelOverline: 'LIVELLO COMPLETATO',
    rankHeadline: (rank: string) => `Ho raggiunto il rango ${rank}!`,
    rankSub: 'nelle partite Ranked',
    streakHeadline: (days: number) => `${days} giorni di fila!`,
    streakSub: (language: string) => `imparando ${language}`,
    levelHeadline: (level: string) => `Ho finito il livello ${level}!`,
    levelSub: (language: string) => `di ${language}`,
    joinWithCode: (code: string) => `Unisciti con il mio codice ${code}`,
    shareTitle: 'Dillo ai tuoi amici!',
    shareBody: (polys: number) => `Condividi il tuo traguardo e ottieni ${polys} Polys.`,
    shareBodyDone: 'Condividi il tuo traguardo con i tuoi amici.',
    shareButton: (polys: number) => `Condividi · +${polys}`,
    shareButtonDone: 'Condividi',
    notNow: 'Non ora',
    shareError: 'Non è stato possibile condividere. Riprova.',
    shareDialogTitle: 'Condividi traguardo',
    shareMessage: (code: string | null) =>
      code
        ? `Guarda il mio traguardo su PolyGo! Unisciti con il mio codice ${code} 👉 https://polygoidiomas.com`
        : 'Guarda il mio traguardo su PolyGo! 👉 https://polygoidiomas.com',
    cardA11y: (headline: string, sub: string) => `Scheda da condividere: ${headline} ${sub}`,
    shareAchievement: 'Condividi traguardo',
    levelDoneTitle: (level: string) => `Hai finito ${level}!`,
    streakMilestone: (days: number) => `Traguardo di ${days} giorni!`,
  },
});

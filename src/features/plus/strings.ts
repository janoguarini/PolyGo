import { formatEnergyWait } from '@shared/energy';

import { defineStrings, getInterfaceLanguage } from '@/i18n';

/** Textos de la energía y de los componentes de PolyGo Plus. */
export const energyStrings = defineStrings({
  es: {
    statusPlus: 'Ilimitada con PolyGo Plus',
    statusFull: 'Energía llena',
    statusNext: (wait: string) => `Próxima en ${wait}`,
    statusEmpty: (next: string) => `Sin energía · ${next}`,
    a11yPlus: 'Energía ilimitada con PolyGo Plus',
    a11y: (energy: number, max: number, status: string) => `Energía ${energy} de ${max}. ${status}`,
    chipLabel: 'Energía',
    chipHideHint: 'Oculta los detalles',
    chipShowHint: 'Muestra cómo funciona la energía',
    loading: 'Cargando tu energía…',
    errorTitle: 'No pudimos leer tu energía',
    errorBody: 'Podés seguir usando Polygo: al guardar una lección el servidor la verifica igual.',
    retry: 'Reintentar',
    unlimited: 'Energía ilimitada',
    amount: (energy: number, max: number) => `Energía ${energy} de ${max}`,
    stale: 'Sin conexión: puede no estar al día.',
    plusBody: 'Completá todas las lecciones que quieras.',
    rules: (cost: number, hours: number, max: number) =>
      `Completar una lección usa ${cost}. Equivocarte, entrar o salir de una lección no gasta nada. Recuperás 1 cada ${hours} horas hasta ${max}. Ranked, el repaso y Amigos nunca usan energía.`,
    plusLinkA11y: 'Conocé PolyGo Plus: energía ilimitada',
    plusLink: '¿No querés esperar? Conocé PolyGo Plus',
    // Sin energía (en lugar del reproductor)
    outTitle: 'Te quedaste sin energía',
    outWait: (wait: string) => `Recuperás 1 en ${wait} y vas a poder seguir con esta lección.`,
    outRecharging: 'Ya se está recargando.',
    outMeanwhile: 'Mientras tanto, el repaso y ranked son gratis y no usan energía.',
    reviewFree: 'Repasar gratis',
    playRanked: 'Jugar ranked',
    backToPath: 'Volver al camino',
    outFooter: (cost: number) =>
      `Completar una lección usa ${cost} de energía; equivocarte no gasta más.`,
    // Distintivo
    badgeA11y: 'Función de PolyGo Plus',
  },
  en: {
    statusPlus: 'Unlimited with PolyGo Plus',
    statusFull: 'Energy full',
    statusNext: (wait: string) => `Next in ${wait}`,
    statusEmpty: (next: string) => `Out of energy · ${next}`,
    a11yPlus: 'Unlimited energy with PolyGo Plus',
    a11y: (energy: number, max: number, status: string) => `Energy ${energy} of ${max}. ${status}`,
    chipLabel: 'Energy',
    chipHideHint: 'Hides the details',
    chipShowHint: 'Shows how energy works',
    loading: 'Loading your energy…',
    errorTitle: 'We couldn’t read your energy',
    errorBody: 'You can keep using Polygo: the server still checks it when a lesson is saved.',
    retry: 'Try again',
    unlimited: 'Unlimited energy',
    amount: (energy: number, max: number) => `Energy ${energy} of ${max}`,
    stale: 'Offline: this may be out of date.',
    plusBody: 'Complete as many lessons as you want.',
    rules: (cost: number, hours: number, max: number) =>
      `Completing a lesson uses ${cost}. Mistakes, opening or leaving a lesson cost nothing. You get 1 back every ${hours} hours, up to ${max}. Ranked, review and Friends never use energy.`,
    plusLinkA11y: 'Discover PolyGo Plus: unlimited energy',
    plusLink: 'Don’t want to wait? Discover PolyGo Plus',
    outTitle: 'You’re out of energy',
    outWait: (wait: string) => `You’ll get 1 back in ${wait} and can continue this lesson.`,
    outRecharging: 'It’s already recharging.',
    outMeanwhile: 'In the meantime, review and Ranked are free and don’t use energy.',
    reviewFree: 'Review for free',
    playRanked: 'Play Ranked',
    backToPath: 'Back to the path',
    outFooter: (cost: number) =>
      `Completing a lesson uses ${cost} energy; mistakes don’t cost extra.`,
    badgeA11y: 'PolyGo Plus feature',
  },
});

/** `formatEnergyWait` (shared, en español) según el idioma de la interfaz: «2 h 10 min». */
export function energyWait(ms: number): string {
  const text = formatEnergyWait(ms);
  return getInterfaceLanguage() === 'en' && text === 'menos de 1 min' ? 'less than 1 min' : text;
}

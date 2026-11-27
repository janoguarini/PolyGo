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
    errorBody: 'Puedes seguir usando PolyGo: al guardar una lección el servidor la verifica igual.',
    retry: 'Reintentar',
    unlimited: 'Energía ilimitada',
    amount: (energy: number, max: number) => `Energía ${energy} de ${max}`,
    stale: 'Sin conexión: puede no estar al día.',
    plusBody: 'Completa todas las lecciones que quieras.',
    rules: (cost: number, hours: number, max: number) =>
      `Completar una lección usa ${cost}. Equivocarte, entrar o salir de una lección no gasta nada. Recuperas 1 cada ${hours} horas hasta ${max}. Ranked, el repaso y Amigos nunca usan energía.`,
    plusLinkA11y: 'Conoce PolyGo Plus: energía ilimitada',
    plusLink: '¿No quieres esperar? Conoce PolyGo Plus',
    // Sin energía (en lugar del reproductor)
    outTitle: 'Te quedaste sin energía',
    outWait: (wait: string) => `Recuperas 1 en ${wait} y podrás seguir con esta lección.`,
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
    errorBody: 'You can keep using PolyGo: the server still checks it when a lesson is saved.',
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
  'pt-BR': {
    statusPlus: 'Ilimitada com o PolyGo Plus',
    statusFull: 'Energia cheia',
    statusNext: (wait: string) => `Próxima em ${wait}`,
    statusEmpty: (next: string) => `Sem energia · ${next}`,
    a11yPlus: 'Energia ilimitada com o PolyGo Plus',
    a11y: (energy: number, max: number, status: string) => `Energia ${energy} de ${max}. ${status}`,
    chipLabel: 'Energia',
    chipHideHint: 'Oculta os detalhes',
    chipShowHint: 'Mostra como a energia funciona',
    loading: 'Carregando sua energia…',
    errorTitle: 'Não conseguimos ler sua energia',
    errorBody:
      'Você pode continuar usando o PolyGo: ao salvar uma lição, o servidor confere do mesmo jeito.',
    retry: 'Tentar de novo',
    unlimited: 'Energia ilimitada',
    amount: (energy: number, max: number) => `Energia ${energy} de ${max}`,
    stale: 'Sem conexão: pode não estar atualizado.',
    plusBody: 'Conclua quantas lições quiser.',
    rules: (cost: number, hours: number, max: number) =>
      `Concluir uma lição usa ${cost}. Errar, entrar ou sair de uma lição não gasta nada. Você recupera 1 a cada ${hours} horas, até ${max}. Ranked, revisão e Amigos nunca usam energia.`,
    plusLinkA11y: 'Conheça o PolyGo Plus: energia ilimitada',
    plusLink: 'Não quer esperar? Conheça o PolyGo Plus',
    outTitle: 'Sua energia acabou',
    outWait: (wait: string) => `Você recupera 1 em ${wait} e vai poder continuar esta lição.`,
    outRecharging: 'Ela já está recarregando.',
    outMeanwhile: 'Enquanto isso, a revisão e o Ranked são grátis e não usam energia.',
    reviewFree: 'Revisar grátis',
    playRanked: 'Jogar Ranked',
    backToPath: 'Voltar à trilha',
    outFooter: (cost: number) => `Concluir uma lição usa ${cost} de energia; errar não gasta mais.`,
    badgeA11y: 'Recurso do PolyGo Plus',
  },
  it: {
    statusPlus: 'Illimitata con PolyGo Plus',
    statusFull: 'Energia al massimo',
    statusNext: (wait: string) => `Prossima tra ${wait}`,
    statusEmpty: (next: string) => `Senza energia · ${next}`,
    a11yPlus: 'Energia illimitata con PolyGo Plus',
    a11y: (energy: number, max: number, status: string) => `Energia ${energy} su ${max}. ${status}`,
    chipLabel: 'Energia',
    chipHideHint: 'Nasconde i dettagli',
    chipShowHint: 'Mostra come funziona l’energia',
    loading: 'Caricamento della tua energia…',
    errorTitle: 'Non siamo riusciti a leggere la tua energia',
    errorBody:
      'Puoi continuare a usare PolyGo: quando salvi una lezione, il server la verifica comunque.',
    retry: 'Riprova',
    unlimited: 'Energia illimitata',
    amount: (energy: number, max: number) => `Energia ${energy} su ${max}`,
    stale: 'Offline: potrebbe non essere aggiornata.',
    plusBody: 'Completa tutte le lezioni che vuoi.',
    rules: (cost: number, hours: number, max: number) =>
      `Completare una lezione costa ${cost}. Sbagliare, entrare o uscire da una lezione non costa nulla. Ne recuperi 1 ogni ${hours} ore, fino a ${max}. Ranked, ripasso e Amici non usano mai energia.`,
    plusLinkA11y: 'Scopri PolyGo Plus: energia illimitata',
    plusLink: 'Non vuoi aspettare? Scopri PolyGo Plus',
    outTitle: 'Hai finito l’energia',
    outWait: (wait: string) => `Ne recuperi 1 tra ${wait} e potrai continuare questa lezione.`,
    outRecharging: 'Si sta già ricaricando.',
    outMeanwhile: 'Nel frattempo, il ripasso e il Ranked sono gratis e non usano energia.',
    reviewFree: 'Ripassa gratis',
    playRanked: 'Gioca a Ranked',
    backToPath: 'Torna al percorso',
    outFooter: (cost: number) =>
      `Completare una lezione costa ${cost} di energia; sbagliare non costa di più.`,
    badgeA11y: 'Funzione di PolyGo Plus',
  },
});

const LESS_THAN_A_MINUTE = {
  es: 'menos de 1 min',
  en: 'less than 1 min',
  'pt-BR': 'menos de 1 min',
  it: 'meno di 1 min',
} as const;

/** `formatEnergyWait` (shared, en español) según el idioma de la interfaz: «2 h 10 min». */
export function energyWait(ms: number): string {
  const text = formatEnergyWait(ms);
  return text === 'menos de 1 min' ? LESS_THAN_A_MINUTE[getInterfaceLanguage()] : text;
}

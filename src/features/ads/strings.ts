import { defineStrings } from '@/i18n';

/** Anuncios: botón de privacidad (UMP) y panel de prueba de desarrollo. */
export const adsStrings = defineStrings({
  es: {
    privacy: 'Privacidad de anuncios',
    privacyHint: 'Revisa o cambia tu consentimiento para los anuncios',
    // Panel de prueba (sólo __DEV__). Los estados y resultados son códigos internos sin traducir.
    debugTitle: 'Anuncios de prueba (solo desarrollo)',
    debugState: (status: string, eligibility: string, canRequest: string, ump: string) =>
      `Estado: ${status} · elegibilidad: ${eligibility} · canRequestAds: ${canRequest} · UMP: ${ump}`,
    debugWatched: (label: string) =>
      `${label}: video completo (evento del cliente). No se acreditó nada.`,
    debugLoad: 'Cargar anuncios',
    debugLoadRequested: 'Carga pedida. Espera unos segundos y prueba mostrar.',
    debugRewardedEnergy: 'Rewarded energía',
    debugRewardedFrame: 'Rewarded marco',
  },
  en: {
    privacy: 'Ad privacy',
    privacyHint: 'Review or change your consent for ads',
    debugTitle: 'Test ads (development only)',
    debugState: (status: string, eligibility: string, canRequest: string, ump: string) =>
      `Status: ${status} · eligibility: ${eligibility} · canRequestAds: ${canRequest} · UMP: ${ump}`,
    debugWatched: (label: string) =>
      `${label}: video finished (client event). Nothing was credited.`,
    debugLoad: 'Load ads',
    debugLoadRequested: 'Load requested. Wait a few seconds, then try showing one.',
    debugRewardedEnergy: 'Rewarded energy',
    debugRewardedFrame: 'Rewarded frame',
  },
  'pt-BR': {
    privacy: 'Privacidade dos anúncios',
    privacyHint: 'Revise ou altere seu consentimento para os anúncios',
    debugTitle: 'Anúncios de teste (só desenvolvimento)',
    debugState: (status: string, eligibility: string, canRequest: string, ump: string) =>
      `Estado: ${status} · elegibilidade: ${eligibility} · canRequestAds: ${canRequest} · UMP: ${ump}`,
    debugWatched: (label: string) =>
      `${label}: vídeo completo (evento do cliente). Nada foi creditado.`,
    debugLoad: 'Carregar anúncios',
    debugLoadRequested: 'Carregamento pedido. Espere alguns segundos e tente mostrar.',
    debugRewardedEnergy: 'Rewarded energia',
    debugRewardedFrame: 'Rewarded moldura',
  },
  it: {
    privacy: 'Privacy degli annunci',
    privacyHint: 'Rivedi o modifica il tuo consenso per gli annunci',
    debugTitle: 'Annunci di prova (solo sviluppo)',
    debugState: (status: string, eligibility: string, canRequest: string, ump: string) =>
      `Stato: ${status} · idoneità: ${eligibility} · canRequestAds: ${canRequest} · UMP: ${ump}`,
    debugWatched: (label: string) =>
      `${label}: video completato (evento del client). Non è stato accreditato nulla.`,
    debugLoad: 'Carica annunci',
    debugLoadRequested: 'Caricamento richiesto. Aspetta qualche secondo e prova a mostrarlo.',
    debugRewardedEnergy: 'Rewarded energia',
    debugRewardedFrame: 'Rewarded cornice',
  },
});

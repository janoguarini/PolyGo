import { createFullscreenSlot, type FullscreenSlotDeps } from './fullscreen';
import type { FullscreenAdHandle } from './types';

/**
 * Servicio de interstitial (Fase 1: unidad de prueba de Google).
 *
 * Sólo prepara y muestra. NO decide cuándo: la política (salir de los resultados de una lección o
 * de un repaso, cooldown, tope por sesión, nunca en la primera sesión, nunca en lecciones,
 * ejercicios, matchmaking ni batallas, tampoco después de una batalla) llega en la Fase 2. Hasta
 * entonces ninguna pantalla de la app lo llama; sólo el panel de prueba de Ajustes (__DEV__).
 */
export function createInterstitialService(deps: {
  adUnitId: string | null;
  createInterstitial: (adUnitId: string) => FullscreenAdHandle;
  canServe: FullscreenSlotDeps['canServe'];
}) {
  const slot = createFullscreenSlot({
    adUnitId: deps.adUnitId,
    create: deps.createInterstitial,
    canServe: deps.canServe,
  });
  return {
    preload: slot.preload,
    /** Muestra el anuncio si ya está cargado; si no, no espera (outcome 'not_ready'). */
    async show() {
      const result = await slot.show();
      // Un interstitial no da recompensa: se ignora cualquier `earned`.
      return result.outcome === 'closed' ? ({ outcome: 'closed' } as const) : result;
    },
    discard: slot.discard,
    get isReady() {
      return slot.isReady;
    },
    get lastError() {
      return slot.lastError;
    },
  };
}

export type InterstitialService = ReturnType<typeof createInterstitialService>;

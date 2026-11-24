import { createFullscreenSlot, type FullscreenSlotDeps } from './fullscreen';
import type { AdReward, FullscreenAdHandle } from './types';

export type RewardedPlacement = 'energy' | 'skin';

export type RewardedShowResult =
  /**
   * El usuario terminó el video según el SDK del CLIENTE. Esto NO es una recompensa:
   * nunca acredita energía ni marcos. La acreditación real la hará el servidor (SSV) en una fase
   * posterior; hasta entonces este resultado sólo sirve para probar el flujo.
   */
  | { outcome: 'watched'; clientReward: AdReward }
  /** Lo cerró antes de terminar. */
  | { outcome: 'dismissed' }
  | { outcome: 'not_ready' }
  | { outcome: 'blocked' }
  | { outcome: 'error'; error: string };

/**
 * Servicio de rewarded (Fase 1: unidad de prueba de Google). Hay una instancia por lugar
 * (energía / marco) porque en producción tendrán unidades y verificación propias.
 *
 * Reglas que se aplicarán al ofrecerlo (fases siguientes, no acá):
 * - Energía: sólo si la energía no está al máximo; 3 por día UTC, validado en el servidor.
 * - Marco (`frame`): recompensa permanente, idempotente, validada en el servidor.
 * - Nunca para Plus ni Ad-Free (lo garantiza canServe).
 */
export function createRewardedService(deps: {
  placement: RewardedPlacement;
  adUnitId: string | null;
  createRewarded: (adUnitId: string) => FullscreenAdHandle;
  canServe: FullscreenSlotDeps['canServe'];
}) {
  const slot = createFullscreenSlot({
    adUnitId: deps.adUnitId,
    create: deps.createRewarded,
    canServe: deps.canServe,
  });
  return {
    placement: deps.placement,
    preload: slot.preload,
    async show(): Promise<RewardedShowResult> {
      const result = await slot.show();
      if (result.outcome !== 'closed') return result;
      return result.earned
        ? { outcome: 'watched', clientReward: result.earned }
        : { outcome: 'dismissed' };
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

export type RewardedService = ReturnType<typeof createRewardedService>;

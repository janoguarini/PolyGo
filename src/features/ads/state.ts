import { createStore } from 'zustand';

import type { AdsEligibility } from './eligibility';

/**
 * Disponibilidad de anuncios. Es la única fuente que consultan los servicios antes de cargar o
 * mostrar algo.
 *
 * - off:          anuncios apagados en esta build o plataforma (producción, preview, web).
 * - idle:         esperando la elegibilidad del usuario (o excluido): no se hizo nada.
 * - consent:      UMP actualizando o mostrando el formulario.
 * - initializing: mobileAds().initialize() en curso.
 * - ready:        consentimiento OK y SDK inicializado: se pueden cargar y mostrar anuncios.
 * - unavailable:  UMP dice que no se pueden pedir anuncios (canRequestAds = false).
 * - error:        falló UMP o el SDK. La app sigue normal y se reintenta al volver a primer plano.
 */
export type AdsStatus =
  'off' | 'idle' | 'consent' | 'initializing' | 'ready' | 'unavailable' | 'error';

export interface AdsState {
  status: AdsStatus;
  eligibility: AdsEligibility;
  canRequestAds: boolean;
  privacyOptionsRequired: boolean;
  consentStatus: string | null;
  /** Último error (código corto), sólo para diagnóstico. */
  lastError: string | null;
}

export const initialAdsState = (enabled: boolean): AdsState => ({
  status: enabled ? 'idle' : 'off',
  eligibility: 'unknown',
  canRequestAds: false,
  privacyOptionsRequired: false,
  consentStatus: null,
  lastError: null,
});

export type AdsStore = ReturnType<typeof createAdsStore>;

export function createAdsStore(enabled: boolean) {
  return createStore<AdsState>(() => initialAdsState(enabled));
}

/** ¿Se puede cargar o mostrar un anuncio ahora? Consentimiento + SDK + elegibilidad. */
export function adsCanServe(state: AdsState): boolean {
  return state.status === 'ready' && state.eligibility === 'eligible' && state.canRequestAds;
}

export function errorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) return String(error.code);
  if (error instanceof Error) return error.message;
  return 'unknown';
}

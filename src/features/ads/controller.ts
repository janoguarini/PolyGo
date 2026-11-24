import { gatherConsent, openPrivacyOptions } from './consent';
import type { AdsEligibility } from './eligibility';
import { createSdkInitializer } from './sdk';
import { errorCode, type AdsStore } from './state';
import type { AdsNativeAdapter } from './types';

interface ControllerDeps {
  adapter: AdsNativeAdapter;
  store: AdsStore;
  /** ADS_MODE !== 'off' y hay unidades para la plataforma. */
  enabled: boolean;
  /** Se llama cuando el usuario deja de poder recibir anuncios: descartar lo precargado. */
  onStopServing: () => void;
}

/**
 * Orquesta el arranque, en este orden:
 *   elegibilidad confirmada → UMP (consentimiento) → canRequestAds → mobileAds().initialize()
 *
 * Nunca corre para usuarios excluidos (Plus, Ad-Free, sin sesión, sin onboarding): a ellos no se
 * les muestra ni el formulario de UMP ni se inicializa el SDK. Ningún error se propaga: la app sigue
 * funcionando y el estado queda en 'error' o 'unavailable'.
 */
export function createAdsController({ adapter, store, enabled, onStopServing }: ControllerDeps) {
  const sdk = createSdkInitializer(adapter);
  const active = enabled && adapter.supported;
  let run: Promise<void> | null = null;

  const get = () => store.getState();
  const set = (patch: Partial<ReturnType<AdsStore['getState']>>) => store.setState(patch);
  const eligible = () => get().eligibility === 'eligible';

  async function bootstrap(): Promise<void> {
    if (!active) {
      set({ status: 'off' });
      return;
    }
    if (!eligible()) return;

    set({ status: 'consent', lastError: null });
    const outcome = await gatherConsent(adapter);
    if (!outcome.ok) {
      set({ status: 'error', canRequestAds: false, lastError: errorCode(outcome.error) });
      return;
    }
    const consent = outcome.consent;
    set({
      canRequestAds: consent.canRequestAds,
      privacyOptionsRequired: consent.privacyOptionsRequired,
      consentStatus: consent.status,
    });
    if (!consent.canRequestAds) {
      set({ status: 'unavailable' });
      return;
    }
    // Pudo pasar a Plus mientras UMP respondía.
    if (!eligible()) {
      set({ status: 'idle' });
      return;
    }

    set({ status: 'initializing' });
    try {
      await sdk.initialize();
    } catch (error) {
      set({ status: 'error', lastError: errorCode(error) });
      return;
    }
    set({ status: eligible() ? 'ready' : 'idle' });
  }

  function start(): Promise<void> {
    if (!active) {
      set({ status: 'off' });
      return Promise.resolve();
    }
    if (get().status === 'ready' && sdk.initialized) return Promise.resolve();
    run ??= bootstrap().finally(() => {
      run = null;
    });
    return run;
  }

  return {
    get sdkInitialized() {
      return sdk.initialized;
    },

    /** La llama AdsBootstrap cada vez que cambia Plus / Ad-Free / sesión / onboarding. */
    setEligibility(next: AdsEligibility): Promise<void> {
      const previous = get().eligibility;
      if (previous !== next) set({ eligibility: next });
      if (next !== 'eligible') {
        if (previous === 'eligible') onStopServing();
        return run ?? Promise.resolve();
      }
      return start();
    },

    /** Reintento al volver a primer plano: sólo si el último intento falló. */
    retryIfFailed(): Promise<void> {
      return get().status === 'error' && eligible() ? start() : Promise.resolve();
    },

    /** Fila «Privacidad de anuncios» de Ajustes. */
    async openPrivacyOptions(): Promise<boolean> {
      if (!active || !eligible()) return false;
      const outcome = await openPrivacyOptions(adapter);
      if (!outcome.ok) {
        set({ lastError: errorCode(outcome.error) });
        return false;
      }
      const consent = outcome.consent;
      set({
        canRequestAds: consent.canRequestAds,
        privacyOptionsRequired: consent.privacyOptionsRequired,
        consentStatus: consent.status,
      });
      if (!consent.canRequestAds) {
        onStopServing();
        if (get().status === 'ready') set({ status: 'unavailable' });
      } else if (get().status !== 'ready') {
        await start();
      }
      return true;
    },
  };
}

export type AdsController = ReturnType<typeof createAdsController>;

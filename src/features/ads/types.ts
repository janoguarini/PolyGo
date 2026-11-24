/**
 * Contrato entre la lógica de anuncios y el SDK nativo. Sólo `native.ts` conoce
 * react-native-google-mobile-ads; el resto (controlador, servicios, tests) depende de esta interfaz.
 */

export interface ConsentState {
  /** Lo decide UMP: si es false no se pide ningún anuncio. */
  canRequestAds: boolean;
  /** UMP pide ofrecer un acceso para revisar el consentimiento (p. ej. en el EEE). */
  privacyOptionsRequired: boolean;
  /** Estado crudo de UMP (UNKNOWN / REQUIRED / NOT_REQUIRED / OBTAINED), sólo para diagnóstico. */
  status: string;
}

export interface AdReward {
  type: string;
  amount: number;
}

/** Un anuncio de pantalla completa (interstitial o rewarded) ya creado. */
export interface FullscreenAdHandle {
  readonly loaded: boolean;
  load(): void;
  show(): Promise<void>;
  onLoaded(listener: () => void): () => void;
  onError(listener: (error: unknown) => void): () => void;
  onOpened(listener: () => void): () => void;
  onClosed(listener: () => void): () => void;
  /** Sólo rewarded. Es un evento del CLIENTE: nunca acredita nada (ver rewarded.ts). */
  onEarned(listener: (reward: AdReward) => void): () => void;
  destroy(): void;
}

export interface AdsNativeAdapter {
  /** false en web y otras plataformas sin SDK. */
  readonly supported: boolean;
  /** Actualiza la información de consentimiento y muestra el formulario de UMP si hace falta. */
  gatherConsent(): Promise<ConsentState>;
  /** Último estado conocido de UMP, sin pedir nada a la red. */
  getConsentInfo(): Promise<ConsentState>;
  /** Formulario de opciones de privacidad de UMP. */
  showPrivacyOptionsForm(): Promise<ConsentState>;
  /** mobileAds().initialize(). */
  initialize(): Promise<void>;
  createInterstitial(adUnitId: string): FullscreenAdHandle;
  createRewarded(adUnitId: string): FullscreenAdHandle;
}

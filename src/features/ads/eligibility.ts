/**
 * ¿Puede este usuario recibir anuncios? Regla de producto obligatoria:
 *
 *     Plus || Ad-Free  ⇒  ningún anuncio (ni interstitial ni rewarded opcional)
 *
 * Lógica pura y testeable: no toca el SDK, la energía ni la base.
 */

export type AdsEligibility =
  /** Puede recibir anuncios (si además el consentimiento lo permite). */
  | 'eligible'
  /** Nunca recibe anuncios: Plus, Ad-Free, sin sesión, sin onboarding o anuncios apagados. */
  | 'excluded'
  /** Todavía no se sabe (cargando Plus o el perfil): se trata igual que excluido. */
  | 'unknown';

export interface EligibilityInput {
  /** ADS_MODE !== 'off' y la plataforma soporta anuncios. */
  adsEnabled: boolean;
  signedIn: boolean;
  /** undefined mientras el perfil carga. */
  onboarded: boolean | undefined;
  /** undefined mientras get_energy() no respondió (usePlus()). */
  plus: boolean | undefined;
  /** Sin publicidad (o Plus) según el servidor: useEntitlements().noAds. undefined si no se sabe. */
  adFree: boolean | undefined;
}

export function resolveAdsEligibility(input: EligibilityInput): AdsEligibility {
  if (!input.adsEnabled || !input.signedIn) return 'excluded';
  // Un plan pago confirmado excluye aunque falte saber lo otro.
  if (input.plus === true || input.adFree === true) return 'excluded';
  if (input.onboarded === false) return 'excluded';
  if (input.onboarded === undefined || input.plus === undefined || input.adFree === undefined) {
    return 'unknown';
  }
  return 'eligible';
}

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
  /** undefined si no se sabe. Ver useAdFree(): hoy no existe ninguna fuente. */
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

/**
 * Estado Ad-Free del usuario.
 *
 * LIMITACIÓN CONOCIDA (Fase 1): Ad-Free (compra única USD 0,99) todavía no existe. No hay producto
 * en las tiendas, ni compras integradas, ni entitlement en la base (`user_entitlements` sólo acepta
 * 'plus'). Por eso ninguna cuenta puede ser Ad-Free hoy y esta función devuelve `false`, con su
 * propia firma para que la fase de compras la conecte al servidor sin tocar los servicios de
 * anuncios. No inventa ningún entitlement.
 */
export function currentAdFreeStatus(): boolean | undefined {
  return false;
}

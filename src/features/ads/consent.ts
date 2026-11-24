import type { AdsNativeAdapter, ConsentState } from './types';

/**
 * Gestión de UMP (User Messaging Platform). No asume consentimiento: si nada confirma que se
 * pueden pedir anuncios, `canRequestAds` queda en false.
 *
 * UMP no es ATT: decide el consentimiento para publicidad (GDPR y regulaciones de EE. UU.).
 * PolyGo no pide ATT en iOS (decisión de producto), así que no hay IDFA.
 */
export const NO_CONSENT: ConsentState = {
  canRequestAds: false,
  privacyOptionsRequired: false,
  status: 'UNKNOWN',
};

export type ConsentOutcome = { ok: true; consent: ConsentState } | { ok: false; error: unknown };

/**
 * Actualiza el consentimiento y muestra el formulario si UMP lo exige.
 * Si la actualización falla (sin red, por ejemplo), vale lo que UMP recuerde de la sesión
 * anterior: así lo recomienda Google. Si eso también falla, no hay anuncios.
 */
export async function gatherConsent(adapter: AdsNativeAdapter): Promise<ConsentOutcome> {
  try {
    return { ok: true, consent: await adapter.gatherConsent() };
  } catch (error) {
    try {
      const previous = await adapter.getConsentInfo();
      return previous.canRequestAds ? { ok: true, consent: previous } : { ok: false, error };
    } catch {
      return { ok: false, error };
    }
  }
}

/** Formulario de opciones de privacidad (para la fila de Ajustes). */
export async function openPrivacyOptions(adapter: AdsNativeAdapter): Promise<ConsentOutcome> {
  try {
    return { ok: true, consent: await adapter.showPrivacyOptionsForm() };
  } catch (error) {
    return { ok: false, error };
  }
}

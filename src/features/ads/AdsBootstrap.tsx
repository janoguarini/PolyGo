import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { useEntitlements } from '@/features/plus/entitlements';
import { useMyProfile } from '@/features/profile/hooks';

import { resolveAdsEligibility } from './eligibility';
import { adsController, adsEnabled } from './index';

/**
 * Conecta la elegibilidad del usuario con el ciclo de anuncios. No dibuja nada.
 * Se monta sólo si `adsEnabled` (Fase 1: builds de desarrollo en iOS/Android).
 *
 * - Plus y Sin publicidad vienen del servidor (useEntitlements: get_energy / get_entitlements); el
 *   cliente no puede otorgárselos.
 * - Mientras algo no se sabe, no hay anuncios ni formulario de consentimiento.
 */
export function AdsBootstrap() {
  const { session } = useAuth();
  const profile = useMyProfile();
  const entitlements = useEntitlements();
  const plus = entitlements.isPlus;
  // noAds ya combina Plus y Sin publicidad (shared/plus.ts).
  const adFree = entitlements.noAds;
  const signedIn = Boolean(session);
  const onboarded = profile.data
    ? Boolean(profile.data.profile.onboarding_completed_at)
    : undefined;

  const eligibility = resolveAdsEligibility({
    adsEnabled,
    signedIn,
    onboarded: signedIn ? onboarded : undefined,
    plus: signedIn ? plus : undefined,
    adFree: signedIn ? adFree : undefined,
  });

  useEffect(() => {
    void adsController.setEligibility(eligibility);
  }, [eligibility]);

  // Si este componente deja de estar montado, nadie confirma la elegibilidad: no hay anuncios.
  useEffect(() => () => void adsController.setEligibility('unknown'), []);

  // Si UMP o el SDK fallaron (p. ej. sin red), se reintenta al volver a la app.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void adsController.retryIfFailed();
    });
    return () => sub.remove();
  }, []);

  return null;
}

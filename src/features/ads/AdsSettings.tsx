import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Text, spacing, useTheme } from '@/design-system';
import { useStrings } from '@/i18n';

import { ADS_MODE } from './config';
import {
  adsController,
  adsEnabled,
  interstitialAd,
  rewardedEnergyAd,
  rewardedSkinAd,
  useAdsState,
} from './index';
import type { RewardedService } from './rewarded';
import { adsStrings } from './strings';

/**
 * «Privacidad de anuncios»: abre el formulario de opciones de UMP. Sólo aparece cuando UMP indica
 * que hace falta ofrecerlo (p. ej. en el EEE) y el usuario puede recibir anuncios.
 */
export function AdsPrivacyOptionsButton() {
  const t = useStrings(adsStrings);
  const required = useAdsState(
    (s) => s.privacyOptionsRequired && s.eligibility === 'eligible' && s.status !== 'off',
  );
  const [busy, setBusy] = useState(false);
  if (!adsEnabled || !required) return null;
  return (
    <Button
      label={t.privacy}
      variant="secondary"
      loading={busy}
      accessibilityHint={t.privacyHint}
      onPress={() => {
        setBusy(true);
        void adsController.openPrivacyOptions().finally(() => setBusy(false));
      }}
    />
  );
}

/**
 * Panel de prueba de AdMob. Sólo en builds de desarrollo (ADS_MODE 'test'): nunca aparece en
 * preview ni producción. Usa exclusivamente las unidades de prueba de Google y NO acredita nada.
 */
export function AdsDebugPanel() {
  useTheme();
  const t = useStrings(adsStrings);
  const state = useAdsState((s) => s);
  const [message, setMessage] = useState<string | null>(null);
  if (ADS_MODE !== 'test') return null;

  const rewarded = async (service: RewardedService, label: string) => {
    const result = await service.show();
    setMessage(
      result.outcome === 'watched'
        ? t.debugWatched(label)
        : `${label}: ${result.outcome}${'error' in result ? ` (${result.error})` : ''}`,
    );
  };

  return (
    <Card style={styles.card}>
      <Text variant="bodyStrong">{t.debugTitle}</Text>
      <Text variant="caption">
        {t.debugState(
          state.status,
          state.eligibility,
          String(state.canRequestAds),
          state.consentStatus ?? '—',
        )}
        {state.lastError ? ` · error: ${state.lastError}` : ''}
      </Text>
      <View style={styles.row}>
        <Button
          label={t.debugLoad}
          variant="secondary"
          onPress={() => {
            interstitialAd.preload();
            rewardedEnergyAd.preload();
            rewardedSkinAd.preload();
            setMessage(t.debugLoadRequested);
          }}
        />
        <Button
          label="Interstitial"
          variant="secondary"
          onPress={() =>
            void interstitialAd.show().then((r) => setMessage(`Interstitial: ${r.outcome}`))
          }
        />
        <Button
          label={t.debugRewardedEnergy}
          variant="secondary"
          onPress={() => void rewarded(rewardedEnergyAd, t.debugRewardedEnergy)}
        />
        <Button
          label={t.debugRewardedFrame}
          variant="secondary"
          onPress={() => void rewarded(rewardedSkinAd, t.debugRewardedFrame)}
        />
      </View>
      {message ? <Text variant="caption">{message}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});

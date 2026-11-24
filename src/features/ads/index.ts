/**
 * Punto de entrada de anuncios (AdMob, Fase 1: sólo anuncios de prueba y sólo en __DEV__).
 *
 * Las pantallas importan de acá; nunca de react-native-google-mobile-ads directamente.
 * No hay relación con la energía, las lecciones ni las batallas: esos módulos no importan esto.
 */
import { useStore } from 'zustand';

import { ADS_MODE, AD_UNITS } from './config';
import { createAdsController } from './controller';
import { createInterstitialService } from './interstitial';
import { nativeAds } from './native';
import { createRewardedService } from './rewarded';
import { adsCanServe, createAdsStore, type AdsState } from './state';

export const adsEnabled = ADS_MODE !== 'off' && AD_UNITS !== null && nativeAds.supported;

export const adsStore = createAdsStore(adsEnabled);

const canServe = () => adsEnabled && adsCanServe(adsStore.getState());

export const interstitialAd = createInterstitialService({
  adUnitId: AD_UNITS?.interstitial ?? null,
  createInterstitial: nativeAds.createInterstitial,
  canServe,
});

export const rewardedEnergyAd = createRewardedService({
  placement: 'energy',
  adUnitId: AD_UNITS?.rewardedEnergy ?? null,
  createRewarded: nativeAds.createRewarded,
  canServe,
});

export const rewardedSkinAd = createRewardedService({
  placement: 'skin',
  adUnitId: AD_UNITS?.rewardedSkin ?? null,
  createRewarded: nativeAds.createRewarded,
  canServe,
});

export const adsController = createAdsController({
  adapter: nativeAds,
  store: adsStore,
  enabled: adsEnabled,
  onStopServing: () => {
    interstitialAd.discard();
    rewardedEnergyAd.discard();
    rewardedSkinAd.discard();
  },
});

/** Estado de disponibilidad para la UI. */
export function useAdsState<T>(selector: (state: AdsState) => T): T {
  return useStore(adsStore, selector);
}

export { adsCanServe } from './state';
export type { AdsState, AdsStatus } from './state';

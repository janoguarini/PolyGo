/**
 * Único punto de contacto con react-native-google-mobile-ads (iOS / Android).
 * En web se usa native.web.ts (sin SDK).
 */
import mobileAds, {
  AdEventType,
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentPrivacyOptionsRequirementStatus,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  type AdsConsentInfo,
  type AdsConsentInfoOptions,
} from 'react-native-google-mobile-ads';

import { CONSENT_DEBUG } from './consentDebug';
import { REQUEST_OPTIONS, assertTestAdUnit } from './config';
import type { AdReward, AdsNativeAdapter, ConsentState, FullscreenAdHandle } from './types';

function toConsentState(info: AdsConsentInfo): ConsentState {
  return {
    canRequestAds: info.canRequestAds,
    privacyOptionsRequired:
      info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED,
    status: String(info.status),
  };
}

function consentOptions(): AdsConsentInfoOptions {
  const options: AdsConsentInfoOptions = {};
  // Sólo en desarrollo se puede forzar la geografía de UMP para probar el formulario.
  if (__DEV__ && CONSENT_DEBUG.geography) {
    options.debugGeography =
      CONSENT_DEBUG.geography === 'EEA'
        ? AdsConsentDebugGeography.EEA
        : AdsConsentDebugGeography.NOT_EEA;
  }
  if (__DEV__ && CONSENT_DEBUG.testDeviceIdentifiers.length > 0) {
    options.testDeviceIdentifiers = [...CONSENT_DEBUG.testDeviceIdentifiers];
  }
  return options;
}

function wrapInterstitial(ad: InterstitialAd): FullscreenAdHandle {
  return {
    get loaded() {
      return ad.loaded;
    },
    load: () => ad.load(),
    show: () => ad.show(),
    onLoaded: (listener) => ad.addAdEventListener(AdEventType.LOADED, () => listener()),
    onError: (listener) => ad.addAdEventListener(AdEventType.ERROR, (error) => listener(error)),
    onOpened: (listener) => ad.addAdEventListener(AdEventType.OPENED, () => listener()),
    onClosed: (listener) => ad.addAdEventListener(AdEventType.CLOSED, () => listener()),
    // Un interstitial no da recompensa.
    onEarned: () => () => undefined,
    destroy: () => {
      ad.removeAllListeners();
      ad.destroy();
    },
  };
}

function wrapRewarded(ad: RewardedAd): FullscreenAdHandle {
  return {
    get loaded() {
      return ad.loaded;
    },
    load: () => ad.load(),
    show: () => ad.show(),
    onLoaded: (listener) => ad.addAdEventListener(RewardedAdEventType.LOADED, () => listener()),
    onError: (listener) => ad.addAdEventListener(AdEventType.ERROR, (error) => listener(error)),
    onOpened: (listener) => ad.addAdEventListener(AdEventType.OPENED, () => listener()),
    onClosed: (listener) => ad.addAdEventListener(AdEventType.CLOSED, () => listener()),
    onEarned: (listener) =>
      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) =>
        listener({ type: reward.type, amount: reward.amount } satisfies AdReward),
      ),
    destroy: () => {
      ad.removeAllListeners();
      ad.destroy();
    },
  };
}

export const nativeAds: AdsNativeAdapter = {
  supported: true,
  async gatherConsent() {
    await AdsConsent.requestInfoUpdate(consentOptions());
    return toConsentState(await AdsConsent.loadAndShowConsentFormIfRequired());
  },
  async getConsentInfo() {
    return toConsentState(await AdsConsent.getConsentInfo());
  },
  async showPrivacyOptionsForm() {
    return toConsentState(await AdsConsent.showPrivacyOptionsForm());
  },
  async initialize() {
    await mobileAds().initialize();
  },
  createInterstitial(adUnitId) {
    assertTestAdUnit(adUnitId);
    return wrapInterstitial(InterstitialAd.createForAdRequest(adUnitId, REQUEST_OPTIONS));
  },
  createRewarded(adUnitId) {
    assertTestAdUnit(adUnitId);
    return wrapRewarded(RewardedAd.createForAdRequest(adUnitId, REQUEST_OPTIONS));
  },
};

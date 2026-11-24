/** Web: react-native-google-mobile-ads no existe en el navegador. Sin SDK, sin anuncios. */
import type { AdsNativeAdapter } from './types';

const unsupported = () => Promise.reject(new Error('ads_unsupported_platform'));

export const nativeAds: AdsNativeAdapter = {
  supported: false,
  gatherConsent: unsupported,
  getConsentInfo: unsupported,
  showPrivacyOptionsForm: unsupported,
  initialize: unsupported,
  createInterstitial: () => {
    throw new Error('ads_unsupported_platform');
  },
  createRewarded: () => {
    throw new Error('ads_unsupported_platform');
  },
};

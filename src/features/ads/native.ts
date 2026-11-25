/**
 * iOS / Android: usa el SDK de Google sólo si el binario lo trae. Un development build compilado
 * sin react-native-google-mobile-ads (u otro cliente) no debe crashear al abrir: sin módulo, sin
 * anuncios. En web se usa native.web.ts.
 */
import { TurboModuleRegistry } from 'react-native';

import { nativeAds as noAds } from './native.web';
import type { AdsNativeAdapter } from './types';

function loadNativeAds(): AdsNativeAdapter {
  if (TurboModuleRegistry.get('RNGoogleMobileAdsModule') == null) {
    if (__DEV__) console.warn('ads: este binario no trae Google Mobile Ads; anuncios desactivados');
    return noAds;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return (require('./googleAds') as typeof import('./googleAds')).googleAds;
}

export const nativeAds: AdsNativeAdapter = loadNativeAds();

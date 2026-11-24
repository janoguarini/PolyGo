import { Platform } from 'react-native';

/**
 * Configuración central de AdMob (Fase 1: SOLO anuncios de prueba de Google).
 *
 * Reglas de esta fase:
 * - Ningún identificador real de la cuenta de PolyGo vive en el cliente. Los de abajo son los de
 *   prueba oficiales de Google (publisher de ejemplo 3940256099942544).
 * - Los anuncios sólo existen en builds de desarrollo (`__DEV__`). En una build de preview o
 *   producción el SDK no se inicializa ni se pide ningún anuncio: `ADS_MODE === 'off'`.
 * - Los App IDs de prueba están en el config plugin de app.json; acá sólo se documentan.
 *
 * Para reemplazarlos en una fase futura se cambian únicamente este archivo y app.json.
 */

/** 'test' = anuncios de prueba de Google; 'off' = sin SDK ni anuncios. No existe 'live' todavía. */
export type AdsMode = 'test' | 'off';

export const ADS_MODE: AdsMode = __DEV__ ? 'test' : 'off';

/** Publisher de ejemplo de Google: todo ID de prueba oficial empieza así. */
export const GOOGLE_TEST_PUBLISHER = 'ca-app-pub-3940256099942544';

/** App IDs de prueba oficiales (configurados en app.json → plugin react-native-google-mobile-ads). */
export const TEST_APP_IDS = {
  android: 'ca-app-pub-3940256099942544~3347511713',
  ios: 'ca-app-pub-3940256099942544~1458002511',
} as const;

/**
 * Unidades de prueba oficiales de Google (las mismas que exporta `TestIds` de la librería; se
 * copian acá para que la configuración se pueda validar sin cargar el módulo nativo).
 */
const TEST_UNITS = {
  android: {
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
  ios: {
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  },
} as const;

export type AdPlacement = 'interstitial' | 'rewardedEnergy' | 'rewardedSkin';

export function adUnitsFor(platform: string): Record<AdPlacement, string> | null {
  if (platform !== 'android' && platform !== 'ios') return null;
  const units = TEST_UNITS[platform];
  return {
    interstitial: units.interstitial,
    // Energía y marco usan la misma unidad de prueba: la distinción real (y la validación SSV)
    // llega en una fase posterior, con unidades propias.
    rewardedEnergy: units.rewarded,
    rewardedSkin: units.rewarded,
  };
}

/** Unidades para esta plataforma (null en web u otras: ahí no hay anuncios). */
export const AD_UNITS = adUnitsFor(Platform.OS);

/** ¿Es un ID (de app o de unidad) del publisher de prueba de Google? */
export function isGoogleTestId(id: string): boolean {
  return id.startsWith(`${GOOGLE_TEST_PUBLISHER}/`) || id.startsWith(`${GOOGLE_TEST_PUBLISHER}~`);
}

/**
 * Cinturón de seguridad: en Fase 1 nunca se pide un anuncio con un ID que no sea de prueba.
 * Si alguien cambia los IDs de arriba por reales, los servicios se niegan a cargar.
 */
export function assertTestAdUnit(id: string): void {
  if (!isGoogleTestId(id)) {
    throw new Error('ads_non_test_unit_blocked');
  }
}

/**
 * Sin ATT ni seguimiento publicitario personalizado: todo pedido sale como no personalizado
 * (además de lo que decida UMP para cada usuario).
 */
export const REQUEST_OPTIONS = { requestNonPersonalizedAdsOnly: true } as const;

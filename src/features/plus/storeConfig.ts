/**
 * Configuración de la tienda de PolyGo Plus. ÚNICO lugar con identificadores de productos.
 *
 * PENDIENTE DE CONFIRMAR: los productos todavía NO existen en App Store Connect ni en Google Play
 * Console. Estos ids son la propuesta; si al crearlos cambian, se cambian sólo acá y en RevenueCat.
 * Los PRECIOS nunca están en el código: los da la tienda (localizados por país y moneda), así que
 * se pueden cambiar desde App Store Connect / Play Console sin publicar una versión nueva.
 *
 * RevenueCat (dashboard):
 *   Entitlements: 'polygo_pro' (= Plus: los dos planes) y 'ad_free' (la compra única).
 *   Offering actual ("current") con los paquetes $rc_monthly, $rc_annual y $rc_lifetime
 *   (= «Sin publicidad», compra única con el entitlement 'ad_free', NO Plus de por vida).
 */
export const STORE_PRODUCTS = {
  monthly: 'polygo_plus_monthly',
  annual: 'polygo_plus_annual',
  removeAds: 'polygo_remove_ads',
} as const;

/** Paquete de «Sin publicidad» en el offering de RevenueCat (el «Lifetime» estándar). */
export const REMOVE_ADS_PACKAGE = '$rc_lifetime';

/**
 * Claves PÚBLICAS del SDK de RevenueCat (appl_… / goog_…): están pensadas para ir en la app.
 * Sin ellas la tienda queda «no disponible» y la pantalla de Plus lo dice; nada se rompe.
 * Expo sólo inyecta EXPO_PUBLIC_* cuando se accede con la ruta literal completa.
 */
export const REVENUECAT_PUBLIC_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY?.trim() || undefined,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY?.trim() || undefined,
} as const;

/** Enlaces legales que exige la tienda junto al botón de suscripción. */
export const APPLE_STANDARD_EULA =
  'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

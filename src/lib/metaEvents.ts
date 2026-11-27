import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { analyticsAvailable, analyticsEnabled } from './analytics';
import { supabase } from './supabase';

/**
 * Eventos de la app para Meta Ads (SDK de Meta, react-native-fbsdk-next). Tres conversiones:
 *
 * - cuenta creada        → fb_mobile_complete_registration (al terminar el onboarding)
 * - primera lección      → first_lesson_completed (evento propio, una vez por cuenta y teléfono)
 * - compra               → fb_mobile_purchase (logPurchase, con el precio y la moneda de la tienda)
 *
 * Reglas:
 * - Sólo en builds con el plugin (app.config.ts lo agrega con META_APP_ID y META_CLIENT_TOKEN), fuera
 *   de desarrollo (salvo EXPO_PUBLIC_META_DEV=1) y de los tests. Si no, todo esto no hace nada.
 * - Respeta el interruptor de analítica de Ajustes: apagado, no se manda nada (ni la apertura).
 * - No manda email, nombre ni id de la cuenta: sólo el evento y datos del producto.
 * - El IDFA / Advertising ID sólo se activa con la analítica prendida y, en iOS, si la persona
 *   aceptó el aviso de rastreo de Apple (requestTracking, después del onboarding).
 * - Nunca rompe la app: cualquier error se ignora.
 */

type FbSdk = typeof import('react-native-fbsdk-next');

let sdk: FbSdk | null | undefined;
let started = false;

function metaConfigured(): boolean {
  // En desarrollo sólo con EXPO_PUBLIC_META_DEV=1 (perfil development de eas.json), para «Probar eventos».
  if (__DEV__ && process.env.EXPO_PUBLIC_META_DEV !== '1') return false;
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
  return Constants.expoConfig?.extra?.metaEnabled === true;
}

function fb(): FbSdk | null {
  if (sdk !== undefined) return sdk;
  if (!metaConfigured()) {
    sdk = null;
    return sdk;
  }
  try {
    // require diferido: sin el plugin (o en web) ni se carga el módulo nativo.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sdk = require('react-native-fbsdk-next') as FbSdk;
  } catch {
    sdk = null;
  }
  return sdk;
}

/** SDK listo para mandar eventos, o null (sin Meta en esta build, o analítica apagada). */
function ready(): FbSdk | null {
  const m = fb();
  // Sin PostHog en esta build no hay interruptor: Meta sigue. Con PostHog, respeta el opt-out.
  if (!m || (analyticsAvailable() && !analyticsEnabled())) return null;
  if (!started) {
    try {
      m.Settings.initializeSDK();
      started = true;
    } catch {
      return null;
    }
  }
  return m;
}

/**
 * Al abrir la app: inicia el SDK (instalación y apertura, para atribuir) si la analítica está
 * prendida. En iOS el IDFA queda apagado hasta que la persona acepte el aviso de rastreo.
 */
export function initMeta(): void {
  const m = ready();
  if (!m) return;
  try {
    if (Platform.OS === 'android') {
      m.Settings.setAdvertiserIDCollectionEnabled(true);
    } else {
      void syncIosTracking(m, false);
    }
  } catch {
    // Ídem.
  }
}

/** Interruptor de Ajustes: apagado, el SDK deja de mandar eventos automáticos y el id de anuncios. */
export function setMetaEnabled(enabled: boolean): void {
  const m = fb();
  if (!m) return;
  try {
    m.Settings.setAutoLogAppEventsEnabled(enabled);
    m.Settings.setAdvertiserIDCollectionEnabled(enabled && Platform.OS === 'android');
    if (enabled) initMeta();
  } catch {
    // Ídem.
  }
}

async function syncIosTracking(m: FbSdk, ask: boolean): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const att = require('expo-tracking-transparency') as typeof import('expo-tracking-transparency');
  const current = await att.getTrackingPermissionsAsync();
  const granted =
    current.granted ||
    (ask && current.canAskAgain && (await att.requestTrackingPermissionsAsync()).granted);
  await m.Settings.setAdvertiserTrackingEnabled(granted);
  m.Settings.setAdvertiserIDCollectionEnabled(granted);
}

/**
 * iOS: el aviso de Apple «¿Permitir que PolyGo rastree tu actividad?», una sola vez (si ya respondió,
 * iOS no lo vuelve a mostrar). Se llama al terminar el onboarding. En Android no hace nada.
 */
export async function requestTracking(): Promise<void> {
  if (Platform.OS !== 'ios') return;
  const m = ready();
  if (!m) return;
  try {
    await syncIosTracking(m, true);
  } catch {
    // Ídem.
  }
}

/**
 * Cuenta creada: el onboarding terminó (pasa una vez por cuenta). El método (email, google, apple)
 * sale de la sesión de Supabase.
 */
export async function metaRegistration(): Promise<void> {
  const m = ready();
  if (!m) return;
  try {
    const session = await supabase?.auth.getSession();
    const method = session?.data.session?.user.app_metadata.provider as string | undefined;
    const { AppEventsLogger } = m;
    AppEventsLogger.logEvent(
      AppEventsLogger.AppEvents.CompletedRegistration,
      method ? { [AppEventsLogger.AppEventParams.RegistrationMethod]: method } : {},
    );
    AppEventsLogger.flush();
  } catch {
    // Ídem.
  }
}

const firstLessonKey = (userId: string) =>
  `meta_first_lesson_${userId.replace(/[^A-Za-z0-9._-]/g, '')}`;

/**
 * Primera lección terminada. Quien llama decide si es la primera (con el resumen del servidor);
 * acá además se recuerda en el teléfono para no mandarla dos veces.
 */
export async function metaFirstLesson(userId: string, lessonId: string): Promise<void> {
  const m = ready();
  if (!m) return;
  try {
    const key = firstLessonKey(userId);
    if (await SecureStore.getItemAsync(key)) return;
    await SecureStore.setItemAsync(key, '1');
    m.AppEventsLogger.logEvent('first_lesson_completed', { fb_content_id: lessonId });
    m.AppEventsLogger.flush();
  } catch {
    // Ídem.
  }
}

/** Compra confirmada por la tienda (Plus mensual / anual o Sin publicidad). */
export function metaPurchase(purchase: {
  price: number;
  currency: string;
  productId: string;
  kind: 'plus' | 'ad_free';
}): void {
  const m = ready();
  if (!m || !(purchase.price > 0) || !purchase.currency) return;
  try {
    m.AppEventsLogger.logPurchase(purchase.price, purchase.currency, {
      fb_content_id: purchase.productId,
      fb_content_type: purchase.kind === 'plus' ? 'subscription' : 'product',
    });
    m.AppEventsLogger.flush();
  } catch {
    // Ídem.
  }
}

/** Sólo para tests. */
export function __resetMeta(next?: FbSdk | null): void {
  sdk = next;
  started = false;
}

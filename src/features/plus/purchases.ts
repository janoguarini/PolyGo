/**
 * Compras de PolyGo Plus con RevenueCat (react-native-purchases).
 *
 * Reglas:
 * - La identidad es la cuenta PolyGo: el SDK se configura con `appUserID = user.id`, así la
 *   suscripción sigue a la cuenta en cualquier teléfono y se puede restaurar.
 * - El resultado local de una compra NUNCA activa Plus. Después de comprar o restaurar, la app pide
 *   al servidor que sincronice (Edge Function plus-store, que consulta a RevenueCat con su clave
 *   secreta) y vuelve a leer sus derechos (get_entitlements / get_energy). Si el servidor tarda, el
 *   webhook de RevenueCat lo completa igual.
 * - Precios: los de la tienda (localizados). Ver storeConfig.ts.
 * - Sin claves, en web o en Expo Go: «no disponible». Expo Go no trae el módulo nativo y el SDK
 *   mostraría datos simulados, que no se pueden presentar como precios reales.
 */
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Linking, Platform } from 'react-native';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { requireSupabase } from '@/lib/supabase';

import {
  offerErrorReason,
  outcomeOfError,
  type OfferState,
  type PurchaseOutcome,
  type RestoreOutcome,
  type StorePlan,
} from './store';
import { REMOVE_ADS_PACKAGE, REVENUECAT_PUBLIC_KEYS, STORE_PRODUCTS } from './storeConfig';

function publicKey(): string | undefined {
  if (Platform.OS === 'ios') return REVENUECAT_PUBLIC_KEYS.ios;
  if (Platform.OS === 'android') return REVENUECAT_PUBLIC_KEYS.android;
  return undefined;
}

/** ¿Esta build puede comprar? (dispositivo con módulo nativo y claves configuradas). */
export function storeSupported(): boolean {
  return (
    (Platform.OS === 'ios' || Platform.OS === 'android') &&
    Constants.executionEnvironment !== ExecutionEnvironment.StoreClient &&
    Boolean(publicKey())
  );
}

let configuredFor: string | null = null;
let configuring: Promise<void> | null = null;

/**
 * Configura el SDK para la cuenta (o cambia de cuenta). Idempotente; lo llama PurchasesBootstrap al
 * iniciar sesión. Nunca lanza: si falla, las compras quedan «no disponibles» y se reintenta después.
 */
export function identifyPurchaser(userId: string): Promise<void> {
  if (!storeSupported() || configuredFor === userId) return configuring ?? Promise.resolve();
  const previous = configuring ?? Promise.resolve();
  configuring = previous
    .then(async () => {
      if (configuredFor === null) {
        Purchases.configure({ apiKey: publicKey()!, appUserID: userId });
      } else {
        await Purchases.logIn(userId);
      }
      configuredFor = userId;
    })
    .catch((e: unknown) => {
      if (__DEV__) console.warn('RevenueCat: no se pudo configurar', e);
    });
  return configuring;
}

/** Al cerrar sesión: el teléfono deja de estar asociado a la cuenta. */
export async function forgetPurchaser(): Promise<void> {
  if (configuredFor === null) return;
  configuredFor = null;
  try {
    await Purchases.logOut();
  } catch {
    // logOut falla si el usuario ya era anónimo: no importa.
  }
}

function planOf(pkg: PurchasesPackage | null | undefined): StorePlan | null {
  if (!pkg) return null;
  return {
    packageId: pkg.identifier,
    productId: pkg.product.identifier,
    priceString: pkg.product.priceString,
    price: pkg.product.price,
    currencyCode: pkg.product.currencyCode,
    pricePerMonthString: pkg.product.pricePerMonthString ?? null,
  };
}

const packages = new Map<string, PurchasesPackage>();

/** Planes y precios de la tienda para esta cuenta y país. */
export async function getPlusOffer(): Promise<OfferState> {
  if (!storeSupported()) return { status: 'unavailable' };
  try {
    if (configuring) await configuring;
    if (configuredFor === null) return { status: 'unavailable' };
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return { status: 'unavailable' };
    const byProduct = (id: string) =>
      current.availablePackages.find((p) => p.product.identifier === id) ?? null;
    const monthly = current.monthly ?? byProduct(STORE_PRODUCTS.monthly);
    const annual = current.annual ?? byProduct(STORE_PRODUCTS.annual);
    // «Sin publicidad» es el paquete Lifetime del offering (compra única, entitlement ad_free).
    const removeAds =
      current.lifetime ??
      current.availablePackages.find((p) => p.identifier === REMOVE_ADS_PACKAGE) ??
      byProduct(STORE_PRODUCTS.removeAds);
    packages.clear();
    for (const p of [monthly, annual, removeAds]) if (p) packages.set(p.identifier, p);
    const offer = {
      monthly: planOf(monthly),
      annual: planOf(annual),
      removeAds: planOf(removeAds),
    };
    if (!offer.monthly && !offer.annual && !offer.removeAds) return { status: 'unavailable' };
    return { status: 'available', offer };
  } catch (e) {
    // En desarrollo, el motivo real (p. ej. productos que App Store todavía no entrega) sale en la
    // terminal de expo start.
    if (__DEV__) console.warn('RevenueCat getOfferings:', e);
    return { status: 'error', reason: offerErrorReason(e) };
  }
}

/**
 * Pide al servidor que lea la tienda y actualice los derechos de la cuenta. Devuelve lo que el
 * servidor confirmó, o null si no pudo (el webhook lo completará; la app conserva su último estado).
 */
export async function syncEntitlementsWithServer(): Promise<{
  plus: boolean;
  ad_free: boolean;
} | null> {
  try {
    const { data, error } = await requireSupabase().functions.invoke('plus-store', {
      body: { action: 'sync' },
    });
    if (error || !data) return null;
    const r = data as { plus?: unknown; ad_free?: unknown };
    return { plus: r.plus === true, ad_free: r.ad_free === true };
  } catch {
    return null;
  }
}

/**
 * Compra un paquete del offering. `wants` = el derecho que se espera que el servidor confirme.
 */
export async function purchase(
  plan: StorePlan,
  wants: 'plus' | 'ad_free',
): Promise<PurchaseOutcome> {
  const pkg = packages.get(plan.packageId);
  if (!pkg) return 'error';
  try {
    await Purchases.purchasePackage(pkg);
  } catch (e) {
    return outcomeOfError(e);
  }
  const confirmed = await syncEntitlementsWithServer();
  return confirmed?.[wants] ? 'success' : 'confirming';
}

/** Restaurar compras (cambio de teléfono, reinstalación). */
export async function restore(): Promise<RestoreOutcome> {
  if (!storeSupported()) return 'error';
  try {
    if (configuring) await configuring;
    await Purchases.restorePurchases();
  } catch (e) {
    return outcomeOfError(e) === 'offline' ? 'offline' : 'error';
  }
  const confirmed = await syncEntitlementsWithServer();
  if (!confirmed) return 'error';
  return confirmed.plus || confirmed.ad_free ? 'restored' : 'nothing';
}

/** Abre la gestión de la suscripción de la tienda (cancelar, cambiar de plan). */
export async function manageSubscription(): Promise<void> {
  try {
    // Sólo iOS tiene hoja nativa; en Android se abre Google Play.
    if (Platform.OS === 'ios' && storeSupported() && configuredFor !== null) {
      await Purchases.showManageSubscriptions();
      return;
    }
  } catch {
    // Se cae al enlace de la tienda.
  }
  await Linking.openURL(
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/account/subscriptions'
      : 'https://play.google.com/store/account/subscriptions',
  );
}

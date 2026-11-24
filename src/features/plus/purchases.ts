/**
 * Capa de compras de PolyGo Plus.
 *
 * PENDIENTE: todavía no hay un sistema de compras integrado (ni StoreKit / Google Play Billing ni
 * un proveedor como RevenueCat). Hasta entonces estas funciones dicen la verdad: la compra no está
 * disponible. Nunca se otorga Plus desde el cliente: cuando exista la integración, la tienda
 * confirma la compra, un webhook del servidor (con service_role) escribe user_entitlements y la app
 * se entera al releer get_energy(). Ver docs/PLUS.md.
 */

/** Id del producto de suscripción a crear en App Store Connect y Google Play Console. */
export const PLUS_PRODUCT_ID = 'polygo_plus_monthly';

/**
 * Precio objetivo, sólo como referencia mientras no hay tienda. Cuando se integre, se muestra el
 * precio localizado que devuelve la tienda y este valor deja de usarse.
 */
export const PLUS_REFERENCE_PRICE = { amount: 4.99, currency: 'USD' } as const;

export type PlusPlanId = 'monthly' | 'annual';

/**
 * Planes y precios de referencia de la pantalla de Plus (USD). Cuando se integre la tienda, se
 * reemplazan por los precios localizados que devuelva. Productos a crear: polygo_plus_monthly,
 * polygo_plus_annual y polygo_remove_ads (pago único).
 */
export const PLUS_PLANS = {
  monthly: { productId: 'polygo_plus_monthly', amount: 4.99, months: 1 },
  annual: { productId: 'polygo_plus_annual', amount: 34.99, months: 12 },
} as const satisfies Record<PlusPlanId, { productId: string; amount: number; months: number }>;

export const REMOVE_ADS_PRODUCT = { productId: 'polygo_remove_ads', amount: 0.99 } as const;

const cents = (n: number) => Math.round(n * 100) / 100;

/** Lo que muestra el plan anual: precio por mes, % de descuento y ahorro contra pagar mes a mes. */
export function annualDeal() {
  const { monthly, annual } = PLUS_PLANS;
  const fullYear = monthly.amount * annual.months;
  return {
    perMonth: cents(annual.amount / annual.months),
    discountPercent: Math.round((1 - annual.amount / fullYear) * 100),
    savings: cents(fullYear - annual.amount),
  };
}

/** «USD 4,99» / «USD 4.99»: código de moneda adelante, como en la pantalla de Plus. */
export function formatUsd(amount: number, locale: string): string {
  const n = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `USD ${n}`;
}

/** El precio de referencia con el formato del idioma de la interfaz («4,99 USD» / «USD 4.99»). */
export function formatPlusReferencePrice(locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: PLUS_REFERENCE_PRICE.currency,
    currencyDisplay: 'code',
  }).format(PLUS_REFERENCE_PRICE.amount);
}

export type PlusOffer =
  | { status: 'unavailable'; reason: 'store_not_integrated' }
  | { status: 'available'; productId: string; localizedPrice: string };

export async function getPlusOffer(): Promise<PlusOffer> {
  return { status: 'unavailable', reason: 'store_not_integrated' };
}

export class PurchasesUnavailableError extends Error {
  constructor() {
    super('purchases_unavailable');
    this.name = 'PurchasesUnavailableError';
  }
}

/**
 * Inicia la compra en la tienda. Resolver NO significa que el usuario tenga Plus: hay que esperar
 * a que el servidor lo confirme (get_energy().plus).
 */
export async function purchasePlus(): Promise<never> {
  throw new PurchasesUnavailableError();
}

export async function restorePurchases(): Promise<never> {
  throw new PurchasesUnavailableError();
}

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
export const PLUS_REFERENCE_PRICE = 'USD 4,99 por mes';

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

/**
 * Lógica pura de la tienda (sin el SDK, testeable): qué se ofrece, cuánto se ahorra con el anual y
 * cómo se clasifica el resultado de una compra. Los precios siempre son los de la tienda.
 */

export type PlusPlanId = 'monthly' | 'annual';

/** Un producto tal como lo informa la tienda, en la moneda del usuario. */
export interface StorePlan {
  /** Identificador del paquete en RevenueCat (para comprarlo). */
  packageId: string;
  productId: string;
  /** Precio localizado listo para mostrar («US$4.99», «4,99 €», «ARS 4.999»). */
  priceString: string;
  price: number;
  currencyCode: string;
  /** Precio por mes calculado y formateado por la tienda (con el mismo formato que priceString). */
  pricePerMonthString?: string | null;
}

export interface StoreOffer {
  monthly: StorePlan | null;
  annual: StorePlan | null;
  removeAds: StorePlan | null;
}

export type OfferState =
  /** La tienda respondió con al menos un plan. */
  | { status: 'available'; offer: StoreOffer }
  /** Esta build no puede comprar: web, Expo Go o faltan las claves de RevenueCat. */
  | { status: 'unavailable' }
  /**
   * No se pudieron leer los planes. network = sin conexión (se puede reintentar ya); store = la tienda
   * o RevenueCat no entregan los productos (configuración, productos sin aprobar): no es la red.
   */
  | { status: 'error'; reason: 'network' | 'store' };

/**
 * Ahorro del plan anual frente a 12 meses del mensual, con los precios REALES de la tienda. null si
 * no se puede calcular con honestidad (falta un plan, monedas distintas o no hay ahorro).
 */
export function annualSavings(
  monthly: StorePlan | null,
  annual: StorePlan | null,
): { percent: number; perMonth: number } | null {
  if (!monthly || !annual) return null;
  if (monthly.currencyCode !== annual.currencyCode) return null;
  if (!(monthly.price > 0) || !(annual.price > 0)) return null;
  const fullYear = monthly.price * 12;
  const percent = Math.floor((1 - annual.price / fullYear) * 100);
  if (percent <= 0) return null;
  return { percent, perMonth: Math.floor((annual.price / 12) * 100) / 100 };
}

/** Precio por mes del anual en la moneda del usuario (null si no se puede formatear). */
export function formatPerMonth(
  perMonth: number,
  currencyCode: string,
  locale: string,
): string | null {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(
      perMonth,
    );
  } catch {
    return null;
  }
}

export type PurchaseOutcome =
  /** La tienda cobró y el servidor ya confirmó el derecho. */
  | 'success'
  /** La tienda cobró pero el servidor todavía no lo confirmó (webhook en camino): se reintenta solo. */
  | 'confirming'
  /** El usuario cerró la hoja de pago. No es un error. */
  | 'cancelled'
  /** Pago pendiente (p. ej. aprobación familiar o efectivo en Google Play). */
  | 'pending'
  /** Sin conexión con la tienda. */
  | 'offline'
  /** La tienda no permite comprar en este dispositivo o cuenta. */
  | 'not_allowed'
  | 'error';

/** Códigos de error de RevenueCat (PURCHASES_ERROR_CODE) que importan para la UI. */
const ERROR_OUTCOMES: Record<string, PurchaseOutcome> = {
  '1': 'cancelled', // PURCHASE_CANCELLED_ERROR
  '3': 'not_allowed', // PURCHASE_NOT_ALLOWED_ERROR
  '10': 'offline', // NETWORK_ERROR
  '20': 'pending', // PAYMENT_PENDING_ERROR
  '35': 'offline', // OFFLINE_CONNECTION_ERROR
};

/** ¿Error de red (reintentar sirve) o de la tienda / configuración? */
export function offerErrorReason(error: unknown): 'network' | 'store' {
  return outcomeOfError(error) === 'offline' ? 'network' : 'store';
}

/** Clasifica un error lanzado por el SDK de RevenueCat. */
export function outcomeOfError(error: unknown): PurchaseOutcome {
  const e = error as { code?: unknown; userCancelled?: unknown } | null;
  if (e?.userCancelled === true) return 'cancelled';
  const code = e?.code === undefined || e?.code === null ? '' : String(e.code);
  return ERROR_OUTCOMES[code] ?? 'error';
}

export type RestoreOutcome = 'restored' | 'nothing' | 'offline' | 'error';

/**
 * Traduce lo que RevenueCat sabe de un usuario (REST v1, GET /subscribers/{app_user_id}) a lo que
 * guarda user_entitlements (store_sync_entitlements). Código puro, sin red: lo usa la Edge Function
 * plus-store y lo cubren los tests.
 *
 * Seguridad: la Edge Function nunca usa lo que manda la app ni el cuerpo del webhook como verdad.
 * Con el id de la cuenta pide el estado a la API de RevenueCat (con la clave secreta, sólo en el
 * servidor), que a su vez lo validó contra App Store / Google Play.
 *
 * El id de usuario de RevenueCat es el id de la cuenta PolyGo (Purchases.logIn(user.id)): la
 * suscripción sigue a la cuenta en cualquier dispositivo, no al teléfono.
 */

/**
 * Derechos que maneja la tienda. Clave = nombre en user_entitlements; valor = identificador del
 * entitlement en RevenueCat (dashboard → Entitlements). Plus se llama 'polygo_pro' en RevenueCat.
 */
export const STORE_ENTITLEMENTS = {
  plus: 'polygo_pro',
  ad_free: 'ad_free',
} as const;

export type StoreEntitlement = keyof typeof STORE_ENTITLEMENTS;

/** Origen en user_entitlements.source. */
export type StoreSource = 'app_store' | 'play_store' | 'promotional';

/** Una fila para store_sync_entitlements. null = la tienda dice que no lo tiene (o lo revocó). */
export interface StoreGrant {
  source: StoreSource;
  product_id: string;
  starts_at: string | null;
  /** null = sin vencimiento (compra única, p. ej. Sin publicidad). */
  expires_at: string | null;
  will_renew: boolean;
  billing_issue_at: string | null;
  external_id: string | null;
}

export type StoreSnapshot = Record<StoreEntitlement, StoreGrant | null>;

interface RcEntitlement {
  expires_date?: string | null;
  grace_period_expires_date?: string | null;
  product_identifier?: string;
  purchase_date?: string | null;
}

interface RcSubscription {
  store?: string;
  expires_date?: string | null;
  grace_period_expires_date?: string | null;
  unsubscribe_detected_at?: string | null;
  billing_issues_detected_at?: string | null;
  refunded_at?: string | null;
  original_purchase_date?: string | null;
  store_transaction_id?: string | null;
}

interface RcNonSubscription {
  id?: string;
  store?: string;
  purchase_date?: string | null;
  store_transaction_id?: string | null;
}

export interface RcSubscriberResponse {
  subscriber?: {
    entitlements?: Record<string, RcEntitlement>;
    subscriptions?: Record<string, RcSubscription>;
    non_subscriptions?: Record<string, RcNonSubscription[]>;
  };
}

function sourceOf(store: string | undefined): StoreSource | null {
  if (store === 'app_store' || store === 'mac_app_store') return 'app_store';
  if (store === 'play_store') return 'play_store';
  if (store === 'promotional') return 'promotional';
  // Stripe, Amazon, etc.: PolyGo no los vende. No se otorgan en silencio.
  return null;
}

const later = (a: string | null | undefined, b: string | null | undefined) => {
  if (!a) return b ?? null;
  if (!b) return a;
  return Date.parse(a) >= Date.parse(b) ? a : b;
};

/**
 * Estado de cada derecho según RevenueCat. El vencimiento incluye el período de gracia (la tienda
 * sigue dando acceso mientras reintenta el cobro). Un reembolso queda como vencido en la fecha del
 * reembolso: el servidor corta el acceso.
 */
export function snapshotFromRevenueCat(body: RcSubscriberResponse): StoreSnapshot {
  const subscriber = body.subscriber ?? {};
  const entitlements = subscriber.entitlements ?? {};
  const subscriptions = subscriber.subscriptions ?? {};
  const nonSubscriptions = subscriber.non_subscriptions ?? {};
  const out = {} as StoreSnapshot;
  for (const key of Object.keys(STORE_ENTITLEMENTS) as StoreEntitlement[]) {
    const ent = entitlements[STORE_ENTITLEMENTS[key]];
    const productId = ent?.product_identifier;
    if (!ent || !productId) {
      out[key] = null;
      continue;
    }
    const sub = subscriptions[productId];
    const once = nonSubscriptions[productId]?.at(-1);
    const source = sourceOf(sub?.store ?? once?.store);
    if (!source) {
      out[key] = null;
      continue;
    }
    let expiresAt = later(ent.expires_date, ent.grace_period_expires_date);
    if (sub?.refunded_at) {
      expiresAt =
        expiresAt && Date.parse(expiresAt) < Date.parse(sub.refunded_at)
          ? expiresAt
          : sub.refunded_at;
    }
    out[key] = {
      source,
      product_id: productId,
      starts_at: ent.purchase_date ?? null,
      expires_at: expiresAt,
      // Suscripción: se renueva salvo que se haya cancelado o reembolsado. Compra única: no aplica.
      will_renew: Boolean(sub) && !sub?.unsubscribe_detected_at && !sub?.refunded_at,
      billing_issue_at: sub?.billing_issues_detected_at ?? null,
      external_id: sub?.store_transaction_id ?? once?.store_transaction_id ?? once?.id ?? null,
    };
  }
  return out;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** ¿Es un id de cuenta PolyGo? Los anónimos de RevenueCat ($RCAnonymousID:…) no se sincronizan. */
export function isAccountId(id: unknown): id is string {
  return typeof id === 'string' && UUID.test(id);
}

/**
 * Cuentas a sincronizar por un evento del webhook. Del evento sólo se toma A QUIÉN mirar; el estado
 * se vuelve a pedir a la API. En TRANSFER (restaurar compras desde otra cuenta) cambian las dos.
 */
export function accountsInWebhook(body: unknown): string[] {
  const event = (body as { event?: Record<string, unknown> } | null)?.event;
  if (!event || typeof event !== 'object') return [];
  const ids = [
    event.app_user_id,
    event.original_app_user_id,
    ...(Array.isArray(event.aliases) ? event.aliases : []),
    ...(Array.isArray(event.transferred_from) ? event.transferred_from : []),
    ...(Array.isArray(event.transferred_to) ? event.transferred_to : []),
  ];
  return [...new Set(ids.filter(isAccountId).map((id) => id.toLowerCase()))];
}

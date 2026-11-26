// GENERADO por scripts/build-functions.ts desde shared/ (npm run functions:build). No editar.
// shared/storeEntitlements.ts
var STORE_ENTITLEMENTS = {
  plus: "polygo_pro",
  ad_free: "ad_free"
};
function sourceOf(store) {
  if (store === "app_store" || store === "mac_app_store") return "app_store";
  if (store === "play_store") return "play_store";
  if (store === "promotional") return "promotional";
  return null;
}
var later = (a, b) => {
  if (!a) return b ?? null;
  if (!b) return a;
  return Date.parse(a) >= Date.parse(b) ? a : b;
};
function snapshotFromRevenueCat(body) {
  const subscriber = body.subscriber ?? {};
  const entitlements = subscriber.entitlements ?? {};
  const subscriptions = subscriber.subscriptions ?? {};
  const nonSubscriptions = subscriber.non_subscriptions ?? {};
  const out = {};
  for (const key of Object.keys(STORE_ENTITLEMENTS)) {
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
      expiresAt = expiresAt && Date.parse(expiresAt) < Date.parse(sub.refunded_at) ? expiresAt : sub.refunded_at;
    }
    out[key] = {
      source,
      product_id: productId,
      starts_at: ent.purchase_date ?? null,
      expires_at: expiresAt,
      // Suscripción: se renueva salvo que se haya cancelado o reembolsado. Compra única: no aplica.
      will_renew: Boolean(sub) && !sub?.unsubscribe_detected_at && !sub?.refunded_at,
      billing_issue_at: sub?.billing_issues_detected_at ?? null,
      external_id: sub?.store_transaction_id ?? once?.store_transaction_id ?? once?.id ?? null
    };
  }
  return out;
}
var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isAccountId(id) {
  return typeof id === "string" && UUID.test(id);
}
function accountsInWebhook(body) {
  const event = body?.event;
  if (!event || typeof event !== "object") return [];
  const ids = [
    event.app_user_id,
    event.original_app_user_id,
    ...Array.isArray(event.aliases) ? event.aliases : [],
    ...Array.isArray(event.transferred_from) ? event.transferred_from : [],
    ...Array.isArray(event.transferred_to) ? event.transferred_to : []
  ];
  return [...new Set(ids.filter(isAccountId).map((id) => id.toLowerCase()))];
}
export {
  STORE_ENTITLEMENTS,
  accountsInWebhook,
  isAccountId,
  snapshotFromRevenueCat
};

// plus-store: mantiene user_entitlements al día con lo que dice la tienda (RevenueCat).
//
// Dos entradas, una sola regla: el estado SIEMPRE se pide a la API de RevenueCat con la clave
// secreta del servidor; nunca se usa lo que manda la app ni el cuerpo del webhook como verdad.
//
//   POST desde RevenueCat (webhook, cabecera Authorization = REVENUECAT_WEBHOOK_AUTH):
//     del evento sólo se toma QUÉ cuentas mirar (shared/storeEntitlements.ts, accountsInWebhook).
//     Responde 500 si falla, para que RevenueCat reintente.
//   POST desde la app (Authorization = JWT del usuario, {action: 'sync'}):
//     después de comprar o restaurar, para no esperar al webhook. Sólo sincroniza la propia cuenta.
//
// Desplegar con --no-verify-jwt (como learning-session): el webhook no trae un JWT de Supabase. El token de la app se
// valida con auth.getUser, igual que learning-session.
//
// Secretos (Dashboard → Edge Functions → Secrets; NO están configurados todavía):
//   REVENUECAT_SECRET_API_KEY   clave secreta v1 de RevenueCat (sk_…)
//   REVENUECAT_WEBHOOK_AUTH     valor exacto de la cabecera Authorization del webhook
// Sin ellos responde 503 store_not_configured y no toca nada.
import { createClient } from 'npm:@supabase/supabase-js@2';

import { accountsInWebhook, snapshotFromRevenueCat } from './store.generated.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

function secretKey(): string {
  const keys = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (keys) {
    const parsed = JSON.parse(keys) as Record<string, string>;
    if (parsed.default) return parsed.default;
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
}

/** Comparación en tiempo constante (no revela cuántos caracteres coinciden). */
function sameSecret(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

async function fetchSubscriber(appUserId: string, apiKey: string) {
  const res = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
    { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' } },
  );
  if (!res.ok) throw new Error(`revenuecat_${res.status}`);
  return res.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const key = secretKey();
  const rcKey = Deno.env.get('REVENUECAT_SECRET_API_KEY') ?? '';
  const webhookAuth = Deno.env.get('REVENUECAT_WEBHOOK_AUTH') ?? '';
  if (!url || !key || !rcKey || !webhookAuth) {
    console.error('plus-store: faltan secretos (SUPABASE_URL, clave de servicio o RevenueCat)');
    return json({ error: 'store_not_configured' }, 503);
  }
  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const authorization = req.headers.get('Authorization') ?? '';
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }

  const syncAccount = async (userId: string) => {
    const snapshot = snapshotFromRevenueCat(await fetchSubscriber(userId, rcKey));
    const { data, error } = await admin.rpc('store_sync_entitlements', {
      p_user: userId,
      p_snapshot: snapshot,
    });
    if (error) throw new Error(error.message);
    return data as { plus: boolean; ad_free: boolean };
  };

  // Webhook de RevenueCat.
  if (sameSecret(authorization, webhookAuth)) {
    const accounts = accountsInWebhook(body);
    try {
      for (const id of accounts) {
        try {
          await syncAccount(id);
        } catch (e) {
          // Una cuenta borrada no debe trabar los reintentos del resto.
          if (e instanceof Error && e.message === 'user_not_found') continue;
          throw e;
        }
      }
      return json({ ok: true, accounts: accounts.length });
    } catch (e) {
      console.error('plus-store webhook:', e instanceof Error ? e.message : e);
      return json({ error: 'sync_failed' }, 500);
    }
  }

  // La app, con el JWT del usuario.
  const token = authorization.replace(/^Bearer\s+/i, '').trim();
  if (!token) return json({ error: 'unauthorized' }, 401);
  const { data: auth, error: authError } = await admin.auth.getUser(token);
  if (authError || !auth?.user) return json({ error: 'unauthorized' }, 401);
  if ((body as { action?: unknown })?.action !== 'sync') {
    return json({ error: 'invalid_request' }, 400);
  }
  try {
    return json(await syncAccount(auth.user.id));
  } catch (e) {
    console.error('plus-store sync:', e instanceof Error ? e.message : e);
    // La app conserva el último estado confirmado: un fallo acá nunca quita Plus.
    return json({ error: 'sync_failed' }, 502);
  }
});

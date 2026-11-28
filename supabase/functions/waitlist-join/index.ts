// Lista de espera del sitio (polygoidiomas.com). Ver docs/WAITLIST.md.
//
//   GET  → {count}                         total para el contador (redondeado: publicCount)
//   POST → {ok: true, count} | {ok: false, error}
//          JSON {email, locale, consent: true, consentVersion, source?, country?, website}
//          o un formulario común (sin JS): responde 303 de vuelta a la página con #lista-ok / #lista-error.
//
// verify_jwt = false (la llama un sitio estático sin sesión). Escribe con la clave de servicio a través de
// public.waitlist_join(), que es idempotente (un email repetido responde igual que uno nuevo: no se
// revela si ya estaba) y limita las altas por hora por ip_hash.
//
// Secretos: WAITLIST_SALT (obligatorio; sin él responde 503). Opcionales: WAITLIST_MAX_PER_HOUR (5),
// WAITLIST_EXTRA_ORIGINS (orígenes extra para CORS, separados por comas), WAITLIST_SITE_URL
// (a dónde volver después de un envío sin JS; https://polygoidiomas.com).
// Nunca se registran emails ni IP: sólo el resultado.
import { createClient } from 'npm:@supabase/supabase-js@2';

import {
  clientIp,
  isAllowedOrigin,
  isHoneypotFilled,
  parseOrigins,
  parseSignup,
  publicCount,
  safeReturnPath,
} from './validate.ts';

/** El contador se lee de la base como mucho una vez cada 30 s por instancia. */
const COUNT_TTL_MS = 30_000;
let cachedCount: { value: number; at: number } | null = null;

function secretKey(): string {
  const keys = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (keys) {
    const parsed = JSON.parse(keys) as Record<string, string>;
    if (parsed.default) return parsed.default;
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
}

function cors(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = { Vary: 'Origin' };
  if (origin && isAllowedOrigin(origin, parseOrigins(Deno.env.get('WAITLIST_EXTRA_ORIGINS')))) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'content-type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

const log = (outcome: string, extra: Record<string, unknown> = {}) =>
  console.log(JSON.stringify({ message: 'waitlist', outcome, ...extra }));

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

type Admin = ReturnType<typeof createClient>;

async function readCount(admin: Admin): Promise<number | null> {
  if (cachedCount && Date.now() - cachedCount.at < COUNT_TTL_MS) return cachedCount.value;
  const { data, error } = await admin.rpc('waitlist_count');
  if (error) {
    log('count_failed', { code: error.code });
    return cachedCount?.value ?? null;
  }
  cachedCount = { value: Number(data), at: Date.now() };
  return cachedCount.value;
}

/** Cuerpo JSON o de formulario; `form` = true si vino de un <form> sin JS. */
async function readBody(req: Request): Promise<{ body: unknown; form: boolean }> {
  const type = (req.headers.get('content-type') ?? '').toLowerCase();
  if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
    const data = await req.formData().catch(() => null);
    if (!data) return { body: null, form: true };
    const body: Record<string, string> = {};
    for (const [k, v] of data.entries()) if (typeof v === 'string') body[k] = v;
    return { body, form: true };
  }
  return { body: await req.json().catch(() => null), form: false };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const headers = cors(origin);
  const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, 'Content-Type': 'application/json', ...extra },
    });

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', secretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (req.method === 'GET') {
    const count = await readCount(admin);
    if (count == null) return json({ error: 'unavailable' }, 503, { 'Cache-Control': 'no-store' });
    return json({ count: publicCount(count) }, 200, {
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    });
  }
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  // Un navegador siempre manda Origin en un POST: si es de otro sitio, no se acepta (ni con formulario).
  if (origin && !headers['Access-Control-Allow-Origin']) {
    log('forbidden_origin');
    return json({ ok: false, error: 'forbidden_origin' }, 403);
  }

  const { body, form } = await readBody(req);
  const siteUrl = (Deno.env.get('WAITLIST_SITE_URL') ?? 'https://polygoidiomas.com').replace(
    /\/+$/,
    '',
  );
  const back = (ok: boolean) => {
    const ret = safeReturnPath((body as Record<string, unknown> | null)?.return);
    return new Response(null, {
      status: 303,
      headers: { ...headers, Location: `${siteUrl}${ret}#${ok ? 'lista-ok' : 'lista-error'}` },
    });
  };
  const reply = (ok: boolean, payload: Record<string, unknown>, status = 200) =>
    form ? back(ok) : json(payload, status, { 'Cache-Control': 'no-store' });

  if (isHoneypotFilled(body)) {
    log('honeypot');
    const count = await readCount(admin);
    return reply(true, { ok: true, count: publicCount(count ?? 0) });
  }

  const parsed = parseSignup(body);
  if (!parsed.ok) {
    log('rejected', { error: parsed.error });
    return reply(false, { ok: false, error: parsed.error }, 400);
  }

  const salt = Deno.env.get('WAITLIST_SALT');
  if (!salt) {
    log('not_configured');
    return reply(false, { ok: false, error: 'unavailable' }, 503);
  }
  // Sin IP (no debería pasar detrás del gateway), todos comparten el mismo cupo.
  const ip = clientIp((name) => req.headers.get(name)) ?? 'unknown';
  const ipHash = await sha256Hex(`${salt}|${ip}`);
  const maxPerHour = Number.parseInt(Deno.env.get('WAITLIST_MAX_PER_HOUR') ?? '', 10);

  const { signup } = parsed;
  const { data, error } = await admin.rpc('waitlist_join', {
    p_email: signup.email,
    p_locale: signup.locale,
    p_consent_version: signup.consentVersion,
    p_country: signup.country,
    p_source: signup.source,
    p_ip_hash: ipHash,
    p_max_per_hour: Number.isFinite(maxPerHour) && maxPerHour > 0 ? maxPerHour : 5,
  });
  if (error) {
    log('join_failed', { code: error.code });
    // 23514: una restricción de la tabla (no debería pasar: validate.ts es más estricto).
    return error.code === '23514'
      ? reply(false, { ok: false, error: 'invalid_email' }, 400)
      : reply(false, { ok: false, error: 'unavailable' }, 503);
  }

  const result = data as { status: string; count: number };
  cachedCount = { value: Number(result.count), at: Date.now() };
  log(result.status);
  if (result.status === 'rate_limited') {
    return reply(false, { ok: false, error: 'rate_limited' }, 429);
  }
  return reply(true, { ok: true, count: publicCount(Number(result.count)) });
});

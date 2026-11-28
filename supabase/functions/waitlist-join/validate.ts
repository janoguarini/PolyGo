// Validación de la lista de espera (sin dependencias ni APIs de Deno: la usa la Edge Function y la
// prueba Jest, shared/__tests__/waitlistJoin.test.ts). Ver docs/WAITLIST.md.

export const WAITLIST_LOCALES = ['es', 'pt-BR', 'it', 'fr'] as const;
export type WaitlistLocale = (typeof WAITLIST_LOCALES)[number];

export const MAX_EMAIL_LENGTH = 254;
export const MAX_SOURCE_LENGTH = 100;

/**
 * Razonable, no RFC 5322 completo: parte local de hasta 64 caracteres comunes, dominio con al menos
 * un punto, etiquetas sin guiones en los bordes y TLD de letras (2 a 24).
 */
const EMAIL_RE =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

/** Email en minúsculas y sin espacios, o null si no es válido. */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 6 || email.length > MAX_EMAIL_LENGTH) return null;
  const at = email.lastIndexOf('@');
  if (at < 1 || at > 64) return null;
  return EMAIL_RE.test(email) ? email : null;
}

export function normalizeLocale(raw: unknown): WaitlistLocale | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim();
  if (v === 'pt' || v.toLowerCase() === 'pt-br') return 'pt-BR';
  return (WAITLIST_LOCALES as readonly string[]).includes(v) ? (v as WaitlistLocale) : null;
}

/** Código de país ISO de 2 letras en mayúsculas, o null (es opcional: lo inválido se descarta). */
export function normalizeCountry(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(v) ? v : null;
}

/** Origen de la visita: sólo caracteres comunes de utm/dominios, recortado a 100. */
export function normalizeSource(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const v = raw
    .replace(/[^\w.:/@+\- ]/g, '')
    .trim()
    .slice(0, MAX_SOURCE_LENGTH)
    .trim();
  return v.length > 0 ? v : null;
}

export function isValidConsentVersion(raw: unknown): raw is string {
  return typeof raw === 'string' && /^[\w.-]{1,40}$/.test(raw);
}

/** true / "true" / "on" (lo que manda un checkbox en un formulario sin JS). */
export function isConsentGiven(raw: unknown): boolean {
  return raw === true || raw === 'true' || raw === 'on';
}

export interface Signup {
  email: string;
  locale: WaitlistLocale;
  consentVersion: string;
  country: string | null;
  source: string | null;
}

export type SignupError = 'invalid_request' | 'invalid_email' | 'consent_required';

export type ParsedSignup = { ok: true; signup: Signup } | { ok: false; error: SignupError };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * `website` es la trampa para bots (un campo oculto a las personas): si viene con algo, la función
 * responde OK sin guardar nada ni validar el resto.
 */
export function isHoneypotFilled(body: unknown): boolean {
  if (!isRecord(body) || body.website == null) return false;
  return typeof body.website === 'string' ? body.website.trim() !== '' : true;
}

/**
 * Cuerpo del POST: {email, locale, consent: true, consentVersion, source?, country?, website}.
 * El email inválido se informa antes que la falta de consentimiento.
 */
export function parseSignup(body: unknown): ParsedSignup {
  if (!isRecord(body)) return { ok: false, error: 'invalid_request' };
  const b = body;
  const email = normalizeEmail(b.email);
  if (!email) return { ok: false, error: 'invalid_email' };
  if (!isConsentGiven(b.consent)) return { ok: false, error: 'consent_required' };
  const locale = normalizeLocale(b.locale);
  if (!locale || !isValidConsentVersion(b.consentVersion)) {
    return { ok: false, error: 'invalid_request' };
  }
  return {
    ok: true,
    signup: {
      email,
      locale,
      consentVersion: b.consentVersion,
      country: normalizeCountry(b.country),
      source: normalizeSource(b.source),
    },
  };
}

/**
 * Total que se muestra en el sitio: exacto hasta 99 y, desde 100, redondeado hacia abajo a la decena
 * (147 → 140). Nunca exagera y cambia menos seguido (mejor para la caché).
 */
export function publicCount(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  const whole = Math.floor(n);
  return whole < 100 ? whole : Math.floor(whole / 10) * 10;
}

/** Orígenes del sitio que pueden llamar a la función desde el navegador (CORS). */
export const SITE_ORIGINS = ['https://polygoidiomas.com', 'https://www.polygoidiomas.com'];

export function isAllowedOrigin(origin: string | null | undefined, extra: string[] = []): boolean {
  if (!origin) return false;
  if (SITE_ORIGINS.includes(origin) || extra.includes(origin)) return true;
  // Desarrollo: npx serve website/dist y similares.
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(origin);
}

/** Lista separada por comas (WAITLIST_EXTRA_ORIGINS), sin «/» final. */
export function parseOrigins(raw: string | null | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter((s) => /^https?:\/\/[^/\s]+$/.test(s));
}

/**
 * Ruta del sitio a la que volver después de un envío sin JS (campo «return»). Sólo rutas propias
 * ("/", "/pt/", "/blog/…"): nada de «//otro.com», esquemas ni barras invertidas.
 */
export function safeReturnPath(raw: unknown): string {
  if (typeof raw !== 'string') return '/';
  return /^\/(?!\/)[\w\-./]{0,200}$/.test(raw) && !raw.includes('..') ? raw : '/';
}

/** Primera IP de X-Forwarded-For (la del cliente), o X-Real-IP; null si no hay. */
export function clientIp(get: (name: string) => string | null): string | null {
  const forwarded = get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;
  const real = get('x-real-ip')?.trim();
  return real || null;
}

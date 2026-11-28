import {
  clientIp,
  isAllowedOrigin,
  isConsentGiven,
  isHoneypotFilled,
  normalizeCountry,
  normalizeEmail,
  normalizeLocale,
  normalizeSource,
  parseOrigins,
  parseSignup,
  publicCount,
  safeReturnPath,
} from '../../supabase/functions/waitlist-join/validate';

const valid = {
  email: '  Ana.Perez+polygo@Example.COM ',
  locale: 'es',
  consent: true,
  consentVersion: 'waitlist-2026-11-27',
  website: '',
};

describe('lista de espera: validación', () => {
  it('normaliza el email (minúsculas, sin espacios) y rechaza los que no tienen forma de email', () => {
    expect(normalizeEmail(' Ana@Example.com ')).toBe('ana@example.com');
    expect(normalizeEmail('a.b-c_d+e@sub.dominio.com.ar')).toBe('a.b-c_d+e@sub.dominio.com.ar');
    for (const bad of [
      '',
      'ana',
      'ana@',
      '@example.com',
      'ana@example',
      'ana@@example.com',
      'ana example@x.com',
      'ana@-example.com',
      'ana@example.c',
      '.ana@example.com',
      'ana..b@example.com',
      'ana@example.com.',
      '<script>@x.com',
      123,
      null,
      undefined,
    ]) {
      expect(normalizeEmail(bad)).toBeNull();
    }
  });

  it('respeta los largos máximos (254 en total, 64 la parte local)', () => {
    const domain = ['a', 'b', 'c', 'd'].map((c) => c.repeat(60)).join('.') + '.com'; // 247
    expect(normalizeEmail(`${'x'.repeat(64)}@example.com`)).not.toBeNull();
    expect(normalizeEmail(`${'x'.repeat(65)}@example.com`)).toBeNull();
    expect(normalizeEmail(`${'x'.repeat(6)}@${domain}`)).not.toBeNull(); // 254
    expect(normalizeEmail(`${'x'.repeat(7)}@${domain}`)).toBeNull(); // 255
  });

  it('idioma: los cuatro del sitio («pt» y «pt-br» valen como pt-BR); el resto no', () => {
    expect(['es', 'pt-BR', 'it', 'fr'].map(normalizeLocale)).toEqual(['es', 'pt-BR', 'it', 'fr']);
    expect(normalizeLocale('pt')).toBe('pt-BR');
    expect(normalizeLocale('pt-br')).toBe('pt-BR');
    expect(normalizeLocale('en')).toBeNull();
    expect(normalizeLocale(undefined)).toBeNull();
  });

  it('país opcional: 2 letras en mayúsculas o nada; origen recortado a 100 y sin caracteres raros', () => {
    expect(normalizeCountry('ar')).toBe('AR');
    expect(normalizeCountry('ARG')).toBeNull();
    expect(normalizeCountry('')).toBeNull();
    expect(normalizeSource('instagram/lanzamiento')).toBe('instagram/lanzamiento');
    expect(normalizeSource('<b>tiktok</b>"; drop')).toBe('btiktok/b drop');
    expect(normalizeSource('x'.repeat(300))).toHaveLength(100);
    expect(normalizeSource('   ')).toBeNull();
    expect(normalizeSource(42)).toBeNull();
  });

  it('consentimiento: sólo un sí explícito (true, "true" o "on" de un checkbox)', () => {
    expect([true, 'true', 'on'].map(isConsentGiven)).toEqual([true, true, true]);
    expect([false, 'false', '', 1, null, undefined, 'yes'].map(isConsentGiven)).toEqual(
      Array(7).fill(false),
    );
  });

  it('parseSignup: alta válida normalizada', () => {
    expect(parseSignup({ ...valid, country: 'mx', source: 'ig/promo' })).toEqual({
      ok: true,
      signup: {
        email: 'ana.perez+polygo@example.com',
        locale: 'es',
        consentVersion: 'waitlist-2026-11-27',
        country: 'MX',
        source: 'ig/promo',
      },
    });
  });

  it('parseSignup: errores en orden (email, consentimiento, resto)', () => {
    expect(parseSignup({ ...valid, email: 'nope', consent: false })).toEqual({
      ok: false,
      error: 'invalid_email',
    });
    expect(parseSignup({ ...valid, consent: false })).toEqual({
      ok: false,
      error: 'consent_required',
    });
    expect(parseSignup({ ...valid, consent: undefined })).toMatchObject({
      error: 'consent_required',
    });
    expect(parseSignup({ ...valid, locale: 'de' })).toMatchObject({ error: 'invalid_request' });
    expect(parseSignup({ ...valid, consentVersion: '' })).toMatchObject({
      error: 'invalid_request',
    });
    expect(parseSignup({ ...valid, consentVersion: 'a b' })).toMatchObject({
      error: 'invalid_request',
    });
    expect(parseSignup(null)).toMatchObject({ error: 'invalid_request' });
    expect(parseSignup([valid])).toMatchObject({ error: 'invalid_request' });
  });

  it('trampa para bots: cualquier valor en «website»', () => {
    expect(isHoneypotFilled(valid)).toBe(false);
    expect(isHoneypotFilled({ ...valid, website: '   ' })).toBe(false);
    expect(isHoneypotFilled({ email: 'a@b.co' })).toBe(false);
    expect(isHoneypotFilled({ ...valid, website: 'http://spam.example' })).toBe(true);
    expect(isHoneypotFilled({ ...valid, website: 1 })).toBe(true);
    expect(isHoneypotFilled(null)).toBe(false);
  });

  it('contador público: exacto hasta 99 y redondeado hacia abajo a la decena desde 100', () => {
    expect([0, 7, 49, 99, 100, 101, 147, 1239].map(publicCount)).toEqual([
      0, 7, 49, 99, 100, 100, 140, 1230,
    ]);
    expect(publicCount(-3)).toBe(0);
    expect(publicCount(Number.NaN)).toBe(0);
  });

  it('CORS: el dominio del sitio, localhost y los extra configurados', () => {
    expect(isAllowedOrigin('https://polygoidiomas.com')).toBe(true);
    expect(isAllowedOrigin('https://www.polygoidiomas.com')).toBe(true);
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://127.0.0.1:5500')).toBe(true);
    expect(isAllowedOrigin('http://polygoidiomas.com')).toBe(false);
    expect(isAllowedOrigin('https://polygoidiomas.com.evil.io')).toBe(false);
    expect(isAllowedOrigin('http://localhost.evil.io')).toBe(false);
    expect(isAllowedOrigin(null)).toBe(false);
    const extra = parseOrigins(' https://polygoidiomas.netlify.app/ , nada, https://x.io/path');
    expect(extra).toEqual(['https://polygoidiomas.netlify.app']);
    expect(isAllowedOrigin('https://polygoidiomas.netlify.app', extra)).toBe(true);
  });

  it('vuelta después de un envío sin JS: sólo rutas del propio sitio', () => {
    expect(safeReturnPath('/')).toBe('/');
    expect(safeReturnPath('/pt/')).toBe('/pt/');
    expect(safeReturnPath('/blog/aprender-ingles')).toBe('/blog/aprender-ingles');
    for (const bad of ['//evil.com', 'https://evil.com', '/\\evil.com', '/a/../b', 'x', '', 5]) {
      expect(safeReturnPath(bad)).toBe('/');
    }
  });

  it('IP del cliente: la primera de X-Forwarded-For, si no X-Real-IP', () => {
    const h = (map: Record<string, string>) => (name: string) => map[name] ?? null;
    expect(clientIp(h({ 'x-forwarded-for': '203.0.113.9, 10.0.0.1' }))).toBe('203.0.113.9');
    expect(clientIp(h({ 'x-real-ip': ' 198.51.100.2 ' }))).toBe('198.51.100.2');
    expect(clientIp(h({}))).toBeNull();
  });
});

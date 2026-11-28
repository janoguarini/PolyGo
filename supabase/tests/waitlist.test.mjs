// Lista de espera del sitio (migración 20270113120000_waitlist.sql + Edge Function waitlist-join) en
// PGlite. La función real (index.ts) corre en Node contra el emulador de PostgREST (./edge/).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { createDb, as } from './harness.mjs';
import { startEmulator } from './edge/postgrestEmulator.mjs';
import { loadEdgeFunction } from './edge/runEdgeFunction.mjs';

const MIGRATION = '20270113120000_waitlist.sql';
const FUNCTION = fileURLToPath(new URL('../functions/waitlist-join/index.ts', import.meta.url));
const SERVICE_KEY = 'service-key-test';
const ANON_KEY = 'anon-key-test';
const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const VERSION = 'waitlist-2026-11-27';

let db;
let emu;
let handler;
const env = {};

before(async () => {
  db = await createDb({ files: [MIGRATION] });
  emu = await startEmulator(db, { serviceKey: SERVICE_KEY, anonKey: ANON_KEY });
  Object.assign(env, {
    SUPABASE_URL: emu.url,
    SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
    WAITLIST_SALT: 'sal-de-prueba',
  });
  handler = await loadEdgeFunction(FUNCTION, env);
});

after(async () => {
  await emu?.close();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const service = (fn) => as(db, 'service_role', null, fn);
const join = (email, ipHash = null, extra = {}) =>
  service(
    async () =>
      (
        await db.query(
          `select public.waitlist_join(p_email => $1, p_locale => $2, p_consent_version => $3,
           p_country => $4, p_source => $5, p_ip_hash => $6, p_max_per_hour => $7) as r`,
          [
            email,
            extra.locale ?? 'es',
            VERSION,
            extra.country ?? null,
            extra.source ?? null,
            ipHash,
            extra.max ?? 5,
          ],
        )
      ).rows[0].r,
  );
const reset = () => db.exec('truncate public.waitlist_signups');

async function rejects(role, sql, params = []) {
  await assert.rejects(
    as(db, role, null, () => db.query(sql, params)),
    (err) => err.code === '42501',
    `${role} no debería poder: ${sql}`,
  );
}

test('RLS: anon y authenticated no leen, no escriben ni ejecutan las funciones', async () => {
  await reset();
  await join('ana@example.com');
  const rls = await one(
    `select relrowsecurity from pg_class where oid = 'public.waitlist_signups'::regclass`,
  );
  assert.equal(rls.relrowsecurity, true);
  const policies = await one(
    `select count(*)::int n from pg_policies where tablename = 'waitlist_signups'`,
  );
  assert.equal(policies.n, 0, 'sin políticas');
  for (const role of ['anon', 'authenticated']) {
    await rejects(role, 'select * from public.waitlist_signups');
    await rejects(role, 'select count(*) from public.waitlist_signups');
    await rejects(
      role,
      `insert into public.waitlist_signups (email, locale, consent_text_version) values ('x@y.co', 'es', 'v')`,
    );
    await rejects(role, `update public.waitlist_signups set unsubscribed_at = now()`);
    await rejects(role, `delete from public.waitlist_signups`);
    await rejects(role, 'select public.waitlist_count()');
    await rejects(role, `select public.waitlist_join('x@y.co', 'es', 'v')`);
  }
  assert.equal((await one('select count(*)::int n from public.waitlist_signups')).n, 1);
});

test('waitlist_count: sólo cuenta a los que no se dieron de baja', async () => {
  await reset();
  await join('a@example.com');
  await join('b@example.com');
  await join('c@example.com');
  await db.query(
    `update public.waitlist_signups set unsubscribed_at = now() where email = 'b@example.com'`,
  );
  const r = await service(() => db.query('select public.waitlist_count()::int as n'));
  assert.equal(r.rows[0].n, 2);
});

test('email único sin distinguir mayúsculas; un repetido responde «duplicate» y no crea otra fila', async () => {
  await reset();
  assert.deepEqual(await join('  Ana@Example.COM '), { status: 'inserted', count: 1 });
  assert.deepEqual(await join('ana@example.com'), { status: 'duplicate', count: 1 });
  const row = await one('select email, locale, consent_text_version from public.waitlist_signups');
  assert.deepEqual(row, { email: 'ana@example.com', locale: 'es', consent_text_version: VERSION });
  // Ni siquiera service_role puede guardar el mismo email en mayúsculas ni con otra forma.
  await assert.rejects(
    db.query(
      `insert into public.waitlist_signups (email, locale, consent_text_version) values ('ana@example.com', 'it', 'v')`,
    ),
    (err) => err.code === '23505',
  );
  await assert.rejects(
    db.query(
      `insert into public.waitlist_signups (email, locale, consent_text_version) values ('Ana@Example.com', 'it', 'v')`,
    ),
    (err) => err.code === '23514',
  );
});

test('restricciones: idioma, país, origen y forma del email', async () => {
  await reset();
  const bad = [
    ['nope', 'es', null, null],
    ['a@b.co', 'en', null, null],
    ['a@b.co', 'es', 'arg', null],
    ['a@b.co', 'es', null, 'x'.repeat(101)],
  ];
  for (const [email, locale, country, source] of bad) {
    await assert.rejects(
      db.query(
        `insert into public.waitlist_signups (email, locale, country, source, consent_text_version) values ($1, $2, $3, $4, 'v')`,
        [email, locale, country, source],
      ),
      (err) => err.code === '23514',
      `${email} ${locale} ${country} ${source?.length}`,
    );
  }
  const ok = await join('pt@example.com', null, { locale: 'pt-BR', country: 'BR', source: 'ig/x' });
  assert.equal(ok.status, 'inserted');
});

test('baja y vuelta: con un consentimiento nuevo se reactiva', async () => {
  await reset();
  await join('back@example.com');
  await db.query(
    `update public.waitlist_signups set unsubscribed_at = now(), consented_at = now() - interval '10 days'`,
  );
  assert.equal((await join('back@example.com', null, { locale: 'fr' })).status, 'resubscribed');
  const row = await one(
    `select unsubscribed_at, locale, consented_at > now() - interval '1 minute' as fresh from public.waitlist_signups`,
  );
  assert.deepEqual(row, { unsubscribed_at: null, locale: 'fr', fresh: true });
});

test('límite por hora por ip_hash (sólo altas nuevas) y limpieza de ip_hash de más de 24 h', async () => {
  await reset();
  for (let i = 0; i < 5; i++) {
    assert.equal((await join(`r${i}@example.com`, HASH_A)).status, 'inserted');
  }
  const limited = await join('r5@example.com', HASH_A);
  assert.deepEqual(limited, { status: 'rate_limited', count: 5 });
  assert.equal((await join('r5@example.com', HASH_B)).status, 'inserted', 'otra IP sí puede');
  // Pasada la hora, vuelve a poder.
  await db.query(
    `update public.waitlist_signups set created_at = now() - interval '2 hours' where ip_hash = $1`,
    [HASH_A],
  );
  assert.equal((await join('r6@example.com', HASH_A)).status, 'inserted');
  // Más de 24 h: el ip_hash se borra en la próxima alta.
  await db.query(
    `update public.waitlist_signups set created_at = now() - interval '25 hours' where email = 'r0@example.com'`,
  );
  await join('r7@example.com', HASH_B);
  const old = await one(
    `select ip_hash from public.waitlist_signups where email = 'r0@example.com'`,
  );
  assert.equal(old.ip_hash, null);
  const recent = await one(
    `select ip_hash from public.waitlist_signups where email = 'r6@example.com'`,
  );
  assert.equal(recent.ip_hash, HASH_A);
});

// ---------- Edge Function (index.ts real) ----------

const URL_FN = 'http://edge/functions/v1/waitlist-join';
const post = (body, headers = {}) =>
  handler(
    new Request(URL_FN, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://polygoidiomas.com',
        'x-forwarded-for': '203.0.113.7',
        ...headers,
      },
      body: JSON.stringify(body),
    }),
  );
const signup = (email, extra = {}) => ({
  email,
  locale: 'es',
  consent: true,
  consentVersion: VERSION,
  website: '',
  ...extra,
});

test('función: alta, repetido idéntico, CORS y nada de emails en los logs', async () => {
  await reset();
  const logs = [];
  const original = console.log;
  console.log = (...args) => logs.push(args.join(' '));
  let first;
  let again;
  try {
    first = await post(
      signup('Nueva@Example.com', { source: 'instagram/lanzamiento', country: 'ar' }),
    );
    again = await post(signup('nueva@example.com'));
  } finally {
    console.log = original;
  }
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('access-control-allow-origin'), 'https://polygoidiomas.com');
  assert.deepEqual(await first.json(), { ok: true, count: 1 });
  assert.equal(again.status, 200);
  assert.deepEqual(await again.json(), { ok: true, count: 1 }, 'no revela que ya existía');
  const row = await one('select email, source, country, ip_hash from public.waitlist_signups');
  assert.equal(row.email, 'nueva@example.com');
  assert.equal(row.source, 'instagram/lanzamiento');
  assert.equal(row.country, 'AR');
  assert.match(row.ip_hash, /^[0-9a-f]{64}$/);
  assert.ok(!logs.some((l) => /example\.com|203\.0\.113/i.test(l)), logs.join('\n'));
});

test('función: email inválido, sin consentimiento, trampa para bots y origen ajeno', async () => {
  await reset();
  const invalid = await post(signup('nope'));
  assert.equal(invalid.status, 400);
  assert.deepEqual(await invalid.json(), { ok: false, error: 'invalid_email' });
  const noConsent = await post(signup('a@example.com', { consent: false }));
  assert.equal(noConsent.status, 400);
  assert.deepEqual(await noConsent.json(), { ok: false, error: 'consent_required' });
  const bot = await post(signup('bot@example.com', { website: 'http://spam' }));
  assert.equal(bot.status, 200);
  assert.equal((await bot.json()).ok, true);
  const evil = await post(signup('e@example.com'), { origin: 'https://evil.example' });
  assert.equal(evil.status, 403);
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
  assert.equal((await one('select count(*)::int n from public.waitlist_signups')).n, 0);
});

test('función: límite por IP → 429; sin WAITLIST_SALT → 503', async () => {
  await reset();
  const ip = { 'x-forwarded-for': '198.51.100.20' };
  for (let i = 0; i < 5; i++)
    assert.equal((await post(signup(`l${i}@example.com`), ip)).status, 200);
  const limited = await post(signup('l5@example.com'), ip);
  assert.equal(limited.status, 429);
  assert.deepEqual(await limited.json(), { ok: false, error: 'rate_limited' });
  assert.equal(
    (await post(signup('l5@example.com'), { 'x-forwarded-for': '198.51.100.21' })).status,
    200,
  );

  const salt = env.WAITLIST_SALT;
  delete env.WAITLIST_SALT;
  try {
    const r = await post(signup('nosalt@example.com'));
    assert.equal(r.status, 503);
  } finally {
    env.WAITLIST_SALT = salt;
  }
});

test('función: GET da el total redondeado, con caché; OPTIONS responde el preflight', async () => {
  await reset();
  await service(() =>
    db.query(
      `insert into public.waitlist_signups (email, locale, consent_text_version)
       select 'u' || g || '@example.com', 'es', 'v' from generate_series(1, 147) g`,
    ),
  );
  // El total de la prueba anterior quedó en la caché de 30 s de la función: se espera a que expire
  // simulando el paso del tiempo.
  const realNow = Date.now;
  Date.now = () => realNow() + 60_000;
  let res;
  try {
    res = await handler(new Request(URL_FN, { headers: { origin: 'http://localhost:3000' } }));
  } finally {
    Date.now = realNow;
  }
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { count: 140 });
  assert.match(res.headers.get('cache-control'), /max-age=60/);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:3000');

  const pre = await handler(
    new Request(URL_FN, { method: 'OPTIONS', headers: { origin: 'https://polygoidiomas.com' } }),
  );
  assert.equal(pre.status, 204);
  assert.match(pre.headers.get('access-control-allow-methods'), /POST/);
});

test('función: formulario sin JS → 303 de vuelta a la página (y nunca a otro sitio)', async () => {
  await reset();
  const form = (fields) =>
    handler(
      new Request(URL_FN, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          origin: 'https://polygoidiomas.com',
          'x-forwarded-for': '192.0.2.50',
        },
        body: new URLSearchParams(fields).toString(),
      }),
    );
  const base = { locale: 'pt-BR', consentVersion: VERSION, website: '' };
  const ok = await form({ ...base, email: 'form@example.com', consent: 'on', return: '/pt/' });
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get('location'), 'https://polygoidiomas.com/pt/#lista-ok');
  const bad = await form({ ...base, email: 'form2@example.com', return: '//evil.com' });
  assert.equal(bad.status, 303);
  assert.equal(bad.headers.get('location'), 'https://polygoidiomas.com/#lista-error');
  const row = await one('select email, locale from public.waitlist_signups');
  assert.deepEqual(row, { email: 'form@example.com', locale: 'pt-BR' });
});

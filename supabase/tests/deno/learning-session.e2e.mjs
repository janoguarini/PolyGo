// Prueba de punta a punta de la Edge Function learning-session EJECUTADA EN DENO (no una reproducción
// en Node): app (supabase-js, functions.invoke) → emulador del gateway → `deno run index.ts` →
// supabase-js de la función → emulador de GoTrue (/auth/v1/user) y PostgREST (/rest/v1/rpc) →
// PostgreSQL 17 local con el stub de Supabase y TODAS las migraciones.
//
//   DENO_BIN=…/deno.exe node --import tsx supabase/tests/deno/learning-session.e2e.mjs
//
// Deno no es dependencia del proyecto: `npm i deno@2.2.15` en un directorio temporal y pasar su
// deno.exe en DENO_BIN. Clúster desechable (initdb, trust, puerto 55436) en el directorio temporal;
// no toca ninguna base real ni ningún proyecto remoto. Los JWT se firman con un secreto local.
//
// El emulador de PostgREST hace lo que importa para la función: una transacción por pedido, `set local
// role` según el JWT (service_role / authenticated / anon), request.jwt.claim.sub, argumentos por
// nombre y errores {code, message}. No emula filtros de tablas (la función sólo usa rpc).
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createHmac, randomUUID } from 'node:crypto';
import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@supabase/supabase-js';

import { SUPABASE_STUB } from '../harness.mjs';
import { rightAnswer, wrongAnswer } from '../learningHelpers.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const BIN = process.env.PG17_BIN ?? 'C:/Program Files/PostgreSQL/17/bin';
const DENO = process.env.DENO_BIN;
const PORT = process.env.PG17_PORT ?? '55436';
const EMU_PORT = Number(process.env.EMU_PORT ?? '54399');
const MIGRATIONS = join(HERE, '..', '..', 'migrations');
const FUNCTION = join(HERE, '..', '..', 'functions', 'learning-session', 'index.ts');
const DIR = mkdtempSync(join(tmpdir(), 'polygo-deno-e2e-'));
const DATA = join(DIR, 'data');
const env = { ...process.env, PGCLIENTENCODING: 'UTF8' };
const TZ = 'America/Argentina/Buenos_Aires';
const SECRET = 'local-e2e-jwt-secret-not-a-real-key-0123456789';
const OPAQUE_SECRET = 'sb_secret_local_e2e_only';
const EMU = `http://127.0.0.1:${EMU_PORT}`;
/** Cabecera del nivel curricular del cliente (src/lib/clientInfo.ts, fase C.5). */
const CURRICULUM_HEADER = 'x-polygo-curriculum-api';
// DENO_NPM=local (fase C.8.1): resuelve `npm:` desde el node_modules del proyecto, sin red
// (--cached-only). Por defecto, como el Edge Runtime: desde el registro (--node-modules-dir=none), lo
// que descarga los paquetes al DENO_DIR.
const DENO_NPM_FLAGS =
  process.env.DENO_NPM === 'local'
    ? ['--node-modules-dir=manual', '--cached-only']
    : ['--node-modules-dir=none'];

if (!DENO) {
  console.error('Falta DENO_BIN (ruta a deno.exe).');
  process.exit(2);
}

// ---------------------------------------------------------------------------------------------
// PostgreSQL

function run(cmd, args, { detach = false } = {}) {
  const r = spawnSync(
    join(BIN, cmd),
    args,
    detach ? { env, stdio: 'ignore' } : { env, encoding: 'utf8', maxBuffer: 1 << 28 },
  );
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')}\n${r.stderr}`);
  return r.stdout;
}

/** Una conexión nueva (un psql) por llamada, como un pool de PostgREST. */
function psql(sql) {
  return new Promise((resolve) => {
    const p = spawn(
      join(BIN, 'psql.exe'),
      [
        '-p',
        PORT,
        '-U',
        'postgres',
        '-d',
        'polygo',
        '-v',
        'ON_ERROR_STOP=1',
        '-v',
        'VERBOSITY=verbose',
        '-tA',
        '-q',
        '-f',
        '-',
      ],
      { env },
    );
    const out = [];
    const err = [];
    p.stdout.on('data', (d) => out.push(d));
    p.stderr.on('data', (d) => err.push(d));
    p.on('close', (code) =>
      resolve({
        code,
        out: Buffer.concat(out).toString('utf8').split('\r').join('').trim(),
        err: Buffer.concat(err).toString('utf8'),
      }),
    );
    p.stdin.end(sql);
  });
}
async function q(sql) {
  const r = await psql(sql);
  if (r.code !== 0) throw new Error(r.err);
  return r.out;
}
const qj = async (sql) => JSON.parse((await q(sql)) || 'null');
const lit = (s) => `$lit$${s}$lit$`;

// ---------------------------------------------------------------------------------------------
// JWT HS256 (GoTrue y PostgREST locales)

const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
function sign(payload, secret = SECRET) {
  const head = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}`;
  return `${head}.${createHmac('sha256', secret).update(head).digest('base64url')}`;
}
function verify(token) {
  const parts = (token ?? '').split('.');
  if (parts.length !== 3) return null;
  const expect = createHmac('sha256', SECRET).update(`${parts[0]}.${parts[1]}`).digest('base64url');
  if (expect !== parts[2]) return null;
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (typeof claims.exp === 'number' && claims.exp < Date.now() / 1000) return null;
  return claims;
}
const now = () => Math.floor(Date.now() / 1000);
const SERVICE_KEY = sign({ role: 'service_role', iss: 'supabase', iat: now(), exp: now() + 86400 });
const ANON_KEY = sign({ role: 'anon', iss: 'supabase', iat: now(), exp: now() + 86400 });
const userToken = (id, extra = {}) =>
  sign({
    sub: id,
    role: 'authenticated',
    aud: 'authenticated',
    iat: now(),
    exp: now() + 3600,
    ...extra,
  });

// ---------------------------------------------------------------------------------------------
// Emulador: GoTrue /auth/v1/user, PostgREST /rest/v1/rpc/:fn y gateway /functions/v1/:name

const procCache = new Map();
async function procInfo(fn) {
  if (!procCache.has(fn)) {
    const rows = await qj(`select coalesce(jsonb_agg(jsonb_build_object(
        'set', p.proretset, 'void', p.prorettype = 'void'::regtype,
        'names', p.proargnames, 'types', (select jsonb_agg(format_type(t, null)) from unnest(p.proargtypes) t))), '[]')
      from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = ${lit(fn)};`);
    procCache.set(fn, rows);
  }
  return procCache.get(fn);
}

const stats = { rpc: 0, rpcErrors: 0, auth: 0, functions: 0 };
let denoPort = 0;

function roleOf(req) {
  const bearer = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  const claims = verify(bearer);
  if (claims) return claims;
  if (req.headers.apikey === OPAQUE_SECRET || bearer === OPAQUE_SECRET)
    return { role: 'service_role' };
  return null;
}

/**
 * Registro de cada RPC (fase C.8.1): qué nivel curricular recibió (lo que lee
 * request_curriculum_api()) y, para las de candidatos, la respuesta.
 */
const rpcLog = [];
const CANDIDATE_FNS = new Set(['learning_focus_candidates', 'learning_review_candidates']);

async function rpc(fn, args, claims, headers = {}) {
  const entry = { fn, role: claims.role, api: headers[CURRICULUM_HEADER] ?? null, args };
  rpcLog.push(entry);
  const overloads = await procInfo(fn);
  if (overloads.length === 0)
    return [404, { code: 'PGRST202', message: `function ${fn} not found` }];
  const names = Object.keys(args);
  // Como PostgREST: la sobrecarga cuyos parámetros nombrados coinciden con los argumentos.
  const proc =
    overloads.find(
      (o) => (o.names ?? []).length === names.length && names.every((n) => o.names.includes(n)),
    ) ?? overloads.find((o) => names.every((n) => (o.names ?? []).includes(n)));
  if (!proc) return [404, { code: 'PGRST202', message: `no overload of ${fn} for (${names})` }];
  const argSql = names
    .map((n) => {
      const v = args[n];
      const type = proc.types[proc.names.indexOf(n)];
      if (v === null || v === undefined) return `${n} => null::${type}`;
      const text =
        type === 'jsonb' || type === 'json' || typeof v !== 'string' ? JSON.stringify(v) : v;
      return `${n} => ${lit(text)}::${type}`;
    })
    .join(', ');
  const call = `public.${fn}(${argSql})`;
  const select = proc.set
    ? `select coalesce(jsonb_agg(to_jsonb(r)), '[]')::text from ${call} r;`
    : proc.void
      ? `select ${call};`
      : `select coalesce(to_jsonb(${call}), 'null'::jsonb)::text;`;
  const sub = claims.sub ? `set local "request.jwt.claim.sub" = ${lit(claims.sub)};` : '';
  const r = await psql(`begin;
    set local role ${claims.role};
    set local "request.jwt.claims" = ${lit(JSON.stringify(claims))};
    set local "request.headers" = ${lit(JSON.stringify(headers))};
    ${sub}
    ${select}
    commit;`);
  stats.rpc++;
  if (r.code !== 0) {
    stats.rpcErrors++;
    const m = /ERROR:\s+(\w{5}):\s+([^\n\r]*)/.exec(r.err) ?? /ERROR:\s+([^\n\r]*)/.exec(r.err);
    const [code, message] = m && m.length === 3 ? [m[1], m[2]] : ['XX000', m?.[1] ?? r.err];
    return [code === '42501' ? 403 : 400, { code, message, details: null, hint: null }];
  }
  if (proc.void) return [200, null];
  const lines = r.out.split('\n');
  const body = JSON.parse(lines[lines.length - 1]);
  if (CANDIDATE_FNS.has(fn)) entry.body = body;
  return [200, body];
}

const readBody = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });

const emulator = createServer(async (req, res) => {
  const send = (status, body, headers = {}) => {
    res.writeHead(status, { 'content-type': 'application/json', ...headers });
    res.end(body === undefined ? '' : JSON.stringify(body));
  };
  try {
    const url = new URL(req.url, EMU);
    if (url.pathname === '/auth/v1/user' && req.method === 'GET') {
      stats.auth++;
      // GoTrue: exige apikey y un JWT de usuario válido cuyo usuario exista.
      if (!req.headers.apikey) return send(401, { message: 'No API key found in request' });
      const claims = verify((req.headers.authorization ?? '').replace(/^Bearer\s+/i, ''));
      if (!claims || !claims.sub)
        return send(403, {
          code: 403,
          error_code: 'bad_jwt',
          msg: 'invalid JWT: unable to parse or verify signature',
        });
      const u = await qj(
        `select to_jsonb(u) from auth.users u where id = ${lit(claims.sub)}::uuid;`,
      );
      if (!u)
        return send(403, {
          code: 403,
          error_code: 'user_not_found',
          msg: 'User from sub claim in JWT does not exist',
        });
      return send(200, {
        id: u.id,
        aud: 'authenticated',
        role: 'authenticated',
        email: u.email,
        app_metadata: {},
        user_metadata: {},
        created_at: u.created_at,
      });
    }
    const m = /^\/rest\/v1\/rpc\/(\w+)$/.exec(url.pathname);
    if (m && req.method === 'POST') {
      const claims = roleOf(req);
      if (!claims || !['anon', 'authenticated', 'service_role'].includes(claims.role))
        return send(401, { code: 'PGRST301', message: 'JWSError' });
      const raw = (await readBody(req)).toString('utf8');
      // Como PostgREST: todas las cabeceras del pedido (Node ya las da en minúscula) llegan a
      // request.headers (fase C.8.1).
      const [status, body] = await rpc(m[1], raw ? JSON.parse(raw) : {}, claims, req.headers);
      return send(status, body);
    }
    if (url.pathname === '/functions/v1/learning-session') {
      stats.functions++;
      // verify_jwt = false: el gateway no valida el token; lo reenvía tal cual a la función.
      const body = await readBody(req);
      const headers = { ...req.headers };
      delete headers.host;
      delete headers['content-length'];
      const r = await fetch(`http://127.0.0.1:${denoPort}/`, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
      });
      // fetch ya descomprime (Deno.serve comprime con gzip las respuestas grandes): no reenviar la
      // codificación ni el largo del cuerpo comprimido.
      const text = await r.text();
      const out = Object.fromEntries(
        [...r.headers].filter(
          ([k]) => !['content-encoding', 'content-length', 'transfer-encoding'].includes(k),
        ),
      );
      res.writeHead(r.status, out);
      return res.end(text);
    }
    send(404, { message: 'not found' });
  } catch (err) {
    console.error('emulador', err);
    send(500, { message: String(err) });
  }
});

// ---------------------------------------------------------------------------------------------
// Deno

const denoProcs = [];
let denoLog = '';
async function startDeno(extraEnv = {}, port = 8000) {
  const p = spawn(
    DENO,
    // --node-modules-dir=none: como el Edge Runtime, resuelve npm: desde el registro y no desde el
    // node_modules del proyecto (Deno 2 lo usaría al ver el package.json de la raíz).
    ['run', '--no-lock', ...DENO_NPM_FLAGS, '--allow-net', '--allow-env', FUNCTION],
    {
      env: {
        ...process.env,
        DENO_DIR: process.env.DENO_DIR ?? join(tmpdir(), 'polygo-deno-cache'),
        SUPABASE_URL: EMU,
        SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
        SUPABASE_ANON_KEY: ANON_KEY,
        NO_COLOR: '1',
        ...extraEnv,
      },
    },
  );
  p.stdout.on('data', (d) => (denoLog += d));
  p.stderr.on('data', (d) => (denoLog += d));
  denoProcs.push(p);
  for (let i = 0; i < 600; i++) {
    try {
      await fetch(`http://127.0.0.1:${port}/`, { method: 'OPTIONS' });
      denoPort = port;
      return p;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error(`Deno no arrancó:\n${denoLog}`);
}
async function stopDeno(p) {
  p.kill();
  await new Promise((r) => p.once('exit', r));
}

// ---------------------------------------------------------------------------------------------
// Cliente (igual que la app: functions.invoke + payload.error)

/** Como la app: `headers` = cabeceras globales del cliente (C.5: x-polygo-curriculum-api). */
const client = (token, headers = {}) =>
  createClient(EMU, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers } },
  });

async function invoke(token, body, { withClient = true, headers = {} } = {}) {
  const { data, error } = await client(token, headers).functions.invoke('learning-session', {
    body: withClient
      ? { ...body, client: { contract: 2, app_version: '0.1.0', platform: 'android' } }
      : body,
  });
  if (!error) return { status: 200, data };
  const ctx = error.context;
  const payload = ctx?.json ? await ctx.json().catch(() => null) : null;
  return { status: ctx?.status ?? 0, error: payload?.error ?? error.message, payload };
}

// ---------------------------------------------------------------------------------------------
// Escenarios

const results = [];
async function scenario(name, fn) {
  const t0 = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - t0 });
    console.log(`ok   ${name} (${Date.now() - t0} ms)`);
  } catch (err) {
    results.push({ name, ok: false, ms: Date.now() - t0, err: err.message });
    console.log(`FAIL ${name}\n     ${err.stack?.split('\n').slice(0, 6).join('\n     ')}`);
  }
}

const newUser = async (tag) =>
  (
    await q(
      `insert into auth.users (email) values (${lit(`${tag}-${randomUUID()}@e2e.dev`)}) returning id;`,
    )
  ).split('\n')[0];
const snaps = (u, s) =>
  qj(`select public.learning_session_presentations(${lit(u)}::uuid, ${lit(s)}::uuid);`);
const count = async (sql) => Number(await q(sql));
const toAttempt = (s, make = rightAnswer, extra = {}) => ({
  presentation_id: s.presentation_id,
  answer: make(s),
  client_verdict: 'correct',
  response_ms: 1500,
  assists: {},
  ...extra,
});
const energyOf = (u) =>
  q(
    `select coalesce((select units || '@' || anchor_at from public.user_energy where user_id = ${lit(u)}::uuid), 'full');`,
  );
const hashOf = (table, u) =>
  q(
    `select coalesce(md5(string_agg(t::text, '|' order by t::text)), '-') from public.${table} t where user_id = ${lit(u)}::uuid;`,
  );

let firstLesson;
let otherLanguageLesson;
let zhLesson;

/** Lección completa por la función. Devuelve el resultado del envío. */
async function doLesson(u, lesson, make = rightAnswer, sessionId = randomUUID()) {
  const tok = userToken(u);
  const st = await invoke(tok, { action: 'start', session_id: sessionId, lesson_id: lesson });
  assert.equal(st.status, 200, JSON.stringify(st));
  const ss = await snaps(u, sessionId);
  const sub = await invoke(tok, {
    action: 'submit',
    session_id: sessionId,
    lesson_id: lesson,
    started_at: new Date(Date.now() - 120000).toISOString(),
    time_zone: TZ,
    attempts: ss.map((s) => toAttempt(s, make)),
  });
  return { sessionId, start: st, submit: sub, snaps: ss };
}

/** Vence en el v1 todas las palabras estudiadas del usuario y corre su día de lección a ayer. */
async function makeDue(u) {
  await q(`update public.user_word_progress set next_review_at = now() - interval '1 hour',
             last_reviewed_at = now() - interval '2 days' where user_id = ${lit(u)}::uuid;
           update public.user_srs_state set t_last = now() - interval '1 day', last_seen_at = now() - interval '1 day',
             due_at = now() - interval '1 hour', due_effective_at = now() - interval '1 hour' where user_id = ${lit(u)}::uuid;
           update public.learning_sessions set local_date = local_date - 1 where user_id = ${lit(u)}::uuid;`);
}

async function main() {
  const t0 = Date.now();
  run('initdb.exe', ['-D', DATA, '-U', 'postgres', '-A', 'trust', '-E', 'UTF8', '--locale=C']);
  run('pg_ctl.exe', ['-D', DATA, '-o', `-p ${PORT}`, '-l', join(DIR, 'log.txt'), '-w', 'start'], {
    detach: true,
  });
  try {
    run('psql.exe', ['-p', PORT, '-U', 'postgres', '-c', 'create database polygo']);
    const stub = join(DIR, 'stub.sql');
    writeFileSync(stub, SUPABASE_STUB);
    run('psql.exe', [
      '-p',
      PORT,
      '-U',
      'postgres',
      '-d',
      'polygo',
      '-v',
      'ON_ERROR_STOP=1',
      '-q',
      '-f',
      stub,
    ]);
    const files = readdirSync(MIGRATIONS)
      .filter((x) => x.endsWith('.sql'))
      .sort();
    for (const f of files)
      run('psql.exe', [
        '-p',
        PORT,
        '-U',
        'postgres',
        '-d',
        'polygo',
        '-v',
        'ON_ERROR_STOP=1',
        '-q',
        '-1',
        '-f',
        join(MIGRATIONS, f),
      ]);
    console.log(`PG17: ${files.length} migraciones en ${Math.round((Date.now() - t0) / 1000)} s`);
    console.log(`versión: ${await q('select version();')}`);

    // Interruptores tal como los dejan las migraciones (no se fuerzan).
    const flags = await q(`select (select enabled from public.srs_v2_settings) || ',' ||
      (select bool_or(enabled_for_adaptive) from public.mastery_model_versions) || ',' ||
      (select bool_or(enabled_for_display) from public.mastery_model_versions);`);
    assert.equal(flags, 'false,false,false', 'las migraciones dejan todo apagado');

    // Primera lección de A1 de cada idioma: desbloqueada para cualquier cuenta (is_lesson_unlocked).
    const firstOf = (lang) =>
      q(`select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
      where u.language_code = '${lang}' and u.level = 'A1' and l.is_published and u.is_published order by u.position, l.position limit 1;`);
    firstLesson = await firstOf('en');
    otherLanguageLesson = await firstOf('it');
    zhLesson = await firstOf('zh');
    console.log(`lecciones: ${firstLesson} · ${otherLanguageLesson} · ${zhLesson}`);

    await new Promise((r) => emulator.listen(EMU_PORT, '127.0.0.1', r));
    const deno = await startDeno();
    console.log(
      `Deno: ${spawnSync(DENO, ['--version'], { encoding: 'utf8' }).stdout.split('\n')[0]}`,
    );

    await scenarioAuth();
    await scenarioLessons();
    await scenarioBasicReview();
    await scenarioPlus();
    await scenarioRecovery();
    await scenarioIsolation();
    await scenarioCompat();
    await scenarioAdaptive();
    await scenarioCurriculum();
    await stopDeno(deno);
    await scenarioEnvVariants();

    await scenario('H · interruptores apagados al terminar', async () => {
      const f = await q(`select (select enabled from public.srs_v2_settings) || ',' ||
        (select bool_or(enabled_for_adaptive) from public.mastery_model_versions) || ',' ||
        (select bool_or(enabled_for_display) from public.mastery_model_versions) || ',' ||
        (select count(*) from pg_extension where extname = 'pg_cron');`);
      assert.equal(f, 'false,false,false,0');
    });
  } finally {
    for (const p of denoProcs) if (p.exitCode === null) p.kill();
    emulator.close();
    run('pg_ctl.exe', ['-D', DATA, '-m', 'immediate', 'stop']);
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} escenarios correctos · rpc ${stats.rpc} (errores esperados o no: ${stats.rpcErrors}) · getUser ${stats.auth} · invocaciones ${stats.functions} · ${Math.round((Date.now() - t0) / 1000)} s`,
  );
  if (/error|uncaught/i.test(denoLog))
    console.log(`\n--- salida de Deno ---\n${denoLog.slice(-4000)}`);
  process.exit(failed.length ? 1 : 0);
}

// --- Autenticación, método y validación de entrada -------------------------------------------
async function scenarioAuth() {
  const u = await newUser('auth');
  await scenario('B · OPTIONS (CORS) y método no permitido', async () => {
    const o = await fetch(`${EMU}/functions/v1/learning-session`, { method: 'OPTIONS' });
    assert.equal(o.status, 200);
    assert.equal(o.headers.get('access-control-allow-origin'), '*');
    const g = await fetch(`${EMU}/functions/v1/learning-session`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${userToken(u)}` },
    });
    assert.equal(g.status, 405);
  });
  await scenario(
    'B · JWT: sin token, firma falsa, vencido, usuario inexistente, anon → 401',
    async () => {
      const sid = randomUUID();
      const body = { action: 'start', session_id: sid, lesson_id: firstLesson };
      const noTok = await fetch(`${EMU}/functions/v1/learning-session`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      assert.equal(noTok.status, 401);
      assert.equal(
        (
          await invoke(
            sign({ sub: u, role: 'authenticated', exp: now() + 60 }, 'otro-secreto'),
            body,
          )
        ).status,
        401,
      );
      assert.equal((await invoke(userToken(u, { exp: now() - 10 }), body)).status, 401);
      assert.equal((await invoke(userToken(randomUUID()), body)).status, 401);
      // Sin Authorization de usuario, supabase-js manda la anon key: no es un usuario.
      const anon = await invoke(null, body);
      assert.equal(anon.status, 401);
      assert.equal(anon.error, 'unauthorized');
      assert.equal(
        await count(
          `select count(*) from public.exercise_presentations where session_id = '${sid}';`,
        ),
        0,
      );
    },
  );
  await scenario(
    'B · cuerpo inválido: no JSON, session_id inválido, acción desconocida, idioma inválido',
    async () => {
      const tok = userToken(u);
      const raw = await fetch(`${EMU}/functions/v1/learning-session`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok}`, 'content-type': 'application/json' },
        body: '{no json',
      });
      assert.equal(raw.status, 400);
      assert.equal((await raw.json()).error, 'invalid_request');
      assert.equal(
        (await invoke(tok, { action: 'start', session_id: 'x', lesson_id: firstLesson })).error,
        'invalid_request',
      );
      const unk = await invoke(tok, {
        action: 'nope',
        session_id: randomUUID(),
        lesson_id: firstLesson,
      });
      assert.deepEqual([unk.status, unk.error], [400, 'invalid_action']);
      const lang = await invoke(tok, {
        action: 'start_review',
        session_id: randomUUID(),
        language_code: 'ENG',
      });
      assert.deepEqual([lang.status, lang.error], [400, 'invalid_request']);
      const foc = await invoke(tok, {
        action: 'start_review',
        session_id: randomUUID(),
        language_code: 'en',
        focus: { kind: 'x' },
      });
      assert.deepEqual([foc.status, foc.error], [400, 'invalid_request']);
    },
  );
  await scenario(
    'F · permisos: authenticated y anon no pueden llamar las funciones de service_role',
    async () => {
      const sid = randomUUID();
      for (const fn of [
        'learning_start_lesson',
        'record_learning_session',
        'learning_review_answer',
        'learning_session_presentations',
        'learning_route_usage',
        'learning_run_job',
        'learning_retention_sweep',
        'learning_start_basic_review',
        'learning_focus_candidates',
      ]) {
        const info = await procInfo(fn);
        if (info.length === 0) continue;
        const args = Object.fromEntries((info[0].names ?? []).map((n) => [n, null]));
        for (const key of [userToken(u), ANON_KEY]) {
          const r = await fetch(`${EMU}/rest/v1/rpc/${fn}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${key}`,
              apikey: ANON_KEY,
              'content-type': 'application/json',
            },
            body: JSON.stringify(args),
          });
          const b = await r.json();
          assert.equal(
            b.code,
            '42501',
            `${fn} no debe ser ejecutable sin service_role: ${JSON.stringify(b)}`,
          );
        }
      }
      // Las respuestas registradas de un usuario no se leen con el token de otro (RLS / sin grants).
      const other = await newUser('auth-other');
      const { error } = await client(userToken(other)).rpc('learning_session_presentations', {
        p_user: u,
        p_session_id: sid,
      });
      assert.ok(error, 'learning_session_presentations con token de usuario debe fallar');
    },
  );
}

// --- Lecciones ---------------------------------------------------------------------------------
async function scenarioLessons() {
  await scenario(
    'D · lección completa: presentaciones, corrección del servidor, energía, progreso, racha, cliente',
    async () => {
      const u = await newUser('lesson');
      const e0 = await energyOf(u);
      const sid = randomUUID();
      const tok = userToken(u);
      const st1 = await invoke(tok, { action: 'start', session_id: sid, lesson_id: firstLesson });
      assert.equal(st1.status, 200, JSON.stringify(st1));
      assert.ok(st1.data.presentations.length > 0);
      // start es idempotente: las mismas presentaciones.
      const st2 = await invoke(tok, { action: 'start', session_id: sid, lesson_id: firstLesson });
      assert.deepEqual(
        st2.data.presentations.map((p) => p.presentation_id),
        st1.data.presentations.map((p) => p.presentation_id),
      );
      const ss = await snaps(u, sid);
      // El cliente miente (dice «correct» en respuestas incorrectas): manda el servidor.
      const attempts = ss.map((s, i) =>
        toAttempt(s, i === 0 ? wrongAnswer : rightAnswer, { client_verdict: 'correct' }),
      );
      const body = {
        action: 'submit',
        session_id: sid,
        lesson_id: firstLesson,
        started_at: new Date(Date.now() - 90000).toISOString(),
        time_zone: TZ,
        attempts,
      };
      const sub = await invoke(tok, body);
      assert.equal(sub.status, 200, JSON.stringify(sub));
      assert.equal(sub.data.duplicate ?? false, false);
      assert.ok(sub.data.accuracy < 1, `el servidor corrige: ${JSON.stringify(sub.data)}`);
      assert.equal(sub.data.srs, null, 'v2 apagado → srs null');
      const wrongVerdict = await q(
        `select g.verdict from public.exercise_attempt_gradings g where g.session_id = '${sid}' and g.presentation_id = ${ss[0].presentation_id};`,
      );
      assert.equal(wrongVerdict, 'incorrect');
      assert.notEqual(await energyOf(u), e0, 'sin Plus la lección gasta energía');
      assert.equal(
        await count(
          `select count(*) from public.user_lesson_progress where user_id = '${u}' and lesson_id = '${firstLesson}';`,
        ),
        1,
      );
      assert.ok(
        (await count(`select count(*) from public.user_word_progress where user_id = '${u}';`)) > 0,
      );
      assert.equal(
        await count(`select count(*) from public.user_daily_activity where user_id = '${u}';`),
        1,
      );
      assert.equal(
        await q(
          `select route || ',' || contract || ',' || platform from public.learning_session_clients where session_id = '${sid}';`,
        ),
        'lesson_graded,2,android',
      );
      // Reenvío (reintento de red): duplicate, nada se duplica.
      const before = [
        await energyOf(u),
        await hashOf('user_word_progress', u),
        await count(`select count(*) from public.exercise_attempts where session_id = '${sid}';`),
      ];
      const again = await invoke(tok, body);
      assert.equal(again.status, 200);
      assert.equal(again.data.duplicate, true);
      assert.deepEqual(
        [
          await energyOf(u),
          await hashOf('user_word_progress', u),
          await count(`select count(*) from public.exercise_attempts where session_id = '${sid}';`),
        ],
        before,
      );
      // start sobre una sesión ya enviada no reabre nada.
      const reopen = await invoke(tok, {
        action: 'start',
        session_id: sid,
        lesson_id: firstLesson,
      });
      assert.ok(reopen.status === 200 || reopen.status === 409, JSON.stringify(reopen));
    },
  );

  await scenario(
    'D · dos envíos simultáneos de la misma lección (doble toque) → una sola sesión y un gasto',
    async () => {
      const u = await newUser('lesson-dbl');
      const sid = randomUUID();
      const tok = userToken(u);
      await invoke(tok, { action: 'start', session_id: sid, lesson_id: firstLesson });
      const ss = await snaps(u, sid);
      const body = {
        action: 'submit',
        session_id: sid,
        lesson_id: firstLesson,
        started_at: new Date(Date.now() - 90000).toISOString(),
        time_zone: TZ,
        attempts: ss.map((s) => toAttempt(s)),
      };
      const [a, b] = await Promise.all([invoke(tok, body), invoke(tok, body)]);
      assert.deepEqual([a.status, b.status], [200, 200], JSON.stringify([a, b]));
      assert.equal([a.data.duplicate, b.data.duplicate].filter(Boolean).length, 1);
      assert.equal(
        await count(`select count(*) from public.learning_sessions where id = '${sid}';`),
        1,
      );
      assert.equal(
        await count(`select count(*) from public.exercise_attempts where session_id = '${sid}';`),
        ss.length,
      );
      assert.equal(
        await q(`select units from public.user_energy where user_id = '${u}';`),
        String(
          Number(
            await q(`select max_units from public.energy_settings limit 1;`).catch(() => '5'),
          ) - 1,
        ),
      );
    },
  );

  await scenario(
    'D · reglas de la lección: bloqueada, inexistente, sin energía, incompleta, respuesta ajena',
    async () => {
      const u = await newUser('lesson-rules');
      const tok = userToken(u);
      const locked =
        await q(`select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
      where u.language_code = 'en' and u.level = 'A1' and l.is_published and u.is_published order by u.position desc, l.position desc limit 1;`);
      const lk = await invoke(tok, {
        action: 'start',
        session_id: randomUUID(),
        lesson_id: locked,
      });
      assert.deepEqual([lk.status, lk.error], [403, 'lesson_locked']);
      const nf = await invoke(tok, {
        action: 'start',
        session_id: randomUUID(),
        lesson_id: 'no-existe',
      });
      assert.deepEqual([nf.status, nf.error], [404, 'lesson_not_found']);
      // Incompleta: falta una respuesta.
      const sid = randomUUID();
      await invoke(tok, { action: 'start', session_id: sid, lesson_id: firstLesson });
      const ss = await snaps(u, sid);
      const inc = await invoke(tok, {
        action: 'submit',
        session_id: sid,
        lesson_id: firstLesson,
        started_at: new Date(Date.now() - 90000).toISOString(),
        time_zone: TZ,
        attempts: ss.slice(1).map((s) => toAttempt(s)),
      });
      assert.equal(inc.status >= 400, true, JSON.stringify(inc));
      // Sesión de otro usuario: no la ve.
      const other = await newUser('lesson-rules-2');
      const foreign = await invoke(userToken(other), {
        action: 'submit',
        session_id: sid,
        lesson_id: firstLesson,
        started_at: new Date(Date.now() - 90000).toISOString(),
        time_zone: TZ,
        attempts: ss.map((s) => toAttempt(s)),
      });
      assert.equal(foreign.status >= 400, true, JSON.stringify(foreign));
      assert.equal(
        await count(`select count(*) from public.learning_sessions where id = '${sid}';`),
        0,
        'sin registros parciales',
      );
      // Sin energía.
      await q(`insert into public.user_energy (user_id, units, anchor_at) values ('${u}', 0, now())
             on conflict (user_id) do update set units = 0, anchor_at = now();`);
      const sid2 = randomUUID();
      await invoke(tok, { action: 'start', session_id: sid2, lesson_id: firstLesson });
      const ss2 = await snaps(u, sid2);
      const ne = await invoke(tok, {
        action: 'submit',
        session_id: sid2,
        lesson_id: firstLesson,
        started_at: new Date(Date.now() - 90000).toISOString(),
        time_zone: TZ,
        attempts: ss2.map((s) => toAttempt(s)),
      });
      assert.deepEqual([ne.status, ne.error], [402, 'no_energy']);
      assert.equal(
        await count(`select count(*) from public.learning_sessions where id = '${sid2}';`),
        0,
        'sin registros parciales',
      );
    },
  );
}

// --- Repaso básico (SRS v1, v2 apagado) -----------------------------------------------------------
async function reviewUser(tag, { plus = false, lessons = [firstLesson] } = {}) {
  const u = await newUser(tag);
  if (plus)
    await q(
      `insert into public.user_entitlements (user_id, entitlement, source) values ('${u}', 'plus', 'manual');`,
    );
  for (const l of lessons) {
    const r = await doLesson(u, l);
    assert.equal(r.submit.status, 200, JSON.stringify(r.submit));
  }
  await makeDue(u);
  return u;
}

async function answerAllReview(u, sid, make = rightAnswer) {
  const tok = userToken(u);
  const ss = await snaps(u, sid);
  const out = [];
  for (const s of ss) {
    const r = await invoke(tok, {
      action: 'answer_review',
      session_id: sid,
      attempt: { ...toAttempt(s, make), attempt_no: 1 },
    });
    assert.equal(r.status, 200, JSON.stringify(r));
    out.push(r.data);
  }
  return { ss, answers: out };
}

const submitReview = (u, sid, ss, make = rightAnswer) =>
  invoke(userToken(u), {
    action: 'submit_review',
    session_id: sid,
    started_at: new Date(Date.now() - 60000).toISOString(),
    time_zone: TZ,
    attempts: ss.map((s) => toAttempt(s, make)),
  });

async function scenarioBasicReview() {
  await scenario(
    'D · repaso básico: selección v1, presentaciones sin respuesta, corrección, envío, SRS v1, sin energía',
    async () => {
      const u = await reviewUser('basic');
      // Prioridad por errores: una palabra con más errores debe entrar primero.
      const target = await q(
        `select word_id from public.user_word_progress where user_id = '${u}' order by word_id limit 1;`,
      );
      await q(
        `update public.user_word_progress set incorrect_count = 9 where user_id = '${u}' and word_id = '${target}';`,
      );
      const tok = userToken(u);
      const sid = randomUUID();
      const st = await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      assert.equal(st.status, 200, JSON.stringify(st));
      assert.equal(st.data.status, 'ok');
      assert.ok(
        st.data.items.length > 0 && st.data.items.length <= 10,
        `límite 10: ${st.data.items.length}`,
      );
      assert.equal(
        await q(`select source from public.srs_session_plans where session_id = '${sid}';`),
        'basic_review',
      );
      for (const it of st.data.items) {
        assert.equal(it.answered, null);
        assert.equal('answer' in it, false, 'el ítem no trae la respuesta antes de responder');
      }
      const words = st.data.items.flatMap((i) => (i.words ?? [i.word]).map((w) => w.id));
      if (
        await count(
          `select count(*) from public.review_item_candidates('en') r join public.concepts c on c.id = r.concept_id where c.word_id = '${target}';`,
        )
      )
        assert.ok(words.includes(target), 'la palabra con más errores entra');
      const e0 = await energyOf(u);
      const { ss, answers } = await answerAllReview(u, sid, (s) =>
        s.position === 1 ? wrongAnswer(s) : rightAnswer(s),
      );
      assert.equal(answers[0].verdict === 'incorrect' || answers[0].verdict === 'typo', true);
      assert.ok(
        answers.slice(1).every((a) => a.verdict === 'correct'),
        JSON.stringify(answers.map((a) => a.verdict)),
      );
      // Repetir una respuesta: vale la primera.
      const dup = await invoke(tok, {
        action: 'answer_review',
        session_id: sid,
        attempt: { ...toAttempt(ss[1], wrongAnswer), attempt_no: 1 },
      });
      assert.equal(dup.data.duplicate, true);
      assert.equal(dup.data.verdict, 'correct');
      assert.equal(dup.data.matches, false);
      // Repetición de un error (P4): sólo feedback.
      const retry = await invoke(tok, {
        action: 'answer_review',
        session_id: sid,
        attempt: { ...toAttempt(ss[0], rightAnswer), attempt_no: 2 },
      });
      assert.equal(retry.status, 200, JSON.stringify(retry));
      assert.equal(retry.data.attempt_no, 2);
      const noRetry = await invoke(tok, {
        action: 'answer_review',
        session_id: sid,
        attempt: { ...toAttempt(ss[1], rightAnswer), attempt_no: 2 },
      });
      assert.deepEqual([noRetry.status, noRetry.error], [409, 'retry_not_allowed']);
      const v1Before = await hashOf('user_word_progress', u);
      const make = (s) => (s.position === 1 ? wrongAnswer(s) : rightAnswer(s));
      const sub = await submitReview(u, sid, ss, make);
      assert.equal(sub.status, 200, JSON.stringify(sub));
      assert.equal(sub.data.route, 'record_learning_session');
      assert.equal(sub.data.srs, null);
      assert.equal(await energyOf(u), e0, 'el repaso no gasta energía');
      assert.notEqual(await hashOf('user_word_progress', u), v1Before, 'actualiza el SRS v1');
      assert.equal(
        await q(`select kind from public.learning_sessions where id = '${sid}';`),
        'review',
      );
      assert.equal(
        await count(
          `select count(*) from public.exercise_attempt_gradings where session_id = '${sid}';`,
        ),
        ss.length,
      );
      // Reenvío y doble envío.
      const v1After = await hashOf('user_word_progress', u);
      const again = await submitReview(u, sid, ss, make);
      assert.equal(again.data.duplicate, true);
      assert.equal(await hashOf('user_word_progress', u), v1After);
      const closed = await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      assert.deepEqual([closed.status, closed.error], [409, 'session_closed']);
      // Evidencia inmutable.
      const upd = await psql(
        `update public.exercise_attempt_gradings set verdict = 'correct' where session_id = '${sid}';`,
      );
      assert.notEqual(upd.code, 0, 'UPDATE de evidencias rechazado');
    },
  );

  await scenario(
    'D · repaso básico: envío con respuesta distinta a la registrada → 409 answer_mismatch, sin parciales',
    async () => {
      const u = await reviewUser('basic-mm');
      const sid = randomUUID();
      const st = await invoke(userToken(u), {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      assert.equal(st.data.status, 'ok');
      const { ss } = await answerAllReview(u, sid);
      const bad = await submitReview(u, sid, ss, (s) =>
        s.position === 1 ? wrongAnswer(s) : rightAnswer(s),
      );
      assert.deepEqual([bad.status, bad.error], [409, 'answer_mismatch']);
      assert.equal(
        await count(`select count(*) from public.learning_sessions where id = '${sid}';`),
        0,
      );
      const ok = await submitReview(u, sid, ss);
      assert.equal(ok.status, 200, JSON.stringify(ok));
    },
  );

  await scenario(
    'D · dos envíos simultáneos del mismo repaso → uno registra, el otro duplicate',
    async () => {
      const u = await reviewUser('basic-dbl');
      const sid = randomUUID();
      await invoke(userToken(u), {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      const { ss } = await answerAllReview(u, sid);
      const [a, b] = await Promise.all([submitReview(u, sid, ss), submitReview(u, sid, ss)]);
      assert.deepEqual([a.status, b.status], [200, 200], JSON.stringify([a, b]));
      assert.equal([a.data.duplicate, b.data.duplicate].filter(Boolean).length, 1);
      assert.equal(
        await count(`select count(*) from public.exercise_attempts where session_id = '${sid}';`),
        ss.length,
      );
    },
  );

  await scenario(
    'D · dos respuestas simultáneas a la misma presentación → una corrección registrada',
    async () => {
      const u = await reviewUser('basic-ans');
      const sid = randomUUID();
      await invoke(userToken(u), {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      const [s0] = await snaps(u, sid);
      const tok = userToken(u);
      const [a, b] = await Promise.all([
        invoke(tok, {
          action: 'answer_review',
          session_id: sid,
          attempt: { ...toAttempt(s0, rightAnswer), attempt_no: 1 },
        }),
        invoke(tok, {
          action: 'answer_review',
          session_id: sid,
          attempt: { ...toAttempt(s0, wrongAnswer), attempt_no: 1 },
        }),
      ]);
      assert.deepEqual([a.status, b.status], [200, 200], JSON.stringify([a, b]));
      assert.equal(a.data.verdict, b.data.verdict, 'las dos ven la misma corrección');
      assert.equal(
        await count(
          `select count(*) from public.review_presentation_answers where presentation_id = ${s0.presentation_id};`,
        ),
        1,
      );
    },
  );

  await scenario(
    'D · repaso básico: contrato 1 → srs_v2_disabled; sin vencidas → up_to_date; sin contenido → content_unavailable',
    async () => {
      const u = await reviewUser('basic-states');
      const c1 = await invoke(
        userToken(u),
        { action: 'start_review', session_id: randomUUID(), language_code: 'en', time_zone: TZ },
        { withClient: false },
      );
      assert.equal(c1.data.status, 'srs_v2_disabled');
      const fresh = await newUser('basic-none');
      const none = await invoke(userToken(fresh), {
        action: 'start_review',
        session_id: randomUUID(),
        language_code: 'en',
        time_zone: TZ,
      });
      assert.equal(none.data.status, 'up_to_date');
      for (const lang of ['es', 'fr']) {
        const ca = await invoke(userToken(u), {
          action: 'start_review',
          session_id: randomUUID(),
          language_code: lang,
          time_zone: TZ,
        });
        assert.equal(ca.data.status, 'content_unavailable', `${lang}: ${JSON.stringify(ca)}`);
      }
      const xx = await invoke(userToken(u), {
        action: 'start_review',
        session_id: randomUUID(),
        language_code: 'xx',
        time_zone: TZ,
      });
      assert.equal(xx.status, 400);
    },
  );

  await scenario(
    'D · repaso en chino por la función (Han, pinyin, normalización del servidor)',
    async () => {
      const u = await newUser('zh');
      const r = await doLesson(u, zhLesson);
      assert.equal(r.submit.status, 200, JSON.stringify(r.submit));
      await makeDue(u);
      const sid = randomUUID();
      const st = await invoke(userToken(u), {
        action: 'start_review',
        session_id: sid,
        language_code: 'zh',
        time_zone: TZ,
      });
      assert.equal(st.data.status, 'ok', JSON.stringify(st.data).slice(0, 300));
      assert.ok(
        st.data.items.some((i) => /\p{Script=Han}/u.test(JSON.stringify(i))),
        'contenido Han intacto (UTF-8)',
      );
      const { ss, answers } = await answerAllReview(u, sid);
      assert.ok(
        answers.every((a) => a.verdict === 'correct'),
        JSON.stringify(answers.map((a) => [a.verdict, a.response])),
      );
      const sub = await submitReview(u, sid, ss);
      assert.equal(sub.status, 200, JSON.stringify(sub));
      assert.equal(
        await count(`select count(*) from public.exercise_presentations p join public.exercise_item_versions v on v.id = p.item_version_id
       join public.exercise_items i on i.id = v.item_id where p.session_id = '${sid}' and i.language_code <> 'zh';`).catch(
          () => 0,
        ),
        0,
      );
    },
  );
}

// --- Plus ----------------------------------------------------------------------------------------
async function scenarioPlus() {
  await scenario(
    'D · Plus: sin suscripción → 403 plus_required; con Plus, inteligente y por tema sin energía',
    async () => {
      const free = await reviewUser('plus-no');
      const r = await invoke(userToken(free), {
        action: 'start_review',
        session_id: randomUUID(),
        language_code: 'en',
        time_zone: TZ,
        focus: { kind: 'smart' },
      });
      assert.deepEqual([r.status, r.error], [403, 'plus_required']);
      const u = await reviewUser('plus-yes', { plus: true });
      const e0 = await energyOf(u);
      const sid = randomUUID();
      const st = await invoke(userToken(u), {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
        focus: { kind: 'smart' },
      });
      assert.equal(st.status, 200, JSON.stringify(st));
      assert.equal(st.data.status, 'ok', JSON.stringify(st.data).slice(0, 300));
      assert.equal(
        await q(`select source from public.srs_session_plans where session_id = '${sid}';`),
        'focus_review',
      );
      const { ss } = await answerAllReview(u, sid);
      const sub = await submitReview(u, sid, ss);
      assert.equal(sub.status, 200, JSON.stringify(sub));
      assert.equal(await energyOf(u), e0);
      // Por tema: la unidad de la primera lección.
      const unit = await q(`select unit_id from public.lessons where id = '${firstLesson}';`);
      await makeDue(u);
      const sid2 = randomUUID();
      const tp = await invoke(userToken(u), {
        action: 'start_review',
        session_id: sid2,
        language_code: 'en',
        time_zone: TZ,
        focus: { kind: 'topic', unit_id: unit },
      });
      assert.equal(tp.status, 200, JSON.stringify(tp));
      assert.ok(['ok', 'up_to_date'].includes(tp.data.status), tp.data.status);
      // Un session_id de un repaso Plus no se retoma como repaso básico (sin mezclar tipos).
      if (tp.data.status === 'ok') {
        const mix = await invoke(userToken(u), {
          action: 'start_review',
          session_id: sid2,
          language_code: 'en',
          time_zone: TZ,
        });
        assert.deepEqual([mix.status, mix.error], [409, 'session_conflict']);
      }
    },
  );

  await scenario(
    'F · ítem de varios conceptos: sólo se actualizan las palabras target del ítem',
    async () => {
      // Varias lecciones seguidas (cada una desbloquea la siguiente) hasta tener un ítem de varios
      // conceptos con todas sus palabras estudiadas; sus palabras con más errores entran primero.
      const lessons = (
        await q(`select string_agg(l.id, ',' order by u.position, l.position) from public.lessons l
      join public.curriculum_units u on u.id = l.unit_id
      where u.language_code = 'en' and u.level = 'A1' and l.is_published and u.is_published;`)
      ).split(',');
      const u = await newUser('multi');
      let multiItem = null;
      for (const l of lessons.slice(0, 12)) {
        assert.equal((await doLesson(u, l)).submit.status, 200);
        multiItem = await q(`select r.item_id from public.review_item_candidates('en') r
          join public.item_concepts x on x.item_id = r.item_id and x.role = 'target'
          join public.concepts c on c.id = x.concept_id
          where r.dimension = 'vocabulary'
          group by r.item_id
          having count(distinct c.id) > 1 and bool_and(c.word_id is not null and exists (
            select 1 from public.user_word_progress p where p.user_id = '${u}' and p.word_id = c.word_id))
          order by r.item_id limit 1;`);
        if (multiItem) break;
      }
      assert.ok(multiItem, 'hay un ítem de varios conceptos repasable');
      await makeDue(u);
      await q(`update public.user_word_progress p set incorrect_count = 50 from public.item_concepts x
             join public.concepts c on c.id = x.concept_id
             where x.item_id = '${multiItem}' and x.role = 'target' and p.word_id = c.word_id and p.user_id = '${u}';`);
      // El armador elige el ítem de cada palabra por «menos presentado» y la semilla (session_id): se
      // inician repasos nuevos (los anteriores quedan abandonados, como en la app) hasta que uno incluya
      // un ítem de varios conceptos.
      let sid;
      let st;
      let multi = [];
      for (let k = 0; k < 15 && multi.length === 0; k++) {
        sid = randomUUID();
        st = await invoke(userToken(u), {
          action: 'start_review',
          session_id: sid,
          language_code: 'en',
          time_zone: TZ,
        });
        assert.equal(st.data.status, 'ok', JSON.stringify(st.data).slice(0, 200));
        multi = st.data.items.filter((i) => (i.words ?? []).length > 1);
      }
      const before = await qj(
        `select jsonb_object_agg(word_id, seen_count) from public.user_word_progress where user_id = '${u}';`,
      );
      const { ss } = await answerAllReview(u, sid);
      const sub = await submitReview(u, sid, ss);
      assert.equal(sub.status, 200, JSON.stringify(sub));
      const after = await qj(
        `select jsonb_object_agg(word_id, seen_count) from public.user_word_progress where user_id = '${u}';`,
      );
      const targets = new Set(
        await qj(`select coalesce(jsonb_agg(distinct c.word_id), '[]') from public.exercise_presentations p
        join public.exercise_item_versions v on v.id = p.item_version_id
        join public.item_concepts x on x.item_id = v.item_id and x.role = 'target'
        join public.concepts c on c.id = x.concept_id where p.session_id = '${sid}' and c.word_id is not null;`),
      );
      for (const [w, n] of Object.entries(after)) {
        if (targets.has(w)) assert.equal(n, (before[w] ?? 0) + 1, `target ${w} +1 una sola vez`);
        else assert.equal(n, before[w], `no target ${w} sin cambios`);
      }
      console.log(
        `     (ítems de varios conceptos en el repaso: ${multi.length}; palabras target: ${targets.size})`,
      );
      assert.ok(multi.length > 0, 'el repaso incluye al menos un ítem de varios conceptos');
    },
  );
}

// --- Recuperación ----------------------------------------------------------------------------------
async function scenarioRecovery() {
  await scenario(
    'D · sesión interrumpida: retomar con el mismo id devuelve las respuestas ya corregidas',
    async () => {
      const u = await reviewUser('resume');
      const tok = userToken(u);
      const sid = randomUUID();
      const st = await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      const ss = await snaps(u, sid);
      await invoke(tok, {
        action: 'answer_review',
        session_id: sid,
        attempt: { ...toAttempt(ss[0]), attempt_no: 1 },
      });
      // «Se cortó la conexión»: la app vuelve a pedir start_review con el mismo id.
      const back = await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      assert.equal(back.data.duplicate, true);
      assert.deepEqual(
        back.data.items.map((i) => i.presentation_id),
        st.data.items.map((i) => i.presentation_id),
      );
      assert.ok(back.data.items[0].answered, 'la primera ya está corregida');
      assert.ok(back.data.items.slice(1).every((i) => i.answered === null));
      for (const s of ss.slice(1))
        await invoke(tok, {
          action: 'answer_review',
          session_id: sid,
          attempt: { ...toAttempt(s), attempt_no: 1 },
        });
      assert.equal((await submitReview(u, sid, ss)).status, 200);
    },
  );

  await scenario(
    'D · cambio de día: sesión de ayer → session_expired; completa se envía; incompleta no admite respuestas',
    async () => {
      const u = await reviewUser('expire');
      const tok = userToken(u);
      const sid = randomUUID();
      await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      const ss = await snaps(u, sid);
      await invoke(tok, {
        action: 'answer_review',
        session_id: sid,
        attempt: { ...toAttempt(ss[0]), attempt_no: 1 },
      });
      await q(
        `update public.srs_session_plans set local_date = local_date - 1 where session_id = '${sid}';`,
      );
      const ex = await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      assert.equal(ex.data.status, 'session_expired');
      assert.equal(ex.data.complete, false);
      if (ss.length > 1) {
        const late = await invoke(tok, {
          action: 'answer_review',
          session_id: sid,
          attempt: { ...toAttempt(ss[1]), attempt_no: 1 },
        });
        assert.deepEqual([late.status, late.error], [409, 'session_expired']);
      }
      // Una abandonada no bloquea un repaso nuevo.
      const sid2 = randomUUID();
      const fresh = await invoke(tok, {
        action: 'start_review',
        session_id: sid2,
        language_code: 'en',
        time_zone: TZ,
      });
      assert.equal(fresh.status, 200, JSON.stringify(fresh));
      // Completa y vencida: se puede enviar.
      const u2 = await reviewUser('expire-complete');
      const sid3 = randomUUID();
      await invoke(userToken(u2), {
        action: 'start_review',
        session_id: sid3,
        language_code: 'en',
        time_zone: TZ,
      });
      const { ss: ss3 } = await answerAllReview(u2, sid3);
      await q(
        `update public.srs_session_plans set local_date = local_date - 1 where session_id = '${sid3}';`,
      );
      const ex3 = await invoke(userToken(u2), {
        action: 'start_review',
        session_id: sid3,
        language_code: 'en',
        time_zone: TZ,
      });
      assert.deepEqual([ex3.data.status, ex3.data.complete], ['session_expired', true]);
      assert.equal((await submitReview(u2, sid3, ss3)).status, 200);
    },
  );

  await scenario(
    'D · cambio de zona horaria al retomar: manda la zona registrada al iniciar',
    async () => {
      const u = await reviewUser('tz');
      const tok = userToken(u);
      const sid = randomUUID();
      await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: TZ,
      });
      const back = await invoke(tok, {
        action: 'start_review',
        session_id: sid,
        language_code: 'en',
        time_zone: 'Pacific/Kiritimati',
      });
      assert.equal(back.status, 200, JSON.stringify(back));
      assert.ok(['ok', 'session_expired'].includes(back.data.status));
      assert.equal(
        await q(
          `select time_zone from public.srs_session_plans where session_id = '${sid}';`,
        ).catch(() => TZ),
        TZ,
      );
      const bogus = await invoke(tok, {
        action: 'start_review',
        session_id: randomUUID(),
        language_code: 'en',
        time_zone: 'No/Such_Zone',
      });
      assert.ok(
        bogus.status === 200 || bogus.status === 400 || bogus.status === 422,
        JSON.stringify(bogus),
      );
      assert.notEqual(bogus.status, 500, 'una zona inválida no es un error del servidor');
    },
  );
}

// --- Aislamiento --------------------------------------------------------------------------------------
async function scenarioIsolation() {
  await scenario(
    'F · idiomas y usuarios aislados: un repaso en italiano no toca el inglés ni a otro usuario',
    async () => {
      const u = await reviewUser('iso', { lessons: [firstLesson] });
      assert.equal((await doLesson(u, otherLanguageLesson)).submit.status, 200);
      await makeDue(u);
      const other = await reviewUser('iso-other');
      const enBefore =
        await q(`select md5(string_agg(p::text, '|' order by p.word_id)) from public.user_word_progress p join public.words w on w.id = p.word_id
       where p.user_id = '${u}' and w.language_code = 'en';`);
      const otherBefore = [
        await hashOf('user_word_progress', other),
        await hashOf('user_energy', other),
        await hashOf('user_daily_activity', other),
      ];
      const sid = randomUUID();
      const st = await invoke(userToken(u), {
        action: 'start_review',
        session_id: sid,
        language_code: 'it',
        time_zone: TZ,
      });
      assert.equal(st.data.status, 'ok');
      assert.ok(
        st.data.items.every((i) => (i.words ?? [i.word]).every((w) => w.language_code === 'it')),
        'sólo palabras italianas',
      );
      const { ss } = await answerAllReview(u, sid);
      assert.equal((await submitReview(u, sid, ss)).status, 200);
      const enAfter =
        await q(`select md5(string_agg(p::text, '|' order by p.word_id)) from public.user_word_progress p join public.words w on w.id = p.word_id
       where p.user_id = '${u}' and w.language_code = 'en';`);
      assert.equal(enAfter, enBefore, 'el inglés no cambia');
      assert.deepEqual(
        [
          await hashOf('user_word_progress', other),
          await hashOf('user_energy', other),
          await hashOf('user_daily_activity', other),
        ],
        otherBefore,
      );
      // Otro usuario no puede responder ni enviar la sesión de u.
      const ans = await invoke(userToken(other), {
        action: 'answer_review',
        session_id: sid,
        attempt: { ...toAttempt(ss[0]), attempt_no: 1 },
      });
      assert.ok(ans.status >= 400, JSON.stringify(ans));
      const sub = await submitReview(other, sid, ss);
      assert.ok(sub.status >= 400 || sub.data.duplicate !== true, JSON.stringify(sub));
      assert.equal(await q(`select user_id from public.learning_sessions where id = '${sid}';`), u);
    },
  );

  await scenario(
    'F · errores del servidor no dejan registros parciales (plan manipulado / sesión inexistente)',
    async () => {
      const u = await reviewUser('partial');
      const sid = randomUUID();
      const sub = await invoke(userToken(u), {
        action: 'submit_review',
        session_id: sid,
        started_at: new Date().toISOString(),
        time_zone: TZ,
        attempts: [],
      });
      assert.ok(sub.status >= 400, JSON.stringify(sub));
      assert.notEqual(sub.status, 500);
      assert.equal(
        await count(`select count(*) from public.learning_sessions where id = '${sid}';`),
        0,
      );
      const ans = await invoke(userToken(u), {
        action: 'answer_review',
        session_id: sid,
        attempt: { presentation_id: 1, answer: { kind: 'text', value: 'x' }, response_ms: 1 },
      });
      assert.ok(ans.status >= 400 && ans.status !== 500, JSON.stringify(ans));
    },
  );
}

// --- Compatibilidad con builds publicadas -------------------------------------------------------------
async function scenarioCompat() {
  await scenario(
    'I · ruta vieja (submit_learning_session por PostgREST con el JWT del usuario): lecciones siguen, repasos → legacy_review_retired',
    async () => {
      const u = await newUser('legacy');
      const db = client(userToken(u));
      // Lo que manda una build publicada: un intento por ejercicio con su palabra y el veredicto local.
      const ex =
        await qj(`select coalesce(jsonb_agg(jsonb_build_object('id', e.id, 'answer', e.answer,
        'word_id', (select min(w.word_id) from public.exercise_words w where w.exercise_id = e.id)) order by e.position), '[]')
       from public.exercises e where e.lesson_id = '${firstLesson}' and e.is_published;`);
      const sid = randomUUID();
      const args = {
        p_session_id: sid,
        p_kind: 'lesson',
        p_lesson_id: firstLesson,
        p_started_at: new Date(Date.now() - 120000).toISOString(),
        p_time_zone: TZ,
        p_attempts: ex.map((e) => ({
          exercise_id: e.id,
          word_id: e.word_id,
          answer: e.answer,
          correct: true,
          first_try: true,
          response_ms: 1500,
        })),
      };
      const { data, error } = await db.rpc('submit_learning_session', args);
      assert.equal(error, null, JSON.stringify(error));
      assert.equal(data.duplicate ?? false, false);
      const again = await db.rpc('submit_learning_session', args);
      assert.equal(again.data.duplicate, true);
      // Repaso viejo (lo arma la app vieja): retirado a propósito desde
      // 20261112120000_retire_legacy_review_route.sql → legacy_review_retired, sin escribir nada.
      await makeDue(u);
      const w = await q(
        `select word_id from public.user_word_progress where user_id = '${u}' limit 1;`,
      );
      // Todas las tablas con user_id (sesiones, intentos, correcciones, SRS v1/v2, energía, racha,
      // logros, evidencias…) y todas las que tienen session_id, para comprobar que el rechazo no deja nada.
      const userTables = (
        await q(`select table_name from information_schema.columns
         where table_schema = 'public' and column_name = 'user_id'
           and table_name in (select table_name from information_schema.tables
                              where table_schema = 'public' and table_type = 'BASE TABLE')
         order by table_name;`)
      )
        .split('\n')
        .filter(Boolean);
      const sessionTables = (
        await q(`select table_name from information_schema.columns
         where table_schema = 'public' and column_name = 'session_id'
           and table_name in (select table_name from information_schema.tables
                              where table_schema = 'public' and table_type = 'BASE TABLE')
         order by table_name;`)
      )
        .split('\n')
        .filter(Boolean);
      assert.ok(
        ['learning_sessions', 'exercise_attempts', 'user_word_progress'].every((t) =>
          userTables.includes(t),
        ),
        userTables.join(','),
      );
      const footprint = async () =>
        Object.fromEntries(await Promise.all(userTables.map(async (t) => [t, await hashOf(t, u)])));
      const before = await footprint();
      const rvSession = randomUUID();
      const rv = await db.rpc('submit_learning_session', {
        ...args,
        p_session_id: rvSession,
        p_kind: 'review',
        p_lesson_id: '',
        p_attempts: [
          {
            exercise_id: null,
            word_id: w,
            answer: 'x',
            correct: true,
            first_try: true,
            response_ms: 1000,
          },
        ],
      });
      assert.equal(rv.data, null, JSON.stringify(rv.data));
      assert.ok(rv.error, 'rechazado');
      assert.equal(rv.error.message, 'legacy_review_retired', JSON.stringify(rv.error));
      assert.equal(rv.error.code, '42501', 'insufficient_privilege (PostgREST → 403)');
      assert.equal(rv.status, 403);
      // Nada escrito: ni sesión, ni intentos, ni correcciones, ni evidencias, ni SRS, ni recompensas.
      assert.deepEqual(await footprint(), before, 'ninguna tabla de la cuenta cambia');
      for (const t of sessionTables)
        assert.equal(
          await count(`select count(*) from public.${t} where session_id = '${rvSession}';`),
          0,
          `${t} sin filas de la sesión rechazada`,
        );
      assert.equal(
        await count(`select count(*) from public.learning_sessions where id = '${rvSession}';`),
        0,
      );
      // La lección vieja sigue respondiendo después del rechazo (reenvío idempotente intacto).
      const third = await db.rpc('submit_learning_session', args);
      assert.equal(third.error, null, JSON.stringify(third.error));
      assert.equal(third.data.duplicate, true);
      const usage = await qj(`select public.learning_route_usage(now() - interval '1 hour');`);
      const s = JSON.stringify(usage);
      const routes = usage.routes.map((r) => r.route);
      assert.ok(
        ['legacy_lesson', 'lesson_graded', 'record_learning_session'].every((r) =>
          routes.includes(r),
        ),
        s.slice(0, 600),
      );
      assert.ok(!routes.includes('legacy_review'), 'ningún repaso por la ruta vieja');
      assert.equal(usage.legacy_review_users, 0);
      console.log(`     learning_route_usage: ${s.slice(0, 400)}`);
    },
  );

  await scenario(
    'I · reenvío de una build vieja con un id ya guardado por la ruta nueva → duplicate',
    async () => {
      const u = await newUser('legacy-dup');
      const r = await doLesson(u, firstLesson);
      const { data, error } = await client(userToken(u)).rpc('submit_learning_session', {
        p_session_id: r.sessionId,
        p_kind: 'lesson',
        p_lesson_id: firstLesson,
        p_started_at: new Date(Date.now() - 120000).toISOString(),
        p_time_zone: TZ,
        p_attempts: [],
      });
      assert.equal(error, null, JSON.stringify(error));
      assert.equal(data.duplicate, true);
    },
  );
}

// --- Adaptativo (v2 encendido SÓLO en esta base desechable) --------------------------------------------
// --- Fase C.8.1: nivel curricular del cliente (x-polygo-curriculum-api) de punta a punta ------------
// La app manda la cabecera global; la función la normaliza y la reenvía a TODAS sus RPC; PostgREST la
// expone en request.headers y request_curriculum_api() la lee. Va al final: publica U13/U14, activa sus
// ítems y habilita la ruta v2 SÓLO en este clúster desechable.
async function scenarioCurriculum() {
  const NEW_UNITS = ['a1-u13', 'a1-u14'];
  const newItems = new Set(
    await qj(`select coalesce(jsonb_agg(distinct e.item_id), '[]') from public.exercises e
      join public.lessons l on l.id = e.lesson_id where l.unit_id in ('a1-u13', 'a1-u14');`),
  );
  const isNew = (i) => newItems.has(i);
  const headersFor = (api) => (api === undefined ? {} : { [CURRICULUM_HEADER]: String(api) });
  const userWithApi = async (tag, api) =>
    (
      await q(`insert into auth.users (email, raw_user_meta_data)
        values (${lit(`${tag}-${randomUUID()}@e2e.dev`)}, ${lit(JSON.stringify({ polygo_curriculum_api: api }))}::jsonb)
        returning id;`)
    ).split('\n')[0];
  const routeOf = (u) =>
    q(`select coalesce((select route_id from public.user_curriculum_routes
        where user_id = ${lit(u)}::uuid and level = 'A1'), '-');`);
  /** Conoce todo el vocabulario de inglés (SRS v1), el peor caso: también U13/U14. */
  const knowAll = (u) =>
    q(`insert into public.user_word_progress (user_id, word_id, stage, seen_count, correct_count,
         incorrect_count, last_result, last_reviewed_at, next_review_at)
       select ${lit(u)}::uuid, w.id, 1, 2, 1, 1, false, now() - interval '2 days', now() - interval '1 hour'
       from public.words w where w.language_code = 'en' on conflict (user_id, word_id) do nothing;`);
  const planItems = async (sid) =>
    qj(`select coalesce(jsonb_agg(x ->> 'item_id'), '[]') from public.srs_session_plans p
      cross join lateral jsonb_array_elements(p.items) x where p.session_id = ${lit(sid)}::uuid;`);
  /** Todas las RPC de la función (service_role) recibieron ese nivel. */
  const assertLevel = (log, expected, what) => {
    assert.ok(log.length > 0, `${what}: hubo consultas`);
    for (const e of log) {
      assert.equal(e.role, 'service_role', `${what}: ${e.fn}`);
      assert.equal(e.api, expected, `${what}: ${e.fn} recibió ${e.api}`);
    }
  };

  /**
   * Repaso completo por la función: start_review, answer_review de cada presentación y submit_review.
   * opts.answerApi: cabecera de answer/submit (presente aunque sea undefined = sin cabecera).
   * opts.wrongFirst: la primera respuesta es incorrecta pero el cliente dice «correct».
   * opts.onlyDue: sólo esas palabras vencidas.
   */
  async function flow(u, api, opts = {}) {
    const answerApi = 'answerApi' in opts ? opts.answerApi : api;
    const tok = userToken(u);
    await makeDue(u);
    if (opts.onlyDue)
      await q(`update public.user_word_progress set next_review_at = now() + interval '1 day'
        where user_id = ${lit(u)}::uuid and word_id <> all (${lit(`{${opts.onlyDue.join(',')}}`)}::text[]);`);
    const sid = randomUUID();
    const mark = rpcLog.length;
    const st = await invoke(
      tok,
      { action: 'start_review', session_id: sid, language_code: 'en', time_zone: TZ },
      { headers: headersFor(api) },
    );
    assert.equal(st.status, 200, JSON.stringify(st));
    const startLog = rpcLog.slice(mark);
    const cand = startLog.find((e) => e.fn === 'learning_focus_candidates');
    assert.ok(cand?.body, 'la función pidió candidatos');
    const candidates = new Set(
      (cand.body.words ?? []).flatMap((w) => (w.items ?? []).map((i) => i.item_id)),
    );
    const ss = await snaps(u, sid);
    assert.ok(ss.length > 0, `presentaciones (${st.data?.status})`);
    const makeFor = (i) => (opts.wrongFirst && i === 0 ? wrongAnswer : rightAnswer);
    const markA = rpcLog.length;
    const verdicts = [];
    for (const [i, s] of ss.entries()) {
      const r = await invoke(
        tok,
        {
          action: 'answer_review',
          session_id: sid,
          attempt: { ...toAttempt(s, makeFor(i)), attempt_no: 1 },
        },
        { headers: headersFor(answerApi) },
      );
      assert.equal(r.status, 200, JSON.stringify(r));
      verdicts.push(r.data.verdict);
    }
    const sub = await invoke(
      tok,
      {
        action: 'submit_review',
        session_id: sid,
        started_at: new Date(Date.now() - 60000).toISOString(),
        time_zone: TZ,
        attempts: ss.map((s, i) => toAttempt(s, makeFor(i))),
      },
      { headers: headersFor(answerApi) },
    );
    assert.equal(sub.status, 200, JSON.stringify(sub));
    return {
      sid,
      ss,
      verdicts,
      candidates,
      items: await planItems(sid),
      startLog,
      answerLog: rpcLog.slice(markA),
      submit: sub.data,
    };
  }

  let v1;
  await scenario(
    'I · cliente antiguo sin cabecera → nivel 0 en start/answer/submit; corrige el servidor',
    async () => {
      v1 = await newUser('c8-old');
      assert.equal(await routeOf(v1), 'en.a1.route.v1');
      await knowAll(v1);
      const r = await flow(v1, undefined, { wrongFirst: true });
      assertLevel(r.startLog, '0', 'start');
      assertLevel(r.answerLog, '0', 'answer/submit');
      assert.ok(![...r.candidates].some(isNew) && !r.items.some(isNew), 'sin U13/U14');
      // Autoridad de corrección: el cliente dijo «correct» con una respuesta incorrecta.
      assert.equal(r.verdicts[0], 'incorrect');
      assert.ok(r.verdicts.slice(1).every((v) => v === 'correct' || v === 'typo'));
    },
  );

  let c5;
  await scenario(
    'I · cliente C.5 (nivel 1) → nivel 1 en todas las consultas; la cuenta v1 sigue en la v1',
    async () => {
      c5 = await userWithApi('c8-c5', 1);
      assert.equal(await routeOf(c5), 'en.a1.route.v1', 'con la v2 apagada, alta en la v1');
      await knowAll(c5);
      const r = await flow(c5, 1, { wrongFirst: true });
      assertLevel(r.startLog, '1', 'start');
      assertLevel(r.answerLog, '1', 'answer/submit');
      assert.ok(![...r.candidates].some(isNew) && !r.items.some(isNew));
      assert.equal(r.verdicts[0], 'incorrect');
    },
  );

  await scenario('I · cabecera inválida → la función reenvía 0', async () => {
    for (const bad of ['abc', '-1', '1000', '1.5', ' ']) {
      const r = await flow(v1, bad);
      assertLevel(r.startLog, '0', `start «${bad}»`);
      assertLevel(r.answerLog, '0', `answer/submit «${bad}»`);
      assert.ok(!r.items.some(isNew));
    }
  });

  let v2;
  let v2Session;
  await scenario(
    'I · cuenta v2: con nivel 1 recibe U13/U14 (candidatos y plan); con cliente antiguo, no',
    async () => {
      // Sólo en este clúster: ítems activos, U13/U14 publicadas (sin las lecciones -context) y v2 habilitada.
      await q(`update public.exercise_items set status = 'active' where id in (
          select e.item_id from public.exercises e join public.lessons l on l.id = e.lesson_id
          where l.unit_id in ('a1-u13', 'a1-u14'));
        update public.curriculum_units set is_published = true where id in ('a1-u13', 'a1-u14');
        update public.words set is_published = true where unit_id in ('a1-u13', 'a1-u14');
        update public.lessons set is_published = true
          where unit_id in ('a1-u13', 'a1-u14') and id not like '%-context';
        update public.exercises set is_published = true where lesson_id in (select id from public.lessons
          where unit_id in ('a1-u13', 'a1-u14') and id not like '%-context');
        set role service_role;
        select public.curriculum_enable_route('en.a1.route.v2');`);
      v2 = await userWithApi('c8-v2', 1);
      assert.equal(await routeOf(v2), 'en.a1.route.v2');
      await knowAll(v2);
      const plain = await flow(v2, 1);
      assertLevel(plain.startLog, '1', 'start v2');
      assert.ok([...plain.candidates].some(isNew), 'candidatos con U13/U14');
      // El plan básico toma 10 palabras por prioridad: se dejan vencidas sólo las compartidas con
      // U13/U14 (y se prueba otra sesión si ninguna eligió un ítem de U13/U14).
      const shared = await qj(`select coalesce(jsonb_agg(distinct ew.word_id), '[]')
        from public.exercise_words ew join public.exercises e on e.id = ew.exercise_id
        join public.lessons l on l.id = e.lesson_id join public.words w on w.id = ew.word_id
        where l.unit_id in ('a1-u13', 'a1-u14') and w.unit_id not in ('a1-u13', 'a1-u14');`);
      for (let i = 0; i < 6 && !v2Session; i++) {
        const r = await flow(v2, 1, { onlyDue: shared });
        assertLevel(r.answerLog, '1', 'answer/submit v2');
        if (r.items.some(isNew)) v2Session = r;
      }
      assert.ok(v2Session, 'algún plan de la v2 tomó un ítem de U13/U14');
      // La misma cuenta con una build antigua ve la v1.
      const old = await flow(v2, undefined);
      assertLevel(old.startLog, '0', 'start v2 antiguo');
      assert.ok(![...old.candidates].some(isNew) && !old.items.some(isNew));
      // Responder y cerrar desde un cliente sin cabecera no cambia la sesión ya armada.
      const mixed = await flow(v2, 1, { onlyDue: shared, answerApi: undefined });
      assertLevel(mixed.answerLog, '0', 'answer/submit sin cabecera');
      assert.ok(!mixed.answerLog.some((e) => /candidates|start_/.test(e.fn)));
    },
  );

  await scenario(
    'I · ninguna respuesta introduce contenido fuera de la ruta: presentación ajena de U13 rechazada',
    async () => {
      assert.ok(v2Session, 'requiere el escenario anterior');
      const foreign =
        v2Session.ss.find((s) => v2Session.items.some((i) => isNew(i) && i === s.item_id)) ??
        v2Session.ss[0];
      const exclusiveHash = () =>
        q(`select md5(coalesce(string_agg(p::text, '|' order by p.word_id), '')) from public.user_word_progress p
           join public.words w on w.id = p.word_id
           where p.user_id = ${lit(c5)}::uuid and w.unit_id in ('a1-u13', 'a1-u14');`);
      // makeDue reescribe las fechas de todas sus palabras: la huella se toma después.
      await makeDue(c5);
      const before = await exclusiveHash();
      const tok = userToken(c5);
      const sid = randomUUID();
      const st = await invoke(
        tok,
        { action: 'start_review', session_id: sid, language_code: 'en', time_zone: TZ },
        { headers: headersFor(1) },
      );
      assert.equal(st.status, 200, JSON.stringify(st));
      const ss = await snaps(c5, sid);
      const planBefore = await planItems(sid);
      // answer_review con la presentación de U13 de OTRA cuenta (y un nivel 999 falsificado).
      const forged = await invoke(
        tok,
        {
          action: 'answer_review',
          session_id: sid,
          attempt: { ...toAttempt(foreign), attempt_no: 1 },
        },
        { headers: headersFor(999) },
      );
      assert.notEqual(forged.status, 200, JSON.stringify(forged));
      // submit_review con esa presentación de más.
      const extra = await invoke(
        tok,
        {
          action: 'submit_review',
          session_id: sid,
          started_at: new Date(Date.now() - 60000).toISOString(),
          time_zone: TZ,
          attempts: [...ss.map((s) => toAttempt(s)), toAttempt(foreign)],
        },
        { headers: headersFor(999) },
      );
      if (extra.status === 200) {
        // Si se aceptó, fue ignorándola: sólo las presentaciones propias quedaron registradas.
        const n = await count(`select count(*) from public.exercise_attempts
          where session_id = ${lit(sid)}::uuid;`);
        assert.equal(n, ss.length, 'sólo las presentaciones de la sesión');
      }
      assert.deepEqual(await planItems(sid), planBefore, 'el plan no cambia');
      assert.ok(!planBefore.some(isNew));
      assert.equal(await exclusiveHash(), before, 'sin evidencia nueva en palabras de U13/U14');
      assert.equal(await routeOf(c5), 'en.a1.route.v1', 'la ruta persistente no cambia');
    },
  );
}

async function scenarioAdaptive() {
  await scenario(
    'D · adaptativo con el v2 encendido (local, controlado): plan, corrección, evidencias, srs; luego se apaga',
    async () => {
      await q(`update public.srs_v2_settings set enabled = true;`);
      try {
        const u = await newUser('adaptive');
        const r = await doLesson(u, firstLesson);
        assert.equal(r.submit.status, 200, JSON.stringify(r.submit));
        assert.ok(r.submit.data.srs, 'con el v2 encendido la lección devuelve srs');
        await makeDue(u);
        const sid = randomUUID();
        const st = await invoke(userToken(u), {
          action: 'start_review',
          session_id: sid,
          language_code: 'en',
          time_zone: TZ,
        });
        assert.equal(st.status, 200, JSON.stringify(st));
        assert.equal(st.data.status, 'ok', JSON.stringify(st.data).slice(0, 300));
        assert.equal(
          await q(`select source from public.srs_session_plans where session_id = '${sid}';`),
          'adaptive_review',
        );
        assert.ok(Array.isArray(st.data.persistent));
        const { ss } = await answerAllReview(u, sid);
        const sub = await submitReview(u, sid, ss);
        assert.equal(sub.status, 200, JSON.stringify(sub));
        assert.ok(sub.data.srs, 'srs confirmado del v2');
        assert.equal(
          await count(
            `select count(*) from public.exercise_attempt_gradings where session_id = '${sid}';`,
          ),
          ss.length,
        );
        // Una sesión básica abierta antes de encender se retoma igual.
      } finally {
        await q(`update public.srs_v2_settings set enabled = false;`);
      }
      assert.equal(await q(`select enabled::text from public.srs_v2_settings;`), 'false');
    },
  );
}

// --- Variantes de configuración de la función -----------------------------------------------------------
async function scenarioEnvVariants() {
  await scenario(
    'I · LEARNING_MIN_CONTRACT=2: sin contrato → 426 client_outdated; contrato 2 → normal',
    async () => {
      const p = await startDeno({ LEARNING_MIN_CONTRACT: '2' }, 8000);
      try {
        const u = await newUser('min-contract');
        const old = await invoke(
          userToken(u),
          { action: 'start', session_id: randomUUID(), lesson_id: firstLesson },
          { withClient: false },
        );
        assert.deepEqual(
          [old.status, old.error, old.payload?.min_contract],
          [426, 'client_outdated', 2],
        );
        const neu = await invoke(userToken(u), {
          action: 'start',
          session_id: randomUUID(),
          lesson_id: firstLesson,
        });
        assert.equal(neu.status, 200, JSON.stringify(neu));
      } finally {
        await stopDeno(p);
      }
    },
  );
  await scenario(
    'B · claves nuevas (SUPABASE_SECRET_KEYS, sin SUPABASE_SERVICE_ROLE_KEY) → funciona igual',
    async () => {
      const p = await startDeno(
        {
          SUPABASE_SERVICE_ROLE_KEY: '',
          SUPABASE_SECRET_KEYS: JSON.stringify({ default: OPAQUE_SECRET }),
        },
        8000,
      );
      try {
        const u = await newUser('secret-keys');
        const r = await invoke(userToken(u), {
          action: 'start',
          session_id: randomUUID(),
          lesson_id: firstLesson,
        });
        assert.equal(r.status, 200, JSON.stringify(r));
      } finally {
        await stopDeno(p);
      }
    },
  );
  await scenario(
    'B · sin clave de servicio → la función no concede nada (401/500, nunca 200)',
    async () => {
      const p = await startDeno({ SUPABASE_SERVICE_ROLE_KEY: '' }, 8000);
      try {
        const u = await newUser('no-key');
        const r = await invoke(userToken(u), {
          action: 'start',
          session_id: randomUUID(),
          lesson_id: firstLesson,
        });
        assert.notEqual(r.status, 200, JSON.stringify(r));
        // O-1 (cierre del Learning Machine): la configuración rota responde como cualquier error del
        // servidor, con JSON y CORS (antes lanzaba antes del try: 500 sin cuerpo ni cabeceras).
        const raw = await fetch(`${EMU}/functions/v1/learning-session`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userToken(u)}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start', session_id: randomUUID(), lesson_id: firstLesson }),
        });
        assert.equal(raw.status, 500);
        assert.equal(raw.headers.get('access-control-allow-origin'), '*');
        assert.deepEqual(await raw.json(), { error: 'server_error' });
      } finally {
        await stopDeno(p);
      }
    },
  );
}

main().catch((err) => {
  console.error(err);
  for (const p of denoProcs) if (p.exitCode === null) p.kill();
  try {
    run('pg_ctl.exe', ['-D', DATA, '-m', 'immediate', 'stop']);
  } catch {}
  process.exit(1);
});

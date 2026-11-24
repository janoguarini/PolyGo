// Emulador mínimo de GoTrue + PostgREST sobre PGlite, para pruebas (fase C.8).
//
// Hace lo que importa para las rutas que se prueban, como PostgREST:
//   · una transacción por pedido con `set local role` (service_role / authenticated / anon);
//   · request.jwt.claims y request.jwt.claim.sub;
//   · request.headers = TODAS las cabeceras del pedido en JSON con nombres en minúscula (así las lee
//     public.request_curriculum_api(): x-polygo-curriculum-api);
//   · /rest/v1/rpc/<fn> con argumentos por nombre y errores {code, message};
//   · GET /rest/v1/<tabla>?select=a,b&col=eq.valor (sólo select de columnas y filtros eq);
//   · GET /auth/v1/user con un token de prueba `user-<uuid>`.
// No verifica firmas (los tokens son de prueba) ni emula otros filtros, embeds, prefer, rangos, etc.
//
// Registra cada RPC: { fn, role, headers, args, status, body } para que la prueba compruebe qué cabecera
// recibió cada consulta y qué devolvió.
import { createServer } from 'node:http';

export function startEmulator(db, { serviceKey, anonKey }) {
  const calls = [];
  /** Edge Functions servidas en /functions/v1/<nombre>: nombre → handler(Request) (se registran después). */
  const functions = {};
  let chain = Promise.resolve();
  /** PGlite tiene una sola conexión: los pedidos se atienden de a uno, como transacciones separadas. */
  const serial = (fn) => {
    const run = chain.then(fn, fn);
    chain = run.catch(() => {});
    return run;
  };

  const claimsOf = (req) => {
    const bearer = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
    const user = /^user-([0-9a-f-]{36})$/i.exec(bearer);
    if (user) return { role: 'authenticated', sub: user[1] };
    if (bearer === serviceKey || req.headers.apikey === serviceKey) return { role: 'service_role' };
    if (bearer === anonKey || req.headers.apikey === anonKey) return { role: 'anon' };
    return null;
  };

  async function inTransaction(claims, headers, fn) {
    return serial(() =>
      db.transaction(async (tx) => {
        await tx.exec(`set local role ${claims.role}`);
        await tx.query(`select set_config('request.jwt.claims', $1, true)`, [
          JSON.stringify(claims),
        ]);
        await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [claims.sub ?? '']);
        await tx.query(`select set_config('request.headers', $1, true)`, [JSON.stringify(headers)]);
        return fn(tx);
      }),
    );
  }

  async function procOf(fn, names) {
    const { rows } = await db.query(
      `select coalesce(p.proargnames[1:p.pronargs], '{}') as names,
              array(select format_type(t, null) from unnest(p.proargtypes::oid[]) t) as types,
              p.proretset as set, p.prorettype = 'void'::regtype as void,
              t.typtype in ('c', 'p') as composite
       from pg_proc p join pg_namespace n on n.oid = p.pronamespace join pg_type t on t.oid = p.prorettype
       where n.nspname = 'public' and p.proname = $1`,
      [fn],
    );
    return (
      rows.find(
        (o) => o.names.length === names.length && names.every((n) => o.names.includes(n)),
      ) ??
      rows.find((o) => names.every((n) => o.names.includes(n))) ??
      null
    );
  }

  async function rpc(fn, args, claims, headers) {
    const names = Object.keys(args);
    const proc = await procOf(fn, names);
    if (!proc) return [404, { code: 'PGRST202', message: `function ${fn} not found` }];
    const params = [];
    const argSql = names
      .map((n) => {
        const v = args[n];
        const type = proc.types[proc.names.indexOf(n)];
        if (v === null || v === undefined) return `${n} => null::${type}`;
        if (type.endsWith('[]')) {
          params.push(JSON.stringify(v));
          return `${n} => array(select jsonb_array_elements_text($${params.length}::jsonb))::${type}`;
        }
        params.push(
          type === 'jsonb' || type === 'json' || typeof v === 'object'
            ? JSON.stringify(v)
            : String(v),
        );
        return `${n} => $${params.length}::${type}`;
      })
      .join(', ');
    const call = `public.${fn}(${argSql})`;
    const select = proc.void
      ? `select ${call}, null::jsonb as r`
      : proc.set
        ? proc.composite
          ? `select coalesce(jsonb_agg(to_jsonb(x)), '[]') as r from ${call} x`
          : `select coalesce(jsonb_agg(x.v), '[]') as r from (select ${call} as v) x`
        : `select to_jsonb(${call}) as r`;
    try {
      const r = await inTransaction(claims, headers, (tx) => tx.query(select, params));
      return [200, proc.void ? null : (r.rows[0]?.r ?? null)];
    } catch (err) {
      const code = err.code ?? 'XX000';
      return [
        code === '42501' ? 403 : 400,
        { code, message: err.message, details: null, hint: null },
      ];
    }
  }

  async function table(name, url, claims, headers) {
    if (!/^\w+$/.test(name)) return [400, { message: 'bad table' }];
    const cols = (url.searchParams.get('select') ?? '*').split(',').map((c) => c.trim());
    if (!cols.every((c) => c === '*' || /^\w+$/.test(c))) return [400, { message: 'bad select' }];
    const where = [];
    const params = [];
    for (const [k, v] of url.searchParams) {
      if (k === 'select') continue;
      const m = /^eq\.(.*)$/.exec(v);
      if (!/^\w+$/.test(k) || !m) return [400, { message: `filtro no emulado: ${k}=${v}` }];
      params.push(m[1]);
      where.push(`${k}::text = $${params.length}`);
    }
    const sql = `select coalesce(jsonb_agg(to_jsonb(s)), '[]') as r from (select ${cols.join(', ')}
      from public.${name} ${where.length ? `where ${where.join(' and ')}` : ''}) s`;
    try {
      const r = await inTransaction(claims, headers, (tx) => tx.query(sql, params));
      return [200, r.rows[0].r];
    } catch (err) {
      return [400, { code: err.code ?? 'XX000', message: err.message }];
    }
  }

  const readBody = (req) =>
    new Promise((resolve) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });

  const server = createServer(async (req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(body === undefined ? '' : JSON.stringify(body));
    };
    try {
      const url = new URL(req.url, 'http://emulator');
      // Gateway de funciones (verify_jwt = false): reenvía el pedido tal cual al handler registrado.
      const fnRoute = /^\/functions\/v1\/([\w-]+)$/.exec(url.pathname);
      if (fnRoute && functions[fnRoute[1]]) {
        const body = await readBody(req);
        const headers = Object.entries(req.headers).filter(
          ([k]) => !['host', 'content-length', 'connection'].includes(k),
        );
        const r = await functions[fnRoute[1]](
          new Request(`http://edge${url.pathname}`, {
            method: req.method,
            headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
          }),
        );
        const text = await r.text();
        res.writeHead(
          r.status,
          Object.fromEntries(
            [...r.headers].filter(([k]) => !['content-encoding', 'content-length'].includes(k)),
          ),
        );
        return res.end(text);
      }
      const claims = claimsOf(req);
      if (url.pathname === '/auth/v1/user' && req.method === 'GET') {
        if (!claims?.sub)
          return send(403, { code: 403, error_code: 'bad_jwt', msg: 'invalid JWT' });
        const { rows } = await serial(() =>
          db.query(`select id, email, created_at from auth.users where id = $1`, [claims.sub]),
        );
        if (!rows[0]) return send(403, { code: 403, error_code: 'user_not_found', msg: 'no user' });
        return send(200, {
          ...rows[0],
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: {},
        });
      }
      if (!claims) return send(401, { code: 'PGRST301', message: 'JWSError' });
      const headers = { ...req.headers };
      const m = /^\/rest\/v1\/rpc\/(\w+)$/.exec(url.pathname);
      if (m && req.method === 'POST') {
        const raw = await readBody(req);
        const args = raw ? JSON.parse(raw) : {};
        const [status, body] = await rpc(m[1], args, claims, headers);
        calls.push({ fn: m[1], role: claims.role, headers, args, status, body });
        return send(status, body);
      }
      const t = /^\/rest\/v1\/(\w+)$/.exec(url.pathname);
      if (t && req.method === 'GET') {
        const [status, body] = await table(t[1], url, claims, headers);
        return send(status, body);
      }
      send(404, { message: 'not found' });
    } catch (err) {
      send(500, { message: String(err) });
    }
  });

  return new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () =>
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        calls,
        functions,
        close: () => new Promise((r) => server.close(() => r())),
      }),
    ),
  );
}

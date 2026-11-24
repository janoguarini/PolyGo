// Fase C.5 (docs/LEARNING_PHASE_C.md §C5): compatibilidad entre versiones de la app y rutas curriculares
// (20261115120000_client_compatibility.sql), probada en PGlite.
//
// La base se arma con las migraciones anteriores a la C.4, se crean cuentas «existentes» con progreso y
// se aplican la C.4 y la C.5. Un «cliente antiguo» es un request SIN la cabecera x-polygo-curriculum-api
// (como cualquier build publicada hasta hoy); un «cliente nuevo» la envía con 1. La última parte publica
// U13/U14 y habilita la v2 sólo dentro de esta base desechable.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser } from './harness.mjs';

const C4 = '20261114120000_curriculum_routes.sql';
const C5 = '20261115120000_client_compatibility.sql';
const dir = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, dir), 'utf8');
const V1 = [
  'a1-u01',
  'a1-u02',
  'a1-u03',
  'a1-u04',
  'a1-u05',
  'a1-u06',
  'a1-u07',
  'a1-u08',
  'a1-u09',
  'a1-u10',
  'a1-u11',
  'a1-u12',
];
const V2 = [
  'a1-u01',
  'a1-u02',
  'a1-u03',
  'a1-u13',
  'a1-u04',
  'a1-u05',
  'a1-u06',
  'a1-u07',
  'a1-u14',
  'a1-u08',
  'a1-u09',
  'a1-u10',
  'a1-u11',
  'a1-u12',
];
const OLD = null; // sin cabecera
const NEW = 1;

let db;
const users = {};

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;

async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err;
  }
}

/** Ejecuta fn como un cliente: rol, JWT y cabeceras de PostgREST (api null = cliente antiguo). */
async function asClient(role, userId, api, fn) {
  const headers = api == null ? {} : { 'x-polygo-curriculum-api': String(api) };
  await db.exec(`set role ${role}`);
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [userId ?? '']);
  await db.query(`select set_config('request.headers', $1, false)`, [JSON.stringify(headers)]);
  try {
    return await fn();
  } finally {
    await db.exec('reset role');
    await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
    await db.query(`select set_config('request.headers', '', false)`);
  }
}

/** Alta como la hace cada cliente: el nuevo declara su nivel en options.data (raw_user_meta_data). */
async function signUp(email, api) {
  const meta = api == null ? null : { polygo_curriculum_api: api };
  return (
    await one(`insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`, [
      email,
      meta,
    ])
  ).id;
}

/** Lo que dibuja un cliente antiguo: curriculum_units ordenadas por posición (inglés A1). */
const pathByPosition = (user, api) =>
  asClient('authenticated', user, api, async () =>
    (
      await all(
        `select id from public.curriculum_units where language_code = 'en' and level = 'A1' order by position`,
      )
    ).map((r) => r.id),
  );
/** Lo que dibuja un cliente nuevo: my_curriculum_route. */
const pathByRoute = (user, api = NEW) =>
  asClient(
    'authenticated',
    user,
    api,
    async () =>
      await all(
        `select unit_id, unit_order, route_id from public.my_curriculum_route('en') where level = 'A1' order by unit_order`,
      ),
  );
const lessonsSeen = (user, api, unit) =>
  asClient(
    'authenticated',
    user,
    api,
    async () =>
      (await one(`select count(*)::int n from public.lessons where unit_id = $1`, [unit])).n,
  );
const routeOf = async (user) =>
  one(
    `select route_id, source from public.user_curriculum_routes where user_id = $1 and language_code = 'en' and level = 'A1'`,
    [user],
  );
const status = (role, args, api = null) =>
  asClient(
    role,
    null,
    api,
    async () => (await one(`select public.app_client_status($1, $2, $3) s`, args)).s,
  );
const unlockMap = async (user) =>
  Object.fromEntries(
    (
      await all(
        `select l.id, public.is_lesson_unlocked($1, l.id) ok from public.lessons l where l.is_published order by l.id`,
        [user],
      )
    ).map((r) => [r.id, r.ok]),
  );

async function complete(user, units) {
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy,
       first_completed_at, last_completed_at)
     select $1, l.id, 1, 0.9, 0.9, now(), now() from public.lessons l
     where l.unit_id = any($2) and l.is_published
     on conflict (user_id, lesson_id) do nothing`,
    [user, units],
  );
}

async function publish(units) {
  for (const u of units) {
    await db.query(`update public.curriculum_units set is_published = true where id = $1`, [u]);
    await db.query(`update public.words set is_published = true where unit_id = $1`, [u]);
    await db.query(
      `update public.lessons set is_published = true where unit_id = $1 and id not like '%-context'`,
      [u],
    );
    await db.query(
      `update public.exercises set is_published = true where lesson_id in
         (select id from public.lessons where unit_id = $1 and id not like '%-context')`,
      [u],
    );
  }
}

const enableV2 = () =>
  asClient('service_role', null, null, () =>
    db.query(`select public.curriculum_enable_route('en.a1.route.v2')`),
  );

before(async () => {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql') && f < C4)
    .sort();
  db = await createDb({ files });
  users.existing = await createUser(db, 'existing@test.dev');
  await complete(users.existing, V1.slice(0, 3));
  await db.exec(migration(C4));
  await db.exec(migration(C5));
});

// --- Modelo -----------------------------------------------------------------------------------------

test('requisitos por ruta: v1 cualquier cliente, v2 cliente de nivel 1; inmutables; v2 sigue apagada', async () => {
  assert.deepEqual(
    await all(
      `select route_id, min_curriculum_api from public.curriculum_route_client_requirements order by 1`,
    ),
    [
      { route_id: 'en.a1.route.v1', min_curriculum_api: 0 },
      { route_id: 'en.a1.route.v2', min_curriculum_api: 1 },
    ],
  );
  assert.match(
    String(
      await errorOf(
        db.query(`update public.curriculum_route_client_requirements set min_curriculum_api = 0`),
      ),
    ),
    /no cambia/,
  );
  assert.match(
    String(await errorOf(db.query(`delete from public.curriculum_route_client_requirements`))),
    /no cambia/,
  );
  assert.deepEqual(await all(`select id, enabled from public.curriculum_routes order by id`), [
    { id: 'en.a1.route.v1', enabled: true },
    { id: 'en.a1.route.v2', enabled: false },
  ]);
  assert.equal(
    (await one(`select route_id from public.curriculum_route_enrollment`)).route_id,
    'en.a1.route.v1',
  );
  // Nivel del request: sin cabecera, basura o fuera de rango = 0.
  for (const [h, want] of [
    ['', 0],
    ['{}', 0],
    ['{"x-polygo-curriculum-api":"1"}', 1],
    ['{"x-polygo-curriculum-api":"abc"}', 0],
    ['{"x-polygo-curriculum-api":"-1"}', 0],
    ['no-json', 0],
  ]) {
    await db.query(`select set_config('request.headers', $1, false)`, [h]);
    assert.equal((await one(`select public.request_curriculum_api() v`)).v, want, h);
  }
  await db.query(`select set_config('request.headers', '', false)`);
});

// --- 12: la v2 no se puede habilitar mientras U13/U14 no estén listas --------------------------------

test('12: habilitar la v2 sin U13/U14 publicadas falla y no cambia nada', async () => {
  const err = await errorOf(enableV2());
  assert.match(
    String(err?.message),
    /no está lista: unidad sin publicar: a1-u13; unidad sin publicar: a1-u14/,
  );
  assert.equal(
    (await one(`select enabled from public.curriculum_routes where id = 'en.a1.route.v2'`)).enabled,
    false,
  );
  // Un cliente no puede hacerlo.
  assert.ok(
    await errorOf(
      asClient('authenticated', users.existing, NEW, () =>
        db.query(`select public.curriculum_enable_route('en.a1.route.v2')`),
      ),
    ),
  );
});

// --- Escenarios con la v2 apagada --------------------------------------------------------------------

test('1 · 2 · 10: usuario v1 con cliente antiguo y nuevo: U1–U12, nunca U13/U14', async () => {
  assert.deepEqual(await pathByPosition(users.existing, OLD), V1);
  assert.deepEqual(await pathByPosition(users.existing, NEW), V1);
  assert.deepEqual(
    (await pathByRoute(users.existing)).map((r) => [r.unit_id, r.unit_order, r.route_id]),
    V1.map((u, i) => [u, i + 1, 'en.a1.route.v1']),
  );
});

test('4 · 5: con la v2 apagada, altas desde cliente antiguo y nuevo reciben la v1', async () => {
  users.oldSignupOff = await signUp('old-off@test.dev', OLD);
  users.newSignupOff = await signUp('new-off@test.dev', NEW);
  assert.deepEqual(await routeOf(users.oldSignupOff), {
    route_id: 'en.a1.route.v1',
    source: 'signup',
  });
  assert.deepEqual(await routeOf(users.newSignupOff), {
    route_id: 'en.a1.route.v1',
    source: 'signup',
  });
});

// --- Versión mínima: 6, 7, 8 -------------------------------------------------------------------------

test('6 · 7 · 8: versión mínima configurable desde el servidor', async () => {
  // Sin mínimo configurado: todo cliente está bien, con o sin versión.
  assert.deepEqual(await status('anon', ['1.0.0', 'ios', 1]), {
    status: 'ok',
    installed_version: '1.0.0',
    min_version: null,
    curriculum_api: 1,
    min_curriculum_api: 0,
    message: null,
    update_url: null,
  });
  assert.equal((await status('anon', [null, null, null])).status, 'ok');

  await db.query(
    `update public.app_client_policy set min_version = '1.2.0', update_url = 'https://example.org/polygo' where platform = 'any'`,
  );
  // 7: inferior a la mínima → mensaje de actualización.
  const low = await status('authenticated', ['1.1.9', 'android', 1]);
  assert.equal(low.status, 'update_required');
  assert.equal(low.installed_version, '1.1.9');
  assert.equal(low.min_version, '1.2.0');
  assert.match(low.message, /Actualizala/);
  assert.equal(low.update_url, 'https://example.org/polygo');
  // 8: igual o superior → ok, sin mensaje. Comparación numérica, no de texto.
  for (const v of ['1.2.0', '1.2', '1.10.0', '2.0.0', '1.2.0-beta.1']) {
    const s = await status('authenticated', [v, 'ios', 1]);
    assert.equal(s.status, 'ok', v);
    assert.equal(s.message, null, v);
  }
  // 6: sin versión (o ilegible) → unknown: no se bloquea, pero tampoco se finge que está al día.
  for (const v of [null, '', 'dev', 'v1']) {
    const s = await status('authenticated', [v, 'ios', 1]);
    assert.equal(s.status, 'unknown', String(v));
    assert.equal(s.installed_version, null);
    assert.equal(s.message, null);
  }
  // Por plataforma: la fila propia reemplaza a la general.
  await db.query(
    `insert into public.app_client_policy (platform, min_version, message_es) values ('ios', '1.3.0', 'iOS: actualizá')`,
  );
  assert.equal((await status('authenticated', ['1.2.5', 'ios', 1])).status, 'update_required');
  assert.equal((await status('authenticated', ['1.2.5', 'ios', 1])).message, 'iOS: actualizá');
  assert.equal((await status('authenticated', ['1.2.5', 'android', 1])).status, 'ok');
  assert.equal((await status('authenticated', ['1.2.5', 'desconocida', 1])).status, 'ok');
  // Nivel curricular mínimo: se exige aunque no haya versión; el parámetro o la cabecera.
  await db.query(
    `update public.app_client_policy set min_curriculum_api = 1 where platform = 'any'`,
  );
  assert.equal((await status('authenticated', ['9.9.9', 'android', 0])).status, 'update_required');
  assert.equal((await status('authenticated', [null, 'android', 1])).status, 'unknown');
  assert.equal((await status('authenticated', ['1.2.0', 'android', null], NEW)).status, 'ok');
  assert.equal(
    (await status('authenticated', ['1.2.0', 'android', null], OLD)).status,
    'update_required',
  );
  // Configuración inválida rechazada; los clientes no leen ni escriben la política.
  assert.ok(
    await errorOf(
      db.query(`update public.app_client_policy set min_version = 'uno' where platform = 'any'`),
    ),
  );
  assert.ok(
    await errorOf(
      db.query(
        `update public.app_client_policy set update_url = 'http://x' where platform = 'any'`,
      ),
    ),
  );
  assert.ok(
    await errorOf(
      asClient('authenticated', users.existing, NEW, () =>
        db.query(`select * from public.app_client_policy`),
      ),
    ),
  );
  assert.ok(
    await errorOf(
      asClient('authenticated', users.existing, NEW, () =>
        db.query(`update public.app_client_policy set min_version = null`),
      ),
    ),
  );
  // Volver al estado por defecto.
  await db.query(`delete from public.app_client_policy where platform = 'ios'`);
  await db.query(
    `update public.app_client_policy set min_version = null, min_curriculum_api = 0, update_url = null where platform = 'any'`,
  );
});

// --- Ruta nueva habilitada (sólo en esta base desechable) ---------------------------------------------

test(
  '3 · 4 · 5 · 9 · 10 · 11: U13/U14 publicadas y v2 habilitada',
  { timeout: 120_000 },
  async () => {
    await publish(['a1-u13', 'a1-u14']);
    // Publicadas pero la v2 apagada: ningún cliente de un usuario v1 las ve.
    for (const api of [OLD, NEW]) {
      assert.deepEqual(await pathByPosition(users.existing, api), V1, `api ${api}`);
      assert.equal(await lessonsSeen(users.existing, api, 'a1-u13'), 0);
    }
    await enableV2();

    // 4: alta desde cliente antiguo → v1 (no puede representar la v2). 5: desde cliente nuevo → v2.
    users.oldSignup = await signUp('old-on@test.dev', OLD);
    users.newSignup = await signUp('new-on@test.dev', NEW);
    users.junkSignup = await signUp('junk-on@test.dev', 'x');
    assert.deepEqual(await routeOf(users.oldSignup), {
      route_id: 'en.a1.route.v1',
      source: 'signup',
    });
    assert.deepEqual(await routeOf(users.newSignup), {
      route_id: 'en.a1.route.v2',
      source: 'signup',
    });
    assert.deepEqual(await routeOf(users.junkSignup), {
      route_id: 'en.a1.route.v1',
      source: 'signup',
    });
    // Las altas anteriores no cambian por habilitar la v2.
    assert.equal((await routeOf(users.newSignupOff)).route_id, 'en.a1.route.v1');

    // 1 · 10: usuarios v1 con cliente antiguo: el orden por posición sigue siendo U1–U12, sin U13/U14.
    for (const u of ['existing', 'oldSignupOff', 'newSignupOff', 'oldSignup']) {
      assert.deepEqual(await pathByPosition(users[u], OLD), V1, u);
      assert.equal(await lessonsSeen(users[u], OLD, 'a1-u13'), 0, u);
      assert.equal(await lessonsSeen(users[u], OLD, 'a1-u14'), 0, u);
      // 2: y con cliente nuevo también.
      assert.deepEqual(
        (await pathByRoute(users[u])).map((r) => r.unit_id),
        V1,
        u,
      );
      assert.deepEqual(await pathByPosition(users[u], NEW), V1, u);
    }
    assert.equal(
      await one(`select public.is_lesson_unlocked($1, 'a1-u13-l01') ok`, [users.existing]).then(
        (r) => r.ok,
      ),
      false,
    );

    // 3 · 11: usuario v2 con cliente nuevo: U13 en el lugar 4 y U14 en el 9.
    const v2 = await pathByRoute(users.newSignup);
    assert.deepEqual(
      v2.map((r) => r.unit_id),
      V2,
    );
    assert.deepEqual(
      v2.map((r) => r.unit_order),
      V2.map((_, i) => i + 1),
    );
    assert.equal(v2.find((r) => r.unit_id === 'a1-u13').unit_order, 4);
    assert.equal(v2.find((r) => r.unit_id === 'a1-u14').unit_order, 9);
    assert.ok(v2.every((r) => r.route_id === 'en.a1.route.v2'));
    assert.ok((await lessonsSeen(users.newSignup, NEW, 'a1-u13')) > 0);
    assert.deepEqual((await pathByPosition(users.newSignup, NEW)).sort(), [...V2].sort());

    // Usuario v2 en un cliente antiguo (otro dispositivo sin actualizar): ve sólo la v1, nunca U13/U14
    // al final. Su ruta no cambia; el desbloqueo sigue la v2 (limitación documentada en §C5).
    assert.deepEqual(await pathByPosition(users.newSignup, OLD), V1);
    assert.equal(await lessonsSeen(users.newSignup, OLD, 'a1-u13'), 0);
    assert.deepEqual(
      (await pathByRoute(users.newSignup, 0)).map((r) => r.unit_id),
      V1,
    );

    // 9: el usuario actualiza la app (cliente antiguo → nuevo, y consultas de versión): su ruta y sus
    // desbloqueos no cambian; nada de esto escribe.
    const before = {
      route: await routeOf(users.existing),
      unlock: await unlockMap(users.existing),
    };
    const assigned = await all(
      `select (to_jsonb(a) - 'assigned_at')::text r from public.user_curriculum_routes a order by 1`,
    );
    await pathByPosition(users.existing, OLD);
    await status('authenticated', ['1.0.0', 'ios', 1], NEW);
    await pathByRoute(users.existing);
    await pathByPosition(users.existing, NEW);
    assert.deepEqual(await routeOf(users.existing), before.route);
    assert.deepEqual(await unlockMap(users.existing), before.unlock);
    assert.deepEqual(
      await all(
        `select (to_jsonb(a) - 'assigned_at')::text r from public.user_curriculum_routes a order by 1`,
      ),
      assigned,
    );
    // Ningún cliente puede cambiar su asignación.
    assert.ok(
      await errorOf(
        asClient('authenticated', users.existing, NEW, () =>
          db.query(
            `update public.user_curriculum_routes set route_id = 'en.a1.route.v2' where user_id = $1`,
            [users.existing],
          ),
        ),
      ),
    );
    assert.match(
      String(
        await errorOf(
          db.query(
            `update public.user_curriculum_routes set route_id = 'en.a1.route.v2' where user_id = $1`,
            [users.existing],
          ),
        ),
      ),
      /no cambia/,
    );

    // Idiomas y niveles sin rutas: todo visible como antes, con cualquier cliente.
    const it = await asClient(
      'authenticated',
      users.existing,
      OLD,
      async () =>
        (
          await one(
            `select count(*)::int n from public.curriculum_units where language_code = 'it' and is_published`,
          )
        ).n,
    );
    assert.equal(
      it,
      (
        await one(
          `select count(*)::int n from public.curriculum_units where language_code = 'it' and is_published`,
        )
      ).n,
    );
    assert.ok(
      await errorOf(
        asClient('anon', null, OLD, () =>
          db.query(`select * from public.curriculum_visible_unit_ids()`),
        ),
      ),
    );
  },
);

test('reaplicar la C.5 no cambia nada', async () => {
  const snap = () =>
    all(`select 'q' t, (to_jsonb(q) - 'created_at')::text v from public.curriculum_route_client_requirements q
         union all select 'p', (to_jsonb(p) - 'updated_at')::text from public.app_client_policy p
         union all select 'a', (to_jsonb(a) - 'assigned_at')::text from public.user_curriculum_routes a
         union all select 'e', (to_jsonb(e) - 'updated_at')::text from public.curriculum_route_enrollment e
         order by 1, 2`);
  const before = await snap();
  await db.exec(migration(C5));
  assert.deepEqual(await snap(), before);
  assert.deepEqual(
    (await pathByRoute(users.newSignup)).map((r) => r.unit_id),
    V2,
  );
  assert.deepEqual(await pathByPosition(users.existing, OLD), V1);
});

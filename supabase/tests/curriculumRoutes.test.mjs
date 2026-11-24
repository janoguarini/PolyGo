// Fase C.4 (docs/LEARNING_PHASE_C.md §C4): versiones del recorrido curricular, asignación por usuario y
// desbloqueos por ruta (20261114120000_curriculum_routes.sql), probados en PGlite.
//
// La base se arma con todas las migraciones ANTERIORES a la C.4, se crean cuentas con progreso (las
// «existentes») y recién entonces se aplica la C.4: así se comprueba el backfill y que nadie cambia de
// recorrido ni de desbloqueos. La última parte publica U13 y U14 dentro de esta base desechable (nunca en
// otra parte) para ejercer la ruta nueva habilitada.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { helpers } from './learningHelpers.mjs';

const C4 = '20261114120000_curriculum_routes.sql';
const dir = new URL('../migrations/', import.meta.url);
const migration = (name) => readFileSync(new URL(name, dir), 'utf8');
const V1 = ['a1-u01', 'a1-u02', 'a1-u03', 'a1-u04', 'a1-u05', 'a1-u06', 'a1-u07', 'a1-u08', 'a1-u09', 'a1-u10', 'a1-u11', 'a1-u12'];
const V2 = ['a1-u01', 'a1-u02', 'a1-u03', 'a1-u13', 'a1-u04', 'a1-u05', 'a1-u06', 'a1-u07', 'a1-u14', 'a1-u08', 'a1-u09', 'a1-u10', 'a1-u11', 'a1-u12'];

let db;
let h;
/** Cuentas creadas ANTES de la C.4. */
const old = {};
/** Desbloqueo de cada lección publicada, por cuenta, antes de aplicar la C.4. */
const unlockedBefore = {};
let progressBefore;
let historyBefore;

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

/** Lecciones publicadas de unas unidades, en su orden interno. */
const lessonsOf = async (units) =>
  (
    await all(
      `select l.id from public.lessons l where l.unit_id = any($1) and l.is_published
       order by array_position($1::text[], l.unit_id), l.position`,
      [units],
    )
  ).map((r) => r.id);

async function complete(user, lessons) {
  for (const id of lessons)
    await db.query(
      `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy,
         first_completed_at, last_completed_at)
       values ($1, $2, 1, 0.9, 0.9, now() - interval '30 days', now() - interval '30 days')
       on conflict (user_id, lesson_id) do nothing`,
      [user, id],
    );
}

/** Desbloqueo de todas las lecciones publicadas (todos los idiomas y niveles) para una cuenta. */
const unlockMap = async (user) =>
  Object.fromEntries(
    (
      await all(
        `select l.id, public.is_lesson_unlocked($1, l.id) ok from public.lessons l where l.is_published order by l.id`,
        [user],
      )
    ).map((r) => [r.id, r.ok]),
  );

const unlocked = async (user, lesson) => (await one(`select public.is_lesson_unlocked($1, $2) ok`, [user, lesson])).ok;
const orderOf = async (user) =>
  (
    await all(
      `select unit_id from public.curriculum_unit_order($1) where language_code = 'en' and level = 'A1' order by ord`,
      [user],
    )
  ).map((r) => r.unit_id);
const routeOf = async (user) =>
  one(`select route_id, source from public.user_curriculum_routes where user_id = $1 and language_code = 'en' and level = 'A1'`, [user]);
const routeTables = () =>
  all(`select 'r' t, to_jsonb(r)::text v from public.curriculum_routes r
       union all select 'u', to_jsonb(u)::text from public.curriculum_route_units u
       union all select 'e', (to_jsonb(e) - 'updated_at')::text from public.curriculum_route_enrollment e
       union all select 'a', (to_jsonb(a) - 'assigned_at')::text from public.user_curriculum_routes a
       order by 1, 2`);

before(async () => {
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql') && f < C4).sort();
  db = await createDb({ files });
  h = helpers(db);
  // Cuentas existentes: hasta U3, hasta U7, y una con unidades posteriores ya desbloqueadas (U1–U10 y
  // algo de U11), más una sin progreso y una que estudia italiano.
  old.u3 = await createUser(db, 'old-u3@test.dev');
  old.u7 = await createUser(db, 'old-u7@test.dev');
  old.late = await createUser(db, 'old-late@test.dev');
  old.none = await createUser(db, 'old-none@test.dev');
  old.it = await createUser(db, 'old-it@test.dev');
  await complete(old.u3, await lessonsOf(V1.slice(0, 3)));
  await complete(old.u7, await lessonsOf(V1.slice(0, 7)));
  await complete(old.late, [...(await lessonsOf(V1.slice(0, 10))), ...(await lessonsOf(['a1-u11'])).slice(0, 3)]);
  await complete(old.it, await lessonsOf(['it-a1-u01', 'it-a1-u02']));
  for (const [k, id] of Object.entries(old)) unlockedBefore[k] = await unlockMap(id);
  progressBefore = await all(`select to_jsonb(p)::text r from public.user_lesson_progress p order by 1`);
  historyBefore = await all(
    `select (select count(*)::int from public.learning_sessions) sessions,
            (select count(*)::int from public.exercise_attempts) attempts,
            (select count(*)::int from public.user_word_progress) words,
            (select count(*)::int from public.profiles) profiles`,
  );
  await db.exec(migration(C4));
});

// --- Modelo ---------------------------------------------------------------------------------------

test('dos rutas de inglés A1: v1 (U1–U12, respaldo, habilitada) y v2 (mapa, apagada); altas a la v1', async () => {
  const routes = await all(`select id, version, fallback, enabled from public.curriculum_routes order by id`);
  assert.deepEqual(routes, [
    { id: 'en.a1.route.v1', version: 1, fallback: true, enabled: true },
    { id: 'en.a1.route.v2', version: 2, fallback: false, enabled: false },
  ]);
  const units = async (r) =>
    (await all(`select unit_id from public.curriculum_route_units where route_id = $1 order by position`, [r])).map((x) => x.unit_id);
  assert.deepEqual(await units('en.a1.route.v1'), V1);
  assert.deepEqual(await units('en.a1.route.v2'), V2);
  assert.deepEqual(await all(`select language_code, level, route_id from public.curriculum_route_enrollment`), [
    { language_code: 'en', level: 'A1', route_id: 'en.a1.route.v1' },
  ]);
  // U13 y U14 siguen sin publicar: la C.4 no cambia estados de publicación.
  const u = await all(`select id, is_published from public.curriculum_units where id in ('a1-u13', 'a1-u14') order by id`);
  assert.deepEqual(u, [
    { id: 'a1-u13', is_published: false },
    { id: 'a1-u14', is_published: false },
  ]);
  assert.deepEqual(await one(`select public.curriculum_route_problems('en.a1.route.v2') p`), {
    p: ['unidad sin publicar: a1-u13', 'unidad sin publicar: a1-u14'],
  });
});

// --- Escenarios 1, 2, 3, 7 y 12: cuentas existentes ------------------------------------------------

test('1–3 · 12: toda cuenta existente queda en la v1 (backfill) con exactamente los mismos desbloqueos', async () => {
  for (const [k, id] of Object.entries(old)) {
    assert.deepEqual(await routeOf(id), { route_id: 'en.a1.route.v1', source: 'backfill' }, k);
    assert.deepEqual(await unlockMap(id), unlockedBefore[k], `${k}: los desbloqueos cambiaron`);
    assert.deepEqual(await orderOf(id), V1, `${k}: el orden U1–U12 cambió`);
  }
  // Hasta U3: sigue U4; hasta U7: sigue U8; posteriores: lo que tenían, y U12 bloqueada como antes.
  assert.equal(await unlocked(old.u3, 'a1-u04-l01'), true);
  assert.equal(await unlocked(old.u3, 'a1-u05-l01'), false);
  assert.equal(await unlocked(old.u7, 'a1-u08-l01'), true);
  // Hizo L1, L2 y el Repaso 1 de U11: L3 es la siguiente, L4 todavía no.
  assert.equal(await unlocked(old.late, 'a1-u11-l03'), true);
  assert.equal(await unlocked(old.late, 'a1-u11-l04'), false);
  assert.equal(await unlocked(old.late, 'a1-u05-l03'), true);
  assert.equal(await unlocked(old.late, 'a1-u12-l01'), false);
  // Las demás rutas (italiano, inglés A2) no tienen rutas: orden por posición, igual que antes.
  assert.equal(await unlocked(old.it, 'it-a1-u03-l01'), true);
  assert.equal(await unlocked(old.none, 'a2-u01-l01'), true);
});

test('12: progreso, sesiones, intentos, palabras y perfiles intactos', async () => {
  assert.deepEqual(await all(`select to_jsonb(p)::text r from public.user_lesson_progress p order by 1`), progressBefore);
  assert.deepEqual(
    await all(
      `select (select count(*)::int from public.learning_sessions) sessions,
              (select count(*)::int from public.exercise_attempts) attempts,
              (select count(*)::int from public.user_word_progress) words,
              (select count(*)::int from public.profiles) profiles`,
    ),
    historyBefore,
  );
});

test('7: actualizar la app no cambia nada: la ruta es del servidor y la app lee la suya', async () => {
  const seen = await as(db, 'authenticated', old.u7, async () =>
    (await db.query(`select unit_id, unit_order, route_id from public.my_curriculum_route('en') where level = 'A1'`)).rows,
  );
  assert.deepEqual(
    seen.map((r) => [r.unit_id, r.unit_order, r.route_id]),
    V1.map((u, i) => [u, i + 1, 'en.a1.route.v1']),
  );
  // A2 (sin rutas) llega por posición, sin ruta.
  const a2 = await as(db, 'authenticated', old.u7, async () =>
    (await db.query(`select unit_order, route_id from public.my_curriculum_route('en') where level = 'A2' order by unit_order`)).rows,
  );
  assert.deepEqual(a2[0], { unit_order: 1, route_id: null });
  // Cada usuario ve sólo su asignación; anon no puede leer rutas ni llamar a la función.
  const mine = await as(db, 'authenticated', old.u7, async () =>
    (await db.query(`select count(*)::int n from public.user_curriculum_routes`)).rows[0],
  );
  assert.equal(mine.n, 1);
  assert.ok(await errorOf(as(db, 'anon', null, () => db.query(`select * from public.my_curriculum_route('en')`))));
  assert.ok(await errorOf(as(db, 'authenticated', old.u7, () => db.query(`select public.curriculum_enable_route('en.a1.route.v1')`))));
  assert.ok(await errorOf(as(db, 'authenticated', old.u7, () => db.query(`select public.is_lesson_unlocked($1, 'a1-u01-l01')`, [old.u7]))));
});

// --- Escenarios 4 y 6 -------------------------------------------------------------------------------

test('4: una alta nueva con la ruta nueva sin habilitar recibe la v1 (signup), para siempre', async () => {
  const user = await createUser(db, 'new-before@test.dev');
  assert.deepEqual(await routeOf(user), { route_id: 'en.a1.route.v1', source: 'signup' });
  assert.deepEqual(await orderOf(user), V1);
  assert.equal(await unlocked(user, 'a1-u01-l01'), true);
  assert.equal(await unlocked(user, 'a1-u13-l01'), false);
  old.newBefore = user;
});

test('6: habilitar la v2 con U13 y U14 en borrador falla, por la función y por escritura directa', async () => {
  const sneaky = await createUser(db, 'sneaky@test.dev');
  const before = await routeTables();
  const err = await errorOf(h.service(() => db.query(`select public.curriculum_enable_route('en.a1.route.v2')`)));
  assert.match(String(err?.message), /no está lista: unidad sin publicar: a1-u13; unidad sin publicar: a1-u14/);
  assert.match(String(await errorOf(db.query(`update public.curriculum_routes set enabled = true where id = 'en.a1.route.v2'`))), /no está lista/);
  assert.match(
    String(await errorOf(db.query(`update public.curriculum_route_enrollment set route_id = 'en.a1.route.v2'`))),
    /no está habilitada/,
  );
  // Una asignación escrita a mano a la v2 tampoco entra (sin su fila, la cuenta queda en el respaldo).
  await db.exec('begin');
  try {
    await db.query(`delete from public.user_curriculum_routes where user_id = $1`, [sneaky]);
    await db.exec('savepoint s');
    assert.match(
      String(
        await errorOf(
          db.query(`insert into public.user_curriculum_routes (user_id, language_code, level, route_id, source)
                    values ($1, 'en', 'A1', 'en.a1.route.v2', 'signup')`, [sneaky]),
        ),
      ),
      /en.a1.route.v2 no está habilitada/,
    );
    await db.exec('rollback to savepoint s');
    assert.deepEqual(await orderOf(sneaky), V1);
  } finally {
    await db.exec('rollback');
  }
  // Con una sola unidad publicada tampoco alcanza.
  await db.exec('begin');
  try {
    await db.query(`update public.curriculum_units set is_published = true where id = 'a1-u13'`);
    await db.query(`update public.lessons set is_published = true where unit_id = 'a1-u13' and id <> 'a1-u13-context'`);
    const e2 = await errorOf(db.query(`select public.curriculum_enable_route('en.a1.route.v2')`));
    assert.match(String(e2?.message), /unidad sin publicar: a1-u14/);
  } finally {
    await db.exec('rollback');
  }
  assert.deepEqual(await routeTables(), before);
});

// --- Inmutabilidad, idempotencia y datos inconsistentes ---------------------------------------------

test('la asignación y las rutas no se modifican; una ruta habilitada no se deshabilita', async () => {
  assert.match(String(await errorOf(db.query(`update public.user_curriculum_routes set source = 'signup' where user_id = $1`, [old.u3]))), /no cambia/);
  assert.match(String(await errorOf(db.query(`update public.curriculum_route_units set position = 99 where unit_id = 'a1-u01'`))), /no se modifica/);
  assert.match(String(await errorOf(db.query(`delete from public.curriculum_route_units where route_id = 'en.a1.route.v2'`))), /no se modifica/);
  assert.match(String(await errorOf(db.query(`delete from public.curriculum_routes where id = 'en.a1.route.v2'`))), /no se borra/);
  assert.match(String(await errorOf(db.query(`update public.curriculum_routes set enabled = false where id = 'en.a1.route.v1'`))), /no se deshabilita/);
  assert.match(String(await errorOf(db.query(`update public.curriculum_routes set fallback = true where id = 'en.a1.route.v2'`))), /respaldo no cambia/);
  assert.match(String(await errorOf(db.query(`delete from public.curriculum_route_enrollment`))), /no se borra/);
  // De otro idioma o nivel, no.
  assert.match(
    String(await errorOf(db.query(`insert into public.curriculum_route_units values ('en.a1.route.v2', 'a2-u01', 15)`))),
    /no es de en.a1.route.v2/,
  );
  // Borrar la cuenta sí borra su asignación.
  const gone = await createUser(db, 'gone@test.dev');
  await db.query(`delete from auth.users where id = $1`, [gone]);
  assert.equal((await one(`select count(*)::int n from public.user_curriculum_routes where user_id = $1`, [gone])).n, 0);
});

test('reaplicar la migración no cambia nada', async () => {
  const before = await routeTables();
  const unlock = await unlockMap(old.late);
  await db.exec(migration(C4));
  assert.deepEqual(await routeTables(), before);
  assert.deepEqual(await unlockMap(old.late), unlock);
});

test('datos inconsistentes: sin asignación, respaldo v1; una ruta cargada distinta hace abortar la migración', async () => {
  await db.exec('begin');
  try {
    await db.exec('alter table public.user_curriculum_routes disable trigger user_curriculum_routes_guard');
    await db.query(`delete from public.user_curriculum_routes where user_id = $1`, [old.u7]);
    assert.deepEqual(await orderOf(old.u7), V1);
    assert.deepEqual(await unlockMap(old.u7), unlockedBefore.u7);
  } finally {
    await db.exec('rollback');
  }
  await db.exec('begin');
  try {
    await db.exec('alter table public.curriculum_route_units disable trigger curriculum_route_units_guard');
    await db.query(`delete from public.curriculum_route_units where route_id = 'en.a1.route.v2' and unit_id = 'a1-u14'`);
    const err = await errorOf(db.exec(migration(C4)));
    assert.match(String(err?.message), /en.a1.route.v2 no es la del mapa/);
  } finally {
    await db.exec('rollback');
  }
});

// --- Escenarios 5, 8–11: ruta nueva habilitada (sólo en esta base desechable) ----------------------

test('5 · 8–11: con U13 y U14 publicadas y la v2 habilitada, las altas nuevas siguen el mapa', { timeout: 120_000 }, async () => {
  for (const u of ['a1-u13', 'a1-u14']) {
    await db.query(`update public.curriculum_units set is_published = true where id = $1`, [u]);
    await db.query(`update public.words set is_published = true where unit_id = $1`, [u]);
    // Las lecciones escritas y su consolidación; la «En contexto» sigue en borrador (fase C).
    await db.query(`update public.lessons set is_published = true where unit_id = $1 and id not like '%-context'`, [u]);
    await db.query(
      `update public.exercises set is_published = true where lesson_id in
         (select id from public.lessons where unit_id = $1 and id not like '%-context')`,
      [u],
    );
  }
  assert.deepEqual(await one(`select public.curriculum_route_problems('en.a1.route.v2') p`), { p: [] });
  // Publicar no cambia a nadie: todavía no está habilitada.
  const early = await createUser(db, 'new-published-not-enabled@test.dev');
  assert.deepEqual(await routeOf(early), { route_id: 'en.a1.route.v1', source: 'signup' });
  assert.deepEqual(await orderOf(early), V1);

  const r = await h.service(async () => (await db.query(`select public.curriculum_enable_route('en.a1.route.v2') r`)).rows[0].r);
  assert.deepEqual(r, { route_id: 'en.a1.route.v2', language_code: 'en', level: 'A1' });

  // 5: alta nueva → v2, en el orden del mapa; la app recibe ese orden (U13 es la unidad 4).
  const user = await createUser(db, 'new-v2@test.dev');
  assert.deepEqual(await routeOf(user), { route_id: 'en.a1.route.v2', source: 'signup' });
  assert.deepEqual(await orderOf(user), V2);
  const seen = await as(db, 'authenticated', user, async () =>
    (await db.query(`select unit_id, unit_order from public.my_curriculum_route('en') where level = 'A1' order by unit_order`)).rows,
  );
  assert.deepEqual(seen.map((x) => x.unit_id), V2);
  assert.equal(seen.find((x) => x.unit_id === 'a1-u13').unit_order, 4);

  // 8: completa U3 → U13 desbloqueada; U4 queda detrás de U13.
  await complete(user, await lessonsOf(V2.slice(0, 3)));
  assert.equal(await unlocked(user, 'a1-u13-l01'), true);
  assert.equal(await unlocked(user, 'a1-u04-l01'), false);
  // El servidor es la autoridad: la lección se empieza por learning_lesson_plan y U4 se rechaza.
  assert.ok((await h.startLesson(user, randomUUID(), 'a1-u13-l01')).presentations.length > 0);
  assert.match(String((await errorOf(h.startLesson(user, randomUUID(), 'a1-u04-l01')))?.message), /lesson_locked/);

  // 9: completa U13 → U4.
  const u13 = await lessonsOf(['a1-u13']);
  assert.equal(u13.length, 10);
  await complete(user, u13.slice(0, -1));
  assert.equal(await unlocked(user, 'a1-u04-l01'), false, 'falta el repaso final de U13');
  await complete(user, u13.slice(-1));
  assert.equal(await unlocked(user, 'a1-u04-l01'), true);

  // 10: completa U7 → U14; U8 queda detrás de U14.
  await complete(user, await lessonsOf(['a1-u04', 'a1-u05', 'a1-u06', 'a1-u07']));
  assert.equal(await unlocked(user, 'a1-u14-l01'), true);
  assert.equal(await unlocked(user, 'a1-u08-l01'), false);

  // 11: completa U14 → U8; el resto sigue el orden de siempre.
  await complete(user, await lessonsOf(['a1-u14']));
  assert.equal(await unlocked(user, 'a1-u08-l01'), true);
  assert.equal(await unlocked(user, 'a1-u09-l01'), false);

  // Las cuentas de la v1 no cambian aunque la v2 esté habilitada y U13/U14 publicadas.
  for (const [k, id] of Object.entries(old)) {
    if (k === 'newBefore') continue;
    assert.equal((await routeOf(id)).route_id, 'en.a1.route.v1', k);
    assert.deepEqual(await unlockMap(id).then((m) => Object.fromEntries(Object.entries(m).filter(([l]) => !/^a1-u1[34]-/.test(l)))), unlockedBefore[k], k);
    assert.equal(await unlocked(id, 'a1-u13-l01'), false, `${k} no ve U13`);
  }
  assert.equal((await routeOf(old.newBefore)).route_id, 'en.a1.route.v1');
  assert.equal(await unlocked(old.u3, 'a1-u04-l01'), true, 'la v1 sigue U3 → U4');
  assert.equal(await unlocked(old.u7, 'a1-u08-l01'), true, 'la v1 sigue U7 → U8');
  assert.match(String((await errorOf(h.startLesson(old.u3, randomUUID(), 'a1-u13-l01')))?.message), /lesson_locked/);

  // Falla segura: si U13 deja de estar publicada, la cadena la salta y nadie de la v2 queda atrapado.
  const trapped = await createUser(db, 'fail-safe@test.dev');
  assert.equal((await routeOf(trapped)).route_id, 'en.a1.route.v2');
  await complete(trapped, await lessonsOf(V2.slice(0, 3)));
  assert.equal(await unlocked(trapped, 'a1-u04-l01'), false);
  await db.query(`update public.curriculum_units set is_published = false where id = 'a1-u13'`);
  assert.deepEqual(await orderOf(trapped), V2.filter((u) => u !== 'a1-u13'));
  assert.equal(await unlocked(trapped, 'a1-u04-l01'), true, 'U3 → U4 sin U13 publicada');
  assert.equal(await unlocked(user, 'a1-u08-l01'), true, 'lo ya desbloqueado se conserva');
  // Mientras tanto la v2 no está lista: volver a habilitarla falla.
  assert.match(String(await errorOf(db.query(`select public.curriculum_enable_route('en.a1.route.v2')`))), /unidad sin publicar: a1-u13/);
  await db.query(`update public.curriculum_units set is_published = true where id = 'a1-u13'`);

  // Una ruta con altas no se deshabilita; volver a inscribir en la v1 sí se puede (y no mueve a nadie).
  assert.match(String(await errorOf(db.query(`update public.curriculum_routes set enabled = false where id = 'en.a1.route.v2'`))), /no se deshabilita/);
  await h.service(() => db.query(`select public.curriculum_enable_route('en.a1.route.v1')`));
  const after = await createUser(db, 'after-rollback@test.dev');
  assert.equal((await routeOf(after)).route_id, 'en.a1.route.v1');
  assert.equal((await routeOf(user)).route_id, 'en.a1.route.v2');
  assert.equal((await routeOf(trapped)).route_id, 'en.a1.route.v2');
});

// Panel Superadmin (20270101120000_superadmin_panel.sql): seguridad primero, después cálculos.
//
// La base se arma como en producción: la cuenta de janitogap (y las dos internas) existen ANTES de
// la migración, así la migración carga el superadmin y las cuentas internas por UID.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser } from './harness.mjs';
import { TIERS } from '../../shared/ranking.ts';

const ADMIN = '267762e4-8145-4e48-900b-9b14ccefb59b';
const HOLA = '4540f36f-73e5-447e-95a6-8a0c1682b40d';
const TESTER = '41ee39d6-cce1-404b-aef7-adbf93cb6cd9';

let db;
let today;
let normal; // usuario común
let r1; // usuario real con Plus de tienda, lección y repaso
let r2; // usuario real que juega Ranked

const AUTH_COLUMNS = `
  alter table auth.users add column if not exists last_sign_in_at timestamptz;
  alter table auth.users add column if not exists raw_app_meta_data jsonb;
  alter table auth.users add column if not exists email_confirmed_at timestamptz;
`;

async function internalUsersFirst(d) {
  await d.exec(AUTH_COLUMNS);
  await d.query(
    `insert into auth.users (id, email, raw_app_meta_data, email_confirmed_at, last_sign_in_at)
     values ($1, 'admin@test.dev', '{"providers":["email","google"]}', now(), now()),
            ($2, 'hola@test.dev', '{"providers":["email"]}', now(), now()),
            ($3, 'tester@test.dev', '{"providers":["email"]}', now(), now())`,
    [ADMIN, HOLA, TESTER],
  );
}

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

/** Ejecuta sql con un rol y un JWT simulados (sub + aal), como PostgREST. */
async function asUser(role, uid, aal, sql, params = []) {
  await db.exec(`set role ${role}`);
  await db.query(
    `select set_config('request.jwt.claim.sub', $1, false), set_config('request.jwt.claims', $2, false)`,
    [uid ?? '', uid ? JSON.stringify({ sub: uid, role, aal }) : ''],
  );
  try {
    return (await db.query(sql, params)).rows[0];
  } finally {
    await db.exec('reset role');
    await db.query(
      `select set_config('request.jwt.claim.sub', '', false), set_config('request.jwt.claims', '', false)`,
    );
  }
}

const asAdmin = (sql, params) => asUser('authenticated', ADMIN, 'aal2', sql, params);

const rejects = (promise, pattern) =>
  assert.rejects(promise, (err) => {
    assert.match(String(err.message), pattern);
    return true;
  });

/** Cada RPC del panel con argumentos válidos (agregar acá toda public.admin_* nueva). */
function rpcs() {
  const range = [today, today, '{}'];
  return [
    ['admin_filter_options()', []],
    ['admin_overview($1, $2, $3)', range],
    ['admin_growth($1, $2, $3)', range],
    ['admin_users_list($1, $2, $3, $4, $5, $6)', [null, '{}', true, 'created_desc', 50, 0]],
    ['admin_user_detail($1)', [ADMIN]],
    ['admin_user_battles($1, $2, $3)', [ADMIN, 25, 0]],
    ['admin_learning($1, $2, $3, $4)', [today, today, '{}', 1]],
    ['admin_ranked($1, $2, $3)', range],
    ['admin_leaderboard($1, $2, $3)', [null, true, 50]],
    ['admin_retention($1, $2, $3, $4)', [today, today, '{}', null]],
    ['admin_social($1, $2, $3)', range],
    ['admin_monetization($1, $2, $3)', range],
    ['admin_marketing($1, $2)', [today, today]],
    ['admin_notifications($1, $2, $3)', range],
    ['admin_health()', []],
    ['admin_content($1)', [null]],
    ['admin_audit($1, $2)', [50, 0]],
  ];
}

const callRpc = (role, uid, aal, [sig, params]) =>
  asUser(role, uid, aal, `select public.${sig} as r`, params);

before(async () => {
  db = await createDb({ beforeMigrations: internalUsersFirst });
  // Las cuentas internas existían antes de la migración: el trigger de alta no corrió para ellas.
  for (const [id, username] of [
    [ADMIN, 'janitogap'],
    [HOLA, 'hola'],
    [TESTER, 'janotester'],
  ]) {
    await db.query(
      `insert into public.profiles (id, public_code, username, onboarding_completed_at)
       values ($1, public.generate_public_code(), $2, now())`,
      [id, username],
    );
    await db.query('insert into public.user_settings (user_id) values ($1)', [id]);
  }
  today = (await one('select admin.today()::text as d')).d;
  normal = await createUser(db, 'normal@test.dev');
  r1 = await createUser(db, 'r1@test.dev');
  r2 = await createUser(db, 'r2@test.dev');
  await db.query(`update public.profiles set username = 'normal' where id = $1`, [normal]);
  await db.query(`update public.profiles set username = 'real_uno', region = 'AR' where id = $1`, [r1]);
  await db.query(`update public.profiles set username = 'real_dos', region = 'MX' where id = $1`, [r2]);
});

// =====================================================================================
// 1. Superadmin exclusivo
// =====================================================================================

test('la migración carga exactamente un superadmin: el UID de janitogap', async () => {
  const { rows } = await db.query('select user_id::text, label from admin.superadmins');
  assert.deepEqual(rows, [{ user_id: ADMIN, label: 'janitogap' }]);
  const internal = await db.query('select user_id::text from admin.internal_accounts order by label');
  assert.deepEqual(
    internal.rows.map((r) => r.user_id),
    [HOLA, ADMIN, TESTER],
  );
  assert.equal((await one('select admin.superadmin_uid()::text as u')).u, ADMIN);
});

test('sin la cuenta de janitogap la migración no falla y no hay superadmin', async () => {
  const bare = await createDb();
  const { rows } = await bare.query('select count(*)::int as n from admin.superadmins');
  assert.equal(rows[0].n, 0);
  await bare.close();
});

// =====================================================================================
// 2. Catálogo: nadie puede tocar el schema admin; toda RPC tiene guardia
// =====================================================================================

test('schema admin: sin USAGE ni privilegios para public, anon y authenticated', async () => {
  for (const role of ['anon', 'authenticated']) {
    assert.equal((await one(`select has_schema_privilege($1, 'admin', 'USAGE') as ok`, [role])).ok, false);
    const { rows } = await db.query(
      `select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'admin' and c.relkind = 'r'
         and (has_table_privilege($1, c.oid, 'SELECT') or has_table_privilege($1, c.oid, 'INSERT')
              or has_table_privilege($1, c.oid, 'UPDATE') or has_table_privilege($1, c.oid, 'DELETE'))`,
      [role],
    );
    assert.deepEqual(rows, [], `${role} tiene privilegios en tablas admin`);
    const fns = await db.query(
      `select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'admin' and has_function_privilege($1, p.oid, 'EXECUTE')`,
      [role],
    );
    assert.deepEqual(fns.rows, [], `${role} puede ejecutar funciones admin.*`);
  }
  const rls = await db.query(
    `select c.relname, c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'admin' and c.relkind = 'r' order by 1`,
  );
  assert.ok(rls.rows.length === 4 && rls.rows.every((r) => r.relrowsecurity));
});

test('toda public.admin_*: SECURITY DEFINER, search_path vacío, sólo authenticated, guardia primero', async () => {
  const { rows } = await db.query(
    `select p.proname, p.prosecdef, p.proconfig, pg_get_functiondef(p.oid) def,
            has_function_privilege('anon', p.oid, 'EXECUTE') anon_exec,
            has_function_privilege('authenticated', p.oid, 'EXECUTE') auth_exec,
            exists (select 1 from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
                    where a.grantee = 0 and a.privilege_type = 'EXECUTE') public_exec
     from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname like 'admin\\_%' order by 1`,
  );
  const names = rows.map((r) => r.proname);
  // El test cubre todas: una RPC nueva sin agregar a rpcs() hace fallar esto.
  assert.deepEqual(
    names.filter((n) => n !== 'admin_session_check').sort(),
    rpcs()
      .map(([sig]) => sig.slice(0, sig.indexOf('(')))
      .sort(),
  );
  for (const r of rows) {
    assert.equal(r.prosecdef, true, `${r.proname} no es security definer`);
    assert.ok(r.proconfig?.some((c) => c === 'search_path=""' || c === 'search_path='), r.proname);
    assert.equal(r.anon_exec, false, `${r.proname}: anon puede ejecutar`);
    assert.equal(r.public_exec, false, `${r.proname}: PUBLIC puede ejecutar`);
    assert.equal(r.auth_exec, true, `${r.proname}: authenticated no puede ejecutar`);
    if (r.proname !== 'admin_session_check') {
      assert.match(
        r.def,
        /\nbegin\s+perform admin\.assert_superadmin\(/,
        `${r.proname}: la guardia no es la primera sentencia`,
      );
    }
  }
});

// =====================================================================================
// 3. Accesos denegados
// =====================================================================================

test('anon (sin login) no puede ejecutar ninguna RPC del panel', async () => {
  for (const rpc of [['admin_session_check()', []], ...rpcs()]) {
    await rejects(callRpc('anon', null, null, rpc), /permission denied/);
  }
});

test('usuario común (aal1 y aal2) recibe admin_forbidden en todas las RPC', async () => {
  for (const aal of ['aal1', 'aal2']) {
    for (const rpc of rpcs()) {
      await rejects(callRpc('authenticated', normal, aal, rpc), /admin_forbidden/);
    }
  }
});

test('las cuentas internas (hola, janotester) tampoco son administradoras', async () => {
  for (const uid of [HOLA, TESTER]) {
    for (const rpc of rpcs()) {
      await rejects(callRpc('authenticated', uid, 'aal2', rpc), /admin_forbidden/);
    }
  }
});

test('session_check: usuario común → forbidden, sin datos, y deja un evento de seguridad (con límite)', async () => {
  const before = (await one(`select count(*)::int n from admin.security_events where user_id = $1`, [normal])).n;
  for (let i = 0; i < 3; i++) {
    const { r } = await asUser('authenticated', normal, 'aal2', 'select public.admin_session_check() as r');
    assert.deepEqual(r, { allowed: false, reason: 'forbidden' });
  }
  const after = await db.query(
    `select event from admin.security_events where user_id = $1 order by id`,
    [normal],
  );
  assert.equal(after.rows.length - before, 1, 'tres intentos seguidos = un solo registro');
  assert.equal(after.rows.at(-1).event, 'denied_not_admin');
});

test('nadie puede darse el rol: ni escribir admin.*, ni llamar la guardia, ni hacerse pasar por username', async () => {
  const attempts = [
    [`insert into admin.superadmins (user_id, label) values ($1, 'yo')`, [normal]],
    [`select * from admin.superadmins`, []],
    [`insert into admin.internal_accounts (user_id, label) values ($1, 'x')`, [normal]],
    [`delete from admin.audit_log`, []],
    [`select * from admin.security_events`, []],
    [`select admin.assert_superadmin('x')`, []],
    [`select admin.caller_is_superadmin()`, []],
  ];
  for (const [sql, params] of attempts) {
    await rejects(asUser('authenticated', normal, 'aal2', sql, params), /permission denied/);
  }
  // El username no es editable por el usuario y el nombre visible no da permisos.
  await rejects(
    asUser('authenticated', normal, 'aal2', `update public.profiles set username = 'janitogap2' where id = $1`, [normal]),
    /permission denied/,
  );
  await asUser('authenticated', normal, 'aal2', `update public.profiles set display_name = 'janitogap' where id = $1`, [normal]);
  await rejects(callRpc('authenticated', normal, 'aal2', rpcs()[1]), /admin_forbidden/);
  // Ninguna RPC del panel recibe un usuario/rol para decidir el acceso.
  const { rows } = await db.query(
    `select p.proname, coalesce(p.proargnames, '{}') args from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname like 'admin\\_%'`,
  );
  for (const r of rows) {
    assert.ok(!r.args.some((a) => /username|role|admin|aal|uid/i.test(a)), `${r.proname}: ${r.args}`);
  }
  assert.equal((await one('select count(*)::int n from admin.superadmins')).n, 1);
});

// =====================================================================================
// 4. Sin MFA (20270102120000_superadmin_no_mfa): alcanza con la sesión de janitogap
// =====================================================================================

test('janitogap sin MFA (aal1 o sin claim) accede a todas las RPC', async () => {
  for (const aal of ['aal1', undefined]) {
    for (const rpc of rpcs()) {
      const { r } = await callRpc('authenticated', ADMIN, aal, rpc);
      assert.ok(r && typeof r === 'object', `${rpc[0]} (${aal ?? 'sin aal'})`);
    }
  }
  const { r } = await asUser('authenticated', ADMIN, 'aal1', 'select public.admin_session_check() as r');
  assert.equal(r.allowed, true);
  assert.equal(r.reason, 'ok');
});

test('la guardia ya no mira el aal; sigue exigiendo UID fijo + fila en superadmins', async () => {
  const def = (await one(`select pg_get_functiondef('admin.assert_superadmin(text,jsonb)'::regprocedure) d`)).d;
  assert.doesNotMatch(def, /aal2/);
  assert.match(def, /admin\.caller_is_superadmin\(\)/);
  const caller = (await one(`select pg_get_functiondef('admin.caller_is_superadmin()'::regprocedure) d`)).d;
  assert.match(caller, /admin\.superadmin_uid\(\)/);
  assert.match(caller, /admin\.superadmins/);
  // Los permisos no cambiaron con el create or replace.
  for (const role of ['anon', 'authenticated']) {
    assert.equal(
      (await one(`select has_function_privilege($1, 'admin.assert_superadmin(text,jsonb)', 'EXECUTE') ok`, [role])).ok,
      false,
    );
  }
  assert.equal(
    (await one(`select has_function_privilege('anon', 'public.admin_session_check()', 'EXECUTE') ok`)).ok,
    false,
  );
});

// =====================================================================================
// 5. Acceso autorizado
// =====================================================================================

test('janitogap accede a todas las RPC y queda auditado', async () => {
  const { r } = await asAdmin('select public.admin_session_check() as r');
  assert.equal(r.allowed, true);
  assert.equal(r.username, 'janitogap');
  assert.equal(r.time_zone, 'America/Argentina/Buenos_Aires');
  for (const rpc of rpcs()) {
    const { r: out } = await callRpc('authenticated', ADMIN, 'aal2', rpc);
    assert.ok(out && typeof out === 'object', rpc[0]);
  }
  const actions = await db.query(`select distinct action from admin.audit_log where user_id = $1`, [ADMIN]);
  assert.ok(actions.rows.length >= rpcs().length);
  // La misma lectura repetida en menos de un minuto se registra una vez.
  const n0 = (await one(`select count(*)::int n from admin.audit_log where action = 'health'`)).n;
  await asAdmin('select public.admin_health()');
  await asAdmin('select public.admin_health()');
  assert.equal((await one(`select count(*)::int n from admin.audit_log where action = 'health'`)).n, n0);
});

test('validaciones: período inválido, orden inválido y segmento inválido', async () => {
  await rejects(asAdmin('select public.admin_overview($1, $2)', ['2026-02-01', '2026-01-01']), /admin_bad_range/);
  await rejects(asAdmin('select public.admin_overview($1, $2)', ['2020-01-01', '2026-01-01']), /admin_bad_range/);
  await rejects(
    asAdmin(`select public.admin_users_list(null, '{}', true, 'id; drop table x', 10, 0)`),
    /admin_bad_sort/,
  );
  await rejects(
    asAdmin('select public.admin_retention($1, $1, $2, $3)', [today, '{}', 'email']),
    /admin_bad_segment/,
  );
});

// =====================================================================================
// 6. Cálculos con datos conocidos
// =====================================================================================

async function lessonFixture() {
  return one(
    `select l.id lesson_id, cu.language_code, cu.level,
            (select e.id from public.exercises e where e.lesson_id = l.id and e.is_published order by e.position limit 1) exercise_id
     from public.lessons l join public.curriculum_units cu on cu.id = l.unit_id
     where l.is_published and cu.is_published and cu.language_code = 'en'
       and exists (select 1 from public.exercises e where e.lesson_id = l.id and e.is_published)
     order by cu.position, l.position limit 1`,
  );
}

async function session(user, kind, lessonId, firstTry = [3, 4]) {
  const { id } = await one(
    `insert into public.learning_sessions (id, user_id, kind, lesson_id, started_at, completed_at, duration_seconds,
       total_answers, first_try_total, first_try_correct, local_date)
     values (gen_random_uuid(), $1, $2, $3, now() - interval '5 minutes', now(), 300, 4, $5, $4, $6::date) returning id`,
    [user, kind, kind === 'lesson' ? lessonId : null, firstTry[0], firstTry[1], today],
  );
  return id;
}

async function botBattle(user, result, ratingBefore, ratingAfter) {
  const { id } = await one(
    `insert into public.battles (language_code, mode, is_ranked, status, protocol_version, started_at, ended_at, has_bot)
     values ('en', 'word_rush', true, 'completed', 1, now() - interval '2 minutes', now(), true) returning id`,
  );
  await db.query(
    `insert into public.battle_players (battle_id, slot, user_id, rating_before, rating_after, result,
       correct_answers, total_answers, score)
     values ($1, 1, $2, $3, $4, $5, 8, 10, 120)`,
    [id, user, ratingBefore, ratingAfter, result],
  );
  await db.query(
    `insert into public.battle_players (battle_id, slot, user_id, bot_name, result, correct_answers, total_answers, score)
     values ($1, 2, null, 'Bot', $2, 5, 10, 80)`,
    [id, result === 'win' ? 'loss' : 'win'],
  );
  await db.query(
    `insert into public.rating_history (user_id, language_code, season_id, battle_id, reason, rating_before, rating_after)
     values ($1, 'en', (select id from public.seasons where status = 'active'), $2, 'battle', $3, $4)`,
    [user, id, ratingBefore, ratingAfter],
  );
  // Lo que hace la liquidación de la partida en producción.
  await db.query(
    `insert into public.player_ratings (user_id, language_code, rating, peak_rating, games_played, wins, losses)
     values ($1, 'en', $2, $2, 1, $3, $4)
     on conflict (user_id, language_code) do update
       set rating = excluded.rating, peak_rating = greatest(public.player_ratings.peak_rating, excluded.rating),
           games_played = public.player_ratings.games_played + 1,
           wins = public.player_ratings.wins + excluded.wins, losses = public.player_ratings.losses + excluded.losses`,
    [user, ratingAfter, result === 'win' ? 1 : 0, result === 'loss' ? 1 : 0],
  );
  return id;
}

test('métricas: excluyen cuentas internas, cuentan lo real y no inventan ingresos', async () => {
  const fx = await lessonFixture();
  assert.ok(fx?.lesson_id && fx.exercise_id, 'hay contenido publicado en las migraciones');

  // r1: lección + repaso, 3 respuestas (2 bien), Plus de App Store.
  const s1 = await session(r1, 'lesson', fx.lesson_id, [3, 4]);
  await session(r1, 'review', null, [1, 2]);
  for (const ok of [true, true, false]) {
    await db.query(
      `insert into public.exercise_attempts (session_id, user_id, exercise_id, skill, answer, is_correct, is_first_try, response_ms)
       values ($1, $2, $3, 'reading', 'x', $4, true, 2000)`,
      [s1, r1, fx.exercise_id, ok],
    );
  }
  await db.query(
    `insert into public.user_entitlements (user_id, entitlement, source, starts_at, expires_at, product_id, will_renew)
     values ($1, 'plus', 'app_store', now() - interval '1 hour', now() + interval '30 days', 'polygo_plus_monthly', false)`,
    [r1],
  );
  // r2: una partida Ranked contra bot, gana y sube de Bronce a Plata.
  await botBattle(r2, 'win', 390, 410);
  // janitogap (interno): lección, partida y Plus manual + de tienda → no deben contar.
  await session(ADMIN, 'lesson', fx.lesson_id);
  await botBattle(ADMIN, 'loss', 500, 480);
  await db.query(
    `insert into public.user_entitlements (user_id, entitlement, source, starts_at, expires_at)
     values ($1, 'plus', 'manual', now() - interval '1 day', now() + interval '1 day')`,
    [ADMIN],
  );

  const realUsers = (
    await one(
      `select count(*)::int n from public.profiles p
       where not exists (select 1 from admin.internal_accounts i where i.user_id = p.id)`,
    )
  ).n;

  const { r: ov } = await asAdmin('select public.admin_overview($1, $1) as r', [today]);
  assert.equal(ov.snapshot.total_users, realUsers);
  assert.equal(ov.snapshot.dau, 2, 'r1 y r2; janitogap no cuenta');
  assert.equal(ov.snapshot.plus_users, 1);
  assert.equal(ov.snapshot.paid_plus_users, 1);
  assert.equal(ov.current.lessons_completed, 1);
  assert.equal(ov.current.reviews_completed, 1);
  assert.equal(ov.current.exercises_answered, 3);
  assert.equal(ov.current.battles, 1);
  assert.equal(ov.current.battles_vs_bot, 1);
  assert.equal(ov.current.paid_subs_started, 1);
  assert.equal(ov.series.length, 1);
  assert.equal(ov.series[0].active, 2);
  assert.ok(ov.unavailable.mrr, 'MRR no se inventa');

  const { r: lr } = await asAdmin(`select public.admin_learning($1, $1, '{}', 1) as r`, [today]);
  assert.equal(lr.totals.answers, 3);
  assert.equal(lr.totals.correct, 2);
  assert.equal(Number(lr.totals.accuracy), 66.7);
  assert.equal(Number(lr.totals.first_try_accuracy), 66.7); // (3 + 1) / (4 + 2)
  assert.equal(lr.by_course[0].language, 'en');
  assert.equal(lr.hardest_exercises[0].exercise_id, fx.exercise_id);

  const { r: rk } = await asAdmin('select public.admin_ranked($1, $1) as r', [today]);
  assert.equal(rk.totals.battles, 1);
  assert.equal(rk.totals.players, 1);
  assert.equal(rk.totals.wins, 1);
  assert.equal(rk.totals.losses, 0, 'la derrota de janitogap no cuenta');
  assert.equal(Number(rk.totals.win_rate_vs_bot), 100);
  assert.equal(rk.elo.promotions, 1);
  assert.equal(Number(rk.totals.accuracy), 80);

  const { r: lbAll } = await asAdmin('select public.admin_leaderboard(null, true, 50) as r');
  assert.ok(lbAll.some((x) => x.user_id === ADMIN && x.internal === true));
  const { r: lbReal } = await asAdmin('select public.admin_leaderboard(null, false, 50) as r');
  assert.ok(!lbReal.some((x) => x.internal));

  const { r: mon } = await asAdmin('select public.admin_monetization($1, $1) as r', [today]);
  assert.equal(mon.plus.active_paid, 1);
  assert.equal(mon.plus.will_not_renew, 1);
  assert.deepEqual(mon.plus.by_source, [{ source: 'app_store', active: 1 }], 'el Plus manual interno no aparece');
  assert.ok(mon.unavailable.revenue);
});

test('usuarios: búsqueda, filtros, internas marcadas y ficha sin email ni tokens', async () => {
  const { r: found } = await asAdmin(`select public.admin_users_list('janitogap', '{}', true, 'username', 10, 0) as r`);
  // Encuentra la cuenta (marcada interna) y también al usuario común que se puso ese nombre visible.
  assert.equal(found.rows.find((x) => x.username === 'janitogap').internal, true);
  assert.ok(found.rows.some((x) => x.username === 'normal' && !x.internal));
  const { r: hidden } = await asAdmin(`select public.admin_users_list('janitogap', '{}', false, 'username', 10, 0) as r`);
  assert.ok(!hidden.rows.some((x) => x.internal), 'sin las cuentas internas');
  // Los comodines se escapan: '%' no lista a todos.
  const { r: pct } = await asAdmin(`select public.admin_users_list('%', '{}', true, 'username', 10, 0) as r`);
  assert.equal(pct.total, 0);
  const { r: plus } = await asAdmin(`select public.admin_users_list(null, '{"plan":"plus"}', false, 'username', 10, 0) as r`);
  assert.deepEqual(plus.rows.map((x) => x.username), ['real_uno']);
  const { r: mx } = await asAdmin(`select public.admin_users_list(null, '{"country":"MX"}', false, 'username', 10, 0) as r`);
  assert.deepEqual(mx.rows.map((x) => x.username), ['real_dos']);
  const { r: lim } = await asAdmin(`select public.admin_users_list(null, '{}', true, 'username', 5000, 0) as r`);
  assert.equal(lim.limit, 100, 'límite máximo por página');

  const { r: detail } = await asAdmin('select public.admin_user_detail($1) as r', [ADMIN]);
  assert.equal(detail.profile.username, 'janitogap');
  assert.equal(detail.profile.superadmin, true);
  assert.deepEqual(detail.auth.providers, ['email', 'google']);
  const text = JSON.stringify(detail);
  assert.ok(!text.includes('@test.dev'), 'la ficha no expone el email');
  assert.ok(!/token"\s*:/.test(text), 'la ficha no expone tokens de push');
  const { r: none } = await asAdmin('select public.admin_user_detail($1) as r', [
    '00000000-0000-0000-0000-000000000000',
  ]);
  assert.equal(none, null);

  const { r: hist } = await asAdmin('select public.admin_user_battles($1, 10, 0) as r', [r2]);
  assert.equal(hist.total, 1);
  assert.equal(hist.rows[0].opponent_is_bot, true);
});

test('retención: Dn = activo exactamente el día n, sólo con el día ya cerrado', async () => {
  const u = await createUser(db, 'cohort@test.dev');
  // Registrado hace 10 días (hora de Buenos Aires), activo el día 1 y el día 3, no el 7.
  await db.query(
    `update public.profiles set created_at = admin.ts(admin.today() - 10) + interval '12 hours' where id = $1`,
    [u],
  );
  for (const d of [1, 3]) {
    await db.query(
      `insert into public.user_daily_activity (user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
       values ($1, admin.today() - 10 + $2::int, 1, 1, 1, 60)`,
      [u, d],
    );
  }
  const signup = (await one('select (admin.today() - 10)::text d')).d;
  const { r } = await asAdmin(`select public.admin_retention($1, $1, '{}', 'country') as r`, [signup]);
  assert.equal(r.cohorts.length, 1);
  assert.equal(r.overall.d1.retained, 1);
  assert.equal(r.overall.d3.retained, 1);
  assert.equal(r.overall.d7.retained, 0);
  assert.equal(r.overall.d7.eligible, 1);
  assert.equal(r.overall.d14.eligible, 0, 'el día 14 todavía no llegó');
  assert.equal(r.overall.d14.pct, null);
  assert.equal(r.segments[0].segment, '??');
});

test('ligas: los umbrales de admin.tier_index son los TIERS de shared/ranking.ts', async () => {
  for (const [i, t] of TIERS.entries()) {
    assert.equal((await one('select admin.tier_index($1) n', [t.minRating])).n, i + 1, t.id);
    assert.equal((await one('select admin.tier_id($1) id', [t.minRating])).id, t.id);
    if (t.minRating > 0) {
      assert.equal((await one('select admin.tier_index($1) n', [t.minRating - 1])).n, i, `${t.id} - 1`);
    }
  }
});

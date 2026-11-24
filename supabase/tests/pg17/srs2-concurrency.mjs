// Concurrencia real del SRS v2 (docs/ADAPTIVE_LEARNING_DESIGN.md 13.3, K1–K11) con PostgreSQL 17 local:
// PGlite tiene una sola conexión y no puede intercalar transacciones. Cada «sesión» es un psql
// distinto; pg_sleep dentro de la transacción fuerza cada intercalado.
//
//   node --import tsx supabase/tests/pg17/srs2-concurrency.mjs
//
// Crea un clúster desechable (initdb, trust, puerto 55432) en el directorio temporal, carga el stub de
// Supabase y todas las migraciones, corre los escenarios y lo detiene. No toca ninguna base real.
// Variables: PG17_BIN (por defecto C:/Program Files/PostgreSQL/17/bin), PG17_PORT.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SUPABASE_STUB } from '../harness.mjs';

const BIN = process.env.PG17_BIN ?? 'C:/Program Files/PostgreSQL/17/bin';
const PORT = process.env.PG17_PORT ?? '55432';
const MIGRATIONS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'migrations');
// PG17_EXCLUDE=archivo.sql[,…]: no cargar esas migraciones (para mostrar un defecto antes de su arreglo).
const EXCLUDE = (process.env.PG17_EXCLUDE ?? '').split(',').filter(Boolean);
const DIR = mkdtempSync(join(tmpdir(), 'polygo-pg17-'));
const DATA = join(DIR, 'data');
const env = { ...process.env, PGCLIENTENCODING: 'UTF8' };
const TZ = 'America/Argentina/Buenos_Aires';

function run(cmd, args, { detach = false } = {}) {
  // pg_ctl start: el postmaster hereda los pipes; sin stdio ignorado spawnSync no vuelve nunca (Windows).
  const r = spawnSync(join(BIN, cmd), args, detach ? { env, stdio: 'ignore' } : { env, encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')}\n${r.stderr}`);
  return r.stdout;
}

/** Un psql nuevo (una conexión) que corre `sql` y devuelve stdout; rechaza si falla. */
function session(sql, { delayMs = 0, allowError = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const p = spawn(join(BIN, 'psql.exe'), ['-p', PORT, '-U', 'postgres', '-d', 'polygo', '-v', 'ON_ERROR_STOP=1', '-tA', '-q', '-f', '-'], { env });
      let out = '';
      let err = '';
      p.stdout.on('data', (d) => (out += d));
      p.stderr.on('data', (d) => (err += d));
      p.on('close', (code) => (code === 0 || allowError ? resolve({ out: out.split(String.fromCharCode(13)).join('').trim(), err, code }) : reject(new Error(err))));
      p.stdin.end(sql);
    }, delayMs);
  });
}
const q = async (sql) => (await session(sql)).out;

const review = (user, sid, words, { before = '', after = '', tz = TZ } = {}) => `
  begin;
  ${before}
  -- Repasos por el cuerpo v1: desde 20261112120000 sólo el servidor (service_role), no la app.
  set local role service_role;
  select set_config('request.jwt.claim.sub', '${user}', true);
  select public.submit_learning_session('${sid}', 'review', null, now() - interval '1 minute',
    '${JSON.stringify(words.map((w) => ({ word_id: w, answer: 'x', correct: true, first_try: true, response_ms: 1000 })))}'::jsonb, '${tz}');
  ${after}
  commit;`;

async function main() {
  console.log('clúster en', DATA);
  const t0 = Date.now();
  run('initdb.exe', ['-D', DATA, '-U', 'postgres', '-A', 'trust', '-E', 'UTF8', '--locale=C']);
  run('pg_ctl.exe', ['-D', DATA, '-o', `-p ${PORT} -c max_connections=300`, '-l', join(DIR, 'log.txt'), '-w', 'start'], { detach: true });
  try {
    run('psql.exe', ['-p', PORT, '-U', 'postgres', '-c', 'create database polygo']);
    const stub = join(DIR, 'stub.sql');
    writeFileSync(stub, SUPABASE_STUB);
    run('psql.exe', ['-p', PORT, '-U', 'postgres', '-d', 'polygo', '-v', 'ON_ERROR_STOP=1', '-q', '-f', stub]);
    for (const f of readdirSync(MIGRATIONS).filter((x) => x.endsWith('.sql') && !EXCLUDE.includes(x)).sort()) {
      run('psql.exe', ['-p', PORT, '-U', 'postgres', '-d', 'polygo', '-v', 'ON_ERROR_STOP=1', '-q', '-1', '-f', join(MIGRATIONS, f)]);
    }
    console.log('migraciones cargadas en', Math.round((Date.now() - t0) / 1000), 's');
    await q(`update public.srs_v2_settings set enabled = true;`);
    const words = (await q(`select w.id from public.words w join public.concepts c on c.id = w.id
                            where w.language_code = 'en' and w.is_published order by w.id limit 200;`)).split('\n');
    const newUser = async () => (await q(`insert into auth.users (email) values ('${randomUUID()}@k.dev') returning id;`)).split('\n')[0];
    const applied = async (user) => (await q(`select session_id || ':' || seq || ':' || origin || ':' || to_char(t_srs, 'HH24:MI:SS.US')
                                               from public.srs_applied_sessions where user_id = '${user}' order by seq;`)).split('\n').filter(Boolean);
    const recompute = async (user) => (await q(`select count(*) from public.srs_v2_recompute_check('${user}');`));
    // Invariantes de 13.3 por usuario: cada sesión aplicada exactamente una vez, seq sin huecos, t_srs no
    // decreciente, replay con t_srs = máx(completed_at, t_srs anterior), online con t_srs ≥ v2_since.
    const checkUser = async (user) => {
      const r = await q(`
        with a as (select a.*, ls.completed_at, lag(a.t_srs) over (order by a.seq) as prev, row_number() over (order by a.seq) as rn
                   from public.srs_applied_sessions a join public.learning_sessions ls on ls.id = a.session_id
                   where a.user_id = '${user}')
        select (select count(*) from public.learning_sessions where user_id = '${user}') || ':' || (select count(*) from a)
          || ':' || (select count(*) from a where seq <> rn) || ':' || (select count(*) from a where t_srs < prev)
          || ':' || (select count(*) from a where origin = 'replay' and t_srs <> greatest(completed_at, coalesce(prev, '-infinity')))
          || ':' || (select count(*) from a join public.srs_user_head h on h.user_id = a.user_id
                     where a.origin = 'online' and a.t_srs < h.v2_since);`);
      const [n] = r.split(':');
      assert.equal(r, `${n}:${n}:0:0:0:0`, `invariantes de ${user}: sesiones:aplicadas:huecos:retrocesos:replay:online`);
      assert.equal(await recompute(user), '0');
    };
    // Estado del motor con retención suficiente para todas las unidades del usuario (sólo para que el
    // trabajo de sugerencias tenga algo que escribir); la inserción encola las sugerencias.
    const seedConceptState = (user) => `
      insert into public.user_concept_state (user_id, concept_id, dimension, language_code, first_exposed_at, last_exposed_at,
        exposure_count, status, model_version, computed_at, model_detail)
      select user_id, concept_id, dimension, language_code, now() - interval '2 days', now() - interval '1 day', 2, 'in_progress',
             'me-1.0.0', now(), '{"half_life_days": 0.5, "retention_sufficient": true}'::jsonb
      from public.user_srs_state where user_id = '${user}'
      on conflict (user_id, concept_id, dimension) do update set computed_at = excluded.computed_at;`;
    // Espera (dentro de la sesión, hasta 20 s) a que se cumpla una condición observable; falla si no.
    // Cada vuelta del DO toma una instantánea nueva (READ COMMITTED), así que ve lo que confirmaron otras;
    // pg_stat_activity, en cambio, se fotografía una vez por transacción: hay que limpiarla en cada vuelta.
    const waitFor = (cond) =>
      `do $w$ begin for i in 1..1000 loop perform pg_stat_clear_snapshot(); exit when (${cond}); if i = 1000 then raise exception 'waitFor agotado: %', $c$${cond}$c$; end if; perform pg_sleep(0.02); end loop; end $w$;`;
    // Vuelve a encolar las sugerencias del usuario; con reverse, en orden inverso al de las unidades.
    const requeueHints = (user, reverse = false) => `
      update public.srs_hint_queue h set processed_at = null,
        enqueued_at = ${reverse ? `now() - (select count(*) from public.srs_hint_queue x where x.user_id = h.user_id and (x.concept_id, x.dimension) > (h.concept_id, h.dimension)) * interval '1 ms'` : 'enqueued_at'}
      where h.user_id = '${user}';`;

    // K1: dos sesiones simultáneas con unidades distintas.
    {
      const u = await newUser();
      const [a, b] = [randomUUID(), randomUUID()];
      await Promise.all([
        session(review(u, a, words.slice(0, 2), { after: 'select pg_sleep(0.8);' })),
        session(review(u, b, words.slice(2, 4), { after: 'select pg_sleep(0.8);' }), { delayMs: 100 }),
      ]);
      const rows = await applied(u);
      assert.equal(rows.length, 2);
      assert.deepEqual(rows.map((r) => r.split(':')[1]), ['1', '2']);
      assert.equal(await recompute(u), '0');
      console.log('K1 ok', rows);
    }

    // K2: A empieza antes (completed_at menor) pero se demora antes del bloqueo; B confirma primero.
    {
      const u = await newUser();
      await session(review(u, randomUUID(), [words[10]])); // migra al usuario
      const [a, b] = [randomUUID(), randomUUID()];
      await Promise.all([
        session(review(u, a, [words[11], words[12]], { before: 'select now(); select pg_sleep(1.0);' })),
        session(review(u, b, [words[12], words[13]]), { delayMs: 300 }),
      ]);
      const rows = await applied(u);
      const seqOf = (s) => Number(rows.find((r) => r.startsWith(s)).split(':')[1]);
      assert.ok(seqOf(b) < seqOf(a), 'B se aplica antes que A');
      const ca = await q(`select completed_at < (select completed_at from public.learning_sessions where id = '${b}') from public.learning_sessions where id = '${a}';`);
      assert.equal(ca, 't', 'completed_at(A) < completed_at(B)');
      const ts = await q(`select (select t_srs from public.srs_applied_sessions where session_id = '${a}') >= (select t_srs from public.srs_applied_sessions where session_id = '${b}');`);
      assert.equal(ts, 't');
      assert.equal(await recompute(u), '0', 'el estado es la composición por seq');
      console.log('K2 ok', rows);
    }

    // K3 (con el K2 de arriba): el orden canónico es seq. Recalcular por seq con el t_srs guardado
    // reproduce el estado (recompute_check = 0); el orden por completed_at es otro (A, B).
    {
      const u = await q(`select user_id from public.srs_applied_sessions order by applied_at desc limit 1;`);
      const bySeq = await q(`select string_agg(session_id::text, ',' order by seq) from public.srs_applied_sessions where user_id = '${u}';`);
      const byCompleted = await q(`select string_agg(a.session_id::text, ',' order by ls.completed_at, ls.id)
                                   from public.srs_applied_sessions a join public.learning_sessions ls on ls.id = a.session_id
                                   where a.user_id = '${u}';`);
      assert.notEqual(bySeq, byCompleted, 'K2 produjo órdenes distintos por seq y por completed_at');
      assert.equal(await recompute(u), '0');
      console.log('K3 ok');
    }


    // K4: el mismo session_id dos veces a la vez (reintento): se aplica una sola vez.
    {
      const u = await newUser();
      const s = randomUUID();
      await Promise.all([
        session(review(u, s, [words[20]], { after: 'select pg_sleep(0.6);' })),
        session(review(u, s, [words[20]]), { delayMs: 100 }),
      ]);
      assert.equal((await applied(u)).length, 1);
      assert.equal(await q(`select exposures || ':' || n from public.user_srs_state where user_id = '${u}';`), '1:1');
      assert.equal(await q(`select last_seq from public.srs_user_head where user_id = '${u}';`), '1');
      console.log('K4 ok');
    }

    // K5: B aplica y falla después (rollback); A espera el bloqueo y recibe seq 1; B reintenta → seq 2.
    {
      const u = await newUser();
      await session(review(u, randomUUID(), [words[25]]));
      const [a, b] = [randomUUID(), randomUUID()];
      const [rb] = await Promise.all([
        session(review(u, b, [words[26]], { after: `set constraints all immediate; select pg_sleep(0.8); select 1 / 0;` }), { allowError: true }),
        session(review(u, a, [words[27]]), { delayMs: 200 }),
      ]);
      assert.notEqual(rb.code, 0);
      let rows = await applied(u);
      assert.equal(rows.length, 2);
      assert.ok(rows[1].startsWith(a) && rows[1].split(':')[1] === '2');
      assert.equal(await q(`select count(*) from public.learning_sessions where id = '${b}';`), '0');
      await session(review(u, b, [words[26]]));
      rows = await applied(u);
      assert.ok(rows[2].startsWith(b) && rows[2].split(':')[1] === '3');
      console.log('K5 ok');
    }

    // K11: primera sesión de un usuario con historial sin migrar, en paralelo con el trabajo de migración.
    {
      const u = await newUser();
      await q(`update public.srs_v2_settings set enabled = false;`);
      const hist = [randomUUID(), randomUUID()];
      await session(review(u, hist[0], [words[40], words[41]]));
      await session(review(u, hist[1], [words[41], words[42]]));
      await q(`update public.srs_v2_settings set enabled = true;`);
      const online = randomUUID();
      await Promise.all([
        session(`begin; select public.srs_v2_migrate_user('${u}', '${TZ}'); select pg_sleep(0.8); commit;`),
        session(review(u, online, [words[43]]), { delayMs: 200 }),
      ]);
      const rows = await applied(u);
      assert.deepEqual(rows.map((r) => r.split(':')[2]), ['replay', 'replay', 'online']);
      assert.ok(rows[2].startsWith(online));
      assert.equal(await q(`select public.srs_v2_repair_sweep();`), '0');
      assert.equal(await q(`select sessions || ':' || verified_units || ':' || converted_units from public.srs_migration_cutoff where user_id = '${u}';`), '2:3:0');
      console.log('K11 ok', rows);
    }
    // K6: K2 con el trabajo de sugerencias escribiendo u entre las dos aplicaciones (motor habilitado SOLO
    // en esta base desechable). a) la sugerencia se escribe sobre el estado de B y A la anula (I6);
    // b) el trabajo corre mientras otra sesión tiene la fila bloqueada: su escritura se descarta.
    {
      await q(`update public.mastery_model_versions set enabled_for_adaptive = true where version = 'me-1.0.0';`);
      const u = await newUser();
      const w = words[60];
      await session(review(u, randomUUID(), [w]));
      await q(seedConceptState(u));
      const unit = `user_id = '${u}' and concept_id = '${w}'`;
      const [a, b] = [randomUUID(), randomUUID()];
      const [, , hint] = await Promise.all([
        session(review(u, a, [w], { before: `select now(); ${waitFor(`exists (select 1 from public.user_srs_state where ${unit} and me_hint_at is not null)`)}` })),
        session(review(u, b, [w]), { delayMs: 200 }),
        session(`${waitFor(`exists (select 1 from public.srs_applied_sessions where session_id = '${b}')`)} ${requeueHints(u)} select public.srs_apply_me_hint(500);`, { delayMs: 200 }),
      ]);
      assert.equal(hint.out, '1', 'la sugerencia se escribe entre B y A');
      const rows = await applied(u);
      const seqOf = (s) => Number(rows.find((r) => r.startsWith(s)).split(':')[1]);
      assert.ok(seqOf(b) < seqOf(a));
      assert.equal(await q(`select (me_hint_at is null and due_effective_at = due_at)::text from public.user_srs_state where ${unit};`), 'true',
        'tras el commit de A la sugerencia queda anulada (I6)');
      const c = randomUUID();
      const [, hint2] = await Promise.all([
        session(review(u, c, [w], { after: 'set constraints all immediate; select pg_sleep(1.234);' })),
        session(`${waitFor(`exists (select 1 from pg_stat_activity where wait_event = 'PgSleep' and query like '%pg_sleep(1.234)%' and pid <> pg_backend_pid())`)} ${requeueHints(u)} select public.srs_apply_me_hint(500);`, { delayMs: 100 }),
      ]);
      assert.equal(hint2.out, '0', 'la escritura del trabajo se descarta');
      assert.equal(await q(`select (me_hint_at is null and due_effective_at = due_at)::text from public.user_srs_state where ${unit};`), 'true');
      await checkUser(u);
      await q(`update public.mastery_model_versions set enabled_for_adaptive = false where version = 'me-1.0.0';`);
      console.log('K6 ok');
    }

    // K6c: orden cruzado. Un lote del trabajo de sugerencias escribe la unidad X (mayor) y más tarde, en la
    // misma transacción, llega a Y (menor); entre medio una sesión con [X, Y] bloquea Y (aplica en orden
    // concept_id) y espera X. Las dos llamadas dentro de una transacción reproducen ese orden de bloqueos
    // de un lote. Sin arreglo es un ciclo: PostgreSQL aborta el envío o el trabajo.
    {
      await q(`update public.mastery_model_versions set enabled_for_adaptive = true where version = 'me-1.0.0';`);
      const u = await newUser();
      const [y, x] = [words[66], words[67]];
      assert.ok(y < x);
      await session(review(u, randomUUID(), [x, y]));
      await session(review(u, randomUUID(), [x, y]));
      await q(seedConceptState(u));
      // Sólo esa unidad pendiente en toda la cola (K6 b dejó una de otro usuario esperando, a propósito).
      const only = (c) => `update public.srs_hint_queue set processed_at = case when user_id = '${u}' and concept_id = '${c}' then null else coalesce(processed_at, clock_timestamp()) end;`;
      const [hint, sub] = await Promise.all([
        session(`begin; ${only(x)} select public.srs_apply_me_hint(500); ${waitFor("exists (select 1 from pg_stat_activity where wait_event_type = 'Lock' and pid <> pg_backend_pid())")} select pg_sleep(0.2); ${only(y)} select public.srs_apply_me_hint(500); commit;`, { allowError: true }),
        session(review(u, randomUUID(), [x, y]), { delayMs: 300, allowError: true }),
      ]);
      const errs = [hint, sub].filter((r) => r.code !== 0).map((r) => r.err.split('\n').find((l) => l.includes('ERROR')));
      assert.deepEqual(errs, [], 'sin interbloqueo entre el trabajo de sugerencias y el envío');
      assert.equal(hint.out.split('\n')[0], '1', 'el lote escribió X');
      assert.equal(await q(`select count(*) from public.srs_hint_queue where user_id = '${u}' and concept_id = '${y}' and processed_at is null;`), '1',
        'Y estaba bloqueada por el envío: queda en la cola para la ejecución siguiente');
      assert.equal(await q(`select count(*) from public.user_srs_state where user_id = '${u}' and me_hint_at is not null;`), '0', 'la sesión anuló la sugerencia de X (I6)');
      await checkUser(u);
      await q(`update public.mastery_model_versions set enabled_for_adaptive = false where version = 'me-1.0.0';`);
      console.log('K6c ok');
    }

    // K8: reloj del servidor que retrocede. Se inyecta dejando el t_srs anterior una hora por delante del
    // reloj (equivale a que el reloj volvió una hora atrás después de esa sesión): t_srs no baja.
    {
      const u = await newUser();
      await session(review(u, randomUUID(), [words[62]]));
      const ahead = await q(`update public.srs_user_head set last_t_srs = clock_timestamp() + interval '1 hour'
                             where user_id = '${u}' returning to_char(last_t_srs at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"');`);
      const s1 = randomUUID();
      const s2 = randomUUID();
      await session(review(u, s1, [words[62], words[63]]));
      await session(review(u, s2, [words[63]]));
      assert.equal(await q(`select (t_srs = '${ahead}'::timestamptz)::text from public.srs_applied_sessions where session_id = '${s1}';`), 'true',
        't_srs = last_t_srs, no el reloj atrasado');
      assert.equal(await q(`select ((select t_srs from public.srs_applied_sessions where session_id = '${s2}') >= '${ahead}'::timestamptz)::text;`), 'true');
      assert.equal(await q(`select (t_last >= '${ahead}'::timestamptz)::text from public.user_srs_state where user_id = '${u}' and concept_id = '${words[62]}';`), 'true');
      await checkUser(u);
      console.log('K8 ok');
    }

    // K9: 100 envíos simultáneos del mismo usuario con unidades solapadas, más el trabajo de sugerencias
    // (motor habilitado sólo aquí; la cola se reordena al revés del orden de las unidades).
    {
      await q(`update public.mastery_model_versions set enabled_for_adaptive = true where version = 'me-1.0.0';`);
      const u = await newUser();
      const ws = words.slice(100, 116);
      await session(review(u, randomUUID(), ws));
      await q(seedConceptState(u));
      const subs = Array.from({ length: 100 }, (_, i) =>
        session(review(u, randomUUID(), [ws[i % 16], ws[(i + 5) % 16], ws[(i + 11) % 16]]), { delayMs: i * 12, allowError: true }));
      const hints = Array.from({ length: 12 }, (_, j) =>
        session(`begin; ${requeueHints(u, true)} select public.srs_apply_me_hint(500); select pg_sleep(0.15); commit;`, { delayMs: j * 100, allowError: true }));
      const res = await Promise.all([...subs, ...hints]);
      const failed = res.filter((r) => r.code !== 0);
      assert.equal(failed.length, 0, `fallas: ${failed.map((r) => r.err.split('\n').find((l) => l.includes('ERROR'))).join(' | ')}`);
      const rows = await applied(u);
      assert.deepEqual(rows.map((r) => Number(r.split(':')[1])), Array.from({ length: 101 }, (_, i) => i + 1));
      await checkUser(u);
      await q(`update public.mastery_model_versions set enabled_for_adaptive = false where version = 'me-1.0.0';`);
      console.log('K9 ok: 100 envíos + 12 ejecuciones del trabajo de sugerencias, sin interbloqueos');
    }

    // K10: migración del usuario concurrente con una sesión en línea, en los intercalados de 13.3 y en el
    // corte (el v2 se enciende con un envío en curso).
    {
      const withHistory = async (u, w) => {
        await q(`update public.srs_v2_settings set enabled = false;`);
        await session(review(u, randomUUID(), [w[0], w[1]]));
        await session(review(u, randomUUID(), [w[1], w[2]]));
        await q(`update public.srs_v2_settings set enabled = true;`);
      };
      const origins = async (u) => (await applied(u)).map((r) => r.split(':')[2]).join(',');
      // a) la sesión confirma antes de que la migración tome el bloqueo (la sesión migra en línea).
      {
        const u = await newUser();
        const w = words.slice(70, 73);
        await withHistory(u, w);
        await session(review(u, randomUUID(), [w[2]]));
        assert.equal(await q(`select (public.srs_v2_migrate_user('${u}', '${TZ}') ->> 'already_migrated');`), 'true');
        assert.equal(await origins(u), 'replay,replay,online');
        await checkUser(u);
      }
      // b) la sesión espera durante la migración: es K11 (abajo).
      // c) la sesión empieza después de la migración.
      {
        const u = await newUser();
        const w = words.slice(73, 76);
        await withHistory(u, w);
        await q(`select public.srs_v2_migrate_user('${u}', '${TZ}');`);
        await session(review(u, randomUUID(), [w[0]]));
        assert.equal(await origins(u), 'replay,replay,online');
        await checkUser(u);
      }
      // d) corte: el envío empezó con el v2 apagado (sin bloqueo), se enciende y la migración corre mientras
      //    tanto; al confirmar, el trigger toma el bloqueo, espera a la migración y aplica en línea.
      {
        const u = await newUser();
        const w = words.slice(76, 79);
        await withHistory(u, w);
        await q(`update public.srs_v2_settings set enabled = false;`);
        const s = randomUUID();
        await Promise.all([
          session(review(u, s, [w[0]], { after: 'select pg_sleep(1.2);' })),
          session(`update public.srs_v2_settings set enabled = true;`, { delayMs: 300 }),
          session(`begin; select public.srs_v2_migrate_user('${u}', '${TZ}'); select pg_sleep(1.0); commit;`, { delayMs: 450 }),
        ]);
        assert.equal(await origins(u), 'replay,replay,online');
        assert.ok((await applied(u))[2].startsWith(s));
        await checkUser(u);
      }
      // e) corte sin trabajo de migración: el trigger migra en línea al confirmar. La propia sesión ya está
      //    registrada (misma transacción): tiene que quedar aplicada exactamente una vez.
      {
        const u = await newUser();
        const w = words.slice(79, 82);
        await withHistory(u, w);
        await q(`update public.srs_v2_settings set enabled = false;`);
        const s = randomUUID();
        await Promise.all([
          session(review(u, s, [w[0]], { after: 'select pg_sleep(0.8);' })),
          session(`update public.srs_v2_settings set enabled = true;`, { delayMs: 300 }),
        ]);
        const o = await origins(u);
        assert.equal(o.split(',').length, 3, o);
        assert.equal(await q(`select count(*) from public.srs_applied_sessions where session_id = '${s}';`), '1');
        await checkUser(u);
        console.log('K10 e: orígenes', o);
      }
      assert.equal(await q(`select public.srs_v2_repair_sweep();`), '0');
      console.log('K10 ok (a, c, d, e; b = K11)');
    }

    // K7 (opcional, --k7): cambio de día local con el reloj real. Elige la zona horaria con la medianoche
    // local más próxima (más de 25 s) y espera hasta ella (a lo sumo una hora).
    if (process.argv.includes('--k7')) {
      const zones = ['UTC', 'Asia/Kolkata', 'Asia/Kathmandu', 'Australia/Eucla', 'Pacific/Chatham', 'Asia/Tehran', 'Asia/Kabul',
        'America/St_Johns', 'Australia/Adelaide', 'Pacific/Marquesas', 'Asia/Yangon', 'Australia/Darwin', 'Asia/Colombo',
        ...Array.from({ length: 26 }, (_, i) => (i < 12 ? `Etc/GMT+${i + 1}` : `Etc/GMT-${i - 11}`))];
      const [tz, secs, midnightMs] = (await q(`select tz || '|' || s || '|' || m from (
                                     select tz, extract(epoch from ((((now() at time zone tz)::date + 1)::timestamp at time zone tz) - now())) s,
                                            extract(epoch from (((now() at time zone tz)::date + 1)::timestamp at time zone tz)) * 1000 m
                                     from unnest(array['${zones.join("','")}']) tz) z
                                   where s > 25 order by s limit 1;`)).split('|');
      console.log('K7: zona', tz, 'medianoche en', Math.round(Number(secs)), 's');
      const u = await newUser();
      await session(review(u, randomUUID(), [words[64]], { tz }));
      // Hora absoluta de la medianoche (mismo reloj de la máquina), no «ahora + segundos».
      const midnight = Number(midnightMs);
      await new Promise((r) => setTimeout(r, midnight - Date.now() - 1000));
      const [a, b] = [randomUUID(), randomUUID()];
      await Promise.all([
        session(review(u, a, [words[64], words[65]], { tz, before: 'select now(); select pg_sleep(2.2);' })),
        session(review(u, b, [words[65]], { tz }), { delayMs: 1150 }),
      ]);
      const day = (expr) => `(${expr} at time zone '${tz}')::date`;
      const [dA, tA] = (await q(`select ${day('ls.completed_at')} || '|' || ${day('a.t_srs')} from public.srs_applied_sessions a
                                 join public.learning_sessions ls on ls.id = a.session_id where a.session_id = '${a}';`)).split('|');
      const tB = await q(`select ${day('t_srs')} from public.srs_applied_sessions where session_id = '${b}';`);
      assert.notEqual(dA, tA, 'A se completó el día anterior y su día de estudio es el siguiente');
      assert.equal(tA, tB);
      const rows = await applied(u);
      const seqOf = (s) => Number(rows.find((x) => x.startsWith(s)).split(':')[1]);
      assert.ok(seqOf(b) < seqOf(a));
      assert.equal(await q(`select count(*) || '|' || min(study_date) from public.srs_user_debt_days where user_id = '${u}';`), `1|${tB}`,
        'AL19 se evalúa una sola vez, para el día nuevo');
      assert.equal(await q(`select (evaluated_at = (select t_srs from public.srs_applied_sessions where session_id = '${b}'))::text
                            from public.srs_user_debt_state where user_id = '${u}';`), 'true', 'la evaluación la hizo B');
      await checkUser(u);
      console.log('K7 ok', dA, '→', tA);
    }
    // J1 (fase 4, 20261110130000_learning_jobs.sql): dos ejecuciones simultáneas del mismo trabajo →
    // la segunda se registra como skipped/already_running y no procesa nada.
    {
      const [a, b] = await Promise.all([
        session(`begin; select public.learning_run_job('mastery_queue', 500); select pg_sleep(0.8); commit;`),
        session(`select (public.learning_run_job('mastery_queue', 500)) ->> 'reason';`, { delayMs: 200 }),
      ]);
      assert.ok(a.out.length > 0);
      assert.equal(b.out, 'already_running');
      console.log('J1 ok');
    }

    // J2: dos srs_v2_process_migrations a la vez → una sola procesa (bloqueo de sesión); con dos
    // usuarios pendientes, cada uno se migra una vez.
    {
      await q(`update public.srs_v2_settings set enabled = false;`);
      const users = [await newUser(), await newUser()];
      for (const [i, u] of users.entries()) await session(review(u, randomUUID(), [words[50 + i]]));
      await q(`update public.srs_v2_settings set enabled = true;`);
      await Promise.all([
        session(`call public.srs_v2_process_migrations(50);`),
        session(`call public.srs_v2_process_migrations(50);`, { delayMs: 20 }),
      ]);
      const runs = await q(`select string_agg(status || ':' || coalesce(reason, '') || ':' || processed, ',' order by id)
                            from (select * from public.learning_job_runs where job = 'srs_migrations' order by id desc limit 2) r;`);
      const done = await q(`select count(*) from public.srs_migration_queue where user_id in ('${users[0]}', '${users[1]}') and status = 'done' and attempts = 1;`);
      assert.equal(done, '2', runs);
      for (const u of users) assert.equal((await applied(u)).length, 1);
      console.log('J2 ok', runs);
    }
    console.log('PG17: K1–K6 (y K6c), K8–K11 (K7 con --k7), J1 y J2 correctos');
  } finally {
    run('pg_ctl.exe', ['-D', DATA, '-m', 'fast', '-w', 'stop'], { detach: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

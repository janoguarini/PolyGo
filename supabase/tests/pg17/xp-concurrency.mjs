// Concurrencia real de sync_xp (20261222120200_player_xp) con PostgreSQL 17 local. PGlite tiene una
// sola conexión y no puede intercalar transacciones: acá cada «dispositivo» es un psql distinto y
// pg_sleep dentro de la transacción fuerza el solapamiento.
//
//   node --import tsx supabase/tests/pg17/xp-concurrency.mjs
//
// Crea un clúster desechable (initdb, trust, puerto 55433) en el directorio temporal, carga el stub de
// Supabase y todas las migraciones, corre los escenarios y lo detiene. No toca ninguna base real.
// Variables: PG17_BIN (por defecto C:/Program Files/PostgreSQL/17/bin), PG17_PORT.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SUPABASE_STUB } from '../harness.mjs';
import { XP } from '../../../shared/xp.ts';

const BIN = process.env.PG17_BIN ?? 'C:/Program Files/PostgreSQL/17/bin';
const PORT = process.env.PG17_PORT ?? '55433';
const MIGRATIONS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'migrations');
const DIR = mkdtempSync(join(tmpdir(), 'polygo-pg17-xp-'));
const DATA = join(DIR, 'data');
const env = { ...process.env, PGCLIENTENCODING: 'UTF8' };

function run(cmd, args, { detach = false } = {}) {
  // pg_ctl start: el postmaster hereda los pipes; sin stdio ignorado spawnSync no vuelve (Windows).
  const r = spawnSync(
    join(BIN, cmd),
    args,
    detach ? { env, stdio: 'ignore' } : { env, encoding: 'utf8', maxBuffer: 1 << 28 },
  );
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')}\n${r.stderr}`);
  return r.stdout;
}

/** Un psql nuevo (una conexión) que corre `sql`; rechaza si falla. */
function session(sql, { delayMs = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
          '-tA',
          '-q',
          '-f',
          '-',
        ],
        { env },
      );
      let out = '';
      let err = '';
      p.stdout.on('data', (d) => (out += d));
      p.stderr.on('data', (d) => (err += d));
      p.on('close', (code) =>
        code === 0
          ? resolve(out.split(String.fromCharCode(13)).join('').trim())
          : reject(new Error(err)),
      );
      p.stdin.end(sql);
    }, delayMs);
  });
}

/** sync_xp como la app (rol authenticated), reteniendo el bloqueo `holdS` segundos antes de confirmar. */
const sync = (user, holdS = 0.8) => `
  begin;
  set local role authenticated;
  select set_config('request.jwt.claim.sub', '${user}', true);
  select (r ->> 'granted_total') || ':' || (r ->> 'initial') from (select public.sync_xp() as r) s;
  select pg_sleep(${holdS});
  commit;`;

async function main() {
  const t0 = Date.now();
  run('initdb.exe', ['-D', DATA, '-U', 'postgres', '-A', 'trust', '-E', 'UTF8', '--locale=C']);
  run(
    'pg_ctl.exe',
    [
      '-D',
      DATA,
      '-o',
      `-p ${PORT} -c max_connections=100`,
      '-l',
      join(DIR, 'log.txt'),
      '-w',
      'start',
    ],
    { detach: true },
  );
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
    for (const f of readdirSync(MIGRATIONS)
      .filter((x) => x.endsWith('.sql'))
      .sort()) {
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
    }
    console.log('migraciones cargadas en', Math.round((Date.now() - t0) / 1000), 's');

    const newUser = async () =>
      (
        await session(
          `insert into auth.users (email) values ('${randomUUID()}@xp.dev') returning id;`,
        )
      ).split('\n')[0];
    const reviews = (user, n) => `
      insert into public.learning_sessions (id, user_id, kind, lesson_id, started_at, completed_at,
        duration_seconds, total_answers, first_try_total, first_try_correct, local_date)
      select gen_random_uuid(), '${user}', 'review', null, now() - interval '3 minutes', now(), 120, 8, 8, 7,
        (now() at time zone 'UTC')::date
      from generate_series(1, ${n});`;
    const battles = (user, n) => `
      with b as (
        insert into public.battles (id, language_code, is_ranked, status, started_at, ended_at)
        select gen_random_uuid(), 'en', true, 'completed', now() - interval '3 minutes', now()
        from generate_series(1, ${n}) returning id)
      insert into public.battle_players (battle_id, slot, user_id, result) select id, 1, '${user}', 'win' from b;`;
    const ledger = async (user) =>
      (
        await session(`select source || '=' || count(*) from public.xp_events where user_id = '${user}'
                      group by source order by source;`)
      )
        .split('\n')
        .filter(Boolean);
    const consistent = async (user) =>
      session(`select (select total_xp from public.player_xp where user_id = '${user}')
                 = (select coalesce(sum(amount), 0) from public.xp_events where user_id = '${user}');`);

    // X1: primera sincronización desde dos dispositivos a la vez (todavía no existe player_xp).
    {
      const u = await newUser();
      await session(reviews(u, 3));
      const outs = await Promise.all([session(sync(u)), session(sync(u), { delayMs: 50 })]);
      // psql también imprime el valor de set_config: se toma la línea "granted_total:initial".
      const initials = outs.map(
        (o) =>
          o
            .split('\n')
            .find((l) => /^\d+:(true|false)$/.test(l))
            ?.split(':')[1],
      );
      assert.equal(
        initials.filter((x) => x === 'true').length,
        1,
        `una sola es la inicial: ${initials}`,
      );
      assert.deepEqual(await ledger(u), ['review=3']);
      assert.equal(await consistent(u), 't');
      console.log('X1 ok: primera sincronización simultánea →', outs.join(' | '));
    }

    // X2: tope diario de repasos con 3 sincronizaciones solapadas: exactamente el tope.
    {
      const u = await newUser();
      await session(sync(u, 0));
      await session(reviews(u, 12));
      await Promise.all([0, 40, 80].map((d) => session(sync(u), { delayMs: d })));
      assert.deepEqual(await ledger(u), [`review=${XP.dailyCaps.review}`]);
      assert.equal(await consistent(u), 't');
      console.log('X2 ok: 12 repasos, 3 dispositivos →', await ledger(u));
    }

    // X3: tope compartido de ranked con 4 sincronizaciones solapadas.
    {
      const u = await newUser();
      await session(sync(u, 0));
      await session(battles(u, 15));
      await Promise.all([0, 30, 60, 90].map((d) => session(sync(u), { delayMs: d })));
      assert.deepEqual(await ledger(u), [`ranked_win=${XP.dailyCaps.ranked}`]);
      assert.equal(await consistent(u), 't');
      console.log('X3 ok: 15 victorias, 4 dispositivos →', await ledger(u));
    }

    // X4: una sesión que se confirma mientras otra sincronización tiene el bloqueo: se cuenta una vez
    // (en la sincronización siguiente o en la que la vea), nunca dos.
    {
      const u = await newUser();
      await session(sync(u, 0));
      await session(reviews(u, 2));
      await Promise.all([
        session(sync(u, 1)),
        session(reviews(u, 2), { delayMs: 200 }),
        session(sync(u), { delayMs: 400 }),
      ]);
      await session(sync(u, 0));
      assert.deepEqual(await ledger(u), ['review=4']);
      assert.equal(await consistent(u), 't');
      console.log('X4 ok: sesión registrada durante una sincronización →', await ledger(u));
    }
    console.log('xp-concurrency: 4/4 en', Math.round((Date.now() - t0) / 1000), 's');
  } finally {
    run('pg_ctl.exe', ['-D', DATA, '-m', 'fast', 'stop']);
    rmSync(DIR, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

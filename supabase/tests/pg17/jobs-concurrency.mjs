// Concurrencia real de los trabajos de aprendizaje (fase 4, 20261110130000_learning_jobs.sql y el cierre)
// con PostgreSQL 17 local: PGlite tiene una sola conexión. Cada «sesión» es un psql distinto.
//
//   node --import tsx supabase/tests/pg17/jobs-concurrency.mjs
//
// Clúster desechable (initdb, trust, puerto 55438) en el directorio temporal; no toca ninguna base real
// ni programa nada (no instala pg_cron: se llama a las funciones como lo haría el programador).
//   J1 · dos learning_run_job('mastery_queue') a la vez: uno trabaja, el otro skipped/already_running.
//   J2 · ocho ejecuciones simultáneas de cada trabajo: nunca dos a la vez, cada unidad procesada una vez.
//   J3 · interruptores: me_hint, srs_repair y srs_migrations no hacen nada con todo apagado.
//   J4 · srs_v2_process_migrations con otra ejecución en curso (bloqueo de sesión) → skipped; dos a la vez
//        con el v2 encendido (sólo en esta base): cada usuario migrado una vez.
//   J5 · retención a la vez que mastery_queue y dos retenciones a la vez: sin errores ni borrados de más.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SUPABASE_STUB } from '../harness.mjs';

const BIN = process.env.PG17_BIN ?? 'C:/Program Files/PostgreSQL/17/bin';
const PORT = process.env.PG17_PORT ?? '55438';
const MIGRATIONS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'migrations');
// PG17_EXCLUDE=archivo.sql[,…]: no cargar esas migraciones (para mostrar un defecto antes de su arreglo).
const EXCLUDE = (process.env.PG17_EXCLUDE ?? '').split(',').filter(Boolean);
const DIR = mkdtempSync(join(tmpdir(), 'polygo-pg17-jobs-'));
const DATA = join(DIR, 'data');
const env = { ...process.env, PGCLIENTENCODING: 'UTF8' };

function run(cmd, args, { detach = false } = {}) {
  const r = spawnSync(
    join(BIN, cmd),
    args,
    detach ? { env, stdio: 'ignore' } : { env, encoding: 'utf8', maxBuffer: 1 << 28 },
  );
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')}\n${r.stderr}`);
  return r.stdout;
}
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
        code === 0 ? resolve(out.split('\r').join('').trim()) : reject(new Error(err)),
      );
      p.stdin.end(sql);
    }, delayMs);
  });
}
const q = (sql) => session(sql);
const asService = (sql) => `begin; set local role service_role; ${sql} commit;`;
const runs = async (job) =>
  JSON.parse(
    await q(`select coalesce(jsonb_agg(jsonb_build_object('status', status, 'reason', reason, 'processed', processed) order by id), '[]')
  from public.learning_job_runs where job = '${job}';`),
  );

async function seedQueue(n) {
  // Unidades del motor encoladas para usuarios con evidencia: lo que dejan las lecciones corregidas.
  const users = [];
  for (let i = 0; i < n; i++) {
    const u = (
      await q(`insert into auth.users (email) values ('${randomUUID()}@j.dev') returning id;`)
    ).split('\n')[0];
    users.push(u);
  }
  await q(`insert into public.knowledge_recompute_queue (user_id, concept_id, dimension)
           select u, c.id, 'vocabulary' from unnest(array[${users.map((u) => `'${u}'::uuid`).join(',')}]) u
           cross join lateral (select id from public.concepts where kind = 'lexical' order by id limit 5) c
           on conflict do nothing;`);
  return users;
}

const results = [];
async function scenario(name, fn) {
  try {
    await fn();
    results.push(true);
    console.log(`ok   ${name}`);
  } catch (err) {
    results.push(false);
    console.log(`FAIL ${name}\n     ${err.message.split('\n').slice(0, 8).join('\n     ')}`);
  }
}

async function main() {
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
    for (const f of readdirSync(MIGRATIONS)
      .filter((x) => x.endsWith('.sql') && !EXCLUDE.includes(x))
      .sort())
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
    const cols = await q(
      `select string_agg(column_name, ',') from information_schema.columns where table_name = 'knowledge_recompute_queue';`,
    );
    console.log(`knowledge_recompute_queue: ${cols}`);

    await scenario(
      'J1 · dos mastery_queue a la vez: uno trabaja, el otro skipped/already_running',
      async () => {
        await seedQueue(3);
        const a = session(
          asService(`select public.learning_run_job('mastery_queue', 500); select pg_sleep(2);`),
        );
        const b = session(asService(`select public.learning_run_job('mastery_queue', 500);`), {
          delayMs: 600,
        });
        const [ra, rb] = await Promise.all([a, b]);
        const ja = JSON.parse(ra.split('\n')[0]);
        const jb = JSON.parse(rb);
        assert.equal(ja.status, 'ok', ra);
        assert.deepEqual([jb.status, jb.reason], ['skipped', 'already_running'], rb);
        assert.equal(
          Number(
            await q(
              `select count(*) from public.knowledge_recompute_queue where processed_at is null;`,
            ),
          ),
          0,
        );
      },
    );

    await scenario(
      'J2 · 8 ejecuciones simultáneas por trabajo: a lo sumo una trabaja; cada unidad se procesa una vez',
      async () => {
        await q('truncate public.learning_job_runs;');
        await seedQueue(10);
        const pending = Number(
          await q(
            `select count(*) from public.knowledge_recompute_queue where processed_at is null;`,
          ),
        );
        const all = await Promise.all(
          Array.from({ length: 8 }, (_, i) =>
            session(asService(`select public.learning_run_job('mastery_queue', 500);`), {
              delayMs: i * 20,
            }),
          ),
        );
        const parsed = all.map((x) => JSON.parse(x));
        const ok = parsed.filter((x) => x.status === 'ok');
        const processed = ok.reduce((s, x) => s + x.processed, 0);
        assert.ok(
          parsed.every(
            (x) => x.status === 'ok' || (x.status === 'skipped' && x.reason === 'already_running'),
          ),
          JSON.stringify(parsed),
        );
        assert.equal(
          processed,
          pending,
          `procesadas ${processed} de ${pending}: ${JSON.stringify(parsed)}`,
        );
        assert.equal(
          Number(
            await q(
              `select count(*) from public.knowledge_recompute_queue where processed_at is null;`,
            ),
          ),
          0,
        );
        assert.equal(
          Number(
            await q(`select count(*) from public.learning_job_runs where job = 'mastery_queue';`),
          ),
          8,
          'cada ejecución queda registrada',
        );
        console.log(
          `     ok=${ok.length} skipped=${parsed.length - ok.length} unidades=${pending}`,
        );
      },
    );

    await scenario(
      'J3 · con todo apagado: me_hint, srs_repair y srs_migrations no hacen nada',
      async () => {
        await q('truncate public.learning_job_runs;');
        const h = JSON.parse(await q(asService(`select public.learning_run_job('me_hint', 500);`)));
        const r = JSON.parse(
          await q(asService(`select public.learning_run_job('srs_repair', 1);`)),
        );
        // Un procedimiento con COMMIT no puede correr dentro de begin/commit: como lo llama pg_cron.
        await q(`set role service_role; call public.srs_v2_process_migrations(50);`);
        assert.deepEqual([h.status, h.reason], ['skipped', 'motor_disabled']);
        assert.deepEqual([r.status, r.reason], ['skipped', 'srs_v2_disabled']);
        assert.deepEqual(
          (await runs('srs_migrations')).map((x) => x.reason),
          ['srs_v2_disabled'],
        );
      },
    );

    await scenario(
      'J4 · srs_v2_process_migrations: con otra en curso → skipped; dos a la vez → cada usuario migrado una vez',
      async () => {
        await q('update public.srs_v2_settings set enabled = true;');
        try {
          await q('truncate public.learning_job_runs;');
          // Usuarios con historial del v1 por migrar.
          const lesson =
            await q(`select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
          where u.language_code = 'en' and u.level = 'A1' and l.is_published and u.is_published order by u.position, l.position limit 1;`);
          // Historial del v1 hecho ANTES de encender el v2 (la cola toma los usuarios de learning_sessions).
          await q('update public.srs_v2_settings set enabled = false;');
          const ex = JSON.parse(
            await q(`select jsonb_agg(jsonb_build_object('exercise_id', e.id, 'answer', e.answer, 'correct', true, 'first_try', true,
            'response_ms', 1500, 'word_id', (select min(w.word_id) from public.exercise_words w where w.exercise_id = e.id)))
          from public.exercises e where e.lesson_id = '${lesson}' and e.is_published;`),
          );
          for (let i = 0; i < 12; i++) {
            const u = (
              await q(
                `insert into auth.users (email) values ('${randomUUID()}@m.dev') returning id;`,
              )
            ).split('\n')[0];
            await q(`begin; set local role authenticated; set local "request.jwt.claim.sub" = '${u}';
            select public.submit_learning_session('${randomUUID()}', 'lesson', '${lesson}', now() - interval '3 minutes',
              $j$${JSON.stringify(ex)}$j$::jsonb, 'UTC'); commit;`);
          }
          await q('update public.srs_v2_settings set enabled = true;');
          // Otra ejecución en curso: tiene el bloqueo de sesión.
          const holder = session(
            `select pg_advisory_lock(hashtextextended('learning_job:srs_migrations', 0)); select pg_sleep(2);`,
          );
          await new Promise((r) => setTimeout(r, 600));
          await q(`set role service_role; call public.srs_v2_process_migrations(50);`);
          await holder;
          assert.deepEqual(
            (await runs('srs_migrations')).map((x) => x.reason),
            ['already_running'],
          );
          await q('truncate public.learning_job_runs;');
          await Promise.all([
            q(`set role service_role; call public.srs_v2_process_migrations(50);`),
            q(`set role service_role; call public.srs_v2_process_migrations(50);`),
          ]);
          const r = await runs('srs_migrations');
          const done = Number(
            await q(`select count(*) from public.srs_migration_queue where status = 'done';`),
          );
          const multi = Number(
            await q(
              `select count(*) from public.srs_migration_queue where attempts > 1 or status <> 'done';`,
            ),
          );
          const processed = r
            .filter((x) => x.status === 'ok')
            .reduce((s, x) => s + (x.processed ?? 0), 0);
          assert.ok(done >= 12, `migrados ${done}`);
          assert.equal(multi, 0, 'ningún usuario migrado dos veces ni fallido');
          assert.equal(
            processed,
            done,
            `procesados ${processed} = migrados ${done}: ${JSON.stringify(r)}`,
          );
          console.log(
            `     ejecuciones: ${JSON.stringify(r.map((x) => `${x.status}/${x.reason ?? x.processed}`))}`,
          );
        } finally {
          await q('update public.srs_v2_settings set enabled = false;');
        }
      },
    );

    await scenario(
      'J5 · retención simultánea con mastery_queue y consigo misma: sin errores; conserva la última de cada trabajo',
      async () => {
        await q(
          `insert into public.learning_job_runs (job, started_at, status) select 'mastery_queue', now() - make_interval(days => 100 + g), 'ok' from generate_series(1, 30) g;`,
        );
        const before = Number(await q(`select count(*) from public.learning_job_runs;`));
        const all = await Promise.all([
          session(asService(`select public.learning_run_job('retention', 5000);`)),
          session(asService(`select public.learning_run_job('retention', 5000);`)),
          session(asService(`select public.learning_run_job('mastery_queue', 500);`)),
        ]);
        const parsed = all.map((x) => JSON.parse(x));
        assert.ok(
          parsed.every((x) => x.status !== 'failed'),
          JSON.stringify(parsed),
        );
        const old = Number(
          await q(
            `select count(*) from public.learning_job_runs where started_at < now() - interval '90 days';`,
          ),
        );
        assert.ok(old <= 1, `quedan ${old} viejas`);
        assert.ok(
          Number(
            await q(`select count(*) from public.learning_job_runs where job = 'mastery_queue';`),
          ) >= 1,
        );
        console.log(
          `     antes ${before}, ejecuciones ${JSON.stringify(parsed.map((x) => `${x.job}:${x.status}${x.reason ? '/' + x.reason : ''}`))}`,
        );
      },
    );

    // J6 · el trabajo del motor contra un envío del mismo usuario. Un envío corre mastery_mark_dirty una vez
    // por corrección, en el orden de los intentos: marca user_concept_state y vuelve a encolar la unidad.
    // Aquí se ejecutan exactamente esas dos sentencias con el orden cruzado (c2 y después c1) mientras el
    // trabajo, que bloquea su lote de la cola, recalcula c1 y después c2. Sin cuidado, es un ciclo de
    // esperas: PostgreSQL aborta a uno (el envío del alumno o la unidad del trabajo).
    await scenario('J6 · trabajo del motor y envío con orden cruzado: sin interbloqueo', async () => {
      const u = (await q(`insert into auth.users (email) values ('${randomUUID()}@j6.dev') returning id;`)).split('\n')[0];
      const [c1, c2] = (await q(`select id from public.concepts where kind = 'lexical' and language_code = 'en' order by id limit 2;`)).split('\n');
      await q(`insert into public.user_concept_state (user_id, concept_id, dimension, language_code)
               values ('${u}', '${c1}', 'vocabulary', 'en'), ('${u}', '${c2}', 'vocabulary', 'en');
               update public.knowledge_recompute_queue set processed_at = clock_timestamp() where processed_at is null;
               insert into public.knowledge_recompute_queue (user_id, concept_id, dimension, enqueued_at)
               values ('${u}', '${c1}', 'vocabulary', now() - interval '2 s'), ('${u}', '${c2}', 'vocabulary', now() - interval '1 s');`);
      const t0 = Date.now();
      const [submit, job] = await Promise.all([
        session(`begin;
                 update public.user_concept_state set dirty_since = coalesce(dirty_since, now())
                 where user_id = '${u}' and concept_id = '${c2}' and dimension = 'vocabulary';
                 select pg_sleep(0.6);
                 insert into public.knowledge_recompute_queue (user_id, concept_id, dimension) values ('${u}', '${c1}', 'vocabulary')
                 on conflict (user_id, concept_id, dimension) do update set enqueued_at = now(), processed_at = null;
                 commit; select 'submitted';`),
        session(`begin; select public.learning_run_job('mastery_queue', 500); select pg_sleep(0.3); commit;`, { delayMs: 200 }),
      ]);
      assert.equal(submit, 'submitted');
      const errors = await q(`select count(*) from public.knowledge_recompute_queue where user_id = '${u}' and last_error is not null;`);
      assert.equal(errors, '0', `unidades con error: ${await q(`select string_agg(last_error, ' | ') from public.knowledge_recompute_queue where user_id = '${u}';`)} · trabajo ${job}`);
      // Lo que quedó pendiente lo procesa la ejecución siguiente.
      await q(asService(`select public.learning_run_job('mastery_queue', 500);`));
      assert.equal(await q(`select count(*) from public.knowledge_recompute_queue where user_id = '${u}' and processed_at is null;`), '0');
      console.log(`     trabajo ${job} · ${Date.now() - t0} ms`);
    });

    const flags = await q(
      `select (select enabled from public.srs_v2_settings) || ',' || (select bool_or(enabled_for_adaptive) from public.mastery_model_versions) || ',' || (select bool_or(enabled_for_display) from public.mastery_model_versions) || ',' || (select count(*) from pg_extension where extname = 'pg_cron');`,
    );
    await scenario('H · interruptores apagados y sin pg_cron al terminar', async () =>
      assert.equal(flags, 'false,false,false,0'),
    );
  } finally {
    run('pg_ctl.exe', ['-D', DATA, '-m', 'immediate', 'stop']);
  }
  const failed = results.filter((x) => !x).length;
  console.log(`\n${results.length - failed}/${results.length} correctos`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  try {
    run('pg_ctl.exe', ['-D', DATA, '-m', 'immediate', 'stop']);
  } catch {}
  process.exit(1);
});

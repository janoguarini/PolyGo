// Trabajos de aprendizaje listos para pg_cron (migración 20261110130000_learning_jobs.sql,
// docs/LEARNING_PHASE4.md §6) en PGlite: interruptores, lotes, recuperación por unidad, reintentos con
// espera, registro y estado. La exclusión entre ejecuciones simultáneas necesita dos conexiones: se
// prueba en supabase/tests/pg17/jobs-concurrency.mjs (PostgreSQL 17 local).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, as } from './harness.mjs';
import { helpers, answerAll } from './learningHelpers.mjs';

let db;
let h;
let lesson;
before(async () => {
  db = await createDb();
  h = helpers(db);
  lesson = await h.lessonWith('translation_choice', 'translate_write');
});

const run = (job, limit = 500) => h.service(() => h.call('learning_run_job', [job, limit]));
const lastRun = (job) =>
  h.one('select * from public.learning_job_runs where job = $1 order by id desc limit 1', [job]);

async function learnerWithLesson() {
  const user = await h.learner(lesson);
  const s = randomUUID();
  await h.startLesson(user, s, lesson);
  await h.submitLesson(user, s, lesson, answerAll(await h.snapshotsOf(user, s)));
  return user;
}

test('interruptores: con todo apagado sólo trabaja la cola del motor; el resto se registra como skipped', async () => {
  await h.setEnabled(false);
  assert.equal((await run('me_hint')).reason, 'motor_disabled');
  assert.equal((await run('srs_repair')).reason, 'srs_v2_disabled');
  await db.query('call public.srs_v2_process_migrations(10)');
  const m = await lastRun('srs_migrations');
  assert.equal(m.status, 'skipped');
  assert.equal(m.reason, 'srs_v2_disabled');
  assert.equal((await h.one('select count(*)::int n from public.srs_migration_queue')).n, 0);
  await assert.rejects(run('nada'), /invalid_request/);
  await assert.rejects(run('mastery_queue', 0), /invalid_request/);
  // Sólo service_role.
  const user = await h.learner();
  await assert.rejects(
    as(db, 'authenticated', user, () => h.call('learning_run_job', ['mastery_queue', 10])),
    /permission denied/,
  );
});

test('cola del motor: lotes, una unidad con error no deshace el lote y se reintenta hasta 5 veces', async () => {
  const user = await learnerWithLesson();
  const pending = (
    await h.one(
      'select count(*)::int n from public.knowledge_recompute_queue where user_id = $1 and processed_at is null',
      [user],
    )
  ).n;
  assert.ok(pending > 2);
  // Unidad envenenada: una dimensión inexistente hace fallar mastery_recompute_unit (FK).
  const concept = (
    await h.one(
      'select concept_id from public.knowledge_recompute_queue where user_id = $1 limit 1',
      [user],
    )
  ).concept_id;
  await db.query(
    `insert into public.knowledge_recompute_queue (user_id, concept_id, dimension, enqueued_at)
                  values ($1, $2, 'bogus', now() - interval '1 day')`,
    [user, concept],
  );
  const r1 = await run('mastery_queue', 2);
  assert.equal(r1.status, 'ok');
  assert.equal(r1.failed, 1);
  assert.equal(r1.processed, 1, 'lote de 2: la envenenada falla y la otra se procesa');
  const poison = await h.one(
    `select * from public.knowledge_recompute_queue where dimension = 'bogus'`,
  );
  assert.equal(poison.attempts, 1);
  assert.match(poison.last_error, /foreign key|violates/);
  for (let i = 0; i < 6; i++) await run('mastery_queue', 1000);
  const after = await h.one(
    `select * from public.knowledge_recompute_queue where dimension = 'bogus'`,
  );
  assert.equal(after.attempts, 5, 'deja de reintentar a los 5');
  assert.equal(
    (
      await h.one(
        'select count(*)::int n from public.knowledge_recompute_queue where user_id = $1 and processed_at is null and dimension <> $2',
        [user, 'bogus'],
      )
    ).n,
    0,
  );
  const status = await h.service(() => h.call('learning_jobs_status', []));
  assert.equal(status.mastery_queue.gave_up, 1);
  assert.equal(status.last_runs.mastery_queue.status, 'ok');
  // Idempotente: otra ejecución no recalcula nada.
  assert.equal((await run('mastery_queue')).processed, 0);
});

test('migración por lotes: un usuario por transacción, reintento con espera y máximo de 5 intentos', async () => {
  await h.setEnabled(false);
  const ok = await learnerWithLesson();
  const bad = await learnerWithLesson();
  await h.setEnabled(true);
  // Falla inyectada para un usuario al marcarlo migrado.
  await db.exec(`create function public.test_fail_migration() returns trigger language plpgsql as $$
    begin if new.user_id = '${bad}' and new.v2_since is not null then raise exception 'falla inyectada'; end if; return new; end $$;
    create trigger test_fail_migration before update on public.srs_user_head for each row execute function public.test_fail_migration();`);
  try {
    await db.query('call public.srs_v2_process_migrations(50)');
    const q = await h.all(
      'select user_id, status, attempts, last_error, next_attempt_at from public.srs_migration_queue where user_id = any($1)',
      [[ok, bad]],
    );
    const qOk = q.find((x) => x.user_id === ok);
    const qBad = q.find((x) => x.user_id === bad);
    assert.equal(qOk.status, 'done');
    assert.ok(
      (await h.one('select v2_since from public.srs_user_head where user_id = $1', [ok])).v2_since,
    );
    assert.equal(qBad.status, 'failed');
    assert.equal(qBad.attempts, 1);
    assert.match(qBad.last_error, /falla inyectada/);
    assert.ok(new Date(qBad.next_attempt_at) > new Date(), 'espera antes del reintento');
    const bh = await h.one('select v2_since from public.srs_user_head where user_id = $1', [bad]);
    assert.equal(bh?.v2_since ?? null, null, 'la falla no deja al usuario a medio migrar');
    // Sin esperar no se reintenta.
    await db.query('call public.srs_v2_process_migrations(50)');
    assert.equal(
      (await h.one('select attempts from public.srs_migration_queue where user_id = $1', [bad]))
        .attempts,
      1,
    );
    for (let i = 0; i < 6; i++) {
      await db.query(
        'update public.srs_migration_queue set next_attempt_at = now() - interval $$1 second$$ where user_id = $1',
        [bad],
      );
      await db.query('call public.srs_v2_process_migrations(50)');
    }
    assert.equal(
      (await h.one('select attempts from public.srs_migration_queue where user_id = $1', [bad]))
        .attempts,
      5,
    );
    const run = await lastRun('srs_migrations');
    assert.equal(run.status, 'ok');
    const status = await h.service(() => h.call('learning_jobs_status', []));
    assert.equal(status.migration_gave_up, 1);
    // Barrido de reparación con el v2 encendido: nada pendiente.
    const sweep = await h.service(() => h.call('learning_run_job', ['srs_repair', 1]));
    assert.equal(sweep.status, 'ok');
    assert.equal(sweep.processed, 0);
  } finally {
    await db.exec(
      'drop trigger test_fail_migration on public.srs_user_head; drop function public.test_fail_migration();',
    );
    await h.setEnabled(false);
  }
});

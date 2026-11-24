-- Trabajos de aprendizaje listos para programar (fase 4, docs/LEARNING_PHASE4.md §6).
--
-- Esta migración NO programa nada ni instala pg_cron: deja las funciones con exclusión, lotes,
-- reintentos y registro. La programación está en supabase/pending/learning_jobs_cron.sql (no es una
-- migración; requiere autorización expresa).
--
--   learning_run_job('mastery_queue' | 'me_hint' | 'srs_repair', límite) → una ejecución:
--     · exclusión por trabajo (pg_try_advisory_xact_lock): una segunda ejecución simultánea se registra
--       como `skipped / already_running` y no hace nada;
--     · interruptores: me_hint sólo con una versión del motor habilitada para Adaptive; srs_repair sólo
--       con el v2 encendido (si no, `skipped`);
--     · mastery_queue procesa por unidad con su propio punto de recuperación: una unidad que falla no
--       deshace el lote, queda con attempts/last_error y se reintenta hasta 5 veces;
--     · un fallo del trabajo entero se registra como `failed` con su mensaje (sin propagar).
--   call srs_v2_process_migrations(límite) → migración por lotes (15.3), un usuario por transacción
--     (procedimiento con COMMIT), reintentos con espera exponencial y máximo de 5 intentos.
--   learning_jobs_status() → profundidad de las colas, fallas y última ejecución de cada trabajo.
--
-- Idempotencia: las tres colas y las funciones que llaman ya lo son (fase 3: upsert por clave,
-- `for update skip locked`, `srs_applied_sessions` por sesión, migración que no repite a un migrado).
--
-- Aditiva e idempotente. ESTADO: probada en PGlite (supabase/tests/jobs.test.mjs). NO aplicada en
-- producción.

create table if not exists public.learning_job_runs (
  id bigint generated always as identity primary key,
  -- 'retention' lo agrega el cierre de la fase 4 (20261110140000, P6); esta migración tampoco está aplicada.
  job text not null check (job in ('mastery_queue', 'me_hint', 'srs_migrations', 'srs_repair', 'retention')),
  started_at timestamptz not null,
  finished_at timestamptz not null default clock_timestamp(),
  status text not null check (status in ('ok', 'skipped', 'failed')),
  reason text,
  processed integer not null default 0 check (processed >= 0),
  failed integer not null default 0 check (failed >= 0),
  remaining integer,
  error text check (char_length(error) <= 500)
);
create index if not exists learning_job_runs_job_idx on public.learning_job_runs (job, started_at desc);

alter table public.knowledge_recompute_queue add column if not exists attempts integer not null default 0;
alter table public.knowledge_recompute_queue add column if not exists last_error text;
alter table public.srs_migration_queue add column if not exists next_attempt_at timestamptz;

-- Cola del motor por unidad, con recuperación por unidad (mastery_process_queue procesa el lote en un
-- solo bloque: una unidad con error lo deshace entero y lo repite para siempre).
create or replace function public.mastery_process_queue_safe(p_limit integer, p_as_of timestamptz default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  q record;
  n integer := 0;
  f integer := 0;
  v_err text;
  v_as_of timestamptz := coalesce(p_as_of, clock_timestamp());
begin
  for q in select * from public.knowledge_recompute_queue where processed_at is null and attempts < 5
           order by enqueued_at, user_id, concept_id, dimension limit p_limit for update skip locked loop
    begin
      if exists (select 1 from public.concepts where id = q.concept_id) then
        perform public.mastery_recompute_unit(q.user_id, q.concept_id, q.dimension, v_as_of);
      end if;
      update public.knowledge_recompute_queue set processed_at = clock_timestamp(), last_error = null
      where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
      n := n + 1;
    exception when others then
      get stacked diagnostics v_err = message_text;
      update public.knowledge_recompute_queue set attempts = attempts + 1, last_error = left(v_err, 500)
      where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
      f := f + 1;
    end;
  end loop;
  return jsonb_build_object('processed', n, 'failed', f);
end;
$$;

create or replace function public.learning_run_job(p_job text, p_limit integer default 500)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_start timestamptz := clock_timestamp();
  v_status text := 'ok';
  v_reason text;
  v_n integer := 0;
  v_f integer := 0;
  v_remaining integer;
  v_err text;
  r jsonb;
begin
  if p_job is null or p_job not in ('mastery_queue', 'me_hint', 'srs_repair') then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 5000 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if not pg_try_advisory_xact_lock(hashtextextended('learning_job:' || p_job, 0)) then
    v_status := 'skipped';
    v_reason := 'already_running';
  elsif p_job = 'me_hint' and not exists (select 1 from public.mastery_model_versions where enabled_for_adaptive) then
    v_status := 'skipped';
    v_reason := 'motor_disabled';
  elsif p_job = 'srs_repair' and not public.srs_v2_enabled() then
    v_status := 'skipped';
    v_reason := 'srs_v2_disabled';
  else
    begin
      if p_job = 'mastery_queue' then
        r := public.mastery_process_queue_safe(p_limit, null);
        v_n := (r ->> 'processed')::integer;
        v_f := (r ->> 'failed')::integer;
        select count(*) into v_remaining from public.knowledge_recompute_queue
        where processed_at is null and attempts < 5;
      elsif p_job = 'me_hint' then
        v_n := public.srs_apply_me_hint(p_limit, null);
        select count(*) into v_remaining from public.srs_hint_queue where processed_at is null;
      else
        v_n := public.srs_v2_repair_sweep();
      end if;
    exception when others then
      get stacked diagnostics v_err = message_text;
      v_status := 'failed';
      v_n := 0;
    end;
  end if;
  insert into public.learning_job_runs (job, started_at, status, reason, processed, failed, remaining, error)
  values (p_job, v_start, v_status, v_reason, v_n, v_f, v_remaining, left(v_err, 500));
  return jsonb_build_object('job', p_job, 'status', v_status, 'reason', v_reason, 'processed', v_n,
                            'failed', v_f, 'remaining', v_remaining, 'error', left(v_err, 500));
end;
$$;

-- Migración por lotes (15.3): un usuario por transacción. Es un procedimiento con COMMIT, así que no
-- puede ser security definer ni llevar `set search_path` (PostgreSQL no permite control de
-- transacciones con ninguno de los dos): todo está calificado con `public.` y sólo lo ejecutan
-- postgres (pg_cron) y service_role. Exclusión con un bloqueo de sesión: se libera al terminar o al
-- cerrarse la conexión de la ejecución.
create or replace procedure public.srs_v2_process_migrations(p_limit integer default 50)
language plpgsql
as $$
declare
  v_start timestamptz := clock_timestamp();
  v_user uuid;
  v_n integer := 0;
  v_f integer := 0;
  v_err text;
begin
  if p_limit is null or p_limit < 1 or p_limit > 1000 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if not public.srs_v2_enabled() then
    insert into public.learning_job_runs (job, started_at, status, reason)
    values ('srs_migrations', v_start, 'skipped', 'srs_v2_disabled');
    commit;
    return;
  end if;
  if not pg_try_advisory_lock(hashtextextended('learning_job:srs_migrations', 0)) then
    insert into public.learning_job_runs (job, started_at, status, reason)
    values ('srs_migrations', v_start, 'skipped', 'already_running');
    commit;
    return;
  end if;
  perform public.srs_v2_enqueue_migrations();
  commit;
  loop
    exit when v_n + v_f >= p_limit;
    v_user := null;
    select q.user_id into v_user from public.srs_migration_queue q
    where q.status in ('pending', 'failed') and q.attempts < 5
      and coalesce(q.next_attempt_at, '-infinity'::timestamptz) <= now()
    order by q.enqueued_at, q.user_id limit 1 for update skip locked;
    exit when v_user is null;
    begin
      perform public.srs_v2_migrate_user(v_user, null);
      update public.srs_migration_queue set status = 'done', attempts = attempts + 1, last_error = null,
        next_attempt_at = null, updated_at = now()
      where user_id = v_user;
      v_n := v_n + 1;
    exception when others then
      get stacked diagnostics v_err = message_text;
      update public.srs_migration_queue set status = 'failed', attempts = attempts + 1,
        last_error = left(v_err, 500),
        next_attempt_at = now() + make_interval(mins => (5 * power(2, least(attempts, 6)))::integer),
        updated_at = now()
      where user_id = v_user;
      v_f := v_f + 1;
    end;
    commit;
  end loop;
  insert into public.learning_job_runs (job, started_at, status, processed, failed, remaining, error)
  values ('srs_migrations', v_start, 'ok', v_n, v_f,
          (select count(*) from public.srs_migration_queue where status in ('pending', 'failed') and attempts < 5),
          left(v_err, 500));
  perform pg_advisory_unlock(hashtextextended('learning_job:srs_migrations', 0));
  commit;
end;
$$;

-- Observabilidad: colas, fallas y última ejecución de cada trabajo.
create or replace function public.learning_jobs_status()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'srs_v2_enabled', public.srs_v2_enabled(),
    'motor_enabled_for_adaptive', exists (select 1 from public.mastery_model_versions where enabled_for_adaptive),
    'mastery_queue', jsonb_build_object(
      'pending', (select count(*) from public.knowledge_recompute_queue where processed_at is null and attempts < 5),
      'retrying', (select count(*) from public.knowledge_recompute_queue where processed_at is null and attempts between 1 and 4),
      'gave_up', (select count(*) from public.knowledge_recompute_queue where processed_at is null and attempts >= 5),
      'oldest_pending', (select min(enqueued_at) from public.knowledge_recompute_queue where processed_at is null)),
    'hint_queue', jsonb_build_object(
      'pending', (select count(*) from public.srs_hint_queue where processed_at is null),
      'oldest_pending', (select min(enqueued_at) from public.srs_hint_queue where processed_at is null)),
    'migration_queue', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb)
                        from (select status, count(*) n from public.srs_migration_queue group by status) x),
    'migration_gave_up', (select count(*) from public.srs_migration_queue where status = 'failed' and attempts >= 5),
    'last_runs', (select coalesce(jsonb_object_agg(job, to_jsonb(r) - 'job'), '{}'::jsonb)
                  from (select distinct on (job) * from public.learning_job_runs order by job, started_at desc, id desc) r))
$$;

alter table public.learning_job_runs enable row level security;
revoke all on public.learning_job_runs from anon, authenticated;

revoke execute on function public.mastery_process_queue_safe(integer, timestamptz),
  public.learning_run_job(text, integer), public.learning_jobs_status()
from public, anon, authenticated;
revoke execute on procedure public.srs_v2_process_migrations(integer) from public, anon, authenticated;
grant execute on function public.learning_run_job(text, integer), public.learning_jobs_status() to service_role;
grant execute on procedure public.srs_v2_process_migrations(integer) to service_role;

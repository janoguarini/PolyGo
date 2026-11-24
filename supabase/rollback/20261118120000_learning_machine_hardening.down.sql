-- =====================================================================
-- Reversión de supabase/migrations/20261118120000_learning_machine_hardening.sql. NO es una migración:
-- se aplica a mano (como dueño) sólo si hiciera falta deshacer el cierre del Learning Machine.
--
-- Restaura, sin cambios, las definiciones anteriores de las dos funciones que reemplaza la migración:
--   · public.srs_apply_me_hint(integer, timestamptz)
--       copiada literalmente de 20261109130000_mastery_engine.sql, líneas 694–750.
--   · public.mastery_process_queue_safe(integer, timestamptz)
--       copiada literalmente de 20261110130000_learning_jobs.sql, líneas 46–77.
-- Mismas firmas, tipos de retorno y valores por defecto que la migración, así que `create or replace`
-- es válido en los dos sentidos. Sin tablas, sin datos y sin operaciones destructivas. Los permisos son
-- los de esas migraciones (20261109130000:762–771 y 20261110130000:232–234); `create or replace` los
-- conserva y se repiten por claridad.
--
-- Efecto: vuelven los interbloqueos J6 y K6c (supabase/tests/pg17/jobs-concurrency.mjs y
-- srs2-concurrency.mjs). No deshacer si los trabajos están programados con usuarios activos.
--
-- ARTEFACTO LOCAL PRELIMINAR: no está validado contra producción. Antes de usarlo hay que obtener
-- `pg_get_functiondef` de las dos funciones en producción y compararlo con este archivo.
-- =====================================================================

create or replace function public.srs_apply_me_hint(p_limit integer default 500, p_now timestamptz default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  q record;
  s public.user_srs_state;
  me public.user_concept_state;
  v_now timestamptz := coalesce(p_now, clock_timestamp());
  v_tz text;
  v_enabled boolean;
  v_isrs interval;
  v_due_me timestamptz;
  v_d1 timestamptz;
  v_cand timestamptz;
  v_hl numeric;
  n integer := 0;
begin
  perform set_config('polygo.srs_writer', 'hint', true);
  for q in select * from public.srs_hint_queue where processed_at is null order by enqueued_at
           limit p_limit for update skip locked loop
    update public.srs_hint_queue set processed_at = clock_timestamp()
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
    select * into s from public.user_srs_state
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
    continue when not found;
    select * into me from public.user_concept_state
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
    select enabled_for_adaptive into v_enabled from public.mastery_model_versions where version = me.model_version;
    v_hl := (me.model_detail ->> 'half_life_days')::numeric;
    v_isrs := s.due_at - s.t_last;
    -- E(u, t): cualquier dato nulo, no finito, atrasado o fuera de versión → sin adelanto.
    if me.user_id is null or not coalesce(v_enabled, false)
       or not coalesce((me.model_detail ->> 'retention_sufficient')::boolean, false)
       or v_hl is null or v_hl <= 0 or me.last_exposed_at is null or me.last_exposed_at > v_now
       or (me.dirty_since is not null and v_now - me.dirty_since > interval '72 hours')
       or me.computed_at is null or v_now - me.computed_at > interval '7 days'
       or s.stability is null or v_isrs <= interval '0' then
      continue;
    end if;
    v_tz := coalesce((select time_zone from public.srs_user_head where user_id = q.user_id), 'UTC');
    v_due_me := me.last_exposed_at + make_interval(secs => (v_hl * log(2::numeric, 1 / 0.85::numeric) * 86400)::double precision);
    v_d1 := ((s.last_seen_at at time zone v_tz)::date + 1)::timestamp at time zone v_tz;
    v_cand := greatest(v_due_me, greatest(s.t_last + 0.5 * v_isrs, v_d1));
    continue when v_cand >= s.due_at;
    update public.user_srs_state set due_effective_at = v_cand, me_hint_at = v_now,
      me_hint_expires_at = least(v_now + interval '72 hours', me.computed_at + interval '7 days')
    where user_id = s.user_id and concept_id = s.concept_id and dimension = s.dimension
      and updated_at = s.updated_at;
    if found then n := n + 1; end if;
  end loop;
  perform set_config('polygo.srs_writer', '', true);
  return n;
end;
$$;

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

revoke execute on function public.srs_apply_me_hint(integer, timestamptz), public.mastery_process_queue_safe(integer, timestamptz)
  from public, anon, authenticated;
grant execute on function public.srs_apply_me_hint(integer, timestamptz) to service_role;

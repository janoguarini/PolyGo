-- Cierre del Learning Machine: concurrencia de los trabajos del motor (docs/LEARNING_MACHINE_CLOSURE.md).
--
-- Aditiva: sólo reemplaza dos funciones de trabajos que hoy no corre nada (sin pg_cron, motor apagado).
-- No cambia ningún algoritmo, parámetro, tabla, permiso ni interruptor.
--
-- 1. srs_apply_me_hint (R1, 7.2 de ADAPTIVE_LEARNING_DESIGN.md). Antes leía la unidad sin bloquearla y la
--    escribía con `update … where updated_at = <leído>`: dentro de un lote, el trabajo quedaba con filas de
--    user_srs_state bloqueadas en el orden de la cola mientras srs_v2_apply_session bloquea las unidades de
--    una sesión en orden (concept_id, dimension). Dos órdenes distintos = ciclo de esperas posible entre el
--    trabajo y el envío de un alumno. Ahora el trabajo NUNCA espera una fila del SRS: la bloquea con
--    SKIP LOCKED; si un envío la tiene, la deja en la cola para la ejecución siguiente (la sesión, además,
--    anula cualquier sugerencia, I6). La regla E(u, t), el cálculo del candidato y las columnas que escribe
--    (I4) no cambian; la comparación de updated_at se conserva.
--
-- 2. mastery_process_queue_safe. El lote bloquea sus filas de knowledge_recompute_queue; un envío corre
--    mastery_mark_dirty por corrección (marca user_concept_state y reencola la unidad) en el orden de los
--    intentos. Si el envío ya marcó una unidad del lote y espera otra que el lote tiene, y el lote llega a
--    la primera, PostgreSQL aborta a uno de los dos (prueba J6 de supabase/tests/pg17/jobs-concurrency.mjs).
--    Ahora el trabajo no espera filas de user_concept_state que tenga otra transacción: la unidad queda
--    pendiente, sin contar como intento fallido, para la ejecución siguiente. El cálculo (me-1.0.0) no
--    cambia.

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
    -- Sin esperar: si un envío tiene la unidad, queda en la cola (no se marca procesada).
    select * into s from public.user_srs_state
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension
    for update skip locked;
    if not found then
      continue when exists (select 1 from public.user_srs_state
                            where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension);
      update public.srs_hint_queue set processed_at = clock_timestamp()
      where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
      continue;
    end if;
    update public.srs_hint_queue set processed_at = clock_timestamp()
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
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
  b integer := 0;
  v_err text;
  v_as_of timestamptz := coalesce(p_as_of, clock_timestamp());
begin
  for q in select * from public.knowledge_recompute_queue where processed_at is null and attempts < 5
           order by enqueued_at, user_id, concept_id, dimension limit p_limit for update skip locked loop
    -- Sin esperar a un envío en curso: si otra transacción tiene la fila del estado, la unidad queda
    -- pendiente (sin sumar intentos) y la recalcula la ejecución siguiente.
    if not exists (select 1 from public.user_concept_state
                   where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension
                   for update skip locked)
       and exists (select 1 from public.user_concept_state
                   where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension) then
      b := b + 1;
      continue;
    end if;
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
  return jsonb_build_object('processed', n, 'failed', f, 'busy', b);
end;
$$;

-- Mismos permisos que las definiciones anteriores (create or replace los conserva; se repiten por claridad).
revoke execute on function public.srs_apply_me_hint(integer, timestamptz), public.mastery_process_queue_safe(integer, timestamptz)
  from public, anon, authenticated;
grant execute on function public.srs_apply_me_hint(integer, timestamptz) to service_role;

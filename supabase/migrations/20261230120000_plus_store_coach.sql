-- PolyGo Plus: compras de la tienda (RevenueCat), «Sin publicidad» y Coach con 2 sesiones de prueba.
-- Diseño y verificación: docs/PLUS.md. Pruebas: supabase/tests/plusStore.test.mjs.
--
-- Idempotente (se puede correr dos veces). ADITIVA. No toca Ranked, ELO, settlement ni la energía. Cambios:
--   1. user_entitlements: admite 'ad_free' y el origen 'promotional'; columnas nuevas (nullable) con
--      el detalle de la tienda (producto, renovación, problema de cobro, última sincronización).
--   2. has_ad_free(), get_entitlements() (lo que la app lee) y store_sync_entitlements() (sólo
--      service_role: la Edge Function plus-store, con el estado pedido a la API de RevenueCat).
--   3. coach_sessions + coach_config() + coach_claim_session() + get_coach_status().
--   4. learning_start_focus_review: acepta el foco 'coach' (resto IDÉNTICO a la fase 5). Sin Plus,
--      descuenta una sesión de prueba EN LA MISMA TRANSACCIÓN que crea la sesión: si algo falla, no se
--      descuenta; un reintento de la misma sesión devuelve la misma sesión sin volver a descontar.
--
-- Rollback (en este orden; antes, quitar de la app el Coach y las compras):
--   restaurar learning_start_focus_review desde 20261111120000_learning_phase5.sql;
--   drop function public.get_coach_status(), public.coach_claim_session(uuid, uuid, text, text[]),
--     public.coach_config(), public.store_sync_entitlements(uuid, jsonb), public.get_entitlements(),
--     public.has_ad_free(uuid);
--   drop table public.coach_sessions;
--   delete from public.user_entitlements where entitlement = 'ad_free' or source = 'promotional';
--   alter table public.user_entitlements drop column product_id, drop column will_renew,
--     drop column billing_issue_at, drop column store_synced_at;
--   restaurar los checks de entitlement ('plus') y source ('app_store','play_store','manual','referral').

-- ---------- 1. user_entitlements ----------
alter table public.user_entitlements drop constraint if exists user_entitlements_entitlement_check;
alter table public.user_entitlements add constraint user_entitlements_entitlement_check
  check (entitlement in ('plus', 'ad_free'));
alter table public.user_entitlements drop constraint if exists user_entitlements_source_check;
alter table public.user_entitlements add constraint user_entitlements_source_check
  check (source in ('app_store', 'play_store', 'promotional', 'manual', 'referral'));

alter table public.user_entitlements
  -- Producto de la tienda (polygo_plus_monthly, …). null en otorgamientos manuales o por invitación.
  add column if not exists product_id text,
  -- false = canceló: conserva el acceso hasta expires_at y después vuelve a gratis.
  add column if not exists will_renew boolean,
  -- La tienda no pudo cobrar (período de gracia si la plataforma lo da).
  add column if not exists billing_issue_at timestamptz,
  -- Última vez que plus-store la escribió con datos de RevenueCat.
  add column if not exists store_synced_at timestamptz;

-- ---------- 2. lectura y sincronización ----------
create or replace function public.has_ad_free(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_plus(p_user) or exists (
    select 1 from public.user_entitlements e
    where e.user_id = p_user and e.entitlement = 'ad_free'
      and e.starts_at <= now() and (e.expires_at is null or e.expires_at > now()))
$$;
revoke all on function public.has_ad_free(uuid) from public, anon, authenticated;

-- Lo que la app necesita saber de sus derechos (con la hora del servidor). Nunca escribe nada.
create or replace function public.get_entitlements()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_plus public.user_entitlements;
begin
  if v_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into v_plus from public.user_entitlements where user_id = v_user and entitlement = 'plus';
  return jsonb_build_object(
    'server_now', now(),
    'plus', public.has_plus(v_user),
    'ad_free', public.has_ad_free(v_user),
    -- Detalle de la suscripción (también vencida: la app muestra «tu Plus venció»).
    'plus_detail', case when v_plus.user_id is null then null else jsonb_build_object(
      'source', v_plus.source,
      'product_id', v_plus.product_id,
      'expires_at', v_plus.expires_at,
      'will_renew', v_plus.will_renew,
      'billing_issue', v_plus.billing_issue_at is not null) end);
end;
$$;
revoke all on function public.get_entitlements() from public, anon;
grant execute on function public.get_entitlements() to authenticated;

-- Escribe el estado de la tienda (shared/storeEntitlements.ts, snapshotFromRevenueCat). Sólo
-- service_role. Reglas:
--   · un derecho de la tienda se reemplaza por lo que diga la tienda (renovación, cancelación,
--     reembolso, período de gracia);
--   · si la tienda ya no lo tiene, uno vigente de la tienda vence ahora (revocación);
--   · uno manual o por invitación vigente que dure más que el de la tienda no se pisa.
create or replace function public.store_sync_entitlements(p_user uuid, p_snapshot jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ent text;
  v_new jsonb;
  v_row public.user_entitlements;
  v_expires timestamptz;
begin
  if p_user is null or jsonb_typeof(p_snapshot) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = p_user) then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;
  foreach v_ent in array array['plus', 'ad_free'] loop
    v_new := p_snapshot -> v_ent;
    select * into v_row from public.user_entitlements
    where user_id = p_user and entitlement = v_ent for update;

    if v_new is null or jsonb_typeof(v_new) = 'null' then
      if v_row.user_id is not null and v_row.source in ('app_store', 'play_store', 'promotional')
         and (v_row.expires_at is null or v_row.expires_at > now()) then
        update public.user_entitlements
        set expires_at = now(), will_renew = false, store_synced_at = now(), updated_at = now()
        where user_id = p_user and entitlement = v_ent;
      end if;
      continue;
    end if;

    if jsonb_typeof(v_new) <> 'object'
       or coalesce(v_new ->> 'source', '') not in ('app_store', 'play_store', 'promotional')
       or coalesce(v_new ->> 'product_id', '') = '' then
      raise exception 'invalid_request' using errcode = '22023';
    end if;
    v_expires := (v_new ->> 'expires_at')::timestamptz;

    if v_row.user_id is not null and v_row.source in ('manual', 'referral')
       and (v_row.expires_at is null or v_row.expires_at > now())
       and (v_row.expires_at is null or (v_expires is not null and v_row.expires_at >= v_expires)) then
      continue;
    end if;

    insert into public.user_entitlements as e (user_id, entitlement, source, starts_at, expires_at,
      external_id, product_id, will_renew, billing_issue_at, store_synced_at, updated_at)
    values (p_user, v_ent, v_new ->> 'source',
      least(coalesce((v_new ->> 'starts_at')::timestamptz, now()), now()), v_expires,
      v_new ->> 'external_id', v_new ->> 'product_id', coalesce((v_new ->> 'will_renew')::boolean, false),
      (v_new ->> 'billing_issue_at')::timestamptz, now(), now())
    on conflict (user_id, entitlement) do update set
      source = excluded.source, starts_at = excluded.starts_at, expires_at = excluded.expires_at,
      external_id = excluded.external_id, product_id = excluded.product_id,
      will_renew = excluded.will_renew, billing_issue_at = excluded.billing_issue_at,
      store_synced_at = excluded.store_synced_at, updated_at = excluded.updated_at;
  end loop;
  return jsonb_build_object('plus', public.has_plus(p_user), 'ad_free', public.has_ad_free(p_user));
end;
$$;
revoke all on function public.store_sync_entitlements(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.store_sync_entitlements(uuid, jsonb) to service_role;

-- ---------- 3. Coach ----------
-- Espejo de shared/plus.ts (FREE_LIMITS.coachTrialSessions, COACH): un test compara ambos.
create or replace function public.coach_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object('free_trial_sessions', 2, 'session_size', 8, 'max_areas', 3)
$$;
grant execute on function public.coach_config() to authenticated;

-- Una fila por sesión de Coach iniciada. trial = se hizo sin Plus (cuenta para el límite de por vida
-- de la cuenta: reinstalar, cerrar sesión o cambiar de teléfono no lo reinicia). El resultado no se
-- duplica: está en learning_sessions (mismo id) cuando el alumno la termina.
create table if not exists public.coach_sessions (
  session_id uuid primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  language_code text not null references public.languages (code),
  unit_ids text[] not null check (cardinality(unit_ids) between 1 and 3),
  trial boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists coach_sessions_user_idx on public.coach_sessions (user_id, created_at desc);

alter table public.coach_sessions enable row level security;
revoke all on public.coach_sessions from anon, authenticated;
grant select on public.coach_sessions to authenticated;
drop policy if exists "coach sessions readable by owner" on public.coach_sessions;
create policy "coach sessions readable by owner" on public.coach_sessions
  for select to authenticated using (user_id = (select auth.uid()));

-- Registra una sesión de Coach. Sin Plus descuenta una prueba (o lanza coach_trial_exhausted).
-- Interna: sólo la llama learning_start_focus_review, dentro de su transacción.
create or replace function public.coach_claim_session(
  p_user uuid, p_session_id uuid, p_lang text, p_units text[])
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plus boolean := public.has_plus(p_user);
begin
  -- Serializa las sesiones de una misma cuenta: dos teléfonos a la vez no gastan la misma prueba.
  perform pg_advisory_xact_lock(hashtextextended('coach_trial:' || p_user::text, 0));
  if exists (select 1 from public.coach_sessions where session_id = p_session_id) then
    if not exists (select 1 from public.coach_sessions where session_id = p_session_id and user_id = p_user) then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return false;
  end if;
  if not v_plus and (select count(*) from public.coach_sessions where user_id = p_user and trial)
       >= (public.coach_config() ->> 'free_trial_sessions')::integer then
    raise exception 'coach_trial_exhausted' using errcode = '42501';
  end if;
  insert into public.coach_sessions (session_id, user_id, language_code, unit_ids, trial)
  values (p_session_id, p_user, p_lang, p_units, not v_plus);
  return true;
end;
$$;
revoke all on function public.coach_claim_session(uuid, uuid, text, text[]) from public, anon, authenticated;

-- Estado del Coach para la app: pruebas usadas y restantes, y las últimas sesiones con su resultado.
create or replace function public.get_coach_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_limit integer := (public.coach_config() ->> 'free_trial_sessions')::integer;
  v_used integer;
begin
  if v_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select count(*) into v_used from public.coach_sessions where user_id = v_user and trial;
  return jsonb_build_object(
    'plus', public.has_plus(v_user),
    'trial_limit', v_limit,
    'trial_used', v_used,
    'trial_remaining', greatest(0, v_limit - v_used),
    'sessions', coalesce((
      select jsonb_agg(jsonb_build_object(
               'session_id', c.session_id, 'language_code', c.language_code, 'unit_ids', to_jsonb(c.unit_ids),
               'trial', c.trial, 'created_at', c.created_at,
               'completed_at', l.completed_at, 'correct', l.first_try_correct, 'total', l.first_try_total)
             order by c.created_at desc)
      from (select * from public.coach_sessions where user_id = v_user order by created_at desc limit 20) c
      left join public.learning_sessions l on l.id = c.session_id and l.user_id = v_user), '[]'::jsonb));
end;
$$;
revoke all on function public.get_coach_status() from public, anon;
grant execute on function public.get_coach_status() to authenticated;

-- ---------- 4. learning_start_focus_review con el foco 'coach' ----------
-- Copia de 20261111120000_learning_phase5.sql. Cambios, todos marcados «coach»: validación del foco,
-- el permiso (Plus o prueba), el tope de la sesión, el filtro de unidades, el motivo y el foco guardado.
create or replace function public.learning_start_focus_review(
  p_user uuid, p_session_id uuid, p_lang text, p_tz text, p_plan jsonb, p_orders jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_n integer;
  v_bad integer;
  v_cand jsonb;
  v_tz text := public.safe_time_zone(p_tz);
  v_focus jsonb := p_plan -> 'focus';
  v_kind text;
  v_unit text;
  v_units text[];
  v_source text;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_session_id is null or jsonb_typeof(p_plan) is distinct from 'object'
     or jsonb_typeof(p_plan -> 'items') is distinct from 'array' or jsonb_typeof(p_orders) is distinct from 'object'
     or jsonb_typeof(v_focus) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_kind := v_focus ->> 'kind';
  v_unit := v_focus ->> 'unit_id';
  -- coach: 1 a 3 unidades distintas.
  if v_kind = 'coach' then
    if jsonb_typeof(v_focus -> 'unit_ids') is distinct from 'array' then
      raise exception 'invalid_request' using errcode = '22023';
    end if;
    select array_agg(u) into v_units from jsonb_array_elements_text(v_focus -> 'unit_ids') u;
    if v_units is null or cardinality(v_units) not between 1 and 3
       or (select count(distinct u) from unnest(v_units) u) <> cardinality(v_units) then
      raise exception 'invalid_request' using errcode = '22023';
    end if;
  end if;
  if v_kind is null or v_kind not in ('smart', 'topic', 'coach') or (v_kind = 'topic' and v_unit is null) then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));
  if exists (select 1 from public.learning_sessions where id = p_session_id) then
    raise exception 'session_closed' using errcode = '22023';
  end if;
  if exists (select 1 from public.exercise_presentations where session_id = p_session_id and user_id <> p_user)
     or exists (select 1 from public.srs_session_plans where session_id = p_session_id and user_id <> p_user) then
    raise exception 'session_conflict' using errcode = '23505';
  end if;
  select source into v_source from public.srs_session_plans where session_id = p_session_id;
  if found then
    if v_source <> 'focus_review' then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true,
      'plan', (select items from public.srs_session_plans where session_id = p_session_id),
      'presentations', public.learning_presentations_public(p_user, p_session_id));
  end if;
  -- El beneficio lo decide el servidor, nunca la app (mismas reglas comerciales de siempre).
  -- coach: Plus o una sesión de prueba; se descuenta acá y se revierte si la sesión no llega a crearse.
  if v_kind = 'coach' then
    perform public.coach_claim_session(p_user, p_session_id, p_lang, v_units);
  elsif not public.has_plus(p_user) then
    raise exception 'plus_required' using errcode = '42501';
  end if;
  v_n := jsonb_array_length(p_plan -> 'items');
  if v_n = 0 then
    raise exception 'nothing_to_review' using errcode = 'P0002';
  end if;
  if v_n > 15 or (v_kind = 'coach' and v_n > (public.coach_config() ->> 'session_size')::integer) then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  select coalesce(jsonb_agg(to_jsonb(r)), '[]') into v_cand
  from public.review_item_candidates(p_lang) r
  where r.dimension = 'vocabulary'
    and r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x)
    and public.review_item_known(p_user, r.item_id, 'v1');
  select count(*) into v_bad
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  where (x ->> 'position')::integer is distinct from ord::integer
     or not exists (select 1 from jsonb_array_elements(v_cand) r
                    where r ->> 'item_id' = x ->> 'item_id' and r ->> 'concept_id' = x ->> 'concept_id'
                      and r ->> 'dimension' = x ->> 'dimension' and r ->> 'rung' = x ->> 'rung')
     or not exists (select 1 from public.concepts c
                    join public.user_word_progress p on p.word_id = c.word_id and p.user_id = p_user and p.seen_count > 0
                    join public.words w on w.id = c.word_id and w.language_code = p_lang
                    where c.id = x ->> 'concept_id'
                      and (v_kind = 'smart' or (v_kind = 'topic' and w.unit_id = v_unit)
                           or (v_kind = 'coach' and w.unit_id = any (v_units))))
     or (v_kind = 'smart' and coalesce(x ->> 'reason', '') not in ('due', 'frequent_mistakes', 'difficult', 'due_soon'))
     or (v_kind = 'topic' and x ->> 'reason' is distinct from 'topic')
     or (v_kind = 'coach' and x ->> 'reason' is distinct from 'coach');
  if v_bad > 0
     or (select count(distinct x ->> 'concept_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n
     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n
     or (select count(*) from (select distinct x ->> 'item_id' as item_id, ic.concept_id
                               from jsonb_array_elements(p_plan -> 'items') x
                               join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') t)
        <> (select count(distinct ic.concept_id) from jsonb_array_elements(p_plan -> 'items') x
            join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  if (select coalesce(array_agg(x ->> 'item_id' order by x ->> 'item_id'), '{}')
      from jsonb_array_elements(p_plan -> 'items') x
      where exists (select 1 from jsonb_array_elements(v_cand) r where r ->> 'item_id' = x ->> 'item_id' and r ->> 'option_set_id' is not null))
     <> (select coalesce(array_agg(k order by k), '{}') from jsonb_object_keys(p_orders) k) then
    raise exception 'invalid_orders' using errcode = '22023';
  end if;

  insert into public.srs_session_plans (session_id, user_id, language_code, source, planner_version, algorithm_version,
    weights_version, budget, items, time_zone, local_date, focus)
  values (p_session_id, p_user, p_lang, 'focus_review', coalesce(p_plan ->> 'planner_version', 'focus-1.0.0'),
    'srs-2.0.0', (select weights_version from public.srs_weights where status = 'active' limit 1),
    coalesce((p_plan ->> 'capacity')::integer, v_n), p_plan -> 'items', v_tz, (now() at time zone v_tz)::date,
    case when v_kind = 'topic' then jsonb_build_object('kind', 'topic', 'unit_id', v_unit)
         when v_kind = 'coach' then jsonb_build_object('kind', 'coach', 'unit_ids', to_jsonb(v_units))
         else jsonb_build_object('kind', 'smart') end);

  insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id,
    exercise_id, option_set_id, option_order, shuffle_algorithm, shuffle_seed)
  select p_user, p_session_id, ord::smallint, r.item_id, r.item_version_id, null, r.option_set_id,
         case when r.option_set_id is not null then
           (select array_agg(v::smallint order by n) from jsonb_array_elements_text(p_orders -> r.item_id) with ordinality as o(v, n)) end,
         case when r.option_set_id is not null then 'polygo.shuffle.v1' end,
         case when r.option_set_id is not null then p_session_id::text || ':' || r.item_id end
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  join jsonb_to_recordset(v_cand) as r(item_id text, concept_id text, dimension text, item_version_id bigint, option_set_id bigint)
    on r.item_id = x ->> 'item_id' and r.concept_id = x ->> 'concept_id' and r.dimension = x ->> 'dimension'
  order by ord;

  return jsonb_build_object('session_id', p_session_id, 'duplicate', false, 'plan', p_plan -> 'items',
    'presentations', public.learning_presentations_public(p_user, p_session_id));
end;
$$;

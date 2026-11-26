-- Panel Superadmin (Etapa A): acceso exclusivo de janitogap y lecturas agregadas para admin/.
--
-- Seguridad (docs/ADMIN_PANEL.md):
--   · schema `admin` sin USAGE para public/anon/authenticated/service_role: la API REST no lo expone
--     y ningún cliente puede leer ni escribir sus tablas (superadmins, internal_accounts, audit_log,
--     security_events). El único superadmin se carga en esta migración por UID.
--   · admin.assert_superadmin() decide con auth.uid() (JWT firmado por Supabase, nunca un username
--     ni un parámetro). Exige las DOS cosas: que el UID sea la constante admin.superadmin_uid() y que
--     esté en admin.superadmins. Además exige MFA: el claim `aal` del JWT debe ser 'aal2' (TOTP
--     verificado en esta sesión). Si falla: 42501 (PostgREST responde 403).
--   · Cada public.admin_* es SECURITY DEFINER con search_path vacío, sólo lee (salvo el registro de
--     auditoría) y su primera sentencia llama a la guardia. EXECUTE sólo para authenticated: anon ni
--     siquiera puede invocarlas. admin_session_check() es la única que no lanza error: el panel la
--     usa al iniciar sesión para saber si debe pedir MFA o cerrar la sesión.
--   · Los intentos denegados de usuarios logueados quedan en admin.security_events (como máximo uno
--     por usuario y motivo cada 10 minutos, para que nadie pueda inflar la tabla).
--
-- Métricas: excluyen las cuentas de admin.internal_accounts (janitogap, hola, janotester) en todo lo
-- que es «usuarios reales»; la lista de usuarios, la ficha, el ranking y la auditoría las muestran
-- marcadas. Días calendario en America/Argentina/Buenos_Aires (admin.tz()). Fórmulas: docs/ADMIN_PANEL.md.
--
-- También agrega índices por fecha para que los filtros por período no recorran tablas enteras.
--
-- Rollback (deja la base como antes; no toca datos de la app):
--   drop schema admin cascade;   -- borra tablas admin.* y sus funciones auxiliares
--   do $$ declare f regprocedure; begin
--     for f in select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--              where n.nspname = 'public' and p.proname like 'admin\_%' loop
--       execute format('drop function %s', f);
--     end loop; end $$;
--   drop index if exists public.battles_created_idx, public.learning_sessions_completed_idx,
--     public.exercise_attempts_created_idx, public.profiles_created_idx,
--     public.user_daily_activity_date_idx, public.rating_history_created_idx;

-- =====================================================================================
-- Schema y tablas privadas
-- =====================================================================================
create schema if not exists admin;
revoke all on schema admin from public;
do $$
begin
  execute 'revoke all on schema admin from anon, authenticated';
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on schema admin from service_role';
  end if;
end $$;

create table admin.superadmins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now()
);

create table admin.internal_accounts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now()
);

create table admin.audit_log (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  action text not null,
  params jsonb,
  created_at timestamptz not null default now()
);
create index audit_log_created_idx on admin.audit_log (created_at desc);
create index audit_log_user_action_idx on admin.audit_log (user_id, action, created_at desc);

create table admin.security_events (
  id bigint generated always as identity primary key,
  user_id uuid,
  event text not null check (event in ('access_granted', 'denied_not_admin', 'denied_mfa')),
  aal text,
  created_at timestamptz not null default now()
);
create index security_events_created_idx on admin.security_events (created_at desc);
create index security_events_user_idx on admin.security_events (user_id, event, created_at desc);

alter table admin.superadmins enable row level security;
alter table admin.internal_accounts enable row level security;
alter table admin.audit_log enable row level security;
alter table admin.security_events enable row level security;

do $$
begin
  execute 'revoke all on all tables in schema admin from public, anon, authenticated';
  execute 'revoke all on all sequences in schema admin from public, anon, authenticated';
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on all tables in schema admin from service_role';
    execute 'revoke all on all sequences in schema admin from service_role';
  end if;
end $$;

-- El único superadmin: janitogap. Sólo si la cuenta existe (en las bases de prueba no existe y la
-- migración no debe fallar).
insert into admin.superadmins (user_id, label)
select u.id, 'janitogap' from auth.users u
where u.id = '267762e4-8145-4e48-900b-9b14ccefb59b'::uuid
on conflict (user_id) do nothing;

-- Cuentas internas (no cuentan como usuarios reales en las métricas).
insert into admin.internal_accounts (user_id, label)
select u.id, v.label
from (values
  ('267762e4-8145-4e48-900b-9b14ccefb59b'::uuid, 'janitogap'),
  ('4540f36f-73e5-447e-95a6-8a0c1682b40d'::uuid, 'hola'),
  ('41ee39d6-cce1-404b-aef7-adbf93cb6cd9'::uuid, 'janotester')
) v (id, label)
join auth.users u on u.id = v.id
on conflict (user_id) do nothing;

-- Índices por fecha (los filtros de período del panel).
create index if not exists battles_created_idx on public.battles (created_at);
create index if not exists learning_sessions_completed_idx on public.learning_sessions (completed_at);
create index if not exists exercise_attempts_created_idx on public.exercise_attempts (created_at);
create index if not exists profiles_created_idx on public.profiles (created_at);
create index if not exists user_daily_activity_date_idx on public.user_daily_activity (activity_date);
create index if not exists rating_history_created_idx on public.rating_history (created_at);

-- =====================================================================================
-- Guardia
-- =====================================================================================

/** El UID del único superadmin. Cambiarlo exige una migración nueva. */
create function admin.superadmin_uid()
returns uuid
language sql
immutable
set search_path = ''
as $$ select '267762e4-8145-4e48-900b-9b14ccefb59b'::uuid $$;

/** Nivel de autenticación del JWT de esta request ('aal1', 'aal2' o ''). */
create function admin.request_aal()
returns text
language plpgsql
stable
set search_path = ''
as $$
declare
  v_claims jsonb;
begin
  begin
    v_claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
  exception when others then
    v_claims := null;
  end;
  return coalesce(v_claims ->> 'aal', '');
end;
$$;

/** ¿El usuario de esta request es el superadmin? (sin mirar MFA). */
create function admin.caller_is_superadmin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select auth.uid() is not null
     and auth.uid() = admin.superadmin_uid()
     and exists (select 1 from admin.superadmins s where s.user_id = auth.uid())
$$;

/** Registra un evento de seguridad, como máximo uno por usuario y tipo cada 10 minutos. */
create function admin.log_security_event(p_event text)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return;
  end if;
  if not exists (
    select 1 from admin.security_events e
    where e.user_id = auth.uid() and e.event = p_event
      and e.created_at > now() - interval '10 minutes'
  ) then
    insert into admin.security_events (user_id, event, aal)
    values (auth.uid(), p_event, nullif(admin.request_aal(), ''));
  end if;
end;
$$;

/**
 * Primera sentencia de cada public.admin_*: corta con 42501 si quien llama no es el superadmin con
 * MFA. Deja la lectura en admin.audit_log (la misma acción con los mismos parámetros se registra una
 * vez por minuto: la actualización automática del panel no llena la tabla).
 */
create function admin.assert_superadmin(p_action text, p_params jsonb default null)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if not admin.caller_is_superadmin() then
    raise exception 'admin_forbidden' using errcode = '42501';
  end if;
  if admin.request_aal() <> 'aal2' then
    raise exception 'admin_mfa_required' using errcode = '42501';
  end if;
  if not exists (
    select 1 from admin.audit_log a
    where a.user_id = v_uid and a.action = p_action and a.params is not distinct from p_params
      and a.created_at > now() - interval '60 seconds'
  ) then
    insert into admin.audit_log (user_id, action, params) values (v_uid, p_action, p_params);
  end if;
  return v_uid;
end;
$$;

-- =====================================================================================
-- Auxiliares (sólo se usan dentro de public.admin_*, que corren como dueño)
-- =====================================================================================

create function admin.tz()
returns text
language sql
immutable
set search_path = ''
as $$ select 'America/Argentina/Buenos_Aires'::text $$;

/** Inicio (timestamptz) del día local p_day. */
create function admin.ts(p_day date)
returns timestamptz
language sql
immutable
set search_path = ''
as $$ select p_day::timestamp at time zone 'America/Argentina/Buenos_Aires' $$;

create function admin.local_day(p_at timestamptz)
returns date
language sql
immutable
set search_path = ''
as $$ select (p_at at time zone 'America/Argentina/Buenos_Aires')::date $$;

create function admin.today()
returns date
language sql
stable
set search_path = ''
as $$ select (now() at time zone 'America/Argentina/Buenos_Aires')::date $$;

/** Valida el período (fechas locales inclusive, máximo 2 años). */
create function admin.check_range(p_from date, p_to date)
returns void
language plpgsql
immutable
set search_path = ''
as $$
begin
  if p_from is null or p_to is null or p_from > p_to or p_to - p_from > 731 then
    raise exception 'admin_bad_range' using errcode = '22023';
  end if;
end;
$$;

/** Plataforma más reciente conocida de un usuario: sesiones de aprendizaje, si no tokens de push. */
create function admin.user_platform(p_user uuid)
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select c.platform from public.learning_session_clients c
      where c.user_id = p_user order by c.recorded_at desc limit 1),
    (select t.platform from public.push_tokens t
      where t.user_id = p_user order by t.updated_at desc limit 1),
    'unknown')
$$;

create function admin.is_internal(p_user uuid)
returns boolean
language sql
stable
set search_path = ''
as $$ select exists (select 1 from admin.internal_accounts i where i.user_id = p_user) $$;

/**
 * Usuarios que entran en las métricas: sin las cuentas internas (salvo p_include_internal) y con los
 * filtros del panel: country (profiles.region, '??' = sin país), platform, language (idioma objetivo
 * del perfil), course (curso activo) y plan ('free' | 'plus').
 */
create function admin.filtered_users(p_filters jsonb default '{}'::jsonb, p_include_internal boolean default false)
returns table (user_id uuid, created_at timestamptz)
language sql
stable
set search_path = ''
as $$
  select p.id, p.created_at
  from public.profiles p
  where (p_include_internal or not exists (select 1 from admin.internal_accounts i where i.user_id = p.id))
    and (nullif(p_filters ->> 'country', '') is null or coalesce(p.region, '??') = p_filters ->> 'country')
    and (nullif(p_filters ->> 'language', '') is null or p.target_language = p_filters ->> 'language')
    and (nullif(p_filters ->> 'course', '') is null or p.active_course_code = p_filters ->> 'course')
    and (nullif(p_filters ->> 'plan', '') is null
         or (p_filters ->> 'plan' = 'plus') = public.has_plus(p.id))
    and (nullif(p_filters ->> 'platform', '') is null or admin.user_platform(p.id) = p_filters ->> 'platform')
$$;

/**
 * Días con actividad: un usuario está «activo» un día si completó una lección o un repaso
 * (learning_sessions / user_daily_activity) o jugó una partida (battle_players). Abrir la app sin
 * hacer nada no cuenta (eso llega con PostHog en la Etapa B).
 */
create function admin.activity_days(p_from date, p_to date)
returns table (user_id uuid, day date, kind text)
language sql
stable
set search_path = ''
as $$
  select d.user_id, d.activity_date, 'learn'::text
  from public.user_daily_activity d
  where d.activity_date between p_from and p_to
  union all
  select s.user_id, admin.local_day(s.completed_at), s.kind
  from public.learning_sessions s
  where s.completed_at >= admin.ts(p_from) and s.completed_at < admin.ts(p_to + 1)
  union all
  select bp.user_id, admin.local_day(b.created_at), 'battle'::text
  from public.battles b
  join public.battle_players bp on bp.battle_id = b.id
  where bp.user_id is not null
    and b.created_at >= admin.ts(p_from) and b.created_at < admin.ts(p_to + 1)
$$;

/** Índice de liga para un rating (umbrales = TIERS de shared/ranking.ts; test admin.test.mjs). */
create function admin.tier_index(p_rating integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select coalesce(max(i), 0)::int
  from unnest(array[0, 400, 700, 1000, 1300, 1600, 1900, 2200]) with ordinality t (min_rating, i)
  where p_rating >= t.min_rating
$$;

create function admin.tier_id(p_rating integer)
returns text
language sql
immutable
set search_path = ''
as $$
  select (array['bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond', 'master', 'grandmaster'])
         [admin.tier_index(p_rating)]
$$;

/** Racha actual y mejor racha por usuario (días consecutivos de user_daily_activity + congelados). */
create function admin.streaks()
returns table (user_id uuid, current_streak integer, best_streak integer)
language sql
stable
set search_path = ''
as $$
  with days as (
    select d.user_id, d.activity_date as day from public.user_daily_activity d
    union
    select f.user_id, f.frozen_date from public.user_frozen_days f
  ),
  islands as (
    select x.user_id, min(x.day) as first_day, max(x.day) as last_day, count(*)::int as len
    from (select days.user_id, days.day,
                 days.day - (row_number() over (partition by days.user_id order by days.day))::int as grp
          from days) x
    group by x.user_id, x.grp
  )
  select i.user_id,
         coalesce(max(i.len) filter (where i.last_day >= admin.today() - 1), 0)::int,
         max(i.len)::int
  from islands i
  group by i.user_id
$$;

/** Cuántos días del período (para promedios diarios). */
create function admin.days_in(p_from date, p_to date)
returns integer
language sql
immutable
set search_path = ''
as $$ select (p_to - p_from + 1)::int $$;

create function admin.pct(p_num numeric, p_den numeric)
returns numeric
language sql
immutable
set search_path = ''
as $$ select case when coalesce(p_den, 0) = 0 then null else round(100.0 * p_num / p_den, 1) end $$;

/** KPIs de un período (los usa el Overview para el período y el anterior). */
create function admin.period_kpis(p_from date, p_to date, p_filters jsonb)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with u as (select * from admin.filtered_users(p_filters)),
  act as (
    select distinct a.user_id, a.day, a.kind
    from admin.activity_days(p_from, p_to) a
    where a.user_id in (select u.user_id from u)
  ),
  ls as (
    select s.* from public.learning_sessions s
    where s.user_id in (select u.user_id from u)
      and s.completed_at >= admin.ts(p_from) and s.completed_at < admin.ts(p_to + 1)
  ),
  bt as (
    select b.* from public.battles b
    where b.created_at >= admin.ts(p_from) and b.created_at < admin.ts(p_to + 1)
      and exists (select 1 from public.battle_players bp
                  where bp.battle_id = b.id and bp.user_id in (select u.user_id from u))
  )
  select jsonb_build_object(
    'signups', (select count(*) from u where u.created_at >= admin.ts(p_from) and u.created_at < admin.ts(p_to + 1)),
    'total_users_end', (select count(*) from u where u.created_at < admin.ts(p_to + 1)),
    'active_users', (select count(distinct act.user_id) from act),
    'learners', (select count(distinct act.user_id) from act where act.kind in ('learn', 'lesson', 'review')),
    'players', (select count(distinct act.user_id) from act where act.kind = 'battle'),
    'avg_daily_active', (select round(count(distinct (act.user_id, act.day))::numeric / admin.days_in(p_from, p_to), 2) from act),
    'sessions', (select count(*) from ls),
    'lessons_completed', (select count(*) from ls where ls.kind = 'lesson'),
    'reviews_completed', (select count(*) from ls where ls.kind = 'review'),
    'avg_session_seconds', (select round(avg(ls.duration_seconds)) from ls),
    'sessions_per_learner', (select case when count(distinct ls.user_id) = 0 then null
                                    else round(count(*)::numeric / count(distinct ls.user_id), 2) end from ls),
    'exercises_answered', (select count(*) from public.exercise_attempts a
                            where a.user_id in (select u.user_id from u)
                              and a.created_at >= admin.ts(p_from) and a.created_at < admin.ts(p_to + 1)),
    'battles', (select count(*) from bt),
    'battles_completed', (select count(*) from bt where bt.status = 'completed'),
    'battles_forfeited', (select count(*) from bt where bt.status = 'forfeited'),
    'battles_vs_bot', (select count(*) from bt where bt.has_bot),
    'paid_subs_started', (select count(*) from public.user_entitlements e
                           where e.user_id in (select u.user_id from u) and e.entitlement = 'plus'
                             and e.source in ('app_store', 'play_store')
                             and e.starts_at >= admin.ts(p_from) and e.starts_at < admin.ts(p_to + 1))
  )
$$;

-- =====================================================================================
-- RPCs del panel
-- =====================================================================================

/**
 * Lo primero que llama el panel después de iniciar sesión. No lanza error: dice si hay acceso
 * ('ok'), si falta MFA ('mfa_required', sólo al superadmin) o si no ('forbidden').
 */
create function public.admin_session_check()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return jsonb_build_object('allowed', false, 'reason', 'forbidden');
  end if;
  if not admin.caller_is_superadmin() then
    perform admin.log_security_event('denied_not_admin');
    return jsonb_build_object('allowed', false, 'reason', 'forbidden');
  end if;
  if admin.request_aal() <> 'aal2' then
    perform admin.log_security_event('denied_mfa');
    return jsonb_build_object('allowed', false, 'reason', 'mfa_required');
  end if;
  perform admin.log_security_event('access_granted');
  return jsonb_build_object(
    'allowed', true,
    'reason', 'ok',
    'username', (select p.username from public.profiles p where p.id = auth.uid()),
    'time_zone', admin.tz(),
    'today', admin.today()
  );
end;
$$;

/** Valores para los filtros (países, plataformas, idiomas, cursos) de los usuarios reales. */
create function public.admin_filter_options()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform admin.assert_superadmin('filter_options');
  return jsonb_build_object(
    'countries', (select coalesce(jsonb_agg(x.v order by x.v), '[]') from (
                   select distinct coalesce(p.region, '??') v from public.profiles p) x),
    'languages', (select coalesce(jsonb_agg(jsonb_build_object('code', l.code, 'name', l.name_es) order by l.code), '[]')
                  from public.languages l),
    'courses', (select coalesce(jsonb_agg(jsonb_build_object('code', c.code, 'target', c.target_language,
                                                             'source', c.source_language) order by c.position), '[]')
                from public.courses c),
    'platforms', jsonb_build_array('ios', 'android', 'unknown'),
    'levels', (select coalesce(jsonb_agg(x.level order by x.level), '[]') from (
                select distinct u.level from public.curriculum_units u) x)
  );
end;
$$;

/** Overview: foto de hoy + KPIs del período contra el período anterior + series diarias + alertas. */
create function public.admin_overview(p_from date, p_to date, p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_len int;
  v_today date := admin.today();
  v_snapshot jsonb;
  v_alerts jsonb;
begin
  perform admin.assert_superadmin('overview', jsonb_build_object('from', p_from, 'to', p_to, 'filters', p_filters));
  perform admin.check_range(p_from, p_to);
  v_len := p_to - p_from + 1;

  with u as (select * from admin.filtered_users(coalesce(p_filters, '{}'))),
  act as (
    select distinct a.user_id, a.day from admin.activity_days(v_today - 29, v_today) a
    where a.user_id in (select u.user_id from u)
  ),
  prev_act as (
    select distinct a.user_id from admin.activity_days(p_from - 365, p_from - 15) a
    where a.user_id in (select u.user_id from u)
  ),
  gap as (
    select distinct a.user_id from admin.activity_days(p_from - 14, p_from - 1) a
    where a.user_id in (select u.user_id from u)
  ),
  in_range as (
    select distinct a.user_id from admin.activity_days(p_from, p_to) a
    where a.user_id in (select u.user_id from u)
  )
  select jsonb_build_object(
    'total_users', (select count(*) from u),
    'new_today', (select count(*) from u where u.created_at >= admin.ts(v_today)),
    'new_7d', (select count(*) from u where u.created_at >= admin.ts(v_today - 6)),
    'new_30d', (select count(*) from u where u.created_at >= admin.ts(v_today - 29)),
    'dau', (select count(distinct act.user_id) from act where act.day = v_today),
    'wau', (select count(distinct act.user_id) from act where act.day >= v_today - 6),
    'mau', (select count(distinct act.user_id) from act),
    'seen_today', (select count(*) from public.user_presence pr
                    where pr.user_id in (select u.user_id from u) and pr.last_seen_at >= admin.ts(v_today)),
    'plus_users', (select count(*) from u where public.has_plus(u.user_id)),
    'paid_plus_users', (select count(distinct e.user_id) from public.user_entitlements e
                         where e.user_id in (select u.user_id from u) and e.entitlement = 'plus'
                           and e.source in ('app_store', 'play_store')
                           and e.starts_at <= now() and (e.expires_at is null or e.expires_at > now())),
    'free_users', (select count(*) from u where not public.has_plus(u.user_id)),
    'inactive_30d', (select count(*) from u where u.user_id not in (select act.user_id from act)),
    'reactivated', (select count(*) from in_range r
                     where r.user_id in (select prev_act.user_id from prev_act)
                       and r.user_id not in (select gap.user_id from gap))
  ) into v_snapshot;

  -- Alertas con datos reales (las de crashes, login y conversión llegan con la Etapa B).
  select coalesce(jsonb_agg(a), '[]') into v_alerts from (
    select jsonb_build_object('key', 'stuck_battles', 'level', 'critical',
             'title', 'Partidas trabadas', 'value', n,
             'detail', 'Partidas en curso hace más de 1 hora (status matched/ready/in_progress/reconnecting).') a
    from (select count(*) n from public.battles b
          where b.status in ('matched', 'ready', 'in_progress', 'reconnecting')
            and b.created_at < now() - interval '1 hour') x where n > 0
    union all
    select jsonb_build_object('key', 'stale_queue', 'level', 'warning',
             'title', 'Cola de Ranked con entradas viejas', 'value', n,
             'detail', 'Entradas activas de ranked_queue sin señal hace más de 10 minutos.')
    from (select count(*) n from public.ranked_queue q
          where q.active and coalesce(q.seen_at, q.joined_at) < now() - interval '10 minutes') x where n > 0
    union all
    select jsonb_build_object('key', 'activity_drop', 'level', 'warning',
             'title', 'Caída de actividad', 'value', round(100.0 * (cur - prev) / prev, 1),
             'detail', format('Usuarios activos últimos 7 días: %s contra %s de los 7 anteriores.', cur, prev))
    from (select
            (select count(distinct a.user_id) from admin.activity_days(v_today - 6, v_today) a
              where not admin.is_internal(a.user_id)) cur,
            (select count(distinct a.user_id) from admin.activity_days(v_today - 13, v_today - 7) a
              where not admin.is_internal(a.user_id)) prev) x
    where prev >= 5 and cur < prev * 0.7
    union all
    select jsonb_build_object('key', 'forfeit_rate', 'level', 'warning',
             'title', 'Muchas partidas abandonadas', 'value', round(100.0 * f / t, 1),
             'detail', format('%s de %s partidas de los últimos 7 días terminaron por abandono.', f, t))
    from (select count(*) filter (where b.status = 'forfeited') f,
                 count(*) filter (where b.status in ('completed', 'forfeited')) t
          from public.battles b where b.created_at >= now() - interval '7 days') x
    where t >= 10 and f::numeric / t > 0.2
    union all
    select jsonb_build_object('key', 'billing_issues', 'level', 'warning',
             'title', 'Suscripciones con problema de cobro', 'value', n,
             'detail', 'user_entitlements con billing_issue_at y todavía vigentes.')
    from (select count(*) n from public.user_entitlements e
          where e.billing_issue_at is not null and (e.expires_at is null or e.expires_at > now())
            and not admin.is_internal(e.user_id)) x where n > 0
    union all
    select jsonb_build_object('key', 'avatar_reports', 'level', 'info',
             'title', 'Reportes de avatar sin revisar', 'value', n,
             'detail', 'avatar_reports con reviewed_at vacío.')
    from (select count(*) n from public.avatar_reports r where r.reviewed_at is null) x where n > 0
    union all
    select jsonb_build_object('key', 'learning_jobs_failed', 'level', 'critical',
             'title', 'Trabajos de aprendizaje con fallas (24 h)', 'value', n,
             'detail', 'learning_job_runs con status distinto de ok o con failed > 0 en las últimas 24 horas.')
    from (select count(*) n from public.learning_job_runs j
          where j.started_at > now() - interval '24 hours'
            and (j.failed > 0 or j.error is not null)) x where n > 0
  ) s;

  return jsonb_build_object(
    'range', jsonb_build_object('from', p_from, 'to', p_to,
                                'prev_from', p_from - v_len, 'prev_to', p_from - 1, 'today', v_today),
    'snapshot', v_snapshot,
    'current', admin.period_kpis(p_from, p_to, coalesce(p_filters, '{}')),
    'previous', admin.period_kpis(p_from - v_len, p_from - 1, coalesce(p_filters, '{}')),
    'series', (
      with u as (select * from admin.filtered_users(coalesce(p_filters, '{}'))),
      days as (select g::date d from generate_series(p_from, p_to, interval '1 day') g),
      act as (select distinct a.user_id, a.day, a.kind from admin.activity_days(p_from, p_to) a
              where a.user_id in (select u.user_id from u)),
      su as (select admin.local_day(u.created_at) d, count(*) n from u
             where u.created_at >= admin.ts(p_from) and u.created_at < admin.ts(p_to + 1) group by 1),
      ls as (select admin.local_day(s.completed_at) d,
                    count(*) filter (where s.kind = 'lesson') lessons,
                    count(*) filter (where s.kind = 'review') reviews
             from public.learning_sessions s
             where s.user_id in (select u.user_id from u)
               and s.completed_at >= admin.ts(p_from) and s.completed_at < admin.ts(p_to + 1) group by 1),
      bt as (select admin.local_day(b.created_at) d, count(*) n from public.battles b
             where b.created_at >= admin.ts(p_from) and b.created_at < admin.ts(p_to + 1)
               and exists (select 1 from public.battle_players bp
                           where bp.battle_id = b.id and bp.user_id in (select u.user_id from u))
             group by 1)
      select coalesce(jsonb_agg(jsonb_build_object(
               'day', days.d,
               'signups', coalesce(su.n, 0),
               'active', (select count(distinct act.user_id) from act where act.day = days.d),
               'lessons', coalesce(ls.lessons, 0),
               'reviews', coalesce(ls.reviews, 0),
               'battles', coalesce(bt.n, 0)) order by days.d), '[]')
      from days
      left join su on su.d = days.d
      left join ls on ls.d = days.d
      left join bt on bt.d = days.d
    ),
    'alerts', v_alerts,
    'unavailable', jsonb_build_object(
      'realtime_users', 'Sin fuente fiable: requiere PostHog (Etapa B).',
      'session_duration_app', 'La duración de sesión de la app requiere PostHog (Etapa B); acá se muestra la duración de las sesiones de aprendizaje.',
      'lessons_started', 'Las lecciones iniciadas sólo se registran en PostHog (lesson_started).',
      'mrr', 'Requiere la API de RevenueCat (Etapa B).',
      'ads_revenue', 'AdMob no está en producción (sólo TestIds en desarrollo).',
      'crashes', 'No hay Sentry/Crashlytics integrado.')
  );
end;
$$;

/** Usuarios y crecimiento: registros por día, distribuciones, onboarding y tiempos hasta la 1.ª acción. */
create function public.admin_growth(p_from date, p_to date, p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := admin.today();
begin
  perform admin.assert_superadmin('growth', jsonb_build_object('from', p_from, 'to', p_to, 'filters', p_filters));
  perform admin.check_range(p_from, p_to);
  return (
    with u as (select * from admin.filtered_users(coalesce(p_filters, '{}'))),
    cohort as (
      select u.user_id, u.created_at, p.onboarding_completed_at,
             (select min(s.completed_at) from public.learning_sessions s
               where s.user_id = u.user_id and s.kind = 'lesson') first_lesson_at,
             (select min(b.created_at) from public.battle_players bp join public.battles b on b.id = bp.battle_id
               where bp.user_id = u.user_id) first_battle_at,
             (select min(b.created_at) from public.battle_players bp join public.battles b on b.id = bp.battle_id
               where bp.user_id = u.user_id and b.is_ranked) first_ranked_at
      from u join public.profiles p on p.id = u.user_id
      where u.created_at >= admin.ts(p_from) and u.created_at < admin.ts(p_to + 1)
    ),
    recent as (select distinct a.user_id from admin.activity_days(v_today - 13, v_today) a),
    in_range as (select distinct a.user_id from admin.activity_days(p_from, p_to) a
                 where a.user_id in (select u.user_id from u)),
    dims as (
      select u.user_id, coalesce(p.region, '??') country, admin.user_platform(u.user_id) platform,
             coalesce(p.interface_language, '??') interface_language,
             coalesce(p.target_language, '??') target_language,
             coalesce(p.active_course_code, '??') course,
             case when public.has_plus(u.user_id) then 'plus' else 'free' end plan,
             coalesce(c.source_language, '??') source_language
      from u join public.profiles p on p.id = u.user_id
      left join public.courses c on c.code = p.active_course_code
    )
    select jsonb_build_object(
      'total_users', (select count(*) from u),
      'signups', (select count(*) from cohort),
      'series', (
        select coalesce(jsonb_agg(jsonb_build_object('day', d.d, 'signups', d.n,
                 'cumulative', (select count(*) from u where u.created_at < admin.ts(d.d + 1))) order by d.d), '[]')
        from (select g::date d,
                     (select count(*) from u where admin.local_day(u.created_at) = g::date) n
              from generate_series(p_from, p_to, interval '1 day') g) d
      ),
      'distributions', jsonb_build_object(
        'country', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                    from (select country k, count(*) n from dims group by 1) x),
        'platform', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                     from (select platform k, count(*) n from dims group by 1) x),
        'interface_language', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                               from (select interface_language k, count(*) n from dims group by 1) x),
        'source_language', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                            from (select source_language k, count(*) n from dims group by 1) x),
        'target_language', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                            from (select target_language k, count(*) n from dims group by 1) x),
        'course', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                   from (select course k, count(*) n from dims group by 1) x),
        'plan', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                 from (select plan k, count(*) n from dims group by 1) x),
        'courses_enrolled', (select coalesce(jsonb_agg(jsonb_build_object('key', k, 'count', n) order by n desc, k), '[]')
                             from (select uc.course_code k, count(*) n from public.user_courses uc
                                   where uc.user_id in (select u.user_id from u) group by 1) x)
      ),
      'funnel', jsonb_build_object(
        'signups', (select count(*) from cohort),
        'onboarding_completed', (select count(*) from cohort where onboarding_completed_at is not null),
        'first_lesson', (select count(*) from cohort where first_lesson_at is not null),
        'first_battle', (select count(*) from cohort where first_battle_at is not null),
        'first_ranked', (select count(*) from cohort where first_ranked_at is not null),
        'median_minutes_to_onboarding', (select round((percentile_cont(0.5) within group (
              order by extract(epoch from onboarding_completed_at - created_at) / 60))::numeric, 1)
            from cohort where onboarding_completed_at is not null),
        'median_hours_to_first_lesson', (select round((percentile_cont(0.5) within group (
              order by extract(epoch from first_lesson_at - created_at) / 3600))::numeric, 1)
            from cohort where first_lesson_at is not null),
        'median_hours_to_first_battle', (select round((percentile_cont(0.5) within group (
              order by extract(epoch from first_battle_at - created_at) / 3600))::numeric, 1)
            from cohort where first_battle_at is not null)
      ),
      'never', jsonb_build_object(
        'never_lesson', (select count(*) from u where not exists (
                           select 1 from public.learning_sessions s where s.user_id = u.user_id and s.kind = 'lesson')),
        'never_ranked', (select count(*) from u where not exists (
                           select 1 from public.battle_players bp join public.battles b on b.id = bp.battle_id
                           where bp.user_id = u.user_id and b.is_ranked)),
        'abandoned_14d', (select count(*) from u
                           where u.created_at < admin.ts(v_today - 13)
                             and u.user_id not in (select recent.user_id from recent))
      ),
      'new_vs_returning', jsonb_build_object(
        'new_active', (select count(*) from in_range r join u on u.user_id = r.user_id
                        where u.created_at >= admin.ts(p_from)),
        'returning_active', (select count(*) from in_range r join u on u.user_id = r.user_id
                              where u.created_at < admin.ts(p_from))
      ),
      'unavailable', jsonb_build_object(
        'acquisition_source', 'No hay atribución de instalación (sólo códigos de referido: ver Marketing).',
        'country_geoip', 'El país es profiles.region, que elige el usuario; el país por IP llega con PostHog (Etapa B).')
    )
  );
end;
$$;

/** Tabla de usuarios: búsqueda por username, código público o UID; incluye las cuentas internas marcadas. */
create function public.admin_users_list(
  p_search text default null,
  p_filters jsonb default '{}'::jsonb,
  p_include_internal boolean default true,
  p_sort text default 'created_desc',
  p_limit integer default 50,
  p_offset integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 100);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
  v_q text := nullif(trim(coalesce(p_search, '')), '');
  v_like text;
begin
  perform admin.assert_superadmin('users_list', jsonb_build_object('search', p_search, 'filters', p_filters,
    'sort', p_sort, 'offset', v_offset));
  p_sort := coalesce(p_sort, 'created_desc');
  if p_sort not in ('created_desc', 'created_asc', 'username', 'last_seen') then
    raise exception 'admin_bad_sort' using errcode = '22023';
  end if;
  v_like := '%' || replace(replace(replace(coalesce(v_q, ''), '\', '\\'), '%', '\%'), '_', '\_') || '%';
  return (
    with base as (
      select p.*, pr.last_seen_at, admin.is_internal(p.id) internal
      from admin.filtered_users(coalesce(p_filters, '{}'), coalesce(p_include_internal, true)) f
      join public.profiles p on p.id = f.user_id
      left join public.user_presence pr on pr.user_id = p.id
      where v_q is null
         or p.username ilike v_like
         or p.display_name ilike v_like
         or p.public_code ilike v_like
         or p.id::text = lower(v_q)
    ),
    page as (
      select * from base
      order by
        case when p_sort = 'created_desc' then base.created_at end desc,
        case when p_sort = 'created_asc' then base.created_at end asc,
        case when p_sort = 'username' then base.username end asc,
        case when p_sort = 'last_seen' then base.last_seen_at end desc nulls last,
        base.id
      limit v_limit offset v_offset
    )
    select jsonb_build_object(
      'total', (select count(*) from base),
      'limit', v_limit,
      'offset', v_offset,
      'rows', (select coalesce(jsonb_agg(jsonb_build_object(
        'id', page.id,
        'username', page.username,
        'display_name', page.display_name,
        'created_at', page.created_at,
        'last_seen_at', page.last_seen_at,
        'country', page.region,
        'platform', admin.user_platform(page.id),
        'target_language', page.target_language,
        'course', page.active_course_code,
        'plan', case when public.has_plus(page.id) then 'plus' else 'free' end,
        'level', (select x.level from public.player_xp x where x.user_id = page.id),
        'lessons_completed', (select count(*) from public.learning_sessions s where s.user_id = page.id and s.kind = 'lesson'),
        'battles', (select count(*) from public.battle_players bp where bp.user_id = page.id),
        'best_rating', (select max(r.rating) from public.player_ratings r where r.user_id = page.id),
        'internal', page.internal,
        'onboarded', page.onboarding_completed_at is not null
      ) order by
        case when p_sort = 'created_desc' then page.created_at end desc,
        case when p_sort = 'created_asc' then page.created_at end asc,
        case when p_sort = 'username' then page.username end asc,
        case when p_sort = 'last_seen' then page.last_seen_at end desc nulls last,
        page.id), '[]') from page)
    )
  );
end;
$$;

/** Ficha administrativa de un usuario (sin email, contraseñas ni tokens). */
create function public.admin_user_detail(p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := admin.today();
begin
  perform admin.assert_superadmin('user_detail', jsonb_build_object('user', p_user));
  if not exists (select 1 from public.profiles p where p.id = p_user) then
    return null;
  end if;
  return (
    select jsonb_build_object(
      'profile', jsonb_build_object(
        'id', p.id, 'username', p.username, 'display_name', p.display_name, 'public_code', p.public_code,
        'created_at', p.created_at, 'onboarding_completed_at', p.onboarding_completed_at,
        'tutorial_completed_at', p.tutorial_completed_at, 'country', p.region,
        'interface_language', p.interface_language, 'target_language', p.target_language,
        'active_course', p.active_course_code, 'start_level', p.start_level,
        'daily_goal_minutes', p.daily_goal_minutes, 'avatar_id', p.avatar_id,
        'platform', admin.user_platform(p.id), 'internal', admin.is_internal(p.id),
        'superadmin', p.id = admin.superadmin_uid()),
      'auth', (select jsonb_build_object(
                 'created_at', au.created_at,
                 'last_sign_in_at', au.last_sign_in_at,
                 'providers', coalesce(au.raw_app_meta_data -> 'providers', '[]'::jsonb),
                 'email_confirmed', au.email_confirmed_at is not null)
               from auth.users au where au.id = p.id),
      'presence', (select pr.last_seen_at from public.user_presence pr where pr.user_id = p.id),
      'settings', (select jsonb_build_object('profile_visibility', s.profile_visibility,
                     'show_online', s.show_online, 'notify_challenges', s.notify_challenges)
                   from public.user_settings s where s.user_id = p.id),
      'plan', case when public.has_plus(p.id) then 'plus' else 'free' end,
      'entitlements', (select coalesce(jsonb_agg(jsonb_build_object(
                          'entitlement', e.entitlement, 'source', e.source, 'product_id', e.product_id,
                          'starts_at', e.starts_at, 'expires_at', e.expires_at, 'will_renew', e.will_renew,
                          'billing_issue_at', e.billing_issue_at, 'updated_at', e.updated_at)), '[]')
                       from public.user_entitlements e where e.user_id = p.id),
      'courses', (select coalesce(jsonb_agg(jsonb_build_object(
                     'course', c.course_code, 'start_level', c.start_level, 'placement_level', c.placement_level,
                     'enrolled_at', c.enrolled_at, 'last_selected_at', c.last_selected_at) order by c.enrolled_at), '[]')
                  from public.user_courses c where c.user_id = p.id),
      'xp', (select jsonb_build_object('total_xp', x.total_xp, 'level', x.level) from public.player_xp x where x.user_id = p.id),
      'polys', (select w.balance from public.poly_wallets w where w.user_id = p.id),
      'streak', (select jsonb_build_object('current', s.current_streak, 'best', s.best_streak)
                 from admin.streaks() s where s.user_id = p.id),
      'learning', jsonb_build_object(
        'lessons_completed', (select count(*) from public.learning_sessions s where s.user_id = p.id and s.kind = 'lesson'),
        'distinct_lessons', (select count(*) from public.user_lesson_progress l where l.user_id = p.id),
        'reviews_completed', (select count(*) from public.learning_sessions s where s.user_id = p.id and s.kind = 'review'),
        'answers', (select count(*) from public.exercise_attempts a where a.user_id = p.id),
        'accuracy', (select admin.pct(count(*) filter (where a.is_correct), count(*)) from public.exercise_attempts a where a.user_id = p.id)),
      'ratings', (select coalesce(jsonb_agg(jsonb_build_object(
                     'language', r.language_code, 'rating', r.rating, 'peak', r.peak_rating, 'tier', admin.tier_id(r.rating),
                     'games', r.games_played, 'wins', r.wins, 'losses', r.losses, 'draws', r.draws,
                     'win_streak', r.win_streak, 'best_win_streak', r.best_win_streak) order by r.rating desc), '[]')
                  from public.player_ratings r where r.user_id = p.id),
      'social', jsonb_build_object(
        'friends', (select count(*) from public.friendships f
                     where f.status = 'accepted' and (f.requester_id = p.id or f.addressee_id = p.id)),
        'challenges_hosted', (select count(*) from public.friend_challenges c where c.host_id = p.id),
        'referred_by', (select pr2.username from public.referral_attributions ra
                         join public.profiles pr2 on pr2.id = ra.referrer_id where ra.invitee_id = p.id),
        'referrals', (select count(*) from public.referral_attributions ra where ra.referrer_id = p.id),
        'referrals_qualified', (select count(*) from public.referral_attributions ra
                                 where ra.referrer_id = p.id and ra.status = 'qualified')),
      'achievements', (select count(*) from public.user_achievements ua where ua.user_id = p.id),
      'push_tokens', (select coalesce(jsonb_agg(jsonb_build_object('platform', t.platform, 'active', t.active,
                         'updated_at', t.updated_at)), '[]') from public.push_tokens t where t.user_id = p.id),
      'activity_90d', (select coalesce(jsonb_agg(jsonb_build_object('day', x.day, 'kinds', x.kinds) order by x.day), '[]')
                       from (select a.day, jsonb_agg(distinct a.kind) kinds
                             from admin.activity_days(v_today - 89, v_today) a
                             where a.user_id = p.id group by a.day) x),
      'recent_sessions', (select coalesce(jsonb_agg(x.j order by x.completed_at desc), '[]') from (
                            select s.completed_at, jsonb_build_object(
                              'kind', s.kind, 'lesson_id', s.lesson_id, 'lesson_title', l.title_es,
                              'completed_at', s.completed_at, 'duration_seconds', s.duration_seconds,
                              'answers', s.total_answers,
                              'first_try_accuracy', admin.pct(s.first_try_correct, s.first_try_total)) j
                            from public.learning_sessions s
                            left join public.lessons l on l.id = s.lesson_id
                            where s.user_id = p.id order by s.completed_at desc limit 20) x),
      'acquisition', jsonb_build_object(
        'source', case when exists (select 1 from public.referral_attributions ra where ra.invitee_id = p.id)
                       then 'referral' else null end,
        'note', 'Sólo se conoce la fuente cuando entró con un código de referido.')
    )
    from public.profiles p where p.id = p_user
  );
end;
$$;

/** Historial de partidas de un usuario (paginado). */
create function public.admin_user_battles(p_user uuid, p_limit integer default 25, p_offset integer default 0)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit int := least(greatest(coalesce(p_limit, 25), 1), 100);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
begin
  perform admin.assert_superadmin('user_battles', jsonb_build_object('user', p_user, 'offset', v_offset));
  return jsonb_build_object(
    'total', (select count(*) from public.battle_players bp where bp.user_id = p_user),
    'rows', (select coalesce(jsonb_agg(x.j order by x.created_at desc), '[]') from (
      select b.created_at, jsonb_build_object(
        'battle_id', b.id, 'created_at', b.created_at, 'started_at', b.started_at, 'ended_at', b.ended_at,
        'language', b.language_code, 'ranked', b.is_ranked, 'vs_bot', b.has_bot, 'status', b.status,
        'result', me.result, 'forfeited', me.forfeited, 'score', me.score,
        'correct', me.correct_answers, 'total', me.total_answers,
        'rating_before', me.rating_before, 'rating_after', me.rating_after,
        'opponent', coalesce(op.bot_name, (select pr.username from public.profiles pr where pr.id = op.user_id)),
        'opponent_is_bot', op.user_id is null,
        'opponent_score', op.score,
        'opponent_rating', op.rating_before) j
      from public.battle_players me
      join public.battles b on b.id = me.battle_id
      left join public.battle_players op on op.battle_id = me.battle_id and op.slot <> me.slot
      where me.user_id = p_user
      order by b.created_at desc
      limit v_limit offset v_offset) x)
  );
end;
$$;

/** Aprendizaje: volumen, precisión, tiempos, cursos, niveles, tipos de ejercicio y puntos difíciles. */
create function public.admin_learning(
  p_from date, p_to date, p_filters jsonb default '{}'::jsonb, p_min_attempts integer default 5
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lang text := nullif(p_filters ->> 'language', '');
  v_level text := nullif(p_filters ->> 'level', '');
  v_min int := greatest(coalesce(p_min_attempts, 5), 1);
begin
  perform admin.assert_superadmin('learning', jsonb_build_object('from', p_from, 'to', p_to, 'filters', p_filters));
  perform admin.check_range(p_from, p_to);
  return (
    -- En este módulo `language` y `level` filtran el CONTENIDO (idioma y nivel de la unidad).
    with u as (select * from admin.filtered_users(coalesce(p_filters, '{}') - 'language' - 'level')),
    ls as (
      select s.*, l.title_es lesson_title, cu.id unit_id, cu.language_code, cu.level, cu.title_es unit_title
      from public.learning_sessions s
      left join public.lessons l on l.id = s.lesson_id
      left join public.curriculum_units cu on cu.id = l.unit_id
      where s.user_id in (select u.user_id from u)
        and s.completed_at >= admin.ts(p_from) and s.completed_at < admin.ts(p_to + 1)
        and (v_lang is null or cu.language_code = v_lang)
        and (v_level is null or cu.level = v_level)
    ),
    att as (
      select a.*, e.type ex_type, e.lesson_id, cu.language_code, cu.level
      from public.exercise_attempts a
      left join public.exercises e on e.id = a.exercise_id
      left join public.lessons l on l.id = e.lesson_id
      left join public.curriculum_units cu on cu.id = l.unit_id
      where a.user_id in (select u.user_id from u)
        and a.created_at >= admin.ts(p_from) and a.created_at < admin.ts(p_to + 1)
        and (v_lang is null or cu.language_code = v_lang)
        and (v_level is null or cu.level = v_level)
    ),
    unit_done as (
      -- (usuario, unidad) con todas las lecciones publicadas terminadas; la última dentro del período.
      select lp.user_id, cu.id unit_id, cu.language_code, cu.level
      from public.user_lesson_progress lp
      join public.lessons l on l.id = lp.lesson_id and l.is_published
      join public.curriculum_units cu on cu.id = l.unit_id and cu.is_published
      where lp.user_id in (select u.user_id from u)
        and (v_lang is null or cu.language_code = v_lang)
        and (v_level is null or cu.level = v_level)
      group by lp.user_id, cu.id, cu.language_code, cu.level
      having count(*) = (select count(*) from public.lessons l2 where l2.unit_id = cu.id and l2.is_published)
         and max(lp.first_completed_at) >= admin.ts(p_from) and max(lp.first_completed_at) < admin.ts(p_to + 1)
    ),
    st as (select s.* from admin.streaks() s where s.user_id in (select u.user_id from u))
    select jsonb_build_object(
      'totals', jsonb_build_object(
        'lessons_completed', (select count(*) from ls where ls.kind = 'lesson'),
        'reviews_completed', (select count(*) from ls where ls.kind = 'review'),
        'learners', (select count(distinct ls.user_id) from ls),
        'units_completed', (select count(*) from unit_done),
        'answers', (select count(*) from att),
        'correct', (select count(*) from att where att.is_correct),
        'incorrect', (select count(*) from att where not att.is_correct),
        'accuracy', (select admin.pct(count(*) filter (where att.is_correct), count(*)) from att),
        'first_try_accuracy', (select admin.pct(sum(ls.first_try_correct), sum(ls.first_try_total)) from ls),
        'avg_response_ms', (select round(avg(att.response_ms)) from att where att.response_ms between 1 and 120000),
        'median_response_ms', (select round((percentile_cont(0.5) within group (order by att.response_ms))::numeric)
                               from att where att.response_ms between 1 and 120000),
        'avg_lesson_seconds', (select round(avg(ls.duration_seconds)) from ls where ls.kind = 'lesson'),
        'review_answers', (select coalesce(sum(ls.total_answers), 0) from ls where ls.kind = 'review')
      ),
      'series', (
        select coalesce(jsonb_agg(jsonb_build_object('day', d.g, 'lessons', coalesce(x.lessons, 0),
                 'reviews', coalesce(x.reviews, 0), 'learners', coalesce(x.learners, 0),
                 'accuracy', x.accuracy) order by d.g), '[]')
        from (select g::date g from generate_series(p_from, p_to, interval '1 day') g) d
        left join (select admin.local_day(ls.completed_at) as day,
                          count(*) filter (where ls.kind = 'lesson') lessons,
                          count(*) filter (where ls.kind = 'review') reviews,
                          count(distinct ls.user_id) learners,
                          admin.pct(sum(ls.first_try_correct), sum(ls.first_try_total)) accuracy
                   from ls group by 1) x on x.day = d.g
      ),
      'by_course', (select coalesce(jsonb_agg(jsonb_build_object('language', k, 'learners', learners,
                      'lessons', lessons, 'accuracy', accuracy, 'avg_seconds', secs) order by lessons desc), '[]')
                    from (select coalesce(ls.language_code, '??') k, count(distinct ls.user_id) learners, count(*) lessons,
                                 admin.pct(sum(ls.first_try_correct), sum(ls.first_try_total)) accuracy,
                                 round(avg(ls.duration_seconds)) secs
                          from ls where ls.kind = 'lesson' group by 1) x),
      'by_level', (select coalesce(jsonb_agg(jsonb_build_object('level', k, 'learners', learners,
                     'lessons', lessons, 'accuracy', accuracy) order by k), '[]')
                   from (select coalesce(ls.level, '??') k, count(distinct ls.user_id) learners, count(*) lessons,
                                admin.pct(sum(ls.first_try_correct), sum(ls.first_try_total)) accuracy
                         from ls where ls.kind = 'lesson' group by 1) x),
      'start_levels', (select coalesce(jsonb_agg(jsonb_build_object('level', k, 'users', n) order by k), '[]')
                       from (select coalesce(coalesce(uc.placement_level, uc.start_level), '??') k, count(*) n
                             from public.user_courses uc
                             where uc.user_id in (select u.user_id from u) group by 1) x),
      'by_skill', (select coalesce(jsonb_agg(jsonb_build_object('skill', k, 'answers', n, 'accuracy', acc,
                     'avg_ms', ms) order by n desc), '[]')
                   from (select coalesce(att.skill, '??') k, count(*) n,
                                admin.pct(count(*) filter (where att.is_correct), count(*)) acc,
                                round(avg(att.response_ms) filter (where att.response_ms between 1 and 120000)) ms
                         from att group by 1) x),
      'by_type', (select coalesce(jsonb_agg(jsonb_build_object('type', k, 'answers', n, 'accuracy', acc,
                    'avg_ms', ms) order by n desc), '[]')
                  from (select coalesce(att.ex_type, case when att.exercise_id is null then 'repaso_palabra' else '??' end) k,
                               count(*) n,
                               admin.pct(count(*) filter (where att.is_correct), count(*)) acc,
                               round(avg(att.response_ms) filter (where att.response_ms between 1 and 120000)) ms
                        from att group by 1) x),
      'hardest_exercises', (select coalesce(jsonb_agg(jsonb_build_object('exercise_id', x.exercise_id, 'type', x.ex_type,
                              'lesson_id', x.lesson_id, 'language', x.language_code, 'level', x.level,
                              'attempts', x.n, 'accuracy', x.acc, 'avg_ms', x.ms) order by x.acc, x.n desc), '[]')
                            from (select att.exercise_id, att.ex_type, att.lesson_id, att.language_code, att.level,
                                         count(*) n, admin.pct(count(*) filter (where att.is_correct), count(*)) acc,
                                         round(avg(att.response_ms) filter (where att.response_ms between 1 and 120000)) ms
                                  from att where att.exercise_id is not null
                                  group by 1, 2, 3, 4, 5 having count(*) >= v_min
                                  order by acc, n desc limit 20) x),
      'hardest_lessons', (select coalesce(jsonb_agg(jsonb_build_object('lesson_id', x.lesson_id, 'title', x.lesson_title,
                            'unit', x.unit_title, 'language', x.language_code, 'level', x.level,
                            'completions', x.n, 'accuracy', x.acc, 'avg_seconds', x.secs) order by x.acc, x.n desc), '[]')
                          from (select ls.lesson_id, ls.lesson_title, ls.unit_title, ls.language_code, ls.level, count(*) n,
                                       admin.pct(sum(ls.first_try_correct), sum(ls.first_try_total)) acc,
                                       round(avg(ls.duration_seconds)) secs
                                from ls where ls.kind = 'lesson'
                                group by 1, 2, 3, 4, 5 having count(*) >= least(v_min, 3)
                                order by acc, n desc limit 20) x),
      'top_lessons', (select coalesce(jsonb_agg(jsonb_build_object('lesson_id', x.lesson_id, 'title', x.lesson_title,
                        'language', x.language_code, 'level', x.level, 'completions', x.n, 'learners', x.learners)
                        order by x.n desc), '[]')
                      from (select ls.lesson_id, ls.lesson_title, ls.language_code, ls.level, count(*) n,
                                   count(distinct ls.user_id) learners
                            from ls where ls.kind = 'lesson' group by 1, 2, 3, 4 order by n desc limit 20) x),
      'streaks', jsonb_build_object(
        'users_with_streak', (select count(*) from st where st.current_streak > 0),
        'avg_current', (select round(avg(st.current_streak) filter (where st.current_streak > 0), 1) from st),
        'max_best', (select max(st.best_streak) from st),
        'buckets', (select coalesce(jsonb_agg(jsonb_build_object('bucket', b, 'users', n) order by o), '[]') from (
                      select case when st.current_streak = 0 then '0' when st.current_streak <= 2 then '1-2'
                                  when st.current_streak <= 6 then '3-6' when st.current_streak <= 13 then '7-13'
                                  when st.current_streak <= 29 then '14-29' else '30+' end b,
                             min(st.current_streak) o, count(*) n
                      from st group by 1) x)
      ),
      'unavailable', jsonb_build_object(
        'lessons_started', 'Las lecciones iniciadas y el abandono sólo están en PostHog (lesson_started); Etapa B.',
        'recurrent_errors', 'Los errores recurrentes por palabra se ven en hardest_exercises; el detalle por respuesta está en exercise_attempts.')
    )
  );
end;
$$;

/** Ranked: partidas, resultados, ELO, ligas, actividad por hora/día/idioma/país y equilibrio. */
create function public.admin_ranked(p_from date, p_to date, p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lang text := nullif(p_filters ->> 'language', '');
begin
  perform admin.assert_superadmin('ranked', jsonb_build_object('from', p_from, 'to', p_to, 'filters', p_filters));
  perform admin.check_range(p_from, p_to);
  return (
    -- En este módulo `language` filtra el idioma de la partida.
    with u as (select * from admin.filtered_users(coalesce(p_filters, '{}') - 'language')),
    bt as (
      select b.*,
             (select count(*) from public.battle_players bp
               where bp.battle_id = b.id and bp.user_id in (select u.user_id from u)) real_players
      from public.battles b
      where b.created_at >= admin.ts(p_from) and b.created_at < admin.ts(p_to + 1)
        and (v_lang is null or b.language_code = v_lang)
    ),
    rbt as (select * from bt where bt.real_players > 0),
    pl as (
      select bp.*, rbt.is_ranked, rbt.has_bot, rbt.status, rbt.language_code, rbt.created_at
      from public.battle_players bp join rbt on rbt.id = bp.battle_id
      where bp.user_id in (select u.user_id from u)
    ),
    pr as (
      select r.* from public.player_ratings r
      where r.user_id in (select u.user_id from u) and (v_lang is null or r.language_code = v_lang)
        and r.games_played > 0
    ),
    rh as (
      select h.* from public.rating_history h
      where h.user_id in (select u.user_id from u) and (v_lang is null or h.language_code = v_lang)
        and h.created_at >= admin.ts(p_from) and h.created_at < admin.ts(p_to + 1)
    ),
    last_battle as (
      select distinct on (pl.user_id) pl.user_id, pl.result, pl.created_at
      from pl order by pl.user_id, pl.created_at desc
    )
    select jsonb_build_object(
      'totals', jsonb_build_object(
        'battles', (select count(*) from rbt),
        'ranked', (select count(*) from rbt where rbt.is_ranked),
        'friendly', (select count(*) from rbt where not rbt.is_ranked),
        'vs_bot', (select count(*) from rbt where rbt.has_bot),
        'vs_human', (select count(*) from rbt where not rbt.has_bot),
        'completed', (select count(*) from rbt where rbt.status = 'completed'),
        'forfeited', (select count(*) from rbt where rbt.status = 'forfeited'),
        'cancelled', (select count(*) from rbt where rbt.status = 'cancelled'),
        'unfinished', (select count(*) from rbt where rbt.status in ('matched', 'ready', 'in_progress', 'reconnecting')),
        'players', (select count(distinct pl.user_id) from pl),
        'battles_per_player', (select case when count(distinct pl.user_id) = 0 then null
                                      else round(count(*)::numeric / count(distinct pl.user_id), 2) end from pl),
        'avg_duration_seconds', (select round(avg(extract(epoch from rbt.ended_at - rbt.started_at)))
                                 from rbt where rbt.status = 'completed' and rbt.ended_at is not null and rbt.started_at is not null),
        'avg_prep_seconds', (select round(avg(extract(epoch from rbt.started_at - rbt.created_at)))
                             from rbt where rbt.started_at is not null),
        'wins', (select count(*) from pl where pl.result = 'win'),
        'losses', (select count(*) from pl where pl.result = 'loss'),
        'draws', (select count(*) from pl where pl.result = 'draw'),
        'win_rate', (select admin.pct(count(*) filter (where pl.result = 'win'), count(*) filter (where pl.result is not null)) from pl),
        'win_rate_vs_bot', (select admin.pct(count(*) filter (where pl.result = 'win'), count(*) filter (where pl.result is not null)) from pl where pl.has_bot),
        'win_rate_vs_human', (select admin.pct(count(*) filter (where pl.result = 'win'), count(*) filter (where pl.result is not null)) from pl where not pl.has_bot),
        'forfeits_by_real_players', (select count(*) from pl where pl.forfeited),
        'accuracy', (select admin.pct(sum(pl.correct_answers), sum(pl.total_answers)) from pl),
        'avg_score', (select round(avg(pl.score)) from pl where pl.score is not null),
        'avg_rating_gap_human', (select round(avg(abs(a.rating_before - b.rating_before)))
                                 from public.battle_players a
                                 join public.battle_players b on b.battle_id = a.battle_id and b.slot > a.slot
                                 join rbt on rbt.id = a.battle_id
                                 where rbt.is_ranked and not rbt.has_bot
                                   and a.user_id is not null and b.user_id is not null),
        'quit_after_loss', (select count(*) from last_battle lb
                            where lb.result = 'loss' and lb.created_at < now() - interval '7 days'
                              and not exists (select 1 from public.battle_players bp2
                                              join public.battles b2 on b2.id = bp2.battle_id
                                              where bp2.user_id = lb.user_id and b2.created_at > lb.created_at)),
        'quit_after_loss_base', (select count(*) from last_battle lb where lb.created_at < now() - interval '7 days')
      ),
      'elo', jsonb_build_object(
        'players_rated', (select count(*) from pr),
        'avg', (select round(avg(pr.rating)) from pr),
        'median', (select round((percentile_cont(0.5) within group (order by pr.rating))::numeric) from pr),
        'max', (select max(pr.rating) from pr),
        'max_peak', (select max(pr.peak_rating) from pr),
        'histogram', (select coalesce(jsonb_agg(jsonb_build_object('from', b, 'players', n) order by b), '[]')
                      from (select (pr.rating / 100) * 100 b, count(*) n from pr group by 1) x),
        'by_tier', (select coalesce(jsonb_agg(jsonb_build_object('tier', admin.tier_id(t.min_rating), 'min_rating', t.min_rating,
                      'players', (select count(*) from pr where admin.tier_index(pr.rating) = t.i)) order by t.i), '[]')
                    from unnest(array[0, 400, 700, 1000, 1300, 1600, 1900, 2200]) with ordinality t (min_rating, i)),
        'promotions', (select count(*) from rh where admin.tier_index(rh.rating_after) > admin.tier_index(rh.rating_before)),
        'demotions', (select count(*) from rh where admin.tier_index(rh.rating_after) < admin.tier_index(rh.rating_before)),
        'best_win_streak', (select max(pr.best_win_streak) from pr),
        'on_win_streak_3plus', (select count(*) from pr where pr.win_streak >= 3)
      ),
      'series', (
        select coalesce(jsonb_agg(jsonb_build_object('day', d.g, 'battles', coalesce(x.n, 0),
                 'completed', coalesce(x.c, 0), 'forfeited', coalesce(x.f, 0), 'players', coalesce(y.p, 0)) order by d.g), '[]')
        from (select g::date g from generate_series(p_from, p_to, interval '1 day') g) d
        left join (select admin.local_day(rbt.created_at) as day, count(*) n,
                          count(*) filter (where rbt.status = 'completed') c,
                          count(*) filter (where rbt.status = 'forfeited') f
                   from rbt group by 1) x on x.day = d.g
        left join (select admin.local_day(pl.created_at) as day, count(distinct pl.user_id) p from pl group by 1) y on y.day = d.g
      ),
      'by_hour', (select coalesce(jsonb_agg(jsonb_build_object('hour', h, 'battles', n) order by h), '[]')
                  from (select extract(hour from rbt.created_at at time zone admin.tz())::int h, count(*) n
                        from rbt group by 1) x),
      'by_weekday', (select coalesce(jsonb_agg(jsonb_build_object('weekday', w, 'battles', n) order by w), '[]')
                     from (select extract(isodow from rbt.created_at at time zone admin.tz())::int w, count(*) n
                           from rbt group by 1) x),
      'by_language', (select coalesce(jsonb_agg(jsonb_build_object('language', k, 'battles', n, 'players', p,
                        'accuracy', acc, 'win_rate', wr) order by n desc), '[]')
                      from (select pl.language_code k, count(distinct pl.battle_id) n, count(distinct pl.user_id) p,
                                   admin.pct(sum(pl.correct_answers), sum(pl.total_answers)) acc,
                                   admin.pct(count(*) filter (where pl.result = 'win'), count(*) filter (where pl.result is not null)) wr
                            from pl group by 1) x),
      'by_country', (select coalesce(jsonb_agg(jsonb_build_object('country', k, 'battles', n, 'players', p) order by n desc), '[]')
                     from (select coalesce(prf.region, '??') k, count(distinct pl.battle_id) n, count(distinct pl.user_id) p
                           from pl join public.profiles prf on prf.id = pl.user_id group by 1) x),
      'by_type', (select coalesce(jsonb_agg(jsonb_build_object('type', k, 'battles', n, 'win_rate', wr, 'accuracy', acc) order by n desc), '[]')
                  from (select case when not pl.is_ranked then 'amistosa' when pl.has_bot then 'ranked_bot' else 'ranked_humano' end k,
                               count(distinct pl.battle_id) n,
                               admin.pct(count(*) filter (where pl.result = 'win'), count(*) filter (where pl.result is not null)) wr,
                               admin.pct(sum(pl.correct_answers), sum(pl.total_answers)) acc
                        from pl group by 1) x),
      'by_tier_performance', (select coalesce(jsonb_agg(jsonb_build_object('tier', k, 'battles', n, 'win_rate', wr, 'accuracy', acc) order by o), '[]')
                              from (select admin.tier_id(pl.rating_before) k, min(admin.tier_index(pl.rating_before)) o,
                                           count(*) n,
                                           admin.pct(count(*) filter (where pl.result = 'win'), count(*) filter (where pl.result is not null)) wr,
                                           admin.pct(sum(pl.correct_answers), sum(pl.total_answers)) acc
                                    from pl where pl.is_ranked and pl.rating_before is not null group by 1) x),
      'unavailable', jsonb_build_object(
        'matchmaking_time', 'La cola vive en la memoria del servidor de partidas: falta guardar queued_at (Etapa C).',
        'no_opponent', 'Las búsquedas sin rival no se registran (Etapa C).',
        'disconnects', 'Las desconexiones no se persisten; sólo el estado final (forfeited).',
        'question_reports', 'No existe un sistema de reporte de preguntas.',
        'answer_time', 'battle_players no guarda el tiempo por respuesta.')
    )
  );
end;
$$;

/** Ranking global (mejor rating por usuario) o de un idioma; marca las cuentas internas. */
create function public.admin_leaderboard(
  p_language text default null, p_include_internal boolean default true, p_limit integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 200);
begin
  perform admin.assert_superadmin('leaderboard', jsonb_build_object('language', p_language));
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'position', x.pos, 'user_id', x.user_id, 'username', x.username, 'language', x.language_code,
      'rating', x.rating, 'peak', x.peak_rating, 'tier', admin.tier_id(x.rating), 'games', x.games_played,
      'wins', x.wins, 'losses', x.losses, 'win_rate', admin.pct(x.wins, x.games_played),
      'internal', admin.is_internal(x.user_id)) order by x.pos), '[]')
    from (
      select row_number() over (order by r.rating desc, r.games_played desc, r.user_id) pos, r.*, p.username
      from (
        select distinct on (r0.user_id) r0.*
        from public.player_ratings r0
        where r0.games_played > 0 and (p_language is null or r0.language_code = p_language)
          and (coalesce(p_include_internal, true) or not admin.is_internal(r0.user_id))
        order by r0.user_id, r0.rating desc
      ) r
      join public.profiles p on p.id = r.user_id
      order by r.rating desc, r.games_played desc, r.user_id
      limit v_limit
    ) x
  );
end;
$$;

/**
 * Retención por cohortes semanales de registro. Dn = usuarios de la cohorte activos EXACTAMENTE el
 * día n después de registrarse (día 0 = día del registro, en hora de Buenos Aires) / usuarios de la
 * cohorte para los que ese día ya terminó. Si nadie de la cohorte llegó al día n: null.
 */
create function public.admin_retention(
  p_from date, p_to date, p_filters jsonb default '{}'::jsonb, p_segment text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := admin.today();
begin
  perform admin.assert_superadmin('retention', jsonb_build_object('from', p_from, 'to', p_to,
    'filters', p_filters, 'segment', p_segment));
  perform admin.check_range(p_from, p_to);
  if p_segment is not null and p_segment not in ('platform', 'country', 'course', 'plan', 'played_ranked', 'first_lesson', 'language') then
    raise exception 'admin_bad_segment' using errcode = '22023';
  end if;
  return (
    with u as (select * from admin.filtered_users(coalesce(p_filters, '{}'))),
    c as (
      select u.user_id, admin.local_day(u.created_at) signup_day,
             date_trunc('week', admin.local_day(u.created_at))::date cohort_week,
             case p_segment
               when 'platform' then admin.user_platform(u.user_id)
               when 'country' then coalesce(p.region, '??')
               when 'course' then coalesce(p.active_course_code, '??')
               when 'language' then coalesce(p.target_language, '??')
               when 'plan' then case when public.has_plus(u.user_id) then 'plus' else 'free' end
               when 'played_ranked' then case when exists (
                   select 1 from public.battle_players bp join public.battles b on b.id = bp.battle_id
                   where bp.user_id = u.user_id and b.is_ranked) then 'jugó Ranked' else 'no jugó Ranked' end
               when 'first_lesson' then case when exists (
                   select 1 from public.learning_sessions s where s.user_id = u.user_id and s.kind = 'lesson')
                   then 'completó 1.ª lección' else 'sin lecciones' end
               else 'todos' end segment
      from u join public.profiles p on p.id = u.user_id
      where u.created_at >= admin.ts(p_from) and u.created_at < admin.ts(p_to + 1)
    ),
    act as (
      select distinct a.user_id, a.day from admin.activity_days(p_from, v_today) a
      where a.user_id in (select c.user_id from c)
    ),
    marks as (
      select c.user_id, c.cohort_week, c.segment, n.n,
             (c.signup_day + n.n < v_today) eligible,
             exists (select 1 from act where act.user_id = c.user_id and act.day = c.signup_day + n.n) retained
      from c cross join (values (1), (3), (7), (14), (30), (60), (90)) n (n)
    ),
    by_cohort as (
      select m.cohort_week, m.n, count(*) filter (where m.eligible) eligible,
             count(*) filter (where m.eligible and m.retained) retained
      from marks m group by 1, 2
    ),
    by_segment as (
      select m.segment, m.n, count(*) filter (where m.eligible) eligible,
             count(*) filter (where m.eligible and m.retained) retained
      from marks m group by 1, 2
    ),
    period_act as (
      select a.user_id, a.day, a.kind from admin.activity_days(p_from, p_to) a
      where a.user_id in (select u.user_id from u)
    ),
    per_user as (
      select pa.user_id, count(distinct pa.day) active_days,
             bool_or(pa.kind in ('learn', 'lesson', 'review')) learned,
             bool_or(pa.kind = 'battle') played
      from period_act pa group by 1
    ),
    gaps as (
      select x.day - lag(x.day) over (partition by x.user_id order by x.day) gap
      from (select distinct pa.user_id, pa.day from period_act pa) x
    ),
    pre_act as (
      select a.user_id, bool_or(a.kind in ('learn', 'lesson', 'review')) learned, bool_or(a.kind = 'battle') played
      from admin.activity_days(p_from - 30, p_from - 1) a
      where a.user_id in (select u.user_id from u) group by 1
    )
    select jsonb_build_object(
      'definition', 'Dn = activos exactamente el día n tras el registro / usuarios de la cohorte con el día n ya cerrado. Activo = lección, repaso o partida.',
      'cohorts', (select coalesce(jsonb_agg(jsonb_build_object(
                    'cohort_week', w.cohort_week,
                    'size', (select count(*) from c where c.cohort_week = w.cohort_week),
                    'retention', (select jsonb_object_agg('d' || b.n, jsonb_build_object(
                                    'eligible', b.eligible, 'retained', b.retained,
                                    'pct', admin.pct(b.retained, b.eligible)))
                                  from by_cohort b where b.cohort_week = w.cohort_week)) order by w.cohort_week), '[]')
                  from (select distinct c.cohort_week from c) w),
      'overall', (select jsonb_object_agg('d' || b.n, jsonb_build_object('eligible', b.eligible, 'retained', b.retained,
                    'pct', admin.pct(b.retained, b.eligible)))
                  from (select m.n, count(*) filter (where m.eligible) eligible,
                               count(*) filter (where m.eligible and m.retained) retained
                        from marks m group by 1) b),
      'segments', case when p_segment is null then null else (
                    select coalesce(jsonb_agg(jsonb_build_object('segment', s.segment,
                      'size', (select count(*) from c where c.segment = s.segment),
                      'retention', (select jsonb_object_agg('d' || b.n, jsonb_build_object('eligible', b.eligible,
                                      'retained', b.retained, 'pct', admin.pct(b.retained, b.eligible)))
                                    from by_segment b where b.segment = s.segment)) order by s.segment), '[]')
                    from (select distinct c.segment from c) s) end,
      'engagement', jsonb_build_object(
        'active_users', (select count(*) from per_user),
        'avg_active_days', (select round(avg(per_user.active_days), 2) from per_user),
        'sessions_per_user', (select case when count(distinct s.user_id) = 0 then null
                                     else round(count(*)::numeric / count(distinct s.user_id), 2) end
                              from public.learning_sessions s
                              where s.user_id in (select u.user_id from u)
                                and s.completed_at >= admin.ts(p_from) and s.completed_at < admin.ts(p_to + 1)),
        'avg_days_between_activity', (select round(avg(gaps.gap), 2) from gaps where gaps.gap is not null),
        'learn_only', (select count(*) from per_user where learned and not played),
        'play_only', (select count(*) from per_user where played and not learned),
        'learn_and_play', (select count(*) from per_user where learned and played),
        'stopped_learning', (select count(*) from pre_act b where b.learned
                              and not exists (select 1 from per_user pu where pu.user_id = b.user_id and pu.learned)),
        'stopped_playing', (select count(*) from pre_act b where b.played
                             and not exists (select 1 from per_user pu where pu.user_id = b.user_id and pu.played)),
        'frequency', (select coalesce(jsonb_agg(jsonb_build_object('bucket', k, 'users', n, 'plus_pct', plus_pct) order by o), '[]')
                      from (select case when pu.active_days = 1 then '1 día' when pu.active_days <= 3 then '2-3 días'
                                        when pu.active_days <= 7 then '4-7 días' else '8+ días' end k,
                                   min(pu.active_days) o, count(*) n,
                                   admin.pct(count(*) filter (where public.has_plus(pu.user_id)), count(*)) plus_pct
                            from per_user pu group by 1) x)
      ),
      'unavailable', jsonb_build_object(
        'acquisition_source', 'Sin atribución de instalación: no se puede segmentar por fuente (salvo referidos).')
    )
  );
end;
$$;

/** Social: amistades, desafíos, referidos y retención de quienes tienen amigos. */
create function public.admin_social(p_from date, p_to date, p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := admin.today();
begin
  perform admin.assert_superadmin('social', jsonb_build_object('from', p_from, 'to', p_to, 'filters', p_filters));
  perform admin.check_range(p_from, p_to);
  return (
    with u as (select * from admin.filtered_users(coalesce(p_filters, '{}'))),
    fr as (select f.* from public.friendships f where f.requester_id in (select u.user_id from u)),
    ch as (
      select c.*, b.status battle_status from public.friend_challenges c
      left join public.battles b on b.id = c.battle_id
      where c.host_id in (select u.user_id from u)
        and c.created_at >= admin.ts(p_from) and c.created_at < admin.ts(p_to + 1)
    ),
    ra as (
      select r.* from public.referral_attributions r
      where r.invitee_id in (select u.user_id from u)
        and r.created_at >= admin.ts(p_from) and r.created_at < admin.ts(p_to + 1)
    ),
    social_users as (
      select f.requester_id user_id from public.friendships f
       where f.created_at >= admin.ts(p_from) and f.created_at < admin.ts(p_to + 1)
      union select f.addressee_id from public.friendships f
       where f.responded_at >= admin.ts(p_from) and f.responded_at < admin.ts(p_to + 1)
      union select c.host_id from public.friend_challenges c
       where c.created_at >= admin.ts(p_from) and c.created_at < admin.ts(p_to + 1)
      union select c.guest_id from public.friend_challenges c
       where c.guest_id is not null and c.created_at >= admin.ts(p_from) and c.created_at < admin.ts(p_to + 1)
    ),
    -- Retención «activo algún día entre el 1 y el 7 tras registrarse», con o sin amigos.
    r7 as (
      select u.user_id,
             exists (select 1 from public.friendships f where f.status = 'accepted'
                     and (f.requester_id = u.user_id or f.addressee_id = u.user_id)) has_friend,
             exists (select 1 from public.friend_challenges c where c.host_id = u.user_id or c.guest_id = u.user_id) has_challenge,
             exists (select 1 from admin.activity_days(admin.local_day(u.created_at) + 1, admin.local_day(u.created_at) + 7) a
                     where a.user_id = u.user_id) retained
      from u where admin.local_day(u.created_at) + 7 < v_today
    )
    select jsonb_build_object(
      'friendships', jsonb_build_object(
        'accepted_total', (select count(*) from fr where fr.status = 'accepted'),
        'pending_total', (select count(*) from fr where fr.status = 'pending'),
        'requests_sent', (select count(*) from fr where fr.created_at >= admin.ts(p_from) and fr.created_at < admin.ts(p_to + 1)),
        'accepted', (select count(*) from fr where fr.status = 'accepted'
                      and fr.responded_at >= admin.ts(p_from) and fr.responded_at < admin.ts(p_to + 1)),
        'declined', (select count(*) from fr where fr.status = 'declined'
                      and fr.responded_at >= admin.ts(p_from) and fr.responded_at < admin.ts(p_to + 1)),
        'acceptance_rate', (select admin.pct(count(*) filter (where fr.status = 'accepted'),
                                             count(*) filter (where fr.status in ('accepted', 'declined')))
                            from fr where fr.responded_at >= admin.ts(p_from) and fr.responded_at < admin.ts(p_to + 1))
      ),
      'challenges', jsonb_build_object(
        'created', (select count(*) from ch),
        'accepted', (select count(*) from ch where ch.guest_id is not null),
        'played', (select count(*) from ch where ch.battle_id is not null),
        'completed', (select count(*) from ch where ch.battle_status = 'completed'),
        'abandoned', (select count(*) from ch where ch.battle_status = 'forfeited'),
        'declined', (select count(*) from ch where ch.declined),
        'cancelled', (select count(*) from ch where ch.cancelled),
        'expired', (select count(*) from ch where ch.guest_id is null and not ch.cancelled and not ch.declined
                     and ch.expires_at < now())
      ),
      'referrals', jsonb_build_object(
        'attributed', (select count(*) from ra),
        'qualified', (select count(*) from ra where ra.status = 'qualified'),
        'rejected', (select count(*) from ra where ra.status = 'rejected'),
        'pending', (select count(*) from ra where ra.status = 'pending')
      ),
      'socially_active_users', (select count(*) from social_users s where s.user_id in (select u.user_id from u)),
      'retention_d1_7', jsonb_build_object(
        'with_friends', (select admin.pct(count(*) filter (where r7.retained), count(*)) from r7 where r7.has_friend),
        'without_friends', (select admin.pct(count(*) filter (where r7.retained), count(*)) from r7 where not r7.has_friend),
        'with_challenges', (select admin.pct(count(*) filter (where r7.retained), count(*)) from r7 where r7.has_challenge),
        'without_challenges', (select admin.pct(count(*) filter (where r7.retained), count(*)) from r7 where not r7.has_challenge),
        'base_users', (select count(*) from r7)
      ),
      'series', (
        select coalesce(jsonb_agg(jsonb_build_object('day', d.g,
                 'requests', (select count(*) from fr where admin.local_day(fr.created_at) = d.g),
                 'challenges', (select count(*) from ch where admin.local_day(ch.created_at) = d.g)) order by d.g), '[]')
        from (select g::date g from generate_series(p_from, p_to, interval '1 day') g) d
      ),
      'unavailable', jsonb_build_object(
        'feed', 'PolyGo no tiene feed social.',
        'invitations', 'Las invitaciones compartidas por link no se registran; sólo las atribuciones de referido.')
    )
  );
end;
$$;

/** Monetización con lo que hay en la base (estado actual de user_entitlements). */
create function public.admin_monetization(p_from date, p_to date, p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform admin.assert_superadmin('monetization', jsonb_build_object('from', p_from, 'to', p_to, 'filters', p_filters));
  perform admin.check_range(p_from, p_to);
  return (
    with u as (select * from admin.filtered_users(coalesce(p_filters, '{}'))),
    e as (
      select en.*, (en.starts_at <= now() and (en.expires_at is null or en.expires_at > now())) active
      from public.user_entitlements en where en.user_id in (select u.user_id from u)
    )
    select jsonb_build_object(
      'plus', jsonb_build_object(
        'active_any_source', (select count(distinct e.user_id) from e where e.entitlement = 'plus' and e.active),
        'active_paid', (select count(distinct e.user_id) from e where e.entitlement = 'plus' and e.active
                         and e.source in ('app_store', 'play_store')),
        'by_source', (select coalesce(jsonb_agg(jsonb_build_object('source', k, 'active', n) order by n desc), '[]')
                      from (select e.source k, count(*) n from e where e.entitlement = 'plus' and e.active group by 1) x),
        'by_product', (select coalesce(jsonb_agg(jsonb_build_object('product', k, 'active', n) order by n desc), '[]')
                       from (select coalesce(e.product_id, '—') k, count(*) n from e
                             where e.entitlement = 'plus' and e.active and e.source in ('app_store', 'play_store') group by 1) x),
        'by_store', (select coalesce(jsonb_agg(jsonb_build_object('store', k, 'active', n) order by n desc), '[]')
                     from (select e.source k, count(*) n from e
                           where e.entitlement = 'plus' and e.active and e.source in ('app_store', 'play_store') group by 1) x),
        'monthly_vs_annual', (select jsonb_build_object(
                                'monthly', count(*) filter (where e.product_id ilike '%month%'),
                                'annual', count(*) filter (where e.product_id ilike '%year%' or e.product_id ilike '%annual%'),
                                'other', count(*) filter (where e.product_id is null or not (e.product_id ilike '%month%'
                                          or e.product_id ilike '%year%' or e.product_id ilike '%annual%')))
                              from e where e.entitlement = 'plus' and e.active and e.source in ('app_store', 'play_store')),
        'started_in_period', (select count(*) from e where e.entitlement = 'plus' and e.source in ('app_store', 'play_store')
                               and e.starts_at >= admin.ts(p_from) and e.starts_at < admin.ts(p_to + 1)),
        'expired_in_period', (select count(*) from e where e.entitlement = 'plus' and not e.active
                               and e.expires_at >= admin.ts(p_from) and e.expires_at < admin.ts(p_to + 1)),
        'will_not_renew', (select count(*) from e where e.entitlement = 'plus' and e.active
                            and e.source in ('app_store', 'play_store') and e.will_renew = false),
        'billing_issues', (select count(*) from e where e.entitlement = 'plus' and e.active and e.billing_issue_at is not null),
        'conversion_paid_pct', (select admin.pct(
                                   (select count(distinct e.user_id) from e where e.entitlement = 'plus' and e.active
                                     and e.source in ('app_store', 'play_store')),
                                   (select count(*) from u))),
        'ad_free_active', (select count(*) from e where e.entitlement = 'ad_free' and e.active)
      ),
      'notes', jsonb_build_object(
        'history', 'user_entitlements guarda sólo el estado actual: renovaciones, cancelaciones y reembolsos pasados requieren el historial (Etapa C) o RevenueCat (Etapa B).',
        'started_in_period', 'Cuenta por starts_at actual: si la tienda renueva y RevenueCat mueve el inicio, una renovación puede verse como alta.',
        'manual', 'Las fuentes manual/promotional/referral no son ingresos.'),
      'unavailable', jsonb_build_object(
        'mrr', 'Requiere RevenueCat (Etapa B).',
        'arr', 'Requiere RevenueCat (Etapa B).',
        'revenue', 'Requiere RevenueCat (Etapa B). No se estiman ingresos con precios supuestos.',
        'refunds', 'Requiere RevenueCat (Etapa B).',
        'arpu', 'Requiere ingresos reales (Etapa B).',
        'ltv', 'Requiere ingresos reales e historial (Etapa B/C).',
        'paywall_funnel', 'plus_viewed / purchase_started / purchase_completed / purchase_failed están en PostHog (Etapa B).',
        'ads', 'AdMob no está en producción (sólo TestIds en desarrollo): no hay ingresos publicitarios.',
        'infra_costs', 'Costos de Supabase/Railway: Etapa B (API de gestión).')
    )
  );
end;
$$;

/** Marketing: lo único atribuible hoy son los códigos de referido. */
create function public.admin_marketing(p_from date, p_to date)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := admin.today();
begin
  perform admin.assert_superadmin('marketing', jsonb_build_object('from', p_from, 'to', p_to));
  perform admin.check_range(p_from, p_to);
  return (
    with ra as (
      select r.* from public.referral_attributions r
      where r.created_at >= admin.ts(p_from) and r.created_at < admin.ts(p_to + 1)
        and not admin.is_internal(r.invitee_id)
    ),
    inv as (
      select ra.referrer_id, ra.code, ra.status,
             p.onboarding_completed_at is not null onboarded,
             exists (select 1 from public.learning_sessions s where s.user_id = ra.invitee_id and s.kind = 'lesson') first_lesson,
             exists (select 1 from public.battle_players bp where bp.user_id = ra.invitee_id) first_battle,
             exists (select 1 from public.user_entitlements e where e.user_id = ra.invitee_id and e.entitlement = 'plus'
                     and e.source in ('app_store', 'play_store')) paid_plus,
             admin.local_day(p.created_at) + 7 < v_today eligible,
             exists (select 1 from admin.activity_days(admin.local_day(p.created_at) + 1, admin.local_day(p.created_at) + 7) a
                     where a.user_id = ra.invitee_id) retained
      from ra join public.profiles p on p.id = ra.invitee_id
    )
    select jsonb_build_object(
      'totals', jsonb_build_object(
        'signups_with_code', (select count(*) from ra),
        'qualified', (select count(*) from ra where ra.status = 'qualified'),
        'rejected', (select count(*) from ra where ra.status = 'rejected'),
        'signups_total', (select count(*) from admin.filtered_users('{}') u
                          where u.created_at >= admin.ts(p_from) and u.created_at < admin.ts(p_to + 1))),
      'referrers', (select coalesce(jsonb_agg(x.j order by x.n desc), '[]') from (
        select count(*) n, jsonb_build_object(
          'referrer_id', inv.referrer_id,
          'username', (select p.username from public.profiles p where p.id = inv.referrer_id),
          'internal', admin.is_internal(inv.referrer_id),
          'codes', jsonb_agg(distinct inv.code),
          'signups', count(*),
          'qualified', count(*) filter (where inv.status = 'qualified'),
          'onboarded', count(*) filter (where inv.onboarded),
          'first_lesson', count(*) filter (where inv.first_lesson),
          'first_battle', count(*) filter (where inv.first_battle),
          'paid_plus', count(*) filter (where inv.paid_plus),
          'retained_d1_7', admin.pct(count(*) filter (where inv.eligible and inv.retained),
                                     count(*) filter (where inv.eligible))
        ) j
        from inv group by inv.referrer_id order by count(*) desc limit 50) x),
      'unavailable', jsonb_build_object(
        'installs', 'Sin integración de instalaciones (App Store Connect / Play Console / MMP).',
        'campaigns', 'No hay parámetros de campaña ni UTM registrados en la base.',
        'influencers', 'No hay tabla de influencers; hoy cada influencer debería tener su código de referido.',
        'clicks', 'Los clics en links de invitación no se registran (referral_clicked, Etapa C).',
        'spend', 'Sin datos de inversión: no se calcula costo por registro ni ROI.')
    )
  );
end;
$$;

/** Notificaciones: lo que hay en la base (tokens y avisos de desafío). */
create function public.admin_notifications(p_from date, p_to date, p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform admin.assert_superadmin('notifications', jsonb_build_object('from', p_from, 'to', p_to, 'filters', p_filters));
  perform admin.check_range(p_from, p_to);
  return (
    with u as (select * from admin.filtered_users(coalesce(p_filters, '{}'))),
    t as (select pt.* from public.push_tokens pt where pt.user_id in (select u.user_id from u))
    select jsonb_build_object(
      'tokens', jsonb_build_object(
        'active', (select count(*) from t where t.active),
        'inactive', (select count(*) from t where not t.active),
        'users_reachable', (select count(distinct t.user_id) from t where t.active),
        'users_total', (select count(*) from u),
        'by_platform', (select coalesce(jsonb_agg(jsonb_build_object('platform', k, 'active', a, 'inactive', i) order by k), '[]')
                        from (select t.platform k, count(*) filter (where t.active) a, count(*) filter (where not t.active) i
                              from t group by 1) x)),
      'preferences', jsonb_build_object(
        'challenge_notifications_off', (select count(*) from public.user_settings s
                                         where s.user_id in (select u.user_id from u) and s.notify_challenges = false)),
      'challenge_pushes_sent', (select count(*) from public.friend_challenges c
                                where c.host_id in (select u.user_id from u) and c.notified_at is not null
                                  and c.notified_at >= admin.ts(p_from) and c.notified_at < admin.ts(p_to + 1)),
      'unavailable', jsonb_build_object(
        'sent', 'Los pushes del servidor no se registran (notification_sent, Etapa C); los recordatorios son locales del teléfono.',
        'delivered_opened', 'push_delivered / push_opened están en PostHog (Etapa B).',
        'invalid_tokens', 'Los errores de Expo Push no se guardan; sólo se marca active = false.',
        'return_after_push', 'Requiere PostHog (Etapa B).')
    )
  );
end;
$$;

/** Salud técnica: lo observable desde la base. */
create function public.admin_health()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slow jsonb := '[]'::jsonb;
  v_conn jsonb;
begin
  perform admin.assert_superadmin('health');
  if to_regclass('extensions.pg_stat_statements') is not null then
    begin
      execute $q$
        select coalesce(jsonb_agg(x order by x.mean_ms desc), '[]') from (
          select left(regexp_replace(s.query, '\s+', ' ', 'g'), 220) query, s.calls,
                 round(s.mean_exec_time::numeric, 1) mean_ms, round(s.total_exec_time::numeric) total_ms,
                 s.rows
          from extensions.pg_stat_statements s
          join pg_roles r on r.oid = s.userid
          where r.rolname in ('authenticated', 'anon', 'service_role', 'authenticator') and s.calls >= 5
          order by s.mean_exec_time desc limit 15) x
      $q$ into v_slow;
    exception when others then
      v_slow := null;
    end;
  else
    v_slow := null;
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('state', k, 'count', n) order by n desc), '[]') into v_conn
  from (select coalesce(a.state, 'background') k, count(*) n from pg_catalog.pg_stat_activity a group by 1) x;

  return jsonb_build_object(
    'battles', jsonb_build_object(
      'stuck', (select coalesce(jsonb_agg(jsonb_build_object('battle_id', b.id, 'status', b.status, 'created_at', b.created_at,
                  'language', b.language_code, 'vs_bot', b.has_bot) order by b.created_at), '[]')
                from (select * from public.battles b where b.status in ('matched', 'ready', 'in_progress', 'reconnecting')
                      and b.created_at < now() - interval '1 hour' order by b.created_at limit 50) b),
      'forfeit_rate_7d', (select admin.pct(count(*) filter (where b.status = 'forfeited'),
                                           count(*) filter (where b.status in ('completed', 'forfeited')))
                          from public.battles b where b.created_at >= now() - interval '7 days'),
      'cancelled_7d', (select count(*) from public.battles b where b.status = 'cancelled' and b.created_at >= now() - interval '7 days')
    ),
    'queue', jsonb_build_object(
      'active', (select count(*) from public.ranked_queue q where q.active),
      'stale', (select count(*) from public.ranked_queue q where q.active
                 and coalesce(q.seen_at, q.joined_at) < now() - interval '10 minutes')),
    'app_versions_30d', (select coalesce(jsonb_agg(jsonb_build_object('platform', k, 'app_version', v, 'contract', c,
                           'sessions', n, 'users', us) order by n desc), '[]')
                         from (select c.platform k, coalesce(c.app_version, '?') v, c.contract c, count(*) n,
                                      count(distinct c.user_id) us
                               from public.learning_session_clients c
                               where c.recorded_at >= now() - interval '30 days' group by 1, 2, 3) x),
    'client_policy', (select coalesce(jsonb_agg(jsonb_build_object('platform', p.platform, 'min_version', p.min_version,
                        'min_curriculum_api', p.min_curriculum_api, 'updated_at', p.updated_at)), '[]')
                      from public.app_client_policy p),
    'learning_jobs', jsonb_build_object(
      'recompute_pending', (select count(*) from public.knowledge_recompute_queue k where k.processed_at is null),
      'recompute_with_errors', (select count(*) from public.knowledge_recompute_queue k where k.last_error is not null),
      'recent_runs', (select coalesce(jsonb_agg(jsonb_build_object('job', j.job, 'started_at', j.started_at,
                        'status', j.status, 'processed', j.processed, 'failed', j.failed, 'error', left(j.error, 200))
                        order by j.started_at desc), '[]')
                      from (select * from public.learning_job_runs j order by j.started_at desc limit 20) j)),
    'database', jsonb_build_object(
      'size_bytes', pg_catalog.pg_database_size(current_database()),
      'connections', v_conn,
      'largest_tables', (select coalesce(jsonb_agg(jsonb_build_object('table', x.t, 'bytes', x.b, 'rows_estimate', x.r)
                           order by x.b desc), '[]')
                         from (select c.relname t, pg_catalog.pg_total_relation_size(c.oid) b, c.reltuples::bigint r
                               from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace
                               where n.nspname = 'public' and c.relkind in ('r', 'p')
                               order by pg_catalog.pg_total_relation_size(c.oid) desc limit 12) x),
      'slow_queries', v_slow),
    'unavailable', jsonb_build_object(
      'crashes', 'No hay Sentry/Crashlytics.',
      'auth_errors', 'Los errores de login/registro están en los logs de Supabase Auth (Etapa B).',
      'edge_function_errors', 'Logs de Edge Functions vía API de gestión (Etapa B).',
      'api_latency', 'P50/P95/P99 de la API requieren los logs de Supabase (Etapa B).',
      'battle_server', 'CPU, memoria y errores del servidor de partidas están en Railway (Etapa B).',
      'egress_storage_costs', 'Uso y costos del proyecto vía API de gestión de Supabase (Etapa B).')
  );
end;
$$;

/** Contenido: catálogo por idioma, estado de revisión y finalización por unidad. */
create function public.admin_content(p_language text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform admin.assert_superadmin('content', jsonb_build_object('language', p_language));
  return (
    with real_users as (select f.user_id from admin.filtered_users('{}') f),
    units as (
      select cu.*,
             (select count(*) from public.lessons l where l.unit_id = cu.id) lessons_total,
             (select count(*) from public.lessons l where l.unit_id = cu.id and l.is_published) lessons_published
      from public.curriculum_units cu
      where p_language is null or cu.language_code = p_language
    ),
    progress as (
      select cu.id unit_id, lp.user_id, count(*) done
      from public.user_lesson_progress lp
      join public.lessons l on l.id = lp.lesson_id and l.is_published
      join units cu on cu.id = l.unit_id
      where lp.user_id in (select real_users.user_id from real_users)
      group by 1, 2
    )
    select jsonb_build_object(
      'languages', (select coalesce(jsonb_agg(jsonb_build_object(
          'code', lg.code, 'name', lg.name_es, 'content_status', lg.content_status,
          'available', lg.is_target_available, 'ranked_available', lg.ranked_available,
          'units', (select count(*) from public.curriculum_units cu where cu.language_code = lg.code),
          'units_published', (select count(*) from public.curriculum_units cu where cu.language_code = lg.code and cu.is_published),
          'levels', (select coalesce(jsonb_agg(distinct cu.level), '[]') from public.curriculum_units cu where cu.language_code = lg.code),
          'lessons', (select count(*) from public.lessons l join public.curriculum_units cu on cu.id = l.unit_id where cu.language_code = lg.code),
          'lessons_published', (select count(*) from public.lessons l join public.curriculum_units cu on cu.id = l.unit_id
                                 where cu.language_code = lg.code and l.is_published),
          'exercises', (select count(*) from public.exercises e join public.lessons l on l.id = e.lesson_id
                         join public.curriculum_units cu on cu.id = l.unit_id where cu.language_code = lg.code),
          'exercises_published', (select count(*) from public.exercises e join public.lessons l on l.id = e.lesson_id
                                   join public.curriculum_units cu on cu.id = l.unit_id
                                   where cu.language_code = lg.code and e.is_published),
          'items_by_status', (select coalesce(jsonb_object_agg(x.k, x.n), '{}') from (
                                select coalesce(ei.status, '?') k, count(*) n from public.exercise_items ei
                                where ei.language_code = lg.code group by 1) x),
          'review_status', (select coalesce(jsonb_object_agg(x.k, x.n), '{}') from (
                              select coalesce(cu.review_status, 'sin_estado') k, count(*) n from public.curriculum_units cu
                              where cu.language_code = lg.code group by 1) x),
          'learners', (select count(distinct lp.user_id) from public.user_lesson_progress lp
                       join public.lessons l on l.id = lp.lesson_id join public.curriculum_units cu on cu.id = l.unit_id
                       where cu.language_code = lg.code and lp.user_id in (select real_users.user_id from real_users))
        ) order by lg.code), '[]') from public.languages lg),
      'courses', (select coalesce(jsonb_agg(jsonb_build_object('code', c.code, 'target', c.target_language,
                    'source', c.source_language, 'default', c.is_default,
                    'enrolled', (select count(*) from public.user_courses uc where uc.course_code = c.code
                                  and uc.user_id in (select real_users.user_id from real_users))) order by c.position), '[]')
                  from public.courses c),
      'units', (select coalesce(jsonb_agg(jsonb_build_object(
                  'unit_id', un.id, 'language', un.language_code, 'level', un.level, 'position', un.position,
                  'title', un.title_es, 'published', un.is_published, 'review_status', un.review_status,
                  'lessons', un.lessons_total, 'lessons_published', un.lessons_published,
                  'users_started', (select count(*) from progress pg where pg.unit_id = un.id),
                  'users_completed', (select count(*) from progress pg where pg.unit_id = un.id and pg.done >= un.lessons_published
                                       and un.lessons_published > 0),
                  'completion_pct', admin.pct(
                     (select count(*) from progress pg where pg.unit_id = un.id and pg.done >= un.lessons_published and un.lessons_published > 0),
                     (select count(*) from progress pg where pg.unit_id = un.id))
                ) order by un.language_code, un.level, un.position), '[]') from units un),
      'reports', jsonb_build_object(
        'avatar_pending', (select count(*) from public.avatar_reports r where r.reviewed_at is null),
        'avatar_total', (select count(*) from public.avatar_reports r)),
      'unavailable', jsonb_build_object(
        'content_error_reports', 'No existe un sistema de reporte de errores de contenido.')
    )
  );
end;
$$;

/** Auditoría: acciones del panel y eventos de seguridad (accesos y denegaciones). */
create function public.admin_audit(p_limit integer default 50, p_offset integer default 0)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 200);
  v_offset int := greatest(coalesce(p_offset, 0), 0);
begin
  perform admin.assert_superadmin('audit', jsonb_build_object('offset', v_offset));
  return jsonb_build_object(
    'actions_total', (select count(*) from admin.audit_log),
    'actions', (select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'action', a.action, 'params', a.params,
                  'created_at', a.created_at, 'username', (select p.username from public.profiles p where p.id = a.user_id))
                  order by a.created_at desc), '[]')
                from (select * from admin.audit_log a order by a.created_at desc limit v_limit offset v_offset) a),
    'security_events', (select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'event', s.event, 'aal', s.aal,
                          'created_at', s.created_at, 'user_id', s.user_id,
                          'username', (select p.username from public.profiles p where p.id = s.user_id))
                          order by s.created_at desc), '[]')
                        from (select * from admin.security_events s order by s.created_at desc limit v_limit offset v_offset) s),
    'denied_24h', (select count(*) from admin.security_events s
                    where s.event like 'denied%' and s.created_at > now() - interval '24 hours'),
    'superadmins', (select coalesce(jsonb_agg(jsonb_build_object('user_id', s.user_id, 'label', s.label,
                      'created_at', s.created_at)), '[]') from admin.superadmins s),
    'internal_accounts', (select coalesce(jsonb_agg(jsonb_build_object('user_id', i.user_id, 'label', i.label)), '[]')
                          from admin.internal_accounts i)
  );
end;
$$;

-- =====================================================================================
-- Permisos: las funciones admin.* no las ejecuta nadie más que su dueño; las public.admin_*
-- sólo authenticated (y deciden adentro).
-- =====================================================================================
do $$
declare
  f regprocedure;
begin
  for f in
    select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'admin'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('revoke all on function %s from service_role', f);
    end if;
  end loop;
  for f in
    select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'admin\_%'
  loop
    execute format('revoke all on function %s from public, anon', f);
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('revoke all on function %s from service_role', f);
    end if;
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;

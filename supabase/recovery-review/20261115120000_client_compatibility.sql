-- =====================================================================
-- Fase C.5 (docs/LEARNING_PHASE_C.md §C5): compatibilidad entre versiones de la app y rutas curriculares.
--
-- Problema: las builds publicadas antes de la C.4 leen curriculum_units y lessons directamente y dibujan
-- el camino por `position`. Si U13 y U14 se publican, esas builds las mostrarían al final (13 y 14),
-- aunque el servidor (is_lesson_unlocked) no las desbloquee en la ruta v1.
--
-- Mecanismo (sólo agrega; no publica nada ni habilita la v2):
--
--   1. Nivel de compatibilidad curricular del cliente (`curriculum API`): un entero que la app declara.
--        0  cliente antiguo: no declara nada (todas las builds publicadas hasta hoy).
--        1  cliente que dibuja el camino con my_curriculum_route (rutas versionadas).
--      La app compatible lo envía en CADA request a PostgREST con la cabecera
--      `x-polygo-curriculum-api` (supabase-js `global.headers`) y en el alta como metadato del usuario
--      (`polygo_curriculum_api`). Sin cabecera = 0: el valor por defecto es el seguro.
--
--   2. Requisito de cliente por ruta (curriculum_route_client_requirements): v1 → 0, v2 → 1.
--      Una ruta sin requisito registrado no es representable por nadie (salvo la de respaldo, 0).
--
--   3. Ruta visible por request = la asignada al usuario si el cliente la puede representar; si no, la
--      de respaldo (v1). La ASIGNACIÓN (user_curriculum_routes) no cambia nunca: esto sólo decide qué ve
--      cada cliente.
--
--   4. Dos políticas RLS RESTRICTIVAS (se suman con AND a las existentes, que no se tocan) sobre
--      curriculum_units y lessons: sólo se leen las unidades de la ruta visible (o, en idiomas y niveles
--      sin rutas, todas como antes). Un usuario de la v1 nunca lee U13/U14, con cualquier build.
--
--   5. Alta: la ruta de inscripción vigente sólo si el cliente que creó la cuenta declaró un nivel
--      suficiente; si no (cliente antiguo o sin dato), la de respaldo. Inmutable como en la C.4.
--
--   6. Versión mínima configurable en el servidor (app_client_policy) y app_client_status(), que la app
--      compatible consulta al arrancar. Las builds antiguas no la consultan: no pueden mostrar un aviso
--      que no conocen. Su protección es la de los puntos 4 y 5, que viven en el servidor.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/clientCompatibility.test.mjs). NO aplicada en
-- producción. Requiere 20261114120000_curriculum_routes.sql. Idempotente.
-- =====================================================================

-- ---------- Requisito de cliente por ruta ----------

create table if not exists public.curriculum_route_client_requirements (
  route_id text primary key references public.curriculum_routes (id),
  min_curriculum_api smallint not null check (min_curriculum_api between 0 and 999),
  created_at timestamptz not null default now()
);

-- Inmutable: cambiar el requisito de una ruta en uso podría esconder o mostrar unidades a un cliente.
create or replace function public.curriculum_route_client_requirements_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op <> 'INSERT' then
    raise exception 'curriculum_route_client_requirements: el requisito de una ruta no cambia';
  end if;
  if new.min_curriculum_api > 0
     and exists (select 1 from public.curriculum_routes r where r.id = new.route_id and r.fallback) then
    raise exception 'curriculum_route_client_requirements: la ruta de respaldo tiene que verse con cualquier cliente';
  end if;
  return new;
end;
$$;

create or replace trigger curriculum_route_client_requirements_guard
  before insert or update or delete on public.curriculum_route_client_requirements
  for each row execute function public.curriculum_route_client_requirements_guard();

insert into public.curriculum_route_client_requirements (route_id, min_curriculum_api)
values ('en.a1.route.v1', 0), ('en.a1.route.v2', 1)
on conflict (route_id) do nothing;

do $$
begin
  if (select array_agg(route_id || '=' || min_curriculum_api order by route_id)
      from public.curriculum_route_client_requirements
      where route_id in ('en.a1.route.v1', 'en.a1.route.v2'))
     is distinct from array['en.a1.route.v1=0', 'en.a1.route.v2=1'] then
    raise exception 'curriculum_route_client_requirements: requisitos de inglés A1 inesperados';
  end if;
end;
$$;

-- ---------- Nivel del cliente ----------

/** Entero 0..999 de un texto, o null si no es un número válido. */
create or replace function public.parse_curriculum_api(p text)
returns smallint
language sql
immutable
set search_path = ''
as $$
  select case when btrim(p) ~ '^[0-9]{1,3}$' then btrim(p)::smallint end;
$$;

/**
 * Nivel de compatibilidad curricular del request actual: la cabecera x-polygo-curriculum-api que
 * PostgREST expone en request.headers. Sin cabecera (clientes antiguos, Edge Functions, SQL) = 0.
 */
create or replace function public.request_curriculum_api()
returns smallint
language plpgsql
stable
set search_path = ''
as $$
declare
  v_raw text := current_setting('request.headers', true);
begin
  if v_raw is null or v_raw = '' then
    return 0;
  end if;
  return coalesce(public.parse_curriculum_api(v_raw::jsonb ->> 'x-polygo-curriculum-api'), 0);
exception when others then
  return 0;
end;
$$;

/** Nivel mínimo para representar una ruta (respaldo sin requisito: 0; otra sin requisito: nadie). */
create or replace function public.curriculum_route_min_api(p_route_id text)
returns smallint
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select q.min_curriculum_api from public.curriculum_route_client_requirements q where q.route_id = p_route_id),
    (select 0::smallint from public.curriculum_routes r where r.id = p_route_id and r.fallback),
    999::smallint);
$$;

/**
 * Ruta que ve un cliente de nivel p_api para un usuario, idioma y nivel: la asignada (o la de respaldo
 * si no tiene) cuando el cliente la puede representar; si no, la de respaldo. null = sin rutas.
 */
create or replace function public.curriculum_route_for(p_user uuid, p_language text, p_level text, p_api smallint)
returns text
language sql
stable
set search_path = ''
as $$
  with fb as (
    select r.id from public.curriculum_routes r
    where r.language_code = p_language and r.level = p_level and r.fallback
  ),
  assigned as (
    select coalesce(
      (select a.route_id from public.user_curriculum_routes a
       where a.user_id = p_user and a.language_code = p_language and a.level = p_level),
      (select id from fb)) as id
  )
  select case
           when a.id is null then null
           when coalesce(p_api, 0) >= public.curriculum_route_min_api(a.id) then a.id
           else (select id from fb)
         end
  from assigned a;
$$;

/**
 * Unidades (publicadas o no) que el request actual puede leer: las de su ruta visible y, en idiomas y
 * niveles sin rutas, todas. Base de las políticas restrictivas de abajo.
 */
create or replace function public.curriculum_visible_unit_ids()
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  select u.id
  from public.curriculum_units u
  cross join (select public.request_curriculum_api() as v) api
  cross join lateral (
    select public.curriculum_route_for(auth.uid(), u.language_code, u.level, api.v) as route_id
  ) f
  where f.route_id is null
     or exists (select 1 from public.curriculum_route_units ru where ru.route_id = f.route_id and ru.unit_id = u.id);
$$;

-- ---------- Lectura de contenido: sólo la ruta que el cliente puede representar ----------

drop policy if exists "units in the client's curriculum route" on public.curriculum_units;
create policy "units in the client's curriculum route" on public.curriculum_units
  as restrictive for select to authenticated
  using (id in (select public.curriculum_visible_unit_ids()));

drop policy if exists "lessons in the client's curriculum route" on public.lessons;
create policy "lessons in the client's curriculum route" on public.lessons
  as restrictive for select to authenticated
  using (unit_id in (select public.curriculum_visible_unit_ids()));

-- ---------- Camino de la app compatible ----------

/** Igual que en la C.4, pero con la ruta que el cliente del request puede representar. */
create or replace function public.my_curriculum_route(p_language_code text)
returns table (level text, unit_id text, unit_order integer, route_id text)
language sql
stable
security definer
set search_path = ''
as $$
  select u.level,
         u.id,
         case when f.route_id is null then u.position::integer else ru.position::integer end,
         f.route_id
  from public.curriculum_units u
  cross join (select public.request_curriculum_api() as v) api
  cross join lateral (
    select public.curriculum_route_for(auth.uid(), u.language_code, u.level, api.v) as route_id
  ) f
  left join public.curriculum_route_units ru on ru.route_id = f.route_id and ru.unit_id = u.id
  where auth.uid() is not null
    and u.language_code = p_language_code
    and u.is_published
    and (f.route_id is null or ru.unit_id is not null)
  order by 1, 3;
$$;

-- ---------- Alta: la ruta que el cliente que crea la cuenta puede representar ----------

/**
 * Altas nuevas: la ruta de inscripción vigente si el cliente del alta declaró un nivel suficiente
 * (metadato `polygo_curriculum_api` de auth.users, que la app compatible envía en signUp); si no, la de
 * respaldo. Se decide una vez y no cambia (user_curriculum_routes_guard).
 */
create or replace function public.assign_curriculum_routes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_api smallint;
begin
  select coalesce(public.parse_curriculum_api(u.raw_user_meta_data ->> 'polygo_curriculum_api'), 0)
    into v_api
  from auth.users u where u.id = new.id;
  insert into public.user_curriculum_routes (user_id, language_code, level, route_id, source)
  select new.id, e.language_code, e.level,
         case when coalesce(v_api, 0) >= public.curriculum_route_min_api(e.route_id) then e.route_id else fb.id end,
         'signup'
  from public.curriculum_route_enrollment e
  join public.curriculum_routes fb
    on fb.language_code = e.language_code and fb.level = e.level and fb.fallback
  on conflict (user_id, language_code, level) do nothing;
  return new;
end;
$$;

-- ---------- Versión mínima ----------

/**
 * Política de versión de la app, configurable desde el servidor (service_role / SQL). Una fila 'any' y,
 * si hace falta, una por plataforma que la reemplaza. min_version null = sin mínimo por versión.
 * min_curriculum_api = nivel curricular mínimo (las builds compatibles siempre lo declaran).
 */
create table if not exists public.app_client_policy (
  platform text primary key check (platform in ('any', 'ios', 'android', 'web')),
  min_version text check (min_version is null or min_version ~ '^[0-9]{1,4}(\.[0-9]{1,4}){0,2}$'),
  min_curriculum_api smallint not null default 0 check (min_curriculum_api between 0 and 999),
  message_es text not null check (char_length(message_es) between 1 and 300),
  update_url text check (update_url is null or update_url ~ '^https://'),
  updated_at timestamptz not null default now()
);

create or replace function public.app_client_policy_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace trigger app_client_policy_touch
  before insert or update on public.app_client_policy
  for each row execute function public.app_client_policy_touch();

-- Sin mínimo: nadie queda bloqueado hasta que se configure a propósito.
insert into public.app_client_policy (platform, min_version, min_curriculum_api, message_es)
values ('any', null, 0, 'Hay una versión nueva de PolyGo. Actualizala desde la tienda para seguir aprendiendo.')
on conflict (platform) do nothing;

/** [mayor, menor, parche] de una versión «1», «1.2» o «1.2.3» (con sufijo opcional); null si no es una. */
create or replace function public.app_version_parts(p text)
returns integer[]
language sql
immutable
set search_path = ''
as $$
  select case when m is null then null
              else array[m[1]::integer, coalesce(m[2], '0')::integer, coalesce(m[3], '0')::integer] end
  from (select regexp_match(btrim(coalesce(p, '')), '^([0-9]{1,4})(?:\.([0-9]{1,4}))?(?:\.([0-9]{1,4}))?(?:[-+].*)?$') m) x;
$$;

/**
 * Estado de compatibilidad del cliente que pregunta. status:
 *   ok               la versión y el nivel alcanzan el mínimo (o no hay mínimo).
 *   update_required  nivel curricular o versión por debajo del mínimo: la app muestra el mensaje.
 *   unknown          hay mínimo por versión pero el cliente no informó una versión legible; no se
 *                    bloquea (no se puede probar que sea vieja) y el nivel curricular sí se exige.
 * El nivel curricular sale del parámetro o, si falta, de la cabecera del request. No escribe nada.
 */
create or replace function public.app_client_status(
  p_app_version text default null,
  p_platform text default null,
  p_curriculum_api integer default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_policy public.app_client_policy;
  v_api smallint := coalesce(
    case when p_curriculum_api between 0 and 999 then p_curriculum_api::smallint end,
    public.request_curriculum_api());
  v_installed integer[] := public.app_version_parts(p_app_version);
  v_min integer[];
  v_status text;
begin
  select * into v_policy from public.app_client_policy
  where platform = p_platform and p_platform in ('ios', 'android', 'web');
  if not found then
    select * into v_policy from public.app_client_policy where platform = 'any';
  end if;
  v_min := public.app_version_parts(v_policy.min_version);

  v_status := case
    when v_api < coalesce(v_policy.min_curriculum_api, 0) then 'update_required'
    when v_min is null then 'ok'
    when v_installed is null then 'unknown'
    when v_installed < v_min then 'update_required'
    else 'ok'
  end;

  return jsonb_build_object(
    'status', v_status,
    'installed_version', case when v_installed is null then null else btrim(p_app_version) end,
    'min_version', v_policy.min_version,
    'curriculum_api', v_api,
    'min_curriculum_api', coalesce(v_policy.min_curriculum_api, 0),
    'message', case when v_status = 'update_required' then v_policy.message_es end,
    'update_url', v_policy.update_url);
end;
$$;

-- ---------- Seguridad ----------

alter table public.curriculum_route_client_requirements enable row level security;
alter table public.app_client_policy enable row level security;
revoke all on public.curriculum_route_client_requirements, public.app_client_policy from anon, authenticated;

revoke all on function public.curriculum_route_client_requirements_guard() from public, anon, authenticated;
revoke all on function public.app_client_policy_touch() from public, anon, authenticated;
revoke all on function public.curriculum_route_min_api(text) from public, anon, authenticated;
revoke all on function public.curriculum_route_for(uuid, text, text, smallint) from public, anon, authenticated;
revoke all on function public.assign_curriculum_routes() from public, anon, authenticated;
revoke all on function public.my_curriculum_route(text) from public, anon;
grant execute on function public.my_curriculum_route(text) to authenticated;
-- Las políticas se evalúan con el rol del que consulta: necesita ejecutarla (sólo devuelve ids).
revoke all on function public.curriculum_visible_unit_ids() from public, anon;
grant execute on function public.curriculum_visible_unit_ids() to authenticated;
-- La comprobación de versión se hace también antes de iniciar sesión.
revoke all on function public.app_client_status(text, text, integer) from public;
grant execute on function public.app_client_status(text, text, integer) to anon, authenticated;

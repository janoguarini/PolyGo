-- =====================================================================
-- Fase C.4 (docs/LEARNING_PHASE_C.md §C4): versiones del recorrido curricular y desbloqueos por ruta.
--
-- La identidad de una unidad (curriculum_units.id) ya no define su orden: el orden lo da la RUTA del
-- usuario (curriculum_route_units.position). Sólo agrega: tablas, funciones y filas nuevas; reemplaza
-- is_lesson_unlocked por una versión que lee la ruta y que, en la ruta antigua, se comporta igual.
--
--   en.a1.route.v1  U1 → U12 (el recorrido de siempre). Ruta de respaldo (`fallback`) del inglés A1.
--   en.a1.route.v2  U1 → U2 → U3 → U13 → U4 → … → U7 → U14 → U8 → … → U12 (mapa curricular §3).
--                   Preparada y APAGADA: enabled = false; U13 y U14 siguen sin publicar.
--
-- Asignación (user_curriculum_routes): una fila inmutable por usuario, idioma y nivel.
--   - Cuentas que ya existen: la ruta v1 ('backfill', en esta migración).
--   - Altas nuevas: la ruta de inscripción vigente de cada idioma y nivel en el momento del alta
--     ('signup', trigger sobre profiles). Hoy es la v1; pasa a la v2 sólo con curriculum_enable_route.
--   - Sin fila (no debería pasar): la ruta de respaldo (v1). Nunca se infiere del progreso.
--   - Idiomas y niveles sin rutas (it, pt, zh, inglés A2): el orden de siempre, por posición.
--
-- Activación (fase posterior, no acá): curriculum_enable_route('en.a1.route.v2'), sólo service_role.
-- Exige que todas las unidades de la ruta estén publicadas con lecciones publicadas y que la ruta
-- contenga todas las de la ruta de respaldo. Un trigger aplica las mismas reglas a cualquier cambio
-- directo de las tablas. En ejecución, una unidad de la ruta que deje de estar publicada se salta
-- (la cadena une la anterior con la siguiente): nadie queda atrapado.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/curriculumRoutes.test.mjs). NO aplicada en
-- producción. No publica nada, no toca progreso, SRS, Mastery, Adaptive ni Ranked.
-- =====================================================================

-- ---------- Tablas ----------

create table if not exists public.curriculum_routes (
  id text primary key check (id ~ '^[a-z]{2,3}\.[a-c][12]\.route\.v[0-9]+$'),
  language_code text not null references public.languages (code),
  level text not null references public.ref_levels (id),
  version smallint not null check (version > 0),
  -- La ruta de quienes no tienen asignación: una por idioma y nivel, la que nunca exige unidades nuevas.
  fallback boolean not null default false,
  -- Habilitación explícita: sólo una ruta habilitada puede asignarse a altas nuevas.
  enabled boolean not null default false,
  description_es text not null check (char_length(description_es) > 0),
  created_at timestamptz not null default now(),
  enabled_at timestamptz,
  unique (language_code, level, version)
);

create unique index if not exists curriculum_routes_one_fallback
  on public.curriculum_routes (language_code, level) where fallback;

create table if not exists public.curriculum_route_units (
  route_id text not null references public.curriculum_routes (id),
  unit_id text not null references public.curriculum_units (id),
  position smallint not null check (position > 0),
  primary key (route_id, unit_id),
  unique (route_id, position)
);

-- Qué ruta reciben las altas nuevas de cada idioma y nivel.
create table if not exists public.curriculum_route_enrollment (
  language_code text not null references public.languages (code),
  level text not null references public.ref_levels (id),
  route_id text not null references public.curriculum_routes (id),
  updated_at timestamptz not null default now(),
  primary key (language_code, level)
);

create table if not exists public.user_curriculum_routes (
  user_id uuid not null references auth.users (id) on delete cascade,
  language_code text not null references public.languages (code),
  level text not null references public.ref_levels (id),
  route_id text not null references public.curriculum_routes (id),
  source text not null check (source in ('backfill', 'signup')),
  assigned_at timestamptz not null default now(),
  primary key (user_id, language_code, level)
);

create index if not exists user_curriculum_routes_route on public.user_curriculum_routes (route_id);

-- ---------- Reglas ----------

/**
 * Problemas que impiden habilitar una ruta (vacío = lista). Las unidades tienen que estar publicadas,
 * con alguna lección publicada, en posiciones 1..n y ser del idioma y nivel de la ruta; y la ruta tiene
 * que contener todas las unidades de la ruta de respaldo (nadie pierde una unidad).
 */
create or replace function public.curriculum_route_problems(p_route_id text)
returns text[]
language sql
stable
set search_path = ''
as $$
  with r as (select * from public.curriculum_routes where id = p_route_id),
  ru as (
    select ru.*, u.language_code, u.level, u.is_published,
           exists (select 1 from public.lessons l where l.unit_id = u.id and l.is_published) has_lessons
    from public.curriculum_route_units ru join public.curriculum_units u on u.id = ru.unit_id
    where ru.route_id = p_route_id
  )
  select coalesce(array_agg(p order by p), '{}') from (
    select 'ruta inexistente: ' || p_route_id p where not exists (select 1 from r)
    union all
    select 'ruta sin unidades' where exists (select 1 from r) and not exists (select 1 from ru)
    union all
    select 'unidad sin publicar: ' || ru.unit_id from ru where not ru.is_published
    union all
    select 'unidad sin lecciones publicadas: ' || ru.unit_id from ru where ru.is_published and not ru.has_lessons
    union all
    select 'unidad de otro idioma o nivel: ' || ru.unit_id from ru, r
    where (ru.language_code, ru.level) is distinct from (r.language_code, r.level)
    union all
    select 'posiciones no consecutivas' from ru
    having count(*) > 0 and (min(ru.position) <> 1 or max(ru.position) <> count(*))
    union all
    select 'falta la unidad de la ruta de respaldo: ' || f.unit_id
    from r join public.curriculum_routes fr
      on fr.language_code = r.language_code and fr.level = r.level and fr.fallback and fr.id <> r.id
    join public.curriculum_route_units f on f.route_id = fr.id
    where not exists (select 1 from ru where ru.unit_id = f.unit_id)
  ) z;
$$;

-- Una ruta con usuarios no cambia; sus unidades sólo se agregan mientras nadie la tenga.
create or replace function public.curriculum_route_units_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  r public.curriculum_routes;
  u public.curriculum_units;
begin
  if tg_op <> 'INSERT' then
    raise exception 'curriculum_route_units: una ruta no se modifica (crear una versión nueva)';
  end if;
  select * into r from public.curriculum_routes where id = new.route_id;
  select * into u from public.curriculum_units where id = new.unit_id;
  if (u.language_code, u.level) is distinct from (r.language_code, r.level) then
    raise exception 'curriculum_route_units: % no es de %', new.unit_id, new.route_id;
  end if;
  if r.enabled or exists (select 1 from public.user_curriculum_routes a where a.route_id = new.route_id) then
    raise exception 'curriculum_route_units: % ya está habilitada o asignada', new.route_id;
  end if;
  return new;
end;
$$;

create or replace trigger curriculum_route_units_guard
  before insert or update or delete on public.curriculum_route_units
  for each row execute function public.curriculum_route_units_guard();

-- Una ruta no cambia de idioma, nivel ni versión; sólo se habilita si está lista.
create or replace function public.curriculum_routes_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'curriculum_routes: una ruta no se borra';
  end if;
  if (new.language_code, new.level, new.version) is distinct from (old.language_code, old.level, old.version) then
    raise exception 'curriculum_routes: una ruta no cambia de idioma, nivel ni versión';
  end if;
  if new.fallback is distinct from old.fallback then
    raise exception 'curriculum_routes: la ruta de respaldo no cambia';
  end if;
  if new.enabled and not old.enabled and cardinality(public.curriculum_route_problems(new.id)) > 0 then
    raise exception 'curriculum_routes: % no está lista: %', new.id,
      array_to_string(public.curriculum_route_problems(new.id), '; ');
  end if;
  if old.enabled and not new.enabled
     and (exists (select 1 from public.curriculum_route_enrollment e where e.route_id = new.id)
          or exists (select 1 from public.user_curriculum_routes a where a.route_id = new.id)) then
    raise exception 'curriculum_routes: % tiene usuarios o altas: no se deshabilita', new.id;
  end if;
  return new;
end;
$$;

create or replace trigger curriculum_routes_guard
  before update or delete on public.curriculum_routes
  for each row execute function public.curriculum_routes_guard();

-- La ruta de inscripción tiene que ser del idioma y nivel, estar habilitada y lista.
create or replace function public.curriculum_route_enrollment_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  r public.curriculum_routes;
begin
  if tg_op = 'DELETE' then
    raise exception 'curriculum_route_enrollment: no se borra (volver a la ruta de respaldo)';
  end if;
  select * into r from public.curriculum_routes where id = new.route_id;
  if (r.language_code, r.level) is distinct from (new.language_code, new.level) then
    raise exception 'curriculum_route_enrollment: % no es de % %', new.route_id, new.language_code, new.level;
  end if;
  if not r.enabled then
    raise exception 'curriculum_route_enrollment: % no está habilitada', new.route_id;
  end if;
  if cardinality(public.curriculum_route_problems(new.route_id)) > 0 then
    raise exception 'curriculum_route_enrollment: % no está lista: %', new.route_id,
      array_to_string(public.curriculum_route_problems(new.route_id), '; ');
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create or replace trigger curriculum_route_enrollment_guard
  before insert or update or delete on public.curriculum_route_enrollment
  for each row execute function public.curriculum_route_enrollment_guard();

-- La asignación de un usuario es inmutable (sólo se borra con su cuenta).
create or replace function public.user_curriculum_routes_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  r public.curriculum_routes;
begin
  if tg_op = 'UPDATE' then
    raise exception 'user_curriculum_routes: la ruta de un usuario no cambia';
  end if;
  select * into r from public.curriculum_routes where id = new.route_id;
  if (r.language_code, r.level) is distinct from (new.language_code, new.level) then
    raise exception 'user_curriculum_routes: % no es de % %', new.route_id, new.language_code, new.level;
  end if;
  if not r.enabled then
    raise exception 'user_curriculum_routes: % no está habilitada', new.route_id;
  end if;
  return new;
end;
$$;

create or replace trigger user_curriculum_routes_guard
  before insert or update on public.user_curriculum_routes
  for each row execute function public.user_curriculum_routes_guard();

-- ---------- Rutas de inglés A1 ----------

insert into public.curriculum_routes (id, language_code, level, version, fallback, enabled, description_es, enabled_at)
values
  ('en.a1.route.v1', 'en', 'A1', 1, true, false,
   'Recorrido original: U1 a U12 en orden. La de todas las cuentas existentes y la de respaldo.', null),
  ('en.a1.route.v2', 'en', 'A1', 2, false, false,
   'Recorrido del mapa curricular (docs/polygo-ingles-a1-mapa-curricular.md §3): U13 después de U3 y U14 después de U7.', null)
on conflict (id) do nothing;

insert into public.curriculum_route_units (route_id, unit_id, position)
select 'en.a1.route.v1', x.unit_id, x.position
from (values ('a1-u01', 1), ('a1-u02', 2), ('a1-u03', 3), ('a1-u04', 4), ('a1-u05', 5), ('a1-u06', 6),
             ('a1-u07', 7), ('a1-u08', 8), ('a1-u09', 9), ('a1-u10', 10), ('a1-u11', 11), ('a1-u12', 12))
  as x(unit_id, position)
where not exists (select 1 from public.curriculum_route_units where route_id = 'en.a1.route.v1');

insert into public.curriculum_route_units (route_id, unit_id, position)
select 'en.a1.route.v2', x.unit_id, x.position
from (values ('a1-u01', 1), ('a1-u02', 2), ('a1-u03', 3), ('a1-u13', 4), ('a1-u04', 5), ('a1-u05', 6),
             ('a1-u06', 7), ('a1-u07', 8), ('a1-u14', 9), ('a1-u08', 10), ('a1-u09', 11), ('a1-u10', 12),
             ('a1-u11', 13), ('a1-u12', 14))
  as x(unit_id, position)
where not exists (select 1 from public.curriculum_route_units where route_id = 'en.a1.route.v2');

-- La v1 se habilita después de cargar sus unidades (el guardia comprueba que esté lista).
update public.curriculum_routes set enabled = true, enabled_at = now()
where id = 'en.a1.route.v1' and not enabled;

-- Datos inconsistentes (una corrida anterior distinta, o filas cargadas a mano): aborta.
do $$
declare
  v_v1 text;
  v_v2 text;
begin
  select string_agg(ru.unit_id, ',' order by ru.position) into v_v1
  from public.curriculum_route_units ru where ru.route_id = 'en.a1.route.v1';
  select string_agg(ru.unit_id, ',' order by ru.position) into v_v2
  from public.curriculum_route_units ru where ru.route_id = 'en.a1.route.v2';
  if v_v1 is distinct from 'a1-u01,a1-u02,a1-u03,a1-u04,a1-u05,a1-u06,a1-u07,a1-u08,a1-u09,a1-u10,a1-u11,a1-u12' then
    raise exception 'curriculum_routes: en.a1.route.v1 no es U1–U12: %', v_v1;
  end if;
  if v_v2 is distinct from 'a1-u01,a1-u02,a1-u03,a1-u13,a1-u04,a1-u05,a1-u06,a1-u07,a1-u14,a1-u08,a1-u09,a1-u10,a1-u11,a1-u12' then
    raise exception 'curriculum_routes: en.a1.route.v2 no es la del mapa: %', v_v2;
  end if;
  if not exists (select 1 from public.curriculum_routes where id = 'en.a1.route.v1' and fallback and enabled) then
    raise exception 'curriculum_routes: en.a1.route.v1 tiene que ser la de respaldo y estar habilitada';
  end if;
end;
$$;

-- Altas nuevas: la v1 hasta que se habilite la v2.
insert into public.curriculum_route_enrollment (language_code, level, route_id)
values ('en', 'A1', 'en.a1.route.v1')
on conflict (language_code, level) do nothing;

-- ---------- Asignación ----------

/** Altas nuevas: la ruta de inscripción vigente de cada idioma y nivel, para siempre. */
create or replace function public.assign_curriculum_routes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_curriculum_routes (user_id, language_code, level, route_id, source)
  select new.id, e.language_code, e.level, e.route_id, 'signup'
  from public.curriculum_route_enrollment e
  on conflict (user_id, language_code, level) do nothing;
  return new;
end;
$$;

create or replace trigger profiles_assign_curriculum_routes
  after insert on public.profiles
  for each row execute function public.assign_curriculum_routes();

-- Cuentas existentes: el recorrido que ya tenían (v1). Después del trigger: ninguna alta queda sin fila.
insert into public.user_curriculum_routes (user_id, language_code, level, route_id, source)
select u.id, 'en', 'A1', 'en.a1.route.v1', 'backfill'
from auth.users u
on conflict (user_id, language_code, level) do nothing;

-- ---------- Orden efectivo y desbloqueo ----------

/**
 * Unidades publicadas en el orden de cada usuario: la posición en su ruta (la asignada o, si no tiene,
 * la de respaldo) o, en los idiomas y niveles sin rutas, la posición de la unidad. Las unidades que no
 * están en su ruta no aparecen; las de su ruta sin publicar tampoco (se saltan).
 */
create or replace function public.curriculum_unit_order(p_user uuid)
returns table (unit_id text, language_code text, level text, ord integer, route_id text)
language sql
stable
set search_path = ''
as $$
  select u.id, u.language_code, u.level,
         case when f.route_id is null then u.position::integer else ru.position::integer end,
         f.route_id
  from public.curriculum_units u
  cross join lateral (
    select coalesce(
      (select a.route_id from public.user_curriculum_routes a
       where a.user_id = p_user and a.language_code = u.language_code and a.level = u.level),
      (select r.id from public.curriculum_routes r
       where r.language_code = u.language_code and r.level = u.level and r.fallback)) as route_id
  ) f
  left join public.curriculum_route_units ru on ru.route_id = f.route_id and ru.unit_id = u.id
  where u.is_published and (f.route_id is null or ru.unit_id is not null);
$$;

/**
 * Una lección está desbloqueada si es la primera publicada de su nivel en el orden del usuario, si la
 * anterior en ese orden está completada, o si ya la completó (aunque ahora la preceda otra lección o
 * su unidad no esté en su ruta: nadie pierde lo que ya hizo). Misma regla que
 * 20261030140941_lesson_replay_unlock.sql, con el orden de curriculum_unit_order.
 */
create or replace function public.is_lesson_unlocked(p_user_id uuid, p_lesson_id text)
returns boolean
language sql
stable
set search_path = ''
as $$
  with ordered as (
    select l.id,
           lag(l.id) over (partition by o.language_code, o.level order by o.ord, l.position) as previous_id
    from public.lessons l
    join public.curriculum_unit_order(p_user_id) o on o.unit_id = l.unit_id
    where l.is_published
  )
  select exists (
    select 1 from ordered o
    where o.id = p_lesson_id
      and (o.previous_id is null
        or exists (
          select 1 from public.user_lesson_progress p
          where p.user_id = p_user_id and p.lesson_id = o.previous_id and p.times_completed > 0))
  ) or exists (
    select 1 from public.user_lesson_progress p
    join public.lessons l on l.id = p.lesson_id and l.is_published
    join public.curriculum_units u on u.id = l.unit_id and u.is_published
    where p.user_id = p_user_id and p.lesson_id = p_lesson_id and p.times_completed > 0
  );
$$;

/** El orden de unidades del usuario actual en un idioma (lo que la app usa para dibujar el camino). */
create or replace function public.my_curriculum_route(p_language_code text)
returns table (level text, unit_id text, unit_order integer, route_id text)
language sql
stable
security definer
set search_path = ''
as $$
  select o.level, o.unit_id, o.ord, o.route_id
  from public.curriculum_unit_order(auth.uid()) o
  where auth.uid() is not null and o.language_code = p_language_code
  order by o.level, o.ord;
$$;

/**
 * Habilitación explícita de una ruta para las altas nuevas de su idioma y nivel (fase posterior: NO se
 * llama en esta migración). Falla si la ruta no está lista. Las cuentas ya asignadas no cambian.
 */
create or replace function public.curriculum_enable_route(p_route_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.curriculum_routes;
  v_problems text[] := public.curriculum_route_problems(p_route_id);
begin
  if cardinality(v_problems) > 0 then
    raise exception 'curriculum_enable_route: % no está lista: %', p_route_id, array_to_string(v_problems, '; ')
      using errcode = '22023';
  end if;
  update public.curriculum_routes set enabled = true, enabled_at = coalesce(enabled_at, now())
  where id = p_route_id returning * into r;
  insert into public.curriculum_route_enrollment (language_code, level, route_id)
  values (r.language_code, r.level, r.id)
  on conflict (language_code, level) do update set route_id = excluded.route_id;
  return jsonb_build_object('route_id', r.id, 'language_code', r.language_code, 'level', r.level);
end;
$$;

-- ---------- Seguridad ----------

alter table public.curriculum_routes enable row level security;
alter table public.curriculum_route_units enable row level security;
alter table public.curriculum_route_enrollment enable row level security;
alter table public.user_curriculum_routes enable row level security;

revoke all on public.curriculum_routes, public.curriculum_route_units, public.curriculum_route_enrollment,
  public.user_curriculum_routes from anon, authenticated;
grant select on public.user_curriculum_routes to authenticated;

drop policy if exists "own curriculum route" on public.user_curriculum_routes;
create policy "own curriculum route" on public.user_curriculum_routes
  for select to authenticated using (user_id = auth.uid());

revoke all on function public.curriculum_route_problems(text) from public, anon, authenticated;
revoke all on function public.curriculum_route_units_guard() from public, anon, authenticated;
revoke all on function public.curriculum_routes_guard() from public, anon, authenticated;
revoke all on function public.curriculum_route_enrollment_guard() from public, anon, authenticated;
revoke all on function public.user_curriculum_routes_guard() from public, anon, authenticated;
revoke all on function public.assign_curriculum_routes() from public, anon, authenticated;
revoke all on function public.curriculum_unit_order(uuid) from public, anon, authenticated;
revoke all on function public.is_lesson_unlocked(uuid, text) from public, anon, authenticated;
revoke all on function public.curriculum_enable_route(text) from public, anon, authenticated;
revoke all on function public.my_curriculum_route(text) from public, anon;
grant execute on function public.my_curriculum_route(text) to authenticated;
grant execute on function public.curriculum_enable_route(text) to service_role;

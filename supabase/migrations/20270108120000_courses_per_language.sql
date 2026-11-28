-- =====================================================================
-- Varios cursos por idioma de destino (docs/EN_MULTI_SOURCE.md §4.1, docs/MULTILINGUAL_ONBOARDING_PLAN.md
-- §4.2). 2026-11-27. LOCAL: NO APLICADA EN PRODUCCIÓN.
--
-- Hasta acá un idioma de destino = un curso: el contenido (curriculum_units, words) se identificaba por
-- language_code. Esta migración agrega el curso al contenido, de forma aditiva:
--
--   1. courses.status (null = hereda languages.content_status del destino) y courses.content_prefix
--      (espacio de ids del curso; null en los cursos de siempre). Tres cursos nuevos OCULTOS:
--      en-from-pt (ept), en-from-it (eit), en-from-fr (efr). en-from-es sigue siendo el por defecto.
--   2. curriculum_units.course_code (not null, FK compuesta a courses(code, target_language)) y
--      words.course_code (not null, FK a courses; siempre el de su unidad): se completan con el curso por defecto del idioma (las palabras, con el de su
--      unidad). En altas sin course_code un trigger lo deduce: id con el prefijo de un curso
--      ('ept-a1-u01', 'ept-hello') → ese curso; si no, el por defecto del idioma (unidades) o el de la
--      unidad (palabras). Así los generadores de contenido existentes no cambian.
--      unique (language_code, level, position) → unique (course_code, level, position).
--   3. Ids ligados al idioma: learning_objectives.id y content_personas.id aceptan además el prefijo de
--      un curso de ese idioma (content_prefix_allowed). group_key pasa a ser único por espacio de ids
--      (group_key, language_code, prefijo del id): para los datos existentes es lo mismo.
--   4. Aislamiento por la capa de visibilidad existente: user_course_for(usuario, idioma) = el curso
--      activo si es de ese idioma; si no, el último elegido de ese idioma; si no, el por defecto. Una
--      unidad es visible sólo si es de ese curso (curriculum_unit_visible[_for],
--      curriculum_visible_unit_ids → las políticas restrictivas de curriculum_units, lessons, words,
--      exercises y exercise_words, que no cambian). Las builds de tienda que leen por language_code
--      siguen viendo sólo su curso. service_role y admin: sin cambios.
--   5. Orden y desbloqueo por (course_code, level). RUTAS: las curriculum_routes siguen siendo por
--      idioma y nivel y se aplican SÓLO a las unidades del curso por defecto del idioma (las únicas
--      que existían cuando se crearon). Las unidades de otro curso se ordenan por posición, como los
--      idiomas y niveles sin rutas. Es la opción menos invasiva: no cambia ninguna tabla de rutas,
--      ninguna asignación ni curriculum_route_for; sólo quién la consulta.
--   6. Repasos: misma firma (la Edge Function no cambia). review_item_known → review_item_in_route →
--      curriculum_unit_visible_for ya filtra por curso todo ítem de los cinco flujos; además
--      learning_review_candidates, learning_focus_candidates y get_learning_mastery dejan afuera las
--      palabras/conceptos de otro curso del mismo idioma.
--   7. RPC de cursos: disponibilidad = coalesce(courses.status, languages.content_status); niveles
--      validados contra las unidades publicadas DEL CURSO. set_target_language y complete_onboarding v1
--      no cambian: al cambiar de idioma eligen el curso por defecto (profiles_sync_active_course).
--      Interfaz: 'fr' se acepta en profiles.interface_language, set_interface_language y
--      complete_onboarding_v2 (además de es, en, pt-BR, it).
--
-- Para los cursos que ya existen no cambia nada: cada idioma tiene un solo curso, así que
-- user_course_for devuelve siempre ese curso y cada filtro nuevo es verdadero.
-- NO toca Ranked / Word Rush (rush_*): fase aparte.
-- Idempotente. Sin DROP de datos. Rollback: supabase/rollback/20270108120000_courses_per_language.down.sql.
-- Pruebas: supabase/tests/coursesPerLanguage.test.mjs.
-- =====================================================================

-- ---------- 1. Catálogo de cursos ----------

/**
 * ¿Puede un id de contenido de `p_language` empezar con `p_prefix`? El propio código del idioma
 * (los cursos de siempre) o el content_prefix de un curso de ese idioma. Inmutable a propósito (se usa
 * en CHECK): un curso nuevo con prefijo propio necesita reemplazar esta función.
 */
create or replace function public.content_prefix_allowed(p_prefix text, p_language text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_prefix = p_language
      or (p_language, p_prefix) in (('en', 'ept'), ('en', 'eit'), ('en', 'efr'));
$$;

alter table public.courses add column if not exists status text;
alter table public.courses add column if not exists content_prefix text;

alter table public.courses drop constraint if exists courses_status_check;
alter table public.courses add constraint courses_status_check
  check (status is null or status in ('available', 'beta', 'soon', 'hidden'));
alter table public.courses drop constraint if exists courses_content_prefix_check;
alter table public.courses add constraint courses_content_prefix_check
  check (content_prefix is null
         or (content_prefix ~ '^[a-z]{3}$' and not is_default
             and public.content_prefix_allowed(content_prefix, target_language)));
create unique index if not exists courses_content_prefix_key
  on public.courses (content_prefix) where content_prefix is not null;
-- Destino de la FK compuesta del contenido (curso, idioma).
do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.courses'::regclass
                 and conname = 'courses_code_target_key') then
    alter table public.courses add constraint courses_code_target_key unique (code, target_language);
  end if;
end;
$$;

insert into public.courses (code, target_language, source_language, is_default, position, status, content_prefix)
values
  ('en-from-pt', 'en', 'pt', false, 7, 'hidden', 'ept'),
  ('en-from-it', 'en', 'it', false, 8, 'hidden', 'eit'),
  ('en-from-fr', 'en', 'fr', false, 9, 'hidden', 'efr')
on conflict (code) do nothing;

-- Ningún id existente puede caer en el espacio de un curso nuevo.
do $$
begin
  if exists (select 1 from public.curriculum_units u join public.courses c on c.content_prefix is not null
             and u.id like c.content_prefix || '-%' where u.course_code is distinct from c.code)
     or exists (select 1 from public.words w join public.courses c on c.content_prefix is not null
                and w.id like c.content_prefix || '-%' where w.course_code is distinct from c.code) then
    raise exception 'courses_per_language: hay contenido existente con el prefijo de un curso nuevo';
  end if;
exception when undefined_column then
  -- Primera aplicación: todavía no existe course_code; se compara sólo el prefijo.
  if exists (select 1 from public.curriculum_units u join public.courses c on c.content_prefix is not null
             and u.id like c.content_prefix || '-%')
     or exists (select 1 from public.words w join public.courses c on c.content_prefix is not null
                and w.id like c.content_prefix || '-%') then
    raise exception 'courses_per_language: hay contenido existente con el prefijo de un curso nuevo';
  end if;
end;
$$;

-- ---------- 2. Curso del contenido ----------

alter table public.curriculum_units add column if not exists course_code text;
alter table public.words add column if not exists course_code text;

-- Relleno sin tocar updated_at (las cachés de la app no deben ver todo el contenido como cambiado).
alter table public.curriculum_units disable trigger curriculum_units_updated_at;
update public.curriculum_units u set course_code = c.code
from public.courses c
where u.course_code is null and c.target_language = u.language_code and c.is_default;
alter table public.curriculum_units enable trigger curriculum_units_updated_at;

alter table public.words disable trigger words_updated_at;
update public.words w set course_code = u.course_code
from public.curriculum_units u
where w.course_code is null and u.id = w.unit_id;
alter table public.words enable trigger words_updated_at;

/**
 * Curso de una unidad nueva sin course_code: el del prefijo del id ('ept-a1-u01' → en-from-pt) o el
 * por defecto del idioma. Siempre: el id lleva el prefijo del curso si y sólo si el curso tiene uno,
 * y el curso es del idioma de la unidad.
 */
create or replace function public.curriculum_units_course_code()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_prefixed public.courses;
  v_course public.courses;
begin
  select * into v_prefixed from public.courses c
  where c.content_prefix is not null and new.id like c.content_prefix || '-%';
  if new.course_code is null then
    if v_prefixed.code is not null then
      new.course_code := v_prefixed.code;
    else
      select code into new.course_code from public.courses
      where target_language = new.language_code and is_default;
    end if;
  end if;
  select * into v_course from public.courses where code = new.course_code;
  if v_course.code is null or v_course.target_language is distinct from new.language_code then
    raise exception 'curriculum_units %: el curso % no es de %', new.id, new.course_code, new.language_code
      using errcode = 'check_violation';
  end if;
  if v_prefixed.code is distinct from (case when v_course.content_prefix is not null then v_course.code end) then
    raise exception 'curriculum_units %: el id no corresponde al espacio de ids del curso %', new.id, new.course_code
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

/** Curso de una palabra: el de su unidad (si no viene, se copia; si viene, tiene que coincidir). */
create or replace function public.words_course_code()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_unit_course text;
  v_prefixed text;
  v_prefix text;
begin
  select course_code into v_unit_course from public.curriculum_units where id = new.unit_id;
  if new.course_code is null then
    new.course_code := v_unit_course;
  end if;
  if new.course_code is distinct from v_unit_course then
    raise exception 'words %: el curso % no es el de su unidad % (%)', new.id, new.course_code, new.unit_id, v_unit_course
      using errcode = 'check_violation';
  end if;
  select code into v_prefixed from public.courses c
  where c.content_prefix is not null and new.id like c.content_prefix || '-%';
  select content_prefix into v_prefix from public.courses where code = new.course_code;
  if v_prefixed is distinct from (case when v_prefix is not null then new.course_code end) then
    raise exception 'words %: el id no corresponde al espacio de ids del curso %', new.id, new.course_code
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

revoke all on function public.curriculum_units_course_code() from public, anon, authenticated;
revoke all on function public.words_course_code() from public, anon, authenticated;

drop trigger if exists curriculum_units_course_code on public.curriculum_units;
create trigger curriculum_units_course_code
  before insert or update of id, language_code, course_code on public.curriculum_units
  for each row execute function public.curriculum_units_course_code();

drop trigger if exists words_course_code on public.words;
create trigger words_course_code
  before insert or update of id, unit_id, course_code on public.words
  for each row execute function public.words_course_code();

alter table public.curriculum_units alter column course_code set not null;
alter table public.words alter column course_code set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.curriculum_units'::regclass
                 and conname = 'curriculum_units_course_fkey') then
    alter table public.curriculum_units add constraint curriculum_units_course_fkey
      foreign key (course_code, language_code) references public.courses (code, target_language);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.words'::regclass
                 and conname = 'words_course_fkey') then
    -- FK simple: el curso de una palabra es el de su unidad (trigger), aunque la palabra sea de otro
    -- idioma que la unidad (hay fixtures así).
    alter table public.words add constraint words_course_fkey
      foreign key (course_code) references public.courses (code);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.curriculum_units'::regclass
                 and conname = 'curriculum_units_course_code_level_position_key') then
    alter table public.curriculum_units add constraint curriculum_units_course_code_level_position_key
      unique (course_code, level, position);
  end if;
end;
$$;
alter table public.curriculum_units drop constraint if exists curriculum_units_language_code_level_position_key;

create index if not exists words_course_idx on public.words (course_code);

-- ---------- 3. Ids ligados al idioma ----------

alter table public.learning_objectives drop constraint if exists learning_objectives_id_check;
alter table public.learning_objectives add constraint learning_objectives_id_check
  check (id ~ '^[a-z]{2,3}\.[a-c][12]\.obj\.[a-z0-9]+(-[a-z0-9]+)*$'
         and public.content_prefix_allowed(split_part(id, '.', 1), language_code)
         and split_part(id, '.', 2) = lower(level));

-- group_key: único dentro de cada espacio de ids (los objetivos de en-from-pt repiten los de en-from-es).
-- El índice nuevo conserva el nombre de la restricción anterior (los errores siguen diciendo lo mismo).
alter table public.learning_objectives drop constraint if exists learning_objectives_group_key_language_key;
create unique index if not exists learning_objectives_group_key_language_key
  on public.learning_objectives (group_key, language_code, (split_part(id, '.', 1)));

alter table public.content_personas drop constraint if exists content_personas_id_check;
alter table public.content_personas add constraint content_personas_id_check
  check (id ~ '^[a-z]{2,3}\.persona\.[a-z0-9]+(-[a-z0-9]+)*$'
         and public.content_prefix_allowed(split_part(id, '.', 1), language_code));

-- ---------- 4. Curso de un usuario en un idioma ----------

/**
 * El curso con el que el usuario ve un idioma: el activo si es de ese idioma; si no, el último que
 * eligió de ese idioma; si no, el por defecto del idioma. Sin usuario: el por defecto.
 */
create or replace function public.user_course_for(p_user uuid, p_language text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.active_course_code from public.profiles p
     join public.courses c on c.code = p.active_course_code
     where p.id = p_user and c.target_language = p_language),
    (select uc.course_code from public.user_courses uc
     join public.courses c on c.code = uc.course_code
     where uc.user_id = p_user and c.target_language = p_language
     order by uc.last_selected_at desc nulls last, uc.enrolled_at desc, uc.course_code
     limit 1),
    (select c.code from public.courses c where c.target_language = p_language and c.is_default));
$$;

revoke all on function public.user_course_for(uuid, text) from public, anon, authenticated;
grant execute on function public.user_course_for(uuid, text) to service_role;

-- ---------- 4b. Visibilidad (base de las políticas restrictivas) ----------

/** Como en 20261117120000_curriculum_isolation + curso: la unidad es del curso del usuario en su idioma. */
create or replace function public.curriculum_unit_visible_for(p_user uuid, p_unit text, p_api smallint)
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((
    select u.course_code = public.user_course_for(p_user, u.language_code)
       and (f.route_id is null
            or exists (select 1 from public.curriculum_route_units ru
                       where ru.route_id = f.route_id and ru.unit_id = u.id))
    from public.curriculum_units u
    join public.courses c on c.code = u.course_code
    cross join lateral (
      -- Las rutas son del curso por defecto del idioma (ver cabecera, punto 5).
      select case when c.is_default
                  then public.curriculum_route_for(p_user, u.language_code, u.level, coalesce(p_api, 0::smallint))
             end as route_id
    ) f
    where u.id = p_unit), false);
$$;

/** Como en 20261116120000_route_vocabulary_access + curso. */
create or replace function public.curriculum_unit_visible(p_unit text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select u.course_code = public.user_course_for(auth.uid(), u.language_code)
       and (f.route_id is null
            or exists (select 1 from public.curriculum_route_units ru
                       where ru.route_id = f.route_id and ru.unit_id = u.id))
    from public.curriculum_units u
    join public.courses c on c.code = u.course_code
    cross join lateral (
      select case when c.is_default
                  then public.curriculum_route_for(auth.uid(), u.language_code, u.level,
                                                   public.request_curriculum_api())
             end as route_id
    ) f
    where u.id = p_unit), false);
$$;

/** Como en 20261115120000_client_compatibility + curso (calculado una vez por idioma). */
create or replace function public.curriculum_visible_unit_ids()
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  with mine as materialized (
    select t.target_language as language_code, public.user_course_for(auth.uid(), t.target_language) as course_code
    from (select distinct target_language from public.courses) t
  )
  select u.id
  from public.curriculum_units u
  join mine m on m.language_code = u.language_code and m.course_code = u.course_code
  join public.courses c on c.code = u.course_code
  cross join (select public.request_curriculum_api() as v) api
  cross join lateral (
    select case when c.is_default
                then public.curriculum_route_for(auth.uid(), u.language_code, u.level, api.v)
           end as route_id
  ) f
  where f.route_id is null
     or exists (select 1 from public.curriculum_route_units ru where ru.route_id = f.route_id and ru.unit_id = u.id);
$$;

-- ---------- 5. Orden y desbloqueo por curso ----------

/**
 * Como en 20261114120000_curriculum_routes, con las rutas aplicadas sólo a las unidades del curso por
 * defecto. Misma firma (el curso de cada unidad sale de curriculum_units.course_code).
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
  join public.courses c on c.code = u.course_code
  cross join lateral (
    select case when c.is_default then coalesce(
      (select a.route_id from public.user_curriculum_routes a
       where a.user_id = p_user and a.language_code = u.language_code and a.level = u.level),
      (select r.id from public.curriculum_routes r
       where r.language_code = u.language_code and r.level = u.level and r.fallback)) end as route_id
  ) f
  left join public.curriculum_route_units ru on ru.route_id = f.route_id and ru.unit_id = u.id
  where u.is_published and (f.route_id is null or ru.unit_id is not null);
$$;

/**
 * Como en 20261114120000_curriculum_routes, con la cadena de lecciones por (curso, nivel) y sólo en el
 * curso del usuario de cada idioma (user_course_for): la primera lección de en-from-pt no queda abierta
 * para quien estudia en-from-es. Lo ya completado sigue abierto siempre.
 */
create or replace function public.is_lesson_unlocked(p_user_id uuid, p_lesson_id text)
returns boolean
language sql
stable
set search_path = ''
as $$
  with mine as materialized (
    select t.target_language as language_code, public.user_course_for(p_user_id, t.target_language) as course_code
    from (select distinct target_language from public.courses) t
  ),
  ordered as (
    select l.id,
           lag(l.id) over (partition by cu.course_code, o.level order by o.ord, l.position) as previous_id
    from public.lessons l
    join public.curriculum_unit_order(p_user_id) o on o.unit_id = l.unit_id
    join public.curriculum_units cu on cu.id = o.unit_id
    join mine m on m.language_code = cu.language_code and m.course_code = cu.course_code
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

/**
 * Como en 20261117120000_curriculum_isolation, por (curso, nivel) y sólo con las unidades del curso
 * del usuario en ese idioma (user_course_for).
 */
create or replace function public.curriculum_unlocked_unit_ids(p_user uuid, p_language text)
returns setof text
language sql
stable
set search_path = ''
as $$
  with course as materialized (select public.user_course_for(p_user, p_language) as code),
  ordered as (
    select l.id, l.unit_id,
           lag(l.id) over (partition by cu.course_code, o.level order by o.ord, l.position) as previous_id
    from public.lessons l
    join public.curriculum_unit_order(p_user) o on o.unit_id = l.unit_id
    join public.curriculum_units cu on cu.id = o.unit_id
    where l.is_published and o.language_code = p_language
      and cu.course_code = (select code from course)
  )
  select o.unit_id from ordered o
  where o.previous_id is null
     or exists (select 1 from public.user_lesson_progress p
                where p.user_id = p_user and p.lesson_id = o.previous_id and p.times_completed > 0)
  union
  select l.unit_id
  from public.user_lesson_progress p
  join public.lessons l on l.id = p.lesson_id and l.is_published
  join public.curriculum_units u on u.id = l.unit_id and u.is_published
  where p.user_id = p_user and p.times_completed > 0 and u.language_code = p_language
    and u.course_code = (select code from course);
$$;

/** Como en 20261115120000_client_compatibility: sólo el curso del usuario; rutas sólo del por defecto. */
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
  join public.courses c on c.code = u.course_code
  cross join (select public.request_curriculum_api() as v) api
  cross join lateral (
    select case when c.is_default
                then public.curriculum_route_for(auth.uid(), u.language_code, u.level, api.v)
           end as route_id
  ) f
  left join public.curriculum_route_units ru on ru.route_id = f.route_id and ru.unit_id = u.id
  where auth.uid() is not null
    and u.language_code = p_language_code
    and u.course_code = public.user_course_for(auth.uid(), p_language_code)
    and u.is_published
    and (f.route_id is null or ru.unit_id is not null)
  order by 1, 3;
$$;

-- ---------- 6. Repasos: nada de otro curso del mismo idioma ----------

-- learning_review_candidates: como en 20261117120000_curriculum_isolation + sólo palabras del curso.
create or replace function public.learning_review_candidates(p_user uuid, p_lang text, p_tz text, p_now timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_tz text := public.safe_time_zone(p_tz);
  v_today date := (p_now at time zone v_tz)::date;
  v_end timestamptz := (v_today + 1)::timestamp at time zone v_tz;
  v_soon timestamptz := (v_today + 3)::timestamp at time zone v_tz;
  v_goal integer;
  v_b integer;
  v_debt public.srs_user_debt_state;
  v_debt_items numeric;
  v_ipu double precision;
  v_last_weak date;
  v_last_kind text;
  v_course text;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages where code = p_lang) then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_course := public.user_course_for(p_user, p_lang);
  select daily_goal_minutes into v_goal from public.profiles where id = p_user;
  v_b := (coalesce(v_goal, 10) * public.srs_v2_user_rhythm100(p_user, null)) / 100;
  select * into v_debt from public.srs_user_debt_state where user_id = p_user and language_code = p_lang;
  select debt_items into v_debt_items from public.srs_user_debt_days
  where user_id = p_user and language_code = p_lang and study_date = v_today;
  if v_debt_items is null then
    v_ipu := public.srs_v2_ipu(p_user, p_lang);
    select count(*) * v_ipu::numeric into v_debt_items from public.user_srs_state
    where user_id = p_user and language_code = p_lang and due_at < v_end;
  end if;
  select (p.created_at at time zone v_tz)::date, x ->> 'reason' into v_last_weak, v_last_kind
  from public.srs_session_plans p
  join public.learning_sessions s on s.id = p.session_id and s.user_id = p.user_id
  cross join lateral jsonb_array_elements(p.items) x
  where p.user_id = p_user and p.language_code = p_lang and x ->> 'reason' in ('weak', 'probe')
  order by p.created_at desc, (x ->> 'position')::integer desc limit 1;

  return jsonb_build_object(
    'now', p_now, 'time_zone', v_tz, 'srs_v2_enabled', public.srs_v2_enabled(),
    'budget', jsonb_build_object(
      'B', v_b,
      'reviews_today', coalesce((select sum(first_try_total) from public.learning_sessions
                                 where user_id = p_user and kind = 'review' and local_date = v_today), 0),
      'all_today', coalesce((select sum(first_try_total) from public.learning_sessions
                             where user_id = p_user and local_date = v_today), 0),
      'advanced_today', (select count(*) from public.srs_session_plans p
                         join public.learning_sessions s on s.id = p.session_id
                         cross join lateral jsonb_array_elements(p.items) x
                         where p.user_id = p_user and s.local_date = v_today and x ->> 'reason' = 'me_advanced'),
      'first_review_today', not exists (select 1 from public.srs_session_plans p
                                        join public.learning_sessions s on s.id = p.session_id
                                        where p.user_id = p_user and s.local_date = v_today
                                          and p.source = 'adaptive_review')),
    'debt', jsonb_build_object('al19_active', coalesce(v_debt.al19_active, false), 'debt_items', coalesce(v_debt_items, 0)),
    'al8', jsonb_build_object('last_attended_date', v_last_weak, 'last_kind', v_last_kind),
    'user_median_speed', (select percentile_cont(0.5) within group (order by u.recall_speed)
                          from public.user_concept_state u join public.mastery_model_versions mv on mv.version = u.model_version
                          where u.user_id = p_user and u.language_code = p_lang and mv.enabled_for_adaptive
                            and u.recall_speed is not null),
    'units', coalesce((
      with cand as materialized (select * from public.review_item_candidates(p_lang))
      select jsonb_agg(jsonb_build_object(
        'concept_id', s.concept_id, 'dimension', s.dimension, 'level', c.level,
        'due_at', s.due_at, 'due_effective_at', s.due_effective_at, 'me_hint_expires_at', s.me_hint_expires_at,
        'last_seen_at', s.last_seen_at, 't_last', s.t_last, 'stability', s.stability, 'difficulty', s.difficulty,
        'n', s.n, 'rung', s.rung,
        'errors_30d', public.srs_unit_full_errors(s.user_id, s.concept_id, s.dimension, p_now),
        'errors_window_complete', public.srs_unit_errors_window_complete(s.user_id, s.migration_source, p_now),
        'objective_ids', (select coalesce(jsonb_agg(oc.objective_id order by oc.objective_id), '[]'::jsonb)
                          from public.objective_concepts oc
                          join public.learning_objectives o on o.id = oc.objective_id and o.status = 'active'
                          where oc.concept_id = s.concept_id and oc.role = 'core'),
        'intro_lesson_id', coalesce(
          (select lo.lesson_id from public.objective_concepts oc
           join public.learning_objectives o on o.id = oc.objective_id and o.status = 'active'
           join public.lesson_objectives lo on lo.objective_id = oc.objective_id and lo.role = 'introduce'
           join public.lessons l on l.id = lo.lesson_id and l.is_published
           join public.curriculum_units cu on cu.id = l.unit_id
           where oc.concept_id = s.concept_id and public.curriculum_unit_visible_for(p_user, cu.id, public.request_curriculum_api()) order by cu.level, cu.position, l.position, l.id limit 1),
          (select l.id from public.exercise_words ew
           join public.exercises e on e.id = ew.exercise_id and e.is_published
           join public.lessons l on l.id = e.lesson_id and l.is_published
           join public.curriculum_units cu on cu.id = l.unit_id
           where ew.word_id = c.word_id and public.curriculum_unit_visible_for(p_user, cu.id, public.request_curriculum_api()) order by cu.level, cu.position, l.position, l.id limit 1)),
        'mastery', (select jsonb_build_object('enabled', mv.enabled_for_adaptive, 'status', u.status, 'mastery', u.mastery,
                                              'confidence', u.confidence, 'weak', u.weak, 'recall_speed', u.recall_speed,
                                              'transfer_met', coalesce((u.model_detail -> 'transfer' ->> 'met')::boolean, false))
                    from public.user_concept_state u join public.mastery_model_versions mv on mv.version = u.model_version
                    where u.user_id = s.user_id and u.concept_id = s.concept_id and u.dimension = s.dimension),
        'items', coalesce((select jsonb_agg(jsonb_build_object('item_id', r.item_id, 'rung', r.rung, 'item_type', r.item_type,
                                                               'input_modality', r.input_modality, 'option_count', r.option_count,
                                                               'concepts', (select coalesce(jsonb_agg(distinct x.concept_id), '[]'::jsonb) from public.item_concepts x where x.item_id = r.item_id and x.role = 'target'),
                                                               'last_presented_at', (select max(p.presented_at) from public.exercise_presentations p
                                                                                     where p.user_id = s.user_id and p.item_id = r.item_id))
                                      order by r.item_id)
                           from cand r
                           where r.concept_id = s.concept_id and r.dimension = s.dimension
                             and public.review_item_known(p_user, r.item_id, 'srs')), '[]'::jsonb))
        order by s.due_at, s.concept_id, s.dimension)
      from public.user_srs_state s
      join public.concepts c on c.id = s.concept_id and c.kind = 'lexical'
      join public.words w on w.id = c.word_id and w.is_published and w.course_code = v_course
      where s.user_id = p_user and s.language_code = p_lang
        and (s.due_at < v_soon or s.due_effective_at < v_end or s.n <= 2 or s.difficulty >= 6.85
             or exists (select 1 from public.user_concept_state u where u.user_id = s.user_id and u.concept_id = s.concept_id
                        and u.dimension = s.dimension and (u.weak or u.status = 'insufficient' or u.confidence < 0.35))
             or exists (select 1 from public.srs_unit_updates x where x.user_id = s.user_id and x.concept_id = s.concept_id
                        and x.dimension = s.dimension and x.full_error and x.t_srs > p_now - interval '30 days'
                        and x.t_srs <= p_now))
      ), '[]'::jsonb));
end;
$$;

-- learning_focus_candidates (Plus / básico): como en 20261111120000_learning_phase5 + sólo palabras del curso.
create or replace function public.learning_focus_candidates(p_user uuid, p_lang text, p_now timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_course text;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages where code = p_lang) then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_course := public.user_course_for(p_user, p_lang);
  return jsonb_build_object('now', p_now, 'plus', public.has_plus(p_user), 'words', coalesce((
    with cand as materialized (select * from public.review_item_candidates(p_lang) where dimension = 'vocabulary')
    select jsonb_agg(jsonb_build_object(
             'word', jsonb_build_object('id', c.id, 'unit_id', w.unit_id),
             'stage', p.stage, 'seenCount', p.seen_count, 'incorrectCount', p.incorrect_count,
             'nextReviewAt', p.next_review_at,
             'items', coalesce((
               select jsonb_agg(jsonb_build_object(
                        'item_id', r.item_id, 'dimension', r.dimension, 'rung', r.rung, 'option_count', r.option_count,
                        'concepts', (select coalesce(jsonb_agg(distinct x.concept_id), '[]'::jsonb) from public.item_concepts x where x.item_id = r.item_id and x.role = 'target'),
                        'last_presented_at', (select max(x.presented_at) from public.exercise_presentations x
                                              where x.user_id = p_user and x.item_id = r.item_id))
                      order by r.item_id)
               from cand r where r.concept_id = c.id and public.review_item_known(p_user, r.item_id, 'v1')), '[]'::jsonb))
           order by p.next_review_at nulls last, c.id)
    from public.user_word_progress p
    join public.words w on w.id = p.word_id and w.is_published and w.language_code = p_lang
                       and w.course_code = v_course
    join public.concepts c on c.word_id = w.id and c.kind = 'lexical' and c.status = 'active'
    where p.user_id = p_user and p.seen_count > 0), '[]'::jsonb));
end;
$$;

-- get_learning_mastery: como en 20261117120000_curriculum_isolation + sin conceptos de palabras de otro
-- curso del idioma (conteos de repaso, dimensiones, retención, velocidad y débiles).
create or replace function public.get_learning_mastery(p_language text, p_time_zone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_tz text := public.safe_time_zone(p_time_zone);
  v_end timestamptz := ((now() at time zone v_tz)::date + 1)::timestamp at time zone v_tz;
  v_model text;
  v_v2 boolean;
  v_review jsonb;
  v_course text;
begin
  if v_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages where code = p_language) then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_course := public.user_course_for(v_user, p_language);
  v_v2 := public.srs_v2_enabled()
          and exists (select 1 from public.srs_user_head where user_id = v_user and v2_since is not null);
  if v_v2 then
    v_review := jsonb_build_object('source', 'srs_v2',
      'due_today', (select count(*) from public.user_srs_state s
                    where s.user_id = v_user and s.language_code = p_language and s.due_at < v_end
                      and not exists (select 1 from public.concepts xc join public.words xw on xw.id = xc.word_id
                                      where xc.id = s.concept_id and xw.course_code <> v_course)),
      'due_now', (select count(*) from public.user_srs_state s
                  where s.user_id = v_user and s.language_code = p_language and s.due_at <= now()
                    and not exists (select 1 from public.concepts xc join public.words xw on xw.id = xc.word_id
                                    where xc.id = s.concept_id and xw.course_code <> v_course)));
  else
    v_review := jsonb_build_object('source', 'srs_v1',
      'due_today', (select count(*) from public.user_word_progress p join public.words w on w.id = p.word_id
                    where p.user_id = v_user and w.language_code = p_language and w.course_code = v_course
                      and p.next_review_at < v_end),
      'due_now', (select count(*) from public.user_word_progress p join public.words w on w.id = p.word_id
                  where p.user_id = v_user and w.language_code = p_language and w.course_code = v_course
                    and p.next_review_at <= now()));
  end if;

  select version into v_model from public.mastery_model_versions
  where status = 'active' and enabled_for_display order by version desc limit 1;
  if v_model is null then
    return jsonb_build_object('available', false, 'review', v_review);
  end if;

  return (
    with st as materialized (
      select u.*, case when u.evidence_count = 0 then 'no_evidence'
                       when u.status = 'insufficient' then 'insufficient'
                       when u.status = 'mastered' then 'mastered'
                       when u.weak then 'weak'
                       else 'in_progress' end as state
      from public.user_concept_state u
      where u.user_id = v_user and u.language_code = p_language and u.model_version = v_model
        and not exists (select 1 from public.concepts xc join public.words xw on xw.id = xc.word_id
                        where xc.id = u.concept_id and xw.course_code <> v_course)),
    unit_concepts as materialized (
      select distinct cu.id as unit_id, ic.concept_id, ic.dimension
      from public.curriculum_units cu
      join public.lessons l on l.unit_id = cu.id and l.is_published
      join public.exercises e on e.lesson_id = l.id and e.is_published
      join public.item_concepts ic on ic.item_id = e.item_id and ic.role = 'target'
      where cu.language_code = p_language)
    select jsonb_build_object(
      'available', true, 'model_version', v_model, 'review', v_review,
      'computed_at', (select max(computed_at) from st),
      'pending_recompute', (select count(*) from st where dirty_since is not null),
      'dimensions', coalesce((
        select jsonb_object_agg(d.dimension, d.counts) from (
          select dimension, jsonb_build_object(
            'no_evidence', count(*) filter (where state = 'no_evidence'),
            'insufficient', count(*) filter (where state = 'insufficient'),
            'weak', count(*) filter (where state = 'weak'),
            'in_progress', count(*) filter (where state = 'in_progress'),
            'mastered', count(*) filter (where state = 'mastered')) as counts
          from st group by dimension) d), '{}'::jsonb),
      'retention', (select jsonb_build_object('units', count(*), 'mean', round(avg(retention_estimate), 4))
                    from st where retention_estimate is not null
                      and coalesce((model_detail ->> 'retention_sufficient')::boolean, false)),
      'speed', (select jsonb_build_object('units', count(*),
                       'median', round((percentile_cont(0.5) within group (order by recall_speed))::numeric, 4))
                from st where recall_speed is not null),
      'units', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'unit_id', cu.id, 'level', cu.level, 'position', cu.position, 'title', cu.title_es,
                 'total', x.total, 'not_seen', x.total - x.seen, 'no_evidence', x.no_evidence,
                 'insufficient', x.insufficient, 'weak', x.weak, 'in_progress', x.in_progress,
                 'mastered', x.mastered)
               order by cu.level, cu.position)
        from public.curriculum_units cu
        join lateral (
          select count(*) as total, count(s.state) as seen,
                 count(*) filter (where s.state = 'no_evidence') as no_evidence,
                 count(*) filter (where s.state = 'insufficient') as insufficient,
                 count(*) filter (where s.state = 'weak') as weak,
                 count(*) filter (where s.state = 'in_progress') as in_progress,
                 count(*) filter (where s.state = 'mastered') as mastered
          from unit_concepts uc
          left join st s on s.concept_id = uc.concept_id and s.dimension = uc.dimension
          where uc.unit_id = cu.id) x on x.total > 0
        where cu.language_code = p_language
          and cu.is_published and public.curriculum_unit_visible(cu.id)), '[]'::jsonb),
      -- R5: débiles, menor m y exposición más vieja primero.
      'weak', coalesce((
        select jsonb_agg(jsonb_build_object('concept_id', s.concept_id, 'dimension', s.dimension,
                                            'text', w.text, 'translation', w.translation_es,
                                            'mastery', s.mastery, 'confidence', s.confidence)
                         order by s.mastery, s.last_exposed_at, s.concept_id)
        from (select * from st where state = 'weak'
              and not exists (select 1 from public.concepts xc join public.words xw on xw.id = xc.word_id
                              where xc.id = st.concept_id and not public.curriculum_unit_visible(xw.unit_id))
              order by mastery, last_exposed_at, concept_id limit 10) s
        join public.concepts c on c.id = s.concept_id
        left join public.words w on w.id = c.word_id), '[]'::jsonb))
  );
end;
$$;

-- ---------- 7. RPC de cursos ----------

-- Interfaz en francés (para en-from-fr): 'fr' se suma a es, en, pt-BR, it. Mismo patrón que
-- 20270103120000_interface_languages_pt_it (el CHECK se busca por definición).
do $$
declare
  c record;
begin
  for c in
    select con.conname from pg_constraint con
    where con.conrelid = 'public.profiles'::regclass and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%interface_language%'
  loop
    execute format('alter table public.profiles drop constraint %I', c.conname);
  end loop;
end;
$$;
alter table public.profiles
  add constraint profiles_interface_language_check
  check (interface_language in ('es', 'en', 'pt-BR', 'it', 'fr'));

-- set_interface_language: como en 20270103120000_interface_languages_pt_it + 'fr'.
create or replace function public.set_interface_language(p_language text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_language is null or p_language not in ('es', 'en', 'pt-BR', 'it', 'fr') then
    raise exception 'interface_language_invalid' using errcode = '22023';
  end if;
  update public.profiles set interface_language = p_language
  where id = uid
  returning * into result;
  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;
  return result;
end;
$$;

-- complete_onboarding_v2: como en 20270103120000_interface_languages_pt_it + disponibilidad del curso,
-- niveles del curso e interfaz 'fr'.
create or replace function public.complete_onboarding_v2(
  p_username text,
  p_avatar_id text,
  p_course_code text,
  p_start_level text,
  p_daily_goal_minutes smallint,
  p_interface_language text,
  p_placement_level text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  normalized text := lower(trim(p_username));
  course public.courses;
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into course from public.courses where code = p_course_code;
  if not found or not exists (
    select 1 from public.languages
    where code = course.target_language and coalesce(course.status, content_status) = 'available'
  ) then
    raise exception 'course_unavailable' using errcode = '22023';
  end if;
  if not exists (select 1 from public.curriculum_units
                 where course_code = course.code and level = p_start_level
                   and is_published) then
    raise exception 'level_unavailable' using errcode = '22023';
  end if;
  if p_interface_language is null or p_interface_language not in ('es', 'en', 'pt-BR', 'it', 'fr') then
    raise exception 'interface_language_invalid' using errcode = '22023';
  end if;
  if p_placement_level is not null
     and p_placement_level not in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') then
    raise exception 'placement_level_invalid' using errcode = '22023';
  end if;
  if exists (select 1 from public.profiles where username = normalized and id <> uid) then
    raise exception 'username_taken' using errcode = '23505';
  end if;

  update public.profiles set
    username = normalized,
    display_name = coalesce(display_name, normalized),
    avatar_id = p_avatar_id,
    active_course_code = course.code,
    interface_language = p_interface_language,
    start_level = case when p_start_level in ('A1', 'A2') then p_start_level else start_level end,
    daily_goal_minutes = p_daily_goal_minutes,
    onboarding_completed_at = coalesce(onboarding_completed_at, now())
  where id = uid
  returning * into result;
  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  insert into public.user_courses (
    user_id, course_code, start_level, placement_level, placement_completed_at, last_selected_at
  ) values (
    uid, course.code, p_start_level, p_placement_level,
    case when p_placement_level is null then null else now() end, now()
  )
  on conflict (user_id, course_code) do update set
    start_level = excluded.start_level,
    placement_level = coalesce(excluded.placement_level, public.user_courses.placement_level),
    placement_completed_at = coalesce(excluded.placement_completed_at,
                                      public.user_courses.placement_completed_at),
    last_selected_at = now();

  if exists (select 1 from public.languages
             where code = course.target_language and ranked_available)
     and not exists (select 1 from public.player_ratings
                     where user_id = uid and language_code = course.target_language) then
    insert into public.player_ratings (user_id, language_code) values (uid, course.target_language);
    insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
    select uid, course.target_language, s.id, 'initial', 100, 100
    from (select 1) as one
    left join public.seasons s on s.status = 'active';
  end if;
  return result;
end;
$$;

-- set_active_course: como en 20261223120000_course_model + disponibilidad del curso.
create or replace function public.set_active_course(p_course_code text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  course public.courses;
  lang public.languages;
  v_status text;
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into course from public.courses where code = p_course_code;
  if found then
    select * into lang from public.languages where code = course.target_language;
  end if;
  v_status := coalesce(course.status, lang.content_status);
  if course.code is null or not (
    v_status = 'available'
    or (v_status = 'beta' and public.is_content_tester())
  ) then
    raise exception 'course_unavailable' using errcode = '22023';
  end if;

  update public.profiles set active_course_code = course.code
  where id = uid and onboarding_completed_at is not null
  returning * into result;
  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;
  -- Volver a elegir el curso que ya estaba activo también cuenta como selección.
  update public.user_courses set last_selected_at = now()
  where user_id = uid and course_code = course.code;

  if lang.ranked_available and not exists (
    select 1 from public.player_ratings where user_id = uid and language_code = lang.code
  ) then
    insert into public.player_ratings (user_id, language_code) values (uid, lang.code);
    insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
    select uid, lang.code, s.id, 'initial', 100, 100
    from (select 1) as one
    left join public.seasons s on s.status = 'active';
  end if;
  return result;
end;
$$;

-- set_course_start_level: como en 20261223120000_course_model + niveles del curso.
create or replace function public.set_course_start_level(p_course_code text, p_level text)
returns public.user_courses
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  course public.courses;
  result public.user_courses;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into course from public.courses where code = p_course_code;
  if not found then
    raise exception 'course_unavailable' using errcode = '22023';
  end if;
  if not exists (select 1 from public.curriculum_units
                 where course_code = course.code and level = p_level
                   and is_published) then
    raise exception 'level_unavailable' using errcode = '22023';
  end if;

  update public.user_courses set start_level = p_level
  where user_id = uid and course_code = course.code
  returning * into result;
  if result.user_id is null then
    raise exception 'course_not_enrolled' using errcode = 'P0002';
  end if;

  if p_level in ('A1', 'A2') then
    update public.profiles set start_level = p_level
    where id = uid and active_course_code = course.code;
  end if;
  return result;
end;
$$;

-- start_course: como en 20261224120000_course_placement + disponibilidad y niveles del curso.
create or replace function public.start_course(
  p_course_code text,
  p_start_level text,
  p_placement_level text default null,
  p_placement_correct smallint default null,
  p_placement_total smallint default null,
  p_placement_version text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  course public.courses;
  lang public.languages;
  v_status text;
  levels constant text[] := array['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  with_placement boolean;
  enrollment public.user_courses;
  created boolean := false;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.profiles where id = uid and onboarding_completed_at is not null) then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  -- Mismas reglas de disponibilidad que set_active_course.
  select * into course from public.courses where code = p_course_code;
  if found then
    select * into lang from public.languages where code = course.target_language;
  end if;
  v_status := coalesce(course.status, lang.content_status);
  if course.code is null or not (
    v_status = 'available'
    or (v_status = 'beta' and public.is_content_tester())
  ) then
    raise exception 'course_unavailable' using errcode = '22023';
  end if;

  if p_start_level is null or not exists (
    select 1 from public.curriculum_units
    where course_code = course.code and level = p_start_level and is_published
  ) then
    raise exception 'level_unavailable' using errcode = '22023';
  end if;

  -- El resultado del test va completo o no va.
  with_placement := p_placement_level is not null;
  if with_placement <> (p_placement_correct is not null)
     or with_placement <> (p_placement_total is not null)
     or with_placement <> (p_placement_version is not null) then
    raise exception 'placement_invalid' using errcode = '22023';
  end if;
  if with_placement then
    -- Nunca un nivel sin contenido publicado (ni uno que no sea MCER).
    if not exists (
      select 1 from public.curriculum_units
      where course_code = course.code and level = p_placement_level and is_published
    ) then
      raise exception 'placement_level_unavailable' using errcode = '22023';
    end if;
    -- Se puede empezar por debajo de lo que dio el test (p. ej. desde A1), nunca por encima.
    if array_position(levels, p_start_level) > array_position(levels, p_placement_level)
       or p_placement_total not between 1 and 100
       or p_placement_correct not between 0 and p_placement_total
       or p_placement_version !~ '^[a-z0-9][a-z0-9.-]{0,39}$' then
      raise exception 'placement_invalid' using errcode = '22023';
    end if;
  end if;

  -- Sólo un curso nuevo recibe nivel y resultado. Uno ya inscripto se conserva tal cual.
  insert into public.user_courses (
    user_id, course_code, start_level, placement_level, placement_completed_at,
    placement_correct, placement_total, placement_version, last_selected_at
  ) values (
    uid, course.code, p_start_level, p_placement_level,
    case when with_placement then now() end,
    p_placement_correct, p_placement_total, p_placement_version, now()
  )
  on conflict (user_id, course_code) do nothing
  returning * into enrollment;
  created := enrollment.user_id is not null;

  -- Curso activo. Los triggers del modelo de cursos sincronizan target_language y start_level con
  -- la inscripción (la de arriba o la que ya existía) y actualizan last_selected_at.
  update public.profiles set active_course_code = course.code where id = uid;
  update public.user_courses set last_selected_at = now()
  where user_id = uid and course_code = course.code
  returning * into enrollment;

  if lang.ranked_available and not exists (
    select 1 from public.player_ratings where user_id = uid and language_code = lang.code
  ) then
    insert into public.player_ratings (user_id, language_code) values (uid, lang.code);
    insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
    select uid, lang.code, s.id, 'initial', 100, 100
    from (select 1) as one
    left join public.seasons s on s.status = 'active';
  end if;

  return jsonb_build_object(
    'created', created,
    'course_code', enrollment.course_code,
    'start_level', enrollment.start_level,
    'placement_level', enrollment.placement_level,
    'placement_completed_at', enrollment.placement_completed_at,
    'placement_correct', enrollment.placement_correct,
    'placement_total', enrollment.placement_total,
    'placement_version', enrollment.placement_version
  );
end;
$$;

-- ---------- 8. Permisos (create or replace conserva los de siempre; se reafirman) ----------

revoke all on function public.content_prefix_allowed(text, text) from public, anon, authenticated;
revoke all on function public.set_interface_language(text) from public, anon;
grant execute on function public.set_interface_language(text) to authenticated;
revoke all on function public.curriculum_unit_visible_for(uuid, text, smallint) from public, anon, authenticated;
revoke all on function public.curriculum_unlocked_unit_ids(uuid, text) from public, anon, authenticated;
revoke all on function public.curriculum_unit_order(uuid) from public, anon, authenticated;
revoke all on function public.is_lesson_unlocked(uuid, text) from public, anon, authenticated;
revoke all on function public.curriculum_unit_visible(text) from public, anon;
grant execute on function public.curriculum_unit_visible(text) to authenticated;
revoke all on function public.curriculum_visible_unit_ids() from public, anon;
grant execute on function public.curriculum_visible_unit_ids() to authenticated;

-- ---------- 9. Comprobación ----------

do $$
begin
  if exists (select 1 from public.curriculum_units u
             join public.courses c on c.code = u.course_code
             where not c.is_default and c.content_prefix is null) then
    raise exception 'courses_per_language: unidades en un curso que no es el por defecto y sin prefijo';
  end if;
  if exists (select 1 from public.words w join public.curriculum_units u on u.id = w.unit_id
             where w.course_code <> u.course_code) then
    raise exception 'courses_per_language: palabras con un curso distinto al de su unidad';
  end if;
  if (select count(*) from public.courses where target_language = 'en') < 4
     or exists (select 1 from public.courses where code in ('en-from-pt', 'en-from-it', 'en-from-fr')
                and (is_default or content_prefix is null)) then
    raise exception 'courses_per_language: faltan los cursos nuevos de inglés';
  end if;
  if not exists (select 1 from pg_proc where oid = 'public.get_learning_mastery(text, text)'::regprocedure
                 and prosrc like '%curriculum_unit_visible(cu.id)%') then
    raise exception 'courses_per_language: get_learning_mastery sin filtro curricular';
  end if;
end;
$$;

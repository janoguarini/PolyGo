-- Modelo de cursos (docs/MULTILINGUAL_ONBOARDING_PLAN.md §4.2). Fase 2, 2026-11-21. LOCAL: no aplicada.
--
-- Separa tres cosas que hasta ahora eran una sola (profiles.target_language):
--   * el idioma de la interfaz (profiles.interface_language);
--   * el curso que se estudia: idioma de destino + idioma de origen (courses, profiles.active_course_code);
--   * el estado de cada curso del usuario: su nivel y el resultado de la prueba de nivel (user_courses).
-- El progreso, el SRS, la maestría y el ELO no se mueven: ya cuelgan de ids de lección/palabra (que
-- pertenecen a las unidades de un curso) o del idioma (player_ratings).
--
-- Compatibilidad: no se borra ni se cambia nada existente. target_language y start_level siguen (las
-- builds de tienda, el servidor de batallas y los RPC actuales los usan) y se mantienen sincronizados
-- por trigger, así que complete_onboarding v1 y set_target_language siguen funcionando sin cambios.
-- Idempotente. No depende de las migraciones 20261222* (sin aplicar en producción).
-- Rollback: supabase/rollback/20261223120000_course_model.down.sql.

-- ---------- catálogo de cursos ----------
create table if not exists public.courses (
  code text primary key check (code ~ '^[a-z]{2}-from-[a-z]{2}$'),
  target_language text not null references public.languages (code),
  source_language text not null references public.languages (code),
  -- El curso que usan los caminos que sólo conocen el idioma de destino (set_target_language, v1).
  is_default boolean not null default false,
  position smallint not null check (position > 0),
  created_at timestamptz not null default now(),
  unique (target_language, source_language),
  check (target_language <> source_language),
  check (code = target_language || '-from-' || source_language)
);

create unique index if not exists courses_one_default_per_target
  on public.courses (target_language) where is_default;

-- Hoy hay un curso por idioma de destino. Su disponibilidad la decide languages.content_status del
-- destino (una sola autoridad); con dos cursos para un mismo destino hará falta courses.status y
-- curriculum_units.course_code (aditivos).
insert into public.courses (code, target_language, source_language, is_default, position) values
  ('en-from-es', 'en', 'es', true, 1),
  ('fr-from-es', 'fr', 'es', true, 2),
  ('it-from-es', 'it', 'es', true, 3),
  ('pt-from-es', 'pt', 'es', true, 4),
  ('zh-from-es', 'zh', 'es', true, 5),
  ('es-from-en', 'es', 'en', true, 6)
on conflict (code) do nothing;

alter table public.courses enable row level security;
revoke all on public.courses from anon, authenticated;
grant select on public.courses to anon, authenticated;
drop policy if exists "courses readable by everyone" on public.courses;
create policy "courses readable by everyone" on public.courses for select using (true);

-- ---------- cursos de cada usuario ----------
create table if not exists public.user_courses (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_code text not null references public.courses (code),
  -- Nivel desde el que empieza el camino de este curso. Se valida contra lo publicado en los RPC.
  start_level text not null default 'A1' check (start_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  -- Resultado de la prueba de nivel (Fase 4). No marca lecciones ni da XP.
  placement_level text check (placement_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  placement_completed_at timestamptz,
  enrolled_at timestamptz not null default now(),
  -- Última vez que pasó a ser el curso activo.
  last_selected_at timestamptz,
  primary key (user_id, course_code),
  check ((placement_level is null) = (placement_completed_at is null))
);

create index if not exists user_courses_course_idx on public.user_courses (course_code);

alter table public.user_courses enable row level security;
revoke all on public.user_courses from anon, authenticated;
grant select on public.user_courses to authenticated;
drop policy if exists "user courses readable by owner" on public.user_courses;
create policy "user courses readable by owner" on public.user_courses
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- perfil ----------
-- null = el usuario no la eligió (la app usa la del dispositivo).
alter table public.profiles
  add column if not exists interface_language text check (interface_language in ('es', 'en'));
alter table public.profiles
  add column if not exists active_course_code text references public.courses (code);
create index if not exists profiles_active_course_idx on public.profiles (active_course_code);
-- Sin grant de update: las dos columnas nuevas sólo cambian por RPC (como target_language).

-- ---------- migración de los datos existentes (antes de crear los triggers) ----------
-- 1. Curso activo = el curso por defecto del idioma que estudia.
update public.profiles p
set active_course_code = c.code
from public.courses c
where p.active_course_code is null
  and c.target_language = p.target_language
  and c.is_default;

-- 2. Quien ya completó el onboarding usó la app en español.
update public.profiles
set interface_language = 'es'
where interface_language is null and onboarding_completed_at is not null;

-- 3. Inscripciones: el curso activo con el nivel de hoy (no cambia lo que ve)…
insert into public.user_courses (user_id, course_code, start_level, enrolled_at, last_selected_at)
select p.id, p.active_course_code, p.start_level, p.onboarding_completed_at, p.onboarding_completed_at
from public.profiles p
where p.onboarding_completed_at is not null and p.active_course_code is not null
on conflict (user_id, course_code) do nothing;

-- …y cada otro idioma con al menos una lección completada, desde A1 (lo que la app ya mostraba).
insert into public.user_courses (user_id, course_code, start_level, enrolled_at)
select ulp.user_id, c.code, 'A1', coalesce(min(ulp.first_completed_at), now())
from public.user_lesson_progress ulp
join public.lessons l on l.id = ulp.lesson_id
join public.curriculum_units u on u.id = l.unit_id
join public.courses c on c.target_language = u.language_code and c.is_default
join public.profiles p on p.id = ulp.user_id
where p.onboarding_completed_at is not null and ulp.times_completed > 0
group by ulp.user_id, c.code
on conflict (user_id, course_code) do nothing;

-- ---------- sincronía curso activo ↔ idioma de destino ----------
-- Si cambia el curso, el destino y el nivel global (start_level) pasan a ser los del curso. Si cambia
-- sólo el destino (set_target_language, complete_onboarding v1), el curso pasa a ser el por defecto.
create or replace function public.profiles_sync_active_course()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  course public.courses;
  level text;
begin
  if tg_op = 'UPDATE'
     and new.active_course_code is distinct from old.active_course_code
     and new.active_course_code is not null then
    select * into course from public.courses where code = new.active_course_code;
    new.target_language := course.target_language;
  elsif new.active_course_code is null or not exists (
    select 1 from public.courses
    where code = new.active_course_code and target_language = new.target_language
  ) then
    select code into new.active_course_code
    from public.courses where target_language = new.target_language and is_default;
  end if;

  -- Cambio de curso de alguien ya inscripto: start_level refleja el nivel de ese curso (A1 si es
  -- nuevo). En el onboarding (old sin completar) o en filas sin curso previo, no se toca.
  if tg_op = 'UPDATE'
     and old.onboarding_completed_at is not null
     and old.active_course_code is not null
     and new.active_course_code is distinct from old.active_course_code then
    select uc.start_level into level
    from public.user_courses uc
    where uc.user_id = new.id and uc.course_code = new.active_course_code;
    new.start_level := case when level in ('A1', 'A2') then level else 'A1' end;
  end if;
  return new;
end;
$$;

-- Inscribe en el curso activo al completar el onboarding o al cambiar de curso.
create or replace function public.profiles_enroll_active_course()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.onboarding_completed_at is null or new.active_course_code is null then
    return null;
  end if;
  if old.onboarding_completed_at is null
     or new.active_course_code is distinct from old.active_course_code then
    insert into public.user_courses (user_id, course_code, start_level, last_selected_at)
    values (
      new.id,
      new.active_course_code,
      case when old.onboarding_completed_at is null then new.start_level else 'A1' end,
      now()
    )
    on conflict (user_id, course_code) do update set last_selected_at = now();
  end if;
  return null;
end;
$$;

revoke all on function public.profiles_sync_active_course() from public, anon, authenticated;
revoke all on function public.profiles_enroll_active_course() from public, anon, authenticated;

drop trigger if exists profiles_sync_active_course on public.profiles;
create trigger profiles_sync_active_course
  before insert or update of target_language, active_course_code on public.profiles
  for each row execute function public.profiles_sync_active_course();

drop trigger if exists profiles_enroll_active_course on public.profiles;
create trigger profiles_enroll_active_course
  after update of target_language, active_course_code, onboarding_completed_at on public.profiles
  for each row execute function public.profiles_enroll_active_course();

-- ---------- RPC ----------

-- Onboarding con curso, nivel por curso, idioma de interfaz y resultado opcional de la prueba de nivel.
-- La v1 (complete_onboarding) se conserva para las builds de tienda.
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
    where code = course.target_language and content_status = 'available'
  ) then
    raise exception 'course_unavailable' using errcode = '22023';
  end if;
  if not exists (select 1 from public.curriculum_units
                 where language_code = course.target_language and level = p_start_level
                   and is_published) then
    raise exception 'level_unavailable' using errcode = '22023';
  end if;
  if p_interface_language is null or p_interface_language not in ('es', 'en') then
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

-- Cambia el curso activo (el progreso de cada curso se conserva). Mismas reglas de disponibilidad que
-- set_target_language: disponible, o beta para los testers de contenido.
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
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into course from public.courses where code = p_course_code;
  if found then
    select * into lang from public.languages where code = course.target_language;
  end if;
  if course.code is null or not (
    lang.content_status = 'available'
    or (lang.content_status = 'beta' and public.is_content_tester())
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

-- Nivel desde el que empieza el camino de un curso del usuario. No marca lecciones, no da XP y no
-- toca el progreso: sólo cambia qué nivel muestra Aprender.
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
                 where language_code = course.target_language and level = p_level
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
  if p_language is null or p_language not in ('es', 'en') then
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

revoke all on function public.complete_onboarding_v2(text, text, text, text, smallint, text, text)
  from public, anon;
revoke all on function public.set_active_course(text) from public, anon;
revoke all on function public.set_course_start_level(text, text) from public, anon;
revoke all on function public.set_interface_language(text) from public, anon;
grant execute on function public.complete_onboarding_v2(text, text, text, text, smallint, text, text)
  to authenticated;
grant execute on function public.set_active_course(text) to authenticated;
grant execute on function public.set_course_start_level(text, text) to authenticated;
grant execute on function public.set_interface_language(text) to authenticated;

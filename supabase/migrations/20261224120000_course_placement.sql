-- Test de nivel: empezar un curso nuevo con el nivel elegido o el que dio el test (Fase 4,
-- docs/PLACEMENT_TEST.md). 2026-11-22. LOCAL: no aplicada. Requiere 20261223120000_course_model.
--
-- 1. user_courses guarda, además del nivel del test (placement_level / placement_completed_at, de la
--    Fase 2), la puntuación (aciertos / preguntas) y la versión del criterio. Columnas nuevas,
--    nulas: las filas existentes no cambian.
-- 2. start_course(...): inscribe en un curso NUEVO y lo deja activo, en una sola transacción.
--    * Si el usuario ya estaba inscripto en ese curso, NO cambia su nivel ni su resultado anterior
--      (ni su progreso, que nunca se toca): sólo lo vuelve a activar y responde created = false.
--    * El nivel inicial y el del test se validan contra lo publicado del idioma de destino, y el
--      inicial no puede ser mayor que el del test.
--    * No da XP, no marca lecciones, no escribe intentos; no toca los demás cursos.
-- Idempotente. Rollback: supabase/rollback/20261224120000_course_placement.down.sql.

alter table public.user_courses add column if not exists placement_correct smallint;
alter table public.user_courses add column if not exists placement_total smallint;
alter table public.user_courses add column if not exists placement_version text;

alter table public.user_courses drop constraint if exists user_courses_placement_score_check;
alter table public.user_courses add constraint user_courses_placement_score_check check (
  (placement_correct is null) = (placement_total is null)
  and (placement_total is null or (placement_total between 1 and 100
                                   and placement_correct between 0 and placement_total))
  -- La puntuación y la versión sólo acompañan a un nivel de test.
  and (placement_level is not null or (placement_total is null and placement_version is null))
  and (placement_version is null or placement_version ~ '^[a-z0-9][a-z0-9.-]{0,39}$')
);

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
  if course.code is null or not (
    lang.content_status = 'available'
    or (lang.content_status = 'beta' and public.is_content_tester())
  ) then
    raise exception 'course_unavailable' using errcode = '22023';
  end if;

  if p_start_level is null or not exists (
    select 1 from public.curriculum_units
    where language_code = course.target_language and level = p_start_level and is_published
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
      where language_code = course.target_language and level = p_placement_level and is_published
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

revoke all on function public.start_course(text, text, text, smallint, smallint, text)
  from public, anon;
grant execute on function public.start_course(text, text, text, smallint, smallint, text)
  to authenticated;

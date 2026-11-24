-- Rollback de 20261224120000_course_placement (docs/PLACEMENT_TEST.md). LOCAL.
--
-- Quita start_course y las tres columnas de puntuación del test. No toca el nivel de cada curso
-- (start_level), el nivel del test (placement_level / placement_completed_at, de la Fase 2), el curso
-- activo ni el progreso. Se pierde sólo la puntuación y la versión del criterio de los tests hechos.
-- Va antes que el rollback de 20261223120000_course_model (orden inverso). Idempotente.

drop function if exists public.start_course(text, text, text, smallint, smallint, text);

do $$
begin
  if to_regclass('public.user_courses') is not null then
    alter table public.user_courses drop constraint if exists user_courses_placement_score_check;
    alter table public.user_courses drop column if exists placement_version;
    alter table public.user_courses drop column if exists placement_total;
    alter table public.user_courses drop column if exists placement_correct;
  end if;
end;
$$;

-- Rollback de 20261223120000_course_model (docs/MULTILINGUAL_ONBOARDING_PLAN.md §4.2). LOCAL.
--
-- Quita los RPC, los triggers, las dos columnas de profiles y las tablas courses y user_courses.
-- No toca el progreso, target_language ni start_level: el modelo anterior sigue funcionando igual.
-- Se pierde lo que sólo vive en el modelo nuevo: el nivel de los cursos que no son el activo, el
-- resultado de la prueba de nivel y el idioma de la interfaz guardado en el perfil.
-- Idempotente.

drop function if exists public.complete_onboarding_v2(text, text, text, text, smallint, text, text);
drop function if exists public.set_active_course(text);
drop function if exists public.set_course_start_level(text, text);
drop function if exists public.set_interface_language(text);

drop trigger if exists profiles_enroll_active_course on public.profiles;
drop trigger if exists profiles_sync_active_course on public.profiles;
drop function if exists public.profiles_enroll_active_course();
drop function if exists public.profiles_sync_active_course();

drop index if exists public.profiles_active_course_idx;
alter table public.profiles drop column if exists active_course_code;
alter table public.profiles drop column if exists interface_language;

drop table if exists public.user_courses;
drop table if exists public.courses;

-- Se intercalan lecciones de consolidación en cada unidad (content/path.ts). Una lección que el
-- usuario ya completó debe poder repetirse aunque ahora la preceda un repaso nuevo sin hacer.
create or replace function public.is_lesson_unlocked(p_user_id uuid, p_lesson_id text)
returns boolean
language sql
stable
set search_path = ''
as $$
  with ordered as (
    select l.id,
           lag(l.id) over (partition by u.language_code, u.level order by u.position, l.position) as previous_id
    from public.lessons l
    join public.curriculum_units u on u.id = l.unit_id
    where l.is_published and u.is_published
  )
  select exists (
    select 1 from ordered o
    where o.id = p_lesson_id
      and (o.previous_id is null
        or exists (
          select 1 from public.user_lesson_progress p
          where p.user_id = p_user_id and p.lesson_id = o.previous_id and p.times_completed > 0)
        or exists (
          select 1 from public.user_lesson_progress p
          where p.user_id = p_user_id and p.lesson_id = o.id and p.times_completed > 0))
  );
$$;

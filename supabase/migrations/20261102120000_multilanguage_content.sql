-- =====================================================================
-- Polygo · Contenido en varios idiomas (etapa 1 del plan de contenido; ver docs/CONTENT_STANDARD.md)
-- * Idiomas: chino mandarín, estado del contenido (shared/languages.ts) y Ranked por idioma.
-- * Estándar de unidad (objetivo, gramática, revisión) y de lección (introducción y cierre).
-- * Pinyin de las palabras (words.romanization).
-- * Testers de contenido: los únicos que pueden elegir un idioma en beta.
-- * set_target_language: cambiar de idioma después del registro (el progreso queda por idioma).
-- Sin sentencias destructivas: sólo columnas nuevas con default, una tabla y funciones nuevas.
-- =====================================================================

-- ---------- idiomas ----------
insert into public.languages (code, name_es, is_target_available)
values ('zh', 'Chino mandarín', false)
on conflict (code) do nothing;

-- hidden: no se muestra · soon: «Próximamente» · beta: sólo testers · available: todos.
alter table public.languages
  add column if not exists content_status text not null default 'hidden'
    check (content_status in ('hidden','soon','beta','available'));
-- Ranked / Word Rush necesitan un banco de palabras grande: se habilita idioma por idioma.
alter table public.languages
  add column if not exists ranked_available boolean not null default false;

update public.languages set
  content_status = case code
    when 'en' then 'available'
    when 'es' then 'soon'
    when 'fr' then 'hidden'
    else 'beta'
  end,
  ranked_available = (code = 'en');

-- ---------- estándar de contenido ----------
alter table public.curriculum_units add column if not exists objective_es text;
-- { "title": text, "explanation": text, "examples": [{ "target": text, "base": text }] }
alter table public.curriculum_units add column if not exists grammar jsonb;
-- Revisión lingüística por unidad (las palabras ya tienen la suya).
alter table public.curriculum_units
  add column if not exists review_status text not null default 'draft'
    check (review_status in ('draft','in_review','reviewed'));
alter table public.curriculum_units add column if not exists reviewed_by text;
alter table public.curriculum_units add column if not exists reviewed_at timestamptz;

-- Introducción antes del primer ejercicio: { "explanation": text, "examples": [{ "target", "base", "note"? }] }
alter table public.lessons add column if not exists intro jsonb;
-- Cierre: qué aprendiste («Ahora podés…»).
alter table public.lessons add column if not exists takeaways text[] not null default '{}';

-- Romanización: pinyin con marcas de tono en chino; nula en los idiomas de alfabeto latino.
alter table public.words add column if not exists romanization text;

-- ---------- testers de contenido ----------
create table if not exists public.content_testers (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.content_testers enable row level security;
revoke all on public.content_testers from public, anon, authenticated;

insert into public.content_testers (user_id)
select id from public.profiles where username = 'janitogap'
on conflict do nothing;

create or replace function public.is_content_tester()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.content_testers where user_id = auth.uid());
$$;

-- ---------- cambiar de idioma ----------
-- El progreso de cada idioma se conserva: lecciones y palabras tienen ids propios de su idioma.
-- Si el idioma tiene Ranked y no hay rating, se crea el inicial (como en handle_new_user).
create or replace function public.set_target_language(p_language text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  lang public.languages;
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into lang from public.languages where code = p_language;
  if not found or not (
    lang.content_status = 'available'
    or (lang.content_status = 'beta' and public.is_content_tester())
  ) then
    raise exception 'language_unavailable' using errcode = '22023';
  end if;

  update public.profiles set target_language = p_language
  where id = uid and onboarding_completed_at is not null
  returning * into result;
  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  if lang.ranked_available and not exists (
    select 1 from public.player_ratings where user_id = uid and language_code = p_language
  ) then
    insert into public.player_ratings (user_id, language_code) values (uid, p_language);
    insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
    select uid, p_language, s.id, 'initial', 100, 100
    from (select 1) as one
    left join public.seasons s on s.status = 'active';
  end if;

  return result;
end;
$$;

revoke all on function public.is_content_tester() from public, anon;
grant execute on function public.is_content_tester() to authenticated;
revoke all on function public.set_target_language(text) from public, anon;
grant execute on function public.set_target_language(text) to authenticated;

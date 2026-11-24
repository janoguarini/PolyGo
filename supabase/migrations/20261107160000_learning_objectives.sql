-- Objetivos de aprendizaje y sus relaciones (arquitectura de datos rev. 8, §3, §4.3, §4.5 y fase 1
-- de §18): learning_objectives, objective_concepts, lesson_objectives e item_objectives.
--
-- Sólo el esquema. Las filas salen de content/objectives.ts por los generadores de contenido
-- (scripts/catalog-sql.ts), y hoy no hay ninguna: §18 limita la fase 1 a objetivos de inglés A1 en
-- `draft` hasta la revisión pedagógica (P8), y la definición editorial (ids, actividad del MCER,
-- conceptos core/support, roles por lección) no está escrita. No se inventan objetivos, equivalencias
-- entre idiomas (group_key) ni relaciones (docs/LEARNING_CATALOG_PHASE1.md, §8).
--
-- Roles con CHECK, como item_concepts.role (excepción de docs/LEARNING_CATALOG_PHASE1.md, §3): sus
-- valores tienen efecto fijado por el diseño (§4.5), no son datos que se agreguen con un INSERT.
--
-- Aditiva e idempotente. No toca tablas existentes, el SRS v1, Ranked ni la app. Sin permisos para anon
-- ni authenticated.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/catalog.test.mjs). NO aplicada en producción.

-- 1. Objetivos (§4.5): independientes por idioma; group_key para equivalencias entre idiomas (D5).

create table if not exists public.learning_objectives (
  -- `en.a1.obj.introduce-yourself`: idioma y nivel del objetivo, `.obj.` y un slug (el `.` evita
  -- choques con ids de palabras).
  id text primary key,
  language_code text not null references public.languages (code),
  level text not null references public.ref_levels (id),
  -- Obligatoria (§4.3: la actividad del MCER vive en los objetivos).
  cefr_activity text not null references public.ref_cefr_activities (id),
  can_do_es text not null check (length(btrim(can_do_es)) > 0),
  description_es text,
  cefr_ref text,
  group_key text,
  position smallint not null check (position > 0),
  status text not null check (status in ('draft', 'active', 'retired')),
  created_at timestamptz not null default now(),
  constraint learning_objectives_id_language_code_key unique (id, language_code),
  constraint learning_objectives_group_key_language_key unique (group_key, language_code),
  constraint learning_objectives_id_check
    check (id ~ '^[a-z]{2,3}\.[a-c][12]\.obj\.[a-z0-9]+(-[a-z0-9]+)*$'
           and split_part(id, '.', 1) = language_code
           and split_part(id, '.', 2) = lower(level))
);

-- 2. Relaciones (§4.5, tabla «Relaciones»). FK compuestas con language_code: las dos puntas son del
--    idioma de la fila.

create table if not exists public.objective_concepts (
  objective_id text not null,
  concept_id text not null,
  role text not null check (role in ('core', 'support')),
  language_code text not null,
  primary key (objective_id, concept_id),
  constraint objective_concepts_objective_fkey foreign key (objective_id, language_code)
    references public.learning_objectives (id, language_code),
  constraint objective_concepts_concept_fkey foreign key (concept_id, language_code)
    references public.concepts (id, language_code)
);

create index if not exists objective_concepts_concept_idx on public.objective_concepts (concept_id);

create table if not exists public.lesson_objectives (
  lesson_id text not null references public.lessons (id),
  objective_id text not null references public.learning_objectives (id),
  role text not null check (role in ('introduce', 'practice', 'consolidate', 'assess')),
  primary key (lesson_id, objective_id)
);

create index if not exists lesson_objectives_objective_idx on public.lesson_objectives (objective_id);

create table if not exists public.item_objectives (
  item_id text not null,
  objective_id text not null,
  language_code text not null,
  primary key (item_id, objective_id),
  constraint item_objectives_item_fkey foreign key (item_id, language_code)
    references public.exercise_items (id, language_code),
  constraint item_objectives_objective_fkey foreign key (objective_id, language_code)
    references public.learning_objectives (id, language_code)
);

create index if not exists item_objectives_objective_idx on public.item_objectives (objective_id);

-- «Trigger: el idioma de la unidad de la lección = el del objetivo» (§4.5).
create or replace function public.lesson_objectives_check_language()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_lesson_language text;
  v_objective_language text;
begin
  select u.language_code into v_lesson_language
  from public.lessons l join public.curriculum_units u on u.id = l.unit_id
  where l.id = new.lesson_id;
  select o.language_code into v_objective_language
  from public.learning_objectives o where o.id = new.objective_id;
  if v_lesson_language is distinct from v_objective_language then
    raise exception 'lesson_objectives: la lección % (%) y el objetivo % (%) son de idiomas distintos',
      new.lesson_id, v_lesson_language, new.objective_id, v_objective_language
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.lesson_objectives'::regclass
      and tgname = 'lesson_objectives_check_language'
  ) then
    create trigger lesson_objectives_check_language
      before insert or update on public.lesson_objectives
      for each row execute function public.lesson_objectives_check_language();
  end if;
end;
$$;

-- 3. Seguridad: RLS sin políticas = sin acceso para anon y authenticated.

alter table public.learning_objectives enable row level security;
alter table public.objective_concepts enable row level security;
alter table public.lesson_objectives enable row level security;
alter table public.item_objectives enable row level security;

revoke all on public.learning_objectives, public.objective_concepts, public.lesson_objectives,
  public.item_objectives from anon, authenticated;

revoke execute on function public.lesson_objectives_check_language()
  from public, anon, authenticated;

-- Versiones de los ítems y vínculo de las ubicaciones (arquitectura de datos rev. 8, §5, §8, §17 y
-- fase 1 de §18). Cuarta pieza de la fase 1, después de 20261107140100_learning_items_match_pairs.sql.
--
-- Crea:
--   - exercise_item_versions: el contenido exacto que se corrigió, inmutable (un trigger rechaza todo
--     UPDATE). Unique (item_id, version), (id, item_id) y (item_id, content_hash): recargar el mismo
--     contenido no crea otra versión.
--   - exercise_items.current_version_id: FK compuesta (current_version_id, id) → versiones (id,
--     item_id), diferible: la versión vigente es siempre una versión del mismo ítem.
--   - exercises.item_id e item_version_id: FK a exercise_items y FK compuesta (item_version_id,
--     item_id) → versiones (id, item_id); una versión sin ítem se rechaza (CHECK). Índice (item_id).
--
-- Las columnas nuevas nacen nulas (migración aditiva). exercises.item_id se carga en
-- 20261107150100_learning_item_placements.sql (generada desde content/). Las versiones NO se cargan
-- todavía: grading_spec, la serialización canónica y content_hash, y qué guarda la versión de un
-- ítem generado esperan aprobación (docs/EXERCISE_ITEM_VERSIONS_PENDING.md). Hasta entonces
-- current_version_id e item_version_id quedan nulos, y pasar a NOT NULL también espera esa decisión.
--
-- Sin pg_jsonschema: el esquema de grading_spec no está aprobado, y la extensión no está instalada en
-- producción (sólo disponible) ni existe en PGlite. Esta migración no instala extensiones.
--
-- Aditiva e idempotente: no borra ni modifica filas existentes. No toca el SRS v1
-- (exercise_words, user_word_progress, apply_word_result, submit_learning_session), Ranked ni la
-- lectura de ejercicios de la app (las columnas nuevas no cambian ninguna fila ni política). Sin
-- permisos para anon ni authenticated en la tabla nueva.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/versions.test.mjs). NO aplicada en producción.

-- 1. Versiones (§5). Las columnas de contenido copian las de exercises con sus mismos tipos y
--    límites («copia exacta de lo publicado»).

create table if not exists public.exercise_item_versions (
  id bigint generated always as identity primary key,
  item_id text not null references public.exercise_items (id),
  version integer not null check (version > 0),
  content_hash text not null check (length(content_hash) > 0),
  prompt_es text not null,
  payload jsonb not null,
  answer text not null,
  accepted_answers text[] not null,
  explanation_es text,
  difficulty smallint not null check (difficulty between 1 and 5),
  recommended_seconds smallint not null check (recommended_seconds between 5 and 120),
  grading_spec jsonb not null check (jsonb_typeof(grading_spec) = 'object'),
  -- Sólo en los generados: qué función arma las opciones (§5, §9). Los dos juntos o ninguno.
  generator text,
  generator_version text,
  created_at timestamptz not null default now(),
  constraint exercise_item_versions_item_version_key unique (item_id, version),
  constraint exercise_item_versions_id_item_key unique (id, item_id),
  constraint exercise_item_versions_item_hash_key unique (item_id, content_hash),
  constraint exercise_item_versions_generator_check
    check ((generator is null) = (generator_version is null))
);

-- «inmutable: un trigger rechaza cualquier UPDATE» (§5).
create or replace function public.exercise_item_versions_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'exercise_item_versions: la versión % del ítem % es inmutable (un cambio es una versión nueva)',
    old.version, old.item_id
    using errcode = 'check_violation';
end;
$$;

-- Los escritos no tienen generador (§5: «sólo en los generados»).
create or replace function public.exercise_item_versions_check_origin()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_origin text;
begin
  select i.origin into v_origin from public.exercise_items i where i.id = new.item_id;
  if v_origin = 'authored' and new.generator is not null then
    raise exception 'exercise_item_versions: el ítem escrito % no puede tener generador', new.item_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.exercise_item_versions'::regclass
      and tgname = 'exercise_item_versions_immutable'
  ) then
    create trigger exercise_item_versions_immutable before update on public.exercise_item_versions
      for each row execute function public.exercise_item_versions_immutable();
  end if;
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.exercise_item_versions'::regclass
      and tgname = 'exercise_item_versions_check_origin'
  ) then
    create trigger exercise_item_versions_check_origin before insert on public.exercise_item_versions
      for each row execute function public.exercise_item_versions_check_origin();
  end if;
end;
$$;

-- 2. Versión vigente de cada ítem (§5): FK compuesta diferible, así la versión y su puntero se pueden
--    escribir en la misma transacción en cualquier orden.

alter table public.exercise_items add column if not exists current_version_id bigint;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercise_items'::regclass
      and conname = 'exercise_items_current_version_fkey'
  ) then
    alter table public.exercise_items
      add constraint exercise_items_current_version_fkey
      foreign key (current_version_id, id)
      references public.exercise_item_versions (id, item_id)
      deferrable initially deferred;
  end if;
end;
$$;

-- 3. Ubicaciones (§5): exercises suma el ítem y la versión que muestra.

alter table public.exercises add column if not exists item_id text;
alter table public.exercises add column if not exists item_version_id bigint;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercises'::regclass and conname = 'exercises_item_fkey'
  ) then
    alter table public.exercises
      add constraint exercises_item_fkey
      foreign key (item_id) references public.exercise_items (id);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercises'::regclass and conname = 'exercises_item_version_fkey'
  ) then
    alter table public.exercises
      add constraint exercises_item_version_fkey
      foreign key (item_version_id, item_id)
      references public.exercise_item_versions (id, item_id);
  end if;
  -- Con MATCH SIMPLE, una versión con item_id nulo no se comprobaría: se exige el ítem.
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercises'::regclass and conname = 'exercises_item_version_needs_item_check'
  ) then
    alter table public.exercises
      add constraint exercises_item_version_needs_item_check
      check (item_version_id is null or item_id is not null);
  end if;
end;
$$;

create index if not exists exercises_item_id_idx on public.exercises (item_id);

-- 4. Seguridad: RLS sin políticas = sin acceso para anon y authenticated. Las funciones sólo las usan
--    los triggers.

alter table public.exercise_item_versions enable row level security;
revoke all on public.exercise_item_versions from anon, authenticated;

revoke execute on function public.exercise_item_versions_immutable(),
  public.exercise_item_versions_check_origin()
  from public, anon, authenticated;

-- Modos de corrección de las versiones de ítems (arquitectura de datos rev. 8, §5 y §8; decisiones
-- V1, V2 y V7 aprobadas el 2026-11-08, docs/EXERCISE_ITEM_VERSIONS_PENDING.md). Va después de
-- 20261107150000_learning_item_versions.sql y antes de cargar versiones.
--
-- Crea:
--   - ref_grading_modes (id `<modo>.v<versión>`, mode, version, schema): el JSON Schema de cada modo,
--     copiado de shared/grading.ts (GRADING_MODES; supabase/tests/versions.test.mjs comprueba que es
--     el mismo texto). Inmutable: un trigger rechaza todo UPDATE, porque un esquema usado por una
--     versión no se modifica; un cambio es una fila nueva (`normalized_text.v2`).
--   - exercise_item_versions.grading_mode_id: columna generada `<mode>.v<mode_version>` del
--     grading_spec, con FK a ref_grading_modes. Así toda versión nombra un modo existente y un modo
--     usado no se puede borrar. El resto del esquema (claves exactas y sus valores) lo valida
--     TypeScript antes de escribir (content/versions.ts, gradingSpecProblems) y las pruebas.
--
-- Sin pg_jsonschema: no se instalan extensiones (V7). La tabla de versiones está vacía en producción,
-- así que agregar la columna generada no reescribe filas.
--
-- Aditiva e idempotente. No toca el SRS v1, Ranked ni la lectura de ejercicios de la app. Sin permisos
-- para anon ni authenticated.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/versions.test.mjs). NO aplicada en producción.

create table if not exists public.ref_grading_modes (
  id text primary key,
  mode text not null,
  version integer not null check (version > 0),
  schema jsonb not null check (jsonb_typeof(schema) = 'object'),
  created_at timestamptz not null default now(),
  constraint ref_grading_modes_mode_version_key unique (mode, version),
  constraint ref_grading_modes_id_check check (id = mode || '.v' || version::text)
);

create or replace function public.ref_grading_modes_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'ref_grading_modes: el modo % es inmutable (un cambio es una versión nueva del modo)', old.id
    using errcode = 'check_violation';
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.ref_grading_modes'::regclass and tgname = 'ref_grading_modes_immutable'
  ) then
    create trigger ref_grading_modes_immutable before update on public.ref_grading_modes
      for each row execute function public.ref_grading_modes_immutable();
  end if;
end;
$$;

-- Los tres modos de V1 (shared/grading.ts, GRADING_MODES). free_production no tiene modo: queda
-- bloqueado hasta que existan rúbricas editoriales.
insert into public.ref_grading_modes (id, mode, version, schema) values
  ('exact_option.v1', 'exact_option', 1,
   '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"polygo.grading.exact_option.v1","type":"object","properties":{"mode":{"const":"exact_option"},"mode_version":{"const":1}},"required":["mode","mode_version"],"additionalProperties":false}'),
  ('normalized_text.v1', 'normalized_text', 1,
   '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"polygo.grading.normalized_text.v1","type":"object","properties":{"mode":{"const":"normalized_text"},"mode_version":{"const":1},"normalizer":{"const":"polygo.answers.v1"},"typo_tolerance":{"type":"boolean"}},"required":["mode","mode_version","normalizer","typo_tolerance"],"additionalProperties":false}'),
  ('pair_set.v1', 'pair_set', 1,
   '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"polygo.grading.pair_set.v1","type":"object","properties":{"mode":{"const":"pair_set"},"mode_version":{"const":1}},"required":["mode","mode_version"],"additionalProperties":false}')
on conflict (id) do nothing;

alter table public.exercise_item_versions
  add column if not exists grading_mode_id text
  generated always as ((grading_spec ->> 'mode') || '.v' || (grading_spec ->> 'mode_version')) stored;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercise_item_versions'::regclass
      and conname = 'exercise_item_versions_grading_mode_fkey'
  ) then
    alter table public.exercise_item_versions
      add constraint exercise_item_versions_grading_mode_fkey
      foreign key (grading_mode_id) references public.ref_grading_modes (id);
  end if;
  -- Sin mode o mode_version la columna generada es nula y la FK no se comprobaría.
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercise_item_versions'::regclass
      and conname = 'exercise_item_versions_grading_mode_check'
  ) then
    alter table public.exercise_item_versions
      add constraint exercise_item_versions_grading_mode_check
      check (grading_mode_id is not null);
  end if;
end;
$$;

alter table public.ref_grading_modes enable row level security;
revoke all on public.ref_grading_modes from anon, authenticated;
revoke execute on function public.ref_grading_modes_immutable() from public, anon, authenticated;

-- Catálogo de conceptos (arquitectura de datos, rev. 8: §4.1, §4.5 y fase 1 de §18).
-- Primera pieza de la fase 1: tablas de referencia que necesitan los conceptos, la tabla
-- `concepts` y un concepto léxico por palabra (concepts.id = words.id).
--
-- Aditiva e idempotente: no borra ni modifica filas existentes. Sólo agrega a `words` la unique
-- (id, language_code), que pide la FK compuesta de concepts. No toca el SRS v1 (user_word_progress,
-- apply_word_result, submit_learning_session) ni ninguna función de la app.
--
-- Sin permisos para anon ni authenticated: nada de la app lee estas tablas todavía. Darles lectura
-- cuando haga falta es un cambio aditivo.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/concepts.test.mjs). NO aplicada en producción.

-- 1. Tablas de referencia (§4.1). Sólo las que necesitan los conceptos; las demás `ref_*` de la fase 1
--    (actividades del MCER, modos, formatos, ayudas y privacidad) van con los ítems, en otra migración.

create table if not exists public.ref_levels (
  id text primary key,
  position smallint not null unique check (position > 0)
);

create table if not exists public.ref_polygo_dimensions (
  id text primary key,
  axis text not null check (axis in ('knowledge', 'skill'))
);

create table if not exists public.ref_concept_kinds (
  id text primary key,
  knowledge_dimension text references public.ref_polygo_dimensions (id)
);

insert into public.ref_levels (id, position) values
  ('A1', 1), ('A2', 2), ('B1', 3), ('B2', 4), ('C1', 5), ('C2', 6)
on conflict (id) do nothing;

insert into public.ref_polygo_dimensions (id, axis) values
  ('vocabulary', 'knowledge'), ('grammar', 'knowledge'),
  ('comprehension', 'skill'), ('production', 'skill')
on conflict (id) do nothing;

-- Fonología y ortografía → vocabulary; pragmática → ninguna (P3).
insert into public.ref_concept_kinds (id, knowledge_dimension) values
  ('lexical', 'vocabulary'), ('phonology', 'vocabulary'), ('orthography', 'vocabulary'),
  ('grammar', 'grammar'), ('pragmatic', null)
on conflict (id) do nothing;

-- 2. Destino de la FK compuesta (word_id, language_code): la palabra es del mismo idioma que su
--    concepto. `id` ya es PK, así que la unique no cambia qué filas son válidas.

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.words'::regclass and conname = 'words_id_language_code_key'
  ) then
    alter table public.words add constraint words_id_language_code_key unique (id, language_code);
  end if;
end;
$$;

-- 3. Conceptos (§4.5).

create table if not exists public.concepts (
  id text primary key,
  language_code text not null references public.languages (code),
  kind text not null references public.ref_concept_kinds (id),
  word_id text unique,
  parent_id text,
  title_es text,
  description_es text,
  level text not null references public.ref_levels (id),
  group_key text,
  status text not null check (status in ('draft', 'active', 'retired')),
  constraint concepts_id_language_code_key unique (id, language_code),
  -- kind = 'lexical' ⇔ word_id no nulo (§4.5).
  constraint concepts_lexical_word_check check ((kind = 'lexical') = (word_id is not null)),
  -- «Léxico = id de la palabra» (§4.5).
  constraint concepts_lexical_id_check check (kind <> 'lexical' or id = word_id),
  constraint concepts_word_fkey foreign key (word_id, language_code)
    references public.words (id, language_code),
  constraint concepts_parent_fkey foreign key (parent_id, language_code)
    references public.concepts (id, language_code)
);

-- 4. Conceptos léxicos: uno por palabra (backfill de la fase 1). No se crea ninguna equivalencia
--    entre idiomas (group_key nulo) ni se fusionan palabras con el mismo texto: cada palabra es su
--    propio concepto. Nivel = el de la unidad de la palabra (§5: «en los generados, el de la
--    palabra»). Estado: activo si la palabra está publicada; P8 sólo deja en draft los objetivos y
--    los conceptos gramaticales.

insert into public.concepts (id, language_code, kind, word_id, level, status)
select w.id, w.language_code, 'lexical', w.id, u.level,
       case when w.is_published then 'active' else 'draft' end
from public.words w
join public.curriculum_units u on u.id = w.unit_id
on conflict (id) do nothing;

-- 5. Seguridad: RLS sin políticas = sin acceso para anon y authenticated. Lo usan las migraciones,
--    service_role y, más adelante, funciones security definer.

alter table public.ref_levels enable row level security;
alter table public.ref_polygo_dimensions enable row level security;
alter table public.ref_concept_kinds enable row level security;
alter table public.concepts enable row level security;

revoke all on public.ref_levels, public.ref_polygo_dimensions, public.ref_concept_kinds,
  public.concepts from anon, authenticated;

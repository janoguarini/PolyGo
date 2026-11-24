-- Ítems de aprendizaje y sus conceptos (arquitectura de datos, rev. 8: §4.1–§4.4, §4.5 «Relaciones»,
-- §5 y fase 1 de §18). Segunda pieza de la fase 1, después de 20261107120000_learning_concepts.sql.
--
-- Crea las tablas de referencia que faltaban (actividades del MCER, modos, pares modo–formato,
-- ayudas y privacidad), `exercise_items` e `item_concepts`. Las filas de ítems y de sus conceptos no
-- se escriben acá: las generan los scripts de contenido desde content/ (§3: «Migraciones generadas
-- desde content/»), en las migraciones *_learning_items_<idioma>.sql y en cada migración de
-- contenido nueva.
--
-- Aditiva e idempotente: no borra ni modifica filas existentes ni toca tablas existentes. No toca el
-- SRS v1 (exercise_words, user_word_progress, apply_word_result, submit_learning_session) ni ninguna
-- función de la app. Sin permisos para anon ni authenticated.
--
-- Pendiente (fuera de esta pieza, ver el informe de la fase 1):
--   - exercise_item_versions y, con ella, exercise_items.current_version_id (FK compuesta diferible a
--     las versiones) y exercises.item_id / item_version_id. La columna se agrega con la tabla de
--     versiones: agregar una columna es aditivo.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/items.test.mjs). NO aplicada en producción.

-- 1. Tablas de referencia (§4.1).

create table if not exists public.ref_cefr_activities (
  id text primary key,
  direction text not null check (direction in ('reception', 'production', 'interaction', 'mediation'))
);

insert into public.ref_cefr_activities (id, direction) values
  ('listening', 'reception'), ('reading', 'reception'),
  ('speaking', 'production'), ('writing', 'production'),
  ('interaction', 'interaction'), ('mediation', 'mediation')
on conflict (id) do nothing;

-- §4.2. `retrieval_rank` es nulo en los modos de comprensión (la tabla no les asigna rango). Un modo
-- alimenta como máximo una dimensión de habilidad (§4.3: «como máximo … una de habilidad»).
create table if not exists public.ref_assessment_modes (
  id text primary key,
  retrieval_rank smallint unique check (retrieval_rank > 0),
  feeds_comprehension boolean not null,
  feeds_production boolean not null,
  constraint ref_assessment_modes_one_skill_check check (not (feeds_comprehension and feeds_production))
);

insert into public.ref_assessment_modes (id, retrieval_rank, feeds_comprehension, feeds_production) values
  ('recognition', 1, false, false),
  ('cued_recall', 2, false, false),
  ('guided_construction', 3, false, false),
  ('free_recall', 4, false, false),
  ('controlled_production', 5, false, true),
  ('free_production', 6, false, true),
  ('listening_comprehension', null, true, false),
  ('reading_comprehension', null, true, false)
on conflict (id) do nothing;

-- Pares válidos (modo, formato de respuesta): columna «Formatos válidos» de §4.2. Impide, por
-- ejemplo, «producción con opciones».
create table if not exists public.ref_mode_formats (
  assessment_mode text not null references public.ref_assessment_modes (id),
  response_format text not null,
  primary key (assessment_mode, response_format)
);

insert into public.ref_mode_formats (assessment_mode, response_format) values
  ('recognition', 'select'), ('recognition', 'pairs'),
  ('cued_recall', 'typed'),
  ('guided_construction', 'tiles'),
  ('free_recall', 'typed'), ('free_recall', 'speech'),
  ('controlled_production', 'typed'), ('controlled_production', 'speech'),
  ('free_production', 'typed'), ('free_production', 'speech'),
  ('listening_comprehension', 'select'), ('listening_comprehension', 'typed'),
  ('reading_comprehension', 'select'), ('reading_comprehension', 'typed')
on conflict do nothing;

-- §7.1 (D9). `optional`: lo elige el usuario. Todas las de hoy lo son: D9 registra «las que existen
-- hoy en la interfaz y el usuario elige usar», más `hints_revealed`, reservada.
create table if not exists public.ref_assists (
  id text primary key,
  optional boolean not null
);

insert into public.ref_assists (id, optional) values
  ('audio_replays', true), ('slow_audio_plays', true), ('prompt_audio_plays', true),
  ('reading_visible', true), ('reading_toggles', true), ('hints_revealed', true)
on conflict (id) do nothing;

-- §4.1 y §13.2. No existe un valor para datos personales reales (P4).
create table if not exists public.ref_response_privacy (
  id text primary key,
  retention_months smallint not null check (retention_months > 0)
);

insert into public.ref_response_privacy (id, retention_months) values
  ('closed', 24), ('fictional', 24), ('open_text', 24)
on conflict (id) do nothing;

-- 2. Ítems (§5). Qué evalúa un ejercicio: tipo, modo y conceptos. Escritos: el id actual congelado
--    (a1-u01-l01-e03); generados: plantilla determinista (en.gen.translate_write.en-hello).

create table if not exists public.exercise_items (
  id text primary key,
  language_code text not null references public.languages (code),
  -- Nivel curricular: el de la unidad de la lección; en los generados, el de la palabra. Inmutable.
  level text not null references public.ref_levels (id),
  origin text not null check (origin in ('authored', 'generated')),
  -- Los de shared/exercises.ts (los mismos que el CHECK de exercises.type).
  type text not null check (type in (
    'image_choice', 'translation_choice', 'translate_write', 'complete_word', 'fill_blank',
    'order_words', 'listen_choice', 'match_pairs', 'short_answer')),
  assessment_mode text not null,
  response_format text not null,
  -- Sin CHECK: la valida la FK a ref_input_modalities (20261107140000_learning_ref_input_modalities.sql,
  -- §4.1; docs/LEARNING_CATALOG_PHASE1.md §3).
  input_modality text not null,
  cefr_activity text references public.ref_cefr_activities (id),
  response_privacy text not null references public.ref_response_privacy (id),
  status text not null check (status in ('draft', 'active', 'retired')),
  created_at timestamptz not null default now(),
  retired_at timestamptz,
  constraint exercise_items_id_language_code_key unique (id, language_code),
  constraint exercise_items_mode_format_fkey foreign key (assessment_mode, response_format)
    references public.ref_mode_formats (assessment_mode, response_format)
);

-- «Cambia cuando: nunca. Si cambia el modo, los conceptos target o la privacidad, es un ítem nuevo»
-- (§5); el nivel es inmutable porque define el alcance de la compactación (§13.5).
create or replace function public.exercise_items_identity_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.id, new.language_code, new.level, new.origin, new.type, new.assessment_mode,
      new.response_format, new.response_privacy)
     is distinct from
     (old.id, old.language_code, old.level, old.origin, old.type, old.assessment_mode,
      old.response_format, old.response_privacy) then
    raise exception 'exercise_items_identity: el ítem % no puede cambiar de idioma, nivel, origen, tipo, modo, formato ni privacidad (es un ítem nuevo)', old.id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

-- Sin DROP (§18): el trigger se crea sólo si no existe.
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.exercise_items'::regclass and tgname = 'exercise_items_identity_guard'
  ) then
    create trigger exercise_items_identity_guard before update on public.exercise_items
      for each row execute function public.exercise_items_identity_guard();
  end if;
end;
$$;

-- 3. Conceptos de cada ítem (§4.5 «Relaciones»). Las FK compuestas obligan a que el ítem y el
--    concepto sean del idioma de la fila.

create table if not exists public.item_concepts (
  item_id text not null,
  concept_id text not null,
  dimension text not null references public.ref_polygo_dimensions (id),
  role text not null check (role in ('target', 'context', 'distractor')),
  language_code text not null,
  primary key (item_id, concept_id, dimension),
  constraint item_concepts_item_fkey foreign key (item_id, language_code)
    references public.exercise_items (id, language_code),
  constraint item_concepts_concept_fkey foreign key (concept_id, language_code)
    references public.concepts (id, language_code)
);

create index if not exists item_concepts_concept_dimension_idx
  on public.item_concepts (concept_id, dimension);

-- Regla de derivación de §4.3, validada contra el modo del ítem:
--   1. cada concepto target da una fila con la dimensión de conocimiento de su tipo (pragmática: ninguna);
--   2. si el modo alimenta comprehension o production, también una fila en esa dimensión;
--   3. los conceptos context y distractor no dan filas.
-- Se valida el ítem completo (también que no falte ninguna fila), así que el trigger es diferido: se
-- comprueba al confirmar la transacción, cuando ya se insertaron todas las filas del ítem.
create or replace function public.item_concepts_rule_violation(p_item_id text)
returns text
language sql
stable
set search_path = ''
as $$
  with item as (
    select i.id, m.feeds_comprehension, m.feeds_production
    from public.exercise_items i
    join public.ref_assessment_modes m on m.id = i.assessment_mode
    where i.id = p_item_id
  ),
  actual as (
    select ic.concept_id, ic.dimension from public.item_concepts ic
    where ic.item_id = p_item_id and ic.role = 'target'
  ),
  expected as (
    select c.id as concept_id, d.dimension
    from item
    join public.concepts c on c.id in (select a.concept_id from actual a)
    join public.ref_concept_kinds k on k.id = c.kind
    cross join lateral (values
      (k.knowledge_dimension),
      (case when item.feeds_comprehension then 'comprehension'
            when item.feeds_production then 'production' end)
    ) as d (dimension)
    where d.dimension is not null
  ),
  wrong as (
    (select concept_id, dimension, 'sobra' as what from actual
     except select concept_id, dimension, 'sobra' from expected)
    union all
    (select concept_id, dimension, 'falta' from expected
     except select concept_id, dimension, 'falta' from actual)
  )
  select coalesce(
    (select 'rol ' || ic.role || ' en ' || ic.concept_id || '/' || ic.dimension
     from public.item_concepts ic
     where ic.item_id = p_item_id and ic.role <> 'target'
     order by ic.concept_id, ic.dimension limit 1),
    (select w.what || ' ' || w.concept_id || '/' || w.dimension from wrong w
     order by w.what, w.concept_id, w.dimension limit 1)
  )
  where exists (select 1 from item);
$$;

create or replace function public.item_concepts_check_rule()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_items text[];
  v_item text;
  v_problem text;
begin
  v_items := case tg_op
    when 'INSERT' then array[new.item_id]
    when 'DELETE' then array[old.item_id]
    else array[new.item_id, old.item_id]
  end;
  foreach v_item in array v_items loop
    v_problem := public.item_concepts_rule_violation(v_item);
    if v_problem is not null then
      raise exception 'item_concepts_rule: el ítem % no cumple la regla de §4.3 (%)', v_item, v_problem
        using errcode = 'check_violation';
    end if;
  end loop;
  return null;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.item_concepts'::regclass and tgname = 'item_concepts_check_rule'
  ) then
    create constraint trigger item_concepts_check_rule
      after insert or update or delete on public.item_concepts
      deferrable initially deferred
      for each row execute function public.item_concepts_check_rule();
  end if;
end;
$$;

-- 4. Seguridad: RLS sin políticas = sin acceso para anon y authenticated (igual que concepts). Las
--    funciones de validación sólo las usa el trigger.

alter table public.ref_cefr_activities enable row level security;
alter table public.ref_assessment_modes enable row level security;
alter table public.ref_mode_formats enable row level security;
alter table public.ref_assists enable row level security;
alter table public.ref_response_privacy enable row level security;
alter table public.exercise_items enable row level security;
alter table public.item_concepts enable row level security;

revoke all on public.ref_cefr_activities, public.ref_assessment_modes, public.ref_mode_formats,
  public.ref_assists, public.ref_response_privacy, public.exercise_items, public.item_concepts
  from anon, authenticated;

revoke execute on function public.exercise_items_identity_guard(),
  public.item_concepts_rule_violation(text), public.item_concepts_check_rule()
  from public, anon, authenticated;

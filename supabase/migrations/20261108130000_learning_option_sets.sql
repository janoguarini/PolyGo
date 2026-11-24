-- Conjuntos de opciones inmutables, historia de asignación y presentaciones (arquitectura de datos
-- rev. 8, §5, §7.1 y §9; decisiones V5.1–V5.3 aprobadas el 2026-11-08,
-- docs/EXERCISE_ITEM_VERSIONS_PENDING.md §5). Va después de las versiones
-- (20261108120101…04_learning_item_versions_<idioma>.sql) y antes de cargar los conjuntos
-- (20261108130101…04_learning_option_sets_<idioma>.sql, generadas).
--
-- Separa tres cosas:
--   1. exercise_item_versions (ya existe): contenido principal y corrección del ítem. En los 176 ítems
--      de distractores variables (content/variable-options.ts) no incluye payload.options (V5 (a)).
--   2. exercise_option_sets: la fotografía exacta de las opciones de un ítem de elección
--      (exact_option), con el texto literal y lo que se dibuja con él (formato polygo.options.v1,
--      content/option-sets.ts). Inmutable: un trigger rechaza UPDATE, DELETE y TRUNCATE. Una por
--      (versión, options_hash). origin: catalog (ubicación publicada) o session (distractores que el
--      servidor elige en una sesión, V5.3).
--      exercises.option_set_id: el conjunto vigente de cada ubicación (FK compuesta con su versión).
--      exercise_option_set_assignments: historia de asignación, sólo inserciones. La escribe un trigger
--      de exercises cada vez que cambia option_set_id, así ningún escritor puede saltársela.
--   3. exercise_presentations: lo que se mostró, registrado al mostrarse (aunque no haya respuesta):
--      versión, conjunto, orden exacto (option_order, la fuente de verdad), algoritmo de mezcla y
--      semilla como metadatos, y la ubicación cuando la hay. Sin UPDATE; DELETE sólo en cascada.
--      exercise_attempt_presentations: el intento referencia la presentación que recibió. Tabla
--      aparte para no tocar exercise_attempts ni submit_learning_session (SRS v1).
--      exercise_attempt_reconstruction (vista): los intentos sin presentación quedan identificados
--      como no reconstruibles; no se les inventa nada (V5.2).
--      exercise_presentation_snapshot(id): reconstruye una presentación leyendo sólo tablas
--      inmutables (presentación, versión y conjunto), nunca exercises ni words.
--
-- Sin FK de las presentaciones a learning_sessions: en la ruta actual la sesión se inserta recién al
-- enviar (submit_learning_session), después de mostrar los ejercicios. La FK llega con la sesión
-- iniciada por el servidor (fase 2, §9).
--
-- Aditiva e idempotente: no borra ni modifica filas existentes (las columnas nuevas nacen nulas). No
-- toca exercise_attempts, el SRS v1 (exercise_words, user_word_progress, apply_word_result,
-- submit_learning_session), Ranked ni la lectura de ejercicios de la app. Sin permisos para anon ni
-- authenticated en las tablas, la vista ni las funciones nuevas.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/presentations.test.mjs). NO aplicada en
-- producción.

-- 1. Algoritmos de mezcla (metadato de la presentación). Inmutables: un cambio es una fila nueva.

create table if not exists public.ref_shuffle_algorithms (
  id text primary key check (id ~ '^polygo\.shuffle\.v[1-9][0-9]*$'),
  description text not null,
  created_at timestamptz not null default now()
);

insert into public.ref_shuffle_algorithms (id, description) values
  ('polygo.shuffle.v1',
   'FNV-1a de 32 bits sobre las unidades UTF-16 de la semilla, mulberry32 y Fisher-Yates desde el final (shared/shuffle.ts, igual a shuffle de src/features/learning/random.ts). Semilla de la app: <session_id>:<exercise_id>.')
on conflict (id) do nothing;

-- 2. Conjuntos de opciones.

create table if not exists public.exercise_option_sets (
  id bigint generated always as identity primary key,
  item_id text not null,
  item_version_id bigint not null,
  options_hash text not null check (options_hash ~ '^v1:[0-9a-f]{64}$'),
  format text not null check (format = 'polygo.options.v1'),
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  answer_index smallint not null check (answer_index >= 0),
  origin text not null check (origin in ('catalog', 'session')),
  generator text,
  generator_version text,
  created_at timestamptz not null default now(),
  constraint exercise_option_sets_version_fkey
    foreign key (item_version_id, item_id) references public.exercise_item_versions (id, item_id),
  constraint exercise_option_sets_version_hash_key unique (item_version_id, options_hash),
  constraint exercise_option_sets_id_version_key unique (id, item_version_id),
  constraint exercise_option_sets_generator_check
    check ((generator is null) = (generator_version is null))
);

create index if not exists exercise_option_sets_item_idx on public.exercise_option_sets (item_id);

-- Rechaza UPDATE, DELETE y TRUNCATE (conjuntos, asignaciones y algoritmos).
create or replace function public.learning_append_only()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '%: las filas son inmutables (% rechazado; un cambio es una fila nueva)',
    tg_table_name, tg_op
    using errcode = 'check_violation';
end;
$$;

-- Formato polygo.options.v1 y coherencia con la versión (content/option-sets.ts).
create or replace function public.exercise_option_sets_check()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v public.exercise_item_versions;
  v_origin text;
  v_n integer := jsonb_array_length(new.options);
  v_bad integer;
begin
  select * into v from public.exercise_item_versions where id = new.item_version_id;
  select origin into v_origin from public.exercise_items where id = new.item_id;
  if v.grading_mode_id is distinct from 'exact_option.v1' then
    raise exception 'exercise_option_sets: la versión % no es de elección (%)', new.item_version_id, v.grading_mode_id
      using errcode = 'check_violation';
  end if;
  if v_n not between 2 and 8 or new.answer_index >= v_n then
    raise exception 'exercise_option_sets: % opciones y respuesta en %', v_n, new.answer_index
      using errcode = 'check_violation';
  end if;
  -- Cada opción: exactamente text (no vacío), reading (null o segmentos {text, reading}), audio e
  -- image (null en v1).
  select count(*) into v_bad
  from jsonb_array_elements(new.options) o
  where jsonb_typeof(o) <> 'object'
     or (select array_agg(k order by k) from jsonb_object_keys(o) k) <> array['audio', 'image', 'reading', 'text']
     or jsonb_typeof(o -> 'text') <> 'string' or length(o ->> 'text') = 0
     or jsonb_typeof(o -> 'audio') <> 'null' or jsonb_typeof(o -> 'image') <> 'null'
     or (jsonb_typeof(o -> 'reading') <> 'null'
         and (jsonb_typeof(o -> 'reading') <> 'array'
              or jsonb_array_length(o -> 'reading') = 0
              or exists (
                select 1 from jsonb_array_elements(o -> 'reading') r
                where jsonb_typeof(r) <> 'object'
                   or (select array_agg(k order by k) from jsonb_object_keys(r) k) <> array['reading', 'text']
                   or jsonb_typeof(r -> 'text') <> 'string'
                   or jsonb_typeof(r -> 'reading') not in ('string', 'null'))
              or (select string_agg(r ->> 'text', '' order by n) from jsonb_array_elements(o -> 'reading')
                    with ordinality as t(r, n)) <> o ->> 'text'));
  if v_bad > 0 then
    raise exception 'exercise_option_sets: % opciones fuera del formato polygo.options.v1', v_bad
      using errcode = 'check_violation';
  end if;
  if (select count(distinct o ->> 'text') from jsonb_array_elements(new.options) o) <> v_n then
    raise exception 'exercise_option_sets: opciones repetidas' using errcode = 'check_violation';
  end if;
  if new.options -> new.answer_index::integer ->> 'text' is distinct from v.answer then
    raise exception 'exercise_option_sets: la opción % no es la respuesta de la versión %', new.answer_index, v.id
      using errcode = 'check_violation';
  end if;
  -- Si la versión guarda sus opciones, el conjunto son esas mismas, en el mismo orden. Las de
  -- distractores variables (V5 (a)) y las de generados de elección nuevos las tienen fuera.
  if v.payload ? 'options'
     and (select jsonb_agg(o -> 'text' order by n) from jsonb_array_elements(new.options) with ordinality as t(o, n))
         is distinct from v.payload -> 'options' then
    raise exception 'exercise_option_sets: las opciones no son las de la versión %', v.id
      using errcode = 'check_violation';
  end if;
  if v_origin = 'authored' and new.generator is not null then
    raise exception 'exercise_option_sets: el ítem escrito % no puede tener generador', new.item_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

-- 3. Conjunto vigente de cada ubicación e historia de asignación.

alter table public.exercises add column if not exists option_set_id bigint;

create table if not exists public.exercise_option_set_assignments (
  id bigint generated always as identity primary key,
  exercise_id text not null references public.exercises (id),
  item_id text not null,
  item_version_id bigint not null,
  option_set_id bigint not null,
  assigned_at timestamptz not null default now(),
  constraint exercise_option_set_assignments_set_fkey
    foreign key (option_set_id, item_version_id)
    references public.exercise_option_sets (id, item_version_id),
  constraint exercise_option_set_assignments_version_fkey
    foreign key (item_version_id, item_id) references public.exercise_item_versions (id, item_id)
);

create index if not exists exercise_option_set_assignments_exercise_idx
  on public.exercise_option_set_assignments (exercise_id, id);

-- Cada vez que una ubicación recibe un conjunto distinto, una fila nueva (la anterior queda). Copia
-- la versión y el ítem del conjunto, que son los suyos.
create or replace function public.exercises_record_option_set()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.option_set_id is not null
     and (tg_op = 'INSERT' or new.option_set_id is distinct from old.option_set_id) then
    insert into public.exercise_option_set_assignments (exercise_id, item_id, item_version_id, option_set_id)
    select new.id, s.item_id, s.item_version_id, s.id
    from public.exercise_option_sets s where s.id = new.option_set_id;
  end if;
  return null;
end;
$$;

-- Con MATCH SIMPLE, un conjunto con item_version_id nulo no se comprobaría: al confirmar, un conjunto
-- exige versión (diferido, porque la carga cambia versión y conjunto en sentencias separadas).
create or replace function public.exercises_option_set_needs_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (select 1 from public.exercises e
             where e.id = new.id and e.option_set_id is not null and e.item_version_id is null) then
    raise exception 'exercises: la ubicación % tiene conjunto de opciones sin versión', new.id
      using errcode = 'check_violation';
  end if;
  return null;
end;
$$;

-- 4. Presentaciones.

create table if not exists public.exercise_presentations (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  session_id uuid not null,
  position smallint check (position between 1 and 1000),
  item_id text not null,
  item_version_id bigint not null,
  exercise_id text references public.exercises (id),
  option_set_id bigint,
  option_order smallint[],
  shuffle_algorithm text references public.ref_shuffle_algorithms (id),
  shuffle_seed text check (char_length(shuffle_seed) between 1 and 200),
  presented_at timestamptz not null default now(),
  constraint exercise_presentations_version_fkey
    foreign key (item_version_id, item_id) references public.exercise_item_versions (id, item_id),
  constraint exercise_presentations_set_fkey
    foreign key (option_set_id, item_version_id)
    references public.exercise_option_sets (id, item_version_id),
  constraint exercise_presentations_id_user_session_key unique (id, user_id, session_id),
  constraint exercise_presentations_order_check check ((option_set_id is null) = (option_order is null)),
  constraint exercise_presentations_shuffle_check
    check ((option_order is null) = (shuffle_algorithm is null)
           and (shuffle_seed is null or shuffle_algorithm is not null))
);

create index if not exists exercise_presentations_user_idx
  on public.exercise_presentations (user_id, presented_at desc);
create index if not exists exercise_presentations_session_idx on public.exercise_presentations (session_id);
create index if not exists exercise_presentations_version_idx on public.exercise_presentations (item_version_id);
create index if not exists exercise_presentations_set_idx
  on public.exercise_presentations (option_set_id) where option_set_id is not null;
create index if not exists exercise_presentations_exercise_idx
  on public.exercise_presentations (exercise_id) where exercise_id is not null;

-- Lo que se registra tiene que ser lo que se pudo mostrar: un conjunto si y sólo si el ítem es de
-- elección, un orden que es una permutación de sus opciones, y en una ubicación su versión y su
-- conjunto vigentes. La hora es la del servidor.
create or replace function public.exercise_presentations_check()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_mode text;
  v_n integer;
  e public.exercises;
begin
  new.presented_at := now();
  select grading_mode_id into v_mode from public.exercise_item_versions where id = new.item_version_id;
  if (v_mode = 'exact_option.v1') <> (new.option_set_id is not null) then
    raise exception 'exercise_presentations: un ítem de elección lleva conjunto de opciones y sólo él (%)', v_mode
      using errcode = 'check_violation';
  end if;
  if new.option_set_id is not null then
    select jsonb_array_length(options) into v_n from public.exercise_option_sets where id = new.option_set_id;
    if array_ndims(new.option_order) is distinct from 1
       or array_lower(new.option_order, 1) <> 1
       or array_position(new.option_order, null) is not null
       or (select array_agg(x order by x) from unnest(new.option_order) x)
          is distinct from (select array_agg(g::smallint order by g) from generate_series(0, v_n - 1) g) then
      raise exception 'exercise_presentations: el orden % no es una permutación de las % opciones', new.option_order, v_n
        using errcode = 'check_violation';
    end if;
  end if;
  if new.exercise_id is not null then
    select * into e from public.exercises where id = new.exercise_id;
    if e.item_id is distinct from new.item_id
       or e.item_version_id is distinct from new.item_version_id
       or e.option_set_id is distinct from new.option_set_id then
      raise exception 'exercise_presentations: la ubicación % no muestra hoy esa versión y ese conjunto', new.exercise_id
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

-- Sin UPDATE nunca. DELETE sólo en cascada (borrado de la cuenta; más adelante, la compactación del
-- nivel por su vía privilegiada, §13.9): un DELETE directo llega con pg_trigger_depth() = 1.
create or replace function public.learning_delete_only_cascade()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' and pg_trigger_depth() > 1 then
    return old;
  end if;
  raise exception '%: las filas son inmutables (% rechazado; sólo se eliminan en cascada)', tg_table_name, tg_op
    using errcode = 'check_violation';
end;
$$;

-- 5. Intento → presentación. Un intento referencia una presentación del mismo usuario, la misma sesión
--    y la misma ubicación, mostrada antes de responder. Una presentación puede tener varios intentos.

create table if not exists public.exercise_attempt_presentations (
  attempt_id bigint primary key references public.exercise_attempts (id) on delete cascade,
  presentation_id bigint not null references public.exercise_presentations (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists exercise_attempt_presentations_presentation_idx
  on public.exercise_attempt_presentations (presentation_id);

create or replace function public.exercise_attempt_presentations_check()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  a public.exercise_attempts;
  p public.exercise_presentations;
begin
  select * into a from public.exercise_attempts where id = new.attempt_id;
  select * into p from public.exercise_presentations where id = new.presentation_id;
  if a.user_id is distinct from p.user_id or a.session_id is distinct from p.session_id
     or a.exercise_id is distinct from p.exercise_id or a.created_at < p.presented_at then
    raise exception 'exercise_attempt_presentations: el intento % no es de la presentación %', new.attempt_id, new.presentation_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

do $$
declare
  t record;
begin
  for t in select * from (values
    ('ref_shuffle_algorithms', 'ref_shuffle_algorithms_append_only', 'before update or delete', 'row', 'learning_append_only'),
    ('ref_shuffle_algorithms', 'ref_shuffle_algorithms_no_truncate', 'before truncate', 'statement', 'learning_append_only'),
    ('exercise_option_sets', 'exercise_option_sets_check', 'before insert', 'row', 'exercise_option_sets_check'),
    ('exercise_option_sets', 'exercise_option_sets_append_only', 'before update or delete', 'row', 'learning_append_only'),
    ('exercise_option_sets', 'exercise_option_sets_no_truncate', 'before truncate', 'statement', 'learning_append_only'),
    ('exercise_option_set_assignments', 'exercise_option_set_assignments_append_only', 'before update or delete', 'row', 'learning_append_only'),
    ('exercise_option_set_assignments', 'exercise_option_set_assignments_no_truncate', 'before truncate', 'statement', 'learning_append_only'),
    ('exercises', 'exercises_record_option_set', 'after insert or update of option_set_id', 'row', 'exercises_record_option_set'),
    ('exercise_presentations', 'exercise_presentations_check', 'before insert', 'row', 'exercise_presentations_check'),
    ('exercise_presentations', 'exercise_presentations_immutable', 'before update or delete', 'row', 'learning_delete_only_cascade'),
    ('exercise_presentations', 'exercise_presentations_no_truncate', 'before truncate', 'statement', 'learning_delete_only_cascade'),
    ('exercise_attempt_presentations', 'exercise_attempt_presentations_check', 'before insert', 'row', 'exercise_attempt_presentations_check'),
    ('exercise_attempt_presentations', 'exercise_attempt_presentations_immutable', 'before update or delete', 'row', 'learning_delete_only_cascade'),
    ('exercise_attempt_presentations', 'exercise_attempt_presentations_no_truncate', 'before truncate', 'statement', 'learning_delete_only_cascade')
  ) as x(tbl, name, timing, level, fn)
  loop
    if not exists (select 1 from pg_trigger
                   where tgrelid = ('public.' || t.tbl)::regclass and tgname = t.name) then
      execute format('create trigger %I %s on public.%I for each %s execute function public.%I()',
                     t.name, t.timing, t.tbl, t.level, t.fn);
    end if;
  end loop;

  if not exists (select 1 from pg_trigger
                 where tgrelid = 'public.exercises'::regclass and tgname = 'exercises_option_set_needs_version') then
    create constraint trigger exercises_option_set_needs_version
      after insert or update of option_set_id, item_version_id on public.exercises
      deferrable initially deferred
      for each row execute function public.exercises_option_set_needs_version();
  end if;

  -- Diferible: la carga cambia la versión de una ubicación y su conjunto en sentencias separadas.
  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.exercises'::regclass and conname = 'exercises_option_set_fkey') then
    alter table public.exercises
      add constraint exercises_option_set_fkey
      foreign key (option_set_id, item_version_id)
      references public.exercise_option_sets (id, item_version_id)
      deferrable initially deferred;
  end if;
end;
$$;

-- 6. Reconstrucción.

-- Un intento es reconstruible si y sólo si referencia una presentación registrada. Los anteriores
-- (todo el histórico: no existía ningún registro inmutable de lo mostrado) quedan identificados como
-- no reconstruibles, sin tocarlos ni inventarles opciones ni orden (V5.2).
create or replace view public.exercise_attempt_reconstruction
with (security_invoker = true) as
select a.id as attempt_id, a.user_id, a.session_id, a.exercise_id, a.created_at, l.presentation_id,
  case when l.presentation_id is null then 'not_reconstructible' else 'reconstructible' end as status,
  case when l.presentation_id is null then 'no_presentation_record' end as reason
from public.exercise_attempts a
left join public.exercise_attempt_presentations l on l.attempt_id = a.id;

-- La presentación completa desde tablas inmutables (presentación, versión, conjunto): nunca lee
-- exercises, words ni exercise_items. options_shown son las opciones del conjunto en el orden
-- registrado.
create or replace function public.exercise_presentation_snapshot(p_presentation_id bigint)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'presentation_id', p.id,
    'user_id', p.user_id,
    'session_id', p.session_id,
    'position', p.position,
    'exercise_id', p.exercise_id,
    'presented_at', p.presented_at,
    'item_id', p.item_id,
    'item_version_id', v.id,
    'version', v.version,
    'content_hash', v.content_hash,
    'prompt_es', v.prompt_es,
    'payload', v.payload,
    'answer', v.answer,
    'accepted_answers', to_jsonb(v.accepted_answers),
    'explanation_es', v.explanation_es,
    'difficulty', v.difficulty,
    'recommended_seconds', v.recommended_seconds,
    'grading_spec', v.grading_spec,
    'option_set_id', s.id,
    'options_hash', s.options_hash,
    'format', s.format,
    'answer_index', s.answer_index,
    'option_order', to_jsonb(p.option_order),
    'options_shown', (
      select jsonb_agg(s.options -> o.idx::integer order by o.pos)
      from unnest(p.option_order) with ordinality as o(idx, pos)
    ),
    'shuffle_algorithm', p.shuffle_algorithm,
    'shuffle_seed', p.shuffle_seed)
  from public.exercise_presentations p
  join public.exercise_item_versions v on v.id = p.item_version_id
  left join public.exercise_option_sets s on s.id = p.option_set_id
  where p.id = p_presentation_id
$$;

-- 7. Seguridad: RLS sin políticas = sin acceso para anon y authenticated (lo escribe el servidor).

alter table public.ref_shuffle_algorithms enable row level security;
alter table public.exercise_option_sets enable row level security;
alter table public.exercise_option_set_assignments enable row level security;
alter table public.exercise_presentations enable row level security;
alter table public.exercise_attempt_presentations enable row level security;

revoke all on public.ref_shuffle_algorithms, public.exercise_option_sets,
  public.exercise_option_set_assignments, public.exercise_presentations,
  public.exercise_attempt_presentations, public.exercise_attempt_reconstruction
  from anon, authenticated;

revoke execute on function public.learning_append_only(), public.exercise_option_sets_check(),
  public.exercises_record_option_set(), public.exercises_option_set_needs_version(),
  public.exercise_presentations_check(), public.learning_delete_only_cascade(),
  public.exercise_attempt_presentations_check(), public.exercise_presentation_snapshot(bigint)
  from public, anon, authenticated;

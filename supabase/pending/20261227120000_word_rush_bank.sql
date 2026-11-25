-- =====================================================================
-- Banco propio de Word Rush (Fase 5). 2026-11-24. NO APLICADA: archivo local, sin autorización para
-- ejecutarse. Vive en supabase/pending/ (no en migrations/) para que la integración GitHub–Supabase no
-- la aplique sola.
--
-- Qué crea (sólo estructura; los datos van en 20261227120100_word_rush_bank_data.sql):
--   1. public.word_rush_sentences: frases nuevas para Sentence Rush que NO están en las lecciones.
--   2. public.word_rush_exercise_variants: otros órdenes correctos de ejercicios order_words existentes,
--      sólo para Word Rush. NO cambia exercises.accepted_answers: las lecciones corrigen igual que antes.
--
-- Acceso: sólo el servidor de partidas (service_role, que salta RLS). RLS activado sin políticas y sin
-- privilegios para anon/authenticated: la app no lee ni escribe estas tablas (las frases llevan la
-- respuesta). Ni los desafíos con amigos ni las lecciones las usan.
--
-- No toca ninguna tabla, función ni dato existente. Idempotente en estructura (if not exists).
-- Rollback: supabase/rollback/20261227120000_word_rush_bank.down.sql.
-- Doc: docs/WORD_RUSH_CONTENT.md §8.
-- =====================================================================

-- ---------- 1. Frases nuevas ----------
create table if not exists public.word_rush_sentences (
  -- Estable: `<idioma>.wr.<slug>` (content/word-rush/*.ts). Distinto de los ids de exercises (sin
  -- puntos), así nunca choca con una frase de lección en RecentContentMemory ni en la partida.
  id text primary key check (id ~ '^[a-z]{2}\.wr\.[a-z0-9-]+$'),
  language_code text not null references public.languages (code),
  -- Mismo CHECK que curriculum_units.level. Redundante con la unidad a propósito (consultas y control),
  -- y el trigger de abajo impide que no coincida.
  level text not null check (level in ('A1', 'A2')),
  -- Unidad desde la que se puede mostrar: el filtro por jugador (rush_common_unit_ids) usa este id.
  unit_id text not null references public.curriculum_units (id) on delete cascade,
  -- Fichas en el orden correcto (como exercises.payload.tokens de order_words).
  tokens text[] not null check (
    cardinality(tokens) between 2 and 12
    and array_position(tokens, null) is null
    and array_position(tokens, '') is null
  ),
  -- Respuesta canónica (como exercises.answer). En chino, sin espacios entre caracteres.
  answer text not null check (btrim(answer) <> ''),
  -- Otros órdenes igual de correctos, con las mismas fichas (como exercises.accepted_answers).
  accepted_answers text[] not null default '{}' check (
    array_position(accepted_answers, null) is null
    and array_position(accepted_answers, '') is null
  ),
  -- Consigna en el idioma de apoyo del curso (como payload.translation).
  translation text not null check (btrim(translation) <> ''),
  -- El servidor sólo lee las publicadas.
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Sin la misma frase dos veces en un curso.
  unique (language_code, answer)
);

create index if not exists word_rush_sentences_language_idx
  on public.word_rush_sentences (language_code) where is_published;
create index if not exists word_rush_sentences_unit_idx
  on public.word_rush_sentences (unit_id);

-- El idioma y el nivel tienen que ser los de la unidad.
create or replace function public.word_rush_sentences_check_unit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  u record;
begin
  select language_code, level into u from public.curriculum_units where id = new.unit_id;
  if not found then
    raise exception 'word_rush_sentences %: unidad % inexistente', new.id, new.unit_id;
  end if;
  if u.language_code <> new.language_code or u.level <> new.level then
    raise exception 'word_rush_sentences %: idioma/nivel (%/%) distintos de la unidad % (%/%)',
      new.id, new.language_code, new.level, new.unit_id, u.language_code, u.level;
  end if;
  if not (new.id like new.language_code || '.wr.%') then
    raise exception 'word_rush_sentences %: el id no empieza con %.wr.', new.id, new.language_code;
  end if;
  return new;
end;
$$;
revoke all on function public.word_rush_sentences_check_unit() from public, anon, authenticated;

drop trigger if exists word_rush_sentences_check_unit on public.word_rush_sentences;
create trigger word_rush_sentences_check_unit
  before insert or update on public.word_rush_sentences
  for each row execute function public.word_rush_sentences_check_unit();

drop trigger if exists word_rush_sentences_updated_at on public.word_rush_sentences;
create trigger word_rush_sentences_updated_at before update on public.word_rush_sentences
  for each row execute function public.set_updated_at();

-- ---------- 2. Variantes de ejercicios existentes (sólo Word Rush) ----------
create table if not exists public.word_rush_exercise_variants (
  -- Un ejercicio order_words existente; si se borra, su variante también.
  exercise_id text primary key references public.exercises (id) on delete cascade,
  -- Órdenes que Word Rush acepta además de exercises.answer / accepted_answers.
  accepted_answers text[] not null check (
    cardinality(accepted_answers) >= 1
    and array_position(accepted_answers, null) is null
    and array_position(accepted_answers, '') is null
  ),
  -- Por qué es válido (conector conmutativo, adverbio de tiempo móvil…), para revisión.
  reason text not null check (btrim(reason) <> ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sólo ejercicios para ordenar.
create or replace function public.word_rush_exercise_variants_check()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.exercises where id = new.exercise_id and type = 'order_words'
  ) then
    raise exception 'word_rush_exercise_variants: % no es un ejercicio order_words', new.exercise_id;
  end if;
  return new;
end;
$$;
revoke all on function public.word_rush_exercise_variants_check() from public, anon, authenticated;

drop trigger if exists word_rush_exercise_variants_check on public.word_rush_exercise_variants;
create trigger word_rush_exercise_variants_check
  before insert or update on public.word_rush_exercise_variants
  for each row execute function public.word_rush_exercise_variants_check();

drop trigger if exists word_rush_exercise_variants_updated_at on public.word_rush_exercise_variants;
create trigger word_rush_exercise_variants_updated_at before update on public.word_rush_exercise_variants
  for each row execute function public.set_updated_at();

-- ---------- 3. Acceso: sólo el servidor ----------
alter table public.word_rush_sentences enable row level security;
alter table public.word_rush_exercise_variants enable row level security;
-- Sin políticas: anon y authenticated no ven ninguna fila aunque tuvieran privilegios.
revoke all on public.word_rush_sentences from public, anon, authenticated;
revoke all on public.word_rush_exercise_variants from public, anon, authenticated;
-- El servidor sólo lee (la carga la hace una migración, como dueño de las tablas).
revoke all on public.word_rush_sentences from service_role;
revoke all on public.word_rush_exercise_variants from service_role;
grant select on public.word_rush_sentences to service_role;
grant select on public.word_rush_exercise_variants to service_role;

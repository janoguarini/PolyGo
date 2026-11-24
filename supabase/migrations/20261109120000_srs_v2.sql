-- SRS v2 (`srs-2.0.0`): estado por unidad, una sola vía de aplicación, AL19 y migración desde v1.
-- Diseño: docs/ADAPTIVE_LEARNING_DESIGN.md rev. 4.2 (5, 9.7, 11, 13, 15). Implementación y decisiones
-- de implementación: docs/ADAPTIVE_LEARNING_PHASE3.md. Réplica TS: shared/srs2.ts.
--
-- Una sola vía (13.3): srs_v2_apply_session es la única función que escribe user_srs_state y el estado
-- de deuda a partir de sesiones. Tres invocadores comparten bloqueo, registro y código:
--   · online  — el trigger diferido learning_sessions_srs_v2_apply, al confirmar la transacción del
--               envío (submit_learning_session, también cuando la llama learning_submit_graded);
--   · replay  — la migración por usuario (srs_v2_migrate_user_locked), en orden canónico histórico;
--   · repair  — srs_v2_repair_sweep, que debe dar cero.
-- El bloqueo por usuario (srs_user_lock) lo toma submit_learning_session AL EMPEZAR, antes de registrar
-- los hechos de la sesión: el cuerpo vigente de la RPC se conserva intacto como
-- submit_learning_session_v1 y la función pública pasa a ser un envoltorio con la misma firma y los
-- mismos permisos. No cambia apply_word_result, user_word_progress (SRS v1), recompensas ni Ranked.
--
-- APAGADO POR DEFECTO: srs_v2_settings.enabled = false. Mientras esté apagado, ni el envoltorio ni el
-- trigger hacen nada y la RPC se comporta exactamente como antes. Encenderlo es el corte (15.3): cada
-- usuario se migra en su primera sesión posterior (o por el trabajo de migración).
--
-- Aditiva e idempotente (sin DROP ni DELETE). ESTADO: probada en PGlite (supabase/tests/srs2.test.mjs).
-- NO aplicada en producción.

-- 0. Interruptor.
create table if not exists public.srs_v2_settings (
  id boolean primary key default true check (id),
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.srs_v2_settings (id, enabled) values (true, false) on conflict (id) do nothing;

create or replace function public.srs_v2_enabled()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((select enabled from public.srs_v2_settings where id), false)
$$;

-- 1. Versiones (13.1) y pesos (AL3, AL22).
create table if not exists public.srs_algorithm_versions (
  version text primary key check (version ~ '^srs-[0-9]+\.[0-9]+\.[0-9]+$'),
  params jsonb not null check (jsonb_typeof(params) = 'object'),
  status text not null check (status in ('active', 'shadow', 'retired')),
  created_at timestamptz not null default now()
);

insert into public.srs_algorithm_versions (version, params, status) values (
  'srs-2.0.0',
  '{"target_retention": 0.85, "imax": 45, "imax_debt": 90, "c0": 0.5, "relearn_days": 1,
    "dispersion": 0.05, "kappa": {"-2": 0.25, "-1": 0.5, "0": 1, "1": 1}, "psi_above": 0.5,
    "full_error": 0.5, "floor_ramp": [0.6, 1.0], "beta": 0.5,
    "unit_hash": "polygo.unit_hash.v1", "q_quantization": "q4 = (s4*a4 + 5000) div 10000"}'::jsonb,
  'active')
on conflict (version) do nothing;

create table if not exists public.srs_weights (
  weights_version text primary key,
  algorithm_version text not null references public.srs_algorithm_versions (version),
  w double precision[] not null check (array_ndims(w) = 1 and array_length(w, 1) = 17 and array_lower(w, 1) = 1),
  fitted_on jsonb not null check (jsonb_typeof(fitted_on) = 'object'),
  status text not null check (status in ('active', 'candidate', 'retired')),
  created_at timestamptz not null default now()
);
create unique index if not exists srs_weights_one_active
  on public.srs_weights (algorithm_version) where status = 'active';

insert into public.srs_weights (weights_version, algorithm_version, w, fitted_on, status) values (
  'srs-2.0.0-w-initial', 'srs-2.0.0',
  array[0.2, 1.4003, 0.6, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072,
        0.0793, 0.3246, 1.587, 0.2272, 2.8755]::double precision[],
  '{"source": "FSRS-4.5 default weights with w0 = 0.2 and w2 = 0.6 (AL3); no PolyGo data",
    "al22": "shared/__tests__/srs2.test.ts: vectors T1-T9, properties of 5.10 and equivalence with the rev. 4.2 simulator"}'::jsonb,
  'active')
on conflict (weights_version) do nothing;

-- 2. Estado por unidad (11). 16 particiones por hash de user_id.
create table if not exists public.user_srs_state (
  user_id uuid not null references public.profiles (id) on delete cascade,
  concept_id text not null,
  dimension text not null references public.ref_polygo_dimensions (id),
  language_code text not null,
  algorithm_version text not null references public.srs_algorithm_versions (version),
  weights_version text not null references public.srs_weights (weights_version),
  stability numeric(10, 4) check (stability between 0.01 and 100),
  difficulty numeric(6, 4) check (difficulty between 1 and 10),
  n integer not null default 0 check (n >= 0),
  lapses integer not null default 0 check (lapses >= 0),
  last_a numeric(6, 4),
  last_z_minus numeric(6, 4),
  t_last timestamptz,
  last_seen_at timestamptz not null,
  due_at timestamptz not null,
  due_effective_at timestamptz not null,
  me_hint_at timestamptz,
  me_hint_expires_at timestamptz,
  exposures integer not null check (exposures >= 1),
  migration_source text check (migration_source in ('replay', 'converted')),
  migration_reason text check (char_length(migration_reason) <= 60),
  rung text not null check (rung in ('R', 'G', 'L', 'P', 'F', 'U')),
  relearning boolean not null default false,
  recent_item_ids text[] not null default '{}' check (cardinality(recent_item_ids) <= 4),
  last_session_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, concept_id, dimension),
  constraint user_srs_state_concept_fkey
    foreign key (concept_id, language_code) references public.concepts (id, language_code),
  -- S y D nulos ⇔ unidad sólo expuesta (n = 0, sin reloj).
  constraint user_srs_state_exposed_check check (
    (stability is null) = (difficulty is null) and (stability is null) = (n = 0)
    and (stability is null) = (t_last is null)),
  -- I1: el motor nunca atrasa. La sugerencia existe sólo con sus dos marcas.
  constraint user_srs_state_hint_check check (
    due_effective_at <= due_at
    and (me_hint_at is null) = (me_hint_expires_at is null)
    and (me_hint_at is not null or due_effective_at = due_at))
) partition by hash (user_id);

do $$
begin
  for i in 0..15 loop
    execute format('create table if not exists public.user_srs_state_p%s partition of public.user_srs_state
                    for values with (modulus 16, remainder %s)', i, i);
  end loop;
end;
$$;

create index if not exists user_srs_state_due_idx on public.user_srs_state (user_id, language_code, due_at);
create index if not exists user_srs_state_hint_idx
  on public.user_srs_state (user_id, language_code, due_effective_at) where due_effective_at < due_at;
create index if not exists user_srs_state_weak_idx
  on public.user_srs_state (user_id, language_code, difficulty desc) where difficulty >= 6.85;

-- 3. Una sola vía (13.3): cabecera por usuario y registro de sesiones aplicadas.
create table if not exists public.srs_user_head (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  last_seq bigint not null default 0 check (last_seq >= 0),
  last_t_srs timestamptz,
  v2_since timestamptz,
  -- Última zona horaria vigente informada por un envío (5.6, 7.2). Implementación: la tabla de 11 no
  -- la nombra, pero «inicio del día local siguiente» la necesita fuera de la transacción del envío.
  time_zone text,
  updated_at timestamptz not null default now()
);

create table if not exists public.srs_applied_sessions (
  session_id uuid primary key references public.learning_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  seq bigint not null check (seq > 0),
  t_srs timestamptz not null,
  origin text not null check (origin in ('online', 'replay', 'repair')),
  applied_at timestamptz not null default clock_timestamp(),
  algorithm_version text not null references public.srs_algorithm_versions (version),
  weights_version text not null references public.srs_weights (weights_version),
  planner_version text not null,
  -- Cachés para reconstruir y para ipu (9.7): con qué tope, en qué zona y cuánto se atendió.
  source text not null references public.practice_sources (id),
  language_code text references public.languages (code),
  time_zone text not null,
  imax smallint not null check (imax in (45, 90)),
  units_attended integer not null default 0 check (units_attended >= 0),
  items_served integer not null default 0 check (items_served >= 0),
  constraint srs_applied_sessions_user_seq_key unique (user_id, seq)
);

create table if not exists public.srs_migration_queue (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  attempts integer not null default 0,
  last_error text check (char_length(last_error) <= 500),
  enqueued_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.srs_migration_cutoff (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  cutoff_at timestamptz not null,
  time_zone text not null,
  sessions integer not null,
  max_attempt_id bigint,
  session_ids_hash text not null,
  category_c_ratio numeric(6, 4),
  verified_units integer not null,
  converted_units integer not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

-- 4. Deuda y AL19 (9.7, 11), por usuario e idioma.
create table if not exists public.srs_user_debt_state (
  user_id uuid not null references public.profiles (id) on delete cascade,
  language_code text not null references public.languages (code),
  al19_active boolean not null default false,
  entered_on date,
  entered_at timestamptz,
  entries integer not null default 0,
  imax_effective smallint not null default 45 check (imax_effective in (45, 90)),
  enter_streak smallint not null default 0,
  exit_streak smallint not null default 0,
  last_trend_ratio numeric,
  last_load45 numeric,
  last_ipu numeric,
  evaluated_on date not null,
  evaluated_at timestamptz,
  planner_version text not null,
  measured_since timestamptz not null,
  measured_since_date date not null,
  init_source text not null check (init_source in ('migration', 'new')),
  measured_days integer not null default 0,
  primary key (user_id, language_code),
  check ((al19_active and imax_effective = 90) or (not al19_active and imax_effective = 45))
);

create table if not exists public.srs_user_debt_days (
  user_id uuid not null,
  language_code text not null,
  study_date date not null,
  budget integer not null check (budget >= 0),
  ipu numeric not null,
  pend_units integer not null,
  debt_items numeric not null,
  debt_prev_units integer not null,
  load45 numeric,
  trend_ratio numeric,
  al19_active boolean not null,
  imax_effective smallint not null,
  debt_units_end integer,
  created_at timestamptz not null default now(),
  primary key (user_id, language_code, study_date),
  foreign key (user_id, language_code) references public.srs_user_debt_state (user_id, language_code) on delete cascade
);

-- CHECK de 11 («study_date > día local de measured_since»): depende de otra tabla, va en un trigger.
create or replace function public.srs_user_debt_days_check()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.study_date <= (select measured_since_date from public.srs_user_debt_state
                        where user_id = new.user_id and language_code = new.language_code) then
    raise exception 'srs_user_debt_days: % no es posterior al día del corte', new.study_date
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.srs_user_debt_days'::regclass
                 and tgname = 'srs_user_debt_days_check') then
    create trigger srs_user_debt_days_check before insert or update on public.srs_user_debt_days
      for each row execute function public.srs_user_debt_days_check();
  end if;
end;
$$;

-- 5. Planes del armador (11) y cola de sugerencias del motor (10.3). El plan se registra al iniciar
--    la sesión (no hay plan firmado: lo guarda el servidor, como las presentaciones de la fase 2), así
--    que no tiene FK a learning_sessions, que se inserta al enviar.
create table if not exists public.srs_session_plans (
  session_id uuid primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  language_code text not null references public.languages (code),
  source text not null references public.practice_sources (id),
  planner_version text not null,
  algorithm_version text not null references public.srs_algorithm_versions (version),
  weights_version text not null references public.srs_weights (weights_version),
  budget integer not null check (budget >= 0),
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create index if not exists srs_session_plans_user_idx on public.srs_session_plans (user_id, created_at desc);

create table if not exists public.srs_hint_queue (
  user_id uuid not null references public.profiles (id) on delete cascade,
  concept_id text not null,
  dimension text not null,
  enqueued_at timestamptz not null default now(),
  primary key (user_id, concept_id, dimension)
);

-- 6. Orígenes nuevos (AL10, 11). Filas nuevas: no se toca ninguna existente.
insert into public.practice_sources (id, selection_mode, affects_srs, affects_lesson_progress,
  consumes_energy, counts_for_streak, evidence_class, reward_kind, plus_feature, active) values
  ('adaptive_review', 'server', true, false, false, true, 'retrieval', 'review', null,           true),
  ('focus_review',    'server', true, false, false, true, 'retrieval', 'review', 'focus_review', true)
on conflict (id) do nothing;

-- 7. Funciones puras: hash, cuantización, escalera.

-- polygo.unit_hash.v1: FNV-1a de 32 bits sobre las unidades UTF-16 de '<user>|<concept>|<dim>', / 2³².
create or replace function public.srs_v2_unit_hash(p_user uuid, p_concept text, p_dim text)
returns double precision
language plpgsql
immutable
set search_path = ''
as $$
declare
  s text := p_user::text || '|' || p_concept || '|' || p_dim;
  h bigint := 2166136261;
  cp integer;
  units integer[];
  u integer;
begin
  for i in 1..char_length(s) loop
    cp := ascii(substr(s, i, 1));
    if cp > 65535 then
      units := array[55296 + ((cp - 65536) >> 10), 56320 + ((cp - 65536) & 1023)];
    else
      units := array[cp];
    end if;
    foreach u in array units loop
      h := ((h # u) * 16777619) % 4294967296;
    end loop;
  end loop;
  return h::double precision / 4294967296;
end;
$$;

-- s4 de Mastery 5.3 (correct 10 000, typo = correct_minor 9 000, el resto 0).
create or replace function public.srs_v2_s4(p_verdict text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_verdict when 'correct' then 10000 when 'typo' then 9000 else 0 end
$$;

-- a4 (13.2): factores en el orden de ref_assists.id, en diezmilésimos, redondeo paso a paso, piso 2 500.
create or replace function public.srs_v2_assist_factor4(p_assists jsonb)
returns integer
language plpgsql
immutable
set search_path = ''
as $$
declare
  a4 bigint := 10000;
  f record;
  v jsonb;
  n numeric;
  times integer;
begin
  for f in select * from (values ('audio_replays', 8500), ('hints_revealed', 4000),
                                 ('prompt_audio_plays', 8000), ('reading_visible', 6000),
                                 ('slow_audio_plays', 7000)) as x(id, f4)
           order by id collate "C" loop
    v := coalesce(p_assists, '{}'::jsonb) -> f.id;
    n := case jsonb_typeof(v) when 'boolean' then (case when v::text = 'true' then 1 else 0 end)
                              when 'number' then v::text::numeric else 0 end;
    times := case when n <= 0 then 0
                  when f.id = 'audio_replays' then greatest(0, floor(n)::integer - 1)
                  when f.id = 'hints_revealed' then floor(n)::integer
                  else 1 end;
    for k in 1..times loop
      a4 := (a4 * f.f4 + 5000) / 10000;
    end loop;
  end loop;
  return greatest(a4, 2500)::integer;
end;
$$;

-- q4 = (s4·a4 + 5 000) div 10 000, con P = s4·a4 ≤ 10⁸ (13.2, C41).
create or replace function public.srs_v2_quantize(p_s4 integer, p_a4 integer)
returns integer
language plpgsql
immutable
set search_path = ''
as $$
begin
  if p_s4 is null or p_a4 is null or p_s4 not between 0 and 10000 or p_a4 not between 0 and 10000 then
    raise exception 'srs_v2_quantize: entradas fuera de rango (%, %)', p_s4, p_a4 using errcode = '22003';
  end if;
  return ((p_s4::bigint * p_a4::bigint + 5000) / 10000)::integer;
end;
$$;

create or replace function public.srs_v2_target_rung(p_dim text, p_level text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case p_dim when 'production' then case when p_level in ('A1', 'A2') then 'P' else 'F' end
                    when 'comprehension' then 'U' else 'L' end
$$;

create or replace function public.srs_v2_rung_for_mode(p_dim text, p_mode text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p_dim = 'comprehension' then
      case when p_mode in ('listening_comprehension', 'reading_comprehension') then 'U' end
    when p_dim = 'production' then
      case p_mode when 'controlled_production' then 'P' when 'free_production' then 'F' end
    else case p_mode when 'recognition' then 'R' when 'cued_recall' then 'G' when 'guided_construction' then 'G'
                     when 'free_recall' then 'L' when 'controlled_production' then 'L'
                     when 'free_production' then 'L' end
  end
$$;

create or replace function public.srs_v2_ladder(p_dim text)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case p_dim when 'production' then array['P', 'F'] when 'comprehension' then array['U']
                    else array['R', 'G', 'L'] end
$$;

-- r_i en [−2, +1]; nulo si el escalón no está en la escalera de la dimensión.
create or replace function public.srs_v2_relative_rung(p_dim text, p_rung text, p_target text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when r between -2 and 1 then r end
  from (select array_position(public.srs_v2_ladder(p_dim), p_rung)
               - array_position(public.srs_v2_ladder(p_dim), p_target) as r) x
$$;

create or replace function public.srs_v2_start_rung(p_dim text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case when p_dim in ('vocabulary', 'grammar') then 'G' else (public.srs_v2_ladder(p_dim))[1] end
$$;

-- 8. srs_v2_update: núcleo FSRS-4.5 + capa (5.3–5.6, 5.9). Pura y determinista; double precision para
--    calcular, el llamador guarda con numeric(…, 4). Observaciones: [{q4 | q, r, nT}] (q real sólo en
--    pruebas de continuidad). Pesos 1-indexados: w[1] = w0 de FSRS.
create or replace function public.srs_v2_update(
  p_has_row boolean, p_s double precision, p_d double precision, p_n integer, p_lapses integer,
  p_exposures integer, p_t_last timestamptz, p_due timestamptz, p_rung text, p_relearning boolean,
  p_last_a double precision, p_last_zm double precision,
  p_obs jsonb, p_t timestamptz, p_f double precision, p_imax integer, p_next_day timestamptz,
  p_dim text, p_target text, p_w double precision[], p_r double precision,
  out kind text, out stability double precision, out difficulty double precision, out n integer,
  out lapses integer, out exposures integer, out t_last timestamptz, out last_seen_at timestamptz,
  out due_at timestamptz, out rung text, out relearning boolean, out a double precision,
  out z_minus double precision, out informative boolean)
language plpgsql
immutable
set search_path = ''
as $$
declare
  ff constant double precision := 19::double precision / 81;
  dec constant double precision := -0.5;
  tau double precision := (power(p_r, 1 / dec) - 1) / ff;
  smax double precision := p_imax / tau;
  o jsonb;
  q4 integer;
  q double precision;
  z double precision;
  e double precision;
  r integer;
  nt integer;
  sz double precision[] := '{}';
  sr integer[] := '{}';
  ez double precision[] := '{}';
  er integer[] := '{}';
  va double precision := 0;
  rho double precision := 0;
  phi double precision := 0;
  prod double precision := 1;
  ferr double precision := 0;
  cc double precision := 0;
  best double precision;
  zm double precision;
  supp double precision;
  kap double precision;
  t double precision := extract(epoch from p_t)::double precision / 86400;
  tl double precision;
  dd double precision;
  rr double precision;
  info double precision;
  sinc double precision;
  s_s double precision;
  s_f double precision;
  s2 double precision;
  d0 double precision := least(10, greatest(1, p_w[5]));
  de double precision;
  dg double precision;
  d2 double precision;
  g double precision;
  iv double precision;
  prev_due double precision;
  base double precision;
  nd double precision;
  ladder text[] := public.srs_v2_ladder(p_dim);
  li integer;
  top integer;
  full_err boolean;
begin
  for o in select x from jsonb_array_elements(p_obs) x loop
    r := (o ->> 'r')::integer;
    nt := (o ->> 'nT')::integer;
    z := null;
    e := null;
    if o ? 'q4' then
      q4 := (o ->> 'q4')::integer;
      if q4 > 5000 then z := (q4 - 5000)::double precision / 5000;
      elsif q4 < 5000 then e := (5000 - q4)::double precision / 5000;
      end if;
    else
      q := (o ->> 'q')::double precision;
      if q > 0.5 then z := (q - 0.5) / 0.5;
      elsif q < 0.5 then e := (0.5 - q) / 0.5;
      end if;
    end if;
    if z is not null then
      kap := case r when -2 then 0.25::double precision when -1 then 0.5::double precision else 1::double precision end;
      va := greatest(va, kap * z);
      rho := greatest(rho, z);
      if r >= -1 then
        phi := greatest(phi, kap * least(1, greatest(0, (z - 0.6::double precision) / 0.4::double precision)));
      end if;
      sz := sz || z;
      sr := sr || r;
    end if;
    if e is not null then
      ez := ez || ((case when r = 1 then 0.5::double precision else 1::double precision end)
                   * (1::double precision / nt) * e);
      er := er || r;
    end if;
  end loop;
  if cardinality(ez) > 0 then
    for i in 1..cardinality(ez) loop
      prod := prod * (1 - ez[i]);
    end loop;
    ferr := 1 - prod;
    cc := 'Infinity'::double precision;
    for i in 1..cardinality(ez) loop
      best := 0;
      for j in 1..coalesce(cardinality(sz), 0) loop
        if sr[j] >= er[i] then best := greatest(best, sz[j]); end if;
      end loop;
      cc := least(cc, best);
    end loop;
  end if;
  zm := (1 - (1 - 0.5::double precision) * cc) * ferr;
  supp := greatest(0, 1 - 2 * ferr);
  informative := va > 0 or ferr > 0;
  full_err := zm >= 0.5;

  if not informative then
    kind := 'exposure';
    last_seen_at := p_t;
    if not p_has_row then
      stability := null; difficulty := null; n := 0; lapses := 0; exposures := 1; t_last := null;
      due_at := p_next_day; rung := public.srs_v2_start_rung(p_dim); relearning := false;
      a := null; z_minus := null;
    else
      stability := p_s; difficulty := p_d; n := p_n; lapses := p_lapses; exposures := p_exposures + 1;
      t_last := p_t_last; due_at := p_due; rung := p_rung; relearning := p_relearning;
      a := p_last_a; z_minus := p_last_zm;
    end if;
    return;
  end if;

  a := va;
  z_minus := zm;
  if not p_has_row or p_s is null then
    kind := 'init';
    stability := least(smax, greatest(0.01, p_w[1] * power(p_w[3] / p_w[1], va * (1 - zm))));
    difficulty := least(10, greatest(1, d0 + 2 * p_w[6] * zm));
    iv := least(p_imax, stability * tau * p_f);
    due_at := to_timestamp((case when full_err then t + least(iv, 1) else t + iv end) * 86400);
    n := 1;
    lapses := coalesce(case when p_has_row then p_lapses end, 0) + (case when full_err then 1 else 0 end);
    exposures := coalesce(case when p_has_row then p_exposures end, 0) + 1;
    t_last := p_t;
    last_seen_at := p_t;
    li := array_position(ladder, public.srs_v2_start_rung(p_dim));
    rung := case when full_err then ladder[greatest(1, li - 1)] else ladder[li] end;
    relearning := full_err;
    return;
  end if;

  kind := 'update';
  tl := extract(epoch from p_t_last)::double precision / 86400;
  dd := t - tl;
  rr := power(1 + ff * dd / p_s, dec);
  info := least(1, (1 - rr) / 0.1::double precision);
  sinc := exp(p_w[9]) * (11 - p_d) * power(p_s, -p_w[10]) * (exp(p_w[11] * (1 - rr)) - 1);
  s_s := p_s * (1 + supp * va * sinc);
  s_f := least(p_s, p_w[12] * power(p_d, -p_w[13]) * (power(p_s + 1, p_w[14]) - 1) * exp(p_w[15] * (1 - rr)));
  s2 := s_s * power(s_f / p_s, zm);
  s2 := greatest(s2, phi * supp * (ff * dd / 3));
  stability := least(smax, greatest(0.01, s2));
  de := least(10, greatest(1, p_w[8] * d0 + (1 - p_w[8]) * (p_d - p_w[7] * (-2))));
  dg := least(10, greatest(1, p_w[8] * d0 + (1 - p_w[8]) * (p_d - p_w[7] * 0)));
  d2 := p_d + zm * greatest(0, de - p_d) - info * va * supp * greatest(0, p_d - dg);
  difficulty := least(10, greatest(1, d2));
  g := greatest(rho, ferr);
  t_last := to_timestamp((tl + g * (t - tl)) * 86400);
  iv := least(p_imax, stability * tau * p_f);
  prev_due := extract(epoch from p_due)::double precision / 86400;
  base := prev_due + rho * greatest(0, t + iv - prev_due);
  nd := base + ferr * least(0, t + iv - base);
  if full_err then nd := t + least(iv, 1); end if;
  if ferr > 0 and prev_due > t then nd := least(nd, prev_due); end if;
  due_at := to_timestamp(nd * 86400);
  n := p_n + 1;
  lapses := p_lapses + (case when full_err then 1 else 0 end);
  exposures := p_exposures + 1;
  last_seen_at := p_t;
  relearning := full_err;
  li := array_position(ladder, p_rung);
  top := array_position(ladder, p_target);
  rung := case when full_err then ladder[greatest(1, li - 1)]
               when ferr = 0 and va > 0 then ladder[least(top, li + 1)]
               else p_rung end;
end;
$$;

-- 9. Origen y observaciones de una sesión (5.3, 15.2).

-- Origen de la sesión: el del plan del servidor si existe; si no, lesson o srs_review (app vieja).
create or replace function public.srs_v2_session_source(p_session_id uuid)
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select p.source from public.srs_session_plans p where p.session_id = s.id and p.user_id = s.user_id),
    case s.kind when 'lesson' then 'lesson' else 'srs_review' end)
  from public.learning_sessions s where s.id = p_session_id
$$;

-- Observaciones: con correcciones del servidor (fase 2) si la sesión las tiene; si no, las reglas de
-- 15.2 A para client_reported (palabra por word_id o exercise_words filtrado, escalón conservador).
create or replace function public.srs_v2_observations(p_session_id uuid)
returns table (ord integer, concept_id text, dimension text, language_code text, level text,
               q4 integer, r integer, n_t integer, item_id text, word_id text, is_correct boolean)
language sql
stable
set search_path = ''
as $$
  with ses as (select * from public.learning_sessions where id = p_session_id),
  graded as (
    -- Primer intento de cada ítem distinto, con corrección válida.
    select distinct on (g.item_id) g.attempt_id, g.item_id, g.verdict, g.assists, i.assessment_mode
    from public.exercise_attempt_gradings g
    join public.exercise_items i on i.id = g.item_id
    where g.session_id = p_session_id and g.attempt_no = 1 and g.status = 'valid'
    order by g.item_id, g.attempt_id
  ),
  graded_obs as (
    select g.attempt_id, ic.concept_id, ic.dimension, c.language_code, c.level,
           public.srs_v2_quantize(public.srs_v2_s4(g.verdict), public.srs_v2_assist_factor4(g.assists)) as q4,
           public.srs_v2_relative_rung(ic.dimension, public.srs_v2_rung_for_mode(ic.dimension, g.assessment_mode),
                                       public.srs_v2_target_rung(ic.dimension, c.level)) as r,
           (select count(*) from public.item_concepts x
            where x.item_id = ic.item_id and x.dimension = ic.dimension and x.role = 'target')::integer as n_t,
           g.item_id, case when c.kind = 'lexical' then c.id end as word_id,
           g.verdict in ('correct', 'typo') as is_correct
    from graded g
    join public.item_concepts ic on ic.item_id = g.item_id and ic.role = 'target'
    join public.concepts c on c.id = ic.concept_id
  ),
  has_gradings as (select exists (select 1 from public.exercise_attempt_gradings where session_id = p_session_id) as v),
  legacy_review as (
    select a.id as attempt_id, c.id as concept_id, 'vocabulary'::text as dimension, c.language_code, c.level,
           case when a.is_correct then 10000 else 0 end as q4,
           case when a.is_correct then -2 else 0 end as r, 1 as n_t, null::text as item_id,
           c.id as word_id, a.is_correct
    from ses
    join public.exercise_attempts a on a.session_id = ses.id and a.is_first_try and a.word_id is not null
    join public.concepts c on c.id = a.word_id and c.kind = 'lexical'
  ),
  legacy_lesson as (
    select a.id as attempt_id, c.id as concept_id, 'vocabulary'::text as dimension, c.language_code, c.level,
           case when a.is_correct then 10000 else 0 end as q4,
           coalesce(public.srs_v2_relative_rung('vocabulary', public.srs_v2_rung_for_mode('vocabulary', i.assessment_mode), 'L'),
                    case when a.is_correct then -2 else 0 end) as r,
           (select count(*) from public.exercise_words x where x.exercise_id = e.id)::integer as n_t,
           e.item_id, c.id as word_id, a.is_correct
    from ses
    join public.exercise_attempts a on a.session_id = ses.id and a.is_first_try and a.word_id is null
    join public.exercises e on e.id = a.exercise_id and e.updated_at <= a.created_at
    join public.exercise_words ew on ew.exercise_id = e.id
    join public.concepts c on c.id = ew.word_id and c.kind = 'lexical'
    join public.user_word_progress p on p.user_id = a.user_id and p.word_id = ew.word_id
                                     and p.created_at <= ses.completed_at
    left join public.exercise_items i on i.id = e.item_id
  ),
  all_obs as (
    select * from graded_obs where (select v from has_gradings) and r is not null
    union all
    select * from legacy_review where not (select v from has_gradings)
    union all
    select * from legacy_lesson where not (select v from has_gradings)
  )
  select row_number() over (order by attempt_id, concept_id, dimension)::integer, concept_id, dimension,
         language_code, level, q4, r, n_t, item_id, word_id, is_correct
  from all_obs
$$;

-- 10. AL19 (9.7): medidas del día y evaluación pura.

create or replace function public.srs_v2_user_rhythm100(p_user uuid, p_exclude uuid)
returns integer
language sql
stable
set search_path = ''
as $$
  with xs as (
    select total_answers::double precision / (duration_seconds::double precision / 60) as apm
    from public.learning_sessions
    where user_id = p_user and id is distinct from p_exclude and duration_seconds > 0
    order by completed_at desc, id desc
    limit 10
  ),
  m as (select count(*) as n, percentile_cont(0.5) within group (order by apm) as med from xs)
  select case when n = 0 then 750 else round((((n * med + 5 * 7.5) / (n + 5)) * 100)::numeric)::integer end from m
$$;

create or replace function public.srs_v2_ipu(p_user uuid, p_lang text)
returns double precision
language sql
stable
set search_path = ''
as $$
  with xs as (
    select items_served, units_attended from public.srs_applied_sessions
    where user_id = p_user and language_code = p_lang and source = 'adaptive_review' and units_attended > 0
    order by seq desc limit 10
  ),
  m as (select count(*) as n, sum(items_served)::double precision as it, sum(units_attended)::double precision as un from xs)
  select least(3, greatest(0.5, case when n = 0 then 1.65 else (n * (it / un) + 5 * 1.65) / (n + 5) end)) from m
$$;

-- Evalúa AL19 para el día d con el estado ANTERIOR a la primera sesión del día. Escribe la fila del día
-- y el estado. Sólo la llama srs_v2_apply_session (online/repair) con el bloqueo tomado.
create or replace function public.srs_v2_al19_evaluate(
  p_user uuid, p_lang text, p_day date, p_tz text, p_t timestamptz, p_exclude uuid)
returns public.srs_user_debt_state
language plpgsql
security definer
set search_path = ''
as $$
declare
  st public.srs_user_debt_state;
  v_goal integer;
  v_b integer;
  v_ipu double precision := public.srs_v2_ipu(p_user, p_lang);
  v_pend integer;
  v_prev integer;
  v_load numeric;
  v_items numeric;
  v_back numeric;
  v_rows integer;
  v_trend numeric;
  v_start timestamptz := (p_day + 1)::timestamp at time zone p_tz;
  v_day0 timestamptz := p_day::timestamp at time zone p_tz;
  v_dayp timestamptz := (p_day - 1)::timestamp at time zone p_tz;
  tau constant double precision := (power(0.85::double precision, -2) - 1) / (19::double precision / 81);
begin
  select * into st from public.srs_user_debt_state where user_id = p_user and language_code = p_lang for update;
  if not found or p_day <= st.evaluated_on then
    return st;
  end if;
  select daily_goal_minutes into v_goal from public.profiles where id = p_user;
  v_b := (coalesce(v_goal, 10) * public.srs_v2_user_rhythm100(p_user, p_exclude)) / 100;
  select count(*) into v_pend from public.user_srs_state
  where user_id = p_user and language_code = p_lang and due_at < v_start;
  select count(*) into v_prev from public.user_srs_state
  where user_id = p_user and language_code = p_lang and due_at < v_day0
    and not (last_seen_at >= v_dayp and last_seen_at < v_day0);
  if st.al19_active then
    select coalesce(sum(v_ipu / greatest(1, least(45, stability::double precision * tau))), 0) into v_load
    from public.user_srs_state where user_id = p_user and language_code = p_lang and stability is not null;
  end if;
  v_items := v_pend * v_ipu::numeric;
  select count(*) into v_rows from public.srs_user_debt_days where user_id = p_user and language_code = p_lang;
  if v_rows >= 14 then
    select debt_items into v_back from public.srs_user_debt_days
    where user_id = p_user and language_code = p_lang order by study_date desc offset 13 limit 1;
    v_trend := case when v_back > 0 then v_items / v_back end;
  end if;

  st.measured_days := st.measured_days + 1;
  st.evaluated_on := p_day;
  st.evaluated_at := p_t;
  st.last_ipu := v_ipu;
  st.last_trend_ratio := v_trend;
  st.last_load45 := v_load;
  if not st.al19_active then
    st.enter_streak := case when v_items > v_b then st.enter_streak + 1 else 0 end;
    if st.enter_streak >= 14 and v_back is not null and v_items >= 0.75 * v_back then
      st.al19_active := true;
      st.imax_effective := 90;
      st.entered_on := p_day;
      st.entered_at := p_t;
      st.exit_streak := 0;
      st.entries := st.entries + 1;
    end if;
  else
    st.exit_streak := case when v_prev = 0 and v_load <= 0.8 * v_b then st.exit_streak + 1 else 0 end;
    if st.exit_streak >= 7 then
      st.al19_active := false;
      st.imax_effective := 45;
      st.enter_streak := 0;
    end if;
  end if;

  insert into public.srs_user_debt_days (user_id, language_code, study_date, budget, ipu, pend_units,
    debt_items, debt_prev_units, load45, trend_ratio, al19_active, imax_effective)
  values (p_user, p_lang, p_day, v_b, v_ipu, v_pend, v_items, v_prev, v_load, v_trend,
          st.al19_active, st.imax_effective);
  update public.srs_user_debt_state set
    al19_active = st.al19_active, entered_on = st.entered_on, entered_at = st.entered_at,
    entries = st.entries, imax_effective = st.imax_effective, enter_streak = st.enter_streak,
    exit_streak = st.exit_streak, last_trend_ratio = st.last_trend_ratio, last_load45 = st.last_load45,
    last_ipu = st.last_ipu, evaluated_on = st.evaluated_on, evaluated_at = st.evaluated_at,
    measured_days = st.measured_days
  where user_id = p_user and language_code = p_lang;
  return st;
end;
$$;

-- Estado inicial de AL19 (C39): inactivo, 45, rachas 0, evaluated_on = día local de v2_since.
create or replace function public.srs_v2_debt_init(p_user uuid, p_lang text, p_tz text, p_source text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_since timestamptz := (select v2_since from public.srs_user_head where user_id = p_user);
begin
  insert into public.srs_user_debt_state (user_id, language_code, evaluated_on, planner_version,
    measured_since, measured_since_date, init_source)
  values (p_user, p_lang, (v_since at time zone p_tz)::date, 'planner-2.0.0', v_since,
          (v_since at time zone p_tz)::date, p_source)
  on conflict (user_id, language_code) do nothing;
end;
$$;

-- 11. srs_user_lock (13.3, pasos 1–2) y srs_v2_apply_session (pasos 3–8).

create or replace function public.srs_user_lock(p_user uuid, p_tz text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  h public.srs_user_head;
  v_tz text := public.safe_time_zone(p_tz);
begin
  if p_user is null or not public.srs_v2_enabled() then
    return null;
  end if;
  insert into public.srs_user_head (user_id) values (p_user) on conflict (user_id) do nothing;
  select * into h from public.srs_user_head where user_id = p_user for update;
  if p_tz is not null and h.time_zone is distinct from v_tz then
    update public.srs_user_head set time_zone = v_tz, updated_at = now() where user_id = p_user;
  end if;
  if h.v2_since is null then
    perform public.srs_v2_migrate_user_locked(p_user, v_tz);
    select * into h from public.srs_user_head where user_id = p_user;
  end if;
  return h.v2_since;
end;
$$;

create or replace function public.srs_v2_session_result(p_user uuid, p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'srs_seq', a.seq, 'origin', a.origin,
    'units', coalesce((
      select jsonb_agg(jsonb_build_object('concept_id', u.concept_id, 'dimension', u.dimension,
                                          'due_at', u.due_at, 'due_effective_at', u.due_effective_at)
                       order by u.concept_id, u.dimension)
      from public.user_srs_state u
      where u.user_id = p_user
        and (u.concept_id, u.dimension) in (select o.concept_id, o.dimension from public.srs_v2_observations(p_session_id) o)
    ), '[]'::jsonb))
  from public.srs_applied_sessions a
  where a.session_id = p_session_id and a.user_id = p_user
$$;

create or replace function public.srs_v2_apply_session(p_session_id uuid, p_origin text, p_tz text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ses public.learning_sessions;
  h public.srs_user_head;
  alg public.srs_algorithm_versions;
  wts public.srs_weights;
  st public.user_srs_state;
  dst public.srs_user_debt_state;
  res record;
  u record;
  v_tz text := public.safe_time_zone(p_tz);
  v_source text;
  v_affects boolean;
  v_seq bigint;
  v_t timestamptz;
  v_ins uuid;
  v_lang text;
  v_day date;
  v_imax integer := 45;
  v_next_day timestamptz;
  v_r double precision;
  v_units integer := 0;
  v_items integer := 0;
begin
  if not public.srs_v2_enabled() then
    return null;
  end if;
  if p_origin not in ('online', 'replay', 'repair') then
    raise exception 'srs_v2_apply_session: origen % inválido', p_origin using errcode = '22023';
  end if;
  select * into ses from public.learning_sessions where id = p_session_id;
  if not found then
    raise exception 'srs_v2_apply_session: sesión % inexistente', p_session_id using errcode = 'P0002';
  end if;
  -- Paso 1: el bloqueo de la cabecera ya está tomado por el invocador; tomarlo de nuevo en la misma
  -- transacción no espera. Sin cabecera no se aplica nada: lo garantiza srs_user_lock.
  select * into h from public.srs_user_head where user_id = ses.user_id for update;
  if not found or (p_origin <> 'replay' and h.v2_since is null) then
    raise exception 'srs_v2_apply_session: el usuario no tomó el bloqueo o no está migrado' using errcode = '55000';
  end if;

  v_source := public.srs_v2_session_source(ses.id);
  select affects_srs into v_affects from public.practice_sources where id = v_source;
  if not coalesce(v_affects, false) then
    return jsonb_build_object('applied', false, 'reason', 'source_without_srs');
  end if;
  select * into alg from public.srs_algorithm_versions where status = 'active' order by version desc limit 1;
  select * into wts from public.srs_weights where algorithm_version = alg.version and status = 'active';
  v_r := (alg.params ->> 'target_retention')::double precision;

  -- Pasos 3–4: idempotencia, orden y hora.
  v_seq := h.last_seq + 1;
  v_t := case when p_origin = 'replay' then greatest(ses.completed_at, coalesce(h.last_t_srs, '-infinity'))
              else greatest(clock_timestamp(), coalesce(h.last_t_srs, '-infinity')) end;
  select min(language_code) into v_lang from public.srs_v2_observations(ses.id);

  insert into public.srs_applied_sessions (session_id, user_id, seq, t_srs, origin, algorithm_version,
    weights_version, planner_version, source, language_code, time_zone, imax)
  values (ses.id, ses.user_id, v_seq, v_t, p_origin, alg.version, wts.weights_version, 'planner-2.0.0',
          v_source, v_lang, v_tz, v_imax)
  on conflict (session_id) do nothing
  returning session_id into v_ins;
  if v_ins is null then
    return public.srs_v2_session_result(ses.user_id, ses.id) || jsonb_build_object('duplicate', true);
  end if;
  update public.srs_user_head set last_seq = v_seq, last_t_srs = v_t, updated_at = now()
  where user_id = ses.user_id;

  -- Paso 5 (sólo online/repair): AL19 del día, una vez, con el estado anterior a esta sesión. Las
  -- sesiones replay usan I_max 45 y no escriben estado de deuda (C39).
  if v_lang is not null and p_origin <> 'replay' then
    perform public.srs_v2_debt_init(ses.user_id, v_lang, v_tz, 'new');
    v_day := (v_t at time zone v_tz)::date;
    dst := public.srs_v2_al19_evaluate(ses.user_id, v_lang, v_day, v_tz, v_t, ses.id);
    v_imax := dst.imax_effective;
    update public.srs_applied_sessions set imax = v_imax where session_id = ses.id;
  end if;

  -- Paso 6: unidades en orden (concept_id, dimension).
  v_next_day := ((v_t at time zone v_tz)::date + 1)::timestamp at time zone v_tz;
  for u in
    select o.concept_id, o.dimension, min(o.language_code) as language_code, min(o.level) as level,
           jsonb_agg(jsonb_build_object('q4', o.q4, 'r', o.r, 'nT', o.n_t) order by o.ord) as obs,
           array_remove(array_agg(o.item_id order by o.ord desc), null) as items
    from public.srs_v2_observations(ses.id) o
    group by o.concept_id, o.dimension
    order by o.concept_id, o.dimension
  loop
    select * into st from public.user_srs_state
    where user_id = ses.user_id and concept_id = u.concept_id and dimension = u.dimension
    for update;
    select * into res from public.srs_v2_update(
      found, st.stability::double precision, st.difficulty::double precision, st.n, st.lapses, st.exposures,
      st.t_last, st.due_at, st.rung, st.relearning, st.last_a::double precision, st.last_z_minus::double precision,
      u.obs, v_t, 1 + 0.05::double precision * (2 * public.srs_v2_unit_hash(ses.user_id, u.concept_id, u.dimension) - 1),
      v_imax, v_next_day, u.dimension, public.srs_v2_target_rung(u.dimension, u.level), wts.w, v_r);
    insert into public.user_srs_state as x (user_id, concept_id, dimension, language_code, algorithm_version,
      weights_version, stability, difficulty, n, lapses, last_a, last_z_minus, t_last, last_seen_at, due_at,
      due_effective_at, me_hint_at, me_hint_expires_at, exposures, migration_source, rung, relearning,
      recent_item_ids, last_session_id, updated_at)
    values (ses.user_id, u.concept_id, u.dimension, u.language_code, alg.version, wts.weights_version,
      res.stability, res.difficulty, res.n, res.lapses, res.a, res.z_minus, res.t_last, res.last_seen_at,
      res.due_at, res.due_at, null, null, res.exposures,
      case when p_origin = 'replay' then 'replay' end, res.rung, res.relearning,
      (select coalesce(array_agg(d.i order by d.k), '{}') from (
         select z.i, min(z.k) as k from unnest(u.items || coalesce(st.recent_item_ids, '{}')) with ordinality as z(i, k)
         group by z.i order by min(z.k) limit 4) d), ses.id, clock_timestamp())
    on conflict (user_id, concept_id, dimension) do update set
      algorithm_version = excluded.algorithm_version, weights_version = excluded.weights_version,
      stability = excluded.stability, difficulty = excluded.difficulty, n = excluded.n, lapses = excluded.lapses,
      last_a = excluded.last_a, last_z_minus = excluded.last_z_minus, t_last = excluded.t_last,
      last_seen_at = excluded.last_seen_at, due_at = excluded.due_at,
      -- I6: toda sesión aplicada anula la sugerencia del motor.
      due_effective_at = excluded.due_at, me_hint_at = null, me_hint_expires_at = null,
      exposures = excluded.exposures, rung = excluded.rung, relearning = excluded.relearning,
      recent_item_ids = excluded.recent_item_ids, last_session_id = excluded.last_session_id,
      updated_at = excluded.updated_at;
    v_units := v_units + 1;
  end loop;

  select count(distinct item_id) into v_items from public.exercise_presentations
  where session_id = ses.id and user_id = ses.user_id;
  update public.srs_applied_sessions set units_attended = v_units, items_served = v_items
  where session_id = ses.id;

  -- Paso 7: deuda del día (vencidos de hoy todavía sin atender).
  if v_day is not null then
    update public.srs_user_debt_days set debt_units_end = (
      select count(*) from public.user_srs_state
      where user_id = ses.user_id and language_code = v_lang
        and due_at < (v_day + 1)::timestamp at time zone v_tz
        and not (last_seen_at >= v_day::timestamp at time zone v_tz
                 and last_seen_at < (v_day + 1)::timestamp at time zone v_tz))
    where user_id = ses.user_id and language_code = v_lang and study_date = v_day;
  end if;

  return public.srs_v2_session_result(ses.user_id, ses.id) || jsonb_build_object('duplicate', false);
end;
$$;

-- 12. Migración por usuario (15.3) con el bloqueo tomado.

-- Estabilidad de la conversión B: etapa 0 → w0; 1 y 2 → S tras uno y dos repasos de T1; ≥ 3 → S_max.
create or replace function public.srs_v2_conversion_stability(p_stage integer, p_imax integer)
returns double precision
language plpgsql
stable
set search_path = ''
as $$
declare
  ww double precision[] := (select x.w from public.srs_weights x where x.status = 'active' order by x.weights_version limit 1);
  tau constant double precision := (power(0.85::double precision, -2) - 1) / (19::double precision / 81);
  res record;
  t0 timestamptz := '2000-01-01 00:00:00+00';
  t timestamptz;
  k integer := 0;
begin
  if p_stage <= 0 then return ww[1]; end if;
  if p_stage >= 3 then return p_imax / tau; end if;
  select * into res from public.srs_v2_update(false, null, null, 0, 0, 0, null, null, 'G', false, null, null,
    '[{"q4": 10000, "r": -2, "nT": 1}, {"q4": 10000, "r": 0, "nT": 1}]'::jsonb, t0, 1, p_imax, t0 + interval '1 day',
    'vocabulary', 'L', ww, 0.85);
  t := t0;
  while k < p_stage loop
    t := greatest(t + interval '1 day',
                  t0 + make_interval(days => ceil(extract(epoch from res.due_at - t0) / 86400 - 1e-9)::integer));
    select * into res from public.srs_v2_update(true, res.stability, res.difficulty, res.n, res.lapses, res.exposures, res.t_last,
      res.due_at, res.rung, res.relearning, res.a, res.z_minus, '[{"q4": 10000, "r": 0, "nT": 1}]'::jsonb, t, 1,
      p_imax, t + interval '1 day', 'vocabulary', 'L', ww, 0.85);
    k := k + 1;
  end loop;
  return res.stability;
end;
$$;

create or replace function public.srs_v2_migrate_user_locked(p_user uuid, p_tz text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  s record;
  cw record;
  p public.user_word_progress;
  v_tz text := public.safe_time_zone(p_tz);
  v_sessions integer := 0;
  v_total integer;
  v_c integer;
  v_ratio numeric;
  v_full_conversion boolean;
  v_verified integer := 0;
  v_converted integer := 0;
  v_skipped integer := 0;
  v_now timestamptz;
  v_hash text;
  v_max_attempt bigint;
  v_lang text;
  rep record;
  v_stage integer; v_seen integer; v_ok integer; v_bad integer; v_last timestamptz; v_next timestamptz;
  v_is_due boolean;
  v_word text;
  v_match boolean;
  v_reason text;
  v_s double precision;
  v_due timestamptz;
  v_d double precision := (select least(10, greatest(1, x.w[5])) from public.srs_weights x where x.status = 'active' limit 1);
  tau constant double precision := (power(0.85::double precision, -2) - 1) / (19::double precision / 81);
begin
  -- 2. Sesiones confirmadas que afectan al SRS y no están aplicadas, en el orden canónico histórico.
  for s in
    select ls.id from public.learning_sessions ls
    where ls.user_id = p_user
      and not exists (select 1 from public.srs_applied_sessions a where a.session_id = ls.id)
    order by ls.completed_at, ls.id
  loop
    perform public.srs_v2_apply_session(s.id, 'replay', v_tz);
    v_sessions := v_sessions + 1;
  end loop;

  -- 15.3 paso 1: categoría C (sin ejercicio ni palabra, o lección modificada después del intento).
  select count(*),
         count(*) filter (where (a.exercise_id is null and a.word_id is null)
                             or (a.exercise_id is not null and e.updated_at > a.created_at))
    into v_total, v_c
  from public.exercise_attempts a left join public.exercises e on e.id = a.exercise_id
  where a.user_id = p_user;
  v_ratio := case when v_total > 0 then round(v_c::numeric / v_total, 4) end;
  v_full_conversion := coalesce(v_ratio > 0.05, false);

  -- 3/5. Verificación por unidad: se rehace v1 (apply_word_result) sobre la atribución reconstruida
  --      (15.2 A) en el orden canónico y se compara con user_word_progress.
  for p in select * from public.user_word_progress where user_id = p_user order by word_id loop
    v_stage := 0; v_seen := 0; v_ok := 0; v_bad := 0; v_last := null; v_next := null;
    for rep in
      select ls.completed_at, bool_and(a.is_correct) as ok
      from public.learning_sessions ls
      join public.exercise_attempts a on a.session_id = ls.id and a.is_first_try
      where ls.user_id = p_user and (
        a.word_id = p.word_id
        or (a.word_id is null and exists (
              select 1 from public.exercise_words ew join public.exercises e on e.id = ew.exercise_id
              where ew.exercise_id = a.exercise_id and ew.word_id = p.word_id
                and e.updated_at <= a.created_at and p.created_at <= ls.completed_at)))
      group by ls.id, ls.completed_at
      order by ls.completed_at, ls.id
    loop
      if rep.ok then
        v_is_due := v_seen = 0 or v_next is null or v_next <= rep.completed_at;
        if v_is_due then
          v_stage := v_stage + 1;
          v_next := rep.completed_at + make_interval(days => case v_stage when 1 then 1 when 2 then 3 when 3 then 7 else 21 end);
        end if;
        v_ok := v_ok + 1;
      else
        v_stage := 0;
        v_bad := v_bad + 1;
        v_next := rep.completed_at;
      end if;
      v_seen := v_seen + 1;
      v_last := rep.completed_at;
    end loop;
    v_match := v_seen > 0 and v_stage = p.stage and v_seen = p.seen_count and v_ok = p.correct_count
               and v_bad = p.incorrect_count and v_last is not distinct from p.last_reviewed_at
               and v_next is not distinct from p.next_review_at;
    select * into cw from public.concepts c where c.id = p.word_id and c.kind = 'lexical';
    if not found then
      v_skipped := v_skipped + 1;
      continue;
    end if;
    if v_match and not v_full_conversion
       and exists (select 1 from public.user_srs_state where user_id = p_user and concept_id = p.word_id
                   and dimension = 'vocabulary') then
      v_verified := v_verified + 1;
      continue;
    end if;
    if p.last_reviewed_at is null then
      v_skipped := v_skipped + 1;
      continue;
    end if;
    -- Conversión B (15.2): nunca aplaza lo que v1 ya tenía programado.
    v_reason := case when v_full_conversion then 'user_category_c'
                     when v_seen = 0 then 'not_reconstructed' else 'v1_mismatch' end;
    v_s := public.srs_v2_conversion_stability(p.stage, 45);
    v_due := least(coalesce(p.next_review_at, 'infinity'),
                   p.last_reviewed_at + make_interval(secs => least(45, v_s * tau
                     * (1 + 0.05::double precision * (2 * public.srs_v2_unit_hash(p_user, cw.id, 'vocabulary') - 1))) * 86400));
    insert into public.user_srs_state as x (user_id, concept_id, dimension, language_code, algorithm_version,
      weights_version, stability, difficulty, n, lapses, t_last, last_seen_at, due_at, due_effective_at,
      exposures, migration_source, migration_reason, rung, relearning, updated_at)
    values (p_user, cw.id, 'vocabulary', cw.language_code, 'srs-2.0.0', 'srs-2.0.0-w-initial',
           v_s, v_d, greatest(p.seen_count, 1), p.incorrect_count, p.last_reviewed_at, p.last_reviewed_at,
           v_due, v_due, greatest(p.seen_count, 1), 'converted', v_reason, 'G', coalesce(not p.last_result, false),
           clock_timestamp())
    on conflict (user_id, concept_id, dimension) do update set
      stability = excluded.stability, difficulty = excluded.difficulty, n = excluded.n, lapses = excluded.lapses,
      last_a = null, last_z_minus = null, t_last = excluded.t_last, last_seen_at = excluded.last_seen_at,
      due_at = excluded.due_at, due_effective_at = excluded.due_at, me_hint_at = null, me_hint_expires_at = null,
      exposures = excluded.exposures, migration_source = 'converted', migration_reason = excluded.migration_reason,
      rung = excluded.rung, relearning = excluded.relearning, updated_at = excluded.updated_at;
    v_converted := v_converted + 1;
  end loop;

  -- 3.4. Corte: v2_since, AL19 inicial por idioma y comprobante.
  v_now := clock_timestamp();
  update public.srs_user_head set v2_since = v_now, time_zone = v_tz, updated_at = now() where user_id = p_user;
  for v_lang in select distinct language_code from public.user_srs_state where user_id = p_user loop
    perform public.srs_v2_debt_init(p_user, v_lang, v_tz, 'migration');
  end loop;
  select encode(sha256(convert_to(coalesce(string_agg(a.session_id::text, ',' order by a.seq), ''), 'UTF8')), 'hex')
    into v_hash
  from public.srs_applied_sessions a where a.user_id = p_user and a.origin = 'replay';
  select max(id) into v_max_attempt from public.exercise_attempts where user_id = p_user;
  insert into public.srs_migration_cutoff (user_id, cutoff_at, time_zone, sessions, max_attempt_id,
    session_ids_hash, category_c_ratio, verified_units, converted_units, result)
  values (p_user, v_now, v_tz, v_sessions, v_max_attempt, v_hash, v_ratio, v_verified, v_converted,
          jsonb_build_object('skipped_units', v_skipped, 'full_conversion', v_full_conversion))
  on conflict (user_id) do nothing;
  insert into public.srs_migration_queue (user_id, status) values (p_user, 'done')
  on conflict (user_id) do update set status = 'done', updated_at = now();
  return jsonb_build_object('sessions', v_sessions, 'verified', v_verified, 'converted', v_converted,
                            'skipped', v_skipped, 'category_c_ratio', v_ratio);
end;
$$;

-- Trabajo de migración: encola usuarios con sesiones y los migra de a uno por transacción.
create or replace function public.srs_v2_enqueue_migrations()
returns integer
language sql
security definer
set search_path = ''
as $$
  with ins as (
    insert into public.srs_migration_queue (user_id)
    select distinct s.user_id from public.learning_sessions s
    where not exists (select 1 from public.srs_user_head h where h.user_id = s.user_id and h.v2_since is not null)
    on conflict (user_id) do nothing
    returning 1)
  select count(*)::integer from ins
$$;

create or replace function public.srs_v2_migrate_user(p_user uuid, p_tz text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_since timestamptz;
  v_tz text;
begin
  if not public.srs_v2_enabled() then
    raise exception 'srs_v2_disabled' using errcode = '55000';
  end if;
  insert into public.srs_user_head (user_id) values (p_user) on conflict (user_id) do nothing;
  select v2_since, coalesce(p_tz, time_zone, 'UTC') into v_since, v_tz
  from public.srs_user_head where user_id = p_user for update;
  if v_since is not null then
    return jsonb_build_object('already_migrated', true);
  end if;
  return public.srs_v2_migrate_user_locked(p_user, v_tz);
end;
$$;

-- Barrido de reparación (15.3 paso 4): debe dar cero.
create or replace function public.srs_v2_repair_sweep()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  s record;
  n integer := 0;
begin
  for s in
    select ls.id, ls.user_id, h.time_zone from public.learning_sessions ls
    join public.srs_user_head h on h.user_id = ls.user_id and h.v2_since is not null
    where not exists (select 1 from public.srs_applied_sessions a where a.session_id = ls.id)
    order by ls.user_id, ls.completed_at, ls.id
  loop
    perform public.srs_user_lock(s.user_id, s.time_zone);
    if not exists (select 1 from public.srs_applied_sessions a where a.session_id = s.id) then
      perform public.srs_v2_apply_session(s.id, 'repair', coalesce(s.time_zone, 'UTC'));
      n := n + 1;
    end if;
  end loop;
  return n;
end;
$$;

-- 13. Determinismo (13.2, K3): recalcula el estado del usuario recorriendo srs_applied_sessions por seq
--     con el t_srs, el tope y la zona guardados, y devuelve las unidades que no coinciden a 4 decimales.
--     Las unidades convertidas no se reconstruyen desde sesiones y se excluyen.
create or replace function public.srs_v2_recompute_check(p_user uuid)
returns table (concept_id text, dimension text, field text, stored text, recomputed text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  a record;
  u record;
  res record;
  cur record;
  w double precision[];
begin
  create temp table if not exists srs_v2_recompute_tmp (
    concept_id text, dimension text, s double precision, d double precision, n integer, lapses integer,
    exposures integer, t_last timestamptz, last_seen_at timestamptz, due_at timestamptz, rung text,
    relearning boolean, la double precision, lz double precision, primary key (concept_id, dimension)
  ) on commit drop;
  delete from srs_v2_recompute_tmp;
  for a in select * from public.srs_applied_sessions where user_id = p_user order by seq loop
    select x.w into w from public.srs_weights x where x.weights_version = a.weights_version;
    for u in
      select o.concept_id, o.dimension, min(o.level) as level,
             jsonb_agg(jsonb_build_object('q4', o.q4, 'r', o.r, 'nT', o.n_t) order by o.ord) as obs
      from public.srs_v2_observations(a.session_id) o group by o.concept_id, o.dimension
    loop
      select * into cur from srs_v2_recompute_tmp t where t.concept_id = u.concept_id and t.dimension = u.dimension;
      select * into res from public.srs_v2_update(found, cur.s, cur.d, cur.n, cur.lapses, cur.exposures, cur.t_last, cur.due_at,
        cur.rung, cur.relearning, cur.la, cur.lz, u.obs, a.t_srs,
        1 + 0.05::double precision * (2 * public.srs_v2_unit_hash(p_user, u.concept_id, u.dimension) - 1),
        a.imax, ((a.t_srs at time zone a.time_zone)::date + 1)::timestamp at time zone a.time_zone,
        u.dimension, public.srs_v2_target_rung(u.dimension, u.level), w,
        ((select params from public.srs_algorithm_versions where version = a.algorithm_version) ->> 'target_retention')::double precision);
      insert into srs_v2_recompute_tmp values (u.concept_id, u.dimension, res.stability::numeric(10, 4)::double precision,
        res.difficulty::numeric(6, 4)::double precision, res.n, res.lapses, res.exposures, res.t_last, res.last_seen_at,
        res.due_at, res.rung, res.relearning, res.a::numeric(6, 4)::double precision, res.z_minus::numeric(6, 4)::double precision)
      on conflict on constraint srs_v2_recompute_tmp_pkey do update set s = excluded.s, d = excluded.d, n = excluded.n,
        lapses = excluded.lapses, exposures = excluded.exposures, t_last = excluded.t_last,
        last_seen_at = excluded.last_seen_at, due_at = excluded.due_at, rung = excluded.rung,
        relearning = excluded.relearning, la = excluded.la, lz = excluded.lz;
    end loop;
  end loop;
  return query
  select x.concept_id, x.dimension, f.field, f.stored, f.recomputed
  from public.user_srs_state x
  left join srs_v2_recompute_tmp t on t.concept_id = x.concept_id and t.dimension = x.dimension
  cross join lateral (values
    ('stability', x.stability::text, t.s::numeric(10, 4)::text),
    ('difficulty', x.difficulty::text, t.d::numeric(6, 4)::text),
    ('n', x.n::text, t.n::text), ('lapses', x.lapses::text, t.lapses::text),
    ('exposures', x.exposures::text, t.exposures::text),
    ('t_last', x.t_last::text, t.t_last::text), ('due_at', x.due_at::text, t.due_at::text),
    ('rung', x.rung, t.rung)) as f(field, stored, recomputed)
  where x.user_id = p_user and x.migration_source is distinct from 'converted'
    and f.stored is distinct from f.recomputed;
end;
$$;

-- 14. Integración con el envío (13.3): envoltorio de submit_learning_session y trigger diferido.

do $$
begin
  if to_regprocedure('public.submit_learning_session_v1(uuid, text, text, timestamptz, jsonb, text)') is null then
    alter function public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text)
      rename to submit_learning_session_v1;
  end if;
end;
$$;
revoke all on function public.submit_learning_session_v1(uuid, text, text, timestamptz, jsonb, text)
  from public, anon, authenticated;

-- Misma firma, mismo resultado y mismos permisos. Con el v2 encendido, toma el bloqueo del usuario
-- (y lo migra si hace falta) ANTES de que se registren los hechos, y deja la zona horaria para el
-- trigger de aplicación.
create or replace function public.submit_learning_session(
  p_session_id uuid, p_kind text, p_lesson_id text, p_started_at timestamptz, p_attempts jsonb,
  p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tz text := public.safe_time_zone(p_time_zone);
begin
  if auth.uid() is not null and public.srs_v2_enabled() then
    perform public.srs_user_lock(auth.uid(), v_tz);
    perform set_config('polygo.srs_time_zone', v_tz, true);
  end if;
  return public.submit_learning_session_v1(p_session_id, p_kind, p_lesson_id, p_started_at, p_attempts,
                                           p_time_zone);
end;
$$;
revoke all on function public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text) from public, anon;
grant execute on function public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text) to authenticated;

-- Aplicación al confirmar: al final de la transacción del envío, cuando ya existen los intentos y las
-- correcciones del servidor (learning_submit_graded las inserta después de llamar a la RPC). Si falla,
-- falla el envío entero; no hay cola de respaldo.
create or replace function public.learning_sessions_srs_v2_apply()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tz text;
begin
  if not public.srs_v2_enabled() then
    return null;
  end if;
  v_tz := coalesce(nullif(current_setting('polygo.srs_time_zone', true), ''),
                   (select time_zone from public.srs_user_head where user_id = new.user_id), 'UTC');
  perform public.srs_user_lock(new.user_id, v_tz);
  if not exists (select 1 from public.srs_applied_sessions where session_id = new.id) then
    perform public.srs_v2_apply_session(new.id, 'online', v_tz);
  end if;
  return null;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.learning_sessions'::regclass
                 and tgname = 'learning_sessions_srs_v2_apply') then
    create constraint trigger learning_sessions_srs_v2_apply after insert on public.learning_sessions
      deferrable initially deferred for each row execute function public.learning_sessions_srs_v2_apply();
  end if;
end;
$$;

-- 15. Seguridad: sin acceso directo para la app; todo por funciones de servicio.
do $$
declare
  t text;
begin
  foreach t in array array['srs_v2_settings', 'srs_algorithm_versions', 'srs_weights', 'user_srs_state',
                           'srs_user_head', 'srs_applied_sessions', 'srs_migration_queue', 'srs_migration_cutoff',
                           'srs_user_debt_state', 'srs_user_debt_days', 'srs_session_plans', 'srs_hint_queue'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
  for i in 0..15 loop
    execute format('revoke all on public.user_srs_state_p%s from anon, authenticated', i);
  end loop;
end;
$$;

revoke execute on function
  public.srs_v2_enabled(), public.srs_v2_unit_hash(uuid, text, text), public.srs_v2_s4(text),
  public.srs_v2_assist_factor4(jsonb), public.srs_v2_quantize(integer, integer),
  public.srs_v2_target_rung(text, text), public.srs_v2_rung_for_mode(text, text), public.srs_v2_ladder(text),
  public.srs_v2_relative_rung(text, text, text), public.srs_v2_start_rung(text),
  public.srs_v2_update(boolean, double precision, double precision, integer, integer, integer, timestamptz,
    timestamptz, text, boolean, double precision, double precision, jsonb, timestamptz, double precision, integer,
    timestamptz, text, text, double precision[], double precision),
  public.srs_v2_session_source(uuid), public.srs_v2_observations(uuid), public.srs_v2_user_rhythm100(uuid, uuid),
  public.srs_v2_ipu(uuid, text), public.srs_v2_al19_evaluate(uuid, text, date, text, timestamptz, uuid),
  public.srs_v2_debt_init(uuid, text, text, text), public.srs_user_lock(uuid, text),
  public.srs_v2_session_result(uuid, uuid), public.srs_v2_apply_session(uuid, text, text),
  public.srs_v2_conversion_stability(integer, integer), public.srs_v2_migrate_user_locked(uuid, text),
  public.srs_v2_enqueue_migrations(), public.srs_v2_migrate_user(uuid, text), public.srs_v2_repair_sweep(),
  public.srs_v2_recompute_check(uuid), public.learning_sessions_srs_v2_apply(), public.srs_user_debt_days_check()
from public, anon, authenticated;

grant execute on function public.srs_v2_session_result(uuid, uuid), public.srs_v2_migrate_user(uuid, text),
  public.srs_v2_enqueue_migrations(), public.srs_v2_repair_sweep(), public.srs_v2_recompute_check(uuid)
to service_role;

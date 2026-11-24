-- Mastery Engine me-1.0.0 (docs/MASTERY_ENGINE_DESIGN.md rev. 2) y sugerencias del motor para el SRS
-- (docs/ADAPTIVE_LEARNING_DESIGN.md 7.2, 10.3). Réplica TS: shared/mastery.ts.
--
-- · model_eval canónico en SQL con numeric (M11): mastery_eval(usuario, concepto, dimensión, as_of).
--   P5 numérico con ln Γ (recurrencia + Stirling de 8 términos), Beta incompleta (Lentz, ≤ 300
--   iteraciones, error si no converge) y bisección de 40 pasos (5.8.3).
-- · Entrada: mastery_evidence_rows. concept_evidence (arquitectura, fase 2) todavía no existe; la
--   evidencia sale de las correcciones del servidor de la fase 2 (exercise_attempt_gradings, status
--   valid) y de los conceptos `target` del ítem. Las sesiones client_reported sólo cuentan como
--   exposición (arquitectura 7.4, pasos 5 y 6).
-- · user_concept_state (arquitectura 11) con model_detail (M10a) y knowledge_recompute_queue. Nunca lee
--   ninguna tabla del SRS ni de Adaptive (3.2, AL-P5): lo prueba supabase/tests/mastery.test.mjs por prosrc.
-- · srs_apply_me_hint (R1, 7.2): trabajo que sólo escribe due_effective_at, me_hint_at y
--   me_hint_expires_at (I4, con un trigger que rechaza cualquier otra columna).
--
-- me-1.0.0 queda habilitado para Adaptive = false: el motor calcula y guarda, pero no adelanta nada
-- hasta que se autorice (mastery_model_versions.enabled_for_adaptive).
--
-- Aditiva e idempotente. ESTADO: probada en PGlite. NO aplicada en producción.

create table if not exists public.mastery_model_versions (
  version text primary key check (version ~ '^me-[0-9]+\.[0-9]+\.[0-9]+$'),
  params jsonb not null,
  status text not null check (status in ('active', 'shadow', 'retired')),
  enabled_for_adaptive boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.mastery_model_versions (version, params, status, enabled_for_adaptive) values (
  'me-1.0.0',
  '{"H": 90, "H_conf": 90, "G": 7, "sigma": [0.5, 0.8, 1.0], "tau_R": 0.25, "tau_G": 0.5, "above_error": 0.5,
    "sufficiency": {"n_eff": 2, "items": 2}, "mastered": {"m": 0.8, "L": 0.6, "days": 2},
    "transfer": {"S_nov": 0.5, "index": 0.6}, "weak_m": 0.5, "epsilon": 0.05,
    "grid": [0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512], "speed": {"window": 20, "min": 3, "clamp_ms": [300, 120000]},
    "assist_floor": 0.25}'::jsonb,
  'active', false)
on conflict (version) do nothing;

create table if not exists public.user_concept_state (
  user_id uuid not null references public.profiles (id) on delete cascade,
  concept_id text not null,
  dimension text not null references public.ref_polygo_dimensions (id),
  language_code text not null,
  -- Exposición (de los eventos).
  first_exposed_at timestamptz,
  last_exposed_at timestamptz,
  exposure_count integer not null default 0,
  -- Contadores (de la evidencia activa).
  evidence_count integer not null default 0,
  first_try_count integer not null default 0,
  first_try_correct integer not null default 0,
  unassisted_first_try_correct integer not null default 0,
  assisted_count integer not null default 0,
  best_mode_rank_correct smallint,
  last_outcome text,
  last_correct_at timestamptz,
  last_incorrect_at timestamptz,
  current_correct_streak integer not null default 0,
  distinct_days integer not null default 0,
  max_retained_gap_s bigint,
  sum_log_response_ms numeric,
  -- Modelo (asíncrono, versionado). Nulos mientras sea insuficiente (P9).
  status text not null default 'insufficient' check (status in ('insufficient', 'in_progress', 'mastered')),
  weak boolean not null default false,
  mastery numeric(6, 4),
  confidence numeric(6, 4),
  retention_estimate numeric(6, 4),
  recall_speed numeric(10, 4),
  model_version text references public.mastery_model_versions (version),
  computed_at timestamptz,
  dirty_since timestamptz,
  model_detail jsonb,
  -- Punto de partida K6 (sin snapshots verificados todavía: siempre nulos).
  prior_snapshot_id bigint,
  prior_level text,
  prior_mastery numeric(6, 4),
  prior_confidence numeric(6, 4),
  prior_retention_estimate numeric(6, 4),
  prior_last_evidence_at timestamptz,
  prior_evidence_count integer,
  prior_model_version text,
  primary key (user_id, concept_id, dimension),
  constraint user_concept_state_concept_fkey
    foreign key (concept_id, language_code) references public.concepts (id, language_code),
  constraint user_concept_state_p9_check check (status <> 'insufficient' or (mastery is null and confidence is null))
);

create table if not exists public.knowledge_recompute_queue (
  user_id uuid not null references public.profiles (id) on delete cascade,
  concept_id text not null,
  dimension text not null,
  enqueued_at timestamptz not null default now(),
  processed_at timestamptz,
  primary key (user_id, concept_id, dimension)
);
create index if not exists knowledge_recompute_queue_pending_idx
  on public.knowledge_recompute_queue (enqueued_at) where processed_at is null;

alter table public.srs_hint_queue add column if not exists processed_at timestamptz;

-- 1. Numérico (5.8.3).

create or replace function public.mastery_ln_gamma(p_z numeric)
returns numeric
language plpgsql
immutable
set search_path = ''
as $$
declare
  z numeric := p_z;
  shift numeric := 0;
  z2 numeric;
  pw numeric;
  s numeric := 0;
  c numeric[] := array[1::numeric / 12, -1::numeric / 360, 1::numeric / 1260, -1::numeric / 1680,
                       1::numeric / 1188, -691::numeric / 360360, 1::numeric / 156, -3617::numeric / 122400];
begin
  if z <= 0 then
    raise exception 'mastery_ln_gamma: z > 0' using errcode = '22003';
  end if;
  while z < 10 loop
    shift := shift - ln(z);
    z := z + 1;
  end loop;
  z2 := 1 / (z * z);
  pw := 1 / z;
  for i in 1..8 loop
    s := s + c[i] * pw;
    pw := pw * z2;
  end loop;
  return round(shift + (z - 0.5) * ln(z) - z + 0.5 * ln(2 * pi()::numeric) + s, 24);
end;
$$;

create or replace function public.mastery_beta_cf(p_x numeric, p_a numeric, p_b numeric)
returns numeric
language plpgsql
immutable
set search_path = ''
as $$
declare
  tiny constant numeric := 1e-300;
  c numeric := 1;
  d numeric;
  h numeric;
  aa numeric;
  del numeric;
  m2 integer;
begin
  d := 1 - (p_a + p_b) * p_x / (p_a + 1);
  if abs(d) < tiny then d := tiny; end if;
  d := round(1 / d, 30);
  h := d;
  for m in 1..300 loop
    m2 := 2 * m;
    aa := m * (p_b - m) * p_x / ((p_a + m2 - 1) * (p_a + m2));
    d := 1 + aa * d; if abs(d) < tiny then d := tiny; end if;
    c := 1 + aa / c; if abs(c) < tiny then c := tiny; end if;
    d := round(1 / d, 30);
    h := round(h * d * c, 30);
    aa := -(p_a + m) * (p_a + p_b + m) * p_x / ((p_a + m2) * (p_a + m2 + 1));
    d := 1 + aa * d; if abs(d) < tiny then d := tiny; end if;
    c := round(1 + aa / c, 30); if abs(c) < tiny then c := tiny; end if;
    d := round(1 / d, 30);
    del := d * c;
    h := round(h * del, 30);
    if abs(del - 1) < 1e-15 then
      return h;
    end if;
  end loop;
  raise exception 'mastery_beta_inc: la fracción continua no convergió en 300 iteraciones' using errcode = '2201F';
end;
$$;

create or replace function public.mastery_beta_inc(p_x numeric, p_a numeric, p_b numeric)
returns numeric
language plpgsql
immutable
set search_path = ''
as $$
declare
  lbt numeric;
begin
  if p_x <= 0 then return 0; end if;
  if p_x >= 1 then return 1; end if;
  lbt := public.mastery_ln_gamma(p_a + p_b) - public.mastery_ln_gamma(p_a) - public.mastery_ln_gamma(p_b)
         + p_a * ln(p_x) + p_b * ln(1 - p_x);
  if lbt < -700 then
    return case when p_x < (p_a + 1) / (p_a + p_b + 2) then 0 else 1 end;
  end if;
  if p_x < (p_a + 1) / (p_a + p_b + 2) then
    return exp(lbt) * public.mastery_beta_cf(p_x, p_a, p_b) / p_a;
  end if;
  return 1 - exp(lbt) * public.mastery_beta_cf(1 - p_x, p_b, p_a) / p_b;
end;
$$;

create or replace function public.mastery_beta_p5(p_a numeric, p_b numeric)
returns numeric
language plpgsql
immutable
set search_path = ''
as $$
declare
  lo numeric := 0;
  hi numeric := 1;
  mid numeric;
begin
  for i in 1..40 loop
    mid := (lo + hi) / 2;
    if public.mastery_beta_inc(mid, p_a, p_b) < 0.05 then lo := mid; else hi := mid; end if;
  end loop;
  return (lo + hi) / 2;
end;
$$;

-- Escalera de Mastery 4.2 (propia del motor: no depende de ninguna función del SRS).
create or replace function public.mastery_rung_for_mode(p_dim text, p_mode text)
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

-- 2. Entrada (3.2): filas de evidencia de un par con sus pesos de entrada ya resueltos.

create or replace function public.mastery_exposures(p_user uuid, p_concept text)
returns table (at timestamptz, attempt_id bigint)
language sql
stable
set search_path = ''
as $$
  -- Ver el concepto es un hecho aunque la respuesta no esté validada (7.4, paso 6).
  select a.created_at, a.id from public.exercise_attempts a
  where a.user_id = p_user and (
    a.word_id = p_concept
    or exists (select 1 from public.exercise_words ew where ew.exercise_id = a.exercise_id and ew.word_id = p_concept)
    or exists (select 1 from public.exercise_attempt_gradings g join public.item_concepts ic on ic.item_id = g.item_id
               where g.attempt_id = a.id and ic.concept_id = p_concept))
$$;

create or replace function public.mastery_evidence_rows(p_user uuid, p_concept text, p_dim text, p_as_of timestamptz)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with ex as (select * from public.mastery_exposures(p_user, p_concept) where at <= p_as_of),
  item_tries as (
    select coalesce(g.item_id, e.item_id) as item_id, a.created_at as at, a.id
    from public.exercise_attempts a
    left join public.exercise_attempt_gradings g on g.attempt_id = a.id
    left join public.exercises e on e.id = a.exercise_id and e.updated_at <= a.created_at
    where a.user_id = p_user and a.is_first_try and coalesce(g.item_id, e.item_id) is not null
  ),
  ev as (
    select g.attempt_id, a.created_at, g.item_id, i.type, i.input_modality, i.assessment_mode, i.response_format,
           g.verdict, g.attempt_no = 1 as first_try, a.response_ms, g.assists, v.recommended_seconds,
           case when s.options is not null then jsonb_array_length(s.options)
                when v.grading_mode_id = 'pair_set.v1' then jsonb_array_length(v.payload -> 'pairs') end as choices
    from public.exercise_attempt_gradings g
    join public.exercise_attempts a on a.id = g.attempt_id
    join public.exercise_items i on i.id = g.item_id
    join public.exercise_item_versions v on v.id = g.item_version_id
    join public.exercise_presentations p on p.id = g.presentation_id
    left join public.exercise_option_sets s on s.id = p.option_set_id
    join public.item_concepts ic on ic.item_id = g.item_id and ic.concept_id = p_concept
                                 and ic.dimension = p_dim and ic.role = 'target'
    where g.user_id = p_user and g.status = 'valid' and a.created_at <= p_as_of
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'eventId', ev.attempt_id, 'recordedAtMs', (extract(epoch from ev.created_at) * 1000)::numeric,
    'itemId', ev.item_id, 'itemType', ev.type, 'inputModality', ev.input_modality,
    'assessmentMode', ev.assessment_mode, 'responseFormat', ev.response_format, 'verdict', ev.verdict,
    'score', null, 'isFirstTry', ev.first_try, 'responseMs', ev.response_ms,
    'sinceLastSeenS', (select extract(epoch from ev.created_at - max(x.at)) from ex x
                       where (x.at, x.attempt_id) < (ev.created_at, ev.attempt_id)),
    'choices', ev.choices, 'assists', ev.assists, 'recommendedSeconds', ev.recommended_seconds,
    'prevItemFirstTryMs', (select (extract(epoch from max(t.at)) * 1000)::numeric from item_tries t
                           where t.item_id = ev.item_id and (t.at, t.id) < (ev.created_at, ev.attempt_id)))
    order by ev.created_at, ev.attempt_id), '[]'::jsonb)
  from ev
$$;

-- 3. model_eval canónico (5.2–5.12) en numeric. Devuelve el resultado publicado (4 decimales) y el
--    detalle que lo explica (M10a).
create or replace function public.mastery_eval(p_user uuid, p_concept text, p_dim text, p_as_of timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  c record;
  e jsonb;
  evrows jsonb;
  ladder text[];
  tgt text;
  t_idx integer;
  k text;
  k_idx integer;
  t_ms numeric;
  t_last numeric;
  t_first numeric;
  last_exp numeric;
  rho numeric; sig numeric; phi numeric; w numeric; s numeric; g numeric; a numeric; hits numeric; misses numeric;
  rn numeric[] := array[0, 0, 0]; rs numeric[] := array[0, 0, 0]; rf numeric[] := array[0, 0, 0];
  direct_items text[] := '{}'; direct_days text[] := '{}'; seen_items text[] := '{}'; seen_pairs text[] := '{}';
  s_nov numeric := 0; f_nov numeric := 0; s_far numeric := 0; f_far numeric := 0;
  evidence jsonb := '[]';
  s_dir numeric := 0; f_dir numeric := 0; w_dir numeric := 0; s_ind numeric := 0; f_ind numeric := 0;
  phi0 numeric; alpha numeric; beta numeric; m numeric; sd numeric; n_eff numeric; v_lower numeric;
  pi_ numeric; f_ numeric; conf numeric; idx numeric; transfer_met boolean; sufficient boolean;
  status text := 'insufficient'; weak boolean := false;
  speeds jsonb := '{}'; v_t numeric; sp_rows integer; sp numeric; imp integer;
  probes integer := 0; spaced integer := 0; demonstrated boolean := false;
  grid numeric[] := array[0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
  logl numeric[] := array[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  post numeric[]; mx numeric; z numeric; retention numeric; half_life numeric; cum numeric;
  dx numeric; p numeric; lnp numeric; xx numeric;
  day constant numeric := 86400000;
  is_new boolean; had_other boolean; atleast_g boolean;
begin
  select * into c from public.concepts where id = p_concept;
  ladder := case p_dim when 'production' then array['P', 'F'] when 'comprehension' then array['U'] else array['R', 'G', 'L'] end;
  tgt := case p_dim when 'production' then case when c.level in ('A1', 'A2') then 'P' else 'F' end
                    when 'comprehension' then 'U' else 'L' end;
  t_idx := array_position(ladder, tgt);
  select coalesce(jsonb_agg(x order by (x ->> 'recordedAtMs')::numeric, (x ->> 'eventId')::bigint), '[]') into evrows
  from jsonb_array_elements(public.mastery_evidence_rows(p_user, p_concept, p_dim, p_as_of)) x
  where (x ->> 'isFirstTry')::boolean
    and public.mastery_rung_for_mode(p_dim, x ->> 'assessmentMode') is not null;
  select (extract(epoch from max(at)) * 1000)::numeric into last_exp from public.mastery_exposures(p_user, p_concept) where at <= p_as_of;
  if jsonb_array_length(evrows) = 0 then
    return jsonb_build_object('status', 'insufficient', 'sufficient', false, 'mastery', null, 'confidence', null,
      'v_lower', null, 'weak', false, 'retention', null, 'half_life_days', null, 'retention_sufficient', false,
      'retention_demonstrated', false, 'recall_speed', null,
      'detail', jsonb_build_object('n_eff', 0, 'direct_items', 0, 'evidence', '[]'::jsonb));
  end if;
  t_first := (evrows -> 0 ->> 'recordedAtMs')::numeric;
  t_last := (evrows -> (jsonb_array_length(evrows) - 1) ->> 'recordedAtMs')::numeric;

  for e in select x from jsonb_array_elements(evrows) x loop
    k := public.mastery_rung_for_mode(p_dim, e ->> 'assessmentMode');
    k_idx := array_position(ladder, k);
    t_ms := (e ->> 'recordedAtMs')::numeric;
    rho := case when e ->> 'prevItemFirstTryMs' is null then 1
                else least(1, (t_ms - (e ->> 'prevItemFirstTryMs')::numeric) / day / 7) end;
    sig := case when e ->> 'sinceLastSeenS' is null or (e ->> 'sinceLastSeenS')::numeric < 600 then 0.5
                when (e ->> 'sinceLastSeenS')::numeric < 86400 then 0.8 else 1 end;
    phi := power(2::numeric, -((t_last - t_ms) / day) / 90);
    w := rho * sig * phi;
    s := case e ->> 'verdict' when 'correct' then 1 when 'typo' then 0.9 else 0 end;
    g := case when e ->> 'responseFormat' in ('select', 'pairs') and coalesce((e ->> 'choices')::integer, 0) > 0
              then 1::numeric / (e ->> 'choices')::integer else 0 end;
    a := public.mastery_assist_factor(e -> 'assists');
    hits := w * (1 - g) * s * a;
    misses := w * (1 - s * a);
    rn[k_idx] := rn[k_idx] + w; rs[k_idx] := rs[k_idx] + hits; rf[k_idx] := rf[k_idx] + misses;
    evidence := evidence || jsonb_build_object('eventId', (e ->> 'eventId')::bigint, 'rung', k, 'w', round(w, 4),
                                               'hits', round(hits, 4), 'misses', round(misses, 4));
    if k_idx >= t_idx then
      direct_items := array(select distinct unnest(direct_items || array[e ->> 'itemId']));
      direct_days := array(select distinct unnest(direct_days || array[to_char(to_timestamp(t_ms / 1000) at time zone 'UTC', 'YYYY-MM-DD')]));
    end if;
    atleast_g := p_dim in ('comprehension', 'production') or k_idx >= 2;
    is_new := e ->> 'prevItemFirstTryMs' is null and not ((e ->> 'itemId') = any (seen_items));
    had_other := exists (select 1 from unnest(seen_items) it where it <> e ->> 'itemId');
    if is_new and had_other and atleast_g then
      s_nov := s_nov + sig * phi * (1 - g) * s * a;
      f_nov := f_nov + sig * phi * (1 - s * a);
      if not ((e ->> 'itemType') || '|' || (e ->> 'inputModality')) = any (seen_pairs) then
        s_far := s_far + sig * phi * (1 - g) * s * a;
        f_far := f_far + sig * phi * (1 - s * a);
      end if;
    end if;
    seen_items := seen_items || (e ->> 'itemId');
    seen_pairs := seen_pairs || ((e ->> 'itemType') || '|' || (e ->> 'inputModality'));
  end loop;

  for i in 1..cardinality(ladder) loop
    if i >= t_idx then
      s_dir := s_dir + rs[i];
      f_dir := f_dir + case when i = t_idx then rf[i] else 0.5 * rf[i] end;
      w_dir := w_dir + rn[i];
    else
      s_ind := s_ind + (case when ladder[i] = 'R' then 0.25 else 0.5 end) * rs[i];
      f_ind := f_ind + rf[i];
    end if;
  end loop;
  s_ind := least(s_ind, s_dir);
  phi0 := power(2::numeric, -((t_last - t_first) / day) / 90);
  alpha := phi0 + s_dir + s_ind;
  beta := phi0 + f_dir + f_ind;
  m := alpha / (alpha + beta);
  sd := sqrt(m * (1 - m) / (alpha + beta + 1));
  n_eff := w_dir + f_ind;
  sufficient := round(n_eff, 4) >= 2 and cardinality(direct_items) >= 2;
  idx := (1 + s_nov) / (2 + s_nov + f_nov);
  transfer_met := round(s_nov, 4) >= 0.5 and round(idx, 4) >= 0.6;

  -- Velocidad (5.12) por escalón.
  for i in 1..cardinality(ladder) loop
    select count(*), exp(avg(ln(least(120000, greatest(300, (x ->> 'responseMs')::numeric))
                                / (1000 * (x ->> 'recommendedSeconds')::numeric))))
      into sp_rows, sp
    from (select x, ord from jsonb_array_elements(evrows) with ordinality as t(x, ord)
          where public.mastery_rung_for_mode(p_dim, x ->> 'assessmentMode') = ladder[i]
            and public.mastery_assist_factor(x -> 'assists') = 1 and x ->> 'verdict' in ('correct', 'typo')
            and x ->> 'responseMs' is not null
          order by ord desc limit 20) q;
    select count(*) into imp from jsonb_array_elements(evrows) x
    where public.mastery_rung_for_mode(p_dim, x ->> 'assessmentMode') = ladder[i] and x ->> 'verdict' = 'incorrect'
      and x ->> 'responseMs' is not null
      and (x ->> 'responseMs')::numeric < 0.25 * 1000 * (x ->> 'recommendedSeconds')::numeric;
    if sp_rows < 3 then sp := null; end if;
    speeds := speeds || jsonb_build_object(ladder[i], jsonb_build_object(
      'N', round(rn[i], 4), 'S', round(rs[i], 4), 'F', round(rf[i], 4),
      'speed', round(sp, 4), 'speed_rows', sp_rows, 'impulsive_errors', imp));
    if ladder[i] = tgt then v_t := sp; end if;
  end loop;

  -- Retención (5.11).
  for e in select x from jsonb_array_elements(evrows) x
           where public.mastery_assist_factor(x -> 'assists') = 1 and x ->> 'sinceLastSeenS' is not null
             and (p_dim in ('comprehension', 'production')
                  or array_position(ladder, public.mastery_rung_for_mode(p_dim, x ->> 'assessmentMode')) >= 2) loop
    probes := probes + 1;
    if (e ->> 'sinceLastSeenS')::numeric >= 86400 then spaced := spaced + 1; end if;
    s := case e ->> 'verdict' when 'correct' then 1 when 'typo' then 0.9 else 0 end;
    if s >= 0.9 and (e ->> 'sinceLastSeenS')::numeric >= 7 * 86400 then demonstrated := true; end if;
    g := case when e ->> 'responseFormat' in ('select', 'pairs') and coalesce((e ->> 'choices')::integer, 0) > 0
              then 1::numeric / (e ->> 'choices')::integer else 0 end;
    rho := case when e ->> 'prevItemFirstTryMs' is null then 1
                else least(1, ((e ->> 'recordedAtMs')::numeric - (e ->> 'prevItemFirstTryMs')::numeric) / day / 7) end;
    for i in 1..12 loop
      xx := -((e ->> 'sinceLastSeenS')::numeric / 86400) / grid[i];
      p := g + (1 - g) * 0.95 * (case when xx < -2000 then 0 else power(2::numeric, xx) end);
      lnp := case when g = 0 then ln(0.95) + xx * ln(2::numeric) else ln(p) end;
      logl[i] := logl[i] + rho * (s * lnp + (1 - s) * ln(1 - p));
    end loop;
  end loop;
  if spaced >= 2 and last_exp is not null then
    select max(v) into mx from unnest(logl) v;
    post := array(select case when logl[i] - mx < -700 then 0 else exp(logl[i] - mx) end from generate_series(1, 12) i);
    select sum(v) into z from unnest(post) v;
    post := array(select post[i] / z from generate_series(1, 12) i);
    dx := (extract(epoch from p_as_of) * 1000 - last_exp) / day;
    select sum(post[i] * 0.95 * (case when -dx / grid[i] < -2000 then 0 else power(2::numeric, -dx / grid[i]) end))
      into retention from generate_series(1, 12) i;
    cum := 0;
    for i in 1..12 loop
      cum := cum + post[i];
      if cum >= 0.5 then half_life := grid[i]; exit; end if;
    end loop;
  end if;

  if sufficient then
    v_lower := public.mastery_beta_p5(alpha, beta);
    pi_ := greatest(0, 1 - sd / 0.2887);
    f_ := power(2::numeric, -((extract(epoch from p_as_of) * 1000 - t_last) / day) / 90);
    conf := pi_ * f_;
    status := case when round(m, 4) >= 0.8 and round(v_lower, 4) >= 0.6 and cardinality(direct_days) >= 2 and transfer_met
                   then 'mastered' else 'in_progress' end;
    weak := round(m, 4) < 0.5;
  end if;

  return jsonb_build_object(
    'status', status, 'sufficient', sufficient,
    'mastery', case when sufficient then round(m, 4) end,
    'confidence', case when sufficient then round(conf, 4) end,
    'lower', case when sufficient then round(v_lower, 4) end,
    'weak', weak, 'retention', round(retention, 4), 'half_life_days', half_life,
    'retention_sufficient', spaced >= 2, 'retention_demonstrated', demonstrated,
    'recall_speed', round(v_t, 4), 'model_version', 'me-1.0.0', 'as_of', p_as_of,
    'detail', jsonb_build_object(
      'alpha', round(alpha, 6), 'beta', round(beta, 6), 'sd', round(sd, 6), 'n_eff', round(n_eff, 4),
      'direct_items', cardinality(direct_items), 'direct_days', cardinality(direct_days),
      't_last', to_timestamp(t_last / 1000), 'last_exposure', to_timestamp(last_exp / 1000),
      'transfer', jsonb_build_object('s_nov', round(s_nov, 4), 'index', round(idx, 4), 'met', transfer_met,
                                     'far', jsonb_build_object('s_nov', round(s_far, 4), 'index', round((1 + s_far) / (2 + s_far + f_far), 4))),
      'rungs', speeds, 'probes', probes, 'spaced_probes', spaced,
      'retention_grid', case when post is null then null else to_jsonb(array(select round(v, 4) from unnest(post) v)) end,
      'evidence', (select coalesce(jsonb_agg(v), '[]') from (
                     select v from jsonb_array_elements(evidence) with ordinality as t(v, o) order by o desc limit 50) q)));
end;
$$;

create or replace function public.mastery_assist_factor(p_assists jsonb)
returns numeric
language sql
immutable
set search_path = ''
as $$
  with v as (
    select coalesce(p_assists, '{}'::jsonb) as j),
  n as (
    select (case jsonb_typeof(j -> k) when 'boolean' then (case when (j ->> k) = 'true' then 1 else 0 end)
                                      when 'number' then (j ->> k)::numeric else 0 end) as x, k
    from v, unnest(array['audio_replays', 'slow_audio_plays', 'prompt_audio_plays', 'reading_visible', 'hints_revealed']) k)
  select greatest(0.25,
    (select coalesce(case when x > 1 then power(0.85, floor(x) - 1) else 1 end, 1) from n where k = 'audio_replays')
    * (select case when x >= 1 then 0.7 else 1 end from n where k = 'slow_audio_plays')
    * (select case when x >= 1 then 0.8 else 1 end from n where k = 'prompt_audio_plays')
    * (select case when x >= 1 then 0.6 else 1 end from n where k = 'reading_visible')
    * (select case when x >= 1 then power(0.4, floor(x)) else 1 end from n where k = 'hints_revealed'))
$$;

-- 4. Estado y cola (arquitectura 11, 7.4 paso 3: se recalcula desde la evidencia, no con sumas).

create or replace function public.mastery_recompute_unit(p_user uuid, p_concept text, p_dim text, p_as_of timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  r jsonb := public.mastery_eval(p_user, p_concept, p_dim, p_as_of);
  evrows jsonb := public.mastery_evidence_rows(p_user, p_concept, p_dim, p_as_of);
  v_lang text := (select language_code from public.concepts where id = p_concept);
begin
  insert into public.user_concept_state as u (user_id, concept_id, dimension, language_code,
    first_exposed_at, last_exposed_at, exposure_count, evidence_count, first_try_count, first_try_correct,
    unassisted_first_try_correct, assisted_count, best_mode_rank_correct, last_outcome, last_correct_at,
    last_incorrect_at, current_correct_streak, distinct_days, max_retained_gap_s, sum_log_response_ms,
    status, weak, mastery, confidence, retention_estimate, recall_speed, model_version, computed_at,
    dirty_since, model_detail)
  select p_user, p_concept, p_dim, v_lang,
    (select min(at) from public.mastery_exposures(p_user, p_concept) where at <= p_as_of),
    (select max(at) from public.mastery_exposures(p_user, p_concept) where at <= p_as_of),
    (select count(*) from public.mastery_exposures(p_user, p_concept) where at <= p_as_of),
    jsonb_array_length(evrows),
    (select count(*) from jsonb_array_elements(evrows) x where (x ->> 'isFirstTry')::boolean),
    (select count(*) from jsonb_array_elements(evrows) x where (x ->> 'isFirstTry')::boolean and x ->> 'verdict' in ('correct', 'typo')),
    (select count(*) from jsonb_array_elements(evrows) x where (x ->> 'isFirstTry')::boolean and x ->> 'verdict' in ('correct', 'typo')
                                                       and public.mastery_assist_factor(x -> 'assists') = 1),
    (select count(*) from jsonb_array_elements(evrows) x where public.mastery_assist_factor(x -> 'assists') < 1),
    (select max(m.retrieval_rank) from jsonb_array_elements(evrows) x join public.ref_assessment_modes m on m.id = x ->> 'assessmentMode'
     where (x ->> 'isFirstTry')::boolean and x ->> 'verdict' in ('correct', 'typo') and public.mastery_assist_factor(x -> 'assists') = 1),
    (select x ->> 'verdict' from jsonb_array_elements(evrows) with ordinality t(x, o) order by o desc limit 1),
    (select max(to_timestamp((x ->> 'recordedAtMs')::numeric / 1000)) from jsonb_array_elements(evrows) x where x ->> 'verdict' in ('correct', 'typo')),
    (select max(to_timestamp((x ->> 'recordedAtMs')::numeric / 1000)) from jsonb_array_elements(evrows) x where x ->> 'verdict' = 'incorrect'),
    coalesce((select count(*) from jsonb_array_elements(evrows) with ordinality t(x, o)
              where (x ->> 'isFirstTry')::boolean and o > coalesce((select max(o2) from jsonb_array_elements(evrows) with ordinality t2(y, o2)
                                                                     where (y ->> 'isFirstTry')::boolean and y ->> 'verdict' = 'incorrect'), 0)), 0),
    (select count(distinct (to_timestamp((x ->> 'recordedAtMs')::numeric / 1000) at time zone 'UTC')::date) from jsonb_array_elements(evrows) x),
    (select max((x ->> 'sinceLastSeenS')::numeric)::bigint from jsonb_array_elements(evrows) x
     where (x ->> 'isFirstTry')::boolean and x ->> 'verdict' in ('correct', 'typo')),
    (select sum(ln((x ->> 'responseMs')::numeric)) from jsonb_array_elements(evrows) x
     where (x ->> 'isFirstTry')::boolean and (x ->> 'responseMs')::numeric > 0),
    r ->> 'status', (r ->> 'weak')::boolean, (r ->> 'mastery')::numeric, (r ->> 'confidence')::numeric,
    (r ->> 'retention')::numeric, (r ->> 'recall_speed')::numeric, 'me-1.0.0', p_as_of, null,
    jsonb_build_object('lower', r -> 'lower', 'half_life_days', r -> 'half_life_days',
                       'retention_sufficient', r -> 'retention_sufficient',
                       'retention_demonstrated', r -> 'retention_demonstrated', 'as_of', p_as_of) || (r -> 'detail')
  on conflict (user_id, concept_id, dimension) do update set
    first_exposed_at = excluded.first_exposed_at, last_exposed_at = excluded.last_exposed_at,
    exposure_count = excluded.exposure_count, evidence_count = excluded.evidence_count,
    first_try_count = excluded.first_try_count, first_try_correct = excluded.first_try_correct,
    unassisted_first_try_correct = excluded.unassisted_first_try_correct, assisted_count = excluded.assisted_count,
    best_mode_rank_correct = excluded.best_mode_rank_correct, last_outcome = excluded.last_outcome,
    last_correct_at = excluded.last_correct_at, last_incorrect_at = excluded.last_incorrect_at,
    current_correct_streak = excluded.current_correct_streak, distinct_days = excluded.distinct_days,
    max_retained_gap_s = excluded.max_retained_gap_s, sum_log_response_ms = excluded.sum_log_response_ms,
    status = excluded.status, weak = excluded.weak, mastery = excluded.mastery, confidence = excluded.confidence,
    retention_estimate = excluded.retention_estimate, recall_speed = excluded.recall_speed,
    model_version = excluded.model_version, computed_at = excluded.computed_at, dirty_since = null,
    model_detail = excluded.model_detail;
  -- 10.3: el trigger de Adaptive encola la sugerencia; el motor no escribe nada del SRS.
  return r;
end;
$$;

create or replace function public.mastery_enqueue_hint()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.srs_hint_queue (user_id, concept_id, dimension)
  values (new.user_id, new.concept_id, new.dimension)
  on conflict (user_id, concept_id, dimension) do update set enqueued_at = now(), processed_at = null;
  return null;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.user_concept_state'::regclass and tgname = 'user_concept_state_hint') then
    create trigger user_concept_state_hint after insert or update of computed_at on public.user_concept_state
      for each row execute function public.mastery_enqueue_hint();
  end if;
end;
$$;

-- Una corrección nueva marca sus conceptos (cualquier rol: también cambia la exposición).
create or replace function public.mastery_mark_dirty()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.knowledge_recompute_queue (user_id, concept_id, dimension)
  select new.user_id, ic.concept_id, ic.dimension from public.item_concepts ic where ic.item_id = new.item_id
  on conflict (user_id, concept_id, dimension) do update set enqueued_at = now(), processed_at = null;
  update public.user_concept_state u set dirty_since = coalesce(u.dirty_since, now())
  where u.user_id = new.user_id and (u.concept_id, u.dimension) in
    (select ic.concept_id, ic.dimension from public.item_concepts ic where ic.item_id = new.item_id);
  return null;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.exercise_attempt_gradings'::regclass and tgname = 'exercise_attempt_gradings_mastery_dirty') then
    create trigger exercise_attempt_gradings_mastery_dirty after insert on public.exercise_attempt_gradings
      for each row execute function public.mastery_mark_dirty();
  end if;
end;
$$;

create or replace function public.mastery_process_queue(p_limit integer default 500, p_as_of timestamptz default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  q record;
  n integer := 0;
  v_as_of timestamptz := coalesce(p_as_of, clock_timestamp());
begin
  for q in select * from public.knowledge_recompute_queue where processed_at is null
           order by enqueued_at limit p_limit for update skip locked loop
    if exists (select 1 from public.concepts where id = q.concept_id) then
      perform public.mastery_recompute_unit(q.user_id, q.concept_id, q.dimension, v_as_of);
    end if;
    update public.knowledge_recompute_queue set processed_at = clock_timestamp()
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
    n := n + 1;
  end loop;
  return n;
end;
$$;

-- 5. R1 (7.2): sugerencia del motor. Sólo escribe due_effective_at, me_hint_at y me_hint_expires_at,
--    con `update … where updated_at = <leído>` (10.3). I4: el trigger rechaza cualquier otra columna.
create or replace function public.user_srs_state_hint_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_setting('polygo.srs_writer', true) = 'hint' and (
       new.stability is distinct from old.stability or new.difficulty is distinct from old.difficulty
       or new.n is distinct from old.n or new.lapses is distinct from old.lapses
       or new.exposures is distinct from old.exposures or new.rung is distinct from old.rung
       or new.relearning is distinct from old.relearning or new.due_at is distinct from old.due_at
       or new.t_last is distinct from old.t_last or new.last_seen_at is distinct from old.last_seen_at
       or new.algorithm_version is distinct from old.algorithm_version
       or new.weights_version is distinct from old.weights_version
       or new.updated_at is distinct from old.updated_at or new.last_a is distinct from old.last_a
       or new.last_z_minus is distinct from old.last_z_minus) then
    raise exception 'user_srs_state: el trabajo de sugerencias sólo puede escribir due_effective_at y la sugerencia (I4)'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.user_srs_state'::regclass and tgname = 'user_srs_state_hint_guard') then
    create trigger user_srs_state_hint_guard before update on public.user_srs_state
      for each row execute function public.user_srs_state_hint_guard();
  end if;
end;
$$;

create or replace function public.srs_apply_me_hint(p_limit integer default 500, p_now timestamptz default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  q record;
  s public.user_srs_state;
  me public.user_concept_state;
  v_now timestamptz := coalesce(p_now, clock_timestamp());
  v_tz text;
  v_enabled boolean;
  v_isrs interval;
  v_due_me timestamptz;
  v_d1 timestamptz;
  v_cand timestamptz;
  v_hl numeric;
  n integer := 0;
begin
  perform set_config('polygo.srs_writer', 'hint', true);
  for q in select * from public.srs_hint_queue where processed_at is null order by enqueued_at
           limit p_limit for update skip locked loop
    update public.srs_hint_queue set processed_at = clock_timestamp()
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
    select * into s from public.user_srs_state
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
    continue when not found;
    select * into me from public.user_concept_state
    where user_id = q.user_id and concept_id = q.concept_id and dimension = q.dimension;
    select enabled_for_adaptive into v_enabled from public.mastery_model_versions where version = me.model_version;
    v_hl := (me.model_detail ->> 'half_life_days')::numeric;
    v_isrs := s.due_at - s.t_last;
    -- E(u, t): cualquier dato nulo, no finito, atrasado o fuera de versión → sin adelanto.
    if me.user_id is null or not coalesce(v_enabled, false)
       or not coalesce((me.model_detail ->> 'retention_sufficient')::boolean, false)
       or v_hl is null or v_hl <= 0 or me.last_exposed_at is null or me.last_exposed_at > v_now
       or (me.dirty_since is not null and v_now - me.dirty_since > interval '72 hours')
       or me.computed_at is null or v_now - me.computed_at > interval '7 days'
       or s.stability is null or v_isrs <= interval '0' then
      continue;
    end if;
    v_tz := coalesce((select time_zone from public.srs_user_head where user_id = q.user_id), 'UTC');
    v_due_me := me.last_exposed_at + make_interval(secs => (v_hl * log(2::numeric, 1 / 0.85::numeric) * 86400)::double precision);
    v_d1 := ((s.last_seen_at at time zone v_tz)::date + 1)::timestamp at time zone v_tz;
    v_cand := greatest(v_due_me, greatest(s.t_last + 0.5 * v_isrs, v_d1));
    continue when v_cand >= s.due_at;
    update public.user_srs_state set due_effective_at = v_cand, me_hint_at = v_now,
      me_hint_expires_at = least(v_now + interval '72 hours', me.computed_at + interval '7 days')
    where user_id = s.user_id and concept_id = s.concept_id and dimension = s.dimension
      and updated_at = s.updated_at;
    if found then n := n + 1; end if;
  end loop;
  perform set_config('polygo.srs_writer', '', true);
  return n;
end;
$$;

-- 6. Seguridad.
alter table public.mastery_model_versions enable row level security;
alter table public.user_concept_state enable row level security;
alter table public.knowledge_recompute_queue enable row level security;
revoke all on public.mastery_model_versions, public.user_concept_state, public.knowledge_recompute_queue
  from anon, authenticated;

revoke execute on function public.mastery_rung_for_mode(text, text), public.mastery_ln_gamma(numeric), public.mastery_beta_cf(numeric, numeric, numeric),
  public.mastery_beta_inc(numeric, numeric, numeric), public.mastery_beta_p5(numeric, numeric),
  public.mastery_exposures(uuid, text), public.mastery_evidence_rows(uuid, text, text, timestamptz),
  public.mastery_eval(uuid, text, text, timestamptz), public.mastery_assist_factor(jsonb),
  public.mastery_recompute_unit(uuid, text, text, timestamptz), public.mastery_enqueue_hint(),
  public.mastery_mark_dirty(), public.mastery_process_queue(integer, timestamptz),
  public.user_srs_state_hint_guard(), public.srs_apply_me_hint(integer, timestamptz)
from public, anon, authenticated;

grant execute on function public.mastery_process_queue(integer, timestamptz),
  public.srs_apply_me_hint(integer, timestamptz), public.mastery_eval(uuid, text, text, timestamptz),
  public.mastery_evidence_rows(uuid, text, text, timestamptz)
to service_role;

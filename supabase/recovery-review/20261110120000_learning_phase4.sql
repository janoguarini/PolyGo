-- Fase 4 (docs/LEARNING_PHASE4.md): cierre funcional de los repasos del servidor y del motor en la app.
--
--   1. srs_unit_updates: historial por unidad de cada actualización del SRS v2 (error pleno, informativa),
--      escrito por la misma vía única (srs_v2_apply_session). Da el «≥ 2 errores plenos en 30 días» de R5
--      y el «λ ≥ 4 en 30 días» de AL17 (7.3, 19.3), con la hora del SRS (t_srs) y no la del cliente.
--   2. Repasos del servidor para todo concepto léxico con palabra publicada, en cualquier dimensión
--      (vocabulario y producción en el catálogo actual), con ítems de un único concepto `target` y
--      corrección objetiva (exact_option.v1 / normalized_text.v1). Gramática y comprensión no tienen
--      conceptos en el catálogo; free_production no tiene corrección automática (LEARNING_PHASE4.md §4).
--   3. learning_review_prepare: dice si el v2 está encendido y migra en línea al usuario (srs_user_lock).
--   4. learning_review_content: lo que la app muestra de cada presentación, sin la respuesta.
--   5. review_presentation_answers + learning_review_answer: la corrección del servidor de cada respuesta
--      durante el repaso; la primera respuesta registrada es la que vale (el envío final tiene que
--      coincidir). No es evidencia: ni el SRS ni el motor la leen; la evidencia sigue siendo
--      exercise_attempt_gradings, que se escribe sólo al enviar.
--   6. get_learning_mastery: estados visibles del motor para la app (14, AL12), con interruptor propio
--      (mastery_model_versions.enabled_for_display, apagado).
--
-- No cambia: submit_learning_session ni su cuerpo v1, SRS v1, Ranked, Plus, srs_v2_update, el motor
-- (mastery_*), polygo.answers.v1 ni las presentaciones (inmutables). Reemplaza (create or replace, misma
-- firma) srs_v2_apply_session (sólo agrega la fila de historial y registra la versión real del armador),
-- review_item_candidates, learning_review_candidates, learning_start_review (une también por
-- dimensión) y learning_submit_review_graded.
--
-- Aditiva e idempotente (sin DROP ni DELETE). ESTADO: probada en PGlite (supabase/tests/phase4.test.mjs).
-- NO aplicada en producción.

-- 1. Historial por unidad.
create table if not exists public.srs_unit_updates (
  session_id uuid not null references public.learning_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  concept_id text not null,
  dimension text not null references public.ref_polygo_dimensions (id),
  language_code text not null references public.languages (code),
  seq bigint not null check (seq > 0),
  -- Hora del SRS de la sesión (13.3): en las sesiones históricas (replay) es su completed_at.
  t_srs timestamptz not null,
  origin text not null check (origin in ('online', 'replay', 'repair')),
  -- Actualización informativa (n subió) y error pleno (λ subió: z⁻ ≥ 0,5, 5.4).
  informative boolean not null,
  full_error boolean not null,
  lapses_after integer not null check (lapses_after >= 0),
  primary key (session_id, concept_id, dimension)
);
create index if not exists srs_unit_updates_errors_idx
  on public.srs_unit_updates (user_id, concept_id, dimension, t_srs) where full_error;

create or replace function public.srs_unit_updates_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'srs_unit_updates: el historial por unidad es inmutable' using errcode = 'check_violation';
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.srs_unit_updates'::regclass
                 and tgname = 'srs_unit_updates_immutable') then
    create trigger srs_unit_updates_immutable before update on public.srs_unit_updates
      for each row execute function public.srs_unit_updates_immutable();
  end if;
end;
$$;

-- Errores plenos de una unidad en los 30 días anteriores a p_now (R5, AL17).
create or replace function public.srs_unit_full_errors(p_user uuid, p_concept text, p_dim text, p_now timestamptz)
returns integer
language sql
stable
set search_path = ''
as $$
  select count(*)::integer from public.srs_unit_updates
  where user_id = p_user and concept_id = p_concept and dimension = p_dim and full_error
    and t_srs > p_now - interval '30 days' and t_srs <= p_now
$$;

-- ¿Los 30 días anteriores a p_now están cubiertos por el historial? No lo están para una unidad
-- convertida (15.3, conversión B: no tiene sesiones) si el corte fue hace menos de 30 días.
create or replace function public.srs_unit_errors_window_complete(p_user uuid, p_source text, p_now timestamptz)
returns boolean
language sql
stable
set search_path = ''
as $$
  select p_source is distinct from 'converted'
         or coalesce((select c.cutoff_at from public.srs_migration_cutoff c where c.user_id = p_user), p_now)
            <= p_now - interval '30 days'
$$;

alter table public.mastery_model_versions add column if not exists enabled_for_display boolean not null default false;

-- 2. Vía única del SRS v2 con el historial por unidad.
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
  values (ses.id, ses.user_id, v_seq, v_t, p_origin, alg.version, wts.weights_version,
          coalesce((select p.planner_version from public.srs_session_plans p where p.session_id = ses.id), 'planner-2.0.0'),
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
    -- Fase 4: historial por unidad (R5, AL17). Una fila por unidad actualizada en esta sesión.
    insert into public.srs_unit_updates (user_id, concept_id, dimension, language_code, session_id, seq, t_srs,
      origin, informative, full_error, lapses_after)
    values (ses.user_id, u.concept_id, u.dimension, u.language_code, ses.id, v_seq, v_t, p_origin,
      res.n > coalesce(st.n, 0), res.lapses > coalesce(st.lapses, 0), res.lapses)
    on conflict (session_id, concept_id, dimension) do nothing;
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

-- 3. Cobertura de repasos (§4 de LEARNING_PHASE4.md). La RPC de repasos (submit_learning_session
--    'review', sin cambios) exige una palabra publicada por intento: entran los conceptos léxicos con
--    palabra publicada en CUALQUIER dimensión (hoy: vocabulario y producción). Un ítem entra si su
--    único concepto `target` es esa unidad y su corrección es objetiva y determinista.
create or replace function public.review_item_candidates(p_lang text)
returns table (item_id text, concept_id text, dimension text, rung text, item_type text, input_modality text,
               item_version_id bigint, grading_mode_id text, option_set_id bigint, option_count integer)
language sql
stable
set search_path = ''
as $$
  select i.id, ic.concept_id, ic.dimension, public.srs_v2_rung_for_mode(ic.dimension, i.assessment_mode),
         i.type, i.input_modality, v.id, v.grading_mode_id, os.id, jsonb_array_length(os.options)
  from public.exercise_items i
  join public.exercise_item_versions v on v.id = i.current_version_id
  join public.item_concepts ic on ic.item_id = i.id and ic.role = 'target'
  join public.concepts c on c.id = ic.concept_id and c.kind = 'lexical' and c.status = 'active'
  join public.words w on w.id = c.word_id and w.is_published
  left join lateral (
    select s.id, s.options from public.exercise_option_sets s where s.item_version_id = v.id
  ) os on v.grading_mode_id = 'exact_option.v1'
  where i.language_code = p_lang and i.status = 'active'
    and v.grading_mode_id in ('exact_option.v1', 'normalized_text.v1')
    and public.srs_v2_rung_for_mode(ic.dimension, i.assessment_mode) is not null
    -- Un único CONCEPTO target (los ítems de producción lo marcan en vocabulario y en producción).
    and (select count(distinct x.concept_id) from public.item_concepts x where x.item_id = i.id and x.role = 'target') = 1
    and (v.grading_mode_id <> 'exact_option.v1'
         or (select count(*) from public.exercise_option_sets s where s.item_version_id = v.id) = 1)
$$;

-- Estado para el armador. Igual que en la fase 3, más: todas las dimensiones de conceptos léxicos,
-- errores plenos en 30 días e integridad de esa ventana (R5, AL17), objetivos `core` activos de la
-- unidad (R5: máximo 2 por objetivo) y la lección de la explicación (AL17).
create or replace function public.learning_review_candidates(p_user uuid, p_lang text, p_tz text, p_now timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_tz text := public.safe_time_zone(p_tz);
  v_today date := (p_now at time zone v_tz)::date;
  v_end timestamptz := (v_today + 1)::timestamp at time zone v_tz;
  v_soon timestamptz := (v_today + 3)::timestamp at time zone v_tz;
  v_goal integer;
  v_b integer;
  v_debt public.srs_user_debt_state;
  v_debt_items numeric;
  v_ipu double precision;
  v_last_weak date;
  v_last_kind text;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages where code = p_lang) then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  select daily_goal_minutes into v_goal from public.profiles where id = p_user;
  v_b := (coalesce(v_goal, 10) * public.srs_v2_user_rhythm100(p_user, null)) / 100;
  select * into v_debt from public.srs_user_debt_state where user_id = p_user and language_code = p_lang;
  select debt_items into v_debt_items from public.srs_user_debt_days
  where user_id = p_user and language_code = p_lang and study_date = v_today;
  if v_debt_items is null then
    v_ipu := public.srs_v2_ipu(p_user, p_lang);
    select count(*) * v_ipu::numeric into v_debt_items from public.user_srs_state
    where user_id = p_user and language_code = p_lang and due_at < v_end;
  end if;
  select (p.created_at at time zone v_tz)::date, x ->> 'reason' into v_last_weak, v_last_kind
  from public.srs_session_plans p
  join public.learning_sessions s on s.id = p.session_id and s.user_id = p.user_id
  cross join lateral jsonb_array_elements(p.items) x
  where p.user_id = p_user and p.language_code = p_lang and x ->> 'reason' in ('weak', 'probe')
  order by p.created_at desc, (x ->> 'position')::integer desc limit 1;

  return jsonb_build_object(
    'now', p_now, 'time_zone', v_tz, 'srs_v2_enabled', public.srs_v2_enabled(),
    'budget', jsonb_build_object(
      'B', v_b,
      'reviews_today', coalesce((select sum(first_try_total) from public.learning_sessions
                                 where user_id = p_user and kind = 'review' and local_date = v_today), 0),
      'all_today', coalesce((select sum(first_try_total) from public.learning_sessions
                             where user_id = p_user and local_date = v_today), 0),
      'advanced_today', (select count(*) from public.srs_session_plans p
                         join public.learning_sessions s on s.id = p.session_id
                         cross join lateral jsonb_array_elements(p.items) x
                         where p.user_id = p_user and s.local_date = v_today and x ->> 'reason' = 'me_advanced'),
      'first_review_today', not exists (select 1 from public.srs_session_plans p
                                        join public.learning_sessions s on s.id = p.session_id
                                        where p.user_id = p_user and s.local_date = v_today)),
    'debt', jsonb_build_object('al19_active', coalesce(v_debt.al19_active, false), 'debt_items', coalesce(v_debt_items, 0)),
    'al8', jsonb_build_object('last_attended_date', v_last_weak, 'last_kind', v_last_kind),
    'user_median_speed', (select percentile_cont(0.5) within group (order by u.recall_speed)
                          from public.user_concept_state u join public.mastery_model_versions mv on mv.version = u.model_version
                          where u.user_id = p_user and u.language_code = p_lang and mv.enabled_for_adaptive
                            and u.recall_speed is not null),
    'units', coalesce((
      with cand as materialized (select * from public.review_item_candidates(p_lang))
      select jsonb_agg(jsonb_build_object(
        'concept_id', s.concept_id, 'dimension', s.dimension, 'level', c.level,
        'due_at', s.due_at, 'due_effective_at', s.due_effective_at, 'me_hint_expires_at', s.me_hint_expires_at,
        'last_seen_at', s.last_seen_at, 't_last', s.t_last, 'stability', s.stability, 'difficulty', s.difficulty,
        'n', s.n, 'rung', s.rung,
        'errors_30d', public.srs_unit_full_errors(s.user_id, s.concept_id, s.dimension, p_now),
        'errors_window_complete', public.srs_unit_errors_window_complete(s.user_id, s.migration_source, p_now),
        'objective_ids', (select coalesce(jsonb_agg(oc.objective_id order by oc.objective_id), '[]'::jsonb)
                          from public.objective_concepts oc
                          join public.learning_objectives o on o.id = oc.objective_id and o.status = 'active'
                          where oc.concept_id = s.concept_id and oc.role = 'core'),
        'intro_lesson_id', coalesce(
          (select lo.lesson_id from public.objective_concepts oc
           join public.learning_objectives o on o.id = oc.objective_id and o.status = 'active'
           join public.lesson_objectives lo on lo.objective_id = oc.objective_id and lo.role = 'introduce'
           join public.lessons l on l.id = lo.lesson_id and l.is_published
           join public.curriculum_units cu on cu.id = l.unit_id
           where oc.concept_id = s.concept_id order by cu.level, cu.position, l.position, l.id limit 1),
          (select l.id from public.exercise_words ew
           join public.exercises e on e.id = ew.exercise_id and e.is_published
           join public.lessons l on l.id = e.lesson_id and l.is_published
           join public.curriculum_units cu on cu.id = l.unit_id
           where ew.word_id = c.word_id order by cu.level, cu.position, l.position, l.id limit 1)),
        'mastery', (select jsonb_build_object('enabled', mv.enabled_for_adaptive, 'status', u.status, 'mastery', u.mastery,
                                              'confidence', u.confidence, 'weak', u.weak, 'recall_speed', u.recall_speed,
                                              'transfer_met', coalesce((u.model_detail -> 'transfer' ->> 'met')::boolean, false))
                    from public.user_concept_state u join public.mastery_model_versions mv on mv.version = u.model_version
                    where u.user_id = s.user_id and u.concept_id = s.concept_id and u.dimension = s.dimension),
        'items', coalesce((select jsonb_agg(jsonb_build_object('item_id', r.item_id, 'rung', r.rung, 'item_type', r.item_type,
                                                               'input_modality', r.input_modality, 'option_count', r.option_count,
                                                               'last_presented_at', (select max(p.presented_at) from public.exercise_presentations p
                                                                                     where p.user_id = s.user_id and p.item_id = r.item_id))
                                      order by r.item_id)
                           from cand r
                           where r.concept_id = s.concept_id and r.dimension = s.dimension), '[]'::jsonb))
        order by s.due_at, s.concept_id, s.dimension)
      from public.user_srs_state s
      join public.concepts c on c.id = s.concept_id and c.kind = 'lexical'
      join public.words w on w.id = c.word_id and w.is_published
      where s.user_id = p_user and s.language_code = p_lang
        and (s.due_at < v_soon or s.due_effective_at < v_end or s.n <= 2 or s.difficulty >= 6.85
             or exists (select 1 from public.user_concept_state u where u.user_id = s.user_id and u.concept_id = s.concept_id
                        and u.dimension = s.dimension and (u.weak or u.status = 'insufficient' or u.confidence < 0.35))
             or exists (select 1 from public.srs_unit_updates x where x.user_id = s.user_id and x.concept_id = s.concept_id
                        and x.dimension = s.dimension and x.full_error and x.t_srs > p_now - interval '30 days'
                        and x.t_srs <= p_now))
      ), '[]'::jsonb));
end;
$$;

-- 4. Antes de armar: estado de la sesión y del v2. Una sesión con plan se retoma tal cual (aunque el v2
--    se haya apagado después: su envío no lo necesita); una ya enviada está cerrada. Para una nueva, si
--    el v2 está encendido y el usuario no está migrado, lo migra en línea con el mismo bloqueo que un
--    envío (srs_user_lock, 13.3). Con el v2 apagado no escribe nada.
create or replace function public.learning_review_prepare(p_user uuid, p_session_id uuid, p_tz text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_since timestamptz;
  v_before timestamptz;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_session_id is null then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if exists (select 1 from public.learning_sessions where id = p_session_id) then
    if exists (select 1 from public.learning_sessions where id = p_session_id and user_id <> p_user) then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object('session', 'closed', 'enabled', public.srs_v2_enabled());
  end if;
  if exists (select 1 from public.srs_session_plans where session_id = p_session_id and user_id <> p_user)
     or exists (select 1 from public.exercise_presentations where session_id = p_session_id and user_id <> p_user) then
    raise exception 'session_conflict' using errcode = '23505';
  end if;
  if exists (select 1 from public.srs_session_plans where session_id = p_session_id) then
    return jsonb_build_object('session', 'open', 'enabled', public.srs_v2_enabled());
  end if;
  if not public.srs_v2_enabled() then
    return jsonb_build_object('session', 'new', 'enabled', false);
  end if;
  select v2_since into v_before from public.srs_user_head where user_id = p_user;
  v_since := public.srs_user_lock(p_user, p_tz);
  return jsonb_build_object('session', 'new', 'enabled', true, 'v2_since', v_since, 'migrated_now', v_before is null);
end;
$$;

-- 5. Respuestas corregidas durante el repaso. La primera es la que vale; el envío tiene que traer esa.
create table if not exists public.review_presentation_answers (
  presentation_id bigint primary key references public.exercise_presentations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  session_id uuid not null,
  response jsonb not null check (jsonb_typeof(response) = 'object'),
  status text not null check (status in ('valid', 'invalid_response')),
  verdict text check (verdict in ('correct', 'typo', 'incorrect')),
  client_verdict text check (client_verdict in ('correct', 'typo', 'incorrect')),
  selected_option smallint,
  assists jsonb not null default '{}'::jsonb check (jsonb_typeof(assists) = 'object'),
  response_ms integer not null check (response_ms between 0 and 600000),
  grader text not null,
  grader_version text not null,
  answered_at timestamptz not null default now(),
  constraint review_presentation_answers_status_verdict_check check ((status = 'valid') = (verdict is not null))
);
create index if not exists review_presentation_answers_session_idx on public.review_presentation_answers (session_id);

create or replace function public.review_presentation_answers_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'review_presentation_answers: la respuesta registrada es inmutable' using errcode = 'check_violation';
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.review_presentation_answers'::regclass
                 and tgname = 'review_presentation_answers_immutable') then
    create trigger review_presentation_answers_immutable before update on public.review_presentation_answers
      for each row execute function public.review_presentation_answers_immutable();
  end if;
end;
$$;

-- p_grading: la corrección de shared/learningSession.ts (gradeReviewAnswer) para UNA presentación:
-- {presentation_id, response, status, verdict, client_verdict, selected_option, assists}.
create or replace function public.learning_review_answer(
  p_user uuid, p_session_id uuid, p_grading jsonb, p_response_ms integer, p_grader jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pid bigint;
  v_row public.review_presentation_answers;
  v_new boolean := false;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_session_id is null or jsonb_typeof(p_grading) is distinct from 'object'
     or jsonb_typeof(p_grader) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_pid := (p_grading ->> 'presentation_id')::bigint;
  -- El mismo bloqueo que start_review y submit_review: una respuesta no se cruza con el envío.
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));
  if exists (select 1 from public.learning_sessions where id = p_session_id) then
    raise exception 'session_closed' using errcode = '22023';
  end if;
  if not exists (select 1 from public.exercise_presentations p
                 join public.srs_session_plans sp on sp.session_id = p.session_id and sp.user_id = p.user_id
                 where p.id = v_pid and p.user_id = p_user and p.session_id = p_session_id and p.exercise_id is null) then
    raise exception 'presentations_not_found' using errcode = 'P0002';
  end if;
  insert into public.review_presentation_answers (presentation_id, user_id, session_id, response, status, verdict,
    client_verdict, selected_option, assists, response_ms, grader, grader_version)
  values (v_pid, p_user, p_session_id, p_grading -> 'response', p_grading ->> 'status', p_grading ->> 'verdict',
    p_grading ->> 'client_verdict', (p_grading ->> 'selected_option')::smallint,
    coalesce(p_grading -> 'assists', '{}'::jsonb), least(greatest(coalesce(p_response_ms, 0), 0), 600000),
    p_grader ->> 'grader', p_grader ->> 'grader_version')
  on conflict (presentation_id) do nothing
  returning * into v_row;
  v_new := found;
  if not v_new then
    select * into v_row from public.review_presentation_answers where presentation_id = v_pid;
  end if;
  return jsonb_build_object(
    'presentation_id', v_row.presentation_id, 'duplicate', not v_new,
    'matches', v_row.response = p_grading -> 'response',
    'response', v_row.response, 'status', v_row.status, 'verdict', v_row.verdict,
    'response_ms', v_row.response_ms, 'assists', v_row.assists,
    'answer', (select v.answer from public.exercise_presentations p
               join public.exercise_item_versions v on v.id = p.item_version_id where p.id = v_pid),
    'explanation', (select v.explanation_es from public.exercise_presentations p
                    join public.exercise_item_versions v on v.id = p.item_version_id where p.id = v_pid));
end;
$$;

-- 6. Lo que la app muestra de un repaso del servidor: el ítem tal como se presentó (versión y orden de
--    opciones registrados), la palabra para el panel de respuesta y, si ya se respondió, la corrección
--    del servidor (para retomar una sesión interrumpida). La respuesta correcta y la explicación sólo
--    aparecen en las presentaciones ya respondidas.
create or replace function public.learning_review_content(p_user uuid, p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'presentation_id', p.id, 'position', p.position, 'item_id', p.item_id,
           'item_version_id', p.item_version_id, 'concept_id', pl.x ->> 'concept_id',
           'dimension', pl.x ->> 'dimension', 'reason', pl.x ->> 'reason',
           'type', i.type,
           'skill', coalesce((select e.skill from public.exercises e where e.item_id = i.id order by e.id limit 1),
                             case i.type when 'listen_choice' then 'listening' when 'order_words' then 'sentence_building'
                                         when 'translate_write' then 'translation' when 'short_answer' then 'translation'
                                         else 'vocabulary' end),
           'prompt', v.prompt_es,
           'payload', case when os.shown is not null then v.payload || jsonb_build_object('options', os.shown)
                           else v.payload end,
           'options_shown', os.shown,
           'difficulty', v.difficulty, 'recommended_seconds', v.recommended_seconds,
           'word', to_jsonb(w),
           'answered', case when r.presentation_id is not null then jsonb_build_object(
             'response', r.response, 'status', r.status, 'verdict', r.verdict, 'response_ms', r.response_ms,
             'assists', r.assists, 'answer', v.answer, 'explanation', v.explanation_es) end)
         order by p.position, p.id), '[]'::jsonb)
  from public.exercise_presentations p
  join public.srs_session_plans sp on sp.session_id = p.session_id and sp.user_id = p.user_id
  cross join lateral (select e as x from jsonb_array_elements(sp.items) e where e ->> 'item_id' = p.item_id limit 1) pl
  join public.exercise_items i on i.id = p.item_id
  join public.exercise_item_versions v on v.id = p.item_version_id
  join public.concepts c on c.id = pl.x ->> 'concept_id'
  join public.words w on w.id = c.word_id
  left join public.review_presentation_answers r on r.presentation_id = p.id
  left join lateral (
    select jsonb_agg(s.options -> o.idx::integer ->> 'text' order by o.pos) as shown
    from public.exercise_option_sets s, unnest(p.option_order) with ordinality as o(idx, pos)
    where s.id = p.option_set_id) os on true
  where p.user_id = p_user and p.session_id = p_session_id and p.exercise_id is null
$$;

-- 6b. Inicio de un repaso: igual que en la fase 3, con la dimensión en la unión (ver abajo).
create or replace function public.learning_start_review(
  p_user uuid, p_session_id uuid, p_lang text, p_tz text, p_plan jsonb, p_orders jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_n integer;
  v_bad integer;
  v_cand jsonb;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_session_id is null or jsonb_typeof(p_plan) is distinct from 'object'
     or jsonb_typeof(p_plan -> 'items') is distinct from 'array' or jsonb_typeof(p_orders) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));
  if exists (select 1 from public.learning_sessions where id = p_session_id) then
    raise exception 'session_closed' using errcode = '22023';
  end if;
  if exists (select 1 from public.exercise_presentations where session_id = p_session_id and user_id <> p_user)
     or exists (select 1 from public.srs_session_plans where session_id = p_session_id and user_id <> p_user) then
    raise exception 'session_conflict' using errcode = '23505';
  end if;
  if exists (select 1 from public.srs_session_plans where session_id = p_session_id) then
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true,
      'plan', (select items from public.srs_session_plans where session_id = p_session_id),
      'presentations', public.learning_presentations_public(p_user, p_session_id));
  end if;
  v_n := jsonb_array_length(p_plan -> 'items');
  if v_n = 0 then
    raise exception 'nothing_to_review' using errcode = 'P0002';
  end if;
  if v_n > 15 then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  select coalesce(jsonb_agg(to_jsonb(r)), '[]') into v_cand
  from public.review_item_candidates(p_lang) r
  where r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x);
  -- Cada entrada tiene que ser un ítem que el servidor puede presentar para esa unidad del usuario.
  select count(*) into v_bad
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  where (x ->> 'position')::integer is distinct from ord::integer
     or not exists (select 1 from jsonb_array_elements(v_cand) r
                    where r ->> 'item_id' = x ->> 'item_id' and r ->> 'concept_id' = x ->> 'concept_id'
                      and r ->> 'dimension' = x ->> 'dimension' and r ->> 'rung' = x ->> 'rung')
     or not exists (select 1 from public.user_srs_state s where s.user_id = p_user and s.concept_id = x ->> 'concept_id'
                    and s.dimension = x ->> 'dimension' and s.language_code = p_lang)
     or x ->> 'reason' not in ('due', 'weak', 'probe', 'fluency', 'me_advanced', 'recent', 'due_soon');
  if v_bad > 0
     or (select count(distinct x ->> 'concept_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n
     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  if (select coalesce(array_agg(x ->> 'item_id' order by x ->> 'item_id'), '{}')
      from jsonb_array_elements(p_plan -> 'items') x
      where exists (select 1 from jsonb_array_elements(v_cand) r where r ->> 'item_id' = x ->> 'item_id' and r ->> 'option_set_id' is not null))
     <> (select coalesce(array_agg(k order by k), '{}') from jsonb_object_keys(p_orders) k) then
    raise exception 'invalid_orders' using errcode = '22023';
  end if;

  insert into public.srs_session_plans (session_id, user_id, language_code, source, planner_version, algorithm_version,
    weights_version, budget, items)
  values (p_session_id, p_user, p_lang, 'adaptive_review', coalesce(p_plan ->> 'planner_version', 'planner-2.0.0'),
    'srs-2.0.0', (select weights_version from public.srs_weights where status = 'active' limit 1),
    coalesce((p_plan ->> 'capacity')::integer, v_n), p_plan -> 'items');

  insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id,
    exercise_id, option_set_id, option_order, shuffle_algorithm, shuffle_seed)
  select p_user, p_session_id, ord::smallint, r.item_id, r.item_version_id, null, r.option_set_id,
         case when r.option_set_id is not null then
           (select array_agg(v::smallint order by n) from jsonb_array_elements_text(p_orders -> r.item_id) with ordinality as o(v, n)) end,
         case when r.option_set_id is not null then 'polygo.shuffle.v1' end,
         case when r.option_set_id is not null then p_session_id::text || ':' || r.item_id end
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  -- Fase 4: un ítem puede ser candidato en dos dimensiones del mismo concepto (producción): la
  -- dimensión del plan elige una sola fila (una presentación por entrada).
  join jsonb_to_recordset(v_cand) as r(item_id text, concept_id text, dimension text, item_version_id bigint, option_set_id bigint)
    on r.item_id = x ->> 'item_id' and r.concept_id = x ->> 'concept_id' and r.dimension = x ->> 'dimension'
  order by ord;

  return jsonb_build_object('session_id', p_session_id, 'duplicate', false, 'plan', p_plan -> 'items',
    'presentations', public.learning_presentations_public(p_user, p_session_id));
end;
$$;


-- 7. Envío corregido de un repaso: igual que en la fase 3, más la coincidencia con lo ya corregido.
create or replace function public.learning_submit_review_graded(
  p_user uuid, p_session_id uuid, p_started_at timestamptz, p_time_zone text,
  p_attempts jsonb, p_gradings jsonb, p_grader jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_first public.learning_sessions;
  v_plan public.srs_session_plans;
  v_result jsonb;
  v_prev_sub text := current_setting('request.jwt.claim.sub', true);
  v_prev_claims text := current_setting('request.jwt.claims', true);
  v_n integer;
  v_ids bigint[];
  v_bad integer;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if jsonb_typeof(p_attempts) is distinct from 'array' or jsonb_typeof(p_gradings) is distinct from 'array'
     or jsonb_array_length(p_attempts) <> jsonb_array_length(p_gradings) or jsonb_array_length(p_attempts) = 0
     or jsonb_typeof(p_grader) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_n := jsonb_array_length(p_attempts);
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));

  select * into v_first from public.learning_sessions where id = p_session_id;
  if found then
    if v_first.user_id <> p_user then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object('session_id', v_first.id, 'duplicate', true,
      'first_try_correct', v_first.first_try_correct, 'first_try_total', v_first.first_try_total,
      'accuracy', round(v_first.first_try_correct::numeric / nullif(v_first.first_try_total, 0), 3),
      'achievements_unlocked', '[]'::jsonb, 'verdicts', public.learning_session_verdicts(p_session_id));
  end if;
  select * into v_plan from public.srs_session_plans where session_id = p_session_id;
  if not found then
    raise exception 'presentations_not_found' using errcode = 'P0002';
  end if;
  if v_plan.user_id <> p_user then
    raise exception 'session_conflict' using errcode = '23505';
  end if;

  -- Una respuesta por presentación (los repasos no tienen reintentos), de esta sesión, con la palabra
  -- que fijó el plan del servidor y el veredicto y el primer intento de su corrección.
  select count(*) into v_bad
  from jsonb_array_elements(p_attempts) with ordinality as a(x, n)
  join jsonb_array_elements(p_gradings) with ordinality as g(y, m) on m = n
  left join public.exercise_presentations p
    on p.id = (g.y ->> 'presentation_id')::bigint and p.user_id = p_user and p.session_id = p_session_id
  left join lateral (select e ->> 'concept_id' as concept_id from jsonb_array_elements(v_plan.items) e
                     where e ->> 'item_id' = p.item_id) pl on true
  where p.id is null or (g.y ->> 'attempt_no')::integer <> 1
     or a.x ->> 'word_id' is distinct from pl.concept_id
     or a.x ->> 'exercise_id' is not null
     or (a.x ->> 'correct')::boolean is distinct from (g.y ->> 'status' = 'valid' and g.y ->> 'verdict' in ('correct', 'typo'))
     or (a.x ->> 'first_try')::boolean is distinct from true;
  if v_bad > 0 or (select count(distinct g.y ->> 'presentation_id') from jsonb_array_elements(p_gradings) g(y)) <> v_n then
    raise exception 'invalid_gradings' using errcode = '22023';
  end if;

  -- Fase 4: si la respuesta ya se corrigió durante el repaso (answer_review), el envío tiene que traer
  -- exactamente esa respuesta y esa corrección: la primera respuesta registrada es la que vale.
  if exists (
    select 1 from jsonb_array_elements(p_gradings) g(y)
    join public.review_presentation_answers r on r.presentation_id = (g.y ->> 'presentation_id')::bigint
    where r.response is distinct from g.y -> 'response' or r.status is distinct from g.y ->> 'status'
       or r.verdict is distinct from g.y ->> 'verdict') then
    raise exception 'answer_mismatch' using errcode = '22023';
  end if;

  perform set_config('request.jwt.claim.sub', p_user::text, true);
  perform set_config('request.jwt.claims', jsonb_build_object('sub', p_user, 'role', 'authenticated')::text, true);
  v_result := public.submit_learning_session(p_session_id, 'review', null, p_started_at, p_attempts, p_time_zone);
  perform set_config('request.jwt.claim.sub', coalesce(v_prev_sub, ''), true);
  perform set_config('request.jwt.claims', coalesce(v_prev_claims, ''), true);
  if coalesce((v_result ->> 'duplicate')::boolean, false) then
    return v_result || jsonb_build_object('verdicts', public.learning_session_verdicts(p_session_id));
  end if;

  select array_agg(id order by id) into v_ids from public.exercise_attempts where session_id = p_session_id;
  if coalesce(array_length(v_ids, 1), 0) <> v_n then
    raise exception 'attempts_mismatch' using errcode = '22023';
  end if;
  insert into public.exercise_attempt_presentations (attempt_id, presentation_id)
  select v_ids[g.m], (g.y ->> 'presentation_id')::bigint
  from jsonb_array_elements(p_gradings) with ordinality as g(y, m) order by g.m;
  insert into public.exercise_attempt_gradings (attempt_id, presentation_id, user_id, session_id,
    item_id, item_version_id, grading_mode_id, input_modality, attempt_no, response_kind, response,
    selected_option, status, verdict, client_verdict, assists, grader, grader_version)
  select v_ids[g.m], p.id, p_user, p_session_id, p.item_id, p.item_version_id, v.grading_mode_id,
         i.input_modality, 1, g.y -> 'response' ->> 'kind', g.y -> 'response',
         (g.y ->> 'selected_option')::smallint, g.y ->> 'status', g.y ->> 'verdict',
         g.y ->> 'client_verdict', coalesce(g.y -> 'assists', '{}'::jsonb),
         p_grader ->> 'grader', p_grader ->> 'grader_version'
  from jsonb_array_elements(p_gradings) with ordinality as g(y, m)
  join public.exercise_presentations p on p.id = (g.y ->> 'presentation_id')::bigint
  join public.exercise_item_versions v on v.id = p.item_version_id
  join public.exercise_items i on i.id = p.item_id
  order by g.m;

  return v_result || jsonb_build_object('verdicts', public.learning_session_verdicts(p_session_id));
end;
$$;

-- 8. Estados visibles para la app (14, AL12). Sólo los datos del usuario que llama (auth.uid()).
--    · «Para repasar»: del SRS v2 si está encendido y el usuario migrado; si no, del v1 (como hoy).
--    · Dominio: sólo si hay una versión del motor activa y habilitada para mostrarse
--      (enabled_for_display, apagado por defecto). Si no, available = false y la app no muestra
--      «Dominadas» (AL12). Nunca se inventa dominio: cada unidad está en exactamente un estado:
--        no_evidence   — expuesta, sin evidencia (evidence_count = 0)
--        insufficient  — con evidencia, pero no alcanza la suficiencia del motor (P9: sin m ni c)
--        weak          — estimada y marcada débil (rendimiento bajo)
--        in_progress   — estimada, ni débil ni dominada
--        mastered      — «Dominada» (sólo status = 'mastered')
--      y, por unidad curricular, not_seen = conceptos de la unidad sin ninguna fila del motor.
--    · Retención y velocidad: sólo de las unidades con retención suficiente / velocidad medida.
create or replace function public.get_learning_mastery(p_language text, p_time_zone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_tz text := public.safe_time_zone(p_time_zone);
  v_end timestamptz := ((now() at time zone v_tz)::date + 1)::timestamp at time zone v_tz;
  v_model text;
  v_v2 boolean;
  v_review jsonb;
begin
  if v_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages where code = p_language) then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_v2 := public.srs_v2_enabled()
          and exists (select 1 from public.srs_user_head where user_id = v_user and v2_since is not null);
  if v_v2 then
    v_review := jsonb_build_object('source', 'srs_v2',
      'due_today', (select count(*) from public.user_srs_state
                    where user_id = v_user and language_code = p_language and due_at < v_end),
      'due_now', (select count(*) from public.user_srs_state
                  where user_id = v_user and language_code = p_language and due_at <= now()));
  else
    v_review := jsonb_build_object('source', 'srs_v1',
      'due_today', (select count(*) from public.user_word_progress p join public.words w on w.id = p.word_id
                    where p.user_id = v_user and w.language_code = p_language and p.next_review_at < v_end),
      'due_now', (select count(*) from public.user_word_progress p join public.words w on w.id = p.word_id
                  where p.user_id = v_user and w.language_code = p_language and p.next_review_at <= now()));
  end if;

  select version into v_model from public.mastery_model_versions
  where status = 'active' and enabled_for_display order by version desc limit 1;
  if v_model is null then
    return jsonb_build_object('available', false, 'review', v_review);
  end if;

  return (
    with st as materialized (
      select u.*, case when u.evidence_count = 0 then 'no_evidence'
                       when u.status = 'insufficient' then 'insufficient'
                       when u.status = 'mastered' then 'mastered'
                       when u.weak then 'weak'
                       else 'in_progress' end as state
      from public.user_concept_state u
      where u.user_id = v_user and u.language_code = p_language and u.model_version = v_model),
    unit_concepts as materialized (
      select distinct cu.id as unit_id, ic.concept_id, ic.dimension
      from public.curriculum_units cu
      join public.lessons l on l.unit_id = cu.id and l.is_published
      join public.exercises e on e.lesson_id = l.id and e.is_published
      join public.item_concepts ic on ic.item_id = e.item_id and ic.role = 'target'
      where cu.language_code = p_language)
    select jsonb_build_object(
      'available', true, 'model_version', v_model, 'review', v_review,
      'computed_at', (select max(computed_at) from st),
      'pending_recompute', (select count(*) from st where dirty_since is not null),
      'dimensions', coalesce((
        select jsonb_object_agg(d.dimension, d.counts) from (
          select dimension, jsonb_build_object(
            'no_evidence', count(*) filter (where state = 'no_evidence'),
            'insufficient', count(*) filter (where state = 'insufficient'),
            'weak', count(*) filter (where state = 'weak'),
            'in_progress', count(*) filter (where state = 'in_progress'),
            'mastered', count(*) filter (where state = 'mastered')) as counts
          from st group by dimension) d), '{}'::jsonb),
      'retention', (select jsonb_build_object('units', count(*), 'mean', round(avg(retention_estimate), 4))
                    from st where retention_estimate is not null
                      and coalesce((model_detail ->> 'retention_sufficient')::boolean, false)),
      'speed', (select jsonb_build_object('units', count(*),
                       'median', round((percentile_cont(0.5) within group (order by recall_speed))::numeric, 4))
                from st where recall_speed is not null),
      'units', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'unit_id', cu.id, 'level', cu.level, 'position', cu.position, 'title', cu.title_es,
                 'total', x.total, 'not_seen', x.total - x.seen, 'no_evidence', x.no_evidence,
                 'insufficient', x.insufficient, 'weak', x.weak, 'in_progress', x.in_progress,
                 'mastered', x.mastered)
               order by cu.level, cu.position)
        from public.curriculum_units cu
        join lateral (
          select count(*) as total, count(s.state) as seen,
                 count(*) filter (where s.state = 'no_evidence') as no_evidence,
                 count(*) filter (where s.state = 'insufficient') as insufficient,
                 count(*) filter (where s.state = 'weak') as weak,
                 count(*) filter (where s.state = 'in_progress') as in_progress,
                 count(*) filter (where s.state = 'mastered') as mastered
          from unit_concepts uc
          left join st s on s.concept_id = uc.concept_id and s.dimension = uc.dimension
          where uc.unit_id = cu.id) x on x.total > 0
        where cu.language_code = p_language), '[]'::jsonb),
      -- R5: débiles, menor m y exposición más vieja primero.
      'weak', coalesce((
        select jsonb_agg(jsonb_build_object('concept_id', s.concept_id, 'dimension', s.dimension,
                                            'text', w.text, 'translation', w.translation_es,
                                            'mastery', s.mastery, 'confidence', s.confidence)
                         order by s.mastery, s.last_exposed_at, s.concept_id)
        from (select * from st where state = 'weak' order by mastery, last_exposed_at, concept_id limit 10) s
        join public.concepts c on c.id = s.concept_id
        left join public.words w on w.id = c.word_id), '[]'::jsonb))
  );
end;
$$;

-- 9. Seguridad: tablas sin acceso para la app; funciones de servicio sólo para service_role; la de la
--    app sólo para authenticated (lee únicamente auth.uid()).
alter table public.srs_unit_updates enable row level security;
alter table public.review_presentation_answers enable row level security;
revoke all on public.srs_unit_updates, public.review_presentation_answers from anon, authenticated;

revoke execute on function
  public.srs_unit_updates_immutable(), public.review_presentation_answers_immutable(),
  public.srs_unit_full_errors(uuid, text, text, timestamptz),
  public.srs_unit_errors_window_complete(uuid, text, timestamptz),
  public.review_item_candidates(text), public.learning_review_candidates(uuid, text, text, timestamptz),
  public.learning_review_prepare(uuid, uuid, text), public.learning_review_answer(uuid, uuid, jsonb, integer, jsonb),
  public.learning_review_content(uuid, uuid),
  public.learning_start_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_submit_review_graded(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb),
  public.srs_v2_apply_session(uuid, text, text),
  public.get_learning_mastery(text, text)
from public, anon, authenticated;

grant execute on function public.learning_review_candidates(uuid, text, text, timestamptz),
  public.learning_review_prepare(uuid, uuid, text), public.learning_review_answer(uuid, uuid, jsonb, integer, jsonb),
  public.learning_review_content(uuid, uuid), public.learning_start_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_submit_review_graded(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb)
to service_role;
grant execute on function public.get_learning_mastery(text, text) to authenticated;

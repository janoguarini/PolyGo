-- Cierre de la fase 4: decisiones P1–P9 (docs/LEARNING_PHASE4.md §10).
--
--   P7 · Retomar sólo el mismo día local, medido en la zona horaria registrada al iniciar la sesión:
--        srs_session_plans guarda time_zone y local_date; learning_review_prepare distingue
--        open / expired / closed / new; una sesión vencida no admite respuestas nuevas
--        (session_expired) pero, si ya tiene todas sus respuestas corregidas, todavía se puede enviar
--        (no se pierde evidencia por un envío fallido antes de medianoche).
--   P4 · Repetición de errores dentro de la sesión: review_presentation_retries (inmutable) guarda hasta
--        2 repeticiones corregidas por el servidor de una presentación fallada. No es evidencia: ni el
--        SRS, ni el motor, ni el envío la leen; review_presentation_answers (primer intento) sigue siendo
--        la única respuesta que vale.
--   P3 · Repasos Plus por el servidor: learning_focus_candidates + learning_start_focus_review (origen
--        focus_review, ya cargado en la fase 3). Mismas reglas de selección que la app vieja
--        (shared/focusReview.ts), mismo contenido, corrección y envío que cualquier repaso del servidor.
--        Exige Plus en el servidor (has_plus). No cambia el SRS ni sus parámetros: el envío es el mismo
--        submit_learning_session('review') de siempre. learning_review_candidates deja de contar un
--        repaso Plus como «primer repaso del día» del armador (AL8): Plus no altera la vía adaptativa.
--   P6 · Retención: learning_retention_sweep borra sólo registros operativos (learning_job_runs: 90 días;
--        180 los fallidos; siempre se conserva la última ejecución de cada trabajo). Nada de aprendizaje
--        se borra. Nuevo trabajo 'retention' en learning_run_job. learning_jobs_status agrega el estado de
--        las sesiones de repaso (abiertas, vencidas sin enviar).
--   P2 · get_public_profile agrega learning.concepts_mastered: el conteo del Mastery Engine, o null
--        mientras no haya una versión activa con enabled_for_display (hoy: null). words_mastered (SRS
--        v1) se mantiene sólo por compatibilidad con las builds publicadas; la app nueva no lo muestra.
--   P1 · Nada se enciende: no toca srs_v2_settings, enabled_for_display ni enabled_for_adaptive.
--
-- No cambia: submit_learning_session, SRS v1, Ranked, Plus (precios, beneficios, has_plus),
-- polygo.answers.v1, presentaciones ni correcciones (inmutables), el motor, srs_v2_apply_session.
-- Reemplaza (create or replace, misma firma): learning_review_candidates (sólo AL8), learning_review_prepare,
-- learning_review_answer, learning_review_content, learning_start_review (sólo registra zona y día),
-- learning_run_job, learning_jobs_status, get_public_profile.
--
-- Aditiva e idempotente (sin DROP; el único DELETE está dentro de learning_retention_sweep y afecta sólo a
-- learning_job_runs). ESTADO: probada en PGlite (supabase/tests/phase4close.test.mjs). NO aplicada en
-- producción.

-- 1. P7: zona y día local de la sesión; foco de un repaso Plus.
alter table public.srs_session_plans add column if not exists time_zone text;
alter table public.srs_session_plans add column if not exists local_date date;
alter table public.srs_session_plans add column if not exists focus jsonb
  check (focus is null or jsonb_typeof(focus) = 'object');

-- ¿La sesión del plan ya no admite respuestas? Vence al terminar su día local (en la zona registrada al
-- iniciarla, no en la del dispositivo de ahora) o al vencer el plan (90 días). Planes sin zona (anteriores
-- a esta migración): UTC y el día de su creación.
create or replace function public.review_plan_expired(p_session_id uuid, p_now timestamptz)
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((
    select p_now >= p.expires_at
           or (p_now at time zone public.safe_time_zone(coalesce(p.time_zone, 'UTC')))::date
              > coalesce(p.local_date, (p.created_at at time zone public.safe_time_zone(coalesce(p.time_zone, 'UTC')))::date)
    from public.srs_session_plans p where p.session_id = p_session_id), false)
$$;

-- ¿Todas las presentaciones de la sesión tienen su primera respuesta corregida?
create or replace function public.review_session_complete(p_session_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (select 1 from public.exercise_presentations p where p.session_id = p_session_id)
     and not exists (select 1 from public.exercise_presentations p
                     where p.session_id = p_session_id
                       and not exists (select 1 from public.review_presentation_answers r where r.presentation_id = p.id))
$$;

-- 2. Antes de armar (reemplaza la de 20261110120000): agrega `expired`, el origen del plan y si la sesión
--    está completa. Una sesión con plan del mismo día se retoma tal cual; una vencida ya no admite
--    respuestas nuevas (si está completa, la app la envía y empieza otra).
create or replace function public.learning_review_prepare(p_user uuid, p_session_id uuid, p_tz text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_since timestamptz;
  v_before timestamptz;
  v_plan public.srs_session_plans;
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
  select * into v_plan from public.srs_session_plans where session_id = p_session_id;
  if found then
    return jsonb_build_object(
      'session', case when public.review_plan_expired(p_session_id, now()) then 'expired' else 'open' end,
      'enabled', public.srs_v2_enabled(), 'source', v_plan.source, 'focus', v_plan.focus,
      'complete', public.review_session_complete(p_session_id));
  end if;
  if not public.srs_v2_enabled() then
    return jsonb_build_object('session', 'new', 'enabled', false);
  end if;
  select v2_since into v_before from public.srs_user_head where user_id = p_user;
  v_since := public.srs_user_lock(p_user, p_tz);
  return jsonb_build_object('session', 'new', 'enabled', true, 'v2_since', v_since, 'migrated_now', v_before is null);
end;
$$;

-- 3. Inicio de un repaso adaptativo (reemplaza la de 20261110120000): igual, más la zona y el día local.
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
  v_tz text := public.safe_time_zone(p_tz);
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
    weights_version, budget, items, time_zone, local_date)
  values (p_session_id, p_user, p_lang, 'adaptive_review', coalesce(p_plan ->> 'planner_version', 'planner-2.0.0'),
    'srs-2.0.0', (select weights_version from public.srs_weights where status = 'active' limit 1),
    coalesce((p_plan ->> 'capacity')::integer, v_n), p_plan -> 'items', v_tz, (now() at time zone v_tz)::date);

  insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id,
    exercise_id, option_set_id, option_order, shuffle_algorithm, shuffle_seed)
  select p_user, p_session_id, ord::smallint, r.item_id, r.item_version_id, null, r.option_set_id,
         case when r.option_set_id is not null then
           (select array_agg(v::smallint order by n) from jsonb_array_elements_text(p_orders -> r.item_id) with ordinality as o(v, n)) end,
         case when r.option_set_id is not null then 'polygo.shuffle.v1' end,
         case when r.option_set_id is not null then p_session_id::text || ':' || r.item_id end
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  join jsonb_to_recordset(v_cand) as r(item_id text, concept_id text, dimension text, item_version_id bigint, option_set_id bigint)
    on r.item_id = x ->> 'item_id' and r.concept_id = x ->> 'concept_id' and r.dimension = x ->> 'dimension'
  order by ord;

  return jsonb_build_object('session_id', p_session_id, 'duplicate', false, 'plan', p_plan -> 'items',
    'presentations', public.learning_presentations_public(p_user, p_session_id));
end;
$$;

-- 4. P3: candidatos de un repaso Plus. Las palabras estudiadas del usuario en el SRS v1 (las mismas que
--    leía la app vieja) que el servidor puede presentar y corregir: concepto léxico activo y al menos un
--    ítem del catálogo en la dimensión vocabulario (review_item_candidates: versión vigente, un único
--    concepto target, corrección exact_option.v1 / normalized_text.v1). Forma de shared/focusReview.ts.
create or replace function public.learning_focus_candidates(p_user uuid, p_lang text, p_now timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages where code = p_lang) then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  return jsonb_build_object('now', p_now, 'plus', public.has_plus(p_user), 'words', coalesce((
    with cand as materialized (select * from public.review_item_candidates(p_lang) where dimension = 'vocabulary')
    select jsonb_agg(jsonb_build_object(
             'word', jsonb_build_object('id', c.id, 'unit_id', w.unit_id),
             'stage', p.stage, 'seenCount', p.seen_count, 'incorrectCount', p.incorrect_count,
             'nextReviewAt', p.next_review_at,
             'items', coalesce((
               select jsonb_agg(jsonb_build_object(
                        'item_id', r.item_id, 'dimension', r.dimension, 'rung', r.rung, 'option_count', r.option_count,
                        'last_presented_at', (select max(x.presented_at) from public.exercise_presentations x
                                              where x.user_id = p_user and x.item_id = r.item_id))
                      order by r.item_id)
               from cand r where r.concept_id = c.id), '[]'::jsonb))
           order by p.next_review_at nulls last, c.id)
    from public.user_word_progress p
    join public.words w on w.id = p.word_id and w.is_published and w.language_code = p_lang
    join public.concepts c on c.word_id = w.id and c.kind = 'lexical' and c.status = 'active'
    where p.user_id = p_user and p.seen_count > 0), '[]'::jsonb));
end;
$$;

-- 5. P3: inicio de un repaso Plus. Mismo registro que learning_start_review (plan, presentaciones con
--    versión, conjunto y orden de opciones), con origen focus_review y el foco del plan. Comprueba en el
--    servidor que el usuario tiene Plus, que cada entrada es un ítem presentable para una palabra que el
--    usuario ya estudió (y, en el repaso por tema, de esa unidad) y los motivos de shared/focusReview.ts.
create or replace function public.learning_start_focus_review(
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
  v_tz text := public.safe_time_zone(p_tz);
  v_focus jsonb := p_plan -> 'focus';
  v_kind text;
  v_unit text;
  v_source text;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_session_id is null or jsonb_typeof(p_plan) is distinct from 'object'
     or jsonb_typeof(p_plan -> 'items') is distinct from 'array' or jsonb_typeof(p_orders) is distinct from 'object'
     or jsonb_typeof(v_focus) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_kind := v_focus ->> 'kind';
  v_unit := v_focus ->> 'unit_id';
  if v_kind is null or v_kind not in ('smart', 'topic') or (v_kind = 'topic' and v_unit is null) then
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
  select source into v_source from public.srs_session_plans where session_id = p_session_id;
  if found then
    if v_source <> 'focus_review' then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true,
      'plan', (select items from public.srs_session_plans where session_id = p_session_id),
      'presentations', public.learning_presentations_public(p_user, p_session_id));
  end if;
  -- El beneficio lo decide el servidor, nunca la app (mismas reglas comerciales de siempre).
  if not public.has_plus(p_user) then
    raise exception 'plus_required' using errcode = '42501';
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
  where r.dimension = 'vocabulary'
    and r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x);
  select count(*) into v_bad
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  where (x ->> 'position')::integer is distinct from ord::integer
     or not exists (select 1 from jsonb_array_elements(v_cand) r
                    where r ->> 'item_id' = x ->> 'item_id' and r ->> 'concept_id' = x ->> 'concept_id'
                      and r ->> 'dimension' = x ->> 'dimension' and r ->> 'rung' = x ->> 'rung')
     or not exists (select 1 from public.concepts c
                    join public.user_word_progress p on p.word_id = c.word_id and p.user_id = p_user and p.seen_count > 0
                    join public.words w on w.id = c.word_id and w.language_code = p_lang
                    where c.id = x ->> 'concept_id' and (v_kind = 'smart' or w.unit_id = v_unit))
     or (v_kind = 'smart' and coalesce(x ->> 'reason', '') not in ('due', 'frequent_mistakes', 'difficult', 'due_soon'))
     or (v_kind = 'topic' and x ->> 'reason' is distinct from 'topic');
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
    weights_version, budget, items, time_zone, local_date, focus)
  values (p_session_id, p_user, p_lang, 'focus_review', coalesce(p_plan ->> 'planner_version', 'focus-1.0.0'),
    'srs-2.0.0', (select weights_version from public.srs_weights where status = 'active' limit 1),
    coalesce((p_plan ->> 'capacity')::integer, v_n), p_plan -> 'items', v_tz, (now() at time zone v_tz)::date,
    case when v_kind = 'topic' then jsonb_build_object('kind', 'topic', 'unit_id', v_unit)
         else jsonb_build_object('kind', 'smart') end);

  insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id,
    exercise_id, option_set_id, option_order, shuffle_algorithm, shuffle_seed)
  select p_user, p_session_id, ord::smallint, r.item_id, r.item_version_id, null, r.option_set_id,
         case when r.option_set_id is not null then
           (select array_agg(v::smallint order by n) from jsonb_array_elements_text(p_orders -> r.item_id) with ordinality as o(v, n)) end,
         case when r.option_set_id is not null then 'polygo.shuffle.v1' end,
         case when r.option_set_id is not null then p_session_id::text || ':' || r.item_id end
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  join jsonb_to_recordset(v_cand) as r(item_id text, concept_id text, dimension text, item_version_id bigint, option_set_id bigint)
    on r.item_id = x ->> 'item_id' and r.concept_id = x ->> 'concept_id' and r.dimension = x ->> 'dimension'
  order by ord;

  return jsonb_build_object('session_id', p_session_id, 'duplicate', false, 'plan', p_plan -> 'items',
    'presentations', public.learning_presentations_public(p_user, p_session_id));
end;
$$;

-- 6. Primera respuesta (reemplaza la de 20261110120000): igual, y una sesión vencida (P7) ya no admite
--    respuestas nuevas. Un reintento de una respuesta YA registrada devuelve la misma corrección aunque
--    la sesión haya vencido (nada se pierde ni se duplica).
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
  if coalesce((p_grading ->> 'attempt_no')::integer, 1) <> 1 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_pid := (p_grading ->> 'presentation_id')::bigint;
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));
  if exists (select 1 from public.learning_sessions where id = p_session_id) then
    raise exception 'session_closed' using errcode = '22023';
  end if;
  if not exists (select 1 from public.exercise_presentations p
                 join public.srs_session_plans sp on sp.session_id = p.session_id and sp.user_id = p.user_id
                 where p.id = v_pid and p.user_id = p_user and p.session_id = p_session_id and p.exercise_id is null) then
    raise exception 'presentations_not_found' using errcode = 'P0002';
  end if;
  select * into v_row from public.review_presentation_answers where presentation_id = v_pid;
  if not found then
    if public.review_plan_expired(p_session_id, now()) then
      raise exception 'session_expired' using errcode = '22023';
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
  end if;
  return jsonb_build_object(
    'presentation_id', v_row.presentation_id, 'attempt_no', 1, 'duplicate', not v_new,
    'matches', v_row.response = p_grading -> 'response',
    'response', v_row.response, 'status', v_row.status, 'verdict', v_row.verdict,
    'response_ms', v_row.response_ms, 'assists', v_row.assists,
    'answer', (select v.answer from public.exercise_presentations p
               join public.exercise_item_versions v on v.id = p.item_version_id where p.id = v_pid),
    'explanation', (select v.explanation_es from public.exercise_presentations p
                    join public.exercise_item_versions v on v.id = p.item_version_id where p.id = v_pid));
end;
$$;

-- 7. P4: repeticiones de un error dentro de la sesión. Una presentación fallada (primer intento
--    incorrecto o inválido) puede repetirse hasta 2 veces (attempt_no 2 y 3), cada una sólo si la anterior
--    también falló. Las corrige el servidor con la misma regla; se registran una vez por (presentación,
--    intento) e inmutables. No son evidencia: no se envían, no generan exercise_attempts ni correcciones,
--    no las leen el SRS ni el motor. Sólo dan el feedback de la repetición y permiten retomarla.
create table if not exists public.review_presentation_retries (
  presentation_id bigint not null references public.review_presentation_answers (presentation_id) on delete cascade,
  attempt_no smallint not null check (attempt_no between 2 and 3),
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
  primary key (presentation_id, attempt_no),
  constraint review_presentation_retries_status_verdict_check check ((status = 'valid') = (verdict is not null))
);
create index if not exists review_presentation_retries_session_idx on public.review_presentation_retries (session_id);

create or replace function public.review_presentation_retries_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'review_presentation_retries: la repetición registrada es inmutable' using errcode = 'check_violation';
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.review_presentation_retries'::regclass
                 and tgname = 'review_presentation_retries_immutable') then
    create trigger review_presentation_retries_immutable before update on public.review_presentation_retries
      for each row execute function public.review_presentation_retries_immutable();
  end if;
end;
$$;

-- p_grading: gradeReviewAnswer(..., attempt_no) de shared/learningSession.ts, con attempt_no 2 o 3.
create or replace function public.learning_review_retry(
  p_user uuid, p_session_id uuid, p_grading jsonb, p_response_ms integer, p_grader jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pid bigint;
  v_no integer;
  v_first public.review_presentation_answers;
  v_prev public.review_presentation_retries;
  v_row public.review_presentation_retries;
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
  v_no := (p_grading ->> 'attempt_no')::integer;
  if v_no is null or v_no not between 2 and 3 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));
  if exists (select 1 from public.learning_sessions where id = p_session_id) then
    raise exception 'session_closed' using errcode = '22023';
  end if;
  if not exists (select 1 from public.exercise_presentations p
                 join public.srs_session_plans sp on sp.session_id = p.session_id and sp.user_id = p.user_id
                 where p.id = v_pid and p.user_id = p_user and p.session_id = p_session_id and p.exercise_id is null) then
    raise exception 'presentations_not_found' using errcode = 'P0002';
  end if;
  -- Idempotencia: una repetición ya registrada devuelve la misma corrección.
  select * into v_row from public.review_presentation_retries where presentation_id = v_pid and attempt_no = v_no;
  if not found then
    if public.review_plan_expired(p_session_id, now()) then
      raise exception 'session_expired' using errcode = '22023';
    end if;
    -- Sólo se repite un error: el intento anterior tiene que existir y no ser correcto.
    select * into v_first from public.review_presentation_answers where presentation_id = v_pid;
    if not found or (v_first.status = 'valid' and v_first.verdict in ('correct', 'typo')) then
      raise exception 'retry_not_allowed' using errcode = '22023';
    end if;
    if v_no = 3 then
      select * into v_prev from public.review_presentation_retries where presentation_id = v_pid and attempt_no = 2;
      if not found or (v_prev.status = 'valid' and v_prev.verdict in ('correct', 'typo')) then
        raise exception 'retry_not_allowed' using errcode = '22023';
      end if;
    end if;
    insert into public.review_presentation_retries (presentation_id, attempt_no, user_id, session_id, response, status,
      verdict, client_verdict, selected_option, assists, response_ms, grader, grader_version)
    values (v_pid, v_no, p_user, p_session_id, p_grading -> 'response', p_grading ->> 'status', p_grading ->> 'verdict',
      p_grading ->> 'client_verdict', (p_grading ->> 'selected_option')::smallint,
      coalesce(p_grading -> 'assists', '{}'::jsonb), least(greatest(coalesce(p_response_ms, 0), 0), 600000),
      p_grader ->> 'grader', p_grader ->> 'grader_version')
    on conflict (presentation_id, attempt_no) do nothing
    returning * into v_row;
    v_new := found;
    if not v_new then
      select * into v_row from public.review_presentation_retries where presentation_id = v_pid and attempt_no = v_no;
    end if;
  end if;
  return jsonb_build_object(
    'presentation_id', v_row.presentation_id, 'attempt_no', v_row.attempt_no, 'duplicate', not v_new,
    'matches', v_row.response = p_grading -> 'response',
    'response', v_row.response, 'status', v_row.status, 'verdict', v_row.verdict,
    'response_ms', v_row.response_ms, 'assists', v_row.assists,
    'answer', (select v.answer from public.exercise_presentations p
               join public.exercise_item_versions v on v.id = p.item_version_id where p.id = v_pid),
    'explanation', (select v.explanation_es from public.exercise_presentations p
                    join public.exercise_item_versions v on v.id = p.item_version_id where p.id = v_pid));
end;
$$;

-- 8. Contenido (reemplaza la de 20261110120000): igual, más las repeticiones ya corregidas de cada
--    presentación (para retomar una sesión con la repetición pendiente).
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
             'assists', r.assists, 'answer', v.answer, 'explanation', v.explanation_es) end,
           'retries', coalesce((select jsonb_agg(jsonb_build_object(
                                  'attempt_no', t.attempt_no, 'response', t.response, 'status', t.status,
                                  'verdict', t.verdict, 'response_ms', t.response_ms, 'assists', t.assists)
                                order by t.attempt_no)
                                from public.review_presentation_retries t where t.presentation_id = p.id), '[]'::jsonb))
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

-- 9. Estado para el armador adaptativo (reemplaza la de 20261110120000). Único cambio: «primer repaso del
--    día» (AL8) cuenta sólo repasos adaptativos. Un repaso Plus (focus_review) no consume el sondeo diario
--    ni cambia nada de la vía adaptativa (P3, AL11).
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
                                        where p.user_id = p_user and s.local_date = v_today
                                          and p.source = 'adaptive_review')),
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

-- 10. P6: retención. Sólo registros operativos. learning_job_runs: 90 días (180 los fallidos), siempre se
--     conserva la última ejecución de cada trabajo. Idempotente (una segunda pasada no borra nada) y por
--     lotes. NO borra: evidencias (exercise_attempts, exercise_attempt_gradings), presentaciones, planes,
--     respuestas y repeticiones de repasos (también las abandonadas: son el registro de lo presentado y
--     corregido, la rotación de ítems las usa), historial del SRS, estado del motor ni colas.
create or replace function public.learning_retention_sweep(p_limit integer default 5000, p_now timestamptz default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := coalesce(p_now, now());
  v_n integer;
  v_left integer;
begin
  if p_limit is null or p_limit < 1 or p_limit > 50000 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  with latest as (select distinct on (job) id from public.learning_job_runs order by job, started_at desc, id desc),
  doomed as (
    select r.id from public.learning_job_runs r
    where r.started_at < v_now - case when r.status = 'failed' then interval '180 days' else interval '90 days' end
      and r.id not in (select id from latest)
    order by r.started_at, r.id
    limit p_limit)
  delete from public.learning_job_runs r using doomed d where r.id = d.id;
  get diagnostics v_n = row_count;
  select count(*) into v_left from public.learning_job_runs r
  where r.started_at < v_now - case when r.status = 'failed' then interval '180 days' else interval '90 days' end
    and r.id not in (select distinct on (job) id from public.learning_job_runs order by job, started_at desc, id desc);
  return jsonb_build_object('job_runs_deleted', v_n, 'remaining', v_left);
end;
$$;

create or replace function public.learning_run_job(p_job text, p_limit integer default 500)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_start timestamptz := clock_timestamp();
  v_status text := 'ok';
  v_reason text;
  v_n integer := 0;
  v_f integer := 0;
  v_remaining integer;
  v_err text;
  r jsonb;
begin
  if p_job is null or p_job not in ('mastery_queue', 'me_hint', 'srs_repair', 'retention') then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 5000 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if not pg_try_advisory_xact_lock(hashtextextended('learning_job:' || p_job, 0)) then
    v_status := 'skipped';
    v_reason := 'already_running';
  elsif p_job = 'me_hint' and not exists (select 1 from public.mastery_model_versions where enabled_for_adaptive) then
    v_status := 'skipped';
    v_reason := 'motor_disabled';
  elsif p_job = 'srs_repair' and not public.srs_v2_enabled() then
    v_status := 'skipped';
    v_reason := 'srs_v2_disabled';
  else
    begin
      if p_job = 'mastery_queue' then
        r := public.mastery_process_queue_safe(p_limit, null);
        v_n := (r ->> 'processed')::integer;
        v_f := (r ->> 'failed')::integer;
        select count(*) into v_remaining from public.knowledge_recompute_queue
        where processed_at is null and attempts < 5;
      elsif p_job = 'me_hint' then
        v_n := public.srs_apply_me_hint(p_limit, null);
        select count(*) into v_remaining from public.srs_hint_queue where processed_at is null;
      elsif p_job = 'retention' then
        r := public.learning_retention_sweep(p_limit, null);
        v_n := (r ->> 'job_runs_deleted')::integer;
        v_remaining := (r ->> 'remaining')::integer;
      else
        v_n := public.srs_v2_repair_sweep();
      end if;
    exception when others then
      get stacked diagnostics v_err = message_text;
      v_status := 'failed';
      v_n := 0;
    end;
  end if;
  insert into public.learning_job_runs (job, started_at, status, reason, processed, failed, remaining, error)
  values (p_job, v_start, v_status, v_reason, v_n, v_f, v_remaining, left(v_err, 500));
  return jsonb_build_object('job', p_job, 'status', v_status, 'reason', v_reason, 'processed', v_n,
                            'failed', v_f, 'remaining', v_remaining, 'error', left(v_err, 500));
end;
$$;

-- Observabilidad (reemplaza la de 20261110130000): igual, más las sesiones de repaso del servidor sin
-- enviar: abiertas (del día), vencidas completas (envío pendiente) y abandonadas (vencidas incompletas).
create or replace function public.learning_jobs_status()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'srs_v2_enabled', public.srs_v2_enabled(),
    'motor_enabled_for_adaptive', exists (select 1 from public.mastery_model_versions where enabled_for_adaptive),
    'mastery_queue', jsonb_build_object(
      'pending', (select count(*) from public.knowledge_recompute_queue where processed_at is null and attempts < 5),
      'retrying', (select count(*) from public.knowledge_recompute_queue where processed_at is null and attempts between 1 and 4),
      'gave_up', (select count(*) from public.knowledge_recompute_queue where processed_at is null and attempts >= 5),
      'oldest_pending', (select min(enqueued_at) from public.knowledge_recompute_queue where processed_at is null)),
    'hint_queue', jsonb_build_object(
      'pending', (select count(*) from public.srs_hint_queue where processed_at is null),
      'oldest_pending', (select min(enqueued_at) from public.srs_hint_queue where processed_at is null)),
    'migration_queue', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb)
                        from (select status, count(*) n from public.srs_migration_queue group by status) x),
    'migration_gave_up', (select count(*) from public.srs_migration_queue where status = 'failed' and attempts >= 5),
    'review_sessions', (
      select jsonb_build_object(
        'open', count(*) filter (where not x.expired),
        'expired_complete', count(*) filter (where x.expired and x.complete),
        'abandoned', count(*) filter (where x.expired and not x.complete))
      from (select public.review_plan_expired(p.session_id, now()) as expired,
                   public.review_session_complete(p.session_id) as complete
            from public.srs_session_plans p
            where not exists (select 1 from public.learning_sessions s where s.id = p.session_id)) x),
    'last_runs', (select coalesce(jsonb_object_agg(job, to_jsonb(r) - 'job'), '{}'::jsonb)
                  from (select distinct on (job) * from public.learning_job_runs order by job, started_at desc, id desc) r))
$$;

-- 11. P2: dominio visible de otro usuario. El conteo del Mastery Engine (unidades con evidencia y
--     status = 'mastered', la misma definición que «Dominadas» en el perfil propio) sólo cuando hay una
--     versión del motor activa y habilitada para mostrarse; si no, null (no se inventa ni se reemplaza
--     por el SRS v1).
create or replace function public.mastery_display_count(p_user uuid, p_lang text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select case when v.version is null then null else
    (select count(*)::integer from public.user_concept_state u
     where u.user_id = p_user and u.language_code = p_lang and u.model_version = v.version
       and u.evidence_count > 0 and u.status = 'mastered') end
  from (select (select m.version from public.mastery_model_versions m
                where m.status = 'active' and m.enabled_for_display order by m.version desc limit 1) as version) v
$$;

create or replace function public.get_public_profile(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  visibility text;
  show_region boolean;
  is_open boolean;
  result jsonb;
  m jsonb;
  stars jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into prof from public.profiles where id = p_user_id and username is not null;
  if not found then
    return null;
  end if;

  select s.profile_visibility, s.show_region into visibility, show_region
  from public.user_settings s where s.user_id = p_user_id;
  is_open := p_user_id = uid
    or coalesce(visibility, 'private') = 'public'
    or (visibility = 'friends' and public.are_friends(uid, p_user_id));

  result := jsonb_build_object(
    'id', prof.id,
    'username', prof.username,
    'display_name', prof.display_name,
    'avatar_id', prof.avatar_id,
    'avatar_path', prof.avatar_path,
    'frame_id', prof.frame_id,
    'background_id', prof.background_id,
    'public_code', prof.public_code,
    'created_at', prof.created_at,
    'is_public', is_open,
    'friendship', case when p_user_id = uid then 'self' else public.friendship_state(uid, p_user_id) end,
    'region', case when p_user_id = uid or coalesce(show_region, false) then prof.region end,
    'rating', (select jsonb_build_object('rating', r.rating, 'games_played', r.games_played)
               from public.player_ratings r
               where r.user_id = p_user_id and r.language_code = prof.target_language)
  );

  if is_open then
    m := public.achievement_metrics(p_user_id);
    stars := public.lesson_star_totals(p_user_id);
    result := result || jsonb_build_object(
      'stats', (select jsonb_build_object(
                  'wins', r.wins, 'losses', r.losses, 'draws', r.draws,
                  'peak_rating', r.peak_rating, 'best_win_streak', r.best_win_streak)
                from public.player_ratings r
                where r.user_id = p_user_id and r.language_code = prof.target_language),
      'learning', jsonb_build_object(
                  'lessons_completed', m -> 'lessons_completed',
                  -- SRS v1: sólo para las builds publicadas; la app nueva no lo muestra (P2).
                  'words_mastered', m -> 'words_mastered',
                  -- Mastery Engine: null mientras no esté habilitado para mostrarse.
                  'concepts_mastered', public.mastery_display_count(p_user_id, prof.target_language),
                  'best_streak_days', m -> 'best_streak_days',
                  'stars_earned', stars -> 'stars_earned',
                  'golden_lessons', stars -> 'golden_lessons'),
      'achievements', (select coalesce(jsonb_agg(jsonb_build_object(
                          'id', a.id, 'title', a.title_es, 'icon', a.icon, 'category', a.category,
                          'unlocked_at', ua.unlocked_at) order by a.position), '[]'::jsonb)
                       from public.user_achievements ua
                       join public.achievements a on a.id = ua.achievement_id
                       where ua.user_id = p_user_id and a.is_active)
    );
  end if;

  return result;
end;
$$;

-- 12. Seguridad: tablas sin acceso para la app; funciones de servicio sólo para service_role.
alter table public.review_presentation_retries enable row level security;
revoke all on public.review_presentation_retries from anon, authenticated;

revoke execute on function
  public.review_plan_expired(uuid, timestamptz), public.review_session_complete(uuid),
  public.learning_review_prepare(uuid, uuid, text),
  public.learning_start_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_focus_candidates(uuid, text, timestamptz),
  public.learning_start_focus_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_review_answer(uuid, uuid, jsonb, integer, jsonb),
  public.learning_review_retry(uuid, uuid, jsonb, integer, jsonb),
  public.review_presentation_retries_immutable(),
  public.learning_review_content(uuid, uuid),
  public.learning_review_candidates(uuid, text, text, timestamptz),
  public.learning_retention_sweep(integer, timestamptz),
  public.learning_run_job(text, integer), public.learning_jobs_status(),
  public.mastery_display_count(uuid, text)
from public, anon, authenticated;

grant execute on function
  public.learning_review_prepare(uuid, uuid, text),
  public.learning_start_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_focus_candidates(uuid, text, timestamptz),
  public.learning_start_focus_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_review_answer(uuid, uuid, jsonb, integer, jsonb),
  public.learning_review_retry(uuid, uuid, jsonb, integer, jsonb),
  public.learning_review_content(uuid, uuid),
  public.learning_review_candidates(uuid, text, text, timestamptz),
  public.learning_run_job(text, integer), public.learning_jobs_status()
to service_role;

revoke all on function public.get_public_profile(uuid) from public, anon;
grant execute on function public.get_public_profile(uuid) to authenticated;

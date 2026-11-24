-- Repasos generados en el servidor (origen adaptive_review, AL10; docs/ADAPTIVE_LEARNING_DESIGN.md
-- 8.3–8.4, 10.1–10.2). El armador es shared/adaptivePlanner.ts y lo ejecuta la Edge Function
-- learning-session; estas funciones le dan el estado del servidor, registran el plan y las
-- presentaciones exactas y guardan el envío corregido.
--
--   learning_review_candidates(usuario, idioma, zona, ahora) → estado para el armador (sólo lectura).
--   learning_start_review(usuario, sesión, idioma, zona, plan, órdenes) → valida el plan contra el
--     catálogo, guarda srs_session_plans y exercise_presentations (sin ubicación: exercise_id nulo).
--   learning_submit_review_graded(usuario, sesión, …, intentos, correcciones) → en UNA transacción,
--     submit_learning_session('review') con el veredicto del servidor (SRS v1 sin cambios) +
--     vínculos y correcciones; el SRS v2 se aplica al confirmar (trigger diferido de 20261109120000).
--
-- Qué puede entrar en un repaso del servidor (no se inventa nada):
--   · unidades léxicas de vocabulario con estado en user_srs_state y palabra publicada (la RPC de
--     repasos exige una palabra publicada por intento; ver docs/ADAPTIVE_LEARNING_PHASE3.md, B2);
--   · ítems activos del idioma con versión vigente, cuyo único concepto `target` es esa unidad,
--     corregibles (exact_option.v1 o normalized_text.v1) y, si son de elección, con un único conjunto
--     de opciones del catálogo para su versión (no se eligen distractores).
--
-- Aditiva e idempotente. ESTADO: probada en PGlite (supabase/tests/review.test.mjs). NO aplicada en
-- producción.

-- Ítems que pueden presentarse en un repaso, con su escalón para la dimensión.
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
  where i.language_code = p_lang and i.status = 'active' and ic.dimension = 'vocabulary'
    and v.grading_mode_id in ('exact_option.v1', 'normalized_text.v1')
    and public.srs_v2_rung_for_mode(ic.dimension, i.assessment_mode) is not null
    and (select count(*) from public.item_concepts x where x.item_id = i.id and x.role = 'target') = 1
    and (v.grading_mode_id <> 'exact_option.v1'
         or (select count(*) from public.exercise_option_sets s where s.item_version_id = v.id) = 1)
$$;

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
  -- Deuda del día en modo lectura (9.7): la fila del día si ya se evaluó; si no, la misma medida.
  select debt_items into v_debt_items from public.srs_user_debt_days
  where user_id = p_user and language_code = p_lang and study_date = v_today;
  if v_debt_items is null then
    v_ipu := public.srs_v2_ipu(p_user, p_lang);
    select count(*) * v_ipu::numeric into v_debt_items from public.user_srs_state
    where user_id = p_user and language_code = p_lang and due_at < v_end;
  end if;
  -- AL8: último día con un débil o un sondeo atendido (servido en un repaso enviado) y de qué tipo.
  select (p.created_at at time zone v_tz)::date, x ->> 'reason' into v_last_weak, v_last_kind
  from public.srs_session_plans p
  join public.learning_sessions s on s.id = p.session_id and s.user_id = p.user_id
  cross join lateral jsonb_array_elements(p.items) x
  where p.user_id = p_user and p.language_code = p_lang and x ->> 'reason' in ('weak', 'probe')
  order by p.created_at desc, (x ->> 'position')::integer desc limit 1;

  return jsonb_build_object(
    'now', p_now, 'time_zone', v_tz,
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
      join public.concepts c on c.id = s.concept_id
      join public.words w on w.id = c.word_id and w.is_published
      where s.user_id = p_user and s.language_code = p_lang and s.dimension = 'vocabulary'
        and (s.due_at < v_soon or s.due_effective_at < v_end or s.n <= 2 or s.difficulty >= 6.85
             or exists (select 1 from public.user_concept_state u where u.user_id = s.user_id and u.concept_id = s.concept_id
                        and u.dimension = s.dimension and (u.weak or u.status = 'insufficient' or u.confidence < 0.35)))
      ), '[]'::jsonb));
end;
$$;

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
  join jsonb_to_recordset(v_cand) as r(item_id text, concept_id text, item_version_id bigint, option_set_id bigint)
    on r.item_id = x ->> 'item_id' and r.concept_id = x ->> 'concept_id'
  order by ord;

  return jsonb_build_object('session_id', p_session_id, 'duplicate', false, 'plan', p_plan -> 'items',
    'presentations', public.learning_presentations_public(p_user, p_session_id));
end;
$$;

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

-- Palabra (concepto léxico) de cada ítem del plan: la fija el servidor al iniciar, nunca la app.
create or replace function public.learning_review_words(p_user uuid, p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(x ->> 'item_id', x ->> 'concept_id'), '{}'::jsonb)
  from public.srs_session_plans p cross join lateral jsonb_array_elements(p.items) x
  where p.session_id = p_session_id and p.user_id = p_user
$$;

revoke execute on function public.review_item_candidates(text), public.learning_review_words(uuid, uuid),
  public.learning_review_candidates(uuid, text, text, timestamptz),
  public.learning_start_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_submit_review_graded(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb)
from public, anon, authenticated;
grant execute on function public.learning_review_candidates(uuid, text, text, timestamptz),
  public.learning_review_words(uuid, uuid),
  public.learning_start_review(uuid, uuid, text, text, jsonb, jsonb),
  public.learning_submit_review_graded(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb),
  public.srs_v2_session_result(uuid, uuid)
to service_role;

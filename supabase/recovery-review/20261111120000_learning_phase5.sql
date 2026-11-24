-- Fase 5: cobertura completa de la evaluación autoritativa (docs/LEARNING_PHASE5.md).
--
--   A · record_learning_session: vía autoritativa para registrar una sesión planificada por el servidor
--       (repasos adaptive_review y focus_review) con ítems de UNO O VARIOS conceptos y de cualquier
--       dimensión (vocabulario, producción). Corrección del servidor (polygo.answers.v1, en la Edge
--       Function), presentaciones inmutables, idempotente por session_id, una respuesta por
--       presentación y la misma que ya se registró durante el repaso (answer_mismatch). Hace en una
--       transacción lo mismo que la rama de repasos de submit_learning_session_v1 (intentos, SRS v1 por
--       palabra, actividad diaria, logros; sin energía ni progreso de lección) más los vínculos y las
--       correcciones; el SRS v2 lo aplica el trigger diferido de siempre (sus observaciones ya salen de
--       item_concepts: varios conceptos y dimensiones, χ = 1/n_t) y el motor encola por su trigger.
--   B · Candidatos de repaso con ítems de varios conceptos (review_item_candidates), sólo si el usuario
--       ya vio todos sus conceptos (review_item_known) y sin conceptos compartidos entre entradas del
--       plan. Contenido con todas las palabras del ítem.
--   C · learning_review_coverage: si un idioma tiene repasos del servidor (content_unavailable si no).
--   E · learning_session_clients + learning_route_usage: qué ruta y qué contrato de cliente registró
--       cada sesión, para saber cuándo la ruta vieja deja de usarse (sin cerrarla).
--   15.3 · srs_v2_migrate_user_locked atribuye también los intentos de record_learning_session.
--   Cierre · repaso básico autoritativo con el SRS v1 (v2 apagado): origen basic_review (server) y
--       learning_start_basic_review; lo arma la Edge Function con las reglas del repaso básico de siempre
--       (shared/focusReview.ts, pickBasicReview) y se guarda por record_learning_session. La app nueva ya
--       no guarda repasos por submit_learning_session.
--
-- No cambia: submit_learning_session ni submit_learning_session_v1 (ruta de las builds publicadas),
-- learning_submit_graded (lecciones), learning_submit_review_graded (queda para volver atrás),
-- polygo.answers.v1, Ranked, energía, Plus (precios, beneficios, has_plus), SRS v1 (apply_word_result),
-- srs_v2_apply_session, el motor ni ningún interruptor (srs_v2_settings, enabled_for_display,
-- enabled_for_adaptive). Aditiva e idempotente: sin DROP ni DELETE.
--
-- ESTADO: probada en PGlite (supabase/tests/phase5.test.mjs). NO aplicada en producción.

-- 0. Cierre: origen del repaso básico armado por el servidor (mismas banderas que srs_review: afecta al
--    SRS, cuenta para la racha, sin energía ni progreso de lección). srs_review queda para la app vieja.
insert into public.practice_sources (id, selection_mode, affects_srs, affects_lesson_progress,
  consumes_energy, counts_for_streak, evidence_class, reward_kind, plus_feature, active)
values ('basic_review', 'server', true, false, false, true, 'retrieval', 'review', null, true)
on conflict (id) do nothing;

-- 1. ¿El usuario ya vio todos los conceptos target del ítem? Un repaso no introduce conceptos nuevos ni
--    acredita uno que el usuario nunca estudió.
--    'srs' (repaso adaptativo): estado en el SRS v2 para cada concepto (cualquier dimensión).
--    'v1'  (repasos Plus): cada concepto es léxico y su palabra ya se estudió en el SRS v1.
create or replace function public.review_item_known(p_user uuid, p_item text, p_mode text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select case p_mode
    when 'srs' then not exists (
      select 1 from public.item_concepts x
      where x.item_id = p_item and x.role = 'target'
        and not exists (select 1 from public.user_srs_state s where s.user_id = p_user and s.concept_id = x.concept_id))
    when 'v1' then not exists (
      select 1 from public.item_concepts x
      join public.concepts c on c.id = x.concept_id
      where x.item_id = p_item and x.role = 'target'
        and (c.kind <> 'lexical' or c.word_id is null
             or not exists (select 1 from public.user_word_progress p
                            where p.user_id = p_user and p.word_id = c.word_id and p.seen_count > 0)))
    else false end
$$;

-- 2. Qué ruta y qué cliente registró cada sesión (E). Una fila por sesión, inmutable. No es evidencia ni
--    la lee ningún motor: sólo sirve para decidir cuándo cerrar la ruta vieja (learning_route_usage).
create table if not exists public.learning_session_clients (
  session_id uuid primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  route text not null check (route in ('lesson_graded', 'record_learning_session')),
  -- Versión del contrato de la app con la Edge Function (shared/learningSession.ts, LEARNING_CONTRACT).
  contract smallint check (contract between 1 and 1000),
  app_version text check (app_version ~ '^[0-9A-Za-z._+-]{1,40}$'),
  platform text check (platform in ('ios', 'android', 'web')),
  recorded_at timestamptz not null default now()
);
create index if not exists learning_session_clients_recorded_idx on public.learning_session_clients (recorded_at);

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid = 'public.learning_session_clients'::regclass
                 and tgname = 'learning_session_clients_immutable') then
    create trigger learning_session_clients_immutable before update or delete on public.learning_session_clients
      for each row execute function public.learning_delete_only_cascade();
  end if;
end;
$$;

-- Registro del cliente de una sesión ya guardada. Ignora lo que no tiene forma válida (nunca hace fallar
-- un envío: la Edge Function lo llama después de guardar).
create or replace function public.learning_note_client(p_user uuid, p_session_id uuid, p_route text, p_client jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_contract integer;
  v_version text;
  v_platform text;
begin
  if p_user is null or p_session_id is null or p_route not in ('lesson_graded', 'record_learning_session') then
    return;
  end if;
  if not exists (select 1 from public.learning_sessions where id = p_session_id and user_id = p_user) then
    return;
  end if;
  if jsonb_typeof(p_client) = 'object' then
    v_contract := case when jsonb_typeof(p_client -> 'contract') = 'number'
                            and (p_client ->> 'contract') ~ '^[0-9]{1,4}$'
                            and (p_client ->> 'contract')::integer between 1 and 1000
                       then (p_client ->> 'contract')::integer end;
    v_version := case when (p_client ->> 'app_version') ~ '^[0-9A-Za-z._+-]{1,40}$' then p_client ->> 'app_version' end;
    v_platform := case when p_client ->> 'platform' in ('ios', 'android', 'web') then p_client ->> 'platform' end;
  end if;
  insert into public.learning_session_clients (session_id, user_id, route, contract, app_version, platform)
  values (p_session_id, p_user, p_route, v_contract, v_version, v_platform)
  on conflict (session_id) do nothing;
end;
$$;

-- 3. A · record_learning_session.
--    p_gradings: una corrección por presentación (primer intento), en el orden en que se respondió:
--      {presentation_id, attempt_no: 1, response, status, verdict, client_verdict, selected_option,
--       assists, response_ms, answer_text}
--    La corrigió la Edge Function con shared/learningSession.ts (gradeRecordedAttempts → gradeWithSpec
--    contra la versión PRESENTADA). Esta función valida que cada corrección sea coherente con la
--    presentación y con lo ya registrado, y lo guarda todo en una transacción.
--    p_started_at se ignora para la duración: el inicio es el del plan registrado en el servidor (así una
--    sesión retomada no cae en invalid_started_at); p_time_zone fija el día local, como en v1.
create or replace function public.record_learning_session(
  p_user uuid, p_session_id uuid, p_started_at timestamptz, p_time_zone text,
  p_gradings jsonb, p_grader jsonb, p_client jsonb default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_first public.learning_sessions;
  v_plan public.srs_session_plans;
  v_now timestamptz := now();
  v_tz text := public.safe_time_zone(p_time_zone);
  v_local date := (now() at time zone public.safe_time_zone(p_time_zone))::date;
  v_n integer;
  v_bad integer;
  v_correct integer;
  v_duration integer;
  v_inserted uuid;
  v_ids bigint[];
  v_word record;
  v_new text[];
  v_accuracy numeric;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_session_id is null or jsonb_typeof(p_gradings) is distinct from 'array'
     or jsonb_typeof(p_grader) is distinct from 'object'
     or coalesce(p_grader ->> 'grader', '') !~ '^[A-Za-z0-9_./#-]{1,100}$'
     or coalesce(p_grader ->> 'grader_version', '') !~ '^[A-Za-z0-9_.+-]{1,40}$' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_n := jsonb_array_length(p_gradings);
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));

  -- Idempotencia: el mismo id devuelve lo ya registrado (reintento de red, doble toque).
  select * into v_first from public.learning_sessions where id = p_session_id;
  if found then
    if v_first.user_id <> p_user then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object('session_id', v_first.id, 'duplicate', true,
      'first_try_correct', v_first.first_try_correct, 'first_try_total', v_first.first_try_total,
      'accuracy', round(v_first.first_try_correct::numeric / nullif(v_first.first_try_total, 0), 3),
      'achievements_unlocked', '[]'::jsonb, 'verdicts', public.learning_session_verdicts(p_session_id),
      'route', 'record_learning_session');
  end if;

  select * into v_plan from public.srs_session_plans where session_id = p_session_id;
  if not found then
    raise exception 'presentations_not_found' using errcode = 'P0002';
  end if;
  if v_plan.user_id <> p_user then
    raise exception 'session_conflict' using errcode = '23505';
  end if;
  if v_plan.source not in ('adaptive_review', 'focus_review', 'basic_review') then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if v_n = 0 or v_n > (select count(*) from public.exercise_presentations
                       where session_id = p_session_id and user_id = p_user) then
    raise exception 'invalid_attempts' using errcode = '22023';
  end if;

  -- Cada corrección: una presentación de esta sesión y cuenta, sin ubicación (repaso), primer intento,
  -- estado y veredicto coherentes, una sola vez por presentación.
  select count(*) into v_bad
  from jsonb_array_elements(p_gradings) g(y)
  left join public.exercise_presentations p
    on p.id = (g.y ->> 'presentation_id')::bigint and p.user_id = p_user and p.session_id = p_session_id
       and p.exercise_id is null
  where p.id is null
     or jsonb_typeof(g.y) is distinct from 'object'
     or coalesce((g.y ->> 'attempt_no')::integer, 0) <> 1
     or g.y ->> 'status' is null or g.y ->> 'status' not in ('valid', 'invalid_response')
     or (g.y ->> 'status' = 'valid') <> (g.y ->> 'verdict' is not null)
     or (g.y ->> 'verdict' is not null and g.y ->> 'verdict' not in ('correct', 'typo', 'incorrect'))
     or jsonb_typeof(g.y -> 'response') is distinct from 'object'
     or jsonb_typeof(g.y -> 'answer_text') is distinct from 'string';
  if v_bad > 0
     or (select count(distinct g.y ->> 'presentation_id') from jsonb_array_elements(p_gradings) g(y)) <> v_n then
    raise exception 'invalid_gradings' using errcode = '22023';
  end if;
  -- Sin mezclar idiomas: todo lo presentado es del idioma del plan.
  if exists (select 1 from public.exercise_presentations p join public.exercise_items i on i.id = p.item_id
             where p.session_id = p_session_id and p.user_id = p_user and i.language_code <> v_plan.language_code) then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  -- La primera respuesta registrada durante el repaso es la que vale (fase 4).
  if exists (
    select 1 from jsonb_array_elements(p_gradings) g(y)
    join public.review_presentation_answers r on r.presentation_id = (g.y ->> 'presentation_id')::bigint
    where r.response is distinct from g.y -> 'response' or r.status is distinct from g.y ->> 'status'
       or r.verdict is distinct from g.y ->> 'verdict') then
    raise exception 'answer_mismatch' using errcode = '22023';
  end if;

  -- SRS v2 encendido: bloqueo del usuario ANTES de registrar los hechos (13.3), como el envoltorio de
  -- submit_learning_session; el trigger diferido aplica la sesión al confirmar.
  if public.srs_v2_enabled() then
    perform public.srs_user_lock(p_user, v_tz);
    perform set_config('polygo.srs_time_zone', v_tz, true);
  end if;

  select count(*) filter (where g.y ->> 'status' = 'valid' and g.y ->> 'verdict' in ('correct', 'typo'))
    into v_correct from jsonb_array_elements(p_gradings) g(y);
  v_duration := least(greatest(extract(epoch from (v_now - v_plan.created_at))::integer, 0), 3 * 3600);

  insert into public.learning_sessions (id, user_id, kind, lesson_id, started_at, completed_at, duration_seconds,
    total_answers, first_try_total, first_try_correct, local_date)
  values (p_session_id, p_user, 'review', null, least(v_plan.created_at, v_now), v_now, v_duration,
          v_n, v_n, v_correct, v_local)
  on conflict (id) do nothing
  returning id into v_inserted;
  if v_inserted is null then
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true,
      'achievements_unlocked', '[]'::jsonb, 'route', 'record_learning_session');
  end if;

  -- Un intento por presentación. word_id: la palabra si el ítem tiene un único concepto léxico target
  -- (igual que la ruta de repasos de siempre); con varios conceptos queda nula y la atribución sale de
  -- la corrección (item_concepts). skill 'vocabulary', como en todo repaso de v1.
  insert into public.exercise_attempts (session_id, user_id, exercise_id, word_id, skill, answer, is_correct,
    is_first_try, response_ms)
  select p_session_id, p_user, null,
         (select min(c.word_id) from public.item_concepts x
          join public.concepts c on c.id = x.concept_id and c.kind = 'lexical'
          join public.words w on w.id = c.word_id
          where x.item_id = p.item_id and x.role = 'target'
          having count(distinct x.concept_id) = 1),
         'vocabulary', left(g.y ->> 'answer_text', 500),
         g.y ->> 'status' = 'valid' and g.y ->> 'verdict' in ('correct', 'typo'), true,
         least(greatest(coalesce((g.y ->> 'response_ms')::integer, 0), 0), 600000)
  from jsonb_array_elements(p_gradings) with ordinality as g(y, m)
  join public.exercise_presentations p on p.id = (g.y ->> 'presentation_id')::bigint
  order by g.m;

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

  -- SRS v1: un resultado por palabra y sesión (correcta sólo si todos sus primeros intentos lo fueron),
  -- con cada palabra publicada de un concepto léxico target. Misma regla que las lecciones de v1; con un
  -- solo concepto por ítem da exactamente lo que daba la ruta de repasos.
  for v_word in
    select c.word_id, bool_and(g.y ->> 'status' = 'valid' and g.y ->> 'verdict' in ('correct', 'typo')) as ok
    from jsonb_array_elements(p_gradings) g(y)
    join public.exercise_presentations p on p.id = (g.y ->> 'presentation_id')::bigint
    join public.item_concepts x on x.item_id = p.item_id and x.role = 'target'
    join public.concepts c on c.id = x.concept_id and c.kind = 'lexical'
    join public.words w on w.id = c.word_id and w.is_published
    group by c.word_id
    order by c.word_id
  loop
    perform public.apply_word_result(p_user, v_word.word_id, v_word.ok, v_now);
  end loop;

  -- Recompensas de un repaso, idénticas a v1: actividad diaria (racha) y logros. Sin energía ni progreso
  -- de lección.
  insert into public.user_daily_activity as d (user_id, activity_date, sessions_completed, answers,
    correct_answers, seconds_spent)
  values (p_user, v_local, 1, v_n, v_correct, v_duration)
  on conflict (user_id, activity_date) do update set
    sessions_completed = d.sessions_completed + 1,
    answers = d.answers + excluded.answers,
    correct_answers = d.correct_answers + excluded.correct_answers,
    seconds_spent = d.seconds_spent + excluded.seconds_spent;

  v_new := public.evaluate_achievements(p_user);
  perform public.learning_note_client(p_user, p_session_id, 'record_learning_session', p_client);
  v_accuracy := round(v_correct::numeric / v_n, 3);

  return jsonb_build_object(
    'session_id', p_session_id, 'duplicate', false,
    'first_try_correct', v_correct, 'first_try_total', v_n, 'accuracy', v_accuracy,
    'duration_seconds', v_duration, 'time_zone', v_tz, 'energy_left', null,
    'achievements_unlocked', (
      select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title_es, 'icon', a.icon)
                                order by a.position), '[]'::jsonb)
      from public.achievements a where a.id = any(v_new)),
    'verdicts', public.learning_session_verdicts(p_session_id),
    'route', 'record_learning_session');
end;
$$;

-- 4. C · ¿Hay repasos del servidor en este idioma? Cuenta lo que el servidor puede presentar y corregir
--    (review_item_candidates), sin inventar nada. Un idioma sin contenido publicado o sin ítems
--    corregibles no tiene repasos: la app muestra «contenido pendiente», no «estás al día».
create or replace function public.learning_review_coverage(p_lang text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with lang as (select code, content_status from public.languages where code = p_lang),
  cand as materialized (select * from public.review_item_candidates(p_lang))
  select case when not exists (select 1 from lang) then null else jsonb_build_object(
    'language_code', p_lang,
    'content_status', (select content_status from lang),
    'concepts', (select count(*) from public.concepts where language_code = p_lang and status = 'active'),
    'reviewable_items', (select count(distinct item_id) from cand),
    'reviewable_concepts', (select count(distinct concept_id) from cand),
    'multi_concept_items', (select count(*) from (select item_id from cand group by item_id
                                                   having count(distinct concept_id) > 1) t),
    'by_dimension', coalesce((select jsonb_object_agg(dimension, n) from (
                               select dimension, count(distinct item_id) n from cand group by dimension) t), '{}'::jsonb),
    'available', (select content_status from lang) = 'available' and exists (select 1 from cand)) end
$$;

-- 5. E · Uso de cada ruta desde p_since. Una sesión sin correcciones del servidor es de la ruta vieja
--    (submit_learning_session con el veredicto del cliente: builds publicadas, o el respaldo de lecciones
--    de las builds nuevas). Sirve para decidir cuándo cerrarla (docs/LEARNING_PHASE5.md §5).
create or replace function public.learning_route_usage(p_since timestamptz)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with s as (
    select ls.id, ls.user_id, ls.kind, ls.completed_at,
           exists (select 1 from public.exercise_attempt_gradings g where g.session_id = ls.id) as graded,
           c.route, c.contract, c.app_version
    from public.learning_sessions ls
    left join public.learning_session_clients c on c.session_id = ls.id
    where ls.completed_at >= p_since
  ),
  r as (
    select case when not graded then 'legacy_' || kind
                when kind = 'lesson' then 'lesson_graded'
                when route = 'record_learning_session' then 'record_learning_session'
                else 'review_graded_phase4' end as route,
           contract, app_version, user_id, completed_at
    from s
  )
  select jsonb_build_object(
    'since', p_since,
    'routes', coalesce((select jsonb_agg(jsonb_build_object('route', route, 'contract', contract,
                          'app_version', app_version, 'sessions', n, 'users', u, 'last_at', l)
                        order by route, contract nulls first, app_version nulls first)
                        from (select route, contract, app_version, count(*) n, count(distinct user_id) u,
                                     max(completed_at) l
                              from r group by route, contract, app_version) t), '[]'::jsonb),
    'legacy_users', (select count(distinct user_id) from r where route like 'legacy_%'),
    'legacy_review_users', (select count(distinct user_id) from r where route = 'legacy_review'))
$$;

-- 6. Funciones reemplazadas (misma firma; copia de la versión vigente + parches de scripts/build-phase5-sql.ts).
-- >>> generado por scripts/build-phase5-sql.ts (no editar a mano)

-- review_item_candidates: ítems con VARIOS conceptos target (antes: uno solo). Todos sus conceptos
-- target tienen que estar activos; devuelve una fila por cada concepto léxico con palabra publicada
-- (así un ítem de varios conceptos es candidato de cada uno). pair_set sigue afuera: su payload ya
-- trae las parejas resueltas (la respuesta) y no hay formato de presentación que las oculte.
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
    -- Fase 5: uno o varios conceptos target, todos activos (record_learning_session los registra).
    and not exists (select 1 from public.item_concepts x
                    left join public.concepts xc on xc.id = x.concept_id and xc.status = 'active'
                    where x.item_id = i.id and x.role = 'target' and xc.id is null)
    and (v.grading_mode_id <> 'exact_option.v1'
         or (select count(*) from public.exercise_option_sets s where s.item_version_id = v.id) = 1)
$$;


-- learning_review_candidates: cada ítem de una unidad lleva sus conceptos y sólo entra si el
-- usuario ya tiene estado en el SRS v2 para todos ellos (review_item_known 'srs').
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
                                                               'concepts', (select coalesce(jsonb_agg(distinct x.concept_id), '[]'::jsonb) from public.item_concepts x where x.item_id = r.item_id and x.role = 'target'),
                                                               'last_presented_at', (select max(p.presented_at) from public.exercise_presentations p
                                                                                     where p.user_id = s.user_id and p.item_id = r.item_id))
                                      order by r.item_id)
                           from cand r
                           where r.concept_id = s.concept_id and r.dimension = s.dimension
                             and public.review_item_known(p_user, r.item_id, 'srs')), '[]'::jsonb))
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


-- learning_start_review: la misma validación + ítem conocido + sin conceptos compartidos entre entradas.
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
  where r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x)
    and public.review_item_known(p_user, r.item_id, 'srs');
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
     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n
     or (select count(*) from (select distinct x ->> 'item_id' as item_id, ic.concept_id
                               from jsonb_array_elements(p_plan -> 'items') x
                               join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') t)
        <> (select count(distinct ic.concept_id) from jsonb_array_elements(p_plan -> 'items') x
            join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') then
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


-- learning_focus_candidates (Plus): igual, con «conocido» = palabras ya estudiadas en el v1.
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
                        'concepts', (select coalesce(jsonb_agg(distinct x.concept_id), '[]'::jsonb) from public.item_concepts x where x.item_id = r.item_id and x.role = 'target'),
                        'last_presented_at', (select max(x.presented_at) from public.exercise_presentations x
                                              where x.user_id = p_user and x.item_id = r.item_id))
                      order by r.item_id)
               from cand r where r.concept_id = c.id and public.review_item_known(p_user, r.item_id, 'v1')), '[]'::jsonb))
           order by p.next_review_at nulls last, c.id)
    from public.user_word_progress p
    join public.words w on w.id = p.word_id and w.is_published and w.language_code = p_lang
    join public.concepts c on c.word_id = w.id and c.kind = 'lexical' and c.status = 'active'
    where p.user_id = p_user and p.seen_count > 0), '[]'::jsonb));
end;
$$;


-- learning_start_focus_review (Plus): misma validación + ítem conocido + sin conceptos compartidos.
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
    and r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x)
    and public.review_item_known(p_user, r.item_id, 'v1');
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
     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n
     or (select count(*) from (select distinct x ->> 'item_id' as item_id, ic.concept_id
                               from jsonb_array_elements(p_plan -> 'items') x
                               join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') t)
        <> (select count(distinct ic.concept_id) from jsonb_array_elements(p_plan -> 'items') x
            join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') then
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


-- learning_review_content: agrega 'words' (todas las palabras de los conceptos léxicos target del
-- ítem, la del plan primero) para que la app muestre lecturas y audio de cada una.
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
           'words', (select jsonb_agg(to_jsonb(ww) order by (ww.id <> w.id), ww.id)
                     from public.words ww
                     where ww.id in (select xc.word_id from public.item_concepts x
                                     join public.concepts xc on xc.id = x.concept_id and xc.kind = 'lexical'
                                     where x.item_id = p.item_id and x.role = 'target')),
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


-- srs_v2_migrate_user_locked (15.3): la verificación del v1 también atribuye los intentos de
-- record_learning_session (sin ejercicio ni palabra: por su corrección → item_concepts → palabra), y
-- esos intentos ya no cuentan como categoría C. Sin esto, un usuario que repasó ítems de varios
-- conceptos antes del corte quedaría «sin reconstruir».
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
         count(*) filter (where (a.exercise_id is null and a.word_id is null
                               and not exists (select 1 from public.exercise_attempt_gradings g where g.attempt_id = a.id))
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
                and e.updated_at <= a.created_at and p.created_at <= ls.completed_at))
        or (a.word_id is null and a.exercise_id is null and exists (
              select 1 from public.exercise_attempt_gradings g
              join public.item_concepts ic on ic.item_id = g.item_id and ic.role = 'target'
              join public.concepts c on c.id = ic.concept_id and c.kind = 'lexical'
              where g.attempt_id = a.id and c.word_id = p.word_id)))
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


-- learning_start_basic_review (cierre de la fase 5): repaso básico armado por el servidor con las
-- reglas del SRS v1 cuando el v2 está apagado. Igual que learning_start_focus_review salvo: no exige Plus
-- (el básico es de todos), origen basic_review, foco {kind: 'basic'}, hasta 10 entradas, cada palabra
-- estudiada y VENCIDA en el v1 ahora, motivo 'due'.
create or replace function public.learning_start_basic_review(
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
  if v_kind is distinct from 'basic' then
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
    if v_source <> 'basic_review' then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true,
      'plan', (select items from public.srs_session_plans where session_id = p_session_id),
      'presentations', public.learning_presentations_public(p_user, p_session_id));
  end if;
  -- El repaso básico es de todos: sin comprobación de Plus.
  v_n := jsonb_array_length(p_plan -> 'items');
  if v_n = 0 then
    raise exception 'nothing_to_review' using errcode = 'P0002';
  end if;
  if v_n > 10 then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  select coalesce(jsonb_agg(to_jsonb(r)), '[]') into v_cand
  from public.review_item_candidates(p_lang) r
  where r.dimension = 'vocabulary'
    and r.item_id in (select x ->> 'item_id' from jsonb_array_elements(p_plan -> 'items') x)
    and public.review_item_known(p_user, r.item_id, 'v1');
  select count(*) into v_bad
  from jsonb_array_elements(p_plan -> 'items') with ordinality as t(x, ord)
  where (x ->> 'position')::integer is distinct from ord::integer
     or not exists (select 1 from jsonb_array_elements(v_cand) r
                    where r ->> 'item_id' = x ->> 'item_id' and r ->> 'concept_id' = x ->> 'concept_id'
                      and r ->> 'dimension' = x ->> 'dimension' and r ->> 'rung' = x ->> 'rung')
     or not exists (select 1 from public.concepts c
                    join public.user_word_progress p on p.word_id = c.word_id and p.user_id = p_user and p.seen_count > 0
                                                and p.next_review_at <= now()
                    join public.words w on w.id = c.word_id and w.language_code = p_lang
                    where c.id = x ->> 'concept_id' and true)
     or x ->> 'reason' is distinct from 'due';
  if v_bad > 0
     or (select count(distinct x ->> 'concept_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n
     or (select count(distinct x ->> 'item_id') from jsonb_array_elements(p_plan -> 'items') x) <> v_n
     or (select count(*) from (select distinct x ->> 'item_id' as item_id, ic.concept_id
                               from jsonb_array_elements(p_plan -> 'items') x
                               join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') t)
        <> (select count(distinct ic.concept_id) from jsonb_array_elements(p_plan -> 'items') x
            join public.item_concepts ic on ic.item_id = x ->> 'item_id' and ic.role = 'target') then
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
  values (p_session_id, p_user, p_lang, 'basic_review', coalesce(p_plan ->> 'planner_version', 'basic-1.0.0'),
    'srs-2.0.0', (select weights_version from public.srs_weights where status = 'active' limit 1),
    coalesce((p_plan ->> 'capacity')::integer, v_n), p_plan -> 'items', v_tz, (now() at time zone v_tz)::date,
    jsonb_build_object('kind', 'basic'));

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

-- <<< fin de lo generado

-- 7. Seguridad: RLS sin políticas; todo sólo para service_role.
alter table public.learning_session_clients enable row level security;
revoke all on public.learning_session_clients from anon, authenticated;

revoke execute on function public.review_item_known(uuid, text, text),
  public.learning_note_client(uuid, uuid, text, jsonb),
  public.record_learning_session(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb),
  public.learning_review_coverage(text),
  public.learning_route_usage(timestamptz)
from public, anon, authenticated;

revoke execute on function public.learning_start_basic_review(uuid, uuid, text, text, jsonb, jsonb)
from public, anon, authenticated;

grant execute on function public.learning_note_client(uuid, uuid, text, jsonb),
  public.learning_start_basic_review(uuid, uuid, text, text, jsonb, jsonb),
  public.record_learning_session(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb),
  public.learning_review_coverage(text),
  public.learning_route_usage(timestamptz)
to service_role;

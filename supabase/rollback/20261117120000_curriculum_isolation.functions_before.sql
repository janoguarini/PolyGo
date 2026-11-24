-- =====================================================================
-- Reversión de las 7 funciones que reemplaza 20261117120000_curriculum_isolation.sql.
--
-- Definiciones EXACTAS de producción (proyecto PolyGo) ANTES de aplicar la 117, exportadas el
-- 2026-11-18T01:25:10.770Z con pg_get_functiondef (solo lectura). No editar a mano: cada bloque
-- es la salida literal de pg_get_functiondef; la huella md5 de cada una está en su encabezado.
--
-- Uso (a mano, sólo si hay que revertir la 117): ejecutar este archivo completo. Va en una transacción.
--
-- Esto restaura SÓLO las 7 funciones reemplazadas y sus permisos. Una reversión completa de la 117
-- también necesita (en este orden, DESPUÉS de restaurar estas funciones, que ya no las usan):
--   drop function public.rush_my_unit_ids(text);
--   drop function public.rush_common_unit_ids(text, uuid[], smallint[]);
--   drop function public.rush_questions_in_units(text, integer, integer, text[]);
--   drop function public.rush_questions_in_units(text, integer, text[]);
--   drop function public.rush_fallback_unit_ids(text);
--   drop function public.rush_player_unit_ids(uuid, text, smallint);
--   drop function public.curriculum_unlocked_unit_ids(uuid, text);
--   drop function public.review_item_in_route(uuid, text);
--   drop function public.curriculum_unit_visible_for(uuid, text, smallint);
--   alter table public.ranked_queue drop column curriculum_api;
--   alter table public.friend_challenges drop column host_curriculum_api;
--   delete from supabase_migrations.schema_migrations where version = '20261117120000';
-- (Quedan como comentario a propósito: no se ejecutan con este archivo.)
-- =====================================================================

begin;

-- ---------- public.accept_friend_challenge(text) ----------
-- dueño: postgres · md5(pg_get_functiondef) = b9ccc980d2d5b26bf7b133802c950179 · md5(prosrc) = cd6d18abc0163a2d1f8276b7c8bd1aa5
-- permisos en producción: postgres=EXECUTE, authenticated=EXECUTE, service_role=EXECUTE
CREATE OR REPLACE FUNCTION public.accept_friend_challenge(p_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  c public.friend_challenges;
  new_id uuid;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into prof from public.profiles where id = uid;
  if prof.username is null or prof.onboarding_completed_at is null then
    raise exception 'onboarding_required' using errcode = '22023';
  end if;

  select * into c from public.friend_challenges where code = upper(trim(p_code)) for update;
  if c.code is null then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  if c.battle_id is not null then
    -- Reintento del mismo amigo (se cortó la red): la misma partida.
    if c.guest_id = uid then
      return jsonb_build_object('status', 'matched', 'battle_id', c.battle_id);
    end if;
    raise exception 'challenge_taken' using errcode = '22023';
  end if;
  if c.host_id = uid then
    raise exception 'own_challenge' using errcode = '22023';
  end if;
  -- Bloqueo en cualquier sentido o desafío para otro: como si el código no existiera.
  if public.is_blocked_between(uid, c.host_id) or (c.invitee_id is not null and c.invitee_id <> uid) then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  if c.cancelled or c.expires_at < now() then
    raise exception 'challenge_expired' using errcode = '22023';
  end if;
  if c.seen_at < now() - interval '10 seconds' then
    raise exception 'host_gone' using errcode = '22023';
  end if;
  if prof.target_language <> c.language_code
     or not exists (select 1 from public.player_ratings
                    where user_id = uid and language_code = c.language_code) then
    raise exception 'language_mismatch' using errcode = '22023';
  end if;

  new_id := gen_random_uuid();
  insert into public.battles (id, language_code, season_id, mode, is_ranked, status, protocol_version, started_at, questions)
  select new_id, c.language_code, s.id, 'word_rush', false, 'in_progress', 1, now() + interval '5 seconds',
         public.rush_questions(c.language_code, 40)
  from (select 1) as one
  left join public.seasons s on s.status = 'active';

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  select new_id, v.slot, v.user_id, pr.rating
  from (values (1::smallint, c.host_id), (2::smallint, uid)) as v (slot, user_id)
  join public.player_ratings pr on pr.user_id = v.user_id and pr.language_code = c.language_code;

  update public.friend_challenges set battle_id = new_id, guest_id = uid where code = c.code;
  return jsonb_build_object('status', 'matched', 'battle_id', new_id);
end;
$function$;
revoke all on function public.accept_friend_challenge(text) from public, anon, authenticated, service_role;
grant execute on function public.accept_friend_challenge(text) to authenticated;
grant execute on function public.accept_friend_challenge(text) to service_role;

-- ---------- public.get_learning_mastery(text,text) ----------
-- dueño: postgres · md5(pg_get_functiondef) = ccd88df60308151fad5ae32d909c792d · md5(prosrc) = d1d625a8af68deff4675790239d75da2
-- permisos en producción: postgres=EXECUTE, service_role=EXECUTE, authenticated=EXECUTE
CREATE OR REPLACE FUNCTION public.get_learning_mastery(p_language text, p_time_zone text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;
revoke all on function public.get_learning_mastery(text,text) from public, anon, authenticated, service_role;
grant execute on function public.get_learning_mastery(text,text) to service_role;
grant execute on function public.get_learning_mastery(text,text) to authenticated;

-- ---------- public.join_human_queue() ----------
-- dueño: postgres · md5(pg_get_functiondef) = d101f72de66dc87584dd5e6aa391187b · md5(prosrc) = 0cb71701fb6d32c8e055a0f34f7467f0
-- permisos en producción: postgres=EXECUTE, authenticated=EXECUTE, service_role=EXECUTE
CREATE OR REPLACE FUNCTION public.join_human_queue()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  r public.player_ratings;
  q public.ranked_queue;
  opp public.ranked_queue;
  open_id uuid;
  new_id uuid;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into prof from public.profiles where id = uid;
  if prof.username is null or prof.onboarding_completed_at is null then
    raise exception 'onboarding_required' using errcode = '22023';
  end if;
  select * into r from public.player_ratings where user_id = uid and language_code = prof.target_language;
  if r.user_id is null then
    raise exception 'language_unavailable' using errcode = '22023';
  end if;

  -- Partidas propias que quedaron abiertas: se liquidan si ya venció su plazo.
  for open_id in
    select bp.battle_id from public.battle_players bp join public.battles b on b.id = bp.battle_id
    where bp.user_id = uid and not b.has_bot and b.status = 'in_progress'
  loop
    perform public.settle_human_match(open_id);
  end loop;

  insert into public.ranked_queue as rq (user_id, language_code, rating)
  values (uid, prof.target_language, r.rating)
  on conflict (user_id) do update set
    seen_at = now(),
    rating = excluded.rating,
    language_code = excluded.language_code,
    joined_at = case when rq.active and rq.battle_id is null then rq.joined_at else now() end,
    battle_id = case when rq.active then rq.battle_id else null end,
    active = true
  returning * into q;

  -- Otro jugador ya lo emparejó.
  if q.battle_id is not null then
    update public.ranked_queue set active = false where user_id = uid;
    return jsonb_build_object('status', 'matched', 'battle_id', q.battle_id);
  end if;

  select * into opp from public.ranked_queue o
  where o.user_id <> uid and o.active and o.battle_id is null
    and o.language_code = q.language_code
    and o.seen_at > now() - interval '5 seconds'
    and abs(o.rating - q.rating) <= least(public.queue_window(q.joined_at), public.queue_window(o.joined_at))
    and not public.is_blocked_between(uid, o.user_id)
  order by abs(o.rating - q.rating), o.joined_at
  limit 1
  for update skip locked;

  if opp.user_id is null then
    return jsonb_build_object('status', 'waiting', 'window', public.queue_window(q.joined_at),
      'waited_ms', floor(extract(epoch from (now() - q.joined_at)) * 1000)::bigint);
  end if;

  new_id := gen_random_uuid();
  -- Empieza en 5 s: tiempo para que el rival se entere en su próxima consulta.
  insert into public.battles (id, language_code, season_id, mode, is_ranked, status, protocol_version, started_at, questions)
  select new_id, q.language_code, s.id, 'word_rush', true, 'in_progress', 1, now() + interval '5 seconds',
         public.rush_questions(q.language_code, 40, least(q.rating, opp.rating))
  from (select 1) as one
  left join public.seasons s on s.status = 'active';

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  select new_id, v.slot, v.user_id, pr.rating
  from (values (1::smallint, uid), (2::smallint, opp.user_id)) as v (slot, user_id)
  join public.player_ratings pr on pr.user_id = v.user_id and pr.language_code = q.language_code;

  update public.ranked_queue set battle_id = new_id, active = false where user_id = uid;
  update public.ranked_queue set battle_id = new_id where user_id = opp.user_id;
  return jsonb_build_object('status', 'matched', 'battle_id', new_id);
end;
$function$;
revoke all on function public.join_human_queue() from public, anon, authenticated, service_role;
grant execute on function public.join_human_queue() to authenticated;
grant execute on function public.join_human_queue() to service_role;

-- ---------- public.learning_review_candidates(uuid,text,text,timestamp with time zone) ----------
-- dueño: postgres · md5(pg_get_functiondef) = 55cf34d244f9815a44f6103bb3ad71d6 · md5(prosrc) = 0b924b47c6e4606f4d8d3d07fa17c038
-- permisos en producción: postgres=EXECUTE, service_role=EXECUTE
CREATE OR REPLACE FUNCTION public.learning_review_candidates(p_user uuid, p_lang text, p_tz text, p_now timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;
revoke all on function public.learning_review_candidates(uuid,text,text,timestamp with time zone) from public, anon, authenticated, service_role;
grant execute on function public.learning_review_candidates(uuid,text,text,timestamp with time zone) to service_role;

-- ---------- public.review_item_known(uuid,text,text) ----------
-- dueño: postgres · md5(pg_get_functiondef) = afda30c0cab0e35e435b1c105d05a34a · md5(prosrc) = d12299493b0b8a3d73fdf01a4094cb18
-- permisos en producción: postgres=EXECUTE, service_role=EXECUTE
CREATE OR REPLACE FUNCTION public.review_item_known(p_user uuid, p_item text, p_mode text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
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
$function$;
revoke all on function public.review_item_known(uuid,text,text) from public, anon, authenticated, service_role;
grant execute on function public.review_item_known(uuid,text,text) to service_role;

-- ---------- public.rush_questions(text,integer,integer) ----------
-- dueño: postgres · md5(pg_get_functiondef) = cee1282292b4c1450806162ec24d2d9f · md5(prosrc) = 5af099d6444937f5859e0791d82abe38
-- permisos en producción: postgres=EXECUTE, service_role=EXECUTE
CREATE OR REPLACE FUNCTION public.rush_questions(p_language text, p_count integer, p_rating integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  deck text[];
  word record;
  previous text;
  direction text;
  correct text;
  options text[];
  result jsonb := '[]'::jsonb;
  i integer := 0;
  levels text[] := public.rush_levels(p_rating);
  writing boolean := public.rush_writing_for(p_rating, p_language);
begin
  -- Sin palabras suficientes de esos niveles (no debería pasar): todas las publicadas.
  if (select count(distinct lower(trim(w.text))) from public.words w
      join public.curriculum_units u on u.id = w.unit_id
      where w.language_code = p_language and w.is_published and u.level = any (levels)) < 4 then
    levels := array['A1', 'A2'];
  end if;
  while i < p_count loop
    if deck is null or cardinality(deck) = 0 then
      select array_agg(id order by random()) into deck from (
        select distinct on (lower(trim(w.text))) w.id from public.words w
        join public.curriculum_units u on u.id = w.unit_id
        where w.language_code = p_language and w.is_published and u.level = any (levels)
        order by lower(trim(w.text)), w.id) w;
      if deck is null or cardinality(deck) < 4 then
        raise exception 'not_enough_words' using errcode = '22023';
      end if;
      -- No repetir la misma palabra dos veces seguidas al rearmar el mazo.
      if deck[1] = previous then deck := deck[2:] || deck[1]; end if;
    end if;
    select id, text, public.rush_label(translation_es) as translation_es into word
    from public.words where id = deck[1];
    deck := deck[2:];
    previous := word.id;

    -- Desde Oro, una de cada tres se escribe en el idioma (en chino nunca: no se escriben caracteres): sin distractores (la única opción es la respuesta).
    if writing and i % 3 = 2 then
      result := result || jsonb_build_object(
        'index', i,
        'wordId', word.id,
        'direction', 'es_en',
        'prompt', word.translation_es,
        'options', jsonb_build_array(word.text),
        'correctOption', 0,
        'write', true);
      i := i + 1;
      continue;
    end if;

    direction := case when random() < 0.5 then 'en_es' else 'es_en' end;
    correct := case when direction = 'en_es' then word.translation_es else word.text end;
    -- Distractores: ni el mismo texto ni la misma traducción (dos opciones válidas), sin repetir.
    select array_agg(v order by random()) into options from (
      select v from (
        select distinct on (lower(trim(v))) v from (
          select case when direction = 'en_es' then public.rush_label(w.translation_es) else w.text end as v
          from public.words w
          join public.curriculum_units u on u.id = w.unit_id
          where w.language_code = p_language and w.is_published and w.id <> word.id
            and u.level = any (levels)
            and lower(trim(w.text)) <> lower(trim(word.text))
            and lower(public.rush_label(w.translation_es)) <> lower(word.translation_es)
        ) c
        where lower(trim(v)) <> lower(trim(correct))
        order by lower(trim(v)), random()
      ) d
      order by random()
      limit 3
    ) e;
    options := options || correct;
    select array_agg(o order by random()) into options from unnest(options) o;

    result := result || jsonb_build_object(
      'index', i,
      'wordId', word.id,
      'direction', direction,
      'prompt', case when direction = 'en_es' then word.text else word.translation_es end,
      'options', to_jsonb(options),
      'correctOption', array_position(options, correct) - 1);
    i := i + 1;
  end loop;
  return result;
end;
$function$;
revoke all on function public.rush_questions(text,integer,integer) from public, anon, authenticated, service_role;
grant execute on function public.rush_questions(text,integer,integer) to service_role;

-- ---------- public.rush_questions(text,integer) ----------
-- dueño: postgres · md5(pg_get_functiondef) = 98cde1ef4be16f0819fde9e686c77169 · md5(prosrc) = 64f9387a7d61fe1bc23de061243cdaec
-- permisos en producción: postgres=EXECUTE, service_role=EXECUTE
CREATE OR REPLACE FUNCTION public.rush_questions(p_language text, p_count integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  deck text[];
  word record;
  previous text;
  direction text;
  correct text;
  options text[];
  result jsonb := '[]'::jsonb;
  i integer := 0;
begin
  while i < p_count loop
    if deck is null or cardinality(deck) = 0 then
      select array_agg(id order by random()) into deck from (
        select distinct on (lower(trim(text))) id from public.words
        where language_code = p_language and is_published
        order by lower(trim(text)), id) w;
      if deck is null or cardinality(deck) < 4 then
        raise exception 'not_enough_words' using errcode = '22023';
      end if;
      -- No repetir la misma palabra dos veces seguidas al rearmar el mazo.
      if deck[1] = previous then deck := deck[2:] || deck[1]; end if;
    end if;
    select id, text, translation_es into word from public.words where id = deck[1];
    deck := deck[2:];
    previous := word.id;

    direction := case when random() < 0.5 then 'en_es' else 'es_en' end;
    correct := case when direction = 'en_es' then word.translation_es else word.text end;
    -- Distractores: ni el mismo texto ni la misma traducción (dos opciones válidas), sin repetir.
    select array_agg(v order by random()) into options from (
      select v from (
        select distinct on (lower(trim(v))) v from (
          select case when direction = 'en_es' then w.translation_es else w.text end as v
          from public.words w
          where w.language_code = p_language and w.is_published and w.id <> word.id
            and lower(trim(w.text)) <> lower(trim(word.text))
            and lower(trim(w.translation_es)) <> lower(trim(word.translation_es))
        ) c
        where lower(trim(v)) <> lower(trim(correct))
        order by lower(trim(v)), random()
      ) d
      order by random()
      limit 3
    ) e;
    options := options || correct;
    select array_agg(o order by random()) into options from unnest(options) o;

    result := result || jsonb_build_object(
      'index', i,
      'wordId', word.id,
      'direction', direction,
      'prompt', case when direction = 'en_es' then word.text else word.translation_es end,
      'options', to_jsonb(options),
      'correctOption', array_position(options, correct) - 1);
    i := i + 1;
  end loop;
  return result;
end;
$function$;
revoke all on function public.rush_questions(text,integer) from public, anon, authenticated, service_role;
grant execute on function public.rush_questions(text,integer) to service_role;

commit;

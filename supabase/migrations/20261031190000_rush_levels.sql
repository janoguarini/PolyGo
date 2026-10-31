-- =====================================================================
-- Ranked más difícil a medida que subís: las preguntas de Word Rush salen sólo de los niveles
-- del currículo que habilita el rating (Bronce: A1; desde Plata: A1 + A2). Espejo de
-- shared/wordRush.ts (RUSH_LEVELS, rushLabel). En partidas entre personas manda el rating más
-- bajo de los dos. Las traducciones se muestran sin aclaraciones entre paréntesis.
-- =====================================================================

create or replace function public.rush_levels(p_rating integer)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case when coalesce(p_rating, 0) >= 400 then array['A1', 'A2'] else array['A1'] end;
$$;

create or replace function public.rush_label(p_translation text)
returns text
language sql
immutable
set search_path = ''
as $$
  select trim(regexp_replace(p_translation, '\s*\([^)]*\)', '', 'g'));
$$;

create or replace function public.rush_questions(p_language text, p_count integer, p_rating integer)
returns jsonb
language plpgsql
volatile
set search_path = ''
as $$
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
$$;

create or replace function public.join_human_queue()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

create or replace function public.accept_friend_challenge(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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
  -- Bloqueo en cualquier sentido: como si el código no existiera (no revela quién bloqueó).
  if public.is_blocked_between(uid, c.host_id) then
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
         public.rush_questions(c.language_code, 40,
           (select min(pr.rating) from public.player_ratings pr
            where pr.language_code = c.language_code and pr.user_id in (c.host_id, uid)))
  from (select 1) as one
  left join public.seasons s on s.status = 'active';

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  select new_id, v.slot, v.user_id, pr.rating
  from (values (1::smallint, c.host_id), (2::smallint, uid)) as v (slot, user_id)
  join public.player_ratings pr on pr.user_id = v.user_id and pr.language_code = c.language_code;

  update public.friend_challenges set battle_id = new_id, guest_id = uid where code = c.code;
  return jsonb_build_object('status', 'matched', 'battle_id', new_id);
end;
$$;

-- Permisos. La versión anterior de rush_questions (sin rating) queda sin uso.
revoke all on function public.rush_levels(integer) from public, anon;
grant execute on function public.rush_levels(integer) to authenticated;
revoke all on function public.rush_label(text) from public, anon;
grant execute on function public.rush_label(text) to authenticated;
revoke all on function public.rush_questions(text, integer, integer) from public, anon, authenticated;
revoke all on function public.join_human_queue() from public, anon;
grant execute on function public.join_human_queue() to authenticated;
revoke all on function public.accept_friend_challenge(text) from public, anon;
grant execute on function public.accept_friend_challenge(text) to authenticated;

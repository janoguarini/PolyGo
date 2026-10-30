-- Ranked entre personas SIN servidor de partidas (MVP para pocos testers; antes del lanzamiento se
-- pasa al servidor de server/). La base empareja (cola con ventana de ELO), genera las preguntas y
-- fija la hora de inicio; cada teléfono juega su parte y ve al rival en vivo por Supabase Realtime
-- (broadcast, no autoritativo); al terminar cada uno informa su puntaje y la base liquida a ambos.
-- Límite: el puntaje lo informa el teléfono (validado, no observado). Ver docs/BATTLE_PROTOCOL.md.

alter table public.battles add column questions jsonb;
alter table public.battle_players add column submitted_at timestamptz;

-- ---------- cola ----------
-- Una fila por usuario que se reactiva en cada búsqueda (nunca se borran filas). seen_at: el cliente consulta
-- cada ~1,5 s; quien deja de consultar sale de la cola sola.
create table public.ranked_queue (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  language_code text not null references public.languages (code),
  rating integer not null,
  joined_at timestamptz not null default now(),
  seen_at timestamptz not null default now(),
  active boolean not null default true,
  battle_id uuid references public.battles (id) on delete set null
);
create index ranked_queue_waiting_idx on public.ranked_queue (language_code) where active and battle_id is null;
alter table public.ranked_queue enable row level security;
revoke all on public.ranked_queue from anon, authenticated;

/** Ventana de ELO según la espera (shared/protocol.ts: MATCHMAKING). */
create or replace function public.queue_window(p_joined_at timestamptz)
returns integer
language sql
stable
set search_path = ''
as $$
  select least(400, 100 + 50 * floor(extract(epoch from (now() - p_joined_at)) / 5)::int);
$$;

-- ---------- preguntas (shared/wordRush.ts: generateQuestions) ----------
create or replace function public.rush_questions(p_language text, p_count integer)
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
$$;

-- ---------- emparejamiento ----------
/**
 * Entra (o sigue) en la cola ranked y empareja si hay alguien compatible. El cliente la llama cada
 * ~1,5 s mientras busca. Devuelve {status: 'matched', battle_id} o {status: 'waiting', window, waited_ms}.
 */
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
         public.rush_questions(q.language_code, 40)
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

/** Sale de la cola. Si justo lo emparejaron, devuelve esa partida para que la juegue. */
create or replace function public.leave_human_queue()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  q public.ranked_queue;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into q from public.ranked_queue where user_id = auth.uid() for update;
  update public.ranked_queue set active = false where user_id = auth.uid();
  return jsonb_build_object('battle_id', case when q.active then q.battle_id end);
end;
$$;

/** Datos de la partida para un participante: rivales, preguntas y horarios (ms del servidor). */
create or replace function public.get_human_match(p_battle_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  b public.battles;
  my_slot smallint;
begin
  select bp.slot into my_slot from public.battle_players bp where bp.battle_id = p_battle_id and bp.user_id = uid;
  select * into b from public.battles where id = p_battle_id;
  if uid is null or my_slot is null or b.has_bot then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;
  return jsonb_build_object(
    'battle_id', b.id,
    'your_slot', my_slot,
    'server_now', floor(extract(epoch from clock_timestamp()) * 1000)::bigint,
    'starts_at', floor(extract(epoch from b.started_at) * 1000)::bigint,
    'ends_at', floor(extract(epoch from b.started_at + interval '75 seconds') * 1000)::bigint,
    'questions', b.questions,
    'players', (select jsonb_agg(jsonb_build_object(
                  'slot', bp.slot, 'username', p.username, 'avatar_id', p.avatar_id,
                  'avatar_path', p.avatar_path, 'rating', pr.rating, 'games_played', pr.games_played)
                  order by bp.slot)
                from public.battle_players bp
                join public.profiles p on p.id = bp.user_id
                left join public.player_ratings pr on pr.user_id = bp.user_id and pr.language_code = b.language_code
                where bp.battle_id = b.id));
end;
$$;

-- ---------- liquidación ----------
/**
 * Liquida la partida si ya están los dos puntajes, o si venció el plazo (75 s + 30 s de gracia):
 * quien no informó pierde por abandono. Devuelve {pending: true} si todavía falta. Idempotente.
 * ELO: shared/ranking.ts con anti-farming por rival repetido en 24 h.
 */
create or replace function public.settle_human_match(p_battle_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.battles;
  a public.battle_players;
  c public.battle_players;
  ra public.player_ratings;
  rc public.player_ratings;
  a_forfeit boolean;
  c_forfeit boolean;
  a_acc double precision;
  c_acc double precision;
  a_result text;
  c_result text;
  pair_count integer;
  mult double precision;
  a_after integer;
  c_after integer;
  achievements jsonb := '{}'::jsonb;
  unlocked text[];
  uid uuid;
begin
  select * into b from public.battles where id = p_battle_id for update;
  if b.id is null or b.has_bot then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;
  select * into a from public.battle_players where battle_id = p_battle_id and slot = 1;
  select * into c from public.battle_players where battle_id = p_battle_id and slot = 2;

  if b.status = 'in_progress' then
    if (a.submitted_at is null or c.submitted_at is null)
       and now() < b.started_at + interval '105 seconds' then
      return jsonb_build_object('pending', true);
    end if;

    -- Quien no informó a tiempo abandonó (puntaje 0).
    a_forfeit := a.submitted_at is null or a.forfeited;
    c_forfeit := c.submitted_at is null or c.forfeited;
    if a.submitted_at is null then a.score := 0; a.correct_answers := 0; a.total_answers := 0; end if;
    if c.submitted_at is null then c.score := 0; c.correct_answers := 0; c.total_answers := 0; end if;

    -- shared/wordRush.ts: decideOutcomes.
    a_acc := case when a.total_answers = 0 then 0 else a.correct_answers::double precision / a.total_answers end;
    c_acc := case when c.total_answers = 0 then 0 else c.correct_answers::double precision / c.total_answers end;
    a_result := case
      when a_forfeit and c_forfeit then 'loss'
      when a_forfeit then 'loss'
      when c_forfeit then 'win'
      when a.score <> c.score then case when a.score > c.score then 'win' else 'loss' end
      when abs(a_acc - c_acc) > 1e-9 then case when a_acc > c_acc then 'win' else 'loss' end
      else 'draw' end;
    c_result := case
      when a_forfeit and c_forfeit then 'loss'
      when a_result = 'win' then 'loss'
      when a_result = 'loss' then 'win'
      else 'draw' end;

    -- Anti-farming: partidas ranked liquidadas entre ambos en 24 h, contando ésta.
    select count(*) + 1 into pair_count from public.battles x
    where x.id <> p_battle_id and x.is_ranked and not x.has_bot
      and x.status in ('completed', 'forfeited') and x.ended_at > now() - interval '24 hours'
      and (select count(*) from public.battle_players y
           where y.battle_id = x.id and y.user_id in (a.user_id, c.user_id)) = 2;
    mult := case when pair_count >= 5 then 0 when pair_count >= 3 then 0.5 else 1 end;

    -- Bloqueo en orden fijo para no trabarse con otra liquidación.
    perform 1 from public.player_ratings
    where user_id in (a.user_id, c.user_id) and language_code = b.language_code
    order by user_id for update;
    select * into ra from public.player_ratings where user_id = a.user_id and language_code = b.language_code;
    select * into rc from public.player_ratings where user_id = c.user_id and language_code = b.language_code;

    a_after := greatest(100, ra.rating + floor(
      (case when ra.games_played < 5 then 48 else 32 end) * mult
      * ((case a_result when 'win' then 1 when 'draw' then 0.5 else 0 end)
         - 1 / (1 + power(10, (rc.rating - ra.rating)::double precision / 400))) + 0.5)::int);
    c_after := greatest(100, rc.rating + floor(
      (case when rc.games_played < 5 then 48 else 32 end) * mult
      * ((case c_result when 'win' then 1 when 'draw' then 0.5 else 0 end)
         - 1 / (1 + power(10, (ra.rating - rc.rating)::double precision / 400))) + 0.5)::int);

    update public.player_ratings p set
      rating = v.new_rating,
      peak_rating = greatest(p.peak_rating, v.new_rating),
      games_played = p.games_played + 1,
      wins = p.wins + (v.res = 'win')::int,
      losses = p.losses + (v.res = 'loss')::int,
      draws = p.draws + (v.res = 'draw')::int,
      win_streak = case when v.res = 'win' then p.win_streak + 1 else 0 end,
      best_win_streak = greatest(p.best_win_streak, case when v.res = 'win' then p.win_streak + 1 else 0 end)
    from (values (a.user_id, a_after, a_result), (c.user_id, c_after, c_result)) as v (user_id, new_rating, res)
    where p.user_id = v.user_id and p.language_code = b.language_code;

    insert into public.rating_history (user_id, language_code, season_id, battle_id, reason, rating_before, rating_after)
    values (a.user_id, b.language_code, b.season_id, p_battle_id, 'battle', ra.rating, a_after),
           (c.user_id, b.language_code, b.season_id, p_battle_id, 'battle', rc.rating, c_after);

    update public.battle_players set score = a.score, correct_answers = a.correct_answers,
      total_answers = a.total_answers, result = a_result, forfeited = a_forfeit,
      rating_before = ra.rating, rating_after = a_after
    where battle_id = p_battle_id and slot = 1;
    update public.battle_players set score = c.score, correct_answers = c.correct_answers,
      total_answers = c.total_answers, result = c_result, forfeited = c_forfeit,
      rating_before = rc.rating, rating_after = c_after
    where battle_id = p_battle_id and slot = 2;
    update public.battles set status = case when a_forfeit or c_forfeit then 'forfeited' else 'completed' end,
      ended_at = now()
    where id = p_battle_id;

    foreach uid in array array[a.user_id, c.user_id] loop
      unlocked := public.evaluate_achievements(uid);
      achievements := achievements || jsonb_build_object(uid::text, (
        select coalesce(jsonb_agg(jsonb_build_object('id', x.id, 'title', x.title_es, 'icon', x.icon)
                                  order by x.position), '[]'::jsonb)
        from public.achievements x where x.id = any(unlocked)));
    end loop;
  end if;

  select status into b.status from public.battles where id = p_battle_id;
  return jsonb_build_object(
    'pending', false,
    'battle_id', p_battle_id,
    'status', b.status,
    'achievements', achievements,
    'players', (select jsonb_agg(jsonb_build_object(
                  'slot', bp.slot, 'username', coalesce(p.username, 'Jugador eliminado'),
                  'score', bp.score, 'correct', bp.correct_answers, 'answered', bp.total_answers,
                  'result', bp.result, 'forfeited', bp.forfeited,
                  'rating_before', bp.rating_before, 'rating_after', bp.rating_after) order by bp.slot)
                from public.battle_players bp left join public.profiles p on p.id = bp.user_id
                where bp.battle_id = p_battle_id));
end;
$$;

/** Informa el puntaje propio (o el abandono) y liquida si ya está el del rival. */
create or replace function public.finish_human_match(
  p_battle_id uuid, p_score integer, p_correct integer, p_answered integer, p_forfeit boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  b public.battles;
  me public.battle_players;
  forfeit boolean := coalesce(p_forfeit, false);
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into b from public.battles where id = p_battle_id;
  select * into me from public.battle_players where battle_id = p_battle_id and user_id = uid;
  if b.id is null or b.has_bot or me.battle_id is null then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;

  if b.status = 'in_progress' and me.submitted_at is null then
    if not forfeit and now() < b.started_at + interval '70 seconds' then
      raise exception 'too_early' using errcode = '22023';
    end if;
    if p_answered is null or p_correct is null or p_score is null
       or p_answered not between 0 and coalesce(jsonb_array_length(b.questions), 40)
       or p_correct not between 0 and p_answered
       or p_score not between 0 and p_correct * 150 then
      if not forfeit then
        raise exception 'invalid_result' using errcode = '22023';
      end if;
      p_score := 0; p_correct := 0; p_answered := 0;
    end if;
    update public.battle_players set score = p_score, correct_answers = p_correct,
      total_answers = p_answered, forfeited = forfeit, submitted_at = now()
    where battle_id = p_battle_id and user_id = uid;
  end if;
  return public.settle_human_match(p_battle_id);
end;
$$;

/** Resultado (o {pending: true}) para un participante; también cierra por vencimiento. */
create or replace function public.human_match_result(p_battle_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.battle_players where battle_id = p_battle_id and user_id = auth.uid()) then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;
  return public.settle_human_match(p_battle_id);
end;
$$;

revoke all on function public.queue_window(timestamptz) from public, anon, authenticated;
revoke all on function public.rush_questions(text, integer) from public, anon, authenticated;
revoke all on function public.settle_human_match(uuid) from public, anon, authenticated;
revoke all on function public.join_human_queue() from public, anon;
grant execute on function public.join_human_queue() to authenticated;
revoke all on function public.leave_human_queue() from public, anon;
grant execute on function public.leave_human_queue() to authenticated;
revoke all on function public.get_human_match(uuid) from public, anon;
grant execute on function public.get_human_match(uuid) to authenticated;
revoke all on function public.finish_human_match(uuid, integer, integer, integer, boolean) from public, anon;
grant execute on function public.finish_human_match(uuid, integer, integer, integer, boolean) to authenticated;
revoke all on function public.human_match_result(uuid) from public, anon;
grant execute on function public.human_match_result(uuid) to authenticated;

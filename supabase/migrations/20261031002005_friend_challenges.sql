-- Desafío a un amigo: quien desafía crea un código (o link polygo://challenge/<código>) y espera;
-- el amigo lo ingresa y la base arma la misma partida entre personas que la cola ranked
-- (20261030221420_human_matches.sql), pero amistosa: is_ranked = false, no mueve el ELO ni las
-- estadísticas de player_ratings (y por eso tampoco los logros).

create table public.friend_challenges (
  code text primary key,
  host_id uuid not null references public.profiles (id) on delete cascade,
  language_code text not null references public.languages (code),
  created_at timestamptz not null default now(),
  -- Quien desafía consulta cada ~1,5 s; si deja de hacerlo, el código ya no se puede aceptar.
  seen_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '15 minutes',
  cancelled boolean not null default false,
  guest_id uuid references public.profiles (id) on delete set null,
  battle_id uuid references public.battles (id) on delete set null
);
create index friend_challenges_host_idx on public.friend_challenges (host_id, created_at);
alter table public.friend_challenges enable row level security;
revoke all on public.friend_challenges from anon, authenticated;

/** Sin letras ni números que se confundan al dictarlos (0/O, 1/I/L). */
create or replace function public.new_challenge_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code text;
begin
  loop
    select string_agg(substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1), '')
      into v_code from generate_series(1, 6);
    exit when not exists (select 1 from public.friend_challenges c where c.code = v_code);
  end loop;
  return v_code;
end;
$$;

/** Crea un desafío (anula el anterior que siguiera abierto). Devuelve {code, expires_at}. */
create or replace function public.create_friend_challenge()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  c public.friend_challenges;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into prof from public.profiles where id = uid;
  if prof.username is null or prof.onboarding_completed_at is null then
    raise exception 'onboarding_required' using errcode = '22023';
  end if;
  if not exists (select 1 from public.player_ratings
                 where user_id = uid and language_code = prof.target_language) then
    raise exception 'language_unavailable' using errcode = '22023';
  end if;
  if (select count(*) from public.friend_challenges
      where host_id = uid and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'match_rate_limited' using errcode = '22023';
  end if;

  update public.friend_challenges set cancelled = true
  where host_id = uid and battle_id is null and not cancelled;

  insert into public.friend_challenges (code, host_id, language_code)
  values (public.new_challenge_code(), uid, prof.target_language)
  returning * into c;
  return jsonb_build_object('code', c.code,
    'expires_at', floor(extract(epoch from c.expires_at) * 1000)::bigint);
end;
$$;

/**
 * Quien desafía consulta si el amigo ya entró: {status: 'waiting'|'matched'|'expired', battle_id}.
 * Cada consulta lo marca como presente.
 */
create or replace function public.friend_challenge_status(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c public.friend_challenges;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  update public.friend_challenges set seen_at = now()
  where code = upper(trim(p_code)) and host_id = auth.uid()
  returning * into c;
  if c.code is null then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  return jsonb_build_object(
    'status', case when c.battle_id is not null then 'matched'
                   when c.cancelled or c.expires_at < now() then 'expired'
                   else 'waiting' end,
    'battle_id', c.battle_id);
end;
$$;

/** El amigo acepta: arma la partida (empieza en 5 s) y devuelve {status: 'matched', battle_id}. */
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
$$;

/** Quien desafía se va antes de que entre el amigo. */
create or replace function public.cancel_friend_challenge(p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  update public.friend_challenges set cancelled = true
  where code = upper(trim(p_code)) and host_id = auth.uid() and battle_id is null;
end;
$$;

-- ---------- partida: igual que ranked, con 'ranked' en la respuesta ----------
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
    'ranked', b.is_ranked,
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

/**
 * Como antes, pero un amistoso (is_ranked = false) sólo guarda puntajes y resultado: no toca
 * player_ratings, rating_history ni logros, y devuelve los ratings en null.
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
  a_before integer;
  c_before integer;
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

    a_before := a.rating_before;
    c_before := c.rating_before;
    a_after := a.rating_before;
    c_after := c.rating_before;

    if b.is_ranked then
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
      a_before := ra.rating;
      c_before := rc.rating;

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
    end if;

    update public.battle_players set score = a.score, correct_answers = a.correct_answers,
      total_answers = a.total_answers, result = a_result, forfeited = a_forfeit,
      rating_before = a_before, rating_after = a_after
    where battle_id = p_battle_id and slot = 1;
    update public.battle_players set score = c.score, correct_answers = c.correct_answers,
      total_answers = c.total_answers, result = c_result, forfeited = c_forfeit,
      rating_before = c_before, rating_after = c_after
    where battle_id = p_battle_id and slot = 2;
    update public.battles set status = case when a_forfeit or c_forfeit then 'forfeited' else 'completed' end,
      ended_at = now()
    where id = p_battle_id;

    if b.is_ranked then
      foreach uid in array array[a.user_id, c.user_id] loop
        unlocked := public.evaluate_achievements(uid);
        achievements := achievements || jsonb_build_object(uid::text, (
          select coalesce(jsonb_agg(jsonb_build_object('id', x.id, 'title', x.title_es, 'icon', x.icon)
                                    order by x.position), '[]'::jsonb)
          from public.achievements x where x.id = any(unlocked)));
      end loop;
    end if;
  end if;

  select status into b.status from public.battles where id = p_battle_id;
  return jsonb_build_object(
    'pending', false,
    'battle_id', p_battle_id,
    'status', b.status,
    'ranked', b.is_ranked,
    'achievements', achievements,
    'players', (select jsonb_agg(jsonb_build_object(
                  'slot', bp.slot, 'username', coalesce(p.username, 'Jugador eliminado'),
                  'score', bp.score, 'correct', bp.correct_answers, 'answered', bp.total_answers,
                  'result', bp.result, 'forfeited', bp.forfeited,
                  'rating_before', case when b.is_ranked then bp.rating_before end,
                  'rating_after', case when b.is_ranked then bp.rating_after end) order by bp.slot)
                from public.battle_players bp left join public.profiles p on p.id = bp.user_id
                where bp.battle_id = p_battle_id));
end;
$$;

revoke all on function public.new_challenge_code() from public, anon, authenticated;
revoke all on function public.settle_human_match(uuid) from public, anon, authenticated;
revoke all on function public.create_friend_challenge() from public, anon;
grant execute on function public.create_friend_challenge() to authenticated;
revoke all on function public.friend_challenge_status(text) from public, anon;
grant execute on function public.friend_challenge_status(text) to authenticated;
revoke all on function public.accept_friend_challenge(text) from public, anon;
grant execute on function public.accept_friend_challenge(text) to authenticated;
revoke all on function public.cancel_friend_challenge(text) from public, anon;
grant execute on function public.cancel_friend_challenge(text) to authenticated;
revoke all on function public.get_human_match(uuid) from public, anon;
grant execute on function public.get_human_match(uuid) to authenticated;

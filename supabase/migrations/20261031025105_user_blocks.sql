-- Bloquear usuarios (Apple 1.2: contenido generado por usuarios). Quien bloquea deja de cruzarse con
-- el bloqueado: la cola ranked no los empareja (en ningún sentido), el bloqueado no puede entrar a
-- sus desafíos y la app lo oculta de la clasificación y de su perfil. Sólo quien bloquea ve sus
-- bloqueos; el bloqueado no se entera. Desbloquear no borra la fila: la marca inactiva (queda el
-- historial para moderación).

create table public.user_blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index user_blocks_blocked_idx on public.user_blocks (blocked_id) where active;
alter table public.user_blocks enable row level security;
revoke all on public.user_blocks from anon, authenticated;

/** Hay un bloqueo entre los dos, en cualquier sentido. */
create or replace function public.is_blocked_between(p_a uuid, p_b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.user_blocks
                 where active
                   and ((blocker_id = p_a and blocked_id = p_b) or (blocker_id = p_b and blocked_id = p_a)));
$$;

/** Bloquea a un jugador. Idempotente. Los desafíos abiertos siguen: el bloqueo se chequea al entrar. */
create or replace function public.block_user(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_user_id = uid then
    raise exception 'cannot_block_self' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;
  if (select count(*) from public.user_blocks where blocker_id = uid and active) >= 500 then
    raise exception 'block_limit' using errcode = '22023';
  end if;
  insert into public.user_blocks as b (blocker_id, blocked_id) values (uid, p_user_id)
  on conflict (blocker_id, blocked_id) do update set
    active = true,
    created_at = case when b.active then b.created_at else now() end,
    updated_at = now();
end;
$$;

create or replace function public.unblock_user(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  update public.user_blocks set active = false, updated_at = now()
  where blocker_id = auth.uid() and blocked_id = p_user_id and active;
end;
$$;

/** Jugadores que bloqueé, del más reciente al más viejo (para Ajustes y para ocultarlos). */
create or replace function public.get_blocked_users()
returns table (user_id uuid, username text, avatar_id text, blocked_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select b.blocked_id, coalesce(p.username, 'Jugador'), p.avatar_id, b.created_at
  from public.user_blocks b join public.profiles p on p.id = b.blocked_id
  where b.blocker_id = auth.uid() and b.active
  order by b.created_at desc;
$$;

-- ---------- la cola ranked no empareja a quienes se bloquearon ----------
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

-- ---------- un bloqueado no puede entrar a los desafíos de quien lo bloqueó ----------
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

revoke all on function public.is_blocked_between(uuid, uuid) from public, anon, authenticated;
revoke all on function public.block_user(uuid) from public, anon;
grant execute on function public.block_user(uuid) to authenticated;
revoke all on function public.unblock_user(uuid) from public, anon;
grant execute on function public.unblock_user(uuid) to authenticated;
revoke all on function public.get_blocked_users() from public, anon;
grant execute on function public.get_blocked_users() to authenticated;
revoke all on function public.join_human_queue() from public, anon;
grant execute on function public.join_human_queue() to authenticated;
revoke all on function public.accept_friend_challenge(text) from public, anon;
grant execute on function public.accept_friend_challenge(text) to authenticated;

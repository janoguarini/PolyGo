-- Amigos: solicitud → aceptar/rechazar, lista con rango y racha, buscar por nombre o código PG-.
-- Una sola fila por par (en cualquier sentido). Nada se borra: rechazar y sacar cambian el estado
-- (como user_blocks). Bloquear termina la amistad y oculta al bloqueado de la búsqueda. La
-- visibilidad «Sólo amigos» de user_settings ya se aplica en el perfil público.

create table public.friendships (
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'removed')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
create unique index friendships_pair_idx
  on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));
create index friendships_addressee_idx on public.friendships (addressee_id)
  where status in ('pending', 'accepted');
alter table public.friendships enable row level security;
revoke all on public.friendships from anon, authenticated;

/** Límite de amigos aceptados por jugador. */
create or replace function public.friend_limit()
returns integer
language sql
immutable
set search_path = ''
as $$ select 200 $$;

create or replace function public.are_friends(p_a uuid, p_b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.friendships
                 where status = 'accepted'
                   and ((requester_id = p_a and addressee_id = p_b)
                     or (requester_id = p_b and addressee_id = p_a)));
$$;

/** Vista desde p_me: 'friends', 'outgoing' (le mandé), 'incoming' (me mandó) o 'none'. */
create or replace function public.friendship_state(p_me uuid, p_other uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select case
      when f.status = 'accepted' then 'friends'
      when f.status = 'pending' and f.requester_id = p_me then 'outgoing'
      when f.status = 'pending' then 'incoming'
    end
    from public.friendships f
    where (f.requester_id = p_me and f.addressee_id = p_other)
       or (f.requester_id = p_other and f.addressee_id = p_me)
  ), 'none');
$$;

/**
 * Racha actual sin saber la zona horaria del jugador: la mejor de las que terminan mañana, hoy o
 * ayer (UTC). Si estudió ayer y todavía no hoy, la racha sigue viva.
 */
create or replace function public.current_streak(p_user uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select greatest(public.streak_ending(p_user, current_date + 1),
                  public.streak_ending(p_user, current_date),
                  public.streak_ending(p_user, current_date - 1));
$$;

/** Cantidad de amigos aceptados. */
create or replace function public.friend_count(p_user uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.friendships
  where status = 'accepted' and (requester_id = p_user or addressee_id = p_user);
$$;

/**
 * Manda una solicitud. Si el otro ya me había mandado una, la acepta. Devuelve el estado nuevo.
 * Un bloqueo (en cualquier sentido) responde como si el jugador no existiera.
 */
create or replace function public.send_friend_request(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  f public.friendships;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_user_id = uid then
    raise exception 'cannot_friend_self' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = uid and username is not null) then
    raise exception 'onboarding_required' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = p_user_id and username is not null)
     or public.is_blocked_between(uid, p_user_id) then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;

  select * into f from public.friendships
  where (requester_id = uid and addressee_id = p_user_id)
     or (requester_id = p_user_id and addressee_id = uid)
  for update;

  if f.status = 'accepted' then
    return 'friends';
  end if;
  if f.status = 'pending' and f.requester_id = uid then
    return 'outgoing';
  end if;
  if f.status = 'pending' then
    -- Me la había mandado: aceptar.
    if public.friend_count(uid) >= public.friend_limit()
       or public.friend_count(p_user_id) >= public.friend_limit() then
      raise exception 'friend_limit' using errcode = '22023';
    end if;
    update public.friendships set status = 'accepted', responded_at = now(), updated_at = now()
    where requester_id = f.requester_id and addressee_id = f.addressee_id;
    return 'friends';
  end if;
  -- Me rechazó hace poco: no se reenvía (y no se le dice que la rechazó).
  if f.status = 'declined' and f.requester_id = uid and f.responded_at > now() - interval '7 days' then
    return 'outgoing';
  end if;

  if public.friend_count(uid) >= public.friend_limit() then
    raise exception 'friend_limit' using errcode = '22023';
  end if;
  if (select count(*) from public.friendships
      where requester_id = uid and created_at > now() - interval '1 day') >= 50 then
    raise exception 'friend_request_rate_limited' using errcode = '22023';
  end if;

  if f.requester_id is null then
    insert into public.friendships (requester_id, addressee_id) values (uid, p_user_id);
  else
    -- Reusa la fila del par (rechazada o sacada), ahora en mi sentido.
    update public.friendships set
      requester_id = uid, addressee_id = p_user_id, status = 'pending',
      created_at = now(), responded_at = null, updated_at = now()
    where requester_id = f.requester_id and addressee_id = f.addressee_id;
  end if;
  return 'outgoing';
end;
$$;

/** Acepta o rechaza una solicitud que me mandaron. Devuelve el estado nuevo. */
create or replace function public.respond_friend_request(p_user_id uuid, p_accept boolean)
returns text
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
  perform 1 from public.friendships
  where requester_id = p_user_id and addressee_id = uid and status = 'pending'
  for update;
  if not found then
    raise exception 'friend_request_not_found' using errcode = 'P0002';
  end if;
  if p_accept and (public.friend_count(uid) >= public.friend_limit()
                   or public.friend_count(p_user_id) >= public.friend_limit()) then
    raise exception 'friend_limit' using errcode = '22023';
  end if;
  update public.friendships set
    status = case when p_accept then 'accepted' else 'declined' end,
    responded_at = now(), updated_at = now()
  where requester_id = p_user_id and addressee_id = uid;
  return case when p_accept then 'friends' else 'none' end;
end;
$$;

/** Saca a un amigo o cancela la solicitud que le mandé. Idempotente. */
create or replace function public.remove_friend(p_user_id uuid)
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
  update public.friendships set status = 'removed', updated_at = now()
  where ((requester_id = uid and addressee_id = p_user_id)
      or (requester_id = p_user_id and addressee_id = uid))
    and (status = 'accepted' or (status = 'pending' and requester_id = uid));
end;
$$;

/** Amigos y solicitudes (recibidas y enviadas), sin bloqueados. */
create or replace function public.get_friends()
returns table (
  user_id uuid,
  username text,
  avatar_id text,
  avatar_path text,
  frame_id text,
  state text,
  rating integer,
  placed boolean,
  streak integer,
  since timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  with mine as (
    select case when f.requester_id = (select auth.uid()) then f.addressee_id else f.requester_id end as other,
      case
        when f.status = 'accepted' then 'friends'
        when f.requester_id = (select auth.uid()) then 'outgoing'
        else 'incoming'
      end as state,
      coalesce(f.responded_at, f.created_at) as since
    from public.friendships f
    where (f.requester_id = (select auth.uid()) or f.addressee_id = (select auth.uid()))
      and f.status in ('pending', 'accepted')
  )
  select p.id, p.username, p.avatar_id, p.avatar_path, p.frame_id, m.state,
    r.rating, coalesce(r.wins, 0) > 0,
    case when m.state = 'friends' then public.current_streak(p.id) else 0 end,
    m.since
  from mine m
  join public.profiles p on p.id = m.other and p.username is not null
  left join public.player_ratings r on r.user_id = p.id and r.language_code = p.target_language
  where not public.is_blocked_between((select auth.uid()), p.id)
  order by m.since desc;
$$;

/**
 * Busca jugadores por el comienzo del nombre de usuario o por código exacto (PG-XXXXXX, con o sin
 * guion). Hasta 20, sin uno mismo ni bloqueados; con el estado de amistad de cada uno.
 */
create or replace function public.search_players(p_query text)
returns table (
  user_id uuid,
  username text,
  avatar_id text,
  avatar_path text,
  frame_id text,
  rating integer,
  placed boolean,
  state text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  raw text := upper(regexp_replace(coalesce(p_query, ''), '\s', '', 'g'));
  code text;
  q text := lower(regexp_replace(coalesce(p_query, ''), '[^a-zA-Z0-9_]', '', 'g'));
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if raw ~ '^PG-?[A-Z0-9]{6}$' then
    code := 'PG-' || right(raw, 6);
  elsif length(q) < 2 then
    return;
  end if;

  return query
  select p.id, p.username, p.avatar_id, p.avatar_path, p.frame_id,
    r.rating, coalesce(r.wins, 0) > 0, public.friendship_state(uid, p.id)
  from public.profiles p
  left join public.player_ratings r on r.user_id = p.id and r.language_code = p.target_language
  where p.id <> uid
    and p.username is not null
    and p.onboarding_completed_at is not null
    and (case when code is not null then p.public_code = code
              else left(p.username, length(q)) = q end)
    and not public.is_blocked_between(uid, p.id)
  order by p.username = q desc, length(p.username), p.username
  limit 20;
end;
$$;

-- ---------- bloquear termina la amistad (y las solicitudes) ----------
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
  update public.friendships set status = 'removed', updated_at = now()
  where ((requester_id = uid and addressee_id = p_user_id)
      or (requester_id = p_user_id and addressee_id = uid))
    and status in ('pending', 'accepted');
end;
$$;

-- ---------- el perfil público aplica «Sólo amigos» y dice el estado de amistad ----------
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
    -- El país sólo se muestra si el usuario lo activó (o es su propio perfil).
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
                  'words_mastered', m -> 'words_mastered',
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

revoke all on function public.friend_limit() from public, anon, authenticated;
revoke all on function public.are_friends(uuid, uuid) from public, anon, authenticated;
revoke all on function public.friendship_state(uuid, uuid) from public, anon, authenticated;
revoke all on function public.current_streak(uuid) from public, anon, authenticated;
revoke all on function public.friend_count(uuid) from public, anon, authenticated;
revoke all on function public.send_friend_request(uuid) from public, anon;
grant execute on function public.send_friend_request(uuid) to authenticated;
revoke all on function public.respond_friend_request(uuid, boolean) from public, anon;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;
revoke all on function public.remove_friend(uuid) from public, anon;
grant execute on function public.remove_friend(uuid) to authenticated;
revoke all on function public.get_friends() from public, anon;
grant execute on function public.get_friends() to authenticated;
revoke all on function public.search_players(text) from public, anon;
grant execute on function public.search_players(text) to authenticated;
revoke all on function public.block_user(uuid) from public, anon;
grant execute on function public.block_user(uuid) to authenticated;
revoke all on function public.get_public_profile(uuid) from public, anon;
grant execute on function public.get_public_profile(uuid) to authenticated;

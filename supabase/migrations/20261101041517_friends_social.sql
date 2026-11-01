-- Amigos, segunda parte: en línea, invitar a un amigo a un amistoso, actividad reciente y retos
-- semanales. Todo se calcula con lo que la base ya guarda, salvo dos cosas nuevas:
--   * user_presence: último latido de la app (cada ~10 s mientras está abierta). "En línea" =
--     latido en los últimos online_window() minutos. user_settings.show_online lo oculta.
--   * friend_challenges.invitee_id/declined: un desafío puede ir dirigido a un amigo. Sólo él lo
--     puede aceptar, lo ve en sus invitaciones mientras quien desafía sigue esperando, y si lo
--     rechaza quien desafía se entera (friend_challenge_status → 'declined').
-- Privacidad: de un amigo con perfil privado sólo se muestran subidas de rango (el rango es
-- público) y la amistad; ni partidas, ni repasos, ni logros.

create table public.user_presence (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  last_seen_at timestamptz not null default now()
);
alter table public.user_presence enable row level security;
revoke all on public.user_presence from anon, authenticated;

alter table public.user_settings add column show_online boolean not null default true;
grant update (show_online) on public.user_settings to authenticated;

alter table public.friend_challenges
  add column invitee_id uuid references public.profiles (id) on delete cascade,
  add column declined boolean not null default false;
create index friend_challenges_invitee_idx on public.friend_challenges (invitee_id, created_at)
  where invitee_id is not null;

/** Minutos sin latido para dejar de estar en línea (= ONLINE_WINDOW_MINUTES). */
create or replace function public.online_window()
returns interval
language sql
immutable
set search_path = ''
as $$ select interval '2 minutes' $$;

/** Retos semanales (= FRIEND_WEEKLY_CHALLENGES de shared/friendChallenges.ts). */
create or replace function public.friend_weekly_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_array(
    jsonb_build_object('id', 'play_3', 'target', 3, 'reward', 20),
    jsonb_build_object('id', 'review_20', 'target', 20, 'reward', 20),
    jsonb_build_object('id', 'friendly_1', 'target', 1, 'reward', 30));
$$;

/** Está en línea para los demás (latido reciente y no lo ocultó). */
create or replace function public.is_online(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.user_presence pr
                 where pr.user_id = p_user and pr.last_seen_at > now() - public.online_window())
     and coalesce((select s.show_online from public.user_settings s where s.user_id = p_user), true);
$$;

/** Desafío dirigido que sigue en pie: nadie entró, no venció y quien desafía sigue esperando. */
create or replace function public.invite_is_live(c public.friend_challenges)
returns boolean
language sql
stable
set search_path = ''
as $$
  select c.invitee_id is not null and c.battle_id is null and not c.cancelled
     and c.expires_at > now() and c.seen_at > now() - interval '10 seconds';
$$;

/** Invitaciones a partidas que me mandaron y siguen en pie (sin bloqueados). */
create or replace function public.live_battle_invites(p_user uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'code', c.code, 'host_id', c.host_id, 'username', p.username, 'avatar_id', p.avatar_id,
      'avatar_path', p.avatar_path, 'frame_id', p.frame_id,
      'created_at', floor(extract(epoch from c.created_at) * 1000)::bigint)
    order by c.created_at desc), '[]'::jsonb)
  from public.friend_challenges c
  join public.profiles p on p.id = c.host_id
  where c.invitee_id = p_user and public.invite_is_live(c)
    and not public.is_blocked_between(p_user, c.host_id);
$$;

/** Latido de la app: me marca en línea y devuelve {invites: [...]}. */
create or replace function public.ping_presence()
returns jsonb
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
  insert into public.user_presence as pr (user_id, last_seen_at) values (uid, now())
  on conflict (user_id) do update set last_seen_at = now();
  return jsonb_build_object('invites', public.live_battle_invites(uid));
end;
$$;

-- ---------- invitar a un amigo ----------
/** Igual que create_friend_challenge, pero dirigido a un amigo. Devuelve {code, expires_at}. */
create or replace function public.invite_friend_to_battle(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  friend public.profiles;
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
  if not public.are_friends(uid, p_user_id) or public.is_blocked_between(uid, p_user_id) then
    raise exception 'not_friends' using errcode = '22023';
  end if;
  select * into friend from public.profiles where id = p_user_id;
  if friend.target_language is distinct from prof.target_language then
    raise exception 'language_mismatch' using errcode = '22023';
  end if;
  if (select count(*) from public.friend_challenges
      where host_id = uid and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'match_rate_limited' using errcode = '22023';
  end if;

  -- Un desafío abierto por vez: el anterior (con código o dirigido) se anula.
  update public.friend_challenges set cancelled = true
  where host_id = uid and battle_id is null and not cancelled;

  insert into public.friend_challenges (code, host_id, language_code, invitee_id)
  values (public.new_challenge_code(), uid, prof.target_language, p_user_id)
  returning * into c;
  return jsonb_build_object('code', c.code,
    'expires_at', floor(extract(epoch from c.expires_at) * 1000)::bigint);
end;
$$;

/** Rechazar una invitación: quien desafía lo ve en su próxima consulta. Idempotente. */
create or replace function public.decline_battle_invite(p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  update public.friend_challenges set declined = true, cancelled = true
  where code = upper(trim(p_code)) and invitee_id = auth.uid() and battle_id is null;
end;
$$;

/** Como antes, con 'declined' si el amigo invitado rechazó. */
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
                   when c.declined then 'declined'
                   when c.cancelled or c.expires_at < now() then 'expired'
                   else 'waiting' end,
    'battle_id', c.battle_id);
end;
$$;

/** Como antes (con bloqueos), y un desafío dirigido sólo lo acepta el amigo invitado. */
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
$$;

-- ---------- lista de amigos: en línea y desafíos en curso ----------
-- Cambia el tipo de retorno: se crea con otro nombre para no tener que borrar get_friends.
create or replace function public.get_friends_v2()
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
  since timestamptz,
  online boolean,
  last_seen_at timestamptz,
  invited_by_me boolean,
  invite_code text
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
    m.since,
    m.state = 'friends' and public.is_online(p.id),
    -- La última vez sólo si la muestra (y es amigo).
    case when m.state = 'friends' and coalesce(s.show_online, true) then pr.last_seen_at end,
    m.state = 'friends' and exists (
      select 1 from public.friend_challenges c
      where c.host_id = (select auth.uid()) and c.invitee_id = p.id and public.invite_is_live(c)),
    case when m.state = 'friends' then (
      select c.code from public.friend_challenges c
      where c.host_id = p.id and c.invitee_id = (select auth.uid()) and public.invite_is_live(c)
      order by c.created_at desc limit 1) end
  from mine m
  join public.profiles p on p.id = m.other and p.username is not null
  left join public.player_ratings r on r.user_id = p.id and r.language_code = p.target_language
  left join public.user_settings s on s.user_id = p.id
  left join public.user_presence pr on pr.user_id = p.id
  where not public.is_blocked_between((select auth.uid()), p.id)
  order by m.since desc;
$$;

-- ---------- actividad reciente de los amigos (últimos 7 días) ----------
/** Amigos aceptados, sin bloqueados, y si su perfil deja ver estadísticas. */
create or replace function public.friend_ids(p_user uuid)
returns table (friend_id uuid, open_stats boolean, friends_since timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select o.id, coalesce(s.profile_visibility, 'private') in ('public', 'friends'),
    coalesce(f.responded_at, f.created_at)
  from public.friendships f
  cross join lateral (select case when f.requester_id = p_user then f.addressee_id else f.requester_id end as id) o
  left join public.user_settings s on s.user_id = o.id
  where (f.requester_id = p_user or f.addressee_id = p_user)
    and f.status = 'accepted'
    and not public.is_blocked_between(p_user, o.id);
$$;

/**
 * Eventos: rank_up (value = rating antes, value2 = después; la app decide si cambió el rango),
 * wins_week, reviews_week, lessons_week, achievement (label = título), streak (hito) y
 * new_friend. Los más nuevos primero, hasta 30.
 */
create or replace function public.get_friend_activity()
returns table (
  user_id uuid,
  username text,
  avatar_id text,
  avatar_path text,
  frame_id text,
  kind text,
  value integer,
  value2 integer,
  label text,
  happened_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  with fr as (select * from public.friend_ids((select auth.uid()))),
  week as (select date_trunc('week', now()) as start),
  events as (
    -- Subidas: cruzó un múltiplo de 100 (las divisiones y rangos están en esos escalones).
    select h.user_id, 'rank_up' as kind, h.rating_before as value, h.rating_after as value2,
      null::text as label, h.created_at as happened_at
    from public.rating_history h join fr on fr.friend_id = h.user_id
    where h.created_at > now() - interval '7 days' and h.reason = 'battle'
      and h.rating_after / 100 > h.rating_before / 100
    union all
    select bp.user_id, 'wins_week', count(*)::int, null, null, max(b.ended_at)
    from public.battle_players bp
    join public.battles b on b.id = bp.battle_id
    join fr on fr.friend_id = bp.user_id and fr.open_stats
    where bp.result = 'win' and b.ended_at >= (select start from week)
    group by bp.user_id having count(*) >= 3
    union all
    select ls.user_id, 'reviews_week', sum(ls.total_answers)::int, null, null, max(ls.completed_at)
    from public.learning_sessions ls join fr on fr.friend_id = ls.user_id and fr.open_stats
    where ls.kind = 'review' and ls.completed_at >= (select start from week)
    group by ls.user_id having sum(ls.total_answers) >= 20
    union all
    select ls.user_id, 'lessons_week', count(*)::int, null, null, max(ls.completed_at)
    from public.learning_sessions ls join fr on fr.friend_id = ls.user_id and fr.open_stats
    where ls.kind = 'lesson' and ls.completed_at >= (select start from week)
    group by ls.user_id having count(*) >= 3
    union all
    select ua.user_id, 'achievement', null, null, a.title_es, ua.unlocked_at
    from public.user_achievements ua
    join public.achievements a on a.id = ua.achievement_id and a.is_active
    join fr on fr.friend_id = ua.user_id and fr.open_stats
    where ua.unlocked_at > now() - interval '7 days'
    union all
    select x.friend_id, 'streak', x.streak, null, null, x.last_day::timestamptz
    from (
      select fr.friend_id, public.current_streak(fr.friend_id) as streak,
        (select max(d.activity_date) from public.user_daily_activity d where d.user_id = fr.friend_id) as last_day
      from fr where fr.open_stats
    ) x
    where x.streak in (7, 14, 30, 50, 100, 365)
    union all
    select fr.friend_id, 'new_friend', null, null, null, fr.friends_since
    from fr where fr.friends_since > now() - interval '7 days'
  )
  select e.user_id, p.username, p.avatar_id, p.avatar_path, p.frame_id,
    e.kind, e.value, e.value2, e.label, e.happened_at
  from events e join public.profiles p on p.id = e.user_id and p.username is not null
  where (select auth.uid()) is not null
  order by e.happened_at desc
  limit 30;
$$;

-- ---------- retos semanales entre amigos ----------
/** Progreso de un jugador en un reto en la semana que empieza en p_week (UTC). */
create or replace function public.friend_challenge_progress(p_user uuid, p_id text, p_week timestamptz)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select case p_id
    when 'play_3' then (
      select count(*)::int from public.battle_players bp join public.battles b on b.id = bp.battle_id
      where bp.user_id = p_user and bp.result is not null and b.ended_at >= p_week)
    when 'review_20' then (
      select coalesce(sum(ls.total_answers), 0)::int from public.learning_sessions ls
      where ls.user_id = p_user and ls.kind = 'review' and ls.completed_at >= p_week)
    when 'friendly_1' then (
      select count(*)::int from public.battle_players me
      join public.battles b on b.id = me.battle_id
      join public.battle_players opp on opp.battle_id = me.battle_id and opp.slot <> me.slot
      where me.user_id = p_user and not b.is_ranked and not b.has_bot
        and me.result is not null and b.ended_at >= p_week
        and public.are_friends(p_user, opp.user_id))
    else 0 end;
$$;

/**
 * {week, ends_at, challenges: [{id, target, reward, progress, claimed, friends_done, friends}]}.
 * friends = hasta 5 amigos (con estadísticas visibles) que ya lo completaron.
 */
create or replace function public.get_friend_weekly_challenges()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  wk timestamptz := date_trunc('week', now());
  week_ref text := to_char(now(), 'IYYY-IW');
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return jsonb_build_object(
    'week', week_ref,
    'ends_at', floor(extract(epoch from wk + interval '7 days') * 1000)::bigint,
    'challenges', (
      select jsonb_agg(jsonb_build_object(
          'id', cfg ->> 'id',
          'target', (cfg ->> 'target')::int,
          'reward', (cfg ->> 'reward')::int,
          'progress', least(public.friend_challenge_progress(uid, cfg ->> 'id', wk), (cfg ->> 'target')::int),
          'claimed', exists (select 1 from public.poly_transactions t
                             where t.user_id = uid and t.reason = 'friend_challenge'
                               and t.ref = (cfg ->> 'id') || ':' || week_ref),
          'friends_done', done.total,
          'friends', done.sample) order by ord)
      from jsonb_array_elements(public.friend_weekly_config()) with ordinality as x (cfg, ord)
      cross join lateral (
        select count(*)::int as total,
          coalesce(jsonb_path_query_array(
            jsonb_agg(jsonb_build_object('user_id', p.id, 'username', p.username,
              'avatar_id', p.avatar_id, 'avatar_path', p.avatar_path) order by p.username),
            '$[0 to 4]'), '[]'::jsonb) as sample
        from public.friend_ids(uid) fr
        join public.profiles p on p.id = fr.friend_id
        where fr.open_stats
          and public.friend_challenge_progress(fr.friend_id, cfg ->> 'id', wk) >= (cfg ->> 'target')::int
      ) done));
end;
$$;

/** Cobra un reto completado de esta semana. Devuelve {polys, balance}. */
create or replace function public.claim_friend_challenge(p_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  cfg jsonb;
  credited integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select c into cfg from jsonb_array_elements(public.friend_weekly_config()) c where c ->> 'id' = p_id;
  if cfg is null then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  if public.friend_challenge_progress(uid, p_id, date_trunc('week', now())) < (cfg ->> 'target')::int then
    raise exception 'challenge_incomplete' using errcode = '22023';
  end if;
  credited := public.poly_credit(uid, (cfg ->> 'reward')::int, 'friend_challenge',
    p_id || ':' || to_char(now(), 'IYYY-IW'));
  if credited = 0 then
    raise exception 'already_claimed' using errcode = '22023';
  end if;
  return jsonb_build_object('polys', credited,
    'balance', (select balance from public.poly_wallets where user_id = uid));
end;
$$;

revoke all on function public.online_window() from public, anon, authenticated;
revoke all on function public.friend_weekly_config() from public, anon;
grant execute on function public.friend_weekly_config() to authenticated;
revoke all on function public.is_online(uuid) from public, anon, authenticated;
revoke all on function public.invite_is_live(public.friend_challenges) from public, anon, authenticated;
revoke all on function public.live_battle_invites(uuid) from public, anon, authenticated;
revoke all on function public.friend_ids(uuid) from public, anon, authenticated;
revoke all on function public.friend_challenge_progress(uuid, text, timestamptz) from public, anon, authenticated;
revoke all on function public.ping_presence() from public, anon;
grant execute on function public.ping_presence() to authenticated;
revoke all on function public.invite_friend_to_battle(uuid) from public, anon;
grant execute on function public.invite_friend_to_battle(uuid) to authenticated;
revoke all on function public.decline_battle_invite(text) from public, anon;
grant execute on function public.decline_battle_invite(text) to authenticated;
revoke all on function public.friend_challenge_status(text) from public, anon;
grant execute on function public.friend_challenge_status(text) to authenticated;
revoke all on function public.accept_friend_challenge(text) from public, anon;
grant execute on function public.accept_friend_challenge(text) to authenticated;
revoke all on function public.get_friends_v2() from public, anon;
grant execute on function public.get_friends_v2() to authenticated;
revoke all on function public.get_friend_activity() from public, anon;
grant execute on function public.get_friend_activity() to authenticated;
revoke all on function public.get_friend_weekly_challenges() from public, anon;
grant execute on function public.get_friend_weekly_challenges() to authenticated;
revoke all on function public.claim_friend_challenge(text) from public, anon;
grant execute on function public.claim_friend_challenge(text) to authenticated;

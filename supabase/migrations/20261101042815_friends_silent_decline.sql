-- Rechazo silencioso: quien mandó una solicitud rechazada la sigue viendo «pendiente» durante
-- silent_decline_window() (lo mismo que tarda en poder reenviarla) y la puede cancelar. Antes
-- desaparecía de su lista y la búsqueda le ofrecía «Agregar» otra vez sin que pasara nada.

/** Cuánto se ve pendiente una solicitud rechazada (= el bloqueo de reenvío). */
create or replace function public.silent_decline_window()
returns interval
language sql
immutable
set search_path = ''
as $$ select interval '7 days' $$;

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
      when f.status = 'declined' and f.requester_id = p_me
           and f.responded_at > now() - public.silent_decline_window() then 'outgoing'
    end
    from public.friendships f
    where (f.requester_id = p_me and f.addressee_id = p_other)
       or (f.requester_id = p_other and f.addressee_id = p_me)
  ), 'none');
$$;

/** Saca a un amigo o cancela la solicitud que le mandé (también si me la rechazaron). */
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
    and (status = 'accepted' or (status in ('pending', 'declined') and requester_id = uid));
end;
$$;

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
      case when f.status = 'accepted' then coalesce(f.responded_at, f.created_at) else f.created_at end as since
    from public.friendships f
    where (f.requester_id = (select auth.uid()) or f.addressee_id = (select auth.uid()))
      and (f.status in ('pending', 'accepted')
        or (f.status = 'declined' and f.requester_id = (select auth.uid())
            and f.responded_at > now() - public.silent_decline_window()))
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

revoke all on function public.silent_decline_window() from public, anon, authenticated;
revoke all on function public.friendship_state(uuid, uuid) from public, anon, authenticated;
revoke all on function public.remove_friend(uuid) from public, anon;
grant execute on function public.remove_friend(uuid) to authenticated;
revoke all on function public.get_friends_v2() from public, anon;
grant execute on function public.get_friends_v2() to authenticated;

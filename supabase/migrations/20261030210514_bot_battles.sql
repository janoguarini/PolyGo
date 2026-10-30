-- Partidas ranked contra bots (shared/bots.ts): el bot no tiene cuenta ni rating guardado; ocupa
-- el slot 2 sin user_id, con su nombre y avatar. El ELO del jugador se calcula en el servidor
-- contra el rating del bot. Siempre se muestran como BOT (docs/BATTLE_PROTOCOL.md).

alter table public.battle_players add column bot_name text;
alter table public.battle_players add column bot_avatar_id text;
alter table public.battle_players add constraint battle_players_bot_check
  check (bot_name is null or (user_id is null and char_length(bot_name) between 1 and 20));

alter table public.battles add column has_bot boolean not null default false;

/** Crea una partida ranked contra un bot al empezar (idempotente, como start_battle). */
create or replace function public.start_bot_battle(
  p_battle_id uuid,
  p_language_code text,
  p_player uuid,
  p_bot_name text,
  p_bot_avatar_id text,
  p_bot_rating integer,
  p_protocol_version smallint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_player is null or p_bot_name is null or char_length(p_bot_name) not between 1 and 20
     or p_bot_avatar_id not in ('bolt', 'crown', 'flame')
     or p_bot_rating is null or p_bot_rating not between 100 and 3000 then
    raise exception 'invalid_players' using errcode = '22023';
  end if;

  insert into public.battles (id, language_code, season_id, mode, is_ranked, status, protocol_version, started_at, has_bot)
  select p_battle_id, p_language_code, s.id, 'word_rush', true, 'in_progress', p_protocol_version, now(), true
  from (select 1) as one
  left join public.seasons s on s.status = 'active'
  on conflict (id) do nothing;

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  select p_battle_id, 1, p_player, r.rating
  from (select 1) as one
  left join public.player_ratings r on r.user_id = p_player and r.language_code = p_language_code
  on conflict do nothing;

  insert into public.battle_players (battle_id, slot, user_id, rating_before, bot_name, bot_avatar_id)
  values (p_battle_id, 2, null, p_bot_rating, p_bot_name, p_bot_avatar_id)
  on conflict do nothing;
end;
$$;

-- Historial: el rival bot aparece con su nombre y avatar (opponent_id null). Una cuenta borrada
-- sigue sin nombre, así la app distingue "bot" de "jugador eliminado".
create or replace function public.get_match_history(p_limit integer, p_before timestamptz)
returns table (
  battle_id uuid, mode text, is_ranked boolean, status text, ended_at timestamptz,
  result text, forfeited boolean, score integer, correct_answers integer, total_answers integer,
  rating_before integer, rating_after integer,
  opponent_id uuid, opponent_username text, opponent_avatar_id text, opponent_score integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id, b.mode, b.is_ranked, b.status, coalesce(b.ended_at, b.created_at),
         me.result, me.forfeited, me.score, me.correct_answers, me.total_answers,
         me.rating_before, me.rating_after,
         opp.user_id, coalesce(p.username, opp.bot_name), coalesce(p.avatar_id, opp.bot_avatar_id),
         opp.score
  from public.battle_players me
  join public.battles b on b.id = me.battle_id
  left join public.battle_players opp on opp.battle_id = me.battle_id and opp.slot <> me.slot
  left join public.profiles p on p.id = opp.user_id
  where me.user_id = (select auth.uid())
    and b.status in ('completed','forfeited')
    and (p_before is null or coalesce(b.ended_at, b.created_at) < p_before)
  order by coalesce(b.ended_at, b.created_at) desc, b.id
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

revoke all on function public.start_bot_battle(uuid, text, uuid, text, text, integer, smallint)
  from public, anon, authenticated;
revoke all on function public.get_match_history(integer, timestamptz) from public, anon;
grant execute on function public.get_match_history(integer, timestamptz) to authenticated;

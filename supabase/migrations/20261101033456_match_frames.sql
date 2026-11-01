-- Los marcos se ven en las partidas: get_human_match devuelve el marco puesto de cada jugador.

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
                  'avatar_path', p.avatar_path, 'frame_id', p.frame_id, 'rating', pr.rating,
                  'games_played', pr.games_played)
                  order by bp.slot)
                from public.battle_players bp
                join public.profiles p on p.id = bp.user_id
                left join public.player_ratings pr on pr.user_id = bp.user_id and pr.language_code = b.language_code
                where bp.battle_id = b.id));
end;
$$;

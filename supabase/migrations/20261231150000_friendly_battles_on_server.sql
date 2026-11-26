-- Amistosos en el servidor de partidas: la MISMA partida que Ranked (Arcade, 60 s, los mismos
-- microjuegos), sin ELO. El desafío se sigue creando, invitando y avisando como siempre
-- (create_friend_challenge / invite_friend_to_battle / notify-battle-invite); lo que cambia es dónde
-- se juega:
--   · battle_server_challenge_host: el servidor confirma que el código es del anfitrión y sigue vivo
--     (y renueva seen_at mientras espera).
--   · battle_server_challenge_join: el servidor valida al amigo que entra con el código, con las mismas
--     reglas que accept_friend_challenge (bloqueos, desafío dirigido a otro, vencido, idioma), sin
--     crear la partida.
--   · start_friendly_battle: el servidor guarda el amistoso como cualquier partida (battles sin ELO:
--     is_ranked = false) y lo ata al desafío. settle_battle ya liquida las no ranked (sólo el
--     resultado), así que cuenta para el historial, «Jugá un amistoso» y el aviso con el historial.
--
-- Sólo las llama el servidor (service_role). Nada se borra: las apps anteriores siguen jugando sus
-- amistosos por la ruta vieja (accept_friend_challenge / finish_human_match), que queda intacta.
--
-- Rollback: drop de las tres funciones (ningún dato depende de ellas).

create or replace function public.battle_server_challenge_host(p_code text, p_host uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c public.friend_challenges;
begin
  update public.friend_challenges set seen_at = now()
  where code = upper(trim(p_code)) and host_id = p_host
  returning * into c;
  if c.code is null then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  if c.battle_id is not null then
    raise exception 'challenge_taken' using errcode = '22023';
  end if;
  if c.declined then
    raise exception 'challenge_declined' using errcode = '22023';
  end if;
  if c.cancelled or c.expires_at < now() then
    raise exception 'challenge_expired' using errcode = '22023';
  end if;
  return jsonb_build_object(
    'language_code', c.language_code,
    'invitee_id', c.invitee_id,
    'expires_at', floor(extract(epoch from c.expires_at) * 1000)::bigint);
end;
$$;

create or replace function public.battle_server_challenge_join(p_code text, p_guest uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  prof public.profiles;
  c public.friend_challenges;
begin
  select * into prof from public.profiles where id = p_guest;
  if prof.username is null or prof.onboarding_completed_at is null then
    raise exception 'onboarding_required' using errcode = '22023';
  end if;
  select * into c from public.friend_challenges where code = upper(trim(p_code));
  if c.code is null then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  if c.battle_id is not null then
    raise exception 'challenge_taken' using errcode = '22023';
  end if;
  if c.host_id = p_guest then
    raise exception 'own_challenge' using errcode = '22023';
  end if;
  -- Bloqueo en cualquier sentido o desafío para otro: como si el código no existiera.
  if public.is_blocked_between(p_guest, c.host_id) or (c.invitee_id is not null and c.invitee_id <> p_guest) then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  if c.cancelled or c.declined or c.expires_at < now() then
    raise exception 'challenge_expired' using errcode = '22023';
  end if;
  if prof.target_language <> c.language_code
     or not exists (select 1 from public.player_ratings
                    where user_id = p_guest and language_code = c.language_code) then
    raise exception 'language_mismatch' using errcode = '22023';
  end if;
  return jsonb_build_object('host_id', c.host_id, 'language_code', c.language_code);
end;
$$;

create or replace function public.start_friendly_battle(
  p_battle_id uuid,
  p_code text,
  p_host uuid,
  p_guest uuid,
  p_protocol_version smallint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  c public.friend_challenges;
begin
  if p_host is null or p_guest is null or p_host = p_guest then
    raise exception 'invalid_players' using errcode = '22023';
  end if;
  select * into c from public.friend_challenges where code = upper(trim(p_code)) for update;
  if c.code is null or c.host_id <> p_host
     or (c.invitee_id is not null and c.invitee_id <> p_guest) then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  -- Reintento del mismo guardado: nada que hacer.
  if c.battle_id = p_battle_id then
    return;
  end if;
  if c.battle_id is not null then
    raise exception 'challenge_taken' using errcode = '22023';
  end if;

  insert into public.battles (id, language_code, season_id, mode, is_ranked, status, protocol_version, started_at)
  select p_battle_id, c.language_code, s.id, 'word_rush', false, 'in_progress', p_protocol_version, now()
  from (select 1) as one
  left join public.seasons s on s.status = 'active'
  on conflict (id) do nothing;

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  select p_battle_id, v.slot, v.user_id, r.rating
  from (values (1::smallint, p_host), (2::smallint, p_guest)) as v (slot, user_id)
  left join public.player_ratings r on r.user_id = v.user_id and r.language_code = c.language_code
  on conflict do nothing;

  update public.friend_challenges set battle_id = p_battle_id, guest_id = p_guest where code = c.code;
end;
$$;

revoke all on function public.battle_server_challenge_host(text, uuid) from public, anon, authenticated;
revoke all on function public.battle_server_challenge_join(text, uuid) from public, anon, authenticated;
revoke all on function public.start_friendly_battle(uuid, text, uuid, uuid, smallint) from public, anon, authenticated;
grant execute on function public.battle_server_challenge_host(text, uuid) to service_role;
grant execute on function public.battle_server_challenge_join(text, uuid) to service_role;
grant execute on function public.start_friendly_battle(uuid, text, uuid, uuid, smallint) to service_role;

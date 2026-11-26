-- Aviso de desafío más llamativo: claim_battle_invite_push devuelve además el idioma del duelo y el
-- historial entre los dos amigos (victorias de cada uno en partidas terminadas), para que
-- notify-battle-invite arme textos como «@juan quiere la revancha: te gana 3–1».
--
-- Misma firma y mismas reglas que 20261101151020_push_battle_invites (una sola vez, invitación viva
-- de quien llama, sin bloqueos, respetando notify_challenges). Sólo se agregan campos a la respuesta:
-- la Edge Function anterior los ignora.
--
-- Rollback: volver a crear la función con el cuerpo de producción previo (sin language_code ni h2h).

create or replace function public.claim_battle_invite_push(p_host uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c public.friend_challenges;
begin
  update public.friend_challenges set notified_at = now()
  where code = upper(trim(p_code)) and host_id = p_host and notified_at is null
    and invitee_id is not null and battle_id is null and not cancelled and expires_at > now()
  returning * into c;
  if c.code is null or public.is_blocked_between(c.host_id, c.invitee_id)
     or not coalesce((select s.notify_challenges from public.user_settings s
                      where s.user_id = c.invitee_id), true) then
    return jsonb_build_object('tokens', '[]'::jsonb);
  end if;
  return jsonb_build_object(
    'host_username', (select username from public.profiles where id = c.host_id),
    'code', c.code,
    'expires_at', floor(extract(epoch from c.expires_at) * 1000)::bigint,
    'language_code', c.language_code,
    -- Partidas terminadas entre los dos: cuántas ganó cada uno (los empates no cuentan).
    'h2h', (
      select jsonb_build_object(
        'host_wins', count(*) filter (where h.result = 'win'),
        'invitee_wins', count(*) filter (where i.result = 'win'))
      from public.battle_players h
      join public.battle_players i on i.battle_id = h.battle_id and i.user_id = c.invitee_id
      join public.battles b on b.id = h.battle_id and b.status = 'completed'
      where h.user_id = c.host_id),
    'tokens', coalesce((select jsonb_agg(t.token order by t.updated_at desc)
                        from public.push_tokens t where t.user_id = c.invitee_id and t.active),
                       '[]'::jsonb));
end;
$$;

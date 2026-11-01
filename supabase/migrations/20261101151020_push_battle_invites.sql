-- Notificaciones push cuando un amigo te desafía.
--   * push_tokens: tokens de Expo de cada teléfono (uno por dispositivo; si en el teléfono entra
--     otra cuenta, el token pasa a esa cuenta). Desactivar no borra la fila.
--   * user_settings.notify_challenges: Ajustes → «Avisarme cuando me desafían».
--   * friend_challenges.notified_at: la Edge Function notify-battle-invite marca la invitación al
--     pedir los destinatarios, así que cada invitación se notifica una sola vez.
-- La app nunca lee tokens ajenos: sólo la Edge Function (service_role) los pide, y sólo para una
-- invitación viva que creó quien llama.

create table public.push_tokens (
  token text primary key check (token ~ '^Expo(nent)?PushToken\[[A-Za-z0-9_\-]+\]$'),
  user_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null check (platform in ('ios', 'android')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index push_tokens_user_idx on public.push_tokens (user_id) where active;
alter table public.push_tokens enable row level security;
revoke all on public.push_tokens from anon, authenticated;

alter table public.user_settings add column notify_challenges boolean not null default true;
grant update (notify_challenges) on public.user_settings to authenticated;

alter table public.friend_challenges add column notified_at timestamptz;

/** Máximo de teléfonos con push por cuenta: al pasarse, se desactivan los más viejos. */
create or replace function public.push_tokens_per_user()
returns integer
language sql
immutable
set search_path = ''
as $$ select 5 $$;

/** Guarda el token de este teléfono para la cuenta que llama. Idempotente. */
create or replace function public.register_push_token(p_token text, p_platform text)
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
  if p_token !~ '^Expo(nent)?PushToken\[[A-Za-z0-9_\-]+\]$' or p_platform not in ('ios', 'android') then
    raise exception 'invalid_push_token' using errcode = '22023';
  end if;
  insert into public.push_tokens as t (token, user_id, platform) values (p_token, uid, p_platform)
  on conflict (token) do update set
    user_id = uid, platform = excluded.platform, active = true, updated_at = now();
  update public.push_tokens set active = false, updated_at = now()
  where user_id = uid and active and token in (
    select token from public.push_tokens where user_id = uid and active
    order by updated_at desc offset public.push_tokens_per_user());
end;
$$;

/** Al cerrar sesión: este teléfono deja de recibir avisos de esta cuenta. */
create or replace function public.unregister_push_token(p_token text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  update public.push_tokens set active = false, updated_at = now()
  where token = p_token and user_id = auth.uid() and active;
end;
$$;

/**
 * Sólo para la Edge Function: destinatarios de la invitación p_code que creó p_host. Vacío si no
 * es suya, no está viva, ya se notificó, o el invitado apagó los avisos o bloqueó. La marca como
 * notificada. Devuelve {host_username, expires_at, tokens: [...]}.
 */
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
    'tokens', coalesce((select jsonb_agg(t.token order by t.updated_at desc)
                        from public.push_tokens t where t.user_id = c.invitee_id and t.active),
                       '[]'::jsonb));
end;
$$;

/** Sólo para la Edge Function: tokens que Expo dio por no registrados (DeviceNotRegistered). */
create or replace function public.deactivate_push_tokens(p_tokens text[])
returns void
language sql
security definer
set search_path = ''
as $$
  update public.push_tokens set active = false, updated_at = now()
  where token = any(p_tokens) and active;
$$;

revoke all on function public.push_tokens_per_user() from public, anon, authenticated;
revoke all on function public.register_push_token(text, text) from public, anon;
grant execute on function public.register_push_token(text, text) to authenticated;
revoke all on function public.unregister_push_token(text) from public, anon;
grant execute on function public.unregister_push_token(text) to authenticated;
revoke all on function public.claim_battle_invite_push(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_battle_invite_push(uuid, text) to service_role;
revoke all on function public.deactivate_push_tokens(text[]) from public, anon, authenticated;
grant execute on function public.deactivate_push_tokens(text[]) to service_role;

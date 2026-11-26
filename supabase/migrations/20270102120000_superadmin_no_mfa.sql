-- Panel Superadmin: sin MFA (decisión del dueño, 2026-11-26).
--
-- Antes (20270101120000_superadmin_panel): además de ser janitogap, el JWT debía tener aal = 'aal2'.
-- Ahora alcanza con la sesión de la cuenta de janitogap. Sigue igual todo lo demás: UID fijo
-- (admin.superadmin_uid) + fila en admin.superadmins, schema admin cerrado, RPC SECURITY DEFINER
-- sólo para authenticated, auditoría y eventos de seguridad.
--
-- `create or replace` conserva dueño y permisos (EXECUTE sigue revocado a public/anon/authenticated
-- en admin.*; las public.admin_* siguen sólo para authenticated).
--
-- Rollback: volver a crear las dos funciones como estaban en 20270101120000_superadmin_panel.sql
-- (assert_superadmin con el chequeo `admin.request_aal() <> 'aal2'` y admin_session_check con la rama
-- 'mfa_required').

create or replace function admin.assert_superadmin(p_action text, p_params jsonb default null)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if not admin.caller_is_superadmin() then
    raise exception 'admin_forbidden' using errcode = '42501';
  end if;
  if not exists (
    select 1 from admin.audit_log a
    where a.user_id = v_uid and a.action = p_action and a.params is not distinct from p_params
      and a.created_at > now() - interval '60 seconds'
  ) then
    insert into admin.audit_log (user_id, action, params) values (v_uid, p_action, p_params);
  end if;
  return v_uid;
end;
$$;

create or replace function public.admin_session_check()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return jsonb_build_object('allowed', false, 'reason', 'forbidden');
  end if;
  if not admin.caller_is_superadmin() then
    perform admin.log_security_event('denied_not_admin');
    return jsonb_build_object('allowed', false, 'reason', 'forbidden');
  end if;
  perform admin.log_security_event('access_granted');
  return jsonb_build_object(
    'allowed', true,
    'reason', 'ok',
    'username', (select p.username from public.profiles p where p.id = auth.uid()),
    'time_zone', admin.tz(),
    'today', admin.today()
  );
end;
$$;

revoke all on function admin.assert_superadmin(text, jsonb) from public, anon, authenticated;
revoke all on function public.admin_session_check() from public, anon;
grant execute on function public.admin_session_check() to authenticated;

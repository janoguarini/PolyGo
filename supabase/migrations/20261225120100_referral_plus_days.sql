-- =====================================================================
-- Invitaciones: días de PolyGo Plus como premio
--
-- Nuevos premios (shared/referrals.ts):
--   3 amigos  → 7 días de Plus + insignia Reclutador          (antes: 500 Polys)
--   5 amigos  → 750 Polys + skin Explorador Social + Embajador (sin cambios)
--   10 amigos → 30 días de Plus + skin y marco legendarios + Invitador Élite
--
-- Los días se suman en user_entitlements (source 'referral'):
--   * sin Plus o vencido → Plus desde ahora por N días;
--   * con Plus que vence → se extiende N días desde su vencimiento;
--   * Plus sin vencimiento (manual) → no cambia.
-- Ojo: cuando exista el webhook de la tienda, una renovación que reescriba expires_at pisaría los
-- días sumados encima de una suscripción paga (ver docs/PLUS.md).
--
-- Al aplicarse nadie había alcanzado un hito (referral_rewards vacía), así que no hay premios
-- viejos que compensar.
--
-- Rollback: volver a aplicar referral_config / refresh_referrals / get_referral_status de
-- 20261222120100_referrals; drop function public.grant_plus_days(uuid, integer);
-- alter table public.referral_rewards drop column plus_days; restaurar el check de source
-- (antes hay que borrar o cambiar las filas con source 'referral').
-- =====================================================================

alter table public.user_entitlements drop constraint user_entitlements_source_check;
alter table public.user_entitlements add constraint user_entitlements_source_check
  check (source in ('app_store', 'play_store', 'manual', 'referral'));

alter table public.referral_rewards
  add column plus_days integer not null default 0 check (plus_days >= 0);

-- ---------- configuración (espejo de shared/referrals.ts) ----------
create or replace function public.referral_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'attributionWindowDays', 7,
    'milestones', jsonb_build_array(
      jsonb_build_object('at', 3, 'polys', 0, 'plus_days', 7, 'badge', 'recruiter',
        'items', jsonb_build_array()),
      jsonb_build_object('at', 5, 'polys', 750, 'plus_days', 0, 'badge', 'ambassador',
        'items', jsonb_build_array('skin-social-explorer')),
      jsonb_build_object('at', 10, 'polys', 0, 'plus_days', 30, 'badge', 'elite_inviter',
        'items', jsonb_build_array('skin-team-legend', 'frame_referral_legend'))));
$$;

-- ---------- sumar días de Plus ----------
create or replace function public.grant_plus_days(p_user uuid, p_days integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_days <= 0 then
    return;
  end if;
  insert into public.user_entitlements as e (user_id, entitlement, source, starts_at, expires_at)
  values (p_user, 'plus', 'referral', now(), now() + make_interval(days => p_days))
  on conflict (user_id, entitlement) do update set
    -- Vencido: arranca de nuevo hoy, como premio de invitación.
    source = case when e.expires_at is not null and e.expires_at <= now() then 'referral'
                  else e.source end,
    starts_at = case when e.expires_at is not null and e.expires_at <= now() then now()
                     else e.starts_at end,
    -- Sin vencimiento queda igual; si no, N días más desde el vencimiento (o desde hoy).
    expires_at = case when e.expires_at is null then null
                      else greatest(e.expires_at, now()) + make_interval(days => p_days) end,
    updated_at = now();
end;
$$;

-- ---------- entrega de hitos ----------
create or replace function public.refresh_referrals(p_referrer uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  cfg jsonb := public.referral_config();
  m jsonb;
  qualified integer;
  granted jsonb := '[]'::jsonb;
  inserted integer;
  item text;
begin
  -- Serializa entregas simultáneas del mismo referente (dos dispositivos, referente e invitado a la
  -- vez...). Se libera sola al terminar la transacción.
  perform pg_advisory_xact_lock(hashtextextended('referrals:' || p_referrer::text, 0));

  update public.referral_attributions a set status = 'qualified', qualified_at = now()
  where a.referrer_id = p_referrer and a.status = 'pending'
    and public.referral_missing_step(public.referral_invitee_state(a.invitee_id)) is null;

  select count(*) into qualified from public.referral_attributions
  where referrer_id = p_referrer and status = 'qualified';

  for m in select * from jsonb_array_elements(cfg -> 'milestones') loop
    continue when qualified < (m ->> 'at')::int;
    insert into public.referral_rewards (user_id, milestone, polys, plus_days)
    values (p_referrer, (m ->> 'at')::smallint, (m ->> 'polys')::int, (m ->> 'plus_days')::int)
    on conflict do nothing;
    get diagnostics inserted = row_count;
    continue when inserted = 0;

    if (m ->> 'polys')::int > 0 then
      perform public.poly_credit(p_referrer, (m ->> 'polys')::int, 'referral',
        'milestone:' || (m ->> 'at'));
    end if;
    perform public.grant_plus_days(p_referrer, (m ->> 'plus_days')::int);
    insert into public.user_badges (user_id, badge_id, source)
    values (p_referrer, m ->> 'badge', 'referral') on conflict do nothing;
    for item in select jsonb_array_elements_text(m -> 'items') loop
      insert into public.user_cosmetics (user_id, item_id, source)
      values (p_referrer, item, 'referral') on conflict do nothing;
    end loop;
    granted := granted || jsonb_build_object('milestone', (m ->> 'at')::int,
      'polys', (m ->> 'polys')::int, 'plus_days', (m ->> 'plus_days')::int,
      'badge', m ->> 'badge', 'items', m -> 'items');
  end loop;
  return granted;
end;
$$;

-- ---------- estado (agrega plus_days) ----------
create or replace function public.get_referral_status()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  granted jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  granted := public.refresh_referrals(uid);
  return jsonb_build_object(
    'code', (select public_code from public.profiles where id = uid),
    'qualified', (select count(*) from public.referral_attributions
                  where referrer_id = uid and status = 'qualified'),
    'pending', (select count(*) from public.referral_attributions
                where referrer_id = uid and status = 'pending'),
    'just_granted', granted,
    'milestones', (select jsonb_agg(jsonb_build_object(
                      'at', (m ->> 'at')::int,
                      'polys', (m ->> 'polys')::int,
                      'plus_days', (m ->> 'plus_days')::int,
                      'badge', m ->> 'badge',
                      'items', m -> 'items',
                      'granted_at', r.granted_at) order by (m ->> 'at')::int)
                   from jsonb_array_elements(public.referral_config() -> 'milestones') m
                   left join public.referral_rewards r
                     on r.user_id = uid and r.milestone = (m ->> 'at')::int),
    'invites', (select coalesce(jsonb_agg(jsonb_build_object(
                   'username', p.username,
                   'status', a.status,
                   'joined_at', a.created_at,
                   'qualified_at', a.qualified_at,
                   'missing', case when a.status = 'pending' then
                     public.referral_missing_step(public.referral_invitee_state(a.invitee_id)) end)
                   order by a.created_at desc), '[]'::jsonb)
                from (select * from public.referral_attributions
                      where referrer_id = uid order by created_at desc limit 50) a
                join public.profiles p on p.id = a.invitee_id));
end;
$$;

revoke all on function public.grant_plus_days(uuid, integer) from public, anon, authenticated;

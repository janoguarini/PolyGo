-- =====================================================================
-- Recompensa de bienvenida (calendario de 7 días)
--
-- Cada cuenta completa el calendario una sola vez: un premio por día calendario en su zona horaria.
-- Faltar un día no reinicia el progreso (sólo lo pausa). Días 1-4 y 6: Polys. Día 5: skin Ninja.
-- Día 7: marco Élite. Si ya tenías el cosmético, recibís su precio en Polys.
--
-- Valores: shared/welcomeRewards.ts (welcome_rewards_config() los replica).
--
-- Antitrampa:
--   * Una fila por (usuario, día): el mismo día no se cobra dos veces (PK + advisory lock).
--   * La fecha local la calcula el servidor con safe_time_zone(); para que cambiar la zona horaria
--     del teléfono no adelante el calendario, además hacen falta 20 h desde el cobro anterior.
--   * Polys con poly_credit idempotente por (reason, ref).
--
-- Rollback:
--   drop function if exists public.claim_welcome_reward(text);
--   drop function if exists public.get_welcome_rewards(text);
--   drop function if exists public.welcome_rewards_state(uuid, text);
--   drop function if exists public.welcome_rewards_config();
--   drop table if exists public.welcome_reward_claims;
--   (las poly_transactions con reason 'welcome_week' quedan como historial; para volver al check
--    anterior hay que borrarlas primero)
-- =====================================================================

-- ---------- nuevo motivo de Polys ----------
alter table public.poly_transactions drop constraint poly_transactions_reason_check;
alter table public.poly_transactions add constraint poly_transactions_reason_check
  check (reason in ('welcome', 'mission', 'chest', 'weekly', 'lesson_perfect', 'unit', 'ranked_win',
    'rank', 'streak', 'achievement', 'shop_freeze', 'shop_item', 'streak_repair', 'season', 'iap',
    'friend_challenge', 'referral', 'welcome_week'));

-- ---------- configuración (espejo de shared/welcomeRewards.ts) ----------
create or replace function public.welcome_rewards_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'min_hours_between', 20,
    'days', jsonb_build_array(
      jsonb_build_object('day', 1, 'kind', 'polys', 'polys', 20),
      jsonb_build_object('day', 2, 'kind', 'polys', 'polys', 30),
      jsonb_build_object('day', 3, 'kind', 'polys', 'polys', 50),
      jsonb_build_object('day', 4, 'kind', 'polys', 'polys', 40),
      jsonb_build_object('day', 5, 'kind', 'item', 'item', 'skin-ninja', 'polys', 250),
      jsonb_build_object('day', 6, 'kind', 'polys', 'polys', 60),
      jsonb_build_object('day', 7, 'kind', 'item', 'item', 'frame_elite', 'polys', 700)));
$$;

create table public.welcome_reward_claims (
  user_id uuid not null references auth.users (id) on delete cascade,
  day smallint not null check (day between 1 and 7),
  local_date date not null,
  claimed_at timestamptz not null default now(),
  polys integer not null default 0 check (polys >= 0),
  item_id text references public.cosmetic_items (id),
  primary key (user_id, day)
);

alter table public.welcome_reward_claims enable row level security;
revoke all on public.welcome_reward_claims from public, anon, authenticated;
grant select on public.welcome_reward_claims to authenticated;
create policy "welcome rewards readable by owner" on public.welcome_reward_claims
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- estado ----------
/** Estado del calendario de p_user. claimable_today: puede cobrar ahora. */
create or replace function public.welcome_rewards_state(p_user uuid, p_time_zone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  cfg jsonb := public.welcome_rewards_config();
  today date := (now() at time zone public.safe_time_zone(p_time_zone))::date;
  v_claimed integer;
  v_last_date date;
  v_last_at timestamptz;
  v_total integer := jsonb_array_length(cfg -> 'days');
  v_claimable boolean;
begin
  select count(*)::int into v_claimed from public.welcome_reward_claims where user_id = p_user;
  select c.local_date, c.claimed_at into v_last_date, v_last_at
  from public.welcome_reward_claims c
  where c.user_id = p_user order by c.day desc limit 1;

  v_claimable := v_claimed < v_total and (
    v_last_date is null or (
      v_last_date < today
      and v_last_at <= now() - make_interval(hours => (cfg ->> 'min_hours_between')::int)));

  return jsonb_build_object(
    'date', today,
    'claimed', v_claimed,
    'total', v_total,
    'completed', v_claimed >= v_total,
    'claimable_today', v_claimable,
    -- Día que se cobra ahora (o el próximo, si hoy ya cobraste).
    'next_day', least(v_claimed + 1, v_total),
    'days', (
      select jsonb_agg(d || jsonb_build_object(
          'claimed_at', c.claimed_at,
          'granted_polys', c.polys,
          'granted_item', c.item_id)
        order by (d ->> 'day')::int)
      from jsonb_array_elements(cfg -> 'days') d
      left join public.welcome_reward_claims c
        on c.user_id = p_user and c.day = (d ->> 'day')::smallint));
end;
$$;

create or replace function public.get_welcome_rewards(p_time_zone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return public.welcome_rewards_state(uid, p_time_zone);
end;
$$;

-- ---------- cobrar ----------
create or replace function public.claim_welcome_reward(p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  v_state jsonb;
  v_reward jsonb;
  v_day smallint;
  v_polys integer := 0;
  v_item text;
  v_balance integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  -- Serializa cobros simultáneos (dos dispositivos, doble toque).
  perform pg_advisory_xact_lock(hashtextextended('welcome_rewards:' || uid::text, 0));

  v_state := public.welcome_rewards_state(uid, p_time_zone);
  if (v_state ->> 'completed')::boolean then
    raise exception 'welcome_completed' using errcode = '22023';
  end if;
  if not (v_state ->> 'claimable_today')::boolean then
    raise exception 'already_claimed' using errcode = '22023';
  end if;

  v_day := (v_state ->> 'next_day')::smallint;
  v_reward := (public.welcome_rewards_config() -> 'days') -> (v_day - 1);

  if v_reward ->> 'kind' = 'item' then
    v_item := v_reward ->> 'item';
    insert into public.user_cosmetics (user_id, item_id, source)
    values (uid, v_item, 'gift') on conflict do nothing;
    if not found then
      -- Ya lo tenía: se compensa con su precio en Polys.
      v_polys := (v_reward ->> 'polys')::int;
      v_item := null;
    end if;
  else
    v_polys := (v_reward ->> 'polys')::int;
  end if;

  insert into public.welcome_reward_claims (user_id, day, local_date, polys, item_id)
  values (uid, v_day, (v_state ->> 'date')::date, v_polys, v_item);

  if v_polys > 0 then
    perform public.poly_credit(uid, v_polys, 'welcome_week', 'day:' || v_day);
  end if;
  select w.balance into v_balance from public.poly_wallets w where w.user_id = uid;

  return jsonb_build_object(
    'day', v_day,
    'polys', v_polys,
    'item', v_item,
    'balance', coalesce(v_balance, 0),
    'completed', v_day >= jsonb_array_length(public.welcome_rewards_config() -> 'days'));
end;
$$;

revoke all on function public.welcome_rewards_config() from public, anon;
grant execute on function public.welcome_rewards_config() to authenticated;
revoke all on function public.welcome_rewards_state(uuid, text) from public, anon, authenticated;
revoke all on function public.get_welcome_rewards(text) from public, anon;
grant execute on function public.get_welcome_rewards(text) to authenticated;
revoke all on function public.claim_welcome_reward(text) from public, anon;
grant execute on function public.claim_welcome_reward(text) to authenticated;

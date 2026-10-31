-- Economía de Polys (etapa 1): billetera, registro de movimientos y ganancias.
-- Valores: shared/polys.ts (poly_config() los replica; un test compara ambos).
--
-- Todo lo decide la base. Cada ganancia tiene una clave única (reason, ref), así que acreditar dos
-- veces lo mismo es imposible. sync_polys() mira lo que ya está guardado (misiones de hoy, lecciones,
-- unidades, victorias de hoy, rangos de la temporada, racha y logros) y acredita lo que falte; la app
-- la llama al abrir y después de cada lección o partida.
-- La primera vez que un usuario sincroniza, lo que ya había logrado queda marcado como contado
-- (amount = 0) y recibe sólo el regalo de bienvenida: no hay premios retroactivos.
-- El cofre del día (claim_mission_reward) ahora da Polys en vez de un protector; el protector se
-- compra (buy_streak_freeze).

create table public.poly_wallets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  initialized boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.poly_transactions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Positivo = ganancia, negativo = gasto, 0 = logro previo a las Polys (ya contado).
  amount integer not null,
  reason text not null check (reason in ('welcome', 'mission', 'chest', 'weekly', 'lesson_perfect',
    'unit', 'ranked_win', 'rank', 'streak', 'achievement', 'shop_freeze')),
  ref text not null,
  created_at timestamptz not null default now(),
  unique (user_id, reason, ref)
);

create index poly_transactions_user_idx on public.poly_transactions (user_id, created_at desc);

alter table public.poly_wallets enable row level security;
alter table public.poly_transactions enable row level security;
revoke all on public.poly_wallets, public.poly_transactions from anon, authenticated;
grant select on public.poly_wallets, public.poly_transactions to authenticated;
create policy "wallet readable by owner" on public.poly_wallets
  for select to authenticated using (user_id = (select auth.uid()));
create policy "poly transactions readable by owner" on public.poly_transactions
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- configuración (espejo de shared/polys.ts) ----------
create or replace function public.poly_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'welcome', 100,
    'mission', 5,
    'chest', jsonb_build_object('min', 10, 'max', 20, 'jackpot', 50, 'jackpotChance', 0.05),
    'weekly', jsonb_build_object('days', 5, 'bonus', 50),
    'lessonPerfect', 2,
    'unit', 20,
    'rankedWin', 3,
    'rankedWinsPerDay', 5,
    'rankReached', jsonb_build_object('silver', 50, 'gold', 75, 'platinum', 100, 'emerald', 150,
      'diamond', 200, 'master', 250, 'grandmaster', 300),
    'streakMilestones', jsonb_build_array(
      jsonb_build_object('days', 7, 'polys', 25),
      jsonb_build_object('days', 14, 'polys', 40),
      jsonb_build_object('days', 30, 'polys', 75),
      jsonb_build_object('days', 50, 'polys', 100),
      jsonb_build_object('days', 100, 'polys', 200),
      jsonb_build_object('days', 365, 'polys', 500)),
    'achievement', jsonb_build_object('perLevel', 10, 'max', 50),
    'prices', jsonb_build_object('streakFreeze', 100));
$$;

-- ---------- movimientos ----------
/** Acredita una vez por (reason, ref). Devuelve lo acreditado (0 si ya estaba). */
create or replace function public.poly_credit(p_user uuid, p_amount integer, p_reason text, p_ref text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.poly_transactions (user_id, amount, reason, ref)
  values (p_user, p_amount, p_reason, p_ref)
  on conflict (user_id, reason, ref) do nothing;
  if not found then
    return 0;
  end if;
  insert into public.poly_wallets as w (user_id, balance) values (p_user, p_amount)
  on conflict (user_id) do update set balance = w.balance + excluded.balance, updated_at = now();
  return p_amount;
end;
$$;

/** Gasta Polys; falla con insufficient_polys si no alcanzan. */
create or replace function public.poly_debit(p_user uuid, p_amount integer, p_reason text, p_ref text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  left_over integer;
begin
  update public.poly_wallets set balance = balance - p_amount, updated_at = now()
  where user_id = p_user and balance >= p_amount
  returning balance into left_over;
  if not found then
    raise exception 'insufficient_polys' using errcode = '22023';
  end if;
  insert into public.poly_transactions (user_id, amount, reason, ref)
  values (p_user, -p_amount, p_reason, p_ref);
  return left_over;
end;
$$;

-- ---------- ganancias derivadas de lo guardado ----------
/** Todo lo que el usuario ya ganó según los datos: (reason, ref, amount). */
create or replace function public.poly_earnings(p_user uuid, p_tz text)
returns table (reason text, ref text, amount integer)
language sql
stable
security definer
set search_path = ''
as $$
  with cfg as (select public.poly_config() as c),
  today as (select (now() at time zone p_tz)::date as d),
  season as (select id from public.seasons where status = 'active' limit 1)
  -- misiones de hoy completas
  select 'mission', t.d::text || ':' || (m ->> 'id'), (cfg.c ->> 'mission')::int
  from today t, cfg,
    jsonb_array_elements(public.daily_missions_for(p_user, t.d)) m
  where public.mission_progress(p_user, m ->> 'id', t.d, p_tz) >= (m ->> 'target')::int
  union all
  -- lecciones con 3 estrellas
  select 'lesson_perfect', p.lesson_id, (cfg.c ->> 'lessonPerfect')::int
  from public.user_lesson_progress p, cfg
  where p.user_id = p_user and p.best_accuracy >= 1
  union all
  -- unidades con todas sus lecciones terminadas
  select 'unit', l.unit_id, (cfg.c ->> 'unit')::int
  from public.lessons l
  left join public.user_lesson_progress p on p.lesson_id = l.id and p.user_id = p_user
  cross join cfg
  where l.is_published
  group by l.unit_id, cfg.c
  having bool_and(coalesce(p.times_completed, 0) > 0)
  union all
  -- victorias ranked de hoy, hasta el tope diario
  select 'ranked_win', w.battle_id::text, (cfg.c ->> 'rankedWin')::int
  from cfg, lateral (
    select b.id as battle_id
    from public.battle_players bp
    join public.battles b on b.id = bp.battle_id
    cross join today t
    where bp.user_id = p_user and b.is_ranked and bp.result = 'win'
      and b.status in ('completed', 'forfeited')
      and (b.ended_at at time zone p_tz)::date = t.d
    order by b.ended_at, b.id
    limit (select (public.poly_config() ->> 'rankedWinsPerDay')::int)
  ) w
  union all
  -- rangos alcanzados en la temporada activa
  -- (umbrales = TIERS de shared/ranking.ts; un test los compara)
  select 'rank', s.id::text || ':' || t.tier, (cfg.c -> 'rankReached' ->> t.tier)::int
  from season s, cfg,
    lateral (select max(h.rating_after) as top from public.rating_history h
             where h.user_id = p_user and h.season_id = s.id and h.reason = 'battle') best,
    (values ('silver', 400), ('gold', 700), ('platinum', 1000), ('emerald', 1300),
            ('diamond', 1600), ('master', 1900), ('grandmaster', 2200)) as t (tier, min_rating)
  where best.top >= t.min_rating
  union all
  -- hitos de racha (mejor racha de la vida)
  select 'streak', (ms ->> 'days'), (ms ->> 'polys')::int
  from cfg,
    lateral (select (public.achievement_metrics(p_user) ->> 'best_streak_days')::int as best) st,
    jsonb_array_elements(cfg.c -> 'streakMilestones') ms
  where st.best >= (ms ->> 'days')::int
  union all
  -- logros: nivel N de su familia
  select 'achievement', a.id,
    least(a.level * (cfg.c -> 'achievement' ->> 'perLevel')::int, (cfg.c -> 'achievement' ->> 'max')::int)
  from cfg, (
    select ach.id, row_number() over (partition by ach.metric order by ach.threshold)::int as level
    from public.achievements ach
  ) a
  join public.user_achievements ua on ua.achievement_id = a.id and ua.user_id = p_user;
$$;

/**
 * Acredita lo ganado que falte y devuelve {balance, granted: [{reason, ref, amount}]}.
 * La primera vez marca lo previo como contado y da el regalo de bienvenida.
 */
create or replace function public.sync_polys(p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  tz text := public.safe_time_zone(p_time_zone);
  ready boolean;
  e record;
  got integer;
  granted jsonb := '[]'::jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  insert into public.poly_wallets (user_id) values (uid) on conflict do nothing;
  -- El bloqueo serializa sincronizaciones simultáneas del mismo usuario.
  select initialized into ready from public.poly_wallets where user_id = uid for update;

  if not ready then
    insert into public.poly_transactions (user_id, amount, reason, ref)
    select uid, 0, x.reason, x.ref from public.poly_earnings(uid, tz) x
    on conflict do nothing;
    got := public.poly_credit(uid, (public.poly_config() ->> 'welcome')::int, 'welcome', 'welcome');
    if got > 0 then
      granted := granted || jsonb_build_object('reason', 'welcome', 'ref', 'welcome', 'amount', got);
    end if;
    update public.poly_wallets set initialized = true where user_id = uid;
  else
    for e in select * from public.poly_earnings(uid, tz) loop
      got := public.poly_credit(uid, e.amount, e.reason, e.ref);
      if got > 0 then
        granted := granted || jsonb_build_object('reason', e.reason, 'ref', e.ref, 'amount', got);
      end if;
    end loop;
  end if;

  return jsonb_build_object(
    'balance', (select balance from public.poly_wallets where user_id = uid),
    'granted', granted);
end;
$$;

-- ---------- cofre del día ----------
/**
 * Abre el cofre del día (con las 3 misiones completas, una vez por día): 10–20 Polys al azar o, con
 * 5 % de chance, 50. Si es el 5.º cofre de la semana suma el bonus semanal.
 * Devuelve {polys, jackpot, weekly_bonus, balance, freezes}.
 */
create or replace function public.claim_mission_reward(p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  state jsonb;
  today date;
  cfg jsonb := public.poly_config();
  roll double precision := random();
  prize integer;
  weekly integer := 0;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  state := public.get_daily_missions(p_time_zone);
  if not (state ->> 'all_done')::boolean then
    raise exception 'missions_incomplete' using errcode = '22023';
  end if;
  today := (state ->> 'date')::date;
  insert into public.user_mission_rewards (user_id, mission_date)
  values (uid, today)
  on conflict do nothing;
  if not found then
    raise exception 'already_claimed' using errcode = '22023';
  end if;

  prize := case
    when roll < (cfg -> 'chest' ->> 'jackpotChance')::float then (cfg -> 'chest' ->> 'jackpot')::int
    else (cfg -> 'chest' ->> 'min')::int
      + floor(random() * ((cfg -> 'chest' ->> 'max')::int - (cfg -> 'chest' ->> 'min')::int + 1))::int
  end;
  perform public.poly_credit(uid, prize, 'chest', today::text);

  if (select count(*) from public.user_mission_rewards
      where user_id = uid and date_trunc('week', mission_date) = date_trunc('week', today))
     >= (cfg -> 'weekly' ->> 'days')::int then
    weekly := public.poly_credit(uid, (cfg -> 'weekly' ->> 'bonus')::int, 'weekly',
      to_char(today, 'IYYY-IW'));
  end if;

  return jsonb_build_object(
    'polys', prize,
    'jackpot', prize = (cfg -> 'chest' ->> 'jackpot')::int,
    'weekly_bonus', weekly,
    'balance', (select balance from public.poly_wallets where user_id = uid),
    'freezes', coalesce((select available from public.user_streak_freezes where user_id = uid), 0));
end;
$$;

-- ---------- tienda ----------
/** Compra un protector de racha (máximo 2 guardados). Devuelve {balance, freezes}. */
create or replace function public.buy_streak_freeze()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  have smallint;
  left_over integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  insert into public.user_streak_freezes (user_id, available) values (uid, 0)
  on conflict (user_id) do nothing;
  select available into have from public.user_streak_freezes where user_id = uid for update;
  if have >= 2 then
    raise exception 'freezes_full' using errcode = '22023';
  end if;
  left_over := public.poly_debit(uid, (public.poly_config() -> 'prices' ->> 'streakFreeze')::int,
    'shop_freeze', gen_random_uuid()::text);
  update public.user_streak_freezes set available = have + 1, updated_at = now() where user_id = uid;
  return jsonb_build_object('balance', left_over, 'freezes', have + 1);
end;
$$;

revoke all on function public.poly_config() from public, anon;
grant execute on function public.poly_config() to authenticated;
revoke all on function public.poly_credit(uuid, integer, text, text) from public, anon, authenticated;
revoke all on function public.poly_debit(uuid, integer, text, text) from public, anon, authenticated;
revoke all on function public.poly_earnings(uuid, text) from public, anon, authenticated;
revoke all on function public.sync_polys(text) from public, anon;
grant execute on function public.sync_polys(text) to authenticated;
revoke all on function public.claim_mission_reward(text) from public, anon;
grant execute on function public.claim_mission_reward(text) to authenticated;
revoke all on function public.buy_streak_freeze() from public, anon;
grant execute on function public.buy_streak_freeze() to authenticated;

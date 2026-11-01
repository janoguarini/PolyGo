-- Polys etapa 2: la tienda. Marcos del avatar, fondos del perfil y recuperar una racha perdida.
-- Catálogo: shared/cosmetics.ts (cosmetic_items lo replica; un test compara ambos lados).
-- Legendarios: sin precio. No se compran con Polys (premio de temporada o, más adelante, con plata
-- real); user_cosmetics.source dice cómo se consiguió cada ítem.
-- Recuperar la racha: si faltaste hasta 3 días seguidos y los protectores no alcanzaban, se pagan
-- los días que faltaron (quedan como días cubiertos, igual que con un protector).

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
    'prices', jsonb_build_object('streakFreeze', 100),
    'streakRepair', jsonb_build_object('maxMissedDays', 3, 'minStreak', 3, 'price', 250,
      'bigStreak', 30, 'bigPrice', 400));
$$;

-- ---------- catálogo ----------
create table public.cosmetic_items (
  id text primary key,
  kind text not null check (kind in ('frame', 'background')),
  rarity text not null check (rarity in ('common', 'rare', 'epic', 'legendary')),
  price integer check (price > 0),
  source text not null check (source in ('polys', 'season', 'premium')),
  position smallint not null,
  -- Sólo lo que sale por Polys tiene precio, y un legendario nunca.
  check ((price is not null) = (source = 'polys')),
  check (rarity <> 'legendary' or price is null)
);

insert into public.cosmetic_items (id, kind, rarity, price, source, position) values
  ('frame_mint', 'frame', 'common', 150, 'polys', 1),
  ('frame_coral', 'frame', 'common', 150, 'polys', 2),
  ('frame_sky', 'frame', 'common', 200, 'polys', 3),
  ('frame_sun', 'frame', 'common', 250, 'polys', 4),
  ('frame_sunset', 'frame', 'rare', 400, 'polys', 5),
  ('frame_ocean', 'frame', 'rare', 450, 'polys', 6),
  ('frame_aurora', 'frame', 'rare', 600, 'polys', 7),
  ('frame_galaxy', 'frame', 'epic', 1000, 'polys', 8),
  ('frame_fire', 'frame', 'epic', 1200, 'polys', 9),
  ('frame_crown', 'frame', 'epic', 1500, 'polys', 10),
  ('frame_legend', 'frame', 'legendary', null, 'season', 11),
  ('frame_founder', 'frame', 'legendary', null, 'premium', 12),
  ('bg_forest', 'background', 'common', 200, 'polys', 13),
  ('bg_ocean', 'background', 'common', 200, 'polys', 14),
  ('bg_wine', 'background', 'common', 250, 'polys', 15),
  ('bg_sunset', 'background', 'rare', 500, 'polys', 16),
  ('bg_neon', 'background', 'rare', 600, 'polys', 17),
  ('bg_galaxy', 'background', 'epic', 1200, 'polys', 18),
  ('bg_gold', 'background', 'legendary', null, 'season', 19);

create table public.user_cosmetics (
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null references public.cosmetic_items (id),
  source text not null check (source in ('polys', 'season', 'premium', 'gift')),
  acquired_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.profiles
  add column frame_id text references public.cosmetic_items (id),
  add column background_id text references public.cosmetic_items (id);

alter table public.cosmetic_items enable row level security;
alter table public.user_cosmetics enable row level security;
revoke all on public.cosmetic_items, public.user_cosmetics from anon, authenticated;
grant select on public.cosmetic_items, public.user_cosmetics to authenticated;
create policy "cosmetics readable" on public.cosmetic_items
  for select to authenticated using (true);
create policy "own cosmetics readable" on public.user_cosmetics
  for select to authenticated using (user_id = (select auth.uid()));

/** Compra un ítem con Polys y lo deja puesto. Devuelve {balance, item_id}. */
create or replace function public.buy_cosmetic(p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  item public.cosmetic_items;
  left_over integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into item from public.cosmetic_items where id = p_item_id;
  if not found then
    raise exception 'item_not_found' using errcode = '22023';
  end if;
  if item.price is null then
    raise exception 'item_not_for_sale' using errcode = '22023';
  end if;
  insert into public.user_cosmetics (user_id, item_id, source) values (uid, item.id, 'polys')
  on conflict do nothing;
  if not found then
    raise exception 'item_owned' using errcode = '22023';
  end if;
  left_over := public.poly_debit(uid, item.price, 'shop_item', item.id);
  if item.kind = 'frame' then
    update public.profiles set frame_id = item.id where id = uid;
  else
    update public.profiles set background_id = item.id where id = uid;
  end if;
  return jsonb_build_object('balance', left_over, 'item_id', item.id);
end;
$$;

/** Se pone un ítem propio (o se lo saca con p_item_id = null). */
create or replace function public.equip_cosmetic(p_kind text, p_item_id text)
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
  if p_kind not in ('frame', 'background') then
    raise exception 'invalid_kind' using errcode = '22023';
  end if;
  if p_item_id is not null and not exists (
    select 1 from public.user_cosmetics uc
    join public.cosmetic_items i on i.id = uc.item_id
    where uc.user_id = uid and uc.item_id = p_item_id and i.kind = p_kind
  ) then
    raise exception 'item_not_owned' using errcode = '22023';
  end if;
  if p_kind = 'frame' then
    update public.profiles set frame_id = p_item_id where id = uid;
  else
    update public.profiles set background_id = p_item_id where id = uid;
  end if;
end;
$$;

-- ---------- recuperar la racha ----------
/** Largo de la racha que termina en p_day (los días cubiertos no suman pero no cortan). */
create or replace function public.streak_ending(p_user uuid, p_day date)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  streak integer := 0;
  d date := p_day;
begin
  loop
    if exists (select 1 from public.user_daily_activity where user_id = p_user and activity_date = d) then
      streak := streak + 1;
    elsif not exists (select 1 from public.user_frozen_days where user_id = p_user and frozen_date = d) then
      exit;
    end if;
    d := d - 1;
  end loop;
  return streak;
end;
$$;

/**
 * La oferta de recuperar la racha, o null si no hay nada que recuperar: faltaste entre 1 y
 * maxMissedDays días seguidos (hasta ayer), los protectores no los cubren y la racha perdida era de
 * al menos minStreak días.
 */
create or replace function public.streak_repair_offer(p_user uuid, p_tz text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  cfg jsonb := public.poly_config() -> 'streakRepair';
  today date := (now() at time zone p_tz)::date;
  last_day date;
  missed integer;
  freezes integer;
  lost integer;
begin
  select greatest(
    (select max(activity_date) from public.user_daily_activity where user_id = p_user and activity_date < today),
    (select max(frozen_date) from public.user_frozen_days where user_id = p_user and frozen_date < today))
  into last_day;
  if last_day is null then
    return null;
  end if;
  missed := today - 1 - last_day;
  if missed < 1 or missed > (cfg ->> 'maxMissedDays')::int then
    return null;
  end if;
  -- Si todavía no estudiaste hoy y los protectores alcanzan, se gastan solos al volver.
  freezes := coalesce((select available from public.user_streak_freezes where user_id = p_user), 0);
  if missed <= freezes and not exists (
    select 1 from public.user_daily_activity where user_id = p_user and activity_date = today
  ) then
    return null;
  end if;
  lost := public.streak_ending(p_user, last_day);
  if lost < (cfg ->> 'minStreak')::int then
    return null;
  end if;
  return jsonb_build_object(
    'lost_streak', lost,
    'missed_days', missed,
    'price', case when lost >= (cfg ->> 'bigStreak')::int
                  then (cfg ->> 'bigPrice')::int else (cfg ->> 'price')::int end,
    -- Último día en que todavía se puede recuperar.
    'last_chance', last_day + (cfg ->> 'maxMissedDays')::int + 1,
    'last_day', last_day);
end;
$$;

create or replace function public.get_streak_repair(p_time_zone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return public.streak_repair_offer(auth.uid(), public.safe_time_zone(p_time_zone));
end;
$$;

/** Paga la oferta: los días que faltaron quedan cubiertos y la racha sigue. Devuelve {balance, streak}. */
create or replace function public.repair_streak(p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  tz text := public.safe_time_zone(p_time_zone);
  today date := (now() at time zone public.safe_time_zone(p_time_zone))::date;
  offer jsonb;
  last_day date;
  left_over integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  offer := public.streak_repair_offer(uid, tz);
  if offer is null then
    raise exception 'streak_not_repairable' using errcode = '22023';
  end if;
  last_day := (offer ->> 'last_day')::date;
  -- La clave (streak_repair, last_day) impide pagar dos veces el mismo hueco.
  left_over := public.poly_debit(uid, (offer ->> 'price')::int, 'streak_repair', last_day::text);
  insert into public.user_frozen_days (user_id, frozen_date)
  select uid, d::date
  from generate_series(last_day + 1, today - 1, interval '1 day') as d
  on conflict do nothing;
  return jsonb_build_object(
    'balance', left_over,
    'streak', public.streak_ending(uid, case
      when exists (select 1 from public.user_daily_activity where user_id = uid and activity_date = today)
      then today else today - 1 end));
end;
$$;

-- ---------- el perfil público muestra marco y fondo ----------
create or replace function public.get_public_profile(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  visibility text;
  show_region boolean;
  is_open boolean;
  result jsonb;
  m jsonb;
  stars jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into prof from public.profiles where id = p_user_id and username is not null;
  if not found then
    return null;
  end if;

  select s.profile_visibility, s.show_region into visibility, show_region
  from public.user_settings s where s.user_id = p_user_id;
  is_open := p_user_id = uid or coalesce(visibility, 'private') = 'public';

  result := jsonb_build_object(
    'id', prof.id,
    'username', prof.username,
    'display_name', prof.display_name,
    'avatar_id', prof.avatar_id,
    'avatar_path', prof.avatar_path,
    'frame_id', prof.frame_id,
    'background_id', prof.background_id,
    'public_code', prof.public_code,
    'created_at', prof.created_at,
    'is_public', is_open,
    -- El país sólo se muestra si el usuario lo activó (o es su propio perfil).
    'region', case when p_user_id = uid or coalesce(show_region, false) then prof.region end,
    'rating', (select jsonb_build_object('rating', r.rating, 'games_played', r.games_played)
               from public.player_ratings r
               where r.user_id = p_user_id and r.language_code = prof.target_language)
  );

  if is_open then
    m := public.achievement_metrics(p_user_id);
    stars := public.lesson_star_totals(p_user_id);
    result := result || jsonb_build_object(
      'stats', (select jsonb_build_object(
                  'wins', r.wins, 'losses', r.losses, 'draws', r.draws,
                  'peak_rating', r.peak_rating, 'best_win_streak', r.best_win_streak)
                from public.player_ratings r
                where r.user_id = p_user_id and r.language_code = prof.target_language),
      'learning', jsonb_build_object(
                  'lessons_completed', m -> 'lessons_completed',
                  'words_mastered', m -> 'words_mastered',
                  'best_streak_days', m -> 'best_streak_days',
                  'stars_earned', stars -> 'stars_earned',
                  'golden_lessons', stars -> 'golden_lessons'),
      'achievements', (select coalesce(jsonb_agg(jsonb_build_object(
                          'id', a.id, 'title', a.title_es, 'icon', a.icon, 'category', a.category,
                          'unlocked_at', ua.unlocked_at) order by a.position), '[]'::jsonb)
                       from public.user_achievements ua
                       join public.achievements a on a.id = ua.achievement_id
                       where ua.user_id = p_user_id and a.is_active)
    );
  end if;

  return result;
end;
$$;

revoke all on function public.buy_cosmetic(text) from public, anon;
grant execute on function public.buy_cosmetic(text) to authenticated;
revoke all on function public.equip_cosmetic(text, text) from public, anon;
grant execute on function public.equip_cosmetic(text, text) to authenticated;
revoke all on function public.streak_ending(uuid, date) from public, anon, authenticated;
revoke all on function public.streak_repair_offer(uuid, text) from public, anon, authenticated;
revoke all on function public.get_streak_repair(text) from public, anon;
grant execute on function public.get_streak_repair(text) to authenticated;
revoke all on function public.repair_streak(text) from public, anon;
grant execute on function public.repair_streak(text) to authenticated;

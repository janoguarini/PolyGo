-- =====================================================================
-- Polygo · Migración 0001 · Núcleo: idiomas, perfiles, ajustes, rating, temporadas
-- Reglas replicadas de shared/profile.ts y shared/ranking.ts (mantener en sincronía).
-- =====================================================================

-- ---------- utilidades ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- idiomas ----------
create table public.languages (
  code text primary key check (code ~ '^[a-z]{2}$'),
  name_es text not null,
  is_target_available boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.languages (code, name_es, is_target_available) values
  ('es', 'Español', false),
  ('en', 'Inglés', true),
  ('pt', 'Portugués', false),
  ('fr', 'Francés', false),
  ('it', 'Italiano', false);

-- ---------- perfiles (datos públicos) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique check (username ~ '^[a-z0-9_]{3,20}$'),
  public_code text not null unique check (public_code ~ '^PG-[A-Z0-9]{6}$'),
  display_name text check (char_length(display_name) between 1 and 40),
  avatar_id text not null default 'bolt'
    check (avatar_id in ('bolt','flame','crown','rocket','brain','ghost','sword','star')),
  target_language text not null default 'en' references public.languages (code),
  start_level text not null default 'A1' check (start_level in ('A1','A2')),
  daily_goal_minutes smallint not null default 10 check (daily_goal_minutes in (5,10,15,20)),
  -- Región opcional y gruesa (p. ej. "AR", "ES"). Nunca ubicación precisa.
  region text check (region ~ '^[A-Z]{2}$'),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------- ajustes privados ----------
create table public.user_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  profile_visibility text not null default 'public'
    check (profile_visibility in ('public','friends','private')),
  show_region boolean not null default false,
  widget_content_type text not null default 'word_of_day'
    check (widget_content_type in ('word_of_day','quick_question','review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_settings_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();

-- ---------- temporadas ----------
create table public.seasons (
  id serial primary key,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','active','finished')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

-- Como máximo una temporada activa.
create unique index seasons_single_active on public.seasons (status) where status = 'active';

insert into public.seasons (name, starts_at, ends_at, status)
values ('Temporada Beta', '2026-10-01T00:00:00Z', '2027-01-01T00:00:00Z', 'active');

-- ---------- rating actual por idioma ----------
-- Fuente de verdad del ELO. Sólo se escribe desde backend (service_role / funciones definer).
create table public.player_ratings (
  user_id uuid not null references public.profiles (id) on delete cascade,
  language_code text not null references public.languages (code),
  rating integer not null default 1000 check (rating >= 100),
  peak_rating integer not null default 1000,
  games_played integer not null default 0 check (games_played >= 0),
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  draws integer not null default 0 check (draws >= 0),
  win_streak integer not null default 0 check (win_streak >= 0),
  best_win_streak integer not null default 0 check (best_win_streak >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, language_code),
  check (wins + losses + draws = games_played),
  check (peak_rating >= rating)
);

create index player_ratings_leaderboard on public.player_ratings (language_code, rating desc);

create trigger player_ratings_updated_at before update on public.player_ratings
  for each row execute function public.set_updated_at();

-- ---------- historial auditable de rating ----------
-- battle_id recibe su FK a battles en la migración del motor competitivo (Fase 4).
-- unique (user_id, battle_id) impide liquidar dos veces la misma partida para un jugador.
create table public.rating_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  language_code text not null references public.languages (code),
  season_id integer references public.seasons (id),
  battle_id uuid,
  reason text not null check (reason in ('initial','battle','adjustment')),
  rating_before integer not null,
  rating_after integer not null,
  delta integer generated always as (rating_after - rating_before) stored,
  created_at timestamptz not null default now(),
  unique (user_id, battle_id),
  check ((reason = 'battle') = (battle_id is not null))
);

create index rating_history_user_time on public.rating_history (user_id, language_code, created_at desc);

-- ---------- alta automática al registrarse ----------
create or replace function public.generate_public_code()
returns text
language plpgsql
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
begin
  loop
    code := 'PG-';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.profiles where public_code = code);
  end loop;
  return code;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, public_code) values (new.id, public.generate_public_code());
  insert into public.user_settings (user_id) values (new.id);
  insert into public.player_ratings (user_id, language_code) values (new.id, 'en');
  insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
  select new.id, 'en', s.id, 'initial', 1000, 1000
  from (select 1) as one
  left join public.seasons s on s.status = 'active';
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RPCs ----------
create or replace function public.is_username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select lower(trim(p_username)) ~ '^[a-z0-9_]{3,20}$'
     and not exists (
       select 1 from public.profiles
       where username = lower(trim(p_username)) and id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
     );
$$;

create or replace function public.complete_onboarding(
  p_username text,
  p_avatar_id text,
  p_target_language text,
  p_start_level text,
  p_daily_goal_minutes smallint
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  normalized text := lower(trim(p_username));
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages where code = p_target_language and is_target_available) then
    raise exception 'language_unavailable' using errcode = '22023';
  end if;
  if exists (select 1 from public.profiles where username = normalized and id <> uid) then
    raise exception 'username_taken' using errcode = '23505';
  end if;

  update public.profiles set
    username = normalized,
    display_name = coalesce(display_name, normalized),
    avatar_id = p_avatar_id,
    target_language = p_target_language,
    start_level = p_start_level,
    daily_goal_minutes = p_daily_goal_minutes,
    onboarding_completed_at = coalesce(onboarding_completed_at, now())
  where id = uid
  returning * into result;

  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;
  return result;
end;
$$;

-- ---------- RLS y permisos ----------
alter table public.languages enable row level security;
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.seasons enable row level security;
alter table public.player_ratings enable row level security;
alter table public.rating_history enable row level security;

-- Supabase concede privilegios amplios por defecto: los recortamos explícitamente.
revoke all on public.languages, public.profiles, public.user_settings, public.seasons,
  public.player_ratings, public.rating_history from anon, authenticated;

grant select on public.languages, public.seasons to anon, authenticated;
grant select on public.profiles, public.player_ratings to authenticated;
grant select on public.user_settings, public.rating_history to authenticated;
-- Sólo columnas editables por el propio usuario. username/public_code/rating: nunca directo.
grant update (display_name, avatar_id, daily_goal_minutes, region) on public.profiles to authenticated;
grant update (profile_visibility, show_region, widget_content_type) on public.user_settings to authenticated;

create policy "languages readable" on public.languages for select to anon, authenticated using (true);
create policy "seasons readable" on public.seasons for select to anon, authenticated using (true);

create policy "profiles readable by signed-in users" on public.profiles
  for select to authenticated using (true);
create policy "profiles updatable by owner" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "settings readable by owner" on public.user_settings
  for select to authenticated using (user_id = auth.uid());
create policy "settings updatable by owner" on public.user_settings
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "ratings readable by signed-in users" on public.player_ratings
  for select to authenticated using (true);

create policy "rating history readable by owner" on public.rating_history
  for select to authenticated using (user_id = auth.uid());

revoke all on function public.complete_onboarding(text, text, text, text, smallint) from public, anon;
grant execute on function public.complete_onboarding(text, text, text, text, smallint) to authenticated;
revoke all on function public.is_username_available(text) from public, anon;
grant execute on function public.is_username_available(text) to authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.generate_public_code() from public, anon, authenticated;

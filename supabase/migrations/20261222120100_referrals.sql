-- =====================================================================
-- Invitá amigos y ganá recompensas.
--
-- ESTADO: PREPARADA, NO APLICADA. No ejecutar en producción sin revisión (ver
-- docs/PROFILE_CUSTOMIZATION.md). Requiere 20261222120000_profile_customization.
--
-- Valores: shared/referrals.ts (referral_config() los replica; supabase/tests/referrals.test.mjs
-- compara ambos lados).
--
-- Diseño:
--   * El código de invitación ES el código de amigo que ya existe (profiles.public_code,
--     'PG-XXXXXX'): lo genera el servidor al crear la cuenta, es único y permanente. No hay otra
--     estructura de códigos.
--   * referral_attributions: una fila por invitado (PK = invitado) → un único referente, una sola
--     vez, imposible de cambiar desde la app (no hay UPDATE/DELETE para authenticated).
--   * Una invitación es válida cuando el invitado: verificó su email (auth.users.email_confirmed_at;
--     Google y Apple llegan verificados), terminó el onboarding y completó al menos una lección o
--     repaso registrados por el servidor (learning_sessions / user_daily_activity). Ni ELO ni
--     Ranked cuentan.
--   * Anti-abuso sin identificadores de dispositivo: no a uno mismo; sólo cuentas nuevas
--     (attributionWindowDays desde que se creó la cuenta del invitado); el referente tiene que ser más
--     antiguo que el invitado (evita intercambios entre cuentas viejas); un invitado = una
--     atribución; las cuentas borradas dejan de contar (cascade), pero los premios ya entregados no se
--     duplican nunca.
--   * Los premios se entregan en refresh_referrals(): con un lock por referente, cada hito se inserta
--     en referral_rewards (PK usuario+hito) y sólo si esa fila es nueva se acreditan Polys
--     (poly_credit con clave única 'referral'/'milestone:N'), insignias y cosméticos. Todo en la misma
--     transacción: o se entrega entero o nada, y nunca dos veces.
--   * La validación es perezosa y la decide siempre el servidor: se reevalúa cuando el referente abre
--     su pantalla de invitaciones (get_referral_status) y cuando el invitado sincroniza
--     (sync_referral, que la app llama al abrir y al terminar una lección). El cliente no manda
--     contadores ni estados.
-- =====================================================================

-- ---------- nuevo motivo de Polys ----------
alter table public.poly_transactions drop constraint poly_transactions_reason_check;
alter table public.poly_transactions add constraint poly_transactions_reason_check
  check (reason in ('welcome', 'mission', 'chest', 'weekly', 'lesson_perfect', 'unit', 'ranked_win',
    'rank', 'streak', 'achievement', 'shop_freeze', 'shop_item', 'streak_repair', 'season', 'iap',
    'friend_challenge', 'referral'));

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
      jsonb_build_object('at', 3, 'polys', 500, 'badge', 'recruiter', 'items', jsonb_build_array()),
      jsonb_build_object('at', 5, 'polys', 750, 'badge', 'ambassador',
        'items', jsonb_build_array('skin-social-explorer')),
      jsonb_build_object('at', 10, 'polys', 0, 'badge', 'elite_inviter',
        'items', jsonb_build_array('skin-team-legend', 'frame_referral_legend'))));
$$;

-- ---------- tablas ----------
create table public.referral_attributions (
  invitee_id uuid primary key references public.profiles (id) on delete cascade,
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  -- El código con el que llegó (copia del public_code del referente en ese momento).
  code text not null,
  status text not null default 'pending' check (status in ('pending', 'qualified', 'rejected')),
  created_at timestamptz not null default now(),
  qualified_at timestamptz,
  -- Sólo moderación (service_role): por qué se descartó una invitación.
  rejected_reason text,
  check (invitee_id <> referrer_id),
  check ((status = 'qualified') = (qualified_at is not null))
);

create index referral_attributions_referrer_idx
  on public.referral_attributions (referrer_id, status);

/** Historial de premios: una fila por (referente, hito). La PK hace imposible entregarlo dos veces. */
create table public.referral_rewards (
  user_id uuid not null references public.profiles (id) on delete cascade,
  milestone smallint not null check (milestone in (3, 5, 10)),
  polys integer not null default 0 check (polys >= 0),
  granted_at timestamptz not null default now(),
  primary key (user_id, milestone)
);

/** Insignias del perfil. Por ahora sólo las de invitaciones (Plus se calcula, no se guarda). */
create table public.user_badges (
  user_id uuid not null references public.profiles (id) on delete cascade,
  badge_id text not null check (badge_id in ('recruiter', 'ambassador', 'elite_inviter')),
  source text not null check (source in ('referral')),
  granted_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.referral_attributions enable row level security;
alter table public.referral_rewards enable row level security;
alter table public.user_badges enable row level security;
revoke all on public.referral_attributions, public.referral_rewards, public.user_badges
  from anon, authenticated;
-- Nadie lee las atribuciones directo (tienen ids de otros usuarios): sólo por get_referral_status.
grant select on public.referral_rewards, public.user_badges to authenticated;
create policy "referral rewards readable by owner" on public.referral_rewards
  for select to authenticated using (user_id = (select auth.uid()));
create policy "badges readable by owner" on public.user_badges
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- condiciones del invitado ----------
/** Qué cumplió el invitado: {email_verified, onboarded, activity}. */
create or replace function public.referral_invitee_state(p_invitee uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  verified boolean;
  onboarded boolean;
  active boolean;
begin
  select u.email_confirmed_at is not null into verified from auth.users u where u.id = p_invitee;
  select p.onboarding_completed_at is not null and p.username is not null into onboarded
  from public.profiles p where p.id = p_invitee;
  active := exists (select 1 from public.learning_sessions s where s.user_id = p_invitee)
    or exists (select 1 from public.user_daily_activity d
               where d.user_id = p_invitee and d.sessions_completed > 0);
  return jsonb_build_object(
    'email_verified', coalesce(verified, false),
    'onboarded', coalesce(onboarded, false),
    'activity', active);
end;
$$;

/** El siguiente paso que le falta al invitado (o null si ya cumple todo). */
create or replace function public.referral_missing_step(p_state jsonb)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when not (p_state ->> 'email_verified')::boolean then 'verify_email'
    when not (p_state ->> 'onboarded')::boolean then 'onboarding'
    when not (p_state ->> 'activity')::boolean then 'first_activity'
  end
$$;

-- ---------- validar y premiar ----------
/**
 * Reevalúa las invitaciones pendientes de p_referrer y entrega los hitos alcanzados que falten.
 * Idempotente: llamarla mil veces entrega cada premio una sola vez. Devuelve los hitos entregados
 * en esta llamada.
 */
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
    insert into public.referral_rewards (user_id, milestone, polys)
    values (p_referrer, (m ->> 'at')::smallint, (m ->> 'polys')::int)
    on conflict do nothing;
    get diagnostics inserted = row_count;
    continue when inserted = 0;

    if (m ->> 'polys')::int > 0 then
      perform public.poly_credit(p_referrer, (m ->> 'polys')::int, 'referral',
        'milestone:' || (m ->> 'at'));
    end if;
    insert into public.user_badges (user_id, badge_id, source)
    values (p_referrer, m ->> 'badge', 'referral') on conflict do nothing;
    for item in select jsonb_array_elements_text(m -> 'items') loop
      insert into public.user_cosmetics (user_id, item_id, source)
      values (p_referrer, item, 'referral') on conflict do nothing;
    end loop;
    granted := granted || jsonb_build_object('milestone', (m ->> 'at')::int,
      'polys', (m ->> 'polys')::int, 'badge', m ->> 'badge', 'items', m -> 'items');
  end loop;
  return granted;
end;
$$;

-- ---------- usar un código ----------
/** Normaliza 'pg-abc123', 'ABC123' o 'PG-ABC123' a 'PG-ABC123' (null si no tiene forma de código). */
create or replace function public.normalize_invite_code(p_code text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when upper(btrim(coalesce(p_code, ''))) ~ '^PG-[A-Z0-9]{6}$' then upper(btrim(p_code))
    when upper(btrim(coalesce(p_code, ''))) ~ '^[A-Z0-9]{6}$' then 'PG-' || upper(btrim(p_code))
  end
$$;

/**
 * El usuario nuevo se atribuye a quien lo invitó. Una sola vez y para siempre. Errores:
 * invalid_code, self_referral, already_attributed, attribution_window_closed, referral_not_eligible.
 * Devuelve {referrer_username, status}.
 */
create or replace function public.claim_referral(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  code text := public.normalize_invite_code(p_code);
  me public.profiles;
  referrer public.profiles;
  days integer := (public.referral_config() ->> 'attributionWindowDays')::int;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if code is null then
    raise exception 'invalid_code' using errcode = '22023';
  end if;
  select * into referrer from public.profiles where public_code = code;
  if not found or referrer.username is null or referrer.onboarding_completed_at is null then
    raise exception 'invalid_code' using errcode = '22023';
  end if;
  if referrer.id = uid then
    raise exception 'self_referral' using errcode = '22023';
  end if;
  select * into me from public.profiles where id = uid;
  if exists (select 1 from public.referral_attributions where invitee_id = uid) then
    raise exception 'already_attributed' using errcode = '22023';
  end if;
  if me.created_at < now() - make_interval(days => days) then
    raise exception 'attribution_window_closed' using errcode = '22023';
  end if;
  -- El referente tiene que existir desde antes: dos cuentas viejas no pueden invitarse entre sí.
  if referrer.created_at >= me.created_at then
    raise exception 'referral_not_eligible' using errcode = '22023';
  end if;

  begin
    insert into public.referral_attributions (invitee_id, referrer_id, code)
    values (uid, referrer.id, code);
  exception when unique_violation then
    raise exception 'already_attributed' using errcode = '22023';
  end;

  perform public.refresh_referrals(referrer.id);
  return jsonb_build_object(
    'referrer_username', referrer.username,
    'status', (select status from public.referral_attributions where invitee_id = uid));
end;
$$;

/** Lado del invitado: si su invitación está pendiente, la reevalúa (y premia al referente). */
create or replace function public.sync_referral()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  a public.referral_attributions;
  me public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into a from public.referral_attributions where invitee_id = uid;
  if found and a.status = 'pending' then
    perform public.refresh_referrals(a.referrer_id);
    select * into a from public.referral_attributions where invitee_id = uid;
  end if;
  select * into me from public.profiles where id = uid;
  return jsonb_build_object(
    'attributed', a.invitee_id is not null,
    'status', a.status,
    'referrer_username', (select username from public.profiles where id = a.referrer_id),
    -- Puede cargar un código si todavía no tiene y su cuenta es nueva.
    'can_claim', a.invitee_id is null and me.created_at >= now() - make_interval(
      days => (public.referral_config() ->> 'attributionWindowDays')::int));
end;
$$;

-- ---------- pantalla de invitaciones ----------
/**
 * Todo lo de la pantalla de invitaciones, ya reevaluado: código, contadores, hitos y la lista de
 * invitados (sólo usuario público y estado; nada de emails).
 */
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

-- ---------- insignias visibles ----------
/** Distintivos de un perfil (propio o ajeno): Plus activo e insignias ganadas. */
create or replace function public.get_profile_flair(p_user_id uuid)
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
  return jsonb_build_object(
    'plus', public.has_plus(p_user_id),
    'badges', (select coalesce(jsonb_agg(b.badge_id order by b.granted_at), '[]'::jsonb)
               from public.user_badges b where b.user_id = p_user_id));
end;
$$;

-- ---------- permisos ----------
revoke all on function public.referral_config() from public, anon;
grant execute on function public.referral_config() to authenticated;
revoke all on function public.referral_invitee_state(uuid) from public, anon, authenticated;
revoke all on function public.referral_missing_step(jsonb) from public, anon, authenticated;
revoke all on function public.refresh_referrals(uuid) from public, anon, authenticated;
revoke all on function public.normalize_invite_code(text) from public, anon, authenticated;
revoke all on function public.claim_referral(text) from public, anon;
grant execute on function public.claim_referral(text) to authenticated;
revoke all on function public.sync_referral() from public, anon;
grant execute on function public.sync_referral() to authenticated;
revoke all on function public.get_referral_status() from public, anon;
grant execute on function public.get_referral_status() to authenticated;
revoke all on function public.get_profile_flair(uuid) from public, anon;
grant execute on function public.get_profile_flair(uuid) to authenticated;

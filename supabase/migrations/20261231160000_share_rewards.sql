-- Premio por compartir un logro como tarjeta (shared/share.ts, src/features/share).
--
-- La app llama claim_share_reward(p_kind, p_ref) después de que el usuario compartió la tarjeta de
-- un logro. La base:
--   · valida que el ref tenga la forma de su tipo (rank:<tier>, streak:<días>, level:<idioma>:<nivel>);
--   · valida que el logro sea REAL con sus propios datos (nunca con lo que manda la app):
--       rank   → algún rating_after de partida ranked (cualquier temporada) ≥ umbral del tier
--                (umbrales = TIERS de shared/ranking.ts, igual que poly_earnings; Bronce no cuenta);
--       streak → el día es un hito (isStreakShareMilestone) y la mejor racha de la vida lo alcanza
--                (achievement_metrics.best_streak_days, la misma de los hitos de racha);
--       level  → al menos 12 unidades publicadas de ese idioma y nivel con todas sus lecciones
--                publicadas terminadas (PLANNED_UNITS_PER_LEVEL; el cliente pide además la ruta entera);
--   · paga share_reward_polys() (20) una sola vez por (usuario, 'share', ref) con poly_credit.
-- Devuelve {balance, granted} como finish_tutorial, para el aviso de «+20 Polys».
--
-- Sólo agrega: el motivo 'share' en el check de poly_transactions (conservando los motivos que ya
-- tenga la base, aunque alguno se haya agregado fuera del historial), share_reward_polys() y
-- claim_share_reward(). No toca poly_config ni sync_polys.
--
-- Rollback:
--   drop function if exists public.claim_share_reward(text, text);
--   drop function if exists public.share_reward_polys();
--   (las poly_transactions con reason 'share' quedan como historial; para sacar 'share' del check
--    hay que borrarlas primero)

-- ---------- nuevo motivo de Polys (sin perder los que ya existan) ----------
do $migration$
declare
  v_def text;
  v_vals text[];
begin
  select pg_get_constraintdef(c.oid) into v_def
  from pg_constraint c
  where c.conname = 'poly_transactions_reason_check'
    and c.conrelid = 'public.poly_transactions'::regclass;
  if v_def is null then
    raise exception 'poly_transactions_reason_check no existe';
  end if;
  -- Ya aplicada (o 'share' agregado a mano): nada que hacer.
  if v_def ~ '\mshare\M' then
    return;
  end if;
  -- Dos formas posibles: ARRAY['welcome'::text, …] (check con IN) o '{welcome,…}'::text[].
  select array_agg(m[1] order by m[1]) into v_vals
  from regexp_matches(v_def, '''([a-z_]+)''::text', 'g') m;
  if v_vals is null then
    v_vals := string_to_array((regexp_match(v_def, '\{([a-z_,]+)\}'))[1], ',');
  end if;
  if v_vals is null or cardinality(v_vals) < 10 then
    raise exception 'poly_transactions_reason_check: no se pudieron leer los motivos (%)', v_def;
  end if;
  alter table public.poly_transactions drop constraint poly_transactions_reason_check;
  execute format(
    'alter table public.poly_transactions add constraint poly_transactions_reason_check check (reason = any (%L::text[]))',
    v_vals || array['share']);
end;
$migration$;

-- ---------- monto (espejo de SHARE_REWARD_POLYS en shared/share.ts; un test los compara) ----------
create or replace function public.share_reward_polys()
returns integer
language sql
immutable
set search_path = ''
as $$ select 20 $$;

-- ---------- premio por compartir ----------
create or replace function public.claim_share_reward(p_kind text, p_ref text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  m text[];
  days integer;
  ok boolean := false;
  got integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if p_kind = 'rank' then
    m := regexp_match(coalesce(p_ref, ''), '^rank:([a-z]+)$');
    if m is null then
      raise exception 'invalid_share' using errcode = '22023';
    end if;
    select exists (
      select 1
      from (values ('silver', 400), ('gold', 700), ('platinum', 1000), ('emerald', 1300),
                   ('diamond', 1600), ('master', 1900), ('grandmaster', 2200)) as t (tier, min_rating)
      where t.tier = m[1]
        and (select max(h.rating_after) from public.rating_history h
             where h.user_id = uid and h.reason = 'battle') >= t.min_rating
    ) into ok;

  elsif p_kind = 'streak' then
    m := regexp_match(coalesce(p_ref, ''), '^streak:([0-9]{1,5})$');
    if m is null then
      raise exception 'invalid_share' using errcode = '22023';
    end if;
    days := m[1]::int;
    ok := (days in (7, 14, 30, 50, 100, 150, 200, 250, 300, 365)
           or (days > 365 and days % 100 = 0))
      and coalesce((public.achievement_metrics(uid) ->> 'best_streak_days')::int, 0) >= days;

  elsif p_kind = 'level' then
    m := regexp_match(coalesce(p_ref, ''), '^level:([a-z]{2,3}):([A-C][12])$');
    if m is null then
      raise exception 'invalid_share' using errcode = '22023';
    end if;
    select count(*) >= 12 into ok
    from (
      select u.id
      from public.curriculum_units u
      join public.lessons l on l.unit_id = u.id and l.is_published
      left join public.user_lesson_progress p on p.lesson_id = l.id and p.user_id = uid
      where u.language_code = m[1] and u.level = m[2] and u.is_published
      group by u.id
      having bool_and(coalesce(p.times_completed, 0) > 0)
    ) done;

  else
    raise exception 'invalid_share' using errcode = '22023';
  end if;

  if not ok then
    raise exception 'not_achieved' using errcode = 'P0001';
  end if;

  got := public.poly_credit(uid, public.share_reward_polys(), 'share', p_ref);
  return jsonb_build_object(
    'balance', coalesce((select balance from public.poly_wallets where user_id = uid), 0),
    'granted', case
      when got > 0 then jsonb_build_array(
        jsonb_build_object('reason', 'share', 'ref', p_ref, 'amount', got))
      else '[]'::jsonb
    end);
end;
$$;
revoke all on function public.claim_share_reward(text, text) from public, anon;
grant execute on function public.claim_share_reward(text, text) to authenticated;
revoke all on function public.share_reward_polys() from public, anon;
grant execute on function public.share_reward_polys() to authenticated;

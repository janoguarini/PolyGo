-- =====================================================================
-- Personalización del perfil v2: skins (avatares), marcos y fondos con arte nuevo, marco de rango
-- (ELO) y exclusivos de Plus.
--
-- ESTADO: PREPARADA, NO APLICADA. No ejecutar en producción sin revisión (ver
-- docs/PROFILE_CUSTOMIZATION.md, sección "Plan de aplicación").
--
-- Catálogo: shared/cosmetics.ts (cosmetic_items lo replica; supabase/tests/shop.test.mjs compara
-- ambos lados).
--
-- Qué cambia:
--   * cosmetic_items admite skins (kind = 'skin'), las rarezas nuevas (free, mythic, exclusive,
--     limited) y los orígenes nuevos (free, plus, referral, event, rank). Los legendarios ahora
--     pueden venderse por Polys (la especificación v2 los pone a 1.100–1.500).
--   * is_available = el arte está aprobado y en la app; sin arte no se vende ni se equipa.
--   * is_retired = catálogo viejo: no se vende ni se muestra, pero quien lo tiene lo conserva y lo
--     puede seguir usando (nunca se borra una compra).
--   * Las skins viven en profiles.avatar_id ('skin-<nombre>'), que ya viaja en todos los payloads
--     (perfil, clasificación, amigos, servidor de partidas): no hace falta tocar ninguna RPC de
--     Ranked. Un trigger impide ponerse una skin que no es tuya (avatar_id es editable por la app).
--   * frame_rank: el marco competitivo. No se compra; se equipa si estás posicionado (ganaste una
--     ranked en tu idioma) y la app lo dibuja con el tier que corresponde a tu ELO real. Nunca se
--     puede mostrar un rango que no tenés: el tier sale del rating, no de una elección.
--   * Exclusivos de Plus: se equipan sólo con Plus activo (has_plus). Si Plus vence, el ítem pasa a
--     profiles.suspended_cosmetics (no se borra nada) y vuelve solo al renovar.
-- =====================================================================

-- ---------- catálogo: tipos, rarezas y orígenes nuevos ----------
-- Los CHECK originales no tienen nombre propio (dos son de tabla): se reemplazan todos por CHECK con
-- nombre, que ya no hace falta adivinar en el futuro.
do $drop$
declare
  c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.cosmetic_items'::regclass and contype = 'c'
  loop
    execute format('alter table public.cosmetic_items drop constraint %I', c.conname);
  end loop;
  for c in
    select conname from pg_constraint
    where conrelid = 'public.user_cosmetics'::regclass and contype = 'c'
  loop
    execute format('alter table public.user_cosmetics drop constraint %I', c.conname);
  end loop;
end
$drop$;

alter table public.cosmetic_items
  add column is_available boolean not null default true,
  add column is_retired boolean not null default false;

alter table public.cosmetic_items
  add constraint cosmetic_items_kind_check check (kind in ('skin', 'frame', 'background')),
  add constraint cosmetic_items_rarity_check check (rarity in
    ('free', 'common', 'rare', 'epic', 'legendary', 'mythic', 'exclusive', 'limited')),
  add constraint cosmetic_items_source_check check (source in
    ('free', 'polys', 'season', 'premium', 'plus', 'referral', 'event', 'rank')),
  -- Sólo lo que sale por Polys tiene precio.
  add constraint cosmetic_items_price_check check (
    (price is not null) = (source = 'polys') and (price is null or price > 0)),
  -- Lo exclusivo (Plus, invitaciones) jamás se vende.
  add constraint cosmetic_items_exclusive_check check (
    (rarity = 'exclusive') = (source in ('plus', 'referral'))),
  -- Gratis: para todos (free) o ganado compitiendo (rank, el marco de rango).
  add constraint cosmetic_items_free_check check ((rarity = 'free') = (source in ('free', 'rank'))),
  -- Las skins son valores de profiles.avatar_id.
  add constraint cosmetic_items_skin_id_check check ((kind = 'skin') = (id like 'skin-%'));

alter table public.user_cosmetics
  add constraint user_cosmetics_source_check check (source in
    ('polys', 'season', 'premium', 'gift', 'referral', 'event'));

-- ---------- catálogo v2 ----------
-- Se retira el catálogo dibujado en código. Bosque, Galaxia y Neón conservan el id (mismo producto
-- con arte nuevo): quien ya los tenía los sigue teniendo.
update public.cosmetic_items set is_retired = true
where id in ('frame_mint', 'frame_coral', 'frame_sky', 'frame_sun', 'frame_sunset', 'frame_ocean',
  'frame_aurora', 'frame_galaxy', 'frame_fire', 'frame_crown', 'frame_legend', 'frame_founder',
  'bg_ocean', 'bg_wine', 'bg_sunset', 'bg_gold');

update public.cosmetic_items set rarity = 'common', price = 200 where id = 'bg_forest';
update public.cosmetic_items set rarity = 'epic', price = 650 where id = 'bg_neon';
update public.cosmetic_items set rarity = 'legendary', price = 1400 where id = 'bg_galaxy';

insert into public.cosmetic_items (id, kind, rarity, price, source, position, is_available) values
  -- skins
  ('skin-classic', 'skin', 'free', null, 'free', 1, true),
  ('skin-ninja', 'skin', 'common', 250, 'polys', 2, true),
  ('skin-explorer', 'skin', 'common', 250, 'polys', 3, true),
  ('skin-academic', 'skin', 'rare', 500, 'polys', 4, true),
  ('skin-samurai', 'skin', 'epic', 850, 'polys', 5, false),
  ('skin-cyber', 'skin', 'epic', 850, 'polys', 6, true),
  ('skin-guardian', 'skin', 'legendary', 1300, 'polys', 7, false),
  ('skin-omega', 'skin', 'mythic', 2000, 'polys', 8, false),
  ('skin-social-explorer', 'skin', 'exclusive', null, 'referral', 9, false),
  ('skin-team-legend', 'skin', 'exclusive', null, 'referral', 10, false),
  -- marcos
  ('frame_basic', 'frame', 'free', null, 'free', 11, true),
  ('frame_leaf', 'frame', 'common', 150, 'polys', 12, true),
  ('frame_stellar', 'frame', 'common', 250, 'polys', 13, true),
  ('frame_crystal', 'frame', 'rare', 400, 'polys', 14, true),
  ('frame_elite', 'frame', 'epic', 700, 'polys', 15, true),
  ('frame_diamond', 'frame', 'legendary', 1100, 'polys', 16, false),
  ('frame_master', 'frame', 'legendary', 1500, 'polys', 17, true),
  ('frame_plus', 'frame', 'exclusive', null, 'plus', 18, true),
  ('frame_referral_legend', 'frame', 'exclusive', null, 'referral', 19, false),
  ('frame_event', 'frame', 'limited', null, 'event', 20, false),
  ('frame_rank', 'frame', 'free', null, 'rank', 21, true),
  -- fondos
  ('bg_solid', 'background', 'free', null, 'free', 22, true),
  ('bg_mountain', 'background', 'common', 150, 'polys', 23, true),
  ('bg_aurora', 'background', 'rare', 400, 'polys', 26, true),
  ('bg_space', 'background', 'epic', 850, 'polys', 28, true),
  ('bg_temple', 'background', 'legendary', 1100, 'polys', 29, false),
  ('bg_dimension', 'background', 'mythic', 2000, 'polys', 31, true);

update public.cosmetic_items set position = v.pos from (values
  ('bg_forest', 24), ('bg_neon', 27), ('bg_galaxy', 30),
  -- retirados, al final y en su orden original
  ('frame_mint', 40), ('frame_coral', 41), ('frame_sky', 42), ('frame_sun', 43),
  ('frame_sunset', 44), ('frame_ocean', 45), ('frame_aurora', 46), ('frame_galaxy', 47),
  ('frame_fire', 48), ('frame_crown', 49), ('frame_legend', 50), ('frame_founder', 51),
  ('bg_ocean', 52), ('bg_wine', 53), ('bg_sunset', 54), ('bg_gold', 55)
) as v (id, pos) where cosmetic_items.id = v.id;

-- ---------- skins en profiles.avatar_id ----------
-- Producción tiene profiles_avatar_check (20261206120000_avatar_animals); otras bases pueden tener
-- todavía los dos CHECK anteriores. Se reemplazan todos por uno que además acepta skins; que la skin
-- exista y sea tuya lo controla el trigger de abajo.
alter table public.profiles drop constraint if exists profiles_avatar_fox_check;
alter table public.profiles drop constraint if exists profiles_avatar_id_check;
alter table public.profiles drop constraint if exists profiles_avatar_check;
alter table public.profiles add constraint profiles_avatar_check check (
  avatar_id in (
    'bolt', 'crown', 'flame',
    'panda-violet', 'panda-yellow', 'panda-red',
    'dog-violet', 'dog-yellow', 'dog-red',
    'cat-violet', 'cat-yellow', 'cat-red',
    'lion-violet', 'lion-yellow', 'lion-red')
  or avatar_id ~ '^skin-[a-z0-9-]{1,40}$');

-- Exclusivos de Plus guardados mientras Plus no está activo: {"frame": "frame_plus", ...}.
alter table public.profiles
  add column suspended_cosmetics jsonb not null default '{}'::jsonb
    check (jsonb_typeof(suspended_cosmetics) = 'object');

-- ---------- ¿puede usarlo? ----------
/**
 * Si p_user puede ponerse p_item_id: sin arte aprobado, nadie; gratis, todos; marco de rango,
 * posicionado en su idioma; Plus, con Plus activo; el resto, si lo tiene (compra o premio).
 */
create or replace function public.cosmetic_unlocked(p_user uuid, p_item_id text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  item public.cosmetic_items;
begin
  select * into item from public.cosmetic_items where id = p_item_id;
  if not found or not item.is_available then
    return false;
  end if;
  return case item.source
    when 'free' then true
    when 'rank' then exists (
      select 1 from public.player_ratings r
      join public.profiles p on p.id = r.user_id and p.target_language = r.language_code
      where r.user_id = p_user and r.wins > 0)
    when 'plus' then public.has_plus(p_user)
    else exists (
      select 1 from public.user_cosmetics uc where uc.user_id = p_user and uc.item_id = item.id)
  end;
end;
$$;

/** Error claro de por qué no se puede usar (o null si se puede). */
create or replace function public.cosmetic_lock_reason(p_user uuid, p_item_id text)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  item public.cosmetic_items;
begin
  select * into item from public.cosmetic_items where id = p_item_id;
  if not found then
    return 'item_not_found';
  end if;
  if public.cosmetic_unlocked(p_user, p_item_id) then
    return null;
  end if;
  if not item.is_available then
    return 'item_unavailable';
  end if;
  return case item.source
    when 'plus' then 'plus_required'
    when 'rank' then 'rank_required'
    else 'item_not_owned'
  end;
end;
$$;

-- ---------- guardia de skins ----------
/** avatar_id es editable desde la app: una skin sólo entra si existe y es tuya. */
create or replace function public.profiles_guard_skin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reason text;
begin
  if new.avatar_id like 'skin-%'
     and (tg_op = 'INSERT' or new.avatar_id is distinct from old.avatar_id) then
    if not exists (select 1 from public.cosmetic_items i where i.id = new.avatar_id and i.kind = 'skin') then
      raise exception 'invalid_avatar' using errcode = '22023';
    end if;
    reason := public.cosmetic_lock_reason(new.id, new.avatar_id);
    if reason is not null then
      raise exception '%', reason using errcode = '22023';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_skin
  before insert or update of avatar_id on public.profiles
  for each row execute function public.profiles_guard_skin();

-- ---------- comprar ----------
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
  if item.price is null or item.is_retired or not item.is_available then
    raise exception 'item_not_for_sale' using errcode = '22023';
  end if;
  insert into public.user_cosmetics (user_id, item_id, source) values (uid, item.id, 'polys')
  on conflict do nothing;
  if not found then
    raise exception 'item_owned' using errcode = '22023';
  end if;
  -- Si no alcanza, poly_debit falla y la transacción entera (incluida la fila de arriba) se deshace.
  left_over := public.poly_debit(uid, item.price, 'shop_item', item.id);
  if item.kind = 'skin' then
    update public.profiles set avatar_id = item.id where id = uid;
  elsif item.kind = 'frame' then
    update public.profiles set frame_id = item.id where id = uid;
  else
    update public.profiles set background_id = item.id where id = uid;
  end if;
  return jsonb_build_object('balance', left_over, 'item_id', item.id);
end;
$$;

-- ---------- equipar ----------
/**
 * Se pone un ítem que puede usar (o se saca el marco o el fondo con p_item_id = null; una skin no
 * se "saca": se elige otro avatar). Errores: item_not_owned, plus_required, rank_required,
 * item_unavailable.
 */
create or replace function public.equip_cosmetic(p_kind text, p_item_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  reason text;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_kind not in ('skin', 'frame', 'background') then
    raise exception 'invalid_kind' using errcode = '22023';
  end if;
  if p_item_id is null and p_kind = 'skin' then
    raise exception 'invalid_item' using errcode = '22023';
  end if;
  if p_item_id is not null then
    if not exists (select 1 from public.cosmetic_items i where i.id = p_item_id and i.kind = p_kind) then
      raise exception 'item_not_owned' using errcode = '22023';
    end if;
    reason := public.cosmetic_lock_reason(uid, p_item_id);
    if reason is not null then
      raise exception '%', reason using errcode = '22023';
    end if;
  end if;
  -- Elegir algo a mano descarta lo que estaba guardado para ese lugar.
  if p_kind = 'skin' then
    update public.profiles set avatar_id = p_item_id,
      suspended_cosmetics = suspended_cosmetics - 'avatar' where id = uid;
  elsif p_kind = 'frame' then
    update public.profiles set frame_id = p_item_id,
      suspended_cosmetics = suspended_cosmetics - 'frame' where id = uid;
  else
    update public.profiles set background_id = p_item_id,
      suspended_cosmetics = suspended_cosmetics - 'background' where id = uid;
  end if;
end;
$$;

-- ---------- Plus: suspender y restaurar exclusivos ----------
/**
 * Sin Plus, lo exclusivo de Plus que tenga puesto pasa a suspended_cosmetics (no se borra nada: ni la
 * elección ni el historial). Con Plus de nuevo, vuelve a su lugar si ese lugar sigue libre.
 * Devuelve {suspended: [...], restored: [...]}.
 */
create or replace function public.reconcile_plus_cosmetics(p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  prof public.profiles;
  plus boolean := public.has_plus(p_user);
  suspended jsonb;
  done_s jsonb := '[]'::jsonb;
  done_r jsonb := '[]'::jsonb;
  slot text;
  current_id text;
  saved text;
begin
  select * into prof from public.profiles where id = p_user for update;
  if not found then
    return jsonb_build_object('suspended', done_s, 'restored', done_r);
  end if;
  suspended := prof.suspended_cosmetics;
  foreach slot in array array['avatar', 'frame', 'background'] loop
    current_id := case slot when 'avatar' then prof.avatar_id
                            when 'frame' then prof.frame_id
                            else prof.background_id end;
    saved := suspended ->> slot;
    if not plus and current_id is not null and exists (
         select 1 from public.cosmetic_items i where i.id = current_id and i.source = 'plus') then
      suspended := suspended || jsonb_build_object(slot, current_id);
      done_s := done_s || to_jsonb(current_id);
      if slot = 'avatar' then
        update public.profiles set avatar_id = 'bolt' where id = p_user;
      elsif slot = 'frame' then
        update public.profiles set frame_id = null where id = p_user;
      else
        update public.profiles set background_id = null where id = p_user;
      end if;
    elsif plus and saved is not null then
      -- Sólo si el lugar quedó como lo dejamos (no pisar algo que eligió después).
      if (slot = 'avatar' and current_id = 'bolt') or (slot <> 'avatar' and current_id is null) then
        if public.cosmetic_unlocked(p_user, saved) then
          if slot = 'avatar' then
            update public.profiles set avatar_id = saved where id = p_user;
          elsif slot = 'frame' then
            update public.profiles set frame_id = saved where id = p_user;
          else
            update public.profiles set background_id = saved where id = p_user;
          end if;
          done_r := done_r || to_jsonb(saved);
        end if;
      end if;
      suspended := suspended - slot;
    end if;
  end loop;
  update public.profiles set suspended_cosmetics = suspended where id = p_user;
  return jsonb_build_object('suspended', done_s, 'restored', done_r);
end;
$$;

/** La app la llama al abrir y al volver a primer plano (Plus puede vencer sin que pase nada más). */
create or replace function public.sync_cosmetics()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return public.reconcile_plus_cosmetics(auth.uid());
end;
$$;

/** Cada alta, renovación, reembolso o baja de Plus (webhook o a mano) se refleja al instante. */
create or replace function public.user_entitlements_reconcile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.reconcile_plus_cosmetics(coalesce(new.user_id, old.user_id));
  return null;
end;
$$;

create trigger user_entitlements_reconcile
  after insert or update or delete on public.user_entitlements
  for each row execute function public.user_entitlements_reconcile();

-- ---------- permisos ----------
revoke all on function public.cosmetic_unlocked(uuid, text) from public, anon, authenticated;
revoke all on function public.cosmetic_lock_reason(uuid, text) from public, anon, authenticated;
revoke all on function public.profiles_guard_skin() from public, anon, authenticated;
revoke all on function public.reconcile_plus_cosmetics(uuid) from public, anon, authenticated;
revoke all on function public.user_entitlements_reconcile() from public, anon, authenticated;
revoke all on function public.buy_cosmetic(text) from public, anon;
grant execute on function public.buy_cosmetic(text) to authenticated;
revoke all on function public.equip_cosmetic(text, text) from public, anon;
grant execute on function public.equip_cosmetic(text, text) to authenticated;
revoke all on function public.sync_cosmetics() from public, anon;
grant execute on function public.sync_cosmetics() to authenticated;

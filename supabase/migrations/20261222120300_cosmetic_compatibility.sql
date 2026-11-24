-- =====================================================================
-- Compatibilidad visual entre avatares (skins), marcos y fondos (Perfil 2.0).
--
-- ESTADO: PREPARADA, NO APLICADA. Requiere 20261222120000_profile_customization (skins). Ver
-- docs/PROFILE_XP_LEVELS.md, "Plan de aplicación". Rollback:
-- supabase/rollback/20261222120300_cosmetic_compatibility.down.sql.
--
-- Fuente única: shared/cosmeticCompatibility.ts (supabase/tests/cosmeticCompatibility.test.mjs
-- compara ambos lados).
--
-- Reglas (cosmetic_compatible):
--   1. Sólo se filtran los ítems TEMÁTICOS: source = 'polys' y no retirados. Lo gratuito, lo ganado
--      (rango, Plus, invitaciones, eventos, temporada) y lo retirado es universal.
--   2. Un avatar sin filas en cosmetic_compatibility (Clásico, zorros y animales básicos, foto,
--      skins sin arte) es neutro: combina con todo.
--   3. Una skin con filas sólo admite, de lo temático, lo que figura en ellas.
--
-- Cumplimiento (no depende de la app):
--   * Trigger profiles_guard_compat: elegir a mano un marco/fondo incompatible con el avatar falla
--     con 'cosmetic_incompatible'. Cambiar de avatar conserva el marco y el fondo si siguen siendo
--     compatibles; si no, vuelven al predeterminado (null). Nunca se borra una compra.
--   * buy_cosmetic: comprar sigue igual (precio, reglas y cobro sin cambios), pero sólo deja puesto
--     el ítem si es compatible con el avatar actual; si no, queda en el inventario. Devuelve además
--     {equipped}.
-- No cambia ids, precios, rarezas ni reglas de compra.
-- =====================================================================

create table public.cosmetic_compatibility (
  skin_id text not null references public.cosmetic_items (id) on delete cascade,
  item_id text not null references public.cosmetic_items (id) on delete cascade,
  primary key (skin_id, item_id),
  check (skin_id like 'skin-%'),
  check (item_id not like 'skin-%')
);

-- Catálogo: lo ve cualquiera (no tiene datos de usuarios).
alter table public.cosmetic_compatibility enable row level security;
revoke all on public.cosmetic_compatibility from anon, authenticated;
grant select on public.cosmetic_compatibility to authenticated;
create policy "compatibility readable" on public.cosmetic_compatibility
  for select to authenticated using (true);

insert into public.cosmetic_compatibility (skin_id, item_id) values
  ('skin-ninja', 'frame_leaf'), ('skin-ninja', 'frame_crystal'), ('skin-ninja', 'frame_elite'),
  ('skin-ninja', 'bg_forest'), ('skin-ninja', 'bg_mountain'), ('skin-ninja', 'bg_neon'),
  ('skin-ninja', 'bg_temple'),
  ('skin-explorer', 'frame_leaf'), ('skin-explorer', 'frame_stellar'),
  ('skin-explorer', 'frame_crystal'),
  ('skin-explorer', 'bg_mountain'), ('skin-explorer', 'bg_forest'), ('skin-explorer', 'bg_aurora'),
  ('skin-explorer', 'bg_dimension'),
  ('skin-academic', 'frame_leaf'), ('skin-academic', 'frame_stellar'),
  ('skin-academic', 'frame_master'),
  ('skin-academic', 'bg_aurora'), ('skin-academic', 'bg_space'), ('skin-academic', 'bg_galaxy'),
  ('skin-academic', 'bg_dimension'),
  ('skin-cyber', 'frame_stellar'), ('skin-cyber', 'frame_crystal'), ('skin-cyber', 'frame_elite'),
  ('skin-cyber', 'bg_neon'), ('skin-cyber', 'bg_space'), ('skin-cyber', 'bg_galaxy'),
  ('skin-cyber', 'bg_dimension');

-- ---------- ¿combinan? ----------
/** Si el marco/fondo p_item_id se puede usar con el avatar p_avatar_id (null = siempre). */
create or replace function public.cosmetic_compatible(p_avatar_id text, p_item_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when p_item_id is null then true
    -- No temático (gratis, ganado, retirado o desconocido): universal.
    when not exists (
      select 1 from public.cosmetic_items i
      where i.id = p_item_id and i.kind <> 'skin' and i.source = 'polys' and not i.is_retired
    ) then true
    -- Avatar neutro: sin lista.
    when not exists (
      select 1 from public.cosmetic_compatibility c where c.skin_id = p_avatar_id
    ) then true
    else exists (
      select 1 from public.cosmetic_compatibility c
      where c.skin_id = p_avatar_id and c.item_id = p_item_id
    )
  end;
$$;

-- ---------- guardia en profiles ----------
/**
 * Elegir un marco/fondo incompatible falla; cambiar de avatar mantiene lo que sigue siendo válido y
 * devuelve al predeterminado lo que no. Cubre cualquier camino (RPC, service_role, futuras RPC).
 */
create or replace function public.profiles_guard_compat()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  avatar_changed boolean := tg_op = 'INSERT' or new.avatar_id is distinct from old.avatar_id;
  frame_chosen boolean := tg_op = 'INSERT' or new.frame_id is distinct from old.frame_id;
  background_chosen boolean := tg_op = 'INSERT' or new.background_id is distinct from old.background_id;
begin
  if not public.cosmetic_compatible(new.avatar_id, new.frame_id) then
    if frame_chosen then
      raise exception 'cosmetic_incompatible' using errcode = '22023';
    elsif avatar_changed then
      new.frame_id := null;
    end if;
  end if;
  if not public.cosmetic_compatible(new.avatar_id, new.background_id) then
    if background_chosen then
      raise exception 'cosmetic_incompatible' using errcode = '22023';
    elsif avatar_changed then
      new.background_id := null;
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_compat
  before insert or update of avatar_id, frame_id, background_id on public.profiles
  for each row execute function public.profiles_guard_compat();

-- ---------- comprar ----------
/**
 * Igual que en 20261222120000_profile_customization (mismas validaciones, precio y cobro), salvo que
 * un marco/fondo sólo queda puesto si es compatible con el avatar actual. Devuelve
 * {balance, item_id, equipped}.
 */
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
  equip boolean := true;
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
    -- El trigger devuelve al predeterminado el marco/fondo que no combine con la skin nueva.
    update public.profiles set avatar_id = item.id where id = uid;
  else
    equip := public.cosmetic_compatible(
      (select p.avatar_id from public.profiles p where p.id = uid), item.id);
    if equip and item.kind = 'frame' then
      update public.profiles set frame_id = item.id where id = uid;
    elsif equip then
      update public.profiles set background_id = item.id where id = uid;
    end if;
  end if;
  return jsonb_build_object('balance', left_over, 'item_id', item.id, 'equipped', equip);
end;
$$;

revoke all on function public.cosmetic_compatible(text, text) from public, anon;
grant execute on function public.cosmetic_compatible(text, text) to authenticated;
revoke all on function public.profiles_guard_compat() from public, anon, authenticated;
revoke all on function public.buy_cosmetic(text) from public, anon;
grant execute on function public.buy_cosmetic(text) to authenticated;

-- =====================================================================
-- Reversión de supabase/migrations/20261222120300_cosmetic_compatibility.sql. NO es una migración:
-- se aplica a mano (como dueño) sólo si hiciera falta deshacer la compatibilidad de cosméticos.
--
-- 1. Quita el trigger y la función de guardia (vuelve a poder combinarse cualquier cosa).
-- 2. Restaura buy_cosmetic tal como queda en 20261222120000_profile_customization.sql (bloque copiado
--    literalmente de sus líneas 241–278).
-- 3. Borra la tabla de compatibilidad y la función cosmetic_compatible.
-- No se tocan compras, saldos ni lo que cada jugador tiene puesto.
-- =====================================================================

begin;

drop trigger if exists profiles_guard_compat on public.profiles;
drop function if exists public.profiles_guard_compat();

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

revoke all on function public.buy_cosmetic(text) from public, anon;
grant execute on function public.buy_cosmetic(text) to authenticated;

drop function if exists public.cosmetic_compatible(text, text);
drop table if exists public.cosmetic_compatibility;

commit;

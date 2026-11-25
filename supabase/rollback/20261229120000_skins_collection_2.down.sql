-- =====================================================================
-- Rollback de supabase/migrations/20261229120000_skins_collection_2.sql. NO EJECUTADO.
--
-- Quita las 5 skins de la colección 2 sin perder nada de nadie: si alguien ya las compró o las tiene
-- puestas, primero se devuelven los Polys pagados y el avatar vuelve al predeterminado ('bolt').
-- Revisar antes cuántos casos hay:
--   select item_id, count(*) from public.user_cosmetics
--   where item_id in ('skin-aztec','skin-dragon','skin-king','skin-titan','skin-diamond') group by 1;
-- =====================================================================

begin;

-- Devolver lo pagado (Diamante es de Plus: no se pagó). Mismo motivo que la compra ('shop_item'),
-- con referencia 'refund:<id>' para no chocar con la compra original.
insert into public.poly_transactions (user_id, amount, reason, ref)
select t.user_id, -t.amount, 'shop_item', 'refund:' || t.ref
from public.poly_transactions t
where t.reason = 'shop_item' and t.amount < 0
  and t.ref in ('skin-aztec', 'skin-dragon', 'skin-king', 'skin-titan')
on conflict (user_id, reason, ref) do nothing;

update public.poly_wallets w set balance = w.balance + r.total, updated_at = now()
from (
  select user_id, sum(-amount) as total from public.poly_transactions
  where reason = 'shop_item' and amount < 0
    and ref in ('skin-aztec', 'skin-dragon', 'skin-king', 'skin-titan')
  group by user_id
) r
where w.user_id = r.user_id;

update public.profiles set avatar_id = 'bolt'
where avatar_id in ('skin-aztec', 'skin-dragon', 'skin-king', 'skin-titan', 'skin-diamond');
update public.profiles
set suspended_cosmetics = suspended_cosmetics - 'avatar'
where suspended_cosmetics ->> 'avatar' in
  ('skin-aztec', 'skin-dragon', 'skin-king', 'skin-titan', 'skin-diamond');

delete from public.user_cosmetics
where item_id in ('skin-aztec', 'skin-dragon', 'skin-king', 'skin-titan', 'skin-diamond');
-- cosmetic_compatibility se borra en cascada.
delete from public.cosmetic_items
where id in ('skin-aztec', 'skin-dragon', 'skin-king', 'skin-titan', 'skin-diamond');

commit;

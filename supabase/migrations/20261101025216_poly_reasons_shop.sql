-- ---------- nuevos motivos del registro ----------
-- 'season' e 'iap' quedan reservados para premios de temporada y compras con plata real.
alter table public.poly_transactions drop constraint poly_transactions_reason_check;
alter table public.poly_transactions add constraint poly_transactions_reason_check
  check (reason in ('welcome', 'mission', 'chest', 'weekly', 'lesson_perfect', 'unit', 'ranked_win',
    'rank', 'streak', 'achievement', 'shop_freeze', 'shop_item', 'streak_repair', 'season', 'iap'));

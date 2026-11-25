-- =====================================================================
-- Skins de la colección 2: Azteca, Dragón, Rey, Titán y Diamante.
--
-- ESTADO: APLICADA en producción el 2026-11-25 (historial 141→142; registrada como versión
-- 20261125170736 por el MCP). Idempotente (on conflict do nothing): reaplicarla no cambia nada. Requiere 20261222120000_profile_customization y
-- 20261222120300_cosmetic_compatibility. Rollback:
-- supabase/rollback/20261229120000_skins_collection_2.down.sql.
--
-- Fuentes únicas: shared/cosmetics.ts (supabase/tests/shop.test.mjs) y
-- shared/cosmeticCompatibility.ts (supabase/tests/cosmeticCompatibility.test.mjs).
--
-- Sólo agrega filas: no cambia ids, precios ni reglas de lo que ya existe.
--   * Azteca (épica, 850), Dragón y Rey (legendarias, 1300) y Titán (mítica, 2000) se compran con
--     Polys por buy_cosmetic, como el resto.
--   * Diamante es exclusiva de PolyGo Plus (source 'plus', sin precio): cosmetic_unlocked la habilita
--     con Plus activo y, si Plus vence, sync de suspended_cosmetics la guarda y vuelve al renovar
--     (igual que frame_plus).
--   * Posiciones 32–36: después de los fondos y antes del catálogo retirado (40+).
-- Las builds anteriores no tienen el arte: ven estas skins como el avatar predeterminado
-- (src/design-system/skinImages.ts) y no las ofrecen hasta actualizar.
-- =====================================================================


insert into public.cosmetic_items (id, kind, rarity, price, source, position, is_available) values
  ('skin-aztec', 'skin', 'epic', 850, 'polys', 32, true),
  ('skin-dragon', 'skin', 'legendary', 1300, 'polys', 33, true),
  ('skin-king', 'skin', 'legendary', 1300, 'polys', 34, true),
  ('skin-titan', 'skin', 'mythic', 2000, 'polys', 35, true),
  ('skin-diamond', 'skin', 'exclusive', null, 'plus', 36, true)
on conflict (id) do nothing;

insert into public.cosmetic_compatibility (skin_id, item_id) values
  ('skin-aztec', 'frame_leaf'), ('skin-aztec', 'frame_elite'), ('skin-aztec', 'frame_master'),
  ('skin-aztec', 'bg_forest'), ('skin-aztec', 'bg_mountain'), ('skin-aztec', 'bg_aurora'),
  ('skin-aztec', 'bg_temple'),
  ('skin-dragon', 'frame_stellar'), ('skin-dragon', 'frame_crystal'), ('skin-dragon', 'frame_elite'),
  ('skin-dragon', 'bg_temple'), ('skin-dragon', 'bg_space'), ('skin-dragon', 'bg_galaxy'),
  ('skin-dragon', 'bg_forest'),
  ('skin-king', 'frame_stellar'), ('skin-king', 'frame_elite'), ('skin-king', 'frame_master'),
  ('skin-king', 'bg_aurora'), ('skin-king', 'bg_mountain'), ('skin-king', 'bg_galaxy'),
  ('skin-king', 'bg_dimension'),
  ('skin-titan', 'frame_crystal'), ('skin-titan', 'frame_elite'), ('skin-titan', 'frame_master'),
  ('skin-titan', 'bg_neon'), ('skin-titan', 'bg_space'), ('skin-titan', 'bg_galaxy'),
  ('skin-titan', 'bg_dimension'),
  ('skin-diamond', 'frame_stellar'), ('skin-diamond', 'frame_crystal'), ('skin-diamond', 'frame_elite'),
  ('skin-diamond', 'bg_aurora'), ('skin-diamond', 'bg_space'), ('skin-diamond', 'bg_galaxy'),
  ('skin-diamond', 'bg_dimension')
on conflict (skin_id, item_id) do nothing;


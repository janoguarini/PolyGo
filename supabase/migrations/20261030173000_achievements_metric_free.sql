-- Las métricas de logros dejan de estar fijadas por un CHECK: agregar una familia nueva no debería
-- requerir un paso manual. supabase/tests/profile.test.mjs verifica que cada logro activo use una
-- métrica que achievement_metrics() calcula.
-- Aplicada a mano en el SQL Editor (el conector MCP rechaza sentencias con DROP); no figura en
-- el historial remoto de migraciones.
alter table public.achievements drop constraint achievements_metric_check;

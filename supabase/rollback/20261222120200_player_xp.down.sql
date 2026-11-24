-- =====================================================================
-- Reversión de supabase/migrations/20261222120200_player_xp.sql. NO es una migración: se aplica a
-- mano (como dueño) sólo si hiciera falta deshacer el sistema de XP y niveles.
--
-- La migración es puramente aditiva (tablas y funciones nuevas; no reemplaza ni altera nada
-- existente), así que revertirla es borrar lo que creó. Se pierde el historial de XP y de niveles
-- alcanzados (no hay otro dato afectado: Polys, ELO, lecciones y partidas quedan intactos). Si se
-- quiere conservar, exportar antes:
--   copy public.xp_events to ... ; copy public.player_xp to ... ; copy public.player_level_ups to ...
--
-- Antes de ejecutarla, publicar una versión de la app que no llame a sync_xp, o aceptar que la app
-- degrade sola (la tarjeta de nivel se oculta cuando la RPC no existe: PGRST202).
-- =====================================================================

begin;

drop function if exists public.sync_xp();
drop function if exists public.xp_grant(uuid, text, text, date, integer, integer, text[]);
drop function if exists public.xp_progress(integer);
drop function if exists public.xp_level_need(integer);
drop function if exists public.xp_config();

drop table if exists public.player_level_ups;
drop table if exists public.xp_events;
drop table if exists public.player_xp;

commit;

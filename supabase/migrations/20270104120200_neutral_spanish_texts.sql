-- =====================================================================
-- Español neutro en textos de la base que ve el usuario y no salen de content/ ni de
-- shared/achievements.ts (docs/NEUTRAL_SPANISH.md). NO APLICADA EN PRODUCCIÓN.
--
-- 1. app_client_policy.message_es: el aviso de «actualizar la app» que la interfaz en español muestra
--    tal cual (src/features/compat/UpdateRequired.tsx). Sólo se cambia si sigue siendo el texto por
--    defecto que cargó 20261115120000_client_compatibility: si alguien lo personalizó en producción,
--    no se toca.
--
-- Fuera de esta migración, a propósito:
--   · ranked_legacy_guard (20261209120000): «actualizá la app» va en el HINT de la excepción
--     protocol_mismatch; la app no lo muestra (traduce el código) y esa función es parte del corte
--     del Ranked viejo, que no se toca sin autorización.
--   · Textos del panel de administración (20270101120000_superadmin_panel): sólo los ve el dueño.
--
-- Rollback: volver a poner el texto anterior con el mismo WHERE invertido.
-- =====================================================================

update public.app_client_policy
set message_es = 'Hay una versión nueva de PolyGo. Actualízala desde la tienda para seguir aprendiendo.'
where message_es = 'Hay una versión nueva de PolyGo. Actualizala desde la tienda para seguir aprendiendo.';

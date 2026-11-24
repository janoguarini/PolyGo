-- =====================================================================
-- Rollback de 20261203130000_enable_fr.sql: el francés vuelve a 'hidden'.
--
-- Efecto: nadie más puede elegir el francés (complete_onboarding y set_target_language devuelven
-- language_unavailable). NO borra ni cambia progreso, XP, repasos ni perfiles: quien ya lo eligió
-- conserva target_language = 'fr' y su avance; el contenido sigue publicado. Para ocultarlo también
-- en la app hace falta volver `status` a 'hidden' en shared/languages.ts (EAS Update o build).
-- Cambia una fila. Idempotente. No toca otros idiomas ni ranked_available.
-- =====================================================================

do $polygo_disable_fr$
begin
  if not exists (select 1 from public.languages where code = 'fr') then
    raise exception 'fr_disable: no existe la fila fr en public.languages';
  end if;

  update public.languages set content_status = 'hidden'
  where code = 'fr' and content_status <> 'hidden';

  if (select content_status from public.languages where code = 'fr') <> 'hidden' then
    raise exception 'fr_disable: el estado final no es el esperado';
  end if;
end
$polygo_disable_fr$;

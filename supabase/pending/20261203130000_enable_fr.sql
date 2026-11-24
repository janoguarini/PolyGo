-- =====================================================================
-- Activación del francés para todos los usuarios (docs/FR_A1_A2_INTEGRATION.md).
-- Requiere 20261202120000_fr_a1_a2.sql (carga) y 20261203120000_publish_fr_a1_a2.sql (publicación).
--
-- Cambia UNA fila: public.languages('fr').content_status pasa a 'available'. Con eso,
-- complete_onboarding y set_target_language aceptan 'fr' para cualquier cuenta, sin content_testers.
-- No toca ranked_available (el francés sigue fuera de Ranked), ni otros idiomas, contenido, esquema,
-- funciones, RLS ni datos de usuarios. Idempotente.
--
-- Rollback: supabase/rollback/20261203130000_enable_fr.down.sql (vuelve a 'hidden').
-- ESTADO: escrita y probada en PGlite. NO aplicada en producción.
-- Vive en supabase/pending/: moverla a supabase/migrations/ recién el día de habilitar.
-- =====================================================================

do $polygo_enable_fr$
declare
  v_lang public.languages;
  v_a1 int;
  v_a2 int;
  v_other int;
begin

select * into v_lang from public.languages where code = 'fr';
if not found then
  raise exception 'fr_enable: no existe la fila fr en public.languages';
end if;
if v_lang.ranked_available then
  raise exception 'fr_enable: ranked_available ya está en true; esta migración no decide Ranked';
end if;

-- El contenido completo tiene que estar publicado: A1 U1–U17 y A2 U1–U13, nada más.
select count(*) filter (where level = 'A1' and position between 1 and 17 and is_published),
       count(*) filter (where level = 'A2' and position between 1 and 13 and is_published),
       count(*) filter (where not (level = 'A1' and position between 1 and 17)
                          and not (level = 'A2' and position between 1 and 13))
  into v_a1, v_a2, v_other
from public.curriculum_units where language_code = 'fr';
if v_a1 <> 17 or v_a2 <> 13 or v_other <> 0 then
  raise exception 'fr_enable: se esperaban A1 17 y A2 13 unidades publicadas (y ninguna otra); hay A1 %, A2 %, otras %',
    v_a1, v_a2, v_other;
end if;

if (select count(*) from public.lessons l
      join public.curriculum_units u on u.id = l.unit_id
     where u.language_code = 'fr' and l.is_published) <> 300 then
  raise exception 'fr_enable: se esperaban 300 lecciones de francés publicadas';
end if;

if not exists (select 1 from public.lessons where id = 'fr-a1-u01-l01' and is_published)
   or not exists (select 1 from public.lessons where id = 'fr-a2-u01-l01' and is_published) then
  raise exception 'fr_enable: falta publicar la primera lección de A1 o de A2';
end if;

update public.languages set content_status = 'available'
where code = 'fr' and content_status <> 'available';

if (select content_status from public.languages where code = 'fr') <> 'available'
   or (select ranked_available from public.languages where code = 'fr') then
  raise exception 'fr_enable: el estado final no es el esperado';
end if;

end
$polygo_enable_fr$;

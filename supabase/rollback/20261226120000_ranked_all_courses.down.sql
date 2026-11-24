-- Reversión manual de 20261226120000_ranked_all_courses (no es una migración). Sin aplicar (la migración sí está en producción).
--
-- Vuelve a apagar Ranked en fr y es, y el español a 'soon'. No borra ratings, historial ni partidas:
-- quien ya jugó conserva su ELO y su historial (la app deja de ofrecer Ranked en esos idiomas porque
-- shared/languages.ts y languages.ranked_available vuelven a false; hace falta también revertir el
-- cliente). Se niega a volver el español a 'soon' si hay perfiles estudiándolo: dejaría a esos usuarios
-- en un idioma que la app muestra como «Próximamente».
begin;

do $$
begin
  if exists (select 1 from public.profiles where target_language = 'es') then
    raise exception 'rollback ranked_all_courses: hay perfiles con español como idioma actual';
  end if;
end;
$$;

update public.languages set ranked_available = false where code in ('fr', 'es');
update public.languages set content_status = 'soon' where code = 'es' and content_status = 'available';

-- Borrado de historial del schema_migrations: sólo con autorización (ver docs/RANKED_ALL_COURSES.md).
-- delete from supabase_migrations.schema_migrations where version = '20261226120000';

commit;

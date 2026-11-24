-- =====================================================================
-- Ranked en todos los cursos (francés y español) y español disponible. 2026-11-23. APLICADA en producción 2026-11-24 ~03:20Z (historial 137→138).
-- Vive en supabase/pending/ como 20261203130000_enable_fr: depende de las publicaciones de fr y es
-- (20261203120000_publish_fr_a1_a2 y 20261205120000_publish_es_a1_a2, ya aplicadas en producción).
--
-- Estado de producción antes de esta migración (lectura del 2026-11-23):
--   en / it / pt / zh: content_status 'available', ranked_available true.
--   fr:                 'available', ranked_available false (A1 17 + A2 13 unidades publicadas).
--   es:                 'soon',      ranked_available false (A1 17 + A2 12 unidades publicadas).
--
-- Qué hace (espejo de shared/languages.ts):
--   1. ranked_available = true en fr y es. El ELO ya es por idioma (player_ratings, PK user_id +
--      language_code), igual que el historial (rating_history), las partidas (battles.language_code) y
--      la cola del servidor de partidas (Matchmaker: sólo empareja el mismo idioma). Hoy cada idioma de
--      destino tiene un único curso (courses.is_default), así que «por idioma» = «por curso».
--   2. content_status = 'available' en es (sólo si estaba en 'soon'): el curso es-from-en se puede
--      empezar desde «Tus cursos». No cambia set_target_language ni ningún RPC.
--   3. Rating inicial (100, sin posicionar, igual que 20261104004214_ranked_all_languages) para quien
--      ya tiene fr o es como idioma actual o inscripto (user_courses). Los RPC que cambian de curso ya
--      lo crean solos cuando ranked_available es true; esto cubre a quien ya estaba adentro.
--
-- No toca ratings existentes, ni historial, ni partidas, ni progreso. Idempotente: reaplicarla no
-- cambia nada (los updates son condicionales y los inserts usan on conflict do nothing).
-- Rollback: supabase/rollback/20261226120000_ranked_all_courses.down.sql.
-- =====================================================================

-- ---------- 0. Guardas ----------
do $$
declare
  missing text;
begin
  -- Cada idioma que se habilita tiene que tener A1 y A2 publicados (si no, Ranked no tiene banco).
  select string_agg(l.code || ':' || lv, ', ') into missing
  from (values ('fr'), ('es')) as l (code)
  cross join (values ('A1'), ('A2')) as v (lv)
  where not exists (
    select 1 from public.curriculum_units u
    where u.language_code = l.code and u.level = v.lv and u.is_published
  );
  if missing is not null then
    raise exception 'ranked_all_courses: sin unidades publicadas en %', missing;
  end if;

  -- Banco mínimo de Word Rush: al menos 4 palabras publicadas distintas por idioma.
  select string_agg(l.code, ', ') into missing
  from (values ('fr'), ('es')) as l (code)
  where (select count(distinct lower(trim(w.text))) from public.words w
         where w.language_code = l.code and w.is_published) < 4;
  if missing is not null then
    raise exception 'ranked_all_courses: sin palabras publicadas suficientes en %', missing;
  end if;

  if not exists (select 1 from public.courses where code = 'es-from-en')
     or not exists (select 1 from public.courses where code = 'fr-from-es') then
    raise exception 'ranked_all_courses: falta el modelo de cursos (20261223120000_course_model)';
  end if;
end;
$$;

-- ---------- 1 y 2. Idiomas ----------
update public.languages set ranked_available = true
where code in ('fr', 'es') and not ranked_available;

update public.languages set content_status = 'available'
where code = 'es' and content_status = 'soon';

-- ---------- 3. Rating inicial de quien ya está en fr o es ----------
with candidates as (
  select p.id as user_id, p.target_language as language_code
  from public.profiles p
  where p.target_language in ('fr', 'es') and p.onboarding_completed_at is not null
  union
  select uc.user_id, c.target_language
  from public.user_courses uc
  join public.courses c on c.code = uc.course_code
  join public.profiles p on p.id = uc.user_id
  where c.target_language in ('fr', 'es') and p.onboarding_completed_at is not null
),
created as (
  insert into public.player_ratings (user_id, language_code)
  select user_id, language_code from candidates
  on conflict do nothing
  returning user_id, language_code
)
insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
select c.user_id, c.language_code, s.id, 'initial', 100, 100
from created c
left join public.seasons s on s.status = 'active';

-- ---------- 4. Comprobación ----------
do $$
begin
  if exists (select 1 from public.languages
             where code in ('en', 'fr', 'it', 'pt', 'zh', 'es') and not ranked_available) then
    raise exception 'ranked_all_courses: queda un idioma con curso sin Ranked';
  end if;
  if (select content_status from public.languages where code = 'es') <> 'available' then
    raise exception 'ranked_all_courses: el español no quedó disponible (estado inesperado)';
  end if;
end;
$$;

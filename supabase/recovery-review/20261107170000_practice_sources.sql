-- Orígenes de la práctica (arquitectura de datos rev. 8, §6.1, §6.2 y fase 1 de §18): qué hace cada
-- origen de sesión con el SRS, el progreso, la energía y la racha, qué clase de evidencia da y qué
-- recompensa cuenta. Es catálogo: cambiar la regla de un origen es un UPDATE, no una migración de
-- funciones (§6.1).
--
-- Filas: las siete de §6.1 cuyas columnas están todas definidas, copiadas de content/practice-sources.ts
-- (una prueba exige que coincidan). Quedan afuera, pendientes de decisión
-- (docs/LEARNING_CATALOG_PHASE1.md, §9):
--   - assessment, level_exam: «Progreso: según el caso»; placement: «puede desbloquear». No hay un valor
--     booleano para affects_lesson_progress.
--   - srs_review_legacy: «Selección: — (desconocida)»; selection_mode es obligatoria y forma parte de la
--     FK compuesta de §6.1.
--   - adaptive_review y focus_review (diseño de SRS v2, sin implementar): no son de esta fase.
--
-- G1 (§6.1): todo origen con evidence_class = 'assessment' tiene selection_mode = 'server' (CHECK).
-- Unique (id, selection_mode): destino de la FK compuesta (source, selection_mode) de
-- learning_sessions (fase 2). selection_mode, evidence_class y reward_kind usan CHECK, como
-- exercise_items.origin (excepción de docs/LEARNING_CATALOG_PHASE1.md, §3): su efecto lo fijan el
-- diseño (G1, G2) y las funciones de recompensas, no un INSERT.
--
-- Aditiva e idempotente. Nada la lee todavía: learning_sessions no cambia en esta fase. No toca el SRS
-- v1, Ranked (no es un origen, §14) ni la app. Sin permisos para anon ni authenticated.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/catalog.test.mjs). NO aplicada en producción.

create table if not exists public.practice_sources (
  id text primary key,
  selection_mode text not null check (selection_mode in ('fixed', 'client_proposed', 'server')),
  affects_srs boolean not null,
  affects_lesson_progress boolean not null,
  consumes_energy boolean not null,
  counts_for_streak boolean not null,
  evidence_class text not null check (evidence_class in ('learning', 'retrieval', 'assessment')),
  reward_kind text check (reward_kind in ('lesson', 'review')),
  -- Sólo informativa: nunca cambia cómo se registra (§2, §6.1).
  plus_feature text,
  active boolean not null,
  constraint practice_sources_id_selection_mode_key unique (id, selection_mode),
  constraint practice_sources_g1_check
    check (evidence_class <> 'assessment' or selection_mode = 'server'),
  constraint practice_sources_id_check check (id ~ '^[a-z]+(_[a-z]+)*$')
);

-- §6.1. «—» en la tabla = no. reward_kind: lesson y consolidation → lesson; los cinco de repaso y
-- práctica → review.
insert into public.practice_sources (id, selection_mode, affects_srs, affects_lesson_progress,
  consumes_energy, counts_for_streak, evidence_class, reward_kind, plus_feature, active) values
  ('lesson',            'fixed',           true,  true,  true,  true, 'learning',  'lesson', null,           true),
  ('consolidation',     'fixed',           true,  true,  true,  true, 'retrieval', 'lesson', null,           true),
  ('srs_review',        'client_proposed', true,  false, false, true, 'retrieval', 'review', null,           true),
  ('smart_review',      'client_proposed', true,  false, false, true, 'retrieval', 'review', 'smart_review', true),
  ('topic_review',      'client_proposed', true,  false, false, true, 'retrieval', 'review', 'topic_review', true),
  ('free_practice',     'client_proposed', false, false, false, true, 'retrieval', 'review', null,           true),
  ('mistakes_practice', 'client_proposed', false, false, false, true, 'retrieval', 'review', null,           true)
on conflict (id) do nothing;

alter table public.practice_sources enable row level security;
revoke all on public.practice_sources from anon, authenticated;

-- Canal de entrada de los ítems como tabla de referencia (arquitectura de datos rev. 8, §4.1 y §4.2).
-- Tercera pieza de la fase 1, después de 20261107130000_learning_items.sql y sus backfills.
--
-- §4.1: «los valores cerrados van en tablas de referencia con FK, no en CHECK: así se agregan
-- valores con un INSERT». `input_modality` es un catálogo cerrado que crece con los tipos de
-- ejercicio (el Mastery Engine usa el par tipo × input_modality como contexto de transferencia), así
-- que pasa a `ref_input_modalities` con FK. `origin` y `role` quedan con CHECK como excepción
-- documentada (docs/LEARNING_CATALOG_PHASE1.md, §3).
--
-- Aditiva e idempotente: crea la tabla, carga los cuatro valores de §4.2 sin cambiar su significado
-- y agrega la FK sólo si no existe. Todas las filas actuales cumplen la FK. No borra ni modifica
-- filas, no toca el SRS v1 ni ninguna función de la app. Sin permisos para anon ni authenticated.
--
-- La FK es la única validación de la columna: el CHECK redundante que tenía 20261107130000 se quitó de
-- esa migración antes de aplicarla (no estaba aplicada en producción; decisión del 2026-11-07,
-- docs/LEARNING_CATALOG_PHASE1.md §3). Agregar un canal es un INSERT en ref_input_modalities.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/items.test.mjs). NO aplicada en producción.

create table if not exists public.ref_input_modalities (
  id text primary key
);

-- §4.2: «El canal de entrada (`input_modality`: `text`, `audio`, `image`, `audio_text`)».
insert into public.ref_input_modalities (id) values
  ('text'), ('audio'), ('image'), ('audio_text')
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercise_items'::regclass
      and conname = 'exercise_items_input_modality_fkey'
  ) then
    alter table public.exercise_items
      add constraint exercise_items_input_modality_fkey
      foreign key (input_modality) references public.ref_input_modalities (id);
  end if;
end;
$$;

alter table public.ref_input_modalities enable row level security;
revoke all on public.ref_input_modalities from anon, authenticated;

-- Personas ficticias del catálogo (arquitectura de datos rev. 8, §13.1–§13.2 y fase 1 de §18).
-- Los ejercicios de formulario citan una persona y la respuesta esperada sale de ella; así ningún
-- ejercicio junta datos reales (P4).
--
-- Sólo el esquema y sus validaciones de privacidad. Las filas salen de content/personas.ts por los
-- generadores de contenido (scripts/catalog-sql.ts), y hoy no hay ninguna: no se inventan personas
-- (docs/LEARNING_CATALOG_PHASE1.md, §4 y §10). Las validaciones que necesitan listas externas
-- (usuarios de prueba, figuras públicas) viven en las pruebas de content/ (content/__tests__/phase1.test.ts).
--
-- Una persona es inmutable una vez cargada: las versiones que la citan copian sus datos en el texto, y
-- cambiarla haría que la persona y lo mostrado dejen de coincidir. El generador aborta si cambia.
--
-- Aditiva e idempotente. No toca tablas existentes, el SRS v1, Ranked ni la app. Sin permisos para anon
-- ni authenticated.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/catalog.test.mjs). NO aplicada en producción.

create table if not exists public.content_personas (
  -- `<idioma>.persona.<slug>` (p. ej. `en.persona.lucia-gomez`).
  id text primary key,
  language_code text not null references public.languages (code),
  display_name text not null check (length(btrim(display_name)) > 0),
  age smallint not null check (age > 0),
  city text not null check (length(btrim(city)) > 0),
  country text not null check (length(btrim(country)) > 0),
  phone text not null check (length(btrim(phone)) > 0),
  -- Dominio reservado example.com (§13.2).
  email text not null check (email ~ '^[a-z0-9._%+-]+@example\.com$'),
  -- §13.2: «fictional = true (CHECK)».
  fictional boolean not null default true check (fictional),
  constraint content_personas_id_language_code_key unique (id, language_code),
  constraint content_personas_id_check
    check (id ~ '^[a-z]{2,3}\.persona\.[a-z0-9]+(-[a-z0-9]+)*$'
           and split_part(id, '.', 1) = language_code),
  constraint content_personas_email_key unique (email),
  constraint content_personas_phone_key unique (phone)
);

alter table public.content_personas enable row level security;
revoke all on public.content_personas from anon, authenticated;

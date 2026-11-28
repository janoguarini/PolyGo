-- Rollback de supabase/migrations/20270113120000_waitlist.sql: quita la lista de espera.
-- ATENCIÓN: borra la tabla con todos los emails inscriptos. Exportarla antes (docs/WAITLIST.md).
-- LOCAL: no aplicado.

drop function if exists public.waitlist_join(text, text, text, text, text, text, integer);
drop function if exists public.waitlist_count();
drop table if exists public.waitlist_signups;

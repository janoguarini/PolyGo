-- =====================================================================
-- Polygo · Migración 0002 · Correcciones de los advisors de Supabase
-- =====================================================================

-- ---------- RLS: evaluar auth.uid() una vez por consulta, no por fila ----------
alter policy "profiles updatable by owner" on public.profiles
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

alter policy "settings readable by owner" on public.user_settings
  using (user_id = (select auth.uid()));

alter policy "settings updatable by owner" on public.user_settings
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

alter policy "rating history readable by owner" on public.rating_history
  using (user_id = (select auth.uid()));

-- ---------- índices para foreign keys ----------
create index profiles_target_language_idx on public.profiles (target_language);
create index rating_history_language_idx on public.rating_history (language_code);
create index rating_history_season_idx on public.rating_history (season_id);

-- ---------- is_username_available no necesita privilegios elevados ----------
-- Los usuarios autenticados ya pueden leer profiles por RLS.
alter function public.is_username_available(text) security invoker;

-- complete_onboarding sigue siendo SECURITY DEFINER a propósito: el cliente no tiene
-- privilegio UPDATE sobre username, y la función valida sesión, idioma y unicidad.

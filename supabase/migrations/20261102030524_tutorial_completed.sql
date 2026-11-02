-- Tutorial guiado sobre las pantallas reales: se guarda por cuenta (no por dispositivo).
-- Pendiente = onboarding completo y tutorial_completed_at nulo.

alter table public.profiles add column if not exists tutorial_completed_at timestamptz;

-- Las cuentas que ya existían no lo ven.
update public.profiles
set tutorial_completed_at = onboarding_completed_at
where onboarding_completed_at is not null and tutorial_completed_at is null;

create or replace function public.complete_tutorial()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  update public.profiles
  set tutorial_completed_at = coalesce(tutorial_completed_at, now())
  where id = auth.uid();
end;
$$;

revoke all on function public.complete_tutorial() from public, anon;
grant execute on function public.complete_tutorial() to authenticated;

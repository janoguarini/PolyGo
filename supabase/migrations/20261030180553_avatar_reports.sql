-- Reportes de fotos de perfil (Apple 1.2: contenido generado por usuarios).
-- Cualquier jugador puede reportar la foto de otro; con 3 reportantes distintos sobre la misma foto
-- se oculta sola (avatar_path vuelve a null y se ve el zorro elegido) hasta que el dueño suba otra.
-- La revisión manual se hace desde el dashboard (ver docs/LAUNCH_CHECKLIST.md).

create table public.avatar_reports (
  id bigint generated always as identity primary key,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_id uuid not null references public.profiles (id) on delete cascade,
  -- Foto reportada (avatar_path de ese momento): si el dueño la cambia, los reportes no se arrastran.
  avatar_path text not null,
  reason text not null check (reason in ('sexual', 'violent', 'hateful', 'impersonation', 'other')),
  created_at timestamptz not null default now(),
  -- Para la revisión manual desde el dashboard.
  reviewed_at timestamptz,
  unique (reporter_id, reported_id, avatar_path),
  check (reporter_id <> reported_id)
);

create index avatar_reports_reported_idx on public.avatar_reports (reported_id, avatar_path);
create index avatar_reports_reporter_idx on public.avatar_reports (reporter_id, created_at desc);

-- Sin políticas: los clientes no leen ni escriben la tabla; sólo a través de report_avatar.
alter table public.avatar_reports enable row level security;
revoke all on public.avatar_reports from anon, authenticated;

/**
 * Reporta la foto actual de un jugador. Idempotente por (reportante, foto). Devuelve
 * { reported, hidden }: reported=false si el jugador no tiene foto; hidden=true si con este reporte
 * la foto llegó al umbral y se ocultó.
 */
create or replace function public.report_avatar(p_user_id uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  path text;
  recent int;
  reporters int;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_user_id = uid then
    raise exception 'cannot_report_self' using errcode = '22023';
  end if;
  if p_reason is null or p_reason not in ('sexual', 'violent', 'hateful', 'impersonation', 'other') then
    raise exception 'invalid_reason' using errcode = '22023';
  end if;

  select p.avatar_path into path from public.profiles p where p.id = p_user_id;
  if path is null then
    return jsonb_build_object('reported', false, 'hidden', false);
  end if;

  -- Freno al abuso: hasta 20 reportes por día por jugador.
  select count(*) into recent from public.avatar_reports
  where reporter_id = uid and created_at > now() - interval '1 day';
  if recent >= 20 then
    raise exception 'report_rate_limited' using errcode = '54000';
  end if;

  insert into public.avatar_reports (reporter_id, reported_id, avatar_path, reason)
  values (uid, p_user_id, path, p_reason)
  on conflict (reporter_id, reported_id, avatar_path) do nothing;

  select count(distinct reporter_id) into reporters from public.avatar_reports
  where reported_id = p_user_id and avatar_path = path;

  if reporters >= 3 then
    update public.profiles set avatar_path = null where id = p_user_id and avatar_path = path;
    return jsonb_build_object('reported', true, 'hidden', true);
  end if;
  return jsonb_build_object('reported', true, 'hidden', false);
end;
$$;

revoke all on function public.report_avatar(uuid, text) from public, anon;
grant execute on function public.report_avatar(uuid, text) to authenticated;

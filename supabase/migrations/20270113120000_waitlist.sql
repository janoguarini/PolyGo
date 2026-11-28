-- Lista de espera del sitio (polygoidiomas.com) antes del lanzamiento. Ver docs/WAITLIST.md.
--
-- Nadie lee ni escribe la tabla desde la API pública: RLS encendido y sin políticas para anon ni
-- authenticated (y sin privilegios). Sólo la Edge Function waitlist-join, con la clave de servicio,
-- llama a waitlist_join() y a waitlist_count(); ninguna de las dos es ejecutable por anon.
-- El contador del sitio sale de la función (GET), no de un RPC público: así la API anónima no expone
-- nada de esta tabla, ni siquiera el total.
--
-- ip_hash = sha256(WAITLIST_SALT | IP) calculado en la función (la IP nunca llega a la base). Sólo
-- sirve para el límite de altas por hora; waitlist_join() lo borra de las filas de más de 24 horas.
-- LOCAL: no aplicada.

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  -- Siempre en minúsculas y sin espacios: la unicidad no distingue mayúsculas (sin citext).
  email text not null,
  locale text not null,
  country text,
  -- utm_source/utm_campaign o el dominio de origen de la visita.
  source text,
  -- Versión del texto de consentimiento que aceptó (website/site.config.json → waitlist.consentVersion).
  consent_text_version text not null,
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  ip_hash text,
  unsubscribed_at timestamptz,
  constraint waitlist_signups_email_lower check (email = lower(btrim(email))),
  constraint waitlist_signups_email_shape check (
    char_length(email) between 6 and 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  constraint waitlist_signups_locale check (locale in ('es', 'pt-BR', 'it', 'fr')),
  constraint waitlist_signups_country check (country is null or country ~ '^[A-Z]{2}$'),
  constraint waitlist_signups_source check (source is null or char_length(source) between 1 and 100),
  constraint waitlist_signups_consent_version check (char_length(consent_text_version) between 1 and 40),
  constraint waitlist_signups_ip_hash check (ip_hash is null or ip_hash ~ '^[0-9a-f]{64}$')
);

comment on table public.waitlist_signups is
  'Lista de espera del sitio web. Sólo service_role (Edge Function waitlist-join). Ver docs/WAITLIST.md.';

create unique index waitlist_signups_email_key on public.waitlist_signups (email);
-- Límite por hora (ip_hash + created_at) y limpieza de ip_hash viejos.
create index waitlist_signups_ip_recent on public.waitlist_signups (ip_hash, created_at)
  where ip_hash is not null;
create index waitlist_signups_ip_age on public.waitlist_signups (created_at)
  where ip_hash is not null;

alter table public.waitlist_signups enable row level security;
-- Sin políticas: anon y authenticated no ven ni escriben nada (además, sin privilegios).
revoke all on table public.waitlist_signups from public, anon, authenticated;
grant select, insert, update, delete on table public.waitlist_signups to service_role;

/** Inscriptos activos (sin baja). El redondeo para el sitio lo hace la Edge Function. */
create function public.waitlist_count()
returns bigint
language sql
stable
set search_path = ''
as $$
  select count(*) from public.waitlist_signups where unsubscribed_at is null;
$$;

/**
 * Alta en la lista. Idempotente: un email repetido no crea otra fila y la función no dice si ya
 * existía (la Edge Function responde igual). Un email dado de baja que vuelve a anotarse, con un
 * consentimiento nuevo, se reactiva.
 *
 * Devuelve {status, count}: status = 'inserted' | 'duplicate' | 'resubscribed' | 'rate_limited'.
 * Límite: p_max_per_hour altas nuevas por ip_hash en la última hora (serializado por ip_hash).
 */
create function public.waitlist_join(
  p_email text,
  p_locale text,
  p_consent_version text,
  p_country text default null,
  p_source text default null,
  p_ip_hash text default null,
  p_max_per_hour integer default 5
)
returns jsonb
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_inserted boolean;
  v_status text;
begin
  if p_ip_hash is not null then
    perform pg_advisory_xact_lock(hashtextextended('waitlist_join:' || p_ip_hash, 0));
    if (
      select count(*) from public.waitlist_signups
      where ip_hash = p_ip_hash and created_at > now() - interval '1 hour'
    ) >= greatest(p_max_per_hour, 0) then
      return jsonb_build_object('status', 'rate_limited', 'count', public.waitlist_count());
    end if;
  end if;

  insert into public.waitlist_signups as w
    (email, locale, country, source, consent_text_version, consented_at, ip_hash)
  values
    (lower(btrim(p_email)), p_locale, p_country, p_source, p_consent_version, now(), p_ip_hash)
  on conflict (email) do update
    set unsubscribed_at = null,
        consented_at = now(),
        consent_text_version = excluded.consent_text_version,
        locale = excluded.locale
    where w.unsubscribed_at is not null
  returning (xmax = 0) into v_inserted;

  v_status := case
    when v_inserted is null then 'duplicate'
    when v_inserted then 'inserted'
    else 'resubscribed'
  end;

  -- Minimización: el ip_hash sólo hace falta para la ventana de una hora.
  update public.waitlist_signups set ip_hash = null
  where ip_hash is not null and created_at < now() - interval '24 hours';

  return jsonb_build_object('status', v_status, 'count', public.waitlist_count());
end;
$$;

revoke execute on function public.waitlist_count() from public, anon, authenticated;
revoke execute on function public.waitlist_join(text, text, text, text, text, text, integer)
  from public, anon, authenticated;
grant execute on function public.waitlist_count() to service_role;
grant execute on function public.waitlist_join(text, text, text, text, text, text, integer)
  to service_role;

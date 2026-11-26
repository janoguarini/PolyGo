-- Las 100 Polys de bienvenida llegan al CERRAR el tutorial (no al abrir la app por primera vez).
--
-- Antes: sync_polys las acreditaba en la primera sincronización (al inicializar la billetera), o sea
-- apenas entrabas, antes del tutorial. Ahora:
--   · sync_polys ya no las da al inicializar (el resto de esa inicialización no cambia).
--   · complete_tutorial() marca el tutorial y acredita el regalo, se termine o se salte: cerrar el
--     tutorial de cualquier forma lo da. Devuelve {balance, granted} (antes void) para que la app
--     muestre el aviso de «+100 Polys» sobre el inicio, de sorpresa.
--   · Las apps publicadas ya llaman complete_tutorial() al cerrarlo (e ignoran la respuesta): reciben
--     el regalo en ese momento y lo ven en la próxima sincronización.
--
-- Idempotente: poly_credit no repite un (user, 'welcome', 'welcome') ya pagado, así que nadie que ya
-- lo tenga lo cobra dos veces.
--
-- Rollback: volver a crear complete_tutorial() returns void (20261102030524_tutorial_completed) y
-- reponer el bloque del regalo en sync_polys.

drop function if exists public.complete_tutorial();

create function public.complete_tutorial()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  got integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  update public.profiles
  set tutorial_completed_at = coalesce(tutorial_completed_at, now())
  where id = uid;
  got := public.poly_credit(uid, (public.poly_config() ->> 'welcome')::int, 'welcome', 'welcome');
  return jsonb_build_object(
    'balance', coalesce((select balance from public.poly_wallets where user_id = uid), 0),
    'granted', case
      when got > 0 then jsonb_build_array(
        jsonb_build_object('reason', 'welcome', 'ref', 'welcome', 'amount', got))
      else '[]'::jsonb
    end);
end;
$$;
revoke all on function public.complete_tutorial() from public, anon;
grant execute on function public.complete_tutorial() to authenticated;

do $migration$
declare
  v_def text := pg_get_functiondef('public.sync_polys(text)'::regprocedure);
  v_old text := E'    got := public.poly_credit(uid, (public.poly_config() ->> ''welcome'')::int, ''welcome'', ''welcome'');\n'
             || E'    if got > 0 then\n'
             || E'      granted := granted || jsonb_build_object(''reason'', ''welcome'', ''ref'', ''welcome'', ''amount'', got);\n'
             || E'    end if;\n';
begin
  if position(v_old in v_def) = 0 then
    raise exception 'sync_polys: no se encontró el bloque del regalo de bienvenida';
  end if;
  execute replace(v_def, v_old, '');
end;
$migration$;

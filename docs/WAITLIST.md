# Lista de espera (pre-lanzamiento)

Antes de que PolyGo esté en las tiendas, polygoidiomas.com muestra un formulario de **lista de espera**
donde iban los botones de App Store / Google Play (portada: arriba y en «Descargar»; barra lateral del
blog), en los 4 idiomas del sitio. El día del lanzamiento se exporta la lista, se manda un email a todos
y el sitio vuelve a los botones de las tiendas.

**Estado (2026-11-27): LOCAL.** Migración sin aplicar, función sin desplegar, secreto sin crear y sitio
sin publicar.

## Piezas

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Tabla + funciones | `supabase/migrations/20270113120000_waitlist.sql` (rollback en `supabase/rollback/20270113120000_waitlist.down.sql`) | `public.waitlist_signups`, `waitlist_join()` y `waitlist_count()` |
| Edge Function | `supabase/functions/waitlist-join/index.ts` | `GET` → total; `POST` → alta. `verify_jwt = false` |
| Validación (pura) | `supabase/functions/waitlist-join/validate.ts` | Email, idioma, país, origen, consentimiento, CORS, redondeo del total |
| Formulario | `website/build.mjs` (`waitlistHtml`), `website/src/assets/waitlist.js`, estilos al final de `website/src/assets/styles.css`, textos `wl*` en `website/i18n.mjs` | Reemplaza `{{stores}}` mientras `launch.mode = "waitlist"` |
| Política | sección «Lista de espera» de `privacidad.html`, `pt/privacidade.html`, `it/privacy.html`, `fr/confidentialite.html` | Anclas `#lista-de-espera` (es, pt), `#lista-d-attesa` (it), `#liste-d-attente` (fr) |
| Pruebas | `supabase/tests/waitlist.test.mjs` (PGlite + la función real contra el emulador), `shared/__tests__/waitlistJoin.test.ts` (Jest), `website/check.mjs` | |

## Base de datos

`public.waitlist_signups`: `id`, `email` (siempre en minúsculas: `check (email = lower(btrim(email)))` +
índice único; no hace falta `citext`), `locale` (`es` | `pt-BR` | `it` | `fr`), `country` (opcional, ISO
de 2 letras), `source` (opcional, ≤ 100), `consent_text_version`, `consented_at`, `created_at`,
`ip_hash`, `unsubscribed_at`.

- **RLS encendido y sin políticas**; además, sin privilegios para `anon` ni `authenticated`. Nadie lee ni
  escribe la tabla desde la API pública.
- `waitlist_join(email, locale, consent_version, country, source, ip_hash, max_per_hour)` y
  `waitlist_count()` sólo las puede ejecutar `service_role` (la Edge Function).
- **Decisión: el contador sale de la Edge Function (GET), no de un RPC anónimo.** Así la API anónima no
  expone nada de la tabla (ni el total), y la función puede cachearlo y redondearlo.
- `waitlist_join()` es **idempotente**: un email repetido no crea fila nueva y la función responde lo
  mismo que con uno nuevo (no revela si ya estaba). Si el email se había dado de baja y vuelve a anotarse
  con un consentimiento nuevo, se reactiva (`unsubscribed_at = null`, `consented_at = now()`).
- **Límite:** como mucho `max_per_hour` (5) altas nuevas por `ip_hash` en la última hora, serializado con
  un advisory lock por `ip_hash`.
- `ip_hash = sha256(WAITLIST_SALT | IP)` lo calcula la función: la IP nunca llega a la base. Sirve sólo
  para el límite; cada alta borra el `ip_hash` de las filas de más de 24 horas.

## Edge Function `waitlist-join`

- `GET` → `{count}`: inscriptos activos, **exacto hasta 99 y redondeado hacia abajo a la decena desde
  100** (147 → 140: nunca exagera y cambia menos seguido). `Cache-Control: public, max-age=60` y caché en
  memoria de 30 s por instancia.
- `POST` (JSON) `{email, locale, consent: true, consentVersion, source?, country?, website}` →
  `200 {ok: true, count}` | `400 {ok: false, error: "invalid_email" | "consent_required" | "invalid_request"}` |
  `429 {ok: false, error: "rate_limited"}` | `503 {ok: false, error: "unavailable"}`.
- `website` es la **trampa para bots** (campo oculto a las personas): si viene con algo, responde OK y no
  guarda nada.
- **Sin JS:** el formulario se envía normal (`application/x-www-form-urlencoded`); la función responde
  `303` a `WAITLIST_SITE_URL` + el campo `return` (sólo rutas propias) + `#lista-ok` o `#lista-error`, y
  la página muestra el aviso con `:target`.
- **CORS:** `https://polygoidiomas.com`, `https://www.polygoidiomas.com`, `http://localhost:*` y
  `http://127.0.0.1:*`, más `WAITLIST_EXTRA_ORIGINS`. Un `POST` con `Origin` de otro sitio → `403`.
- **Logs:** nunca emails ni IP; sólo `{"message":"waitlist","outcome":"inserted" | "duplicate" |
  "resubscribed" | "rate_limited" | "rejected" | "honeypot" | …}`.

Secretos / variables:

| Variable | Obligatoria | Qué es |
| --- | --- | --- |
| `WAITLIST_SALT` | **Sí** (sin ella, `POST` → 503) | Sal secreta del hash de la IP. Una cadena aleatoria larga (p. ej. `openssl rand -hex 32`). No cambiarla durante la campaña (se reinicia el límite, nada más). |
| `WAITLIST_MAX_PER_HOUR` | No (5) | Altas nuevas por IP y por hora |
| `WAITLIST_EXTRA_ORIGINS` | No | Orígenes extra para CORS, separados por comas (p. ej. `https://polygoidiomas.netlify.app`) |
| `WAITLIST_SITE_URL` | No (`https://polygoidiomas.com`) | A dónde vuelve un envío sin JS |

`SUPABASE_URL` y la clave de servicio las pone Supabase.

## Sitio

`website/site.config.json`:

```json
"launch": { "mode": "waitlist" },
"waitlist": {
  "endpoint": "https://wtymosvsymzoosxscnxi.supabase.co/functions/v1/waitlist-join",
  "minCountToShow": 50,
  "consentVersion": "waitlist-2026-11-27"
}
```

- `launch.mode`: `"waitlist"` (formulario) o `"stores"` (los botones de siempre). Con `"stores"` pero sin
  ningún enlace de tienda cargado, sigue el formulario y el build avisa. Se puede pisar con la variable
  `LAUNCH_MODE`; el endpoint, con `WAITLIST_ENDPOINT`.
- `minCountToShow`: el contador «Ya somos N esperando el lanzamiento» y el «Ya somos N en la lista» del
  éxito sólo aparecen desde ese total. Si la función no responde, no aparecen.
- `consentVersion`: se guarda con cada alta. **Cambiarla cada vez que cambie el texto de la casilla**
  (`wlConsent` en `website/i18n.mjs`, en cualquier idioma), así queda registrado qué texto aceptó cada uno.
- En modo lista, el botón del menú dice «Unirme» / «Quero entrar» / «Iscriviti» / «M’inscrire» y lleva a
  `#descargar` como antes.
- El formulario: email con etiqueta, casilla de consentimiento **obligatoria y sin marcar**, enlace a la
  sección de la política de su idioma, trampa para bots, estado con `aria-live`, errores traducidos
  (email inválido, falta la casilla, sin conexión, demasiados intentos, error del servidor). El script
  completa `source` con `utm_source/utm_campaign` de la URL (o `ref:<dominio>` si vino de otro sitio).
- `website/check.mjs` falla si una portada no tiene el formulario en modo lista, o si algún formulario no
  tiene la casilla obligatoria sin marcar, el enlace a la política, las etiquetas, la trampa o el
  `aria-live`.
- **Pendiente de copy:** la sección «Descargar» de las portadas sigue diciendo «Descarga PolyGo gratis…»
  arriba del formulario; conviene ajustarla mientras dure la lista.

## Desplegar (con autorización del dueño)

Nada de esto se hizo. En este orden:

```sh
# 0. Proyecto correcto (debe mostrar wtymosvsymzoosxscnxi / PolyGo)
npx supabase projects list

# 1. Migración, en una transacción con su fila de historial (nunca `db push`)
f=20270113120000_waitlist
{ echo "begin;"; cat "supabase/migrations/$f.sql"; echo ";";
  echo "insert into supabase_migrations.schema_migrations (version, name, statements, created_by) values ('20270113120000', 'waitlist', array[]::text[], 'polygo-release-cli');";
  echo "commit;"; } > "/tmp/$f.apply.sql"
npx supabase db query --remote=wtymosvsymzoosxscnxi --yes -f "/tmp/$f.apply.sql"

# 2. Verificación (sólo lectura): RLS on, 0 políticas, anon sin privilegios
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json "select relrowsecurity, (select count(*) from pg_policies where tablename='waitlist_signups') as policies, has_table_privilege('anon','public.waitlist_signups','select') as anon_select, has_function_privilege('anon','public.waitlist_count()','execute') as anon_count from pg_class where oid='public.waitlist_signups'::regclass"
#   esperado: true, 0, false, false

# 3. Secreto (generar uno nuevo; no reutilizar otro)
npx supabase secrets set --project-ref wtymosvsymzoosxscnxi WAITLIST_SALT=$(openssl rand -hex 32)

# 4. Función (sin verificación de JWT: la llama un sitio estático)
npx supabase functions deploy waitlist-join --project-ref wtymosvsymzoosxscnxi --no-verify-jwt

# 5. Prueba de humo
curl -s https://wtymosvsymzoosxscnxi.supabase.co/functions/v1/waitlist-join          # {"count":0}
curl -s -X POST https://wtymosvsymzoosxscnxi.supabase.co/functions/v1/waitlist-join \
  -H 'content-type: application/json' -H 'origin: https://polygoidiomas.com' \
  -d '{"email":"<email de prueba propio>","locale":"es","consent":true,"consentVersion":"waitlist-2026-11-27","website":""}'
#   {"ok":true,"count":1}. Después, borrar esa fila (ver «Bajas y borrado»).

# 6. Sitio: npm run website:check y publicar la rama gh-pages como dice docs/WEB.md («Publicar»).
```

Rollback: `supabase/rollback/20270113120000_waitlist.down.sql` (**borra la tabla con todos los emails**:
exportar antes) + `npx supabase functions delete waitlist-join --project-ref wtymosvsymzoosxscnxi` +
`launch.mode = "stores"` en el sitio.

## El día del lanzamiento

1. **Exportar la lista** (sólo los que no se dieron de baja):

   ```sh
   npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json \
     "select email, locale, country, consented_at, consent_text_version from public.waitlist_signups where unsubscribed_at is null order by created_at" > waitlist.json
   ```

   (O la misma consulta en el SQL Editor del Dashboard → «Download CSV».) El archivo tiene datos personales: no subirlo al repositorio y borrarlo después de cargarlo en el servicio
   de envío. Un email por idioma (`locale`), con el enlace de baja que exige cada servicio.
2. **Sitio a modo tiendas:** cargar `appStoreUrl` y `playStoreUrl`, poner `"launch": { "mode": "stores" }`
   en `website/site.config.json`, `npm run website:check` y publicar.
3. La función puede quedar desplegada unos días (los formularios en caché siguen funcionando) y después
   borrarse con `npx supabase functions delete waitlist-join`.
4. Antes del envío: **nombrar el servicio de emails** en la sección «Lista de espera» de las 4 políticas
   (hoy dice que se nombrará cuando se elija) y actualizar `privacyUpdated` / `privacyUpdatedLocalized`.

## Bajas y borrado

- Baja (alguien escribe o el servicio de envío informa una baja):
  `update public.waitlist_signups set unsubscribed_at = now() where email = lower(btrim('<email>'));`
- Borrado a pedido (derecho de supresión):
  `delete from public.waitlist_signups where email = lower(btrim('<email>'));`
- Plazo: la política promete conservar la lista **hasta el lanzamiento y como máximo seis meses
  después**, o hasta la baja. Pasado ese plazo:
  `delete from public.waitlist_signups;` (o aplicar el rollback).

## RGPD / LGPD

- **Base legal: consentimiento** (art. 6.1.a RGPD; art. 7, I LGPD; Ley 25.326 art. 5 en Argentina). La
  casilla no viene marcada, es obligatoria y el texto dice para qué es; el enlace lleva a la sección de la
  política en el mismo idioma.
- **Registro del consentimiento:** `consented_at` + `consent_text_version` (+ `locale`, que dice en qué
  idioma lo leyó). Guardar el texto de cada versión: está en `website/i18n.mjs` (`wlConsent`) en el
  historial de git.
- **Finalidad limitada:** sólo el aviso del lanzamiento. Para mandar otras novedades hace falta otro
  consentimiento (otra casilla y otra columna), no reutilizar esta lista.
- **Minimización:** el país es opcional (hoy el formulario no lo pide), la IP no se guarda y su hash se
  borra a las 24 horas, `source` se recorta a 100 caracteres.
- **Baja y supresión:** enlace en cada email + pedido al email de contacto (consultas de arriba).
- **Encargados:** Supabase (EE. UU.) ya figura en la política; el servicio de envío se nombra antes de
  usarlo.

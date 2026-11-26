# Panel Superadmin (Etapa A)

Centro de control privado de PolyGo, **sólo para `janitogap`**. Dos caras sobre las mismas RPC:

- **En la app** (principal): Perfil → «Panel de administración» → `/admin` (13 módulos + ficha de usuario). Ver §9.
- **Web local** (`admin/`, opcional): `127.0.0.1:5174`, sin URL pública ni deploy.

- Código: [`admin/`](../admin) (Vite + React + TypeScript, sin librerías de gráficos).
- Base: [`supabase/migrations/20270101120000_superadmin_panel.sql`](../supabase/migrations/20270101120000_superadmin_panel.sql).
- Pruebas: [`supabase/tests/adminPanel.test.mjs`](../supabase/tests/adminPanel.test.mjs) y `admin/src/lib/*.test.ts`.
- Estado: migración **aplicada en producción el 2026-11-26 ~22:55 UTC** con `psql --single-transaction` desde el archivo (sha256 `fd1f5f54…`), registrada en el historial como `20270101120000 superadmin_panel` (148 filas). Backup previo verificado: físico COMPLETED de 2026-11-26 13:12 UTC. Postchecks y pruebas de rol en producción OK (ver §7). **Sin MFA** desde `20270102120000_superadmin_no_mfa.sql` (decisión del dueño, 2026-11-26): alcanza con la sesión de la cuenta.

## 1. Seguridad

El navegador no decide nada. Cada dato sale de una función de Postgres que verifica quién llama.

| Capa | Qué hace |
| --- | --- |
| Identidad | `auth.uid()` del JWT firmado por Supabase. Nunca un username, un parámetro ni algo guardado en el navegador. |
| Superadmin | `admin.superadmin_uid()` = `267762e4-8145-4e48-900b-9b14ccefb59b` (janitogap) **y** fila en `admin.superadmins`. Hacen falta las dos; cambiar el admin exige una migración nueva. |
| MFA | **Desactivado** a pedido del dueño (`20270102120000_superadmin_no_mfa`). El acceso queda protegido sólo por las credenciales de la cuenta (contraseña o Google). Para reactivarlo, volver a las funciones de `20270101120000`. |
| Schema `admin` | Sin `USAGE` para `public`, `anon`, `authenticated` ni `service_role`; RLS activado y sin políticas. La API REST no lo expone. Ningún cliente puede leer ni escribir `superadmins`, `internal_accounts`, `audit_log` ni `security_events`. |
| RPC `public.admin_*` | `SECURITY DEFINER`, `search_path` vacío, `EXECUTE` sólo para `authenticated` (anon ni las puede llamar). La **primera sentencia** de cada una es `admin.assert_superadmin(...)` (lo verifica un test sobre el catálogo). Sólo leen. |
| Auditoría | Cada consulta del panel queda en `admin.audit_log` (la misma consulta con los mismos parámetros, como máximo una vez por minuto). |
| Eventos de seguridad | `admin_session_check` registra accesos y denegaciones de usuarios logueados en `admin.security_events` (máximo 1 por usuario y motivo cada 10 min: nadie puede inflar la tabla). |
| Validación | Período ≤ 2 años, orden y segmento en lista blanca, búsqueda con comodines escapados, páginas de 100 filas como máximo. |
| Sesión del panel | `sessionStorage` (se pierde al cerrar la pestaña), cierre a los 30 min de inactividad y a las 8 h, «Cerrar sesión» y «Cerrar todas las sesiones» (también cierra la app en los teléfonos: pide confirmación). |
| Servidor local | Vite en `127.0.0.1:5174` (no en la red), `fs.strict`. Del `.env` de la raíz sólo lee `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` (ya son públicas: las lleva la app). Ningún secreto ni `service_role` llega al navegador (verificado en el build). |
| Datos sensibles | La ficha de usuario no expone email, contraseñas ni tokens de push (lo verifica un test). El CSV neutraliza fórmulas (`=`, `+`, `-`, `@`). |

### Pruebas de seguridad (`npm run test:db`, PGlite con todas las migraciones)

1. La migración carga **exactamente un** superadmin: el UID de janitogap. Sin esa cuenta, no carga ninguno y no falla.
2. Schema `admin`: ni `anon` ni `authenticated` tienen `USAGE`, privilegios de tabla ni `EXECUTE` en sus funciones. RLS activado en las 4 tablas.
3. Toda `public.admin_*` es `SECURITY DEFINER`, tiene `search_path` vacío, no la ejecutan `anon` ni `PUBLIC`, y arranca con la guardia. Una RPC nueva sin test hace fallar la suite.
4. `anon` → `permission denied` en las 18 RPC.
5. Usuario común (con `aal1` y con `aal2`) → `admin_forbidden` en las 17 RPC de datos.
6. Las cuentas internas `hola` y `janotester` → `admin_forbidden`.
7. `admin_session_check` con un usuario común → `forbidden`, sin datos, y un solo evento de seguridad aunque lo intente 3 veces seguidas.
8. Escalamiento: un usuario no puede insertar en `admin.superadmins`, leerla, tocar `internal_accounts`, borrar la auditoría, leer eventos ni llamar `admin.assert_superadmin`. No puede cambiar su username, y ponerse `janitogap` como nombre visible no da acceso. Ninguna RPC recibe usuario, rol, `aal` ni UID como parámetro.
9. janitogap sin MFA (`aal1` o sin claim) accede a todas; la guardia ya no mira el `aal` pero sigue exigiendo el UID fijo y la fila en `superadmins`, con los mismos permisos.
10. janitogap accede a todas y queda auditado (sin duplicar lecturas repetidas).
11. Validaciones: período invertido, de más de 2 años, orden inyectado (`'id; drop table x'`), segmento inválido → error.

## 2. Ejecutarlo localmente

```bash
cd admin
npm install          # sólo la primera vez (dependencias propias del panel, no las de la app)
npm run dev          # http://127.0.0.1:5174
```

Requisitos:

- La migración `20270101120000_superadmin_panel.sql` aplicada en Supabase (**pendiente de autorización**).
- El `.env` de la raíz con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` (ya existe).

Primer ingreso como `janitogap`:

1. Email y contraseña de la cuenta (la cuenta tiene proveedor email y Google; el panel usa email y contraseña). Si no recordás la contraseña, usá «Olvidé mi contraseña» de la app.
2. Listo: la base verifica que sea la cuenta de janitogap.

Otros comandos (en `admin/`): `npm run typecheck`, `npm run build` (genera `admin/dist`, ignorado por git), `npm test`.

## 3. Módulos y rutas

| Ruta | Módulo | RPC |
| --- | --- | --- |
| `#/overview` | Overview: foto de hoy, período contra el anterior, series diarias/semanales/mensuales, alertas | `admin_overview` |
| `#/users`, `#/users/<uuid>` | Usuarios: tabla con búsqueda y filtros; ficha con perfil, plan, cursos, rachas, ELO, historial de aprendizaje y de partidas | `admin_users_list`, `admin_user_detail`, `admin_user_battles` |
| `#/growth` | Crecimiento: registros, embudo de activación, tiempos hasta la 1.ª acción, distribuciones | `admin_growth` |
| `#/learning` | Aprendizaje: volumen, precisión, tiempos, curso, nivel, habilidad, tipo, ejercicios y lecciones difíciles, rachas | `admin_learning` |
| `#/ranked` | Ranked: partidas, resultados, ELO, ligas, ascensos, hora/día/idioma/país, ranking global y por idioma | `admin_ranked`, `admin_leaderboard` |
| `#/retention` | Retención: D1–D90 por cohorte semanal y por segmento, frecuencia, aprendizaje vs juego, Plus por frecuencia | `admin_retention` |
| `#/social` | Social: amistades, desafíos, referidos, retención con y sin amigos | `admin_social` |
| `#/monetization` | Monetización: Plus por fuente, producto y tienda; no renuevan; problemas de cobro; conversión | `admin_monetization` |
| `#/marketing` | Marketing: ranking de referidores (registros → onboarding → 1.ª lección → 1.ª partida → Plus → retención) | `admin_marketing` |
| `#/notifications` | Notificaciones: tokens, alcance, preferencias, push de desafío | `admin_notifications` |
| `#/health` | Salud técnica: partidas trabadas, cola, versiones de la app, trabajos de aprendizaje, tamaño, conexiones, consultas lentas | `admin_health` |
| `#/content` | Contenido: idiomas, publicación, revisión, ítems, cursos, finalización por unidad, reportes | `admin_content` |
| `#/admin` | Administración: superadmin, cuentas internas, eventos de seguridad, auditoría | `admin_audit` |

Controles comunes: período (hoy, ayer, 7, 30 y 90 días, 12 meses, personalizado), comparación contra el período anterior, filtros (país, plataforma, idioma, curso, Free/Plus), actualización automática (1, 5 o 15 min), CSV, vista de tabla en cada gráfico, tema oscuro (por defecto) o claro, y «?» con la fórmula de cada KPI.

## 4. Definiciones

- **Zona horaria:** días calendario de `America/Argentina/Buenos_Aires` (`admin.tz()`).
- **Usuarios reales:** todos menos `admin.internal_accounts` (janitogap, hola, janotester). Se excluyen de usuarios, crecimiento, actividad, retención, monetización y marketing. En la tabla de usuarios, la ficha, el ranking y la auditoría aparecen marcadas.
- **Activo:** completó una lección o un repaso (`learning_sessions`, `user_daily_activity`) o jugó una partida (`battle_players`) ese día. Abrir la app sin hacer nada no cuenta; eso llega con PostHog. `DAU` = hoy, `WAU` = últimos 7 días, `MAU` = últimos 30.
- **Retención Dn:** usuarios de la cohorte activos **exactamente** el día *n* tras registrarse (día 0 = día del registro) / usuarios de la cohorte con el día *n* ya cerrado. Si nadie llegó todavía, no hay dato.
- **Plus pago:** fuente `app_store` o `play_store`. `manual`, `promotional` y `referral` no son ingresos. Es el estado actual de `user_entitlements`, sin historial.
- **Ligas:** umbrales de `shared/ranking.ts` (`admin.tier_index`; un test compara contra `TIERS`).
- **Partidas:** las que tienen al menos un usuario real. Las de bots se cuentan y se separan (`vs_bot`).

Las fórmulas de cada KPI están en [`admin/src/lib/metrics.ts`](../admin/src/lib/metrics.ts) (son las del tooltip) y en el comentario de cada función SQL.

## 5. Métricas

**Disponibles con la base:** usuarios, registros por día, semana y mes, DAU/WAU/MAU, Free/Plus, reactivados, inactivos, onboarding (% y tiempo), tiempo hasta la 1.ª lección y la 1.ª partida, nunca hicieron una lección o nunca jugaron Ranked, abandono a 14 días, distribuciones (país declarado, plataforma, idiomas, curso), lecciones y repasos completados, respuestas, precisión, tiempos, unidades completadas, rendimiento por curso, nivel, habilidad y tipo, ejercicios y lecciones difíciles, rachas, todo Ranked salvo la cola, ranking, cohortes D1–D90, segmentos, social, referidos, Plus actual, tokens push, salud de la base y contenido.

**Parciales:** país (lo elige el usuario), plataforma (última conocida), último acceso (última presencia), «suscripciones iniciadas» (sin historial), tiempo emparejado → inicio (no es la búsqueda de rival).

**Sin datos (requieren instrumentación o integración):**

| Falta | Cómo se resuelve |
| --- | --- |
| Usuarios en tiempo real, duración de uso de la app, lecciones iniciadas y abandono, embudo del paywall, push entregadas y abiertas, país por IP | PostHog API (Etapa B) |
| MRR, ARR, ingresos, renovaciones, reembolsos, ARPU, LTV | RevenueCat API v2 (Etapa B) |
| Errores de Auth y Edge Functions, latencia P50/P95/P99, egress, storage, costos | API de gestión de Supabase (Etapa B) |
| Ingresos publicitarios | AdMob no está en producción (sólo TestIds en desarrollo) |
| Tiempo de matchmaking, búsquedas sin rival, desconexiones | Guardar `queued_at` y `end_reason` en el servidor de partidas (Etapa C) |
| Historial de suscripciones | Tabla `entitlement_events` desde el webhook de `plus-store` (Etapa C) |
| Notificaciones enviadas | Registrar los envíos del servidor (Etapa C) |
| Clics de invitación, campañas, influencers, inversión | `referral_clicked` y un código de referido por influencer (Etapa C) |
| Crashes | Sentry (opcional) |
| Reportes de errores de contenido o de preguntas | No existe el sistema |

## 6. Rendimiento

- Las RPC agregan en la base y devuelven JSON chico; las tablas paginan (máximo 100 filas).
- La migración agrega índices por fecha: `battles(created_at)`, `learning_sessions(completed_at)`, `exercise_attempts(created_at)`, `profiles(created_at)`, `user_daily_activity(activity_date)` y `rating_history(created_at)`.
- El panel guarda en memoria cada respuesta 60 s y la actualización automática es opcional (desactivada por defecto).
- Con el volumen actual alcanza con agregar al vuelo. Para cientos de miles de usuarios, el plan es `admin.daily_metrics` (agregados diarios recalculados con `pg_cron`) y que `admin.user_platform` lea una columna materializada. Activar `pg_cron` cambia la configuración de producción y requiere autorización.

## 7. Aplicar en producción (cuando se autorice)

1. Backup verificado (o confirmar el punto de restauración).
2. Aplicar `20270101120000_superadmin_panel.sql` (una transacción).
3. Postchecks con SQL de sólo lectura:
   - `select user_id from admin.superadmins` → sólo `267762e4-…`.
   - `select count(*) from admin.internal_accounts` → 3.
   - `has_schema_privilege('authenticated', 'admin', 'USAGE')` → false.
   - `has_function_privilege('anon', 'public.admin_overview(date,date,jsonb)', 'EXECUTE')` → false.
   - Advisors de seguridad sin hallazgos nuevos.
4. Probar desde el panel: entrar como janitogap, recorrer los 13 módulos, y entrar con `janotester` para confirmar «Acceso denegado».

**Rollback:** el bloque `Rollback` al comienzo de la migración (`drop schema admin cascade`, borrar las funciones `public.admin_*` y los 6 índices). No toca datos de la app.

## 9. Panel dentro de la app

- **Botón:** `src/features/admin/AdminEntryCard.tsx`, arriba del perfil. Se dibuja sólo si el UID de la sesión es `SUPERADMIN_UID` (`src/features/admin/api.ts`). Es una decisión **visual**: así ningún otro usuario consulta la base al abrir su perfil (y no se llenan los eventos de seguridad). Quien autoriza es la base; cambiar ese valor en un cliente no da acceso a nada.
- **Rutas:** `src/app/admin/_layout.tsx` (gate), `index.tsx` (inicio con KPIs y módulos), `[section].tsx` (los 13 módulos), `user/[id].tsx` (ficha). Registradas en `src/app/_layout.tsx` dentro de la zona de usuarios con sesión.
- **Gate:** `AdminGate` llama a `admin_session_check`; sin `allowed`, muestra «Acceso denegado». Si una RPC devuelve `admin_forbidden`, se vuelve a verificar.
- **Datos:** `src/features/admin/modules.tsx`, con React Query (60 s de caché y «tirar para actualizar»). Período y Free/Plus compartidos por todo el panel. Sólo lectura.
- **Idioma:** español fijo. Es una herramienta interna del dueño y es la única excepción a docs/I18N_GUIDE.md (no usa `defineStrings`).
- **Requiere una build nueva** (no hay OTA). Sin build, el botón no aparece en el teléfono.
- **Riesgo a tener en cuenta:** sin MFA, quien tenga la contraseña de la cuenta, o el teléfono desbloqueado con la app abierta, ve el panel.
- **Test:** `src/features/admin/__tests__/AdminEntryCard.test.tsx` (el botón no aparece para otras cuentas ni sin sesión; aparece y abre `/admin` para janitogap).

## 8. Cambios fuera de `admin/`

- `supabase/migrations/20270101120000_superadmin_panel.sql`: nueva.
- `supabase/tests/adminPanel.test.mjs`: nuevo (16 pruebas).
- `supabase/tests/harness.mjs`: opción `beforeMigrations` en `createDb` (para crear la cuenta con UID fijo antes de migrar; no cambia el resto de los tests).
- `tsconfig.json`, `eslint.config.js`, `package.json` (Jest): excluyen `admin/`, como ya hacían con `server/`.
- App: `src/features/admin/*`, `src/app/admin/*`, el botón en `src/app/(tabs)/profile.tsx` y la ruta en `src/app/_layout.tsx` (§9). Jest ignora `<rootDir>/admin/` (el panel web), no `src/**/admin`.

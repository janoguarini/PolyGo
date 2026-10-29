# Arquitectura

## Visión general

```
┌──────────────────────┐      HTTPS (PostgREST/Auth)      ┌───────────────────────┐
│  App Expo (RN + TS)  │ ───────────────────────────────▶ │  Supabase             │
│  src/app  src/...    │                                   │  Auth · Postgres+RLS  │
│                      │      WebSocket (Fase 4)          │  Storage · Realtime   │
│                      │ ─────────────┐                    └──────────▲────────────┘
└──────────┬───────────┘              ▼                               │ service_role
           │ App Group / SharedPrefs  ┌───────────────────────┐       │ (sólo backend)
           ▼ (Fase 5)                 │ Servidor de partidas  │───────┘
┌──────────────────────┐              │ Node + TS (server/)   │
│ Widgets nativos       │              │ autoridad de partidas │
│ SwiftUI / Glance      │              └───────────────────────┘
└──────────────────────┘
        shared/  ← reglas comunes (ELO, rangos, perfil, protocolo) usadas por app y servidor
```

## Capas de la app

| Carpeta | Responsabilidad |
| --- | --- |
| `src/app/` | Sólo rutas Expo Router. Layout raíz decide el acceso con `Stack.Protected`. |
| `src/design-system/` | Tokens y componentes visuales sin lógica de negocio. |
| `src/features/<dominio>/` | API (llamadas a Supabase), hooks de TanStack Query y componentes del dominio. |
| `src/lib/` | Infraestructura: env, cliente Supabase, storage seguro, traducción de errores, tipos DB. |
| `shared/` | Lógica pura y determinista compartida con el servidor. Sin dependencias de RN. |
| `src/widgets/` | Layouts de widgets nativos (`expo-widgets`): corren aislados, sin imports en ejecución. Ver WIDGETS.md. |

## Flujo de acceso (layout raíz)

1. Faltan variables → `ConfigMissing`.
2. Sin sesión → grupo `(auth)` (bienvenida, login, registro, recuperación).
3. Con sesión y sin `onboarding_completed_at` → `onboarding`.
4. Con sesión y onboarding completo → `(tabs)`.
5. Enlace de recuperación → `reset-password` (sólo mientras `recoveringPassword`).
6. `auth-callback` siempre accesible: canjea el `?code=` PKCE.

## Estado

- **Datos remotos:** TanStack Query (`profileKeys`, `leaderboard`). Se limpia la caché al cerrar sesión.
- **Sesión:** `AuthProvider` (contexto) escuchando `onAuthStateChange`.
- **Estado de batalla:** Zustand (`src/features/battle/store.ts`) sobre un reducer puro (`state.ts`): los eventos del socket llegan fuera del árbol de React. Es un reflejo del servidor; el cliente no decide puntos, tiempo ni resultado.

## Decisiones

| Decisión | Motivo |
| --- | --- |
| Reglas en `shared/` y replicadas en SQL `CHECK` | Cliente y servidor no pueden divergir; la DB es la última barrera. |
| Rating en tabla propia (`player_ratings`) + `rating_history` | Actualización atómica y auditoría; nunca dentro de un JSON del perfil. |
| Servidor de partidas separado de Edge Functions | Las Edge Functions no mantienen WebSockets persistentes con estado. |
| Sin microservicios | Un desarrollador debe poder mantenerlo: app + Supabase + un servicio Node. |

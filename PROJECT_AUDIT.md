# PROJECT_AUDIT — Polygo

Fecha de auditoría: 2026-10-28 · Fase 0

## 1. Estado inicial encontrado

| Aspecto | Hallazgo |
| --- | --- |
| Directorio `Polygo/` | **Vacío.** Sin código, sin `package.json`, sin git. Proyecto desde cero. |
| Código previo a preservar | Ninguno. |
| Supabase | No configurado en el repo. La cuenta conectada tiene dos proyectos (`Padel_App`, `Padel_App_Prod`) de **otra app**: no se tocaron. |
| Variables de entorno | Ninguna. |
| Migraciones previas | Ninguna. |
| Plataformas | Ninguna configurada. |

### Entorno de desarrollo detectado

| Herramienta | Versión / estado |
| --- | --- |
| SO | Windows 11 |
| Node.js / npm | 22.15.0 / 10.9.2 |
| git | 2.55 |
| EAS CLI | 21.0.2 (instalada globalmente) |
| Docker | 29.8 instalado, **daemon apagado** |
| Supabase CLI | No instalada (usable vía `npx supabase`) |
| Java / Android SDK | **No instalados** → no se puede compilar Android localmente |
| Xcode | No disponible (Windows) → iOS sólo vía EAS Build en la nube |
| Python | No instalado |

## 2. Decisiones tomadas en la Fase 0/1

1. **Scaffold** con `create-expo-app` (template `blank-typescript`) → Expo SDK 58, React Native 0.88, React 19.3, TypeScript 6.
2. **Rutas en `src/app/`** (convención del template SDK 58), código no-ruta en `src/`.
3. **`shared/`** en la raíz: reglas que deben ser idénticas en app y servidor de partidas (ELO, rangos, validación de perfil). Alias `@shared/*`.
4. **Pruebas SQL sin Docker** con PGlite (Postgres 17 en WASM) y un stub mínimo del esquema `auth` de Supabase. No reemplaza probar contra Supabase real.
5. **Sesión en SecureStore fragmentada** (las sesiones de Supabase superan el límite recomendado de 2 KB por clave).
6. **Auth con PKCE** y una única ruta `auth-callback` para confirmación de email y recuperación de contraseña.
7. **No se creó un proyecto Supabase**: requiere tu autorización (ver riesgos).

## 3. Arquitectura resultante

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```
src/app/           rutas Expo Router (auth, onboarding, tabs, callbacks)
src/design-system/ tokens + componentes reutilizables
src/features/      auth · profile · onboarding · ranked
src/lib/           env, cliente Supabase, storage seguro, errores, tipos DB
shared/            reglas de ranking/perfil compartidas con el servidor
supabase/          migraciones SQL + tests SQL (PGlite)
```

## 4. Dependencias relevantes

Instaladas con `npx expo install` (versiones compatibles con SDK 58): expo-router, react-native-reanimated 4 + worklets, expo-secure-store, expo-linear-gradient, react-native-svg, expo-haptics, expo-splash-screen. JS: @supabase/supabase-js, @tanstack/react-query, zustand (aún sin uso), react-hook-form + zod 4, lucide-react-native. Dev: jest-expo, @testing-library/react-native 14, ESLint 9 (eslint-config-expo), Prettier, PGlite.

`expo-doctor`: **20/20 checks** tras la configuración.

## 5. Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Sin proyecto Supabase | La app muestra la pantalla "Falta configurar el backend"; nada de auth funciona en dispositivo | Crear proyecto (necesita tu OK) y aplicar migraciones |
| Sin Android SDK / Xcode local | No hay builds nativos locales; widgets (Fase 5) imposibles de probar localmente | EAS Build en la nube; development builds |
| SDK 58 muy reciente | APIs cambiantes | Se consultó documentación versionada; `expo-doctor` limpio |
| Mock de Reanimated oficial roto en Jest | Tests de componentes animados | Mock mínimo propio en `jest.setup.ts` |
| Servidor de partidas necesita hosting persistente (WebSockets) | Coste/infra en Fase 4 | Diseñado como servicio Node aparte; elegir host (Fly.io/Railway/Render) |
| Tipos de DB escritos a mano | Desalineación con el esquema | Regenerar con `supabase gen types` al crear el proyecto |
| `npm audit` reporta vulnerabilidades transitivas | Bajo (tooling dev) | Revisar en Fase 6; no forzar `audit fix --force` (rompe versiones de Expo) |

## 6. Plan de implementación

Ver [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) para el estado vivo. Orden: Fase 1 (hecha) → 2 currículo A1 → 3 perfil/estadísticas → 4 motor competitivo → 5 widgets → 6 QA.

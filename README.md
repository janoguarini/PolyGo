# Polygo

App móvil (iOS/Android) para aprender inglés compitiendo: lecciones A1, batallas 1v1 en tiempo real, ELO y rangos de Bronce a Gran Maestro, perfil competitivo y widgets de vocabulario.

> Estado: **Fase 4** (lecciones A1, perfil y logros, batallas ranked Word Rush con servidor autoritativo). Ver [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md).

## Requisitos

- Node.js 22+
- Un proyecto de Supabase
- Expo Go (para probar sin builds nativos) o EAS para development builds

## Puesta en marcha

```bash
npm install
cp .env.example .env          # completar URL y anon key de Supabase
npx expo start
```

Sin `.env` válido la app arranca en una pantalla que indica qué variables faltan.

Para Ranked hace falta el servidor de partidas (`server/`): ver [Despliegue](docs/DEPLOYMENT.md#servidor-de-partidas-fase-4).

### Backend (Supabase)

1. Aplicar las migraciones de `supabase/migrations/` (SQL Editor o `npx supabase db push`).
2. En **Auth → URL Configuration → Redirect URLs** añadir `polygo://auth-callback` y, para Expo Go, la URL `exp://…/--/auth-callback` que muestra `npx expo start`.
3. Regenerar tipos tras cada migración: `npx supabase gen types typescript --project-id wtymosvsymzoosxscnxi > src/lib/database.generated.ts` (o vía MCP).

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm start` | Servidor de desarrollo de Expo |
| `npm run typecheck` | TypeScript estricto |
| `npm run lint` | ESLint (config de Expo) |
| `npm test` | Jest: lógica compartida, librerías y componentes |
| `npm run test:db` | Migraciones + RLS en Postgres real (PGlite, sin Docker) |
| `npm run test:server` | Servidor de partidas: typecheck + tests (incluye dos clientes Socket.IO reales) |
| `npm run check` | Todo lo anterior |
| `npm run format` | Prettier |

## Documentación

[Arquitectura](docs/ARCHITECTURE.md) · [Producto](docs/PRODUCT_SPEC.md) · [Currículo](docs/LEARNING_CURRICULUM.md) · [Ranking](docs/RANKING_SYSTEM.md) · [Protocolo de batalla](docs/BATTLE_PROTOCOL.md) · [Base de datos](docs/DATABASE.md) · [Widgets](docs/WIDGETS.md) · [Seguridad](docs/SECURITY.md) · [Testing](docs/TESTING.md) · [Despliegue](docs/DEPLOYMENT.md) · [Auditoría](PROJECT_AUDIT.md)

# Testing

| Capa | Herramienta | Comando | Ubicación |
| --- | --- | --- | --- |
| Reglas compartidas (ELO, rangos) | Jest | `npm test` | `shared/__tests__/` |
| Librerías (storage, errores, esquemas) | Jest | `npm test` | `src/**/__tests__/` |
| Componentes | Jest + React Native Testing Library 14 | `npm test` | `src/**/__tests__/*.test.tsx` |
| Migraciones + RLS | `node --test` + PGlite | `npm run test:db` | `supabase/tests/` |
| Servidor de partidas (matchmaking, motor con reloj manual, liquidación, integración con 2 clientes Socket.IO reales) | `node --test` + tsx | `npm run test:server` | `server/test/` |
| Todo | | `npm run check` | |

## Notas

- **RNTL 14:** `render`, `rerender` y `fireEvent.*` son asíncronos → usar `await`.
- **Reanimated:** el mock oficial de 4.7 intenta inicializar el módulo nativo; `jest.setup.ts` define un mock mínimo de las APIs usadas. Si usás una API nueva de Reanimated, agregala ahí.
- **lucide-react-native** se mapea a su build CommonJS en Jest (`moduleNameMapper`).
- **PGlite** ejecuta Postgres real con un stub de `auth` (roles `anon`/`authenticated`/`service_role`, `auth.uid()` desde `request.jwt.claim.sub`, privilegios por defecto como Supabase). No reemplaza una prueba contra un proyecto Supabase real: hacerla al crear el proyecto.

## Cobertura actual

249 tests Jest + 49 tests SQL + 33 tests del servidor, todos en verde (2026-10-29). Lista en [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Pendiente

Tests de pantallas con navegación (onboarding y lección completos con Supabase mockeado), prueba de lecciones en dispositivo, partida ranked real en dos dispositivos contra el servidor desplegado (Fase 4), pruebas manuales de widgets en dispositivo (Fase 5).

# Testing

| Capa | Herramienta | Comando | Ubicación |
| --- | --- | --- | --- |
| Reglas compartidas (ELO, rangos) | Jest | `npm test` | `shared/__tests__/` |
| Librerías (storage, errores, esquemas) | Jest | `npm test` | `src/**/__tests__/` |
| Componentes | Jest + React Native Testing Library 14 | `npm test` | `src/**/__tests__/*.test.tsx` |
| Migraciones + RLS | `node --test` + PGlite | `npm run test:db` | `supabase/tests/` |
| Servidor de partidas (matchmaking, motor con reloj manual, liquidación, integración con 2 clientes Socket.IO reales) | `node --test` + tsx | `npm run test:server` | `server/test/` |
| Widgets: contenido, sincronización y layouts simulados (plugin de Babel real + componentes stub + toques) | Jest | `npm test` | `src/features/widgets/__tests__/`, `src/widgets/__tests__/` |
| Accesibilidad: contraste WCAG AA de los tokens de color | Jest | `npm test` | `src/design-system/__tests__/contrast.test.ts` |
| Todo | | `npm run check` (también en CI: `.github/workflows/ci.yml`) | |

## Notas

- **RNTL 14:** `render`, `rerender` y `fireEvent.*` son asíncronos → usar `await`.
- **Reanimated:** el mock oficial de 4.7 intenta inicializar el módulo nativo; `jest.setup.ts` define un mock mínimo de las APIs usadas. Si usás una API nueva de Reanimated, agregala ahí.
- **lucide-react-native** se mapea a su build CommonJS en Jest (`moduleNameMapper`).
- **React Query en tests:** usar `gcTime: Infinity` en el `QueryClient` del test; si no, el timer de recolección mantiene vivo a Jest al terminar.
- **PGlite** ejecuta Postgres real con un stub de `auth` (roles `anon`/`authenticated`/`service_role`, `auth.uid()` desde `request.jwt.claim.sub`, privilegios por defecto como Supabase). No reemplaza una prueba contra un proyecto Supabase real: hacerla al crear el proyecto.

## Cobertura actual

321 tests Jest + 49 tests SQL + 33 tests del servidor, todos en verde (2026-10-29). Lista en [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Pendiente

Tests de pantallas con navegación (onboarding y lección completos con Supabase mockeado), prueba de lecciones en dispositivo, partida ranked real en dos dispositivos contra el servidor desplegado (Fase 4), widgets en dispositivo con una development build (Fase 5: el runtime real de WidgetKit/Glance no se puede simular).

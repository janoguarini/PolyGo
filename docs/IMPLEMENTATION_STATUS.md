# Estado de implementación

Última actualización: 2026-10-29 (Fase 5)

## Fase actual

**Fase 5 — Widgets nativos iOS y Android: implementada, sin probar en dispositivo.** Dos widgets con `expo-widgets` (Palabra y Pregunta rápida). Los layouts compilan con el empaquetador real de widgets para ambas plataformas y su lógica está testeada con un runtime simulado; el `prebuild` de Android genera bien los receivers. Falta: `eas init`, una development build y agregarlos en un teléfono. En Expo Go no aparecen (la app funciona igual).

**Fase 4 — Servidor de partidas, matchmaking, Word Rush y liquidación ELO: implementada.** Migración 0005 aplicada y verificada contra la base real (partida revertida). El servidor (`server/`) pasa sus tests con dos clientes Socket.IO reales, pero **todavía no corrió contra Supabase**: falta la secret key en `server/.env` y jugar una partida en dos dispositivos. Sin `EXPO_PUBLIC_BATTLE_SERVER_URL` la app sigue mostrando Ranked deshabilitado.

**Fase 3** — completa y desplegada; falta recorrerla en el teléfono.

**Fase 2** — completa y desplegada; falta recorrerla en el teléfono.

Fase 1 verificada en dispositivo (registro, onboarding, tabs).

## Backend

| Dato | Valor |
| --- | --- |
| Proyecto Supabase | `PolyGo` · ref `wtymosvsymzoosxscnxi` · `us-west-2` |
| URL | `https://wtymosvsymzoosxscnxi.supabase.co` |
| Repositorio | https://github.com/janoguarini/PolyGo |

## Terminado

### Fase 1
- [x] Expo SDK 58 + TypeScript estricto, Expo Router con rutas protegidas, sistema de diseño, emblemas de rango.
- [x] Auth Supabase (registro sin confirmación de email por decisión de producto), onboarding, tabs, clasificación global, privacidad.
- [x] `shared/ranking.ts` (ELO, rangos, anti-farming). Migraciones 0001 y 0002 aplicadas.
- [x] Verificado en teléfono (Expo Go): registro → onboarding → tabs.

### Fase 2
- [x] `shared/exercises.ts`: 9 tipos de ejercicio y 5 habilidades.
- [x] `shared/answers.ts`: validador determinista (normalización, contracciones, tolerancia controlada a typos).
- [x] `shared/srs.ts` + SQL: repetición espaciada 1/3/7 días, dominio tras 3 repasos espaciados.
- [x] Contenido A1 unidades 1–3: 15 lecciones, 64 palabras con IPA y ejemplos, 119 ejercicios (`content/a1`, borrador sin revisión humana).
- [x] Generador de migración de contenido idempotente (`npm run content:sql`).
- [x] Migración 0003: currículo, sesiones idempotentes, intentos, progreso por lección y palabra, actividad diaria, racha, resumen, palabra del día, RLS.
- [x] Motor de lecciones: reproductor con repaso de errores, feedback con traducción/IPA/ejemplo/pronunciación (voz sintetizada), resultados con reintento de guardado.
- [x] Repaso espaciado de palabras vencidas con ejercicios generados de forma determinista.
- [x] Pantallas: Aprender (mapa de unidades), Lección, Repaso, Vocabulario (estado de cada palabra), Inicio (racha, objetivo diario, lección y palabra del día), Perfil (estadísticas educativas reales).

### Fase 3
- [x] Migración 0004: `battles` y `battle_players` (resultados, sólo backend; rival anonimizado al borrar cuenta), FK `rating_history.battle_id`, catálogo de 16 logros, `user_achievements`, RPCs `get_match_history`, `get_my_achievements`, `get_public_profile`; `submit_learning_session` evalúa logros y los devuelve.
- [x] Backfill de logros para usuarios existentes al aplicar la migración.
- [x] Perfil: botón Editar, gráfico de evolución de ELO (SVG, una serie, tocar para inspeccionar), últimas partidas, resumen de logros.
- [x] Pantallas nuevas: Historial de partidas (paginado), Logros (por categoría, con progreso), Perfil de jugador (desde la clasificación o el historial; respeta privacidad), Editar perfil (nombre visible, avatar, objetivo diario).
- [x] Resultados de lección/repaso muestran los logros recién desbloqueados.
- [x] La visibilidad de perfil ya tiene efecto (`private`/`friends` sólo muestran nombre, avatar y rango).

### Fase 4
- [x] `shared/protocol.ts`: contrato tipado de eventos, constantes de Word Rush y matchmaking, máquina de estados (`canTransition`).
- [x] `shared/wordRush.ts`: generación de preguntas (sin distractores sinónimos), puntuación (100 + bonus ≤ 50, −50, piso 0) y resultado (abandono → puntaje → precisión → empate).
- [x] Migración 0005: `start_battle`, `battle_settlement_context`, `settle_battle` (transaccional, idempotente, control optimista de rating, logros), `cancel_battle`, `cancel_stale_battles`; sólo `service_role`.
- [x] Servidor `server/`: auth por token de Supabase, una conexión por usuario, cola con ventana ±100→±400, motor autoritativo con reloj del servidor, reconexión con 15 s de gracia, abandono, práctica sin ELO, liquidación con reintentos, limpieza de partidas huérfanas, rate limit, `/health`, Dockerfile.
- [x] App: pantalla `battle` (búsqueda, rival encontrado, cuenta atrás, partida con marcador y feedback, resultado con ELO/rango/logros, cancelaciones), cliente Socket.IO con token renovado en cada reconexión, estado en Zustand sobre reducer puro.
- [x] "Buscar partida" y "Practicar sin ELO" se habilitan con `EXPO_PUBLIC_BATTLE_SERVER_URL`; los logros competitivos dejan de decir "Disponible cuando abra Ranked".

### Fase 5
- [x] `expo-widgets` + `@expo/ui` + `expo-dev-client`; plugin en `app.json` (`enableAndroid`, `initialLayout` por plataforma); `eas.json` con perfiles development / development-simulator / preview / production.
- [x] Widget **Palabra**: palabra del día → palabras para repasar → nuevas; IPA, traducción y ejemplo; timeline horario de 12 h en iOS, snapshot en Android; deep link a Vocabulario en iOS.
- [x] Widget **Pregunta rápida**: ronda de 10 preguntas (generador de Word Rush) jugable desde la pantalla de inicio sin abrir la app; no pisa una ronda a medias; práctica sin efecto en SRS ni ELO.
- [x] Sincronización al cargar datos, al cambiar y al volver a primer plano; no-op en Expo Go/web; los widgets se vacían al cerrar sesión.
- [x] Vocabulario explica cómo agregar los widgets (o que hace falta una build si se usa Expo Go).

## Pendiente (por fase)

- **Fase 2 (verificación manual):** recorrer una lección y un repaso en el teléfono.
- **Fase 2 (contenido):** revisión editorial humana; unidades 4–12.
- **Fase 3 (verificación manual):** recorrer perfil, editar perfil, logros y perfil de otro jugador en el teléfono.
- **Fase 4 (puesta en marcha):** completar `server/.env` con la secret key, levantar el servidor y jugar una partida ranked y una práctica en dos dispositivos. Después, elegir hosting (Fly.io/Railway/Render) con HTTPS.
- **Fase 5 (verificación manual):** `eas init`, development build Android (y iOS si hay cuenta de Apple Developer), agregar ambos widgets, responder una ronda, verificar el cambio horario en iOS y que se vacían al cerrar sesión.
- **Fase 6:** QA, accesibilidad, builds EAS, checklist de lanzamiento.

## Migraciones

| Migración | Local (PGlite) | Supabase |
| --- | --- | --- |
| `20261029010416_core_profiles_ratings.sql` | ✅ | ✅ aplicada |
| `20261029010511_advisor_fixes.sql` | ✅ | ✅ aplicada |
| `20261029021909_curriculum.sql` | ✅ | ✅ aplicada |
| `20261029022122_content_a1_unit_01.sql` | ✅ | ✅ aplicada |
| `20261029022239_content_a1_unit_02.sql` | ✅ | ✅ aplicada |
| `20261029134056_content_a1_unit_03.sql` | ✅ (reaplicación idempotente testeada) | ✅ aplicada |
| `20261029140504_profile_history_achievements.sql` | ✅ | ✅ aplicada |
| `20261029144242_battle_settlement.sql` | ✅ | ✅ aplicada |

Al aplicar por MCP, Supabase registra la versión con la hora de aplicación: los archivos locales se renombran para coincidir.
Las migraciones no deben contener sentencias destructivas: el conector las rechaza sin poder pedir confirmación (ver SECURITY.md).

## Verificación en Supabase de la Fase 4 (2026-10-29)

Bloque con dos usuarios temporales que termina en excepción (rollback); conteos finales en 0.

| Prueba | Resultado |
| --- | --- |
| `start_battle` + `battle_settlement_context` | ✅ ratings 1000/1000, 0 partidas, ventana 1 |
| `settle_battle` victoria/derrota en colocación | ✅ 1000 → 1024 / 976, 1 partida, 1 victoria, racha 1, 2 filas en `rating_history`, estado `completed` |
| Logros devueltos | ✅ `first_win` para el ganador, ninguno para el perdedor |
| Reliquidar | ✅ `duplicate: true` |
| `authenticated` no puede ejecutar las funciones nuevas | ✅ |
| Datos residuales | ✅ ninguno |
| Advisors | ✅ sin avisos nuevos |

## Verificación en Supabase de la Fase 3 (2026-10-29)

Todo dentro de un bloque que termina en excepción (rollback); conteos finales en 0.

| Prueba | Resultado |
| --- | --- |
| 16 logros cargados; backfill sin logros (el único usuario no tenía progreso) | ✅ |
| Completar la lección `a1-u01-l01` perfecta como usuario autenticado | ✅ devuelve `first_lesson` y `perfect_lesson` |
| Reenviar la misma sesión | ✅ `duplicate: true`, `achievements_unlocked: []` |
| Partida terminada con rival anonimizado → `get_match_history` | ✅ resultado, puntajes, rating 1000 → 1024, rival `null` |
| `get_public_profile` del propio usuario | ✅ 2 logros, 1 lección, racha récord 1 |
| Datos residuales | ✅ ninguno |
| Advisors | 2 `SECURITY DEFINER` nuevos intencionales (`get_match_history`, `get_public_profile`); índices sin uso (sin tráfico) |

## Verificación en Supabase de la Fase 2 (2026-10-29)

| Prueba | Resultado |
| --- | --- |
| Conteos: 3 unidades, 15 lecciones, 64 palabras, 119 ejercicios, 194 vínculos | ✅ |
| Checksum md5 de palabras, lecciones, ejercicios y vínculos igual al local | ✅ los 4 coinciden |
| Lección 2 bloqueada antes de completar la 1 | ✅ `lesson_locked` |
| Completar lección 1 real con todas correctas | ✅ precisión 1.000 |
| Reenviar la misma sesión | ✅ `duplicate: true`, sin doble conteo |
| Lección 2 desbloqueada; 6 palabras en etapa 1; racha 1 | ✅ |
| Repaso guardado con `p_lesson_id` vacío (bug corregido en el cliente) | ✅ |
| Datos de prueba residuales | ✅ ninguno |
| Advisors | 2 `SECURITY DEFINER` intencionales; protección de contraseñas filtradas desactivada (decisión pendiente); índices sin uso (sin tráfico) |

## Tests locales (2026-10-29)

| Suite | Comando | Resultado |
| --- | --- | --- |
| TypeScript (app + scripts) | `npm run typecheck` | ✅ |
| ESLint | `npm run lint` | ✅ |
| Jest | `npm test` | ✅ 271/271 (17 suites: + contenido, sincronización y layouts simulados de widgets) |
| SQL + RLS (PGlite) | `npm run test:db` | ✅ 49/49 (+ liquidación, idempotencia, stale rating, anti-farming, abandono, cuenta borrada, cancelación) |
| Servidor de partidas | `npm run test:server` | ✅ typecheck + 33/33 (matchmaking, motor con reloj manual, liquidación con reintentos, integración con 2 clientes Socket.IO reales, rate limit) |
| Bundle Metro Android + iOS | `npx expo export -p android -p ios` | ✅ |
| Layouts de widgets (empaquetador de expo-widgets) | `node node_modules/expo-widgets/scripts/build-layout-registry.mjs` | ✅ Android e iOS |
| `expo prebuild` Android | `npx expo prebuild --no-install --platform android` | ✅ 2 receivers + `appwidget-provider` (iOS no se puede generar en Windows: lo hace EAS) |
| expo-doctor | `npx expo-doctor` | ⚠️ 19/20: `react-native` 0.88.0 instalado, el SDK pide 0.88.1 (parche publicado después; sin aplicar) |

No ejecutado todavía: widgets en un dispositivo (requiere development build); lecciones, repasos y pantallas de la Fase 3 en el teléfono; el servidor de partidas contra Supabase real y una partida en dos dispositivos.

## Problemas conocidos

1. Tipos de base de datos generados desde Supabase; regenerarlos tras cada migración.
2. Contenido A1 sin revisión editorial humana (`review_status = 'draft'`).
3. En lecciones, la corrección la calcula el cliente (feedback inmediato); el servidor valida estructura, desbloqueo e idempotencia, no re-corrige. No afecta al ELO.
4. Mock propio de Reanimated en Jest; bundle IDs provisionales; SMTP por defecto de Supabase.
5. `friends` se trata como privado hasta que existan amigos.
6. El historial pagina por fecha de fin: dos partidas terminadas en el mismo microsegundo podrían saltearse entre páginas (despreciable).
7. Servidor de partidas de una sola instancia: cola y partidas en memoria; un reinicio cancela las partidas en curso (sin ELO).
8. El bonus de velocidad incluye la latencia de red de cada jugador.
9. Widgets: Android no tiene timeline ni deep link en expo-widgets (la palabra cambia al abrir la app); las respuestas del widget no se sincronizan con el repaso espaciado.
10. Con `expo-dev-client` instalado, Expo Go se usa con `npx expo start --go`.

## Próximos pasos exactos

1. Widgets: `npx eas-cli@latest login`, `npx eas-cli@latest init` y `npx eas-cli@latest build --profile development --platform android`; instalar, iniciar sesión, agregar «Palabra» y «Pregunta rápida» (pasos en WIDGETS.md). iOS en dispositivo requiere Apple Developer paga.
2. Servidor de partidas: copiar `server/.env.example` a `server/.env` con la secret key, `cd server && npm install && npm run dev`, y en el `.env` de la app `EXPO_PUBLIC_BATTLE_SERVER_URL=http://<IP-de-la-PC>:3001`; jugar una partida en dos dispositivos.
3. Pendientes de fases anteriores en el teléfono (lección 1, logros, perfil de otro jugador).
4. Decidir hosting del servidor (con HTTPS), si activar la protección de contraseñas filtradas y si aplicar el parche `react-native` 0.88.1.
5. Fase 6: QA, accesibilidad, builds de producción y checklist de lanzamiento.

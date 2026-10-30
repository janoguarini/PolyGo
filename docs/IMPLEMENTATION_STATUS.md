# Estado de implementación

Última actualización: 2026-10-30 (racha visible y recordatorio diario)

## Fase actual

**Fase 6 — QA y preparación de lanzamiento: lo que se puede hacer desde el repo está hecho.** Borrado de cuenta en la app (Edge Function probada contra Supabase real), pantalla de error global, auditoría de accesibilidad con test de contraste (2 problemas corregidos), permisos mínimos en Android, CI en GitHub Actions, borrador de política de privacidad y [checklist de lanzamiento](LAUNCH_CHECKLIST.md). Lo pendiente necesita tus cuentas, tus dispositivos o decisiones de producto (ver la checklist).

**Fase 5 — Widgets nativos iOS y Android: implementada, sin probar en dispositivo.** Dos widgets con `expo-widgets` (Palabra y Pregunta rápida). Los layouts compilan con el empaquetador real de widgets para ambas plataformas y su lógica está testeada con un runtime simulado; el `prebuild` de Android genera bien los receivers. Falta: `eas init`, una development build y agregarlos en un teléfono. En Expo Go no aparecen (la app funciona igual).

**Fase 4 — Servidor de partidas, matchmaking, Word Rush y liquidación ELO: implementada.** Migración 0005 aplicada y verificada contra la base real (partida revertida). El servidor (`server/`) pasa sus tests con dos clientes Socket.IO reales, pero **todavía no corrió contra Supabase**: falta la secret key en `server/.env` y jugar una partida en dos dispositivos. Sin `EXPO_PUBLIC_BATTLE_SERVER_URL` la app sigue mostrando Ranked deshabilitado.

**Fase 3** — completa y desplegada; falta recorrerla en el teléfono.

**Fase 2** — completa y desplegada; falta recorrerla en el teléfono.

Fase 1 verificada en dispositivo (registro, onboarding, tabs).

## Backend

| Dato              | Valor                                               |
| ----------------- | --------------------------------------------------- |
| Proyecto Supabase | `PolyGo` · ref `wtymosvsymzoosxscnxi` · `us-west-2` |
| URL               | `https://wtymosvsymzoosxscnxi.supabase.co`          |
| Repositorio       | https://github.com/janoguarini/PolyGo               |

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

### Fase 6

- [x] Borrado de cuenta (App Store 5.1.1(v) y Google Play): Edge Function `delete-account` (valida el token, exige confirmación explícita, borra con la clave secreta) + pantalla con confirmación por nombre de usuario. E2E contra Supabase real: 401 sin token o con token inválido, 400 sin confirmación, 200 al borrar, 401 al reintentar; ningún dato residual.
- [x] `ErrorBoundary` global de Expo Router.
- [x] Accesibilidad: auditoría de todos los `Pressable` (rol, etiqueta, zona táctil), test de contraste WCAG AA de todos los tokens de texto; corregidos placeholders (2,1:1 → 3,5:1) y feedback de respuestas en batalla (2,5:1 → 5,5:1).
- [x] Producción: `usesNonExemptEncryption: false`; permisos Android reducidos a `INTERNET` y `VIBRATE` (verificado en el manifest generado).
- [x] Enlace opcional a la política de privacidad (`EXPO_PUBLIC_PRIVACY_POLICY_URL`) y borrador en PRIVACY_POLICY.md.
- [x] CI en GitHub Actions (`npm run check` en cada push y PR).
- [x] Advisors de Supabase y `npm audit` revisados (detalle en LAUNCH_CHECKLIST.md).
- [x] `react-native` 0.88.1 (expo-doctor 20/20).
- [x] Contenido A1 unidades 4–12 (45 lecciones, 180 palabras, 338 ejercicios) aplicado en Supabase; checksum md5 de palabras, lecciones, ejercicios y vínculos idéntico al local. Validación nueva contra traducciones ambiguas (corrigió _not_, _don't_, _doesn't_, _at_ y reemplazó _café_ por _museum_).

### Racha y recordatorio diario (2026-10-30)

- [x] Festejo al terminar la primera sesión del día (racha nueva o +1, semana con los días de la racha) y al cumplir el objetivo diario; aparece entre los resultados y lo que sigue, en lecciones y repasos guardados. Se calcula comparando el resumen de antes y después de la sesión (sin cambios en la base).
- [x] Aviso "Tu racha está en riesgo" en Aprender cuando hay racha y hoy no practicaste; lleva a la lección actual.
- [x] Recordatorio diario con `expo-notifications` (sólo local, `enableRemoteNotifications: false`): interruptor y horario en Perfil, oferta para activarlo desde el festejo. Se programan los próximos 7 días con fecha fija y se reprograman al abrir la app y al terminar cada sesión: si hoy ya practicaste no avisa hoy, y el texto menciona la racha cuando está en riesgo. Se cancelan al cerrar sesión. Agrega los permisos Android `POST_NOTIFICATIONS` y `RECEIVE_BOOT_COMPLETED`.
- [ ] Probar en dispositivo (requiere development build nueva por el módulo nativo).

### Generador de consolidación (2026-10-30)

- [x] Sin ejercicios triviales de cognados (hotel, hospital, banana, no, Argentina, México, sofa, bus), consigna de escritura sin texto descriptivo («hacer» en vez de «hacer / auxiliar de preguntas») y formas alternativas en inglés aceptadas (_a lot_/_much_, _store_, _flat_, _movie theater_, _handbag_).
- [x] Nueva migración diferencial (`npm run content:dump` / `content:diff`): 35 ejercicios, 1 palabra y 25 vínculos corregidos con `UPDATE`. Aplicada en Supabase; checksum md5 de palabras, ejercicios y vínculos (1845) idéntico al local.
- [x] Test de base: lo que dejan las migraciones es idéntico a `content/`, vínculos incluidos.

### Logros por estrellas (2026-10-30)
- [x] Métrica `stars_earned` (misma regla que la app; un test compara el SQL con `lessonStars`) y 4 logros nuevos: Toque de oro (25 lecciones doradas), Primeras estrellas (30 ★), Constelación (120 ★), Galaxia (300 ★). Catálogo de 20 logros.
- [x] Estrellas y lecciones doradas en el perfil público (respeta la visibilidad) y ★ en la clasificación de Ranked sólo para perfiles públicos (`get_public_stars`).
- [x] Aplicado en Supabase. El cambio de la restricción de métricas (`DROP CONSTRAINT`) se corrió a mano en el SQL Editor y se registró en el historial de migraciones.

### Logros por niveles, perfil nuevo y avatares (2026-10-30)
- [x] 13 familias de logros con niveles (76 niveles) definidas en `shared/achievements.ts`; la migración del catálogo se genera con `scripts/build-achievements-sql.ts` y un test compara la base con ese archivo. Métricas nuevas: días con objetivo cumplido, repasos, respuestas rápidas (< 2 s). El rango máximo cuenta recién después de la colocación. Se conservaron los ids de los logros existentes.
- [x] Perfil rediseñado (encabezado con avatar y rango, carrera, idiomas, estadísticas por período con `get_competitive_stats`, carrusel de logros) y pantalla de Ajustes (recordatorio, privacidad, mostrar país, cuenta). País (`profiles.region`) editable.
- [x] Avatares: tres zorros (ids heredados `bolt` violeta predeterminado, `crown` amarillo, `flame` rojo) y foto propia de la galería (`expo-image-picker` + `expo-image-manipulator`, 512 px JPEG) en el bucket público `avatars`, un archivo por usuario en su carpeta. La foto se ve en perfil, perfil público, clasificación y batallas. Borrar la cuenta borra la foto.
- [x] El `DROP CONSTRAINT` de métricas se corrió a mano en el SQL Editor y no figura en el historial remoto de migraciones (registrarlo a mano fue bloqueado).
- [ ] Probar en dispositivo (requiere development build nueva: image picker y manipulator son módulos nativos). Moderación de fotos: ver LAUNCH_CHECKLIST.md.

### Ranked con bots (2026-10-30)
- [x] Bots identificados con el distintivo BOT cuando no hay rival humano en 10 s; a tu nivel y con habilidad calibrada por simulación; cuentan para el ELO. Servidor (`Battle`, matchmaker, liquidación), migración `bot_battles` (aplicada) y app (rival encontrado, marcador, resultado e historial).
- [ ] Probar contra Supabase real: el servidor de partidas sigue sin correr con la secret key ni estar alojado.

## Pendiente (por fase)

- **Fase 2 (verificación manual):** recorrer una lección y un repaso en el teléfono.
- **Contenido:** revisión editorial humana de las 12 unidades.
- **Fase 3 (verificación manual):** recorrer perfil, editar perfil, logros y perfil de otro jugador en el teléfono.
- **Fase 4 (puesta en marcha):** completar `server/.env` con la secret key, levantar el servidor y jugar una partida ranked y una práctica en dos dispositivos. Después, elegir hosting (Fly.io/Railway/Render) con HTTPS.
- **Fase 5 (verificación manual):** `eas init`, development build Android (y iOS si hay cuenta de Apple Developer), agregar ambos widgets, responder una ronda, verificar el cambio horario en iOS y que se vacían al cerrar sesión.
- **Fase 6 (lo que requiere cuentas, dispositivos o decisiones):** ver [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md): URL de la política de privacidad, URL web de borrado, cuentas de Apple/Google, builds de producción, prueba manual completa con VoiceOver/TalkBack, revisión editorial del contenido.

## Migraciones

| Migración                                                      | Local (PGlite)                         | Supabase     |
| -------------------------------------------------------------- | -------------------------------------- | ------------ |
| `20261029010416_core_profiles_ratings.sql`                     | ✅                                     | ✅ aplicada  |
| `20261029010511_advisor_fixes.sql`                             | ✅                                     | ✅ aplicada  |
| `20261029021909_curriculum.sql`                                | ✅                                     | ✅ aplicada  |
| `20261029022122_content_a1_unit_01.sql`                        | ✅                                     | ✅ aplicada  |
| `20261029022239_content_a1_unit_02.sql`                        | ✅                                     | ✅ aplicada  |
| `20261029134056_content_a1_unit_03.sql`                        | ✅ (reaplicación idempotente testeada) | ✅ aplicada  |
| `20261029140504_profile_history_achievements.sql`              | ✅                                     | ✅ aplicada  |
| `20261029144242_battle_settlement.sql`                         | ✅                                     | ✅ aplicada  |
| `20261030025417…030645_content_a1_unit_04…12.sql` (9 archivos) | ✅                                     | ✅ aplicadas |
| `20261030030654_content_a1_text_fixes.sql`                     | ✅                                     | ✅ aplicada  |

Al aplicar por MCP, Supabase registra la versión con la hora de aplicación: los archivos locales se renombran para coincidir.
Las migraciones no deben contener sentencias destructivas: el conector las rechaza sin poder pedir confirmación (ver SECURITY.md).

## Verificación en Supabase de la Fase 4 (2026-10-29)

Bloque con dos usuarios temporales que termina en excepción (rollback); conteos finales en 0.

| Prueba                                                 | Resultado                                                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `start_battle` + `battle_settlement_context`           | ✅ ratings 1000/1000, 0 partidas, ventana 1                                                           |
| `settle_battle` victoria/derrota en colocación         | ✅ 1000 → 1024 / 976, 1 partida, 1 victoria, racha 1, 2 filas en `rating_history`, estado `completed` |
| Logros devueltos                                       | ✅ `first_win` para el ganador, ninguno para el perdedor                                              |
| Reliquidar                                             | ✅ `duplicate: true`                                                                                  |
| `authenticated` no puede ejecutar las funciones nuevas | ✅                                                                                                    |
| Datos residuales                                       | ✅ ninguno                                                                                            |
| Advisors                                               | ✅ sin avisos nuevos                                                                                  |

## Verificación en Supabase de la Fase 3 (2026-10-29)

Todo dentro de un bloque que termina en excepción (rollback); conteos finales en 0.

| Prueba                                                                       | Resultado                                                                                                            |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 16 logros cargados; backfill sin logros (el único usuario no tenía progreso) | ✅                                                                                                                   |
| Completar la lección `a1-u01-l01` perfecta como usuario autenticado          | ✅ devuelve `first_lesson` y `perfect_lesson`                                                                        |
| Reenviar la misma sesión                                                     | ✅ `duplicate: true`, `achievements_unlocked: []`                                                                    |
| Partida terminada con rival anonimizado → `get_match_history`                | ✅ resultado, puntajes, rating 1000 → 1024, rival `null`                                                             |
| `get_public_profile` del propio usuario                                      | ✅ 2 logros, 1 lección, racha récord 1                                                                               |
| Datos residuales                                                             | ✅ ninguno                                                                                                           |
| Advisors                                                                     | 2 `SECURITY DEFINER` nuevos intencionales (`get_match_history`, `get_public_profile`); índices sin uso (sin tráfico) |

## Verificación en Supabase de la Fase 2 (2026-10-29)

| Prueba                                                                       | Resultado                                                                                                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Conteos: 3 unidades, 15 lecciones, 64 palabras, 119 ejercicios, 194 vínculos | ✅                                                                                                                                      |
| Checksum md5 de palabras, lecciones, ejercicios y vínculos igual al local    | ✅ los 4 coinciden                                                                                                                      |
| Lección 2 bloqueada antes de completar la 1                                  | ✅ `lesson_locked`                                                                                                                      |
| Completar lección 1 real con todas correctas                                 | ✅ precisión 1.000                                                                                                                      |
| Reenviar la misma sesión                                                     | ✅ `duplicate: true`, sin doble conteo                                                                                                  |
| Lección 2 desbloqueada; 6 palabras en etapa 1; racha 1                       | ✅                                                                                                                                      |
| Repaso guardado con `p_lesson_id` vacío (bug corregido en el cliente)        | ✅                                                                                                                                      |
| Datos de prueba residuales                                                   | ✅ ninguno                                                                                                                              |
| Advisors                                                                     | 2 `SECURITY DEFINER` intencionales; protección de contraseñas filtradas desactivada (decisión pendiente); índices sin uso (sin tráfico) |

## Tests locales (2026-10-29)

| Suite                                                     | Comando                                                            | Resultado                                                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript (app + scripts)                                | `npm run typecheck`                                                | ✅                                                                                                                                              |
| ESLint                                                    | `npm run lint`                                                     | ✅                                                                                                                                              |
| Jest                                                      | `npm test`                                                         | ✅ 321/321 (19 suites: + contraste WCAG y pantalla de borrado de cuenta)                                                                        |
| SQL + RLS (PGlite)                                        | `npm run test:db`                                                  | ✅ 49/49 (+ liquidación, idempotencia, stale rating, anti-farming, abandono, cuenta borrada, cancelación)                                       |
| Servidor de partidas                                      | `npm run test:server`                                              | ✅ typecheck + 33/33 (matchmaking, motor con reloj manual, liquidación con reintentos, integración con 2 clientes Socket.IO reales, rate limit) |
| Bundle Metro Android + iOS                                | `npx expo export -p android -p ios`                                | ✅                                                                                                                                              |
| Layouts de widgets (empaquetador de expo-widgets)         | `node node_modules/expo-widgets/scripts/build-layout-registry.mjs` | ✅ Android e iOS                                                                                                                                |
| `expo prebuild` Android                                   | `npx expo prebuild --no-install --platform android`                | ✅ 2 receivers + `appwidget-provider` (iOS no se puede generar en Windows: lo hace EAS)                                                         |
| CI (GitHub Actions)                                       | `.github/workflows/ci.yml`                                         | corre `npm run check` en cada push y PR                                                                                                         |
| Edge Function `delete-account` (E2E contra Supabase real) | script manual con usuario descartable                              | ✅ 401/401/400/200/401, sin datos residuales                                                                                                    |
| expo-doctor                                               | `npx expo-doctor`                                                  | ✅ 20/20                                                                                                                                        |

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

Todo lo que falta está en [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md). En orden:

1. `npx eas-cli@latest login` + `init` y una development build de Android; seguir el guion de prueba manual (checklist, sección 6), incluidos widgets y eliminar cuenta.
2. Servidor de partidas: `server/.env` con la secret key, levantarlo y jugar en dos dispositivos; después elegir hosting con HTTPS.
3. Publicar la política de privacidad (completar el borrador) y una URL de borrado de cuenta; cargar `EXPO_PUBLIC_PRIVACY_POLICY_URL`.
4. Decisiones: bundle ID definitivo, contraseñas filtradas, SMTP propio, monitoreo de errores.
5. Revisión editorial del contenido A1, build de producción y envío a TestFlight / prueba interna.

# Español para angloparlantes + onboarding multilingüe + test de nivel — Fase 0

Estado (2026-11-21): **solo auditoría**. No se modificó código, no se tocó la base, no hubo commits.
Este documento es el diagnóstico y el plan; cada fase siguiente espera revisión.

## 1. Diagnóstico

### 1.1 El curso English → Spanish ya existe (no hay que generarlo)

`content/es-course.ts` + `content/es/a1` (17 unidades) + `content/es/a2` (12 unidades), documentado en
[ES_A1_A2.md](ES_A1_A2.md):

- 29 unidades, 290 lecciones (145 escritas, 145 repasos generados), 532 palabras, 2891 ejercicios,
  68 textos/audios con 209 preguntas de comprensión, 24 tareas de escritura.
- Apoyo en inglés: consignas, explicaciones, traducciones, comprensión y escritura (`support` en
  `shared/languages.ts`; tablas de consignas en `content/builders.ts:41-70` y `content/path.ts:277-302`).
- Cubre todos los temas A1/A2 del brief y los contrastes inglés–español (género, artículos, ser/estar en
  A1 U6/U14, por/para en A2 U12, falsos amigos, voseo/usted, pronombres de objeto en A2 U10, pasados en
  A2 U1/U4/U5, futuro en A1 U17/A2 U6, pronunciación por unidad).
- **Variante: rioplatense con voseo** (vos sos, tenés); el tuteo se explica, no se practica, pero se
  acepta en las respuestas. Decisión a confirmar para un público angloparlante internacional.
- Validación: `scripts/es-check.ts` → **0 problemas** (contenido y escritura, verificado hoy).
- Sin revisión nativa ni pedagógica humana; audio = síntesis del dispositivo (es-AR), no escuchado.

**Faltan en el cliente** las migraciones de carga y publicación, que solo están en el repo original:
`supabase/migrations/20261204120000_es_a1_a2.sql` y `supabase/pending/20261205120000_publish_es_a1_a2.sql`.
Por eso `content/__tests__/es.test.ts` (y pt/it/zh, por el mismo motivo) fallan al arrancar: ENOENT.
Las demás 5453 pruebas de contenido pasan.

**En producción el español no existe** (0 unidades, `content_status = 'soon'`).

### 1.2 Estado real del contenido por curso

| Curso   | Local                     | Producción                         | `shared/languages.ts`              |
| ------- | ------------------------- | ---------------------------------- | ---------------------------------- |
| es → en | A1 14 + A2 12 (+B1/B2 loc.) | A1 12 + A2 12 publicadas          | available, A1/A2, Ranked           |
| es → fr | A1 17 + A2 13             | publicado y available (2026-11-21) | available, A1/A2, sin Ranked       |
| es → it | A1 + A2 (12)              | solo A1 U1–U12                     | available, A1, Ranked              |
| es → pt | A1 + A2 (12)              | solo A1 U1–U12                     | available, A1, Ranked              |
| es → zh | A1 + A2                   | solo A1 U1–U12                     | available, A1, Ranked              |
| en → es | A1 17 + A2 12             | **nada**                           | soon, sin niveles                  |

Las A2 de it/pt/zh dependen de la tanda pendiente de [DB_RECONCILIATION_PLAN.md](DB_RECONCILIATION_PLAN.md).
No detecté otros cursos completos (B1/B2 de inglés existen en local pero no en producción y el CHECK de
`curriculum_units.level` solo admite A1/A2).

### 1.3 La interfaz está 100 % en español (bloqueante estructural)

- No hay sistema de i18n: ni librería, ni `t()`, ni archivos de cadenas. Locale de fechas fijo en `'es'`
  (9 archivos).
- ~131 archivos con literales en español; estimado 1.200–1.500 cadenas. Además: errores
  (`src/lib/errors.ts`, ~44), logros, misiones, rangos, cosméticos y nombres de idiomas en `shared/`.
- Dentro de una lección, un angloparlante vería en español: «Comprobar», «¡Correcto!», «Respuesta
  incorrecta», «Continuar», «Escribí acá…», «Tu respuesta en español», resultados, diálogo de salida,
  «Explicación de la lección», etc.

Esta es la razón documentada por la que el español quedó en «Próximamente». **El brief exige que
English → Spanish funcione en lecciones, repaso, progreso, XP, logros y perfil, y que el tutorial no
muestre español a quien eligió English: eso requiere traducir la interfaz.** Es la parte más grande
del trabajo, más que el contenido.

### 1.4 Modelo de datos

- `profiles.target_language` es la única columna de idioma. No existen idioma de origen ni de interfaz.
- `profiles.start_level` es **uno para toda la cuenta**, `CHECK in ('A1','A2')`.
- `onboarding_completed_at` y `tutorial_completed_at` ya existen.
- Progreso: por id de lección/palabra (los ids ya son por idioma). XP global (`player_xp`, migración
  `20261222120200` preparada **sin aplicar**). ELO por idioma (`player_ratings (user, language)`).
- Desbloqueo (`is_lesson_unlocked`): secuencial por `(idioma, nivel)`; la primera lección de cada nivel
  está siempre abierta. **Es la única forma de empezar más adelante sin falsificar progreso.**
- No hay test de nivel ni nada parecido (los «placements» de la migración 20261107150100 son la
  asignación de ítems a ejercicios).
- Hoy cada idioma objetivo tiene **un único** idioma de origen (es → todos; en → es). El curso se puede
  identificar por el idioma objetivo sin duplicar nada. Si algún día hubiera «French for English
  speakers», los ids `fr-…` chocarían: ahí sí haría falta un id de curso (origen, objetivo).

### 1.5 Registro, onboarding y tutorial actuales

- Guardas en `src/app/_layout.tsx:110-158`: sin sesión → `(auth)`; con sesión y sin
  `onboarding_completed_at` → `onboarding`; si no, `(tabs)`. Google y Apple pasan por el trigger
  `handle_new_user` y luego por el mismo onboarding.
- `src/app/onboarding.tsx`: welcome · idioma · nivel (A1/A2 elegido a mano) · meta · usuario · avatar.
  Todo en `useState`; nada se guarda hasta `complete_onboarding(...)`. Si se cierra la app, empieza de
  cero (pero no deja perfiles incompletos).
- `set_target_language` no sirve durante el onboarding (exige `onboarding_completed_at`).
- Tutorial: `src/features/onboarding/AppTour.tsx`, 4 pasos sobre las pestañas reales con el zorro y
  «Saltar»; se marca con `complete_tutorial()`. Repetición solo para `janitogap`.
- Producción tiene **1 usuario** (el dueño): la compatibilidad con cuentas existentes es simple.

## 2. Riesgos y dependencias

1. **Interfaz en inglés**: grande y transversal; sin ella el curso no es usable.
2. **Producción**: el español exige 3 escrituras (carga ~2341 ítems, publicación, activación) con
   backup, PRECHECK y autorización. Además se cruzan con la tanda 1 de la reconciliación, sin aplicar.
3. **Árbol de trabajo mezclado**: el cliente tiene cambios sin commit (AdMob, login social, XP,
   personalización) que dependen de migraciones `20261222*` sin aplicar. «XP y niveles globales» del
   tutorial depende de `player_xp`, que no está en producción.
4. **No hay expo-updates**: para que lleguen a usuarios, los cambios de JS requieren build de tienda.
   Para QA sirve el development build actual (no hacen falta módulos nativos: ver 3.4).
5. **Test de nivel**: no hay banco de preguntas de ubicación; hay que escribirlo y validarlo por curso.
   Con contenido solo hasta A2, el test puede afirmar A1, A2 y «por encima de A2»; no B2/C1.
6. **`start_level` global**: si el usuario se ubica en A2 de inglés y después agrega chino, hoy empezaría
   en A2 de chino (y el RPC lo rechaza si no hay A2). Hay que pasar el nivel a por idioma.

## 3. Propuesta de arquitectura

### 3.1 Catálogo central de cursos (`shared/courses.ts`, sin esquema)

Una sola fuente derivada de `LANGUAGES`:

- `SOURCE_LANGUAGES = ['es', 'en']`.
- `coursesForSource(source)` → cursos con `support.code === source` (sin `support` = español),
  `status === 'available'` y `levels.length > 0`. Así «English» muestra solo Spanish y no aparece
  ningún curso sin contenido publicado. Selector, onboarding y gestión de idiomas lo usan; nada se
  hardcodea por pantalla.
- `sourceOf(target)` para saber el idioma de apoyo de un curso.

### 3.2 Tres idiomas separados

| Concepto  | Dónde                                                                     |
| --------- | ------------------------------------------------------------------------- |
| Interfaz  | `profiles.interface_language` ('es' \| 'en'), copia local en el dispositivo |
| Origen    | `profiles.source_language` ('es' \| 'en'), elegido en el onboarding        |
| Objetivo  | `profiles.target_language` (existente)                                     |

El onboarding inicializa interfaz = origen; luego se cambian por separado (ajustes). El contenido no
depende de la interfaz: lo define el curso.

### 3.3 Capa de i18n propia, sin dependencias

`src/i18n/` con diccionarios `es.ts` / `en.ts` tipados (el inglés debe tener las mismas claves; lo
verifica TypeScript y un test), `useT()` y `formatDate/number(locale)`. Sin librería: cero riesgo
nativo y nada que instalar. Errores del servidor: ya llegan como códigos, se traducen en el cliente.

Orden de traducción:
1. Lección, repaso, resultados, feedback, intro de lección, mapa de Aprender (lo que usa el curso).
2. Auth, onboarding nuevo, test de nivel, tutorial.
3. Pestañas, perfil, ajustes, logros, misiones, rangos, errores.
4. Resto (tienda, Plus, batalla, amigos).

### 3.4 Sugerencia de idioma del dispositivo

`Intl.DateTimeFormat().resolvedOptions().locale` (Hermes) para preseleccionar Español/English. No hace
falta `expo-localization` (módulo nativo que no está en el build).

### 3.5 Test de nivel

- Banco curado por curso en `content/placement/<lang>.ts`: ~36 ítems por curso en 4 bandas
  (A1 inicial, A1 final, A2, «más allá de A2»), de tipos ya existentes (opción múltiple, completar,
  ordenar, comprensión breve), con su validador y tests.
- Algoritmo en `shared/placement.ts` (puro, testeable): empieza en A1 inicial; 2 aciertos seguidos suben
  de banda, 2 errores la bajan; termina entre 8 y 12 preguntas o cuando se estabiliza. Resultado:
  A1, A2 o «A2+ (B1 en camino)», nunca más que la evidencia.
- Se corrige en el dispositivo; no otorga XP ni escribe intentos de aprendizaje. Estado en el
  dispositivo para reanudar.

### 3.6 Punto de partida sin falsificar progreso

- El resultado fija el **nivel inicial por idioma** (A1 o A2, acotado a lo publicado). Se aprovecha que
  la primera lección de cada nivel ya está abierta: no se marca nada completado, no se da XP.
- «A2+» → se ubica en A2 y se explica que es el nivel más alto disponible.
- Siempre se ofrece «Empezar desde el principio» (A1).
- Ubicación por unidad (empezar en A1 U8) queda **fuera del MVP**: exigiría cambiar
  `is_lesson_unlocked`, una función endurecida del Learning Machine.

### 3.7 Flujo y estados

`Crear cuenta → (confirmación) → Idioma de origen → Curso → Intro del test → Test → Resultado →
complete_onboarding_v2 → Tutorial → Aprender`.

- El borrador (origen, curso, respuestas, índice) se guarda en `deviceStorage` por `user.id`: cerrar
  la app, perder conexión o volver a iniciar sesión retoma donde quedó; cambiar el origen descarta el
  curso y el test. Nada se escribe en la base hasta el final: no hay perfiles incompletos ni duplicados.
- Usuario y avatar se conservan (paso posterior al resultado o en el mismo envío).
- El tutorial reutiliza `AppTour` y `tutorial_completed_at`, ampliado a pasos breves y traducidos
  (unidades/lecciones, XP y niveles, Repaso, Ranked, amigos, progreso, logros), omitible y retomable.
- Usuarios existentes: tienen `onboarding_completed_at`, no vuelven a pasar. Agregar idiomas sigue en
  `LanguagesRow`, ahora agrupado por origen con el mismo catálogo.

### 3.8 Migraciones previstas (locales, sin aplicar)

1. `profiles_language_model`: `source_language` e `interface_language` (`text not null default 'es'`,
   CHECK es/en); `user_language_levels (user_id, language_code, start_level, placement_level,
   placed_at)`; backfill desde `start_level`. Rollback: drop de la tabla y las columnas.
2. `complete_onboarding_v2(...)`: igual que hoy + origen, interfaz y resultado del test; verifica que el
   curso corresponda al origen. **Se conserva la v1** para las builds de tienda.
3. `set_interface_language(text)`.
4. Ajuste del cliente para leer el nivel por idioma (con `start_level` como respaldo).
5. Español: copiar del original la carga y la publicación (ya generadas y probadas en PGlite) y preparar
   la activación (`content_status='available'`, sin Ranked).

## 4. Fases

| Fase | Contenido | Sale cuando |
| ---- | --------- | ----------- |
| 1a | Copiar migraciones es al cliente; `es.test` + `test:db` en PGlite; `shared/courses.ts` | tests verdes |
| 1b | i18n + traducción de la superficie de aprendizaje (3.3 punto 1) | una lección es completa en inglés en el dev build |
| 2  | Migraciones del modelo (3.8), API y hooks; tests PGlite | tests verdes, sin aplicar |
| 3  | Selector por origen | tests del selector |
| 4  | Banco y motor del test, resultado, punto de partida (hecha local, §4.4) | tests del algoritmo y del banco |
| 5  | Tutorial ampliado y traducido | QA en dev build |
| 6  | Resto de la interfaz en inglés, recorrido completo, regresiones | QA en iPhone |

Producción, al final y con autorización por escritura: modelo → carga es → publicación es →
activación es → build de tienda.

## 4.1 Avance (2026-11-21)

**Fase 1 — contenido: HECHA (local).** Curso convertido a español neutro (ver
[ES_A1_A2.md](ES_A1_A2.md), nota inicial, y [ES_NEUTRAL_GUIDE.md](ES_NEUTRAL_GUIDE.md)); migraciones de
carga y publicación regeneradas en el cliente, sin aplicar.

**Fase 1 — interfaz en inglés: HECHA (local), salvo onboarding y tutorial** (se rehacen en las fases
3–5). Ver [I18N_GUIDE.md](I18N_GUIDE.md). Capa `src/i18n/` sin dependencias; ~70 archivos de textos
`defineStrings({ es, en })`; fechas y números con el locale de la interfaz; textos de `shared/` que usa
el servidor traducidos en el cliente por id (rangos, logros, misiones, cosméticos, insignias, XP);
selector «Idioma de la app» en Ajustes (por ahora solo en el dispositivo). Quedan en español a
propósito: `onboarding.tsx` y `AppTour` (fases 3–5), errores solo para desarrolladores, el mensaje del
servidor en «Actualizá la app» (en inglés se muestra uno propio), los nombres de widgets en `app.json` y
la etiqueta de logros de otros jugadores en el feed de amigos.

Verificación: `tsc` (app y scripts) y `expo lint` limpios; Jest 6842/6842 (las 7 suites que no
arrancan son las de siempre: faltan en el cliente migraciones de otros idiomas, ENOENT).

**Siguiente: Fase 2** (modelo de datos: `source_language`, `interface_language`, nivel por idioma,
`complete_onboarding_v2`), con migraciones solo locales.

## 4.2 Fase 2 — modelo de datos (diseño aprobado internamente, 2026-11-21)

Corrige §3.2 y §3.8 según las decisiones del dueño para la Fase 2: **el idioma de origen pertenece al
curso** (no hay `profiles.source_language`) y **un idioma de destino puede tener varios cursos** (el
curso ya no se identifica por el idioma de destino).

| Objeto | Qué es | Datos |
| ------ | ------ | ----- |
| `courses` (nueva) | Catálogo: un curso = idioma de destino + idioma de origen | `code` (`en-from-es`, `es-from-en`…), `target_language`, `source_language`, `is_default` (el curso por defecto de su destino; único por destino), `position`. Lectura pública, sin escritura |
| `user_courses` (nueva) | Inscripción y estado por curso | `start_level` (A1–C2; se valida contra lo publicado), `placement_level`, `placement_completed_at` (los escribe la Fase 4), `enrolled_at`, `last_active_at`. Solo lectura del dueño; se escribe por RPC o trigger |
| `profiles.active_course_code` (nueva) | El curso que estudia ahora | FK a `courses`; sincronizado con `target_language` |
| `profiles.interface_language` (nueva) | Idioma de la interfaz | `es` \| `en` \| null (null = no lo eligió: manda el dispositivo) |
| `profiles.target_language`, `start_level` | Se mantienen | Compatibilidad con las builds de tienda, el servidor de batallas (lee `target_language`) y los RPC actuales |

- **Progreso, estadísticas y SRS no se mueven.** Ya son por curso, porque cuelgan de ids de lección y de
  palabra que pertenecen a las unidades de un curso. ELO sigue por idioma (`player_ratings`). XP sigue
  global (nivel de jugador).
- **Disponibilidad**: hoy hay un curso por destino, así que manda `languages.content_status` del destino
  (una sola autoridad, sin duplicar). Cuando exista un segundo curso para un mismo destino hará falta
  `courses.status` y `curriculum_units.course_code` (cambios aditivos); quedan anotados, no se hacen
  ahora, porque tocarían las tablas de contenido.
- **Sincronía**: un trigger `before` en `profiles` mantiene `active_course_code` ↔ `target_language`.
  Si cambia el curso, el destino pasa a ser el del curso; si cambia solo el destino (RPC viejo), el curso
  pasa a ser el por defecto. Un trigger `after` inscribe en el curso activo al completar el onboarding o
  al cambiar de curso. Así `complete_onboarding` v1 y `set_target_language` siguen funcionando, sin
  modificarlos, y dejan el modelo nuevo coherente.
- **RPC nuevos** (security definer, sin acceso anónimo): `complete_onboarding_v2` (curso, nivel,
  interfaz y resultado opcional del test), `set_active_course`, `set_course_start_level` (no toca
  progreso ni XP) y `set_interface_language`. La v1 de `complete_onboarding` se conserva.
- **Migración de datos** (idempotente, sin `delete` ni cambios en progreso):
  1. se cargan los 6 cursos;
  2. `active_course_code` pasa a ser el curso por defecto de `target_language`;
  3. `interface_language = 'es'` para quien ya completó el onboarding (la usó en español);
  4. inscripciones: el curso activo con `profiles.start_level` (no cambia nada de lo que ve hoy) y cada
     otro idioma con al menos una lección completada, con A1 (lo que la app ya mostraba).
- **Cliente** (sin cambios visuales): el nivel se lee por curso; si la migración no está aplicada, se
  deriva como hoy (curso activo = `start_level`, el resto = A1). El idioma de la interfaz se guarda
  también en el perfil cuando el RPC existe.
- **Rollback**: `supabase/rollback/20261223120000_course_model.down.sql` borra triggers, RPC nuevos,
  las dos columnas y las dos tablas; no toca progreso, `target_language` ni `start_level`.

**Estado (2026-11-22): Fase 2 HECHA en local, sin aplicar.** Migración
`supabase/migrations/20261223120000_course_model.sql` (SHA-256 `75930fd3…cdcb64207`).
`supabase/tests/courses.test.mjs` 29/29. Suite de base comparada archivo por archivo con y sin la
migración (`POLYGO_TEST_EXCLUDE_MIGRATIONS` en el harness): mismos resultados en los 54 archivos; las
fallas que quedan son las de siempre (faltan en el cliente migraciones de otros idiomas). Jest del
cliente, `tsc` y lint limpios. Cliente: `shared/courses.ts`, `src/features/courses/`, nivel por curso en
Aprender y Perfil, idioma de interfaz sincronizado con el perfil cuando el RPC existe.

## 4.3 Fase 3 — «Tus cursos» (HECHA en local, 2026-11-22)

Redefinida por el dueño: selector de cursos dentro de la app (no en el onboarding, que sigue en las
fases siguientes).

- Pantalla `src/app/courses.tsx` (ruta `/courses`, sube desde abajo). Se abre con el chip del idioma en
  Aprender y con «Gestionar» en Mis idiomas (Perfil); reemplaza los dos desplegables de idiomas
  (`LanguagesRow` quedó sin usar, salvo `usePrefetchLanguagePaths`).
- Muestra el curso activo (destino, origen, nivel y progreso del nivel), «Mis cursos» (inscriptos o con
  lecciones, cada uno con su nivel y progreso) y «Empezar un curso nuevo» agrupado por idioma de origen
  (primero el del curso activo; un curso nuevo empieza en A1). Sólo cursos con contenido disponible.
- Lógica pura en `src/features/courses/catalog.ts` (`buildCourseList`); datos en
  `src/features/courses/useCourseList.ts`; cambio con `useSwitchCourse` (`set_active_course`, o
  `set_target_language` sin la migración), con caché optimista compartida (`useSwitchStudy`).
- No toca XP (global), progreso, repasos ni ELO; sin la migración se comporta como antes.

## 4.4 Fase 4 — test de nivel (HECHA en local, 2026-11-22)

Detalle en [PLACEMENT_TEST.md](PLACEMENT_TEST.md). Corrige §3.5–3.6: el test se ofrece al **empezar un
curso nuevo** desde «Tus cursos» (no en el onboarding), el banco **no se escribe**: sale de ejercicios
de lecciones publicadas de cada curso, y el resultado se guarda **por curso** con `start_course`
(migración `20261224120000_course_placement`, sin aplicar), que nunca pisa un curso ya empezado.
Motor de escalera en `shared/placement.ts` (2 bandas por nivel, 2 aciertos suben, 2 errores cortan,
2–12 preguntas). Hoy sólo inglés y francés (A1–A2) tienen test; el resto tiene un solo nivel.

## 5. Decisiones del dueño (2026-11-21)

1. **Interfaz en inglés: toda la app de una vez**, antes de avanzar con el onboarding.
2. **Variante: español neutro con tú** (reemplaza el voseo rioplatense). Criterio aplicado: español
   latinoamericano general, `ustedes` para el plural (vosotros se explica como forma de España, no se
   practica), vocabulario panhispánico (autobús, metro, celular, apartamento/departamento según
   corresponda), voz `es-MX`. Exige reescribir las 29 unidades, invertir el validador de variante y
   regenerar ids, carga y publicación (el español no está en producción: no rompe nada).
3. **Ubicación por nivel** (A1/A2) con la regla de desbloqueo actual.
4. **Encima del árbol actual**, sin tocar los cambios sin commit ajenos a este trabajo.

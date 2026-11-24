# Cierre del Learning Machine (2026-11-10)

Estado: **todo en local.** Nada aplicado en producción, ninguna Edge Function desplegada, sin build, sin
EAS, sin commits, sin staging. SRS v2, Mastery (para Adaptive y para mostrar), AL17 y `pg_cron` siguen
**apagados**. No se tocó Ranked, ni el SRS v1, ni el contenido de inglés A1, ni ningún algoritmo,
parámetro o contrato aprobado.

Fuentes: `LEARNING_DATA_ARCHITECTURE.md` rev. 8, `MASTERY_ENGINE_DESIGN.md` rev. 2,
`ADAPTIVE_LEARNING_DESIGN.md` rev. 4.2, `LEARNING_ATTEMPTS_PHASE2.md`, `ADAPTIVE_LEARNING_PHASE3.md`,
`LEARNING_PHASE4.md`, `LEARNING_PHASE5.md`, `PRE_RELEASE_VALIDATION.md`.

## 1. Qué quedaba abierto y cómo se clasificó

Sólo los puntos abiertos en esos registros (no se repitió nada aprobado).

| Pendiente                                                                   | Origen                       | Clase                         | Resultado                                                                      |
| --------------------------------------------------------------------------- | ---------------------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| Validación canónica del P5 en `numeric`, criterio 2 de 5.8.4 (B7)           | PHASE3 §8 B7                 | Implementable                 | **Hecho**: grilla 289, `I_x` 1.573, `ln Γ` 230 (§2.1)                          |
| K3, K6, K7, K8, K10 sin ejecutar; K9 sólo con 20 envíos y sin el trabajo     | PHASE3 §5                    | Implementable                 | **Hecho** (§2.2); K7 con reloj real (§4)                                       |
| Interbloqueo del trabajo de sugerencias con el envío                         | encontrado por K6c           | Implementable                 | **Corregido** (migración nueva, §2.3)                                          |
| Interbloqueo del trabajo del motor con el envío                              | encontrado por J6            | Implementable                 | **Corregido** (misma migración)                                                |
| O-1: la función responde 500 sin JSON ni CORS sin clave de servicio          | PRE_RELEASE D/O-1            | Implementable                 | **Corregido** (§2.4)                                                           |
| AL18 / B5: simulador fuera del repositorio                                   | PHASE3 §8 B5                 | Implementable                 | **Hecho**: `tools/al-sim4/` reproduce los vectores byte a byte (§2.5)          |
| 35 valores de `L` publicados (parte del criterio 1 de 5.8.4)                 | MASTERY 5.8.4                | Implementable / decisión      | 25 validados; 10 sin respaldo, pendientes de decisión (§2.7)                   |
| D-5: la prueba AL19 de `srs2.test.mjs` falla si cruza la medianoche          | PRE_RELEASE D-5              | Implementable sólo con reloj inyectable | No se cambió (exigiría tocar funciones aprobadas); K7 cubre el caso real |
| X12: permisos por columna para un rol propio del trabajo de sugerencias      | PHASE3 X12                   | Validación en producción      | Sigue la guarda por trigger (I4), probada                                      |
| B8: repetir el inventario 15.3 paso 1                                        | PHASE3 §8 B8                 | Validación en producción      | En el corte                                                                    |
| `database.generated.ts` desactualizado                                       | PRE_RELEASE                  | Validación en producción      | Se regenera después de aplicar                                                 |
| F1–F10                                                                       | ADAPTIVE 19.4                | ver §3                        | Abiertas: datos reales, producto o legal                                       |

## 2. Implementado

### 2.1 Mastery: criterio 2 de 5.8.4 sobre la canónica `numeric`

`supabase/tests/pg17/mastery-precision.mjs` (PostgreSQL 17 real) contra referencias **independientes**
del algoritmo (identidad binomial, cuadratura tanh-sinh con los cambios de variable de 5.8.4, y `ln Γ`
exacto en `numeric` como Σ ln k y ln √π + Σ ln(k − ½)), las mismas de la réplica original:

| Conjunto                                    | Umbral (5.8.4)                     | Resultado SQL `numeric`              |
| ------------------------------------------- | ---------------------------------- | ------------------------------------ |
| Grilla 17 × 17 = 289 pares, `Q(0,05)`       | ≤ 10⁻¹⁰ y = a 4 decimales; = TS    | 289/289; máx. 4,73 · 10⁻¹³ (0,1; 0,005) |
| `I_x`: 11 × 11 pares × 13 `x` = 1.573       | ≤ 5,4 · 10⁻¹³ (lo observado en JS) | 1.573/1.573; máx. 5,01 · 10⁻¹⁴        |
| `ln Γ`: 170 factoriales + 60 semienteros    | ≤ 3,2 · 10⁻¹⁵ relativo             | 230/230; máx. exacto 5,17 · 10⁻¹⁶     |

El máximo de la grilla es el piso de la bisección de 40 pasos (cota rigurosa 4,6 · 10⁻¹³), como en la
réplica. Los 11 valores de α, β y los 13 de `x` de la prueba de `I_x` no estaban fijados en el documento
(la réplica original no quedó guardada): se eligieron cubriendo [0,005; 500] y 10⁻⁶…0,999 y están en el
script. Con esto la canónica cumple los criterios **1 (25 de los 35 valores publicados; §2.7), 2, 3 y 4**.
Habilitar el motor para Adaptive sigue siendo una decisión (§6).

### 2.2 SRS v2: escenarios de concurrencia K1–K11 completos

`supabase/tests/pg17/srs2-concurrency.mjs` (PostgreSQL 17, una conexión `psql` por sesión). Nuevo: un
verificador de invariantes de 13.3 por usuario (cada sesión aplicada exactamente una vez, `seq` sin
huecos, `t_srs` no decreciente, `replay` con `t_srs = máx(completed_at, t_srs anterior)`, `online` con
`t_srs ≥ v2_since`, recálculo por `seq` = guardado), y esperas por condiciones observables en lugar de
retardos fijos donde el intercalado importa.

| Escenario | Qué se comprueba                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| K3        | Tras K2: el orden por `seq` ≠ el orden por `completed_at`, y el recálculo por `seq` da el estado guardado              |
| K6 a      | La sugerencia se escribe sobre el estado de B; A confirma después y la anula (I6: `due_effective_at = due_at`)        |
| K6 b      | El trabajo corre mientras un envío tiene la unidad bloqueada: su escritura se descarta                               |
| K6c       | **Nuevo.** Orden cruzado: el lote escribe X y después llega a Y mientras un envío [X, Y] tiene Y y espera X           |
| K7        | Cambio de día local con reloj real (`--k7`): A completada el día d, aplicada el d+1 detrás de B; AL19 una sola vez, en B |
| K8        | Reloj que retrocede (inyectado como `last_t_srs` una hora adelante): `t_srs` no baja                                  |
| K9        | **100** envíos simultáneos con unidades solapadas + 12 ejecuciones del trabajo de sugerencias con la cola invertida   |
| K10 a/c   | Sesión antes de que la migración tome el bloqueo / sesión después de la migración                                     |
| K10 d     | Corte: el envío empezó con el v2 apagado, se enciende y la migración corre en medio: la sesión queda `online`        |
| K10 e     | Corte sin trabajo de migración: el trigger migra al confirmar; la sesión en curso queda aplicada una vez (ver X16)    |

K10 b es K11 (ya existía). `PG17_EXCLUDE=<migración>` permite correr la suite sin un arreglo para
mostrar el defecto.

### 2.3 Dos interbloqueos reales en los trabajos (migración `20261118120000_learning_machine_hardening.sql`)

Ninguno afecta hoy a usuarios (nada programa los trabajos), pero los dos aparecen en cuanto se programen
con usuarios activos, justamente sobre las unidades que esos usuarios acaban de estudiar.

1. **Trabajo de sugerencias (R1) contra un envío.** `srs_apply_me_hint` dejaba bloqueadas, durante el
   lote, las filas de `user_srs_state` que escribía, en el orden de la cola; `srs_v2_apply_session`
   bloquea las de una sesión en orden `(concept_id, dimension)`. Con el código anterior K6c da
   `deadlock detected`. Ahora el trabajo bloquea la unidad con `SKIP LOCKED` al leerla: si un envío la
   tiene, la deja en la cola para la ejecución siguiente (la sesión anula cualquier sugerencia, I6). La
   regla E(u, t), el candidato y las columnas que escribe (I4) no cambian; la comparación de `updated_at`
   se conserva.
2. **Trabajo del motor contra un envío.** El lote bloquea sus filas de `knowledge_recompute_queue`; un
   envío corre `mastery_mark_dirty` por corrección en el orden de los intentos (marca
   `user_concept_state` y reencola). Con el código anterior J6 da `deadlock detected` (la víctima fue la
   unidad del trabajo; con otros tiempos puede ser el envío del alumno). Ahora el trabajo no espera filas
   de `user_concept_state` que tenga otra transacción: la unidad queda pendiente sin sumar intentos, y el
   resultado informa `busy`. El cálculo `me-1.0.0` no cambia.

Aditiva: dos `create or replace function`, mismos permisos, sin tablas ni datos. Aplicarla no cambia
ningún comportamiento visible (los trabajos no corren).

### 2.4 O-1 en `learning-session`

Sin `SUPABASE_URL` o sin clave de servicio, `createClient` lanzaba antes del `try` y la respuesta salía
sin JSON ni CORS; un fallo de red de `auth.getUser` también escapaba. Ahora las dos situaciones
responden `500 {"error":"server_error"}` con CORS y lo registran en el log de la función. El escenario
«sin clave de servicio» del e2e en Deno ahora exige esa respuesta exacta. **No desplegado.**

### 2.5 AL18: simulador en el repositorio

`tools/al-sim4/`: el código del simulador de la rev. 4.2 copiado tal cual (clausura de importaciones del
generador de vectores y de los escenarios AL19/AL8, sin salidas) y `golden.mjs`, el generador de la fase 3
con otras rutas. `node tools/al-sim4/golden.mjs` comprueba que `shared/__tests__/fixtures/srs2-golden.json`
coincide byte a byte; `al19.mjs F1 V0 GT-B` reproduce byte a byte la fila guardada de la sesión de diseño.
Fuera del lint de la app. `cores.mjs` contiene los pesos por defecto publicados de FSRS-4.5/6/7 como datos
de comparación: entra en la revisión F10.

### 2.7 Los 35 valores de `L` publicados (criterio 1 de 5.8.4)

Fuente única: `shared/__tests__/fixtures/mastery-published-L.json` (los 35 valores de 5.8.1, 5.8.2, 7.6,
sección 8 y 10 que nombra la tabla de 5.8.4). La lista original de la réplica no quedó guardada; se
reconstruyó desde el documento aprobado. Sólo tienen α y β los valores cuyo par **publica** el documento
(o publica la fórmula y los conteos, 7.6), más E2 B, cuyo historial está completo en el texto y cuyo
recálculo da el `n_eff` (26,4898) y el `m` (0,9715) publicados.

- **25 validados:** SQL `numeric` = referencia independiente (≤ 10⁻¹⁰; máx. 4,55 · 10⁻¹³) = publicado a 4
  decimales = réplica TS.
- **10 pendientes de decisión, sin valor asignado:** E6 (4), E8 (3), E9 (3). La sección 8 dice que sus α y β
  «se reconstruyen con `m` y el `sd` publicados», pero la rev. 2 **no publica `sd`** para esos casos, y sus
  historiales no fijan días, ítems u orden dentro del día (que cambian `σ` y `φ`). La reconstrucción del
  calculador de la rev. 1 (fuera del repositorio) partía de las `L` normales de la rev. 1, que la rev. 2
  reemplazó: no es una fuente aprobada y no se usó.

Pruebas: `shared/__tests__/mastery.test.ts` (35 en el fixture, 25 con par, los 10 pendientes sin α/β, cada
par = publicado, E2 B = `modelEval`) y `supabase/tests/pg17/mastery-precision.mjs` (la canónica).

**Actualización (rev. 2.1 de `MASTERY_ENGINE_DESIGN.md`, aprobada por el usuario el 2026-11-10):** los
historiales originales de E6, E8 y E9 se recuperaron del calculador de la sesión de diseño (`me2.js`,
`extra.js`; SHA-256 en el apéndice 17) y quedaron transcritos en el documento. Estado final: **33
validados contra el motor canónico** (los 25 de arriba + E6 ×4, E8 ×3 y E9 sin prior, cuyo α y β calcula
`modelEval` desde el apéndice) y **2 validados sólo en el P5, pendientes del motor** (E9 con prior: el
motor no implementa K6). Errata: E9 «2 errores y 1 acierto» publica `L` = 0,1832 (antes 0,1831). Los
historiales están en `shared/__tests__/fixtures/mastery-e6-e8-e9-histories.json`.

**Actualización (rev. 2.2, aprobada por el usuario el 2026-11-10, opción A):** K6 (5.7) quedó
implementado **sólo en la implementación TypeScript de referencia** (`shared/mastery.ts`:
`MeInput.prior`, `ME_PARAMS.Np`). Con él se reproducen los 2 casos E9 con prior (α y β a < 10⁻⁹, `m`,
`L` 0,5285 y 0,1832, estado, «débil») y el «interno 0,7297»; su estado en el fixture pasa a
`validated_ts_k6_sql_pending`. Corrección de terminología: «motor canónico» en el párrafo anterior es
la implementación TypeScript de referencia; la SQL canónica `mastery_eval` no se comparó caso por caso
con los 33 y **no implementa K6** (no se modificó ninguna migración). Los 33 no cambian ni en un bit
(línea base `shared/__tests__/fixtures/mastery-k6-baseline.json` y repetición de las 6.028 llamadas
de las pruebas). Pendiente: K6 en SQL (migración nueva), snapshots (`level_snapshot_rows` no existe) y
dos reglas temporales sin definir (snapshot posterior a `as_of`, `frozen_at > t_last`). Detalle en la
sección 18 de `MASTERY_ENGINE_DESIGN.md`. Mastery sigue apagado.

**Actualización (rev. 2.3, decisiones K7 aprobadas por el usuario el 2026-11-11):** versión `me-1.0.1`
(`me-1.0.0` más K6). En `shared/mastery.ts`: selección del snapshot (`meSelectPrior`, `verified_at <=
as_of`, fila insuficiente sin prior), envejecimiento hasta `máx(t_last, frozen_at)` y rechazo de un
prior posterior a `as_of`; sin prior, idéntico bit a bit. En SQL, migración nueva **sin aplicar**
`20261119120000_mastery_k6_prior.sql` (`mastery_eval_core`, `mastery_eval_prior`, `mastery_eval` como
envoltorio idéntico, fila `me-1.0.1` en `shadow`) con su reversión en `supabase/rollback/`. Paridad en
PostgreSQL 17 (`supabase/tests/pg17/mastery-k6-parity.mjs`): 9.041/9.041 envoltorio = histórica byte a
byte y `me-1.0.1` = TypeScript, 0 diferencias; mutaciones y reversión verificadas. Los 35 vectores,
`validated` en TypeScript y en SQL. Pendiente: aplicar en producción, `mastery_prior_for` y snapshots
(fase 6) y pasar la cola a `me-1.0.1`. Detalle en la sección 19 de `MASTERY_ENGINE_DESIGN.md`. Mastery
y Adaptive siguen apagados.

**Corrección de alcance (rev. 2.4, 2026-11-11):** la opción A no autorizaba una migración. La migración
`20261119120000`, su reversión y `mastery-k6-parity.mjs` salieron de la vía activa y se conservan como
evidencia experimental en `tools/k6-sql-experiment/`. K6 queda sólo en TypeScript; la SQL canónica no
cambia y E9 con prior vuelve a `validated_ts_k6_sql_pending`. Detalle en la sección 20 de
`MASTERY_ENGINE_DESIGN.md`.

Estado real de K6 (opción A cerrada):
- Implementado en TypeScript, con la fórmula de 5.7 y los historiales originales.
- Los 33 casos históricos, idénticos.
- La paridad SQL/PostgreSQL 17 es de un ensayo local, no de una migración aprobada ni aplicada.
- La integración en la SQL canónica está pendiente de autorización.
- La selección del snapshot y su origen real (`level_snapshot_rows`) quedan para la fase 6.
- Mastery y Adaptive siguen apagados.

K6 no está integrado en el motor canónico (sección 20.5).

### 2.6 Conflicto nuevo entre texto y comportamiento (no se cambió código)

| #   | Tema                                         | Qué pasa                                                                                                                                                                                                                                                                                         |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| X16 | Envío en curso en el instante del encendido  | Si el v2 se enciende mientras un envío está en vuelo y nadie migró al usuario, el trigger lo migra al confirmar y la migración ya ve la sesión (misma transacción): queda como `replay` (no `online`), aplicada una vez, sin evaluar AL19 (C39) y verificada contra el v1 que esa misma sesión actualizó. K11 describe el caso con la sesión empezada con el v2 encendido. Se documenta; es determinista y el barrido da 0 |

## 3. F1–F10 y AL1–AL22

### F1–F10 (19.4): ninguna se resuelve en local

| #   | Decisión                                         | Clase                                    |
| --- | ------------------------------------------------ | ---------------------------------------- |
| F1  | Cambiar de núcleo (FSRS-6 / FSRS-7 restringido)  | Datos reales (≥ 20 000 repasos, ≥ 200 usuarios) |
| F2  | Pesos ajustados de PolyGo                        | Datos reales (ídem) + AL22               |
| F3  | `r` e `I_max`                                    | Datos reales (A/B ≥ 6 meses)             |
| F4  | Plaza semanal y umbrales de la escalera          | Datos reales (A/B con el motor activo)   |
| F5  | AL19 y sus umbrales                              | Datos reales (A/B, series de deuda)      |
| F6  | Ritmo por tipo de ejercicio y población          | Datos reales (≥ 200 usuarios, ≥ 2 000 sesiones) |
| F7  | Bloquear o limitar lecciones con deuda > 1·`B`   | **Decisión de producto** (+ telemetría)  |
| F8  | Reanclar `S` hacia el motor                      | Datos reales (motor activo, meses)       |
| F9  | Umbrales de unidades persistentes (AL17)         | Datos reales (con F2)                    |
| F10 | Licencias de las fuentes de FSRS                 | **Revisión legal**                       |

### AL1–AL22: todas aprobadas e implementadas en local

| AL                                  | Estado                                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| AL1                                 | Implementada; **encenderla depende de F10** (legal)                                           |
| AL2, AL3, AL9                       | Implementadas con los valores provisionales de 19.3 (sin cambios); revisión con F2/F3         |
| AL4, AL5, AL6, AL8, AL10, AL13–AL16, AL20, AL21, AL22 | Implementadas (fases 3–5); probadas                                       |
| AL7                                 | Implementada (sólo recomienda); bloquear lecciones = F7                                      |
| AL11                                | Implementada (Plus por el servidor, fase 4)                                                  |
| AL12                                | Implementada detrás de `enabled_for_display` (apagado)                                       |
| AL17                                | Implementada, apagada; umbrales = F9                                                         |
| AL18                                | **Cerrada ahora** (§2.5)                                                                     |
| AL19                                | Implementada; K7 la prueba con cambio de día real; umbrales = F5                             |

## 4. Pruebas ejecutadas (resultados exactos)

| Prueba                                                                  | Resultado                                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `pg17/mastery-precision.mjs`                                            | 289/289, 1.573/1.573, 230/230 (§2.1)                                                      |
| `pg17/srs2-concurrency.mjs --k7` (con el arreglo)                       | K1–K11, K6c, J1, J2 correctos; K7 en `UTC`: A completada 2026-11-10, aplicada 2026-11-11 |
| ídem **sin** el arreglo (`PG17_EXCLUDE=20261118120000_…`)               | **Falla K6c: `deadlock detected`** (defecto demostrado, dos corridas)                     |
| `pg17/jobs-concurrency.mjs` (con el arreglo)                            | 7/7                                                                                       |
| ídem **sin** el arreglo                                                 | 6/7: **J6 `deadlock detected`** (dos corridas)                                            |
| Deno 2.2.15 real, `deno/learning-session.e2e.mjs`                       | 32/32 escenarios (incluido O-1 con respuesta exacta)                                     |
| PGlite: `mastery`, `jobs`, `phase4close`, `legacyReviewRetirement`, `planned` | 36/36                                                                               |
| `tools/al-sim4/golden.mjs`; `al19.mjs F1 V0 GT-B`                       | idénticos byte a byte                                                                     |
| `tsc --noEmit` (app y `scripts`), `expo lint`                           | sin errores                                                                               |

Fallas de la propia prueba durante el trabajo, corregidas y vueltas a correr (no se ocultaron): K6 b con
retardos fijos bajo carga (pasó a esperas por condición), `pg_stat_activity` fotografiada una vez por
transacción (se limpia en cada vuelta), K6c contando una unidad que K6 b dejó en cola a propósito, y K7
con la medianoche calculada como «ahora + segundos» tomada tarde (pasó a la hora absoluta).

No se corrieron por rutina: Jest completo, `test:db` completo y `test:server` (no se tocó código de la
app, de `shared/` ni del servidor de partidas).

## 5. Qué falta para activar el Learning Machine con seguridad

1. **F10** (legal): bloquea encender el SRS v2 (AL1).
2. Aplicar en producción, archivo por archivo con fila manual en `schema_migrations` (nunca `db push`,
   D-4), las migraciones locales pendientes: C.1–C.7 y `20261118120000_learning_machine_hardening.sql`
   **antes de programar cualquier trabajo**.
3. Desplegar `learning-session` (O-1 y fases C) y la prueba autenticada con la cuenta de prueba.
4. Build de tiendas con las variables `EXPO_PUBLIC_*` de EAS y el checklist en dispositivo (§E.4).
5. Corte 15.3: repetir el inventario (B8), encender el v2, programar migración por lotes y barrido.
6. Motor para Adaptive: decidir cómo se cierran los 10 valores de E6, E8 y E9 sin par (§2.7) y la
   decisión de habilitarlo.
7. Programar los trabajos (`pg_cron`, `supabase/pending/learning_jobs_cron.sql`) sólo con la migración del
   punto 2 aplicada; vigilar `learning_jobs_status()`.
8. Ruta vieja de lecciones (`submit_learning_session` con veredicto del cliente): retiro según
   `LEARNING_PHASE5.md` §5 cuando la build nueva tenga adopción.

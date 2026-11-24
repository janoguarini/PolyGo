# Inventario de migración SRS v2 (paso 1 de §15.3)

Auditoría de sólo lectura de los datos actuales, como preparación para migrar al sistema
Adaptive Learning / SRS v2. Sigue el **paso 1 de §15.3** de `docs/ADAPTIVE_LEARNING_DESIGN.md`
(rev. 4.2, aprobada), con las categorías de §15.2 y el procedimiento de §15.3. No propone cambios
al diseño ni reabre AL1–AL22 o F1–F10. Donde el esquema real o los datos no coinciden con los
documentos aprobados, se deja anotado sin modificar nada.

---

## 1. Fecha y entorno

| Dato                  | Valor                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fecha de la auditoría | 2026-11-07. Instante de referencia: `now()` = **2026-11-07 20:32:59 UTC**                                                                                                                              |
| Entorno               | Proyecto Supabase **PolyGo** (producción, el único que hay), Postgres 17.11, región us-west-2. Sin staging, por indicación del usuario                                                                 |
| Acceso                | Herramienta `execute_sql` del MCP de Supabase, **sólo `SELECT`** sobre `public`, `pg_catalog`, `information_schema` y un conteo de `auth.users`. También `list_tables` y `list_migrations`, que son de lectura |
| Código revisado       | `supabase/migrations/*.sql` (funciones v1 y archivos de contenido), sólo lectura                                                                                                                       |
| Escrituras            | **Ninguna.** No se ejecutó INSERT, UPDATE, DELETE, DDL ni migraciones, y no se tocó ninguna configuración                                                                                              |

**Anonimización.** Los usuarios se llaman `U1`, `U2`, numerados por la fecha de su primera sesión
(con desempate por `md5(user_id)`). Las sesiones son `S1`…`S9`, en el orden canónico
`(completed_at, id)`. Este documento no incluye ningún UUID, nombre, correo ni código público. Los
identificadores de contenido (lecciones y ejercicios) no son datos personales y aparecen sólo donde
hacen falta para reproducir el análisis.

---

## 2. Metodología

1. **Esquema.** Se leyeron las columnas, restricciones, índices y triggers de las tablas que
   intervienen, y se buscó cada objeto que el diseño aprobado prevé crear (sección 8).
2. **Funciones v1 vigentes.** Se leyeron desde producción con `pg_get_functiondef`:
   `submit_learning_session`, `apply_word_result`, `srs_config`, `parse_learning_attempts` y
   `set_updated_at`. Las tres versiones de `submit_learning_session` que hay en el repo
   (`20261029021909`, `20261029140504`, `20261102004033`) tienen **la misma lógica SRS**: un
   resultado por palabra y sesión, con `bool_and` de los primeros intentos y las palabras de
   `exercise_words ∪ word_id`. `apply_word_result` y `srs_config` (`[1,3,7]`, etapa de dominio 3,
   mantenimiento 21 d) se definieron una sola vez y no cambiaron. **Así que un único modelo v1
   alcanza para rehacer todo el historial.**
3. **Clasificación por intento**, con las cuatro categorías del paso 1 de §15.3 (Q3). La
   categoría C reúne los intentos de lección modificados y los que no tienen ejercicio ni palabra
   (§15.2 C). Un usuario con más del 5 % de C se migra completo por conversión B (criterio de 4.1).
4. **Reconstrucción y verificación.** Se rehízo `apply_word_result` en una CTE recursiva de sólo
   lectura (Q5) sobre las observaciones reconstruidas, en el orden canónico
   `(completed_at, session_id)`. El resultado se comparó con `user_word_progress` así:
   - **Verificación oficial (§15.3, paso 5): seis campos**, `stage`, `seen_count`,
     `correct_count`, `incorrect_count`, `last_reviewed_at` y `next_review_at`. Una unidad queda
     verificada si coinciden los seis; si alguno difiere, se convierte. **Es el único criterio que
     decide.**
   - **Comparación extendida (diagnóstico):** suma `last_result` y `mastered_at`, que dan ocho
     campos. Se informa aparte y **no decide nada**: una diferencia en esos dos campos no lleva a
     conversión.

   Se corrió sobre los 2 usuarios, pero en la migración sólo cuenta para los que no superan el
   5 % de C (hoy, U2). Hay dos variantes:
   - **estricta** = regla aprobada de §15.2 A: palabras de una lección por `exercise_words` sólo si
     (1) `exercises.updated_at ≤ created_at` del intento y (2) la fila de `user_word_progress`
     tiene `created_at ≤ completed_at`. Es la que vale para la migración;
   - **ingenua** = todo `exercise_words` de hoy, sin las condiciones. **Sólo es un control de
     diagnóstico**: no es una regla aprobada y no se propone usarla.
5. **Contenido histórico.** Para los ejercicios que no pasan la condición 1, se compararon las
   versiones de contenido del repo (el JSON embebido en `content_a1_unit_01`) con un script local
   de sólo lectura. Es una comparación entre archivos: **no verifica qué se cargó en producción**
   (4.2).
6. **Deuda.** Se usó `user_word_progress.next_review_at` frente al instante de la auditoría, junto
   con la conversión B de §15.2 (`due_at = mín(next_review_at, t_last + I(S))`, con `S` según T1 de
   5.11 y `τ` = 1,637) y la capacidad `B = ⌊meta × 7,5⌋` de 8.1 con `ipu_pob` = 1,65 de 9.7. **No
   se generaron días históricos de deuda ni se evaluó AL19** (C39, §9.7).

Todas las consultas están en el **apéndice A**. Con este volumen (9 sesiones, 72 intentos), todas
leen las tablas completas: **las cifras son globales, no muestras**.

---

## 3. Inventario general

### 3.1 Totales

| Concepto                                                    | Cantidad                                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------ |
| Usuarios (`auth.users` = `profiles`)                        | **4** (los 4 con onboarding completo)                              |
| Usuarios con actividad de aprendizaje (≥ 1 sesión)          | **2** (U1, U2)                                                     |
| Usuarios sin sesiones                                       | 2 (sin filas en `user_word_progress`; uno tiene una batalla)       |
| Sesiones (`learning_sessions`)                              | **9**: 7 lecciones y 2 repasos                                     |
| Intentos (`exercise_attempts`)                              | **72**, de los que 65 son primeros intentos y 7 reintentos         |
| Filas de `user_word_progress`                               | **35** (U1: 18, U2: 17)                                            |
| `user_lesson_progress` / `user_daily_activity`              | 6 / 5 filas. La suma de `sessions_completed` es 9 y cuadra          |
| Contenido: unidades / lecciones / ejercicios / palabras     | 60 / 600 / 5 410 / 1 107, todo publicado                           |
| Vínculos `exercise_words`                                   | 10 101                                                             |
| Conceptos (`concepts`)                                      | **No existe la tabla** (sección 8)                                 |

### 3.2 Distribuciones

**Sesiones por usuario:** U1 = 6 (4 lecciones y 2 repasos), U2 = 3 (3 lecciones). Mediana 4,5;
no tiene sentido calcular percentiles con 2 usuarios.

**Actividad por idioma:**

| Idioma | Usuarios | Sesiones           | Intentos | Primeros intentos | Unidades (`user_word_progress`) | Palabras publicadas | Unidades curriculares |
| ------ | -------- | ------------------ | -------- | ----------------- | ------------------------------- | ------------------- | --------------------- |
| en     | 2        | 7 (5 lecc., 2 rep.) | 55       | 48                | 27 (U1 10, U2 17)               | 485                 | 24 (A1 y A2)          |
| it     | 1        | 2 (lecc.)          | 17       | 16                | 8 (U1)                          | 225                 | 12                    |
| pt     | 0        | 0                  | 0        | 0                 | 0                               | 215                 | 12                    |
| zh     | 0        | 0                  | 0        | 0                 | 0                               | 182                 | 12                    |

**Fechas:**

| Dato                         | Valor                                                                    |
| ---------------------------- | ------------------------------------------------------------------------ |
| Primera sesión               | 2026-10-30 13:15 UTC                                                     |
| Última sesión                | 2026-11-07 19:13 UTC                                                     |
| Días locales con actividad   | U1: 4 (10-30, 10-31, 11-01, 11-03); U2: 1 (11-07)                        |
| Antigüedad máxima            | 8,3 días                                                                 |
| Última actividad por usuario | U1: 2026-11-03 22:12 UTC (hace 3,9 d); U2: 2026-11-07 19:13 UTC (hace 1,3 h) |

### 3.3 Detalle por sesión

| Sesión | Usuario | Tipo   | Idioma / nivel | Día local  | Intentos (1.º / ✓) | Ejercicios publicados hoy en la lección |
| ------ | ------- | ------ | -------------- | ---------- | ------------------ | --------------------------------------- |
| S1     | U1      | lesson | en A1          | 2026-10-30 | 11 (9 / 8)         | 10 (había 9: e10 se agregó el 11-02)    |
| S2     | U1      | lesson | en A1          | 2026-10-31 | 8 (8 / 8)          | 10 (había 8: e09 y e10 se agregaron el 11-02) |
| S3     | U1      | review | en             | 2026-11-01 | 10 (10 / 10)       | —                                       |
| S4     | U1      | review | en             | 2026-11-03 | 1 (1 / 1)          | —                                       |
| S5     | U1      | lesson | it A1          | 2026-11-03 | 8 (8 / 8)          | 8                                       |
| S6     | U1      | lesson | it A1          | 2026-11-03 | 9 (8 / 7)          | 8                                       |
| S7     | U2      | lesson | en A2          | 2026-11-07 | 10 (7 / 5)         | 7                                       |
| S8     | U2      | lesson | en A2          | 2026-11-07 | 8 (7 / 6)          | 7                                       |
| S9     | U2      | lesson | en A2          | 2026-11-07 | 7 (7 / 7)          | 7                                       |

S9 repite la lección de S7 (`times_completed` = 2).

---

## 4. Reconstruibilidad del historial

### 4.1 Intentos por categoría (paso 1 de §15.3)

| Usuario   | Repaso con palabra | Lección vigente | Lección «modificada» (`updated_at` > intento) | Sin ejercicio ni palabra | Total  |
| --------- | ------------------ | --------------- | --------------------------------------------- | ------------------------ | ------ |
| U1        | 11 (11 primeros)   | 17 (16)         | **19 (17)**                                   | 0                        | 47 (44) |
| U2        | 0                  | 25 (21)         | 0                                             | 0                        | 25 (21) |
| **Total** | 11                 | 42 (37)         | 19 (17)                                       | **0**                    | 72 (65) |

Las combinaciones restantes (lección con `exercise_id` nulo, repaso con `word_id` nulo, lección
con `word_id` o repaso con `exercise_id`) dan **0**.

**Umbral del 5 % (§15.3, paso 1): criterio aplicado.**

- §15.2 C incluye de forma expresa como irrecuperable «el contenido exacto de un ejercicio
  modificado después del intento». Por eso, los intentos de lección «modificados» (condición 1 de
  §15.2 A) **cuentan en la categoría C**, junto con los que no tienen ejercicio ni palabra.
- Es el criterio conservador que se fijó en la revisión de este inventario (2026-11-07). Aplica el
  texto de §15.2 y §15.3 tal como está y no cambia ninguna decisión AL1–AL22 ni F1–F10.

| Usuario | Intentos en C (modificados + sin ejercicio ni palabra)  | Total | % de C   | Consecuencia (§15.3, paso 1)                                                       |
| ------- | ------------------------------------------------------- | ----- | -------- | ---------------------------------------------------------------------------------- |
| U1      | 19 + 0 = **19**                                         | 47    | **40,4 %** | **> 5 %: U1 se migra completo por conversión B.** No pasa por la verificación del paso 5 |
| U2      | 0 + 0 = 0                                               | 25    | 0 %      | ≤ 5 %: verificación unidad por unidad (paso 5)                                     |

Si se cuentan sólo los primeros intentos, U1 da 17/44 = 38,6 %. El resultado es el mismo.

### 4.2 Por qué hay intentos de lección «modificados»

- Los 17 ejercicios que se respondieron en S1 y S2 (`a1-u01-l01-e01…e09`, `a1-u01-l02-e01…e08`)
  tienen `created_at` 2026-10-29 y `updated_at` **2026-11-02 15:41:37**, el de una recarga del
  contenido de inglés.
- `set_updated_at()` pone `now()` en **cualquier** UPDATE, y los archivos de contenido cargan con
  `on conflict (id) do update`. Por eso `updated_at > intento` sólo prueba que **hubo una
  recarga**, no que el ejercicio haya cambiado.
- **Comparación entre archivos del repo.** Se compararon tres versiones de
  `content_a1_unit_01`: `20261029022122` (la que debería haber regido en S1), `20261030141219` (en
  S2) y `20261102120100` (la de hoy). **Entre esos archivos**, los 17 ejercicios coinciden en todos
  sus campos: tipo, habilidad, consigna, payload, respuesta, respuestas aceptadas, explicación,
  dificultad, segundos y lista de palabras.
- En esas lecciones, los archivos sólo **agregan ejercicios**: l01 pasa de 9 a 10 y l02 de 8 a 10.
  Esto coincide con lo que hay hoy en la base: e10, e09 y e10 tienen `created_at` 2026-11-02.
- **Límite (se mantiene): la comparación no es una verificación del contenido histórico.**
  - Muestra que los archivos coinciden entre sí. **No demuestra qué contenido se cargó en
    producción** en cada momento.
  - Las cargas de contenido no figuran en el historial de migraciones de producción (63
    registradas contra 120 archivos), y la base no guarda versiones del contenido. Por eso no se
    puede comprobar que lo aplicado sea lo que dicen los archivos, ni que no haya habido otras
    cargas o ediciones.
  - El contenido exacto de esos ejercicios en el momento del intento **sigue siendo información
    irrecuperable** (§15.2 C).
- **La comparación no cambia la clasificación.** La condición 1 marca esos 19 intentos como
  modificados, cuentan en la categoría C (4.1) y U1 se convierte.

### 4.3 Resultado de la reconstrucción con verificación (regla estricta §15.2 A + paso 5)

**Destino de cada unidad en la migración** (con el criterio de 4.1):

| Usuario   | Unidades (`user_word_progress`) | Vía de migración                        | **Verificadas** | **Convertidas (B)** | Irrecuperables |
| --------- | ------------------------------- | --------------------------------------- | --------------- | ------------------- | -------------- |
| U1        | 18 (10 `en`, 8 `it`)            | Conversión del usuario completo (C > 5 %) | 0               | **18**              | 0              |
| U2        | 17 (`en`)                       | Verificación unidad por unidad          | **17**          | 0                   | 0              |
| **Total** | **35**                          |                                         | **17 (48,6 %)** | **18 (51,4 %)**     | **0**          |

**Verificación oficial del paso 5 (seis campos).** Se corrió sobre los 2 usuarios. Para U1, los
resultados **no se usan en la migración**, porque se convierte completo:

| Usuario | Unidades | Coinciden en los 6 campos oficiales | Difieren en algún campo oficial | Uso en la migración                 |
| ------- | -------- | ----------------------------------- | ------------------------------- | ----------------------------------- |
| U1      | 18       | 8 (las de `it`)                     | 10 (las de `en`)                | Ninguno: las 18 se convierten (4.1) |
| U2      | 17       | **17**                              | 0                               | **Las 17 quedan verificadas**       |

Las 8 unidades de U1 en `it` coinciden con v1, pero **no se consideran verificadas**: la regla del
5 % se aplica por usuario, no por unidad.

**Comparación extendida (ocho campos: los seis oficiales + `last_result` + `mastered_at`), sólo como
diagnóstico:** da los mismos números (U1 8/10, U2 17/0). Ninguna unidad difiere sólo en
`last_result` o `mastered_at`, así que la comparación extendida no cambia ningún resultado. Aunque
lo hiciera, no decidiría ninguna conversión.

**Diferencias de las 10 unidades de U1 en `en`, por campo** (diagnóstico):

| Campo                                        | Unidades distintas | Tipo de campo |
| -------------------------------------------- | ------------------ | ------------- |
| `seen_count`                                 | 10                 | oficial       |
| `stage` / `correct_count` / `next_review_at` | 9                  | oficial       |
| `incorrect_count`                            | 1                  | oficial       |
| `last_reviewed_at`                           | 0                  | oficial       |
| `mastered_at`                                | 0                  | extendido     |

Las 10 difieren en `seen_count`, que es oficial, así que su diferencia vale con los seis campos.
`last_result` no se contó por campo. Como las 10 ya difieren en un campo oficial, eso no cambia
ninguna clasificación.

**Causa:** la regla estricta deja fuera las observaciones de S1 y S2, así que la historia
reconstruida empieza en el repaso S3 y le faltan una o dos sesiones.

**Control ingenuo** (todo `exercise_words` de hoy): **35 de 35 unidades coinciden en los 6
campos oficiales**, y también en la comparación extendida de 8. No sobra ni falta ninguna
unidad. Muestra que los vínculos de hoy son **compatibles**
con lo que v1 aplicó, pero **no es una verificación**:

- no es una regla aprobada;
- no prueba el contenido que había en el momento del intento (4.2);
- no cambia la conversión de U1.

### 4.4 Clasificación final (regla estricta §15.2 A, umbral del 5 % de 4.1)

| Categoría                                                     | Sesiones                                                        | Unidades                       | Usuarios       | Motivo                                                                                                                       | Fuente                                                                               | Limitaciones                                                                                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Reconstruible (verificada)**                             | 3 (S7, S8, S9)                                                  | **17** (U2 `en`)               | 1 (U2)         | C = 0 %; ejercicios sin recarga posterior; rehacer v1 da la fila exacta en las 17                                            | `exercise_attempts` + `exercises` + `exercise_words` + `user_word_progress.created_at` | Escalón conocido sólo por el `exercises.type` vigente; sin ayudas ni parciales (no existían); sólo la dimensión `vocabulary`                         |
| **2. Convertible (B)**                                        | 6 (S1–S6, todas las de U1)                                      | **18** (U1: 10 `en`, 8 `it`)   | 1 (U1)         | C = 40,4 % > 5 %: el usuario completo se migra por conversión (§15.3, paso 1)                                               | `user_word_progress` (etapa, contadores, fechas)                                     | La conversión pierde la secuencia de resultados; `n` y `λ` cuentan sesiones, no intentos                                                            |
| **3. Irrecuperable (unidades enteras)**                       | 0                                                               | **0**                          | 0              | Toda unidad tiene fila de v1 para convertir o historia que se verifica                                                       | —                                                                                    | —                                                                                                                                                   |
| **3'. Irrecuperable (información parcial, no unidades)**      | S1, S2 (contenido en el momento del intento); S3, S4 (escalón de repaso); las 9 (ayudas, parciales, historial de v1) | —                              | 2              | §15.2 C: contenido exacto de los 19 intentos modificados, tipo de ejercicio de los repasos (11 intentos), ayudas, parciales, dimensiones ≠ `vocabulary`, historial anterior de `user_word_progress` | —                                                                                    | Para U2, el escalón conservador; para U1, lo que la conversión B no conserva                                                                        |

**Global: 17 unidades verificadas, 18 convertidas y 0 irrecuperables.**

**Las sesiones no son unidades.** Que las sesiones de U1 figuren en la fila «Convertible» quiere
decir que **sus unidades** se convierten. Las 9 sesiones siguen pasando por el procedimiento de
§15.3: lo que se decide en este paso es cómo se obtiene el estado de cada unidad, no si se pierde
alguna sesión.

---

## 5. `user_word_progress` como verificación

**Contenido actual:**

| Dato                                            | Valor                                                                                                |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Filas                                           | 35; una por (usuario, palabra), sin historial                                                        |
| Etapas                                          | 3 en etapa 0, 22 en etapa 1, 10 en etapa 2, 0 en etapa ≥ 3                                           |
| `mastered_at` no nulo                           | 0                                                                                                    |
| `next_review_at` / `last_reviewed_at` nulos     | 0 / 0                                                                                                |
| `updated_at` = `last_reviewed_at`               | 35/35                                                                                                |
| `created_at` / `last_reviewed_at` que son el `completed_at` de una sesión del usuario | 35/35 / 35/35                                  |

**Unidades con fila de v1:** 35 de 35 (100 %), y toda fila tiene al menos una observación
reconstruida. **Unidades sujetas a la verificación del paso 5:** sólo las 17 de U2, porque U1 queda
fuera por el umbral del 5 %.

| Resultado                                                  | Unidades                                                                            |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Verificadas (U2, coinciden los 6 campos oficiales)         | **17**                                                                              |
| Diferencias en campos oficiales entre las unidades sujetas a verificación | 0                                                    |
| Diferencias sólo en la comparación extendida (`last_result`, `mastered_at`) | 0. No decidirían una conversión          |
| Necesitan conversión                                       | **18**: todas las de U1, por el umbral del 5 %, no por discrepancias de unidad      |
| No se pueden verificar ni convertir                        | 0                                                                                   |
| *Diagnóstico de U1 (no se usa)*                            | *En los 6 campos oficiales, 8 coinciden y 10 difieren (4.3)*                        |

**Conversión B de las 18 unidades de U1** (`S` según T1 de 5.11, `I(S) = S·τ`, `τ` = 1,637):

| Grupo     | Etapa v1 | Unidades | `S`   | `I(S)` | `due_at = mín(next_review_at, t_last + I(S))` |
| --------- | -------- | -------- | ----- | ------ | --------------------------------------------- |
| U1 · `en` | 2        | 10       | 22,00 | 36,0 d | = `next_review_at` de v1 en las 10            |
| U1 · `it` | 1        | 7        | 3,96  | 6,5 d  | = `next_review_at` de v1 (`t_last` + 1 d)     |
| U1 · `it` | 0        | 1        | 0,2 (`w0`) | 0,33 d | = `next_review_at` de v1 (= `t_last`)    |

En las 18, la conversión **no adelanta ni aplaza** lo que v1 tenía programado. Además:

- `D` = `D0(Good)`;
- `n` = `seen_count` (suma 29 en U1);
- `λ` = `incorrect_count` (suma 2 en U1).

Estos valores salen de aplicar la regla de §15.2 B a las filas leídas con Q6. No se calculó ningún
estado v2.

**Lo que esta verificación no puede ver:**

- Como sólo existe la última fila, una historia distinta que termine en el mismo estado pasaría
  igual la verificación. Con este volumen (≤ 4 sesiones por unidad) el riesgo es bajo, pero no se
  puede medir.
- `last_result` y `mastered_at` no forman parte de la verificación oficial y no deciden ninguna
  conversión. En la comparación extendida coinciden en las unidades verificadas.

---

## 6. Diagnóstico de deuda

**Unidades aprendidas.** En v1 hay 32 en etapa ≥ 1 y 3 en etapa 0 (falladas en su última sesión).
**Ninguna está dominada** (`mastered_at` nulo en todas). Tener una etapa en v1 significa que hubo
actividad, **no que haya dominio demostrado**.

### 6.1 Vencidos al instante de la auditoría (2026-11-07 20:33 UTC)

| Usuario · idioma | Unidades | Vencidas ahora                          | Atraso                                                       | Próximos vencimientos                           | Tipo de deuda                                                                                                                                                                                             |
| ---------------- | -------- | --------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| U1 · en          | 10       | **10**                                  | 0,93–3,17 d                                                  | —                                               | **Calculada con evidencia.** Son unidades convertidas, y la conversión conserva el `next_review_at` de v1                                                                                                |
| U1 · it          | 8        | **8**                                   | 2,93 d (7 en etapa 1) y 3,93 d (1 fallada)                    | —                                               | **Calculada con evidencia.** Son unidades convertidas (5), y la conversión conserva el `next_review_at` de v1                                                                                            |
| U2 · en          | 17       | **2** en v1 (falladas hoy, `next` = `t`) | 0,06 d                                                       | 15 el 2026-11-08 entre 19:08 y 19:13 UTC        | **v1: confirmada. v2: estimada.** En v2 un error pleno da `due = t + mín(I, 1 d)` y no se repite el mismo día local, así que serían **0 hoy** y ~17 mañana                                                    |
| **Total**        | **35**   | **20 (v1)**                             | máx. 3,93 d                                                  | 35/35 vencidas antes del 2026-11-08 20:33 UTC  |                                                                                                                                                                                                           |

**Deuda en ítems** (`pend × ipu_pob`, con `ipu_pob` = 1,65, que §19.3 indica que sobreestima):

| Usuario | Cálculo           | Ítems                         | Fracción de `B` (75) |
| ------- | ----------------- | ----------------------------- | -------------------- |
| U1      | 18 × 1,65         | 29,7                          | 0,40                 |
| U2      | 2 × 1,65 (hoy)    | 3,3                           | —                    |
| U2      | 17 × 1,65 (desde 2026-11-08) | 28,05              | 0,37                 |

**Qué deuda se puede saber y cuál no:**

- **Calculable con evidencia:** las fechas de v1 de las 35 unidades y el `due_at` de v2 de las 18
  convertidas de U1, que es idéntico al de v1 (5).
- **Sólo estimable:**
  - el `due_at` de v2 de las 17 verificadas de U2: depende de los pesos y de `srs_v2_update`, que no
    existe todavía. La dirección es segura: el escalón conservador nunca da más `S`, así que los
    vencimientos no se aplazan respecto de lo estimado;
  - la deuda en ítems, porque `ipu` no se midió.
- **No determinable:**
  - la deuda en la **fecha real del corte**: no está fijada, y para entonces cambian la actividad
    y los vencimientos;
  - cualquier deuda diaria histórica, porque las metas pasadas no se registraron. **No se generó
    ni se debe generar** (C39);
  - el ritmo real de cada usuario: hay 2 usuarios con 3–6 sesiones, y percentiles con eso serían
    ruido.

### 6.2 Capacidad de mantenimiento

| Dato                                        | Valor                                                                                                                                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta configurada **hoy**                    | U1 y U2: 10 min. Da `B` = 75 ítems/día (≈ 45 unidades vencidas/día con `ipu` 1,65). Es la meta actual, no la histórica                                                                                     |
| Usuarios sin sesiones                       | Metas de 20 y 10 min, pero 0 unidades                                                                                                                                                                         |
| Carga estacionaria aproximada con `I_max` 45 | `Σ 1,65 / mín(45, I(S))` ≤ 35 × 1,65 / 1 ≈ 58 ítems/día en el peor caso, con todas las unidades a intervalo de 1 día. A medida que suben los intervalos tiende a ~1,3 ítems/día. Es una cota, no una medición |

Ningún usuario tiene más unidades aprendidas de las que su capacidad diaria puede mantener.

---

## 7. Usuarios con deuda extraordinaria

**No hay ninguno.**

| Usuario | Deuda estimada (ítems)                | Capacidad diaria `B` | Recuperación teórica | Nota                                  |
| ------- | ------------------------------------- | -------------------- | -------------------- | ------------------------------------- |
| U1      | 29,7 (18 unidades)                    | 75                   | 1 día de estudio     | 3,9 días sin actividad                |
| U2      | 3,3 hoy; 28,05 desde 2026-11-08       | 75                   | 1 día de estudio     | Toda su actividad es del 2026-11-07   |

**Límites de esta estimación:**

- `B` usa la meta actual y el ritmo supuesto de 7,5 por minuto, que no está calibrado. El ritmo
  observado es mayor (10,9–12,5 por minuto, §8.1).
- `ipu` 1,65 sobreestima.
- La recuperación supone que el usuario estudia y que el planificador dedica el presupuesto a la
  deuda.
- **Que hoy no haya deuda extraordinaria no dice nada de cómo estará en la fecha del corte.**

La condición de §9.7 para diseñar aparte una protección de arranque («usuarios con `pend × ipu_pob`
de muchas sesiones en el corte») **no se cumple con los datos de hoy**: el máximo es 0,40·`B`, es
decir, menos de una sesión.

---

## 8. Compatibilidad con §15.3

### 8.1 Tablas y columnas necesarias que ya existen

| Necesidad de §15.2–15.3                                   | Estado real                                                                                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `learning_sessions.completed_at` lo pone el servidor      | ✔ Columna `not null default now()`; la RPC la llena con `now()` y coincide en todas con `exercise_attempts.created_at` (72/72)                    |
| `exercise_attempts.exercise_id` / `word_id` nulables, `on delete set null` | ✔ Confirmado (FK `ON DELETE SET NULL`). Hoy hay 0 nulos en ambos                                                                  |
| `is_first_try`, `is_correct`, `response_ms`, `skill`      | ✔ Presentes, `not null`                                                                                                                          |
| `exercises.updated_at`, `exercises.type`                  | ✔ Presentes; trigger `set_updated_at` incondicional (4.2)                                                                                        |
| `exercise_words` (sin fecha)                              | ✔ PK `(exercise_id, word_id)`, FK `ON DELETE CASCADE` a ejercicio y palabra                                                                      |
| `user_word_progress` con `created_at` y los 6 campos que se verifican | ✔ Todos presentes                                                                                                                    |
| `apply_word_result` determinista y replicable             | ✔ Replicado en SQL de lectura, con 35/35 coincidencias en el control                                                                             |

### 8.2 Objetos del diseño que todavía no existen

Se buscaron con `to_regclass` y `pg_proc`. Es lo esperado: AL-1 no está implementado, ni lo
están las fases 1–2 de la arquitectura.

- Tablas: `concepts`, `ref_concept_kinds`, `user_srs_state`, `srs_user_head`,
  `srs_applied_sessions`, `srs_migration_queue`, `srs_migration_cutoff`, `srs_user_debt_days`,
  `srs_user_debt_state`.
- Funciones: `record_learning_session`, `srs_v2_apply_session`, `srs_v2_update`.

### 8.3 Datos faltantes y diferencias con los documentos

1. **No hay correspondencia palabra → concepto léxico.** §15.2 A la toma de `concepts.word_id` y
   `ref_concept_kinds`, que no existen. Hasta que la fase de la arquitectura cree los conceptos, la
   unidad (concepto léxico, `vocabulary`) **no tiene identificador**. En este informe, «unidad» se
   contó como (usuario, palabra), que es 1:1 con `user_word_progress`.
2. **`learning_sessions` no tiene idioma.**
   - Sale de `lesson_id → lessons → curriculum_units.language_code` en las lecciones, y de
     `word_id → words.language_code` en los repasos.
   - Hoy es inequívoco: cada repaso tiene palabras de un solo idioma, y hay 0 vínculos de una
     lección a palabras de otro idioma.
   - Ninguna restricción garantiza que un repaso futuro no mezcle idiomas.
3. **No existe el conjunto de «idiomas del usuario».** §9.7 inicializa AL19 «en cada idioma del
   usuario», pero `profiles.target_language` es uno solo: U1 tiene `en` y también estudió `it`. El
   conjunto se tiene que derivar de las sesiones o de `user_word_progress`.
4. **No hay `affects_srs` ni `origin` en las sesiones.** Hoy las 9 son `lesson`/`review` y en v1
   todas afectan al SRS.
5. **Las cifras de §15.1 y §8.1 del diseño están desactualizadas.** Decían 1 usuario, 18 filas, 6
   sesiones y 47 intentos; hoy son **2 usuarios, 35 filas, 9 sesiones y 72 intentos**. U2 apareció
   el 2026-11-07 entre las 19:06 y las 19:13 UTC.
6. **El orden dentro de una sesión** sólo lo da `exercise_attempts.id` (identity, insertado
   `order by ord`): no hay columna `ord`, y todos los intentos de una sesión tienen el mismo
   `created_at`. Para v1 no importa, porque agrega por (palabra, sesión).

### 8.4 Tipos, relaciones y restricciones

- **Tipos:** `session_id` es `uuid`, que sirve para desempatar el orden canónico.
  `exercise_attempts.id` es `bigint` identity, compatible con el «máximo `exercise_attempts.id`»
  de `srs_migration_cutoff`. `exercise_id` y `word_id` son `text`. No hay incompatibilidades.
- **No hay restricciones que impidan la reconstrucción.** Las de `learning_sessions` (`kind`,
  `lesson_id` coherente, totales > 0) se cumplen en las 9.

### 8.5 Integridad referencial (todos los resultados medidos en 0)

- intentos huérfanos o con usuario distinto del de su sesión;
- sesiones sin intentos;
- sesiones cuyo `total_answers` no coincide con sus intentos;
- primeros intentos duplicados por (sesión, ejercicio);
- ejercicios intentados sin `exercise_words`;
- filas de `user_word_progress` sin una sesión que las explique.

### 8.6 Riesgos de duplicación o pérdida

- **Hueco de ids:** `exercise_attempts.id` va de 21 a 92 con la secuencia en 92, así que los ids
  1–20 no tienen fila.
  - Puede deberse a transacciones revertidas (una secuencia no devuelve valores) o a filas
    borradas en cascada.
  - **Con los datos no se puede saber cuál.** No hay ninguna fila de v1 que lo delate (35/35 se
    explican con las sesiones existentes).
  - El corte guarda el máximo id y el hash de los ids existentes, no la continuidad, así que el
    hueco no lo rompe.
- **Borrados en cascada:**
  - `learning_sessions`, `exercise_attempts` y `user_word_progress` se borran en cascada con
    `profiles`;
  - `exercise_words` se borra con la palabra o el ejercicio;
  - `exercise_attempts.word_id`/`exercise_id` pasan a nulo.

  **Un borrado de contenido entre este inventario y el corte crearía intentos de la categoría C
  que hoy no existen.** Conviene repetir el conteo en el corte.
- **Duplicación:** el registro previsto en `srs_applied_sessions` (paso 2) todavía no existe. En
  v1, la idempotencia está en la PK de `learning_sessions` más el `on conflict (id) do nothing`
  de la RPC. No se observaron duplicados.

### 8.7 Orden canónico `(completed_at, session_id)`

Por usuario e idioma:

| Usuario · idioma | Sesiones | Empates de `completed_at` | Solapes `[started_at, completed_at]` | Distancia mínima entre `completed_at` |
| ---------------- | -------- | ------------------------- | ------------------------------------ | ------------------------------------- |
| U1 · en          | 4        | 0                         | 0                                    | 14,4 h                                |
| U1 · it          | 2        | 0                         | 0                                    | 53 s                                  |
| U2 · en          | 3        | 0                         | 0                                    | 104 s                                 |

- Con distancias de ≥ 53 s y transacciones de milisegundos, **ninguna unidad depende de un
  posible orden de commit distinto**.
- En U2, el orden canónico reproduce v1: es parte de su verificación, 17/17. En U1 no hace falta
  probarlo, porque se convierte. El control ingenuo (35/35) es compatible con esto, pero es sólo
  un diagnóstico (4.3).
- **Límite:** la hora de confirmación no está registrada, así que lo que se puede decir es que no
  hay solapes ni empates, no que el orden esté probado.

---

## 9. Limitaciones y datos que no pudieron verificarse

1. **Contenido histórico.**
   - No se puede saber qué contenido exacto se cargó en producción en el momento de S1 y S2: la
     base no guarda versiones del contenido, y las cargas no figuran en `supabase_migrations`.
   - Los archivos del repo coinciden entre sí (4.2), pero eso **no es una verificación** de lo que
     se cargó.
   - Esta información sigue siendo irrecuperable (§15.2 C) y es la que manda a U1 a conversión.
2. **El estado v2 exacto** (`S`, `D`, `due_at`) de las 17 unidades verificadas de U2:
   `srs_v2_update` no está implementado. Lo que da este informe para esas unidades en v2 son
   **estimaciones**, no cálculos. En las 18 de U1 sólo se aplicó la regla de conversión (5).
3. **El origen del hueco de ids 1–20.**
4. **El ritmo real y `ipu` por usuario:** no hay muestra suficiente.
5. **Las metas históricas:** no se registran. Sólo se usó la meta actual, para la capacidad desde
   el corte.
6. **Usuarios eliminados:** si hubo cuentas borradas, sus datos ya no existen (cascada) y no se
   pueden contar.
7. **El escalón de los repasos** (11 intentos, S3 y S4): no se registró y es irrecuperable por
   diseño.
8. **Validez en el tiempo:** las cifras describen el 2026-11-07 a las 20:33 UTC. Cualquier sesión
   posterior las cambia.

---

## 10. Conclusión

Con el criterio del umbral del 5 % de 4.1:

| Medida                               | Resultado                                |
| ------------------------------------ | ---------------------------------------- |
| Unidades reconstruidas y verificadas | **17 / 35 (48,6 %)**: las de U2          |
| Unidades convertidas (B)             | **18 / 35 (51,4 %)**: todas las de U1    |
| Unidades irrecuperables              | **0**                                    |
| Usuarios migrados por verificación   | 1 (U2, C = 0 %)                          |
| Usuarios migrados por conversión     | 1 (U1, C = 40,4 %)                       |

- **Sesiones:** ninguna se pierde. Las 9 pasan por el procedimiento de §15.3: las 3 de U2 sostienen
  la reconstrucción verificada, y el estado de las unidades de U1 sale de la conversión.
- **Intentos:**
  - el 26 % (19/72) está en la categoría C: son intentos de lección modificados, todos de U1;
  - ningún intento quedó sin ejercicio ni palabra;
  - los archivos del repo sugieren que la marca de «modificado» se debe a una recarga, pero eso no
    está verificado en producción (4.2), así que la clasificación no cambia.
- **Lo irrecuperable es información parcial, no unidades enteras:** el contenido en el momento de
  los 19 intentos modificados, el escalón de 11 intentos de repaso, las ayudas, los parciales y el
  historial de v1.
- **Deuda:** 20 unidades vencidas en v1 al momento de la auditoría y 35 en las próximas 24 h. El
  máximo por usuario es 0,40·`B`. No hay deuda extraordinaria.

---

## 11. Recomendaciones para la siguiente etapa (sin implementar)

1. **Repetir este inventario en el momento del corte** (Q3, Q5, Q7 y Q8), con el mismo criterio
   del 5 % (4.1): los datos cambian, y U2 apareció hoy.
2. **Registrar el hallazgo de `updated_at`** (4.2) para quien implemente la migración.
   - Con la regla vigente, una recarga de contenido marca como «modificados» todos los intentos
     anteriores de las lecciones que toca, aunque el contenido no cambie.
   - Como esos intentos cuentan en la categoría C, **una sola recarga puede llevar a un usuario
     entero a conversión**. Es lo que pasó con U1.
   - Es una consecuencia de la regla, no un error de los datos. Si se quiere tratar, es una
     decisión aparte.
3. **Evitar recargas o borrados de contenido** entre el inventario final y el corte. Una recarga
   suma intentos «modificados» a la categoría C, y un borrado crea intentos sin ejercicio ni
   palabra. Las dos cosas pueden hacer que más usuarios pasen el umbral del 5 %.
4. **Requisitos previos** de AL-1, que este inventario no puede cubrir:
   - la correspondencia palabra → concepto (fases 1–2 de la arquitectura);
   - una regla para derivar el idioma de sesión y el conjunto de idiomas por usuario (8.3,
     puntos 2 y 3).
5. **Protección de arranque:** con los datos actuales no hace falta diseñar una (sección 7).
   Volver a evaluarlo con el inventario del corte.

---

## Apéndice A. Consultas de sólo lectura

Todas son `SELECT`. La anonimización `U<n>` se calcula en cada consulta y no se guarda en ninguna
parte.

**Q1 — Esquema** (columnas, restricciones, triggers, índices):

```sql
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema='public' and table_name in ('learning_sessions','exercise_attempts','user_word_progress',
  'exercise_words','exercises','words','lessons','profiles','languages')
order by table_name, ordinal_position;

select c.conrelid::regclass tbl, c.conname, pg_get_constraintdef(c.oid)
from pg_constraint c join pg_namespace n on n.oid=c.connamespace
where n.nspname='public' and c.conrelid::regclass::text in ('learning_sessions','exercise_attempts',
  'user_word_progress','exercise_words','exercises','words','lessons','curriculum_units');

select tgrelid::regclass::text, tgname::text, pg_get_triggerdef(t.oid) from pg_trigger t
where not tgisinternal and tgrelid::regclass::text in ('exercises','exercise_words','words','lessons',
  'user_word_progress','learning_sessions','exercise_attempts')
union all
select 'idx', indexrelid::regclass::text, pg_get_indexdef(indexrelid) from pg_index
where indrelid::regclass::text in ('exercise_attempts','learning_sessions','user_word_progress','exercise_words');
```

**Q2 — Funciones v1 vigentes:**

```sql
select p.proname, pg_get_functiondef(p.oid) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in ('apply_word_result','submit_learning_session',
  'parse_learning_attempts','set_updated_at');
select public.srs_config();
```

**Q3 — Intentos por categoría y usuario:**

```sql
with u as (select user_id, 'U'||row_number() over (order by min(completed_at), md5(user_id::text)) lbl
           from public.learning_sessions group by user_id),
a as (select ea.*, ls.kind, e.updated_at ex_upd from public.exercise_attempts ea
      join public.learning_sessions ls on ls.id=ea.session_id left join public.exercises e on e.id=ea.exercise_id)
select u.lbl, kind, count(*) attempts, count(*) filter (where is_first_try) first_try,
  count(*) filter (where kind='review' and word_id is not null) review_word,
  count(*) filter (where kind='lesson' and exercise_id is not null and ex_upd<=created_at) lesson_current,
  count(*) filter (where kind='lesson' and exercise_id is not null and ex_upd>created_at) lesson_modified,
  count(*) filter (where exercise_id is null and word_id is null) c_null,
  count(*) filter (where kind='lesson' and exercise_id is null and word_id is not null) lesson_word_only,
  count(*) filter (where kind='review' and word_id is null) review_no_word
from a join u using (user_id) group by 1,2 order by 1,2;
```

**Q4 — Totales, sesiones y fechas:** conteos de cada tabla de 3.1, y por sesión el idioma por
`lessons → curriculum_units` o `words`, los intentos (todos, primeros y acertados), los ejercicios
publicados hoy en la lección y la igualdad `exercise_attempts.created_at = completed_at`. También
la distribución de `exercises.updated_at` por idioma y minuto, y los ejercicios de cada lección
creados después de la sesión.

**Q5 — Reconstrucción y verificación** (el núcleo del análisis):

```sql
with recursive ls as (select id, user_id, completed_at from public.learning_sessions),
links as (
  select 'strict' variant, ea.user_id, ea.session_id, ea.word_id, ea.is_correct
  from public.exercise_attempts ea where ea.is_first_try and ea.word_id is not null
  union all
  select 'naive', ea.user_id, ea.session_id, ea.word_id, ea.is_correct
  from public.exercise_attempts ea where ea.is_first_try and ea.word_id is not null
  union all
  select v.variant, ea.user_id, ea.session_id, ew.word_id, ea.is_correct
  from public.exercise_attempts ea join ls on ls.id = ea.session_id
  join public.exercises e on e.id = ea.exercise_id
  join public.exercise_words ew on ew.exercise_id = ea.exercise_id
  left join public.user_word_progress p on p.user_id = ea.user_id and p.word_id = ew.word_id
  cross join (values ('strict'), ('naive')) v(variant)
  where ea.is_first_try
    and (v.variant = 'naive'
         or (e.updated_at <= ea.created_at and p.created_at <= ls.completed_at))),   -- §15.2 A, condiciones 1 y 2
obs as (select l.variant, l.user_id, l.word_id, l.session_id, ls.completed_at at, bool_and(l.is_correct) ok
        from links l join ls on ls.id = l.session_id group by 1,2,3,4,5),        -- un resultado por palabra y sesión
ord as (select *, row_number() over (partition by variant, user_id, word_id order by at, session_id) rn from obs),
rec as (                                                                         -- réplica de apply_word_result
  select variant, user_id, word_id, 0::bigint rn, 0 stage, 0 seen, 0 correct, 0 incorrect,
         null::boolean last_result, null::timestamptz last_rev, null::timestamptz next_rev, null::timestamptz mastered
  from ord where rn = 1
  union all
  select r.variant, r.user_id, r.word_id, o.rn,
    case when not o.ok then 0 when (r.seen=0 or r.next_rev is null or r.next_rev<=o.at) then r.stage+1 else r.stage end,
    r.seen+1, r.correct+(o.ok)::int, r.incorrect+(not o.ok)::int, o.ok, o.at,
    case when not o.ok then o.at
         when not (r.seen=0 or r.next_rev is null or r.next_rev<=o.at) then r.next_rev
         when r.stage+1 <= 3 then o.at + make_interval(days => (array[1,3,7])[r.stage+1])
         else o.at + make_interval(days => 21) end,
    case when not o.ok then null
         when (case when (r.seen=0 or r.next_rev is null or r.next_rev<=o.at) then r.stage+1 else r.stage end) >= 3
           then coalesce(r.mastered, o.at) else r.mastered end
  from rec r join ord o on o.variant=r.variant and o.user_id=r.user_id and o.word_id=r.word_id and o.rn=r.rn+1),
fin as (select distinct on (variant, user_id, word_id) * from rec order by variant, user_id, word_id, rn desc),
u as (select user_id, 'U'||row_number() over (order by min(completed_at), md5(user_id::text)) lbl
      from public.learning_sessions group by user_id),
cmp as (
  select coalesce(f.variant, p.variant) variant, coalesce(f.user_id, p.user_id) user_id,
         f.word_id is not null has_rec, p.word_id is not null has_uwp,
         -- verificación oficial (§15.3, paso 5): exactamente seis campos; es la única que decide
         (f.stage=p.stage and f.seen=p.seen_count and f.correct=p.correct_count and f.incorrect=p.incorrect_count
          and f.last_rev is not distinct from p.last_reviewed_at
          and f.next_rev is not distinct from p.next_review_at) official_match,
         -- comparación extendida (diagnóstico, no decide conversiones): seis + last_result + mastered_at
         (f.last_result is not distinct from p.last_result
          and f.mastered is not distinct from p.mastered_at) extra_fields_match
  from fin f full join (select v.variant, p.* from public.user_word_progress p
                        cross join (values ('strict'), ('naive')) v(variant)) p
    on p.variant=f.variant and p.user_id=f.user_id and p.word_id=f.word_id)
select u.lbl, variant, count(*) filter (where has_uwp) uwp_rows, count(*) filter (where has_rec) rec_units,
  count(*) filter (where has_uwp and has_rec and official_match) verified,            -- criterio oficial
  count(*) filter (where has_uwp and has_rec and not official_match) mismatch,        -- criterio oficial
  count(*) filter (where has_uwp and has_rec and official_match and extra_fields_match) extended_match,  -- diagnóstico
  count(*) filter (where has_uwp and not has_rec) uwp_without_rec,
  count(*) filter (where has_rec and not has_uwp) rec_without_uwp
from cmp join u using (user_id) group by 1,2 order by 1,2;
```

**Qué se ejecutó y por qué los resultados no cambian.**

- La versión que se ejecutó el 2026-11-07 usaba un único indicador de coincidencia con los ocho
  campos, más el conteo de diferencias de `d_stage`, `d_seen`, `d_correct`, `d_incorrect`,
  `d_last`, `d_next` y `d_mastered`. La de arriba separa el criterio oficial (`official_match`)
  del diagnóstico (`extra_fields_match`). No se volvió a ejecutar.
- El resultado oficial se deduce de lo que se ejecutó, sin recalcular nada:
  - toda unidad que coincidía en los ocho campos coincide también en los seis (U2: 17;
    U1 `it`: 8);
  - las 10 unidades de U1 en `en` que no coincidían difieren en `seen_count`, que es un campo
    oficial;
  - por lo tanto, las cifras con seis campos son idénticas a las informadas.

**Q6 — Deuda y conversión por usuario, idioma, estado de verificación y etapa:** es la misma
reconstrucción estricta. Calcula `next_review_at <= now()`, el atraso en días,
`least(next_review_at, last_reviewed_at + S·1,637 d)` con `S` = 0,2 / 3,96 / 22,00 / 27,5 según la
etapa 0 / 1 / 2 / ≥ 3, y si ese `due_at` convertido ya venció. Las metas se tomaron de
`profiles.daily_goal_minutes` (`B = floor(meta × 7,5)`).

**Q7 — Solapamiento para el orden canónico:**

```sql
with s as (select ls.*, coalesce(cu.language_code, (select min(w.language_code) from public.exercise_attempts ea
             join public.words w on w.id=ea.word_id where ea.session_id=ls.id)) lang
           from public.learning_sessions ls left join public.lessons l on l.id=ls.lesson_id
           left join public.curriculum_units cu on cu.id=l.unit_id)
select a.user_id, a.lang, count(*) pairs,
  count(*) filter (where a.started_at < b.completed_at and b.started_at < a.completed_at) overlap,
  count(*) filter (where a.completed_at = b.completed_at) ties,
  min(abs(extract(epoch from a.completed_at - b.completed_at))) min_gap_s
from s a join s b on a.user_id=b.user_id and a.lang=b.lang and a.id<b.id group by 1,2;
```

En el informe, `user_id` se reemplazó por la etiqueta `U<n>`.

**Q8 — Integridad y objetos planificados:**

- secuencia e identidad de `exercise_attempts.id` (`pg_get_serial_sequence`, `last_value`, mín. y
  máx.);
- vínculos entre idiomas;
- ejercicios sin palabras;
- primeros intentos duplicados;
- `created_at ≠ completed_at`;
- filas de `user_word_progress` cuyo `created_at` o `last_reviewed_at` no es el `completed_at` de
  una sesión;
- sesiones sin intentos o con `total_answers` distinto;
- `to_regclass` / `pg_proc` de cada tabla y función prevista (8.2).

**Q9 — Comparación de contenido (local, fuera de la base):** un script de Node, de sólo lectura,
que extrae el JSON `$content$…$content$` de `20261029022122`, `20261030141219` y
`20261102120100_content_a1_unit_01.sql` y compara campo a campo los 17 ejercicios. Resultado: entre
esos archivos, 17/17 iguales, incluida la lista `words`. No prueba qué contenido se cargó en
producción (4.2).

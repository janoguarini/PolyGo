# Francés A1–A2: integración definitiva (para todos los usuarios)

- **Fecha:** 2026-11-21. Trabajo local en `Polygo-client`; PolyGo no se tocó.
- **Producción:** solo se leyó el historial (`list_migrations`). No se ejecutó SQL, no se aplicaron
  migraciones, no hubo `db push`, commits, push, builds ni deploys.
- **Estado:** `FRENCH INTEGRATION — READY LOCALLY, PRODUCTION NOT AUTHORIZED`.

Antecedentes: [FR_A1_A2.md](FR_A1_A2.md) (curso), [FR_A1_A2_PHASE3_REPORT.md](FR_A1_A2_PHASE3_REPORT.md)
(B1–B11), [DB_RECONCILIATION_PLAN.md](DB_RECONCILIATION_PLAN.md) (Etapa II). Este documento reemplaza la
Etapa II de ese plan: el francés ya no pasa por `beta` ni por `content_testers`, se habilita para todos.

## 1. Auditoría

| Punto                          | Estado real                                                                                                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contenido                      | 30 unidades (A1 U1–U17, A2 U1–U13), 300 lecciones, 548 palabras, 2998 ejercicios, 25 tareas de escritura. Sin cambios desde la Fase 3: la carga regenerada daba `24abe901…`       |
| U13                            | `content/fr/a2/unit13-moi-toi.ts` (sin seguimiento en git), integrada en `content/fr/a2/index.ts`; sus 80 ids están en `ids.lock.json` y son únicos                               |
| Migraciones en el cliente      | Ninguna del francés antes de este trabajo (ni en `migrations/` ni en `pending/`, que no existía)                                                                                  |
| Producción (`list_migrations`) | 110 versiones, la última `20261213100000`. **Ninguna del francés.** Tampoco la Etapa I ni las `20261222*` (personalización, XP). En la fila `languages('fr')`: `hidden` (plan §2) |
| Visibilidad                    | Cliente: `shared/languages.ts` (`status`). Servidor: `public.languages.content_status`, que consultan `complete_onboarding` y `set_target_language`. `beta` = `content_testers`   |
| Listas fijas de idiomas        | No hay en la app, la Edge Function, XP, logros, misiones ni estadísticas: todo es genérico por `language_code`                                                                    |
| Pendiente heredado             | 11 bloqueantes de la Fase 3 (B1–B11), sin corregir                                                                                                                                |

## 2. Cambios locales

### 2.1 Correcciones B1–B11 (autorizadas por el dueño, incluidas las de unidades ya validadas)

| #   | Archivo                                 | Corrección                                                                                                                            |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | `a2/unit13-moi-toi.ts`                  | `Ne ___ pas` → `N'___ pas ton passeport!`                                                                                             |
| B2  | `a2/unit13-moi-toi.ts`                  | `fr-toi`: `acceptedTexts: ['tu']` (escribir «vos» acepta _toi_ y _tu_)                                                                |
| B3  | `writing.ts` (`fr.a2.wt.consignes`)     | `IMPERATIF_TU`: 54 verbos, con pronombre (`prends-les`, `dépêche-toi`), `n'`/`t'`/`m'`/`l'` + verbo (`ne t'inquiète pas`) y `ne te …` |
| B4  | `a1/unit11-loisirs.ts`                  | _le_: e débil como la _eu_ de _deux_; _les_: «lé»                                                                                     |
| B5  | `a1/unit14-descriptions.ts` (2 lugares) | _gentille_: -ille suena como una y (gentiy)                                                                                           |
| B6  | `a2/unit07-travail-etudes.ts`           | _enfin_: dos nasales distintas (en- como _en_, -fin como _vin_)                                                                       |
| B7  | `a2/unit11-relations.ts`                | Distractor «nos encontramos» → «nos separamos»                                                                                        |
| B8  | `a2/unit12-opinions.ts`                 | Se acepta _Elle m'a dit qu'il était fatigué._                                                                                         |
| B9  | `writing.ts` (`fr.a1.wt.travail`)       | `dans\|à` + `au\|aux\|chez`                                                                                                           |
| B10 | `writing.ts` (`INFINITIFS`)             | + _aller, regarder, écouter, dormir_                                                                                                  |
| B11 | `writing.ts` (`fr.a2.wt.couple`)        | + _se sont_                                                                                                                           |

**Efecto en la carga, fila por fila** frente a la versión anterior (`24abe901…`): unidades, palabras,
conceptos, ítems, `item_concepts`, `placements` y `scope_lessons` **idénticos**. Cambian solo las filas
corregidas: 2 lecciones (intro B5, B6), 7 ejercicios (B1, B2, B4, B5 ×2, B7, B8) y sus versiones y
conjuntos de opciones. Ningún id cambió (`content:ids -- check` OK). B3 y B9–B11 viajan con la app.

**Validación independiente (II-L2 del plan): PASS.** Una revisión aparte, sin conocer las conclusiones,
encontró en la primera pasada que B3 todavía rechazaba `ne t'inquiète pas` (13 usos en la U13): el
tokenizador deja `t'inquiète` como una sola ficha. Se corrigió y la segunda pasada dio **B1–B11 FIXED,
PASS**. Notas no bloqueantes: no reconoce dobles pronombres (`donne-le-moi`); B9 sigue sin aceptar
`j'étudie à…` (ya era así); _l'aide_ como sustantivo también cuenta como imperativo (se acepta de más
a propósito).

### 2.2 Habilitación

- `shared/languages.ts`: `fr` pasa a `status: 'available'`, `levels: ['A1', 'A2']`; `ranked` sigue en `false`.
- `supabase/functions/learning-session/*.generated.js` regenerado (`npm run functions:build`): el paquete
  copia `shared/languages.ts`, pero ahí `LANGUAGES` es código muerto. La función **no** depende del
  `status`, así que **no hace falta redesplegarla** para habilitar el francés (`test:ops` 17/17).
- No se agregó ninguna allowlist ni se tocó `content_testers` (sigue existiendo para `beta`; el francés
  ya no depende de ella).

### 2.3 Archivos

| Archivo                                                              | Qué es                                                         | SHA-256                                              |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| `supabase/migrations/20261202120000_fr_a1_a2.sql` (nuevo)            | Carga, sin publicar (6,8 MB, un bloque `DO`, _add-only_)       | `6853b9858ecb9ea9…`                                  |
| `supabase/pending/20261203120000_publish_fr_a1_a2.sql` (nuevo)       | Publicación (solo `UPDATE` de estado, idempotente)             | `6612fae8266373830…` (igual que antes: solo usa ids) |
| `supabase/pending/20261203130000_enable_fr.sql` (nuevo)              | Activación: 1 fila, `content_status = 'available'`             | `a8224381039014da…`                                  |
| `supabase/rollback/20261203130000_enable_fr.down.sql` (nuevo)        | Vuelve a `hidden`; no toca perfiles ni progreso                | `d49060f3cb275135…`                                  |
| `supabase/rollback/20261203120000_publish_fr_a1_a2.down.sql` (nuevo) | Despublica; se niega si alguien tiene `target_language = 'fr'` | `e6a770cd6d6e8833…`                                  |
| `supabase/tests/frAvailability.test.mjs` (nuevo)                     | Punta a punta con una cuenta común                             | —                                                    |
| `supabase/tests/languages.test.mjs`, `content/__tests__/fr.test.ts`  | Expectativas: francés disponible, sin Ranked                   | —                                                    |
| `content/fr/**` (7 archivos), `shared/languages.ts`                  | §2.1 y §2.2                                                    | —                                                    |

## 2.4 Pruebas

| Prueba                                                       | Resultado                                                                                                                                                                           |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fr-check` (contenido y escritura)                           | 0 problemas                                                                                                                                                                         |
| `content:ids -- check`                                       | OK, ningún id cambió                                                                                                                                                                |
| `npm run typecheck`, `npx expo lint`                         | OK                                                                                                                                                                                  |
| Jest `fr.test` + `content.test` (cliente)                    | 5453/5453                                                                                                                                                                           |
| `frContent` + `languages` + `frAvailability` (PGlite)        | 22/22: carga, publicación jugando las 300 lecciones, activación, rollbacks, registro A1/A2, progreso, XP, logros, estadísticas, repasos v1 y v2 solo de francés, inglés sin francés |
| `test:ops`                                                   | 17/17                                                                                                                                                                               |
| Copia temporal con la cadena de PolyGo (otros idiomas): Jest | **105/105 suites, 7000/7000**                                                                                                                                                       |
| Copia temporal: `test:db` completo                           | 472/507. Los 35 fallos son ajenos al francés (abajo)                                                                                                                                |

**Los 35 fallos de la copia (ninguno del francés):**

- **10** (a2Publish, legacyReviewRetirement, planned): comparan listas fijas de migraciones; sobran 209,
  213 y `20261222*`, que ya estaban en el cliente.
- **23** (energy, profile): el fixture inserta `pt` A2 posición 1, que choca con la carga de portugués A2.
- **1** (mastery R1): toma un concepto de inglés por posición, que cambia con inglés A2, B1 y B2 cargados.
- **1** (curriculumPropagation): falta `socket.io` del servidor (no instalado).

En el cliente solo, sin la cadena de PolyGo, 8 suites de Jest y unos 110 tests de BD de otros idiomas no
llegan a correr porque sus migraciones no están en `Polygo-client`. Es así desde antes de este trabajo.

## 3. Plan de aplicación en producción (NO autorizado)

**Independencia:** el francés solo enlaza palabras propias; no depende de la Etapa I (inglés, pt, it,
zh) y se puede aplicar antes, después o sin ella.

| #    | Paso                                                                                                                                                                                                                | Tipo      | Reversible                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------- |
| F-R1 | Backup físico vigente (≤ 24 h, posterior al hardening de 2026-11-21 02:21Z), verificado con artefacto                                                                                                               | lectura   | —                                            |
| F-R2 | PRECHECK: fila `fr` en `hidden` y `ranked_available = false`; 0 unidades/palabras/ítems `fr`; hashes §2.3; cuerpos de `complete_onboarding` y `set_target_language` con la condición `content_status = 'available'` | lectura   | —                                            |
| F-W1 | Carga `20261202120000_fr_a1_a2.sql` + fila de historial                                                                                                                                                             | escritura | Invisible mientras no se publique            |
| F-W2 | Publicación `20261203120000_publish_fr_a1_a2.sql` + fila de historial                                                                                                                                               | escritura | `…publish_fr_a1_a2.down.sql` (antes de F-W3) |
| F-R3 | Punto de control: 30/300/548/2998 publicados, 2237 ítems activos, 194 draft; otros idiomas iguales                                                                                                                  | lectura   | —                                            |
| F-W3 | Activación `20261203130000_enable_fr.sql` + fila de historial                                                                                                                                                       | escritura | `…enable_fr.down.sql`                        |
| F-A1 | Build / EAS Update con `fr` en `available` (§4)                                                                                                                                                                     | app       | Volver `status` a `hidden` por EAS Update    |
| F-R4 | POSTCHECK: una cuenta sin `content_testers` elige francés; `fr-a1-u01-l01` y `fr-a2-u01-l01` abiertas                                                                                                               | lectura   | —                                            |

- **Orden seguro:** F-W3 puede ir antes que F-A1: la app instalada hoy tiene el francés en `hidden` y no
  lo muestra. Al revés no: una app con francés visible contra una base en `hidden` da
  `language_unavailable`.
- **Historial:** las tres versiones son anteriores a la máxima registrada (`20261213100000`), así que
  `db push` sigue prohibido. Se aplican una por una y se registra su versión, como 209, 213 y 1118.
  `check-migration-order` avisa W3 para las de `pending/`; no hay que renumerar si se registra así.
- **Impacto esperado:** +30 unidades, 300 lecciones, 548 palabras, 2998 ejercicios y 2431 ítems de
  francés; 1 fila de `public.languages`. Sin cambios de esquema, funciones, RLS, Ranked ni otros idiomas.
- **Riesgos:** la carga es un único bloque de 6,8 MB (si algo no coincide, aborta sin dejar nada); un
  rollback de F-W2 después de que haya alumnos les cortaría el curso (por eso se niega); con F-W3
  revertido, quien ya eligió francés lo conserva.
- **Backup requerido:** físico, posterior al hardening y de menos de 24 h, verificado el mismo día del
  PRECHECK. No se borra ninguna fila, así que no hace falta restaurar para revertir.

## 4. Qué falta para habilitarlo

1. **Autorización** de F-R1 a F-R4 (y del método de aplicación, el mismo de la tanda 1 del plan §14).
2. **Build de la app.** La app instalada no puede mostrar el francés: hace falta un build o EAS Update
   con este `shared/languages.ts`, las tareas de escritura corregidas y soporte de `context_choice` (194
   ejercicios de comprensión del francés lo usan; es el I-A1 del plan). **Ojo:** el árbol del cliente
   trae además funciones que llaman a migraciones no aplicadas (`20261222*`: personalización, XP). Hay
   que decidir si ese build espera a esas migraciones o si el francés sale en un build sin ellas.
3. **QA en dispositivo** con la voz `fr-FR` (no hecho; aquí solo hay pruebas locales).
4. Fuera de alcance, sin cambios: Ranked en francés (`ranked_available` sigue en `false`), revisión
   nativa de los hallazgos menores de la Fase 3 §3.

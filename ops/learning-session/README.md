# learning-session: artefactos de producción y candidata v5

**Estado (2026-11-20):**

- **Producción: v4.** Se desplegó el 2026-11-18 según el registro de ese despliegue. Esta carpeta no lo volvió a verificar en remoto.
- **v5: construida y verificada solo en local (A1.4.2). Todavía no está desplegada** y no se probó en producción.

| Carpeta / archivo                            | Qué es                                                                                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v3/`                                        | **Respaldo de la v3**, byte a byte (Management API `get_edge_function`, leído 2026-11-18). Solo lectura. Es la versión anterior a la v4.                                                                     |
| `v3-source/shared/`                          | Fuente reconstruida de la v3: `shared` de `4f23d36` sin `apostropheOnly` y con los idiomas de la v3. Reproduce el `core.generated.js` de la v3 byte a byte.                                                  |
| `v4-source/shared/`                          | `v3-source` + `learningSession.ts` y `grading.ts` de la app. Nada más.                                                                                                                                       |
| `v4/`                                        | **Producción actual.** `index.ts` = v3 + `docs/patches/learning-session-instant-review.patch`; `core` generado desde `v4-source`; `planner` y `focus` = los de la v3. Es el artefacto del rollback de la v5. |
| `v5/`                                        | **Candidata local, sin desplegar**: v4 + C.7 + O-1, con `core` generado desde el `shared/` actual. Manifiesto: `v5/SHA256SUMS`.                                                                              |
| `build.cjs`                                  | Empaqueta como `scripts/build-functions.ts` (mismas opciones y encabezado).                                                                                                                                  |
| `verify.test.mjs`                            | Verificación v3 contra v4: `npm run test:ops`.                                                                                                                                                               |
| `../../supabase/functions/learning-session/` | Directorio activo local. Sus cuatro archivos son **idénticos byte a byte a `v5/`**. No está versionado.                                                                                                      |

**`v3/` y `v4/` no se modifican nunca.** Son los artefactos de rollback.

## Producción (v4)

- `slug` learning-session · `id` b1844c3a-82fa-49cc-86e8-d893b1671cb4 · `verify_jwt: false`.
- **Despliegue:** 2026-11-18, por CLI (`supabase@3.2.0 --use-api --no-verify-jwt`), desde el commit `b2b136c`.
- **Registro de ese despliegue:** los cuatro archivos coincidieron con `v4/SHA256SUMS`, y `delete-account` y `notify-battle-invite` no cambiaron.
- **Pendiente desde entonces:** la prueba con un repaso real (paso 4 del procedimiento de abajo). No consta como hecha.

```
ecbb051d2ba345cd022d6f225e35d86614a1f8eb6c6e994ffa29f84feff56295  index.ts
2e6b0a1f51f1fd3f04f9b055623230f46e67f89a27c99651fb65a30ee167e5cb  core.generated.js
5a5f1852a882673d7681c4a68c110093fdaafff44ebcd5b215244e99842336e8  planner.generated.js   (= v3)
2a4aea41daefe3afd664cc16d41648c3bc8c981076e69ccac136f18a9b7c9cd4  focus.generated.js     (= v3)
```

Cambios contra la v3:

- `index.ts` (13 líneas agregadas, 5 quitadas):
  - `content()` de `start_review` también lee `learning_session_presentations` (en paralelo) y agrega `grading_key` a cada ítem.
  - Si esa lectura falla, devuelve los ítems como la v3, y la app espera al servidor.
- No cambian la autenticación, CORS, los errores, `answer_review`, `submit_review`, las lecciones ni los otros caminos de `start_review`. No incluye C.7 (no reenvía `x-polygo-curriculum-api`) ni O-1.
- `core.generated.js`:
  - `gradeOne` pasa a `gradePresented` (misma lógica);
  - se agregan `TEXT_RULES_BY_GRADER`, `reviewGradingKey`, `withGradingKeys` y `gradeWithKey`;
  - `verdictForText` y los idiomas siguen siendo los de la v3.
- Corrector: **sigue en `shared/grading.ts#gradeWithSpec` 1.0.0.** No cambia ninguna corrección; lo verifica el arnés con miles de respuestas.

## v3 (anterior)

- Versión 3, desplegada el 2026-11-09T14:39:11Z, `verify_jwt: false`.
- `ezbr_sha256` 1371a63958ada519d388e01aee9bed9f74cedda795a5e6b1814768accd4582e6. Es el hash del paquete que arma Supabase, no el de un archivo: los archivos se verifican con `v3/SHA256SUMS`.

```
6011b8639716127e4830c90522f1bb72fa309585e7cc89116ed368c384f88991  index.ts
67401d448d571a8b12fe8faa8caa5bf15a89dda3a430a22a915456049045f405  core.generated.js
5a5f1852a882673d7681c4a68c110093fdaafff44ebcd5b215244e99842336e8  planner.generated.js
2a4aea41daefe3afd664cc16d41648c3bc8c981076e69ccac136f18a9b7c9cd4  focus.generated.js
```

## Candidata v5 (local, sin desplegar)

```
04dadb1253d2a2b9debe31a0ed85277c1c3bf4b0ea0c2f8b4592aee1cbd2086a  index.ts
e47e581dc9a83cc27477137bed2a91789234c5f564d3f2a5fac91c2d4ce2716b  core.generated.js
5a5f1852a882673d7681c4a68c110093fdaafff44ebcd5b215244e99842336e8  planner.generated.js   (= v4 = v3)
2a4aea41daefe3afd664cc16d41648c3bc8c981076e69ccac136f18a9b7c9cd4  focus.generated.js     (= v4 = v3)
```

**Dónde está:**

- `ops/learning-session/v5/`, con su manifiesto `v5/SHA256SUMS` (`sha256sum -c SHA256SUMS` desde esa carpeta);
- la misma copia en `supabase/functions/learning-session/`;
- y fuera del repositorio, en `Desktop\PolyGo-A1-4-2-Recovery\v5\`, junto con el informe de construcción.

**Cómo se armó:**

- `index.ts`: v4 + los bloques C.7 y O-1 del `index.ts` del árbol `Polygo` (diff de v3 a ese archivo). Agrega 32 líneas y quita 4.
  - La composición conmuta: aplicar la corrección instantánea (v3 → v4) sobre ese archivo da el mismo `index.ts`.
- `core.generated.js`: `npm run functions:build` sobre el `shared/` del cliente. `npm run functions:build -- --check` da 0.
- `planner` y `focus`: copias de `v4/`.

**Cambios contra la v4:**

- **C.7:**
  - la función lee `x-polygo-curriculum-api` (validado con `/^[0-9]{1,3}$/`; si no pasa, `'0'`) y lo reenvía como cabecera global de supabase-js;
  - así, `request_curriculum_api()` en las RPC ve el nivel real de la build: la actual manda 1;
  - un cliente antiguo, sin la cabecera o con un valor inválido, sigue viendo 0, como con la v4;
  - CORS agrega la cabecera a `Access-Control-Allow-Headers`;
  - la política nivel → ruta (`curriculum_route_client_requirements` y `app_client_policy`) no cambia.
- **O-1:**
  - si falta `SUPABASE_URL` o la clave de servicio, responde `500 {"error":"server_error"}` con JSON y CORS; la v4 lanza antes y responde sin CORS;
  - si `auth.getUser` lanza, también responde 500.
- **Se conserva la corrección instantánea de la v4:**
  - `start_review` devuelve el mismo cuerpo, con `grading_key` 1.0.0, y hace las mismas RPC;
  - si falla la fotografía, los ítems van sin clave.
- **`core`** sale del `shared/` actual. Solo cambian los idiomas (🇺🇸, FR oculto, ES rioplatense con `support`) y el parámetro `TextRules` de `verdictForText`.
  - El servidor sigue corrigiendo con `TEXT_RULES_BY_GRADER['1.0.0']`, y `LEARNING_GRADER` no cambia.
  - En el paquete, la lista de idiomas no se usa.

**Verificación local (A1.4.2), sin producción:**

- arnés v4 contra v5: 17/17 (`answer_review` comparado en 6438 llamadas y la corrección en 6438 evaluaciones);
- lado SQL de C.7 en PGlite: 2/2;
- `attempts.test.mjs`: 14/14 (incluye «el paquete de la Edge Function está al día con shared/»);
- `phase4`, `phase4close` y `phase5`: completos;
- `test:ops`: 17/17;
- Jest de corrección: 208/208.

Los dos arneses de la v5 están fuera del repositorio, en `Desktop\PolyGo-A1-4-2-Recovery\harness\`.

**Sin ejecutar:**

- `supabase/tests/curriculumPropagation.test.mjs`: bloqueado, porque falta `server/node_modules` (`socket.io`) y necesita la migración pendiente `20261113120300`.
- `supabase/tests/deno/learning-session.e2e.mjs`: Deno no está instalado.

**Formato:** `.prettierignore` excluye `v5/` y `supabase/functions/learning-session/*.generated.js`. `npm run format` no debe reformatear los paquetes: `attempts.test.mjs` los compara byte a byte con `shared/`.

## Corrector y apóstrofos

|                                        | Regla de texto                                                                                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Servidor v3, v4 y v5 (corrector 1.0.0) | Una diferencia **solo de apóstrofos** a distancia 1 se acepta como typo («It is three oclock» por «It is three o'clock.» = correcto con typo) |
| App, Aprender (`TEXT_RULES`)           | No es typo (`apostropheOnly`): esa misma respuesta es incorrecta                                                                              |
| App, Repaso con clave                  | Las reglas de la versión que declara la clave (`grading_key.grader_version` → `TEXT_RULES_BY_GRADER`): con 1.0.0, igual que el servidor       |

- **Clave desconocida o ausente:** si la clave declara una versión que la app no conoce, o no declara ninguna, la app no corrige en el dispositivo y espera al servidor como antes.
- **No hace falta subir `LEARNING_GRADER`** para la v4 ni para la v5, porque la corrección del servidor no cambia.
- **Sí hará falta subirlo** cuando el servidor deba aplicar la regla `apostropheOnly`:
  - pasar a `1.1.0` y agregar `'1.1.0': { apostropheTypo: false }`;
  - desde la v4, el servidor corrige con las reglas de su `LEARNING_GRADER`, no con las de la app, así que una regla nueva entra solo junto con su versión;
  - `grader_version` es texto libre en la base, así que subirla no necesita migración.
- **Diferencia previa, que no cambia acá:** en **Aprender**, la app y el servidor ya difieren en estos casos de apóstrofo. La app muestra incorrecto y el servidor registra correcto con typo.

## Verificación

```
npm run test:ops      # arnés v3 contra v4 (17 pruebas)
npx jest              # app (incluye cola, reconcile y equivalencia de la clave)
npx tsc --noEmit && npx expo lint
```

El arnés `verify.test.mjs` ejecuta la función real v3 y la v4 en Node, con Deno y supabase-js simulados, y comprueba:

- hashes del respaldo y builds reproducibles;
- que `index.ts` v4 sea exactamente v3 + el parche;
- `start_review` (sesión abierta y vencida): mismo cuerpo más `grading_key`, y una sola RPC de lectura adicional;
- que, si falla la fotografía, la respuesta sea la de la v3;
- C.7: misma creación del cliente, con la cabecera curricular presente;
- O-1: sin `SUPABASE_URL`, la misma falla que la v3;
- autenticación (sin token, token inválido, `OPTIONS`, `GET`) idéntica;
- `answer_review` (6438 llamadas: 2146 respuestas por 3 variantes) y `submit_review`: mismas respuestas y mismos argumentos de RPC;
- la corrección de lecciones y repasos, idéntica entre v3 y v4;
- que la app, con la clave, dé el mismo veredicto que la v4 en todo el corpus, y que con las reglas de Aprender no lo daría en los casos de apóstrofo.

No lo cubre el arnés, porque necesita la base de producción: la idempotencia de `learning_review_answer` en SQL (primera respuesta inmutable, `duplicate: true`). Eso no cambia: ya está en producción desde la fase 4.

## Deploy de la v5 (NO autorizado todavía; requiere autorización expresa)

1. **Comprobaciones locales:**
   - `npm run test:ops` y `sha256sum -c SHA256SUMS` dentro de `v3/`, `v4/` y `v5/`;
   - que `supabase/functions/learning-session/` siga siendo idéntico a `v5/`.
2. **`verify_jwt` (revisarlo de forma explícita):** no hay `supabase/config.toml`, así que nada fija `verify_jwt` para esta función.
   - Hay que desplegar **siempre** con `verify_jwt: false` (conector) o `--no-verify-jwt` (CLI).
   - Si se omite, el gateway exigiría un JWT antes de llegar a la función. Eso cambia la configuración de producción: la función valida el token en su código, con `auth.getUser`.
3. **Desplegar los cuatro archivos de `v5/`, sin regenerar nada:**
   - **Por el conector:** `deploy_edge_function` con `project_id: wtymosvsymzoosxscnxi`, `name: learning-session`, `entrypoint_path: index.ts`, `verify_jwt: false` y el contenido exacto de los cuatro archivos.
   - **Por CLI, desde una carpeta temporal:** como el directorio activo existe en el repositorio, no hay que desplegar desde la raíz.
     ```
     mkdir -p $TMP/deploy/supabase/functions/learning-session
     cp ops/learning-session/v5/{index.ts,core.generated.js,planner.generated.js,focus.generated.js} \
       $TMP/deploy/supabase/functions/learning-session/
     npx supabase functions deploy learning-session --project-ref wtymosvsymzoosxscnxi \
       --no-verify-jwt --workdir $TMP/deploy
     ```
4. **Verificar con `get_edge_function`:**
   - la versión nueva;
   - `verify_jwt` sigue en `false`;
   - el SHA-256 de cada archivo coincide con `v5/SHA256SUMS`.
5. **Prueba en producción.** Requiere su propia autorización, porque crea datos de una cuenta de prueba.
   - Un repaso: `start_review` trae `grading_key` 1.0.0.
   - El feedback es inmediato.
   - El envío no da `answer_mismatch`.
   - El nivel curricular llega a las RPC: una build con `CURRICULUM_API = 1` ve su ruta y una sin la cabecera, la de respaldo.

## Rollback

- **De la v5, si llegara a desplegarse:**
  1. Volver a desplegar los cuatro archivos de **`v4/`**, igual que en el paso 3, con `verify_jwt: false`.
  2. Verificar que los SHA-256 coinciden con `v4/SHA256SUMS`.
  3. La app no necesita nada: con la v4, `grading_key` sigue llegando, y C.7 vuelve a ver 0.
- **De la v4:** desplegar `v3/` de la misma forma. Sin `grading_key`, la app vuelve sola a «Comprobando…».
- No hay migración que revertir en ningún caso.

Supabase no guarda versiones anteriores para restaurar. El rollback es desplegar de nuevo `v4/` o `v3/`, que por eso no se modifican.

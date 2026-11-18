# learning-session: despliegue aislado de la corrección instantánea

Estado: **preparado y verificado, sin desplegar.** Producción sigue en la v3.

| Carpeta             | Qué es                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v3/`               | **Respaldo de producción**, byte a byte (Management API `get_edge_function`, leído 2026-11-18). Solo lectura. Es el artefacto del rollback.                               |
| `v3-source/shared/` | Fuente reconstruido de la v3: `shared` de `4f23d36` sin `apostropheOnly` y con los idiomas de la v3. Reproduce el `core.generated.js` de la v3 byte a byte.               |
| `v4-source/shared/` | `v3-source` + `learningSession.ts` y `grading.ts` de la app. Nada más.                                                                                                    |
| `v4/`               | **Candidata a desplegar**: `index.ts` = v3 + `docs/patches/learning-session-instant-review.patch`; `core` generado desde `v4-source`; `planner` y `focus` = los de la v3. |
| `build.cjs`         | Empaqueta como `scripts/build-functions.ts` (mismas opciones y encabezado).                                                                                               |
| `verify.test.mjs`   | Verificación: `npm run test:ops`.                                                                                                                                         |

## Producción (v3)

- `slug` learning-session · `id` b1844c3a-82fa-49cc-86e8-d893b1671cb4 · **versión 3** · ACTIVE
- `verify_jwt: false` · desplegada el 2026-11-09T14:39:11Z · `ezbr_sha256` 1371a63958ada519d388e01aee9bed9f74cedda795a5e6b1814768accd4582e6
- El `ezbr_sha256` es el hash del paquete que arma Supabase, no el de un archivo. Los archivos se
  verifican con `v3/SHA256SUMS`.

```
6011b8639716127e4830c90522f1bb72fa309585e7cc89116ed368c384f88991  index.ts
67401d448d571a8b12fe8faa8caa5bf15a89dda3a430a22a915456049045f405  core.generated.js
5a5f1852a882673d7681c4a68c110093fdaafff44ebcd5b215244e99842336e8  planner.generated.js
2a4aea41daefe3afd664cc16d41648c3bc8c981076e69ccac136f18a9b7c9cd4  focus.generated.js
```

## Candidata (v4)

```
ecbb051d2ba345cd022d6f225e35d86614a1f8eb6c6e994ffa29f84feff56295  index.ts
2e6b0a1f51f1fd3f04f9b055623230f46e67f89a27c99651fb65a30ee167e5cb  core.generated.js
5a5f1852a882673d7681c4a68c110093fdaafff44ebcd5b215244e99842336e8  planner.generated.js   (= v3)
2a4aea41daefe3afd664cc16d41648c3bc8c981076e69ccac136f18a9b7c9cd4  focus.generated.js     (= v3)
```

Cambios contra la v3:

- `index.ts` (13 líneas agregadas, 5 quitadas): `content()` de `start_review` también lee
  `learning_session_presentations` (en paralelo) y agrega `grading_key` a cada ítem. Si esa lectura
  falla, devuelve los ítems como la v3, y la app espera al servidor.
- No cambian la autenticación, CORS, los errores, `answer_review`, `submit_review`, las lecciones ni
  los otros caminos de `start_review`. No incluye C.7 (no reenvía `x-polygo-curriculum-api`) ni O-1.
- `core.generated.js`: `gradeOne` pasa a `gradePresented` (misma lógica) y se agregan
  `TEXT_RULES_BY_GRADER`, `reviewGradingKey`, `withGradingKeys` y `gradeWithKey`. `verdictForText`
  y los idiomas siguen siendo los de la v3.
- Corrector: **sigue en `shared/grading.ts#gradeWithSpec` 1.0.0.** No cambia ninguna corrección: lo
  verifica el arnés con miles de respuestas.

## Corrector y apóstrofos

|                                      | Regla de texto                                                                                                                                |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Producción v3 y v4 (corrector 1.0.0) | Una diferencia **solo de apóstrofos** a distancia 1 se acepta como typo («It is three oclock» por «It is three o'clock.» = correcto con typo) |
| App, Aprender (`TEXT_RULES`)         | No es typo (`apostropheOnly`): esa misma respuesta es incorrecta                                                                              |
| App, Repaso con clave                | Las reglas de la versión que declara la clave (`grading_key.grader_version` → `TEXT_RULES_BY_GRADER`): con 1.0.0, igual que el servidor       |

- Si la clave declara una versión que la app no conoce, o no declara ninguna, la app no corrige en el
  dispositivo y espera al servidor como antes.
- **No hace falta subir `LEARNING_GRADER`** para este deploy, porque la corrección del servidor no
  cambia.
- **Sí hará falta subirlo** cuando se despliegue la regla `apostropheOnly` en el servidor (hoy solo en
  el árbol `Polygo`, sin versionar): pasar a `1.1.0` y agregar `'1.1.0': { apostropheTypo: false }`.
  Desde este cambio, el servidor corrige con las reglas de su `LEARNING_GRADER`, no con las de la app,
  así que una regla nueva entra solo junto con su versión. `grader_version` es texto libre en la base,
  así que subirla no necesita migración.
- Diferencia previa, que no cambia acá: en **Aprender**, la app y el servidor ya difieren en estos
  casos de apóstrofo (la app muestra incorrecto y el servidor registra correcto con typo).

## Verificación

```
npm run test:ops      # arnés v3 contra v4 (17 pruebas)
npx jest              # app (incluye cola, reconcile y equivalencia de la clave)
npx tsc --noEmit && npx expo lint
```

El arnés ejecuta la función real v3 y la v4 en Node, con Deno y supabase-js simulados, y comprueba:

- hashes del respaldo y builds reproducibles;
- que `index.ts` v4 sea exactamente v3 + el parche;
- `start_review` (sesión abierta y vencida): mismo cuerpo más `grading_key`, y una sola RPC de lectura
  adicional;
- que, si falla la fotografía, la respuesta sea la de la v3;
- C.7: misma creación del cliente, con la cabecera curricular presente;
- O-1: sin `SUPABASE_URL`, la misma falla que la v3;
- autenticación (sin token, token inválido, `OPTIONS`, `GET`) idéntica;
- `answer_review` (6438 llamadas: 2146 respuestas por 3 variantes) y `submit_review`: mismas
  respuestas y mismos argumentos de RPC;
- la corrección de lecciones y repasos, idéntica entre v3 y v4;
- que la app, con la clave, dé el mismo veredicto que la v4 en todo el corpus, y que con las reglas de
  Aprender no lo daría en los casos de apóstrofo.

No lo cubre el arnés, porque necesita la base de producción: la idempotencia de
`learning_review_answer` en SQL (primera respuesta inmutable, `duplicate: true`). Eso no cambia: ya
está en producción desde la fase 4.

## Deploy (requiere autorización)

1. `npm run test:ops`, y confirmar que `sha256sum -c v4/SHA256SUMS` y `sha256sum -c v3/SHA256SUMS`
   pasan (desde cada carpeta).
2. Desplegar **los cuatro archivos de `v4/`, sin regenerar nada**. Por el conector de Supabase:
   `deploy_edge_function` con `project_id: wtymosvsymzoosxscnxi`, `name: learning-session`,
   `entrypoint_path: index.ts`, `verify_jwt: false` y los cuatro archivos con su contenido exacto.
   Alternativa por CLI, sin tocar el árbol `Polygo`:
   ```
   mkdir -p $TMP/deploy/supabase/functions/learning-session
   cp ops/learning-session/v4/* $TMP/deploy/supabase/functions/learning-session/   # sin SHA256SUMS
   npx supabase functions deploy learning-session --project-ref wtymosvsymzoosxscnxi \
     --no-verify-jwt --workdir $TMP/deploy
   ```
3. Verificar con `get_edge_function`:
   - la versión es 4;
   - `verify_jwt` sigue en `false`;
   - el SHA-256 de cada archivo devuelto coincide con `v4/SHA256SUMS`.
4. Prueba en producción (también requiere autorización, porque crea datos de una cuenta de prueba):
   - un repaso: `start_review` trae `grading_key` con `grader_version` 1.0.0;
   - responder: el feedback es inmediato, y en `review_presentation_answers` hay una fila por
     presentación, con `client_verdict`;
   - el envío no da `answer_mismatch`.
5. Recién después, la build de la app.

Por qué `--no-verify-jwt`: la función valida el token del usuario en su código (`auth.getUser`), y la
v3 está desplegada con `verify_jwt: false`. Desplegarla sin esa opción cambiaría la configuración de
producción: el gateway exigiría un JWT antes de llegar a la función.

## Rollback

1. Desplegar los cuatro archivos de **`v3/`**, igual que en el paso 2, con `verify_jwt: false`.
2. Verificar con `get_edge_function` que los SHA-256 coinciden con `v3/SHA256SUMS` y que
   `verify_jwt` sigue en `false`.
3. La app no necesita nada: sin `grading_key` vuelve sola a «Comprobando…». No hay migración que
   revertir.

Supabase no guarda versiones anteriores para restaurar. El rollback es desplegar de nuevo `v3/`, que
por eso no se modifica.

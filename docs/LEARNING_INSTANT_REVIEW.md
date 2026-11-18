# Corrección instantánea en los repasos

Estado: **implementado en la app (`client/stage0`), servidor preparado como parche, sin desplegar.**

## Problema

En Repaso cada respuesta esperaba a `answer_review` («Comprobando…», ~2 s). Antes de responder, la
función hace en serie `auth.getUser`, `learning_session_presentations`, `learning_review_words` y
`learning_review_answer`. Aprender corrige en el dispositivo, así que su feedback es inmediato.

## Diseño

```
start_review ─────▶ ítems + grading_key (la presentación registrada: spec, respuesta, aceptadas,
                     payload, opciones, explicación)
toque en OK ──────▶ gradeWithKey (la regla de gradeOne del servidor) → feedback en el momento
               └──▶ ReviewAnswerQueue → answer_review (en segundo plano, en orden, una vez por intento)
                         ◀── corrección del servidor → reconcile (prevalece)
fin ──────────────▶ queue.flush() → reconcileWithServer → submit_review
```

- **La misma regla.** `shared/learningSession.ts` saca la corrección de `gradeOne` a `gradePresented`.
  El servidor (`gradeOne`) y la app (`gradeWithKey`) la usan las dos, y
  `shared/__tests__/instantReview.test.ts` comprueba que dan el mismo veredicto que `gradeReviewAnswer`.
- **El servidor sigue siendo la autoridad.** Cada respuesta se corrige y se registra en el servidor
  (`answer_review`, primera respuesta inmutable), y `submit_review` vuelve a corregir la evidencia.
  El `client_verdict` se guarda sólo para comparar.
- **Si el servidor corrige distinto**, su veredicto prevalece (acción `reconcile` de `player.ts`):
  - si el feedback de ese intento sigue en pantalla, cambia ahí mismo, y «Continuar» decide la cola con
    el veredicto del servidor;
  - si la app lo dio por bueno y ya se siguió, vuelve al final de la cola (si le quedan repeticiones);
  - si la app lo dio por errado y ya se siguió, deja de preguntarse;
  - una sesión terminada no se reabre: antes del envío, `reconcileWithServer` corrige los intentos
    (estadísticas y respuesta enviada).
- **Cola** (`src/features/learning/reviewAnswerQueue.ts`), una por sesión:
  - Las respuestas se mandan en orden, una petición a la vez.
  - La clave es presentación + intento, así que el doble toque o un reencolado no mandan otra petición.
  - Sin red o con un `server_error`, la respuesta queda al frente y se reintenta con espera creciente
    (1, 2, 5, 10 y 30 s).
  - Si el servidor rechaza una respuesta de forma definitiva, se descarta sólo esa; la evidencia la
    corrige igual `submit_review`.
  - Si la sesión terminó (`session_expired`/`session_closed`), la cola se vacía y la pantalla vuelve a
    pedir la sesión.
- **Cierre inesperado.** Lo pendiente se guarda en el dispositivo (`polygo.review.pending.<sessionId>`).
  Antes de retomar, `useServerReview` lo manda (`replay`), y el servidor devuelve esas respuestas como ya
  corregidas. Sin red, el retomar falla como siempre, con «Reintentar».
- **Envío final.** `useSubmitServerReview` acepta `attempts` como función: espera a `flush()` y envía
  con la corrección del servidor. Si se corta la red, aparece «No se pudo guardar · Reintentar».
- **Compatibilidad.** Con un servidor sin `grading_key`, la app no tiene claves y el reproductor corrige
  como antes, esperando a `answer_review` («Comprobando…», «Reintentar»). Un ítem con una clave
  ilegible también se corrige así.
- **Qué no cambia.** No cambian la corrección, la puntuación, el SRS (v1 y v2), el dominio ni las
  estadísticas del servidor. Tampoco cambia el SQL: `learning_review_content` sigue sin la respuesta, y
  la clave la agrega la función a partir de `learning_session_presentations`. Aprender no cambia.

## Contrapartida

Con este cambio, en los repasos la app recibe la respuesta correcta antes de que el usuario responda,
igual que en las lecciones. Una app modificada podría acertar siempre. No puede, en cambio, falsear la
corrección: el servidor corrige cada respuesta contra la presentación registrada. Ranked no cambia: el
Battle Server sigue sin mandar la respuesta.

## Deploy (pendiente, requiere autorización)

La función vive en el árbol `Polygo` (rama `feature/ranked-server-authority`), no en `client/stage0`.

1. En `Polygo`, comprobar que `shared/learningSession.ts` sigue igual que el de `client/stage0` antes
   de este cambio (`git -C ../Polygo-client show 4f23d36:shared/learningSession.ts | diff - shared/learningSession.ts`
   no debe mostrar diferencias). Después, copiar el de `client/stage0`.
2. Aplicar el parche: `git apply ../Polygo-client/docs/patches/learning-session-instant-review.patch`.
3. Regenerar los paquetes: `npm run functions:build`, y verificar con `npm run functions:build -- --check`.
4. Correr los tests: `npx jest shared/__tests__` (copiar también
   `shared/__tests__/instantReview.test.ts`) y `npx tsc --noEmit`.
5. Desplegar la función: `npx supabase functions deploy learning-session --no-verify-jwt`.
6. Verificar en producción con una cuenta de prueba:
   - `start_review` devuelve `grading_key` en cada ítem;
   - responder registra en `review_presentation_answers` con `client_verdict`;
   - el envío no da `answer_mismatch`.
7. Recién después, generar la build de la app. El orden importa poco: la app nueva funciona con el
   servidor viejo, y el servidor nuevo con la app vieja, que ignora `grading_key`.

Rollback: volver a desplegar la versión anterior de `learning-session`. La app vuelve sola a
«Comprobando…».

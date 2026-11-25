# Ranked Arcade (protocolo 3)

Partida Ranked de **60 s** con cuatro microjuegos que rotan, combo con multiplicador, **Frenesí** (×2)
en los últimos 15 s y una barra **Tug of War** que muestra quién domina. Reemplaza a Word Rush (75 s)
en Ranked y en la práctica por servidor. Los desafíos con amigos (Supabase, sin servidor) siguen
siendo Word Rush.

Estado: **implementado en local** (Polygo-client, sin commit). No desplegado. Ver §9.

Código:

| Pieza                                                                                         | Archivo                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Reglas puras: puntuación, combo, Frenesí, rotación, generación y corrección, Tug of War, bots | `shared/arcade.ts`                                                                                                   |
| Contrato Socket.IO (v3, convive con v2)                                                       | `shared/protocol.ts`                                                                                                 |
| Motor de partida (hereda el ciclo de vida de `Battle`)                                        | `server/src/arcadeBattle.ts`                                                                                         |
| Enrutado por versión, cola separada, carga de frases                                          | `server/src/server.ts`, `matchmaking.ts`, `supabaseStore.ts`                                                         |
| Estado del cliente (desafíos por adelantado, avance optimista)                                | `src/features/battle/arcade/arcadeState.ts`                                                                          |
| Interfaz                                                                                      | `src/features/battle/arcade/*.tsx`                                                                                   |
| Tests                                                                                         | `shared/__tests__/arcade.test.ts`, `server/test/arcade.test.ts`, `src/features/battle/__tests__/arcadeState.test.ts` |

## 1. Estructura y reloj

| Tiempo      | Fase                                                                           |
| ----------- | ------------------------------------------------------------------------------ |
| antes del 0 | Rival encontrado → «Listo» (10 s) → cuenta regresiva de 3 s (como hasta ahora) |
| 0–45 s      | Arcade                                                                         |
| 45–60 s     | Frenesí: puntos ×2                                                             |
| 60 s        | Cierre: el servidor deja de aceptar respuestas y liquida                       |

Los 60 s son de juego efectivo; la presentación va antes y no descuenta. El reloj es el del servidor:
`startsAt`/`endsAt` salen en la foto (`battle:start`, `battle:state`) y el cliente sólo los muestra
corrigiendo su reloj con `serverNow`. Una reconexión recibe la misma `endsAt`: nunca se reinicia.

## 2. Microjuegos

Todo el contenido sale de lo **publicado** del curso, con el nivel del jugador de menor rating
(`rushLevels`: A1; A1+A2 desde Plata), igual que Word Rush. Nada se inventa ni se traduce en el momento.

| Microjuego         | Contenido                                                                                                                 | Qué manda el cliente                                   | Validación del servidor                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Swipe Battle**   | `words`: palabra + traducción propuesta (50 % la correcta; si no, la de otra palabra que no comparte texto ni traducción) | `{ kind: 'swipe', accept }`                            | `accept === truthful`                                                                     |
| **Connect Battle** | 4 palabras sin texto ni traducción compartidos, dos órdenes mezclados                                                     | `{ kind: 'connect', left, right }` por pareja          | `solution[left] === right`; pareja o derecha ya resueltas = inválida                      |
| **Sentence Rush**  | ejercicios `order_words` publicados de lecciones publicadas (3–6 bloques)                                                 | `{ kind: 'sentence', order }` (permutación de índices) | mismo corrector que las lecciones (`verdictForText`) contra `answer` + `accepted_answers` |
| **Audio Blitz**    | `words`: se escucha la palabra (voz del dispositivo, locale del curso) y se elige su traducción entre 4                   | `{ kind: 'audio', option }`                            | `option === correctOption`                                                                |

Frases excluidas de Sentence Rush: de otro nivel, con menos de 3 o más de 6 bloques, cuyos bloques no
forman la respuesta (contenido roto), repetidas, y las que tienen un conector reordenable (`y`, `and`,
`et`, `e`, `和`…) **sin** variantes cargadas: «Marco es italiano y Claire es francesa» admite dos órdenes y
el validador sólo aceptaría uno.

Audio: si la voz falla o no empezó en 1,5 s se muestra la palabra escrita (la partida nunca espera al
audio). Dos repeticiones por desafío.

Chino: los bloques y palabras se muestran con `TargetText` (pinyin encima si está activado); el
corrector ya ignora los espacios junto a caracteres. Español (curso desde inglés): las traducciones y
consignas del contenido están en inglés, como en el resto del curso.

## 3. Rotación

`kindSequence`: rondas con los formatos disponibles en orden mezclado; Swipe va de a dos tarjetas
(es el más corto). Una ronda nunca empieza con el formato con que terminó la anterior. Resultado:
como mucho dos Swipe seguidos, ningún otro formato repetido, los cuatro en cada tramo de ~10 desafíos y
≥ 15 % de cada uno. La secuencia (60 desafíos, más de los que alguien resuelve en 60 s) se genera una
vez por partida con azar criptográfico y es **la misma para los dos**. Cada jugador avanza a su ritmo.

Sin contenido suficiente un formato sale de la rotación de esa partida (`availableKinds`): Connect pide
≥ 8 palabras; Sentence Rush ≥ 6 frases aptas. Con menos de 4 palabras no hay partida (igual que hoy).

## 4. Puntuación (servidor)

Por respuesta, enteros y siempre en este orden:

```
puntos = (base + velocidad) × multiplicador de combo × (2 si es Frenesí)
velocidad = floor(base × 25 × max(0, ventana − ms) / (100 × ventana))      // ≤ 25 % de la base
fallo = 0 puntos, combo a 0                                                // nunca resta
```

`ms` = tiempo desde que el desafío (o, en Connect, la pareja anterior) quedó activo, **medido con el
reloj del servidor** (el cliente no manda tiempos).

| Microjuego           | Base | Ventana de velocidad | Ritmo típico de quien sabe | Base/s |
| -------------------- | ---- | -------------------- | -------------------------- | ------ |
| Swipe                | 50   | 2 000 ms             | 1,25 s                     | 40     |
| Connect (por pareja) | 50   | 2 500 ms             | 1,25 s                     | 40     |
| Audio                | 100  | 4 000 ms             | 2,5 s                      | 40     |
| Sentence             | 200  | 8 000 ms             | 5 s                        | 40     |

Así ningún formato rinde más por minuto por ser más rápido. Swipe tiene además un mínimo de 200 ms:
más rápido no es leer, es tocar al azar, y cuenta como fallo (`tooFast`).

Combo (aciertos seguidos contando el actual): 1–2 ×1 · 3–4 ×2 · 5–7 ×3 · 8+ ×4. Entrar en Frenesí no
lo reinicia. Tope por respuesta: (200 + 50) × 4 × 2 = **2 000**.

Ejemplos (los primeros están en `shared/__tests__/arcade.test.ts`):

| Caso                                     | Cálculo                                | Puntos            |
| ---------------------------------------- | -------------------------------------- | ----------------- |
| Swipe en 800 ms, primer acierto          | 50 + floor(50·25·1200/200000) = 57, ×1 | **57**            |
| El mismo, tercer acierto seguido         | 57 × 2                                 | **114**           |
| Pareja de Connect en 1 250 ms, combo 0   | 50 + 6 = 56, ×1                        | **56**            |
| Audio en 1 s, quinto acierto, en Frenesí | (100 + 18) × 3 × 2                     | **708**           |
| Frase en 5 s, octavo acierto             | (200 + 18) × 4                         | **872**           |
| La misma frase en Frenesí                | 872 × 2                                | **1 744**         |
| Cualquier fallo                          | —                                      | **0** (combo a 0) |

Resultado: gana el mayor puntaje; empate → mayor precisión (aciertos/respuestas); si persiste, empate.
Abandono pierde siempre. **El ELO no cambia**: `settle_battle` y `shared/ranking.ts` como siempre; la
base guarda puntaje, aciertos (`correct_answers`) y respuestas (`total_answers`); en Connect cada pareja
intentada es una respuesta.

## 5. Tug of War

`tugPosition(mío, rival)` ∈ [−0,92; +0,92]: `x = d / (|d| + 400 + 0,2·(mío + rival))`, ×1,3 y tope.
La escala crece con la partida (100 puntos de ventaja al principio se notan; al final casi no) y nunca
llega al extremo. El cliente la anima con resorte. El marcador del rival llega por `battle:score` tras
cada respuesta (igual que hoy). Rival desconectado: se conserva su último puntaje y su avatar se
atenúa con un ícono de desconexión.

## 6. Protocolo v3

Handshake con `protocolVersion: 3`. El servidor acepta 2 y 3 (`SUPPORTED_PROTOCOL_VERSIONS`), guarda la
versión en `battles.protocol_version` y **no empareja versiones distintas** (las builds actuales siguen
jugando Word Rush entre ellas). Misma cola, mismas ventanas de ELO, mismos bots y calibración.

- `arcade:challenge` (servidor → cliente): vista de un desafío **sin respuesta**. Al empezar llegan el
  0 y el 1; cada vez que el jugador cierra uno, llega el siguiente que entra en la ventana (siempre
  tiene el actual y el próximo: cero espera entre desafíos).
- `arcade:answer` (cliente → servidor) `{ battleId, challengeIndex, answer }` → ack con
  `{ correct, points, score, combo, multiplier, frenzy, done, solution?, correctOption?, pair?, tooFast? }`.
- La foto (`match:found`, `battle:start`, `battle:state`, `battle:sync`) trae `arcade`:
  `{ challenges, current, combo, bestCombo, frenzyAt, durationMs }` (Connect con sus parejas resueltas).
- `battle:finish`: cada `PlayerResult` trae `arcade: { bestCombo, frenzyPoints }` (sólo para mostrar).

Cliente: en Swipe, Audio y Sentence pasa al desafío siguiente sin esperar el ack (ya lo tiene) y el
veredicto llega ~1 RTT después (destello, sonido, vibración). Connect espera el ack de cada pareja:
la app no sabe cuál es la correcta. Ante un rechazo, pide la foto y manda la del servidor.

## 7. Qué valida el servidor

- Identidad (JWT del handshake) y que el jugador esté en esa partida (`battleId`).
- `challengeIndex` entero e igual a su desafío actual: duplicadas, adelantadas o viejas → `stale_question`
  (no puntúan ni rompen el combo). Reconectar y reenviar no duplica nada.
- Forma de la respuesta según el formato; otra forma → `invalid_payload`.
- Tiempo con su reloj; nada después de `endsAt` (`battle_over`); el fin lo programa él.
- Combo, multiplicador, Frenesí y puntos los calcula él; cualquier campo extra del cliente se ignora.
- Rate limit por socket (20 eventos/s) como hasta ahora.

## 8. Desconexiones y bots

Sin cambios de reglas: desconexión en juego → 15 s de gracia (el reloj sigue); vuelve → foto con el
desafío actual, combo y parejas resueltas; no vuelve → abandono (derrota, reglas actuales). Antes de
empezar → cancelación sin ELO.

Bots: juegan la misma secuencia por el mismo camino de puntaje (`gradeArcade` + `arcadeScore`), con la
habilidad de su rating (`botSkill`) y un tiempo por formato (`BOT_KIND_FACTOR`); nunca más rápido que
lo que se acepta de una persona.

## 9. Despliegue (pendiente, requiere autorización)

No hace falta migración: `battles.protocol_version` es un smallint libre y `settle_battle` no topea
puntajes. Orden propuesto:

1. **Servidor reconciliado (2026-11-24).** Railway corre el commit `52de70f` (rama
   `deploy/battle-server`), cuyo `server/src` es el de Polygo-client antes de Arcade. Sobre esa base se
   integró Arcade y se portó el filtro C.7/C.8 (`rush_common_unit_ids`) del servidor original; lo demás
   del original (Etapa 3, Glicko) depende de funciones que producción no tiene y no se portó. Detalle,
   matriz y tests: [RANKED_ARCADE_INTEGRATION.md](RANKED_ARCADE_INTEGRATION.md). Antes de desplegar,
   confirmar en el panel de Railway la rama y el root dir (§2 de ese documento).
2. Desplegar el servidor (acepta v2 y v3: las builds actuales no se rompen). Ojo: además de Arcade,
   activa el filtro de unidades C.7/C.8 también para las builds v2 (hoy producción no filtra).
3. Build de la app (protocolo 3). Sin el servidor nuevo, la build nueva recibe `protocol_mismatch`
   («actualizá la app»): el servidor va primero.
4. Cuando no queden builds v2, se puede sacar la 2 de `SUPPORTED_PROTOCOL_VERSIONS`.

## 10. Limitaciones conocidas

- No hay trampas curadas tipo falsos amigos (ACTUALLY/Actualmente): no existe ese contenido y no se
  inventa. Las traducciones falsas son las de otras palabras del mismo nivel.
- Sentence Rush confía en `accepted_answers` para los órdenes alternativos; frases con adverbios
  movibles sin variantes cargadas (p. ej. «Yesterday I went home») sólo aceptan el orden canónico.
  Los bloques conservan la mayúscula inicial (como en las lecciones), lo que da una pista.
- El veredicto depende de la red (~1 RTT); con conexión lenta el destello llega tarde pero el juego
  no se frena (salvo Connect, que espera cada pareja).
- Audio con la voz sintetizada del dispositivo (como en las lecciones), no grabaciones.
- `frenzyPoints` y `bestCombo` no se guardan en la base (sólo se muestran al final).

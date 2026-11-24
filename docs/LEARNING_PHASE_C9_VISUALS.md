# Fase C.9.1 — Soporte visual para comprensión en contexto (inglés A1)

Estado: **soporte técnico implementado en local; imágenes pendientes de producción.** Ningún estímulo
lleva imagen todavía: los payloads, versiones y hashes de U1–U14 son los mismos de antes (el SQL de la
fase C regenerado es idéntico byte a byte a `20261113120200_comprehension_en_a1_u13_u14.sql`). Sin
migraciones, sin publicación, sin build.

## 1. Contrato

`ReadingStimulus` y `ListeningStimulus` (shared/exercises.ts) admiten un campo opcional `visual`:

| Campo    | Tipo                                                  | Para qué                                                                                               |
| -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `id`     | `<idioma>.img.<slug>`                                 | Referencia estable; clave del recurso empaquetado.                                                     |
| `kind`   | `photo` · `illustration` · `floor_plan` · `map`       | Encabezado y reglas (un plano o mapa sólo después de responder).                                       |
| `display`| `with_stimulus` · `after_answer`                      | Antes de responder (no puede dar la respuesta) o después, como la transcripción.                       |
| `alt`    | texto en español (≥ 20 caracteres)                    | Descripción accesible para lector de pantalla.                                                         |
| `width`, `height` | enteros, 320–4096 px, proporción de 3:4 a 16:9 | Tamaño exacto del archivo maestro; fija la proporción con que se dibuja.                           |
| `sha256` | hex de 64                                             | Hash de los bytes del archivo: la versión apunta a esa imagen exacta.                                  |

- **Versión inmutable:** `visual` va dentro de `payload.stimulus`, que es parte del `content_hash` (V3).
  Cambiar un byte de la imagen cambia `sha256` y produce una versión nueva del ítem; cambiar la
  descripción, el tamaño o el momento también.
- **Sin red:** el payload nunca lleva URL. La app resuelve `id` + `sha256` contra
  `src/features/learning/stimulusImages.ts`, un registro de `require(...)` empaquetado en la build y en
  las actualizaciones OTA.
- **Fallback:** sin recurso local, con otro `sha256` (build vieja frente a imagen corregida), si no carga
  o si la ficha llega mal formada (el esquema la descarta con `catch`), el estímulo se ve como antes.
  Las apps anteriores a esta fase ignoran el campo (zod lo elimina). El texto o el audio alcanzan
  siempre para responder.
- **Fuente única:** las imágenes se declaran sólo en `content/stimulus-visuals.ts`. Los builders
  (`readingQuestions`/`listeningQuestions`) las adjuntan cuando la ficha tiene `sha256`; escribir
  `visual` a mano en un estímulo es un error.

## 2. Cómo se integra una imagen definitiva

1. Guardar el archivo en la ruta de su ficha (`assets/stimuli/en/a1/...`), con el tamaño exacto.
2. `npm run content:visual -- assets/stimuli/en/a1/<archivo>` — verifica tamaño, formato y peso
   (≤ 450 KB) e imprime el `sha256`.
3. Anotar el `sha256` en `content/stimulus-visuals.ts` y agregar la entrada en
   `src/features/learning/stimulusImages.ts` (`require` + el mismo `sha256`).
4. `npx jest content/__tests__/stimulus-visuals.test.ts` comprueba archivo, hash, tamaño, formato, peso
   y registro.
5. Regenerar la migración de contenido (`npm run content:comprehension -- <nueva>.sql`): las preguntas
   de ese estímulo cambian de versión. Publicarla sigue los pasos habituales (fuera de esta fase).

## 3. Reglas comunes a las cinco imágenes

- **Personas ficticias.** Modelos con cesión de derechos de imagen firmada, o imagen sintética revisada
  para que no se parezca a ninguna persona real identificable. Nada de figuras públicas, banco de
  imágenes con rostros reconocibles ni fotos de usuarios o del equipo.
- **Sin texto dentro de las fotos** (carteles, remeras con palabras, pantallas encendidas, logos,
  marcas). Planos y mapas: sólo las etiquetas indicadas, en inglés, tipografía sans de al menos 28 px
  sobre el maestro.
- **Sin datos personales:** ni teléfonos, direcciones, matrículas, documentos ni pantallas legibles.
- **Diversidad y respeto:** personas de distintos orígenes; nada estereotipado por edad o género.
- **Encuadre para teléfono:** el sujeto principal ocupa el centro; la imagen se dibuja al ancho de la
  tarjeta (≈ 330–400 pt) con `resizeMode: contain`. Nada importante a menos del 5 % del borde.
- **Formato:** fotos en JPEG (sRGB, calidad 75–82, progresivo no requerido), planos y mapas en PNG con
  paleta reducida. Peso máximo 450 KB por archivo. Sin transparencias en fotos.
- **Colores de planos y mapas:** fondo claro uniforme y contraste ≥ 4.5:1 para etiquetas; se ven dentro
  de una tarjeta en tema oscuro, así que llevan su propio fondo (no transparente).

---

## Ficha 1 · U2 — foto de la ficha de clase

| | |
| --- | --- |
| Id | `en.img.a1-u02-class-card` |
| Estímulo | `en.stim.a1-u02-class-card` (lectura, «Our class», cR03) |
| Momento | `with_stimulus` (antes de responder) |
| Archivo | `assets/stimuli/en/a1/u02-class-card.jpg` |
| Proporción · tamaño | **4:3 · 1600 × 1200 px**, JPEG ≤ 450 KB |

**Escena exacta.** Foto horizontal de dos adultos sentados uno al lado del otro en un aula sencilla,
frente a una mesa con dos cuadernos cerrados. A la izquierda, un hombre (Sam); a la derecha, una mujer
(Mia). Los dos tienen una edad parecida (30–40 años), miran a la cámara y tienen **expresión neutra y
relajada**. Plano medio (de la cintura para arriba).

**Debe aparecer:** exactamente dos personas; el hombre a la izquierda y la mujer a la derecha; un aula
reconocible (mesa, pared lisa, quizás una ventana); ropa casual parecida en los dos.

**No debe aparecer:**
- Nada que diga quién es el profesor: pizarrón con escritura, uno de pie señalando, uno con marcador,
  carpeta de docente, credencial, diferencia marcada de edad o de vestimenta formal.
- Nada que diga cómo está cada uno: ni sonrisa amplia, ni bostezo, ni ojos cerrados, ni mano en la
  frente, ni postura desplomada (la pregunta «¿Cómo está Sam?» se responde leyendo).
- Gestos de amistad o de distancia marcados (abrazo, choque de manos, darse la espalda): «¿Qué relación
  hay entre Mia y Sam?» se responde leyendo.
- Otras personas, texto, nombres escritos.

**Descripción accesible (en la ficha):** «Foto de dos adultos de edad parecida sentados uno al lado del
otro en un aula, frente a una mesa con cuadernos: a la izquierda un hombre, Sam; a la derecha una mujer,
Mia. Los dos miran a la cámara con expresión neutra.»

---

## Ficha 2 · U4 — foto de la familia de Ana

| | |
| --- | --- |
| Id | `en.img.a1-u04-family-photo` |
| Estímulo | `en.stim.a1-u04-family-photo` (escucha, Tom mira la foto con Ana, cL05) |
| Momento | `with_stimulus` (antes de responder: es la foto de la que hablan) |
| Archivo | `assets/stimuli/en/a1/u04-family-photo.jpg` |
| Proporción · tamaño | **3:2 · 1800 × 1200 px**, JPEG ≤ 450 KB |

**Escena exacta.** Foto grupal al aire libre (patio o plaza con árboles), estilo foto familiar, todos
mirando a cámara. Coincide con la familia que Ana describe en la lectura de la misma lección: **nueve
personas**:
- abuelo (≈ 70–80 años) y abuela, Elena (≈ 70–80 años);
- padre, Carlos, y madre, Rosa (≈ 50 años);
- dos hermanos varones de Ana (≈ 20–30 años);
- Julia, hermana de Ana (≈ 30 años), y Ana (≈ 25 años);
- un bebé **en brazos de la abuela** (no de Julia).

Composición en dos filas, mezclando edades (que no queden «los viejos» a un costado ni el abuelo
destacado en el centro).

**Debe aparecer:** cuatro hombres de tres generaciones, cuatro mujeres de tres generaciones y un bebé;
todos con expresión amable y similar.

**No debe aparecer:**
- Nadie señalado, resaltado, en primer plano o separado del grupo (la pregunta «Who is he?» se resuelve
  escuchando, no mirando a quién apunta Tom).
- Rasgos de género en el bebé: ropa y manta en colores neutros (blanco, beige, verde), sin moños ni
  vincha (la pregunta «¿Qué tiene Julia?» distingue hija de hijo).
- Ropa o elementos de trabajo (guardapolvo, delantal, uniforme, libros apilados, pizarrón): la pregunta
  «¿A qué se dedica Julia?» se responde escuchando.
- Más de una mujer joven con bebé, mascotas, texto, carteles, más personas que las nueve.

**Revisión pedagógica pendiente:** la pregunta dice «el hombre de la foto» y la foto muestra cuatro
hombres a propósito; el enunciado no se modificó (límite de esta fase). Si la revisión lo prefiere, la
alternativa sin tocar preguntas es pasar la ficha a `after_answer`.

**Descripción accesible:** «Foto de una familia grande al aire libre: nueve personas de distintas
edades, cuatro hombres, cuatro mujeres y un bebé en brazos de una mujer mayor. Nadie señala a nadie ni
lleva ropa de trabajo.»

---

## Ficha 3 · U5 — los objetos de la mesa

| | |
| --- | --- |
| Id | `en.img.a1-u05-meeting-table` |
| Estímulo | `en.stim.a1-u05-whose-cup` (escucha, Leo y Kim ordenan la mesa, cL01) |
| Momento | `with_stimulus` |
| Archivo | `assets/stimuli/en/a1/u05-meeting-table.jpg` |
| Proporción · tamaño | **4:3 · 1600 × 1200 px**, JPEG ≤ 450 KB |

**Por qué este estímulo y no la lectura de U5.** La lectura (`en.stim.a1-u05-found-objects`) pregunta
«¿Cómo es el libro?» (grande y azul): cualquier foto del libro da la respuesta. En la escucha, la foto
muestra los objetos de la conversación sin resolver ninguna pregunta.

**Escena exacta.** Vista cenital (desde arriba) de una mesa de reunión clara después de una reunión,
sin personas. Sobre la mesa, bien separados y enteros: un **teléfono negro** boca arriba con la pantalla
apagada, una **taza amarilla** (lisa, sin dibujos), una **computadora portátil cerrada** gris y unas
hojas sueltas en blanco.

**Debe aparecer:** exactamente esos cuatro elementos (los tres de las opciones de «¿Qué objeto es de
Kim?» —taza, teléfono negro, computadora— más las hojas como contexto).

**No debe aparecer:**
- Un teléfono blanco (es el de Kim: daría la respuesta de «¿De qué color es el teléfono de Kim?»).
- Objetos rojos (el rojo es distractor de esa pregunta) ni una taza blanca o negra.
- Manos, personas, nombres, etiquetas, logos, pantallas encendidas, otros objetos que no estén en la
  lista.
- Nada que asigne dueño: ni la taza junto a un cartel, ni objetos agrupados de a dos.

**Descripción accesible:** «Foto de una mesa de reunión vista desde arriba, sin personas: un teléfono
negro, una taza amarilla, una computadora portátil cerrada y unas hojas sueltas.»

---

## Ficha 4 · U6 — plano del departamento

| | |
| --- | --- |
| Id | `en.img.a1-u06-apartment-plan` |
| Estímulos | `en.stim.a1-u06-rental-ad` (lectura, cR03) y `en.stim.a1-u06-house-tour` (escucha, cL04): es el mismo departamento |
| Momento | `after_answer` (muestra exactamente lo que se pregunta) |
| Archivo | `assets/stimuli/en/a1/u06-apartment-plan.png` |
| Proporción · tamaño | **4:3 · 1600 × 1200 px**, PNG ≤ 450 KB |

**Escena exacta.** Plano arquitectónico simplificado visto desde arriba, trazo plano, paredes gruesas
oscuras sobre fondo claro, sin perspectiva ni sombras. Distribución (izquierda → derecha):

```
+--------------+---------------+-------------+
|              |               |  Bedroom    |
|   Kitchen    |  Living room  +-------------+
|  (mesa con   |    (sofá)     |  Bathroom   |
|   llaves)    |               +-------------+
|              |               |  Bedroom    |
+--------------+------[door]---+-------------+
```

- **Kitchen** (izquierda, ocupa todo el alto; la habitación más grande junto con el living): una mesa
  con dos sillas y **un manojo de llaves dibujado sobre la mesa**, bien visible.
- **Living room** (centro): **un sofá**; la puerta de entrada en la pared inferior.
- A la derecha, apilados: **Bedroom** (cama), **Bathroom** (inodoro y ducha), **Bedroom** (cama). El
  baño comparte pared con los dos dormitorios.
- Puertas: cocina ↔ living, living ↔ cada dormitorio y el baño (o un pasillo mínimo del lado del
  living).
- Etiquetas en inglés, exactamente: `Kitchen`, `Living room`, `Bedroom` (dos veces), `Bathroom`.

**Debe cumplir (lo que dicen los ejercicios):** dos dormitorios y un baño; cocina grande; sofá en el
living; **la cocina está al lado del living**; **el baño está al lado del dormitorio**; **las llaves
están sobre la mesa, en la cocina**; departamento chico; sin jardín.

**No debe aparecer:**
- Jardín, patio, balcón, terraza, plantas exteriores ni pasto.
- Una pared compartida entre la cocina y un dormitorio o el baño (contradiría los distractores «Al lado
  del dormitorio» / «Al lado del baño»).
- Llaves debajo de la mesa, en un dormitorio o en otro lugar; un segundo sofá; una cama en el living;
  una mesa en el living (el distractor de «¿Qué mueble hay en el living?» es «Una mesa»).
- Medidas, números, nombres de personas, flechas, brújula, texto fuera de las cinco etiquetas.

**Descripción accesible:** «Plano del departamento visto desde arriba. A la izquierda, una cocina
grande con una mesa y unas llaves sobre la mesa. En el centro, el living, con un sofá y la puerta de
entrada. A la derecha, dos dormitorios con el baño entre los dos. La cocina sólo comparte pared con el
living. No hay jardín ni balcón.»

---

## Ficha 5 · U10 — mapa del recorrido al museo

| | |
| --- | --- |
| Id | `en.img.a1-u10-way-to-the-museum` |
| Estímulo | `en.stim.a1-u10-way-to-the-museum` (lectura, indicaciones, cR06) |
| Momento | `after_answer` (muestra el recorrido que se pregunta) |
| Archivo | `assets/stimuli/en/a1/u10-way-to-the-museum.png` |
| Proporción · tamaño | **4:5 (vertical) · 1200 × 1500 px**, PNG ≤ 450 KB |

**Escena exacta.** Mapa urbano esquemático visto desde arriba, calles claras sobre manzanas de color
suave, sin perspectiva. Representa las tres indicaciones del texto, en este orden:

1. *From the station, go straight on.* — **Station** abajo al centro; el recorrido sale hacia arriba
   por una calle vertical.
2. *Turn left at the supermarket.* — en la primera esquina importante, **Supermarket** ocupa la esquina;
   el recorrido dobla a la **izquierda** (respecto de quien camina hacia arriba).
3. *Go straight on. The museum is on the right, next to the library.* — el recorrido sigue derecho por
   la calle horizontal hacia la izquierda; **Museum** queda del lado **derecho** de quien camina (arriba
   de la calle en el mapa), con **Library** pegada a él. Termina en la puerta del museo.

```
   +---------+---------+ ......... +--------------+
   | Museum  | Library |   (manz.) | Supermarket  |
   +---------+---------+           +--------------+
   ◄··········◄··········◄··········◄··· ┐
                                         ·
                                         ·
                                         ▲
                                      Station
```

- Recorrido: línea de puntos de color saturado con flechas de dirección, un punto de inicio en la
  estación y un marcador de llegada en el museo.
- Etiquetas en inglés, exactamente: `Station`, `Supermarket`, `Library`, `Museum`.
- Entre el supermercado y la biblioteca, al menos una manzana o edificio sin etiqueta.

**No debe aparecer:**
- La biblioteca en la esquina donde se dobla (distractor «En la biblioteca»); el museo al lado del
  supermercado o a la izquierda de la calle (distractores de «¿Dónde está el museo?»).
- Lugares de los otros estímulos de U10 (cinema, hotel, bank, park, hospital, bus) ni otras etiquetas,
  nombres de calles, números, brújula, personas o autos.
- Un segundo recorrido posible o un atajo dibujado.

**Descripción accesible:** «Mapa del recorrido. Desde la estación, abajo, una línea de puntos sigue
derecho hacia arriba hasta la esquina del supermercado, dobla a la izquierda y sigue derecho hasta el
museo, que está del lado derecho de la calle, al lado de la biblioteca.»

---

## 4. Archivos de la fase

- `shared/exercises.ts` — tipo `StimulusVisual`, listas cerradas, límites y `visual?` en los dos estímulos.
- `src/features/learning/schema.ts` — `visualSchema` (descarta la imagen si llega mal formada).
- `content/stimulus-visuals.ts` — las cinco fichas, `withVisual`, `visualFor`, `visualSpecProblems`.
- `content/context-builders.ts` — los builders adjuntan la imagen lista.
- `content/comprehension-checks.ts` — la imagen tiene que ser la de su ficha; una descripción previa a
  responder no puede dar la respuesta; `stimulusVisualProblems`.
- `scripts/build-comprehension-sql.ts` — valida las fichas antes de escribir la migración.
- `scripts/image-info.ts`, `scripts/stimulus-visual-info.ts`, `npm run content:visual`.
- `src/features/learning/stimulusImages.ts` — registro de recursos empaquetados (vacío).
- `src/features/learning/components/ContextStimulus.tsx` — `StimulusVisualSlot` y `StimulusImage`.
- Pruebas: `content/__tests__/stimulus-visuals.test.ts`,
  `src/features/learning/__tests__/ContextStimulusVisual.test.tsx`.

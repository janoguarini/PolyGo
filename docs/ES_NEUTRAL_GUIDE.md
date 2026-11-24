# Español neutro para el curso «Spanish for English speakers»

Decisión del dueño (2026-11-21): el curso pasa del rioplatense con voseo al **español neutro de
Latinoamérica, con tú y ustedes**. Esta guía es la referencia editorial de la conversión. La aplica el
validador (`content/es-checks.ts`: `VOSEO`, `REGIONAL`, `isVoseo`).

## 1. Qué se conserva

- La estructura: 29 unidades, 5 lecciones escritas por unidad, 6–10 ejercicios por lección, temas,
  objetivos, progresión gramatical, tipos de ejercicio, estímulos y preguntas.
- Los ids de ejercicios (`es.ex.…`) y de estímulos (`es.stim.…`) cuando el ejercicio sigue siendo el
  mismo. Los ids de palabras (`es-…`) se renombran solo si cambia la palabra (`es-chau` → `es-adios`).
- Todo lo escrito en inglés que no hable de la variante.
- Seseo, yeísmo, b = v y h muda (también son del español latinoamericano): `soundKey` no cambia.
- El pretérito indefinido como pasado cotidiano (hoy comí, ya terminé) y el perfecto como forma menos
  frecuente en Latinoamérica (más frecuente en España). `ir a` + infinitivo para planes.

## 2. Gramática

| Antes (voseo)                         | Ahora (tú)                                    |
| ------------------------------------- | --------------------------------------------- |
| vos sos, tenés, querés, podés         | tú eres, tienes, quieres, puedes              |
| hablás, comés, vivís                  | hablas, comes, vives                          |
| preferís, jugás, empezás, sentís      | prefieres, juegas, empiezas, sientes (diptongo) |
| te llamás, te dedicás, te quedás      | te llamas, te dedicas, te quedas              |
| imperativo: doblá, seguí, tomá, vení  | dobla, sigue, toma, ven                       |
| poné, hacé, decí, andá                | pon, haz, di, ve                              |
| descansá, mirá, esperá, probá         | descansa, mira, espera, prueba                |
| enclíticos: llamame, decime, contame  | llámame, dime, cuéntame                       |
| fijate, sentate, acordate, avisame    | fíjate, siéntate, acuérdate, avísame          |
| negativo: no tomes (no tomés, coloq.) | no tomes                                      |
| con vos, para vos                     | contigo, para ti                              |
| ¿y vos?                               | ¿y tú?                                        |

- **Pronombre**: el sujeto «tú» se usa con moderación, como en el habla real (¿Cómo te llamas?, no
  «¿Cómo te llamas tú?»), salvo para contrastar o en «¿y tú?».
- **usted** sigue igual (formal); **ustedes** es el único plural. **vosotros** solo se explica en inglés
  (España), nunca se practica.
- **Voseo**: una sola mención en inglés (A1 U1 o U2): «In Argentina, Uruguay and parts of Central
  America you will also hear vos (vos sos = tú eres).» Si se muestra un ejemplo, se declara en
  `contrast` y va solo en la gramática o la introducción.
- **Diptongos e irregularidades** que antes el voseo ocultaba (tenés → tienes, podés → puedes, querés →
  quieres, jugás → juegas, preferís → prefieres, empezás → empiezas, dormís → duermes, volvés →
  vuelves, pedís → pides, seguís → sigues): ahora son visibles en la 2.ª persona; las explicaciones en
  inglés deben decirlo donde se enseña el verbo (yo tengo, tú tienes, él tiene).
- Con el voseo desaparece «el acento final del voseo» de las explicaciones de pronunciación y la regla
  «tengo / tenés» de los pares de escucha: reemplazar por pares reales (tengo / tienes, ¿hablas? /
  hablas…).

## 3. Pronunciación

- ll / y: como la **y** inglesa de *yes* (yeísmo general). Se elimina el «sh de *shoe*» (rehilado).
- Se mantienen: cinco vocales, h muda, r / rr, b = v, j y g fuerte, gue / gui, ñ, seseo (z y ce/ci como
  s; en España suena como *th*: una mención), tilde y sílaba tónica, entonación.

## 4. Léxico

| Rioplatense (no se muestra) | Neutro (se muestra)                      | Aceptar además |
| --------------------------- | ---------------------------------------- | -------------- |
| chau                        | adiós / hasta luego                      | chau, chao     |
| buen día (saludo)           | buenos días                              | buen día       |
| el kiosco (escenario base)  | la tienda / la tiendita                  | el kiosco      |
| che, dale                   | oye; claro, de acuerdo, está bien, vale* | —              |
| el colectivo                | el autobús                               | el colectivo, el camión |
| el subte                    | el metro                                 | el subte       |
| el auto                     | el carro                                 | el auto, el coche |
| el departamento             | el apartamento                           | el departamento, el piso |
| el living                   | la sala                                  | el living      |
| la lapicera                 | el bolígrafo                             | la pluma, la lapicera |
| la campera                  | la chaqueta                              | la campera     |
| las zapatillas              | los tenis                                | las zapatillas |
| la valija                   | la maleta                                | la valija      |
| el mozo / la moza           | el mesero / la mesera                    | el camarero, el mozo |
| la medialuna                | el pan dulce (o el croissant)            | la medialuna   |
| la plata                    | el dinero                                | la plata       |
| el talle                    | la talla                                 | el talle       |
| el resfrío                  | el resfriado                             | el resfrío     |
| la frutilla                 | la fresa                                 | la frutilla    |
| la palta                    | el aguacate                              | la palta       |
| la manteca                  | la mantequilla                           | la manteca     |
| la heladera                 | el refrigerador                          | la heladera, la nevera |
| la pileta                   | la piscina                               | la pileta, la alberca |
| la remera                   | la camiseta                              | la remera      |
| la pollera                  | la falda                                 | la pollera     |
| morocho                     | moreno (de pelo oscuro)                  | morocho        |
| jugoso (carne)              | término medio                            | jugoso         |
| a la mañana / a la tarde    | por la mañana / por la tarde             | a la mañana    |
| el mate (bebida cotidiana)  | el café / el té (el mate, como cultura)  | —              |

\* «vale» es de España: no usarlo como respuesta esperada.

`celular`, `computadora`, `billetera`, `remedio`, `pasantía`, `acá`/`aquí`, `manejar` son
latinoamericanos generales: se pueden mantener.

## 5. Contexto cultural

- Variar los lugares: Ciudad de México, Bogotá, Lima, Santiago, Buenos Aires, Madrid… La Argentina queda
  como un país más, no como el escenario por defecto.
- Estaciones: explicar que dependen del hemisferio (diciembre es verano en Chile y Argentina, invierno en
  México y España), sin asumir el sur.
- Precios: cifras orientativas en «pesos» o «dólares» cuando no importa el país; nada de inflación.
- Personajes ficticios, solo nombre de pila. Si un personaje se llama Tomás, sigue siendo un nombre
  (el validador ignora los nombres declarados en `names`).

## 6. Metadatos

- `shared/languages.ts`: `speechLocale: 'es-MX'`, variante «Español neutro de Latinoamérica (tú y
  ustedes)».
- `review.notes` de cada unidad: actualizar las dudas que mencionaban el rioplatense.
- Comentarios de cabecera de cada archivo de unidad: describir la variante nueva.

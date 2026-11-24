# Francés A1–A2: validación final (Fase 3)

Fecha: 2026-11-21. **Solo lectura.** El único archivo nuevo es este informe. Los 501 archivos de
`content/`, `scripts/`, `supabase/tests/`, `shared/` y `docs/` tienen el mismo hash antes y después de la
revisión. No se hicieron instalaciones, SQL, migraciones, commits ni builds, y PolyGo no se tocó.

## Veredicto

**`FRENCH CONTENT FINAL VALIDATION — BLOCKED`**

La parte técnica pasa completa: pruebas, ids, determinismo y diferencia exacta entre las migraciones de
29 y 30 unidades. La revisión pedagógica encontró **11 bloqueantes**:

- **7 de contenido:** francés mal escrito en pantalla, reglas de pronunciación erróneas o claves de
  respuesta que dan por mal una respuesta correcta.
- **4 de requisitos de escritura:** rechazan textos correctos.

**3 de los 11 están en la U13** de la Fase 2. **Los otros 8 ya estaban** en el contenido del 2026-11-14,
validado antes.

Ninguno se corrigió, como pide la consigna. Todos son correcciones de una línea, salvo B11 (reescribir un
patrón).

## 1. Método

- **Revisión independiente.** Cuatro revisores leyeron los archivos completos sin conocer las
  conclusiones previas:
  - A1 U1–U9;
  - A1 U10–U17 y la escritura A1;
  - A2 U1–U12 y la escritura A2;
  - A2 U13 con su tarea de escritura. Esta revisión fue aparte, porque la escribió quien coordina.
- **Verificación en el código.** Cada bloqueante se comprobó a mano en el archivo antes de incluirlo.
- **Repasos generados de la U13.** Los revisó directamente quien coordina, imprimiendo los 50 ejercicios.
- **Fuera de alcance:** las convenciones del curso, es decir, sin espacio antes de `?` y `!`, apóstrofo
  recto y sin IPA.

## 2. Bloqueantes

| #   | Lugar                                                                      | Problema                                                                                                                                                          | Corrección propuesta                                                                     | Origen       |
| --- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------ |
| B1  | `a2/unit13-moi-toi.ts:668` (`fr.ex.j1tedwyusbseh0`)                        | `Ne ___ pas ton passeport!` con la respuesta _oublie_ muestra «Ne oublie pas», sin elisión. Enseña el error en el mismo lugar donde se explica _n'oublie pas_     | `N'___ pas ton passeport!`                                                               | Fase 2 (U13) |
| B2  | Repaso generado `fr-a2-u13-rev1`, e10 (palabra `fr-toi`, traducción «vos») | Pide traducir «vos» sola y solo acepta _toi_. «Vos» como sujeto es _tu_: un alumno que escribe _tu_ queda mal                                                     | Traducción de la palabra menos ambigua (p. ej. «vos (con vos, para vos)») o aceptar _tu_ | Fase 2 (U13) |
| B3  | `fr/writing.ts:811-816` (`fr.a2.wt.consignes`, requisito `imperative`)     | Lista cerrada de 15 formas. Rechaza imperativos correctos (_donne, écoute, prends-les, ne te dépêche pas_) y acepta frases en presente (_le chat mange chez moi_) | Ampliar las formas, aceptar las que llevan guion y `ne/n'` + verbo; mejor aceptar de más | Fase 2 (U13) |
| B4  | `a1/unit11-loisirs.ts:336` (`fr.ex.jpf3u43mzztc39`)                        | «Le suena como la e de "de"; les, como una e más abierta». Un hispanohablante lee [le] y _le_ suena como _les_; además _les_ es la [e] **cerrada**                | «Le tiene una e débil, como la eu de deux; les suena como la e española (lé)»            | Previo       |
| B5  | `a1/unit14-descriptions.ts:440` y `:492` (`fr.ex.gm09tkbvutd5jb`)          | «En gentille sí se oye [la l]». Es falso: _-ille_ suena [ij]. El alumno diría «gentil-le»                                                                         | «En gentille, -ille suena como una y (gen-tiy)»                                          | Previo       |
| B6  | `a2/unit07-travail-etudes.ts:697`                                          | «En enfin, las dos sílabas tienen vocal nasal, como en vin». Son dos nasales distintas: _en-_ como en _vent_ y _-fin_ como en _vin_. Enseña «infin»               | Distinguir las dos nasales                                                               | Previo       |
| B7  | `a2/unit11-relations.ts:405-415` (`fr.ex.syzf7d94ox6t77`)                  | El distractor «nos encontramos» también traduce _on s'est rencontrés_ (cruzarse), y la explicación lo admite («o cruzárselo»)                                     | Reemplazarlo (p. ej. «nos separamos»)                                                    | Previo       |
| B8  | `a2/unit12-opinions.ts:877-881` (`fr.ex.i2r9wkdx1hu3wo`)                   | «Me dijo que estaba cansado» acepta solo _Il m'a dit…_. El ejercicio enlaza _elle m'a dit que_ y el español no dice quién habló                                   | Aceptar _Elle m'a dit qu'il était fatigué._ (y quizá _que j'étais_)                      | Previo       |
| B9  | `fr/writing.ts:268` (`fr.a1.wt.travail`, requisito `work`)                 | `travaille…` + `dans\|à` rechaza _je travaille au bureau_, que enseña A1 U13 y cita el propio checklist                                                           | Agregar `au\|aux`                                                                        | Previo       |
| B10 | `fr/writing.ts:42-43` / `:326` (`fr.a1.wt.projets`, `near-future`)         | `INFINITIFS` no tiene _aller_, así que _je vais aller à Lyon_ no cuenta como futuro próximo. Faltan también _regarder, écouter, dormir_                           | Agregarlos                                                                               | Previo       |
| B11 | `fr/writing.ts:736-745` (`fr.a2.wt.couple`, requisito `reflexive`)         | El prompt pregunta _Ils se sont rencontrés où?_, pero ningún patrón acepta _se sont_                                                                              | Agregar `sont` al tercer patrón o `['se','sont']`                                        | Previo       |

**Impacto.** La escritura (B3, B9, B10, B11) es opcional y se corrige en el dispositivo, sin guardar
texto. Sí le dice a un alumno que escribió bien que le falta algo, y por eso se mantiene como bloqueante.

## 3. Hallazgos menores (no bloquean)

### A2 U13

- **Diálogo `SORTIE` (`:27-29`) y pregunta `fr.ex.abx8vk46zfecsn`:**
  - el plan es para el domingo y los hermanos «travaillent samedi», así que la respuesta no explica nada
    y el distractor «trabajan el domingo» es el lógico;
  - _Allons-y à six heures!_ es raro, porque _allons-y_ es «vamos ahora»;
  - además _allons-y_ aparece en L3, antes de enseñarse en L4.
- **Intro de L1 (`:240`):**
  - «el sujeto nunca va separado del verbo» es falso: _je ne…_, _je le vois_;
  - la frase sobre _lui / elle_ está mal armada: debería decir que _elle_ es sujeto y tónico, y que para
    «él» el sujeto es _il_ y el tónico _lui_.
- **Distractores:** «tranquilo» (`fr.ex.ks9f77moqi0wb9`) es defendible para _sois sage_; «contigo»
  (`fr.ex.7rmq35zntib70l`) rompe el voseo, mejor «con vos».
- **Respuestas aceptadas que faltan:**
  - _Avec mes frères._;
  - _Ne t'inquiète pas, tout va bien._;
  - _On va être en retard!_;
  - _Allons-y!_ en la propuesta de nous;
  - _Moi, je viens de Buenos Aires._
- **Nota de la mamá (`MOT`):** _attends-la_ usa _la_ en el imperativo, que L5 no explica; _n'oublie pas
  les clés_ no tiene un propósito claro.
- **Escritura:** el modelo dice _le chat dort avec moi_ en una nota de alguien que se va (mejor _dans ma
  chambre_).
- **Detalles:**
  - L3 no enseña _moi si_ y usa «yo sí» como distractor;
  - las consignas «Respondé que a vos también» están incompletas.

### A1 U1–U9

- _Tu es / il est suenan igual_: lo que suena igual es _es / est_ (U2 `:232`, `:291`).
- La regla del femenino aparece justo después de _espagnol / espagnole_, que suenan igual (U2 `:70`,
  `:341`). Las nacionalidades van con mayúscula cuando son sustantivo.
- **Números (U3):**
  - _huit_ no admite elisión ni liaison (`:236`), aunque la h no suene;
  - la _q_ de _cinq_ casi siempre suena (`:152`, `:203`);
  - _il / elle_ se distinguen por la vocal (`:451`);
  - falta un espacio en «suena.Para» (`:395`).
- _Poisson_ no es falso amigo para hispanohablantes: la trampa es _poisson / poison_ (U7). Falta «el pez»
  como traducción aceptada.
- **Respuestas que faltan:** _je prends mon petit-déjeuner_ (U8 `:692`) y _Oui, ça va, et toi?_ (U1
  `:515`).
- _En semaine_ es mejor que _la semaine_ (U9 `:47`, `:183`). En el diálogo de U9, _Et demain?_ no tiene
  una respuesta coherente (`:35`).
- En español: «¿Cómo **se** tratan…?» (U1 `:497`).

### A1 U10–U17

- **Números (U12):**
  - _quinze / cinq_ se distinguen por las consonantes, no por la nasal (`:556`);
  - la regla de _et un_ no vale para _quatre-vingt-un_ (`:485`).
- **Futuro próximo (U17):** _on va au cinéma_ se presenta como futuro próximo y es presente (`:552`). _En
  voiture, c'est loin_ es mejor como _c'est trop long_ (`:34`).
- **Distractores en francés válido:** _il a froid_ (U16 `:261`) y _elle est au cinéma_ (U10 `:337`). Solo
  el español los descarta.
- Falta _à l'_ delante de vocal en «au con los masculinos» (U10 `:292`).
- Frases poco naturales: _J'aime le chat_ como gusto general (U11 `:330`) y _Nous sommes la famille
  Martin_ (U13 `:35`).
- **Escritura:** el requisito de pregunta (`achats`) no acepta _est-ce que_ ni la entonación, y `METIERS`
  no tiene plurales.
- **Notas:**
  - _bel / vieil_;
  - el futuro próximo en U15, antes de U17;
  - _quel_ = «qué / cuál»;
  - «tocar (un instrumento)» como traducción aceptada.

### A2 U1–U12

- **Reglas demasiado generales:**
  - «los -ir hacen -i» (U1 `:53`), cuando U2 enseña _venu_;
  - «la h no suena, por eso hay elisión» (U2 `:356`);
  - _-ais / -iez_ suenan distinto por la vocal (U3 `:99`);
  - _il / elle_ se distinguen por la vocal (U8 `:227`, `:261`);
  - la concordancia con recíprocos: _ils se sont parlé_ no concuerda (U11).
- _Pendant_ con presente y futuro contradice la regla (U7 `:82`, `:475` frente a `:31`).
- _Je les vois le samedi_ se acepta, pero significa «los sábados» (U10 `:653`).
- **Ejercicio duplicado:** U10 L1 e9 = U12 L4 e9 («Mi computadora no funciona»). Es el único ejercicio
  escrito idéntico en todo el curso (comprobado por programa).
- **Respuestas que faltan:** _Je m'entends bien avec ma sœur_ (U11 `:612`) y las de U4 `:690`.
- **Consigna (U12):** «de acuerdo con él o ella» y la respuesta _avec toi_ (`:387`). Hay una errata,
  «une consecuencia» (`:529`).
- **Escritura:**
  - en `week-end` faltan participios en -é;
  - en `histoire` no cuenta el passé composé con _être_;
  - `reservation` exige _réserver_ literal;
  - prompts mejorables en `candidature` y `enfance`.
- **Notas:**
  - _composter_ está desactualizado;
  - _la carte_ no es falso amigo;
  - _j'y allais_ y _appelle-moi_ se usan como bloques antes de enseñarse.

## 4. Revisión pedagógica: conclusiones

- **Calidad general.** Los cuatro revisores coinciden en que el francés es correcto y natural y en que la
  progresión A1 → A2 es lógica. Las respuestas de comprensión están respaldadas por los textos, y están
  bien tratados:
  - auxiliares y concordancias;
  - _imparfait_ frente a _passé composé_;
  - pronombres;
  - contracciones;
  - _c'est / il est_;
  - partitivos;
  - falsos amigos.
- **Dónde están los problemas:**
  - algunas explicaciones de pronunciación (B4–B6);
  - claves de respuesta estrechas (B2, B7, B8);
  - requisitos de escritura demasiado rígidos (B3, B9–B11).
- **A2 U13.** La progresión de las cinco lecciones es correcta: tónico para remarcar, después de
  preposición, acuerdo, imperativo y pronombre en el imperativo. Las reglas (sin _s_ en _-er_, _vas-y_,
  _sois / aie / sache_, posición del pronombre, _eux / elles_, _c'est moi / c'est à moi_) y la
  pronunciación están bien. Los tres bloqueantes son mecánicos.
- **Repasos generados de la U13.** Los 50 ejercicios (rev1, rev2, listen, words, final) solo usan las 20
  palabras y frases de la unidad, en coherencia con las lecciones. El único problema es B2.
- **Duplicados y nivel.** No hay palabras repetidas: el validador lo comprueba. El único ejercicio
  escrito idéntico entre unidades es el de A2 U10 / U12. No hay vocabulario fuera de lo enseñado (0
  problemas en el validador). Las pocas formas que se usan antes de explicarse son bloques fijos (notas
  del §3).

## 5. Resultados técnicos

| Comprobación                                     | Resultado                          | Dónde                                         |
| ------------------------------------------------ | ---------------------------------- | --------------------------------------------- |
| Validador de francés (30 unidades)               | 0 problemas                        | cliente                                       |
| Validador de escritura (25 tareas)               | 0 problemas                        | cliente                                       |
| `npm run typecheck`                              | OK                                 | cliente                                       |
| `npm run content:ids -- check`                   | «el contenido respeta el registro» | cliente                                       |
| `frContent.test.mjs` (PGlite)                    | 8/8                                | copia temporal (ya borrada), cadena de PolyGo |
| `jest content` (19 suites, incluye `fr.test.ts`) | 6026/6026                          | copia temporal                                |

El validador automático comprueba vocabulario, estructura y corrección del servidor. No detecta errores
de pronunciación ni de naturalidad: por eso pasa mientras la revisión humana bloquea.

## 6. Integridad de ids

- `ids.lock.json` tiene 15 186 entradas. Frente a la línea base anterior a la Fase 2 (15 106): **80
  nuevas, 0 cambiadas, 0 eliminadas**, todas de francés.
- **Las 80 nuevas:**
  - 50 ejercicios escritos `fr.ex.*` de la U13;
  - 30 ítems generados `fr.gen.*` de las palabras de la U13.
- `content:ids -- check` da OK: cada ejercicio conserva su identidad.
- Los caminos generados de las 29 unidades anteriores (290 lecciones y 2898 ejercicios) son idénticos a
  los de PolyGo.

## 7. Migraciones

### Hashes (generadas dos veces desde el cliente; idénticas, deterministas)

| Archivo                               | 29 unidades (PolyGo)                                               | 30 unidades (cliente)                                              |
| ------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `20261202120000_fr_a1_a2.sql`         | `e241740213b846a49f6a3bb5d88b83615045aff3bb7fdcfd5de16356d0ad4e12` | `24abe90130ff5c8f5abed1f2764cf2ab1c25e2b91758ea47ae04612fed2c302d` |
| `20261203120000_publish_fr_a1_a2.sql` | `168f080e7fc060fb27aedb69978945440f00151910a0d61c25628296ab0229ee` | `6612fae8266373830ec532c5fb48058a95145980a7da09ebf82332ca78aa70ce` |

Ninguna está en `supabase/migrations/` ni en `pending/` del cliente. Las de PolyGo siguen siendo las de 29
unidades.

### Diferencias entre 29 y 30 unidades

- **Plantilla:** idéntica, con las mismas 558 líneas. Cambian solo 3 líneas de comentario (lista de
  unidades y recuentos) y los datos JSON.
- **Datos de la carga,** comparados fila por fila:

| Tabla                         | 29   | 30   | Faltan | Nuevas | Nuevas ajenas a la U13 |
| ----------------------------- | ---- | ---- | ------ | ------ | ---------------------- |
| units                         | 29   | 30   | 0      | 1      | 0                      |
| words                         | 528  | 548  | 0      | 20     | 0                      |
| lessons                       | 290  | 300  | 0      | 10     | 0                      |
| exercises                     | 2898 | 2998 | 0      | 100    | 0                      |
| catalog.concepts              | 528  | 548  | 0      | 20     | 0                      |
| catalog.items                 | 2351 | 2431 | 0      | 80     | 0                      |
| catalog.item_concepts         | 4640 | 4767 | 0      | 127    | 0                      |
| catalog.placements            | 2898 | 2998 | 0      | 100    | 0                      |
| catalog.scope_lessons         | 290  | 300  | 0      | 10     | 0                      |
| catalog.versions              | 2351 | 2431 | 0      | 80     | 0                      |
| catalog.current_versions      | 2351 | 2431 | 0      | 80     | 0                      |
| catalog.placement_versions    | 2898 | 2998 | 0      | 100    | 0                      |
| catalog.option_sets           | 1439 | 1491 | 0      | 52     | 0                      |
| catalog.placement_option_sets | 1696 | 1758 | 0      | 62     | 0                      |

Ninguna fila de la versión de 29 unidades cambia ni desaparece. Las tablas de personas y objetivos
siguen vacías.

- **Publicación:** ids de unidades 29 → 30, palabras 528 → 548, lecciones 290 → 300, ejercicios
  2898 → 2998, ítems activos 2163 → 2237 y en borrador 188 → 194. En todos los casos son 0 faltantes, y
  el rango de seguridad pasa a A2 1–13.

## 8. Próximo paso

Para pasar a **PASS** hace falta autorizar la corrección de B1–B11. Son 3 cambios en la U13 y 8 en
contenido previo, que además de francés tocan `writing.ts` (B3, B9–B11).

- **Efectos de corregir.** Cambian los SQL generados (B1, B2, B7, B8 cambian datos; B4–B6 cambian
  explicaciones) y, por lo tanto, sus hashes. Hay que regenerarlos y repetir este informe.
- **Ids:** las correcciones de texto en un ejercicio existente no deberían cambiar su identidad, pero
  `content:ids -- check` lo dirá.
- **Hallazgos menores:** conviene corregirlos en el mismo pase o dejarlos para la revisión nativa
  (`FR_A1_A2.md` §7).

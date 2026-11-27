# Español B1 (Spanish for English speakers)

Estado (2026-11-27): **publicado en producción**. Carga `supabase/migrations/20270106120000_es_b1.sql` y publicación `supabase/pending/20270106120100_publish_es_b1.sql`, aplicadas por psql (Session Pooler) con su fila de historial (`es_b1`, `publish_es_b1`). Sin revisión de hablantes nativos: las dudas están en el `review.notes` de cada unidad. Sigue al A1 y al A2 completos y publicados
([ES_A1_A2.md](ES_A1_A2.md)). Objetivo de producto: completar el curso hasta B1 para abrirlo en
Estados Unidos y el Reino Unido.

Enfoque: el del inglés B1 ([B1_EN.md](B1_EN.md)) y el del español A1/A2. PolyGo enseña, no
certifica; el MCER (y el Plan Curricular del Instituto Cervantes para B1) es una guía de nivel.

## 1. Reglas editoriales (no negociables)

- **Variante: español neutro de Latinoamérica con tú y ustedes** ([ES_NEUTRAL_GUIDE.md](ES_NEUTRAL_GUIDE.md)),
  pensado para que lo entienda cualquier hispanohablante y cercano al español de México, que es el
  que más va a escuchar quien vive en EE. UU.
  - Nada de voseo (vos, tenés, sos, hablá) ni vosotros (habláis, tenéis). Usted para lo formal.
  - Léxico panhispánico o mexicano-general: carro, celular, computadora, apartamento, autobús,
    metro, mesero, boleto, cuarto, chamarra/chaqueta, lentes… Nada de rioplatense (che, dale, laburo,
    colectivo) ni de España como forma enseñada (vale, coger, ordenador, móvil, vosotros, tío).
  - El pretérito indefinido sigue siendo el pasado de todos los días (hoy comí, ya terminé). El
    pretérito perfecto se usa para experiencias sin tiempo concreto (¿alguna vez has…?).
- **Idioma de apoyo: inglés.** Títulos, objetivos, explicaciones, consignas, traducciones, preguntas de
  comprensión y tareas de escritura en inglés (inglés internacional: sirve en EE. UU. y Reino Unido).
- **Lugares variados**, con México muy presente: Ciudad de México, Guadalajara, Monterrey, Oaxaca,
  Mérida, Puebla, Bogotá, Medellín, Lima, Santiago, Quito, San José, Buenos Aires, Madrid. Personajes
  ficticios con nombre de pila; ningún dato de contacto. Cifras en pesos o dólares, sin inflación.
- **Nivel B1**: textos más largos y naturales que A2 (diálogos de 6–9 líneas, lecturas de 5–8
  oraciones), conectores, opinión y argumentación simple, registro formal en correos y quejas.
  Audio a velocidad 0.95 (A2: 0.9).

## 2. Estructura (igual que A1/A2 y que el inglés B1)

- 12 unidades (`content/es/b1/unit01…12-*.ts`), 17 palabras cada una (validador: 14–20).
- 5 lecciones escritas por unidad + 5 repasos generados (`content/path.ts`) = 10 lecciones por unidad.
- Cada lección: objetivo, introducción con explicación y 2 ejemplos, 2 cierres («You can…»),
  8–10 ejercicios, al menos un `listen_choice`, los dos últimos de producción (`translate_write` o
  `short_answer`).
- Cada unidad: 4–5 estímulos (`dialogue` / `reading`) con 2–3 preguntas `context_choice` cada uno
  (ids `es.stim.b1-uN-…`), gramática con 3 ejemplos, `review.status: 'draft'` y notas de revisión.
- Una tarea de escritura guiada por unidad (`es.b1.wt.…`) al terminar la L5, y tres libres al terminar
  el repaso final de U4, U8 y U12.
- Vocabulario: todo el español usa lo enseñado antes (A1, A2 y las unidades B1 anteriores), las palabras
  ya introducidas en la unidad, los nombres declarados o el **apoyo** de la unidad (`support`, máximo
  90 formas: las conjugaciones nuevas del subjuntivo, del futuro, etc. que se muestran sin ser palabras
  objetivo). Lo comprueba `content/es-checks.ts`.

Camino propio, como el inglés B1: `content/es-course.ts` → `ES_B1` y `ES_B1_PATH`, fuera de `ES_PATH`
(la carga y la publicación del A1/A2 no cambian; la nivelación y Ranked siguen con A1/A2).

## 3. Unidades

Formato de cada palabra: texto · traducción. Las palabras ya enseñadas en A1/A2 (ojalá, sin embargo, por
eso, la solución, devolver, dice que, me dijo que, el horario, el boleto, el barrio, tener razón…) no se
repiten: se usan libremente.

### U1 · Life experiences («Experiencias de vida») 🌍

- **Gramática**: pretérito perfecto ampliado (he, has, ha, hemos, han + participio); participios
  irregulares (hecho, visto, dicho, escrito, vuelto, puesto, abierto, roto); ¿alguna vez has…?, nunca,
  jamás, todavía no, ya; contraste: perfecto para la experiencia sin fecha (he estado en Oaxaca) e
  indefinido con fecha (fui a Oaxaca en 2023).
- **Objetivo**: hablar de experiencias de vida, preguntar a alguien si alguna vez hizo algo y contar
  cuándo pasó.
- **Palabras**: la experiencia · experience; por primera vez · for the first time; varias veces · several
  times; en mi vida · in my life; jamás · never (ever); he visto · I have seen; he hecho · I have done;
  he dicho · I have said; he escrito · I have written; he vuelto · I have come back; he probado · I have
  tried; he conocido · I have met; inolvidable · unforgettable; el idioma · language; el sueño · dream;
  cumplir un sueño · to make a dream come true; me sorprendió · it surprised me.
- **Estímulos**: entrevista de radio a una viajera (audio); publicación «Cosas que he hecho antes de los
  30» (lectura); conversación en una fiesta en Guadalajara (audio); correo a una amiga desde Oaxaca
  (lectura).
- **Escritura**: «An unforgettable experience» (perfecto + indefinido con fecha).

### U2 · Habits and hobbies («Hábitos y pasatiempos») 🎨

- **Gramática**: perífrasis: soler + infinitivo; llevar + tiempo + gerundio (llevo dos años
  estudiando); seguir + gerundio; dejar de, volver a, empezar a + infinitivo; desde hace (repaso).
- **Objetivo**: hablar de costumbres y pasatiempos, decir cuánto tiempo llevas haciendo algo y qué
  dejaste o volviste a hacer.
- **Palabras**: el pasatiempo · hobby; suelo · I usually; llevo · I have been (+ -ing, with time); sigo ·
  I'm still (+ -ing); dejé de · I stopped (doing); volví a · I … again; empecé a · I started (to); entrenar ·
  to train; el gimnasio · gym; correr · to run; nadar · to swim; pintar · to paint; la costumbre · habit,
  custom; aburrirse · to get bored; relajarse · to relax; el equipo · team; inscribirse · to sign up.
- **Estímulos**: dos amigos en Monterrey hablan del gimnasio (audio); anuncio de un centro cultural en
  Puebla (lectura); entrevista a un corredor de Bogotá (audio); foro «¿Qué pasatiempo empezaste este
  año?» (lectura).
- **Escritura**: «My hobby» (llevo + gerundio, suelo, desde hace).

### U3 · Anecdotes («Anécdotas») 😅

- **Gramática**: pluscuamperfecto (había + participio: ya había salido); narración con indefinido
  (hechos) e imperfecto (escena); conectores de relato: en ese momento, por fin, al final, en cuanto,
  luego, de repente (repaso).
- **Objetivo**: contar una anécdota en orden, decir qué ya había pasado antes y reaccionar a la historia
  de otra persona.
- **Palabras**: la anécdota · anecdote; contar · to tell; la historia · story; olvidar · to forget; había
  olvidado · I had forgotten; había salido · had left; darse cuenta · to realize; en ese momento · at that
  moment; por fin · finally (at last); al final · in the end; en cuanto · as soon as; equivocarse · to make
  a mistake; el susto · scare, fright; reírse · to laugh; la sorpresa · surprise; me pasó · it happened to
  me; avergonzado · embarrassed.
- **Estímulos**: anécdota en el metro de la Ciudad de México (audio); mensaje «No vas a creer lo que me
  pasó» (lectura); dos colegas en Lima se cuentan un susto (audio); relato de una boda en Mérida (lectura).
- **Escritura**: «A funny anecdote» (pluscuamperfecto + conectores).

### U4 · Plans and goals («Planes y metas») 🎯

- **Gramática**: futuro simple con irregulares (tendré, podré, saldré, sabré, pondré, haré, diré,
  vendré); cuando + presente de subjuntivo (cuando tenga dinero, cuando termine) frente a cuando +
  presente (costumbre); ir a (repaso); dentro de + tiempo.
- **Objetivo**: hablar de metas y planes a futuro, decir qué harás cuando algo pase y en cuánto tiempo.
- **Palabras**: el objetivo · goal; la meta · aim, goal; lograr · to achieve; conseguir · to get, to
  manage; ahorrar · to save (money); mudarse · to move (house); tendré · I will have; podré · I will be
  able to; saldré · I will go out; sabré · I will know; pondré · I will put; cuando tenga · when I have;
  cuando termine · when I finish; dentro de · in (time from now); algún día · some day; el proyecto ·
  project; el futuro · future.
- **Estímulos**: una pareja de Querétaro planea mudarse (audio); lista de propósitos de año nuevo
  (lectura); orientadora y estudiante hablan de metas (audio); publicación «Dentro de cinco años…»
  (lectura).
- **Escritura**: «Your goals» (futuro + cuando + subjuntivo). Libre al final de la unidad: «Your life in
  ten years».

### U5 · Work and studies («Trabajo y estudios») 💼

- **Gramática**: presente de subjuntivo (formación regular e irregulares frecuentes: tenga, haga, sea,
  vaya, pueda, sepa) con deseo y necesidad: quiero que, espero que, es importante que, es necesario que;
  correo formal (estimado, atentamente, le escribo para…); usted en el trabajo.
- **Objetivo**: postularse a un puesto, presentarse en una entrevista y escribir un correo formal.
- **Palabras**: quiero que · I want (someone) to; espero que · I hope (that); es importante que · it's
  important that; es necesario que · it's necessary that; el jefe · boss; el puesto · position, job;
  solicitar · to apply for; contratar · to hire; la carrera · degree, career; la beca · scholarship; el
  cliente · client, customer; estimado · dear (formal); atentamente · sincerely; la fecha límite · deadline;
  renunciar · to resign, to quit; el turno · shift; el ascenso · promotion.
- **Estímulos**: anuncio de trabajo en Guadalajara (lectura); entrevista de trabajo (audio); correo de
  una jefa al equipo (lectura); dos estudiantes hablan de una beca (audio).
- **Escritura**: «A formal email to apply for a job».

### U6 · Travel and culture («Viajes y cultura») 🧳

- **Gramática**: subjuntivo para recomendar y aconsejar (te recomiendo que, te aconsejo que, es mejor
  que + subjuntivo); si + presente, futuro o imperativo (repaso y ampliación: si vas a Oaxaca, prueba…);
  imperativo con pronombres (llévalo, pruébalo).
- **Objetivo**: recomendar lugares y costumbres a un visitante, resolver un retraso o una cancelación y
  comportarse de forma educada en otra cultura.
- **Palabras**: te recomiendo que · I recommend that you; te aconsejo que · I advise you to; es mejor
  que · it's better that; la tradición · tradition; el destino · destination; el alojamiento ·
  accommodation; el recorrido · tour, route; el retraso · delay; cancelar · to cancel; la reserva ·
  reservation, booking; el mercado · market; las artesanías · handicrafts; regatear · to haggle; el
  monumento · monument; educado · polite; grosero · rude; saludar · to greet.
- **Estímulos**: guía de Oaxaca para visitantes (lectura); en el mostrador del aeropuerto: vuelo con
  retraso (audio); amigos de Cusco y de la CDMX comparan costumbres (audio); publicación «Cinco cosas
  que no debes hacer en…» (lectura).
- **Escritura**: «Advice for a visitor» (te recomiendo que + subjuntivo, si + presente).

### U7 · Health and well-being («Salud y bienestar») 🧘

- **Gramática**: condicional para consejos (deberías, yo que tú, yo en tu lugar, sería mejor);
  subjuntivo con emociones (me alegra que, me preocupa que + subjuntivo); comparativos de cantidad y
  progresión (cuanto más…, más…; cada vez más).
- **Objetivo**: dar y pedir consejos de salud, hablar del estrés y de hábitos sanos y reaccionar con
  emoción a lo que cuenta otra persona.
- **Palabras**: yo que tú · if I were you; en tu lugar · in your place; sería mejor · it would be
  better; me alegra que · I'm glad that; me preocupa que · it worries me that; la salud · health; el
  estrés · stress; la dieta · diet; sano · healthy; el ejercicio · exercise; cuidarse · to look after
  oneself; bajar de peso · to lose weight; fumar · to smoke; agotado · exhausted; el bienestar ·
  well-being; cuanto más · the more; meditar · to meditate.
- **Estímulos**: consulta con una nutrióloga (audio); artículo «Cómo dormir mejor» (lectura); amigas
  hablan del estrés en el trabajo (audio); mensaje de ánimo a un amigo (lectura).
- **Escritura**: «Advice for a stressed friend» (condicional + subjuntivo).

### U8 · Technology and communication («Tecnología y comunicación») 📱

- **Gramática**: oraciones de relativo (que, quien —como apoyo: choca con «quién» de A1—, donde, lo que, el que / la que); busco una app que
  - subjuntivo (algo que no se conoce) frente a tengo una app que + indicativo; pronombres de objeto
    (repaso: se lo mando).
- **Objetivo**: describir apps y aparatos, pedir ayuda técnica y hablar de las redes sociales.
- **Palabras**: lo que · what (the thing that); el que · the one that; el usuario · user; donde · where
  (relative); las redes sociales · social media; publicar · to post; compartir · to share; descargar ·
  to download; la videollamada · video call; el archivo · file; la batería · battery; cargar · to charge;
  actualizar · to update; borrar · to delete; el enlace · link; el comentario · comment; guardar · to save.
- **Estímulos**: soporte técnico por teléfono (audio); reseña de una app para aprender idiomas
  (lectura); dos hermanos discuten sobre las redes (audio); instrucciones para una videollamada
  (lectura).
- **Escritura**: «Recommend an app» (relativos). Libre al final de la unidad: «Technology in your life».

### U9 · Environment and society («Medio ambiente y sociedad») ♻️

- **Gramática**: se impersonal y pasivo (se recicla, se venden, se construyó); voz pasiva con ser +
  participio (fue construido por…); opinión negada con subjuntivo (no creo que, dudo que + subjuntivo)
  frente a creo que + indicativo.
- **Objetivo**: hablar de problemas del medio ambiente y de la comunidad, explicar qué se hace para
  resolverlos y dar una opinión matizada.
- **Palabras**: el medio ambiente · environment; la naturaleza · nature; reciclar · to recycle; la
  basura · trash, rubbish; la contaminación · pollution; contaminar · to pollute; proteger · to protect;
  la energía · energy; el plástico · plastic; el bosque · forest; el cambio climático · climate change;
  gastar · to spend, to use up; el voluntario · volunteer; la comunidad · community; no creo que · I don't
  think that; dudo que · I doubt that; el reciclaje · recycling.
- **Estímulos**: programa de radio sobre el reciclaje en Monterrey (audio); cartel de una jornada de
  voluntarios en un bosque (lectura); vecinos discuten la contaminación (audio); artículo sobre un
  mercado sin plástico en Bogotá (lectura).
- **Escritura**: «Your neighborhood and the environment» (se + verbo, no creo que).

### U10 · News and media («Noticias y medios») 📰

- **Gramática**: estilo indirecto: dijo que / explicó que / contó que + cambio de tiempo (es → era,
  va a → iba a, vendrá → vendría); preguntó si / dónde…; me pidió que + subjuntivo; según.
- **Objetivo**: contar una noticia, transmitir lo que dijo o preguntó otra persona y hablar de los medios
  que consultas.
- **Palabras**: las noticias · news; el periódico · newspaper; el artículo · article; el periodista ·
  journalist; el titular · headline; explicó que · explained that; contó que · told (that); me preguntó si
  · asked me if; me pidió que · asked me to; según · according to; ocurrir · to happen, to occur; anunciar ·
  to announce; el incendio · fire; la tormenta · storm; el gobierno · government; el testigo · witness;
  informar · to inform, to report.
- **Estímulos**: noticia de radio sobre una tormenta en Veracruz (audio); titulares del día (lectura);
  una testigo habla con un periodista (audio); mensaje que resume una reunión (lectura).
- **Escritura**: «What they told you» (estilo indirecto).

### U11 · Opinions and relationships («Opiniones y relaciones») 💬

- **Gramática**: condicional irreal: si + imperfecto de subjuntivo + condicional (si tuviera, si
  pudiera, si fuera + iría, haría, sería) con las formas más frecuentes; opinar, acordar y discrepar
  (estoy en contra, por un lado / por otro lado, en cambio).
- **Objetivo**: dar una opinión con argumentos, aceptar o rechazar la de otro con cortesía e imaginar
  situaciones hipotéticas.
- **Palabras**: opinar · to give an opinion; discutir · to argue, to discuss; convencer · to convince; la
  ventaja · advantage; la desventaja · disadvantage; estar en contra · to be against; por un lado · on
  the one hand; por otro lado · on the other hand; en cambio · however, on the other hand; si tuviera ·
  if I had; si pudiera · if I could; si fuera · if it were, if I were; iría · I would go; haría · I would do;
  la amistad · friendship; confiar · to trust; el respeto · respect.
- **Estímulos**: debate en clase sobre trabajar desde casa (audio); carta a una columna de consejos
  (lectura); amigos imaginan qué harían con un premio (audio); foro «¿Vivir en la ciudad o en el campo?»
  (lectura).
- **Escritura**: «Your opinion» (por un lado / por otro lado, si tuviera…).

### U12 · Problems and solutions («Problemas y soluciones») 🛠️

- **Gramática**: conectores de causa, consecuencia y concesión (ya que, por lo tanto, aunque + indicativo,
  a pesar de); probabilidad (a lo mejor + indicativo, quizás + subjuntivo, seguramente); la queja formal
  (le escribo para quejarme de…, solicito un reembolso).
- **Objetivo**: explicar un problema, presentar una queja formal y negociar una solución.
- **Palabras**: aunque · although; por lo tanto · therefore; ya que · since, because; a pesar de · in spite
  of; a lo mejor · maybe; quizás · perhaps; seguramente · probably, surely; la queja · complaint;
  quejarse · to complain; reclamar · to claim, to complain; el reembolso · refund; la garantía ·
  warranty; arreglar · to fix; resolver · to solve; el técnico · technician; dañado · damaged; el
  servicio al cliente · customer service.
- **Estímulos**: llamada a servicio al cliente por una lavadora dañada (audio); correo de queja a un
  hotel (lectura); vecinos buscan una solución al ruido (audio); respuesta de una tienda con un
  reembolso (lectura).
- **Escritura**: «A formal complaint» (conectores + queja formal). Libre al final de la unidad: «A problem
  you solved».

## 4. Resultado

- 12 unidades, 120 lecciones (60 escritas + 60 generadas), 204 palabras, 1200 ejercicios (600 escritos),
  49 estímulos con ~145 preguntas de comprensión, 15 tareas de escritura (12 guiadas + 3 libres).
- Registro de ids: 963 ítems nuevos (`npm run content:ids`). Publicación: 817 ítems activos y 146
  `context_choice` en draft (D4).
- Validación: `content/es-checks.ts` da 0 problemas en A1, A2 y B1 y en la escritura;
  `content/__tests__/esB1.test.ts`; `supabase/tests/esB1Content.test.mjs` (PGlite) 8/8: add-only,
  reaplicable, nada visible antes de publicar, publicación idempotente y las 120 lecciones jugadas con la
  corrección del servidor.
- Redacción en paralelo (2 unidades por redactor) y revisión editorial independiente de las 12 unidades
  (distractores que también eran correctos, respuestas aceptadas que faltaban, frases poco naturales y
  explicaciones imprecisas).
- Audios neurales (Chirp 3 HD: Zephyr + Orus) del B1 generados y subidos al bucket `tts` (`npm run tts`): 1349 audios
  nuevos.
- Sin cambios en la app para las lecciones (mismos tipos de ejercicio que el inglés B1). Las tareas de
  escritura B1 y las voces neurales llegan con el próximo build. Ranked, la nivelación y el nivel de
  inicio siguen en A1/A2.

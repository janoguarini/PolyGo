import type { WritingRequirement, WritingTaskDef } from '../../shared/writing';

/**
 * Producción escrita de español A1 y A2 sin IA (docs/ES_A1_A2.md), con el mismo sistema que los demás
 * idiomas (shared/writing.ts): se comprueba en el dispositivo y el texto no se envía ni se guarda.
 * Práctica opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * Como el resto del curso de español, las consignas, los requisitos y las listas de control van en
 * inglés (el idioma de apoyo) y los modelos, en español rioplatense con voseo.
 *
 * - `guided`: requisitos observables (las estructuras que la lección acaba de practicar). Completa =
 *   todos los obligatorios cumplidos.
 * - `free`: texto libre de bloque, sin veredicto: modelo, pistas opcionales y lista de control.
 *
 * Sólo vocabulario enseñado hasta la lección (lo comprueba content/es-checks.ts).
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
 */

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `You write at least ${minSentences} sentences`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Each sentence starts with a capital letter', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'You end with a full stop, an exclamation mark or a question mark',
    kind: 'end_punctuation',
  },
];

const base = { language: 'es', allowInvented: true as const, maxChars: 900 };
const a2 = { ...base, maxChars: 1200 };

/** Pretéritos de A2 U1–U2 (yo y él / ella). */
const PRETERITOS =
  'comí|comió|hablé|habló|miré|miró|terminé|terminó|dormí|durmió|hice|hizo|vi|vio|tomé|tomó|leí|leyó|fui|fue|estuve|estuvo|tuve|tuvo|vine|vino|salí|salió|llegué|llegó|volví|volvió|quedé|quedó|ordené|limpié';
const INFINITIVOS =
  'viajar|visitar|tomar|quedarme|salir|bailar|cocinar|leer|jugar|comer|ir|hacer|trabajar';

export const ES_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ A1, guiadas
  {
    ...base,
    id: 'es.a1.wt.presentacion',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u02-l05',
    title: 'Introduce yourself',
    instructions:
      'Introduce yourself in Spanish (real or invented details): say hello, your name, your nationality, where you live and what language you speak.',
    prompts: ['¿Cómo te llamás?', '¿De dónde sos?'],
    glossary: [{ term: 'Chicago', meaning: 'Chicago' }],
    requirements: [
      {
        id: 'name',
        label: 'You say your name (me llamo…)',
        kind: 'pattern',
        patterns: [['me', 'llamo']],
      },
      {
        id: 'origin',
        label: 'You say where you are from or where you live (soy de… / vivo en…)',
        kind: 'pattern',
        patterns: [
          ['soy', 'de'],
          ['vivo', 'en'],
        ],
      },
      ...common(3),
    ],
    model:
      '¡Hola! Me llamo Emma. Soy estadounidense, de Chicago. Vivo en Buenos Aires y soy estudiante. Hablo inglés y también un poco de español.',
    checklist: [
      'I start with a greeting.',
      'I use soy for my nationality and vivo en for my city.',
      'Nationalities change for women: argentino → argentina.',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.familia',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u04-l05',
    title: 'Your family',
    instructions:
      'Introduce your family: who they are, what their names are and how old they are. Use mi and mis.',
    prompts: ['¿Cómo se llama tu mamá?', '¿Tenés hermanos?'],
    requirements: [
      {
        id: 'possessive',
        label: 'You use mi or mis (mi papá, mis hermanos…)',
        kind: 'pattern',
        patterns: [['mi|mis', '<WORD>']],
      },
      {
        id: 'name',
        label: 'You say what someone is called (se llama…)',
        kind: 'pattern',
        patterns: [['se', 'llama|llaman']],
      },
      ...common(3),
    ],
    model:
      'Mi papá se llama Juan y mi mamá se llama Ana. Tengo un hermano y una hermana. Mi hermana se llama Sofía y tiene doce años. También tengo un perro.',
    checklist: [
      'I use mi with one person and mis with more than one.',
      'For age I use tener: tiene doce años.',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.casa',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u06-l05',
    title: 'Your home',
    instructions:
      'Describe your house or apartment: what rooms it has, what there is in them and where things are.',
    prompts: ['¿Qué hay en tu dormitorio?', '¿Dónde está la cama?'],
    requirements: [
      {
        id: 'there-is',
        label: 'You say what there is with hay (or no hay)',
        kind: 'pattern',
        patterns: [['hay']],
      },
      {
        id: 'location',
        label: 'You say where something is with está (está al lado de…)',
        kind: 'pattern',
        patterns: [['está|están', 'en|arriba|debajo|al|enfrente|detrás']],
      },
      ...common(3),
    ],
    model:
      'Vivo en un departamento. Hay un living, una cocina y dos dormitorios. En mi dormitorio hay una cama y una mesa. La mesa está al lado de la ventana.',
    checklist: [
      'I use hay to say what there is (hay una cama).',
      'I use está to say where something is (la mesa está…).',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.dia',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u08-l05',
    title: 'Your day',
    instructions:
      'Describe a normal day: what you do in the morning, in the afternoon and at night. Put the actions in order with primero and después.',
    prompts: ['¿Qué hacés a la mañana?', '¿Y a la noche?'],
    requirements: [
      {
        id: 'reflexive',
        label: 'You use a verb with me (me levanto, me acuesto)',
        kind: 'pattern',
        patterns: [['me', 'levanto|acuesto|ducho']],
      },
      {
        id: 'order',
        label: 'You put things in order with primero or después',
        kind: 'pattern',
        patterns: [['primero|después']],
      },
      ...common(4),
    ],
    model:
      'Todos los días me levanto a la mañana. Primero tomo un café con leche. Después trabajo. A la noche miro la tele y me acuesto.',
    checklist: [
      'I use yo + present tense verbs (trabajo, miro).',
      'I order my day with primero, después, a la mañana and a la noche.',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.gustos',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u11-l05',
    title: 'Your free time',
    instructions:
      'Say what you like and don’t like doing in your free time. Remember: me gusta el fútbol (with the article), me gustan los libros (plural).',
    prompts: ['¿Te gusta el fútbol?', '¿Qué hacés en tu tiempo libre?'],
    requirements: [
      {
        id: 'likes',
        label: 'You say what you like (me gusta, me encanta, prefiero…)',
        kind: 'pattern',
        patterns: [['me', 'gusta|gustan|encanta|encantan'], ['prefiero'], ['odio']],
      },
      {
        id: 'activity',
        label: 'You mention an activity (jugar al fútbol, leer, bailar, viajar…)',
        kind: 'pattern',
        patterns: [['jugar|juego|leer|bailar|viajar|cocinar|salir']],
      },
      ...common(3),
    ],
    model:
      'Me gusta mucho el fútbol. Los sábados juego con mis amigos. También me encanta la música. No me gusta para nada cocinar.',
    checklist: [
      'I use me gusta with one thing or a verb, and me gustan with plural things.',
      'I keep the article: me gusta el fútbol.',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.compras',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u12-l05',
    title: 'In a shop',
    instructions:
      'Write what you say to a shop assistant: say what you are looking for, ask the price and react.',
    prompts: ['¿Qué busca?', '¿Cuánto cuesta?'],
    requirements: [
      {
        id: 'looking',
        label: 'You say what you are looking for (busco…)',
        kind: 'pattern',
        patterns: [['busco']],
      },
      {
        id: 'question',
        label: 'You ask a question (¿cuánto cuesta?, ¿cuál…?, ¿por qué…?)',
        kind: 'pattern',
        patterns: [['cuánto|cuál|qué|por|cómo|quién']],
      },
      ...common(3),
    ],
    model:
      'Buenas tardes, señora. Busco una mochila azul. ¿Cuánto cuesta? ¡Es muy cara! ¿Hay una mochila barata?',
    checklist: [
      'I greet the shop assistant politely.',
      'I open and close my questions: ¿cuánto cuesta?',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.trabajo',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u13-l05',
    title: 'Your job',
    instructions:
      'Say what you do (job or studies), where, and when you start and finish. Add someone from your family.',
    prompts: ['¿A qué te dedicás?'],
    requirements: [
      {
        id: 'job',
        label: 'You say a job without an article (soy profesor, es médica…)',
        kind: 'pattern',
        patterns: [
          [
            'soy|es|somos|son',
            'médico|médica|enfermero|enfermera|mozo|moza|vendedor|vendedora|profesor|profesora|ingeniero|ingeniera|abogado|abogada|estudiante|estudiantes|médicos|profesores',
          ],
        ],
      },
      {
        id: 'place',
        label: 'You say where you work or study (trabajo en… / estudio en…)',
        kind: 'pattern',
        patterns: [['trabajo|estudio|trabaja|estudia', 'en']],
      },
      ...common(3),
    ],
    model:
      'Soy profesora y trabajo en una escuela. Empiezo a las ocho y termino a las dos. Mi hermano es médico. Él trabaja en un hospital.',
    checklist: [
      'I say my job without un or una: soy profesora.',
      'I use the feminine form when it applies: médica, ingeniera.',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.persona',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u14-l05',
    title: 'Describe someone',
    instructions:
      'Describe a friend or someone in your family: what they look like and what they are like. Say how they are today with estar.',
    prompts: ['¿Cómo es?'],
    requirements: [
      {
        id: 'ser',
        label: 'You describe with es + adjective (es alto, es simpática…)',
        kind: 'pattern',
        patterns: [['es', '<WORD>']],
      },
      {
        id: 'hair-eyes',
        label: 'You mention hair or eyes (tiene el pelo… / los ojos…)',
        kind: 'pattern',
        patterns: [
          ['el', 'pelo'],
          ['los', 'ojos'],
        ],
      },
      ...common(3),
    ],
    model:
      'Mi amigo Diego es alto y flaco. Tiene el pelo corto y los ojos verdes. Es muy simpático y divertido. Hoy está cansado.',
    checklist: [
      'I use ser for what someone is like and estar for how they are now.',
      'Adjectives agree: alto, alta, altos.',
    ],
  },
  {
    ...base,
    id: 'es.a1.wt.planes',
    kind: 'guided',
    codes: [],
    lesson: 'es-a1-u17-l05',
    title: 'Your plans',
    instructions:
      'Write about your plans for the weekend or the holidays: where you are going, with whom and how you will travel.',
    prompts: ['¿Qué vas a hacer este fin de semana?', '¿Vas a tomar el tren?'],
    requirements: [
      {
        id: 'ir-a',
        label: 'You use ir a + infinitive (voy a viajar, vamos a tomar…)',
        kind: 'pattern',
        patterns: [['voy|vas|va|vamos|van', 'a', INFINITIVOS]],
      },
      {
        id: 'transport',
        label: 'You mention a means of transport (en tren, en colectivo, a pie…)',
        kind: 'pattern',
        patterns: [['tren|colectivo|auto|avión|subte|bicicleta|pie']],
      },
      ...common(3),
    ],
    model:
      'Este fin de semana voy a visitar Rosario con mi familia. Vamos a tomar el tren. La semana que viene voy a viajar a la playa en auto.',
    checklist: [
      'I use ir (voy, vamos) + a + infinitive for plans.',
      'I use en with vehicles (en tren, en auto) but a pie.',
    ],
  },

  // ------------------------------------------------ A1, libre
  {
    ...base,
    id: 'es.a1.wt.libre-yo',
    kind: 'free',
    codes: [],
    lesson: 'es-a1-u17-final',
    block: 1,
    title: 'Free writing: about me',
    instructions:
      'Write freely about yourself: who you are, your family, your day, what you like and your plans. There is no right answer: compare your text with the model and go through the checklist.',
    prompts: ['¿Cómo te llamás?', '¿Qué te gusta?', '¿Qué vas a hacer este fin de semana?'],
    glossary: [{ term: 'Londres', meaning: 'London' }],
    requirements: [
      {
        id: 'likes',
        label: 'Tip: say something you like (me gusta…, me encanta…)',
        kind: 'pattern',
        patterns: [['me', 'gusta|gustan|encanta']],
        optional: true,
      },
      {
        id: 'plans',
        label: 'Tip: say what you are going to do (voy a + infinitive)',
        kind: 'pattern',
        patterns: [['voy|vamos', 'a', INFINITIVOS]],
        optional: true,
      },
      { id: 'words', label: 'Tip: about 40 words', kind: 'min_words', min: 40, optional: true },
    ],
    model:
      '¡Hola! Me llamo Ana y soy inglesa, de Londres. Ahora vivo en Córdoba. Soy estudiante y a la tarde trabajo en un negocio. Tengo dos hermanas. Me gusta mucho la música y me encanta bailar. Este fin de semana voy a visitar Mendoza con mis amigos. ¡Vamos a tomar el colectivo!',
    checklist: [
      'I introduce myself and talk about my family.',
      'I talk about what I like with me gusta / me encanta.',
      'I talk about a plan with voy a + infinitive.',
    ],
  },

  // ------------------------------------------------ A2, guiadas
  {
    ...a2,
    id: 'es.a2.wt.finde',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u01-l05',
    title: 'Your weekend',
    instructions:
      'Write about last weekend: what you did each day and who with. Use the simple past (comí, hice, fui…).',
    prompts: ['¿Qué hiciste el sábado?', '¿Y el domingo?'],
    requirements: [
      {
        id: 'past',
        label: 'You use the simple past (comí, hice, fui, vi…)',
        kind: 'pattern',
        patterns: [[PRETERITOS]],
      },
      {
        id: 'time',
        label: 'You say when (ayer, el sábado, anoche, el fin de semana pasado…)',
        kind: 'pattern',
        patterns: [['ayer|anoche|sábado|domingo|viernes|pasado']],
      },
      ...common(4),
    ],
    model:
      'El sábado a la mañana hice las compras y limpié la casa. A la noche fui al cine con Martín y vi una película muy divertida. El domingo dormí mucho y comí con mi familia. Todavía no terminé mi libro.',
    checklist: [
      'I use the simple past: hice, fui, vi, comí.',
      'In Argentina we say ya / todavía no with the simple past: todavía no terminé.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.viaje',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u02-l05',
    title: 'A trip',
    instructions:
      'Write about a trip you took: where you went, when you left and arrived, how long you stayed and when you came back.',
    prompts: ['¿Adónde fuiste?', '¿Cuánto tiempo te quedaste?'],
    requirements: [
      {
        id: 'past',
        label: 'You use the simple past (fui, llegué, me quedé, volví…)',
        kind: 'pattern',
        patterns: [[PRETERITOS]],
      },
      {
        id: 'ago',
        label: 'You say when it was (hace dos años, el año pasado, en julio…)',
        kind: 'pattern',
        patterns: [
          ['hace', '<WORD>'],
          ['pasado'],
          [
            'en',
            'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre',
          ],
        ],
      },
      ...common(4),
    ],
    model:
      'Hace dos años fui a Bariloche con mi hermana. Salimos de Buenos Aires en avión y llegué al hotel a la noche. Me quedé una semana. Volví en colectivo y llegué muy cansado.',
    checklist: [
      'I tell the events in the simple past.',
      'I use hace + time to say how long ago: hace dos años.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.reserva',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u03-l05',
    title: 'Book a hotel room',
    instructions:
      'Write to a hotel to book a room: for how many nights, what kind of room and one polite question. Use usted.',
    prompts: ['¿Para cuántas noches?'],
    requirements: [
      {
        id: 'polite',
        label: 'You ask politely (me gustaría, quisiera, ¿podría…?)',
        kind: 'pattern',
        patterns: [['gustaría|quisiera|podría']],
      },
      {
        id: 'book',
        label: 'You say what you want to book (reservar una habitación…)',
        kind: 'pattern',
        patterns: [['reservar']],
      },
      ...common(3),
    ],
    model:
      'Buenas tardes. Me gustaría reservar una habitación doble para tres noches. ¿El desayuno está incluido? ¿Hay una habitación en el piso cinco? Muchas gracias.',
    checklist: ['I use usted forms: ¿podría…?', 'I use me gustaría or quisiera to ask politely.'],
  },
  {
    ...a2,
    id: 'es.a2.wt.infancia',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u04-l05',
    title: 'When you were a kid',
    instructions:
      'Describe your life when you were a child: where you lived, what the place was like and what you used to do. Use the imperfect.',
    prompts: ['¿Dónde vivías de chico?', '¿Qué hacías generalmente?'],
    requirements: [
      {
        id: 'imperfect',
        label: 'You use the imperfect (era, tenía, vivía, jugaba, había…)',
        kind: 'pattern',
        patterns: [['era|tenía|vivía|jugaba|había|iba|veía|eran|teníamos|vivíamos|jugábamos']],
      },
      {
        id: 'habit',
        label: 'You mark habits (de chico, cuando era chico, generalmente, cada…)',
        kind: 'pattern',
        patterns: [['generalmente|cada|antes|siempre'], ['de', 'chico|chica'], ['cuando', 'era']],
      },
      ...common(4),
    ],
    model:
      'Cuando era chica, vivía en un pueblo en el campo. Había una escuela primaria muy chica. Generalmente jugaba con mis amigos en la calle. Cada verano íbamos a la playa con mis abuelos.',
    checklist: [
      'I describe the past and my habits with the imperfect.',
      'I use cuando era chico / de chica, generalmente and cada.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.hecho',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u05-l05',
    title: 'What happened?',
    instructions:
      'Tell something that happened to you: describe the scene with the imperfect and the events with the simple past. Use a connector like de repente.',
    prompts: ['¿Qué pasó?'],
    requirements: [
      {
        id: 'scene',
        label: 'You describe the scene with the imperfect (llovía, estaba…)',
        kind: 'pattern',
        patterns: [['llovía|estaba|había|era|tenía']],
      },
      {
        id: 'event',
        label: 'You tell the event in the simple past (alguien me robó…, perdí…)',
        kind: 'pattern',
        patterns: [[`${PRETERITOS}|robó|perdí|perdió|llamé`]],
      },
      {
        id: 'connector',
        label: 'You use a connector (de repente, mientras, entonces, por suerte…)',
        kind: 'pattern',
        patterns: [['mientras|entonces|lamentablemente'], ['de', 'repente'], ['por', 'suerte']],
      },
      ...common(4),
    ],
    model:
      'Ayer a la noche volvía a casa en colectivo. Llovía mucho. De repente, alguien me robó la billetera. Tuve mucho miedo. Entonces llamé a la policía. Por suerte, la policía llegó a tiempo.',
    checklist: [
      'The scene goes in the imperfect and the events in the simple past.',
      'I connect the story with de repente, entonces and por suerte.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.invitacion',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u06-l05',
    title: 'An invitation',
    instructions:
      'Write to a friend to invite them to a party: when it is, what there will be and where you will meet.',
    prompts: ['¿Querés venir el sábado?'],
    requirements: [
      {
        id: 'invite',
        label: 'You invite (¿querés venir…?, te invito a…)',
        kind: 'pattern',
        patterns: [['querés', 'venir'], ['invito'], ['invitar']],
      },
      {
        id: 'future',
        label: 'You talk about the plan (habrá, será, voy a…, vamos a…)',
        kind: 'pattern',
        patterns: [['habrá|será|haré|iré|vendré'], ['voy|vamos|va', 'a', '<WORD>']],
      },
      ...common(4),
    ],
    model:
      '¡Hola, Lucía! El sábado que viene hago una fiesta en mi casa. ¿Querés venir? Habrá música y mucha comida. Nos encontramos en la estación a las nueve. ¡Será muy divertido!',
    checklist: [
      'I invite with ¿querés venir…? (vos).',
      'I say what there will be with habrá and ir a + infinitive.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.pasantia',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u07-l05',
    title: 'Ask for an internship',
    instructions:
      'Write to a company to ask for an internship: introduce yourself, say what you study and for how long, and what you can do. Use usted.',
    prompts: ['¿Hace cuánto que estudia?'],
    requirements: [
      {
        id: 'modal',
        label: 'You use tener que, poder or hay que (tengo que, puedo…)',
        kind: 'pattern',
        patterns: [['tengo', 'que'], ['puedo|podría'], ['hay', 'que']],
      },
      {
        id: 'since',
        label: 'You say for how long or since when (desde hace…, desde…, durante…)',
        kind: 'pattern',
        patterns: [['desde|durante']],
      },
      ...common(4),
    ],
    model:
      'Buen día, señora. Me llamo Martín y estudio en la universidad desde hace tres años. Me gustaría hacer una pasantía en su empresa. Puedo trabajar a la tarde. Muchas gracias.',
    checklist: [
      'I use usted with a company: su empresa, le mando.',
      'I use desde hace + time for something that is still going on.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.salud',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u08-l05',
    title: 'You are sick',
    instructions:
      'Write to a coworker to say you can’t come to work: what hurts, how you feel and what you are going to do.',
    prompts: ['¿Cómo te sentís?'],
    requirements: [
      {
        id: 'pain',
        label: 'You say what hurts (me duele la cabeza, me duelen…)',
        kind: 'pattern',
        patterns: [['me', 'duele|duelen']],
      },
      {
        id: 'feel',
        label: 'You say how you feel (me siento…, estoy enfermo…)',
        kind: 'pattern',
        patterns: [
          ['me', 'siento'],
          ['estoy', 'enfermo|enferma|cansado|cansada'],
        ],
      },
      ...common(3),
    ],
    model:
      'Hola, Diego. Hoy no puedo ir a la oficina. Me duele mucho la cabeza y tengo fiebre. Me siento muy mal. Voy a tomar un remedio y voy a descansar.',
    checklist: [
      'I use me duele + singular and me duelen + plural, with el / la (not mi).',
      'Adjectives agree: enfermo, enferma.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.comparar',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u09-l05',
    title: 'Compare before you buy',
    instructions:
      'Write about shopping for clothes: compare two items (price, quality), say which one you choose and how you pay.',
    prompts: ['¿Cuál es más barata?'],
    requirements: [
      {
        id: 'compare',
        label: 'You compare (más… que, menos… que, mejor, peor, el más…)',
        kind: 'pattern',
        patterns: [
          ['más|menos', '<WORD>', 'que'],
          ['mejor|peor|mejores|peores'],
          ['el|la|los|las', 'más'],
        ],
      },
      {
        id: 'shop',
        label: 'You use a shopping word (el talle, probarse, con tarjeta, en efectivo…)',
        kind: 'pattern',
        patterns: [['talle|número|probador|tarjeta|efectivo|liquidación']],
      },
      ...common(3),
    ],
    model:
      'Busco una campera para el invierno. La campera negra es más cara que la campera azul, pero es mejor. ¡Me la llevo! Pago con tarjeta.',
    checklist: [
      'I compare with más / menos + adjective + que.',
      'I use mejor and peor, not más bueno or más malo.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.tecnologia',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u10-l05',
    title: 'A problem with technology',
    instructions:
      'Write to a friend: say what is wrong with your computer or phone and how you will get in touch. Use an object pronoun (lo, la, le, les).',
    prompts: ['¿Te anda la compu?'],
    requirements: [
      {
        id: 'pronoun',
        label: 'You use a pronoun before the verb (lo llamo, la veo, le escribo, se lo mando…)',
        kind: 'pattern',
        patterns: [['lo|la|los|las|le|les|se|te', '<WORD>']],
      },
      {
        id: 'tech',
        label: 'You mention technology (la computadora, el celular, la contraseña…)',
        kind: 'pattern',
        patterns: [['computadora|compu|celular|contraseña|mail|mensaje|app|pantalla']],
      },
      ...common(4),
    ],
    model:
      '¡Hola, Mateo! Mi computadora no anda. Te escribo desde el celular. No puedo bajar la app de la facultad. ¿Me mandás la contraseña por mensaje, por favor? Te llamo a la noche.',
    checklist: [
      'The pronoun goes before the conjugated verb: te llamo, lo mando.',
      'In Argentina we say no anda for “it doesn’t work”.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.pareja',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u11-l05',
    title: 'A couple',
    instructions:
      'Write how two people met (you and your partner, your parents, some friends) and what their relationship is like now. Use a negative word (nunca, nadie, nada, ya no).',
    prompts: ['¿Cómo se conocieron?'],
    requirements: [
      {
        id: 'reflexive',
        label: 'You use a reflexive verb (nos conocimos, se casaron, nos llevamos bien…)',
        kind: 'pattern',
        patterns: [
          [
            'nos|se|me',
            'conocimos|conocieron|casamos|casaron|llevamos|llevan|peleamos|pelean|desperté',
          ],
        ],
      },
      {
        id: 'negation',
        label: 'You use a negative word (nunca, nadie, nada, ya no…)',
        kind: 'pattern',
        patterns: [['nunca|nadie|nada'], ['ya', 'no']],
      },
      ...common(4),
    ],
    model:
      'Mis padres se conocieron en la facultad. Se casaron hace treinta años. Ahora viven juntos en Rosario y se llevan muy bien. Nunca se pelean. ¡Ya no trabajan!',
    checklist: [
      'I use se / nos with reflexive and reciprocal verbs.',
      'I use double negation correctly: no viene nadie / nadie viene.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.opinion',
    kind: 'guided',
    codes: [],
    lesson: 'es-a2-u12-l05',
    title: 'Your opinion',
    instructions:
      'Describe a problem in your city, at work or at home, give your opinion and suggest a solution.',
    prompts: ['¿Qué te parece?'],
    requirements: [
      {
        id: 'opinion',
        label: 'You give your opinion (creo que, me parece que, para mí…)',
        kind: 'pattern',
        patterns: [
          ['creo', 'que'],
          ['parece', 'que'],
          ['para', 'mí'],
        ],
      },
      {
        id: 'advice',
        label: 'You suggest a solution (deberías, podríamos, si…)',
        kind: 'pattern',
        patterns: [['deberías|podríamos|deberíamos|podrías'], ['si', '<WORD>']],
      },
      ...common(4),
    ],
    model:
      'Para mí, el problema de mi barrio son los autos. Creo que hay muchos autos en la calle. Sin embargo, hay una solución: podríamos ir en bicicleta. Si llueve, podemos tomar el colectivo.',
    checklist: [
      'I give my opinion with creo que, me parece que or para mí.',
      'I suggest with the conditional: podríamos, deberías.',
    ],
  },

  // ------------------------------------------------ A2, libres
  {
    ...a2,
    id: 'es.a2.wt.libre-finde',
    kind: 'free',
    codes: [],
    lesson: 'es-a2-u06-final',
    block: 1,
    title: 'Free writing: a special weekend',
    instructions:
      'Write about a weekend in the past (what you did, where you went) and a plan for the next one. There is no right answer: compare your text with the model and go through the checklist.',
    prompts: ['¿Qué hiciste el fin de semana pasado?', '¿Y el próximo?'],
    requirements: [
      {
        id: 'past',
        label: 'Tip: tell the past (fui, comí, vi…)',
        kind: 'pattern',
        patterns: [[PRETERITOS]],
        optional: true,
      },
      {
        id: 'plans',
        label: 'Tip: tell a plan (voy a…, habrá…, será…)',
        kind: 'pattern',
        patterns: [['voy|vamos', 'a', '<WORD>'], ['habrá|será|iré|haré']],
        optional: true,
      },
      { id: 'words', label: 'Tip: about 60 words', kind: 'min_words', min: 60, optional: true },
    ],
    model:
      'El fin de semana pasado fui al campo con mi familia. El sábado comimos un asado con mis abuelos y a la noche miré una película. Mi abuela cocina muy bien y siempre hay mucha comida. El domingo volvimos en tren. El próximo fin de semana es el cumpleaños de mi hermana. Vamos a hacer una fiesta en casa. Habrá mucha música y vamos a bailar. ¡Será muy divertido!',
    checklist: [
      'I tell the past with the simple past.',
      'I tell the plans with ir a + infinitive or the future.',
      'I use time words: el fin de semana pasado, el próximo fin de semana.',
    ],
  },
  {
    ...a2,
    id: 'es.a2.wt.libre-recuerdo',
    kind: 'free',
    codes: [],
    lesson: 'es-a2-u12-final',
    block: 1,
    title: 'Free writing: a day you won’t forget',
    instructions:
      'Write about a special day in your life: where you were, what it was like, what happened and what you think of that day now. There is no right answer: compare your text with the model and go through the checklist.',
    prompts: ['¿Dónde estabas?', '¿Qué pasó?', '¿Qué te parece hoy?'],
    requirements: [
      {
        id: 'scene',
        label: 'Tip: describe the scene with the imperfect (era, había, llovía…)',
        kind: 'pattern',
        patterns: [['era|había|llovía|estaba|tenía']],
        optional: true,
      },
      {
        id: 'opinion',
        label: 'Tip: give your opinion today (creo que, para mí…)',
        kind: 'pattern',
        patterns: [
          ['creo', 'que'],
          ['para', 'mí'],
        ],
        optional: true,
      },
      { id: 'words', label: 'Tip: about 70 words', kind: 'min_words', min: 70, optional: true },
    ],
    model:
      'Mi primer día en Buenos Aires fue hace cinco años. Era verano y había mucho sol. Llegué al aeropuerto a la mañana y estaba muy cansado. De repente, perdí mi billetera. ¡Tuve mucho miedo! Por suerte, estaba en mi valija. A la noche, comí con una familia muy simpática en su casa. Después escuché música con sus hijos. Para mí, fue el mejor día de mi viaje. Creo que fue un día muy lindo.',
    checklist: [
      'I describe the scene with the imperfect and tell the events with the simple past.',
      'I use connectors: de repente, por suerte.',
      'I end with my opinion today.',
    ],
  },
];

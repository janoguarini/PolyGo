import { A1_LISTENING_RATE, listeningQuestions, readingQuestions } from '../../context-builders';
import type { ContextLessonDef, PlannedUnitDef } from '../../types';

/**
 * Fase C.2 (docs/LEARNING_PHASE_C.md §C2): lecciones «En contexto» de U13 y U14 de inglés A1.
 *
 * U13 y U14 son unidades nuevas del mapa curricular (docs/polygo-ingles-a1-mapa-curricular.md §3)
 * que todavía no tienen sus lecciones escritas L1–L5. Para su L6 «En contexto» se cargan como
 * unidades planificadas: sin publicar, sin palabras y sin lecciones escritas, fuera de COURSES y de
 * CURRICULUM_PATH (no cambian la consolidación ni los ids publicados). El mapa las intercala después
 * de U3 y de U7: `after` dice hasta qué unidad se mide el vocabulario enseñado. Su posición en la
 * base (13 y 14) es provisional: el orden del mapa depende de separar el id de la unidad de su
 * posición (mapa §8, punto 3) y del desbloqueo (D2), que esta fase no cambia.
 *
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni de hablantes nativos. Se carga sin publicar.
 * `untaught` lista sobre todo lo que tienen que enseñar las L1–L5 de cada unidad. Desde la fase C.3
 * esas lecciones existen (unit13-*.ts, unit14-*.ts, content/planned.ts), también sin publicar y fuera
 * de COURSES; `untaught` se sigue midiendo hasta `after` (lo que queda sin enseñar por L1–L5 lo fija
 * content/__tests__/planned.test.ts).
 */

/** Las 5 lecciones escritas de cada unidad, más su consolidación, ocupan las posiciones 1–10. */
const RESERVED = 10;

export const EN_A1_PLANNED_UNITS: PlannedUnitDef[] = [
  {
    position: 13,
    after: 3,
    reservedPositions: RESERVED,
    title: 'Letras y datos personales',
    titleEn: 'Letters and personal details',
    description: 'El alfabeto, deletrear y dar datos personales en un formulario.',
    emoji: '🔤',
    objective: 'Puedes deletrear un nombre y entender un formulario con datos personales.',
    plannedLessons: [
      'U13 L1 El alfabeto (v02)',
      'U13 L2 Deletrear (v02)',
      'U13 L3 Nacionalidades (v02)',
      'U13 L4 Teléfono, email y dirección (v02, v03)',
      'U13 L5 Completar un formulario (p01)',
    ],
  },
  {
    position: 14,
    after: 7,
    reservedPositions: RESERVED,
    title: 'Precios y compras',
    titleEn: 'Prices and shopping',
    description: 'Los números hasta el 100, los precios y cómo pedir en una tienda.',
    emoji: '🛍️',
    objective: 'Puedes entender precios y lo que se pide en una tienda.',
    plannedLessons: [
      'U14 L1 Del 21 al 100 (v03)',
      'U14 L2 Precios y dinero (v03)',
      'U14 L3 How much, how many (g16, v03)',
      'U14 L4 Una taza de, una botella de (g23, v07)',
      'U14 L5 En la tienda (p10)',
    ],
  },
];

/** Persona ficticia de U13 (content/personas.ts): sus datos son los de la ficha del hotel. */
const GUEST = 'en.persona.sofia-ruiz';

export const EN_A1_PLANNED_CONTEXT_LESSONS: ContextLessonDef[] = [
  // ---------------------------------------------------------------------------------------- U13
  {
    unit: 13,
    status: 'draft',
    title: 'En contexto: registro en un hotel',
    objective: 'Entender una ficha de registro y las preguntas de un recepcionista.',
    intro: {
      explanation:
        'Vas a leer la ficha de registro de Sofia Ruiz, una huésped inventada, y a escuchar al recepcionista del hotel. En el audio la huésped eres tú: presta atención a qué te pregunta y qué te pide.',
      examples: [
        { target: 'What is your surname?', base: '¿Cuál es tu apellido?' },
        { target: 'How do you spell it?', base: '¿Cómo se escribe?' },
      ],
    },
    takeaways: [
      'Ahora puedes entender los datos de una ficha de hotel y lo que te pregunta un recepcionista.',
    ],
    curriculumLesson: 6,
    plannedBefore: EN_A1_PLANNED_UNITS[0]!.plannedLessons,
    curriculum: { primary: ['cL02', 'cR01'], secondary: ['p01'] },
    stimulusObjectives: {
      'en.stim.a1-u13-hotel-form': 'cR01',
      'en.stim.a1-u13-reception': 'cL02',
    },
    persona: GUEST,
    names: ['Sofia', 'Ruiz', 'Mark'],
    // Medido hasta U3 (el mapa pone U13 después de U3). Casi todo es de U13 L1–L5 (formulario,
    // nacionalidades, teléfono y email, deletrear); `do`, `what`, `room`, `hotel`, `key`, `phone` y
    // `number` se enseñan en unidades posteriores (U5–U12) o no están en el currículo.
    untaught: [
      'city',
      'do',
      'email',
      'first',
      'here',
      'hotel',
      'key',
      'mexican',
      'nationality',
      'number',
      'ok',
      'phone',
      'registration',
      'room',
      'spell',
      'surname',
      'what',
      'write',
    ],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u13-hotel-form',
          document: 'form',
          setting: 'La ficha que completa una huésped al llegar a un hotel.',
          title: 'Hotel registration',
          lines: [
            'First name: Sofia',
            'Surname: Ruiz',
            'Nationality: Mexican',
            'City: Puebla',
            'Country: Mexico',
            'Phone: 555-0142',
            'Email: sofia.ruiz@example.com',
            'Room: 12',
            'Nights: 3',
          ],
        },
        [
          {
            id: 'en.ex.v0nf78b4lmocz9',
            question: '¿Cuál es el apellido de la huésped?',
            answer: 'Ruiz',
            wrong: ['Sofia', 'Puebla'],
            concepts: ['en-name'],
            why: '«Surname» es el apellido: Ruiz. «First name» es el nombre de pila (Sofia) y «City», la ciudad (Puebla).',
          },
          {
            id: 'en.ex.bnjty0096ku4lp',
            question: '¿Qué indica el 12 de la ficha?',
            answer: 'El número de su habitación',
            wrong: ['Cuántas noches se queda', 'Su número de teléfono'],
            concepts: ['en-twelve'],
            why: 'Dice «Room: 12»: es la habitación. Las noches son 3 («Nights: 3»).',
          },
          {
            id: 'en.ex.1ke3ziwdl5v6wn',
            question: '¿De dónde viene Sofia?',
            answer: 'De Puebla, en México',
            wrong: ['De la habitación 12 del hotel', 'De una ciudad de España'],
            concepts: ['en-country', 'en-mexico'],
            why: '«City: Puebla» y «Country: Mexico» son su ciudad y su país. En el hotel sólo se queda tres noches.',
          },
        ],
      ).map((e) => ({ ...e, personalData: { persona: GUEST } })),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u13-reception',
          setting:
            'Eres Sofia Ruiz, la huésped de la ficha. Llegas al hotel y el recepcionista te habla a ti.',
          speakers: [{ name: 'Mark', voice: 'a' }],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Mark', text: 'Good evening, and welcome! My name is Mark.' },
            { speaker: 'Mark', text: 'What is your surname, please?' },
            { speaker: 'Mark', text: 'Thank you. How do you spell it?' },
            { speaker: 'Mark', text: 'And where are you from?' },
            { speaker: 'Mark', text: 'OK. Please write your phone number here.' },
            { speaker: 'Mark', text: 'Your room is number twelve. Here is your key.' },
          ],
        },
        [
          {
            id: 'en.ex.r79q5uqwoiv7nu',
            question: '¿Qué te pregunta primero Mark?',
            answer: 'Tu apellido',
            wrong: ['Tu nombre de pila', 'Tu número de habitación'],
            concepts: ['en-your', 'en-please'],
            why: '«What is your surname, please?»: «surname» es el apellido. Mark sólo dice su propio nombre.',
          },
          {
            id: 'en.ex.rzhqiwn55sau19',
            question: '¿Qué respuesta corresponde a su segunda pregunta?',
            answer: 'R-U-I-Z',
            wrong: ['S-O-F-I-A', 'M-E-X-I-C-O'],
            concepts: ['en-it', 'en-you'],
            why: '«How do you spell it?» viene después de pedirte el apellido: «it» es tu apellido, Ruiz, y te pide que lo deletrees.',
          },
          {
            id: 'en.ex.ylvadbqw81gu23',
            question: '¿Qué respuesta corresponde a su tercera pregunta?',
            answer: 'I am from Mexico.',
            wrong: ['I am Sofia Ruiz.', 'I am fine, thank you.'],
            concepts: ['en-where', 'en-from'],
            why: '«Where are you from?» pregunta de dónde eres: Sofia es de México.',
          },
          {
            id: 'en.ex.f4xt6m9qpxob7q',
            question: '¿Qué te pide Mark que hagas?',
            answer: 'Que escribas tu número de teléfono',
            wrong: ['Que escribas tu correo electrónico', 'Que deletrees tu nombre de pila'],
            concepts: ['en-please', 'en-your'],
            why: '«Please write your phone number here»: te pide el teléfono, no el correo.',
          },
        ],
      ).map((e) => ({ ...e, personalData: { persona: GUEST } })),
    ],
  },

  // ---------------------------------------------------------------------------------------- U14
  {
    unit: 14,
    status: 'draft',
    title: 'En contexto: cliente y vendedor',
    objective: 'Entender precios en un cartel, una compra en una tienda y un anuncio.',
    intro: {
      explanation:
        'Vas a leer los precios de una tienda, a escuchar a un cliente con la vendedora y un anuncio de un supermercado. Fíjate en qué se compra y cuánto cuesta.',
      examples: [
        { target: 'How much is this bag?', base: '¿Cuánto cuesta esta bolsa?' },
        { target: "I'd like a white cup, please.", base: 'Quisiera una taza blanca, por favor.' },
      ],
    },
    takeaways: ['Ahora puedes entender precios, qué pide un cliente y cuánto paga.'],
    curriculumLesson: 6,
    plannedBefore: EN_A1_PLANNED_UNITS[1]!.plannedLessons,
    curriculum: { primary: ['cL05', 'cL03', 'cR01'], secondary: ['p10'] },
    stimulusObjectives: {
      'en.stim.a1-u14-shop-prices': 'cR01',
      'en.stim.a1-u14-at-the-shop': 'cL05',
      'en.stim.a1-u14-supermarket-announcement': 'cL03',
    },
    names: ['Nina', 'Jack'],
    // Medido hasta U7 (el mapa pone U14 después de U7). `thirty`, `forty`, `dollars`, `prices`,
    // `much`, `of`, `bottles` e `i'd` son de U14 L1–L5; `can`, `help`, `like`, `today`,
    // `supermarket` y `here` se enseñan en U9–U12 o no están en el currículo.
    untaught: [
      'bottles',
      'can',
      'dollars',
      'forty',
      'help',
      'here',
      "i'd",
      'like',
      'much',
      'of',
      'ok',
      'prices',
      'supermarket',
      'thirty',
      'today',
    ],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u14-shop-prices',
          document: 'sign',
          setting: 'Un cartel con precios en la vidriera de una tienda.',
          title: 'Prices',
          lines: [
            'Big bags: $45',
            'Small bags: $30',
            'Red cups: $8',
            'White cups: $6',
            'Two white cups: $10',
          ],
        },
        [
          {
            id: 'en.ex.nmshzbes22rde7',
            question: '¿Cuánto cuesta una bolsa chica?',
            answer: '30 dólares',
            wrong: ['45 dólares', '8 dólares'],
            concepts: ['en-small', 'en-bag'],
            why: '«Small bags: $30». La grande cuesta 45 y 8 es el precio de una taza roja.',
          },
          {
            id: 'en.ex.gzzrzq21i18kmn',
            question: '¿Cuánto pagas por dos tazas blancas?',
            answer: '10 dólares',
            wrong: ['12 dólares', '16 dólares'],
            concepts: ['en-two', 'en-white', 'en-cup'],
            why: 'El cartel tiene una oferta: «Two white cups: $10». Sin la oferta serían 12 (dos de 6).',
          },
          {
            id: 'en.ex.8cm6u13rr55dtg',
            question: '¿Qué es lo más caro del cartel?',
            answer: 'Una bolsa grande',
            wrong: ['Una bolsa chica', 'Dos tazas blancas'],
            concepts: ['en-big', 'en-bag'],
            why: '«Big bags: $45» es el precio más alto del cartel.',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u14-at-the-shop',
          setting: 'Un cliente entra en la tienda del cartel.',
          speakers: [
            { name: 'Nina', voice: 'a' },
            { name: 'Jack', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Nina', text: 'Hello! Can I help you?' },
            { speaker: 'Jack', text: 'Yes, please. How much is this big bag?' },
            { speaker: 'Nina', text: 'It is forty-five dollars.' },
            { speaker: 'Jack', text: 'And the small black bag?' },
            { speaker: 'Nina', text: 'That is thirty dollars.' },
            { speaker: 'Jack', text: "OK. I'd like the small bag, please. And a white cup." },
            { speaker: 'Nina', text: 'That is thirty-six dollars, please.' },
            { speaker: 'Jack', text: 'Here you are. Thank you!' },
          ],
        },
        [
          {
            id: 'en.ex.sumamygj2tze5c',
            question: '¿Quién es Nina?',
            answer: 'La vendedora',
            wrong: ['Una clienta', 'Una amiga de Jack'],
            concepts: ['en-yes', 'en-please'],
            why: 'Nina pregunta «Can I help you?», dice los precios y cobra: es la vendedora. Jack es el cliente.',
          },
          {
            id: 'en.ex.qj84cmdzctv365',
            question: '¿Qué compra Jack al final?',
            answer: 'Una bolsa chica y una taza blanca',
            wrong: ['Una bolsa grande y una taza blanca', 'Una bolsa chica y dos tazas blancas'],
            concepts: ['en-small', 'en-bag', 'en-white', 'en-cup'],
            why: "Pregunta por la bolsa grande, pero dice «I'd like the small bag, please. And a white cup».",
          },
          {
            id: 'en.ex.v52w4zd7ico8sy',
            question: '¿Cuánto paga Jack?',
            answer: '36 dólares',
            wrong: ['30 dólares', '45 dólares'],
            concepts: ['en-six', 'en-cup'],
            why: 'Nina dice «thirty-six dollars»: 30 de la bolsa chica y 6 de la taza blanca.',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u14-supermarket-announcement',
          setting: 'Un anuncio por los parlantes de un supermercado.',
          speakers: [{ name: 'Anuncio', voice: 'a' }],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Anuncio', text: 'Good morning! Welcome to the supermarket.' },
            { speaker: 'Anuncio', text: 'Today, a big bag of coffee is twenty-five dollars.' },
            { speaker: 'Anuncio', text: 'Two bottles of milk are three dollars.' },
            { speaker: 'Anuncio', text: 'And the cheese is fifteen dollars.' },
            { speaker: 'Anuncio', text: 'Thank you!' },
          ],
        },
        [
          {
            id: 'en.ex.f95v0wtlwzl077',
            question: '¿Cuánto cuesta hoy una bolsa grande de café?',
            answer: '25 dólares',
            wrong: ['35 dólares', '15 dólares'],
            concepts: ['en-coffee', 'en-big'],
            why: '«A big bag of coffee is twenty-five dollars». 15 es el precio del queso.',
          },
          {
            id: 'en.ex.0oghles4rn3866',
            question: '¿Qué puedes comprar con 3 dólares?',
            answer: 'Dos botellas de leche',
            wrong: ['Una botella de leche', 'El queso'],
            concepts: ['en-two', 'en-milk', 'en-three'],
            why: '«Two bottles of milk are three dollars»: los 3 dólares son por dos botellas.',
          },
          {
            id: 'en.ex.kwbnr4xbthebww',
            question: '¿Qué cuesta 15 dólares?',
            answer: 'El queso',
            wrong: ['El café', 'La leche'],
            concepts: ['en-cheese', 'en-fifteen'],
            why: '«And the cheese is fifteen dollars».',
          },
        ],
      ),
    ],
  },
];

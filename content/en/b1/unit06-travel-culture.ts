import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U6 «Viajes y cultura» (docs/B1_EN.md): el primer condicional (if + presente, will) y unless;
 * problemas de viaje (demoras, cancelaciones, equipaje); recorrer una ciudad; dinero y propinas;
 * costumbres de otros países (polite, rude, tradition).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const AIRPORT = dialogue('en.stim.b1-u6-airport', 'En el aeropuerto, después de un anuncio.', [
  ['Emma', 'Did you hear that? Our flight is delayed.'],
  ['Tom', 'Again? How long?'],
  ['Emma', 'Two hours. If we wait here, we will miss the bus to the hotel.'],
  ['Tom', "Unless we take a taxi. I'll call the hotel and tell them we'll be late."],
]);

const TOUR = reading(
  'en.stim.b1-u6-tour',
  'schedule',
  'El programa de una visita guiada.',
  [
    'Free walking tour of the old city',
    '10:00 Meet the guide at the main square.',
    '10:30 Visit the cathedral and the local market.',
    '12:00 Lunch break (not included).',
    '13:00 Go sightseeing by boat. Tickets: 15 euros.',
    'If it rains, we will visit the history museum instead of the boat trip.',
  ],
  { title: 'Walking tour' },
);

const TIPS = reading(
  'en.stim.b1-u6-tips',
  'post',
  'Un viajero da consejos para visitar Japón.',
  [
    'Going to Japan? Here are my tips about money.',
    'Exchange some money before you go. Many small shops only take cash in the local currency.',
    'Do not leave a tip in restaurants. People there might not like it.',
  ],
  { from: 'Leo', title: 'Japan: my tips' },
);

const CUSTOMS = reading(
  'en.stim.b1-u6-customs',
  'post',
  'El mismo viajero explica algunas costumbres de Japón.',
  [
    'More tips about Japan!',
    'Take off your shoes when you go into a house. It is an old tradition.',
    'People are very polite, so always say thank you.',
    'It is rude to talk on the phone on the train.',
  ],
  { from: 'Leo', title: 'Japan: traditions' },
);

const HOTEL = dialogue('en.stim.b1-u6-hotel', 'Lucy llega a un hotel.', [
  ['Receptionist', 'Good evening. Do you have a reservation?'],
  ['Lucy', 'Yes, for three nights. The name is Lucy Grant.'],
  [
    'Receptionist',
    "Thank you. Your room isn't ready yet. If you wait ten minutes, it will be ready.",
  ],
  ['Lucy', 'No problem. Can I leave my luggage here?'],
  ['Receptionist', 'Of course.'],
]);

export const EN_B1_U06: B1UnitDef = {
  names: ['Emma', 'Tom', 'Japan', 'Leo', 'Lucy', 'Grant', 'Receptionist'],
  support: [
    'taxi',
    'tour',
    'main',
    'square',
    'cathedral',
    'market',
    'break',
    'included',
    'boat',
    'euros',
    'instead',
    'off',
    'into',
    'problem',
    'local',
    'miss',
    'hurry',
    'languages',
    'minutes',
    'spend',
    'yen',
  ],
  unit: {
    position: 6,
    title: 'Viajes y cultura',
    titleEn: 'Travel and culture',
    description:
      'El primer condicional (if, unless), problemas de viaje, recorrer una ciudad, dinero y propinas y las costumbres de otros países.',
    emoji: '🧳',
    objective:
      'Podés resolver problemas de viaje, decir qué vas a hacer si pasa algo y explicar costumbres de un lugar.',
    grammar: {
      title: 'Primer condicional',
      explanation:
        'If + presente, will + verbo: una condición posible y su resultado. If it rains, we will stay at the hotel. Unless es «a menos que» (= if not): We will miss the bus unless we take a taxi.',
      examples: [
        {
          target: 'If it rains, we will visit the museum.',
          base: 'Si llueve, vamos a visitar el museo.',
        },
        {
          target: 'If you wait ten minutes, the room will be ready.',
          base: 'Si espera diez minutos, la habitación va a estar lista.',
        },
        {
          target: "We'll be late unless we take a taxi.",
          base: 'Vamos a llegar tarde a menos que tomemos un taxi.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-if',
        'if',
        'si (condición)',
        '/ɪf/',
        undefined,
        'If you are tired, we can go home.',
        'Si estás cansado, podemos volver a casa.',
        ['conditionals', 'grammar'],
        ['si'],
      ),
      w(
        'en-unless',
        'unless',
        'a menos que / salvo que',
        '/ənˈlɛs/',
        undefined,
        'I will go unless it rains.',
        'Voy a ir a menos que llueva.',
        ['conditionals', 'grammar'],
        ['a menos que', 'salvo que'],
      ),
      w(
        'en-reservation',
        'reservation',
        'reserva',
        '/ˌrɛzərˈveɪʃən/',
        '🛎️',
        'We have a reservation for two nights.',
        'Tenemos una reserva por dos noches.',
        ['travel'],
      ),
      w(
        'en-delayed',
        'delayed',
        'demorado / retrasado',
        '/dɪˈleɪd/',
        '⏳',
        'Our train is delayed.',
        'Nuestro tren está demorado.',
        ['travel'],
        ['demorado', 'retrasado', 'atrasado'],
      ),
      w(
        'en-canceled',
        'canceled',
        'cancelado / cancelada',
        '/ˈkænsəld/',
        '🚫',
        'The flight was canceled.',
        'El vuelo fue cancelado.',
        ['travel'],
        ['cancelado', 'cancelada'],
        ['cancelled'],
      ),
      w(
        'en-luggage',
        'luggage',
        'equipaje',
        '/ˈlʌɡɪdʒ/',
        '🧳',
        'Can I leave my luggage here?',
        '¿Puedo dejar mi equipaje acá?',
        ['travel'],
      ),
      w(
        'en-on-time',
        'on time',
        'a horario / puntual',
        '/ɑn ˈtaɪm/',
        '🕒',
        'The bus arrived on time.',
        'El colectivo llegó a horario.',
        ['travel', 'time'],
        ['a tiempo', 'puntual'],
      ),
      w(
        'en-go-sightseeing',
        'go sightseeing',
        'hacer turismo / recorrer',
        '/ɡoʊ ˈsaɪtˌsiɪŋ/',
        '📸',
        'We went sightseeing all day.',
        'Recorrimos la ciudad todo el día.',
        ['travel'],
        ['hacer turismo', 'recorrer'],
      ),
      w(
        'en-guide',
        'guide',
        'guía',
        '/ɡaɪd/',
        '🧑‍🏫',
        'Our guide spoke three languages.',
        'Nuestro guía hablaba tres idiomas.',
        ['travel'],
      ),
      w(
        'en-souvenir',
        'souvenir',
        'recuerdo (de viaje)',
        '/ˌsuvəˈnɪr/',
        '🎁',
        'I bought a souvenir for my mother.',
        'Le compré un recuerdo a mi madre.',
        ['travel'],
        ['souvenir'],
      ),
      w(
        'en-currency',
        'currency',
        'moneda (de un país)',
        '/ˈkɜrənsi/',
        '💱',
        'What is the local currency?',
        '¿Cuál es la moneda local?',
        ['travel', 'money'],
        ['moneda', 'divisa'],
      ),
      w(
        'en-exchange',
        'exchange',
        'cambiar (dinero) / intercambio',
        '/ɪksˈtʃeɪndʒ/',
        undefined,
        'Where can I exchange money?',
        '¿Dónde puedo cambiar dinero?',
        ['travel', 'money'],
        ['cambiar', 'intercambio'],
      ),
      w(
        'en-tip',
        'tip',
        'propina / consejo',
        '/tɪp/',
        '💡',
        'Do people leave a tip here?',
        '¿Acá se deja propina?',
        ['travel', 'money'],
        ['propina', 'consejo'],
      ),
      w(
        'en-culture',
        'culture',
        'cultura',
        '/ˈkʌltʃər/',
        '🎭',
        'I love learning about other cultures.',
        'Me encanta aprender sobre otras culturas.',
        ['culture'],
      ),
      w(
        'en-tradition',
        'tradition',
        'tradición',
        '/trəˈdɪʃən/',
        '🏮',
        'It is an old tradition.',
        'Es una tradición antigua.',
        ['culture'],
      ),
      w(
        'en-polite',
        'polite',
        'educado / cortés',
        '/pəˈlaɪt/',
        '🙇',
        'It is polite to say thank you.',
        'Es de buena educación dar las gracias.',
        ['culture', 'adjectives'],
        ['educado', 'educada', 'cortés'],
      ),
      w(
        'en-rude',
        'rude',
        'maleducado / grosero',
        '/rud/',
        undefined,
        'It is rude to talk on the phone at dinner.',
        'Es de mala educación hablar por teléfono en la cena.',
        ['culture', 'adjectives'],
        ['maleducado', 'grosero', 'maleducada'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Si pasa esto…',
        objective: 'Decir qué va a pasar si se cumple una condición: if + presente, will.',
        intro: {
          explanation:
            'El primer condicional une una condición posible (if + presente) con su resultado (will + verbo): If it rains, we will stay at the hotel. El orden se puede invertir: We will stay at the hotel if it rains (sin coma).',
          examples: [
            {
              target: 'If it rains, we will stay at the hotel.',
              base: 'Si llueve, nos quedamos en el hotel.',
            },
            {
              target: "You will miss the train if you don't hurry.",
              base: 'Vas a perder el tren si no te apurás.',
            },
          ],
        },
        takeaways: [
          'Decís qué va a pasar si se cumple algo: If…, … will…',
          'Usás el presente después de if.',
        ],
        exercises: [
          ex.fillBlank(
            'If it ___, we will stay at the hotel.',
            'Si llueve, nos quedamos en el hotel.',
            'rains',
            ['will rain', 'rained', 'raining'],
            ['en-if', 'en-rain'],
            {
              id: 'en.ex.valpy6442ice83',
              explanation: 'Después de if va el presente, aunque hable del futuro.',
            },
          ),
          ex.fillBlank(
            'If you are tired, we ___ go home.',
            'Si estás cansado, volvemos a casa.',
            'will',
            ['would', 'did', 'were'],
            ['en-if', 'en-tired'],
            { id: 'en.ex.u0vjjmdniculjk' },
          ),
          ex.fillBlank(
            '___ you leave now, you will arrive on time.',
            'Si salís ahora, vas a llegar a horario.',
            'If',
            ['Until', 'Because', 'Before'],
            ['en-if', 'en-leave'],
            { id: 'en.ex.zi3fbvd5n7qrzy' },
          ),
          ex.translationChoice(
            'on time',
            'a horario / puntual',
            ['tarde (con retraso)', 'temprano', 'pronto'],
            ['en-on-time'],
            { id: 'en.ex.gbhwjfuoabhr1h' },
          ),
          ex.listenChoice(
            'If you are hungry, we can eat now.',
            [
              'If you are thirsty, we can eat now.',
              'If you are hungry, we can eat later.',
              'If you were hungry, we could eat now.',
            ],
            ['en-if', 'en-hungry'],
            { id: 'en.ex.4s2r7y6e33h3ip' },
          ),
          ex.orderWords(
            'We will go to the beach if it is sunny.',
            'Vamos a ir a la playa si hace sol.',
            ['en-if', 'en-beach', 'en-sunny'],
            { id: 'en.ex.ouo3wky5mixp5c' },
          ),
          ex.shortAnswer(
            'What will you do if it rains tomorrow? (ir al museo)',
            '¿Qué vas a hacer si llueve mañana?',
            'I will go to the museum.',
            [
              "I'll go to the museum.",
              'If it rains, I will go to the museum.',
              'Go to the museum.',
            ],
            ['en-if', 'en-museum'],
            { id: 'en.ex.4o20arak4v8nx6' },
          ),
          ex.translateWrite(
            'Si llueve, nos quedamos en casa.',
            'If it rains, we will stay at home.',
            ['en-if', 'en-rain', 'en-stay'],
            {
              id: 'en.ex.wplqhu81vfim92',
              acceptedAnswers: [
                "If it rains, we'll stay at home.",
                'If it rains, we will stay home.',
                "If it rains, we'll stay home.",
                'We will stay at home if it rains.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Problemas de viaje',
        objective: 'Resolver demoras y cancelaciones; usar unless.',
        intro: {
          explanation:
            "Delayed (demorado) y canceled (cancelado) son las malas noticias de un viaje. Unless es «a menos que» y equivale a if… not: We will miss the bus unless we take a taxi = if we don't take a taxi.",
          examples: [
            { target: 'Our flight is delayed.', base: 'Nuestro vuelo está demorado.' },
            {
              target: "We'll miss the bus unless we take a taxi.",
              base: 'Vamos a perder el colectivo a menos que tomemos un taxi.',
            },
          ],
        },
        takeaways: [
          'Entendés y contás demoras y cancelaciones.',
          'Usás unless para decir «a menos que».',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['delayed', 'demorado / retrasado'],
              ['canceled', 'cancelado / cancelada'],
              ['luggage', 'equipaje'],
              ['unless', 'a menos que / salvo que'],
            ],
            ['en-delayed', 'en-canceled', 'en-luggage', 'en-unless'],
            { id: 'en.ex.9jxvcwhqt8c46c' },
          ),
          ex.fillBlank(
            'The flight was ___ because of the storm.',
            'El vuelo se canceló por la tormenta.',
            'canceled',
            ['on time', 'cheap', 'free'],
            ['en-canceled', 'en-flight', 'en-storm'],
            { id: 'en.ex.4ywn7cn1iwobm3', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "I'll go to the beach ___ it rains.",
            'Voy a ir a la playa a menos que llueva.',
            'unless',
            ['if', 'when', 'because'],
            ['en-unless', 'en-beach'],
            {
              id: 'en.ex.74vddo1vph5ype',
              explanation: 'Unless = if not: voy salvo que llueva.',
            },
          ),
          question(
            'en.ex.daex0zhile5ivq',
            AIRPORT,
            '¿Qué problema tienen Emma y Tom?',
            'El vuelo está demorado dos horas',
            ['El vuelo se canceló', 'Perdieron el equipaje', 'El hotel está lleno'],
            ['en-delayed', 'en-flight'],
            'Emma dice: «Our flight is delayed… Two hours».',
          ),
          question(
            'en.ex.ig04qyr9eqbtzj',
            AIRPORT,
            '¿Qué propone Tom?',
            'Tomar un taxi y avisar al hotel',
            ['Esperar el colectivo', 'Volver a casa', 'Cambiar de vuelo'],
            ['en-unless'],
            "Tom dice: «Unless we take a taxi. I'll call the hotel and tell them we'll be late».",
          ),
          ex.listenChoice(
            'Our train is delayed.',
            ['Our train is canceled.', 'Our train was delayed.', 'Our plane is delayed.'],
            ['en-delayed', 'en-train'],
            { id: 'en.ex.zmyfpvmih9cnyr' },
          ),
          ex.orderWords(
            'Can I leave my luggage here?',
            '¿Puedo dejar mi equipaje acá?',
            ['en-luggage', 'en-leave'],
            { id: 'en.ex.i91c441bue95lj' },
          ),
          ex.translateWrite(
            'El vuelo fue cancelado.',
            'The flight was canceled.',
            ['en-canceled', 'en-flight'],
            {
              id: 'en.ex.ssurqzw8u7ewp8',
              acceptedAnswers: [
                'The flight was cancelled.',
                'The flight has been canceled.',
                'The flight has been cancelled.',
              ],
            },
          ),
          ex.translateWrite(
            'Vamos a llegar tarde a menos que tomemos un taxi.',
            'We will be late unless we take a taxi.',
            ['en-unless', 'en-late'],
            {
              id: 'en.ex.aofbc30mhazu3u',
              acceptedAnswers: [
                "We'll be late unless we take a taxi.",
                'We will arrive late unless we take a taxi.',
                "We'll arrive late unless we take a taxi.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Recorrer la ciudad',
        objective: 'Organizar un día de turismo: reservas, visitas guiadas y recuerdos.',
        intro: {
          explanation:
            'Go sightseeing es salir a recorrer y conocer lugares. Una visita guiada tiene un guide (guía). Reservation es una reserva (de hotel, de mesa). Souvenir es un recuerdo que comprás en el viaje.',
          examples: [
            { target: 'We went sightseeing all day.', base: 'Recorrimos la ciudad todo el día.' },
            {
              target: 'I bought a souvenir for my mother.',
              base: 'Le compré un recuerdo a mi madre.',
            },
          ],
        },
        takeaways: ['Organizás un día de turismo.', 'Entendés el programa de una visita guiada.'],
        exercises: [
          ex.translationChoice(
            'reservation',
            'reserva',
            ['equipaje', 'guía', 'propina / consejo'],
            ['en-reservation'],
            { id: 'en.ex.05t680zyl6hn3f' },
          ),
          ex.imageChoice('🎁', 'souvenir', ['luggage', 'guide', 'reservation'], ['en-souvenir'], {
            id: 'en.ex.3a1eiavh00p5k8',
          }),
          ex.fillBlank(
            'Tomorrow we are going to go ___ in the old city.',
            'Mañana vamos a recorrer la ciudad vieja.',
            'sightseeing',
            ['shopping', 'swimming', 'sleeping'],
            ['en-go-sightseeing'],
            { id: 'en.ex.ds1wqzwjjrqt5v', skill: 'vocabulary' },
          ),
          question(
            'en.ex.19suu1psju6gth',
            TOUR,
            '¿Dónde empieza la visita?',
            'En la plaza principal, con el guía',
            ['En la catedral', 'En el mercado', 'En el museo'],
            ['en-guide'],
            'El programa dice: «10:00 Meet the guide at the main square».',
          ),
          question(
            'en.ex.ej42zo07aqte67',
            TOUR,
            '¿Qué pasa si llueve?',
            'Visitan el museo de historia en vez del paseo en barco',
            ['Se cancela la visita', 'Almuerzan antes', 'Van al mercado'],
            ['en-if', 'en-museum'],
            'El programa dice: «If it rains, we will visit the history museum instead of the boat trip».',
          ),
          ex.listenChoice(
            'Our guide spoke three languages.',
            [
              'Our guide spoke two languages.',
              'Our guide speaks three languages.',
              'Our teacher spoke three languages.',
            ],
            ['en-guide', 'en-speak'],
            { id: 'en.ex.dbza57drjvadjh' },
          ),
          ex.orderWords(
            'We have a reservation for two nights.',
            'Tenemos una reserva por dos noches.',
            ['en-reservation'],
            { id: 'en.ex.h8w71y3jx7riw5' },
          ),
          ex.shortAnswer(
            'Do you have a reservation? (sí, por tres noches)',
            '¿Tiene una reserva?',
            'Yes, for three nights.',
            [
              'Yes, I have a reservation for three nights.',
              'Yes, I do. For three nights.',
              'Yes, I have.',
            ],
            ['en-reservation'],
            { id: 'en.ex.srt7xzncsw8kdl' },
          ),
          ex.translateWrite(
            'Le compré un recuerdo a mi hermana.',
            'I bought a souvenir for my sister.',
            ['en-souvenir', 'en-bought', 'en-sister'],
            {
              id: 'en.ex.2vx5g6r0bxkw5s',
              acceptedAnswers: ['I bought my sister a souvenir.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Dinero y propinas',
        objective: 'Cambiar dinero, preguntar por la moneda local y por las propinas.',
        intro: {
          explanation:
            'Currency es la moneda de un país; exchange money es cambiar dinero. Tip es propina (y también «consejo»: travel tips). Local es «del lugar»: the local currency, a local restaurant.',
          examples: [
            { target: 'Where can I exchange money?', base: '¿Dónde puedo cambiar dinero?' },
            { target: 'Do people leave a tip here?', base: '¿Acá se deja propina?' },
          ],
        },
        takeaways: [
          'Preguntás por la moneda local y dónde cambiar dinero.',
          'Preguntás si se deja propina.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['currency', 'moneda (de un país)'],
              ['exchange', 'cambiar (dinero) / intercambio'],
              ['tip', 'propina / consejo'],
              ['guide', 'guía'],
            ],
            ['en-currency', 'en-exchange', 'en-tip', 'en-guide'],
            { id: 'en.ex.cije4zzutaarp9' },
          ),
          ex.fillBlank(
            'Where can I ___ money?',
            '¿Dónde puedo cambiar dinero?',
            'exchange',
            ['earn', 'save', 'spend'],
            ['en-exchange', 'en-money'],
            { id: 'en.ex.bcwwaf6afkqhde', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'What is the local ___ in Japan? The yen.',
            '¿Cuál es la moneda local en Japón? El yen.',
            'currency',
            ['luggage', 'reservation', 'souvenir'],
            ['en-currency'],
            { id: 'en.ex.943tlklpzi5ite', skill: 'vocabulary' },
          ),
          question(
            'en.ex.w0n1cle2r8i1qy',
            TIPS,
            '¿Por qué conviene cambiar dinero antes de viajar a Japón?',
            'Muchos negocios chicos sólo aceptan efectivo',
            ['Es más barato', 'No hay bancos', 'Las tarjetas no sirven en hoteles'],
            ['en-exchange', 'en-currency'],
            'Leo escribe: «Many small shops only take cash in the local currency».',
          ),
          question(
            'en.ex.p017b0vvimoawn',
            TIPS,
            '¿Qué dice Leo sobre las propinas?',
            'Que no hay que dejarlas: a la gente no le gusta',
            [
              'Que siempre hay que dejar propina',
              'Que se deja el diez por ciento',
              'Que sólo se dejan en hoteles',
            ],
            ['en-tip'],
            'Leo escribe: «Do not leave a tip in restaurants. People there might not like it».',
          ),
          ex.listenChoice(
            'Do people leave a tip here?',
            [
              'Do people leave a bag here?',
              'Did people leave a tip here?',
              'Do people give a tip here?',
            ],
            ['en-tip', 'en-leave'],
            { id: 'en.ex.60donlaje7mlj1' },
          ),
          ex.orderWords(
            'We ate at a local restaurant.',
            'Comimos en un restaurante del lugar.',
            ['en-restaurant', 'en-ate'],
            { id: 'en.ex.bjrtoeiq2ofnq5' },
          ),
          ex.translateWrite(
            '¿Dónde puedo cambiar dinero?',
            'Where can I exchange money?',
            ['en-exchange', 'en-money'],
            {
              id: 'en.ex.wcay8ntqfdwt1v',
              acceptedAnswers: ['Where can I change money?'],
            },
          ),
          ex.translateWrite(
            '¿Cuál es la moneda local?',
            'What is the local currency?',
            ['en-currency'],
            {
              id: 'en.ex.1lub120pljy8fg',
              acceptedAnswers: ["What's the local currency?"],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Otras costumbres',
        objective: 'Explicar costumbres de un lugar: qué es de buena o mala educación.',
        intro: {
          explanation:
            'Para explicar costumbres: It is polite to… (es de buena educación…), It is rude to… (es de mala educación…). Tradition es una tradición; culture, una cultura. Con el primer condicional das un consejo: If you go into a house, take off your shoes.',
          examples: [
            {
              target: 'It is polite to say thank you.',
              base: 'Es de buena educación dar las gracias.',
            },
            {
              target: 'It is rude to talk on the phone at dinner.',
              base: 'Es de mala educación hablar por teléfono en la cena.',
            },
          ],
        },
        takeaways: [
          'Explicás qué es de buena y de mala educación en un lugar.',
          'Das consejos de viaje con if.',
        ],
        exercises: [
          ex.translationChoice(
            'rude',
            'maleducado / grosero',
            ['educado / cortés', 'tímido / tímida', 'amable'],
            ['en-rude'],
            { id: 'en.ex.wp2t3vbjutj2jk' },
          ),
          question(
            'en.ex.8djxxo2h5xdqz7',
            CUSTOMS,
            '¿Qué hay que hacer al entrar a una casa en Japón?',
            'Sacarse los zapatos',
            ['Dar las gracias', 'Llevar un regalo', 'Dejar propina'],
            ['en-tradition'],
            'Leo escribe: «Take off your shoes when you go into a house. It is an old tradition».',
          ),
          question(
            'en.ex.50ctwt7z8ufyl5',
            HOTEL,
            '¿Por qué Lucy tiene que esperar?',
            'Su habitación todavía no está lista',
            ['No tiene reserva', 'Perdió el equipaje', 'El hotel está lleno'],
            ['en-if', 'en-reservation'],
            "El recepcionista dice: «Your room isn't ready yet. If you wait ten minutes, it will be ready».",
          ),
          ex.fillBlank(
            'It is ___ to say thank you.',
            'Es de buena educación dar las gracias.',
            'polite',
            ['rude', 'delayed', 'local'],
            ['en-polite'],
            { id: 'en.ex.6ycftjsd6usbnz', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Eating together on Sundays is a family ___.',
            'Comer juntos los domingos es una tradición familiar.',
            'tradition',
            ['currency', 'reservation', 'luggage'],
            ['en-tradition', 'en-family'],
            { id: 'en.ex.4vmnhe76z83fg7', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'I love learning about other cultures.',
            [
              'I love learning about other countries.',
              'I love reading about other cultures.',
              'I like learning about other cultures.',
            ],
            ['en-culture', 'en-learn'],
            { id: 'en.ex.qi3i63uet4hwpj' },
          ),
          ex.orderWords(
            'It is rude to talk on the phone at dinner.',
            'Es de mala educación hablar por teléfono en la cena.',
            ['en-rude', 'en-phone', 'en-dinner'],
            { id: 'en.ex.y83n6q615eztza' },
          ),
          ex.shortAnswer(
            'Is it polite to leave a tip in your country? (sí)',
            '¿En tu país es de buena educación dejar propina?',
            'Yes, it is.',
            ['Yes, it is polite.', 'Yes.', 'Yes, it is polite to leave a tip.'],
            ['en-polite', 'en-tip'],
            { id: 'en.ex.4giorhmyn0j9jt' },
          ),
          ex.translateWrite(
            'Es una tradición antigua.',
            'It is an old tradition.',
            ['en-tradition'],
            {
              id: 'en.ex.0b3yviy5grljd8',
              acceptedAnswers: ["It's an old tradition."],
            },
          ),
        ],
      },
    ],
  },
};

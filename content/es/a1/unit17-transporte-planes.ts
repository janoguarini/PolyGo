import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U17 «Transport and plans» (docs/ES_A1_A2.md), en español neutro de Latinoamérica (tú y
 * ustedes): medios de transporte con en (en autobús, en metro, en tren, en carro) y a pie; tomar el
 * autobús / el metro (en Latinoamérica, tomar y nunca «coger»). Ir a + infinitivo para los planes (voy
 * a viajar, vas a visitar, vamos a tomar). Esta noche, este fin de semana, la semana que viene.
 * Quedarse (me quedo, te quedas, se queda). Variantes que se aceptan: colectivo y camión (autobús),
 * subte (metro), auto y coche (carro), boleto y billete (pasaje). Pronunciación: la b y la v suenan
 * igual (viaje, bici, vacaciones).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PLANES = dialogue(
  'es.stim.a1-u17-planes',
  'On Friday in Mexico City, Diego and Valentina talk about their plans for the weekend.',
  [
    ['Diego', 'Valentina, ¿qué vas a hacer este fin de semana?'],
    ['Valentina', 'Voy a visitar a mis abuelos en Querétaro.'],
    ['Diego', '¿Vas en carro?'],
    ['Valentina', 'No, voy a tomar el autobús. ¿Y tú?'],
    ['Diego', 'Yo me quedo en casa. Esta noche voy al cine.'],
  ],
  ES_A1_RATE,
);

const MENSAJE = reading(
  'es.stim.a1-u17-mensaje',
  'message',
  'Mateo sends a message to his friend Lucía about his holidays.',
  [
    '¡Hola, Lucía!',
    'La semana que viene voy de vacaciones.',
    'Voy a viajar a Cusco en avión.',
    'Ya tengo el pasaje.',
    'Me quedo una semana en la montaña.',
    '¿Y tú? ¿Qué vas a hacer?',
    'Mateo',
  ],
  { from: 'Mateo', to: 'Lucía' },
);

export const ES_A1_U17: EsUnitDef = {
  names: [
    'Diego',
    'Valentina',
    'Mateo',
    'Lucía',
    'Querétaro',
    'Monterrey',
    'Lima',
    'Cusco',
    'Ciudad de México',
  ],
  support: ['tomamos', 'quedo', 'quedas', 'queda', 'hacer', 'ya'],
  unit: {
    position: 17,
    title: 'Transport and plans',
    titleEn: 'Transporte y planes',
    description:
      'Say how you get around (en autobús, en metro, a pie) with tomar, and talk about plans with ir a + infinitive and quedarse.',
    emoji: '🚌',
    objective:
      'You can say how you travel, talk about your plans for tonight, the weekend or next week with voy a + verb, and say where you are staying.',
    grammar: {
      title: 'Ir a + infinitive · en autobús',
      explanation:
        'To say how you travel: en + vehicle, with no article (en autobús, en metro, en tren, en carro, en avión, en bicicleta), but a pie (on foot). With transport, Latin Americans use tomar: tomo el autobús, ¿tomas el metro? (in Spain people say coger, but in much of Latin America that verb is vulgar, so stick to tomar). For plans, use ir a + infinitive, like English “going to”: voy a viajar, vas a visitar, vamos a tomar el tren. Only ir changes (yo voy, tú vas, él / ella / usted va, nosotros vamos, ellos / ustedes van); the second verb stays as it is. Quedarse (to stay) comes with me, te, se: me quedo, te quedas, se queda. Transport words change from country to country: you will also hear el camión (bus, Mexico), el colectivo (bus, Argentina), el subte (the Buenos Aires subway), el auto (car, Chile and Argentina), el coche (car, Spain) and el boleto or el billete (ticket). B and v sound exactly the same: viaje, bici.',
      examples: [
        { target: 'Voy a viajar en avión.', base: 'I’m going to travel by plane.' },
        {
          target: 'Este fin de semana vamos a visitar Lima.',
          base: 'This weekend we’re going to visit Lima.',
        },
        { target: 'Esta noche me quedo en casa.', base: 'Tonight I’m staying home.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U17), convertido al español neutro de Latinoamérica con tú (2026-11-21). Sin revisión nativa: revisar la advertencia sobre «coger» (dicha en inglés y sin ejemplos), «el carro» como palabra enseñada (México, Colombia, Centroamérica; se aceptan auto y coche), «el pasaje» (Sudamérica; en México «el boleto», en España «el billete»: se aceptan), «ir de vacaciones» y «visitar a» con personas frente a «visitar» + lugar. Se aceptan «la bici», «el colectivo», «el camión» y «el subte».',
    },
    words: [
      w(
        'es-el-autobus',
        'el autobús',
        'the bus',
        'Tomo el autobús todos los días.',
        'I take the bus every day.',
        ['transport'],
        {
          acceptedTranslations: ['bus'],
          acceptedTexts: ['el bus', 'el camión', 'el colectivo'],
          emoji: '🚌',
        },
      ),
      w(
        'es-el-tren',
        'el tren',
        'the train',
        'Vamos a Cusco en tren.',
        'We go to Cusco by train.',
        ['transport'],
        { acceptedTranslations: ['train'], emoji: '🚆' },
      ),
      w(
        'es-el-carro',
        'el carro',
        'the car',
        'Mi papá tiene un carro rojo.',
        'My dad has a red car.',
        ['transport'],
        { acceptedTranslations: ['car'], acceptedTexts: ['el auto', 'el coche'], emoji: '🚗' },
      ),
      w(
        'es-el-avion',
        'el avión',
        'the plane',
        'Voy a Lima en avión.',
        'I go to Lima by plane.',
        ['transport'],
        { acceptedTranslations: ['the airplane', 'plane'], emoji: '✈️' },
      ),
      w(
        'es-el-metro',
        'el metro',
        'the subway',
        'En la Ciudad de México tomo el metro.',
        'In Mexico City I take the subway.',
        ['transport'],
        {
          acceptedTranslations: ['the underground', 'the metro'],
          acceptedTexts: ['el subte'],
          emoji: '🚇',
        },
      ),
      w(
        'es-la-bicicleta',
        'la bicicleta',
        'the bicycle',
        'Voy a la facultad en bicicleta.',
        'I go to college by bicycle.',
        ['transport'],
        { acceptedTranslations: ['the bike'], acceptedTexts: ['la bici'], emoji: '🚲' },
      ),
      w('es-a-pie', 'a pie', 'on foot', 'Voy al trabajo a pie.', 'I walk to work.', ['transport'], {
        acceptedTranslations: ['walking'],
        emoji: '🚶',
      }),
      w(
        'es-tomar',
        'tomar',
        'to take',
        '¿Vas a tomar el tren?',
        'Are you going to take the train?',
        ['verbs', 'transport'],
        { acceptedTranslations: ['to catch'] },
      ),
      w(
        'es-el-pasaje',
        'el pasaje',
        'the ticket',
        '¿Cuánto cuesta el pasaje?',
        'How much is the ticket?',
        ['transport', 'travel'],
        {
          acceptedTranslations: ['ticket'],
          acceptedTexts: ['el boleto', 'el billete'],
          emoji: '🎫',
        },
      ),
      w(
        'es-quedarse',
        'quedarse',
        'to stay',
        'Esta noche me quedo en casa.',
        'Tonight I’m staying home.',
        ['verbs'],
      ),
      w(
        'es-visitar',
        'visitar',
        'to visit',
        'Voy a visitar a mi abuela.',
        'I’m going to visit my grandmother.',
        ['verbs', 'travel'],
      ),
      w(
        'es-esta-noche',
        'esta noche',
        'tonight',
        'Esta noche vamos al cine.',
        'Tonight we’re going to the cinema.',
        ['time'],
      ),
      w(
        'es-este-fin-de-semana',
        'este fin de semana',
        'this weekend',
        'Este fin de semana voy a viajar.',
        'This weekend I’m going to travel.',
        ['time'],
      ),
      w(
        'es-la-semana-que-viene',
        'la semana que viene',
        'next week',
        'La semana que viene voy a Monterrey.',
        'Next week I’m going to Monterrey.',
        ['time'],
      ),
      w(
        'es-el-viaje',
        'el viaje',
        'the trip',
        'El viaje en tren es muy largo.',
        'The train trip is very long.',
        ['travel'],
        { acceptedTranslations: ['the journey', 'trip'] },
      ),
      w(
        'es-las-vacaciones',
        'las vacaciones',
        'the holidays',
        'En las vacaciones vamos a la playa.',
        'On holiday we go to the beach.',
        ['travel'],
        { acceptedTranslations: ['vacation', 'the vacation', 'holidays'], emoji: '🏝️' },
      ),
      w(
        'es-voy-a',
        'voy a',
        "I'm going to",
        'Mañana voy a viajar.',
        'Tomorrow I’m going to travel.',
        ['future'],
        { acceptedTranslations: ['I am going to'] },
      ),
      w('es-ahora', 'ahora', 'now', 'Ahora estoy en el autobús.', 'I’m on the bus now.', ['time'], {
        acceptedTranslations: ['right now'],
      }),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'En autobús, en metro',
        objective: 'Say how you get around: by bus, train, car, bike or on foot.',
        intro: {
          explanation:
            'To say how you travel, use en + vehicle with no article: en autobús (by bus), en metro (by subway), en tren, en carro, en bicicleta (or en bici). The exception is a pie (on foot). Some of these words change from country to country: in Mexico the city bus is also el camión, in Argentina el colectivo; for car you will also hear el auto (Chile, Argentina) and el coche (Spain). B and v sound exactly the same: bicicleta, voy, autobús.',
          examples: [
            { target: 'Voy a la facultad en autobús.', base: 'I go to college by bus.' },
            { target: 'Mi hermana va al trabajo a pie.', base: 'My sister walks to work.' },
          ],
        },
        takeaways: [
          'You say how you travel with en + vehicle: en autobús, en metro.',
          'You say on foot with a pie.',
        ],
        exercises: [
          ex.translationChoice(
            'el autobús',
            'the bus',
            ['the train', 'the car', 'the subway'],
            ['es-el-autobus'],
            { id: 'es.ex.0paaxvfwuu6mx6' },
          ),
          ex.matchPairs(
            [
              ['el tren', 'the train'],
              ['el carro', 'the car'],
              ['el metro', 'the subway'],
              ['la bicicleta', 'the bicycle'],
            ],
            ['es-el-tren', 'es-el-carro', 'es-el-metro', 'es-la-bicicleta'],
            { id: 'es.ex.n7wgd9znxbk62u' },
          ),
          ex.fillBlank(
            'Voy al trabajo ___ metro.',
            'I go to work by subway.',
            'en',
            ['a', 'de', 'con'],
            ['es-el-metro'],
            {
              id: 'es.ex.qs03e5ddqyf26y',
              explanation: 'By + vehicle = en, with no article: en metro, en autobús, en tren.',
            },
          ),
          ex.listenChoice(
            'Voy en tren.',
            ['Voy en carro.', 'Vamos en tren.', 'Voy a pie.'],
            ['es-el-tren', 'es-a-pie', 'es-el-carro'],
            { id: 'es.ex.edkrcpki7xvx3e' },
          ),
          ex.fillBlank(
            'No voy en carro. Voy a ___.',
            'I don’t go by car. I go on foot.',
            'pie',
            ['tren', 'metro', 'bicicleta'],
            ['es-a-pie', 'es-el-carro'],
            {
              id: 'es.ex.sg9jrlh4h0bl5p',
              explanation: 'On foot is a pie. With a vehicle you use en: en tren, en metro.',
            },
          ),
          ex.translationChoice('a pie', 'on foot', ['by car', 'by bus', 'by train'], ['es-a-pie'], {
            id: 'es.ex.rcjscalcldzxts',
          }),
          ex.orderWords(
            'Mi papá va al trabajo en bicicleta.',
            'My dad goes to work by bicycle.',
            ['es-la-bicicleta'],
            { id: 'es.ex.dfgia08lt4pqi4' },
          ),
          ex.listenChoice(
            'Vamos en autobús.',
            ['Vamos en metro.', 'Van en autobús.', 'Vamos a pie.'],
            ['es-el-autobus', 'es-el-metro'],
            { id: 'es.ex.5sau5c29rfhhvo' },
          ),
          ex.translateWrite(
            'I go to college by bus.',
            'Voy a la facultad en autobús.',
            ['es-el-autobus'],
            {
              id: 'es.ex.skyl9cfprl17rx',
              acceptedAnswers: [
                'Yo voy a la facultad en autobús.',
                'Voy en autobús a la facultad.',
                'Voy a la universidad en autobús.',
                'Voy a la facultad en camión.',
                'Voy a la facultad en colectivo.',
                'Voy a la facultad en bus.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo vas al trabajo?',
            'Say you go by subway (use «Voy en…»).',
            'Voy en metro.',
            ['Voy al trabajo en metro.', 'Yo voy en metro.', 'En metro.', 'Voy en subte.'],
            ['es-el-metro'],
            { id: 'es.ex.lb5wurhb1pxfep' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Tomar el autobús',
        objective: 'Say which transport you take, and talk about tickets and planes.',
        intro: {
          explanation:
            'With transport, use tomar: tomo el autobús (I take the bus), tomas el metro (you take, tú), toma el tren (he, she or usted takes). In Spain people say coger, but in much of Latin America that verb is vulgar, so always say tomar. For a plane or a long-distance bus you need a pasaje (ticket; in Mexico people say el boleto, in Spain el billete). Ahora means now; the h is silent.',
          examples: [
            { target: 'Ahora tomo el metro.', base: 'Now I’m taking the subway.' },
            {
              target: '¿Tomas el autobús? — No, voy a pie.',
              base: 'Do you take the bus? — No, I walk.',
            },
          ],
        },
        takeaways: [
          'You say tomar for transport: tomo el autobús, tomas el metro.',
          'You know el avión, el pasaje and ahora.',
        ],
        exercises: [
          ex.translationChoice(
            'tomar',
            'to take',
            ['to stay', 'to visit', 'to travel'],
            ['es-tomar'],
            { id: 'es.ex.iu1spehvj66z24' },
          ),
          ex.fillBlank(
            'Todos los días ___ el autobús.',
            'I take the bus every day.',
            'tomo',
            ['tomas', 'toma', 'voy'],
            ['es-tomar', 'es-el-autobus'],
            {
              id: 'es.ex.nq69olw794vdxs',
              explanation: 'I take = tomo. Tomas is for tú and toma for él, ella or usted.',
            },
          ),
          ex.listenChoice(
            'Tomo el tren.',
            ['Tomas el tren.', 'Toma el tren.', 'Tomo el metro.'],
            ['es-tomar', 'es-el-tren'],
            { id: 'es.ex.maqb5rz5b9mk6t' },
          ),
          ex.translationChoice(
            'el pasaje',
            'the ticket',
            ['the trip', 'the plane', 'the street'],
            ['es-el-pasaje'],
            { id: 'es.ex.3u39hhtuewln9f' },
          ),
          ex.fillBlank(
            '¿Tú ___ el metro?',
            'Do you take the subway?',
            'tomas',
            ['tomo', 'toma', 'tomamos'],
            ['es-tomar', 'es-el-metro'],
            {
              id: 'es.ex.lloklgzp6kixpz',
              explanation:
                'With tú the verb ends in -s: tú tomas (like tú vas, tú tienes). Tomo is for yo, toma for él, ella or usted.',
            },
          ),
          ex.matchPairs(
            [
              ['el avión', 'the plane'],
              ['el pasaje', 'the ticket'],
              ['ahora', 'now'],
              ['tomar', 'to take'],
            ],
            ['es-el-avion', 'es-el-pasaje', 'es-ahora', 'es-tomar'],
            { id: 'es.ex.uz145pxnmytinv' },
          ),
          ex.listenChoice(
            'Ahora voy en avión.',
            ['Ahora voy en carro.', 'Ahora voy en tren.', 'Hoy voy en avión.'],
            ['es-ahora', 'es-el-avion'],
            { id: 'es.ex.04nkhtd0fxpneu' },
          ),
          ex.orderWords(
            'Ahora tomo el autobús.',
            'Now I’m taking the bus.',
            ['es-ahora', 'es-tomar'],
            {
              id: 'es.ex.d8k17wgxyhekk5',
            },
          ),
          ex.translateWrite('Where is the ticket?', '¿Dónde está el pasaje?', ['es-el-pasaje'], {
            id: 'es.ex.kza1vewk2d0uk9',
          }),
          ex.translateWrite(
            'My brother takes the plane today.',
            'Mi hermano toma el avión hoy.',
            ['es-tomar', 'es-el-avion'],
            { id: 'es.ex.m7d6hrq2ga14ga', acceptedAnswers: ['Hoy mi hermano toma el avión.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Voy a viajar',
        objective: 'Talk about plans with ir a + infinitive.',
        intro: {
          explanation:
            'For plans, use ir a + infinitive, just like English “going to”: voy a viajar (I’m going to travel), vas a visitar (you’re going to visit), vamos a tomar el tren. Only ir changes: voy, vas, va, vamos, van + a + the verb as it is. To visit a person, add a: voy a visitar a mi abuela. Viaje, visitar and vacaciones start with v, but it sounds just like a b.',
          examples: [
            { target: 'Voy a viajar en avión.', base: 'I’m going to travel by plane.' },
            {
              target: 'Vamos a visitar a mis abuelos.',
              base: 'We’re going to visit my grandparents.',
            },
          ],
        },
        takeaways: [
          'You talk about plans with voy a, vas a, vamos a + verb.',
          'You talk about trips and holidays: el viaje, las vacaciones.',
        ],
        exercises: [
          ex.translationChoice(
            'voy a',
            "I'm going to",
            ['I go', 'I want', 'I prefer'],
            ['es-voy-a'],
            { id: 'es.ex.ixfzvh9bryw9zd' },
          ),
          ex.fillBlank(
            'Mañana voy ___ viajar.',
            'Tomorrow I’m going to travel.',
            'a',
            ['de', 'en', 'con'],
            ['es-voy-a'],
            {
              id: 'es.ex.izfcumw7jub7j8',
              explanation: 'Plans: ir + a + infinitive. Don’t forget the a: voy a viajar.',
            },
          ),
          ex.listenChoice(
            'Voy a viajar.',
            ['Voy a bailar.', 'Vamos a viajar.', 'Van a viajar.'],
            ['es-voy-a'],
            { id: 'es.ex.fb0c3xstzufie3' },
          ),
          ex.matchPairs(
            [
              ['voy a', "I'm going to"],
              ['visitar', 'to visit'],
              ['el viaje', 'the trip'],
              ['las vacaciones', 'the holidays'],
            ],
            ['es-voy-a', 'es-visitar', 'es-el-viaje', 'es-las-vacaciones'],
            { id: 'es.ex.ikgghf37c50vn7' },
          ),
          ex.fillBlank(
            'Mis padres ___ a visitar Monterrey.',
            'My parents are going to visit Monterrey.',
            'van',
            ['va', 'voy', 'vamos'],
            ['es-visitar', 'es-voy-a'],
            {
              id: 'es.ex.lftwg7mm67j2fy',
              explanation: 'Mis padres = ellos, so ir is van: van a visitar.',
            },
          ),
          ex.translationChoice(
            'las vacaciones',
            'the holidays',
            ['the trip', 'the weekend', 'the ticket'],
            ['es-las-vacaciones'],
            { id: 'es.ex.wxf9x7sll93kgr' },
          ),
          ex.fillBlank(
            '¿Tú ___ a tomar el avión?',
            'Are you going to take the plane?',
            'vas',
            ['va', 'voy', 'van'],
            ['es-voy-a', 'es-tomar'],
            {
              id: 'es.ex.bgzglfqexw1s2l',
              explanation:
                'With tú, ir is vas: ¿vas a tomar el avión? Va is for él, ella or usted.',
            },
          ),
          ex.listenChoice(
            'El viaje es muy largo.',
            ['El viaje es muy corto.', 'El viaje es muy caro.', 'El viaje es muy lindo.'],
            ['es-el-viaje'],
            { id: 'es.ex.71gi38u5jwgbve' },
          ),
          ex.translateWrite(
            "We're going to visit Cusco.",
            'Vamos a visitar Cusco.',
            ['es-visitar', 'es-voy-a'],
            {
              id: 'es.ex.dx3ndxnw6fuwiv',
              acceptedAnswers: ['Nosotros vamos a visitar Cusco.'],
            },
          ),
          ex.shortAnswer(
            '¿Qué vas a hacer en las vacaciones?',
            'Say you are going to travel (use «Voy a…»).',
            'Voy a viajar.',
            [
              'En las vacaciones voy a viajar.',
              'Yo voy a viajar.',
              'Voy a viajar en las vacaciones.',
            ],
            ['es-voy-a', 'es-las-vacaciones'],
            { id: 'es.ex.gjzptckogrguw5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Este fin de semana',
        objective: 'Say when your plans are and whether you are staying or going.',
        intro: {
          explanation:
            'Time words for plans: esta noche (tonight), este fin de semana (this weekend), la semana que viene (next week) and mañana. Quedarse means to stay, and it comes with a small word that changes with the person: me quedo (I stay), te quedas (you stay, tú), se queda (he, she or usted stays). Me quedo en casa = I’m staying home.',
          examples: [
            { target: 'Esta noche me quedo en casa.', base: 'Tonight I’m staying home.' },
            {
              target: 'La semana que viene voy a visitar a mi abuela.',
              base: 'Next week I’m going to visit my grandmother.',
            },
          ],
        },
        takeaways: [
          'You say when with esta noche, este fin de semana and la semana que viene.',
          'You say you are staying with me quedo, te quedas, se queda.',
        ],
        exercises: [
          ex.translationChoice(
            'esta noche',
            'tonight',
            ['this weekend', 'next week', 'now'],
            ['es-esta-noche'],
            { id: 'es.ex.ygaedud5bu7gvc' },
          ),
          ex.matchPairs(
            [
              ['esta noche', 'tonight'],
              ['este fin de semana', 'this weekend'],
              ['la semana que viene', 'next week'],
              ['quedarse', 'to stay'],
            ],
            ['es-esta-noche', 'es-este-fin-de-semana', 'es-la-semana-que-viene', 'es-quedarse'],
            { id: 'es.ex.r9gr2ikxwhyjn2' },
          ),
          ex.fillBlank(
            'Este fin de semana me ___ en casa.',
            'This weekend I’m staying home.',
            'quedo',
            ['quedas', 'queda', 'quedarse'],
            ['es-quedarse', 'es-este-fin-de-semana'],
            {
              id: 'es.ex.q02hrkbo3bdzon',
              explanation:
                'With me (I): me quedo. Te quedas is for tú and se queda for él, ella or usted.',
            },
          ),
          ex.listenChoice(
            'Me quedo en casa.',
            ['Te quedas en casa.', 'Se queda en casa.', 'Me quedo en Lima.'],
            ['es-quedarse'],
            { id: 'es.ex.hn49q3kod7fnv4' },
          ),
          ex.fillBlank(
            '¿Te ___ en Lima?',
            'Are you staying in Lima?',
            'quedas',
            ['quedo', 'queda', 'quedarse'],
            ['es-quedarse'],
            {
              id: 'es.ex.9ijsm0ff50fl9h',
              explanation:
                'Te goes with tú, so the verb is te quedas. Me quedo is for yo and se queda for él, ella or usted.',
            },
          ),
          ex.translationChoice(
            'la semana que viene',
            'next week',
            ['this weekend', 'tonight', 'the weekend'],
            ['es-la-semana-que-viene'],
            { id: 'es.ex.ngetf7admhmafc' },
          ),
          ex.listenChoice(
            'Esta noche voy al cine.',
            [
              'Esta noche voy al museo.',
              'Este fin de semana voy al cine.',
              'Esta noche vamos al cine.',
            ],
            ['es-esta-noche', 'es-este-fin-de-semana'],
            { id: 'es.ex.7lc1osgt4pp4kh' },
          ),
          question(
            'es.ex.neifr7p2ou0z3i',
            PLANES,
            'What is Valentina going to do this weekend?',
            'Visit her grandparents in Querétaro',
            ['Stay at home', 'Go to the cinema', 'Travel to Querétaro by car'],
            ['es-visitar', 'es-este-fin-de-semana'],
            'Valentina says “Voy a visitar a mis abuelos en Querétaro”.',
          ),
          ex.translateWrite(
            'Next week I am going to visit my grandmother.',
            'La semana que viene voy a visitar a mi abuela.',
            ['es-la-semana-que-viene', 'es-visitar', 'es-voy-a'],
            {
              id: 'es.ex.zzg20c2e3v0zsd',
              acceptedAnswers: ['Voy a visitar a mi abuela la semana que viene.'],
            },
          ),
          ex.shortAnswer(
            '¿Qué vas a hacer esta noche?',
            'Say you are staying home (use «Me quedo…»).',
            'Me quedo en casa.',
            [
              'Esta noche me quedo en casa.',
              'Me voy a quedar en casa.',
              'Voy a quedarme en casa.',
              'Me quedo en mi casa.',
            ],
            ['es-quedarse', 'es-esta-noche'],
            { id: 'es.ex.iwvfqsploq8pk3' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Planes de viaje',
        objective: 'Understand plans and trips in a conversation and a message.',
        intro: {
          explanation:
            'Put it together: how you travel (en tren, a pie), what you are going to do (voy a + verb) and when (esta noche, la semana que viene). In much of Latin America, long trips between cities are often by long-distance bus; big cities such as Mexico City, Santiago or Buenos Aires also have a metro.',
          examples: [
            {
              target: 'La semana que viene voy a viajar en avión.',
              base: 'Next week I’m going to travel by plane.',
            },
            {
              target: 'Ahora tomo el metro y después voy a pie.',
              base: 'Now I’m taking the subway and then I’ll walk.',
            },
          ],
        },
        takeaways: [
          'You understand someone’s plans in a conversation and a message.',
          'You say what you are going to do, when and how you will travel.',
        ],
        exercises: [
          question(
            'es.ex.13an25rzzfhkxg',
            PLANES,
            'How is Valentina going to travel?',
            'By bus',
            ['By car', 'By plane', 'On foot'],
            ['es-el-autobus', 'es-tomar'],
            'Diego asks “¿Vas en carro?” and Valentina answers “No, voy a tomar el autobús”.',
          ),
          question(
            'es.ex.7jdu6nn5r0upwb',
            PLANES,
            'What are Diego’s plans?',
            'To stay home and go to the cinema tonight',
            ['To visit his grandparents', 'To take the bus to Querétaro', 'To travel by car'],
            ['es-quedarse', 'es-esta-noche'],
            'Diego says “Yo me quedo en casa. Esta noche voy al cine”.',
          ),
          question(
            'es.ex.863c8lyctlikwh',
            MENSAJE,
            'When is Mateo going on holiday?',
            'Next week',
            ['Tonight', 'This weekend', 'Now'],
            ['es-la-semana-que-viene', 'es-las-vacaciones'],
            'Mateo writes “La semana que viene voy de vacaciones”.',
          ),
          question(
            'es.ex.7ksh40y93onk6h',
            MENSAJE,
            'How is Mateo going to travel to Cusco?',
            'By plane',
            ['By bus', 'By train', 'By car'],
            ['es-el-avion', 'es-voy-a'],
            'Mateo writes “Voy a viajar a Cusco en avión”.',
          ),
          question(
            'es.ex.6zig6cntl5rgot',
            MENSAJE,
            'How long is Mateo going to stay in the mountains?',
            'A week',
            ['A weekend', 'A month', 'One night'],
            ['es-quedarse'],
            'Mateo writes “Me quedo una semana en la montaña”.',
          ),
          ex.listenChoice(
            'La semana que viene voy a Lima.',
            [
              'Este fin de semana voy a Lima.',
              'La semana que viene voy a Cusco.',
              'La semana que viene vamos a Lima.',
            ],
            ['es-la-semana-que-viene', 'es-este-fin-de-semana'],
            { id: 'es.ex.s2n6s2tvypl4dg' },
          ),
          ex.fillBlank(
            'Ya tengo el ___ para el viaje.',
            'I already have the ticket for the trip.',
            'pasaje',
            ['avión', 'viaje', 'metro'],
            ['es-el-pasaje', 'es-el-viaje'],
            {
              id: 'es.ex.27mp74wjzwgdn8',
              skill: 'vocabulary',
              explanation: 'The ticket for a trip is el pasaje (el boleto in Mexico).',
            },
          ),
          ex.matchPairs(
            [
              ['el autobús', 'the bus'],
              ['a pie', 'on foot'],
              ['el viaje', 'the trip'],
              ['ahora', 'now'],
            ],
            ['es-el-autobus', 'es-a-pie', 'es-el-viaje', 'es-ahora'],
            { id: 'es.ex.cd84b14bcb8ved' },
          ),
          ex.translateWrite(
            "Tonight I'm going to take the subway.",
            'Esta noche voy a tomar el metro.',
            ['es-esta-noche', 'es-tomar', 'es-el-metro'],
            {
              id: 'es.ex.xurqzkz2em6l2d',
              acceptedAnswers: [
                'Voy a tomar el metro esta noche.',
                'Esta noche voy a tomar el subte.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué vas a hacer este fin de semana?',
            'Say you are going to visit Monterrey by car (use «Voy a visitar…»).',
            'Voy a visitar Monterrey en carro.',
            [
              'Este fin de semana voy a visitar Monterrey en carro.',
              'Voy a visitar Monterrey en el carro.',
              'Voy a ir a Monterrey en carro.',
              'Voy a visitar Monterrey en auto.',
              'Voy a visitar Monterrey en coche.',
            ],
            ['es-visitar', 'es-el-carro', 'es-este-fin-de-semana'],
            { id: 'es.ex.ym1sqf0dm9j93i' },
          ),
        ],
      },
    ],
  },
};

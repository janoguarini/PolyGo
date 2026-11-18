import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U17 «Transport and plans» (docs/ES_A1_A2.md): medios de transporte con en (en colectivo,
 * en tren, en auto) y a pie; tomar el colectivo / el subte (en la Argentina, tomar y nunca «coger»).
 * Ir a + infinitivo para los planes (voy a viajar, vamos a visitar). Esta noche, este fin de semana, la
 * semana que viene. Quedarse (me quedo, te quedás, se queda). Vocabulario rioplatense: colectivo,
 * subte, auto, pasaje. Pronunciación: la b y la v suenan igual (viaje, bici, vacaciones).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PLANES = dialogue(
  'es.stim.a1-u17-planes',
  'On Friday, Diego and Valentina talk about their plans for the weekend.',
  [
    ['Diego', 'Valentina, ¿qué vas a hacer este fin de semana?'],
    ['Valentina', 'Voy a visitar a mis abuelos en Rosario.'],
    ['Diego', '¿Vas en auto?'],
    ['Valentina', 'No, voy a tomar el tren. ¿Y vos?'],
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
    'Voy a viajar a Bariloche en avión.',
    'Ya tengo el pasaje.',
    'Me quedo una semana en la montaña.',
    '¿Y vos? ¿Qué vas a hacer?',
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
    'Rosario',
    'Mendoza',
    'Córdoba',
    'Bariloche',
    'Buenos Aires',
  ],
  support: ['tomamos', 'quedo', 'quedás', 'queda', 'hacer', 'ya'],
  unit: {
    position: 17,
    title: 'Transport and plans',
    titleEn: 'Transporte y planes',
    description:
      'Say how you get around (en colectivo, en subte, a pie) with tomar, and talk about plans with ir a + infinitive and quedarse.',
    emoji: '🚌',
    objective:
      'You can say how you travel, talk about your plans for tonight, the weekend or next week with voy a + verb, and say where you are staying.',
    grammar: {
      title: 'Ir a + infinitive · en colectivo',
      explanation:
        'To say how you travel: en + vehicle, with no article (en colectivo, en subte, en tren, en auto, en avión, en bicicleta), but a pie (on foot). With transport Argentines use tomar: tomo el colectivo, ¿tomás el subte? (in Spain people say coger, but in Argentina that word is vulgar). For plans, use ir a + infinitive, like English “going to”: voy a viajar, vas a visitar, vamos a tomar el tren. Only ir changes (voy, vas, va, vamos, van); the second verb stays as it is. Quedarse (to stay) comes with me, te, se: me quedo, te quedás, se queda. Argentine words: colectivo (bus, autobús elsewhere), subte (subway, metro elsewhere), auto (car, coche in Spain) and pasaje (ticket for a trip). B and v sound exactly the same: viaje, bici.',
      examples: [
        { target: 'Voy a viajar en avión.', base: 'I’m going to travel by plane.' },
        {
          target: 'Este fin de semana vamos a visitar Córdoba.',
          base: 'This weekend we’re going to visit Córdoba.',
        },
        { target: 'Esta noche me quedo en casa.', base: 'Tonight I’m staying home.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U17). Sin revisión nativa: revisar la advertencia sobre «coger» (dicha en inglés y sin ejemplos), «ir de vacaciones», «el pasaje» (de avión o de micro; en la ciudad se habla de «boleto» o de la tarjeta SUBE: no se enseña), y «visitar a» con personas frente a «visitar» + lugar. Se acepta «la bici».',
    },
    words: [
      w(
        'es-el-colectivo',
        'el colectivo',
        'the bus',
        'Tomo el colectivo todos los días.',
        'I take the bus every day.',
        ['transport', 'argentina'],
        { acceptedTranslations: ['bus'], emoji: '🚌' },
      ),
      w(
        'es-el-tren',
        'el tren',
        'the train',
        'Vamos a Rosario en tren.',
        'We go to Rosario by train.',
        ['transport'],
        { acceptedTranslations: ['train'], emoji: '🚆' },
      ),
      w(
        'es-el-auto',
        'el auto',
        'the car',
        'Mi papá tiene un auto rojo.',
        'My dad has a red car.',
        ['transport', 'argentina'],
        { acceptedTranslations: ['car'], emoji: '🚗' },
      ),
      w(
        'es-el-avion',
        'el avión',
        'the plane',
        'Voy a Bariloche en avión.',
        'I go to Bariloche by plane.',
        ['transport'],
        { acceptedTranslations: ['the airplane', 'plane'], emoji: '✈️' },
      ),
      w(
        'es-el-subte',
        'el subte',
        'the subway',
        'En Buenos Aires tomo el subte.',
        'In Buenos Aires I take the subway.',
        ['transport', 'argentina'],
        { acceptedTranslations: ['the underground', 'the metro'], emoji: '🚇' },
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
        { acceptedTranslations: ['ticket'], emoji: '🎫' },
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
        'La semana que viene voy a Mendoza.',
        'Next week I’m going to Mendoza.',
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
      w(
        'es-ahora',
        'ahora',
        'now',
        'Ahora estoy en el colectivo.',
        'I’m on the bus now.',
        ['time'],
        {
          acceptedTranslations: ['right now'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'En colectivo, en subte',
        objective: 'Say how you get around: by bus, train, car, bike or on foot.',
        intro: {
          explanation:
            'To say how you travel, use en + vehicle with no article: en colectivo (by bus), en subte (by subway), en tren, en auto, en bicicleta (or en bici). The exception is a pie (on foot). These are the Argentine words: colectivo for bus (autobús elsewhere), subte for the Buenos Aires subway (metro elsewhere) and auto for car (coche in Spain). B and v sound exactly the same: bicicleta, voy.',
          examples: [
            { target: 'Voy a la facultad en colectivo.', base: 'I go to college by bus.' },
            { target: 'Mi hermana va al trabajo a pie.', base: 'My sister walks to work.' },
          ],
        },
        takeaways: [
          'You say how you travel with en + vehicle: en colectivo, en subte.',
          'You say on foot with a pie.',
        ],
        exercises: [
          ex.translationChoice(
            'el colectivo',
            'the bus',
            ['the train', 'the car', 'the subway'],
            ['es-el-colectivo'],
            { id: 'es.ex.hicinz5sjpn8k1' },
          ),
          ex.matchPairs(
            [
              ['el tren', 'the train'],
              ['el auto', 'the car'],
              ['el subte', 'the subway'],
              ['la bicicleta', 'the bicycle'],
            ],
            ['es-el-tren', 'es-el-auto', 'es-el-subte', 'es-la-bicicleta'],
            { id: 'es.ex.zamylvwp7is9fy' },
          ),
          ex.fillBlank(
            'Voy al trabajo ___ subte.',
            'I go to work by subway.',
            'en',
            ['a', 'de', 'con'],
            ['es-el-subte'],
            {
              id: 'es.ex.ituz09ezq0sv9n',
              explanation: 'By + vehicle = en, with no article: en subte, en colectivo, en tren.',
            },
          ),
          ex.listenChoice(
            'Voy en tren.',
            ['Voy en auto.', 'Vamos en tren.', 'Voy a pie.'],
            ['es-el-tren', 'es-a-pie', 'es-el-auto'],
            { id: 'es.ex.sj4fkhtgiw7fx7' },
          ),
          ex.fillBlank(
            'No voy en auto. Voy a ___.',
            'I don’t go by car. I go on foot.',
            'pie',
            ['tren', 'subte', 'bicicleta'],
            ['es-a-pie', 'es-el-auto'],
            {
              id: 'es.ex.0o5d134k38azo1',
              explanation: 'On foot is a pie. With a vehicle you use en: en tren, en subte.',
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
            'Vamos en colectivo.',
            ['Vamos en subte.', 'Van en colectivo.', 'Vamos a pie.'],
            ['es-el-colectivo', 'es-el-subte'],
            { id: 'es.ex.hbeohr53r36m0w' },
          ),
          ex.translateWrite(
            'I go to college by bus.',
            'Voy a la facultad en colectivo.',
            ['es-el-colectivo'],
            {
              id: 'es.ex.ho4yn6ut5rmfjb',
              acceptedAnswers: [
                'Yo voy a la facultad en colectivo.',
                'Voy en colectivo a la facultad.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo vas al trabajo?',
            'Say you go by subway (use «Voy en…»).',
            'Voy en subte.',
            ['Voy al trabajo en subte.', 'Yo voy en subte.', 'En subte.'],
            ['es-el-subte'],
            { id: 'es.ex.yol6xnx1i6u9wj' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Tomar el colectivo',
        objective: 'Say which transport you take, and talk about tickets and planes.',
        intro: {
          explanation:
            'With transport, Argentines use tomar: tomo el colectivo (I take the bus), tomás el subte (you take, vos), toma el tren (he or she takes). In Spain people say coger, but in Argentina that word is vulgar, so always say tomar. For a plane or a long-distance bus you need a pasaje (ticket). Ahora means now; the h is silent.',
          examples: [
            { target: 'Ahora tomo el subte.', base: 'Now I’m taking the subway.' },
            {
              target: '¿Tomás el colectivo? — No, voy a pie.',
              base: 'Do you take the bus? — No, I walk.',
            },
          ],
        },
        takeaways: [
          'You say tomar for transport: tomo el colectivo, tomás el subte.',
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
            'Todos los días ___ el colectivo.',
            'I take the bus every day.',
            'tomo',
            ['tomás', 'toma', 'voy'],
            ['es-tomar', 'es-el-colectivo'],
            {
              id: 'es.ex.tedlndewkkb09d',
              explanation: 'I take = tomo. Tomás is for vos and toma for él, ella or usted.',
            },
          ),
          ex.listenChoice(
            'Tomo el tren.',
            ['Tomás el tren.', 'Toma el tren.', 'Tomo el subte.'],
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
            '¿Vos ___ el subte?',
            'Do you take the subway?',
            'tomás',
            ['tomo', 'toma', 'tomamos'],
            ['es-tomar', 'es-el-subte'],
            {
              id: 'es.ex.exhs0s1g3v2sbj',
              explanation: 'With vos the stress goes on the end: vos tomás.',
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
            ['Ahora voy en auto.', 'Ahora voy en tren.', 'Hoy voy en avión.'],
            ['es-ahora', 'es-el-avion'],
            { id: 'es.ex.04nkhtd0fxpneu' },
          ),
          ex.orderWords(
            'Ahora tomo el colectivo.',
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
            'Mis padres ___ a visitar Mendoza.',
            'My parents are going to visit Mendoza.',
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
            '¿Vos ___ a tomar el avión?',
            'Are you going to take the plane?',
            'vas',
            ['va', 'voy', 'van'],
            ['es-voy-a', 'es-tomar'],
            { id: 'es.ex.bgzglfqexw1s2l', explanation: 'With vos, ir is vas: vas a tomar.' },
          ),
          ex.listenChoice(
            'El viaje es muy largo.',
            ['El viaje es muy corto.', 'El viaje es muy caro.', 'El viaje es muy lindo.'],
            ['es-el-viaje'],
            { id: 'es.ex.71gi38u5jwgbve' },
          ),
          ex.translateWrite(
            "We're going to visit Bariloche.",
            'Vamos a visitar Bariloche.',
            ['es-visitar', 'es-voy-a'],
            {
              id: 'es.ex.dx3ndxnw6fuwiv',
              acceptedAnswers: ['Nosotros vamos a visitar Bariloche.'],
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
            'Time words for plans: esta noche (tonight), este fin de semana (this weekend), la semana que viene (next week) and mañana. Quedarse means to stay, and it comes with a small word that changes with the person: me quedo (I stay), te quedás (you stay, vos), se queda (he or she stays). Me quedo en casa = I’m staying home.',
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
          'You say you are staying with me quedo, te quedás, se queda.',
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
            ['quedás', 'queda', 'quedarse'],
            ['es-quedarse', 'es-este-fin-de-semana'],
            {
              id: 'es.ex.q02hrkbo3bdzon',
              explanation:
                'With me (I): me quedo. Te quedás is for vos and se queda for él or ella.',
            },
          ),
          ex.listenChoice(
            'Me quedo en casa.',
            ['Te quedás en casa.', 'Se queda en casa.', 'Me quedo en Rosario.'],
            ['es-quedarse'],
            { id: 'es.ex.hn49q3kod7fnv4' },
          ),
          ex.fillBlank(
            '¿Vos te ___ en Córdoba?',
            'Are you staying in Córdoba?',
            'quedás',
            ['quedo', 'queda', 'quedarse'],
            ['es-quedarse'],
            {
              id: 'es.ex.9ijsm0ff50fl9h',
              explanation: 'With vos: te quedás, with the stress at the end.',
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
            'Visit her grandparents in Rosario',
            ['Stay at home', 'Go to the cinema', 'Travel to Rosario by car'],
            ['es-visitar', 'es-este-fin-de-semana'],
            'Valentina says “Voy a visitar a mis abuelos en Rosario”.',
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
            'Put it together: how you travel (en tren, a pie), what you are going to do (voy a + verb) and when (esta noche, la semana que viene). In Argentina, long trips between cities are often by long-distance bus; in Buenos Aires people move around by colectivo and subte.',
          examples: [
            {
              target: 'La semana que viene voy a viajar en avión.',
              base: 'Next week I’m going to travel by plane.',
            },
            {
              target: 'Ahora tomo el subte y después voy a pie.',
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
            'es.ex.p6an3k4ycxa99n',
            PLANES,
            'How is Valentina going to travel?',
            'By train',
            ['By car', 'By plane', 'On foot'],
            ['es-el-tren', 'es-tomar'],
            'Diego asks “¿Vas en auto?” and Valentina answers “No, voy a tomar el tren”.',
          ),
          question(
            'es.ex.7jdu6nn5r0upwb',
            PLANES,
            'What are Diego’s plans?',
            'To stay home and go to the cinema tonight',
            ['To visit his grandparents', 'To take the train to Rosario', 'To travel by car'],
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
            'How is Mateo going to travel to Bariloche?',
            'By plane',
            ['By bus', 'By train', 'By car'],
            ['es-el-avion', 'es-voy-a'],
            'Mateo writes “Voy a viajar a Bariloche en avión”.',
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
            'La semana que viene voy a Córdoba.',
            [
              'Este fin de semana voy a Córdoba.',
              'La semana que viene voy a Rosario.',
              'La semana que viene vamos a Córdoba.',
            ],
            ['es-la-semana-que-viene', 'es-este-fin-de-semana'],
            { id: 'es.ex.s2n6s2tvypl4dg' },
          ),
          ex.fillBlank(
            'Ya tengo el ___ para el viaje.',
            'I already have the ticket for the trip.',
            'pasaje',
            ['avión', 'viaje', 'subte'],
            ['es-el-pasaje', 'es-el-viaje'],
            {
              id: 'es.ex.27mp74wjzwgdn8',
              skill: 'vocabulary',
              explanation: 'The ticket for a trip is el pasaje.',
            },
          ),
          ex.matchPairs(
            [
              ['el colectivo', 'the bus'],
              ['a pie', 'on foot'],
              ['el viaje', 'the trip'],
              ['ahora', 'now'],
            ],
            ['es-el-colectivo', 'es-a-pie', 'es-el-viaje', 'es-ahora'],
            { id: 'es.ex.31rwx5rhj2vq4x' },
          ),
          ex.translateWrite(
            "Tonight I'm going to take the subway.",
            'Esta noche voy a tomar el subte.',
            ['es-esta-noche', 'es-tomar', 'es-el-subte'],
            { id: 'es.ex.4op8lr85irr2p7', acceptedAnswers: ['Voy a tomar el subte esta noche.'] },
          ),
          ex.shortAnswer(
            '¿Qué vas a hacer este fin de semana?',
            'Say you are going to visit Mendoza by car (use «Voy a visitar…»).',
            'Voy a visitar Mendoza en auto.',
            [
              'Este fin de semana voy a visitar Mendoza en auto.',
              'Voy a visitar Mendoza en el auto.',
              'Voy a ir a Mendoza en auto.',
            ],
            ['es-visitar', 'es-el-auto', 'es-este-fin-de-semana'],
            { id: 'es.ex.gnizmjalh63b8b' },
          ),
        ],
      },
    ],
  },
};

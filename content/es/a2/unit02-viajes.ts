import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U2 «Travel» (docs/ES_A1_A2.md): contar un viaje en pasado con los irregulares estar
 * (estuve), tener (tuve) y venir (vine), los regulares salir, volver y quedarse, y llegar con su
 * cambio ortográfico (llegué); decir hace cuánto (hace dos años) y si se llegó tarde o a tiempo.
 * Vocabulario rioplatense: la valija (maleta), la estadía (estancia).
 * Pronunciación: la g suave de llegué (gue) frente a la j fuerte de viaje.
 * Cultura: Bariloche y la nieve en julio, el invierno del hemisferio sur.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const VACACIONES = dialogue(
  'es.stim.a2-u2-vacaciones',
  'Camila runs into her friend Diego after his holiday.',
  [
    ['Camila', '¡Diego! ¿Dónde estuviste toda la semana?'],
    ['Diego', 'Estuve en Bariloche con mi familia. Salimos el sábado y volvimos anoche.'],
    ['Camila', '¡Qué lindo! ¿Y cómo fue el viaje?'],
    [
      'Diego',
      'El vuelo llegó tarde, pero la estadía fue muy linda. Nos quedamos en un hotel cerca del lago.',
    ],
    ['Camila', 'Yo fui a Bariloche hace dos años. ¡En invierno hace mucho frío!'],
    ['Diego', '¡Sí! Tuve frío todos los días.'],
  ],
);

const POSTAL = reading(
  'es.stim.a2-u2-postal',
  'postcard',
  'A postcard from Tomás to his grandmother in Buenos Aires.',
  [
    'Querida abuela:',
    'Este es mi primer viaje al extranjero. Llegué a Madrid el lunes.',
    'El vuelo salió a tiempo, pero mi valija llegó dos días después.',
    'Me quedé en un hotel chico y muy lindo.',
    'Ayer tuve un problema: ¡no encontré mi pasaporte! Después lo encontré en la mochila.',
    'Vuelvo a Buenos Aires el domingo.',
    'Un beso, Tomás',
  ],
  { from: 'Tomás', to: 'Abuela' },
);

export const ES_A2_U02: EsUnitDef = {
  names: ['Buenos Aires', 'Madrid', 'Patagonia', 'Argentina'],
  support: [
    'estuviste',
    'estuvo',
    'tuviste',
    'tuvo',
    'viniste',
    'saliste',
    'salió',
    'salimos',
    'llegaste',
    'llegó',
    'llego',
    'vez',
    'volvimos',
    'quedaste',
    'quedamos',
    'nos',
    'lago',
    'querida',
    'primer',
    'problema',
    'encontré',
    'lo',
    'vuelvo',
    'beso',
  ],
  unit: {
    position: 2,
    title: 'Travel',
    titleEn: 'Viajes',
    description:
      'Tell the story of a trip with the past of estar, tener, venir, salir, llegar, volver and quedarse, say how long ago something happened (hace dos años) and whether you arrived late or on time.',
    emoji: '✈️',
    objective:
      'You can tell someone about a trip: where you were, when you left, arrived and came back, where you stayed, how long ago it was and what went wrong.',
    grammar: {
      title: 'Irregular pasts for travel · hace + time',
      explanation:
        'Estar, tener and venir have irregular pasts with a new stem and no written accent: estar → estuve, estuviste, estuvo; tener → tuve, tuviste, tuvo; venir → vine, viniste, vino (yes, vino is also wine). Salir and volver are regular -ir and -er verbs: salí, saliste, salió; volví, volviste, volvió. Llegar is regular, but its yo form is spelled llegué: the u keeps the g hard, as in English get. Quedarse (to stay) keeps its pronoun: me quedé, te quedaste, se quedó, nos quedamos. To say how long ago something happened, use hace + time: hace dos años (two years ago), hace una semana. Llegar tarde is to arrive late and llegar a tiempo, on time. Remember a + el = al and de + el = del: llegué al aeropuerto, salí del hotel.',
      examples: [
        { target: 'Estuve en Bariloche hace dos años.', base: 'I was in Bariloche two years ago.' },
        { target: 'Llegué al aeropuerto a tiempo.', base: 'I got to the airport on time.' },
        {
          target: '¿Cuándo viniste a la Argentina? — Vine hace dos años.',
          base: 'When did you come to Argentina? — I came two years ago.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U2). Sin revisión nativa. Revisar: «la estadía» (rioplatense, frente a «estancia»); «estuve» traducido como «I was (somewhere)» y «fue» para valorar (la estadía fue muy linda); «llegó a hora» como distractor incorrecto (se dice «a tiempo»); «Querida abuela:» y «Un beso» en la postal; el aviso de que «vino» es también el pasado de venir.',
    },
    words: [
      w(
        'es-estuve',
        'estuve',
        'I was (somewhere)',
        'El verano pasado estuve en Bariloche.',
        'Last summer I was in Bariloche.',
        ['past'],
      ),
      w('es-tuve', 'tuve', 'I had', 'Ayer tuve mucho trabajo.', 'Yesterday I had a lot of work.', [
        'past',
      ]),
      w(
        'es-vine',
        'vine',
        'I came',
        'Vine a Buenos Aires hace dos años.',
        'I came to Buenos Aires two years ago.',
        ['past'],
      ),
      w(
        'es-sali',
        'salí',
        'I left',
        'Salí del hotel a las ocho.',
        'I left the hotel at eight.',
        ['past'],
        {
          acceptedTranslations: ['I went out'],
        },
      ),
      w(
        'es-llegue',
        'llegué',
        'I arrived',
        'Llegué al aeropuerto a tiempo.',
        'I got to the airport on time.',
        ['past'],
        { acceptedTranslations: ['I got there'] },
      ),
      w(
        'es-volvi',
        'volví',
        'I came back',
        'Volví de Mendoza el domingo.',
        'I came back from Mendoza on Sunday.',
        ['past'],
        { acceptedTranslations: ['I returned'] },
      ),
      w(
        'es-me-quede',
        'me quedé',
        'I stayed',
        'Me quedé tres noches en un hotel.',
        'I stayed three nights at a hotel.',
        ['past'],
      ),
      w(
        'es-hace-dos-anos',
        'hace dos años',
        'two years ago',
        'Fui a Córdoba hace dos años.',
        'I went to Córdoba two years ago.',
        ['time'],
      ),
      w(
        'es-el-aeropuerto',
        'el aeropuerto',
        'the airport',
        'El aeropuerto está lejos de la ciudad.',
        'The airport is far from the city.',
        ['travel'],
        { emoji: '🛫' },
      ),
      w(
        'es-la-valija',
        'la valija',
        'the suitcase',
        '¿Dónde está mi valija?',
        'Where is my suitcase?',
        ['travel', 'argentina'],
        { emoji: '🧳' },
      ),
      w(
        'es-el-pasaporte',
        'el pasaporte',
        'the passport',
        'Mi pasaporte está en la mochila.',
        'My passport is in the backpack.',
        ['travel'],
        { emoji: '🛂' },
      ),
      w(
        'es-el-hotel',
        'el hotel',
        'the hotel',
        'El hotel está cerca de la playa.',
        'The hotel is near the beach.',
        ['travel'],
        { emoji: '🏨' },
      ),
      w(
        'es-la-estadia',
        'la estadía',
        'the stay',
        'La estadía en el hotel fue muy linda.',
        'The stay at the hotel was really nice.',
        ['travel', 'argentina'],
      ),
      w(
        'es-el-extranjero',
        'el extranjero',
        'abroad',
        'Este año voy a viajar al extranjero.',
        'This year I’m going to travel abroad.',
        ['travel'],
      ),
      w(
        'es-el-vuelo',
        'el vuelo',
        'the flight',
        'El vuelo salió a tiempo.',
        'The flight left on time.',
        ['travel'],
      ),
      w('es-tarde', 'tarde', 'late', 'El colectivo llegó tarde.', 'The bus arrived late.', [
        'time',
      ]),
      w(
        'es-a-tiempo',
        'a tiempo',
        'on time',
        'Hoy llegué a tiempo al trabajo.',
        'Today I got to work on time.',
        ['time'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Estuve, tuve',
        objective: 'Say where you were and what you had, using the past of estar and tener.',
        intro: {
          explanation:
            'Estar and tener have irregular pasts with a u in the stem and no written accent: estar → estuve, estuviste, estuvo; tener → tuve, tuviste, tuvo. Use estuve to say where you were for a while: estuve en Córdoba. To say what something was like, fue (from ser) is the usual choice: la estadía fue muy linda. La estadía (the stay) is the word used in Argentina. El extranjero means abroad: viajar al extranjero, estuve en el extranjero.',
          examples: [
            { target: 'Estuve una semana en Bariloche.', base: 'I was in Bariloche for a week.' },
            {
              target: 'La estadía en el hotel fue muy linda.',
              base: 'The stay at the hotel was really nice.',
            },
          ],
        },
        takeaways: [
          'You say where you were with estuve and what you had with tuve.',
          'You ask a friend ¿estuviste…? and ¿tuviste…?',
        ],
        exercises: [
          ex.translationChoice(
            'estuve',
            'I was (somewhere)',
            ['I had', 'I came', 'I stayed'],
            ['es-estuve'],
            { id: 'es.ex.krs5seqo24ig8d' },
          ),
          ex.fillBlank(
            'El verano pasado ___ en Mendoza.',
            'Last summer I was in Mendoza.',
            'estuve',
            ['tuve', 'estuvo', 'estoy'],
            ['es-estuve'],
            {
              id: 'es.ex.hfdnjyo8yaeh7q',
              explanation:
                'Estuve is I was (estar). Estuvo is he or she was; estoy is the present: I am.',
            },
          ),
          ex.listenChoice(
            'Estuve en el hotel.',
            ['Estuvo en el hotel.', 'Estoy en el hotel.', 'Estuve en el museo.'],
            ['es-estuve', 'es-el-hotel'],
            { id: 'es.ex.ndgq8gcg2rr9dh' },
          ),
          ex.matchPairs(
            [
              ['estuve', 'I was (somewhere)'],
              ['tuve', 'I had'],
              ['el hotel', 'the hotel'],
              ['la estadía', 'the stay'],
            ],
            ['es-estuve', 'es-tuve', 'es-el-hotel', 'es-la-estadia'],
            { id: 'es.ex.nftkaacojwmll9' },
          ),
          ex.fillBlank(
            'Ayer ___ mucho trabajo.',
            'Yesterday I had a lot of work.',
            'tuve',
            ['tengo', 'tuvo', 'estuve'],
            ['es-tuve'],
            {
              id: 'es.ex.xzk9ua2q8fomo5',
              explanation: 'Tuve is the past of tengo: I had. Tuvo is he or she had.',
            },
          ),
          ex.fillBlank(
            '¿Vos ___ en el extranjero?',
            'Have you ever been abroad?',
            'estuviste',
            ['estuve', 'estuvo', 'tuviste'],
            ['es-estuve', 'es-el-extranjero'],
            {
              id: 'es.ex.nbhlq2v0t7n50f',
              explanation:
                'With vos: estuviste. In Argentina the simple past is used where English says have you ever been.',
            },
          ),
          ex.translationChoice(
            'el extranjero',
            'abroad',
            ['the airport', 'the country', 'the trip'],
            ['es-el-extranjero'],
            { id: 'es.ex.7w0zy4rrzz1l4g' },
          ),
          ex.orderWords(
            'La estadía en el hotel fue muy linda.',
            'The stay at the hotel was really nice.',
            ['es-la-estadia', 'es-el-hotel'],
            { id: 'es.ex.nozr02mp64sf9n' },
          ),
          ex.translateWrite(
            'Last year I was in Córdoba.',
            'El año pasado estuve en Córdoba.',
            ['es-estuve'],
            { id: 'es.ex.nbijvczcssn74z', acceptedAnswers: ['Estuve en Córdoba el año pasado.'] },
          ),
          ex.shortAnswer(
            '¿Tuviste un buen viaje?',
            'Say yes, you had a good trip (start with «Sí, tuve»).',
            'Sí, tuve un buen viaje.',
            [
              'Sí, tuve un viaje muy bueno.',
              'Sí, tuve un muy buen viaje.',
              'Sí, tuve un viaje bueno.',
            ],
            ['es-tuve'],
            { id: 'es.ex.m433yvypsm18ys' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Salí, llegué, volví',
        objective:
          'Say when you left, arrived and came back, and whether you were late or on time.',
        intro: {
          explanation:
            'Salir and volver are regular: salí, saliste, salió; volví, volviste, volvió. Llegar is regular too, but its yo form is spelled llegué: the u is silent and keeps the g hard, like the g in get. Without it, ge would sound like the strong h of the j in viaje. Salir de, llegar a: salí de Córdoba, llegué a Rosario (de + el = del, a + el = al). Llegar tarde means to arrive late; llegar a tiempo, on time.',
          examples: [
            { target: 'Salí del hotel a las seis.', base: 'I left the hotel at six.' },
            { target: 'El vuelo llegó a tiempo.', base: 'The flight arrived on time.' },
          ],
        },
        takeaways: [
          'You say salí, llegué and volví, and write llegué with gu.',
          'You say whether something arrived tarde or a tiempo.',
        ],
        exercises: [
          ex.translationChoice(
            'llegué',
            'I arrived',
            ['I left', 'I came back', 'I stayed'],
            ['es-llegue'],
            { id: 'es.ex.z0rk64o9xd2m5v' },
          ),
          ex.matchPairs(
            [
              ['salí', 'I left'],
              ['volví', 'I came back'],
              ['el vuelo', 'the flight'],
              ['el aeropuerto', 'the airport'],
            ],
            ['es-sali', 'es-volvi', 'es-el-vuelo', 'es-el-aeropuerto'],
            { id: 'es.ex.5g3p8hlylnw8kn' },
          ),
          ex.listenChoice(
            'Llegué tarde.',
            ['Llegó tarde.', 'Llegué a tiempo.', 'Salí tarde.'],
            ['es-llegue', 'es-tarde'],
            { id: 'es.ex.iozfr6uu029w9p' },
          ),
          ex.fillBlank(
            'El lunes ___ tarde a la oficina.',
            'On Monday I got to the office late.',
            'llegué',
            ['llego', 'tuve', 'estuve'],
            ['es-llegue', 'es-tarde'],
            {
              id: 'es.ex.0oi08re1bs35gw',
              explanation:
                'El lunes is a finished day, so you need the past: llegué, written with gu to keep the hard g sound.',
            },
          ),
          ex.fillBlank(
            'El vuelo no llegó tarde: llegó a ___.',
            'The flight didn’t arrive late: it arrived on time.',
            'tiempo',
            ['hora', 'tarde'],
            ['es-a-tiempo', 'es-el-vuelo'],
            {
              id: 'es.ex.pqe4fejdnj11js',
              explanation: 'On time is a tiempo. Llegar tarde is the opposite: to arrive late.',
            },
          ),
          ex.translationChoice(
            'a tiempo',
            'on time',
            ['late', 'early', 'at noon'],
            ['es-a-tiempo'],
            {
              id: 'es.ex.3y6igyxz0bj0bg',
            },
          ),
          ex.fillBlank(
            '¿A qué hora ___ del aeropuerto?',
            'What time did you leave the airport? (to a friend)',
            'saliste',
            ['salí', 'volví', 'llegaste'],
            ['es-sali', 'es-el-aeropuerto'],
            {
              id: 'es.ex.8yyb14ip4sngh8',
              explanation:
                'With vos: saliste. Salir de means to leave a place; you arrive a un lugar (llegaste al aeropuerto).',
            },
          ),
          ex.orderWords(
            'Volví de Mendoza el domingo.',
            'I came back from Mendoza on Sunday.',
            ['es-volvi'],
            {
              id: 'es.ex.v5n3u0o98yagi3',
            },
          ),
          ex.translateWrite(
            'The flight arrived late.',
            'El vuelo llegó tarde.',
            ['es-el-vuelo', 'es-tarde'],
            {
              id: 'es.ex.rn3vdp5ijcc654',
            },
          ),
          ex.translateWrite(
            'I left the airport at ten.',
            'Salí del aeropuerto a las diez.',
            ['es-sali', 'es-el-aeropuerto'],
            { id: 'es.ex.1ro2g0mt1hcwek', acceptedAnswers: ['A las diez salí del aeropuerto.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Vine hace dos años',
        objective: 'Say how long ago something happened and talk about luggage and documents.',
        intro: {
          explanation:
            'Venir is irregular: vine, viniste, vino (careful: vino is also wine!). Quedarse (to stay) is regular and keeps its pronoun: me quedé, te quedaste, se quedó. To say how long ago, put hace before the time: hace dos años (two years ago), hace tres días, hace una semana. In Argentina a suitcase is la valija; in other countries you will hear maleta.',
          examples: [
            {
              target: 'Vine a Buenos Aires hace dos años.',
              base: 'I came to Buenos Aires two years ago.',
            },
            {
              target: 'Me quedé una semana en Bariloche.',
              base: 'I stayed in Bariloche for a week.',
            },
          ],
        },
        takeaways: [
          'You say how long ago something happened with hace + time.',
          'You use vine and me quedé to talk about a trip.',
        ],
        exercises: [
          ex.translationChoice(
            'me quedé',
            'I stayed',
            ['I came', 'I left', 'I was (somewhere)'],
            ['es-me-quede'],
            { id: 'es.ex.k2qwn4dcw6smrb' },
          ),
          ex.fillBlank(
            '___ a la Argentina hace dos años.',
            'I came to Argentina two years ago.',
            'Vine',
            ['Vino', 'Viene'],
            ['es-vine', 'es-hace-dos-anos'],
            {
              id: 'es.ex.tjzf2h3ut1mfi7',
              explanation:
                'Vine is I came. Vino is he or she came (and also wine); viene is the present: he comes.',
            },
          ),
          ex.listenChoice(
            'Vine en avión.',
            ['Vino en avión.', 'Viene en avión.', 'Vine en auto.'],
            ['es-vine'],
            { id: 'es.ex.xzng06huz5nm9e' },
          ),
          ex.matchPairs(
            [
              ['vine', 'I came'],
              ['me quedé', 'I stayed'],
              ['la valija', 'the suitcase'],
              ['el pasaporte', 'the passport'],
            ],
            ['es-vine', 'es-me-quede', 'es-la-valija', 'es-el-pasaporte'],
            { id: 'es.ex.ysxowl253a2166' },
          ),
          ex.fillBlank(
            'Me ___ tres noches en el hotel.',
            'I stayed three nights at the hotel.',
            'quedé',
            ['quedaste', 'quedamos'],
            ['es-me-quede', 'es-el-hotel'],
            {
              id: 'es.ex.p6xw4pbm4lz4dg',
              explanation:
                'Me goes with quedé (yo). With vos it is te quedaste; with nosotros, nos quedamos.',
            },
          ),
          ex.translationChoice(
            'hace dos años',
            'two years ago',
            ['two years old', 'in two years', 'every two years'],
            ['es-hace-dos-anos'],
            { id: 'es.ex.8x5fc9nwrmiphz' },
          ),
          ex.fillBlank(
            '¿Tenés el ___? — Sí, está en mi mochila.',
            'Have you got the passport? — Yes, it’s in my backpack.',
            'pasaporte',
            ['aeropuerto', 'hotel', 'vuelo'],
            ['es-el-pasaporte'],
            {
              id: 'es.ex.j9w0zfsx0atf5w',
              skill: 'vocabulary',
              explanation:
                'El pasaporte is the passport. You can’t carry an airport or a hotel in your backpack!',
            },
          ),
          ex.orderWords(
            'Fui a Córdoba hace dos años.',
            'I went to Córdoba two years ago.',
            ['es-hace-dos-anos'],
            {
              id: 'es.ex.iuzex000tkodi4',
            },
          ),
          ex.translateWrite(
            'I stayed at a hotel near the beach.',
            'Me quedé en un hotel cerca de la playa.',
            ['es-me-quede', 'es-el-hotel'],
            {
              id: 'es.ex.dqd701roqp2npz',
              acceptedAnswers: ['Yo me quedé en un hotel cerca de la playa.'],
            },
          ),
          ex.translateWrite('Where is my suitcase?', '¿Dónde está mi valija?', ['es-la-valija'], {
            id: 'es.ex.0pwq65iu116tkm',
            acceptedAnswers: ['¿Dónde está mi maleta?'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Mi primer viaje al extranjero',
        objective: 'Understand a postcard about a trip and talk about problems on a journey.',
        intro: {
          explanation:
            'In a postcard or a message about a trip, you say when you arrived, where you stayed and what happened: llegué el lunes, me quedé en un hotel, tuve un problema. Querida or querido (dear) opens a note to someone close, and un beso (a kiss) is the usual way to sign off. Pronunciation: the j, and the g before e or i, sound like a strong h (viaje, Argentina), but gue in llegué is a hard g.',
          examples: [
            { target: 'Llegué a Madrid el lunes.', base: 'I arrived in Madrid on Monday.' },
            {
              target: 'Tuve un problema con mi valija.',
              base: 'I had a problem with my suitcase.',
            },
          ],
        },
        takeaways: [
          'You understand a postcard about arrivals, hotels and problems.',
          'You use llegó, salió and tuve to say what happened on a journey.',
        ],
        exercises: [
          question(
            'es.ex.3yqtnqvj5wb2w0',
            POSTAL,
            'Why is this trip special for Tomás?',
            'It’s his first trip abroad',
            [
              'It’s his first flight',
              'He is travelling with his grandmother',
              'It’s his first stay at a hotel',
            ],
            ['es-el-extranjero'],
            'He writes “Este es mi primer viaje al extranjero”.',
          ),
          question(
            'es.ex.zygtkveuuzsxgk',
            POSTAL,
            'What happened to his suitcase?',
            'It arrived two days later',
            ['It arrived on time', 'He left it at the hotel', 'He never found it'],
            ['es-la-valija', 'es-a-tiempo'],
            'The flight left on time, “pero mi valija llegó dos días después”.',
          ),
          question(
            'es.ex.alo82v71ulh42u',
            POSTAL,
            'Where was his passport in the end?',
            'In his backpack',
            ['At the airport', 'In his suitcase', 'At the hotel'],
            ['es-el-pasaporte', 'es-tuve'],
            'He couldn’t find it, but then: “Después lo encontré en la mochila”.',
          ),
          ex.listenChoice(
            'Tuve un problema con el pasaporte.',
            [
              'Tuvo un problema con el pasaporte.',
              'Tuve un problema con la valija.',
              'Tengo un problema con el pasaporte.',
            ],
            ['es-tuve', 'es-el-pasaporte'],
            { id: 'es.ex.xogrk9jplft0m7' },
          ),
          ex.matchPairs(
            [
              ['llegué', 'I arrived'],
              ['tuve', 'I had'],
              ['el extranjero', 'abroad'],
              ['a tiempo', 'on time'],
            ],
            ['es-llegue', 'es-tuve', 'es-el-extranjero', 'es-a-tiempo'],
            { id: 'es.ex.8ucx334294ttsf' },
          ),
          ex.fillBlank(
            'Mi valija ___ dos días después.',
            'My suitcase arrived two days later.',
            'llegó',
            ['llegué', 'salí', 'vine'],
            ['es-llegue', 'es-la-valija'],
            {
              id: 'es.ex.zj6bqh5egcxfxw',
              explanation:
                'La valija is it, so you need the él / ella form: llegó. Llegué is I arrived.',
            },
          ),
          ex.fillBlank(
            'El año pasado ___ en el extranjero por primera vez.',
            'Last year I was abroad for the first time.',
            'estuve',
            ['tuve', 'vine'],
            ['es-estuve', 'es-el-extranjero'],
            {
              id: 'es.ex.7kbwhf1ujqnx27',
              explanation: 'Estar en un lugar → estuve en el extranjero (I was abroad).',
            },
          ),
          ex.orderWords(
            'El vuelo salió a tiempo.',
            'The flight left on time.',
            ['es-el-vuelo', 'es-a-tiempo'],
            {
              id: 'es.ex.spzkybjspngjms',
            },
          ),
          ex.shortAnswer(
            '¿Cuándo llegaste a Buenos Aires?',
            'Say you arrived two years ago (start with «Llegué»).',
            'Llegué hace dos años.',
            ['Hace dos años.', 'Llegué a Buenos Aires hace dos años.', 'Hace dos años que llegué.'],
            ['es-llegue', 'es-hace-dos-anos'],
            { id: 'es.ex.r9crg30bm8q8v9' },
          ),
          ex.translateWrite(
            'I came back from abroad on Sunday.',
            'Volví del extranjero el domingo.',
            ['es-volvi', 'es-el-extranjero'],
            { id: 'es.ex.u1jgtamvqig5e7', acceptedAnswers: ['El domingo volví del extranjero.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿Cómo fue el viaje?',
        objective: 'Understand a friend telling you about a trip and tell the story of your own.',
        intro: {
          explanation:
            'To ask a friend about a trip: ¿Cómo fue el viaje?, ¿Dónde estuviste?, ¿Cuánto tiempo te quedaste? For a group, use the nosotros forms; for -ar and -ir verbs they look like the present (salimos, nos quedamos), and the time words tell you it is the past. Bariloche, in Patagonia, is famous for its lakes and mountains, and for snow in July: winter in the southern hemisphere.',
          examples: [
            {
              target: '¿Cómo fue el viaje? — Muy lindo.',
              base: 'How was the trip? — Really nice.',
            },
            {
              target: 'Salimos el sábado y volvimos anoche.',
              base: 'We left on Saturday and came back last night.',
            },
          ],
        },
        takeaways: [
          'You follow a conversation about a trip told in the past.',
          'You tell a trip in order: when you left, where you stayed and when you came back.',
        ],
        exercises: [
          question(
            'es.ex.rcyp4eh7yxbny0',
            VACACIONES,
            'Where was Diego all week?',
            'In Bariloche with his family',
            [
              'In Bariloche with some friends',
              'In Mendoza with his family',
              'At home in Buenos Aires',
            ],
            ['es-estuve'],
            'Diego says “Estuve en Bariloche con mi familia”.',
          ),
          question(
            'es.ex.hvlj6klalb82zj',
            VACACIONES,
            'What went wrong on the trip?',
            'The flight arrived late',
            ['The flight arrived early', 'They lost a suitcase', 'The hotel was far from the lake'],
            ['es-el-vuelo', 'es-tarde'],
            'Diego says “El vuelo llegó tarde, pero la estadía fue muy linda”.',
          ),
          question(
            'es.ex.81nln6xmsi1p6x',
            VACACIONES,
            'Where did Diego and his family stay?',
            'In a hotel near the lake',
            ['In a hotel near the airport', 'In an apartment near the lake', 'At Camila’s house'],
            ['es-me-quede', 'es-el-hotel'],
            'He says “Nos quedamos en un hotel cerca del lago”.',
          ),
          question(
            'es.ex.i67ia1fkp0hgw7',
            VACACIONES,
            'When was Camila in Bariloche?',
            'Two years ago',
            ['Last week', 'Last year', 'She has never been there'],
            ['es-hace-dos-anos'],
            'Camila says “Yo fui a Bariloche hace dos años”.',
          ),
          ex.listenChoice(
            'Nos quedamos en un hotel cerca del lago.',
            [
              'Nos quedamos en un hotel cerca del aeropuerto.',
              'Me quedé en un hotel cerca del lago.',
              'Nos quedamos en un hotel lejos del lago.',
            ],
            ['es-me-quede', 'es-el-hotel'],
            { id: 'es.ex.ku6yr9ws20dhww' },
          ),
          ex.fillBlank(
            '¿Cuánto tiempo te ___ en Bariloche?',
            'How long did you stay in Bariloche?',
            'quedaste',
            ['quedé', 'quedamos'],
            ['es-me-quede'],
            {
              id: 'es.ex.b63oiqgyh11793',
              explanation: 'Te goes with the vos form: te quedaste. Me quedé is I stayed.',
            },
          ),
          ex.translationChoice(
            'la estadía',
            'the stay',
            ['the station', 'the suitcase', 'the flight'],
            ['es-la-estadia'],
            { id: 'es.ex.2sz1e2ckt61pno' },
          ),
          ex.shortAnswer(
            '¿Cómo fue el viaje?',
            'Say the flight arrived late but the stay was really nice (start with «El vuelo»).',
            'El vuelo llegó tarde, pero la estadía fue muy linda.',
            [
              'El vuelo llegó tarde pero la estadía fue muy linda.',
              'El vuelo llegó tarde, pero la estadía fue linda.',
              'El vuelo llegó tarde, pero la estadía fue muy buena.',
            ],
            ['es-el-vuelo', 'es-tarde', 'es-la-estadia'],
            { id: 'es.ex.gs4fei63whepac' },
          ),
          ex.translateWrite(
            'Two years ago I was in Bariloche and I stayed for a week.',
            'Hace dos años estuve en Bariloche y me quedé una semana.',
            ['es-hace-dos-anos', 'es-estuve', 'es-me-quede'],
            {
              id: 'es.ex.yioafhbx9tjhla',
              acceptedAnswers: [
                'Estuve en Bariloche hace dos años y me quedé una semana.',
                'Hace dos años estuve en Bariloche y me quedé por una semana.',
                'Hace dos años fui a Bariloche y me quedé una semana.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

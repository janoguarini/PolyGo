import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U3 «Anécdotas» (docs/B1_EN.md): repaso del past continuous; el past perfect (had + participio)
 * para lo que ya había pasado; conectores de secuencia (before/after + -ing, as soon as, by the time,
 * afterwards); cómo reaccionar y valorar una anécdota (lucky, unfortunately, embarrassed).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const TRAIN = dialogue('en.stim.b1-u3-train', 'Ben le cuenta a Lucy por qué llegó tarde.', [
  ['Lucy', 'Why were you so late yesterday?'],
  ['Ben', 'I missed the train. By the time I got to the station, it had already left.'],
  ['Lucy', 'Oh no! What did you do?'],
  ['Ben', 'I waited for the next one. Unfortunately, it was late too.'],
]);

const WRONG_PARTY = reading(
  'en.stim.b1-u3-party',
  'post',
  'Mia cuenta algo que le pasó el sábado.',
  [
    'On Saturday I went to my friend Rosa’s birthday party.',
    'When I arrived, the house was dark and quiet.',
    'I rang the bell, and Rosa opened the door in her pajamas.',
    'Then I realized that I had come on the wrong day. The party was the next Saturday!',
    'I was so embarrassed, but we laughed a lot.',
  ],
  { from: 'Mia', title: 'The wrong day' },
);

const LOST = dialogue('en.stim.b1-u3-lost', 'Kate cuenta un problema en un viaje.', [
  ['Kate', 'On our first day in Rome, we got lost.'],
  ['Kate', 'We wanted to use the map on my phone, but I had forgotten to charge it.'],
  ['Kate', 'Luckily, a woman saw us and showed us the way.'],
  ['Kate', 'As soon as we got to the hotel, I charged my phone!'],
]);

const OLD_FRIEND = reading(
  'en.stim.b1-u3-friend',
  'email',
  'Leo le escribe a su hermana.',
  [
    'Hi Emma,',
    'A strange thing happened today. I was having lunch in a restaurant when a man said my name.',
    'At first I didn’t recognize him. Then I realized it was Pedro, my best friend from school!',
    'I hadn’t seen him for fifteen years. Afterwards, we went for a coffee and talked for hours.',
    'Leo',
  ],
  { from: 'Leo', to: 'Emma', title: 'Guess who I saw!' },
);

export const EN_B1_U03: B1UnitDef = {
  names: ['Ben', 'Lucy', 'Mia', 'Rosa', 'Kate', 'Rome', 'Leo', 'Emma', 'Pedro'],
  support: ['bell', 'pajamas', 'wrong', 'thing', 'charge', 'showed', 'way', 'guess', 'oh', 'told'],
  unit: {
    position: 3,
    title: 'Anécdotas',
    titleEn: 'Anecdotes',
    description:
      'Contar anécdotas: lo que estaba pasando, lo que ya había pasado (had + participio) y el orden de los hechos.',
    emoji: '🗯️',
    objective:
      'Puedes contar una anécdota en orden, explicar qué ya había pasado y reaccionar a lo que te cuentan.',
    grammar: {
      title: 'Past perfect',
      explanation:
        'Had + participio cuenta algo que pasó ANTES de otro momento del pasado: When I got to the station, the train had left (el tren se fue antes de que yo llegara). Es igual para todas las personas: I had, she had, they had.',
      examples: [
        {
          target: 'When I arrived, the train had left.',
          base: 'Cuando llegué, el tren ya se había ido.',
        },
        {
          target: 'I realized I had forgotten my keys.',
          base: 'Me di cuenta de que me había olvidado las llaves.',
        },
        {
          target: 'By the time we got there, the movie had started.',
          base: 'Para cuando llegamos, la película había empezado.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-by-the-time',
        'by the time',
        'para cuando',
        '/baɪ ðə ˈtaɪm/',
        undefined,
        'By the time we arrived, the movie had started.',
        'Para cuando llegamos, la película había empezado.',
        ['stories', 'connectors'],
      ),
      w(
        'en-as-soon-as',
        'as soon as',
        'en cuanto / apenas',
        '/æz ˈsun æz/',
        undefined,
        'Call me as soon as you arrive.',
        'Llámame en cuanto llegues.',
        ['stories', 'connectors'],
        ['en cuanto', 'apenas', 'tan pronto como'],
      ),
      w(
        'en-before',
        'before',
        'antes (de)',
        '/bɪˈfɔr/',
        undefined,
        'Wash your hands before eating.',
        'Lávate las manos antes de comer.',
        ['stories', 'connectors'],
        ['antes', 'antes de'],
      ),
      w(
        'en-afterwards',
        'afterwards',
        'después / luego',
        '/ˈæftərwərdz/',
        undefined,
        'We watched a movie, and afterwards we had dinner.',
        'Vimos una película y después cenamos.',
        ['stories', 'connectors'],
        ['luego'],
      ),
      w(
        'en-the-day-before',
        'the day before',
        'el día anterior',
        '/ðə ˈdeɪ bɪˈfɔr/',
        undefined,
        'I had studied a lot the day before.',
        'Había estudiado mucho el día anterior.',
        ['stories', 'time'],
      ),
      w(
        'en-realized',
        'realized',
        'me di cuenta / se dio cuenta',
        '/ˈriəlaɪzd/',
        '💡',
        'I realized I had forgotten my bag.',
        'Me di cuenta de que me había olvidado el bolso.',
        ['stories', 'past'],
        ['me di cuenta', 'se dio cuenta'],
      ),
      w(
        'en-missed',
        'missed',
        'perdí (un transporte) / extrañé',
        '/mɪst/',
        undefined,
        'I missed the bus this morning.',
        'Perdí el autobús esta mañana.',
        ['stories', 'past'],
        ['perdí', 'extrañé'],
      ),
      w(
        'en-forgotten',
        'forgotten',
        'olvidado (forget)',
        '/fərˈɡɑtən/',
        undefined,
        'I had forgotten her birthday.',
        'Me había olvidado de su cumpleaños.',
        ['stories', 'participle'],
        ['olvidado'],
      ),
      w(
        'en-get-lost',
        'get lost',
        'perderse',
        '/ˈɡɛt ˈlɔst/',
        '🗺️',
        'It is easy to get lost in this city.',
        'Es fácil perderse en esta ciudad.',
        ['stories', 'travel'],
      ),
      w(
        'en-anecdote',
        'anecdote',
        'anécdota',
        '/ˈænɪkdoʊt/',
        undefined,
        'He told us a funny anecdote.',
        'Nos contó una anécdota graciosa.',
        ['stories'],
      ),
      w(
        'en-embarrassed',
        'embarrassed',
        'avergonzado / avergonzada',
        '/ɪmˈbærəst/',
        '😳',
        'I was very embarrassed.',
        'Estaba muy avergonzado.',
        ['stories', 'feelings'],
        ['con vergüenza', 'avergonzada'],
      ),
      w(
        'en-surprised',
        'surprised',
        'sorprendido / sorprendida',
        '/sərˈpraɪzd/',
        '😮',
        'We were surprised to see him.',
        'Nos sorprendió verlo.',
        ['stories', 'feelings'],
        ['sorprendida'],
      ),
      w(
        'en-strange',
        'strange',
        'raro / extraño',
        '/streɪndʒ/',
        undefined,
        'A strange thing happened.',
        'Pasó algo raro.',
        ['stories', 'adjectives'],
        ['raro', 'extraño'],
      ),
      w(
        'en-lucky',
        'lucky',
        'con suerte / afortunado',
        '/ˈlʌki/',
        '🍀',
        'You were very lucky!',
        '¡Tuviste mucha suerte!',
        ['stories', 'adjectives'],
        ['afortunado', 'afortunada'],
      ),
      w(
        'en-unfortunately',
        'unfortunately',
        'lamentablemente / por desgracia',
        '/ʌnˈfɔrtʃənətli/',
        undefined,
        'Unfortunately, it started to rain.',
        'Lamentablemente, empezó a llover.',
        ['stories'],
        ['lamentablemente', 'por desgracia', 'desafortunadamente'],
      ),
      w(
        'en-recognize',
        'recognize',
        'reconocer',
        '/ˈrɛkəɡnaɪz/',
        undefined,
        "I didn't recognize you!",
        '¡No te reconocí!',
        ['stories', 'verbs'],
      ),
      w(
        'en-eventually',
        'eventually',
        'al fin / con el tiempo',
        '/ɪˈvɛntʃuəli/',
        undefined,
        'Eventually, we found the hotel.',
        'Al fin encontramos el hotel.',
        ['stories', 'connectors'],
        ['al fin', 'con el tiempo'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'La escena',
        objective: 'Armar la escena de una anécdota con el past continuous y el past simple.',
        intro: {
          explanation:
            'Una anécdota suele empezar con la escena (past continuous: I was having lunch) y sigue con lo que pasó (past simple: when a man said my name). Para reaccionar: strange (raro), surprised (sorprendido), embarrassed (avergonzado).',
          examples: [
            {
              target: 'I was having lunch when a man said my name.',
              base: 'Estaba almorzando cuando un hombre dijo mi nombre.',
            },
            { target: 'A strange thing happened today.', base: 'Hoy pasó algo raro.' },
          ],
        },
        takeaways: [
          'Armas la escena con was/were + -ing y cuentas lo que pasó en past simple.',
          'Dices cómo te sentiste: surprised, embarrassed.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['strange', 'raro / extraño'],
              ['surprised', 'sorprendido / sorprendida'],
              ['embarrassed', 'avergonzado / avergonzada'],
              ['lucky', 'con suerte / afortunado'],
            ],
            ['en-strange', 'en-surprised', 'en-embarrassed', 'en-lucky'],
            { id: 'en.ex.i6tewmx45o1kb9' },
          ),
          ex.fillBlank(
            'I ___ lunch when a man said my name.',
            'Estaba almorzando cuando un hombre dijo mi nombre.',
            'was having',
            ['had', 'have had', 'am having'],
            ['en-was', 'en-lunch'],
            {
              id: 'en.ex.oy4ywbntaotq6u',
              explanation: 'La escena (lo que estaba pasando) va en past continuous.',
            },
          ),
          ex.fillBlank(
            'We were walking home when it ___ to rain.',
            'Volvíamos caminando a casa cuando empezó a llover.',
            'started',
            ['was starting', 'starts', 'has started'],
            ['en-start', 'en-rain'],
            { id: 'en.ex.z75zcad82eidsg' },
          ),
          ex.imageChoice('😳', 'embarrassed', ['surprised', 'lucky', 'proud'], ['en-embarrassed'], {
            id: 'en.ex.twlfczlqwfnubh',
          }),
          ex.fillBlank(
            'I was walking in the park when I ___ an old friend.',
            'Estaba caminando por el parque cuando vi a un viejo amigo.',
            'saw',
            ['was seeing', 'see', 'have seen'],
            ['en-saw', 'en-walk', 'en-park'],
            {
              id: 'en.ex.ltzy2id4f8ht65',
              explanation: 'Lo que interrumpe la escena va en past simple.',
            },
          ),
          ex.listenChoice(
            'We were surprised to see him.',
            [
              'We were happy to see him.',
              'We were surprised to see her.',
              'They were surprised to see him.',
            ],
            ['en-surprised', 'en-see'],
            { id: 'en.ex.4d5dad9k9vuoeb' },
          ),
          ex.shortAnswer(
            'How did you feel? (muy avergonzado)',
            '¿Cómo te sentiste?',
            'I was very embarrassed.',
            ['I felt very embarrassed.', 'Very embarrassed.', 'I was so embarrassed.'],
            ['en-embarrassed'],
            { id: 'en.ex.kcklqiqihxhmd4' },
          ),
          ex.translateWrite(
            'Hoy pasó algo raro.',
            'A strange thing happened today.',
            ['en-strange', 'en-happened'],
            {
              id: 'en.ex.6urnvsx0hpl5hj',
              acceptedAnswers: [
                'Something strange happened today.',
                'Today a strange thing happened.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lo que ya había pasado',
        objective: 'Contar algo que pasó antes de otro hecho del pasado con had + participio.',
        intro: {
          explanation:
            'Had + participio (past perfect) va con lo que pasó primero: When I got to the station, the train had left. By the time (para cuando) introduce el segundo momento: By the time we arrived, the movie had started.',
          examples: [
            {
              target: 'When I arrived, the train had left.',
              base: 'Cuando llegué, el tren se había ido.',
            },
            {
              target: 'I realized I had forgotten my keys.',
              base: 'Me di cuenta de que me había olvidado las llaves.',
            },
          ],
        },
        takeaways: [
          'Usas had + participio para lo que pasó antes.',
          'Ordenas dos momentos con by the time y when.',
        ],
        exercises: [
          ex.fillBlank(
            'When I got to the station, the train ___ left.',
            'Cuando llegué a la estación, el tren ya se había ido.',
            'had',
            ['has', 'was', 'did'],
            ['en-had', 'en-station', 'en-train'],
            {
              id: 'en.ex.85yviduzbqcn0u',
              explanation: 'Past perfect: had + participio para lo que pasó primero.',
            },
          ),
          ex.fillBlank(
            'I realized I had ___ my keys at home.',
            'Me di cuenta de que me había olvidado las llaves en casa.',
            'forgotten',
            ['forgot', 'forget', 'forgetting'],
            ['en-forgotten', 'en-realized', 'en-key'],
            {
              id: 'en.ex.93nu0hpt7km2fd',
              explanation: 'Forget: forgot (pasado), forgotten (participio).',
            },
          ),
          ex.fillBlank(
            '___ we arrived, the movie had started.',
            'Para cuando llegamos, la película había empezado.',
            'By the time',
            ['As soon as', 'Before', 'The day before'],
            ['en-by-the-time', 'en-movie'],
            { id: 'en.ex.9zoz92hrmqk8s3', skill: 'vocabulary' },
          ),
          question(
            'en.ex.7m479d06xmrxzz',
            TRAIN,
            '¿Por qué Ben perdió el tren?',
            'Cuando llegó a la estación, el tren ya se había ido',
            ['El tren no llegó', 'Se olvidó del horario', 'Se quedó dormido'],
            ['en-missed', 'en-by-the-time'],
            'Ben dice: «By the time I got to the station, it had already left».',
          ),
          question(
            'en.ex.mxq8jzlu25br58',
            TRAIN,
            '¿Qué pasó con el tren siguiente?',
            'También llegó tarde',
            ['Llegó temprano', 'No vino', 'Estaba lleno'],
            ['en-unfortunately', 'en-late'],
            'Ben dice: «Unfortunately, it was late too».',
          ),
          ex.listenChoice(
            'I realized I had forgotten my bag.',
            [
              'I realized I had forgotten my keys.',
              'I realized I forgot my bag.',
              'I knew I had forgotten my bag.',
            ],
            ['en-realized', 'en-forgotten', 'en-bag'],
            { id: 'en.ex.kbm4tttiqb0bvw' },
          ),
          ex.orderWords(
            'The movie had started by the time we arrived.',
            'La película había empezado para cuando llegamos.',
            ['en-by-the-time', 'en-arrive', 'en-movie'],
            { id: 'en.ex.9h2m7am6um3cg2' },
          ),
          ex.shortAnswer(
            'Why were you late? (perdiste el autobús)',
            '¿Por qué llegaste tarde?',
            'I missed the bus.',
            ['Because I missed the bus.', 'I had missed the bus.'],
            ['en-missed', 'en-bus'],
            { id: 'en.ex.q4q7takt80sylb' },
          ),
          ex.translateWrite(
            'Cuando llegué, la clase había empezado.',
            'When I arrived, the class had started.',
            ['en-had', 'en-arrive'],
            {
              id: 'en.ex.9or0jbkouvupv1',
              acceptedAnswers: [
                'When I arrived, the class had already started.',
                'When I got there, the class had started.',
                'The class had started when I arrived.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Antes, después y apenas',
        objective: 'Ordenar los hechos con before, after, as soon as, afterwards y the day before.',
        intro: {
          explanation:
            'Before y after pueden ir con -ing: before eating, after finishing. As soon as es «apenas, en cuanto»: As soon as I got home, I called you. Afterwards (después) y the day before (el día anterior) también ordenan una historia.',
          examples: [
            {
              target: 'As soon as I got home, I called you.',
              base: 'Apenas llegué a casa, te llamé.',
            },
            {
              target: 'We watched a movie, and afterwards we had dinner.',
              base: 'Vimos una película y después cenamos.',
            },
          ],
        },
        takeaways: [
          'Ordenas hechos con before, after y as soon as.',
          'Usas afterwards y the day before para avanzar o volver en la historia.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['before', 'antes (de)'],
              ['afterwards', 'después / luego'],
              ['as soon as', 'en cuanto / apenas'],
              ['the day before', 'el día anterior'],
            ],
            ['en-before', 'en-afterwards', 'en-as-soon-as', 'en-the-day-before'],
            { id: 'en.ex.jcja7l5a5i3cv5' },
          ),
          ex.fillBlank(
            'Wash your hands before ___.',
            'Lávate las manos antes de comer.',
            'eating',
            ['eat', 'to eat', 'ate'],
            ['en-before', 'en-eat'],
            {
              id: 'en.ex.qihmuc963yc6aw',
              explanation: 'Después de before y after, el verbo va con -ing.',
            },
          ),
          ex.fillBlank(
            '___ I got home, I called you.',
            'Apenas llegué a casa, te llamé.',
            'As soon as',
            ['Before', 'Afterwards', 'The day before'],
            ['en-as-soon-as', 'en-call'],
            { id: 'en.ex.cl7aqntiu9nger', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I was tired because I ___ badly the night before.',
            'Estaba cansado porque había dormido mal la noche anterior.',
            'had slept',
            ['have slept', 'sleep', 'was sleeping'],
            ['en-slept', 'en-tired'],
            { id: 'en.ex.1njupuj3kzoucq' },
          ),
          question(
            'en.ex.zl0nv0q4udfah7',
            LOST,
            '¿Por qué no pudieron usar el mapa del teléfono?',
            'Kate se había olvidado de cargar el teléfono',
            ['No había internet', 'El teléfono se rompió', 'Perdieron el teléfono'],
            ['en-forgotten', 'en-phone', 'en-map'],
            'Kate dice: «I had forgotten to charge it».',
          ),
          question(
            'en.ex.b7vlhq2nrr5izn',
            LOST,
            '¿Qué hizo Kate apenas llegaron al hotel?',
            'Cargó el teléfono',
            ['Llamó a su familia', 'Compró un mapa', 'Se fue a dormir'],
            ['en-as-soon-as', 'en-hotel'],
            'Kate dice: «As soon as we got to the hotel, I charged my phone!».',
          ),
          ex.listenChoice(
            'We watched a movie, and afterwards we had dinner.',
            [
              'We watched a movie, and before that we had dinner.',
              'We watched a movie, and afterwards we had lunch.',
              'We made a movie, and afterwards we had dinner.',
            ],
            ['en-afterwards', 'en-dinner'],
            { id: 'en.ex.rbc813bbq5w6ec' },
          ),
          ex.translateWrite(
            'Llámame en cuanto llegues.',
            'Call me as soon as you arrive.',
            ['en-as-soon-as', 'en-call', 'en-arrive'],
            {
              id: 'en.ex.tgn4yu81ltv4wx',
              acceptedAnswers: [
                'Call me as soon as you get there.',
                'Call me as soon as you get here.',
              ],
            },
          ),
          ex.translateWrite(
            'Había estudiado mucho el día anterior.',
            'I had studied a lot the day before.',
            ['en-the-day-before', 'en-study'],
            {
              id: 'en.ex.dcrlvwqglh773c',
              acceptedAnswers: [
                'The day before, I had studied a lot.',
                'She had studied a lot the day before.',
                'He had studied a lot the day before.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Por suerte, por desgracia',
        objective: 'Contar contratiempos: perderse, perder el tren, darse cuenta de algo.',
        intro: {
          explanation:
            'Unfortunately (lamentablemente) presenta lo malo y luckily (por suerte), lo bueno. Miss es perder un transporte (I missed the bus); get lost es perderse. Realize es darse cuenta: I realized I had lost my keys.',
          examples: [
            { target: 'Unfortunately, we got lost.', base: 'Lamentablemente, nos perdimos.' },
            {
              target: 'Luckily, a woman showed us the way.',
              base: 'Por suerte, una mujer nos indicó el camino.',
            },
          ],
        },
        takeaways: [
          'Cuentas contratiempos: I missed the bus, we got lost.',
          'Presentas lo malo y lo bueno: unfortunately, luckily.',
        ],
        exercises: [
          ex.translationChoice(
            'unfortunately',
            'lamentablemente / por desgracia',
            ['por suerte', 'de repente', 'al principio'],
            ['en-unfortunately'],
            { id: 'en.ex.zi5y6t74pphdgq' },
          ),
          ex.fillBlank(
            "It's easy to ___ in this city.",
            'Es fácil perderse en esta ciudad.',
            'get lost',
            ['lose', 'missed', 'forget'],
            ['en-get-lost', 'en-city'],
            { id: 'en.ex.d8ts0naqkvd7fy', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I ___ the bus this morning, so I was late.',
            'Perdí el autobús esta mañana, así que llegué tarde.',
            'missed',
            ['lost', 'forgot', 'left'],
            ['en-missed', 'en-bus'],
            {
              id: 'en.ex.tokg2mjowb4r48',
              skill: 'vocabulary',
              explanation:
                'Un transporte se pierde con miss: I missed the bus. Lose es perder un objeto.',
            },
          ),
          question(
            'en.ex.6zri40c81f9w7k',
            WRONG_PARTY,
            '¿Qué error cometió Mia?',
            'Fue a la fiesta el día equivocado',
            ['Se olvidó del regalo', 'Se perdió en el camino', 'Llegó muy tarde'],
            ['en-realized', 'en-party'],
            'Mia escribe: «I realized that I had come on the wrong day».',
          ),
          question(
            'en.ex.f46oz2tybnw3gc',
            WRONG_PARTY,
            '¿Cómo se sintió Mia?',
            'Muy avergonzada',
            ['Enojada', 'Asustada', 'Aburrida'],
            ['en-embarrassed'],
            'Mia escribe: «I was so embarrassed, but we laughed a lot».',
          ),
          ex.listenChoice(
            'You were very lucky!',
            ['You were very late!', 'She was very lucky!', 'We were very lucky!'],
            ['en-lucky'],
            { id: 'en.ex.3y2dxs4akm1z3i' },
          ),
          ex.orderWords(
            'Unfortunately we missed the last bus.',
            'Lamentablemente perdimos el último autobús.',
            ['en-unfortunately', 'en-missed', 'en-bus'],
            { id: 'en.ex.h4ks1bhk1jo0ba' },
          ),
          ex.translateWrite('Nos perdimos en Roma.', 'We got lost in Rome.', ['en-get-lost'], {
            id: 'en.ex.t9u2tqyilbp32u',
            acceptedAnswers: ['We got lost in Roma.'],
          }),
          ex.translateWrite(
            'Me di cuenta de que había perdido la llave.',
            'I realized I had lost the key.',
            ['en-realized', 'en-lost', 'en-key'],
            {
              id: 'en.ex.rtjb3xzsml2mbn',
              acceptedAnswers: [
                'I realized that I had lost the key.',
                'I realized I had lost my key.',
                'I realized that I had lost my key.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Tu anécdota',
        objective: 'Contar una anécdota completa, con escena, hechos ordenados y final.',
        intro: {
          explanation:
            'Una buena anécdota tiene escena (was/were + -ing), hechos (past simple), lo que ya había pasado (had + participio) y un final (eventually, in the end). Recognize es reconocer a alguien.',
          examples: [
            { target: "At first I didn't recognize him.", base: 'Al principio no lo reconocí.' },
            { target: 'Eventually, we found the hotel.', base: 'Al fin encontramos el hotel.' },
          ],
        },
        takeaways: [
          'Cuentas una anécdota completa y ordenada.',
          'Cierras la historia: eventually, in the end.',
        ],
        exercises: [
          ex.translationChoice(
            'anecdote',
            'anécdota',
            ['aventura', 'recuerdo / memoria', 'historia / cuento'],
            ['en-anecdote'],
            { id: 'en.ex.vb6w3vjiq174mi' },
          ),
          question(
            'en.ex.u9vtl39impegud',
            OLD_FRIEND,
            '¿Por qué Leo no reconoció a Pedro al principio?',
            'No lo veía desde hacía quince años',
            ['Pedro tenía lentes', 'Leo no lo conocía', 'Había mucha gente'],
            ['en-recognize'],
            'Leo escribe: «I hadn’t seen him for fifteen years».',
          ),
          question(
            'en.ex.6setsbnu2m8sjv',
            OLD_FRIEND,
            '¿Qué hicieron después?',
            'Fueron a tomar un café y charlaron horas',
            ['Almorzaron juntos', 'Fueron a la escuela', 'Se despidieron enseguida'],
            ['en-afterwards', 'en-talk'],
            'Leo escribe: «Afterwards, we went for a coffee and talked for hours».',
          ),
          ex.fillBlank(
            "At first I didn't ___ him.",
            'Al principio no lo reconocí.',
            'recognize',
            ['forget', 'lose', 'understand'],
            ['en-recognize', 'en-at-first'],
            { id: 'en.ex.b8f5m76t3hwmh1', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            '___, we found the hotel.',
            'Al fin encontramos el hotel.',
            'Eventually',
            ['Before', 'Unfortunately', 'The day before'],
            ['en-eventually', 'en-found', 'en-hotel'],
            { id: 'en.ex.8d3otrzylxz20x', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'He told us a funny anecdote.',
            [
              'He told us a funny story.',
              'He told us a sad anecdote.',
              'She told us a funny anecdote.',
            ],
            ['en-anecdote', 'en-funny'],
            { id: 'en.ex.w180vjksbi9zg1' },
          ),
          ex.orderWords(
            "I hadn't seen him for years.",
            'No lo veía desde hacía años.',
            ['en-seen', 'en-for'],
            { id: 'en.ex.4v9faxzt53c3kg' },
          ),
          ex.shortAnswer(
            'What happened in the end? (al fin encontraron el hotel)',
            '¿Qué pasó al final?',
            'Eventually, we found the hotel.',
            [
              'We found the hotel.',
              'In the end, we found the hotel.',
              'Eventually we found the hotel.',
            ],
            ['en-eventually', 'en-found'],
            { id: 'en.ex.5etzssi39zekdw' },
          ),
          ex.translateWrite('¡No te reconocí!', "I didn't recognize you!", ['en-recognize'], {
            id: 'en.ex.74p9k794tn6zya',
            acceptedAnswers: ['I did not recognize you!', "I didn't recognise you!"],
          }),
        ],
      },
    ],
  },
};

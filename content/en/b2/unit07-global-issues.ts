import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U7 «Medioambiente y problemas globales» (docs/B2_EN.md): el calentamiento global, sequías e
 * inundaciones, energía renovable y sostenibilidad, pobreza y especies en peligro. Estructura
 * principal: concesivas y contraste (despite, in spite of, even though, even if, whereas).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const DROUGHT = dialogue(
  'en.stim.b2-u7-drought',
  'Un informe de radio sobre la sequía en una región agrícola.',
  [
    [
      'Presenter',
      "We go now to Paula, who is in the south, where there hasn't been any real rain for eight months.",
    ],
    [
      'Paula',
      'Thanks. This is the worst drought in fifty years. Despite the storms last week, the rivers are still very low.',
    ],
    ['Presenter', 'How are farmers dealing with it?'],
    [
      'Paula',
      'With great difficulty. Even though they have reduced their water use, many have lost half of their crops. And there is now a water shortage in three towns.',
    ],
    ['Presenter', 'Is this connected to global warming?'],
    [
      'Paula',
      'Scientists say yes. Ironically, two years ago this same region suffered terrible floods. Extreme weather, in both directions, is a direct consequence of a warmer planet.',
    ],
  ],
);

const FOOTPRINT = reading(
  'en.stim.b2-u7-footprint',
  'post',
  'Un artículo de opinión sobre la huella de carbono.',
  [
    'We are constantly told to reduce our carbon footprint: take shorter showers, eat less meat, fly less. These things matter, but they are not enough.',
    'Just one hundred companies are responsible for most of the world’s emissions. Whereas a single family can save a few tons of CO2 a year, one large factory can produce millions.',
    'This does not mean that individual action is useless. Even if your own impact is small, your choices send a message to companies and governments.',
    'The real solution is a fast move to renewable energy, such as solar and wind. Only governments can make that happen, and only if we vote for it.',
  ],
  { title: 'Your shower will not save the planet' },
);

const STUDENTS = dialogue(
  'en.stim.b2-u7-students',
  'Dos estudiantes discuten si una persona puede ayudar al planeta.',
  [
    ['Noah', "I've stopped flying. In spite of the price, I take the train to visit my family."],
    [
      'Mia',
      "That's great, but honestly, it won't change anything. Even if everyone in this city stopped flying, it would be a tiny difference.",
    ],
    ['Noah', "I don't agree. Big changes always start with small groups of people."],
    [
      'Mia',
      'Maybe. But we need to tackle the real causes: coal, oil, and the way we produce food.',
    ],
    ['Noah', 'Sure, but those things change when people demand something different.'],
    [
      'Mia',
      "OK, that's a fair point. So we both want a sustainable future. We just disagree about how to get there.",
    ],
  ],
);

const REPORT = reading(
  'en.stim.b2-u7-report',
  'notice',
  'Un resumen de un informe de una organización ambiental.',
  [
    'Key findings of our annual report:',
    'More than one million species are endangered, mainly because of the loss of forests and the pollution of oceans.',
    'Climate change is a growing threat not only to nature, but to people. Floods and droughts hit the poorest countries hardest, even though they produce the lowest emissions.',
    'Poverty and the environment are connected: when people are poor, they often have no choice but to cut down forests to survive.',
    'Despite these problems, there is good news. Several species have been saved in the last ten years, which shows that action works.',
  ],
  { title: 'Our planet: 2026 report' },
);

export const EN_B2_U07: B2UnitDef = {
  names: ['Paula', 'Noah', 'Mia', 'Presenter', 'CO'],
  support: [
    'south',
    'region',
    'panda',
    'animal',
    'destroy',
    'town',
    'farmers',
    'dealing',
    'difficulty',
    'reduced',
    'crops',
    'towns',
    'connected',
    'ironically',
    'suffered',
    'extreme',
    'directions',
    'direct',
    'constantly',
    'showers',
    'fly',
    'companies',
    'single',
    'tons',
    'factory',
    'millions',
    'individual',
    'action',
    'impact',
    'choices',
    'governments',
    'solar',
    'wind',
    'happen',
    'flying',
    'tiny',
    'difference',
    'groups',
    'causes',
    'coal',
    'oil',
    'demand',
    'findings',
    'annual',
    'species',
    'loss',
    'oceans',
    'nature',
    'hit',
    'poorest',
    'hardest',
    'lowest',
    'poor',
    'choice',
    'survive',
    'several',
  ],
  unit: {
    position: 7,
    title: 'Medioambiente y problemas globales',
    titleEn: 'The environment and global issues',
    description:
      'El calentamiento global, sequías e inundaciones, energía renovable, pobreza y especies en peligro, y el contraste con despite, even though y whereas.',
    emoji: '🌍',
    objective:
      'Puedes hablar de problemas ambientales y globales, sus causas y consecuencias, y matizar con despite, even though y whereas.',
    grammar: {
      title: 'Concesivas y contraste',
      explanation:
        'Despite / in spite of + sustantivo o -ing (a pesar de): Despite the storms, the rivers are low. Even though + oración (aunque, a pesar de que), más fuerte que although: Even though they saved water, they lost their crops. Even if + oración (aun si, incluso si): una condición que no cambia el resultado. Whereas (mientras que) compara dos hechos opuestos.',
      examples: [
        {
          target: 'Despite the storms last week, the rivers are still very low.',
          base: 'A pesar de las tormentas de la semana pasada, los ríos siguen muy bajos.',
        },
        {
          target: 'Even if everyone stopped flying, it would be a tiny difference.',
          base: 'Aun si todos dejaran de volar, sería una diferencia mínima.',
        },
        {
          target: 'A family can save a few tons, whereas a factory can produce millions.',
          base: 'Una familia puede ahorrar unas toneladas, mientras que una fábrica puede producir millones.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-global-warming',
        'global warming',
        'calentamiento global',
        '/ˌɡloʊbəl ˈwɔrmɪŋ/',
        '🌡️',
        'Global warming is changing the weather.',
        'El calentamiento global está cambiando el clima.',
        ['environment'],
      ),
      w(
        'en-emissions',
        'emissions',
        'emisiones',
        '/ɪˈmɪʃənz/',
        '🏭',
        'Cars produce a lot of emissions.',
        'Los autos producen muchas emisiones.',
        ['environment'],
      ),
      w(
        'en-carbon-footprint',
        'carbon footprint',
        'huella de carbono',
        '/ˈkɑrbən ˈfʊtˌprɪnt/',
        '👣',
        'Eating less meat reduces your carbon footprint.',
        'Comer menos carne reduce tu huella de carbono.',
        ['environment', 'collocations'],
      ),
      w(
        'en-consequence',
        'consequence',
        'consecuencia',
        '/ˈkɑnsəˌkwɛns/',
        undefined,
        'Floods are a consequence of global warming.',
        'Las inundaciones son una consecuencia del calentamiento global.',
        ['environment', 'connectors'],
      ),
      w(
        'en-drought',
        'drought',
        'sequía',
        '/draʊt/',
        '🏜️',
        'It is the worst drought in fifty years.',
        'Es la peor sequía en cincuenta años.',
        ['environment', 'weather'],
      ),
      w(
        'en-flood',
        'flood',
        'inundación',
        '/flʌd/',
        '🌊',
        'The flood destroyed many homes.',
        'La inundación destruyó muchas casas.',
        ['environment', 'weather'],
      ),
      w(
        'en-shortage',
        'shortage',
        'escasez / falta',
        '/ˈʃɔrtɪdʒ/',
        undefined,
        'There is a water shortage in three towns.',
        'Hay escasez de agua en tres pueblos.',
        ['environment'],
        ['escasez', 'falta'],
      ),
      w(
        'en-threat',
        'threat',
        'amenaza',
        '/θrɛt/',
        '⚠️',
        'Climate change is a threat to people and nature.',
        'El cambio climático es una amenaza para las personas y la naturaleza.',
        ['environment'],
      ),
      w(
        'en-despite',
        'despite',
        'a pesar de',
        '/dɪˈspaɪt/',
        undefined,
        'Despite the rain, we went for a walk.',
        'A pesar de la lluvia, salimos a caminar.',
        ['contrast', 'connectors'],
      ),
      w(
        'en-in-spite-of',
        'in spite of',
        'pese a',
        '/ɪn ˈspaɪt əv/',
        undefined,
        'In spite of the price, I take the train.',
        'Pese al precio, tomo el tren.',
        ['contrast', 'connectors'],
      ),
      w(
        'en-even-though',
        'even though',
        'a pesar de que / aun cuando',
        '/ˈivən ˈðoʊ/',
        undefined,
        'Even though I was tired, I finished the report.',
        'A pesar de que estaba cansado, terminé el informe.',
        ['contrast', 'connectors'],
        ['a pesar de que', 'aun cuando'],
      ),
      w(
        'en-even-if',
        'even if',
        'aun si / incluso si',
        '/ˈivən ˈɪf/',
        undefined,
        'Even if it rains, the game will go ahead.',
        'Aun si llueve, el partido se va a jugar.',
        ['contrast', 'connectors'],
        ['aun si', 'incluso si'],
      ),
      w(
        'en-whereas',
        'whereas',
        'mientras que',
        '/wɛrˈæz/',
        undefined,
        'I love the city, whereas my brother prefers the country.',
        'A mí me encanta la ciudad, mientras que mi hermano prefiere el campo.',
        ['contrast', 'connectors'],
      ),
      w(
        'en-renewable',
        'renewable',
        'renovable',
        '/rɪˈnuəbəl/',
        '☀️',
        'We need more renewable energy.',
        'Necesitamos más energía renovable.',
        ['environment', 'adjectives'],
      ),
      w(
        'en-sustainable',
        'sustainable',
        'sostenible / sustentable',
        '/səˈsteɪnəbəl/',
        '🌱',
        'We all want a sustainable future.',
        'Todos queremos un futuro sostenible.',
        ['environment', 'adjectives'],
        ['sostenible', 'sustentable'],
      ),
      w(
        'en-tackle',
        'tackle',
        'abordar / enfrentar (un problema)',
        '/ˈtækəl/',
        undefined,
        'We need to tackle the real causes of the problem.',
        'Tenemos que enfrentar las verdaderas causas del problema.',
        ['environment', 'verbs'],
        ['abordar', 'enfrentar', 'combatir'],
      ),
      w(
        'en-poverty',
        'poverty',
        'pobreza',
        '/ˈpɑvərti/',
        undefined,
        'Poverty and the environment are connected.',
        'La pobreza y el medioambiente están relacionados.',
        ['global-issues'],
      ),
      w(
        'en-endangered',
        'endangered',
        'en peligro de extinción',
        '/ɪnˈdeɪndʒərd/',
        '🐼',
        'The panda is an endangered animal.',
        'El panda es un animal en peligro de extinción.',
        ['environment', 'adjectives'],
        ['en peligro'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Un planeta más caliente',
        objective: 'Hablar del calentamiento global, las emisiones y sus consecuencias.',
        intro: {
          explanation:
            'Global warming es el calentamiento global, causado sobre todo por las emissions (emisiones) de CO2. Tu carbon footprint es tu huella de carbono: cuánto contaminas con lo que haces. Una consequence es una consecuencia: Floods are a consequence of global warming.',
          examples: [
            {
              target: 'Global warming is changing the weather.',
              base: 'El calentamiento global está cambiando el clima.',
            },
            {
              target: 'Eating less meat reduces your carbon footprint.',
              base: 'Comer menos carne reduce tu huella de carbono.',
            },
          ],
        },
        takeaways: [
          'Hablas del calentamiento global y las emisiones.',
          'Explicas tu huella de carbono y las consecuencias.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['global warming', 'calentamiento global'],
              ['emissions', 'emisiones'],
              ['carbon footprint', 'huella de carbono'],
              ['consequence', 'consecuencia'],
            ],
            ['en-global-warming', 'en-emissions', 'en-carbon-footprint', 'en-consequence'],
            { id: 'en.ex.o1eyc58r2ntqck' },
          ),
          ex.fillBlank(
            'Eating less meat reduces your carbon ___.',
            'Comer menos carne reduce tu huella de carbono.',
            'footprint',
            ['step', 'warming', 'size'],
            ['en-carbon-footprint'],
            { id: 'en.ex.hffoyqykkypaz3', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Extreme weather is a ___ of global warming.',
            'El clima extremo es una consecuencia del calentamiento global.',
            'consequence',
            ['emissions', 'footprint', 'solution'],
            ['en-consequence'],
            { id: 'en.ex.huphs0r7yk1n5x', skill: 'vocabulary' },
          ),
          question(
            'en.ex.rsgdq6857wa1ea',
            FOOTPRINT,
            '¿Cuál es la idea principal del artículo?',
            'Que los cambios individuales ayudan, pero no alcanzan sin cambios grandes',
            [
              'Que las duchas cortas salvan el planeta',
              'Que no hay que hacer nada',
              'Que las empresas no contaminan',
            ],
            ['en-carbon-footprint', 'en-emissions', 'en-renewable'],
            'El artículo dice: «These things matter, but they are not enough» y propone el paso a la energía renovable.',
          ),
          question(
            'en.ex.557qpsnak7lrrd',
            FOOTPRINT,
            '¿Qué compara el autor con whereas?',
            'Lo que ahorra una familia con lo que produce una fábrica',
            ['Dos tipos de energía', 'Dos países', 'La carne y el pescado'],
            ['en-whereas', 'en-emissions'],
            'El artículo dice: «Whereas a single family can save a few tons of CO2 a year, one large factory can produce millions».',
          ),
          ex.listenChoice(
            'Global warming is changing the weather.',
            [
              'Global warming is changing the world.',
              'Global warming has changed the weather.',
              'Pollution is changing the weather.',
            ],
            ['en-global-warming'],
            { id: 'en.ex.qctt9jg6cfk7gm' },
          ),
          ex.orderWords(
            'Cars produce a lot of emissions.',
            'Los autos producen muchas emisiones.',
            ['en-emissions'],
            { id: 'en.ex.mfnqp7og820s7z' },
          ),
          ex.shortAnswer(
            'How can you reduce your carbon footprint? (comer menos carne)',
            '¿Cómo puedes reducir tu huella de carbono?',
            'I can eat less meat.',
            ['By eating less meat.', 'Eat less meat.', 'I can reduce it by eating less meat.'],
            ['en-carbon-footprint'],
            { id: 'en.ex.wcfj7sh1tj9nco' },
          ),
          ex.translateWrite(
            'El calentamiento global está cambiando el clima.',
            'Global warming is changing the weather.',
            ['en-global-warming'],
            {
              id: 'en.ex.sf1j4mvlillucm',
              acceptedAnswers: [
                'Global warming is changing the climate.',
                "Global warming's changing the weather.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Sequías e inundaciones',
        objective: 'Entender una noticia sobre sequías, inundaciones y escasez.',
        intro: {
          explanation:
            'A drought es una sequía; a flood, una inundación. A shortage es la escasez o la falta de algo: a water shortage. A threat es una amenaza. Las noticias suelen usar el present perfect: There hasn’t been any rain for eight months.',
          examples: [
            {
              target: 'It is the worst drought in fifty years.',
              base: 'Es la peor sequía en cincuenta años.',
            },
            {
              target: 'There is a water shortage in three towns.',
              base: 'Hay escasez de agua en tres pueblos.',
            },
          ],
        },
        takeaways: [
          'Entiendes noticias sobre sequías, inundaciones y escasez.',
          'Hablas de amenazas y consecuencias del clima extremo.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['drought', 'sequía'],
              ['flood', 'inundación'],
              ['shortage', 'escasez / falta'],
              ['threat', 'amenaza'],
            ],
            ['en-drought', 'en-flood', 'en-shortage', 'en-threat'],
            { id: 'en.ex.v0r74e2z2open0' },
          ),
          ex.imageChoice('🏜️', 'drought', ['flood', 'storm', 'snow'], ['en-drought'], {
            id: 'en.ex.lb9p7cbsm614pw',
          }),
          ex.fillBlank(
            'There is a water ___ in three towns.',
            'Hay escasez de agua en tres pueblos.',
            'shortage',
            ['drought', 'threat', 'flood'],
            ['en-shortage'],
            { id: 'en.ex.s2n2c3cwl44zp2', skill: 'vocabulary' },
          ),
          question(
            'en.ex.t9ukk2cc3s5deb',
            DROUGHT,
            '¿Por qué los ríos siguen bajos?',
            'Porque las tormentas de la semana pasada no alcanzaron después de ocho meses sin lluvia',
            [
              'Porque los agricultores usan demasiada agua',
              'Porque hubo inundaciones',
              'Porque cerraron una represa',
            ],
            ['en-drought', 'en-despite'],
            'Paula dice: «This is the worst drought in fifty years. Despite the storms last week, the rivers are still very low».',
          ),
          question(
            'en.ex.v2ief0lo3hj01r',
            DROUGHT,
            '¿Qué tiene de irónico la situación, según Paula?',
            'Que hace dos años la misma región sufrió inundaciones terribles',
            [
              'Que nunca había llovido tanto',
              'Que los agricultores ganaron más',
              'Que los científicos no saben la causa',
            ],
            ['en-flood', 'en-consequence', 'en-global-warming'],
            'Paula dice: «Ironically, two years ago this same region suffered terrible floods».',
          ),
          question(
            'en.ex.mjmh131toer7vg',
            REPORT,
            '¿A quiénes afectan más las sequías y las inundaciones, según el informe?',
            'A los países más pobres, aunque son los que menos contaminan',
            ['A los países más ricos', 'A las grandes empresas', 'A todos por igual'],
            ['en-threat', 'en-even-though', 'en-poverty', 'en-endangered'],
            'El informe dice: «Floods and droughts hit the poorest countries hardest, even though they produce the lowest emissions».',
          ),
          ex.listenChoice(
            'The flood destroyed many homes.',
            [
              'The flood destroyed many roads.',
              'The storm destroyed many homes.',
              'The floods destroyed a few homes.',
            ],
            ['en-flood'],
            { id: 'en.ex.gd6hhdor1njoxc' },
          ),
          ex.shortAnswer(
            'Why is there no water in the town? (por la sequía)',
            '¿Por qué no hay agua en el pueblo?',
            'Because of the drought.',
            [
              'Because there is a drought.',
              "It's because of the drought.",
              'Because of the drought, there is no water.',
            ],
            ['en-drought'],
            { id: 'en.ex.y5be3ckuv6wvl6' },
          ),
          ex.translateWrite(
            'Es la peor sequía en cincuenta años.',
            'It is the worst drought in fifty years.',
            ['en-drought'],
            {
              id: 'en.ex.9i8lh3blmamc68',
              acceptedAnswers: [
                "It's the worst drought in fifty years.",
                'This is the worst drought in fifty years.',
                'It is the worst drought in 50 years.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'A pesar de todo',
        objective: 'Contrastar ideas con despite, in spite of, even though y even if.',
        intro: {
          explanation:
            'Despite e in spite of van con un sustantivo o con -ing: Despite the rain… / In spite of feeling tired… Even though va con una oración completa y es más enfático que although: Even though I was tired, I finished. Even if es «aun si»: el resultado no cambia aunque se cumpla la condición.',
          examples: [
            {
              target: 'Despite the rain, we went for a walk.',
              base: 'A pesar de la lluvia, salimos a caminar.',
            },
            {
              target: 'Even if it rains, the game will go ahead.',
              base: 'Aun si llueve, el partido se va a jugar.',
            },
          ],
        },
        takeaways: [
          'Usas despite / in spite of con un sustantivo o -ing.',
          'Usas even though y even if con una oración.',
        ],
        exercises: [
          ex.fillBlank(
            '___ the rain, we went for a walk.',
            'A pesar de la lluvia, salimos a caminar.',
            'Despite',
            ['Even though', 'Although', 'Even if'],
            ['en-despite'],
            {
              id: 'en.ex.25v2chswjwwajx',
              explanation:
                'Despite + sustantivo (the rain). Even though y although van con una oración.',
            },
          ),
          ex.fillBlank(
            '___ I was tired, I finished the report.',
            'A pesar de que estaba cansado, terminé el informe.',
            'Even though',
            ['Despite', 'In spite of', 'Whereas'],
            ['en-even-though'],
            {
              id: 'en.ex.zo3cj3vowocxmk',
              explanation: 'Even though + oración completa (I was tired).',
            },
          ),
          ex.fillBlank(
            'In spite ___ the price, I take the train.',
            'Pese al precio, tomo el tren.',
            'of',
            ['to', 'for', 'that'],
            ['en-in-spite-of', 'en-tackle', 'en-sustainable'],
            {
              id: 'en.ex.cbqbw04zlxwnzs',
              skill: 'vocabulary',
              explanation: 'In spite of (con of); despite va sin of.',
            },
          ),
          ex.fillBlank(
            '___ it rains, the game will go ahead.',
            'Aun si llueve, el partido se va a jugar.',
            'Even if',
            ['Despite', 'Whereas', 'In spite of'],
            ['en-even-if'],
            { id: 'en.ex.bto59oiexyfms3' },
          ),
          question(
            'en.ex.ll65amljwisftn',
            STUDENTS,
            '¿Qué hace Noah a pesar del precio?',
            'Viaja en tren para visitar a su familia en vez de volar',
            [
              'Vuela menos de vacaciones',
              'Usa la bici para ir a la facultad',
              'Dejó de comer carne',
            ],
            ['en-in-spite-of'],
            'Noah dice: «I’ve stopped flying. In spite of the price, I take the train to visit my family».',
          ),
          question(
            'en.ex.usv6bvj9s3u1mh',
            STUDENTS,
            '¿Qué quiere decir Mia con «Even if everyone in this city stopped flying, it would be a tiny difference»?',
            'Que aunque todos lo hicieran, el efecto sería muy pequeño',
            [
              'Que nadie va a dejar de volar',
              'Que volar no contamina',
              'Que la ciudad es muy chica',
            ],
            ['en-even-if'],
            'Even if: aun si todos dejaran de volar, el resultado (una diferencia mínima) no cambia.',
          ),
          question(
            'en.ex.lbng97akziyhko',
            DROUGHT,
            '¿Qué les pasó a los agricultores aunque redujeron el uso de agua?',
            'Muchos perdieron la mitad de sus cultivos',
            ['Ganaron más dinero', 'Se mudaron a otra región', 'No tuvieron problemas'],
            ['en-even-though', 'en-shortage'],
            'Paula dice: «Even though they have reduced their water use, many have lost half of their crops».',
          ),
          ex.listenChoice(
            'Even though I was tired, I finished the report.',
            [
              'Because I was tired, I finished the report.',
              'Even though I was tired, I started the report.',
              'Even though I was busy, I finished the report.',
            ],
            ['en-even-though'],
            { id: 'en.ex.yt3l6ry34axhf7' },
          ),
          ex.shortAnswer(
            'Did you go to the beach? (sí, a pesar del frío)',
            '¿Fueron a la playa?',
            'Yes, despite the cold.',
            [
              'Yes, in spite of the cold.',
              'Yes, we went despite the cold.',
              'Yes, even though it was cold.',
            ],
            ['en-despite'],
            { id: 'en.ex.p0vegyhx4iwfyz' },
          ),
          ex.translateWrite(
            'A pesar de la lluvia, salimos a caminar.',
            'Despite the rain, we went for a walk.',
            ['en-despite'],
            {
              id: 'en.ex.hav5haxghp1ufe',
              acceptedAnswers: [
                'In spite of the rain, we went for a walk.',
                'Despite the rain we went for a walk.',
                'We went for a walk despite the rain.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Energía y futuro',
        objective:
          'Hablar de soluciones: energía renovable, sostenibilidad y cómo enfrentar un problema.',
        intro: {
          explanation:
            'Renewable energy es la energía renovable (solar, eólica). Sustainable es sostenible: que puede durar sin dañar el planeta. Tackle a problem es enfrentar o abordar un problema. Whereas (mientras que) compara dos cosas opuestas: Coal is cheap, whereas solar energy is clean.',
          examples: [
            {
              target: 'We need more renewable energy.',
              base: 'Necesitamos más energía renovable.',
            },
            {
              target: 'I love the city, whereas my brother prefers the country.',
              base: 'A mí me encanta la ciudad, mientras que mi hermano prefiere el campo.',
            },
          ],
        },
        takeaways: [
          'Hablas de energía renovable y de un futuro sostenible.',
          'Comparas dos ideas opuestas con whereas.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['renewable', 'renovable'],
              ['sustainable', 'sostenible / sustentable'],
              ['tackle', 'abordar / enfrentar (un problema)'],
              ['whereas', 'mientras que'],
            ],
            ['en-renewable', 'en-sustainable', 'en-tackle', 'en-whereas'],
            { id: 'en.ex.gfi0yvqun35i3n' },
          ),
          ex.fillBlank(
            'I love the city, ___ my brother prefers the country.',
            'A mí me encanta la ciudad, mientras que mi hermano prefiere el campo.',
            'whereas',
            ['despite', 'even if', 'in spite of'],
            ['en-whereas'],
            { id: 'en.ex.1hwtgyl2b1d9zn', explanation: 'Whereas une dos hechos opuestos.' },
          ),
          ex.fillBlank(
            'We need to ___ the real causes of the problem.',
            'Tenemos que enfrentar las verdaderas causas del problema.',
            'tackle',
            ['reduce', 'produce', 'protect'],
            ['en-tackle'],
            {
              id: 'en.ex.n0yrvfcvdxwsdf',
              skill: 'vocabulary',
              explanation: 'Collocation: tackle a problem (enfrentar un problema).',
            },
          ),
          question(
            'en.ex.imsxuds9i9q8fs',
            FOOTPRINT,
            '¿Cuál es la verdadera solución, según el autor?',
            'Pasar rápido a la energía renovable, algo que sólo pueden hacer los gobiernos',
            ['Que cada familia tome duchas cortas', 'Cerrar todas las fábricas', 'Dejar de votar'],
            ['en-renewable'],
            'El artículo dice: «The real solution is a fast move to renewable energy… Only governments can make that happen».',
          ),
          question(
            'en.ex.v63su8ytrg4wbg',
            STUDENTS,
            '¿En qué terminan de acuerdo Noah y Mia?',
            'Los dos quieren un futuro sostenible, pero no coinciden en cómo llegar',
            [
              'Los dos van a dejar de volar',
              'No coinciden en nada',
              'Mia acepta que una persona puede cambiar todo',
            ],
            ['en-sustainable'],
            'Mia dice: «So we both want a sustainable future. We just disagree about how to get there».',
          ),
          question(
            'en.ex.cf5fofv5ynrims',
            STUDENTS,
            '¿Qué causas quiere enfrentar Mia?',
            'El carbón, el petróleo y la forma de producir alimentos',
            ['Los vuelos y los trenes', 'Las duchas largas', 'Las grandes ciudades'],
            ['en-tackle'],
            'Mia dice: «we need to tackle the real causes: coal, oil, and the way we produce food».',
          ),
          ex.listenChoice(
            'We need more renewable energy.',
            [
              'We need less renewable energy.',
              'We need more clean energy.',
              'We have more renewable energy.',
            ],
            ['en-renewable'],
            { id: 'en.ex.pewnx77pvhftsq' },
          ),
          ex.orderWords(
            'We all want a sustainable future.',
            'Todos queremos un futuro sostenible.',
            ['en-sustainable'],
            { id: 'en.ex.yeqlhaihpfm9dn' },
          ),
          ex.shortAnswer(
            'What kind of energy should we use? (energía renovable, como la solar)',
            '¿Qué tipo de energía deberíamos usar?',
            'We should use renewable energy, like solar energy.',
            [
              'Renewable energy, like solar energy.',
              'We should use renewable energy.',
              'Renewable energy, such as solar.',
            ],
            ['en-renewable'],
            { id: 'en.ex.lslck7v4c8h9wb' },
          ),
          ex.translateWrite(
            'Tenemos que enfrentar las verdaderas causas del problema.',
            'We need to tackle the real causes of the problem.',
            ['en-tackle'],
            {
              id: 'en.ex.8f23uuu66erky5',
              acceptedAnswers: [
                'We have to tackle the real causes of the problem.',
                'We must tackle the real causes of the problem.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Problemas globales',
        objective: 'Hablar de la pobreza, las especies en peligro y por qué todo está conectado.',
        intro: {
          explanation:
            'Poverty es la pobreza. An endangered animal está en peligro de extinción. Para relacionar problemas: X is connected to Y, X is a consequence of Y, X is a threat to Y. Y para no perder la esperanza: Despite these problems, there is good news.',
          examples: [
            {
              target: 'Poverty and the environment are connected.',
              base: 'La pobreza y el medioambiente están relacionados.',
            },
            {
              target: 'The panda is an endangered animal.',
              base: 'El panda es un animal en peligro de extinción.',
            },
          ],
        },
        takeaways: [
          'Relacionas problemas globales: connected, consequence, threat.',
          'Hablas de especies en peligro y de la pobreza.',
        ],
        exercises: [
          ex.translationChoice(
            'poverty',
            'pobreza',
            ['amenaza', 'escasez / falta', 'sequía'],
            ['en-poverty'],
            { id: 'en.ex.6xusdh56tklyaf' },
          ),
          ex.fillBlank(
            'The panda is an ___ animal.',
            'El panda es un animal en peligro de extinción.',
            'endangered',
            ['renewable', 'sustainable', 'dangerous'],
            ['en-endangered'],
            {
              id: 'en.ex.vplh1a2qmhtald',
              skill: 'vocabulary',
              explanation: 'Endangered: en peligro. Dangerous: peligroso (que causa peligro).',
            },
          ),
          ex.fillBlank(
            'Climate change is a ___ to people and nature.',
            'El cambio climático es una amenaza para las personas y la naturaleza.',
            'threat',
            ['shortage', 'drought', 'poverty'],
            ['en-threat'],
            { id: 'en.ex.df7tp6cwiclij2', skill: 'vocabulary' },
          ),
          question(
            'en.ex.x6qq02e79lotov',
            REPORT,
            '¿Por qué hay tantas especies en peligro, según el informe?',
            'Sobre todo por la pérdida de bosques y la contaminación de los océanos',
            ['Por la caza', 'Por las sequías solamente', 'Por el turismo'],
            ['en-endangered'],
            'El informe dice: «More than one million species are endangered, mainly because of the loss of forests and the pollution of oceans».',
          ),
          question(
            'en.ex.ojam2yuoxy8t2o',
            REPORT,
            '¿Cómo se relacionan la pobreza y el medioambiente, según el informe?',
            'La gente pobre a veces no tiene más opción que talar bosques para sobrevivir',
            [
              'No tienen relación',
              'Los países pobres contaminan más',
              'La pobreza protege los bosques',
            ],
            ['en-poverty'],
            'El informe dice: «when people are poor, they often have no choice but to cut down forests to survive».',
          ),
          question(
            'en.ex.90yz9ndieo8o7t',
            REPORT,
            '¿Cuál es la buena noticia del informe?',
            'Se salvaron varias especies, lo que muestra que actuar funciona',
            ['Ya no hay especies en peligro', 'Bajaron las emisiones', 'Terminó la sequía'],
            ['en-despite', 'en-endangered'],
            'El informe dice: «Despite these problems, there is good news. Several species have been saved in the last ten years».',
          ),
          ex.listenChoice(
            'Poverty and the environment are connected.',
            [
              'Poverty and the environment are not connected.',
              'Poverty and pollution are connected.',
              'Poverty and the climate are connected.',
            ],
            ['en-poverty'],
            { id: 'en.ex.t3rtm3t8ybo648' },
          ),
          ex.orderWords(
            'The panda is an endangered animal.',
            'El panda es un animal en peligro de extinción.',
            ['en-endangered'],
            { id: 'en.ex.7l0wvumb5222rh' },
          ),
          ex.shortAnswer(
            'What is the biggest global problem, in your opinion? (la pobreza)',
            'En tu opinión, ¿cuál es el mayor problema global?',
            'In my opinion, it is poverty.',
            ["In my opinion, it's poverty.", 'Poverty.', 'I think it is poverty.'],
            ['en-poverty'],
            { id: 'en.ex.3f4i44dtgidvyo' },
          ),
          ex.translateWrite(
            'Las inundaciones son una consecuencia del calentamiento global.',
            'Floods are a consequence of global warming.',
            ['en-consequence', 'en-flood'],
            {
              id: 'en.ex.0bvj4gq09xpqc9',
              acceptedAnswers: [
                'The floods are a consequence of global warming.',
                'Floods are one consequence of global warming.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

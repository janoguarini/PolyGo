import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U3 «Sociedad, cultura y actualidad» (docs/B2_EN.md): cambios sociales, generaciones y costumbres;
 * cifras y encuestas (majority, average, rise, decline); voz pasiva avanzada: present perfect y
 * continuo en pasiva (has been built, is being repaired), pasiva con modales (should be done) y pasiva
 * impersonal (it is said that…, is expected to…).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RADIO = dialogue(
  'en.stim.b2-u3-radio',
  'Un informe en la radio sobre el último censo de una ciudad.',
  [
    [
      'Presenter',
      'Good morning. The results of the new census have just been published. Anna, what do they tell us?',
    ],
    [
      'Anna',
      'The population of the city has risen by ten percent in five years, mainly because of young people from other regions.',
    ],
    ['Presenter', 'And where are they living?'],
    [
      'Anna',
      "That's the problem. Housing is very expensive, so the average young person shares a flat until the age of thirty.",
    ],
    ['Presenter', 'Is anything being done about it?'],
    [
      'Anna',
      'Two thousand new homes are being built near the river, and more are expected to be ready next year.',
    ],
    [
      'Presenter',
      'Thank you, Anna. In other news, the summer festival will take place in the old market this year.',
    ],
  ],
);

const ALONE = reading(
  'en.stim.b2-u3-alone',
  'post',
  'Un artículo sobre una encuesta acerca de las personas que viven solas.',
  [
    'Living alone used to be unusual. Today it is one of the biggest trends in our society.',
    'According to a recent survey, one in four homes now has only one person in it. Fifty years ago, the figure was one in ten.',
    'The majority of people who live alone are over sixty, but the number of young people living alone is also rising.',
    'It is often said that living alone makes people lonely. However, the survey suggests the opposite: most people who live alone said they were happy with their lives.',
    'What has declined is the number of large families. In 1970 the average family had four children. Today it has fewer than two.',
  ],
  { title: 'A table for one' },
);

const PODCAST = dialogue(
  'en.stim.b2-u3-podcast',
  'Un pódcast entrevista a una socióloga sobre las generaciones.',
  [
    [
      'Host',
      'People often complain that young people have no respect for old customs. Is that true?',
    ],
    [
      'Dr. Reyes',
      'Every generation has said that about the next one. It is said that even the ancient Greeks complained about their teenagers.',
    ],
    ['Host', 'So nothing has really changed?'],
    [
      'Dr. Reyes',
      "Customs change, of course. Fewer people get married in church, for example, and family dinners are less common. But the values behind them haven't disappeared.",
    ],
    ['Host', 'What do you mean?'],
    [
      'Dr. Reyes',
      'Young people still care about their families. They just show it in different ways: a video call instead of a Sunday lunch.',
    ],
    ['Host', 'And is the gap between generations getting bigger?'],
    [
      'Dr. Reyes',
      "Honestly, I don't think so. Many people believe that, but my research shows that parents and children agree about most things.",
    ],
  ],
);

const MARKET = reading(
  'en.stim.b2-u3-market',
  'notice',
  'Un aviso de la municipalidad sobre el mercado viejo.',
  [
    'The old market is being renovated and will be closed until the end of May.',
    'The roof has already been repaired, and new lights are being installed this month.',
    'The market has been used by local families for more than a hundred years. It is believed to be the oldest building in the neighborhood.',
    'When the work is finished, the market will be used for concerts and festivals. The first festival is expected to take place in June.',
    'Questions can be sent to the community office.',
  ],
  { title: 'Our market is changing' },
);

export const EN_B2_U03: B2UnitDef = {
  names: ['Anna', 'Reyes', 'Greeks', 'Presenter', 'Host', 'Dr'],
  support: [
    'results',
    'census',
    'published',
    'mainly',
    'regions',
    'homes',
    'thousand',
    'river',
    'unusual',
    'recent',
    'figure',
    'large',
    'rising',
    'respect',
    'ancient',
    'teenagers',
    'church',
    'common',
    'values',
    'behind',
    'disappeared',
    'gap',
    'believe',
    'believed',
    'renovated',
    'roof',
    'repaired',
    'installed',
    'lights',
    'festival',
    'even',
    'between',
    'alone',
    'technology',
    'over',
    'suggest',
    'grow',
    'grew',
    'quality',
    'lonely',
  ],
  unit: {
    position: 3,
    title: 'Sociedad, cultura y actualidad',
    titleEn: 'Society, culture and current affairs',
    description:
      'Cambios en la sociedad, generaciones y costumbres, cifras y encuestas, y la voz pasiva avanzada: has been done, is being done, it is said that…',
    emoji: '🏙️',
    objective:
      'Puedes hablar de cambios sociales, entender una noticia con cifras y contar lo que se dice o se espera con la voz pasiva.',
    grammar: {
      title: 'Voz pasiva avanzada',
      explanation:
        'La pasiva pone el foco en lo que pasa, no en quién lo hace. Present perfect: has been + participio (The roof has been repaired). Continuo: is / are being + participio (New homes are being built). Con modales: should / can / will be + participio. Impersonal, para lo que piensa o dice la gente: It is said that… / It is believed that…, o Something is expected to / is believed to + verbo.',
      examples: [
        {
          target: 'Two thousand new homes are being built near the river.',
          base: 'Se están construyendo dos mil viviendas nuevas cerca del río.',
        },
        { target: 'The roof has already been repaired.', base: 'El techo ya fue reparado.' },
        {
          target: 'It is said that living alone makes people lonely.',
          base: 'Se dice que vivir solo hace que la gente se sienta sola.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-society',
        'society',
        'sociedad',
        '/səˈsaɪəti/',
        '🏙️',
        'Technology has changed our society.',
        'La tecnología cambió nuestra sociedad.',
        ['society'],
      ),
      w(
        'en-generation',
        'generation',
        'generación',
        '/ˌdʒɛnəˈreɪʃən/',
        '👪',
        'My generation grew up with the internet.',
        'Mi generación creció con internet.',
        ['society'],
      ),
      w(
        'en-trend',
        'trend',
        'tendencia',
        '/trɛnd/',
        '📈',
        'Working from home is a growing trend.',
        'Trabajar desde casa es una tendencia en aumento.',
        ['society'],
      ),
      w(
        'en-custom',
        'custom',
        'costumbre',
        '/ˈkʌstəm/',
        undefined,
        'In some countries it is a custom to take off your shoes.',
        'En algunos países es costumbre sacarse los zapatos.',
        ['society', 'culture'],
      ),
      w(
        'en-population',
        'population',
        'población',
        '/ˌpɑpjəˈleɪʃən/',
        '👥',
        'The population of the city has risen.',
        'La población de la ciudad aumentó.',
        ['society', 'numbers'],
      ),
      w(
        'en-majority',
        'majority',
        'mayoría',
        '/məˈdʒɔrəti/',
        undefined,
        'The majority of people voted for the plan.',
        'La mayoría de la gente votó a favor del plan.',
        ['society', 'numbers'],
      ),
      w(
        'en-minority',
        'minority',
        'minoría',
        '/maɪˈnɔrəti/',
        undefined,
        'Only a minority of students live alone.',
        'Sólo una minoría de los estudiantes vive sola.',
        ['society', 'numbers'],
      ),
      w(
        'en-average',
        'average',
        'promedio / medio',
        '/ˈævərɪdʒ/',
        undefined,
        'The average family has fewer than two children.',
        'La familia promedio tiene menos de dos hijos.',
        ['society', 'numbers'],
        ['promedio', 'medio'],
      ),
      w(
        'en-survey',
        'survey',
        'encuesta',
        '/ˈsɜrveɪ/',
        '📋',
        'According to a survey, most people are happy.',
        'Según una encuesta, la mayoría de la gente es feliz.',
        ['society', 'numbers'],
      ),
      w(
        'en-rise',
        'rise',
        'aumentar / subir',
        '/raɪz/',
        '⬆️',
        'Prices have risen a lot this year.',
        'Los precios aumentaron mucho este año.',
        ['numbers', 'verbs'],
        ['aumentar', 'subir'],
        ['risen', 'rose'],
      ),
      w(
        'en-decline',
        'decline',
        'disminuir / bajar',
        '/dɪˈklaɪn/',
        '⬇️',
        'The number of large families has declined.',
        'El número de familias numerosas disminuyó.',
        ['numbers', 'verbs'],
        ['disminuir', 'bajar'],
      ),
      w(
        'en-it-is-said',
        'it is said that',
        'se dice que',
        '/ɪt ɪz ˈsɛd ðæt/',
        undefined,
        'It is said that the house is two hundred years old.',
        'Se dice que la casa tiene doscientos años.',
        ['passive'],
        ['dicen que'],
      ),
      w(
        'en-be-expected-to',
        'be expected to',
        'se espera que',
        '/bi ɪkˈspɛktɪd tu/',
        undefined,
        'The new homes are expected to be ready next year.',
        'Se espera que las viviendas nuevas estén listas el año que viene.',
        ['passive'],
        ['se prevé que'],
      ),
      w(
        'en-widespread',
        'widespread',
        'generalizado / extendido',
        '/ˈwaɪdˌsprɛd/',
        undefined,
        'It is a widespread idea, but it is not true.',
        'Es una idea muy extendida, pero no es cierta.',
        ['society', 'adjectives'],
        ['generalizado', 'extendido'],
      ),
      w(
        'en-housing',
        'housing',
        'vivienda',
        '/ˈhaʊzɪŋ/',
        '🏘️',
        'Housing is very expensive in big cities.',
        'La vivienda es muy cara en las ciudades grandes.',
        ['society'],
      ),
      w(
        'en-take-place',
        'take place',
        'tener lugar / realizarse',
        '/ˈteɪk ˈpleɪs/',
        '📍',
        'The festival will take place in the old market.',
        'El festival se va a realizar en el mercado viejo.',
        ['society', 'collocations'],
        ['tener lugar', 'realizarse'],
      ),
      w(
        'en-diversity',
        'diversity',
        'diversidad',
        '/dɪˈvɜrsəti/',
        '🌈',
        'The diversity of the city is its best quality.',
        'La diversidad de la ciudad es su mejor cualidad.',
        ['society', 'culture'],
      ),
      w(
        'en-being-built',
        'is being built',
        'se está construyendo',
        '/ɪz ˈbiɪŋ ˈbɪlt/',
        '🏗️',
        'A new school is being built near my house.',
        'Se está construyendo una escuela nueva cerca de mi casa.',
        ['passive'],
        ['están construyendo'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Una sociedad que cambia',
        objective: 'Hablar de cambios sociales, generaciones y costumbres.',
        intro: {
          explanation:
            'Para hablar de cambios sociales: society (sociedad), generation (generación), trend (tendencia) y custom (costumbre). Ojo: custom no es «costume» (disfraz). Los cambios se cuentan con el present perfect: Technology has changed our society.',
          examples: [
            {
              target: 'Technology has changed our society.',
              base: 'La tecnología cambió nuestra sociedad.',
            },
            {
              target: 'Working from home is a growing trend.',
              base: 'Trabajar desde casa es una tendencia en aumento.',
            },
          ],
        },
        takeaways: [
          'Hablas de la sociedad, las generaciones y sus costumbres.',
          'Describes tendencias con el present perfect.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['society', 'sociedad'],
              ['generation', 'generación'],
              ['trend', 'tendencia'],
              ['custom', 'costumbre'],
            ],
            ['en-society', 'en-generation', 'en-trend', 'en-custom'],
            { id: 'en.ex.bi5nwz8oj01znp' },
          ),
          ex.fillBlank(
            'Working from home is a growing ___.',
            'Trabajar desde casa es una tendencia en aumento.',
            'trend',
            ['custom', 'society', 'generation'],
            ['en-trend'],
            { id: 'en.ex.1mqniu64lr7vfu', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'In some countries it is a ___ to take off your shoes at home.',
            'En algunos países es costumbre sacarse los zapatos en casa.',
            'custom',
            ['trend', 'society', 'habit'],
            ['en-custom'],
            {
              id: 'en.ex.xg9u1c5qnbqknm',
              skill: 'vocabulary',
              explanation: 'Custom: costumbre de una sociedad. Habit: hábito de una persona.',
            },
          ),
          question(
            'en.ex.prded338kpjnjp',
            PODCAST,
            'Según la socióloga, ¿qué dice cada generación de la siguiente?',
            'Que no respeta las costumbres de antes',
            ['Que es más trabajadora', 'Que vive mejor', 'Que es más feliz'],
            ['en-generation', 'en-custom'],
            'El conductor pregunta si los jóvenes no respetan las costumbres y ella responde: «Every generation has said that about the next one».',
          ),
          question(
            'en.ex.fefv2t4th4598p',
            PODCAST,
            '¿Qué cambió y qué no, según la socióloga?',
            'Cambiaron las costumbres, pero no los valores',
            ['Cambiaron los valores, pero no las costumbres', 'No cambió nada', 'Cambió todo'],
            ['en-custom', 'en-society'],
            'Dice: «Customs change, of course… But the values behind them haven’t disappeared».',
          ),
          ex.listenChoice(
            'Technology has changed our society.',
            [
              'Technology will change our society.',
              'Technology has changed our generation.',
              'The internet has changed our society.',
            ],
            ['en-society'],
            { id: 'en.ex.u5eulbbxi3bdne' },
          ),
          ex.orderWords(
            'My generation grew up with the internet.',
            'Mi generación creció con internet.',
            ['en-generation'],
            { id: 'en.ex.91bpkhxijj2tkp' },
          ),
          ex.shortAnswer(
            'What is a big trend in your country? (trabajar desde casa)',
            '¿Cuál es una gran tendencia en tu país?',
            'Working from home is a big trend.',
            [
              'Working from home.',
              'Working from home is a growing trend.',
              'Working from home is a trend.',
            ],
            ['en-trend'],
            { id: 'en.ex.b7r0jma65gu4ua' },
          ),
          ex.translateWrite(
            'La tecnología cambió nuestra sociedad.',
            'Technology has changed our society.',
            ['en-society'],
            {
              id: 'en.ex.pp5gtet7wcug4n',
              acceptedAnswers: [
                'Technology changed our society.',
                "Technology's changed our society.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Cifras y encuestas',
        objective: 'Entender y contar datos: mayorías, promedios, aumentos y caídas.',
        intro: {
          explanation:
            'Para dar cifras: the majority of (la mayoría de), a minority of (una minoría de), the average family (la familia promedio), one in four (uno de cada cuatro). Rise (rose, risen) es aumentar y decline, disminuir. Una survey es una encuesta.',
          examples: [
            {
              target: 'The population of the city has risen.',
              base: 'La población de la ciudad aumentó.',
            },
            {
              target: 'The majority of people voted for the plan.',
              base: 'La mayoría de la gente votó a favor del plan.',
            },
          ],
        },
        takeaways: [
          'Entiendes datos de una encuesta: majority, minority, average.',
          'Cuentas aumentos y caídas con rise y decline.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['population', 'población'],
              ['majority', 'mayoría'],
              ['minority', 'minoría'],
              ['survey', 'encuesta'],
            ],
            ['en-population', 'en-majority', 'en-minority', 'en-survey'],
            { id: 'en.ex.jz2hf7zglf88o2' },
          ),
          ex.fillBlank(
            'Prices have ___ a lot this year.',
            'Los precios aumentaron mucho este año.',
            'risen',
            ['rose', 'rise', 'rised'],
            ['en-rise'],
            {
              id: 'en.ex.aenzs07rde3zge',
              explanation:
                'Rise es irregular: rise, rose, risen. Con have va el participio: have risen.',
            },
          ),
          ex.fillBlank(
            'The ___ family has fewer than two children.',
            'La familia promedio tiene menos de dos hijos.',
            'average',
            ['majority', 'minority', 'population'],
            ['en-average'],
            { id: 'en.ex.y7yeasvhur7cku', skill: 'vocabulary' },
          ),
          question(
            'en.ex.2j008z4kf3xaki',
            ALONE,
            '¿Cómo cambió el número de hogares de una sola persona?',
            'Pasó de uno de cada diez a uno de cada cuatro',
            ['Pasó de uno de cada cuatro a uno de cada diez', 'No cambió', 'Bajó a la mitad'],
            ['en-survey', 'en-trend'],
            'El artículo dice: «one in four homes now has only one person in it. Fifty years ago, the figure was one in ten».',
          ),
          question(
            'en.ex.xidoz9lfqixbd7',
            ALONE,
            '¿Qué dice la encuesta sobre la idea de que vivir solo hace sentir solo?',
            'Que la mayoría de quienes viven solos dicen ser felices',
            ['Que es cierta', 'Que sólo vale para los jóvenes', 'Que no lo preguntó'],
            ['en-majority', 'en-survey'],
            'El artículo dice: «the survey suggests the opposite: most people who live alone said they were happy».',
          ),
          question(
            'en.ex.xfvlacds4yv88b',
            ALONE,
            '¿Qué disminuyó, según el artículo?',
            'El número de familias numerosas',
            ['El número de personas mayores', 'El número de hogares', 'El número de jóvenes'],
            ['en-decline', 'en-average'],
            'El artículo dice: «What has declined is the number of large families».',
          ),
          ex.listenChoice(
            'The population of the city has risen.',
            [
              'The population of the city has declined.',
              'The population of the country has risen.',
              'The population of the city will rise.',
            ],
            ['en-population', 'en-rise'],
            { id: 'en.ex.src4oxugtr678f' },
          ),
          ex.orderWords(
            'Only a minority of students live alone.',
            'Sólo una minoría de los estudiantes vive sola.',
            ['en-minority'],
            { id: 'en.ex.vlmewi7rzre6jm' },
          ),
          ex.shortAnswer(
            'Has the number of large families risen? (no, disminuyó)',
            '¿Aumentó el número de familias numerosas?',
            'No, it has declined.',
            ["No, it's declined.", 'No, it declined.', 'No. It has declined.'],
            ['en-decline'],
            { id: 'en.ex.71vfs7r8jmx1wn' },
          ),
          ex.translateWrite(
            'Según una encuesta, la mayoría de la gente es feliz.',
            'According to a survey, the majority of people are happy.',
            ['en-survey', 'en-majority'],
            {
              id: 'en.ex.5skk3v0wopxpcs',
              acceptedAnswers: [
                'According to a survey, most people are happy.',
                'According to a survey the majority of people are happy.',
                'According to a survey, the majority of people is happy.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Se dice que…',
        objective: 'Contar lo que se dice, se cree o se espera con la pasiva impersonal.',
        intro: {
          explanation:
            'Para contar lo que dice o piensa mucha gente, sin decir quién: It is said that… (se dice que), It is believed that… (se cree que). También con la persona o la cosa como sujeto: The homes are expected to be ready next year (se espera que estén listas). Algo widespread es muy extendido.',
          examples: [
            {
              target: 'It is said that the house is two hundred years old.',
              base: 'Se dice que la casa tiene doscientos años.',
            },
            {
              target: 'The new homes are expected to be ready next year.',
              base: 'Se espera que las viviendas nuevas estén listas el año que viene.',
            },
          ],
        },
        takeaways: [
          'Cuentas lo que se dice o se cree: It is said that…',
          'Cuentas lo que se espera: …is expected to…',
        ],
        exercises: [
          ex.fillBlank(
            'It is ___ that the house is two hundred years old.',
            'Se dice que la casa tiene doscientos años.',
            'said',
            ['saying', 'say', 'told'],
            ['en-it-is-said'],
            {
              id: 'en.ex.5iwnbws0wtryi5',
              explanation: 'Pasiva impersonal: It is said / believed that + oración.',
            },
          ),
          ex.fillBlank(
            'The new homes are expected ___ ready next year.',
            'Se espera que las viviendas nuevas estén listas el año que viene.',
            'to be',
            ['being', 'be', 'will be'],
            ['en-be-expected-to'],
            { id: 'en.ex.zu1fx7mmhhokyy', explanation: 'Be expected + to + verbo.' },
          ),
          ex.fillBlank(
            'It is a ___ idea, but it is not true.',
            'Es una idea muy extendida, pero no es cierta.',
            'widespread',
            ['average', 'local', 'lonely'],
            ['en-widespread'],
            { id: 'en.ex.2bm649ufkx53g0', skill: 'vocabulary' },
          ),
          question(
            'en.ex.g9rfhc5llogyjn',
            PODCAST,
            '¿Para qué menciona la socióloga a los antiguos griegos?',
            'Para mostrar que la queja sobre los jóvenes es muy antigua',
            [
              'Para hablar de la historia de Grecia',
              'Para decir que los griegos eran mejores',
              'Para explicar una costumbre griega',
            ],
            ['en-it-is-said', 'en-generation'],
            'Dice: «It is said that even the ancient Greeks complained about their teenagers».',
          ),
          question(
            'en.ex.xfe4w9hc8rjs4m',
            PODCAST,
            '¿Qué opina la socióloga de la idea de que la distancia entre generaciones es cada vez mayor?',
            'Que mucha gente lo cree, pero su investigación no lo confirma',
            ['Que es cierta', 'Que es nueva', 'Que nadie la cree'],
            ['en-generation'],
            'Dice: «Many people believe that, but my research shows that parents and children agree about most things».',
          ),
          question(
            'en.ex.fv0sbrtdmjk0zf',
            MARKET,
            '¿Qué se cree del mercado?',
            'Que es el edificio más viejo del barrio',
            [
              'Que va a cerrar para siempre',
              'Que es el más grande de la ciudad',
              'Que lo construyó una familia',
            ],
            ['en-it-is-said'],
            'El aviso dice: «It is believed to be the oldest building in the neighborhood».',
          ),
          ex.listenChoice(
            'It is said that the house is two hundred years old.',
            [
              'It is said that the house is three hundred years old.',
              'It was said that the house was two hundred years old.',
              'They say that the house is two hundred years old.',
            ],
            ['en-it-is-said'],
            { id: 'en.ex.wa9kpl6zcd3un8' },
          ),
          ex.orderWords(
            'The festival is expected to take place in June.',
            'Se espera que el festival se realice en junio.',
            ['en-be-expected-to', 'en-take-place'],
            { id: 'en.ex.cre54m43qk44oy' },
          ),
          ex.shortAnswer(
            'When will the homes be ready? (se espera que estén listas el año que viene)',
            '¿Cuándo van a estar listas las viviendas?',
            'They are expected to be ready next year.',
            [
              "They're expected to be ready next year.",
              'They are expected to be finished next year.',
              'Next year, they are expected to be ready.',
            ],
            ['en-be-expected-to'],
            { id: 'en.ex.lovrkepujabedl' },
          ),
          ex.translateWrite(
            'Se dice que la casa tiene doscientos años.',
            'It is said that the house is two hundred years old.',
            ['en-it-is-said'],
            {
              id: 'en.ex.4fl72tx7utzzcp',
              acceptedAnswers: [
                "It's said that the house is two hundred years old.",
                'It is said the house is two hundred years old.',
                'The house is said to be two hundred years old.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Obras en marcha',
        objective: 'Contar lo que se está haciendo y lo que ya se hizo con la pasiva.',
        intro: {
          explanation:
            'Para algo que se está haciendo ahora: is / are being + participio (A new school is being built). Para algo que ya se hizo: has / have been + participio (The roof has been repaired). Take place es tener lugar, realizarse (un evento). Housing es la vivienda en general.',
          examples: [
            {
              target: 'A new school is being built near my house.',
              base: 'Se está construyendo una escuela nueva cerca de mi casa.',
            },
            {
              target: 'The festival will take place in the old market.',
              base: 'El festival se va a realizar en el mercado viejo.',
            },
          ],
        },
        takeaways: [
          'Cuentas obras en marcha con is being + participio.',
          'Cuentas lo que ya se hizo con has been + participio.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['housing', 'vivienda'],
              ['take place', 'tener lugar / realizarse'],
              ['is being built', 'se está construyendo'],
              ['widespread', 'generalizado / extendido'],
            ],
            ['en-housing', 'en-take-place', 'en-being-built', 'en-widespread'],
            { id: 'en.ex.1wo4s6kr7k2ddr' },
          ),
          ex.fillBlank(
            'A new school is ___ built near my house.',
            'Se está construyendo una escuela nueva cerca de mi casa.',
            'being',
            ['been', 'be', 'was'],
            ['en-being-built'],
            {
              id: 'en.ex.83zr347uosd7qr',
              explanation: 'Pasiva continua: is / are + being + participio.',
            },
          ),
          ex.fillBlank(
            'The roof has already ___ repaired.',
            'El techo ya fue reparado.',
            'been',
            ['being', 'be', 'was'],
            ['en-being-built'],
            {
              id: 'en.ex.p93gtnlpgod0d5',
              explanation: 'Pasiva en present perfect: has / have + been + participio.',
            },
          ),
          ex.fillBlank(
            'The festival will take ___ in the old market.',
            'El festival se va a realizar en el mercado viejo.',
            'place',
            ['part', 'time', 'care'],
            ['en-take-place'],
            { id: 'en.ex.x0oeyl4ywuhyzy', skill: 'vocabulary' },
          ),
          question(
            'en.ex.3twmmv9e5pq993',
            RADIO,
            '¿Por qué los jóvenes comparten apartamento hasta los treinta, según el informe?',
            'Porque la vivienda es muy cara',
            [
              'Porque no consiguen trabajo',
              'Porque prefieren vivir con amigos',
              'Porque estudian hasta los treinta',
            ],
            ['en-housing', 'en-average'],
            'Anna dice: «Housing is very expensive, so the average young person shares a flat until the age of thirty».',
          ),
          question(
            'en.ex.dh6luaflz4t27i',
            RADIO,
            '¿Qué se está haciendo para solucionar el problema?',
            'Se están construyendo dos mil viviendas cerca del río',
            [
              'Se bajaron los alquileres',
              'Se construyó un barrio nuevo',
              'Se cerró el mercado viejo',
            ],
            ['en-being-built', 'en-population'],
            'Anna dice: «Two thousand new homes are being built near the river».',
          ),
          question(
            'en.ex.2pgjt2yxhswt98',
            MARKET,
            '¿Qué trabajo ya se terminó en el mercado?',
            'El techo',
            ['Las luces', 'Todo el edificio', 'La oficina'],
            ['en-being-built'],
            'El aviso dice: «The roof has already been repaired, and new lights are being installed this month».',
          ),
          ex.listenChoice(
            'A new school is being built near my house.',
            [
              'A new school has been built near my house.',
              'A new hospital is being built near my house.',
              'A new school is being built near our house.',
            ],
            ['en-being-built'],
            { id: 'en.ex.9t6ld1nyb6jwr1' },
          ),
          ex.shortAnswer(
            'Where will the festival take place? (en el mercado viejo)',
            '¿Dónde se va a realizar el festival?',
            'It will take place in the old market.',
            [
              "It'll take place in the old market.",
              'In the old market.',
              'The festival will take place in the old market.',
            ],
            ['en-take-place'],
            { id: 'en.ex.r7o0oy3y42j1pu' },
          ),
          ex.translateWrite(
            'La vivienda es muy cara en las ciudades grandes.',
            'Housing is very expensive in big cities.',
            ['en-housing'],
            {
              id: 'en.ex.v3070vaai7qyn0',
              acceptedAnswers: [
                'Housing is really expensive in big cities.',
                'In big cities, housing is very expensive.',
                'Housing is very expensive in large cities.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Una ciudad diversa',
        objective: 'Hablar de la diversidad y opinar sobre lo que se debería hacer.',
        intro: {
          explanation:
            'Diversity es la diversidad (de culturas, de idiomas, de edades). Para opinar sobre lo que habría que hacer sin decir quién: should be + participio (More homes should be built). También can be + participio para posibilidades: Many languages can be heard in the market.',
          examples: [
            {
              target: 'The diversity of the city is its best quality.',
              base: 'La diversidad de la ciudad es su mejor cualidad.',
            },
            {
              target: 'More homes should be built for young people.',
              base: 'Deberían construirse más viviendas para los jóvenes.',
            },
          ],
        },
        takeaways: [
          'Hablas de la diversidad de un lugar.',
          'Opinas sobre lo que se debería hacer con should be + participio.',
        ],
        exercises: [
          ex.translationChoice(
            'diversity',
            'diversidad',
            ['sociedad', 'tendencia', 'población'],
            ['en-diversity'],
            { id: 'en.ex.dm7tbusoscch9x' },
          ),
          ex.fillBlank(
            'More homes should ___ built for young people.',
            'Deberían construirse más viviendas para los jóvenes.',
            'be',
            ['being', 'been', 'to be'],
            ['en-housing'],
            {
              id: 'en.ex.3mlq76c0mhxxrc',
              explanation: 'Pasiva con modal: should / can / will + be + participio.',
            },
          ),
          ex.fillBlank(
            'Many languages can be ___ in the market.',
            'En el mercado se pueden oír muchos idiomas.',
            'heard',
            ['hear', 'hearing', 'hears'],
            ['en-diversity'],
            { id: 'en.ex.pkd1gai6lyixqb' },
          ),
          question(
            'en.ex.zgauplorng2e26',
            PODCAST,
            '¿Cómo muestran hoy los jóvenes que les importa su familia, según la socióloga?',
            'De otra forma, por ejemplo con una videollamada en vez de un almuerzo',
            ['Ya no lo muestran', 'Viviendo con sus padres', 'Yendo a la iglesia'],
            ['en-generation', 'en-custom'],
            'Dice: «They just show it in different ways: a video call instead of a Sunday lunch».',
          ),
          question(
            'en.ex.52iwybd6jt7jfe',
            MARKET,
            '¿Para qué se va a usar el mercado cuando terminen las obras?',
            'Para conciertos y festivales',
            ['Para viviendas', 'Para oficinas', 'Como escuela'],
            ['en-take-place', 'en-be-expected-to'],
            'El aviso dice: «the market will be used for concerts and festivals».',
          ),
          ex.listenChoice(
            'The diversity of the city is its best quality.',
            [
              'The diversity of the country is its best quality.',
              'The diversity of the city is its main problem.',
              'The history of the city is its best quality.',
            ],
            ['en-diversity'],
            { id: 'en.ex.ix8z37yubcv0un' },
          ),
          ex.orderWords(
            'More homes should be built for young people.',
            'Deberían construirse más viviendas para los jóvenes.',
            ['en-housing'],
            { id: 'en.ex.fcd7o7kjljk7bv' },
          ),
          ex.shortAnswer(
            'What do you like most about your city? (su diversidad)',
            '¿Qué es lo que más te gusta de tu ciudad?',
            'I like its diversity.',
            ['Its diversity.', 'I like the diversity.', 'I love its diversity.'],
            ['en-diversity'],
            { id: 'en.ex.1d2l998cfg5jwt' },
          ),
          ex.translateWrite(
            'Se está construyendo una escuela nueva cerca de mi casa.',
            'A new school is being built near my house.',
            ['en-being-built'],
            {
              id: 'en.ex.ho4a6x3hrrej7i',
              acceptedAnswers: [
                'A new school is being built near my home.',
                'They are building a new school near my house.',
                "They're building a new school near my house.",
              ],
            },
          ),
        ],
      },
    ],
  },
};

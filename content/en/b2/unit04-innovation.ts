import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U4 «Ciencia, tecnología e innovación» (docs/B2_EN.md): investigación y descubrimientos,
 * inventos e innovación, inteligencia artificial y privacidad, ponerse al día con la tecnología.
 * Estructura principal: oraciones de relativo avanzadas: explicativas con comas, whose, which que
 * retoma toda la oración, preposición + which / whom y most of which.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const INTERVIEW = dialogue(
  'en.stim.b2-u4-interview',
  'Una entrevista de radio a una científica que inventó un filtro de agua.',
  [
    [
      'Host',
      'My guest today is Dr. Mei Lin, whose team has come up with a new way to clean water. Welcome.',
    ],
    [
      'Mei',
      'Thank you. Our filter, which costs less than five dollars, uses only sunlight to clean dirty water.',
    ],
    ['Host', 'That sounds like a real breakthrough. How did you get the idea?'],
    [
      'Mei',
      "By accident, actually. One of our experiments failed, which was very frustrating at the time. But the results showed something we didn't expect.",
    ],
    ['Host', 'And is there evidence that it works outside the lab?'],
    [
      'Mei',
      'Yes. We have tested it in forty villages, most of which have no clean water. The data are very clear.',
    ],
    ['Host', 'What is the next step?'],
    [
      'Mei',
      "We want to make it in large numbers. The invention is useless if the people who need it can't get it.",
    ],
  ],
);

const AI_ARTICLE = reading(
  'en.stim.b2-u4-ai',
  'post',
  'Un artículo de opinión sobre la inteligencia artificial.',
  [
    'Artificial intelligence is everywhere: it chooses the songs we listen to, suggests the products we buy and even helps doctors read X-rays.',
    'Most of us rely on it every day without thinking about it. That is exactly the problem.',
    'To work well, these systems need huge amounts of data, much of which comes from our phones. Every search, every photo and every location can be stored, which raises serious questions about privacy.',
    'This does not mean we should reject innovation. But we should know who collects our data, how it is used and for how long it is kept.',
    'Technology is a tool. Whether it helps or harms us depends on the rules we decide to give it.',
  ],
  { title: 'Who is watching the machines?' },
);

const GRANDMA = dialogue('en.stim.b2-u4-grandma', 'Un nieto ayuda a su abuela con su teléfono.', [
  ['Dani', 'Grandma, your phone is so outdated. It is older than me!'],
  ['Grandma', 'It works fine, thank you. It makes calls, which is all I need.'],
  ['Dani', "But you can't use video calls, and the bank app doesn't work on it."],
  ['Grandma', "I know. It's hard to keep up with technology. Everything changes so fast."],
  ['Dani', "I'll help you. My old phone, which I don't use anymore, is much newer than yours."],
  ['Grandma', 'Is it one of those cutting-edge phones with three cameras?'],
  ['Dani', "Not really, but it's good enough for you. And I'll teach you how to use it."],
]);

const MUSEUM = reading(
  'en.stim.b2-u4-museum',
  'notice',
  'Carteles de una sala de un museo de ciencia.',
  [
    'Room 3: Ideas that changed the world',
    'The telephone, which was invented in 1876, allowed people to talk across long distances for the first time.',
    'Marie Curie, whose discoveries changed medicine, was the first person to win two Nobel Prizes.',
    'The World Wide Web was created by Tim Berners-Lee, a scientist for whom sharing information was more important than money. He never asked for payment for his invention.',
    'Which of these innovations do you use every day?',
  ],
  { title: 'Science Museum' },
);

export const EN_B2_U04: B2UnitDef = {
  names: [
    'Mei',
    'Lin',
    'Dani',
    'Grandma',
    'Marie',
    'Curie',
    'Nobel',
    'Tim',
    'Berners',
    'Lee',
    'Host',
    'Dr',
  ],
  support: [
    'guest',
    'filter',
    'sunlight',
    'frustrating',
    'tested',
    'villages',
    'lab',
    'useless',
    'everywhere',
    'chooses',
    'songs',
    'products',
    'rays',
    'exactly',
    'systems',
    'huge',
    'amounts',
    'search',
    'location',
    'stored',
    'raises',
    'reject',
    'collects',
    'tool',
    'whether',
    'harms',
    'depends',
    'machines',
    'anymore',
    'newer',
    'teach',
    'telephone',
    'invented',
    'distances',
    'century',
    'expect',
    'ocean',
    'science',
    'wide',
    'x',
    'collect',
    'laptop',
    'created',
    'whom',
    'payment',
    'web',
    'cameras',
  ],
  unit: {
    position: 4,
    title: 'Ciencia, tecnología e innovación',
    titleEn: 'Science, technology and innovation',
    description:
      'Investigación y descubrimientos, inventos, inteligencia artificial y privacidad, y oraciones de relativo con comas, whose y which.',
    emoji: '🔬',
    objective:
      'Puedes contar un descubrimiento, opinar sobre la tecnología y dar información extra con oraciones de relativo.',
    grammar: {
      title: 'Oraciones de relativo avanzadas',
      explanation:
        'Las explicativas van entre comas y agregan información extra; no se usa that: Our filter, which costs five dollars, uses sunlight. Whose indica posesión (cuyo): a scientist whose team… Which puede retomar toda la oración anterior: One experiment failed, which was frustrating. En un registro más formal, la preposición va antes: for whom, in which. Most of which / many of whom: la mayoría de los cuales.',
      examples: [
        {
          target: 'Our filter, which costs less than five dollars, uses only sunlight.',
          base: 'Nuestro filtro, que cuesta menos de cinco dólares, usa sólo la luz del sol.',
        },
        {
          target: 'Marie Curie, whose discoveries changed medicine, won two Nobel Prizes.',
          base: 'Marie Curie, cuyos descubrimientos cambiaron la medicina, ganó dos premios Nobel.',
        },
        {
          target: 'One of our experiments failed, which was very frustrating.',
          base: 'Uno de nuestros experimentos falló, lo cual fue muy frustrante.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-scientist',
        'scientist',
        'científico / científica',
        '/ˈsaɪəntɪst/',
        '🧑‍🔬',
        'She is a scientist who studies the ocean.',
        'Es una científica que estudia el océano.',
        ['science'],
        ['científico', 'científica'],
      ),
      w(
        'en-experiment',
        'experiment',
        'experimento',
        '/ɪkˈspɛrəmənt/',
        '🧪',
        'The experiment failed, but we learned a lot.',
        'El experimento falló, pero aprendimos mucho.',
        ['science'],
      ),
      w(
        'en-evidence',
        'evidence',
        'pruebas / evidencia',
        '/ˈɛvədəns/',
        '🔎',
        'There is no evidence that it works.',
        'No hay pruebas de que funcione.',
        ['science'],
        ['pruebas', 'evidencia'],
      ),
      w(
        'en-discovery',
        'discovery',
        'descubrimiento',
        '/dɪˈskʌvəri/',
        undefined,
        'It was the most important discovery of the century.',
        'Fue el descubrimiento más importante del siglo.',
        ['science'],
      ),
      w(
        'en-breakthrough',
        'breakthrough',
        'gran avance / descubrimiento clave',
        '/ˈbreɪkˌθru/',
        '🚀',
        'The new filter is a real breakthrough.',
        'El filtro nuevo es un verdadero gran avance.',
        ['science', 'innovation'],
        ['gran avance', 'avance'],
      ),
      w(
        'en-come-up-with',
        'come up with',
        'ocurrírsele / idear',
        '/ˈkʌm ˈʌp wɪð/',
        '💡',
        'Who came up with this idea?',
        '¿A quién se le ocurrió esta idea?',
        ['innovation', 'phrasal-verbs'],
        ['idear', 'ocurrírsele', 'inventar'],
      ),
      w(
        'en-invention',
        'invention',
        'invento',
        '/ɪnˈvɛnʃən/',
        undefined,
        'The telephone was a great invention.',
        'El teléfono fue un gran invento.',
        ['innovation'],
      ),
      w(
        'en-innovation',
        'innovation',
        'innovación',
        '/ˌɪnəˈveɪʃən/',
        undefined,
        'The company is famous for innovation.',
        'La empresa es famosa por su innovación.',
        ['innovation'],
      ),
      w(
        'en-whose',
        'whose',
        'cuyo / cuya',
        '/huz/',
        undefined,
        'She is the scientist whose team won the prize.',
        'Es la científica cuyo equipo ganó el premio.',
        ['relative-clauses'],
        ['cuyo', 'cuya'],
      ),
      w(
        'en-most-of-which',
        'most of which',
        'la mayoría de los cuales',
        '/ˈmoʊst əv ˈwɪtʃ/',
        undefined,
        'I have many books, most of which I have never read.',
        'Tengo muchos libros, la mayoría de los cuales nunca leí.',
        ['relative-clauses'],
        ['la mayoría de las cuales'],
      ),
      w(
        'en-artificial-intelligence',
        'artificial intelligence',
        'inteligencia artificial',
        '/ˌɑrtəˈfɪʃəl ɪnˈtɛlədʒəns/',
        '🤖',
        'Artificial intelligence helps doctors read X-rays.',
        'La inteligencia artificial ayuda a los médicos a leer radiografías.',
        ['technology'],
        ['IA'],
      ),
      w(
        'en-data',
        'data',
        'datos',
        '/ˈdeɪtə/',
        '📊',
        'The app collects data about your location.',
        'La aplicación recoge datos sobre tu ubicación.',
        ['technology'],
      ),
      w(
        'en-privacy',
        'privacy',
        'privacidad',
        '/ˈpraɪvəsi/',
        '🔒',
        'I worry about my privacy online.',
        'Me preocupa mi privacidad en internet.',
        ['technology'],
      ),
      w(
        'en-rely-on',
        'rely on',
        'depender de / confiar en',
        '/rɪˈlaɪ ɑn/',
        undefined,
        'We rely on our phones for everything.',
        'Dependemos del teléfono para todo.',
        ['technology', 'phrasal-verbs'],
        ['depender de', 'contar con'],
      ),
      w(
        'en-keep-up-with',
        'keep up with',
        'mantenerse al día con / seguir el ritmo de',
        '/ˈkip ˈʌp wɪð/',
        undefined,
        "It's hard to keep up with technology.",
        'Es difícil mantenerse al día con la tecnología.',
        ['technology', 'phrasal-verbs'],
        ['mantenerse al día con', 'seguir el ritmo de'],
      ),
      w(
        'en-outdated',
        'outdated',
        'anticuado / desactualizado',
        '/ˌaʊtˈdeɪtɪd/',
        '📟',
        'Your phone is so outdated!',
        '¡Tu teléfono es muy anticuado!',
        ['technology', 'adjectives'],
        ['anticuado', 'desactualizado', 'obsoleto'],
      ),
      w(
        'en-cutting-edge',
        'cutting-edge',
        'de vanguardia / de última generación',
        '/ˌkʌtɪŋ ˈɛdʒ/',
        '✨',
        'The lab uses cutting-edge technology.',
        'El laboratorio usa tecnología de vanguardia.',
        ['technology', 'adjectives'],
        ['de vanguardia', 'de última generación'],
        ['cutting edge'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'En el laboratorio',
        objective: 'Hablar de científicos, experimentos y pruebas.',
        intro: {
          explanation:
            'A scientist hace research (investigación) y experiments. Evidence son las pruebas que demuestran algo: es incontable, así que se dice some evidence, no «an evidence». A discovery es un descubrimiento.',
          examples: [
            {
              target: 'The experiment failed, but we learned a lot.',
              base: 'El experimento falló, pero aprendimos mucho.',
            },
            {
              target: 'There is no evidence that it works.',
              base: 'No hay pruebas de que funcione.',
            },
          ],
        },
        takeaways: [
          'Hablas de experimentos, pruebas y descubrimientos.',
          'Usas evidence como incontable: some evidence, no evidence.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['scientist', 'científico / científica'],
              ['experiment', 'experimento'],
              ['evidence', 'pruebas / evidencia'],
              ['discovery', 'descubrimiento'],
            ],
            ['en-scientist', 'en-experiment', 'en-evidence', 'en-discovery'],
            { id: 'en.ex.xky0kl7ulqvj6k' },
          ),
          ex.fillBlank(
            'There is no ___ that it works.',
            'No hay pruebas de que funcione.',
            'evidence',
            ['experiment', 'discovery', 'scientist'],
            ['en-evidence'],
            {
              id: 'en.ex.uuowshj3ox1vm3',
              skill: 'vocabulary',
              explanation: 'Evidence es incontable: no evidence, some evidence.',
            },
          ),
          ex.fillBlank(
            'It was the most important ___ of the century.',
            'Fue el descubrimiento más importante del siglo.',
            'discovery',
            ['evidence', 'scientist', 'research'],
            ['en-discovery'],
            { id: 'en.ex.i26y6wt3ihg0f1', skill: 'vocabulary' },
          ),
          question(
            'en.ex.6z7vu340mx7hup',
            INTERVIEW,
            '¿Cómo surgió la idea del filtro?',
            'Por casualidad, a partir de un experimento que falló',
            [
              'Después de años de planificación',
              'Gracias a otro científico',
              'En un viaje a un pueblo',
            ],
            ['en-experiment', 'en-discovery', 'en-breakthrough'],
            'Mei dice: «By accident, actually. One of our experiments failed… But the results showed something we didn’t expect».',
          ),
          question(
            'en.ex.j2saazdr1cmxku',
            INTERVIEW,
            '¿Qué pruebas tienen de que el filtro funciona fuera del laboratorio?',
            'Lo probaron en cuarenta pueblos y los datos son claros',
            ['Ninguna todavía', 'Lo probaron en su ciudad', 'Lo usan en hospitales'],
            ['en-evidence', 'en-scientist', 'en-data', 'en-invention'],
            'Mei dice: «We have tested it in forty villages… The data are very clear».',
          ),
          ex.listenChoice(
            'The experiment failed, but we learned a lot.',
            [
              'The experiment worked, and we learned a lot.',
              'The experiment failed, but we learned nothing.',
              'The experiments failed, but we learned a lot.',
            ],
            ['en-experiment'],
            { id: 'en.ex.13714pe0cko7av' },
          ),
          ex.orderWords(
            'She is a scientist who studies the ocean.',
            'Es una científica que estudia el océano.',
            ['en-scientist'],
            { id: 'en.ex.a0kv7s09f6yo1r' },
          ),
          ex.shortAnswer(
            'Does this medicine really work? (no hay pruebas)',
            '¿De verdad funciona este remedio?',
            'There is no evidence that it works.',
            ["There's no evidence that it works.", 'There is no evidence.', "There's no evidence."],
            ['en-evidence'],
            { id: 'en.ex.fsel2iwbcg5y11' },
          ),
          ex.translateWrite(
            'El experimento falló, pero aprendimos mucho.',
            'The experiment failed, but we learned a lot.',
            ['en-experiment'],
            {
              id: 'en.ex.60in9zsb4k48ox',
              acceptedAnswers: [
                'The experiment failed but we learned a lot.',
                'The experiment failed, but we learnt a lot.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Un gran avance',
        objective: 'Contar un invento o una idea nueva y quién la tuvo.',
        intro: {
          explanation:
            'Come up with es idear, tener una idea: Who came up with this? A breakthrough es un avance clave. Invention es un invento e innovation, la innovación. Whose (cuyo) une a una persona con algo suyo: the scientist whose team won the prize.',
          examples: [
            { target: 'Who came up with this idea?', base: '¿A quién se le ocurrió esta idea?' },
            {
              target: 'She is the scientist whose team won the prize.',
              base: 'Es la científica cuyo equipo ganó el premio.',
            },
          ],
        },
        takeaways: [
          'Cuentas quién tuvo una idea con come up with.',
          'Unes una persona con algo suyo con whose.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['breakthrough', 'gran avance / descubrimiento clave'],
              ['invention', 'invento'],
              ['innovation', 'innovación'],
              ['come up with', 'ocurrírsele / idear'],
            ],
            ['en-breakthrough', 'en-invention', 'en-innovation', 'en-come-up-with'],
            { id: 'en.ex.d16f9y21hlhqrh' },
          ),
          ex.fillBlank(
            'Who came up ___ this idea?',
            '¿A quién se le ocurrió esta idea?',
            'with',
            ['to', 'for', 'on'],
            ['en-come-up-with'],
            { id: 'en.ex.ga5b7err2911it', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'She is the scientist ___ team won the prize.',
            'Es la científica cuyo equipo ganó el premio.',
            'whose',
            ['who', 'which', "who's"],
            ['en-whose'],
            {
              id: 'en.ex.m1sq7ajqa8q6jm',
              explanation: 'Whose + sustantivo: posesión (cuyo). Who’s es who is.',
            },
          ),
          question(
            'en.ex.7hi2b1mpng52yv',
            INTERVIEW,
            '¿Qué tiene de especial el filtro de Mei Lin?',
            'Es barato y limpia el agua sólo con la luz del sol',
            [
              'Es el más grande del mundo',
              'Funciona con electricidad',
              'Lo inventó el entrevistador',
            ],
            ['en-breakthrough', 'en-whose'],
            'Mei dice: «Our filter, which costs less than five dollars, uses only sunlight to clean dirty water».',
          ),
          question(
            'en.ex.qpglhm9ddsl2u2',
            INTERVIEW,
            '¿Qué quiere decir Mei con «The invention is useless if the people who need it can’t get it»?',
            'Que el invento sólo sirve si llega a quienes lo necesitan',
            ['Que el invento no funciona', 'Que es muy caro', 'Que nadie lo necesita'],
            ['en-invention'],
            'Por eso el próximo paso es fabricarlo en grandes cantidades: «We want to make it in large numbers».',
          ),
          question(
            'en.ex.m8gdkvwnrcsct8',
            MUSEUM,
            '¿Qué se destaca de Tim Berners-Lee?',
            'Que compartir información le importaba más que el dinero',
            [
              'Que inventó el teléfono',
              'Que ganó dos premios Nobel',
              'Que cobró mucho por su invento',
            ],
            ['en-invention', 'en-scientist'],
            'El cartel dice: «a scientist for whom sharing information was more important than money. He never asked for payment».',
          ),
          ex.listenChoice(
            'The new filter is a real breakthrough.',
            [
              'The new filter is a real problem.',
              'The new filter was a real breakthrough.',
              'The new phone is a real breakthrough.',
            ],
            ['en-breakthrough'],
            { id: 'en.ex.b3ocetdgwubyv3' },
          ),
          ex.orderWords(
            'The company is famous for innovation.',
            'La empresa es famosa por su innovación.',
            ['en-innovation'],
            { id: 'en.ex.a0jij5ggqr9i6h' },
          ),
          ex.shortAnswer(
            'Whose idea was it? (se le ocurrió a mi hermana)',
            '¿De quién fue la idea?',
            'My sister came up with it.',
            [
              'My sister came up with the idea.',
              'My sister came up with it!',
              "It was my sister's idea.",
            ],
            ['en-come-up-with'],
            { id: 'en.ex.qbyhn1mm9j0prt' },
          ),
          ex.translateWrite(
            'El teléfono fue un gran invento.',
            'The telephone was a great invention.',
            ['en-invention'],
            {
              id: 'en.ex.8bk9490dv0gj4r',
              acceptedAnswers: [
                'The phone was a great invention.',
                'The telephone was a big invention.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Información extra entre comas',
        objective: 'Agregar información con oraciones de relativo explicativas y which.',
        intro: {
          explanation:
            'Las explicativas van entre comas y dan información extra: The telephone, which was invented in 1876, … No se usa that. Which también puede retomar toda una idea: One experiment failed, which was frustrating (lo cual). Most of which y many of whom: la mayoría de los cuales, muchos de los cuales.',
          examples: [
            {
              target: 'One of our experiments failed, which was very frustrating.',
              base: 'Uno de nuestros experimentos falló, lo cual fue muy frustrante.',
            },
            {
              target: 'I have many books, most of which I have never read.',
              base: 'Tengo muchos libros, la mayoría de los cuales nunca leí.',
            },
          ],
        },
        takeaways: [
          'Agregas información extra entre comas con which y who.',
          'Retomas toda una idea con which y hablas de partes con most of which.',
        ],
        exercises: [
          ex.fillBlank(
            'The telephone, ___ was invented in 1876, changed the world.',
            'El teléfono, que se inventó en 1876, cambió el mundo.',
            'which',
            ['that', 'whose', 'who'],
            ['en-invention'],
            {
              id: 'en.ex.1c5fux45nd9rdd',
              explanation:
                'En una explicativa (entre comas) no se usa that: which para cosas, who para personas.',
            },
          ),
          ex.fillBlank(
            'One of our experiments failed, ___ was very frustrating.',
            'Uno de nuestros experimentos falló, lo cual fue muy frustrante.',
            'which',
            ['that', 'what', 'who'],
            ['en-experiment'],
            {
              id: 'en.ex.ff360k83n2n5wi',
              explanation: 'Which retoma toda la oración anterior (lo cual).',
            },
          ),
          ex.fillBlank(
            'I have many books, most of ___ I have never read.',
            'Tengo muchos libros, la mayoría de los cuales nunca leí.',
            'which',
            ['them', 'that', 'whose'],
            ['en-most-of-which'],
            {
              id: 'en.ex.n67nu3hlc29u61',
              explanation: 'Most of which: después de una coma, no se repite them.',
            },
          ),
          question(
            'en.ex.7nwzafx7b9xess',
            INTERVIEW,
            '¿Cómo son la mayoría de los pueblos donde probaron el filtro?',
            'No tienen agua limpia',
            ['Están cerca del laboratorio', 'Tienen mucho sol', 'Son muy grandes'],
            ['en-most-of-which'],
            'Mei dice: «We have tested it in forty villages, most of which have no clean water».',
          ),
          question(
            'en.ex.h0ts58xfkn7tmi',
            MUSEUM,
            '¿Por qué se recuerda a Marie Curie en el cartel?',
            'Sus descubrimientos cambiaron la medicina y ganó dos premios Nobel',
            ['Inventó el teléfono', 'Creó la World Wide Web', 'Fue la primera médica'],
            ['en-whose', 'en-discovery'],
            'El cartel dice: «Marie Curie, whose discoveries changed medicine, was the first person to win two Nobel Prizes».',
          ),
          ex.listenChoice(
            'I have many books, most of which I have never read.',
            [
              'I have many books, all of which I have read.',
              'I have some books, most of which I have never read.',
              'I have many books, which I have never read.',
            ],
            ['en-most-of-which'],
            { id: 'en.ex.p8h1v4jgy79dro' },
          ),
          ex.orderWords(
            'My brother who lives in London is a scientist.',
            'Mi hermano que vive en Londres es científico.',
            ['en-scientist'],
            { id: 'en.ex.2d7g1gpbk33d3q' },
          ),
          ex.shortAnswer(
            'How did the experiment go? (falló, lo cual fue frustrante)',
            '¿Cómo salió el experimento?',
            'It failed, which was frustrating.',
            [
              'It failed, which was very frustrating.',
              'The experiment failed, which was frustrating.',
              'It failed which was frustrating.',
            ],
            ['en-experiment'],
            { id: 'en.ex.js8jbcufu7i7oq' },
          ),
          ex.translateWrite(
            'Tengo muchos libros, la mayoría de los cuales nunca leí.',
            'I have many books, most of which I have never read.',
            ['en-most-of-which'],
            {
              id: 'en.ex.ym8vlngfo1swx0',
              acceptedAnswers: [
                "I have many books, most of which I've never read.",
                'I have a lot of books, most of which I have never read.',
                'I have many books, most of which I never read.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Máquinas que piensan',
        objective: 'Opinar sobre la inteligencia artificial, los datos y la privacidad.',
        intro: {
          explanation:
            'Artificial intelligence (AI) es la inteligencia artificial. Data (datos) se usa casi siempre como incontable: the data is / are. Privacy es la privacidad. Rely on es depender de algo o confiar en que funcione: We rely on our phones.',
          examples: [
            {
              target: 'We rely on our phones for everything.',
              base: 'Dependemos del teléfono para todo.',
            },
            {
              target: 'I worry about my privacy online.',
              base: 'Me preocupa mi privacidad en internet.',
            },
          ],
        },
        takeaways: [
          'Hablas de la inteligencia artificial, los datos y la privacidad.',
          'Dices de qué dependes con rely on.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['artificial intelligence', 'inteligencia artificial'],
              ['data', 'datos'],
              ['privacy', 'privacidad'],
              ['rely on', 'depender de / confiar en'],
            ],
            ['en-artificial-intelligence', 'en-data', 'en-privacy', 'en-rely-on'],
            { id: 'en.ex.ydsr4q8nv97xfd' },
          ),
          ex.fillBlank(
            'We rely ___ our phones for everything.',
            'Dependemos del teléfono para todo.',
            'on',
            ['in', 'of', 'for'],
            ['en-rely-on'],
            {
              id: 'en.ex.3mbfb5yhrq8pdt',
              skill: 'vocabulary',
              explanation: 'Rely on (no «rely of»): depender de.',
            },
          ),
          ex.fillBlank(
            'The app collects ___ about your location.',
            'La aplicación recoge datos sobre tu ubicación.',
            'data',
            ['privacy', 'evidence', 'innovation'],
            ['en-data'],
            { id: 'en.ex.61j2fwou9zp144', skill: 'vocabulary' },
          ),
          question(
            'en.ex.m0lq6840utlkru',
            AI_ARTICLE,
            'Según el autor, ¿cuál es «exactamente el problema»?',
            'Que dependemos de la IA todos los días sin pensarlo',
            [
              'Que la IA es muy cara',
              'Que los médicos no la usan',
              'Que la IA elige mal las canciones',
            ],
            ['en-rely-on', 'en-artificial-intelligence'],
            'El artículo dice: «Most of us rely on it every day without thinking about it. That is exactly the problem».',
          ),
          question(
            'en.ex.zne4edunlbw80s',
            AI_ARTICLE,
            '¿Por qué la IA plantea preguntas sobre la privacidad?',
            'Porque necesita muchos datos, gran parte de nuestros teléfonos',
            ['Porque es muy lenta', 'Porque no funciona sin internet', 'Porque la usan los bancos'],
            ['en-data', 'en-privacy'],
            'El artículo dice: «these systems need huge amounts of data, much of which comes from our phones… which raises serious questions about privacy».',
          ),
          question(
            'en.ex.yke8dqfidtt8sr',
            AI_ARTICLE,
            '¿Cuál es la postura del autor sobre la innovación?',
            'No hay que rechazarla, pero hay que saber cómo se usan nuestros datos',
            ['Hay que prohibirla', 'No tiene ningún riesgo', 'Sólo deberían usarla los médicos'],
            ['en-innovation'],
            'El artículo dice: «This does not mean we should reject innovation. But we should know who collects our data».',
          ),
          ex.listenChoice(
            'I worry about my privacy online.',
            [
              "I don't worry about my privacy online.",
              'I worry about my data online.',
              'I worried about my privacy online.',
            ],
            ['en-privacy'],
            { id: 'en.ex.3k3bpdbu0bovm6' },
          ),
          ex.orderWords(
            'Artificial intelligence helps doctors read X-rays.',
            'La inteligencia artificial ayuda a los médicos a leer radiografías.',
            ['en-artificial-intelligence'],
            { id: 'en.ex.suenuj7ha8j9i7' },
          ),
          ex.shortAnswer(
            'What do you think about apps that collect your data? (te preocupa tu privacidad)',
            '¿Qué piensas de las aplicaciones que recogen tus datos?',
            'I worry about my privacy.',
            [
              'I am worried about my privacy.',
              "I'm worried about my privacy.",
              'I worry about my privacy online.',
            ],
            ['en-privacy'],
            { id: 'en.ex.rttlhf0ycssjlw' },
          ),
          ex.translateWrite(
            'Dependemos del teléfono para todo.',
            'We rely on our phones for everything.',
            ['en-rely-on'],
            {
              id: 'en.ex.056tbykx26j0xk',
              acceptedAnswers: [
                'We rely on our phone for everything.',
                'We rely on phones for everything.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Ponerse al día',
        objective: 'Hablar de tecnología nueva y vieja y de cómo seguirle el ritmo.',
        intro: {
          explanation:
            'Keep up with es mantenerse al día, seguir el ritmo: It’s hard to keep up with technology. Algo outdated está anticuado; algo cutting-edge es de vanguardia. Con which puedes agregar un comentario: My phone, which I bought ten years ago, still works.',
          examples: [
            {
              target: "It's hard to keep up with technology.",
              base: 'Es difícil mantenerse al día con la tecnología.',
            },
            {
              target: 'The lab uses cutting-edge technology.',
              base: 'El laboratorio usa tecnología de vanguardia.',
            },
          ],
        },
        takeaways: [
          'Cuentas si te cuesta seguirle el ritmo a la tecnología.',
          'Describes algo como outdated o cutting-edge.',
        ],
        exercises: [
          ex.translationChoice(
            'outdated',
            'anticuado / desactualizado',
            ['de vanguardia / de última generación', 'flexible', 'generalizado / extendido'],
            ['en-outdated'],
            { id: 'en.ex.jhb45q8exjveft' },
          ),
          ex.fillBlank(
            "It's hard to keep up ___ technology.",
            'Es difícil mantenerse al día con la tecnología.',
            'with',
            ['to', 'on', 'for'],
            ['en-keep-up-with'],
            { id: 'en.ex.hz4109039vdgex', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'The lab uses ___ technology.',
            'El laboratorio usa tecnología de vanguardia.',
            'cutting-edge',
            ['outdated', 'average', 'lonely'],
            ['en-cutting-edge'],
            { id: 'en.ex.7mc50vjho8zrcj', skill: 'vocabulary' },
          ),
          question(
            'en.ex.d4oxzcl1epgg0i',
            GRANDMA,
            '¿Por qué la abuela no quiere cambiar su teléfono al principio?',
            'Porque hace llamadas, que es lo único que necesita',
            ['Porque es nuevo', 'Porque no tiene dinero', 'Porque no le gustan las cámaras'],
            ['en-outdated'],
            'La abuela dice: «It makes calls, which is all I need».',
          ),
          question(
            'en.ex.hzctrw6qtxpv8c',
            GRANDMA,
            '¿Qué le ofrece Dani a su abuela?',
            'Su teléfono viejo, que es mucho más nuevo, y enseñarle a usarlo',
            ['Un teléfono de última generación', 'Comprarle un teléfono', 'Arreglar su teléfono'],
            ['en-keep-up-with', 'en-cutting-edge'],
            'Dani dice: «My old phone, which I don’t use anymore, is much newer than yours… And I’ll teach you how to use it».',
          ),
          ex.listenChoice(
            "It's hard to keep up with technology.",
            [
              "It's easy to keep up with technology.",
              "It's hard to keep up with the news.",
              'It was hard to keep up with technology.',
            ],
            ['en-keep-up-with'],
            { id: 'en.ex.6uwi4z6wg2xeli' },
          ),
          ex.orderWords(
            'My phone which I bought ten years ago still works.',
            'Mi teléfono, que compré hace diez años, todavía funciona.',
            ['en-outdated'],
            { id: 'en.ex.4m5wyigtlg1xg8' },
          ),
          ex.shortAnswer(
            'Why do you want a new laptop? (el tuyo está muy anticuado)',
            '¿Por qué quieres una computadora nueva?',
            'Mine is very outdated.',
            [
              'My laptop is very outdated.',
              'Mine is so outdated.',
              'Because mine is very outdated.',
            ],
            ['en-outdated'],
            { id: 'en.ex.mx0hohurvxp99f' },
          ),
          ex.translateWrite(
            'Es difícil mantenerse al día con la tecnología.',
            "It's hard to keep up with technology.",
            ['en-keep-up-with'],
            {
              id: 'en.ex.z5vb39c8hugjg6',
              acceptedAnswers: [
                'It is hard to keep up with technology.',
                'It is difficult to keep up with technology.',
                "It's difficult to keep up with technology.",
              ],
            },
          ),
        ],
      },
    ],
  },
};

import type { ExpansionUnitDef } from '../../a2-expansion';
import { ex } from '../../builders';
import { dialogue, question, reading } from './context-helpers';
import { w } from './word';

/**
 * A2 U15 «Cómo es» (docs/A2_EN_COMPLETION.md): el aspecto (What does she look like?), el carácter
 * (What is she like?), describir un barrio y comparar personas y lugares. Supone A1 (familia de U4,
 * la casa de U6) y A2 U1–U14 (pelo de U9, comparativos y superlativos de U7).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NEW_COWORKER = dialogue(
  'en.stim.a2-u15-coworker',
  'Mia y Leo hablan de una compañera nueva.',
  [
    ['Mia', "Who's that girl?"],
    ['Leo', "That's Emma. She's my new coworker."],
    ['Mia', "What's she like?"],
    ['Leo', "She's very kind and funny."],
    ['Mia', 'And what does she look like? Is she tall?'],
    ['Leo', "No, she's short, and she has curly hair."],
  ],
);

const NEIGHBORHOOD = reading(
  'en.stim.a2-u15-neighborhood',
  'description',
  'Emma describe su barrio.',
  [
    'I live in a quiet neighborhood near the station.',
    'The streets are old, but they are clean.',
    'There is a small park and a big supermarket.',
    'On Saturdays the park is crowded with children.',
    'I love my neighborhood!',
  ],
  { title: 'My neighborhood', from: 'Emma' },
);

const TWO_CITIES = dialogue('en.stim.a2-u15-two-cities', 'Leo y Mia comparan dos ciudades.', [
  ['Leo', 'Which city do you like more, London or Madrid?'],
  ['Mia', 'Madrid is warmer, but London is more interesting.'],
  ['Leo', 'And which is more crowded?'],
  ['Mia', "London. It's the most crowded city I know."],
]);

const GRANDFATHER = reading(
  'en.stim.a2-u15-grandfather',
  'post',
  'Leo publica una foto de su abuelo.',
  [
    'This is my grandfather, Tom.',
    'He is eighty years old.',
    'He is short and thin, and he has a white beard.',
    'He wears glasses because he reads a lot.',
    "He's very kind and funny. I love my grandfather!",
  ],
  { from: 'Leo' },
);

export const EN_A2_U15: ExpansionUnitDef = {
  names: ['Mia', 'Leo', 'Emma', 'Tom', 'London', 'Madrid'],
  unit: {
    position: 15,
    title: 'Cómo es',
    titleEn: 'Describing people and places',
    description:
      'El aspecto y el carácter de una persona, tu barrio y cómo comparar personas y lugares.',
    emoji: '🧑‍🦱',
    objective: 'Puedes describir a una persona y un lugar, y compararlos.',
    grammar: {
      title: 'Look like y be like',
      explanation:
        'What does she look like? pregunta por el aspecto; What is she like?, por el carácter. El aspecto se describe con be (She is tall) y con have (She has curly hair).',
      examples: [
        { target: 'What does she look like?', base: '¿Cómo es (físicamente)?' },
        { target: 'She has long blond hair.', base: 'Tiene el pelo largo y rubio.' },
        { target: "What's he like? He's friendly.", base: '¿Cómo es (de carácter)? Es simpático.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 completo: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-look-like',
        'look like',
        'ser (de aspecto) / parecerse a',
        '/ˈlʊk laɪk/',
        undefined,
        'What does she look like?',
        '¿Cómo es ella (físicamente)?',
        ['description'],
        ['parecerse a', 'parecerse'],
      ),
      w(
        'en-beard',
        'beard',
        'barba',
        '/bɪrd/',
        '🧔',
        'My father has a beard.',
        'Mi papá tiene barba.',
        ['description'],
      ),
      w(
        'en-glasses',
        'glasses',
        'lentes',
        '/ˈɡlæsəz/',
        '👓',
        'She wears glasses.',
        'Ella usa lentes.',
        ['description'],
        ['lentes', 'gafas', 'anteojos'],
      ),
      w(
        'en-curly',
        'curly',
        'enrulado / rizado',
        '/ˈkɜrli/',
        undefined,
        'He has curly hair.',
        'Tiene el pelo enrulado.',
        ['description'],
        ['enrulado', 'enrulada', 'rizado', 'rizada', 'con rulos'],
      ),
      w(
        'en-blond',
        'blond',
        'rubio / rubia',
        '/blɑnd/',
        '👱',
        'She has long blond hair.',
        'Tiene el pelo largo y rubio.',
        ['description'],
        ['rubio', 'rubia'],
        ['blonde'],
      ),
      w(
        'en-dark',
        'dark',
        'oscuro / morocho',
        '/dɑrk/',
        undefined,
        'He has short dark hair.',
        'Tiene el pelo corto y oscuro.',
        ['description'],
        ['oscuro', 'oscura', 'morocho', 'morocha'],
      ),
      w(
        'en-thin',
        'thin',
        'delgado / flaco',
        '/θɪn/',
        undefined,
        'My brother is tall and thin.',
        'Mi hermano es alto y flaco.',
        ['description'],
        ['delgado', 'delgada', 'flaco', 'flaca'],
      ),
      w(
        'en-friendly',
        'friendly',
        'simpático / amigable',
        '/ˈfrɛndli/',
        undefined,
        'Our teacher is very friendly.',
        'Nuestra profesora es muy simpática.',
        ['personality'],
        ['simpático', 'simpática', 'amigable'],
      ),
      w(
        'en-kind',
        'kind',
        'amable',
        '/kaɪnd/',
        undefined,
        'My grandmother is very kind.',
        'Mi abuela es muy amable.',
        ['personality'],
      ),
      w(
        'en-funny',
        'funny',
        'gracioso / graciosa',
        '/ˈfʌni/',
        '😄',
        'My brother is very funny.',
        'Mi hermano es muy gracioso.',
        ['personality'],
        ['gracioso', 'graciosa', 'chistoso', 'chistosa'],
      ),
      w(
        'en-shy',
        'shy',
        'tímido / tímida',
        '/ʃaɪ/',
        '🙈',
        "He's shy, but he's very nice.",
        'Es tímido, pero es muy buena persona.',
        ['personality'],
        ['tímido', 'tímida'],
      ),
      w(
        'en-quiet',
        'quiet',
        'tranquilo / silencioso',
        '/ˈkwaɪət/',
        '🤫',
        'I live in a quiet street.',
        'Vivo en una calle tranquila.',
        ['places', 'personality'],
        ['tranquilo', 'tranquila', 'silencioso', 'silenciosa', 'callado', 'callada'],
      ),
      w(
        'en-noisy',
        'noisy',
        'ruidoso / ruidosa',
        '/ˈnɔɪzi/',
        '🔊',
        'The city is very noisy.',
        'La ciudad es muy ruidosa.',
        ['places'],
        ['ruidoso', 'ruidosa'],
      ),
      w(
        'en-crowded',
        'crowded',
        'lleno de gente',
        '/ˈkraʊdəd/',
        undefined,
        'The beach is very crowded in summer.',
        'En verano la playa está llena de gente.',
        ['places'],
        ['llena de gente', 'repleto', 'repleta'],
      ),
      w(
        'en-modern',
        'modern',
        'moderno / moderna',
        '/ˈmɑdərn/',
        undefined,
        'They live in a modern house.',
        'Viven en una casa moderna.',
        ['places'],
        ['moderno', 'moderna'],
      ),
      w(
        'en-dirty',
        'dirty',
        'sucio / sucia',
        '/ˈdɜrti/',
        undefined,
        'The street is dirty.',
        'La calle está sucia.',
        ['places'],
        ['sucio', 'sucia'],
      ),
      w(
        'en-neighborhood',
        'neighborhood',
        'barrio',
        '/ˈneɪbərˌhʊd/',
        '🏘️',
        'My neighborhood is quiet.',
        'Mi barrio es tranquilo.',
        ['places'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Cómo es físicamente?',
        objective: 'Preguntar y decir cómo es alguien físicamente.',
        intro: {
          explanation:
            'Para preguntar por el aspecto de alguien: What does he look like? Se responde con be (He is tall and thin) o con have para el pelo, la barba o los lentes (She has curly hair. He has a beard).',
          examples: [
            { target: 'What does she look like?', base: '¿Cómo es (físicamente)?' },
            { target: 'She has long blond hair.', base: 'Tiene el pelo largo y rubio.' },
          ],
        },
        takeaways: [
          'Preguntas por el aspecto con What does he look like?',
          'Describes el pelo y la cara con have: She has curly hair.',
        ],
        exercises: [
          ex.imageChoice('🧔', 'beard', ['glasses', 'hair', 'hat'], ['en-beard'], {
            id: 'en.ex.dt32dimszr09em',
          }),
          ex.imageChoice('👓', 'glasses', ['beard', 'eye', 'hat'], ['en-glasses'], {
            id: 'en.ex.6dau3of5r18wvg',
          }),
          ex.fillBlank(
            'She ___ long blond hair.',
            'Tiene el pelo largo y rubio.',
            'has',
            ['is', 'have', 'does'],
            ['en-blond', 'en-has', 'en-hair'],
            {
              id: 'en.ex.5zvq6a03ji7gt0',
              explanation:
                'Para el pelo, la barba o los lentes se usa have/has: She has blond hair.',
            },
          ),
          ex.fillBlank(
            'What does he look ___?',
            '¿Cómo es él (físicamente)?',
            'like',
            ['as', 'at', 'for'],
            ['en-look-like'],
            { id: 'en.ex.9mni96jfuv50n1' },
          ),
          ex.matchPairs(
            [
              ['curly', 'enrulado / rizado'],
              ['blond', 'rubio / rubia'],
              ['dark', 'oscuro / morocho'],
              ['thin', 'delgado / flaco'],
            ],
            ['en-curly', 'en-blond', 'en-dark', 'en-thin'],
            { id: 'en.ex.gvsde9c1i8yc74' },
          ),
          ex.listenChoice(
            'He is tall and thin, and he has a beard.',
            [
              'He is short and thin, and he has a beard.',
              'He is tall and thin, and he has glasses.',
              'She is tall and thin, and she has a beard.',
            ],
            ['en-thin', 'en-beard', 'en-tall'],
            { id: 'en.ex.ad09e0tmywtifo' },
          ),
          ex.orderWords(
            'My sister has short curly hair.',
            'Mi hermana tiene el pelo corto y enrulado.',
            ['en-curly', 'en-short', 'en-hair', 'en-sister'],
            {
              id: 'en.ex.pxcdmvl8bt9wja',
            },
          ),
          ex.translateWrite(
            'Mi papá tiene barba.',
            'My father has a beard.',
            ['en-beard', 'en-father'],
            {
              id: 'en.ex.lkcnj1rybg0dpk',
              acceptedAnswers: ['My dad has a beard.'],
            },
          ),
          ex.translateWrite('Ella usa lentes.', 'She wears glasses.', ['en-glasses', 'en-wear'], {
            id: 'en.ex.bp1aaj7q1r7f61',
            acceptedAnswers: ['She has glasses.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '¿Cómo es de carácter?',
        objective: 'Describir el carácter de una persona.',
        intro: {
          explanation:
            'What is she like? pregunta por el carácter (¿cómo es como persona?), y What does she look like?, por el aspecto. El carácter se describe con be: She is kind and funny.',
          examples: [
            { target: 'What is your teacher like?', base: '¿Cómo es tu profesor?' },
            { target: "She's very friendly.", base: 'Es muy simpática.' },
          ],
        },
        takeaways: [
          'Distingues What is she like? (carácter) de What does she look like? (aspecto).',
          'Describes el carácter: friendly, kind, funny, shy.',
        ],
        exercises: [
          ex.translationChoice(
            'shy',
            'tímido / tímida',
            ['gracioso / graciosa', 'amable', 'enojado / enojada'],
            ['en-shy'],
            { id: 'en.ex.irbc8e9dwapnbg' },
          ),
          ex.matchPairs(
            [
              ['friendly', 'simpático / amigable'],
              ['kind', 'amable'],
              ['funny', 'gracioso / graciosa'],
              ['shy', 'tímido / tímida'],
            ],
            ['en-friendly', 'en-kind', 'en-funny', 'en-shy'],
            { id: 'en.ex.dzvolg1m4k7kap' },
          ),
          ex.fillBlank(
            "My brother makes me laugh. He's very ___.",
            'Mi hermano me hace reír. Es muy gracioso.',
            'funny',
            ['shy', 'sad', 'angry'],
            ['en-funny', 'en-laugh'],
            { id: 'en.ex.zzq1qcd66l1qzv', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'What ___ your new boss like? She is very kind.',
            '¿Cómo es tu nueva jefa? Es muy amable.',
            'is',
            ['does', 'do', 'has'],
            ['en-kind', 'en-boss'],
            {
              id: 'en.ex.rm1oevpf2zs80w',
              explanation: 'Para el carácter: What is she like? (con be y sin look).',
            },
          ),
          ex.listenChoice(
            "She's friendly, but she's very shy.",
            [
              "She's funny, but she's very shy.",
              "She's friendly, and she's very kind.",
              "He's friendly, but he's very shy.",
            ],
            ['en-friendly', 'en-shy'],
            { id: 'en.ex.qfm49qbk8mk4ay' },
          ),
          question(
            'en.ex.l17hd88s5oyqmg',
            NEW_COWORKER,
            '¿Cómo es Emma de carácter?',
            'Amable y graciosa',
            ['Tímida y callada', 'Graciosa, pero poco amable', 'Seria y tímida'],
            ['en-kind', 'en-funny'],
            'Leo dice: «She’s very kind and funny».',
          ),
          question(
            'en.ex.lp1hop6i6vsozk',
            NEW_COWORKER,
            '¿Cómo es Emma físicamente?',
            'Baja y con el pelo enrulado',
            ['Alta y con el pelo enrulado', 'Baja y rubia, con el pelo lacio', 'Alta y con lentes'],
            ['en-look-like', 'en-curly', 'en-short'],
            'Leo responde: «No, she’s short, and she has curly hair».',
          ),
          ex.shortAnswer(
            'What is your best friend like? (simpático y gracioso)',
            '¿Cómo es tu mejor amigo?',
            "He's friendly and funny.",
            [
              "She's friendly and funny.",
              "He's funny and friendly.",
              "She's funny and friendly.",
              'Friendly and funny.',
            ],
            ['en-friendly', 'en-funny'],
            { id: 'en.ex.vq9cqecr9hi7di' },
          ),
          ex.translateWrite(
            'Mi abuela es muy amable.',
            'My grandmother is very kind.',
            ['en-kind', 'en-grandmother'],
            {
              id: 'en.ex.xmgo82ti1lhown',
              acceptedAnswers: ['My grandma is very kind.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Mi barrio',
        objective: 'Describir un barrio y un lugar.',
        intro: {
          explanation:
            'Un lugar se describe con be + adjetivo (The street is quiet) o con el adjetivo antes del sustantivo (a quiet street). Con there is y there are cuentas qué hay en tu barrio (neighborhood).',
          examples: [
            { target: 'I live in a quiet neighborhood.', base: 'Vivo en un barrio tranquilo.' },
            {
              target: 'The city is noisy and crowded.',
              base: 'La ciudad es ruidosa y está llena de gente.',
            },
          ],
        },
        takeaways: [
          'Describes un lugar: quiet, noisy, crowded, modern, dirty.',
          'Cuentas qué hay en tu barrio con there is y there are.',
        ],
        exercises: [
          ex.imageChoice('🔊', 'noisy', ['quiet', 'dirty', 'modern'], ['en-noisy'], {
            id: 'en.ex.8ylx7bgmp4fqs9',
          }),
          ex.translationChoice(
            'crowded',
            'lleno de gente',
            ['tranquilo / silencioso', 'sucio / sucia', 'moderno / moderna'],
            ['en-crowded'],
            { id: 'en.ex.u267zyfw6o5iai' },
          ),
          ex.fillBlank(
            "It's very ___ here. I can't sleep!",
            '¡Hay mucho ruido aquí! No puedo dormir.',
            'noisy',
            ['quiet', 'modern', 'early'],
            ['en-noisy', 'en-sleep'],
            { id: 'en.ex.85uwytsmucp5kg', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I live in a ___ neighborhood. There are no cars.',
            'Vivo en un barrio tranquilo. No hay autos.',
            'quiet',
            ['noisy', 'crowded', 'dirty'],
            ['en-quiet', 'en-neighborhood'],
            { id: 'en.ex.1v6a1rk003z7er', skill: 'vocabulary' },
          ),
          ex.matchPairs(
            [
              ['quiet', 'tranquilo / silencioso'],
              ['noisy', 'ruidoso / ruidosa'],
              ['modern', 'moderno / moderna'],
              ['dirty', 'sucio / sucia'],
            ],
            ['en-quiet', 'en-noisy', 'en-modern', 'en-dirty'],
            { id: 'en.ex.mmtptnakc4bks6' },
          ),
          ex.listenChoice(
            'The beach is very crowded in summer.',
            [
              'The beach is very quiet in summer.',
              'The beach is very crowded in winter.',
              'The park is very crowded in summer.',
            ],
            ['en-crowded', 'en-beach', 'en-summer'],
            { id: 'en.ex.vm4s5aswizv9zh' },
          ),
          question(
            'en.ex.okjt8fkbgg7wh8',
            NEIGHBORHOOD,
            '¿Cómo es el barrio de Emma?',
            'Tranquilo y con calles limpias',
            ['Ruidoso y moderno', 'Moderno, con calles sucias', 'Ruidoso, pero con calles limpias'],
            ['en-quiet', 'en-neighborhood'],
            'Emma escribe: «I live in a quiet neighborhood» y «The streets are old, but they are clean».',
          ),
          question(
            'en.ex.t3g0az3w8z2zyf',
            NEIGHBORHOOD,
            '¿Cuándo hay mucha gente en el parque?',
            'Los sábados',
            ['Los domingos', 'Todos los días', 'Nunca'],
            ['en-crowded', 'en-saturday'],
            'Emma escribe: «On Saturdays the park is crowded with children».',
          ),
          ex.shortAnswer(
            'Is your neighborhood quiet or noisy? (ruidoso)',
            '¿Tu barrio es tranquilo o ruidoso?',
            "It's noisy.",
            ['My neighborhood is noisy.', 'Noisy.', "It's very noisy."],
            ['en-noisy', 'en-neighborhood'],
            { id: 'en.ex.a2to5qcm7od81r' },
          ),
          ex.translateWrite(
            'La ciudad es moderna, pero sucia.',
            'The city is modern, but dirty.',
            ['en-modern', 'en-dirty', 'en-city'],
            {
              id: 'en.ex.qde8rc3y25jgsj',
              acceptedAnswers: [
                "The city is modern, but it's dirty.",
                'The city is modern but dirty.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Comparar personas y lugares',
        objective: 'Comparar personas y lugares con los comparativos.',
        intro: {
          explanation:
            'Con lo que aprendiste en «Comparar» puedes comparar personas y lugares. Los adjetivos cortos terminados en -y cambian la y por -ier: noisy → noisier, funny → funnier. Y los cortos con una vocal y una consonante la duplican: thin → thinner.',
          examples: [
            { target: 'My brother is thinner than me.', base: 'Mi hermano es más flaco que yo.' },
            {
              target: 'The city is noisier than my neighborhood.',
              base: 'La ciudad es más ruidosa que mi barrio.',
            },
          ],
        },
        takeaways: [
          'Comparas personas: taller than, funnier than.',
          'Comparas lugares: quieter than, the most crowded.',
        ],
        exercises: [
          ex.fillBlank(
            'The city is ___ than my neighborhood.',
            'La ciudad es más ruidosa que mi barrio.',
            'noisier',
            ['noisy', 'noisiest', 'the noisiest'],
            ['en-noisy', 'en-than'],
            {
              id: 'en.ex.kb33xams4xmeaf',
              explanation: 'Con than va el comparativo: noisy → noisier (la y cambia por -ier).',
            },
          ),
          ex.fillBlank(
            'Sunday is the ___ day of the week.',
            'El domingo es el día más tranquilo de la semana.',
            'quietest',
            ['quieter', 'quiet', 'more quiet'],
            ['en-quiet'],
            {
              id: 'en.ex.qmkk9khu8tfcjy',
              explanation: 'Con the va el superlativo: quiet → the quietest.',
            },
          ),
          ex.fillBlank(
            'Leo is ___ than his brother. He always makes me laugh.',
            'Leo es más gracioso que su hermano. Siempre me hace reír.',
            'funnier',
            ['funny', 'funniest', 'the funniest'],
            ['en-funny', 'en-than'],
            { id: 'en.ex.v5xrdc0bhbzdum' },
          ),
          ex.listenChoice(
            'My brother is taller and thinner than me.',
            [
              'My brother is shorter and thinner than me.',
              'My brother is taller and thinner than you.',
              'My sister is taller and thinner than me.',
            ],
            ['en-thin', 'en-than'],
            { id: 'en.ex.74l1dm94c01gnm' },
          ),
          ex.orderWords(
            'My neighborhood is quieter than the city.',
            'Mi barrio es más tranquilo que la ciudad.',
            ['en-quiet', 'en-neighborhood', 'en-than'],
            {
              id: 'en.ex.th2n72fm4on8lo',
            },
          ),
          question(
            'en.ex.hvalqqbzdi5h6n',
            TWO_CITIES,
            '¿Qué ciudad le parece más interesante a Mia?',
            'Londres',
            ['Madrid', 'Las dos por igual', 'Ninguna de las dos'],
            ['en-more', 'en-interesting'],
            'Mia dice: «London is more interesting».',
          ),
          question(
            'en.ex.kn2ia8gvyo0okg',
            TWO_CITIES,
            '¿Qué dice Mia de Madrid?',
            'Que es más cálida que Londres',
            [
              'Que es más interesante que Londres',
              'Que tiene más gente que Londres',
              'Que es la ciudad con más gente que conoce',
            ],
            ['en-warm', 'en-crowded'],
            'Mia dice: «Madrid is warmer». La ciudad con más gente es Londres: «It’s the most crowded city I know».',
          ),
          ex.shortAnswer(
            'Who is taller, you or your mother? (tú)',
            '¿Quién es más alto, tú o tu mamá?',
            "I'm taller than my mother.",
            ["I'm taller.", 'Me.', "I'm taller than her.", 'I am.'],
            ['en-tall', 'en-than'],
            { id: 'en.ex.4xbyaz01fqi2or' },
          ),
          ex.translateWrite(
            'El parque está más sucio que la calle.',
            'The park is dirtier than the street.',
            ['en-dirty', 'en-park', 'en-street'],
            {
              id: 'en.ex.8f7nbwwd0bls1r',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Describir a alguien',
        objective: 'Describir a una persona: aspecto y carácter.',
        intro: {
          explanation:
            'Para describir a una persona, empieza por el aspecto (He is tall. He has dark hair.) y sigue por el carácter (He is friendly and funny). Une las ideas con and, but y because.',
          examples: [
            {
              target: 'He has dark hair and he wears glasses.',
              base: 'Tiene el pelo oscuro y usa lentes.',
            },
            { target: "She's shy, but she's very kind.", base: 'Es tímida, pero es muy amable.' },
          ],
        },
        takeaways: [
          'Describes a una persona: aspecto y carácter.',
          'Unes ideas con and, but y because.',
        ],
        exercises: [
          question(
            'en.ex.odiy5d7tsr08on',
            GRANDFATHER,
            '¿Cómo es el abuelo de Leo físicamente?',
            'Bajo, delgado y con barba blanca',
            [
              'Alto, delgado y con barba blanca',
              'Bajo, delgado y sin barba',
              'Alto y con el pelo enrulado',
            ],
            ['en-thin', 'en-beard'],
            'Leo escribe: «He is short and thin, and he has a white beard».',
          ),
          question(
            'en.ex.bh66m057i0oqeo',
            GRANDFATHER,
            '¿Por qué usa lentes?',
            'Porque lee mucho',
            ['Porque es viejo', 'Porque maneja', 'Porque mira películas'],
            ['en-glasses', 'en-because'],
            'Leo escribe: «He wears glasses because he reads a lot».',
          ),
          ex.fillBlank(
            "He's shy, ___ he's very friendly.",
            'Es tímido, pero es muy simpático.',
            'but',
            ['and', 'because', 'or'],
            ['en-shy', 'en-friendly', 'en-but'],
            { id: 'en.ex.o30m6kh1k0f9db' },
          ),
          ex.listenChoice(
            'She has long dark hair and she wears glasses.',
            [
              'She has long blond hair and she wears glasses.',
              'She has short dark hair and she wears glasses.',
              'She has long dark hair and she wears a hat.',
            ],
            ['en-dark', 'en-glasses'],
            { id: 'en.ex.pozhnvyn93lwim' },
          ),
          ex.completeWord('n__ghborh__d', 'neighborhood', 'barrio', ['en-neighborhood'], {
            id: 'en.ex.p2jnt50spi98ie',
            explanation:
              'Neighborhood se escribe con ei y con oo (en inglés británico: neighbourhood).',
          }),
          ex.orderWords(
            'What does your best friend look like?',
            '¿Cómo es tu mejor amigo (físicamente)?',
            ['en-look-like', 'en-best', 'en-friend'],
            {
              id: 'en.ex.ut7skff3qjchnw',
            },
          ),
          ex.shortAnswer(
            'What does your father look like? (alto, con barba)',
            '¿Cómo es tu papá físicamente?',
            "He's tall and he has a beard.",
            [
              "He's tall and has a beard.",
              "He's tall. He has a beard.",
              "He's tall, with a beard.",
            ],
            ['en-look-like', 'en-beard', 'en-tall'],
            { id: 'en.ex.nppz0xvqlhuvdj' },
          ),
          ex.translateWrite(
            'Mi amiga es rubia y muy graciosa.',
            'My friend is blond and very funny.',
            ['en-blond', 'en-funny', 'en-friend'],
            {
              id: 'en.ex.bpk5gu66qpq83i',
              acceptedAnswers: [
                'My friend is blonde and very funny.',
                "My friend has blond hair and she's very funny.",
              ],
            },
          ),
        ],
      },
    ],
  },
};

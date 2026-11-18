import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U14 «Describing people» (docs/ES_A1_A2.md): describir cómo es alguien con ser + adjetivo
 * (es alto, es simpática), el pelo y los ojos con tener (tiene el pelo largo, los ojos verdes) y cómo
 * está con estar + adjetivo (estoy cansado, está contenta): ser frente a estar, segunda parte.
 * Concordancia de género y número. Falsos amigos: largo = long, simpático = friendly. Vocabulario
 * rioplatense: lindo, flaco, morocho. Pronunciación: pero (r simple) / perro (rr) / pelo (l).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const HERMANA = dialogue(
  'es.stim.a1-u14-hermana',
  'Sofía and Martín chat in a café about Martín’s sister.',
  [
    ['Sofía', '¿Cómo es tu hermana, Martín?'],
    ['Martín', 'Es alta y rubia. Tiene el pelo largo.'],
    ['Sofía', '¿Es seria?'],
    ['Martín', 'No, para nada. Es muy divertida y simpática.'],
    ['Sofía', '¿Y vos? ¿Cómo estás?'],
    ['Martín', 'Estoy muy cansado, pero contento.'],
  ],
  ES_A1_RATE,
);

const MENSAJE = reading(
  'es.stim.a1-u14-mensaje',
  'message',
  'Lucía sends a message to her friend Ana before they meet.',
  [
    '¡Hola, Ana!',
    'Hoy voy a la facultad con mi hermano Diego.',
    'Diego es alto y morocho.',
    'Tiene el pelo corto y los ojos verdes.',
    'Es muy simpático, pero un poco tímido.',
    'Chau, Lucía',
  ],
  { from: 'Lucía', to: 'Ana' },
);

export const ES_A1_U14: EsUnitDef = {
  names: ['Lucía', 'Ana', 'Diego', 'Martín', 'Sofía', 'Camila', 'Tomás', 'Valentina'],
  support: ['marrones', 'estamos'],
  unit: {
    position: 14,
    title: 'Describing people',
    titleEn: '¿Cómo es?',
    description:
      'Describe what people are like and what they look like with ser and tener, say how someone feels with estar, and make adjectives agree.',
    emoji: '🧑',
    objective:
      'You can describe what a person is like and what they look like (height, hair, eyes), and say how you or someone else feels right now.',
    grammar: {
      title: 'Ser or estar · adjectives agree',
      explanation:
        'To say what someone is like, use ser: es alto, es simpática, son divertidos. To say how someone is right now, a state that can change, use estar: estoy cansado, está contenta. Hair and eyes go with tener and the article: tiene el pelo largo, tengo los ojos verdes. Adjectives come after the noun and agree with the person: -o for a man, -a for a woman, and -s in the plural (alto, alta, altos, altas); joven is the same for both (plural jóvenes). Muy means very. Watch out for false friends: largo means long (not large) and simpático means friendly (not sympathetic). Argentine words: lindo (good-looking, guapo elsewhere), flaco (thin, delgado elsewhere) and morocho (dark-haired, moreno elsewhere).',
      examples: [
        {
          target: '¿Cómo es tu hermana? — Es alta y muy simpática.',
          base: 'What is your sister like? — She is tall and very friendly.',
        },
        {
          target: 'Tiene el pelo largo y los ojos verdes.',
          base: 'She has long hair and green eyes.',
        },
        { target: 'Hoy estoy cansado, pero contento.', base: 'Today I’m tired, but happy.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U14). Sin revisión nativa: revisar «morocho» (pelo oscuro; en algunas zonas también piel morena) y si conviene mencionar «castaño» además de «marrones» para los ojos. «Flaco» se presenta como neutro y cotidiano en la Argentina; «lindo» como equivalente de «guapo». Se evitan adjetivos sensibles (gordo, viejo).',
    },
    words: [
      w(
        'es-como-es',
        '¿cómo es?',
        'what is he like?',
        '¿Cómo es tu hermano?',
        'What is your brother like?',
        ['descriptions', 'questions'],
        { acceptedTranslations: ["what's she like?", 'what is she like?', "what's he like?"] },
      ),
      w(
        'es-lindo',
        'lindo',
        'good-looking',
        'Tu perro es muy lindo.',
        'Your dog is very cute.',
        ['descriptions', 'argentina'],
        {
          acceptedTranslations: ['pretty', 'cute', 'handsome'],
          acceptedTexts: ['linda', 'lindos', 'lindas'],
        },
      ),
      w(
        'es-joven',
        'joven',
        'young',
        'Mi profesora es muy joven.',
        'My teacher is very young.',
        ['descriptions'],
        { acceptedTexts: ['jóvenes'] },
      ),
      w(
        'es-simpatico',
        'simpático',
        'friendly',
        'Martín es muy simpático.',
        'Martín is very friendly.',
        ['descriptions'],
        {
          acceptedTranslations: ['nice'],
          acceptedTexts: ['simpática', 'simpáticos', 'simpáticas'],
          emoji: '😊',
        },
      ),
      w(
        'es-serio',
        'serio',
        'serious',
        'Mi papá es un poco serio.',
        'My dad is a bit serious.',
        ['descriptions'],
        { acceptedTexts: ['seria', 'serios', 'serias'] },
      ),
      w(
        'es-divertido',
        'divertido',
        'funny',
        'Mi abuela es muy divertida.',
        'My grandmother is very funny.',
        ['descriptions'],
        { acceptedTranslations: ['fun'], acceptedTexts: ['divertida', 'divertidos', 'divertidas'] },
      ),
      w('es-timido', 'tímido', 'shy', 'Sofía es tímida.', 'Sofía is shy.', ['descriptions'], {
        acceptedTexts: ['tímida', 'tímidos', 'tímidas'],
      }),
      w('es-alto', 'alto', 'tall', 'Mi hermano es alto.', 'My brother is tall.', ['descriptions'], {
        acceptedTexts: ['alta', 'altos', 'altas'],
      }),
      w(
        'es-bajo',
        'bajo',
        'short, not tall',
        'Mi mamá es baja.',
        'My mom is short.',
        ['descriptions'],
        { acceptedTexts: ['baja', 'bajos', 'bajas'] },
      ),
      w(
        'es-flaco',
        'flaco',
        'thin',
        'Diego es alto y flaco.',
        'Diego is tall and thin.',
        ['descriptions', 'argentina'],
        { acceptedTranslations: ['slim'], acceptedTexts: ['flaca', 'flacos', 'flacas'] },
      ),
      w(
        'es-el-pelo',
        'el pelo',
        'the hair',
        'Tengo el pelo negro.',
        'I have black hair.',
        ['body'],
        { acceptedTranslations: ['hair'] },
      ),
      w(
        'es-los-ojos',
        'los ojos',
        'the eyes',
        'Tengo los ojos marrones.',
        'I have brown eyes.',
        ['body'],
        { acceptedTranslations: ['eyes'], emoji: '👀' },
      ),
      w('es-rubio', 'rubio', 'blond', 'Camila es rubia.', 'Camila is blonde.', ['descriptions'], {
        acceptedTranslations: ['fair-haired', 'blonde'],
        acceptedTexts: ['rubia', 'rubios', 'rubias'],
      }),
      w(
        'es-morocho',
        'morocho',
        'dark-haired',
        'Tomás es morocho.',
        'Tomás has dark hair.',
        ['descriptions', 'argentina'],
        { acceptedTexts: ['morocha', 'morochos', 'morochas'] },
      ),
      w(
        'es-corto',
        'corto',
        'short, not long',
        'Tengo el pelo corto.',
        'I have short hair.',
        ['descriptions'],
        { acceptedTexts: ['corta', 'cortos', 'cortas'] },
      ),
      w(
        'es-largo',
        'largo',
        'long',
        'Ana tiene el pelo largo.',
        'Ana has long hair.',
        ['descriptions'],
        { acceptedTexts: ['larga', 'largos', 'largas'] },
      ),
      w('es-muy', 'muy', 'very', 'Mi gato es muy chico.', 'My cat is very small.', [
        'intensifiers',
      ]),
      w('es-estoy', 'estoy', 'I am (right now)', 'Hoy estoy cansada.', 'I’m tired today.', [
        'verbs',
      ]),
      w('es-cansado', 'cansado', 'tired', 'Estoy muy cansado.', 'I’m very tired.', ['states'], {
        acceptedTexts: ['cansada', 'cansados', 'cansadas'],
        emoji: '😴',
      }),
      w(
        'es-contento',
        'contento',
        'happy',
        'Mi mamá está muy contenta.',
        'My mom is very happy.',
        ['states'],
        {
          acceptedTranslations: ['glad'],
          acceptedTexts: ['contenta', 'contentos', 'contentas'],
          emoji: '😄',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Cómo es?',
        objective: 'Ask what someone is like and describe their personality.',
        intro: {
          explanation:
            'To ask what someone is like, say ¿cómo es? The answer uses ser: es simpático, es divertida. The adjective comes after the verb and changes with the person: -o for a man, -a for a woman. Muy means very. Careful: simpático means friendly, not sympathetic.',
          examples: [
            {
              target: '¿Cómo es tu hermano? — Es muy simpático.',
              base: 'What is your brother like? — He is very friendly.',
            },
            { target: 'Mi hermana es divertida.', base: 'My sister is funny.' },
          ],
        },
        takeaways: [
          'You ask what someone is like with ¿cómo es?',
          'You describe personality with es + adjective, ending in -o or -a.',
        ],
        exercises: [
          ex.translationChoice(
            'simpático',
            'friendly',
            ['serious', 'shy', 'funny'],
            ['es-simpatico'],
            { id: 'es.ex.g1oolk0xqhtowi' },
          ),
          ex.matchPairs(
            [
              ['simpático', 'friendly'],
              ['serio', 'serious'],
              ['divertido', 'funny'],
              ['tímido', 'shy'],
            ],
            ['es-simpatico', 'es-serio', 'es-divertido', 'es-timido'],
            { id: 'es.ex.wjv8q0175d7cva' },
          ),
          ex.fillBlank(
            'Mi hermana es muy ___.',
            'My sister is very friendly.',
            'simpática',
            ['simpático', 'simpáticos', 'seria'],
            ['es-simpatico', 'es-muy'],
            {
              id: 'es.ex.o5zmapgytxcsf9',
              explanation:
                'Hermana is a woman, so the adjective ends in -a: simpática. Simpático is for a man.',
            },
          ),
          ex.listenChoice(
            'Es muy divertido.',
            ['Es muy divertida.', 'Es muy tímido.', 'Es muy serio.'],
            ['es-divertido', 'es-muy'],
            { id: 'es.ex.e5wg7tio4x431z' },
          ),
          ex.translationChoice(
            '¿cómo es?',
            'what is he like?',
            ['how are you?', 'where is it?', "what's your name?"],
            ['es-como-es'],
            { id: 'es.ex.7b1ns4g0g1clvd' },
          ),
          ex.fillBlank(
            '¿Cómo ___ tu papá? — Es serio.',
            'What is your dad like? — He is serious.',
            'es',
            ['está', 'sos', 'soy'],
            ['es-como-es', 'es-serio'],
            {
              id: 'es.ex.6yqkm4u1vkudfg',
              explanation:
                'To ask what someone is like, use ser: ¿cómo es? ¿Cómo está? asks how someone is right now.',
            },
          ),
          ex.orderWords(
            'Mi hermano es muy tímido.',
            'My brother is very shy.',
            ['es-timido', 'es-muy'],
            {
              id: 'es.ex.hwnnv0lf11giwr',
            },
          ),
          ex.listenChoice(
            'Ella es seria.',
            ['Ella es simpática.', 'Él es serio.', 'Ella es tímida.'],
            ['es-serio'],
            { id: 'es.ex.blex0f0lnes7xt' },
          ),
          ex.translateWrite(
            'My mom is very funny.',
            'Mi mamá es muy divertida.',
            ['es-divertido', 'es-muy'],
            { id: 'es.ex.dnis0qjrfqpfdw', acceptedAnswers: ['Mi madre es muy divertida.'] },
          ),
          ex.shortAnswer(
            '¿Cómo es tu hermano?',
            'Say he is very friendly (use «Es muy…»).',
            'Es muy simpático.',
            ['Mi hermano es muy simpático.', 'Él es muy simpático.'],
            ['es-como-es', 'es-simpatico'],
            { id: 'es.ex.lwdwy2boj5nzmh' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Alto, bajo, flaco',
        objective: 'Describe what someone looks like: height, build and age.',
        intro: {
          explanation:
            'Appearance also goes with ser: es alto (tall), es bajo (short), es flaco (thin), es joven (young). Bajo is only for height; short hair is corto. In Argentina flaco is the everyday word (delgado elsewhere), and lindo means good-looking, pretty or cute (people here rarely say guapo). Joven is the same for men and women; the plural is jóvenes. The j in joven sounds like a strong h.',
          examples: [
            { target: 'Mi papá es alto y flaco.', base: 'My dad is tall and thin.' },
            { target: 'Mis abuelos son bajos.', base: 'My grandparents are short.' },
          ],
        },
        takeaways: [
          'You describe height and build with alto, bajo and flaco.',
          'You make adjectives plural with -s: altos, bajas, jóvenes.',
        ],
        exercises: [
          ex.translationChoice('alto', 'tall', ['short, not tall', 'thin', 'young'], ['es-alto'], {
            id: 'es.ex.if2im21mfez9nm',
          }),
          ex.matchPairs(
            [
              ['alto', 'tall'],
              ['bajo', 'short, not tall'],
              ['flaco', 'thin'],
              ['joven', 'young'],
            ],
            ['es-alto', 'es-bajo', 'es-flaco', 'es-joven'],
            { id: 'es.ex.bm5bb4n669vxzr' },
          ),
          ex.fillBlank(
            'Mi mamá no es alta. Es ___.',
            'My mom is not tall. She is short.',
            'baja',
            ['bajo', 'alto', 'alta'],
            ['es-bajo', 'es-alto'],
            {
              id: 'es.ex.sip751vh3plkz5',
              explanation: 'The opposite of alta is baja, with -a because mamá is a woman.',
            },
          ),
          ex.listenChoice(
            'Es alto y flaco.',
            ['Es bajo y flaco.', 'Es alto y joven.', 'Es alta y flaca.'],
            ['es-alto', 'es-flaco'],
            { id: 'es.ex.0ryn1ze2nqq6z2' },
          ),
          ex.translationChoice('lindo', 'good-looking', ['young', 'tall', 'funny'], ['es-lindo'], {
            id: 'es.ex.lxwq75n4ziuz58',
          }),
          ex.fillBlank(
            'Mis abuelos no son ___.',
            'My grandparents are not young.',
            'jóvenes',
            ['joven', 'altas', 'flacas'],
            ['es-joven'],
            {
              id: 'es.ex.c438yue5q1ilva',
              explanation:
                'Abuelos is plural, so joven becomes jóvenes (with an accent). Altas and flacas are feminine.',
            },
          ),
          ex.orderWords(
            'Tu perro es muy lindo.',
            'Your dog is very cute.',
            ['es-lindo', 'es-muy'],
            {
              id: 'es.ex.p8riuthiblratz',
            },
          ),
          ex.listenChoice(
            'Mi hermana es linda.',
            ['Mi hermana es alta.', 'Mi hermano es lindo.', 'Mi hermana es baja.'],
            ['es-lindo', 'es-alto'],
            { id: 'es.ex.wflzhl5zodz4os' },
          ),
          ex.translateWrite(
            'My brother is tall and thin.',
            'Mi hermano es alto y flaco.',
            ['es-alto', 'es-flaco'],
            { id: 'es.ex.zxdzoq90b8hnus', acceptedAnswers: ['Mi hermano es flaco y alto.'] },
          ),
          ex.shortAnswer(
            '¿Cómo es tu papá?',
            'Say he is short and young (use «Es…»).',
            'Es bajo y joven.',
            ['Mi papá es bajo y joven.', 'Es joven y bajo.', 'Él es bajo y joven.'],
            ['es-bajo', 'es-joven'],
            { id: 'es.ex.v8bkh6lv3rexy9' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'El pelo y los ojos',
        objective: 'Describe someone’s hair and eyes.',
        intro: {
          explanation:
            'For hair and eyes, Spanish uses tener with the article: tiene el pelo largo (she has long hair), tengo los ojos verdes (I have green eyes). The adjective goes after the noun. Careful: largo means long, not large (large is grande). Rubio is blond; in Argentina morocho means dark-haired. Listen to the difference: pero (but) has a quick tap like the tt in American butter, perro (dog) has a trilled rr, and pelo (hair) has an l.',
          examples: [
            {
              target: 'Tiene el pelo largo y los ojos verdes.',
              base: 'She has long hair and green eyes.',
            },
            {
              target: 'Soy morocha, pero mi hermano es rubio.',
              base: 'I have dark hair, but my brother is blond.',
            },
          ],
        },
        takeaways: [
          'You describe hair and eyes with tener: tiene el pelo corto.',
          'You know that largo means long and you can hear pero, perro and pelo.',
        ],
        exercises: [
          ex.translationChoice(
            'el pelo',
            'the hair',
            ['the eyes', 'the dog', 'the color'],
            ['es-el-pelo'],
            { id: 'es.ex.fjk2vkq4ll2cfc' },
          ),
          ex.matchPairs(
            [
              ['rubio', 'blond'],
              ['morocho', 'dark-haired'],
              ['corto', 'short, not long'],
              ['largo', 'long'],
            ],
            ['es-rubio', 'es-morocho', 'es-corto', 'es-largo'],
            { id: 'es.ex.n78jxbgvow2duy' },
          ),
          ex.fillBlank(
            'Ana tiene el pelo ___.',
            'Ana has long hair.',
            'largo',
            ['larga', 'grande', 'corta'],
            ['es-largo', 'es-el-pelo'],
            {
              id: 'es.ex.8wl66r44g2njo3',
              explanation:
                'Pelo is masculine, so largo (not larga). Largo means long; grande means big.',
            },
          ),
          ex.listenChoice('pero', ['perro', 'pelo'], ['es-el-pelo'], {
            id: 'es.ex.qdbzibeybv01mx',
            explanation: 'Pero has a single quick r, perro has a trilled rr and pelo has an l.',
          }),
          ex.fillBlank(
            'Tengo ___ ojos verdes.',
            'I have green eyes.',
            'los',
            ['las', 'el', 'la'],
            ['es-los-ojos'],
            {
              id: 'es.ex.9ptkzlu3l7wpup',
              explanation:
                'Ojos is masculine plural: los ojos. In Spanish you say “I have the eyes green”.',
            },
          ),
          ex.translationChoice('rubio', 'blond', ['dark-haired', 'long', 'tall'], ['es-rubio'], {
            id: 'es.ex.kbe6uc3koaa3xz',
          }),
          ex.listenChoice(
            'Tiene el pelo corto.',
            ['Tiene el pelo largo.', 'Tengo el pelo corto.', 'Tiene el pelo rubio.'],
            ['es-el-pelo', 'es-corto'],
            { id: 'es.ex.qpisot4nwe6s85' },
          ),
          ex.orderWords(
            'Mi hermana tiene los ojos azules.',
            'My sister has blue eyes.',
            ['es-los-ojos'],
            { id: 'es.ex.0bt68o8kxelm54' },
          ),
          ex.translateWrite(
            'He is dark-haired, but his brother is blond.',
            'Él es morocho, pero su hermano es rubio.',
            ['es-morocho', 'es-rubio'],
            {
              id: 'es.ex.r4bpdezixjbqdk',
              acceptedAnswers: ['Es morocho, pero su hermano es rubio.'],
            },
          ),
          ex.shortAnswer(
            '¿Cómo es tu pelo?',
            'Say you have short black hair (start with «Tengo el pelo…»).',
            'Tengo el pelo negro y corto.',
            ['Tengo el pelo corto y negro.'],
            ['es-el-pelo', 'es-corto'],
            { id: 'es.ex.y7mw09s015i6wb' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Estoy cansado',
        objective: 'Say how you and others feel right now, and choose between ser and estar.',
        intro: {
          explanation:
            'Ser describes what someone is like (es serio, es divertida). Estar describes how someone is right now, a state that can change: estoy cansado (I’m tired), está contenta (she’s happy). With vos: estás; plural: estamos (we), están (they). So Martín es serio means he is a serious person, but hoy está contento means he is happy today.',
          examples: [
            { target: 'Hoy estoy muy cansada.', base: 'I’m very tired today.' },
            {
              target: 'Martín es serio, pero hoy está contento.',
              base: 'Martín is a serious person, but today he’s happy.',
            },
          ],
        },
        takeaways: [
          'You say how you feel with estoy: estoy cansado, estoy contenta.',
          'You use ser for what someone is like and estar for how they are now.',
        ],
        exercises: [
          ex.translationChoice('cansado', 'tired', ['happy', 'shy', 'serious'], ['es-cansado'], {
            id: 'es.ex.s13k14yvcipih8',
          }),
          ex.listenChoice(
            'Estoy contenta.',
            ['Estoy cansada.', 'Está contenta.', 'Estás contenta.'],
            ['es-estoy', 'es-contento'],
            { id: 'es.ex.3219xvv166vx35' },
          ),
          ex.fillBlank(
            'Hoy ___ muy cansado.',
            'I’m very tired today.',
            'estoy',
            ['soy', 'es', 'tengo'],
            ['es-estoy', 'es-cansado'],
            {
              id: 'es.ex.812jxcaqsmu0j9',
              explanation:
                'Being tired is a state that changes: estar (estoy). Soy is for what you are like.',
            },
          ),
          ex.fillBlank(
            'Mi hermano ___ muy simpático.',
            'My brother is very friendly.',
            'es',
            ['está', 'estoy', 'tiene'],
            ['es-simpatico', 'es-estoy'],
            {
              id: 'es.ex.6ig1e9fbcf1xd8',
              explanation: 'Being friendly is part of who he is, so you use ser: es simpático.',
            },
          ),
          ex.matchPairs(
            [
              ['estoy', 'I am (right now)'],
              ['cansado', 'tired'],
              ['contento', 'happy'],
              ['serio', 'serious'],
            ],
            ['es-estoy', 'es-cansado', 'es-contento', 'es-serio'],
            { id: 'es.ex.1zxlpbbcugilcn' },
          ),
          ex.fillBlank(
            '¿Cómo ___ hoy? — Estoy cansada.',
            'How are you today? — I’m tired.',
            'estás',
            ['sos', 'tenés', 'soy'],
            ['es-estoy', 'es-cansado'],
            {
              id: 'es.ex.ftlxayqi2lmeob',
              explanation:
                'To ask a friend how they feel today, use estar with vos: ¿cómo estás? ¿Cómo sos? would ask what they are like.',
            },
          ),
          question(
            'es.ex.kc1it4e56yctum',
            HERMANA,
            'How does Martín feel?',
            'Very tired, but happy',
            ['Very happy and not tired', 'Serious', 'Shy'],
            ['es-cansado', 'es-contento'],
            'Martín says “Estoy muy cansado, pero contento”.',
          ),
          question(
            'es.ex.yp00djc3t83c6b',
            HERMANA,
            'What is Martín’s sister like?',
            'Very funny and friendly',
            ['Very serious', 'Shy and serious', 'Tired'],
            ['es-divertido', 'es-simpatico', 'es-serio'],
            'Sofía asks “¿Es seria?” and Martín answers “No, para nada. Es muy divertida y simpática”.',
          ),
          ex.translateWrite(
            'We are very tired today.',
            'Hoy estamos muy cansados.',
            ['es-cansado', 'es-muy'],
            {
              id: 'es.ex.1ryqjidwscbjyk',
              acceptedAnswers: [
                'Estamos muy cansados hoy.',
                'Hoy estamos muy cansadas.',
                'Estamos muy cansadas hoy.',
                'Nosotros estamos muy cansados hoy.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo estás hoy?',
            'Say you are very happy (use «Estoy…»).',
            'Estoy muy contento.',
            ['Estoy muy contenta.', 'Hoy estoy muy contento.', 'Hoy estoy muy contenta.'],
            ['es-estoy', 'es-contento'],
            { id: 'es.ex.rx8gy0wpaq5p2h' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿Cómo es tu familia?',
        objective: 'Understand and give short descriptions of people.',
        intro: {
          explanation:
            'Put it all together: ser for what people are like and what they look like, tener for hair and eyes, and estar for how they feel. Remember that adjectives agree with the person: mi hermana es alta y rubia, mis padres son simpáticos.',
          examples: [
            { target: 'Mi hermana es alta y rubia.', base: 'My sister is tall and blonde.' },
            { target: 'Mis padres son muy simpáticos.', base: 'My parents are very friendly.' },
          ],
        },
        takeaways: [
          'You understand a short description of a person in a message.',
          'You describe someone with ser, tener and estar.',
        ],
        exercises: [
          question(
            'es.ex.grmbly1n2xjj4z',
            MENSAJE,
            'What does Diego look like?',
            'Tall and dark-haired',
            ['Short and blond', 'Tall and blond', 'Short and dark-haired'],
            ['es-alto', 'es-morocho'],
            'Lucía writes “Diego es alto y morocho”.',
          ),
          question(
            'es.ex.lm1jb7sp7c88ni',
            MENSAJE,
            'What color are Diego’s eyes?',
            'Green',
            ['Blue', 'Black', 'Brown'],
            ['es-los-ojos'],
            'Lucía writes “Tiene el pelo corto y los ojos verdes”.',
          ),
          question(
            'es.ex.ir6nzp18xa86b3',
            MENSAJE,
            'What is Diego like?',
            'Very friendly, but a little shy',
            ['Very serious', 'Funny and not at all shy', 'Tired and serious'],
            ['es-simpatico', 'es-timido'],
            'Lucía writes “Es muy simpático, pero un poco tímido”.',
          ),
          question(
            'es.ex.1xgz1su86nge8o',
            HERMANA,
            'What is Martín’s sister’s hair like?',
            'Long and blond',
            ['Short and blond', 'Long and dark', 'Short and dark'],
            ['es-largo', 'es-rubio', 'es-el-pelo'],
            'Martín says “Es alta y rubia. Tiene el pelo largo”.',
          ),
          ex.listenChoice(
            'Mis padres están contentos.',
            ['Mis padres son simpáticos.', 'Mis padres están cansados.', 'Mi padre está contento.'],
            ['es-contento', 'es-cansado'],
            { id: 'es.ex.sy0q8rezyurp8p' },
          ),
          ex.fillBlank(
            'Mis hermanas son muy ___.',
            'My sisters are very funny.',
            'divertidas',
            ['divertido', 'divertida', 'divertidos'],
            ['es-divertido'],
            {
              id: 'es.ex.pcf8ok6rp6tzqe',
              explanation: 'Hermanas is feminine plural, so the adjective ends in -as: divertidas.',
            },
          ),
          ex.matchPairs(
            [
              ['lindo', 'good-looking'],
              ['joven', 'young'],
              ['tímido', 'shy'],
              ['¿cómo es?', 'what is he like?'],
            ],
            ['es-lindo', 'es-joven', 'es-timido', 'es-como-es'],
            { id: 'es.ex.qqw1ujui888wj1' },
          ),
          ex.fillBlank(
            'Valentina ___ el pelo largo y rubio.',
            'Valentina has long blond hair.',
            'tiene',
            ['es', 'está', 'tengo'],
            ['es-el-pelo', 'es-largo', 'es-rubio'],
            {
              id: 'es.ex.99wwlqrqirul4q',
              explanation: 'Hair goes with tener: tiene el pelo largo.',
            },
          ),
          ex.translateWrite(
            'My grandmother is short and very friendly.',
            'Mi abuela es baja y muy simpática.',
            ['es-bajo', 'es-simpatico'],
            { id: 'es.ex.9ebh9be3azy00p', acceptedAnswers: ['Mi abuela es muy simpática y baja.'] },
          ),
          ex.shortAnswer(
            '¿Cómo es tu amiga?',
            'Say she is tall and has long hair (use «Es alta y tiene…»).',
            'Es alta y tiene el pelo largo.',
            ['Mi amiga es alta y tiene el pelo largo.', 'Ella es alta y tiene el pelo largo.'],
            ['es-alto', 'es-largo'],
            { id: 'es.ex.txvfb3e19i4au1' },
          ),
        ],
      },
    ],
  },
};

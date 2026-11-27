import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U10 «Noticias y medios» (docs/B1_EN.md): el estilo indirecto (said that, told me that, asked
 * if/where) con el cambio de tiempos más frecuente (am → was, will → would, can → could); titulares y
 * artículos; sucesos (la pasiva de las noticias); fuentes y noticias falsas.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const HEADLINES = reading(
  'en.stim.b1-u10-headlines',
  'notice',
  'Los titulares de un sitio de noticias.',
  [
    'Today’s headlines',
    'New train line will open in March',
    'Local team wins the national cup',
    'Prices of fruit and vegetables go up again',
    'Students build a robot that helps old people',
  ],
  { title: 'City News' },
);

const FIRE = dialogue('en.stim.b1-u10-fire', 'Una noticia en la radio.', [
  ['Reporter', 'A fire started in a restaurant in the city center last night.'],
  ['Reporter', 'According to the police, ten people were rescued, and nobody was badly injured.'],
  ['Reporter', 'The owner said that the restaurant would open again next month.'],
]);

const BOSS = dialogue('en.stim.b1-u10-boss', 'Mia le cuenta a Sam lo que dijo el jefe.', [
  ['Sam', 'What did the boss say at the meeting?'],
  ['Mia', 'He said that the company was going to hire five new people.'],
  ['Mia', 'He also told us that we could work from home on Fridays.'],
  ['Sam', 'Great news! Did anyone ask about the salaries?'],
  ['Mia', 'Yes, Kate asked if we would get more money. He said he didn’t know yet.'],
]);

const FAKE = reading(
  'en.stim.b1-u10-fake',
  'post',
  'Un periodista escribe sobre noticias falsas.',
  [
    'Last week, a lot of people shared an article which said that the city zoo was closing.',
    'It was fake news. The zoo explained that it was open as usual.',
    'Before you share a story, check the source.',
    'Is it a real newspaper? Has the story been on other news sites?',
  ],
  { from: 'Ben', title: 'Check before you share' },
);

export const EN_B1_U10: B1UnitDef = {
  names: ['Reporter', 'Mia', 'Sam', 'Kate', 'Ben'],
  support: [
    'national',
    'robot',
    'center',
    'nobody',
    'owner',
    'anyone',
    'salaries',
    'zoo',
    'usual',
    'sites',
    'radio',
    'closing',
    'road',
    'vote',
    'product',
  ],
  unit: {
    position: 10,
    title: 'Noticias y medios',
    titleEn: 'News and media',
    description:
      'Titulares y artículos, contar lo que alguien dijo o preguntó (estilo indirecto), sucesos y noticias falsas.',
    emoji: '📰',
    objective:
      'Puedes entender titulares y noticias breves, contar lo que otra persona dijo o preguntó y distinguir una fuente confiable.',
    grammar: {
      title: 'Estilo indirecto',
      explanation:
        'Para contar lo que alguien dijo: said (that) + oración, o told + persona + (that). El verbo suele ir un tiempo atrás: «I am tired» → She said she was tired; «I will call» → He said he would call; «I can help» → She said she could help. Preguntas: asked if… / asked where…',
      examples: [
        { target: 'She said that she was tired.', base: 'Dijo que estaba cansada.' },
        { target: 'He told me that he would call.', base: 'Me dijo que iba a llamar.' },
        { target: 'They asked if we were ready.', base: 'Preguntaron si estábamos listos.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-the-news',
        'the news',
        'las noticias / el noticiero',
        '/ðə ˈnuz/',
        '📺',
        'I watch the news every night.',
        'Miro el noticiero todas las noches.',
        ['news'],
        ['las noticias', 'el noticiero'],
      ),
      w(
        'en-newspaper',
        'newspaper',
        'diario / periódico',
        '/ˈnuzˌpeɪpər/',
        '📰',
        'My grandfather reads the newspaper every morning.',
        'Mi abuelo lee el diario todas las mañanas.',
        ['news'],
        ['diario', 'periódico'],
      ),
      w(
        'en-headline',
        'headline',
        'titular',
        '/ˈhɛdˌlaɪn/',
        undefined,
        'Did you see the headlines today?',
        '¿Viste los titulares de hoy?',
        ['news'],
      ),
      w(
        'en-article',
        'article',
        'artículo / nota',
        '/ˈɑrtɪkəl/',
        undefined,
        'I read an interesting article about food.',
        'Leí una nota interesante sobre comida.',
        ['news'],
        ['artículo', 'nota'],
      ),
      w(
        'en-journalist',
        'journalist',
        'periodista',
        '/ˈdʒɜrnəlɪst/',
        '🎙️',
        'She works as a journalist.',
        'Trabaja de periodista.',
        ['news', 'jobs'],
      ),
      w(
        'en-told',
        'told',
        'dije / dijo (a alguien) (tell)',
        '/toʊld/',
        undefined,
        'She told me the news.',
        'Me contó la noticia.',
        ['news', 'past'],
        ['dijo', 'contó', 'le dijo'],
      ),
      w(
        'en-explained',
        'explained',
        'explicó / expliqué',
        '/ɪkˈspleɪnd/',
        undefined,
        'The teacher explained the exercise.',
        'La profesora explicó el ejercicio.',
        ['news', 'past'],
        ['explicó', 'expliqué'],
      ),
      w(
        'en-announced',
        'announced',
        'anunció / anunciado',
        '/əˈnaʊnst/',
        '📣',
        'The company announced a new product.',
        'La empresa anunció un producto nuevo.',
        ['news', 'past'],
        ['anunció', 'anunciado'],
      ),
      w(
        'en-according-to',
        'according to',
        'según',
        '/əˈkɔrdɪŋ tu/',
        undefined,
        'According to the news, it will rain.',
        'Según el noticiero, va a llover.',
        ['news'],
      ),
      w(
        'en-accident',
        'accident',
        'accidente',
        '/ˈæksədənt/',
        '🚑',
        'There was an accident on the road.',
        'Hubo un accidente en la carretera.',
        ['news'],
      ),
      w(
        'en-fire',
        'fire',
        'incendio / fuego',
        '/faɪər/',
        '🔥',
        'There was a fire in the building.',
        'Hubo un incendio en el edificio.',
        ['news'],
        ['incendio', 'fuego'],
      ),
      w(
        'en-rescued',
        'rescued',
        'rescatado / rescató',
        '/ˈrɛskjud/',
        undefined,
        'The children were rescued.',
        'Los chicos fueron rescatados.',
        ['news', 'passive'],
        ['rescatado', 'rescatados', 'rescató'],
      ),
      w(
        'en-government',
        'government',
        'gobierno',
        '/ˈɡʌvərnmənt/',
        '🏛️',
        'The government announced new rules.',
        'El gobierno anunció nuevas normas.',
        ['news', 'society'],
      ),
      w(
        'en-president',
        'president',
        'presidente / presidenta',
        '/ˈprɛzədənt/',
        undefined,
        'The president spoke on TV.',
        'El presidente habló por televisión.',
        ['news', 'society'],
        ['presidente', 'presidenta'],
      ),
      w(
        'en-election',
        'election',
        'elección / elecciones',
        '/ɪˈlɛkʃən/',
        '🗳️',
        'The election is in October.',
        'Las elecciones son en octubre.',
        ['news', 'society'],
        ['elección', 'elecciones'],
      ),
      w(
        'en-fake-news',
        'fake news',
        'noticias falsas',
        '/ˈfeɪk ˈnuz/',
        undefined,
        "Don't share fake news.",
        'No compartas noticias falsas.',
        ['news', 'media'],
        ['noticia falsa'],
      ),
      w(
        'en-source',
        'source',
        'fuente',
        '/sɔrs/',
        undefined,
        'Always check the source.',
        'Siempre fíjate la fuente.',
        ['news', 'media'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Titulares',
        objective: 'Entender titulares y hablar de cómo te informas.',
        intro: {
          explanation:
            'Los titulares (headlines) son cortos: usan el presente para hechos recientes (Local team wins the cup) y to o will para el futuro (New line will open). The news son las noticias o el noticiero; newspaper, el diario; article, una nota.',
          examples: [
            {
              target: 'I watch the news every night.',
              base: 'Miro el noticiero todas las noches.',
            },
            {
              target: 'I read an interesting article about food.',
              base: 'Leí una nota interesante sobre comida.',
            },
          ],
        },
        takeaways: [
          'Entiendes titulares cortos.',
          'Cuentas cómo te informas: the news, a newspaper, an article.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['headline', 'titular'],
              ['article', 'artículo / nota'],
              ['newspaper', 'diario / periódico'],
              ['journalist', 'periodista'],
            ],
            ['en-headline', 'en-article', 'en-newspaper', 'en-journalist'],
            { id: 'en.ex.8vp9l3boe8f3f0' },
          ),
          ex.imageChoice(
            '📰',
            'newspaper',
            ['headline', 'journalist', 'article'],
            ['en-newspaper'],
            { id: 'en.ex.sejm57fbzkn8w9' },
          ),
          ex.fillBlank(
            'I watch ___ every night on TV.',
            'Miro el noticiero todas las noches en la tele.',
            'the news',
            ['a newspaper', 'a headline', 'an article'],
            ['en-the-news'],
            { id: 'en.ex.pag3hllc31jwsd', skill: 'vocabulary' },
          ),
          question(
            'en.ex.yj2yzdr251juut',
            HEADLINES,
            '¿Qué titular habla de precios?',
            'El de las frutas y las verduras',
            ['El del tren', 'El del equipo', 'El del robot'],
            ['en-headline'],
            'El titular dice: «Prices of fruit and vegetables go up again».',
          ),
          question(
            'en.ex.fuo53znnypm95t',
            HEADLINES,
            '¿Qué construyeron unos estudiantes?',
            'Un robot que ayuda a personas mayores',
            ['Una línea de tren', 'Un museo', 'Una escuela nueva'],
            ['en-headline', 'en-built'],
            'El titular dice: «Students build a robot that helps old people».',
          ),
          ex.listenChoice(
            'My grandfather reads the newspaper every morning.',
            [
              'My grandmother reads the newspaper every morning.',
              'My grandfather reads the news every morning.',
              'My grandfather read the newspaper every morning.',
            ],
            ['en-newspaper', 'en-grandfather'],
            { id: 'en.ex.dztkg3e6lhtsr8' },
          ),
          ex.orderWords('She works as a journalist.', 'Trabaja de periodista.', ['en-journalist'], {
            id: 'en.ex.h8if3j72ja2fkz',
          }),
          ex.shortAnswer(
            'How do you get the news? (lees el diario por internet)',
            '¿Cómo te informas?',
            'I read the newspaper online.',
            ['I read the news online.', 'I read newspapers online.', 'Online.'],
            ['en-newspaper', 'en-online'],
            { id: 'en.ex.duwtjnvaowt14n' },
          ),
          ex.translateWrite(
            'Leí una nota interesante sobre el medioambiente.',
            'I read an interesting article about the environment.',
            ['en-article', 'en-environment'],
            {
              id: 'en.ex.3tgbmzfknn7gkd',
              acceptedAnswers: ['I have read an interesting article about the environment.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Dijo que…',
        objective: 'Contar lo que alguien dijo: said that, told me that.',
        intro: {
          explanation:
            'Said va sin persona (He said that…) y told, con persona (He told me that…). El verbo va un tiempo atrás: «I am busy» → She said she was busy; «We will hire» → He said they would hire; «You can go» → He told us we could go. That se puede omitir.',
          examples: [
            { target: 'She said that she was busy.', base: 'Dijo que estaba ocupada.' },
            {
              target: 'He told us that we could work from home.',
              base: 'Nos dijo que podíamos trabajar desde casa.',
            },
          ],
        },
        takeaways: [
          'Cuentas lo que alguien dijo con said y told.',
          'Pasas el verbo un tiempo atrás: is → was, will → would, can → could.',
        ],
        exercises: [
          ex.fillBlank(
            '«I am busy.» → She said that she ___ busy.',
            '«Estoy ocupada.» → Dijo que estaba ocupada.',
            'was',
            ['is', 'were', 'has'],
            ['en-said', 'en-busy'],
            {
              id: 'en.ex.m4r9nivgwjzdon',
              explanation: 'En estilo indirecto, am/is pasa a was.',
            },
          ),
          ex.fillBlank(
            'He ___ me that he would call.',
            'Me dijo que iba a llamar.',
            'told',
            ['said', 'spoke', 'asked'],
            ['en-told', 'en-call'],
            {
              id: 'en.ex.3wfs0h150ktva1',
              explanation: 'Told + persona (told me); said sin persona (he said that…).',
            },
          ),
          ex.fillBlank(
            '«I will help you.» → She said she ___ help me.',
            '«Te voy a ayudar.» → Dijo que me iba a ayudar.',
            'would',
            ['will', 'can', 'did'],
            ['en-said', 'en-help'],
            {
              id: 'en.ex.zp9f8vfch0tmz8',
              explanation: 'Will pasa a would.',
            },
          ),
          question(
            'en.ex.as40scnaq7hxeb',
            BOSS,
            '¿Qué dijo el jefe sobre la empresa?',
            'Que iba a contratar a cinco personas',
            ['Que iba a cerrar', 'Que iba a subir los sueldos', 'Que se mudaba'],
            ['en-said', 'en-hire'],
            'Mia dice: «He said that the company was going to hire five new people».',
          ),
          question(
            'en.ex.adgsqp8tf8vzs7',
            BOSS,
            '¿Qué les dijo sobre los viernes?',
            'Que podían trabajar desde casa',
            ['Que no se trabaja', 'Que hay reunión', 'Que salen más temprano'],
            ['en-told'],
            'Mia dice: «He also told us that we could work from home on Fridays».',
          ),
          ex.listenChoice(
            'She told me the news.',
            ['She told me the story.', 'She asked me the news.', 'He told me the news.'],
            ['en-told', 'en-the-news'],
            { id: 'en.ex.msobwo5yvjyqx3' },
          ),
          ex.orderWords(
            'He said that he was tired.',
            'Dijo que estaba cansado.',
            ['en-said', 'en-tired'],
            { id: 'en.ex.3ljfg1dmxyzozq' },
          ),
          ex.shortAnswer(
            'What did Ana say? (que estaba enferma)',
            '¿Qué dijo Ana?',
            'She said that she was sick.',
            [
              'She said she was sick.',
              'She said that she was ill.',
              'She said she was ill.',
              'That she was sick.',
            ],
            ['en-said', 'en-sick'],
            { id: 'en.ex.o3nbtma6p4g2uw' },
          ),
          ex.translateWrite(
            'Me dijo que iba a llamar.',
            'He told me that he would call.',
            ['en-told', 'en-call'],
            {
              id: 'en.ex.gi7mb2oit62tlv',
              acceptedAnswers: [
                'He told me he would call.',
                'She told me that she would call.',
                'She told me she would call.',
                'He said that he would call.',
                'He said he would call.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Preguntó si…',
        objective: 'Contar lo que alguien preguntó: asked if, asked where.',
        intro: {
          explanation:
            'Una pregunta de sí o no se cuenta con asked if: «Are you ready?» → She asked if we were ready. Con pregunta de información se repite la palabra y se ordena como afirmación: «Where do you live?» → He asked where I lived.',
          examples: [
            { target: 'She asked if we were ready.', base: 'Preguntó si estábamos listos.' },
            { target: 'He asked me where I lived.', base: 'Me preguntó dónde vivía.' },
          ],
        },
        takeaways: [
          'Cuentas preguntas de sí o no con asked if.',
          'Cuentas preguntas de información: asked where / what / when…',
        ],
        exercises: [
          ex.fillBlank(
            '«Are you ready?» → She asked ___ we were ready.',
            '«¿Están listos?» → Preguntó si estábamos listos.',
            'if',
            ['that', 'what', 'so'],
            ['en-ask', 'en-ready'],
            {
              id: 'en.ex.xgmknpw1xbzgwx',
              explanation: 'Pregunta de sí o no → asked if.',
            },
          ),
          ex.fillBlank(
            '«Where do you live?» → He asked me where I ___.',
            '«¿Dónde vives?» → Me preguntó dónde vivía.',
            'lived',
            ['live', 'did live', 'do live'],
            ['en-ask', 'en-live'],
            {
              id: 'en.ex.tl72uo35n8dz5j',
              explanation: 'Sin do/did y con el verbo un tiempo atrás: where I lived.',
            },
          ),
          ex.fillBlank(
            'The teacher ___ the exercise again.',
            'La profesora explicó el ejercicio de nuevo.',
            'explained',
            ['told', 'asked', 'said'],
            ['en-explained'],
            { id: 'en.ex.6peii601wwt9jo', skill: 'vocabulary' },
          ),
          question(
            'en.ex.2ia38vi91u2dsh',
            BOSS,
            '¿Qué preguntó Kate?',
            'Si iban a ganar más dinero',
            [
              'Si podía trabajar desde casa',
              'Cuándo era la próxima reunión',
              'Dónde iban a trabajar',
            ],
            ['en-ask', 'en-salary'],
            'Mia dice: «Kate asked if we would get more money».',
          ),
          ex.listenChoice(
            'He asked me where I lived.',
            [
              'He asked me where I worked.',
              'He told me where I lived.',
              'She asked me where I lived.',
            ],
            ['en-ask', 'en-live'],
            { id: 'en.ex.cwxhrn3iizonqz' },
          ),
          ex.orderWords(
            'She asked if I was ready.',
            'Me preguntó si estaba listo.',
            ['en-ask', 'en-ready'],
            { id: 'en.ex.rvd2s460ywm25l' },
          ),
          ex.shortAnswer(
            'What did the doctor ask? (si tenías fiebre)',
            '¿Qué preguntó el médico?',
            'He asked if I had a fever.',
            [
              'She asked if I had a fever.',
              'He asked me if I had a fever.',
              'She asked me if I had a fever.',
              'If I had a fever.',
            ],
            ['en-ask', 'en-fever'],
            { id: 'en.ex.pyuxr95ebermsp' },
          ),
          ex.translateWrite(
            'Me preguntó dónde trabajaba.',
            'She asked me where I worked.',
            ['en-ask', 'en-work'],
            {
              id: 'en.ex.o26hopd44qupe6',
              acceptedAnswers: [
                'He asked me where I worked.',
                'She asked where I worked.',
                'He asked where I worked.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Sucesos',
        objective: 'Entender noticias de sucesos: accidentes, incendios y rescates.',
        intro: {
          explanation:
            'Las noticias de sucesos usan mucho la pasiva: ten people were rescued, nobody was injured. According to (según) dice de dónde viene la información: According to the police…',
          examples: [
            {
              target: 'There was a fire in the building.',
              base: 'Hubo un incendio en el edificio.',
            },
            {
              target: 'According to the police, nobody was injured.',
              base: 'Según la policía, no hubo heridos.',
            },
          ],
        },
        takeaways: [
          'Entiendes noticias de accidentes e incendios.',
          'Dices de dónde viene la información: according to.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['accident', 'accidente'],
              ['fire', 'incendio / fuego'],
              ['rescued', 'rescatado / rescató'],
              ['according to', 'según'],
            ],
            ['en-accident', 'en-fire', 'en-rescued', 'en-according-to'],
            { id: 'en.ex.lt3tm3uxdepbro' },
          ),
          ex.fillBlank(
            'There was an ___ on the road this morning.',
            'Esta mañana hubo un accidente en la carretera.',
            'accident',
            ['article', 'headline', 'newspaper'],
            ['en-accident'],
            { id: 'en.ex.vncjgvnri8u6xf', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Ten people ___ rescued from the building.',
            'Diez personas fueron rescatadas del edificio.',
            'were',
            ['was', 'are', 'did'],
            ['en-rescued'],
            {
              id: 'en.ex.l95di0bsxc7igj',
              explanation: 'Pasiva en pasado, plural: were + participio.',
            },
          ),
          question(
            'en.ex.cho5316q83x2co',
            FIRE,
            '¿Dónde empezó el incendio?',
            'En un restaurante del centro',
            ['En un hotel', 'En una escuela', 'En un edificio de oficinas'],
            ['en-fire'],
            'La noticia dice: «A fire started in a restaurant in the city center last night».',
          ),
          question(
            'en.ex.yb1nvosvv7j3us',
            FIRE,
            '¿Qué dijo el dueño?',
            'Que el restaurante iba a abrir de nuevo el mes que viene',
            ['Que el restaurante cerraba', 'Que nadie estaba ahí', 'Que la policía llegó tarde'],
            ['en-said'],
            'La noticia dice: «The owner said that the restaurant would open again next month».',
          ),
          ex.listenChoice(
            'According to the police, nobody was injured.',
            [
              'According to the police, ten people were injured.',
              'According to the news, nobody was injured.',
              'According to the police, nobody was rescued.',
            ],
            ['en-according-to', 'en-injured'],
            { id: 'en.ex.i7yluxc0jti16x' },
          ),
          ex.orderWords(
            'There was a fire in the building.',
            'Hubo un incendio en el edificio.',
            ['en-fire'],
            { id: 'en.ex.3qnonirmsrohsf' },
          ),
          ex.translateWrite(
            'Según el noticiero, va a llover.',
            'According to the news, it will rain.',
            ['en-according-to', 'en-the-news'],
            {
              id: 'en.ex.8wivpodtky5q40',
              acceptedAnswers: [
                "According to the news, it's going to rain.",
                'According to the news, it is going to rain.',
              ],
            },
          ),
          ex.translateWrite(
            'Los chicos fueron rescatados.',
            'The children were rescued.',
            ['en-rescued'],
            {
              id: 'en.ex.m6kqiy8fymyqld',
              acceptedAnswers: ['The kids were rescued.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Fuentes confiables',
        objective: 'Hablar de política, anuncios y noticias falsas; revisar la fuente.',
        intro: {
          explanation:
            'Government (gobierno), president (presidente) y election (elecciones) son palabras frecuentes en las noticias. Announce es anunciar. Fake news son noticias falsas: antes de compartir, check the source (revisa la fuente).',
          examples: [
            {
              target: 'The government announced new rules.',
              base: 'El gobierno anunció nuevas normas.',
            },
            { target: 'Always check the source.', base: 'Siempre revisa la fuente.' },
          ],
        },
        takeaways: [
          'Entiendes noticias sobre el gobierno y las elecciones.',
          'Reconoces noticias falsas y revisas la fuente.',
        ],
        exercises: [
          ex.translationChoice(
            'source',
            'fuente',
            ['titular', 'artículo / nota', 'periodista'],
            ['en-source'],
            { id: 'en.ex.flsdr8f19t2p7z' },
          ),
          question(
            'en.ex.6ob4lf3f545x0r',
            FAKE,
            '¿Qué decía la nota falsa?',
            'Que el zoológico iba a cerrar',
            [
              'Que el zoológico era gratis',
              'Que abrían un zoológico nuevo',
              'Que había un incendio',
            ],
            ['en-fake-news', 'en-article'],
            'Ben escribe: «an article which said that the city zoo was closing. It was fake news».',
          ),
          question(
            'en.ex.uaibjqvwclddzq',
            FAKE,
            '¿Qué aconseja Ben antes de compartir una noticia?',
            'Revisar la fuente',
            ['Leer sólo los titulares', 'Preguntar a un amigo', 'No leer noticias'],
            ['en-source'],
            'Ben escribe: «Before you share a story, check the source».',
          ),
          ex.fillBlank(
            'The ___ announced new rules for schools.',
            'El gobierno anunció nuevas normas para las escuelas.',
            'government',
            ['election', 'headline', 'source'],
            ['en-government', 'en-announced'],
            { id: 'en.ex.kqo7oa2xz9cmg9', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'The ___ is in October. Who will you vote for?',
            'Las elecciones son en octubre. ¿A quién vas a votar?',
            'election',
            ['president', 'government', 'newspaper'],
            ['en-election'],
            { id: 'en.ex.ikknjts14vvayr', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'The president spoke on TV last night.',
            [
              'The president spoke on the radio last night.',
              'The president speaks on TV every night.',
              'The government spoke on TV last night.',
            ],
            ['en-president'],
            { id: 'en.ex.o2hayr15c9tw3g' },
          ),
          ex.orderWords(
            'Do not share fake news.',
            'No compartas noticias falsas.',
            ['en-fake-news', 'en-share'],
            { id: 'en.ex.w04wua8auh28ru' },
          ),
          ex.shortAnswer(
            'What should you do before you share a story? (revisar la fuente)',
            '¿Qué tienes que hacer antes de compartir una noticia?',
            'Check the source.',
            [
              'You should check the source.',
              'I should check the source.',
              'Check the source first.',
            ],
            ['en-source'],
            { id: 'en.ex.07o9skbtlyv7b1' },
          ),
          ex.translateWrite(
            'El gobierno anunció nuevas normas.',
            'The government announced new rules.',
            ['en-government', 'en-announced'],
            {
              id: 'en.ex.y1384chok3t6h8',
              acceptedAnswers: ['The government has announced new rules.'],
            },
          ),
        ],
      },
    ],
  },
};

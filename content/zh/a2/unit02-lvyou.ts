import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U2 «Viajes y experiencias» (docs/ZH_A1_A2.md): 过 para experiencias, número + 次,
 * 从…到…, la duración con 小时 y 是…的 para preguntar cómo y cuándo pasó algo.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MURALLA = dialogue('zh.stim.a2-u2-changcheng', 'Anna y Li Hua hablan de la Gran Muralla.', [
  ['安娜', '李华，你去过长城吗？'],
  ['李华', '去过，去过两次。你呢？'],
  ['安娜', '我还没去过。我想明年去。'],
  ['李华', '长城很漂亮，可是人很多！'],
]);

const POSTAL = reading(
  'zh.stim.a2-u2-shanghai',
  'postcard',
  'Anna le manda una postal a su mamá.',
  [
    '妈妈，你好！',
    '我现在在上海。我是坐火车来的，从北京到上海五个小时。',
    '上海很大，人很多，饭馆也很好！',
    '我明天回北京。',
  ],
  { from: '安娜', to: '妈妈' },
);

const AEROPUERTO = dialogue(
  'zh.stim.a2-u2-jichang',
  'Zhang Li hace el check-in en el aeropuerto.',
  [
    ['服务员', '你好！你的护照呢？'],
    ['张丽', '在这儿。'],
    ['服务员', '你有几件行李？'],
    ['张丽', '一件。飞机几点到上海？'],
    ['服务员', '下午三点到。'],
  ],
);

export const ZH_A2_U02: ZhUnitDef = {
  names: ['安娜', '李华', '张丽'],
  support: ['多', '什么时候', '张'],
  unit: {
    position: 2,
    title: 'Viajes y experiencias',
    titleEn: '旅游 Travel',
    description: 'Contar experiencias con 过, cuántas veces, de dónde a dónde y cómo viajaste.',
    emoji: '🧳',
    objective:
      'Puedes contar lugares donde estuviste (过) y cuántas veces, decir de dónde a dónde y cuánto tardaste, y preguntar cómo y cuándo llegó alguien (是…的).',
    grammar: {
      title: '过 · 次 · 从…到… · 是…的',
      explanation:
        'Verbo + 过 cuenta una experiencia (alguna vez) y se niega con 没: 没去过. Cuántas veces: 去过两次. De A a B: 从 A 到 B. Para algo que ya pasó, 是 + cómo / cuándo / con quién + verbo + 的: 我是坐飞机来的.',
      examples: [
        { target: '我去过长城两次。', base: 'Fui dos veces a la Gran Muralla.' },
        {
          target: '从北京到上海坐火车五个小时。',
          base: 'De Pekín a Shanghái son cinco horas en tren.',
        },
        { target: '我是坐飞机来的。', base: 'Vine en avión.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U2). Sin revisión nativa: revisar 过 frente a 了, la posición de 次 y 是…的.',
    },
    words: [
      w(
        'zh-guo-exp',
        '过',
        'guo',
        'partícula de experiencia (过)',
        '我去过中国。',
        'Estuve en China.',
        ['particle', 'grammar'],
        {
          acceptedTranslations: ['partícula 过'],
        },
      ),
      w('zh-ci', '次', 'cì', 'vez', '我去过北京两次。', 'Fui dos veces a Pekín.', ['quantities'], {
        acceptedTranslations: ['veces'],
      }),
      w(
        'zh-lvyou',
        '旅游',
        'lǚyóu',
        'viajar (de paseo)',
        '我想去中国旅游。',
        'Quiero ir de viaje a China.',
        ['travel'],
        {
          acceptedTranslations: ['hacer turismo', 'viajar'],
        },
      ),
      w(
        'zh-waiguo',
        '外国',
        'wàiguó',
        'el extranjero (otro país)',
        '我没去过外国。',
        'Nunca fui al extranjero.',
        ['travel'],
        {
          acceptedTranslations: ['extranjero', 'otro país'],
        },
      ),
      w(
        'zh-difang',
        '地方',
        'dìfang',
        'lugar',
        '这个地方很漂亮。',
        'Este lugar es muy lindo.',
        ['places'],
        {
          acceptedTranslations: ['sitio'],
        },
      ),
      w(
        'zh-changcheng',
        '长城',
        'Chángchéng',
        'la Gran Muralla',
        '我去过长城。',
        'Estuve en la Gran Muralla.',
        ['travel', 'culture'],
        {
          acceptedTranslations: ['Gran Muralla', 'la Muralla China'],
        },
      ),
      w(
        'zh-cong',
        '从',
        'cóng',
        'desde',
        '从这儿到学校很近。',
        'De aquí a la escuela es cerca.',
        ['grammar'],
        {
          acceptedTranslations: ['de'],
        },
      ),
      w(
        'zh-dao',
        '到',
        'dào',
        'hasta (llegar a)',
        '飞机下午三点到。',
        'El avión llega a las tres de la tarde.',
        ['grammar', 'travel'],
        {
          acceptedTranslations: ['llegar', 'hasta'],
        },
      ),
      w(
        'zh-huoche',
        '火车',
        'huǒchē',
        'tren',
        '我坐火车去上海。',
        'Voy a Shanghái en tren.',
        ['transport'],
        {
          emoji: '🚄',
        },
      ),
      w(
        'zh-xiaoshi',
        '小时',
        'xiǎoshí',
        'hora (de duración)',
        '坐火车五个小时。',
        'Son cinco horas en tren.',
        ['time'],
        {
          acceptedTranslations: ['horas'],
        },
      ),
      w('zh-shanghai', '上海', 'Shànghǎi', 'Shanghái', '上海很大。', 'Shanghái es muy grande.', [
        'places',
      ]),
      w(
        'zh-jichang',
        '机场',
        'jīchǎng',
        'aeropuerto',
        '我是坐地铁去机场的。',
        'Fui al aeropuerto en metro.',
        ['places', 'travel'],
        {
          emoji: '🛫',
        },
      ),
      w(
        'zh-huzhao',
        '护照',
        'hùzhào',
        'pasaporte',
        '你的护照呢？',
        '¿Y tu pasaporte?',
        ['travel'],
        {
          emoji: '🛂',
        },
      ),
      w(
        'zh-xingli',
        '行李',
        'xíngli',
        'equipaje',
        '我有两件行李。',
        'Tengo dos maletas.',
        ['travel'],
        {
          acceptedTranslations: ['valija', 'maleta'],
          emoji: '🧳',
        },
      ),
      w(
        'zh-piao',
        '票',
        'piào',
        'boleto',
        '我买了两张火车票。',
        'Compré dos boletos de tren.',
        ['travel'],
        {
          acceptedTranslations: ['pasaje', 'entrada', 'billete'],
          emoji: '🎫',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '你去过…吗？',
        objective: 'Contar experiencias con 过.',
        intro: {
          explanation:
            '过 después del verbo cuenta una experiencia, algo que hiciste alguna vez: 我去过中国. Se niega con 没 (no con 不): 我没去过. Para preguntar: 你去过…吗？',
          examples: [
            { target: '我去过中国。', base: 'Estuve en China (alguna vez).' },
            { target: '你吃过饺子吗？——没吃过。', base: '¿Probaste alguna vez jiaozi? — Nunca.' },
          ],
        },
        takeaways: ['Cuentas experiencias con 过.', 'Dices que nunca hiciste algo con 没…过.'],
        exercises: [
          ex.translationChoice(
            '外国',
            'el extranjero (otro país)',
            ['lugar', 'ciudad', 'calle'],
            ['zh-waiguo'],
            { id: 'zh.ex.iic7lhar209ejw' },
          ),
          ex.translationChoice(
            '地方',
            'lugar',
            ['el extranjero (otro país)', 'ciudad', 'calle'],
            ['zh-difang'],
            { id: 'zh.ex.gre688bnepfk73' },
          ),
          ex.listenChoice(
            '你去过中国吗？',
            ['你去中国吗？', '你去过北京吗？', '你想去中国吗？'],
            ['zh-guo-exp'],
            { id: 'zh.ex.7j52wri4ef96m4' },
          ),
          ex.fillBlank(
            '我吃___饺子，很好吃！',
            'Probé jiaozi alguna vez: son muy ricos.',
            '过',
            ['吧', '吗', '呢'],
            ['zh-guo-exp', 'zh-jiaozi'],
            {
              id: 'zh.ex.d1h2gzqxbia58l',
              explanation: '过 después del verbo cuenta una experiencia: alguna vez lo hiciste.',
            },
          ),
          ex.fillBlank(
            '我___去过外国。',
            'Nunca fui al extranjero.',
            '没',
            ['不', '了', '吧'],
            ['zh-guo-exp', 'zh-waiguo', 'zh-mei-pasado'],
            {
              id: 'zh.ex.ki5ql6ra020tph',
              explanation: 'La experiencia se niega con 没: 没去过 (nunca «不去过»).',
            },
          ),
          tone('外国', 'wàiguó', ['wàiguō', 'wáiguó', 'wǎiguǒ'], ['zh-waiguo'], {
            id: 'zh.ex.x56s5r9364zkjh',
          }),
          ex.orderWords(
            '你 去 过 什么 地方？',
            '¿Qué lugares conoces?',
            ['zh-guo-exp', 'zh-difang'],
            { id: 'zh.ex.ttsmd8hr2h4m7w' },
          ),
          reply(
            '你去过外国吗？',
            '¿Fuiste alguna vez al extranjero? (Responde que nunca.)',
            'méi qù guo',
            '没去过',
            ['zh-guo-exp', 'zh-waiguo'],
            {
              id: 'zh.ex.exoauoocdirmhv',
              accepted: [
                'wǒ méi qù guo',
                '我没去过',
                'méiyǒu',
                '没有',
                'wǒ méi qù guo wàiguó',
                '我没去过外国',
              ],
            },
          ),
          write(
            'Estuve en Pekín (alguna vez).',
            'wǒ qù guo Běijīng',
            '我去过北京',
            ['zh-guo-exp'],
            { id: 'zh.ex.fq1o8bl7ksgwyx' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '去过两次',
        objective: 'Decir cuántas veces hiciste algo y hablar de viajes.',
        intro: {
          explanation:
            'Cuántas veces: verbo + 过 + número + 次: 我去过两次. Si hay un lugar, va antes de las veces: 我去过长城两次. 旅游 es viajar de paseo, hacer turismo.',
          examples: [
            { target: '我去过长城两次。', base: 'Fui dos veces a la Gran Muralla.' },
            { target: '我想去中国旅游。', base: 'Quiero ir de viaje a China.' },
          ],
        },
        takeaways: ['Dices cuántas veces con 次.', 'Hablas de viajes con 旅游.'],
        exercises: [
          ex.translationChoice(
            '次',
            'vez',
            ['hora (de duración)', 'año', 'día (del mes)'],
            ['zh-ci'],
            { id: 'zh.ex.sb8a4w8szt081u' },
          ),
          ex.translationChoice(
            '旅游',
            'viajar (de paseo)',
            ['trabajar', 'estudiar', 'volver'],
            ['zh-lvyou'],
            { id: 'zh.ex.bpe2ka7p3fiak0' },
          ),
          ex.listenChoice(
            '我去过长城两次。',
            ['我去过长城三次。', '我没去过长城。', '我想去长城。'],
            ['zh-changcheng', 'zh-ci'],
            {
              id: 'zh.ex.2mx0amird3ldxl',
            },
          ),
          ex.fillBlank(
            '我去过北京三___。',
            'Fui tres veces a Pekín.',
            '次',
            ['个', '年', '岁'],
            ['zh-ci'],
            { id: 'zh.ex.kqkascohmc9ob3' },
          ),
          tone('旅游', 'lǚyóu', ['lǚyōu', 'lǘyóu', 'lǜyòu'], ['zh-lvyou'], {
            id: 'zh.ex.n4dmt3a8xrvxxm',
          }),
          question(
            'zh.ex.5kauh9101zwyg8',
            MURALLA,
            '¿Cuántas veces fue Li Hua a la Gran Muralla?',
            'Dos',
            ['Una', 'Nunca', 'Tres'],
            ['zh-ci', 'zh-guo-exp'],
            'Li Hua dice: «去过，去过两次».',
          ),
          question(
            'zh.ex.lkliikly5dxyeq',
            MURALLA,
            '¿Qué dice Li Hua de la Gran Muralla?',
            'Que es muy linda, pero hay mucha gente',
            ['Que es fea y hay mucha gente', 'Que es linda y no hay nadie', 'Que queda muy lejos'],
            ['zh-changcheng'],
            'Li Hua dice: «长城很漂亮，可是人很多！».',
          ),
          reply(
            '你去过长城吗？',
            '¿Fuiste a la Gran Muralla? (Responde que sí, una vez.)',
            'qù guo, qù guo yí cì',
            '去过，去过一次',
            ['zh-changcheng', 'zh-ci'],
            {
              id: 'zh.ex.zk2ixopszatdtr',
              accepted: [
                'qù guo yí cì',
                '去过一次',
                'wǒ qù guo yí cì',
                '我去过一次',
                'qù guo',
                '去过',
              ],
            },
          ),
          write(
            'Quiero ir de viaje a China.',
            'wǒ xiǎng qù Zhōngguó lǚyóu',
            '我想去中国旅游',
            ['zh-lvyou'],
            { id: 'zh.ex.gkz2pvmqs0rtwz' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '从北京到上海',
        objective: 'Decir de dónde a dónde y cuánto tiempo lleva.',
        intro: {
          explanation:
            '从 A 到 B es «de A a B»: 从北京到上海. 到 solo es «llegar»: 飞机三点到. La duración se cuenta con 个小时: 五个小时 (cinco horas).',
          examples: [
            {
              target: '从北京到上海坐火车五个小时。',
              base: 'De Pekín a Shanghái son cinco horas en tren.',
            },
            { target: '飞机几点到？', base: '¿A qué hora llega el avión?' },
          ],
        },
        takeaways: ['Dices un recorrido con 从…到….', 'Dices cuántas horas dura con 个小时.'],
        exercises: [
          ex.translationChoice('从', 'desde', ['hasta (llegar a)', 'hacia', 'con'], ['zh-cong'], {
            id: 'zh.ex.29eaip6vkju3ej',
          }),
          ex.translationChoice(
            '小时',
            'hora (de duración)',
            ['minutos', 'vez', 'año'],
            ['zh-xiaoshi'],
            { id: 'zh.ex.zwoo4hn5koncah' },
          ),
          ex.listenChoice(
            '从北京到上海坐火车五个小时。',
            [
              '从上海到北京坐飞机两个小时。',
              '从北京到上海坐火车三个小时。',
              '从北京到上海坐飞机五个小时。',
            ],
            ['zh-cong', 'zh-dao', 'zh-shanghai'],
            { id: 'zh.ex.1r6qqdwv0av995' },
          ),
          ex.fillBlank(
            '___家到学校很近。',
            'De casa a la escuela es muy cerca.',
            '从',
            ['在', '往', '跟'],
            ['zh-cong', 'zh-dao'],
            {
              id: 'zh.ex.1bep3et2minc38',
            },
          ),
          ex.fillBlank(
            '坐火车五个___。',
            'Son cinco horas en tren.',
            '小时',
            ['点', '次', '年'],
            ['zh-xiaoshi', 'zh-huoche'],
            {
              id: 'zh.ex.ptu993jku2d5fq',
              explanation: '点 es la hora del reloj (三点); para cuánto dura, 个小时.',
            },
          ),
          ex.imageChoice('🚄', '火车', ['飞机', '出租车', '地铁'], ['zh-huoche'], {
            id: 'zh.ex.ts25qnekluz8cl',
          }),
          tone('火车', 'huǒchē', ['huōchē', 'huóchē', 'huòchè'], ['zh-huoche'], {
            id: 'zh.ex.mab720cirvzlpj',
          }),
          question(
            'zh.ex.sbjyxn57kv07xj',
            POSTAL,
            '¿Cómo viajó Anna a Shanghái y cuánto tardó?',
            'En tren, cinco horas',
            ['En avión, dos horas', 'En tren, dos horas', 'En avión, cinco horas'],
            ['zh-huoche', 'zh-xiaoshi'],
            'Anna escribe: «我是坐火车来的，从北京到上海五个小时».',
          ),
          reply(
            '从北京到上海坐飞机几个小时？',
            '¿Cuántas horas son de Pekín a Shanghái en avión? (Responde: dos horas.)',
            'liǎng ge xiǎoshí',
            '两个小时',
            ['zh-xiaoshi', 'zh-shanghai'],
            {
              id: 'zh.ex.mftphr17e2o1yl',
              accepted: ['zuò fēijī liǎng ge xiǎoshí', '坐飞机两个小时', '两小时'],
            },
          ),
          write(
            'De Pekín a Shanghái son cinco horas en tren.',
            'cóng Běijīng dào Shànghǎi zuò huǒchē wǔ ge xiǎoshí',
            '从北京到上海坐火车五个小时',
            ['zh-cong', 'zh-dao', 'zh-huoche'],
            { id: 'zh.ex.b8vuok6605getu' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '是…的',
        objective: 'Preguntar y decir cómo, cuándo y con quién pasó algo.',
        intro: {
          explanation:
            'Si ya sabemos que algo pasó y queremos el detalle (cómo, cuándo, con quién), se usa 是 + detalle + verbo + 的: 你是怎么来的？——我是坐飞机来的. 你是什么时候到的？——我是昨天到的. El 是 se puede omitir; el 的, no.',
          examples: [
            { target: '我是坐飞机来的。', base: 'Vine en avión.' },
            {
              target: '你是什么时候到的？——我是昨天到的。',
              base: '¿Cuándo llegaste? — Llegué ayer.',
            },
          ],
        },
        takeaways: [
          'Preguntas detalles de algo pasado con 是…的.',
          'Respondes cómo y cuándo llegaste.',
        ],
        exercises: [
          ex.translationChoice(
            '机场',
            'aeropuerto',
            ['estación de tren', 'avión', 'boleto'],
            ['zh-jichang'],
            { id: 'zh.ex.u3v80yi5mrpnej' },
          ),
          ex.listenChoice(
            '我是坐飞机来的。',
            ['我是坐火车来的。', '我坐飞机来。', '我是坐出租车来的。'],
            ['zh-feiji', 'zh-de'],
            {
              id: 'zh.ex.lzz5mlzz2s1iku',
            },
          ),
          ex.fillBlank('你是怎么来___？', '¿Cómo viniste?', '的', ['了', '吗', '过'], ['zh-de'], {
            id: 'zh.ex.x12qbbgbnq63jb',
            explanation: 'En 是…的 la pregunta también termina en 的: 你是怎么来的？',
          }),
          ex.fillBlank('我___昨天到的。', 'Llegué ayer.', '是', ['在', '有', '了'], ['zh-dao'], {
            id: 'zh.ex.jkh8b5c43tp18h',
            explanation: '是…的 resalta el dato (cuándo): 我是昨天到的.',
          }),
          ex.orderWords(
            '我 是 从 机场 坐 出租车 来 的。',
            'Vine en taxi desde el aeropuerto.',
            ['zh-jichang', 'zh-cong'],
            {
              id: 'zh.ex.yv2qlmm35uwd6e',
            },
          ),
          tone('机场', 'jīchǎng', ['jìchǎng', 'jīcháng', 'jǐchàng'], ['zh-jichang'], {
            id: 'zh.ex.5fwvx0go8tlwuq',
          }),
          ex.fillBlank(
            'A：你是跟谁来的？ B：我是跟朋友来___。',
            'A: ¿Con quién viniste? B: Vine con un amigo.',
            '的',
            ['了', '吧', '过'],
            ['zh-gen', 'zh-de'],
            { id: 'zh.ex.exiy4gegvxwglf' },
          ),
          reply(
            '你是怎么去机场的？',
            '¿Cómo fuiste al aeropuerto? (Responde que en metro.)',
            'wǒ shì zuò dìtiě qù de',
            '我是坐地铁去的',
            ['zh-jichang', 'zh-ditie'],
            {
              id: 'zh.ex.m0a0s9ubner77t',
              accepted: [
                'shì zuò dìtiě qù de',
                '是坐地铁去的',
                'zuò dìtiě qù de',
                '坐地铁去的',
                'zuò dìtiě',
                '坐地铁',
                'wǒ zuò dìtiě qù de',
                '我坐地铁去的',
              ],
            },
          ),
          write(
            'Llegué el año pasado.',
            'wǒ shì qùnián dào de',
            '我是去年到的',
            ['zh-dao', 'zh-qunian'],
            {
              id: 'zh.ex.ripqs8j46zhsin',
              accepted: ['wǒ shì qùnián lái de', '我是去年来的', 'wǒ qùnián dào de', '我去年到的'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '在机场',
        objective: 'Resolver el aeropuerto: pasaporte, equipaje y boletos.',
        intro: {
          explanation:
            '护照 es el pasaporte y 行李, el equipaje (se cuenta con 件: 两件行李). 票 es el boleto o la entrada, y se cuenta con 张: 两张票.',
          examples: [
            { target: '你的护照呢？', base: '¿Y tu pasaporte?' },
            { target: '我有两件行李。', base: 'Tengo dos maletas.' },
          ],
        },
        takeaways: ['Te arreglas en el aeropuerto.', 'Cuentas boletos con 张 y equipaje con 件.'],
        exercises: [
          ex.translationChoice(
            '护照',
            'pasaporte',
            ['equipaje', 'boleto', 'aeropuerto'],
            ['zh-huzhao'],
            { id: 'zh.ex.vhrbuj15iai6n6' },
          ),
          ex.translationChoice('行李', 'equipaje', ['pasaporte', 'ropa', 'boleto'], ['zh-xingli'], {
            id: 'zh.ex.3o5l53874quo4i',
          }),
          ex.listenChoice(
            '我有两件行李。',
            ['我有一件行李。', '我有两张票。', '我没有行李。'],
            ['zh-xingli'],
            { id: 'zh.ex.r8sue9exn7ah18' },
          ),
          ex.fillBlank(
            '我买了两___火车票。',
            'Compré dos boletos de tren.',
            '张',
            ['件', '本', '杯'],
            ['zh-piao'],
            {
              id: 'zh.ex.36s6xnzkg8jink',
              explanation: 'Los boletos y los papeles se cuentan con 张.',
            },
          ),
          question(
            'zh.ex.pdni3mck6a7xc0',
            AEROPUERTO,
            '¿Cuánto equipaje lleva Zhang Li?',
            'Una maleta',
            ['Dos maletas', 'Nada', 'Tres maletas'],
            ['zh-xingli'],
            'A «你有几件行李？» Zhang Li responde «一件».',
          ),
          question(
            'zh.ex.c4stoz7idd9slk',
            AEROPUERTO,
            '¿A qué hora llega el avión a Shanghái?',
            'A las tres de la tarde',
            ['A las tres de la mañana', 'A las dos de la tarde', 'A las cinco de la tarde'],
            ['zh-dao'],
            'El empleado dice: «下午三点到».',
          ),
          question(
            'zh.ex.qrxcxmd6x8bafi',
            POSTAL,
            '¿Qué cuenta Anna de Shanghái?',
            'Que es grande, con mucha gente y buenos restaurantes',
            [
              'Que es chica y tranquila',
              'Que es grande, pero los restaurantes son malos',
              'Que hace mucho frío',
            ],
            ['zh-shanghai'],
            'Anna escribe: «上海很大，人很多，饭馆也很好！».',
          ),
          reply(
            '你有几件行李？',
            '¿Cuántas maletas tienes? (Responde: dos.)',
            'liǎng jiàn',
            '两件',
            ['zh-xingli'],
            {
              id: 'zh.ex.5dq4p3l76iszv0',
              accepted: [
                'wǒ yǒu liǎng jiàn xíngli',
                '我有两件行李',
                'liǎng jiàn xíngli',
                '两件行李',
              ],
            },
          ),
          write('¿Y tu pasaporte?', 'nǐ de hùzhào ne', '你的护照呢', ['zh-huzhao'], {
            id: 'zh.ex.63bfufauzlskkl',
            accepted: [
              'nǐ de hùzhào zài nǎr',
              '你的护照在哪儿',
              'nǐ de hùzhào zài nǎlǐ',
              '你的护照在哪里',
            ],
          }),
        ],
      },
    ],
  },
};

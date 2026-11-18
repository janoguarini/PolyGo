import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write, ZH_A1_RATE } from '../helpers';

/**
 * Chino A1 U13 «Trabajo, estudios e idiomas» (docs/ZH_A1_A2.md): el plural con 们, 都, las
 * profesiones, 在 + lugar + verbo y 会说 + idioma.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const FIESTA = dialogue(
  'zh.stim.a1-u13-fiesta',
  'Dos personas se conocen en una fiesta en Pekín.',
  [
    ['安娜', '你好！我叫安娜。你做什么工作？'],
    ['李华', '我是医生，在医院工作。你呢？'],
    ['安娜', '我是学生，在北京学习中文。'],
    ['李华', '你的中文很好！'],
  ],
  ZH_A1_RATE,
);

const POST = reading(
  'zh.stim.a1-u13-laoshi',
  'post',
  'Una profesora se presenta en el grupo de la clase.',
  ['大家好！我叫张丽，是大学老师。', '我会说英语，也会说一点儿西班牙语。', '我的学生都很好。'],
  { from: '张丽', title: '大家好！' },
);

const PADRES = dialogue(
  'zh.stim.a1-u13-baba-mama',
  'El profesor Chen le pregunta a Wang Ming por su familia.',
  [
    ['陈老师', '王明，你爸爸妈妈做什么工作？'],
    ['王明', '我爸爸是司机，我妈妈是护士。'],
    ['陈老师', '他们忙吗？'],
    ['王明', '很忙。他们每天都工作。'],
  ],
  ZH_A1_RATE,
);

export const ZH_A1_U13: ZhUnitDef = {
  names: ['安娜', '李华', '张丽', '陈'],
  support: ['大家', '大学生'],
  unit: {
    position: 13,
    title: 'Trabajo, estudios e idiomas',
    titleEn: '工作 Work and languages',
    description: 'El plural con 们, 都, las profesiones, dónde trabajás y qué idiomas hablás.',
    emoji: '💼',
    objective:
      'Podés hablar de varias personas, decir de qué trabajás y dónde, y contar qué idiomas hablás.',
    grammar: {
      title: '们 · 都 · 在 + lugar + verbo',
      explanation:
        'Con 们 los pronombres pasan a plural: 我们, 你们, 他们. 都 (todos) va antes del verbo. El lugar va con 在 antes del verbo: 我在医院工作 («yo en el hospital trabajo»). Las profesiones no cambian en femenino.',
      examples: [
        { target: '我们都是学生。', base: 'Todos somos estudiantes.' },
        { target: '我在公司工作。', base: 'Trabajo en una empresa.' },
        { target: '我会说一点儿英语。', base: 'Hablo un poco de inglés.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U13). Sin revisión nativa: revisar 做什么工作 frente a 是, el uso de 都 y la naturalidad de 认识你很高兴.',
    },
    words: [
      w('zh-nimen', '你们', 'nǐmen', 'ustedes', '你们好！', '¡Hola a todos!', ['pronouns'], {
        acceptedTranslations: ['vosotros'],
      }),
      w('zh-tamen', '他们', 'tāmen', 'ellos', '他们是我的朋友。', 'Ellos son mis amigos.', [
        'pronouns',
      ]),
      w(
        'zh-dou',
        '都',
        'dōu',
        'todos (los dos)',
        '我们都是学生。',
        'Todos somos estudiantes.',
        ['basics'],
        {
          acceptedTranslations: ['todos', 'ambos', 'los dos'],
        },
      ),
      w('zh-zuo-hacer', '做', 'zuò', 'hacer', '你做什么工作？', '¿De qué trabajás?', [
        'verbs',
        'work',
      ]),
      w(
        'zh-yisheng',
        '医生',
        'yīshēng',
        'médico',
        '我爸爸是医生。',
        'Mi papá es médico.',
        ['work'],
        {
          acceptedTranslations: ['médica', 'doctor', 'doctora'],
          emoji: '🩺',
        },
      ),
      w(
        'zh-hushi',
        '护士',
        'hùshi',
        'enfermero/a',
        '我妈妈是护士。',
        'Mi mamá es enfermera.',
        ['work'],
        {
          acceptedTranslations: ['enfermero', 'enfermera'],
        },
      ),
      w('zh-siji', '司机', 'sījī', 'chofer', '他是出租车司机。', 'Él es taxista.', ['work'], {
        acceptedTranslations: ['conductor', 'conductora', 'chófer'],
      }),
      w(
        'zh-fuwuyuan',
        '服务员',
        'fúwùyuán',
        'mozo / moza',
        '她是饭馆的服务员。',
        'Ella es moza en un restaurante.',
        ['work', 'food'],
        { acceptedTranslations: ['mozo', 'moza', 'camarero', 'camarera', 'mesero'] },
      ),
      w(
        'zh-gongsi',
        '公司',
        'gōngsī',
        'empresa',
        '我在公司工作。',
        'Trabajo en una empresa.',
        ['work', 'places'],
        {
          acceptedTranslations: ['compañía', 'firma'],
        },
      ),
      w(
        'zh-daxue',
        '大学',
        'dàxué',
        'universidad',
        '我姐姐在大学学习。',
        'Mi hermana estudia en la universidad.',
        ['places'],
        {
          acceptedTranslations: ['facultad'],
        },
      ),
      w(
        'zh-tongxue',
        '同学',
        'tóngxué',
        'compañero/a de clase',
        '他是我的同学。',
        'Él es mi compañero de clase.',
        ['people'],
        {
          acceptedTranslations: ['compañero', 'compañera'],
        },
      ),
      w(
        'zh-renshi',
        '认识',
        'rènshi',
        'conocer (a alguien)',
        '认识你很高兴！',
        '¡Encantado de conocerte!',
        ['verbs', 'introductions'],
        {
          acceptedTranslations: ['conocer'],
        },
      ),
      w('zh-yingyu', '英语', 'Yīngyǔ', 'inglés', '我会说英语。', 'Hablo inglés.', ['languages']),
      w(
        'zh-xibanyayu',
        '西班牙语',
        'Xībānyáyǔ',
        'español (idioma)',
        '我会说西班牙语。',
        'Hablo español.',
        ['languages'],
        {
          acceptedTranslations: ['español', 'castellano'],
        },
      ),
      w(
        'zh-yidianr',
        '一点儿',
        'yìdiǎnr',
        'un poco',
        '我会说一点儿中文。',
        'Hablo un poco de chino.',
        ['basics'],
        {
          acceptedTranslations: ['un poquito'],
        },
      ),
      w('zh-nali', '哪里', 'nǎlǐ', '¿dónde?', '你在哪里工作？', '¿Dónde trabajás?', ['questions'], {
        acceptedTranslations: ['dónde'],
      }),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '你们和他们',
        objective: 'Hablar de varias personas con 们 y 都.',
        intro: {
          explanation:
            '们 hace el plural de los pronombres: 我们 (nosotros), 你们 (ustedes), 他们 (ellos). 都 significa «todos» o «los dos» y va antes del verbo: 我们都是学生.',
          examples: [
            { target: '你们是学生吗？', base: '¿Ustedes son estudiantes?' },
            { target: '他们都是老师。', base: 'Todos ellos son profesores.' },
          ],
        },
        takeaways: ['Usás 我们, 你们 y 他们.', 'Decís «todos» con 都, antes del verbo.'],
        exercises: [
          ex.translationChoice('你们', 'ustedes', ['ellos', 'nosotros', 'vos'], ['zh-nimen'], {
            id: 'zh.ex.aj6h2dnphvgrow',
          }),
          ex.translationChoice('他们', 'ellos', ['ustedes', 'nosotros', 'ella'], ['zh-tamen'], {
            id: 'zh.ex.vm0ft7p208wky7',
          }),
          ex.listenChoice(
            '他们都是学生。',
            ['我们都是学生。', '你们都是学生吗？', '他们是老师。'],
            ['zh-tamen', 'zh-dou'],
            { id: 'zh.ex.1hwy3g4td1n7kt' },
          ),
          ex.fillBlank(
            '我们___是阿根廷人。',
            'Todos somos argentinos.',
            '都',
            ['很', '的', '吗'],
            ['zh-dou'],
            {
              id: 'zh.ex.ja7t5br18wbywh',
              explanation: '都 va después de quiénes y antes del verbo: 我们都是…',
            },
          ),
          ex.orderWords(
            '你们 都 是 学生 吗？',
            '¿Ustedes son todos estudiantes?',
            ['zh-nimen', 'zh-dou'],
            {
              id: 'zh.ex.4w41em9uit4d5c',
            },
          ),
          tone('都', 'dōu', ['dóu', 'dǒu', 'dòu'], ['zh-dou'], { id: 'zh.ex.2ee7p220c244yz' }),
          ex.matchPairs(
            [
              ['你们', 'ustedes'],
              ['他们', 'ellos'],
              ['都', 'todos (los dos)'],
              ['我们', 'nosotros'],
            ],
            ['zh-nimen', 'zh-tamen', 'zh-dou', 'zh-women'],
            { id: 'zh.ex.h26ol0upp9f8o7' },
          ),
          reply(
            '你们是中国人吗？',
            '¿Ustedes son chinos? (Respondé que no, que son argentinos.)',
            'bù, wǒmen shì Āgēntíng rén',
            '不，我们是阿根廷人',
            ['zh-nimen', 'zh-women'],
            {
              id: 'zh.ex.15dk5dtgrd8s8f',
              accepted: [
                'wǒmen shì Āgēntíng rén',
                '我们是阿根廷人',
                'bù, wǒmen dōu shì Āgēntíng rén',
                '不，我们都是阿根廷人',
              ],
            },
          ),
          write(
            'Todos ellos son profesores.',
            'tāmen dōu shì lǎoshī',
            '他们都是老师',
            ['zh-tamen', 'zh-dou'],
            {
              id: 'zh.ex.e9jmaq2oygsnho',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '你做什么工作？',
        objective: 'Preguntar y decir de qué trabaja alguien.',
        intro: {
          explanation:
            '做 es «hacer». Para preguntar el trabajo se dice 你做什么工作？ y se responde con 是 + profesión: 我是医生. Las profesiones no cambian en femenino: 医生 es médico y médica.',
          examples: [
            { target: '你做什么工作？——我是护士。', base: '¿De qué trabajás? — Soy enfermera.' },
            { target: '我爸爸是司机。', base: 'Mi papá es chofer.' },
          ],
        },
        takeaways: [
          'Preguntás el trabajo con 你做什么工作？',
          'Decís profesiones con 是: 我是医生.',
        ],
        exercises: [
          ex.translationChoice(
            '医生',
            'médico',
            ['enfermero/a', 'chofer', 'profesor/a'],
            ['zh-yisheng'],
            {
              id: 'zh.ex.fgo1b3uw3cy0qj',
            },
          ),
          ex.translationChoice(
            '司机',
            'chofer',
            ['mozo / moza', 'médico', 'empresa'],
            ['zh-siji'],
            {
              id: 'zh.ex.7w599ggvrgnwm0',
            },
          ),
          ex.listenChoice(
            '我妈妈是护士。',
            ['我妈妈是医生。', '我姐姐是护士。', '我妈妈是老师。'],
            ['zh-hushi'],
            { id: 'zh.ex.ldk8movl0a40a9' },
          ),
          ex.fillBlank(
            '你做___工作？',
            '¿De qué trabajás?',
            '什么',
            ['谁', '哪', '几'],
            ['zh-zuo-hacer'],
            {
              id: 'zh.ex.ogmjlb9lflbs19',
              explanation: 'La pregunta va donde iría la respuesta: 你做什么工作？ → 我是医生.',
            },
          ),
          ex.fillBlank(
            'A：你做什么工作？ B：我___服务员。',
            'A: ¿De qué trabajás? B: Soy mozo.',
            '是',
            ['在', '有', '很'],
            ['zh-fuwuyuan'],
            { id: 'zh.ex.olb6yh6bmi0e8w', explanation: 'La profesión va con 是: 我是服务员.' },
          ),
          tone('司机', 'sījī', ['sìjī', 'sījí', 'sǐjǐ'], ['zh-siji'], {
            id: 'zh.ex.1217mpz29e2ulx',
          }),
          ex.matchPairs(
            [
              ['医生', 'médico'],
              ['护士', 'enfermero/a'],
              ['司机', 'chofer'],
              ['服务员', 'mozo / moza'],
            ],
            ['zh-yisheng', 'zh-hushi', 'zh-siji', 'zh-fuwuyuan'],
            { id: 'zh.ex.fwjjiup3ze3skj' },
          ),
          reply(
            '你做什么工作？',
            '¿De qué trabajás? (Respondé que sos estudiante.)',
            'wǒ shì xuésheng',
            '我是学生',
            ['zh-zuo-hacer', 'zh-xuesheng'],
            {
              id: 'zh.ex.i33ntkh5s0mt8h',
              accepted: ['shì xuésheng', '是学生', 'xuésheng', '学生'],
            },
          ),
          write('Mi papá es médico.', 'wǒ bàba shì yīshēng', '我爸爸是医生', ['zh-yisheng'], {
            id: 'zh.ex.57hnp4t2ih1k5y',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '在哪里工作？',
        objective: 'Decir dónde trabaja o estudia alguien.',
        intro: {
          explanation:
            'El lugar va con 在 y antes del verbo: 我在医院工作 («yo en el hospital trabajo»). 哪里 es «dónde», igual que 哪儿 (más común en el norte de China): 你在哪里工作？',
          examples: [
            { target: '我在公司工作。', base: 'Trabajo en una empresa.' },
            {
              target: '你在哪里工作？——我在大学工作。',
              base: '¿Dónde trabajás? — En la universidad.',
            },
          ],
        },
        takeaways: ['Decís dónde trabajás con 在 + lugar + 工作.', 'Preguntás «dónde» con 哪里.'],
        exercises: [
          ex.translationChoice(
            '公司',
            'empresa',
            ['universidad', 'hospital', 'tienda'],
            ['zh-gongsi'],
            {
              id: 'zh.ex.sup06yyvdknlmk',
            },
          ),
          ex.translationChoice(
            '大学',
            'universidad',
            ['empresa', 'escuela', 'supermercado'],
            ['zh-daxue'],
            {
              id: 'zh.ex.3fb1uvl6yj8npa',
            },
          ),
          ex.translationChoice('哪里', '¿dónde?', ['¿qué?', '¿quién?', '¿cuántos?'], ['zh-nali'], {
            id: 'zh.ex.av0wsghb70q6r4',
          }),
          ex.listenChoice(
            '我在公司工作。',
            ['我在大学工作。', '我在医院工作。', '我去公司。'],
            ['zh-gongsi'],
            {
              id: 'zh.ex.e3s4dxpnqb6yj7',
            },
          ),
          ex.fillBlank(
            '我姐姐___医院工作。',
            'Mi hermana trabaja en un hospital.',
            '在',
            ['是', '去', '有'],
            ['zh-zai'],
            {
              id: 'zh.ex.dcd41d8kqdpy45',
              explanation: 'El lugar va con 在 y antes del verbo: 在医院工作.',
            },
          ),
          ex.orderWords('你 在 哪里 工作？', '¿Dónde trabajás?', ['zh-nali'], {
            id: 'zh.ex.b33c4c73i31qz4',
            explanation: 'Primero 在 + lugar, después el verbo: 在哪里工作.',
          }),
          tone('公司', 'gōngsī', ['gòngsì', 'gǒngsǐ', 'góngsí'], ['zh-gongsi'], {
            id: 'zh.ex.69cr4pspmxl4a8',
          }),
          reply(
            '你在哪里工作？',
            '¿Dónde trabajás? (Respondé que en una empresa.)',
            'wǒ zài gōngsī gōngzuò',
            '我在公司工作',
            ['zh-gongsi', 'zh-nali'],
            {
              id: 'zh.ex.ys0jnc8s0sbdar',
              accepted: ['zài gōngsī gōngzuò', '在公司工作', 'zài gōngsī', '在公司'],
            },
          ),
          write(
            'Trabajo en una universidad.',
            'wǒ zài dàxué gōngzuò',
            '我在大学工作',
            ['zh-daxue'],
            {
              id: 'zh.ex.m53owjrj89xbiz',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '你会说英语吗？',
        objective: 'Decir qué idiomas hablás y cuánto.',
        intro: {
          explanation:
            '会 + 说 + idioma es «saber hablar un idioma». 语 significa «idioma»: 英语 (inglés), 西班牙语 (español). 一点儿 (un poco) va antes del idioma: 我会说一点儿中文.',
          examples: [
            {
              target: '你会说英语吗？——会，我会说一点儿。',
              base: '¿Hablás inglés? — Sí, un poco.',
            },
            { target: '我会说西班牙语。', base: 'Hablo español.' },
          ],
        },
        takeaways: ['Decís qué idiomas hablás con 会说.', 'Matizás con 一点儿 (un poco).'],
        exercises: [
          ex.translationChoice(
            '英语',
            'inglés',
            ['español (idioma)', 'chino (idioma)', 'España'],
            ['zh-yingyu'],
            {
              id: 'zh.ex.rf0boj6wv036gp',
            },
          ),
          ex.translationChoice(
            '西班牙语',
            'español (idioma)',
            ['España', 'inglés', 'México'],
            ['zh-xibanyayu'],
            {
              id: 'zh.ex.19p00ycredlamh',
              explanation: '西班牙 es España; con 语 (idioma) es el español.',
            },
          ),
          ex.listenChoice(
            '我会说一点儿英语。',
            ['我会说英语。', '我会说一点儿中文。', '我不会说英语。'],
            ['zh-yidianr', 'zh-yingyu'],
            { id: 'zh.ex.9pqdn8jk8j069k' },
          ),
          ex.fillBlank(
            '我会说___中文。',
            'Hablo un poco de chino.',
            '一点儿',
            ['很', '都', '多少'],
            ['zh-yidianr'],
            {
              id: 'zh.ex.krtqkyi9b2go5r',
              explanation: '一点儿 (un poco) va antes de lo que se sabe poco: 一点儿中文.',
            },
          ),
          ex.orderWords(
            '他们 都 会 说 西班牙语。',
            'Todos ellos hablan español.',
            ['zh-tamen', 'zh-xibanyayu'],
            {
              id: 'zh.ex.b44skvmt2nig12',
            },
          ),
          tone('英语', 'Yīngyǔ', ['Yíngyù', 'Yǐngyú', 'Yìngyū'], ['zh-yingyu'], {
            id: 'zh.ex.m8y2mo6ky5ia8q',
          }),
          ex.matchPairs(
            [
              ['英语', 'inglés'],
              ['西班牙语', 'español (idioma)'],
              ['中文', 'chino (idioma)'],
              ['一点儿', 'un poco'],
            ],
            ['zh-yingyu', 'zh-xibanyayu', 'zh-zhongwen', 'zh-yidianr'],
            { id: 'zh.ex.xuqxibvuamb720' },
          ),
          question(
            'zh.ex.5yo0qn5e6h73me',
            POST,
            '¿Qué idiomas habla Zhang Li?',
            'Inglés y un poco de español',
            ['Sólo chino', 'Español muy bien y nada de inglés', 'Inglés y un poco de francés'],
            ['zh-yingyu', 'zh-xibanyayu'],
            'Zhang Li escribe: «我会说英语，也会说一点儿西班牙语».',
          ),
          reply(
            '你会说英语吗？',
            '¿Sabés hablar inglés? (Respondé que sí, un poco.)',
            'huì, wǒ huì shuō yìdiǎnr',
            '会，我会说一点儿',
            ['zh-yidianr', 'zh-hui'],
            {
              id: 'zh.ex.smpp64chrrl790',
              accepted: [
                'wǒ huì shuō yìdiǎnr Yīngyǔ',
                '我会说一点儿英语',
                'huì yìdiǎnr',
                '会一点儿',
              ],
            },
          ),
          write('Hablo español.', 'wǒ huì shuō Xībānyáyǔ', '我会说西班牙语', ['zh-xibanyayu'], {
            id: 'zh.ex.v7qzvf3tx1jytn',
            accepted: ['wǒ shuō Xībānyáyǔ', '我说西班牙语'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '认识你很高兴',
        objective: 'Presentarte y entender una presentación.',
        intro: {
          explanation:
            '认识 es «conocer» a una persona. Al presentarte se dice 认识你很高兴 («conocerte me pone contento»). 同学 es el compañero o la compañera de clase.',
          examples: [
            { target: '认识你很高兴！', base: '¡Encantado de conocerte!' },
            { target: '他是我的同学。', base: 'Él es mi compañero de clase.' },
          ],
        },
        takeaways: [
          'Te presentás con 认识你很高兴.',
          'Entendés de qué trabaja alguien en una charla.',
        ],
        exercises: [
          ex.translationChoice(
            '认识',
            'conocer (a alguien)',
            ['saber (hacer algo)', 'llamarse', 'estudiar'],
            ['zh-renshi'],
            { id: 'zh.ex.pf20bp9hx49hft' },
          ),
          ex.listenChoice(
            '认识你很高兴！',
            ['你好！', '谢谢你！', '你叫什么名字？'],
            ['zh-renshi', 'zh-gaoxing'],
            {
              id: 'zh.ex.t9pgrtgft71ioy',
            },
          ),
          ex.fillBlank(
            '她是我的___，我们都是大学生。',
            'Ella es mi compañera de clase; las dos somos universitarias.',
            '同学',
            ['医生', '司机', '公司'],
            ['zh-tongxue'],
            { id: 'zh.ex.vln8kc7dvx2g0f', skill: 'vocabulary' },
          ),
          question(
            'zh.ex.o1vb8nxi7xkbu8',
            FIESTA,
            '¿De qué trabaja Li Hua?',
            'Es médico y trabaja en un hospital',
            ['Es estudiante en Pekín', 'Es profesor de chino', 'Es chofer de taxi'],
            ['zh-yisheng'],
            'Li Hua dice: «我是医生，在医院工作».',
          ),
          question(
            'zh.ex.xqgjqbqvtwuqnq',
            FIESTA,
            '¿Qué hace Anna en Pekín?',
            'Estudia chino',
            ['Trabaja en un hospital', 'Enseña inglés', 'Trabaja en una empresa'],
            ['zh-zuo-hacer'],
            'Anna dice: «我是学生，在北京学习中文».',
          ),
          question(
            'zh.ex.b2ox0oajbnya9t',
            PADRES,
            '¿De qué trabajan los padres de Wang Ming?',
            'El papá es chofer y la mamá es enfermera',
            [
              'El papá es médico y la mamá es profesora',
              'Los dos son enfermeros',
              'Los dos son choferes',
            ],
            ['zh-siji', 'zh-hushi'],
            'Wang Ming dice: «我爸爸是司机，我妈妈是护士».',
          ),
          question(
            'zh.ex.keha32brvjd0b6',
            PADRES,
            '¿Cuándo trabajan los padres de Wang Ming?',
            'Todos los días',
            ['Sólo el fin de semana', 'Sólo a la mañana', 'No trabajan'],
            ['zh-tamen', 'zh-dou'],
            'Wang Ming dice: «他们每天都工作».',
          ),
          reply(
            '他们是谁？',
            '¿Quiénes son? (Respondé que son tus compañeros de clase.)',
            'tāmen shì wǒ de tóngxué',
            '他们是我的同学',
            ['zh-tongxue', 'zh-tamen'],
            {
              id: 'zh.ex.cikkegoz7tvqop',
              accepted: ['shì wǒ de tóngxué', '是我的同学', 'wǒ de tóngxué', '我的同学'],
            },
          ),
          write('Encantado de conocerte.', 'rènshi nǐ hěn gāoxìng', '认识你很高兴', ['zh-renshi'], {
            id: 'zh.ex.g47avjx3ol05hw',
          }),
        ],
      },
    ],
  },
};

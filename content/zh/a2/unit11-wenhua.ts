import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U11 «Cultura y costumbres chinas» (docs/ZH_A1_A2.md): el Año Nuevo chino (红包, 放假,
 * 回老家), la Fiesta de Medio Otoño, regalos y tradiciones (no regalar un reloj), 为什么 / 因为…所以,
 * 先…再 y adjetivos repetidos (甜甜的).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CHUNJIE = dialogue(
  'zh.stim.a2-u11-chunjie',
  'Anna le pregunta a Li Hua por el Año Nuevo chino.',
  [
    ['安娜', '春节的时候你们做什么？'],
    ['李华', '我们先回老家，然后一起吃饺子。'],
    ['安娜', '为什么吃饺子？'],
    ['李华', '因为饺子是传统的春节菜。孩子都有红包！'],
  ],
);

const LUNA = reading(
  'zh.stim.a2-u11-zhongqiu',
  'description',
  'Una explicación breve de la Fiesta de Medio Otoño.',
  [
    '中秋节在秋天。',
    '中秋节的时候，家人一起吃月饼，看月亮。',
    '月饼甜甜的，很好吃。',
    '学生都不去学校。',
  ],
  { title: '中秋节' },
);

const REGALO = dialogue('zh.stim.a2-u11-liwu', 'Anna le pide un consejo a Zhang Li.', [
  ['安娜', '我想送陈老师一个礼物。送什么好？'],
  ['张丽', '你可以送茶。别送钟！'],
  ['安娜', '为什么？'],
  ['张丽', '因为很多中国人不喜欢。这是传统。'],
]);

export const ZH_A2_U11: ZhUnitDef = {
  names: ['安娜', '李华', '张丽', '陈'],
  support: ['老家', '月亮', '钟'],
  unit: {
    position: 11,
    title: 'Cultura y costumbres chinas',
    titleEn: '节日 Festivals and customs',
    description:
      'El Año Nuevo chino, la Fiesta de Medio Otoño, regalos y tradiciones, por qué y en qué orden.',
    emoji: '🧧',
    objective:
      'Puedes contar cómo se festeja el Año Nuevo chino y la Fiesta de Medio Otoño, preguntar y explicar por qué, decir en qué orden se hacen las cosas y hablar de regalos.',
    grammar: {
      title: '为什么 · 因为…所以… · 先…再… · adjetivos repetidos',
      explanation:
        '为什么 pregunta «¿por qué?» y se responde con 因为 (porque); 所以 es «por eso», y los dos se pueden usar juntos. 先 A 再 B es «primero A y después B». Algunos adjetivos se repiten para sonar más vivos: 甜甜的 (dulcecito).',
      examples: [
        { target: '因为下雨了，所以我不去。', base: 'Como llueve, no voy.' },
        { target: '我们先吃饭，再看电视。', base: 'Primero comemos y después miramos la tele.' },
        {
          target: '月饼甜甜的，很好吃。',
          base: 'Los pasteles de luna son dulcecitos y muy ricos.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U11). Sin revisión nativa: revisar la información cultural (红包, 送钟, 回老家) y 因为…所以.',
    },
    words: [
      w(
        'zh-chunjie',
        '春节',
        'Chūnjié',
        'Año Nuevo chino',
        '春节的时候我们放假。',
        'En Año Nuevo chino tenemos vacaciones.',
        ['culture'],
        {
          acceptedTranslations: ['Fiesta de la Primavera', 'Año Nuevo'],
        },
      ),
      w(
        'zh-guonian',
        '过年',
        'guònián',
        'festejar el Año Nuevo',
        '你在哪儿过年？',
        '¿Dónde pasas el Año Nuevo?',
        ['culture'],
        {
          acceptedTranslations: ['pasar el Año Nuevo'],
        },
      ),
      w(
        'zh-fangjia',
        '放假',
        'fàngjià',
        'tener vacaciones',
        '春节的时候我们放假。',
        'En Año Nuevo chino tenemos vacaciones.',
        ['culture', 'time'],
        {
          acceptedTranslations: ['estar de vacaciones', 'vacaciones'],
        },
      ),
      w(
        'zh-hongbao',
        '红包',
        'hóngbāo',
        'sobre rojo',
        '孩子都有红包！',
        '¡Todos los chicos reciben un sobre rojo!',
        ['culture'],
        {
          acceptedTranslations: ['sobre rojo con dinero'],
          emoji: '🧧',
        },
      ),
      w(
        'zh-zhongqiujie',
        '中秋节',
        'Zhōngqiūjié',
        'Fiesta de Medio Otoño',
        '中秋节我们吃月饼。',
        'En la Fiesta de Medio Otoño comemos pasteles de luna.',
        ['culture'],
        {
          acceptedTranslations: ['Fiesta de la Luna'],
        },
      ),
      w(
        'zh-yuebing',
        '月饼',
        'yuèbing',
        'pastel de luna',
        '月饼甜甜的，很好吃。',
        'Los pasteles de luna son dulcecitos y muy ricos.',
        ['culture', 'food'],
        {
          acceptedTranslations: ['pasteles de luna'],
          emoji: '🥮',
        },
      ),
      w(
        'zh-jieri',
        '节日',
        'jiérì',
        'fiesta (día festivo)',
        '春节是中国最大的节日。',
        'El Año Nuevo es la fiesta más grande de China.',
        ['culture'],
        {
          acceptedTranslations: ['fiesta', 'feriado', 'festividad'],
        },
      ),
      w(
        'zh-chuantong',
        '传统',
        'chuántǒng',
        'tradición',
        '吃饺子是春节的传统。',
        'Comer jiaozi es una tradición del Año Nuevo.',
        ['culture'],
        {
          acceptedTranslations: ['tradicional'],
        },
      ),
      w(
        'zh-song',
        '送',
        'sòng',
        'regalar',
        '我想送妈妈一个礼物。',
        'Le quiero hacer un regalo a mamá.',
        ['verbs', 'social'],
        {
          acceptedTranslations: ['dar', 'obsequiar'],
        },
      ),
      w(
        'zh-liwu',
        '礼物',
        'lǐwù',
        'regalo',
        '我想送妈妈一个礼物。',
        'Le quiero hacer un regalo a mamá.',
        ['social'],
        {
          acceptedTranslations: ['obsequio'],
          emoji: '🎁',
        },
      ),
      w(
        'zh-weishenme',
        '为什么',
        'wèishénme',
        '¿por qué?',
        '你为什么不去？',
        '¿Por qué no vas?',
        ['questions'],
        {
          acceptedTranslations: ['por qué'],
        },
      ),
      w(
        'zh-yinwei',
        '因为',
        'yīnwèi',
        'porque',
        '因为下雨了，所以我不去。',
        'Como llueve, no voy.',
        ['grammar'],
        {
          acceptedTranslations: ['como'],
        },
      ),
      w(
        'zh-suoyi',
        '所以',
        'suǒyǐ',
        'por eso',
        '我很累，所以我想休息。',
        'Estoy cansado, por eso quiero descansar.',
        ['grammar'],
        {
          acceptedTranslations: ['así que', 'entonces'],
        },
      ),
      w(
        'zh-xian',
        '先',
        'xiān',
        'primero',
        '我们先吃饭，再看电视。',
        'Primero comemos y después miramos la tele.',
        ['grammar'],
        {
          acceptedTranslations: ['antes'],
        },
      ),
      w(
        'zh-zai-despues',
        '再',
        'zài',
        'después (otra vez)',
        '先写作业，再玩游戏。',
        'Primero la tarea y después juegas.',
        ['grammar'],
        {
          acceptedTranslations: ['luego', 'otra vez', 'de nuevo'],
        },
      ),
      w(
        'zh-youyisi',
        '有意思',
        'yǒu yìsi',
        'interesante',
        '中国的节日很有意思。',
        'Las fiestas chinas son muy interesantes.',
        ['adjectives'],
        {
          acceptedTranslations: ['entretenido', 'divertido'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '春节',
        objective: 'Contar cómo se festeja el Año Nuevo chino.',
        intro: {
          explanation:
            '春节 es el Año Nuevo chino (en enero o febrero, según la luna) y 过年, festejarlo. Todos 放假 (tienen vacaciones) y muchos vuelven a su ciudad. A los chicos se les da un 红包: un sobre rojo con dinero.',
          examples: [
            { target: '春节的时候我们放假。', base: 'En Año Nuevo chino tenemos vacaciones.' },
            {
              target: '孩子过年的时候有红包。',
              base: 'En Año Nuevo los chicos reciben sobres rojos.',
            },
          ],
        },
        takeaways: ['Hablas del 春节 y de 过年.', 'Sabes qué es un 红包.'],
        exercises: [
          ex.translationChoice(
            '春节',
            'Año Nuevo chino',
            ['Fiesta de Medio Otoño', 'cumpleaños', 'vacaciones'],
            ['zh-chunjie'],
            {
              id: 'zh.ex.1uftop30osg4np',
            },
          ),
          ex.translationChoice(
            '红包',
            'sobre rojo',
            ['pastel de luna', 'bolso rojo', 'tarjeta'],
            ['zh-hongbao'],
            { id: 'zh.ex.27vw5m63o06di5' },
          ),
          ex.listenChoice(
            '春节的时候我们放假。',
            ['春节的时候我们上班。', '春节的时候我们不放假。', '春节的时候我们回家。'],
            ['zh-chunjie', 'zh-fangjia'],
            { id: 'zh.ex.zenf6of0l2yjqd' },
          ),
          ex.fillBlank(
            '春节的时候，孩子都有___。',
            'En Año Nuevo, todos los chicos reciben un sobre rojo.',
            '红包',
            ['红色', '放假', '过年'],
            ['zh-hongbao'],
            {
              id: 'zh.ex.im0fcl8l6qqubq',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '你在哪儿___？',
            '¿Dónde pasas el Año Nuevo?',
            '过年',
            ['红包', '春天', '生日'],
            ['zh-guonian'],
            {
              id: 'zh.ex.jh19smlz61b3vx',
              skill: 'vocabulary',
            },
          ),
          tone('放假', 'fàngjià', ['fāngjiā', 'fángjiá', 'fǎngjiǎ'], ['zh-fangjia'], {
            id: 'zh.ex.d6z71xdtzliotv',
          }),
          ex.matchPairs(
            [
              ['春节', 'Año Nuevo chino'],
              ['过年', 'festejar el Año Nuevo'],
              ['放假', 'tener vacaciones'],
              ['红包', 'sobre rojo'],
            ],
            ['zh-chunjie', 'zh-guonian', 'zh-fangjia', 'zh-hongbao'],
            { id: 'zh.ex.489blddnre39qq' },
          ),
          reply(
            '春节的时候你放假吗？',
            '¿Tienes vacaciones en Año Nuevo chino? (Responde que sí.)',
            'fàngjià',
            '放假',
            ['zh-fangjia'],
            {
              id: 'zh.ex.19o9x8w9alo8e2',
              accepted: [
                'wǒ fàngjià',
                '我放假',
                'chūnjié de shíhou wǒ fàngjià',
                '春节的时候我放假',
              ],
            },
          ),
          write(
            'En Año Nuevo chino vuelvo a casa.',
            'chūnjié de shíhou wǒ huí jiā',
            '春节的时候我回家',
            ['zh-chunjie'],
            {
              id: 'zh.ex.efhuhn5gseqn9w',
              accepted: [
                'wǒ chūnjié huí jiā',
                '我春节回家',
                'guònián de shíhou wǒ huí jiā',
                '过年的时候我回家',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '为什么？因为…',
        objective: 'Preguntar y explicar por qué.',
        intro: {
          explanation:
            '为什么 es «¿por qué?». Se responde con 因为 (porque), y 所以 es «por eso». En chino se usan juntos sin problema: 因为下雨了，所以我不去.',
          examples: [
            { target: '你为什么不去？', base: '¿Por qué no vas?' },
            { target: '因为下雨了，所以我不去。', base: 'Como llueve, no voy.' },
          ],
        },
        takeaways: ['Preguntas con 为什么.', 'Explicas con 因为…所以….'],
        exercises: [
          ex.translationChoice(
            '为什么',
            '¿por qué?',
            ['¿cómo?', '¿cuándo?', '¿dónde?'],
            ['zh-weishenme'],
            { id: 'zh.ex.589fb8l0ojbce6' },
          ),
          ex.translationChoice(
            '所以',
            'por eso',
            ['porque', 'pero', 'o (en preguntas)'],
            ['zh-suoyi'],
            { id: 'zh.ex.4352jem1fpdxij' },
          ),
          ex.listenChoice(
            '你为什么不去？',
            ['你怎么去？', '你为什么不来？', '你什么时候去？'],
            ['zh-weishenme'],
            { id: 'zh.ex.43xb277ah2rhft' },
          ),
          ex.fillBlank(
            '___下雨了，所以我不去。',
            'Como llueve, no voy.',
            '因为',
            ['所以', '为什么', '可是'],
            ['zh-yinwei'],
            {
              id: 'zh.ex.7folvmkv5g7kk8',
            },
          ),
          ex.fillBlank(
            '我很累，___我想休息。',
            'Estoy cansado, por eso quiero descansar.',
            '所以',
            ['因为', '为什么', '还是'],
            ['zh-suoyi'],
            {
              id: 'zh.ex.be50c30ej7z7bs',
            },
          ),
          tone('因为', 'yīnwèi', ['yínwèi', 'yǐnwéi', 'yìnwěi'], ['zh-yinwei'], {
            id: 'zh.ex.akmoewaz7pj27k',
          }),
          ex.orderWords(
            '因为 我 生病 了， 所以 没 去。',
            'Como me enfermé, no fui.',
            ['zh-yinwei', 'zh-suoyi'],
            { id: 'zh.ex.gvjb2u7693uypi' },
          ),
          reply(
            '你为什么学中文？',
            '¿Por qué estudias chino? (Responde que porque te gusta China.)',
            'yīnwèi wǒ xǐhuan Zhōngguó',
            '因为我喜欢中国',
            ['zh-yinwei', 'zh-weishenme'],
            {
              id: 'zh.ex.ybemn18onn5zj5',
              accepted: [
                'wǒ xǐhuan Zhōngguó',
                '我喜欢中国',
                'yīnwèi xǐhuan Zhōngguó',
                '因为喜欢中国',
              ],
            },
          ),
          write(
            'Como estoy ocupado, no voy.',
            'yīnwèi wǒ hěn máng, suǒyǐ wǒ bú qù',
            '因为我很忙，所以我不去',
            ['zh-yinwei', 'zh-suoyi'],
            {
              id: 'zh.ex.5hesp720y26dpv',
              accepted: ['yīnwèi wǒ hěn máng, suǒyǐ bú qù', '因为我很忙，所以不去'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '中秋节',
        objective: 'Hablar de la Fiesta de Medio Otoño y de las fiestas.',
        intro: {
          explanation:
            '中秋节 es la Fiesta de Medio Otoño: la familia se junta, mira la luna llena y come 月饼 (pasteles de luna). 节日 es una fiesta o feriado. Algunos adjetivos se repiten para sonar más vivos: 甜甜的 (dulcecito).',
          examples: [
            {
              target: '中秋节我们吃月饼。',
              base: 'En la Fiesta de Medio Otoño comemos pasteles de luna.',
            },
            {
              target: '月饼甜甜的，很好吃。',
              base: 'Los pasteles de luna son dulcecitos y muy ricos.',
            },
          ],
        },
        takeaways: ['Hablas del 中秋节 y los 月饼.', 'Reconoces adjetivos repetidos como 甜甜的.'],
        exercises: [
          ex.translationChoice(
            '月饼',
            'pastel de luna',
            ['sobre rojo', 'fideos', 'arroz'],
            ['zh-yuebing'],
            { id: 'zh.ex.c65z2mtiyqf2xi' },
          ),
          ex.translationChoice(
            '节日',
            'fiesta (día festivo)',
            ['cumpleaños', 'tener vacaciones', 'reunión (juntada)'],
            ['zh-jieri'],
            {
              id: 'zh.ex.mlvyk4i41x4fs5',
            },
          ),
          ex.listenChoice(
            '中秋节我们吃月饼。',
            ['春节我们吃饺子。', '中秋节我们吃饺子。', '中秋节我们看月亮。'],
            ['zh-zhongqiujie', 'zh-yuebing'],
            {
              id: 'zh.ex.vyljh05jv5fgok',
            },
          ),
          ex.fillBlank(
            '月饼甜___的，很好吃。',
            'Los pasteles de luna son dulcecitos y muy ricos.',
            '甜',
            ['很', '太', '了'],
            ['zh-yuebing', 'zh-tian'],
            {
              id: 'zh.ex.nl7d686f1vhg14',
              explanation:
                'Algunos adjetivos se repiten (甜甜的) para sonar más vivos y cariñosos.',
            },
          ),
          ex.fillBlank(
            '春节是中国最大的___。',
            'El Año Nuevo es la fiesta más grande de China.',
            '节日',
            ['生日', '月饼', '红包'],
            ['zh-jieri'],
            {
              id: 'zh.ex.0wyxyzob6m3ys7',
              skill: 'vocabulary',
            },
          ),
          tone('月饼', 'yuèbing', ['yuēbing', 'yuébing', 'yuěbing'], ['zh-yuebing'], {
            id: 'zh.ex.fwnus6ukjmiitz',
          }),
          ex.matchPairs(
            [
              ['中秋节', 'Fiesta de Medio Otoño'],
              ['月饼', 'pastel de luna'],
              ['节日', 'fiesta (día festivo)'],
              ['春节', 'Año Nuevo chino'],
            ],
            ['zh-zhongqiujie', 'zh-yuebing', 'zh-jieri', 'zh-chunjie'],
            { id: 'zh.ex.cr3g54e4o2urgd' },
          ),
          reply(
            '中秋节你们吃什么？',
            '¿Qué comen en la Fiesta de Medio Otoño? (Responde: pasteles de luna.)',
            'wǒmen chī yuèbing',
            '我们吃月饼',
            ['zh-yuebing'],
            {
              id: 'zh.ex.lcly51mr7z6hc0',
              accepted: ['chī yuèbing', '吃月饼', 'yuèbing', '月饼'],
            },
          ),
          write(
            'Me gustan las fiestas chinas.',
            'wǒ xǐhuan Zhōngguó de jiérì',
            '我喜欢中国的节日',
            ['zh-jieri'],
            { id: 'zh.ex.fanm4t0l6ayqug' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '送礼物',
        objective: 'Hablar de regalos y tradiciones.',
        intro: {
          explanation:
            '送 es regalar o dar: 送礼物 (hacer un regalo). Quien recibe va enseguida: 送老师一个礼物. 传统 es la tradición. Ojo: en China no se regala un reloj de pared (钟), porque 送钟 suena igual que una expresión sobre la muerte.',
          examples: [
            { target: '我想送妈妈一个礼物。', base: 'Le quiero hacer un regalo a mamá.' },
            {
              target: '吃饺子是春节的传统。',
              base: 'Comer jiaozi es una tradición del Año Nuevo.',
            },
          ],
        },
        takeaways: [
          'Dices a quién regalas algo con 送.',
          'Conoces algunas tradiciones con los regalos.',
        ],
        exercises: [
          ex.translationChoice(
            '礼物',
            'regalo',
            ['sobre rojo', 'pastel de luna', 'tradición'],
            ['zh-liwu'],
            { id: 'zh.ex.c5vpxkplh4tkyh' },
          ),
          ex.translationChoice(
            '传统',
            'tradición',
            ['fiesta (día festivo)', 'regalo', 'tener vacaciones'],
            ['zh-chuantong'],
            {
              id: 'zh.ex.hblzz3moy2cwbn',
            },
          ),
          ex.listenChoice(
            '我想送妈妈一个礼物。',
            ['我想送爸爸一个礼物。', '我想买一个礼物。', '妈妈送我一个礼物。'],
            ['zh-song', 'zh-liwu'],
            {
              id: 'zh.ex.aod4m2xxuzx17m',
            },
          ),
          ex.fillBlank(
            '生日的时候，朋友___了我一本书。',
            'Para mi cumpleaños, un amigo me regaló un libro.',
            '送',
            ['买', '卖', '看'],
            ['zh-song'],
            {
              id: 'zh.ex.miul19e5t8puaf',
              explanation: '送 + persona + cosa: a quién le regalas qué.',
            },
          ),
          ex.fillBlank(
            '吃饺子是春节的___。',
            'Comer jiaozi es una tradición del Año Nuevo.',
            '传统',
            ['礼物', '红包', '月饼'],
            ['zh-chuantong'],
            {
              id: 'zh.ex.ee24xnmo3hccvd',
              skill: 'vocabulary',
            },
          ),
          tone('礼物', 'lǐwù', ['lìwù', 'líwú', 'lǐwū'], ['zh-liwu'], {
            id: 'zh.ex.v7ed5gi3dsllrc',
          }),
          question(
            'zh.ex.v2vd137yufhqz7',
            REGALO,
            '¿Qué le recomienda Zhang Li regalarle al profesor?',
            'Té',
            ['Un reloj', 'Un libro', 'Pasteles de luna'],
            ['zh-song'],
            'Zhang Li dice: «你可以送茶».',
          ),
          question(
            'zh.ex.zwwcyiu08ynj04',
            REGALO,
            '¿Qué no conviene regalar y por qué?',
            'Un reloj, porque a mucha gente en China no le gusta',
            ['Té, porque es caro', 'Un libro, porque es aburrido', 'Un reloj, porque es caro'],
            ['zh-chuantong', 'zh-yinwei'],
            'Zhang Li dice: «别送钟！… 因为很多中国人不喜欢。这是传统». 送钟 suena igual que una expresión sobre la muerte.',
          ),
          reply(
            '你想送他什么？',
            '¿Qué le quieres regalar? (Responde que un libro.)',
            'wǒ xiǎng sòng tā yì běn shū',
            '我想送他一本书',
            ['zh-song'],
            {
              id: 'zh.ex.ubjkfufx9bkvk9',
              accepted: [
                'sòng tā yì běn shū',
                '送他一本书',
                'yì běn shū',
                '一本书',
                'wǒ xiǎng sòng yì běn shū',
                '我想送一本书',
              ],
            },
          ),
          write(
            'Le hice un regalo a mamá.',
            'wǒ sòng le māma yí ge lǐwù',
            '我送了妈妈一个礼物',
            ['zh-song', 'zh-liwu'],
            {
              id: 'zh.ex.00x6ly1sdcip87',
              accepted: ['wǒ gěi māma sòng le yí ge lǐwù', '我给妈妈送了一个礼物'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '先…再…',
        objective: 'Decir en qué orden se hacen las cosas y entender textos sobre fiestas.',
        intro: {
          explanation:
            '先 A 再 B (o 然后 B) es «primero A y después B»: 我们先吃饭，再看电视. 再 también es «otra vez». 有意思 es «interesante, entretenido».',
          examples: [
            {
              target: '我们先吃饭，再看电视。',
              base: 'Primero comemos y después miramos la tele.',
            },
            { target: '中国的节日很有意思。', base: 'Las fiestas chinas son muy interesantes.' },
          ],
        },
        takeaways: [
          'Ordenas acciones con 先…再….',
          'Entiendes cómo se festejan las fiestas chinas.',
        ],
        exercises: [
          ex.translationChoice(
            '有意思',
            'interesante',
            ['aburrido', 'difícil', 'tradicional'],
            ['zh-youyisi'],
            { id: 'zh.ex.tmp6g7z159x6sh' },
          ),
          ex.listenChoice(
            '我们先吃饭，再看电视。',
            ['我们先看电视，再吃饭。', '我们吃饭，不看电视。', '我们先吃饭，然后去公园。'],
            ['zh-xian', 'zh-zai-despues'],
            {
              id: 'zh.ex.09cdmayhekfdxo',
            },
          ),
          ex.fillBlank(
            '先写作业，___玩游戏。',
            'Primero haz la tarea y después juega.',
            '再',
            ['先', '也', '都'],
            ['zh-zai-despues', 'zh-xian'],
            {
              id: 'zh.ex.ljcw9so9zeenhk',
            },
          ),
          question(
            'zh.ex.3o8yf5k5qc7lbr',
            CHUNJIE,
            '¿Qué hace primero la familia de Li Hua en Año Nuevo?',
            'Vuelve a su ciudad de origen',
            ['Come jiaozi', 'Va de viaje al extranjero', 'Trabaja'],
            ['zh-xian'],
            'Li Hua dice: «我们先回老家，然后一起吃饺子».',
          ),
          question(
            'zh.ex.4e7puv20s81iav',
            CHUNJIE,
            '¿Por qué comen jiaozi?',
            'Porque es una comida tradicional de Año Nuevo',
            ['Porque son baratos', 'Porque a los chicos les gustan', 'Porque son fáciles de hacer'],
            ['zh-yinwei', 'zh-chuantong'],
            'Li Hua dice: «因为饺子是传统的春节菜».',
          ),
          question(
            'zh.ex.x2w2hq5p4xaxyx',
            LUNA,
            '¿Qué hace la familia en la Fiesta de Medio Otoño?',
            'Come pasteles de luna y mira la luna',
            ['Come jiaozi y da sobres rojos', 'Viaja al extranjero', 'Va a la escuela'],
            ['zh-zhongqiujie', 'zh-yuebing'],
            'El texto dice: «家人一起吃月饼，看月亮».',
          ),
          question(
            'zh.ex.8lo78p6fmwer2l',
            LUNA,
            '¿Cómo son los pasteles de luna, según el texto?',
            'Dulcecitos y muy ricos',
            ['Picantes', 'Salados', 'Fríos y feos'],
            ['zh-yuebing'],
            'El texto dice: «月饼甜甜的，很好吃».',
          ),
          reply(
            '中国的节日怎么样？',
            '¿Qué tal las fiestas chinas? (Responde que son muy interesantes.)',
            'hěn yǒu yìsi',
            '很有意思',
            ['zh-youyisi'],
            {
              id: 'zh.ex.6cjtfrioc1830k',
              accepted: [
                'fēicháng yǒu yìsi',
                '非常有意思',
                'Zhōngguó de jiérì hěn yǒu yìsi',
                '中国的节日很有意思',
                'yǒu yìsi',
                '有意思',
              ],
            },
          ),
          write(
            'Primero como y después miro la tele.',
            'wǒ xiān chīfàn, zài kàn diànshì',
            '我先吃饭，再看电视',
            ['zh-xian', 'zh-zai-despues'],
            {
              id: 'zh.ex.4t9jnqztnzu1hq',
              accepted: ['wǒ xiān chīfàn, ránhòu kàn diànshì', '我先吃饭，然后看电视'],
            },
          ),
        ],
      },
    ],
  },
};

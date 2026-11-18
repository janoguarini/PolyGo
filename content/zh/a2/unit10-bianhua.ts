import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U10 «Rutinas, cambios y relaciones» (docs/ZH_A1_A2.md): 以前 / 现在 y 了 de cambio
 * (不…了), 越来越, 开始, 以后, la pareja y los vecinos, …的时候 y 一边…一边.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CAMBIO = dialogue('zh.stim.a2-u10-kafei', 'Zhang Li nota un cambio en Li Hua.', [
  ['张丽', '李华，你以前喝咖啡吗？'],
  ['李华', '以前不喝，现在每天都喝了。'],
  ['张丽', '你的习惯变了！'],
  ['李华', '是的，工作越来越忙了。'],
]);

const BODA = reading(
  'zh.stim.a2-u10-jiehun',
  'post',
  'Wang Ming cuenta una noticia de su familia.',
  ['我姐姐下个月结婚！', '她的男朋友是我们的邻居。', '他们是小的时候认识的。', '我们都很高兴！'],
  { from: '王明' },
);

const ABUELA = dialogue('zh.stim.a2-u10-nainai', 'Anna le pregunta a Wang Ming por su abuela.', [
  ['安娜', '王明，你奶奶多大了？'],
  ['王明', '八十岁了。她年轻的时候是老师。'],
  ['安娜', '她现在还工作吗？'],
  ['王明', '不工作了。她每天一边听音乐一边做饭。'],
]);

export const ZH_A2_U10: ZhUnitDef = {
  names: ['张丽', '李华', '安娜'],
  support: ['奶奶'],
  unit: {
    position: 10,
    title: 'Rutinas, cambios y relaciones',
    titleEn: '变化 Changes',
    description:
      'Antes y ahora, cosas que cambian, la pareja y los vecinos, «cuando…» y «mientras…».',
    emoji: '🔄',
    objective:
      'Podés contar cómo eran las cosas antes y cómo son ahora, decir qué cambia cada vez más, hablar de parejas, hijos y vecinos, y contar qué hacías de chico.',
    grammar: {
      title: '以前…现在…了 · 越来越 · …的时候 · 一边…一边',
      explanation:
        '以前 (antes) contrasta con 现在; 了 al final marca el cambio y 不…了 es «ya no». 越来越 + adjetivo es «cada vez más». …的时候 es «cuando…» y va al principio. 一边 A 一边 B es hacer dos cosas a la vez.',
      examples: [
        { target: '以前我不喝咖啡，现在喝了。', base: 'Antes no tomaba café; ahora sí.' },
        { target: '天气越来越冷了。', base: 'Hace cada vez más frío.' },
        { target: '她一边听音乐一边做饭。', base: 'Cocina mientras escucha música.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U10). Sin revisión nativa: revisar 跟…结婚, 是…的 en 小的时候认识的 y 老 para personas.',
    },
    words: [
      w('zh-yiqian', '以前', 'yǐqián', 'antes', '以前我不喝咖啡。', 'Antes no tomaba café.', [
        'time',
      ]),
      w(
        'zh-yihou',
        '以后',
        'yǐhòu',
        'más adelante',
        '以后我想去中国工作。',
        'Más adelante quiero ir a trabajar a China.',
        ['time'],
        {
          acceptedTranslations: ['en el futuro', 'después'],
        },
      ),
      w(
        'zh-kaishi',
        '开始',
        'kāishǐ',
        'empezar',
        '我开始工作了。',
        'Empecé a trabajar.',
        ['verbs'],
        {
          acceptedTranslations: ['comenzar'],
        },
      ),
      w(
        'zh-yuelaiyue',
        '越来越',
        'yuèláiyuè',
        'cada vez más',
        '我的中文越来越好。',
        'Mi chino está cada vez mejor.',
        ['grammar'],
      ),
      w(
        'zh-bian',
        '变',
        'biàn',
        'volverse (cambiar)',
        '天气变了。',
        'El clima cambió.',
        ['verbs'],
        {
          acceptedTranslations: ['volverse', 'transformarse'],
        },
      ),
      w(
        'zh-xiguan',
        '习惯',
        'xíguàn',
        'costumbre (acostumbrarse)',
        '你的习惯变了！',
        '¡Cambiaron tus costumbres!',
        ['daily'],
        {
          acceptedTranslations: ['costumbre', 'hábito', 'acostumbrarse'],
        },
      ),
      w(
        'zh-nanpengyou',
        '男朋友',
        'nán péngyou',
        'novio',
        '我姐姐有男朋友。',
        'Mi hermana tiene novio.',
        ['people', 'social'],
      ),
      w(
        'zh-nvpengyou',
        '女朋友',
        'nǚ péngyou',
        'novia',
        '我哥哥的女朋友很漂亮。',
        'La novia de mi hermano es muy linda.',
        ['people', 'social'],
      ),
      w(
        'zh-jiehun',
        '结婚',
        'jiéhūn',
        'casarse',
        '他们去年结婚了。',
        'Se casaron el año pasado.',
        ['social'],
        { emoji: '💍' },
      ),
      w(
        'zh-linju',
        '邻居',
        'línjū',
        'vecino',
        '我的邻居是医生。',
        'Mi vecino es médico.',
        ['people'],
        {
          acceptedTranslations: ['vecina', 'vecinos'],
        },
      ),
      w(
        'zh-haizi',
        '孩子',
        'háizi',
        'hijo/a (chico)',
        '他们有两个孩子。',
        'Tienen dos hijos.',
        ['people', 'family'],
        {
          acceptedTranslations: ['hijo', 'hija', 'niño', 'niña', 'chico'],
        },
      ),
      w(
        'zh-nianqing',
        '年轻',
        'niánqīng',
        'joven',
        '她年轻的时候是老师。',
        'De joven era profesora.',
        ['adjectives'],
        {
          acceptedTranslations: ['jóvenes'],
        },
      ),
      w(
        'zh-lao',
        '老',
        'lǎo',
        'mayor (viejo)',
        '我奶奶老了。',
        'Mi abuela ya es grande.',
        ['adjectives'],
        {
          acceptedTranslations: ['mayor', 'viejo', 'anciano'],
        },
      ),
      w(
        'zh-deshihou',
        '的时候',
        'de shíhou',
        'cuando',
        '我小的时候很喜欢唱歌。',
        'De chico me gustaba mucho cantar.',
        ['grammar'],
        {
          acceptedTranslations: ['cuando…', 'en la época en que'],
        },
      ),
      w(
        'zh-yibian',
        '一边',
        'yìbiān',
        'mientras (a la vez)',
        '我一边吃饭一边看电视。',
        'Como mientras miro la tele.',
        ['grammar'],
        {
          acceptedTranslations: ['mientras', 'al mismo tiempo'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '以前和现在',
        objective: 'Contar cómo era antes y qué cambió.',
        intro: {
          explanation:
            '以前 es «antes» y contrasta con 现在: 以前我不喝咖啡，现在喝了. 了 al final marca el cambio y 不…了 es «ya no»: 我不吃肉了. 变 es cambiar, volverse otra cosa; 习惯 es la costumbre y también acostumbrarse.',
          examples: [
            { target: '以前我不喝咖啡，现在喝了。', base: 'Antes no tomaba café; ahora sí.' },
            { target: '我不吃肉了。', base: 'Ya no como carne.' },
          ],
        },
        takeaways: ['Contrastás 以前 y 现在.', 'Decís «ya no» con 不…了.'],
        exercises: [
          ex.translationChoice(
            '以前',
            'antes',
            ['más adelante', 'ahora', 'hace un rato'],
            ['zh-yiqian'],
            { id: 'zh.ex.fbf1xsyfq3qut3' },
          ),
          ex.translationChoice(
            '习惯',
            'costumbre (acostumbrarse)',
            ['regla', 'fiesta', 'cambio de casa'],
            ['zh-xiguan'],
            {
              id: 'zh.ex.zyxzd7yq6sy3xs',
            },
          ),
          ex.listenChoice(
            '以前我不喝咖啡，现在喝了。',
            ['以前我喝咖啡，现在不喝了。', '以前我不喝茶，现在喝了。', '现在我不喝咖啡了。'],
            ['zh-yiqian'],
            { id: 'zh.ex.3qg7vueg72ct0o' },
          ),
          ex.fillBlank(
            '我现在不吃肉___。',
            'Ya no como carne.',
            '了',
            ['吗', '过', '的'],
            ['zh-le'],
            {
              id: 'zh.ex.gcooa9j8ihacpz',
              explanation: '不…了 es «ya no»: antes sí, ahora no.',
            },
          ),
          ex.fillBlank(
            '我还不___早起床。',
            'Todavía no me acostumbro a levantarme temprano.',
            '习惯',
            ['以前', '变', '可以'],
            ['zh-xiguan'],
            {
              id: 'zh.ex.h3w8cm673gennx',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '天气___了，很冷。',
            'El clima cambió: hace mucho frío.',
            '变',
            ['习惯', '以前', '开'],
            ['zh-bian'],
            {
              id: 'zh.ex.6402hp2k6i7i30',
              skill: 'vocabulary',
            },
          ),
          tone('习惯', 'xíguàn', ['xīguàn', 'xǐguǎn', 'xìguàn'], ['zh-xiguan'], {
            id: 'zh.ex.u5vv4d3noqj8mo',
          }),
          reply(
            '你以前喝咖啡吗？',
            '¿Antes tomabas café? (Respondé que antes no, pero ahora sí.)',
            'yǐqián bù hē, xiànzài hē le',
            '以前不喝，现在喝了',
            ['zh-yiqian'],
            {
              id: 'zh.ex.zhsw4tw319icbv',
              accepted: [
                'yǐqián bù hē',
                '以前不喝',
                'yǐqián bù hē kāfēi, xiànzài hē le',
                '以前不喝咖啡，现在喝了',
              ],
            },
          ),
          write('Ya no como carne.', 'wǒ bù chī ròu le', '我不吃肉了', ['zh-le'], {
            id: 'zh.ex.jdbom9v705aw3a',
            accepted: ['wǒ xiànzài bù chī ròu le', '我现在不吃肉了'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '越来越',
        objective: 'Decir qué cambia cada vez más y qué empezaste.',
        intro: {
          explanation:
            '越来越 + adjetivo es «cada vez más…»: 天气越来越冷. 开始 + verbo es «empezar a»: 我开始学游泳了. 以后 es «más adelante, en el futuro»: 以后我想去中国.',
          examples: [
            { target: '我的中文越来越好。', base: 'Mi chino está cada vez mejor.' },
            {
              target: '我上个星期开始学游泳。',
              base: 'La semana pasada empecé a aprender a nadar.',
            },
          ],
        },
        takeaways: ['Decís «cada vez más» con 越来越.', 'Contás qué empezaste con 开始.'],
        exercises: [
          ex.translationChoice(
            '越来越',
            'cada vez más',
            ['el más', 'aún más', 'tan'],
            ['zh-yuelaiyue'],
            { id: 'zh.ex.ox8umee320aaze' },
          ),
          ex.translationChoice(
            '开始',
            'empezar',
            ['terminar', 'volverse (cambiar)', 'volver'],
            ['zh-kaishi'],
            { id: 'zh.ex.hxxjsbp3ephl05' },
          ),
          ex.listenChoice(
            '天气越来越冷了。',
            ['天气越来越热了。', '天气非常冷。', '天气越来越好了。'],
            ['zh-yuelaiyue'],
            { id: 'zh.ex.wuvo16xpcy4ald' },
          ),
          ex.fillBlank(
            '你的中文___好了！',
            '¡Tu chino está cada vez mejor!',
            '越来越',
            ['最', '那么', '一样'],
            ['zh-yuelaiyue'],
            {
              id: 'zh.ex.lfxejshsc1fr2x',
            },
          ),
          ex.fillBlank(
            '我上个星期___学游泳。',
            'La semana pasada empecé a aprender a nadar.',
            '开始',
            ['以后', '习惯', '完'],
            ['zh-kaishi'],
            {
              id: 'zh.ex.xb38aok9339ugn',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '___我想去中国工作。',
            'Más adelante quiero ir a trabajar a China.',
            '以后',
            ['以前', '刚才', '已经'],
            ['zh-yihou'],
            {
              id: 'zh.ex.elpg7lxrfc4p4u',
              skill: 'vocabulary',
            },
          ),
          tone('开始', 'kāishǐ', ['kǎishǐ', 'kāishí', 'kàishì'], ['zh-kaishi'], {
            id: 'zh.ex.63dnx5crwc15lc',
          }),
          reply(
            '你的中文怎么样？',
            '¿Cómo va tu chino? (Respondé que cada vez mejor.)',
            'yuèláiyuè hǎo',
            '越来越好',
            ['zh-yuelaiyue'],
            {
              id: 'zh.ex.sfgcw9yifs0r4z',
              accepted: [
                'wǒ de Zhōngwén yuèláiyuè hǎo',
                '我的中文越来越好',
                'yuèláiyuè hǎo le',
                '越来越好了',
              ],
            },
          ),
          write('Empecé a trabajar.', 'wǒ kāishǐ gōngzuò le', '我开始工作了', ['zh-kaishi'], {
            id: 'zh.ex.bt3imzru12zvl1',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '男朋友和女朋友',
        objective: 'Hablar de parejas, casamientos y vecinos.',
        intro: {
          explanation:
            '男朋友 es el novio y 女朋友, la novia (男 hombre, 女 mujer). 结婚 es casarse; no lleva objeto: se dice 跟…结婚 (casarse con…). 邻居 es el vecino.',
          examples: [
            { target: '我姐姐有男朋友。', base: 'Mi hermana tiene novio.' },
            { target: '她下个月跟男朋友结婚。', base: 'El mes que viene se casa con su novio.' },
          ],
        },
        takeaways: [
          'Nombrás novio, novia y vecinos.',
          'Decís con quién se casa alguien con 跟…结婚.',
        ],
        exercises: [
          ex.translationChoice(
            '邻居',
            'vecino',
            ['compañero/a de trabajo', 'novio', 'amigo/a'],
            ['zh-linju'],
            { id: 'zh.ex.wl1dfi3skfcqom' },
          ),
          ex.translationChoice(
            '结婚',
            'casarse',
            ['conocer (a alguien)', 'divorciarse', 'enamorarse'],
            ['zh-jiehun'],
            { id: 'zh.ex.0fiqvk4v0dzcwe' },
          ),
          ex.listenChoice(
            '她下个月跟男朋友结婚。',
            ['她上个月跟男朋友结婚了。', '她下个月跟男朋友去旅游。', '她下个星期跟男朋友结婚。'],
            ['zh-jiehun', 'zh-nanpengyou'],
            { id: 'zh.ex.qcgr0ihckpaept' },
          ),
          ex.fillBlank(
            '我哥哥的___很漂亮。',
            'La novia de mi hermano es muy linda.',
            '女朋友',
            ['男朋友', '邻居', '同事'],
            ['zh-nvpengyou'],
            {
              id: 'zh.ex.htigbmg3rf7ann',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '他们___结婚了。',
            'Se casaron el año pasado.',
            '去年',
            ['明年', '以后', '下次'],
            ['zh-jiehun'],
            {
              id: 'zh.ex.4pnalt11cwephw',
              explanation: 'Con 了 la acción ya pasó: 去年, no 明年 ni 以后.',
            },
          ),
          tone('邻居', 'línjū', ['línjú', 'lǐnjǔ', 'lìnjù'], ['zh-linju'], {
            id: 'zh.ex.abwhc7b2yo9xej',
          }),
          ex.matchPairs(
            [
              ['男朋友', 'novio'],
              ['女朋友', 'novia'],
              ['结婚', 'casarse'],
              ['邻居', 'vecino'],
            ],
            ['zh-nanpengyou', 'zh-nvpengyou', 'zh-jiehun', 'zh-linju'],
            { id: 'zh.ex.73kmwfxkrt5r0c' },
          ),
          reply(
            '你姐姐结婚了吗？',
            '¿Tu hermana se casó? (Respondé que todavía no.)',
            'hái méi jiéhūn',
            '还没结婚',
            ['zh-jiehun'],
            {
              id: 'zh.ex.7iv1tpcsniqxo5',
              accepted: [
                'hái méi ne',
                '还没呢',
                'tā hái méi jiéhūn',
                '她还没结婚',
                'hái méi',
                '还没',
              ],
            },
          ),
          write('Mi vecino es médico.', 'wǒ de línjū shì yīshēng', '我的邻居是医生', ['zh-linju'], {
            id: 'zh.ex.24ijptc5oxm9tg',
            accepted: ['wǒ línjū shì yīshēng', '我邻居是医生'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '小的时候',
        objective: 'Contar cómo eras de chico y hablar de la edad.',
        intro: {
          explanation:
            '…的时候 es «cuando…» y va al principio: 我小的时候 (cuando era chico), 吃饭的时候 (cuando como). 年轻 es joven y 老, mayor o viejo (personas): 我奶奶老了. 孩子 es el hijo o el chico.',
          examples: [
            { target: '我小的时候很喜欢唱歌。', base: 'De chico me gustaba mucho cantar.' },
            { target: '我奶奶年轻的时候是老师。', base: 'Mi abuela, de joven, era profesora.' },
          ],
        },
        takeaways: ['Decís «cuando…» con …的时候.', 'Hablás de jóvenes, mayores e hijos.'],
        exercises: [
          ex.translationChoice(
            '年轻',
            'joven',
            ['mayor (viejo)', 'chico', 'alto'],
            ['zh-nianqing'],
            { id: 'zh.ex.fwaipodxth8hsn' },
          ),
          ex.translationChoice(
            '孩子',
            'hijo/a (chico)',
            ['novio', 'vecino', 'compañero/a de clase'],
            ['zh-haizi'],
            { id: 'zh.ex.9pygcx9svqryly' },
          ),
          ex.listenChoice(
            '我小的时候很喜欢唱歌。',
            ['我小的时候很喜欢跳舞。', '我现在很喜欢唱歌。', '我小的时候不喜欢唱歌。'],
            ['zh-deshihou'],
            { id: 'zh.ex.bw3cv0tdrbazv7' },
          ),
          ex.fillBlank(
            '吃饭___，别看手机。',
            'Cuando comés, no mires el celular.',
            '的时候',
            ['一会儿', '马上', '刚才'],
            ['zh-deshihou'],
            {
              id: 'zh.ex.t902mqt8txzbu6',
              explanation: '…的时候 es «cuando…» y va al principio de la oración.',
            },
          ),
          ex.fillBlank(
            '我奶奶八十岁了，她很___了。',
            'Mi abuela tiene ochenta años: ya es grande.',
            '老',
            ['年轻', '小', '高'],
            ['zh-lao'],
            {
              id: 'zh.ex.w4qut34jh3uun8',
              skill: 'vocabulary',
            },
          ),
          tone('年轻', 'niánqīng', ['niānqīng', 'niánqíng', 'niǎnqìng'], ['zh-nianqing'], {
            id: 'zh.ex.yu990v3oygar9c',
          }),
          question(
            'zh.ex.p2noz7smoeomh6',
            BODA,
            '¿Quién se casa el mes que viene?',
            'La hermana mayor de Wang Ming',
            ['Wang Ming', 'La vecina de Wang Ming', 'El hermano de Wang Ming'],
            ['zh-jiehun'],
            'Wang Ming escribe: «我姐姐下个月结婚！».',
          ),
          question(
            'zh.ex.eip5usrv4rs4qk',
            BODA,
            '¿Desde cuándo se conocen los novios?',
            'Desde chicos: él es vecino de la familia',
            [
              'Desde el año pasado: son compañeros de trabajo',
              'Desde la universidad',
              'Se conocieron por internet',
            ],
            ['zh-linju', 'zh-deshihou'],
            'Wang Ming escribe: «她的男朋友是我们的邻居。他们是小的时候认识的».',
          ),
          reply(
            '你小的时候喜欢做什么？',
            '¿Qué te gustaba hacer de chico? (Respondé que te gustaba nadar.)',
            'wǒ xǐhuan yóuyǒng',
            '我喜欢游泳',
            ['zh-deshihou'],
            {
              id: 'zh.ex.apf1ulq7tviryn',
              accepted: [
                'xǐhuan yóuyǒng',
                '喜欢游泳',
                'wǒ xiǎo de shíhou xǐhuan yóuyǒng',
                '我小的时候喜欢游泳',
                'yóuyǒng',
                '游泳',
              ],
            },
          ),
          write(
            'De chico era muy alto.',
            'wǒ xiǎo de shíhou hěn gāo',
            '我小的时候很高',
            ['zh-deshihou'],
            { id: 'zh.ex.5ie3vcfamqc8ht' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '一边…一边',
        objective: 'Decir qué hacés a la vez y entender relatos de cambios.',
        intro: {
          explanation:
            '一边 A 一边 B es hacer dos cosas a la vez: 我一边吃饭一边看电视 (como mientras miro la tele).',
          examples: [
            { target: '她一边听音乐一边做饭。', base: 'Cocina mientras escucha música.' },
            { target: '别一边走路一边看手机！', base: '¡No mires el celular mientras caminás!' },
          ],
        },
        takeaways: [
          'Contás dos acciones a la vez con 一边…一边.',
          'Entendés relatos de cambios y de familia.',
        ],
        exercises: [
          ex.translationChoice(
            '一边',
            'mientras (a la vez)',
            ['cuando', 'antes', 'más adelante'],
            ['zh-yibian'],
            { id: 'zh.ex.rf7rh6wk0re9du' },
          ),
          ex.listenChoice(
            '她一边听音乐一边做饭。',
            ['她一边听音乐一边跑步。', '她一边看电视一边做饭。', '她听音乐，不做饭。'],
            ['zh-yibian'],
            {
              id: 'zh.ex.szla6dhxns31ev',
            },
          ),
          ex.fillBlank(
            '我一边吃饭___看电视。',
            'Como mientras miro la tele.',
            '一边',
            ['一样', '一起', '一直'],
            ['zh-yibian'],
            {
              id: 'zh.ex.pztzoaoly0f3r2',
            },
          ),
          question(
            'zh.ex.bgpv1h1o6c34oi',
            CAMBIO,
            '¿Qué cambió en Li Hua?',
            'Antes no tomaba café y ahora toma todos los días',
            ['Antes tomaba café y ahora no', 'Ahora toma té', 'Nada: siempre tomó café'],
            ['zh-yiqian', 'zh-bian'],
            'Li Hua dice: «以前不喝，现在每天都喝了».',
          ),
          question(
            'zh.ex.lgzbr0w6saov1u',
            CAMBIO,
            '¿Por qué, según Li Hua?',
            'Porque tiene cada vez más trabajo',
            ['Porque le gusta el sabor', 'Porque su novia toma café', 'Porque duerme mucho'],
            ['zh-yuelaiyue'],
            'Li Hua dice: «工作越来越忙了».',
          ),
          question(
            'zh.ex.88qyq6vd6q68tm',
            ABUELA,
            '¿Qué hacía la abuela de Wang Ming de joven?',
            'Era profesora',
            ['Era médica', 'Era cocinera', 'Era enfermera'],
            ['zh-nianqing', 'zh-deshihou'],
            'Wang Ming dice: «她年轻的时候是老师».',
          ),
          question(
            'zh.ex.rm7x6z6ufyq071',
            ABUELA,
            '¿Cuántos años tiene la abuela?',
            'Ochenta',
            ['Dieciocho', 'Sesenta', 'Noventa'],
            ['zh-lao'],
            'Wang Ming dice: «八十岁了».',
          ),
          question(
            'zh.ex.9n5uasyj9513o7',
            ABUELA,
            '¿Qué hace ahora la abuela?',
            'Ya no trabaja; cocina mientras escucha música',
            ['Sigue dando clases', 'Trabaja y cocina', 'Mira la tele todo el día'],
            ['zh-yibian'],
            'Wang Ming dice: «不工作了。她每天一边听音乐一边做饭».',
          ),
          reply(
            '你吃饭的时候看电视吗？',
            '¿Mirás la tele cuando comés? (Respondé que sí: comés mientras mirás la tele.)',
            'wǒ yìbiān chīfàn yìbiān kàn diànshì',
            '我一边吃饭一边看电视',
            ['zh-yibian'],
            {
              id: 'zh.ex.fpa0zeqhgo3h1d',
              accepted: ['kàn', '看', 'yìbiān chīfàn yìbiān kàn diànshì', '一边吃饭一边看电视'],
            },
          ),
          write(
            'No mires el celular mientras caminás.',
            'bié yìbiān zǒulù yìbiān kàn shǒujī',
            '别一边走路一边看手机',
            ['zh-yibian', 'zh-bie'],
            {
              id: 'zh.ex.ihdxr6hm2wxcv5',
            },
          ),
        ],
      },
    ],
  },
};

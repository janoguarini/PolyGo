import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write, ZH_A1_RATE } from '../helpers';

/**
 * Chino A1 U16 «Direcciones, planes y lo que hice» (docs/ZH_A1_A2.md): ubicar lugares (左边, 旁边,
 * 前面), dar indicaciones (一直走, 往左走), pedir permiso con 可以, proponer con 一起…吧 y el primer
 * pasado: 了 después del verbo y 没 para negarlo.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const DIRECCIONES = dialogue(
  'zh.stim.a1-u16-yinhang',
  'Anna le pregunta a Li Hua cómo llegar al banco.',
  [
    ['安娜', '请问，银行在哪儿？'],
    ['李华', '一直走，然后往左走。银行在公园旁边。'],
    ['安娜', '远吗？'],
    ['李华', '不远，很近。'],
  ],
  ZH_A1_RATE,
);

const PLAN = reading(
  'zh.stim.a1-u16-gongyuan',
  'message',
  'Zhang Li le propone un plan a Wang Ming.',
  ['王明，明天是星期六。我们一起去公园吧！', '中午我们可以在公园旁边的饭馆吃饭。', '你可以来吗？'],
  { from: '张丽', to: '王明' },
);

const AYER = dialogue(
  'zh.stim.a1-u16-zuotian',
  'Zhang Li le pregunta a Li Hua qué hizo ayer.',
  [
    ['张丽', '你昨天去哪儿了？'],
    ['李华', '我去了超市，买了一件衣服。'],
    ['张丽', '你去银行了吗？'],
    ['李华', '没去，太忙了。'],
  ],
  ZH_A1_RATE,
);

export const ZH_A1_U16: ZhUnitDef = {
  names: ['安娜', '李华', '张丽'],
  support: ['请问', '左', '右'],
  unit: {
    position: 16,
    title: 'Direcciones, planes y lo que hice',
    titleEn: '方向 Directions and plans',
    description:
      'Ubicar lugares, dar indicaciones, pedir permiso, proponer planes y contar lo que hiciste.',
    emoji: '🧭',
    objective:
      'Puedes decir dónde está un lugar y cómo llegar, pedir permiso, proponer un plan y contar lo que hiciste (o no) ayer.',
    grammar: {
      title: 'Lugar + 旁边 · 往 · 可以 · 吧 · 了 y 没',
      explanation:
        'Para ubicar: cosa + 在 + lugar + 旁边 / 左边 / 前面. Para indicar: 一直走, 往左走. 可以 pide o da permiso. 吧 al final propone: 我们走吧. 了 después del verbo cuenta una acción terminada (我买了…) y 没 la niega, sin 了 (我没去).',
      examples: [
        { target: '银行在公园旁边。', base: 'El banco está al lado del parque.' },
        { target: '我们一起去吧！', base: '¡Vamos juntos!' },
        { target: '我昨天没去银行。', base: 'Ayer no fui al banco.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U16). Sin revisión nativa: revisar 往左走 frente a 往左拐, 了 con objeto (去了超市) y 没 sin 了.',
    },
    words: [
      w(
        'zh-zuobian',
        '左边',
        'zuǒbian',
        'izquierda',
        '超市在银行左边。',
        'El súper está a la izquierda del banco.',
        ['places', 'directions'],
        {
          acceptedTranslations: ['a la izquierda'],
        },
      ),
      w(
        'zh-youbian',
        '右边',
        'yòubian',
        'derecha',
        '公园在右边。',
        'El parque está a la derecha.',
        ['places', 'directions'],
        {
          acceptedTranslations: ['a la derecha'],
        },
      ),
      w(
        'zh-qianmian',
        '前面',
        'qiánmiàn',
        'adelante',
        '火车站在前面。',
        'La estación está adelante.',
        ['directions'],
        {
          acceptedTranslations: ['delante', 'enfrente'],
        },
      ),
      w(
        'zh-houmian',
        '后面',
        'hòumiàn',
        'atrás',
        '公园在学校后面。',
        'El parque está detrás de la escuela.',
        ['directions'],
        {
          acceptedTranslations: ['detrás'],
        },
      ),
      w(
        'zh-pangbian',
        '旁边',
        'pángbiān',
        'al lado',
        '银行在公园旁边。',
        'El banco está al lado del parque.',
        ['directions'],
        {
          acceptedTranslations: ['al lado de'],
        },
      ),
      w(
        'zh-yizhi',
        '一直',
        'yìzhí',
        'derecho (sin doblar)',
        '一直走。',
        'Sigue derecho.',
        ['directions'],
        {
          acceptedTranslations: ['derecho', 'todo recto'],
        },
      ),
      w('zh-wang', '往', 'wǎng', 'hacia', '往右走。', 'Ve hacia la derecha.', ['directions'], {
        acceptedTranslations: ['para'],
      }),
      w('zh-zou', '走', 'zǒu', 'andar (irse)', '我们走吧。', 'Vamos.', ['verbs'], {
        acceptedTranslations: ['irse', 'andar'],
      }),
      w(
        'zh-yinhang',
        '银行',
        'yínháng',
        'banco',
        '银行在公园旁边。',
        'El banco está al lado del parque.',
        ['places'],
        {
          emoji: '🏦',
        },
      ),
      w(
        'zh-gongyuan',
        '公园',
        'gōngyuán',
        'parque',
        '我们一起去公园吧！',
        '¡Vamos juntos al parque!',
        ['places'],
        {
          emoji: '🏞️',
        },
      ),
      w(
        'zh-huochezhan',
        '火车站',
        'huǒchēzhàn',
        'estación de tren',
        '火车站在前面。',
        'La estación de tren está adelante.',
        ['places', 'transport'],
        {
          acceptedTranslations: ['estación'],
        },
      ),
      w(
        'zh-feiji',
        '飞机',
        'fēijī',
        'avión',
        '我坐飞机去北京。',
        'Voy a Pekín en avión.',
        ['transport'],
        {
          emoji: '✈️',
        },
      ),
      w(
        'zh-keyi',
        '可以',
        'kěyǐ',
        'poder (tener permiso)',
        '我可以坐这儿吗？',
        '¿Me puedo sentar aquí?',
        ['verbs'],
        {
          acceptedTranslations: ['se puede', 'poder'],
        },
      ),
      w(
        'zh-ba-propuesta',
        '吧',
        'ba',
        'partícula de propuesta (吧)',
        '我们走吧。',
        'Vamos.',
        ['particle', 'grammar'],
        {
          acceptedTranslations: ['partícula 吧'],
        },
      ),
      w('zh-yiqi', '一起', 'yìqǐ', 'juntos', '我们一起去吧！', '¡Vamos juntos!', ['basics'], {
        acceptedTranslations: ['juntas'],
      }),
      w(
        'zh-mei-pasado',
        '没',
        'méi',
        'no (en pasado)',
        '我昨天没去银行。',
        'Ayer no fui al banco.',
        ['grammar'],
        {
          acceptedTranslations: ['no'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '在公园旁边',
        objective: 'Decir dónde está un lugar.',
        intro: {
          explanation:
            '左边 (izquierda), 右边 (derecha), 旁边 (al lado). Para ubicar algo: cosa + 在 + lugar + 旁边 / 左边: 银行在公园旁边 («el banco está al lado del parque»).',
          examples: [
            { target: '银行在公园旁边。', base: 'El banco está al lado del parque.' },
            { target: '超市在银行左边。', base: 'El súper está a la izquierda del banco.' },
          ],
        },
        takeaways: ['Ubicas lugares con 左边, 右边 y 旁边.', 'Nombras el banco y el parque.'],
        exercises: [
          ex.translationChoice(
            '左边',
            'izquierda',
            ['derecha', 'al lado', 'atrás'],
            ['zh-zuobian'],
            { id: 'zh.ex.y3kfl8yelzxzhr' },
          ),
          ex.translationChoice(
            '银行',
            'banco',
            ['parque', 'estación de tren', 'empresa'],
            ['zh-yinhang'],
            { id: 'zh.ex.arzw6m36nxtewb' },
          ),
          ex.imageChoice('🏞️', '公园', ['银行', '医院', '超市'], ['zh-gongyuan'], {
            id: 'zh.ex.gzrck4yh1rmgau',
          }),
          ex.listenChoice(
            '银行在公园旁边。',
            ['银行在公园左边。', '超市在公园旁边。', '银行在学校旁边。'],
            ['zh-yinhang', 'zh-gongyuan', 'zh-pangbian'],
            { id: 'zh.ex.fdx3ai6xewrm56' },
          ),
          ex.fillBlank(
            '超市在银行___。',
            'El súper está a la derecha del banco.',
            '右边',
            ['左边', '旁边', '里'],
            ['zh-youbian'],
            {
              id: 'zh.ex.z3yg4g9h2m741n',
              skill: 'vocabulary',
            },
          ),
          tone('银行', 'yínháng', ['yīnhāng', 'yǐnhǎng', 'yìnhàng'], ['zh-yinhang'], {
            id: 'zh.ex.uunl1r56uvslfg',
          }),
          ex.matchPairs(
            [
              ['左边', 'izquierda'],
              ['右边', 'derecha'],
              ['旁边', 'al lado'],
              ['公园', 'parque'],
            ],
            ['zh-zuobian', 'zh-youbian', 'zh-pangbian', 'zh-gongyuan'],
            { id: 'zh.ex.iy1fo17w4rqfa0' },
          ),
          reply(
            '医院在哪儿？',
            '¿Dónde está el hospital? (Responde que al lado del banco.)',
            'yīyuàn zài yínháng pángbiān',
            '医院在银行旁边',
            ['zh-yinhang', 'zh-pangbian'],
            {
              id: 'zh.ex.l2pcdl1llu86kg',
              accepted: [
                'zài yínháng pángbiān',
                '在银行旁边',
                'yínháng pángbiān',
                '银行旁边',
                'zài yínháng de pángbiān',
                '在银行的旁边',
              ],
            },
          ),
          write(
            'El banco está a la izquierda del parque.',
            'yínháng zài gōngyuán zuǒbian',
            '银行在公园左边',
            ['zh-yinhang', 'zh-zuobian'],
            {
              id: 'zh.ex.nxexr8wrx1b590',
              accepted: ['yínháng zài gōngyuán de zuǒbian', '银行在公园的左边'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '一直走',
        objective: 'Dar y entender indicaciones.',
        intro: {
          explanation:
            '一直走 es «sigue derecho». 往 + dirección + 走 es «ve hacia»: 往左走 (dobla a la izquierda). 前面 es adelante y 后面, atrás: 火车站在前面.',
          examples: [
            { target: '一直走，然后往右走。', base: 'Sigue derecho y después dobla a la derecha.' },
            { target: '火车站在前面。', base: 'La estación de tren está adelante.' },
          ],
        },
        takeaways: ['Indicas el camino con 一直走 y 往左 / 往右走.', 'Usas 前面 y 后面.'],
        exercises: [
          ex.translationChoice(
            '一直',
            'derecho (sin doblar)',
            ['izquierda', 'atrás', 'al lado'],
            ['zh-yizhi'],
            { id: 'zh.ex.mvdgiswc5ea4ep' },
          ),
          ex.translationChoice(
            '火车站',
            'estación de tren',
            ['banco', 'parque', 'supermercado'],
            ['zh-huochezhan'],
            {
              id: 'zh.ex.4inpnho8dub74d',
            },
          ),
          ex.listenChoice(
            '一直走，然后往左走。',
            ['一直走，然后往右走。', '往左走，然后一直走。', '往右走，然后一直走。'],
            ['zh-yizhi', 'zh-wang', 'zh-zou'],
            { id: 'zh.ex.6zj362ivozflih' },
          ),
          ex.fillBlank(
            '火车站在银行___，不在后面。',
            'La estación está delante del banco, no atrás.',
            '前面',
            ['后面', '左边', '里'],
            ['zh-qianmian', 'zh-houmian', 'zh-huochezhan'],
            { id: 'zh.ex.j84cm81awiu7h1', skill: 'vocabulary' },
          ),
          ex.fillBlank('___右走。', 'Ve hacia la derecha.', '往', ['在', '是', '有'], ['zh-wang'], {
            id: 'zh.ex.d3w76zhcdmurwh',
            explanation: '往 + dirección + 走: «ve hacia…».',
          }),
          tone('一直', 'yìzhí', ['yìzhī', 'yìzhǐ', 'yìzhì'], ['zh-yizhi'], {
            id: 'zh.ex.3dduicxcdv7rb1',
          }),
          question(
            'zh.ex.oa3tozmchqsjb3',
            DIRECCIONES,
            '¿Cómo se llega al banco?',
            'Derecho y después a la izquierda',
            ['Derecho y después a la derecha', 'A la izquierda y después derecho', 'En taxi'],
            ['zh-yizhi', 'zh-wang'],
            'Li Hua dice: «一直走，然后往左走».',
          ),
          question(
            'zh.ex.xfvh9iw41krcre',
            DIRECCIONES,
            '¿Dónde está el banco y queda lejos?',
            'Al lado del parque, y queda cerca',
            [
              'Al lado del parque, y queda lejos',
              'Detrás de la escuela, y queda cerca',
              'Adelante del hospital, y queda lejos',
            ],
            ['zh-pangbian', 'zh-gongyuan'],
            'Li Hua dice: «银行在公园旁边» y «不远，很近».',
          ),
          reply(
            '火车站远吗？',
            '¿La estación queda lejos? (Responde que no, que está adelante.)',
            'bù yuǎn, zài qiánmiàn',
            '不远，在前面',
            ['zh-qianmian', 'zh-huochezhan'],
            {
              id: 'zh.ex.8ltjgbcm5e8czb',
              accepted: ['zài qiánmiàn', '在前面', 'huǒchēzhàn zài qiánmiàn', '火车站在前面'],
            },
          ),
          write('Sigue derecho.', 'yìzhí zǒu', '一直走', ['zh-yizhi', 'zh-zou'], {
            id: 'zh.ex.9pdz1i9feh9t1f',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '我可以…吗？',
        objective: 'Pedir y dar permiso; viajar en avión.',
        intro: {
          explanation:
            '可以 es «poder» en el sentido de tener permiso: 我可以坐这儿吗？ (¿me puedo sentar aquí?). 不可以 es «no se puede». 能 (U11) es poder porque hay tiempo o capacidad.',
          examples: [
            { target: '我可以坐这儿吗？——可以。', base: '¿Me puedo sentar aquí? — Sí.' },
            { target: '这儿不可以吃东西。', base: 'Aquí no se puede comer.' },
          ],
        },
        takeaways: ['Pides permiso con 我可以…吗？', 'Dices que algo no se puede con 不可以.'],
        exercises: [
          ex.translationChoice(
            '可以',
            'poder (tener permiso)',
            ['saber (hacer algo)', 'tener ganas de', 'hacia'],
            ['zh-keyi'],
            {
              id: 'zh.ex.qrj1dvgccovorh',
            },
          ),
          ex.translationChoice('飞机', 'avión', ['tren', 'taxi', 'metro'], ['zh-feiji'], {
            id: 'zh.ex.oj7tuhtf23zpbf',
          }),
          ex.listenChoice(
            '我可以坐这儿吗？',
            ['我可以去那儿吗？', '我能坐这儿吗？', '你可以坐这儿。'],
            ['zh-keyi'],
            {
              id: 'zh.ex.6b9q1h0e2x53hf',
            },
          ),
          ex.fillBlank(
            '这儿不___吃东西。',
            'Aquí no se puede comer.',
            '可以',
            ['会', '想', '喜欢'],
            ['zh-keyi'],
            {
              id: 'zh.ex.orxjts11omxpht',
              explanation: 'Un permiso o una prohibición se dice con 可以 / 不可以.',
            },
          ),
          ex.fillBlank(
            '我坐___去北京。',
            'Voy a Pekín en avión.',
            '飞机',
            ['火车站', '公园', '银行'],
            ['zh-feiji'],
            {
              id: 'zh.ex.g36cyelnrq76es',
              skill: 'vocabulary',
            },
          ),
          tone('飞机', 'fēijī', ['fèijī', 'féijí', 'fěijǐ'], ['zh-feiji'], {
            id: 'zh.ex.fr9w06ptpmet9g',
          }),
          ex.orderWords('我 可以 坐 这儿 吗？', '¿Me puedo sentar aquí?', ['zh-keyi'], {
            id: 'zh.ex.yfh4qqsvce6y7i',
          }),
          ex.matchPairs(
            [
              ['可以', 'poder (tener permiso)'],
              ['飞机', 'avión'],
              ['火车站', 'estación de tren'],
              ['银行', 'banco'],
            ],
            ['zh-keyi', 'zh-feiji', 'zh-huochezhan', 'zh-yinhang'],
            { id: 'zh.ex.ckzlf0ykw5daod' },
          ),
          reply(
            '我可以看你的书吗？',
            '¿Puedo mirar tu libro? (Responde que sí.)',
            'kěyǐ',
            '可以',
            ['zh-keyi'],
            {
              id: 'zh.ex.b59p1hpcgvfl5x',
              accepted: ['kěyǐ, nǐ kěyǐ kàn', '可以，你可以看', 'nǐ kěyǐ kàn', '你可以看'],
            },
          ),
          write('¿Puedo ir?', 'wǒ kěyǐ qù ma', '我可以去吗', ['zh-keyi'], {
            id: 'zh.ex.liyigfnrvs7lkd',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '一起…吧！',
        objective: 'Proponer un plan.',
        intro: {
          explanation:
            '吧 al final convierte la frase en una propuesta: 我们走吧 (vamos). 一起 es «juntos» y va antes del verbo: 我们一起去吧！ Con 吗 sería una pregunta; con 吧, una invitación.',
          examples: [
            { target: '我们一起去公园吧！', base: '¡Vamos juntos al parque!' },
            { target: '我们走吧。', base: 'Vamos.' },
          ],
        },
        takeaways: ['Propones planes con 吧.', 'Dices «juntos» con 一起, antes del verbo.'],
        exercises: [
          ex.translationChoice('一起', 'juntos', ['solos', 'todos (los dos)', 'con'], ['zh-yiqi'], {
            id: 'zh.ex.rxn6u1nnpk7qa1',
          }),
          ex.listenChoice(
            '我们一起去吧！',
            ['我们一起去吗？', '我们都去吧！', '你们一起去吧！'],
            ['zh-yiqi', 'zh-ba-propuesta'],
            {
              id: 'zh.ex.la6w9wyk11zhz8',
            },
          ),
          ex.fillBlank(
            '我们一起吃饭___！',
            '¡Comamos juntos!',
            '吧',
            ['吗', '了', '的'],
            ['zh-ba-propuesta'],
            {
              id: 'zh.ex.egov8xnk6cq2p1',
              explanation: '吧 al final es una propuesta; con 吗 sería una pregunta.',
            },
          ),
          ex.fillBlank(
            '我们___去超市吧。',
            'Vamos juntos al súper.',
            '一起',
            ['一样', '一点儿', '比'],
            ['zh-yiqi'],
            {
              id: 'zh.ex.hbmp3nyblu5asz',
              skill: 'vocabulary',
            },
          ),
          ex.orderWords(
            '我们 一起 去 公园 吧。',
            'Vamos juntos al parque.',
            ['zh-yiqi', 'zh-ba-propuesta', 'zh-gongyuan'],
            {
              id: 'zh.ex.kba43n5do08mqg',
            },
          ),
          tone('一起', 'yìqǐ', ['yīqī', 'yíqí', 'yìqì'], ['zh-yiqi'], {
            id: 'zh.ex.d403ed934lv309',
          }),
          question(
            'zh.ex.lyua6xtae31y99',
            PLAN,
            '¿Qué propone Zhang Li para mañana?',
            'Ir juntos al parque',
            ['Ir juntos al banco', 'Comer en su casa', 'Ir a la estación de tren'],
            ['zh-yiqi', 'zh-ba-propuesta'],
            'Zhang Li escribe: «我们一起去公园吧！».',
          ),
          question(
            'zh.ex.sq1a45c3dzcl81',
            PLAN,
            '¿Dónde pueden comer al mediodía?',
            'En un restaurante al lado del parque',
            ['En el parque', 'En la casa de Zhang Li', 'En un restaurante al lado del banco'],
            ['zh-keyi', 'zh-pangbian'],
            'Zhang Li escribe: «中午我们可以在公园旁边的饭馆吃饭».',
          ),
          reply(
            '明天我们一起去公园，好吗？',
            'Mañana vamos juntos al parque, ¿de acuerdo? (Responde que sí, que vayan juntos.)',
            'hǎo, wǒmen yìqǐ qù ba',
            '好，我们一起去吧',
            ['zh-yiqi', 'zh-ba-propuesta'],
            {
              id: 'zh.ex.3yznqdcgxg7xww',
              accepted: ['hǎo, yìqǐ qù ba', '好，一起去吧', 'hǎo', '好'],
            },
          ),
          write('Vamos.', 'wǒmen zǒu ba', '我们走吧', ['zh-ba-propuesta', 'zh-zou'], {
            id: 'zh.ex.yaq1wpl0c5g65q',
            accepted: ['zǒu ba', '走吧'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '我去了… / 我没去',
        objective: 'Contar lo que hiciste y lo que no hiciste.',
        intro: {
          explanation:
            '了 después del verbo cuenta una acción terminada: 我买了一件衣服 (compré una prenda). El pasado se niega con 没, sin 了: 我没去 (no fui). 不去 es «no voy» (presente o costumbre).',
          examples: [
            { target: '我昨天去了超市。', base: 'Ayer fui al súper.' },
            { target: '我没去银行。', base: 'No fui al banco.' },
          ],
        },
        takeaways: ['Cuentas algo que hiciste con verbo + 了.', 'Lo niegas con 没, sin 了.'],
        exercises: [
          ex.translationChoice(
            '没',
            'no (en pasado)',
            ['juntos', 'también', 'muy'],
            ['zh-mei-pasado'],
            { id: 'zh.ex.86t4mrvuo34kiz' },
          ),
          ex.listenChoice(
            '我昨天没去公园。',
            ['我昨天去了公园。', '我今天没去公园。', '我昨天没去银行。'],
            ['zh-mei-pasado'],
            { id: 'zh.ex.6yajt5ne7dtgib' },
          ),
          ex.fillBlank(
            '我昨天___去超市。',
            'Ayer no fui al súper.',
            '没',
            ['不', '了', '吧'],
            ['zh-mei-pasado'],
            {
              id: 'zh.ex.0drrq8cihnzlxc',
              explanation: 'El pasado se niega con 没: 没去. 不去 es «no voy».',
            },
          ),
          ex.fillBlank(
            '我买___一件衣服。',
            'Compré una prenda.',
            '了',
            ['吧', '吗', '没'],
            ['zh-le'],
            {
              id: 'zh.ex.y7xjply536aw8a',
              explanation: '了 después del verbo marca la acción terminada: 买了.',
            },
          ),
          ex.orderWords(
            '我 昨天 没 去 银行。',
            'Ayer no fui al banco.',
            ['zh-mei-pasado', 'zh-yinhang'],
            { id: 'zh.ex.keudsqnr1hao1h' },
          ),
          question(
            'zh.ex.4t3a59kjjeriuu',
            AYER,
            '¿Qué compró Li Hua ayer?',
            'Una prenda de ropa',
            ['Zapatos', 'Un libro', 'Nada'],
            ['zh-le'],
            'Li Hua dice: «我去了超市，买了一件衣服».',
          ),
          question(
            'zh.ex.5z52nmrg8t1m3o',
            AYER,
            '¿Fue Li Hua al banco?',
            'No, porque estaba muy ocupado',
            ['Sí, por la mañana', 'Sí, con Zhang Li', 'No, porque el banco queda lejos'],
            ['zh-mei-pasado', 'zh-yinhang'],
            'Li Hua dice: «没去，太忙了».',
          ),
          reply(
            '你昨天去公园了吗？',
            '¿Fuiste ayer al parque? (Responde que no fuiste.)',
            'méi qù',
            '没去',
            ['zh-mei-pasado'],
            {
              id: 'zh.ex.rgk8s6w87xaqw2',
              accepted: [
                'wǒ méi qù',
                '我没去',
                'wǒ zuótiān méi qù',
                '我昨天没去',
                'méiyǒu',
                '没有',
              ],
            },
          ),
          write(
            'Ayer fui al banco.',
            'wǒ zuótiān qù le yínháng',
            '我昨天去了银行',
            ['zh-le', 'zh-yinhang'],
            {
              id: 'zh.ex.iwaxq5zk5n7j9c',
              accepted: [
                'zuótiān wǒ qù le yínháng',
                '昨天我去了银行',
                'wǒ zuótiān qù yínháng le',
                '我昨天去银行了',
              ],
            },
          ),
        ],
      },
    ],
  },
};

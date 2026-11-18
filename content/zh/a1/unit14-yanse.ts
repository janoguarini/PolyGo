import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write, ZH_A1_RATE } from '../helpers';

/**
 * Chino A1 U14 «Descripciones, colores y comparaciones» (docs/ZH_A1_A2.md): colores con 的, 有点儿
 * + adjetivo, describir personas, A 比 B + adjetivo y A 跟 B 一样.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const TIENDA = dialogue(
  'zh.stim.a1-u14-tienda',
  'Dos amigas eligen ropa en una tienda.',
  [
    ['张丽', '你看，这件红色的衣服怎么样？'],
    ['安娜', '很漂亮，可是有点儿贵。'],
    ['张丽', '那件白色的呢？'],
    ['安娜', '白色的比红色的便宜。我买白色的！'],
  ],
  ZH_A1_RATE,
);

const HERMANOS = dialogue(
  'zh.stim.a1-u14-jiejie',
  'Li Hua le pregunta a Wang Ming por su hermana mayor.',
  [
    ['李华', '王明，你姐姐比你高吗？'],
    ['王明', '不，她比我矮。可是她的头发比我的长！'],
    ['李华', '你们的眼睛一样吗？'],
    ['王明', '一样，我们的眼睛都很大。'],
  ],
  ZH_A1_RATE,
);

const MENSAJE = reading(
  'zh.stim.a1-u14-gege',
  'message',
  'Wang Ming le avisa a Anna que su hermano la va a buscar.',
  [
    '安娜，我哥哥今天去你们学校。',
    '他很高，头发很短。',
    '他的包是黑色的，很大。',
    '他跟我一样，不会说英语！',
  ],
  { from: '王明', to: '安娜' },
);

export const ZH_A1_U14: ZhUnitDef = {
  names: ['安娜', '张丽', '李华'],
  support: ['可是'],
  unit: {
    position: 14,
    title: 'Descripciones, colores y comparaciones',
    titleEn: '颜色 Colors and descriptions',
    description: 'Colores, cosas nuevas y viejas, cómo es una persona, 比 y 跟…一样.',
    emoji: '🎨',
    objective:
      'Podés describir cosas y personas (colores, tamaño, estatura, pelo), quejarte con 有点儿 y comparar con 比 y 跟…一样.',
    grammar: {
      title: 'Adjetivo + 的 · 有点儿 · 比 · 跟…一样',
      explanation:
        'Con 的 un color o un adjetivo funciona como sustantivo: 红色的 (el rojo, uno rojo). 有点儿 + adjetivo es «medio…» con queja: 有点儿贵. Para comparar: A 比 B + adjetivo, sin 很 (我比你高). Para decir que son iguales: A 跟 B 一样 (+ adjetivo).',
      examples: [
        { target: '我要红色的。', base: 'Quiero el rojo.' },
        { target: '我比我哥哥高。', base: 'Soy más alto que mi hermano.' },
        { target: '我跟你一样高。', base: 'Soy tan alto como vos.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U14). Sin revisión nativa: revisar 有点儿 frente a 一点儿, 旧 sólo para cosas y la naturalidad de 她头发很长.',
    },
    words: [
      w('zh-yanse', '颜色', 'yánsè', 'color', '你喜欢什么颜色？', '¿Qué color te gusta?', [
        'colors',
      ]),
      w('zh-hongse', '红色', 'hóngsè', 'rojo', '我喜欢红色。', 'Me gusta el rojo.', ['colors'], {
        emoji: '🔴',
      }),
      w(
        'zh-baise',
        '白色',
        'báisè',
        'blanco',
        '我的手机是白色的。',
        'Mi celular es blanco.',
        ['colors'],
        {
          emoji: '⚪',
        },
      ),
      w(
        'zh-heise',
        '黑色',
        'hēisè',
        'negro',
        '他的包是黑色的。',
        'Su bolso es negro.',
        ['colors'],
        {
          emoji: '⚫',
        },
      ),
      w('zh-lanse', '蓝色', 'lánsè', 'azul', '我喜欢蓝色。', 'Me gusta el azul.', ['colors'], {
        emoji: '🔵',
      }),
      w(
        'zh-xin',
        '新',
        'xīn',
        'nuevo',
        '这是我的新手机。',
        'Este es mi celular nuevo.',
        ['adjectives'],
        {
          acceptedTranslations: ['nueva'],
        },
      ),
      w(
        'zh-jiu-viejo',
        '旧',
        'jiù',
        'viejo (cosas)',
        '我的电脑很旧。',
        'Mi computadora es muy vieja.',
        ['adjectives'],
        {
          acceptedTranslations: ['viejo', 'vieja', 'usado'],
        },
      ),
      w(
        'zh-chang',
        '长',
        'cháng',
        'largo',
        '她头发很长。',
        'Ella tiene el pelo largo.',
        ['adjectives'],
        {
          acceptedTranslations: ['larga'],
        },
      ),
      w('zh-duan', '短', 'duǎn', 'corto', '我头发很短。', 'Tengo el pelo corto.', ['adjectives'], {
        acceptedTranslations: ['corta'],
      }),
      w(
        'zh-gao',
        '高',
        'gāo',
        'alto',
        '我哥哥很高。',
        'Mi hermano mayor es alto.',
        ['adjectives'],
        {
          acceptedTranslations: ['alta'],
        },
      ),
      w(
        'zh-ai',
        '矮',
        'ǎi',
        'bajo (de estatura)',
        '我妹妹很矮。',
        'Mi hermana menor es baja.',
        ['adjectives'],
        {
          acceptedTranslations: ['bajo', 'baja'],
        },
      ),
      w(
        'zh-youdianr',
        '有点儿',
        'yǒudiǎnr',
        'medio (un poco, de más)',
        '这件衣服有点儿贵。',
        'Esta ropa es medio cara.',
        ['basics'],
        { acceptedTranslations: ['medio', 'un poco de más', 'algo'] },
      ),
      w(
        'zh-bi-comparar',
        '比',
        'bǐ',
        'más que (comparación)',
        '我比你高。',
        'Soy más alto que vos.',
        ['grammar'],
        {
          acceptedTranslations: ['más que', 'que'],
        },
      ),
      w(
        'zh-yiyang',
        '一样',
        'yíyàng',
        'igual',
        '我的包跟你的一样。',
        'Mi bolso es igual al tuyo.',
        ['adjectives'],
        {
          acceptedTranslations: ['lo mismo', 'iguales'],
        },
      ),
      w(
        'zh-gen',
        '跟',
        'gēn',
        'con',
        '我跟朋友去超市。',
        'Voy al súper con un amigo.',
        ['grammar'],
        {
          acceptedTranslations: ['y'],
        },
      ),
      w(
        'zh-toufa',
        '头发',
        'tóufa',
        'pelo',
        '她头发很长。',
        'Ella tiene el pelo largo.',
        ['body'],
        {
          acceptedTranslations: ['cabello'],
        },
      ),
      w(
        'zh-yanjing',
        '眼睛',
        'yǎnjing',
        'ojos',
        '她眼睛很大。',
        'Ella tiene los ojos grandes.',
        ['body'],
        {
          acceptedTranslations: ['ojo'],
          emoji: '👀',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '颜色',
        objective: 'Nombrar colores y decir de qué color es algo.',
        intro: {
          explanation:
            'Los colores terminan en 色 (color): 红色, 白色, 黑色, 蓝色. Para decir el color de algo: 是 + color + 的. Con 的 el color funciona como sustantivo: 我要红色的 (quiero el rojo).',
          examples: [
            { target: '我的手机是黑色的。', base: 'Mi celular es negro.' },
            { target: '我要红色的。', base: 'Quiero el rojo.' },
          ],
        },
        takeaways: ['Nombrás cuatro colores.', 'Decís de qué color es algo con 是…的.'],
        exercises: [
          ex.imageChoice('🔴', '红色', ['白色', '黑色', '蓝色'], ['zh-hongse'], {
            id: 'zh.ex.3wu52z4ffsddpx',
          }),
          ex.imageChoice('🔵', '蓝色', ['红色', '白色', '黑色'], ['zh-lanse'], {
            id: 'zh.ex.rcaeo9zr8q3m78',
          }),
          ex.translationChoice('颜色', 'color', ['ropa', 'cosa', 'nombre'], ['zh-yanse'], {
            id: 'zh.ex.kvtyd08lg8appb',
          }),
          ex.listenChoice(
            '我的手机是黑色的。',
            ['我的手机是白色的。', '我的包是黑色的。', '你的手机是黑色的。'],
            ['zh-heise'],
            { id: 'zh.ex.yc77wpr5try5lm' },
          ),
          ex.fillBlank(
            '你喜欢什么___？',
            '¿Qué color te gusta?',
            '颜色',
            ['东西', '名字', '钱'],
            ['zh-yanse'],
            {
              id: 'zh.ex.dsaw32ykw1hlvr',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '我要红色___。',
            'Quiero el rojo.',
            '的',
            ['了', '吗', '呢'],
            ['zh-hongse', 'zh-de'],
            {
              id: 'zh.ex.e2w2api51b7x9f',
              explanation: 'Con 的 el color funciona como sustantivo: 红色的 = el rojo, uno rojo.',
            },
          ),
          ex.matchPairs(
            [
              ['红色', 'rojo'],
              ['白色', 'blanco'],
              ['黑色', 'negro'],
              ['蓝色', 'azul'],
            ],
            ['zh-hongse', 'zh-baise', 'zh-heise', 'zh-lanse'],
            { id: 'zh.ex.x6v1y2h7hlfzd6' },
          ),
          tone('白色', 'báisè', ['bāisè', 'bǎisè', 'bàisè'], ['zh-baise'], {
            id: 'zh.ex.mzl9wfsqcd1oaq',
          }),
          reply(
            '你的包是什么颜色的？',
            '¿De qué color es tu bolso? (Respondé que es negro.)',
            'wǒ de bāo shì hēisè de',
            '我的包是黑色的',
            ['zh-heise', 'zh-yanse'],
            {
              id: 'zh.ex.33md1rjjw774n2',
              accepted: ['shì hēisè de', '是黑色的', 'hēisè de', '黑色的', 'hēisè', '黑色'],
            },
          ),
          write('Me gusta el azul.', 'wǒ xǐhuan lánsè', '我喜欢蓝色', ['zh-lanse'], {
            id: 'zh.ex.w88e7xgulih8ft',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '新、旧、长、短',
        objective: 'Describir cosas y quejarte con 有点儿.',
        intro: {
          explanation:
            '新 (nuevo) y 旧 (viejo, usado: sólo para cosas). 长 (largo) y 短 (corto). 有点儿 + adjetivo es «medio…» y suena a queja: 有点儿长 (medio largo, más de lo que quiero).',
          examples: [
            { target: '我的手机很旧。', base: 'Mi celular es muy viejo.' },
            { target: '这件衣服有点儿长。', base: 'Esta ropa es medio larga.' },
          ],
        },
        takeaways: ['Describís cosas con 新, 旧, 长 y 短.', 'Te quejás con 有点儿 + adjetivo.'],
        exercises: [
          ex.translationChoice('新', 'nuevo', ['viejo (cosas)', 'largo', 'corto'], ['zh-xin'], {
            id: 'zh.ex.kyavu1dgbtfm9h',
          }),
          ex.translationChoice('短', 'corto', ['largo', 'nuevo', 'viejo (cosas)'], ['zh-duan'], {
            id: 'zh.ex.5hqrerqmzw9u6w',
          }),
          ex.listenChoice(
            '这件衣服有点儿长。',
            ['这件衣服很长。', '这件衣服有点儿短。', '这双鞋有点儿长。'],
            ['zh-youdianr', 'zh-chang'],
            { id: 'zh.ex.9p245ok3bqjt0w' },
          ),
          ex.fillBlank(
            '我的电脑很___，我想买新的。',
            'Mi compu es muy vieja; quiero comprar una nueva.',
            '旧',
            ['新', '长', '短'],
            ['zh-jiu-viejo', 'zh-xin'],
            { id: 'zh.ex.ippzrxnb9u4yu1', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            '这双鞋___贵，我不买。',
            'Estos zapatos son medio caros; no los compro.',
            '有点儿',
            ['一点儿', '都', '多少'],
            ['zh-youdianr'],
            {
              id: 'zh.ex.licd1noygfguea',
              explanation: '有点儿 va antes del adjetivo y marca algo que no gusta: 有点儿贵.',
            },
          ),
          tone('旧', 'jiù', ['jiū', 'jiú', 'jiǔ'], ['zh-jiu-viejo'], {
            id: 'zh.ex.sytlxnd4bbmgrh',
          }),
          ex.matchPairs(
            [
              ['新', 'nuevo'],
              ['旧', 'viejo (cosas)'],
              ['长', 'largo'],
              ['短', 'corto'],
            ],
            ['zh-xin', 'zh-jiu-viejo', 'zh-chang', 'zh-duan'],
            { id: 'zh.ex.y5llsyi89p0jjn' },
          ),
          ex.orderWords(
            '我 的 手机 有点儿 旧。',
            'Mi celular es medio viejo.',
            ['zh-youdianr', 'zh-jiu-viejo'],
            {
              id: 'zh.ex.z5amfae59ksp5i',
            },
          ),
          reply(
            '这件衣服怎么样？',
            '¿Qué tal esta ropa? (Respondé que es medio larga.)',
            'yǒudiǎnr cháng',
            '有点儿长',
            ['zh-youdianr', 'zh-chang'],
            {
              id: 'zh.ex.mxmc0o2otxc5zy',
              accepted: ['zhè jiàn yīfu yǒudiǎnr cháng', '这件衣服有点儿长'],
            },
          ),
          write(
            'Mi computadora es nueva.',
            'wǒ de diànnǎo shì xīn de',
            '我的电脑是新的',
            ['zh-xin'],
            {
              id: 'zh.ex.45l4cpoyc2mjei',
              accepted: ['wǒ de diànnǎo hěn xīn', '我的电脑很新'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '高和矮',
        objective: 'Describir cómo es una persona.',
        intro: {
          explanation:
            '高 (alto) y 矮 (bajo, de estatura). Para el pelo y los ojos se dice persona + 头发 / 眼睛 + adjetivo: 她头发很长 («ella, el pelo muy largo»). 长 es para cosas largas como el pelo; para la estatura se usa 高.',
          examples: [
            { target: '我哥哥很高。', base: 'Mi hermano mayor es alto.' },
            { target: '她头发很长，眼睛很大。', base: 'Tiene el pelo largo y los ojos grandes.' },
          ],
        },
        takeaways: ['Decís si alguien es alto o bajo.', 'Describís el pelo y los ojos.'],
        exercises: [
          ex.translationChoice('矮', 'bajo (de estatura)', ['alto', 'largo', 'corto'], ['zh-ai'], {
            id: 'zh.ex.t1kvtmyyj753xc',
          }),
          ex.translationChoice('头发', 'pelo', ['ojos', 'ropa', 'zapatos'], ['zh-toufa'], {
            id: 'zh.ex.hxzz835ttm6bu8',
          }),
          ex.imageChoice('👀', '眼睛', ['头发', '手机', '鞋'], ['zh-yanjing'], {
            id: 'zh.ex.9nzogo3c5ui1xk',
          }),
          ex.listenChoice(
            '她头发很长，眼睛很大。',
            ['她头发很短，眼睛很大。', '她头发很长，眼睛很小。', '她头发很短，眼睛很小。'],
            ['zh-toufa', 'zh-yanjing'],
            { id: 'zh.ex.yv2x2jdn408ce0' },
          ),
          ex.fillBlank(
            '我爸爸很___，我很矮。',
            'Mi papá es muy alto; yo soy bajo.',
            '高',
            ['长', '新', '短'],
            ['zh-gao', 'zh-ai'],
            {
              id: 'zh.ex.xtmwebjri88o63',
              skill: 'vocabulary',
              explanation: 'Para la estatura se usa 高; 长 (largo) es para cosas como el pelo.',
            },
          ),
          tone('眼睛', 'yǎnjing', ['yānjing', 'yánjing', 'yànjing'], ['zh-yanjing'], {
            id: 'zh.ex.womjc1639rjmxz',
          }),
          ex.orderWords(
            '我 妹妹 头发 很 短。',
            'Mi hermana menor tiene el pelo corto.',
            ['zh-toufa', 'zh-duan'],
            {
              id: 'zh.ex.dw4xkka2vrds1x',
            },
          ),
          ex.matchPairs(
            [
              ['高', 'alto'],
              ['矮', 'bajo (de estatura)'],
              ['头发', 'pelo'],
              ['眼睛', 'ojos'],
            ],
            ['zh-gao', 'zh-ai', 'zh-toufa', 'zh-yanjing'],
            { id: 'zh.ex.qfzzhfzqjhrjrz' },
          ),
          reply(
            '你哥哥高吗？',
            '¿Tu hermano mayor es alto? (Respondé que no, que es bajo.)',
            'bù, tā hěn ǎi',
            '不，他很矮',
            ['zh-ai', 'zh-gao'],
            {
              id: 'zh.ex.zskp6jhf18qjbo',
              accepted: ['tā hěn ǎi', '他很矮', 'bù gāo, tā hěn ǎi', '不高，他很矮'],
            },
          ),
          write(
            'Ella tiene el pelo largo.',
            'tā tóufa hěn cháng',
            '她头发很长',
            ['zh-toufa', 'zh-chang'],
            {
              id: 'zh.ex.46st6cjlwsd4va',
              accepted: ['tā de tóufa hěn cháng', '她的头发很长'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '比',
        objective: 'Comparar dos cosas o personas con 比.',
        intro: {
          explanation:
            'Para comparar: A + 比 + B + adjetivo. 我比你高 es «soy más alto que vos». Con 比 el adjetivo va solo: 我比你很高 está mal.',
          examples: [
            { target: '我比我哥哥高。', base: 'Soy más alto que mi hermano mayor.' },
            { target: '白色的比红色的便宜。', base: 'El blanco es más barato que el rojo.' },
          ],
        },
        takeaways: ['Comparás con A 比 B + adjetivo.', 'No usás 很 en una comparación con 比.'],
        exercises: [
          ex.translationChoice(
            '比',
            'más que (comparación)',
            ['igual', 'con', 'medio (un poco, de más)'],
            ['zh-bi-comparar'],
            {
              id: 'zh.ex.z9ou53ziput4cq',
            },
          ),
          ex.listenChoice(
            '我比我姐姐高。',
            ['我姐姐比我高。', '我比我姐姐矮。', '我比我妹妹高。'],
            ['zh-bi-comparar', 'zh-gao'],
            {
              id: 'zh.ex.sheuo7rw1vuoc9',
            },
          ),
          ex.fillBlank(
            '这件衣服___那件贵。',
            'Esta ropa es más cara que aquella.',
            '比',
            ['也', '很', '都'],
            ['zh-bi-comparar'],
            {
              id: 'zh.ex.xs3plab69togeu',
            },
          ),
          ex.fillBlank(
            '我哥哥比我___。',
            'Mi hermano mayor es más alto que yo.',
            '高',
            ['很高', '有点儿高', '非常高'],
            ['zh-bi-comparar', 'zh-gao'],
            {
              id: 'zh.ex.ixxzw05o298j2r',
              explanation: 'Con 比 el adjetivo va solo, sin 很 ni 非常: 比我高.',
            },
          ),
          ex.orderWords(
            '白色的 比 红色的 便宜。',
            'El blanco es más barato que el rojo.',
            ['zh-bi-comparar', 'zh-baise', 'zh-hongse'],
            {
              id: 'zh.ex.1kp076mutlgxnm',
            },
          ),
          tone('比', 'bǐ', ['bī', 'bí', 'bì'], ['zh-bi-comparar'], { id: 'zh.ex.aw6rl1gp1fkowd' }),
          question(
            'zh.ex.8ckde1bpmwyhla',
            TIENDA,
            '¿Qué opina Anna de la ropa roja?',
            'Es linda, pero medio cara',
            ['Es fea y barata', 'Es linda y barata', 'Es medio larga'],
            ['zh-hongse', 'zh-youdianr'],
            'Anna dice: «很漂亮，可是有点儿贵».',
          ),
          question(
            'zh.ex.61hj936zpfygy0',
            TIENDA,
            '¿Qué compra Anna y por qué?',
            'La blanca, porque es más barata',
            ['La roja, porque es más linda', 'La blanca, porque es más linda', 'No compra nada'],
            ['zh-baise', 'zh-bi-comparar'],
            'Anna dice: «白色的比红色的便宜。我买白色的！».',
          ),
          reply(
            '你比你弟弟高吗？',
            '¿Sos más alto que tu hermano menor? (Respondé que sí.)',
            'wǒ bǐ wǒ dìdi gāo',
            '我比我弟弟高',
            ['zh-bi-comparar', 'zh-gao'],
            {
              id: 'zh.ex.ywrpsjlujxweog',
              accepted: ['wǒ bǐ dìdi gāo', '我比弟弟高', 'wǒ bǐ tā gāo', '我比他高'],
            },
          ),
          write(
            'Mi hermana menor es más baja que yo.',
            'wǒ mèimei bǐ wǒ ǎi',
            '我妹妹比我矮',
            ['zh-bi-comparar', 'zh-ai'],
            {
              id: 'zh.ex.oddqnu6axf3311',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '跟…一样',
        objective: 'Decir que dos cosas son iguales y entender una descripción.',
        intro: {
          explanation:
            'A 跟 B 一样 es «A es igual a B». Con un adjetivo: 我跟你一样高 (soy tan alto como vos). 跟 también es «con»: 我跟朋友去超市.',
          examples: [
            { target: '我的包跟你的一样。', base: 'Mi bolso es igual al tuyo.' },
            { target: '我跟我哥哥一样高。', base: 'Soy tan alto como mi hermano mayor.' },
          ],
        },
        takeaways: [
          'Decís que algo es igual con 跟…一样.',
          'Entendés cómo describen a una persona.',
        ],
        exercises: [
          ex.translationChoice(
            '一样',
            'igual',
            ['más que (comparación)', 'con', 'todos (los dos)'],
            ['zh-yiyang'],
            {
              id: 'zh.ex.pbgb4nphf6p4n4',
            },
          ),
          ex.listenChoice(
            '我跟我姐姐一样高。',
            ['我比我姐姐高。', '我跟我妹妹一样高。', '我跟我姐姐一样大。'],
            ['zh-gen', 'zh-yiyang'],
            { id: 'zh.ex.98a9cxcolwx3x9' },
          ),
          ex.fillBlank(
            '我的手机___你的一样。',
            'Mi celular es igual al tuyo.',
            '跟',
            ['比', '都', '很'],
            ['zh-gen', 'zh-yiyang'],
            {
              id: 'zh.ex.jhvgf0cewkdbhq',
            },
          ),
          ex.fillBlank(
            '我___朋友去超市。',
            'Voy al súper con un amigo.',
            '跟',
            ['比', '的', '都'],
            ['zh-gen'],
            {
              id: 'zh.ex.r6vtd0wo6vua7e',
              skill: 'vocabulary',
            },
          ),
          question(
            'zh.ex.bqdnaq093ndwwo',
            HERMANOS,
            '¿Quién es más alto?',
            'Wang Ming',
            ['La hermana de Wang Ming', 'Miden lo mismo', 'No lo dice'],
            ['zh-bi-comparar', 'zh-ai'],
            'Wang Ming dice de su hermana: «她比我矮».',
          ),
          question(
            'zh.ex.p2xxwoe82hehw1',
            HERMANOS,
            '¿Qué tienen igual Wang Ming y su hermana?',
            'Los ojos grandes',
            ['El pelo largo', 'La estatura', 'El pelo corto'],
            ['zh-yiyang', 'zh-yanjing'],
            'Wang Ming dice: «一样，我们的眼睛都很大».',
          ),
          question(
            'zh.ex.3a7s9noub0dtfr',
            MENSAJE,
            '¿Cómo es el hermano de Wang Ming?',
            'Alto y con el pelo corto',
            ['Bajo y con el pelo largo', 'Alto y con el pelo largo', 'Bajo y con el pelo corto'],
            ['zh-gao', 'zh-duan'],
            'El mensaje dice: «他很高，头发很短».',
          ),
          question(
            'zh.ex.gyzmb760kbalmu',
            MENSAJE,
            '¿Cómo es el bolso del hermano?',
            'Negro y grande',
            ['Blanco y chico', 'Rojo y grande', 'Azul y nuevo'],
            ['zh-heise'],
            'El mensaje dice: «他的包是黑色的，很大».',
          ),
          reply(
            '你的手机跟我的一样吗？',
            '¿Tu celular es igual al mío? (Respondé que sí, que es igual.)',
            'yíyàng',
            '一样',
            ['zh-yiyang'],
            {
              id: 'zh.ex.zum35zs91jsym3',
              accepted: [
                'wǒ de shǒujī gēn nǐ de yíyàng',
                '我的手机跟你的一样',
                'gēn nǐ de yíyàng',
                '跟你的一样',
              ],
            },
          ),
          write(
            'Soy tan alto como mi papá.',
            'wǒ gēn wǒ bàba yíyàng gāo',
            '我跟我爸爸一样高',
            ['zh-gen', 'zh-yiyang'],
            {
              id: 'zh.ex.fvcwszi2p7laoe',
              accepted: ['wǒ gēn bàba yíyàng gāo', '我跟爸爸一样高'],
            },
          ),
        ],
      },
    ],
  },
};

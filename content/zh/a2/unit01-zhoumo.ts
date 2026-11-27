import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U1 «¿Qué hiciste el fin de semana?» (docs/ZH_A1_A2.md): 了 de acción terminada con
 * objeto y cantidad, 已经…了, 还没…呢, 刚才, actividades del tiempo libre y de la casa.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LUNES = dialogue('zh.stim.a2-u1-zhoumo', 'Dos compañeros de trabajo hablan el lunes.', [
  ['张丽', '周末你做什么了？'],
  ['李华', '星期六我跟朋友爬山了，星期天在家休息。'],
  ['张丽', '爬山累吗？'],
  ['李华', '很累，可是很好玩！'],
]);

const MENSAJE = reading(
  'zh.stim.a2-u1-huijia',
  'message',
  'Wang Ming le escribe a su mamá.',
  ['妈妈，我已经回家了。', '我打扫了房间，也洗了衣服。', '作业还没写呢，晚上写。'],
  { from: '王明', to: '妈妈' },
);

const COMIDA = dialogue('zh.stim.a2-u1-chifan', 'Anna llama a Wang Ming al mediodía.', [
  ['安娜', '王明，你吃饭了吗？'],
  ['王明', '还没吃呢。你呢？'],
  ['安娜', '我刚才吃了。我们晚上见面吧！'],
  ['王明', '好，可是我今天很晚回家。'],
]);

export const ZH_A2_U01: ZhUnitDef = {
  names: ['张丽', '李华', '安娜'],
  support: ['好玩'],
  unit: {
    position: 1,
    title: '¿Qué hiciste el fin de semana?',
    titleEn: '周末 The weekend',
    description: 'Contar el fin de semana con 了, decir qué ya hiciste y qué todavía no.',
    emoji: '🏔️',
    objective:
      'Puedes contar qué hiciste el fin de semana, qué ya hiciste (已经…了) y qué todavía no (还没…呢).',
    grammar: {
      title: '了 · 已经…了 · 还没…呢',
      explanation:
        'Verbo + 了 cuenta algo terminado; con un número, 了 va pegado al verbo (看了两个电影). 已经…了 es «ya». «Todavía no» es 还没 + verbo, con 呢 opcional al final y nunca con 了. 刚才 es «hace un rato».',
      examples: [
        { target: '上个星期我看了两个电影。', base: 'La semana pasada vi dos películas.' },
        { target: '我已经吃饭了。', base: 'Ya comí.' },
        { target: '我还没写作业呢。', base: 'Todavía no hice la tarea.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 nuevo (U1). Sin revisión nativa: revisar la posición de 了 con objeto y 还没…呢.',
    },
    words: [
      w('zh-yijing', '已经', 'yǐjīng', 'ya', '我已经吃饭了。', 'Ya comí.', ['time']),
      w(
        'zh-hai-mei',
        '还没',
        'hái méi',
        'todavía no',
        '我还没写作业呢。',
        'Todavía no hice la tarea.',
        ['time'],
        {
          acceptedTranslations: ['aún no'],
        },
      ),
      w(
        'zh-gangcai',
        '刚才',
        'gāngcái',
        'hace un rato',
        '我刚才吃了。',
        'Comí hace un rato.',
        ['time'],
        {
          acceptedTranslations: ['recién'],
        },
      ),
      w('zh-dasao', '打扫', 'dǎsǎo', 'limpiar', '我打扫了房间。', 'Limpié el cuarto.', [
        'verbs',
        'home',
      ]),
      w('zh-xi', '洗', 'xǐ', 'lavar', '我洗了衣服。', 'Lavé la ropa.', ['verbs', 'home']),
      w('zh-xie-escribir', '写', 'xiě', 'escribir', '我写作业。', 'Hago la tarea.', ['verbs']),
      w(
        'zh-zuoye',
        '作业',
        'zuòyè',
        'tarea (de la escuela)',
        '我还没写作业呢。',
        'Todavía no hice la tarea.',
        ['school'],
        {
          acceptedTranslations: ['tarea', 'deberes'],
        },
      ),
      w(
        'zh-xiuxi',
        '休息',
        'xiūxi',
        'descansar',
        '星期天我在家休息。',
        'El domingo descanso en casa.',
        ['verbs', 'free-time'],
      ),
      w(
        'zh-wan',
        '玩',
        'wán',
        'divertirse',
        '周末我跟朋友玩。',
        'El fin de semana la paso con amigos.',
        ['verbs', 'free-time'],
        {
          acceptedTranslations: ['jugar', 'pasarla bien'],
        },
      ),
      w(
        'zh-guangjie',
        '逛街',
        'guàngjiē',
        'pasear (por las tiendas)',
        '星期六我去逛街了。',
        'El sábado fui a pasear por las tiendas.',
        ['free-time'],
        {
          acceptedTranslations: ['ir de compras', 'pasear'],
        },
      ),
      w(
        'zh-pashan',
        '爬山',
        'páshān',
        'ir a la montaña',
        '我跟朋友爬山了。',
        'Fui a la montaña con amigos.',
        ['free-time'],
        {
          acceptedTranslations: ['subir una montaña', 'hacer senderismo'],
          emoji: '⛰️',
        },
      ),
      w(
        'zh-jianmian',
        '见面',
        'jiànmiàn',
        'verse (encontrarse)',
        '我们明天见面吧！',
        '¡Veámonos mañana!',
        ['social'],
        {
          acceptedTranslations: ['verse', 'encontrarse'],
        },
      ),
      w('zh-hui-volver', '回', 'huí', 'volver', '我很晚回家。', 'Vuelvo tarde a casa.', ['verbs'], {
        acceptedTranslations: ['regresar'],
      }),
      w('zh-zao', '早', 'zǎo', 'temprano', '我很早起床。', 'Me levanto temprano.', ['time']),
      w(
        'zh-wan-tarde',
        '晚',
        'wǎn',
        'tarde (con retraso)',
        '我很晚回家。',
        'Vuelvo tarde a casa.',
        ['time'],
        {
          acceptedTranslations: ['tarde'],
        },
      ),
      w(
        'zh-shang-ge-xingqi',
        '上个星期',
        'shàng ge xīngqī',
        'la semana pasada',
        '上个星期我很忙。',
        'La semana pasada estuve muy ocupado.',
        ['time'],
        {
          acceptedTranslations: ['semana pasada'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '周末做什么了？',
        objective: 'Contar qué hiciste el fin de semana.',
        intro: {
          explanation:
            'Para contar qué hiciste se pone 了 después del verbo o al final: 我休息了. Si el objeto lleva número, 了 va pegado al verbo: 我看了两个电影. 上个星期 es la semana pasada.',
          examples: [
            {
              target: '周末你做什么了？——我休息了。',
              base: '¿Qué hiciste el fin de semana? — Descansé.',
            },
            { target: '上个星期我看了两个电影。', base: 'La semana pasada vi dos películas.' },
          ],
        },
        takeaways: ['Cuentas lo que hiciste con 了.', 'Nombras actividades del tiempo libre.'],
        exercises: [
          ex.translationChoice(
            '休息',
            'descansar',
            ['limpiar', 'escribir', 'volver'],
            ['zh-xiuxi'],
            { id: 'zh.ex.mod7rb9ocu1jlj' },
          ),
          ex.translationChoice(
            '逛街',
            'pasear (por las tiendas)',
            ['ir a la montaña', 'descansar', 'verse (encontrarse)'],
            ['zh-guangjie'],
            {
              id: 'zh.ex.1q4oqykvae94bt',
            },
          ),
          ex.listenChoice(
            '星期六我跟朋友去逛街了。',
            ['星期六我跟朋友去爬山了。', '星期天我跟朋友去逛街了。', '星期六我跟妈妈去逛街了。'],
            ['zh-guangjie'],
            { id: 'zh.ex.0r021b0bc00tj6' },
          ),
          ex.fillBlank(
            '上个星期我看___两个电影。',
            'La semana pasada vi dos películas.',
            '了',
            ['吧', '吗', '没'],
            ['zh-shang-ge-xingqi', 'zh-le'],
            {
              id: 'zh.ex.myqsc7c25g5ii9',
              explanation: 'Con un número, 了 va pegado al verbo: 看了两个电影.',
            },
          ),
          ex.imageChoice('⛰️', '爬山', ['逛街', '休息', '游泳'], ['zh-pashan'], {
            id: 'zh.ex.632yx98rtjjsyi',
          }),
          tone('休息', 'xiūxi', ['xiúxi', 'xiǔxi', 'xiùxi'], ['zh-xiuxi'], {
            id: 'zh.ex.1mdj7qvvv9emm4',
          }),
          ex.matchPairs(
            [
              ['休息', 'descansar'],
              ['玩', 'divertirse'],
              ['逛街', 'pasear (por las tiendas)'],
              ['爬山', 'ir a la montaña'],
            ],
            ['zh-xiuxi', 'zh-wan', 'zh-guangjie', 'zh-pashan'],
            { id: 'zh.ex.mzss6syb0kkp4m' },
          ),
          reply(
            '周末你做什么了？',
            '¿Qué hiciste el fin de semana? (Responde que descansaste en casa.)',
            'wǒ zài jiā xiūxi le',
            '我在家休息了',
            ['zh-xiuxi'],
            {
              id: 'zh.ex.b7m3axk4t2vcp3',
              accepted: [
                'zài jiā xiūxi le',
                '在家休息了',
                'wǒ xiūxi le',
                '我休息了',
                'zhōumò wǒ zài jiā xiūxi le',
                '周末我在家休息了',
              ],
            },
          ),
          write(
            'La semana pasada fui a la montaña.',
            'shàng ge xīngqī wǒ qù páshān le',
            '上个星期我去爬山了',
            ['zh-shang-ge-xingqi', 'zh-pashan'],
            {
              id: 'zh.ex.fzsdwp0fiiczbs',
              accepted: [
                'wǒ shàng ge xīngqī qù páshān le',
                '我上个星期去爬山了',
                'shàng ge xīngqī wǒ páshān le',
                '上个星期我爬山了',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '打扫和洗衣服',
        objective: 'Contar tareas de la casa y de la escuela.',
        intro: {
          explanation:
            '打扫 es limpiar (la casa, el cuarto) y 洗, lavar: 洗衣服. «Hacer la tarea» se dice 写作业 (escribir la tarea). El pasado se niega con 没: 我没写作业.',
          examples: [
            { target: '我打扫了房间。', base: 'Limpié el cuarto.' },
            { target: '我昨天没写作业。', base: 'Ayer no hice la tarea.' },
          ],
        },
        takeaways: [
          'Cuentas tareas de la casa con 打扫 y 洗.',
          'Dices «hacer la tarea» con 写作业.',
        ],
        exercises: [
          ex.translationChoice(
            '打扫',
            'limpiar',
            ['lavar', 'escribir', 'descansar'],
            ['zh-dasao'],
            { id: 'zh.ex.jb7jvkh605sypl' },
          ),
          ex.translationChoice(
            '作业',
            'tarea (de la escuela)',
            ['trabajo', 'empresa', 'libro'],
            ['zh-zuoye'],
            { id: 'zh.ex.6o75imdmkl8dcu' },
          ),
          ex.listenChoice(
            '我洗了衣服。',
            ['我买了衣服。', '我洗了鞋。', '我没洗衣服。'],
            ['zh-xi'],
            { id: 'zh.ex.xwfawbr93r8229' },
          ),
          ex.fillBlank(
            '星期天我___了房间。',
            'El domingo limpié el cuarto.',
            '打扫',
            ['洗', '写', '玩'],
            ['zh-dasao'],
            {
              id: 'zh.ex.z63fu7zuc0veda',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '我昨天___写作业。',
            'Ayer no hice la tarea.',
            '没',
            ['不', '了', '吧'],
            ['zh-xie-escribir', 'zh-zuoye', 'zh-mei-pasado'],
            {
              id: 'zh.ex.7ho2w5k026q6mk',
              explanation: 'El pasado se niega con 没 y sin 了: 没写作业.',
            },
          ),
          tone('写', 'xiě', ['xiē', 'xié', 'xiè'], ['zh-xie-escribir'], {
            id: 'zh.ex.nlulyrzo2akk5y',
          }),
          ex.orderWords(
            '我 打扫 了 房间， 也 洗 了 衣服。',
            'Limpié el cuarto y también lavé la ropa.',
            ['zh-dasao', 'zh-xi'],
            {
              id: 'zh.ex.4mbe3rr2j4abcd',
            },
          ),
          reply(
            '你写作业了吗？',
            '¿Hiciste la tarea? (Responde que sí, que la escribiste.)',
            'xiě le',
            '写了',
            ['zh-xie-escribir', 'zh-zuoye'],
            {
              id: 'zh.ex.py4a1pjmorrq8k',
              accepted: ['wǒ xiě le', '我写了', 'wǒ xiě zuòyè le', '我写作业了'],
            },
          ),
          write('Lavé la ropa.', 'wǒ xǐ le yīfu', '我洗了衣服', ['zh-xi'], {
            id: 'zh.ex.khp918qgtpxev3',
            accepted: ['wǒ xǐ yīfu le', '我洗衣服了'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '已经 y 还没',
        objective: 'Decir qué ya hiciste y qué todavía no.',
        intro: {
          explanation:
            '已经…了 es «ya»: 我已经吃饭了. «Todavía no» es 还没 + verbo, y se puede cerrar con 呢: 我还没写作业呢 (con 还没 nunca va 了). 刚才 es «hace un rato».',
          examples: [
            { target: '我已经吃饭了。', base: 'Ya comí.' },
            { target: '我还没写作业呢。', base: 'Todavía no hice la tarea.' },
          ],
        },
        takeaways: ['Dices «ya» con 已经…了.', 'Dices «todavía no» con 还没…呢.'],
        exercises: [
          ex.translationChoice(
            '已经',
            'ya',
            ['todavía no', 'hace un rato', 'temprano'],
            ['zh-yijing'],
            { id: 'zh.ex.jvs8m5vq02qhdr' },
          ),
          ex.translationChoice(
            '还没',
            'todavía no',
            ['ya', 'no (en pasado)', 'también'],
            ['zh-hai-mei'],
            { id: 'zh.ex.1sdvjgk94xdzy4' },
          ),
          ex.listenChoice(
            '我还没吃饭呢。',
            ['我已经吃饭了。', '我刚才吃饭了。', '我不吃饭。'],
            ['zh-hai-mei'],
            { id: 'zh.ex.zj8na30xl6ih47' },
          ),
          ex.fillBlank(
            'A：你吃饭了吗？ B：___吃了。',
            'A: ¿Comiste? B: Ya comí.',
            '已经',
            ['还没', '没', '不'],
            ['zh-yijing'],
            {
              id: 'zh.ex.q5yr6b8a0gtdnx',
              explanation: '«Ya» es 已经…了; con 还没 o 没 no se usa 了.',
            },
          ),
          ex.fillBlank(
            '我还没写作业___。',
            'Todavía no hice la tarea.',
            '呢',
            ['了', '吧', '吗'],
            ['zh-hai-mei', 'zh-ne'],
            {
              id: 'zh.ex.pep4jtogc6d3xw',
              explanation: '还没… se puede cerrar con 呢, nunca con 了.',
            },
          ),
          ex.fillBlank(
            '我___洗了衣服，现在很累。',
            'Lavé la ropa hace un rato; ahora estoy cansado.',
            '刚才',
            ['明年', '明天', '每天'],
            ['zh-gangcai'],
            {
              id: 'zh.ex.2f2tilgkj3rnxc',
              skill: 'vocabulary',
            },
          ),
          tone('已经', 'yǐjīng', ['yījīng', 'yíjīng', 'yǐjǐng'], ['zh-yijing'], {
            id: 'zh.ex.b0zjqroup6jpts',
          }),
          reply(
            '你吃饭了吗？',
            '¿Comiste? (Responde que todavía no.)',
            'hái méi chī ne',
            '还没吃呢',
            ['zh-hai-mei'],
            {
              id: 'zh.ex.32epydfxhz4ybw',
              accepted: [
                'hái méi',
                '还没',
                'hái méi chī',
                '还没吃',
                'wǒ hái méi chī ne',
                '我还没吃呢',
                'hái méi chīfàn',
                '还没吃饭',
              ],
            },
          ),
          write(
            'Ya limpié el cuarto.',
            'wǒ yǐjīng dǎsǎo le fángjiān',
            '我已经打扫了房间',
            ['zh-yijing', 'zh-dasao'],
            {
              id: 'zh.ex.dabhy85ldur1h0',
              accepted: ['wǒ yǐjīng dǎsǎo fángjiān le', '我已经打扫房间了'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '早、晚、回、见面',
        objective: 'Hablar de horarios y de encuentros.',
        intro: {
          explanation:
            '回 es volver: 回家. 早 es temprano y 晚, tarde: 我很晚回家. 见面 es verse con alguien y no lleva objeto: se dice 跟朋友见面, no «见面朋友».',
          examples: [
            { target: '我昨天很晚回家。', base: 'Ayer volví tarde a casa.' },
            { target: '我们明天见面吧！', base: '¡Veámonos mañana!' },
          ],
        },
        takeaways: ['Dices cuándo vuelves con 回家, 早 y 晚.', 'Quedas para verte con 见面.'],
        exercises: [
          ex.translationChoice(
            '见面',
            'verse (encontrarse)',
            ['volver', 'descansar', 'pasear (por las tiendas)'],
            ['zh-jianmian'],
            {
              id: 'zh.ex.po8t36iqq14syk',
            },
          ),
          ex.translationChoice(
            '早',
            'temprano',
            ['tarde (con retraso)', 'ya', 'hace un rato'],
            ['zh-zao'],
            { id: 'zh.ex.abdjxdtwpnf89t' },
          ),
          ex.listenChoice(
            '我昨天很晚回家。',
            ['我昨天很早回家。', '我今天很晚回家。', '我昨天很晚起床。'],
            ['zh-wan-tarde', 'zh-hui-volver'],
            { id: 'zh.ex.hd9zvhh2vh4vjj' },
          ),
          ex.fillBlank(
            '我明天跟朋友___。',
            'Mañana me veo con un amigo.',
            '见面',
            ['回', '早', '晚'],
            ['zh-jianmian', 'zh-gen'],
            {
              id: 'zh.ex.vkz3jckgxjdlo4',
              explanation: '见面 no lleva objeto: 跟朋友见面.',
            },
          ),
          ex.fillBlank(
            '你几点___家？',
            '¿A qué hora vuelves a casa?',
            '回',
            ['见面', '走', '打扫'],
            ['zh-hui-volver'],
            {
              id: 'zh.ex.wzvt6kbec8ibet',
              skill: 'vocabulary',
            },
          ),
          tone('回', 'huí', ['huī', 'huǐ', 'huì'], ['zh-hui-volver'], {
            id: 'zh.ex.31genka5fx093x',
          }),
          ex.orderWords(
            '我们 星期六 见面 吧。',
            'Veámonos el sábado.',
            ['zh-jianmian', 'zh-ba-propuesta'],
            { id: 'zh.ex.5859rh0wqb0vdg' },
          ),
          ex.matchPairs(
            [
              ['早', 'temprano'],
              ['晚', 'tarde (con retraso)'],
              ['回', 'volver'],
              ['见面', 'verse (encontrarse)'],
            ],
            ['zh-zao', 'zh-wan-tarde', 'zh-hui-volver', 'zh-jianmian'],
            { id: 'zh.ex.dz7i7nb818mk9z' },
          ),
          reply(
            '你昨天几点回家？',
            '¿A qué hora volviste ayer a casa? (Responde que volviste muy tarde.)',
            'hěn wǎn',
            '很晚',
            ['zh-wan-tarde', 'zh-hui-volver'],
            {
              id: 'zh.ex.q1abnhltw1gmv7',
              accepted: ['wǒ hěn wǎn huí jiā', '我很晚回家', 'hěn wǎn huí jiā', '很晚回家'],
            },
          ),
          write(
            'Mañana me levanto temprano.',
            'míngtiān wǒ hěn zǎo qǐchuáng',
            '明天我很早起床',
            ['zh-zao'],
            {
              id: 'zh.ex.tcm7kb8mgo28ca',
              accepted: ['wǒ míngtiān hěn zǎo qǐchuáng', '我明天很早起床'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '好玩吗？',
        objective: 'Entender relatos y mensajes sobre lo que alguien hizo.',
        intro: {
          explanation:
            'Repasa cómo se cuenta el pasado: verbo + 了, 没 + verbo, 已经…了 y 还没…呢. 好玩 es «divertido»: 爬山很好玩.',
          examples: [
            { target: '爬山很好玩！', base: '¡Ir a la montaña es muy divertido!' },
            { target: '作业还没写呢。', base: 'La tarea todavía no la hice.' },
          ],
        },
        takeaways: [
          'Entiendes qué hizo alguien y qué le falta.',
          'Cuentas tu semana con 了 y 还没.',
        ],
        exercises: [
          ex.listenChoice(
            '爬山很好玩！',
            ['逛街很好玩！', '爬山很累！', '爬山不好玩。'],
            ['zh-pashan'],
            { id: 'zh.ex.zs1i8zjxu0771h' },
          ),
          question(
            'zh.ex.vje6y8n2g2l427',
            LUNES,
            '¿Qué hizo Li Hua el sábado?',
            'Fue a la montaña con amigos',
            ['Descansó en casa', 'Fue de compras con amigos', 'Trabajó'],
            ['zh-pashan'],
            'Li Hua dice: «星期六我跟朋友爬山了».',
          ),
          question(
            'zh.ex.utk63pm7xz9thi',
            LUNES,
            '¿Qué le pareció a Li Hua?',
            'Cansador, pero muy divertido',
            ['Fácil y divertido', 'Aburrido', 'Cansador y aburrido'],
            ['zh-pashan'],
            'Li Hua dice: «很累，可是很好玩！».',
          ),
          question(
            'zh.ex.qezubdk9aex3q5',
            MENSAJE,
            '¿Qué ya hizo Wang Ming?',
            'Volvió a casa, limpió el cuarto y lavó la ropa',
            [
              'Hizo la tarea y lavó la ropa',
              'Sólo volvió a casa',
              'Limpió el cuarto e hizo la tarea',
            ],
            ['zh-yijing', 'zh-dasao', 'zh-xi'],
            'El mensaje dice: «我已经回家了。我打扫了房间，也洗了衣服».',
          ),
          question(
            'zh.ex.zyfsn0p5ubn0ky',
            MENSAJE,
            '¿Qué le falta hacer a Wang Ming?',
            'La tarea, que la hace por la noche',
            ['Lavar la ropa', 'Limpiar el cuarto', 'Nada'],
            ['zh-hai-mei', 'zh-zuoye'],
            'El mensaje dice: «作业还没写呢，晚上写».',
          ),
          question(
            'zh.ex.bnhcr6mh99h0da',
            COMIDA,
            '¿Comió Wang Ming?',
            'Todavía no',
            ['Sí, hace un rato', 'Sí, con Anna', 'Sí, en casa'],
            ['zh-hai-mei'],
            'Wang Ming dice: «还没吃呢».',
          ),
          question(
            'zh.ex.5ysy3408c49lt0',
            COMIDA,
            '¿Qué propone Anna y qué problema tiene Wang Ming?',
            'Verse por la noche, pero él vuelve tarde a casa',
            [
              'Comer juntos ahora, pero él ya comió',
              'Verse mañana, pero él trabaja',
              'Ir a la montaña, pero está cansado',
            ],
            ['zh-jianmian', 'zh-wan-tarde'],
            'Anna dice «我们晚上见面吧！» y Wang Ming, «我今天很晚回家».',
          ),
          reply(
            '你上个星期做什么了？',
            '¿Qué hiciste la semana pasada? (Responde que fuiste a pasear por las tiendas.)',
            'wǒ qù guàngjiē le',
            '我去逛街了',
            ['zh-guangjie', 'zh-shang-ge-xingqi'],
            {
              id: 'zh.ex.342z0ldrv33cqd',
              accepted: [
                'qù guàngjiē le',
                '去逛街了',
                'wǒ guàngjiē le',
                '我逛街了',
                'shàng ge xīngqī wǒ qù guàngjiē le',
                '上个星期我去逛街了',
              ],
            },
          ),
          write(
            'Todavía no hice la tarea.',
            'wǒ hái méi xiě zuòyè',
            '我还没写作业',
            ['zh-hai-mei', 'zh-zuoye'],
            {
              id: 'zh.ex.neer4wypgw4t2y',
              accepted: ['wǒ hái méi xiě zuòyè ne', '我还没写作业呢'],
            },
          ),
        ],
      },
    ],
  },
};

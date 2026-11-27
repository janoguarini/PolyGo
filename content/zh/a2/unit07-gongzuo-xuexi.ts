import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U7 «Trabajo y estudios» (docs/ZH_A1_A2.md): el horario de trabajo, reuniones, exámenes,
 * los complementos de resultado (做完, 听懂, 写错, 准备好), el complemento de grado con 得
 * (说得很好) y la duración con 了 (学了两年).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const OFICINA = dialogue('zh.stim.a2-u7-kaihui', 'La gerente habla con Li Hua en la oficina.', [
  ['经理', '李华，下午三点开会，你准备好了吗？'],
  ['李华', '准备好了。'],
  ['经理', '好。你今天几点下班？'],
  ['李华', '六点。可是我的工作还没做完呢。'],
]);

const EXAMEN = reading(
  'zh.stim.a2-u7-kaoshi',
  'post',
  'Anna cuenta cómo le fue en un examen de chino.',
  ['今天考试了！', '老师说的中文我都听懂了。', '可是我写错了两个字。', '我很高兴！'],
  { from: '安娜' },
);

const COMPANEROS = dialogue(
  'zh.stim.a2-u7-tongshi',
  'Zhang Li le pregunta a Anna por su trabajo.',
  [
    ['张丽', '安娜，你的同事怎么样？'],
    ['安娜', '他们都很好。有问题，他们都帮我。'],
    ['张丽', '你中文说得很好！'],
    ['安娜', '谢谢！我学了一年，陈老师教得很好。'],
  ],
);

export const ZH_A2_U07: ZhUnitDef = {
  names: ['李华', '安娜', '张丽', '陈'],
  support: ['字', '快', '学', '跑'],
  unit: {
    position: 7,
    title: 'Trabajo y estudios',
    titleEn: '工作和学习 Work and study',
    description:
      'Horarios de trabajo, reuniones, exámenes, resultados de una acción y cómo se hace algo.',
    emoji: '💼',
    objective:
      'Puedes hablar de tu horario y tus compañeros, de exámenes y estudios, decir si terminaste o entendiste algo y contar cuánto tiempo estudiaste o trabajaste.',
    grammar: {
      title: 'Complementos de resultado · 得 de grado · duración con 了',
      explanation:
        'Un verbo o adjetivo después del verbo dice el resultado: 做完 (terminar), 听懂 (entender lo que se oye), 写错 (escribir mal), 准备好 (dejar listo); se niegan con 没 (没听懂). Cómo se hace algo: verbo + 得 + adjetivo (说得很好). Cuánto duró: verbo + 了 + tiempo (学了两年).',
      examples: [
        { target: '我做完作业了。', base: 'Terminé la tarea.' },
        { target: '你中文说得很好！', base: '¡Hablas muy bien chino!' },
        { target: '我学了两年中文。', base: 'Estudié chino dos años.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U7). Sin revisión nativa: revisar 得 con objeto (中文说得很好), 准备好了 y la posición de la duración.',
    },
    words: [
      w(
        'zh-shangban',
        '上班',
        'shàngbān',
        'ir a trabajar',
        '我九点上班。',
        'Entro a trabajar a las nueve.',
        ['work'],
        {
          acceptedTranslations: ['trabajar', 'entrar a trabajar'],
        },
      ),
      w(
        'zh-xiaban',
        '下班',
        'xiàbān',
        'salir del trabajo',
        '我六点下班。',
        'Salgo del trabajo a las seis.',
        ['work'],
        {
          acceptedTranslations: ['terminar de trabajar'],
        },
      ),
      w(
        'zh-tongshi',
        '同事',
        'tóngshì',
        'compañero/a de trabajo',
        '我的同事都很好。',
        'Mis compañeros de trabajo son muy buenos.',
        ['work', 'people'],
        {
          acceptedTranslations: ['colega', 'compañero de trabajo', 'compañera de trabajo'],
        },
      ),
      w(
        'zh-jingli',
        '经理',
        'jīnglǐ',
        'gerente',
        '经理在开会。',
        'La gerente está en una reunión.',
        ['work', 'people'],
        {
          acceptedTranslations: ['jefe', 'jefa', 'director'],
        },
      ),
      w(
        'zh-kaihui',
        '开会',
        'kāihuì',
        'tener una reunión',
        '下午三点开会。',
        'A las tres de la tarde hay reunión.',
        ['work'],
        {
          acceptedTranslations: ['reunirse'],
        },
      ),
      w(
        'zh-kaoshi',
        '考试',
        'kǎoshì',
        'examen',
        '明天我有考试。',
        'Mañana tengo examen.',
        ['school'],
        {
          acceptedTranslations: ['rendir', 'prueba'],
          emoji: '📝',
        },
      ),
      w(
        'zh-zhunbei',
        '准备',
        'zhǔnbèi',
        'preparar',
        '我在准备考试。',
        'Estoy preparando el examen.',
        ['verbs'],
        {
          acceptedTranslations: ['prepararse'],
        },
      ),
      w(
        'zh-biye',
        '毕业',
        'bìyè',
        'recibirse',
        '我哥哥明年毕业。',
        'Mi hermano se recibe el año que viene.',
        ['school'],
        {
          acceptedTranslations: ['graduarse', 'egresar'],
          emoji: '🎓',
        },
      ),
      w(
        'zh-jiao-ensenar',
        '教',
        'jiāo',
        'enseñar',
        '陈老师教我们中文。',
        'El profesor Chen nos enseña chino.',
        ['verbs', 'school'],
      ),
      w('zh-dong', '懂', 'dǒng', 'entender', '我没听懂。', 'No entendí.', ['verbs'], {
        acceptedTranslations: ['comprender'],
      }),
      w(
        'zh-wan-terminar',
        '完',
        'wán',
        'terminar',
        '我做完作业了。',
        'Terminé la tarea.',
        ['verbs'],
        {
          acceptedTranslations: ['acabar'],
        },
      ),
      w(
        'zh-cuo',
        '错',
        'cuò',
        'equivocado (mal)',
        '我写错了。',
        'Lo escribí mal.',
        ['adjectives'],
        {
          acceptedTranslations: ['equivocado', 'incorrecto', 'error'],
        },
      ),
      w(
        'zh-de-grado',
        '得',
        'de',
        'partícula de grado (得)',
        '你说得很好！',
        '¡Hablas muy bien!',
        ['particle', 'grammar'],
        {
          acceptedTranslations: ['partícula 得'],
        },
      ),
      w('zh-bang', '帮', 'bāng', 'ayudar', '你能帮我吗？', '¿Me puedes ayudar?', ['verbs']),
      w(
        'zh-wenti',
        '问题',
        'wèntí',
        'pregunta (problema)',
        '我有一个问题。',
        'Tengo una pregunta.',
        ['school', 'work'],
        {
          acceptedTranslations: ['pregunta', 'problema'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '上班和下班',
        objective: 'Hablar de tu horario y tu lugar de trabajo.',
        intro: {
          explanation:
            '上班 es ir a trabajar (o estar trabajando) y 下班, salir del trabajo: 我九点上班，六点下班. 同事 es el compañero de trabajo, 经理 el gerente o jefe, y 开会, tener una reunión.',
          examples: [
            { target: '我九点上班，六点下班。', base: 'Entro a las nueve y salgo a las seis.' },
            { target: '经理在开会。', base: 'La gerente está en una reunión.' },
          ],
        },
        takeaways: ['Dices tu horario con 上班 y 下班.', 'Hablas de tus compañeros y del gerente.'],
        exercises: [
          ex.translationChoice(
            '上班',
            'ir a trabajar',
            ['salir del trabajo', 'tener una reunión', 'descansar'],
            ['zh-shangban'],
            {
              id: 'zh.ex.kygkt8v3it06lj',
            },
          ),
          ex.translationChoice(
            '同事',
            'compañero/a de trabajo',
            ['compañero/a de clase', 'gerente', 'amigo/a'],
            ['zh-tongshi'],
            {
              id: 'zh.ex.2nd042orew625w',
            },
          ),
          ex.listenChoice(
            '我九点上班，六点下班。',
            ['我八点上班，六点下班。', '我九点上班，五点下班。', '我九点上班，七点下班。'],
            ['zh-shangban', 'zh-xiaban'],
            { id: 'zh.ex.f2f1kmafefb3jx' },
          ),
          ex.fillBlank(
            '经理正在___，请等一会儿。',
            'La gerente está en una reunión; espera un rato.',
            '开会',
            ['下班', '同事', '经理'],
            ['zh-kaihui', 'zh-jingli'],
            {
              id: 'zh.ex.3wi6zb6rn71xmv',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '我的___都很好。',
            'Mis compañeros de trabajo son todos muy buenos.',
            '同事',
            ['开会', '下班', '上班'],
            ['zh-tongshi'],
            {
              id: 'zh.ex.u3k0b4zb6qrlz6',
              skill: 'vocabulary',
            },
          ),
          tone('经理', 'jīnglǐ', ['jīnglí', 'jìnglǐ', 'jǐnglì'], ['zh-jingli'], {
            id: 'zh.ex.vsr1wd3d3p3g2h',
          }),
          ex.matchPairs(
            [
              ['上班', 'ir a trabajar'],
              ['下班', 'salir del trabajo'],
              ['同事', 'compañero/a de trabajo'],
              ['经理', 'gerente'],
            ],
            ['zh-shangban', 'zh-xiaban', 'zh-tongshi', 'zh-jingli'],
            { id: 'zh.ex.3j1eq69zz872i5' },
          ),
          reply(
            '你几点下班？',
            '¿A qué hora sales del trabajo? (Responde: a las seis.)',
            'liù diǎn xiàbān',
            '六点下班',
            ['zh-xiaban'],
            {
              id: 'zh.ex.1n8h9d8g4y7ecl',
              accepted: ['wǒ liù diǎn xiàbān', '我六点下班', 'liù diǎn', '六点'],
            },
          ),
          write(
            'Tengo una reunión a las tres de la tarde.',
            'wǒ xiàwǔ sān diǎn kāihuì',
            '我下午三点开会',
            ['zh-kaihui'],
            {
              id: 'zh.ex.bh3lhf23fr4g1r',
              accepted: ['xiàwǔ sān diǎn wǒ kāihuì', '下午三点我开会'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '考试',
        objective: 'Hablar de exámenes y estudios.',
        intro: {
          explanation:
            '考试 es el examen (y rendirlo). 准备 es preparar o prepararse: 准备考试. 教 es enseñar: 陈老师教中文. 毕业 es recibirse, terminar los estudios: 我明年毕业.',
          examples: [
            { target: '我在准备考试。', base: 'Estoy preparando el examen.' },
            { target: '陈老师教我们中文。', base: 'El profesor Chen nos enseña chino.' },
          ],
        },
        takeaways: ['Hablas de exámenes con 考试 y 准备.', 'Dices quién enseña con 教.'],
        exercises: [
          ex.translationChoice(
            '考试',
            'examen',
            ['tarea (de la escuela)', 'clase', 'pregunta'],
            ['zh-kaoshi'],
            { id: 'zh.ex.joomgm2pt9mee4' },
          ),
          ex.translationChoice(
            '毕业',
            'recibirse',
            ['empezar a estudiar', 'enseñar', 'preparar'],
            ['zh-biye'],
            { id: 'zh.ex.0r9t13o729td49' },
          ),
          ex.listenChoice(
            '我在准备考试。',
            ['我明天考试。', '我在准备聚会。', '我不准备考试。'],
            ['zh-zhunbei', 'zh-kaoshi'],
            {
              id: 'zh.ex.3qmyo5rshhf8wg',
            },
          ),
          ex.fillBlank(
            '陈老师___我们中文。',
            'El profesor Chen nos enseña chino.',
            '教',
            ['学', '说', '听'],
            ['zh-jiao-ensenar'],
            {
              id: 'zh.ex.nugbard66bpya6',
              explanation: '教 es enseñar (a alguien algo); 学 es aprender.',
            },
          ),
          ex.fillBlank(
            '我哥哥明年大学___。',
            'Mi hermano se recibe de la universidad el año que viene.',
            '毕业',
            ['考试', '上班', '准备'],
            ['zh-biye'],
            {
              id: 'zh.ex.26pnptguhctbhp',
              skill: 'vocabulary',
            },
          ),
          tone('考试', 'kǎoshì', ['kāoshì', 'káoshí', 'kàoshǐ'], ['zh-kaoshi'], {
            id: 'zh.ex.2v9bcmjnwq98au',
          }),
          ex.orderWords(
            '我 正在 准备 明天 的 考试。',
            'Estoy preparando el examen de mañana.',
            ['zh-zhunbei', 'zh-kaoshi'],
            {
              id: 'zh.ex.70jot7q9h6ygu8',
            },
          ),
          reply(
            '你什么时候毕业？',
            '¿Cuándo te recibes? (Responde que el año que viene.)',
            'míngnián bìyè',
            '明年毕业',
            ['zh-biye'],
            {
              id: 'zh.ex.k9wvk2aosv0epg',
              accepted: ['wǒ míngnián bìyè', '我明年毕业', 'míngnián', '明年'],
            },
          ),
          write('Mañana tengo examen.', 'míngtiān wǒ yǒu kǎoshì', '明天我有考试', ['zh-kaoshi'], {
            id: 'zh.ex.o1l54sslwmjhkg',
            accepted: [
              'wǒ míngtiān yǒu kǎoshì',
              '我明天有考试',
              'míngtiān wǒ kǎoshì',
              '明天我考试',
            ],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '做完、听懂、写错',
        objective: 'Decir el resultado de una acción.',
        intro: {
          explanation:
            'Después del verbo, otro verbo o adjetivo dice el resultado: 做完 (terminar de hacer), 听懂 (escuchar y entender), 看懂 (leer y entender), 写错 (escribir mal). Se niega con 没: 我没听懂.',
          examples: [
            { target: '我做完作业了。', base: 'Terminé la tarea.' },
            { target: '老师说的我没听懂。', base: 'No entendí lo que dijo el profesor.' },
          ],
        },
        takeaways: ['Dices el resultado con 完, 懂 y 错.', 'Lo niegas con 没.'],
        exercises: [
          ex.translationChoice(
            '懂',
            'entender',
            ['terminar', 'escuchar', 'preguntar'],
            ['zh-dong'],
            { id: 'zh.ex.yolds9ooh9vrn2' },
          ),
          ex.translationChoice(
            '错',
            'equivocado (mal)',
            ['bien', 'terminado', 'fácil'],
            ['zh-cuo'],
            { id: 'zh.ex.tpo6g6eaibc4oy' },
          ),
          ex.listenChoice('我没听懂。', ['我听懂了。', '我没看懂。', '我没听。'], ['zh-dong'], {
            id: 'zh.ex.qndfj9c122gl9i',
          }),
          ex.fillBlank(
            '我做___作业了，现在可以玩吗？',
            'Terminé la tarea; ¿ahora puedo jugar?',
            '完',
            ['懂', '错', '吧'],
            ['zh-wan-terminar', 'zh-zuoye'],
            {
              id: 'zh.ex.ygmwobj3alchip',
              explanation: '做完 es «terminar de hacer»: el resultado va después del verbo.',
            },
          ),
          ex.fillBlank(
            '这个字我写___了。',
            'Este carácter lo escribí mal.',
            '错',
            ['完', '懂', '多'],
            ['zh-cuo'],
            { id: 'zh.ex.f0g99k5guutvve' },
          ),
          tone('懂', 'dǒng', ['dōng', 'dóng', 'dòng'], ['zh-dong'], { id: 'zh.ex.duralwkog6wnn1' }),
          ex.matchPairs(
            [
              ['懂', 'entender'],
              ['完', 'terminar'],
              ['错', 'equivocado (mal)'],
              ['考试', 'examen'],
            ],
            ['zh-dong', 'zh-wan-terminar', 'zh-cuo', 'zh-kaoshi'],
            { id: 'zh.ex.emvf7uhybi3m4a' },
          ),
          reply(
            '你听懂了吗？',
            '¿Entendiste? (Responde que no entendiste.)',
            'méi tīng dǒng',
            '没听懂',
            ['zh-dong'],
            {
              id: 'zh.ex.e1514pozhjnl2j',
              accepted: [
                'wǒ méi tīng dǒng',
                '我没听懂',
                'méi dǒng',
                '没懂',
                'wǒ méi dǒng',
                '我没懂',
              ],
            },
          ),
          write(
            'Terminé la tarea.',
            'wǒ zuò wán zuòyè le',
            '我做完作业了',
            ['zh-wan-terminar', 'zh-zuoye'],
            {
              id: 'zh.ex.j6qcb2wdpfpjis',
              accepted: [
                'wǒ yǐjīng zuò wán zuòyè le',
                '我已经做完作业了',
                'wǒ xiě wán zuòyè le',
                '我写完作业了',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '说得很好',
        objective: 'Decir cómo se hace algo y pedir ayuda.',
        intro: {
          explanation:
            'Para decir cómo se hace algo: verbo + 得 + adjetivo: 他跑得很快 (corre rápido). Si hay objeto, va antes: 你中文说得很好. 帮 es ayudar y 问题, pregunta o problema: 我有一个问题.',
          examples: [
            { target: '你中文说得很好！', base: '¡Hablas muy bien chino!' },
            {
              target: '我有一个问题，你能帮我吗？',
              base: 'Tengo una pregunta, ¿me puedes ayudar?',
            },
          ],
        },
        takeaways: ['Dices cómo se hace algo con 得.', 'Pides ayuda con 帮.'],
        exercises: [
          ex.translationChoice('帮', 'ayudar', ['preguntar', 'enseñar', 'esperar'], ['zh-bang'], {
            id: 'zh.ex.9sdrdb00oaim61',
          }),
          ex.translationChoice(
            '问题',
            'pregunta (problema)',
            ['examen', 'respuesta', 'tarea (de la escuela)'],
            ['zh-wenti'],
            {
              id: 'zh.ex.tk1j87crcvdlg5',
            },
          ),
          ex.listenChoice(
            '你中文说得很好！',
            ['你英语说得很好！', '你中文说得不好。', '你中文写得很好！'],
            ['zh-de-grado'],
            {
              id: 'zh.ex.tmup75axwuzapl',
            },
          ),
          ex.fillBlank(
            '他跑___很快。',
            'Él corre muy rápido.',
            '得',
            ['的', '了', '过'],
            ['zh-de-grado', 'zh-paobu'],
            {
              id: 'zh.ex.2jobbd51ett36n',
              explanation:
                'Cómo se hace algo: verbo + 得 + adjetivo. 的 va antes de un sustantivo.',
            },
          ),
          ex.fillBlank(
            '我有一个___，你能帮我吗？',
            'Tengo una pregunta: ¿me puedes ayudar?',
            '问题',
            ['考试', '同事', '经理'],
            ['zh-wenti', 'zh-bang'],
            {
              id: 'zh.ex.bfgb3vsmewqd7z',
              skill: 'vocabulary',
            },
          ),
          tone('帮', 'bāng', ['báng', 'bǎng', 'bàng'], ['zh-bang'], { id: 'zh.ex.diweeg69wlc5wa' }),
          ex.orderWords(
            '陈老师 教 得 很 好。',
            'El profesor Chen enseña muy bien.',
            ['zh-de-grado', 'zh-jiao-ensenar'],
            {
              id: 'zh.ex.qe7l0bncwznnw7',
            },
          ),
          reply(
            '你中文说得怎么样？',
            '¿Qué tal hablas chino? (Responde que no muy bien.)',
            'shuō de bú tài hǎo',
            '说得不太好',
            ['zh-de-grado'],
            {
              id: 'zh.ex.sel7oxjvgnprhs',
              accepted: [
                'wǒ shuō de bú tài hǎo',
                '我说得不太好',
                'bú tài hǎo',
                '不太好',
                'wǒ Zhōngwén shuō de bú tài hǎo',
                '我中文说得不太好',
              ],
            },
          ),
          write('¿Me puedes ayudar?', 'nǐ néng bāng wǒ ma', '你能帮我吗', ['zh-bang'], {
            id: 'zh.ex.ez2fnmgir5n950',
            accepted: [
              'nǐ kěyǐ bāng wǒ ma',
              '你可以帮我吗',
              'nǐ néng bù néng bāng wǒ',
              '你能不能帮我',
            ],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '学了两年',
        objective: 'Contar cuánto tiempo hiciste algo y entender charlas de trabajo y estudio.',
        intro: {
          explanation:
            'Para decir cuánto duró algo: verbo + 了 + tiempo: 我学了两年中文 (estudié chino dos años). La duración va antes del objeto.',
          examples: [
            { target: '我学了两年中文。', base: 'Estudié chino dos años.' },
            { target: '我在这个公司工作了三年。', base: 'Trabajé tres años en esta empresa.' },
          ],
        },
        takeaways: [
          'Cuentas cuánto duró algo con verbo + 了 + tiempo.',
          'Entiendes charlas sobre trabajo y estudio.',
        ],
        exercises: [
          ex.listenChoice(
            '我学了两年中文。',
            ['我学了三年中文。', '我学了两年英语。', '我学了两个月中文。'],
            ['zh-le'],
            { id: 'zh.ex.6ouyilivqrp2q5' },
          ),
          ex.fillBlank(
            '我在这个公司工作___三年。',
            'Trabajé tres años en esta empresa.',
            '了',
            ['过', '得', '的'],
            ['zh-le', 'zh-gongsi'],
            {
              id: 'zh.ex.o2nguy5qk73w2d',
              explanation: 'Cuánto duró: verbo + 了 + tiempo.',
            },
          ),
          question(
            'zh.ex.26llpvl3ypf3yn',
            OFICINA,
            '¿Qué hay a las tres de la tarde?',
            'Una reunión',
            ['Un examen', 'La salida del trabajo', 'Una fiesta'],
            ['zh-kaihui'],
            'La gerente dice: «下午三点开会».',
          ),
          question(
            'zh.ex.ho61itdkqpz0hh',
            OFICINA,
            '¿Qué problema tiene Li Hua?',
            'Todavía no terminó su trabajo',
            ['No preparó la reunión', 'Sale tarde todos los días', 'No entiende a la gerente'],
            ['zh-wan-terminar', 'zh-xiaban'],
            'Li Hua dice: «我的工作还没做完呢».',
          ),
          question(
            'zh.ex.wnyzzxmap51kfd',
            EXAMEN,
            '¿Cómo le fue a Anna en el examen?',
            'Entendió todo, pero escribió mal dos caracteres',
            ['No entendió nada', 'Escribió todo bien, pero no entendió', 'No dio el examen'],
            ['zh-dong', 'zh-cuo'],
            'Anna escribe: «老师说的中文我都听懂了。可是我写错了两个字».',
          ),
          question(
            'zh.ex.2nc0i83b6iesz4',
            COMPANEROS,
            '¿Qué hacen los compañeros de Anna cuando ella tiene un problema?',
            'La ayudan',
            ['Le enseñan inglés', 'La llaman por teléfono', 'No la ayudan'],
            ['zh-tongshi', 'zh-bang'],
            'Anna dice: «有问题，他们都帮我».',
          ),
          question(
            'zh.ex.nrwcsmxcltl41l',
            COMPANEROS,
            '¿Cuánto estudió chino Anna y qué dice de su profesor?',
            'Un año; que el profesor Chen enseña muy bien',
            [
              'Tres años; que el profesor es estricto',
              'Un año; que no le gusta la clase',
              'Dos años; que el profesor habla rápido',
            ],
            ['zh-jiao-ensenar', 'zh-de-grado'],
            'Anna dice: «我学了一年，陈老师教得很好».',
          ),
          reply(
            '你学了几年中文？',
            '¿Cuántos años estudiaste chino? (Responde: un año.)',
            'wǒ xué le yì nián',
            '我学了一年',
            ['zh-le'],
            {
              id: 'zh.ex.iyckhsdsqrrxfn',
              accepted: [
                'yì nián',
                '一年',
                'xué le yì nián',
                '学了一年',
                'wǒ xué le yì nián Zhōngwén',
                '我学了一年中文',
              ],
            },
          ),
          write(
            'Trabajé dos años en un hospital.',
            'wǒ zài yīyuàn gōngzuò le liǎng nián',
            '我在医院工作了两年',
            ['zh-le'],
            {
              id: 'zh.ex.siwl1ocmmahltp',
            },
          ),
        ],
      },
    ],
  },
};

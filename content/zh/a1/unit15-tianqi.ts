import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write, ZH_A1_RATE } from '../helpers';

/**
 * Chino A1 U15 «Fechas, cumpleaños y clima» (docs/ZH_A1_A2.md): el año y el orden de la fecha,
 * cumpleaños, 了 de cambio (下雨了, 二十岁了), el clima y las estaciones (con el contraste de
 * hemisferios).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CLIMA = dialogue(
  'zh.stim.a1-u15-tianqi',
  'Li Hua y Zhang Li hablan del clima en dos ciudades.',
  [
    ['李华', '今天天气怎么样？'],
    ['张丽', '不太好。下雨了，有点儿冷。'],
    ['李华', '北京呢？'],
    ['张丽', '北京今天是晴天，可是很冷。'],
  ],
  ZH_A1_RATE,
);

const SALUDO = reading(
  'zh.stim.a1-u15-shengri',
  'message',
  'Un mensaje de cumpleaños.',
  ['李华，生日快乐！', '今天是十月五号，你二十岁了！', '晚上我们去饭馆吃饭。'],
  { from: '张丽', to: '李华' },
);

const ESTACIONES = dialogue(
  'zh.stim.a1-u15-jijie',
  'El profesor Chen y Anna hablan de las estaciones en Pekín y en la Argentina.',
  [
    ['陈老师', '安娜，阿根廷的夏天是几月？'],
    ['安娜', '是十二月、一月和二月。'],
    ['陈老师', '北京的夏天是六月、七月和八月。'],
    ['安娜', '我的生日是一月十号，是夏天！'],
  ],
  ZH_A1_RATE,
);

export const ZH_A1_U15: ZhUnitDef = {
  names: ['李华', '张丽', '安娜', '陈'],
  support: ['吃饭', '不太', '和'],
  unit: {
    position: 15,
    title: 'Fechas, cumpleaños y clima',
    titleEn: '天气 Dates and weather',
    description: 'El año y la fecha, cumpleaños, el clima, las estaciones y 了 de cambio.',
    emoji: '🌦️',
    objective:
      'Puedes decir fechas completas y tu cumpleaños, saludar en un cumpleaños, hablar del clima y de las estaciones.',
    grammar: {
      title: 'La fecha · 了 de cambio',
      explanation:
        'La fecha va de lo grande a lo chico: año, mes, día (十月五号). El año se lee cifra por cifra. 了 al final de la oración marca un cambio de situación: 下雨了 (se puso a llover), 我二十岁了 (ya tengo veinte).',
      examples: [
        { target: '今天是十月五号。', base: 'Hoy es 5 de octubre.' },
        { target: '下雨了！', base: '¡Se puso a llover!' },
        { target: '北京的冬天很冷。', base: 'El invierno en Pekín es muy frío.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U15). Sin revisión nativa: revisar 了 de cambio en 天气冷了 y la naturalidad de los diálogos del clima.',
    },
    words: [
      w('zh-nian', '年', 'nián', 'año', '我明年去北京。', 'El año que viene voy a Pekín.', [
        'time',
      ]),
      w(
        'zh-shengri',
        '生日',
        'shēngrì',
        'cumpleaños',
        '我的生日是五月八号。',
        'Mi cumpleaños es el 8 de mayo.',
        ['time'],
      ),
      w(
        'zh-shengri-kuaile',
        '生日快乐',
        'shēngrì kuàilè',
        '¡feliz cumpleaños!',
        '生日快乐！',
        '¡Feliz cumpleaños!',
        ['courtesy'],
        {
          acceptedTranslations: ['feliz cumpleaños'],
        },
      ),
      w(
        'zh-tianqi',
        '天气',
        'tiānqì',
        'clima (el tiempo)',
        '今天天气怎么样？',
        '¿Qué tiempo hace hoy?',
        ['weather'],
        {
          acceptedTranslations: ['clima', 'tiempo'],
        },
      ),
      w('zh-leng', '冷', 'lěng', 'frío', '今天很冷。', 'Hoy hace mucho frío.', ['weather'], {
        acceptedTranslations: ['hace frío'],
      }),
      w('zh-re', '热', 'rè', 'calor', '今天很热。', 'Hoy hace mucho calor.', ['weather'], {
        acceptedTranslations: ['hace calor', 'caluroso'],
      }),
      w('zh-xiayu', '下雨', 'xià yǔ', 'llover', '下雨了！', '¡Se puso a llover!', ['weather'], {
        acceptedTranslations: ['llueve', 'lluvia'],
        emoji: '🌧️',
      }),
      w(
        'zh-qingtian',
        '晴天',
        'qíngtiān',
        'día de sol',
        '今天是晴天。',
        'Hoy es un día de sol.',
        ['weather'],
        {
          acceptedTranslations: ['día soleado', 'soleado'],
          emoji: '☀️',
        },
      ),
      w('zh-chuntian', '春天', 'chūntiān', 'primavera', '我喜欢春天。', 'Me gusta la primavera.', [
        'seasons',
      ]),
      w('zh-xiatian', '夏天', 'xiàtiān', 'verano', '夏天很热。', 'En verano hace calor.', [
        'seasons',
      ]),
      w(
        'zh-qiutian',
        '秋天',
        'qiūtiān',
        'otoño',
        '北京的秋天很漂亮。',
        'El otoño de Pekín es muy lindo.',
        ['seasons'],
      ),
      w('zh-dongtian', '冬天', 'dōngtiān', 'invierno', '冬天很冷。', 'En invierno hace frío.', [
        'seasons',
      ]),
      w(
        'zh-qunian',
        '去年',
        'qùnián',
        'el año pasado',
        '我去年二十岁。',
        'El año pasado tenía veinte años.',
        ['time'],
        {
          acceptedTranslations: ['año pasado'],
        },
      ),
      w(
        'zh-mingnian',
        '明年',
        'míngnián',
        'el año que viene',
        '我明年去中国。',
        'El año que viene voy a China.',
        ['time'],
        {
          acceptedTranslations: ['año que viene', 'el próximo año'],
        },
      ),
      w(
        'zh-zhongwu',
        '中午',
        'zhōngwǔ',
        'mediodía',
        '中午我在家吃饭。',
        'Al mediodía como en casa.',
        ['time'],
        {
          acceptedTranslations: ['al mediodía'],
        },
      ),
      w(
        'zh-le',
        '了',
        'le',
        'partícula 了',
        '下雨了！',
        '¡Se puso a llover!',
        ['particle', 'grammar'],
        {
          acceptedTranslations: ['partícula de cambio', 'partícula de acción terminada'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '年、月、号',
        objective: 'Decir fechas completas y hablar de años.',
        intro: {
          explanation:
            'La fecha va de lo grande a lo chico: año (年), mes (月), día (号). El año se lee cifra por cifra: 2026年 es «èr líng èr liù nián». 去年 es el año pasado y 明年, el año que viene.',
          examples: [
            { target: '今天是十月五号。', base: 'Hoy es 5 de octubre.' },
            { target: '我明年去北京。', base: 'El año que viene voy a Pekín.' },
          ],
        },
        takeaways: ['Dices la fecha en orden: año, mes, día.', 'Usas 去年, 今年 y 明年.'],
        exercises: [
          ex.translationChoice('年', 'año', ['mes', 'día (del mes)', 'semana'], ['zh-nian'], {
            id: 'zh.ex.1lkmy8zajfqswp',
          }),
          ex.translationChoice(
            '去年',
            'el año pasado',
            ['el año que viene', 'este año', 'ayer'],
            ['zh-qunian'],
            {
              id: 'zh.ex.uf767wakvdawf9',
            },
          ),
          ex.listenChoice(
            '我明年去北京。',
            ['我今年去北京。', '我明天去北京。', '我明年来北京。'],
            ['zh-mingnian'],
            {
              id: 'zh.ex.pppo744hi5s40b',
            },
          ),
          ex.fillBlank(
            '今天是十月五___。',
            'Hoy es 5 de octubre.',
            '号',
            ['年', '岁', '点'],
            ['zh-hao-fecha', 'zh-nian'],
            {
              id: 'zh.ex.riowuwqkp281fd',
              explanation: 'El día del mes es 号: 十月五号. 年 es el año.',
            },
          ),
          ex.orderWords('我 明年 去 北京。', 'El año que viene voy a Pekín.', ['zh-mingnian'], {
            id: 'zh.ex.d1x6teqs6zz274',
          }),
          tone('年', 'nián', ['niān', 'niǎn', 'niàn'], ['zh-nian'], { id: 'zh.ex.bsxh7h8wobnmvs' }),
          ex.matchPairs(
            [
              ['年', 'año'],
              ['去年', 'el año pasado'],
              ['明年', 'el año que viene'],
              ['今年', 'este año'],
            ],
            ['zh-nian', 'zh-qunian', 'zh-mingnian', 'zh-jinnian'],
            { id: 'zh.ex.oc0at1j6y4n8vt' },
          ),
          reply(
            '今天几月几号？',
            '¿Qué fecha es hoy? (Responde: 5 de octubre.)',
            'shí yuè wǔ hào',
            '十月五号',
            ['zh-hao-fecha', 'zh-yue'],
            {
              id: 'zh.ex.r2vnp94vnxonig',
              accepted: [
                'jīntiān shí yuè wǔ hào',
                '今天十月五号',
                'jīntiān shì shí yuè wǔ hào',
                '今天是十月五号',
                '10月5号',
              ],
            },
          ),
          write(
            'El año que viene voy a China.',
            'míngnián wǒ qù Zhōngguó',
            '明年我去中国',
            ['zh-mingnian'],
            {
              id: 'zh.ex.1eftj9yool3713',
              accepted: ['wǒ míngnián qù Zhōngguó', '我明年去中国'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '生日快乐！',
        objective: 'Decir tu cumpleaños, saludar y contar un cambio con 了.',
        intro: {
          explanation:
            '生日 es «cumpleaños» y se saluda con 生日快乐！ 了 al final de la oración marca un cambio de situación: 我二十岁了 (ya tengo veinte, antes no).',
          examples: [
            { target: '生日快乐！', base: '¡Feliz cumpleaños!' },
            { target: '我今天二十岁了。', base: 'Hoy cumplo veinte años.' },
          ],
        },
        takeaways: ['Dices cuándo es tu cumpleaños.', 'Marcas un cambio con 了 al final.'],
        exercises: [
          ex.translationChoice('生日', 'cumpleaños', ['año', 'fiesta', 'semana'], ['zh-shengri'], {
            id: 'zh.ex.wwe54osdndm0ix',
          }),
          ex.listenChoice('生日快乐！', ['谢谢你！', '你好！', '再见！'], ['zh-shengri-kuaile'], {
            id: 'zh.ex.iu1yp276tsqdip',
          }),
          ex.translationChoice(
            'shēngrì kuàilè',
            '¡feliz cumpleaños!',
            ['¡buen viaje!', '¡buenísimo!', '¡encantado!'],
            ['zh-shengri-kuaile'],
            {
              id: 'zh.ex.vj696eeebm71ji',
              explanation: 'shēngrì kuàilè es 生日快乐: «feliz cumpleaños».',
            },
          ),
          ex.fillBlank(
            '我今天二十岁___！',
            '¡Hoy cumplo veinte años!',
            '了',
            ['吗', '呢', '的'],
            ['zh-le'],
            {
              id: 'zh.ex.5u7weakj0khex5',
              explanation: '了 al final marca el cambio: ahora tengo veinte (antes no).',
            },
          ),
          ex.fillBlank(
            '你的___是几月几号？',
            '¿Cuándo es tu cumpleaños?',
            '生日',
            ['名字', '手机', '颜色'],
            ['zh-shengri'],
            {
              id: 'zh.ex.qd0uwlh8fgh2ff',
              skill: 'vocabulary',
            },
          ),
          ex.orderWords(
            '我 的 生日 是 五月 八号。',
            'Mi cumpleaños es el 8 de mayo.',
            ['zh-shengri'],
            { id: 'zh.ex.vc3gvrtro133uv' },
          ),
          tone('生日', 'shēngrì', ['shèngrì', 'shēngrí', 'shěngrì'], ['zh-shengri'], {
            id: 'zh.ex.zzyl9p3qa7xlgw',
          }),
          reply(
            '你的生日是几月几号？',
            '¿Cuándo es tu cumpleaños? (Responde: el 3 de abril.)',
            'wǒ de shēngrì shì sì yuè sān hào',
            '我的生日是四月三号',
            ['zh-shengri'],
            {
              id: 'zh.ex.m5yfiz75q5hktz',
              accepted: [
                'sì yuè sān hào',
                '四月三号',
                'shì sì yuè sān hào',
                '是四月三号',
                '4月3号',
              ],
            },
          ),
          write('¡Feliz cumpleaños!', 'shēngrì kuàilè', '生日快乐', ['zh-shengri-kuaile'], {
            id: 'zh.ex.xv8eaurrwvysbb',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '天气怎么样？',
        objective: 'Preguntar y decir qué tiempo hace.',
        intro: {
          explanation:
            'Para preguntar por el clima: 天气怎么样？ Se responde con un adjetivo: 很冷, 很热 (no hace falta un verbo «hacer»). 下雨 es llover y 下雨了, «se puso a llover». 晴天 es un día de sol.',
          examples: [
            { target: '今天天气怎么样？——很热。', base: '¿Qué tiempo hace hoy? — Mucho calor.' },
            { target: '下雨了！', base: '¡Se puso a llover!' },
          ],
        },
        takeaways: ['Preguntas por el clima con 天气怎么样？', 'Dices frío, calor, sol y lluvia.'],
        exercises: [
          ex.translationChoice(
            '天气',
            'clima (el tiempo)',
            ['cumpleaños', 'año', 'color'],
            ['zh-tianqi'],
            {
              id: 'zh.ex.6huskdf94em9kp',
            },
          ),
          ex.translationChoice('冷', 'frío', ['calor', 'día de sol', 'llover'], ['zh-leng'], {
            id: 'zh.ex.jtfm6y6kmnkivf',
          }),
          ex.listenChoice('今天很热。', ['今天很冷。', '明天很热。', '今天下雨了。'], ['zh-re'], {
            id: 'zh.ex.6iewk4xkum5gcb',
          }),
          ex.imageChoice('☀️', '晴天', ['下雨', '冷', '生日'], ['zh-qingtian'], {
            id: 'zh.ex.jvreyelkh0u24t',
          }),
          ex.fillBlank(
            '天气冷___。',
            'Ya empezó el frío.',
            '了',
            ['吗', '的', '很'],
            ['zh-leng', 'zh-le'],
            {
              id: 'zh.ex.z87985mpx7168i',
              explanation: 'Con 了 al final se cuenta un cambio: antes no hacía frío y ahora sí.',
            },
          ),
          ex.fillBlank(
            '今天是___，不冷也不热。',
            'Hoy es un día de sol: ni frío ni calor.',
            '晴天',
            ['下雨', '生日', '去年'],
            ['zh-qingtian'],
            {
              id: 'zh.ex.4a0ju5oa9x97on',
              skill: 'vocabulary',
            },
          ),
          tone('热', 'rè', ['rē', 'ré', 'rě'], ['zh-re'], { id: 'zh.ex.nc46g7iabrx3pi' }),
          ex.matchPairs(
            [
              ['冷', 'frío'],
              ['热', 'calor'],
              ['下雨', 'llover'],
              ['晴天', 'día de sol'],
            ],
            ['zh-leng', 'zh-re', 'zh-xiayu', 'zh-qingtian'],
            { id: 'zh.ex.7gt93l2kw2e06j' },
          ),
          reply(
            '今天天气怎么样？',
            '¿Qué tiempo hace hoy? (Responde que hace mucho frío.)',
            'hěn lěng',
            '很冷',
            ['zh-tianqi', 'zh-leng'],
            {
              id: 'zh.ex.q59uldwloghu7k',
              accepted: [
                'jīntiān hěn lěng',
                '今天很冷',
                'tiānqì hěn lěng',
                '天气很冷',
                'jīntiān tiānqì hěn lěng',
                '今天天气很冷',
                'fēicháng lěng',
                '非常冷',
              ],
            },
          ),
          write('¡Se puso a llover!', 'xià yǔ le', '下雨了', ['zh-xiayu', 'zh-le'], {
            id: 'zh.ex.e7gknjygex2g89',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '春夏秋冬',
        objective: 'Hablar de las estaciones.',
        intro: {
          explanation:
            'Las estaciones terminan en 天: 春天, 夏天, 秋天, 冬天. Ojo con el hemisferio: en Pekín el verano es en junio, julio y agosto, y en la Argentina, en diciembre, enero y febrero.',
          examples: [
            { target: '北京的冬天很冷。', base: 'El invierno en Pekín es muy frío.' },
            { target: '我喜欢秋天。', base: 'Me gusta el otoño.' },
          ],
        },
        takeaways: ['Nombras las cuatro estaciones.', 'Cuentas cómo es el clima en cada una.'],
        exercises: [
          ex.translationChoice(
            '夏天',
            'verano',
            ['invierno', 'primavera', 'otoño'],
            ['zh-xiatian'],
            { id: 'zh.ex.xj44zx7cxnk38b' },
          ),
          ex.translationChoice(
            '冬天',
            'invierno',
            ['verano', 'otoño', 'primavera'],
            ['zh-dongtian'],
            { id: 'zh.ex.z5x5fuygo6vyk7' },
          ),
          ex.listenChoice(
            '北京的冬天很冷。',
            ['北京的夏天很热。', '北京的冬天不冷。', '北京的秋天很冷。'],
            ['zh-dongtian', 'zh-leng'],
            { id: 'zh.ex.32u8lq5ot8o0a4' },
          ),
          ex.fillBlank(
            '___很热，我常常去游泳。',
            'En verano hace mucho calor; voy seguido a nadar.',
            '夏天',
            ['冬天', '秋天', '去年'],
            ['zh-xiatian', 'zh-re'],
            { id: 'zh.ex.lhsz8oyuw50zxq', skill: 'vocabulary' },
          ),
          ex.matchPairs(
            [
              ['春天', 'primavera'],
              ['夏天', 'verano'],
              ['秋天', 'otoño'],
              ['冬天', 'invierno'],
            ],
            ['zh-chuntian', 'zh-xiatian', 'zh-qiutian', 'zh-dongtian'],
            { id: 'zh.ex.3kyd62aynguopv' },
          ),
          tone('秋天', 'qiūtiān', ['qiútián', 'qiǔtiǎn', 'qiùtiàn'], ['zh-qiutian'], {
            id: 'zh.ex.lna528jx4nnc51',
          }),
          question(
            'zh.ex.yji354qv665u4t',
            ESTACIONES,
            '¿Qué meses son verano en la Argentina, según Anna?',
            'Diciembre, enero y febrero',
            ['Junio, julio y agosto', 'Marzo, abril y mayo', 'Octubre, noviembre y diciembre'],
            ['zh-xiatian'],
            'Anna dice: «是十二月、一月和二月».',
          ),
          question(
            'zh.ex.3xjpdide1gmbe3',
            ESTACIONES,
            '¿Cuándo es el cumpleaños de Anna?',
            'El 10 de enero, en verano',
            [
              'El 10 de junio, en invierno',
              'El 1 de octubre, en primavera',
              'El 10 de agosto, en verano',
            ],
            ['zh-shengri', 'zh-xiatian'],
            'Anna dice: «我的生日是一月十号，是夏天！».',
          ),
          reply(
            '你喜欢夏天吗？',
            '¿Te gusta el verano? (Responde que no, que te gusta el invierno.)',
            'bù xǐhuan, wǒ xǐhuan dōngtiān',
            '不喜欢，我喜欢冬天',
            ['zh-xiatian', 'zh-dongtian'],
            {
              id: 'zh.ex.po1cledncain5o',
              accepted: [
                'wǒ xǐhuan dōngtiān',
                '我喜欢冬天',
                'bù, wǒ xǐhuan dōngtiān',
                '不，我喜欢冬天',
              ],
            },
          ),
          write(
            'En invierno hace frío.',
            'dōngtiān hěn lěng',
            '冬天很冷',
            ['zh-dongtian', 'zh-leng'],
            { id: 'zh.ex.fh7ipvj7jczvry' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '中午',
        objective:
          'Ubicar actividades en el día y entender mensajes sobre el clima y un cumpleaños.',
        intro: {
          explanation:
            '中午 es el mediodía. Las palabras de tiempo van antes del verbo, al principio o después de la persona: 中午我在家吃饭 o 我中午在家吃饭.',
          examples: [
            { target: '中午我在家吃饭。', base: 'Al mediodía como en casa.' },
            { target: '明天中午很热。', base: 'Mañana al mediodía hace mucho calor.' },
          ],
        },
        takeaways: [
          'Usas 中午 y otras palabras de tiempo antes del verbo.',
          'Entiendes un mensaje y una charla sobre el clima.',
        ],
        exercises: [
          ex.translationChoice(
            '中午',
            'mediodía',
            ['por la mañana', 'por la noche', 'por la tarde'],
            ['zh-zhongwu'],
            {
              id: 'zh.ex.bxek19fyllmxj0',
            },
          ),
          ex.listenChoice(
            '中午我在家吃饭。',
            ['晚上我在家吃饭。', '中午我在学校吃饭。', '早上我在家吃饭。'],
            ['zh-zhongwu'],
            {
              id: 'zh.ex.7xx2pd2kkan32z',
            },
          ),
          ex.fillBlank(
            '___我们在饭馆吃饭。',
            'Al mediodía comemos en un restaurante.',
            '中午',
            ['去年', '晴天', '生日'],
            ['zh-zhongwu'],
            {
              id: 'zh.ex.st3ufo47watyoz',
              skill: 'vocabulary',
            },
          ),
          question(
            'zh.ex.ddjmfeu9maex0f',
            CLIMA,
            '¿Qué tiempo hace donde está Zhang Li?',
            'Llueve y hace un poco de frío',
            ['Hay sol y hace calor', 'Hay sol y hace frío', 'Hace mucho calor'],
            ['zh-xiayu', 'zh-leng'],
            'Zhang Li dice: «下雨了，有点儿冷».',
          ),
          question(
            'zh.ex.in6796dumiqjjz',
            CLIMA,
            '¿Cómo está el tiempo en Pekín?',
            'Hay sol, pero hace mucho frío',
            ['Llueve y hace frío', 'Hay sol y hace calor', 'Llueve y hace calor'],
            ['zh-qingtian', 'zh-leng'],
            'Zhang Li dice: «北京今天是晴天，可是很冷».',
          ),
          question(
            'zh.ex.fjw4x72fxtyclt',
            SALUDO,
            '¿Cuántos años cumple Li Hua?',
            'Veinte',
            ['Doce', 'Dos', 'Veintidós'],
            ['zh-shengri', 'zh-le'],
            'El mensaje dice: «你二十岁了！».',
          ),
          question(
            'zh.ex.gqbnfswayf98sj',
            SALUDO,
            '¿Qué van a hacer por la noche?',
            'Comer en un restaurante',
            ['Cocinar en casa', 'Ir a la escuela', 'Mirar la tele'],
            ['zh-shengri-kuaile'],
            'El mensaje dice: «晚上我们去饭馆吃饭».',
          ),
          reply(
            '明天中午你在哪儿吃饭？',
            '¿Dónde comes mañana al mediodía? (Responde que en casa.)',
            'wǒ zài jiā chīfàn',
            '我在家吃饭',
            ['zh-zhongwu'],
            {
              id: 'zh.ex.4phdmi2ihxx722',
              accepted: [
                'zài jiā',
                '在家',
                'zài jiā chīfàn',
                '在家吃饭',
                'zhōngwǔ wǒ zài jiā chīfàn',
                '中午我在家吃饭',
              ],
            },
          ),
          write('Al mediodía hace calor.', 'zhōngwǔ hěn rè', '中午很热', ['zh-zhongwu', 'zh-re'], {
            id: 'zh.ex.ozlv8j3u3ebea4',
          }),
        ],
      },
    ],
  },
};

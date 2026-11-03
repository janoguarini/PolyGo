import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import { pinyinVariants } from '../../path';
import type { ExerciseDef, UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('zh'));

const w = (
  id: string,
  text: string,
  romanization: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, romanization, translation, exampleEn, exampleEs, tags, ...extra });

/** Escuchar y elegir el pinyin con el tono correcto (ver unit01-nihao.ts). */
const tone = (
  hanzi: string,
  pinyin: string,
  others: string[],
  words: string[],
  explanation?: string,
): ExerciseDef => ({
  type: 'listen_choice',
  skill: 'listening',
  prompt: 'Escuchá y elegí el tono correcto',
  payload: { type: 'listen_choice', audioText: hanzi, options: [pinyin, ...others] },
  answer: pinyin,
  words,
  recommendedSeconds: 15,
  ...(explanation ? { explanation } : {}),
});

/** Escribir en pinyin: también vale sin espacios, en caracteres y las variantes indicadas. */
const write = (
  source: string,
  pinyin: string,
  hanzi: string,
  words: string[],
  extra: { accepted?: string[]; explanation?: string } = {},
) =>
  ex.translateWrite(source, pinyin, words, {
    acceptedAnswers: [...pinyinVariants(pinyin, hanzi), ...(extra.accepted ?? [])],
    ...(extra.explanation ? { explanation: extra.explanation } : {}),
  });

/**
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos, 两点 y el
 * orden de las fechas).
 */
export const unit09: UnitDef = {
  position: 9,
  title: 'La hora y los días',
  titleEn: '时间',
  description: 'Preguntar y decir la hora con 几点, los días con 星期 y la fecha con 月 y 号.',
  emoji: '🕗',
  objective:
    'Podés preguntar y decir la hora (现在几点？八点半), decir a qué hora hacés algo, nombrar los días con 星期 y decir la fecha.',
  grammar: {
    title: '几点, 星期几 y 几月几号',
    explanation:
      'La hora es número + 点: 八点 (las ocho), 八点半 (ocho y media), 八点十分 (ocho y diez). Las dos son 两点, no 二点. Los días son 星期 + número: 星期一 es lunes; el domingo es 星期天. Para preguntar se pone 几 donde va el número: 几点？星期几？几月几号？',
    examples: [
      { target: '现在几点？现在八点半。', base: '¿Qué hora es? Son las ocho y media.' },
      { target: '今天星期几？今天星期一。', base: '¿Qué día es hoy? Hoy es lunes.' },
      { target: '今天五月三号。', base: 'Hoy es 3 de mayo.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, 两点 y el orden de las fechas.',
  },
  words: [
    w('zh-xianzai', '现在', 'xiànzài', 'ahora', '现在几点？', '¿Qué hora es (ahora)?', ['time']),
    w(
      'zh-jidian',
      '几点',
      'jǐ diǎn',
      '¿qué hora?',
      '现在几点？',
      '¿Qué hora es?',
      ['time', 'questions'],
      {
        acceptedTranslations: ['¿a qué hora?'],
        emoji: '🕗',
      },
    ),
    w('zh-dian', '点', 'diǎn', 'hora (del reloj)', '现在八点。', 'Son las ocho.', ['time'], {
      acceptedTranslations: ['en punto'],
    }),
    w('zh-ban', '半', 'bàn', 'media (hora)', '现在三点半。', 'Son las tres y media.', ['time'], {
      acceptedTranslations: ['y media', 'mitad'],
    }),
    w('zh-fen', '分', 'fēn', 'minutos', '八点十分', 'las ocho y diez', ['time'], {
      acceptedTranslations: ['minuto'],
    }),
    w('zh-xingqi', '星期', 'xīngqī', 'semana', '一个星期', 'una semana', ['time']),
    w('zh-xingqiyi', '星期一', 'xīngqīyī', 'lunes', '今天星期一。', 'Hoy es lunes.', ['days']),
    w('zh-xingqiwu', '星期五', 'xīngqīwǔ', 'viernes', '明天星期五。', 'Mañana es viernes.', [
      'days',
    ]),
    w(
      'zh-xingqiliu',
      '星期六',
      'xīngqīliù',
      'sábado',
      '星期六我在家。',
      'El sábado estoy en casa.',
      ['days'],
    ),
    w('zh-xingqitian', '星期天', 'xīngqītiān', 'domingo', '星期天我睡觉。', 'El domingo duermo.', [
      'days',
    ]),
    w('zh-jintian', '今天', 'jīntiān', 'hoy', '今天星期一。', 'Hoy es lunes.', ['time'], {
      emoji: '📅',
    }),
    w(
      'zh-mingtian',
      '明天',
      'míngtiān',
      'mañana (el día siguiente)',
      '明天星期六。',
      'Mañana es sábado.',
      ['time'],
    ),
    w('zh-zuotian', '昨天', 'zuótiān', 'ayer', '昨天星期天。', 'Ayer fue domingo.', ['time']),
    w(
      'zh-zhoumo',
      '周末',
      'zhōumò',
      'fin de semana',
      '周末我在家。',
      'El fin de semana estoy en casa.',
      ['time'],
    ),
    w('zh-yue', '月', 'yuè', 'mes', '五月', 'mayo (el mes cinco)', ['time']),
    w('zh-hao-fecha', '号', 'hào', 'día (del mes)', '今天五月三号。', 'Hoy es 3 de mayo.', [
      'time',
    ]),
  ],
  lessons: [
    {
      title: '现在几点？',
      objective: 'Preguntar y decir la hora en punto.',
      intro: {
        explanation:
          '现在 (xiànzài) es «ahora». Para preguntar la hora: 现在几点？ Se responde con número + 点: 现在八点. No hace falta verbo. Las dos son 两点, no 二点.',
        examples: [
          { target: '现在几点？', base: '¿Qué hora es?' },
          { target: '现在两点。', base: 'Son las dos.', note: 'liǎng diǎn' },
        ],
      },
      takeaways: ['Preguntás la hora con 现在几点？', 'Decís la hora con número + 点 (y 两点).'],
      exercises: [
        ex.translationChoice(
          '现在',
          'ahora',
          ['hoy', 'mañana (el día siguiente)', 'ayer'],
          ['zh-xianzai'],
        ),
        ex.translationChoice(
          '几点',
          '¿qué hora?',
          ['¿cuántos?', '¿qué edad?', '¿dónde?'],
          ['zh-jidian'],
        ),
        tone('点', 'diǎn', ['diān', 'dián', 'diàn'], ['zh-dian']),
        ex.listenChoice(
          '现在八点。',
          ['现在七点。', '现在三点。', '现在十点。'],
          ['zh-xianzai', 'zh-ba', 'zh-dian'],
        ),
        ex.fillBlank(
          '现在___点。',
          'Son las dos.',
          '两',
          ['二', '几', '个'],
          ['zh-xianzai', 'zh-liang', 'zh-dian'],
          { explanation: 'Para la hora, las dos son 两点, no 二点.' },
        ),
        ex.orderWords('现在 几 点？', '¿Qué hora es?', ['zh-xianzai', 'zh-jidian']),
        write('Son las ocho.', 'xiànzài bā diǎn', '现在八点', ['zh-xianzai', 'zh-ba', 'zh-dian'], {
          accepted: ['bā diǎn', '八点'],
        }),
        write('¿Qué hora es?', 'xiànzài jǐ diǎn', '现在几点', ['zh-xianzai', 'zh-jidian'], {
          accepted: ['jǐ diǎn', '几点'],
        }),
      ],
    },
    {
      title: '半和分',
      objective: 'Decir la hora con media y con minutos.',
      intro: {
        explanation:
          'Y media es 半 (bàn): 三点半. Los minutos son número + 分 (fēn): 八点十分 «ocho y diez». La hora siempre va antes que los minutos.',
        examples: [
          { target: '现在三点半。', base: 'Son las tres y media.' },
          { target: '八点十分', base: 'las ocho y diez' },
        ],
      },
      takeaways: ['Decís y media con 半.', 'Decís minutos con 分.'],
      exercises: [
        ex.translationChoice(
          '半',
          'media (hora)',
          ['minutos', 'hora (del reloj)', 'semana'],
          ['zh-ban'],
        ),
        ex.translationChoice('分', 'minutos', ['media (hora)', 'mes', 'hoy'], ['zh-fen']),
        tone('半', 'bàn', ['bān', 'bán', 'bǎn'], ['zh-ban']),
        ex.listenChoice(
          '现在三点半。',
          ['现在三点。', '现在四点半。', '现在三点十分。'],
          ['zh-dian', 'zh-ban'],
        ),
        ex.fillBlank(
          '八点十___',
          'las ocho y diez',
          '分',
          ['点', '半', '号'],
          ['zh-ba', 'zh-dian', 'zh-fen'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('现在 九 点 半。', 'Son las nueve y media.', [
          'zh-xianzai',
          'zh-jiu',
          'zh-ban',
        ]),
        write(
          'Son las tres y media.',
          'xiànzài sān diǎn bàn',
          '现在三点半',
          ['zh-xianzai', 'zh-san', 'zh-ban'],
          { accepted: ['sān diǎn bàn', '三点半'] },
        ),
        write('las seis y cinco', 'liù diǎn wǔ fēn', '六点五分', ['zh-liu', 'zh-dian', 'zh-fen']),
      ],
    },
    {
      title: '几点…？',
      objective: 'Decir a qué hora hacés algo.',
      intro: {
        explanation:
          'Para decir a qué hora hacés algo, la hora va antes del verbo, como las demás palabras de tiempo: 我七点起床 «me levanto a las siete». Para preguntar: 你几点工作？',
        examples: [
          { target: '我七点起床。', base: 'Me levanto a las siete.' },
          { target: '你几点工作？', base: '¿A qué hora trabajás?' },
        ],
      },
      takeaways: [
        'Decís a qué hora hacés algo con la hora antes del verbo.',
        'Preguntás con 几点 + verbo.',
      ],
      exercises: [
        ex.listenChoice(
          '我七点起床。',
          ['我六点起床。', '我七点睡觉。', '我七点半起床。'],
          ['zh-qi', 'zh-dian', 'zh-qichuang'],
        ),
        ex.listenChoice(
          '你几点工作？',
          ['你几岁？', '你几点吃早饭？', '你工作吗？'],
          ['zh-jidian', 'zh-gongzuo'],
        ),
        ex.fillBlank(
          '我七点___。',
          'Me levanto a las siete.',
          '起床',
          ['早饭', '电视', '星期'],
          ['zh-qi', 'zh-dian', 'zh-qichuang'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('你 几 点 吃 早饭？', '¿A qué hora desayunás?', [
          'zh-jidian',
          'zh-chi',
          'zh-zaofan',
        ]),
        ex.orderWords(
          '我 九 点 工作。',
          'Trabajo a las nueve.',
          ['zh-jiu', 'zh-dian', 'zh-gongzuo'],
          {
            explanation: 'La hora va antes del verbo: 我九点工作.',
          },
        ),
        write('Me levanto a las siete.', 'wǒ qī diǎn qǐchuáng', '我七点起床', [
          'zh-qi',
          'zh-dian',
          'zh-qichuang',
        ]),
        write('¿A qué hora trabajás?', 'nǐ jǐ diǎn gōngzuò', '你几点工作', [
          'zh-ni',
          'zh-jidian',
          'zh-gongzuo',
        ]),
      ],
    },
    {
      title: '星期几？',
      objective: 'Nombrar los días de la semana.',
      intro: {
        explanation:
          'Los días son 星期 (xīngqī, «semana») + número: 星期一 lunes, 星期二 martes… hasta 星期六 sábado. El domingo es 星期天. Para preguntar el día: 今天星期几？ (sin verbo).',
        examples: [
          { target: '今天星期几？', base: '¿Qué día es hoy?' },
          { target: '今天星期一。', base: 'Hoy es lunes.' },
        ],
      },
      takeaways: ['Nombrás los días con 星期 + número.', 'Sabés que el domingo es 星期天.'],
      exercises: [
        ex.translationChoice('星期一', 'lunes', ['martes', 'viernes', 'domingo'], ['zh-xingqiyi']),
        ex.translationChoice('星期天', 'domingo', ['sábado', 'lunes', 'semana'], ['zh-xingqitian']),
        ex.translationChoice('星期', 'semana', ['mes', 'hoy', 'fin de semana'], ['zh-xingqi']),
        ex.listenChoice('星期五', ['星期四', '星期一', '星期六'], ['zh-xingqiwu']),
        ex.matchPairs(
          [
            ['星期一', 'lunes'],
            ['星期五', 'viernes'],
            ['星期六', 'sábado'],
            ['星期天', 'domingo'],
          ],
          ['zh-xingqiyi', 'zh-xingqiwu', 'zh-xingqiliu', 'zh-xingqitian'],
        ),
        ex.fillBlank(
          '今天星期___？',
          '¿Qué día es hoy?',
          '几',
          ['什么', '哪', '谁'],
          ['zh-jintian', 'zh-xingqi', 'zh-ji'],
          { explanation: 'Se pregunta con 几 donde va el número: 星期几？' },
        ),
        write('Hoy es lunes.', 'jīntiān xīngqīyī', '今天星期一', ['zh-jintian', 'zh-xingqiyi'], {
          accepted: ['jīntiān shì xīngqīyī', '今天是星期一'],
        }),
        write(
          '¿Qué día es hoy?',
          'jīntiān xīngqī jǐ',
          '今天星期几',
          ['zh-jintian', 'zh-xingqi', 'zh-ji'],
          {
            accepted: ['jīntiān xīngqījǐ'],
          },
        ),
      ],
    },
    {
      title: '今天、明天、昨天',
      objective: 'Hablar de hoy, mañana, ayer y la fecha.',
      intro: {
        explanation:
          '今天 (jīntiān) hoy, 明天 (míngtiān) mañana, 昨天 (zuótiān) ayer: los tres terminan en 天 «día». La fecha va de grande a chico: mes + 月, día + 号. 五月三号 es «3 de mayo».',
        examples: [
          { target: '明天星期六。', base: 'Mañana es sábado.' },
          { target: '今天五月三号。', base: 'Hoy es 3 de mayo.' },
        ],
      },
      takeaways: ['Distinguís 今天, 明天 y 昨天.', 'Decís la fecha con 月 y 号.'],
      exercises: [
        ex.translationChoice(
          '明天',
          'mañana (el día siguiente)',
          ['ayer', 'hoy', 'a la mañana'],
          ['zh-mingtian'],
          { explanation: '明天 es el día siguiente; «a la mañana» es 早上.' },
        ),
        ex.translationChoice(
          '昨天',
          'ayer',
          ['mañana (el día siguiente)', 'hoy', 'ahora'],
          ['zh-zuotian'],
        ),
        ex.translationChoice('周末', 'fin de semana', ['semana', 'mes', 'domingo'], ['zh-zhoumo']),
        tone('明天', 'míngtiān', ['mīngtiān', 'mǐngtiān', 'mìngtiān'], ['zh-mingtian']),
        ex.listenChoice(
          '今天五月三号。',
          ['今天五月四号。', '今天三月五号。', '明天五月三号。'],
          ['zh-jintian', 'zh-yue', 'zh-hao-fecha'],
        ),
        ex.orderWords('周末 我 在家。', 'El fin de semana estoy en casa.', [
          'zh-zhoumo',
          'zh-zaijia',
        ]),
        write(
          'Mañana es sábado.',
          'míngtiān xīngqīliù',
          '明天星期六',
          ['zh-mingtian', 'zh-xingqiliu'],
          {
            accepted: ['míngtiān shì xīngqīliù', '明天是星期六'],
          },
        ),
        write(
          'Hoy es 3 de mayo.',
          'jīntiān wǔ yuè sān hào',
          '今天五月三号',
          ['zh-jintian', 'zh-wu', 'zh-yue', 'zh-san', 'zh-hao-fecha'],
          { accepted: ['jīntiān wǔyuè sān hào', 'jīntiān shì wǔ yuè sān hào', '今天是五月三号'] },
        ),
      ],
    },
  ],
};

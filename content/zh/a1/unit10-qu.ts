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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos y el orden
 * 坐 + vehículo + 去 + lugar). 怎么 entra acá con 怎么去; la unidad 12 lo amplía.
 */
export const unit10: UnitDef = {
  position: 10,
  title: 'Ir a lugares',
  titleEn: '去',
  description:
    'Decir adónde vas con 去, lugares de la ciudad, cómo vas (坐地铁, 走路) y si queda cerca o lejos.',
  emoji: '🚇',
  objective:
    'Podés decir adónde vas (我去商店), cómo vas (我坐地铁去学校), preguntar 怎么去？ y decir si un lugar queda cerca (近) o lejos (远).',
  grammar: {
    title: '去 + lugar y 坐 + vehículo + 去',
    explanation:
      '去 (qù) es «ir» y va directo con el lugar, sin preposición: 我去学校. El medio de transporte va antes: 坐 (zuò, «tomar, ir sentado en») + vehículo + 去 + lugar: 我坐地铁去学校. Para preguntar cómo: 你怎么去？',
    examples: [
      { target: '你去哪儿？我去商店。', base: '¿Adónde vas? Voy a la tienda.' },
      { target: '我坐地铁去学校。', base: 'Voy a la escuela en subte.' },
      { target: '医院远吗？不远，很近。', base: '¿El hospital queda lejos? No, queda muy cerca.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos y orden 坐 + vehículo + 去.',
  },
  words: [
    w('zh-qu', '去', 'qù', 'ir', '我去学校。', 'Voy a la escuela.', ['verbs']),
    w('zh-lai', '来', 'lái', 'venir', '你来我家吗？', '¿Venís a mi casa?', ['verbs']),
    w('zh-shangdian', '商店', 'shāngdiàn', 'tienda', '我去商店。', 'Voy a la tienda.', ['places'], {
      emoji: '🏬',
    }),
    w(
      'zh-chaoshi',
      '超市',
      'chāoshì',
      'supermercado',
      '超市很近。',
      'El supermercado queda muy cerca.',
      ['places'],
      { emoji: '🛒' },
    ),
    w(
      'zh-yiyuan',
      '医院',
      'yīyuàn',
      'hospital',
      '医院在哪儿？',
      '¿Dónde está el hospital?',
      ['places'],
      {
        emoji: '🏥',
      },
    ),
    w('zh-xuexiao', '学校', 'xuéxiào', 'escuela', '我去学校。', 'Voy a la escuela.', ['places'], {
      acceptedTranslations: ['colegio'],
      emoji: '🏫',
    }),
    w(
      'zh-fanguan',
      '饭馆',
      'fànguǎn',
      'restaurante',
      '饭馆在那儿。',
      'El restaurante está allá.',
      ['places'],
      { emoji: '🍜' },
    ),
    w('zh-beijing', '北京', 'Běijīng', 'Pekín', '我去北京。', 'Voy a Pekín.', ['places'], {
      acceptedTranslations: ['Beijing'],
    }),
    w(
      'zh-zuo',
      '坐',
      'zuò',
      'tomar (un transporte)',
      '我坐地铁去学校。',
      'Voy a la escuela en subte.',
      ['verbs', 'transport'],
      { acceptedTranslations: ['sentarse', 'ir en'] },
    ),
    w('zh-ditie', '地铁', 'dìtiě', 'subte', '我坐地铁。', 'Tomo el subte.', ['transport'], {
      acceptedTranslations: ['metro', 'subterráneo'],
      emoji: '🚇',
    }),
    w(
      'zh-gongjiaoche',
      '公交车',
      'gōngjiāochē',
      'colectivo',
      '我坐公交车去商店。',
      'Voy a la tienda en colectivo.',
      ['transport'],
      { acceptedTranslations: ['autobús', 'bus', 'micro'], emoji: '🚌' },
    ),
    w(
      'zh-chuzuche',
      '出租车',
      'chūzūchē',
      'taxi',
      '我坐出租车去医院。',
      'Voy al hospital en taxi.',
      ['transport'],
      { emoji: '🚕' },
    ),
    w(
      'zh-zoulu',
      '走路',
      'zǒulù',
      'caminar',
      '我走路去超市。',
      'Voy al supermercado caminando.',
      ['verbs', 'transport'],
      { acceptedTranslations: ['ir a pie', 'ir caminando'], emoji: '🚶' },
    ),
    w('zh-zenme', '怎么', 'zěnme', '¿cómo?', '你怎么去？', '¿Cómo vas?', ['questions']),
    w('zh-yuan', '远', 'yuǎn', 'lejos', '医院很远。', 'El hospital queda muy lejos.', [
      'directions',
    ]),
    w('zh-jin', '近', 'jìn', 'cerca', '超市很近。', 'El supermercado queda muy cerca.', [
      'directions',
    ]),
  ],
  lessons: [
    {
      title: '你去哪儿？',
      objective: 'Decir adónde vas.',
      intro: {
        explanation:
          '去 (qù) es «ir». Va directo con el lugar, sin «a»: 我去商店 «voy a la tienda». Para preguntar adónde: 你去哪儿？ (哪儿 va donde iría el lugar).',
        examples: [
          { target: '你去哪儿？', base: '¿Adónde vas?' },
          { target: '我去学校。', base: 'Voy a la escuela.' },
        ],
      },
      takeaways: ['Decís adónde vas con 去 + lugar.', 'Preguntás adónde con 去哪儿？'],
      exercises: [
        ex.translationChoice('去', 'ir', ['venir', 'estar en', 'tener'], ['zh-qu']),
        ex.imageChoice('🏫', '学校', ['商店', '超市', '医院'], ['zh-xuexiao']),
        ex.imageChoice('🛒', '超市', ['学校', '饭馆', '医院'], ['zh-chaoshi']),
        tone('去', 'qù', ['qū', 'qú', 'qǔ'], ['zh-qu']),
        ex.listenChoice(
          '你去哪儿？',
          ['你在哪儿？', '你去学校吗？', '你是哪国人？'],
          ['zh-qu', 'zh-nar'],
        ),
        ex.fillBlank(
          '我___商店。',
          'Voy a la tienda.',
          '去',
          ['在', '是', '有'],
          ['zh-qu', 'zh-shangdian'],
          { explanation: '去 va directo con el lugar: 我去商店.' },
        ),
        ex.orderWords('我 去 超市。', 'Voy al supermercado.', ['zh-qu', 'zh-chaoshi']),
        write('Voy a la escuela.', 'wǒ qù xuéxiào', '我去学校', ['zh-wo', 'zh-qu', 'zh-xuexiao']),
        write('¿Adónde vas?', 'nǐ qù nǎr', '你去哪儿', ['zh-ni', 'zh-qu', 'zh-nar']),
      ],
    },
    {
      title: '医院和饭馆',
      objective: 'Nombrar más lugares y decir que alguien viene.',
      intro: {
        explanation:
          '医院 (yīyuàn) es «hospital» y 饭馆 (fànguǎn) «restaurante» (饭 es comida, como en 米饭). 来 (lái) es «venir»: 你来我家吗？ Las ciudades van igual: 我去北京.',
        examples: [
          { target: '饭馆在那儿。', base: 'El restaurante está allá.' },
          { target: '你来我家吗？', base: '¿Venís a mi casa?' },
        ],
      },
      takeaways: ['Nombrás hospital y restaurante.', 'Distinguís 去 (ir) y 来 (venir).'],
      exercises: [
        ex.imageChoice('🏥', '医院', ['饭馆', '学校', '商店'], ['zh-yiyuan']),
        ex.translationChoice(
          '饭馆',
          'restaurante',
          ['hospital', 'tienda', 'cocina'],
          ['zh-fanguan'],
        ),
        ex.translationChoice('来', 'venir', ['ir', 'tener ganas de', 'comer'], ['zh-lai'], {
          explanation: '来 es venir (hacia acá); 去 es ir (hacia allá).',
        }),
        tone('来', 'lái', ['lāi', 'lǎi', 'lài'], ['zh-lai']),
        ex.listenChoice(
          '医院在哪儿？',
          ['饭馆在哪儿？', '医院在那儿。', '你去医院吗？'],
          ['zh-yiyuan', 'zh-zai', 'zh-nar'],
        ),
        ex.matchPairs(
          [
            ['商店', 'tienda'],
            ['超市', 'supermercado'],
            ['医院', 'hospital'],
            ['饭馆', 'restaurante'],
          ],
          ['zh-shangdian', 'zh-chaoshi', 'zh-yiyuan', 'zh-fanguan'],
        ),
        ex.orderWords('你 来 我 家 吗？', '¿Venís a mi casa?', ['zh-lai', 'zh-jia', 'zh-ma']),
        write('Voy a Pekín.', 'wǒ qù Běijīng', '我去北京', ['zh-qu', 'zh-beijing'], {
          accepted: ['wǒ qù běijīng'],
        }),
        write('¿Dónde está el restaurante?', 'fànguǎn zài nǎr', '饭馆在哪儿', [
          'zh-fanguan',
          'zh-zai',
          'zh-nar',
        ]),
      ],
    },
    {
      title: '坐地铁',
      objective: 'Decir en qué vas.',
      intro: {
        explanation:
          '坐 (zuò) es «sentarse» y también «tomar» un transporte: 坐地铁 «tomar el subte», 坐公交车 «tomar el colectivo», 坐出租车 «tomar un taxi». El transporte va antes de 去: 我坐地铁去学校.',
        examples: [
          { target: '我坐地铁去学校。', base: 'Voy a la escuela en subte.' },
          { target: '我坐出租车去医院。', base: 'Voy al hospital en taxi.' },
        ],
      },
      takeaways: ['Nombrás subte, colectivo y taxi.', 'Decís en qué vas con 坐 + vehículo + 去.'],
      exercises: [
        ex.imageChoice('🚇', '地铁', ['公交车', '出租车', '商店'], ['zh-ditie']),
        ex.imageChoice('🚕', '出租车', ['地铁', '公交车', '电视'], ['zh-chuzuche']),
        ex.translationChoice(
          '公交车',
          'colectivo',
          ['taxi', 'subte', 'tienda'],
          ['zh-gongjiaoche'],
        ),
        tone('坐', 'zuò', ['zuō', 'zuó', 'zuǒ'], ['zh-zuo']),
        ex.listenChoice(
          '我坐公交车去商店。',
          ['我坐地铁去商店。', '我坐公交车去学校。', '我走路去商店。'],
          ['zh-zuo', 'zh-gongjiaoche', 'zh-qu', 'zh-shangdian'],
        ),
        ex.fillBlank(
          '我___地铁去学校。',
          'Voy a la escuela en subte.',
          '坐',
          ['去', '在', '要'],
          ['zh-zuo', 'zh-ditie', 'zh-qu', 'zh-xuexiao'],
        ),
        ex.orderWords(
          '我 坐 出租车 去 医院。',
          'Voy al hospital en taxi.',
          ['zh-zuo', 'zh-chuzuche', 'zh-qu', 'zh-yiyuan'],
          { explanation: 'Primero cómo (坐出租车), después adónde (去医院).' },
        ),
        write('Tomo el subte.', 'wǒ zuò dìtiě', '我坐地铁', ['zh-zuo', 'zh-ditie']),
        write(
          'Voy a la escuela en colectivo.',
          'wǒ zuò gōngjiāochē qù xuéxiào',
          '我坐公交车去学校',
          ['zh-zuo', 'zh-gongjiaoche', 'zh-qu', 'zh-xuexiao'],
        ),
      ],
    },
    {
      title: '怎么去？',
      objective: 'Preguntar y decir cómo vas.',
      intro: {
        explanation:
          '怎么 (zěnme) es «¿cómo?» y va antes del verbo: 你怎么去？ «¿cómo vas?». Para decir que vas caminando: 走路 (zǒulù) + 去: 我走路去超市.',
        examples: [
          { target: '你怎么去学校？', base: '¿Cómo vas a la escuela?' },
          { target: '我走路去。', base: 'Voy caminando.' },
        ],
      },
      takeaways: ['Preguntás cómo con 怎么 + verbo.', 'Decís que vas caminando con 走路去.'],
      exercises: [
        ex.translationChoice('怎么', '¿cómo?', ['¿qué?', '¿dónde?', '¿quién?'], ['zh-zenme']),
        ex.imageChoice('🚶', '走路', ['坐', '睡觉', '工作'], ['zh-zoulu']),
        tone('怎么', 'zěnme', ['zēnme', 'zénme', 'zènme'], ['zh-zenme']),
        ex.listenChoice(
          '你怎么去学校？',
          ['你去哪儿？', '你几点去学校？', '你怎么去医院？'],
          ['zh-zenme', 'zh-qu', 'zh-xuexiao'],
        ),
        ex.fillBlank(
          '你___去超市？',
          '¿Cómo vas al supermercado?',
          '怎么',
          ['什么', '哪儿', '几'],
          ['zh-zenme', 'zh-qu', 'zh-chaoshi'],
          { explanation: '«¿Cómo?» es 怎么 y va antes del verbo.' },
        ),
        ex.orderWords('我 走路 去 超市。', 'Voy al supermercado caminando.', [
          'zh-zoulu',
          'zh-qu',
          'zh-chaoshi',
        ]),
        write('¿Cómo vas?', 'nǐ zěnme qù', '你怎么去', ['zh-ni', 'zh-zenme', 'zh-qu']),
        write('Voy caminando a la tienda.', 'wǒ zǒulù qù shāngdiàn', '我走路去商店', [
          'zh-zoulu',
          'zh-qu',
          'zh-shangdian',
        ]),
      ],
    },
    {
      title: '远吗？',
      objective: 'Decir si un lugar queda cerca o lejos.',
      intro: {
        explanation:
          '远 (yuǎn) es «lejos» y 近 (jìn) «cerca». Como los adjetivos, van con 很 y sin 是: 医院很远 «el hospital queda (muy) lejos». Se niegan con 不: 不远.',
        examples: [
          { target: '超市很近。', base: 'El supermercado queda muy cerca.' },
          { target: '医院远吗？不远。', base: '¿El hospital queda lejos? No.' },
        ],
      },
      takeaways: ['Decís si algo está cerca o lejos.', 'Usás 很 y no 是 con 远 y 近.'],
      exercises: [
        ex.translationChoice('远', 'lejos', ['cerca', 'muy', 'grande'], ['zh-yuan']),
        ex.translationChoice('近', 'cerca', ['lejos', 'acá', 'dentro de'], ['zh-jin']),
        tone('远', 'yuǎn', ['yuān', 'yuán', 'yuàn'], ['zh-yuan']),
        ex.listenChoice(
          '学校很近。',
          ['学校很远。', '超市很近。', '学校在这儿。'],
          ['zh-xuexiao', 'zh-hen', 'zh-jin'],
        ),
        ex.fillBlank(
          '医院很___。',
          'El hospital queda muy lejos.',
          '远',
          ['近', '好', '饿'],
          ['zh-yiyuan', 'zh-hen', 'zh-yuan'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('饭馆 远 吗？', '¿El restaurante queda lejos?', [
          'zh-fanguan',
          'zh-yuan',
          'zh-ma',
        ]),
        write('El supermercado queda muy cerca.', 'chāoshì hěn jìn', '超市很近', [
          'zh-chaoshi',
          'zh-hen',
          'zh-jin',
        ]),
        write('La escuela no queda lejos.', 'xuéxiào bù yuǎn', '学校不远', [
          'zh-xuexiao',
          'zh-bu',
          'zh-yuan',
        ]),
      ],
    },
  ],
};

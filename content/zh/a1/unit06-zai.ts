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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos, 里 / 上 en
 * tono neutro detrás del lugar, y si conviene usar 这里 / 那里 además de 这儿 / 那儿).
 */
export const unit06: UnitDef = {
  position: 6,
  title: 'La casa',
  titleEn: '你在哪儿？',
  description:
    'Decir dónde está algo o alguien con 在, preguntar con 哪儿 y ubicar con 里, 上 y 下.',
  emoji: '🏠',
  objective:
    'Podés decir y preguntar dónde está algo o alguien con 在 y 哪儿, ubicarlo con 里, 上 y 下, y decir qué hay en un lugar con 有.',
  grammar: {
    title: '在 + lugar + 里 / 上 / 下',
    explanation:
      '在 (zài) es «estar en»: cosa + 在 + lugar. Para precisar, la palabra de posición va DESPUÉS del lugar: 在包里 «en el bolso», 在桌子上 «sobre la mesa». Para «hay» se invierte el orden: lugar + 有 + cosa.',
    examples: [
      { target: '我在家。', base: 'Estoy en casa.' },
      { target: '手机在桌子上。', base: 'El celular está sobre la mesa.' },
      { target: '桌子上有一本书。', base: 'Sobre la mesa hay un libro.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, 里 / 上 neutros detrás del lugar y 这儿 / 这里.',
  },
  words: [
    w('zh-zai', '在', 'zài', 'estar en', '我在家。', 'Estoy en casa.', ['verbs'], {
      acceptedTranslations: ['estar'],
    }),
    w('zh-nar', '哪儿', 'nǎr', 'dónde', '你在哪儿？', '¿Dónde estás?', ['questions'], {
      acceptedTranslations: ['¿dónde?'],
    }),
    w('zh-zher', '这儿', 'zhèr', 'acá', '我在这儿。', 'Estoy acá.', ['places'], {
      acceptedTranslations: ['aquí'],
    }),
    w('zh-nar-alla', '那儿', 'nàr', 'allá', '你的书在那儿。', 'Tu libro está allá.', ['places'], {
      acceptedTranslations: ['ahí', 'allí'],
    }),
    w('zh-li', '里', 'lǐ', 'dentro de', '书在包里。', 'El libro está en el bolso.', ['places'], {
      acceptedTranslations: ['adentro'],
    }),
    w(
      'zh-shang',
      '上',
      'shàng',
      'encima de',
      '手机在桌子上。',
      'El celular está sobre la mesa.',
      ['places'],
      {
        acceptedTranslations: ['sobre', 'arriba'],
      },
    ),
    w(
      'zh-xia',
      '下',
      'xià',
      'debajo de',
      '狗在桌子下。',
      'El perro está debajo de la mesa.',
      ['places'],
      {
        acceptedTranslations: ['abajo'],
      },
    ),
    w('zh-zhuozi', '桌子', 'zhuōzi', 'mesa', '桌子上有一本书。', 'Sobre la mesa hay un libro.', [
      'home',
    ]),
    w('zh-yizi', '椅子', 'yǐzi', 'silla', '猫在椅子上。', 'El gato está en la silla.', ['home'], {
      emoji: '🪑',
    }),
    w('zh-chuang', '床', 'chuáng', 'cama', '猫在床上。', 'El gato está en la cama.', ['home'], {
      emoji: '🛏️',
    }),
    w(
      'zh-fangjian',
      '房间',
      'fángjiān',
      'habitación',
      '我在房间里。',
      'Estoy en la habitación.',
      ['home'],
      {
        acceptedTranslations: ['cuarto', 'dormitorio'],
      },
    ),
    w('zh-chufang', '厨房', 'chúfáng', 'cocina', '妈妈在厨房。', 'Mamá está en la cocina.', [
      'home',
    ]),
    w('zh-mao', '猫', 'māo', 'gato', '猫在床上。', 'El gato está en la cama.', ['animals'], {
      emoji: '🐱',
    }),
    w('zh-gou', '狗', 'gǒu', 'perro', '狗在哪儿？', '¿Dónde está el perro?', ['animals'], {
      emoji: '🐶',
    }),
  ],
  lessons: [
    {
      title: '你在哪儿？',
      objective: 'Decir y preguntar dónde está alguien.',
      intro: {
        explanation:
          '在 (zài) es «estar en» un lugar: 我在家 «estoy en casa». Para preguntar dónde: 你在哪儿？ El lugar va siempre después de 在, y 哪儿 ocupa el lugar de la respuesta.',
        examples: [
          { target: '你在哪儿？', base: '¿Dónde estás?' },
          { target: '我在家。', base: 'Estoy en casa.' },
        ],
      },
      takeaways: ['Decís dónde estás con 在.', 'Preguntás dónde con 哪儿.'],
      exercises: [
        ex.translationChoice('在', 'estar en', ['tener', 'ser', 'dónde'], ['zh-zai']),
        ex.translationChoice('哪儿', 'dónde', ['¿cuál?', 'qué', 'quién'], ['zh-nar']),
        ex.listenChoice(
          '你在哪儿？',
          ['你是哪国人？', '你叫什么？', '他是谁？'],
          ['zh-zai', 'zh-nar'],
        ),
        tone(
          '哪儿',
          'nǎr',
          ['nàr', 'nār', 'nár'],
          ['zh-nar'],
          '哪儿 (nǎr, tercer tono) es «dónde»; 那儿 (nàr, cuarto) es «allá».',
        ),
        ex.fillBlank(
          '我___家。',
          'Estoy en casa.',
          '在',
          ['是', '有', '叫'],
          ['zh-zai', 'zh-jia'],
          {
            explanation: '«Estar en» un lugar es 在. 是 une dos sustantivos.',
          },
        ),
        ex.orderWords('妈妈 在 哪儿？', '¿Dónde está mamá?', ['zh-mama', 'zh-zai', 'zh-nar']),
        write('Estoy en casa.', 'wǒ zài jiā', '我在家', ['zh-wo', 'zh-zai', 'zh-jia']),
        write('¿Dónde estás?', 'nǐ zài nǎr', '你在哪儿', ['zh-ni', 'zh-zai', 'zh-nar']),
      ],
    },
    {
      title: '这儿、那儿',
      objective: 'Decir acá y allá.',
      intro: {
        explanation:
          '这儿 (zhèr) es «acá» y 那儿 (nàr) «allá»: son 这 y 那 con 儿, la terminación típica del norte de China. 我在这儿 «estoy acá».',
        examples: [
          { target: '我在这儿。', base: 'Estoy acá.' },
          { target: '你的书在那儿。', base: 'Tu libro está allá.' },
        ],
      },
      takeaways: ['Decís acá con 这儿 y allá con 那儿.', 'Distinguís 那儿 (nàr) de 哪儿 (nǎr).'],
      exercises: [
        ex.translationChoice('这儿', 'acá', ['allá', 'dónde', 'este / esto'], ['zh-zher']),
        ex.translationChoice('那儿', 'allá', ['acá', 'dónde', 'ese / eso'], ['zh-nar-alla']),
        ex.listenChoice(
          '我在这儿。',
          ['我在那儿。', '我在家。', '你在哪儿？'],
          ['zh-zai', 'zh-zher'],
        ),
        tone('那儿', 'nàr', ['nǎr', 'nār', 'nár'], ['zh-nar-alla']),
        ex.fillBlank(
          '你的手机在___。',
          'Tu celular está allá.',
          '那儿',
          ['哪儿', '什么', '谁'],
          ['zh-nar-alla', 'zh-shouji'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('我 的 包 在 这儿。', 'Mi bolso está acá.', [
          'zh-de',
          'zh-bao',
          'zh-zai',
          'zh-zher',
        ]),
        write('Estoy acá.', 'wǒ zài zhèr', '我在这儿', ['zh-wo', 'zh-zai', 'zh-zher']),
        write(
          'Mi papá está allá.',
          'wǒ bàba zài nàr',
          '我爸爸在那儿',
          ['zh-baba', 'zh-zai', 'zh-nar-alla'],
          { accepted: ['wǒ de bàba zài nàr', '我的爸爸在那儿'] },
        ),
      ],
    },
    {
      title: '房间、厨房',
      objective: 'Nombrar partes y muebles de la casa.',
      intro: {
        explanation:
          '房间 es la habitación y 厨房 la cocina. Muchas palabras de objetos terminan en 子 (zi, tono neutro): 桌子 mesa, 椅子 silla.',
        examples: [
          { target: '妈妈在厨房。', base: 'Mamá está en la cocina.' },
          { target: '我在房间里。', base: 'Estoy en la habitación.' },
        ],
      },
      takeaways: [
        'Nombrás habitación, cocina y muebles.',
        'Reconocés el 子 neutro de 桌子 y 椅子.',
      ],
      exercises: [
        ex.translationChoice('厨房', 'cocina', ['habitación', 'mesa', 'cama'], ['zh-chufang']),
        ex.translationChoice('房间', 'habitación', ['cocina', 'silla', 'gato'], ['zh-fangjian']),
        ex.imageChoice('🛏️', '床', ['桌子', '椅子', '包'], ['zh-chuang']),
        ex.imageChoice('🪑', '椅子', ['桌子', '床', '书'], ['zh-yizi']),
        ex.listenChoice('桌子', ['椅子', '房间', '厨房'], ['zh-zhuozi']),
        ex.matchPairs(
          [
            ['桌子', 'mesa'],
            ['椅子', 'silla'],
            ['床', 'cama'],
            ['厨房', 'cocina'],
          ],
          ['zh-zhuozi', 'zh-yizi', 'zh-chuang', 'zh-chufang'],
        ),
        write(
          'Mamá está en la cocina.',
          'māma zài chúfáng',
          '妈妈在厨房',
          ['zh-mama', 'zh-zai', 'zh-chufang'],
          { accepted: ['wǒ māma zài chúfáng', '我妈妈在厨房'] },
        ),
        write('Mesa', 'zhuōzi', '桌子', ['zh-zhuozi']),
      ],
    },
    {
      title: '里 y 上',
      objective: 'Decir que algo está dentro o encima de otra cosa.',
      intro: {
        explanation:
          '里 (lǐ) es «dentro de» y 上 (shàng) «encima de». Van después del lugar: 书在包里 «el libro está en el bolso», 手机在桌子上 «el celular está sobre la mesa». Detrás del lugar suelen sonar en tono neutro (bāo li).',
        examples: [
          { target: '书在包里。', base: 'El libro está en el bolso.' },
          { target: '手机在桌子上。', base: 'El celular está sobre la mesa.' },
        ],
      },
      takeaways: ['Ubicás cosas con 里 y 上.', 'Ponés la posición después del lugar.'],
      exercises: [
        ex.imageChoice('🐱', '猫', ['狗', '床', '书'], ['zh-mao']),
        ex.translationChoice('里', 'dentro de', ['encima de', 'acá', 'dónde'], ['zh-li']),
        ex.translationChoice('上', 'encima de', ['dentro de', 'allá', 'cama'], ['zh-shang']),
        ex.fillBlank(
          '书在包___。',
          'El libro está en el bolso.',
          '里',
          ['上', '哪儿', '这儿'],
          ['zh-li', 'zh-shu', 'zh-bao'],
          { explanation: 'Dentro del bolso: 包里.' },
        ),
        ex.fillBlank(
          '手机在桌子___。',
          'El celular está sobre la mesa.',
          '上',
          ['里', '这儿', '哪儿'],
          ['zh-shang', 'zh-shouji', 'zh-zhuozi'],
          { explanation: 'Encima de la mesa: 桌子上.' },
        ),
        ex.listenChoice(
          '猫在床上。',
          ['狗在床上。', '猫在房间里。', '猫在厨房。'],
          ['zh-mao', 'zh-chuang', 'zh-shang'],
        ),
        ex.orderWords('水 在 桌子 上。', 'El agua está sobre la mesa.', [
          'zh-shui',
          'zh-zai',
          'zh-zhuozi',
          'zh-shang',
        ]),
        write(
          'El libro está en el bolso.',
          'shū zài bāo lǐ',
          '书在包里',
          ['zh-shu', 'zh-zai', 'zh-bao', 'zh-li'],
          { accepted: ['shū zài bāo li', 'shū zài bāoli'] },
        ),
        write(
          'El gato está sobre la cama.',
          'māo zài chuáng shàng',
          '猫在床上',
          ['zh-mao', 'zh-zai', 'zh-chuang', 'zh-shang'],
          { accepted: ['māo zài chuáng shang', 'māo zài chuángshang'] },
        ),
      ],
    },
    {
      title: '下 y 有',
      objective: 'Decir que algo está debajo y qué hay en un lugar.',
      intro: {
        explanation:
          '下 (xià) es «debajo de»: 狗在桌子下 «el perro está debajo de la mesa». Para decir «hay» se pone primero el lugar y después 有: 桌子上有一本书 «sobre la mesa hay un libro».',
        examples: [
          { target: '狗在桌子下。', base: 'El perro está debajo de la mesa.' },
          { target: '厨房里有猫吗？', base: '¿Hay un gato en la cocina?' },
        ],
      },
      takeaways: ['Ubicás cosas debajo con 下.', 'Decís qué hay con lugar + 有.'],
      exercises: [
        ex.imageChoice('🐶', '狗', ['猫', '床', '桌子'], ['zh-gou']),
        ex.translationChoice('下', 'debajo de', ['encima de', 'dentro de', 'dónde'], ['zh-xia']),
        tone('狗', 'gǒu', ['gōu', 'góu', 'gòu'], ['zh-gou']),
        ex.listenChoice(
          '狗在桌子下。',
          ['狗在桌子上。', '猫在桌子下。', '狗在哪儿？'],
          ['zh-gou', 'zh-zhuozi', 'zh-xia'],
        ),
        ex.fillBlank(
          '桌子上___一本书。',
          'Sobre la mesa hay un libro.',
          '有',
          ['在', '是', '叫'],
          ['zh-you', 'zh-zhuozi', 'zh-shang', 'zh-ben'],
          { explanation: 'Para «hay», el lugar va primero y después 有: 桌子上有….' },
        ),
        ex.orderWords('厨房 里 有 猫 吗？', '¿Hay un gato en la cocina?', [
          'zh-chufang',
          'zh-li',
          'zh-you',
          'zh-mao',
          'zh-ma',
        ]),
        write('El perro está debajo de la cama.', 'gǒu zài chuáng xià', '狗在床下', [
          'zh-gou',
          'zh-zai',
          'zh-chuang',
          'zh-xia',
        ]),
        write(
          'Sobre la mesa hay un libro.',
          'zhuōzi shàng yǒu yì běn shū',
          '桌子上有一本书',
          ['zh-zhuozi', 'zh-shang', 'zh-you', 'zh-ben', 'zh-shu'],
          {
            accepted: [
              'zhuōzi shang yǒu yì běn shū',
              'zhuōzi shàng yǒu yī běn shū',
              'zhuōzi shang yǒu yī běn shū',
            ],
          },
        ),
      ],
    },
  ],
};

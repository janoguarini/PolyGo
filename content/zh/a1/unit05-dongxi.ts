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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos, cambio de
 * tono de 一 ante 本 y 杯, y la lectura shéi / shuí de 谁). 本 se traduce «clasificador de libros»
 * para no chocar con la traducción «clasificador» de 个.
 */
export const unit05: UnitDef = {
  position: 5,
  title: 'Objetos',
  titleEn: '这是什么？',
  description:
    'Preguntar qué es algo con 这 y 那, contar cosas con 本, 个 y 杯, y decir de quién es.',
  emoji: '🎒',
  objective:
    'Podés preguntar qué es algo con 这 / 那 y 什么, contar cosas con el clasificador correcto (本, 个, 杯) y preguntar de quién es con 谁的.',
  grammar: {
    title: '这 / 那 y los clasificadores',
    explanation:
      '这 (zhè) es «esto / este» y 那 (nà) «eso / ese». Entre un número (o 这 / 那) y la cosa va un clasificador: 本 para libros, 杯 para bebidas y 个 para casi todo lo demás. 一 cambia de tono: yì běn, yì bēi, pero yí ge.',
    examples: [
      { target: '这是什么？', base: '¿Qué es esto?' },
      { target: '我有三本书。', base: 'Tengo tres libros.' },
      { target: '一杯水', base: 'un vaso de agua', note: 'yì bēi' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, 一本 / 一杯 (yì) y 谁 (shéi / shuí).',
  },
  words: [
    w('zh-zhe', '这', 'zhè', 'este / esto', '这是什么？', '¿Qué es esto?', ['demonstratives'], {
      acceptedTranslations: ['esto', 'este', 'esta'],
    }),
    w(
      'zh-na-eso',
      '那',
      'nà',
      'ese / eso',
      '那是我的书。',
      'Ese es mi libro.',
      ['demonstratives'],
      {
        acceptedTranslations: ['eso', 'ese', 'esa', 'aquel'],
      },
    ),
    w('zh-shu', '书', 'shū', 'libro', '这是我的书。', 'Este es mi libro.', ['objects'], {
      emoji: '📕',
    }),
    w('zh-bi', '笔', 'bǐ', 'lapicera', '那是笔。', 'Eso es una lapicera.', ['objects'], {
      acceptedTranslations: ['bolígrafo', 'birome', 'lápiz'],
      emoji: '🖊️',
    }),
    w(
      'zh-shouji',
      '手机',
      'shǒujī',
      'celular',
      '这是我的手机。',
      'Este es mi celular.',
      ['objects'],
      {
        acceptedTranslations: ['teléfono'],
        emoji: '📱',
      },
    ),
    w('zh-bao', '包', 'bāo', 'bolso / mochila', '那是我的包。', 'Ese es mi bolso.', ['objects'], {
      acceptedTranslations: ['bolso', 'mochila', 'cartera'],
      emoji: '👜',
    }),
    w(
      'zh-diannao',
      '电脑',
      'diànnǎo',
      'computadora',
      '这是我的电脑。',
      'Esta es mi computadora.',
      ['objects'],
      {
        emoji: '💻',
      },
    ),
    w('zh-dongxi', '东西', 'dōngxi', 'cosa', '那是什么东西？', '¿Qué cosa es esa?', ['objects']),
    w('zh-ben', '本', 'běn', 'clasificador de libros', '我有三本书。', 'Tengo tres libros.', [
      'grammar',
    ]),
    w('zh-bei', '杯', 'bēi', 'vaso / taza', '我有一杯水。', 'Tengo un vaso de agua.', ['grammar'], {
      acceptedTranslations: ['vaso', 'taza'],
    }),
    w('zh-shui', '水', 'shuǐ', 'agua', '我有一杯水。', 'Tengo un vaso de agua.', ['food'], {
      emoji: '💧',
    }),
    w('zh-shei', '谁', 'shéi', 'quién', '他是谁？', '¿Quién es él?', ['questions'], {
      acceptedTranslations: ['¿quién?'],
    }),
    w(
      'zh-zhongwen',
      '中文',
      'Zhōngwén',
      'chino (idioma)',
      '这是中文书。',
      'Este es un libro en chino.',
      ['languages'],
      {
        acceptedTranslations: ['chino', 'idioma chino'],
      },
    ),
  ],
  lessons: [
    {
      title: '这是什么？',
      objective: 'Preguntar qué es algo con 这 y 那.',
      intro: {
        explanation:
          '这 (zhè) es «esto / este» y 那 (nà) «eso / ese». Para preguntar qué es algo: 这是什么？ Se responde con la misma estructura: 这是书 «esto es un libro». Ojo: 那 (nà, cuarto tono) no es 哪 (nǎ, «¿cuál?»).',
        examples: [
          { target: '这是什么？', base: '¿Qué es esto?' },
          { target: '那是笔。', base: 'Eso es una lapicera.' },
        ],
      },
      takeaways: ['Preguntás qué es algo con 这是什么？', 'Distinguís 那 (nà) de 哪 (nǎ).'],
      exercises: [
        ex.translationChoice('这', 'este / esto', ['ese / eso', '¿cuál?', 'qué'], ['zh-zhe']),
        ex.imageChoice('📕', '书', ['笔', '手机', '包'], ['zh-shu']),
        ex.imageChoice('🖊️', '笔', ['书', '电脑', '水'], ['zh-bi']),
        ex.listenChoice(
          '这是什么？',
          ['那是什么？', '你叫什么？', '他是谁？'],
          ['zh-zhe', 'zh-shenme'],
        ),
        tone(
          '那',
          'nà',
          ['nǎ', 'nā', 'ná'],
          ['zh-na-eso'],
          '那 (nà, cuarto tono) es «eso»; 哪 (nǎ, tercer tono) es «¿cuál?».',
        ),
        ex.fillBlank(
          '___是什么？',
          '¿Qué es esto?',
          '这',
          ['哪', '很', '也'],
          ['zh-zhe', 'zh-shenme'],
          {
            skill: 'vocabulary',
          },
        ),
        write('¿Qué es esto?', 'zhè shì shénme', '这是什么', ['zh-zhe', 'zh-shi', 'zh-shenme']),
        write('Eso es un libro.', 'nà shì shū', '那是书', ['zh-na-eso', 'zh-shi', 'zh-shu'], {
          accepted: ['nà shì yì běn shū', '那是一本书'],
        }),
      ],
    },
    {
      title: '手机、包、电脑',
      objective: 'Nombrar las cosas que llevás encima.',
      intro: {
        explanation:
          '东西 (dōngxi) significa «cosa»: 那是什么东西？ «¿qué cosa es esa?». Con 的 decís de quién es: 我的手机 «mi celular».',
        examples: [
          { target: '这是我的手机。', base: 'Este es mi celular.' },
          { target: '那是什么东西？', base: '¿Qué cosa es esa?' },
        ],
      },
      takeaways: [
        'Nombrás celular, bolso y computadora.',
        'Preguntás qué cosa es algo con 什么东西.',
      ],
      exercises: [
        ex.imageChoice('📱', '手机', ['电脑', '包', '书'], ['zh-shouji']),
        ex.imageChoice('💻', '电脑', ['手机', '笔', '包'], ['zh-diannao']),
        ex.translationChoice('包', 'bolso / mochila', ['libro', 'celular', 'cosa'], ['zh-bao']),
        ex.translationChoice(
          '东西',
          'cosa',
          ['bolso / mochila', 'computadora', 'agua'],
          ['zh-dongxi'],
        ),
        ex.listenChoice('我的手机', ['我的电脑', '你的包', '他的书'], ['zh-shouji', 'zh-de']),
        ex.orderWords('这 是 我 的 电脑。', 'Esta es mi computadora.', [
          'zh-zhe',
          'zh-de',
          'zh-diannao',
        ]),
        write('Mi celular', 'wǒ de shǒujī', '我的手机', ['zh-wo', 'zh-de', 'zh-shouji'], {
          accepted: ['wǒde shǒujī'],
        }),
        write('¿Qué cosa es esa?', 'nà shì shénme dōngxi', '那是什么东西', [
          'zh-na-eso',
          'zh-shenme',
          'zh-dongxi',
        ]),
      ],
    },
    {
      title: '三本书',
      objective: 'Contar cosas con 本 y 个.',
      intro: {
        explanation:
          'Para contar cosas, entre el número y la palabra va un clasificador. Los libros usan 本 (běn): 三本书. Para casi todo lo demás sirve 个: 一个包. Con 这 y 那 también: 这本书 «este libro».',
        examples: [
          { target: '我有三本书。', base: 'Tengo tres libros.' },
          { target: '这本书是中文书。', base: 'Este libro es un libro en chino.' },
        ],
      },
      takeaways: ['Contás libros con 本.', 'Usás 个 para casi todo lo demás.'],
      exercises: [
        ex.translationChoice('本', 'clasificador de libros', ['libro', 'agua', 'cosa'], ['zh-ben']),
        ex.fillBlank(
          '我有两___书。',
          'Tengo dos libros.',
          '本',
          ['个', '岁', '人'],
          ['zh-ben', 'zh-shu', 'zh-liang'],
          { explanation: 'Los libros se cuentan con 本: 两本书.' },
        ),
        ex.fillBlank(
          '我有一___包。',
          'Tengo un bolso.',
          '个',
          ['本', '岁', '杯'],
          ['zh-ge', 'zh-bao'],
          { explanation: 'Para un bolso alcanza el clasificador general 个.' },
        ),
        ex.listenChoice('这本书', ['那本书', '这个包', '三本书'], ['zh-zhe', 'zh-ben', 'zh-shu']),
        ex.translationChoice(
          '中文',
          'chino (idioma)',
          ['China', 'persona', 'libro'],
          ['zh-zhongwen'],
        ),
        ex.orderWords('我 有 三 本 中文 书。', 'Tengo tres libros en chino.', [
          'zh-you',
          'zh-san',
          'zh-ben',
          'zh-zhongwen',
          'zh-shu',
        ]),
        write('Tengo tres libros.', 'wǒ yǒu sān běn shū', '我有三本书', [
          'zh-you',
          'zh-san',
          'zh-ben',
          'zh-shu',
        ]),
        write('Este libro', 'zhè běn shū', '这本书', ['zh-zhe', 'zh-ben', 'zh-shu'], {
          accepted: ['zhèi běn shū'],
        }),
      ],
    },
    {
      title: '一杯水',
      objective: 'Contar bebidas con 杯.',
      intro: {
        explanation:
          '杯 (bēi) es «vaso / taza» y también sirve para contar bebidas: 一杯水 «un vaso de agua». Antes de 杯 (primer tono), 一 se dice yì: yì bēi.',
        examples: [
          { target: '我有一杯水。', base: 'Tengo un vaso de agua.', note: 'yì bēi' },
          { target: '这是你的水吗？', base: '¿Esta es tu agua?' },
        ],
      },
      takeaways: ['Contás bebidas con 杯.', 'Decís 一杯 como yì bēi.'],
      exercises: [
        ex.imageChoice('💧', '水', ['书', '笔', '包'], ['zh-shui']),
        ex.translationChoice('杯', 'vaso / taza', ['agua', 'libro', 'cosa'], ['zh-bei']),
        tone('水', 'shuǐ', ['shuī', 'shuí', 'shuì'], ['zh-shui']),
        ex.listenChoice('一杯水', ['两杯水', '一本书', '一个包'], ['zh-yi', 'zh-bei', 'zh-shui']),
        ex.fillBlank(
          '我有两___水。',
          'Tengo dos vasos de agua.',
          '杯',
          ['本', '岁', '人'],
          ['zh-bei', 'zh-shui', 'zh-liang'],
        ),
        ex.orderWords('这 是 我 的 水。', 'Esta es mi agua.', ['zh-zhe', 'zh-de', 'zh-shui']),
        write('Un vaso de agua', 'yì bēi shuǐ', '一杯水', ['zh-yi', 'zh-bei', 'zh-shui'], {
          accepted: ['yī bēi shuǐ'],
          explanation: '一 antes de un primer tono se dice yì: yì bēi.',
        }),
        write('Tengo dos vasos de agua.', 'wǒ yǒu liǎng bēi shuǐ', '我有两杯水', [
          'zh-you',
          'zh-liang',
          'zh-bei',
          'zh-shui',
        ]),
      ],
    },
    {
      title: '谁的？',
      objective: 'Preguntar quién es alguien y de quién es algo.',
      intro: {
        explanation:
          '谁 (shéi, también se oye shuí) es «quién». 谁的 es «de quién»: 这是谁的手机？ Se responde poniendo al dueño con 的: 是我的 «es mío».',
        examples: [
          { target: '这是谁的书？', base: '¿De quién es este libro?' },
          { target: '是我的。', base: 'Es mío.' },
        ],
      },
      takeaways: ['Preguntás quién es alguien con 谁.', 'Preguntás de quién es algo con 谁的.'],
      exercises: [
        ex.translationChoice('谁', 'quién', ['qué', '¿cuál?', 'cosa'], ['zh-shei']),
        tone('谁', 'shéi', ['shēi', 'shěi', 'shèi'], ['zh-shei']),
        ex.listenChoice(
          '这是谁的手机？',
          ['这是我的手机。', '那是谁的包？', '这是什么？'],
          ['zh-shei', 'zh-de', 'zh-shouji'],
        ),
        ex.fillBlank(
          '这是___的电脑？',
          '¿De quién es esta computadora?',
          '谁',
          ['什么', '哪', '吗'],
          ['zh-shei', 'zh-de', 'zh-diannao'],
          { skill: 'grammar' },
        ),
        ex.orderWords('那 是 谁 的 包？', '¿De quién es ese bolso?', [
          'zh-na-eso',
          'zh-shei',
          'zh-de',
          'zh-bao',
        ]),
        write('Es mío.', 'shì wǒ de', '是我的', ['zh-shi', 'zh-wo', 'zh-de'], {
          accepted: ['zhè shì wǒ de', '这是我的'],
        }),
        write('¿Quién es él?', 'tā shì shéi', '他是谁', ['zh-ta-he', 'zh-shi', 'zh-shei'], {
          accepted: ['tā shì shuí'],
        }),
        write(
          '¿De quién es este celular?',
          'zhè shì shéi de shǒujī',
          '这是谁的手机',
          ['zh-zhe', 'zh-shei', 'zh-de', 'zh-shouji'],
          { accepted: ['zhè shì shuí de shǒujī', 'zhè shì shéide shǒujī'] },
        ),
      ],
    },
  ],
};

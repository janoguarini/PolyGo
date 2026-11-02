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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos, 一 → yí ante
 * 个, y si conviene introducir 口 para contar a la familia).
 */
export const unit04: UnitDef = {
  position: 4,
  title: 'La familia',
  titleEn: '我的家',
  description: 'Nombrar a tu familia, decir cuántos hermanos tenés y de quién es algo.',
  emoji: '👨‍👩‍👧',
  objective:
    'Podés nombrar a tu familia, decir cuántos hermanos tenés (o que no tenés) y marcar de quién es algo con 的.',
  grammar: {
    title: '有 / 没有 y el clasificador 个',
    explanation:
      '有 es «tener» y se niega con 没: 没有 (nunca 不有). Para contar personas, entre el número y la palabra va un clasificador: 两个哥哥. 个 es el más común.',
    examples: [
      { target: '我有两个哥哥。', base: 'Tengo dos hermanos mayores.' },
      { target: '我没有妹妹。', base: 'No tengo hermanas menores.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, 一个 (yí ge) y 四个人 / 四口人.',
  },
  words: [
    w(
      'zh-jia',
      '家',
      'jiā',
      'familia / casa',
      '我家有四个人。',
      'En mi familia somos cuatro.',
      ['family'],
      {
        acceptedTranslations: ['familia', 'casa'],
      },
    ),
    w('zh-baba', '爸爸', 'bàba', 'papá', '我爸爸是老师。', 'Mi papá es profesor.', ['family'], {
      acceptedTranslations: ['padre'],
    }),
    w('zh-mama', '妈妈', 'māma', 'mamá', '我妈妈很好。', 'Mi mamá está bien.', ['family'], {
      acceptedTranslations: ['madre'],
    }),
    w('zh-gege', '哥哥', 'gēge', 'hermano mayor', '他是我哥哥。', 'Él es mi hermano mayor.', [
      'family',
    ]),
    w(
      'zh-jiejie',
      '姐姐',
      'jiějie',
      'hermana mayor',
      '我有一个姐姐。',
      'Tengo una hermana mayor.',
      ['family'],
    ),
    w(
      'zh-didi',
      '弟弟',
      'dìdi',
      'hermano menor',
      '我弟弟八岁。',
      'Mi hermano menor tiene ocho años.',
      ['family'],
    ),
    w('zh-meimei', '妹妹', 'mèimei', 'hermana menor', '她是我妹妹。', 'Ella es mi hermana menor.', [
      'family',
    ]),
    w('zh-you', '有', 'yǒu', 'tener', '我有两个哥哥。', 'Tengo dos hermanos mayores.', ['verbs']),
    w('zh-meiyou', '没有', 'méiyǒu', 'no tener', '我没有妹妹。', 'No tengo hermanas menores.', [
      'verbs',
    ]),
    w(
      'zh-ge',
      '个',
      'gè',
      'clasificador (personas y cosas)',
      '两个姐姐',
      'dos hermanas mayores',
      ['grammar'],
      {
        acceptedTranslations: ['clasificador'],
      },
    ),
    w('zh-de', '的', 'de', 'de (posesión)', '我的朋友', 'mi amigo', ['grammar', 'particle']),
    w('zh-women', '我们', 'wǒmen', 'nosotros', '我们是朋友。', 'Somos amigos.', ['pronouns'], {
      acceptedTranslations: ['nosotras'],
    }),
  ],
  lessons: [
    {
      title: '爸爸妈妈',
      objective: 'Nombrar a tu papá y tu mamá.',
      intro: {
        explanation:
          '爸爸 (bàba) y 妈妈 (māma) son papá y mamá; la segunda sílaba es neutra. Con la familia cercana se dice 我妈妈 «mi mamá», sin nada en el medio. 家 es «familia» o «casa».',
        examples: [
          { target: '我爸爸是老师。', base: 'Mi papá es profesor.' },
          { target: '我妈妈很好。', base: 'Mi mamá está bien.' },
        ],
      },
      takeaways: ['Nombrás a tu papá y tu mamá.', 'Decís «mi mamá» con 我妈妈.'],
      exercises: [
        ex.translationChoice('爸爸', 'papá', ['mamá', 'hermano mayor', 'amigo/a'], ['zh-baba']),
        ex.translationChoice('妈妈', 'mamá', ['papá', 'hermana mayor', 'profesor/a'], ['zh-mama']),
        ex.listenChoice('我妈妈', ['我爸爸', '我朋友', '我们'], ['zh-mama']),
        tone(
          '妈妈',
          'māma',
          ['máma', 'mǎma', 'màma'],
          ['zh-mama'],
          '妈 es primer tono (mā); la segunda sílaba es neutra.',
        ),
        ex.fillBlank(
          '我___是老师。',
          'Mi papá es profesor.',
          '爸爸',
          ['妈妈', '朋友', '学生'],
          ['zh-baba'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('我 妈妈 是 老师。', 'Mi mamá es profesora.', [
          'zh-wo',
          'zh-mama',
          'zh-shi',
          'zh-laoshi',
        ]),
        write('Mi mamá', 'wǒ māma', '我妈妈', ['zh-wo', 'zh-mama'], {
          accepted: ['wǒ de māma', '我的妈妈'],
        }),
        write('Papá', 'bàba', '爸爸', ['zh-baba']),
      ],
    },
    {
      title: '哥哥、姐姐、弟弟、妹妹',
      objective: 'Nombrar a tus hermanos según la edad.',
      intro: {
        explanation:
          'En chino no hay una palabra para «hermano»: se dice si es mayor o menor. 哥哥 hermano mayor, 姐姐 hermana mayor, 弟弟 hermano menor, 妹妹 hermana menor.',
        examples: [
          { target: '他是我哥哥。', base: 'Él es mi hermano mayor.' },
          { target: '她是我妹妹。', base: 'Ella es mi hermana menor.' },
        ],
      },
      takeaways: [
        'Nombrás a tus hermanos según si son mayores o menores.',
        'Presentás a un hermano con 他是我….',
      ],
      exercises: [
        ex.translationChoice(
          '哥哥',
          'hermano mayor',
          ['hermano menor', 'hermana mayor', 'papá'],
          ['zh-gege'],
        ),
        ex.translationChoice(
          '妹妹',
          'hermana menor',
          ['hermana mayor', 'hermano menor', 'mamá'],
          ['zh-meimei'],
        ),
        ex.listenChoice('姐姐', ['哥哥', '妹妹', '弟弟'], ['zh-jiejie']),
        ex.matchPairs(
          [
            ['哥哥', 'hermano mayor'],
            ['姐姐', 'hermana mayor'],
            ['弟弟', 'hermano menor'],
            ['妹妹', 'hermana menor'],
          ],
          ['zh-gege', 'zh-jiejie', 'zh-didi', 'zh-meimei'],
        ),
        ex.fillBlank(
          '他是我___。',
          'Él es mi hermano mayor.',
          '哥哥',
          ['姐姐', '妹妹', '妈妈'],
          ['zh-gege'],
          {
            skill: 'vocabulary',
            explanation: '哥哥 es el hermano mayor; 弟弟, el menor.',
          },
        ),
        tone('弟弟', 'dìdi', ['dīdi', 'dídi', 'dǐdi'], ['zh-didi']),
        write('Hermano mayor', 'gēge', '哥哥', ['zh-gege']),
        write('Ella es mi hermana menor.', 'tā shì wǒ mèimei', '她是我妹妹', [
          'zh-ta-she',
          'zh-shi',
          'zh-meimei',
        ]),
      ],
    },
    {
      title: '我有…',
      objective: 'Decir cuántos hermanos tenés con 有 y 个.',
      intro: {
        explanation:
          '有 (yǒu) es «tener». Para contar personas, entre el número y la palabra va 个: 两个哥哥 «dos hermanos mayores». «Dos» acá es 两. Antes de 个, 一 se dice yí: 一个 (yí ge).',
        examples: [
          { target: '我有两个哥哥。', base: 'Tengo dos hermanos mayores.' },
          { target: '我有一个弟弟。', base: 'Tengo un hermano menor.', note: 'yí ge' },
        ],
      },
      takeaways: ['Decís que tenés algo con 有.', 'Contás personas con número + 个.'],
      exercises: [
        ex.translationChoice('有', 'tener', ['no tener', 'ser', 'nosotros'], ['zh-you']),
        ex.fillBlank(
          '我___两个哥哥。',
          'Tengo dos hermanos mayores.',
          '有',
          ['是', '叫', '很'],
          ['zh-you', 'zh-liang', 'zh-ge', 'zh-gege'],
          {
            skill: 'grammar',
            explanation: '«Tener» es 有. 是 es «ser».',
          },
        ),
        ex.fillBlank(
          '我有两___姐姐。',
          'Tengo dos hermanas mayores.',
          '个',
          ['岁', '人', '国'],
          ['zh-ge', 'zh-jiejie', 'zh-liang'],
          {
            skill: 'grammar',
            explanation: 'Entre el número y la persona va el clasificador 个: 两个姐姐.',
          },
        ),
        ex.listenChoice(
          '我有一个弟弟。',
          ['我有两个弟弟。', '我有一个妹妹。', '我没有弟弟。'],
          ['zh-you', 'zh-yi', 'zh-ge', 'zh-didi'],
        ),
        ex.orderWords('我 有 两 个 妹妹。', 'Tengo dos hermanas menores.', [
          'zh-you',
          'zh-liang',
          'zh-ge',
          'zh-meimei',
        ]),
        ex.matchPairs(
          [
            ['有', 'tener'],
            ['个', 'clasificador'],
            ['两', 'dos (para contar)'],
            ['家', 'familia'],
          ],
          ['zh-you', 'zh-ge', 'zh-liang', 'zh-jia'],
        ),
        write(
          'Tengo un hermano menor.',
          'wǒ yǒu yí ge dìdi',
          '我有一个弟弟',
          ['zh-you', 'zh-yi', 'zh-ge', 'zh-didi'],
          {
            accepted: [
              'wǒ yǒu yī ge dìdi',
              'wǒ yǒu yí gè dìdi',
              'wǒ yǒu yī gè dìdi',
              'wǒ yǒu yíge dìdi',
            ],
            explanation: '一 antes de 个 se dice yí: yí ge.',
          },
        ),
        write(
          'Tengo dos hermanos mayores.',
          'wǒ yǒu liǎng ge gēge',
          '我有两个哥哥',
          ['zh-you', 'zh-liang', 'zh-ge', 'zh-gege'],
          {
            accepted: ['wǒ yǒu liǎng gè gēge', 'wǒ yǒu liǎngge gēge'],
            explanation: '«Dos» antes de 个 es 两 (liǎng), no 二.',
          },
        ),
      ],
    },
    {
      title: '没有',
      objective: 'Decir que no tenés algo y preguntar si alguien tiene.',
      intro: {
        explanation:
          '有 se niega siempre con 没: 没有 (méiyǒu). «不有» no existe. Para preguntar: 你有姐姐吗？',
        examples: [
          { target: '我没有妹妹。', base: 'No tengo hermanas menores.' },
          { target: '你有姐姐吗？', base: '¿Tenés una hermana mayor?' },
        ],
      },
      takeaways: ['Negás 有 con 没有.', 'Preguntás si alguien tiene algo con 有…吗？'],
      exercises: [
        ex.translationChoice('没有', 'no tener', ['tener', 'no (negación)', 'ser'], ['zh-meiyou']),
        ex.fillBlank(
          '我___姐姐。',
          'No tengo hermanas mayores.',
          '没有',
          ['不有', '不是', '有'],
          ['zh-meiyou', 'zh-jiejie'],
          {
            skill: 'grammar',
            explanation: '有 se niega con 没: 没有. «不有» es un error muy común.',
          },
        ),
        ex.listenChoice(
          '我没有妹妹。',
          ['我有妹妹。', '我有两个妹妹。', '我妹妹很好。'],
          ['zh-meiyou', 'zh-meimei'],
        ),
        ex.orderWords('我 没有 哥哥。', 'No tengo hermanos mayores.', [
          'zh-wo',
          'zh-meiyou',
          'zh-gege',
        ]),
        ex.fillBlank(
          '你有弟弟___？',
          '¿Tenés un hermano menor?',
          '吗',
          ['呢', '不', '的'],
          ['zh-you', 'zh-didi', 'zh-ma'],
          { skill: 'grammar' },
        ),
        tone('没有', 'méiyǒu', ['mēiyǒu', 'měiyǒu', 'mèiyǒu'], ['zh-meiyou']),
        write(
          'No tengo hermanos menores.',
          'wǒ méiyǒu dìdi',
          '我没有弟弟',
          ['zh-wo', 'zh-meiyou', 'zh-didi'],
          {
            accepted: ['wǒ méi yǒu dìdi'],
            explanation: 'Con 有 la negación es 没: 我没有弟弟.',
          },
        ),
        write('¿Tenés una hermana mayor?', 'nǐ yǒu jiějie ma', '你有姐姐吗', [
          'zh-you',
          'zh-jiejie',
          'zh-ma',
        ]),
      ],
    },
    {
      title: '我的 y 我们家',
      objective: 'Marcar de quién es algo con 的 y contar a tu familia.',
      intro: {
        explanation:
          '的 (de) marca de quién es algo: 我的朋友 «mi amigo», 老师的家 «la casa del profesor». Con la familia cercana se suele omitir: 我妈妈. 我们家 es «nuestra familia».',
        examples: [
          { target: '他是我的朋友。', base: 'Él es mi amigo.' },
          { target: '我们家有四个人。', base: 'En nuestra familia somos cuatro.' },
        ],
      },
      takeaways: [
        'Marcás de quién es algo con 的.',
        'Decís cuántos son en tu familia con 家有 … 个人.',
      ],
      exercises: [
        ex.translationChoice(
          '的',
          'de (posesión)',
          ['tener', 'nosotros', 'familia / casa'],
          ['zh-de'],
        ),
        ex.translationChoice('我们', 'nosotros', ['yo', 'familia / casa', 'vos'], ['zh-women']),
        ex.fillBlank(
          '他是我___朋友。',
          'Él es mi amigo.',
          '的',
          ['很', '有', '吗'],
          ['zh-de', 'zh-pengyou'],
          {
            skill: 'grammar',
            explanation: '的 une al dueño con lo que tiene: 我的朋友 «mi amigo».',
          },
        ),
        ex.listenChoice(
          '我们家有四个人。',
          ['我家有三个人。', '我们是学生。', '我有四个朋友。'],
          ['zh-women', 'zh-jia', 'zh-you', 'zh-si'],
        ),
        ex.orderWords('我们 家 有 五 个 人。', 'En nuestra familia somos cinco.', [
          'zh-women',
          'zh-jia',
          'zh-you',
          'zh-wu',
          'zh-ge',
        ]),
        tone('我们', 'wǒmen', ['wōmen', 'wómen', 'wòmen'], ['zh-women']),
        write('Mi amigo', 'wǒ de péngyou', '我的朋友', ['zh-wo', 'zh-de', 'zh-pengyou'], {
          accepted: ['wǒde péngyou'],
        }),
        write(
          'En nuestra familia somos cuatro.',
          'wǒmen jiā yǒu sì ge rén',
          '我们家有四个人',
          ['zh-women', 'zh-jia', 'zh-you', 'zh-si', 'zh-ge'],
          {
            accepted: [
              'wǒmen jiā yǒu sì gè rén',
              'wǒ jiā yǒu sì ge rén',
              'wǒ jiā yǒu sì gè rén',
              '我家有四个人',
            ],
            explanation:
              'También se dice 四口人, con el clasificador 口 que se usa para la familia.',
          },
        ),
      ],
    },
  ],
};

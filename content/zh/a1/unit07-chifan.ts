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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos, 不要 → bú
 * yào, y el matiz entre 想 y 要). 想 y 要 se traducen distinto para que no sean ambiguas.
 */
export const unit07: UnitDef = {
  position: 7,
  title: 'Comer y beber',
  titleEn: '吃饭',
  description: 'Comer y beber con 吃 y 喝, pedir con 要, decir qué tenés ganas de comer con 想.',
  emoji: '🍜',
  objective:
    'Podés decir qué comés y tomás, pedir con 要 (y rechazar con 不要), decir qué tenés ganas de comer con 想 y que algo está rico.',
  grammar: {
    title: '要 y 想 + verbo',
    explanation:
      '要 (yào) es «querer» para pedir algo concreto: 我要一杯茶. 想 (xiǎng) + verbo es «tener ganas de»: 我想吃饺子. Los dos se niegan con 不 (不要, 不想). El verbo no cambia nunca.',
    examples: [
      { target: '我要一杯咖啡。', base: 'Quiero un café.' },
      { target: '我想吃面条。', base: 'Tengo ganas de comer fideos.' },
      { target: '我不要牛奶。', base: 'No quiero leche.', note: 'bú yào' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, 不要 (bú yào) y el matiz 想 / 要.',
  },
  words: [
    w('zh-chi', '吃', 'chī', 'comer', '我吃米饭。', 'Como arroz.', ['verbs']),
    w('zh-he', '喝', 'hē', 'beber', '我喝水。', 'Tomo agua.', ['verbs'], {
      acceptedTranslations: ['tomar'],
    }),
    w('zh-yao', '要', 'yào', 'querer (pedir)', '我要一杯咖啡。', 'Quiero un café.', ['verbs'], {
      acceptedTranslations: ['querer', 'pedir'],
    }),
    w('zh-xiang', '想', 'xiǎng', 'tener ganas de', '我想喝茶。', 'Tengo ganas de tomar té.', [
      'verbs',
    ]),
    w('zh-cha', '茶', 'chá', 'té', '我喝茶。', 'Tomo té.', ['food'], { emoji: '🍵' }),
    w('zh-kafei', '咖啡', 'kāfēi', 'café', '我要一杯咖啡。', 'Quiero un café.', ['food'], {
      emoji: '☕',
    }),
    w('zh-niunai', '牛奶', 'niúnǎi', 'leche', '我不要牛奶。', 'No quiero leche.', ['food'], {
      emoji: '🥛',
    }),
    w('zh-mifan', '米饭', 'mǐfàn', 'arroz', '我吃米饭。', 'Como arroz.', ['food'], { emoji: '🍚' }),
    w(
      'zh-miantiao',
      '面条',
      'miàntiáo',
      'fideos',
      '我想吃面条。',
      'Tengo ganas de comer fideos.',
      ['food'],
      {
        emoji: '🍜',
      },
    ),
    w(
      'zh-jiaozi',
      '饺子',
      'jiǎozi',
      'jiaozi (empanaditas chinas)',
      '我想吃饺子。',
      'Tengo ganas de comer jiaozi.',
      ['food'],
      {
        acceptedTranslations: ['jiaozi', 'empanaditas chinas', 'ravioles chinos', 'dumplings'],
        emoji: '🥟',
      },
    ),
    w(
      'zh-pingguo',
      '苹果',
      'píngguǒ',
      'manzana',
      '我想吃苹果。',
      'Tengo ganas de comer una manzana.',
      ['food'],
      {
        emoji: '🍎',
      },
    ),
    w('zh-e', '饿', 'è', 'tener hambre', '我很饿。', 'Tengo hambre.', ['feelings'], {
      acceptedTranslations: ['hambriento'],
    }),
    w(
      'zh-haochi',
      '好吃',
      'hǎochī',
      'rico (de comer)',
      '饺子很好吃。',
      'Los jiaozi son muy ricos.',
      ['food'],
      {
        acceptedTranslations: ['rico', 'sabroso'],
      },
    ),
  ],
  lessons: [
    {
      title: '吃和喝',
      objective: 'Decir qué comés y qué tomás.',
      intro: {
        explanation:
          '吃 (chī) es «comer» y 喝 (hē) «beber / tomar». El orden es como en español: 我吃米饭 «como arroz». El verbo no cambia con la persona ni con el tiempo.',
        examples: [
          { target: '我吃米饭。', base: 'Como arroz.' },
          { target: '你喝水吗？', base: '¿Tomás agua?' },
        ],
      },
      takeaways: ['Decís qué comés con 吃 y qué tomás con 喝.', 'Preguntás con 吗 al final.'],
      exercises: [
        ex.translationChoice('吃', 'comer', ['beber', 'tener', 'ser'], ['zh-chi']),
        ex.translationChoice('喝', 'beber', ['comer', 'estar en', 'tener'], ['zh-he']),
        ex.imageChoice('🍚', '米饭', ['水', '书', '包'], ['zh-mifan']),
        tone('吃', 'chī', ['chí', 'chǐ', 'chì'], ['zh-chi']),
        ex.listenChoice('我喝水。', ['我吃米饭。', '我有水。', '你喝水吗？'], ['zh-he', 'zh-shui']),
        ex.fillBlank(
          '我___米饭。',
          'Como arroz.',
          '吃',
          ['喝', '是', '在'],
          ['zh-chi', 'zh-mifan'],
          {
            skill: 'vocabulary',
          },
        ),
        write('Como arroz.', 'wǒ chī mǐfàn', '我吃米饭', ['zh-wo', 'zh-chi', 'zh-mifan'], {
          accepted: ['wǒ chī mǐ fàn'],
        }),
        write('¿Tomás agua?', 'nǐ hē shuǐ ma', '你喝水吗', ['zh-ni', 'zh-he', 'zh-shui', 'zh-ma']),
      ],
    },
    {
      title: '茶、咖啡、牛奶',
      objective: 'Nombrar bebidas.',
      intro: {
        explanation:
          'Bebidas: 茶 (chá) té, 咖啡 (kāfēi) café y 牛奶 (niúnǎi) leche (literalmente «leche de vaca»). Se cuentan con 杯: 一杯茶.',
        examples: [
          { target: '我喝茶。', base: 'Tomo té.' },
          { target: '一杯咖啡', base: 'un café (una taza)', note: 'yì bēi' },
        ],
      },
      takeaways: ['Nombrás té, café y leche.', 'Contás bebidas con 杯.'],
      exercises: [
        ex.imageChoice('🍵', '茶', ['咖啡', '牛奶', '水'], ['zh-cha']),
        ex.imageChoice('☕', '咖啡', ['茶', '米饭', '牛奶'], ['zh-kafei']),
        ex.translationChoice('牛奶', 'leche', ['té', 'café', 'agua'], ['zh-niunai']),
        tone('茶', 'chá', ['chā', 'chǎ', 'chà'], ['zh-cha']),
        ex.listenChoice('一杯咖啡', ['一杯茶', '两杯咖啡', '一杯牛奶'], ['zh-bei', 'zh-kafei']),
        ex.matchPairs(
          [
            ['茶', 'té'],
            ['咖啡', 'café'],
            ['牛奶', 'leche'],
            ['水', 'agua'],
          ],
          ['zh-cha', 'zh-kafei', 'zh-niunai', 'zh-shui'],
        ),
        write('Café', 'kāfēi', '咖啡', ['zh-kafei']),
        write('Tomo leche.', 'wǒ hē niúnǎi', '我喝牛奶', ['zh-wo', 'zh-he', 'zh-niunai']),
      ],
    },
    {
      title: '我要…',
      objective: 'Pedir algo con 要 y rechazarlo con 不要.',
      intro: {
        explanation:
          '要 (yào) es «querer» para pedir algo concreto: 我要一杯茶 «quiero un té». Es lo más común en un restaurante o una tienda. Para decir que no: 不要; como 要 es cuarto tono, 不 se dice bú.',
        examples: [
          { target: '我要一杯咖啡。', base: 'Quiero un café.' },
          { target: '我不要牛奶。', base: 'No quiero leche.', note: 'bú yào' },
        ],
      },
      takeaways: ['Pedís con 要.', 'Rechazás con 不要 (bú yào).'],
      exercises: [
        ex.translationChoice(
          '要',
          'querer (pedir)',
          ['tener ganas de', 'comer', 'tener'],
          ['zh-yao'],
        ),
        tone('要', 'yào', ['yāo', 'yáo', 'yǎo'], ['zh-yao']),
        ex.fillBlank(
          '我___一杯茶。',
          'Quiero un té.',
          '要',
          ['是', '在', '叫'],
          ['zh-yao', 'zh-cha', 'zh-bei'],
        ),
        ex.listenChoice(
          '我不要牛奶。',
          ['我要牛奶。', '我不喝茶。', '我要一杯水。'],
          ['zh-bu', 'zh-yao', 'zh-niunai'],
        ),
        ex.orderWords('我 要 两 杯 咖啡。', 'Quiero dos cafés.', [
          'zh-yao',
          'zh-liang',
          'zh-bei',
          'zh-kafei',
        ]),
        ex.fillBlank(
          '我___要咖啡。',
          'No quiero café.',
          '不',
          ['没', '吗', '很'],
          ['zh-bu', 'zh-yao', 'zh-kafei'],
          { explanation: '要 se niega con 不: 不要. 没 va con 有.' },
        ),
        write(
          'Quiero un té.',
          'wǒ yào yì bēi chá',
          '我要一杯茶',
          ['zh-yao', 'zh-yi', 'zh-bei', 'zh-cha'],
          { accepted: ['wǒ yào yī bēi chá', 'wǒ yào chá', '我要茶'] },
        ),
        write(
          'No quiero leche.',
          'wǒ bú yào niúnǎi',
          '我不要牛奶',
          ['zh-bu', 'zh-yao', 'zh-niunai'],
          {
            accepted: ['wǒ bù yào niúnǎi'],
            explanation: '不 antes de un cuarto tono se dice bú: bú yào.',
          },
        ),
      ],
    },
    {
      title: '我想…',
      objective: 'Decir qué tenés ganas de comer y que tenés hambre.',
      intro: {
        explanation:
          '想 (xiǎng) + verbo es «tener ganas de»: 我想吃饺子 «tengo ganas de comer jiaozi». 饿 (è) es «tener hambre» y funciona como un adjetivo: va con 很 y sin 是: 我很饿.',
        examples: [
          { target: '我很饿。', base: 'Tengo hambre.' },
          { target: '我想吃面条。', base: 'Tengo ganas de comer fideos.' },
        ],
      },
      takeaways: ['Decís qué tenés ganas de comer con 想.', 'Decís que tenés hambre con 我很饿.'],
      exercises: [
        ex.translationChoice(
          '想',
          'tener ganas de',
          ['querer (pedir)', 'comer', 'beber'],
          ['zh-xiang'],
        ),
        ex.imageChoice('🥟', '饺子', ['面条', '米饭', '茶'], ['zh-jiaozi']),
        ex.imageChoice('🍜', '面条', ['饺子', '米饭', '牛奶'], ['zh-miantiao']),
        ex.translationChoice('饿', 'tener hambre', ['tener ganas de', 'comer', 'beber'], ['zh-e']),
        ex.listenChoice(
          '我想吃饺子。',
          ['我想喝茶。', '我要饺子。', '我吃面条。'],
          ['zh-xiang', 'zh-chi', 'zh-jiaozi'],
        ),
        ex.orderWords('我 很 饿。', 'Tengo hambre.', ['zh-wo', 'zh-hen', 'zh-e']),
        write('Tengo hambre.', 'wǒ hěn è', '我很饿', ['zh-wo', 'zh-hen', 'zh-e'], {
          explanation: '饿 funciona como un adjetivo: va con 很 y sin 是.',
        }),
        write('Tengo ganas de comer fideos.', 'wǒ xiǎng chī miàntiáo', '我想吃面条', [
          'zh-xiang',
          'zh-chi',
          'zh-miantiao',
        ]),
      ],
    },
    {
      title: '好吃！',
      objective: 'Decir que algo está rico.',
      intro: {
        explanation:
          '好吃 (hǎochī) es «rico» para la comida: 好 + 吃. Para la bebida se dice 好喝. Como todo adjetivo, va con 很: 饺子很好吃.',
        examples: [
          { target: '饺子很好吃。', base: 'Los jiaozi son muy ricos.' },
          { target: '苹果好吃吗？', base: '¿Las manzanas son ricas?' },
        ],
      },
      takeaways: ['Decís que algo está rico con 好吃.', 'Usás 好喝 para las bebidas.'],
      exercises: [
        ex.imageChoice('🍎', '苹果', ['饺子', '牛奶', '咖啡'], ['zh-pingguo']),
        ex.translationChoice(
          '好吃',
          'rico (de comer)',
          ['tener hambre', 'bien', 'comer'],
          ['zh-haochi'],
        ),
        tone('苹果', 'píngguǒ', ['pīngguǒ', 'pǐngguǒ', 'pìngguǒ'], ['zh-pingguo']),
        ex.listenChoice(
          '面条很好吃。',
          ['面条很好。', '米饭很好吃。', '我想吃面条。'],
          ['zh-miantiao', 'zh-hen', 'zh-haochi'],
        ),
        ex.fillBlank(
          '这个苹果很___。',
          'Esta manzana es muy rica.',
          '好吃',
          ['饿', '想', '要'],
          ['zh-pingguo', 'zh-haochi'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('你 想 吃 苹果 吗？', '¿Tenés ganas de comer una manzana?', [
          'zh-xiang',
          'zh-chi',
          'zh-pingguo',
          'zh-ma',
        ]),
        write('Los jiaozi son muy ricos.', 'jiǎozi hěn hǎochī', '饺子很好吃', [
          'zh-jiaozi',
          'zh-hen',
          'zh-haochi',
        ]),
        write(
          'Tengo ganas de comer una manzana.',
          'wǒ xiǎng chī píngguǒ',
          '我想吃苹果',
          ['zh-xiang', 'zh-chi', 'zh-pingguo'],
          { accepted: ['wǒ xiǎng chī yí ge píngguǒ', '我想吃一个苹果'] },
        ),
      ],
    },
  ],
};

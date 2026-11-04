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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos, 块 / 元,
 * clasificadores 件 y 双, 一共 → yígòng). 怎么 entró en la unidad 10; acá se suma 怎么样.
 */
export const unit12: UnitDef = {
  position: 12,
  title: 'De compras',
  titleEn: '多少钱',
  description:
    'Preguntar cuánto cuesta algo (多少钱), entender precios en 块, opinar con 太…了 y 怎么样 y preguntar «¿y…?» con 呢.',
  emoji: '🛍️',
  objective:
    'Podés preguntar 多少钱？, entender precios (二十块), decir 太贵了！, preguntar 怎么样？, usar 呢 para «¿y…?» y distinguir 买 (comprar) de 卖 (vender).',
  grammar: {
    title: '多少钱 · 太 + adjetivo + 了 · 呢',
    explanation:
      'Para el precio: cosa + 多少钱？ (这个多少钱？). En la charla la moneda se dice 块 (kuài): 十块. Con ropa van clasificadores: 一件衣服 (una prenda), 一双鞋 (un par de zapatos). Para «demasiado»: 太 + adjetivo + 了 (太贵了！). 呢 al final pregunta «¿y…?»: 你呢？, 我的手机呢？',
    examples: [
      { target: '这件衣服多少钱？', base: '¿Cuánto cuesta esta prenda?' },
      { target: '九十块？太贵了！', base: '¿Noventa yuanes? ¡Es carísimo!', note: 'jiǔshí kuài' },
      { target: '这双鞋怎么样？', base: '¿Qué tal estos zapatos?' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, clasificadores 件 / 双 y 一 → yí en 一共.',
  },
  words: [
    w(
      'zh-duoshao-qian',
      '多少钱',
      'duōshao qián',
      '¿cuánto cuesta?',
      '这个多少钱？',
      '¿Cuánto cuesta esto?',
      ['shopping', 'questions'],
      { acceptedTranslations: ['¿cuánto es?', '¿cuánto sale?'] },
    ),
    w(
      'zh-duoshao',
      '多少',
      'duōshao',
      '¿cuántos?',
      '你有多少钱？',
      '¿Cuánta plata tenés?',
      ['questions'],
      { acceptedTranslations: ['¿cuánto?'] },
    ),
    w('zh-qian', '钱', 'qián', 'dinero', '我没有钱。', 'No tengo dinero.', ['shopping'], {
      acceptedTranslations: ['plata'],
      emoji: '💰',
    }),
    w('zh-kuai', '块', 'kuài', 'yuan (en la charla)', '十块。', 'Diez yuanes.', ['shopping'], {
      acceptedTranslations: ['yuan', 'yuanes'],
    }),
    w('zh-gui', '贵', 'guì', 'caro', '这个很贵。', 'Esto es muy caro.', ['shopping', 'adjectives']),
    w('zh-pianyi', '便宜', 'piányi', 'barato', '这个很便宜。', 'Esto es muy barato.', [
      'shopping',
      'adjectives',
    ]),
    w('zh-tai', '太', 'tài', 'demasiado', '太大了！', '¡Es demasiado grande!', ['adjectives']),
    w(
      'zh-tai-gui-le',
      '太贵了',
      'tài guì le',
      '¡es carísimo!',
      '九十块？太贵了！',
      '¿Noventa yuanes? ¡Es carísimo!',
      ['shopping'],
      { acceptedTranslations: ['es demasiado caro', 'demasiado caro'] },
    ),
    w(
      'zh-tai-hao-le',
      '太好了',
      'tài hǎo le',
      '¡buenísimo!',
      '你能来？太好了！',
      '¿Podés venir? ¡Buenísimo!',
      ['courtesy'],
      { acceptedTranslations: ['¡genial!', '¡excelente!'] },
    ),
    w(
      'zh-zenmeyang',
      '怎么样',
      'zěnmeyàng',
      '¿qué tal?',
      '这件衣服怎么样？',
      '¿Qué tal esta prenda?',
      ['questions'],
      { acceptedTranslations: ['¿cómo es?', '¿cómo está?'] },
    ),
    w('zh-ne', '呢', 'ne', 'partícula: ¿y…?', '我的手机呢？', '¿Y mi celular?', [
      'particle',
      'questions',
    ]),
    w(
      'zh-yifu',
      '衣服',
      'yīfu',
      'ropa',
      '这件衣服很漂亮。',
      'Esta prenda es muy linda.',
      ['clothes'],
      {
        acceptedTranslations: ['prenda'],
        emoji: '👕',
      },
    ),
    w(
      'zh-xie',
      '鞋',
      'xié',
      'zapatos',
      '这双鞋很贵。',
      'Estos zapatos son muy caros.',
      ['clothes'],
      {
        acceptedTranslations: ['zapato', 'zapatillas'],
        emoji: '👟',
      },
    ),
    w('zh-jian', '件', 'jiàn', 'clasificador de prendas', '一件衣服', 'una prenda', ['measure']),
    w(
      'zh-shuang',
      '双',
      'shuāng',
      'par (clasificador)',
      '一双鞋',
      'un par de zapatos',
      ['measure'],
      {
        acceptedTranslations: ['par'],
      },
    ),
    w(
      'zh-mai-comprar',
      '买',
      'mǎi',
      'comprar',
      '我买这个。',
      'Compro esto.',
      ['verbs', 'shopping'],
      {
        emoji: '🛍️',
      },
    ),
    w('zh-mai-vender', '卖', 'mài', 'vender', '他卖苹果。', 'Él vende manzanas.', [
      'verbs',
      'shopping',
    ]),
    w(
      'zh-yigong',
      '一共',
      'yígòng',
      'en total',
      '一共五十块。',
      'En total, cincuenta yuanes.',
      ['shopping'],
      {
        acceptedTranslations: ['total'],
      },
    ),
  ],
  lessons: [
    {
      title: '多少钱？',
      objective: 'Preguntar y entender precios.',
      intro: {
        explanation:
          '多少钱 (duōshao qián) es «¿cuánto cuesta?»: va después de la cosa, 这个多少钱？ En la charla la moneda (el yuan) se dice 块 (kuài) y va después del número: 十块, 二十块.',
        examples: [
          { target: '这个多少钱？', base: '¿Cuánto cuesta esto?' },
          { target: '二十块。', base: 'Veinte yuanes.' },
        ],
      },
      takeaways: ['Preguntás el precio con 多少钱？', 'Entendés precios con 块.'],
      exercises: [
        ex.translationChoice(
          '多少钱',
          '¿cuánto cuesta?',
          ['¿qué hora es?', '¿cuántos años?', '¿qué tal?'],
          ['zh-duoshao-qian'],
        ),
        ex.translationChoice('钱', 'dinero', ['libro', 'cosa', 'agua'], ['zh-qian']),
        tone('钱', 'qián', ['qiān', 'qiǎn', 'qiàn'], ['zh-qian']),
        tone('块', 'kuài', ['kuāi', 'kuái', 'kuǎi'], ['zh-kuai']),
        ex.listenChoice(
          '这个多少钱？',
          ['那个多少钱？', '这个是什么？', '这是谁的？'],
          ['zh-zhe', 'zh-ge', 'zh-duoshao-qian'],
        ),
        ex.listenChoice(
          '二十块。',
          ['十二块。', '二十岁。', '十块。'],
          ['zh-er', 'zh-shi-10', 'zh-kuai'],
          {
            explanation: '二十 es veinte (2 × 10); 十二 es doce (10 + 2).',
          },
        ),
        ex.fillBlank(
          '这个___？',
          '¿Cuánto cuesta esto?',
          '多少钱',
          ['怎么样', '在哪儿', '几点'],
          ['zh-zhe', 'zh-duoshao-qian'],
        ),
        write(
          '¿Cuánto cuesta esto?',
          'zhège duōshao qián',
          '这个多少钱',
          ['zh-zhe', 'zh-ge', 'zh-duoshao-qian'],
          {
            accepted: ['zhè ge duōshao qián', 'zhèige duōshao qián'],
          },
        ),
        write('Diez yuanes.', 'shí kuài', '十块', ['zh-shi-10', 'zh-kuai']),
      ],
    },
    {
      title: '一件衣服',
      objective: 'Nombrar ropa y comprar.',
      intro: {
        explanation:
          '衣服 (yīfu) es «ropa» y 鞋 (xié) «zapatos». Con números y con 这 / 那 llevan su clasificador: 一件衣服 (una prenda), 一双鞋 (un par de zapatos). 买 (mǎi) es «comprar».',
        examples: [
          { target: '这件衣服很漂亮。', base: 'Esta prenda es muy linda.' },
          { target: '我买这双鞋。', base: 'Compro estos zapatos.' },
        ],
      },
      takeaways: ['Nombrás ropa y zapatos.', 'Usás los clasificadores 件 y 双.'],
      exercises: [
        ex.imageChoice('👕', '衣服', ['鞋', '包', '书'], ['zh-yifu']),
        ex.imageChoice('👟', '鞋', ['衣服', '笔', '手机'], ['zh-xie']),
        ex.translationChoice(
          '买',
          'comprar',
          ['vender', 'tener', 'querer (pedir)'],
          ['zh-mai-comprar'],
        ),
        ex.listenChoice(
          '这件衣服很漂亮。',
          ['这双鞋很漂亮。', '这件衣服很贵。', '那件衣服很漂亮。'],
          ['zh-zhe', 'zh-jian', 'zh-yifu', 'zh-piaoliang'],
        ),
        ex.fillBlank(
          '一___鞋',
          'un par de zapatos',
          '双',
          ['件', '本', '个'],
          ['zh-yi', 'zh-shuang', 'zh-xie'],
          { explanation: 'Los zapatos van de a pares: 双.' },
        ),
        ex.fillBlank(
          '这___衣服多少钱？',
          '¿Cuánto cuesta esta prenda?',
          '件',
          ['双', '本', '杯'],
          ['zh-zhe', 'zh-jian', 'zh-yifu', 'zh-duoshao-qian'],
          { explanation: 'Para la ropa, el clasificador es 件.' },
        ),
        ex.orderWords('我 买 这 双 鞋。', 'Compro estos zapatos.', [
          'zh-mai-comprar',
          'zh-zhe',
          'zh-shuang',
          'zh-xie',
        ]),
        write('Compro esto.', 'wǒ mǎi zhège', '我买这个', ['zh-mai-comprar', 'zh-zhe', 'zh-ge'], {
          accepted: ['wǒ mǎi zhè ge', 'wǒ mǎi zhèige'],
        }),
        write('¿Cuánto cuestan estos zapatos?', 'zhè shuāng xié duōshao qián', '这双鞋多少钱', [
          'zh-zhe',
          'zh-shuang',
          'zh-xie',
          'zh-duoshao-qian',
        ]),
      ],
    },
    {
      title: '太贵了！',
      objective: 'Opinar sobre un precio.',
      intro: {
        explanation:
          '贵 (guì) es «caro» y 便宜 (piányi) «barato»; como los adjetivos, van con 很: 这个很便宜. Para «demasiado»: 太 + adjetivo + 了: 太贵了！ 一共 (yígòng) es «en total».',
        examples: [
          { target: '九十块？太贵了！', base: '¿Noventa yuanes? ¡Es carísimo!' },
          { target: '一共五十块。', base: 'En total, cincuenta yuanes.' },
        ],
      },
      takeaways: ['Decís si algo es caro o barato.', 'Te quejás del precio con 太贵了！'],
      exercises: [
        ex.translationChoice('贵', 'caro', ['barato', 'lindo', 'grande'], ['zh-gui']),
        ex.translationChoice('便宜', 'barato', ['caro', 'rico (de comer)', 'chico'], ['zh-pianyi']),
        tone('贵', 'guì', ['guī', 'guí', 'guǐ'], ['zh-gui']),
        ex.listenChoice('太贵了！', ['太好了！', '很贵。', '不贵。'], ['zh-tai-gui-le']),
        ex.fillBlank(
          '这个___大了！',
          '¡Esto es demasiado grande!',
          '太',
          ['很', '不', '也'],
          ['zh-zhe', 'zh-tai', 'zh-da'],
          { explanation: '«Demasiado» es 太 + adjetivo + 了.' },
        ),
        ex.fillBlank(
          '___五十块。',
          'En total, cincuenta yuanes.',
          '一共',
          ['多少', '现在', '每天'],
          ['zh-yigong', 'zh-wu', 'zh-shi-10', 'zh-kuai'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('这 件 衣服 很 便宜。', 'Esta prenda es muy barata.', [
          'zh-zhe',
          'zh-jian',
          'zh-yifu',
          'zh-hen',
          'zh-pianyi',
        ]),
        write('¡Es carísimo!', 'tài guì le', '太贵了', ['zh-tai-gui-le'], {
          accepted: ['tài guì le!', '太贵了！'],
        }),
        write(
          'Esto es muy barato.',
          'zhège hěn piányi',
          '这个很便宜',
          ['zh-zhe', 'zh-ge', 'zh-hen', 'zh-pianyi'],
          {
            accepted: ['zhè ge hěn piányi', 'zhèige hěn piányi'],
          },
        ),
      ],
    },
    {
      title: '怎么样？',
      objective: 'Pedir y dar una opinión.',
      intro: {
        explanation:
          '怎么样 (zěnmeyàng) va al final y pregunta «¿qué tal?»: 这件衣服怎么样？ Para festejar, 太好了！ («¡buenísimo!»): 太 + 好 + 了.',
        examples: [
          { target: '这双鞋怎么样？——很漂亮！', base: '¿Qué tal estos zapatos? — ¡Muy lindos!' },
          { target: '你能来？太好了！', base: '¿Podés venir? ¡Buenísimo!' },
        ],
      },
      takeaways: ['Pedís una opinión con 怎么样？', 'Festejás con 太好了！'],
      exercises: [
        ex.translationChoice(
          '怎么样',
          '¿qué tal?',
          ['¿cómo vas?', '¿cuánto cuesta?', '¿dónde?'],
          ['zh-zenmeyang'],
        ),
        ex.translationChoice(
          '太好了',
          '¡buenísimo!',
          ['¡es carísimo!', 'no pasa nada', 'de nada'],
          ['zh-tai-hao-le'],
        ),
        tone('怎么样', 'zěnmeyàng', ['zēnmeyàng', 'zénmeyāng', 'zènmeyǎng'], ['zh-zenmeyang']),
        ex.listenChoice(
          '这双鞋怎么样？',
          ['这双鞋多少钱？', '这件衣服怎么样？', '你怎么去？'],
          ['zh-zhe', 'zh-shuang', 'zh-xie', 'zh-zenmeyang'],
        ),
        ex.fillBlank(
          '你能来？太___了！',
          '¿Podés venir? ¡Buenísimo!',
          '好',
          ['贵', '大', '忙'],
          ['zh-neng', 'zh-lai', 'zh-tai-hao-le'],
        ),
        ex.matchPairs(
          [
            ['贵', 'caro'],
            ['便宜', 'barato'],
            ['怎么样', '¿qué tal?'],
            ['一共', 'en total'],
          ],
          ['zh-gui', 'zh-pianyi', 'zh-zenmeyang', 'zh-yigong'],
        ),
        ex.orderWords('这 件 衣服 怎么样？', '¿Qué tal esta prenda?', [
          'zh-zhe',
          'zh-jian',
          'zh-yifu',
          'zh-zenmeyang',
        ]),
        write('¿Qué tal?', 'zěnmeyàng', '怎么样', ['zh-zenmeyang']),
        write('¡Buenísimo!', 'tài hǎo le', '太好了', ['zh-tai-hao-le'], {
          accepted: ['tài hǎo le!', '太好了！'],
        }),
      ],
    },
    {
      title: '买和卖・你呢？',
      objective: 'Distinguir comprar y vender, y preguntar «¿y…?».',
      intro: {
        explanation:
          'Sólo el tono separa 买 (mǎi, tercer tono) «comprar» y 卖 (mài, cuarto tono) «vender». 呢 (ne) al final pregunta «¿y…?»: 我很好，你呢？, 我的手机呢？ («¿y mi celular?», «¿dónde está?»).',
        examples: [
          { target: '他卖苹果，我买苹果。', base: 'Él vende manzanas y yo compro manzanas.' },
          { target: '我的手机呢？', base: '¿Y mi celular?' },
        ],
      },
      takeaways: ['Distinguís 买 y 卖 por el tono.', 'Preguntás «¿y…?» con 呢.'],
      exercises: [
        ex.translationChoice('卖', 'vender', ['comprar', 'comer', 'venir'], ['zh-mai-vender']),
        tone(
          '买',
          'mǎi',
          ['mài', 'māi', 'mái'],
          ['zh-mai-comprar'],
          'Comprar es tercer tono: mǎi.',
        ),
        tone('卖', 'mài', ['mǎi', 'māi', 'mái'], ['zh-mai-vender'], 'Vender es cuarto tono: mài.'),
        ex.listenChoice(
          '我的手机呢？',
          ['我的手机在哪儿？', '你的手机呢？', '我的包呢？'],
          ['zh-de', 'zh-shouji', 'zh-ne'],
        ),
        ex.fillBlank(
          '我很好，你___？',
          'Estoy bien, ¿y vos?',
          '呢',
          ['吗', '的', '了'],
          ['zh-hen', 'zh-hao', 'zh-ne'],
          { explanation: 'Para devolver la pregunta («¿y vos?») se usa 呢, no 吗.' },
        ),
        ex.orderWords('我 喜欢 喝 茶， 你 呢？', 'Me gusta tomar té, ¿y a vos?', [
          'zh-xihuan',
          'zh-he',
          'zh-cha',
          'zh-ne',
        ]),
        write('¿Y mi celular?', 'wǒ de shǒujī ne', '我的手机呢', ['zh-de', 'zh-shouji', 'zh-ne']),
        write('¿Qué vende él?', 'tā mài shénme', '他卖什么', [
          'zh-ta-he',
          'zh-mai-vender',
          'zh-shenme',
        ]),
      ],
    },
  ],
};

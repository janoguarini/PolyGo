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

/** Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos y usos de 两). */
export const unit03: UnitDef = {
  position: 3,
  title: 'Números y edad',
  titleEn: '数字和年龄',
  description: 'Contar hasta veinte, preguntar la edad y decir cuántos años tenés.',
  emoji: '🔢',
  objective:
    'Podés contar hasta veinte, armar números con 十, preguntar la edad y decir cuántos años tenés.',
  grammar: {
    title: 'Números con 十 y la edad con 岁',
    explanation:
      'Los números se arman como una cuenta: 十八 = 10 + 8, 二十 = 2 × 10. La edad no lleva verbo: 我二十岁 «yo veinte años». Para contar cosas, «dos» es 两: 两岁.',
    examples: [
      { target: '我二十岁。', base: 'Tengo veinte años.' },
      { target: '你几岁？', base: '¿Cuántos años tenés? (a un chico)' },
      { target: '你多大？', base: '¿Qué edad tenés? (a un joven o adulto)' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, 二 / 两 y preguntas de edad.',
  },
  words: [
    w('zh-yi', '一', 'yī', 'uno', '一，二，三。', 'Uno, dos, tres.', ['numbers'], { emoji: '1️⃣' }),
    w('zh-er', '二', 'èr', 'dos', '二十', 'veinte', ['numbers'], { emoji: '2️⃣' }),
    w('zh-san', '三', 'sān', 'tres', '我家有三个人。', 'En mi familia somos tres.', ['numbers'], {
      emoji: '3️⃣',
    }),
    w('zh-si', '四', 'sì', 'cuatro', '四十', 'cuarenta', ['numbers'], { emoji: '4️⃣' }),
    w('zh-wu', '五', 'wǔ', 'cinco', '十五', 'quince', ['numbers'], { emoji: '5️⃣' }),
    w('zh-liu', '六', 'liù', 'seis', '他六岁。', 'Él tiene seis años.', ['numbers'], {
      emoji: '6️⃣',
    }),
    w('zh-qi', '七', 'qī', 'siete', '七岁', 'siete años', ['numbers'], { emoji: '7️⃣' }),
    w('zh-ba', '八', 'bā', 'ocho', '十八', 'dieciocho', ['numbers'], { emoji: '8️⃣' }),
    w('zh-jiu', '九', 'jiǔ', 'nueve', '她九岁。', 'Ella tiene nueve años.', ['numbers'], {
      emoji: '9️⃣',
    }),
    w('zh-shi-10', '十', 'shí', 'diez', '十个学生', 'diez estudiantes', ['numbers'], {
      emoji: '🔟',
    }),
    w('zh-liang', '两', 'liǎng', 'dos (para contar)', '他两岁。', 'Él tiene dos años.', [
      'numbers',
    ]),
    w('zh-sui', '岁', 'suì', 'años (de edad)', '我二十岁。', 'Tengo veinte años.', ['time']),
    w('zh-ji', '几', 'jǐ', '¿cuántos?', '你几岁？', '¿Cuántos años tenés?', ['questions']),
    w('zh-duo-da', '多大', 'duō dà', '¿qué edad?', '你多大？', '¿Qué edad tenés?', ['questions']),
    w('zh-jinnian', '今年', 'jīnnián', 'este año', '我今年十八岁。', 'Tengo dieciocho años.', [
      'time',
    ]),
  ],
  lessons: [
    {
      title: '一 a 五',
      objective: 'Contar del uno al cinco.',
      intro: {
        explanation:
          '一 (yī), 二 (èr), 三 (sān), 四 (sì), 五 (wǔ). Los tres primeros son una, dos y tres rayitas. Ojo con 四 (sì, baja) y 十 (shí, sube): suenan parecido.',
        examples: [
          { target: '一，二，三。', base: 'Uno, dos, tres.' },
          { target: '十五', base: 'quince' },
        ],
      },
      takeaways: ['Contás del uno al cinco.', 'Distinguís 四 (sì) de 十 (shí) por el tono.'],
      exercises: [
        ex.imageChoice('2️⃣', '二', ['三', '一', '五'], ['zh-er']),
        ex.imageChoice('4️⃣', '四', ['五', '三', '二'], ['zh-si']),
        ex.translationChoice('三', 'tres', ['dos', 'cuatro', 'uno'], ['zh-san']),
        ex.listenChoice('五', ['四', '一', '二'], ['zh-wu']),
        tone('四', 'sì', ['sī', 'sí', 'sǐ'], ['zh-si'], '四 es cuarto tono: baja seco (sì).'),
        ex.matchPairs(
          [
            ['一', 'uno'],
            ['二', 'dos'],
            ['三', 'tres'],
            ['四', 'cuatro'],
          ],
          ['zh-yi', 'zh-er', 'zh-san', 'zh-si'],
        ),
        write('Cinco', 'wǔ', '五', ['zh-wu']),
        write('Uno', 'yī', '一', ['zh-yi']),
      ],
    },
    {
      title: '六 a 十',
      objective: 'Contar del seis al diez.',
      intro: {
        explanation:
          '六 (liù), 七 (qī), 八 (bā), 九 (jiǔ), 十 (shí). 七 y 八 son primer tono, altos y parejos.',
        examples: [
          { target: '六，七，八，九，十。', base: 'Seis, siete, ocho, nueve, diez.' },
          { target: '十个学生', base: 'diez estudiantes' },
        ],
      },
      takeaways: ['Contás del seis al diez.', 'Reconocés los números de oído.'],
      exercises: [
        ex.imageChoice('7️⃣', '七', ['六', '八', '九'], ['zh-qi']),
        ex.imageChoice('🔟', '十', ['九', '八', '七'], ['zh-shi-10']),
        ex.translationChoice('八', 'ocho', ['siete', 'nueve', 'seis'], ['zh-ba']),
        ex.listenChoice('九', ['六', '十', '七'], ['zh-jiu']),
        tone(
          '十',
          'shí',
          ['shī', 'shǐ', 'shì'],
          ['zh-shi-10'],
          '十 es segundo tono: sube (shí). Con cuarto tono, shì, es 是.',
        ),
        ex.matchPairs(
          [
            ['六', 'seis'],
            ['七', 'siete'],
            ['八', 'ocho'],
            ['九', 'nueve'],
          ],
          ['zh-liu', 'zh-qi', 'zh-ba', 'zh-jiu'],
        ),
        write('Diez', 'shí', '十', ['zh-shi-10']),
        write('Seis', 'liù', '六', ['zh-liu']),
      ],
    },
    {
      title: 'Hasta veinte',
      objective: 'Armar números con 十.',
      intro: {
        explanation:
          'Del 11 al 19 se dice 十 + unidad: 十五 (15), 十八 (18). Las decenas, número + 十: 二十 (20). 十二 es 12 y 二十, 20: el orden importa.',
        examples: [
          { target: '十五', base: 'quince' },
          { target: '二十', base: 'veinte' },
        ],
      },
      takeaways: ['Armás del 11 al 20 con 十.', 'Distinguís 十二 (12) de 二十 (20).'],
      exercises: [
        ex.translationChoice(
          '十八',
          'dieciocho',
          ['ochenta', 'dieciséis', 'veinte'],
          ['zh-shi-10', 'zh-ba'],
        ),
        ex.translationChoice('二十', 'veinte', ['doce', 'dos', 'diez'], ['zh-er', 'zh-shi-10'], {
          explanation: '二十 es «dos dieces»: 20. 十二 sería 12.',
        }),
        ex.listenChoice('十五', ['五十', '十四', '二十'], ['zh-shi-10', 'zh-wu']),
        ex.fillBlank(
          '十 + 十 = ___',
          '10 + 10 = 20',
          '二十',
          ['十二', '两十', '十十'],
          ['zh-er', 'zh-shi-10'],
          {
            skill: 'vocabulary',
            explanation: '20 es 二十. 十二 es 12 y «两十» no se usa.',
          },
        ),
        ex.matchPairs(
          [
            ['十二', 'doce'],
            ['二十', 'veinte'],
            ['十五', 'quince'],
            ['十八', 'dieciocho'],
          ],
          ['zh-shi-10', 'zh-er', 'zh-wu', 'zh-ba'],
        ),
        ex.translationChoice('十二', 'doce', ['veinte', 'dos', 'once'], ['zh-shi-10', 'zh-er']),
        write('Quince', 'shíwǔ', '十五', ['zh-shi-10', 'zh-wu'], { accepted: ['shí wǔ'] }),
        write('Veinte', 'èrshí', '二十', ['zh-er', 'zh-shi-10'], { accepted: ['èr shí'] }),
      ],
    },
    {
      title: '你几岁？',
      objective: 'Preguntar y decir la edad.',
      intro: {
        explanation:
          'La edad se dice sin verbo: 我二十岁 «yo veinte años». A un chico se le pregunta 你几岁？ (几 es para números chicos); a un joven o adulto, 你多大？',
        examples: [
          { target: '你多大？', base: '¿Qué edad tenés?' },
          { target: '我十八岁。', base: 'Tengo dieciocho años.' },
          { target: '你几岁？', base: '¿Cuántos años tenés?', note: 'a un chico' },
        ],
      },
      takeaways: [
        'Decís tu edad con número + 岁.',
        'Preguntás 你多大？ a adultos y 你几岁？ a chicos.',
      ],
      exercises: [
        ex.translationChoice('岁', 'años (de edad)', ['este año', '¿cuántos?', 'diez'], ['zh-sui']),
        ex.translationChoice(
          '多大',
          '¿qué edad?',
          ['¿cuál?', '¿cuántos?', 'este año'],
          ['zh-duo-da'],
        ),
        ex.listenChoice('你多大？', ['你好吗？', '你呢？', '你是哪国人？'], ['zh-duo-da']),
        ex.fillBlank(
          '我二十___。',
          'Tengo veinte años.',
          '岁',
          ['人', '是', '几'],
          ['zh-sui', 'zh-er', 'zh-shi-10'],
          {
            skill: 'grammar',
            explanation: 'La edad va con 岁 y sin verbo: 我二十岁. «我是二十岁» no hace falta.',
          },
        ),
        ex.fillBlank(
          '你___岁？',
          '¿Cuántos años tenés? (a un chico)',
          '几',
          ['什么', '哪', '吗'],
          ['zh-ji', 'zh-sui'],
          {
            skill: 'grammar',
            explanation: '几 pregunta por una cantidad chica. 什么 es «qué» y 哪, «cuál».',
          },
        ),
        ex.orderWords('我 十八 岁。', 'Tengo dieciocho años.', [
          'zh-wo',
          'zh-shi-10',
          'zh-ba',
          'zh-sui',
        ]),
        write('¿Qué edad tenés?', 'nǐ duō dà', '你多大', ['zh-duo-da'], { accepted: ['nǐ duōdà'] }),
        write(
          'Tengo veinte años.',
          'wǒ èrshí suì',
          '我二十岁',
          ['zh-wo', 'zh-er', 'zh-shi-10', 'zh-sui'],
          {
            accepted: ['wǒ èr shí suì', 'wǒ èrshísuì'],
          },
        ),
      ],
    },
    {
      title: '两 y 今年',
      objective: 'Usar 两 para contar y decir tu edad este año.',
      intro: {
        explanation:
          'Para contar cosas o medidas, «dos» es 两 (liǎng), no 二: 两岁 (dos años). 二 se usa al contar en voz alta y dentro de números como 十二 o 二十. 今年 es «este año».',
        examples: [
          { target: '他两岁。', base: 'Él tiene dos años.' },
          {
            target: '我今年十八岁。',
            base: 'Tengo dieciocho años.',
            note: 'literalmente «este año tengo»',
          },
        ],
      },
      takeaways: [
        'Usás 两 para «dos» antes de una medida.',
        'Decís tu edad con 今年 + número + 岁.',
      ],
      exercises: [
        ex.translationChoice(
          '今年',
          'este año',
          ['años (de edad)', '¿cuántos?', 'diez'],
          ['zh-jinnian'],
        ),
        ex.fillBlank(
          '他___岁。',
          'Él tiene dos años.',
          '两',
          ['二', '几', '十'],
          ['zh-liang', 'zh-sui'],
          {
            skill: 'grammar',
            explanation:
              'Antes de una medida como 岁 se usa 两: 两岁. 二 va al contar o dentro de un número (十二).',
          },
        ),
        ex.listenChoice(
          '我今年二十岁。',
          ['我今年十八岁。', '我二十二岁。', '她今年两岁。'],
          ['zh-jinnian', 'zh-er', 'zh-sui'],
        ),
        tone('两', 'liǎng', ['liāng', 'liáng', 'liàng'], ['zh-liang']),
        ex.orderWords('我 今年 十八 岁。', 'Tengo dieciocho años.', [
          'zh-wo',
          'zh-jinnian',
          'zh-shi-10',
          'zh-ba',
          'zh-sui',
        ]),
        ex.matchPairs(
          [
            ['两', 'dos (para contar)'],
            ['岁', 'años de edad'],
            ['今年', 'este año'],
            ['几', '¿cuántos?'],
          ],
          ['zh-liang', 'zh-sui', 'zh-jinnian', 'zh-ji'],
        ),
        write('Él tiene dos años.', 'tā liǎng suì', '他两岁', ['zh-ta-he', 'zh-liang', 'zh-sui'], {
          accepted: ['tā jīnnián liǎng suì', '她两岁'],
          explanation: 'Dos años es 两岁, con 两 y no con 二.',
        }),
        write(
          'Tengo dieciocho años.',
          'wǒ jīnnián shíbā suì',
          '我今年十八岁',
          ['zh-wo', 'zh-jinnian', 'zh-shi-10', 'zh-ba', 'zh-sui'],
          {
            accepted: ['wǒ shíbā suì', 'wǒ jīnnián shí bā suì', 'wǒ shí bā suì', '我十八岁'],
          },
        ),
      ],
    },
  ],
};

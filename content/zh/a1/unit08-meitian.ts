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
 * tiempo + verbo).
 */
export const unit08: UnitDef = {
  position: 8,
  title: 'Todos los días',
  titleEn: '每天',
  description:
    'Contar tu rutina: levantarte, desayunar, trabajar o estudiar, con la palabra de tiempo antes del verbo.',
  emoji: '🌅',
  objective:
    'Podés contar qué hacés en un día normal (起床, 工作, 学习, 睡觉) y cuándo (每天, 早上, 晚上), con el tiempo antes del verbo.',
  grammar: {
    title: 'Tiempo antes del verbo',
    explanation:
      'En chino la palabra de tiempo va antes del verbo, nunca al final: 我每天学习中文 («yo todos los días estudio chino»). También puede ir al principio de la oración: 早上我喝咖啡. El verbo no cambia nunca.',
    examples: [
      { target: '我每天学习中文。', base: 'Estudio chino todos los días.' },
      { target: '早上我喝咖啡。', base: 'A la mañana tomo café.' },
      { target: '我晚上看电视。', base: 'A la noche miro la tele.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos y orden tiempo + verbo.',
  },
  words: [
    w(
      'zh-meitian',
      '每天',
      'měitiān',
      'todos los días',
      '我每天学习中文。',
      'Estudio chino todos los días.',
      ['time'],
      { acceptedTranslations: ['cada día'] },
    ),
    w(
      'zh-zaoshang',
      '早上',
      'zǎoshang',
      'a la mañana',
      '早上我喝咖啡。',
      'A la mañana tomo café.',
      ['time'],
      { acceptedTranslations: ['por la mañana'] },
    ),
    w('zh-xiawu', '下午', 'xiàwǔ', 'a la tarde', '我下午工作。', 'A la tarde trabajo.', ['time'], {
      acceptedTranslations: ['por la tarde'],
    }),
    w(
      'zh-wanshang',
      '晚上',
      'wǎnshang',
      'a la noche',
      '我晚上看电视。',
      'A la noche miro la tele.',
      ['time'],
      { acceptedTranslations: ['por la noche'] },
    ),
    w(
      'zh-qichuang',
      '起床',
      'qǐchuáng',
      'levantarse',
      '我早上起床。',
      'Me levanto a la mañana.',
      ['verbs', 'routine'],
      { emoji: '⏰' },
    ),
    w('zh-zaofan', '早饭', 'zǎofàn', 'desayuno', '我吃早饭。', 'Desayuno.', ['food', 'routine'], {
      emoji: '🥣',
    }),
    w(
      'zh-gongzuo',
      '工作',
      'gōngzuò',
      'trabajar',
      '他在家工作。',
      'Él trabaja en casa.',
      ['verbs', 'work'],
      {
        acceptedTranslations: ['trabajo'],
        emoji: '💼',
      },
    ),
    w(
      'zh-xuexi',
      '学习',
      'xuéxí',
      'estudiar',
      '我每天学习中文。',
      'Estudio chino todos los días.',
      ['verbs'],
    ),
    w('zh-kan', '看', 'kàn', 'mirar / leer', '我晚上看书。', 'A la noche leo.', ['verbs'], {
      acceptedTranslations: ['mirar', 'ver', 'leer'],
    }),
    w(
      'zh-dianshi',
      '电视',
      'diànshì',
      'tele',
      '我晚上看电视。',
      'A la noche miro la tele.',
      ['things'],
      { acceptedTranslations: ['televisión'], emoji: '📺' },
    ),
    w('zh-shuo', '说', 'shuō', 'hablar', '你说中文吗？', '¿Hablás chino?', ['verbs'], {
      acceptedTranslations: ['decir'],
    }),
    w(
      'zh-zuofan',
      '做饭',
      'zuò fàn',
      'cocinar',
      '妈妈常常做饭。',
      'Mamá cocina seguido.',
      ['verbs'],
      {
        emoji: '🍳',
      },
    ),
    w(
      'zh-shuijiao',
      '睡觉',
      'shuìjiào',
      'dormir',
      '我晚上睡觉。',
      'A la noche duermo.',
      ['verbs'],
      {
        emoji: '😴',
      },
    ),
    w(
      'zh-zaijia',
      '在家',
      'zài jiā',
      'en casa',
      '他在家工作。',
      'Él trabaja en casa.',
      ['places'],
      {
        emoji: '🏠',
      },
    ),
    w(
      'zh-ranhou',
      '然后',
      'ránhòu',
      'después',
      '我起床，然后吃早饭。',
      'Me levanto y después desayuno.',
      ['time'],
      { acceptedTranslations: ['luego'] },
    ),
    w(
      'zh-changchang',
      '常常',
      'chángcháng',
      'seguido (a menudo)',
      '我常常做饭。',
      'Cocino seguido.',
      ['time'],
      { acceptedTranslations: ['a menudo', 'seguido', 'frecuentemente'] },
    ),
  ],
  lessons: [
    {
      title: '早上',
      objective: 'Contar cómo empieza tu día.',
      intro: {
        explanation:
          '起床 (qǐchuáng) es «levantarse». 早饭 (zǎofàn) es «desayuno»: 吃早饭 es «desayunar». 早上 (zǎoshang) «a la mañana» va antes del verbo: 我早上起床.',
        examples: [
          { target: '我早上起床。', base: 'Me levanto a la mañana.' },
          { target: '早上我吃早饭。', base: 'A la mañana desayuno.' },
        ],
      },
      takeaways: ['Decís que te levantás con 起床.', 'Ponés el tiempo antes del verbo.'],
      exercises: [
        ex.imageChoice('⏰', '起床', ['睡觉', '工作', '吃'], ['zh-qichuang']),
        ex.translationChoice(
          '早上',
          'a la mañana',
          ['a la noche', 'a la tarde', 'todos los días'],
          ['zh-zaoshang'],
        ),
        ex.translationChoice('早饭', 'desayuno', ['arroz', 'fideos', 'cocina'], ['zh-zaofan']),
        tone('早上', 'zǎoshang', ['zāoshang', 'záoshang', 'zàoshang'], ['zh-zaoshang']),
        ex.listenChoice(
          '我早上起床。',
          ['我晚上起床。', '我早上吃早饭。', '我早上喝茶。'],
          ['zh-zaoshang', 'zh-qichuang'],
        ),
        ex.fillBlank(
          '我早上吃___。',
          'A la mañana desayuno.',
          '早饭',
          ['水', '茶', '书'],
          ['zh-zaoshang', 'zh-chi', 'zh-zaofan'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords(
          '我 早上 吃 早饭。',
          'A la mañana desayuno.',
          ['zh-zaoshang', 'zh-chi', 'zh-zaofan'],
          { explanation: 'El tiempo va antes del verbo: 我早上吃早饭.' },
        ),
        write(
          'Me levanto a la mañana.',
          'wǒ zǎoshang qǐchuáng',
          '我早上起床',
          ['zh-wo', 'zh-zaoshang', 'zh-qichuang'],
          { accepted: ['zǎoshang wǒ qǐchuáng', '早上我起床'] },
        ),
        write('Desayuno.', 'wǒ chī zǎofàn', '我吃早饭', ['zh-chi', 'zh-zaofan'], {
          accepted: ['chī zǎofàn', '吃早饭'],
        }),
      ],
    },
    {
      title: '工作和学习',
      objective: 'Decir si trabajás o estudiás.',
      intro: {
        explanation:
          '工作 (gōngzuò) es «trabajar» y también «trabajo». 学习 (xuéxí) es «estudiar»: 学 es el mismo de 学生 (estudiante). 在家 (zài jiā) es «en casa» y va antes del verbo: 我在家工作.',
        examples: [
          { target: '他在家工作。', base: 'Él trabaja en casa.' },
          { target: '我学习中文。', base: 'Estudio chino.' },
        ],
      },
      takeaways: ['Decís si trabajás o estudiás.', 'Decís dónde con 在家 antes del verbo.'],
      exercises: [
        ex.imageChoice('💼', '工作', ['学习', '睡觉', '做饭'], ['zh-gongzuo']),
        ex.translationChoice('学习', 'estudiar', ['trabajar', 'dormir', 'hablar'], ['zh-xuexi']),
        tone('工作', 'gōngzuò', ['gǒngzuò', 'gòngzuò', 'góngzuò'], ['zh-gongzuo']),
        ex.listenChoice(
          '他在家工作。',
          ['他在家学习。', '她在家工作。', '他在家睡觉。'],
          ['zh-ta-he', 'zh-zaijia', 'zh-gongzuo'],
        ),
        ex.fillBlank(
          '我___中文。',
          'Estudio chino.',
          '学习',
          ['工作', '睡觉', '起床'],
          ['zh-xuexi', 'zh-zhongwen'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('我 在家 工作。', 'Trabajo en casa.', ['zh-zaijia', 'zh-gongzuo'], {
          explanation: 'El lugar con 在 va antes del verbo: 我在家工作.',
        }),
        write('Trabajo en casa.', 'wǒ zài jiā gōngzuò', '我在家工作', [
          'zh-wo',
          'zh-zaijia',
          'zh-gongzuo',
        ]),
        write('Estudio chino.', 'wǒ xuéxí Zhōngwén', '我学习中文', ['zh-xuexi', 'zh-zhongwen'], {
          accepted: ['wǒ xuéxí zhōngwén'],
        }),
      ],
    },
    {
      title: '看和说',
      objective: 'Decir qué mirás, leés y hablás.',
      intro: {
        explanation:
          '看 (kàn) es «mirar»: 看电视 «mirar la tele». Con un libro es «leer»: 看书. 说 (shuō) es «hablar, decir»: 说中文 «hablar chino».',
        examples: [
          { target: '我晚上看电视。', base: 'A la noche miro la tele.' },
          { target: '你说中文吗？', base: '¿Hablás chino?' },
        ],
      },
      takeaways: ['Usás 看 para mirar la tele y leer un libro.', 'Decís qué idioma hablás con 说.'],
      exercises: [
        ex.imageChoice('📺', '电视', ['书', '手机', '电脑'], ['zh-dianshi']),
        ex.translationChoice('看', 'mirar / leer', ['hablar', 'comer', 'tener'], ['zh-kan']),
        ex.translationChoice('说', 'hablar', ['mirar / leer', 'estudiar', 'beber'], ['zh-shuo']),
        tone('说', 'shuō', ['shuó', 'shuǒ', 'shuò'], ['zh-shuo']),
        ex.listenChoice(
          '你说中文吗？',
          ['你是中国人吗？', '你看书吗？', '你学习中文吗？'],
          ['zh-shuo', 'zh-zhongwen', 'zh-ma'],
        ),
        ex.fillBlank(
          '我晚上___电视。',
          'A la noche miro la tele.',
          '看',
          ['说', '吃', '喝'],
          ['zh-wanshang', 'zh-kan', 'zh-dianshi'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('我 晚上 看 书。', 'A la noche leo.', ['zh-wanshang', 'zh-kan', 'zh-shu']),
        write(
          'A la noche miro la tele.',
          'wǒ wǎnshang kàn diànshì',
          '我晚上看电视',
          ['zh-wanshang', 'zh-kan', 'zh-dianshi'],
          { accepted: ['wǎnshang wǒ kàn diànshì', '晚上我看电视'] },
        ),
        write(
          '¿Hablás chino?',
          'nǐ shuō Zhōngwén ma',
          '你说中文吗',
          ['zh-ni', 'zh-shuo', 'zh-zhongwen', 'zh-ma'],
          { accepted: ['nǐ shuō zhōngwén ma'] },
        ),
      ],
    },
    {
      title: '下午和晚上',
      objective: 'Ubicar lo que hacés en la tarde y en la noche.',
      intro: {
        explanation:
          '下午 (xiàwǔ) es «a la tarde» y 晚上 (wǎnshang) «a la noche». 做饭 (zuò fàn) es «cocinar» y 睡觉 (shuìjiào) «dormir». Todos van con el tiempo adelante: 我晚上做饭.',
        examples: [
          { target: '我下午工作。', base: 'A la tarde trabajo.' },
          { target: '我晚上做饭。', base: 'A la noche cocino.' },
        ],
      },
      takeaways: ['Decís qué hacés a la tarde y a la noche.', 'Decís que cocinás y que dormís.'],
      exercises: [
        ex.translationChoice(
          '下午',
          'a la tarde',
          ['a la mañana', 'a la noche', 'después'],
          ['zh-xiawu'],
        ),
        ex.imageChoice('😴', '睡觉', ['起床', '做饭', '工作'], ['zh-shuijiao']),
        ex.imageChoice('🍳', '做饭', ['睡觉', '看', '说'], ['zh-zuofan']),
        tone('晚上', 'wǎnshang', ['wānshang', 'wánshang', 'wànshang'], ['zh-wanshang']),
        ex.listenChoice(
          '我晚上做饭。',
          ['我下午做饭。', '我晚上睡觉。', '我晚上吃米饭。'],
          ['zh-wanshang', 'zh-zuofan'],
        ),
        ex.matchPairs(
          [
            ['早上', 'a la mañana'],
            ['下午', 'a la tarde'],
            ['晚上', 'a la noche'],
            ['睡觉', 'dormir'],
          ],
          ['zh-zaoshang', 'zh-xiawu', 'zh-wanshang', 'zh-shuijiao'],
        ),
        ex.orderWords('我 下午 工作。', 'A la tarde trabajo.', ['zh-xiawu', 'zh-gongzuo']),
        write(
          'A la noche cocino.',
          'wǒ wǎnshang zuò fàn',
          '我晚上做饭',
          ['zh-wanshang', 'zh-zuofan'],
          { accepted: ['wǎnshang wǒ zuò fàn', '晚上我做饭'] },
        ),
        write('A la tarde estudio.', 'wǒ xiàwǔ xuéxí', '我下午学习', ['zh-xiawu', 'zh-xuexi'], {
          accepted: ['xiàwǔ wǒ xuéxí', '下午我学习'],
        }),
      ],
    },
    {
      title: '每天',
      objective: 'Contar tu rutina en orden.',
      intro: {
        explanation:
          '每天 (měitiān) es «todos los días»; 常常 (chángcháng) «seguido»; 然后 (ránhòu) «después». 每天 y 常常 van antes del verbo: 我每天学习, 我常常做饭.',
        examples: [
          { target: '我每天学习中文。', base: 'Estudio chino todos los días.' },
          { target: '我起床，然后吃早饭。', base: 'Me levanto y después desayuno.' },
        ],
      },
      takeaways: ['Contás tu rutina con 每天 y 然后.', 'Ponés 常常 antes del verbo.'],
      exercises: [
        ex.translationChoice(
          '每天',
          'todos los días',
          ['a la mañana', 'seguido (a menudo)', 'después'],
          ['zh-meitian'],
        ),
        ex.translationChoice(
          '然后',
          'después',
          ['todos los días', 'también', 'muy'],
          ['zh-ranhou'],
        ),
        tone('每天', 'měitiān', ['mēitiān', 'méitiān', 'mèitiān'], ['zh-meitian']),
        ex.listenChoice(
          '我常常做饭。',
          ['我每天做饭。', '我常常睡觉。', '妈妈常常做饭。'],
          ['zh-changchang', 'zh-zuofan'],
        ),
        ex.fillBlank(
          '我起床，___吃早饭。',
          'Me levanto y después desayuno.',
          '然后',
          ['每天', '也', '很'],
          ['zh-qichuang', 'zh-ranhou', 'zh-zaofan'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords(
          '我 每天 学习 中文。',
          'Estudio chino todos los días.',
          ['zh-meitian', 'zh-xuexi', 'zh-zhongwen'],
          { explanation: '每天 va antes del verbo, no al final.' },
        ),
        write(
          'Estudio chino todos los días.',
          'wǒ měitiān xuéxí Zhōngwén',
          '我每天学习中文',
          ['zh-meitian', 'zh-xuexi', 'zh-zhongwen'],
          {
            accepted: ['wǒ měitiān xuéxí zhōngwén', 'měitiān wǒ xuéxí Zhōngwén', '每天我学习中文'],
          },
        ),
        write('Cocino seguido.', 'wǒ chángcháng zuò fàn', '我常常做饭', [
          'zh-changchang',
          'zh-zuofan',
        ]),
      ],
    },
  ],
};

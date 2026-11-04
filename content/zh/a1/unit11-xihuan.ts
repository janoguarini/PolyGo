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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (tonos, 会 / 能 y
 * 不 → bú antes de 会).
 */
export const unit11: UnitDef = {
  position: 11,
  title: 'Gustos y habilidades',
  titleEn: '喜欢',
  description:
    'Decir lo que te gusta con 喜欢, lo que sabés hacer con 会, lo que podés con 能 y cómo estás con 很 + adjetivo.',
  emoji: '❤️',
  objective:
    'Podés decir 我喜欢… / 我不喜欢…, contar lo que sabés hacer (我会游泳), decir si podés (我今天不能去) y describir con 很 + adjetivo (我很忙).',
  grammar: {
    title: '喜欢 + cosa o verbo · 会 y 能 · 很 + adjetivo',
    explanation:
      '喜欢 (xǐhuan) es «gustar» y funciona como un verbo común: 我喜欢猫 («me gustan los gatos», literalmente «yo gusto gatos»); también va con otro verbo: 我喜欢看电影. 会 (huì) es «saber hacer algo aprendido» (我会游泳) y 能 (néng) es «poder» en ese momento (我今天不能去). Los adjetivos van con 很 y sin 是: 我很忙.',
    examples: [
      { target: '我喜欢听音乐。', base: 'Me gusta escuchar música.' },
      { target: '你会说中文吗？', base: '¿Sabés hablar chino?' },
      { target: '今天我很累。', base: 'Hoy estoy muy cansado/a.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, uso de 会 / 能 y 不 → bú antes de 会.',
  },
  words: [
    w(
      'zh-xihuan',
      '喜欢',
      'xǐhuan',
      'gustar',
      '我喜欢猫。',
      'Me gustan los gatos.',
      ['verbs', 'likes'],
      {
        acceptedTranslations: ['me gusta'],
      },
    ),
    w(
      'zh-ting',
      '听',
      'tīng',
      'escuchar',
      '我喜欢听音乐。',
      'Me gusta escuchar música.',
      ['verbs'],
      {
        acceptedTranslations: ['oír'],
      },
    ),
    w(
      'zh-yinyue',
      '音乐',
      'yīnyuè',
      'música',
      '我喜欢听音乐。',
      'Me gusta escuchar música.',
      ['hobbies'],
      {
        emoji: '🎵',
      },
    ),
    w(
      'zh-dianying',
      '电影',
      'diànyǐng',
      'película',
      '你喜欢看电影吗？',
      '¿Te gusta ver películas?',
      ['hobbies'],
      { acceptedTranslations: ['cine'], emoji: '🎬' },
    ),
    w('zh-youyong', '游泳', 'yóuyǒng', 'nadar', '我会游泳。', 'Sé nadar.', ['verbs', 'hobbies'], {
      emoji: '🏊',
    }),
    w(
      'zh-changge',
      '唱歌',
      'chànggē',
      'cantar',
      '我不喜欢唱歌。',
      'No me gusta cantar.',
      ['verbs', 'hobbies'],
      {
        emoji: '🎤',
      },
    ),
    w(
      'zh-tiaowu',
      '跳舞',
      'tiàowǔ',
      'bailar',
      '你会跳舞吗？',
      '¿Sabés bailar?',
      ['verbs', 'hobbies'],
      {
        emoji: '💃',
      },
    ),
    w(
      'zh-ti-zuqiu',
      '踢足球',
      'tī zúqiú',
      'jugar al fútbol',
      '我喜欢踢足球。',
      'Me gusta jugar al fútbol.',
      ['verbs', 'hobbies'],
      { emoji: '⚽' },
    ),
    w('zh-kaiche', '开车', 'kāichē', 'manejar', '我不会开车。', 'No sé manejar.', ['verbs'], {
      acceptedTranslations: ['conducir'],
      emoji: '🚗',
    }),
    w('zh-hui', '会', 'huì', 'saber (hacer algo)', '我会游泳。', 'Sé nadar.', ['verbs'], {
      acceptedTranslations: ['saber'],
    }),
    w('zh-neng', '能', 'néng', 'poder', '明天你能来吗？', '¿Mañana podés venir?', ['verbs']),
    w(
      'zh-mang',
      '忙',
      'máng',
      'ocupado',
      '我今天很忙。',
      'Hoy estoy muy ocupado/a.',
      ['adjectives'],
      {
        acceptedTranslations: ['ocupada'],
      },
    ),
    w('zh-lei', '累', 'lèi', 'cansado', '我很累。', 'Estoy muy cansado/a.', ['adjectives'], {
      acceptedTranslations: ['cansada'],
      emoji: '😩',
    }),
    w(
      'zh-gaoxing',
      '高兴',
      'gāoxìng',
      'contento',
      '我很高兴。',
      'Estoy muy contento/a.',
      ['adjectives'],
      {
        acceptedTranslations: ['contenta', 'feliz'],
        emoji: '😊',
      },
    ),
    w(
      'zh-piaoliang',
      '漂亮',
      'piàoliang',
      'lindo',
      '她很漂亮。',
      'Ella es muy linda.',
      ['adjectives'],
      {
        acceptedTranslations: ['linda', 'bonito', 'bonita'],
      },
    ),
    w('zh-da', '大', 'dà', 'grande', '这个房间很大。', 'Esta habitación es muy grande.', [
      'adjectives',
    ]),
    w(
      'zh-xiao',
      '小',
      'xiǎo',
      'chico',
      '我的房间很小。',
      'Mi habitación es muy chica.',
      ['adjectives'],
      {
        acceptedTranslations: ['chica', 'pequeño', 'pequeña'],
      },
    ),
    w(
      'zh-feichang',
      '非常',
      'fēicháng',
      'muchísimo',
      '我非常喜欢踢足球。',
      'Me encanta jugar al fútbol.',
      ['adjectives'],
      { acceptedTranslations: ['sumamente'] },
    ),
  ],
  lessons: [
    {
      title: '我喜欢…',
      objective: 'Decir lo que te gusta y lo que no.',
      intro: {
        explanation:
          '喜欢 (xǐhuan) es «gustar», pero se usa como un verbo común: 我喜欢猫 es «me gustan los gatos» (literalmente «yo gusto gatos»). Para negar, 不 va antes: 我不喜欢…',
        examples: [
          { target: '我喜欢猫。', base: 'Me gustan los gatos.' },
          { target: '我不喜欢牛奶。', base: 'No me gusta la leche.' },
        ],
      },
      takeaways: ['Decís lo que te gusta con 喜欢.', 'Negás con 不喜欢.'],
      exercises: [
        ex.translationChoice(
          '喜欢',
          'gustar',
          ['querer (pedir)', 'tener', 'saber (hacer algo)'],
          ['zh-xihuan'],
        ),
        tone('喜欢', 'xǐhuan', ['xīhuan', 'xíhuan', 'xìhuan'], ['zh-xihuan']),
        ex.imageChoice('🎵', '音乐', ['电影', '电视', '手机'], ['zh-yinyue']),
        ex.imageChoice('🎬', '电影', ['音乐', '电脑', '书'], ['zh-dianying']),
        ex.listenChoice(
          '我不喜欢牛奶。',
          ['我喜欢牛奶。', '我不喜欢咖啡。', '我不要牛奶。'],
          ['zh-bu', 'zh-xihuan', 'zh-niunai'],
        ),
        ex.fillBlank(
          '我___喜欢茶。',
          'No me gusta el té.',
          '不',
          ['没', '很', '也'],
          ['zh-bu', 'zh-xihuan', 'zh-cha'],
          { explanation: '喜欢 se niega con 不.' },
        ),
        ex.orderWords('我 喜欢 听 音乐。', 'Me gusta escuchar música.', [
          'zh-xihuan',
          'zh-ting',
          'zh-yinyue',
        ]),
        write('Me gustan los gatos.', 'wǒ xǐhuan māo', '我喜欢猫', [
          'zh-wo',
          'zh-xihuan',
          'zh-mao',
        ]),
        write('¿Te gusta ver películas?', 'nǐ xǐhuan kàn diànyǐng ma', '你喜欢看电影吗', [
          'zh-xihuan',
          'zh-kan',
          'zh-dianying',
          'zh-ma',
        ]),
      ],
    },
    {
      title: '唱歌和跳舞',
      objective: 'Hablar de pasatiempos.',
      intro: {
        explanation:
          'Muchas actividades son verbo + cosa: 唱歌 «cantar» (cantar canciones), 跳舞 «bailar», 踢足球 «jugar al fútbol» (patear la pelota). Van después de 喜欢: 我喜欢跳舞.',
        examples: [
          { target: '我喜欢跳舞。', base: 'Me gusta bailar.' },
          { target: '他非常喜欢踢足球。', base: 'A él le encanta jugar al fútbol.' },
        ],
      },
      takeaways: ['Nombrás pasatiempos.', 'Decís que algo te encanta con 非常喜欢.'],
      exercises: [
        ex.imageChoice('🎤', '唱歌', ['跳舞', '游泳', '睡觉'], ['zh-changge']),
        ex.imageChoice('💃', '跳舞', ['唱歌', '走路', '做饭'], ['zh-tiaowu']),
        ex.imageChoice('⚽', '踢足球', ['游泳', '开车', '跳舞'], ['zh-ti-zuqiu']),
        ex.translationChoice(
          '非常',
          'muchísimo',
          ['también', 'después', 'seguido (a menudo)'],
          ['zh-feichang'],
        ),
        ex.listenChoice(
          '他非常喜欢踢足球。',
          ['他很喜欢踢足球。', '他非常喜欢唱歌。', '她非常喜欢踢足球。'],
          ['zh-ta-he', 'zh-feichang', 'zh-xihuan', 'zh-ti-zuqiu'],
        ),
        ex.matchPairs(
          [
            ['唱歌', 'cantar'],
            ['跳舞', 'bailar'],
            ['听', 'escuchar'],
            ['音乐', 'música'],
          ],
          ['zh-changge', 'zh-tiaowu', 'zh-ting', 'zh-yinyue'],
        ),
        ex.orderWords('我 不 喜欢 唱歌。', 'No me gusta cantar.', [
          'zh-bu',
          'zh-xihuan',
          'zh-changge',
        ]),
        write('Me gusta bailar.', 'wǒ xǐhuan tiàowǔ', '我喜欢跳舞', ['zh-xihuan', 'zh-tiaowu']),
        write(
          'Me encanta jugar al fútbol.',
          'wǒ fēicháng xǐhuan tī zúqiú',
          '我非常喜欢踢足球',
          ['zh-feichang', 'zh-xihuan', 'zh-ti-zuqiu'],
          { accepted: ['wǒ hěn xǐhuan tī zúqiú'] },
        ),
      ],
    },
    {
      title: '我会游泳',
      objective: 'Decir lo que sabés hacer.',
      intro: {
        explanation:
          '会 (huì) es «saber hacer» algo que se aprende: nadar, manejar, un idioma. Va antes del verbo: 我会游泳. Se niega con 不, que antes del cuarto tono de 会 se dice bú: 我不会开车 (wǒ bú huì kāichē).',
        examples: [
          { target: '我会游泳。', base: 'Sé nadar.' },
          { target: '你会说中文吗？', base: '¿Sabés hablar chino?' },
        ],
      },
      takeaways: ['Decís lo que sabés hacer con 会.', 'Decís lo que no sabés con 不会.'],
      exercises: [
        ex.translationChoice(
          '会',
          'saber (hacer algo)',
          ['poder', 'gustar', 'querer (pedir)'],
          ['zh-hui'],
        ),
        tone('会', 'huì', ['huī', 'huí', 'huǐ'], ['zh-hui']),
        ex.imageChoice('🏊', '游泳', ['开车', '唱歌', '踢足球'], ['zh-youyong']),
        ex.imageChoice('🚗', '开车', ['游泳', '坐', '走路'], ['zh-kaiche']),
        ex.listenChoice(
          '你会说中文吗？',
          ['你会开车吗？', '你喜欢中文吗？', '你说中文吗？'],
          ['zh-hui', 'zh-shuo', 'zh-zhongwen', 'zh-ma'],
        ),
        ex.fillBlank(
          '我___游泳。',
          'Sé nadar.',
          '会',
          ['是', '在', '去'],
          ['zh-hui', 'zh-youyong'],
          { explanation: 'Para algo aprendido, como nadar, se usa 会.' },
        ),
        ex.orderWords('我 不 会 开车。', 'No sé manejar.', ['zh-bu', 'zh-hui', 'zh-kaiche'], {
          explanation: '不 va antes de 会 y se pronuncia bú.',
        }),
        write('Sé nadar.', 'wǒ huì yóuyǒng', '我会游泳', ['zh-hui', 'zh-youyong']),
        write(
          'No sé manejar.',
          'wǒ bú huì kāichē',
          '我不会开车',
          ['zh-bu', 'zh-hui', 'zh-kaiche'],
          {
            accepted: ['wǒ bù huì kāichē', 'wǒbùhuìkāichē'],
            explanation: '不 antes de un cuarto tono (会) se dice bú.',
          },
        ),
      ],
    },
    {
      title: '你能来吗？',
      objective: 'Decir si podés hacer algo.',
      intro: {
        explanation:
          '能 (néng) es «poder»: si es posible en ese momento. 我今天不能去 «hoy no puedo ir». Compará: 我会游泳 (sé nadar) y 今天我不能游泳 (hoy no puedo nadar).',
        examples: [
          { target: '明天你能来吗？', base: '¿Mañana podés venir?' },
          { target: '今天我不能去。', base: 'Hoy no puedo ir.' },
        ],
      },
      takeaways: ['Preguntás si alguien puede con 能…吗？', 'Distinguís 会 (saber) y 能 (poder).'],
      exercises: [
        ex.translationChoice('能', 'poder', ['saber (hacer algo)', 'venir', 'tener'], ['zh-neng']),
        tone('能', 'néng', ['nēng', 'něng', 'nèng'], ['zh-neng']),
        ex.listenChoice(
          '明天你能来吗？',
          ['明天你会来吗？', '今天你能来吗？', '明天你能去吗？'],
          ['zh-mingtian', 'zh-neng', 'zh-lai', 'zh-ma'],
        ),
        ex.fillBlank(
          '今天我不___去。',
          'Hoy no puedo ir.',
          '能',
          ['会', '是', '在'],
          ['zh-jintian', 'zh-bu', 'zh-neng', 'zh-qu'],
          { explanation: 'Poder en este momento: 能. Saber hacer: 会.' },
        ),
        ex.fillBlank(
          '我___说中文。',
          'Sé hablar chino.',
          '会',
          ['能', '要', '去'],
          ['zh-hui', 'zh-shuo', 'zh-zhongwen'],
          { explanation: 'Un idioma se aprende: 会.' },
        ),
        ex.orderWords('你 明天 能 来 吗？', '¿Podés venir mañana?', [
          'zh-mingtian',
          'zh-neng',
          'zh-lai',
          'zh-ma',
        ]),
        write(
          '¿Mañana podés venir?',
          'míngtiān nǐ néng lái ma',
          '明天你能来吗',
          ['zh-mingtian', 'zh-neng', 'zh-lai', 'zh-ma'],
          { accepted: ['nǐ míngtiān néng lái ma', 'nǐmíngtiānnéngláima', '你明天能来吗'] },
        ),
        write(
          'Hoy no puedo ir.',
          'jīntiān wǒ bù néng qù',
          '今天我不能去',
          ['zh-jintian', 'zh-bu', 'zh-neng', 'zh-qu'],
          {
            accepted: ['wǒ jīntiān bù néng qù', 'wǒjīntiānbùnéngqù', '我今天不能去'],
          },
        ),
      ],
    },
    {
      title: '我很忙',
      objective: 'Decir cómo estás y describir cosas.',
      intro: {
        explanation:
          'Los adjetivos van con 很 y sin 是: 我很忙 «estoy (muy) ocupado/a», 这个房间很大 «esta habitación es grande». 很 casi no suma «muy»: es lo normal. Para «muchísimo», 非常: 我非常累.',
        examples: [
          { target: '我今天很忙。', base: 'Hoy estoy ocupado/a.' },
          { target: '我的房间很小。', base: 'Mi habitación es chica.' },
        ],
      },
      takeaways: ['Decís cómo estás con 很 + adjetivo.', 'Describís cosas como grandes o chicas.'],
      exercises: [
        ex.imageChoice('😩', '累', ['高兴', '饿', '忙'], ['zh-lei']),
        ex.imageChoice('😊', '高兴', ['累', '饿', '漂亮'], ['zh-gaoxing']),
        ex.translationChoice('忙', 'ocupado', ['cansado', 'contento', 'grande'], ['zh-mang']),
        tone('忙', 'máng', ['māng', 'mǎng', 'màng'], ['zh-mang']),
        ex.listenChoice(
          '我的房间很小。',
          ['我的房间很大。', '我的房间很好。', '你的房间很小。'],
          ['zh-de', 'zh-fangjian', 'zh-hen', 'zh-xiao'],
        ),
        ex.matchPairs(
          [
            ['大', 'grande'],
            ['小', 'chico'],
            ['漂亮', 'lindo'],
            ['累', 'cansado'],
          ],
          ['zh-da', 'zh-xiao', 'zh-piaoliang', 'zh-lei'],
        ),
        ex.fillBlank(
          '她___漂亮。',
          'Ella es muy linda.',
          '很',
          ['是', '在', '有'],
          ['zh-ta-she', 'zh-hen', 'zh-piaoliang'],
          { explanation: 'Con adjetivos va 很, no 是.' },
        ),
        write('Estoy muy cansado.', 'wǒ hěn lèi', '我很累', ['zh-hen', 'zh-lei'], {
          accepted: ['wǒ fēicháng lèi', '我非常累'],
        }),
        write(
          'Hoy estoy ocupado.',
          'jīntiān wǒ hěn máng',
          '今天我很忙',
          ['zh-jintian', 'zh-hen', 'zh-mang'],
          {
            accepted: ['wǒ jīntiān hěn máng', 'wǒjīntiānhěnmáng', '我今天很忙'],
          },
        ),
      ],
    },
  ],
};

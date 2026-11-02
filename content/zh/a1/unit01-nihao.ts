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

/**
 * Escuchar una palabra y elegir su pinyin con el tono correcto. Usa el tipo listen_choice: el audio
 * son los caracteres y las opciones, el mismo pinyin con otros tonos.
 */
const tone = (hanzi: string, pinyin: string, others: string[], words: string[]): ExerciseDef => ({
  type: 'listen_choice',
  skill: 'listening',
  prompt: 'Escuchá y elegí el tono correcto',
  payload: { type: 'listen_choice', audioText: hanzi, options: [pinyin, ...others] },
  answer: pinyin,
  words,
  recommendedSeconds: 15,
});

/** Escribir en pinyin: se acepta también sin espacios, en caracteres y las variantes indicadas. */
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
 * Unidad piloto del chino mandarín (caracteres simplificados + pinyin). Introduce los tonos con el
 * vocabulario de la unidad. Redactada sin revisión de un hablante nativo: necesita revisión
 * lingüística (en especial tonos y cambios de tono) antes de publicarse para todos.
 */
export const unit01: UnitDef = {
  position: 1,
  title: 'Tonos y saludos',
  titleEn: '你好！Tones and greetings',
  description: 'Los cuatro tonos, saludar, agradecer, disculparte y decir tu nombre.',
  emoji: '👋',
  objective:
    'Podés distinguir los cuatro tonos, saludar, agradecer, disculparte, decir tu nombre y responder que estás bien.',
  grammar: {
    title: 'Los tonos',
    explanation:
      'Cada sílaba tiene un tono que cambia el significado: 1.º alto y parejo (mā), 2.º sube (má), 3.º baja y sube (mǎ), 4.º baja (mà). Sin marca, el tono es neutro y corto.',
    examples: [
      { target: '妈 mā', base: 'mamá' },
      { target: '马 mǎ', base: 'caballo' },
      { target: '骂 mà', base: 'retar' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, cambios de tono (你好, 不客气) y naturalidad de los diálogos.',
  },
  words: [
    w('zh-ni-hao', '你好', 'nǐ hǎo', 'hola', '你好，王明！', '¡Hola, Wang Ming!', ['greetings'], {
      emoji: '👋',
    }),
    w(
      'zh-nin-hao',
      '您好',
      'nín hǎo',
      'hola (formal)',
      '老师，您好！',
      '¡Hola, profe!',
      ['greetings'],
      {
        acceptedTranslations: ['hola'],
      },
    ),
    w('zh-zai-jian', '再见', 'zàijiàn', 'adiós', '老师，再见！', '¡Adiós, profe!', ['greetings'], {
      acceptedTranslations: ['chau', 'hasta luego'],
    }),
    w('zh-laoshi', '老师', 'lǎoshī', 'profesor/a', '老师好！', '¡Hola, profe!', ['people'], {
      acceptedTranslations: ['profesor', 'profesora', 'docente'],
      emoji: '🧑‍🏫',
    }),
    w('zh-xie-xie', '谢谢', 'xièxie', 'gracias', '谢谢你！', '¡Gracias!', ['courtesy']),
    w('zh-bu-keqi', '不客气', 'bú kèqi', 'de nada', '谢谢！——不客气。', '¡Gracias! — De nada.', [
      'courtesy',
    ]),
    w(
      'zh-dui-bu-qi',
      '对不起',
      'duìbuqǐ',
      'perdón',
      '对不起，老师。',
      'Perdón, profe.',
      ['courtesy'],
      {
        acceptedTranslations: ['lo siento', 'disculpá'],
      },
    ),
    w(
      'zh-mei-guanxi',
      '没关系',
      'méi guānxi',
      'no pasa nada',
      '对不起！——没关系。',
      '¡Perdón! — No pasa nada.',
      ['courtesy'],
      {
        acceptedTranslations: ['no hay problema'],
      },
    ),
    w('zh-wo', '我', 'wǒ', 'yo', '我叫王明。', 'Me llamo Wang Ming.', ['pronouns']),
    w('zh-ni', '你', 'nǐ', 'vos', '你好！', '¡Hola!', ['pronouns'], {
      acceptedTranslations: ['tú'],
    }),
    w('zh-jiao', '叫', 'jiào', 'llamarse', '我叫王明。', 'Me llamo Wang Ming.', ['introductions']),
    w('zh-shenme', '什么', 'shénme', 'qué', '你叫什么名字？', '¿Cómo te llamás?', ['questions']),
    w('zh-mingzi', '名字', 'míngzi', 'nombre', '你叫什么名字？', '¿Cómo te llamás?', [
      'introductions',
    ]),
    w('zh-hen', '很', 'hěn', 'muy', '我很好。', 'Estoy bien.', ['basics']),
    w('zh-hao', '好', 'hǎo', 'bien', '我很好。', 'Estoy bien.', ['basics'], {
      acceptedTranslations: ['bueno'],
    }),
    w(
      'zh-ni-ne',
      '你呢',
      'nǐ ne',
      '¿y vos?',
      '我很好，你呢？',
      'Estoy bien, ¿y vos?',
      ['questions'],
      {
        acceptedTranslations: ['¿y tú?', 'y vos', 'y tú'],
      },
    ),
    w('zh-ye', '也', 'yě', 'también', '我也很好。', 'Yo también estoy bien.', ['basics']),
  ],
  lessons: [
    {
      title: '你好！',
      objective: 'Saludar y despedirte.',
      intro: {
        explanation:
          '你好 (nǐ hǎo) es «hola». Con un profesor o alguien mayor se usa 您好 (nín hǎo), más respetuoso. Arriba de los caracteres vas a ver el pinyin, que indica cómo se pronuncian. Para escribir el pinyin podés usar números de tono: ni3 hao3.',
        examples: [
          { target: '你好！', base: '¡Hola!' },
          { target: '老师，您好！', base: '¡Hola, profe!' },
          { target: '再见！', base: '¡Adiós!' },
        ],
      },
      takeaways: [
        'Saludás con 你好 y, con respeto, con 您好.',
        'Te despedís con 再见.',
        'Escribís pinyin con números de tono (ni3 hao3).',
      ],
      exercises: [
        ex.translationChoice('你好', 'hola', ['adiós', 'gracias', 'perdón'], ['zh-ni-hao']),
        ex.translationChoice('再见', 'adiós', ['hola', 'gracias', 'profesor/a'], ['zh-zai-jian']),
        ex.listenChoice('您好', ['你好', '再见', '老师'], ['zh-nin-hao']),
        ex.translationChoice('老师', 'profesor/a', ['hola', 'adiós', 'yo'], ['zh-laoshi']),
        ex.matchPairs(
          [
            ['你好', 'hola'],
            ['再见', 'adiós'],
            ['老师', 'profesor/a'],
          ],
          ['zh-ni-hao', 'zh-zai-jian', 'zh-laoshi'],
        ),
        ex.fillBlank(
          '老师___！',
          '¡Hola, profe!',
          '好',
          ['你', '我', '叫'],
          ['zh-laoshi', 'zh-hao'],
          {
            skill: 'vocabulary',
            explanation: 'Para saludar a alguien se puede poner 好 después de su título: 老师好.',
          },
        ),
        write('Hola', 'nǐ hǎo', '你好', ['zh-ni-hao'], {
          accepted: ['nín hǎo', 'nínhǎo', '您好'],
          explanation:
            'Se escribe nǐ hǎo, pero se pronuncia ní hǎo: dos terceros tonos seguidos, el primero sube.',
        }),
        write('Adiós', 'zàijiàn', '再见', ['zh-zai-jian'], { accepted: ['zài jiàn'] }),
      ],
    },
    {
      title: 'Los cuatro tonos',
      objective: 'Distinguir de oído los cuatro tonos.',
      intro: {
        explanation:
          'El mismo sonido con otro tono es otra palabra. 1.º alto y parejo (ā), 2.º sube como una pregunta (á), 3.º baja y vuelve a subir (ǎ), 4.º baja seco (à). Escuchá cada palabra y fijate en la melodía.',
        examples: [
          { target: '妈 mā · 麻 má · 马 mǎ · 骂 mà', base: 'mamá · cáñamo · caballo · retar' },
          { target: '谢谢 xièxie', base: 'gracias', note: 'la segunda sílaba es neutra' },
        ],
      },
      takeaways: [
        'Reconocés los cuatro tonos y el neutro.',
        'Sabés que un tono distinto cambia la palabra.',
      ],
      exercises: [
        tone('你', 'nǐ', ['nī', 'ní', 'nì'], ['zh-ni']),
        tone('好', 'hǎo', ['hāo', 'háo', 'hào'], ['zh-hao']),
        tone('再见', 'zàijiàn', ['zāijiān', 'záijián', 'zǎijiǎn'], ['zh-zai-jian']),
        tone('谢谢', 'xièxie', ['xiēxie', 'xiéxie', 'xiěxie'], ['zh-xie-xie']),
        ex.translationChoice('谢谢', 'gracias', ['de nada', 'perdón', 'hola'], ['zh-xie-xie']),
        ex.listenChoice('谢谢', ['再见', '你好', '老师'], ['zh-xie-xie']),
        write('Gracias', 'xièxie', '谢谢', ['zh-xie-xie'], {
          accepted: ['xiè xie', 'xie4xie', 'xie4 xie'],
          explanation:
            'La segunda sílaba de 谢谢 es neutra: se dice corta y sin tono (xie4xie5 o xie4xie).',
        }),
        write('Vos', 'nǐ', '你', ['zh-ni']),
      ],
    },
    {
      title: '谢谢 y 对不起',
      objective: 'Agradecer, disculparte y responder.',
      intro: {
        explanation:
          'A 谢谢 (gracias) se responde 不客气 (de nada). A 对不起 (perdón) se responde 没关系 (no pasa nada).',
        examples: [
          { target: '谢谢！——不客气。', base: '¡Gracias! — De nada.' },
          { target: '对不起！——没关系。', base: '¡Perdón! — No pasa nada.' },
        ],
      },
      takeaways: [
        'Respondés 不客气 cuando te agradecen.',
        'Te disculpás con 对不起 y respondés 没关系.',
      ],
      exercises: [
        ex.translationChoice(
          '不客气',
          'de nada',
          ['gracias', 'perdón', 'no pasa nada'],
          ['zh-bu-keqi'],
        ),
        ex.translationChoice('对不起', 'perdón', ['de nada', 'gracias', 'adiós'], ['zh-dui-bu-qi']),
        ex.listenChoice('没关系', ['对不起', '不客气', '谢谢'], ['zh-mei-guanxi']),
        ex.fillBlank(
          'A：谢谢！ B：___。',
          'A: ¡Gracias! B: De nada.',
          '不客气',
          ['对不起', '再见', '你好'],
          ['zh-bu-keqi', 'zh-xie-xie'],
          { skill: 'vocabulary' },
        ),
        ex.fillBlank(
          'A：对不起！ B：___。',
          'A: ¡Perdón! B: No pasa nada.',
          '没关系',
          ['谢谢', '你好', '老师'],
          ['zh-mei-guanxi', 'zh-dui-bu-qi'],
          {
            skill: 'vocabulary',
            explanation: 'A 对不起 se responde 没关系; 不客气 es la respuesta a 谢谢.',
          },
        ),
        ex.matchPairs(
          [
            ['谢谢', 'gracias'],
            ['不客气', 'de nada'],
            ['对不起', 'perdón'],
            ['没关系', 'no pasa nada'],
          ],
          ['zh-xie-xie', 'zh-bu-keqi', 'zh-dui-bu-qi', 'zh-mei-guanxi'],
        ),
        write('De nada', 'bú kèqi', '不客气', ['zh-bu-keqi'], {
          accepted: ['bù kèqi', 'bùkèqi', 'bú kèqì', 'bù kèqì'],
          explanation: '不 es bù, pero antes de un cuarto tono se dice bú: bú kèqi.',
        }),
        write('Perdón', 'duìbuqǐ', '对不起', ['zh-dui-bu-qi'], {
          accepted: ['duì bu qǐ', 'duìbùqǐ'],
        }),
      ],
    },
    {
      title: '我叫…',
      objective: 'Decir tu nombre y preguntar el de otra persona.',
      intro: {
        explanation:
          'Para decir tu nombre: 我叫 + nombre («yo me llamo…»). Para preguntar: 你叫什么名字？, literalmente «¿vos te llamás qué nombre?». La pregunta va en el mismo lugar que la respuesta.',
        examples: [
          { target: '我叫王明。', base: 'Me llamo Wang Ming.' },
          { target: '你叫什么名字？', base: '¿Cómo te llamás?' },
        ],
      },
      takeaways: ['Te presentás con 我叫 + tu nombre.', 'Preguntás el nombre con 你叫什么名字？'],
      exercises: [
        ex.translationChoice('我', 'yo', ['vos', 'qué', 'nombre'], ['zh-wo']),
        ex.translationChoice('名字', 'nombre', ['profesor/a', 'qué', 'yo'], ['zh-mingzi']),
        ex.listenChoice(
          '你叫什么名字？',
          ['我叫王明。', '你好！', '再见！'],
          ['zh-jiao', 'zh-shenme', 'zh-mingzi'],
        ),
        ex.orderWords('我 叫 王明。', 'Me llamo Wang Ming.', ['zh-wo', 'zh-jiao']),
        ex.fillBlank(
          '你叫___名字？',
          '¿Cómo te llamás?',
          '什么',
          ['我', '好', '也'],
          ['zh-shenme'],
          {
            explanation:
              'En chino la palabra de pregunta va donde iría la respuesta: 你叫什么名字？ → 我叫王明。',
          },
        ),
        ex.orderWords('你 叫 什么 名字？', '¿Cómo te llamás?', [
          'zh-ni',
          'zh-jiao',
          'zh-shenme',
          'zh-mingzi',
        ]),
        write('Yo', 'wǒ', '我', ['zh-wo']),
        write('Me llamo Wang Ming.', 'wǒ jiào Wáng Míng', '我叫王明', ['zh-wo', 'zh-jiao'], {
          accepted: ['wǒ jiào wángmíng', 'wǒjiào wángmíng'],
        }),
      ],
    },
    {
      title: '我很好',
      objective: 'Decir que estás bien y devolver la pregunta.',
      intro: {
        explanation:
          'Para decir que estás bien: 我很好. En chino no hace falta un verbo «estar» y antes de 好 casi siempre va 很 (muy), aunque se traduce simplemente «bien». Para devolver la pregunta: 你呢？',
        examples: [
          { target: '我很好，你呢？', base: 'Estoy bien, ¿y vos?' },
          { target: '我也很好。', base: 'Yo también estoy bien.' },
        ],
      },
      takeaways: [
        'Decís que estás bien con 我很好.',
        'Devolvés la pregunta con 你呢？',
        'Decís «también» con 也, antes del verbo o adjetivo.',
      ],
      exercises: [
        ex.translationChoice('很', 'muy', ['también', 'bien', 'yo'], ['zh-hen']),
        ex.translationChoice('也', 'también', ['muy', '¿y vos?', 'bien'], ['zh-ye']),
        ex.fillBlank('我___好。', 'Estoy bien.', '很', ['也', '叫', '我'], ['zh-hen', 'zh-hao'], {
          skill: 'grammar',
          explanation: 'Antes de un adjetivo como 好 se pone 很: 我很好. Sin 很 suena incompleto.',
        }),
        ex.listenChoice('你呢？', ['你好！', '谢谢！', '再见！'], ['zh-ni-ne']),
        ex.orderWords(
          '我 也 很 好。',
          'Yo también estoy bien.',
          ['zh-wo', 'zh-ye', 'zh-hen', 'zh-hao'],
          {
            explanation:
              '也 va después de quién y antes de lo que se dice de esa persona: 我也很好.',
          },
        ),
        ex.matchPairs(
          [
            ['很', 'muy'],
            ['好', 'bien'],
            ['也', 'también'],
            ['你呢', '¿y vos?'],
          ],
          ['zh-hen', 'zh-hao', 'zh-ye', 'zh-ni-ne'],
        ),
        write('¿Y vos?', 'nǐ ne', '你呢', ['zh-ni-ne']),
        write('Estoy bien.', 'wǒ hěn hǎo', '我很好', ['zh-wo', 'zh-hen', 'zh-hao'], {
          accepted: ['hěn hǎo', 'hěnhǎo'],
          explanation: 'Se dice 我很好 (wǒ hěn hǎo): sin verbo «estar» y con 很 antes de 好.',
        }),
      ],
    },
  ],
};

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
 * tono de 不 y naturalidad).
 */
export const unit02: UnitDef = {
  position: 2,
  title: '¿Quién sos y de dónde sos?',
  titleEn: '你是哪国人？',
  description: 'Ser con 是, negar con 不, preguntar con 吗 y decir tu nacionalidad.',
  emoji: '🌍',
  objective:
    'Podés decir qué sos y de dónde sos, negar, hacer preguntas de sí o no y hablar de alguien con 他 y 她.',
  grammar: {
    title: '是, 不 y 吗',
    explanation:
      '是 (shì) une dos sustantivos: 我是学生 «yo soy estudiante». Para negar, 不 antes del verbo: 我不是老师. Para preguntar sí o no, 吗 al final: 你是学生吗？ El verbo no cambia nunca.',
    examples: [
      { target: '我是学生。', base: 'Soy estudiante.' },
      { target: '我不是老师。', base: 'No soy profesor/a.' },
      { target: '你是中国人吗？', base: '¿Sos chino/a?' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de chino: tonos, 不 → bú antes de 是 y naturalidad.',
  },
  words: [
    w('zh-shi', '是', 'shì', 'ser', '我是学生。', 'Soy estudiante.', ['verbs'], {
      acceptedTranslations: ['es', 'soy', 'sos'],
    }),
    w('zh-bu', '不', 'bù', 'no (negación)', '我不是老师。', 'No soy profesor/a.', ['grammar']),
    w('zh-ma', '吗', 'ma', 'partícula de pregunta', '你是学生吗？', '¿Sos estudiante?', [
      'grammar',
      'particle',
    ]),
    w('zh-ren', '人', 'rén', 'persona', '我是阿根廷人。', 'Soy argentino/a.', ['people']),
    w('zh-zhongguo', '中国', 'Zhōngguó', 'China', '他是中国人。', 'Él es chino.', ['countries'], {
      emoji: '🇨🇳',
    }),
    w(
      'zh-agenting',
      '阿根廷',
      'Āgēntíng',
      'Argentina',
      '我是阿根廷人。',
      'Soy argentino/a.',
      ['countries'],
      { emoji: '🇦🇷' },
    ),
    w(
      'zh-xibanya',
      '西班牙',
      'Xībānyá',
      'España',
      '她是西班牙人。',
      'Ella es española.',
      ['countries'],
      { emoji: '🇪🇸' },
    ),
    w(
      'zh-moxige',
      '墨西哥',
      'Mòxīgē',
      'México',
      '他是墨西哥人。',
      'Él es mexicano.',
      ['countries'],
      { emoji: '🇲🇽' },
    ),
    w('zh-na', '哪', 'nǎ', '¿cuál?', '你是哪国人？', '¿De qué país sos?', ['questions'], {
      acceptedTranslations: ['¿qué?'],
    }),
    w('zh-guo', '国', 'guó', 'país', '你是哪国人？', '¿De qué país sos?', ['countries']),
    w('zh-xuesheng', '学生', 'xuésheng', 'estudiante', '我是学生。', 'Soy estudiante.', ['people']),
    w('zh-ta-he', '他', 'tā', 'él', '他是我朋友。', 'Él es mi amigo.', ['pronouns']),
    w('zh-ta-she', '她', 'tā', 'ella', '她是老师。', 'Ella es profesora.', ['pronouns']),
    w('zh-pengyou', '朋友', 'péngyou', 'amigo/a', '他是我朋友。', 'Él es mi amigo.', ['people'], {
      acceptedTranslations: ['amigo', 'amiga'],
    }),
  ],
  lessons: [
    {
      title: '我是学生',
      objective: 'Decir qué sos con 是.',
      intro: {
        explanation:
          '是 (shì) es «ser» y sirve para todas las personas: 我是, 你是, 他是. Para tu nombre ya conocés 叫; 是 es para lo que sos: estudiante, profesor, de dónde.',
        examples: [
          { target: '我是学生。', base: 'Soy estudiante.' },
          { target: '你是老师。', base: 'Vos sos profesor/a.' },
        ],
      },
      takeaways: ['Decís qué sos con 是.', 'Usás 叫 para el nombre y 是 para lo demás.'],
      exercises: [
        ex.translationChoice('是', 'ser', ['no (negación)', 'persona', 'estudiante'], ['zh-shi']),
        ex.translationChoice(
          '学生',
          'estudiante',
          ['profesor/a', 'amigo/a', 'persona'],
          ['zh-xuesheng'],
        ),
        ex.listenChoice(
          '我是学生。',
          ['我是老师。', '我叫王明。', '你好！'],
          ['zh-shi', 'zh-xuesheng'],
        ),
        ex.fillBlank(
          '我___学生。',
          'Soy estudiante.',
          '是',
          ['叫', '很', '也'],
          ['zh-shi', 'zh-xuesheng'],
          {
            skill: 'grammar',
            explanation: 'Para decir qué sos se usa 是. 叫 es sólo para el nombre: 我叫王明.',
          },
        ),
        ex.orderWords('我 是 老师。', 'Soy profesor/a.', ['zh-wo', 'zh-shi', 'zh-laoshi']),
        tone('学生', 'xuésheng', ['xuēsheng', 'xuěsheng', 'xuèsheng'], ['zh-xuesheng']),
        write('Soy estudiante.', 'wǒ shì xuésheng', '我是学生', ['zh-wo', 'zh-shi', 'zh-xuesheng']),
        write('Estudiante', 'xuésheng', '学生', ['zh-xuesheng']),
      ],
    },
    {
      title: '不 y 吗',
      objective: 'Negar con 不 y preguntar con 吗.',
      intro: {
        explanation:
          'Para negar, 不 (bù) va antes del verbo: 我不是老师. Antes de un cuarto tono como 是 se pronuncia bú. Para una pregunta de sí o no, agregás 吗 (ma) al final, sin cambiar el orden.',
        examples: [
          { target: '我不是老师。', base: 'No soy profesor/a.', note: 'bú shì' },
          { target: '你是学生吗？', base: '¿Sos estudiante?' },
        ],
      },
      takeaways: ['Negás con 不 antes del verbo.', 'Preguntás sí o no con 吗 al final.'],
      exercises: [
        ex.translationChoice('不', 'no (negación)', ['ser', 'persona', 'también'], ['zh-bu']),
        ex.fillBlank(
          '我___是老师。',
          'No soy profesor/a.',
          '不',
          ['很', '也', '叫'],
          ['zh-bu', 'zh-shi'],
          {
            skill: 'grammar',
            explanation: '不 va justo antes del verbo: 我不是….',
          },
        ),
        ex.listenChoice(
          '我不是学生。',
          ['我是学生。', '我也是学生。', '我很好。'],
          ['zh-bu', 'zh-shi'],
        ),
        ex.fillBlank(
          '你是学生___？',
          '¿Sos estudiante?',
          '吗',
          ['呢', '不', '是'],
          ['zh-ma', 'zh-shi'],
          {
            skill: 'grammar',
            explanation:
              '吗 al final convierte la oración en pregunta de sí o no. 呢 es para «¿y vos?».',
          },
        ),
        ex.orderWords('你 是 老师 吗？', '¿Sos profesor/a?', [
          'zh-ni',
          'zh-shi',
          'zh-laoshi',
          'zh-ma',
        ]),
        tone(
          '不',
          'bù',
          ['bū', 'bú', 'bǔ'],
          ['zh-bu'],
          'Solo, 不 es cuarto tono (bù). Antes de otro cuarto tono, como 是, sube: bú shì.',
        ),
        write(
          'No soy estudiante.',
          'wǒ bú shì xuésheng',
          '我不是学生',
          ['zh-bu', 'zh-shi', 'zh-xuesheng'],
          {
            accepted: ['wǒ bù shì xuésheng', 'wǒ búshì xuésheng', 'wǒ bùshì xuésheng'],
            explanation: '不 antes de 是 se dice bú (sube): wǒ bú shì.',
          },
        ),
        write('¿Sos profesor?', 'nǐ shì lǎoshī ma', '你是老师吗', ['zh-shi', 'zh-ma', 'zh-laoshi']),
      ],
    },
    {
      title: '他 y 她',
      objective: 'Hablar de otras personas.',
      intro: {
        explanation:
          '他 (él) y 她 (ella) se pronuncian igual: tā. Sólo se distinguen por escrito: 她 lleva 女, «mujer». 朋友 es amigo o amiga.',
        examples: [
          { target: '他是我朋友。', base: 'Él es mi amigo.' },
          { target: '她是老师。', base: 'Ella es profesora.' },
        ],
      },
      takeaways: ['Hablás de alguien con 他 o 她.', 'Presentás a un amigo con 他是我朋友.'],
      exercises: [
        ex.translationChoice('他', 'él', ['ella', 'yo', 'vos'], ['zh-ta-he']),
        ex.translationChoice('她', 'ella', ['él', 'amigo/a', 'vos'], ['zh-ta-she'], {
          explanation: '她 tiene 女 (mujer) a la izquierda: es «ella».',
        }),
        ex.translationChoice(
          '朋友',
          'amigo/a',
          ['estudiante', 'profesor/a', 'persona'],
          ['zh-pengyou'],
        ),
        ex.listenChoice(
          '他是我朋友。',
          ['我是学生。', '她是老师。', '再见！'],
          ['zh-ta-he', 'zh-pengyou'],
        ),
        ex.fillBlank(
          '___是我朋友。',
          'Ella es mi amiga.',
          '她',
          ['他', '你', '我'],
          ['zh-ta-she', 'zh-pengyou'],
          {
            explanation: 'En voz alta 他 y 她 suenan igual (tā); por escrito, «ella» es 她.',
          },
        ),
        ex.orderWords('他 是 我 朋友。', 'Él es mi amigo.', ['zh-ta-he', 'zh-shi', 'zh-pengyou']),
        write(
          'Él es estudiante.',
          'tā shì xuésheng',
          '他是学生',
          ['zh-ta-he', 'zh-shi', 'zh-xuesheng'],
          {
            accepted: ['她是学生'],
          },
        ),
        write('Amigo', 'péngyou', '朋友', ['zh-pengyou']),
      ],
    },
    {
      title: '中国人',
      objective: 'Decir tu nacionalidad: país + 人.',
      intro: {
        explanation:
          'La nacionalidad se arma con el país + 人 (persona): 中国人 «persona de China», 阿根廷人 «argentino/a». No cambia para varón o mujer.',
        examples: [
          { target: '我是阿根廷人。', base: 'Soy argentino/a.' },
          { target: '她是西班牙人。', base: 'Ella es española.' },
        ],
      },
      takeaways: [
        'Decís tu nacionalidad con país + 人.',
        'Sabés que no cambia para varón o mujer.',
      ],
      exercises: [
        ex.translationChoice('中国', 'China', ['España', 'México', 'Argentina'], ['zh-zhongguo']),
        ex.translationChoice('人', 'persona', ['país', 'amigo/a', 'ser'], ['zh-ren']),
        ex.listenChoice('阿根廷', ['中国', '西班牙', '墨西哥'], ['zh-agenting']),
        ex.matchPairs(
          [
            ['中国', 'China'],
            ['阿根廷', 'Argentina'],
            ['西班牙', 'España'],
            ['墨西哥', 'México'],
          ],
          ['zh-zhongguo', 'zh-agenting', 'zh-xibanya', 'zh-moxige'],
        ),
        ex.fillBlank(
          '我是阿根廷___。',
          'Soy argentino/a.',
          '人',
          ['国', '是', '吗'],
          ['zh-ren', 'zh-agenting'],
          {
            skill: 'grammar',
            explanation: 'Nacionalidad = país + 人: 阿根廷人.',
          },
        ),
        ex.orderWords('他 是 西班牙 人。', 'Él es español.', ['zh-ta-he', 'zh-xibanya', 'zh-ren']),
        write('Soy argentino.', 'wǒ shì Āgēntíng rén', '我是阿根廷人', ['zh-agenting', 'zh-ren'], {
          accepted: ['wǒ shì Āgēntíngrén'],
        }),
        write('China', 'Zhōngguó', '中国', ['zh-zhongguo'], { accepted: ['Zhōng guó'] }),
      ],
    },
    {
      title: '你是哪国人？',
      objective: 'Preguntar y decir de qué país sos.',
      intro: {
        explanation:
          '哪 (nǎ) es «¿cuál?». 你是哪国人？ es «¿de qué país sos?» (literalmente «¿sos persona de qué país?»). Se responde poniendo el país donde estaba 哪国.',
        examples: [
          { target: '你是哪国人？', base: '¿De qué país sos?' },
          { target: '我是墨西哥人。', base: 'Soy mexicano/a.' },
        ],
      },
      takeaways: ['Preguntás la nacionalidad con 你是哪国人？', 'Respondés con 我是 + país + 人.'],
      exercises: [
        ex.translationChoice('哪', '¿cuál?', ['país', 'persona', 'no (negación)'], ['zh-na']),
        ex.translationChoice('国', 'país', ['persona', 'China', '¿cuál?'], ['zh-guo']),
        ex.listenChoice(
          '你是哪国人？',
          ['你叫什么名字？', '你好！', '你呢？'],
          ['zh-na', 'zh-guo', 'zh-ren'],
        ),
        ex.fillBlank(
          '你是___国人？',
          '¿De qué país sos?',
          '哪',
          ['什么', '吗', '不'],
          ['zh-na', 'zh-guo'],
          {
            skill: 'grammar',
            explanation:
              'Para el país se pregunta con 哪国. Con 哪 no hace falta 吗: ya es una pregunta.',
          },
        ),
        ex.orderWords('你 是 哪 国 人？', '¿De qué país sos?', ['zh-na', 'zh-guo', 'zh-ren']),
        ex.matchPairs(
          [
            ['哪', '¿cuál?'],
            ['国', 'país'],
            ['人', 'persona'],
            ['是', 'ser'],
          ],
          ['zh-na', 'zh-guo', 'zh-ren', 'zh-shi'],
        ),
        write(
          '¿De qué país sos?',
          'nǐ shì nǎ guó rén',
          '你是哪国人',
          ['zh-na', 'zh-guo', 'zh-ren'],
          {
            accepted: ['nǐ shì nǎguó rén', 'nǐ shì něi guó rén', 'nǐ shì něiguó rén'],
            explanation: 'En el habla también se dice něi guó.',
          },
        ),
        write('Soy mexicano.', 'wǒ shì Mòxīgē rén', '我是墨西哥人', ['zh-moxige', 'zh-ren'], {
          accepted: ['wǒ shì Mòxīgērén'],
        }),
      ],
    },
  ],
};

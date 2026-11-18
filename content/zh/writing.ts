import type { WritingRequirement, WritingTaskDef } from '../../shared/writing';
import { syllables } from '../zh-pinyin';

/**
 * Producción escrita de chino A1 y A2 sin IA (docs/ZH_A1_A2.md), con el mismo sistema que el resto de
 * los idiomas (shared/writing.ts): se comprueba en el dispositivo y el texto no se envía ni se guarda.
 * Práctica opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * - Se puede escribir en caracteres (con el teclado chino del teléfono) o en pinyin separado por
 *   palabras, con marcas, con números de tono o sin tonos: cada requisito acepta las cuatro formas.
 *   No se exige escribir a mano ni cada carácter.
 * - `guided`: requisitos observables (las estructuras que la lección acaba de practicar). Completa =
 *   todos los obligatorios cumplidos. Las de A1 U2–U11 acompañan lecciones del piloto ya publicado.
 * - `free`: texto libre de bloque, sin veredicto: modelo, pistas opcionales y lista de control.
 * - Cada modelo trae su pinyin (`modelReading`), que la app muestra debajo.
 *
 * Sólo caracteres enseñados hasta la lección (lo comprueba content/zh-checks.ts).
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
 */

const numbered = (word: string) =>
  (syllables(word) ?? []).map((s) => (s.tone === 5 ? s.base : `${s.base}${s.tone}`)).join('');
const toneless = (word: string) => (syllables(word) ?? []).map((s) => s.base).join('');

/** Patrón en caracteres (uno por ficha) y en pinyin (una palabra por ficha, con o sin tonos). */
export function zhPatterns(hanzi: string, pinyin: string): string[][] {
  const words = pinyin.toLowerCase().split(/\s+/).filter(Boolean);
  return [[...hanzi], words.map((w) => [...new Set([w, toneless(w), numbered(w)])].join('|'))];
}

const pattern = (
  id: string,
  label: string,
  alternatives: [hanzi: string, pinyin: string][],
  optional = false,
): WritingRequirement => ({
  id,
  label,
  kind: 'pattern',
  patterns: alternatives.flatMap(([h, p]) => zhPatterns(h, p)),
  ...(optional ? { optional: true } : {}),
});

const common = (minSentences: number, optional = false): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `Escribís al menos ${minSentences} oraciones`,
    kind: 'min_sentences',
    min: minSentences,
    ...(optional ? { optional: true } : {}),
  },
  {
    id: 'punctuation',
    label: 'Terminás con 。, ！ o ？ (o con punto)',
    kind: 'end_punctuation',
    ...(optional ? { optional: true } : {}),
  },
];

const base = { language: 'zh', allowInvented: true as const, maxChars: 400 };
const a2 = { ...base, maxChars: 600 };
const howTo =
  'Podés escribir en caracteres o en pinyin separado por palabras (con marcas, con números o sin tonos).';

export const ZH_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ A1, guiadas
  {
    ...base,
    id: 'zh.a1.wt.jieshao',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u02-l05',
    title: 'Presentate',
    instructions: `Presentate en chino (con datos reales o inventados): saludá, decí cómo te llamás, de dónde sos y qué sos. ${howTo}`,
    prompts: ['你叫什么名字？ (Nǐ jiào shénme míngzi?)', '你是哪国人？ (Nǐ shì nǎ guó rén?)'],
    glossary: [{ term: '安娜', meaning: 'Anna (nombre)' }],
    requirements: [
      pattern('name', 'Decís cómo te llamás (我叫…)', [['我叫', 'wǒ jiào']]),
      pattern('be', 'Decís qué o de dónde sos (我是…)', [['我是', 'wǒ shì']]),
      ...common(3),
    ],
    model: '你好！我叫安娜。我是阿根廷人。我是学生。',
    modelReading: 'Nǐ hǎo! Wǒ jiào Ānnà. Wǒ shì Āgēntíng rén. Wǒ shì xuésheng.',
    checklist: ['Saludo con 你好.', 'Digo mi nombre con 我叫 y de dónde soy con 我是…人.'],
  },
  {
    ...base,
    id: 'zh.a1.wt.jiating',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u04-l05',
    title: 'Tu familia',
    instructions: `Contá cómo es tu familia: cuántos son, qué hermanos tenés y cuáles no. ${howTo}`,
    prompts: ['你有哥哥吗？ (Nǐ yǒu gēge ma?)', '你爸爸是老师吗？ (Nǐ bàba shì lǎoshī ma?)'],
    requirements: [
      pattern('have', 'Decís qué tenés con 有 + número + 个', [
        ['有一个', 'yǒu yí ge'],
        ['有两个', 'yǒu liǎng ge'],
        ['有三个', 'yǒu sān ge'],
        ['有四个', 'yǒu sì ge'],
        ['有五个', 'yǒu wǔ ge'],
      ]),
      pattern('nothave', 'Decís algo que no tenés (没有)', [['没有', 'méiyǒu']]),
      ...common(3),
    ],
    model: '我家有四个人。我有一个哥哥，没有姐姐。我爸爸是老师。',
    modelReading: 'Wǒ jiā yǒu sì ge rén. Wǒ yǒu yí ge gēge, méiyǒu jiějie. Wǒ bàba shì lǎoshī.',
    checklist: ['Uso 个 después del número.', 'Niego 有 con 没有 (nunca 不有).'],
  },
  {
    ...base,
    id: 'zh.a1.wt.fangjian',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u06-l05',
    title: 'Tu cuarto',
    instructions: `Describí tu cuarto: qué hay y dónde están las cosas. ${howTo}`,
    prompts: ['房间里有什么？ (Fángjiān li yǒu shénme?)'],
    requirements: [
      pattern('there', 'Decís qué hay (…里有 / …上有)', [
        ['里有', 'li yǒu'],
        ['上有', 'shang yǒu'],
      ]),
      pattern('where', 'Decís dónde está algo con 在', [['在', 'zài']]),
      ...common(3),
    ],
    model: '这是我的房间。房间里有床，也有桌子。桌子上有电脑。我的猫在床下。',
    modelReading:
      'Zhè shì wǒ de fángjiān. Fángjiān li yǒu chuáng, yě yǒu zhuōzi. Zhuōzi shang yǒu diànnǎo. Wǒ de māo zài chuáng xià.',
    checklist: ['Uso 里, 上 o 下 después del lugar.', 'Uso 有 para «hay» y 在 para «está».'],
  },
  {
    ...base,
    id: 'zh.a1.wt.meitian',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u08-l05',
    title: 'Tu día',
    instructions: `Contá qué hacés todos los días, a la mañana, a la tarde y a la noche. ${howTo}`,
    prompts: [
      '你早上吃早饭吗？ (Nǐ zǎoshang chī zǎofàn ma?)',
      '晚上你看电视吗？ (Wǎnshang nǐ kàn diànshì ma?)',
    ],
    requirements: [
      pattern('morning', 'Decís qué hacés a la mañana (早上)', [['早上', 'zǎoshang']]),
      pattern('then', 'Ordenás con 然后', [['然后', 'ránhòu']]),
      ...common(3),
    ],
    model: '我每天早上起床，然后吃早饭。下午我工作。晚上我在家看电视，然后睡觉。',
    modelReading:
      'Wǒ měitiān zǎoshang qǐchuáng, ránhòu chī zǎofàn. Xiàwǔ wǒ gōngzuò. Wǎnshang wǒ zài jiā kàn diànshì, ránhòu shuìjiào.',
    checklist: ['El momento del día va antes del verbo.', 'Uso 然后 para decir qué hago después.'],
  },
  {
    ...base,
    id: 'zh.a1.wt.xihuan',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u11-l05',
    title: 'Lo que te gusta',
    instructions: `Contá qué te gusta hacer y qué sabés hacer (y qué no). ${howTo}`,
    prompts: ['你喜欢什么？ (Nǐ xǐhuan shénme?)', '你会游泳吗？ (Nǐ huì yóuyǒng ma?)'],
    requirements: [
      pattern('like', 'Decís qué te gusta (喜欢)', [['喜欢', 'xǐhuan']]),
      pattern('can', 'Decís qué sabés hacer (会)', [['会', 'huì']]),
      ...common(3),
    ],
    model: '我喜欢听音乐，也喜欢看电影。我会游泳。我不会唱歌。周末我常常踢足球。',
    modelReading:
      'Wǒ xǐhuan tīng yīnyuè, yě xǐhuan kàn diànyǐng. Wǒ huì yóuyǒng. Wǒ bú huì chànggē. Zhōumò wǒ chángcháng tī zúqiú.',
    checklist: ['Uso 喜欢 + verbo o cosa.', 'Uso 会 / 不会 para lo que sé hacer.'],
  },
  {
    ...base,
    id: 'zh.a1.wt.gongzuo',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u13-l05',
    title: 'Trabajo e idiomas',
    instructions: `Contá qué hacés vos (o alguien de tu familia), dónde y qué idiomas hablás. ${howTo}`,
    prompts: ['你做什么工作？ (Nǐ zuò shénme gōngzuò?)', '你会说英语吗？ (Nǐ huì shuō Yīngyǔ ma?)'],
    glossary: [{ term: '安娜', meaning: 'Anna (nombre)' }],
    requirements: [
      pattern('job', 'Decís de qué trabaja o estudia alguien (是…)', [['是', 'shì']]),
      pattern('place', 'Decís dónde con 在 + lugar + 工作 / 学习', [
        ['工作', 'gōngzuò'],
        ['学习', 'xuéxí'],
      ]),
      pattern('speak', 'Decís qué idiomas hablás (会说)', [['会说', 'huì shuō']]),
      ...common(3),
    ],
    model:
      '我叫安娜。我是学生，在北京学习中文。我爸爸是医生，在医院工作。我会说西班牙语，也会说一点儿英语。',
    modelReading:
      'Wǒ jiào Ānnà. Wǒ shì xuésheng, zài Běijīng xuéxí Zhōngwén. Wǒ bàba shì yīshēng, zài yīyuàn gōngzuò. Wǒ huì shuō Xībānyáyǔ, yě huì shuō yìdiǎnr Yīngyǔ.',
    checklist: ['El lugar va con 在 antes del verbo.', 'Uso 会说 + idioma.'],
  },
  {
    ...base,
    id: 'zh.a1.wt.miaoshu',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u14-l05',
    title: 'Describí a alguien',
    instructions: `Describí a una persona que conozcas y comparala con vos. ${howTo}`,
    prompts: ['他高吗？ (Tā gāo ma?)', '她头发长吗？ (Tā tóufa cháng ma?)'],
    requirements: [
      pattern('looks', 'Describís el pelo o los ojos', [
        ['头发', 'tóufa'],
        ['眼睛', 'yǎnjing'],
      ]),
      pattern('compare', 'Comparás con 比', [['比', 'bǐ']]),
      ...common(3),
    ],
    model: '我姐姐很高，头发很长。她的眼睛很大。她比我高，可是我比她大。',
    modelReading:
      'Wǒ jiějie hěn gāo, tóufa hěn cháng. Tā de yǎnjing hěn dà. Tā bǐ wǒ gāo, kěshì wǒ bǐ tā dà.',
    checklist: ['Con 比 no uso 很.', 'Describo con 很 + adjetivo.'],
  },
  {
    ...base,
    id: 'zh.a1.wt.yaoqing',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a1-u16-l05',
    title: 'Un mensaje para salir',
    instructions: `Escribile un mensaje a un amigo para proponerle un plan: qué día, adónde van y dónde pueden comer. ${howTo}`,
    prompts: ['我们一起去公园吧！ (Wǒmen yìqǐ qù gōngyuán ba!)'],
    requirements: [
      pattern('together', 'Proponés hacer algo juntos (一起)', [['一起', 'yìqǐ']]),
      pattern('ba', 'Cerrás la propuesta con 吧', [['吧', 'ba']]),
      ...common(3),
    ],
    model: '王明，明天是星期六。我们一起去公园吧！中午我们可以在饭馆吃饭。你可以来吗？',
    modelReading:
      'Wáng Míng, míngtiān shì xīngqīliù. Wǒmen yìqǐ qù gōngyuán ba! Zhōngwǔ wǒmen kěyǐ zài fànguǎn chīfàn. Nǐ kěyǐ lái ma?',
    checklist: ['Propongo con 一起…吧.', 'Pregunto si puede venir con 可以…吗？'],
  },

  // ------------------------------------------------ A1, libre
  {
    ...base,
    maxChars: 600,
    id: 'zh.a1.wt.ziyou',
    kind: 'free',
    codes: [],
    lesson: 'zh-a1-u16-final',
    title: 'Escribí sobre vos',
    instructions: `Terminaste el A1: escribí un texto sobre vos con todo lo que aprendiste (quién sos, tu familia, qué te gusta y qué hiciste ayer). ${howTo}`,
    prompts: ['你是哪国人？', '你喜欢做什么？', '你昨天做什么了？'],
    glossary: [{ term: '安娜', meaning: 'Anna (nombre)' }],
    requirements: [
      pattern('name', 'Pista: decí cómo te llamás (我叫…)', [['我叫', 'wǒ jiào']], true),
      pattern('like', 'Pista: contá qué te gusta (喜欢)', [['喜欢', 'xǐhuan']], true),
      pattern('past', 'Pista: contá algo que hiciste (…了)', [['了', 'le']], true),
      ...common(5, true),
    ],
    model:
      '你好！我叫安娜，是阿根廷人。我是学生，在北京学习中文。我家有四个人。我喜欢听音乐，也喜欢游泳。昨天我去了公园。',
    modelReading:
      'Nǐ hǎo! Wǒ jiào Ānnà, shì Āgēntíng rén. Wǒ shì xuésheng, zài Běijīng xuéxí Zhōngwén. Wǒ jiā yǒu sì ge rén. Wǒ xǐhuan tīng yīnyuè, yě xǐhuan yóuyǒng. Zuótiān wǒ qù le gōngyuán.',
    checklist: [
      'Me presento y digo de dónde soy.',
      'Cuento algo de mi familia y lo que me gusta.',
      'Cuento algo que hice con 了.',
    ],
  },

  // ------------------------------------------------ A2, guiadas
  {
    ...a2,
    id: 'zh.a2.wt.zhoumo',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u01-l05',
    title: 'Tu fin de semana',
    instructions: `Contá qué hiciste el fin de semana y qué todavía no hiciste. ${howTo}`,
    prompts: ['周末你做什么了？ (Zhōumò nǐ zuò shénme le?)'],
    requirements: [
      pattern('le', 'Contás lo que hiciste con 了', [['了', 'le']]),
      pattern('notyet', 'Decís qué ya hiciste o qué todavía no (已经 / 还没)', [
        ['已经', 'yǐjīng'],
        ['还没', 'hái méi'],
      ]),
      ...common(4),
    ],
    model:
      '周末我很忙。星期六我打扫了房间，也洗了衣服。星期天我跟朋友去爬山了，很好玩！我还没写作业呢。',
    modelReading:
      'Zhōumò wǒ hěn máng. Xīngqīliù wǒ dǎsǎo le fángjiān, yě xǐ le yīfu. Xīngqītiān wǒ gēn péngyou qù páshān le, hěn hǎowán! Wǒ hái méi xiě zuòyè ne.',
    checklist: ['Uso 了 para lo que terminé.', 'Con 还没 no uso 了.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.lvyou',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u02-l05',
    title: 'Un viaje',
    instructions: `Contá un viaje (real o inventado): adónde fuiste, cuántas veces, cómo viajaste y qué te falta conocer. ${howTo}`,
    prompts: ['你去过中国吗？ (Nǐ qù guo Zhōngguó ma?)', '你是怎么去的？ (Nǐ shì zěnme qù de?)'],
    requirements: [
      pattern('guo', 'Contás una experiencia con 过', [['过', 'guo']]),
      pattern('how', 'Decís cómo viajaste con 是坐…的', [['是坐', 'shì zuò']]),
      ...common(4),
    ],
    model:
      '我去过中国两次。去年我是坐飞机去的。我去了北京和上海，从北京到上海坐火车五个小时。我还没去过长城。',
    modelReading:
      'Wǒ qù guo Zhōngguó liǎng cì. Qùnián wǒ shì zuò fēijī qù de. Wǒ qù le Běijīng hé Shànghǎi, cóng Běijīng dào Shànghǎi zuò huǒchē wǔ ge xiǎoshí. Wǒ hái méi qù guo Chángchéng.',
    checklist: ['Uso 过 para experiencias y 次 para las veces.', 'Uso 是…的 para cómo viajé.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.yuding',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u03-l05',
    title: 'Un mensaje para reservar',
    instructions: `Escribile al hotel para reservar una habitación: cuántos son, qué días y cuánto cuesta. ${howTo}`,
    prompts: ['请问，一个房间多少钱？ (Qǐngwèn, yí ge fángjiān duōshao qián?)'],
    requirements: [
      pattern('book', 'Decís que querés reservar (预订)', [['预订', 'yùdìng']]),
      pattern('polite', 'Preguntás con cortesía (请问 / 请)', [
        ['请问', 'qǐngwèn'],
        ['请', 'qǐng'],
      ]),
      ...common(3),
    ],
    model: '你好！我想预订一个房间。我们是两个人，星期五到。请问，一个房间多少钱？',
    modelReading:
      'Nǐ hǎo! Wǒ xiǎng yùdìng yí ge fángjiān. Wǒmen shì liǎng ge rén, xīngqīwǔ dào. Qǐngwèn, yí ge fángjiān duōshao qián?',
    checklist: ['Saludo y digo qué quiero.', 'Pregunto el precio con 请问.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.zhengzai',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u04-l05',
    title: '¿Qué están haciendo?',
    instructions: `Contale a un amigo qué está haciendo cada uno en tu casa ahora. ${howTo}`,
    prompts: ['你在做什么呢？ (Nǐ zài zuò shénme ne?)'],
    requirements: [
      pattern('progressive', 'Contás qué está haciendo alguien (正在 / 在 + verbo)', [
        ['正在', 'zhèngzài'],
        ['在做', 'zài zuò'],
        ['在看', 'zài kàn'],
        ['在写', 'zài xiě'],
      ]),
      pattern('ne', 'Preguntás qué está haciendo él (…呢？)', [['呢', 'ne']]),
      ...common(3),
    ],
    model: '我在家呢。妈妈正在做饭，爸爸在看电视。我在写作业。你在做什么呢？',
    modelReading:
      'Wǒ zài jiā ne. Māma zhèngzài zuò fàn, bàba zài kàn diànshì. Wǒ zài xiě zuòyè. Nǐ zài zuò shénme ne?',
    checklist: ['Uso 在 / 正在 antes del verbo.', 'Pregunto con 呢 al final.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.jianyi',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u05-l05',
    title: 'Consejos para un amigo',
    instructions: `Un amigo se resfrió. Escribile consejos: qué debería hacer y qué no. ${howTo}`,
    prompts: ['你哪儿不舒服？ (Nǐ nǎr bù shūfu?)'],
    requirements: [
      pattern('should', 'Aconsejás con 应该', [['应该', 'yīnggāi']]),
      pattern('dont', 'Pedís que no haga algo con 别', [['别', 'bié']]),
      ...common(3),
    ],
    model: '你感冒了，应该多休息，多喝水。别吃辣的。你也应该去医院看病。',
    modelReading:
      'Nǐ gǎnmào le, yīnggāi duō xiūxi, duō hē shuǐ. Bié chī là de. Nǐ yě yīnggāi qù yīyuàn kànbìng.',
    checklist: [
      'Uso 应该 + verbo para aconsejar.',
      'Uso 别 + verbo para lo que no tiene que hacer.',
    ],
  },
  {
    ...a2,
    id: 'zh.a2.wt.yaoqing',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u06-l05',
    title: 'Invitá a alguien',
    instructions: `Invitá a un amigo a una reunión: preguntale si tiene tiempo, si quiere venir y decile a qué hora. ${howTo}`,
    prompts: ['你有没有空？ (Nǐ yǒu méiyǒu kòng?)'],
    glossary: [{ term: '张丽', meaning: 'Zhang Li (nombre)' }],
    requirements: [
      pattern('anotA', 'Preguntás con A-不-A (有没有 / 想不想 / 来不来)', [
        ['有没有', 'yǒu méiyǒu'],
        ['想不想', 'xiǎng bù xiǎng'],
        ['来不来', 'lái bù lái'],
      ]),
      pattern('party', 'Nombrás la reunión (聚会)', [['聚会', 'jùhuì']]),
      ...common(3),
    ],
    model: '张丽，星期六你有没有空？我家有个聚会，你想不想来？晚上七点，欢迎你来！',
    modelReading:
      'Zhāng Lì, xīngqīliù nǐ yǒu méiyǒu kòng? Wǒ jiā yǒu ge jùhuì, nǐ xiǎng bù xiǎng lái? Wǎnshang qī diǎn, huānyíng nǐ lái!',
    checklist: ['Las preguntas A-不-A no llevan 吗.', 'Digo el día y la hora.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.gongzuo',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u07-l05',
    title: 'Tu trabajo o tus estudios',
    instructions: `Contá dónde trabajás o estudiás, tu horario, cómo son tus compañeros y cuánto hace que estudiás chino. ${howTo}`,
    prompts: [
      '你几点上班？ (Nǐ jǐ diǎn shàngbān?)',
      '你学了几年中文？ (Nǐ xué le jǐ nián Zhōngwén?)',
    ],
    requirements: [
      pattern('schedule', 'Decís tu horario (上班 / 下班)', [
        ['上班', 'shàngbān'],
        ['下班', 'xiàbān'],
      ]),
      pattern('de', 'Decís cómo hacés algo con 得', [['得', 'de']]),
      ...common(4),
    ],
    model:
      '我在一个公司工作了两年。我九点上班，六点下班。我的同事都很好，有问题他们都帮我。我学了一年中文，说得不太好。',
    modelReading:
      'Wǒ zài yí ge gōngsī gōngzuò le liǎng nián. Wǒ jiǔ diǎn shàngbān, liù diǎn xiàbān. Wǒ de tóngshì dōu hěn hǎo, yǒu wèntí tāmen dōu bāng wǒ. Wǒ xué le yì nián Zhōngwén, shuō de bú tài hǎo.',
    checklist: [
      'Cuento cuánto duró algo con verbo + 了 + tiempo.',
      'Uso 得 para decir cómo hago algo.',
    ],
  },
  {
    ...a2,
    id: 'zh.a2.wt.tuijian',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u08-l05',
    title: 'Recomendá una tienda',
    instructions: `Recomendá un lugar para comprar ropa y comparalo con otros. ${howTo}`,
    prompts: ['你常常在哪儿买衣服？ (Nǐ chángcháng zài nǎr mǎi yīfu?)'],
    requirements: [
      pattern('bi', 'Comparás con 比', [['比', 'bǐ']]),
      pattern('zui', 'Decís cuál es el mejor o el más… (最)', [['最', 'zuì']]),
      ...common(3),
    ],
    model:
      '我常常在网上买衣服。网上比商店便宜多了。我最喜欢一个网上的商店：那儿的裤子很合适，周末还打折！',
    modelReading:
      'Wǒ chángcháng zài wǎngshang mǎi yīfu. Wǎngshang bǐ shāngdiàn piányi duō le. Wǒ zuì xǐhuan yí ge wǎngshang de shāngdiàn: nàr de kùzi hěn héshì, zhōumò hái dǎzhé!',
    checklist: ['Uso 比 + adjetivo sin 很.', 'Uso 最 para lo que más me gusta.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.yiqian',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u10-l05',
    title: 'Antes y ahora',
    instructions: `Contá cómo eras antes (o de chico) y qué cambió. ${howTo}`,
    prompts: ['你小的时候喜欢做什么？ (Nǐ xiǎo de shíhou xǐhuan zuò shénme?)'],
    requirements: [
      pattern('before', 'Hablás del pasado (以前 / …的时候)', [
        ['以前', 'yǐqián'],
        ['的时候', 'de shíhou'],
      ]),
      pattern('change', 'Contás un cambio (了 / 越来越)', [
        ['了', 'le'],
        ['越来越', 'yuèláiyuè'],
      ]),
      ...common(3),
    ],
    model: '我小的时候很喜欢玩游戏。以前我不喝咖啡，现在每天都喝了。我的中文越来越好。',
    modelReading:
      'Wǒ xiǎo de shíhou hěn xǐhuan wán yóuxì. Yǐqián wǒ bù hē kāfēi, xiànzài měitiān dōu hē le. Wǒ de Zhōngwén yuèláiyuè hǎo.',
    checklist: ['Contrasto 以前 con 现在.', 'Marco el cambio con 了.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.jieri',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u11-l05',
    title: 'Una fiesta',
    instructions: `Contá cómo se festeja una fiesta (china o de tu país): qué hacen primero, qué comen y por qué te gusta. ${howTo}`,
    prompts: ['你最喜欢什么节日？ (Nǐ zuì xǐhuan shénme jiérì?)', '为什么？ (Wèishénme?)'],
    requirements: [
      pattern('why', 'Explicás por qué (因为 / 所以)', [
        ['因为', 'yīnwèi'],
        ['所以', 'suǒyǐ'],
      ]),
      pattern('order', 'Ordenás con 先… (然后 / 再)', [['先', 'xiān']]),
      ...common(4),
    ],
    model:
      '我最喜欢春节。春节的时候我们放假，先回老家，然后一起吃饺子。孩子都有红包。因为家人都在一起，所以我很高兴。',
    modelReading:
      'Wǒ zuì xǐhuan Chūnjié. Chūnjié de shíhou wǒmen fàngjià, xiān huí lǎojiā, ránhòu yìqǐ chī jiǎozi. Háizi dōu yǒu hóngbāo. Yīnwèi jiārén dōu zài yìqǐ, suǒyǐ wǒ hěn gāoxìng.',
    checklist: ['Uso 先…然后 para el orden.', 'Explico con 因为…所以.'],
  },
  {
    ...a2,
    id: 'zh.a2.wt.yijian',
    kind: 'guided',
    codes: [],
    lesson: 'zh-a2-u12-l05',
    title: 'Tu opinión',
    instructions: `Opiná sobre comprar por internet (o sobre otro tema): qué te parece, un problema y qué se puede hacer. ${howTo}`,
    prompts: ['你觉得在网上买东西怎么样？ (Nǐ juéde zài wǎngshang mǎi dōngxi zěnmeyàng?)'],
    requirements: [
      pattern('opinion', 'Das tu opinión con 我觉得', [['觉得', 'juéde']]),
      pattern('but', 'Matizás con 但是', [['但是', 'dànshì']]),
      ...common(3),
    ],
    model: '我觉得在网上买东西很方便。但是有的时候东西是坏的。如果东西坏了，就可以换。',
    modelReading:
      'Wǒ juéde zài wǎngshang mǎi dōngxi hěn fāngbiàn. Dànshì yǒu de shíhou dōngxi shì huài de. Rúguǒ dōngxi huài le, jiù kěyǐ huàn.',
    checklist: ['Empiezo con 我觉得.', 'Uso 但是 y, si puedo, 如果…就.'],
  },

  // ------------------------------------------------ A2, libres
  {
    ...a2,
    id: 'zh.a2.wt.lvxing',
    kind: 'free',
    codes: [],
    lesson: 'zh-a2-u06-final',
    title: 'Organizá un viaje',
    instructions: `Contá un viaje que tenés pensado: adónde, cómo vas, cuánto tarda, dónde dormís y qué querés hacer. ${howTo}`,
    prompts: ['你打算去哪儿？', '你怎么去？'],
    requirements: [
      pattern('plan', 'Pista: contá tu plan con 打算', [['打算', 'dǎsuan']], true),
      pattern('route', 'Pista: decí de dónde a dónde (从…到…)', [['从', 'cóng']], true),
      ...common(4, true),
    ],
    model:
      '下个星期我打算去上海旅游。我坐火车去，从北京到上海五个小时。我预订了一个宾馆。我想吃很多好吃的菜，也想去很多地方。',
    modelReading:
      'Xià ge xīngqī wǒ dǎsuan qù Shànghǎi lǚyóu. Wǒ zuò huǒchē qù, cóng Běijīng dào Shànghǎi wǔ ge xiǎoshí. Wǒ yùdìng le yí ge bīnguǎn. Wǒ xiǎng chī hěn duō hǎochī de cài, yě xiǎng qù hěn duō dìfang.',
    checklist: [
      'Digo adónde y cuándo voy.',
      'Cuento cómo viajo y dónde duermo.',
      'Cuento qué quiero hacer.',
    ],
  },
  {
    ...a2,
    id: 'zh.a2.wt.wenti',
    kind: 'free',
    codes: [],
    lesson: 'zh-a2-u12-final',
    title: 'Un problema que tuviste',
    instructions: `Terminaste el A2: contá un problema que tuviste (algo que perdiste, se rompió o te robaron), qué hiciste y cómo terminó. ${howTo}`,
    prompts: ['你怎么了？', '你怎么办？'],
    requirements: [
      pattern(
        'problem',
        'Pista: contá qué pasó (丢了 / 坏了 / 被…了)',
        [
          ['丢了', 'diū le'],
          ['坏了', 'huài le'],
          ['被', 'bèi'],
        ],
        true,
      ),
      pattern('solution', 'Pista: contá la solución (办法)', [['办法', 'bànfǎ']], true),
      ...common(4, true),
    ],
    model:
      '上个星期我的手机被偷了！我不知道怎么办。我的朋友说：别担心，我有办法。我们去了商店，买了一个新手机。现在我有新手机了，但是我还没习惯。',
    modelReading:
      'Shàng ge xīngqī wǒ de shǒujī bèi tōu le! Wǒ bù zhīdao zěnme bàn. Wǒ de péngyou shuō: bié dānxīn, wǒ yǒu bànfǎ. Wǒmen qù le shāngdiàn, mǎi le yí ge xīn shǒujī. Xiànzài wǒ yǒu xīn shǒujī le, dànshì wǒ hái méi xíguàn.',
    checklist: [
      'Cuento qué pasó con 了 o 被.',
      'Cuento qué hice y cómo terminó.',
      'Uso 但是 o 因为 para unir ideas.',
    ],
  },
];

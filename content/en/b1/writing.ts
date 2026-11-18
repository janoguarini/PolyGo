import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';

/**
 * Producción escrita de inglés B1 sin IA (docs/B1_EN.md), con el mismo sistema que A1 y A2
 * (shared/writing.ts): se comprueba en el dispositivo y el texto no se envía ni se guarda. Práctica
 * opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * - `guided`: correos personales y formales, relatos, opiniones, recomendaciones y reclamos, con
 *   requisitos observables (las estructuras que la lección acaba de practicar). Completa = todos los
 *   obligatorios cumplidos.
 * - `free`: texto libre de bloque (U4, U8 y U12), sin veredicto; modelo, pistas opcionales y lista de
 *   control.
 *
 * Sólo vocabulario enseñado hasta la lección (lo comprueba content/b1-checks.ts).
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
 */

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `Escribís al menos ${minSentences} oraciones`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Cada oración empieza con mayúscula', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'Terminás con punto, signo de exclamación o de pregunta',
    kind: 'end_punctuation',
  },
];

const base = { language: 'en', allowInvented: true as const, maxChars: 1200 };

/** Participios frecuentes del A2 y del B1 (U1–U3). */
const PARTICIPLES =
  'been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed';

const PRESENT_PERFECT: string[][] = [
  ['have|has', PARTICIPLES],
  ["i've|you've|we've|they've|he's|she's", PARTICIPLES],
  ['have|has', 'never|already|just|ever', PARTICIPLES],
  ["i've|you've|we've|they've|he's|she's", 'never|already|just|ever', PARTICIPLES],
];

export const EN_B1_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ Guiadas, al terminar la lección
  {
    ...base,
    id: 'en.b1.wt.unforgettable',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u01-l05',
    title: 'Una experiencia inolvidable',
    instructions:
      'Contá una experiencia importante de tu vida (real o inventada): presentala con el present perfect y contá los detalles en past simple, con cuándo pasó y cómo te sentiste.',
    prompts: ['What is your best memory?', 'When was it?', 'How did you feel?'],
    requirements: [
      {
        id: 'perfect',
        label: 'Usás el present perfect (I have been, I have climbed…)',
        kind: 'pattern',
        patterns: PRESENT_PERFECT,
      },
      {
        id: 'when',
        label: 'Decís cuándo pasó (two years ago, last summer, in 2019…)',
        kind: 'pattern',
        patterns: [['<WORD>', 'ago'], ['last', '<WORD>'], ['in', '<NUMBER>'], ['yesterday']],
      },
      {
        id: 'feeling',
        label: 'Decís cómo te sentiste (proud, happy, excited, nervous…)',
        kind: 'pattern',
        patterns: [['proud|happy|excited|nervous|scared|amazing|unforgettable']],
      },
      ...common(4),
    ],
    model:
      'I have been to many countries, but my best memory is my first trip to Spain. I went there two years ago with my sister. It was the first time I climbed a mountain. When we got to the top, I felt very proud. It was an unforgettable adventure!',
    checklist: [
      'Presenté la experiencia con el present perfect.',
      'Conté los detalles en past simple y dije cuándo pasó.',
      'Dije cómo me sentí.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.new-hobby',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u02-l05',
    title: 'Tu pasatiempo',
    instructions:
      'Escribile a un amigo sobre un pasatiempo que empezaste: desde cuándo lo hacés, qué venís haciendo y qué disfrutás de él.',
    prompts: [
      'What is your hobby?',
      'How long have you been doing it?',
      'What do you enjoy about it?',
    ],
    requirements: [
      {
        id: 'since-for',
        label: 'Decís desde cuándo con for o since',
        kind: 'pattern',
        patterns: [['for|since']],
      },
      {
        id: 'continuous',
        label: 'Usás have been + -ing (I have been learning…)',
        kind: 'pattern',
        patterns: [
          ['have|has', 'been', '<WORD>'],
          ["i've|you've|we've|they've|he's|she's", 'been', '<WORD>'],
        ],
      },
      {
        id: 'enjoy',
        label: 'Decís qué disfrutás (I enjoy / I love + -ing)',
        kind: 'pattern',
        patterns: [['enjoy|love|like', '<WORD>']],
      },
      ...common(3),
    ],
    model:
      'Hi Tom! I have been learning to play the guitar since January. I practice for one hour every day. I really enjoy playing with my friends, and my skills have improved a lot.',
    checklist: [
      'Dije desde cuándo hago el pasatiempo (for / since).',
      'Usé have been + -ing.',
      'Conté qué disfruto.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.anecdote',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u03-l05',
    title: 'Una anécdota',
    instructions:
      'Contá una anécdota (real o inventada): qué estabas haciendo, qué pasó, qué ya había pasado antes y cómo terminó.',
    prompts: ['What were you doing?', 'What happened?', 'How did it end?'],
    requirements: [
      {
        id: 'scene',
        label: 'Armás la escena con was/were + -ing',
        kind: 'pattern',
        patterns: [
          [
            'was|were',
            'walking|waiting|having|reading|working|driving|sleeping|eating|cooking|watching|talking|going|sitting|studying|traveling|travelling|running|playing',
          ],
        ],
      },
      {
        id: 'past-perfect',
        label: 'Usás had + participio (had left, had forgotten…)',
        kind: 'pattern',
        patterns: [
          ['had', PARTICIPLES],
          ['had', 'already', PARTICIPLES],
        ],
      },
      {
        id: 'sequence',
        label: 'Ordenás los hechos (when, by the time, as soon as, afterwards, eventually…)',
        kind: 'pattern',
        patterns: [['by', 'the', 'time'], ['as', 'soon', 'as'], ['afterwards|eventually|then']],
      },
      ...common(4),
    ],
    model:
      'Last week I was waiting for the bus when I realized that I had forgotten my phone at home. I went back to get it. By the time I arrived at the bus stop again, the bus had left. Eventually, I walked to work. I was late, but my boss laughed!',
    checklist: [
      'Armé la escena con was/were + -ing.',
      'Usé had + participio para algo que ya había pasado.',
      'Ordené los hechos y conté el final.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.my-goals',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u04-l05',
    title: 'Tus objetivos',
    instructions:
      'Escribí tus objetivos para el año que viene: qué vas a hacer, qué podría pasar y qué vas a hacer cuando termines algo.',
    prompts: ['What is your goal?', 'What are you going to do?', 'What might change?'],
    requirements: [
      {
        id: 'going-to',
        label: 'Contás una intención con going to',
        kind: 'pattern',
        patterns: [['going', 'to']],
      },
      {
        id: 'might',
        label: 'Contás algo posible con might',
        kind: 'pattern',
        patterns: [['might']],
      },
      {
        id: 'when',
        label: 'Usás when / as soon as + presente y will',
        kind: 'pattern',
        patterns: [
          ['when|until', '<WORD>', '<WORD>'],
          ['as', 'soon', 'as'],
        ],
      },
      ...common(3),
    ],
    model:
      'My goal for next year is to speak better English. I am going to take an English course, and I might apply for a job abroad. When I finish the course, I will look for a new job.',
    checklist: [
      'Conté una intención con going to.',
      'Usé might para algo posible.',
      'Usé when + presente.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.job-application',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u05-l05',
    title: 'Postularte a un trabajo',
    instructions:
      'Escribí un correo formal para postularte a un trabajo (real o inventado): saludá, decí a qué trabajo te postulás, contá tu experiencia y despedite.',
    prompts: [
      'Which job do you want?',
      'What experience do you have?',
      'What were you responsible for?',
    ],
    requirements: [
      {
        id: 'greeting',
        label: 'Empezás con un saludo formal (Dear…)',
        kind: 'pattern',
        patterns: [['dear']],
      },
      {
        id: 'apply',
        label: 'Decís a qué te postulás (I would like to apply for…)',
        kind: 'pattern',
        patterns: [['apply', 'for']],
      },
      {
        id: 'experience',
        label: 'Contás tu experiencia (I worked… / I was responsible for…)',
        kind: 'pattern',
        patterns: [['responsible', 'for'], ['worked'], ['experience']],
      },
      {
        id: 'closing',
        label: 'Te despedís de forma formal (I look forward to hearing from you / Best wishes)',
        kind: 'pattern',
        patterns: [
          ['look', 'forward'],
          ['best', 'wishes'],
        ],
      },
      ...common(4),
    ],
    model:
      'Dear Sir or Madam, I would like to apply for the part-time job at your hotel. I worked in a shop for three years, and I was responsible for the money. I speak English and Spanish. I look forward to hearing from you. Best wishes, Ana.',
    checklist: [
      'Saludé y me despedí de forma formal.',
      'Dije a qué trabajo me postulo.',
      'Conté mi experiencia y mis tareas.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.visitor-tips',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u06-l05',
    title: 'Consejos para un visitante',
    instructions:
      'Escribile a alguien que va a visitar tu ciudad o tu país: dale consejos con if y contale una costumbre (qué es de buena o de mala educación).',
    prompts: ['What should a tourist do?', 'What is polite in your country?', 'What is rude?'],
    requirements: [
      {
        id: 'if-will',
        label: 'Usás el primer condicional (If you…, you will…)',
        kind: 'pattern',
        patterns: [['if', '<WORD>'], ['unless']],
      },
      {
        id: 'will',
        label: 'Usás will para el resultado',
        kind: 'pattern',
        patterns: [['will'], ["you'll"], ["it'll"]],
      },
      {
        id: 'custom',
        label: 'Explicás una costumbre (polite, rude, tradition)',
        kind: 'pattern',
        patterns: [['polite|rude|tradition']],
      },
      ...common(4),
    ],
    model:
      'If you visit my city, you will love the food. Exchange some money before you come, because many small shops only take cash. It is polite to say hello when you go into a shop. If you go to a restaurant, leave a tip.',
    checklist: ['Di consejos con if.', 'Expliqué una costumbre.', 'Usé will para el resultado.'],
  },
  {
    ...base,
    id: 'en.b1.wt.health-advice',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u07-l05',
    title: 'Consejos a un amigo estresado',
    instructions:
      'Un amigo te cuenta que está muy estresado. Respondele con al menos dos consejos (should, ought to, had better) y una comparación.',
    prompts: ['What should your friend do?', 'What is better for him?'],
    requirements: [
      {
        id: 'advice',
        label: 'Das un consejo con should u ought to',
        kind: 'pattern',
        patterns: [['should'], ['ought', 'to']],
      },
      {
        id: 'better',
        label: "Advertís con had better (You'd better…)",
        kind: 'pattern',
        patterns: [
          ["you'd", 'better'],
          ['had', 'better'],
        ],
      },
      {
        id: 'compare',
        label: 'Comparás (as … as, much better, the more…, the better…)',
        kind: 'pattern',
        patterns: [
          ['as', '<WORD>', 'as'],
          ['much|a', 'better|healthier|easier|worse'],
          ['the', 'more'],
        ],
      },
      ...common(4),
    ],
    model:
      "I'm sorry you are so stressed. You ought to take a few days off. You should sleep more: the more you sleep, the better you feel. You'd better not work at night.",
    checklist: ['Di consejos con should u ought to.', 'Advertí con had better.', 'Comparé algo.'],
  },
  {
    ...base,
    id: 'en.b1.wt.recommend-app',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u08-l05',
    title: 'Recomendar una app',
    instructions:
      'Recomendá una app o un aparato que uses: qué hace (which / that), cómo lo usás y para quién es (people who…).',
    prompts: ['What does the app do?', 'How do you use it?', 'Who is it good for?'],
    requirements: [
      {
        id: 'which',
        label: 'Explicás qué hace con which o that (an app which helps you…)',
        kind: 'pattern',
        patterns: [['app|device|phone|computer|thing', 'which|that']],
      },
      {
        id: 'who',
        label: 'Decís para quién es con who (people who…)',
        kind: 'pattern',
        patterns: [['people|person|students|friends', 'who']],
      },
      ...common(3),
    ],
    model:
      "I recommend an app which helps you learn new words. You can download it for free, and it works online. I use it every day on the bus. It is great for people who don't have much time.",
    checklist: [
      'Expliqué qué hace con which o that.',
      'Dije para quién es con who.',
      'Conté cómo la uso.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.my-community',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u09-l05',
    title: 'Tu barrio y el medioambiente',
    instructions:
      'Contá qué se hace en tu barrio o tu ciudad por el medioambiente (con la voz pasiva) y proponé una idea para mejorar.',
    prompts: ['What is recycled in your city?', 'What was done last year?', 'What should we do?'],
    requirements: [
      {
        id: 'passive',
        label: 'Usás la voz pasiva (is recycled, was built…)',
        kind: 'pattern',
        patterns: [
          [
            'is|are|was|were',
            'recycled|collected|built|made|produced|cleaned|planted|used|protected|reduced|done|rescued',
          ],
        ],
      },
      {
        id: 'proposal',
        label: 'Proponés algo (we should…, we have to…, if we…)',
        kind: 'pattern',
        patterns: [['should'], ['have', 'to'], ['if', 'we']],
      },
      ...common(3),
    ],
    model:
      'In my neighborhood, paper and plastic are recycled every week. Last year a small park was built near my house, and a lot of trees were planted by volunteers. I think we should use public transport more, because cars produce a lot of pollution.',
    checklist: ['Usé la voz pasiva.', 'Conté algo que se hizo.', 'Propuse una idea.'],
  },
  {
    ...base,
    id: 'en.b1.wt.what-they-said',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u10-l05',
    title: 'Lo que te contaron',
    instructions:
      'Contá una conversación reciente en estilo indirecto: qué te dijo alguien (said / told me) y qué te preguntó (asked if…).',
    prompts: ['Who called you?', 'What did they say?', 'What did they ask?'],
    requirements: [
      {
        id: 'said',
        label: 'Usás said (that) o told me (that)',
        kind: 'pattern',
        patterns: [['said'], ['told', '<WORD>']],
      },
      {
        id: 'asked',
        label: 'Contás una pregunta con asked if / asked where…',
        kind: 'pattern',
        patterns: [
          ['asked', 'if|where|what|when|why|how'],
          ['asked', 'me|us|him|her', 'if|where|what|when|why|how'],
        ],
      },
      ...common(3),
    ],
    model:
      'Yesterday my friend Tom called me. He told me that he had a new job. He said that the company was very big. He asked if I wanted to have dinner with him on Friday.',
    checklist: [
      'Conté lo que dijo con said o told.',
      'Pasé los verbos al pasado.',
      'Conté una pregunta con asked if.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.my-opinion',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u11-l05',
    title: 'Tu opinión',
    instructions:
      'Elegí un tema (vivir en una ciudad grande o chica, trabajar desde casa, las redes sociales…) y escribí tu opinión con una ventaja, una desventaja y qué harías vos.',
    prompts: ['What do you think?', 'What is one advantage?', 'What would you do?'],
    requirements: [
      {
        id: 'opinion',
        label: 'Das tu opinión (In my opinion… / I think…)',
        kind: 'pattern',
        patterns: [
          ['in', 'my', 'opinion'],
          ['i', 'think'],
        ],
      },
      {
        id: 'contrast',
        label: 'Mostrás los dos lados (advantage, disadvantage, on the other hand)',
        kind: 'pattern',
        patterns: [['advantage|disadvantage'], ['on', 'the', 'other', 'hand']],
      },
      {
        id: 'would',
        label: 'Usás el segundo condicional (If I…, I would…)',
        kind: 'pattern',
        patterns: [['would'], ["i'd"]],
      },
      ...common(4),
    ],
    model:
      'In my opinion, it is better to live in a small city. One advantage is that it is quiet. On the other hand, there are fewer jobs. If it were my decision, I would live in a small city near the sea.',
    checklist: ['Di mi opinión.', 'Mostré una ventaja y una desventaja.', 'Usé would.'],
  },
  {
    ...base,
    id: 'en.b1.wt.complaint',
    kind: 'guided',
    codes: [],
    lesson: 'b1-u12-l03',
    title: 'Un reclamo formal',
    instructions:
      'Escribí un correo para reclamar por algo que compraste y no funciona: qué compraste, qué problema tiene y qué pedís (un reembolso o un cambio).',
    prompts: ['What did you buy?', 'What is the problem?', 'What would you like?'],
    requirements: [
      {
        id: 'greeting',
        label: 'Empezás con un saludo formal (Dear…)',
        kind: 'pattern',
        patterns: [['dear']],
      },
      {
        id: 'problem',
        label: 'Explicás el problema (stopped working, broke, broken…)',
        kind: 'pattern',
        patterns: [["stopped|broke|broken|problem|doesn't|didn't"]],
      },
      {
        id: 'request',
        label: 'Pedís algo con cortesía (I would like a refund / Could you replace it?)',
        kind: 'pattern',
        patterns: [
          ['would', 'like'],
          ["i'd", 'like'],
          ['could', 'you'],
        ],
      },
      ...common(4),
    ],
    model:
      'Dear Sir or Madam, I bought a phone charger from your shop last week. It was expensive, but it stopped working after two days. I would like a refund, or could you replace it, please? I have the receipt. Best wishes, Kate Brown.',
    checklist: [
      'Saludé de forma formal.',
      'Expliqué el problema.',
      'Pedí un reembolso o un cambio con cortesía.',
    ],
  },

  // ------------------------------------------------ Libres, al cierre de cada bloque (sin veredicto)
  {
    ...base,
    id: 'en.b1.wt.block1-life',
    kind: 'free',
    codes: [],
    lesson: 'b1-u04-final',
    block: 1,
    title: 'Tu vida hasta ahora y tus planes',
    instructions:
      'Escribí un texto sobre vos: algo que hiciste en tu vida, algo que venís haciendo últimamente, una anécdota corta y tus planes para el futuro.',
    prompts: [
      'What have you done in your life?',
      'What have you been doing lately?',
      'What are your plans?',
    ],
    requirements: [
      {
        id: 'perfect',
        label: '¿Usaste el present perfect?',
        kind: 'pattern',
        patterns: PRESENT_PERFECT,
        optional: true,
      },
      {
        id: 'continuous',
        label: '¿Contaste algo que venís haciendo (have been + -ing)?',
        kind: 'pattern',
        patterns: [['been', '<WORD>']],
        optional: true,
      },
      {
        id: 'future',
        label: '¿Contaste tus planes (going to, will, might)?',
        kind: 'pattern',
        patterns: [['going', 'to'], ['will'], ['might']],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 5 oraciones?',
        kind: 'min_sentences',
        min: 5,
        optional: true,
      },
    ],
    model:
      'I have lived in the same city all my life, but I have traveled to five countries. Lately I have been studying English every day. Last summer I missed my flight because I had forgotten my passport! Next year I am going to take an English course. I might move abroad someday.',
    checklist: [
      'Conté experiencias con el present perfect.',
      'Conté algo que vengo haciendo.',
      'Incluí una anécdota y mis planes.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.block2-visit',
    kind: 'free',
    codes: [],
    lesson: 'b1-u08-final',
    block: 2,
    title: 'Un correo a alguien que viene de visita',
    instructions:
      'Un amigo de otro país viene a visitarte. Escribile un correo: qué tiene que hacer o no hace falta que haga, consejos de viaje y de salud, y cómo van a seguir en contacto.',
    prompts: [
      'What does your friend have to do?',
      'What should he bring?',
      'How will you keep in touch?',
    ],
    requirements: [
      {
        id: 'obligation',
        label: "¿Usaste have to, don't have to o must?",
        kind: 'pattern',
        patterns: [['have', 'to'], ['must']],
        optional: true,
      },
      {
        id: 'if',
        label: '¿Diste un consejo con if?',
        kind: 'pattern',
        patterns: [['if']],
        optional: true,
      },
      {
        id: 'relative',
        label: '¿Usaste who, which o where para explicar algo?',
        kind: 'pattern',
        patterns: [['who|which|where']],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 5 oraciones?',
        kind: 'min_sentences',
        min: 5,
        optional: true,
      },
    ],
    model:
      "Hi Tom! I'm so happy you are coming next month. You don't have to bring a lot of clothes, because it is warm here. If you are tired after the flight, we will rest at home. I will take you to the cafe where I work. My phone battery is always low, so send me a message before you arrive!",
    checklist: [
      'Expliqué qué tiene que hacer y qué no hace falta.',
      'Di consejos con if.',
      'Usé who, which o where.',
    ],
  },
  {
    ...base,
    id: 'en.b1.wt.block3-problem',
    kind: 'free',
    codes: [],
    lesson: 'b1-u12-final',
    block: 3,
    title: 'Un problema de tu ciudad',
    instructions:
      'Elegí un problema de tu ciudad (el transporte, la basura, el ruido…). Explicá la causa, contá qué se hizo, da tu opinión y proponé una solución.',
    prompts: ['What is the problem?', 'Why is it a problem?', 'What would you do?'],
    requirements: [
      {
        id: 'cause',
        label: '¿Explicaste la causa (because, because of)?',
        kind: 'pattern',
        patterns: [['because']],
        optional: true,
      },
      {
        id: 'contrast',
        label: '¿Mostraste un contraste (although, however, on the other hand)?',
        kind: 'pattern',
        patterns: [['although|however'], ['on', 'the', 'other', 'hand']],
        optional: true,
      },
      {
        id: 'opinion',
        label: '¿Diste tu opinión?',
        kind: 'pattern',
        patterns: [
          ['in', 'my', 'opinion'],
          ['i', 'think'],
        ],
        optional: true,
      },
      {
        id: 'would',
        label: '¿Propusiste una solución (if…, would / will)?',
        kind: 'pattern',
        patterns: [['would'], ['will']],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 5 oraciones?',
        kind: 'min_sentences',
        min: 5,
        optional: true,
      },
    ],
    model:
      'In my city, there is a lot of pollution because of the cars. Although there are buses, many people drive to work. Last year some new bus stops were built. However, they are not enough. In my opinion, public transport should be cheaper. If it were cheaper, more people would use it.',
    checklist: [
      'Expliqué el problema y su causa.',
      'Mostré un contraste.',
      'Di mi opinión y una solución.',
    ],
  },
];

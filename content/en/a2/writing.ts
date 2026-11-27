import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';

/**
 * Producción escrita de inglés A2 sin IA (docs/A2_EN_COMPLETION.md §5), con el mismo sistema que A1
 * (shared/writing.ts, docs/A1_EN_CLOSURE.md §6): se comprueba en el dispositivo y el texto no se
 * envía ni se guarda. Práctica opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * - `guided`: mensajes, correos, descripciones y relatos cortos con requisitos observables
 *   (estructuras del A2 que la lección acaba de practicar). Completa = todos los obligatorios.
 * - `free`: texto libre de bloque, sin veredicto; modelo, pistas opcionales y lista de control.
 *
 * Sólo vocabulario enseñado hasta la lección (lo comprueba content/a2-expansion-checks.ts).
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
 */

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `Escribes al menos ${minSentences} oraciones`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Cada oración empieza con mayúscula', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'Terminas con punto, signo de exclamación o de pregunta',
    kind: 'end_punctuation',
  },
];

const base = { language: 'en', allowInvented: true as const, maxChars: 800 };

/** Pasados irregulares y regulares frecuentes del A2 (U2 y U3). */
const PAST =
  'went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked';

export const EN_A2_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ Guiadas, al terminar la lección
  {
    ...base,
    id: 'en.a2.wt.a-party',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u01-l05',
    title: 'Una fiesta',
    instructions:
      'Cuéntale a un amigo cómo fue una fiesta o un cumpleaños (real o inventado): dónde fue, cuándo y cómo te sentías.',
    prompts: ['Where was the party?', 'When was it?', 'How were you?'],
    requirements: [
      {
        id: 'was-were',
        label: 'Usas was o were',
        kind: 'pattern',
        patterns: [['was|were']],
      },
      {
        id: 'when',
        label: 'Dices cuándo fue (yesterday, last week, last night, on Saturday…)',
        kind: 'pattern',
        patterns: [
          ['yesterday'],
          [
            'last',
            'night|week|year|weekend|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday',
          ],
          ['on', 'monday|tuesday|wednesday|thursday|friday|saturday|sunday'],
          ['<WORD>', 'ago'],
        ],
      },
      {
        id: 'feeling',
        label: 'Dices cómo te sentías (happy, tired, excited, bored…)',
        kind: 'pattern',
        patterns: [['happy|tired|excited|bored|sad|nervous|angry|busy']],
      },
      ...common(3),
    ],
    model:
      'The party was at my friend’s house last Saturday. I was very happy and excited. The music was great!',
    checklist: ['Usé was y were.', 'Dije cuándo fue.', 'Dije cómo me sentía.'],
  },
  {
    ...base,
    id: 'en.a2.wt.my-weekend',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u03-l05',
    title: 'Tu fin de semana',
    instructions:
      'Cuenta qué hiciste el fin de semana pasado (puedes inventarlo). Usa verbos en pasado y di cuándo.',
    prompts: ['What did you do last weekend?', 'Where did you go?', 'Who did you see?'],
    requirements: [
      {
        id: 'past',
        label: 'Usas al menos un verbo en pasado (went, had, saw, bought…)',
        kind: 'pattern',
        patterns: [[PAST]],
      },
      {
        id: 'when',
        label: 'Dices cuándo (last weekend, on Saturday, yesterday…)',
        kind: 'pattern',
        patterns: [['last', 'weekend|week|night'], ['on', 'saturday|sunday|friday'], ['yesterday']],
      },
      {
        id: 'then',
        label: 'Ordenas lo que hiciste con then o after (opcional)',
        kind: 'pattern',
        patterns: [['then'], ['after']],
        optional: true,
      },
      ...common(3),
    ],
    model:
      'Last weekend I went to the park with my family. We ate chicken and then we walked in the city. On Sunday I slept a lot!',
    checklist: ['Usé verbos en pasado.', 'Dije cuándo pasó.', 'Ordené lo que hice.'],
  },
  {
    ...base,
    id: 'en.a2.wt.holiday-message',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u04-l05',
    title: 'Un mensaje desde tus vacaciones',
    instructions:
      'Escríbele a un amigo desde un viaje (real o inventado): dónde estás, cómo llegaste y qué hiciste.',
    prompts: ['Where are you?', 'How did you travel?', 'What did you see?'],
    requirements: [
      {
        id: 'place',
        label: 'Dices dónde estás (I am in… / I’m at the beach…)',
        kind: 'pattern',
        patterns: [
          ['i', 'am', 'in|at'],
          ["i'm", 'in|at'],
        ],
      },
      {
        id: 'transport',
        label: 'Dices cómo viajaste con by (by plane, by train, by car…)',
        kind: 'pattern',
        patterns: [['by', 'plane|train|car|bus|bike']],
      },
      {
        id: 'past',
        label: 'Cuentas algo que hiciste, en pasado',
        kind: 'pattern',
        patterns: [[PAST]],
      },
      ...common(3),
    ],
    model:
      'Hi Tom! I am in Mexico on vacation. I came by plane. Yesterday I went to the beach and I took a lot of photos. See you!',
    checklist: ['Dije dónde estoy.', 'Dije cómo viajé (by…).', 'Conté algo que hice.'],
  },
  {
    ...base,
    id: 'en.a2.wt.my-plans',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u08-l05',
    title: 'Tus planes',
    instructions:
      'Cuenta tus planes para la semana que viene (puedes inventarlos) y algo que crees que va a pasar.',
    prompts: ['What are you going to do next week?', 'Do you think it will be a good week?'],
    requirements: [
      {
        id: 'going-to',
        label: 'Cuentas un plan con going to',
        kind: 'pattern',
        patterns: [['going', 'to', '<WORD>']],
      },
      {
        id: 'will',
        label: 'Haces una predicción con will o won’t',
        kind: 'pattern',
        patterns: [["will|won't|i'll|it'll|we'll|you'll|he'll|she'll|they'll"]],
      },
      {
        id: 'when',
        label: 'Dices cuándo (next week, tomorrow, tonight, soon…)',
        kind: 'pattern',
        patterns: [['next', 'week|month|year|weekend'], ['tomorrow'], ['tonight'], ['soon']],
      },
      ...common(3),
    ],
    model:
      'Next week I am going to visit my grandmother. We are going to cook dinner. I think it will be a great week.',
    checklist: ['Conté un plan con going to.', 'Hice una predicción con will.', 'Dije cuándo.'],
  },
  {
    ...base,
    id: 'en.a2.wt.advice',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u09-l05',
    title: 'Un consejo para un amigo',
    instructions:
      'Tu amigo te escribe que se siente mal. Respóndele: pregunta qué le duele y dale consejos con should y shouldn’t.',
    prompts: ["I'm sick. I have a headache and a fever."],
    requirements: [
      {
        id: 'should',
        label: 'Das un consejo con should',
        kind: 'pattern',
        patterns: [['should', '<WORD>']],
      },
      {
        id: 'shouldnt',
        label: 'Dices algo que no debería hacer con shouldn’t',
        kind: 'pattern',
        patterns: [
          ["shouldn't", '<WORD>'],
          ['should', 'not', '<WORD>'],
        ],
      },
      {
        id: 'body',
        label: 'Nombras el cuerpo o la salud (head, headache, fever, doctor, medicine…)',
        kind: 'pattern',
        patterns: [['head|headache|fever|doctor|medicine|stomach|back|sick|rest']],
      },
      ...common(3),
    ],
    model:
      "I'm sorry. You should go to the doctor. You should rest and drink a lot of water. You shouldn't go to work tomorrow.",
    checklist: ['Di un consejo con should.', 'Usé shouldn’t.', 'Hablé de la salud.'],
  },
  {
    ...base,
    id: 'en.a2.wt.experiences',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u12-l05',
    title: 'Tus experiencias',
    instructions:
      'Cuenta dos cosas que hiciste alguna vez y una que nunca hiciste (puedes inventarlas).',
    prompts: ['Have you ever been abroad?', 'Have you ever been to a famous city?'],
    requirements: [
      {
        id: 'have-done',
        label: 'Usas have + participio (I have been, I’ve seen…)',
        kind: 'pattern',
        patterns: [
          ['i', 'have', 'been|seen|done|eaten|visited|tried|met|played|traveled|lived|had|made'],
          ["i've", 'been|seen|done|eaten|visited|tried|met|played|traveled|lived|had|made'],
        ],
      },
      {
        id: 'never',
        label: 'Dices algo que nunca hiciste (I have never… / I haven’t…)',
        kind: 'pattern',
        patterns: [['never'], ["haven't"]],
      },
      ...common(3),
    ],
    model:
      'I have been to Spain twice. I have eaten a lot of amazing food there. I have never seen snow!',
    checklist: [
      'Conté experiencias con have + participio.',
      'Dije algo que nunca hice.',
      'Usé ever, never o twice.',
    ],
  },
  {
    ...base,
    id: 'en.a2.wt.restaurant',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u13-l05',
    title: 'Una cena afuera',
    instructions:
      'Cuenta una comida en un restaurante (real o inventada): qué pediste, cómo estaba y cómo pagaste.',
    prompts: ['What did you order?', 'Was it good?', 'How did you pay?'],
    requirements: [
      {
        id: 'food',
        label: 'Nombras lo que comiste (soup, salad, fish, meat, dessert…)',
        kind: 'pattern',
        patterns: [['soup|salad|fish|meat|vegetables|dessert|chicken|rice|bread|cheese|eggs']],
      },
      {
        id: 'opinion',
        label: 'Dices cómo estaba (delicious, spicy, good…)',
        kind: 'pattern',
        patterns: [['delicious|spicy|good|great|amazing|bad|cold|hot']],
      },
      {
        id: 'pay',
        label: 'Cuentas cómo pagaste o que pediste la cuenta',
        kind: 'pattern',
        patterns: [['paid|pay|bill|card|cash']],
      },
      ...common(3),
    ],
    model:
      'Last night I went to a restaurant with my sister. I ordered fish and a salad, and the dessert was delicious. We paid by card.',
    checklist: ['Dije qué comí.', 'Di mi opinión.', 'Conté cómo pagamos.'],
  },
  {
    ...base,
    id: 'en.a2.wt.reply-invitation',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u14-l05',
    title: 'Responder una invitación',
    instructions:
      'Mia te invita a su cumpleaños. Respóndele: agradece y acepta, o rechaza con una razón y propón otro plan.',
    prompts: ['Hi! Would you like to come to my birthday party on Saturday? Mia'],
    requirements: [
      {
        id: 'thanks',
        label: 'Agradeces (Thank you / Thanks)',
        kind: 'pattern',
        patterns: [['thank', 'you'], ['thanks']],
      },
      {
        id: 'answer',
        label: 'Aceptas (I’d love to) o rechazas (Sorry, I can’t)',
        kind: 'pattern',
        patterns: [["i'd", 'love', 'to'], ['i', 'would', 'love', 'to'], ["can't"], ['cannot']],
      },
      {
        id: 'plan',
        label: "Propones algo con Let's… o How about…? (opcional)",
        kind: 'pattern',
        patterns: [["let's"], ['how', 'about']],
        optional: true,
      },
      ...common(2),
    ],
    model:
      "Hi Mia! Thank you for the invitation. Sorry, I can't go on Saturday because I have to work. How about dinner on Sunday?",
    glossary: [{ term: 'invitation', meaning: 'invitación' }],
    checklist: ['Agradecí.', 'Acepté o rechacé con una razón.', 'Propuse otro plan.'],
  },
  {
    ...base,
    id: 'en.a2.wt.describe-someone',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u15-l05',
    title: 'Describe a alguien',
    instructions:
      'Describe a una persona que conoces (o invéntala): cómo es físicamente y cómo es de carácter.',
    prompts: ['What does he or she look like?', 'What is he or she like?'],
    requirements: [
      {
        id: 'looks',
        label: 'Describes el aspecto (tall, short, thin… / has … hair, a beard, glasses)',
        kind: 'pattern',
        patterns: [
          ['tall|short|thin|young|old'],
          ['has|have', '<WORD>', 'hair'],
          ['has|have', '<WORD>', '<WORD>', 'hair'],
          ['beard|glasses'],
        ],
      },
      {
        id: 'personality',
        label: 'Describes el carácter (friendly, kind, funny, shy, quiet…)',
        kind: 'pattern',
        patterns: [['friendly|kind|funny|shy|quiet|nice|interesting']],
      },
      {
        id: 'linker',
        label: 'Unes ideas con and, but o because (opcional)',
        kind: 'pattern',
        patterns: [['but'], ['because']],
        optional: true,
      },
      ...common(3),
    ],
    model:
      'My best friend is Ana. She is tall and she has long dark hair. She is very funny, but she is a little shy at first.',
    glossary: [{ term: 'a little', meaning: 'un poco' }],
    checklist: ['Describí el aspecto.', 'Describí el carácter.', 'Usé and, but o because.'],
  },
  {
    ...base,
    id: 'en.a2.wt.booking-email',
    kind: 'guided',
    codes: [],
    lesson: 'a2-u16-l05',
    title: 'Un correo para reservar',
    instructions:
      'Escríbele al Green Hotel para reservar una habitación: saluda, di qué quieres y para cuándo, haz una pregunta y despídete.',
    prompts: [],
    requirements: [
      {
        id: 'opening',
        label: 'Empiezas con Dear… o Hello',
        kind: 'pattern',
        patterns: [['dear'], ['hello'], ['hi']],
      },
      {
        id: 'book',
        label: 'Pides la habitación (I’d like to book…)',
        kind: 'pattern',
        patterns: [['book', 'a|the', '<WORD>'], ['book', 'a|the', 'room'], ['room']],
      },
      {
        id: 'could-you',
        label: 'Haces un pedido con Could you…?',
        kind: 'pattern',
        patterns: [['could', 'you']],
      },
      {
        id: 'closing',
        label: 'Terminas con Best wishes o Thank you',
        kind: 'pattern',
        patterns: [['best', 'wishes'], ['thank', 'you'], ['thanks']],
      },
      ...common(3).filter((r) => r.kind !== 'end_punctuation'),
    ],
    model:
      "Dear Green Hotel, I'd like to book a double room for two nights in July. Could you send me the price, please? Best wishes, Ana",
    checklist: [
      'Saludé y me despedí.',
      'Dije qué habitación quiero y cuándo.',
      'Pedí algo con Could you…?',
    ],
  },

  // ------------------------------------------------ Libres, al terminar un bloque
  {
    ...base,
    id: 'en.a2.wt.block1-trip',
    kind: 'free',
    codes: [],
    lesson: 'a2-u06-final',
    block: 1,
    title: 'Un viaje y unas compras',
    instructions:
      'Escribe un mensaje a un amigo sobre un viaje (real o inventado): adónde fuiste, cómo viajaste, qué hiciste y qué compraste.',
    prompts: ['Where did you go?', 'What did you do?', 'What did you buy?'],
    requirements: [
      {
        id: 'past',
        label: '¿Usaste verbos en pasado?',
        kind: 'pattern',
        patterns: [[PAST]],
        optional: true,
      },
      {
        id: 'by',
        label: '¿Dijiste cómo viajaste (by…)?',
        kind: 'pattern',
        patterns: [['by', '<WORD>']],
        optional: true,
      },
      {
        id: 'bought',
        label: '¿Contaste qué compraste?',
        kind: 'pattern',
        patterns: [['bought|buy']],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 4 oraciones?',
        kind: 'min_sentences',
        min: 4,
        optional: true,
      },
    ],
    model:
      'Hi Tom! Last month I went to Spain by plane. I visited a lot of museums and beaches. I bought a new jacket and new shoes. It was a great trip!',
    checklist: ['Conté adónde fui y cómo viajé.', 'Usé verbos en pasado.', 'Conté qué compré.'],
  },
  {
    ...base,
    id: 'en.a2.wt.block2-news',
    kind: 'free',
    codes: [],
    lesson: 'a2-u12-final',
    block: 2,
    title: 'Un correo con novedades',
    instructions:
      'Escríbele un correo a un amigo con tus novedades: qué estás haciendo ahora, qué vas a hacer pronto y algo que ya hiciste.',
    prompts: [
      'What are you doing these days?',
      'What are you going to do?',
      'Have you done anything new?',
    ],
    requirements: [
      {
        id: 'now',
        label: '¿Contaste qué estás haciendo ahora (am/is/are + -ing)?',
        kind: 'pattern',
        patterns: [['am|is|are', '<WORD>']],
        optional: true,
      },
      {
        id: 'future',
        label: '¿Contaste un plan (going to / will)?',
        kind: 'pattern',
        patterns: [['going', 'to'], ['will'], ["i'll"]],
        optional: true,
      },
      {
        id: 'perfect',
        label: '¿Usaste have + participio?',
        kind: 'pattern',
        patterns: [['have|has', 'been|seen|done|eaten|visited|already|just|never']],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 4 oraciones?',
        kind: 'min_sentences',
        min: 4,
        optional: true,
      },
    ],
    model:
      'Hi Ana! I am working in a new office now and I have a lot of meetings. Next month I am going to move to a new apartment. I have just started a new job! See you soon.',
    checklist: ['Conté qué estoy haciendo ahora.', 'Conté un plan.', 'Conté algo que ya hice.'],
  },
  {
    ...base,
    id: 'en.a2.wt.block3-story',
    kind: 'free',
    codes: [],
    lesson: 'a2-u17-final',
    block: 3,
    title: 'Cuenta una historia',
    instructions:
      'Cuenta una historia corta (real o inventada): dónde estabas y qué estabas haciendo, qué pasó de repente y cómo terminó.',
    prompts: ['Where were you?', 'What were you doing?', 'What happened?', 'How did it end?'],
    requirements: [
      {
        id: 'continuous',
        label: '¿Usaste was/were + -ing?',
        kind: 'pattern',
        patterns: [['was|were', '<WORD>']],
        optional: true,
      },
      {
        id: 'suddenly',
        label: '¿Usaste suddenly, when o while?',
        kind: 'pattern',
        patterns: [['suddenly'], ['when'], ['while']],
        optional: true,
      },
      {
        id: 'end',
        label: '¿Le diste un final (in the end, the next day…)?',
        kind: 'pattern',
        patterns: [['in', 'the', 'end'], ['the', 'next', 'day'], ['luckily']],
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
      'Last winter I was walking in the park with my friend. It was very cold. Suddenly, it began to snow. At first we were scared, but then we laughed and played in the snow. In the end, it was a great day!',
    checklist: [
      'Conté dónde estaba y qué estaba haciendo.',
      'Conté qué pasó de repente.',
      'La historia tiene un final.',
    ],
  },
];

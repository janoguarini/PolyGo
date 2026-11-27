import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';

/**
 * Producción escrita de inglés A1 sin IA (docs/A1_EN_CLOSURE.md §6; mapa curricular §2, «Production»,
 * y §3, tareas de bloque). Se comprueban con shared/writing.ts en el dispositivo; el texto no se envía
 * ni se guarda.
 *
 * - `guided` (GW, respuesta guiada con datos propios): requisitos observables (expresiones,
 *   estructuras, cantidad de información). Completa = todos los obligatorios cumplidos. Reemplaza en
 *   la práctica a los SA que el mapa pasa a GW (U1 L5, U3 L4, U4 L5, U8 L5, U11 L5, U12 L5), que
 *   siguen cargados sin cambios.
 * - `free` (FW, texto libre breve): sin veredicto. El alumno compara con el modelo y marca la lista
 *   de control; las pistas («¿usaste and o but?») son opcionales.
 *
 * Sólo vocabulario A1 enseñado hasta la lección o el bloque (lo comprueba closure.test.ts sobre los
 * modelos y las preguntas guía). ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
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

const base = { language: 'en', allowInvented: true as const, maxChars: 600 };

export const EN_A1_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ GW por lección (datos propios)
  {
    ...base,
    id: 'en.a1.wt.how-are-you',
    kind: 'guided',
    codes: ['p08', 'v01'],
    lesson: 'a1-u01-l05',
    title: 'Saluda y di cómo estás',
    instructions:
      'Responde a Tom con tus datos (puedes inventarlos): saluda, di tu nombre y cómo estás.',
    prompts: ['Hello! My name is Tom. How are you?'],
    requirements: [
      {
        id: 'greeting',
        label: 'Saludas (Hello, Hi, Good morning…)',
        kind: 'pattern',
        patterns: [['hello|hi'], ['good', 'morning|afternoon|evening']],
      },
      {
        id: 'name',
        label: 'Dices tu nombre (My name is… / I am…)',
        kind: 'pattern',
        patterns: [
          ['my', 'name', 'is', '<WORD>'],
          ['i', 'am', '<WORD>'],
          ["i'm", '<WORD>'],
        ],
      },
      {
        id: 'state',
        label: 'Dices cómo estás (I am fine, I am good…)',
        kind: 'pattern',
        patterns: [
          ['fine|good'],
          ['i', 'am', 'fine|good|happy|tired'],
          ["i'm", 'fine|good|happy|tired'],
        ],
      },
      ...common(2),
    ],
    model: 'Hello, Tom! My name is Ana. I am fine, thank you.',
    checklist: ['Saludé.', 'Dije mi nombre.', 'Dije cómo estoy.'],
  },
  {
    ...base,
    id: 'en.a1.wt.my-age',
    kind: 'guided',
    codes: ['p08', 'g16', 'v03'],
    lesson: 'a1-u03-l04',
    title: 'Tu edad y tu país',
    instructions: 'Responde las dos preguntas con oraciones completas (puedes inventar los datos).',
    prompts: ['How old are you?', 'Where are you from?'],
    requirements: [
      {
        id: 'age',
        label: 'Dices tu edad con I am + número (sin have)',
        kind: 'pattern',
        patterns: [
          ['i', 'am', '<NUMBER>'],
          ["i'm", '<NUMBER>'],
        ],
      },
      {
        id: 'from',
        label: 'Dices de dónde eres con I am from…',
        kind: 'pattern',
        patterns: [
          ['i', 'am', 'from', '<WORD>'],
          ["i'm", 'from', '<WORD>'],
        ],
      },
      ...common(2),
    ],
    model: 'I am twenty years old. I am from Argentina.',
    checklist: ['Usé I am para la edad (no I have).', 'Dije el país con from.'],
  },
  {
    ...base,
    id: 'en.a1.wt.my-family',
    kind: 'guided',
    codes: ['p03', 'g09', 'v04'],
    lesson: 'a1-u04-l05',
    title: 'Tu familia',
    instructions:
      'Escribe sobre tu familia (real o inventada): cuántos hermanos o hermanas tienes y cómo se llama alguien de tu familia.',
    prompts: ['Do you have a brother?', 'Do you have a sister?', "What is your mother's name?"],
    requirements: [
      {
        id: 'have',
        label: 'Usas I have para decir qué familiares tienes',
        kind: 'pattern',
        patterns: [
          ['i', 'have', '<WORD>'],
          ['i', "don't", 'have'],
        ],
      },
      {
        id: 'family-word',
        label: 'Nombras a un familiar (mother, brother, sister…)',
        kind: 'pattern',
        patterns: [
          ['mother|father|brother|brothers|sister|sisters|grandmother|grandfather|parents|baby'],
        ],
      },
      {
        id: 'possessive',
        label: 'Dices un nombre con his, her o my (Her name is…)',
        kind: 'pattern',
        patterns: [['his|her|my|our|their', 'name', 'is']],
      },
      ...common(3),
    ],
    model: 'I have two sisters. My mother is a teacher. Her name is Rosa.',
    checklist: ['Usé have o has bien.', 'Usé his o her según la persona.'],
  },
  {
    ...base,
    id: 'en.a1.wt.my-routine',
    kind: 'guided',
    codes: ['p05', 'g12', 'g14'],
    lesson: 'a1-u08-l05',
    title: 'Tu rutina',
    instructions:
      'Cuenta tres cosas que haces todos los días (pueden ser inventadas). Usa always, usually o never al menos una vez.',
    prompts: ['What do you do every day?'],
    requirements: [
      {
        id: 'routine-verb',
        label: 'Usas un verbo de rutina (get up, work, study, read…)',
        kind: 'pattern',
        patterns: [
          ['i', '<WORD>'],
          ['i', 'always|usually|never', '<WORD>'],
        ],
      },
      {
        id: 'frequency',
        label: 'Usas always, usually o never antes del verbo',
        kind: 'pattern',
        patterns: [['i', 'always|usually|never', '<WORD>']],
      },
      ...common(3),
    ],
    model: 'I get up at seven. I always study in the morning. I never read in the evening.',
    checklist: ['Puse el adverbio antes del verbo (I always study).', 'Escribí tres oraciones.'],
  },
  {
    ...base,
    id: 'en.a1.wt.my-likes',
    kind: 'guided',
    codes: ['p06', 'g18', 'g22'],
    lesson: 'a1-u11-l05',
    title: 'Lo que te gusta',
    instructions:
      'Escribe qué te gusta y qué no (puede ser inventado). Usa like, love o hate, y une dos ideas con and o but.',
    prompts: ['What do you like?', 'What is your favorite sport?'],
    requirements: [
      {
        id: 'like',
        label: 'Usas like, love o hate',
        kind: 'pattern',
        patterns: [
          ['i', 'like|love|hate'],
          ['i', "don't", 'like'],
        ],
      },
      {
        id: 'connector',
        label: 'Unes dos ideas con and o but',
        kind: 'pattern',
        patterns: [['and|but']],
      },
      ...common(2),
    ],
    model: "I love music and I like football. I can swim, but I can't dance.",
    checklist: ['Usé like, love o hate.', 'Usé and o but.'],
  },
  {
    ...base,
    id: 'en.a1.wt.ask-and-answer',
    kind: 'guided',
    codes: ['p07', 'p08', 'g16'],
    lesson: 'a1-u12-l05',
    title: 'Preguntar y responder',
    instructions:
      'Escribe dos preguntas para conocer a alguien (nombre, edad, país…) y responde una con tus datos (puedes inventarlos).',
    prompts: [],
    requirements: [
      {
        id: 'wh-question',
        label: 'Escribes una pregunta con What, Where, How old…',
        kind: 'pattern',
        patterns: [
          ['what|where|when|who|which|how', '<WORD>'],
          ['how', 'old'],
        ],
      },
      {
        id: 'two-questions',
        label: 'Escribes dos preguntas (con signo de pregunta)',
        kind: 'min_sentences',
        min: 3,
      },
      {
        id: 'answer',
        label: 'Respondes con una oración tuya (I am…, My name is…)',
        kind: 'pattern',
        patterns: [
          ['i', 'am|have|live|like'],
          ["i'm", '<WORD>'],
          ['my', '<WORD>', 'is'],
        ],
      },
      { id: 'capital', label: 'Cada oración empieza con mayúscula', kind: 'capital_start' },
    ],
    model: 'What is your name? Where are you from? I am from Spain.',
    checklist: [
      'Mis preguntas terminan con «?».',
      'Puse el verbo antes del sujeto (Where are you…?).',
    ],
  },

  // ------------------------------------------------ Tareas de bloque (mapa §3)
  {
    ...base,
    id: 'en.a1.wt.block1-introduce',
    kind: 'free',
    codes: ['p02', 'p03'],
    block: 1,
    lesson: 'a1-u04-final',
    title: 'Bloque 1: preséntate y presenta a alguien',
    instructions:
      'Escribe 4 o 5 oraciones: quién eres (nombre, edad, país) y una persona de tu familia o un amigo. Puedes inventar los datos.',
    prompts: [
      'What is your name?',
      'How old are you?',
      'Where are you from?',
      'Who is your friend?',
    ],
    requirements: [
      {
        id: 'hint-name',
        label: 'Pista: ¿dijiste tu nombre?',
        kind: 'pattern',
        patterns: [
          ['my', 'name', 'is'],
          ['i', 'am', '<WORD>'],
        ],
        optional: true,
      },
      {
        id: 'hint-third',
        label: 'Pista: ¿hablaste de otra persona con he o she?',
        kind: 'pattern',
        patterns: [
          ['he|she', 'is|has'],
          ['his|her', 'name'],
        ],
        optional: true,
      },
      {
        id: 'sentences',
        label: 'Escribiste al menos 4 oraciones',
        kind: 'min_sentences',
        min: 4,
        optional: true,
      },
    ],
    model:
      'Hello! My name is Ana. I am twenty years old. I am from Argentina. Tom is my friend. He is from England and he is a student.',
    checklist: [
      'Dije mi nombre, mi edad y de dónde soy.',
      'Presenté a otra persona con he o she.',
      'Usé am, is y are bien.',
      'Mi texto se entiende si lo leo en voz alta.',
    ],
  },
  {
    ...base,
    id: 'en.a1.wt.block2-room-and-order',
    kind: 'free',
    codes: ['p04', 'p10'],
    block: 2,
    lesson: 'a1-u07-final',
    title: 'Bloque 2: tu habitación y un pedido',
    instructions:
      'Escribe 3 oraciones sobre tu habitación (qué hay y dónde está) y después un pedido breve en un café.',
    prompts: ['What is in your bedroom?', 'Where is your bed?'],
    requirements: [
      {
        id: 'hint-there',
        label: 'Pista: ¿usaste there is o there are?',
        kind: 'pattern',
        patterns: [['there', 'is|are']],
        optional: true,
      },
      {
        id: 'hint-place',
        label: 'Pista: ¿dijiste dónde está algo (in, on, under, next to)?',
        kind: 'pattern',
        patterns: [
          ['in|on|under', 'the|my'],
          ['next', 'to'],
        ],
        optional: true,
      },
      {
        id: 'hint-order',
        label: "Pista: ¿pediste con I'd like… please?",
        kind: 'pattern',
        patterns: [
          ["i'd", 'like'],
          ['i', 'would', 'like'],
        ],
        optional: true,
      },
    ],
    model:
      "There is a big bed in my bedroom. There are two chairs. My computer is on the table. I'd like a coffee and an apple, please.",
    checklist: [
      'Dije qué hay en la habitación.',
      'Dije dónde está una cosa.',
      'Mi pedido tiene please.',
    ],
  },
  {
    ...base,
    id: 'en.a1.wt.block3-week-and-note',
    kind: 'free',
    codes: ['p05', 'p09'],
    block: 3,
    lesson: 'a1-u09-final',
    title: 'Bloque 3: tu semana y una nota',
    instructions:
      'Cuenta en 3 oraciones qué haces en la semana (días y horas) y escribe una nota breve del tipo «Back at five».',
    prompts: ['What do you do on Monday?', 'What time do you get up?'],
    glossary: [{ term: 'Back at five.', meaning: 'Vuelvo a las cinco.' }],
    requirements: [
      {
        id: 'hint-day',
        label: 'Pista: ¿usaste on con un día (on Monday)?',
        kind: 'pattern',
        patterns: [['on', 'monday|tuesday|wednesday|thursday|friday|saturday|sunday']],
        optional: true,
      },
      {
        id: 'hint-time',
        label: 'Pista: ¿usaste at con una hora (at seven)?',
        kind: 'pattern',
        patterns: [['at', '<NUMBER>']],
        optional: true,
      },
      {
        id: 'hint-note',
        label: 'Pista: ¿tu nota dice cuándo vuelves (back at…)?',
        kind: 'pattern',
        patterns: [['back', 'at']],
        optional: true,
      },
    ],
    model:
      'I work from Monday to Friday. I get up at seven. On Saturday I play football. I am at school. Back at five.',
    checklist: [
      'Usé on con los días y at con la hora.',
      'Mi nota dice dónde estoy y cuándo vuelvo.',
    ],
  },
  {
    ...base,
    id: 'en.a1.wt.block4-post-and-postcard',
    kind: 'free',
    codes: ['p06', 'p07', 'p09'],
    block: 4,
    lesson: 'a1-u12-final',
    title: 'Bloque 4: una publicación y una postal',
    instructions:
      'Escribe una publicación breve sobre tus gustos con una pregunta para tus amigos, y una postal corta desde una ciudad.',
    prompts: ['What do you like?', 'What can you do?'],
    requirements: [
      {
        id: 'hint-like',
        label: 'Pista: ¿dijiste qué te gusta (I like, I love)?',
        kind: 'pattern',
        patterns: [['i', 'like|love']],
        optional: true,
      },
      {
        id: 'hint-question',
        label: 'Pista: ¿le hiciste una pregunta a tus amigos?',
        kind: 'pattern',
        patterns: [
          ['do', 'you'],
          ['what|which|who', '<WORD>'],
        ],
        optional: true,
      },
      {
        id: 'hint-postcard',
        label: 'Pista: ¿tu postal se despide (See you…, Love,…)?',
        kind: 'pattern',
        patterns: [['see', 'you'], ['love']],
        optional: true,
      },
    ],
    model:
      "I love music and I can sing. I like football, but I can't swim. What do you like? Hi Ana! I am in London. The city is very big. See you on Sunday!",
    checklist: [
      'Conté qué me gusta y qué sé hacer.',
      'Hice una pregunta con «?».',
      'Mi postal saluda y se despide.',
    ],
  },
];

export const writingTask = (id: string) => EN_A1_WRITING_TASKS.find((t) => t.id === id);

/**
 * Tareas que se ofrecen al terminar una lección: la guiada de esa lección y, en el repaso final de la
 * última unidad de un bloque (camino publicado), la tarea libre del bloque. Son práctica opcional: no
 * bloquean nada, no se guardan y no cuentan para el progreso.
 */
export const writingTasksForLesson = (lessonId: string) =>
  EN_A1_WRITING_TASKS.filter((t) => t.lesson === lessonId);

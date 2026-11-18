import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U9 «Educación y desarrollo personal» (docs/B2_EN.md): mirar atrás y lamentar con el tercer
 * condicional (If I had studied, I would have passed) y con wish / if only + past perfect; la forma de
 * pensar y la motivación (mindset, potential, struggle, make progress); estudiar con método
 * (procrastinate, self-discipline, keep track of, catch up); becas, abandonos y la zona de confort.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const REUNION = dialogue(
  'en.stim.b2-u9-reunion',
  'Dos excompañeros de colegio se encuentran veinte años después.',
  [
    ['Paul', 'Twenty years! Do you ever look back on our school days?'],
    [
      'Clara',
      'All the time. If I had listened to Mrs. Gray, I would have studied science. I loved it, but I was too lazy.',
    ],
    ['Paul', "You weren't lazy. You just had a lot going on at home."],
    ['Clara', 'Maybe. And you? You were always the best at math.'],
    [
      'Paul',
      "I dropped out of university in my second year. If I hadn't, I would have become an engineer.",
    ],
    ['Clara', 'Do you regret it?'],
    [
      'Paul',
      "Sometimes. If only I had asked for help when I was struggling. But if I hadn't left, I wouldn't have started my business. So I'm not sure.",
    ],
  ],
);

const MINDSET = reading(
  'en.stim.b2-u9-mindset',
  'post',
  'Un artículo de divulgación sobre la mentalidad de crecimiento.',
  [
    'Why do some students give up after one bad grade, while others work harder? According to many psychologists, the answer is their mindset.',
    'People with a "fixed mindset" believe that intelligence is something you are born with. When they struggle, they think: "I am just not good at this."',
    'People with a "growth mindset" believe that ability can be developed. For them, a mistake is not a failure but information: it shows what to practice next.',
    'The good news is that mindset can change. Teachers who praise effort instead of talent help students reach their potential, and students who see their progress stay motivated for longer.',
  ],
  { title: 'It is not about talent' },
);

const ADVISOR = dialogue(
  'en.stim.b2-u9-advisor',
  'Un estudiante habla con una tutora de la universidad.',
  [
    [
      'Ivan',
      "I'm thinking of dropping out. I've missed six weeks of classes because of my job, and I'll never catch up.",
    ],
    [
      'Ms. Ortiz',
      'Wait. Before you decide, have you heard about our scholarship for working students?',
    ],
    ['Ivan', 'No. What does it involve?'],
    [
      'Ms. Ortiz',
      "It pays your fees, so you could work fewer hours. You'd have time to catch up with the classes you've missed.",
    ],
    [
      'Ivan',
      "That would change everything. If I'd known about it earlier, I wouldn't have taken so many shifts.",
    ],
    [
      'Ms. Ortiz',
      'Well, you know now. Applications close on Friday. I can help you with the form.',
    ],
    ['Ivan', 'Thank you. I really thought I had no choice.'],
  ],
);

const PROCRASTINATE = reading(
  'en.stim.b2-u9-procrastinate',
  'post',
  'Una publicación de blog sobre dejar de postergar.',
  [
    'For years I was an expert at procrastinating. I cleaned my room, checked my phone, made coffee… anything except studying.',
    'What finally helped was not motivation. Motivation comes and goes. What I needed was self-discipline: a routine that works even on bad days.',
    'Now I study for twenty-five minutes, then take a five-minute break. I keep track of every session in a notebook, and seeing the list grow is surprisingly satisfying.',
    'If you have never tried it, give it a try. It feels strange at first, a bit outside your comfort zone, but after two weeks it becomes a habit.',
  ],
  { title: 'How I stopped putting things off' },
);

export const EN_B2_U09: B2UnitDef = {
  names: ['Paul', 'Clara', 'Gray', 'Ivan', 'Ortiz', 'Mrs', 'Ms'],
  support: [
    'become',
    'sometimes',
    'caught',
    'growth',
    'grade',
    'psychologists',
    'fixed',
    'developed',
    'failure',
    'praise',
    'effort',
    'talent',
    'motivated',
    'involve',
    'fees',
    'shifts',
    'applications',
    'expert',
    'except',
    'routine',
    'session',
    'notebook',
    'surprisingly',
    'satisfying',
    'putting',
  ],
  unit: {
    position: 9,
    title: 'Educación y desarrollo personal',
    titleEn: 'Education and personal growth',
    description:
      'Mirar atrás con el tercer condicional y if only, la forma de pensar y la motivación, estudiar con método y salir de la zona de confort.',
    emoji: '🎓',
    objective:
      'Podés hablar de tu educación, lamentar decisiones del pasado e imaginar otros resultados, y contar cómo aprendés mejor.',
    grammar: {
      title: 'Tercer condicional y wish / if only',
      explanation:
        'El tercer condicional imagina un pasado distinto: If + past perfect, would have + participio (If I had studied, I would have passed = si hubiera estudiado, habría aprobado). Negativo: If I hadn’t left, I wouldn’t have started my business. Para lamentar algo del pasado: I wish / If only + past perfect (If only I had asked for help = ojalá hubiera pedido ayuda).',
      examples: [
        {
          target: 'If I had listened to my teacher, I would have studied science.',
          base: 'Si le hubiera hecho caso a mi profesora, habría estudiado ciencias.',
        },
        {
          target: "If I hadn't left, I wouldn't have started my business.",
          base: 'Si no me hubiera ido, no habría empezado mi negocio.',
        },
        { target: 'If only I had asked for help.', base: 'Ojalá hubiera pedido ayuda.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-would-have',
        'would have',
        'habría / hubiera',
        '/ˈwʊd əv/',
        undefined,
        'If I had studied, I would have passed the exam.',
        'Si hubiera estudiado, habría aprobado el examen.',
        ['conditionals'],
        ['habría', 'hubiera'],
      ),
      w(
        'en-if-only',
        'if only',
        'ojalá / si tan sólo',
        '/ɪf ˈoʊnli/',
        '🙏',
        'If only I had asked for help.',
        'Ojalá hubiera pedido ayuda.',
        ['conditionals', 'regret'],
        ['ojalá', 'si tan sólo'],
      ),
      w(
        'en-look-back-on',
        'look back on',
        'recordar / mirar atrás (a una época)',
        '/ˈlʊk ˈbæk ɑn/',
        undefined,
        'I often look back on my school days.',
        'Muchas veces recuerdo mis años de colegio.',
        ['education', 'phrasal-verbs'],
        ['recordar', 'mirar atrás'],
      ),
      w(
        'en-drop-out',
        'drop out',
        'abandonar (los estudios)',
        '/ˈdrɑp ˈaʊt/',
        undefined,
        'He dropped out of university in his second year.',
        'Abandonó la universidad en segundo año.',
        ['education', 'phrasal-verbs'],
        ['dejar los estudios'],
      ),
      w(
        'en-struggle',
        'struggle',
        'tener dificultades / costar',
        '/ˈstrʌɡəl/',
        undefined,
        'I struggled with math at school.',
        'En el colegio me costaba matemática.',
        ['education', 'verbs'],
        ['tener dificultades', 'costar', 'luchar'],
      ),
      w(
        'en-mindset',
        'mindset',
        'mentalidad / forma de pensar',
        '/ˈmaɪndˌsɛt/',
        '🧠',
        'Your mindset is more important than your talent.',
        'Tu forma de pensar es más importante que tu talento.',
        ['education', 'personal-growth'],
        ['mentalidad', 'forma de pensar'],
      ),
      w(
        'en-potential',
        'potential',
        'potencial',
        '/pəˈtɛnʃəl/',
        '🌱',
        'Good teachers help students reach their potential.',
        'Los buenos profesores ayudan a los alumnos a desarrollar su potencial.',
        ['education', 'personal-growth'],
      ),
      w(
        'en-motivation',
        'motivation',
        'motivación',
        '/ˌmoʊtəˈveɪʃən/',
        '🔥',
        'Motivation comes and goes.',
        'La motivación va y viene.',
        ['education', 'personal-growth'],
      ),
      w(
        'en-make-progress',
        'make progress',
        'progresar / avanzar',
        '/ˈmeɪk ˈprɑɡrɛs/',
        '📈',
        'You are making great progress with your English.',
        'Estás progresando mucho con tu inglés.',
        ['education', 'collocations'],
        ['progresar', 'avanzar', 'hacer progresos'],
      ),
      w(
        'en-procrastinate',
        'procrastinate',
        'postergar / dejar para después',
        '/proʊˈkræstəˌneɪt/',
        '⏳',
        'Stop procrastinating and start your homework!',
        '¡Dejá de postergar y empezá la tarea!',
        ['education', 'verbs'],
        ['postergar', 'procrastinar', 'dejar para después'],
      ),
      w(
        'en-self-discipline',
        'self-discipline',
        'autodisciplina / constancia',
        '/ˌsɛlf ˈdɪsəplɪn/',
        undefined,
        'Learning a language takes self-discipline.',
        'Aprender un idioma requiere autodisciplina.',
        ['education', 'personal-growth'],
        ['autodisciplina', 'disciplina', 'constancia'],
        ['self discipline'],
      ),
      w(
        'en-keep-track-of',
        'keep track of',
        'llevar la cuenta de / registrar',
        '/ˈkip ˈtræk əv/',
        '📓',
        'I keep track of my study hours in a notebook.',
        'Llevo la cuenta de mis horas de estudio en un cuaderno.',
        ['education', 'collocations'],
        ['llevar la cuenta de', 'registrar', 'llevar un registro de'],
      ),
      w(
        'en-catch-up',
        'catch up',
        'ponerse al día',
        '/ˈkætʃ ˈʌp/',
        undefined,
        'I missed two classes, so I need to catch up.',
        'Falté a dos clases, así que tengo que ponerme al día.',
        ['education', 'phrasal-verbs'],
        ['ponerse al día', 'recuperar'],
      ),
      w(
        'en-scholarship',
        'scholarship',
        'beca',
        '/ˈskɑlərˌʃɪp/',
        '🎓',
        'She won a scholarship to study abroad.',
        'Ganó una beca para estudiar en el exterior.',
        ['education'],
      ),
      w(
        'en-enroll',
        'enroll',
        'inscribirse / anotarse',
        '/ɪnˈroʊl/',
        '📝',
        'I have enrolled in an evening course.',
        'Me anoté en un curso nocturno.',
        ['education', 'verbs'],
        ['inscribirse', 'anotarse', 'matricularse'],
        ['enrol'],
      ),
      w(
        'en-comfort-zone',
        'comfort zone',
        'zona de confort',
        '/ˈkʌmfərt ˌzoʊn/',
        '🛋️',
        'Speaking in public takes me out of my comfort zone.',
        'Hablar en público me saca de mi zona de confort.',
        ['personal-growth', 'collocations'],
      ),
      w(
        'en-give-it-a-try',
        'give it a try',
        'probar / intentarlo',
        '/ˈɡɪv ɪt ə ˈtraɪ/',
        '👍',
        "You've never tried yoga? Give it a try!",
        '¿Nunca probaste yoga? ¡Probalo!',
        ['personal-growth', 'collocations'],
        ['probar', 'intentarlo', 'hacer la prueba'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Si hubiera…',
        objective: 'Imaginar un pasado distinto con el tercer condicional.',
        intro: {
          explanation:
            'El tercer condicional habla de algo que no pasó y de su resultado imaginario: If + had + participio, would have + participio. If I had studied, I would have passed (si hubiera estudiado, habría aprobado; pero no estudié). En la conversación: If I’d studied, I’d have passed.',
          examples: [
            {
              target: 'If I had studied, I would have passed the exam.',
              base: 'Si hubiera estudiado, habría aprobado el examen.',
            },
            {
              target: "If I hadn't left, I wouldn't have started my business.",
              base: 'Si no me hubiera ido, no habría empezado mi negocio.',
            },
          ],
        },
        takeaways: [
          'Imaginás otro resultado para el pasado con if + had + participio.',
          'Usás would have / wouldn’t have + participio en la otra parte.',
        ],
        exercises: [
          ex.fillBlank(
            'If I had studied, I would have ___ the exam.',
            'Si hubiera estudiado, habría aprobado el examen.',
            'passed',
            ['pass', 'passing', 'to pass'],
            ['en-would-have'],
            { id: 'en.ex.iwtc9jj94nawgc', explanation: 'Would have + participio (passed).' },
          ),
          ex.fillBlank(
            'If I ___ listened to my teacher, I would have studied science.',
            'Si le hubiera hecho caso a mi profesora, habría estudiado ciencias.',
            'had',
            ['have', 'would', 'did'],
            ['en-would-have'],
            {
              id: 'en.ex.ijah2e7s9zwgam',
              explanation: 'Después de if va el past perfect (had + participio), no would.',
            },
          ),
          ex.fillBlank(
            "If I hadn't left, I ___ have started my business.",
            'Si no me hubiera ido, no habría empezado mi negocio.',
            "wouldn't",
            ["won't", "didn't", "hadn't"],
            ['en-would-have'],
            { id: 'en.ex.3m32r2kjqwm8lj' },
          ),
          question(
            'en.ex.1i9m6k2gcp2uo3',
            REUNION,
            '¿Qué habría estudiado Clara si le hubiera hecho caso a su profesora?',
            'Ciencias',
            ['Matemática', 'Ingeniería', 'Administración'],
            ['en-would-have', 'en-look-back-on'],
            'Clara dice: «If I had listened to Mrs. Gray, I would have studied science».',
          ),
          question(
            'en.ex.xkm8oxhkffiekw',
            REUNION,
            '¿Por qué Paul no está seguro de arrepentirse?',
            'Porque si no hubiera dejado la facultad, no habría empezado su negocio',
            [
              'Porque no le gustaba la ingeniería',
              'Porque nunca tuvo dificultades',
              'Porque Clara lo convenció',
            ],
            ['en-would-have', 'en-drop-out', 'en-if-only', 'en-struggle'],
            'Paul dice: «But if I hadn’t left, I wouldn’t have started my business. So I’m not sure».',
          ),
          ex.listenChoice(
            'If I had studied, I would have passed the exam.',
            [
              'If I study, I will pass the exam.',
              'If I had studied, I would pass the exam.',
              'If I had slept, I would have passed the exam.',
            ],
            ['en-would-have'],
            { id: 'en.ex.ft3o456siuvrfy' },
          ),
          ex.orderWords(
            'If we had left earlier we would have caught the train.',
            'Si hubiéramos salido antes, habríamos alcanzado el tren.',
            ['en-would-have'],
            { id: 'en.ex.0zg26b161t3r99' },
          ),
          ex.shortAnswer(
            'Why did you fail the test? (si hubieras estudiado, habrías aprobado)',
            '¿Por qué desaprobaste la prueba?',
            'If I had studied, I would have passed.',
            [
              "If I'd studied, I would have passed.",
              "If I had studied, I'd have passed.",
              'If I had studied more, I would have passed.',
            ],
            ['en-would-have'],
            { id: 'en.ex.a19c6gwvbc7p34' },
          ),
          ex.translateWrite(
            'Si hubiera estudiado, habría aprobado el examen.',
            'If I had studied, I would have passed the exam.',
            ['en-would-have'],
            {
              id: 'en.ex.1olz61ngz9gkjh',
              acceptedAnswers: [
                "If I'd studied, I would have passed the exam.",
                'If I had studied I would have passed the exam.',
                "If I had studied, I'd have passed the exam.",
                'I would have passed the exam if I had studied.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Ojalá hubiera…',
        objective: 'Lamentar el pasado con if only y wish, y recordar una época.',
        intro: {
          explanation:
            'Para lamentar algo del pasado: I wish / If only + past perfect. If only I had asked for help (ojalá hubiera pedido ayuda). I wish I hadn’t said that (ojalá no hubiera dicho eso). Look back on es recordar una época de tu vida. Struggle es tener dificultades con algo.',
          examples: [
            { target: 'If only I had asked for help.', base: 'Ojalá hubiera pedido ayuda.' },
            {
              target: 'I often look back on my school days.',
              base: 'Muchas veces recuerdo mis años de colegio.',
            },
          ],
        },
        takeaways: [
          'Lamentás el pasado con if only / I wish + past perfect.',
          'Recordás una época con look back on y contás qué te costaba.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['if only', 'ojalá / si tan sólo'],
              ['look back on', 'recordar / mirar atrás (a una época)'],
              ['struggle', 'tener dificultades / costar'],
              ['drop out', 'abandonar (los estudios)'],
            ],
            ['en-if-only', 'en-look-back-on', 'en-struggle', 'en-drop-out'],
            { id: 'en.ex.wvzvb7dksox18t' },
          ),
          ex.fillBlank(
            'If only I ___ asked for help.',
            'Ojalá hubiera pedido ayuda.',
            'had',
            ['have', 'would', 'did'],
            ['en-if-only'],
            {
              id: 'en.ex.9z9ihm0oujswd7',
              explanation: 'If only / I wish + past perfect: lamentar el pasado.',
            },
          ),
          ex.fillBlank(
            'I wish I ___ said that to her.',
            'Ojalá no le hubiera dicho eso.',
            "hadn't",
            ["didn't", "wouldn't", "haven't"],
            ['en-if-only'],
            { id: 'en.ex.v79xnfmmdw56rx' },
          ),
          ex.fillBlank(
            'I struggled ___ math at school.',
            'En el colegio me costaba matemática.',
            'with',
            ['on', 'for', 'at'],
            ['en-struggle'],
            { id: 'en.ex.3jkvtn9kkw559m', skill: 'vocabulary' },
          ),
          question(
            'en.ex.4ltaygo49iuzcp',
            REUNION,
            '¿Qué lamenta Paul?',
            'No haber pedido ayuda cuando tenía dificultades',
            [
              'Haber estudiado ingeniería',
              'Haber empezado un negocio',
              'No haber ido a la reunión',
            ],
            ['en-if-only', 'en-struggle'],
            'Paul dice: «If only I had asked for help when I was struggling».',
          ),
          question(
            'en.ex.f1se4ssw9dtqea',
            REUNION,
            '¿Qué le pasó a Paul en la universidad?',
            'La dejó en segundo año',
            ['Se recibió de ingeniero', 'Cambió de carrera', 'Nunca empezó'],
            ['en-drop-out'],
            'Paul dice: «I dropped out of university in my second year».',
          ),
          ex.listenChoice(
            'I often look back on my school days.',
            [
              'I never look back on my school days.',
              'I often look back on my university days.',
              'I often think about my school friends.',
            ],
            ['en-look-back-on'],
            { id: 'en.ex.ttapm41mppx0x3' },
          ),
          ex.orderWords(
            'He dropped out of university in his second year.',
            'Abandonó la universidad en segundo año.',
            ['en-drop-out'],
            { id: 'en.ex.048f6pfoj77c56' },
          ),
          ex.shortAnswer(
            'Do you regret anything from school? (ojalá hubieras estudiado más)',
            '¿Te arrepentís de algo del colegio?',
            'I wish I had studied more.',
            [
              "I wish I'd studied more.",
              'If only I had studied more.',
              "If only I'd studied more.",
            ],
            ['en-if-only'],
            { id: 'en.ex.0ntsbsf1xboy8o' },
          ),
          ex.translateWrite(
            'Ojalá hubiera pedido ayuda.',
            'If only I had asked for help.',
            ['en-if-only'],
            {
              id: 'en.ex.wrdmxca64werzq',
              acceptedAnswers: [
                "If only I'd asked for help.",
                'I wish I had asked for help.',
                "I wish I'd asked for help.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'La forma de pensar',
        objective: 'Hablar de la mentalidad, la motivación y el progreso.',
        intro: {
          explanation:
            'Your mindset es tu forma de pensar. Potential es tu potencial: reach your potential (desarrollarlo al máximo). Motivation es la motivación. Make progress es progresar (progress es incontable: no se dice «a progress»).',
          examples: [
            {
              target: 'Your mindset is more important than your talent.',
              base: 'Tu forma de pensar es más importante que tu talento.',
            },
            {
              target: 'You are making great progress with your English.',
              base: 'Estás progresando mucho con tu inglés.',
            },
          ],
        },
        takeaways: [
          'Hablás de la mentalidad y la motivación.',
          'Contás tu progreso con make progress.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['mindset', 'mentalidad / forma de pensar'],
              ['potential', 'potencial'],
              ['motivation', 'motivación'],
              ['make progress', 'progresar / avanzar'],
            ],
            ['en-mindset', 'en-potential', 'en-motivation', 'en-make-progress'],
            { id: 'en.ex.8s5mhfhyxe2hjj' },
          ),
          ex.fillBlank(
            'You are ___ great progress with your English.',
            'Estás progresando mucho con tu inglés.',
            'making',
            ['doing', 'having', 'taking'],
            ['en-make-progress'],
            {
              id: 'en.ex.m4loagl9n8q75q',
              skill: 'vocabulary',
              explanation: 'Collocation: make progress (no «do progress»).',
            },
          ),
          ex.fillBlank(
            'Good teachers help students reach their ___.',
            'Los buenos profesores ayudan a los alumnos a desarrollar su potencial.',
            'potential',
            ['mindset', 'motivation', 'talent'],
            ['en-potential'],
            { id: 'en.ex.7iqoyjyn2jgu56', skill: 'vocabulary' },
          ),
          question(
            'en.ex.d52rbxr129e6a6',
            MINDSET,
            '¿Qué piensan las personas con «mentalidad fija» cuando algo les cuesta?',
            'Que simplemente no son buenas para eso',
            [
              'Que tienen que practicar más',
              'Que el profesor es malo',
              'Que es cuestión de tiempo',
            ],
            ['en-mindset', 'en-struggle'],
            'El artículo dice: «When they struggle, they think: "I am just not good at this."».',
          ),
          question(
            'en.ex.5m3esp9mzaymdd',
            MINDSET,
            'Para quien tiene «mentalidad de crecimiento», ¿qué es un error?',
            'Información que muestra qué practicar después',
            ['Un fracaso', 'Una razón para abandonar', 'Algo que hay que ocultar'],
            ['en-mindset', 'en-potential'],
            'El artículo dice: «a mistake is not a failure but information: it shows what to practice next».',
          ),
          question(
            'en.ex.4k1jz7s19370yj',
            MINDSET,
            '¿Qué ayuda a que los alumnos sigan motivados más tiempo?',
            'Ver su propio progreso',
            ['Sacar buenas notas', 'Tener talento', 'Estudiar solos'],
            ['en-motivation', 'en-make-progress'],
            'El artículo dice: «students who see their progress stay motivated for longer».',
          ),
          ex.listenChoice(
            'Motivation comes and goes.',
            [
              'Motivation comes and stays.',
              'Motivation goes and comes back.',
              'Money comes and goes.',
            ],
            ['en-motivation'],
            { id: 'en.ex.tg4xktfi0bcpas' },
          ),
          ex.orderWords(
            'Your mindset is more important than your talent.',
            'Tu forma de pensar es más importante que tu talento.',
            ['en-mindset'],
            { id: 'en.ex.xtrxo3x6vdsyyc' },
          ),
          ex.shortAnswer(
            'How is your English going? (estás progresando mucho)',
            '¿Cómo va tu inglés?',
            'I am making great progress.',
            [
              "I'm making great progress.",
              "I'm making a lot of progress.",
              'I am making good progress.',
            ],
            ['en-make-progress'],
            { id: 'en.ex.cnma72o90dhxni' },
          ),
          ex.translateWrite(
            'La motivación va y viene.',
            'Motivation comes and goes.',
            ['en-motivation'],
            { id: 'en.ex.8u6rz1j9y3b8p9', acceptedAnswers: ['Motivation comes and goes!'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Estudiar con método',
        objective: 'Contar cómo organizás el estudio y cómo dejar de postergar.',
        intro: {
          explanation:
            'Procrastinate es postergar, dejar todo para después. Self-discipline es la autodisciplina, la constancia. Keep track of es llevar la cuenta o el registro de algo. Catch up es ponerse al día: I need to catch up with the classes I missed.',
          examples: [
            {
              target: 'Learning a language takes self-discipline.',
              base: 'Aprender un idioma requiere autodisciplina.',
            },
            {
              target: 'I missed two classes, so I need to catch up.',
              base: 'Falté a dos clases, así que tengo que ponerme al día.',
            },
          ],
        },
        takeaways: [
          'Contás cómo organizás tu estudio y llevás la cuenta.',
          'Hablás de postergar, de la constancia y de ponerte al día.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['procrastinate', 'postergar / dejar para después'],
              ['self-discipline', 'autodisciplina / constancia'],
              ['keep track of', 'llevar la cuenta de / registrar'],
              ['catch up', 'ponerse al día'],
            ],
            ['en-procrastinate', 'en-self-discipline', 'en-keep-track-of', 'en-catch-up'],
            { id: 'en.ex.ug1zdxzt47r5tn' },
          ),
          ex.fillBlank(
            'I keep ___ of my study hours in a notebook.',
            'Llevo la cuenta de mis horas de estudio en un cuaderno.',
            'track',
            ['list', 'time', 'care'],
            ['en-keep-track-of'],
            { id: 'en.ex.xyf61crivdaem7', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I missed two classes, so I need to catch ___.',
            'Falté a dos clases, así que tengo que ponerme al día.',
            'up',
            ['on', 'out', 'off'],
            ['en-catch-up'],
            { id: 'en.ex.d3ggsc6b9awt0n', skill: 'vocabulary' },
          ),
          question(
            'en.ex.xgao3t5vicx9rk',
            PROCRASTINATE,
            'Según el autor, ¿qué lo ayudó a dejar de postergar?',
            'La autodisciplina: una rutina que funciona aun en los días malos',
            ['La motivación', 'Un profesor particular', 'Apagar el teléfono'],
            ['en-self-discipline', 'en-procrastinate', 'en-motivation'],
            'Escribe: «What finally helped was not motivation… What I needed was self-discipline: a routine that works even on bad days».',
          ),
          question(
            'en.ex.8njsly7nrkllx0',
            PROCRASTINATE,
            '¿Qué hace con cada sesión de estudio?',
            'La anota en un cuaderno y le gusta ver crecer la lista',
            ['La graba en video', 'La comparte en las redes', 'Se la muestra a un amigo'],
            ['en-keep-track-of', 'en-comfort-zone'],
            'Escribe: «I keep track of every session in a notebook, and seeing the list grow is surprisingly satisfying».',
          ),
          question(
            'en.ex.m4vggpd4452dmx',
            ADVISOR,
            '¿Por qué Ivan piensa en dejar la facultad?',
            'Faltó seis semanas por el trabajo y cree que no se va a poder poner al día',
            ['No le gusta su carrera', 'Le ofrecieron un trabajo mejor', 'Desaprobó un examen'],
            ['en-catch-up', 'en-drop-out', 'en-scholarship'],
            'Ivan dice: «I’ve missed six weeks of classes because of my job, and I’ll never catch up».',
          ),
          ex.listenChoice(
            'Learning a language takes self-discipline.',
            [
              'Learning a language takes a lot of time.',
              'Learning a language takes motivation.',
              'Teaching a language takes self-discipline.',
            ],
            ['en-self-discipline'],
            { id: 'en.ex.ccnzyo883im8ox' },
          ),
          ex.orderWords(
            'Stop procrastinating and start your homework.',
            'Dejá de postergar y empezá la tarea.',
            ['en-procrastinate'],
            { id: 'en.ex.atl8pvfkwfbrjo' },
          ),
          ex.shortAnswer(
            'Why are you studying on a Saturday? (faltaste a clases y tenés que ponerte al día)',
            '¿Por qué estás estudiando un sábado?',
            'I missed some classes, so I need to catch up.',
            [
              'I missed some classes and I need to catch up.',
              'Because I missed some classes and I need to catch up.',
              'I need to catch up.',
            ],
            ['en-catch-up'],
            { id: 'en.ex.t4s19mcdjuzmbo' },
          ),
          ex.translateWrite(
            'Aprender un idioma requiere autodisciplina.',
            'Learning a language takes self-discipline.',
            ['en-self-discipline'],
            {
              id: 'en.ex.htsv5w7v2xxh2f',
              acceptedAnswers: [
                'Learning a language requires self-discipline.',
                'Learning a language needs self-discipline.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Salir de la zona de confort',
        objective: 'Hablar de becas, inscripciones y de animarte a probar algo nuevo.',
        intro: {
          explanation:
            'A scholarship es una beca. Enroll (in a course) es inscribirse. Your comfort zone es tu zona de confort, y step out of it, salir de ella. Give it a try es probarlo, animarse. Con el tercer condicional contás lo que habría pasado: If I’d known, I wouldn’t have…',
          examples: [
            {
              target: 'She won a scholarship to study abroad.',
              base: 'Ganó una beca para estudiar en el exterior.',
            },
            {
              target: "You've never tried yoga? Give it a try!",
              base: '¿Nunca probaste yoga? ¡Probalo!',
            },
          ],
        },
        takeaways: [
          'Hablás de becas e inscripciones.',
          'Animás a alguien a probar algo fuera de su zona de confort.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['scholarship', 'beca'],
              ['enroll', 'inscribirse / anotarse'],
              ['comfort zone', 'zona de confort'],
              ['give it a try', 'probar / intentarlo'],
            ],
            ['en-scholarship', 'en-enroll', 'en-comfort-zone', 'en-give-it-a-try'],
            { id: 'en.ex.ee06o08zregmxa' },
          ),
          ex.fillBlank(
            'Speaking in public takes me out of my comfort ___.',
            'Hablar en público me saca de mi zona de confort.',
            'zone',
            ['place', 'area', 'side'],
            ['en-comfort-zone'],
            { id: 'en.ex.c1qe1d9pwkh03z', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "You've never tried yoga? Give it a ___!",
            '¿Nunca probaste yoga? ¡Probalo!',
            'try',
            ['test', 'go', 'look'],
            ['en-give-it-a-try'],
            { id: 'en.ex.4q8hjb9hdmsd3l', skill: 'vocabulary' },
          ),
          question(
            'en.ex.f5wdobx7tkc0cl',
            ADVISOR,
            '¿Qué le ofrece la tutora a Ivan?',
            'Una beca para estudiantes que trabajan, que le paga la cuota',
            ['Un trabajo en la universidad', 'Más tiempo para el examen', 'Cambiarlo de carrera'],
            ['en-scholarship'],
            'La tutora pregunta por «our scholarship for working students» y explica: «It pays your fees, so you could work fewer hours».',
          ),
          question(
            'en.ex.e4sceh42fq3yss',
            ADVISOR,
            '¿Qué habría hecho distinto Ivan si hubiera sabido antes de la beca?',
            'No habría tomado tantos turnos de trabajo',
            [
              'No se habría inscripto',
              'Habría cambiado de trabajo',
              'Habría dejado antes la facultad',
            ],
            ['en-would-have'],
            'Ivan dice: «If I’d known about it earlier, I wouldn’t have taken so many shifts».',
          ),
          question(
            'en.ex.k4f4uqhp4fsqsv',
            PROCRASTINATE,
            '¿Qué le recomienda el autor a quien nunca probó su método?',
            'Que lo pruebe, aunque al principio se sienta raro',
            ['Que no lo intente', 'Que pida ayuda a un experto', 'Que estudie más horas seguidas'],
            ['en-give-it-a-try', 'en-comfort-zone'],
            'Escribe: «If you have never tried it, give it a try. It feels strange at first, a bit outside your comfort zone».',
          ),
          ex.listenChoice(
            'She won a scholarship to study abroad.',
            [
              'She won a prize to study abroad.',
              'She won a scholarship to work abroad.',
              'He won a scholarship to study abroad.',
            ],
            ['en-scholarship'],
            { id: 'en.ex.loroydgpiwf7a9' },
          ),
          ex.orderWords(
            'I have enrolled in an evening course.',
            'Me anoté en un curso nocturno.',
            ['en-enroll'],
            { id: 'en.ex.5tw32md2yv3our' },
          ),
          ex.shortAnswer(
            "I'm scared of singing in public. (animalo: que lo pruebe)",
            'Me da miedo cantar en público.',
            'Give it a try!',
            ['Just give it a try!', 'You should give it a try.', 'Give it a try.'],
            ['en-give-it-a-try'],
            { id: 'en.ex.1mdpwfqxxsdxoh' },
          ),
          ex.translateWrite(
            'Ganó una beca para estudiar en el exterior.',
            'She won a scholarship to study abroad.',
            ['en-scholarship'],
            {
              id: 'en.ex.wamp5bofxm3cum',
              acceptedAnswers: [
                'He won a scholarship to study abroad.',
                'She got a scholarship to study abroad.',
                'He got a scholarship to study abroad.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

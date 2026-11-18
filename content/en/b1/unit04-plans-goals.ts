import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U4 «Planes y objetivos» (docs/B1_EN.md): formas de futuro (going to para intenciones, el present
 * continuous para lo ya arreglado, will para decisiones y predicciones, might para lo posible);
 * oraciones temporales (when, as soon as, until + presente); metas y proyectos personales.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const WEEKEND = dialogue('en.stim.b1-u4-weekend', 'Sam y Lucy arman el fin de semana.', [
  ['Sam', 'Are you doing anything on Saturday?'],
  ['Lucy', "I'm meeting my sister for lunch. Why?"],
  ['Sam', "There's a concert in the park. I'm going in the evening."],
  ['Lucy', "Sounds great. I'll come with you after lunch!"],
]);

const GOALS = reading(
  'en.stim.b1-u4-goals',
  'post',
  'Ana comparte sus objetivos para el año que viene.',
  [
    'My goals for next year:',
    'I am going to save money for a trip to Japan.',
    'I want to apply for an English course in London.',
    'I will probably change jobs, but I am not sure yet.',
    'I might also take up running. One step at a time!',
  ],
  { from: 'Ana', title: 'Next year' },
);

const CAFE = dialogue('en.stim.b1-u4-cafe', 'Pedro le cuenta a Mia su proyecto.', [
  ['Mia', 'What are your plans for the future?'],
  ['Pedro', "I'm going to set up my own business. A small cafe near the university."],
  ['Mia', 'Wow! When are you going to open it?'],
  ['Pedro', "As soon as I have enough money. I've been saving for two years."],
  ['Mia', "I'm sure you'll achieve it."],
]);

const COURSE_EMAIL = reading(
  'en.stim.b1-u4-course',
  'email',
  'Kate escribe a una escuela de idiomas.',
  [
    'Dear Sir or Madam,',
    'I would like to apply for the summer English course.',
    'I am a nurse, and my goal is to work abroad in the future.',
    'I am free from July until September.',
    'I look forward to hearing from you.',
    'Best wishes, Kate Brown',
  ],
  { from: 'Kate Brown', title: 'Summer course' },
);

export const EN_B1_U04: B1UnitDef = {
  names: ['Sam', 'Lucy', 'Ana', 'Japan', 'London', 'Pedro', 'Mia', 'Kate', 'Brown'],
  support: [
    'sounds',
    'change',
    'university',
    'own',
    'wow',
    'enough',
    'sir',
    'madam',
    'arranged',
    'worry',
    'uncle',
    'cafe',
  ],
  unit: {
    position: 4,
    title: 'Planes y objetivos',
    titleEn: 'Plans and goals',
    description:
      'Hablar del futuro: lo que vas a hacer, lo que ya arreglaste, lo que decidís en el momento y lo que puede pasar; metas y proyectos.',
    emoji: '🎯',
    objective:
      'Podés contar tus planes y objetivos, decir qué ya arreglaste y qué podría pasar, y hablar de proyectos a largo plazo.',
    grammar: {
      title: 'Formas de futuro',
      explanation:
        'Going to: una intención (I am going to save money). Present continuous: algo ya arreglado, con día y hora (I am meeting Ana on Friday). Will: una decisión en el momento o una predicción (I will help you). Might: algo posible (I might go).',
      examples: [
        {
          target: "I'm meeting my sister on Saturday.",
          base: 'El sábado me encuentro con mi hermana.',
        },
        { target: "It's cold. I'll close the window.", base: 'Hace frío. Cierro la ventana.' },
        { target: 'I might go to the concert.', base: 'Puede que vaya al recital.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-might',
        'might',
        'puede que / podría',
        '/maɪt/',
        undefined,
        'It might rain tomorrow.',
        'Puede que llueva mañana.',
        ['future', 'modals'],
        ['puede que', 'podría'],
      ),
      w(
        'en-goal',
        'goal',
        'objetivo / meta',
        '/ɡoʊl/',
        '🎯',
        'My goal is to speak English well.',
        'Mi objetivo es hablar bien inglés.',
        ['plans'],
        ['objetivo', 'meta'],
      ),
      w(
        'en-achieve',
        'achieve',
        'lograr / alcanzar',
        '/əˈtʃiv/',
        undefined,
        'You can achieve your goals.',
        'Podés lograr tus objetivos.',
        ['plans', 'verbs'],
        ['lograr', 'alcanzar', 'conseguir'],
      ),
      w(
        'en-save',
        'save',
        'ahorrar / guardar',
        '/seɪv/',
        '🐷',
        'I am saving money for a car.',
        'Estoy ahorrando para un auto.',
        ['plans', 'money'],
        ['ahorrar', 'guardar'],
      ),
      w(
        'en-apply-for',
        'apply for',
        'postularse a / solicitar',
        '/əˈplaɪ fɔr/',
        undefined,
        'She applied for a new job.',
        'Se postuló a un trabajo nuevo.',
        ['plans', 'work'],
        ['postularse a', 'solicitar', 'postularse para'],
      ),
      w(
        'en-course',
        'course',
        'curso',
        '/kɔrs/',
        '📚',
        'I am taking a cooking course.',
        'Estoy haciendo un curso de cocina.',
        ['plans', 'studies'],
      ),
      w(
        'en-appointment',
        'appointment',
        'turno / cita',
        '/əˈpɔɪntmənt/',
        '📅',
        'I have a doctor’s appointment on Monday.',
        'Tengo turno con el médico el lunes.',
        ['plans'],
        ['turno', 'cita'],
      ),
      w(
        'en-look-forward-to',
        'look forward to',
        'tener ganas de / esperar con ganas',
        '/lʊk ˈfɔrwərd tu/',
        undefined,
        'I look forward to seeing you.',
        'Tengo ganas de verte.',
        ['plans', 'phrasal-verbs'],
        ['tener ganas de', 'esperar con ganas'],
      ),
      w(
        'en-in-the-future',
        'in the future',
        'en el futuro',
        '/ɪn ðə ˈfjutʃər/',
        '🔮',
        'I want to live abroad in the future.',
        'Quiero vivir en el exterior en el futuro.',
        ['plans', 'time'],
      ),
      w(
        'en-someday',
        'someday',
        'algún día',
        '/ˈsʌmdeɪ/',
        undefined,
        'Someday I will visit Japan.',
        'Algún día voy a visitar Japón.',
        ['plans', 'time'],
      ),
      w(
        'en-definitely',
        'definitely',
        'seguro / sin duda',
        '/ˈdɛfənətli/',
        undefined,
        'I will definitely call you.',
        'Te llamo seguro.',
        ['plans'],
        ['sin duda', 'definitivamente'],
      ),
      w(
        'en-business',
        'business',
        'negocio',
        '/ˈbɪznəs/',
        '💼',
        'My uncle has a small business.',
        'Mi tío tiene un negocio chico.',
        ['plans', 'work'],
        ['empresa propia'],
      ),
      w(
        'en-set-up',
        'set up',
        'montar / poner (un negocio)',
        '/ˈsɛt ˈʌp/',
        undefined,
        'They set up a business last year.',
        'Montaron un negocio el año pasado.',
        ['plans', 'phrasal-verbs'],
        ['montar', 'poner', 'armar'],
      ),
      w(
        'en-retire',
        'retire',
        'jubilarse',
        '/rɪˈtaɪər/',
        '🏖️',
        'My mother wants to retire soon.',
        'Mi madre quiere jubilarse pronto.',
        ['plans', 'work'],
      ),
      w(
        'en-step',
        'step',
        'paso',
        '/stɛp/',
        '👣',
        'This is the first step.',
        'Este es el primer paso.',
        ['plans'],
      ),
      w(
        'en-get-married',
        'get married',
        'casarse',
        '/ˈɡɛt ˈmærid/',
        '💍',
        'They are getting married in June.',
        'Se casan en junio.',
        ['plans', 'life'],
      ),
      w(
        'en-until',
        'until',
        'hasta (que)',
        '/ənˈtɪl/',
        undefined,
        'I will wait until you arrive.',
        'Voy a esperar hasta que llegues.',
        ['time', 'connectors'],
        ['hasta', 'hasta que'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Lo que ya arreglaste',
        objective: 'Hablar de intenciones (going to) y de planes arreglados (present continuous).',
        intro: {
          explanation:
            'Going to cuenta una intención: I am going to study more. El present continuous cuenta algo ya arreglado, casi siempre con día u hora: I am meeting my sister on Saturday. Appointment es un turno (con el médico, el dentista…).',
          examples: [
            {
              target: "I'm meeting my sister on Saturday.",
              base: 'El sábado me encuentro con mi hermana.',
            },
            {
              target: 'I have a doctor’s appointment at ten.',
              base: 'Tengo turno con el médico a las diez.',
            },
          ],
        },
        takeaways: [
          'Contás lo que ya arreglaste: I am meeting…, I have an appointment.',
          'Contás intenciones con going to.',
        ],
        exercises: [
          ex.fillBlank(
            "I ___ my sister for lunch on Saturday. It's all arranged.",
            'El sábado almuerzo con mi hermana. Ya está arreglado.',
            'am meeting',
            ['meet', 'met', 'have met'],
            ['en-meet', 'en-saturday'],
            {
              id: 'en.ex.wdg980a4vr07q9',
              explanation: 'Un plan ya arreglado, con día: present continuous.',
            },
          ),
          ex.fillBlank(
            'I have a doctor’s ___ at ten tomorrow.',
            'Mañana tengo turno con el médico a las diez.',
            'appointment',
            ['course', 'prize', 'memory'],
            ['en-appointment', 'en-doctor'],
            { id: 'en.ex.sx4wvvidyps1zi', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Next year I am ___ to study more.',
            'El año que viene voy a estudiar más.',
            'going',
            ['go', 'will', 'want'],
            ['en-going-to', 'en-next-year'],
            { id: 'en.ex.1bvghql0vva1oa' },
          ),
          question(
            'en.ex.62gdtied6yq2st',
            WEEKEND,
            '¿Qué arregló Lucy para el sábado?',
            'Almorzar con su hermana',
            ['Ir a un recital', 'Ir al médico', 'Trabajar'],
            ['en-meet', 'en-lunch'],
            "Lucy dice: «I'm meeting my sister for lunch».",
          ),
          question(
            'en.ex.b3qxvyohi1rlpd',
            WEEKEND,
            '¿Qué decide Lucy al final?',
            'Ir al recital con Sam después del almuerzo',
            ['Quedarse en casa', 'Ir sola al parque', 'Cancelar el almuerzo'],
            ['en-will', 'en-concert'],
            "Lucy dice: «I'll come with you after lunch!».",
          ),
          ex.listenChoice(
            'Are you doing anything on Saturday?',
            [
              'Are you doing anything on Sunday?',
              'Did you do anything on Saturday?',
              'Are you doing anything tonight?',
            ],
            ['en-saturday', 'en-do'],
            { id: 'en.ex.hkvfkz2xbz8n3m' },
          ),
          ex.orderWords(
            'We are traveling to Spain next Friday.',
            'El viernes que viene viajamos a España.',
            ['en-spain', 'en-friday'],
            { id: 'en.ex.f98g8vo1r3u7u6' },
          ),
          ex.shortAnswer(
            'Are you doing anything tomorrow? (sí, me encuentro con Ana)',
            '¿Tenés algo mañana?',
            "Yes, I'm meeting Ana.",
            [
              'Yes, I am meeting Ana.',
              "Yes, I'm meeting Ana tomorrow.",
              'Yes, I am going to meet Ana.',
            ],
            ['en-meet', 'en-tomorrow'],
            { id: 'en.ex.gkalzxecs3k5dv' },
          ),
          ex.translateWrite(
            'Tengo turno con el médico el lunes.',
            'I have a doctor’s appointment on Monday.',
            ['en-appointment', 'en-monday'],
            {
              id: 'en.ex.oispflldvk78e5',
              acceptedAnswers: [
                "I have a doctor's appointment on Monday.",
                'I have an appointment with the doctor on Monday.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Seguro, quizás',
        objective: 'Decidir en el momento con will y hablar de lo posible con might.',
        intro: {
          explanation:
            "Will sirve para una decisión que tomás en el momento (I'll call you) y para predicciones (It will be fine). Might dice que algo es posible, pero no seguro: I might go. Definitely (seguro) y probably (probablemente) dicen qué tan seguro estás.",
          examples: [
            { target: 'I might go to the concert.', base: 'Puede que vaya al recital.' },
            { target: "I'll definitely call you tonight.", base: 'Te llamo seguro esta noche.' },
          ],
        },
        takeaways: [
          'Decidís en el momento con will.',
          'Decís qué es posible (might) y qué es seguro (definitely).',
        ],
        exercises: [
          ex.translationChoice(
            'might',
            'puede que / podría',
            ['tiene que', 'debería', 'va a'],
            ['en-might'],
            { id: 'en.ex.j0m27tefppktuk' },
          ),
          ex.fillBlank(
            'Take an umbrella. It ___ rain later.',
            'Llevá un paraguas. Puede que llueva más tarde.',
            'might',
            ['must', 'is', 'did'],
            ['en-might', 'en-umbrella'],
            {
              id: 'en.ex.ed8fy4qwge8j1u',
              explanation: 'Might + verbo: algo posible, no seguro.',
            },
          ),
          ex.fillBlank(
            'The phone is ringing. I ___ answer it.',
            'Suena el teléfono. Yo atiendo.',
            'will',
            ['am', 'did', 'was'],
            ['en-will', 'en-answer'],
            {
              id: 'en.ex.7ew47mipqxnsvq',
              explanation: "Una decisión en el momento: will (I'll).",
            },
          ),
          ex.fillBlank(
            "Don't worry. I will ___ call you.",
            'No te preocupes. Te llamo seguro.',
            'definitely',
            ['ago', 'yesterday', 'last night'],
            ['en-definitely', 'en-call'],
            { id: 'en.ex.evpbq8vqp6ql4s', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "I'm not sure yet. I ___ go to the party.",
            'Todavía no estoy seguro. Puede que vaya a la fiesta.',
            'might',
            ['must', 'have to', 'am'],
            ['en-might', 'en-party'],
            {
              id: 'en.ex.y9ubw3804e20xt',
              explanation: 'Si no estás seguro, might: algo posible.',
            },
          ),
          ex.listenChoice(
            'It might rain tomorrow.',
            ['It will rain tomorrow.', 'It might rain today.', 'It might snow tomorrow.'],
            ['en-might', 'en-rain'],
            { id: 'en.ex.lzgcmbpkojjkvm' },
          ),
          ex.orderWords(
            'I might stay at home tonight.',
            'Puede que me quede en casa esta noche.',
            ['en-might', 'en-stay', 'en-tonight'],
            { id: 'en.ex.8kitgj8bfcna8f' },
          ),
          ex.shortAnswer(
            'Are you going to the party? (quizás)',
            '¿Vas a ir a la fiesta?',
            'I might go.',
            ['I might.', 'Maybe.', 'I might go to the party.', 'Maybe I will go.'],
            ['en-might', 'en-party'],
            { id: 'en.ex.1ewuyk9lu2adzv' },
          ),
          ex.translateWrite(
            'Puede que llueva mañana.',
            'It might rain tomorrow.',
            ['en-might', 'en-rain', 'en-tomorrow'],
            {
              id: 'en.ex.cctquk1jway3i0',
              acceptedAnswers: ['Tomorrow it might rain.', 'It may rain tomorrow.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Metas',
        objective: 'Contar tus metas y cómo pensás lograrlas.',
        intro: {
          explanation:
            'Para hablar de metas: My goal is to… (mi objetivo es…), achieve (lograr), the first step (el primer paso). Look forward to va con -ing o con un sustantivo: I look forward to seeing you.',
          examples: [
            {
              target: 'My goal is to speak English well.',
              base: 'Mi objetivo es hablar bien inglés.',
            },
            { target: 'I look forward to seeing you.', base: 'Tengo ganas de verte.' },
          ],
        },
        takeaways: [
          'Contás una meta: My goal is to…',
          'Decís qué esperás con ganas: I look forward to…',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['goal', 'objetivo / meta'],
              ['achieve', 'lograr / alcanzar'],
              ['step', 'paso'],
              ['someday', 'algún día'],
            ],
            ['en-goal', 'en-achieve', 'en-step', 'en-someday'],
            { id: 'en.ex.jfeyyk7emhc1ea' },
          ),
          ex.fillBlank(
            'My ___ is to speak English well.',
            'Mi objetivo es hablar bien inglés.',
            'goal',
            ['step', 'course', 'prize'],
            ['en-goal', 'en-speak'],
            { id: 'en.ex.4f4gz4kxm08fck', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I look forward to ___ you.',
            'Tengo ganas de verte.',
            'seeing',
            ['see', 'saw', 'seen'],
            ['en-look-forward-to', 'en-see'],
            {
              id: 'en.ex.74nbo29tsc8s52',
              explanation: 'Look forward to + -ing (el to es una preposición).',
            },
          ),
          ex.fillBlank(
            'Learning the words is the first ___.',
            'Aprender las palabras es el primer paso.',
            'step',
            ['goal', 'appointment', 'prize'],
            ['en-step'],
            { id: 'en.ex.eibb4nqvot4k41', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'You can achieve your goals.',
            [
              'You can achieve your dreams.',
              'You can change your goals.',
              'We can achieve our goals.',
            ],
            ['en-achieve', 'en-goal'],
            { id: 'en.ex.3q8asvbpsby0vm' },
          ),
          ex.orderWords(
            'Someday I will visit Japan.',
            'Algún día voy a visitar Japón.',
            ['en-someday', 'en-visit'],
            { id: 'en.ex.13np5gd5tsk7j4' },
          ),
          ex.shortAnswer(
            "What's your goal? (hablar bien inglés)",
            '¿Cuál es tu objetivo?',
            'My goal is to speak English well.',
            [
              'To speak English well.',
              'I want to speak English well.',
              'My goal is to speak good English.',
            ],
            ['en-goal', 'en-speak'],
            { id: 'en.ex.2hqjaq69wcbtyu' },
          ),
          ex.translateWrite(
            'Quiero vivir en el exterior en el futuro.',
            'I want to live abroad in the future.',
            ['en-in-the-future', 'en-abroad'],
            {
              id: 'en.ex.zeuuibt48cp747',
              acceptedAnswers: [
                'In the future, I want to live abroad.',
                'I want to live abroad in future.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Proyectos de vida',
        objective:
          'Hablar de grandes proyectos: estudiar, ahorrar, montar un negocio, casarse, jubilarse.',
        intro: {
          explanation:
            'Proyectos frecuentes: save money (ahorrar), apply for a course or a job (postularse), set up a business (montar un negocio), get married (casarse), retire (jubilarse). Se combinan con going to y con el present perfect continuous: I have been saving for two years.',
          examples: [
            {
              target: "I'm going to set up my own business.",
              base: 'Voy a montar mi propio negocio.',
            },
            { target: 'They are getting married in June.', base: 'Se casan en junio.' },
          ],
        },
        takeaways: [
          'Contás proyectos de vida con going to.',
          'Usás apply for, set up, save, get married y retire.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['save', 'ahorrar / guardar'],
              ['retire', 'jubilarse'],
              ['get married', 'casarse'],
              ['business', 'negocio'],
            ],
            ['en-save', 'en-retire', 'en-get-married', 'en-business'],
            { id: 'en.ex.bqzxzfozj2szi4' },
          ),
          ex.fillBlank(
            "I'm going to ___ for a job in a big company.",
            'Me voy a postular a un trabajo en una empresa grande.',
            'apply',
            ['save', 'retire', 'achieve'],
            ['en-apply-for', 'en-job', 'en-company'],
            { id: 'en.ex.0k8oqaqnp8qp98', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'They want to ___ up a small business.',
            'Quieren montar un negocio chico.',
            'set',
            ['get', 'take', 'give'],
            ['en-set-up', 'en-business'],
            { id: 'en.ex.exwz01caf4gq7v', skill: 'vocabulary' },
          ),
          question(
            'en.ex.yocl92atmxixo8',
            CAFE,
            '¿Qué proyecto tiene Pedro?',
            'Abrir un cafe cerca de la universidad',
            ['Estudiar en la universidad', 'Trabajar en un cafe', 'Viajar al exterior'],
            ['en-set-up', 'en-business'],
            "Pedro dice: «I'm going to set up my own business. A small cafe near the university».",
          ),
          question(
            'en.ex.jamdlowtk5ti32',
            CAFE,
            '¿Cuándo va a abrir el cafe?',
            'Apenas tenga suficiente dinero',
            ['El año que viene', 'En dos años', 'Cuando termine de estudiar'],
            ['en-as-soon-as', 'en-save'],
            "Pedro dice: «As soon as I have enough money. I've been saving for two years».",
          ),
          question(
            'en.ex.6m1hdkkk7xh65f',
            GOALS,
            '¿Para qué va a ahorrar Ana?',
            'Para un viaje a Japón',
            ['Para un curso en Londres', 'Para un auto', 'Para un departamento'],
            ['en-save', 'en-goal'],
            'Ana escribe: «I am going to save money for a trip to Japan».',
          ),
          ex.listenChoice(
            'They are getting married in June.',
            [
              'They got married in June.',
              'They are getting married in July.',
              'We are getting married in June.',
            ],
            ['en-get-married'],
            { id: 'en.ex.6js5ic1en9cdxw' },
          ),
          ex.orderWords(
            'My mother wants to retire next year.',
            'Mi madre quiere jubilarse el año que viene.',
            ['en-retire', 'en-mother', 'en-next-year'],
            { id: 'en.ex.q1vyp0zku00cop' },
          ),
          ex.translateWrite(
            'Estoy ahorrando para un auto.',
            'I am saving money for a car.',
            ['en-save', 'en-car'],
            {
              id: 'en.ex.mnmk1y013g91yy',
              acceptedAnswers: [
                "I'm saving money for a car.",
                'I am saving for a car.',
                "I'm saving for a car.",
              ],
            },
          ),
          ex.translateWrite(
            'Se postuló a un trabajo nuevo.',
            'She applied for a new job.',
            ['en-apply-for', 'en-job'],
            {
              id: 'en.ex.xmjsta8o5fvzh8',
              acceptedAnswers: [
                'He applied for a new job.',
                'She has applied for a new job.',
                'He has applied for a new job.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Cuando termine…',
        objective:
          'Hablar de lo que vas a hacer después de otra cosa: when, as soon as, until + presente.',
        intro: {
          explanation:
            'Después de when, as soon as, before, after y until, el futuro va en PRESENTE: When I finish the course, I will look for a job (no «when I will finish»). Until es «hasta (que)».',
          examples: [
            {
              target: 'When I finish the course, I will look for a job.',
              base: 'Cuando termine el curso, voy a buscar trabajo.',
            },
            { target: 'I will wait until you arrive.', base: 'Voy a esperar hasta que llegues.' },
          ],
        },
        takeaways: [
          'Usás el presente después de when, as soon as y until para hablar del futuro.',
          'Escribís un pedido formal: I would like to apply for…',
        ],
        exercises: [
          ex.fillBlank(
            'When I ___ the course, I will look for a job.',
            'Cuando termine el curso, voy a buscar trabajo.',
            'finish',
            ['will finish', 'finished', 'am going to finish'],
            ['en-finish', 'en-course'],
            {
              id: 'en.ex.684xdpsa56nzgj',
              explanation: 'Después de when, el futuro va en presente: when I finish.',
            },
          ),
          ex.fillBlank(
            'I will wait ___ you arrive.',
            'Voy a esperar hasta que llegues.',
            'until',
            ['since', 'for', 'ago'],
            ['en-until', 'en-wait'],
            { id: 'en.ex.ec7iqrkxsg7ruc', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "I'll call you as soon as I ___ home.",
            'Te llamo apenas llegue a casa.',
            'get',
            ['will get', 'got', 'getting'],
            ['en-as-soon-as', 'en-call'],
            { id: 'en.ex.r3jwi5v5cjl8he' },
          ),
          question(
            'en.ex.eoyt7jie4cdsuy',
            COURSE_EMAIL,
            '¿Por qué quiere Kate hacer el curso?',
            'Quiere trabajar en el exterior en el futuro',
            ['Quiere ser profesora', 'Necesita un trabajo de enfermera', 'Va a jubilarse'],
            ['en-goal', 'en-in-the-future'],
            'Kate escribe: «my goal is to work abroad in the future».',
          ),
          question(
            'en.ex.wzhnrirtlvcmtq',
            COURSE_EMAIL,
            '¿Cuándo está libre Kate?',
            'De julio a septiembre',
            ['Todo el año', 'Sólo en julio', 'Desde septiembre'],
            ['en-until', 'en-free'],
            'Kate escribe: «I am free from July until September».',
          ),
          ex.listenChoice(
            'I look forward to hearing from you.',
            [
              'I look forward to seeing you.',
              'I look forward to hearing from them.',
              'We look forward to hearing from you.',
            ],
            ['en-look-forward-to', 'en-hear'],
            { id: 'en.ex.e5ddazoa5bx8mt' },
          ),
          ex.orderWords(
            'I would like to apply for the course.',
            'Quisiera postularme al curso.',
            ['en-apply-for', 'en-course'],
            { id: 'en.ex.5chbarnip35saz' },
          ),
          ex.shortAnswer(
            'What will you do when you finish school? (buscar trabajo)',
            '¿Qué vas a hacer cuando termines la escuela?',
            'I will look for a job.',
            ["I'll look for a job.", 'Look for a job.', "I'm going to look for a job."],
            ['en-will', 'en-job'],
            { id: 'en.ex.bi4vky6mkbcimm' },
          ),
          ex.translateWrite(
            'Cuando termine el curso, voy a viajar.',
            'When I finish the course, I will travel.',
            ['en-course', 'en-finish', 'en-travel'],
            {
              id: 'en.ex.knrr2ypw43dvdz',
              acceptedAnswers: [
                "When I finish the course, I'll travel.",
                'When I finish the course, I am going to travel.',
                "When I finish the course, I'm going to travel.",
                'I will travel when I finish the course.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

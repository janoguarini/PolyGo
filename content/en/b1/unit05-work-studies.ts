import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U5 «Trabajo y estudios» (docs/B1_EN.md): obligación y permiso (have to / don't have to, must /
 * mustn't, be allowed to); estudios (exámenes, materias); buscar trabajo (CV, avisos, fill in, find
 * out) y una entrevista (responsible for, make a decision).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RULES = reading(
  'en.stim.b1-u5-rules',
  'notice',
  'Un cartel en la cocina de una oficina.',
  [
    'Kitchen rules',
    'You must wash your cup after using it.',
    'You are not allowed to leave food in the fridge on Fridays.',
    "You don't have to bring your own coffee. It's free!",
    'Please be kind: other people use this kitchen too.',
  ],
  { title: 'Kitchen rules' },
);

const EXAM = dialogue('en.stim.b1-u5-exam', 'Dos compañeros hablan antes de un examen.', [
  ['Ana', "I'm so nervous. The history exam is tomorrow."],
  ['Ben', "Don't worry. You studied a lot. You'll pass."],
  ['Ana', 'I hope so. I failed it last year.'],
  ['Ben', "We're allowed to use a dictionary, right?"],
  ['Ana', "No, we aren't. But we don't have to answer all the questions."],
]);

const JOB_AD = reading(
  'en.stim.b1-u5-ad',
  'ad',
  'Un aviso de trabajo.',
  [
    'Hotel receptionist – part-time',
    'We are hiring! Our hotel needs a friendly receptionist for weekends.',
    'You must speak English and Spanish. Experience is not necessary.',
    'To apply, fill in the form on our website and send your CV.',
    'Deadline: March 30th.',
  ],
  { title: 'We are hiring!' },
);

const INTERVIEW = dialogue('en.stim.b1-u5-interview', 'Una entrevista de trabajo.', [
  ['Manager', 'Tell me about your last job.'],
  ['Sofia', 'I worked in a shop for three years. I was responsible for the money and the orders.'],
  ['Manager', 'Why do you want to work here?'],
  ['Sofia', 'I want to learn new skills, and I prefer a full-time job.'],
  ['Manager', "Thank you. We'll make a decision on Friday, and we'll call you."],
]);

export const EN_B1_U05: B1UnitDef = {
  names: ['Ana', 'Ben', 'Sofia'],
  support: [
    'rules',
    'fridge',
    'bring',
    'history',
    'dictionary',
    'receptionist',
    'website',
    'necessary',
    'th',
    'orders',
    'prefer',
    'using',
    'report',
    'classroom',
    'tell',
    'customers',
    'math',
  ],
  unit: {
    position: 5,
    title: 'Trabajo y estudios',
    titleEn: 'Work and studies',
    description:
      'Obligaciones y permisos (have to, must, allowed to), exámenes y materias, avisos de trabajo, el CV y una entrevista.',
    emoji: '💼',
    objective:
      'Podés hablar de obligaciones y normas en el trabajo o el estudio, entender un aviso de trabajo y responder en una entrevista.',
    grammar: {
      title: 'Obligación y permiso',
      explanation:
        "Have to y must: obligación (must, sobre todo en normas escritas). Don't have to: no hace falta (no es obligatorio). Mustn't y not allowed to: está prohibido. Allowed to: tenés permiso.",
      examples: [
        {
          target: 'I have to wear a uniform at work.',
          base: 'Tengo que usar uniforme en el trabajo.',
        },
        {
          target: "You don't have to come. It's not necessary.",
          base: 'No hace falta que vengas. No es necesario.',
        },
        {
          target: 'We are not allowed to use our phones in class.',
          base: 'No nos dejan usar el teléfono en clase.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-dont-have-to',
        "don't have to",
        'no hace falta / no tener que',
        '/doʊnt ˈhæv tu/',
        undefined,
        "You don't have to pay. It's free.",
        'No hace falta pagar. Es gratis.',
        ['work', 'modals'],
        ['no tener que', 'no es necesario'],
      ),
      w(
        'en-allowed-to',
        'allowed to',
        'tener permiso para',
        '/əˈlaʊd tu/',
        undefined,
        'Are we allowed to eat here?',
        '¿Podemos comer acá?',
        ['work', 'modals'],
        ['tener permiso', 'permitido'],
      ),
      w(
        'en-cv',
        'CV',
        'currículum',
        '/ˌsiː ˈviː/',
        '📄',
        'Send us your CV.',
        'Mandanos tu currículum.',
        ['work'],
        ['currículum vitae', 'CV'],
      ),
      w(
        'en-deadline',
        'deadline',
        'fecha límite / plazo',
        '/ˈdɛdlaɪn/',
        '⏰',
        'The deadline is on Friday.',
        'La fecha límite es el viernes.',
        ['work'],
        ['fecha límite', 'plazo'],
      ),
      w(
        'en-employee',
        'employee',
        'empleado / empleada',
        '/ɪmˈplɔɪi/',
        undefined,
        'The company has fifty employees.',
        'La empresa tiene cincuenta empleados.',
        ['work'],
        ['empleado', 'empleada'],
      ),
      w(
        'en-manager',
        'manager',
        'gerente / encargado',
        '/ˈmænɪdʒər/',
        undefined,
        'I need to speak to the manager.',
        'Necesito hablar con el gerente.',
        ['work'],
        ['gerente', 'encargado', 'encargada'],
      ),
      w(
        'en-full-time',
        'full-time',
        'de tiempo completo',
        '/ˈfʊl ˈtaɪm/',
        undefined,
        'She has a full-time job.',
        'Tiene un trabajo de tiempo completo.',
        ['work'],
        ['tiempo completo', 'jornada completa'],
      ),
      w(
        'en-part-time',
        'part-time',
        'de medio tiempo',
        '/ˈpɑrt ˈtaɪm/',
        undefined,
        'I work part-time in a cafe.',
        'Trabajo medio tiempo en un café.',
        ['work'],
        ['medio tiempo', 'media jornada'],
      ),
      w(
        'en-make-a-decision',
        'make a decision',
        'tomar una decisión',
        '/ˈmeɪk ə dɪˈsɪʒən/',
        undefined,
        'I have to make a decision today.',
        'Tengo que tomar una decisión hoy.',
        ['work', 'collocations'],
        ['decidir'],
      ),
      w(
        'en-fill-in',
        'fill in',
        'completar (un formulario)',
        '/ˈfɪl ˈɪn/',
        '📝',
        'Please fill in this form.',
        'Por favor, completá este formulario.',
        ['work', 'phrasal-verbs'],
        ['completar', 'rellenar'],
      ),
      w(
        'en-find-out',
        'find out',
        'averiguar / enterarse',
        '/ˈfaɪnd ˈaʊt/',
        '🔎',
        'I want to find out more about the job.',
        'Quiero averiguar más sobre el trabajo.',
        ['work', 'phrasal-verbs'],
        ['averiguar', 'enterarse', 'descubrir'],
      ),
      w(
        'en-responsible-for',
        'responsible for',
        'a cargo de / responsable de',
        '/rɪˈspɑnsəbəl fɔr/',
        undefined,
        'He is responsible for the money.',
        'Está a cargo de la plata.',
        ['work'],
        ['a cargo de', 'responsable de', 'encargado de'],
      ),
      w(
        'en-exam',
        'exam',
        'examen',
        '/ɪɡˈzæm/',
        '📝',
        'I have an exam tomorrow.',
        'Mañana tengo un examen.',
        ['studies'],
      ),
      w(
        'en-pass',
        'pass',
        'aprobar',
        '/pæs/',
        '✅',
        'I hope I pass the exam.',
        'Espero aprobar el examen.',
        ['studies', 'verbs'],
      ),
      w(
        'en-fail',
        'fail',
        'desaprobar / reprobar',
        '/feɪl/',
        '❌',
        'He failed the test, but he tried again.',
        'Desaprobó la prueba, pero lo intentó de nuevo.',
        ['studies', 'verbs'],
        ['desaprobar', 'reprobar'],
      ),
      w(
        'en-subject',
        'subject',
        'materia / asignatura',
        '/ˈsʌbdʒɪkt/',
        '📘',
        'My favorite subject is math.',
        'Mi materia favorita es matemática.',
        ['studies'],
        ['materia', 'asignatura'],
      ),
      w(
        'en-hire',
        'hire',
        'contratar',
        '/haɪər/',
        '🤝',
        'The company is hiring new employees.',
        'La empresa está contratando empleados nuevos.',
        ['work', 'verbs'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Tener que y no hace falta',
        objective:
          "Hablar de obligaciones y de lo que no es necesario: have to, must, don't have to.",
        intro: {
          explanation:
            "Have to y must expresan obligación: I have to wear a uniform. Don't have to NO es una prohibición: dice que algo no hace falta (You don't have to come). En pasado: had to (tuve que).",
          examples: [
            {
              target: 'I have to wear a uniform at work.',
              base: 'Tengo que usar uniforme en el trabajo.',
            },
            {
              target: "You don't have to pay. It's free.",
              base: 'No hace falta pagar. Es gratis.',
            },
          ],
        },
        takeaways: [
          'Contás tus obligaciones con have to y must.',
          "Decís que algo no hace falta con don't have to.",
        ],
        exercises: [
          ex.fillBlank(
            'I ___ to wear a uniform at work.',
            'Tengo que usar uniforme en el trabajo.',
            'have',
            ['must', 'should', 'can'],
            ['en-have-to'],
            {
              id: 'en.ex.0mnyq61yg7l4ay',
              explanation: 'Have to + verbo: obligación. Must va sin to (I must wear).',
            },
          ),
          ex.fillBlank(
            "It's free. You ___ pay.",
            'Es gratis. No hace falta pagar.',
            "don't have to",
            ['must', 'have to', 'should'],
            ['en-dont-have-to', 'en-pay'],
            {
              id: 'en.ex.bl6x119nk4mcsc',
              explanation: "Don't have to: no es necesario (no es una prohibición).",
            },
          ),
          ex.fillBlank(
            'Yesterday I ___ to work late.',
            'Ayer tuve que trabajar hasta tarde.',
            'had',
            ['have', 'must', 'has'],
            ['en-have-to', 'en-work'],
            {
              id: 'en.ex.12agro2gdtrgnl',
              explanation: 'Must no tiene pasado: se usa had to.',
            },
          ),
          ex.translationChoice(
            "don't have to",
            'no hace falta / no tener que',
            ['tener permiso para', 'está prohibido', 'debería'],
            ['en-dont-have-to'],
            { id: 'en.ex.5rooow8te1al76' },
          ),
          ex.listenChoice(
            "You don't have to come tomorrow.",
            [
              'You have to come tomorrow.',
              "You don't have to come today.",
              "You don't want to come tomorrow.",
            ],
            ['en-dont-have-to'],
            { id: 'en.ex.36g2es2kezmqmb' },
          ),
          ex.orderWords(
            'We have to finish the report today.',
            'Tenemos que terminar el informe hoy.',
            ['en-have-to', 'en-finish'],
            { id: 'en.ex.rnqwqji6rguju0' },
          ),
          ex.shortAnswer(
            'Do you have to work on Saturdays? (no, no hace falta)',
            '¿Tenés que trabajar los sábados?',
            "No, I don't have to.",
            ["No, I don't.", 'No.', "No, I don't have to work on Saturdays."],
            ['en-dont-have-to', 'en-saturday'],
            { id: 'en.ex.gexv5rrrxqh6uy' },
          ),
          ex.translateWrite(
            'No hace falta que vengas.',
            "You don't have to come.",
            ['en-dont-have-to'],
            {
              id: 'en.ex.isq65kxkbxlekx',
              acceptedAnswers: ['You do not have to come.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Normas',
        objective: "Entender y explicar normas: must, mustn't, allowed to.",
        intro: {
          explanation:
            "En normas escritas se usa must (obligación) y mustn't (prohibición). Para hablar de permisos: be allowed to (I am allowed to…, We aren't allowed to…). Are we allowed to…? pregunta si algo está permitido.",
          examples: [
            { target: 'You must wash your cup.', base: 'Tenés que lavar tu taza.' },
            {
              target: 'We are not allowed to use our phones in class.',
              base: 'No nos dejan usar el teléfono en clase.',
            },
          ],
        },
        takeaways: [
          "Entendés normas con must y mustn't.",
          'Preguntás qué está permitido: Are we allowed to…?',
        ],
        exercises: [
          ex.fillBlank(
            'Are we ___ to eat in the classroom?',
            '¿Podemos comer en el aula?',
            'allowed',
            ['must', 'have', 'need'],
            ['en-allowed-to', 'en-eat'],
            { id: 'en.ex.j6wmcvrvjl70u3' },
          ),
          ex.fillBlank(
            'You ___ use your phone in the exam. It is not allowed.',
            'No podés usar el teléfono en el examen. No está permitido.',
            "mustn't",
            ["don't have to", 'must', 'should'],
            ['en-mustnt', 'en-exam'],
            {
              id: 'en.ex.2x74db18cqmuuv',
              explanation: "Mustn't: está prohibido. Don't have to: no hace falta.",
            },
          ),
          ex.fillBlank(
            'Students ___ arrive on time.',
            'Los alumnos tienen que llegar a horario.',
            'must',
            ["mustn't", 'allowed', "don't"],
            ['en-must', 'en-student'],
            { id: 'en.ex.06qv1rylhwulj5' },
          ),
          question(
            'en.ex.xk8ecjoxr78r65',
            RULES,
            '¿Qué no se puede hacer los viernes?',
            'Dejar comida en la heladera',
            ['Tomar café', 'Usar la cocina', 'Lavar las tazas'],
            ['en-allowed-to', 'en-friday'],
            'El cartel dice: «You are not allowed to leave food in the fridge on Fridays».',
          ),
          question(
            'en.ex.e8v27f98zyckco',
            RULES,
            '¿Por qué no hace falta traer café?',
            'Porque el café es gratis',
            ['Porque está prohibido', 'Porque no hay café', 'Porque hay que comprarlo afuera'],
            ['en-dont-have-to', 'en-coffee'],
            "El cartel dice: «You don't have to bring your own coffee. It's free!».",
          ),
          ex.listenChoice(
            'We are not allowed to eat here.',
            [
              'We are not allowed to sit here.',
              'We are allowed to eat here.',
              'You are not allowed to eat here.',
            ],
            ['en-allowed-to', 'en-eat'],
            { id: 'en.ex.us95jcik7lt9o1' },
          ),
          ex.orderWords(
            'Are we allowed to use a dictionary?',
            '¿Podemos usar diccionario?',
            ['en-allowed-to'],
            { id: 'en.ex.l71r7e0ekcj4xu' },
          ),
          ex.shortAnswer(
            'Are you allowed to use your phone at work? (no, no está permitido)',
            '¿Podés usar el teléfono en el trabajo?',
            "No, I'm not allowed to.",
            ["No, I'm not.", 'No, I am not allowed to.', "No, we aren't allowed to."],
            ['en-allowed-to', 'en-phone'],
            { id: 'en.ex.88grs0ga4dccd2' },
          ),
          ex.translateWrite(
            'No nos dejan comer en clase.',
            'We are not allowed to eat in class.',
            ['en-allowed-to', 'en-eat'],
            {
              id: 'en.ex.rqazdvdbrc1aml',
              acceptedAnswers: [
                "We aren't allowed to eat in class.",
                "We're not allowed to eat in class.",
                'We are not allowed to eat in the class.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Exámenes y materias',
        objective: 'Hablar de estudios: materias, exámenes, aprobar y desaprobar.',
        intro: {
          explanation:
            "Pass an exam es aprobar; fail an exam, desaprobar. Subject es una materia. Para dar ánimo: Don't worry, you'll pass. Para contar lo que tuviste que hacer: I had to study a lot.",
          examples: [
            { target: 'I hope I pass the exam.', base: 'Espero aprobar el examen.' },
            { target: 'My favorite subject is history.', base: 'Mi materia favorita es historia.' },
          ],
        },
        takeaways: ['Hablás de exámenes y materias.', 'Contás si aprobaste o desaprobaste.'],
        exercises: [
          ex.matchPairs(
            [
              ['exam', 'examen'],
              ['pass', 'aprobar'],
              ['fail', 'desaprobar / reprobar'],
              ['subject', 'materia / asignatura'],
            ],
            ['en-exam', 'en-pass', 'en-fail', 'en-subject'],
            { id: 'en.ex.rdheb0vgzpp81c' },
          ),
          ex.fillBlank(
            "Don't worry. You studied a lot. You'll ___.",
            'No te preocupes. Estudiaste mucho. Vas a aprobar.',
            'pass',
            ['fail', 'lose', 'forget'],
            ['en-pass', 'en-study'],
            { id: 'en.ex.x0087f68vrwpe3', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'He ___ the exam, but he tried again and passed.',
            'Desaprobó el examen, pero lo intentó de nuevo y aprobó.',
            'failed',
            ['passed', 'won', 'lost'],
            ['en-fail', 'en-exam'],
            { id: 'en.ex.wjhtr8nhnkz1td', skill: 'vocabulary' },
          ),
          question(
            'en.ex.70et1x0oar2k9b',
            EXAM,
            '¿Por qué está nerviosa Ana?',
            'Mañana tiene el examen de historia y el año pasado lo desaprobó',
            ['No estudió nada', 'Perdió el diccionario', 'El examen es hoy'],
            ['en-exam', 'en-fail'],
            'Ana dice: «The history exam is tomorrow… I failed it last year».',
          ),
          question(
            'en.ex.ulw1wo112puuxz',
            EXAM,
            '¿Qué está permitido en el examen?',
            'No responder todas las preguntas',
            ['Usar diccionario', 'Llevar el teléfono', 'Trabajar en grupo'],
            ['en-dont-have-to', 'en-allowed-to'],
            "Ana dice: «we don't have to answer all the questions».",
          ),
          ex.listenChoice(
            'My favorite subject is history.',
            [
              'My favorite subject is English.',
              'My favorite teacher is history.',
              'My first subject is history.',
            ],
            ['en-subject', 'en-favorite'],
            { id: 'en.ex.6nu3j11lg5we5s' },
          ),
          ex.orderWords(
            'I hope I pass the exam.',
            'Espero aprobar el examen.',
            ['en-pass', 'en-exam', 'en-hope'],
            { id: 'en.ex.efjftv5zxyjw83' },
          ),
          ex.shortAnswer(
            'Did you pass the exam? (sí, aprobaste)',
            '¿Aprobaste el examen?',
            'Yes, I passed.',
            ['Yes, I did.', 'Yes, I passed the exam.', 'Yes, I passed it.'],
            ['en-pass', 'en-exam'],
            { id: 'en.ex.yh6ynwi9r4ssqe' },
          ),
          ex.translateWrite(
            'Mañana tengo un examen.',
            'I have an exam tomorrow.',
            ['en-exam', 'en-tomorrow'],
            {
              id: 'en.ex.9bqh7akzti5ifq',
              acceptedAnswers: ['Tomorrow I have an exam.', "I've got an exam tomorrow."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Buscar trabajo',
        objective: 'Entender un aviso de trabajo y explicar cómo postularse.',
        intro: {
          explanation:
            'En un aviso: full-time / part-time (tiempo completo / medio tiempo), deadline (fecha límite), hire (contratar). Para postularte: fill in the form (completar el formulario) y send your CV. Find out es averiguar.',
          examples: [
            {
              target: 'Fill in the form and send your CV.',
              base: 'Completá el formulario y mandá tu currículum.',
            },
            {
              target: 'They are hiring part-time employees.',
              base: 'Están contratando empleados de medio tiempo.',
            },
          ],
        },
        takeaways: [
          'Entendés un aviso de trabajo.',
          'Explicás cómo postularse: fill in, send your CV, before the deadline.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['deadline', 'fecha límite / plazo'],
              ['hire', 'contratar'],
              ['fill in', 'completar (un formulario)'],
              ['find out', 'averiguar / enterarse'],
            ],
            ['en-deadline', 'en-hire', 'en-fill-in', 'en-find-out'],
            { id: 'en.ex.1f8fv5tk6gbyqd' },
          ),
          ex.imageChoice('📄', 'CV', ['deadline', 'exam', 'subject'], ['en-cv'], {
            id: 'en.ex.zdjegd51rdpm06',
          }),
          ex.fillBlank(
            'Please ___ in this form.',
            'Por favor, completá este formulario.',
            'fill',
            ['find', 'make', 'take'],
            ['en-fill-in'],
            { id: 'en.ex.k4uqpytll7h11y', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I work ___ in the mornings, four hours a day.',
            'Trabajo medio tiempo a la mañana, cuatro horas por día.',
            'part-time',
            ['deadline', 'subject', 'exam'],
            ['en-part-time', 'en-work'],
            { id: 'en.ex.uohr10e4qpm3nv', skill: 'vocabulary' },
          ),
          question(
            'en.ex.mytobc4x9q33vc',
            JOB_AD,
            '¿Qué trabajo ofrece el aviso?',
            'Recepcionista de hotel los fines de semana',
            ['Recepcionista de tiempo completo', 'Mozo en un restaurante', 'Profesor de inglés'],
            ['en-part-time', 'en-hire'],
            'El aviso dice: «Hotel receptionist – part-time… for weekends».',
          ),
          question(
            'en.ex.fr3xofide4keqd',
            JOB_AD,
            '¿Qué hay que hacer para postularse?',
            'Completar el formulario de la web y mandar el CV',
            ['Llamar al hotel', 'Ir al hotel el 30 de marzo', 'Mandar un mail con fotos'],
            ['en-fill-in', 'en-cv'],
            'El aviso dice: «fill in the form on our website and send your CV».',
          ),
          ex.listenChoice(
            'The deadline is on Friday.',
            [
              'The deadline was on Friday.',
              'The deadline is on Thursday.',
              'The meeting is on Friday.',
            ],
            ['en-deadline', 'en-friday'],
            { id: 'en.ex.fe24558ns9rpn8' },
          ),
          ex.translateWrite(
            'Quiero averiguar más sobre el trabajo.',
            'I want to find out more about the job.',
            ['en-find-out', 'en-job'],
            {
              id: 'en.ex.vqqzdsxu8n37iu',
              acceptedAnswers: ['I would like to find out more about the job.'],
            },
          ),
          ex.translateWrite(
            'La empresa está contratando empleados.',
            'The company is hiring employees.',
            ['en-hire', 'en-employee', 'en-company'],
            {
              id: 'en.ex.9dpvopva6tiwj5',
              acceptedAnswers: [
                'The company is hiring new employees.',
                'The company is hiring workers.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'La entrevista',
        objective:
          'Responder en una entrevista: tu experiencia, tus tareas y por qué querés el puesto.',
        intro: {
          explanation:
            'En una entrevista contás tu experiencia (I worked in… for three years), tus tareas (I was responsible for…) y qué buscás (a full-time job). Make a decision es tomar una decisión.',
          examples: [
            { target: 'I was responsible for the orders.', base: 'Estaba a cargo de los pedidos.' },
            {
              target: "We'll make a decision on Friday.",
              base: 'Vamos a tomar una decisión el viernes.',
            },
          ],
        },
        takeaways: [
          'Contás tu experiencia y tus tareas en una entrevista.',
          "Entendés qué va a pasar después: We'll make a decision…",
        ],
        exercises: [
          ex.translationChoice(
            'manager',
            'gerente / encargado',
            ['empleado / empleada', 'compañero de trabajo', 'jefe / jefa'],
            ['en-manager'],
            { id: 'en.ex.csglxzw4g3jvq0' },
          ),
          question(
            'en.ex.8vftyuzb9r3u10',
            INTERVIEW,
            '¿De qué estaba a cargo Sofía en su último trabajo?',
            'De la plata y los pedidos',
            ['De los empleados', 'De la limpieza', 'De las entrevistas'],
            ['en-responsible-for'],
            'Sofía dice: «I was responsible for the money and the orders».',
          ),
          question(
            'en.ex.1gqcjnfiaxljyu',
            INTERVIEW,
            '¿Cuándo van a decidir?',
            'El viernes',
            ['Hoy', 'La semana que viene', 'En tres días'],
            ['en-make-a-decision', 'en-friday'],
            "El gerente dice: «We'll make a decision on Friday».",
          ),
          ex.fillBlank(
            'He is ___ for the money.',
            'Está a cargo de la plata.',
            'responsible',
            ['allowed', 'interested', 'proud'],
            ['en-responsible-for', 'en-money'],
            { id: 'en.ex.0dx4zr6vnfubji', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I have to ___ a decision today.',
            'Tengo que tomar una decisión hoy.',
            'make',
            ['take', 'do', 'have'],
            ['en-make-a-decision', 'en-today'],
            {
              id: 'en.ex.i103czclvgytiu',
              skill: 'vocabulary',
              explanation: 'En inglés una decisión se hace: make a decision.',
            },
          ),
          ex.listenChoice(
            'I need to speak to the manager.',
            [
              'I need to speak to the doctor.',
              'I want to speak to the manager.',
              'I need to speak to the employees.',
            ],
            ['en-manager', 'en-speak'],
            { id: 'en.ex.cbdf0ndhistywx' },
          ),
          ex.orderWords(
            'She has a full-time job.',
            'Tiene un trabajo de tiempo completo.',
            ['en-full-time', 'en-job'],
            { id: 'en.ex.5liojdfi8xaewl' },
          ),
          ex.shortAnswer(
            'Tell me about your last job. (trabajaste en un negocio tres años)',
            'Contame sobre tu último trabajo.',
            'I worked in a shop for three years.',
            [
              'I worked in a store for three years.',
              'I worked at a shop for three years.',
              'I have worked in a shop for three years.',
            ],
            ['en-work', 'en-shop', 'en-for'],
            { id: 'en.ex.7wbhb3nenbpgfv' },
          ),
          ex.translateWrite(
            'Estaba a cargo de los clientes.',
            'I was responsible for the customers.',
            ['en-responsible-for'],
            {
              id: 'en.ex.vljvin7v36xbqa',
              acceptedAnswers: [
                'I was responsible for the clients.',
                'She was responsible for the customers.',
                'He was responsible for the customers.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

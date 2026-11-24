import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U7 «Work and studies» (docs/ES_A1_A2.md): obligación y posibilidad (tengo que, hay que
 * impersonal, puedo / no puedo), cuánto hace que algo pasa (desde hace + tiempo, desde + punto de
 * partida, durante), la entrevista de trabajo con usted, la pasantía, el currículum, el sueldo, la
 * reunión, aprobar un examen y el título.
 * Pronunciación: la c suena k delante de a, o, u (currículum, compañero) y s delante de e, i (oficina);
 * las palabras en -ión llevan el acento en la última sílaba (reunión).
 * Variante: español neutro de Latinoamérica, con tú (tienes que, puedes) y usted en la entrevista.
 * Cultura: en varios países (México, Argentina) la universidad pública es gratuita o casi gratuita; la
 * pasantía (también «las prácticas») es un trabajo para estudiantes. Escenarios: Bogotá, Lima, Buenos Aires.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ENTREVISTA = dialogue(
  'es.stim.a2-u7-entrevista',
  'A job interview at a company in Bogotá. The interviewer and the candidate use usted.',
  [
    ['Laura', 'Buenas tardes, Diego. ¿Dónde trabaja ahora?'],
    ['Diego', 'Buenas tardes. Trabajo en un hotel de Bogotá desde hace dos años.'],
    ['Laura', '¿Y también estudia?'],
    ['Diego', 'Sí, estudio en la universidad durante la semana. Termino el año que viene.'],
    ['Laura', 'Bien. Acá hay que trabajar los sábados. ¿Puede?'],
    ['Diego', 'Sí, puedo. Pero los lunes tengo que ir a la facultad por la mañana.'],
    ['Laura', 'No hay problema. ¿Me trae su currículum mañana?'],
  ],
);

const AVISO = reading(
  'es.stim.a2-u7-aviso',
  'ad',
  'An ad on a university notice board.',
  [
    'Buscamos estudiantes de la universidad para una pasantía de seis meses en una empresa de Buenos Aires.',
    'Hay que hablar inglés y tener tiempo libre por la tarde.',
    'La pasantía es de lunes a viernes, durante cuatro horas por día, y tiene sueldo.',
    'Si te interesa, manda tu currículum antes del viernes.',
  ],
  { title: 'Pasantía en Buenos Aires' },
);

const MENSAJE = reading(
  'es.stim.a2-u7-mensaje',
  'message',
  'A message from Sofía to her coworker Martín.',
  [
    '¡Hola, Martín!',
    'Hoy no puedo ir a la reunión de las cinco: tengo un examen en la facultad.',
    'Si apruebo, ¡ya tengo el título!',
    '¿Me cuentas después qué pasó en la reunión?',
    'Gracias. Sofía',
  ],
  { from: 'Sofía', to: 'Martín' },
);

export const ES_A2_U07: EsUnitDef = {
  names: [
    'Laura',
    'Diego',
    'Sofía',
    'Martín',
    'Lucía',
    'Tomás',
    'Bogotá',
    'Lima',
    'Buenos',
    'Aires',
  ],
  support: [
    'estudiar',
    'mandar',
    'hablar',
    'puede',
    'buscamos',
    'interesa',
    'manda',
    'apruebo',
    'cuentas',
    'estudias',
    'empresa',
  ],
  unit: {
    position: 7,
    title: 'Work and studies',
    titleEn: 'Trabajo y estudios',
    description:
      'Say what you have to do and what you can or can’t do (tengo que, hay que, puedo), say how long you have been doing something (desde hace, desde, durante) and get through a job interview.',
    emoji: '🎓',
    objective:
      'You can talk about obligations and what you can or can’t do at work or at university, say how long you have been working or studying somewhere, and answer simple questions in a job interview.',
    grammar: {
      title: 'Tener que, hay que, poder · desde hace',
      explanation:
        'Tener que + infinitive is a personal obligation: tengo que, tienes que (tú), tiene que (usted, él, ella), tenemos que, tienen que (ustedes, ellos). Tener is irregular: yo tengo, but tú tienes. Never drop the que: tengo que trabajar. Hay que + infinitive is impersonal, a general rule with no subject: en la oficina hay que llegar a tiempo. Poder + infinitive is can: puedo, puedes, puede, podemos, pueden (the o becomes ue in every form except nosotros); no puedo is I can’t. To say how long something has been going on, Spanish uses the present tense: trabajo acá desde hace tres años means I have been working here for three years. Desde hace goes with a period of time, desde alone with a starting point (desde marzo), and durante means during (durante la semana).',
      examples: [
        { target: 'Tengo que mandar el currículum hoy.', base: 'I have to send my CV today.' },
        {
          target: 'En la universidad hay que estudiar mucho.',
          base: 'At university you have to study a lot.',
        },
        {
          target: 'Trabajo en esta oficina desde hace tres años.',
          base: 'I’ve been working in this office for three years.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U7), convertido al español neutro con tú (2026-11-21). Sin revisión nativa. Revisar: «hay que» traducido como «one has to» (aceptado «you have to»); «currículum» con tilde frente a «currículo» / «CV» (se acepta «el CV»); «la pasantía» como práctica para estudiantes (en México se dice más «las prácticas profesionales»); «desde hace» frente a «hace… que» (aceptado en las respuestas); «acá» (general en Latinoamérica; «aquí» también); «la facultad» frente a «la universidad»; si conviene enseñar «reprobar» (México) / «desaprobar» (Argentina) para no aprobar un examen.',
    },
    words: [
      w(
        'es-tengo-que',
        'tengo que',
        'I have to',
        'Mañana tengo que trabajar.',
        'I have to work tomorrow.',
        ['obligation'],
        { acceptedTranslations: ['I must'] },
      ),
      w(
        'es-puedo',
        'puedo',
        'I can',
        'Puedo trabajar los sábados.',
        'I can work on Saturdays.',
        ['possibility'],
        { acceptedTranslations: ["I'm able to"] },
      ),
      w(
        'es-hay-que',
        'hay que',
        'one has to',
        'En la oficina hay que llegar a tiempo.',
        'At the office you have to be on time.',
        ['obligation'],
        { acceptedTranslations: ['you have to', "it's necessary to"] },
      ),
      w(
        'es-desde-hace',
        'desde hace',
        'for (a period of time)',
        'Trabajo acá desde hace tres años.',
        'I’ve been working here for three years.',
        ['time'],
      ),
      w(
        'es-desde',
        'desde',
        'since',
        'Estudio inglés desde marzo.',
        'I’ve been studying English since March.',
        ['time'],
        { acceptedTranslations: ['from'] },
      ),
      w(
        'es-durante',
        'durante',
        'during',
        'Durante la semana trabajo en una oficina.',
        'During the week I work in an office.',
        ['time'],
      ),
      w(
        'es-la-entrevista',
        'la entrevista',
        'the interview',
        'Mañana tengo una entrevista de trabajo.',
        'Tomorrow I have a job interview.',
        ['work'],
        { emoji: '🤝' },
      ),
      w(
        'es-la-pasantia',
        'la pasantía',
        'the internship',
        'Mi hermana hace una pasantía en un banco.',
        'My sister is doing an internship at a bank.',
        ['work'],
      ),
      w(
        'es-el-curriculum',
        'el currículum',
        'the CV',
        '¿Me trae su currículum, por favor?',
        'Could you bring me your CV, please?',
        ['work'],
        { acceptedTranslations: ['the résumé'], acceptedTexts: ['el CV'], emoji: '📄' },
      ),
      w(
        'es-el-sueldo',
        'el sueldo',
        'the salary',
        'El sueldo no es muy alto.',
        'The salary isn’t very high.',
        ['work'],
        { acceptedTranslations: ['the pay'], emoji: '💰' },
      ),
      w(
        'es-el-companero-de-trabajo',
        'el compañero de trabajo',
        'the coworker',
        'Martín es mi compañero de trabajo.',
        'Martín is my coworker.',
        ['work'],
        { acceptedTranslations: ['the colleague'], acceptedTexts: ['la compañera de trabajo'] },
      ),
      w(
        'es-la-reunion',
        'la reunión',
        'the meeting',
        'La reunión es a las diez.',
        'The meeting is at ten.',
        ['work'],
      ),
      w(
        'es-la-universidad',
        'la universidad',
        'the university',
        'Mi hermano estudia en la universidad.',
        'My brother studies at university.',
        ['studies'],
        { emoji: '🏛️' },
      ),
      w(
        'es-el-examen',
        'el examen',
        'the exam',
        'Mañana tengo un examen de inglés.',
        'Tomorrow I have an English exam.',
        ['studies'],
        { acceptedTranslations: ['the test'], emoji: '📝' },
      ),
      w(
        'es-aprobar',
        'aprobar',
        'to pass (an exam)',
        'Tengo que aprobar el examen.',
        'I have to pass the exam.',
        ['studies'],
      ),
      w(
        'es-el-titulo',
        'el título',
        'the degree',
        'Ya tengo el título de ingeniera.',
        'I already have my engineering degree.',
        ['studies'],
        { acceptedTranslations: ['the diploma'], emoji: '🎓' },
      ),
      w(
        'es-el-empleo',
        'el empleo',
        'employment',
        'Busco empleo en Lima.',
        'I’m looking for work in Lima.',
        ['work'],
        { acceptedTranslations: ['a job'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Tengo que…',
        objective: 'Say what you have to do and what one has to do at work.',
        intro: {
          explanation:
            'Tener que + infinitive means to have to: tengo que, tienes que (tú), tiene que (usted, él, ella), tenemos que, tienen que (ustedes, ellos). Notice the change in tienes and tiene: the e becomes ie, but yo tengo has a g. The que is never dropped: tengo que trabajar. Hay que + infinitive has no subject: it is a general rule, like “you have to” or “one has to” in English. Reunión ends in -ión, so the stress falls on the last syllable and it carries an accent.',
          examples: [
            { target: 'Hoy tengo que trabajar hasta tarde.', base: 'Today I have to work late.' },
            {
              target: 'En la oficina hay que llegar a tiempo.',
              base: 'At the office you have to be on time.',
            },
          ],
        },
        takeaways: [
          'You say what you have to do with tengo que + infinitive.',
          'You state a general rule with hay que + infinitive.',
        ],
        exercises: [
          ex.translationChoice(
            'tengo que',
            'I have to',
            ['I can', 'I want', 'I have'],
            ['es-tengo-que'],
            { id: 'es.ex.shn1zo176h7awx' },
          ),
          ex.fillBlank(
            'Hoy ___ que trabajar hasta tarde.',
            'Today I have to work late.',
            'tengo',
            ['tienes', 'tiene', 'hay'],
            ['es-tengo-que'],
            {
              id: 'es.ex.2r0h3c9b59qj4l',
              explanation:
                'For I, the form is tengo que. Tienes que is for tú, tiene que for usted, él or ella, and hay que is a general rule.',
            },
          ),
          ex.listenChoice(
            'Tienes que trabajar mañana.',
            ['Tengo que trabajar mañana.', 'Tiene que trabajar mañana.'],
            ['es-tengo-que'],
            { id: 'es.ex.lm7ujrxsvx5i67' },
          ),
          ex.translationChoice(
            'hay que',
            'one has to',
            ['there is', 'I have to', 'I want'],
            ['es-hay-que'],
            { id: 'es.ex.0xk0ymi1qcuyoh' },
          ),
          ex.fillBlank(
            'En la oficina ___ que llegar a tiempo.',
            'At the office you have to be on time (a general rule).',
            'hay',
            ['es', 'está', 'va'],
            ['es-hay-que'],
            {
              id: 'es.ex.587a8kj023fd1s',
              explanation:
                'Hay que + infinitive states a general rule with no subject. On its own, hay means there is.',
            },
          ),
          ex.matchPairs(
            [
              ['tengo que', 'I have to'],
              ['hay que', 'one has to'],
              ['la reunión', 'the meeting'],
              ['el compañero de trabajo', 'the coworker'],
            ],
            ['es-tengo-que', 'es-hay-que', 'es-la-reunion', 'es-el-companero-de-trabajo'],
            { id: 'es.ex.hu3yxpaduifx7o' },
          ),
          ex.listenChoice(
            'La reunión es a las diez.',
            ['La reunión es a las doce.', 'La reunión es a las dos.'],
            ['es-la-reunion'],
            { id: 'es.ex.sa7fp45s9x2gm4' },
          ),
          ex.orderWords(
            'Tengo que ir a la reunión.',
            'I have to go to the meeting.',
            ['es-tengo-que', 'es-la-reunion'],
            { id: 'es.ex.aqpm06i6cb0u7e' },
          ),
          ex.translateWrite(
            'My coworker has to work on Saturday.',
            'Mi compañero de trabajo tiene que trabajar el sábado.',
            ['es-el-companero-de-trabajo', 'es-tengo-que'],
            {
              id: 'es.ex.vorkh6e8xlsfn0',
              acceptedAnswers: [
                'Mi compañera de trabajo tiene que trabajar el sábado.',
                'Mi compañero de trabajo tiene que trabajar los sábados.',
                'Mi compañera de trabajo tiene que trabajar los sábados.',
                'El sábado mi compañero de trabajo tiene que trabajar.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué tienes que hacer hoy?',
            'Say you have to go to a meeting (start with «Tengo que»).',
            'Tengo que ir a una reunión.',
            [
              'Tengo que ir a la reunión.',
              'Hoy tengo que ir a una reunión.',
              'Hoy tengo que ir a la reunión.',
              'Tengo que ir a una reunión',
            ],
            ['es-tengo-que', 'es-la-reunion'],
            { id: 'es.ex.vusidgskc2o68x' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '¿Puedo…?',
        objective: 'Say what you can and can’t do, and talk about exams.',
        intro: {
          explanation:
            'Poder + infinitive means can: puedo, puedes (tú), puede (usted, él, ella), podemos, pueden (ustedes, ellos). The o becomes ue in puedo, puedes, puede and pueden, but not in podemos. No puedo is I can’t. Aprobar un examen means to pass an exam (it does not mean to approve). In several Latin American countries, such as Mexico and Argentina, public universities are free or almost free.',
          examples: [
            {
              target: '¿Puedes venir mañana? — No, no puedo.',
              base: 'Can you come tomorrow? — No, I can’t.',
            },
            { target: 'Tengo que aprobar el examen.', base: 'I have to pass the exam.' },
          ],
        },
        takeaways: [
          'You say what you can or can’t do with puedo and no puedo.',
          'You talk about exams and university with el examen, aprobar and la universidad.',
        ],
        exercises: [
          ex.translationChoice('puedo', 'I can', ['I have to', 'I want', 'I go'], ['es-puedo'], {
            id: 'es.ex.ift8jkx3t5q7j3',
          }),
          ex.fillBlank(
            '¿___ venir a la reunión mañana?',
            'Can you come to the meeting tomorrow? (to a friend)',
            'Puedes',
            ['Puedo', 'Podemos', 'Tienes'],
            ['es-puedo', 'es-la-reunion'],
            {
              id: 'es.ex.iwq6r1r8es8pn9',
              explanation:
                'With tú the form is puedes, with ue like puedo. Tienes needs que: ¿tienes que venir?',
            },
          ),
          ex.listenChoice(
            'No puedo ir a la universidad.',
            ['No puedo ir a la reunión.', 'Tengo que ir a la universidad.'],
            ['es-puedo', 'es-la-universidad'],
            { id: 'es.ex.sikfsyri8ipt4f' },
          ),
          ex.translationChoice(
            'aprobar',
            'to pass (an exam)',
            ['to study', 'to fail', 'to travel'],
            ['es-aprobar'],
            { id: 'es.ex.m1weq9kehfnx86' },
          ),
          ex.fillBlank(
            'Mañana tengo un ___ de inglés.',
            'Tomorrow I have an English exam.',
            'examen',
            ['libro', 'cuaderno', 'país'],
            ['es-el-examen'],
            {
              id: 'es.ex.hbzwae3xooftj6',
              skill: 'vocabulary',
              explanation:
                'El examen is the exam. The x sounds like ks. In the plural the stress stays on the same syllable, so it needs an accent mark: los exámenes.',
            },
          ),
          ex.matchPairs(
            [
              ['puedo', 'I can'],
              ['la universidad', 'the university'],
              ['el examen', 'the exam'],
              ['aprobar', 'to pass (an exam)'],
            ],
            ['es-puedo', 'es-la-universidad', 'es-el-examen', 'es-aprobar'],
            { id: 'es.ex.acf20outksjp9s' },
          ),
          ex.fillBlank(
            'Mi hermana ___ estudiar en la universidad de Lima.',
            'My sister can study at the university in Lima.',
            'puede',
            ['puedes', 'puedo', 'podemos'],
            ['es-puedo', 'es-la-universidad'],
            {
              id: 'es.ex.8yjt6rsuxb5cg3',
              explanation: 'For él or ella the form is puede. Puedes is for tú, puedo for yo.',
            },
          ),
          ex.orderWords(
            'Hay que estudiar para aprobar el examen.',
            'You have to study to pass the exam.',
            ['es-hay-que', 'es-aprobar', 'es-el-examen'],
            { id: 'es.ex.w9f303p0uf7fvm' },
          ),
          ex.translateWrite(
            'I can’t go: I have an exam.',
            'No puedo ir: tengo un examen.',
            ['es-puedo', 'es-el-examen'],
            {
              id: 'es.ex.uq656ltx4xurc0',
              acceptedAnswers: [
                'No puedo ir, tengo un examen.',
                'No puedo ir. Tengo un examen.',
                'No puedo ir porque tengo un examen.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Puedes venir el sábado?',
            'A friend asks you. Say yes, you can (start with «Sí»).',
            'Sí, puedo.',
            [
              'Sí, puedo',
              'Sí, puedo ir.',
              'Sí, claro, puedo.',
              'Claro, sí, puedo.',
              'Sí, dale, puedo.',
              'Sí, puedo venir.',
            ],
            ['es-puedo'],
            { id: 'es.ex.y4qccm4jzxu8xa' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Desde hace tres años',
        objective: 'Say how long and since when you have been working or studying.',
        intro: {
          explanation:
            'To say how long something has been going on, Spanish uses the present tense, not a past form: trabajo acá desde hace tres años means I have been working here for three years. Use desde hace with a period of time (dos meses, un año) and desde alone with a starting point (desde marzo). Durante means during: durante la semana. To ask: ¿desde cuándo…?',
          examples: [
            {
              target: 'Estudio inglés desde hace dos años.',
              base: 'I’ve been studying English for two years.',
            },
            {
              target: 'Vivo en Bogotá desde enero.',
              base: 'I’ve lived in Bogotá since January.',
            },
          ],
        },
        takeaways: [
          'You say how long with the present tense + desde hace.',
          'You use desde with a starting point and durante for during.',
        ],
        exercises: [
          ex.translationChoice(
            'desde hace',
            'for (a period of time)',
            ['since', 'during', 'ago'],
            ['es-desde-hace'],
            { id: 'es.ex.i45lrzfc49asnt' },
          ),
          ex.fillBlank(
            'Trabajo acá ___ hace tres años.',
            'I’ve been working here for three years.',
            'desde',
            ['durante', 'en', 'por'],
            ['es-desde-hace'],
            {
              id: 'es.ex.krzx4xzuf8i0pg',
              explanation:
                'Desde hace + a period of time, with the verb in the present: trabajo acá desde hace tres años.',
            },
          ),
          ex.fillBlank(
            'Vivo en Bogotá desde ___.',
            'I’ve lived in Bogotá since January.',
            'enero',
            ['dos años', 'tres meses', 'mucho'],
            ['es-desde'],
            {
              id: 'es.ex.sywk70jwo93slb',
              explanation:
                'Desde alone goes with a starting point, like a month: desde enero. A period of time needs desde hace: desde hace dos años.',
            },
          ),
          ex.listenChoice(
            'Estudio inglés desde hace un año.',
            ['Estudio inglés desde enero.', 'Estudio inglés durante un año.'],
            ['es-desde-hace', 'es-desde'],
            { id: 'es.ex.tcox3xvo0u21u5' },
          ),
          ex.translationChoice('durante', 'during', ['since', 'before', 'after'], ['es-durante'], {
            id: 'es.ex.xhba0bgpbwf0pd',
          }),
          ex.fillBlank(
            '___ la semana trabajo en una oficina.',
            'During the week I work in an office.',
            'Durante',
            ['Desde hace', 'Hace', 'Desde'],
            ['es-durante'],
            {
              id: 'es.ex.rsfwojkvwqfrbr',
              explanation: 'Durante means during: durante la semana, durante las vacaciones.',
            },
          ),
          ex.matchPairs(
            [
              ['desde hace', 'for (a period of time)'],
              ['desde', 'since'],
              ['durante', 'during'],
              ['el título', 'the degree'],
            ],
            ['es-desde-hace', 'es-desde', 'es-durante', 'es-el-titulo'],
            { id: 'es.ex.jvw81mqm9a72bf' },
          ),
          ex.orderWords(
            'Tengo el título desde hace un año.',
            'I’ve had my degree for a year.',
            ['es-el-titulo', 'es-desde-hace'],
            { id: 'es.ex.wrgrncfz20lkkn' },
          ),
          ex.translateWrite(
            'I’ve been working in Lima for two years.',
            'Trabajo en Lima desde hace dos años.',
            ['es-desde-hace'],
            {
              id: 'es.ex.e95i2vxtg5m5b0',
              acceptedAnswers: [
                'Desde hace dos años trabajo en Lima.',
                'Hace dos años que trabajo en Lima.',
                'Yo trabajo en Lima desde hace dos años.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Desde cuándo estudias inglés?',
            'Say you have been studying English since March (use «desde»).',
            'Estudio inglés desde marzo.',
            [
              'Desde marzo.',
              'Desde marzo',
              'Estudio inglés desde marzo',
              'Desde marzo estudio inglés.',
            ],
            ['es-desde'],
            { id: 'es.ex.eqolx7e63se7pl' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'La entrevista',
        objective: 'Understand and answer questions in a job interview.',
        intro: {
          explanation:
            'In a job interview people usually speak with usted: ¿me trae su currículum?, ¿puede trabajar los sábados? With your coworkers you usually switch to tú. A pasantía is an internship for students, often paid (in Mexico people also say las prácticas). Pronunciation: c before a, o or u sounds like k (currículum, compañero), and before e or i like s (oficina, cine). The rr of currículum is trilled.',
          examples: [
            {
              target: 'Mañana tengo una entrevista de trabajo.',
              base: 'Tomorrow I have a job interview.',
            },
            {
              target: '¿Me trae su currículum, por favor?',
              base: 'Could you bring me your CV, please?',
            },
          ],
        },
        takeaways: [
          'You understand the typical questions of a job interview with usted.',
          'You talk about the CV, the salary, a job and an internship.',
        ],
        exercises: [
          ex.translationChoice(
            'la entrevista',
            'the interview',
            ['the meeting', 'the internship', 'the salary'],
            ['es-la-entrevista'],
            { id: 'es.ex.1dlndq2ivso6q2' },
          ),
          ex.matchPairs(
            [
              ['la entrevista', 'the interview'],
              ['el currículum', 'the CV'],
              ['el sueldo', 'the salary'],
              ['la pasantía', 'the internship'],
            ],
            ['es-la-entrevista', 'es-el-curriculum', 'es-el-sueldo', 'es-la-pasantia'],
            { id: 'es.ex.a256nnqkkdyoea' },
          ),
          ex.listenChoice(
            '¿Me trae su currículum, por favor?',
            ['¿Me trae su título, por favor?', '¿Me trae la cuenta, por favor?'],
            ['es-el-curriculum'],
            { id: 'es.ex.rrv6ruv9aefj1w' },
          ),
          ex.fillBlank(
            'Busco ___ en una oficina de Lima.',
            'I’m looking for work in an office in Lima.',
            'empleo',
            ['sueldo', 'examen', 'título'],
            ['es-el-empleo'],
            {
              id: 'es.ex.o9f9o7nyudrks2',
              skill: 'vocabulary',
              explanation:
                'El empleo is employment, a job. Busco empleo is what you say when you are looking for work.',
            },
          ),
          question(
            'es.ex.7gy4xdcf864k39',
            ENTREVISTA,
            'How long has Diego been working at the hotel?',
            'For two years',
            ['Since Monday', 'For a week', 'He doesn’t work there yet'],
            ['es-desde-hace'],
            'Diego says “Trabajo en un hotel de Bogotá desde hace dos años”: he has been working there for two years.',
          ),
          question(
            'es.ex.18a11579udbt88',
            ENTREVISTA,
            'What is a rule at this job?',
            'You have to work on Saturdays',
            ['You have to speak English', 'You can’t study', 'You have to work at night'],
            ['es-hay-que'],
            'Laura says “Acá hay que trabajar los sábados”: here you have to work on Saturdays.',
          ),
          question(
            'es.ex.k82l137ubcnzbg',
            ENTREVISTA,
            'What does Diego have to do on Monday mornings?',
            'Go to college',
            ['Work at the hotel', 'Bring his CV', 'Take an exam'],
            ['es-tengo-que', 'es-la-universidad'],
            'Diego says “los lunes tengo que ir a la facultad por la mañana”. La facultad is the school or faculty of a university.',
          ),
          question(
            'es.ex.ajp89vcr5zl57l',
            ENTREVISTA,
            'Why do Laura and Diego use usted?',
            'Because it is a job interview',
            ['Because they are old friends', 'Because they are family', 'Because Diego is a child'],
            ['es-la-entrevista'],
            'They say “¿Dónde trabaja?” and “¿Puede?”, the usted forms, as people usually do in an interview.',
          ),
          ex.translateWrite(
            'My sister is doing an internship at a bank.',
            'Mi hermana hace una pasantía en un banco.',
            ['es-la-pasantia'],
            {
              id: 'es.ex.rcbhoyhx0i8hjm',
              acceptedAnswers: [
                'Mi hermana está haciendo una pasantía en un banco.',
                'Mi hermana tiene una pasantía en un banco.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Puede trabajar los sábados?',
            'You are in a job interview. Say yes, you can (start with «Sí»).',
            'Sí, puedo.',
            [
              'Sí, puedo',
              'Sí, puedo trabajar los sábados.',
              'Sí, puedo trabajar.',
              'Sí, claro, puedo.',
            ],
            ['es-puedo', 'es-la-entrevista'],
            { id: 'es.ex.l13wa6xz4yd58f' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Un aviso y un mensaje',
        objective: 'Understand a job ad and a message about work and studies.',
        intro: {
          explanation:
            'A job ad tells you what you have to do (hay que…) and what the job offers. Si means if: si apruebo means if I pass. Words in -ión like reunión lose the accent mark in the plural (reuniones) but keep the stress in the same place.',
          examples: [
            {
              target: 'Hay que mandar el currículum antes del viernes.',
              base: 'You have to send your CV before Friday.',
            },
            {
              target: 'Si apruebo el examen, tengo el título.',
              base: 'If I pass the exam, I get my degree.',
            },
          ],
        },
        takeaways: [
          'You understand the requirements in a job ad.',
          'You talk about meetings, exams and your degree.',
        ],
        exercises: [
          question(
            'es.ex.5s07rutfaik7mb',
            AVISO,
            'Who is the internship for?',
            'University students',
            ['Teachers', 'Engineers with a degree', 'Children'],
            ['es-la-pasantia', 'es-la-universidad'],
            'The ad says “Buscamos estudiantes de la universidad para una pasantía”.',
          ),
          question(
            'es.ex.co6kktyibfnlon',
            AVISO,
            'What do you need for the internship?',
            'To speak English',
            ['To have a car', 'To work on Saturdays', 'To live in Lima'],
            ['es-hay-que'],
            'The ad says “Hay que hablar inglés”: you have to speak English.',
          ),
          question(
            'es.ex.ppqf30phvq073a',
            AVISO,
            'Is the internship paid?',
            'Yes, it has a salary',
            ['No, it isn’t paid', 'Only on Fridays', 'The ad doesn’t say'],
            ['es-el-sueldo'],
            'The ad says “tiene sueldo”: it comes with a salary.',
          ),
          question(
            'es.ex.gx8sc3hzmj1off',
            MENSAJE,
            'Why can’t Sofía go to the meeting?',
            'She has an exam at college',
            ['She is sick', 'She has a job interview', 'She is on holiday'],
            ['es-la-reunion', 'es-el-examen'],
            'Sofía writes “Hoy no puedo ir a la reunión de las cinco: tengo un examen en la facultad”.',
          ),
          question(
            'es.ex.7lavkujn10n4a7',
            MENSAJE,
            'What happens if Sofía passes?',
            'She gets her degree',
            ['She gets a new job', 'She starts an internship', 'She goes to the meeting'],
            ['es-aprobar', 'es-el-titulo'],
            'She writes “Si apruebo, ¡ya tengo el título!”: if I pass, I have my degree.',
          ),
          ex.listenChoice(
            'Hoy no puedo ir a la reunión.',
            ['Hoy no puedo ir a la universidad.', 'Hoy tengo que ir a la reunión.'],
            ['es-la-reunion', 'es-puedo'],
            { id: 'es.ex.81puhp87zqff28' },
          ),
          ex.fillBlank(
            'Si ___ el examen, tengo el título.',
            'If I pass the exam, I get my degree.',
            'apruebo',
            ['aprobar', 'tengo', 'puedo'],
            ['es-aprobar', 'es-el-titulo'],
            {
              id: 'es.ex.tfpi1pdji20e69',
              explanation:
                'Aprobar changes o to ue like poder: yo apruebo. The infinitive aprobar is used after tengo que or hay que.',
            },
          ),
          ex.orderWords(
            'Hay que hablar inglés para la pasantía.',
            'You have to speak English for the internship.',
            ['es-hay-que', 'es-la-pasantia'],
            { id: 'es.ex.qb8bz5boxmia4q' },
          ),
          ex.translateWrite(
            'I have to send my CV before Friday.',
            'Tengo que mandar el currículum antes del viernes.',
            ['es-tengo-que', 'es-el-curriculum'],
            {
              id: 'es.ex.d3hpef1d198dgw',
              acceptedAnswers: [
                'Tengo que mandar mi currículum antes del viernes.',
                'Tengo que mandar el CV antes del viernes.',
                'Tengo que mandar mi CV antes del viernes.',
                'Antes del viernes tengo que mandar el currículum.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Desde cuándo trabajas acá?',
            'Say you have been working here for three years (use «desde hace»).',
            'Trabajo acá desde hace tres años.',
            [
              'Desde hace tres años.',
              'Desde hace tres años',
              'Trabajo acá desde hace tres años',
              'Desde hace tres años trabajo acá.',
              'Trabajo aquí desde hace tres años.',
            ],
            ['es-desde-hace'],
            { id: 'es.ex.72i4suc80fzgmq' },
          ),
        ],
      },
    ],
  },
};

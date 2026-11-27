import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U5 «Work and studies» (docs/ES_B1.md §3): el presente de subjuntivo, presentado por
 * primera vez como sistema (formación regular: -ar → -e, -er/-ir → -a, desde la forma de yo; y los
 * irregulares frecuentes tenga, haga, sea, vaya, pueda, sepa, esté, dé) con deseo y necesidad: quiero
 * que, espero que, es importante que, es necesario que. Dos sujetos distintos → que + subjuntivo; un
 * solo sujeto o una regla general → infinitivo (quiero trabajar, es importante llegar a tiempo). El
 * correo formal (estimado / estimada + dos puntos, le escribo para…, atentamente) y usted en el trabajo
 * (la entrevista, la jefa que escribe al equipo con ustedes).
 * Pronunciación: la tilde de esté y dé (dé = give frente a de = of; esté frente a este); la c de
 * necesario y la z de ascenso suenan s (seseo); límite es esdrújula (LÍ-mi-te).
 * Variante: español neutro de Latinoamérica cercano a México, con tú entre compañeros y estudiantes y
 * usted en la entrevista y en el correo formal; ustedes para el equipo (nunca vosotros).
 * Cultura: «la carrera» es el programa universitario completo (cuatro o cinco años en Latinoamérica:
 * estudié la carrera de ingeniería); en una entrevista se habla de usted; el correo formal abre con
 * «Estimado/a…:» (dos puntos, no coma) y cierra con «Atentamente». Escenarios: Guadalajara, Monterrey,
 * Lima, Bogotá, Madrid.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ANUNCIO = reading(
  'es.stim.b1-u5-anuncio',
  'ad',
  'A job ad from a hotel in Guadalajara.',
  [
    'Hotel en Guadalajara busca recepcionista para el turno de la tarde.',
    'Es necesario que hable inglés y que tenga experiencia con clientes.',
    'También es importante que sepa usar la computadora y que pueda trabajar los sábados.',
    'El turno es de martes a sábado, de las dos de la tarde a las diez de la noche.',
    'El sueldo es de doce mil pesos al mes.',
    'Para solicitar el puesto, mande su currículum antes del 15 de marzo.',
  ],
  { title: 'Buscamos recepcionista' },
);

const ENTREVISTA = dialogue(
  'es.stim.b1-u5-entrevista',
  'A job interview at a company in Monterrey. Javier, the manager, and Valeria, the candidate, use usted.',
  [
    ['Javier', 'Buenos días, Valeria. Siéntese, por favor. ¿Qué carrera estudió?'],
    ['Valeria', 'Soy ingeniera. Terminé la carrera el año pasado en Monterrey.'],
    ['Javier', '¿Y por qué quiere trabajar con nosotros?'],
    ['Valeria', 'Porque es una empresa grande y me gusta mucho trabajar con clientes.'],
    [
      'Javier',
      'Bien. En este puesto va a hablar con clientes de Estados Unidos, así que es necesario que sepa inglés.',
    ],
    ['Valeria', 'No hay problema: viví dos años en Chicago y hablo inglés todos los días.'],
    ['Javier', 'Perfecto. Queremos contratar a alguien este mes. La llamo el viernes.'],
    ['Valeria', 'Muchas gracias, señor. Entonces espero que me llame el viernes.'],
  ],
  ES_B1_RATE,
);

const CORREO = reading(
  'es.stim.b1-u5-correo',
  'email',
  'Mónica, the head of a sales team in Bogotá, writes to her team.',
  [
    'Estimado equipo:',
    'Les escribo para contarles dos cosas importantes.',
    'Primero, como ya saben, Rodrigo renunció a su puesto la semana pasada porque se muda a Lima.',
    'Por eso, desde el lunes Paola es la nueva jefa del equipo: ¡felicidades por el ascenso, Paola!',
    'También, el informe del proyecto tiene una fecha límite: el viernes 20.',
    'Es necesario que cada uno haga su parte antes del jueves, porque quiero que lo revisemos juntos el viernes por la mañana.',
    'Muchas gracias por su trabajo.',
    'Atentamente, Mónica',
  ],
  { from: 'Mónica' },
);

const BECA = dialogue(
  'es.stim.b1-u5-beca',
  'Two university students in Lima talk about a scholarship.',
  [
    ['Carmen', 'Andrés, ¿ya viste la beca para estudiar un año en Madrid?'],
    ['Andrés', 'Sí, ¡quiero solicitarla! Pero no sé qué hay que hacer.'],
    [
      'Carmen',
      'Es necesario que tengas buenas notas y que escribas una carta en español y en inglés.',
    ],
    ['Andrés', '¿Y cuál es la fecha límite?'],
    ['Carmen', 'El 30 de abril. Es importante que mandes todo antes, así que tienes tres semanas.'],
    ['Andrés', 'Es poco tiempo… ¿Me ayudas con la carta en inglés?'],
    ['Carmen', 'Claro. ¡Espero que te den la beca!'],
    ['Andrés', 'Gracias. Si me la dan, ¡te invito a Madrid!'],
  ],
  ES_B1_RATE,
);

export const ES_B1_U05: EsUnitDef = {
  names: [
    'Javier',
    'Valeria',
    'Mónica',
    'Rodrigo',
    'Paola',
    'Carmen',
    'Andrés',
    'Chicago',
    'Guadalajara',
    'Monterrey',
    'Bogotá',
    'Lima',
    'Madrid',
    'Estados',
    'Unidos',
  ],
  support: [
    // Presente de subjuntivo (formas nuevas)
    'trabaje',
    'trabajen',
    'tengan',
    'hable',
    'mande',
    'escribas',
    'revisemos',
    'contrate',
    'consiga',
    'sea',
    'vaya',
    'sepa',
    'esté',
    'haga',
    'den',
    'llame',
    // Otras formas verbales
    'siéntese',
    'estudié',
    'estudió',
    'renunció',
    'solicitarla',
    'usar',
    'dar',
    'sabe',
    'estar',
    'viví',
    'queremos',
    'escribe',
    'saben',
    'muda',
    'ayudas',
    // Léxico
    'recepcionista',
    'ingeniería',
    'informe',
    'felicidades',
    'parte',
    'contarles',
    'así',
    'información',
  ],
  unit: {
    position: 5,
    title: 'Work and studies',
    titleEn: 'Trabajo y estudios',
    description:
      'Meet the present subjunctive: say what you want or hope others will do (quiero que, espero que) and what is important or necessary (es importante que, es necesario que), apply for a job, get through an interview with usted and write a formal email.',
    emoji: '💼',
    objective:
      'You can apply for a job or a scholarship, introduce yourself in an interview using usted, say what you want, hope or need others to do with the subjunctive, and write a short formal email.',
    grammar: {
      title: 'Present subjunctive · quiero que, espero que, es importante / necesario que',
      explanation:
        'Spanish has a verb mood called the subjunctive. At B1 you use it after expressions of wanting, hoping and necessity when the sentence has two different subjects: quiero que trabajes (I want you to work). English uses an infinitive here (I want you to work); Spanish needs que + subjunctive. With only one subject, or with a general rule, keep the infinitive: quiero trabajar (I want to work), es importante llegar a tiempo (it is important to be on time), but es importante que llegues a tiempo (it is important that you are on time). How to form it: take the yo form of the present, drop the -o and switch the vowel. -ar verbs take e: hablo → hable, hables, hable, hablemos, hablen; -er and -ir verbs take a: como → coma, vivo → viva. Because it starts from the yo form, irregular stems carry over: tengo → tenga, hago → haga, puedo → pueda, conozco → conozca. A few verbs must be learned by heart: ser → sea, ir → vaya, saber → sepa, estar → esté, dar → dé (with an accent to tell it apart from de, of). Spelling keeps the sound: llegar → llegue, buscar → busque. The usted form of the subjunctive is the same as the él / ella form, which is why it also appears in formal requests and ads: mande su currículum. In a formal email, start with Estimado señor: or Estimada señora: (a colon, not a comma), state your purpose with le escribo para + infinitive, and close with Atentamente.',
      examples: [
        {
          target: 'Quiero que hables con el cliente hoy.',
          base: 'I want you to talk to the client today.',
        },
        {
          target: 'Es necesario que sepa inglés para este puesto.',
          base: 'You need to know English for this position. (formal)',
        },
        { target: 'Espero que te den la beca.', base: 'I hope they give you the scholarship.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U5), redactado 2026-11-27. Sin revisión nativa. Revisar: (1) la presentación del subjuntivo como «yo del presente sin -o + vocal contraria» (simplificación pedagógica: falla con ser, ir, saber, estar, dar, que se dan aparte); (2) «quiero que» traducido «I want (someone) to» (en las respuestas se acepta «I want you to»); (3) «es necesario que sepa inglés» con usted implícito, sin pronombre: comprobar que no resulte ambiguo (él / ella / usted) en las consignas; (4) «estar contento» frente a «ser» en el ejercicio «es importante que el cliente esté contento»; (5) «la carrera» como programa universitario (en España también «la carrera»; en México «la licenciatura» es más formal: ¿enseñarla en apoyo?); (6) «el turno de la tarde» de 14 a 22 h: ¿«turno vespertino» en anuncios mexicanos?; (7) «Siéntese, por favor» en la entrevista y «La llamo el viernes» (la = usted, mujer); (8) el anuncio usa usted («mande su currículum»): en México muchos anuncios tutean; (9) «notas» frente a «calificaciones» (México): se eligió «notas» por panhispánico; (10) «felicidades por el ascenso» frente a «felicitaciones» (más común en el Cono Sur); (11) «renunciar a su puesto» (con a); (12) el correo de la jefa cierra con «Atentamente» aunque es a su propio equipo: quizás «Saludos» es más natural internamente, pero se mantuvo para practicar la palabra.',
    },
    words: [
      w(
        'es-quiero-que',
        'quiero que',
        'I want (someone) to',
        'Quiero que hables con el cliente hoy.',
        'I want you to talk to the client today.',
        ['b1', 'subjunctive', 'wishes'],
        { acceptedTranslations: ['I want you to', 'I want that'] },
      ),
      w(
        'es-espero-que',
        'espero que',
        'I hope (that)',
        'Espero que tengas suerte en la entrevista.',
        'I hope you have good luck in the interview.',
        ['b1', 'subjunctive', 'wishes'],
        { acceptedTranslations: ['I hope'] },
      ),
      w(
        'es-es-importante-que',
        'es importante que',
        "it's important that",
        'Es importante que llegues a tiempo a tu turno.',
        'It’s important that you get to your shift on time.',
        ['b1', 'subjunctive', 'necessity'],
        { acceptedTranslations: ['it is important that'] },
      ),
      w(
        'es-es-necesario-que',
        'es necesario que',
        "it's necessary that",
        'Es necesario que sepa inglés para este puesto.',
        'You need to know English for this position. (formal)',
        ['b1', 'subjunctive', 'necessity'],
        { acceptedTranslations: ['it is necessary that'] },
      ),
      w(
        'es-el-jefe',
        'el jefe',
        'the boss',
        'Mi jefe quiere que trabaje el sábado.',
        'My boss wants me to work on Saturday.',
        ['b1', 'work'],
        { acceptedTranslations: ['the manager'], acceptedTexts: ['la jefa'], emoji: '👔' },
      ),
      w(
        'es-el-puesto',
        'el puesto',
        'the position (job)',
        'Quiero solicitar el puesto de recepcionista.',
        'I want to apply for the receptionist position.',
        ['b1', 'work'],
        { acceptedTranslations: ['the job', 'the post'] },
      ),
      w(
        'es-solicitar',
        'solicitar',
        'to apply for',
        'Voy a solicitar una beca para estudiar en Madrid.',
        'I’m going to apply for a scholarship to study in Madrid.',
        ['b1', 'work', 'studies'],
        { acceptedTranslations: ['to request'] },
      ),
      w(
        'es-contratar',
        'contratar',
        'to hire',
        'La empresa va a contratar a tres ingenieros.',
        'The company is going to hire three engineers.',
        ['b1', 'work'],
        { acceptedTranslations: ['to employ'] },
      ),
      w(
        'es-la-carrera',
        'la carrera',
        'the degree (course)',
        'Estudié la carrera de ingeniería en Monterrey.',
        'I did my engineering degree in Monterrey.',
        ['b1', 'studies'],
        { acceptedTranslations: ['the career', 'the degree'], emoji: '🎓' },
      ),
      w(
        'es-la-beca',
        'la beca',
        'the scholarship',
        'Mi hermana tiene una beca para estudiar en Bogotá.',
        'My sister has a scholarship to study in Bogotá.',
        ['b1', 'studies'],
        { acceptedTranslations: ['the grant'] },
      ),
      w(
        'es-el-cliente',
        'el cliente',
        'the client',
        'Hoy tengo una reunión con un cliente de Lima.',
        'Today I have a meeting with a client from Lima.',
        ['b1', 'work'],
        { acceptedTranslations: ['the customer'], acceptedTexts: ['la cliente', 'la clienta'] },
      ),
      w(
        'es-estimado',
        'estimado',
        'dear (formal)',
        'Estimada señora: Le escribo para solicitar información.',
        'Dear Madam, I am writing to request information.',
        ['b1', 'formal'],
        { acceptedTexts: ['estimada'] },
      ),
      w(
        'es-atentamente',
        'atentamente',
        'sincerely',
        'Gracias por su tiempo. Atentamente, Valeria.',
        'Thank you for your time. Sincerely, Valeria.',
        ['b1', 'formal'],
        { acceptedTranslations: ['yours sincerely', 'yours faithfully', 'kind regards'] },
      ),
      w(
        'es-la-fecha-limite',
        'la fecha límite',
        'the deadline',
        'La fecha límite para solicitar la beca es el 30 de abril.',
        'The deadline to apply for the scholarship is April 30.',
        ['b1', 'work', 'studies'],
        { emoji: '📅' },
      ),
      w(
        'es-renunciar',
        'renunciar',
        'to resign',
        'Rodrigo quiere renunciar porque el sueldo es muy bajo.',
        'Rodrigo wants to quit because the salary is very low.',
        ['b1', 'work'],
        { acceptedTranslations: ['to quit'] },
      ),
      w(
        'es-el-turno',
        'el turno',
        'the shift',
        'Esta semana tengo el turno de la noche.',
        'This week I have the night shift.',
        ['b1', 'work'],
      ),
      w(
        'es-el-ascenso',
        'el ascenso',
        'the promotion',
        'Paola es la nueva jefa: ¡felicidades por el ascenso!',
        'Paola is the new boss: congratulations on the promotion!',
        ['b1', 'work'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Quiero que…',
        objective:
          'Say what you want or hope someone else will do with quiero que and espero que + subjunctive.',
        intro: {
          explanation:
            'Compare quiero trabajar (I want to work: one subject) with quiero que trabajes (I want you to work: two subjects). When the person who wants and the person who acts are different, Spanish uses que + a new verb form, the present subjunctive. English says I want you to…, Spanish says literally “I want that you work”. To form it, take the yo form of the present, drop the -o and swap the vowel: -ar verbs take e (trabajo → trabaje, trabajes), -er and -ir verbs take a (como → coma, vivo → viva). Irregular yo forms carry over: tengo → tenga, tengas. Espero que works the same way: espero que tengas un buen día. You already know one subjunctive: ojalá que no llueva. A few forms are special: dar → dé, den (espero que me den el puesto).',
          examples: [
            {
              target: 'Mi jefe quiere que llegue a las ocho.',
              base: 'My boss wants me to arrive at eight.',
            },
            { target: 'Espero que tengas un buen día.', base: 'I hope you have a good day.' },
          ],
        },
        takeaways: [
          'You say what you want someone else to do with quiero que + subjunctive.',
          'You form the regular subjunctive from the yo form: trabajo → trabaje, tengo → tenga.',
        ],
        exercises: [
          ex.translationChoice(
            'quiero que',
            'I want (someone) to',
            ['I want to', 'I hope (that)', 'I think that'],
            ['es-quiero-que'],
            { id: 'es.ex.oy1m9bxfkahagy' },
          ),
          ex.fillBlank(
            'Mi jefe quiere que ___ a las ocho.',
            'My boss wants me to arrive at eight.',
            'llegue',
            ['llego', 'llegar', 'llegaste'],
            ['es-quiero-que', 'es-el-jefe'],
            {
              id: 'es.ex.xqjxjetk8e2q11',
              explanation:
                'Two subjects (my boss wants / I arrive), so que + subjunctive: llegue. The g becomes gu to keep the hard sound: llegar → llegue.',
            },
          ),
          ex.listenChoice(
            'Quiero que trabajes el sábado.',
            ['Quiero trabajar el sábado.', 'Quiero que trabajen el sábado.'],
            ['es-quiero-que'],
            { id: 'es.ex.txe5eno1orhgbv' },
          ),
          ex.translationChoice(
            'espero que',
            'I hope (that)',
            ['I’m sure that', 'I want (someone) to', 'I think that'],
            ['es-espero-que'],
            { id: 'es.ex.8cv41wuqy3gsix' },
          ),
          ex.fillBlank(
            'Espero que ___ un buen día.',
            'I hope you have a good day.',
            'tengas',
            ['tienes', 'tener', 'tengo'],
            ['es-espero-que'],
            {
              id: 'es.ex.m94ls9oe5rkfid',
              explanation:
                'Espero que + subjunctive. The yo form tengo gives the subjunctive tenga, tengas (tú). Tienes is the ordinary present.',
            },
          ),
          ex.matchPairs(
            [
              ['quiero que', 'I want (someone) to'],
              ['espero que', 'I hope (that)'],
              ['el jefe', 'the boss'],
              ['el puesto', 'the position (job)'],
            ],
            ['es-quiero-que', 'es-espero-que', 'es-el-jefe', 'es-el-puesto'],
            { id: 'es.ex.9ys56tdpl29dbr' },
          ),
          ex.fillBlank(
            'Espero que me ___ el puesto.',
            'I hope they give me the job.',
            'den',
            ['dan', 'dar'],
            ['es-espero-que', 'es-el-puesto'],
            {
              id: 'es.ex.aayd1y6oxs4iti',
              explanation:
                'Dar has a short subjunctive: dé, des, dé, demos, den. Here “they” give, so den. Dan is the ordinary present.',
            },
          ),
          ex.orderWords(
            'Quiero que hables con el jefe.',
            'I want you to talk to the boss.',
            ['es-quiero-que', 'es-el-jefe'],
            { id: 'es.ex.bgy78jx9yen3jr' },
          ),
          ex.translateWrite(
            'I hope you get the job.',
            'Espero que consigas el puesto.',
            ['es-espero-que', 'es-el-puesto'],
            {
              id: 'es.ex.ddqjinf783ky4j',
              acceptedAnswers: [
                'Espero que te den el puesto.',
                'Ojalá que consigas el puesto.',
                'Espero que consigas el trabajo.',
                'Espero que tengas el puesto.',
                'Ojalá consigas el puesto.',
                'Espero que te den el trabajo.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué quiere tu jefe?',
            'Say your boss wants you to work on Saturday (start with «Quiere que»).',
            'Quiere que trabaje el sábado.',
            [
              'Quiere que trabaje el sábado',
              'Quiere que trabaje los sábados.',
              'Mi jefe quiere que trabaje el sábado.',
              'Quiere que yo trabaje el sábado.',
              'Quiere que trabaje este sábado.',
            ],
            ['es-quiero-que', 'es-el-jefe'],
            { id: 'es.ex.u5g5fb0s1wg9fo' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Es importante que…',
        objective:
          'Say what is important or necessary for a job with es importante que and es necesario que, and use the most common irregular subjunctives.',
        intro: {
          explanation:
            'Es importante que and es necesario que are followed by the subjunctive when they talk about a specific person: es importante que llegues a tiempo (that you are on time). For a general rule, use the infinitive: es importante llegar a tiempo. Some very common verbs have irregular subjunctives that you need to learn now: ser → sea, ir → vaya, saber → sepa, estar → esté, hacer → haga, poder → pueda, tener → tenga. Job ads use them a lot, often with usted, whose form is the same as él / ella: es necesario que sepa inglés. Esté has an accent mark (esté, not este, this). El turno is a work shift: el turno de la mañana, de la tarde, de la noche.',
          examples: [
            {
              target: 'Es importante que llegues a tiempo a tu turno.',
              base: 'It’s important that you get to your shift on time.',
            },
            {
              target: 'Es necesario que sepa inglés.',
              base: 'You need to know English. (formal)',
            },
          ],
        },
        takeaways: [
          'You say what is necessary or important for someone with es necesario / importante que + subjunctive.',
          'You recognize the irregular subjunctives sea, vaya, sepa, esté, haga, pueda and tenga.',
        ],
        exercises: [
          ex.translationChoice(
            'es necesario que',
            "it's necessary that",
            ["it's important that", "it's possible that", 'I want (someone) to'],
            ['es-es-necesario-que'],
            { id: 'es.ex.c6j1tecj3lr3yu' },
          ),
          ex.fillBlank(
            'Es necesario que ___ inglés para este puesto.',
            'You need to know English for this position. (formal)',
            'sepa',
            ['sabe', 'saber'],
            ['es-es-necesario-que', 'es-el-puesto'],
            {
              id: 'es.ex.hih0hnltlsyo50',
              explanation:
                'Saber has an irregular subjunctive: sepa, sepas, sepa… With usted the form is sepa. Sabe is the ordinary present.',
            },
          ),
          ex.listenChoice(
            'Es importante que llegues a tiempo.',
            ['Es importante llegar a tiempo.', 'Es importante que llegue a tiempo.'],
            ['es-es-importante-que'],
            { id: 'es.ex.nbknktpjwvl1ph' },
          ),
          ex.fillBlank(
            'Es importante que el cliente ___ contento.',
            'It’s important that the customer is happy.',
            'esté',
            ['está', 'sea', 'estar'],
            ['es-es-importante-que', 'es-el-cliente'],
            {
              id: 'es.ex.3ep0f5k193wx4z',
              explanation:
                'Contento goes with estar, and after es importante que you need the subjunctive of estar: esté (with an accent). Sea is the subjunctive of ser.',
            },
          ),
          ex.fillBlank(
            'Es necesario que ___ al banco hoy.',
            'It’s necessary that you go to the bank today.',
            'vayas',
            ['vas', 'ir', 'fuiste'],
            ['es-es-necesario-que'],
            {
              id: 'es.ex.oiqrjbwg0uqhje',
              explanation:
                'Ir has an irregular subjunctive: vaya, vayas (tú), vaya… Vas is the ordinary present.',
            },
          ),
          ex.matchPairs(
            [
              ['es necesario que', "it's necessary that"],
              ['solicitar', 'to apply for'],
              ['el cliente', 'the client'],
              ['el turno', 'the shift'],
            ],
            ['es-es-necesario-que', 'es-solicitar', 'es-el-cliente', 'es-el-turno'],
            { id: 'es.ex.cmo38x0in4enlr' },
          ),
          question(
            'es.ex.01eppl4n2z472d',
            ANUNCIO,
            'Which shift is the job for?',
            'The afternoon shift, from 2 to 10 p.m.',
            ['The morning shift', 'The night shift, from 10 p.m.', 'Only weekends'],
            ['es-el-turno'],
            'The ad says “busca recepcionista para el turno de la tarde” and “de las dos de la tarde a las diez de la noche”.',
          ),
          question(
            'es.ex.cytv6jr6tt8iqj',
            ANUNCIO,
            'What is necessary for the job?',
            'Speaking English and having experience with customers',
            ['Having a university degree', 'Living in the center', 'Working on Sundays'],
            ['es-es-necesario-que', 'es-el-cliente'],
            'The ad says “Es necesario que hable inglés y que tenga experiencia con clientes”. Hable and tenga are subjunctives.',
          ),
          ex.translateWrite(
            'It’s important that you get to your shift on time.',
            'Es importante que llegues a tiempo a tu turno.',
            ['es-es-importante-que', 'es-el-turno'],
            {
              id: 'es.ex.9jybf5h28q4p2d',
              acceptedAnswers: [
                'Es importante que llegues a tu turno a tiempo.',
                'Es importante que llegues temprano a tu turno.',
                'Es importante que llegue a tiempo a su turno.',
                'Es importante que usted llegue a tiempo a su turno.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué es necesario para el puesto?',
            'Say it is necessary that the person speaks English (start with «Es necesario que»).',
            'Es necesario que hable inglés.',
            [
              'Es necesario que hable inglés',
              'Es necesario que sepa inglés.',
              'Es necesario que hable inglés muy bien.',
              'Es necesario que hables inglés.',
              'Es necesario que sepas inglés.',
            ],
            ['es-es-necesario-que', 'es-el-puesto'],
            { id: 'es.ex.lkyu66zvj9rsi4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'La entrevista',
        objective:
          'Introduce yourself in a job interview using usted and talk about your degree and your experience.',
        intro: {
          explanation:
            'In a job interview people use usted, which takes the él / ella forms: ¿Qué carrera estudió? (What did you study?), ¿Por qué quiere trabajar con nosotros? La carrera is your university degree program (four or five years in most of Latin America): estudié la carrera de ingeniería. It can also mean career. Contratar is to hire; when you hire a person, add the personal a: contratar a dos ingenieros. Polite commands to usted use the subjunctive form too: siéntese, por favor (sit down, please).',
          examples: [
            { target: '¿Qué carrera estudió usted?', base: 'What did you study? (formal)' },
            {
              target: 'La empresa quiere contratar a dos ingenieros.',
              base: 'The company wants to hire two engineers.',
            },
          ],
        },
        takeaways: [
          'You answer interview questions about your degree and experience with usted.',
          'You talk about hiring with contratar a + person.',
        ],
        exercises: [
          ex.translationChoice(
            'contratar',
            'to hire',
            ['to apply for', 'to pay', 'to meet'],
            ['es-contratar'],
            { id: 'es.ex.21nh6fe7kf96ko' },
          ),
          ex.fillBlank(
            'Terminé la ___ de medicina el año pasado.',
            'I finished my medical degree last year.',
            'carrera',
            ['oficina', 'entrevista', 'reunión'],
            ['es-la-carrera'],
            {
              id: 'es.ex.cpxytyt4b0v5ns',
              skill: 'vocabulary',
              explanation:
                'La carrera is the whole university program: la carrera de medicina, de ingeniería. El título is the diploma you get at the end.',
            },
          ),
          ex.listenChoice(
            '¿Qué carrera estudió?',
            ['¿Qué carrera estudias?', '¿Dónde estudió?'],
            ['es-la-carrera'],
            { id: 'es.ex.pt9crku6987xs1' },
          ),
          question(
            'es.ex.49qsb90ukafenz',
            ENTREVISTA,
            'What did Valeria study?',
            'Engineering',
            ['Medicine', 'English', 'She didn’t go to university'],
            ['es-la-carrera'],
            'Valeria answers “Soy ingeniera. Terminé la carrera el año pasado”.',
          ),
          question(
            'es.ex.rn2droxzpa58m0',
            ENTREVISTA,
            'Why does Valeria need to know English?',
            'She will talk to clients from the United States',
            [
              'She will live in Chicago',
              'Her boss doesn’t speak Spanish',
              'She has to write the reports in English',
            ],
            ['es-es-necesario-que', 'es-el-cliente'],
            'Javier says “va a hablar con clientes de Estados Unidos, así que es necesario que sepa inglés”.',
          ),
          question(
            'es.ex.bhw20ahxce4qsn',
            ENTREVISTA,
            'What does Javier say at the end?',
            'They want to hire someone this month and he will call her on Friday',
            [
              'She has the job and starts on Monday',
              'They don’t want to hire anyone this year',
              'She has to come back for another interview tomorrow',
            ],
            ['es-contratar'],
            'Javier says “Queremos contratar a alguien este mes. La llamo el viernes.” La is the object pronoun for usted when you speak to a woman.',
          ),
          ex.fillBlank(
            'La empresa quiere ___ a dos ingenieros.',
            'The company wants to hire two engineers.',
            'contratar',
            ['trabajar', 'solicitar', 'llegar'],
            ['es-contratar'],
            {
              id: 'es.ex.n737g1mov2azrw',
              explanation:
                'Contratar a + person: to hire someone. Solicitar is what the candidate does (to apply for a job), not the company.',
            },
          ),
          ex.matchPairs(
            [
              ['contratar', 'to hire'],
              ['la carrera', 'the degree (course)'],
              ['el cliente', 'the client'],
              ['solicitar', 'to apply for'],
            ],
            ['es-contratar', 'es-la-carrera', 'es-el-cliente', 'es-solicitar'],
            { id: 'es.ex.lsrwhs8mjaux44' },
          ),
          ex.translateWrite(
            'I hope the company hires me.',
            'Espero que la empresa me contrate.',
            ['es-espero-que', 'es-contratar'],
            {
              id: 'es.ex.r8sb91fychdojj',
              acceptedAnswers: [
                'Espero que me contrate la empresa.',
                'Ojalá que la empresa me contrate.',
                'Ojalá la empresa me contrate.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué carrera estudió?',
            'You are in a job interview. Say you studied engineering (start with «Estudié»).',
            'Estudié ingeniería.',
            [
              'Estudié ingeniería',
              'Estudié la carrera de ingeniería.',
              'Estudié ingeniería en la universidad.',
              'Estudié la carrera de ingeniería',
            ],
            ['es-la-carrera'],
            { id: 'es.ex.8rp4bukrmbqo0c' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Le escribo para…',
        objective:
          'Understand and write a formal work email, and talk about deadlines, promotions and resigning.',
        intro: {
          explanation:
            'A formal email in Spanish opens with Estimado señor: or Estimada señora: (estimado agrees with the person, and a colon follows, not a comma). To a group: Estimados señores: or Estimado equipo:. State why you are writing with le escribo para + infinitive (les escribo to several people, using ustedes). Close with Atentamente (Sincerely) and your name. Renunciar a means to resign from: renunciar a un puesto. Careful with el ascenso (promotion): el ascensor is the elevator.',
          examples: [
            {
              target: 'Estimada señora: Le escribo para solicitar el puesto.',
              base: 'Dear Madam, I am writing to apply for the position.',
            },
            {
              target: 'Rodrigo renunció a su puesto la semana pasada.',
              base: 'Rodrigo resigned from his position last week.',
            },
          ],
        },
        takeaways: [
          'You write a formal email with estimado, le escribo para… and atentamente.',
          'You talk about deadlines, promotions and resigning from a job.',
        ],
        exercises: [
          ex.translationChoice(
            'el ascenso',
            'the promotion',
            ['the elevator', 'the shift', 'the deadline'],
            ['es-el-ascenso'],
            { id: 'es.ex.s6uqehyx9t88vo' },
          ),
          ex.fillBlank(
            '___ señora Pérez: Le escribo para solicitar el puesto.',
            'Dear Mrs. Pérez, I am writing to apply for the position.',
            'Estimada',
            ['Estimado', 'Atentamente', 'Hola'],
            ['es-estimado', 'es-solicitar'],
            {
              id: 'es.ex.t7u3a77xm44qrg',
              explanation:
                'Estimado agrees with the person: estimado señor, estimada señora. Atentamente goes at the end of the email, and hola is too informal here.',
            },
          ),
          ex.listenChoice(
            'Le escribo para solicitar el puesto.',
            ['Le escribo para renunciar al puesto.', 'Les escribo para solicitar el puesto.'],
            ['es-solicitar', 'es-renunciar'],
            { id: 'es.ex.ovb92x3tuwjf6c' },
          ),
          ex.fillBlank(
            'Si no me dan el ascenso, voy a ___.',
            'If they don’t give me the promotion, I’m going to quit.',
            'renunciar',
            ['contratar', 'solicitar', 'llegar'],
            ['es-renunciar', 'es-el-ascenso'],
            {
              id: 'es.ex.m3m8naf2igq0k5',
              explanation:
                'Renunciar is to resign or quit a job (renunciar a un puesto). Contratar is what the company does when it hires you.',
            },
          ),
          question(
            'es.ex.z5ozka5hzpczo2',
            CORREO,
            'Why is Rodrigo leaving the team?',
            'He resigned because he is moving to Lima',
            ['He got a promotion', 'The company didn’t want him', 'He is going to study in Bogotá'],
            ['es-renunciar'],
            'Mónica writes “Rodrigo renunció a su puesto la semana pasada porque se muda a Lima”.',
          ),
          question(
            'es.ex.ieoglw7f7udjet',
            CORREO,
            'What happened to Paola?',
            'She got a promotion: she is the new head of the team',
            ['She resigned', 'She is moving to Lima', 'She has to write the whole report'],
            ['es-el-ascenso', 'es-el-jefe'],
            'Mónica writes “Paola es la nueva jefa del equipo: ¡felicidades por el ascenso, Paola!”.',
          ),
          question(
            'es.ex.apc2azoqluz7rd',
            CORREO,
            'When is the deadline for the report?',
            'Friday the 20th',
            ['Thursday', 'Monday', 'Next week'],
            ['es-la-fecha-limite', 'es-quiero-que'],
            'The deadline is “el viernes 20”. Thursday is the day for each person to finish their part, so that they can check it together on Friday.',
          ),
          ex.matchPairs(
            [
              ['estimado', 'dear (formal)'],
              ['atentamente', 'sincerely'],
              ['la fecha límite', 'the deadline'],
              ['renunciar', 'to resign'],
            ],
            ['es-estimado', 'es-atentamente', 'es-la-fecha-limite', 'es-renunciar'],
            { id: 'es.ex.3y1arsb81169lz' },
          ),
          ex.translateWrite(
            'It’s important that you send the report before the deadline.',
            'Es importante que mandes el informe antes de la fecha límite.',
            ['es-es-importante-que', 'es-la-fecha-limite'],
            {
              id: 'es.ex.bzmjx06o1znatp',
              acceptedAnswers: [
                'Es importante que mande el informe antes de la fecha límite.',
                'Es importante que envíes el informe antes de la fecha límite.',
                'Es importante que envíe el informe antes de la fecha límite.',
                'Es importante que mandes el reporte antes de la fecha límite.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Para qué le escribe a la empresa?',
            'In a formal email, say you are writing to apply for the position (start with «Le escribo para»).',
            'Le escribo para solicitar el puesto.',
            [
              'Le escribo para solicitar el puesto',
              'Le escribo para solicitar el puesto de trabajo.',
              'Les escribo para solicitar el puesto.',
            ],
            ['es-solicitar', 'es-el-puesto'],
            { id: 'es.ex.5916bflkafezls' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'La beca',
        objective:
          'Understand a conversation about a scholarship and a job ad, and use the subjunctive to talk about requirements and wishes.',
        intro: {
          explanation:
            'La beca is a scholarship or grant: solicitar una beca (to apply for a scholarship). Requirements are often given with es necesario que + subjunctive: es necesario que tengas buenas notas (las notas = grades). Wishes and good luck use espero que: ¡espero que te den la beca! When a pronoun goes with an infinitive, it is attached to the end: quiero solicitarla (la = la beca).',
          examples: [
            {
              target: 'Quiero solicitar una beca para estudiar en Madrid.',
              base: 'I want to apply for a scholarship to study in Madrid.',
            },
            {
              target: 'Es necesario que tengas buenas notas.',
              base: 'You need to have good grades.',
            },
          ],
        },
        takeaways: [
          'You understand the requirements and the deadline for a scholarship.',
          'You wish someone luck with espero que + subjunctive.',
        ],
        exercises: [
          ex.translationChoice(
            'la beca',
            'the scholarship',
            ['the degree (course)', 'the internship', 'the deadline'],
            ['es-la-beca'],
            { id: 'es.ex.zrlwl4qgj3gzop' },
          ),
          question(
            'es.ex.4etjcq0amcue00',
            BECA,
            'What does Andrés want to do?',
            'Apply for a scholarship to study in Madrid for a year',
            ['Get a job in Madrid', 'Study English in Lima', 'Visit Carmen in Madrid'],
            ['es-la-beca', 'es-solicitar'],
            'Carmen asks about “la beca para estudiar un año en Madrid” and Andrés answers “¡quiero solicitarla!”: la = la beca.',
          ),
          question(
            'es.ex.4x4zr3agls509o',
            BECA,
            'What is necessary for the scholarship?',
            'Good grades and a letter in Spanish and English',
            [
              'A job interview in English',
              'Two years of work experience',
              'A letter from a teacher',
            ],
            ['es-es-necesario-que', 'es-la-beca'],
            'Carmen says “Es necesario que tengas buenas notas y que escribas una carta en español y en inglés”.',
          ),
          question(
            'es.ex.f5tref5ytmulqg',
            BECA,
            'How long does Andrés have before the deadline?',
            'Three weeks',
            ['Three days', 'Until May', 'One year'],
            ['es-la-fecha-limite', 'es-espero-que'],
            'The deadline is April 30, and Carmen says “así que tienes tres semanas”.',
          ),
          ex.listenChoice(
            'Es necesario que tengas buenas notas.',
            ['Es necesario que tengan buenas notas.', 'Es importante que tengas buenas notas.'],
            ['es-es-necesario-que'],
            { id: 'es.ex.vpylcb5cqqjk5e' },
          ),
          ex.fillBlank(
            'Es importante que ___ la carta antes de la fecha límite.',
            'It’s important that you send the letter before the deadline.',
            'mandes',
            ['mandas', 'mandar', 'mandaste'],
            ['es-es-importante-que', 'es-la-fecha-limite'],
            {
              id: 'es.ex.q6guna6l0ldfxj',
              explanation:
                'Mandar is a regular -ar verb: mando → mande, mandes (tú). After es importante que + a specific person, use the subjunctive.',
            },
          ),
          question(
            'es.ex.yme6deb8ehjzhf',
            ANUNCIO,
            'How do you apply for the job in the hotel ad?',
            'Send your CV before March 15',
            [
              'Go to the hotel on Saturday',
              'Call the hotel in the afternoon',
              'Write a letter in English',
            ],
            ['es-solicitar', 'es-el-puesto'],
            'The ad ends with “Para solicitar el puesto, mande su currículum antes del 15 de marzo”. Mande is the usted form (a subjunctive).',
          ),
          ex.orderWords(
            'Quiero solicitar una beca para estudiar en Madrid.',
            'I want to apply for a scholarship to study in Madrid.',
            ['es-solicitar', 'es-la-beca'],
            { id: 'es.ex.4r0o00tfsew7q3' },
          ),
          ex.translateWrite(
            'It’s necessary that you write a letter in Spanish.',
            'Es necesario que escribas una carta en español.',
            ['es-es-necesario-que'],
            {
              id: 'es.ex.1zyjemmvbp6uav',
              acceptedAnswers: [
                'Es necesario que escriba una carta en español.',
                'Es necesario que usted escriba una carta en español.',
                'Es necesario que escriban una carta en español.',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu amiga tiene una entrevista mañana. ¿Qué le dices?',
            'Wish her luck: say you hope she gets the job (start with «Espero que»).',
            'Espero que consigas el puesto.',
            [
              'Espero que consigas el puesto',
              'Espero que te den el puesto.',
              'Espero que consigas el trabajo.',
              'Espero que te contraten.',
              '¡Espero que consigas el puesto!',
              'Espero que te vaya bien.',
            ],
            ['es-espero-que', 'es-el-puesto'],
            { id: 'es.ex.c0b7bwgo3j312y' },
          ),
        ],
      },
    ],
  },
};

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `You write at least ${minSentences} sentences`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Each sentence starts with a capital letter', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'You end with a full stop, an exclamation mark or a question mark',
    kind: 'end_punctuation',
  },
];

const base = { language: 'es', allowInvented: true as const, maxChars: 1500 };

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U05_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.solicitud',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u05-l05',
    title: 'A formal email to apply for a job',
    instructions:
      'Write a formal email to apply for a job (real or invented details). Open with estimado / estimada, say why you are writing (le escribo para…), what you studied and what experience you have, say what you hope for with espero que + subjunctive, and close with atentamente. Use usted and do not include any real contact details.',
    prompts: ['¿Qué puesto quiere solicitar?', '¿Qué carrera estudió?', '¿Qué espera?'],
    glossary: [{ term: 'turismo', meaning: 'tourism' }],
    requirements: [
      {
        id: 'greeting',
        label: 'You open with Estimado or Estimada (Estimada señora:…)',
        kind: 'pattern',
        patterns: [['estimado|estimada|estimados|estimadas']],
      },
      {
        id: 'purpose',
        label: 'You say why you are writing (le escribo para…)',
        kind: 'pattern',
        patterns: [['le|les', 'escribo', 'para']],
      },
      {
        id: 'subjunctive',
        label:
          'You use a wish or need + que (espero que, quiero que, es importante que, es necesario que…)',
        kind: 'pattern',
        patterns: [
          ['espero', 'que'],
          ['quiero', 'que'],
          ['importante', 'que'],
          ['necesario', 'que'],
        ],
      },
      {
        id: 'closing',
        label: 'You close with Atentamente',
        kind: 'pattern',
        patterns: [['atentamente']],
      },
      ...common(5),
    ],
    model:
      'Estimada señora: Le escribo para solicitar el puesto de recepcionista en su hotel. Estudié la carrera de turismo en Guadalajara y tengo dos años de experiencia con clientes. Hablo inglés y puedo trabajar en el turno de la tarde. Espero que me llame para una entrevista. Muchas gracias por su tiempo. Atentamente, Valeria.',
    checklist: [
      'I open with Estimado / Estimada + a colon and close with Atentamente.',
      'I use usted all the time: su hotel, le escribo.',
      'After espero que or es importante que, the verb is in the subjunctive (llame, pueda, tenga).',
    ],
  },
];

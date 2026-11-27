import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U4 «Plans and goals» (docs/ES_B1.md §3): hablar de metas y planes. El futuro simple
 * (infinitivo + -é, -ás, -á, -emos, -án: viajaré, viviré) con los irregulares frecuentes (tendré,
 * podré, saldré, sabré, pondré, haré, diré, vendré); cuando + presente de subjuntivo para el futuro
 * (cuando tenga dinero, cuando termine la universidad) frente a cuando + presente para la costumbre
 * (cuando tengo tiempo, leo); ir a + infinitivo (repaso) para los planes concretos; dentro de + tiempo
 * y algún día.
 * Variante: español neutro de Latinoamérica, con tú y ustedes; «la prepa» (México) para la escuela
 * secundaria superior, con la explicación en inglés.
 * Pronunciación: la sílaba tónica final del futuro, marcada con tilde (ten-DRÉ, po-DRÁS), frente al
 * presente (TEN-go) y al indefinido (ha-BLÓ).
 * Cultura: los propósitos de año nuevo (y las doce uvas de la medianoche en México y otros países),
 * Querétaro como ciudad a la que se muda mucha gente, una cafetería soñada en Oaxaca.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PROPOSITOS = reading(
  'es.stim.b1-u4-propositos',
  'post',
  'Gabriela shares her New Year’s resolutions online.',
  [
    'En diciembre siempre escribo mis propósitos para el año nuevo, y este año tengo tres metas.',
    'Primero, saldré a correr tres veces por semana con mi hermana.',
    'Segundo, estudiaré inglés todos los días, porque mi objetivo es trabajar en Estados Unidos.',
    'También aprenderé a cocinar: algún día podré hacer la comida de mi abuela.',
    'No sé si lo voy a lograr todo, pero lo voy a intentar.',
    '¿Y ustedes? ¿Cuáles son sus metas para este año?',
  ],
  { title: 'Mis propósitos para el año nuevo', from: 'Gabriela' },
);

const CAFETERIA = reading(
  'es.stim.b1-u4-cafeteria',
  'post',
  'Tomás writes about his plans on his birthday.',
  [
    'Hoy es mi cumpleaños y pensé mucho en mi futuro.',
    '¿Dónde estaré dentro de cinco años?',
    'Todavía no lo sé, pero tengo un proyecto: quiero abrir una pequeña cafetería en Oaxaca.',
    'Primero, trabajaré dos años en un café de Puebla para aprender.',
    'Después, en mi cafetería pondré mesas en la calle y habrá música los viernes.',
    'Si no sale bien, por lo menos sabré que lo intenté.',
  ],
  { title: 'Dentro de cinco años…', from: 'Tomás' },
);

const ORIENTADORA = dialogue(
  'es.stim.b1-u4-orientadora',
  'Elena, a school counselor in Monterrey, talks with Mateo, a student in his last year of high school, about his plans.',
  [
    ['Elena', 'Hola, Mateo. Este año terminas la prepa, ¿verdad? ¿Qué planes tienes?'],
    ['Mateo', 'Todavía no sé. Me gustaría estudiar Medicina, pero es muy caro.'],
    ['Elena', 'Bueno, ¿y cuál es tu meta? ¿Qué quieres lograr?'],
    ['Mateo', 'Mi meta es trabajar como médico en un hospital de mi ciudad.'],
    [
      'Elena',
      'Es una meta muy buena. Si tienes buenas notas, puedes conseguir ayuda de la universidad.',
    ],
    ['Mateo', '¿En serio? Entonces, cuando termine la prepa, voy a pedir esa ayuda.'],
    ['Elena', 'Muy bien. Y mientras tanto, ¿puedes trabajar y ahorrar un poco?'],
    [
      'Mateo',
      'Sí. Cuando tenga dieciocho años, podré trabajar los fines de semana en la tienda de mis papás.',
    ],
  ],
  ES_B1_RATE,
);

const MUDANZA = dialogue(
  'es.stim.b1-u4-mudanza',
  'Andrea and Luis, a couple from Mexico City, talk about moving to Querétaro.',
  [
    ['Andrea', 'Luis, ¿ya viste los apartamentos de Querétaro que te mandé?'],
    ['Luis', 'Sí, me encanta el de dos dormitorios. Está cerca de un parque.'],
    ['Andrea', 'A mí también. Allá la vida es más tranquila y yo puedo trabajar desde casa.'],
    ['Luis', 'Pero todavía no tenemos dinero para mudarnos.'],
    ['Andrea', 'Ya sé. Si ahorramos un poco cada mes, dentro de un año podremos mudarnos.'],
    ['Luis', 'Tienes razón. Cuando tenga el trabajo nuevo, ahorraré más.'],
    ['Andrea', '¿Y cuándo sabrás si te dan el trabajo?'],
    ['Luis', 'El lunes. ¡Ojalá que sí! Y si me lo dan, esa noche saldremos a cenar.'],
  ],
  ES_B1_RATE,
);

export const ES_B1_U04: EsUnitDef = {
  names: ['Gabriela', 'Tomás', 'Elena', 'Mateo', 'Andrea', 'Luis', 'Ana', 'Querétaro'],
  support: [
    // Futuro: formas que no son palabras de la unidad.
    'estaré',
    'estudiaré',
    'aprenderé',
    'trabajaré',
    'viajaré',
    'viviré',
    'buscaré',
    'terminaré',
    'llegaré',
    'terminar',
    'ahorraré',
    'diré',
    'harás',
    'sabrás',
    'podremos',
    'saldremos',
    // Subjuntivo con cuando.
    'llegue',
    // Otras formas verbales.
    'consiguió',
    'consigo',
    'conseguí',
    'puse',
    'poner',
    'pone',
    'supe',
    'saber',
    'sé',
    'sale',
    'dan',
    'ahorramos',
    'mudarnos',
    'mudarme',
    'intentar',
    'intenté',
    'aprender',
    'abrir',
    'pedir',
    // Léxico de los textos.
    'propósitos',
    'segundo',
    'cafetería',
    'prepa',
    'notas',
    'ayuda',
    'esa',
    'tanto',
    'dieciocho',
    'propio',
  ],
  unit: {
    position: 4,
    title: 'Plans and goals',
    titleEn: 'Planes y metas',
    description:
      'Talk about your goals and plans: use the future (tendré, podré, saldré, sabré, pondré), say what you will do when something happens with cuando + subjunctive (cuando tenga, cuando termine), and say when with dentro de and algún día.',
    emoji: '🎯',
    objective:
      'You can talk about your goals and plans for the future, say what you will do when something happens and say how long from now it will happen.',
    grammar: {
      title: 'The future · cuando + subjunctive · dentro de',
      explanation:
        'The simple future is formed by adding the same endings to the whole infinitive of -ar, -er and -ir verbs: -é, -ás, -á, -emos, -án (viajaré, comerás, vivirá, estudiaremos, trabajarán). Every form except nosotros has a written accent, and the stress falls on the ending: tra-ba-ja-RÉ. A few frequent verbs change their stem but keep the endings: tener → tendré, poder → podré, salir → saldré, venir → vendré, poner → pondré, saber → sabré, hacer → haré, decir → diré (and hay → habrá). In everyday Latin American Spanish, ir a + infinitive is the usual way to talk about concrete plans (voy a viajar en junio); the simple future is used for predictions, promises and resolutions, and for plans that feel more distant or less certain (algún día tendré una casa en la playa). When cuando refers to the future, the verb after it goes in the present subjunctive, never in the future: cuando tenga dinero, viajaré (not cuando tendré). The present subjunctive swaps the vowel of the ending: -ar verbs take e (terminar → termine, llegar → llegue) and -er / -ir verbs take a, built on the yo form of the present (tengo → tenga, puedo → pueda). For habits, cuando takes the ordinary present: cuando tengo tiempo, leo (whenever I have time, I read). Dentro de + time means “in … from now”: dentro de dos años (in two years); compare hace dos años (two years ago). In Latin America you will also hear en dos años with the same meaning.',
      examples: [
        {
          target: 'Algún día tendré una casa en la playa.',
          base: 'Some day I will have a house at the beach.',
        },
        {
          target: 'Cuando tenga dinero, viajaré a Madrid.',
          base: 'When I have money, I will travel to Madrid.',
        },
        {
          target: 'Dentro de dos años, viviré en Mérida.',
          base: 'In two years, I will live in Mérida.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U4), español neutro de Latinoamérica con tú y ustedes. Sin revisión nativa. Revisar: el reparto entre ir a + infinitivo (planes concretos, lo más frecuente en Latinoamérica) y el futuro simple (predicciones, promesas, propósitos), y si algún ejercicio que pide el futuro debería aceptar también ir a (se aceptó en varias respuestas); «cuando tenga» y «cuando termine» presentados como bloques antes del subjuntivo de U5, con llegue como única forma nueva practicada; la ambigüedad del presente con valor de futuro (mañana salgo temprano), que se evitó en los distractores; «dentro de» frente a «en» + tiempo (en dos años), aceptado en las respuestas; «la prepa» (México) explicada en inglés; «conseguir ayuda de la universidad» (beca queda para U5); «pondré la mesa» (poner la mesa, to set the table); «saber + infinitivo» (sabré cocinar) traducido como know how to; «el objetivo» frente a «la meta» como sinónimos casi totales; Querétaro como destino de mudanza desde la CDMX. Coordinación: las formas de apoyo (estaré, trabajaré, sé…) pueden quedar enseñadas por U1–U2 cuando se escriban; si el validador las marca, se sacan del apoyo.',
    },
    words: [
      w(
        'es-el-objetivo',
        'el objetivo',
        'goal',
        'Mi objetivo es hablar inglés muy bien.',
        'My goal is to speak English very well.',
        ['b1', 'goals'],
        { acceptedTranslations: ['the goal', 'objective'], emoji: '🎯' },
      ),
      w(
        'es-la-meta',
        'la meta',
        'aim, goal',
        'Mi meta para este año es ahorrar dinero.',
        'My aim for this year is to save money.',
        ['b1', 'goals'],
        { acceptedTranslations: ['aim', 'the aim', 'finish line'], emoji: '🏁' },
      ),
      w(
        'es-lograr',
        'lograr',
        'to achieve',
        'Con mucho trabajo, vas a lograr todo.',
        'With a lot of work, you’ll achieve everything.',
        ['b1', 'goals', 'verbs'],
        { acceptedTranslations: ['to manage to'] },
      ),
      w(
        'es-conseguir',
        'conseguir',
        'to get, to manage',
        'Quiero conseguir un trabajo nuevo.',
        'I want to get a new job.',
        ['b1', 'goals', 'verbs'],
        { acceptedTranslations: ['to get', 'to obtain'] },
      ),
      w(
        'es-ahorrar',
        'ahorrar',
        'to save (money)',
        'Voy a ahorrar dinero para el viaje.',
        'I’m going to save money for the trip.',
        ['b1', 'money', 'verbs'],
        { acceptedTranslations: ['to save'], emoji: '🐷' },
      ),
      w(
        'es-mudarse',
        'mudarse',
        'to move (house)',
        'Mi hermana quiere mudarse a Querétaro.',
        'My sister wants to move to Querétaro.',
        ['b1', 'verbs'],
        { acceptedTranslations: ['to move'], emoji: '📦' },
      ),
      w(
        'es-tendre',
        'tendré',
        'I will have',
        'El año que viene tendré más tiempo.',
        'Next year I’ll have more time.',
        ['b1', 'future'],
        { acceptedTranslations: ["I'll have"] },
      ),
      w(
        'es-podre',
        'podré',
        'I will be able to',
        'Dentro de un mes podré hablar mejor.',
        'In a month I’ll be able to speak better.',
        ['b1', 'future'],
        { acceptedTranslations: ["I'll be able to"] },
      ),
      w(
        'es-saldre',
        'saldré',
        'I will go out',
        'Mañana saldré temprano de la oficina.',
        'Tomorrow I’ll leave the office early.',
        ['b1', 'future'],
        { acceptedTranslations: ['I will leave', "I'll go out"] },
      ),
      w(
        'es-sabre',
        'sabré',
        'I will know',
        'El viernes sabré si tengo el trabajo.',
        'On Friday I’ll know if I have the job.',
        ['b1', 'future'],
        { acceptedTranslations: ["I'll know"] },
      ),
      w(
        'es-pondre',
        'pondré',
        'I will put',
        'Esta noche pondré la mesa para la cena.',
        'Tonight I’ll set the table for dinner.',
        ['b1', 'future'],
        { acceptedTranslations: ["I'll put", 'I will set'] },
      ),
      w(
        'es-cuando-tenga',
        'cuando tenga',
        'when I have',
        'Cuando tenga dinero, viajaré a Madrid.',
        'When I have money, I’ll travel to Madrid.',
        ['b1', 'subjunctive'],
      ),
      w(
        'es-cuando-termine',
        'cuando termine',
        'when I finish',
        'Cuando termine la universidad, buscaré trabajo.',
        'When I finish university, I’ll look for a job.',
        ['b1', 'subjunctive'],
      ),
      w(
        'es-dentro-de',
        'dentro de',
        'in (time from now)',
        'Dentro de dos años, viviré en Mérida.',
        'In two years, I’ll live in Mérida.',
        ['b1', 'time'],
        { acceptedTranslations: ['in'] },
      ),
      w(
        'es-algun-dia',
        'algún día',
        'some day',
        'Algún día voy a vivir en la playa.',
        'Some day I’m going to live at the beach.',
        ['b1', 'time'],
        { acceptedTranslations: ['someday', 'one day'] },
      ),
      w(
        'es-el-proyecto',
        'el proyecto',
        'project',
        'Tengo un proyecto nuevo en el trabajo.',
        'I have a new project at work.',
        ['b1', 'goals'],
        { acceptedTranslations: ['the project', 'plan'] },
      ),
      w(
        'es-el-futuro',
        'el futuro',
        'future',
        'En el futuro, quiero vivir en el campo.',
        'In the future, I want to live in the countryside.',
        ['b1', 'time'],
        { acceptedTranslations: ['the future'], emoji: '🔮' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Mis metas',
        objective: 'Talk about your goals and your plans with ir a.',
        intro: {
          explanation:
            'El objetivo and la meta both mean goal (la meta is also the finish line of a race); mi meta es + infinitive is a natural way to state one: mi meta es hablar español. Lograr means to achieve (lograr un objetivo, lograr + infinitive). Conseguir means to get or obtain (conseguir un trabajo) and also to manage to do something; it changes e to i like seguir: consigo, consigues, consigue, conseguimos, and in the preterite conseguí, consiguió. Remember that for concrete plans, the most common form in Latin America is ir a + infinitive: voy a estudiar, vamos a viajar.',
          examples: [
            {
              target: 'Mi meta es hablar español muy bien.',
              base: 'My goal is to speak Spanish very well.',
            },
            { target: 'Voy a conseguir un trabajo nuevo.', base: 'I’m going to get a new job.' },
          ],
        },
        takeaways: [
          'You talk about your goals with el objetivo, la meta, lograr and conseguir.',
          'You talk about concrete plans with ir a + infinitive.',
        ],
        exercises: [
          ex.translationChoice(
            'la meta',
            'aim, goal',
            ['map', 'dream', 'deadline'],
            ['es-la-meta'],
            { id: 'es.ex.t0tzih5175fdpe' },
          ),
          ex.translationChoice(
            'lograr',
            'to achieve',
            ['to try', 'to arrive', 'to lose'],
            ['es-lograr'],
            { id: 'es.ex.tzdzz2zcf25sb2' },
          ),
          ex.matchPairs(
            [
              ['el objetivo', 'goal'],
              ['conseguir', 'to get, to manage'],
              ['el proyecto', 'project'],
              ['el futuro', 'future'],
            ],
            ['es-el-objetivo', 'es-conseguir', 'es-el-proyecto', 'es-el-futuro'],
            { id: 'es.ex.thpskfyhkianf7' },
          ),
          ex.fillBlank(
            '___ meta de Ana es vivir en Madrid.',
            'Ana’s goal is to live in Madrid.',
            'La',
            ['El', 'Los', 'Las'],
            ['es-la-meta'],
            {
              id: 'es.ex.owf4pdn6vgwqev',
              explanation:
                'Meta is feminine: la meta. Its synonym objetivo is masculine: el objetivo.',
            },
          ),
          ex.fillBlank(
            'Ayer mi hermano ___ un trabajo nuevo.',
            'Yesterday my brother got a new job.',
            'consiguió',
            ['conseguir', 'consigo', 'conseguí'],
            ['es-conseguir'],
            {
              id: 'es.ex.v9wmhx2q2oryzo',
              explanation:
                'Conseguir changes e to i in the él / ella preterite: consiguió (like pidió). Conseguí is “I got” and consigo is “I get”.',
            },
          ),
          ex.listenChoice(
            'Voy a lograr mi objetivo.',
            ['Vas a lograr tu objetivo.', 'Voy a olvidar mi objetivo.', 'Voy a lograr mi sueño.'],
            ['es-lograr', 'es-el-objetivo'],
            { id: 'es.ex.wvhxmi89kreu20' },
          ),
          ex.fillBlank(
            'El año que viene yo ___ a estudiar en Bogotá.',
            'Next year I’m going to study in Bogotá.',
            'voy',
            ['vas', 'vamos', 'ir'],
            ['es-el-futuro'],
            {
              id: 'es.ex.7ym15psrl421e3',
              explanation:
                'Ir a + infinitive is the most common way to talk about plans. With yo, ir is voy: voy a estudiar.',
            },
          ),
          ex.orderWords(
            'En el futuro quiero trabajar en un proyecto grande.',
            'In the future I want to work on a big project.',
            ['es-el-futuro', 'es-el-proyecto'],
            { id: 'es.ex.4lbbrmsdz3q4u1' },
          ),
          ex.translateWrite(
            'My goal is to get a new job.',
            'Mi objetivo es conseguir un trabajo nuevo.',
            ['es-el-objetivo', 'es-conseguir'],
            {
              id: 'es.ex.u51oeja69bhtzv',
              acceptedAnswers: [
                'Mi objetivo es conseguir un nuevo trabajo.',
                'Mi meta es conseguir un trabajo nuevo.',
                'Mi meta es conseguir un nuevo trabajo.',
                'Mi objetivo es conseguir otro trabajo.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cuál es tu meta para este año?',
            'Say that your goal is to speak Spanish very well (use «mi meta es»).',
            'Mi meta es hablar español muy bien.',
            [
              'Mi meta es hablar muy bien español.',
              'Mi meta es hablar bien español.',
              'Mi meta para este año es hablar español muy bien.',
              'Mi objetivo es hablar español muy bien.',
            ],
            ['es-la-meta'],
            { id: 'es.ex.q9kzo67cdzjkd4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Tendré, podré, saldré',
        objective: 'Talk about the future and make resolutions with the simple future.',
        intro: {
          explanation:
            'The simple future adds -é, -ás, -á, -emos, -án to the whole infinitive: estudiar → estudiaré, aprender → aprenderé, vivir → viviré. Some frequent verbs shorten their stem but keep the same endings: tener → tendré, poder → podré, salir → saldré. Listen for the stress: it falls on the ending, which carries a written accent (ten-DRÉ, po-DRÁS), except in the nosotros form (tendremos). In conversation, ir a is more common for concrete plans; the simple future sounds more like a resolution, a promise or a prediction, and goes well with algún día (some day). New Year’s resolutions are los propósitos de año nuevo: in Mexico and many other countries, people eat twelve grapes at midnight and make a wish for each month of the year.',
          examples: [
            {
              target: 'Algún día tendré una casa en la playa.',
              base: 'Some day I will have a house at the beach.',
            },
            {
              target: 'Mañana saldré temprano de la oficina.',
              base: 'Tomorrow I will leave the office early.',
            },
          ],
        },
        takeaways: [
          'You form the future with the infinitive + -é, -ás, -á, -emos, -án (estudiaré).',
          'You use tendré, podré and saldré for resolutions and plans, and algún día for the distant future.',
        ],
        exercises: [
          ex.translationChoice(
            'tendré',
            'I will have',
            ['I had', 'I have', 'I would have'],
            ['es-tendre'],
            { id: 'es.ex.knttla2losye70' },
          ),
          ex.translationChoice(
            'algún día',
            'some day',
            ['every day', 'the other day', 'all day'],
            ['es-algun-dia'],
            { id: 'es.ex.rga26zbyee31oy' },
          ),
          ex.matchPairs(
            [
              ['tendré', 'I will have'],
              ['podré', 'I will be able to'],
              ['saldré', 'I will go out'],
              ['algún día', 'some day'],
            ],
            ['es-tendre', 'es-podre', 'es-saldre', 'es-algun-dia'],
            { id: 'es.ex.fs19tfv95z2g0x' },
          ),
          ex.fillBlank(
            'El año que viene ___ más tiempo libre.',
            'Next year I will have more free time.',
            'tendré',
            ['tenía', 'tuve', 'tener'],
            ['es-tendre'],
            {
              id: 'es.ex.k77h5zi3gi3jh2',
              explanation:
                'El año que viene points to the future: tendré. Tener shortens its stem in the future (tendr-, not tener-).',
            },
          ),
          ex.fillBlank(
            'Mañana ___ temprano de la oficina.',
            'Tomorrow I will leave the office early.',
            'saldré',
            ['salí', 'salir', 'salió'],
            ['es-saldre'],
            {
              id: 'es.ex.d41s204fcpno4c',
              explanation:
                'Mañana needs a future form: saldré (salir → saldr-). Salí and salió are past forms.',
            },
          ),
          ex.listenChoice(
            'Algún día podré vivir en Madrid.',
            [
              'Algún día puedo vivir en Madrid.',
              'Algún día podría vivir en Madrid.',
              'Algún día podré venir a Madrid.',
            ],
            ['es-algun-dia', 'es-podre'],
            { id: 'es.ex.pkefs4xarbu249' },
          ),
          question(
            'es.ex.q14ws3xlxnr8k3',
            PROPOSITOS,
            'How often will Gabriela go running?',
            'Three times a week',
            ['Every day', 'Once a week', 'Only at the weekend'],
            ['es-saldre', 'es-la-meta'],
            'Gabriela writes “saldré a correr tres veces por semana con mi hermana”.',
          ),
          question(
            'es.ex.1nfeh8zm7z7gu2',
            PROPOSITOS,
            'Why will Gabriela study English every day?',
            'Her goal is to work in the United States',
            [
              'She is going to live with her family in London',
              'She needs it for her studies',
              'Her sister is teaching her',
            ],
            ['es-el-objetivo'],
            'She writes “estudiaré inglés todos los días, porque mi objetivo es trabajar en Estados Unidos”.',
          ),
          ex.translateWrite(
            'Some day I will have a house at the beach.',
            'Algún día tendré una casa en la playa.',
            ['es-algun-dia', 'es-tendre'],
            {
              id: 'es.ex.aqgd8ob6djzrg0',
              acceptedAnswers: [
                'Algún día tendré una casa cerca del mar.',
                'Algún día tendré una casa en la playa',
                'Algún día voy a tener una casa en la playa.',
                'Un día tendré una casa en la playa.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué harás el sábado?',
            'Say that you will go out with your friends (use «saldré»).',
            'Saldré con mis amigos.',
            [
              'El sábado saldré con mis amigos.',
              'Saldré con mis amigas.',
              'El sábado saldré con mis amigas.',
              'Saldré con unos amigos.',
            ],
            ['es-saldre'],
            { id: 'es.ex.3qj3ovhbu4frve' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Sabré, pondré · dentro de',
        objective: 'Use more irregular futures and say how long from now something will happen.',
        intro: {
          explanation:
            'More verbs with a short stem in the future: saber → sabré, poner → pondré, hacer → haré, decir → diré, venir → vendré. Saber + infinitive means to know how to: sabré cocinar (I’ll know how to cook). Poner la mesa is to set the table. To say how long from now something will happen, use dentro de + time: dentro de dos semanas (in two weeks). It looks forward, while hace + time looks back: hace dos semanas (two weeks ago). In Latin America you will also hear en dos semanas with the same meaning.',
          examples: [
            {
              target: 'Dentro de una semana sabré si tengo el trabajo.',
              base: 'In a week I will know if I have the job.',
            },
            { target: 'Te lo diré mañana.', base: 'I will tell you tomorrow.' },
          ],
        },
        takeaways: [
          'You use sabré, pondré, haré, diré and vendré.',
          'You say how long from now with dentro de + time (dentro de dos años).',
        ],
        exercises: [
          ex.translationChoice(
            'dentro de',
            'in (time from now)',
            ['ago', 'during', 'since'],
            ['es-dentro-de'],
            { id: 'es.ex.cb5dduzm7yhm73' },
          ),
          ex.translationChoice(
            'sabré',
            'I will know',
            ['I knew', 'I will leave', 'I would know'],
            ['es-sabre'],
            { id: 'es.ex.3wz2d9lezkrv8s' },
          ),
          ex.fillBlank(
            '___ dos semanas tengo un examen.',
            'I have an exam in two weeks.',
            'Dentro de',
            ['Hace', 'Desde', 'Durante'],
            ['es-dentro-de'],
            {
              id: 'es.ex.5l446jq2j1uj9w',
              explanation:
                'Dentro de + time looks forward (in two weeks). Hace + time looks back (two weeks ago), and desde means since.',
            },
          ),
          ex.fillBlank(
            'Esta noche ___ la mesa para la cena.',
            'Tonight I will set the table for dinner.',
            'pondré',
            ['puse', 'poner'],
            ['es-pondre'],
            {
              id: 'es.ex.7iw104hc4tnrqr',
              explanation:
                'Poner has a short stem in the future: pondré (not poneré). Puse is the preterite (I put).',
            },
          ),
          ex.fillBlank(
            'El lunes ___ si tengo el trabajo.',
            'On Monday I will know if I have the job.',
            'sabré',
            ['supe', 'saber', 'sabía'],
            ['es-sabre'],
            {
              id: 'es.ex.7s6o608hiwptp5',
              explanation:
                'El lunes points to the future: sabré (saber → sabr-). Supe and sabía are past forms.',
            },
          ),
          ex.listenChoice(
            'Dentro de un mes sabré si tengo el trabajo.',
            [
              'Dentro de un año sabré si tengo el trabajo.',
              'Dentro de un mes sabrás si tienes el trabajo.',
              'Dentro de un mes saldré de este trabajo.',
            ],
            ['es-dentro-de', 'es-sabre'],
            { id: 'es.ex.lts54tabptzlhp' },
          ),
          question(
            'es.ex.1vuq11p5ms48mf',
            CAFETERIA,
            'What is Tomás’s project?',
            'To open a small café in Oaxaca',
            ['To study in Puebla', 'To work in a hotel', 'To travel for five years'],
            ['es-el-proyecto', 'es-dentro-de'],
            'Tomás writes “tengo un proyecto: quiero abrir una pequeña cafetería en Oaxaca”.',
          ),
          question(
            'es.ex.t2ar557a50jhj9',
            CAFETERIA,
            'What will Tomás do in his café?',
            'Put tables on the street and have music on Fridays',
            ['Sell books and magazines', 'Open only on weekends', 'Cook his grandmother’s recipes'],
            ['es-pondre'],
            'He writes “en mi cafetería pondré mesas en la calle y habrá música los viernes”.',
          ),
          ex.translateWrite(
            'In two years I will know how to cook very well.',
            'Dentro de dos años sabré cocinar muy bien.',
            ['es-dentro-de', 'es-sabre'],
            {
              id: 'es.ex.znyb2xms7trf71',
              acceptedAnswers: [
                'En dos años sabré cocinar muy bien.',
                'Dentro de dos años voy a saber cocinar muy bien.',
                'En dos años voy a saber cocinar muy bien.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Quién pone la mesa esta noche?',
            'Say that you will set the table (use «pondré»).',
            'Yo pondré la mesa.',
            [
              'Pondré la mesa.',
              'Esta noche pondré la mesa.',
              'Yo pondré la mesa esta noche.',
              'La pondré yo.',
            ],
            ['es-pondre'],
            { id: 'es.ex.la7nk3sxxqb5a1' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Cuando tenga dinero…',
        objective: 'Say what you will do when something happens, and talk about saving and moving.',
        intro: {
          explanation:
            'When cuando talks about the future, the verb after it goes in the present subjunctive, never in the future: cuando tenga dinero, viajaré (not cuando tendré). The subjunctive swaps the vowel of the ending: -ar verbs take e (terminar → termine, llegar → llegue) and -er / -ir verbs take a, starting from the yo form (tengo → tenga). The other half of the sentence uses the future, ir a or the present: cuando termine, te llamo. For habits, cuando takes the ordinary present: cuando tengo tiempo, leo (whenever I have time, I read). Mudarse is to move house: me voy a mudar or voy a mudarme (the pronoun goes before the verb or on the infinitive). Ahorrar is to save money.',
          examples: [
            {
              target: 'Cuando tenga dinero, viajaré a Madrid.',
              base: 'When I have money, I will travel to Madrid.',
            },
            {
              target: 'Cuando termine la universidad, voy a mudarme a Lima.',
              base: 'When I finish university, I’m going to move to Lima.',
            },
          ],
        },
        takeaways: [
          'You say what you will do when something happens with cuando + subjunctive (cuando tenga, cuando termine).',
          'You talk about habits with cuando + present (cuando tengo tiempo…).',
        ],
        exercises: [
          ex.translationChoice(
            'ahorrar',
            'to save (money)',
            ['to spend', 'to borrow', 'to earn'],
            ['es-ahorrar'],
            { id: 'es.ex.6l04job35ejopo' },
          ),
          ex.fillBlank(
            'Cuando ___ dinero, viajaré a Madrid.',
            'When I have money, I will travel to Madrid.',
            'tenga',
            ['tendré', 'tengo', 'tener'],
            ['es-cuando-tenga'],
            {
              id: 'es.ex.x5fgxfryq83r38',
              explanation:
                'Cuando + a future event takes the subjunctive: cuando tenga. Spanish never uses the future after cuando (cuando tendré is wrong).',
            },
          ),
          ex.fillBlank(
            'Cuando ___ tiempo, siempre leo un libro.',
            'Whenever I have time, I always read a book.',
            'tengo',
            ['tenga', 'tendré', 'tener'],
            ['es-cuando-tenga'],
            {
              id: 'es.ex.cckun8mzzxxk16',
              explanation:
                'This is a habit (siempre leo), not a future event, so cuando takes the ordinary present: cuando tengo tiempo.',
            },
          ),
          ex.fillBlank(
            'Cuando ___ la universidad, voy a buscar trabajo.',
            'When I finish university, I’m going to look for a job.',
            'termine',
            ['termino', 'terminaré', 'terminar'],
            ['es-cuando-termine'],
            {
              id: 'es.ex.rip9zmqaoqw90d',
              explanation:
                'The plan is in the future (voy a buscar), so cuando takes the subjunctive: termine (-ar verb → e).',
            },
          ),
          ex.listenChoice(
            'Cuando termine, te llamo.',
            [
              'Cuando terminé, te llamé.',
              'Cuando termino, te llamo.',
              'Cuando termine, te escribo.',
            ],
            ['es-cuando-termine'],
            { id: 'es.ex.m5ibradbwz38xj' },
          ),
          question(
            'es.ex.n9lz6sm6zy4whm',
            ORIENTADORA,
            'What is Mateo’s goal?',
            'To work as a doctor in a hospital in his city',
            [
              'To study abroad',
              'To open a shop with his parents',
              'To become a teacher in Monterrey',
            ],
            ['es-la-meta', 'es-lograr'],
            'Mateo says “Mi meta es trabajar como médico en un hospital de mi ciudad”.',
          ),
          question(
            'es.ex.cxei50wbvvv5f6',
            ORIENTADORA,
            'What will Mateo do when he finishes high school?',
            'Ask the university for financial help',
            ['Start working full time', 'Move to another city', 'Take a year off to travel'],
            ['es-cuando-termine', 'es-conseguir'],
            'Elena tells him he can “conseguir ayuda de la universidad”, and he answers “cuando termine la prepa, voy a pedir esa ayuda”. La prepa is high school in Mexico.',
          ),
          question(
            'es.ex.nmme8wer766e9j',
            MUDANZA,
            'Why does Andrea like the idea of living in Querétaro?',
            'Life is calmer there and she can work from home',
            [
              'Her family lives there',
              'The apartments are cheaper than in Mexico City',
              'Luis has a new job there',
            ],
            ['es-mudarse'],
            'Andrea says “Allá la vida es más tranquila y yo puedo trabajar desde casa”.',
          ),
          ex.translateWrite(
            'When I finish university, I am going to move to Lima.',
            'Cuando termine la universidad, voy a mudarme a Lima.',
            ['es-cuando-termine', 'es-mudarse'],
            {
              id: 'es.ex.3xnpnqespdzvqj',
              acceptedAnswers: [
                'Cuando termine la universidad voy a mudarme a Lima.',
                'Cuando termine la universidad, me voy a mudar a Lima.',
                'Cuando termine la universidad me voy a mudar a Lima.',
                'Cuando termine la universidad, me mudaré a Lima.',
                'Cuando termine la facultad, voy a mudarme a Lima.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué vas a hacer este año?',
            'Say that you are going to save money to move (use «ahorrar» and «para mudarme»).',
            'Voy a ahorrar dinero para mudarme.',
            [
              'Voy a ahorrar para mudarme.',
              'Este año voy a ahorrar dinero para mudarme.',
              'Voy a ahorrar dinero para mudarme de casa.',
              'Ahorraré dinero para mudarme.',
            ],
            ['es-ahorrar', 'es-mudarse'],
            { id: 'es.ex.hdaxjgde7s8dvh' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Dentro de cinco años',
        objective: 'Talk about your future in a connected way and react to other people’s plans.',
        intro: {
          explanation:
            'To talk about your future, combine everything: ir a for concrete plans (voy a estudiar), the future for predictions and resolutions (tendré, podré), cuando + subjunctive for what depends on something else (cuando tenga trabajo…) and dentro de or algún día for when. To sound less certain, use creo que + future (creo que viviré en Lima) or no sé si… (I don’t know if…). To react to someone’s plans: ¡Qué buena idea!, ¡Ojalá que sí! (I hope so!) or ¡Vas a lograrlo! (You’ll make it!).',
          examples: [
            {
              target: 'Creo que dentro de cinco años tendré mi propio negocio.',
              base: 'I think that in five years I will have my own business.',
            },
            {
              target: 'Cuando tenga el trabajo, saldremos a cenar.',
              base: 'When I get the job, we will go out for dinner.',
            },
          ],
        },
        takeaways: [
          'You talk about your future combining ir a, the future, cuando + subjunctive and dentro de.',
          'You show doubt with creo que and no sé si, and react with ¡Ojalá que sí!',
        ],
        exercises: [
          question(
            'es.ex.uj4addevi00z60',
            PROPOSITOS,
            'What does Gabriela say about her resolutions at the end?',
            'She doesn’t know if she will achieve them all, but she will try',
            [
              'She is sure she will achieve them all',
              'She has already achieved one of them',
              'She will start them next year',
            ],
            ['es-lograr'],
            'Gabriela writes “No sé si lo voy a lograr todo, pero lo voy a intentar”.',
          ),
          question(
            'es.ex.ludeuhaz89mzyf',
            CAFETERIA,
            'What will Tomás know if his project doesn’t work out?',
            'That at least he tried',
            [
              'That he has to go back to Puebla',
              'That he needs more money',
              'That Oaxaca was a bad idea',
            ],
            ['es-sabre'],
            'He writes “Si no sale bien, por lo menos sabré que lo intenté”.',
          ),
          question(
            'es.ex.0xspagfpngunog',
            ORIENTADORA,
            'When will Mateo be able to work at his parents’ shop?',
            'When he turns eighteen',
            ['When he finishes university', 'This summer', 'He already works there'],
            ['es-cuando-tenga', 'es-podre', 'es-ahorrar'],
            'Mateo says “Cuando tenga dieciocho años, podré trabajar los fines de semana en la tienda de mis papás”.',
          ),
          question(
            'es.ex.8v62dq691qqkla',
            MUDANZA,
            'When could Andrea and Luis move, according to Andrea?',
            'In a year, if they save a little every month',
            ['Next month', 'When Luis finishes his studies', 'In five years'],
            ['es-dentro-de', 'es-ahorrar', 'es-mudarse'],
            'Andrea says “Si ahorramos un poco cada mes, dentro de un año podremos mudarnos”.',
          ),
          question(
            'es.ex.9qaerlq7li7vv3',
            MUDANZA,
            'What will they do if Luis gets the new job?',
            'Go out for dinner that night',
            ['Move the next day', 'Buy an apartment', 'Visit Querétaro'],
            ['es-saldre', 'es-cuando-tenga'],
            'Luis says “si me lo dan, esa noche saldremos a cenar”: saldremos is the nosotros form of saldré.',
          ),
          ex.listenChoice(
            'Creo que dentro de cinco años tendré mi propio negocio.',
            [
              'Creo que dentro de cinco años tendré mi propia casa.',
              'Creo que dentro de un año tendré mi propio negocio.',
              'Creo que hace cinco años tenía mi propio negocio.',
            ],
            ['es-dentro-de', 'es-tendre'],
            { id: 'es.ex.ku644s42x95h7y' },
          ),
          ex.fillBlank(
            'Cuando ___ a casa, te mando un mensaje.',
            'When I get home, I will send you a message.',
            'llegue',
            ['llegaré', 'llegar', 'llegó'],
            ['es-cuando-tenga'],
            {
              id: 'es.ex.aez6vp286vhwld',
              explanation:
                'Like cuando tenga and cuando termine: a future event after cuando takes the subjunctive. Llegar is an -ar verb, so it takes e: llegue (with u to keep the hard g sound).',
            },
          ),
          ex.matchPairs(
            [
              ['cuando tenga', 'when I have'],
              ['cuando termine', 'when I finish'],
              ['dentro de', 'in (time from now)'],
              ['pondré', 'I will put'],
            ],
            ['es-cuando-tenga', 'es-cuando-termine', 'es-dentro-de', 'es-pondre'],
            { id: 'es.ex.7wwu7m3nwmj8lw' },
          ),
          ex.translateWrite(
            'In five years I will have my own business.',
            'Dentro de cinco años tendré mi propio negocio.',
            ['es-dentro-de', 'es-tendre'],
            {
              id: 'es.ex.r49pi7zidg66t1',
              acceptedAnswers: [
                'En cinco años tendré mi propio negocio.',
                'Dentro de cinco años voy a tener mi propio negocio.',
                'Dentro de cinco años tendré mi propia empresa.',
                'Dentro de cinco años, tendré mi propio negocio.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué harás cuando termines la universidad?',
            'Say that when you finish university you will look for a job (use «cuando termine» and «buscaré»).',
            'Cuando termine la universidad, buscaré trabajo.',
            [
              'Cuando termine la universidad buscaré trabajo.',
              'Cuando termine la universidad, buscaré un trabajo.',
              'Buscaré trabajo cuando termine la universidad.',
              'Cuando termine, buscaré trabajo.',
            ],
            ['es-cuando-termine'],
            { id: 'es.ex.liygakazp9r82f' },
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

/** Futuros frecuentes (yo y nosotros sobre todo). */
const FUTUROS =
  'tendré|tendrá|tendremos|podré|podrá|podremos|saldré|saldremos|sabré|sabremos|pondré|pondremos|haré|haremos|diré|vendré|habrá|será|seré|estaré|iré|iremos|viviré|viviremos|trabajaré|estudiaré|viajaré|viajaremos|ahorraré|buscaré|aprenderé|compraré|lograré|conseguiré|tendrás|podrás';

/** Cuando + presente de subjuntivo. */
const SUBJUNTIVOS =
  'tenga|tengas|tengamos|termine|termines|terminemos|llegue|lleguemos|pueda|podamos|sea|seamos|viva|vivamos|ahorre|consiga|vuelva';

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U04_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.metas',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u04-l05',
    title: 'Your goals',
    instructions:
      'Write about your goals for the next few years: what you want to achieve, what you will do when something happens (cuando + subjunctive) and when it will happen (dentro de, algún día). Use the future.',
    prompts: ['¿Cuáles son tus metas?', '¿Qué harás cuando termines la universidad?'],
    requirements: [
      {
        id: 'future',
        label: 'You use the simple future (tendré, podré, saldré, viajaré…)',
        kind: 'pattern',
        patterns: [[FUTUROS]],
      },
      {
        id: 'cuando',
        label: 'You use cuando + subjunctive (cuando tenga…, cuando termine…)',
        kind: 'pattern',
        patterns: [['cuando', SUBJUNTIVOS]],
      },
      {
        id: 'time',
        label: 'You say when with dentro de or algún día',
        kind: 'pattern',
        patterns: [
          ['dentro', 'de'],
          ['algún', 'día'],
        ],
      },
      ...common(5),
    ],
    model:
      'Tengo tres metas para el futuro. Este año ahorraré dinero para un viaje a Cusco. Cuando termine la universidad, buscaré trabajo en una empresa de Lima. Dentro de cinco años tendré mi propio apartamento. Cuando tenga más tiempo, podré aprender a cocinar. ¡Algún día lo voy a lograr todo!',
    checklist: [
      'I use the future for goals and resolutions (ahorraré, tendré, podré).',
      'After cuando I use the subjunctive, never the future: cuando tenga, cuando termine.',
      'I say when with dentro de + time or algún día.',
    ],
  },
  {
    ...base,
    id: 'es.b1.wt.libre-diez-anos',
    kind: 'free',
    codes: [],
    lesson: 'es-b1-u04-final',
    block: 1,
    title: 'Free writing: your life in ten years',
    instructions:
      'Imagine your life in ten years: where you will live, what you will do, who you will be with and what will be different. Say what you will do when certain things happen. There is no right answer: compare your text with the model and go through the checklist.',
    prompts: [
      '¿Dónde vas a vivir dentro de diez años?',
      '¿Qué harás cuando tengas más tiempo?',
      '¿Cuál es tu meta más grande?',
    ],
    requirements: [
      {
        id: 'future',
        label: 'Tip: use the future (tendré, viviré, podré…)',
        kind: 'pattern',
        patterns: [[FUTUROS]],
        optional: true,
      },
      {
        id: 'cuando',
        label: 'Tip: say what you will do when something happens (cuando tenga…)',
        kind: 'pattern',
        patterns: [['cuando', SUBJUNTIVOS]],
        optional: true,
      },
      {
        id: 'time',
        label: 'Tip: say when (dentro de…, algún día)',
        kind: 'pattern',
        patterns: [
          ['dentro', 'de'],
          ['algún', 'día'],
        ],
        optional: true,
      },
      { id: 'words', label: 'Tip: about 80 words', kind: 'min_words', min: 80, optional: true },
    ],
    model:
      'Dentro de diez años tendré treinta y cinco años. Creo que viviré en Querétaro, en una casa cerca de un parque, porque allá la vida es más tranquila. Trabajaré en un proyecto grande en mi empresa y podré hablar inglés muy bien. Cuando tenga hijos, saldré menos por la noche, pero viajaré con ellos a la playa todos los veranos. Los domingos haré una comida grande para toda la familia. No sé si voy a lograr todo, pero mi meta es clara: algún día tendré la vida que quiero.',
    checklist: [
      'I use the future for predictions (viviré, trabajaré, tendré).',
      'I use cuando + subjunctive for what depends on something else (cuando tenga hijos…).',
      'I say when (dentro de diez años, algún día) and give a reason with porque.',
    ],
  },
];

import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U5 «What happened?» (docs/ES_A1_A2.md): contar un hecho. El imperfecto describe la
 * escena (llovía, estaba caminando: estar + gerundio) y el indefinido cuenta lo que pasó (de repente,
 * alguien me robó la billetera). Conectores: mientras, de repente, entonces, por suerte,
 * lamentablemente. Acabar de + infinitivo (acabo de llegar) y tener miedo (tuve / tenía miedo).
 * Vocabulario rioplatense: la billetera (en otros países, cartera; acá la cartera es la de mujer).
 * Pronunciación: el gerundio (-ando, -iendo, con el acento en an / ien) y la cc de accidente.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NOTICIA = reading(
  'es.stim.a2-u5-noticia',
  'message',
  'Ana writes to her neighbor Mateo about something that happened in their street.',
  [
    'Hola, Mateo. ¿Viste qué pasó anoche en la calle?',
    'Llovía mucho y había poca luz.',
    'Mientras yo estaba mirando la tele, escuché un ruido muy fuerte.',
    'Fue un accidente: un auto chocó con un árbol.',
    'Por suerte, el señor del auto estaba bien.',
    'La policía llegó a los diez minutos.',
  ],
  { from: 'Ana', to: 'Mateo' },
);

const BILLETERA = dialogue(
  'es.stim.a2-u5-billetera',
  'Diego meets his friend Sofía, who looks upset.',
  [
    ['Diego', '¡Sofía! ¿Qué pasó? Estás muy seria.'],
    ['Sofía', 'Ayer, mientras volvía a casa en el colectivo, alguien me robó la billetera.'],
    ['Diego', '¡Qué mal! ¿Y qué hiciste?'],
    ['Sofía', 'Tuve mucho miedo. Entonces llamé a la policía.'],
    ['Diego', '¿Y la encontraron?'],
    ['Sofía', 'No, lamentablemente no. Pero por suerte tenía el celular en la mochila.'],
  ],
);

const LLAMADA = dialogue('es.stim.a2-u5-llamada', 'Lucía’s mother calls her in the morning.', [
  ['Mamá', 'Hola, Lucía. ¿Dónde estás?'],
  ['Lucía', 'Acabo de llegar a la estación, mamá. Perdí el tren de las ocho.'],
  ['Mamá', '¿Por qué? ¿Qué pasó?'],
  ['Lucía', 'Estaba tomando un café y, de repente, vi la hora. ¡Era muy tarde!'],
  ['Mamá', 'Bueno, no pasa nada. ¿Hay otro tren?'],
  ['Lucía', 'Sí, a las nueve.'],
]);

export const ES_A2_U05: EsUnitDef = {
  names: ['Ana', 'Mateo', 'Diego', 'Sofía', 'Lucía'],
  support: [
    'robó',
    'robaron',
    'robaba',
    'roba',
    'perdí',
    'perdió',
    'perdiste',
    'caminando',
    'cocinando',
    'mirando',
    'tomando',
    'comiendo',
    'haciendo',
    'volvía',
    'llamé',
    'encontraron',
    'luz',
    'escuché',
    'ruido',
    'fuerte',
    'chocó',
    'árbol',
    'minutos',
    'bueno',
    'pasa',
    'otro',
    'estabas',
    'llegar',
    'acaba',
  ],
  unit: {
    position: 5,
    title: 'What happened?',
    titleEn: '¿Qué pasó?',
    description:
      'Tell what happened: set the scene with the imperfect and estaba + -ando / -iendo, tell the events with the preterite, link them with de repente, entonces or por suerte, and say what you have just done with acabo de.',
    emoji: '🚨',
    objective:
      'You can tell a short story about something that happened to you (a theft, an accident, a missed train), describing the scene, the events and how it ended.',
    grammar: {
      title: 'Telling a story: imperfect for the scene, preterite for the events',
      explanation:
        'A story in Spanish uses two past tenses. The imperfect sets the scene: the weather, the place, what was going on (llovía, había poca luz, yo estaba en casa). For an action in progress use estaba + gerund: estaba caminando (I was walking), estaba comiendo. The gerund ends in -ando for -ar verbs and -iendo for -er / -ir verbs. The preterite tells what happened, the events that move the story forward: de repente, alguien me robó la billetera; entonces llamé a la policía. Él / ella forms of the preterite: -ar → -ó (pasó, robó, llegó), -er / -ir → -ió (perdió). Notice: Spanish says me robó la billetera (it stole the wallet from me), not mi billetera. To say you have just done something, use acabar de + infinitive: acabo de llegar.',
      examples: [
        {
          target: 'Llovía y yo estaba caminando por la calle.',
          base: 'It was raining and I was walking down the street.',
        },
        {
          target: 'De repente, alguien me robó la billetera.',
          base: 'Suddenly, someone stole my wallet.',
        },
        { target: 'Acabo de llegar a casa.', base: 'I’ve just got home.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U5). Sin revisión nativa. Revisar: «billetera» (en la Argentina la cartera es el bolso de mujer: se explica); «me robaron la billetera» (impersonal) junto a «alguien me robó»; «perder el tren / el colectivo» por «to miss» (se agregó «to miss» como traducción aceptada de perder); «la policía llegó a los diez minutos»; «¡Qué mal!» como reacción. El pretérito perfecto (he llegado) no se usa: acabo de + infinitivo cubre el «I’ve just».',
    },
    words: [
      w(
        'es-que-paso',
        '¿qué pasó?',
        'what happened?',
        '¿Qué pasó? Estás muy serio.',
        'What happened? You look very serious.',
        ['events', 'questions'],
      ),
      w(
        'es-de-repente',
        'de repente',
        'suddenly',
        'De repente, escuché un ruido.',
        'Suddenly I heard a noise.',
        ['connectors'],
        { acceptedTranslations: ['all of a sudden'] },
      ),
      w(
        'es-mientras',
        'mientras',
        'while',
        'Mientras comía, miraba la tele.',
        'While I was eating, I was watching TV.',
        ['connectors'],
      ),
      w(
        'es-estaba',
        'estaba',
        'I was (in the middle of)',
        'Estaba caminando por la calle.',
        'I was walking down the street.',
        ['past'],
      ),
      w(
        'es-entonces',
        'entonces',
        'then',
        'Perdí el colectivo, entonces fui a pie.',
        'I missed the bus, so I walked.',
        ['connectors'],
        { acceptedTranslations: ['so'] },
      ),
      w(
        'es-por-suerte',
        'por suerte',
        'luckily',
        'Por suerte, estaba bien.',
        'Luckily, I was fine.',
        ['connectors'],
        { acceptedTranslations: ['fortunately'] },
      ),
      w(
        'es-lamentablemente',
        'lamentablemente',
        'unfortunately',
        'Lamentablemente, perdí el tren.',
        'Unfortunately, I missed the train.',
        ['connectors'],
      ),
      w(
        'es-el-accidente',
        'el accidente',
        'the accident',
        'Ayer vi un accidente en la calle.',
        'Yesterday I saw an accident in the street.',
        ['events'],
        { emoji: '💥' },
      ),
      w(
        'es-perder',
        'perder',
        'to lose',
        'No quiero perder el tren.',
        'I don’t want to miss the train.',
        ['verbs'],
        { acceptedTranslations: ['to miss'] },
      ),
      w(
        'es-robar',
        'robar',
        'to steal',
        'Alguien me robó el celular.',
        'Someone stole my phone.',
        ['verbs'],
        { acceptedTranslations: ['to rob'] },
      ),
      w(
        'es-la-billetera',
        'la billetera',
        'the wallet',
        'Perdí la billetera en el colectivo.',
        'I lost my wallet on the bus.',
        ['objects', 'argentina'],
        { emoji: '👛' },
      ),
      w(
        'es-la-policia',
        'la policía',
        'the police',
        'Llamé a la policía.',
        'I called the police.',
        ['events'],
        { emoji: '🚓' },
      ),
      w(
        'es-llovia',
        'llovía',
        'it was raining',
        'Ayer llovía todo el día.',
        'Yesterday it rained all day.',
        ['weather', 'past'],
        { emoji: '🌧️' },
      ),
      w(
        'es-alguien',
        'alguien',
        'someone',
        '¿Hay alguien en casa?',
        'Is anyone home?',
        ['pronouns'],
        { acceptedTranslations: ['somebody'] },
      ),
      w(
        'es-tener-miedo',
        'tener miedo',
        'to be scared',
        'Mi hermano tiene miedo de los perros.',
        'My brother is scared of dogs.',
        ['feelings'],
        { acceptedTranslations: ['to be afraid'] },
      ),
      w(
        'es-el-vecino',
        'el vecino',
        'the neighbor',
        'Mi vecina es muy simpática.',
        'My neighbor is very friendly.',
        ['people'],
        { acceptedTexts: ['la vecina'] },
      ),
      w(
        'es-acabo-de',
        'acabo de',
        'I have just',
        'Acabo de llegar.',
        'I’ve just arrived.',
        ['verbs'],
        { acceptedTranslations: ["I've just"] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Qué pasó?',
        objective: 'Ask what happened and say that something was stolen.',
        intro: {
          explanation:
            '¿Qué pasó? means what happened? In the preterite, -ar verbs end in -é for yo (llamé, llegué) and in -ó for él / ella (pasó, robó, llegó). Alguien is someone. When you don’t know who did it, you can also say me robaron (they stole from me). In Argentina your wallet is la billetera; la cartera is a woman’s handbag. Notice: me robó la billetera, not mi billetera.',
          examples: [
            {
              target: '¿Qué pasó? — Alguien me robó la billetera.',
              base: 'What happened? — Someone stole my wallet.',
            },
            { target: 'Llamé a la policía.', base: 'I called the police.' },
          ],
        },
        takeaways: [
          'You ask ¿qué pasó? and answer with the preterite (pasó, robó).',
          'You say what was stolen with alguien me robó… or me robaron…',
        ],
        exercises: [
          ex.translationChoice(
            '¿qué pasó?',
            'what happened?',
            ['what time is it?', 'what is this?', 'how are you?'],
            ['es-que-paso'],
            { id: 'es.ex.rlr0kzpgjdu60w' },
          ),
          ex.translationChoice(
            'alguien',
            'someone',
            ['nobody', 'everyone', 'who'],
            ['es-alguien'],
            { id: 'es.ex.kmyf8vl47y4rhv' },
          ),
          ex.matchPairs(
            [
              ['robar', 'to steal'],
              ['la billetera', 'the wallet'],
              ['la policía', 'the police'],
              ['alguien', 'someone'],
            ],
            ['es-robar', 'es-la-billetera', 'es-la-policia', 'es-alguien'],
            { id: 'es.ex.lwb869ug6hs2pn' },
          ),
          ex.fillBlank(
            'Alguien me ___ la billetera.',
            'Someone stole my wallet.',
            'robó',
            ['robar', 'pasó', 'llamé'],
            ['es-alguien', 'es-robar', 'es-la-billetera'],
            {
              id: 'es.ex.k42zlggkga86ov',
              explanation:
                'For él / ella (here alguien) the preterite of -ar verbs ends in -ó: robó. Robar is the infinitive.',
            },
          ),
          ex.listenChoice(
            '¿Qué pasó, Sofía?',
            ['¿Qué hora es, Sofía?', '¿Qué es esto, Sofía?', '¿Qué pasó, Lucía?'],
            ['es-que-paso'],
            { id: 'es.ex.qw2rkom47lkek5' },
          ),
          ex.fillBlank(
            'Llamé a la ___.',
            'I called the police.',
            'policía',
            ['billetera', 'calle', 'farmacia'],
            ['es-la-policia'],
            {
              id: 'es.ex.xyao7pdjeb2w7p',
              skill: 'vocabulary',
              explanation:
                'La policía is the police. The í has an accent: po-li-cí-a, four syllables.',
            },
          ),
          ex.orderWords(
            'Alguien me robó el celular.',
            'Someone stole my phone.',
            ['es-alguien', 'es-robar'],
            { id: 'es.ex.ouyycdaq5cikp4' },
          ),
          ex.listenChoice(
            'Me robaron la billetera.',
            ['Me robaron la mochila.', 'Perdí la billetera.', 'Me robaron el celular.'],
            ['es-robar', 'es-la-billetera'],
            { id: 'es.ex.7otxbe2rxsv668' },
          ),
          ex.translateWrite(
            'What happened? Someone stole my wallet.',
            '¿Qué pasó? Alguien me robó la billetera.',
            ['es-que-paso', 'es-alguien', 'es-robar', 'es-la-billetera'],
            {
              id: 'es.ex.hdq3kf9084oted',
              acceptedAnswers: [
                '¿Qué pasó? Me robaron la billetera.',
                '¿Qué pasó? Alguien me robó mi billetera.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué pasó?',
            'Say that someone stole your phone (start with «Alguien me…»).',
            'Alguien me robó el celular.',
            ['Alguien me robó el celular', 'Me robaron el celular.', 'Alguien me robó mi celular.'],
            ['es-alguien', 'es-robar'],
            { id: 'es.ex.7mokc6fiidpa9a' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Mientras estaba…',
        objective: 'Describe the scene: the weather and what was going on.',
        intro: {
          explanation:
            'The background of a story goes in the imperfect: llovía (it was raining), había poca luz. For an action in progress use estaba + gerund: estaba caminando, estaba comiendo. The gerund ends in -ando (-ar verbs) or -iendo (-er and -ir verbs), and the stress always falls on an or ien: ca-mi-nan-do, co-mien-do (ie is one syllable). Mientras means while. In llovía, the ll sounds like the sh in shoe in Buenos Aires.',
          examples: [
            {
              target: 'Llovía y yo estaba caminando por la calle.',
              base: 'It was raining and I was walking down the street.',
            },
            {
              target: 'Mientras estaba comiendo, llegó mi hermano.',
              base: 'While I was eating, my brother arrived.',
            },
          ],
        },
        takeaways: [
          'You describe the scene with the imperfect: llovía, había, estaba.',
          'You say what was going on with estaba + -ando / -iendo.',
        ],
        exercises: [
          ex.translationChoice(
            'llovía',
            'it was raining',
            ['it rains', 'it was cold', 'it was snowing'],
            ['es-llovia'],
            { id: 'es.ex.4ornluj88kc9os' },
          ),
          ex.translationChoice(
            'mientras',
            'while',
            ['when', 'before', 'suddenly'],
            ['es-mientras'],
            { id: 'es.ex.8gp0x3lsta4oux' },
          ),
          ex.fillBlank(
            'Ayer ___ mucho y no salí.',
            'Yesterday it was raining a lot and I didn’t go out.',
            'llovía',
            ['llueve', 'nieva', 'había'],
            ['es-llovia'],
            {
              id: 'es.ex.rsmv460eqe9azz',
              explanation:
                'Llovía is the imperfect of llover: it describes the weather in the past. Llueve is the present.',
            },
          ),
          ex.listenChoice(
            'Estaba caminando.',
            ['Estaba comiendo.', 'Estoy caminando.', 'Estaba cocinando.'],
            ['es-estaba'],
            { id: 'es.ex.o6awkiks6d5i4c' },
          ),
          ex.fillBlank(
            'Yo ___ mirando la tele.',
            'I was watching TV.',
            'estaba',
            ['estoy', 'era', 'había'],
            ['es-estaba'],
            {
              id: 'es.ex.9bilonu2m6p9ox',
              explanation:
                'An action in progress in the past: estaba + gerund. Estoy mirando is now; era is ser, not estar.',
            },
          ),
          ex.matchPairs(
            [
              ['mientras', 'while'],
              ['estaba', 'I was (in the middle of)'],
              ['llovía', 'it was raining'],
              ['¿qué pasó?', 'what happened?'],
            ],
            ['es-mientras', 'es-estaba', 'es-llovia', 'es-que-paso'],
            { id: 'es.ex.1ps0s2k61moxn6' },
          ),
          ex.orderWords(
            'Yo estaba en casa mientras llovía.',
            'I was at home while it was raining.',
            ['es-estaba', 'es-mientras', 'es-llovia'],
            { id: 'es.ex.k4aa44qxwciniw' },
          ),
          ex.listenChoice(
            'Llovía mucho.',
            ['Llueve mucho.', 'Llovía poco.', 'Nieva mucho.'],
            ['es-llovia'],
            { id: 'es.ex.ya4od83gb9ixi4' },
          ),
          ex.translateWrite(
            'I was eating when my brother arrived.',
            'Estaba comiendo cuando llegó mi hermano.',
            ['es-estaba'],
            {
              id: 'es.ex.wuhmf8rv8oz7yn',
              acceptedAnswers: [
                'Yo estaba comiendo cuando llegó mi hermano.',
                'Estaba comiendo cuando mi hermano llegó.',
                'Yo estaba comiendo cuando mi hermano llegó.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué estabas haciendo?',
            'Say that you were watching TV (start with «Estaba…»).',
            'Estaba mirando la tele.',
            [
              'Estaba mirando la tele',
              'Yo estaba mirando la tele.',
              'Estaba mirando la televisión.',
            ],
            ['es-estaba'],
            { id: 'es.ex.74lpuvxfs8n62q' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'De repente…',
        objective:
          'Tell the events of a story with de repente, entonces, por suerte and lamentablemente.',
        intro: {
          explanation:
            'After the scene comes the event: de repente (suddenly) + preterite. Entonces (then, so) introduces the next step, and the story ends with por suerte (luckily) or lamentablemente (unfortunately). In accidente the first c sounds like k and the second like s (seseo): ak-si-den-te. Fue (it was) is the preterite of ser, for one finished event: fue un accidente.',
          examples: [
            {
              target: 'Estaba en la calle y, de repente, vi un accidente.',
              base: 'I was in the street and suddenly I saw an accident.',
            },
            {
              target: 'Por suerte, la policía llegó a tiempo.',
              base: 'Luckily, the police arrived on time.',
            },
          ],
        },
        takeaways: [
          'You introduce the event with de repente and the next step with entonces.',
          'You end a story with por suerte or lamentablemente.',
        ],
        exercises: [
          ex.translationChoice(
            'de repente',
            'suddenly',
            ['luckily', 'then', 'while'],
            ['es-de-repente'],
            { id: 'es.ex.z7nkyframe9ogd' },
          ),
          ex.matchPairs(
            [
              ['entonces', 'then'],
              ['por suerte', 'luckily'],
              ['lamentablemente', 'unfortunately'],
              ['el accidente', 'the accident'],
            ],
            ['es-entonces', 'es-por-suerte', 'es-lamentablemente', 'es-el-accidente'],
            { id: 'es.ex.la2ezcorb8wtu8' },
          ),
          ex.fillBlank(
            'Estaba en casa y, ___, escuché un ruido.',
            'I was at home and suddenly I heard a noise.',
            'de repente',
            ['por suerte', 'mientras', 'lamentablemente'],
            ['es-de-repente'],
            {
              id: 'es.ex.jad69hbhww7dlu',
              skill: 'vocabulary',
              explanation:
                'De repente (suddenly) introduces the unexpected event, which goes in the preterite: escuché.',
            },
          ),
          ex.listenChoice(
            'Por suerte, estaba bien.',
            [
              'Lamentablemente, estaba mal.',
              'Por suerte, estaba en casa.',
              'Entonces, estaba bien.',
            ],
            ['es-por-suerte'],
            { id: 'es.ex.tt5psjh0guaoo7' },
          ),
          question(
            'es.ex.42tyzio918s70v',
            NOTICIA,
            'What was the weather like last night?',
            'It was raining a lot',
            ['It was very hot', 'It was snowing', 'It was sunny'],
            ['es-llovia'],
            'Ana writes “Llovía mucho y había poca luz”.',
          ),
          question(
            'es.ex.yixzx7tg8gpx8n',
            NOTICIA,
            'What was Ana doing when she heard the noise?',
            'Watching TV',
            ['Sleeping', 'Walking in the street', 'Driving her car'],
            ['es-mientras', 'es-estaba'],
            '“Mientras yo estaba mirando la tele, escuché un ruido muy fuerte.”',
          ),
          ex.fillBlank(
            'Tuve un accidente. ___, llamé a la policía.',
            'I had an accident. Then I called the police.',
            'Entonces',
            ['Mientras', 'Antes', 'Generalmente'],
            ['es-entonces', 'es-el-accidente'],
            {
              id: 'es.ex.u87ej3nztyvrmc',
              skill: 'vocabulary',
              explanation: 'Entonces (then, so) introduces the next step in a story.',
            },
          ),
          question(
            'es.ex.re3rdpacalmwvu',
            NOTICIA,
            'How was the man in the car?',
            'He was fine',
            ['He was badly hurt', 'He ran away', 'He called Ana'],
            ['es-por-suerte', 'es-el-accidente'],
            '“Fue un accidente… Por suerte, el señor del auto estaba bien.”',
          ),
          ex.translateWrite(
            'Unfortunately, I arrived late.',
            'Lamentablemente, llegué tarde.',
            ['es-lamentablemente'],
            { id: 'es.ex.oc2ijt6yqbbmhp', acceptedAnswers: ['Lamentablemente llegué tarde.'] },
          ),
          ex.shortAnswer(
            '¿Qué pasó en la calle?',
            'Say that suddenly you saw an accident (start with «De repente…»).',
            'De repente, vi un accidente.',
            [
              'De repente vi un accidente.',
              'De repente, vi un accidente en la calle.',
              'De repente vi un accidente en la calle.',
            ],
            ['es-de-repente', 'es-el-accidente'],
            { id: 'es.ex.3bdhow56d2j5c5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Tuve miedo',
        objective: 'Say how you felt and what you lost.',
        intro: {
          explanation:
            'To be scared is tener miedo, literally to have fear (like tener frío or tener calor). In a story: tenía miedo describes how you felt, tuve miedo is the moment you got scared. Miedo is a noun, so you say mucho miedo, not muy miedo. Perder means to lose (perdí la billetera) and also to miss a train or a bus (perdí el colectivo). Your neighbor is el vecino or la vecina.',
          examples: [
            { target: 'Perdí la billetera en el colectivo.', base: 'I lost my wallet on the bus.' },
            { target: 'Tuve mucho miedo.', base: 'I was very scared.' },
          ],
        },
        takeaways: [
          'You say you were scared with tuve miedo or tenía miedo.',
          'You say what you lost or missed with perdí.',
        ],
        exercises: [
          ex.translationChoice(
            'perder',
            'to lose',
            ['to steal', 'to find', 'to leave'],
            ['es-perder'],
            { id: 'es.ex.rnzvfrh18wfy6y' },
          ),
          ex.translationChoice(
            'el vecino',
            'the neighbor',
            ['the friend', 'the brother', 'the police officer'],
            ['es-el-vecino'],
            { id: 'es.ex.vs042vlvm9y3o3' },
          ),
          ex.fillBlank(
            'Tuve ___ miedo.',
            'I was very scared.',
            'mucho',
            ['muy', 'mucha', 'poco'],
            ['es-tener-miedo'],
            {
              id: 'es.ex.ww7sqc5nasnlvt',
              explanation:
                'Miedo is a masculine noun, so it takes mucho. Muy goes with adjectives (muy cansado).',
            },
          ),
          ex.listenChoice(
            'Perdí la billetera.',
            ['Perdí la llave.', 'Me robaron la billetera.', 'Tengo la billetera.'],
            ['es-perder', 'es-la-billetera'],
            { id: 'es.ex.1fsut9kb1z4mci' },
          ),
          question(
            'es.ex.f6nre4j2qim8gr',
            BILLETERA,
            'When did someone steal Sofía’s wallet?',
            'While she was going home on the bus',
            [
              'While she was at work',
              'While she was having a coffee',
              'In the morning, on the subway',
            ],
            ['es-mientras', 'es-robar', 'es-la-billetera'],
            'Sofía says “mientras volvía a casa en el colectivo, alguien me robó la billetera”.',
          ),
          question(
            'es.ex.7fxi5i8z0ct6fy',
            BILLETERA,
            'What did Sofía do after the theft?',
            'She called the police',
            ['She went home on foot', 'She called Diego', 'She bought a new wallet'],
            ['es-entonces', 'es-la-policia'],
            '“Tuve mucho miedo. Entonces llamé a la policía.”',
          ),
          question(
            'es.ex.996n2lxn6tqq3l',
            BILLETERA,
            'What was the good news?',
            'She still had her phone',
            ['The police found her wallet', 'She wasn’t scared', 'Diego found her wallet'],
            ['es-por-suerte', 'es-lamentablemente'],
            'The wallet wasn’t found (“lamentablemente no”), but “por suerte tenía el celular en la mochila”.',
          ),
          ex.orderWords(
            'Mi vecina perdió la llave de la casa.',
            'My neighbor lost the house key.',
            ['es-el-vecino', 'es-perder'],
            { id: 'es.ex.y8ou2lni3k2gm5' },
          ),
          ex.translateWrite(
            'My neighbor was scared.',
            'Mi vecino tenía miedo.',
            ['es-el-vecino', 'es-tener-miedo'],
            {
              id: 'es.ex.jbvml6gmyjgrm0',
              acceptedAnswers: [
                'Mi vecina tenía miedo.',
                'Mi vecino tuvo miedo.',
                'Mi vecina tuvo miedo.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué perdiste?',
            'Say that you lost your keys (start with «Perdí…»).',
            'Perdí las llaves.',
            ['Perdí las llaves', 'Perdí mis llaves.', 'Perdí la llave.', 'Perdí mi llave.'],
            ['es-perder'],
            { id: 'es.ex.djopmhrgfj3w4y' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Acabo de llegar',
        objective: 'Say what you have just done and understand a complete short story.',
        intro: {
          explanation:
            'Acabar de + infinitive means to have just done something: acabo de llegar (I’ve just arrived). Only acabar changes: vos acabás de comer, ella acaba de salir. In Argentina this is the usual way to say I’ve just…; he llegado is much less common here. A story has a rhythm: the scene in the imperfect (estaba, llovía), the event with de repente + preterite, the next step with entonces, and the end with por suerte or lamentablemente.',
          examples: [
            { target: 'Acabo de llegar a casa.', base: 'I’ve just got home.' },
            { target: 'Mi hermana acaba de salir.', base: 'My sister has just gone out.' },
          ],
        },
        takeaways: [
          'You say what you have just done with acabo de + infinitive.',
          'You understand a story told with the imperfect, the preterite and connectors.',
        ],
        exercises: [
          ex.translationChoice(
            'acabo de',
            'I have just',
            ['I used to', 'I am going to', 'I was'],
            ['es-acabo-de'],
            { id: 'es.ex.0virl7rgc0y6h8' },
          ),
          ex.fillBlank(
            'Acabo ___ llegar a la estación.',
            'I’ve just arrived at the station.',
            'de',
            ['a', 'en', 'que'],
            ['es-acabo-de'],
            {
              id: 'es.ex.qdqlxl6s0crnzx',
              explanation: 'The structure is acabar de + infinitive: acabo de llegar.',
            },
          ),
          question(
            'es.ex.q7wkmbwsj2fcyj',
            LLAMADA,
            'Where is Lucía now?',
            'At the station',
            ['On the train', 'At home', 'At a café'],
            ['es-acabo-de'],
            'She says “Acabo de llegar a la estación”: she has just arrived at the station.',
          ),
          question(
            'es.ex.h5bfwu2q15da7a',
            LLAMADA,
            'Why did Lucía miss the eight o’clock train?',
            'She was having a coffee and lost track of time',
            ['Someone stole her wallet', 'It was raining a lot', 'The train left early'],
            ['es-de-repente', 'es-perder', 'es-estaba'],
            '“Estaba tomando un café y, de repente, vi la hora. ¡Era muy tarde!”',
          ),
          ex.listenChoice(
            'Acabo de llegar.',
            ['Acabo de salir.', 'Voy a llegar.', 'Acaba de llegar.'],
            ['es-acabo-de'],
            { id: 'es.ex.yivonuf37xvhoh' },
          ),
          ex.matchPairs(
            [
              ['acabo de', 'I have just'],
              ['de repente', 'suddenly'],
              ['mientras', 'while'],
              ['tener miedo', 'to be scared'],
            ],
            ['es-acabo-de', 'es-de-repente', 'es-mientras', 'es-tener-miedo'],
            { id: 'es.ex.j1ar8ssybyk5rd' },
          ),
          ex.fillBlank(
            'Estaba en el colectivo cuando alguien me ___ el celular.',
            'I was on the bus when someone stole my phone.',
            'robó',
            ['robaba', 'robar', 'roba'],
            ['es-robar', 'es-estaba', 'es-alguien'],
            {
              id: 'es.ex.p8xp86aqsep1cy',
              explanation:
                'Estaba describes the scene (imperfect); the event that interrupts it goes in the preterite: robó.',
            },
          ),
          ex.listenChoice(
            'Llovía y tenía miedo.',
            ['Llueve y tengo miedo.', 'Llovía y tenía frío.', 'Llovía y tuve miedo.'],
            ['es-llovia', 'es-tener-miedo'],
            { id: 'es.ex.j4oyt0wp86bwak' },
          ),
          ex.translateWrite('I’ve just eaten.', 'Acabo de comer.', ['es-acabo-de'], {
            id: 'es.ex.o30a6rz3v8ika0',
            acceptedAnswers: ['Yo acabo de comer.'],
          }),
          ex.shortAnswer(
            '¿Qué pasó? ¿Por qué llegaste tarde?',
            'Say that you missed the bus (start with «Perdí…»).',
            'Perdí el colectivo.',
            [
              'Perdí el colectivo',
              'Porque perdí el colectivo.',
              'Lamentablemente, perdí el colectivo.',
            ],
            ['es-perder', 'es-que-paso'],
            { id: 'es.ex.2uheppsqk4181q' },
          ),
        ],
      },
    ],
  },
};

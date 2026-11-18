import type { ExpansionUnitDef } from '../../a2-expansion';
import { ex } from '../../builders';
import { dialogue, question, reading } from './context-helpers';
import { w } from './word';

/**
 * A2 U17 «Contar una historia» (docs/A2_EN_COMPLETION.md): el past continuous (was/were + -ing),
 * when y while, accidentes y cómo ordenar un relato (at first, then, the next day, in the end).
 * Supone A1 y A2 U1–U16 (was/were de U1, pasados de U2 y U3, -ing de U5).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ACCIDENT = dialogue('en.stim.a2-u17-accident', 'Mia le pregunta a Leo por su brazo.', [
  ['Mia', 'What happened to your arm?'],
  ['Leo', 'I fell when I was riding my bike.'],
  ['Mia', 'Did it hurt?'],
  ['Leo', 'Yes, a lot, and I was very scared.'],
  ['Leo', 'Luckily, a doctor was in the street, and she helped me.'],
]);

const BEACH = reading(
  'en.stim.a2-u17-beach',
  'post',
  'Emma cuenta un día de sus vacaciones.',
  [
    'Last summer, I went to the beach with my family.',
    'At first, the weather was sunny and warm.',
    'We were swimming in the sea when suddenly it began to rain.',
    'We went back to the car.',
    'The next day, the sky was blue again.',
    'In the end, it was a great vacation!',
  ],
  { from: 'Emma', title: 'A day at the beach' },
);

const STATION = dialogue('en.stim.a2-u17-station', 'Leo cuenta algo que le pasó el viernes.', [
  ['Leo', 'Last Friday, I was waiting for the train at the station.'],
  ['Leo', 'I was reading a book when suddenly a woman said hello.'],
  ['Leo', 'It was my old teacher from school!'],
  ['Leo', 'We talked a lot, and I forgot the train.'],
  ['Leo', 'In the end, I took the next train.'],
]);

export const EN_A2_U17: ExpansionUnitDef = {
  names: ['Mia', 'Leo', 'Emma'],
  unit: {
    position: 17,
    title: 'Contar una historia',
    titleEn: 'Telling a story',
    description:
      'Lo que estaba pasando (was/were + -ing), when y while, accidentes y el orden de un relato.',
    emoji: '📖',
    objective:
      'Podés contar una historia corta del pasado: qué estaba pasando, qué pasó de repente y cómo terminó.',
    grammar: {
      title: 'Past continuous',
      explanation:
        'Was/were + verbo con -ing cuenta lo que estaba pasando en un momento del pasado. La acción corta que la interrumpe va en past simple: I was cooking when the phone rang.',
      examples: [
        { target: 'I was reading at nine.', base: 'A las nueve estaba leyendo.' },
        {
          target: 'I was sleeping when the phone rang.',
          base: 'Estaba durmiendo cuando sonó el teléfono.',
        },
        {
          target: 'While we were walking, we heard a noise.',
          base: 'Mientras caminábamos, oímos un ruido.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 completo: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-story',
        'story',
        'historia / cuento',
        '/ˈstɔri/',
        '📖',
        'I read a story every night.',
        'Leo una historia todas las noches.',
        ['stories'],
        ['historia', 'cuento'],
      ),
      w(
        'en-while',
        'while',
        'mientras',
        '/waɪl/',
        undefined,
        'I was cooking while she was reading.',
        'Yo cocinaba mientras ella leía.',
        ['stories', 'grammar'],
      ),
      w(
        'en-suddenly',
        'suddenly',
        'de repente',
        '/ˈsʌdənli/',
        '⚡',
        'Suddenly, my phone rang.',
        'De repente, sonó mi teléfono.',
        ['stories'],
        ['de pronto'],
      ),
      w(
        'en-happened',
        'happened',
        'pasó / sucedió',
        '/ˈhæpənd/',
        undefined,
        'What happened?',
        '¿Qué pasó?',
        ['stories', 'past'],
        ['pasó', 'sucedió', 'ocurrió'],
      ),
      w(
        'en-at-first',
        'at first',
        'al principio',
        '/æt ˈfɜrst/',
        undefined,
        'At first, I was nervous.',
        'Al principio estaba nervioso.',
        ['stories'],
      ),
      w(
        'en-in-the-end',
        'in the end',
        'al final',
        '/ɪn ðə ˈɛnd/',
        undefined,
        'In the end, we were happy.',
        'Al final, estábamos contentos.',
        ['stories'],
        ['finalmente'],
      ),
      w(
        'en-the-next-day',
        'the next day',
        'al día siguiente',
        '/ðə ˈnɛkst ˈdeɪ/',
        undefined,
        'The next day, we went to the beach.',
        'Al día siguiente fuimos a la playa.',
        ['stories'],
      ),
      w(
        'en-fell',
        'fell',
        'me caí / se cayó (fall)',
        '/fɛl/',
        undefined,
        'She fell in the street.',
        'Se cayó en la calle.',
        ['stories', 'past'],
        ['me caí', 'se cayó', 'cayó'],
      ),
      w(
        'en-broke',
        'broke',
        'rompí / rompió (break)',
        '/broʊk/',
        undefined,
        'He broke his arm.',
        'Se rompió el brazo.',
        ['stories', 'past'],
        ['rompí', 'rompió', 'se rompió'],
      ),
      w(
        'en-rang',
        'rang',
        'sonó (ring)',
        '/ræŋ/',
        '📞',
        'My phone rang at six.',
        'Mi teléfono sonó a las seis.',
        ['stories', 'past'],
      ),
      w(
        'en-began',
        'began',
        'empecé / empezó (begin)',
        '/bɪˈɡæn/',
        undefined,
        'It began to rain.',
        'Empezó a llover.',
        ['stories', 'past'],
        ['empezó', 'comenzó'],
      ),
      w(
        'en-heard',
        'heard',
        'oí / oyó (hear)',
        '/hɜrd/',
        '👂',
        'I heard a noise.',
        'Oí un ruido.',
        ['stories', 'past'],
        ['oí', 'oyó', 'escuché', 'escuchó'],
      ),
      w(
        'en-noise',
        'noise',
        'ruido',
        '/nɔɪz/',
        undefined,
        'I heard a noise outside.',
        'Oí un ruido afuera.',
        ['stories'],
      ),
      w(
        'en-scared',
        'scared',
        'asustado / asustada',
        '/skɛrd/',
        '😱',
        'I was very scared.',
        'Estaba muy asustado.',
        ['stories', 'feelings'],
        ['asustado', 'asustada', 'con miedo'],
      ),
      w(
        'en-luckily',
        'luckily',
        'por suerte',
        '/ˈlʌkəli/',
        '🍀',
        'Luckily, the doctor was there.',
        'Por suerte, el médico estaba ahí.',
        ['stories'],
        ['afortunadamente'],
      ),
      w(
        'en-outside',
        'outside',
        'afuera',
        '/ˌaʊtˈsaɪd/',
        undefined,
        'The children were playing outside.',
        'Los chicos estaban jugando afuera.',
        ['stories', 'places'],
        ['fuera'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Lo que estaba pasando',
        objective: 'Contar qué estaba pasando en un momento del pasado.',
        intro: {
          explanation:
            'El past continuous cuenta lo que estaba pasando en un momento del pasado: was/were + verbo con -ing. Con I, he, she e it va was; con you, we y they, were.',
          examples: [
            { target: 'I was reading at nine.', base: 'A las nueve estaba leyendo.' },
            { target: 'They were watching a movie.', base: 'Estaban mirando una película.' },
          ],
        },
        takeaways: [
          'Contás qué estaba pasando: I was cooking, they were sleeping.',
          'Preguntás: What were you doing at eight?',
        ],
        exercises: [
          ex.fillBlank(
            "At eight o'clock I ___ cooking.",
            'A las ocho estaba cocinando.',
            'was',
            ['were', 'am', 'did'],
            ['en-was', 'en-cook'],
            {
              id: 'en.ex.0zp8afdnu4tw8w',
              explanation: 'Past continuous: was/were + -ing. Con I, he, she e it va was.',
            },
          ),
          ex.fillBlank(
            'They ___ watching a movie.',
            'Estaban mirando una película.',
            'were',
            ['was', 'are', 'did'],
            ['en-were', 'en-watch', 'en-movie'],
            { id: 'en.ex.5i7iej7zuuffk0' },
          ),
          ex.fillBlank(
            'What were you ___ at nine?',
            '¿Qué estabas haciendo a las nueve?',
            'doing',
            ['do', 'did', 'done'],
            ['en-do', 'en-were'],
            {
              id: 'en.ex.w0v2yn50nfns90',
              explanation: 'Después de was/were va el verbo con -ing: doing.',
            },
          ),
          ex.translationChoice(
            'outside',
            'afuera',
            ['adentro', 'arriba', 'lejos'],
            ['en-outside'],
            {
              id: 'en.ex.ffhshmyx542f8p',
            },
          ),
          ex.listenChoice(
            'The children were playing outside.',
            [
              'The children are playing outside.',
              'The children were sleeping outside.',
              'The boys were playing outside.',
            ],
            ['en-outside', 'en-play'],
            { id: 'en.ex.71si204qgg0b2j' },
          ),
          ex.orderWords(
            'I was reading a story in bed.',
            'Estaba leyendo una historia en la cama.',
            ['en-story', 'en-read', 'en-bed'],
            {
              id: 'en.ex.2euwe4k8yawc49',
            },
          ),
          ex.shortAnswer(
            'What were you doing at ten last night? (dormías)',
            '¿Qué estabas haciendo anoche a las diez?',
            'I was sleeping.',
            ['I was sleeping at ten.', 'I was sleeping at ten last night.', 'Sleeping.'],
            ['en-was', 'en-sleep'],
            { id: 'en.ex.ivgq5cfztym084' },
          ),
          ex.translateWrite(
            'Estaba lloviendo afuera.',
            'It was raining outside.',
            ['en-outside', 'en-rain'],
            {
              id: 'en.ex.1gwfxneog45sj7',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'When y while',
        objective: 'Contar una acción que interrumpe otra.',
        intro: {
          explanation:
            'Cuando una acción corta interrumpe otra larga, la larga va en past continuous y la corta en past simple: I was cooking when the phone rang. While (mientras) va con la acción larga: While I was cooking, the phone rang.',
          examples: [
            {
              target: 'I was sleeping when the phone rang.',
              base: 'Estaba durmiendo cuando sonó el teléfono.',
            },
            {
              target: 'While we were walking, we heard a noise.',
              base: 'Mientras caminábamos, oímos un ruido.',
            },
          ],
        },
        takeaways: [
          'Contás una acción que interrumpe otra: I was cooking when the phone rang.',
          'Usás while con la acción larga.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['while', 'mientras'],
              ['suddenly', 'de repente'],
              ['noise', 'ruido'],
              ['heard', 'oí / oyó (hear)'],
            ],
            ['en-while', 'en-suddenly', 'en-noise', 'en-heard'],
            { id: 'en.ex.cul30c54ap0edr' },
          ),
          ex.fillBlank(
            'I was sleeping ___ the phone rang.',
            'Estaba durmiendo cuando sonó el teléfono.',
            'when',
            ['while', 'then', 'after'],
            ['en-when', 'en-rang', 'en-phone'],
            {
              id: 'en.ex.ay6wk273afvsau',
              explanation:
                'When va con la acción corta (rang); while, con la larga (was sleeping).',
            },
          ),
          ex.fillBlank(
            '___ we were walking, we heard a noise.',
            'Mientras caminábamos, oímos un ruido.',
            'While',
            ['Then', 'After', 'Because'],
            ['en-while', 'en-heard', 'en-noise'],
            { id: 'en.ex.uhhnj18gsk9vgv' },
          ),
          ex.fillBlank(
            'She was reading when she ___ a noise.',
            'Estaba leyendo cuando oyó un ruido.',
            'heard',
            ['hear', 'hears', 'hearing'],
            ['en-heard', 'en-noise'],
            { id: 'en.ex.uyouv6n8h7qokx', explanation: 'Hear es irregular: el pasado es heard.' },
          ),
          ex.listenChoice(
            'Suddenly, the phone rang.',
            ['Then, the phone rang.', 'Suddenly, the door opened.', 'Suddenly, the baby cried.'],
            ['en-suddenly', 'en-rang'],
            { id: 'en.ex.oxmct3lt7vas3d' },
          ),
          ex.orderWords(
            'I was cooking when you called.',
            'Estaba cocinando cuando llamaste.',
            ['en-cook', 'en-call', 'en-when'],
            {
              id: 'en.ex.1ku1thjz3immyy',
            },
          ),
          ex.translateWrite(
            'Oí un ruido afuera.',
            'I heard a noise outside.',
            ['en-heard', 'en-noise', 'en-outside'],
            {
              id: 'en.ex.0o7ywq6sp7plmq',
            },
          ),
          ex.translateWrite(
            'Estaba durmiendo cuando sonó el teléfono.',
            'I was sleeping when the phone rang.',
            ['en-rang', 'en-when'],
            {
              id: 'en.ex.5u7u9id1ph7wc9',
              acceptedAnswers: [
                'When the phone rang, I was sleeping.',
                'He was sleeping when the phone rang.',
                'She was sleeping when the phone rang.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Qué pasó?',
        objective: 'Preguntar qué pasó y contar un accidente.',
        intro: {
          explanation:
            'Para preguntar qué pasó: What happened? Un accidente se cuenta con past simple y past continuous: I fell when I was running. Luckily (por suerte) cuenta lo bueno.',
          examples: [
            { target: 'What happened?', base: '¿Qué pasó?' },
            { target: 'He fell and broke his arm.', base: 'Se cayó y se rompió el brazo.' },
          ],
        },
        takeaways: [
          'Preguntás What happened? y contás un accidente.',
          'Decís cómo te sentiste: I was scared.',
        ],
        exercises: [
          ex.translationChoice(
            'happened',
            'pasó / sucedió',
            ['se cayó', 'se rompió', 'empezó'],
            ['en-happened'],
            {
              id: 'en.ex.274xxjchu8gcjf',
            },
          ),
          ex.imageChoice('😱', 'scared', ['bored', 'funny', 'happy'], ['en-scared'], {
            id: 'en.ex.rq7wmxvcpsn423',
          }),
          ex.fillBlank(
            'He ___ when he was running in the park.',
            'Se cayó cuando estaba corriendo en el parque.',
            'fell',
            ['fall', 'felt', 'falls'],
            ['en-fell', 'en-run', 'en-park'],
            {
              id: 'en.ex.us14ixncigja4k',
              explanation:
                'Fall (caerse) es irregular: el pasado es fell. Felt es el pasado de feel.',
            },
          ),
          ex.fillBlank(
            'She fell and ___ her arm.',
            'Se cayó y se rompió el brazo.',
            'broke',
            ['made', 'took', 'had'],
            ['en-broke', 'en-arm'],
            { id: 'en.ex.c5yovmzfk2l2cn', skill: 'vocabulary' },
          ),
          question(
            'en.ex.kd9xzohxax462f',
            ACCIDENT,
            '¿Cómo se lastimó Leo?',
            'Se cayó de la bici',
            ['Se cayó en el gimnasio', 'Lo chocó un auto', 'Se cayó corriendo'],
            ['en-fell', 'en-ride', 'en-bike'],
            'Leo dice: «I fell when I was riding my bike».',
          ),
          question(
            'en.ex.oisqvskn0r4yto',
            ACCIDENT,
            '¿Quién lo ayudó?',
            'Una médica que estaba en la calle',
            ['Mia', 'Un policía', 'Nadie'],
            ['en-luckily', 'en-doctor'],
            'Leo dice: «Luckily, a doctor was in the street, and she helped me».',
          ),
          ex.listenChoice(
            'Luckily, the doctor was there.',
            [
              'Suddenly, the doctor was there.',
              'Luckily, the driver was there.',
              'Luckily, the doctor was here.',
            ],
            ['en-luckily', 'en-doctor'],
            { id: 'en.ex.m1xyucnrdy7wje' },
          ),
          ex.shortAnswer(
            'What happened? (te caíste)',
            '¿Qué pasó?',
            'I fell.',
            ['I fell down.', 'I fell!'],
            ['en-fell', 'en-happened'],
            { id: 'en.ex.im6v2bm4n5ejmp' },
          ),
          ex.translateWrite('Estaba muy asustada.', 'I was very scared.', ['en-scared'], {
            id: 'en.ex.3jjw3d21cy79fv',
            acceptedAnswers: ['She was very scared.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'El orden de la historia',
        objective: 'Ordenar un relato: al principio, después, al día siguiente, al final.',
        intro: {
          explanation:
            'Para ordenar una historia: at first (al principio), then (después), the next day (al día siguiente) e in the end (al final). Para decir que algo empezó: It began to rain (empezó a llover).',
          examples: [
            { target: 'At first, I was nervous.', base: 'Al principio estaba nervioso.' },
            {
              target: 'In the end, we were very happy.',
              base: 'Al final estábamos muy contentos.',
            },
          ],
        },
        takeaways: [
          'Ordenás una historia con at first, then, the next day e in the end.',
          'Contás cuándo empezó algo: It began to rain.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['at first', 'al principio'],
              ['then', 'después / entonces'],
              ['the next day', 'al día siguiente'],
              ['in the end', 'al final'],
            ],
            ['en-at-first', 'en-then', 'en-the-next-day', 'en-in-the-end'],
            { id: 'en.ex.e2cudr71qesdjs' },
          ),
          ex.fillBlank(
            '___, I was nervous, but then I was happy.',
            'Al principio estaba nervioso, pero después estaba contento.',
            'At first',
            ['In the end', 'The next day', 'Suddenly'],
            ['en-at-first', 'en-nervous'],
            { id: 'en.ex.dp7fioij9xnp1q', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'It ___ to rain when we were at the beach.',
            'Empezó a llover cuando estábamos en la playa.',
            'began',
            ['is', 'did', 'went'],
            ['en-began', 'en-rain', 'en-beach'],
            {
              id: 'en.ex.6ukmbvl9upqyo7',
              explanation: 'Begin (empezar) es irregular: el pasado es began.',
            },
          ),
          ex.listenChoice(
            'In the end, we found the key.',
            [
              'In the end, we lost the key.',
              'At first, we found the key.',
              'In the end, we found the bag.',
            ],
            ['en-in-the-end', 'en-found'],
            { id: 'en.ex.5r3r28kjji4e1m' },
          ),
          ex.orderWords(
            'The next day we went to the mountains.',
            'Al día siguiente fuimos a la montaña.',
            ['en-the-next-day', 'en-went', 'en-mountain'],
            {
              id: 'en.ex.ruvuqfqk27pb38',
            },
          ),
          question(
            'en.ex.7y2bn9j5m1d5pg',
            BEACH,
            '¿Qué estaban haciendo cuando empezó a llover?',
            'Nadando en el mar',
            ['Comiendo en el auto', 'Caminando por la playa', 'Durmiendo en el hotel'],
            ['en-suddenly', 'en-began', 'en-swim'],
            'Emma escribe: «We were swimming in the sea when suddenly it began to rain».',
          ),
          question(
            'en.ex.eczqdaq404oxd3',
            BEACH,
            '¿Cómo estuvo el tiempo al día siguiente?',
            'Lindo: el cielo estaba azul',
            ['Llovió todo el día', 'Hizo mucho frío', 'Hubo tormenta'],
            ['en-the-next-day', 'en-sky'],
            'Emma escribe: «The next day, the sky was blue again».',
          ),
          ex.translateWrite(
            'Al final, estábamos muy contentos.',
            'In the end, we were very happy.',
            ['en-in-the-end', 'en-happy'],
            {
              id: 'en.ex.75jjafqpbra0op',
            },
          ),
          ex.translateWrite(
            'Al día siguiente, empezó a nevar.',
            'The next day, it began to snow.',
            ['en-the-next-day', 'en-began', 'en-snow'],
            {
              id: 'en.ex.u4t501rt9w1bv5',
              acceptedAnswers: [
                'The next day it started to snow.',
                'The next day, it began snowing.',
                'The next day, it started snowing.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Tu historia',
        objective: 'Contar una historia corta con comienzo, problema y final.',
        intro: {
          explanation:
            'Una historia corta tiene un comienzo (dónde estabas y qué estabas haciendo), algo que pasó de repente y un final. Usá was/were + -ing para la escena y el past simple para lo que pasó.',
          examples: [
            {
              target: 'I was walking home when I saw an old friend.',
              base: 'Volvía caminando a casa cuando vi a un viejo amigo.',
            },
            { target: 'In the end, we had dinner together.', base: 'Al final, cenamos juntos.' },
          ],
        },
        takeaways: [
          'Contás una historia corta con comienzo, problema y final.',
          'Combinás el past continuous y el past simple.',
        ],
        exercises: [
          question(
            'en.ex.txwlhiw1lc3jpj',
            STATION,
            '¿Dónde estaba Leo?',
            'En la estación, esperando el tren',
            ['En el tren, leyendo un libro', 'En la escuela', 'En la casa de su profesora'],
            ['en-wait', 'en-station', 'en-train'],
            'Leo dice: «I was waiting for the train at the station».',
          ),
          question(
            'en.ex.w0knocmo7fcniw',
            STATION,
            '¿Qué pasó al final?',
            'Tomó el tren siguiente',
            ['No viajó', 'Volvió a su casa', 'Tomó un taxi'],
            ['en-in-the-end', 'en-took'],
            'Leo dice: «In the end, I took the next train».',
          ),
          ex.fillBlank(
            'I was walking home when I ___ an old friend.',
            'Volvía caminando a casa cuando vi a un viejo amigo.',
            'saw',
            ['see', 'seen', 'sees'],
            ['en-saw', 'en-walk'],
            { id: 'en.ex.gfiqmp5slp25lw' },
          ),
          ex.listenChoice(
            'We were having dinner when suddenly we heard a noise.',
            [
              'We were having lunch when suddenly we heard a noise.',
              'We had dinner and then we heard a noise.',
              'We were having dinner when suddenly the phone rang.',
            ],
            ['en-suddenly', 'en-heard', 'en-noise'],
            { id: 'en.ex.f75ed6tuobw62p' },
          ),
          ex.orderWords(
            'It began to rain while I was waiting.',
            'Empezó a llover mientras esperaba.',
            ['en-while', 'en-began', 'en-wait'],
            {
              id: 'en.ex.zyl90hmk0lxizu',
            },
          ),
          ex.fillBlank(
            '___, a police officer was there and he helped us.',
            'Por suerte, había un policía y nos ayudó.',
            'Luckily',
            ['Suddenly', 'At first', 'While'],
            ['en-luckily', 'en-police-officer'],
            { id: 'en.ex.3oz3cgttu2cdo3', skill: 'vocabulary' },
          ),
          ex.shortAnswer(
            'What were you doing when it began to rain? (caminabas por el parque)',
            '¿Qué estabas haciendo cuando empezó a llover?',
            'I was walking in the park.',
            [
              'I was walking in the park when it began to rain.',
              'Walking in the park.',
              'I was walking through the park.',
            ],
            ['en-walk', 'en-park', 'en-began'],
            { id: 'en.ex.ppisxstvzfdlcy' },
          ),
          ex.translateWrite(
            'Mientras cocinaba, oí un ruido.',
            'While I was cooking, I heard a noise.',
            ['en-while', 'en-heard', 'en-noise'],
            {
              id: 'en.ex.vwec44zn5v3jwo',
              acceptedAnswers: [
                'I heard a noise while I was cooking.',
                'While she was cooking, she heard a noise.',
                'While he was cooking, he heard a noise.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

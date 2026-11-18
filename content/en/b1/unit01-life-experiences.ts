import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U1 «Experiencias de vida» (docs/B1_EN.md): el present perfect para experiencias sin fecha y el
 * past simple para contar cuándo y cómo pasó; participios irregulares frecuentes; been to / gone to;
 * so far, the first time, in my life; logros y recuerdos. Supone A1 y A2 completos.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SOFIA_POST = reading(
  'en.stim.b1-u1-post',
  'post',
  'Sofía cuenta en una red social qué hizo en los últimos años.',
  [
    'I have visited six countries so far, and I have lived abroad twice.',
    'I have spoken English at work for three years.',
    'I have never climbed a mountain, but I want to climb one soon.',
    'Last year I went to Peru, and it was the first time I saw the Andes.',
    'It was amazing!',
  ],
  { from: 'Sofia', title: 'My life so far' },
);

const CLIMB_TALK = dialogue('en.stim.b1-u1-climb', 'Ben y Kate hablan de experiencias.', [
  ['Ben', 'Have you ever climbed a mountain?'],
  ['Kate', 'Yes, I have. I climbed one in Chile two years ago.'],
  ['Ben', 'Really? Was it difficult?'],
  ['Kate', 'Very! But when I got to the top, I felt so proud.'],
  ['Ben', "I've never done anything like that in my life."],
]);

const GRADUATION = reading(
  'en.stim.b1-u1-graduation',
  'email',
  'Leo le escribe a su abuela.',
  [
    'Dear Grandma,',
    'I have some great news: I have graduated! The party was on Saturday, and Mom and Dad came.',
    'They have given me a new computer as a present.',
    'I have also won a prize for my final project. It is my biggest achievement so far.',
    'Love, Leo',
  ],
  { from: 'Leo', to: 'Grandma', title: 'Great news!' },
);

const MEMORY = dialogue('en.stim.b1-u1-memory', 'Mia le cuenta a Tom su mejor recuerdo.', [
  ['Tom', "What's your best memory?"],
  ['Mia', 'The day I met my favorite singer. I was at a concert in London.'],
  ['Mia', 'After the concert, she came out and spoke to us.'],
  ['Tom', 'Did you take a photo?'],
  ['Mia', "Yes, I did! I've taken thousands of photos, but that one is my favorite."],
]);

export const EN_B1_U01: B1UnitDef = {
  names: ['Sofia', 'Ben', 'Kate', 'Leo', 'Mia', 'Tom', 'Peru', 'Andes', 'Chile', 'London'],
  support: [
    'really',
    'also',
    'spoke',
    'child',
    'top',
    'team',
    'news',
    'present',
    'project',
    'final',
    'grandma',
    'dad',
    'singer',
    'thousands',
  ],
  unit: {
    position: 1,
    title: 'Experiencias de vida',
    titleEn: 'Life experiences',
    description:
      'Contar experiencias con el present perfect y decir cuándo pasaron con el past simple; logros y recuerdos.',
    emoji: '🌍',
    objective:
      'Podés contar experiencias de tu vida, decir si alguna vez hiciste algo y explicar cuándo y cómo pasó.',
    grammar: {
      title: 'Present perfect y past simple',
      explanation:
        'El present perfect (have/has + participio) cuenta una experiencia sin decir cuándo: I have climbed a mountain. Si decís cuándo (last year, in 2020, two years ago), usás el past simple: I climbed it last year.',
      examples: [
        { target: 'I have been to Brazil.', base: 'Estuve en Brasil (alguna vez).' },
        { target: 'I went there last year.', base: 'Fui el año pasado.' },
        { target: 'Have you ever won a prize?', base: '¿Alguna vez ganaste un premio?' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-gone',
        'gone',
        'ido (go)',
        '/ɡɔn/',
        undefined,
        'She has gone to the station.',
        'Se fue a la estación.',
        ['experiences', 'participle'],
        ['ido', 'se fue'],
      ),
      w(
        'en-written',
        'written',
        'escrito (write)',
        '/ˈrɪtən/',
        '✍️',
        'I have written a long email.',
        'Escribí un mail largo.',
        ['experiences', 'participle'],
        ['escrito'],
      ),
      w(
        'en-spoken',
        'spoken',
        'hablado (speak)',
        '/ˈspoʊkən/',
        '🗣️',
        'Have you spoken to your boss?',
        '¿Hablaste con tu jefe?',
        ['experiences', 'participle'],
        ['hablado'],
      ),
      w(
        'en-taken',
        'taken',
        'tomado / llevado (take)',
        '/ˈteɪkən/',
        '📸',
        'I have taken a lot of photos.',
        'Saqué muchas fotos.',
        ['experiences', 'participle'],
        ['tomado', 'llevado'],
      ),
      w(
        'en-given',
        'given',
        'dado (give)',
        '/ˈɡɪvən/',
        '🎁',
        'My parents have given me a bike.',
        'Mis padres me regalaron una bici.',
        ['experiences', 'participle'],
        ['dado'],
      ),
      w(
        'en-won',
        'won',
        'gané / ganado (win)',
        '/wʌn/',
        '🏆',
        'Our team won the game.',
        'Nuestro equipo ganó el partido.',
        ['experiences', 'past'],
        ['gané', 'ganó', 'ganado'],
      ),
      w(
        'en-climb',
        'climb',
        'escalar / subir',
        '/klaɪm/',
        '🧗',
        'I want to climb that mountain.',
        'Quiero escalar esa montaña.',
        ['experiences', 'verbs'],
      ),
      w(
        'en-prize',
        'prize',
        'premio',
        '/praɪz/',
        '🥇',
        'She won a prize at school.',
        'Ganó un premio en la escuela.',
        ['experiences'],
      ),
      w(
        'en-proud',
        'proud',
        'orgulloso / orgullosa',
        '/praʊd/',
        undefined,
        'I am very proud of you.',
        'Estoy muy orgulloso de vos.',
        ['experiences', 'feelings'],
        ['orgulloso', 'orgullosa'],
      ),
      w(
        'en-the-first-time',
        'the first time',
        'la primera vez',
        '/ðə ˈfɜrst ˈtaɪm/',
        undefined,
        'It was the first time I saw the sea.',
        'Fue la primera vez que vi el mar.',
        ['experiences'],
      ),
      w(
        'en-so-far',
        'so far',
        'hasta ahora',
        '/ˈsoʊ ˈfɑr/',
        undefined,
        'I have visited three countries so far.',
        'Hasta ahora visité tres países.',
        ['experiences'],
        ['hasta el momento'],
      ),
      w(
        'en-in-my-life',
        'in my life',
        'en mi vida',
        '/ɪn maɪ ˈlaɪf/',
        undefined,
        'I have never seen snow in my life.',
        'Nunca vi nieve en mi vida.',
        ['experiences'],
      ),
      w(
        'en-unforgettable',
        'unforgettable',
        'inolvidable',
        '/ˌʌnfərˈɡɛtəbəl/',
        '✨',
        'It was an unforgettable day.',
        'Fue un día inolvidable.',
        ['experiences', 'adjectives'],
      ),
      w(
        'en-graduate',
        'graduate',
        'recibirse / graduarse',
        '/ˈɡrædʒueɪt/',
        '🎓',
        'She wants to graduate next year.',
        'Quiere recibirse el año que viene.',
        ['experiences', 'studies'],
        ['recibirse', 'graduarse'],
      ),
      w(
        'en-achievement',
        'achievement',
        'logro',
        '/əˈtʃivmənt/',
        undefined,
        'Learning English is a great achievement.',
        'Aprender inglés es un gran logro.',
        ['experiences'],
      ),
      w(
        'en-adventure',
        'adventure',
        'aventura',
        '/ədˈvɛntʃər/',
        '🧭',
        'This trip was a great adventure.',
        'Este viaje fue una gran aventura.',
        ['experiences', 'travel'],
      ),
      w(
        'en-memory',
        'memory',
        'recuerdo / memoria',
        '/ˈmɛməri/',
        '💭',
        'I have a good memory of that day.',
        'Tengo un lindo recuerdo de ese día.',
        ['experiences'],
        ['recuerdo', 'memoria'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Alguna vez…?',
        objective:
          'Preguntar y contar experiencias con el present perfect y participios irregulares.',
        intro: {
          explanation:
            'Para hablar de experiencias sin decir cuándo pasaron: have/has + participio. Muchos participios son irregulares: go → gone, write → written, speak → spoken, take → taken, give → given.',
          examples: [
            {
              target: 'Have you ever spoken to a famous person?',
              base: '¿Alguna vez hablaste con una persona famosa?',
            },
            { target: 'I have written a story.', base: 'Escribí una historia (alguna vez).' },
          ],
        },
        takeaways: [
          'Preguntás por experiencias: Have you ever…?',
          'Usás participios irregulares: written, spoken, taken, given.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['written', 'escrito (write)'],
              ['spoken', 'hablado (speak)'],
              ['taken', 'tomado / llevado (take)'],
              ['given', 'dado (give)'],
            ],
            ['en-written', 'en-spoken', 'en-taken', 'en-given'],
            { id: 'en.ex.1v4rpjwsgcj8ed' },
          ),
          ex.fillBlank(
            'Have you ever ___ to a famous person?',
            '¿Alguna vez hablaste con una persona famosa?',
            'spoken',
            ['speak', 'spoke', 'speaking'],
            ['en-spoken', 'en-famous', 'en-ever'],
            {
              id: 'en.ex.uck7qsh45x7wbj',
              explanation: 'Después de have/has va el participio: speak → spoken.',
            },
          ),
          ex.fillBlank(
            'She has ___ three books.',
            'Escribió tres libros.',
            'written',
            ['wrote', 'write', 'writing'],
            ['en-written', 'en-book'],
            {
              id: 'en.ex.10vnt9uoycwkey',
              explanation: 'Write es irregular: wrote (pasado), written (participio).',
            },
          ),
          ex.fillBlank(
            'I have ___ a lot of photos on this trip.',
            'Saqué muchas fotos en este viaje.',
            'taken',
            ['took', 'take', 'taking'],
            ['en-taken', 'en-photo', 'en-trip'],
            { id: 'en.ex.nlkqlohj8sxzqd' },
          ),
          ex.listenChoice(
            'My parents have given me a new bike.',
            [
              'My parents gave me a new bike.',
              'My parents have given me a new book.',
              'My friends have given me a new bike.',
            ],
            ['en-given', 'en-bike'],
            { id: 'en.ex.3g9hmm9m6ygna9' },
          ),
          ex.orderWords(
            'Have you ever written a story?',
            '¿Alguna vez escribiste una historia?',
            ['en-written', 'en-ever', 'en-story'],
            { id: 'en.ex.wn32ky8pczucmi' },
          ),
          ex.shortAnswer(
            'Have you ever spoken to a famous person? (no, nunca)',
            '¿Alguna vez hablaste con una persona famosa?',
            "No, I haven't.",
            ['No, never.', 'No, I have not.', 'No, I have never spoken to a famous person.'],
            ['en-spoken', 'en-ever'],
            { id: 'en.ex.uk0jcoipwo367o' },
          ),
          ex.translateWrite(
            'Escribí un mail largo.',
            'I have written a long email.',
            ['en-written', 'en-email'],
            {
              id: 'en.ex.f15s5av4nn5mqa',
              acceptedAnswers: ["I've written a long email.", 'I wrote a long email.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Been y gone',
        objective:
          'Distinguir been to (fue y volvió) de gone to (se fue y sigue allá); contar lo que llevás hecho.',
        intro: {
          explanation:
            'Been to dice que alguien fue a un lugar y ya volvió: I have been to Spain. Gone to dice que se fue y todavía está allá: She has gone to the bank (no está). So far (hasta ahora) suma lo hecho hasta hoy.',
          examples: [
            { target: 'I have been to Spain twice.', base: 'Estuve en España dos veces.' },
            { target: 'Kate has gone to the bank.', base: 'Kate se fue al banco (no está).' },
          ],
        },
        takeaways: [
          'Diferenciás been to (ya volvió) de gone to (sigue allá).',
          'Contás lo que hiciste hasta ahora con so far.',
        ],
        exercises: [
          ex.translationChoice(
            'gone',
            'ido (go)',
            ['dado (give)', 'escrito (write)', 'tomado / llevado (take)'],
            ['en-gone'],
            { id: 'en.ex.w4tp8j4ivwt1a6' },
          ),
          ex.fillBlank(
            "Mom isn't here. She has ___ to the supermarket.",
            'Mamá no está. Se fue al supermercado.',
            'gone',
            ['been', 'went', 'go'],
            ['en-gone', 'en-supermarket'],
            {
              id: 'en.ex.xfzd6415hw0din',
              explanation: 'Gone to: se fue y todavía no volvió.',
            },
          ),
          ex.fillBlank(
            'I have ___ to Mexico three times.',
            'Estuve en México tres veces.',
            'been',
            ['gone', 'went', 'was'],
            ['en-been', 'en-mexico', 'en-times'],
            {
              id: 'en.ex.0nqkxw1prto7k8',
              explanation: 'Been to: fuiste y volviste (una experiencia).',
            },
          ),
          ex.fillBlank(
            'I have visited five countries ___.',
            'Hasta ahora visité cinco países.',
            'so far',
            ['last year', 'ago', 'yesterday'],
            ['en-so-far', 'en-country'],
            {
              id: 'en.ex.1ijxc7py9phvz3',
              skill: 'vocabulary',
              explanation:
                'So far va con el present perfect; last year, ago y yesterday, con el past simple.',
            },
          ),
          question(
            'en.ex.tq0zx7wwvgltbc',
            SOFIA_POST,
            '¿Cuántos países visitó Sofía hasta ahora?',
            'Seis',
            ['Dos', 'Tres', 'Cinco'],
            ['en-so-far', 'en-visit'],
            'Sofía escribe: «I have visited six countries so far».',
          ),
          question(
            'en.ex.ccal3sk4rw6gmv',
            SOFIA_POST,
            '¿Qué todavía no hizo Sofía?',
            'Escalar una montaña',
            ['Vivir en el exterior', 'Hablar inglés en el trabajo', 'Ir a Perú'],
            ['en-climb', 'en-never'],
            'Sofía escribe: «I have never climbed a mountain, but I want to climb one soon».',
          ),
          ex.listenChoice(
            'He has gone to the airport.',
            [
              'He has been to the airport.',
              'He has gone to the station.',
              'She has gone to the airport.',
            ],
            ['en-gone', 'en-airport'],
            { id: 'en.ex.lrp6l40xrs7ge1' },
          ),
          ex.translateWrite(
            'Estuve en Inglaterra dos veces.',
            'I have been to England twice.',
            ['en-been', 'en-england', 'en-twice'],
            {
              id: 'en.ex.5yskoipcd9n6w9',
              acceptedAnswers: ["I've been to England twice.", 'I have been in England twice.'],
            },
          ),
          ex.shortAnswer(
            'Where is Tom? (se fue al gimnasio)',
            '¿Dónde está Tom?',
            'He has gone to the gym.',
            ["He's gone to the gym.", 'He went to the gym.', 'At the gym.'],
            ['en-gone', 'en-gym'],
            { id: 'en.ex.m5nfsa6yurxoew' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Y cuándo fue?',
        objective: 'Pasar de la experiencia (present perfect) a los detalles (past simple).',
        intro: {
          explanation:
            'Una conversación sobre experiencias suele empezar con el present perfect (Have you ever…?) y sigue con el past simple para los detalles: When did you go? Who did you go with? Con last year, ago, in 2019 o yesterday va siempre el past simple.',
          examples: [
            {
              target: 'Have you ever climbed a mountain? Yes, I climbed one last year.',
              base: '¿Escalaste alguna vez una montaña? Sí, escalé una el año pasado.',
            },
            {
              target: 'It was the first time I saw the sea.',
              base: 'Fue la primera vez que vi el mar.',
            },
          ],
        },
        takeaways: [
          'Pasás del present perfect al past simple para dar detalles.',
          'Contás la primera vez que hiciste algo: It was the first time…',
        ],
        exercises: [
          ex.fillBlank(
            'I ___ a mountain in Chile two years ago.',
            'Escalé una montaña en Chile hace dos años.',
            'climbed',
            ['have climbed', 'climb', 'climbing'],
            ['en-climb', 'en-mountain', 'en-ago'],
            {
              id: 'en.ex.yiab40f6c750v3',
              explanation: 'Con ago (hace) va el past simple, no el present perfect.',
            },
          ),
          ex.fillBlank(
            'Have you ever ___ a mountain?',
            '¿Alguna vez escalaste una montaña?',
            'climbed',
            ['climb', 'climbs', 'climbing'],
            ['en-climb', 'en-ever'],
            { id: 'en.ex.yykoi13vketydp' },
          ),
          ex.fillBlank(
            'It was ___ I traveled by plane.',
            'Fue la primera vez que viajé en avión.',
            'the first time',
            ['so far', 'in my life', 'once a week'],
            ['en-the-first-time', 'en-plane'],
            { id: 'en.ex.iv908qt2tbw9mk', skill: 'vocabulary' },
          ),
          question(
            'en.ex.tgpzird55rkx4j',
            CLIMB_TALK,
            '¿Cuándo escaló Kate la montaña?',
            'Hace dos años',
            ['El año pasado', 'Nunca', 'La semana pasada'],
            ['en-climb', 'en-ago'],
            'Kate dice: «I climbed one in Chile two years ago».',
          ),
          question(
            'en.ex.pyud6z8s2m70n7',
            CLIMB_TALK,
            '¿Cómo se sintió Kate al llegar arriba?',
            'Muy orgullosa',
            ['Muy cansada', 'Asustada', 'Aburrida'],
            ['en-proud', 'en-felt'],
            'Kate dice: «I felt so proud».',
          ),
          ex.listenChoice(
            "I've never done anything like that in my life.",
            [
              "I've never seen anything like that in my life.",
              "I've never done anything like this in my life.",
              "I've never done anything like that in my job.",
            ],
            ['en-in-my-life', 'en-never', 'en-done'],
            { id: 'en.ex.g18796a6yfwsd2' },
          ),
          ex.orderWords(
            'When did you go to Spain?',
            '¿Cuándo fuiste a España?',
            ['en-when', 'en-spain', 'en-did'],
            { id: 'en.ex.0tbhw0htu1yic6' },
          ),
          ex.shortAnswer(
            'Have you ever been to Spain? (sí, el año pasado)',
            '¿Alguna vez estuviste en España?',
            'Yes, I went there last year.',
            [
              'Yes, I have. I went there last year.',
              'Yes, last year.',
              'Yes, I have been there.',
              'Yes, I have.',
            ],
            ['en-been', 'en-last-year'],
            { id: 'en.ex.3vu9zd53p94djf' },
          ),
          ex.translateWrite(
            'Nunca vi nieve en mi vida.',
            'I have never seen snow in my life.',
            ['en-in-my-life', 'en-seen', 'en-snow'],
            {
              id: 'en.ex.c51nuhalr56ui1',
              acceptedAnswers: ["I've never seen snow in my life.", 'I never saw snow in my life.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Logros',
        objective: 'Contar logros y momentos importantes de la vida.',
        intro: {
          explanation:
            'Para contar logros: I have graduated, I have won a prize. Para decir cómo te sentís: I am proud of… (estoy orgulloso de…). Win es irregular: won (pasado y participio).',
          examples: [
            { target: 'I have won a prize.', base: 'Gané un premio.' },
            {
              target: 'My parents are very proud of me.',
              base: 'Mis padres están muy orgullosos de mí.',
            },
          ],
        },
        takeaways: [
          'Contás logros: I have graduated, I have won a prize.',
          'Decís de qué estás orgulloso: I am proud of…',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['prize', 'premio'],
              ['proud', 'orgulloso / orgullosa'],
              ['achievement', 'logro'],
              ['graduate', 'recibirse / graduarse'],
            ],
            ['en-prize', 'en-proud', 'en-achievement', 'en-graduate'],
            { id: 'en.ex.i0sj975q5s1whq' },
          ),
          ex.imageChoice('🏆', 'won', ['lost', 'gone', 'given'], ['en-won'], {
            id: 'en.ex.ea68db908vox08',
          }),
          ex.fillBlank(
            'Our team has ___ the game!',
            '¡Nuestro equipo ganó el partido!',
            'won',
            ['win', 'wins', 'winning'],
            ['en-won', 'en-game'],
            {
              id: 'en.ex.8m2dw9m8pmjurs',
              explanation: 'Win es irregular: won es el pasado y el participio.',
            },
          ),
          ex.fillBlank(
            'My parents are very ___ of me.',
            'Mis padres están muy orgullosos de mí.',
            'proud',
            ['bored', 'scared', 'busy'],
            ['en-proud', 'en-parents'],
            { id: 'en.ex.enl5m8l6c150jz', skill: 'vocabulary' },
          ),
          question(
            'en.ex.pnii3syvyrtytk',
            GRADUATION,
            '¿Qué le regalaron los padres a Leo?',
            'Una computadora nueva',
            ['Una bici', 'Un viaje', 'Un teléfono'],
            ['en-given', 'en-computer'],
            'Leo escribe: «They have given me a new computer as a present».',
          ),
          question(
            'en.ex.7sgwoqm9uftxa2',
            GRADUATION,
            '¿Cuál es el mayor logro de Leo hasta ahora?',
            'Un premio por su proyecto final',
            ['Recibirse', 'Un trabajo nuevo', 'Un viaje al exterior'],
            ['en-won', 'en-prize', 'en-achievement'],
            'Leo escribe: «I have also won a prize for my final project. It is my biggest achievement so far».',
          ),
          ex.listenChoice(
            'She wants to graduate next year.',
            [
              'She wants to graduate this year.',
              'She wanted to graduate next year.',
              'She wants to travel next year.',
            ],
            ['en-graduate', 'en-next-year'],
            { id: 'en.ex.mea0y07em7whi9' },
          ),
          ex.translateWrite(
            'Gané un premio en la escuela.',
            'I won a prize at school.',
            ['en-won', 'en-prize', 'en-school'],
            {
              id: 'en.ex.q068afb7all2yk',
              acceptedAnswers: [
                'I have won a prize at school.',
                "I've won a prize at school.",
                'I won a prize in school.',
              ],
            },
          ),
          ex.translateWrite(
            'Estoy muy orgullosa de vos.',
            'I am very proud of you.',
            ['en-proud'],
            {
              id: 'en.ex.fdo7j9q4xj0ork',
              acceptedAnswers: ["I'm very proud of you."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Un recuerdo inolvidable',
        objective: 'Contar una experiencia importante: qué pasó, cuándo y cómo te sentiste.',
        intro: {
          explanation:
            'Para contar un recuerdo: presentalo con el present perfect o con una frase como My best memory is…, y contá los detalles en past simple. Unforgettable (inolvidable) y adventure (aventura) ayudan a describirlo.',
          examples: [
            {
              target: 'My best memory is the day I graduated.',
              base: 'Mi mejor recuerdo es el día que me recibí.',
            },
            { target: 'It was an unforgettable adventure.', base: 'Fue una aventura inolvidable.' },
          ],
        },
        takeaways: [
          'Contás un recuerdo con detalles en past simple.',
          'Lo describís: unforgettable, an adventure.',
        ],
        exercises: [
          ex.translationChoice(
            'memory',
            'recuerdo / memoria',
            ['aventura', 'logro', 'premio'],
            ['en-memory'],
            { id: 'en.ex.5zrauqnot2saq1' },
          ),
          question(
            'en.ex.8f5g2m62legmp6',
            MEMORY,
            '¿Cuál es el mejor recuerdo de Mia?',
            'El día que conoció a su cantante favorita',
            ['Su primer viaje a Londres', 'El día que se recibió', 'Un premio que ganó'],
            ['en-memory', 'en-met'],
            'Mia dice: «The day I met my favorite singer».',
          ),
          question(
            'en.ex.oyuhtmtasvm0r1',
            MEMORY,
            '¿Qué pasó después del recital?',
            'La cantante salió y les habló',
            ['Sacaron miles de fotos', 'Mia volvió a su casa', 'Cantaron todos juntos'],
            ['en-spoken', 'en-concert'],
            'Mia dice: «After the concert, she came out and spoke to us».',
          ),
          ex.fillBlank(
            'It was an ___ trip.',
            'Fue un viaje inolvidable.',
            'unforgettable',
            ['difficult', 'expensive', 'easy'],
            ['en-unforgettable', 'en-trip'],
            { id: 'en.ex.kr4iwkhuc7xwks', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'This trip was a great adventure.',
            [
              'This trip was a great experience.',
              'This trip was a big adventure.',
              'That trip was a great adventure.',
            ],
            ['en-adventure', 'en-trip'],
            { id: 'en.ex.tea7wavpynog7v' },
          ),
          ex.orderWords(
            'I have a good memory of that day.',
            'Tengo un lindo recuerdo de ese día.',
            ['en-memory', 'en-day'],
            { id: 'en.ex.2w8hnnabji85qy' },
          ),
          ex.fillBlank(
            'We ___ to the beach every summer when I was a child.',
            'Íbamos a la playa todos los veranos cuando era chico.',
            'went',
            ['have gone', 'go', 'gone'],
            ['en-went', 'en-beach', 'en-summer'],
            {
              id: 'en.ex.ih81bslsv02yjg',
              explanation:
                'When I was a child pone la acción en un momento terminado: past simple.',
            },
          ),
          ex.shortAnswer(
            "What's your best memory? (el día que te recibiste)",
            '¿Cuál es tu mejor recuerdo?',
            'The day I graduated.',
            [
              'My best memory is the day I graduated.',
              'When I graduated.',
              'The day that I graduated.',
            ],
            ['en-memory', 'en-graduate'],
            { id: 'en.ex.rk4812vqkf44rh' },
          ),
          ex.translateWrite(
            'Fue la primera vez que vi el mar.',
            'It was the first time I saw the sea.',
            ['en-the-first-time', 'en-saw', 'en-sea'],
            {
              id: 'en.ex.bsqxpquxq1xqkp',
              acceptedAnswers: [
                'It was the first time that I saw the sea.',
                'That was the first time I saw the sea.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U2 «Hábitos y aficiones» (docs/B1_EN.md): for, since y how long con el present perfect; el present
 * perfect continuous (have been + -ing); verbos con -ing (enjoy, stop, avoid) y con to (decide, hope);
 * good at e interested in; take up y give up.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const GUITAR = dialogue('en.stim.b1-u2-guitar', 'Lucy y Sam hablan de música.', [
  ['Lucy', 'How long have you been playing the guitar?'],
  ['Sam', 'For about three years. I took it up when I moved to this city.'],
  ['Lucy', 'Do you practice every day?'],
  ['Sam', "I try to, but I've been very busy lately, so I only practice on weekends."],
  ['Lucy', "Well, you're very good at it!"],
]);

const PHOTO_POST = reading(
  'en.stim.b1-u2-photo',
  'post',
  'Ana cuenta en un foro su nueva afición.',
  [
    "I've been learning photography since January.",
    'At first I only took photos with my phone, but now I have a real camera.',
    'I practice every weekend in the park, and my photos have improved a lot.',
    'I really enjoy taking photos of people in the street.',
    'Next month I want to take a course.',
  ],
  { from: 'Ana', title: 'My new hobby' },
);

const CLUB = reading(
  'en.stim.b1-u2-club',
  'notice',
  'Un aviso en el centro cultural del barrio.',
  [
    'Are you interested in music? Do you enjoy singing?',
    'Our choir meets every Tuesday at seven.',
    "You don't need to read music, and you don't need to be good at singing.",
    'Come and try it! The first class is free.',
  ],
  { title: 'Join our choir!' },
);

const HABITS = dialogue('en.stim.b1-u2-habits', 'Tom le cuenta a Kate sus nuevos hábitos.', [
  ['Kate', 'You look great! What have you been doing?'],
  ['Tom', 'I gave up sugar in March, and I have been walking to work every day.'],
  ['Kate', 'Was it difficult to stop eating sugar?'],
  ['Tom', 'At first, yes. But now I avoid sweet food, and I feel much better.'],
]);

export const EN_B1_U02: B1UnitDef = {
  names: ['Lucy', 'Sam', 'Ana', 'Tom', 'Kate'],
  support: [
    'only',
    'camera',
    'real',
    'course',
    'choir',
    'join',
    'sugar',
    'sweet',
    'known',
    'hour',
    'smoking',
    'useful',
    'yoga',
    'drawing',
    'art',
  ],
  unit: {
    position: 2,
    title: 'Hábitos y aficiones',
    titleEn: 'Habits and hobbies',
    description:
      'Desde cuándo haces algo (for, since), lo que vienes haciendo (have been + -ing) y lo que te gusta, empiezas o dejas de hacer.',
    emoji: '🎸',
    objective:
      'Puedes contar desde cuándo haces algo, qué vienes haciendo últimamente y qué hábitos empezaste o dejaste.',
    grammar: {
      title: 'Present perfect continuous',
      explanation:
        'Have/has been + verbo con -ing cuenta algo que empezó en el pasado y sigue hasta ahora: I have been learning English for two years. For va con un período (for two years) y since con el comienzo (since 2020).',
      examples: [
        {
          target: "I've been playing the guitar for three years.",
          base: 'Toco la guitarra desde hace tres años.',
        },
        { target: 'She has been working here since March.', base: 'Trabaja aquí desde marzo.' },
        {
          target: 'How long have you been learning English?',
          base: '¿Hace cuánto que aprendes inglés?',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-since',
        'since',
        'desde',
        '/sɪns/',
        undefined,
        'I have lived here since 2020.',
        'Vivo aquí desde 2020.',
        ['time', 'grammar'],
      ),
      w(
        'en-for',
        'for',
        'durante / hace (tiempo)',
        '/fɔr/',
        undefined,
        'I have lived here for two years.',
        'Vivo aquí desde hace dos años.',
        ['time', 'grammar'],
        ['durante', 'hace'],
      ),
      w(
        'en-how-long',
        'how long',
        '¿cuánto tiempo?',
        '/haʊ ˈlɔŋ/',
        '⏳',
        'How long have you lived here?',
        '¿Hace cuánto que vives aquí?',
        ['time', 'questions'],
        ['cuánto tiempo', 'hace cuánto'],
      ),
      w(
        'en-enjoy',
        'enjoy',
        'disfrutar',
        '/ɪnˈdʒɔɪ/',
        '😊',
        'I enjoy cooking for my friends.',
        'Disfruto cocinar para mis amigos.',
        ['hobbies', 'verbs'],
      ),
      w(
        'en-take-up',
        'take up',
        'empezar (un pasatiempo)',
        '/ˈteɪk ˈʌp/',
        undefined,
        'I want to take up yoga.',
        'Quiero empezar yoga.',
        ['hobbies', 'phrasal-verbs'],
        ['empezar a hacer'],
      ),
      w(
        'en-give-up',
        'give up',
        'dejar (un hábito) / rendirse',
        '/ˈɡɪv ˈʌp/',
        undefined,
        'My father gave up smoking.',
        'Mi papá dejó de fumar.',
        ['habits', 'phrasal-verbs'],
        ['dejar', 'rendirse', 'abandonar'],
      ),
      w(
        'en-habit',
        'habit',
        'hábito / costumbre',
        '/ˈhæbɪt/',
        undefined,
        'Reading every night is a good habit.',
        'Leer todas las noches es un buen hábito.',
        ['habits'],
        ['hábito', 'costumbre'],
      ),
      w(
        'en-keep',
        'keep',
        'seguir / mantener',
        '/kip/',
        undefined,
        'Keep trying!',
        '¡Sigue intentando!',
        ['habits', 'verbs'],
        ['seguir', 'mantener'],
      ),
      w(
        'en-practice',
        'practice',
        'practicar',
        '/ˈpræktɪs/',
        undefined,
        'I practice the piano every day.',
        'Practico piano todos los días.',
        ['hobbies', 'verbs'],
      ),
      w(
        'en-improve',
        'improve',
        'mejorar',
        '/ɪmˈpruv/',
        '📈',
        'My English has improved a lot.',
        'Mi inglés mejoró mucho.',
        ['hobbies', 'verbs'],
      ),
      w(
        'en-skill',
        'skill',
        'habilidad',
        '/skɪl/',
        undefined,
        'Cooking is a useful skill.',
        'Cocinar es una habilidad útil.',
        ['hobbies'],
        ['destreza'],
      ),
      w(
        'en-photography',
        'photography',
        'fotografía',
        '/fəˈtɑɡrəfi/',
        '📷',
        'I am interested in photography.',
        'Me interesa la fotografía.',
        ['hobbies'],
      ),
      w(
        'en-instrument',
        'instrument',
        'instrumento',
        '/ˈɪnstrəmənt/',
        '🎻',
        'Do you play an instrument?',
        '¿Tocas algún instrumento?',
        ['hobbies', 'music'],
      ),
      w(
        'en-good-at',
        'good at',
        'bueno en / hábil para',
        '/ˈɡʊd æt/',
        undefined,
        'She is good at drawing.',
        'Es buena dibujando.',
        ['hobbies'],
        ['bueno para', 'buena en'],
      ),
      w(
        'en-interested-in',
        'interested in',
        'interesado en',
        '/ˈɪntrəstɪd ɪn/',
        undefined,
        'Are you interested in art?',
        '¿Te interesa el arte?',
        ['hobbies'],
        ['interesada en'],
      ),
      w(
        'en-stop',
        'stop',
        'dejar de / parar',
        '/stɑp/',
        '🛑',
        'Stop talking, please.',
        'Deja de hablar, por favor.',
        ['habits', 'verbs'],
        ['parar', 'dejar de'],
      ),
      w(
        'en-avoid',
        'avoid',
        'evitar',
        '/əˈvɔɪd/',
        undefined,
        'I avoid eating late.',
        'Evito comer tarde.',
        ['habits', 'verbs'],
      ),
      w(
        'en-lately',
        'lately',
        'últimamente (en este tiempo)',
        '/ˈleɪtli/',
        undefined,
        'I have been very tired lately.',
        'Estuve muy cansado últimamente.',
        ['time'],
        ['estos días'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'For, since y how long',
        objective: 'Decir desde cuándo haces algo con for, since y how long.',
        intro: {
          explanation:
            'Para algo que empezó en el pasado y sigue: have/has + participio. For va con un período (for two years, for a long time) y since con el momento en que empezó (since 2020, since March). Para preguntar: How long…?',
          examples: [
            { target: 'I have lived here for two years.', base: 'Vivo aquí desde hace dos años.' },
            { target: 'She has worked here since March.', base: 'Trabaja aquí desde marzo.' },
          ],
        },
        takeaways: [
          'Usas for con un período y since con un comienzo.',
          'Preguntas How long have you…?',
        ],
        exercises: [
          ex.fillBlank(
            'I have lived in this city ___ 2019.',
            'Vivo en esta ciudad desde 2019.',
            'since',
            ['for', 'ago', 'from'],
            ['en-since', 'en-city'],
            {
              id: 'en.ex.lx7uzldevxeeme',
              explanation: 'Since va con el momento en que empezó (un año, un mes, un día).',
            },
          ),
          ex.fillBlank(
            'I have known Ana ___ ten years.',
            'Conozco a Ana desde hace diez años.',
            'for',
            ['since', 'ago', 'from'],
            ['en-for', 'en-know'],
            {
              id: 'en.ex.xiqxjcz3281p3x',
              explanation: 'For va con un período: for ten years, for a week.',
            },
          ),
          ex.fillBlank(
            '___ have you had this car?',
            '¿Hace cuánto que tienes este auto?',
            'How long',
            ['How much', 'How many', 'When'],
            ['en-how-long', 'en-car'],
            { id: 'en.ex.wi0koo2vyzj0td', skill: 'vocabulary' },
          ),
          ex.matchPairs(
            [
              ['since', 'desde'],
              ['for', 'durante / hace (tiempo)'],
              ['how long', '¿cuánto tiempo?'],
              ['lately', 'últimamente (en este tiempo)'],
            ],
            ['en-since', 'en-for', 'en-how-long', 'en-lately'],
            { id: 'en.ex.rwk27okvvyojjq' },
          ),
          ex.listenChoice(
            'She has worked here since March.',
            [
              'She has worked here for March.',
              'She worked here in March.',
              'She has lived here since March.',
            ],
            ['en-since', 'en-work'],
            { id: 'en.ex.34av7r33jrbxms' },
          ),
          ex.orderWords(
            'How long have you lived here?',
            '¿Hace cuánto que vives aquí?',
            ['en-how-long', 'en-live'],
            { id: 'en.ex.r6g29l1tatpzon' },
          ),
          ex.shortAnswer(
            'How long have you had your phone? (dos años)',
            '¿Hace cuánto que tienes tu teléfono?',
            'For two years.',
            ['I have had it for two years.', "I've had it for two years.", 'Two years.'],
            ['en-for', 'en-phone'],
            { id: 'en.ex.fd6wi64sr986jk' },
          ),
          ex.translateWrite(
            'Vivo aquí desde 2020.',
            'I have lived here since 2020.',
            ['en-since', 'en-live'],
            {
              id: 'en.ex.0w6x0qaixfeebw',
              acceptedAnswers: [
                "I've lived here since 2020.",
                'I have been living here since 2020.',
                "I've been living here since 2020.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lo que vienes haciendo',
        objective: 'Contar lo que vienes haciendo con have been + -ing.',
        intro: {
          explanation:
            "El present perfect continuous (have/has been + -ing) cuenta una actividad que empezó antes y sigue ahora, o que hiciste mucho últimamente: I have been studying a lot lately. Con I, you, we y they: have been (I've been); con he, she e it: has been.",
          examples: [
            {
              target: "I've been studying a lot lately.",
              base: 'Estuve estudiando mucho últimamente.',
            },
            {
              target: 'How long have you been learning English?',
              base: '¿Hace cuánto que aprendes inglés?',
            },
          ],
        },
        takeaways: [
          'Cuentas lo que vienes haciendo: I have been working a lot.',
          'Preguntas How long have you been…?',
        ],
        exercises: [
          ex.fillBlank(
            'I have ___ studying a lot lately.',
            'Estuve estudiando mucho últimamente.',
            'been',
            ['be', 'was', 'being'],
            ['en-been', 'en-study', 'en-lately'],
            {
              id: 'en.ex.p6qps0nz20cuza',
              explanation: 'Present perfect continuous: have/has + been + verbo con -ing.',
            },
          ),
          ex.fillBlank(
            'She has been ___ the guitar for three years.',
            'Toca la guitarra desde hace tres años.',
            'playing',
            ['play', 'played', 'plays'],
            ['en-play', 'en-guitar', 'en-for'],
            { id: 'en.ex.2je7rqfzbotprs' },
          ),
          ex.fillBlank(
            'How long have you been ___ English?',
            '¿Hace cuánto que aprendes inglés?',
            'learning',
            ['learn', 'learned', 'learns'],
            ['en-how-long', 'en-learn'],
            { id: 'en.ex.iipar3dqz2a81j' },
          ),
          question(
            'en.ex.sa0m7pqc7ucrm8',
            GUITAR,
            '¿Hace cuánto que Sam toca la guitarra?',
            'Unos tres años',
            ['Desde enero', 'Un año', 'Desde que era chico'],
            ['en-how-long', 'en-for'],
            'Sam dice: «For about three years».',
          ),
          question(
            'en.ex.4b26mivz4vw1ky',
            GUITAR,
            '¿Por qué Sam practica sólo los fines de semana?',
            'Porque estuvo muy ocupado últimamente',
            [
              'Porque trabaja de noche',
              'Porque no le gusta practicar',
              'Porque la guitarra es nueva',
            ],
            ['en-practice', 'en-lately', 'en-busy'],
            "Sam dice: «I've been very busy lately, so I only practice on weekends».",
          ),
          ex.listenChoice(
            "I've been very tired lately.",
            [
              "I've been very busy lately.",
              'I was very tired lately.',
              "I've been very tired today.",
            ],
            ['en-lately', 'en-tired'],
            { id: 'en.ex.t34v3dny0sbr8f' },
          ),
          ex.orderWords(
            'We have been waiting for an hour.',
            'Estamos esperando desde hace una hora.',
            ['en-wait', 'en-for'],
            { id: 'en.ex.cc5y8z12739uw7' },
          ),
          ex.shortAnswer(
            'What have you been doing lately? (estudiando mucho)',
            '¿Qué estuviste haciendo últimamente?',
            "I've been studying a lot.",
            ['I have been studying a lot.', 'Studying a lot.', "I've been studying a lot lately."],
            ['en-been', 'en-study', 'en-lately'],
            { id: 'en.ex.eeh883j0znianp' },
          ),
          ex.translateWrite(
            'Aprendo inglés desde hace dos años.',
            'I have been learning English for two years.',
            ['en-for', 'en-learn'],
            {
              id: 'en.ex.6a7pdb60ipfvl0',
              acceptedAnswers: [
                "I've been learning English for two years.",
                'I have learned English for two years.',
                "I've learned English for two years.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Lo que disfrutas',
        objective: 'Hablar de gustos y habilidades con verbos + -ing, good at e interested in.',
        intro: {
          explanation:
            'Después de enjoy, love, like, hate, stop y avoid, el verbo va con -ing: I enjoy cooking. También después de preposiciones: good at singing, interested in learning.',
          examples: [
            {
              target: 'I enjoy cooking for my friends.',
              base: 'Disfruto cocinar para mis amigos.',
            },
            { target: 'She is good at singing.', base: 'Es buena cantando.' },
          ],
        },
        takeaways: [
          'Usas -ing después de enjoy, stop y avoid.',
          'Dices en qué eres bueno y qué te interesa: good at, interested in.',
        ],
        exercises: [
          ex.fillBlank(
            'I really enjoy ___ for my friends.',
            'Disfruto mucho cocinar para mis amigos.',
            'cooking',
            ['cook', 'to cook', 'cooked'],
            ['en-enjoy', 'en-cook'],
            {
              id: 'en.ex.hcj98tnp0tgwo1',
              explanation: 'Después de enjoy, el verbo va con -ing.',
            },
          ),
          ex.fillBlank(
            'Are you interested ___ photography?',
            '¿Te interesa la fotografía?',
            'in',
            ['at', 'on', 'for'],
            ['en-interested-in', 'en-photography'],
            { id: 'en.ex.aiwjimm6bexwtx' },
          ),
          ex.fillBlank(
            'She is very good ___ singing.',
            'Es muy buena cantando.',
            'at',
            ['in', 'on', 'for'],
            ['en-good-at', 'en-sing'],
            { id: 'en.ex.zlcy2hrcq0525q' },
          ),
          ex.imageChoice(
            '📷',
            'photography',
            ['instrument', 'music', 'painting'],
            ['en-photography'],
            { id: 'en.ex.1zgo452zl6xq49' },
          ),
          question(
            'en.ex.1mzftvl97w1xzk',
            CLUB,
            '¿Qué hace falta para entrar al coro?',
            'Nada especial: no hace falta leer música',
            ['Saber leer música', 'Cantar muy bien', 'Pagar la primera clase'],
            ['en-good-at', 'en-need'],
            "El aviso dice: «You don't need to read music, and you don't need to be good at singing».",
          ),
          question(
            'en.ex.wkqw34roe60cy4',
            CLUB,
            '¿Cuándo se reúne el coro?',
            'Los martes a las siete',
            ['Los jueves a las siete', 'Todos los días', 'Los martes a las nueve'],
            ['en-interested-in', 'en-enjoy'],
            'El aviso dice: «Our choir meets every Tuesday at seven».',
          ),
          ex.listenChoice(
            'Do you play an instrument?',
            ['Do you play a sport?', 'Did you play an instrument?', 'Do you want an instrument?'],
            ['en-instrument', 'en-play'],
            { id: 'en.ex.danfq4d121o896' },
          ),
          ex.shortAnswer(
            'What are you good at? (cocinar)',
            '¿En qué eres bueno?',
            "I'm good at cooking.",
            ['I am good at cooking.', 'Cooking.', "I'm very good at cooking."],
            ['en-good-at', 'en-cook'],
            { id: 'en.ex.m3k56fprzh3dc1' },
          ),
          ex.translateWrite(
            'Me interesa la fotografía.',
            'I am interested in photography.',
            ['en-interested-in', 'en-photography'],
            {
              id: 'en.ex.lcfp5gredf1bfu',
              acceptedAnswers: ["I'm interested in photography."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Empezar y dejar',
        objective:
          'Contar hábitos nuevos y hábitos que dejaste: take up, give up, stop, avoid, decide to.',
        intro: {
          explanation:
            'Take up es empezar un pasatiempo; give up, dejar un hábito. Después de decide, want, hope y learn va to + verbo: I decided to take up yoga. Después de stop, give up y avoid va -ing: I stopped eating meat.',
          examples: [
            { target: 'I decided to take up running.', base: 'Decidí empezar a correr.' },
            { target: 'My father gave up smoking.', base: 'Mi papá dejó de fumar.' },
          ],
        },
        takeaways: [
          'Cuentas un hábito nuevo (take up) y uno que dejaste (give up).',
          'Eliges -ing o to: stop eating, decide to eat.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['take up', 'empezar (un pasatiempo)'],
              ['give up', 'dejar (un hábito) / rendirse'],
              ['avoid', 'evitar'],
              ['habit', 'hábito / costumbre'],
            ],
            ['en-take-up', 'en-give-up', 'en-avoid', 'en-habit'],
            { id: 'en.ex.tbtvrhvlgidfhi' },
          ),
          ex.fillBlank(
            'Last year I decided ___ running.',
            'El año pasado decidí empezar a correr.',
            'to take up',
            ['taking up', 'take up', 'took up'],
            ['en-take-up', 'en-decide'],
            {
              id: 'en.ex.8d7zom3vb5mmx6',
              explanation: 'Después de decide va to + verbo.',
            },
          ),
          ex.fillBlank(
            'He stopped ___ coffee at night.',
            'Dejó de tomar café a la noche.',
            'drinking',
            ['to drink', 'drink', 'drank'],
            ['en-stop', 'en-drink', 'en-coffee'],
            {
              id: 'en.ex.c601m1v1hsf8sd',
              explanation: 'Stop + -ing: dejar de hacer algo.',
            },
          ),
          ex.fillBlank(
            'I avoid ___ late at night.',
            'Evito comer tarde a la noche.',
            'eating',
            ['to eat', 'eat', 'ate'],
            ['en-avoid', 'en-eat'],
            { id: 'en.ex.1yymd4e5b2o49j' },
          ),
          question(
            'en.ex.4uq2sa4a8qjs8n',
            HABITS,
            '¿Qué hábito dejó Tom?',
            'El azúcar',
            ['El café', 'Caminar', 'La comida salada'],
            ['en-give-up', 'en-habit'],
            'Tom dice: «I gave up sugar in March».',
          ),
          question(
            'en.ex.mw2yzice44twm0',
            HABITS,
            '¿Qué viene haciendo Tom todos los días?',
            'Camina al trabajo',
            ['Va al gimnasio', 'Cocina para la familia', 'Corre en el parque'],
            ['en-walk', 'en-been'],
            'Tom dice: «I have been walking to work every day».',
          ),
          ex.listenChoice(
            "Don't give up! Keep trying!",
            [
              "Don't give up! Keep walking!",
              "Don't stop! Keep trying!",
              "Don't give up! Try again!",
            ],
            ['en-give-up', 'en-keep'],
            { id: 'en.ex.c4zsrmkx0zvya9' },
          ),
          ex.translateWrite(
            'Mi hermano dejó el café.',
            'My brother gave up coffee.',
            ['en-give-up', 'en-brother', 'en-coffee'],
            {
              id: 'en.ex.7oip76tj0b24jf',
              acceptedAnswers: [
                'My brother has given up coffee.',
                'My brother stopped drinking coffee.',
              ],
            },
          ),
          ex.translateWrite(
            'Quiero empezar a pintar.',
            'I want to take up painting.',
            ['en-take-up', 'en-paint'],
            {
              id: 'en.ex.ketzc25db2logm',
              acceptedAnswers: ['I want to start painting.', 'I want to start to paint.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Practicar y mejorar',
        objective: 'Contar cómo aprendes algo nuevo: practicar, mejorar, seguir intentando.',
        intro: {
          explanation:
            'Para hablar de un aprendizaje: practice (practicar), improve (mejorar), skill (habilidad). Keep + -ing es seguir haciendo algo: Keep practicing! Con el present perfect cuentas el resultado: My English has improved.',
          examples: [
            { target: 'My English has improved a lot.', base: 'Mi inglés mejoró mucho.' },
            { target: 'Keep practicing every day.', base: 'Sigue practicando todos los días.' },
          ],
        },
        takeaways: [
          'Cuentas cómo practicas y cuánto mejoraste.',
          'Animas a alguien: Keep practicing!',
        ],
        exercises: [
          ex.translationChoice(
            'improve',
            'mejorar',
            ['practicar', 'evitar', 'disfrutar'],
            ['en-improve'],
            { id: 'en.ex.9fuvf141gcdgct' },
          ),
          question(
            'en.ex.39cts488ppzrkg',
            PHOTO_POST,
            '¿Desde cuándo aprende Ana fotografía?',
            'Desde enero',
            ['Desde hace tres años', 'Desde el mes pasado', 'Desde que era chica'],
            ['en-since', 'en-photography'],
            "Ana escribe: «I've been learning photography since January».",
          ),
          question(
            'en.ex.byor0wrxrp57f8',
            PHOTO_POST,
            '¿Qué disfruta fotografiar Ana?',
            'Gente en la calle',
            ['Paisajes del parque', 'A su familia', 'Comida'],
            ['en-enjoy', 'en-photo'],
            'Ana escribe: «I really enjoy taking photos of people in the street».',
          ),
          ex.fillBlank(
            'My English has ___ a lot this year.',
            'Mi inglés mejoró mucho este año.',
            'improved',
            ['improve', 'improving', 'improves'],
            ['en-improve', 'en-english'],
            { id: 'en.ex.z5ku4z8mtwukgp' },
          ),
          ex.fillBlank(
            "Don't stop now. ___ practicing!",
            'No pares ahora. ¡Sigue practicando!',
            'Keep',
            ['Give', 'Take', 'Avoid'],
            ['en-keep', 'en-practice'],
            { id: 'en.ex.g0t69plirbfegk', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Cooking is a useful skill.',
            [
              'Cooking is a useful habit.',
              'Cooking is a difficult skill.',
              'Singing is a useful skill.',
            ],
            ['en-skill', 'en-cook'],
            { id: 'en.ex.tjt4t4b7dg23pu' },
          ),
          ex.orderWords(
            'I practice the piano every day.',
            'Practico piano todos los días.',
            ['en-practice', 'en-every-day'],
            { id: 'en.ex.h17dsptrg6phhc' },
          ),
          ex.shortAnswer(
            'How can I improve my English? (practicar todos los días)',
            '¿Cómo puedo mejorar mi inglés?',
            'Practice every day.',
            [
              'You should practice every day.',
              'Practice English every day.',
              'By practicing every day.',
            ],
            ['en-practice', 'en-improve'],
            { id: 'en.ex.kgnv8n4q99ozj1' },
          ),
          ex.translateWrite(
            'Mi inglés mejoró mucho.',
            'My English has improved a lot.',
            ['en-improve', 'en-english'],
            {
              id: 'en.ex.pmderge1fyt2sb',
              acceptedAnswers: ['My English improved a lot.', 'My English has improved very much.'],
            },
          ),
        ],
      },
    ],
  },
};

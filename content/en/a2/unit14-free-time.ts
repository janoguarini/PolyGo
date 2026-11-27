import type { ExpansionUnitDef } from '../../a2-expansion';
import { ex } from '../../builders';
import { dialogue, question, reading } from './context-helpers';
import { w } from './word';

/**
 * A2 U14 «Tiempo libre e invitaciones» (docs/A2_EN_COMPLETION.md): pasatiempos y frecuencia,
 * invitar con Would you like to…?, proponer con Let's… y How about…?, aceptar y rechazar, quedar.
 * Supone A1 (gustos de U11) y A2 U1–U13 (have to de U10, going to y will de U8).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const INVITE = dialogue('en.stim.a2-u14-invite', 'Mia llama a Leo para invitarlo al cine.', [
  ['Mia', 'Hi Leo! Would you like to go to the cinema on Friday?'],
  ['Leo', "Sorry, I can't. I have to work on Friday."],
  ['Mia', 'Are you free on Saturday?'],
  ['Leo', "Yes, I'm free on Saturday. I'd love to go!"],
]);

const PLANS = dialogue('en.stim.a2-u14-plans', 'Leo y Mia hablan del fin de semana.', [
  ['Leo', 'What do you want to do on Saturday?'],
  ['Mia', "How about a concert? There's a concert in the park."],
  ['Leo', "Great! Let's go together."],
  ['Mia', "Yes, and let's go out for dinner after the concert."],
]);

const MEET = reading(
  'en.stim.a2-u14-meet',
  'message',
  'Mia le escribe a Leo antes del recital.',
  [
    'Hi Leo!',
    'The concert starts at 8.',
    "Let's meet at the station at 7:30.",
    "I'm at the gym now, but I will be ready at 7.",
    'See you!',
  ],
  { from: 'Mia', to: 'Leo' },
);

const PARTY = reading(
  'en.stim.a2-u14-party',
  'message',
  'Mia les escribe a sus amigos.',
  [
    'Hi friends!',
    "It's my birthday on Saturday!",
    'Would you like to come to my party?',
    "It's at my house at eight.",
    "We can dance and sing together. I hope you're free!",
    'Mia',
  ],
  { from: 'Mia' },
);

export const EN_A2_U14: ExpansionUnitDef = {
  names: ['Mia', 'Leo'],
  unit: {
    position: 14,
    title: 'Tiempo libre e invitaciones',
    titleEn: 'Free time and invitations',
    description: 'Pasatiempos, invitar, proponer planes, aceptar o rechazar y quedar para verse.',
    emoji: '🎟️',
    objective: 'Puedes hablar de tus pasatiempos, invitar a alguien y aceptar o rechazar un plan.',
    grammar: {
      title: 'Invitar y proponer',
      explanation:
        "Would you like to + verbo invita (¿te gustaría…?). Let's + verbo y How about + sustantivo o verbo con -ing proponen un plan. Se acepta con I'd love to y se rechaza con Sorry, I can't.",
      examples: [
        { target: 'Would you like to go to the cinema?', base: '¿Te gustaría ir al cine?' },
        { target: "Let's go out tonight!", base: '¡Salgamos esta noche!' },
        {
          target: "Sorry, I can't. Maybe another time.",
          base: 'Perdón, no puedo. Quizás otro día.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 completo: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-hobby',
        'hobby',
        'pasatiempo',
        '/ˈhɑbi/',
        '🎨',
        'My hobby is cooking.',
        'Mi pasatiempo es cocinar.',
        ['free time'],
        ['hobby', 'afición'],
      ),
      w(
        'en-guitar',
        'guitar',
        'guitarra',
        '/ɡɪˈtɑr/',
        '🎸',
        'I play the guitar.',
        'Toco la guitarra.',
        ['free time', 'music'],
      ),
      w(
        'en-paint',
        'paint',
        'pintar',
        '/peɪnt/',
        '🖌️',
        'She likes to paint on Sundays.',
        'A ella le gusta pintar los domingos.',
        ['free time', 'verbs'],
      ),
      w(
        'en-gym',
        'gym',
        'gimnasio',
        '/dʒɪm/',
        '🏋️',
        'I go to the gym on Mondays.',
        'Voy al gimnasio los lunes.',
        ['free time', 'places'],
      ),
      w(
        'en-concert',
        'concert',
        'recital / concierto',
        '/ˈkɑnsərt/',
        '🎤',
        'The concert is on Friday.',
        'El recital es el viernes.',
        ['free time', 'music'],
        ['recital', 'concierto'],
      ),
      w(
        'en-go-out',
        'go out',
        'salir (a divertirse)',
        '/ɡoʊ ˈaʊt/',
        undefined,
        'We go out on Saturdays.',
        'Salimos los sábados.',
        ['free time', 'verbs'],
        ['salir'],
      ),
      w(
        'en-would-you-like-to',
        'would you like to',
        '¿te gustaría…?',
        '/wʊd ju ˈlaɪk tu/',
        undefined,
        'Would you like to go to the cinema?',
        '¿Te gustaría ir al cine?',
        ['invitations'],
        ['te gustaría', 'le gustaría'],
      ),
      w(
        'en-lets',
        "let's",
        'vamos a… / hagamos…',
        '/lɛts/',
        undefined,
        "Let's go to the park!",
        '¡Vamos al parque!',
        ['invitations'],
        ['vamos a', 'hagamos'],
      ),
      w(
        'en-how-about',
        'how about',
        '¿qué tal si…? / ¿y si…?',
        '/haʊ əˈbaʊt/',
        undefined,
        'How about Sunday?',
        '¿Qué tal el domingo?',
        ['invitations'],
        ['qué tal si', 'y si', 'qué tal'],
      ),
      w(
        'en-id-love-to',
        "I'd love to",
        'me encantaría',
        '/aɪd ˈlʌv tu/',
        '😊',
        "Yes, I'd love to!",
        '¡Sí, me encantaría!',
        ['invitations'],
      ),
      w(
        'en-another-time',
        'another time',
        'otro día / en otro momento',
        '/əˈnʌðər taɪm/',
        undefined,
        "Sorry, I can't. Maybe another time.",
        'Perdón, no puedo. Quizás otro día.',
        ['invitations'],
        ['otro día', 'en otro momento'],
      ),
      w(
        'en-free',
        'free',
        'libre / desocupado',
        '/fri/',
        undefined,
        'Are you free on Saturday?',
        '¿Estás libre el sábado?',
        ['invitations'],
        ['libre', 'desocupado', 'desocupada'],
      ),
      w(
        'en-together',
        'together',
        'juntos / juntas',
        '/təˈɡɛðər/',
        '👫',
        "Let's cook together.",
        'Cocinemos juntos.',
        ['free time'],
        ['juntos', 'juntas'],
      ),
      w(
        'en-meet',
        'meet',
        'encontrarse / verse',
        '/mit/',
        '🤝',
        "Let's meet at the station.",
        'Encontrémonos en la estación.',
        ['invitations', 'verbs'],
        ['encontrarse', 'verse', 'juntarse'],
      ),
      w(
        'en-often',
        'often',
        'a menudo / seguido',
        '/ˈɔfən/',
        undefined,
        'I often go to the gym.',
        'Voy seguido al gimnasio.',
        ['frequency'],
        ['a menudo', 'seguido', 'con frecuencia'],
      ),
      w(
        'en-once-a-week',
        'once a week',
        'una vez por semana',
        '/wʌns ə ˈwik/',
        undefined,
        'I play football once a week.',
        'Juego al fútbol una vez por semana.',
        ['frequency'],
      ),
      w(
        'en-ready',
        'ready',
        'listo / lista',
        '/ˈrɛdi/',
        undefined,
        'Are you ready?',
        '¿Estás listo?',
        ['invitations'],
        ['listo', 'lista', 'preparado', 'preparada'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Pasatiempos',
        objective: 'Contar qué haces en tu tiempo libre y con qué frecuencia.',
        intro: {
          explanation:
            'Para hablar de tus pasatiempos (hobbies) usas el presente simple y expresiones de frecuencia: often (a menudo), once a week (una vez por semana), twice a week (dos veces por semana).',
          examples: [
            { target: 'My hobby is cooking.', base: 'Mi pasatiempo es cocinar.' },
            { target: 'I go to the gym once a week.', base: 'Voy al gimnasio una vez por semana.' },
          ],
        },
        takeaways: [
          'Cuentas qué haces en tu tiempo libre.',
          'Dices con qué frecuencia: often, once a week, twice a week.',
        ],
        exercises: [
          ex.imageChoice('🎸', 'guitar', ['music', 'game', 'bike'], ['en-guitar'], {
            id: 'en.ex.jo854xdlgx4m8u',
          }),
          ex.matchPairs(
            [
              ['hobby', 'pasatiempo'],
              ['paint', 'pintar'],
              ['gym', 'gimnasio'],
              ['often', 'a menudo / seguido'],
            ],
            ['en-hobby', 'en-paint', 'en-gym', 'en-often'],
            { id: 'en.ex.9rjhui98d2gk80' },
          ),
          ex.fillBlank(
            'I play the ___ every evening.',
            'Toco la guitarra todas las noches.',
            'guitar',
            ['gym', 'hobby', 'paint'],
            ['en-guitar'],
            { id: 'en.ex.ufjkjf3xwivfuu', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I go to the gym ___ a week.',
            'Voy al gimnasio una vez por semana.',
            'once',
            ['one', 'first', 'ago'],
            ['en-once-a-week', 'en-gym'],
            {
              id: 'en.ex.ea4izjy4l4w8ce',
              explanation: 'Una vez = once; dos veces = twice; tres veces = three times.',
            },
          ),
          ex.listenChoice(
            'I often paint on Sundays.',
            [
              'I never paint on Sundays.',
              'I often play on Sundays.',
              'I often paint on Saturdays.',
            ],
            ['en-often', 'en-paint'],
            { id: 'en.ex.mrmrrqjp5fugry' },
          ),
          ex.orderWords(
            'My hobby is cooking.',
            'Mi pasatiempo es cocinar.',
            ['en-hobby', 'en-cook'],
            {
              id: 'en.ex.t77jspwv7pbqzp',
            },
          ),
          ex.shortAnswer(
            'How often do you go to the gym? (dos veces por semana)',
            '¿Con qué frecuencia vas al gimnasio?',
            'I go to the gym twice a week.',
            ['Twice a week.', 'I go twice a week.'],
            ['en-gym', 'en-twice'],
            { id: 'en.ex.tfjlry2cpnrdt5' },
          ),
          ex.translateWrite(
            'Voy al gimnasio a menudo.',
            'I often go to the gym.',
            ['en-often', 'en-gym'],
            {
              id: 'en.ex.qaryn5mi3r8maf',
              acceptedAnswers: ['I go to the gym often.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '¿Te gustaría venir?',
        objective: 'Invitar a alguien y aceptar o rechazar una invitación.',
        intro: {
          explanation:
            "Para invitar: Would you like to…? (¿te gustaría…?). Para aceptar: I'd love to! (¡me encantaría!). Para rechazar con amabilidad: Sorry, I can't. Maybe another time.",
          examples: [
            { target: 'Would you like to go to the cinema?', base: '¿Te gustaría ir al cine?' },
            {
              target: "Sorry, I can't. Maybe another time.",
              base: 'Perdón, no puedo. Quizás otro día.',
            },
          ],
        },
        takeaways: [
          'Invitas con Would you like to…?',
          "Aceptas con I'd love to y rechazas con Sorry, I can't.",
        ],
        exercises: [
          ex.translationChoice(
            "I'd love to",
            'me encantaría',
            ['no puedo', 'otro día', 'quizás'],
            ['en-id-love-to'],
            {
              id: 'en.ex.n5fqow2rn2rfd4',
            },
          ),
          ex.fillBlank(
            '___ go to the beach on Sunday?',
            '¿Te gustaría ir a la playa el domingo?',
            'Would you like to',
            ['Do you like to', 'Would you like', 'You would like to'],
            ['en-would-you-like-to', 'en-beach'],
            {
              id: 'en.ex.eh8181xhpiqdi8',
              explanation: 'Would you like to…? invita. Do you like…? pregunta si algo te gusta.',
            },
          ),
          ex.fillBlank(
            "Sorry, I can't. Maybe ___ time.",
            'Perdón, no puedo. Quizás otro día.',
            'another',
            ['last', 'same', 'one'],
            ['en-another-time'],
            { id: 'en.ex.iac9puldmjbp1l', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Are you ___ on Saturday?',
            '¿Estás libre el sábado?',
            'free',
            ['busy', 'tired', 'late'],
            ['en-free'],
            { id: 'en.ex.d2ysiphdqeqht2', skill: 'vocabulary' },
          ),
          question(
            'en.ex.1v1186396cwiid',
            INVITE,
            '¿Por qué Leo no puede ir el viernes?',
            'Tiene que trabajar',
            ['Está enfermo', 'Va a un recital', 'No le gusta el cine'],
            ['en-have-to', 'en-work'],
            'Leo dice: «I have to work on Friday».',
          ),
          question(
            'en.ex.za078fzq06ihrp',
            INVITE,
            '¿Qué día pueden ir al cine?',
            'El sábado',
            ['El viernes', 'El domingo', 'Ningún día'],
            ['en-free', 'en-id-love-to'],
            'Leo está libre el sábado y dice «I’d love to go!».',
          ),
          ex.listenChoice(
            'Would you like to come to my party?',
            [
              'Would you like to come to my house?',
              'Do you like my party?',
              'Would you like to go to the party?',
            ],
            ['en-would-you-like-to', 'en-party'],
            { id: 'en.ex.l379twm80gdarc' },
          ),
          ex.shortAnswer(
            'Would you like to go to the park? (sí)',
            '¿Te gustaría ir al parque?',
            "Yes, I'd love to.",
            [
              "Yes, I'd love to go.",
              "I'd love to.",
              'Yes, I would love to.',
              'Yes, I would love to go.',
            ],
            ['en-id-love-to'],
            { id: 'en.ex.k8qlwc0vdv0sh4' },
          ),
          ex.translateWrite(
            'Perdón, no puedo. Quizás otro día.',
            "Sorry, I can't. Maybe another time.",
            ['en-another-time', 'en-maybe'],
            { id: 'en.ex.tqljkc2y7r4bv9', acceptedAnswers: ["Sorry, I can't. Another time."] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Proponer un plan',
        objective: "Proponer planes con Let's… y How about…?",
        intro: {
          explanation:
            "Para proponer algo: Let's… (¡vamos a…!) o How about…? (¿qué tal si…?). Después de how about va un sustantivo o un verbo con -ing: How about Sunday? How about going out?",
          examples: [
            { target: "Let's go out tonight!", base: '¡Salgamos esta noche!' },
            { target: 'How about Sunday?', base: '¿Qué tal el domingo?' },
          ],
        },
        takeaways: [
          "Propones planes con Let's… y How about…?",
          'Dices que hacen algo juntos: together.',
        ],
        exercises: [
          ex.fillBlank(
            '___ go to the concert together!',
            '¡Vamos juntos al recital!',
            "Let's",
            ['Go', 'Do', 'Are'],
            ['en-lets', 'en-concert', 'en-together'],
            {
              id: 'en.ex.53ohx4rcwd8odr',
              explanation: "Let's = let us: propone hacer algo juntos.",
            },
          ),
          ex.fillBlank(
            'How about ___ out tonight?',
            '¿Qué tal si salimos esta noche?',
            'going',
            ['go', 'goes', 'went'],
            ['en-how-about', 'en-go-out'],
            {
              id: 'en.ex.sykekeafgqpytr',
              explanation: 'Después de how about, el verbo va con -ing.',
            },
          ),
          ex.imageChoice('🎤', 'concert', ['party', 'movie', 'museum'], ['en-concert'], {
            id: 'en.ex.iqym1az83k6fn1',
          }),
          ex.listenChoice(
            "Let's go out together.",
            ["Let's go out tonight.", "Let's eat together.", "Let's work together."],
            ['en-lets', 'en-go-out', 'en-together'],
            { id: 'en.ex.ndsyk73e9d4qj9' },
          ),
          question(
            'en.ex.0jmqms9ln0r8y1',
            PLANS,
            '¿Qué propone Mia primero?',
            'Ir a un recital en el parque',
            ['Cenar en un restaurante', 'Ir al cine', 'Quedarse en casa'],
            ['en-how-about', 'en-concert'],
            'Mia dice: «How about a concert? There’s a concert in the park».',
          ),
          question(
            'en.ex.qp3dedkdmsy3u1',
            PLANS,
            '¿Qué van a hacer después del recital?',
            'Salir a cenar',
            ['Volver a casa', 'Ir al gimnasio', 'Ir a otro recital'],
            ['en-go-out', 'en-lets'],
            'Mia propone: «Let’s go out for dinner after the concert».',
          ),
          ex.orderWords(
            'How about a movie tonight?',
            '¿Qué tal una película esta noche?',
            ['en-how-about', 'en-movie', 'en-tonight'],
            {
              id: 'en.ex.ptcb8p9kfksxpo',
            },
          ),
          ex.translateWrite(
            '¡Cocinemos juntos!',
            "Let's cook together!",
            ['en-lets', 'en-together', 'en-cook'],
            {
              id: 'en.ex.ht9dlqxuvjzoya',
            },
          ),
          ex.translateWrite(
            '¿Qué tal el domingo?',
            'How about Sunday?',
            ['en-how-about', 'en-sunday'],
            {
              id: 'en.ex.yeagl239y5a3qj',
              acceptedAnswers: ['What about Sunday?', 'How about on Sunday?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Quedar para verse',
        objective: 'Acordar dónde y a qué hora encontrarse.',
        intro: {
          explanation:
            "Para quedar se dice el lugar y la hora: Let's meet at the station at seven (encontrémonos en la estación a las siete). Para saber si alguien terminó de prepararse: Are you ready? (¿estás listo?).",
          examples: [
            {
              target: "Let's meet at the station at seven.",
              base: 'Encontrémonos en la estación a las siete.',
            },
            { target: 'Are you ready?', base: '¿Estás listo?' },
          ],
        },
        takeaways: [
          'Propones un lugar y una hora para encontrarse.',
          'Preguntas si alguien está listo: Are you ready?',
        ],
        exercises: [
          ex.translationChoice(
            'meet',
            'encontrarse / verse',
            ['esperar', 'llegar', 'salir (a divertirse)'],
            ['en-meet'],
            { id: 'en.ex.tkt4zj69ljso1w' },
          ),
          ex.fillBlank(
            "Let's ___ at the station at seven.",
            'Encontrémonos en la estación a las siete.',
            'meet',
            ['met', 'wait', 'leave'],
            ['en-meet', 'en-lets', 'en-station'],
            {
              id: 'en.ex.sqdlh0ycqo0px2',
              explanation: "Después de let's va el verbo en su forma base: meet.",
            },
          ),
          ex.fillBlank(
            'Are you ___? The movie starts at nine.',
            '¿Estás listo? La película empieza a las nueve.',
            'ready',
            ['free', 'late', 'tired'],
            ['en-ready', 'en-start'],
            { id: 'en.ex.0jdr57mr38yevs', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            "Let's meet at the cinema at eight.",
            [
              "Let's meet at the cinema at nine.",
              "Let's meet at the museum at eight.",
              "Let's eat at the cinema at eight.",
            ],
            ['en-meet', 'en-cinema'],
            { id: 'en.ex.kx4w5rqfu1jlfy' },
          ),
          question(
            'en.ex.yhn6mqqi1l5gmh',
            MEET,
            '¿Dónde se van a encontrar?',
            'En la estación',
            ['En el gimnasio', 'En el recital', 'En la casa de Mia'],
            ['en-meet', 'en-station'],
            'Mia escribe: «Let’s meet at the station at 7:30».',
          ),
          question(
            'en.ex.s6wkirycbweo6t',
            MEET,
            '¿A qué hora empieza el recital?',
            'A las 8',
            ['A las 7:30', 'A las 7', 'A las 9'],
            ['en-concert', 'en-start'],
            'El mensaje dice: «The concert starts at 8». A las 7:30 se encuentran y a las 7 Mia está lista.',
          ),
          ex.orderWords(
            'What time do you want to meet?',
            '¿A qué hora quieres que nos encontremos?',
            ['en-meet', 'en-what-time'],
            {
              id: 'en.ex.a2773hwmvf083d',
            },
          ),
          ex.shortAnswer(
            'Where do you want to meet? (en el parque)',
            '¿Dónde quieres que nos encontremos?',
            "Let's meet at the park.",
            ['At the park.', 'In the park.', "Let's meet in the park.", 'The park.'],
            ['en-meet', 'en-park'],
            { id: 'en.ex.0il3cvd7ternrk' },
          ),
          ex.translateWrite('¿Estás lista?', 'Are you ready?', ['en-ready'], {
            id: 'en.ex.rtlvmvnm7n5os9',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Responder una invitación',
        objective: 'Entender una invitación escrita y responderla.',
        intro: {
          explanation:
            'Una invitación dice qué es, cuándo y dónde. Para responder, agradece y acepta o rechaza dando una razón: Thank you! I’d love to go. / Sorry, I can’t. I have to work.',
          examples: [
            { target: "Thank you! I'd love to go.", base: '¡Gracias! Me encantaría ir.' },
            {
              target: "Sorry, I can't. I have to work.",
              base: 'Perdón, no puedo. Tengo que trabajar.',
            },
          ],
        },
        takeaways: [
          'Entiendes una invitación escrita: qué, cuándo y dónde.',
          'Aceptas o rechazas una invitación dando una razón.',
        ],
        exercises: [
          question(
            'en.ex.yct9r69sssp7qp',
            PARTY,
            '¿Qué celebra Mia?',
            'Su cumpleaños',
            ['Una fiesta de trabajo', 'Que se mudó', 'Un recital'],
            ['en-birthday', 'en-would-you-like-to'],
            'Mia escribe: «It’s my birthday on Saturday!».',
          ),
          question(
            'en.ex.hg85q9phpcr23e',
            PARTY,
            '¿Dónde es la fiesta?',
            'En la casa de Mia',
            ['En un restaurante', 'En el parque', 'En la escuela'],
            ['en-party', 'en-house'],
            'El mensaje dice: «It’s at my house at eight».',
          ),
          ex.fillBlank(
            "Thank you! I'd ___ to go.",
            '¡Gracias! Me encantaría ir.',
            'love',
            ['loves', 'loved', 'loving'],
            ['en-id-love-to'],
            { id: 'en.ex.wy1azxzgpxr0rn' },
          ),
          ex.matchPairs(
            [
              ['Would you like to…?', '¿Te gustaría…?'],
              ["Let's…", '¡Vamos a…!'],
              ['How about…?', '¿Qué tal si…?'],
              ["I'd love to.", 'Me encantaría.'],
            ],
            ['en-would-you-like-to', 'en-lets', 'en-how-about', 'en-id-love-to'],
            { id: 'en.ex.x5xmx3uyp2804r' },
          ),
          ex.listenChoice(
            "Sorry, I can't go. I'm sick.",
            [
              "Sorry, I can go. I'm free.",
              "Sorry, I can't go. I'm busy.",
              "Sorry, I can't go. I'm late.",
            ],
            ['en-sick', 'en-sorry'],
            { id: 'en.ex.ya1rgmlu9q0tph' },
          ),
          ex.orderWords(
            'Would you like to go out on Friday?',
            '¿Te gustaría salir el viernes?',
            ['en-would-you-like-to', 'en-go-out', 'en-friday'],
            {
              id: 'en.ex.ev11xnitf99ym8',
            },
          ),
          ex.shortAnswer(
            'Would you like to go to the concert? (no: tienes que trabajar)',
            '¿Te gustaría ir al recital?',
            "Sorry, I can't. I have to work.",
            [
              'No, sorry. I have to work.',
              "I'm sorry, I can't. I have to work.",
              'Sorry, I have to work.',
            ],
            ['en-have-to', 'en-concert'],
            { id: 'en.ex.1xhohlrmi3oqze' },
          ),
          ex.translateWrite(
            '¡Gracias! Me encantaría ir.',
            "Thank you! I'd love to go.",
            ['en-id-love-to'],
            {
              id: 'en.ex.ph3eu3yaungf5i',
              acceptedAnswers: [
                "Thanks! I'd love to go.",
                'Thank you! I would love to go.',
                'Thanks! I would love to go.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

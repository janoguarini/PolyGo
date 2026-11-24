import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U11 «Gustos y tiempo libre» (docs/FR_A1_A2.md): decir qué te gusta, qué te encanta,
 * qué odiás y qué preferís; aimer / adorer / détester / préférer + artículo definido (j'aime le
 * foot, nunca «j'aime du foot») o + infinitivo (j'aime lire); faire du sport; jouer au foot frente a
 * jouer de la guitare; avec; pas du tout.
 * Pronunciación: j'aime, tu aimes e il aime suenan igual (la e y la es finales no suenan); le / les;
 * liaison ils‿aiment con sonido z. Cultura: el foot es el deporte más popular de Francia.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const WEEK_END = dialogue(
  'fr.stim.a1-u11-week-end',
  'Camille y Nicolas hablan de lo que hacen el fin de semana.',
  [
    ['Camille', "Nicolas, qu'est-ce que tu fais le week-end?"],
    ['Nicolas', 'Je fais du sport. Je joue au foot avec mon frère.'],
    ['Camille', 'Moi, je déteste le foot! Je préfère la musique.'],
    ['Nicolas', 'Tu joues de la guitare?'],
    ['Camille', "Oui, et j'adore danser."],
  ],
  FR_A1_RATE,
);

const PROFIL = reading(
  'fr.stim.a1-u11-profil',
  'post',
  'Inès se presenta en una red social para hacer amigos.',
  [
    "Je m'appelle Inès. J'ai vingt ans.",
    "Mon temps libre? J'adore lire et voyager.",
    "J'aime aussi cuisiner avec ma sœur.",
    "Le sport? Je n'aime pas du tout le sport!",
  ],
  { title: 'Mon temps libre', from: 'Inès' },
);

export const FR_A1_U11: FrUnitDef = {
  names: ['Camille', 'Nicolas', 'Inès', 'Hugo', 'Léa'],
  support: ['fait', 'joue', 'piano', 'tennis', 'ou', 'aiment'],
  unit: {
    position: 11,
    title: 'Gustos y tiempo libre',
    titleEn: "J'aime…",
    description:
      'Aimer, adorer, détester y préférer + le / la o + infinitivo; faire du sport; jouer au foot y jouer de la guitare; avec; pas du tout. Terminaciones mudas y liaison ils‿aiment.',
    emoji: '❤️',
    objective:
      'Podés decir qué te gusta, qué te encanta, qué odiás y qué preferís hacer en tu tiempo libre, y preguntárselo a otra persona.',
    grammar: {
      title: 'Aimer + le / la · faire du · jouer au / jouer de la',
      explanation:
        "Con aimer, adorer, détester y préférer va el artículo definido, como en español: j'aime le foot, je déteste la musique (nunca «j'aime du foot»). También van con un infinitivo, sin preposición: j'aime lire, je préfère danser. Para negar: je n'aime pas, y para reforzar, pas du tout. Faire va con du / de la: je fais du sport. Jouer cambia de preposición: jouer au foot (deportes: à + le = au) y jouer de la guitare o du piano (instrumentos: de + le = du). En español es «jugar» y «tocar»; en francés, siempre jouer.",
      examples: [
        {
          target: "J'aime le foot, mais je préfère la musique.",
          base: 'Me gusta el fútbol, pero prefiero la música.',
        },
        { target: 'Je fais du sport avec Léa.', base: 'Hago deporte con Léa.' },
        { target: 'Il joue de la guitare.', base: 'Él toca la guitarra.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A1 nuevo (U11). Sin revisión nativa: revisar «Mon temps libre?» como título de presentación y el registro de «j'adore» (muy frecuente en el habla cotidiana).",
    },
    words: [
      w(
        'fr-j-aime',
        "j'aime",
        'me gusta',
        "J'aime la musique.",
        'Me gusta la música.',
        ['likes', 'verbs'],
        {
          acceptedTranslations: ['amo', 'quiero'],
          emoji: '👍',
        },
      ),
      w(
        'fr-j-adore',
        "j'adore",
        'me encanta',
        "J'adore voyager avec ma famille.",
        'Me encanta viajar con mi familia.',
        ['likes', 'verbs'],
        {
          acceptedTranslations: ['adoro'],
          emoji: '😍',
        },
      ),
      w(
        'fr-je-deteste',
        'je déteste',
        'odio',
        'Je déteste le foot.',
        'Odio el fútbol.',
        ['likes', 'verbs'],
        {
          acceptedTranslations: ['detesto'],
          emoji: '👎',
        },
      ),
      w('fr-je-prefere', 'je préfère', 'prefiero', 'Je préfère le thé.', 'Prefiero el té.', [
        'likes',
        'verbs',
      ]),
      w(
        'fr-tu-aimes',
        'tu aimes',
        'te gusta',
        'Tu aimes danser?',
        '¿Te gusta bailar?',
        ['likes', 'verbs'],
        {
          acceptedTranslations: ['te gustan'],
        },
      ),
      w(
        'fr-le-sport',
        'le sport',
        'el deporte',
        'Je fais du sport le samedi.',
        'Hago deporte los sábados.',
        ['hobbies', 'm'],
        {
          emoji: '🏃',
        },
      ),
      w(
        'fr-la-musique',
        'la musique',
        'la música',
        "J'écoute de la musique le soir.",
        'Escucho música a la noche.',
        ['hobbies', 'f'],
        {
          emoji: '🎵',
        },
      ),
      w(
        'fr-le-foot',
        'le foot',
        'el fútbol',
        'Je joue au foot avec mon frère.',
        'Juego al fútbol con mi hermano.',
        ['hobbies', 'm'],
        {
          acceptedTranslations: ['el futbol'],
          emoji: '⚽',
        },
      ),
      w(
        'fr-la-guitare',
        'la guitare',
        'la guitarra',
        'Elle joue de la guitare.',
        'Ella toca la guitarra.',
        ['hobbies', 'f'],
        {
          emoji: '🎸',
        },
      ),
      w(
        'fr-lire',
        'lire',
        'leer',
        "J'aime lire le soir.",
        'Me gusta leer a la noche.',
        ['hobbies', 'verbs'],
        {
          emoji: '📖',
        },
      ),
      w(
        'fr-danser',
        'danser',
        'bailar',
        'Léa adore danser.',
        'A Léa le encanta bailar.',
        ['hobbies', 'verbs'],
        {
          emoji: '💃',
        },
      ),
      w(
        'fr-voyager',
        'voyager',
        'viajar',
        'Tu aimes voyager?',
        '¿Te gusta viajar?',
        ['hobbies', 'verbs'],
        {
          emoji: '✈️',
        },
      ),
      w(
        'fr-cuisiner',
        'cuisiner',
        'cocinar',
        'Mon père aime cuisiner.',
        'A mi papá le gusta cocinar.',
        ['hobbies', 'verbs'],
        {
          emoji: '🍳',
        },
      ),
      w(
        'fr-je-fais',
        'je fais',
        'hago',
        'Je fais du sport tous les jours.',
        'Hago deporte todos los días.',
        ['verbs'],
        {
          acceptedTranslations: ['yo hago'],
        },
      ),
      w(
        'fr-tu-fais',
        'tu fais',
        'hacés',
        "Qu'est-ce que tu fais le week-end?",
        '¿Qué hacés el fin de semana?',
        ['verbs'],
        {
          acceptedTranslations: ['haces', 'tú haces', 'vos hacés'],
        },
      ),
      w(
        'fr-jouer',
        'jouer',
        'jugar',
        "J'aime jouer au foot.",
        'Me gusta jugar al fútbol.',
        ['hobbies', 'verbs'],
        {
          acceptedTranslations: ['tocar (un instrumento)'],
        },
      ),
      w(
        'fr-pas-du-tout',
        'pas du tout',
        'para nada',
        "Je n'aime pas du tout le café.",
        'No me gusta para nada el café.',
        ['likes'],
        {
          acceptedTranslations: ['en absoluto', 'nada'],
        },
      ),
      w(
        'fr-le-temps-libre',
        'le temps libre',
        'el tiempo libre',
        "Le week-end, j'ai du temps libre.",
        'El fin de semana tengo tiempo libre.',
        ['hobbies', 'm'],
      ),
      w('fr-avec', 'avec', 'con', 'Je vais au cinéma avec Léa.', 'Voy al cine con Léa.', [
        'prepositions',
      ]),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "J'aime, je déteste",
        objective: 'Decir qué te gusta, qué te encanta y qué odiás.',
        intro: {
          explanation:
            "Para los gustos: j'aime (me gusta), j'adore (me encanta), je déteste (odio). Para preguntar: tu aimes…? Van con el artículo definido, como en español: j'aime la musique, tu aimes le sport? Para negar, ne… pas alrededor del verbo (ne se vuelve n' delante de vocal): je n'aime pas. Y pas du tout es «para nada». Pronunciación: j'aime y tu aimes suenan igual, porque la es final no suena.",
          examples: [
            { target: "J'aime la musique.", base: 'Me gusta la música.' },
            {
              target: 'Tu aimes le sport? — Non, pas du tout.',
              base: '¿Te gusta el deporte? — No, para nada.',
            },
          ],
        },
        takeaways: [
          "Decís tus gustos con j'aime, j'adore y je déteste + le / la.",
          "Negás con je n'aime pas y reforzás con pas du tout.",
        ],
        exercises: [
          ex.translationChoice(
            "j'aime",
            'me gusta',
            ['me encanta', 'odio', 'te gusta'],
            ['fr-j-aime'],
            {
              id: 'fr.ex.y23yjm118i57ny',
            },
          ),
          ex.translationChoice(
            'je déteste',
            'odio',
            ['me gusta', 'me encanta', 'prefiero'],
            ['fr-je-deteste'],
            {
              id: 'fr.ex.3cegv7c2pth5er',
            },
          ),
          ex.matchPairs(
            [
              ["j'aime", 'me gusta'],
              ["j'adore", 'me encanta'],
              ['je déteste', 'odio'],
              ['tu aimes', 'te gusta'],
            ],
            ['fr-j-aime', 'fr-j-adore', 'fr-je-deteste', 'fr-tu-aimes'],
            { id: 'fr.ex.glmn255mzc40wg' },
          ),
          ex.fillBlank(
            "J'aime ___ musique.",
            'Me gusta la música.',
            'la',
            ['du', 'de', 'une'],
            ['fr-j-aime', 'fr-la-musique'],
            {
              id: 'fr.ex.5t211aojxl8a7k',
              explanation:
                "Con aimer va el artículo definido, como en español: j'aime la musique, nunca «j'aime de la musique».",
            },
          ),
          ex.listenChoice(
            "J'aime le chat.",
            ["J'aime les chats.", "J'adore le chat.", 'Je déteste le chat.'],
            ['fr-j-aime'],
            {
              id: 'fr.ex.jpf3u43mzztc39',
              explanation:
                'Le tiene una e débil, como la eu de deux; les suena como «lé», con la e española. La s de chats no suena.',
            },
          ),
          ex.fillBlank(
            'Tu aimes le sport? — Oui, ___ le sport!',
            '¿Te gusta el deporte? — ¡Sí, me encanta el deporte!',
            "j'adore",
            ['je déteste', 'tu aimes'],
            ['fr-tu-aimes', 'fr-le-sport', 'fr-j-adore'],
            { id: 'fr.ex.kdi49ik98i5oz5', skill: 'vocabulary' },
          ),
          ex.translationChoice(
            'pas du tout',
            'para nada',
            ['un poco', 'mucho', 'también'],
            ['fr-pas-du-tout'],
            {
              id: 'fr.ex.pp09522v8kajw9',
            },
          ),
          ex.fillBlank(
            "Tu aimes le café? — Non, je n'aime pas du ___.",
            '¿Te gusta el café? — No, no me gusta para nada.',
            'tout',
            ['rien', 'peu', 'bien'],
            ['fr-pas-du-tout'],
            {
              id: 'fr.ex.bhu9ey3tqot6uo',
              skill: 'vocabulary',
              explanation: 'Pas du tout es «para nada». La t final de tout no suena.',
            },
          ),
          ex.translateWrite(
            'Me gusta la música.',
            "J'aime la musique.",
            ['fr-j-aime', 'fr-la-musique'],
            {
              id: 'fr.ex.bx0zghz4ufm4zw',
            },
          ),
          ex.shortAnswer(
            'Tu aimes le sport?',
            '¿Te gusta el deporte? (Respondé que no te gusta para nada.)',
            "Non, je n'aime pas du tout le sport.",
            [
              "Je n'aime pas du tout le sport.",
              'Non, pas du tout.',
              'Pas du tout!',
              "Non, je n'aime pas le sport du tout.",
            ],
            ['fr-pas-du-tout', 'fr-le-sport'],
            { id: 'fr.ex.e21y5m1385d8kw' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lire, danser, voyager',
        objective: 'Decir qué actividades te gustan y cuáles preferís.',
        intro: {
          explanation:
            "Después de aimer, adorer, détester y préférer puede ir un verbo en infinitivo, sin preposición: j'aime lire, j'adore danser. Muchos infinitivos terminan en -er, y la r final no suena: danser, voyager, cuisiner. Ojo con je préfère: la primera e lleva tilde aguda (é, cerrada) y la segunda, grave (è, abierta).",
          examples: [
            { target: "J'aime lire.", base: 'Me gusta leer.' },
            { target: 'Je préfère voyager.', base: 'Prefiero viajar.' },
          ],
        },
        takeaways: [
          "Usás aimer, adorer o préférer + infinitivo: j'aime lire.",
          'Decís qué preferís con je préfère.',
        ],
        exercises: [
          ex.translationChoice('lire', 'leer', ['bailar', 'viajar', 'cocinar'], ['fr-lire'], {
            id: 'fr.ex.ggqs9pkw3ko7ba',
          }),
          ex.matchPairs(
            [
              ['lire', 'leer'],
              ['danser', 'bailar'],
              ['voyager', 'viajar'],
              ['cuisiner', 'cocinar'],
            ],
            ['fr-lire', 'fr-danser', 'fr-voyager', 'fr-cuisiner'],
            { id: 'fr.ex.aal4xf3whl43uj' },
          ),
          ex.fillBlank(
            "J'aime ___ le soir.",
            'Me gusta leer a la noche.',
            'lire',
            ['danser', 'voyager', 'cuisiner'],
            ['fr-lire'],
            { id: 'fr.ex.d1w7vtpl3lsm6x', skill: 'vocabulary' },
          ),
          ex.translationChoice(
            'je préfère',
            'prefiero',
            ['odio', 'me gusta', 'te gusta'],
            ['fr-je-prefere'],
            {
              id: 'fr.ex.awq6pqdpokjonc',
            },
          ),
          ex.fillBlank(
            'Tu aimes le thé? — Non, je ___ le café.',
            '¿Te gusta el té? — No, prefiero el café.',
            'préfère',
            ['préfères', 'aimes', 'adores'],
            ['fr-je-prefere'],
            {
              id: 'fr.ex.7sk9o814uitnhd',
              explanation:
                'Con je: je préfère, sin s. Préfères y aimes son las formas de tu (la s no suena, pero se escribe).',
            },
          ),
          ex.listenChoice(
            "J'adore voyager.",
            ["J'adore danser.", 'Je déteste voyager.', "J'aime voyager."],
            ['fr-voyager', 'fr-j-adore'],
            { id: 'fr.ex.3hdsbqu5jhmz92' },
          ),
          ex.orderWords(
            'Je préfère lire le soir.',
            'Prefiero leer a la noche.',
            ['fr-je-prefere', 'fr-lire'],
            {
              id: 'fr.ex.8phtri4wiwqnju',
            },
          ),
          ex.translationChoice(
            'cuisiner',
            'cocinar',
            ['la cocina', 'viajar', 'bailar'],
            ['fr-cuisiner'],
            {
              id: 'fr.ex.zllida06rm18bv',
              explanation: 'Cuisiner es el verbo, cocinar; la cuisine es la cocina.',
            },
          ),
          ex.translateWrite('Me encanta bailar.', "J'adore danser.", ['fr-j-adore', 'fr-danser'], {
            id: 'fr.ex.0rxw6ggofuuv2t',
          }),
          ex.shortAnswer(
            'Tu préfères lire ou voyager?',
            '¿Preferís leer o viajar? (Respondé que preferís viajar.)',
            'Je préfère voyager.',
            ['Moi, je préfère voyager.', 'Je préfère voyager!'],
            ['fr-je-prefere', 'fr-voyager'],
            { id: 'fr.ex.78k8drpzwyv4ec' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Je fais du sport',
        objective: 'Preguntar y decir qué hacés en tu tiempo libre.',
        intro: {
          explanation:
            "Faire es hacer: je fais, tu fais, il fait. Las tres formas suenan igual: la s y la t finales no se pronuncian. Para preguntar: qu'est-ce que tu fais? Con actividades se usa du (de + le) o de la: je fais du sport. Con aimer, en cambio, va le: j'aime le sport. Avec es con: avec Hugo, avec mon frère.",
          examples: [
            { target: "Qu'est-ce que tu fais le week-end?", base: '¿Qué hacés el fin de semana?' },
            { target: 'Je fais du sport avec Hugo.', base: 'Hago deporte con Hugo.' },
          ],
        },
        takeaways: [
          "Preguntás qu'est-ce que tu fais? y respondés je fais…",
          "Decís je fais du sport, pero j'aime le sport.",
        ],
        exercises: [
          ex.translationChoice('je fais', 'hago', ['hacés', 'tengo', 'voy'], ['fr-je-fais'], {
            id: 'fr.ex.hid5vnh1kvrl0o',
          }),
          ex.fillBlank(
            "Qu'est-ce que tu ___ le week-end?",
            '¿Qué hacés el fin de semana?',
            'fais',
            ['fait', 'vas', 'as'],
            ['fr-tu-fais'],
            {
              id: 'fr.ex.3qlh87lzg07cd9',
              explanation: 'Con tu: tu fais. Il fait es la forma de él; suenan igual.',
            },
          ),
          ex.matchPairs(
            [
              ['je fais', 'hago'],
              ['tu fais', 'hacés'],
              ['avec', 'con'],
              ['le temps libre', 'el tiempo libre'],
            ],
            ['fr-je-fais', 'fr-tu-fais', 'fr-avec', 'fr-le-temps-libre'],
            { id: 'fr.ex.x0yguwlgy76t85' },
          ),
          ex.fillBlank(
            'Je fais ___ sport tous les jours.',
            'Hago deporte todos los días.',
            'du',
            ['le', 'la', 'de'],
            ['fr-je-fais', 'fr-le-sport'],
            {
              id: 'fr.ex.e8n777qrvli5bw',
              explanation:
                "Faire va con du (de + le): je fais du sport. Con aimer, en cambio: j'aime le sport.",
            },
          ),
          ex.listenChoice(
            'Je fais du sport avec Hugo.',
            [
              'Il fait du sport avec Hugo.',
              'Je fais du sport avec Léa.',
              'Tu fais du sport avec Hugo?',
            ],
            ['fr-je-fais', 'fr-avec'],
            {
              id: 'fr.ex.crsh0w8nx6bp19',
              explanation: 'Je fais e il fait suenan igual: lo que cambia es el pronombre.',
            },
          ),
          question(
            'fr.ex.t8t9z7axgcrg85',
            PROFIL,
            '¿Qué le encanta hacer a Inès en su tiempo libre?',
            'Leer y viajar.',
            ['Hacer deporte.', 'Bailar.', 'Jugar al fútbol.'],
            ['fr-lire', 'fr-voyager', 'fr-le-temps-libre'],
            "Escribe «Mon temps libre? J'adore lire et voyager».",
          ),
          question(
            'fr.ex.mfrczhom7l0qy8',
            PROFIL,
            '¿Qué opina Inès del deporte?',
            'No le gusta para nada.',
            ['Le encanta.', 'Lo prefiere a leer.', 'Lo hace con su hermana.'],
            ['fr-pas-du-tout', 'fr-le-sport'],
            "Escribe «Je n'aime pas du tout le sport!»: no le gusta para nada.",
          ),
          ex.translationChoice(
            'le temps libre',
            'el tiempo libre',
            ['el fin de semana', 'la semana', 'el deporte'],
            ['fr-le-temps-libre'],
            { id: 'fr.ex.g5uukf8zedqvzu' },
          ),
          ex.translateWrite(
            'Hago deporte con mi hermano.',
            'Je fais du sport avec mon frère.',
            ['fr-je-fais', 'fr-avec'],
            { id: 'fr.ex.zcgb82g0d4y6qe' },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu fais le week-end?",
            '¿Qué hacés el fin de semana? (Respondé que hacés deporte.)',
            'Je fais du sport.',
            ['Le week-end, je fais du sport.', 'Je fais du sport le week-end.'],
            ['fr-je-fais', 'fr-le-sport'],
            { id: 'fr.ex.r7rlkuht4dew42' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Jouer au foot, jouer de la guitare',
        objective: 'Decir qué deporte jugás y qué instrumento tocás.',
        intro: {
          explanation:
            'Jouer es jugar y también tocar un instrumento, pero cambia la preposición. Con deportes, jouer à: à + le = au (je joue au foot, au tennis). Con instrumentos, jouer de: de la guitare, du piano (de + le = du). El foot es el deporte más popular de Francia.',
          examples: [
            { target: 'Je joue au foot.', base: 'Juego al fútbol.' },
            { target: 'Elle joue de la guitare.', base: 'Ella toca la guitarra.' },
          ],
        },
        takeaways: [
          'Decís jouer au + deporte: je joue au foot.',
          'Decís jouer de la / du + instrumento: je joue de la guitare.',
        ],
        exercises: [
          ex.translationChoice('jouer', 'jugar', ['bailar', 'leer', 'viajar'], ['fr-jouer'], {
            id: 'fr.ex.gzdseifkeo0k9e',
          }),
          ex.fillBlank(
            'Je joue ___ foot.',
            'Juego al fútbol.',
            'au',
            ['du', 'de', 'le'],
            ['fr-jouer', 'fr-le-foot'],
            {
              id: 'fr.ex.hqxi4bggwr6h1j',
              explanation: 'Con deportes, jouer à; à + le se contrae en au: je joue au foot.',
            },
          ),
          ex.fillBlank(
            'Elle joue ___ guitare.',
            'Ella toca la guitarra.',
            'de la',
            ['à la', 'la', 'au'],
            ['fr-jouer', 'fr-la-guitare'],
            {
              id: 'fr.ex.0soxu0vuqrsy73',
              explanation:
                'Con instrumentos, jouer de: de la guitare, du piano. En español es «tocar», en francés jouer.',
            },
          ),
          ex.matchPairs(
            [
              ['le foot', 'el fútbol'],
              ['la guitare', 'la guitarra'],
              ['jouer', 'jugar'],
              ['le sport', 'el deporte'],
            ],
            ['fr-le-foot', 'fr-la-guitare', 'fr-jouer', 'fr-le-sport'],
            { id: 'fr.ex.3omdc9zdauzxc8' },
          ),
          ex.listenChoice(
            'Tu joues au foot?',
            ['Tu joues au tennis?', 'Tu joues du piano?', 'Je joue au foot.'],
            ['fr-jouer', 'fr-le-foot'],
            { id: 'fr.ex.odtukld5r8ife0' },
          ),
          ex.imageChoice(
            '🎸',
            'la guitare',
            ['le piano', 'le foot', 'la musique'],
            ['fr-la-guitare'],
            {
              id: 'fr.ex.nk7dpco4ml7eme',
            },
          ),
          question(
            'fr.ex.aghgtamlharczk',
            WEEK_END,
            '¿Qué hace Nicolas el fin de semana?',
            'Juega al fútbol con su hermano.',
            ['Toca la guitarra.', 'Baila con Camille.', 'Va al cine con su hermano.'],
            ['fr-le-foot', 'fr-jouer', 'fr-avec'],
            'Nicolas dice «Je joue au foot avec mon frère».',
          ),
          question(
            'fr.ex.2ioy7b4wip781p',
            WEEK_END,
            '¿Qué instrumento toca Camille?',
            'La guitarra.',
            ['El piano.', 'Ninguno.', 'No lo dice.'],
            ['fr-la-guitare', 'fr-jouer'],
            'Nicolas le pregunta «Tu joues de la guitare?» y ella responde «Oui».',
          ),
          ex.translateWrite(
            'Juego al fútbol con Hugo.',
            'Je joue au foot avec Hugo.',
            ['fr-jouer', 'fr-le-foot', 'fr-avec'],
            { id: 'fr.ex.c6kdia4ctzb2nc' },
          ),
          ex.translateWrite(
            'Ella toca la guitarra.',
            'Elle joue de la guitare.',
            ['fr-jouer', 'fr-la-guitare'],
            {
              id: 'fr.ex.n1qcbt0okorrn3',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mi tiempo libre',
        objective: 'Contar qué te gusta hacer y qué no, y preguntarle a otra persona.',
        intro: {
          explanation:
            "Para hablar de tu tiempo libre combinás todo: j'aime + le / la o + infinitivo, je fais du sport, je joue au foot. En la negación el artículo no cambia: je n'aime pas le foot. Con ils y elles hay liaison: en ils aiment, la s se une a la vocal con un sonido z; en il aime no hay ningún sonido z.",
          examples: [
            { target: 'Ils aiment le foot.', base: 'A ellos les gusta el fútbol.' },
            {
              target: "Je n'aime pas le foot, je préfère la musique.",
              base: 'No me gusta el fútbol, prefiero la música.',
            },
          ],
        },
        takeaways: [
          "Contás qué te gusta y qué no con j'aime, je n'aime pas y je préfère.",
          'Distinguís il aime de ils aiment por la liaison con sonido z.',
        ],
        exercises: [
          question(
            'fr.ex.u51gizzjkur0m8',
            WEEK_END,
            '¿Qué prefiere Camille?',
            'La música.',
            ['El fútbol.', 'El deporte.', 'Leer.'],
            ['fr-je-prefere', 'fr-la-musique', 'fr-je-deteste'],
            'Camille dice «Je déteste le foot! Je préfère la musique».',
          ),
          question(
            'fr.ex.6l2iv5qiwc19l0',
            PROFIL,
            '¿Con quién cocina Inès?',
            'Con su hermana.',
            ['Con su mamá.', 'Sola.', 'Con su hermano.'],
            ['fr-cuisiner', 'fr-avec'],
            "Escribe «J'aime aussi cuisiner avec ma sœur».",
          ),
          ex.listenChoice(
            'Ils aiment le foot.',
            ['Il aime le foot.', 'Elles aiment le sport.', 'Ils aiment la musique.'],
            ['fr-le-foot', 'fr-j-aime'],
            {
              id: 'fr.ex.fku591f29te4xd',
              explanation: 'En ils aiment se oye la liaison con sonido z; en il aime, no.',
            },
          ),
          ex.fillBlank(
            "Je n'aime pas ___ foot.",
            'No me gusta el fútbol.',
            'le',
            ['du', 'de', 'au'],
            ['fr-le-foot', 'fr-j-aime'],
            {
              id: 'fr.ex.bbnf10qwdw9wyl',
              explanation:
                "Con aimer, el artículo se mantiene en la negación: je n'aime pas le foot.",
            },
          ),
          ex.orderWords(
            'Tu aimes jouer de la guitare?',
            '¿Te gusta tocar la guitarra?',
            ['fr-tu-aimes', 'fr-jouer', 'fr-la-guitare'],
            { id: 'fr.ex.23zf2scpds7h07' },
          ),
          ex.translationChoice('avec', 'con', ['sin', 'para', 'de'], ['fr-avec'], {
            id: 'fr.ex.8jreuq7u4blhhp',
          }),
          ex.fillBlank(
            'Le week-end, ___ du sport avec mon père.',
            'El fin de semana hago deporte con mi papá.',
            'je fais',
            ['tu fais', 'je joue', "j'aime"],
            ['fr-je-fais', 'fr-le-sport'],
            {
              id: 'fr.ex.xvfkh3ubwjpr5i',
              explanation:
                "Hacer deporte es faire du sport; «j'aime du sport» o «je joue du sport» no existen.",
            },
          ),
          ex.translationChoice('tu fais', 'hacés', ['hago', 'te gusta', 'jugás'], ['fr-tu-fais'], {
            id: 'fr.ex.t047ivkhv0yyau',
          }),
          ex.translateWrite(
            'Me gusta mucho viajar con mi familia.',
            "J'aime beaucoup voyager avec ma famille.",
            ['fr-j-aime', 'fr-voyager', 'fr-avec'],
            {
              id: 'fr.ex.i84we76ydowxjj',
              acceptedAnswers: ["J'adore voyager avec ma famille."],
            },
          ),
          ex.shortAnswer(
            'Tu aimes danser?',
            '¿Te gusta bailar? (Respondé que sí, que te encanta bailar.)',
            "Oui, j'adore danser!",
            ["Oui, j'adore danser.", "J'adore danser!", "Oui, j'adore!", "Oui, j'adore ça!"],
            ['fr-j-adore', 'fr-danser'],
            { id: 'fr.ex.4fyd254xvuhayu' },
          ),
        ],
      },
    ],
  },
};

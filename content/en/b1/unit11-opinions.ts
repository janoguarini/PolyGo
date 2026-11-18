import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U11 «Opiniones y relaciones» (docs/B1_EN.md): dar opiniones, acordar y discrepar; ventajas y
 * desventajas (on the other hand); el segundo condicional (if + pasado, would) e if I were you; las
 * relaciones (get on with, argue, trust, apologize); deseos y preferencias (I wish, would rather).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CITY_DEBATE = dialogue('en.stim.b1-u11-debate', 'Dos amigos discuten dónde es mejor vivir.', [
  ['Tom', 'In my opinion, it is better to live in a big city. There is so much to do.'],
  ['Emma', "I don't agree. Cities are noisy and expensive."],
  ['Tom', 'That is true. On the other hand, there are more jobs.'],
  ['Emma', 'I agree with you about that. But I prefer to live near the sea.'],
]);

const ROOMMATE = reading(
  'en.stim.b1-u11-roommate',
  'post',
  'Una consulta en un foro y una respuesta.',
  [
    'Help! I share an apartment with a friend, but we have problems all the time. She never cleans the kitchen. What should I do? – Lucy',
    'Reply: If I were you, I would talk to her calmly. Maybe you could make a list of jobs for each person. If she doesn’t change, it might be time to find a new place. – Ben',
  ],
  { title: 'Problems with my roommate' },
);

const SORRY = reading(
  'en.stim.b1-u11-sorry',
  'message',
  'Mia le escribe a su mejor amiga después de una pelea.',
  [
    'Hi Kate, I want to apologize for yesterday.',
    'I was tired, and I said things that I didn’t mean.',
    'You have always supported me, and I trust you more than anyone.',
    'I hope we can talk soon. I really miss you.',
  ],
  { from: 'Mia', to: 'Kate' },
);

const WISHES = reading(
  'en.stim.b1-u11-wishes',
  'post',
  'Rosa escribe sobre lo que le gustaría cambiar.',
  [
    'I wish I had more free time.',
    'I work all day, and I would rather spend more time with my family.',
    'If I had more time, I would learn to paint.',
  ],
  { from: 'Rosa', title: 'If only…' },
);

const MONEY = dialogue('en.stim.b1-u11-money', 'Sam y Lucy imaginan qué harían con mucho dinero.', [
  ['Sam', 'What would you do if you had a million dollars?'],
  ['Lucy', 'I would travel around the world. And you?'],
  ['Sam', 'If I had that money, I would buy a house for my parents.'],
  ['Lucy', 'That is so nice of you!'],
]);

export const EN_B1_U11: B1UnitDef = {
  names: ['Tom', 'Emma', 'Lucy', 'Ben', 'Mia', 'Kate', 'Sam', 'Alex', 'Rosa'],
  support: [
    'true',
    'roommate',
    'calmly',
    'list',
    'each',
    'place',
    'things',
    'million',
    'idea',
    'view',
    'side',
  ],
  unit: {
    position: 11,
    title: 'Opiniones y relaciones',
    titleEn: 'Opinions and relationships',
    description:
      'Dar tu opinión, acordar y discrepar, ventajas y desventajas, imaginar con el segundo condicional, relaciones y deseos.',
    emoji: '💬',
    objective:
      'Podés dar y defender tu opinión, aconsejar a alguien con if I were you, hablar de tus relaciones y expresar deseos.',
    grammar: {
      title: 'Segundo condicional',
      explanation:
        'If + past simple, would + verbo: una situación imaginaria o poco probable. If I had more time, I would travel more (no tengo tiempo). Con be se usa were para todos: If I were you, I would talk to her (yo que vos…).',
      examples: [
        {
          target: 'If I had more time, I would travel more.',
          base: 'Si tuviera más tiempo, viajaría más.',
        },
        { target: 'If I were you, I would talk to her.', base: 'Yo que vos, hablaría con ella.' },
        { target: 'I wish I had more free time.', base: 'Ojalá tuviera más tiempo libre.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-in-my-opinion',
        'in my opinion',
        'en mi opinión',
        '/ɪn maɪ əˈpɪnjən/',
        '💭',
        'In my opinion, it is a good idea.',
        'En mi opinión, es una buena idea.',
        ['opinions'],
        ['para mí', 'a mi parecer'],
      ),
      w(
        'en-agree',
        'agree',
        'estar de acuerdo',
        '/əˈɡri/',
        '👍',
        'I agree with you.',
        'Estoy de acuerdo con vos.',
        ['opinions', 'verbs'],
      ),
      w(
        'en-disagree',
        'disagree',
        'no estar de acuerdo',
        '/ˌdɪsəˈɡri/',
        '👎',
        'I disagree with that idea.',
        'No estoy de acuerdo con esa idea.',
        ['opinions', 'verbs'],
        ['discrepar'],
      ),
      w(
        'en-on-the-other-hand',
        'on the other hand',
        'por otro lado',
        '/ɑn ði ˈʌðər ˈhænd/',
        undefined,
        'The city is noisy. On the other hand, there are more jobs.',
        'La ciudad es ruidosa. Por otro lado, hay más trabajo.',
        ['opinions', 'connectors'],
        ['en cambio'],
      ),
      w(
        'en-advantage',
        'advantage',
        'ventaja',
        '/ədˈvæntɪdʒ/',
        '➕',
        'One advantage of the city is the transport.',
        'Una ventaja de la ciudad es el transporte.',
        ['opinions'],
      ),
      w(
        'en-disadvantage',
        'disadvantage',
        'desventaja',
        '/ˌdɪsədˈvæntɪdʒ/',
        '➖',
        'The main disadvantage is the price.',
        'La desventaja principal es el precio.',
        ['opinions'],
      ),
      w(
        'en-if-i-were-you',
        'if I were you',
        'yo que vos / si fuera vos',
        '/ɪf aɪ wɜr ju/',
        undefined,
        'If I were you, I would rest.',
        'Yo que vos, descansaría.',
        ['conditionals', 'advice'],
        ['yo que vos', 'si fuera vos', 'yo que tú'],
      ),
      w(
        'en-wish',
        'wish',
        'ojalá / desear (algo difícil)',
        '/wɪʃ/',
        '🌠',
        'I wish I had more time.',
        'Ojalá tuviera más tiempo.',
        ['wishes'],
        ['ojalá', 'desear'],
      ),
      w(
        'en-would-rather',
        'would rather',
        'preferiría',
        '/wʊd ˈræðər/',
        undefined,
        'I would rather stay at home.',
        'Preferiría quedarme en casa.',
        ['preferences'],
        ['prefiero'],
      ),
      w(
        'en-relationship',
        'relationship',
        'relación',
        '/rɪˈleɪʃənˌʃɪp/',
        '💞',
        'They have a good relationship.',
        'Tienen una buena relación.',
        ['relationships'],
      ),
      w(
        'en-partner',
        'partner',
        'pareja / compañero',
        '/ˈpɑrtnər/',
        undefined,
        'This is my partner, Alex.',
        'Ella es mi pareja, Alex.',
        ['relationships'],
        ['pareja', 'compañero', 'compañera'],
      ),
      w(
        'en-get-on-with',
        'get on with',
        'llevarse bien con',
        '/ˈɡɛt ˈɑn wɪð/',
        '🤝',
        'I get on well with my sister.',
        'Me llevo bien con mi hermana.',
        ['relationships', 'phrasal-verbs'],
      ),
      w(
        'en-argue',
        'argue',
        'discutir / pelearse',
        '/ˈɑrɡju/',
        '😤',
        'They argue about money.',
        'Discuten por plata.',
        ['relationships', 'verbs'],
        ['discutir', 'pelearse'],
      ),
      w(
        'en-trust',
        'trust',
        'confiar en / confianza',
        '/trʌst/',
        undefined,
        'I trust my best friend.',
        'Confío en mi mejor amigo.',
        ['relationships'],
        ['confiar', 'confiar en', 'confianza'],
      ),
      w(
        'en-apologize',
        'apologize',
        'pedir perdón / disculparse',
        '/əˈpɑləˌdʒaɪz/',
        '🙏',
        'I want to apologize.',
        'Quiero pedir perdón.',
        ['relationships', 'verbs'],
        ['pedir perdón', 'disculparse', 'pedir disculpas'],
      ),
      w(
        'en-support',
        'support',
        'apoyar / apoyo',
        '/səˈpɔrt/',
        undefined,
        'My family always supports me.',
        'Mi familia siempre me apoya.',
        ['relationships'],
        ['apoyar', 'apoyo'],
      ),
      w(
        'en-honest',
        'honest',
        'sincero / honesto',
        '/ˈɑnɪst/',
        undefined,
        'Please be honest with me.',
        'Por favor, sé sincero conmigo.',
        ['relationships', 'adjectives'],
        ['sincero', 'sincera', 'honesto', 'honesta'],
      ),
      w(
        'en-jealous',
        'jealous',
        'celoso / celosa / envidioso',
        '/ˈdʒɛləs/',
        undefined,
        "Don't be jealous.",
        'No seas celoso.',
        ['relationships', 'feelings'],
        ['celoso', 'celosa', 'envidioso'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Qué opinás?',
        objective: 'Dar tu opinión y decir si estás de acuerdo.',
        intro: {
          explanation:
            "Para opinar: In my opinion… / I think… Para acordar: I agree (with you). Para discrepar con cortesía: I don't agree o I disagree. Ojo: en inglés no se dice «I am agree».",
          examples: [
            {
              target: 'In my opinion, it is a good idea.',
              base: 'En mi opinión, es una buena idea.',
            },
            { target: "I don't agree with you.", base: 'No estoy de acuerdo con vos.' },
          ],
        },
        takeaways: [
          'Das tu opinión: In my opinion…, I think…',
          'Acordás y discrepás: I agree, I disagree.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['in my opinion', 'en mi opinión'],
              ['agree', 'estar de acuerdo'],
              ['disagree', 'no estar de acuerdo'],
              ['honest', 'sincero / honesto'],
            ],
            ['en-in-my-opinion', 'en-agree', 'en-disagree', 'en-honest'],
            { id: 'en.ex.6bvss297053owa' },
          ),
          ex.fillBlank(
            'I ___ with you. It is a great idea.',
            'Estoy de acuerdo con vos. Es una gran idea.',
            'agree',
            ['am agree', 'agrees', 'agreeing'],
            ['en-agree'],
            {
              id: 'en.ex.5g30p25zz8eaen',
              explanation: 'Agree es un verbo: I agree (no «I am agree»).',
            },
          ),
          ex.fillBlank(
            'In my ___, it is better to live near the sea.',
            'En mi opinión, es mejor vivir cerca del mar.',
            'opinion',
            ['idea', 'think', 'view'],
            ['en-in-my-opinion', 'en-sea'],
            { id: 'en.ex.exd4w3bmh2tpn0', skill: 'vocabulary' },
          ),
          question(
            'en.ex.ag3gvwgvax0bel',
            CITY_DEBATE,
            '¿Qué opina Tom?',
            'Que es mejor vivir en una ciudad grande',
            [
              'Que es mejor vivir cerca del mar',
              'Que las ciudades son caras',
              'Que no hay trabajo en la ciudad',
            ],
            ['en-in-my-opinion'],
            'Tom dice: «In my opinion, it is better to live in a big city».',
          ),
          question(
            'en.ex.uxfm9405t7012j',
            CITY_DEBATE,
            '¿Por qué Emma no está de acuerdo?',
            'Las ciudades son ruidosas y caras',
            ['No hay trabajo', 'Hay poco para hacer', 'El transporte es malo'],
            ['en-agree'],
            "Emma dice: «I don't agree. Cities are noisy and expensive».",
          ),
          ex.listenChoice(
            'I disagree with that idea.',
            [
              'I agree with that idea.',
              'I disagree with your idea.',
              'We disagree with that idea.',
            ],
            ['en-disagree'],
            { id: 'en.ex.qphc9geob2ipl8' },
          ),
          ex.orderWords(
            'Please be honest with me.',
            'Por favor, sé sincero conmigo.',
            ['en-honest'],
            { id: 'en.ex.wmb0kyz69r590l' },
          ),
          ex.shortAnswer(
            'Do you agree with me? (sí, totalmente)',
            '¿Estás de acuerdo conmigo?',
            'Yes, I agree with you.',
            ['Yes, I agree.', 'Yes, I completely agree.', 'Yes, I totally agree.', 'Yes, I do.'],
            ['en-agree'],
            { id: 'en.ex.6lazqgnhbctpi6' },
          ),
          ex.translateWrite(
            'En mi opinión, es una buena idea.',
            'In my opinion, it is a good idea.',
            ['en-in-my-opinion'],
            {
              id: 'en.ex.r1gxre9zuitbve',
              acceptedAnswers: [
                "In my opinion, it's a good idea.",
                'In my opinion it is a good idea.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Ventajas y desventajas',
        objective: 'Comparar opciones con ventajas, desventajas y on the other hand.',
        intro: {
          explanation:
            'Para comparar dos opciones: One advantage is… (una ventaja es…), The main disadvantage is… (la desventaja principal es…). On the other hand (por otro lado) presenta el otro punto de vista.',
          examples: [
            {
              target: 'One advantage of the city is the transport.',
              base: 'Una ventaja de la ciudad es el transporte.',
            },
            {
              target: 'It is cheap. On the other hand, it is far.',
              base: 'Es barato. Por otro lado, queda lejos.',
            },
          ],
        },
        takeaways: [
          'Presentás ventajas y desventajas.',
          'Mostrás los dos lados con on the other hand.',
        ],
        exercises: [
          ex.translationChoice(
            'disadvantage',
            'desventaja',
            ['ventaja', 'relación', 'opinión'],
            ['en-disadvantage'],
            { id: 'en.ex.3ehuz15jfhivhp' },
          ),
          ex.fillBlank(
            'One ___ of working from home is that you save time.',
            'Una ventaja de trabajar desde casa es que ahorrás tiempo.',
            'advantage',
            ['disadvantage', 'opinion', 'idea'],
            ['en-advantage'],
            { id: 'en.ex.h7le57mry0oj5r', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'The apartment is cheap. On the other ___, it is very small.',
            'El departamento es barato. Por otro lado, es muy chico.',
            'hand',
            ['side', 'way', 'part'],
            ['en-on-the-other-hand', 'en-cheap'],
            { id: 'en.ex.tz2l430u9gfemh', skill: 'vocabulary' },
          ),
          question(
            'en.ex.zampxs8l344ev5',
            CITY_DEBATE,
            '¿Qué ventaja de la ciudad acepta Tom?',
            'Hay más trabajo',
            ['Es más tranquila', 'Es más barata', 'Está cerca del mar'],
            ['en-on-the-other-hand', 'en-advantage'],
            'Tom dice: «On the other hand, there are more jobs».',
          ),
          ex.fillBlank(
            'The main ___ of the city is the noise.',
            'La desventaja principal de la ciudad es el ruido.',
            'disadvantage',
            ['advantage', 'opinion', 'idea'],
            ['en-disadvantage', 'en-noise'],
            { id: 'en.ex.gcgr0zojt9qjii', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'It is cheap. On the other hand, it is far.',
            [
              'It is cheap. On the other hand, it is small.',
              'It is expensive. On the other hand, it is near.',
              'It was cheap. On the other hand, it was far.',
            ],
            ['en-on-the-other-hand', 'en-far'],
            { id: 'en.ex.hirg87dfyba9gt' },
          ),
          ex.orderWords(
            'One advantage of the city is the transport.',
            'Una ventaja de la ciudad es el transporte.',
            ['en-advantage', 'en-city'],
            { id: 'en.ex.434wuwmbpox7cy' },
          ),
          ex.shortAnswer(
            'What is one advantage of living in a city? (hay más trabajo)',
            '¿Cuál es una ventaja de vivir en una ciudad?',
            'There are more jobs.',
            [
              'One advantage is that there are more jobs.',
              'There are more jobs in the city.',
              'More jobs.',
            ],
            ['en-advantage'],
            { id: 'en.ex.j9z9kuw0iezatn' },
          ),
          ex.translateWrite(
            'Es barato. Por otro lado, es muy chico.',
            'It is cheap. On the other hand, it is very small.',
            ['en-on-the-other-hand', 'en-cheap'],
            {
              id: 'en.ex.ryd3lisberzjyq',
              acceptedAnswers: [
                "It's cheap. On the other hand, it's very small.",
                'It is cheap. On the other hand it is very small.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Si fuera…',
        objective: 'Imaginar situaciones y aconsejar con el segundo condicional e if I were you.',
        intro: {
          explanation:
            "Para algo imaginario: If + pasado, would + verbo. If I had a million dollars, I would travel. If I were you (yo que vos) sirve para aconsejar: If I were you, I would talk to her. I would se contrae en I'd.",
          examples: [
            {
              target: 'If I had more time, I would travel more.',
              base: 'Si tuviera más tiempo, viajaría más.',
            },
            { target: "If I were you, I'd talk to her.", base: 'Yo que vos, hablaría con ella.' },
          ],
        },
        takeaways: [
          'Imaginás situaciones con if + pasado y would.',
          'Aconsejás con If I were you, I would…',
        ],
        exercises: [
          ex.fillBlank(
            'If I ___ more time, I would travel more.',
            'Si tuviera más tiempo, viajaría más.',
            'had',
            ['have', 'will have', 'would have'],
            ['en-had', 'en-if'],
            {
              id: 'en.ex.wo41z09x8ubdog',
              explanation: 'Segundo condicional: if + pasado (had), would + verbo.',
            },
          ),
          ex.fillBlank(
            'If I won a lot of money, I ___ buy a house.',
            'Si ganara mucha plata, me compraría una casa.',
            'would',
            ['will', 'did', 'can'],
            ['en-won', 'en-house'],
            { id: 'en.ex.3v1boz1sdkm6z9' },
          ),
          ex.fillBlank(
            'If I ___ you, I would talk to her.',
            'Yo que vos, hablaría con ella.',
            'were',
            ['was being', 'am', 'be'],
            ['en-if-i-were-you', 'en-talk'],
            {
              id: 'en.ex.3ht2ozqmt210ih',
              explanation:
                'En el segundo condicional se usa were con todas las personas: If I were you.',
            },
          ),
          question(
            'en.ex.w2h5xfbudxtm7p',
            MONEY,
            '¿Qué haría Sam con un millón de dólares?',
            'Le compraría una casa a sus padres',
            ['Viajaría por el mundo', 'Ahorraría todo', 'Montaría un negocio'],
            ['en-if', 'en-house'],
            'Sam dice: «If I had that money, I would buy a house for my parents».',
          ),
          question(
            'en.ex.mq6nii59o25k94',
            ROOMMATE,
            '¿Qué le aconseja Ben a Lucy?',
            'Hablar con calma con su amiga',
            ['Mudarse enseguida', 'Limpiar ella la cocina', 'No decir nada'],
            ['en-if-i-were-you'],
            'Ben responde: «If I were you, I would talk to her calmly».',
          ),
          ex.listenChoice(
            'What would you do if you had a million dollars?',
            [
              'What would you do if you won a million dollars?',
              'What will you do if you have a million dollars?',
              'What would you buy if you had a million dollars?',
            ],
            ['en-if'],
            { id: 'en.ex.ne2vamxyqakipd' },
          ),
          ex.orderWords(
            'If I were you I would rest.',
            'Yo que vos, descansaría.',
            ['en-if-i-were-you', 'en-rest'],
            { id: 'en.ex.viae7dsbvdn21m' },
          ),
          ex.shortAnswer(
            'What would you do if you had a million dollars? (viajarías por el mundo)',
            '¿Qué harías si tuvieras un millón de dólares?',
            'I would travel around the world.',
            [
              "I'd travel around the world.",
              'I would travel the world.',
              "I'd travel the world.",
              'Travel around the world.',
            ],
            ['en-travel'],
            { id: 'en.ex.lwt6y1awipnb03' },
          ),
          ex.translateWrite(
            'Yo que vos, iría al médico.',
            'If I were you, I would see a doctor.',
            ['en-if-i-were-you', 'en-doctor'],
            {
              id: 'en.ex.6swfwq814p9lzc',
              acceptedAnswers: [
                "If I were you, I'd see a doctor.",
                'If I were you, I would go to the doctor.',
                "If I were you, I'd go to the doctor.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Relaciones',
        objective:
          'Hablar de amistades y relaciones: llevarse bien, discutir, confiar, pedir perdón.',
        intro: {
          explanation:
            'Get on (well) with es llevarse bien con alguien. Argue es discutir. Trust es confiar (I trust you). Apologize es pedir perdón: I want to apologize for yesterday. Support es apoyar.',
          examples: [
            { target: 'I get on well with my sister.', base: 'Me llevo bien con mi hermana.' },
            {
              target: 'I want to apologize for yesterday.',
              base: 'Quiero pedirte perdón por lo de ayer.',
            },
          ],
        },
        takeaways: [
          'Contás cómo te llevás con la gente.',
          'Pedís perdón y decís en quién confiás.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['argue', 'discutir / pelearse'],
              ['trust', 'confiar en / confianza'],
              ['apologize', 'pedir perdón / disculparse'],
              ['support', 'apoyar / apoyo'],
            ],
            ['en-argue', 'en-trust', 'en-apologize', 'en-support'],
            { id: 'en.ex.y35tgdbd7y1u1t' },
          ),
          ex.fillBlank(
            'I get ___ well with my sister.',
            'Me llevo bien con mi hermana.',
            'on',
            ['up', 'in', 'off'],
            ['en-get-on-with', 'en-sister'],
            { id: 'en.ex.efx8sdvtehkqnb', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'They often ___ about money.',
            'Discuten seguido por plata.',
            'argue',
            ['agree', 'trust', 'support'],
            ['en-argue', 'en-money'],
            { id: 'en.ex.mv82qvxuvp73sj', skill: 'vocabulary' },
          ),
          ex.imageChoice(
            '🤝',
            'get on with',
            ['argue', 'apologize', 'disagree'],
            ['en-get-on-with'],
            { id: 'en.ex.sranw6fs7ox32i' },
          ),
          ex.fillBlank(
            'This is my ___, Alex. We have been together for five years.',
            'Él es mi pareja, Alex. Estamos juntos desde hace cinco años.',
            'partner',
            ['relationship', 'support', 'advantage'],
            ['en-partner', 'en-together'],
            { id: 'en.ex.fss0bhhqzxc9vq', skill: 'vocabulary' },
          ),
          question(
            'en.ex.4cr0mttsiq06ks',
            SORRY,
            '¿Para qué le escribe Mia a Kate?',
            'Para pedirle perdón por lo de ayer',
            ['Para invitarla a salir', 'Para contarle una noticia', 'Para pedirle ayuda'],
            ['en-apologize'],
            'Mia escribe: «I want to apologize for yesterday».',
          ),
          question(
            'en.ex.knfxwxdc1ccv0g',
            SORRY,
            '¿Qué dice Mia sobre Kate?',
            'Que siempre la apoyó y que confía en ella',
            ['Que está celosa', 'Que no la extraña', 'Que nunca la escucha'],
            ['en-support', 'en-trust'],
            'Mia escribe: «You have always supported me, and I trust you more than anyone».',
          ),
          ex.listenChoice(
            'They have a good relationship.',
            [
              'They have a good partner.',
              'They had a good relationship.',
              'We have a good relationship.',
            ],
            ['en-relationship'],
            { id: 'en.ex.1m8fraw3c4lczk' },
          ),
          ex.translateWrite(
            'Confío en mi mejor amiga.',
            'I trust my best friend.',
            ['en-trust', 'en-friend'],
            {
              id: 'en.ex.qljv131ct3n9qn',
              acceptedAnswers: ['I trust my best friend a lot.'],
            },
          ),
          ex.translateWrite('Quiero pedirte perdón.', 'I want to apologize.', ['en-apologize'], {
            id: 'en.ex.dv348n2t4e1diq',
            acceptedAnswers: [
              'I want to apologize to you.',
              'I would like to apologize.',
              'I want to say sorry.',
            ],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Deseos y preferencias',
        objective: 'Expresar deseos (I wish) y preferencias (would rather).',
        intro: {
          explanation:
            'I wish + pasado expresa un deseo sobre el presente que no es real: I wish I had more time (ojalá tuviera…). Would rather + verbo es «preferiría»: I would rather stay at home. Jealous es celoso o envidioso.',
          examples: [
            { target: 'I wish I had more free time.', base: 'Ojalá tuviera más tiempo libre.' },
            {
              target: 'I would rather live near the sea.',
              base: 'Preferiría vivir cerca del mar.',
            },
          ],
        },
        takeaways: [
          'Expresás deseos con I wish + pasado.',
          'Decís qué preferirías con would rather.',
        ],
        exercises: [
          ex.translationChoice(
            'jealous',
            'celoso / celosa / envidioso',
            ['sincero / honesto', 'orgulloso / orgullosa', 'tímido / tímida'],
            ['en-jealous'],
            { id: 'en.ex.u1q1wph6dy1tsn' },
          ),
          ex.fillBlank(
            'I wish I ___ more free time.',
            'Ojalá tuviera más tiempo libre.',
            'had',
            ['have', 'will have', 'having'],
            ['en-wish', 'en-free-time'],
            {
              id: 'en.ex.ck5yu0ppk6nhcm',
              explanation: 'I wish + pasado: un deseo sobre algo que hoy no es así.',
            },
          ),
          ex.fillBlank(
            'I would ___ stay at home tonight.',
            'Esta noche preferiría quedarme en casa.',
            'rather',
            ['better', 'prefer', 'like'],
            ['en-would-rather', 'en-stay'],
            { id: 'en.ex.umdv1benui10d9', skill: 'vocabulary' },
          ),
          question(
            'en.ex.1q3mdjtl9rjbaq',
            WISHES,
            '¿Qué desea Rosa?',
            'Tener más tiempo libre',
            ['Trabajar más', 'Vivir cerca del mar', 'Tener más plata'],
            ['en-wish'],
            'Rosa escribe: «I wish I had more free time».',
          ),
          question(
            'en.ex.w9ed3lf6uz9c7z',
            WISHES,
            '¿Cómo preferiría pasar el tiempo?',
            'Con su familia',
            ['Pintando', 'En el trabajo', 'Viajando sola'],
            ['en-would-rather'],
            'Rosa escribe: «I would rather spend more time with my family».',
          ),
          ex.listenChoice(
            'I would rather stay at home.',
            [
              'I would rather go out.',
              'I would like to stay at home.',
              'We would rather stay at home.',
            ],
            ['en-would-rather'],
            { id: 'en.ex.dhaslsn06lzdq4' },
          ),
          ex.orderWords(
            'I wish I lived near the beach.',
            'Ojalá viviera cerca de la playa.',
            ['en-wish', 'en-beach'],
            { id: 'en.ex.7wrdu8dr69s26m' },
          ),
          ex.shortAnswer(
            'Would you like to go out tonight? (preferirías quedarte en casa)',
            '¿Querés salir esta noche?',
            'I would rather stay at home.',
            [
              "I'd rather stay at home.",
              'I would rather stay home.',
              "I'd rather stay home.",
              'No, I would rather stay at home.',
              "No, I'd rather stay at home.",
            ],
            ['en-would-rather'],
            { id: 'en.ex.f3cqbl0nqfw8bu' },
          ),
          ex.translateWrite('Ojalá tuviera más tiempo.', 'I wish I had more time.', ['en-wish'], {
            id: 'en.ex.roh1syof40f79s',
            acceptedAnswers: ['I wish I had more free time.'],
          }),
        ],
      },
    ],
  },
};

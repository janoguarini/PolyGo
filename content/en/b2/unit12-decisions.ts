import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U12 «Decisiones, conflictos y resolución de problemas» (docs/B2_EN.md): pesar una decisión
 * (dilemma, weigh up, pros and cons, trade-off, gut feeling), resolver conflictos (take sides, common
 * ground, mediator, back down, stand up for). Estructuras: condicionales mixtos (If I had taken the
 * job, I would be living in Berlin now) e inversión enfática formal (Not only… but also, Under no
 * circumstances, Only then, Should you need…). Cierra el B2 repasando condicionales y conectores.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const JOB_OFFER = dialogue(
  'en.stim.b2-u12-job-offer',
  'Una amiga le cuenta a otra que tiene que decidir si se muda por trabajo.',
  [
    ['Alice', "I've got a real dilemma. The Lisbon office has offered me a job as team manager."],
    ['Rosa', "That's amazing! So why do you look worried?"],
    [
      'Alice',
      "Because I'd have to move in a month. I've been weighing up the pros and cons all week.",
    ],
    ['Rosa', 'What does your gut feeling say?'],
    [
      'Alice',
      "To go. But I'm having second thoughts because of my parents. They're getting older.",
    ],
    [
      'Rosa',
      "Remember two years ago, when you turned down the job in Berlin? If you had taken it, you'd be speaking German by now.",
    ],
    ['Alice', 'I know. And if I were braver, I would have said yes immediately this time too.'],
    [
      'Rosa',
      'Every choice has a trade-off. But Lisbon is only a short flight away. You could visit them often.',
    ],
  ],
);

const GUIDE = reading(
  'en.stim.b2-u12-guide',
  'post',
  'Un artículo sobre cómo tomar decisiones importantes.',
  [
    'Big decisions are hard because there is always a trade-off: more money but less free time, adventure but less security.',
    'First, write down the pros and cons. Seeing them on paper helps you weigh them up more calmly.',
    'Second, ask yourself what is really at stake. Will this matter in five years? If not, do not spend weeks on it.',
    'Third, listen to your gut feeling. Research suggests that our first reaction often contains information we are not aware of.',
    'Finally, accept that no decision is perfect. If we had a crystal ball, we would never make mistakes. We do not, so we learn from them.',
  ],
  { title: 'How to make a big decision' },
);

const NEIGHBORS = reading(
  'en.stim.b2-u12-neighbors',
  'notice',
  'Un aviso de un servicio de mediación entre vecinos.',
  [
    'Community Mediation Service',
    'Has a conflict with a neighbor gone on for too long? Noise, parking, trees, pets… We can help you resolve it.',
    'Our mediators do not take sides. Their job is to help both people listen to each other and find common ground.',
    'Not only is the service free, but it is also confidential. Under no circumstances will we share your information with the other person without your permission.',
    'Should you need more information, please visit the community center from Monday to Friday.',
  ],
  { title: 'Problems with your neighbors?' },
);

const TEAM_CONFLICT = dialogue(
  'en.stim.b2-u12-team-conflict',
  'Una reunión tensa de un equipo antes de presentar un proyecto.',
  [
    [
      'Manager',
      'I know there has been a conflict between design and sales. Let’s sort it out today.',
    ],
    [
      'Leo',
      "The sales team wants to change the design again, two days before the launch. We can't keep doing that.",
    ],
    [
      'Ines',
      "We're only asking because a big client is at stake. If we lose them, everyone loses.",
    ],
    [
      'Leo',
      "I understand, but I have to stand up for my team. They've worked every weekend this month.",
    ],
    [
      'Manager',
      'OK. Neither side has to back down completely. Ines, send one list of changes, the essential ones only. Leo, your team decides what is possible.',
    ],
    ['Ines', 'That sounds fair.'],
    ['Manager', 'Good. Only then can we finish on time.'],
  ],
);

export const EN_B2_U12: B2UnitDef = {
  names: ['Alice', 'Rosa', 'Lisbon', 'Berlin', 'Leo', 'Ines', 'Manager'],
  support: [
    'offered',
    'service',
    'possible',
    'contact',
    'braver',
    'immediately',
    'german',
    'security',
    'reaction',
    'contains',
    'aware',
    'crystal',
    'ball',
    'mediation',
    'parking',
    'pets',
    'confidential',
    'permission',
    'design',
    'sales',
    'launch',
    'essential',
    'neighbor',
  ],
  unit: {
    position: 12,
    title: 'Decisiones y conflictos',
    titleEn: 'Decisions and conflicts',
    description:
      'Pesar una decisión, condicionales mixtos, resolver conflictos y defender una postura, e inversión enfática (Not only…, Under no circumstances…).',
    emoji: '🧭',
    objective:
      'Podés pesar una decisión difícil, imaginar cómo sería tu presente con otras elecciones, mediar en un conflicto y expresarte con énfasis formal.',
    grammar: {
      title: 'Condicionales mixtos e inversión enfática',
      explanation:
        'Los condicionales mixtos combinan tiempos: un pasado distinto con un resultado en el presente (If I had taken the job, I would be living in Berlin now) o un presente distinto con un resultado en el pasado (If I were braver, I would have said yes). En un registro formal, algunas expresiones al principio invierten auxiliar y sujeto para dar énfasis: Not only is it free, but…; Under no circumstances will we…; Only then can we…; Should you need help (= If you need help).',
      examples: [
        {
          target: "If you had taken the job, you'd be speaking German by now.",
          base: 'Si hubieras aceptado el trabajo, ya estarías hablando alemán.',
        },
        {
          target: 'If I were braver, I would have said yes.',
          base: 'Si fuera más valiente, habría dicho que sí.',
        },
        {
          target: 'Not only is the service free, but it is also confidential.',
          base: 'El servicio no sólo es gratuito, sino que también es confidencial.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-dilemma',
        'dilemma',
        'dilema',
        '/dɪˈlɛmə/',
        '🤔',
        "I've got a real dilemma.",
        'Tengo un verdadero dilema.',
        ['decisions'],
      ),
      w(
        'en-weigh-up',
        'weigh up',
        'sopesar / evaluar',
        '/ˈweɪ ˈʌp/',
        '⚖️',
        'I am weighing up the pros and cons.',
        'Estoy sopesando los pros y los contras.',
        ['decisions', 'phrasal-verbs'],
        ['sopesar', 'evaluar'],
      ),
      w(
        'en-pros-and-cons',
        'pros and cons',
        'pros y contras',
        '/ˈproʊz ən ˈkɑnz/',
        '📋',
        'Write down the pros and cons.',
        'Anotá los pros y los contras.',
        ['decisions', 'collocations'],
        ['ventajas y desventajas'],
      ),
      w(
        'en-trade-off',
        'trade-off',
        'concesión / costo a cambio',
        '/ˈtreɪd ˌɔf/',
        undefined,
        'More money, less free time: that is the trade-off.',
        'Más plata, menos tiempo libre: ése es el costo.',
        ['decisions'],
        ['costo a cambio', 'equilibrio'],
        ['trade off', 'tradeoff'],
      ),
      w(
        'en-gut-feeling',
        'gut feeling',
        'corazonada / intuición',
        '/ˈɡʌt ˌfilɪŋ/',
        '💭',
        'My gut feeling says I should go.',
        'Mi intuición me dice que tengo que ir.',
        ['decisions', 'collocations'],
        ['corazonada', 'intuición', 'presentimiento'],
      ),
      w(
        'en-have-second-thoughts',
        'have second thoughts',
        'dudar / replantearse algo',
        '/ˈhæv ˈsɛkənd ˈθɔts/',
        undefined,
        "I'm having second thoughts about the trip.",
        'Estoy dudando sobre el viaje.',
        ['decisions', 'collocations'],
        ['dudar', 'replantearse', 'pensarlo dos veces'],
      ),
      w(
        'en-at-stake',
        'at stake',
        'en juego',
        '/æt ˈsteɪk/',
        '🎲',
        'A big client is at stake.',
        'Hay un cliente importante en juego.',
        ['decisions', 'collocations'],
      ),
      w(
        'en-conflict',
        'conflict',
        'conflicto',
        '/ˈkɑnflɪkt/',
        '⚡',
        'There has been a conflict between the two teams.',
        'Hubo un conflicto entre los dos equipos.',
        ['conflict'],
      ),
      w(
        'en-resolve',
        'resolve',
        'resolver / solucionar (un conflicto)',
        '/rɪˈzɑlv/',
        '✅',
        'We can help you resolve the conflict.',
        'Podemos ayudarte a resolver el conflicto.',
        ['conflict', 'verbs'],
        ['resolver un conflicto', 'zanjar'],
      ),
      w(
        'en-mediator',
        'mediator',
        'mediador / mediadora',
        '/ˈmidiˌeɪtər/',
        '🕊️',
        'A mediator helps both sides listen to each other.',
        'Un mediador ayuda a las dos partes a escucharse.',
        ['conflict'],
        ['mediador', 'mediadora'],
      ),
      w(
        'en-take-sides',
        'take sides',
        'tomar partido',
        '/ˈteɪk ˈsaɪdz/',
        undefined,
        "I don't want to take sides in their argument.",
        'No quiero tomar partido en su pelea.',
        ['conflict', 'collocations'],
      ),
      w(
        'en-common-ground',
        'common ground',
        'puntos en común',
        '/ˈkɑmən ˈɡraʊnd/',
        '🤝',
        'Try to find some common ground.',
        'Tratá de encontrar puntos en común.',
        ['conflict', 'collocations'],
        ['terreno común'],
      ),
      w(
        'en-stand-up-for',
        'stand up for',
        'defender (a alguien o algo)',
        '/ˈstænd ˈʌp fɔr/',
        '🛡️',
        'I have to stand up for my team.',
        'Tengo que defender a mi equipo.',
        ['conflict', 'phrasal-verbs'],
        ['defender', 'dar la cara por'],
      ),
      w(
        'en-back-down',
        'back down',
        'ceder / echarse atrás',
        '/ˈbæk ˈdaʊn/',
        undefined,
        'Neither side wanted to back down.',
        'Ninguna de las dos partes quería ceder.',
        ['conflict', 'phrasal-verbs'],
        ['echarse atrás', 'dar el brazo a torcer'],
      ),
      w(
        'en-not-only',
        'not only',
        'no sólo',
        '/nɑt ˈoʊnli/',
        undefined,
        'Not only is the service free, but it is also confidential.',
        'El servicio no sólo es gratuito, sino que también es confidencial.',
        ['inversion', 'connectors'],
        ['no solamente'],
      ),
      w(
        'en-under-no-circumstances',
        'under no circumstances',
        'bajo ninguna circunstancia',
        '/ˈʌndər ˈnoʊ ˈsɜrkəmˌstænsɪz/',
        '🚫',
        'Under no circumstances should you open this door.',
        'Bajo ninguna circunstancia deberías abrir esta puerta.',
        ['inversion'],
        ['de ninguna manera'],
      ),
      w(
        'en-only-then',
        'only then',
        'sólo entonces',
        '/ˈoʊnli ˈðɛn/',
        undefined,
        'Only then can we finish on time.',
        'Sólo entonces podremos terminar a tiempo.',
        ['inversion'],
        ['recién entonces'],
      ),
      w(
        'en-should-you',
        'should you',
        'si llegaras a / en caso de que (formal)',
        '/ˈʃʊd ju/',
        undefined,
        'Should you need help, please call reception.',
        'Si necesita ayuda, llame a recepción.',
        ['inversion', 'conditionals'],
        ['si llegaras a', 'en caso de que'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Un dilema',
        objective: 'Contar un dilema y pesar los pros y los contras.',
        intro: {
          explanation:
            'A dilemma es un dilema: dos opciones difíciles. Weigh up es sopesar, evaluar: I’m weighing up the pros and cons (los pros y los contras). A trade-off es lo que perdés a cambio de lo que ganás: More money, less free time.',
          examples: [
            {
              target: 'I am weighing up the pros and cons.',
              base: 'Estoy sopesando los pros y los contras.',
            },
            {
              target: 'More money, less free time: that is the trade-off.',
              base: 'Más plata, menos tiempo libre: ése es el costo.',
            },
          ],
        },
        takeaways: [
          'Contás un dilema y sopesás los pros y los contras.',
          'Explicás lo que se pierde a cambio con trade-off.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['dilemma', 'dilema'],
              ['weigh up', 'sopesar / evaluar'],
              ['pros and cons', 'pros y contras'],
              ['trade-off', 'concesión / costo a cambio'],
            ],
            ['en-dilemma', 'en-weigh-up', 'en-pros-and-cons', 'en-trade-off'],
            { id: 'en.ex.4dcp7up9dvk5xm' },
          ),
          ex.fillBlank(
            'I am weighing ___ the pros and cons.',
            'Estoy sopesando los pros y los contras.',
            'up',
            ['out', 'down', 'off'],
            ['en-weigh-up'],
            { id: 'en.ex.u6go9nvz02kgjs', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'More money, less free time: that is the ___.',
            'Más plata, menos tiempo libre: ése es el costo.',
            'trade-off',
            ['dilemma', 'problem', 'decision'],
            ['en-trade-off'],
            { id: 'en.ex.bymmojo04vwnuq', skill: 'vocabulary' },
          ),
          question(
            'en.ex.8rp2rtx24r88uk',
            JOB_OFFER,
            '¿Cuál es el dilema de Alice?',
            'Si aceptar un puesto en Lisboa y mudarse en un mes',
            [
              'Si cambiar de carrera',
              'Si mudarse a Berlín',
              'Si dejar su trabajo para cuidar a sus padres',
            ],
            [
              'en-dilemma',
              'en-weigh-up',
              'en-pros-and-cons',
              'en-gut-feeling',
              'en-have-second-thoughts',
            ],
            'Alice dice: «I’ve got a real dilemma. The Lisbon office has offered me a job as team manager… I’d have to move in a month».',
          ),
          question(
            'en.ex.qwoi09yaw0yoer',
            GUIDE,
            'Según el artículo, ¿por qué son difíciles las grandes decisiones?',
            'Porque siempre se gana algo a cambio de perder otra cosa',
            [
              'Porque nunca hay información',
              'Porque la gente es insegura',
              'Porque llevan mucho tiempo',
            ],
            ['en-trade-off', 'en-at-stake', 'en-gut-feeling'],
            'El artículo dice: «there is always a trade-off: more money but less free time, adventure but less security».',
          ),
          question(
            'en.ex.0lv1fn0xoz7fzk',
            GUIDE,
            '¿Para qué sirve anotar los pros y los contras, según el artículo?',
            'Para sopesarlos con más calma',
            [
              'Para mostrárselos a otros',
              'Para no tener que decidir',
              'Para recordarlos años después',
            ],
            ['en-pros-and-cons', 'en-weigh-up'],
            'El artículo dice: «Seeing them on paper helps you weigh them up more calmly».',
          ),
          ex.listenChoice(
            "I've got a real dilemma.",
            [
              "I've got a real problem.",
              "I haven't got a real dilemma.",
              "We've got a real dilemma.",
            ],
            ['en-dilemma'],
            { id: 'en.ex.s56b26hac6tm6c' },
          ),
          ex.orderWords(
            'Write down the pros and cons.',
            'Anotá los pros y los contras.',
            ['en-pros-and-cons'],
            { id: 'en.ex.zcziuk11kpovo2' },
          ),
          ex.shortAnswer(
            'Have you decided about the new job? (no, todavía estás sopesando los pros y los contras)',
            '¿Decidiste lo del trabajo nuevo?',
            "No, I'm still weighing up the pros and cons.",
            [
              'No, I am still weighing up the pros and cons.',
              "I'm still weighing up the pros and cons.",
              "Not yet. I'm still weighing up the pros and cons.",
            ],
            ['en-weigh-up', 'en-pros-and-cons'],
            { id: 'en.ex.sco6t8as91xc3m' },
          ),
          ex.translateWrite(
            'Tengo un verdadero dilema.',
            "I've got a real dilemma.",
            ['en-dilemma'],
            {
              id: 'en.ex.chxay8jdhekw1v',
              acceptedAnswers: [
                'I have got a real dilemma.',
                'I have a real dilemma.',
                "I've got a big dilemma.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Si hubiera… ahora estaría…',
        objective: 'Imaginar tu presente con otras decisiones: condicionales mixtos.',
        intro: {
          explanation:
            'Condicional mixto 1: un pasado distinto cambia el presente. If + past perfect, would + verbo: If you had taken the job, you would be in Berlin now. Condicional mixto 2: un presente distinto habría cambiado el pasado. If + past simple, would have + participio: If I were braver, I would have said yes. Gut feeling es la intuición; have second thoughts, dudar.',
          examples: [
            {
              target: "If you had taken the job, you'd be speaking German by now.",
              base: 'Si hubieras aceptado el trabajo, ya estarías hablando alemán.',
            },
            {
              target: 'If I were braver, I would have said yes.',
              base: 'Si fuera más valiente, habría dicho que sí.',
            },
          ],
        },
        takeaways: [
          'Imaginás tu presente con un pasado distinto: If I had…, I would be…',
          'Hablás de tu intuición y de tus dudas.',
        ],
        exercises: [
          ex.fillBlank(
            'If I had taken the job, I would ___ in Berlin now.',
            'Si hubiera aceptado el trabajo, ahora estaría en Berlín.',
            'be',
            ['have been', 'been', 'being'],
            ['en-would-have'],
            {
              id: 'en.ex.g3q3d69q79pcwp',
              explanation:
                'Mixto: pasado distinto (had taken) → resultado presente (would be… now).',
            },
          ),
          ex.fillBlank(
            'If I ___ braver, I would have said yes.',
            'Si fuera más valiente, habría dicho que sí.',
            'were',
            ['am', 'would be', 'will be'],
            ['en-would-have'],
            {
              id: 'en.ex.b5m1fi4emo5k5d',
              explanation:
                'Mixto: presente distinto (if I were) → resultado pasado (would have said).',
            },
          ),
          ex.fillBlank(
            "I'm having second ___ about the trip.",
            'Estoy dudando sobre el viaje.',
            'thoughts',
            ['ideas', 'minds', 'feelings'],
            ['en-have-second-thoughts'],
            { id: 'en.ex.1e04ublzlag1dp', skill: 'vocabulary' },
          ),
          question(
            'en.ex.ky1i11p9x5a0j7',
            JOB_OFFER,
            '¿Qué le recuerda Rosa a Alice?',
            'Que si hubiera aceptado el trabajo en Berlín, ahora hablaría alemán',
            [
              'Que en Berlín le fue mal',
              'Que nunca le ofrecieron nada en Berlín',
              'Que sus padres viven en Lisboa',
            ],
            ['en-would-have'],
            'Rosa dice: «If you had taken it, you’d be speaking German by now» (pasado distinto → presente distinto).',
          ),
          question(
            'en.ex.pi1yxqyef5o30b',
            JOB_OFFER,
            '¿Qué le dice su intuición a Alice y por qué duda?',
            'Que vaya, pero duda por sus padres, que están más grandes',
            [
              'Que se quede, porque no le gusta Lisboa',
              'Que vaya, porque el sueldo es alto',
              'No tiene ninguna intuición',
            ],
            ['en-gut-feeling', 'en-have-second-thoughts'],
            'Alice dice: «To go. But I’m having second thoughts because of my parents. They’re getting older».',
          ),
          question(
            'en.ex.sl2kecu1nmshn8',
            GUIDE,
            '¿Qué dice el artículo sobre la intuición?',
            'Que la primera reacción suele tener información de la que no somos conscientes',
            [
              'Que no hay que hacerle caso',
              'Que siempre acierta',
              'Que es sólo para decisiones chicas',
            ],
            ['en-gut-feeling'],
            'El artículo dice: «our first reaction often contains information we are not aware of».',
          ),
          ex.listenChoice(
            'If I were braver, I would have said yes.',
            [
              'If I were braver, I would say yes.',
              'If I had been braver, I would have said yes.',
              'If I were braver, I would have said no.',
            ],
            ['en-would-have'],
            { id: 'en.ex.74doakip2zdc2k' },
          ),
          ex.orderWords(
            'My gut feeling says I should go.',
            'Mi intuición me dice que tengo que ir.',
            ['en-gut-feeling'],
            { id: 'en.ex.k6cstwexylxvy1' },
          ),
          ex.shortAnswer(
            'Why are you so tired today? (si no te hubieras acostado tan tarde, no estarías cansado)',
            '¿Por qué estás tan cansado hoy?',
            "If I hadn't gone to bed so late, I wouldn't be tired.",
            [
              'If I had not gone to bed so late, I would not be tired.',
              "If I hadn't gone to bed so late, I wouldn't be so tired.",
              "If I'd gone to bed earlier, I wouldn't be tired.",
            ],
            ['en-would-have'],
            { id: 'en.ex.y9bn5icuy3zunz' },
          ),
          ex.translateWrite(
            'Si hubiera aceptado el trabajo, ahora estaría en Berlín.',
            'If I had taken the job, I would be in Berlin now.',
            ['en-would-have'],
            {
              id: 'en.ex.gce9wngvsung7c',
              acceptedAnswers: [
                "If I had taken the job, I'd be in Berlin now.",
                "If I'd taken the job, I would be in Berlin now.",
                'If I had accepted the job, I would be in Berlin now.',
                'If I had taken the job, I would now be in Berlin.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Resolver un conflicto',
        objective: 'Hablar de un conflicto, de no tomar partido y de buscar puntos en común.',
        intro: {
          explanation:
            'A conflict es un conflicto; resolve, resolverlo. A mediator ayuda a las dos partes sin take sides (tomar partido). La idea es find common ground: encontrar puntos en común.',
          examples: [
            {
              target: 'We can help you resolve the conflict.',
              base: 'Podemos ayudarte a resolver el conflicto.',
            },
            {
              target: 'Try to find some common ground.',
              base: 'Tratá de encontrar puntos en común.',
            },
          ],
        },
        takeaways: [
          'Hablás de un conflicto y de cómo resolverlo.',
          'Proponés no tomar partido y buscar puntos en común.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['conflict', 'conflicto'],
              ['resolve', 'resolver / solucionar (un conflicto)'],
              ['mediator', 'mediador / mediadora'],
              ['take sides', 'tomar partido'],
            ],
            ['en-conflict', 'en-resolve', 'en-mediator', 'en-take-sides'],
            { id: 'en.ex.xvaztorp450ho6' },
          ),
          ex.fillBlank(
            'Try to find some common ___.',
            'Tratá de encontrar puntos en común.',
            'ground',
            ['point', 'place', 'side'],
            ['en-common-ground'],
            { id: 'en.ex.osi2hkz38j41y1', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "I don't want to take ___ in their argument.",
            'No quiero tomar partido en su pelea.',
            'sides',
            ['part', 'place', 'care'],
            ['en-take-sides'],
            { id: 'en.ex.0f35q9vdpdi83e', skill: 'vocabulary' },
          ),
          question(
            'en.ex.bowsrl3matqcpo',
            NEIGHBORS,
            '¿Qué hacen los mediadores, según el aviso?',
            'Ayudan a las dos personas a escucharse y encontrar puntos en común',
            ['Deciden quién tiene razón', 'Llaman a la policía', 'Cobran una multa'],
            [
              'en-mediator',
              'en-take-sides',
              'en-common-ground',
              'en-conflict',
              'en-resolve',
              'en-not-only',
              'en-under-no-circumstances',
              'en-should-you',
            ],
            'El aviso dice: «Our mediators do not take sides. Their job is to help both people listen to each other and find common ground».',
          ),
          question(
            'en.ex.l6wdjggo2brcdw',
            TEAM_CONFLICT,
            '¿Cuál es el conflicto entre diseño y ventas?',
            'Ventas quiere cambiar el diseño dos días antes del lanzamiento',
            [
              'Diseño no quiere trabajar los fines de semana',
              'Ventas perdió un cliente',
              'Nadie quiere hacer el proyecto',
            ],
            ['en-conflict', 'en-at-stake', 'en-stand-up-for', 'en-back-down', 'en-only-then'],
            'Leo dice: «The sales team wants to change the design again, two days before the launch».',
          ),
          ex.listenChoice(
            'We can help you resolve the conflict.',
            [
              'We can help you avoid the conflict.',
              'We can help them resolve the conflict.',
              'We could help you resolve the conflict.',
            ],
            ['en-resolve', 'en-conflict'],
            { id: 'en.ex.8bxodg2d5drtl2' },
          ),
          ex.orderWords(
            'A mediator helps both sides listen to each other.',
            'Un mediador ayuda a las dos partes a escucharse.',
            ['en-mediator'],
            { id: 'en.ex.unjy9aakck0las' },
          ),
          ex.shortAnswer(
            'Who is right, your sister or your brother? (no querés tomar partido)',
            '¿Quién tiene razón, tu hermana o tu hermano?',
            "I don't want to take sides.",
            [
              'I do not want to take sides.',
              "I don't want to take sides!",
              "Sorry, I don't want to take sides.",
            ],
            ['en-take-sides'],
            { id: 'en.ex.qcqdt6ym9d60yl' },
          ),
          ex.translateWrite(
            'Tratá de encontrar puntos en común.',
            'Try to find some common ground.',
            ['en-common-ground'],
            {
              id: 'en.ex.uxg5qmqqocu3pc',
              acceptedAnswers: ['Try to find common ground.', 'Try and find some common ground.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Defender lo tuyo',
        objective: 'Defender a tu equipo o tu postura y decidir cuándo ceder.',
        intro: {
          explanation:
            'Stand up for es defender a alguien o algo: I have to stand up for my team. Back down es ceder, echarse atrás. Something is at stake: está en juego. Neither side (ninguna de las dos partes) va con el verbo en afirmativo: Neither side wanted to back down.',
          examples: [
            { target: 'I have to stand up for my team.', base: 'Tengo que defender a mi equipo.' },
            {
              target: 'Neither side wanted to back down.',
              base: 'Ninguna de las dos partes quería ceder.',
            },
          ],
        },
        takeaways: [
          'Defendés a alguien con stand up for.',
          'Hablás de lo que está en juego y de ceder con back down.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['stand up for', 'defender (a alguien o algo)'],
              ['back down', 'ceder / echarse atrás'],
              ['at stake', 'en juego'],
              ['common ground', 'puntos en común'],
            ],
            ['en-stand-up-for', 'en-back-down', 'en-at-stake', 'en-common-ground'],
            { id: 'en.ex.guibkb7sv1nou4' },
          ),
          ex.fillBlank(
            'I have to stand up ___ my team.',
            'Tengo que defender a mi equipo.',
            'for',
            ['to', 'with', 'on'],
            ['en-stand-up-for'],
            { id: 'en.ex.axfikkzfv5ns52', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Neither side wanted to back ___.',
            'Ninguna de las dos partes quería ceder.',
            'down',
            ['up', 'out', 'off'],
            ['en-back-down'],
            { id: 'en.ex.uwo5okwm6u31gv', skill: 'vocabulary' },
          ),
          question(
            'en.ex.gcyaa6iht1t5ir',
            TEAM_CONFLICT,
            '¿Por qué Ines insiste con los cambios?',
            'Porque hay un cliente importante en juego',
            [
              'Porque no le gusta el diseño',
              'Porque el jefe se lo pidió',
              'Porque Leo trabaja poco',
            ],
            ['en-at-stake'],
            'Ines dice: «We’re only asking because a big client is at stake. If we lose them, everyone loses».',
          ),
          question(
            'en.ex.92xovq1xoen09n',
            TEAM_CONFLICT,
            '¿Qué solución propone la gerente?',
            'Ninguna parte cede del todo: una sola lista de cambios esenciales y el equipo de Leo decide qué es posible',
            ['Cancelar el lanzamiento', 'Hacer todos los cambios de ventas', 'Que Leo decida solo'],
            ['en-back-down'],
            'La gerente dice: «Neither side has to back down completely. Ines, send one list of changes, the essential ones only. Leo, your team decides what is possible».',
          ),
          question(
            'en.ex.fpilugdf7t5x95',
            TEAM_CONFLICT,
            '¿Por qué Leo defiende a su equipo?',
            'Porque trabajaron todos los fines de semana del mes',
            [
              'Porque el diseño es perfecto',
              'Porque no conocen al cliente',
              'Porque Ines le cae mal',
            ],
            ['en-stand-up-for'],
            'Leo dice: «I have to stand up for my team. They’ve worked every weekend this month».',
          ),
          ex.listenChoice(
            'A big client is at stake.',
            [
              'A big client is on the way.',
              'A big project is at stake.',
              'A big client was at stake.',
            ],
            ['en-at-stake'],
            { id: 'en.ex.yy9bd5l9xt4ztl' },
          ),
          ex.shortAnswer(
            'Will you change your mind? (no, no vas a echarte atrás)',
            '¿Vas a cambiar de opinión?',
            "No, I won't back down.",
            ['No, I will not back down.', "I won't back down.", "No. I'm not going to back down."],
            ['en-back-down'],
            { id: 'en.ex.i0xgqf3nz8b36c' },
          ),
          ex.translateWrite(
            'Tengo que defender a mi equipo.',
            'I have to stand up for my team.',
            ['en-stand-up-for'],
            {
              id: 'en.ex.ryalu9lhqmc0sg',
              acceptedAnswers: ['I need to stand up for my team.', 'I must stand up for my team.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Énfasis formal',
        objective: 'Usar la inversión enfática en textos formales.',
        intro: {
          explanation:
            'En avisos, correos formales y discursos: Not only + auxiliar + sujeto…, but (also)… (Not only is it free, but it is also confidential). Under no circumstances + auxiliar + sujeto (bajo ninguna circunstancia). Only then + auxiliar + sujeto (sólo entonces). Should you + verbo = If you + verbo, más formal: Should you need help, call reception.',
          examples: [
            {
              target: 'Not only is the service free, but it is also confidential.',
              base: 'El servicio no sólo es gratuito, sino que también es confidencial.',
            },
            {
              target: 'Should you need help, please call reception.',
              base: 'Si necesita ayuda, llame a recepción.',
            },
          ],
        },
        takeaways: [
          'Enfatizás con Not only…, Under no circumstances… y Only then…',
          'Escribís condiciones formales con Should you…',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['not only', 'no sólo'],
              ['under no circumstances', 'bajo ninguna circunstancia'],
              ['only then', 'sólo entonces'],
              ['should you', 'si llegaras a / en caso de que (formal)'],
            ],
            ['en-not-only', 'en-under-no-circumstances', 'en-only-then', 'en-should-you'],
            { id: 'en.ex.msmqfw4ze58g26' },
          ),
          ex.fillBlank(
            'Not only ___ the service free, but it is also confidential.',
            'El servicio no sólo es gratuito, sino que también es confidencial.',
            'is',
            ['it is', 'does', 'be'],
            ['en-not-only'],
            {
              id: 'en.ex.jx10lxmtm7t805',
              explanation: 'Not only + auxiliar + sujeto: Not only is the service…',
            },
          ),
          ex.fillBlank(
            'Under no circumstances ___ you open this door.',
            'Bajo ninguna circunstancia deberías abrir esta puerta.',
            'should',
            ['you should', 'do', 'are'],
            ['en-under-no-circumstances'],
            {
              id: 'en.ex.eulo3umlrrgl31',
              explanation: 'Under no circumstances + auxiliar + sujeto.',
            },
          ),
          ex.fillBlank(
            '___ you need help, please call reception.',
            'Si necesita ayuda, llame a recepción.',
            'Should',
            ['Would', 'Do', 'Unless'],
            ['en-should-you'],
            {
              id: 'en.ex.1h3vciynqjhjvy',
              explanation: 'Should you need… = If you need… (formal).',
            },
          ),
          question(
            'en.ex.tub4afcdix6peq',
            NEIGHBORS,
            '¿Qué dos ventajas destaca el aviso sobre el servicio?',
            'Que es gratuito y confidencial',
            [
              'Que es rápido y barato',
              'Que es obligatorio y gratuito',
              'Que funciona los fines de semana',
            ],
            ['en-not-only'],
            'El aviso dice: «Not only is the service free, but it is also confidential».',
          ),
          question(
            'en.ex.citgtl4buh7afc',
            NEIGHBORS,
            '¿Qué promete el servicio sobre tu información?',
            'Que nunca la va a compartir con la otra persona sin tu permiso',
            [
              'Que la publica en el centro comunitario',
              'Que la comparte con la policía',
              'Que la borra después de una semana',
            ],
            ['en-under-no-circumstances'],
            'El aviso dice: «Under no circumstances will we share your information with the other person without your permission».',
          ),
          question(
            'en.ex.94pm46gkyibda6',
            TEAM_CONFLICT,
            '¿Qué quiere decir la gerente con «Only then can we finish on time»?',
            'Que sólo con ese acuerdo van a poder terminar a tiempo',
            [
              'Que van a terminar tarde igual',
              'Que el cliente decide la fecha',
              'Que hay que empezar de nuevo',
            ],
            ['en-only-then'],
            'Only then + auxiliar + sujeto: sólo si hacen lo que propuso podrán terminar a tiempo.',
          ),
          ex.listenChoice(
            'Only then can we finish on time.',
            [
              'Only then can we start on time.',
              'Only then we can finish on time.',
              'Even then we can finish on time.',
            ],
            ['en-only-then'],
            { id: 'en.ex.nvpisb94on9uiy' },
          ),
          ex.shortAnswer(
            'If you have any questions, contact us. (reescribilo empezando con Should you…)',
            'Si tiene alguna pregunta, contáctenos.',
            'Should you have any questions, contact us.',
            [
              'Should you have any questions, please contact us.',
              'Should you have questions, contact us.',
            ],
            ['en-should-you'],
            { id: 'en.ex.7diboax90d13g9' },
          ),
          ex.translateWrite(
            'Bajo ninguna circunstancia deberías abrir esta puerta.',
            'Under no circumstances should you open this door.',
            ['en-under-no-circumstances'],
            {
              id: 'en.ex.ks8izyxfi3q423',
              acceptedAnswers: [
                'Under no circumstances should you open that door.',
                'Under no circumstances must you open this door.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

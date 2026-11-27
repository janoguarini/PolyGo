import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U17 «Transporte y planes» (docs/FR_A1_A2.md): decir cómo te movés (en bus, en train,
 * pero à pied y à vélo), conjugar prendre en presente y contar planes con el futuro próximo
 * (aller + infinitivo: je vais partir, on va visiter) y los marcadores ce soir, ce week-end,
 * la semaine prochaine, maintenant. Les vacances siempre en plural; le billet es el pasaje.
 * Pronunciación: la s de bus sí suena, liaison en‿avion, il prend / ils prennent.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const WEEK_END = dialogue(
  'fr.stim.a1-u17-week-end',
  'Dos amigos hablan de sus planes para el fin de semana.',
  [
    ['Julie', "Salut, Antoine! Qu'est-ce que tu vas faire ce week-end?"],
    ['Antoine', 'Je vais visiter Lyon avec ma sœur. On va prendre le train samedi.'],
    ['Julie', 'Et ce soir?'],
    ['Antoine', 'Ce soir, je vais rester à la maison. Et toi?'],
    ['Julie', 'Moi, je vais au cinéma à vélo.'],
  ],
  FR_A1_RATE,
);

const VACANCES = reading(
  'fr.stim.a1-u17-vacances',
  'message',
  'Un mensaje de Camille a su amigo Nicolas.',
  [
    'Salut, Nicolas!',
    'Samedi, je pars en vacances à Nice avec mes parents.',
    "On va prendre l'avion: en voiture, c'est loin.",
    'Nous allons rester deux semaines.',
    'Et toi, tu vas partir en juillet?',
    'À bientôt! Camille',
  ],
  { from: 'Camille', to: 'Nicolas' },
);

export const FR_A1_U17: FrUnitDef = {
  names: [
    'Julie',
    'Antoine',
    'Camille',
    'Nicolas',
    'Léa',
    'Paul',
    'Hugo',
    'Lyon',
    'Paris',
    'Marseille',
    'Nice',
  ],
  support: ['prend', 'prenons', 'prennent', 'faire', 'bon', 'pars'],
  unit: {
    position: 17,
    title: 'Transporte y planes',
    titleEn: 'Transports et projets',
    description:
      'Medios de transporte (en bus, en train, pero à pied y à vélo), prendre en presente y el futuro próximo con aller + infinitivo. Ce soir, ce week-end, la semaine prochaine. Liaison en‿avion; il prend / ils prennent.',
    emoji: '🚆',
    objective:
      'Puedes decir cómo vas a un lugar, comprar un pasaje y contar qué vas a hacer esta noche, el fin de semana o en las vacaciones.',
    grammar: {
      title: 'Prendre · aller + infinitivo',
      explanation:
        'Prendre es irregular: je prends, tu prends, il prend (suenan igual: la s y la d finales no se pronuncian), nous prenons, vous prenez, ils prennent (aquí suena la doble n). Con los transportes con motor se usa en (en bus, en train, en voiture, en avion, en métro), pero à pied y à vélo. Para los planes cercanos, el futuro próximo: aller en presente + infinitivo (je vais partir, tu vas rester, on va visiter). En la negación, ne… pas rodea a aller: je ne vais pas partir.',
      examples: [
        { target: 'Nous prenons le métro.', base: 'Tomamos el metro.' },
        {
          target: 'Ce week-end, on va visiter Paris.',
          base: 'Este fin de semana vamos a visitar París.',
        },
        { target: 'Je ne vais pas partir ce soir.', base: 'No me voy a ir esta noche.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U17). Sin revisión nativa: se aceptó «en vélo» además de «à vélo» (muy usado en lo oral); revisar «partir à Lyon» frente a «partir pour Lyon» y el registro de on va.',
    },
    words: [
      w(
        'fr-le-bus',
        'le bus',
        'el autobús',
        'Je prends le bus à huit heures.',
        'Tomo el autobús a las ocho.',
        ['transport', 'm'],
        { acceptedTranslations: ['el bus', 'el colectivo'], emoji: '🚌' },
      ),
      w(
        'fr-le-train',
        'le train',
        'el tren',
        'Le train pour Lyon est à midi.',
        'El tren a Lyon es al mediodía.',
        ['transport', 'm'],
        { emoji: '🚆' },
      ),
      w(
        'fr-la-voiture',
        'la voiture',
        'el auto',
        'Mon père va au travail en voiture.',
        'Mi papá va al trabajo en auto.',
        ['transport', 'f'],
        { acceptedTranslations: ['el coche'], emoji: '🚗' },
      ),
      w(
        'fr-l-avion',
        "l'avion",
        'el avión',
        'Je vais à Paris en avion.',
        'Voy a París en avión.',
        ['transport', 'm'],
        { emoji: '✈️' },
      ),
      w(
        'fr-le-metro',
        'le métro',
        'el metro',
        'Il prend le métro tous les jours.',
        'Toma el metro todos los días.',
        ['transport', 'm'],
        { acceptedTranslations: ['el subte'], emoji: '🚇' },
      ),
      w(
        'fr-le-velo',
        'le vélo',
        'la bici',
        "Ma sœur va à l'école à vélo.",
        'Mi hermana va a la escuela en bici.',
        ['transport', 'm'],
        { acceptedTranslations: ['la bicicleta'], emoji: '🚲' },
      ),
      w(
        'fr-a-pied',
        'à pied',
        'a pie',
        "C'est près: je vais à pied.",
        'Es cerca: voy a pie.',
        ['transport'],
        { acceptedTranslations: ['caminando'], emoji: '🚶' },
      ),
      w(
        'fr-prendre',
        'prendre',
        'tomar',
        'Nous allons prendre le train.',
        'Vamos a tomar el tren.',
        ['verbs', 'transport'],
        { acceptedTranslations: ['agarrar'] },
      ),
      w(
        'fr-le-billet',
        'le billet',
        'el pasaje',
        "Un billet pour Marseille, s'il vous plaît.",
        'Un pasaje a Marsella, por favor.',
        ['transport', 'm'],
        { acceptedTranslations: ['el boleto', 'el billete'], emoji: '🎫' },
      ),
      w(
        'fr-partir',
        'partir',
        'irse',
        'Je vais partir demain matin.',
        'Me voy a ir mañana por la mañana.',
        ['verbs', 'movement'],
        { acceptedTranslations: ['salir'] },
      ),
      w(
        'fr-rester',
        'rester',
        'quedarse',
        'Ce soir, je vais rester à la maison.',
        'Esta noche me voy a quedar en casa.',
        ['verbs'],
      ),
      w(
        'fr-visiter',
        'visiter',
        'visitar',
        'On va visiter le musée.',
        'Vamos a visitar el museo.',
        ['verbs', 'travel'],
      ),
      w(
        'fr-ce-soir',
        'ce soir',
        'esta noche',
        'Ce soir, on va au cinéma.',
        'Esta noche vamos al cine.',
        ['time'],
      ),
      w(
        'fr-ce-week-end',
        'ce week-end',
        'este fin de semana',
        'Ce week-end, je vais visiter Lyon.',
        'Este fin de semana voy a visitar Lyon.',
        ['time'],
      ),
      w(
        'fr-la-semaine-prochaine',
        'la semaine prochaine',
        'la semana que viene',
        'La semaine prochaine, nous allons partir.',
        'La semana que viene nos vamos a ir.',
        ['time'],
        { acceptedTranslations: ['la próxima semana'] },
      ),
      w(
        'fr-le-voyage',
        'le voyage',
        'el viaje',
        'Bon voyage, Julie!',
        '¡Buen viaje, Julie!',
        ['travel', 'm'],
        { emoji: '🧳' },
      ),
      w(
        'fr-les-vacances',
        'les vacances',
        'las vacaciones',
        'En août, je pars en vacances.',
        'En agosto me voy de vacaciones.',
        ['travel'],
        { emoji: '🏖️' },
      ),
      w(
        'fr-on-va',
        'on va',
        'vamos',
        'On va à la plage?',
        '¿Vamos a la playa?',
        ['verbs', 'plans'],
        { acceptedTranslations: ['vamos a'] },
      ),
      w(
        'fr-maintenant',
        'maintenant',
        'ahora',
        'Je prends le bus maintenant.',
        'Tomo el autobús ahora.',
        ['time'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'En bus, en train, à pied',
        objective: 'Nombrar los medios de transporte y decir cómo vas a un lugar.',
        intro: {
          explanation:
            'Para decir cómo viajas, con los transportes con motor se usa en: en bus, en train, en voiture, en avion, en métro. Pero se dice à pied y à vélo. Ojo con la pronunciación: en bus la s final sí suena (es una excepción), y en en avion hay liaison: la n de en se une con la a de avion.',
          examples: [
            { target: 'Je vais à la gare en bus.', base: 'Voy a la estación en autobús.' },
            { target: 'Je vais au travail à pied.', base: 'Voy al trabajo a pie.' },
          ],
        },
        takeaways: [
          'Dices en bus, en train, en voiture, en avion y en métro.',
          'Pero dices à pied y à vélo.',
        ],
        exercises: [
          ex.translationChoice(
            'le train',
            'el tren',
            ['el auto', 'el avión', 'el metro'],
            ['fr-le-train'],
            { id: 'fr.ex.txos547owj05ib' },
          ),
          ex.imageChoice('🚗', 'la voiture', ['le vélo', 'le bus', "l'avion"], ['fr-la-voiture'], {
            id: 'fr.ex.v8grt1udme1x7z',
          }),
          ex.matchPairs(
            [
              ['le bus', 'el autobús'],
              ['le métro', 'el metro'],
              ['le vélo', 'la bici'],
              ["l'avion", 'el avión'],
            ],
            ['fr-le-bus', 'fr-le-metro', 'fr-le-velo', 'fr-l-avion'],
            { id: 'fr.ex.wa28keulygi9c1' },
          ),
          ex.listenChoice(
            'Je prends le métro.',
            ['Je prends le train.', 'Je prends le bus.'],
            ['fr-le-metro'],
            { id: 'fr.ex.rkq0lsub8d5n0o' },
          ),
          ex.fillBlank(
            'Je vais au travail ___ bus.',
            'Voy al trabajo en autobús.',
            'en',
            ['à', 'au', 'dans'],
            ['fr-le-bus'],
            {
              id: 'fr.ex.9unlc637xoddro',
              explanation: 'Con los transportes con motor se usa en: en bus, en train, en voiture.',
            },
          ),
          ex.fillBlank(
            "Léa va à l'école ___ pied.",
            'Léa va a la escuela a pie.',
            'à',
            ['en', 'au', 'dans'],
            ['fr-a-pied'],
            {
              id: 'fr.ex.66vojtqwtaxv05',
              explanation: 'A pie se dice à pied, nunca «en pied». La d final no suena.',
            },
          ),
          ex.listenChoice(
            'Je vais à Lyon en avion.',
            ['Je vais à Lyon en train.', 'Je vais à Lyon à vélo.'],
            ['fr-l-avion'],
            {
              id: 'fr.ex.31psku6vpz3nw1',
              explanation: 'En en avion hay liaison: la n de en se une con avion.',
            },
          ),
          ex.orderWords(
            'Nous allons à la plage en voiture.',
            'Vamos a la playa en auto.',
            ['fr-la-voiture'],
            { id: 'fr.ex.qc0jp20c90ns69' },
          ),
          ex.translateWrite(
            'Voy a la estación en autobús.',
            'Je vais à la gare en bus.',
            ['fr-le-bus'],
            { id: 'fr.ex.gigvbk0d5tz3yl' },
          ),
          ex.translateWrite(
            'Mi hermano va al trabajo en bici.',
            'Mon frère va au travail à vélo.',
            ['fr-le-velo'],
            { id: 'fr.ex.p50pd6ipldb2iq', acceptedAnswers: ['Mon frère va au travail en vélo.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Je prends le train',
        objective: 'Conjugar prendre y comprar un pasaje.',
        intro: {
          explanation:
            'Prendre (tomar) es irregular. Je prends, tu prends e il prend suenan igual: la s y la d finales no se pronuncian y termina en una vocal nasal. En plural cambia: nous prenons, vous prenez, ils prennent (en ils prennent suena la doble n). Le billet es el pasaje o la entrada (y también el billete de dinero). Maintenant es ahora.',
          examples: [
            { target: 'Nous prenons le train.', base: 'Tomamos el tren.' },
            { target: 'Ils prennent le métro maintenant.', base: 'Ahora ellos toman el metro.' },
          ],
        },
        takeaways: [
          'Conjugas prendre: je prends, nous prenons, ils prennent.',
          "Pides un billet pour Lyon, s'il vous plaît.",
        ],
        exercises: [
          ex.translationChoice('prendre', 'tomar', ['viajar', 'buscar', 'mirar'], ['fr-prendre'], {
            id: 'fr.ex.ckukxcajgn8r6h',
          }),
          ex.translationChoice(
            'le billet',
            'el pasaje',
            ['el autobús', 'la estación de tren', 'la calle'],
            ['fr-le-billet'],
            { id: 'fr.ex.j0edhvldbrw788' },
          ),
          ex.fillBlank(
            'Nous ___ le train à huit heures.',
            'Tomamos el tren a las ocho.',
            'prenons',
            ['prenez', 'prennent', 'prend'],
            ['fr-prendre', 'fr-le-train'],
            {
              id: 'fr.ex.hw75fxjdp6h81q',
              explanation: 'Con nous, la terminación es -ons: nous prenons.',
            },
          ),
          ex.fillBlank(
            'Ils ___ le métro.',
            'Ellos toman el metro.',
            'prennent',
            ['prenons', 'prenez', 'prend'],
            ['fr-prendre', 'fr-le-metro'],
            {
              id: 'fr.ex.oxzu1ksfntnsvt',
              explanation: 'Con ils: ils prennent, con doble n. La terminación -ent no suena.',
            },
          ),
          ex.listenChoice(
            'Ils prennent le bus.',
            ['Il prend le bus.', 'Elle prend le bus.'],
            ['fr-prendre', 'fr-le-bus'],
            {
              id: 'fr.ex.v83oeupowhofx4',
              explanation:
                'En ils prennent suena la n doble; il prend termina en vocal nasal, sin la d.',
            },
          ),
          ex.matchPairs(
            [
              ['je prends', 'tomo'],
              ['nous prenons', 'tomamos'],
              ['vous prenez', 'ustedes toman'],
              ['ils prennent', 'ellos toman'],
            ],
            ['fr-prendre'],
            { id: 'fr.ex.xmy8z82qv9i6al' },
          ),
          ex.fillBlank(
            "Un ___ pour Lyon, s'il vous plaît.",
            'Un pasaje a Lyon, por favor.',
            'billet',
            ['bus', 'métro', 'vélo'],
            ['fr-le-billet'],
            {
              id: 'fr.ex.9efsdjje6ncgp2',
              skill: 'vocabulary',
              explanation: 'El pasaje es le billet. Para el destino se usa pour: pour Lyon.',
            },
          ),
          ex.listenChoice(
            'Je prends le bus maintenant.',
            ['Je prends le bus demain.', 'Je prends le train maintenant.'],
            ['fr-maintenant', 'fr-le-bus'],
            { id: 'fr.ex.b8degnopy4u1m7' },
          ),
          ex.translateWrite(
            'Ahora tomamos el metro.',
            'Maintenant, nous prenons le métro.',
            ['fr-prendre', 'fr-le-metro', 'fr-maintenant'],
            {
              id: 'fr.ex.ii75s6oa7ikbaj',
              acceptedAnswers: [
                'Nous prenons le métro maintenant.',
                'Maintenant, on prend le métro.',
                'On prend le métro maintenant.',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu prends le bus ou le train?',
            '¿Tomas el autobús o el tren? (Responde que tomas el tren.)',
            'Je prends le train.',
            ['Le train.', 'Je prends le train!'],
            ['fr-prendre', 'fr-le-train'],
            { id: 'fr.ex.97mn43891w7ehc' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Je vais partir',
        objective: 'Contar planes con aller + infinitivo.',
        intro: {
          explanation:
            'Para hablar de un plan cercano se usa aller en presente + infinitivo, igual que «ir a» en español: je vais partir, tu vas rester, il va visiter. Entre amigos, on va + infinitivo es la forma más común de decir «vamos a»: on va prendre le train. En la negación, ne… pas rodea a aller: je ne vais pas partir. Ojo: rester es quedarse, no «restar».',
          examples: [
            { target: 'Je vais partir demain.', base: 'Me voy a ir mañana.' },
            { target: 'On va visiter le musée.', base: 'Vamos a visitar el museo.' },
          ],
        },
        takeaways: [
          'Cuentas un plan con aller + infinitivo: je vais partir.',
          'Dices «vamos a…» con on va: on va rester.',
        ],
        exercises: [
          ex.translationChoice('partir', 'irse', ['quedarse', 'visitar', 'tomar'], ['fr-partir'], {
            id: 'fr.ex.e4gjmxbp9n8a88',
          }),
          ex.translationChoice('rester', 'quedarse', ['irse', 'viajar', 'restar'], ['fr-rester'], {
            id: 'fr.ex.v7ja98lycg53cp',
            explanation: 'Falso amigo: rester es quedarse, no restar.',
          }),
          ex.matchPairs(
            [
              ['partir', 'irse'],
              ['rester', 'quedarse'],
              ['visiter', 'visitar'],
              ['on va', 'vamos'],
            ],
            ['fr-partir', 'fr-rester', 'fr-visiter', 'fr-on-va'],
            { id: 'fr.ex.nvp5j26jpt096i' },
          ),
          ex.fillBlank(
            'Demain, je ___ visiter Paris.',
            'Mañana voy a visitar París.',
            'vais',
            ['vas', 'va', 'vont'],
            ['fr-visiter'],
            { id: 'fr.ex.ojib0ux3detjby', explanation: 'Con je: je vais + infinitivo.' },
          ),
          ex.fillBlank(
            'Il pleut: on va ___ à la maison.',
            'Llueve: nos vamos a quedar en casa.',
            'rester',
            ['partir', 'visiter', 'prendre'],
            ['fr-rester', 'fr-on-va'],
            {
              id: 'fr.ex.crt77kc5uj451c',
              skill: 'vocabulary',
              explanation: 'Quedarse es rester; después de on va va el infinitivo.',
            },
          ),
          ex.listenChoice(
            'On va partir demain.',
            ['On va rester demain.', 'On va partir lundi.'],
            ['fr-on-va', 'fr-partir'],
            { id: 'fr.ex.fazo9hr781izyf' },
          ),
          ex.listenChoice('Ils vont rester.', ['Il va rester.', 'Elle va rester.'], ['fr-rester'], {
            id: 'fr.ex.5jzr4jjjv6vr51',
            explanation: 'Il va y ils vont suenan distinto: escucha el final, va o vont.',
          }),
          ex.orderWords(
            'Nous allons visiter le musée demain.',
            'Mañana vamos a visitar el museo.',
            ['fr-visiter'],
            { id: 'fr.ex.fptizv4jod02ay' },
          ),
          ex.translateWrite(
            'Vamos a tomar el tren.',
            'On va prendre le train.',
            ['fr-on-va', 'fr-prendre'],
            { id: 'fr.ex.iuob4fd3ob1lwe', acceptedAnswers: ['Nous allons prendre le train.'] },
          ),
          ex.shortAnswer(
            'Tu vas partir demain?',
            '¿Te vas a ir mañana? (Responde que no, que te vas a quedar.)',
            'Non, je vais rester.',
            ['Non, je ne vais pas partir, je vais rester.', 'Non. Je vais rester.'],
            ['fr-rester', 'fr-partir'],
            { id: 'fr.ex.jtig1fu1j3g9kh' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Ce soir, ce week-end',
        objective: 'Ubicar los planes en el tiempo.',
        intro: {
          explanation:
            'Ce soir es esta noche; ce week-end, este fin de semana; la semaine prochaine, la semana que viene (prochaine va después de semaine). No confundas ce soir (esta noche) con le soir (por la noche, todos los días). Con estos marcadores se usa el futuro próximo: ce soir, je vais rester à la maison.',
          examples: [
            { target: 'Ce soir, on va au cinéma.', base: 'Esta noche vamos al cine.' },
            {
              target: 'La semaine prochaine, je vais partir.',
              base: 'La semana que viene me voy a ir.',
            },
          ],
        },
        takeaways: [
          'Ubicas un plan con ce soir, ce week-end o la semaine prochaine.',
          'Distingues ce soir (esta noche) de le soir (todas las noches).',
        ],
        exercises: [
          ex.translationChoice(
            'ce soir',
            'esta noche',
            ['la noche', 'este fin de semana', 'mañana'],
            ['fr-ce-soir'],
            {
              id: 'fr.ex.w9py5tqaiifb29',
              explanation: 'Ce soir es esta noche; le soir, la noche en general.',
            },
          ),
          ex.translationChoice(
            'la semaine prochaine',
            'la semana que viene',
            ['la semana', 'este fin de semana', 'hoy'],
            ['fr-la-semaine-prochaine'],
            { id: 'fr.ex.73igxn79e3n1d5' },
          ),
          ex.matchPairs(
            [
              ['ce soir', 'esta noche'],
              ['ce week-end', 'este fin de semana'],
              ['la semaine prochaine', 'la semana que viene'],
              ['maintenant', 'ahora'],
            ],
            ['fr-ce-soir', 'fr-ce-week-end', 'fr-la-semaine-prochaine', 'fr-maintenant'],
            { id: 'fr.ex.t15uh35pynz5qo' },
          ),
          ex.fillBlank(
            '___, je vais au cinéma avec Léa.',
            'Esta noche voy al cine con Léa.',
            'Ce soir',
            ['Le soir', 'Ce week-end', 'Demain'],
            ['fr-ce-soir'],
            {
              id: 'fr.ex.voljj8j80aktzd',
              skill: 'vocabulary',
              explanation: 'Esta noche es ce soir. Le soir es «por la noche» como costumbre.',
            },
          ),
          ex.listenChoice(
            'On va partir ce week-end.',
            ['On va partir le week-end.', 'On va rester ce week-end.'],
            ['fr-ce-week-end', 'fr-partir'],
            {
              id: 'fr.ex.02eaauraixgra1',
              explanation: 'Escucha ce o le: ce week-end es este fin de semana.',
            },
          ),
          question(
            'fr.ex.s31wfmv6fzoint',
            WEEK_END,
            '¿Qué va a hacer Antoine este fin de semana?',
            'Visitar Lyon con su hermana.',
            ['Quedarse en casa.', 'Ir al cine con Julie.', 'Visitar París con su papá.'],
            ['fr-ce-week-end', 'fr-visiter'],
            'Antoine dice «Je vais visiter Lyon avec ma sœur».',
          ),
          question(
            'fr.ex.z9yiaoc8h7qsmf',
            WEEK_END,
            '¿Cómo van a viajar Antoine y su hermana?',
            'En tren.',
            ['En auto.', 'En avión.', 'En bici.'],
            ['fr-prendre', 'fr-le-train'],
            'Antoine dice «On va prendre le train samedi».',
          ),
          question(
            'fr.ex.aamic2zlla2z7n',
            WEEK_END,
            '¿Qué van a hacer esta noche?',
            'Antoine se queda en casa y Julie va al cine en bici.',
            [
              'Los dos van al cine.',
              'Antoine va al cine y Julie se queda en casa.',
              'Los dos toman el tren.',
            ],
            ['fr-ce-soir', 'fr-rester', 'fr-le-velo'],
            'Antoine dice «Ce soir, je vais rester à la maison» y Julie, «Je vais au cinéma à vélo».',
          ),
          ex.translateWrite(
            'La semana que viene voy a visitar Marsella.',
            'La semaine prochaine, je vais visiter Marseille.',
            ['fr-la-semaine-prochaine', 'fr-visiter'],
            {
              id: 'fr.ex.6oep3f7mejxn39',
              acceptedAnswers: ['Je vais visiter Marseille la semaine prochaine.'],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu vas faire ce soir?",
            '¿Qué vas a hacer esta noche? (Responde que te vas a quedar en casa.)',
            'Ce soir, je vais rester à la maison.',
            ['Je vais rester à la maison.', 'Je vais rester à la maison ce soir.'],
            ['fr-ce-soir', 'fr-rester'],
            { id: 'fr.ex.xkxgo8r6em96u4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Les vacances',
        objective: 'Hablar de un viaje y de las vacaciones.',
        intro: {
          explanation:
            'Les vacances va siempre en plural (la s final no suena): partir en vacances es irse de vacaciones. Le voyage es el viaje y voyager, el verbo. Para despedir a alguien que viaja: bon voyage! En Francia muchas familias se van de vacaciones en julio o en agosto.',
          examples: [
            { target: 'Bon voyage!', base: '¡Buen viaje!' },
            {
              target: 'En août, on va partir en vacances.',
              base: 'En agosto nos vamos a ir de vacaciones.',
            },
          ],
        },
        takeaways: [
          'Dices les vacances siempre en plural: partir en vacances.',
          'Despides a un viajero con bon voyage!',
        ],
        exercises: [
          ex.translationChoice(
            'les vacances',
            'las vacaciones',
            ['el viaje', 'el pasaje', 'el fin de semana'],
            ['fr-les-vacances'],
            { id: 'fr.ex.ccfdvpklk4dm83' },
          ),
          ex.translationChoice(
            'le voyage',
            'el viaje',
            ['las vacaciones', 'el pasaje', 'el tren'],
            ['fr-le-voyage'],
            { id: 'fr.ex.eje4sk44znvlzu' },
          ),
          ex.fillBlank(
            'Bon ___, Paul!',
            '¡Buen viaje, Paul!',
            'voyage',
            ['billet', 'vacances', 'vélo'],
            ['fr-le-voyage'],
            { id: 'fr.ex.fhcakdfaw3g6mw', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Je pars en vacances.',
            ['Je pars en avion.', 'Je pars en voiture.'],
            ['fr-les-vacances'],
            {
              id: 'fr.ex.ktcj8ab2lcxiud',
              explanation: 'En vacances la s final no suena; en en avion, la n se une a la vocal.',
            },
          ),
          question(
            'fr.ex.tubch6y3qwxsdg',
            VACANCES,
            '¿Con quién se va de vacaciones Camille?',
            'Con sus padres.',
            ['Con Nicolas.', 'Con su hermana.', 'Sola.'],
            ['fr-les-vacances'],
            'Escribe «je pars en vacances à Nice avec mes parents».',
          ),
          question(
            'fr.ex.kpy3z8mgji9nlp',
            VACANCES,
            '¿Cómo van a viajar a Niza?',
            'En avión, porque en auto es lejos.',
            ['En auto.', 'En tren, porque es más barato.', 'En autobús.'],
            ['fr-l-avion', 'fr-la-voiture'],
            "Camille escribe «On va prendre l'avion: en voiture, c'est loin».",
          ),
          question(
            'fr.ex.7sxdqb3wfh9c9s',
            VACANCES,
            '¿Cuánto tiempo se van a quedar?',
            'Dos semanas.',
            ['Un fin de semana.', 'Dos días.', 'Todo julio.'],
            ['fr-rester'],
            'Escribe «Nous allons rester deux semaines».',
          ),
          ex.orderWords(
            'Nous allons partir en vacances en juillet.',
            'Nos vamos a ir de vacaciones en julio.',
            ['fr-les-vacances', 'fr-partir'],
            { id: 'fr.ex.dgh9zsrq89np9d' },
          ),
          ex.translateWrite(
            'En julio me voy de vacaciones a Niza.',
            'En juillet, je pars en vacances à Nice.',
            ['fr-les-vacances', 'fr-partir'],
            {
              id: 'fr.ex.ooeos46pommz68',
              acceptedAnswers: [
                'Je pars en vacances à Nice en juillet.',
                'En juillet, je vais partir en vacances à Nice.',
                'Je vais partir en vacances à Nice en juillet.',
              ],
            },
          ),
          ex.shortAnswer(
            'Comment est-ce que tu vas voyager?',
            '¿Cómo vas a viajar? (Responde que vas a tomar el tren.)',
            'Je vais prendre le train.',
            ['On va prendre le train.', 'Je vais voyager en train.', 'En train.'],
            ['fr-prendre', 'fr-le-train'],
            { id: 'fr.ex.hwt0roj8dfgmii' },
          ),
        ],
      },
    ],
  },
};

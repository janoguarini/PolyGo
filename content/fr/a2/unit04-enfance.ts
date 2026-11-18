import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U4 «Cuando era chico» (docs/FR_A1_A2.md): describir la infancia, dónde vivías, cómo
 * eras y qué hacías habitualmente, y contrastar antes y ahora.
 * Gramática: el imparfait (raíz de nous + -ais, -ais, -ait, -ions, -iez, -aient; être: j'étais),
 * il y avait, c'était; d'habitude, avant, chaque. Pronunciación: -ais / -ait / -aient suenan igual;
 * je joue / je jouais / j'ai joué; c'est / c'était. Falsos amigos: le souvenir, la campagne.
 * Cultura: l'école primaire va de los 6 a los 11 años; las vacaciones de verano en casa de los
 * abuelos.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PHOTO = dialogue('fr.stim.a2-u4-photo', 'Léa mira una foto vieja con su abuela Hélène.', [
  ['Léa', "C'est toi sur la photo, mamie?"],
  ['Hélène', "Oui! J'avais huit ans. C'était dans mon village, en Bretagne."],
  ['Léa', 'Tu habitais à la campagne?'],
  [
    'Hélène',
    'Oui, avec mes parents et mes quatre frères. Il y avait des vaches et un grand jardin.',
  ],
  ['Léa', "Et l'école?"],
  [
    'Hélène',
    "L'école primaire était à côté de l'église. D'habitude, j'y allais à pied avec mes frères.",
  ],
]);

const SOUVENIRS = reading(
  'fr.stim.a2-u4-souvenirs',
  'post',
  'Thomas publica un recuerdo en una red social.',
  [
    "Quand j'étais petit, j'habitais à Lyon, dans un petit appartement.",
    'Chaque été, on allait chez mes grands-parents, à la campagne.',
    'Je jouais dehors tous les jours avec mon cousin Hugo.',
    "Je n'avais pas beaucoup de jouets, mais j'étais très heureux.",
    "Aujourd'hui, j'habite à Paris, mais j'adore toujours la campagne.",
  ],
  { title: "Mes souvenirs d'enfance", from: 'Thomas' },
);

export const FR_A2_U04: FrUnitDef = {
  names: ['Léa', 'Hélène', 'Bretagne', 'Thomas', 'Hugo', 'Lyon', 'Paris', 'Marseille', 'Julie'],
  support: [
    'habitons',
    'habitaient',
    'habitait',
    'jouait',
    'allais',
    'allait',
    'allions',
    'faisais',
    'adorais',
    'joué',
    'grandi',
    'chez',
    'jardin',
    'photo',
    'mamie',
    'vache',
    'église',
    'dehors',
    'cousin',
    'heureux',
    'préféré',
  ],
  unit: {
    position: 4,
    title: 'Cuando era chico',
    titleEn: "Quand j'étais petit",
    description:
      "El imparfait para describir el pasado y lo habitual: j'étais, j'avais, j'habitais, je jouais, il y avait, c'était; d'habitude, avant, chaque.",
    emoji: '🧸',
    objective:
      'Podés contar cómo era tu infancia: dónde vivías, cómo eras, qué había y qué hacías normalmente, y compararlo con tu vida de ahora.',
    grammar: {
      title: "El imparfait: j'étais, j'avais, j'habitais",
      explanation:
        "El imparfait es el pasado para describir y para contar lo habitual, como el imperfecto español (era, tenía, vivía, jugaba). Se forma con la raíz de nous en presente (nous habitons → habit-) y las terminaciones -ais, -ais, -ait, -ions, -iez, -aient: j'habitais, il habitait, nous habitions. Être es irregular: j'étais, c'était. Avoir: j'avais, il y avait (había). La edad va con avoir: quand j'avais dix ans, nunca «j'étais dix ans». Las terminaciones -ais, -ait y -aient suenan igual: la s, la t y el -ent finales no se pronuncian.",
      examples: [
        {
          target: "Quand j'étais petit, j'habitais à la campagne.",
          base: 'Cuando era chico, vivía en el campo.',
        },
        {
          target: "D'habitude, je jouais avec mon frère.",
          base: 'Normalmente jugaba con mi hermano.',
        },
        { target: 'Il y avait un grand jardin.', base: 'Había un jardín grande.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A2 nuevo (U4). Sin revisión nativa: revisar «c'était» traducido como «era / estaba» y el contraste imparfait / passé composé en «j'ai grandi», que se presenta como fórmula fija antes de la U5.",
    },
    words: [
      w(
        'fr-j-etais',
        "j'étais",
        'yo era',
        "J'étais un enfant timide.",
        'Yo era un chico tímido.',
        ['past', 'imparfait'],
        {
          acceptedTranslations: ['yo estaba'],
        },
      ),
      w(
        'fr-j-avais',
        "j'avais",
        'tenía',
        "Quand j'avais dix ans, j'avais un chien.",
        'Cuando tenía diez años, tenía un perro.',
        ['past', 'imparfait'],
        { acceptedTranslations: ['yo tenía'] },
      ),
      w(
        'fr-j-habitais',
        "j'habitais",
        'vivía',
        "Avant, j'habitais à Marseille.",
        'Antes vivía en Marsella.',
        ['past', 'imparfait'],
        { acceptedTranslations: ['yo vivía'] },
      ),
      w(
        'fr-je-jouais',
        'je jouais',
        'jugaba',
        'Je jouais au foot avec mes amis.',
        'Jugaba al fútbol con mis amigos.',
        ['past', 'imparfait'],
        { acceptedTranslations: ['yo jugaba'] },
      ),
      w(
        'fr-il-y-avait',
        'il y avait',
        'había',
        'Dans le village, il y avait une boulangerie.',
        'En el pueblo había una panadería.',
        ['past', 'imparfait'],
      ),
      w(
        'fr-c-etait',
        "c'était",
        'era',
        "C'était une petite maison blanche.",
        'Era una casita blanca.',
        ['past', 'imparfait'],
        { acceptedTranslations: ['estaba'] },
      ),
      w(
        'fr-quand-j-etais-petit',
        "quand j'étais petit",
        'cuando era chico',
        "Quand j'étais petit, j'adorais les chats.",
        'Cuando era chico, me encantaban los gatos.',
        ['past', 'imparfait'],
        {
          acceptedTranslations: ['cuando era chica', 'cuando era pequeño'],
          acceptedTexts: ["quand j'étais petite"],
        },
      ),
      w(
        'fr-d-habitude',
        "d'habitude",
        'normalmente',
        "D'habitude, je jouais avec mon frère.",
        'Normalmente jugaba con mi hermano.',
        ['frequency'],
        { acceptedTranslations: ['por lo general', 'habitualmente'] },
      ),
      w(
        'fr-avant',
        'avant',
        'antes',
        "Avant, j'habitais à Lyon. Maintenant, j'habite à Paris.",
        'Antes vivía en Lyon. Ahora vivo en París.',
        ['time'],
      ),
      w(
        'fr-l-enfance',
        "l'enfance",
        'la infancia',
        'Mon enfance était très belle.',
        'Mi infancia fue muy linda.',
        ['time', 'f'],
        { acceptedTranslations: ['la niñez'] },
      ),
      w(
        'fr-le-village',
        'le village',
        'el pueblo',
        'Mes grands-parents habitaient dans un petit village.',
        'Mis abuelos vivían en un pueblito.',
        ['places', 'm'],
        { emoji: '🏘️' },
      ),
      w(
        'fr-la-campagne',
        'la campagne',
        'el campo',
        "Quand j'étais petite, j'habitais à la campagne.",
        'Cuando era chica, vivía en el campo.',
        ['places', 'f'],
      ),
      w(
        'fr-le-jouet',
        'le jouet',
        'el juguete',
        "Mon jouet préféré, c'était un petit vélo rouge.",
        'Mi juguete preferido era una bicicletita roja.',
        ['objects', 'm'],
        { emoji: '🧸' },
      ),
      w(
        'fr-l-ecole-primaire',
        "l'école primaire",
        'la escuela primaria',
        "L'école primaire était à côté de la maison.",
        'La primaria estaba al lado de casa.',
        ['places', 'f'],
        { acceptedTranslations: ['la primaria'] },
      ),
      w(
        'fr-chaque',
        'chaque',
        'cada',
        'Chaque été, on allait chez mes grands-parents.',
        'Cada verano íbamos a lo de mis abuelos.',
        ['quantity'],
      ),
      w(
        'fr-le-souvenir',
        'le souvenir',
        'el recuerdo',
        "J'ai beaucoup de souvenirs de mon enfance.",
        'Tengo muchos recuerdos de mi infancia.',
        ['time', 'm'],
      ),
      w(
        'fr-grandir',
        'grandir',
        'crecer',
        "Grandir à la campagne, c'est très beau.",
        'Crecer en el campo es muy lindo.',
        ['verbs'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "Quand j'étais petit",
        objective: 'Decir cómo eras y qué tenías de chico.',
        intro: {
          explanation:
            "Para describir tu infancia usás el imparfait: j'étais (yo era) y j'avais (tenía). Quand j'étais petit es «cuando era chico»; una mujer dice quand j'étais petite, y en el femenino la t sí suena. La edad va con avoir: quand j'avais dix ans (cuando tenía diez años). En j'étais y j'avais la s final no suena: terminan en una e abierta.",
          examples: [
            {
              target: "Quand j'étais petit, j'étais timide.",
              base: 'Cuando era chico, era tímido.',
            },
            {
              target: "Quand j'avais dix ans, j'avais un chien.",
              base: 'Cuando tenía diez años, tenía un perro.',
            },
          ],
        },
        takeaways: ["Describís cómo eras con j'étais.", "Decís qué tenías y tu edad con j'avais."],
        exercises: [
          ex.translationChoice("j'étais", 'yo era', ['soy', 'tenía', 'vivía'], ['fr-j-etais'], {
            id: 'fr.ex.yya8lsovr7con1',
          }),
          ex.translationChoice("j'avais", 'tenía', ['tengo', 'yo era', 'había'], ['fr-j-avais'], {
            id: 'fr.ex.e5mczcsfod0zpy',
          }),
          ex.fillBlank(
            "Quand j'___ huit ans, j'étais très timide.",
            'Cuando tenía ocho años, era muy tímido.',
            'avais',
            ['étais', 'ai', 'as'],
            ['fr-j-avais', 'fr-j-etais'],
            {
              id: 'fr.ex.t1pwafz8keghrv',
              explanation: "La edad va con avoir, y en pasado descriptivo: j'avais huit ans.",
            },
          ),
          ex.fillBlank(
            "Quand j'étais ___, j'étais sportive.",
            'Cuando era chica, era deportista.',
            'petite',
            ['petit', 'petits', 'grand'],
            ['fr-quand-j-etais-petit'],
            {
              id: 'fr.ex.l7ys9xsxbjdog6',
              explanation: 'Habla una mujer (sportive): petite, con la t final que suena.',
            },
          ),
          ex.matchPairs(
            [
              ["j'étais", 'yo era'],
              ["j'avais", 'tenía'],
              ["l'enfance", 'la infancia'],
              ["quand j'étais petit", 'cuando era chico'],
            ],
            ['fr-j-etais', 'fr-j-avais', 'fr-l-enfance', 'fr-quand-j-etais-petit'],
            { id: 'fr.ex.ko487jh2qxular' },
          ),
          ex.listenChoice(
            "J'étais timide.",
            ['Je suis timide.', "J'ai été timide."],
            ['fr-j-etais'],
            {
              id: 'fr.ex.k9emprpl8uxvzo',
              explanation: "J'étais (imparfait) termina en e abierta; je suis es presente.",
            },
          ),
          ex.translationChoice(
            "l'enfance",
            'la infancia',
            ['el niño', 'la familia', 'la escuela'],
            ['fr-l-enfance'],
            {
              id: 'fr.ex.4y1aaeeseebhfj',
              explanation: "No confundas l'enfance (la infancia) con l'enfant (el niño).",
            },
          ),
          ex.orderWords(
            "J'étais un enfant très timide.",
            'Yo era un chico muy tímido.',
            ['fr-j-etais'],
            {
              id: 'fr.ex.fxu55cy63mi9g9',
            },
          ),
          ex.translateWrite(
            'Cuando era chico, era muy tímido.',
            "Quand j'étais petit, j'étais très timide.",
            ['fr-quand-j-etais-petit', 'fr-j-etais'],
            {
              id: 'fr.ex.tv8omny1riahew',
              acceptedAnswers: [
                "Quand j'étais petite, j'étais très timide.",
                "Quand j'étais petit j'étais très timide.",
              ],
            },
          ),
          ex.shortAnswer(
            'Quand tu étais petit, tu étais sportif?',
            '¿De chico eras deportista? (Respondé que sí, que eras muy deportista.)',
            "Oui, j'étais très sportif.",
            [
              "Oui, j'étais très sportive.",
              "Oui, quand j'étais petit, j'étais très sportif.",
              "Oui, quand j'étais petite, j'étais très sportive.",
            ],
            ['fr-j-etais'],
            { id: 'fr.ex.dl92m7jft4k914' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Dónde vivía',
        objective: 'Contar dónde vivías y cómo era el lugar.',
        intro: {
          explanation:
            "El imparfait se arma con la raíz de nous: nous habitons → habit- + -ais: j'habitais, il habitait, nous habitions, ils habitaient. -ais, -ait y -aient suenan igual. Il y a (hay) pasa a il y avait (había). Avant es antes. Falso amigo: la campagne es el campo, no una campaña.",
          examples: [
            { target: "Avant, j'habitais à la campagne.", base: 'Antes vivía en el campo.' },
            {
              target: 'Dans le village, il y avait une boulangerie.',
              base: 'En el pueblo había una panadería.',
            },
          ],
        },
        takeaways: ["Contás dónde vivías con j'habitais.", 'Describís el lugar con il y avait.'],
        exercises: [
          ex.translationChoice(
            'la campagne',
            'el campo',
            ['la campaña', 'la montaña', 'la playa'],
            ['fr-la-campagne'],
            { id: 'fr.ex.q4b06rizzy6oa0', explanation: 'Falso amigo: la campagne es el campo.' },
          ),
          ex.translationChoice(
            'il y avait',
            'había',
            ['hay', 'no hay', 'tenía'],
            ['fr-il-y-avait'],
            {
              id: 'fr.ex.299sikt8tir93v',
            },
          ),
          ex.listenChoice(
            "J'habitais dans un village.",
            ["J'habite dans un village.", "J'habitais dans une ville."],
            ['fr-j-habitais', 'fr-le-village'],
            {
              id: 'fr.ex.pkznkdhummjy3q',
              explanation: "J'habitais termina en una e abierta; j'habite, en una e muda.",
            },
          ),
          ex.fillBlank(
            "Avant, j'___ à Lyon.",
            'Antes vivía en Lyon.',
            'habitais',
            ['habite', 'habitait', 'habitons'],
            ['fr-j-habitais', 'fr-avant'],
            {
              id: 'fr.ex.opp5jck1ffyzee',
              explanation:
                "Con je, el imparfait termina en -ais: j'habitais. Habitait es para il o elle.",
            },
          ),
          ex.fillBlank(
            'Dans le village, il y ___ une boulangerie.',
            'En el pueblo había una panadería.',
            'avait',
            ['a', 'est', 'avais'],
            ['fr-il-y-avait', 'fr-le-village'],
            {
              id: 'fr.ex.ynq1tzrujjcrj6',
              explanation: 'Había: il y avait, el imparfait de il y a.',
            },
          ),
          ex.matchPairs(
            [
              ['le village', 'el pueblo'],
              ['la campagne', 'el campo'],
              ['avant', 'antes'],
              ['il y avait', 'había'],
            ],
            ['fr-le-village', 'fr-la-campagne', 'fr-avant', 'fr-il-y-avait'],
            { id: 'fr.ex.mpitlqtfmp74vz' },
          ),
          ex.imageChoice(
            '🏘️',
            'le village',
            ['la ville', 'la campagne', 'la plage'],
            ['fr-le-village'],
            {
              id: 'fr.ex.raejhy42cb4v6l',
            },
          ),
          ex.orderWords(
            "Avant j'habitais à la campagne.",
            'Antes vivía en el campo.',
            ['fr-avant', 'fr-j-habitais', 'fr-la-campagne'],
            { id: 'fr.ex.w3605kclc9armz' },
          ),
          ex.translateWrite(
            'Antes vivía en un pueblo.',
            "Avant, j'habitais dans un village.",
            ['fr-avant', 'fr-j-habitais', 'fr-le-village'],
            {
              id: 'fr.ex.etfipetjmzql48',
              acceptedAnswers: [
                "Avant j'habitais dans un village.",
                "Avant, j'habitais dans un petit village.",
              ],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce qu'il y avait dans ton village?",
            '¿Qué había en tu pueblo? (Respondé: había una panadería.)',
            'Il y avait une boulangerie.',
            ['Dans mon village, il y avait une boulangerie.', 'Une boulangerie.'],
            ['fr-il-y-avait'],
            { id: 'fr.ex.idh4db6a25wjh7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Juegos y costumbres',
        objective: 'Contar qué hacías normalmente de chico.',
        intro: {
          explanation:
            "El imparfait también cuenta lo habitual, lo que hacías siempre: je jouais (jugaba), on allait (íbamos). Va con d'habitude (normalmente), chaque (cada: chaque été, chaque dimanche), tous les jours y souvent. Escuchá la diferencia: je joue (presente), je jouais (imparfait, termina en e abierta) y j'ai joué (passé composé).",
          examples: [
            {
              target: "D'habitude, je jouais avec mon frère.",
              base: 'Normalmente jugaba con mi hermano.',
            },
            { target: 'Chaque été, on allait à la plage.', base: 'Cada verano íbamos a la playa.' },
          ],
        },
        takeaways: [
          'Contás costumbres con el imparfait: je jouais, on allait.',
          "Usás d'habitude y chaque para lo que se repetía.",
        ],
        exercises: [
          ex.translationChoice('chaque', 'cada', ['todos', 'siempre', 'seguido'], ['fr-chaque'], {
            id: 'fr.ex.80kpm5oud2f8eb',
          }),
          ex.translationChoice(
            'le jouet',
            'el juguete',
            ['el juego', 'el libro', 'el regalo'],
            ['fr-le-jouet'],
            { id: 'fr.ex.ebcw68ohndn6vj' },
          ),
          ex.listenChoice(
            'Je jouais au foot.',
            ['Je joue au foot.', "J'ai joué au foot."],
            ['fr-je-jouais'],
            {
              id: 'fr.ex.rcfft199341930',
              explanation:
                "Je jouais termina en e abierta; je joue, sin vocal final; j'ai joué tiene el ai delante.",
            },
          ),
          ex.fillBlank(
            "D'habitude, je ___ avec mon frère.",
            'Normalmente jugaba con mi hermano.',
            'jouais',
            ['joue', 'jouait', 'jouer'],
            ['fr-je-jouais', 'fr-d-habitude'],
            { id: 'fr.ex.0iseph3dur4yby', explanation: 'Costumbre del pasado con je: je jouais.' },
          ),
          ex.fillBlank(
            '___ été, on allait à la plage.',
            'Cada verano íbamos a la playa.',
            'Chaque',
            ['Tous', 'Toujours', 'Souvent'],
            ['fr-chaque'],
            {
              id: 'fr.ex.x409ucapwrauid',
              skill: 'vocabulary',
              explanation: 'Chaque (cada) va con un sustantivo en singular: chaque été.',
            },
          ),
          ex.matchPairs(
            [
              ['je jouais', 'jugaba'],
              ['le jouet', 'el juguete'],
              ["d'habitude", 'normalmente'],
              ['chaque', 'cada'],
            ],
            ['fr-je-jouais', 'fr-le-jouet', 'fr-d-habitude', 'fr-chaque'],
            { id: 'fr.ex.tu974qmtat64tk' },
          ),
          ex.fillBlank(
            "Je n'avais pas beaucoup de ___.",
            'No tenía muchos juguetes.',
            'jouets',
            ['jouais', 'jouer', 'jouait'],
            ['fr-le-jouet'],
            {
              id: 'fr.ex.ao4t59f38mb38d',
              skill: 'vocabulary',
              explanation: 'Juguetes: les jouets.',
            },
          ),
          ex.orderWords(
            'Chaque dimanche on allait chez mes grands-parents.',
            'Cada domingo íbamos a lo de mis abuelos.',
            ['fr-chaque'],
            { id: 'fr.ex.j1f9y4ocoqll2c' },
          ),
          ex.translateWrite(
            'Normalmente jugaba al fútbol con mis amigos.',
            "D'habitude, je jouais au foot avec mes amis.",
            ['fr-d-habitude', 'fr-je-jouais'],
            {
              id: 'fr.ex.qruocsbf5t193h',
              acceptedAnswers: [
                "D'habitude je jouais au foot avec mes amis.",
                "D'habitude, je jouais au football avec mes amis.",
              ],
            },
          ),
          ex.shortAnswer(
            "Quand tu étais petit, qu'est-ce que tu faisais le week-end?",
            '¿Qué hacías los fines de semana de chico? (Respondé: jugaba al fútbol.)',
            'Je jouais au foot.',
            [
              "D'habitude, je jouais au foot.",
              'Le week-end, je jouais au foot.',
              'Je jouais au foot avec mes amis.',
            ],
            ['fr-je-jouais'],
            { id: 'fr.ex.q55pt5ijo498ci' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'La escuela y los recuerdos',
        objective: 'Describir lugares del pasado y hablar de tus recuerdos.',
        intro: {
          explanation:
            "C'était (era, estaba) describe en pasado: c'était loin, c'était beau. Escuchá la diferencia con c'est (presente). Le souvenir es el recuerdo (también el souvenir de un viaje). Grandir es crecer; para decir dónde creciste: j'ai grandi à… En Francia, l'école primaire va de los 6 a los 11 años.",
          examples: [
            {
              target: "L'école primaire, c'était à côté de la maison.",
              base: 'La primaria estaba al lado de casa.',
            },
            { target: "J'ai grandi dans un petit village.", base: 'Crecí en un pueblito.' },
          ],
        },
        takeaways: [
          "Describís el pasado con c'était.",
          "Contás tus souvenirs y dónde creciste: j'ai grandi à…",
        ],
        exercises: [
          ex.translationChoice(
            'le souvenir',
            'el recuerdo',
            ['el regalo', 'el viaje', 'el juguete'],
            ['fr-le-souvenir'],
            { id: 'fr.ex.9mu13k3j3wf39r', explanation: 'Le souvenir es, ante todo, el recuerdo.' },
          ),
          ex.listenChoice("C'était loin.", ["C'est loin.", "C'était beau."], ['fr-c-etait'], {
            id: 'fr.ex.nlsr8tm3pvj07h',
            explanation: "C'était tiene una sílaba más que c'est y termina en e abierta.",
          }),
          ex.fillBlank(
            "L'école primaire, ___ à côté de la maison.",
            'La primaria estaba al lado de casa.',
            "c'était",
            ["c'est", "j'étais", 'il y a'],
            ['fr-c-etait', 'fr-l-ecole-primaire'],
            { id: 'fr.ex.q3j3f98vs56gz2', explanation: "Para describir en pasado: c'était." },
          ),
          ex.fillBlank(
            "J'ai ___ dans un petit village.",
            'Crecí en un pueblito.',
            'grandi',
            ['grandir', 'grand', 'grande'],
            ['fr-grandir'],
            {
              id: 'fr.ex.ebk34ybm85a464',
              explanation:
                "Con j'ai va el participio: j'ai grandi (crecí). Grandir es el infinitivo.",
            },
          ),
          ex.matchPairs(
            [
              ["l'école primaire", 'la escuela primaria'],
              ["c'était", 'era'],
              ['le souvenir', 'el recuerdo'],
              ['grandir', 'crecer'],
            ],
            ['fr-l-ecole-primaire', 'fr-c-etait', 'fr-le-souvenir', 'fr-grandir'],
            { id: 'fr.ex.2kfpgvdzzq6wm2' },
          ),
          question(
            'fr.ex.y7ib9blvesaulu',
            PHOTO,
            '¿Cuántos años tenía Hélène en la foto?',
            'Ocho.',
            ['Dieciocho.', 'Cuatro.', 'Diez.'],
            ['fr-j-avais'],
            "Hélène dice «J'avais huit ans».",
          ),
          question(
            'fr.ex.zr5mkqydx5fb41',
            PHOTO,
            '¿Dónde vivía Hélène de chica?',
            'En el campo, en un pueblo de Bretaña.',
            ['En una ciudad grande.', 'Al lado de la playa.', 'En París, con sus abuelos.'],
            ['fr-le-village', 'fr-la-campagne'],
            "Dice «C'était dans mon village, en Bretagne» y responde que sí a «Tu habitais à la campagne?».",
          ),
          question(
            'fr.ex.utjk99w1s5jvwp',
            PHOTO,
            '¿Cómo iba Hélène a la escuela?',
            'A pie, con sus hermanos.',
            ['En colectivo.', 'En auto, con su padre.', 'En bici, sola.'],
            ['fr-l-ecole-primaire', 'fr-d-habitude'],
            "Cuenta «D'habitude, j'y allais à pied avec mes frères».",
          ),
          ex.translateWrite(
            'Tengo muchos recuerdos de la escuela primaria.',
            "J'ai beaucoup de souvenirs de l'école primaire.",
            ['fr-le-souvenir', 'fr-l-ecole-primaire'],
            { id: 'fr.ex.3abq9u63ecao2n' },
          ),
          ex.shortAnswer(
            "C'était comment, ton école primaire?",
            '¿Cómo era tu primaria? (Respondé que era muy buena.)',
            "C'était très bien.",
            ["C'était très bien!", "Très bien, c'était très bien."],
            ['fr-c-etait'],
            { id: 'fr.ex.xtyhu01rkdd45k' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Antes y ahora',
        objective: 'Comparar tu infancia con tu vida de hoy.',
        intro: {
          explanation:
            "Para comparar: avant + imparfait (avant, j'habitais…) y maintenant o aujourd'hui + presente (maintenant, j'habite…). Con nous, el imparfait termina en -ions: nous allions, nous habitions. Y con on, en -ait: on allait, on jouait.",
          examples: [
            {
              target: "Avant, j'habitais à la campagne. Maintenant, j'habite à Paris.",
              base: 'Antes vivía en el campo. Ahora vivo en París.',
            },
            {
              target: "Quand j'étais petite, j'avais un chat.",
              base: 'Cuando era chica, tenía un gato.',
            },
          ],
        },
        takeaways: [
          'Contrastás avant (imparfait) con maintenant (presente).',
          'Contás un recuerdo de infancia completo.',
        ],
        exercises: [
          ex.listenChoice(
            "Avant, j'habitais à Lyon.",
            [
              "Maintenant, j'habite à Lyon.",
              'Avant, il habitait à Lyon.',
              "Avant, j'habitais à Paris.",
            ],
            ['fr-avant', 'fr-j-habitais'],
            { id: 'fr.ex.p6v3v55aquf59m' },
          ),
          ex.fillBlank(
            "Avant, j'avais un chat. Maintenant, j'___ un chien.",
            'Antes tenía un gato. Ahora tengo un perro.',
            'ai',
            ['avais', 'étais'],
            ['fr-avant', 'fr-j-avais'],
            { id: 'fr.ex.i7tozve1mb59kx', explanation: "Maintenant va con presente: j'ai." },
          ),
          ex.fillBlank(
            'Chaque été, nous ___ à la campagne.',
            'Cada verano íbamos al campo.',
            'allions',
            ['allons', 'allais', 'allait'],
            ['fr-chaque', 'fr-la-campagne'],
            {
              id: 'fr.ex.l11e7tn5dhl9e0',
              explanation: 'Costumbre del pasado con nous: nous allions (-ions).',
            },
          ),
          question(
            'fr.ex.k0vi8c5dnqyp8n',
            SOUVENIRS,
            '¿Dónde pasaba Thomas los veranos?',
            'En el campo, en la casa de sus abuelos.',
            ['En Lyon, en su departamento.', 'En París.', 'En la playa, con sus padres.'],
            ['fr-chaque', 'fr-la-campagne'],
            'Escribe «Chaque été, on allait chez mes grands-parents, à la campagne».',
          ),
          question(
            'fr.ex.tnvg9ikadbyp5n',
            SOUVENIRS,
            '¿Tenía Thomas muchos juguetes?',
            'No, pero era muy feliz.',
            ['Sí, muchísimos.', 'No, y era muy triste.', 'No lo dice.'],
            ['fr-le-jouet', 'fr-j-avais', 'fr-j-etais'],
            "Dice «Je n'avais pas beaucoup de jouets, mais j'étais très heureux».",
          ),
          question(
            'fr.ex.ksa9sdhblx39rc',
            SOUVENIRS,
            '¿Dónde vive Thomas ahora?',
            'En París.',
            ['En Lyon.', 'En el campo.', 'En la casa de sus abuelos.'],
            ['fr-j-habitais', 'fr-quand-j-etais-petit'],
            "De chico vivía en Lyon («Quand j'étais petit, j'habitais à Lyon»), pero «Aujourd'hui, j'habite à Paris».",
          ),
          ex.orderWords(
            "D'habitude on jouait dans le jardin.",
            'Normalmente jugábamos en el jardín.',
            ['fr-d-habitude'],
            { id: 'fr.ex.jjq5lun0eqivdo' },
          ),
          ex.translateWrite(
            'Cuando era chica, vivía en el campo.',
            "Quand j'étais petite, j'habitais à la campagne.",
            ['fr-quand-j-etais-petit', 'fr-j-habitais', 'fr-la-campagne'],
            {
              id: 'fr.ex.a8ptnmbp9iya6w',
              acceptedAnswers: [
                "Quand j'étais petit, j'habitais à la campagne.",
                "Quand j'étais petite j'habitais à la campagne.",
              ],
            },
          ),
          ex.shortAnswer(
            'Et avant, tu habitais où?',
            'Y antes, ¿dónde vivías? (Respondé que antes vivías en Lyon.)',
            "Avant, j'habitais à Lyon.",
            ["J'habitais à Lyon.", "Avant j'habitais à Lyon.", 'À Lyon.'],
            ['fr-avant', 'fr-j-habitais'],
            { id: 'fr.ex.bk2aoy0ozmgbcc' },
          ),
        ],
      },
    ],
  },
};

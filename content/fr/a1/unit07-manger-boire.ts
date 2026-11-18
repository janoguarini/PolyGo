import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U7 «Comer y beber» (docs/FR_A1_A2.md): pedir en un café con je voudrais / je prends,
 * decir qué comés y tomás con los partitivos (du pain, de la viande, de l'eau, des légumes; pas de en la
 * negación) y las cantidades (beaucoup de, un peu de, une bouteille de). Pronunciación: vocales nasales
 * (pain, vin, viande, poisson) y eau que suena como una o. Géneros distintos: le lait, l'eau (f).
 * Falsos amigos: le poisson (pescado), les légumes (verduras). Cultura: un café es un espresso; la
 * carafe d'eau es gratis.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CAFE = dialogue(
  'fr.stim.a1-u7-cafe',
  'Thomas está con una amiga en un café de París y pide a la mesera.',
  [
    ['Serveuse', "Bonjour, monsieur. Qu'est-ce que vous prenez?"],
    ['Thomas', "Bonjour! Je voudrais un café et un croissant, s'il vous plaît."],
    ['Serveuse', 'Et pour madame?'],
    ['Thomas', "Un thé avec un peu de lait. Et une carafe d'eau, s'il vous plaît."],
    ['Serveuse', 'Très bien, monsieur.'],
  ],
  FR_A1_RATE,
);

const MENU = reading(
  'fr.stim.a1-u7-menu',
  'menu',
  'La carta de un café de barrio.',
  [
    'Café: deux euros',
    'Thé: trois euros',
    'Croissant: deux euros',
    'Pain et fromage: six euros',
    'Poisson et légumes: douze euros',
    'Vin rouge: cinq euros',
    "Carafe d'eau: gratuite",
  ],
  { title: 'Le petit café' },
);

export const FR_A1_U07: FrUnitDef = {
  names: ['Thomas', 'Paris'],
  support: ['bouteille', 'avec', 'prenez', 'pour', 'très', 'carafe', 'gratuite'],
  unit: {
    position: 7,
    title: 'Comer y beber',
    titleEn: 'Manger et boire',
    description:
      "Comida y bebida, je voudrais y je prends en el café, los partitivos (du pain, de la viande, de l'eau, des légumes), pas de y las cantidades (beaucoup de, un peu de). Vocales nasales.",
    emoji: '🥐',
    objective:
      'Podés pedir algo de comer y de tomar en un café, decir qué comés y qué no, y hablar de cantidades.',
    grammar: {
      title: 'Los partitivos · pas de · beaucoup de, un peu de',
      explanation:
        "Para algo que no se cuenta, el francés usa el partitivo, que en español no se dice: du (masculino), de la (femenino), de l' (delante de vocal) y des (plural). Je mange du pain (como pan), je bois de l'eau (tomo agua), je mange des légumes. En la negación y después de una cantidad queda sólo de (d' delante de vocal): je ne bois pas de café, beaucoup de fromage, un peu de lait, une bouteille d'eau. Para pedir con cortesía: je voudrais (quisiera) + un / une: je voudrais un café, s'il vous plaît.",
      examples: [
        { target: 'Je mange du pain et de la viande.', base: 'Como pan y carne.' },
        { target: 'Je ne bois pas de café.', base: 'No tomo café.' },
        { target: "Un peu de lait, s'il vous plaît.", base: 'Un poco de leche, por favor.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U7). Sin revisión nativa: revisar «tomo» como traducción de je prends (en el Río de la Plata también es beber), el menú con «gratuite» y el registro de la mesera.',
    },
    words: [
      w('fr-le-pain', 'le pain', 'el pan', 'Je mange du pain.', 'Como pan.', ['food', 'm'], {
        emoji: '🥖',
      }),
      w(
        'fr-le-cafe',
        'le café',
        'el café',
        "Je voudrais un café, s'il vous plaît.",
        'Quisiera un café, por favor.',
        ['drinks', 'm'],
        { emoji: '☕' },
      ),
      w('fr-le-the', 'le thé', 'el té', 'Je bois du thé.', 'Tomo té.', ['drinks', 'm'], {
        emoji: '🍵',
      }),
      w(
        'fr-le-lait',
        'le lait',
        'la leche',
        'Un café avec du lait.',
        'Un café con leche.',
        ['drinks', 'm'],
        { emoji: '🥛' },
      ),
      w('fr-l-eau', "l'eau", 'el agua', "Je bois de l'eau.", 'Tomo agua.', ['drinks', 'f'], {
        acceptedTexts: ["l'eau"],
        emoji: '💧',
      }),
      w(
        'fr-le-fromage',
        'le fromage',
        'el queso',
        'Il y a beaucoup de fromage.',
        'Hay mucho queso.',
        ['food', 'm'],
        { emoji: '🧀' },
      ),
      w(
        'fr-le-croissant',
        'le croissant',
        'la medialuna',
        'Je prends un croissant.',
        'Pido una medialuna.',
        ['food', 'm'],
        { acceptedTranslations: ['el cruasán'], emoji: '🥐' },
      ),
      w(
        'fr-la-pomme',
        'la pomme',
        'la manzana',
        'Je mange une pomme.',
        'Como una manzana.',
        ['food', 'f'],
        { emoji: '🍎' },
      ),
      w(
        'fr-le-vin',
        'le vin',
        'el vino',
        'Je ne bois pas de vin.',
        'No tomo vino.',
        ['drinks', 'm'],
        {
          emoji: '🍷',
        },
      ),
      w(
        'fr-la-viande',
        'la viande',
        'la carne',
        'Je ne mange pas de viande.',
        'No como carne.',
        ['food', 'f'],
        { emoji: '🥩' },
      ),
      w(
        'fr-le-poisson',
        'le poisson',
        'el pescado',
        'Je voudrais du poisson.',
        'Quisiera pescado.',
        ['food', 'm'],
        { emoji: '🐟' },
      ),
      w(
        'fr-les-legumes',
        'les légumes',
        'las verduras',
        'Je mange des légumes.',
        'Como verduras.',
        ['food'],
        { emoji: '🥦' },
      ),
      w(
        'fr-je-voudrais',
        'je voudrais',
        'quisiera',
        "Je voudrais un thé, s'il vous plaît.",
        'Quisiera un té, por favor.',
        ['courtesy', 'verbs'],
        { acceptedTranslations: ['querría'] },
      ),
      w('fr-je-prends', 'je prends', 'tomo', 'Je prends un café.', 'Tomo un café.', ['verbs'], {
        acceptedTranslations: ['pido'],
      }),
      w('fr-je-mange', 'je mange', 'como', 'Je mange du fromage.', 'Como queso.', ['verbs'], {
        acceptedTranslations: ['yo como'],
      }),
      w('fr-je-bois', 'je bois', 'bebo', 'Je bois du lait.', 'Tomo leche.', ['verbs']),
      w(
        'fr-beaucoup-de',
        'beaucoup de',
        'mucho',
        'Je mange beaucoup de légumes.',
        'Como muchas verduras.',
        ['quantity'],
        { acceptedTranslations: ['mucha', 'muchos', 'muchas'] },
      ),
      w(
        'fr-un-peu-de',
        'un peu de',
        'un poco de',
        "Un peu de lait, s'il vous plaît.",
        'Un poco de leche, por favor.',
        ['quantity'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Au café',
        objective: 'Pedir algo en un café con je voudrais.',
        intro: {
          explanation:
            "Para pedir con cortesía se usa je voudrais (quisiera) + un / une, y siempre s'il vous plaît. En Francia, un café es un espresso chico; le croissant es la medialuna. Pronunciación: en pain y en croissant la n no suena como n: la vocal sale por la nariz (es una vocal nasal).",
          examples: [
            {
              target: "Je voudrais un café, s'il vous plaît.",
              base: 'Quisiera un café, por favor.',
            },
            {
              target: "Un thé et un croissant, s'il vous plaît.",
              base: 'Un té y una medialuna, por favor.',
            },
          ],
        },
        takeaways: [
          "Pedís con je voudrais y s'il vous plaît.",
          'Nombrás el café, el té, el pan y la medialuna.',
        ],
        exercises: [
          ex.imageChoice('☕', 'le café', ['le thé', 'le pain', 'le croissant'], ['fr-le-cafe'], {
            id: 'fr.ex.dq4bh9by2qzaer',
          }),
          ex.translationChoice(
            'le croissant',
            'la medialuna',
            ['el pan', 'el té', 'el café'],
            ['fr-le-croissant'],
            { id: 'fr.ex.gdyaaak04kbnag' },
          ),
          ex.matchPairs(
            [
              ['le café', 'el café'],
              ['le thé', 'el té'],
              ['le pain', 'el pan'],
              ['le croissant', 'la medialuna'],
            ],
            ['fr-le-cafe', 'fr-le-the', 'fr-le-pain', 'fr-le-croissant'],
            { id: 'fr.ex.2req414my3upwy' },
          ),
          ex.listenChoice(
            "Je voudrais un thé, s'il vous plaît.",
            [
              "Je voudrais un café, s'il vous plaît.",
              "Je voudrais un croissant, s'il vous plaît.",
              'Un thé, merci.',
            ],
            ['fr-je-voudrais', 'fr-le-the'],
            { id: 'fr.ex.0tf5ma6udw6oju' },
          ),
          ex.translationChoice(
            'je voudrais',
            'quisiera',
            ['tengo', 'soy', 'hablo'],
            ['fr-je-voudrais'],
            { id: 'fr.ex.h1eyq1oyubgk1o' },
          ),
          ex.fillBlank(
            "Je ___ un croissant, s'il vous plaît.",
            'Quisiera una medialuna, por favor.',
            'voudrais',
            ['suis', 'habite', 'parle'],
            ['fr-je-voudrais', 'fr-le-croissant'],
            { id: 'fr.ex.dd0v1oynaa66mn', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "Je voudrais ___ café, s'il vous plaît.",
            'Quisiera un café, por favor.',
            'un',
            ['une', 'la', 'des'],
            ['fr-le-cafe', 'fr-je-voudrais'],
            {
              id: 'fr.ex.k45x5mlbwf0f15',
              explanation: 'Café es masculino y es uno solo: un café.',
            },
          ),
          ex.orderWords('Je voudrais un thé.', 'Quisiera un té.', ['fr-je-voudrais', 'fr-le-the'], {
            id: 'fr.ex.tr9jy09bfbwptp',
          }),
          ex.translateWrite(
            'Quisiera un café, por favor.',
            "Je voudrais un café, s'il vous plaît.",
            ['fr-je-voudrais', 'fr-le-cafe'],
            { id: 'fr.ex.vhqfs6kiwuttyh' },
          ),
          ex.shortAnswer(
            'Bonjour, madame! Un café?',
            '¡Buen día, señora! ¿Un café? (Respondé que no, que querés un té, por favor.)',
            "Non, merci. Je voudrais un thé, s'il vous plaît.",
            [
              "Non, je voudrais un thé, s'il vous plaît.",
              "Non merci, je voudrais un thé, s'il vous plaît.",
              "Je voudrais un thé, s'il vous plaît.",
            ],
            ['fr-je-voudrais', 'fr-le-the'],
            { id: 'fr.ex.azjghlgl3omp1y' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Je mange, je bois',
        objective: "Decir qué comés y qué tomás con du, de la y de l'.",
        intro: {
          explanation:
            "Para una cantidad que no se cuenta (pan, agua, queso) el francés usa el partitivo: du con masculinos, de la con femeninos y de l' delante de vocal. En español no se dice nada («como queso»), pero en francés hace falta: je mange du fromage. Con algo que se cuenta, un / une: je mange une pomme. Ojo con el género: l'eau es femenino y le lait, masculino (la leche). Eau suena como una o.",
          examples: [
            { target: "Je bois de l'eau.", base: 'Tomo agua.' },
            { target: 'Je mange du fromage.', base: 'Como queso.' },
          ],
        },
        takeaways: [
          "Usás du, de la o de l' con lo que no se cuenta.",
          'Decís qué comés con je mange y qué tomás con je bois.',
        ],
        exercises: [
          ex.translationChoice(
            'le lait',
            'la leche',
            ['el agua', 'el queso', 'el té'],
            ['fr-le-lait'],
            {
              id: 'fr.ex.j15bxojqdknhzv',
              explanation: 'Lait es masculino en francés: le lait, du lait.',
            },
          ),
          ex.imageChoice('🍎', 'la pomme', ['le fromage', 'le pain', 'le lait'], ['fr-la-pomme'], {
            id: 'fr.ex.qgwjc4pxvpzva7',
          }),
          ex.matchPairs(
            [
              ["l'eau", 'el agua'],
              ['le lait', 'la leche'],
              ['le fromage', 'el queso'],
              ['la pomme', 'la manzana'],
            ],
            ['fr-l-eau', 'fr-le-lait', 'fr-le-fromage', 'fr-la-pomme'],
            { id: 'fr.ex.fqdorz8h6ddjuv' },
          ),
          ex.listenChoice(
            "Je bois de l'eau.",
            ['Je bois du lait.', 'Je mange du pain.', 'Je bois du thé.'],
            ['fr-je-bois', 'fr-l-eau'],
            {
              id: 'fr.ex.n6khx4aj3fsi16',
              explanation: "Eau se pronuncia como una o: de l'eau.",
            },
          ),
          ex.fillBlank(
            'Je mange ___ fromage.',
            'Como queso.',
            'du',
            ['de la', 'des', 'une'],
            ['fr-je-mange', 'fr-le-fromage'],
            {
              id: 'fr.ex.0gfi7bxykqlalw',
              explanation: 'Fromage es masculino y no se cuenta: du fromage.',
            },
          ),
          ex.fillBlank(
            'Tu bois ___ lait?',
            '¿Tomás leche?',
            'du',
            ['de la', 'une', 'des'],
            ['fr-le-lait', 'fr-je-bois'],
            {
              id: 'fr.ex.y246dlosvceaqh',
              explanation: 'Lait es masculino (le lait): du lait, aunque en español sea la leche.',
            },
          ),
          ex.translationChoice('je bois', 'bebo', ['como', 'quisiera', 'hablo'], ['fr-je-bois'], {
            id: 'fr.ex.japii24czatw3f',
          }),
          ex.fillBlank(
            'Je ___ une pomme.',
            'Como una manzana.',
            'mange',
            ['bois', 'suis', 'parle'],
            ['fr-je-mange', 'fr-la-pomme'],
            { id: 'fr.ex.tthbr68r33tm62', skill: 'vocabulary' },
          ),
          ex.translateWrite(
            'Como pan y queso.',
            'Je mange du pain et du fromage.',
            ['fr-je-mange', 'fr-le-pain', 'fr-le-fromage'],
            { id: 'fr.ex.bs41h0pel0hike' },
          ),
          ex.translateWrite('Bebo agua.', "Je bois de l'eau.", ['fr-je-bois', 'fr-l-eau'], {
            id: 'fr.ex.re9vkxlgqoo85s',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Viande, poisson, légumes',
        objective: 'Hablar de carne, pescado y verduras, y decir qué no comés.',
        intro: {
          explanation:
            "En plural el partitivo es des: je mange des légumes. En la negación, du / de la / de l' / des pasan a de: je ne mange pas de viande, je ne bois pas de vin. Dos falsos amigos: le poisson es el pescado y les légumes son las verduras (no las legumbres). Vin, viande y pain tienen vocales nasales: la n no se pronuncia como n.",
          examples: [
            { target: 'Je mange des légumes.', base: 'Como verduras.' },
            { target: 'Je ne mange pas de viande.', base: 'No como carne.' },
          ],
        },
        takeaways: [
          'Usás des con los plurales: des légumes.',
          'Decís qué no comés con ne… pas de.',
        ],
        exercises: [
          ex.translationChoice(
            'le poisson',
            'el pescado',
            ['el veneno', 'la carne', 'las verduras'],
            ['fr-le-poisson'],
            {
              id: 'fr.ex.2m5uwe98a9vtvc',
              explanation: 'Falso amigo: le poisson es el pescado.',
            },
          ),
          ex.translationChoice(
            'les légumes',
            'las verduras',
            ['las legumbres', 'la carne', 'el vino'],
            ['fr-les-legumes'],
            {
              id: 'fr.ex.noxgnupe11k3dx',
              explanation: 'Falso amigo: les légumes son las verduras en general.',
            },
          ),
          ex.matchPairs(
            [
              ['la viande', 'la carne'],
              ['le poisson', 'el pescado'],
              ['les légumes', 'las verduras'],
              ['le vin', 'el vino'],
            ],
            ['fr-la-viande', 'fr-le-poisson', 'fr-les-legumes', 'fr-le-vin'],
            { id: 'fr.ex.f5w4iq29x9ztyw' },
          ),
          ex.listenChoice(
            'Je voudrais du vin.',
            ['Je voudrais du pain.', 'Je voudrais de la viande.', 'Je voudrais des légumes.'],
            ['fr-le-vin', 'fr-je-voudrais'],
            {
              id: 'fr.ex.opjmfsvwbw762a',
              explanation:
                'Vin y pain tienen la misma vocal nasal: cambia sólo la primera consonante.',
            },
          ),
          ex.fillBlank(
            'Je mange ___ légumes.',
            'Como verduras.',
            'des',
            ['du', 'de la', 'une'],
            ['fr-les-legumes', 'fr-je-mange'],
            {
              id: 'fr.ex.7wlzele1l86epn',
              explanation: 'Légumes es plural: des légumes.',
            },
          ),
          ex.fillBlank(
            'Je ne mange pas ___ viande.',
            'No como carne.',
            'de',
            ['de la', 'la', 'une'],
            ['fr-la-viande', 'fr-je-mange'],
            {
              id: 'fr.ex.uqqubnq2bl1wed',
              explanation: 'En la negación, de la pasa a de: je ne mange pas de viande.',
            },
          ),
          ex.imageChoice(
            '🐟',
            'le poisson',
            ['la viande', 'le vin', 'les légumes'],
            ['fr-le-poisson'],
            {
              id: 'fr.ex.z7q0tqx9zk36ft',
            },
          ),
          ex.orderWords('Je ne bois pas de vin.', 'No tomo vino.', ['fr-le-vin', 'fr-je-bois'], {
            id: 'fr.ex.nbntox04tqvisc',
          }),
          ex.translateWrite(
            'Como pescado y verduras.',
            'Je mange du poisson et des légumes.',
            ['fr-je-mange', 'fr-le-poisson', 'fr-les-legumes'],
            { id: 'fr.ex.nj1z1cde97rlg0' },
          ),
          ex.shortAnswer(
            'Tu manges de la viande?',
            '¿Comés carne? (Respondé que no, que no comés carne.)',
            'Non, je ne mange pas de viande.',
            ['Je ne mange pas de viande.', 'Non, je ne mange pas de viande!'],
            ['fr-la-viande', 'fr-je-mange'],
            { id: 'fr.ex.8nltwgu7t6u2s2' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Beaucoup, un peu',
        objective: 'Pedir con je prends y hablar de cantidades.',
        intro: {
          explanation:
            "Después de una cantidad el artículo desaparece y queda de (d' delante de vocal): beaucoup de légumes, un peu de lait, une bouteille d'eau. Je prends (tomo, pido) sirve para pedir en un café, igual que je voudrais pero más directo. La d de prends no suena.",
          examples: [
            {
              target: 'Je prends un thé avec un peu de lait.',
              base: 'Tomo un té con un poco de leche.',
            },
            {
              target: "Une bouteille d'eau, s'il vous plaît.",
              base: 'Una botella de agua, por favor.',
            },
          ],
        },
        takeaways: [
          'Usás beaucoup de y un peu de sin artículo.',
          'Pedís en un café con je prends o je voudrais.',
        ],
        exercises: [
          ex.translationChoice(
            'je prends',
            'tomo',
            ['bebo', 'como', 'quisiera'],
            ['fr-je-prends'],
            {
              id: 'fr.ex.lfyf8n4q13tt3i',
            },
          ),
          ex.matchPairs(
            [
              ['beaucoup de', 'mucho'],
              ['un peu de', 'un poco de'],
              ['je prends', 'tomo'],
              ['je mange', 'como'],
            ],
            ['fr-beaucoup-de', 'fr-un-peu-de', 'fr-je-prends', 'fr-je-mange'],
            { id: 'fr.ex.0md4lim642njmw' },
          ),
          ex.fillBlank(
            'Je mange beaucoup ___ légumes.',
            'Como muchas verduras.',
            'de',
            ['des', 'du', 'les'],
            ['fr-beaucoup-de', 'fr-les-legumes'],
            {
              id: 'fr.ex.n7i3eu3d6orego',
              explanation: 'Después de beaucoup va sólo de, sin artículo: beaucoup de légumes.',
            },
          ),
          ex.listenChoice(
            "Un peu de lait, s'il vous plaît.",
            [
              "Beaucoup de lait, s'il vous plaît.",
              "Un peu de thé, s'il vous plaît.",
              "Du lait, s'il vous plaît.",
            ],
            ['fr-un-peu-de', 'fr-le-lait'],
            { id: 'fr.ex.m8en1xynwu21q7' },
          ),
          ex.fillBlank(
            "Une bouteille de ___, s'il vous plaît.",
            'Una botella de vino, por favor.',
            'vin',
            ['viande', 'pain', 'fromage'],
            ['fr-le-vin'],
            { id: 'fr.ex.sel8mv3f2aicdz', skill: 'vocabulary' },
          ),
          question(
            'fr.ex.f73lmrh37f78ge',
            CAFE,
            '¿Qué pide Thomas para él?',
            'Un café y una medialuna.',
            ['Un té y una medialuna.', 'Un café con leche.', 'Pan y queso.'],
            ['fr-je-voudrais', 'fr-le-cafe', 'fr-le-croissant'],
            "Thomas dice «Je voudrais un café et un croissant, s'il vous plaît».",
          ),
          question(
            'fr.ex.8pskebg9q3168h',
            CAFE,
            '¿Qué pide Thomas para su amiga?',
            'Un té con un poco de leche.',
            ['Un té con mucha leche.', 'Un café con leche.', 'Una copa de vino.'],
            ['fr-le-the', 'fr-un-peu-de', 'fr-le-lait'],
            'A «Et pour madame?», Thomas responde «Un thé avec un peu de lait».',
          ),
          ex.fillBlank(
            'Je ___ un croissant et un café.',
            'Pido una medialuna y un café.',
            'prends',
            ['mange', 'bois', 'suis'],
            ['fr-je-prends', 'fr-le-croissant'],
            {
              id: 'fr.ex.ce8mh9eah40ixt',
              skill: 'vocabulary',
              explanation: 'Para pedir comida y bebida juntas: je prends.',
            },
          ),
          ex.translateWrite(
            'Tomo un té con un poco de leche.',
            'Je prends un thé avec un peu de lait.',
            ['fr-je-prends', 'fr-un-peu-de', 'fr-le-the', 'fr-le-lait'],
            {
              id: 'fr.ex.0ih799stjwr0fh',
              acceptedAnswers: ['Je bois un thé avec un peu de lait.'],
            },
          ),
          ex.translateWrite(
            'Como mucho queso.',
            'Je mange beaucoup de fromage.',
            ['fr-je-mange', 'fr-beaucoup-de', 'fr-le-fromage'],
            { id: 'fr.ex.gi7zqrik9uzbuj' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Le petit café',
        objective: 'Leer una carta y pedir comida y bebida en un café.',
        intro: {
          explanation:
            "En un café o un restaurante de Francia se pide con je voudrais o je prends, y siempre con s'il vous plaît. Un dato cultural: la carafe d'eau (una jarra de agua de la canilla) es gratis; si querés agua mineral, pedís une bouteille d'eau.",
          examples: [
            { target: 'Je prends du poisson et des légumes.', base: 'Pido pescado y verduras.' },
            { target: "Une carafe d'eau, s'il vous plaît.", base: 'Una jarra de agua, por favor.' },
          ],
        },
        takeaways: ['Entendés una carta con precios.', 'Pedís comida y bebida en un café.'],
        exercises: [
          question(
            'fr.ex.k8xeulx3aofdit',
            MENU,
            '¿Cuánto cuesta un café?',
            'Dos euros.',
            ['Tres euros.', 'Cinco euros.', 'Doce euros.'],
            ['fr-le-cafe'],
            'La carta dice «Café: deux euros»; el té cuesta tres.',
          ),
          question(
            'fr.ex.zj6w254auwk6iq',
            MENU,
            '¿Qué plato viene con verduras?',
            'El pescado.',
            ['El pan con queso.', 'La carne.', 'La medialuna.'],
            ['fr-le-poisson', 'fr-les-legumes'],
            'La carta dice «Poisson et légumes: douze euros».',
          ),
          question(
            'fr.ex.xb1nx34vigdnhc',
            MENU,
            '¿Cuánto cuesta la jarra de agua?',
            'Nada: es gratis.',
            ['Dos euros.', 'Cinco euros.', 'No hay agua.'],
            ['fr-l-eau'],
            "La carta dice «Carafe d'eau: gratuite».",
          ),
          question(
            'fr.ex.ihv595gjgiqk4y',
            CAFE,
            '¿Qué más pide Thomas al final?',
            'Una jarra de agua.',
            ['Una botella de vino.', 'Otro café.', 'Una manzana.'],
            ['fr-l-eau'],
            "Thomas termina con «Et une carafe d'eau, s'il vous plaît».",
          ),
          ex.listenChoice(
            'Je ne bois pas de café.',
            ['Je bois du café.', 'Je ne bois pas de thé.', 'Je ne mange pas de pain.'],
            ['fr-je-bois', 'fr-le-cafe'],
            { id: 'fr.ex.ys2et5p67wd4uo' },
          ),
          ex.fillBlank(
            'Je mange ___ pomme.',
            'Como una manzana.',
            'une',
            ['un', 'du', 'des'],
            ['fr-la-pomme', 'fr-je-mange'],
            {
              id: 'fr.ex.0kc0plqmyfyur0',
              explanation: 'Una manzana se cuenta y pomme es femenino: une pomme.',
            },
          ),
          ex.orderWords(
            'Je prends du poisson et des légumes.',
            'Pido pescado y verduras.',
            ['fr-je-prends', 'fr-le-poisson', 'fr-les-legumes'],
            { id: 'fr.ex.iw7ytfbysijuqa' },
          ),
          ex.translationChoice(
            'un peu de',
            'un poco de',
            ['mucho', 'una botella de', 'nada de'],
            ['fr-un-peu-de'],
            { id: 'fr.ex.8bek2p7bedzslo' },
          ),
          ex.translateWrite(
            'Quisiera una botella de agua, por favor.',
            "Je voudrais une bouteille d'eau, s'il vous plaît.",
            ['fr-je-voudrais', 'fr-l-eau'],
            { id: 'fr.ex.wlz8k9phcm5s4l' },
          ),
          ex.shortAnswer(
            "Qu'est-ce que vous prenez?",
            '¿Qué va a tomar? (Pedí un café y una medialuna.)',
            "Je prends un café et un croissant, s'il vous plaît.",
            [
              "Je voudrais un café et un croissant, s'il vous plaît.",
              "Un café et un croissant, s'il vous plaît.",
              'Je prends un café et un croissant.',
            ],
            ['fr-je-prends', 'fr-le-cafe', 'fr-le-croissant'],
            { id: 'fr.ex.nnxl9xuluypnw0' },
          ),
        ],
      },
    ],
  },
};

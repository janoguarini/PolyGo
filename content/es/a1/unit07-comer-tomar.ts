import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U7 «Food and drinks» (docs/ES_A1_A2.md), en español neutro de Latinoamérica (tú y
 * ustedes): pedir en un café o en una panadería con quiero, quisiera (más cortés) y ¿me das…? (informal);
 * decir qué comes y qué tomas (yo como / tú comes; tomo / tú tomas; bebo / tú bebes: tomar es lo más
 * común en Latinoamérica para las bebidas y beber se entiende en todas partes); quiero / quieres (e → ie);
 * el mesero trata de usted (¿qué quiere tomar?). Cantidades con mucho / mucha y un poco de. El agua es
 * femenina pero lleva el. Sin artículo partitivo: quiero pan, no como carne.
 * Pronunciación: la g suave de agua frente a la j fuerte de jugo; la ch de leche.
 * Cultura: desayunos distintos según el país (huevos, arepas, pan dulce, café con leche); el mate del
 * Cono Sur, sólo como nota cultural; el asado.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CAFE = dialogue(
  'es.stim.a1-u7-cafe',
  'A customer orders at a café in Bogotá. The waiter speaks to her formally.',
  [
    ['Mesero', 'Buenas tardes. ¿Qué quiere tomar?'],
    ['Camila', 'Quisiera un café con leche, por favor.'],
    ['Mesero', 'Muy bien. ¿Y para comer?'],
    ['Camila', 'Dos croissants. Y un poco de agua, por favor.'],
    ['Mesero', '¡Muy bien!'],
  ],
  ES_A1_RATE,
);

const MENU = reading(
  'es.stim.a1-u7-menu',
  'menu',
  'The breakfast menu of a café in Lima.',
  [
    'Café con leche y dos croissants',
    'Té con leche y pan con queso',
    'Una manzana y un jugo',
    'El agua es gratis.',
  ],
  { title: 'Desayuno' },
);

export const ES_A1_U07: EsUnitDef = {
  names: ['Camila'],
  support: [
    'comes',
    'quieres',
    'quiere',
    'tomas',
    'das',
    'para',
    'comer',
    'tomar',
    'desayuno',
    'gratis',
  ],
  unit: {
    position: 7,
    title: 'Food and drinks',
    titleEn: 'Comer y tomar',
    description:
      'Order in a café or a bakery with quiero, quisiera and ¿me das…?, say what you eat and drink, and talk about quantities with mucho and un poco de.',
    emoji: '🥐',
    objective:
      'You can order food and drinks politely, say what you eat and drink, and ask for a lot or a little of something.',
    grammar: {
      title: 'Quiero / quisiera · como, tomo · mucho, un poco de',
      explanation:
        'To order: quiero (I want) is direct; quisiera (I would like) is more polite, and among friends people say ¿me das…? (can you give me…?). To ask a friend, use the tú form: ¿qué quieres? Querer changes its stem: yo quiero, tú quieres (e → ie). A waiter speaks to you with usted: ¿qué quiere? To eat is comer: yo como, tú comes. To drink you can say tomar (yo tomo, tú tomas) or beber (yo bebo, tú bebes). Both are understood everywhere; in Latin America tomar is the everyday choice for drinks: tomo café, ¿tomas té? Spanish has no word for “some”: quiero pan, no como carne. Mucho agrees with the noun (mucho café, mucha leche), while un poco de never changes (un poco de agua). Agua is feminine, but because it starts with a stressed a it takes el: el agua.',
      examples: [
        {
          target: 'Quisiera un café con leche, por favor.',
          base: 'I’d like a coffee with milk, please.',
        },
        { target: 'Yo como carne. ¿Tú comes pescado?', base: 'I eat meat. Do you eat fish?' },
        {
          target: '¿Tomas café? — No, bebo un poco de té.',
          base: 'Do you drink coffee? — No, I drink a little tea.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U7). Convertido al español neutro de Latinoamérica (tú y ustedes) el 2026-11-21. Sin revisión nativa. Revisar: «el croissant» en lugar de «la medialuna» (se aceptan medialuna, cruasán y cuernito); «el jugo» reemplaza a «el mate» como palabra (el mate queda como nota cultural; «zumo», de España, se acepta); tomar como verbo cotidiano para beber y beber presentado como alternativa general; el mesero trata de usted a la clienta; «quisiera» enseñado como fórmula fija sin explicar el subjuntivo; «la carne» aceptada como «beef»; «¿me das…?» como pedido informal.',
    },
    words: [
      w(
        'es-el-pan',
        'el pan',
        'the bread',
        'Quiero pan con queso.',
        'I want bread with cheese.',
        ['food'],
        {
          acceptedTranslations: ['bread'],
          emoji: '🍞',
        },
      ),
      w(
        'es-el-cafe',
        'el café',
        'the coffee',
        'Un café con leche, por favor.',
        'A coffee with milk, please.',
        ['drinks'],
        { acceptedTranslations: ['coffee'], emoji: '☕' },
      ),
      w(
        'es-el-te',
        'el té',
        'the tea',
        'Tomo té con leche.',
        'I drink tea with milk.',
        ['drinks'],
        {
          acceptedTranslations: ['tea'],
          emoji: '🫖',
        },
      ),
      w(
        'es-la-leche',
        'la leche',
        'the milk',
        'Un poco de leche, por favor.',
        'A little milk, please.',
        ['drinks'],
        {
          acceptedTranslations: ['milk'],
          emoji: '🥛',
        },
      ),
      w(
        'es-el-agua',
        'el agua',
        'the water',
        'Quisiera agua, por favor.',
        'I’d like some water, please.',
        ['drinks'],
        {
          acceptedTranslations: ['water'],
          emoji: '💧',
        },
      ),
      w('es-el-queso', 'el queso', 'the cheese', 'Pan con queso.', 'Bread with cheese.', ['food'], {
        acceptedTranslations: ['cheese'],
        emoji: '🧀',
      }),
      w(
        'es-el-croissant',
        'el croissant',
        'the croissant',
        'Un café con leche y dos croissants.',
        'A coffee with milk and two croissants.',
        ['food'],
        {
          acceptedTranslations: ['croissant'],
          acceptedTexts: ['el cruasán', 'la medialuna', 'el cuernito'],
          emoji: '🥐',
        },
      ),
      w(
        'es-la-manzana',
        'la manzana',
        'the apple',
        'Como una manzana.',
        'I eat an apple.',
        ['food'],
        { acceptedTranslations: ['apple'], emoji: '🍎' },
      ),
      w(
        'es-el-vino',
        'el vino',
        'the wine',
        'Tomo un poco de vino.',
        'I drink a little wine.',
        ['drinks'],
        {
          acceptedTranslations: ['wine'],
          emoji: '🍷',
        },
      ),
      w(
        'es-la-carne',
        'la carne',
        'the meat',
        'Yo como mucha carne.',
        'I eat a lot of meat.',
        ['food'],
        {
          acceptedTranslations: ['meat', 'beef'],
          emoji: '🥩',
        },
      ),
      w(
        'es-el-pescado',
        'el pescado',
        'the fish (to eat)',
        'No como pescado.',
        'I don’t eat fish.',
        ['food'],
        { acceptedTranslations: ['fish'], emoji: '🐟' },
      ),
      w(
        'es-las-verduras',
        'las verduras',
        'the vegetables',
        'Como carne y verduras.',
        'I eat meat and vegetables.',
        ['food'],
        { acceptedTranslations: ['vegetables'], emoji: '🥦' },
      ),
      w('es-quiero', 'quiero', 'I want', 'Quiero un té, por favor.', 'I want a tea, please.', [
        'verbs',
      ]),
      w(
        'es-quisiera',
        'quisiera',
        "I'd like",
        'Quisiera un café, por favor.',
        'I’d like a coffee, please.',
        ['verbs', 'courtesy'],
        { acceptedTranslations: ['I would like'] },
      ),
      w('es-yo-como', 'yo como', 'I eat', 'Yo como pan y queso.', 'I eat bread and cheese.', [
        'verbs',
      ]),
      w('es-tomo', 'tomo', 'I drink', 'Tomo mucho café.', 'I drink a lot of coffee.', ['verbs'], {
        acceptedTexts: ['bebo'],
      }),
      w(
        'es-un-poco-de',
        'un poco de',
        'a little',
        'Un poco de agua, por favor.',
        'A little water, please.',
        ['quantities'],
        { acceptedTranslations: ['a bit of'] },
      ),
      w(
        'es-mucho',
        'mucho',
        'a lot of',
        'Como mucho pan.',
        'I eat a lot of bread.',
        ['quantities'],
        {
          acceptedTranslations: ['much', 'many'],
          acceptedTexts: ['mucha', 'muchos', 'muchas'],
        },
      ),
      w(
        'es-el-jugo',
        'el jugo',
        'the juice',
        '¿Tomas jugo? — Sí, gracias.',
        'Do you drink juice? — Yes, thanks.',
        ['drinks'],
        { acceptedTranslations: ['juice'], acceptedTexts: ['el zumo'], emoji: '🧃' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Café con leche',
        objective: 'Name breakfast foods and drinks and ask for them.',
        intro: {
          explanation:
            'Breakfast changes from country to country: eggs and pan dulce in Mexico, arepas in Colombia, café con leche (coffee with milk) and a croissant in cafés almost everywhere. Con means with. Agua is feminine, but because it starts with a stressed a it takes el: el agua. The g in agua is soft, much softer than the English g, and the ch in leche sounds like the ch in chair.',
          examples: [
            { target: 'Un café con leche, por favor.', base: 'A coffee with milk, please.' },
            { target: 'Té con leche y pan.', base: 'Tea with milk and bread.' },
          ],
        },
        takeaways: [
          'You ask for breakfast with por favor: un café con leche, por favor.',
          'You say el agua, even though agua is feminine.',
        ],
        exercises: [
          ex.translationChoice(
            'el pan',
            'the bread',
            ['the milk', 'the coffee', 'the water'],
            ['es-el-pan'],
            { id: 'es.ex.ocacfhgfapeydo' },
          ),
          ex.translationChoice(
            'el croissant',
            'the croissant',
            ['the bread', 'the milk', 'the tea'],
            ['es-el-croissant'],
            { id: 'es.ex.8f5wqm8n86atk3' },
          ),
          ex.matchPairs(
            [
              ['el café', 'the coffee'],
              ['el té', 'the tea'],
              ['la leche', 'the milk'],
              ['el agua', 'the water'],
            ],
            ['es-el-cafe', 'es-el-te', 'es-la-leche', 'es-el-agua'],
            { id: 'es.ex.x4oag6fsr7qkyp' },
          ),
          ex.listenChoice(
            'Un café con leche, por favor.',
            ['Un té con leche, por favor.', 'Un café, por favor.', 'Pan con leche, por favor.'],
            ['es-el-cafe', 'es-la-leche'],
            { id: 'es.ex.aa9b804kj1eif2' },
          ),
          ex.fillBlank(
            '___ agua, por favor.',
            'The water, please.',
            'El',
            ['La', 'Los', 'Las'],
            ['es-el-agua'],
            {
              id: 'es.ex.m7kyc93wnodhbq',
              skill: 'grammar',
              explanation:
                'Agua is feminine, but it starts with a stressed a, so in the singular it takes el: el agua.',
            },
          ),
          ex.fillBlank(
            'Un café con ___.',
            'A coffee with milk.',
            'leche',
            ['pan', 'croissant', 'agua'],
            ['es-la-leche', 'es-el-cafe'],
            {
              id: 'es.ex.v5ncnlws5z2h7t',
              skill: 'vocabulary',
              explanation:
                'Café con leche is coffee with milk, a classic breakfast drink all over the Spanish-speaking world.',
            },
          ),
          ex.orderWords(
            'Tengo pan y leche.',
            'I have bread and milk.',
            ['es-el-pan', 'es-la-leche'],
            {
              id: 'es.ex.mbdhms7fo3qjjc',
            },
          ),
          ex.listenChoice(
            'Dos croissants, por favor.',
            ['Tres croissants, por favor.', 'Doce croissants, por favor.', 'Dos cafés, por favor.'],
            ['es-el-croissant'],
            { id: 'es.ex.nrgww3s7ggew0s' },
          ),
          ex.translateWrite(
            'A tea with milk, please.',
            'Un té con leche, por favor.',
            ['es-el-te', 'es-la-leche'],
            { id: 'es.ex.ugdtxekse7qdj3', acceptedAnswers: ['Té con leche, por favor.'] },
          ),
          ex.translateWrite(
            'Two croissants and a coffee, please.',
            'Dos croissants y un café, por favor.',
            ['es-el-croissant', 'es-el-cafe'],
            {
              id: 'es.ex.itzwh60r0sxwbn',
              acceptedAnswers: [
                'Dos medialunas y un café, por favor.',
                'Dos cruasanes y un café, por favor.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Yo como carne',
        objective: 'Say what you eat and ask what someone else eats.',
        intro: {
          explanation:
            'To say what you eat: yo como; to ask a friend: ¿tú comes…? The -o of yo becomes -es for tú: como, comes. You can usually drop tú, because the ending already says who: ¿comes carne? Carne is meat; in Argentina and Uruguay it often means beef grilled at an asado with the family, while in Mexico you may find it in tacos. El pescado is fish as food. Spanish has no word for “some”, and with food in general you drop the article: como carne, no como pescado.',
          examples: [
            { target: 'Yo como carne y verduras.', base: 'I eat meat and vegetables.' },
            {
              target: '¿Tú comes pescado? — No, no como pescado.',
              base: 'Do you eat fish? — No, I don’t eat fish.',
            },
          ],
        },
        takeaways: [
          'You say yo como and ask a friend ¿comes…? (tú comes).',
          'You talk about food in general without an article: como carne.',
        ],
        exercises: [
          ex.translationChoice(
            'la carne',
            'the meat',
            ['the fish (to eat)', 'the vegetables', 'the cheese'],
            ['es-la-carne'],
            { id: 'es.ex.4ga53kjb30dg0s' },
          ),
          ex.matchPairs(
            [
              ['el queso', 'the cheese'],
              ['la manzana', 'the apple'],
              ['el pescado', 'the fish'],
              ['las verduras', 'the vegetables'],
            ],
            ['es-el-queso', 'es-la-manzana', 'es-el-pescado', 'es-las-verduras'],
            { id: 'es.ex.vanzol7wy4n3cb' },
          ),
          ex.translationChoice(
            'el vino',
            'the wine',
            ['the water', 'the milk', 'the tea'],
            ['es-el-vino'],
            { id: 'es.ex.z1650mizf1q9if' },
          ),
          ex.fillBlank(
            'Yo ___ carne.',
            'I eat meat.',
            'como',
            ['comes', 'tengo', 'soy'],
            ['es-yo-como', 'es-la-carne'],
            {
              id: 'es.ex.kytlcavslaypda',
              skill: 'grammar',
              explanation: 'With yo the verb comer is como. Comes goes with tú.',
            },
          ),
          ex.fillBlank(
            '¿Tú ___ pescado?',
            'Do you eat fish?',
            'comes',
            ['como', 'comer', 'tengo'],
            ['es-yo-como', 'es-el-pescado'],
            {
              id: 'es.ex.czczt6mn8xq8ym',
              skill: 'grammar',
              explanation:
                'With tú: comes (yo como, tú comes). Comer is the infinitive, the form you find in the dictionary.',
            },
          ),
          ex.listenChoice(
            'Yo como verduras.',
            ['Yo como manzanas.', 'Tú comes verduras.', 'Yo como carne.'],
            ['es-yo-como', 'es-las-verduras'],
            { id: 'es.ex.7slivtu7t1wgej' },
          ),
          ex.fillBlank(
            'No como ___.',
            'I don’t eat fish.',
            'pescado',
            ['del pescado', 'de pescado'],
            ['es-el-pescado', 'es-yo-como'],
            {
              id: 'es.ex.0bsnddhiw6bkpr',
              skill: 'grammar',
              explanation:
                'Spanish has no partitive: no como pescado, quiero pan. Never “del pescado”.',
            },
          ),
          ex.orderWords(
            'Yo como queso y pan.',
            'I eat cheese and bread.',
            ['es-yo-como', 'es-el-queso'],
            {
              id: 'es.ex.fiqgo4iuuywq0x',
            },
          ),
          ex.shortAnswer(
            '¿Comes carne?',
            'Say yes, you eat meat (e.g. «Sí, como…»).',
            'Sí, como carne.',
            ['Sí, yo como carne.', 'Sí, como carne', 'Sí, como.', 'Sí.'],
            ['es-yo-como', 'es-la-carne'],
            { id: 'es.ex.63ezrc2voir4l6' },
          ),
          ex.translateWrite(
            'I don’t eat meat. I eat fish and vegetables.',
            'No como carne. Como pescado y verduras.',
            ['es-yo-como', 'es-la-carne', 'es-el-pescado', 'es-las-verduras'],
            {
              id: 'es.ex.grxq9hg7xopsy1',
              acceptedAnswers: [
                'Yo no como carne. Yo como pescado y verduras.',
                'No como carne, como pescado y verduras.',
                'Yo no como carne. Como pescado y verduras.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Quiero, quisiera',
        objective: 'Order politely in a café or a bakery.',
        intro: {
          explanation:
            'Quiero means I want. In a café or a shop it sounds nicer to say quisiera (I would like) or to add por favor: quisiera un café, por favor. Among friends, people often say ¿me das…? (can you give me…?). To ask a friend what they want, use tú: ¿qué quieres? Querer changes its stem with tú: yo quiero, tú quieres (e → ie). Remember: no word for “some”: quiero pan.',
          examples: [
            { target: 'Quisiera un té, por favor.', base: 'I’d like a tea, please.' },
            {
              target: '¿Qué quieres? — Quiero una manzana.',
              base: 'What do you want? — I want an apple.',
            },
          ],
        },
        takeaways: [
          'You order politely with quisiera… por favor.',
          'You ask a friend ¿qué quieres? (quiero → quieres) or ¿me das…?',
        ],
        exercises: [
          ex.translationChoice('quiero', 'I want', ["I'd like", 'I eat', 'I have'], ['es-quiero'], {
            id: 'es.ex.tdgu9q7mhurkwi',
          }),
          ex.translationChoice(
            'quisiera',
            "I'd like",
            ['I want', 'I have', 'I eat'],
            ['es-quisiera'],
            { id: 'es.ex.h6o8p1bdrh2rqx' },
          ),
          ex.fillBlank(
            '___ un café, por favor.',
            'I’d like a coffee, please.',
            'Quisiera',
            ['Quieres', 'Como', 'Tengo'],
            ['es-quisiera', 'es-el-cafe'],
            {
              id: 'es.ex.w8siy9vp87425e',
              skill: 'vocabulary',
              explanation: 'Quisiera is I would like, the polite way to order.',
            },
          ),
          ex.fillBlank(
            '¿Y tú? ¿Qué ___?',
            'And you? What do you want?',
            'quieres',
            ['quiero', 'quisiera', 'comes'],
            ['es-quiero'],
            {
              id: 'es.ex.v9m6uehhe6xy68',
              skill: 'grammar',
              explanation:
                'With tú: quieres. The stem changes from e to ie: yo quiero, tú quieres. Quiero is for yo (I want).',
            },
          ),
          ex.listenChoice(
            'Quisiera agua, por favor.',
            ['Quiero agua, por favor.', 'Quisiera pan, por favor.', 'Quisiera vino, por favor.'],
            ['es-quisiera', 'es-el-agua'],
            { id: 'es.ex.1056jxdh4nl3fy' },
          ),
          ex.fillBlank(
            '¿Me ___ un croissant?',
            'Can you give me a croissant?',
            'das',
            ['tengo', 'como', 'quiero'],
            ['es-el-croissant'],
            {
              id: 'es.ex.ixzlvf5dax8kgt',
              skill: 'vocabulary',
              explanation: '¿Me das…? is an informal way of asking for something among friends.',
            },
          ),
          ex.orderWords(
            'Quiero pan con queso.',
            'I want bread with cheese.',
            ['es-quiero', 'es-el-pan'],
            {
              id: 'es.ex.orwyz5b39pib9s',
            },
          ),
          ex.matchPairs(
            [
              ['quiero', 'I want'],
              ['quisiera', "I'd like"],
              ['yo como', 'I eat'],
              ['el vino', 'the wine'],
            ],
            ['es-quiero', 'es-quisiera', 'es-yo-como', 'es-el-vino'],
            { id: 'es.ex.bw3t4qcctrptvp' },
          ),
          ex.translateWrite(
            'I’d like a coffee with milk, please.',
            'Quisiera un café con leche, por favor.',
            ['es-quisiera', 'es-el-cafe', 'es-la-leche'],
            { id: 'es.ex.y4vptbu2a40aes' },
          ),
          ex.shortAnswer(
            '¿Qué quieres?',
            'You are at a bakery. Ask for bread, please (use «Quiero» or «Quisiera»).',
            'Quisiera pan, por favor.',
            [
              'Quiero pan, por favor.',
              'Quisiera pan.',
              'Quiero pan.',
              'Quisiera un pan, por favor.',
              '¿Me das pan, por favor?',
            ],
            ['es-quisiera', 'es-quiero', 'es-el-pan'],
            { id: 'es.ex.i985sy38h3d98s' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Tomo café',
        objective: 'Say what you drink and how much.',
        intro: {
          explanation:
            'To drink you can use tomar or beber. In Latin America tomar is the everyday verb for drinks: tomo café, tomo agua; beber (yo bebo, tú bebes) is understood everywhere and is very common in Spain. With tú: ¿tomas café? ¿bebes agua? In Argentina, Uruguay and Paraguay people also share el mate, a herbal tea drunk from a gourd through a metal straw and passed round the group. Mucho agrees with the noun: mucho café, mucha agua (agua is feminine). Un poco de (a little) never changes: un poco de leche. Compare the soft g in agua with the strong j in jugo (juice), like a strong h.',
          examples: [
            {
              target: '¿Tomas café? — Sí, tomo mucho café.',
              base: 'Do you drink coffee? — Yes, I drink a lot of coffee.',
            },
            { target: 'Bebo un poco de leche.', base: 'I drink a little milk.' },
          ],
        },
        takeaways: [
          'You say tomo (or bebo) for I drink and ask a friend ¿tomas…?',
          'You use mucho / mucha and un poco de for quantities.',
        ],
        exercises: [
          ex.translationChoice('tomo', 'I drink', ['I eat', 'I want', 'I have'], ['es-tomo'], {
            id: 'es.ex.1a3b5oh2eli1bv',
          }),
          ex.translationChoice(
            'el jugo',
            'the juice',
            ['the tea', 'the coffee', 'the wine'],
            ['es-el-jugo'],
            { id: 'es.ex.5aozkz17uzrjwr' },
          ),
          ex.fillBlank(
            'Tomo ___ agua.',
            'I drink a lot of water.',
            'mucha',
            ['mucho', 'muchos', 'muchas'],
            ['es-mucho', 'es-el-agua'],
            {
              id: 'es.ex.k14wn7bikuxd78',
              skill: 'grammar',
              explanation: 'Agua is feminine (even with el), so it is mucha agua.',
            },
          ),
          ex.fillBlank(
            'Un ___ de leche, por favor.',
            'A little milk, please.',
            'poco',
            ['mucho', 'mucha', 'muy'],
            ['es-un-poco-de', 'es-la-leche'],
            {
              id: 'es.ex.skdi1tb3587jwd',
              skill: 'vocabulary',
              explanation:
                'Un poco de is a little and never changes: un poco de leche, un poco de pan.',
            },
          ),
          ex.listenChoice(
            'Tomo mucho jugo.',
            ['Tomo mucho café.', 'Tomo un poco de jugo.', 'Como mucha carne.'],
            ['es-tomo', 'es-mucho', 'es-el-jugo'],
            { id: 'es.ex.xe4ezdoiyrpmwu' },
          ),
          ex.listenChoice(
            'Quiero agua.',
            ['Quiero jugo.', 'Quiero vino.', 'Quiero queso.'],
            ['es-el-agua', 'es-quiero', 'es-el-jugo'],
            { id: 'es.ex.tmhq3uxjrqm9lk' },
          ),
          ex.fillBlank(
            '¿Tú ___ café?',
            'Do you drink coffee?',
            'tomas',
            ['tomo', 'como', 'tengo'],
            ['es-tomo', 'es-el-cafe'],
            {
              id: 'es.ex.sc1rl9kap459b9',
              skill: 'grammar',
              explanation:
                'With tú: tomas (yo tomo, tú tomas). Tomo is for yo. With beber it would be ¿bebes café?',
            },
          ),
          ex.orderWords(
            'Tomo un poco de leche.',
            'I drink a little milk.',
            ['es-tomo', 'es-un-poco-de'],
            {
              id: 'es.ex.r3dulbhlcc82s4',
            },
          ),
          ex.translateWrite(
            'I drink a lot of juice.',
            'Tomo mucho jugo.',
            ['es-tomo', 'es-mucho', 'es-el-jugo'],
            {
              id: 'es.ex.y13059v16tja0o',
              acceptedAnswers: [
                'Yo tomo mucho jugo.',
                'Bebo mucho jugo.',
                'Yo bebo mucho jugo.',
                'Tomo mucho zumo.',
                'Bebo mucho zumo.',
              ],
            },
          ),
          ex.translateWrite(
            'A little water, please.',
            'Un poco de agua, por favor.',
            ['es-un-poco-de', 'es-el-agua'],
            { id: 'es.ex.4uepvxvzym0rhv' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'En el café',
        objective: 'Understand an order in a café and a breakfast menu.',
        intro: {
          explanation:
            'In Latin America the waiter is el mesero or la mesera (el camarero in Spain). Order with quisiera… por favor. Meal times vary: in Spain and Argentina dinner is late, often after nine; in Mexico la comida, around two or three, is the big meal of the day. A waiter usually speaks to you with usted: ¿qué quiere tomar? (quiere, not quieres).',
          examples: [
            {
              target: 'Quisiera un café con leche y dos croissants.',
              base: 'I’d like a coffee with milk and two croissants.',
            },
            { target: 'Un poco de agua, por favor.', base: 'A little water, please.' },
          ],
        },
        takeaways: ['You understand a short order in a café.', 'You read a simple breakfast menu.'],
        exercises: [
          question(
            'es.ex.uhexgfhsfgl036',
            CAFE,
            'What does Camila order to drink?',
            'A coffee with milk',
            ['A tea with milk', 'A glass of wine', 'A juice'],
            ['es-el-cafe', 'es-la-leche', 'es-quisiera'],
            'Camila says “Quisiera un café con leche, por favor”.',
          ),
          question(
            'es.ex.wjv86v7nvsv6mo',
            CAFE,
            'What does she order to eat?',
            'Two croissants',
            ['Bread with cheese', 'An apple', 'Three croissants'],
            ['es-el-croissant'],
            'When the waiter asks “¿Y para comer?”, she answers “Dos croissants”.',
          ),
          question(
            'es.ex.dom8zn1xe3ysym',
            CAFE,
            'What else does Camila ask for?',
            'A little water',
            ['A lot of milk', 'Some wine', 'More coffee'],
            ['es-un-poco-de', 'es-el-agua'],
            'She adds “Y un poco de agua, por favor”.',
          ),
          question(
            'es.ex.h3ookw10e6a1o3',
            CAFE,
            'How does the waiter speak to Camila?',
            'Formally, with usted',
            ['Informally, with tú', 'He doesn’t speak to her', 'In English'],
            ['es-quiero'],
            'He asks “¿Qué quiere tomar?”: quiere, without the final s of quieres, is the usted form.',
          ),
          question(
            'es.ex.vw5vxxgblffeum',
            MENU,
            'What comes with the tea?',
            'Bread with cheese',
            ['Two croissants', 'An apple', 'A juice'],
            ['es-el-te', 'es-el-pan', 'es-el-queso'],
            'The menu says “Té con leche y pan con queso”.',
          ),
          question(
            'es.ex.h5wrqlz67c6lzo',
            MENU,
            'What is free?',
            'The water',
            ['The coffee', 'The croissants', 'The apple'],
            ['es-el-agua'],
            'The last line says “El agua es gratis”.',
          ),
          ex.listenChoice(
            'Quisiera un té con leche y pan con queso.',
            [
              'Quisiera un café con leche y pan con queso.',
              'Quisiera un té con leche y dos croissants.',
              'Quiero un té con leche y pan con queso.',
            ],
            ['es-quisiera', 'es-el-te', 'es-el-queso'],
            { id: 'es.ex.7xd8bi0yotyamr' },
          ),
          ex.fillBlank(
            'Quisiera ___ croissants, por favor.',
            'I’d like two croissants, please.',
            'dos',
            ['doce', 'del', 'las'],
            ['es-quisiera', 'es-el-croissant'],
            {
              id: 'es.ex.gvzvvp6yqlg67d',
              skill: 'vocabulary',
              explanation: 'Dos is two; doce is twelve. When you order, you don’t need an article.',
            },
          ),
          ex.shortAnswer(
            '¿Qué quiere tomar?',
            'The waiter asks you. Order a coffee politely (use «Quisiera»).',
            'Quisiera un café, por favor.',
            [
              'Quisiera un café, por favor',
              'Quisiera un café.',
              'Quisiera café, por favor.',
              'Un café, por favor.',
            ],
            ['es-quisiera', 'es-el-cafe'],
            { id: 'es.ex.oc49fk96olfgm5' },
          ),
          ex.translateWrite(
            'I want two croissants and a little cheese.',
            'Quiero dos croissants y un poco de queso.',
            ['es-quiero', 'es-el-croissant', 'es-un-poco-de', 'es-el-queso'],
            {
              id: 'es.ex.4j6b9c8gthdg78',
              acceptedAnswers: ['Quiero dos medialunas y un poco de queso.'],
            },
          ),
        ],
      },
    ],
  },
};

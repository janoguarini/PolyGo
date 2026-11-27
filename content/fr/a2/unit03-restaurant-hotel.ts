import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U3 «Restaurante y hotel» (docs/FR_A1_A2.md): reservar una mesa o una habitación,
 * moverse en el hotel, leer la carta, pedir con cortesía y pagar la cuenta.
 * Gramática: el condicional de cortesía (j'aimerais, je pourrais, pourriez-vous…? + infinitivo) junto
 * al je voudrais ya visto. Pronunciación: deux / douze, compris (s muda) / comprise (s que suena z),
 * la gn de saignant. Cultura: la carte frente a le menu, l'entrée es el primer plato, el service
 * compris y la carafe d'eau gratis.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RECEPTION = dialogue(
  'fr.stim.a2-u3-reception',
  'Una clienta llega a la recepción de un hotel.',
  [
    ['Nathalie', "Bonsoir, monsieur. J'ai réservé une chambre double pour deux nuits."],
    ['Julien', "Bonsoir, madame. Votre nom, s'il vous plaît?"],
    ['Nathalie', 'Nathalie Moreau.'],
    ['Julien', 'Merci. Voici votre clé. La chambre est au troisième étage.'],
    ['Nathalie', 'Le petit-déjeuner est compris?'],
    ['Julien', 'Oui, il est compris, de sept heures à dix heures.'],
    ['Nathalie', "Parfait. Pourriez-vous me dire où est l'ascenseur?"],
    ['Julien', 'Il est à gauche, à côté du salon.'],
  ],
);

const BISTROT = dialogue('fr.stim.a2-u3-bistrot', 'Una clienta pide la comida en un bistró.', [
  ['Antoine', 'Bonsoir, madame! Vous avez choisi?'],
  ['Camille', "Oui. En entrée, je voudrais la soupe à l'oignon."],
  ['Antoine', 'Très bien. Et comme plat?'],
  ['Camille', "J'aimerais le steak-frites."],
  ['Antoine', 'Saignant ou à point?'],
  ['Camille', "À point, s'il vous plaît. Et pourriez-vous m'apporter une carafe d'eau?"],
  ['Antoine', 'Bien sûr, madame!'],
]);

const MENU = reading(
  'fr.stim.a2-u3-menu',
  'menu',
  'El pizarrón de un bistró de París.',
  [
    'Menu du jour: 22 euros',
    "Entrée: soupe à l'oignon ou salade",
    'Plat: poisson ou steak-frites',
    'Dessert: tarte aux pommes ou mousse au chocolat',
    'Café: 2 euros',
    'Le menu est servi à midi et le soir. Service compris.',
    'Fermé le lundi.',
  ],
  { title: 'Le Petit Bistrot' },
);

export const FR_A2_U03: FrUnitDef = {
  names: ['Nathalie', 'Moreau', 'Julien', 'Antoine', 'Camille', 'Bistrot', 'Paris', 'Lyon', 'Marc'],
  support: [
    'nom',
    'votre',
    'troisième',
    'deuxième',
    'donner',
    'avoir',
    'réservé',
    'dire',
    'parfait',
    'jour',
    'soupe',
    'oignon',
    'salade',
    'tarte',
    'chocolat',
    'mousse',
    'steak',
    'frites',
    'comme',
    'point',
    'cuit',
    'choisi',
    'apporter',
    'sûr',
    'service',
    'laisse',
    'servi',
  ],
  unit: {
    position: 3,
    title: 'Restaurante y hotel',
    titleEn: "Au restaurant et à l'hôtel",
    description:
      "Reservar y pedir con cortesía: j'aimerais, je pourrais, pourriez-vous…? La carte y le menu, l'entrée, la cuenta y el service compris.",
    emoji: '🍽️',
    objective:
      'Puedes reservar una mesa o una habitación, pedir cosas en el hotel, elegir de la carta, pedir la carne a tu gusto y pagar la cuenta con cortesía.',
    grammar: {
      title: "El condicional de cortesía: j'aimerais, je pourrais, pourriez-vous…?",
      explanation:
        "Para pedir con amabilidad, el francés usa el condicional, como el español «me gustaría» o «¿podría…?». Ya conoces je voudrais (quisiera). Ahora sumas j'aimerais (me gustaría), je pourrais (yo podría) y pourriez-vous…? (¿podría usted…?), que van con un sustantivo o con un verbo en infinitivo: j'aimerais réserver, pourriez-vous me donner…? En el hotel y en el restaurante se usa siempre vous. Las terminaciones -ais y -ez se escriben distinto, pero la s y la z finales no suenan.",
      examples: [
        {
          target: "J'aimerais réserver une table pour ce soir.",
          base: 'Me gustaría reservar una mesa para esta noche.',
        },
        { target: "Je pourrais avoir l'addition?", base: '¿Me podría traer la cuenta?' },
        { target: 'Pourriez-vous me donner la clé?', base: '¿Podría darme la llave?' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U3). Sin revisión nativa: revisar «je pourrais avoir…?» traducido como «¿me podría traer…?», el uso de «à point» frente al «a punto» argentino y si conviene enseñar «bien cuit» como palabra.',
    },
    words: [
      w(
        'fr-reserver',
        'réserver',
        'reservar',
        "J'aimerais réserver une table pour deux.",
        'Me gustaría reservar una mesa para dos.',
        ['travel', 'food'],
      ),
      w(
        'fr-la-chambre-double',
        'la chambre double',
        'la habitación doble',
        'Je voudrais une chambre double pour trois nuits.',
        'Quisiera una habitación doble para tres noches.',
        ['travel', 'f'],
        { emoji: '🛏️' },
      ),
      w(
        'fr-la-nuit',
        'la nuit',
        'la noche (para dormir)',
        "La chambre double, c'est quatre-vingts euros la nuit.",
        'La habitación doble cuesta ochenta euros la noche.',
        ['time', 'f'],
        { emoji: '🌙' },
      ),
      w(
        'fr-compris',
        'compris',
        'incluido',
        'Le petit-déjeuner est compris?',
        '¿El desayuno está incluido?',
        ['travel', 'food'],
        { acceptedTranslations: ['incluida'], acceptedTexts: ['comprise'] },
      ),
      w(
        'fr-la-carte',
        'la carte',
        'la carta (del restaurante)',
        "Je pourrais avoir la carte, s'il vous plaît?",
        '¿Me podría traer la carta, por favor?',
        ['food', 'f'],
      ),
      w(
        'fr-le-menu',
        'le menu',
        'el menú del día',
        'Le menu à vingt euros: entrée, plat et dessert.',
        'El menú de veinte euros: entrada, plato principal y postre.',
        ['food', 'm'],
        { acceptedTranslations: ['el menú fijo'] },
      ),
      w(
        'fr-l-entree',
        "l'entrée",
        'el primer plato',
        'Je voudrais la soupe en entrée.',
        'De primer plato quisiera la sopa.',
        ['food', 'f'],
        { acceptedTranslations: ['la entrada'] },
      ),
      w(
        'fr-le-plat',
        'le plat',
        'el plato principal',
        'Comme plat, je prends le poisson.',
        'De plato principal, pido el pescado.',
        ['food', 'm'],
        { acceptedTranslations: ['el plato'] },
      ),
      w(
        'fr-le-dessert',
        'le dessert',
        'el postre',
        'Comme dessert, une tarte aux pommes.',
        'De postre, una tarta de manzana.',
        ['food', 'm'],
        { emoji: '🍰' },
      ),
      w(
        'fr-l-addition',
        "l'addition",
        'la cuenta',
        "L'addition, s'il vous plaît!",
        '¡La cuenta, por favor!',
        ['food', 'f'],
        { emoji: '🧾' },
      ),
      w(
        'fr-le-pourboire',
        'le pourboire',
        'la propina',
        'Le service est compris, mais on laisse un petit pourboire.',
        'El servicio está incluido, pero dejamos una propinita.',
        ['food', 'm'],
      ),
      w(
        'fr-j-aimerais',
        "j'aimerais",
        'me gustaría',
        "J'aimerais une table près de la fenêtre.",
        'Me gustaría una mesa cerca de la ventana.',
        ['courtesy', 'conditional'],
      ),
      w(
        'fr-pourriez-vous',
        'pourriez-vous…?',
        '¿podría usted…?',
        "Pourriez-vous m'apporter de l'eau?",
        '¿Podría traerme agua?',
        ['courtesy', 'conditional'],
        { acceptedTranslations: ['¿podría…?', '¿podrían…?'] },
      ),
      w(
        'fr-je-pourrais',
        'je pourrais',
        'yo podría',
        'Je pourrais avoir une chambre au premier étage?',
        '¿Podría tener una habitación en el primer piso?',
        ['courtesy', 'conditional'],
        { acceptedTranslations: ['podría'] },
      ),
      w(
        'fr-l-ascenseur',
        "l'ascenseur",
        'el ascensor',
        "L'ascenseur est à gauche.",
        'El ascensor está a la izquierda.',
        ['travel', 'm'],
      ),
      w(
        'fr-l-etage',
        "l'étage",
        'el piso',
        'La chambre est au troisième étage.',
        'La habitación está en el tercer piso.',
        ['travel', 'm'],
        { acceptedTranslations: ['la planta'] },
      ),
      w(
        'fr-saignant',
        'saignant',
        'jugoso (la carne)',
        "Un steak saignant, s'il vous plaît.",
        'Un bife jugoso, por favor.',
        ['food'],
        { acceptedTranslations: ['vuelta y vuelta', 'poco cocido'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Reservar',
        objective: 'Reservar una mesa o una habitación con cortesía.',
        intro: {
          explanation:
            "Para reservar con amabilidad: j'aimerais (me gustaría) + réserver o + lo que quieres. Es más suave que je veux y tan cortés como je voudrais. En el hotel: une chambre double (habitación doble) y la nuit (la noche que duermes allí; para la hora del día ya conoces le soir). Ojo con el número: deux (dos) y douze (doce) se distinguen por la vocal y por la z de douze.",
          examples: [
            {
              target: "J'aimerais réserver une table pour deux.",
              base: 'Me gustaría reservar una mesa para dos.',
            },
            {
              target: "J'aimerais une chambre double pour deux nuits.",
              base: 'Me gustaría una habitación doble para dos noches.',
            },
          ],
        },
        takeaways: [
          "Reservas con j'aimerais réserver…",
          'Pides una chambre double y dices cuántas nuits.',
        ],
        exercises: [
          ex.translationChoice(
            'réserver',
            'reservar',
            ['pagar', 'pedir', 'elegir'],
            ['fr-reserver'],
            {
              id: 'fr.ex.kbk9rvczf7ozdb',
            },
          ),
          ex.translationChoice(
            "j'aimerais",
            'me gustaría',
            ['me gusta', 'me encanta', 'yo podría'],
            ['fr-j-aimerais'],
            {
              id: 'fr.ex.7amsq400pq8hy5',
              explanation: "J'aime es «me gusta»; j'aimerais, en condicional, es «me gustaría».",
            },
          ),
          ex.matchPairs(
            [
              ['réserver', 'reservar'],
              ['la nuit', 'la noche (para dormir)'],
              ['la chambre double', 'la habitación doble'],
              ["j'aimerais", 'me gustaría'],
            ],
            ['fr-reserver', 'fr-la-nuit', 'fr-la-chambre-double', 'fr-j-aimerais'],
            { id: 'fr.ex.jhwi4sgxi2lto9' },
          ),
          ex.listenChoice(
            "Deux nuits, s'il vous plaît.",
            [
              "Douze nuits, s'il vous plaît.",
              "Trois nuits, s'il vous plaît.",
              "Deux nuits, s'il te plaît.",
            ],
            ['fr-la-nuit'],
            {
              id: 'fr.ex.kz1to3u2grtya5',
              explanation:
                'Deux (dos) suena corto y sin consonante final; douze (doce) termina en un sonido z.',
            },
          ),
          ex.fillBlank(
            "J'___ réserver une table pour deux.",
            'Me gustaría reservar una mesa para dos.',
            'aimerais',
            ['aime', 'aimes', 'adore'],
            ['fr-j-aimerais', 'fr-reserver'],
            {
              id: 'fr.ex.1zm5s7y5xeeqh8',
              explanation:
                "Para pedir con cortesía se usa el condicional: j'aimerais (me gustaría).",
            },
          ),
          ex.fillBlank(
            "J'aimerais une chambre ___ pour trois nuits.",
            'Me gustaría una habitación doble para tres noches.',
            'double',
            ['deux', 'douze', 'nuit'],
            ['fr-la-chambre-double'],
            {
              id: 'fr.ex.z9hlm113bqn4xi',
              skill: 'vocabulary',
              explanation: 'Habitación doble: une chambre double.',
            },
          ),
          ex.orderWords(
            "J'aimerais réserver une table pour samedi.",
            'Me gustaría reservar una mesa para el sábado.',
            ['fr-j-aimerais', 'fr-reserver'],
            { id: 'fr.ex.0suyl9u8v1vc8r' },
          ),
          ex.fillBlank(
            'Le petit-déjeuner est ___?',
            '¿El desayuno está incluido?',
            'compris',
            ['comprise', 'chère', 'pris'],
            ['fr-compris'],
            {
              id: 'fr.ex.wav582vtaaxmmw',
              explanation:
                'Le petit-déjeuner es masculino: compris. Con un sustantivo femenino se escribe comprise.',
            },
          ),
          ex.translateWrite(
            'Me gustaría reservar una habitación doble.',
            "J'aimerais réserver une chambre double.",
            ['fr-j-aimerais', 'fr-reserver', 'fr-la-chambre-double'],
            {
              id: 'fr.ex.8dj98h49f6b1ol',
              acceptedAnswers: [
                'Je voudrais réserver une chambre double.',
                "J'aimerais réserver une chambre double, s'il vous plaît.",
              ],
            },
          ),
          ex.shortAnswer(
            'Bonsoir! Combien de nuits?',
            '¡Buenas noches! ¿Cuántas noches? (Responde: dos noches, por favor.)',
            "Deux nuits, s'il vous plaît.",
            ['Deux nuits.', 'Deux nuits, merci.', "Bonsoir! Deux nuits, s'il vous plaît."],
            ['fr-la-nuit'],
            { id: 'fr.ex.yignwydat04hhj' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'En el hotel',
        objective: 'Pedir cosas en la recepción y ubicarse en el hotel.',
        intro: {
          explanation:
            "Para pedir algo con cortesía: pourriez-vous…? (¿podría usted…?) + infinitivo, o je pourrais…? (¿yo podría…?). L'étage es el piso de un edificio: le premier étage, le deuxième étage, le troisième étage. Como en Argentina, el premier étage está arriba de la planta baja. Ascenseur y étage empiezan con vocal: l'ascenseur, l'étage.",
          examples: [
            {
              target: 'La chambre est au deuxième étage.',
              base: 'La habitación está en el segundo piso.',
            },
            { target: 'Pourriez-vous me donner la clé?', base: '¿Podría darme la llave?' },
          ],
        },
        takeaways: [
          'Pides algo con pourriez-vous…? o je pourrais…?',
          "Ubicas la habitación con l'étage y l'ascenseur.",
        ],
        exercises: [
          ex.translationChoice(
            "l'ascenseur",
            'el ascensor',
            ['la escalera', 'el piso', 'la llave'],
            ['fr-l-ascenseur'],
            { id: 'fr.ex.ja3xpr8fivxwra' },
          ),
          ex.listenChoice(
            'La chambre est au deuxième étage.',
            ['La chambre est au troisième étage.', 'La chambre est au premier étage.'],
            ['fr-l-etage'],
            { id: 'fr.ex.wn01mj6pcx4s1p' },
          ),
          ex.fillBlank(
            "___ me donner la clé, s'il vous plaît?",
            '¿Podría darme la llave, por favor?',
            'Pourriez-vous',
            ['Je pourrais', 'Vous êtes', 'Je voudrais'],
            ['fr-pourriez-vous'],
            {
              id: 'fr.ex.qkulesbxueq8kv',
              explanation:
                'Para pedirle algo a otra persona: pourriez-vous + infinitivo (¿podría usted…?).',
            },
          ),
          ex.fillBlank(
            'Je ___ avoir une chambre au premier étage?',
            '¿Podría tener una habitación en el primer piso?',
            'pourrais',
            ['pourriez', 'suis', 'aimerais'],
            ['fr-je-pourrais', 'fr-l-etage'],
            {
              id: 'fr.ex.kgyr7nocizwwls',
              explanation:
                "Con je: je pourrais. Pourriez va con vous, y aimerais pide elisión: j'aimerais.",
            },
          ),
          ex.matchPairs(
            [
              ["l'ascenseur", 'el ascensor'],
              ["l'étage", 'el piso'],
              ['je pourrais', 'yo podría'],
              ['pourriez-vous…?', '¿podría usted…?'],
            ],
            ['fr-l-ascenseur', 'fr-l-etage', 'fr-je-pourrais', 'fr-pourriez-vous'],
            { id: 'fr.ex.pousy75v7hvoni' },
          ),
          ex.orderWords(
            "L'ascenseur est à gauche.",
            'El ascensor está a la izquierda.',
            ['fr-l-ascenseur'],
            {
              id: 'fr.ex.ikod9gheru2o61',
            },
          ),
          question(
            'fr.ex.go8ig0hm7v29eh',
            RECEPTION,
            '¿En qué piso está la habitación de Nathalie?',
            'En el tercero.',
            ['En el primero.', 'En el segundo.', 'En la planta baja.'],
            ['fr-l-etage'],
            'El recepcionista dice «La chambre est au troisième étage».',
          ),
          question(
            'fr.ex.18i6px9eb9detz',
            RECEPTION,
            '¿Qué está incluido en la reserva?',
            'El desayuno, de 7 a 10.',
            ['La cena.', 'Nada: todo se paga aparte.', 'El almuerzo, de 12 a 14.'],
            ['fr-compris'],
            'Julien responde «Oui, il est compris, de sept heures à dix heures» sobre le petit-déjeuner.',
          ),
          ex.translateWrite(
            '¿Podría darme la llave, por favor?',
            "Pourriez-vous me donner la clé, s'il vous plaît?",
            ['fr-pourriez-vous'],
            {
              id: 'fr.ex.82xz37g41p7xqs',
              acceptedAnswers: [
                'Pourriez-vous me donner la clé?',
                "Vous pourriez me donner la clé, s'il vous plaît?",
              ],
            },
          ),
          ex.shortAnswer(
            'La chambre est à quel étage?',
            '¿En qué piso está la habitación? (Responde: en el tercer piso.)',
            'Elle est au troisième étage.',
            ['Au troisième étage.', 'La chambre est au troisième étage.', 'Au troisième.'],
            ['fr-l-etage'],
            { id: 'fr.ex.pxp2r0sddje7yh' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'La carta',
        objective: 'Leer la carta y entender cómo se ordena una comida francesa.',
        intro: {
          explanation:
            "Dos falsos amigos: la carte es la carta completa del restaurante, y le menu es el menú del día a precio fijo (entrée + plat + dessert). Y l'entrée no es la entrada al local: es el primer plato. Después viene le plat (el plato principal) y le dessert (el postre). En dessert, la doble s suena como una s.",
          examples: [
            {
              target: 'Le menu à vingt euros: entrée, plat et dessert.',
              base: 'El menú de veinte euros: entrada, plato principal y postre.',
            },
            {
              target: "Je pourrais avoir la carte, s'il vous plaît?",
              base: '¿Me podría traer la carta, por favor?',
            },
          ],
        },
        takeaways: [
          'Distingues la carte (la carta) de le menu (el menú del día).',
          "Ordenas la comida: l'entrée, le plat, le dessert.",
        ],
        exercises: [
          ex.translationChoice(
            "l'entrée",
            'el primer plato',
            ['el postre', 'el plato principal', 'la cuenta'],
            ['fr-l-entree'],
            {
              id: 'fr.ex.8kwl4231ut2oya',
              explanation: "Falso amigo: en el restaurante, l'entrée es el primer plato.",
            },
          ),
          ex.translationChoice(
            'la carte',
            'la carta (del restaurante)',
            ['el menú del día', 'el primer plato', 'la mesa'],
            ['fr-la-carte'],
            { id: 'fr.ex.wkn1u99fg4s2g8' },
          ),
          ex.matchPairs(
            [
              ["l'entrée", 'el primer plato'],
              ['le plat', 'el plato principal'],
              ['le dessert', 'el postre'],
              ['le menu', 'el menú del día'],
            ],
            ['fr-l-entree', 'fr-le-plat', 'fr-le-dessert', 'fr-le-menu'],
            { id: 'fr.ex.13vmor1ao2cz2p' },
          ),
          ex.listenChoice(
            'Comme dessert, une tarte aux pommes.',
            [
              'Comme entrée, une tarte aux pommes.',
              'Comme dessert, une mousse au chocolat.',
              'Comme plat, une tarte aux pommes.',
            ],
            ['fr-le-dessert'],
            { id: 'fr.ex.ne9upzkgabafvp' },
          ),
          ex.fillBlank(
            'Le menu à vingt euros: entrée, ___ et dessert.',
            'El menú de veinte euros: entrada, plato principal y postre.',
            'plat',
            ['carte', 'menu', 'table'],
            ['fr-le-plat', 'fr-le-menu'],
            {
              id: 'fr.ex.ru2zuf5jppzkp5',
              skill: 'vocabulary',
              explanation: 'El orden francés: entrée, plat (plato principal) y dessert.',
            },
          ),
          ex.fillBlank(
            "Je pourrais avoir ___ carte, s'il vous plaît?",
            '¿Me podría traer la carta, por favor?',
            'la',
            ['le', 'un', 'les'],
            ['fr-la-carte', 'fr-je-pourrais'],
            { id: 'fr.ex.5vjt21yx038c7j', explanation: 'Carte es femenino: la carte.' },
          ),
          ex.imageChoice(
            '🍰',
            'le dessert',
            ["l'entrée", 'le plat', 'la carte'],
            ['fr-le-dessert'],
            {
              id: 'fr.ex.v848uux4ho9sfw',
            },
          ),
          ex.orderWords(
            'Je voudrais la soupe en entrée.',
            'De primer plato quisiera la sopa.',
            ['fr-l-entree'],
            { id: 'fr.ex.0mlvaoj0t93dhh' },
          ),
          ex.translateWrite(
            'Quisiera el menú del día, por favor.',
            "Je voudrais le menu, s'il vous plaît.",
            ['fr-le-menu'],
            {
              id: 'fr.ex.80s7ox3sbo4447',
              acceptedAnswers: [
                "Je voudrais le menu du jour, s'il vous plaît.",
                "J'aimerais le menu, s'il vous plaît.",
                "Je prends le menu, s'il vous plaît.",
              ],
            },
          ),
          ex.shortAnswer(
            'Et comme dessert?',
            '¿Y de postre? (Pide una tarta de manzana.)',
            "Une tarte aux pommes, s'il vous plaît.",
            [
              'Une tarte aux pommes.',
              'Une tarte aux pommes, merci.',
              "Je voudrais une tarte aux pommes, s'il vous plaît.",
              'Je prends une tarte aux pommes.',
            ],
            ['fr-le-dessert'],
            { id: 'fr.ex.6qv8tteuy3nr2b' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Pedir la comida',
        objective: 'Pedir los platos y decir cómo quieres la carne.',
        intro: {
          explanation:
            'El mesero pregunta vous avez choisi? (¿ya eligieron?). Para la carne hay tres puntos: saignant (jugoso, rojo por dentro), à point (a punto) y bien cuit (bien cocido). En Francia la carne se sirve más cruda que en Argentina: un steak à point es bastante rosado. La gn de saignant suena como la ñ. Saignant concuerda: la viande saignante, y en el femenino la t final sí suena.',
          examples: [
            { target: "Un steak saignant, s'il vous plaît.", base: 'Un bife jugoso, por favor.' },
            {
              target: "Vous avez choisi? — Oui, j'aimerais le poisson.",
              base: '¿Ya eligieron? — Sí, me gustaría el pescado.',
            },
          ],
        },
        takeaways: [
          'Pides la carne saignant, à point o bien cuit.',
          "Pides con je voudrais, j'aimerais o pourriez-vous…?",
        ],
        exercises: [
          ex.translationChoice(
            'saignant',
            'jugoso (la carne)',
            ['bien cocido', 'frío', 'caro'],
            ['fr-saignant'],
            { id: 'fr.ex.6hee01yb6w26jj' },
          ),
          ex.listenChoice(
            "Un steak saignant, s'il vous plaît.",
            ["Un steak à point, s'il vous plaît.", "Un steak bien cuit, s'il vous plaît."],
            ['fr-saignant'],
            {
              id: 'fr.ex.im9a572kuwxcjp',
              explanation: 'En saignant, gn suena como la ñ del español.',
            },
          ),
          ex.fillBlank(
            'La viande, ___ ou à point?',
            '¿La carne, jugosa o a punto?',
            'saignante',
            ['saignant', 'comprise'],
            ['fr-saignant'],
            {
              id: 'fr.ex.fg745w5jgdd1ha',
              explanation: 'La viande es femenino: saignante, y la t final sí se pronuncia.',
            },
          ),
          ex.fillBlank(
            "___ m'apporter de l'eau, s'il vous plaît?",
            '¿Podría traerme agua, por favor?',
            'Pourriez-vous',
            ['Je pourrais', 'Vous êtes', "J'aimerais"],
            ['fr-pourriez-vous'],
            {
              id: 'fr.ex.l6im968qbh163m',
              explanation: 'Le pides algo al mesero: pourriez-vous + infinitivo.',
            },
          ),
          ex.matchPairs(
            [
              ["j'aimerais", 'me gustaría'],
              ['je pourrais', 'yo podría'],
              ['pourriez-vous…?', '¿podría usted…?'],
              ['saignant', 'jugoso (la carne)'],
            ],
            ['fr-j-aimerais', 'fr-je-pourrais', 'fr-pourriez-vous', 'fr-saignant'],
            { id: 'fr.ex.v3s54vg3m3imqg' },
          ),
          question(
            'fr.ex.gdpbgaf5ejmgj5',
            BISTROT,
            '¿Qué pide Camille de primer plato?',
            'La sopa de cebolla.',
            ['El steak con papas fritas.', 'Una ensalada.', 'Nada: sólo pide el plato principal.'],
            ['fr-l-entree'],
            "Camille dice «En entrée, je voudrais la soupe à l'oignon».",
          ),
          question(
            'fr.ex.ehba4x8sleyxdr',
            BISTROT,
            '¿Cómo quiere Camille la carne?',
            'A punto.',
            ['Jugosa.', 'Bien cocida.', 'No lo dice.'],
            ['fr-saignant'],
            'El mesero pregunta «Saignant ou à point?» y ella responde «À point».',
          ),
          question(
            'fr.ex.5lzvawdd5gbziu',
            BISTROT,
            '¿Qué más le pide Camille al mesero?',
            'Una jarra de agua.',
            ['La cuenta.', 'Una botella de vino.', 'La carta de postres.'],
            ['fr-pourriez-vous'],
            "Pregunta «Pourriez-vous m'apporter une carafe d'eau?». En Francia la carafe d'eau es gratis.",
          ),
          ex.translateWrite(
            'Me gustaría el pescado, por favor.',
            "J'aimerais le poisson, s'il vous plaît.",
            ['fr-j-aimerais'],
            {
              id: 'fr.ex.pm5opqciq41kab',
              acceptedAnswers: [
                "Je voudrais le poisson, s'il vous plaît.",
                "J'aimerais le poisson.",
              ],
            },
          ),
          ex.shortAnswer(
            'Et la viande, saignante ou à point?',
            '¿Y la carne, jugosa o a punto? (Pídela jugosa.)',
            "Saignante, s'il vous plaît.",
            ['Saignante.', 'Saignante, merci.', "Saignant, s'il vous plaît.", 'Saignant.'],
            ['fr-saignant'],
            { id: 'fr.ex.qhxojox4gt9cgd' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'La cuenta',
        objective: 'Pedir la cuenta y entender el servicio y la propina.',
        intro: {
          explanation:
            "Para pagar: l'addition, s'il vous plaît, o pourriez-vous m'apporter l'addition? En Francia el servicio ya está en el precio (service compris), así que le pourboire es opcional: se dejan unas monedas si te gustó. Pronunciación: en compris la s final no suena; en el femenino comprise sí suena, como una z.",
          examples: [
            { target: "Pourriez-vous m'apporter l'addition?", base: '¿Me podría traer la cuenta?' },
            { target: 'Le service est compris.', base: 'El servicio está incluido.' },
          ],
        },
        takeaways: [
          "Pides l'addition con cortesía.",
          'Sabes que el service está compris y le pourboire es opcional.',
        ],
        exercises: [
          ex.translationChoice(
            "l'addition",
            'la cuenta',
            ['la propina', 'el postre', 'la carta (del restaurante)'],
            ['fr-l-addition'],
            { id: 'fr.ex.hasumj316oj2zr' },
          ),
          ex.listenChoice(
            'Il est compris.',
            ['Elle est comprise.', 'Ils sont compris.'],
            ['fr-compris'],
            {
              id: 'fr.ex.gw6fwo5jf8pasc',
              explanation: 'En compris la s no suena; en comprise suena como una z.',
            },
          ),
          ex.fillBlank(
            'Le service est ___.',
            'El servicio está incluido.',
            'compris',
            ['comprise', 'pris', 'chère'],
            ['fr-compris'],
            { id: 'fr.ex.mwgjr2lvzz80bh', explanation: 'Le service es masculino: compris.' },
          ),
          ex.fillBlank(
            'On laisse un petit ___?',
            '¿Dejamos una propinita?',
            'pourboire',
            ['addition', 'dessert', 'menu'],
            ['fr-le-pourboire'],
            {
              id: 'fr.ex.jpgwng44p489ss',
              skill: 'vocabulary',
              explanation: 'La propina es le pourboire; en Francia es opcional.',
            },
          ),
          question(
            'fr.ex.2jq3pxv2avu5qo',
            MENU,
            '¿Qué incluye el menú de 22 euros?',
            'Primer plato, plato principal y postre.',
            ['Sólo el plato principal.', 'Plato principal y café.', 'Primer plato y bebida.'],
            ['fr-le-menu', 'fr-l-entree', 'fr-le-plat', 'fr-le-dessert'],
            'El pizarrón muestra «Menu du jour: 22 euros» con entrée, plat y dessert; el café se paga aparte (2 euros).',
          ),
          question(
            'fr.ex.p1n0r609yhstyv',
            MENU,
            '¿Hay que sumar el servicio a la cuenta?',
            'No: el servicio está incluido.',
            ['Sí: se suma un 10 %.', 'Sí, pero sólo de noche.', 'No lo dice.'],
            ['fr-compris'],
            'Al final dice «Service compris».',
          ),
          question(
            'fr.ex.spu6q5rx7o2fj0',
            MENU,
            '¿Qué día cierra el bistró?',
            'El lunes.',
            ['El domingo.', 'El sábado.', 'No cierra nunca.'],
            ['fr-le-menu'],
            'El pizarrón dice «Fermé le lundi».',
          ),
          ex.orderWords(
            "Pourriez-vous m'apporter l'addition?",
            '¿Me podría traer la cuenta?',
            ['fr-pourriez-vous', 'fr-l-addition'],
            { id: 'fr.ex.sor8udvjhq984p' },
          ),
          ex.translateWrite(
            'La cuenta, por favor.',
            "L'addition, s'il vous plaît.",
            ['fr-l-addition'],
            {
              id: 'fr.ex.c8lb5bzaqz2c1z',
              acceptedAnswers: ["Pourriez-vous m'apporter l'addition, s'il vous plaît?"],
            },
          ),
          ex.translateWrite(
            '¿El servicio está incluido?',
            'Le service est compris?',
            ['fr-compris'],
            {
              id: 'fr.ex.othe7ib9kv9thz',
              acceptedAnswers: ['Est-ce que le service est compris?', 'Le service est-il compris?'],
            },
          ),
        ],
      },
    ],
  },
};

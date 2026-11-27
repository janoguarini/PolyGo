import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U9 «Compras y servicios» (docs/FR_A1_A2.md): nombrar la ropa, probársela (talle y número),
 * comparar precios y calidad (plus / moins / aussi… que, meilleur, le plus), pedir una cantidad con
 * en (j'en prends deux) y pagar (par carte, en espèces).
 * Pronunciación: ch como en chemise; s entre vocales (chemise) frente a ss (essayer); la s muda de
 * plus y moins; la vocal nasal de en (j'en prends / je prends).
 * Cultura: les soldes de invierno (enero) y de verano (fin de junio–julio), con fechas fijadas por el
 * Estado. Falsos amigos: la robe (el vestido, no la ropa), les soldes (las rebajas, no el sueldo).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const BOUTIQUE = dialogue('fr.stim.a2-u9-boutique', 'Camille entra a una tienda de ropa.', [
  ['Vendeuse', 'Bonjour, madame. Je peux vous aider?'],
  ['Camille', 'Bonjour. Je cherche une robe pour une fête.'],
  ['Vendeuse', 'Cette robe rouge est très belle, et elle est en soldes.'],
  ['Camille', 'Elle est plus chère que la robe noire?'],
  ['Vendeuse', 'Non, elle est moins chère: quarante-cinq euros.'],
  ['Camille', 'Je peux essayer la rouge? Je fais du trente-huit.'],
  ['Vendeuse', "Bien sûr. La cabine d'essayage est à gauche."],
]);

const PUBLICITE = reading(
  'fr.stim.a2-u9-soldes',
  'ad',
  'Un cartel en la vitrina de una tienda de ropa.',
  [
    "Soldes d'hiver: du 8 janvier au 4 février!",
    'Les vestes: moins 50 %.',
    'Les chemises: 20 euros, ou deux chemises pour 30 euros.',
    'Les chaussures: la meilleure qualité au meilleur prix.',
    "Cabines d'essayage au premier étage.",
    'Paiement par carte ou en espèces.',
  ],
  { title: 'Soldes' },
);

export const FR_A2_U09: FrUnitDef = {
  names: ['Camille', 'Vendeuse', 'Inès', 'Marc', 'Paris', 'Lyon', 'Paul', 'Claire'],
  support: [
    'cette',
    'ces',
    'commencent',
    'vêtements',
    'faites',
    'essaie',
    'essayez',
    'qualité',
    'prix',
    'paiement',
    'espèces',
    'kilos',
    'voulez',
    'paie',
  ],
  unit: {
    position: 9,
    title: 'Compras y servicios',
    titleEn: 'Les achats',
    description:
      'La ropa, el talle y el número; comparar con plus, moins, aussi… que, meilleur y le plus; el pronombre en con cantidades; pagar. Falsos amigos: la robe, les soldes.',
    emoji: '👗',
    objective:
      'Puedes comprar ropa y zapatos: pedir tu talle y tu número, probarte algo, comparar precios y calidad, decir cuántos te llevas y pagar.',
    grammar: {
      title: 'Comparar · meilleur · el pronombre en',
      explanation:
        "Para comparar: plus / moins / aussi + adjetivo + que (en francés siempre que, también con aussi: nunca «comme»). El adjetivo concuerda: la robe est plus chère que la veste. Bon tiene una forma propia: meilleur (meilleure en femenino), nunca «plus bon». El superlativo lleva artículo: la veste la plus chère du magasin, la meilleure boulangerie de la ville. Para no repetir el sustantivo con una cantidad se usa en, delante del verbo: des chemises? J'en prends deux.",
      examples: [
        {
          target: 'La veste est plus chère que la chemise.',
          base: 'La chaqueta es más cara que la camisa.',
        },
        {
          target: "C'est la meilleure boulangerie de la ville.",
          base: 'Es la mejor panadería de la ciudad.',
        },
        { target: "Des chemises? J'en prends deux.", base: '¿Camisas? Me llevo dos.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U9). Sin revisión nativa: revisar «Je fais du 38» para el talle de ropa, «être en soldes», el cartel con «moins 50 %» y las fechas de los soldes (las fija el Estado y cambian cada año).',
    },
    words: [
      w(
        'fr-plus-que',
        'plus… que',
        'más… que',
        'La veste est plus chère que la chemise.',
        'La chaqueta es más cara que la camisa.',
        ['comparison'],
      ),
      w(
        'fr-moins-que',
        'moins… que',
        'menos… que',
        'Le pantalon est moins cher que la robe.',
        'El pantalón es más barato que el vestido.',
        ['comparison'],
      ),
      w(
        'fr-aussi-que',
        'aussi… que',
        'tan… como',
        "Ici, les chaussures sont aussi chères qu'à Paris.",
        'Aquí los zapatos son tan caros como en París.',
        ['comparison'],
      ),
      w(
        'fr-meilleur',
        'meilleur',
        'mejor',
        'Ce croissant est meilleur que le croissant du supermarché.',
        'Este cruasán es mejor que el del supermercado.',
        ['comparison'],
        { acceptedTexts: ['meilleure'] },
      ),
      w(
        'fr-le-plus',
        'le plus',
        'el más',
        "C'est la veste la plus chère du magasin.",
        'Es la chaqueta más cara de la tienda.',
        ['comparison'],
        { acceptedTranslations: ['la más'], acceptedTexts: ['la plus'] },
      ),
      w(
        'fr-j-en-prends-deux',
        "j'en prends deux",
        'me llevo dos',
        "Les chemises sont bon marché: j'en prends deux.",
        'Las camisas están baratas: me llevo dos.',
        ['shopping', 'pronouns'],
        { acceptedTranslations: ['llevo dos'] },
      ),
      w(
        'fr-la-taille',
        'la taille',
        'el talle',
        'Vous faites quelle taille? — Je fais du 38.',
        '¿Qué talle usa? — Uso 38.',
        ['shopping', 'f'],
        { acceptedTranslations: ['la talla'] },
      ),
      w(
        'fr-la-pointure',
        'la pointure',
        'el número (de calzado)',
        'Vous faites quelle pointure? — Je fais du 40.',
        '¿Qué número calza? — Calzo 40.',
        ['shopping', 'f'],
      ),
      w(
        'fr-essayer',
        'essayer',
        'probarse',
        'Je peux essayer cette robe?',
        '¿Puedo probarme este vestido?',
        ['shopping', 'verbs'],
        { acceptedTranslations: ['probar'] },
      ),
      w(
        'fr-la-cabine-d-essayage',
        "la cabine d'essayage",
        'el probador',
        "La cabine d'essayage est à droite.",
        'El probador está a la derecha.',
        ['shopping', 'f'],
      ),
      w(
        'fr-les-soldes',
        'les soldes',
        'las rebajas',
        'Les soldes commencent en janvier.',
        'Las rebajas empiezan en enero.',
        ['shopping'],
        { acceptedTranslations: ['las liquidaciones', 'las ofertas'] },
      ),
      w(
        'fr-la-chemise',
        'la chemise',
        'la camisa',
        'Ta chemise blanche est très belle.',
        'Tu camisa blanca es muy linda.',
        ['clothes', 'f'],
        { emoji: '👔' },
      ),
      w(
        'fr-le-pantalon',
        'le pantalon',
        'el pantalón',
        'Ce pantalon noir est trop long.',
        'Este pantalón negro es demasiado largo.',
        ['clothes', 'm'],
        { emoji: '👖' },
      ),
      w(
        'fr-la-robe',
        'la robe',
        'el vestido',
        'Elle porte une robe rouge.',
        'Lleva un vestido rojo.',
        ['clothes', 'f'],
        { emoji: '👗' },
      ),
      w(
        'fr-les-chaussures',
        'les chaussures',
        'los zapatos',
        'Ces chaussures sont trop petites.',
        'Estos zapatos son demasiado chicos.',
        ['clothes'],
        { acceptedTranslations: ['el calzado'], emoji: '👞' },
      ),
      w(
        'fr-la-veste',
        'la veste',
        'la chaqueta',
        'Il fait froid: prends ta veste!',
        'Hace frío: ¡lleva la chaqueta!',
        ['clothes', 'f'],
        { acceptedTranslations: ['el saco', 'la campera'], emoji: '🧥' },
      ),
      w(
        'fr-payer-par-carte',
        'payer par carte',
        'pagar con tarjeta',
        'Je peux payer par carte?',
        '¿Puedo pagar con tarjeta?',
        ['shopping'],
        { emoji: '💳' },
      ),
      w(
        'fr-bon-marche',
        'bon marché',
        'barato',
        'Pendant les soldes, les vêtements sont bon marché.',
        'Durante las rebajas, la ropa está barata.',
        ['shopping'],
        { acceptedTranslations: ['barata', 'económico'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'La ropa y les soldes',
        objective: 'Nombrar la ropa y los zapatos y decir de qué color son.',
        intro: {
          explanation:
            'La chemise es la camisa, le pantalon el pantalón, la veste la chaqueta y les chaussures los zapatos. Ojo con dos falsos amigos: la robe es el vestido (la ropa en general es les vêtements) y les soldes son las rebajas (el sueldo es le salaire). El color va después y concuerda: une veste noire, des chaussures noires. La ch de chemise y de chaussures suena como la sh de show. En Francia hay soldes dos veces por año: en enero y en verano, entre fines de junio y julio.',
          examples: [
            { target: 'Je cherche une robe rouge.', base: 'Busco un vestido rojo.' },
            { target: 'Les soldes commencent en janvier.', base: 'Las rebajas empiezan en enero.' },
          ],
        },
        takeaways: [
          'Nombras la ropa: la chemise, le pantalon, la robe, la veste, les chaussures.',
          'Sabes que la robe es el vestido y les soldes, las rebajas.',
        ],
        exercises: [
          ex.translationChoice(
            'la robe',
            'el vestido',
            ['la ropa', 'la camisa', 'la chaqueta'],
            ['fr-la-robe'],
            {
              id: 'fr.ex.dpz62u473xqb5x',
              explanation:
                'Falso amigo: la robe es el vestido. La ropa en general se dice les vêtements.',
            },
          ),
          ex.matchPairs(
            [
              ['la chemise', 'la camisa'],
              ['le pantalon', 'el pantalón'],
              ['la veste', 'la chaqueta'],
              ['les chaussures', 'los zapatos'],
            ],
            ['fr-la-chemise', 'fr-le-pantalon', 'fr-la-veste', 'fr-les-chaussures'],
            { id: 'fr.ex.b37ocmcwu63yk9' },
          ),
          ex.listenChoice(
            'Une chemise blanche.',
            ['Une chemise bleue.', 'Une robe blanche.', 'Une veste blanche.'],
            ['fr-la-chemise'],
            { id: 'fr.ex.03gmu7siw6k6rf' },
          ),
          ex.fillBlank(
            'Je cherche ___ robe rouge.',
            'Busco un vestido rojo.',
            'une',
            ['un', 'le', 'les'],
            ['fr-la-robe'],
            {
              id: 'fr.ex.nj9okzpyhz1vty',
              explanation: 'Robe es femenino: une robe, aunque en español sea un vestido.',
            },
          ),
          ex.fillBlank(
            'Ma veste est ___.',
            'Mi chaqueta es negra.',
            'noire',
            ['noir', 'noirs', 'noires'],
            ['fr-la-veste'],
            {
              id: 'fr.ex.3z72g537ix0wvh',
              explanation: 'Veste es femenino singular: noire, con e.',
            },
          ),
          ex.translationChoice(
            'les soldes',
            'las rebajas',
            ['el sueldo', 'la tienda', 'la cuenta'],
            ['fr-les-soldes'],
            {
              id: 'fr.ex.lsdwhl1sxf58hi',
              explanation: 'Falso amigo: les soldes son las rebajas. El sueldo es le salaire.',
            },
          ),
          ex.listenChoice(
            'Les soldes commencent en janvier.',
            ['Les soldes commencent en juin.', 'Les soldes commencent en juillet.'],
            ['fr-les-soldes'],
            { id: 'fr.ex.z9ypxvv5z1lyup' },
          ),
          ex.orderWords(
            'Les chaussures sont très chères.',
            'Los zapatos son muy caros.',
            ['fr-les-chaussures'],
            { id: 'fr.ex.w5eac5j8825nre' },
          ),
          ex.translateWrite('Me gusta tu vestido rojo.', "J'aime ta robe rouge.", ['fr-la-robe'], {
            id: 'fr.ex.s739wxsxwjl3qn',
            acceptedAnswers: ["J'adore ta robe rouge."],
          }),
          ex.translateWrite(
            'Busco un pantalón negro y una camisa blanca.',
            'Je cherche un pantalon noir et une chemise blanche.',
            ['fr-le-pantalon', 'fr-la-chemise'],
            { id: 'fr.ex.57ionjygmkcfp6' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "La cabine d'essayage",
        objective: 'Pedir tu talle o tu número y probarte ropa.',
        intro: {
          explanation:
            "Para probarte algo: je peux essayer…? (después de je peux va el infinitivo). La taille es el talle de la ropa y la pointure, el número de los zapatos; las dos se preguntan con vous faites quelle…? y se responden con je fais du + número: je fais du 38. Te pruebas la ropa en la cabine d'essayage. Pronunciación: una s sola entre vocales suena como z (chemise), pero la ss de essayer suena s.",
          examples: [
            { target: 'Je peux essayer cette robe?', base: '¿Puedo probarme este vestido?' },
            { target: 'Vous faites quelle pointure?', base: '¿Qué número calza?' },
          ],
        },
        takeaways: [
          'Pides probarte algo con je peux essayer…?',
          'Dices tu talle y tu número con je fais du…',
        ],
        exercises: [
          ex.translationChoice(
            'essayer',
            'probarse',
            ['pagar', 'buscar', 'comprar'],
            ['fr-essayer'],
            { id: 'fr.ex.021tao0j4cpw8y' },
          ),
          ex.matchPairs(
            [
              ['essayer', 'probarse'],
              ['la taille', 'el talle'],
              ['la pointure', 'el número (de calzado)'],
              ["la cabine d'essayage", 'el probador'],
            ],
            ['fr-essayer', 'fr-la-taille', 'fr-la-pointure', 'fr-la-cabine-d-essayage'],
            { id: 'fr.ex.657fmhjvr6u3il' },
          ),
          ex.listenChoice(
            'Vous faites quelle taille?',
            ['Vous faites quelle pointure?', 'Tu fais quelle taille?'],
            ['fr-la-taille'],
            { id: 'fr.ex.cm8r6tpi2d120k' },
          ),
          ex.fillBlank(
            'Je peux ___ cette robe?',
            '¿Puedo probarme este vestido?',
            'essayer',
            ['essaie', 'essayez'],
            ['fr-essayer'],
            {
              id: 'fr.ex.vwu9v1edt6ueyf',
              explanation: 'Después de je peux va el infinitivo: je peux essayer.',
            },
          ),
          ex.fillBlank(
            'Pour les chaussures, vous faites quelle ___?',
            'Para los zapatos, ¿qué número calza?',
            'pointure',
            ['taille', 'cabine', 'couleur'],
            ['fr-la-pointure'],
            {
              id: 'fr.ex.ssyiz3323cp46h',
              skill: 'vocabulary',
              explanation:
                'Para los zapatos se dice la pointure; la taille es el talle de la ropa.',
            },
          ),
          ex.fillBlank(
            "La cabine d'essayage est ___ gauche.",
            'El probador está a la izquierda.',
            'à',
            ['au', 'dans', 'sur'],
            ['fr-la-cabine-d-essayage'],
            { id: 'fr.ex.nqsmxev3w5pjpp', explanation: 'A la izquierda: à gauche.' },
          ),
          ex.listenChoice(
            'Je fais du trente-huit.',
            ['Je fais du trente-six.', 'Je fais du quarante-huit.'],
            ['fr-la-taille'],
            { id: 'fr.ex.tc3524rnrnhacr' },
          ),
          ex.orderWords(
            "La cabine d'essayage est à droite.",
            'El probador está a la derecha.',
            ['fr-la-cabine-d-essayage'],
            { id: 'fr.ex.7985st0tk6awy6' },
          ),
          ex.translateWrite(
            '¿Puedo probarme esta camisa?',
            'Je peux essayer cette chemise?',
            ['fr-essayer', 'fr-la-chemise'],
            {
              id: 'fr.ex.4g0h2bhnztya95',
              acceptedAnswers: [
                'Est-ce que je peux essayer cette chemise?',
                'Je peux essayer la chemise?',
              ],
            },
          ),
          ex.shortAnswer(
            'Vous faites quelle pointure?',
            '¿Qué número calza? (Responde que calzas 39.)',
            'Je fais du 39.',
            ['Je fais du trente-neuf.', 'Du 39.', 'Du trente-neuf.'],
            ['fr-la-pointure'],
            { id: 'fr.ex.pu5xxy0tq3igbp' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Más caro, más barato',
        objective: 'Comparar precios y cosas con plus, moins y aussi… que.',
        intro: {
          explanation:
            "Para comparar: plus + adjetivo + que (más… que), moins + adjetivo + que (menos… que) y aussi + adjetivo + que (tan… como). Siempre que, nunca «comme»; delante de vocal, qu': aussi cher qu'à Paris. El adjetivo concuerda con el primer sustantivo: la veste est plus chère. Bon marché (barato) no cambia: des chaussures bon marché. La s final de plus y de moins no suena delante de consonante: plus cher, moins cher.",
          examples: [
            {
              target: 'La veste est plus chère que la chemise.',
              base: 'La chaqueta es más cara que la camisa.',
            },
            {
              target: 'Le vélo est moins cher que la voiture.',
              base: 'La bici es más barata que el auto.',
            },
          ],
        },
        takeaways: [
          'Comparas con plus, moins y aussi + adjetivo + que.',
          'Dices que algo es barato con bon marché, que no cambia.',
        ],
        exercises: [
          ex.translationChoice(
            'plus… que',
            'más… que',
            ['menos… que', 'tan… como', 'muy'],
            ['fr-plus-que'],
            { id: 'fr.ex.91ulnesv3i0wop' },
          ),
          ex.translationChoice(
            'bon marché',
            'barato',
            ['caro', 'bueno', 'el mercado'],
            ['fr-bon-marche'],
            {
              id: 'fr.ex.7q9s9h6d40l87n',
              explanation: 'Bon marché quiere decir barato y no cambia: des chaussures bon marché.',
            },
          ),
          ex.fillBlank(
            'La veste est ___ chère que la chemise.',
            'La chaqueta es más cara que la camisa.',
            'plus',
            ['moins', 'aussi', 'très'],
            ['fr-plus-que'],
            { id: 'fr.ex.chap7doilrme4o' },
          ),
          ex.fillBlank(
            'Le pantalon est moins cher ___ la robe.',
            'El pantalón es más barato que el vestido.',
            'que',
            ['comme', 'de', 'à'],
            ['fr-moins-que'],
            {
              id: 'fr.ex.0h8itiarukjjpc',
              explanation: 'En las comparaciones siempre va que: moins cher que.',
            },
          ),
          ex.listenChoice(
            'La robe est aussi chère que la veste.',
            ['La robe est plus chère que la veste.', 'La robe est moins chère que la veste.'],
            ['fr-aussi-que'],
            { id: 'fr.ex.gqrxx1ayg4azac' },
          ),
          ex.fillBlank(
            "Ici, les chaussures sont aussi ___ qu'à Paris.",
            'Aquí los zapatos son tan caros como en París.',
            'chères',
            ['cher', 'chère', 'chers'],
            ['fr-aussi-que', 'fr-les-chaussures'],
            {
              id: 'fr.ex.7gr6li00icou54',
              explanation:
                'Tan… como es aussi… que (nunca «comme»). Chaussures es femenino plural: chères.',
            },
          ),
          ex.matchPairs(
            [
              ['plus… que', 'más… que'],
              ['moins… que', 'menos… que'],
              ['aussi… que', 'tan… como'],
              ['bon marché', 'barato'],
            ],
            ['fr-plus-que', 'fr-moins-que', 'fr-aussi-que', 'fr-bon-marche'],
            { id: 'fr.ex.no4b5wtn30ep79' },
          ),
          ex.orderWords(
            'Le vélo est moins cher que la voiture.',
            'La bici es más barata que el auto.',
            ['fr-moins-que'],
            { id: 'fr.ex.vsaumm1srjjt90' },
          ),
          ex.translateWrite(
            'Los zapatos son más caros que la chaqueta.',
            'Les chaussures sont plus chères que la veste.',
            ['fr-plus-que', 'fr-les-chaussures'],
            { id: 'fr.ex.0dbbx8s8x2qwtk' },
          ),
          ex.translateWrite(
            'Durante las rebajas, los pantalones son baratos.',
            'Pendant les soldes, les pantalons sont bon marché.',
            ['fr-bon-marche', 'fr-les-soldes'],
            {
              id: 'fr.ex.gwjjrjxa2tyryp',
              acceptedAnswers: ['Les pantalons sont bon marché pendant les soldes.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Lo mejor y lo más',
        objective: 'Decir qué es mejor y qué es lo más caro o lo más lindo.',
        intro: {
          explanation:
            'Bon (bueno) tiene un comparativo propio: meilleur, meilleure en femenino. Nunca «plus bon». El superlativo lleva el artículo: le plus, la plus, les plus + adjetivo, y de para el grupo: la veste la plus chère du magasin. Con adjetivos que van antes del sustantivo (beau, petit, grand) el superlativo también va antes: la plus belle robe. Le meilleur, la meilleure: lo mejor de todo.',
          examples: [
            {
              target: "C'est la meilleure boulangerie de la ville.",
              base: 'Es la mejor panadería de la ciudad.',
            },
            {
              target: "C'est la veste la plus chère du magasin.",
              base: 'Es la chaqueta más cara de la tienda.',
            },
          ],
        },
        takeaways: [
          'Usas meilleur o meilleure, nunca «plus bon».',
          'Armas el superlativo con le plus o la plus.',
        ],
        exercises: [
          ex.fillBlank(
            'Ce croissant est ___ que le croissant du supermarché.',
            'Este cruasán es mejor que el del supermercado.',
            'meilleur',
            ['plus bon', 'meilleure', 'plus bien'],
            ['fr-meilleur'],
            {
              id: 'fr.ex.ldzurwh30mo3lm',
              explanation:
                'El comparativo de bon es meilleur (croissant es masculino). Nunca «plus bon».',
            },
          ),
          ex.fillBlank(
            "C'est la ___ boulangerie de la ville.",
            'Es la mejor panadería de la ciudad.',
            'meilleure',
            ['meilleur', 'plus bonne', 'bonne'],
            ['fr-meilleur'],
            {
              id: 'fr.ex.lf2zxml9lx88jr',
              explanation: 'Boulangerie es femenino: la meilleure.',
            },
          ),
          ex.listenChoice(
            "C'est la veste la plus chère du magasin.",
            [
              "C'est la veste la moins chère du magasin.",
              "C'est la robe la plus chère du magasin.",
            ],
            ['fr-le-plus'],
            { id: 'fr.ex.m7v8juz73w5698' },
          ),
          ex.fillBlank(
            "C'est le pantalon ___ plus cher du magasin.",
            'Es el pantalón más caro de la tienda.',
            'le',
            ['la', 'les', 'du'],
            ['fr-le-plus'],
            {
              id: 'fr.ex.ga56ph6avjv7sw',
              explanation: 'Pantalon es masculino singular: le pantalon le plus cher.',
            },
          ),
          question(
            'fr.ex.voknsrtcl62nyo',
            BOUTIQUE,
            '¿Qué busca Camille?',
            'Un vestido para una fiesta.',
            ['Una chaqueta para el invierno.', 'Zapatos para una fiesta.', 'Una camisa roja.'],
            ['fr-la-robe'],
            'Camille dice «Je cherche une robe pour une fête».',
          ),
          question(
            'fr.ex.r7iho4c8zfgcjc',
            BOUTIQUE,
            '¿Cómo es el precio del vestido rojo?',
            'Es más barato que el negro.',
            ['Es más caro que el negro.', 'Cuesta lo mismo que el negro.', 'No está en rebaja.'],
            ['fr-moins-que', 'fr-les-soldes'],
            'La vendedora dice «elle est moins chère» y que está «en soldes».',
          ),
          question(
            'fr.ex.jk9tkssnklxnzo',
            BOUTIQUE,
            '¿Qué talle usa Camille?',
            '38.',
            ['36.', '40.', 'No lo dice.'],
            ['fr-la-taille'],
            'Camille dice «Je fais du trente-huit».',
          ),
          question(
            'fr.ex.9mmlzf9z13jmto',
            BOUTIQUE,
            '¿Dónde se prueba el vestido?',
            'En el probador de la izquierda.',
            ['En el probador de la derecha.', 'En su casa.', 'No se lo prueba.'],
            ['fr-la-cabine-d-essayage', 'fr-essayer'],
            "La vendedora dice «La cabine d'essayage est à gauche».",
          ),
          ex.translateWrite(
            'Es la mejor panadería de París.',
            "C'est la meilleure boulangerie de Paris.",
            ['fr-meilleur'],
            { id: 'fr.ex.jq5a8t87fr5uuw' },
          ),
          ex.translateWrite(
            'Es el vestido más lindo de la tienda.',
            "C'est la plus belle robe du magasin.",
            ['fr-le-plus', 'fr-la-robe'],
            {
              id: 'fr.ex.lqp3z1jehi3f49',
              acceptedAnswers: ["C'est la robe la plus belle du magasin."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'En la caja',
        objective: 'Decir cuántos te llevas con en y pagar.',
        intro: {
          explanation:
            "Para no repetir el sustantivo con una cantidad, el francés usa en delante del verbo: des chemises? J'en prends deux (me llevo dos). En con je se apostrofa: j'en. Para pagar: payer par carte (con tarjeta: en francés par, no «avec») o en espèces (en efectivo). Escucha bien: j'en prends tiene la vocal nasal de en, como en vent; je prends no la tiene.",
          examples: [
            { target: "Des chemises? J'en prends deux.", base: '¿Camisas? Me llevo dos.' },
            { target: 'Je peux payer par carte?', base: '¿Puedo pagar con tarjeta?' },
          ],
        },
        takeaways: ["Dices cuántos te llevas con j'en prends…", 'Pagas par carte o en espèces.'],
        exercises: [
          ex.translationChoice(
            "j'en prends deux",
            'me llevo dos',
            ['quiero uno', 'tengo dos', 'pago con tarjeta'],
            ['fr-j-en-prends-deux'],
            { id: 'fr.ex.71jmwyrv00camu' },
          ),
          ex.listenChoice(
            "J'en prends deux.",
            ['Je prends deux.', "J'en prends douze."],
            ['fr-j-en-prends-deux'],
            {
              id: 'fr.ex.t43eypn10b8ngs',
              explanation: "En j'en prends se oye la vocal nasal de en; en je prends, no.",
            },
          ),
          ex.fillBlank(
            'Des pommes? Oui, ___ prends deux kilos.',
            '¿Manzanas? Sí, me llevo dos kilos.',
            "j'en",
            ['je', 'je les', "j'ai"],
            ['fr-j-en-prends-deux'],
            {
              id: 'fr.ex.vx2fxd6a2uxq47',
              explanation:
                "Con una cantidad (deux kilos), el sustantivo se reemplaza con en: j'en prends.",
            },
          ),
          ex.fillBlank(
            'Je peux payer ___ carte?',
            '¿Puedo pagar con tarjeta?',
            'par',
            ['avec', 'en', 'de'],
            ['fr-payer-par-carte'],
            {
              id: 'fr.ex.oqoj6kz1r5qsri',
              explanation: 'Con tarjeta se dice par carte; en efectivo, en espèces.',
            },
          ),
          ex.orderWords(
            "J'en prends deux pour mon frère.",
            'Me llevo dos para mi hermano.',
            ['fr-j-en-prends-deux'],
            { id: 'fr.ex.eoxegqtabdagzy' },
          ),
          question(
            'fr.ex.1bfj8mp1jddt04',
            PUBLICITE,
            '¿Hasta cuándo son las rebajas?',
            'Hasta el 4 de febrero.',
            ['Hasta el 8 de enero.', 'Hasta el 4 de enero.', 'Hasta julio.'],
            ['fr-les-soldes'],
            "El cartel dice «Soldes d'hiver: du 8 janvier au 4 février».",
          ),
          question(
            'fr.ex.kau9vpy8tswcsg',
            PUBLICITE,
            '¿Dónde están los probadores?',
            'En el primer piso.',
            ['En la planta baja.', 'Al lado de la caja.', 'No hay probadores.'],
            ['fr-la-cabine-d-essayage'],
            "El cartel dice «Cabines d'essayage au premier étage».",
          ),
          question(
            'fr.ex.odhs2oyyi66nrz',
            PUBLICITE,
            '¿Cómo se puede pagar?',
            'Con tarjeta o en efectivo.',
            ['Sólo con tarjeta.', 'Sólo en efectivo.', 'No lo dice.'],
            ['fr-payer-par-carte'],
            'El cartel dice «Paiement par carte ou en espèces».',
          ),
          ex.shortAnswer(
            'Des chemises? Vous en voulez combien?',
            '¿Camisas? ¿Cuántas quiere? (Responde que te llevas dos.)',
            "J'en prends deux.",
            ["J'en prends deux, merci.", "J'en voudrais deux.", 'Deux, merci.'],
            ['fr-j-en-prends-deux'],
            { id: 'fr.ex.q5rcc6179svod0' },
          ),
          ex.translateWrite(
            'Me llevo dos y pago con tarjeta.',
            "J'en prends deux et je paie par carte.",
            ['fr-j-en-prends-deux', 'fr-payer-par-carte'],
            {
              id: 'fr.ex.41t930cf176qdk',
              acceptedAnswers: ["J'en prends deux et je paye par carte."],
            },
          ),
        ],
      },
    ],
  },
};

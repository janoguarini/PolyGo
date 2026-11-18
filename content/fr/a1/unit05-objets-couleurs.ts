import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U5 «Objetos y colores» (docs/FR_A1_A2.md): nombrar objetos con c'est / ce sont,
 * preguntar qu'est-ce que c'est?, usar los artículos un / une / des y le / la / les, y describir con
 * colores y tamaños (concordancia y posición). Pronunciación: la s del plural no suena (livre /
 * livres; se oye le / les); la consonante final suena en el femenino (vert / verte, petit / petite,
 * grand / grande). Género distinto del español: la couleur (el color), le stylo (la birome).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SAC = dialogue(
  'fr.stim.a1-u5-sac',
  'Léa y Hugo, en la casa de un amigo, miran las cosas que hay sobre un sillón.',
  [
    ['Léa', "Hugo, qu'est-ce que c'est?"],
    ['Hugo', "C'est mon sac. Il est grand, non?"],
    ['Léa', "Oui! Et le téléphone noir, c'est ton téléphone?"],
    ['Hugo', "Non, c'est le téléphone de Paul. Mon téléphone est rouge."],
  ],
  FR_A1_RATE,
);

const ANNONCE = reading(
  'fr.stim.a1-u5-annonce',
  'ad',
  'Un anuncio de Claire en el pizarrón de la facultad.',
  [
    'À vendre!',
    'Une table blanche et quatre chaises noires: vingt euros.',
    'Un grand sac rouge: cinq euros.',
    'Des livres de français: deux euros.',
    'Claire',
  ],
  { title: 'À vendre', from: 'Claire' },
);

export const FR_A1_U05: FrUnitDef = {
  names: ['Léa', 'Hugo', 'Paul', 'Claire'],
  support: ['euros', 'vendre'],
  unit: {
    position: 5,
    title: 'Objetos y colores',
    titleEn: 'Les objets et les couleurs',
    description:
      "Objetos de todos los días con c'est / ce sont, un / une / des y le / la / les; los colores y la concordancia (vert / verte). La s del plural no suena.",
    emoji: '🎨',
    objective:
      'Podés nombrar objetos, preguntar qué es algo, decir de qué color es y describirlo con chico o grande.',
    grammar: {
      title: "Artículos · c'est / ce sont · el color después del sustantivo",
      explanation:
        "Cada sustantivo tiene género: un / le con masculinos, une / la con femeninos, l' delante de vocal y des / les en plural. A veces el género no coincide con el español: la couleur (el color), le stylo (la birome). Para nombrar algo: c'est + un / une (singular) y ce sont + des (plural); se pregunta qu'est-ce que c'est? El color va después del sustantivo y concuerda: un sac vert, une chaise verte, des chaises vertes. Petit y grand van antes: un petit livre, une grande table. La s del plural no suena: livre y livres se dicen igual, la diferencia se oye en le / les.",
      examples: [
        {
          target: "Qu'est-ce que c'est? — C'est un stylo.",
          base: '¿Qué es esto? — Es una birome.',
        },
        { target: 'Ce sont des clés.', base: 'Son llaves.' },
        { target: "C'est une petite table blanche.", base: 'Es una mesa chica y blanca.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A1 nuevo (U5). Sin revisión nativa: revisar «birome» como traducción de stylo, el uso de c'est bleu como respuesta a de quelle couleur…? y el anuncio de venta.",
    },
    words: [
      w('fr-c-est', "c'est", 'esto es', "C'est mon sac.", 'Es mi bolso.', ['basics'], {
        acceptedTranslations: ['es', 'eso es'],
      }),
      w(
        'fr-ce-sont',
        'ce sont',
        'estos son',
        'Ce sont mes clés.',
        'Estas son mis llaves.',
        ['basics'],
        {
          acceptedTranslations: ['son', 'esos son'],
        },
      ),
      w(
        'fr-qu-est-ce-que-c-est',
        "qu'est-ce que c'est?",
        '¿qué es esto?',
        "Qu'est-ce que c'est? — C'est un livre.",
        '¿Qué es esto? — Es un libro.',
        ['questions'],
        {
          acceptedTranslations: ['¿qué es eso?', '¿qué es?'],
          acceptedTexts: ["qu'est-ce que c'est?"],
        },
      ),
      w(
        'fr-le-livre',
        'le livre',
        'el libro',
        "C'est le livre de Paul.",
        'Es el libro de Paul.',
        ['objects', 'm'],
        { emoji: '📘' },
      ),
      w(
        'fr-le-stylo',
        'le stylo',
        'la birome',
        'Le stylo est bleu.',
        'La birome es azul.',
        ['objects', 'm'],
        { acceptedTranslations: ['la lapicera', 'el bolígrafo'], emoji: '🖊️' },
      ),
      w(
        'fr-le-sac',
        'le sac',
        'el bolso',
        'Mon sac est noir.',
        'Mi bolso es negro.',
        ['objects', 'm'],
        {
          acceptedTranslations: ['la cartera', 'la mochila'],
          emoji: '👜',
        },
      ),
      w('fr-la-table', 'la table', 'la mesa', 'La table est grande.', 'La mesa es grande.', [
        'objects',
        'f',
      ]),
      w(
        'fr-la-chaise',
        'la chaise',
        'la silla',
        'La chaise est petite.',
        'La silla es chica.',
        ['objects', 'f'],
        { emoji: '🪑' },
      ),
      w(
        'fr-le-telephone',
        'le téléphone',
        'el teléfono',
        "C'est ton téléphone?",
        '¿Es tu teléfono?',
        ['objects', 'm'],
        { acceptedTranslations: ['el celular'], emoji: '📱' },
      ),
      w('fr-la-cle', 'la clé', 'la llave', "J'ai la clé.", 'Tengo la llave.', ['objects', 'f'], {
        emoji: '🔑',
      }),
      w(
        'fr-la-couleur',
        'la couleur',
        'el color',
        'De quelle couleur est ton sac?',
        '¿De qué color es tu bolso?',
        ['colors', 'f'],
        { emoji: '🎨' },
      ),
      w(
        'fr-rouge',
        'rouge',
        'rojo',
        'Mon téléphone est rouge.',
        'Mi teléfono es rojo.',
        ['colors'],
        {
          acceptedTranslations: ['roja'],
          emoji: '🔴',
        },
      ),
      w('fr-bleu', 'bleu', 'azul', "J'ai un sac bleu.", 'Tengo un bolso azul.', ['colors'], {
        acceptedTexts: ['bleue'],
        emoji: '🔵',
      }),
      w('fr-vert', 'vert', 'verde', "C'est une chaise verte.", 'Es una silla verde.', ['colors'], {
        acceptedTexts: ['verte'],
        emoji: '🟢',
      }),
      w(
        'fr-noir',
        'noir',
        'negro',
        'Ce sont des stylos noirs.',
        'Son biromes negras.',
        ['colors'],
        {
          acceptedTranslations: ['negra'],
          acceptedTexts: ['noire'],
          emoji: '⚫',
        },
      ),
      w('fr-blanc', 'blanc', 'blanco', 'La table est blanche.', 'La mesa es blanca.', ['colors'], {
        acceptedTranslations: ['blanca'],
        acceptedTexts: ['blanche'],
        emoji: '⚪',
      }),
      w(
        'fr-jaune',
        'jaune',
        'amarillo',
        "J'ai une clé jaune.",
        'Tengo una llave amarilla.',
        ['colors'],
        { acceptedTranslations: ['amarilla'], emoji: '🟡' },
      ),
      w(
        'fr-petit',
        'petit',
        'chico',
        "C'est un petit livre.",
        'Es un libro chico.',
        ['adjectives'],
        {
          acceptedTranslations: ['chica', 'pequeño', 'pequeña'],
          acceptedTexts: ['petite'],
        },
      ),
      w(
        'fr-grand',
        'grand',
        'grande',
        "C'est une grande table.",
        'Es una mesa grande.',
        ['adjectives'],
        { acceptedTranslations: ['alto', 'alta'], acceptedTexts: ['grande'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "Qu'est-ce que c'est?",
        objective: "Nombrar objetos con c'est un / une y preguntar qué es algo.",
        intro: {
          explanation:
            "Para nombrar un objeto: c'est + un / une + sustantivo. Un va con los masculinos y une con los femeninos, y el género no siempre coincide con el español: le stylo es masculino (la birome). Para preguntar: qu'est-ce que c'est? En qu'est-ce que c'est la s de est no suena: se dice todo en un solo bloque. Ojo: para presentar un objeto no se usa il est (nunca «il est un stylo»).",
          examples: [
            {
              target: "Qu'est-ce que c'est? — C'est un sac.",
              base: '¿Qué es esto? — Es un bolso.',
            },
            { target: "C'est une clé.", base: 'Es una llave.' },
          ],
        },
        takeaways: [
          "Nombrás objetos con c'est un o c'est une.",
          "Preguntás qué es algo con qu'est-ce que c'est?",
        ],
        exercises: [
          ex.translationChoice(
            'le livre',
            'el libro',
            ['la llave', 'el bolso', 'la birome'],
            ['fr-le-livre'],
            { id: 'fr.ex.y74sq9sgtcf9ve' },
          ),
          ex.imageChoice('🔑', 'la clé', ['le livre', 'le sac', 'le stylo'], ['fr-la-cle'], {
            id: 'fr.ex.k4ld6cq0dt4pei',
          }),
          ex.matchPairs(
            [
              ['le livre', 'el libro'],
              ['le stylo', 'la birome'],
              ['le sac', 'el bolso'],
              ['la clé', 'la llave'],
            ],
            ['fr-le-livre', 'fr-le-stylo', 'fr-le-sac', 'fr-la-cle'],
            { id: 'fr.ex.rdabo436y4u6ty' },
          ),
          ex.listenChoice(
            "Qu'est-ce que c'est? — C'est un sac.",
            ["Qu'est-ce que c'est? — C'est un stylo.", "C'est mon sac.", "C'est un livre."],
            ['fr-qu-est-ce-que-c-est', 'fr-le-sac'],
            { id: 'fr.ex.2mnyrfgsmj00hl' },
          ),
          ex.fillBlank(
            "C'est ___ clé.",
            'Es una llave.',
            'une',
            ['un', 'le', 'les'],
            ['fr-la-cle'],
            {
              id: 'fr.ex.jex8x8zzix2cxc',
              explanation: 'Clé es femenino: une clé (y la clé).',
            },
          ),
          ex.translationChoice(
            "qu'est-ce que c'est?",
            '¿qué es esto?',
            ['esto es', '¿cómo te llamás?', '¿de dónde sos?'],
            ['fr-qu-est-ce-que-c-est'],
            { id: 'fr.ex.83owt515z557ak' },
          ),
          ex.imageChoice(
            '📱',
            'le téléphone',
            ['la clé', 'le livre', 'le stylo'],
            ['fr-le-telephone'],
            { id: 'fr.ex.idynmvc6d7e0nb' },
          ),
          ex.fillBlank(
            '___ un stylo.',
            'Es una birome.',
            "C'est",
            ['Il est', 'Je suis', 'Tu es'],
            ['fr-c-est', 'fr-le-stylo'],
            {
              id: 'fr.ex.elcl60f1jrac7m',
              explanation:
                "Para presentar un objeto: c'est + un / une. Il est va con un adjetivo (il est bleu), no con un + sustantivo.",
            },
          ),
          ex.translateWrite('Es un libro.', "C'est un livre.", ['fr-c-est', 'fr-le-livre'], {
            id: 'fr.ex.is6vakxue6yf2u',
          }),
          ex.shortAnswer(
            "Qu'est-ce que c'est? 🔑",
            '¿Qué es esto? (Respondé que es una llave.)',
            "C'est une clé.",
            ["C'est une clé!", "C'est la clé."],
            ['fr-c-est', 'fr-la-cle'],
            { id: 'fr.ex.28wop2pqedu5yq' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Le, la, les · ce sont',
        objective: 'Usar los artículos y hablar de varios objetos con ce sont.',
        intro: {
          explanation:
            "Los artículos definidos son le (masculino), la (femenino), l' delante de vocal y les (plural). En plural, un / une pasa a des, que en español muchas veces no se dice: ce sont des chaises (son sillas). Con varios objetos se usa ce sont en lugar de c'est. La s del plural no suena: livre y livres se pronuncian igual, y lo que se oye es le / les.",
          examples: [
            { target: 'Ce sont des chaises.', base: 'Son sillas.' },
            { target: "C'est la table de Claire.", base: 'Es la mesa de Claire.' },
          ],
        },
        takeaways: [
          'Elegís le, la, les o des según el género y el número.',
          "Usás c'est con un objeto y ce sont con varios.",
        ],
        exercises: [
          ex.translationChoice(
            'la chaise',
            'la silla',
            ['la mesa', 'la llave', 'el libro'],
            ['fr-la-chaise'],
            { id: 'fr.ex.b0ikwe1916g8ng' },
          ),
          ex.translationChoice(
            'la table',
            'la mesa',
            ['la silla', 'el bolso', 'el teléfono'],
            ['fr-la-table'],
            { id: 'fr.ex.63ur3qmhiu7pz8' },
          ),
          ex.listenChoice(
            'Ce sont les livres de Paul.',
            ["C'est le livre de Paul.", 'Ce sont les clés de Paul.', "C'est la clé de Paul."],
            ['fr-ce-sont', 'fr-le-livre'],
            {
              id: 'fr.ex.4yapdyuaqh9jv7',
              explanation:
                'Livre y livres suenan igual: el plural se oye en les (en vez de le) y en ce sont.',
            },
          ),
          ex.fillBlank(
            '___ des chaises.',
            'Son sillas.',
            'Ce sont',
            ["C'est", 'Il est', 'Je suis'],
            ['fr-ce-sont', 'fr-la-chaise'],
            {
              id: 'fr.ex.6qplb98dy1g7at',
              explanation:
                "Con varios objetos (des chaises) se usa ce sont; c'est es para uno solo.",
            },
          ),
          ex.fillBlank(
            "C'est ___ table de Léa.",
            'Es la mesa de Léa.',
            'la',
            ['le', 'les', 'des'],
            ['fr-la-table'],
            {
              id: 'fr.ex.f1tdk6rlc7mo25',
              explanation: 'Table es femenino y singular: la table.',
            },
          ),
          ex.matchPairs(
            [
              ['la table', 'la mesa'],
              ['la chaise', 'la silla'],
              ['ce sont', 'estos son'],
              ["c'est", 'esto es'],
            ],
            ['fr-la-table', 'fr-la-chaise', 'fr-ce-sont', 'fr-c-est'],
            { id: 'fr.ex.i5s1y40k7vgchg' },
          ),
          ex.fillBlank(
            'Ce sont ___ stylos.',
            'Son biromes.',
            'des',
            ['un', 'une', 'le'],
            ['fr-ce-sont', 'fr-le-stylo'],
            {
              id: 'fr.ex.dml5da44ht2e3s',
              explanation:
                'El plural de un / une es des. En español no se dice («son biromes»), pero en francés no se puede omitir.',
            },
          ),
          ex.orderWords(
            'Ce sont les clés de Hugo.',
            'Son las llaves de Hugo.',
            ['fr-ce-sont', 'fr-la-cle'],
            { id: 'fr.ex.mosk0c46g2k1jt' },
          ),
          ex.translateWrite('Son sillas.', 'Ce sont des chaises.', ['fr-ce-sont', 'fr-la-chaise'], {
            id: 'fr.ex.ppint9m5os8ck4',
          }),
          ex.shortAnswer(
            "Qu'est-ce que c'est? 🔑🔑",
            '¿Qué es esto? (Respondé que son llaves.)',
            'Ce sont des clés.',
            ['Ce sont des clés!'],
            ['fr-ce-sont', 'fr-la-cle'],
            { id: 'fr.ex.ua8s4cjtftq1b4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Les couleurs',
        objective: 'Decir de qué color es un objeto.',
        intro: {
          explanation:
            'El color va después del sustantivo: un sac rouge (nunca «un rouge sac»). Para preguntar: de quelle couleur est…? Couleur es femenino en francés (la couleur, el color), por eso se dice quelle y no quel; suenan igual. Rouge y jaune ya terminan en e: no cambian en femenino (une chaise rouge). En plural se agrega una s que no suena: des sacs rouges.',
          examples: [
            { target: "C'est un sac rouge.", base: 'Es un bolso rojo.' },
            {
              target: 'De quelle couleur est ton téléphone?',
              base: '¿De qué color es tu teléfono?',
            },
          ],
        },
        takeaways: [
          'Ponés el color después del sustantivo.',
          'Preguntás el color con de quelle couleur est…?',
        ],
        exercises: [
          ex.imageChoice('🔴', 'rouge', ['vert', 'bleu', 'jaune'], ['fr-rouge'], {
            id: 'fr.ex.uwbclrjyu2drsr',
          }),
          ex.matchPairs(
            [
              ['rouge', 'rojo'],
              ['bleu', 'azul'],
              ['vert', 'verde'],
              ['jaune', 'amarillo'],
            ],
            ['fr-rouge', 'fr-bleu', 'fr-vert', 'fr-jaune'],
            { id: 'fr.ex.19gmwbh75x72lb' },
          ),
          ex.translationChoice('noir', 'negro', ['blanco', 'azul', 'verde'], ['fr-noir'], {
            id: 'fr.ex.drqz4ukgkbmkx9',
          }),
          ex.fillBlank(
            'Mon sac est ___.',
            'Mi bolso es negro.',
            'noir',
            ['rouge', 'jaune', 'bleu'],
            ['fr-noir', 'fr-le-sac'],
            { id: 'fr.ex.yrqjcedv5um3ga', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Un stylo bleu.',
            ['Un stylo vert.', 'Un stylo noir.', 'Un sac bleu.'],
            ['fr-bleu', 'fr-le-stylo'],
            { id: 'fr.ex.9v4scw6vkkvg29' },
          ),
          ex.translationChoice(
            'la couleur',
            'el color',
            ['la mesa', 'la silla', 'la llave'],
            ['fr-la-couleur'],
            {
              id: 'fr.ex.4cxhkfiknk3go6',
              explanation:
                'Couleur es femenino en francés: la couleur, aunque en español sea el color.',
            },
          ),
          ex.fillBlank(
            'De ___ couleur est ton téléphone?',
            '¿De qué color es tu teléfono?',
            'quelle',
            ['quel', 'que', 'où'],
            ['fr-la-couleur', 'fr-le-telephone'],
            {
              id: 'fr.ex.scqn6g1ot626lw',
              explanation:
                'Couleur es femenina: de quelle couleur. Quel es para masculinos (quel âge); las dos formas suenan igual.',
            },
          ),
          ex.orderWords("C'est un sac rouge.", 'Es un bolso rojo.', ['fr-rouge', 'fr-le-sac'], {
            id: 'fr.ex.t848hmjistumxh',
          }),
          ex.translateWrite(
            'Tengo un libro amarillo.',
            "J'ai un livre jaune.",
            ['fr-jaune', 'fr-le-livre'],
            { id: 'fr.ex.065y6eo4p46wqp' },
          ),
          ex.shortAnswer(
            'De quelle couleur est ton sac?',
            '¿De qué color es tu bolso? (Respondé que es azul.)',
            'Il est bleu.',
            ['Mon sac est bleu.', "C'est bleu.", 'Bleu.'],
            ['fr-bleu', 'fr-la-couleur'],
            { id: 'fr.ex.ezezpf6hwnozuj' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Vert, verte · petit, grand',
        objective: 'Hacer concordar el color y el tamaño con el sustantivo.',
        intro: {
          explanation:
            'Los adjetivos concuerdan: + e en femenino y + s en plural (un sac vert, une chaise verte, des chaises vertes). Blanc es irregular: blanche. Escuchá la diferencia: en vert, petit y grand la consonante final no suena, pero en verte, petite y grande sí. En noir / noire y bleu / bleue no se oye ningún cambio. Petit y grand van antes del sustantivo: un petit livre, une grande table.',
          examples: [
            { target: 'La table est blanche.', base: 'La mesa es blanca.' },
            { target: "C'est un petit livre vert.", base: 'Es un libro verde chico.' },
          ],
        },
        takeaways: [
          'Hacés concordar el adjetivo: vert, verte, verts, vertes.',
          'Ponés petit y grand antes del sustantivo y el color después.',
        ],
        exercises: [
          ex.translationChoice('blanc', 'blanco', ['negro', 'amarillo', 'azul'], ['fr-blanc'], {
            id: 'fr.ex.lpr8mtv4eahh0g',
          }),
          ex.matchPairs(
            [
              ['petit', 'chico'],
              ['grand', 'grande'],
              ['blanc', 'blanco'],
              ['noir', 'negro'],
            ],
            ['fr-petit', 'fr-grand', 'fr-blanc', 'fr-noir'],
            { id: 'fr.ex.iel6ccmkz7taai' },
          ),
          ex.fillBlank(
            'La table est ___.',
            'La mesa es blanca.',
            'blanche',
            ['blanc', 'blancs', 'blanches'],
            ['fr-blanc', 'fr-la-table'],
            {
              id: 'fr.ex.uv5zfjjdllhzl3',
              explanation: 'Table es femenino singular: blanche (el femenino irregular de blanc).',
            },
          ),
          ex.listenChoice(
            'Une petite clé.',
            ['Un petit sac.', 'Une grande clé.', 'Un petit livre.'],
            ['fr-petit', 'fr-la-cle'],
            {
              id: 'fr.ex.v9pnv965xv2u02',
              explanation: 'En petite la t final suena; en petit, no.',
            },
          ),
          ex.fillBlank(
            "C'est une ___ chaise.",
            'Es una silla chica.',
            'petite',
            ['petit', 'petits', 'grand'],
            ['fr-petit', 'fr-la-chaise'],
            {
              id: 'fr.ex.j65l6tqygp0fko',
              explanation: 'Chaise es femenino: petite, con una t que sí se pronuncia.',
            },
          ),
          ex.fillBlank(
            'Ce sont des chaises ___.',
            'Son sillas verdes.',
            'vertes',
            ['vert', 'verts', 'verte'],
            ['fr-vert', 'fr-la-chaise'],
            {
              id: 'fr.ex.qgyprrd7yt104b',
              explanation: 'Chaises es femenino plural: vert + e + s = vertes.',
            },
          ),
          question(
            'fr.ex.drn4npe98adhc8',
            SAC,
            '¿Cómo es el bolso de Hugo?',
            'Grande.',
            ['Chico.', 'Rojo.', 'Negro.'],
            ['fr-grand', 'fr-le-sac'],
            "Hugo dice «C'est mon sac. Il est grand, non?».",
          ),
          question(
            'fr.ex.okcj6vfnsk3eh9',
            SAC,
            '¿De quién es el teléfono negro?',
            'De Paul.',
            ['De Hugo.', 'De Léa.', 'No lo dice.'],
            ['fr-noir', 'fr-le-telephone'],
            "Léa pregunta por «le téléphone noir» y Hugo responde «c'est le téléphone de Paul».",
          ),
          ex.translateWrite(
            'Es una mesa grande.',
            "C'est une grande table.",
            ['fr-grand', 'fr-la-table'],
            { id: 'fr.ex.iqrxxb0dgvur0m' },
          ),
          ex.translateWrite(
            'Tengo una birome verde.',
            "J'ai un stylo vert.",
            ['fr-vert', 'fr-le-stylo'],
            {
              id: 'fr.ex.dh5n2q35rss7fj',
              explanation: 'Stylo es masculino en francés: un stylo vert, sin e.',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'À vendre!',
        objective: 'Entender y describir objetos con su color y su tamaño.',
        intro: {
          explanation:
            "Ya podés describir objetos completos: artículo + (petit / grand) + sustantivo + color, con concordancia. Una table blanche, des chaises noires, un grand sac rouge. Recordá que la s del plural no suena: para saber si es uno o varios, escuchá el artículo (le / les, un / des) y c'est / ce sont.",
          examples: [
            { target: 'Un grand sac rouge.', base: 'Un bolso rojo grande.' },
            { target: 'Ce sont des clés jaunes.', base: 'Son llaves amarillas.' },
          ],
        },
        takeaways: [
          'Describís un objeto con su tamaño y su color.',
          'Distinguís singular y plural por el artículo, no por la s.',
        ],
        exercises: [
          question(
            'fr.ex.pkp4u8ngmdr53w',
            ANNONCE,
            '¿Cuántas sillas vende Claire?',
            'Cuatro.',
            ['Dos.', 'Una.', 'Veinte.'],
            ['fr-la-chaise'],
            'El anuncio dice «quatre chaises noires».',
          ),
          question(
            'fr.ex.qmx4m68f1qbzwv',
            ANNONCE,
            '¿De qué color es la mesa?',
            'Blanca.',
            ['Negra.', 'Roja.', 'Amarilla.'],
            ['fr-la-table', 'fr-blanc'],
            'El anuncio dice «une table blanche»; las sillas son negras (noires).',
          ),
          question(
            'fr.ex.jpy81mfmdp1yuv',
            ANNONCE,
            '¿Cuánto cuesta el bolso rojo?',
            'Cinco euros.',
            ['Veinte euros.', 'Dos euros.', 'Cuatro euros.'],
            ['fr-le-sac', 'fr-rouge', 'fr-grand'],
            'El anuncio dice «Un grand sac rouge: cinq euros».',
          ),
          question(
            'fr.ex.0mwh8e23c6cur3',
            SAC,
            '¿De qué color es el teléfono de Hugo?',
            'Rojo.',
            ['Negro.', 'Azul.', 'Blanco.'],
            ['fr-rouge', 'fr-le-telephone'],
            'Hugo dice «Mon téléphone est rouge»; el negro es el de Paul.',
          ),
          ex.listenChoice(
            'Ce sont des clés jaunes.',
            ["C'est une clé jaune.", 'Ce sont des clés blanches.', 'Ce sont des stylos jaunes.'],
            ['fr-ce-sont', 'fr-jaune'],
            {
              id: 'fr.ex.zsmsy7b7f5gs3m',
              explanation: 'Clé y clés suenan igual: el plural se oye en ce sont y des.',
            },
          ),
          ex.fillBlank(
            "Qu'est-ce que c'est? — ___ un téléphone.",
            '¿Qué es esto? — Es un teléfono.',
            "C'est",
            ['Ce sont', 'Il est', 'Elle est'],
            ['fr-c-est', 'fr-le-telephone'],
            {
              id: 'fr.ex.8vk7tseibl25iw',
              explanation: "Un solo objeto con un: c'est un téléphone.",
            },
          ),
          ex.orderWords(
            'Le livre de Léa est vert.',
            'El libro de Léa es verde.',
            ['fr-le-livre', 'fr-vert'],
            { id: 'fr.ex.fjh7asqpequx75' },
          ),
          ex.imageChoice('🪑', 'la chaise', ['la table', 'la clé', 'le sac'], ['fr-la-chaise'], {
            id: 'fr.ex.k3f6dsckqp4k2d',
          }),
          ex.translateWrite(
            'Son llaves negras.',
            'Ce sont des clés noires.',
            ['fr-ce-sont', 'fr-noir', 'fr-la-cle'],
            { id: 'fr.ex.3298qh4g0x372a' },
          ),
          ex.shortAnswer(
            "Qu'est-ce que c'est? 📕",
            '¿Qué es esto? (Respondé que es un libro rojo.)',
            "C'est un livre rouge.",
            ["C'est un livre rouge!", "C'est le livre rouge."],
            ['fr-c-est', 'fr-le-livre', 'fr-rouge'],
            { id: 'fr.ex.rw3jr09p31j4pz' },
          ),
        ],
      },
    ],
  },
};

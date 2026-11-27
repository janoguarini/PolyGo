import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U12 «Preguntas, compras y precios» (docs/FR_A1_A2.md): tres maneras de preguntar
 * (entonación: tu parles français?; est-ce que tu parles français?; inversión: parles-tu
 * français?); qui, qu'est-ce que, comment, pourquoi / parce que, combien, quel / quelle; números
 * hasta 100 (soixante-dix = 60 + 10, quatre-vingts = 4 × 20); precios en euros.
 * Pronunciación: qu suena como k; pares treize / trente / trois y quinze / cinq; liaison con euros
 * (deux euros con sonido z, vingt euros con sonido t). Cultura: se saluda al entrar al magasin; en
 * Bélgica y Suiza se dice septante y nonante. Falso amigo: le magasin es la tienda.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MAGASIN = dialogue(
  'fr.stim.a1-u12-magasin',
  'Julie entra a una tienda de bolsos y habla con el vendedor.',
  [
    ['Marc', "Bonjour, madame! Qu'est-ce que vous cherchez?"],
    ['Julie', 'Bonjour! Je cherche un sac pour ma fille.'],
    ['Marc', 'Quelle couleur?'],
    ['Julie', "Rouge. C'est combien, le sac rouge?"],
    ['Marc', 'Cinquante euros.'],
    ['Julie', "C'est cher! Et le sac noir?"],
    ['Marc', 'Trente euros.'],
    ['Julie', 'Je prends le sac noir, merci.'],
  ],
  FR_A1_RATE,
);

const ANNONCE = reading(
  'fr.stim.a1-u12-annonce',
  'ad',
  'Un cartel en la vitrina de una tienda.',
  [
    'Livres, stylos et sacs: pas chers!',
    'Le livre: quinze euros.',
    'Le stylo: deux euros.',
    'Le sac: quarante euros.',
    'Samedi et dimanche: le sac à trente euros!',
  ],
  { title: 'Magasin Lafont' },
);

export const FR_A1_U12: FrUnitDef = {
  names: ['Marc', 'Julie', 'Lafont', 'Lyon', 'Paris', 'Léa', 'Hugo'],
  support: ['cherchez'],
  unit: {
    position: 12,
    title: 'Preguntas, compras y precios',
    titleEn: 'Questions et achats',
    description:
      "Tres maneras de preguntar (entonación, est-ce que, inversión); qui, qu'est-ce que, comment, pourquoi / parce que, combien, quel / quelle; números hasta 100 y precios en euros. Falso amigo: le magasin.",
    emoji: '🛍️',
    objective:
      'Puedes hacer preguntas de distintas maneras, preguntar y entender precios hasta 100 euros y pedir lo que buscas en una tienda.',
    grammar: {
      title: 'Tres maneras de preguntar · quel / quelle · los números',
      explanation:
        "Una pregunta de sí o no se hace de tres maneras: con la entonación (tu parles français?, lo más común al hablar), con est-ce que delante (est-ce que tu parles français?, neutro) o con inversión del verbo y el pronombre unidos por un guion (parles-tu français?, más formal y escrito). Para pedir información: qui (quién), qu'est-ce que (qué), comment (cómo), pourquoi (por qué, y se responde parce que), combien (cuánto; combien de + sustantivo, sin artículo). Quel concuerda con el sustantivo: quel sac, quelle couleur, y suenan igual. Los números siguen una lógica propia: 70 es soixante-dix (60 + 10), 80 es quatre-vingts (4 × 20) y 90, quatre-vingt-dix.",
      examples: [
        { target: 'Est-ce que tu parles français?', base: '¿Hablas francés?' },
        {
          target: "Pourquoi tu aimes Paris? — Parce que c'est une grande ville.",
          base: '¿Por qué te gusta París? — Porque es una ciudad grande.',
        },
        { target: "C'est combien? — Quarante euros.", base: '¿Cuánto cuesta? — Cuarenta euros.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A1 nuevo (U12). Sin revisión nativa: revisar la naturalidad de «C'est combien, le sac rouge?» y el formato del cartel («Le livre: quinze euros»).",
    },
    words: [
      w(
        'fr-qui',
        'qui',
        'quién',
        "Qui est-ce? — C'est mon frère.",
        '¿Quién es? — Es mi hermano.',
        ['questions'],
        {
          acceptedTranslations: ['quiénes'],
        },
      ),
      w(
        'fr-qu-est-ce-que',
        "qu'est-ce que",
        'qué (para preguntar)',
        "Qu'est-ce que tu cherches?",
        '¿Qué buscas?',
        ['questions'],
        {
          acceptedTexts: ["qu'est-ce que"],
        },
      ),
      w(
        'fr-pourquoi',
        'pourquoi',
        'por qué',
        'Pourquoi tu habites à Lyon?',
        '¿Por qué vives en Lyon?',
        ['questions'],
      ),
      w(
        'fr-parce-que',
        'parce que',
        'porque',
        "J'aime Lyon parce que c'est une grande ville.",
        'Me gusta Lyon porque es una ciudad grande.',
        ['questions'],
      ),
      w(
        'fr-comment',
        'comment',
        'cómo',
        'Comment est ton appartement?',
        '¿Cómo es tu apartamento?',
        ['questions'],
      ),
      w(
        'fr-combien',
        'combien',
        'cuánto',
        'Tu as combien de livres?',
        '¿Cuántos libros tienes?',
        ['questions', 'shopping'],
        {
          acceptedTranslations: ['cuántos', 'cuánta', 'cuántas'],
        },
      ),
      w(
        'fr-c-est-combien',
        "c'est combien?",
        '¿cuánto cuesta?',
        "Le croissant, c'est combien?",
        '¿Cuánto cuesta el cruasán?',
        ['shopping', 'questions'],
        {
          acceptedTranslations: ['¿cuánto es?', '¿cuánto sale?'],
          acceptedTexts: ["c'est combien?"],
        },
      ),
      w(
        'fr-quel',
        'quel',
        'cuál (+ sustantivo)',
        'Quel sac tu préfères?',
        '¿Qué bolso prefieres?',
        ['questions'],
        {
          acceptedTranslations: ['qué + sustantivo', 'cuáles'],
          acceptedTexts: ['quelle'],
        },
      ),
      w('fr-cher', 'cher', 'caro', 'Le vin est cher.', 'El vino es caro.', ['shopping'], {
        acceptedTranslations: ['cara'],
        acceptedTexts: ['chère'],
        emoji: '💸',
      }),
      w(
        'fr-le-magasin',
        'le magasin',
        'la tienda',
        'Le magasin est à côté de la banque.',
        'La tienda está al lado del banco.',
        ['shopping', 'places', 'm'],
        {
          acceptedTranslations: ['el negocio', 'el local'],
          emoji: '🏬',
        },
      ),
      w(
        'fr-l-euro',
        "l'euro",
        'el euro',
        "Le café, c'est deux euros.",
        'El café cuesta dos euros.',
        ['shopping', 'm'],
        {
          acceptedTexts: ["l'euro"],
          emoji: '💶',
        },
      ),
      w(
        'fr-je-cherche',
        'je cherche',
        'busco',
        "Je cherche la gare, s'il vous plaît.",
        'Busco la estación, por favor.',
        ['verbs', 'shopping'],
        {
          acceptedTranslations: ['estoy buscando'],
        },
      ),
      w('fr-treize', 'treize', 'trece', "J'ai treize ans.", 'Tengo trece años.', ['numbers']),
      w(
        'fr-quinze',
        'quinze',
        'quince',
        "Le livre, c'est quinze euros.",
        'El libro cuesta quince euros.',
        ['numbers'],
      ),
      w(
        'fr-trente',
        'trente',
        'treinta',
        'Mon frère a trente ans.',
        'Mi hermano tiene treinta años.',
        ['numbers'],
      ),
      w(
        'fr-quarante',
        'quarante',
        'cuarenta',
        'Ma mère a quarante ans.',
        'Mi mamá tiene cuarenta años.',
        ['numbers'],
      ),
      w(
        'fr-cinquante',
        'cinquante',
        'cincuenta',
        "Le sac, c'est cinquante euros.",
        'El bolso cuesta cincuenta euros.',
        ['numbers'],
      ),
      w(
        'fr-soixante',
        'soixante',
        'sesenta',
        'Mon grand-père a soixante-dix ans.',
        'Mi abuelo tiene setenta años.',
        ['numbers'],
      ),
      w(
        'fr-cent',
        'cent',
        'cien',
        "Le téléphone, c'est cent euros? C'est cher!",
        '¿El teléfono cuesta cien euros? ¡Es caro!',
        ['numbers'],
        {
          acceptedTranslations: ['ciento'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "Qui, qu'est-ce que, comment",
        objective: 'Hacer preguntas de tres maneras y preguntar quién, qué y cómo.',
        intro: {
          explanation:
            "Una pregunta de sí o no se hace de tres maneras: con la entonación (tu parles français?, lo más común al hablar), con est-ce que (est-ce que tu parles français?) o con inversión (parles-tu français?, más formal). Para pedir información: qui es quién, qu'est-ce que es qué y comment es cómo. En qui y en qu'est-ce que, qu suena como una k.",
          examples: [
            { target: 'Est-ce que tu parles français?', base: '¿Hablas francés?' },
            { target: 'Parles-tu français?', base: '¿Hablas francés? (formal)' },
            { target: "Qui est-ce? — C'est ma sœur.", base: '¿Quién es? — Es mi hermana.' },
          ],
        },
        takeaways: [
          'Preguntas sí o no con la entonación, con est-ce que o con inversión.',
          "Preguntas quién, qué y cómo con qui, qu'est-ce que y comment.",
        ],
        exercises: [
          ex.translationChoice(
            'qui',
            'quién',
            ['qué (para preguntar)', 'cómo', 'dónde'],
            ['fr-qui'],
            {
              id: 'fr.ex.j0uuxo56ziktc3',
            },
          ),
          ex.translationChoice('comment', 'cómo', ['cuándo', 'quién', 'dónde'], ['fr-comment'], {
            id: 'fr.ex.kybojpo44x8b7j',
          }),
          ex.fillBlank(
            "___ est-ce? — C'est ma sœur.",
            '¿Quién es? — Es mi hermana.',
            'Qui',
            ['Quel', 'Quand', 'Comment'],
            ['fr-qui'],
            {
              id: 'fr.ex.9mafonzhae25fb',
              skill: 'vocabulary',
              explanation: 'Para preguntar por una persona: qui est-ce?',
            },
          ),
          ex.fillBlank(
            '___ tu manges? — Je mange un croissant.',
            '¿Qué comes? — Como un cruasán.',
            "Qu'est-ce que",
            ['Qui', 'Comment', 'Quand'],
            ['fr-qu-est-ce-que'],
            {
              id: 'fr.ex.vleihjboyfkb6l',
              skill: 'vocabulary',
              explanation: "Para preguntar qué: qu'est-ce que + tu + verbo.",
            },
          ),
          ex.listenChoice(
            'Qui est-ce?',
            ["Qu'est-ce que c'est?", 'Qui est Léa?', 'Quel âge as-tu?'],
            ['fr-qui'],
            {
              id: 'fr.ex.4z9y83x46hjaki',
              explanation:
                "Qui est-ce? pregunta por una persona; qu'est-ce que c'est?, por una cosa.",
            },
          ),
          ex.matchPairs(
            [
              ['qui', 'quién'],
              ["qu'est-ce que", 'qué (para preguntar)'],
              ['comment', 'cómo'],
              ['où', 'dónde'],
            ],
            ['fr-qui', 'fr-qu-est-ce-que', 'fr-comment', 'fr-ou'],
            { id: 'fr.ex.azhaijb4p5qci0' },
          ),
          ex.fillBlank(
            '___ tu parles français?',
            '¿Hablas francés?',
            'Est-ce que',
            ["Qu'est-ce que", 'Qui', 'Comment'],
            ['fr-qu-est-ce-que'],
            {
              id: 'fr.ex.0zyb6rginnkneh',
              explanation:
                "Para una pregunta de sí o no: est-ce que. Qu'est-ce que pide una información: qué.",
            },
          ),
          ex.orderWords(
            'Comment est ton appartement?',
            '¿Cómo es tu apartamento?',
            ['fr-comment'],
            {
              id: 'fr.ex.dwze4a8yep9vvy',
            },
          ),
          ex.translateWrite('¿Quién es? Es mi papá.', "Qui est-ce? C'est mon père.", ['fr-qui'], {
            id: 'fr.ex.ug8jpb9uyno5k9',
            acceptedAnswers: ["C'est qui? C'est mon père."],
          }),
          ex.shortAnswer(
            "Qu'est-ce que tu manges le matin?",
            '¿Qué comes por la mañana? (Responde que comes pan.)',
            'Je mange du pain.',
            ['Le matin, je mange du pain.', 'Je mange du pain le matin.'],
            ['fr-qu-est-ce-que'],
            { id: 'fr.ex.h2e6u4u76hruet' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Pourquoi? Parce que…',
        objective: 'Preguntar y explicar por qué, y preguntar cuál con quel.',
        intro: {
          explanation:
            "Pourquoi es por qué (una palabra) y se responde con parce que (dos palabras): es al revés que en español. Delante de vocal, parce que se vuelve parce qu': parce qu'il… Quel va delante de un sustantivo y concuerda con él: quel sac, quelle couleur (quels, quelles en plural). Las cuatro formas suenan igual.",
          examples: [
            {
              target: "Pourquoi tu aimes Lyon? — Parce que c'est une grande ville.",
              base: '¿Por qué te gusta Lyon? — Porque es una ciudad grande.',
            },
            { target: 'Quelle couleur tu préfères?', base: '¿Qué color prefieres?' },
          ],
        },
        takeaways: [
          'Preguntas pourquoi? y respondes parce que…',
          'Usas quel o quelle según el género del sustantivo.',
        ],
        exercises: [
          ex.translationChoice(
            'pourquoi',
            'por qué',
            ['porque', 'cuándo', 'quién'],
            ['fr-pourquoi'],
            {
              id: 'fr.ex.aha9dz538mxwtc',
            },
          ),
          ex.matchPairs(
            [
              ['pourquoi', 'por qué'],
              ['parce que', 'porque'],
              ['quel', 'cuál (+ sustantivo)'],
              ['comment', 'cómo'],
            ],
            ['fr-pourquoi', 'fr-parce-que', 'fr-quel', 'fr-comment'],
            { id: 'fr.ex.7r1rcsayxeg1gl' },
          ),
          ex.fillBlank(
            "Pourquoi tu aimes Lyon? — ___ c'est une grande ville.",
            '¿Por qué te gusta Lyon? — Porque es una ciudad grande.',
            'Parce que',
            ['Pourquoi', 'Quand', 'Comment'],
            ['fr-parce-que', 'fr-pourquoi'],
            {
              id: 'fr.ex.damqfii0is3ldp',
              explanation: 'Se pregunta con pourquoi y se responde con parce que.',
            },
          ),
          ex.fillBlank(
            '___ couleur tu préfères?',
            '¿Qué color prefieres?',
            'Quelle',
            ['Quel', 'Quels', 'Qui'],
            ['fr-quel'],
            {
              id: 'fr.ex.cdi4yb17q1cxko',
              explanation:
                'La couleur es femenino en francés (el color, en español): quelle couleur.',
            },
          ),
          ex.fillBlank(
            '___ sac tu préfères?',
            '¿Qué bolso prefieres?',
            'Quel',
            ['Quelle', 'Quelles', "Qu'est-ce que"],
            ['fr-quel'],
            { id: 'fr.ex.g2x6srkj6kwe18', explanation: 'Le sac es masculino singular: quel sac.' },
          ),
          ex.listenChoice(
            'Pourquoi tu habites à Paris?',
            [
              'Pourquoi tu habites à Lyon?',
              "Parce que j'habite à Paris.",
              'Où est-ce que tu habites?',
            ],
            ['fr-pourquoi'],
            { id: 'fr.ex.ph400o4mopodsf' },
          ),
          ex.translationChoice(
            'parce que',
            'porque',
            ['por qué', 'pero', 'también'],
            ['fr-parce-que'],
            {
              id: 'fr.ex.3m6vlpxouvnwp3',
            },
          ),
          ex.orderWords('Quel sac tu préfères?', '¿Qué bolso prefieres?', ['fr-quel'], {
            id: 'fr.ex.1u58gbw9cr7o7h',
          }),
          ex.translateWrite(
            '¿Por qué te gusta el fútbol?',
            'Pourquoi tu aimes le foot?',
            ['fr-pourquoi'],
            {
              id: 'fr.ex.gmpqddsidogu7u',
              acceptedAnswers: [
                'Pourquoi est-ce que tu aimes le foot?',
                'Pourquoi aimes-tu le foot?',
              ],
            },
          ),
          ex.shortAnswer(
            'Pourquoi tu aimes Paris?',
            '¿Por qué te gusta París? (Responde: porque es una ciudad grande.)',
            "Parce que c'est une grande ville.",
            [
              "J'aime Paris parce que c'est une grande ville.",
              'Parce que Paris est une grande ville.',
            ],
            ['fr-parce-que'],
            { id: 'fr.ex.ys137gkii75qop' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'De treize à cent',
        objective: 'Entender y decir números hasta 100.',
        intro: {
          explanation:
            'Las decenas: trente, quarante, cinquante, soixante. Después, el francés de Francia suma y multiplica: 70 es soixante-dix (60 + 10), 80 es quatre-vingts (4 × 20) y 90, quatre-vingt-dix. Con 1 se dice et un: trente et un; con los demás, guion: trente-cinq. Cent es 100. En Bélgica y Suiza se dice septante (70) y nonante (90). Ojo al escuchar: treize, trente y trois se parecen, igual que quinze y cinq.',
          examples: [
            { target: "J'ai quinze ans.", base: 'Tengo quince años.' },
            { target: 'Mon grand-père a soixante-dix ans.', base: 'Mi abuelo tiene setenta años.' },
          ],
        },
        takeaways: [
          'Cuentas de diez en diez hasta cent.',
          'Armas soixante-dix y quatre-vingts sumando y multiplicando.',
        ],
        exercises: [
          ex.translationChoice('treize', 'trece', ['tres', 'treinta', 'doce'], ['fr-treize'], {
            id: 'fr.ex.zjhrrvab261e4z',
          }),
          ex.matchPairs(
            [
              ['treize', 'trece'],
              ['quinze', 'quince'],
              ['trente', 'treinta'],
              ['quarante', 'cuarenta'],
            ],
            ['fr-treize', 'fr-quinze', 'fr-trente', 'fr-quarante'],
            { id: 'fr.ex.joxc34obvcdve1' },
          ),
          ex.listenChoice('treize', ['trente', 'trois', 'douze'], ['fr-treize', 'fr-trente'], {
            id: 'fr.ex.f9j4i229wtdzna',
            explanation:
              'En treize la z suena como una s sonora; trente termina en una t que sí suena.',
          }),
          ex.translationChoice(
            'soixante',
            'sesenta',
            ['setenta', 'seis', 'dieciséis'],
            ['fr-soixante'],
            {
              id: 'fr.ex.wwhxn75qm900uy',
            },
          ),
          ex.fillBlank(
            'Mon grand-père a soixante-___ ans.',
            'Mi abuelo tiene setenta años.',
            'dix',
            ['vingt', 'six', 'sept'],
            ['fr-soixante'],
            {
              id: 'fr.ex.z8sjahhk6qx7v9',
              skill: 'vocabulary',
              explanation: 'Setenta es soixante-dix: sesenta más diez.',
            },
          ),
          ex.matchPairs(
            [
              ['cinquante', 'cincuenta'],
              ['soixante', 'sesenta'],
              ['quatre-vingts', 'ochenta'],
              ['cent', 'cien'],
            ],
            ['fr-cinquante', 'fr-soixante', 'fr-cent'],
            { id: 'fr.ex.z2rvrkwyj3czhn' },
          ),
          ex.fillBlank(
            'Ma mère a ___ ans.',
            'Mi mamá tiene cuarenta años.',
            'quarante',
            ['quatre', 'cinquante', 'trente'],
            ['fr-quarante'],
            { id: 'fr.ex.m0bg3icw9d9qf6', skill: 'vocabulary' },
          ),
          ex.listenChoice('quinze', ['cinq', 'quarante', 'onze'], ['fr-quinze'], {
            id: 'fr.ex.anz5gsvxkn38dt',
            explanation:
              'Quinze tiene la vocal nasal de vin al principio y termina en z; cinq termina en k.',
          }),
          ex.translateWrite('Tengo quince años.', "J'ai quinze ans.", ['fr-quinze'], {
            id: 'fr.ex.68l2q5it5nybx7',
          }),
          ex.shortAnswer(
            'Quel âge a ton grand-père?',
            '¿Cuántos años tiene tu abuelo? (Responde que tiene sesenta años.)',
            'Il a soixante ans.',
            ['Mon grand-père a soixante ans.', 'Soixante ans.'],
            ['fr-soixante'],
            { id: 'fr.ex.t6q9mtiolsqw1f' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "C'est combien?",
        objective: 'Buscar algo en una tienda y preguntar el precio.',
        intro: {
          explanation:
            "Al entrar a un magasin (falso amigo: es la tienda) se saluda con bonjour. Para pedir: je cherche + lo que buscas. Para el precio: c'est combien? Con euros hay liaison: deux euros y trois euros se unen con un sonido z; vingt euros y cent euros, con un sonido t. Y si es mucho: c'est cher!",
          examples: [
            { target: 'Bonjour! Je cherche un sac.', base: '¡Buenos días! Busco un bolso.' },
            { target: "C'est combien? — Trente euros.", base: '¿Cuánto cuesta? — Treinta euros.' },
          ],
        },
        takeaways: [
          'Pides lo que buscas con je cherche.',
          "Preguntas el precio con c'est combien? y entiendes la respuesta en euros.",
        ],
        exercises: [
          ex.translationChoice(
            'le magasin',
            'la tienda',
            ['la revista', 'el banco', 'la calle'],
            ['fr-le-magasin'],
            {
              id: 'fr.ex.v03lukq6hzqmxz',
              explanation: 'Falso amigo: le magasin es la tienda, cualquier negocio.',
            },
          ),
          ex.translationChoice(
            'je cherche',
            'busco',
            ['compro', 'tomo', 'miro'],
            ['fr-je-cherche'],
            {
              id: 'fr.ex.4lakrjbyj0a75k',
            },
          ),
          ex.fillBlank(
            'Bonjour, madame. Je ___ un sac noir.',
            'Buenos días, señora. Busco un bolso negro.',
            'cherche',
            ['cherches', 'cherchez'],
            ['fr-je-cherche'],
            {
              id: 'fr.ex.xi5t5sb5rm7ci3',
              explanation: 'Con je: je cherche. Tu cherches y vous cherchez son otras personas.',
            },
          ),
          ex.fillBlank(
            "Le croissant, c'est ___?",
            '¿Cuánto cuesta el cruasán?',
            'combien',
            ['comment', 'quand', 'qui'],
            ['fr-c-est-combien'],
            { id: 'fr.ex.1b4drj0nwlox9e', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            "C'est trente euros.",
            ["C'est treize euros.", "C'est trois euros.", "C'est quarante euros."],
            ['fr-trente', 'fr-l-euro'],
            { id: 'fr.ex.f5kfv9xe2fuwf7' },
          ),
          ex.fillBlank(
            "Cent euros? C'est ___!",
            '¿Cien euros? ¡Es caro!',
            'cher',
            ['chère', 'chers', 'combien'],
            ['fr-cher', 'fr-cent'],
            {
              id: 'fr.ex.dksw92ebn41ufk',
              explanation: "Después de c'est, el adjetivo queda en masculino singular: c'est cher.",
            },
          ),
          question(
            'fr.ex.c4nde57rjsml51',
            MAGASIN,
            '¿Qué busca Julie?',
            'Un bolso para su hija.',
            ['Un bolso para su mamá.', 'Un libro para su hija.', 'Una birome roja.'],
            ['fr-je-cherche'],
            'Julie dice «Je cherche un sac pour ma fille».',
          ),
          question(
            'fr.ex.0guqpzcrzom2ul',
            MAGASIN,
            '¿Por qué no compra el bolso rojo?',
            'Porque es caro: cuesta cincuenta euros.',
            [
              'Porque no le gusta el rojo.',
              'Porque cuesta treinta euros.',
              'Porque no hay bolsos rojos.',
            ],
            ['fr-cher', 'fr-cinquante', 'fr-c-est-combien'],
            "Pregunta «C'est combien, le sac rouge?», le dicen «Cinquante euros» y responde «C'est cher!».",
          ),
          ex.translateWrite(
            'Busco una tienda, por favor.',
            "Je cherche un magasin, s'il vous plaît.",
            ['fr-je-cherche', 'fr-le-magasin'],
            { id: 'fr.ex.dkm8t312j44gl3' },
          ),
          ex.shortAnswer(
            "Le livre, c'est combien?",
            '¿Cuánto cuesta el libro? (Responde que cuesta quince euros.)',
            "C'est quinze euros.",
            ['Quinze euros.', "Le livre, c'est quinze euros."],
            ['fr-l-euro', 'fr-quinze'],
            { id: 'fr.ex.4viv26xheliywy' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'De compras',
        objective: 'Comprar, comparar precios y preguntar cuántos.',
        intro: {
          explanation:
            "Combien sirve para el precio y para la cantidad: combien de + sustantivo, sin artículo (combien de livres?). Para comparar: c'est cher, ce n'est pas cher. Y para elegir: quel sac? quelle couleur? Recuerda que en un magasin se usa vous y se saluda al entrar y al salir.",
          examples: [
            { target: 'Tu as combien de livres?', base: '¿Cuántos libros tienes?' },
            { target: "Le stylo? Ce n'est pas cher.", base: '¿El bolígrafo? No es caro.' },
          ],
        },
        takeaways: [
          'Preguntas cuántos con combien de + sustantivo.',
          'Compras en una tienda: buscas, preguntas el precio y eliges.',
        ],
        exercises: [
          question(
            'fr.ex.t2sz708swezwqm',
            ANNONCE,
            '¿Cuánto cuesta un libro?',
            'Quince euros.',
            ['Cinco euros.', 'Cincuenta euros.', 'Dos euros.'],
            ['fr-quinze', 'fr-l-euro'],
            'El cartel dice «Le livre: quinze euros».',
          ),
          question(
            'fr.ex.c9ems5q8lzhlmj',
            ANNONCE,
            '¿Cuánto cuesta el bolso el fin de semana?',
            'Treinta euros.',
            ['Cuarenta euros.', 'Trece euros.', 'Cien euros.'],
            ['fr-trente', 'fr-quarante'],
            'Cuesta quarante euros, pero «Samedi et dimanche: le sac à trente euros!».',
          ),
          question(
            'fr.ex.pwunfna62vq346',
            MAGASIN,
            '¿Qué bolso compra Julie?',
            'El negro, por treinta euros.',
            ['El rojo, por cincuenta euros.', 'El negro, por trece euros.', 'Ninguno.'],
            ['fr-trente', 'fr-quel'],
            'El sac noir cuesta «Trente euros» y Julie dice «Je prends le sac noir».',
          ),
          ex.listenChoice(
            'Tu as combien de livres?',
            ['Tu as combien de sacs?', 'Tu as quel livre?', "C'est combien, le livre?"],
            ['fr-combien'],
            { id: 'fr.ex.jorbog8y89ta1i' },
          ),
          ex.fillBlank(
            'Tu as ___ de frères?',
            '¿Cuántos hermanos tienes?',
            'combien',
            ['comment', 'quel', 'qui'],
            ['fr-combien'],
            {
              id: 'fr.ex.qwuxlt55vuj0u6',
              explanation: 'Para la cantidad: combien de + sustantivo, sin artículo.',
            },
          ),
          ex.translationChoice('combien', 'cuánto', ['cómo', 'cuándo', 'por qué'], ['fr-combien'], {
            id: 'fr.ex.j84mnl06k5jo2r',
          }),
          ex.orderWords(
            'Est-ce que le magasin est loin?',
            '¿La tienda queda lejos?',
            ['fr-le-magasin'],
            {
              id: 'fr.ex.cyuoo4inh1j9ld',
            },
          ),
          ex.translationChoice('cher', 'caro', ['barato', 'grande', 'chico'], ['fr-cher'], {
            id: 'fr.ex.rjsnrcq8mpmdv1',
          }),
          ex.translateWrite('¿Qué libro prefieres?', 'Quel livre tu préfères?', ['fr-quel'], {
            id: 'fr.ex.1egf8312uqjsse',
            acceptedAnswers: ['Quel livre est-ce que tu préfères?', 'Quel livre préfères-tu?'],
          }),
          ex.shortAnswer(
            "Qu'est-ce que tu cherches?",
            '¿Qué buscas? (Responde que buscas la panadería.)',
            'Je cherche la boulangerie.',
            ['Je cherche une boulangerie.', "Je cherche la boulangerie, s'il vous plaît."],
            ['fr-je-cherche', 'fr-qu-est-ce-que'],
            { id: 'fr.ex.c8o35td6cblenx' },
          ),
        ],
      },
    ],
  },
};

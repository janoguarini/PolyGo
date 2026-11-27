import { ex } from '../../builders';
import type { PlannedWrittenUnitDef, WordDef } from '../../types';
import { EN_A1_PLANNED_UNITS } from './context-planned';

/**
 * Fase C.3 (docs/LEARNING_PHASE_C.md §C3): lecciones escritas L1–L5 de U14 «Precios y compras»
 * (docs/polygo-ingles-a1-mapa-curricular.md §3, bloque 2: va después de U7).
 *
 * Vocabulario previo: U1–U7. Lo demás lo enseña la unidad: sus palabras y seis que reutiliza de
 * unidades ya cargadas porque el mapa las adelanta (`borrowed`): `how much` y `how many` (U12, que el
 * mapa pone en U14 L3) y `price`, `money`, `cheap` y `expensive` (A2 U6). No se usan los números que
 * U3 todavía no enseña (0, 13, 14, 16–19: mapa §3, U3 «M»).
 *
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni de hablantes nativos. Se carga sin publicar.
 */

const meta = EN_A1_PLANNED_UNITS.find((u) => u.position === 14)!;

const number = (
  id: string,
  text: string,
  translation: string,
  ipa: string,
  exampleEn: string,
  exampleEs: string,
): WordDef => ({ id, text, translation, ipa, exampleEn, exampleEs, tags: ['numbers'] });

const words: WordDef[] = [
  number('en-thirty', 'thirty', 'treinta', '/ˈθɜrti/', 'Thirty students.', 'Treinta estudiantes.'),
  number(
    'en-forty',
    'forty',
    'cuarenta',
    '/ˈfɔrti/',
    'My father is forty.',
    'Mi papá tiene cuarenta años.',
  ),
  number('en-fifty', 'fifty', 'cincuenta', '/ˈfɪfti/', 'Fifty books.', 'Cincuenta libros.'),
  number(
    'en-sixty',
    'sixty',
    'sesenta',
    '/ˈsɪksti/',
    'My grandfather is sixty.',
    'Mi abuelo tiene sesenta años.',
  ),
  number('en-seventy', 'seventy', 'setenta', '/ˈsɛvənti/', 'Seventy cups.', 'Setenta tazas.'),
  number(
    'en-eighty',
    'eighty',
    'ochenta',
    '/ˈeɪti/',
    'My grandmother is eighty.',
    'Mi abuela tiene ochenta años.',
  ),
  number(
    'en-ninety',
    'ninety',
    'noventa',
    '/ˈnaɪnti/',
    'The computer is ninety dollars.',
    'La computadora cuesta noventa dólares.',
  ),
  {
    ...number(
      'en-one-hundred',
      'one hundred',
      'cien',
      '/wʌn ˈhʌndrəd/',
      'One hundred dollars.',
      'Cien dólares.',
    ),
    acceptedTranslations: ['ciento'],
    acceptedTexts: ['a hundred', 'hundred'],
    emoji: '💯',
  },
  {
    id: 'en-dollar',
    text: 'dollar',
    translation: 'dólar',
    ipa: '/ˈdɑlər/',
    emoji: '💵',
    exampleEn: 'The book is ten dollars.',
    exampleEs: 'El libro cuesta diez dólares.',
    tags: ['money'],
  },
  {
    id: 'en-cent',
    text: 'cent',
    translation: 'centavo',
    ipa: '/sɛnt/',
    emoji: '🪙',
    exampleEn: 'Fifty cents.',
    exampleEs: 'Cincuenta centavos.',
    tags: ['money'],
  },
  {
    id: 'en-a-cup-of',
    text: 'a cup of',
    translation: 'una taza de',
    ipa: '/ə ˈkʌp əv/',
    emoji: '☕',
    exampleEn: 'A cup of tea, please.',
    exampleEs: 'Una taza de té, por favor.',
    tags: ['quantities'],
  },
  {
    id: 'en-a-glass-of',
    text: 'a glass of',
    translation: 'un vaso de',
    ipa: '/ə ˈɡlæs əv/',
    emoji: '🥛',
    exampleEn: 'A glass of water, please.',
    exampleEs: 'Un vaso de agua, por favor.',
    tags: ['quantities'],
  },
  {
    id: 'en-a-bottle-of',
    text: 'a bottle of',
    translation: 'una botella de',
    ipa: '/ə ˈbɑtəl əv/',
    emoji: '🍾',
    exampleEn: 'A bottle of milk.',
    exampleEs: 'Una botella de leche.',
    tags: ['quantities'],
  },
  {
    id: 'en-a-kilo-of',
    text: 'a kilo of',
    translation: 'un kilo de',
    ipa: '/ə ˈkiloʊ əv/',
    emoji: '⚖️',
    exampleEn: 'A kilo of rice.',
    exampleEs: 'Un kilo de arroz.',
    tags: ['quantities'],
  },
  {
    id: 'en-id-like',
    text: "I'd like",
    translation: 'quisiera',
    acceptedTexts: ['I would like'],
    ipa: '/aɪd ˈlaɪk/',
    exampleEn: "I'd like a coffee, please.",
    exampleEs: 'Quisiera un café, por favor.',
    tags: ['shopping', 'requests'],
  },
  {
    id: 'en-anything-else',
    text: 'anything else',
    translation: '¿algo más?',
    ipa: '/ˈɛniˌθɪŋ ˈɛls/',
    exampleEn: 'Anything else?',
    exampleEs: '¿Algo más?',
    tags: ['shopping'],
  },
  {
    id: 'en-thats-all',
    text: "that's all",
    translation: 'eso es todo',
    acceptedTranslations: ['nada más'],
    acceptedTexts: ['that is all'],
    ipa: '/ðæts ˈɔl/',
    exampleEn: "No, that's all, thank you.",
    exampleEs: 'No, eso es todo, gracias.',
    tags: ['shopping'],
  },
  {
    id: 'en-here-you-are',
    text: 'here you are',
    translation: 'aquí tiene',
    acceptedTranslations: ['aquí tienes', 'aquí tenés', 'tome'],
    ipa: '/ˈhɪr ju ˌɑr/',
    exampleEn: 'Here you are. Ten dollars.',
    exampleEs: 'Aquí tiene. Diez dólares.',
    tags: ['shopping'],
  },
];

export const EN_A1_U14: PlannedWrittenUnitDef = {
  borrowed: ['en-price', 'en-money', 'en-cheap', 'en-expensive', 'en-how-much', 'en-how-many'],
  names: [],
  curriculum: [
    { primary: ['v03'], secondary: [] },
    { primary: ['v03'], secondary: ['cL03'] },
    { primary: ['g16', 'v03'], secondary: [] },
    { primary: ['g23', 'v07'], secondary: [] },
    { primary: ['p10'], secondary: ['v12'] },
  ],
  unit: {
    position: meta.position,
    title: meta.title,
    titleEn: meta.titleEn,
    description: meta.description,
    emoji: meta.emoji,
    objective: meta.objective,
    review: {
      status: 'draft',
      notes:
        'Fase C.3: L1–L5 nuevas del mapa curricular. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words,
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Del 21 al 100',
        objective: 'Contar de diez en diez hasta cien y armar los números del 21 al 99.',
        intro: {
          explanation:
            'Las decenas terminan en -ty: thirty (30), forty (40), fifty (50). Forty se escribe sin u, aunque four la lleva. Del 21 al 99 se unen con guion: twenty-one, thirty-five. El 100 es one hundred.',
          examples: [
            { target: 'Thirty-five students.', base: 'Treinta y cinco estudiantes.' },
            { target: 'My grandmother is ninety.', base: 'Mi abuela tiene noventa años.' },
          ],
        },
        takeaways: [
          'Cuentas de diez en diez hasta one hundred.',
          'Armas los números del 21 al 99 con guion: forty-two.',
        ],
        exercises: [
          ex.translationChoice(
            'thirty',
            'treinta',
            ['trece', 'tres', 'treinta y tres'],
            ['en-thirty'],
            {
              id: 'en.ex.gerypyab1n67wh',
            },
          ),
          ex.listenChoice('forty', ['four', 'fifty', 'thirty'], ['en-forty'], {
            id: 'en.ex.nbkb4mvtvqgq9r',
          }),
          ex.listenChoice('fifty', ['fifteen', 'sixty', 'five'], ['en-fifty'], {
            id: 'en.ex.kkpl2sqfk9eaxx',
            explanation:
              'Fifty (50) lleva el acento al principio: FIF-ty. Fifteen (15) lo lleva al final: fif-TEEN.',
          }),
          ex.matchPairs(
            [
              ['sixty', 'sesenta'],
              ['seventy', 'setenta'],
              ['eighty', 'ochenta'],
              ['ninety', 'noventa'],
            ],
            ['en-sixty', 'en-seventy', 'en-eighty', 'en-ninety'],
            { id: 'en.ex.wyrd8mfoysmofp' },
          ),
          ex.fillBlank(
            'fifty + fifty = ___',
            'cincuenta + cincuenta = cien',
            'one hundred',
            ['ninety', 'fifteen', 'eighty'],
            ['en-one-hundred', 'en-fifty'],
            { id: 'en.ex.7ev6w5ecc7fxeo', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'twenty + twenty = ___',
            'veinte + veinte = cuarenta',
            'forty',
            ['thirty', 'fifty', 'twelve'],
            ['en-forty'],
            { id: 'en.ex.j4sn1017xj5m2u', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'thirty-five',
            ['twenty-five', 'thirty-nine', 'forty-five'],
            ['en-thirty', 'en-five'],
            { id: 'en.ex.yxxi6xy75ej4o2' },
          ),
          ex.completeWord('fo__y', 'forty', 'cuarenta', ['en-forty'], {
            id: 'en.ex.pyzfjifbevrb99',
            explanation: 'Forty se escribe sin u, aunque four sí la lleva.',
          }),
          ex.translateWrite('Ochenta', 'eighty', ['en-eighty'], { id: 'en.ex.6hxcssbimwlwgg' }),
          ex.translateWrite('Cuarenta y dos', 'forty-two', ['en-forty', 'en-two'], {
            id: 'en.ex.tctemikzebugfq',
            acceptedAnswers: ['forty two'],
            explanation: 'Del 21 al 99 la decena y la unidad se unen con guion: forty-two.',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Precios y dinero',
        objective: 'Decir y entender precios en dólares y centavos.',
        intro: {
          explanation:
            'El símbolo va antes del número ($5), pero se dice después: five dollars. Un dólar tiene cien centavos (cents). Para decir un precio alcanza con to be: The book is twenty dollars. Algo barato es cheap y algo caro, expensive.',
          examples: [
            { target: 'The book is twenty dollars.', base: 'El libro cuesta veinte dólares.' },
            {
              target: 'A big bag, ten dollars? It is cheap!',
              base: '¿Una bolsa grande a diez dólares? ¡Es barata!',
            },
          ],
        },
        takeaways: [
          'Dices un precio con to be: The coffee is three dollars.',
          'Entiendes de oído precios con dólares y centavos.',
        ],
        exercises: [
          ex.translationChoice('price', 'precio', ['dinero', 'dólar', 'barato'], ['en-price'], {
            id: 'en.ex.xht4ryisrsul2f',
          }),
          ex.translationChoice(
            'expensive',
            'caro',
            ['barato', 'grande', 'chico'],
            ['en-expensive'],
            {
              id: 'en.ex.5qz1xtlw1143wj',
            },
          ),
          ex.matchPairs(
            [
              ['money', 'dinero'],
              ['dollar', 'dólar'],
              ['cheap', 'barato'],
              ['cent', 'centavo'],
            ],
            ['en-money', 'en-dollar', 'en-cheap', 'en-cent'],
            { id: 'en.ex.b40ejzdnci5pk1' },
          ),
          ex.listenChoice(
            'It is forty-five dollars.',
            ['It is fifty-five dollars.', 'It is forty-nine dollars.', 'It is fifteen dollars.'],
            ['en-dollar', 'en-forty'],
            { id: 'en.ex.49vbpba68dldfq' },
          ),
          ex.listenChoice(
            'The coffee is three dollars and fifty cents.',
            [
              'The coffee is three dollars and fifteen cents.',
              'The tea is three dollars and fifty cents.',
              'The coffee is two dollars and fifty cents.',
            ],
            ['en-cent', 'en-dollar'],
            { id: 'en.ex.9nc9yajdogxgts' },
          ),
          ex.fillBlank(
            '$20: The book is twenty ___.',
            '20 dólares: El libro cuesta veinte dólares.',
            'dollars',
            ['cents', 'money', 'prices'],
            ['en-dollar'],
            {
              id: 'en.ex.ivnu5m5r93ec50',
              explanation: 'Se dice el número y después dollars, en plural.',
            },
          ),
          ex.fillBlank(
            'A big bag, ten dollars? It is ___!',
            '¿Una bolsa grande a diez dólares? ¡Es barata!',
            'cheap',
            ['expensive', 'money', 'price'],
            ['en-cheap'],
            { id: 'en.ex.jidnzetd0sdfs4' },
          ),
          ex.orderWords(
            'The computer is expensive.',
            'La computadora es cara.',
            ['en-expensive', 'en-computer'],
            { id: 'en.ex.6c18d3p8adbztd' },
          ),
          ex.shortAnswer(
            'The pen is $2. The book is $15. Is the pen expensive?',
            'El bolígrafo cuesta 2 dólares. El libro, 15. ¿El bolígrafo es caro?',
            'No, it is not.',
            [
              'No.',
              "No, it isn't.",
              "No, it's not.",
              'No, it is cheap.',
              "No, it's cheap.",
              'No, it is not expensive.',
            ],
            ['en-expensive', 'en-cheap'],
            { id: 'en.ex.1djnmni5hq0agh' },
          ),
          ex.translateWrite(
            'La leche cuesta dos dólares.',
            'The milk is two dollars.',
            ['en-dollar', 'en-milk'],
            {
              id: 'en.ex.wc8xqkmnt1a9lm',
              acceptedAnswers: ['Milk is two dollars.', 'The milk is $2.'],
              explanation: 'Para un precio alcanza con to be: The milk is two dollars.',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'How much, how many',
        objective: 'Preguntar precios y cantidades con how much y how many.',
        intro: {
          explanation:
            'How much pregunta un precio: How much is the bag? How many va con cosas que se cuentan, en plural: How many apples are there? Se responde con el número: There are three apples. / It is ten dollars.',
          examples: [
            { target: 'How much is the bag?', base: '¿Cuánto cuesta la bolsa?' },
            { target: 'How many cups are there?', base: '¿Cuántas tazas hay?' },
          ],
        },
        takeaways: [
          'Preguntas un precio con How much is…?',
          'Preguntas una cantidad con How many + plural.',
        ],
        exercises: [
          ex.translationChoice(
            'How much is the coffee?',
            '¿Cuánto cuesta el café?',
            ['¿Cuántos cafés hay?', '¿Dónde está el café?', '¿Quieres un café?'],
            ['en-how-much', 'en-coffee'],
            { id: 'en.ex.4hmjysurd9mwf3' },
          ),
          ex.translationChoice(
            'How many?',
            '¿Cuántos?',
            ['¿Cuánto cuesta?', '¿Quién?', '¿Dónde?'],
            ['en-how-many'],
            {
              id: 'en.ex.8t6xrvs503vcdu',
            },
          ),
          ex.fillBlank(
            'How ___ is the black bag?',
            '¿Cuánto cuesta la bolsa negra?',
            'much',
            ['many', 'old', 'are'],
            ['en-how-much', 'en-bag'],
            { id: 'en.ex.m0sc65firj9ck8', explanation: 'Un precio se pregunta con how much.' },
          ),
          ex.fillBlank(
            'How ___ chairs are there?',
            '¿Cuántas sillas hay?',
            'many',
            ['much', 'old', 'is'],
            ['en-how-many', 'en-chair'],
            {
              id: 'en.ex.ods7qp4gtfmerh',
              explanation: 'Las cosas que se cuentan (chairs) van con how many.',
            },
          ),
          ex.listenChoice(
            'How many eggs are there?',
            ['How much is the egg?', 'How many apples are there?', 'How old is the baby?'],
            ['en-how-many', 'en-egg'],
            { id: 'en.ex.ppe034ly6gugg1' },
          ),
          ex.listenChoice(
            'How much is the cheese?',
            ['How much is the milk?', 'How many cheeses are there?', 'Where is the cheese?'],
            ['en-how-much', 'en-cheese'],
            { id: 'en.ex.85gfxkgh2qk0h6' },
          ),
          ex.orderWords(
            'How much are the apples?',
            '¿Cuánto cuestan las manzanas?',
            ['en-how-much', 'en-apple'],
            { id: 'en.ex.yxcc4gqri7g920' },
          ),
          ex.shortAnswer(
            'There are three apples and two bananas on the table. How many apples are there?',
            'Hay tres manzanas y dos bananas sobre la mesa. ¿Cuántas manzanas hay?',
            'There are three apples.',
            [
              'There are three.',
              'Three apples.',
              'Three.',
              '3',
              'There are three apples on the table.',
            ],
            ['en-how-many', 'en-apple'],
            { id: 'en.ex.553j7iaja69blf' },
          ),
          ex.shortAnswer(
            'Bread: $4. How much is the bread?',
            'Pan: 4 dólares. ¿Cuánto cuesta el pan?',
            'It is four dollars.',
            [
              "It's four dollars.",
              'The bread is four dollars.',
              'Four dollars.',
              '4 dollars',
              '$4',
            ],
            ['en-how-much', 'en-dollar'],
            { id: 'en.ex.i9a8x9hxwpk8is' },
          ),
          ex.translateWrite(
            '¿Cuánto cuesta la computadora?',
            'How much is the computer?',
            ['en-how-much', 'en-computer'],
            { id: 'en.ex.aju45cyeo3ehw0' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Una taza de, una botella de',
        objective: 'Pedir cantidades de comida y bebida con I’d like.',
        intro: {
          explanation:
            "Para pedir una cantidad: a cup of + bebida (a cup of tea), a glass of (water), a bottle of (milk), a kilo of (apples). Para pedir con cortesía se usa I'd like (quisiera): es más amable que I want.",
          examples: [
            {
              target: "I'd like a cup of tea, please.",
              base: 'Quisiera una taza de té, por favor.',
            },
            { target: 'Two bottles of water.', base: 'Dos botellas de agua.' },
          ],
        },
        takeaways: [
          'Pides cantidades con a cup of, a glass of, a bottle of y a kilo of.',
          "Pides con cortesía con I'd like.",
        ],
        exercises: [
          ex.imageChoice(
            '☕',
            'a cup of coffee',
            ['a glass of milk', 'a bottle of water', 'a kilo of rice'],
            ['en-a-cup-of', 'en-coffee'],
            { id: 'en.ex.68ng29u8o7c58c' },
          ),
          ex.imageChoice(
            '🥛',
            'a glass of milk',
            ['a cup of tea', 'a bottle of juice', 'a kilo of apples'],
            ['en-a-glass-of', 'en-milk'],
            { id: 'en.ex.p3meim7nyoz7js' },
          ),
          ex.translationChoice(
            "I'd like",
            'quisiera',
            ['me gusta', 'tengo', 'soy'],
            ['en-id-like'],
            {
              id: 'en.ex.agi6hm5ttiyjdz',
            },
          ),
          ex.fillBlank(
            'A ___ of water, please.',
            'Una botella de agua, por favor.',
            'bottle',
            ['kilo', 'cup', 'glass'],
            ['en-a-bottle-of', 'en-water'],
            { id: 'en.ex.d54gmg9grtjbwb' },
          ),
          ex.fillBlank(
            'A kilo ___ apples, please.',
            'Un kilo de manzanas, por favor.',
            'of',
            ['from', 'in', 'on'],
            ['en-a-kilo-of', 'en-apple'],
            {
              id: 'en.ex.3p2ebx3ufa5rod',
              explanation: 'Entre la cantidad y lo que se pide va of: a kilo of apples.',
            },
          ),
          ex.listenChoice(
            "I'd like a glass of juice, please.",
            [
              "I'd like a cup of juice, please.",
              'I want a glass of juice.',
              "I'd like a bottle of juice, please.",
            ],
            ['en-id-like', 'en-a-glass-of'],
            { id: 'en.ex.oi8z4ry4h90q3b' },
          ),
          ex.listenChoice(
            'Two cups of coffee, please.',
            [
              'Two cups of tea, please.',
              'Two glasses of coffee, please.',
              'A cup of coffee, please.',
            ],
            ['en-a-cup-of', 'en-coffee'],
            { id: 'en.ex.sz075k38sfffzr' },
          ),
          ex.orderWords(
            "I'd like a cup of tea.",
            'Quisiera una taza de té.',
            ['en-id-like', 'en-a-cup-of', 'en-tea'],
            { id: 'en.ex.tjs0t37sjj9z1j' },
          ),
          ex.translateWrite(
            'Quisiera un vaso de agua, por favor.',
            "I'd like a glass of water, please.",
            ['en-id-like', 'en-a-glass-of', 'en-water'],
            {
              id: 'en.ex.rupooq445tpsp1',
              acceptedAnswers: [
                'I would like a glass of water, please.',
                "I'd like a glass of water.",
                'I would like a glass of water.',
              ],
            },
          ),
          ex.translateWrite(
            'Dos botellas de leche, por favor.',
            'Two bottles of milk, please.',
            ['en-a-bottle-of', 'en-milk', 'en-two'],
            {
              id: 'en.ex.pua23cskwzck2k',
              acceptedAnswers: ['Two bottles of milk.'],
              explanation:
                'En plural cambia el recipiente, no lo que hay adentro: two bottles of milk.',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'En la tienda',
        objective: 'Pedir, preguntar el precio y pagar en una tienda.',
        intro: {
          explanation:
            "En una tienda se pide con I'd like y se pregunta el precio con How much is it? El vendedor pregunta Anything else? (¿algo más?). Si no quieres nada más: No, that's all, thank you. Al pagar o entregar algo se dice Here you are (aquí tiene).",
          examples: [
            { target: 'Anything else?', base: '¿Algo más?' },
            { target: "No, that's all. Here you are.", base: 'No, eso es todo. Aquí tiene.' },
          ],
        },
        takeaways: [
          "Haces un pedido completo: I'd like…, How much is it?, That's all.",
          'Entiendes lo que pregunta el vendedor y respondes con Here you are al pagar.',
        ],
        exercises: [
          ex.translationChoice(
            'Anything else?',
            '¿Algo más?',
            ['¿Cuánto cuesta?', '¿Cómo estás?', '¿Algo para tomar?'],
            ['en-anything-else'],
            { id: 'en.ex.ym3areexofk37x' },
          ),
          ex.translationChoice(
            'Here you are.',
            'Aquí tiene.',
            ['Gracias.', 'De nada.', 'Hasta luego.'],
            ['en-here-you-are'],
            {
              id: 'en.ex.izpx2feefa2qac',
            },
          ),
          ex.fillBlank(
            'No, ___ all, thank you.',
            'No, eso es todo, gracias.',
            "that's",
            ['this', 'it', 'is'],
            ['en-thats-all'],
            { id: 'en.ex.xwzgoyltxi6uee' },
          ),
          ex.listenChoice(
            'Here you are.',
            ['Where are you?', 'How are you?', 'Who are you?'],
            ['en-here-you-are'],
            {
              id: 'en.ex.8r4b4yxtex1icf',
              explanation: 'Here you are es «aquí tiene». Where are you? pregunta dónde estás.',
            },
          ),
          ex.listenChoice(
            "I'd like two bottles of water, please.",
            [
              "I'd like two bottles of milk, please.",
              "I'd like two glasses of water, please.",
              "I'd like three bottles of water, please.",
            ],
            ['en-id-like', 'en-a-bottle-of'],
            { id: 'en.ex.1fknub46980ygn' },
          ),
          ex.matchPairs(
            [
              ['Anything else?', '¿Algo más?'],
              ["That's all.", 'Eso es todo.'],
              ['Here you are.', 'Aquí tiene.'],
              ["I'd like", 'quisiera'],
            ],
            ['en-anything-else', 'en-thats-all', 'en-here-you-are', 'en-id-like'],
            { id: 'en.ex.lydptfp2s0it8l' },
          ),
          ex.orderWords(
            "No, that's all, thank you.",
            'No, eso es todo, gracias.',
            ['en-thats-all'],
            {
              id: 'en.ex.yaglgw56axg4jn',
            },
          ),
          ex.shortAnswer(
            'Anything else? (a cup of coffee)',
            '¿Algo más? (una taza de café)',
            "I'd like a cup of coffee, please.",
            [
              "I'd like a cup of coffee.",
              'I would like a cup of coffee, please.',
              'I would like a cup of coffee.',
              "Yes, I'd like a cup of coffee, please.",
              "Yes, I'd like a cup of coffee.",
              'Yes, a cup of coffee, please.',
              'A cup of coffee, please.',
            ],
            ['en-id-like', 'en-a-cup-of', 'en-anything-else'],
            {
              id: 'en.ex.mbzbs253bs4k1j',
              explanation: "Se pide con I'd like + la cantidad: I'd like a cup of coffee, please.",
            },
          ),
          ex.shortAnswer(
            'A bag is $40 and a cup is $8. How much are the bag and the cup?',
            'Una bolsa cuesta 40 dólares y una taza, 8. ¿Cuánto cuestan la bolsa y la taza?',
            'They are forty-eight dollars.',
            [
              'They are forty eight dollars.',
              'It is forty-eight dollars.',
              "It's forty-eight dollars.",
              'Forty-eight dollars.',
              'Forty eight dollars.',
              '48 dollars',
              '$48',
            ],
            ['en-how-much', 'en-forty', 'en-dollar'],
            { id: 'en.ex.ch510jf8o3eykf', explanation: 'Cuarenta más ocho: forty-eight dollars.' },
          ),
          ex.translateWrite(
            'No, eso es todo. Aquí tiene.',
            "No, that's all. Here you are.",
            ['en-thats-all', 'en-here-you-are'],
            {
              id: 'en.ex.odv3lqj6wapj2k',
              acceptedAnswers: ["No, that's all, here you are.", 'No, that is all. Here you are.'],
            },
          ),
        ],
      },
    ],
  },
};

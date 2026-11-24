import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U9 «Shopping and services» (docs/ES_A1_A2.md): comparativos (más… que, menos… que,
 * tan… como) y los irregulares mejor / peor; superlativo el más… / la más… de y el absoluto -ísimo
 * (carísimo, baratísimo); pronombre de objeto directo con la ropa (me lo llevo, ¿me la puedo
 * probar?). Probarse, el probador, la talla y el número de calzado, la liquidación, pagar con tarjeta o
 * en efectivo. Variante: español neutro de Latinoamérica (tú; usted con el vendedor). Vocabulario: la
 * chaqueta, los tenis, la talla (se aceptan la campera, las zapatillas, el talle).
 * Pronunciación: el acento de -ísimo (siempre en la í, siempre con tilde); la ll de talla como la y
 * inglesa de yes.
 * Cultura: las liquidaciones de fin de temporada; el descuento por pagar en efectivo.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NEGOCIO = dialogue(
  'es.stim.a2-u9-negocio',
  'Sofía is shopping for a jacket. Camila works in the clothes shop.',
  [
    ['Sofía', 'Buenas tardes. Busco una chaqueta para el invierno.'],
    ['Camila', 'Tenemos esta azul y esta negra. La negra es más cara, pero es mejor.'],
    ['Sofía', 'Me gusta la negra. ¿Me la puedo probar? Uso talla cuarenta.'],
    ['Camila', 'Sí, claro. El probador está al lado de la ventana.'],
    ['Sofía', 'Me queda muy bien. Me la llevo. ¿Puedo pagar con tarjeta?'],
    ['Camila', 'Sí, claro. Con tarjeta o en efectivo.'],
  ],
);

const AVISO = reading(
  'es.stim.a2-u9-aviso',
  'ad',
  'An ad in the window of a clothes shop.',
  [
    '¡Liquidación de invierno!',
    'Chaquetas, pantalones y vestidos: hasta cincuenta por ciento menos.',
    'Los tenis más baratos de la ciudad.',
    'Camisas: dos por el precio de una.',
    'Puedes pagar con tarjeta o en efectivo. En efectivo, ¡más barato todavía!',
    'Probadores: en el piso de arriba.',
  ],
  { title: 'Liquidación' },
);

export const ES_A2_U09: EsUnitDef = {
  names: ['Sofía', 'Camila', 'Lucía', 'Martín', 'Diego'],
  support: [
    'baratísimo',
    'probar',
    'probarme',
    'usas',
    'uso',
    'paga',
    'pago',
    'pagar',
    'precio',
    'pantalones',
  ],
  unit: {
    position: 9,
    title: 'Shopping and services',
    titleEn: 'De compras',
    description:
      'Compare clothes and prices (más… que, tan… como, mejor, peor), say what is the cheapest or really expensive, try clothes on, ask for your size and pay by card or in cash.',
    emoji: '👟',
    objective:
      'You can compare clothes and prices, ask for your size and try something on, say you’ll take it and choose how to pay in a shop.',
    grammar: {
      title: 'Comparisons · superlatives · lo, la',
      explanation:
        'To compare: más + adjective + que (more … than), menos + adjective + que (less … than) and tan + adjective + como (as … as). Bueno and malo have their own forms: mejor (better) and peor (worse). To say the most: el, la, los or las + noun + más + adjective + de: la chaqueta más barata del negocio (de, not en). To say really or extremely, add -ísimo to the adjective: caro → carísimo, barato → baratísimo; the stress always falls on that í, which always carries an accent mark. Lo, la, los and las replace a noun you already mentioned (el pantalón → lo, la camisa → la). They go before the conjugated verb: me lo llevo (I’ll take it), ¿me la puedo probar? (can I try it on?).',
      examples: [
        {
          target: 'La chaqueta negra es mejor que la azul.',
          base: 'The black jacket is better than the blue one.',
        },
        {
          target: 'Es el pantalón más barato del negocio.',
          base: 'They’re the cheapest trousers in the shop.',
        },
        {
          target: 'Me gusta este vestido. ¿Me lo puedo probar?',
          base: 'I like this dress. Can I try it on?',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U9), convertido al español neutro con tú (2026-11-21). Sin revisión nativa. Revisar: «la chaqueta» (se acepta «la campera»; en México también «la chamarra», no enseñada); «los tenis» (masculino e invariable; se aceptan «las zapatillas»; en Perú y España se dice «zapatillas»); «uso talla cuarenta» (también «soy talla cuarenta», coloquial, aceptado; las tallas numéricas cambian de país a país); «el negocio» (de A1 U12) frente a «la tienda», más neutro; «el número» traducido como «the shoe size» (aceptado «the number»); el aviso ya no da precios; «me queda muy bien» se usa sin enseñarse como palabra (apoyo «queda»); el descuento por pago en efectivo es habitual pero no universal.',
    },
    words: [
      w(
        'es-mejor',
        'mejor',
        'better',
        'Esta chaqueta es mejor que la azul.',
        'This jacket is better than the blue one.',
        ['comparisons'],
      ),
      w(
        'es-peor',
        'peor',
        'worse',
        'Este pantalón es peor que el negro.',
        'These trousers are worse than the black ones.',
        ['comparisons'],
      ),
      w(
        'es-el-mas',
        'el más',
        'the most',
        'Es el vestido más lindo del negocio.',
        'It’s the prettiest dress in the shop.',
        ['comparisons'],
        { acceptedTexts: ['la más', 'los más', 'las más'] },
      ),
      w(
        'es-carisimo',
        'carísimo',
        'really expensive',
        '¡Los tenis son carísimos!',
        'The sneakers are really expensive!',
        ['comparisons', 'shopping'],
        {
          acceptedTranslations: ['very expensive'],
          acceptedTexts: ['carísima', 'carísimos', 'carísimas'],
          emoji: '💸',
        },
      ),
      w(
        'es-la-talla',
        'la talla',
        'the size (clothes)',
        '¿Qué talla usas?',
        'What size do you wear?',
        ['shopping'],
        { acceptedTexts: ['el talle'] },
      ),
      w(
        'es-el-numero',
        'el número',
        'the shoe size',
        '¿Tiene estos tenis en el número cuarenta?',
        'Do you have these sneakers in size forty?',
        ['shopping'],
        { acceptedTranslations: ['the number'] },
      ),
      w(
        'es-probarse',
        'probarse',
        'to try on',
        'Quiero probarme este vestido.',
        'I want to try on this dress.',
        ['shopping', 'verbs'],
      ),
      w(
        'es-el-probador',
        'el probador',
        'the fitting room',
        'El probador está al lado de la puerta.',
        'The fitting room is next to the door.',
        ['shopping'],
        { acceptedTranslations: ['the changing room'] },
      ),
      w(
        'es-la-liquidacion',
        'la liquidación',
        'the sale',
        'Hay liquidación: todo es más barato.',
        'There’s a sale: everything is cheaper.',
        ['shopping'],
        { acceptedTranslations: ['the clearance sale'], emoji: '🏷️' },
      ),
      w(
        'es-la-camisa',
        'la camisa',
        'the shirt',
        'Busco una camisa blanca.',
        'I’m looking for a white shirt.',
        ['clothes'],
        { emoji: '👔' },
      ),
      w(
        'es-el-pantalon',
        'el pantalón',
        'the trousers',
        'Este pantalón es muy largo.',
        'These trousers are too long.',
        ['clothes'],
        { acceptedTranslations: ['the pants'], emoji: '👖' },
      ),
      w(
        'es-el-vestido',
        'el vestido',
        'the dress',
        'El vestido rojo es carísimo.',
        'The red dress is really expensive.',
        ['clothes'],
        { emoji: '👗' },
      ),
      w(
        'es-los-tenis',
        'los tenis',
        'the sneakers',
        'Quiero unos tenis blancos.',
        'I want some white sneakers.',
        ['clothes'],
        {
          acceptedTranslations: ['the trainers', 'the tennis shoes'],
          acceptedTexts: ['las zapatillas'],
          emoji: '👟',
        },
      ),
      w(
        'es-la-chaqueta',
        'la chaqueta',
        'the jacket',
        'Busco una chaqueta para el invierno.',
        'I’m looking for a jacket for the winter.',
        ['clothes'],
        { acceptedTexts: ['la campera'], emoji: '🧥' },
      ),
      w(
        'es-con-tarjeta',
        'con tarjeta',
        'by card',
        '¿Puedo pagar con tarjeta?',
        'Can I pay by card?',
        ['shopping'],
        { acceptedTranslations: ['with a card'], emoji: '💳' },
      ),
      w(
        'es-en-efectivo',
        'en efectivo',
        'in cash',
        'Pago en efectivo.',
        'I’ll pay in cash.',
        ['shopping'],
        { acceptedTranslations: ['cash'], emoji: '💵' },
      ),
      w(
        'es-me-lo-llevo',
        'me lo llevo',
        "I'll take it",
        'Me gusta este pantalón. Me lo llevo.',
        'I like these trousers. I’ll take them.',
        ['shopping', 'pronouns'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Mejor, peor, más caro',
        objective: 'Compare clothes and prices.',
        intro: {
          explanation:
            'To compare, use más + adjective + que (more … than), menos + adjective + que (less … than) or tan + adjective + como (as … as). The adjective agrees with the noun: la camisa es más cara. Bueno and malo have their own forms: mejor (better) and peor (worse). Watch out for a false friend: largo means long, not large. El pantalón is singular in Spanish, but in English you say trousers.',
          examples: [
            {
              target: 'La camisa es más cara que el pantalón.',
              base: 'The shirt is more expensive than the trousers.',
            },
            {
              target: 'Este vestido es mejor que el rojo.',
              base: 'This dress is better than the red one.',
            },
          ],
        },
        takeaways: [
          'You compare with más… que, menos… que and tan… como.',
          'You say better and worse with mejor and peor.',
        ],
        exercises: [
          ex.translationChoice('mejor', 'better', ['worse', 'more', 'the most'], ['es-mejor'], {
            id: 'es.ex.sa0a98uam7jkim',
          }),
          ex.matchPairs(
            [
              ['la camisa', 'the shirt'],
              ['el pantalón', 'the trousers'],
              ['el vestido', 'the dress'],
              ['peor', 'worse'],
            ],
            ['es-la-camisa', 'es-el-pantalon', 'es-el-vestido', 'es-peor'],
            { id: 'es.ex.o9tbbv6jmcwba7' },
          ),
          ex.fillBlank(
            'La camisa es más cara ___ el pantalón.',
            'The shirt is more expensive than the trousers.',
            'que',
            ['como', 'de', 'tan'],
            ['es-la-camisa', 'es-el-pantalon'],
            {
              id: 'es.ex.mmco6upjtmpikk',
              explanation: 'Más + adjective goes with que: más cara que. Tan goes with como.',
            },
          ),
          ex.fillBlank(
            'Este vestido es ___ que el rojo.',
            'This dress is better than the red one.',
            'mejor',
            ['peor', 'más', 'tan'],
            ['es-mejor', 'es-el-vestido'],
            {
              id: 'es.ex.oi13zfqqwjw49r',
              explanation: 'Better is mejor, never más bueno for things. Peor is worse.',
            },
          ),
          ex.listenChoice(
            'El pantalón es peor.',
            ['El pantalón es mejor.', 'El vestido es peor.'],
            ['es-peor', 'es-el-pantalon'],
            { id: 'es.ex.z05mjvkaqq09y0' },
          ),
          ex.fillBlank(
            'El pantalón negro es tan caro ___ el azul.',
            'The black trousers are as expensive as the blue ones.',
            'como',
            ['que', 'de', 'más'],
            ['es-el-pantalon'],
            {
              id: 'es.ex.4rdnspxausfr9s',
              explanation: 'As … as is tan … como: tan caro como.',
            },
          ),
          ex.translationChoice(
            'el pantalón',
            'the trousers',
            ['the shirt', 'the dress', 'the jacket'],
            ['es-el-pantalon'],
            { id: 'es.ex.u71awfvfonrchm' },
          ),
          ex.orderWords(
            'Esta camisa es mejor que la blanca.',
            'This shirt is better than the white one.',
            ['es-la-camisa', 'es-mejor'],
            { id: 'es.ex.73h2qkzyqcn0bu' },
          ),
          ex.translateWrite(
            'The dress is cheaper than the shirt.',
            'El vestido es más barato que la camisa.',
            ['es-el-vestido', 'es-la-camisa'],
            {
              id: 'es.ex.luyq7mv075ic5p',
              acceptedAnswers: ['El vestido es menos caro que la camisa.'],
            },
          ),
          ex.shortAnswer(
            '¿Cuál es mejor, la camisa azul o la blanca?',
            'Say the blue one is better (start with «La azul»).',
            'La azul es mejor.',
            [
              'La azul.',
              'La azul es mejor',
              'La camisa azul es mejor.',
              'La azul es mejor que la blanca.',
            ],
            ['es-mejor', 'es-la-camisa'],
            { id: 'es.ex.x194jbgrrmqdh5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'El más barato, carísimo',
        objective: 'Say what is the cheapest, the best or really expensive.',
        intro: {
          explanation:
            'To say the most: el, la, los or las + noun + más + adjective + de: la chaqueta más barata del negocio (the cheapest jacket in the shop; Spanish uses de, not en). To say really, add -ísimo: caro → carísimo, barato → baratísimo. The stress always falls on the í of -ísimo, and it always has an accent mark. A jacket is una chaqueta, and in much of Latin America sneakers are los tenis (the same word as the sport, and it never changes: un tenis, dos tenis). In Argentina, Peru and Spain you will also hear las zapatillas.',
          examples: [
            {
              target: 'Son los tenis más baratos del negocio.',
              base: 'They’re the cheapest sneakers in the shop.',
            },
            { target: '¡Esta chaqueta es carísima!', base: 'This jacket is really expensive!' },
          ],
        },
        takeaways: [
          'You say the most with el más or la más + adjective + de.',
          'You say really expensive with carísimo, stressed on the í.',
        ],
        exercises: [
          ex.translationChoice(
            'carísimo',
            'really expensive',
            ['really cheap', 'more expensive', 'the cheapest'],
            ['es-carisimo'],
            { id: 'es.ex.3q5cz1m0yvjrf4' },
          ),
          ex.matchPairs(
            [
              ['los tenis', 'the sneakers'],
              ['la chaqueta', 'the jacket'],
              ['el más', 'the most'],
              ['carísimo', 'really expensive'],
            ],
            ['es-los-tenis', 'es-la-chaqueta', 'es-el-mas', 'es-carisimo'],
            { id: 'es.ex.2jybd1mhniothm' },
          ),
          ex.fillBlank(
            'Es la chaqueta más barata ___ negocio.',
            'It’s the cheapest jacket in the shop.',
            'del',
            ['en el', 'que el', 'como el'],
            ['es-el-mas', 'es-la-chaqueta'],
            {
              id: 'es.ex.39phkqztvqwkjf',
              explanation:
                'After a superlative Spanish uses de (de + el = del), not en: la más barata del negocio.',
            },
          ),
          ex.fillBlank(
            '¡Los tenis son ___!',
            'The sneakers are really expensive!',
            'carísimos',
            ['carísimo', 'carísimas', 'más caros'],
            ['es-carisimo', 'es-los-tenis'],
            {
              id: 'es.ex.l739eyar115ya4',
              explanation: 'Los tenis is masculine plural, so the adjective is too: carísimos.',
            },
          ),
          ex.listenChoice('¡Es carísimo!', ['¡Es baratísimo!', '¡Es caro!'], ['es-carisimo'], {
            id: 'es.ex.enrkcuetbhh9k1',
          }),
          ex.fillBlank(
            'Estos tenis son ___ más lindos del negocio.',
            'These sneakers are the nicest in the shop.',
            'los',
            ['las', 'la', 'el'],
            ['es-el-mas', 'es-los-tenis'],
            {
              id: 'es.ex.wsnqf5r9nzy037',
              explanation: 'The article agrees with the noun: los tenis → los más lindos.',
            },
          ),
          ex.translationChoice(
            'la chaqueta',
            'the jacket',
            ['the dress', 'the sneakers', 'the shirt'],
            ['es-la-chaqueta'],
            { id: 'es.ex.hh9otuc155wz0u' },
          ),
          ex.orderWords(
            'Busco una chaqueta para el invierno.',
            'I’m looking for a jacket for the winter.',
            ['es-la-chaqueta'],
            { id: 'es.ex.bjbotl76hgrlgj' },
          ),
          ex.translateWrite(
            'This jacket is really cheap!',
            '¡Esta chaqueta es baratísima!',
            ['es-la-chaqueta', 'es-carisimo'],
            {
              id: 'es.ex.ggwh9thj564jaq',
              acceptedAnswers: [
                'Esta chaqueta es baratísima.',
                '¡Esta chaqueta es muy barata!',
                '¡Esta campera es baratísima!',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo son los tenis?',
            'Say they are really expensive (use -ísimo).',
            'Son carísimos.',
            ['Son carísimos', 'Los tenis son carísimos.', '¡Son carísimos!'],
            ['es-carisimo', 'es-los-tenis'],
            { id: 'es.ex.cpk3fiv3txdo3x' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Me lo puedo probar?',
        objective: 'Ask for your size and try clothes on.',
        intro: {
          explanation:
            'Clothes come in tallas (sizes) and shoes in números. The ll of talla sounds like the y in yes. Probarse means to try on. To avoid repeating the noun, use lo for a masculine thing (el pantalón → lo) and la for a feminine one (la camisa → la); los and las for plurals. The pronoun goes before the conjugated verb: ¿me lo puedo probar? (can I try it on?). Try clothes on in el probador.',
          examples: [
            {
              target: 'Me gusta este pantalón. ¿Me lo puedo probar?',
              base: 'I like these trousers. Can I try them on?',
            },
            {
              target: '¿Tiene estos tenis en el número cuarenta?',
              base: 'Do you have these sneakers in size forty?',
            },
          ],
        },
        takeaways: [
          'You ask for your size with talla (clothes) and número (shoes).',
          'You ask to try something on with ¿me lo puedo probar? or ¿me la puedo probar?',
        ],
        exercises: [
          ex.translationChoice(
            'la talla',
            'the size (clothes)',
            ['the shoe size', 'the fitting room', 'the sale'],
            ['es-la-talla'],
            { id: 'es.ex.3l4yxf7u5qbc20' },
          ),
          ex.matchPairs(
            [
              ['la talla', 'the size (clothes)'],
              ['el número', 'the shoe size'],
              ['probarse', 'to try on'],
              ['el probador', 'the fitting room'],
            ],
            ['es-la-talla', 'es-el-numero', 'es-probarse', 'es-el-probador'],
            { id: 'es.ex.wtia7w049j6abr' },
          ),
          ex.fillBlank(
            'Me gusta esta camisa. ¿Me ___ puedo probar?',
            'I like this shirt. Can I try it on?',
            'la',
            ['lo', 'los', 'el'],
            ['es-probarse', 'es-la-camisa'],
            {
              id: 'es.ex.8pcmyyfthdpkps',
              explanation:
                'La camisa is feminine singular, so the pronoun is la: ¿me la puedo probar?',
            },
          ),
          ex.fillBlank(
            'Me gusta este pantalón. ¿Me ___ puedo probar?',
            'I like these trousers. Can I try them on?',
            'lo',
            ['la', 'las', 'le'],
            ['es-probarse', 'es-el-pantalon'],
            {
              id: 'es.ex.ons8gucdsrkcqg',
              explanation:
                'El pantalón is masculine singular in Spanish, so the pronoun is lo, even though English says them.',
            },
          ),
          ex.listenChoice(
            '¿Qué talla usas?',
            ['¿Qué número usas?', '¿Qué color usas?'],
            ['es-la-talla'],
            { id: 'es.ex.8w65fgv9aehk1v' },
          ),
          ex.fillBlank(
            'El ___ está al lado de la puerta.',
            'The fitting room is next to the door.',
            'probador',
            ['número', 'pantalón', 'vestido'],
            ['es-el-probador'],
            {
              id: 'es.ex.q6bqodgchg1ud6',
              skill: 'vocabulary',
              explanation: 'El probador is the fitting room, where you try clothes on (probarse).',
            },
          ),
          ex.translationChoice(
            'probarse',
            'to try on',
            ['to buy', 'to pay', 'to look for'],
            ['es-probarse'],
            { id: 'es.ex.u2mq7cizeu7ogp' },
          ),
          ex.orderWords(
            'Quiero probarme el vestido azul.',
            'I want to try on the blue dress.',
            ['es-probarse', 'es-el-vestido'],
            { id: 'es.ex.ti3os3wkysompt' },
          ),
          ex.translateWrite(
            'Do you have these sneakers in size forty? (formal)',
            '¿Tiene estos tenis en el número cuarenta?',
            ['es-el-numero', 'es-los-tenis'],
            {
              id: 'es.ex.djqdwdjnw80fxk',
              acceptedAnswers: [
                '¿Tiene estos tenis en cuarenta?',
                '¿Tiene estos tenis en el cuarenta?',
                '¿Tiene los tenis en el número cuarenta?',
                '¿Los tiene en el número cuarenta?',
                'Tiene estos tenis en el número cuarenta',
                '¿Tienes estos tenis en el número cuarenta?',
                '¿Tiene estas zapatillas en el número cuarenta?',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué talla usas?',
            'Say you wear size forty (start with «Uso»).',
            'Uso talla cuarenta.',
            [
              'Uso talla cuarenta',
              'Uso la talla cuarenta.',
              'Uso talla 40.',
              'Talla cuarenta.',
              'Soy talla cuarenta.',
              'Uso talle cuarenta.',
            ],
            ['es-la-talla'],
            { id: 'es.ex.n8k41otqavi1no' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Me lo llevo',
        objective: 'Say you’ll buy something and choose how to pay.',
        intro: {
          explanation:
            'To say you’ll buy something: me lo llevo (I’ll take it), me la llevo for a feminine thing, me los llevo or me las llevo for plurals. If something fits or suits you: me queda bien. You pay con tarjeta (by card) or en efectivo (in cash). A liquidación is a sale: many shops have big sales at the end of each season (you will also hear las rebajas and las ofertas).',
          examples: [
            { target: 'Me gusta. Me lo llevo.', base: 'I like it. I’ll take it.' },
            { target: '¿Puedo pagar con tarjeta?', base: 'Can I pay by card?' },
          ],
        },
        takeaways: [
          'You say you’ll buy something with me lo llevo or me la llevo.',
          'You pay con tarjeta or en efectivo.',
        ],
        exercises: [
          ex.translationChoice(
            'me lo llevo',
            "I'll take it",
            ["I'll try it on", 'I like it', "I'm looking for it"],
            ['es-me-lo-llevo'],
            { id: 'es.ex.ky8p9zz0wyvwn4' },
          ),
          ex.fillBlank(
            'Me gustan los tenis. Me ___ llevo.',
            'I like the sneakers. I’ll take them.',
            'los',
            ['lo', 'la', 'las'],
            ['es-me-lo-llevo', 'es-los-tenis'],
            {
              id: 'es.ex.3p5m4ose1s6pwd',
              explanation: 'Los tenis is masculine plural, so the pronoun is los: me los llevo.',
            },
          ),
          ex.matchPairs(
            [
              ['la liquidación', 'the sale'],
              ['con tarjeta', 'by card'],
              ['en efectivo', 'in cash'],
              ['me lo llevo', "I'll take it"],
            ],
            ['es-la-liquidacion', 'es-con-tarjeta', 'es-en-efectivo', 'es-me-lo-llevo'],
            { id: 'es.ex.9bilyoe4zrqs99' },
          ),
          ex.listenChoice(
            '¿Paga con tarjeta?',
            ['¿Paga en efectivo?', '¿Pago con tarjeta?'],
            ['es-con-tarjeta'],
            { id: 'es.ex.bymbhf5y4f8bj5' },
          ),
          question(
            'es.ex.mlo1a8thdgbjle',
            NEGOCIO,
            'What is Sofía looking for?',
            'A jacket for the winter',
            ['A dress for a party', 'Sneakers', 'A white shirt'],
            ['es-la-chaqueta'],
            'Sofía says “Busco una chaqueta para el invierno”.',
          ),
          question(
            'es.ex.gtrl6vr2hi3ymb',
            NEGOCIO,
            'What does Camila say about the black jacket?',
            'It is more expensive, but better',
            [
              'It is cheaper and better',
              'It is the cheapest in the shop',
              'It is worse than the blue one',
            ],
            ['es-mejor'],
            'Camila says “La negra es más cara, pero es mejor”.',
          ),
          question(
            'es.ex.3xl1bfo045c9l4',
            NEGOCIO,
            'Where is the fitting room?',
            'Next to the window',
            ['Next to the door', 'Upstairs', 'Opposite the window'],
            ['es-el-probador'],
            'Camila says “El probador está al lado de la ventana”.',
          ),
          question(
            'es.ex.bn3sli248n37eh',
            NEGOCIO,
            'What does Sofía decide?',
            'To buy the jacket and pay by card',
            ['To buy it and pay in cash', 'To try on another size', 'Not to buy anything'],
            ['es-me-lo-llevo', 'es-con-tarjeta'],
            'She says “Me la llevo. ¿Puedo pagar con tarjeta?”, and Camila says yes.',
          ),
          ex.translateWrite('I’ll pay in cash.', 'Pago en efectivo.', ['es-en-efectivo'], {
            id: 'es.ex.k86wsakcusui7q',
            acceptedAnswers: [
              'Voy a pagar en efectivo.',
              'Le pago en efectivo.',
              'Pago en efectivo',
            ],
          }),
          ex.shortAnswer(
            '¿Le gusta la camisa?',
            'You are in a shop. Say yes and that you’ll take it (use «me la llevo»).',
            'Sí, me la llevo.',
            [
              'Sí, me la llevo',
              'Sí. Me la llevo.',
              'Sí, me gusta. Me la llevo.',
              'Sí, me gusta, me la llevo.',
            ],
            ['es-me-lo-llevo', 'es-la-camisa'],
            { id: 'es.ex.3k20fq9j7zzvx0' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¡Liquidación!',
        objective: 'Understand a sale ad and talk about the best prices.',
        intro: {
          explanation:
            'Sale ads use comparisons and superlatives: los tenis más baratos de la ciudad. El mejor and la mejor + noun mean the best: la mejor chaqueta del negocio. Some shops give a discount if you pay en efectivo.',
          examples: [
            {
              target: 'Los tenis más baratos de la ciudad.',
              base: 'The cheapest sneakers in town.',
            },
            {
              target: 'Es la mejor chaqueta del negocio.',
              base: 'It’s the best jacket in the shop.',
            },
          ],
        },
        takeaways: [
          'You understand the offers in a sale ad.',
          'You say the best with el mejor or la mejor + noun.',
        ],
        exercises: [
          question(
            'es.ex.vbkyfctuba241c',
            AVISO,
            'What does the ad offer on jackets, trousers and dresses?',
            'Up to fifty percent off',
            ['Two for the price of one', 'Free sneakers', 'Thirty percent off'],
            ['es-la-liquidacion', 'es-la-chaqueta'],
            'The ad says “Chaquetas, pantalones y vestidos: hasta cincuenta por ciento menos”.',
          ),
          question(
            'es.ex.afs118crgfkukn',
            AVISO,
            'What does the ad say about the sneakers?',
            'They are the cheapest in the city',
            ['They are really expensive', 'They are only for children', 'They are two for one'],
            ['es-el-mas', 'es-los-tenis'],
            'It says “Los tenis más baratos de la ciudad”.',
          ),
          question(
            'es.ex.6gvn6as73y5duc',
            AVISO,
            'What is the offer on shirts?',
            'Two for the price of one',
            ['Half price', 'Free with a jacket', 'There is no offer'],
            ['es-la-camisa'],
            'The ad says “Camisas: dos por el precio de una”.',
          ),
          question(
            'es.ex.4a2mjaqxfvpxi5',
            AVISO,
            'How do you get the lowest price?',
            'By paying in cash',
            ['By paying by card', 'By buying two jackets', 'By coming on Saturday'],
            ['es-en-efectivo', 'es-con-tarjeta'],
            'The ad says “En efectivo, ¡más barato todavía!”: in cash, even cheaper.',
          ),
          ex.listenChoice(
            'Es la más barata.',
            ['Es la más cara.', 'Es carísima.'],
            ['es-el-mas', 'es-carisimo'],
            { id: 'es.ex.0eawjemjl60e6y' },
          ),
          ex.fillBlank(
            'Con la ___, todo es más barato.',
            'With the sale, everything is cheaper.',
            'liquidación',
            ['tarjeta', 'chaqueta', 'camisa'],
            ['es-la-liquidacion'],
            {
              id: 'es.ex.nh45am8xo2ucjf',
              skill: 'vocabulary',
              explanation:
                'La liquidación is the sale. It ends in -ión, so the stress falls on the last syllable.',
            },
          ),
          ex.translationChoice(
            'en efectivo',
            'in cash',
            ['by card', 'on sale', 'really cheap'],
            ['es-en-efectivo'],
            { id: 'es.ex.qazq7qo96hphbj' },
          ),
          ex.orderWords(
            'Los tenis son más baratos en efectivo.',
            'The sneakers are cheaper in cash.',
            ['es-los-tenis', 'es-en-efectivo'],
            { id: 'es.ex.iig8nq86xjuhrx' },
          ),
          ex.translateWrite(
            'It’s the best jacket in the shop.',
            'Es la mejor chaqueta del negocio.',
            ['es-mejor', 'es-la-chaqueta'],
            {
              id: 'es.ex.yvkm3vgyfl4h69',
              acceptedAnswers: [
                'Es la mejor chaqueta del negocio',
                'Esta es la mejor chaqueta del negocio.',
                'Es la mejor chaqueta de la tienda.',
                'Es la mejor campera del negocio.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Paga con tarjeta o en efectivo?',
            'Say you’ll pay by card (start with «Con»).',
            'Con tarjeta.',
            [
              'Con tarjeta',
              'Con tarjeta, por favor.',
              'Pago con tarjeta.',
              'Con tarjeta, gracias.',
            ],
            ['es-con-tarjeta'],
            { id: 'es.ex.j7gf8ngav4d3qd' },
          ),
        ],
      },
    ],
  },
};

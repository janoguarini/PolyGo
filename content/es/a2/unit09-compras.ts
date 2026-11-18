import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U9 «Shopping and services» (docs/ES_A1_A2.md): comparativos (más… que, menos… que,
 * tan… como) y los irregulares mejor / peor; superlativo el más… / la más… de y el absoluto -ísimo
 * (carísimo, baratísimo); pronombre de objeto directo con la ropa (me lo llevo, ¿me la puedo
 * probar?). Probarse, el probador, el talle y el número de calzado, la liquidación, pagar con tarjeta o
 * en efectivo. Vocabulario rioplatense: la campera, las zapatillas.
 * Pronunciación: el acento de -ísimo (siempre en la í, siempre con tilde); la z de zapatillas suena s
 * y la ll como la sh inglesa.
 * Cultura: las liquidaciones de fin de temporada; el descuento por pagar en efectivo.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NEGOCIO = dialogue(
  'es.stim.a2-u9-negocio',
  'Sofía is shopping for a jacket. Camila works in the clothes shop.',
  [
    ['Sofía', 'Buenas tardes. Busco una campera para el invierno.'],
    ['Camila', 'Tenemos esta azul y esta negra. La negra es más cara, pero es mejor.'],
    ['Sofía', 'Me gusta la negra. ¿Me la puedo probar? Uso talle cuarenta.'],
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
    'Camperas, pantalones y vestidos: hasta cincuenta por ciento menos.',
    'Las zapatillas más baratas de la ciudad: desde treinta mil pesos.',
    'Camisas: dos por el precio de una.',
    'Podés pagar con tarjeta o en efectivo. En efectivo, ¡más barato todavía!',
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
    'usás',
    'uso',
    'paga',
    'pago',
    'pagar',
    'claro',
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
        'To compare: más + adjective + que (more … than), menos + adjective + que (less … than) and tan + adjective + como (as … as). Bueno and malo have their own forms: mejor (better) and peor (worse). To say the most: el, la, los or las + noun + más + adjective + de: la campera más barata del negocio (de, not en). To say really or extremely, add -ísimo to the adjective: caro → carísimo, barato → baratísimo; the stress always falls on that í, which always carries an accent mark. Lo, la, los and las replace a noun you already mentioned (el pantalón → lo, la camisa → la). They go before the conjugated verb: me lo llevo (I’ll take it), ¿me la puedo probar? (can I try it on?).',
      examples: [
        {
          target: 'La campera negra es mejor que la azul.',
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
        'A2 nuevo (U9). Sin revisión nativa. Revisar: «uso talle cuarenta» (también «soy talle cuarenta», coloquial, aceptado); «el número» traducido como «the shoe size» (aceptado «the number»); los precios del aviso («desde treinta mil pesos») pueden quedar viejos con la inflación; «me queda muy bien» se usa sin enseñarse como palabra (apoyo «queda»); el descuento por pago en efectivo es habitual pero no universal.',
    },
    words: [
      w(
        'es-mejor',
        'mejor',
        'better',
        'Esta campera es mejor que la azul.',
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
        '¡Las zapatillas son carísimas!',
        'The sneakers are really expensive!',
        ['comparisons', 'shopping'],
        {
          acceptedTranslations: ['very expensive'],
          acceptedTexts: ['carísima', 'carísimos', 'carísimas'],
          emoji: '💸',
        },
      ),
      w(
        'es-el-talle',
        'el talle',
        'the size (clothes)',
        '¿Qué talle usás?',
        'What size do you wear?',
        ['shopping', 'argentina'],
      ),
      w(
        'es-el-numero',
        'el número',
        'the shoe size',
        '¿Tiene estas zapatillas en el número cuarenta?',
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
        'es-las-zapatillas',
        'las zapatillas',
        'the sneakers',
        'Quiero unas zapatillas blancas.',
        'I want some white sneakers.',
        ['clothes', 'argentina'],
        { acceptedTranslations: ['the trainers'], emoji: '👟' },
      ),
      w(
        'es-la-campera',
        'la campera',
        'the jacket',
        'Busco una campera para el invierno.',
        'I’m looking for a jacket for the winter.',
        ['clothes', 'argentina'],
        { emoji: '🧥' },
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
            'To say the most: el, la, los or las + noun + más + adjective + de: la campera más barata del negocio (the cheapest jacket in the shop; Spanish uses de, not en). To say really, add -ísimo: caro → carísimo, barato → baratísimo. The stress always falls on the í of -ísimo, and it always has an accent mark. In Argentina a jacket is una campera and sneakers are zapatillas; the z sounds like s and the ll like the sh in shoe.',
          examples: [
            {
              target: 'Son las zapatillas más baratas del negocio.',
              base: 'They’re the cheapest sneakers in the shop.',
            },
            { target: '¡Esta campera es carísima!', base: 'This jacket is really expensive!' },
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
              ['las zapatillas', 'the sneakers'],
              ['la campera', 'the jacket'],
              ['el más', 'the most'],
              ['carísimo', 'really expensive'],
            ],
            ['es-las-zapatillas', 'es-la-campera', 'es-el-mas', 'es-carisimo'],
            { id: 'es.ex.6pzs1gfnydjfob' },
          ),
          ex.fillBlank(
            'Es la campera más barata ___ negocio.',
            'It’s the cheapest jacket in the shop.',
            'del',
            ['en el', 'que el', 'como el'],
            ['es-el-mas', 'es-la-campera'],
            {
              id: 'es.ex.6k7dsm7iju1mqe',
              explanation:
                'After a superlative Spanish uses de (de + el = del), not en: la más barata del negocio.',
            },
          ),
          ex.fillBlank(
            '¡Las zapatillas son ___!',
            'The sneakers are really expensive!',
            'carísimas',
            ['carísimo', 'carísima', 'más caras'],
            ['es-carisimo', 'es-las-zapatillas'],
            {
              id: 'es.ex.ligj6eiriv9mdu',
              explanation: 'Las zapatillas is feminine plural, so the adjective is too: carísimas.',
            },
          ),
          ex.listenChoice('¡Es carísimo!', ['¡Es baratísimo!', '¡Es caro!'], ['es-carisimo'], {
            id: 'es.ex.enrkcuetbhh9k1',
          }),
          ex.fillBlank(
            'Estas zapatillas son ___ más lindas del negocio.',
            'These sneakers are the nicest in the shop.',
            'las',
            ['los', 'la', 'el'],
            ['es-el-mas', 'es-las-zapatillas'],
            {
              id: 'es.ex.r72dr6gv0c9whi',
              explanation: 'The article agrees with the noun: las zapatillas → las más lindas.',
            },
          ),
          ex.translationChoice(
            'la campera',
            'the jacket',
            ['the dress', 'the sneakers', 'the shirt'],
            ['es-la-campera'],
            { id: 'es.ex.ziad9c5twc4bo6' },
          ),
          ex.orderWords(
            'Busco una campera para el invierno.',
            'I’m looking for a jacket for the winter.',
            ['es-la-campera'],
            { id: 'es.ex.vzlt353xe9vr8a' },
          ),
          ex.translateWrite(
            'This jacket is really cheap!',
            '¡Esta campera es baratísima!',
            ['es-la-campera', 'es-carisimo'],
            {
              id: 'es.ex.vtyaady6kv5do9',
              acceptedAnswers: ['Esta campera es baratísima.', '¡Esta campera es muy barata!'],
            },
          ),
          ex.shortAnswer(
            '¿Cómo son las zapatillas?',
            'Say they are really expensive (use -ísimo).',
            'Son carísimas.',
            ['Son carísimas', 'Las zapatillas son carísimas.', '¡Son carísimas!'],
            ['es-carisimo', 'es-las-zapatillas'],
            { id: 'es.ex.2riz1ed5691fcy' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Me lo puedo probar?',
        objective: 'Ask for your size and try clothes on.',
        intro: {
          explanation:
            'In Argentina clothes come in talles (sizes) and shoes in números. Probarse means to try on. To avoid repeating the noun, use lo for a masculine thing (el pantalón → lo) and la for a feminine one (la camisa → la); los and las for plurals. The pronoun goes before the conjugated verb: ¿me lo puedo probar? (can I try it on?). Try clothes on in el probador.',
          examples: [
            {
              target: 'Me gusta este pantalón. ¿Me lo puedo probar?',
              base: 'I like these trousers. Can I try them on?',
            },
            {
              target: '¿Tiene estas zapatillas en el número cuarenta?',
              base: 'Do you have these sneakers in size forty?',
            },
          ],
        },
        takeaways: [
          'You ask for your size with talle (clothes) and número (shoes).',
          'You ask to try something on with ¿me lo puedo probar? or ¿me la puedo probar?',
        ],
        exercises: [
          ex.translationChoice(
            'el talle',
            'the size (clothes)',
            ['the shoe size', 'the fitting room', 'the sale'],
            ['es-el-talle'],
            { id: 'es.ex.596xgz8s4b3rb4' },
          ),
          ex.matchPairs(
            [
              ['el talle', 'the size (clothes)'],
              ['el número', 'the shoe size'],
              ['probarse', 'to try on'],
              ['el probador', 'the fitting room'],
            ],
            ['es-el-talle', 'es-el-numero', 'es-probarse', 'es-el-probador'],
            { id: 'es.ex.gh96xev1b0wefx' },
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
            '¿Qué talle usás?',
            ['¿Qué número usás?', '¿Qué color usás?'],
            ['es-el-talle'],
            { id: 'es.ex.gc3tc09n4r2kss' },
          ),
          ex.fillBlank(
            'El ___ está al lado de la puerta.',
            'The fitting room is next to the door.',
            'probador',
            ['talle', 'número', 'pantalón'],
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
            '¿Tiene estas zapatillas en el número cuarenta?',
            ['es-el-numero', 'es-las-zapatillas'],
            {
              id: 'es.ex.gzdd9twk5y44vr',
              acceptedAnswers: [
                '¿Tiene estas zapatillas en cuarenta?',
                '¿Tiene estas zapatillas en el cuarenta?',
                '¿Tenés estas zapatillas en el número cuarenta?',
                '¿Las tiene en el número cuarenta?',
                'Tiene estas zapatillas en el número cuarenta',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué talle usás?',
            'Say you wear size forty (start with «Uso»).',
            'Uso talle cuarenta.',
            [
              'Uso talle cuarenta',
              'Uso el talle cuarenta.',
              'Uso talle 40.',
              'Talle cuarenta.',
              'Soy talle cuarenta.',
            ],
            ['es-el-talle'],
            { id: 'es.ex.8e4cn73u1grhwu' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Me lo llevo',
        objective: 'Say you’ll buy something and choose how to pay.',
        intro: {
          explanation:
            'To say you’ll buy something: me lo llevo (I’ll take it), me la llevo for a feminine thing, me los llevo or me las llevo for plurals. If something fits or suits you: me queda bien. You pay con tarjeta (by card) or en efectivo (in cash). A liquidación is a sale: Argentine shops have big sales at the end of each season.',
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
            'Me gustan las zapatillas. Me ___ llevo.',
            'I like the sneakers. I’ll take them.',
            'las',
            ['lo', 'la', 'los'],
            ['es-me-lo-llevo', 'es-las-zapatillas'],
            {
              id: 'es.ex.75echxx6s4e64m',
              explanation:
                'Las zapatillas is feminine plural, so the pronoun is las: me las llevo.',
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
            'es.ex.ho77xjy792upmp',
            NEGOCIO,
            'What is Sofía looking for?',
            'A jacket for the winter',
            ['A dress for a party', 'Sneakers', 'A white shirt'],
            ['es-la-campera'],
            'Sofía says “Busco una campera para el invierno”.',
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
            'Sale ads use comparisons and superlatives: las zapatillas más baratas de la ciudad. El mejor and la mejor + noun mean the best: la mejor campera del negocio. Many shops in Argentina give a discount if you pay en efectivo.',
          examples: [
            {
              target: 'Las zapatillas más baratas de la ciudad.',
              base: 'The cheapest sneakers in town.',
            },
            {
              target: 'Es la mejor campera del negocio.',
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
            'es.ex.12gg2wvku2owqj',
            AVISO,
            'What does the ad offer on jackets, trousers and dresses?',
            'Up to fifty percent off',
            ['Two for the price of one', 'Free sneakers', 'Thirty percent off'],
            ['es-la-liquidacion', 'es-la-campera'],
            'The ad says “Camperas, pantalones y vestidos: hasta cincuenta por ciento menos”.',
          ),
          question(
            'es.ex.i0jhi13t49soyt',
            AVISO,
            'What does the ad say about the sneakers?',
            'They are the cheapest in the city',
            ['They are really expensive', 'They are only for children', 'They are two for one'],
            ['es-el-mas', 'es-las-zapatillas'],
            'It says “Las zapatillas más baratas de la ciudad”.',
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
            ['tarjeta', 'campera', 'camisa'],
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
            'Las zapatillas son más baratas en efectivo.',
            'The sneakers are cheaper in cash.',
            ['es-las-zapatillas', 'es-en-efectivo'],
            { id: 'es.ex.099jhhkuv1ximj' },
          ),
          ex.translateWrite(
            'It’s the best jacket in the shop.',
            'Es la mejor campera del negocio.',
            ['es-mejor', 'es-la-campera'],
            {
              id: 'es.ex.ivyox7bozy2z3t',
              acceptedAnswers: [
                'Es la mejor campera del negocio',
                'Esta es la mejor campera del negocio.',
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

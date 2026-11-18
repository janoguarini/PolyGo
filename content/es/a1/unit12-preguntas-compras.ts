import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U12 «Questions and shopping» (docs/ES_A1_A2.md): las palabras interrogativas (quién,
 * qué, cuál, cómo, cuánto / cuánta / cuántos / cuántas, por qué) y la respuesta con porque; comprar en
 * un negocio: ¿cuánto cuesta?, caro / barato (con concordancia), busco…, y los números 13, 15, 30, 40,
 * 50 y cien (cien frente a ciento veinte).
 * Pronunciación: la entonación de las preguntas con palabra interrogativa (baja al final), por qué
 * (acento en qué) frente a porque (acento en por), y la c / qu de cinco, cincuenta, quince.
 * Cultura: los precios en pesos suelen ir en miles (treinta mil pesos) y el signo $ es el del peso.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const REMERA = dialogue(
  'es.stim.a1-u12-remera',
  'Lucía is shopping for a T-shirt in a small clothes shop.',
  [
    ['Juan', 'Buenas tardes. ¿Qué busca?'],
    ['Lucía', 'Busco una remera blanca.'],
    ['Juan', 'Esta es muy linda.'],
    ['Lucía', '¿Cuánto cuesta?'],
    ['Juan', 'Cuesta cuarenta mil pesos.'],
    ['Lucía', '¡Es muy cara! ¿Y la remera azul?'],
    ['Juan', 'La azul cuesta quince mil pesos.'],
    ['Lucía', 'Bien, la azul, por favor.'],
  ],
  ES_A1_RATE,
);

const CARTEL = reading(
  'es.stim.a1-u12-cartel',
  'ad',
  'A sign in the window of a small shop.',
  [
    '¡Hoy, todo muy barato!',
    'Cuadernos: cinco mil pesos.',
    'Lapiceras azules y rojas: mil pesos.',
    'Mochilas: cincuenta mil pesos.',
    'Abierto hasta las ocho de la noche.',
  ],
  { title: 'El negocio de Ana' },
);

export const ES_A1_U12: EsUnitDef = {
  names: ['Lucía', 'Juan', 'Ana', 'Buenos Aires'],
  support: ['buscás', 'busca', 'remera', 'linda', 'mil', 'ciento', 'abierto'],
  unit: {
    position: 12,
    title: 'Questions and shopping',
    titleEn: 'Preguntas y compras',
    description:
      'Ask questions with quién, qué, cuál, cómo, cuánto and por qué, answer with porque, count from 13 to 100 and ask for prices in a shop.',
    emoji: '🛍️',
    objective:
      'You can ask and answer simple questions, give reasons with porque, ask what something costs, say if it is expensive or cheap and say what you are looking for in a shop.',
    grammar: {
      title: 'Question words · ¿cuánto cuesta? · caro / barato',
      explanation:
        'Question words always carry a written accent: ¿quién? (who), ¿qué? (what), ¿cuál? (which one), ¿cómo? (how, or what something is like), ¿cuánto? (how much) and ¿por qué? (why, two words). The answer to ¿por qué? is porque (because: one word, no accent). Spanish questions open with ¿ and close with ?. Cuánto agrees with the noun: ¿cuánto?, ¿cuánta agua?, ¿cuántos hermanos?, ¿cuántas sillas? To ask a price: ¿cuánto cuesta? Caro (expensive) and barato (cheap) agree too: el libro es caro, la remera es cara. Busco means I’m looking for, with no word for “for”: busco una remera.',
      examples: [
        {
          target: '¿Quién es? ¿Qué buscás? ¿Cuál preferís?',
          base: 'Who is it? What are you looking for? Which one do you prefer?',
        },
        {
          target: '¿Por qué no te gusta? — Porque es caro.',
          base: 'Why don’t you like it? — Because it’s expensive.',
        },
        {
          target: '¿Cuánto cuesta? — Cuesta cien pesos.',
          base: 'How much is it? — It costs a hundred pesos.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U12). Sin revisión nativa: revisar los precios (en la Argentina van en miles; usamos «mil» como apoyo), «el negocio» como palabra general para tienda, «¿Qué busca?» del vendedor con usted, y si «¿cuál preferís?» frente a «¿qué preferís?» queda bien explicado (ambas se oyen; el ejercicio evita poner las dos como opciones).',
    },
    words: [
      w(
        'es-quien',
        'quién',
        'who',
        '¿Quién es él? — Es mi hermano.',
        'Who is he? — He’s my brother.',
        ['questions'],
      ),
      w('es-que', 'qué', 'what', '¿Qué buscás?', 'What are you looking for?', ['questions']),
      w(
        'es-por-que',
        'por qué',
        'why',
        '¿Por qué no te gusta el café?',
        'Why don’t you like coffee?',
        ['questions'],
      ),
      w(
        'es-porque',
        'porque',
        'because',
        'Tomo mate porque me encanta.',
        'I drink mate because I love it.',
        ['connectors'],
      ),
      w(
        'es-como',
        'cómo',
        'how',
        '¿Cómo es tu casa? — Es grande.',
        'What is your house like? — It’s big.',
        ['questions'],
      ),
      w(
        'es-cuanto',
        'cuánto',
        'how much',
        '¿Cuántos hermanos tenés?',
        'How many brothers and sisters do you have?',
        ['questions'],
        { acceptedTranslations: ['how many'], acceptedTexts: ['cuánta', 'cuántos', 'cuántas'] },
      ),
      w(
        'es-cuanto-cuesta',
        '¿cuánto cuesta?',
        'how much is it?',
        '¿Cuánto cuesta el libro?',
        'How much is the book?',
        ['shopping', 'questions'],
        { acceptedTranslations: ['how much does it cost?'] },
      ),
      w('es-cual', 'cuál', 'which', '¿Cuál preferís?', 'Which one do you prefer?', ['questions'], {
        acceptedTranslations: ['which one'],
      }),
      w(
        'es-caro',
        'caro',
        'expensive',
        'Este celular es muy caro.',
        'This phone is very expensive.',
        ['shopping'],
        { acceptedTexts: ['cara', 'caros', 'caras'] },
      ),
      w(
        'es-barato',
        'barato',
        'cheap',
        'La remera es barata.',
        'The T-shirt is cheap.',
        ['shopping'],
        {
          acceptedTexts: ['barata', 'baratos', 'baratas'],
        },
      ),
      w(
        'es-el-negocio',
        'el negocio',
        'the shop',
        'El negocio está cerca de la estación.',
        'The shop is near the station.',
        ['shopping', 'argentina'],
        { acceptedTranslations: ['the store'], emoji: '🏪' },
      ),
      w(
        'es-el-peso',
        'el peso',
        'the peso',
        'Cuesta cien pesos.',
        'It costs a hundred pesos.',
        ['shopping', 'money'],
        { emoji: '💵' },
      ),
      w(
        'es-busco',
        'busco',
        "I'm looking for",
        'Busco una mochila azul.',
        'I’m looking for a blue backpack.',
        ['verbs', 'shopping'],
        { acceptedTranslations: ['I look for'] },
      ),
      w('es-trece', 'trece', 'thirteen', 'Mi hermana tiene trece años.', 'My sister is thirteen.', [
        'numbers',
      ]),
      w('es-quince', 'quince', 'fifteen', 'Tengo quince años.', 'I’m fifteen.', ['numbers']),
      w('es-treinta', 'treinta', 'thirty', 'Hay treinta sillas.', 'There are thirty chairs.', [
        'numbers',
      ]),
      w('es-cuarenta', 'cuarenta', 'forty', 'Mi papá tiene cuarenta años.', 'My dad is forty.', [
        'numbers',
      ]),
      w(
        'es-cincuenta',
        'cincuenta',
        'fifty',
        'Cuesta cincuenta mil pesos.',
        'It costs fifty thousand pesos.',
        ['numbers'],
      ),
      w(
        'es-cien',
        'cien',
        'a hundred',
        'Cien pesos, por favor.',
        'A hundred pesos, please.',
        ['numbers'],
        { acceptedTranslations: ['one hundred'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Quién? ¿Qué? ¿Cuál?',
        objective: 'Ask who someone is, what something is and which one.',
        intro: {
          explanation:
            'Question words always have a written accent, and the question opens with ¿: ¿quién? (who), ¿qué? (what), ¿cuál? (which one). Cuál is for choosing between things: ¿cuál es tu libro? In questions with a question word, the voice usually goes down at the end, not up as in a yes/no question.',
          examples: [
            { target: '¿Quién es ella? — Es mi mamá.', base: 'Who is she? — She’s my mom.' },
            {
              target: '¿Cuál es tu mochila? — La roja.',
              base: 'Which one is your backpack? — The red one.',
            },
          ],
        },
        takeaways: [
          'You ask with ¿quién?, ¿qué? and ¿cuál?, always with an accent.',
          'You open every question with ¿ and close it with ?.',
        ],
        exercises: [
          ex.translationChoice('quién', 'who', ['what', 'which', 'how'], ['es-quien'], {
            id: 'es.ex.669k3xsu4bwqi7',
          }),
          ex.translationChoice('cuál', 'which', ['who', 'why', 'how much'], ['es-cual'], {
            id: 'es.ex.il3tdg7o3cr4w3',
          }),
          ex.fillBlank(
            '¿___ es él? — Es mi hermano.',
            'Who is he? — He’s my brother.',
            'Quién',
            ['Qué', 'Cuál', 'Dónde'],
            ['es-quien'],
            {
              id: 'es.ex.klb7lb8399qa4r',
              explanation: 'To ask about a person: ¿quién? The answer is a person: es mi hermano.',
            },
          ),
          ex.listenChoice(
            '¿Quién es?',
            ['¿Qué es?', '¿Cuál es?'],
            ['es-quien', 'es-que', 'es-cual'],
            {
              id: 'es.ex.0k6757bu6gev4a',
            },
          ),
          ex.fillBlank(
            '¿___ buscás?',
            'What are you looking for?',
            'Qué',
            ['Quién', 'Cuántos', 'Cómo'],
            ['es-que'],
            {
              id: 'es.ex.8i4smx5qyr6upy',
              explanation:
                'For a thing: ¿qué? (what). ¿Quién? is for people and ¿cuántos? for how many.',
            },
          ),
          ex.matchPairs(
            [
              ['quién', 'who'],
              ['qué', 'what'],
              ['cuál', 'which'],
              ['cómo', 'how'],
            ],
            ['es-quien', 'es-que', 'es-cual', 'es-como'],
            { id: 'es.ex.au4p7om720n4wz' },
          ),
          ex.fillBlank(
            '¿___ preferís, el rojo o el azul?',
            'Which one do you prefer, the red one or the blue one?',
            'Cuál',
            ['Quién', 'Cómo', 'Dónde'],
            ['es-cual'],
            {
              id: 'es.ex.j29fdo2nb7dsvh',
              explanation: 'To choose between things, use ¿cuál? (which one).',
            },
          ),
          ex.listenChoice(
            '¿Cuál es tu libro?',
            ['¿Cuál es tu mochila?', '¿Quién es tu hermano?', '¿Qué es esto?'],
            ['es-cual'],
            { id: 'es.ex.fpdk2ei4bjctce' },
          ),
          ex.translateWrite('Who is she?', '¿Quién es ella?', ['es-quien'], {
            id: 'es.ex.if62205zoj7b0l',
            acceptedAnswers: ['¿Quién es?'],
          }),
          ex.shortAnswer(
            '¿Quién es ella?',
            'Answer that she is your sister (e.g. «Es mi hermana.»).',
            'Es mi hermana.',
            ['Ella es mi hermana.', 'Mi hermana.'],
            ['es-quien'],
            { id: 'es.ex.2oda23f9jvavwo' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '¿Por qué? Porque…',
        objective: 'Ask how something is and why, and give a reason with porque.',
        intro: {
          explanation:
            '¿Cómo es…? asks what something or someone is like: ¿cómo es tu casa? — Es grande. ¿Por qué? (two words, accent on qué) means why; the answer starts with porque (one word, no accent, stress on por): because. You hear the difference in the stress: por QUÉ, POR-que.',
          examples: [
            {
              target: '¿Cómo es tu ciudad? — Es muy grande.',
              base: 'What is your city like? — It’s very big.',
            },
            {
              target: '¿Por qué tomás mate? — Porque me encanta.',
              base: 'Why do you drink mate? — Because I love it.',
            },
          ],
        },
        takeaways: [
          'You ask why with ¿por qué? and answer with porque.',
          'You ask what something is like with ¿cómo es…?',
        ],
        exercises: [
          ex.translationChoice('por qué', 'why', ['because', 'how', 'who'], ['es-por-que'], {
            id: 'es.ex.giznwhdpb6w6k4',
          }),
          ex.translationChoice('porque', 'because', ['why', 'which', 'what'], ['es-porque'], {
            id: 'es.ex.qe90e6rwy63wx4',
          }),
          ex.fillBlank(
            '¿___ no te gusta el fútbol? — Porque odio el deporte.',
            'Why don’t you like football? — Because I hate sport.',
            'Por qué',
            ['Cómo', 'Quién', 'Cuál'],
            ['es-por-que', 'es-porque'],
            {
              id: 'es.ex.htc4fo711x7c1g',
              explanation:
                'To ask for a reason: ¿por qué? (two words, with an accent). The answer starts with porque.',
            },
          ),
          ex.fillBlank(
            'Tomo mate ___ me encanta.',
            'I drink mate because I love it.',
            'porque',
            ['cómo', 'quién', 'cuál'],
            ['es-porque'],
            {
              id: 'es.ex.xigzljma1fgizy',
              explanation: 'Because is porque: one word, with no accent.',
            },
          ),
          ex.listenChoice(
            '¿Cómo es tu ciudad?',
            ['¿Cómo es tu casa?', '¿Dónde está tu ciudad?', '¿Cuál es tu ciudad?'],
            ['es-como'],
            { id: 'es.ex.c0h5kx9wmmggc7' },
          ),
          ex.translationChoice('cómo', 'how', ['why', 'who', 'which'], ['es-como'], {
            id: 'es.ex.q94u2m2drw1x8p',
          }),
          ex.orderWords(
            'Voy al cine porque me gusta.',
            'I go to the cinema because I like it.',
            ['es-porque'],
            { id: 'es.ex.u7clmnxlezl2zv' },
          ),
          ex.listenChoice(
            'Porque es grande.',
            ['Porque es chico.', 'Porque es mi casa.'],
            ['es-porque'],
            { id: 'es.ex.e3l0taw8xpcnjp' },
          ),
          ex.translateWrite(
            'Why don’t you like coffee?',
            '¿Por qué no te gusta el café?',
            ['es-por-que'],
            {
              id: 'es.ex.xuri1hyvx32gtd',
              acceptedAnswers: ['¿Por qué a vos no te gusta el café?'],
            },
          ),
          ex.shortAnswer(
            '¿Por qué te gusta Buenos Aires?',
            'Answer: because it is very big (start with «Porque…»).',
            'Porque es muy grande.',
            ['Porque es grande.', 'Me gusta porque es muy grande.', 'Porque es una ciudad grande.'],
            ['es-porque'],
            { id: 'es.ex.sr6bee8u9uc3k4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Trece, quince, treinta…',
        objective: 'Count from 13 to 100 and ask how many.',
        intro: {
          explanation:
            '13 is trece and 15 is quince. The tens: treinta (30), cuarenta (40), cincuenta (50); in between you add y: treinta y uno, cuarenta y cinco. 100 is cien, but from 101 it is ciento: ciento veinte. ¿Cuánto? agrees with the noun: ¿cuántos hermanos?, ¿cuántas sillas?, ¿cuánta agua? The c in cinco and cincuenta sounds like s; the qu in quince sounds like k.',
          examples: [
            {
              target: 'Mi papá tiene cuarenta y cinco años.',
              base: 'My dad is forty-five.',
            },
            {
              target: '¿Cuántas sillas hay? — Hay treinta.',
              base: 'How many chairs are there? — There are thirty.',
            },
            {
              target: 'Hay cien libros. Hay ciento veinte cuadernos.',
              base: 'There are a hundred books. There are a hundred and twenty notebooks.',
            },
          ],
        },
        takeaways: [
          'You count 13, 15 and in tens up to cien.',
          'You ask how many with ¿cuántos? or ¿cuántas?',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['trece', 'thirteen'],
              ['quince', 'fifteen'],
              ['treinta', 'thirty'],
              ['cuarenta', 'forty'],
            ],
            ['es-trece', 'es-quince', 'es-treinta', 'es-cuarenta'],
            { id: 'es.ex.cggkx7bnt1xele' },
          ),
          ex.listenChoice(
            'Tengo trece años.',
            ['Tengo tres años.', 'Tengo treinta años.', 'Tengo doce años.'],
            ['es-trece', 'es-treinta'],
            { id: 'es.ex.9bzt6j2khznvqz' },
          ),
          ex.translationChoice(
            'cincuenta',
            'fifty',
            ['fifteen', 'forty', 'a hundred'],
            ['es-cincuenta'],
            { id: 'es.ex.fybmo4wdbifh5m' },
          ),
          ex.listenChoice(
            'Hay quince sillas.',
            ['Hay cinco sillas.', 'Hay cincuenta sillas.', 'Hay once sillas.'],
            ['es-quince', 'es-cincuenta'],
            { id: 'es.ex.ayd399urr7chle' },
          ),
          ex.fillBlank(
            '¿___ hermanos tenés?',
            'How many brothers and sisters do you have?',
            'Cuántos',
            ['Cuántas', 'Cuánto', 'Cuál'],
            ['es-cuanto'],
            {
              id: 'es.ex.n213npucdjdpr1',
              explanation:
                'Hermanos is masculine plural, so cuántos. Cuántas is for feminine plural nouns (¿cuántas sillas?).',
            },
          ),
          ex.fillBlank(
            '¿___ agua querés?',
            'How much water do you want?',
            'Cuánta',
            ['Cuánto', 'Cuántas', 'Quién'],
            ['es-cuanto'],
            {
              id: 'es.ex.xtv3xy8yul8vbn',
              explanation:
                'Agua is feminine (el agua is an exception with el) and singular, so cuánta agua.',
            },
          ),
          ex.translationChoice('cien', 'a hundred', ['fifty', 'thirty', 'thirteen'], ['es-cien'], {
            id: 'es.ex.5zp8vxyuyz0jk1',
          }),
          ex.orderWords('Mi papá tiene cuarenta años.', 'My dad is forty.', ['es-cuarenta'], {
            id: 'es.ex.pmmunl3l3b4zwn',
          }),
          ex.translateWrite('I’m fifteen.', 'Tengo quince años.', ['es-quince'], {
            id: 'es.ex.4hw5l2ezpd4mkl',
            acceptedAnswers: ['Yo tengo quince años.'],
            explanation:
              'Age goes with tener: tengo quince años (literally, I have fifteen years).',
          }),
          ex.shortAnswer(
            '¿Cuántos años tiene tu papá?',
            'Answer: he is fifty (e.g. «Tiene cincuenta años.»).',
            'Tiene cincuenta años.',
            ['Cincuenta.', 'Tiene cincuenta.', 'Mi papá tiene cincuenta años.', 'Cincuenta años.'],
            ['es-cincuenta', 'es-cuanto'],
            { id: 'es.ex.gxeq3fgdn7gs72' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '¿Cuánto cuesta?',
        objective:
          'Ask for prices, say if something is expensive or cheap and say what you are looking for.',
        intro: {
          explanation:
            'To ask a price: ¿cuánto cuesta? (for several things, ¿cuánto cuestan?). Caro (expensive) and barato (cheap) agree with the thing: el libro es caro, la remera es barata. Busco means I’m looking for, with no extra word for “for”. In Argentina money is the peso (written with $), and prices are often in the thousands: mil is a thousand, treinta mil pesos.',
          examples: [
            {
              target: '¿Cuánto cuesta la remera? — Cuesta treinta mil pesos.',
              base: 'How much is the T-shirt? — It costs thirty thousand pesos.',
            },
            { target: 'Busco una mochila barata.', base: 'I’m looking for a cheap backpack.' },
          ],
        },
        takeaways: [
          'You ask ¿cuánto cuesta? and understand prices in pesos.',
          'You say busco… and es caro / es barato.',
        ],
        exercises: [
          ex.translationChoice(
            '¿cuánto cuesta?',
            'how much is it?',
            ['how many are there?', 'what is this?', 'how old are you?'],
            ['es-cuanto-cuesta'],
            { id: 'es.ex.9bi85hcbwkpkrf' },
          ),
          ex.translationChoice('barato', 'cheap', ['expensive', 'big', 'small'], ['es-barato'], {
            id: 'es.ex.h4y1gx50grjeha',
          }),
          ex.fillBlank(
            'La remera es muy ___.',
            'The T-shirt is very expensive.',
            'cara',
            ['caro', 'caros', 'barata'],
            ['es-caro'],
            {
              id: 'es.ex.qxppcsyhvzif76',
              explanation: 'Remera is feminine singular, so the adjective is cara.',
            },
          ),
          ex.listenChoice(
            'Cuesta trece mil pesos.',
            ['Cuesta treinta mil pesos.', 'Cuesta tres mil pesos.', 'Cuesta doce mil pesos.'],
            ['es-cuanto-cuesta', 'es-trece', 'es-el-peso'],
            { id: 'es.ex.1lw84djww86lvg' },
          ),
          ex.fillBlank(
            '___ una mochila azul.',
            'I’m looking for a blue backpack.',
            'Busco',
            ['Buscás', 'Busca'],
            ['es-busco'],
            {
              id: 'es.ex.jitgwldxy7q0eb',
              explanation:
                'With yo: busco. Buscás is for vos and busca for usted. There is no word for “for”.',
            },
          ),
          ex.matchPairs(
            [
              ['caro', 'expensive'],
              ['barato', 'cheap'],
              ['el negocio', 'the shop'],
              ['el peso', 'the peso'],
            ],
            ['es-caro', 'es-barato', 'es-el-negocio', 'es-el-peso'],
            { id: 'es.ex.ogrpggkln83h4c' },
          ),
          question(
            'es.ex.8pkc6zdiedndmi',
            REMERA,
            'What is Lucía looking for?',
            'A white T-shirt',
            ['A blue backpack', 'A white notebook', 'A cheap phone'],
            ['es-busco'],
            'Lucía says “Busco una remera blanca”.',
          ),
          question(
            'es.ex.ba4hx7vvpfnjfp',
            REMERA,
            'Why doesn’t Lucía take the white T-shirt?',
            'It’s too expensive',
            ['It’s too small', 'She doesn’t like the color', 'The shop has no white T-shirts'],
            ['es-caro', 'es-cuanto-cuesta'],
            'It costs forty thousand pesos and she says “¡Es muy cara!”',
          ),
          ex.translateWrite(
            'How much is the book?',
            '¿Cuánto cuesta el libro?',
            ['es-cuanto-cuesta'],
            { id: 'es.ex.3c59ewn0a2jkc9' },
          ),
          ex.shortAnswer(
            '¿Qué buscás?',
            'Say you’re looking for a cheap backpack (e.g. «Busco una mochila barata.»).',
            'Busco una mochila barata.',
            ['Una mochila barata.', 'Yo busco una mochila barata.'],
            ['es-busco', 'es-barato'],
            { id: 'es.ex.42ikm15bfrque0' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'En el negocio',
        objective: 'Understand prices in a conversation and on a shop sign.',
        intro: {
          explanation:
            'In Argentina people greet when they walk into a small shop: buen día or buenas tardes. Shop assistants often use usted with customers (¿qué busca?). On signs, prices are written with $, the peso sign, which looks like the dollar sign.',
          examples: [
            {
              target: 'Buenas tardes. ¿Cuánto cuesta el queso?',
              base: 'Good afternoon. How much is the cheese?',
            },
            { target: 'Hoy todo es muy barato.', base: 'Today everything is very cheap.' },
          ],
        },
        takeaways: [
          'You understand prices and question words in a short conversation.',
          'You read a shop sign with prices in pesos.',
        ],
        exercises: [
          question(
            'es.ex.j6hiygbleozpoo',
            REMERA,
            'How much is the blue T-shirt?',
            'Fifteen thousand pesos',
            ['Fifty thousand pesos', 'Forty thousand pesos', 'Five thousand pesos'],
            ['es-quince', 'es-el-peso'],
            'Juan says “La azul cuesta quince mil pesos”.',
          ),
          question(
            'es.ex.p180boy6zgtej8',
            CARTEL,
            'How much are the backpacks?',
            'Fifty thousand pesos',
            ['Fifteen thousand pesos', 'Five thousand pesos', 'A thousand pesos'],
            ['es-cincuenta', 'es-el-peso'],
            'The sign says “Mochilas: cincuenta mil pesos”.',
          ),
          question(
            'es.ex.sh288komn7e0hh',
            CARTEL,
            'What does the sign say about prices today?',
            'Everything is very cheap',
            ['Everything is very expensive', 'Only the notebooks are cheap', 'Nothing has a price'],
            ['es-barato'],
            'The first line says “¡Hoy, todo muy barato!”',
          ),
          question(
            'es.ex.4ah8eaq92yw6n3',
            CARTEL,
            'Until what time is the shop open?',
            'Until eight in the evening',
            ['Until five in the afternoon', 'Until midnight', 'All day and all night'],
            ['es-el-negocio'],
            'The sign says “Abierto hasta las ocho de la noche”.',
          ),
          ex.listenChoice(
            '¿Cuánto cuesta la mochila?',
            ['¿Cuánto cuesta la mesa?', '¿Cuántas mochilas hay?', '¿Cuál es tu mochila?'],
            ['es-cuanto-cuesta', 'es-cuanto'],
            { id: 'es.ex.2gtu10nxx88vn1' },
          ),
          ex.fillBlank(
            'Voy al ___ de Ana.',
            'I’m going to Ana’s shop.',
            'negocio',
            ['peso', 'caro', 'barato'],
            ['es-el-negocio'],
            {
              id: 'es.ex.nf2pxhxe4a757d',
              skill: 'vocabulary',
              explanation: 'El negocio is the everyday word for a shop in Argentina.',
            },
          ),
          ex.translationChoice(
            'el negocio',
            'the shop',
            ['the peso', 'the station', 'the bank'],
            ['es-el-negocio'],
            { id: 'es.ex.4dp4qrxm3h90z2' },
          ),
          ex.listenChoice(
            'Cuesta cien pesos.',
            ['Cuesta seis pesos.', 'Cuesta cinco pesos.', 'Cuesta diez pesos.'],
            ['es-cien', 'es-el-peso'],
            { id: 'es.ex.5vnv581hzaro3f' },
          ),
          ex.translateWrite(
            'The backpack is cheap, but the book is expensive.',
            'La mochila es barata, pero el libro es caro.',
            ['es-barato', 'es-caro'],
            {
              id: 'es.ex.rhznnleouyd6s9',
              acceptedAnswers: ['La mochila es barata pero el libro es caro.'],
            },
          ),
          ex.shortAnswer(
            '¿Por qué no te gusta el negocio?',
            'Answer: because it is very expensive (start with «Porque…»).',
            'Porque es muy caro.',
            ['Porque es caro.', 'No me gusta porque es muy caro.'],
            ['es-porque', 'es-caro'],
            { id: 'es.ex.o1z78t1b4onbjw' },
          ),
        ],
      },
    ],
  },
};

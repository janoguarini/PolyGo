import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U5 «Things and colors» (docs/ES_A1_A2.md): nombrar objetos de todos los días con el
 * género y el número (el / la, un / una, unos / unas, plural en -s y en -es), preguntar ¿qué es esto?,
 * describir con colores y tamaño (el adjetivo va después del sustantivo y concuerda) y señalar con
 * este / esta / estos / estas.
 * Pronunciación: la ll (silla, llave, amarillo) como la y inglesa de yes y la ch (mochila, chico) como
 * la ch de chair; la j de rojo, fuerte.
 * Variante: español neutro de Latinoamérica (tú, usted, ustedes). Léxico: el bolígrafo (se aceptan la
 * pluma y la lapicera), el celular (en España, el móvil), chico (pequeño también es muy común).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const AULA = dialogue(
  'es.stim.a1-u5-aula',
  'Two classmates talk just before a class starts.',
  [
    ['Tomás', '¡Hola, Ana! ¿Tienes un bolígrafo?'],
    ['Ana', 'Sí, tengo dos: uno azul y uno rojo.'],
    ['Tomás', 'El azul, por favor. ¡Gracias!'],
    ['Ana', 'De nada. ¿Y esto? ¿Es tu cuaderno?'],
    ['Tomás', 'No, mi cuaderno es verde.'],
  ],
  ES_A1_RATE,
);

const AVISO = reading(
  'es.stim.a1-u5-aviso',
  'notice',
  'A lost-and-found notice on the board of a language school.',
  [
    '¿Es tu mochila?',
    'Es una mochila negra y chica.',
    'Tiene un libro rojo, dos cuadernos y una llave amarilla.',
    'Lucía tiene la mochila.',
  ],
);

export const ES_A1_U05: EsUnitDef = {
  names: ['Tomás', 'Ana', 'Lucía'],
  support: [],
  unit: {
    position: 5,
    title: 'Things and colors',
    titleEn: 'Objetos y colores',
    description:
      'Name everyday things with el / la and un / una, make plurals, ask ¿qué es esto?, and describe things by color and size with este / esta.',
    emoji: '🎨',
    objective:
      'You can name everyday objects, ask what something is, say how many there are and describe them by color and size.',
    grammar: {
      title: 'Gender and number · adjectives after the noun · este / esta',
      explanation:
        'Every Spanish noun is masculine or feminine. Most nouns in -o are masculine (el libro, un cuaderno) and most nouns in -a are feminine (la mochila, una silla); learn each noun with its article. Plurals add -s after a vowel (sillas) and -es after a consonant (celulares, colores), and the articles change too: el → los, la → las, un → unos, una → unas. Adjectives usually come after the noun and agree with it: una mochila roja, unos libros negros. Colors in -o have four forms (rojo, roja, rojos, rojas); verde, azul and grande only change in the plural (verdes, azules, grandes). Este (this) agrees as well: este libro, esta mochila, estos libros, estas mochilas. Chico means small in much of Latin America; pequeño is also very common.',
      examples: [
        { target: '¿Qué es esto? — Es un bolígrafo.', base: 'What is this? — It’s a pen.' },
        {
          target: 'Tengo una mochila roja y dos libros negros.',
          base: 'I have a red backpack and two black books.',
        },
        { target: 'Estas sillas son grandes.', base: 'These chairs are big.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U5), convertido al español neutro con tú. Sin revisión nativa. Revisar: «chico» como «pequeño» (habitual en gran parte de Latinoamérica, y se mantiene porque lo usan unidades posteriores; «pequeño» se acepta; también es «chico = muchacho», que no se enseña aquí); el orden «un cuaderno verde chico» se evitó a propósito; «el bolígrafo» como palabra base (se aceptan «la pluma», de México, y «la lapicera», del Río de la Plata).',
    },
    words: [
      w(
        'es-que-es-esto',
        '¿qué es esto?',
        'what is this?',
        '¿Qué es esto? — Es un libro.',
        'What is this? — It’s a book.',
        ['questions'],
        { acceptedTranslations: ["what's this?"] },
      ),
      w(
        'es-este',
        'este',
        'this',
        'Este libro es grande.',
        'This book is big.',
        ['demonstratives'],
        { acceptedTexts: ['esta', 'estos', 'estas'] },
      ),
      w(
        'es-el-libro',
        'el libro',
        'the book',
        'Es un libro rojo.',
        'It’s a red book.',
        ['objects'],
        {
          emoji: '📕',
        },
      ),
      w(
        'es-el-cuaderno',
        'el cuaderno',
        'the notebook',
        'Mi cuaderno es azul.',
        'My notebook is blue.',
        ['objects'],
        { emoji: '📓' },
      ),
      w(
        'es-el-boligrafo',
        'el bolígrafo',
        'the pen',
        '¿Tienes un bolígrafo?',
        'Do you have a pen?',
        ['objects'],
        { acceptedTexts: ['la pluma', 'la lapicera'], emoji: '🖊️' },
      ),
      w(
        'es-la-mochila',
        'la mochila',
        'the backpack',
        'La mochila es negra.',
        'The backpack is black.',
        ['objects'],
        { acceptedTranslations: ['the bag'], emoji: '🎒' },
      ),
      w('es-la-mesa', 'la mesa', 'the table', 'La mesa es grande.', 'The table is big.', [
        'objects',
      ]),
      w(
        'es-la-silla',
        'la silla',
        'the chair',
        'Tengo dos sillas blancas.',
        'I have two white chairs.',
        ['objects'],
        { emoji: '🪑' },
      ),
      w(
        'es-el-celular',
        'el celular',
        'the cell phone',
        'Mi celular es negro.',
        'My phone is black.',
        ['objects'],
        { acceptedTranslations: ['the mobile phone', 'the phone'], emoji: '📱' },
      ),
      w(
        'es-la-llave',
        'la llave',
        'the key',
        '¿Es tu llave? — Sí, gracias.',
        'Is it your key? — Yes, thanks.',
        ['objects'],
        { emoji: '🔑' },
      ),
      w(
        'es-el-color',
        'el color',
        'the color',
        '¿De qué color es?',
        'What color is it?',
        ['colors'],
        { acceptedTranslations: ['the colour'], emoji: '🎨' },
      ),
      w('es-rojo', 'rojo', 'red', 'Una mochila roja.', 'A red backpack.', ['colors'], {
        acceptedTexts: ['roja', 'rojos', 'rojas'],
        emoji: '🔴',
      }),
      w(
        'es-azul',
        'azul',
        'blue',
        'Tengo un cuaderno azul.',
        'I have a blue notebook.',
        ['colors'],
        {
          acceptedTexts: ['azules'],
          emoji: '🔵',
        },
      ),
      w('es-verde', 'verde', 'green', 'La silla es verde.', 'The chair is green.', ['colors'], {
        acceptedTexts: ['verdes'],
        emoji: '🟢',
      }),
      w('es-negro', 'negro', 'black', 'Un gato negro.', 'A black cat.', ['colors'], {
        acceptedTexts: ['negra', 'negros', 'negras'],
        emoji: '⚫',
      }),
      w('es-blanco', 'blanco', 'white', 'El perro es blanco.', 'The dog is white.', ['colors'], {
        acceptedTexts: ['blanca', 'blancos', 'blancas'],
        emoji: '⚪',
      }),
      w(
        'es-amarillo',
        'amarillo',
        'yellow',
        'Un bolígrafo amarillo.',
        'A yellow pen.',
        ['colors'],
        { acceptedTexts: ['amarilla', 'amarillos', 'amarillas'], emoji: '🟡' },
      ),
      w('es-chico', 'chico', 'small', 'Mi perro es chico.', 'My dog is small.', ['adjectives'], {
        acceptedTranslations: ['little'],
        acceptedTexts: ['chica', 'chicos', 'chicas', 'pequeño', 'pequeña'],
      }),
      w(
        'es-grande',
        'grande',
        'big',
        'Mi familia es grande.',
        'My family is big.',
        ['adjectives'],
        {
          acceptedTranslations: ['large'],
          acceptedTexts: ['grandes'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Qué es esto?',
        objective: 'Name school things with un / una and ask what something is.',
        intro: {
          explanation:
            'Every Spanish noun is masculine or feminine. Nouns in -o are usually masculine and take el (the) or un (a): el libro, un cuaderno. Nouns in -a are usually feminine and take la or una: la mochila, una silla. To ask about a thing, say ¿qué es esto? and answer es un… or es una… A pen is un bolígrafo (in Mexico you will also hear una pluma). The ch in mochila sounds like the ch in English chair.',
          examples: [
            { target: '¿Qué es esto? — Es un libro.', base: 'What is this? — It’s a book.' },
            { target: 'Es una mochila.', base: 'It’s a backpack.' },
          ],
        },
        takeaways: [
          'You ask ¿qué es esto? and answer es un… or es una…',
          'You learn each noun with its article: el libro, la mochila.',
        ],
        exercises: [
          ex.translationChoice(
            'el libro',
            'the book',
            ['the notebook', 'the pen', 'the backpack'],
            ['es-el-libro'],
            { id: 'es.ex.ped7vj1cp3ngru' },
          ),
          ex.translationChoice(
            'el bolígrafo',
            'the pen',
            ['the book', 'the backpack', 'the notebook'],
            ['es-el-boligrafo'],
            { id: 'es.ex.z1gljgh7ub2skz' },
          ),
          ex.matchPairs(
            [
              ['el libro', 'the book'],
              ['el cuaderno', 'the notebook'],
              ['el bolígrafo', 'the pen'],
              ['la mochila', 'the backpack'],
            ],
            ['es-el-libro', 'es-el-cuaderno', 'es-el-boligrafo', 'es-la-mochila'],
            { id: 'es.ex.9ml4crlk6qgxsl' },
          ),
          ex.listenChoice(
            'Es un cuaderno.',
            ['Es un libro.', 'Es una mochila.', 'Es un bolígrafo.'],
            ['es-el-cuaderno'],
            { id: 'es.ex.i4am8db8mzsnt2' },
          ),
          ex.fillBlank(
            'Es ___ mochila.',
            'It’s a backpack.',
            'una',
            ['un', 'el', 'los'],
            ['es-la-mochila'],
            {
              id: 'es.ex.hiagir4kbr7djy',
              skill: 'grammar',
              explanation:
                'Mochila ends in -a and is feminine, so “a backpack” is una mochila. Un goes with masculine nouns: un libro.',
            },
          ),
          ex.fillBlank(
            '¿___ es esto?',
            'What is this?',
            'Qué',
            ['Cómo', 'Dónde', 'Cuántos'],
            ['es-que-es-esto'],
            {
              id: 'es.ex.mm4bx518z0345k',
              skill: 'vocabulary',
              explanation:
                'Qué is what. Cómo is how, dónde is where and cuántos is how many. Question words carry an accent.',
            },
          ),
          ex.listenChoice(
            '¿Qué es esto?',
            ['¿Cómo estás?', '¿De dónde eres?', '¿Cómo te llamas?'],
            ['es-que-es-esto'],
            { id: 'es.ex.03u2k9y8lofxwi' },
          ),
          ex.orderWords('Esto es un libro.', 'This is a book.', ['es-el-libro', 'es-que-es-esto'], {
            id: 'es.ex.ckj6ifwtam39l1',
          }),
          ex.translateWrite(
            'What is this? — It’s a pen.',
            '¿Qué es esto? — Es un bolígrafo.',
            ['es-que-es-esto', 'es-el-boligrafo'],
            {
              id: 'es.ex.thrvg7oxkhf3e5',
              acceptedAnswers: [
                '¿Qué es esto? Es un bolígrafo.',
                '¿Qué es esto? — Un bolígrafo.',
                '¿Qué es esto? Un bolígrafo.',
                '¿Qué es esto? Es una pluma.',
                '¿Qué es esto? Es una lapicera.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué es esto?',
            'Someone points at a backpack. Answer (e.g. «Es una…»).',
            'Es una mochila.',
            ['Es una mochila', 'Una mochila.', 'Una mochila', 'Esto es una mochila.'],
            ['es-la-mochila', 'es-que-es-esto'],
            { id: 'es.ex.re728y7ajewzl1' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Unos libros, unas sillas',
        objective: 'Make plurals and say how many things there are.',
        intro: {
          explanation:
            'To make a plural, add -s after a vowel (la silla → las sillas) and -es after a consonant (el celular → los celulares). The articles change too: el → los, la → las, un → unos, una → unas. For one thing you say es; for more than one, son: es una llave, son dos llaves. The ll in silla and llave sounds like the y in yes: SI-ya, YA-ve.',
          examples: [
            {
              target: 'Es una silla. — Son dos sillas.',
              base: 'It’s a chair. — They’re two chairs.',
            },
            { target: 'Son unas llaves.', base: 'They are some keys.' },
          ],
        },
        takeaways: [
          'You add -s or -es to make a plural, and the article changes too.',
          'You use es for one thing and son for more than one.',
        ],
        exercises: [
          ex.translationChoice(
            'la mesa',
            'the table',
            ['the chair', 'the key', 'the cell phone'],
            ['es-la-mesa'],
            { id: 'es.ex.wbduo42o7keyt0' },
          ),
          ex.translationChoice(
            'la llave',
            'the key',
            ['the table', 'the pen', 'the chair'],
            ['es-la-llave'],
            { id: 'es.ex.7oo3hso4di56pg' },
          ),
          ex.matchPairs(
            [
              ['la mesa', 'the table'],
              ['la silla', 'the chair'],
              ['el celular', 'the cell phone'],
              ['la llave', 'the key'],
            ],
            ['es-la-mesa', 'es-la-silla', 'es-el-celular', 'es-la-llave'],
            { id: 'es.ex.tpwc822zsc1iu3' },
          ),
          ex.listenChoice(
            'Son unas sillas.',
            ['Es una silla.', 'Son unas llaves.', 'Son unas mesas.'],
            ['es-la-silla'],
            { id: 'es.ex.7rldd909zuqw8s' },
          ),
          ex.fillBlank(
            'Son dos ___.',
            'They are two chairs.',
            'sillas',
            ['silla', 'mesa', 'llave'],
            ['es-la-silla'],
            {
              id: 'es.ex.45fw5wey2rzxu7',
              skill: 'grammar',
              explanation: 'After dos the noun is plural: silla → sillas.',
            },
          ),
          ex.fillBlank(
            'Tengo dos ___.',
            'I have two cell phones.',
            'celulares',
            ['celular', 'celulars'],
            ['es-el-celular'],
            {
              id: 'es.ex.olxmdi62xrkter',
              skill: 'grammar',
              explanation:
                'Celular ends in a consonant, so the plural adds -es: celulares. Only nouns ending in a vowel just add -s.',
            },
          ),
          ex.fillBlank(
            'Son ___ llaves.',
            'They are some keys.',
            'unas',
            ['unos', 'una', 'un'],
            ['es-la-llave'],
            {
              id: 'es.ex.ltmfkyuywpegpr',
              skill: 'grammar',
              explanation:
                'Llave is feminine (la llave), so in the plural it takes unas. Unos is for masculine nouns: unos libros.',
            },
          ),
          ex.listenChoice(
            'Es una silla.',
            ['Es una mesa.', 'Es una llave.', 'Son unas sillas.'],
            ['es-la-silla', 'es-la-mesa'],
            { id: 'es.ex.haac64wkah7rdm' },
          ),
          ex.translateWrite('I have two keys.', 'Tengo dos llaves.', ['es-la-llave'], {
            id: 'es.ex.11s2pq3mvq3c6i',
            acceptedAnswers: ['Yo tengo dos llaves.'],
          }),
          ex.translateWrite(
            'They are some chairs and a table.',
            'Son unas sillas y una mesa.',
            ['es-la-silla', 'es-la-mesa'],
            { id: 'es.ex.b4m5ui36xm6128', acceptedAnswers: ['Son sillas y una mesa.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Los colores',
        objective: 'Say what color things are.',
        intro: {
          explanation:
            'In Spanish the color comes after the noun: un libro rojo (a red book). Colors ending in -o agree with the noun: rojo, roja, rojos, rojas. Colors ending in -e or in a consonant only change in the plural: verde → verdes, azul → azules. To ask about color: ¿de qué color es? The j in rojo is a strong h sound, from the back of the throat.',
          examples: [
            {
              target: '¿De qué color es la mochila? — Es roja.',
              base: 'What color is the backpack? — It’s red.',
            },
            {
              target: 'Un libro azul y un bolígrafo verde.',
              base: 'A blue book and a green pen.',
            },
          ],
        },
        takeaways: [
          'You put the color after the noun: una mochila roja.',
          'You make colors in -o agree: rojo, roja, rojos, rojas.',
        ],
        exercises: [
          ex.translationChoice('rojo', 'red', ['green', 'yellow', 'black'], ['es-rojo'], {
            id: 'es.ex.89hylqc3v4kpzc',
          }),
          ex.matchPairs(
            [
              ['azul', 'blue'],
              ['verde', 'green'],
              ['negro', 'black'],
              ['blanco', 'white'],
            ],
            ['es-azul', 'es-verde', 'es-negro', 'es-blanco'],
            { id: 'es.ex.ej1yrs6q8o182b' },
          ),
          ex.translationChoice('amarillo', 'yellow', ['white', 'red', 'blue'], ['es-amarillo'], {
            id: 'es.ex.mg110300bgy0t6',
          }),
          ex.fillBlank(
            'Una mochila ___.',
            'A red backpack.',
            'roja',
            ['rojo', 'rojos', 'rojas'],
            ['es-rojo', 'es-la-mochila'],
            {
              id: 'es.ex.x4owybg498mfgn',
              skill: 'grammar',
              explanation:
                'Mochila is feminine and singular, so the color is too: una mochila roja.',
            },
          ),
          ex.listenChoice(
            'Un libro negro.',
            ['Un libro blanco.', 'Una mesa negra.', 'Un libro verde.'],
            ['es-negro', 'es-el-libro'],
            { id: 'es.ex.tg30m3ki294pfw' },
          ),
          ex.translationChoice(
            'el color',
            'the color',
            ['the table', 'the key', 'the book'],
            ['es-el-color'],
            { id: 'es.ex.m59tq1jpnsfyva' },
          ),
          question(
            'es.ex.tpyneye083v778',
            AULA,
            'Which pen does Tomás take?',
            'The blue one',
            ['The red one', 'The green one', 'Both pens'],
            ['es-azul', 'es-el-boligrafo'],
            'Ana has “uno azul y uno rojo”, and Tomás says “El azul, por favor”.',
          ),
          question(
            'es.ex.bkcyolqdllsxae',
            AULA,
            'What color is Tomás’s notebook?',
            'Green',
            ['Blue', 'Red', 'Yellow'],
            ['es-verde', 'es-el-cuaderno'],
            'Tomás says “No, mi cuaderno es verde”.',
          ),
          ex.shortAnswer(
            '¿De qué color es la mochila?',
            'The backpack is black. Answer (e.g. «Es…»).',
            'Es negra.',
            ['Es negra', 'Negra.', 'Negra', 'La mochila es negra.'],
            ['es-negro', 'es-el-color'],
            { id: 'es.ex.kc9n5jtvqxywei' },
          ),
          ex.translateWrite(
            'A white table and two red chairs.',
            'Una mesa blanca y dos sillas rojas.',
            ['es-blanco', 'es-rojo', 'es-la-mesa', 'es-la-silla'],
            { id: 'es.ex.z7ul78ksyj6p3f' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Este libro es grande',
        objective: 'Point at things with este / esta and say if they are big or small.',
        intro: {
          explanation:
            'Este (this) agrees with the noun: este libro, esta mochila, estos libros, estas mochilas. In much of Latin America chico means small (you will also hear pequeño). Grande does not change for feminine: un libro grande, una mesa grande. The ch in chico sounds like the ch in chair, and the ll in silla, llave and amarillo sounds like the y in yes.',
          examples: [
            { target: 'Este libro es grande.', base: 'This book is big.' },
            { target: 'Esta mochila es chica.', base: 'This backpack is small.' },
          ],
        },
        takeaways: [
          'You use este, esta, estos or estas depending on the noun.',
          'You say chico for small and grande for big.',
        ],
        exercises: [
          ex.translationChoice('grande', 'big', ['small', 'yellow', 'white'], ['es-grande'], {
            id: 'es.ex.zf4rzy8dv3jbcv',
          }),
          ex.translationChoice('chico', 'small', ['big', 'black', 'green'], ['es-chico'], {
            id: 'es.ex.lpzcf5rtwe7f89',
          }),
          ex.fillBlank(
            '___ mochila es chica.',
            'This backpack is small.',
            'Esta',
            ['Este', 'Estos', 'Estas'],
            ['es-este', 'es-chico'],
            {
              id: 'es.ex.7ol9tqu5ivwtjx',
              skill: 'grammar',
              explanation:
                'Mochila is feminine and singular: esta mochila. Este goes with masculine nouns.',
            },
          ),
          ex.fillBlank(
            '___ libros son grandes.',
            'These books are big.',
            'Estos',
            ['Este', 'Esta', 'Estas'],
            ['es-este', 'es-grande'],
            {
              id: 'es.ex.2h08yazsq5s2uk',
              skill: 'grammar',
              explanation:
                'Libros is masculine and plural: estos libros. Estas is for feminine plurals.',
            },
          ),
          ex.listenChoice(
            'Este celular es chico.',
            ['Este celular es grande.', 'Esta silla es chica.', 'Estos celulares son chicos.'],
            ['es-este', 'es-chico', 'es-el-celular'],
            { id: 'es.ex.hfjen87olgihk3' },
          ),
          ex.listenChoice(
            'La mochila amarilla.',
            ['La silla amarilla.', 'La mochila roja.', 'La llave amarilla.'],
            ['es-amarillo', 'es-la-mochila'],
            { id: 'es.ex.muufafx6cl5j1r' },
          ),
          ex.matchPairs(
            [
              ['este', 'this'],
              ['grande', 'big'],
              ['chico', 'small'],
              ['amarillo', 'yellow'],
            ],
            ['es-este', 'es-grande', 'es-chico', 'es-amarillo'],
            { id: 'es.ex.tnihnaf1c12hbf' },
          ),
          ex.orderWords('Esta mesa es grande.', 'This table is big.', ['es-este', 'es-grande'], {
            id: 'es.ex.2106echveke0bs',
          }),
          ex.translateWrite(
            'This key is small.',
            'Esta llave es chica.',
            ['es-este', 'es-chico', 'es-la-llave'],
            { id: 'es.ex.asmwzcu2ppthpj' },
          ),
          ex.translateWrite(
            'These chairs are big.',
            'Estas sillas son grandes.',
            ['es-este', 'es-grande', 'es-la-silla'],
            { id: 'es.ex.5jqj539wx412mg' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mi mochila es negra',
        objective: 'Describe your things and understand a short notice about a lost object.',
        intro: {
          explanation:
            'Now you can describe your things: what they are, how many there are, their color and their size. Put it all together with tengo or with es / son: tengo una mochila negra; mi celular es chico y blanco. Remember: the article agrees with the noun, and the adjective comes after it.',
          examples: [
            { target: 'Tengo una mochila negra.', base: 'I have a black backpack.' },
            { target: 'Mi celular es chico y blanco.', base: 'My phone is small and white.' },
          ],
        },
        takeaways: [
          'You describe a thing by its color and size.',
          'You understand a short notice about a lost backpack.',
        ],
        exercises: [
          question(
            'es.ex.jrnhcn6tma6a20',
            AVISO,
            'What is the backpack like?',
            'Black and small',
            ['Black and big', 'Red and small', 'Yellow and big'],
            ['es-negro', 'es-chico', 'es-la-mochila'],
            'The notice says “Es una mochila negra y chica”.',
          ),
          question(
            'es.ex.gveni1wu4jti4t',
            AVISO,
            'What is in the backpack?',
            'A book, two notebooks and a key',
            ['Two books and a pen', 'A phone and a key', 'A notebook and two pens'],
            ['es-el-libro', 'es-el-cuaderno', 'es-la-llave'],
            'It says “Tiene un libro rojo, dos cuadernos y una llave amarilla”.',
          ),
          question(
            'es.ex.o71tydiuw3xz3q',
            AVISO,
            'What color is the key?',
            'Yellow',
            ['Red', 'Black', 'White'],
            ['es-amarillo', 'es-la-llave'],
            'The notice mentions “una llave amarilla”.',
          ),
          question(
            'es.ex.kwocvd2yq3g1yr',
            AVISO,
            'Who has the backpack now?',
            'Lucía',
            ['The owner', 'Tomás', 'Nobody knows'],
            ['es-la-mochila'],
            'The last line says “Lucía tiene la mochila”.',
          ),
          question(
            'es.ex.vq9rfp6yuk4lru',
            AULA,
            'What does Tomás ask Ana for?',
            'A pen',
            ['A notebook', 'A book', 'A key'],
            ['es-el-boligrafo'],
            'Tomás asks “¿Tienes un bolígrafo?”.',
          ),
          ex.listenChoice(
            'Tengo una mochila negra.',
            ['Tengo una mochila blanca.', 'Tengo dos mochilas negras.', 'Tengo una silla negra.'],
            ['es-la-mochila', 'es-negro'],
            { id: 'es.ex.i9bmfyoav91kd7' },
          ),
          ex.fillBlank(
            'Mi celular es ___ y blanco.',
            'My phone is small and white.',
            'chico',
            ['chica', 'chicos', 'chicas'],
            ['es-chico', 'es-el-celular'],
            {
              id: 'es.ex.n68lraii448nj8',
              skill: 'grammar',
              explanation: 'Celular is masculine and singular, so you say chico (and blanco).',
            },
          ),
          ex.orderWords('Tengo un libro rojo.', 'I have a red book.', ['es-el-libro', 'es-rojo'], {
            id: 'es.ex.ngsg09w5k31kz5',
          }),
          ex.shortAnswer(
            '¿De qué color es tu celular?',
            'Say your phone is black (start with «Mi celular es…»).',
            'Mi celular es negro.',
            ['Mi celular es negro', 'Es negro.', 'Es negro', 'Negro.', 'Negro'],
            ['es-el-celular', 'es-negro', 'es-el-color'],
            { id: 'es.ex.kyzg3l4rhy5bk0' },
          ),
          ex.translateWrite(
            'My backpack is big and red.',
            'Mi mochila es grande y roja.',
            ['es-la-mochila', 'es-grande', 'es-rojo'],
            { id: 'es.ex.ygd69gsr18lllc', acceptedAnswers: ['Mi mochila es roja y grande.'] },
          ),
        ],
      },
    ],
  },
};

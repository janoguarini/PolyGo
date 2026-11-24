import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U6 «At home» (docs/ES_A1_A2.md): describir la casa o el apartamento con hay / no hay
 * (invariable y sin artículo definido), preguntar y decir dónde está algo con estar (ser frente a
 * estar, primera parte) y ubicar cosas con en, arriba de, debajo de, al lado de, enfrente de y detrás
 * de (en el habla también «atrás de», que se acepta). Contracción de + el = del.
 * Pronunciación: la ñ (baño) como la ny de canyon; la h muda de hay.
 * Variante: español neutro de Latinoamérica (tú, usted, ustedes). Léxico: el apartamento (se aceptan
 * el departamento y el piso), la sala (se acepta el living), el dormitorio.
 * Cultura: en las grandes ciudades latinoamericanas mucha gente vive en apartamentos.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LLAVES = dialogue(
  'es.stim.a1-u6-llaves',
  'Martín can’t find his keys at home and asks his sister Sofía.',
  [
    ['Martín', 'Sofía, ¿dónde están mis llaves?'],
    ['Sofía', '¿No están en la mesa de la sala?'],
    ['Martín', 'No, en la mesa no hay nada.'],
    ['Sofía', '¿Y en el dormitorio? ¿Debajo de la cama?'],
    ['Martín', '¡Sí! Están debajo de la cama. ¡Gracias!'],
  ],
  ES_A1_RATE,
);

const AVISO = reading(
  'es.stim.a1-u6-aviso',
  'ad',
  'An online ad for an apartment for rent in Miraflores, Lima.',
  [
    'Apartamento en Miraflores',
    'Hay dos dormitorios, un baño, una cocina chica y una sala grande.',
    'La sala tiene tres ventanas.',
    'No hay camas ni mesas.',
  ],
);

export const ES_A1_U06: EsUnitDef = {
  names: ['Martín', 'Sofía', 'Miraflores'],
  support: ['del', 'están', 'ni'],
  unit: {
    position: 6,
    title: 'At home',
    titleEn: 'La casa',
    description:
      'Describe a house or an apartment with hay / no hay, ask where things are with ¿dónde está?, and place them with en, arriba de, debajo de, al lado de, enfrente de and detrás de.',
    emoji: '🏠',
    objective:
      'You can describe the rooms of a home, say what there is and isn’t, and ask and say where things are.',
    grammar: {
      title: 'Hay · estar for location · prepositions of place',
      explanation:
        'Hay means both there is and there are, and it never changes: hay una cama, hay dos ventanas; the negative is no hay. After hay you use un / una, a number or no article, never el or la: hay una cocina (not hay la cocina). To say where a specific thing is, use estar: ¿dónde está la llave? — está en la mesa; for plurals, están. This is the first difference between Spanish’s two verbs for “to be”: ser says what something is or is like (la cocina es grande), estar says where it is (la cocina está al lado de la sala). Places: en (in, on, at), arriba de (on top of), debajo de (under), al lado de (next to), enfrente de (opposite) and detrás de (behind; in everyday speech you will also hear atrás de). De + el becomes del: al lado del baño.',
      examples: [
        {
          target: 'En el apartamento hay dos dormitorios.',
          base: 'There are two bedrooms in the apartment.',
        },
        {
          target: '¿Dónde está el baño? — Está al lado de la cocina.',
          base: 'Where is the bathroom? — It’s next to the kitchen.',
        },
        { target: 'El gato está debajo de la cama.', base: 'The cat is under the bed.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U6), convertido al español neutro con tú. Sin revisión nativa. Revisar: «arriba de» para «on top of» (habitual en Latinoamérica; «encima de» se acepta); «atrás de» y «abajo de» aceptados como variantes coloquiales; «la sala» y «el apartamento» como palabras base (se aceptan «el living», «el departamento» y «el piso»); «el dormitorio» frente a «el cuarto», «la habitación» o «la recámara» (México); «no hay camas ni mesas» (doble negación con ni).',
    },
    words: [
      w('es-la-casa', 'la casa', 'the house', 'Mi casa es grande.', 'My house is big.', ['house'], {
        acceptedTranslations: ['home'],
        emoji: '🏠',
      }),
      w(
        'es-el-apartamento',
        'el apartamento',
        'the apartment',
        'Vivo en un apartamento chico.',
        'I live in a small apartment.',
        ['house'],
        {
          acceptedTranslations: ['the flat'],
          acceptedTexts: ['el departamento', 'el piso'],
          emoji: '🏢',
        },
      ),
      w(
        'es-el-dormitorio',
        'el dormitorio',
        'the bedroom',
        'En el dormitorio hay una cama.',
        'There is a bed in the bedroom.',
        ['house'],
      ),
      w(
        'es-la-cocina',
        'la cocina',
        'the kitchen',
        'La cocina está al lado de la sala.',
        'The kitchen is next to the living room.',
        ['house'],
      ),
      w(
        'es-el-bano',
        'el baño',
        'the bathroom',
        '¿Dónde está el baño?',
        'Where is the bathroom?',
        ['house'],
        { acceptedTranslations: ['the toilet'], emoji: '🚿' },
      ),
      w(
        'es-la-sala',
        'la sala',
        'the living room',
        'La sala tiene dos ventanas.',
        'The living room has two windows.',
        ['house'],
        { acceptedTranslations: ['the lounge'], acceptedTexts: ['el living'], emoji: '🛋️' },
      ),
      w(
        'es-la-cama',
        'la cama',
        'the bed',
        'El gato está en la cama.',
        'The cat is on the bed.',
        ['house'],
        {
          emoji: '🛏️',
        },
      ),
      w(
        'es-la-ventana',
        'la ventana',
        'the window',
        'Hay tres ventanas.',
        'There are three windows.',
        ['house'],
        { emoji: '🪟' },
      ),
      w(
        'es-la-puerta',
        'la puerta',
        'the door',
        'La puerta es verde.',
        'The door is green.',
        ['house'],
        {
          emoji: '🚪',
        },
      ),
      w(
        'es-hay',
        'hay',
        'there is',
        'Hay una mesa en la cocina.',
        'There is a table in the kitchen.',
        ['existence'],
        { acceptedTranslations: ['there are'] },
      ),
      w(
        'es-no-hay',
        'no hay',
        "there isn't",
        'No hay sillas.',
        'There are no chairs.',
        ['existence'],
        {
          acceptedTranslations: ["there aren't", 'there is no'],
        },
      ),
      w(
        'es-esta',
        'está',
        'it is (located)',
        'Mi celular está en la mesa.',
        'My phone is on the table.',
        ['verbs', 'location'],
        { acceptedTranslations: ["it's (located)"] },
      ),
      w(
        'es-donde-esta',
        '¿dónde está?',
        'where is it?',
        '¿Dónde está mi llave?',
        'Where is my key?',
        ['questions', 'location'],
        { acceptedTranslations: ['where is?'] },
      ),
      w(
        'es-en',
        'en',
        'in',
        'El libro está en la mochila.',
        'The book is in the backpack.',
        ['prepositions'],
        { acceptedTranslations: ['at'] },
      ),
      w(
        'es-arriba-de',
        'arriba de',
        'on top of',
        'El bolígrafo está arriba de la mesa.',
        'The pen is on top of the table.',
        ['prepositions'],
        { acceptedTranslations: ['on', 'above'], acceptedTexts: ['encima de'] },
      ),
      w(
        'es-debajo-de',
        'debajo de',
        'under',
        'El perro está debajo de la cama.',
        'The dog is under the bed.',
        ['prepositions'],
        { acceptedTranslations: ['underneath', 'below'], acceptedTexts: ['abajo de'] },
      ),
      w(
        'es-al-lado-de',
        'al lado de',
        'next to',
        'El baño está al lado del dormitorio.',
        'The bathroom is next to the bedroom.',
        ['prepositions'],
        { acceptedTranslations: ['beside'] },
      ),
      w(
        'es-enfrente-de',
        'enfrente de',
        'opposite',
        'La cocina está enfrente del baño.',
        'The kitchen is opposite the bathroom.',
        ['prepositions'],
        { acceptedTranslations: ['across from', 'in front of'] },
      ),
      w(
        'es-detras-de',
        'detrás de',
        'behind',
        'La mochila está detrás de la puerta.',
        'The backpack is behind the door.',
        ['prepositions'],
        { acceptedTexts: ['atrás de'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'La casa',
        objective: 'Name the rooms of a house or an apartment.',
        intro: {
          explanation:
            'In big Latin American cities many people live in un apartamento (an apartment; in Argentina and Mexico you will also hear departamento, and in Spain piso). The rooms: la sala (the living room), la cocina (the kitchen), el dormitorio (the bedroom) and el baño (the bathroom). The ñ in baño sounds like the ny in canyon, so baño and año are different words.',
          examples: [
            { target: 'Mi apartamento es chico.', base: 'My apartment is small.' },
            { target: 'La cocina es grande.', base: 'The kitchen is big.' },
          ],
        },
        takeaways: [
          'You name the rooms: la sala, la cocina, el dormitorio, el baño.',
          'You say apartamento for an apartment.',
        ],
        exercises: [
          ex.translationChoice(
            'la casa',
            'the house',
            ['the apartment', 'the kitchen', 'the bedroom'],
            ['es-la-casa'],
            { id: 'es.ex.rcbingzumlayck' },
          ),
          ex.translationChoice(
            'el apartamento',
            'the apartment',
            ['the house', 'the bathroom', 'the living room'],
            ['es-el-apartamento'],
            { id: 'es.ex.jhl24s213dcyhd' },
          ),
          ex.matchPairs(
            [
              ['el dormitorio', 'the bedroom'],
              ['la cocina', 'the kitchen'],
              ['el baño', 'the bathroom'],
              ['la sala', 'the living room'],
            ],
            ['es-el-dormitorio', 'es-la-cocina', 'es-el-bano', 'es-la-sala'],
            { id: 'es.ex.8p8e4prbaziruf' },
          ),
          ex.listenChoice(
            'Es el baño.',
            ['Es el año.', 'Es la cocina.', 'Es la sala.'],
            ['es-el-bano'],
            { id: 'es.ex.5yklejjbrd2jxl' },
          ),
          ex.fillBlank(
            '___ cocina es grande.',
            'The kitchen is big.',
            'La',
            ['El', 'Los', 'Un'],
            ['es-la-cocina'],
            {
              id: 'es.ex.oh88nj4x84v8xl',
              skill: 'grammar',
              explanation: 'Cocina ends in -a and is feminine: la cocina.',
            },
          ),
          ex.fillBlank(
            'Mi casa es ___.',
            'My house is small.',
            'chica',
            ['chico', 'chicos', 'grandes'],
            ['es-la-casa'],
            {
              id: 'es.ex.s5efhcg0clhtl6',
              skill: 'grammar',
              explanation: 'Casa is feminine and singular, so the adjective is chica.',
            },
          ),
          ex.listenChoice(
            'Tengo un apartamento chico.',
            ['Tengo una casa chica.', 'Tengo un apartamento grande.', 'Tengo un dormitorio chico.'],
            ['es-el-apartamento'],
            { id: 'es.ex.zmz5vrys9mt3eh' },
          ),
          ex.orderWords('La sala es grande.', 'The living room is big.', ['es-la-sala'], {
            id: 'es.ex.9riz6zhjw0bkvw',
          }),
          ex.translateWrite('The bathroom is small.', 'El baño es chico.', ['es-el-bano'], {
            id: 'es.ex.atwvg42hpz3xhl',
          }),
          ex.translateWrite(
            'My apartment is big.',
            'Mi apartamento es grande.',
            ['es-el-apartamento'],
            { id: 'es.ex.0pc1r6wx6ourno' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Hay…',
        objective: 'Say what there is and what there isn’t in a room.',
        intro: {
          explanation:
            'Hay means there is and there are, and it never changes: hay una cama, hay dos ventanas. The h is silent, so hay sounds like the English word eye. The negative is no hay. After hay you use un / una, a number or no article, never el or la: hay una cocina (not hay la cocina). With no hay you usually drop the article: no hay puerta.',
          examples: [
            { target: 'En el dormitorio hay una cama.', base: 'There is a bed in the bedroom.' },
            {
              target: 'No hay ventanas en el baño.',
              base: 'There are no windows in the bathroom.',
            },
          ],
        },
        takeaways: ['You use hay for there is and there are.', 'You never put el or la after hay.'],
        exercises: [
          ex.translationChoice(
            'hay',
            'there is',
            ["there isn't", 'it is (located)', 'what is this?'],
            ['es-hay'],
            { id: 'es.ex.no1x7qe9xutrzu' },
          ),
          ex.translationChoice(
            'la ventana',
            'the window',
            ['the door', 'the bed', 'the kitchen'],
            ['es-la-ventana'],
            { id: 'es.ex.xf1kgt1y4zvfei' },
          ),
          ex.matchPairs(
            [
              ['la cama', 'the bed'],
              ['la ventana', 'the window'],
              ['la puerta', 'the door'],
              ['no hay', "there isn't"],
            ],
            ['es-la-cama', 'es-la-ventana', 'es-la-puerta', 'es-no-hay'],
            { id: 'es.ex.qtq45bfobzdz78' },
          ),
          ex.fillBlank(
            'En la cocina ___ una mesa.',
            'There is a table in the kitchen.',
            'hay',
            ['es', 'son', 'tengo'],
            ['es-hay'],
            {
              id: 'es.ex.sr96t9rozc2lbs',
              skill: 'grammar',
              explanation: 'To say that something exists in a place, use hay: hay una mesa.',
            },
          ),
          ex.listenChoice(
            'Hay dos camas.',
            ['Hay dos casas.', 'Hay dos ventanas.', 'No hay camas.'],
            ['es-hay', 'es-la-cama'],
            { id: 'es.ex.rhhdj90djt3ps1' },
          ),
          ex.fillBlank(
            'Hay ___ ventanas.',
            'There are three windows.',
            'tres',
            ['las', 'la', 'los'],
            ['es-hay', 'es-la-ventana'],
            {
              id: 'es.ex.hr846eo4ggm8wn',
              skill: 'grammar',
              explanation:
                'After hay you never use el, la, los or las. Use a number, un / una or nothing.',
            },
          ),
          ex.fillBlank(
            'En el baño ___ ventana.',
            'There is no window in the bathroom.',
            'no hay',
            ['hay', 'es', 'son'],
            ['es-no-hay', 'es-la-ventana'],
            {
              id: 'es.ex.lkmjwo4ax084r1',
              skill: 'grammar',
              explanation:
                'No hay is there isn’t / there are no. With no hay the article is usually dropped.',
            },
          ),
          ex.listenChoice(
            'No hay puerta.',
            ['No hay cama.', 'Hay una puerta.', 'No hay ventana.'],
            ['es-no-hay', 'es-la-puerta'],
            { id: 'es.ex.954hbjp149deot' },
          ),
          ex.translateWrite(
            'There are two beds in the bedroom.',
            'En el dormitorio hay dos camas.',
            ['es-hay', 'es-la-cama', 'es-el-dormitorio'],
            { id: 'es.ex.layvbnxnho3mva', acceptedAnswers: ['Hay dos camas en el dormitorio.'] },
          ),
          ex.translateWrite(
            'There is no kitchen.',
            'No hay cocina.',
            ['es-no-hay', 'es-la-cocina'],
            {
              id: 'es.ex.ltc6733fhj335k',
              acceptedAnswers: ['No hay una cocina.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Dónde está?',
        objective: 'Ask and say where something is with estar.',
        intro: {
          explanation:
            'To say where something is, use estar: ¿dónde está la llave? — Está en la mesa. For more than one thing: están. Spanish has two verbs for “to be”: ser for what something is or is like (la cocina es grande) and estar for where it is (la cocina está al lado de la sala). En means in, on or at: en la mesa, en el baño. Hay says that something exists; está says where a specific thing is: hay una mesa, but la mesa está en la cocina.',
          examples: [
            {
              target: '¿Dónde está el gato? — Está en la cama.',
              base: 'Where is the cat? — It’s on the bed.',
            },
            { target: 'Mis llaves están en la cocina.', base: 'My keys are in the kitchen.' },
          ],
        },
        takeaways: [
          'You ask ¿dónde está…? and answer está en…',
          'You use ser for what something is like and estar for where it is.',
        ],
        exercises: [
          ex.translationChoice(
            '¿dónde está?',
            'where is it?',
            ['there is', 'what is this?', 'how are you?'],
            ['es-donde-esta'],
            { id: 'es.ex.zhyweyxn6x6q15' },
          ),
          ex.translationChoice(
            'está',
            'it is (located)',
            ['there is', "there isn't", 'where is it?'],
            ['es-esta'],
            { id: 'es.ex.vmzj9m46wvbqi0' },
          ),
          ex.fillBlank(
            '¿Dónde ___ la llave?',
            'Where is the key?',
            'está',
            ['es', 'hay', 'son'],
            ['es-donde-esta'],
            {
              id: 'es.ex.0dcoo8en51sgu1',
              skill: 'grammar',
              explanation: 'For location you use estar: ¿dónde está…? Not ser.',
            },
          ),
          ex.fillBlank(
            'El gato está ___ la sala.',
            'The cat is in the living room.',
            'en',
            ['de', 'y', 'por'],
            ['es-en', 'es-esta'],
            {
              id: 'es.ex.auyvmub6le154i',
              skill: 'grammar',
              explanation: 'En means in, on or at: en la sala, en la mesa.',
            },
          ),
          ex.listenChoice(
            'Está en la cocina.',
            ['Está en el baño.', 'Es la cocina.', 'Hay una cocina.'],
            ['es-esta', 'es-en'],
            { id: 'es.ex.abzf6za2sfr8m1' },
          ),
          ex.fillBlank(
            'La cocina ___ grande.',
            'The kitchen is big.',
            'es',
            ['está', 'hay', 'son'],
            ['es-esta'],
            {
              id: 'es.ex.e72rh5gurqs6nk',
              skill: 'grammar',
              explanation:
                'Grande describes what the kitchen is like, so you use ser: es grande. Estar is for where it is.',
            },
          ),
          ex.fillBlank(
            'Mis llaves ___ en la mesa.',
            'My keys are on the table.',
            'están',
            ['está', 'es', 'hay'],
            ['es-esta', 'es-en'],
            {
              id: 'es.ex.447kvb3kzdgc0o',
              skill: 'grammar',
              explanation: 'Llaves is plural, so estar becomes están.',
            },
          ),
          ex.orderWords(
            'El perro está en la sala.',
            'The dog is in the living room.',
            ['es-esta', 'es-en'],
            { id: 'es.ex.ehw9wqmb7qlnf1' },
          ),
          ex.shortAnswer(
            '¿Dónde está tu celular?',
            'Say it is in the kitchen (start with «Está…»).',
            'Está en la cocina.',
            ['Está en la cocina', 'En la cocina.', 'En la cocina', 'Mi celular está en la cocina.'],
            ['es-esta', 'es-en', 'es-la-cocina'],
            { id: 'es.ex.gvadcwkeigh66f' },
          ),
          ex.translateWrite(
            'Where is the bathroom?',
            '¿Dónde está el baño?',
            ['es-donde-esta', 'es-el-bano'],
            {
              id: 'es.ex.3ox7ga63slgl2b',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Arriba, debajo, al lado',
        objective: 'Place things with prepositions of place.',
        intro: {
          explanation:
            'Prepositions of place: arriba de (on top of), debajo de (under), al lado de (next to), enfrente de (opposite, across from) and detrás de (behind; in everyday speech you will also hear atrás de). De + el becomes del: al lado del baño. With la nothing changes: al lado de la cocina.',
          examples: [
            { target: 'El gato está debajo de la mesa.', base: 'The cat is under the table.' },
            {
              target: 'El baño está al lado del dormitorio.',
              base: 'The bathroom is next to the bedroom.',
            },
          ],
        },
        takeaways: [
          'You place things with arriba de, debajo de, al lado de, enfrente de and detrás de.',
          'You say del, never de el: al lado del baño.',
        ],
        exercises: [
          ex.translationChoice(
            'debajo de',
            'under',
            ['on top of', 'behind', 'next to'],
            ['es-debajo-de'],
            { id: 'es.ex.3y6v8ixrzm7s8t' },
          ),
          ex.matchPairs(
            [
              ['arriba de', 'on top of'],
              ['al lado de', 'next to'],
              ['enfrente de', 'opposite'],
              ['detrás de', 'behind'],
            ],
            ['es-arriba-de', 'es-al-lado-de', 'es-enfrente-de', 'es-detras-de'],
            { id: 'es.ex.l14ti2ezsfyvkw' },
          ),
          ex.fillBlank(
            'El libro está ___ de la mesa.',
            'The book is on top of the table.',
            'arriba',
            ['debajo', 'detrás', 'enfrente'],
            ['es-arriba-de'],
            {
              id: 'es.ex.mduy5nur1wax4i',
              skill: 'vocabulary',
              explanation: 'Arriba de is on top of; debajo de is under.',
            },
          ),
          ex.fillBlank(
            'El baño está al lado ___ dormitorio.',
            'The bathroom is next to the bedroom.',
            'del',
            ['de el', 'de la', 'la'],
            ['es-al-lado-de'],
            {
              id: 'es.ex.2e1jmi0mwvay58',
              skill: 'grammar',
              explanation:
                'Dormitorio is masculine (el dormitorio), and de + el always becomes del.',
            },
          ),
          ex.listenChoice(
            'El perro está detrás de la puerta.',
            [
              'El gato está detrás de la puerta.',
              'El perro está al lado de la puerta.',
              'El perro está debajo de la cama.',
            ],
            ['es-detras-de', 'es-la-puerta'],
            { id: 'es.ex.frigqwymxod258' },
          ),
          ex.fillBlank(
            'La cocina está ___ de la sala.',
            'The kitchen is opposite the living room.',
            'enfrente',
            ['arriba', 'debajo', 'detrás'],
            ['es-enfrente-de'],
            {
              id: 'es.ex.q05dwixijm9q5n',
              skill: 'vocabulary',
              explanation: 'Enfrente de is opposite or across from: enfrente de la sala.',
            },
          ),
          ex.listenChoice(
            'La cama está al lado de la ventana.',
            [
              'La casa está al lado de la ventana.',
              'La cama está enfrente de la ventana.',
              'La cama está debajo de la ventana.',
            ],
            ['es-al-lado-de', 'es-la-cama'],
            { id: 'es.ex.3g6jqlnvwrotoj' },
          ),
          ex.orderWords(
            'La mochila está debajo de la silla.',
            'The backpack is under the chair.',
            ['es-debajo-de'],
            { id: 'es.ex.bbl8zzeqhtwcu9' },
          ),
          ex.translateWrite(
            'The cat is behind the door.',
            'El gato está detrás de la puerta.',
            ['es-detras-de', 'es-la-puerta'],
            { id: 'es.ex.ly55u55y21s2oc', acceptedAnswers: ['El gato está atrás de la puerta.'] },
          ),
          ex.translateWrite(
            'My phone is next to the bed.',
            'Mi celular está al lado de la cama.',
            ['es-al-lado-de', 'es-la-cama'],
            { id: 'es.ex.8g5h9t3t27oirl' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mi casa',
        objective: 'Understand a description of a home and a conversation about where things are.',
        intro: {
          explanation:
            'Hay and estar together describe a home: hay dos dormitorios; la cocina está al lado de la sala. Spanish uses a double negative: no hay nada (there is nothing), no hay camas ni mesas (there are no beds or tables).',
          examples: [
            {
              target: 'En mi casa hay tres dormitorios.',
              base: 'There are three bedrooms in my house.',
            },
            { target: 'No hay nada en la mesa.', base: 'There is nothing on the table.' },
          ],
        },
        takeaways: [
          'You understand an ad for an apartment.',
          'You follow a short conversation about where things are.',
        ],
        exercises: [
          question(
            'es.ex.fl6cm0xp5df2bw',
            AVISO,
            'How many bedrooms does the apartment have?',
            'Two',
            ['One', 'Three', 'It doesn’t say'],
            ['es-el-dormitorio', 'es-hay'],
            'The ad says “Hay dos dormitorios”.',
          ),
          question(
            'es.ex.84gurbqhs8epvf',
            AVISO,
            'Which room is big?',
            'The living room',
            ['The kitchen', 'The bathroom', 'The bedroom'],
            ['es-la-sala'],
            'It mentions “una cocina chica y una sala grande”.',
          ),
          question(
            'es.ex.n4xp2rbtif4gxf',
            AVISO,
            'How many windows does the living room have?',
            'Three',
            ['Two', 'One', 'None'],
            ['es-la-ventana', 'es-la-sala'],
            'The ad says “La sala tiene tres ventanas”.',
          ),
          question(
            'es.ex.j5zuik2gsbgze6',
            AVISO,
            'What does the apartment not have?',
            'Beds and tables',
            ['A bathroom', 'Windows', 'A kitchen'],
            ['es-no-hay', 'es-la-cama'],
            'The last line says “No hay camas ni mesas”.',
          ),
          question(
            'es.ex.d90ugw33rh3rqz',
            LLAVES,
            'What is on the living room table?',
            'Nothing',
            ['Martín’s keys', 'A phone', 'A book'],
            ['es-no-hay'],
            'Martín says “en la mesa no hay nada”.',
          ),
          question(
            'es.ex.pmgb9cenftw54r',
            LLAVES,
            'Where are Martín’s keys in the end?',
            'Under the bed',
            ['On the table', 'Next to the bed', 'In the kitchen'],
            ['es-debajo-de', 'es-la-cama'],
            'Martín finds them: “Están debajo de la cama”.',
          ),
          ex.listenChoice(
            'En la sala hay dos ventanas.',
            [
              'En la sala hay tres ventanas.',
              'En el dormitorio hay dos ventanas.',
              'En la sala no hay ventanas.',
            ],
            ['es-hay', 'es-la-sala'],
            { id: 'es.ex.ee11ntbppyi4d6' },
          ),
          ex.fillBlank(
            'La cocina está ___ lado del baño.',
            'The kitchen is next to the bathroom.',
            'al',
            ['del', 'el', 'en'],
            ['es-al-lado-de', 'es-la-cocina'],
            {
              id: 'es.ex.qcdzk7p37ig3fg',
              skill: 'grammar',
              explanation: 'Next to is al lado de (a + el = al). Here it is followed by del baño.',
            },
          ),
          ex.shortAnswer(
            '¿Cuántos dormitorios hay en tu casa?',
            'Say there are two (start with «Hay…»).',
            'Hay dos dormitorios.',
            [
              'Hay dos.',
              'Hay dos',
              'Hay dos dormitorios',
              'En mi casa hay dos dormitorios.',
              'Dos.',
            ],
            ['es-hay', 'es-el-dormitorio'],
            { id: 'es.ex.lkqnomcv0mc435' },
          ),
          ex.translateWrite(
            'In my apartment there is a big kitchen.',
            'En mi apartamento hay una cocina grande.',
            ['es-hay', 'es-el-apartamento', 'es-la-cocina'],
            {
              id: 'es.ex.bc336cx5pjbkjc',
              acceptedAnswers: ['Hay una cocina grande en mi apartamento.'],
            },
          ),
        ],
      },
    ],
  },
};

import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U3 «Restaurant and hotel» (docs/ES_A1_A2.md): reservar una mesa o una habitación,
 * pedir en un restaurante con cortesía (me gustaría, ¿podría…?, ¿me trae…?) y con usted, entender la
 * carta y el menú del día, pedir el punto de la carne y la cuenta.
 * Pronunciación: la entonación amable de los pedidos (sube al final, ¿podría traerme la cuenta?) y la
 * r simple de podría y traer.
 * Cultura: la parrilla, el bife jugoso o a punto, el flan con dulce de leche y la propina (alrededor
 * del 10 %, casi nunca incluida).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RESERVA = dialogue(
  'es.stim.a2-u3-reserva',
  'Juan phones a hotel in Mendoza to book a room.',
  [
    ['Valentina', 'Hotel Los Andes, buenas tardes.'],
    [
      'Juan',
      'Buenas tardes. Me gustaría reservar una habitación doble para el viernes y el sábado.',
    ],
    ['Valentina', '¡Cómo no! Son 70.000 pesos por noche.'],
    ['Juan', '¿El desayuno está incluido?'],
    [
      'Valentina',
      'Sí, el desayuno está incluido. La habitación está en el tercer piso, al lado del ascensor.',
    ],
    ['Juan', 'Muy bien, gracias. Me llamo Juan Pérez.'],
  ],
);

const MENU = reading(
  'es.stim.a2-u3-menu',
  'menu',
  'The set lunch menu on the board of a small restaurant in Buenos Aires.',
  [
    'Menú del día: $15.000',
    'Entrada: empanada de carne o ensalada.',
    'Plato principal: bife con papas fritas o pescado con verduras.',
    'Postre: flan con dulce de leche o helado.',
    'Pan y bebida incluidos: agua o vino.',
    'La propina no está incluida.',
  ],
  { title: 'La Esquina' },
);

const PARRILLA = dialogue(
  'es.stim.a2-u3-parrilla',
  'Martín orders dinner at a parrilla, an Argentine steakhouse.',
  [
    ['Mozo', 'Buenas noches. ¿Quiere la carta o el menú del día?'],
    ['Martín', 'La carta, por favor. Me gustaría un bife con papas fritas.'],
    ['Mozo', '¿Cómo quiere la carne? ¿Jugosa, a punto o cocida?'],
    ['Martín', 'A punto, por favor. ¿Me trae también un agua sin gas?'],
    ['Mozo', '¡Cómo no! ¿Y de postre?'],
    ['Martín', 'Un flan con dulce de leche. Y después, ¿podría traerme la cuenta?'],
  ],
);

export const ES_A2_U03: EsUnitDef = {
  names: [
    'Juan',
    'Valentina',
    'Martín',
    'Pérez',
    'Los Andes',
    'La Esquina',
    'Mendoza',
    'Buenos Aires',
  ],
  support: [
    'traer',
    'traerme',
    'sin',
    'gas',
    'bife',
    'papas',
    'fritas',
    'empanada',
    'ensalada',
    'flan',
    'dulce',
    'helado',
    'bebida',
    'cocido',
    'tercer',
  ],
  unit: {
    position: 3,
    title: 'Restaurant and hotel',
    titleEn: 'Restaurante y hotel',
    description:
      'Book a table or a hotel room, order politely with me gustaría, ¿podría…? and ¿me trae…?, understand the menu and the set menu, say how you want your steak and ask for the bill.',
    emoji: '🍽️',
    objective:
      'You can book a hotel room or a table, ask what is included, order a meal politely in a restaurant, say how you like your meat and ask for the bill.',
    grammar: {
      title: 'Polite requests: me gustaría, ¿podría…?, ¿me trae…?',
      explanation:
        'With waiters and hotel staff you usually speak politely, often with usted. Me gustaría (I would like) is the conditional of me gusta and goes with an infinitive or a noun: me gustaría reservar una mesa, me gustaría un café. ¿Podría…? (could you…?, usted) goes with an infinitive: ¿podría traer agua? A pronoun can join the end of the infinitive: ¿podría traerme la cuenta? (bring me). In a restaurant people very often order with a simple present question: ¿me trae…? (literally “do you bring me…?”). Quisiera, which you already know, works too. Say these requests softly, with the voice rising at the end: that intonation is part of being polite in Spanish.',
      examples: [
        {
          target: 'Me gustaría reservar una habitación doble.',
          base: 'I would like to book a double room.',
        },
        {
          target: '¿Podría traerme la cuenta, por favor?',
          base: 'Could you bring me the bill, please?',
        },
        { target: '¿Me trae la carta, por favor?', base: 'Could you bring me the menu, please?' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U3). Sin revisión nativa. Revisar: «jugoso» traducido como «rare (steak)» (en la Argentina es más bien poco hecho / medium-rare); «a punto» como medium; «cocido» (o «bien cocido») para well done; el uso de usted con el mozo (en Buenos Aires muchos jóvenes lo tutean con vos: ¿me traés…?), que se menciona sólo en inglés; «la propina, alrededor del 10 %»; «¿Me trae…?» como pedido habitual; el precio en cifras (70.000 pesos) para el audio.',
    },
    words: [
      w(
        'es-reservar',
        'reservar',
        'to book',
        'Quiero reservar una mesa para dos.',
        'I want to book a table for two.',
        ['restaurant', 'hotel'],
        { acceptedTranslations: ['to reserve'] },
      ),
      w(
        'es-la-habitacion-doble',
        'la habitación doble',
        'the double room',
        'Quisiera una habitación doble, por favor.',
        'I’d like a double room, please.',
        ['hotel'],
        { emoji: '🛏️' },
      ),
      w(
        'es-por-noche',
        'por noche',
        'per night',
        'La habitación cuesta 70.000 pesos por noche.',
        'The room costs 70,000 pesos per night.',
        ['hotel'],
        { acceptedTranslations: ['a night'] },
      ),
      w(
        'es-incluido',
        'incluido',
        'included',
        'El desayuno está incluido.',
        'Breakfast is included.',
        ['hotel', 'restaurant'],
        { acceptedTexts: ['incluida', 'incluidos', 'incluidas'] },
      ),
      w(
        'es-la-carta',
        'la carta',
        'the menu',
        '¿Me trae la carta, por favor?',
        'Could you bring me the menu, please?',
        ['restaurant'],
      ),
      w(
        'es-el-menu-del-dia',
        'el menú del día',
        'the set menu',
        'El menú del día tiene entrada, plato principal y postre.',
        'The set menu has a starter, a main course and a dessert.',
        ['restaurant'],
        { acceptedTranslations: ['the daily special'] },
      ),
      w(
        'es-la-entrada',
        'la entrada',
        'the starter',
        'De entrada, quisiera una empanada.',
        'As a starter, I’d like an empanada.',
        ['restaurant'],
        { acceptedTranslations: ['the appetizer'] },
      ),
      w(
        'es-el-plato-principal',
        'el plato principal',
        'the main course',
        'De plato principal, pescado con verduras.',
        'For the main course, fish with vegetables.',
        ['restaurant'],
        { acceptedTranslations: ['the main dish'] },
      ),
      w(
        'es-el-postre',
        'el postre',
        'the dessert',
        'De postre quiero un flan con dulce de leche.',
        'For dessert I want a flan with dulce de leche.',
        ['restaurant'],
        { acceptedTranslations: ['dessert'], emoji: '🍮' },
      ),
      w(
        'es-la-cuenta',
        'la cuenta',
        'the bill',
        'La cuenta, por favor.',
        'The bill, please.',
        ['restaurant'],
        {
          acceptedTranslations: ['the check'],
        },
      ),
      w(
        'es-la-propina',
        'la propina',
        'the tip',
        'La propina no está incluida.',
        'The tip isn’t included.',
        ['restaurant'],
      ),
      w(
        'es-me-gustaria',
        'me gustaría',
        'I would like to',
        'Me gustaría reservar una mesa.',
        'I would like to book a table.',
        ['courtesy'],
        { acceptedTranslations: ['I would like'] },
      ),
      w(
        'es-podria',
        '¿podría…?',
        'could you…?, formal',
        '¿Podría traer agua, por favor?',
        'Could you bring some water, please?',
        ['courtesy'],
      ),
      w(
        'es-me-trae',
        '¿me trae…?',
        'could you bring me…?, formal',
        '¿Me trae un café, por favor?',
        'Could you bring me a coffee, please?',
        ['courtesy'],
      ),
      w(
        'es-el-ascensor',
        'el ascensor',
        'the elevator',
        'El ascensor está a la derecha.',
        'The elevator is on the right.',
        ['hotel'],
        { acceptedTranslations: ['the lift'] },
      ),
      w(
        'es-el-piso',
        'el piso',
        'the floor',
        'Mi habitación está en el cuarto piso.',
        'My room is on the fourth floor.',
        ['hotel'],
        { acceptedTranslations: ['the storey'] },
      ),
      w(
        'es-jugoso',
        'jugoso',
        'rare (steak)',
        'Quiero la carne jugosa.',
        'I want the meat rare.',
        ['restaurant', 'argentina'],
        { acceptedTranslations: ['medium-rare'], acceptedTexts: ['jugosa'] },
      ),
      w(
        'es-a-punto',
        'a punto',
        'medium (steak)',
        'El bife a punto, por favor.',
        'The steak medium, please.',
        ['restaurant'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Me gustaría…, ¿podría…?',
        objective: 'Make polite requests in a restaurant or a hotel.',
        intro: {
          explanation:
            'Three polite ways to ask for something: me gustaría + infinitive or noun (I would like): me gustaría reservar una mesa; ¿podría + infinitive? (could you…?, with usted): ¿podría traer agua?; and ¿me trae…? (could you bring me…?), the everyday way to order: ¿me trae un café? Me gusta is I like in general; me gustaría is a request. Reservar is to book. Say requests softly, with the voice rising at the end; the single r in podría and traer is a quick tap, like the tt in American butter.',
          examples: [
            {
              target: 'Me gustaría reservar una mesa para dos.',
              base: 'I would like to book a table for two.',
            },
            {
              target: '¿Me trae la cuenta, por favor?',
              base: 'Could you bring me the bill, please?',
            },
          ],
        },
        takeaways: [
          'You ask politely with me gustaría, ¿podría…? and ¿me trae…?',
          'You book a table with reservar and ask for la cuenta.',
        ],
        exercises: [
          ex.translationChoice(
            'me gustaría',
            'I would like to',
            ['I like', 'I love', 'I prefer'],
            ['es-me-gustaria'],
            { id: 'es.ex.55vhqlub8925jw' },
          ),
          ex.fillBlank(
            'Me ___ reservar una mesa para el sábado.',
            'I would like to book a table for Saturday.',
            'gustaría',
            ['gusta', 'encanta'],
            ['es-me-gustaria', 'es-reservar'],
            {
              id: 'es.ex.q7gp2vq21jctwk',
              explanation:
                'Me gustaría (I would like) is a polite request. Me gusta is I like, in general; me encanta is I love.',
            },
          ),
          ex.listenChoice(
            '¿Me trae la cuenta, por favor?',
            [
              '¿Me trae un café, por favor?',
              '¿Me trae la cuenta, señor?',
              '¿Podría traer la cuenta?',
            ],
            ['es-me-trae', 'es-la-cuenta'],
            { id: 'es.ex.mioyjo75dn8ga8' },
          ),
          ex.matchPairs(
            [
              ['reservar', 'to book'],
              ['la cuenta', 'the bill'],
              ['me gustaría', 'I would like to'],
              ['¿me trae…?', 'could you bring me…?, formal'],
            ],
            ['es-reservar', 'es-la-cuenta', 'es-me-gustaria', 'es-me-trae'],
            { id: 'es.ex.k3o81vdizfran8' },
          ),
          ex.fillBlank(
            '¿___ traer un poco de agua, por favor?',
            'Could you bring a little water, please?',
            'Podría',
            ['Quiero', 'Me gustaría'],
            ['es-podria'],
            {
              id: 'es.ex.jyisrbqivjdenw',
              explanation:
                '¿Podría + infinitive? asks someone (usted) to do something: could you…? Quiero and me gustaría talk about what you want to do yourself.',
            },
          ),
          ex.translationChoice(
            'reservar',
            'to book',
            ['to pay', 'to order', 'to stay'],
            ['es-reservar'],
            {
              id: 'es.ex.sinlftj703lph1',
            },
          ),
          ex.orderWords(
            'Me gustaría reservar una mesa para dos.',
            'I would like to book a table for two.',
            ['es-me-gustaria', 'es-reservar'],
            { id: 'es.ex.exp3dd4e3ptamb' },
          ),
          ex.listenChoice(
            '¿Podría traer la cuenta?',
            ['¿Podría traer el agua?', '¿Me trae la cuenta?', '¿Tiene la cuenta?'],
            ['es-podria', 'es-la-cuenta'],
            { id: 'es.ex.6q14pca7g9nl2a' },
          ),
          ex.shortAnswer(
            'Buenas noches. ¿Qué quiere tomar?',
            'Ask the waiter politely to bring you a coffee (start with «¿Me trae»).',
            '¿Me trae un café, por favor?',
            [
              '¿Me trae un café?',
              'Me trae un café, por favor.',
              '¿Podría traerme un café, por favor?',
              '¿Me podría traer un café, por favor?',
              'Me gustaría un café, por favor.',
            ],
            ['es-me-trae'],
            { id: 'es.ex.3b23wryv70xvz9' },
          ),
          ex.translateWrite(
            'Could you bring me the bill, please?',
            '¿Me trae la cuenta, por favor?',
            ['es-me-trae', 'es-la-cuenta'],
            {
              id: 'es.ex.s8qkiuxijl9wno',
              acceptedAnswers: [
                '¿Podría traerme la cuenta, por favor?',
                '¿Me podría traer la cuenta, por favor?',
                '¿Me trae la cuenta?',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Una habitación doble',
        objective: 'Book a hotel room and ask about the price, what is included and the floor.',
        intro: {
          explanation:
            'At a hotel you ask for una habitación doble (a double room). Prices are given por noche (per night). Incluido agrees like any adjective: el desayuno está incluido, la bebida está incluida. Floors are pisos: el primer piso, el tercer piso; the ground floor is la planta baja. El ascensor is the elevator. Habitación has a silent h, and the stress falls on the last syllable: -ción.',
          examples: [
            {
              target: 'Quisiera una habitación doble, por favor.',
              base: 'I’d like a double room, please.',
            },
            { target: 'El desayuno está incluido.', base: 'Breakfast is included.' },
          ],
        },
        takeaways: [
          'You book a room and ask about the price por noche.',
          'You ask whether something is incluido and on which piso the room is.',
        ],
        exercises: [
          ex.translationChoice(
            'la habitación doble',
            'the double room',
            ['the bathroom', 'the bedroom', 'the hotel'],
            ['es-la-habitacion-doble'],
            { id: 'es.ex.oy2alyv5bbpvo0' },
          ),
          ex.fillBlank(
            'La habitación cuesta 70.000 pesos ___ noche.',
            'The room costs 70,000 pesos per night.',
            'por',
            ['para', 'con', 'en'],
            ['es-por-noche'],
            {
              id: 'es.ex.lpjbstdxz5acbg',
              explanation: 'Per night is por noche. In the same way: por persona, por día.',
            },
          ),
          ex.listenChoice(
            'El desayuno está incluido.',
            [
              'El desayuno no está incluido.',
              'La cena está incluida.',
              'El almuerzo está incluido.',
            ],
            ['es-incluido'],
            { id: 'es.ex.lq5j7pr82kpt1i' },
          ),
          ex.matchPairs(
            [
              ['la habitación doble', 'the double room'],
              ['por noche', 'per night'],
              ['el ascensor', 'the elevator'],
              ['el piso', 'the floor'],
            ],
            ['es-la-habitacion-doble', 'es-por-noche', 'es-el-ascensor', 'es-el-piso'],
            { id: 'es.ex.hvosg9ltncbaob' },
          ),
          question(
            'es.ex.7y3dem8idjzh4w',
            RESERVA,
            'What does Juan want to book?',
            'A double room for Friday and Saturday',
            [
              'A double room for Saturday and Sunday',
              'A single room for Friday',
              'A table for two on Friday',
            ],
            ['es-reservar', 'es-la-habitacion-doble'],
            'Juan says “Me gustaría reservar una habitación doble para el viernes y el sábado”.',
          ),
          question(
            'es.ex.mqo52udr7xl2yl',
            RESERVA,
            'Is breakfast included?',
            'Yes, it is included',
            ['No, it costs extra', 'Only on Saturday', 'The receptionist doesn’t know'],
            ['es-incluido'],
            'The receptionist answers “Sí, el desayuno está incluido”.',
          ),
          question(
            'es.ex.0hvoo6yplrasuu',
            RESERVA,
            'Where is the room?',
            'On the third floor, next to the elevator',
            [
              'On the third floor, opposite the elevator',
              'On the first floor, next to the elevator',
              'On the ground floor',
            ],
            ['es-el-piso', 'es-el-ascensor'],
            'She says “La habitación está en el tercer piso, al lado del ascensor”.',
          ),
          ex.fillBlank(
            'Mi habitación está en el cuarto ___.',
            'My room is on the fourth floor.',
            'piso',
            ['ascensor', 'dormitorio'],
            ['es-el-piso'],
            {
              id: 'es.ex.njmuzrb3tqjq7u',
              skill: 'vocabulary',
              explanation:
                'El piso is the floor (level) of a building: el cuarto piso, the fourth floor.',
            },
          ),
          ex.shortAnswer(
            'Hotel Los Andes, buenas tardes.',
            'Say you would like to book a double room (start with «Me gustaría»).',
            'Me gustaría reservar una habitación doble.',
            [
              'Me gustaría reservar una habitación doble, por favor.',
              'Buenas tardes, me gustaría reservar una habitación doble.',
              'Buenas tardes. Me gustaría reservar una habitación doble, por favor.',
              'Quisiera reservar una habitación doble.',
            ],
            ['es-me-gustaria', 'es-reservar', 'es-la-habitacion-doble'],
            { id: 'es.ex.zv67m9b7dh7t5z' },
          ),
          ex.translateWrite(
            'Is breakfast included?',
            '¿El desayuno está incluido?',
            ['es-incluido'],
            {
              id: 'es.ex.ypcwe4c53ethw7',
              acceptedAnswers: ['¿Está incluido el desayuno?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'La carta y el menú del día',
        objective: 'Understand the menu and order a starter, a main course and a dessert.',
        intro: {
          explanation:
            'La carta is the full menu. El menú del día is a set menu at a fixed price, very common at lunchtime: una entrada (a starter; careful, entrada also means entrance or ticket), un plato principal and un postre. To order each course: de entrada…, de plato principal…, de postre… Argentine classics: empanadas as a starter and flan con dulce de leche for dessert. Note the written accent of menú: the stress falls on the last syllable.',
          examples: [
            { target: 'De entrada, una empanada.', base: 'As a starter, an empanada.' },
            {
              target: 'De postre, un flan con dulce de leche.',
              base: 'For dessert, a flan with dulce de leche.',
            },
          ],
        },
        takeaways: [
          'You tell la carta from el menú del día.',
          'You order each course with de entrada, de plato principal and de postre.',
        ],
        exercises: [
          ex.translationChoice(
            'la carta',
            'the menu',
            ['the bill', 'the set menu', 'the tip'],
            ['es-la-carta'],
            {
              id: 'es.ex.z6qbwzxggvwf55',
            },
          ),
          ex.matchPairs(
            [
              ['la entrada', 'the starter'],
              ['el plato principal', 'the main course'],
              ['el postre', 'the dessert'],
              ['el menú del día', 'the set menu'],
            ],
            ['es-la-entrada', 'es-el-plato-principal', 'es-el-postre', 'es-el-menu-del-dia'],
            { id: 'es.ex.d10ss3g3yeazmo' },
          ),
          ex.fillBlank(
            'De ___, quisiera un flan con dulce de leche.',
            'For dessert, I’d like a flan with dulce de leche.',
            'postre',
            ['entrada', 'carta', 'cuenta'],
            ['es-el-postre'],
            {
              id: 'es.ex.kzykm3cow7veyi',
              skill: 'vocabulary',
              explanation:
                'Flan is a dessert: de postre. La entrada is the starter; la carta, the menu.',
            },
          ),
          ex.listenChoice(
            '¿Me trae la carta, por favor?',
            [
              '¿Me trae la cuenta, por favor?',
              '¿Me trae el postre, por favor?',
              '¿Me trae la entrada, por favor?',
            ],
            ['es-la-carta', 'es-me-trae'],
            { id: 'es.ex.kz937lld3vwmmg' },
          ),
          ex.fillBlank(
            'El ___ del día tiene entrada, plato principal y postre.',
            'The set menu has a starter, a main course and a dessert.',
            'menú',
            ['plato', 'postre'],
            ['es-el-menu-del-dia', 'es-la-entrada', 'es-el-plato-principal'],
            {
              id: 'es.ex.8yp9rkwe26it0z',
              skill: 'vocabulary',
              explanation:
                'El menú del día is the set menu, with several courses at a fixed price.',
            },
          ),
          ex.translationChoice(
            'la entrada',
            'the starter',
            ['the dessert', 'the main course', 'the bill'],
            ['es-la-entrada'],
            { id: 'es.ex.rtgs0j79c2gfhq' },
          ),
          ex.orderWords(
            'De plato principal quiero pescado con verduras.',
            'For the main course I want fish with vegetables.',
            ['es-el-plato-principal'],
            { id: 'es.ex.s4tletmxgtm6de' },
          ),
          ex.shortAnswer(
            '¿Qué quiere de entrada?',
            'Order an empanada as a starter (start with «De entrada»).',
            'De entrada, una empanada.',
            [
              'De entrada una empanada.',
              'De entrada, una empanada, por favor.',
              'De entrada quiero una empanada.',
              'De entrada, quisiera una empanada.',
              'De entrada me gustaría una empanada.',
            ],
            ['es-la-entrada'],
            { id: 'es.ex.58otp3fit6ackk' },
          ),
          ex.translateWrite(
            'I would like the set menu, please.',
            'Me gustaría el menú del día, por favor.',
            ['es-el-menu-del-dia', 'es-me-gustaria'],
            {
              id: 'es.ex.nljzdsjnnhkc7q',
              acceptedAnswers: [
                'Quisiera el menú del día, por favor.',
                'Me gustaría el menú del día.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Jugoso o a punto',
        objective: 'Say how you want your meat and understand what is included and the tip.',
        intro: {
          explanation:
            'At a parrilla (an Argentine steakhouse) the waiter asks how you want your meat: jugoso (pink and juicy inside, roughly medium-rare), a punto (medium) or cocido (well done). The adjective agrees with the noun: el bife jugoso, la carne jugosa. La propina (the tip) is almost never included in la cuenta; around 10 % is usual in Argentina.',
          examples: [
            { target: 'El bife a punto, por favor.', base: 'The steak medium, please.' },
            { target: 'La propina no está incluida.', base: 'The tip isn’t included.' },
          ],
        },
        takeaways: [
          'You order your meat jugoso, a punto or cocido.',
          'You know that la propina is not usually included.',
        ],
        exercises: [
          ex.translationChoice(
            'jugoso',
            'rare (steak)',
            ['well done', 'medium (steak)', 'cold'],
            ['es-jugoso'],
            { id: 'es.ex.cow9ywt3l9j3fx' },
          ),
          ex.fillBlank(
            'Quiero el bife ___, no muy cocido.',
            'I want the steak rare, not very well done.',
            'jugoso',
            ['cocido', 'barato'],
            ['es-jugoso'],
            {
              id: 'es.ex.mmbbqxapxf4xqc',
              skill: 'vocabulary',
              explanation: 'Jugoso is pink and juicy inside; cocido is well done, the opposite.',
            },
          ),
          ex.listenChoice(
            'El bife a punto, por favor.',
            [
              'El bife jugoso, por favor.',
              'El bife cocido, por favor.',
              'El pescado a punto, por favor.',
            ],
            ['es-a-punto'],
            { id: 'es.ex.j0iobcqzukdl6g' },
          ),
          ex.matchPairs(
            [
              ['jugoso', 'rare (steak)'],
              ['a punto', 'medium (steak)'],
              ['la propina', 'the tip'],
              ['la cuenta', 'the bill'],
            ],
            ['es-jugoso', 'es-a-punto', 'es-la-propina', 'es-la-cuenta'],
            { id: 'es.ex.tzbx2pjw973eit' },
          ),
          question(
            'es.ex.ub2i2f6z0s0trh',
            MENU,
            'What drinks come with the set menu?',
            'Water or wine',
            ['Only water', 'Coffee or tea', 'None: drinks are extra'],
            ['es-incluido', 'es-el-menu-del-dia'],
            'The menu says “Pan y bebida incluidos: agua o vino”.',
          ),
          question(
            'es.ex.oi6073q0nrywt6',
            MENU,
            'What do you have to pay on top of the menu price?',
            'The tip',
            ['The bread', 'The dessert', 'The drink'],
            ['es-la-propina', 'es-incluido'],
            'The last line says “La propina no está incluida”.',
          ),
          ex.fillBlank(
            'En la Argentina, la ___ es más o menos el diez por ciento.',
            'In Argentina, the tip is about ten per cent.',
            'propina',
            ['cuenta', 'carta'],
            ['es-la-propina'],
            {
              id: 'es.ex.mjs6275rmazg5p',
              skill: 'vocabulary',
              explanation: 'La propina is the tip, usually around 10 % of la cuenta (the bill).',
            },
          ),
          ex.translationChoice(
            'la propina',
            'the tip',
            ['the bill', 'the menu', 'the starter'],
            ['es-la-propina'],
            { id: 'es.ex.oahynh9g7va9j7' },
          ),
          ex.shortAnswer(
            '¿Cómo quiere la carne?',
            'Say you want it medium (start with «A punto»).',
            'A punto, por favor.',
            ['A punto.', 'A punto, gracias.', 'La quiero a punto.', 'A punto, por favor, gracias.'],
            ['es-a-punto'],
            { id: 'es.ex.1o47d3c2lw3485' },
          ),
          ex.translateWrite(
            'Is the tip included?',
            '¿La propina está incluida?',
            ['es-la-propina', 'es-incluido'],
            { id: 'es.ex.x8dks4y04io1hq', acceptedAnswers: ['¿Está incluida la propina?'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'En la parrilla',
        objective: 'Follow a conversation with a waiter and order a whole meal.',
        intro: {
          explanation:
            'Dinner in Argentina starts late: many restaurants fill up after nine in the evening. The waiter is el mozo; to call him, make eye contact or raise your hand. A typical order at a parrilla: a steak (bife) with chips (papas fritas), a drink (agua con gas or sin gas, or wine) and a dessert. Finish with ¿podría traerme la cuenta?, said softly and rising at the end.',
          examples: [
            { target: '¿Me trae un agua sin gas?', base: 'Could you bring me a still water?' },
            { target: '¿Podría traerme la cuenta?', base: 'Could you bring me the bill?' },
          ],
        },
        takeaways: [
          'You follow a waiter’s questions and answer them politely.',
          'You order a full meal and ask for the bill.',
        ],
        exercises: [
          question(
            'es.ex.eraa2p4ra7041u',
            PARRILLA,
            'How does Martín want his steak?',
            'Medium',
            ['Rare', 'Well done', 'He doesn’t say'],
            ['es-a-punto', 'es-jugoso'],
            'The waiter asks “¿Jugosa, a punto o cocida?” and Martín answers “A punto, por favor”.',
          ),
          question(
            'es.ex.yx8hh47zvw06mh',
            PARRILLA,
            'What does Martín ask for to drink?',
            'Still water',
            ['Sparkling water', 'Red wine', 'A coffee'],
            ['es-me-trae'],
            'He says “¿Me trae también un agua sin gas?”: sin gas means still.',
          ),
          question(
            'es.ex.yt1l4czea6q50m',
            PARRILLA,
            'What does Martín ask for at the end?',
            'The bill',
            ['The menu', 'Another dessert', 'A coffee'],
            ['es-la-cuenta', 'es-podria'],
            'After the dessert he asks “¿podría traerme la cuenta?”.',
          ),
          ex.listenChoice(
            '¿Podría traerme la cuenta?',
            ['¿Podría traerme la carta?', '¿Podría traerme el postre?', '¿Me trae la cuenta?'],
            ['es-podria', 'es-la-cuenta'],
            { id: 'es.ex.5jwwpeg23i05jx' },
          ),
          ex.fillBlank(
            '¿Me ___ un agua sin gas, por favor?',
            'Could you bring me a still water, please?',
            'trae',
            ['toma', 'va'],
            ['es-me-trae'],
            {
              id: 'es.ex.fowdgk0jkrsptf',
              explanation:
                '¿Me trae…? (could you bring me…?) is the usual way to order with usted.',
            },
          ),
          ex.matchPairs(
            [
              ['la carta', 'the menu'],
              ['el postre', 'the dessert'],
              ['¿podría…?', 'could you…?, formal'],
              ['a punto', 'medium (steak)'],
            ],
            ['es-la-carta', 'es-el-postre', 'es-podria', 'es-a-punto'],
            { id: 'es.ex.fo1sitrnylb7w4' },
          ),
          ex.fillBlank(
            '¿Cómo quiere la carne: jugosa o a ___?',
            'How would you like the meat: rare or medium?',
            'punto',
            ['tiempo', 'pie'],
            ['es-a-punto', 'es-jugoso'],
            {
              id: 'es.ex.q3dwmauxpiqrx7',
              explanation: 'A punto is medium. A tiempo means on time and a pie, on foot.',
            },
          ),
          ex.translationChoice(
            '¿podría…?',
            'could you…?, formal',
            ['could you bring me…?, formal', 'I would like to', 'do you like?'],
            ['es-podria'],
            { id: 'es.ex.yuwho8zy1gfzty' },
          ),
          ex.shortAnswer(
            '¿Quiere postre?',
            'Say yes, a flan with dulce de leche, please (start with «Sí»).',
            'Sí, un flan con dulce de leche, por favor.',
            [
              'Sí, un flan con dulce de leche.',
              'Sí, de postre un flan con dulce de leche, por favor.',
              'Sí, me gustaría un flan con dulce de leche.',
              'Sí, quisiera un flan con dulce de leche, por favor.',
            ],
            ['es-el-postre'],
            { id: 'es.ex.aigtj2ukwquauz' },
          ),
          ex.translateWrite(
            'Good evening. I would like to book a table for two for tonight.',
            'Buenas noches. Me gustaría reservar una mesa para dos para esta noche.',
            ['es-me-gustaria', 'es-reservar'],
            {
              id: 'es.ex.360fkxa8hviw38',
              acceptedAnswers: [
                'Buenas noches, me gustaría reservar una mesa para dos para esta noche.',
                'Buenas noches. Me gustaría reservar una mesa para esta noche para dos.',
                'Buenas noches. Quisiera reservar una mesa para dos para esta noche.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

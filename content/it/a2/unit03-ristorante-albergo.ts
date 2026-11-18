import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U3 «Restaurantes y hotel» (docs/IT_A1_A2.md): reservar (prenotare), pedir con cortesía
 * tratando de Lei (mi porta…?, potrei…?, posso avere…?), el orden del menú italiano (primo, secondo,
 * contorno, dolce), la cuenta (il coperto, la mancia) y el hotel (camera doppia, colazione compresa).
 * Falso amigo: il burro es la manteca.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MENU = reading(
  'it.stim.a2-u3-menu',
  'menu',
  'La carta de una trattoria de Bolonia.',
  [
    'Primi: spaghetti al pomodoro, risotto ai funghi.',
    'Secondi: pollo arrosto, pesce del giorno.',
    'Contorni: patate, insalata.',
    'Dolci: tiramisù, panna cotta.',
    'Coperto: 2 euro. Servizio compreso.',
  ],
  { title: 'Trattoria da Gino' },
);

const PRENOTAZIONE = dialogue(
  'it.stim.a2-u3-prenotazione',
  'Una clienta llama a un hotel para reservar.',
  [
    ['Hotel', 'Hotel Bellavista, buongiorno. Desidera?'],
    ['Cliente', 'Buongiorno. Vorrei prenotare una camera doppia per venerdì e sabato.'],
    [
      'Hotel',
      'Sì, abbiamo una camera con vista sul mare. Sono novanta euro a notte, colazione compresa.',
    ],
    ['Cliente', 'Perfetto. Posso pagare con la carta?'],
    ['Hotel', 'Certo. Mi dice il suo nome, per favore?'],
  ],
);

const TAVOLO = dialogue('it.stim.a2-u3-tavolo', 'Una pareja llega a la trattoria y pide.', [
  ['Cameriere', 'Buonasera! Avete prenotato?'],
  ['Cliente', 'Sì, un tavolo per due, a nome Rossi.'],
  ['Cameriere', 'Prego, da questa parte. Cosa prendete?'],
  ['Cliente', 'Per me un primo, gli spaghetti. E mi porta anche un po’ di pane e burro?'],
  ['Cameriere', 'Certo! E da bere?'],
  ['Cliente', 'Potrei avere un’acqua frizzante?'],
]);

const RECENSIONE = reading(
  'it.stim.a2-u3-recensione',
  'post',
  'Una reseña de la trattoria en una aplicación de restaurantes.',
  [
    'Siamo stati alla Trattoria da Gino sabato scorso.',
    'Il cibo è buonissimo e il cameriere è molto simpatico.',
    'Il conto: 60 euro in due, con il coperto.',
    'La mancia? In Italia non è obbligatoria, ma noi l’abbiamo lasciata!',
  ],
  { from: 'Valeria', title: 'Trattoria da Gino ★★★★★' },
);

export const IT_A2_U03: ItUnitDef = {
  names: ['Gino', 'Hotel', 'Bellavista', 'Cliente', 'Cameriere', 'Rossi', 'Valeria'],
  support: [
    'primi',
    'spaghetti',
    'pomodoro',
    'risotto',
    'ai',
    'funghi',
    'pollo',
    'arrosto',
    'pesce',
    'patate',
    'insalata',
    'tiramisù',
    'panna',
    'cotta',
    'servizio',
    'vista',
    'novanta',
    'notte',
    'perfetto',
    'certo',
    'dice',
    'nome',
    'questa',
    'prendete',
    'pane',
    'bere',
    'frizzante',
    'obbligatoria',
    'lasciata',
    'pago',
    'paga',
    'persona',
    'prezzo',
  ],
  unit: {
    position: 3,
    title: 'Restaurantes y hotel',
    titleEn: 'Ristorante e albergo',
    description:
      'Reservar una mesa o una habitación, pedir con cortesía (mi porta…?, potrei…?), entender el menú italiano y pagar la cuenta.',
    emoji: '🍝',
    objective:
      'Podés reservar una habitación o una mesa, pedir en un restaurante con cortesía tratando de usted (Lei), entender el orden del menú y la cuenta (il coperto, la mancia) y pagar.',
    grammar: {
      title: 'Pedidos corteses con Lei · potrei, mi porta…?',
      explanation:
        'En el restaurante y en el hotel se trata de Lei (usted), con el verbo en tercera persona: mi porta il conto? (¿me trae la cuenta?), desidera? (¿qué desea?). Para pedir con cortesía: vorrei, potrei avere…? (¿podría tener…?), posso avere…? El menú italiano va en orden: primo (pasta o risotto), secondo (carne o pescado), contorno (la guarnición, aparte) y dolce. En la cuenta suele estar il coperto; la mancia (propina) no es obligatoria.',
      examples: [
        {
          target: 'Vorrei prenotare una camera doppia.',
          base: 'Quisiera reservar una habitación doble.',
        },
        { target: 'Mi porta il conto, per favore?', base: '¿Me trae la cuenta, por favor?' },
        { target: 'Potrei avere un’acqua?', base: '¿Podría tomar un agua?' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U3). Sin revisión nativa: revisar el registro con Lei, el menú y los usos del coperto y la mancia.',
    },
    words: [
      w(
        'it-prenotare',
        'prenotare',
        'reservar',
        'Vorrei prenotare un tavolo.',
        'Quisiera reservar una mesa.',
        ['travel', 'food'],
      ),
      w(
        'it-ho-prenotato',
        'ho prenotato',
        'reservé',
        'Ho prenotato una camera.',
        'Reservé una habitación.',
        ['travel', 'past'],
      ),
      w(
        'it-camera-doppia',
        'camera doppia',
        'habitación doble',
        'Vorrei una camera doppia.',
        'Quisiera una habitación doble.',
        ['travel'],
        {
          emoji: '🛏️',
        },
      ),
      w(
        'it-camera-singola',
        'camera singola',
        'habitación simple',
        'Ho prenotato una camera singola.',
        'Reservé una habitación simple.',
        ['travel'],
        {
          acceptedTranslations: ['habitación individual'],
        },
      ),
      w(
        'it-compreso',
        'compreso',
        'incluido',
        'Il servizio è compreso.',
        'El servicio está incluido.',
        ['travel', 'food'],
        {
          acceptedTexts: ['compresa'],
          acceptedTranslations: ['incluida'],
        },
      ),
      w(
        'it-il-secondo',
        'il secondo',
        'el segundo plato',
        'Per secondo prendo il pollo.',
        'De segundo pido el pollo.',
        ['food'],
        {
          acceptedTranslations: ['el plato principal'],
        },
      ),
      w(
        'it-il-contorno',
        'il contorno',
        'la guarnición',
        'Come contorno, patate.',
        'De guarnición, papas.',
        ['food'],
        { emoji: '🥗' },
      ),
      w(
        'it-il-dolce',
        'il dolce',
        'el postre',
        'Per dolce, un tiramisù.',
        'De postre, un tiramisú.',
        ['food'],
        { emoji: '🍰' },
      ),
      w('it-potrei', 'potrei', 'podría', 'Potrei avere un caffè?', '¿Podría tomar un café?', [
        'verbs',
        'polite',
      ]),
      w(
        'it-mi-porta',
        'mi porta',
        'me trae',
        'Mi porta il conto, per favore?',
        '¿Me trae la cuenta, por favor?',
        ['polite', 'food'],
      ),
      w(
        'it-posso-avere',
        'posso avere',
        '¿me da…?',
        'Posso avere un’acqua?',
        '¿Me da un agua?',
        ['polite', 'food'],
        {
          acceptedTranslations: ['¿puedo tener…?', '¿me puede dar…?'],
        },
      ),
      w(
        'it-burro',
        'burro',
        'manteca',
        'Pane e burro, per favore.',
        'Pan y manteca, por favor.',
        ['food'],
        {
          acceptedTranslations: ['mantequilla'],
          emoji: '🧈',
        },
      ),
      w(
        'it-coperto',
        'il coperto',
        'el cubierto (cargo de mesa)',
        'Il coperto costa due euro.',
        'El cubierto cuesta dos euros.',
        ['food'],
        {
          acceptedTranslations: ['el cubierto'],
        },
      ),
      w(
        'it-mancia',
        'la mancia',
        'la propina',
        'La mancia non è obbligatoria.',
        'La propina no es obligatoria.',
        ['food'],
        {
          acceptedTranslations: ['propina'],
        },
      ),
      w(
        'it-in-contanti',
        'in contanti',
        'en efectivo',
        'Pago in contanti.',
        'Pago en efectivo.',
        ['shopping'],
        { emoji: '💵' },
      ),
      w(
        'it-con-la-carta',
        'con la carta',
        'con tarjeta',
        'Posso pagare con la carta?',
        '¿Puedo pagar con tarjeta?',
        ['shopping'],
        {
          emoji: '💳',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Vorrei prenotare',
        objective: 'Reservar una habitación o una mesa.',
        intro: {
          explanation:
            'Prenotare es «reservar»: vorrei prenotare una camera doppia (doble) o singola (simple). Si algo está incluido, es compreso y concuerda: la colazione è compresa.',
          examples: [
            {
              target: 'Vorrei prenotare una camera doppia.',
              base: 'Quisiera reservar una habitación doble.',
            },
            { target: 'La colazione è compresa?', base: '¿El desayuno está incluido?' },
          ],
        },
        takeaways: ['Reservás con vorrei prenotare…', 'Preguntás qué está compreso.'],
        exercises: [
          ex.translationChoice(
            'prenotare',
            'reservar',
            ['prestar', 'pagar', 'preguntar'],
            ['it-prenotare'],
            { id: 'it.ex.8hmqdk2pp2aqhg' },
          ),
          ex.matchPairs(
            [
              ['camera doppia', 'habitación doble'],
              ['camera singola', 'habitación simple'],
              ['prenotare', 'reservar'],
              ['compreso', 'incluido'],
            ],
            ['it-camera-doppia', 'it-camera-singola', 'it-prenotare', 'it-compreso'],
            { id: 'it.ex.80br9n1golul2r' },
          ),
          ex.listenChoice(
            'Vorrei prenotare una camera doppia.',
            [
              'Vorrei prenotare una camera singola.',
              'Ho prenotato una camera doppia.',
              'Vorrei prenotare un tavolo.',
            ],
            ['it-prenotare', 'it-camera-doppia'],
            { id: 'it.ex.37jowyedbxuhup' },
          ),
          ex.fillBlank(
            'Ho ___ una camera per due notti.',
            'Reservé una habitación por dos noches.',
            'prenotato',
            ['prenotare', 'pagare', 'compreso'],
            ['it-ho-prenotato'],
            {
              id: 'it.ex.cy946blqogruid',
            },
          ),
          ex.fillBlank(
            'La colazione è ___.',
            'El desayuno está incluido.',
            'compresa',
            ['compreso', 'compresi', 'comprese'],
            ['it-compreso', 'it-faccio-colazione'],
            {
              id: 'it.ex.s5yacds1g1evk7',
              explanation: 'Colazione es femenino singular: compresa.',
            },
          ),
          question(
            'it.ex.b9jfokrr7hupaw',
            PRENOTAZIONE,
            '¿Qué quiere reservar la clienta?',
            'Una habitación doble para el viernes y el sábado',
            [
              'Una habitación simple para el sábado',
              'Una mesa para dos',
              'Una habitación doble para una semana',
            ],
            ['it-prenotare', 'it-camera-doppia'],
            'La clienta dice: «Vorrei prenotare una camera doppia per venerdì e sabato».',
          ),
          question(
            'it.ex.jjr3iwckr22lc9',
            PRENOTAZIONE,
            '¿Cuánto cuesta la habitación y qué incluye?',
            'Noventa euros por noche, con desayuno',
            [
              'Nueve euros por noche, sin desayuno',
              'Noventa euros las dos noches',
              'Noventa euros, con cena',
            ],
            ['it-compreso'],
            'En el hotel le dicen: «Sono novanta euro a notte, colazione compresa».',
          ),
          ex.shortAnswer(
            'Ha prenotato?',
            '¿Tiene reserva? (Respondé que sí, que reservaste una habitación simple.)',
            'Sì, ho prenotato una camera singola.',
            ['Ho prenotato una camera singola.', 'Sì, una camera singola.'],
            ['it-ho-prenotato', 'it-camera-singola'],
            { id: 'it.ex.255i3m80m5tzdx' },
          ),
          ex.translateWrite(
            'Quisiera reservar una habitación doble.',
            'Vorrei prenotare una camera doppia.',
            ['it-prenotare', 'it-camera-doppia'],
            {
              id: 'it.ex.zkxej12xj9ljy0',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Il primo, il secondo',
        objective: 'Entender el orden del menú italiano.',
        intro: {
          explanation:
            'El menú italiano va en orden: antipasto, primo (pasta o risotto), secondo (carne o pescado), contorno (la guarnición, que se pide aparte) y dolce (el postre). Muchos comen sólo un primo o un secondo.',
          examples: [
            { target: 'Per secondo prendo il pollo.', base: 'De segundo pido el pollo.' },
            { target: 'Come contorno, patate.', base: 'De guarnición, papas.' },
          ],
        },
        takeaways: [
          'Leés un menú: primi, secondi, contorni, dolci.',
          'Pedís un plato de cada parte.',
        ],
        exercises: [
          ex.translationChoice(
            'il contorno',
            'la guarnición',
            ['el entorno', 'la entrada', 'el postre'],
            ['it-il-contorno'],
            {
              id: 'it.ex.ktxy078fyb0qb8',
              explanation:
                'Il contorno es la guarnición (papas, ensalada), que se pide aparte del secondo.',
            },
          ),
          ex.translationChoice(
            'il dolce',
            'el postre',
            ['el dulce de leche', 'el azúcar', 'el segundo plato'],
            ['it-il-dolce'],
            {
              id: 'it.ex.xkeq7eqfhj5l6w',
            },
          ),
          ex.matchPairs(
            [
              ['il primo', 'pasta o risotto'],
              ['il secondo', 'carne o pescado'],
              ['il contorno', 'la guarnición'],
              ['il dolce', 'el postre'],
            ],
            ['it-il-secondo', 'it-il-contorno', 'it-il-dolce'],
            { id: 'it.ex.12rchmf4ph9rpc' },
          ),
          ex.listenChoice(
            'Per secondo prendo il pollo.',
            [
              'Per primo prendo il risotto.',
              'Per secondo prendo il pesce.',
              'Per dolce prendo il tiramisù.',
            ],
            ['it-il-secondo'],
            { id: 'it.ex.t01gkxrrpnrcwc' },
          ),
          ex.fillBlank(
            'Come ___ prendo le patate.',
            'De guarnición pido papas.',
            'contorno',
            ['secondo', 'dolce', 'conto'],
            ['it-il-contorno'],
            {
              id: 'it.ex.gx9es6zdjil3nx',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.34cg4zlacwv49u',
            MENU,
            '¿Qué hay de primer plato?',
            'Espaguetis con tomate o risotto con hongos',
            ['Pollo al horno o pescado del día', 'Papas o ensalada', 'Tiramisú o panna cotta'],
            ['it-il-primo'],
            'La carta dice: «Primi: spaghetti al pomodoro, risotto ai funghi».',
          ),
          question(
            'it.ex.60osfzj65wv59l',
            MENU,
            '¿Qué dice la carta del cubierto y del servicio?',
            'El cubierto cuesta 2 euros y el servicio está incluido',
            [
              'No hay cubierto',
              'El servicio cuesta 2 euros aparte',
              'El cubierto está incluido en el postre',
            ],
            ['it-coperto', 'it-compreso'],
            'La carta dice: «Coperto: 2 euro. Servizio compreso».',
          ),
          ex.shortAnswer(
            'Prende un dolce?',
            '¿Va a pedir postre? (Respondé que sí, un tiramisú.)',
            'Sì, un tiramisù.',
            [
              'Sì, prendo un tiramisù.',
              'Un tiramisù, per favore.',
              'Prendo un tiramisù.',
              'Sì, un tiramisù, per favore.',
            ],
            ['it-il-dolce', 'it-prendo'],
            { id: 'it.ex.412xc3alf3o3pg' },
          ),
          ex.translateWrite(
            'De postre, un helado.',
            'Per dolce, un gelato.',
            ['it-il-dolce', 'it-gelato'],
            {
              id: 'it.ex.r0k3vj5x6txfiy',
              acceptedAnswers: [
                'Come dolce, un gelato.',
                'Per dolce un gelato.',
                'Come dolce un gelato.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Mi porta…? Potrei…?',
        objective: 'Pedir con cortesía tratando de usted.',
        intro: {
          explanation:
            'Al mozo se le habla de Lei (usted), con el verbo en tercera persona: mi porta il conto? (¿me trae la cuenta?). Para pedir con cortesía: potrei avere…? o posso avere…? Y ojo: il burro es la manteca; el burro, el animal, es l’asino.',
          examples: [
            { target: 'Mi porta il conto, per favore?', base: '¿Me trae la cuenta, por favor?' },
            { target: 'Potrei avere un’acqua?', base: '¿Podría tomar un agua?' },
          ],
        },
        takeaways: [
          'Pedís con mi porta…?, potrei avere…? y posso avere…?',
          'Sabés que burro es «manteca».',
        ],
        exercises: [
          ex.translationChoice(
            'burro',
            'manteca',
            ['burro (el animal)', 'queso', 'pan'],
            ['it-burro'],
            {
              id: 'it.ex.6bopdzf8udp9i2',
              explanation: 'Falso amigo: il burro es la manteca.',
            },
          ),
          ex.translationChoice('potrei', 'podría', ['puedo', 'pude', 'quiero'], ['it-potrei'], {
            id: 'it.ex.7v0cd6v6qjb8yx',
          }),
          ex.listenChoice(
            'Mi porta il conto, per favore?',
            [
              'Mi porta un caffè, per favore?',
              'Ecco il conto, prego.',
              'Mi porta un dolce, per favore?',
            ],
            ['it-mi-porta', 'it-il-conto'],
            { id: 'it.ex.fikemzapc95es1' },
          ),
          ex.fillBlank(
            'Mi porta il ___, per favore?',
            '¿Me trae la cuenta, por favor?',
            'conto',
            ['coperto', 'contorno', 'burro'],
            ['it-mi-porta', 'it-il-conto'],
            {
              id: 'it.ex.81oruvrrsn3sdt',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            'Pane e ___, per favore.',
            'Pan y manteca, por favor.',
            'burro',
            ['latte', 'zucchero', 'dolce'],
            ['it-burro'],
            {
              id: 'it.ex.iyh1vs4tj4zgei',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.qlov3dua1gk80r',
            TAVOLO,
            '¿Qué pide la clienta para comer?',
            'Un primer plato: espaguetis',
            ['Un segundo: pollo', 'Sólo pan y manteca', 'Un postre'],
            ['it-il-primo'],
            'La clienta dice: «Per me un primo, gli spaghetti».',
          ),
          question(
            'it.ex.n7fwkhbsvmuj2t',
            TAVOLO,
            '¿Qué más le pide al mozo?',
            'Un poco de pan y manteca',
            ['La cuenta', 'Más espaguetis', 'Un burro'],
            ['it-mi-porta', 'it-burro'],
            'La clienta dice: «mi porta anche un po’ di pane e burro?».',
          ),
          question(
            'it.ex.xuieuutzxncxhy',
            TAVOLO,
            '¿Qué quiere tomar?',
            'Agua con gas',
            ['Agua sin gas', 'Vino', 'Un café'],
            ['it-potrei', 'it-acqua', 'it-posso-avere'],
            'La clienta pregunta: «Potrei avere un’acqua frizzante?».',
          ),
          ex.shortAnswer(
            'Desidera?',
            '¿Qué desea? (Pedile la cuenta al mozo con cortesía.)',
            'Mi porta il conto, per favore?',
            [
              'Il conto, per favore.',
              'Potrei avere il conto, per favore?',
              'Posso avere il conto, per favore?',
              'Mi porta il conto?',
            ],
            ['it-mi-porta', 'it-il-conto'],
            { id: 'it.ex.i1cvj4l8as5dh9' },
          ),
          ex.translateWrite(
            '¿Podría tomar un café?',
            'Potrei avere un caffè?',
            ['it-potrei', 'it-caffe'],
            {
              id: 'it.ex.uvexstsevujlkb',
              acceptedAnswers: ['Potrei avere un caffè, per favore?', 'Posso avere un caffè?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Il coperto e la mancia',
        objective: 'Entender la cuenta y pagar.',
        intro: {
          explanation:
            'En la cuenta italiana suele aparecer il coperto, un cargo fijo por persona (como el cubierto en la Argentina). La mancia (propina) no es obligatoria. Se paga in contanti (en efectivo) o con la carta (con tarjeta).',
          examples: [
            { target: 'Il coperto costa due euro.', base: 'El cubierto cuesta dos euros.' },
            { target: 'Posso pagare con la carta?', base: '¿Puedo pagar con tarjeta?' },
          ],
        },
        takeaways: [
          'Entendés il coperto y la mancia.',
          'Decís cómo pagás: in contanti, con la carta.',
        ],
        exercises: [
          ex.translationChoice(
            'la mancia',
            'la propina',
            ['la mancha', 'la manga', 'la cuenta'],
            ['it-mancia'],
            { id: 'it.ex.setyxc2b9evv5z' },
          ),
          ex.translationChoice(
            'in contanti',
            'en efectivo',
            ['con tarjeta', 'en cuotas', 'a crédito'],
            ['it-in-contanti'],
            {
              id: 'it.ex.mwvmaf0qlwastf',
            },
          ),
          ex.listenChoice(
            'Posso pagare con la carta?',
            ['Posso pagare in contanti?', 'Posso avere la carta?', 'Pago con la carta.'],
            ['it-con-la-carta', 'it-pagare'],
            { id: 'it.ex.izmihdw59615my' },
          ),
          ex.fillBlank(
            'Pago ___ contanti.',
            'Pago en efectivo.',
            'in',
            ['con', 'per', 'a'],
            ['it-in-contanti'],
            { id: 'it.ex.redj52ezyy63zd' },
          ),
          ex.fillBlank(
            'Nel conto c’è anche il ___.',
            'En la cuenta está también el cubierto.',
            'coperto',
            ['contorno', 'dolce', 'burro'],
            ['it-coperto', 'it-il-conto'],
            {
              id: 'it.ex.9j6yrlwm0ckp0l',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.6t7ivhd1dccgw5',
            RECENSIONE,
            '¿Qué opina Valeria de la comida y del mozo?',
            'La comida, riquísima; el mozo, muy simpático',
            [
              'La comida, cara; el mozo, antipático',
              'La comida, normal; el mozo, lento',
              'No habla de la comida',
            ],
            ['it-simpatico'],
            'Valeria escribe: «Il cibo è buonissimo e il cameriere è molto simpatico».',
          ),
          question(
            'it.ex.7iu7pnwlu7jzfi',
            RECENSIONE,
            '¿Qué dice de la propina?',
            'Que en Italia no es obligatoria, pero ellos la dejaron',
            [
              'Que es obligatoria y la dejaron',
              'Que no la dejaron',
              'Que está incluida en el cubierto',
            ],
            ['it-mancia'],
            'Valeria escribe: «La mancia? In Italia non è obbligatoria, ma noi l’abbiamo lasciata!».',
          ),
          question(
            'it.ex.vpevygje2m5aks',
            PRENOTAZIONE,
            '¿Cómo quiere pagar la clienta del hotel?',
            'Con tarjeta',
            ['En efectivo', 'Por transferencia', 'Todavía no sabe'],
            ['it-con-la-carta'],
            'La clienta pregunta: «Posso pagare con la carta?».',
          ),
          ex.shortAnswer(
            'Paga in contanti?',
            '¿Paga en efectivo? (Respondé que no, que con tarjeta.)',
            'No, con la carta.',
            ['No, pago con la carta.', 'Con la carta.', 'No, con la carta, per favore.'],
            ['it-con-la-carta'],
            { id: 'it.ex.mg58wahdibg05r' },
          ),
          ex.translateWrite(
            '¿Puedo pagar en efectivo?',
            'Posso pagare in contanti?',
            ['it-in-contanti', 'it-pagare'],
            { id: 'it.ex.4m0clonfaugscn' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'In albergo e al ristorante',
        objective: 'Resolver una reserva y una comida de principio a fin.',
        intro: {
          explanation:
            'Repasá todo el recorrido: reservar (ho prenotato un tavolo), pedir (per me un primo, mi porta…?), y pagar (il conto, con la carta). En el hotel: una camera singola o doppia, con la colazione compresa.',
          examples: [
            { target: 'Ho prenotato un tavolo per due.', base: 'Reservé una mesa para dos.' },
            {
              target: 'Vorrei una camera singola, per favore.',
              base: 'Quisiera una habitación simple, por favor.',
            },
          ],
        },
        takeaways: ['Hacés una reserva completa.', 'Entendés una reseña de un restaurante.'],
        exercises: [
          ex.fillBlank(
            'Vorrei una camera ___ per una persona.',
            'Quisiera una habitación simple para una persona.',
            'singola',
            ['doppia', 'compresa', 'grande'],
            ['it-camera-singola'],
            {
              id: 'it.ex.mor68vjxzkuxch',
              skill: 'vocabulary',
            },
          ),
          ex.translationChoice(
            'compreso',
            'incluido',
            ['comprado', 'comprendido (entendido)', 'caro'],
            ['it-compreso'],
            { id: 'it.ex.xf0idol50alg66' },
          ),
          ex.listenChoice(
            'La colazione è compresa?',
            ['La colazione è buona?', 'Il servizio è compreso?', 'La camera è doppia?'],
            ['it-compreso'],
            { id: 'it.ex.jot429lqv9qfun' },
          ),
          question(
            'it.ex.4m9u20jf2kefnl',
            RECENSIONE,
            '¿Cuánto pagaron Valeria y su acompañante?',
            '60 euros entre los dos, con el cubierto',
            ['60 euros cada uno', '60 euros más el cubierto', '16 euros en total'],
            ['it-coperto', 'it-il-conto'],
            'Valeria escribe: «Il conto: 60 euro in due, con il coperto».',
          ),
          question(
            'it.ex.lj0iqy9h2abgio',
            PRENOTAZIONE,
            '¿Qué tiene de especial la habitación del hotel?',
            'Tiene vista al mar',
            ['Es simple', 'Tiene cocina', 'Es la más barata'],
            ['it-camera-doppia'],
            'En el hotel dicen: «abbiamo una camera con vista sul mare».',
          ),
          ex.orderWords(
            'La colazione è compresa nel prezzo?',
            '¿El desayuno está incluido en el precio?',
            ['it-compreso'],
            {
              id: 'it.ex.sdnqsvo8sdx0vg',
            },
          ),
          ex.shortAnswer(
            'Quante notti?',
            '¿Cuántas noches? (Respondé que dos noches, viernes y sábado.)',
            'Due notti, venerdì e sabato.',
            ['Due notti.', 'Due notti: venerdì e sabato.', 'Per due notti, venerdì e sabato.'],
            ['it-due', 'it-venerdi'],
            { id: 'it.ex.blvy06fninh69i' },
          ),
          ex.translateWrite(
            'Reservé una mesa para dos.',
            'Ho prenotato un tavolo per due.',
            ['it-ho-prenotato', 'it-tavolo'],
            { id: 'it.ex.v06p437naqd5oy' },
          ),
        ],
      },
    ],
  },
};

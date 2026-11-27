import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U5 «Economía, consumo y finanzas cotidianas» (docs/B2_EN.md): ahorros, préstamos y deudas;
 * gastar menos (cut back on, second-hand, subscription); consumidores, marcas y precios (bargain,
 * rip-off, overpriced). Estructuras: la causativa (have / get something done) y la comparación
 * avanzada (by far, twice as … as, nowhere near as … as, the …-er, the …-er).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const REPAIR = dialogue('en.stim.b2-u5-repair', 'Un cliente en un local que arregla teléfonos.', [
  ['Customer', "Hi. I dropped my phone yesterday and I'd like to have the screen replaced."],
  [
    'Assistant',
    "Let me see. Yes, we can do that. It's ninety dollars, and it'll be ready tomorrow.",
  ],
  ['Customer', "Ninety? That's twice as much as I paid last time!"],
  [
    'Assistant',
    'Last time you had a cheaper screen put in. This one is original. The cheaper ones are nowhere near as good.',
  ],
  ['Customer', 'Hmm. Is it worth it? The phone is three years old.'],
  [
    'Assistant',
    'Honestly, the older the phone, the less sense it makes. A new one costs about four hundred.',
  ],
  ['Customer', "I can't afford a new one right now. Go ahead and replace the screen, please."],
]);

const SAVINGS = reading(
  'en.stim.b2-u5-savings',
  'post',
  'Una publicación de un blog sobre cómo ahorrar.',
  [
    'Last January I looked at my bank account and realized I had no savings at all. So I decided to change a few things.',
    'First, I cut back on subscriptions. I was paying for four streaming services and a gym I never went to. Canceling them saved me sixty dollars a month.',
    'Second, I started buying second-hand clothes and furniture. Most of it is in perfect condition and costs half the price.',
    'Third, before buying anything, I ask myself one question: is this good value for money, or do I just want it?',
    'One year later, I have saved three thousand dollars. It was by far the best decision I made last year.',
  ],
  { title: 'How I saved $3,000 in a year' },
);

const FLATMATES = dialogue(
  'en.stim.b2-u5-flatmates',
  'Dos amigos que comparten apartamento hablan de dinero.',
  [
    ['Jake', "I'm thinking of taking out a loan to buy a car."],
    ['Rita', 'Are you sure? You still have debt on your credit card.'],
    ['Jake', 'I know, but the bank is offering a low interest rate at the moment.'],
    ['Rita', 'Low now, but it could rise. And can you really afford the monthly payments?'],
    ['Jake', 'If I cut back on eating out, I think so.'],
    [
      'Rita',
      "Why not buy a second-hand car instead? You'd need a much smaller loan, or no loan at all.",
    ],
    ['Jake', "That's actually a good idea. I'll have a mechanic check a few cars this weekend."],
  ],
);

const REVIEWS = reading(
  'en.stim.b2-u5-reviews',
  'post',
  'Dos opiniones de clientes sobre unos auriculares en una tienda online.',
  [
    '★★★★★ "A real bargain." I bought these on sale for thirty dollars. They are nowhere near as famous as the big brands, but the sound is just as good. Great value for money.',
    '★☆☆☆☆ "Total rip-off." I paid two hundred dollars because of the brand name, and they broke after a month. The more you pay, the better the quality? Not here. Completely overpriced.',
    'Reply from the shop: We are sorry to hear this. Please send us your receipt and we will have the headphones repaired or replaced.',
  ],
  { title: 'Customer reviews' },
);

export const EN_B2_U05: B2UnitDef = {
  names: ['Jake', 'Rita', 'Customer', 'Assistant'],
  support: [
    'original',
    'hmm',
    'worth',
    'sense',
    'ahead',
    'streaming',
    'services',
    'canceling',
    'furniture',
    'perfect',
    'condition',
    'myself',
    'credit',
    'offering',
    'monthly',
    'payments',
    'sale',
    'total',
    'completely',
    'repair',
    'let',
    'yourself',
    'review',
    'hairdresser',
  ],
  unit: {
    position: 5,
    title: 'Economía, consumo y finanzas',
    titleEn: 'Money, shopping and everyday finance',
    description:
      'Ahorros, préstamos y deudas, gastar menos, marcas y precios, have something done y comparaciones como twice as… as o nowhere near as… as.',
    emoji: '💳',
    objective:
      'Puedes hablar de tu economía, comparar precios con matices y explicar que mandas a hacer o arreglar algo.',
    grammar: {
      title: 'Have something done y comparación avanzada',
      explanation:
        'Have / get + objeto + participio: otra persona hace algo por ti (I had my screen replaced = me cambiaron la pantalla; no la cambiaste tú). Para comparar con matices: by far + superlativo (by far the best), twice / three times as … as (el doble de…), nowhere near as … as (ni de cerca tan… como) y the …-er, the …-er (cuanto más…, más…).',
      examples: [
        {
          target: "I'd like to have the screen replaced.",
          base: 'Quisiera que me cambiaran la pantalla.',
        },
        {
          target: "That's twice as much as I paid last time!",
          base: '¡Es el doble de lo que pagué la última vez!',
        },
        {
          target: 'It was by far the best decision I made last year.',
          base: 'Fue por lejos la mejor decisión que tomé el año pasado.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-afford',
        'afford',
        'permitirse (pagar algo)',
        '/əˈfɔrd/',
        '💸',
        "I can't afford a new car right now.",
        'Ahora no me puedo permitir un auto nuevo.',
        ['money', 'verbs'],
        ['permitirse', 'alcanzar para pagar'],
      ),
      w(
        'en-savings',
        'savings',
        'ahorros',
        '/ˈseɪvɪŋz/',
        '🐷',
        'I have used all my savings.',
        'Usé todos mis ahorros.',
        ['money'],
      ),
      w(
        'en-loan',
        'loan',
        'préstamo',
        '/loʊn/',
        '🏦',
        'She took out a loan to buy a flat.',
        'Pidió un préstamo para comprarse un apartamento.',
        ['money'],
      ),
      w(
        'en-debt',
        'debt',
        'deuda',
        '/dɛt/',
        undefined,
        'He is still paying off his debt.',
        'Todavía está pagando su deuda.',
        ['money'],
      ),
      w(
        'en-interest-rate',
        'interest rate',
        'tasa de interés',
        '/ˈɪntrəst ˌreɪt/',
        '📈',
        'The bank offers a low interest rate.',
        'El banco ofrece una tasa de interés baja.',
        ['money'],
        ['interés'],
      ),
      w(
        'en-cut-back-on',
        'cut back on',
        'gastar menos en / reducir',
        '/ˈkʌt ˈbæk ɑn/',
        '✂️',
        'We need to cut back on eating out.',
        'Tenemos que gastar menos en comer afuera.',
        ['money', 'phrasal-verbs'],
        ['reducir', 'recortar'],
      ),
      w(
        'en-subscription',
        'subscription',
        'suscripción',
        '/səbˈskrɪpʃən/',
        '📺',
        'I canceled two subscriptions last month.',
        'El mes pasado cancelé dos suscripciones.',
        ['money', 'shopping'],
      ),
      w(
        'en-second-hand',
        'second-hand',
        'de segunda mano / usado',
        '/ˌsɛkənd ˈhænd/',
        '♻️',
        'I bought a second-hand bike for fifty dollars.',
        'Compré una bici usada por cincuenta dólares.',
        ['shopping', 'adjectives'],
        ['de segunda mano', 'usado'],
        ['second hand', 'secondhand'],
      ),
      w(
        'en-bargain',
        'bargain',
        'ganga / oferta',
        '/ˈbɑrɡən/',
        '🏷️',
        'Thirty dollars? That is a real bargain!',
        '¿Treinta dólares? ¡Es una verdadera ganga!',
        ['shopping'],
        ['ganga', 'buena compra'],
      ),
      w(
        'en-have-something-done',
        'have something done',
        'mandar a hacer algo / que te hagan algo',
        '/ˈhæv ˌsʌmθɪŋ ˈdʌn/',
        '🔧',
        'I had my phone repaired last week.',
        'La semana pasada me arreglaron el teléfono.',
        ['causative'],
        ['mandar a hacer algo', 'que te hagan algo'],
      ),
      w(
        'en-by-far',
        'by far',
        'por lejos / con diferencia',
        '/baɪ ˈfɑr/',
        undefined,
        'It was by far the best decision I made.',
        'Fue por lejos la mejor decisión que tomé.',
        ['comparison'],
        ['por lejos', 'con diferencia'],
      ),
      w(
        'en-twice-as',
        'twice as',
        'el doble de / dos veces más',
        '/ˈtwaɪs æz/',
        '✖️',
        'This phone is twice as expensive as that one.',
        'Este teléfono es el doble de caro que ese.',
        ['comparison'],
        ['el doble de', 'dos veces más'],
      ),
      w(
        'en-nowhere-near',
        'nowhere near',
        'ni de cerca / ni por asomo',
        '/ˈnoʊˌwɛr ˈnɪr/',
        undefined,
        'The cheap ones are nowhere near as good.',
        'Los baratos no son ni de cerca tan buenos.',
        ['comparison'],
        ['ni de cerca', 'ni por asomo'],
      ),
      w(
        'en-value-for-money',
        'value for money',
        'buena relación calidad-precio',
        '/ˈvælju fər ˈmʌni/',
        '👍',
        'This restaurant is great value for money.',
        'Este restaurante tiene una relación calidad-precio excelente.',
        ['shopping', 'collocations'],
        ['relación calidad-precio', 'calidad-precio'],
      ),
      w(
        'en-consumer',
        'consumer',
        'consumidor / consumidora',
        '/kənˈsumər/',
        '🛒',
        'Consumers want cheaper and better products.',
        'Los consumidores quieren productos más baratos y mejores.',
        ['shopping'],
        ['consumidor', 'consumidora'],
      ),
      w(
        'en-brand',
        'brand',
        'marca',
        '/brænd/',
        undefined,
        'I never buy expensive brands.',
        'Nunca compro marcas caras.',
        ['shopping'],
      ),
      w(
        'en-rip-off',
        'rip-off',
        'robo / estafa (precio abusivo)',
        '/ˈrɪp ˌɔf/',
        '😤',
        'Ten dollars for a coffee? What a rip-off!',
        '¿Diez dólares por un café? ¡Qué robo!',
        ['shopping'],
        ['robo', 'estafa'],
        ['rip off', 'ripoff'],
      ),
      w(
        'en-overpriced',
        'overpriced',
        'demasiado caro / sobrevaluado',
        '/ˌoʊvərˈpraɪst/',
        undefined,
        'The food was good, but overpriced.',
        'La comida era buena, pero demasiado cara.',
        ['shopping', 'adjectives'],
        ['demasiado caro', 'sobrevaluado', 'carísimo'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Me lo puedo permitir?',
        objective: 'Hablar de ahorros, préstamos y deudas.',
        intro: {
          explanation:
            'Afford es poder permitirse algo: I can’t afford it (no me alcanza). Savings son los ahorros; a loan, un préstamo (take out a loan = pedir un préstamo); debt, una deuda. The interest rate es la tasa de interés.',
          examples: [
            {
              target: "I can't afford a new car right now.",
              base: 'Ahora no me puedo permitir un auto nuevo.',
            },
            {
              target: 'She took out a loan to buy a flat.',
              base: 'Pidió un préstamo para comprarse un apartamento.',
            },
          ],
        },
        takeaways: [
          'Dices si puedes permitirte algo con afford.',
          'Hablas de ahorros, préstamos, deudas e intereses.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['savings', 'ahorros'],
              ['loan', 'préstamo'],
              ['debt', 'deuda'],
              ['interest rate', 'tasa de interés'],
            ],
            ['en-savings', 'en-loan', 'en-debt', 'en-interest-rate'],
            { id: 'en.ex.mag7tzcve5xdeu' },
          ),
          ex.fillBlank(
            "I can't ___ a new car right now.",
            'Ahora no me puedo permitir un auto nuevo.',
            'afford',
            ['spend', 'pay', 'save'],
            ['en-afford'],
            {
              id: 'en.ex.2vmnk0d6lklt4j',
              skill: 'vocabulary',
              explanation: 'Afford + cosa: poder pagarla (casi siempre con can / can’t).',
            },
          ),
          ex.fillBlank(
            'She took ___ a loan to buy a flat.',
            'Pidió un préstamo para comprarse un apartamento.',
            'out',
            ['on', 'up', 'off'],
            ['en-loan'],
            {
              id: 'en.ex.ubeyuy70e6a69z',
              skill: 'vocabulary',
              explanation: 'Take out a loan: pedir un préstamo.',
            },
          ),
          question(
            'en.ex.mnxwddbu0nkxmk',
            FLATMATES,
            '¿Por qué duda Rita de que Jake pida un préstamo?',
            'Porque Jake todavía tiene deuda en la tarjeta de crédito',
            ['Porque el banco no le presta', 'Porque Jake no maneja', 'Porque los autos son caros'],
            ['en-debt', 'en-loan'],
            'Rita dice: «You still have debt on your credit card».',
          ),
          question(
            'en.ex.j0a3jtfou3sb4f',
            FLATMATES,
            '¿Qué advierte Rita sobre la tasa de interés?',
            'Que ahora es baja, pero podría subir',
            ['Que es muy alta', 'Que nunca cambia', 'Que no importa'],
            ['en-interest-rate', 'en-afford', 'en-cut-back-on'],
            'Rita dice: «Low now, but it could rise. And can you really afford the monthly payments?».',
          ),
          ex.listenChoice(
            'He is still paying off his debt.',
            [
              'He has finished paying off his debt.',
              'She is still paying off her debt.',
              'He is still paying off his loan.',
            ],
            ['en-debt'],
            { id: 'en.ex.40ko16176tw9px' },
          ),
          ex.orderWords('I have used all my savings.', 'Usé todos mis ahorros.', ['en-savings'], {
            id: 'en.ex.zfvt2r1l3x71gy',
          }),
          ex.shortAnswer(
            'Are you going to buy the new phone? (no, no te lo puedes permitir)',
            '¿Te vas a comprar el teléfono nuevo?',
            "No, I can't afford it.",
            ['No, I cannot afford it.', "I can't afford it.", "No. I can't afford it."],
            ['en-afford'],
            { id: 'en.ex.bur1jlm5bmjy45' },
          ),
          ex.translateWrite(
            'El banco ofrece una tasa de interés baja.',
            'The bank offers a low interest rate.',
            ['en-interest-rate'],
            {
              id: 'en.ex.1dfc5thp8jbpbn',
              acceptedAnswers: [
                'The bank is offering a low interest rate.',
                'The bank has a low interest rate.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Gastar menos',
        objective: 'Contar cómo ahorrar: recortar gastos, comprar usado y buscar ofertas.',
        intro: {
          explanation:
            'Cut back on es gastar menos en algo: cut back on subscriptions. Second-hand es de segunda mano, usado. A bargain es una ganga. Para contar lo que hiciste para ahorrar usas el present perfect o el past simple, como siempre.',
          examples: [
            {
              target: 'We need to cut back on eating out.',
              base: 'Tenemos que gastar menos en comer afuera.',
            },
            {
              target: 'I bought a second-hand bike for fifty dollars.',
              base: 'Compré una bici usada por cincuenta dólares.',
            },
          ],
        },
        takeaways: [
          'Cuentas en qué gastas menos con cut back on.',
          'Hablas de compras usadas y de gangas.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['cut back on', 'gastar menos en / reducir'],
              ['subscription', 'suscripción'],
              ['second-hand', 'de segunda mano / usado'],
              ['bargain', 'ganga / oferta'],
            ],
            ['en-cut-back-on', 'en-subscription', 'en-second-hand', 'en-bargain'],
            { id: 'en.ex.t3x0sxunonyneq' },
          ),
          ex.fillBlank(
            'We need to cut back ___ eating out.',
            'Tenemos que gastar menos en comer afuera.',
            'on',
            ['in', 'of', 'at'],
            ['en-cut-back-on'],
            { id: 'en.ex.iaruotvyqhp0u5', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Thirty dollars? That is a real ___!',
            '¿Treinta dólares? ¡Es una verdadera ganga!',
            'bargain',
            ['debt', 'loan', 'price'],
            ['en-bargain'],
            { id: 'en.ex.n8yv6743xibgs3', skill: 'vocabulary' },
          ),
          question(
            'en.ex.nj2zk3fi8ppvb6',
            SAVINGS,
            '¿Qué hizo primero la autora para ahorrar?',
            'Cancelar suscripciones que no usaba',
            ['Pedir un préstamo', 'Cambiar de trabajo', 'Vender su auto'],
            ['en-cut-back-on', 'en-subscription'],
            'Escribe: «First, I cut back on subscriptions… Canceling them saved me sixty dollars a month».',
          ),
          question(
            'en.ex.1rp12g4wffpe0t',
            SAVINGS,
            '¿Qué se pregunta antes de comprar algo?',
            'Si vale lo que cuesta o si sólo lo quiere',
            ['Si es de una buena marca', 'Si lo puede pagar en cuotas', 'Si está de moda'],
            ['en-value-for-money'],
            'Escribe: «is this good value for money, or do I just want it?».',
          ),
          question(
            'en.ex.jn27axrbxkpjz0',
            SAVINGS,
            '¿Qué opina de la ropa y los muebles usados?',
            'Casi todo está perfecto y cuesta la mitad',
            ['Que son de mala calidad', 'Que son caros', 'Que no los recomienda'],
            ['en-second-hand'],
            'Escribe: «Most of it is in perfect condition and costs half the price».',
          ),
          ex.listenChoice(
            'I canceled two subscriptions last month.',
            [
              'I canceled three subscriptions last month.',
              'I started two subscriptions last month.',
              'I canceled two subscriptions this month.',
            ],
            ['en-subscription'],
            { id: 'en.ex.3wiuu7zqq51o8t' },
          ),
          ex.orderWords(
            'I bought a second-hand bike for fifty dollars.',
            'Compré una bici usada por cincuenta dólares.',
            ['en-second-hand'],
            { id: 'en.ex.0ld1qp5mry6636' },
          ),
          ex.shortAnswer(
            'How do you save money? (gastas menos en ropa)',
            '¿Cómo ahorras?',
            'I cut back on clothes.',
            [
              'I cut back on buying clothes.',
              "I'm cutting back on clothes.",
              'I spend less on clothes.',
            ],
            ['en-cut-back-on'],
            { id: 'en.ex.c6xm8ggd7p22r2' },
          ),
          ex.translateWrite(
            '¿Treinta dólares? ¡Es una verdadera ganga!',
            'Thirty dollars? That is a real bargain!',
            ['en-bargain'],
            {
              id: 'en.ex.s7fju05q8w48l7',
              acceptedAnswers: [
                "Thirty dollars? That's a real bargain!",
                "Thirty dollars? It's a real bargain!",
                'Thirty dollars? It is a real bargain!',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Mandar a hacer',
        objective: 'Explicar que otra persona te hace o te arregla algo: have something done.',
        intro: {
          explanation:
            'Have / get + objeto + participio: alguien hace algo por ti. I had my phone repaired (me arreglaron el teléfono, no lo arreglé yo). I’m going to get my hair cut (me voy a cortar el pelo, en la peluquería). Compara: I repaired my phone = lo arreglé yo.',
          examples: [
            {
              target: 'I had my phone repaired last week.',
              base: 'La semana pasada me arreglaron el teléfono.',
            },
            {
              target: "I'd like to have the screen replaced.",
              base: 'Quisiera que me cambiaran la pantalla.',
            },
          ],
        },
        takeaways: [
          'Cuentas lo que te hacen con have / get + objeto + participio.',
          'Distingues I had it repaired de I repaired it.',
        ],
        exercises: [
          ex.fillBlank(
            'I had my phone ___ last week.',
            'La semana pasada me arreglaron el teléfono.',
            'repaired',
            ['repair', 'repairing', 'to repair'],
            ['en-have-something-done'],
            { id: 'en.ex.p7lq6r0psl4l64', explanation: 'Have + objeto + participio (repaired).' },
          ),
          ex.fillBlank(
            "I'm going to get my hair ___ tomorrow.",
            'Mañana me voy a cortar el pelo.',
            'cut',
            ['cutting', 'to cut', 'cuts'],
            ['en-have-something-done'],
            { id: 'en.ex.7uwnek3s4w9btx', explanation: 'Cut es irregular: el participio es cut.' },
          ),
          ex.fillBlank(
            'We are having our kitchen ___ next month.',
            'El mes que viene nos van a pintar la cocina.',
            'painted',
            ['paint', 'painting', 'to paint'],
            ['en-have-something-done'],
            { id: 'en.ex.1ubttqlitw97yj' },
          ),
          question(
            'en.ex.bgyh5qefv71g62',
            REPAIR,
            '¿Qué quiere el cliente?',
            'Que le cambien la pantalla del teléfono',
            [
              'Comprar un teléfono nuevo',
              'Que le devuelvan el dinero',
              'Arreglar la pantalla él mismo',
            ],
            ['en-have-something-done', 'en-nowhere-near'],
            'El cliente dice: «I’d like to have the screen replaced».',
          ),
          question(
            'en.ex.7s22qls9zd3sin',
            FLATMATES,
            '¿Qué va a hacer Jake este fin de semana?',
            'Hacer que un mecánico revise algunos autos',
            ['Revisar él mismo los autos', 'Pedir el préstamo', 'Vender su auto'],
            ['en-have-something-done', 'en-second-hand'],
            'Jake dice: «I’ll have a mechanic check a few cars this weekend». Have + persona + verbo: otra persona lo hace.',
          ),
          ex.listenChoice(
            'I had my phone repaired last week.',
            [
              'I repaired my phone last week.',
              'I had my phone repaired last month.',
              'I have my phone repaired every year.',
            ],
            ['en-have-something-done'],
            { id: 'en.ex.xzbtzsvinpc78w' },
          ),
          ex.orderWords(
            'I would like to have the screen replaced.',
            'Quisiera que me cambiaran la pantalla.',
            ['en-have-something-done', 'en-replace'],
            { id: 'en.ex.10i9fqulv3d1nc' },
          ),
          ex.shortAnswer(
            'Your hair looks great! Did you cut it yourself? (no, te lo cortaron en la peluquería)',
            '¡Qué lindo pelo! ¿Te lo cortaste tú?',
            'No, I had it cut at the hairdresser.',
            [
              "No, I had it cut at the hairdresser's.",
              'No, I got it cut at the hairdresser.',
              'No, I had it cut.',
            ],
            ['en-have-something-done'],
            { id: 'en.ex.hc1tch1u1nvrq4' },
          ),
          ex.translateWrite(
            'La semana pasada me arreglaron el teléfono.',
            'I had my phone repaired last week.',
            ['en-have-something-done'],
            {
              id: 'en.ex.1aw6on8f2a7y4i',
              acceptedAnswers: [
                'I got my phone repaired last week.',
                'Last week I had my phone repaired.',
                'I had my phone fixed last week.',
                'I got my phone fixed last week.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Comparar con matices',
        objective: 'Comparar precios y calidad: by far, twice as, nowhere near.',
        intro: {
          explanation:
            'By far refuerza un superlativo: by far the best (por lejos el mejor). Twice as … as es el doble: twice as expensive as. Nowhere near as … as es «ni de cerca tan… como». The …-er, the …-er: The older the phone, the less sense it makes (cuanto más viejo, menos sentido tiene). Value for money es la relación calidad-precio.',
          examples: [
            {
              target: 'This phone is twice as expensive as that one.',
              base: 'Este teléfono es el doble de caro que ese.',
            },
            {
              target: 'The cheap ones are nowhere near as good.',
              base: 'Los baratos no son ni de cerca tan buenos.',
            },
          ],
        },
        takeaways: [
          'Comparas con by far, twice as… as y nowhere near as… as.',
          'Hablas de la relación calidad-precio.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['by far', 'por lejos / con diferencia'],
              ['twice as', 'el doble de / dos veces más'],
              ['nowhere near', 'ni de cerca / ni por asomo'],
              ['value for money', 'buena relación calidad-precio'],
            ],
            ['en-by-far', 'en-twice-as', 'en-nowhere-near', 'en-value-for-money'],
            { id: 'en.ex.g17m30izqovy75' },
          ),
          ex.fillBlank(
            'This phone is twice as expensive ___ that one.',
            'Este teléfono es el doble de caro que ese.',
            'as',
            ['than', 'like', 'that'],
            ['en-twice-as'],
            { id: 'en.ex.soyycix4znv5da', explanation: 'Twice as + adjetivo + as (no than).' },
          ),
          ex.fillBlank(
            'It was by ___ the best decision I made.',
            'Fue por lejos la mejor decisión que tomé.',
            'far',
            ['much', 'long', 'more'],
            ['en-by-far'],
            { id: 'en.ex.2725f2abneueln', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'The ___ the phone, the less sense it makes.',
            'Cuanto más viejo es el teléfono, menos sentido tiene.',
            'older',
            ['old', 'oldest', 'more old'],
            ['en-twice-as'],
            {
              id: 'en.ex.yru38dhmhy08he',
              explanation: 'The + comparativo, the + comparativo: cuanto más…, más…',
            },
          ),
          question(
            'en.ex.mtv2u5kbf60c81',
            REPAIR,
            '¿Por qué esta vez la pantalla cuesta el doble?',
            'Porque es original; la última vez le pusieron una más barata',
            [
              'Porque el teléfono es nuevo',
              'Porque la entregan hoy',
              'Porque subieron los precios',
            ],
            ['en-twice-as', 'en-nowhere-near'],
            'El empleado dice: «Last time you had a cheaper screen put in. This one is original. The cheaper ones are nowhere near as good».',
          ),
          question(
            'en.ex.od2lodvttmb5nm',
            SAVINGS,
            '¿Cómo valora la autora su decisión de ahorrar?',
            'Como por lejos la mejor decisión del año pasado',
            ['Como un error', 'Como algo difícil que no repetiría', 'Como una decisión más'],
            ['en-by-far', 'en-savings'],
            'Escribe: «It was by far the best decision I made last year».',
          ),
          ex.listenChoice(
            'The cheap ones are nowhere near as good.',
            [
              'The cheap ones are just as good.',
              'The cheap ones are nowhere near as bad.',
              'The new ones are nowhere near as good.',
            ],
            ['en-nowhere-near'],
            { id: 'en.ex.qhh801jdmyfjhc' },
          ),
          ex.orderWords(
            'This restaurant is great value for money.',
            'Este restaurante tiene una relación calidad-precio excelente.',
            ['en-value-for-money'],
            { id: 'en.ex.0rs7nvinabtbke' },
          ),
          ex.shortAnswer(
            'Is your new flat bigger than the old one? (sí, el doble de grande)',
            '¿Tu apartamento nuevo es más grande que el viejo?',
            'Yes, it is twice as big.',
            [
              "Yes, it's twice as big.",
              'Yes, it is twice as big as the old one.',
              "It's twice as big.",
            ],
            ['en-twice-as'],
            { id: 'en.ex.bd81pyk0repa0j' },
          ),
          ex.translateWrite(
            'Los baratos no son ni de cerca tan buenos.',
            'The cheap ones are nowhere near as good.',
            ['en-nowhere-near'],
            {
              id: 'en.ex.tyqutvoh8x141v',
              acceptedAnswers: [
                'The cheaper ones are nowhere near as good.',
                'Cheap ones are nowhere near as good.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Consumidores exigentes',
        objective: 'Opinar sobre marcas y precios: ganga, robo, demasiado caro.',
        intro: {
          explanation:
            'A consumer es un consumidor. A brand es una marca. Si algo es carísimo para lo que vale, es overpriced; si el precio es abusivo, a rip-off (¡qué robo!). Lo contrario: a bargain o good value for money.',
          examples: [
            {
              target: 'Ten dollars for a coffee? What a rip-off!',
              base: '¿Diez dólares por un café? ¡Qué robo!',
            },
            {
              target: 'The food was good, but overpriced.',
              base: 'La comida era buena, pero demasiado cara.',
            },
          ],
        },
        takeaways: [
          'Opinas sobre marcas y precios como consumidor.',
          'Dices si algo es una ganga, un robo o demasiado caro.',
        ],
        exercises: [
          ex.translationChoice(
            'rip-off',
            'robo / estafa (precio abusivo)',
            ['ganga / oferta', 'marca', 'préstamo'],
            ['en-rip-off'],
            { id: 'en.ex.bwcin2v9ens7gq' },
          ),
          ex.imageChoice('🛒', 'consumer', ['brand', 'loan', 'debt'], ['en-consumer'], {
            id: 'en.ex.mfe3vd6ep5wcpt',
          }),
          ex.fillBlank(
            'The food was good, but ___.',
            'La comida era buena, pero demasiado cara.',
            'overpriced',
            ['second-hand', 'cheap', 'free'],
            ['en-overpriced'],
            { id: 'en.ex.z5xy8a2lptor0r', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I never buy expensive ___.',
            'Nunca compro marcas caras.',
            'brands',
            ['debts', 'loans', 'savings'],
            ['en-brand'],
            { id: 'en.ex.jznba16cj063lh', skill: 'vocabulary' },
          ),
          question(
            'en.ex.lurmf2kure3jfy',
            REVIEWS,
            '¿Por qué el primer cliente está contento?',
            'Pagó poco y suenan tan bien como los de las marcas famosas',
            ['Son de una marca famosa', 'Se los regalaron', 'Le devolvieron el dinero'],
            ['en-bargain', 'en-brand'],
            'Escribe: «They are nowhere near as famous as the big brands, but the sound is just as good».',
          ),
          question(
            'en.ex.k19z5ukp5fupua',
            REVIEWS,
            '¿Qué critica el segundo cliente?',
            'Que pagó mucho por la marca y se rompieron al mes',
            ['Que eran baratos', 'Que tardaron en llegar', 'Que no tenían marca'],
            ['en-rip-off', 'en-overpriced'],
            'Escribe: «I paid two hundred dollars because of the brand name, and they broke after a month… Completely overpriced».',
          ),
          ex.listenChoice(
            'Ten dollars for a coffee? What a rip-off!',
            [
              'Two dollars for a coffee? What a bargain!',
              'Ten dollars for a coffee? What a bargain!',
              'Ten dollars for a cake? What a rip-off!',
            ],
            ['en-rip-off'],
            { id: 'en.ex.9s2y3lfgd6gdfd' },
          ),
          question(
            'en.ex.40pohbxudmwv03',
            REVIEWS,
            '¿Qué ofrece la tienda al cliente enojado?',
            'Arreglarle o cambiarle los auriculares si manda el ticket',
            ['Devolverle el dinero sin ticket', 'Un descuento en otra marca', 'Nada'],
            ['en-have-something-done'],
            'La tienda responde: «Please send us your receipt and we will have the headphones repaired or replaced».',
          ),
          ex.shortAnswer(
            'Did you like the hotel? (era lindo, pero demasiado caro)',
            '¿Te gustó el hotel?',
            'It was nice, but overpriced.',
            [
              'It was nice but overpriced.',
              'It was nice, but it was overpriced.',
              'Yes, but it was overpriced.',
            ],
            ['en-overpriced'],
            { id: 'en.ex.0ipcmt16bdqm3a' },
          ),
          ex.translateWrite(
            '¿Diez dólares por un café? ¡Qué robo!',
            'Ten dollars for a coffee? What a rip-off!',
            ['en-rip-off'],
            {
              id: 'en.ex.um5jbg7mp8b2d0',
              acceptedAnswers: [
                'Ten dollars for a coffee? It is a rip-off!',
                "Ten dollars for a coffee? That's a rip-off!",
                'Ten dollars for one coffee? What a rip-off!',
              ],
            },
          ),
        ],
      },
    ],
  },
};

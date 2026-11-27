import type { ExpansionUnitDef } from '../../a2-expansion';
import { ex } from '../../builders';
import { dialogue, question, reading } from './context-helpers';
import { w } from './word';

/**
 * A2 U13 «Comer afuera» (docs/A2_EN_COMPLETION.md): el menú, some/any, much/many/a lot of, pedir
 * con Could I have…? y pagar la cuenta. Supone A1 y A2 U1–U12 (comida de A1 U7, I'd like de A1 U14,
 * pagar y tarjeta de A2 U6).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ORDER = dialogue('en.stim.a2-u13-order', 'Lucy llega a un restaurante y pide la comida.', [
  ['Sam', 'Good evening. A table for two?'],
  ['Lucy', 'Yes, please. Could I have the menu?'],
  ['Sam', 'Here you are.'],
  ['Lucy', 'Could I have the fish soup and a salad, please?'],
  ['Sam', 'Sure. And to drink?'],
  ['Lucy', 'Some water, please.'],
]);

const MENU = reading(
  'en.stim.a2-u13-menu',
  'menu',
  'El menú de un restaurante.',
  [
    'Soup of the day: $5',
    'Green salad: $6',
    'Chicken and rice: $12',
    'Fish and vegetables: $14',
    'Dessert: $4',
    'Water, juice or coffee: $2',
  ],
  { title: 'The Green Table' },
);

const BILL = dialogue('en.stim.a2-u13-bill', 'Lucy termina de comer y pide la cuenta.', [
  ['Lucy', 'Could I have the bill, please?'],
  ['Sam', "Sure. It's twenty-six dollars."],
  ['Lucy', 'Can I pay by card?'],
  ['Sam', 'Yes, sure.'],
]);

export const EN_A2_U13: ExpansionUnitDef = {
  names: ['Lucy', 'Sam'],
  unit: {
    position: 13,
    title: 'Comer afuera',
    titleEn: 'Eating out',
    description: 'El menú, some y any, much y many, pedir en un restaurante y pagar la cuenta.',
    emoji: '🍽️',
    objective: 'Puedes leer un menú, pedir la comida con cortesía y pedir la cuenta.',
    grammar: {
      title: 'Some, any, much y many',
      explanation:
        'Some va en afirmativas y any en negativas y preguntas. Many va con lo que se cuenta (many eggs) y much con lo que no (much water); a lot of sirve para los dos.',
      examples: [
        { target: 'There is some milk.', base: 'Hay algo de leche.' },
        { target: "We don't have any bread.", base: 'No tenemos nada de pan.' },
        { target: "There aren't many people here.", base: 'No hay mucha gente aquí.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 completo: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-menu',
        'menu',
        'menú',
        '/ˈmɛnju/',
        '📋',
        'Can I see the menu, please?',
        '¿Puedo ver el menú, por favor?',
        ['restaurant'],
        ['carta'],
      ),
      w('en-soup', 'soup', 'sopa', '/sup/', '🍲', 'The soup is hot.', 'La sopa está caliente.', [
        'food',
      ]),
      w(
        'en-salad',
        'salad',
        'ensalada',
        '/ˈsæləd/',
        '🥗',
        'I want a green salad.',
        'Quiero una ensalada verde.',
        ['food'],
      ),
      w(
        'en-fish',
        'fish',
        'pescado',
        '/fɪʃ/',
        '🐟',
        "I don't eat fish.",
        'No como pescado.',
        ['food'],
        ['pez'],
      ),
      w(
        'en-meat',
        'meat',
        'carne',
        '/mit/',
        '🥩',
        'They eat a lot of meat.',
        'Comen mucha carne.',
        ['food'],
      ),
      w(
        'en-vegetables',
        'vegetables',
        'verduras',
        '/ˈvɛdʒtəbəlz/',
        '🥦',
        'I eat vegetables every day.',
        'Como verduras todos los días.',
        ['food'],
        ['vegetales'],
      ),
      w(
        'en-dessert',
        'dessert',
        'postre',
        '/dɪˈzɜrt/',
        '🍰',
        'What do you want for dessert?',
        '¿Qué quieres de postre?',
        ['food'],
      ),
      w(
        'en-delicious',
        'delicious',
        'delicioso / deliciosa',
        '/dɪˈlɪʃəs/',
        '😋',
        'The soup was delicious.',
        'La sopa estaba deliciosa.',
        ['food'],
        ['delicioso', 'deliciosa', 'riquísimo', 'riquísima'],
      ),
      w(
        'en-spicy',
        'spicy',
        'picante',
        '/ˈspaɪsi/',
        '🌶️',
        'This chicken is very spicy.',
        'Este pollo es muy picante.',
        ['food'],
      ),
      w(
        'en-order',
        'order',
        'pedir (en un restaurante)',
        '/ˈɔrdər/',
        undefined,
        'We want to order now.',
        'Queremos pedir ahora.',
        ['restaurant', 'verbs'],
        ['pedir', 'ordenar'],
      ),
      w(
        'en-a-table-for-two',
        'a table for two',
        'una mesa para dos',
        '/ə ˈteɪbəl fər tu/',
        undefined,
        'A table for two, please.',
        'Una mesa para dos, por favor.',
        ['restaurant'],
      ),
      w(
        'en-could-i-have',
        'could I have',
        '¿me podría dar…?',
        '/kʊd aɪ hæv/',
        undefined,
        'Could I have some water, please?',
        '¿Me podría dar agua, por favor?',
        ['restaurant', 'requests'],
        ['me podría dar', 'me podrías dar', 'me da'],
      ),
      w(
        'en-the-bill',
        'the bill',
        'la cuenta',
        '/ðə bɪl/',
        '🧾',
        'Could I have the bill, please?',
        '¿Me podría dar la cuenta, por favor?',
        ['restaurant'],
        ['cuenta'],
      ),
      w(
        'en-some',
        'some',
        'algo de / unos',
        '/sʌm/',
        undefined,
        'There is some milk.',
        'Hay algo de leche.',
        ['quantity', 'grammar'],
        ['algo de', 'unos', 'unas', 'algunos', 'algunas'],
      ),
      w(
        'en-any',
        'any',
        'nada de / ningún (en negativas y preguntas)',
        '/ˈɛni/',
        undefined,
        "We don't have any bread.",
        'No tenemos nada de pan.',
        ['quantity', 'grammar'],
        ['nada de', 'ningún', 'ninguna', 'algún', 'alguna'],
      ),
      w(
        'en-much',
        'much',
        'mucho / mucha (lo que no se cuenta)',
        '/mʌtʃ/',
        undefined,
        "I don't drink much coffee.",
        'No tomo mucho café.',
        ['quantity', 'grammar'],
      ),
      w(
        'en-many',
        'many',
        'muchos / muchas (lo que se cuenta)',
        '/ˈmɛni/',
        undefined,
        "There aren't many people here.",
        'No hay mucha gente aquí.',
        ['quantity', 'grammar'],
        ['muchos', 'muchas'],
      ),
      w(
        'en-a-lot-of',
        'a lot of',
        'un montón de',
        '/ə ˈlɑt əv/',
        undefined,
        'I drink a lot of water.',
        'Tomo mucha agua.',
        ['quantity', 'grammar'],
        ['un montón de', 'mucha cantidad de'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'El menú',
        objective: 'Nombrar los platos de un menú.',
        intro: {
          explanation:
            'En un restaurante, el menú (menu) se divide en platos: soup (sopa), salad (ensalada), meat (carne), fish (pescado) y dessert (postre). Vegetables (verduras) casi siempre va en plural.',
          examples: [
            { target: 'Can I see the menu, please?', base: '¿Puedo ver el menú, por favor?' },
            { target: 'I want the fish soup.', base: 'Quiero la sopa de pescado.' },
          ],
        },
        takeaways: [
          'Nombras los platos de un menú: soup, salad, meat, fish, dessert.',
          'Pides ver el menú con Can I see the menu, please?',
        ],
        exercises: [
          ex.imageChoice('🐟', 'fish', ['meat', 'soup', 'salad'], ['en-fish'], {
            id: 'en.ex.kwer9dmncvbjzg',
          }),
          ex.imageChoice('🥗', 'salad', ['soup', 'dessert', 'meat'], ['en-salad'], {
            id: 'en.ex.kuyvx1tmdl1i4v',
          }),
          ex.matchPairs(
            [
              ['soup', 'sopa'],
              ['meat', 'carne'],
              ['vegetables', 'verduras'],
              ['dessert', 'postre'],
            ],
            ['en-soup', 'en-meat', 'en-vegetables', 'en-dessert'],
            { id: 'en.ex.7dzrj8208911z1' },
          ),
          ex.fillBlank(
            "I don't eat meat. I want the ___.",
            'No como carne. Quiero el pescado.',
            'fish',
            ['meat', 'chicken', 'milk'],
            ['en-fish', 'en-meat'],
            { id: 'en.ex.zz8syph5k9fuxl', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Can I see the menu, please?',
            [
              'Can I see the map, please?',
              'Can I have the menu, please?',
              'Can we see the menu, please?',
            ],
            ['en-menu'],
            { id: 'en.ex.s2dk3vi519ux5z' },
          ),
          ex.orderWords(
            'We want soup and salad for lunch.',
            'Queremos sopa y ensalada para el almuerzo.',
            ['en-soup', 'en-salad'],
            {
              id: 'en.ex.ohq8slc61bdv0y',
            },
          ),
          ex.completeWord('d_ss_rt', 'dessert', 'postre', ['en-dessert'], {
            id: 'en.ex.r2tl6pmhe3v9zj',
            explanation: 'Dessert (postre) lleva doble s. Desert, con una sola, es «desierto».',
          }),
          ex.translateWrite('Quiero una ensalada.', 'I want a salad.', ['en-salad'], {
            id: 'en.ex.oaeerrdx34ck9u',
            acceptedAnswers: ["I'd like a salad.", 'I would like a salad.'],
          }),
          ex.translateWrite('No como pescado.', "I don't eat fish.", ['en-fish'], {
            id: 'en.ex.k0stg5ttjjkf5c',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Some y any',
        objective: 'Decir qué hay y qué no hay con some y any.',
        intro: {
          explanation:
            'Some (algo de, unos) va en oraciones afirmativas: There is some milk. Any va en negativas y en preguntas: There isn’t any milk. Is there any milk?',
          examples: [
            { target: 'There are some eggs.', base: 'Hay unos huevos.' },
            { target: "We don't have any bread.", base: 'No tenemos nada de pan.' },
          ],
        },
        takeaways: [
          'Usas some en afirmativas: There is some cheese.',
          'Usas any en negativas y preguntas: Is there any juice?',
        ],
        exercises: [
          ex.fillBlank(
            'There is ___ milk in the kitchen.',
            'Hay algo de leche en la cocina.',
            'some',
            ['any', 'a', 'an'],
            ['en-some', 'en-milk', 'en-kitchen'],
            { id: 'en.ex.v6rxy5w13ldfml', explanation: 'En una oración afirmativa se usa some.' },
          ),
          ex.fillBlank(
            "We don't have ___ bread.",
            'No tenemos nada de pan.',
            'any',
            ['some', 'a', 'an'],
            ['en-any', 'en-bread'],
            { id: 'en.ex.0yediqczr8gibo', explanation: 'En una oración negativa se usa any.' },
          ),
          ex.fillBlank(
            'Are there ___ eggs?',
            '¿Hay huevos?',
            'any',
            ['a', 'an', 'much'],
            ['en-any', 'en-egg'],
            {
              id: 'en.ex.xfgqanm86gfjdc',
              explanation: 'En preguntas se usa any. Eggs se cuenta, así que no va con much.',
            },
          ),
          ex.translationChoice(
            'some',
            'algo de / unos',
            ['nunca', 'también', 'todavía'],
            ['en-some'],
            { id: 'en.ex.3qkfqra854gc3v' },
          ),
          ex.listenChoice(
            'There are some eggs on the table.',
            [
              'There are some eggs on the chair.',
              "There aren't any eggs on the table.",
              'There is some milk on the table.',
            ],
            ['en-some', 'en-egg'],
            { id: 'en.ex.by7vbdbzs9w3je' },
          ),
          ex.orderWords(
            "I don't have any money.",
            'No tengo nada de dinero.',
            ['en-any', 'en-money'],
            {
              id: 'en.ex.4lk02460h5tr4o',
            },
          ),
          ex.shortAnswer(
            'Is there any cheese? (no)',
            '¿Hay queso?',
            "No, there isn't.",
            ["No, there isn't any cheese.", 'No.', "No, there isn't any."],
            ['en-any', 'en-cheese'],
            { id: 'en.ex.hi77gaejdybm8j' },
          ),
          ex.translateWrite(
            'Hay unas verduras en la mesa.',
            'There are some vegetables on the table.',
            ['en-some', 'en-vegetables', 'en-table'],
            { id: 'en.ex.al19g8p7do2fno' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Pedir la comida',
        objective: 'Pedir una mesa y la comida con Could I have…?',
        intro: {
          explanation:
            'Para pedir con cortesía se usa Could I have…? (¿me podría dar…?). Al llegar se pide la mesa: A table for two, please. Para decir que algo está muy rico: It’s delicious!',
          examples: [
            { target: 'A table for two, please.', base: 'Una mesa para dos, por favor.' },
            {
              target: 'Could I have the soup, please?',
              base: '¿Me podría dar la sopa, por favor?',
            },
          ],
        },
        takeaways: [
          'Pides una mesa: A table for two, please.',
          'Pides con cortesía: Could I have the fish, please?',
          'Dices si la comida está delicious o es spicy.',
        ],
        exercises: [
          ex.fillBlank(
            '___ the soup, please?',
            'Situación: estás en un restaurante y quieres pedir la sopa con cortesía.',
            'Could I have',
            ['Could you have', 'Do I have', 'Have I'],
            ['en-could-i-have', 'en-soup'],
            { id: 'en.ex.tzucwswf14qbik', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'A table for ___, please.',
            'Una mesa para dos, por favor.',
            'two',
            ['too', 'to', 'second'],
            ['en-a-table-for-two'],
            {
              id: 'en.ex.yr5udvmfyjlber',
              explanation: 'Two (dos), too (también) y to suenan igual.',
            },
          ),
          ex.fillBlank(
            'We want to ___ now.',
            'Queremos pedir ahora.',
            'order',
            ['eat', 'pay', 'cook'],
            ['en-order'],
            { id: 'en.ex.v71ilcxq54wedb', skill: 'vocabulary' },
          ),
          ex.translationChoice(
            'spicy',
            'picante',
            ['dulce', 'frío / fría', 'delicioso / deliciosa'],
            ['en-spicy'],
            { id: 'en.ex.p16ohtyzddxq3r' },
          ),
          question(
            'en.ex.qo1jegpeap5eis',
            ORDER,
            '¿Qué pide Lucy para comer?',
            'Sopa de pescado y una ensalada',
            ['Pescado con verduras', 'Carne y una ensalada', 'Sopa de verduras y pan'],
            ['en-soup', 'en-fish', 'en-salad'],
            'Lucy dice: «Could I have the fish soup and a salad, please?».',
          ),
          question(
            'en.ex.w65knhp6ilhvek',
            ORDER,
            '¿Qué quiere tomar?',
            'Agua',
            ['Jugo', 'Café', 'Té'],
            ['en-some', 'en-water'],
            'Cuando Sam pregunta «And to drink?», Lucy responde «Some water, please».',
          ),
          ex.listenChoice(
            'This chicken is very spicy.',
            [
              'This chicken is very good.',
              'This fish is very spicy.',
              'The chicken was very spicy.',
            ],
            ['en-spicy', 'en-chicken'],
            { id: 'en.ex.xssm8n1t7vt8dz' },
          ),
          ex.orderWords(
            'Could I have some water?',
            '¿Me podría dar agua?',
            ['en-could-i-have', 'en-some', 'en-water'],
            {
              id: 'en.ex.o1e7dccy9p1vcy',
            },
          ),
          ex.translateWrite(
            '¿Me podría dar el pescado, por favor?',
            'Could I have the fish, please?',
            ['en-could-i-have', 'en-fish'],
            {
              id: 'en.ex.e2gfgjy6cqrs3l',
              acceptedAnswers: ['Can I have the fish, please?', 'Could I have the fish?'],
            },
          ),
          ex.translateWrite(
            'La sopa está deliciosa.',
            'The soup is delicious.',
            ['en-soup', 'en-delicious'],
            {
              id: 'en.ex.9yxp3kui6eibft',
              acceptedAnswers: ["The soup's delicious."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Mucho y muchos',
        objective: 'Hablar de cantidades con much, many y a lot of.',
        intro: {
          explanation:
            'Many va con lo que se cuenta (many people, many eggs) y much con lo que no se cuenta (much water, much money), sobre todo en negativas y preguntas. A lot of sirve para los dos, sobre todo en afirmativas.',
          examples: [
            { target: "There aren't many people here.", base: 'No hay mucha gente aquí.' },
            { target: 'I drink a lot of water.', base: 'Tomo mucha agua.' },
          ],
        },
        takeaways: [
          'Usas many con lo que se cuenta y much con lo que no.',
          'Usas a lot of en afirmativas: a lot of vegetables.',
        ],
        exercises: [
          ex.fillBlank(
            "I don't drink ___ coffee.",
            'No tomo mucho café.',
            'much',
            ['many', 'a lot', 'one'],
            ['en-much', 'en-coffee'],
            { id: 'en.ex.41696ayuddkxv5', explanation: 'Coffee no se cuenta: much coffee.' },
          ),
          ex.fillBlank(
            "There aren't ___ people in the park.",
            'No hay mucha gente en el parque.',
            'many',
            ['much', 'a lot', 'some'],
            ['en-many', 'en-park'],
            { id: 'en.ex.qmr8dsegjmleoi', explanation: 'People se cuenta: many people.' },
          ),
          ex.fillBlank(
            'She eats a lot ___ vegetables.',
            'Ella come muchas verduras.',
            'of',
            ['on', 'in', 'at'],
            ['en-a-lot-of', 'en-vegetables'],
            { id: 'en.ex.bva79q7q1lovkn' },
          ),
          ex.matchPairs(
            [
              ['much water', 'mucha agua'],
              ['many eggs', 'muchos huevos'],
              ['a lot of people', 'mucha gente'],
              ['some bread', 'algo de pan'],
            ],
            ['en-much', 'en-many', 'en-a-lot-of', 'en-some'],
            { id: 'en.ex.tknittvtrj94fp' },
          ),
          ex.listenChoice(
            "We don't have much time.",
            ["We don't have many times.", 'We have a lot of time.', "We don't have much money."],
            ['en-much', 'en-time'],
            { id: 'en.ex.7ddp9hmu499f57' },
          ),
          ex.orderWords(
            'There are a lot of people in the restaurant.',
            'Hay mucha gente en el restaurante.',
            ['en-a-lot-of', 'en-restaurant'],
            {
              id: 'en.ex.4t9g1i9vss9td0',
            },
          ),
          ex.shortAnswer(
            'How much water do you drink? (a lot)',
            '¿Cuánta agua tomas?',
            'I drink a lot of water.',
            ['A lot.', 'A lot of water.', 'I drink a lot.'],
            ['en-a-lot-of', 'en-water', 'en-how-much'],
            { id: 'en.ex.021t1jw5zkq7wp' },
          ),
          ex.translateWrite(
            'No hay muchos restaurantes aquí.',
            "There aren't many restaurants here.",
            ['en-many', 'en-restaurant'],
            { id: 'en.ex.754woqd9su8y6c' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'La cuenta, por favor',
        objective: 'Leer un menú con precios, pedir la cuenta y pagar.',
        intro: {
          explanation:
            'Al final se pide la cuenta (the bill): Could I have the bill, please? Se paga by card (con tarjeta) o in cash (en efectivo).',
          examples: [
            {
              target: 'Could I have the bill, please?',
              base: '¿Me podría dar la cuenta, por favor?',
            },
            { target: 'Can I pay by card?', base: '¿Puedo pagar con tarjeta?' },
          ],
        },
        takeaways: ['Lees un menú con precios.', 'Pides la cuenta y preguntas cómo pagar.'],
        exercises: [
          ex.translationChoice(
            'the bill',
            'la cuenta',
            ['el menú', 'la mesa', 'el postre'],
            ['en-the-bill'],
            {
              id: 'en.ex.v00wg5ibfialv6',
            },
          ),
          question(
            'en.ex.ukq3mbzj8oqe9a',
            MENU,
            '¿Cuánto cuesta el pescado con verduras?',
            '14 dólares',
            ['12 dólares', '6 dólares', '4 dólares'],
            ['en-fish', 'en-vegetables'],
            'El menú dice «Fish and vegetables: $14».',
          ),
          question(
            'en.ex.agwsxzzpu3i54g',
            MENU,
            'No comes carne ni pescado y quieres un plato del menú. ¿Cuál pides?',
            'La ensalada verde',
            ['El pollo con arroz', 'El pescado con verduras', 'Un café'],
            ['en-salad'],
            'Green salad (ensalada verde) no lleva carne ni pescado; el pollo y el pescado, sí. El café no es un plato.',
          ),
          ex.fillBlank(
            'Can I pay by ___?',
            '¿Puedo pagar con tarjeta?',
            'card',
            ['cash', 'menu', 'table'],
            ['en-card', 'en-pay'],
            { id: 'en.ex.an5h0daqva7mwv', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Could I have the bill, please?',
            [
              'Could I have the menu, please?',
              'Could we have the bill, please?',
              'Can I pay the bill, please?',
            ],
            ['en-the-bill', 'en-could-i-have'],
            { id: 'en.ex.0rhrg86i9yll2x' },
          ),
          question(
            'en.ex.yyjygwyx37ul0m',
            BILL,
            '¿Cuánto es la cuenta?',
            '26 dólares',
            ['16 dólares', '20 dólares', '6 dólares'],
            ['en-the-bill'],
            'Sam dice: «It’s twenty-six dollars».',
          ),
          question(
            'en.ex.w7a7ym3v3yoer4',
            BILL,
            '¿Cómo paga Lucy?',
            'Con tarjeta',
            ['En efectivo', 'Con un cheque', 'Paga otra persona'],
            ['en-pay', 'en-card'],
            'Lucy pregunta «Can I pay by card?» y Sam responde «Yes, sure».',
          ),
          ex.orderWords(
            'The dessert was delicious.',
            'El postre estaba delicioso.',
            ['en-dessert', 'en-delicious'],
            {
              id: 'en.ex.4vwijg9k775vr2',
            },
          ),
          ex.translateWrite(
            '¿Me podría dar la cuenta, por favor?',
            'Could I have the bill, please?',
            ['en-the-bill', 'en-could-i-have'],
            {
              id: 'en.ex.u5rpjuq28dz203',
              acceptedAnswers: [
                'Can I have the bill, please?',
                'Could we have the bill, please?',
                'Can we have the bill, please?',
                'Could I have the bill?',
              ],
            },
          ),
          ex.translateWrite(
            '¿Puedo pagar en efectivo?',
            'Can I pay in cash?',
            ['en-pay', 'en-cash'],
            {
              id: 'en.ex.e4zug09kluhct9',
              acceptedAnswers: ['Can I pay cash?', 'Could I pay in cash?'],
            },
          ),
        ],
      },
    ],
  },
};

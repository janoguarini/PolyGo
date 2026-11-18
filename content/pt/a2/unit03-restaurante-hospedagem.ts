import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U3 «Restaurantes y hospedaje» (docs/PT_A1_A2.md): pedir con cortesía (eu gostaria de…,
 * poderia…?, pode me trazer…?), la carta, pagar (cartão, dinheiro, os 10% de serviço) y reservar una
 * pousada. Falso amigo: sobremesa es el «postre» (la sobremesa es o papo depois do almoço).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PEDIDO = dialogue('pt.stim.a2-u3-pedido', 'En un restaurante de Belo Horizonte.', [
  ['Garçom', 'Boa noite! Vocês já escolheram?'],
  ['Cliente', 'Já. Eu gostaria do prato do dia e uma garrafa de água sem gás, por favor.'],
  ['Garçom', 'E de sobremesa?'],
  ['Cliente', 'Depois eu vejo. Ah, poderia me trazer mais pão de queijo?'],
]);

const CARDAPIO = reading(
  'pt.stim.a2-u3-cardapio',
  'menu',
  'La carta de un restaurante.',
  [
    'Prato do dia: feijão, arroz, frango e salada — 35 reais',
    'Moqueca de peixe (para duas pessoas) — 90 reais',
    'Sobremesas: pudim ou sorvete — 12 reais',
    'Aceitamos cartão e Pix. Serviço de 10% não incluído.',
  ],
  { title: 'Cardápio' },
);

const POUSADA = reading(
  'pt.stim.a2-u3-pousada',
  'ad',
  'Un aviso de una posada en la costa.',
  [
    'Pousada Mar Azul — a cinco minutos da praia.',
    'Quarto de casal com varanda: 280 reais a diária.',
    'Café da manhã incluído. Wi-fi grátis.',
    'Reservas pelo site ou pelo telefone da recepção.',
  ],
  { title: 'Pousada Mar Azul' },
);

const CHECKIN = dialogue('pt.stim.a2-u3-checkin', 'Una pareja llega a la posada.', [
  ['Recepcionista', 'Boa tarde! Em que posso ajudar?'],
  [
    'Hóspede',
    'Boa tarde. Eu reservei um quarto de casal para três noites. O meu nome é Teresa Lima.',
  ],
  ['Recepcionista', 'Perfeito, senhora. O café da manhã é das sete às dez. Aqui está a chave.'],
  ['Hóspede', 'Obrigada! O quarto tem varanda?'],
]);

export const PT_A2_U03: PtUnitDef = {
  names: [
    'Belo Horizonte',
    'Garçom',
    'Cliente',
    'Pix',
    'Mar Azul',
    'Recepcionista',
    'Hóspede',
    'Teresa',
    'Lima',
  ],
  support: [
    'copo',
    'feijão',
    'arroz',
    'frango',
    'salada',
    'moqueca',
    'peixe',
    'pessoas',
    'pudim',
    'sorvete',
    'aceitamos',
    'serviço',
    'escolheram',
    'gás',
    'vejo',
    'ah',
    'deseja',
    'reservou',
    'reservo',
    'reserva',
    'varanda',
    'wi',
    'fi',
    'grátis',
    'site',
    'telefone',
    'reservar',
    'ajudar',
    'cento',
  ],
  unit: {
    position: 3,
    title: 'Restaurantes y hospedaje',
    titleEn: 'Restaurante e hospedagem',
    description:
      'Pedir con cortesía (gostaria de, poderia), la carta, pagar y dejar propina, reservar una posada y el falso amigo sobremesa.',
    emoji: '🍽️',
    objective:
      'Podés pedir en un restaurante con cortesía, entender una carta, pagar y reservar una habitación preguntando qué incluye.',
    grammar: {
      title: 'Pedidos corteses: gostaria de, poderia',
      explanation:
        'Para pedir con cortesía: eu gostaria de + verbo o + cosa (gostaria de um café) y poderia…? («¿podría…?»): poderia me trazer a conta? En el habla también va pode me trazer…? y o queria… (que ya conocés). Gostaria de + o = gostaria do.',
      examples: [
        { target: 'Eu gostaria do prato do dia.', base: 'Quisiera el plato del día.' },
        { target: 'Poderia me trazer o cardápio?', base: '¿Me podría traer la carta?' },
        {
          target: 'Eu gostaria de reservar um quarto.',
          base: 'Me gustaría reservar una habitación.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U3). Sin revisión nativa: revisar la carta, la posada y el registro de los pedidos.',
    },
    words: [
      w(
        'pt-cardapio',
        'cardápio',
        'carta / menú',
        'Poderia me trazer o cardápio?',
        '¿Me podría traer la carta?',
        ['food'],
        {
          acceptedTranslations: ['carta', 'menú'],
          emoji: '📋',
        },
      ),
      w(
        'pt-prato',
        'prato',
        'plato',
        'O prato do dia é muito bom.',
        'El plato del día es muy bueno.',
        ['food'],
        {
          emoji: '🍛',
        },
      ),
      w(
        'pt-sobremesa',
        'sobremesa',
        'postre',
        'De sobremesa, eu quero pudim.',
        'De postre quiero flan.',
        ['food'],
        {
          emoji: '🍮',
        },
      ),
      w(
        'pt-garrafa',
        'garrafa',
        'botella',
        'Uma garrafa de água, por favor.',
        'Una botella de agua, por favor.',
        ['food'],
        {
          emoji: '🍾',
        },
      ),
      w(
        'pt-gostaria-de',
        'gostaria de',
        'me gustaría / quisiera',
        'Eu gostaria de um café.',
        'Quisiera un café.',
        ['courtesy'],
        {
          acceptedTranslations: ['me gustaría', 'quisiera'],
        },
      ),
      w(
        'pt-poderia',
        'poderia',
        'podría',
        'Poderia me ajudar?',
        '¿Me podría ayudar?',
        ['courtesy'],
        {
          acceptedTranslations: ['¿podría?', 'podrías'],
        },
      ),
      w('pt-trazer', 'trazer', 'traer', 'Pode me trazer a conta?', '¿Me trae la cuenta?', [
        'courtesy',
        'verbs',
      ]),
      w(
        'pt-gorjeta',
        'gorjeta',
        'propina',
        'A gorjeta é de dez por cento.',
        'La propina es del diez por ciento.',
        ['food', 'money'],
      ),
      w(
        'pt-cartao',
        'cartão',
        'tarjeta',
        'Posso pagar com cartão?',
        '¿Puedo pagar con tarjeta?',
        ['money'],
        {
          emoji: '💳',
        },
      ),
      w(
        'pt-dinheiro',
        'dinheiro',
        'dinero / efectivo',
        'Vou pagar em dinheiro.',
        'Voy a pagar en efectivo.',
        ['money'],
        {
          acceptedTranslations: ['dinero', 'efectivo', 'plata'],
          emoji: '💵',
        },
      ),
      w('pt-reservei', 'reservei', 'reservé', 'Eu reservei um quarto.', 'Reservé una habitación.', [
        'travel',
        'past',
      ]),
      w(
        'pt-pousada',
        'pousada',
        'posada (hotel chico)',
        'A pousada é perto da praia.',
        'La posada está cerca de la playa.',
        ['travel'],
        {
          acceptedTranslations: ['posada', 'hostería'],
        },
      ),
      w(
        'pt-quarto-de-casal',
        'quarto de casal',
        'habitación matrimonial',
        'Eu gostaria de um quarto de casal.',
        'Quisiera una habitación matrimonial.',
        ['travel'],
        { acceptedTranslations: ['habitación doble', 'cuarto matrimonial'], emoji: '🛏️' },
      ),
      w(
        'pt-diaria',
        'diária',
        'tarifa por noche',
        'A diária é de 200 reais.',
        'La noche cuesta 200 reales.',
        ['travel', 'money'],
        {
          acceptedTranslations: ['precio por noche', 'noche de hotel'],
        },
      ),
      w(
        'pt-incluido',
        'incluído',
        'incluido',
        'O café da manhã está incluído?',
        '¿El desayuno está incluido?',
        ['travel'],
        {
          acceptedTexts: ['incluída'],
        },
      ),
      w(
        'pt-recepcao',
        'recepção',
        'recepción',
        'A chave está na recepção.',
        'La llave está en la recepción.',
        ['travel'],
        { emoji: '🛎️' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'O cardápio',
        objective: 'Entender una carta y evitar el falso amigo sobremesa.',
        intro: {
          explanation:
            'En el restaurante: o cardápio (la carta), o prato (el plato), a garrafa (la botella). Falso amigo: sobremesa es el «postre». El prato do dia es el menú del día, muy común en Brasil.',
          examples: [
            { target: 'O prato do dia é feijoada.', base: 'El plato del día es feijoada.' },
            { target: 'De sobremesa, eu quero pudim.', base: 'De postre quiero flan.' },
          ],
        },
        takeaways: [
          'Entendés una carta: prato, sobremesa, garrafa.',
          'Sabés que sobremesa es «postre».',
        ],
        exercises: [
          ex.translationChoice(
            'sobremesa',
            'postre',
            ['sobremesa (charla)', 'mantel', 'mesa'],
            ['pt-sobremesa'],
            {
              id: 'pt.ex.8f4nnl6fcfkb9r',
              explanation: 'Falso amigo: sobremesa es el postre.',
            },
          ),
          ex.translationChoice(
            'cardápio',
            'carta / menú',
            ['cuenta', 'plato', 'mozo'],
            ['pt-cardapio'],
            { id: 'pt.ex.ggiznhfdj8tvy4' },
          ),
          ex.imageChoice('🍾', 'garrafa', ['prato', 'cardápio', 'sobremesa'], ['pt-garrafa'], {
            id: 'pt.ex.7laitwl5gpvgme',
          }),
          ex.imageChoice('🍮', 'sobremesa', ['prato', 'garrafa', 'cardápio'], ['pt-sobremesa'], {
            id: 'pt.ex.0ai13ty845qgua',
          }),
          ex.listenChoice(
            'Uma garrafa de água, por favor.',
            [
              'Um copo de água, por favor.',
              'Uma garrafa de suco, por favor.',
              'A conta, por favor.',
            ],
            ['pt-garrafa', 'pt-agua'],
            { id: 'pt.ex.3cm82xyk7xu4xg' },
          ),
          question(
            'pt.ex.k982gfu528vv39',
            CARDAPIO,
            '¿Qué trae el plato del día?',
            'Porotos, arroz, pollo y ensalada',
            ['Pescado para dos personas', 'Flan o helado', 'Pan de queso'],
            ['pt-prato'],
            'La carta dice: «Prato do dia: feijão, arroz, frango e salada».',
          ),
          question(
            'pt.ex.8pirgyseg5s7xw',
            CARDAPIO,
            '¿Qué dice la carta sobre el servicio?',
            'Que el 10 % de servicio no está incluido',
            [
              'Que el servicio está incluido',
              'Que no aceptan tarjeta',
              'Que la moqueca es para una persona',
            ],
            ['pt-cardapio', 'pt-incluido', 'pt-cartao'],
            'Al final: «Serviço de 10% não incluído».',
          ),
          ex.fillBlank(
            'De ___, eu quero sorvete.',
            'De postre quiero helado.',
            'sobremesa',
            ['prato', 'garrafa', 'cardápio'],
            ['pt-sobremesa'],
            { id: 'pt.ex.ne16y43o2pxevz', skill: 'vocabulary' },
          ),
          ex.shortAnswer(
            'O que você quer de sobremesa? (🍮)',
            '¿Qué querés de postre? (Respondé que querés flan: pudim.)',
            'Eu quero pudim.',
            ['Quero pudim.', 'Pudim.', 'Eu quero um pudim.', 'Pudim, por favor.'],
            ['pt-sobremesa'],
            { id: 'pt.ex.cvmc6zb48lbmte' },
          ),
          ex.translateWrite(
            'Una botella de agua, por favor.',
            'Uma garrafa de água, por favor.',
            ['pt-garrafa'],
            {
              id: 'pt.ex.14p6xxybz4twgt',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Eu gostaria de…',
        objective: 'Pedir con cortesía.',
        intro: {
          explanation:
            'Eu gostaria de es «me gustaría» o «quisiera»: gostaria de um café; con o se une en do: gostaria do prato do dia. Poderia…? es «¿podría…?»: poderia me trazer o cardápio? Trazer es «traer».',
          examples: [
            { target: 'Eu gostaria de uma água, por favor.', base: 'Quisiera un agua, por favor.' },
            { target: 'Poderia me trazer a conta?', base: '¿Me podría traer la cuenta?' },
          ],
        },
        takeaways: ['Pedís con gostaria de.', 'Pedís un favor con poderia…?'],
        exercises: [
          ex.translationChoice('trazer', 'traer', ['llevar', 'tomar', 'pedir'], ['pt-trazer'], {
            id: 'pt.ex.9yr98sj8t3h95h',
          }),
          ex.translationChoice(
            'gostaria de',
            'me gustaría / quisiera',
            ['me gusta', 'me encanta', 'quiero'],
            ['pt-gostaria-de'],
            {
              id: 'pt.ex.ez02qmmce2zrdc',
            },
          ),
          ex.listenChoice(
            'Poderia me trazer o cardápio?',
            [
              'Pode me trazer o cardápio?',
              'Poderia me trazer a conta?',
              'Poderia me trazer um prato?',
            ],
            ['pt-poderia', 'pt-trazer', 'pt-cardapio'],
            { id: 'pt.ex.5fi70d8ngx3z11' },
          ),
          ex.fillBlank(
            'Eu ___ de um suco de laranja.',
            'Quisiera un jugo de naranja.',
            'gostaria',
            ['gosto', 'quero', 'poderia'],
            ['pt-gostaria-de', 'pt-suco'],
            { id: 'pt.ex.wwig305tgmd7ge' },
          ),
          ex.fillBlank(
            'Eu gostaria ___ prato do dia.',
            'Quisiera el plato del día.',
            'do',
            ['de', 'da', 'o'],
            ['pt-gostaria-de', 'pt-prato'],
            { id: 'pt.ex.lurkzrab3uwxwt', explanation: 'De + o = do: gostaria do prato.' },
          ),
          ex.fillBlank(
            '___ me trazer mais pão, por favor?',
            '¿Me podría traer más pan, por favor?',
            'Poderia',
            ['Gostaria', 'Queria', 'Posso'],
            ['pt-poderia', 'pt-trazer'],
            { id: 'pt.ex.14ocqie4f10fq3' },
          ),
          question(
            'pt.ex.0p8kr1ufc50x45',
            PEDIDO,
            '¿Qué pide el cliente para tomar?',
            'Una botella de agua sin gas',
            ['Una botella de agua con gas', 'Un jugo', 'Un café'],
            ['pt-garrafa', 'pt-gostaria-de'],
            'El cliente dice: «uma garrafa de água sem gás».',
          ),
          question(
            'pt.ex.0zd44hk66rqtwl',
            PEDIDO,
            '¿Qué le pide al mozo al final?',
            'Más pan de queso',
            ['El postre', 'La cuenta', 'La carta'],
            ['pt-poderia', 'pt-trazer'],
            'Dice: «poderia me trazer mais pão de queijo?».',
          ),
          ex.shortAnswer(
            'O que o senhor deseja? (prato do dia)',
            '¿Qué desea? (Pedí el plato del día con cortesía.)',
            'Eu gostaria do prato do dia.',
            [
              'Gostaria do prato do dia.',
              'Eu gostaria do prato do dia, por favor.',
              'Gostaria do prato do dia, por favor.',
              'O prato do dia, por favor.',
            ],
            ['pt-gostaria-de', 'pt-prato'],
            { id: 'pt.ex.ogk3wt5g3s39yc' },
          ),
          ex.translateWrite(
            '¿Me podría traer la carta?',
            'Poderia me trazer o cardápio?',
            ['pt-poderia', 'pt-trazer', 'pt-cardapio'],
            {
              id: 'pt.ex.pn4xu3dtec671c',
              acceptedAnswers: [
                'Pode me trazer o cardápio?',
                'O senhor poderia me trazer o cardápio?',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'A conta e a gorjeta',
        objective: 'Pagar y entender la propina en Brasil.',
        intro: {
          explanation:
            'Para pagar: com cartão (con tarjeta) o em dinheiro (en efectivo). En Brasil la cuenta suele traer os 10% de serviço: es la gorjeta (propina) y es opcional. Muchos lugares aceptan Pix, el pago por el celular.',
          examples: [
            { target: 'Posso pagar com cartão?', base: '¿Puedo pagar con tarjeta?' },
            {
              target: 'A gorjeta está incluída na conta?',
              base: '¿La propina está incluida en la cuenta?',
            },
          ],
        },
        takeaways: ['Decís cómo pagás: com cartão, em dinheiro.', 'Entendés los 10% de serviço.'],
        exercises: [
          ex.imageChoice('💳', 'cartão', ['dinheiro', 'gorjeta', 'garrafa'], ['pt-cartao'], {
            id: 'pt.ex.jytfr9nk5b53zl',
          }),
          ex.translationChoice(
            'gorjeta',
            'propina',
            ['cuenta', 'tarjeta', 'vuelto'],
            ['pt-gorjeta'],
            { id: 'pt.ex.f38k4y6xnk5vtz' },
          ),
          ex.translationChoice(
            'dinheiro',
            'dinero / efectivo',
            ['tarjeta', 'cuenta', 'precio'],
            ['pt-dinheiro'],
            { id: 'pt.ex.dd26ox7tnjq9g1' },
          ),
          ex.listenChoice(
            'Posso pagar com cartão?',
            ['Posso pagar em dinheiro?', 'Pode pagar com cartão?', 'Posso pagar a conta?'],
            ['pt-cartao', 'pt-posso'],
            { id: 'pt.ex.omceglls9zmsq4' },
          ),
          ex.fillBlank(
            'Vou pagar ___ dinheiro.',
            'Voy a pagar en efectivo.',
            'em',
            ['com', 'de', 'no'],
            ['pt-dinheiro'],
            {
              id: 'pt.ex.vxjb0f1ng7au1f',
              explanation: 'En efectivo: em dinheiro; con tarjeta: com cartão.',
            },
          ),
          ex.fillBlank(
            'Posso pagar ___ cartão?',
            '¿Puedo pagar con tarjeta?',
            'com',
            ['em', 'de', 'no'],
            ['pt-cartao', 'pt-posso'],
            { id: 'pt.ex.89cj054shq11wn' },
          ),
          question(
            'pt.ex.bnz4tm2a448p2f',
            CARDAPIO,
            '¿Cómo se puede pagar en el restaurante?',
            'Con tarjeta o con Pix',
            ['Solo en efectivo', 'Solo con tarjeta', 'Con tarjeta o en efectivo, sin Pix'],
            ['pt-cartao'],
            'La carta dice: «Aceitamos cartão e Pix».',
          ),
          ex.orderWords(
            'A gorjeta não está incluída.',
            'La propina no está incluida.',
            ['pt-gorjeta', 'pt-incluido'],
            {
              id: 'pt.ex.8i1runwdbgd1tn',
            },
          ),
          ex.shortAnswer(
            'Cartão ou dinheiro?',
            '¿Tarjeta o efectivo? (Respondé que pagás con tarjeta.)',
            'Cartão, por favor.',
            ['Com cartão.', 'Vou pagar com cartão.', 'Cartão.', 'Com cartão, por favor.'],
            ['pt-cartao'],
            { id: 'pt.ex.4surjsrya7pxv4' },
          ),
          ex.translateWrite('Voy a pagar en efectivo.', 'Vou pagar em dinheiro.', ['pt-dinheiro'], {
            id: 'pt.ex.9r7o8gxtlxjmyt',
            acceptedAnswers: ['Eu vou pagar em dinheiro.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Reservei um quarto',
        objective: 'Reservar una habitación.',
        intro: {
          explanation:
            'Una pousada es un hotel chico, típico de la costa. Quarto de casal es la habitación matrimonial. A diária es el precio por noche. Reservar en pasado: eu reservei.',
          examples: [
            {
              target: 'Eu gostaria de reservar um quarto de casal.',
              base: 'Quisiera reservar una habitación matrimonial.',
            },
            { target: 'Quanto é a diária?', base: '¿Cuánto cuesta la noche?' },
          ],
        },
        takeaways: [
          'Reservás una habitación: quarto de casal.',
          'Preguntás el precio: quanto é a diária?',
        ],
        exercises: [
          ex.translationChoice(
            'diária',
            'tarifa por noche',
            ['diario', 'día libre', 'reserva'],
            ['pt-diaria'],
            {
              id: 'pt.ex.tjmkzqpbudl3qa',
            },
          ),
          ex.translationChoice(
            'pousada',
            'posada (hotel chico)',
            ['casa de familia', 'departamento', 'parada'],
            ['pt-pousada'],
            {
              id: 'pt.ex.5lrps0rfmsk35b',
            },
          ),
          ex.imageChoice(
            '🛏️',
            'quarto de casal',
            ['cardápio', 'garrafa', 'cartão'],
            ['pt-quarto-de-casal'],
            { id: 'pt.ex.cfjs3iq7ox0fbg' },
          ),
          ex.listenChoice(
            'Eu reservei um quarto de casal.',
            [
              'Eu gostaria de um quarto de casal.',
              'Ela reservou um quarto de casal.',
              'Eu reservei uma mesa para dois.',
            ],
            ['pt-reservei', 'pt-quarto-de-casal'],
            { id: 'pt.ex.3lv7lfi1ndtoox' },
          ),
          ex.fillBlank(
            'Eu ___ um quarto para três noites.',
            'Reservé una habitación para tres noches.',
            'reservei',
            ['reservo', 'reservou', 'reserva'],
            ['pt-reservei'],
            { id: 'pt.ex.yphc560rcki8w9' },
          ),
          question(
            'pt.ex.kz1dnzsbpzpqid',
            POUSADA,
            '¿Cuánto cuesta la habitación matrimonial?',
            '280 reales por noche',
            ['280 reales por semana', '28 reales por noche', '180 reales por noche'],
            ['pt-diaria', 'pt-quarto-de-casal'],
            'El aviso dice: «Quarto de casal com varanda: 280 reais a diária».',
          ),
          question(
            'pt.ex.m4fj4lxvqds487',
            POUSADA,
            '¿Dónde está la posada?',
            'A cinco minutos de la playa',
            ['En el centro de la ciudad', 'A cinco horas de la playa', 'Al lado del aeropuerto'],
            ['pt-pousada', 'pt-recepcao'],
            'Dice: «a cinco minutos da praia».',
          ),
          ex.orderWords(
            'Quanto é a diária do quarto?',
            '¿Cuánto cuesta la noche en la habitación?',
            ['pt-diaria'],
            {
              id: 'pt.ex.rp5z2sh7fgf3uu',
            },
          ),
          ex.shortAnswer(
            'Para quantas noites?',
            '¿Para cuántas noches? (Respondé que para dos noches.)',
            'Para duas noites.',
            ['Duas noites.', 'São duas noites.', 'Para duas noites, por favor.'],
            ['pt-diaria'],
            { id: 'pt.ex.gzuhng0q2or5sj' },
          ),
          ex.translateWrite(
            'Quisiera reservar una habitación matrimonial.',
            'Eu gostaria de reservar um quarto de casal.',
            ['pt-gostaria-de', 'pt-quarto-de-casal'],
            {
              id: 'pt.ex.tmfuzygqjlynnu',
              acceptedAnswers: ['Gostaria de reservar um quarto de casal.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'O café da manhã está incluído?',
        objective: 'Hacer el check-in y preguntar qué incluye.',
        intro: {
          explanation:
            'Para saber qué entra en el precio: o café da manhã está incluído? En la recepción te van a pedir el nombre de la reserva y te dan a chave. Incluído concuerda: a gorjeta está incluída.',
          examples: [
            { target: 'O café da manhã está incluído?', base: '¿El desayuno está incluido?' },
            {
              target: 'Eu reservei um quarto. O meu nome é Teresa.',
              base: 'Reservé una habitación. Me llamo Teresa.',
            },
          ],
        },
        takeaways: ['Preguntás qué está incluído.', 'Hacés el check-in con tu reserva.'],
        exercises: [
          ex.fillBlank(
            'O café da manhã está ___?',
            '¿El desayuno está incluido?',
            'incluído',
            ['incluída', 'reservei', 'diária'],
            ['pt-incluido', 'pt-cafe-da-manha'],
            { id: 'pt.ex.f1rzfha9qb83o9' },
          ),
          ex.listenChoice(
            'O café da manhã está incluído?',
            [
              'O almoço está incluído?',
              'O café da manhã não está incluído.',
              'O café da manhã é às sete?',
            ],
            ['pt-incluido', 'pt-cafe-da-manha'],
            { id: 'pt.ex.21v9h2a96evwp7' },
          ),
          question(
            'pt.ex.acgucwi9a3uhpm',
            CHECKIN,
            '¿Qué reservó Teresa?',
            'Una habitación matrimonial por tres noches',
            [
              'Una habitación simple por dos noches',
              'Una mesa para cenar',
              'Una habitación por una semana',
            ],
            ['pt-reservei', 'pt-quarto-de-casal'],
            'Teresa dice: «Eu reservei um quarto de casal para três noites».',
          ),
          question(
            'pt.ex.72p5ryrgh6o55l',
            CHECKIN,
            '¿A qué hora es el desayuno?',
            'De siete a diez',
            ['De seis a nueve', 'A las diez', 'De siete a doce'],
            ['pt-cafe-da-manha'],
            'El recepcionista dice: «O café da manhã é das sete às dez».',
          ),
          question(
            'pt.ex.2trbqzk9scr1f8',
            POUSADA,
            '¿Qué está incluido en el precio?',
            'El desayuno (y el wi-fi es gratis)',
            ['El almuerzo', 'La cena y el wi-fi', 'Nada'],
            ['pt-incluido'],
            'El aviso dice: «Café da manhã incluído. Wi-fi grátis».',
          ),
          ex.matchPairs(
            [
              ['pousada', 'posada (hotel chico)'],
              ['diária', 'tarifa por noche'],
              ['gorjeta', 'propina'],
              ['cardápio', 'carta / menú'],
            ],
            ['pt-pousada', 'pt-diaria', 'pt-gorjeta', 'pt-cardapio'],
            { id: 'pt.ex.leogh182dc7pg2' },
          ),
          ex.orderWords(
            'A chave do quarto está na recepção.',
            'La llave de la habitación está en la recepción.',
            ['pt-chave', 'pt-recepcao'],
            {
              id: 'pt.ex.91atkhgtskxvjc',
            },
          ),
          ex.shortAnswer(
            'Boa tarde! Em que posso ajudar?',
            '¡Buenas tardes! ¿En qué puedo ayudar? (Decí que reservaste una habitación.)',
            'Eu reservei um quarto.',
            [
              'Boa tarde, eu reservei um quarto.',
              'Reservei um quarto.',
              'Boa tarde! Eu reservei um quarto.',
              'Eu reservei um quarto de casal.',
            ],
            ['pt-reservei'],
            { id: 'pt.ex.9ty7i5nemmnbcc' },
          ),
          ex.translateWrite(
            '¿La propina está incluida?',
            'A gorjeta está incluída?',
            ['pt-gorjeta'],
            {
              id: 'pt.ex.j2n4tg1x9b3eyi',
              acceptedAnswers: ['A gorjeta está incluída na conta?'],
            },
          ),
        ],
      },
    ],
  },
};

import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U9 «Compras y servicios» (docs/PT_A1_A2.md): comparativos (mais… do que, menos… do que,
 * tão… quanto), los irregulares (melhor, pior, maior, menor) y el superlativo (o mais…); probarse,
 * cambiar y pedir otro talle. Falso amigo: calça es el «pantalón» y tênis, las «zapatillas».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LOJA = dialogue('pt.stim.a2-u9-loja', 'En una tienda de ropa.', [
  ['Vendedora', 'Posso ajudar?'],
  ['Cliente', 'Posso provar esta calça? Mas eu queria um tamanho maior.'],
  [
    'Vendedora',
    'Claro. O provador é ali. Esta azul é mais barata do que a preta e está com desconto.',
  ],
  ['Cliente', 'Ótimo! E se não ficar bem, posso trocar depois?'],
  ['Vendedora', 'Pode, sim. Com a nota fiscal, você tem trinta dias para trocar.'],
]);

const LIQUIDACAO = reading(
  'pt.stim.a2-u9-liquidacao',
  'ad',
  'Un cartel en la vitrina de una zapatería.',
  [
    'Liquidação de verão!',
    'Tênis e sandálias com até 50% de desconto.',
    'Os preços mais baixos da cidade.',
    'Pagamento em até três vezes sem juros no cartão.',
  ],
  { title: 'Liquidação' },
);

const CELULARES = reading(
  'pt.stim.a2-u9-celulares',
  'post',
  'Una persona compara dos celulares en un foro.',
  [
    'Comprei o Fone X e não o Fone Y. Por quê?',
    'O Fone Y tem uma tela maior, mas é mais caro e mais pesado.',
    'A câmera do Fone X é tão boa quanto a do Fone Y, e a bateria é melhor.',
    'Para mim, o Fone X é o melhor celular do ano.',
  ],
  { from: 'Davi', title: 'Fone X ou Fone Y?' },
);

const TROCA = dialogue('pt.stim.a2-u9-troca', 'Una clienta vuelve a la tienda.', [
  [
    'Cliente',
    'Oi, eu comprei este tênis ontem, mas ficou pequeno. Posso trocar por um número maior?',
  ],
  ['Vendedor', 'Claro. Qual número você quer?'],
  ['Cliente', 'O trinta e oito. O trinta e sete é menor do que eu pensava.'],
  ['Vendedor', 'Aqui está. Este é o último trinta e oito!'],
]);

export const PT_A2_U09: PtUnitDef = {
  names: ['Vendedora', 'Cliente', 'Vendedor', 'Fone', 'X', 'Y', 'Davi', 'Casa Nova', 'M'],
  support: [
    'claro',
    'provador',
    'nota',
    'fiscal',
    'médio',
    'aquele',
    'aquela',
    'comprei',
    'ficou',
    'número',
    'pensava',
    'último',
    'pagamento',
    'juros',
    'vista',
    'troca',
    'pergunta',
    'tela',
    'pesado',
    'câmera',
    'bateria',
    'vestido',
    'jeans',
  ],
  unit: {
    position: 9,
    title: 'Compras y servicios',
    titleEn: 'Compras',
    description:
      'Comparar (mais… do que, tão… quanto, melhor, pior), el superlativo, probarse y cambiar ropa, los descuentos y los falsos amigos calça y tênis.',
    emoji: '🛍️',
    objective:
      'Puedes comparar productos y precios, elegir el mejor, probarte ropa, pedir otra talla y cambiar algo que compraste.',
    grammar: {
      title: 'Comparativos y superlativos',
      explanation:
        'Mais + adjetivo + (do) que: a calça azul é mais barata (do) que a preta. Menos… (do) que. Igualdad: tão… quanto (tão boa quanto). Irregulares: bom → melhor, ruim → pior, grande → maior, pequeno → menor. Superlativo: o / a mais…: o mais barato da loja.',
      examples: [
        {
          target: 'Esta calça é mais barata do que aquela.',
          base: 'Este pantalón es más barato que aquel.',
        },
        {
          target: 'A câmera é tão boa quanto a do outro.',
          base: 'La cámara es tan buena como la del otro.',
        },
        { target: 'É o melhor celular do ano.', base: 'Es el mejor celular del año.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U9). Sin revisión nativa: revisar los comparativos, nota fiscal y la compra en cuotas.',
    },
    words: [
      w(
        'pt-mais-barato',
        'mais barato',
        'más barato',
        'O pão aqui é mais barato.',
        'Aquí el pan es más barato.',
        ['comparisons'],
        {
          acceptedTexts: ['mais barata'],
          acceptedTranslations: ['más barata'],
        },
      ),
      w(
        'pt-do-que',
        'do que',
        'que (al comparar)',
        'O Rio é maior do que Recife.',
        'Río es más grande que Recife.',
        ['comparisons'],
      ),
      w('pt-menos', 'menos', 'menos', 'Esta loja é menos cara.', 'Esta tienda es menos cara.', [
        'comparisons',
      ]),
      w(
        'pt-tao',
        'tão',
        'tan',
        'A calça é tão bonita quanto o vestido.',
        'El pantalón es tan lindo como el vestido.',
        ['comparisons'],
        {
          acceptedTexts: ['tão… quanto'],
        },
      ),
      w('pt-melhor', 'melhor', 'mejor', 'Este café é melhor.', 'Este café es mejor.', [
        'comparisons',
      ]),
      w('pt-pior', 'pior', 'peor', 'O tempo hoje está pior.', 'Hoy el tiempo está peor.', [
        'comparisons',
      ]),
      w(
        'pt-maior',
        'maior',
        'más grande / mayor',
        'Você tem um tamanho maior?',
        '¿Tienes una talla más grande?',
        ['comparisons'],
        {
          acceptedTranslations: ['más grande', 'mayor'],
        },
      ),
      w(
        'pt-menor',
        'menor',
        'más chico / menor',
        'Este quarto é menor.',
        'Este cuarto es más chico.',
        ['comparisons'],
        {
          acceptedTranslations: ['más chico', 'más pequeño', 'menor'],
        },
      ),
      w(
        'pt-o-mais',
        'o mais',
        'el más (superlativo)',
        'É o mais barato da loja.',
        'Es el más barato de la tienda.',
        ['comparisons'],
        {
          acceptedTexts: ['a mais'],
          acceptedTranslations: ['el más', 'la más'],
        },
      ),
      w(
        'pt-tamanho',
        'tamanho',
        'talla / tamaño',
        'Qual é o seu tamanho?',
        '¿Cuál es tu talla?',
        ['shopping', 'clothes'],
        {
          acceptedTranslations: ['talle', 'tamaño', 'talla', 'talle / tamaño'],
        },
      ),
      w(
        'pt-trocar',
        'trocar',
        'cambiar (un producto)',
        'Posso trocar esta camiseta?',
        '¿Puedo cambiar esta camiseta?',
        ['shopping'],
        {
          acceptedTranslations: ['cambiar'],
        },
      ),
      w(
        'pt-provar',
        'provar',
        'probarse / probar',
        'Posso provar esta calça?',
        '¿Me puedo probar este pantalón?',
        ['shopping', 'clothes'],
        {
          acceptedTranslations: ['probarse', 'probar'],
        },
      ),
      w(
        'pt-calca',
        'calça',
        'pantalón',
        'A calça jeans está com desconto.',
        'El jean está con descuento.',
        ['clothes'],
        {
          acceptedTranslations: ['pantalones'],
          emoji: '👖',
        },
      ),
      w(
        'pt-tenis',
        'tênis',
        'zapatillas',
        'Comprei um tênis novo.',
        'Me compré unas zapatillas nuevas.',
        ['clothes'],
        {
          acceptedTranslations: ['zapatilla', 'tenis'],
          emoji: '👟',
        },
      ),
      w(
        'pt-desconto',
        'desconto',
        'descuento',
        'Tem desconto à vista?',
        '¿Hay descuento en efectivo?',
        ['shopping'],
        { emoji: '🏷️' },
      ),
      w(
        'pt-liquidacao',
        'liquidação',
        'liquidación / rebajas',
        'A loja está em liquidação.',
        'La tienda está de liquidación.',
        ['shopping'],
        {
          acceptedTranslations: ['liquidación', 'rebajas', 'ofertas'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Mais barato do que…',
        objective: 'Comparar con mais… do que y menos… do que.',
        intro: {
          explanation:
            'Para comparar: mais + adjetivo + do que (o solo que): a azul é mais barata do que a preta. Al revés: menos… do que. El adjetivo concuerda: mais barato, mais barata.',
          examples: [
            {
              target: 'A camiseta azul é mais barata do que a preta.',
              base: 'La camiseta azul es más barata que la negra.',
            },
            {
              target: 'Esta loja é menos cara do que aquela.',
              base: 'Esta tienda es menos cara que aquella.',
            },
          ],
        },
        takeaways: ['Comparas con mais… do que.', 'Comparas con menos… do que.'],
        exercises: [
          ex.translationChoice(
            'do que',
            'que (al comparar)',
            ['del cual', 'de lo que', 'porque'],
            ['pt-do-que'],
            { id: 'pt.ex.5jx0zuob774evm' },
          ),
          ex.translationChoice(
            'mais barato',
            'más barato',
            ['muy barato', 'menos barato', 'tan barato'],
            ['pt-mais-barato'],
            { id: 'pt.ex.gbfgnpovgxspl3' },
          ),
          ex.listenChoice(
            'É mais barato do que o outro.',
            ['É mais caro do que o outro.', 'É menos barato do que o outro.', 'É muito barato.'],
            ['pt-mais-barato', 'pt-do-que'],
            { id: 'pt.ex.pzbeoh3e99jarw' },
          ),
          ex.fillBlank(
            'A camiseta é mais barata ___ que o sapato.',
            'La camiseta es más barata que el zapato.',
            'do',
            ['de', 'da', 'o'],
            ['pt-do-que', 'pt-mais-barato'],
            { id: 'pt.ex.a9ymhqgu909bs4', explanation: 'Mais… do que (o mais… que).' },
          ),
          ex.fillBlank(
            'Esta loja é ___ cara do que aquela.',
            'Esta tienda es menos cara que aquella.',
            'menos',
            ['mais', 'muito', 'pouco'],
            ['pt-menos'],
            { id: 'pt.ex.hplu881xlgxsms' },
          ),
          ex.fillBlank(
            'A bolsa vermelha é mais ___ do que a preta.',
            'La cartera roja es más barata que la negra.',
            'barata',
            ['barato', 'baratos', 'baratas'],
            ['pt-mais-barato'],
            { id: 'pt.ex.sxhl5ijje1yyqx', explanation: 'Bolsa es femenino: mais barata.' },
          ),
          ex.orderWords(
            'O ônibus é mais barato do que o táxi.',
            'El autobús es más barato que el taxi.',
            ['pt-mais-barato', 'pt-do-que'],
            {
              id: 'pt.ex.r16bhrgnorj8mo',
            },
          ),
          ex.shortAnswer(
            'O metrô é mais caro do que o ônibus?',
            '¿El metro es más caro que el autobús? (Responde que no, que es más barato.)',
            'Não, é mais barato.',
            [
              'Não, o metrô é mais barato.',
              'Não, é mais barato do que o ônibus.',
              'Não. É mais barato.',
            ],
            ['pt-mais-barato'],
            { id: 'pt.ex.ul2wu1vrg5cuwv' },
          ),
          ex.translateWrite(
            'La camiseta es más barata que el zapato.',
            'A camiseta é mais barata do que o sapato.',
            ['pt-mais-barato', 'pt-do-que'],
            {
              id: 'pt.ex.p43jiwwbcm0lbc',
              acceptedAnswers: ['A camiseta é mais barata que o sapato.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Melhor, pior, maior, menor',
        objective: 'Usar los comparativos irregulares.',
        intro: {
          explanation:
            'Como en español, algunos son irregulares: melhor (mejor), pior (peor), maior (más grande, mayor) y menor (más chico, menor). No se dice mais bom: se dice melhor.',
          examples: [
            {
              target: 'Este restaurante é melhor do que aquele.',
              base: 'Este restaurante es mejor que aquel.',
            },
            { target: 'Você tem um tamanho maior?', base: '¿Tienes una talla más grande?' },
          ],
        },
        takeaways: ['Usas melhor, pior, maior y menor.', 'Pides una talla más grande o más chica.'],
        exercises: [
          ex.translationChoice(
            'maior',
            'más grande / mayor',
            ['mejor', 'más chico / menor', 'mucho'],
            ['pt-maior'],
            { id: 'pt.ex.1ytnh1qglfu5i7' },
          ),
          ex.translationChoice('pior', 'peor', ['mejor', 'pero', 'menor'], ['pt-pior'], {
            id: 'pt.ex.9lg4o9jci4peb9',
          }),
          ex.matchPairs(
            [
              ['melhor', 'mejor'],
              ['pior', 'peor'],
              ['maior', 'más grande / mayor'],
              ['menor', 'más chico / menor'],
            ],
            ['pt-melhor', 'pt-pior', 'pt-maior', 'pt-menor'],
            { id: 'pt.ex.7fouyljc62ma3s' },
          ),
          ex.listenChoice(
            'Você tem um tamanho maior?',
            [
              'Você tem um tamanho menor?',
              'Você tem um tamanho médio?',
              'Você tem um sapato maior?',
            ],
            ['pt-maior', 'pt-tamanho'],
            { id: 'pt.ex.zfrlcuag0wpvhi' },
          ),
          ex.fillBlank(
            'Este café é ___ do que aquele: é muito gostoso!',
            'Este café es mejor que aquel: ¡es muy rico!',
            'melhor',
            ['mais bom', 'pior', 'maior'],
            ['pt-melhor'],
            { id: 'pt.ex.wcxfvdi8mws7gj', explanation: 'No se dice mais bom: melhor.' },
          ),
          ex.fillBlank(
            'O meu quarto é ___ do que o seu: é pequeno.',
            'Mi cuarto es más chico que el tuyo: es pequeño.',
            'menor',
            ['maior', 'melhor', 'menos'],
            ['pt-menor'],
            { id: 'pt.ex.qvyztcmew5xyau' },
          ),
          question(
            'pt.ex.8x9xzewukeiig4',
            TROCA,
            '¿Por qué vuelve la clienta a la tienda?',
            'Las zapatillas le quedaron chicas y quiere un número más grande',
            [
              'Las zapatillas le quedaron grandes',
              'Quiere otro color',
              'Quiere devolver el dinero',
            ],
            ['pt-maior', 'pt-trocar', 'pt-tenis'],
            'Dice: «comprei este tênis ontem, mas ficou pequeno. Posso trocar por um número maior?».',
          ),
          ex.orderWords(
            'Este restaurante é pior do que aquele.',
            'Este restaurante es peor que aquel.',
            ['pt-pior', 'pt-do-que'],
            {
              id: 'pt.ex.apd4fqb3pch3nt',
            },
          ),
          ex.shortAnswer(
            'Este tamanho está bom?',
            '¿Esta talla está bien? (Responde que no, que quieres una más grande.)',
            'Não, eu queria um tamanho maior.',
            [
              'Não, quero um tamanho maior.',
              'Não, você tem um tamanho maior?',
              'Não. Eu queria um maior.',
              'Não, um tamanho maior, por favor.',
            ],
            ['pt-maior', 'pt-tamanho'],
            { id: 'pt.ex.ojuyhg713hh98h' },
          ),
          ex.translateWrite(
            '¿Tienes una talla más chica?',
            'Você tem um tamanho menor?',
            ['pt-menor', 'pt-tamanho'],
            {
              id: 'pt.ex.fljiuhtth6ytjw',
              acceptedAnswers: ['Tem um tamanho menor?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Posso provar?',
        objective: 'Probarte ropa y pedir otra talla.',
        intro: {
          explanation:
            'Provar es «probarse» (y «probar» comida): posso provar esta calça? Falsos amigos: calça es el «pantalón» y tênis, las «zapatillas». O tamanho es el talle; en calzado se dice o número.',
          examples: [
            { target: 'Posso provar esta calça?', base: '¿Me puedo probar este pantalón?' },
            { target: 'Qual é o seu tamanho?', base: '¿Cuál es tu talla?' },
          ],
        },
        takeaways: ['Pides probarte algo: posso provar…?', 'Sabes que calça es «pantalón».'],
        exercises: [
          ex.translationChoice('calça', 'pantalón', ['calza', 'calzado', 'media'], ['pt-calca'], {
            id: 'pt.ex.kqrilxqpux8l85',
            explanation: 'Falso amigo: calça es el pantalón.',
          }),
          ex.imageChoice('👟', 'tênis', ['calça', 'camiseta', 'sapato'], ['pt-tenis'], {
            id: 'pt.ex.0klbkabn9p16k2',
          }),
          ex.imageChoice('👖', 'calça', ['tênis', 'camiseta', 'sapato'], ['pt-calca'], {
            id: 'pt.ex.1efqen9t2vtm4u',
          }),
          ex.listenChoice(
            'Posso provar esta calça?',
            ['Posso provar esta camiseta?', 'Posso trocar esta calça?', 'Pode provar esta calça?'],
            ['pt-provar', 'pt-calca'],
            { id: 'pt.ex.jgsj4yqtzhis9k' },
          ),
          ex.fillBlank(
            'Posso ___ este tênis?',
            '¿Me puedo probar estas zapatillas?',
            'provar',
            ['prova', 'trocar', 'pagar'],
            ['pt-provar', 'pt-tenis'],
            { id: 'pt.ex.ioukhqy6ioqmpl' },
          ),
          ex.fillBlank(
            'Qual é o seu ___? — M.',
            '¿Cuál es tu talla? — M.',
            'tamanho',
            ['número', 'preço', 'troca'],
            ['pt-tamanho'],
            { id: 'pt.ex.lx3rkmzi3474g4', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.e56sgoctr69cuk',
            LOJA,
            '¿Qué quiere la clienta?',
            'Probarse un pantalón en una talla más grande',
            ['Comprar unas zapatillas', 'Cambiar una camiseta', 'Pagar en cuotas'],
            ['pt-provar', 'pt-calca', 'pt-tamanho', 'pt-desconto'],
            'Dice: «Posso provar esta calça? Mas eu queria um tamanho maior».',
          ),
          ex.orderWords(
            'Eu queria provar um tênis branco.',
            'Quería probarme unas zapatillas blancas.',
            ['pt-provar', 'pt-tenis'],
            {
              id: 'pt.ex.xgshf645f2dbny',
            },
          ),
          ex.shortAnswer(
            'Posso ajudar? (provar 👖)',
            '¿Te ayudo? (Pregunta si te puedes probar el pantalón.)',
            'Posso provar esta calça?',
            [
              'Eu posso provar esta calça?',
              'Posso provar a calça?',
              'Sim, posso provar esta calça?',
            ],
            ['pt-provar', 'pt-calca'],
            { id: 'pt.ex.ryfv0aaebzz11n' },
          ),
          ex.translateWrite(
            '¿Me puedo probar estas zapatillas?',
            'Posso provar este tênis?',
            ['pt-provar', 'pt-tenis'],
            {
              id: 'pt.ex.2hneipnczhdl31',
              acceptedAnswers: ['Eu posso provar este tênis?', 'Posso provar esse tênis?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Desconto e troca',
        objective: 'Entender ofertas y cambiar un producto.',
        intro: {
          explanation:
            'Desconto es «descuento» y liquidação, la «liquidación». Trocar es «cambiar» un producto: posso trocar? En Brasil es común pagar em três vezes sem juros (en tres cuotas sin interés).',
          examples: [
            { target: 'A loja está em liquidação.', base: 'La tienda está de liquidación.' },
            {
              target: 'Posso trocar por um tamanho maior?',
              base: '¿Lo puedo cambiar por una talla más grande?',
            },
          ],
        },
        takeaways: [
          'Entiendes ofertas: desconto, liquidação.',
          'Cambias un producto: posso trocar?',
        ],
        exercises: [
          ex.translationChoice(
            'trocar',
            'cambiar (un producto)',
            ['tocar', 'trabar', 'devolver el dinero'],
            ['pt-trocar'],
            { id: 'pt.ex.9edp3b8vyzd1d8' },
          ),
          ex.translationChoice(
            'liquidação',
            'liquidación / rebajas',
            ['factura', 'caja', 'vitrina'],
            ['pt-liquidacao'],
            { id: 'pt.ex.f95qr2xfedmmil' },
          ),
          ex.imageChoice('🏷️', 'desconto', ['tamanho', 'liquidação', 'tênis'], ['pt-desconto'], {
            id: 'pt.ex.vc7biy7ri1aurv',
          }),
          ex.listenChoice(
            'Posso trocar esta camiseta?',
            [
              'Posso provar esta camiseta?',
              'Posso trocar esta calça?',
              'Pode trocar esta camiseta?',
            ],
            ['pt-trocar'],
            { id: 'pt.ex.d5d91v9yr89msj' },
          ),
          question(
            'pt.ex.yqrrdswe3ekcae',
            LIQUIDACAO,
            '¿Qué descuento tienen las zapatillas?',
            'Hasta el 50 %',
            ['El 50 % justo', 'Hasta el 30 %', 'Ninguno'],
            ['pt-desconto', 'pt-tenis', 'pt-liquidacao'],
            'El cartel dice: «Tênis e sandálias com até 50% de desconto».',
          ),
          question(
            'pt.ex.hiocxh4wxony76',
            LIQUIDACAO,
            '¿Cómo se puede pagar?',
            'Hasta en tres cuotas sin interés con tarjeta',
            ['Solo en efectivo', 'En diez cuotas', 'Con interés'],
            ['pt-liquidacao'],
            'Dice: «Pagamento em até três vezes sem juros no cartão».',
          ),
          question(
            'pt.ex.ia3pwakvcj6soc',
            LOJA,
            '¿Qué hace falta para cambiar el pantalón?',
            'La factura, dentro de treinta días',
            ['Nada, se cambia siempre', 'Pagar un poco más', 'Volver en tres días'],
            ['pt-trocar'],
            'La vendedora dice: «Com a nota fiscal, você tem trinta dias para trocar».',
          ),
          ex.fillBlank(
            'Tem ___ se eu pagar à vista?',
            '¿Hay descuento si pago en efectivo?',
            'desconto',
            ['tamanho', 'troca', 'provador'],
            ['pt-desconto'],
            { id: 'pt.ex.5w1sjqlc31sh6e', skill: 'vocabulary' },
          ),
          ex.shortAnswer(
            'O tênis ficou pequeno. O que você pergunta?',
            'Las zapatillas te quedaron chicas. (Pregunta si las puedes cambiar por un número más grande.)',
            'Posso trocar por um número maior?',
            [
              'Posso trocar por um tamanho maior?',
              'Eu posso trocar por um número maior?',
              'Posso trocar?',
            ],
            ['pt-trocar', 'pt-maior'],
            { id: 'pt.ex.qpa58bravhuc5b' },
          ),
          ex.translateWrite('¿Lo puedo cambiar?', 'Posso trocar?', ['pt-trocar'], {
            id: 'pt.ex.2njej8w2b6qdh4',
            acceptedAnswers: ['Eu posso trocar?', 'Dá para trocar?'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'O melhor do ano',
        objective: 'Elegir lo mejor: tão… quanto y el superlativo.',
        intro: {
          explanation:
            'Igualdad: tão + adjetivo + quanto (tão boa quanto). Superlativo: o / a mais + adjetivo (o mais barato da loja) y los irregulares o melhor, o pior. «De» la tienda se dice da loja.',
          examples: [
            {
              target: 'A câmera é tão boa quanto a do outro.',
              base: 'La cámara es tan buena como la del otro.',
            },
            {
              target: 'Este é o tênis mais barato da loja.',
              base: 'Estas son las zapatillas más baratas de la tienda.',
            },
          ],
        },
        takeaways: ['Dices que algo es igual: tão… quanto.', 'Eliges lo mejor: o melhor, o mais…'],
        exercises: [
          ex.translationChoice('tão', 'tan', ['tanto', 'también', 'todo'], ['pt-tao'], {
            id: 'pt.ex.zn0d95g57gkf0h',
          }),
          ex.fillBlank(
            'A camiseta é tão bonita ___ a calça.',
            'La camiseta es tan linda como el pantalón.',
            'quanto',
            ['de', 'do que', 'que'],
            ['pt-tao'],
            { id: 'pt.ex.kir6taj5cvke6r', explanation: 'Igualdad: tão… quanto.' },
          ),
          ex.fillBlank(
            'É o celular ___ caro da loja.',
            'Es el celular más caro de la tienda.',
            'mais',
            ['menos', 'tão', 'muito'],
            ['pt-o-mais'],
            { id: 'pt.ex.iqa8peg9dwqsml' },
          ),
          ex.listenChoice(
            'É o melhor celular do ano.',
            ['É o pior celular do ano.', 'É o melhor celular da loja.', 'É um celular melhor.'],
            ['pt-melhor'],
            { id: 'pt.ex.kyy30t6z0s0c6u' },
          ),
          question(
            'pt.ex.5yrvtcwoq1lxd3',
            CELULARES,
            '¿Qué ventaja tiene el Fone Y?',
            'La pantalla es más grande',
            ['Es más barato', 'Es más liviano', 'Tiene mejor batería'],
            ['pt-maior'],
            'Davi escribe: «O Fone Y tem uma tela maior, mas é mais caro e mais pesado».',
          ),
          question(
            'pt.ex.fbcv0vepm097zm',
            CELULARES,
            '¿Cómo es la cámara del Fone X?',
            'Tan buena como la del Fone Y',
            ['Mejor que la del Fone Y', 'Peor que la del Fone Y', 'No tiene cámara'],
            ['pt-tao'],
            'Dice: «A câmera do Fone X é tão boa quanto a do Fone Y».',
          ),
          question(
            'pt.ex.4m9ai8p5ta33tt',
            CELULARES,
            '¿Qué piensa Davi del Fone X?',
            'Que es el mejor celular del año',
            ['Que es el más caro', 'Que es peor que el Fone Y', 'Que tiene la peor batería'],
            ['pt-melhor', 'pt-o-mais'],
            'Al final: «o Fone X é o melhor celular do ano».',
          ),
          ex.orderWords(
            'Este é o tênis mais barato da loja.',
            'Estas son las zapatillas más baratas de la tienda.',
            ['pt-o-mais', 'pt-tenis'],
            {
              id: 'pt.ex.34fmnswmdc1eow',
            },
          ),
          ex.shortAnswer(
            'Qual é o melhor restaurante da sua cidade? (Casa Nova)',
            '¿Cuál es el mejor restaurante de tu ciudad? (Responde que es Casa Nova.)',
            'O melhor restaurante é o Casa Nova.',
            ['É o Casa Nova.', 'O Casa Nova.', 'O melhor é o Casa Nova.'],
            ['pt-melhor'],
            { id: 'pt.ex.h065tln6gs6ljn' },
          ),
          ex.translateWrite(
            'Es el mejor café de la ciudad.',
            'É o melhor café da cidade.',
            ['pt-melhor'],
            { id: 'pt.ex.vxo1nej8hvzfrl' },
          ),
        ],
      },
    ],
  },
};

import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U9 «Compras y servicios» (docs/IT_A1_A2.md): comparar (più / meno … di), los superlativos
 * (il più caro, -issimo), migliore y peggiore, el pronombre ne con cantidades (ne vorrei tre) y las
 * compras: talles, probador, descuentos, liquidaciones y el mercado (un chilo, un etto).
 * Falso amigo: i saldi son las liquidaciones (no el saldo de una cuenta).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NEGOZIO = dialogue('it.stim.a2-u9-negozio', 'Una clienta en una tienda de ropa.', [
  ['Commessa', 'Buongiorno! Posso aiutarla?'],
  ['Cliente', 'Sì, cerco una giacca. Questa nera è bellissima. Posso provarla?'],
  ['Commessa', 'Certo, il camerino è lì. Che taglia porta?'],
  ['Cliente', 'La 42… Mi dispiace, è un po’ stretta. Avete una taglia più grande?'],
  ['Commessa', 'Sì, ecco la 44. E oggi c’è lo sconto del venti per cento!'],
]);

const MERCATO = dialogue(
  'it.stim.a2-u9-mercato',
  'Una señora hace las compras en un puesto del mercado.',
  [
    ['Venditore', 'Buongiorno, signora! Cosa le do?'],
    ['Signora', 'Vorrei un chilo di pomodori e due etti di prosciutto.'],
    ['Venditore', 'Ecco. Vuole anche delle mele? Sono le migliori del mercato!'],
    ['Signora', 'Sì, ne prendo tre.'],
    ['Venditore', 'Perfetto: sono dodici euro.'],
  ],
);

const SALDI = reading(
  'it.stim.a2-u9-saldi',
  'notice',
  'Un cartel en la vidriera de una tienda.',
  [
    'Saldi d’estate! Fino al 31 luglio.',
    'Magliette e pantaloni: meno trenta per cento.',
    'Scarpe: meno cinquanta per cento!',
    'Il negozio più economico del centro.',
  ],
  { title: 'Grandi saldi' },
);

const CONFRONTO = reading(
  'it.stim.a2-u9-confronto',
  'post',
  'Rosa compara el mercado y el supermercado en su blog de cocina.',
  [
    'Al mercato la frutta è più buona e meno cara.',
    'Il supermercato è più comodo: è aperto anche la sera.',
    'Ma per me il mercato è il migliore: ci sono le persone più simpatiche del quartiere!',
  ],
  { from: 'Rosa', title: 'Mercato o supermercato?' },
);

export const IT_A2_U09: ItUnitDef = {
  names: ['Commessa', 'Cliente', 'Venditore', 'Signora', 'Rosa', 'Firenze'],
  support: [
    'aiutarla',
    'cerco',
    'provarla',
    'stretta',
    'do',
    'pomodori',
    'prosciutto',
    'delle',
    'mele',
    'grandi',
    'magliette',
    'persone',
    'quartiere',
    'mondo',
    'questi',
    'conti',
    'prezzi',
  ],
  unit: {
    position: 9,
    title: 'Compras y servicios',
    titleEn: 'Negozi e servizi',
    description:
      'Comparar productos y precios, elegir el mejor, comprar ropa (tallas, probador, descuentos) y hacer las compras en el mercado.',
    emoji: '🛍️',
    objective:
      'Puedes comparar (più caro di, meno caro), decir cuál es el mejor o el peor, comprar ropa preguntando la talla y el descuento, y pedir cantidades en el mercado (un etto, ne vorrei tre).',
    grammar: {
      title: 'Comparativos y superlativos · ne',
      explanation:
        'Para comparar: più / meno + adjetivo + di (Roma è più grande di Firenze). Mejor y peor como adjetivo: migliore, peggiore (il migliore del mercato). El superlativo: il più caro del negozio, o con -issimo (bellissimo, carissimo). Ne reemplaza una cantidad de algo que ya se nombró: Quante mele vuole? — Ne prendo tre. En el mercado se pide por chilo y por etto (100 gramos). Ojo: i saldi son las liquidaciones.',
      examples: [
        {
          target: 'Il mercato è meno caro del supermercato.',
          base: 'El mercado es menos caro que el súper.',
        },
        {
          target: 'È il ristorante migliore della città.',
          base: 'Es el mejor restaurante de la ciudad.',
        },
        {
          target: 'Quante mele vuole? — Ne prendo tre.',
          base: '¿Cuántas manzanas quiere? — Llevo tres.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U9). Sin revisión nativa: revisar los tallas, cosa le do?, delle mele y el uso de ne.',
    },
    words: [
      w(
        'it-piu',
        'più',
        'más',
        'Roma è più grande di Firenze.',
        'Roma es más grande que Florencia.',
        ['comparisons'],
      ),
      w('it-meno', 'meno', 'menos', 'Il mercato è meno caro.', 'El mercado es menos caro.', [
        'comparisons',
      ]),
      w(
        'it-mercato',
        'mercato',
        'mercado',
        'Faccio la spesa al mercato.',
        'Hago las compras en el mercado.',
        ['shopping', 'places'],
        {
          emoji: '🧺',
        },
      ),
      w(
        'it-migliore',
        'migliore',
        'mejor (adjetivo)',
        'È il caffè migliore della città.',
        'Es el mejor café de la ciudad.',
        ['comparisons'],
        {
          acceptedTranslations: ['mejor'],
        },
      ),
      w(
        'it-peggiore',
        'peggiore',
        'peor',
        'È il caffè peggiore del bar.',
        'Es el peor café del bar.',
        ['comparisons'],
      ),
      w(
        'it-il-piu',
        'il più',
        'el más',
        'È il negozio più economico.',
        'Es la tienda más barata.',
        ['comparisons'],
        {
          acceptedTexts: ['la più'],
          acceptedTranslations: ['la más'],
        },
      ),
      w(
        'it-bellissimo',
        'bellissimo',
        'hermosísimo',
        'Il mare è bellissimo.',
        'El mar es hermosísimo.',
        ['comparisons', 'descriptions'],
        {
          acceptedTexts: ['bellissima'],
          acceptedTranslations: ['lindísimo', 'lindísima', 'hermosísima'],
        },
      ),
      w(
        'it-giacca',
        'giacca',
        'chaqueta',
        'La giacca è nera.',
        'La chaqueta es negra.',
        ['clothes', 'shopping'],
        {
          acceptedTranslations: ['saco', 'chaqueta', 'campera'],
          emoji: '🧥',
        },
      ),
      w(
        'it-pantaloni',
        'pantaloni',
        'pantalón',
        'Posso provare questi pantaloni?',
        '¿Puedo probarme este pantalón?',
        ['clothes', 'shopping'],
        {
          acceptedTranslations: ['pantalones'],
          emoji: '👖',
        },
      ),
      w(
        'it-provare',
        'provare',
        'probar',
        'Posso provare la giacca?',
        '¿Puedo probarme la chaqueta?',
        ['shopping', 'verbs'],
        {
          acceptedTranslations: ['probarse'],
        },
      ),
      w(
        'it-taglia',
        'taglia',
        'talla',
        'Che taglia porta?',
        '¿Qué talla usa?',
        ['clothes', 'shopping'],
        { acceptedTranslations: ['talle'] },
      ),
      w('it-camerino', 'camerino', 'probador', 'Il camerino è lì.', 'El probador está ahí.', [
        'clothes',
        'shopping',
      ]),
      w(
        'it-sconto',
        'sconto',
        'descuento',
        'C’è lo sconto del venti per cento.',
        'Hay un descuento del veinte por ciento.',
        ['shopping'],
        {
          emoji: '🏷️',
        },
      ),
      w(
        'it-saldi',
        'saldi',
        'liquidación',
        'A luglio ci sono i saldi.',
        'En julio hay liquidaciones.',
        ['shopping'],
        {
          acceptedTranslations: ['liquidaciones', 'rebajas'],
        },
      ),
      w('it-ne', 'ne', 'de eso (una cantidad)', 'Ne prendo tre.', 'Llevo tres.', [
        'pronouns',
        'shopping',
      ]),
      w(
        'it-un-chilo',
        'un chilo',
        'un kilo',
        'Un chilo di pomodori, per favore.',
        'Un kilo de tomates, por favor.',
        ['shopping', 'food'],
      ),
      w(
        'it-un-etto',
        'un etto',
        'cien gramos',
        'Un etto di prosciutto, per favore.',
        'Cien gramos de jamón, por favor.',
        ['shopping', 'food'],
        {
          acceptedTexts: ['due etti'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Più caro, meno caro',
        objective: 'Comparar con più y meno.',
        intro: {
          explanation:
            'Para comparar: più (más) o meno (menos) + adjetivo + di: Roma è più grande di Firenze. Di se une al artículo: meno caro del supermercato (di + il).',
          examples: [
            { target: 'Roma è più grande di Firenze.', base: 'Roma es más grande que Florencia.' },
            {
              target: 'Il mercato è meno caro del supermercato.',
              base: 'El mercado es menos caro que el súper.',
            },
          ],
        },
        takeaways: ['Comparas con più / meno … di.', 'Unes di con el artículo: del, della.'],
        exercises: [
          ex.translationChoice('meno', 'menos', ['más', 'mejor', 'muy'], ['it-meno'], {
            id: 'it.ex.3plhhvhz6j5qds',
          }),
          ex.fillBlank(
            'Roma è più grande ___ Firenze.',
            'Roma es más grande que Florencia.',
            'di',
            ['che', 'come', 'da'],
            ['it-piu'],
            {
              id: 'it.ex.c198a4khi84cv4',
              explanation:
                'El «que» de la comparación es di delante de un nombre: più grande di Firenze.',
            },
          ),
          ex.fillBlank(
            'Il mercato è ___ caro del supermercato.',
            'El mercado es menos caro que el súper.',
            'meno',
            ['più', 'molto', 'troppo'],
            ['it-meno', 'it-mercato'],
            {
              id: 'it.ex.wp7fex514l0mas',
            },
          ),
          ex.listenChoice(
            'Questa maglietta è più economica.',
            [
              'Questa maglietta è meno economica.',
              'Questa borsa è più economica.',
              'Questa maglietta è più cara.',
            ],
            ['it-piu', 'it-economico'],
            { id: 'it.ex.b5ysqmag3lov28' },
          ),
          question(
            'it.ex.0490ryfi7k4l0p',
            CONFRONTO,
            '¿Qué tiene de bueno el mercado, según Rosa?',
            'La fruta es más rica y más barata',
            ['Abre también a la noche', 'Es más cómodo', 'Tiene más productos'],
            ['it-piu', 'it-meno', 'it-mercato', 'it-migliore'],
            'Rosa escribe: «Al mercato la frutta è più buona e meno cara».',
          ),
          question(
            'it.ex.1rw3lnllol8bib',
            CONFRONTO,
            '¿Y el supermercado?',
            'Es más cómodo: abre también a la noche',
            ['Es más barato', 'Tiene la fruta más rica', 'Está cerca de su casa'],
            ['it-piu'],
            'Rosa escribe: «Il supermercato è più comodo: è aperto anche la sera».',
          ),
          ex.orderWords(
            'Mio fratello è più alto di me.',
            'Mi hermano es más alto que yo.',
            ['it-piu'],
            { id: 'it.ex.s85unurwa0t26s' },
          ),
          ex.shortAnswer(
            'È più grande Roma o Firenze?',
            '¿Qué ciudad es más grande, Roma o Florencia? (Responde que Roma es más grande que Florencia.)',
            'Roma è più grande di Firenze.',
            ['Roma è più grande.', 'Roma.'],
            ['it-piu'],
            { id: 'it.ex.dvmq4jo5p3xiar' },
          ),
          ex.translateWrite(
            'El mercado es menos caro.',
            'Il mercato è meno caro.',
            ['it-meno', 'it-mercato'],
            { id: 'it.ex.fmmy823pgg6nhz' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Il migliore, bellissimo',
        objective: 'Decir cuál es el mejor, el peor o el más.',
        intro: {
          explanation:
            'Mejor y peor como adjetivo: migliore y peggiore (il caffè migliore della città). Para «el más»: il più / la più + adjetivo (la città più bella). Y para «muy, muy»: -issimo (bellissimo, carissimo).',
          examples: [
            {
              target: 'È il ristorante migliore della città.',
              base: 'Es el mejor restaurante de la ciudad.',
            },
            { target: 'La giacca è bellissima!', base: '¡La chaqueta es hermosísima!' },
          ],
        },
        takeaways: ['Usas migliore y peggiore.', 'Dices il più… y -issimo.'],
        exercises: [
          ex.translationChoice(
            'migliore',
            'mejor (adjetivo)',
            ['mayor', 'peor', 'menor'],
            ['it-migliore'],
            { id: 'it.ex.z5dmlmc7d2hlvo' },
          ),
          ex.fillBlank(
            'È il ristorante ___ della città.',
            'Es el mejor restaurante de la ciudad.',
            'migliore',
            ['meglio', 'peggiore', 'più'],
            ['it-migliore', 'it-ristorante'],
            {
              id: 'it.ex.i876m4e2ek5fl1',
              explanation:
                'Con un nombre, «mejor» es migliore; meglio acompaña a un verbo (sto meglio).',
            },
          ),
          ex.fillBlank(
            'È la città ___ bella del mondo.',
            'Es la ciudad más linda del mundo.',
            'più',
            ['meno', 'molto', 'migliore'],
            ['it-il-piu', 'it-citta'],
            {
              id: 'it.ex.wy2ewd0n8b6urv',
            },
          ),
          ex.listenChoice(
            'Questo è il caffè peggiore del bar!',
            [
              'Questo è il caffè migliore del bar!',
              'Questo è il cornetto peggiore del bar!',
              'Questo caffè è peggiore.',
            ],
            ['it-peggiore', 'it-caffe'],
            { id: 'it.ex.41lwf1xpvnjlqk' },
          ),
          ex.translationChoice(
            'bellissimo',
            'hermosísimo',
            ['más lindo', 'lindo', 'el más lindo'],
            ['it-bellissimo'],
            { id: 'it.ex.vloin0v1zg1wag' },
          ),
          question(
            'it.ex.6j70bjr0580aez',
            CONFRONTO,
            '¿Por qué el mercado es el mejor para Rosa?',
            'Porque ahí está la gente más simpática del barrio',
            [
              'Porque es el más barato de la ciudad',
              'Porque abre los domingos',
              'Porque queda cerca',
            ],
            ['it-migliore', 'it-il-piu'],
            'Rosa escribe: «il mercato è il migliore: ci sono le persone più simpatiche del quartiere!».',
          ),
          ex.shortAnswer(
            'Com’è la giacca?',
            '¿Cómo es la chaqueta? (Responde que es hermosísima.)',
            'È bellissima!',
            ['È bellissima.', 'Bellissima!', 'La giacca è bellissima!'],
            ['it-bellissimo', 'it-giacca'],
            { id: 'it.ex.dwmbu80ljthhuw' },
          ),
          ex.translateWrite(
            'Es el peor café de la ciudad.',
            'È il caffè peggiore della città.',
            ['it-peggiore', 'it-citta'],
            {
              id: 'it.ex.rwbnze888nkt3u',
              acceptedAnswers: [
                'È il peggiore caffè della città.',
                'È il peggior caffè della città.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Posso provare?',
        objective: 'Comprar ropa: talla y probador.',
        intro: {
          explanation:
            'En una tienda de ropa: posso provare…? (¿puedo probarme…?), che taglia porta? (¿qué talla usa?) e il camerino (el probador). I pantaloni va en plural, como en español «los pantalones».',
          examples: [
            { target: 'Posso provare questi pantaloni?', base: '¿Puedo probarme este pantalón?' },
            { target: 'Il camerino è lì, a destra.', base: 'El probador está ahí, a la derecha.' },
          ],
        },
        takeaways: ['Pides probarte algo con posso provare…?', 'Entiendes che taglia porta?'],
        exercises: [
          ex.imageChoice('🧥', 'giacca', ['pantaloni', 'maglietta', 'scarpe'], ['it-giacca'], {
            id: 'it.ex.48tnet1y0ymmkj',
          }),
          ex.imageChoice('👖', 'pantaloni', ['giacca', 'maglietta', 'borsa'], ['it-pantaloni'], {
            id: 'it.ex.ly5so086zh1on7',
          }),
          ex.translationChoice('taglia', 'talla', ['tajada', 'corte', 'tela'], ['it-taglia'], {
            id: 'it.ex.4bqkv0r3debtx2',
          }),
          ex.listenChoice(
            'Posso provare questi pantaloni?',
            [
              'Posso provare questa giacca?',
              'Posso pagare questi pantaloni?',
              'Puoi provare questi pantaloni?',
            ],
            ['it-provare', 'it-pantaloni'],
            { id: 'it.ex.zo422ay8mra2zi' },
          ),
          ex.fillBlank(
            'Il ___ è lì, a destra.',
            'El probador está ahí, a la derecha.',
            'camerino',
            ['taglia', 'mercato', 'negozio'],
            ['it-camerino'],
            {
              id: 'it.ex.lomtlzpyf3w12k',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.2vi0anne45zxqc',
            NEGOZIO,
            '¿Qué busca la clienta?',
            'Una chaqueta',
            ['Un pantalón', 'Zapatos', 'Una camiseta'],
            ['it-giacca', 'it-bellissimo'],
            'La clienta dice: «cerco una giacca. Questa nera è bellissima».',
          ),
          question(
            'it.ex.7l8pj4dzgfqdiu',
            NEGOZIO,
            '¿Qué problema tiene con la primera chaqueta?',
            'Le queda un poco ajustada y pide una talla más grande',
            ['No le gusta el color', 'Es demasiado cara', 'Le queda grande'],
            ['it-taglia', 'it-provare', 'it-camerino', 'it-sconto'],
            'La clienta dice: «è un po’ stretta. Avete una taglia più grande?».',
          ),
          ex.shortAnswer(
            'Che taglia porta?',
            '¿Qué talla usa? (Responde que usas el 40.)',
            'Porto la 40.',
            ['La 40.', 'Porto la quaranta.', 'La quaranta.'],
            ['it-taglia'],
            { id: 'it.ex.s9gruwb15dx6mw' },
          ),
          ex.translateWrite(
            '¿Puedo probarme el pantalón?',
            'Posso provare i pantaloni?',
            ['it-provare', 'it-pantaloni'],
            { id: 'it.ex.5xru7t9536fbnu' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Sconti e saldi',
        objective: 'Entender descuentos y liquidaciones.',
        intro: {
          explanation:
            'Lo sconto es el descuento: lo sconto del venti per cento. I saldi son las liquidaciones de fin de temporada (en Italia, en enero y en julio). Ojo: no tienen nada que ver con el saldo de una cuenta.',
          examples: [
            {
              target: 'Oggi c’è lo sconto del venti per cento.',
              base: 'Hoy hay un descuento del veinte por ciento.',
            },
            { target: 'A luglio ci sono i saldi.', base: 'En julio hay liquidaciones.' },
          ],
        },
        takeaways: ['Entiendes lo sconto y i saldi.', 'Lees un cartel de liquidación.'],
        exercises: [
          ex.translationChoice(
            'saldi',
            'liquidación',
            ['saldo (de una cuenta)', 'sal', 'sueldos'],
            ['it-saldi'],
            {
              id: 'it.ex.m26bdlx2cqy3rr',
              explanation: 'I saldi son las liquidaciones de temporada.',
            },
          ),
          ex.translationChoice(
            'sconto',
            'descuento',
            ['cuenta', 'escondite', 'cobro'],
            ['it-sconto'],
            { id: 'it.ex.i33l8pvaqdt1wb' },
          ),
          ex.listenChoice(
            'Oggi c’è lo sconto del venti per cento.',
            [
              'Oggi c’è lo sconto del trenta per cento.',
              'Domani c’è lo sconto del venti per cento.',
              'Oggi non c’è lo sconto.',
            ],
            ['it-sconto'],
            { id: 'it.ex.tv1g557xd5mcpd' },
          ),
          ex.fillBlank(
            'A luglio ci sono i ___.',
            'En julio hay liquidaciones.',
            'saldi',
            ['conti', 'prezzi', 'negozi'],
            ['it-saldi', 'it-luglio'],
            {
              id: 'it.ex.c9i5q9bdmspjts',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.tc408097f6khqp',
            SALDI,
            '¿Hasta cuándo dura la liquidación?',
            'Hasta el 31 de julio',
            ['Hasta el 31 de junio', 'Todo el verano', 'Sólo hoy'],
            ['it-saldi'],
            'El cartel dice: «Saldi d’estate! Fino al 31 luglio».',
          ),
          question(
            'it.ex.7srpc9x63vcg78',
            SALDI,
            '¿Cuánto descuento tienen los zapatos?',
            'El cincuenta por ciento',
            ['El treinta por ciento', 'El veinte por ciento', 'No tienen descuento'],
            ['it-sconto', 'it-meno'],
            'El cartel dice: «Scarpe: meno cinquanta per cento!».',
          ),
          question(
            'it.ex.hju1tgqi56gqcf',
            NEGOZIO,
            '¿Qué descuento hay hoy en la tienda de ropa?',
            'El veinte por ciento',
            ['El cincuenta por ciento', 'Ninguno', 'El cuarenta y cuatro por ciento'],
            ['it-sconto'],
            'La vendedora dice: «oggi c’è lo sconto del venti per cento!».',
          ),
          ex.orderWords(
            'Con lo sconto le scarpe sono meno care.',
            'Con el descuento los zapatos son menos caros.',
            ['it-sconto', 'it-meno'],
            {
              id: 'it.ex.u6i07yuaxn5j8o',
            },
          ),
          ex.shortAnswer(
            'C’è uno sconto?',
            '¿Hay descuento? (Responde que sí, del treinta por ciento.)',
            'Sì, del trenta per cento.',
            [
              'Sì, c’è lo sconto del trenta per cento.',
              'Del trenta per cento.',
              "Sì, c'è lo sconto del trenta per cento.",
            ],
            ['it-sconto'],
            { id: 'it.ex.aox4nt1qms78pw' },
          ),
          ex.translateWrite(
            'Hay liquidaciones en el centro.',
            'Ci sono i saldi in centro.',
            ['it-saldi'],
            { id: 'it.ex.b5tzugz5lgp587' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Al mercato: ne prendo tre',
        objective: 'Pedir cantidades en el mercado y usar ne.',
        intro: {
          explanation:
            'En el mercado se pide un chilo (un kilo) o un etto (cien gramos): due etti di prosciutto. Ne reemplaza una cantidad de algo que ya se nombró: Quante mele vuole? — Ne prendo tre (llevo tres). También: Quanti anni hai? — Ne ho venti.',
          examples: [
            { target: 'Vorrei un chilo di pomodori.', base: 'Quisiera un kilo de tomates.' },
            {
              target: 'Quante mele vuole? — Ne prendo tre.',
              base: '¿Cuántas manzanas quiere? — Llevo tres.',
            },
          ],
        },
        takeaways: ['Pides por chilo y por etto.', 'Usas ne con una cantidad.'],
        exercises: [
          ex.translationChoice(
            'un etto',
            'cien gramos',
            ['un kilo', 'medio kilo', 'un litro'],
            ['it-un-etto'],
            {
              id: 'it.ex.yb280ly95g3csc',
              explanation: 'Un etto son cien gramos: due etti = doscientos gramos.',
            },
          ),
          ex.fillBlank(
            'Quante mele vuole? — ___ prendo tre.',
            '¿Cuántas manzanas quiere? — Llevo tres.',
            'Ne',
            ['Le', 'Ci', 'Lo'],
            ['it-ne'],
            {
              id: 'it.ex.x91bmsrpvrfs1e',
              explanation: 'Ne reemplaza «de las manzanas» con una cantidad: ne prendo tre.',
            },
          ),
          ex.fillBlank(
            'Vorrei un ___ di pomodori.',
            'Quisiera un kilo de tomates.',
            'chilo',
            ['etto', 'mese', 'anno'],
            ['it-un-chilo'],
            {
              id: 'it.ex.4mx93sp0dvoch0',
              skill: 'vocabulary',
            },
          ),
          ex.listenChoice(
            'Due etti di prosciutto, per favore.',
            [
              'Tre etti di prosciutto, per favore.',
              'Un chilo di prosciutto, per favore.',
              'Due etti di pomodori, per favore.',
            ],
            ['it-un-etto'],
            { id: 'it.ex.g1aj0lous2zs1q' },
          ),
          question(
            'it.ex.flzg84wjym3y5w',
            MERCATO,
            '¿Qué pide primero la señora?',
            'Un kilo de tomates y doscientos gramos de jamón',
            [
              'Dos kilos de tomates y un poco de jamón',
              'Tres manzanas',
              'Doscientos gramos de tomates',
            ],
            ['it-un-chilo', 'it-un-etto'],
            'La señora dice: «Vorrei un chilo di pomodori e due etti di prosciutto».',
          ),
          question(
            'it.ex.saof45upsf3cau',
            MERCATO,
            '¿Cuántas manzanas lleva?',
            'Tres',
            ['Un kilo', 'Ninguna', 'Doce'],
            ['it-ne', 'it-migliore'],
            'El vendedor dice que son las mejores y ella responde: «Sì, ne prendo tre».',
          ),
          question(
            'it.ex.nffoua6nxvt3ed',
            MERCATO,
            '¿Cuánto paga en total?',
            'Doce euros',
            ['Dos euros', 'Veinte euros', 'Tres euros'],
            ['it-un-chilo'],
            'El vendedor dice: «sono dodici euro».',
          ),
          ex.shortAnswer(
            'Quanti anni hai?',
            '¿Cuántos años tienes? (Responde con ne que tienes veinte.)',
            'Ne ho venti.',
            ['Ne ho venti!', 'Ho venti anni.'],
            ['it-ne'],
            { id: 'it.ex.xox5gwiewa7oco' },
          ),
          ex.translateWrite(
            'Quisiera cien gramos de jamón.',
            'Vorrei un etto di prosciutto.',
            ['it-un-etto', 'it-vorrei'],
            { id: 'it.ex.67sllhospse23r' },
          ),
        ],
      },
    ],
  },
};

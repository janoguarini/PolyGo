import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U8 «Compras y comparaciones» (docs/ZH_A1_A2.md): ropa y probarse (试试), quedar bien,
 * cambiar y elegir, 比…一点儿 / 多了, 更, 最, 没有…那么, comprar por internet, descuentos (打八折) y
 * formas de pago.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const TIENDA = dialogue('zh.stim.a2-u8-kuzi', 'Anna se prueba un pantalón.', [
  ['安娜', '我可以试试这条裤子吗？'],
  ['服务员', '可以。'],
  ['安娜', '有点儿大。有没有小一点儿的？'],
  ['服务员', '有，这条比那条小一点儿。'],
  ['安娜', '这条很合适！多少钱？'],
  ['服务员', '两百块。'],
]);

const ONLINE = dialogue('zh.stim.a2-u8-wangshang', 'Li Hua y Zhang Li hablan de compras.', [
  ['李华', '你在哪儿买的这个帽子？'],
  ['张丽', '在网上买的。网上比商店便宜多了。'],
  ['李华', '网上的东西都好吗？'],
  ['张丽', '不是都好。可是网上的没有商店的那么贵。'],
]);

const ANUNCIO = reading(
  'zh.stim.a2-u8-dazhe',
  'notice',
  'Un cartel en la puerta de una tienda de ropa.',
  ['周末打折！', '裙子、帽子打八折，裤子打五折。', '现金和卡都可以。'],
  { title: '打折' },
);

export const ZH_A2_U08: ZhUnitDef = {
  names: ['安娜', '李华', '张丽'],
  support: ['条', '百', '打', '折'],
  unit: {
    position: 8,
    title: 'Compras y comparaciones',
    titleEn: '买东西 Shopping',
    description:
      'Probarse ropa, cambiar y elegir, comparar con 更, 最 y 没有…那么, descuentos y pagos.',
    emoji: '🛍️',
    objective:
      'Podés probarte ropa y decir si te queda bien, cambiar algo, comparar precios y productos, entender un descuento y decir cómo pagás.',
    grammar: {
      title: '比…一点儿 / 多了 · 更 · 最 · 没有…那么',
      explanation:
        'Con 比 se dice cuánto: 比…一点儿 (un poco más), 比…多了 (mucho más). 更 es «aún más» y 最, «el más», ambos antes del adjetivo. A 没有 B 那么 + adjetivo es «A no es tan… como B». 打八折 no es 80 % de descuento: pagás el 80 %.',
      examples: [
        { target: '这个比那个贵多了。', base: 'Este es mucho más caro que aquel.' },
        { target: '红色的最便宜。', base: 'El rojo es el más barato.' },
        { target: '这件没有那件那么贵。', base: 'Esta no es tan cara como aquella.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 nuevo (U8). Sin revisión nativa: revisar 打八折, el clasificador 条 y 没有…那么.',
    },
    words: [
      w(
        'zh-kuzi',
        '裤子',
        'kùzi',
        'pantalón',
        '这条裤子很合适。',
        'Este pantalón me queda muy bien.',
        ['clothes'],
        {
          acceptedTranslations: ['pantalones'],
          emoji: '👖',
        },
      ),
      w(
        'zh-qunzi',
        '裙子',
        'qúnzi',
        'pollera',
        '我想买一条裙子。',
        'Quiero comprar una pollera.',
        ['clothes'],
        {
          acceptedTranslations: ['falda'],
        },
      ),
      w(
        'zh-maozi',
        '帽子',
        'màozi',
        'gorro',
        '这个帽子很漂亮。',
        'Este gorro es muy lindo.',
        ['clothes'],
        {
          acceptedTranslations: ['sombrero', 'gorra'],
          emoji: '🧢',
        },
      ),
      w(
        'zh-shi-probar',
        '试',
        'shì',
        'probar (ropa)',
        '我可以试试吗？',
        '¿Me lo puedo probar?',
        ['verbs', 'shopping'],
        {
          acceptedTranslations: ['probarse', 'intentar'],
        },
      ),
      w(
        'zh-heshi',
        '合适',
        'héshì',
        'quedar bien',
        '这条裤子很合适。',
        'Este pantalón me queda muy bien.',
        ['shopping'],
        {
          acceptedTranslations: ['adecuado', 'que queda bien'],
        },
      ),
      w('zh-huan', '换', 'huàn', 'cambiar', '我想换一条。', 'Quiero cambiarlo por otro.', [
        'verbs',
        'shopping',
      ]),
      w('zh-xuan', '选', 'xuǎn', 'elegir', '你选哪个？', '¿Cuál elegís?', ['verbs'], {
        acceptedTranslations: ['escoger'],
      }),
      w('zh-geng', '更', 'gèng', 'aún más', '那个更好。', 'Aquel es todavía mejor.', ['grammar'], {
        acceptedTranslations: ['todavía más', 'más'],
      }),
      w(
        'zh-zui',
        '最',
        'zuì',
        'el más',
        '白色的最便宜。',
        'El blanco es el más barato.',
        ['grammar'],
        {
          acceptedTranslations: ['lo más', 'la más'],
        },
      ),
      w(
        'zh-name',
        '那么',
        'nàme',
        'tan',
        '这件没有那件那么贵。',
        'Esta no es tan cara como aquella.',
        ['grammar'],
        {
          acceptedTranslations: ['tanto'],
        },
      ),
      w(
        'zh-wangshang',
        '网上',
        'wǎngshang',
        'por internet',
        '我常常在网上买东西。',
        'Compro seguido por internet.',
        ['shopping', 'technology'],
        {
          acceptedTranslations: ['en internet', 'online'],
        },
      ),
      w(
        'zh-dazhe',
        '打折',
        'dǎzhé',
        'descuento',
        '今天打八折。',
        'Hoy pagás el 80 % (20 % de descuento).',
        ['shopping'],
        {
          acceptedTranslations: ['hacer descuento', 'rebaja', 'oferta'],
        },
      ),
      w(
        'zh-ka',
        '卡',
        'kǎ',
        'tarjeta',
        '现金和卡都可以。',
        'Se puede pagar en efectivo o con tarjeta.',
        ['shopping'],
        {
          emoji: '💳',
        },
      ),
      w(
        'zh-xianjin',
        '现金',
        'xiànjīn',
        'efectivo',
        '我付现金。',
        'Pago en efectivo.',
        ['shopping'],
        {
          emoji: '💵',
        },
      ),
      w('zh-fu', '付', 'fù', 'pagar', '我付现金。', 'Pago en efectivo.', ['verbs', 'shopping']),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '裤子、裙子、帽子',
        objective: 'Nombrar ropa y pedir probártela.',
        intro: {
          explanation:
            'Ropa: 裤子 (pantalón), 裙子 (pollera), 帽子 (gorro). Las prendas largas se cuentan con 条: 一条裤子. 试 es probar(se); repetido, 试试, suena amable: 我可以试试吗？',
          examples: [
            { target: '我可以试试这条裤子吗？', base: '¿Me puedo probar este pantalón?' },
            { target: '这个帽子很漂亮。', base: 'Este gorro es muy lindo.' },
          ],
        },
        takeaways: ['Nombrás pantalones, polleras y gorros.', 'Pedís probarte algo con 试试.'],
        exercises: [
          ex.imageChoice('👖', '裤子', ['裙子', '帽子', '鞋'], ['zh-kuzi'], {
            id: 'zh.ex.hur0bhshzo7613',
          }),
          ex.imageChoice('🧢', '帽子', ['裤子', '裙子', '鞋'], ['zh-maozi'], {
            id: 'zh.ex.ztn45pi1qq60kf',
          }),
          ex.translationChoice('裙子', 'pollera', ['pantalón', 'gorro', 'zapatos'], ['zh-qunzi'], {
            id: 'zh.ex.1cziee8y9sjryx',
          }),
          ex.listenChoice(
            '我可以试试这条裤子吗？',
            ['我可以试试这条裙子吗？', '我可以买这条裤子吗？', '你可以试试这条裤子。'],
            ['zh-shi-probar', 'zh-kuzi'],
            { id: 'zh.ex.19vr0f6spy722l' },
          ),
          ex.fillBlank(
            '我想买一___裙子。',
            'Quiero comprar una pollera.',
            '条',
            ['本', '张', '杯'],
            ['zh-qunzi'],
            {
              id: 'zh.ex.ismjkbnvah23fd',
              explanation: 'Las prendas largas (pantalones, polleras) se cuentan con 条.',
            },
          ),
          tone('帽子', 'màozi', ['māozi', 'máozi', 'mǎozi'], ['zh-maozi'], {
            id: 'zh.ex.exm6herb9lgsg1',
          }),
          ex.matchPairs(
            [
              ['裤子', 'pantalón'],
              ['裙子', 'pollera'],
              ['帽子', 'gorro'],
              ['试', 'probar (ropa)'],
            ],
            ['zh-kuzi', 'zh-qunzi', 'zh-maozi', 'zh-shi-probar'],
            { id: 'zh.ex.6lvo75sbikd16i' },
          ),
          reply(
            '你想试试吗？',
            '¿Te lo querés probar? (Respondé que sí.)',
            'xiǎng, wǒ shìshi',
            '想，我试试',
            ['zh-shi-probar'],
            {
              id: 'zh.ex.8k3bsvrw2gnryy',
              accepted: ['wǒ shìshi', '我试试', 'xiǎng', '想', 'hǎo, wǒ shìshi', '好，我试试'],
            },
          ),
          write(
            '¿Me puedo probar esta pollera?',
            'wǒ kěyǐ shìshi zhè tiáo qúnzi ma',
            '我可以试试这条裙子吗',
            ['zh-shi-probar', 'zh-qunzi'],
            {
              id: 'zh.ex.wbakpkzyur460i',
              accepted: ['wǒ kěyǐ shì zhè tiáo qúnzi ma', '我可以试这条裙子吗'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '合适吗？',
        objective: 'Decir si algo te queda bien, cambiarlo y elegir.',
        intro: {
          explanation:
            '合适 es «quedar bien» (de talle o en general): 这条裤子很合适. 换 es cambiar una cosa por otra: 我想换一条. 选 es elegir: 你选哪个？',
          examples: [
            {
              target: '这条裤子不合适，我想换一条。',
              base: 'Este pantalón no me queda bien; quiero cambiarlo.',
            },
            { target: '你选哪个？', base: '¿Cuál elegís?' },
          ],
        },
        takeaways: ['Decís si algo te queda bien con 合适.', 'Cambiás y elegís con 换 y 选.'],
        exercises: [
          ex.translationChoice('合适', 'quedar bien', ['caro', 'barato', 'nuevo'], ['zh-heshi'], {
            id: 'zh.ex.pg34m1rrubipdz',
          }),
          ex.translationChoice('换', 'cambiar', ['elegir', 'probar (ropa)', 'pagar'], ['zh-huan'], {
            id: 'zh.ex.cyv5nj1k1j6flt',
          }),
          ex.listenChoice(
            '这条裤子不合适。',
            ['这条裙子不合适。', '这条裤子很合适。', '这条裤子不便宜。'],
            ['zh-heshi'],
            {
              id: 'zh.ex.qr9zdqei44idyf',
            },
          ),
          ex.fillBlank(
            '这条裙子太大了，我想___一条小的。',
            'Esta pollera es muy grande: quiero cambiarla por una más chica.',
            '换',
            ['卖', '教', '回'],
            ['zh-huan'],
            { id: 'zh.ex.49968rqeqtvh8e', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            '红色的和白色的，你___哪个？',
            'El rojo y el blanco: ¿cuál elegís?',
            '选',
            ['教', '合适', '回'],
            ['zh-xuan'],
            {
              id: 'zh.ex.15c2hfej6h90kx',
              skill: 'vocabulary',
            },
          ),
          tone('合适', 'héshì', ['hēshì', 'hěshǐ', 'hèshí'], ['zh-heshi'], {
            id: 'zh.ex.yrjp1tc7mo34rh',
          }),
          question(
            'zh.ex.n5skgdnhloccr2',
            TIENDA,
            '¿Qué problema tiene el primer pantalón?',
            'Le queda medio grande',
            ['Le queda chico', 'Es muy caro', 'No le gusta el color'],
            ['zh-heshi'],
            'Anna dice: «有点儿大。有没有小一点儿的？».',
          ),
          question(
            'zh.ex.g5k7rxqmmwgaoo',
            TIENDA,
            '¿Cuánto cuesta el pantalón que le queda bien?',
            '200 yuanes',
            ['100 yuanes', '20 yuanes', '2 yuanes'],
            ['zh-heshi'],
            'El vendedor dice: «两百块».',
          ),
          reply(
            '这条裤子怎么样？',
            '¿Qué tal este pantalón? (Respondé que te queda muy bien.)',
            'hěn héshì',
            '很合适',
            ['zh-heshi'],
            {
              id: 'zh.ex.ikwxgx1ysy5abu',
              accepted: ['zhè tiáo kùzi hěn héshì', '这条裤子很合适', 'fēicháng héshì', '非常合适'],
            },
          ),
          write(
            'Quiero cambiar estos zapatos.',
            'wǒ xiǎng huàn zhè shuāng xié',
            '我想换这双鞋',
            ['zh-huan'],
            { id: 'zh.ex.bqjc109uegszmw' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '更 y 最',
        objective: 'Comparar con 比, 更 y 最.',
        intro: {
          explanation:
            'Con 比 se puede decir cuánto: 比…一点儿 (un poco más), 比…多了 (mucho más): 这个比那个贵多了. 更 es «aún más» y va antes del adjetivo: 那个更好. 最 es «el más»: 这个最便宜.',
          examples: [
            { target: '这个比那个便宜一点儿。', base: 'Este es un poco más barato que aquel.' },
            { target: '这件最贵。', base: 'Esta es la más cara.' },
          ],
        },
        takeaways: ['Comparás con 比…一点儿 y 比…多了.', 'Usás 更 (aún más) y 最 (el más).'],
        exercises: [
          ex.translationChoice('最', 'el más', ['aún más', 'tan', 'un poco'], ['zh-zui'], {
            id: 'zh.ex.vbw80q26dr78ay',
          }),
          ex.translationChoice('更', 'aún más', ['el más', 'tan', 'igual'], ['zh-geng'], {
            id: 'zh.ex.3hn70rzmq3w5gr',
          }),
          ex.listenChoice(
            '这个比那个贵多了。',
            ['这个比那个贵一点儿。', '那个比这个贵多了。', '这个比那个便宜多了。'],
            ['zh-bi-comparar'],
            {
              id: 'zh.ex.v1xe67s4coat8w',
            },
          ),
          ex.fillBlank(
            '这三件衣服，红色的___便宜。',
            'De estas tres prendas, la roja es la más barata.',
            '最',
            ['更', '比', '跟'],
            ['zh-zui'],
            {
              id: 'zh.ex.v51kd2cejskwth',
            },
          ),
          ex.fillBlank(
            '这个很好，那个___好。',
            'Este es bueno, pero aquel es todavía mejor.',
            '更',
            ['最', '比', '跟'],
            ['zh-geng'],
            {
              id: 'zh.ex.rhosndoh3yorj2',
              explanation: '更 compara con algo ya dicho: «todavía más».',
            },
          ),
          ex.fillBlank(
            '这条裤子比那条大___。',
            'Este pantalón es un poco más grande que aquel.',
            '一点儿',
            ['有点儿', '很', '非常'],
            ['zh-yidianr', 'zh-bi-comparar'],
            {
              id: 'zh.ex.xp2lf6ptigqphl',
              explanation:
                'Con 比, «un poco más» va después: 大一点儿. 有点儿 y 很 no se usan con 比.',
            },
          ),
          tone('最', 'zuì', ['zuī', 'zuí', 'zuǐ'], ['zh-zui'], { id: 'zh.ex.t42vvbcq5vw9n9' }),
          reply(
            '这三个，哪个最便宜？',
            'De estos tres, ¿cuál es el más barato? (Respondé que el blanco.)',
            'báisè de zuì piányi',
            '白色的最便宜',
            ['zh-zui'],
            {
              id: 'zh.ex.zmtb8k17wik6vq',
              accepted: ['báisè de', '白色的', 'zhège báisè de zuì piányi', '这个白色的最便宜'],
            },
          ),
          write(
            'Este es mucho más caro que aquel.',
            'zhège bǐ nàge guì duō le',
            '这个比那个贵多了',
            ['zh-bi-comparar'],
            {
              id: 'zh.ex.2bg2g8s75l68b4',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '没有…那么',
        objective: 'Decir que algo no es tan… como otra cosa; comprar por internet.',
        intro: {
          explanation:
            'A 没有 B 那么 + adjetivo es «A no es tan… como B»: 网上的没有商店的那么贵. 网上 es «por internet, en internet»: 我在网上买衣服.',
          examples: [
            { target: '这件没有那件那么贵。', base: 'Esta no es tan cara como aquella.' },
            { target: '我常常在网上买东西。', base: 'Compro seguido por internet.' },
          ],
        },
        takeaways: ['Decís «no tan… como» con 没有…那么.', 'Hablás de compras por internet.'],
        exercises: [
          ex.translationChoice(
            '网上',
            'por internet',
            ['en la tienda', 'por teléfono', 'en efectivo'],
            ['zh-wangshang'],
            { id: 'zh.ex.jrhcdzicug3uu5' },
          ),
          ex.translationChoice('那么', 'tan', ['el más', 'aún más', 'un poco'], ['zh-name'], {
            id: 'zh.ex.bb0hpqdn6ej5vy',
          }),
          ex.listenChoice(
            '我常常在网上买东西。',
            ['我常常在商店买东西。', '我不在网上买东西。', '我常常在网上看电影。'],
            ['zh-wangshang'],
            {
              id: 'zh.ex.jwbocxwsslbcrm',
            },
          ),
          ex.fillBlank(
            '这件没有那件___贵。',
            'Esta no es tan cara como aquella.',
            '那么',
            ['比', '最', '更'],
            ['zh-name'],
            { id: 'zh.ex.dd0qtilqw5oy2j' },
          ),
          ex.fillBlank(
            '我妹妹___我那么高。',
            'Mi hermana no es tan alta como yo.',
            '没有',
            ['不是', '比', '跟'],
            ['zh-name'],
            {
              id: 'zh.ex.ledhryqnwc1pe3',
              explanation: '«No tan… como» es 没有…那么.',
            },
          ),
          tone('网上', 'wǎngshang', ['wāngshang', 'wángshang', 'wàngshang'], ['zh-wangshang'], {
            id: 'zh.ex.uphohmxkpk6g6d',
          }),
          question(
            'zh.ex.0g9jnhwf6qxzge',
            ONLINE,
            '¿Dónde compró Zhang Li el gorro?',
            'Por internet',
            ['En una tienda', 'En el súper', 'Se lo regalaron'],
            ['zh-wangshang'],
            'Zhang Li dice: «在网上买的».',
          ),
          question(
            'zh.ex.zfq2b7xa2ppp8w',
            ONLINE,
            '¿Qué opina Zhang Li de comprar por internet?',
            'Es mucho más barato, aunque no todo es bueno',
            [
              'Es más caro, pero todo es bueno',
              'Es igual que en las tiendas',
              'Es más barato y todo es bueno',
            ],
            ['zh-bi-comparar', 'zh-name'],
            'Zhang Li dice: «网上比商店便宜多了» y «不是都好».',
          ),
          reply(
            '网上的东西贵吗？',
            '¿Las cosas por internet son caras? (Respondé que no son tan caras como en la tienda.)',
            'méiyǒu shāngdiàn de nàme guì',
            '没有商店的那么贵',
            ['zh-name', 'zh-wangshang'],
            {
              id: 'zh.ex.nkd8v7nwz7hwce',
              accepted: [
                'wǎngshang de méiyǒu shāngdiàn de nàme guì',
                '网上的没有商店的那么贵',
                'bú guì',
                '不贵',
              ],
            },
          ),
          write(
            'Compro ropa por internet.',
            'wǒ zài wǎngshang mǎi yīfu',
            '我在网上买衣服',
            ['zh-wangshang'],
            { id: 'zh.ex.zkphv7gkn8xep3' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '打折和付钱',
        objective: 'Entender descuentos y decir cómo pagás.',
        intro: {
          explanation:
            '打折 es hacer descuento. Ojo: 打八折 no es 80 % de descuento: pagás el 80 % (o sea, 20 % menos); 打五折 es la mitad. 付 es pagar, con 现金 (efectivo) o con 卡 (tarjeta).',
          examples: [
            { target: '今天打八折。', base: 'Hoy pagás el 80 % (20 % de descuento).' },
            { target: '我付现金。', base: 'Pago en efectivo.' },
          ],
        },
        takeaways: ['Entendés 打八折 y 打五折.', 'Decís si pagás en efectivo o con tarjeta.'],
        exercises: [
          ex.translationChoice(
            '现金',
            'efectivo',
            ['tarjeta', 'descuento', 'vuelto'],
            ['zh-xianjin'],
            { id: 'zh.ex.2gw7ekgcwf0x2k' },
          ),
          ex.translationChoice(
            '打折',
            'descuento',
            ['efectivo', 'pagar', 'tarjeta'],
            ['zh-dazhe'],
            { id: 'zh.ex.yx830cftyrgohj' },
          ),
          ex.listenChoice(
            '今天打八折。',
            ['今天打五折。', '明天打八折。', '今天不打折。'],
            ['zh-dazhe'],
            { id: 'zh.ex.gcauzm4cpq21w0' },
          ),
          ex.fillBlank(
            '我可以___现金吗？',
            '¿Puedo pagar en efectivo?',
            '付',
            ['换', '试', '选'],
            ['zh-fu', 'zh-xianjin'],
            {
              id: 'zh.ex.7b3o2i6ro3tbq6',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '一百块的衣服打八折，你付___块。',
            'Una prenda de 100 yuanes con «打八折»: ¿cuánto pagás?',
            '八十',
            ['二十', '八', '十八'],
            ['zh-dazhe'],
            {
              id: 'zh.ex.ytt13db500z7j7',
              explanation: '打八折 es pagar el 80 %: de 100 yuanes pagás 80.',
            },
          ),
          tone('卡', 'kǎ', ['kā', 'ká', 'kà'], ['zh-ka'], { id: 'zh.ex.s3pgo1gvbxgt7n' }),
          question(
            'zh.ex.nr2mocti0iwe87',
            ANUNCIO,
            '¿Cómo se puede pagar en la tienda?',
            'En efectivo o con tarjeta',
            ['Sólo en efectivo', 'Sólo con tarjeta', 'Sólo por internet'],
            ['zh-xianjin', 'zh-ka'],
            'El cartel dice: «现金和卡都可以».',
          ),
          question(
            'zh.ex.6ab8rpr7fs42a7',
            ANUNCIO,
            '¿Qué tiene el descuento más grande?',
            'Los pantalones: se paga la mitad',
            [
              'Las polleras: se paga la mitad',
              'Los gorros: se paga el 50 %',
              'Todo tiene el mismo descuento',
            ],
            ['zh-dazhe', 'zh-kuzi'],
            'El cartel dice: «裙子、帽子打八折，裤子打五折»: 打五折 es pagar el 50 %.',
          ),
          reply(
            '你付现金吗？',
            '¿Pagás en efectivo? (Respondé que sí.)',
            'wǒ fù xiànjīn',
            '我付现金',
            ['zh-xianjin', 'zh-fu'],
            {
              id: 'zh.ex.j02ien0q9gaaqs',
              accepted: ['fù xiànjīn', '付现金', 'xiànjīn', '现金'],
            },
          ),
          write('Hoy hay descuento.', 'jīntiān dǎzhé', '今天打折', ['zh-dazhe'], {
            id: 'zh.ex.fzsq22pfi663lf',
          }),
        ],
      },
    ],
  },
};

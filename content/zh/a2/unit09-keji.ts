import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U9 «Tecnología y comunicación» (docs/ZH_A1_A2.md): mensajes y fotos (发给, 拍), internet
 * y contraseñas, cargar el celular, 用 + herramienta, 开 / 关 y una introducción a 把.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const AYUDA = dialogue(
  'zh.stim.a2-u9-shouji',
  'La mamá de Wang Ming le pide ayuda con el celular.',
  [
    ['妈妈', '王明，你能帮我吗？我不会用这个手机。'],
    ['王明', '好。你想做什么？'],
    ['妈妈', '我想把这张照片发给你姐姐。'],
    ['王明', '你看，这样发。好了！'],
    ['妈妈', '谢谢！你教得很好。'],
  ],
);

const MENSAJE = reading(
  'zh.stim.a2-u9-meidian',
  'message',
  'Li Hua le escribe a Zhang Li desde la computadora.',
  [
    '我的手机没电了，不能打电话。',
    '我把今天拍的照片发到你的电子邮件了。',
    '晚上我上网给你发消息。',
  ],
  { from: '李华', to: '张丽' },
);

const CAFE = dialogue('zh.stim.a2-u9-mima', 'Anna entra a un café.', [
  ['安娜', '服务员，这儿可以上网吗？'],
  ['服务员', '可以。密码是八八八八。'],
  ['安娜', '谢谢。我可以在这儿给手机充电吗？'],
  ['服务员', '可以，在那儿。'],
]);

export const ZH_A2_U09: ZhUnitDef = {
  names: ['李华', '张丽', '安娜'],
  support: ['这样', '电'],
  unit: {
    position: 9,
    title: 'Tecnología y comunicación',
    titleEn: '手机和电脑 Technology',
    description:
      'Mensajes, fotos y videos, internet y contraseñas, cargar el celular y el primer 把.',
    emoji: '📱',
    objective:
      'Puedes mandar mensajes, fotos y correos, pedir la contraseña del wifi, decir con qué haces algo (用) y usar 把 para decir qué haces con una cosa.',
    grammar: {
      title: '发给 + persona · 用 + cosa + verbo · 把',
      explanation:
        'Quien recibe va después del verbo con 给 (发给你) o antes con 给 (给你发). 用 + cosa + verbo dice con qué: 我用手机上网. Con 把 la cosa va antes del verbo cuando haces algo con ella: 把照片发给我. Después del verbo siempre va algo más (给我, 了…).',
      examples: [
        { target: '我一会儿发给你。', base: 'Te lo mando en un rato.' },
        { target: '我用手机拍照片。', base: 'Saco fotos con el celular.' },
        { target: '请把手机给我。', base: 'Dame el celular, por favor.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 nuevo (U9). Sin revisión nativa: revisar los usos de 把 y 发到 / 发给.',
    },
    words: [
      w(
        'zh-fa',
        '发',
        'fā',
        'mandar',
        '我一会儿发给你。',
        'Te lo mando en un rato.',
        ['verbs', 'technology'],
        {
          acceptedTranslations: ['enviar'],
        },
      ),
      w(
        'zh-xiaoxi',
        '消息',
        'xiāoxi',
        'mensaje',
        '我给你发消息。',
        'Te mando un mensaje.',
        ['technology'],
        {
          acceptedTranslations: ['noticia'],
          emoji: '💬',
        },
      ),
      w(
        'zh-haoma',
        '号码',
        'hàomǎ',
        'número (de teléfono)',
        '你的手机号码是多少？',
        '¿Cuál es tu número de celular?',
        ['technology'],
        {
          acceptedTranslations: ['número'],
        },
      ),
      w(
        'zh-zhaopian',
        '照片',
        'zhàopiàn',
        'foto',
        '我拍了很多照片。',
        'Saqué muchas fotos.',
        ['technology'],
        {
          acceptedTranslations: ['fotografía'],
          emoji: '📷',
        },
      ),
      w(
        'zh-pai',
        '拍',
        'pāi',
        'sacar (fotos)',
        '我拍了很多照片。',
        'Saqué muchas fotos.',
        ['verbs', 'technology'],
        {
          acceptedTranslations: ['fotografiar', 'filmar'],
        },
      ),
      w(
        'zh-shipin',
        '视频',
        'shìpín',
        'video',
        '你看这个视频！',
        '¡Mira este video!',
        ['technology'],
        { emoji: '🎬' },
      ),
      w(
        'zh-xiazai',
        '下载',
        'xiàzài',
        'descargar',
        '我下载了一个视频。',
        'Descargué un video.',
        ['verbs', 'technology'],
        {
          acceptedTranslations: ['bajar'],
        },
      ),
      w(
        'zh-shangwang',
        '上网',
        'shàngwǎng',
        'conectarse a internet',
        '这儿可以上网吗？',
        '¿Aquí hay internet?',
        ['technology'],
        {
          acceptedTranslations: ['navegar por internet', 'usar internet'],
        },
      ),
      w(
        'zh-mima',
        '密码',
        'mìmǎ',
        'contraseña',
        '密码是什么？',
        '¿Cuál es la contraseña?',
        ['technology'],
        {
          acceptedTranslations: ['clave'],
          emoji: '🔑',
        },
      ),
      w(
        'zh-chongdian',
        '充电',
        'chōngdiàn',
        'cargar (la batería)',
        '我想给手机充电。',
        'Quiero cargar el celular.',
        ['technology'],
        {
          acceptedTranslations: ['cargar'],
          emoji: '🔋',
        },
      ),
      w(
        'zh-yong',
        '用',
        'yòng',
        'usar',
        '我用手机上网。',
        'Me conecto a internet con el celular.',
        ['verbs'],
      ),
      w(
        'zh-kai',
        '开',
        'kāi',
        'prender (abrir)',
        '我开电脑上网。',
        'Prendo la computadora y me conecto.',
        ['verbs'],
        {
          acceptedTranslations: ['abrir', 'encender', 'prender'],
        },
      ),
      w(
        'zh-guan',
        '关',
        'guān',
        'apagar (cerrar)',
        '晚上我关手机。',
        'Por la noche apago el celular.',
        ['verbs'],
        {
          acceptedTranslations: ['cerrar', 'apagar'],
        },
      ),
      w(
        'zh-dianziyoujian',
        '电子邮件',
        'diànzǐ yóujiàn',
        'correo electrónico',
        '我给经理发了一个电子邮件。',
        'Le mandé un correo a la gerente.',
        ['technology'],
        {
          acceptedTranslations: ['correo', 'email', 'mail'],
          emoji: '📧',
        },
      ),
      w(
        'zh-ba-objeto',
        '把',
        'bǎ',
        'partícula 把 (objeto antes del verbo)',
        '请把手机给我。',
        'Dame el celular, por favor.',
        ['particle', 'grammar'],
        {
          acceptedTranslations: ['partícula 把'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '发消息',
        objective: 'Mandar mensajes y pedir un número.',
        intro: {
          explanation:
            '发 es mandar (un mensaje, una foto). Quien recibe va con 给, antes del verbo (给你发消息) o después (发给你). 号码 es el número de teléfono: 你的手机号码是多少？',
          examples: [
            { target: '我晚上给你发消息。', base: 'Por la noche te mando un mensaje.' },
            { target: '你的手机号码是多少？', base: '¿Cuál es tu número de celular?' },
          ],
        },
        takeaways: ['Mandas mensajes con 发 y 给.', 'Pides un número con 号码是多少？'],
        exercises: [
          ex.translationChoice('消息', 'mensaje', ['foto', 'video', 'contraseña'], ['zh-xiaoxi'], {
            id: 'zh.ex.mkdoskw3nt65tq',
          }),
          ex.translationChoice(
            '号码',
            'número (de teléfono)',
            ['contraseña', 'mensaje', 'tarjeta'],
            ['zh-haoma'],
            { id: 'zh.ex.a22m6yh3m72054' },
          ),
          ex.listenChoice(
            '我晚上给你发消息。',
            ['我晚上给你打电话。', '我早上给你发消息。', '你晚上给我发消息。'],
            ['zh-fa', 'zh-xiaoxi'],
            {
              id: 'zh.ex.rux5tn6jmgmeyk',
            },
          ),
          ex.fillBlank(
            '我给妈妈___了一个消息。',
            'Le mandé un mensaje a mamá.',
            '发',
            ['打', '做', '坐'],
            ['zh-fa'],
            {
              id: 'zh.ex.0wbebdpam5vr4b',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '你的手机___是多少？',
            '¿Cuál es tu número de celular?',
            '号码',
            ['消息', '岁', '钱'],
            ['zh-haoma'],
            {
              id: 'zh.ex.v7vvmilrfgmj42',
              skill: 'vocabulary',
            },
          ),
          tone('消息', 'xiāoxi', ['xiáoxi', 'xiǎoxi', 'xiàoxi'], ['zh-xiaoxi'], {
            id: 'zh.ex.rkzhhjv69limre',
          }),
          ex.orderWords('我 一会儿 发 给 你。', 'Te lo mando en un rato.', ['zh-fa'], {
            id: 'zh.ex.o30k61opjtf5sy',
          }),
          reply(
            '你给我发消息了吗？',
            '¿Me mandaste un mensaje? (Responde que sí, que ya te lo mandaste.)',
            'wǒ yǐjīng fā le',
            '我已经发了',
            ['zh-fa'],
            {
              id: 'zh.ex.kgh5ibohmwb1it',
              accepted: ['fā le', '发了', 'yǐjīng fā le', '已经发了', 'wǒ fā le', '我发了'],
            },
          ),
          write(
            'Te mando un mensaje.',
            'wǒ gěi nǐ fā xiāoxi',
            '我给你发消息',
            ['zh-fa', 'zh-xiaoxi'],
            {
              id: 'zh.ex.h32nlxui0veckn',
              accepted: ['wǒ fā xiāoxi gěi nǐ', '我发消息给你'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '照片和视频',
        objective: 'Hablar de fotos y videos.',
        intro: {
          explanation:
            '照片 es la foto y 拍, sacar fotos o filmar: 拍照片. 视频 es un video y 下载, descargar. Las fotos se cuentan con 张: 一张照片.',
          examples: [
            { target: '我拍了很多照片。', base: 'Saqué muchas fotos.' },
            { target: '你看这个视频！', base: '¡Mira este video!' },
          ],
        },
        takeaways: ['Sacas fotos con 拍.', 'Hablas de videos y descargas.'],
        exercises: [
          ex.translationChoice(
            '照片',
            'foto',
            ['video', 'mensaje', 'número (de teléfono)'],
            ['zh-zhaopian'],
            { id: 'zh.ex.i8b1i7t91db46k' },
          ),
          ex.translationChoice(
            '下载',
            'descargar',
            ['mandar', 'sacar (fotos)', 'usar'],
            ['zh-xiazai'],
            { id: 'zh.ex.s7u62sbl2bal1y' },
          ),
          ex.listenChoice(
            '我拍了很多照片。',
            ['我拍了很多视频。', '我看了很多照片。', '我拍了两张照片。'],
            ['zh-pai', 'zh-zhaopian'],
            {
              id: 'zh.ex.9tbku0shacvpn9',
            },
          ),
          ex.fillBlank(
            '我在长城___了很多照片。',
            'En la Gran Muralla saqué muchas fotos.',
            '拍',
            ['下载', '坐', '做'],
            ['zh-pai'],
            {
              id: 'zh.ex.kjzcrev51z2w59',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '你看看这个___，很好玩！',
            'Mira este video: ¡es muy divertido!',
            '视频',
            ['号码', '护照', '筷子'],
            ['zh-shipin'],
            {
              id: 'zh.ex.xqi8ipxs43yf6w',
              skill: 'vocabulary',
            },
          ),
          tone('视频', 'shìpín', ['shīpín', 'shìpīn', 'shípǐn'], ['zh-shipin'], {
            id: 'zh.ex.zml0zi9jcasfx5',
          }),
          ex.matchPairs(
            [
              ['照片', 'foto'],
              ['视频', 'video'],
              ['拍', 'sacar (fotos)'],
              ['下载', 'descargar'],
            ],
            ['zh-zhaopian', 'zh-shipin', 'zh-pai', 'zh-xiazai'],
            { id: 'zh.ex.cojutj18hikxb2' },
          ),
          reply(
            '你拍照片了吗？',
            '¿Sacaste fotos? (Responde que sí, muchas.)',
            'pāi le hěn duō',
            '拍了很多',
            ['zh-pai', 'zh-zhaopian'],
            {
              id: 'zh.ex.kjm122xeq0oehi',
              accepted: [
                'wǒ pāi le hěn duō zhàopiàn',
                '我拍了很多照片',
                'pāi le',
                '拍了',
                'wǒ pāi le hěn duō',
                '我拍了很多',
              ],
            },
          ),
          write(
            'Descargué un video.',
            'wǒ xiàzài le yí ge shìpín',
            '我下载了一个视频',
            ['zh-xiazai', 'zh-shipin'],
            { id: 'zh.ex.xb3hmjdk2sq8i9' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '上网和充电',
        objective: 'Pedir internet, la contraseña y un lugar para cargar el celular.',
        intro: {
          explanation:
            '上网 es conectarse a internet; 密码, la contraseña (también la del wifi); 充电, cargar la batería. 用 es usar, y 用 + cosa + verbo dice con qué haces algo: 我用手机上网.',
          examples: [
            { target: '这儿可以上网吗？', base: '¿Aquí hay internet?' },
            { target: '我用手机拍照片。', base: 'Saco fotos con el celular.' },
          ],
        },
        takeaways: ['Pides el wifi y la contraseña.', 'Dices con qué haces algo con 用.'],
        exercises: [
          ex.translationChoice(
            '密码',
            'contraseña',
            ['número (de teléfono)', 'mensaje', 'tarjeta'],
            ['zh-mima'],
            { id: 'zh.ex.aatlvjyn1v7wee' },
          ),
          ex.translationChoice(
            '充电',
            'cargar (la batería)',
            ['descargar', 'conectarse a internet', 'mandar'],
            ['zh-chongdian'],
            {
              id: 'zh.ex.yzgfi84645nh6r',
            },
          ),
          ex.listenChoice(
            '这儿可以上网吗？',
            ['这儿可以吃东西吗？', '这儿可以充电吗？', '这儿不可以上网。'],
            ['zh-shangwang'],
            {
              id: 'zh.ex.lx5w47l31eekyi',
            },
          ),
          ex.fillBlank(
            '我___手机拍照片。',
            'Saco fotos con el celular.',
            '用',
            ['在', '给', '跟'],
            ['zh-yong'],
            {
              id: 'zh.ex.ts5w20x76dhxox',
              explanation: '用 + cosa + verbo: con qué haces algo.',
            },
          ),
          ex.fillBlank(
            '我的手机没电了，我想___。',
            'Mi celular se quedó sin batería: lo quiero cargar.',
            '充电',
            ['上网', '下载', '密码'],
            ['zh-chongdian'],
            {
              id: 'zh.ex.8c2fc3imxc8pfa',
              skill: 'vocabulary',
            },
          ),
          tone('密码', 'mìmǎ', ['mīmǎ', 'mímá', 'mǐmà'], ['zh-mima'], {
            id: 'zh.ex.uf7o5frg13d5yr',
          }),
          question(
            'zh.ex.z2yt403cw61rrx',
            CAFE,
            '¿Cuál es la contraseña del wifi?',
            '8888',
            ['8000', '1234', 'No tienen wifi'],
            ['zh-mima'],
            'El mesero dice: «密码是八八八八». El 8 es un número de buena suerte en China.',
          ),
          question(
            'zh.ex.mjn4mkyi43st7y',
            CAFE,
            '¿Qué más pregunta Anna?',
            'Si puede cargar el celular',
            ['Si puede pagar con tarjeta', 'Si tienen té', 'Si puede sacar fotos'],
            ['zh-chongdian'],
            'Anna pregunta: «我可以在这儿给手机充电吗？».',
          ),
          reply(
            '你用什么上网？',
            '¿Con qué te conectas a internet? (Responde que con el celular.)',
            'wǒ yòng shǒujī shàngwǎng',
            '我用手机上网',
            ['zh-yong', 'zh-shangwang'],
            {
              id: 'zh.ex.iskizt32ld1dnv',
              accepted: [
                'yòng shǒujī',
                '用手机',
                'shǒujī',
                '手机',
                'yòng shǒujī shàngwǎng',
                '用手机上网',
              ],
            },
          ),
          write('¿Cuál es la contraseña?', 'mìmǎ shì shénme', '密码是什么', ['zh-mima'], {
            id: 'zh.ex.n1vdrijb3f5xs0',
            accepted: ['mìmǎ shì duōshao', '密码是多少'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '开和关',
        objective: 'Prender, apagar y escribir correos.',
        intro: {
          explanation:
            '开 es abrir o prender y 关, cerrar o apagar: 开电脑, 关手机. 电子邮件 es el correo electrónico.',
          examples: [
            { target: '我开电脑上网。', base: 'Prendo la computadora y me conecto.' },
            { target: '晚上我关手机。', base: 'Por la noche apago el celular.' },
          ],
        },
        takeaways: ['Prendes y apagas con 开 y 关.', 'Mandas un 电子邮件.'],
        exercises: [
          ex.translationChoice(
            '关',
            'apagar (cerrar)',
            ['prender (abrir)', 'cargar (la batería)', 'usar'],
            ['zh-guan'],
            { id: 'zh.ex.ruxup3vbj7r2t1' },
          ),
          ex.translationChoice(
            '电子邮件',
            'correo electrónico',
            ['mensaje', 'contraseña', 'video'],
            ['zh-dianziyoujian'],
            {
              id: 'zh.ex.miz6ebug65a40o',
            },
          ),
          ex.listenChoice(
            '晚上我关手机。',
            ['晚上我开手机。', '早上我关手机。', '晚上我关电脑。'],
            ['zh-guan'],
            { id: 'zh.ex.ocwj7r31if3ett' },
          ),
          ex.fillBlank(
            '我___电脑上网。',
            'Prendo la computadora y me conecto.',
            '开',
            ['关', '发', '拍'],
            ['zh-kai'],
            {
              id: 'zh.ex.b5zqsimmhksoqz',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '我给经理发了一个___。',
            'Le mandé un correo a la gerente.',
            '电子邮件',
            ['密码', '号码', '充电'],
            ['zh-dianziyoujian'],
            {
              id: 'zh.ex.jlwip8w2x32cvi',
              skill: 'vocabulary',
            },
          ),
          tone('关', 'guān', ['guán', 'guǎn', 'guàn'], ['zh-guan'], { id: 'zh.ex.9zzdkh2la9klqn' }),
          ex.matchPairs(
            [
              ['开', 'prender (abrir)'],
              ['关', 'apagar (cerrar)'],
              ['用', 'usar'],
              ['电子邮件', 'correo electrónico'],
            ],
            ['zh-kai', 'zh-guan', 'zh-yong', 'zh-dianziyoujian'],
            { id: 'zh.ex.0dvq0i5wmvtfih' },
          ),
          reply(
            '你开电脑了吗？',
            '¿Prendiste la computadora? (Responde que todavía no.)',
            'hái méi kāi',
            '还没开',
            ['zh-kai'],
            {
              id: 'zh.ex.rtg3ob775ad8ah',
              accepted: [
                'hái méi',
                '还没',
                'wǒ hái méi kāi',
                '我还没开',
                'hái méi kāi ne',
                '还没开呢',
              ],
            },
          ),
          write('Apaga el celular.', 'nǐ guān shǒujī ba', '你关手机吧', ['zh-guan'], {
            id: 'zh.ex.jwmxn2u7w2zngf',
            accepted: ['guān shǒujī', '关手机', 'qǐng guān shǒujī', '请关手机'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '把照片发给我',
        objective: 'Decir qué haces con una cosa usando 把.',
        intro: {
          explanation:
            'Con 把 la cosa va antes del verbo, cuando haces algo con ella (la mandas, la das, la apagas): 把照片发给我 (mándame la foto). Estructura: 把 + cosa + verbo + algo más (给我, 了…). El verbo nunca queda solo.',
          examples: [
            { target: '请把手机给我。', base: 'Dame el celular, por favor.' },
            { target: '我把照片发给你了。', base: 'Te mandé las fotos.' },
          ],
        },
        takeaways: [
          'Usas 把 + cosa + verbo + algo más.',
          'Entiendes mensajes y pedidos sobre tecnología.',
        ],
        exercises: [
          ex.listenChoice(
            '我把照片发给你了。',
            ['我把视频发给你了。', '你把照片发给我了。', '我把照片发给他了。'],
            ['zh-ba-objeto'],
            {
              id: 'zh.ex.q16x0qefhpdv7j',
            },
          ),
          ex.fillBlank(
            '请___手机给我。',
            'Dame el celular, por favor.',
            '把',
            ['在', '从', '比'],
            ['zh-ba-objeto'],
            {
              id: 'zh.ex.qu8ug1yhidwn20',
              explanation: '把 + cosa + verbo: la cosa va antes del verbo.',
            },
          ),
          ex.fillBlank(
            '我把电脑关___。',
            'Apagué la computadora.',
            '了',
            ['吗', '的', '呢'],
            ['zh-ba-objeto', 'zh-guan'],
            {
              id: 'zh.ex.fh56pps62kjk94',
              explanation: 'Con 把 el verbo no va solo: lleva 了, 给…, un resultado.',
            },
          ),
          ex.orderWords(
            '我 把 照片 发 给 你 了。',
            'Te mandé las fotos.',
            ['zh-ba-objeto', 'zh-fa'],
            { id: 'zh.ex.6255e05kznk1fm' },
          ),
          question(
            'zh.ex.dc4jvcc88i7s72',
            AYUDA,
            '¿Qué quiere hacer la mamá de Wang Ming?',
            'Mandarle una foto a la hermana de Wang Ming',
            ['Sacar una foto', 'Llamar a la hermana', 'Comprar un celular nuevo'],
            ['zh-ba-objeto', 'zh-zhaopian'],
            'La mamá dice: «我想把这张照片发给你姐姐».',
          ),
          question(
            'zh.ex.mh5evlcf2rwgic',
            AYUDA,
            '¿Qué le dice la mamá a Wang Ming al final?',
            'Que le explicó muy bien',
            ['Que no entendió', 'Que el celular es muy caro', 'Que mande él la foto'],
            ['zh-jiao-ensenar', 'zh-de-grado'],
            'La mamá dice: «你教得很好».',
          ),
          question(
            'zh.ex.9p4bog705jspjx',
            MENSAJE,
            '¿Por qué Li Hua no puede llamar?',
            'Su celular se quedó sin batería',
            ['No tiene el número', 'No tiene internet', 'Está en una reunión'],
            ['zh-chongdian'],
            'Li Hua escribe: «我的手机没电了，不能打电话».',
          ),
          question(
            'zh.ex.uvwb6ttyd3ao7x',
            MENSAJE,
            '¿Adónde mandó Li Hua las fotos?',
            'Al correo electrónico de Zhang Li',
            ['A su celular', 'A la gerente', 'A su mamá'],
            ['zh-dianziyoujian', 'zh-ba-objeto'],
            'Li Hua escribe: «我把今天拍的照片发到你的电子邮件了».',
          ),
          reply(
            '照片呢？',
            '¿Y las fotos? (Responde que ya se las mandaste.)',
            'wǒ yǐjīng bǎ zhàopiàn fā gěi nǐ le',
            '我已经把照片发给你了',
            ['zh-ba-objeto'],
            {
              id: 'zh.ex.fjocrmbchvq58z',
              accepted: [
                'wǒ bǎ zhàopiàn fā gěi nǐ le',
                '我把照片发给你了',
                'yǐjīng fā gěi nǐ le',
                '已经发给你了',
                'fā gěi nǐ le',
                '发给你了',
              ],
            },
          ),
          write('Pásame el libro.', 'bǎ shū gěi wǒ', '把书给我', ['zh-ba-objeto'], {
            id: 'zh.ex.ysja36jpd31z1e',
            accepted: ['qǐng bǎ shū gěi wǒ', '请把书给我', 'nǐ bǎ shū gěi wǒ', '你把书给我'],
          }),
        ],
      },
    ],
  },
};

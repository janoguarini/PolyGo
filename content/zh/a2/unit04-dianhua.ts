import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U4 «¿Qué estás haciendo? Llamadas y mensajes» (docs/ZH_A1_A2.md): acciones en curso con
 * 在 / 正在…呢 y su negación con 没在, hablar por teléfono (喂, 你找谁？, 给…打电话), esperar (等一会儿,
 * 马上) y quedar en un lugar.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const TELEFONO = dialogue('zh.stim.a2-u4-dianhua', 'Wang Ming llama a la casa de Zhang Li.', [
  ['王明', '喂，你好！请问，张丽在吗？'],
  ['张丽的妈妈', '她正在洗澡呢。你是谁？'],
  ['王明', '我是她的同学王明。'],
  ['张丽的妈妈', '好，她一会儿给你打电话。'],
]);

const MENSAJE = reading(
  'zh.stim.a2-u4-menkou',
  'message',
  'Li Hua le escribe a Anna.',
  ['我已经在你家门口了。', '你在做什么呢？', '我等你一会儿。'],
  { from: '李华', to: '安娜' },
);

const VIDEOLLAMADA = dialogue('zh.stim.a2-u4-paobu', 'Anna llama a Li Hua.', [
  ['安娜', '你在做什么呢？'],
  ['李华', '我在玩游戏。你呢？'],
  ['安娜', '我正在跑步，有点儿累。你现在方便吗？我有事。'],
  ['李华', '方便，你说吧。'],
]);

export const ZH_A2_U04: ZhUnitDef = {
  names: ['张丽', '李华', '安娜'],
  support: [],
  unit: {
    position: 4,
    title: '¿Qué estás haciendo?',
    titleEn: '打电话 On the phone',
    description: 'Acciones en curso con 在 y 正在, llamadas, esperar y encontrarse en un lugar.',
    emoji: '📞',
    objective:
      'Podés decir qué estás haciendo ahora, atender y hacer una llamada, pedir que te esperen y decir dónde estás.',
    grammar: {
      title: '在 / 正在 + verbo (+ 呢) · 给 + persona + 打电话',
      explanation:
        'Una acción en curso se dice con 在 o 正在 antes del verbo, muchas veces con 呢 al final: 我在做饭呢. Se niega con 没在. Para llamar a alguien: 给 + persona + 打电话. Al atender se dice 喂 (wéi).',
      examples: [
        { target: '你在做什么呢？——我在跑步。', base: '¿Qué estás haciendo? — Estoy corriendo.' },
        { target: '她正在洗澡呢。', base: 'Se está bañando.' },
        { target: '我晚上给你打电话。', base: 'A la noche te llamo.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 nuevo (U4). Sin revisión nativa: revisar 没在 y el tono de 喂 al teléfono (wéi).',
    },
    words: [
      w(
        'zh-zhengzai',
        '正在',
        'zhèngzài',
        'estar (haciendo algo)',
        '她正在洗澡呢。',
        'Se está bañando.',
        ['grammar'],
        {
          acceptedTranslations: ['estar haciendo'],
        },
      ),
      w(
        'zh-paobu',
        '跑步',
        'pǎobù',
        'correr',
        '我在跑步。',
        'Estoy corriendo.',
        ['free-time', 'verbs'],
        {
          acceptedTranslations: ['salir a correr'],
          emoji: '🏃',
        },
      ),
      w(
        'zh-youxi',
        '游戏',
        'yóuxì',
        'juego',
        '我在玩游戏。',
        'Estoy jugando a un juego.',
        ['free-time'],
        {
          acceptedTranslations: ['videojuego'],
          emoji: '🎮',
        },
      ),
      w(
        'zh-dadianhua',
        '打电话',
        'dǎ diànhuà',
        'llamar por teléfono',
        '我给妈妈打电话。',
        'Llamo a mi mamá.',
        ['communication'],
        {
          acceptedTranslations: ['llamar'],
        },
      ),
      w(
        'zh-wei',
        '喂',
        'wéi',
        '¿hola? (al teléfono)',
        '喂，你好！',
        '¿Hola? ¡Buenas!',
        ['communication'],
        {
          acceptedTranslations: ['hola (al teléfono)', '¿sí?'],
        },
      ),
      w('zh-zhao', '找', 'zhǎo', 'buscar', '你找谁？', '¿Con quién querés hablar?', ['verbs']),
      w('zh-deng', '等', 'děng', 'esperar', '请等一会儿。', 'Esperá un ratito, por favor.', [
        'verbs',
      ]),
      w(
        'zh-yihuir',
        '一会儿',
        'yíhuìr',
        'un ratito',
        '她一会儿给你打电话。',
        'Ella te llama en un ratito.',
        ['time'],
        {
          acceptedTranslations: ['un rato', 'en un rato'],
        },
      ),
      w('zh-mashang', '马上', 'mǎshàng', 'enseguida', '我马上来！', '¡Ya voy!', ['time'], {
        acceptedTranslations: ['ya mismo', 'inmediatamente'],
      }),
      w(
        'zh-menkou',
        '门口',
        'ménkǒu',
        'la puerta (la entrada)',
        '我在门口等你。',
        'Te espero en la puerta.',
        ['places', 'home'],
        {
          acceptedTranslations: ['la puerta', 'la entrada'],
          emoji: '🚪',
        },
      ),
      w(
        'zh-lou',
        '楼',
        'lóu',
        'piso (edificio)',
        '我家在三楼。',
        'Vivo en el tercer piso.',
        ['places', 'home'],
        {
          acceptedTranslations: ['piso', 'edificio'],
          emoji: '🏢',
        },
      ),
      w(
        'zh-xizao',
        '洗澡',
        'xǐzǎo',
        'bañarse',
        '他正在洗澡。',
        'Se está bañando.',
        ['home', 'verbs'],
        {
          acceptedTranslations: ['ducharse'],
          emoji: '🚿',
        },
      ),
      w(
        'zh-fangbian',
        '方便',
        'fāngbiàn',
        'conveniente (cómodo)',
        '你现在方便吗？',
        '¿Podés hablar ahora?',
        ['adjectives'],
        {
          acceptedTranslations: ['conveniente', 'cómodo', 'práctico'],
        },
      ),
      w(
        'zh-youshi',
        '有事',
        'yǒu shì',
        'tener algo que hacer',
        '对不起，我今天有事。',
        'Perdón, hoy tengo algo que hacer.',
        ['social'],
        {
          acceptedTranslations: ['estar ocupado', 'tener un compromiso'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '你在做什么呢？',
        objective: 'Decir qué estás haciendo ahora.',
        intro: {
          explanation:
            'Una acción en curso se dice con 在 + verbo, muchas veces con 呢 al final: 我在做饭呢 (estoy cocinando). 正在 subraya «justo ahora». Se niega con 没在: 我没在睡觉.',
          examples: [
            {
              target: '你在做什么呢？——我在跑步。',
              base: '¿Qué estás haciendo? — Estoy corriendo.',
            },
            { target: '他正在玩游戏。', base: 'Está jugando a un juego.' },
          ],
        },
        takeaways: ['Decís lo que hacés ahora con 在 / 正在.', 'Lo negás con 没在.'],
        exercises: [
          ex.translationChoice(
            '正在',
            'estar (haciendo algo)',
            ['ya', 'todavía no', 'enseguida'],
            ['zh-zhengzai'],
            {
              id: 'zh.ex.ccsn6kl7972su1',
            },
          ),
          ex.imageChoice('🏃', '跑步', ['游泳', '跳舞', '唱歌'], ['zh-paobu'], {
            id: 'zh.ex.tc4p0oen37sr79',
          }),
          ex.listenChoice(
            '我在做饭呢。',
            ['我在吃饭呢。', '我在睡觉呢。', '我不做饭。'],
            ['zh-zhengzai'],
            { id: 'zh.ex.asuu2aii494x5u' },
          ),
          ex.fillBlank(
            '他___玩游戏呢。',
            'Está jugando a un juego.',
            '在',
            ['了', '过', '没'],
            ['zh-youxi', 'zh-zhengzai'],
            {
              id: 'zh.ex.9qvlg94r38tm2f',
              explanation: 'Acción en curso: 在 + verbo (+ 呢).',
            },
          ),
          ex.fillBlank(
            'A：你在睡觉吗？ B：我___在睡觉，我在看书。',
            'A: ¿Estás durmiendo? B: No, estoy leyendo.',
            '没',
            ['了', '也', '过'],
            ['zh-zhengzai', 'zh-mei-pasado'],
            { id: 'zh.ex.z6gtq1wtd956om', explanation: 'Una acción en curso se niega con 没在.' },
          ),
          tone('游戏', 'yóuxì', ['yōuxì', 'yǒuxǐ', 'yóuxí'], ['zh-youxi'], {
            id: 'zh.ex.0d0m0cu9bd0sib',
          }),
          ex.matchPairs(
            [
              ['正在', 'estar (haciendo algo)'],
              ['跑步', 'correr'],
              ['游戏', 'juego'],
              ['做饭', 'cocinar'],
            ],
            ['zh-zhengzai', 'zh-paobu', 'zh-youxi', 'zh-zuofan'],
            { id: 'zh.ex.v1vawx58na8705' },
          ),
          reply(
            '你在做什么呢？',
            '¿Qué estás haciendo? (Respondé que estás corriendo.)',
            'wǒ zài pǎobù',
            '我在跑步',
            ['zh-paobu', 'zh-zhengzai'],
            {
              id: 'zh.ex.wutq2kfp81vobk',
              accepted: [
                'wǒ zài pǎobù ne',
                '我在跑步呢',
                'wǒ zhèngzài pǎobù',
                '我正在跑步',
                'zài pǎobù',
                '在跑步',
              ],
            },
          ),
          write('Estoy cocinando.', 'wǒ zài zuò fàn ne', '我在做饭呢', ['zh-zhengzai'], {
            id: 'zh.ex.5lyjfhnewp6s8r',
            accepted: ['wǒ zài zuò fàn', '我在做饭', 'wǒ zhèngzài zuò fàn', '我正在做饭'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '喂，你找谁？',
        objective: 'Hacer y atender una llamada.',
        intro: {
          explanation:
            '打电话 es llamar por teléfono, y a quién se llama va con 给: 给妈妈打电话. Al atender se dice 喂 (wéi). 你找谁？ es «¿con quién querés hablar?» (literalmente, «¿a quién buscás?»).',
          examples: [
            { target: '喂，你好！', base: '¿Hola? ¡Buenas!' },
            { target: '我给妈妈打电话。', base: 'Llamo a mi mamá.' },
          ],
        },
        takeaways: ['Atendés con 喂 y preguntás 你找谁？', 'Decís a quién llamás con 给…打电话.'],
        exercises: [
          ex.translationChoice(
            '打电话',
            'llamar por teléfono',
            ['buscar', 'esperar', 'correr'],
            ['zh-dadianhua'],
            {
              id: 'zh.ex.tgt5t8iqtoz6y1',
            },
          ),
          ex.translationChoice('找', 'buscar', ['esperar', 'correr', 'bañarse'], ['zh-zhao'], {
            id: 'zh.ex.nktfb835rmt8wg',
          }),
          ex.listenChoice(
            '喂，你好！请问，王明在吗？',
            ['喂，你好！请问，王明在家吗？', '你好！我是王明。', '喂，你找谁？'],
            ['zh-wei'],
            { id: 'zh.ex.fcl2jrx4ykuc90' },
          ),
          ex.fillBlank(
            '我___妈妈打电话。',
            'Llamo a mi mamá.',
            '给',
            ['从', '在', '比'],
            ['zh-dadianhua', 'zh-gei'],
            {
              id: 'zh.ex.1rdoby2q52anw7',
              explanation: 'A quién se llama va con 给: 给妈妈打电话.',
            },
          ),
          ex.fillBlank(
            'A：喂，你___谁？ B：我找李华。',
            'A: ¿Hola? ¿Con quién querés hablar? B: Con Li Hua.',
            '找',
            ['回', '见面', '叫'],
            ['zh-zhao', 'zh-wei'],
            { id: 'zh.ex.ykssgkcmeesq3l' },
          ),
          tone('喂', 'wéi', ['wēi', 'wěi', 'wèi'], ['zh-wei'], {
            id: 'zh.ex.5bxlmwgod6o4l0',
            explanation: 'Al teléfono 喂 se dice con segundo tono: wéi.',
          }),
          ex.orderWords(
            '我 晚上 给 你 打电话。',
            'A la noche te llamo.',
            ['zh-dadianhua', 'zh-gei'],
            { id: 'zh.ex.l74gfzwmmkhhkd' },
          ),
          reply(
            '喂，你找谁？',
            '¿Hola? ¿Con quién querés hablar? (Decí que buscás a Wang Ming.)',
            'wǒ zhǎo Wáng Míng',
            '我找王明',
            ['zh-zhao'],
            {
              id: 'zh.ex.t7rcejgjofveuh',
              accepted: [
                'zhǎo Wáng Míng',
                '找王明',
                'Wáng Míng zài ma',
                '王明在吗',
                'qǐngwèn, Wáng Míng zài ma',
                '请问，王明在吗',
              ],
            },
          ),
          write(
            'Llamo a mi papá.',
            'wǒ gěi bàba dǎ diànhuà',
            '我给爸爸打电话',
            ['zh-dadianhua', 'zh-gei'],
            {
              id: 'zh.ex.r31ufoyox9zbyz',
              accepted: ['wǒ gěi wǒ bàba dǎ diànhuà', '我给我爸爸打电话'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '等一会儿',
        objective: 'Pedir que te esperen y decir que ya vas.',
        intro: {
          explanation:
            '等 es esperar: 等我！ 一会儿 es «un ratito»: 请等一会儿. 马上 es «enseguida»: 我马上来 (¡ya voy!).',
          examples: [
            { target: '请等一会儿。', base: 'Esperá un ratito, por favor.' },
            { target: '我马上来！', base: '¡Ya voy!' },
          ],
        },
        takeaways: ['Pedís que te esperen con 等一会儿.', 'Decís «ya voy» con 马上.'],
        exercises: [
          ex.translationChoice('等', 'esperar', ['buscar', 'correr', 'volver'], ['zh-deng'], {
            id: 'zh.ex.3nxut9empgueoi',
          }),
          ex.translationChoice(
            '马上',
            'enseguida',
            ['un ratito', 'hace un rato', 'ya'],
            ['zh-mashang'],
            { id: 'zh.ex.s0gspbcdwxdgn0' },
          ),
          ex.listenChoice(
            '请等一会儿。',
            ['请等我。', '我马上来。', '我等一会儿。'],
            ['zh-deng', 'zh-yihuir'],
            { id: 'zh.ex.x30j2dcsgi0g0s' },
          ),
          ex.fillBlank(
            '你等我，我___来！',
            'Esperame, ¡ya voy!',
            '马上',
            ['刚才', '已经', '去年'],
            ['zh-mashang'],
            {
              id: 'zh.ex.qp0wjji1z5w7ak',
            },
          ),
          ex.fillBlank(
            '她___给你打电话。',
            'Ella te llama en un ratito.',
            '一会儿',
            ['刚才', '去年', '已经'],
            ['zh-yihuir'],
            {
              id: 'zh.ex.hb6zggia0qpal0',
              skill: 'vocabulary',
            },
          ),
          tone('等', 'děng', ['dēng', 'déng', 'dèng'], ['zh-deng'], { id: 'zh.ex.4s11a1ktqd2r8r' }),
          ex.matchPairs(
            [
              ['等', 'esperar'],
              ['一会儿', 'un ratito'],
              ['马上', 'enseguida'],
              ['找', 'buscar'],
            ],
            ['zh-deng', 'zh-yihuir', 'zh-mashang', 'zh-zhao'],
            { id: 'zh.ex.utu4pwxn9w84d0' },
          ),
          reply(
            '你什么时候来？',
            '¿Cuándo venís? (Respondé que enseguida.)',
            'wǒ mǎshàng lái',
            '我马上来',
            ['zh-mashang'],
            { id: 'zh.ex.951r4z8t0umajx', accepted: ['mǎshàng lái', '马上来', 'mǎshàng', '马上'] },
          ),
          write('Esperame un ratito.', 'děng wǒ yíhuìr', '等我一会儿', ['zh-deng', 'zh-yihuir'], {
            id: 'zh.ex.njh3xklcmj5u33',
            accepted: ['nǐ děng wǒ yíhuìr', '你等我一会儿', 'qǐng děng wǒ yíhuìr', '请等我一会儿'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '门口和楼',
        objective: 'Decir dónde estás o dónde te espero.',
        intro: {
          explanation:
            '门口 es la puerta de entrada: 我在门口等你. 楼 es el edificio y también el piso: 我家在三楼 (vivo en el tercer piso). 洗澡 es bañarse o ducharse.',
          examples: [
            { target: '我在门口等你。', base: 'Te espero en la puerta.' },
            { target: '我家在三楼。', base: 'Vivo en el tercer piso.' },
          ],
        },
        takeaways: ['Decís dónde esperás con 在门口.', 'Decís el piso con número + 楼.'],
        exercises: [
          ex.translationChoice(
            '门口',
            'la puerta (la entrada)',
            ['piso (edificio)', 'cocina', 'habitación'],
            ['zh-menkou'],
            {
              id: 'zh.ex.1zpa1zrmmamnc3',
            },
          ),
          ex.translationChoice('洗澡', 'bañarse', ['lavar', 'dormir', 'levantarse'], ['zh-xizao'], {
            id: 'zh.ex.i0v7nokf3xhuii',
          }),
          ex.listenChoice(
            '我在门口等你。',
            ['我在门口等他。', '我在家等你。', '我在楼下等你。'],
            ['zh-menkou'],
            { id: 'zh.ex.fceiely49s6fa3' },
          ),
          ex.fillBlank(
            '他正在___呢，等一会儿吧。',
            'Se está bañando; esperá un rato.',
            '洗澡',
            ['门口', '楼', '一会儿'],
            ['zh-xizao'],
            {
              id: 'zh.ex.1j75lyu7w2ia9e',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '我家在五___。',
            'Vivo en el quinto piso.',
            '楼',
            ['次', '岁', '碗'],
            ['zh-lou'],
            { id: 'zh.ex.gwi6pbp32e5a83' },
          ),
          tone('楼', 'lóu', ['lōu', 'lǒu', 'lòu'], ['zh-lou'], { id: 'zh.ex.1xh1vad1rtdiyp' }),
          question(
            'zh.ex.tbf5i0twydgpz3',
            MENSAJE,
            '¿Dónde está Li Hua?',
            'En la puerta de la casa de Anna',
            ['En su casa', 'En la escuela', 'En el tercer piso'],
            ['zh-menkou'],
            'Li Hua escribe: «我已经在你家门口了».',
          ),
          question(
            'zh.ex.el1y8ffmtwjxef',
            MENSAJE,
            '¿Qué va a hacer Li Hua?',
            'Esperarla un rato',
            ['Irse enseguida', 'Llamarla a la noche', 'Volver mañana'],
            ['zh-deng', 'zh-yihuir'],
            'Li Hua escribe: «我等你一会儿».',
          ),
          reply(
            '你家在几楼？',
            '¿En qué piso vivís? (Respondé: en el tercero.)',
            'sān lóu',
            '三楼',
            ['zh-lou'],
            {
              id: 'zh.ex.7s2yu2l87rh371',
              accepted: ['wǒ jiā zài sān lóu', '我家在三楼', 'zài sān lóu', '在三楼'],
            },
          ),
          write(
            'Te espero en la puerta.',
            'wǒ zài ménkǒu děng nǐ',
            '我在门口等你',
            ['zh-menkou', 'zh-deng'],
            { id: 'zh.ex.26erc7jycu1tcf' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '你现在方便吗？',
        objective: 'Preguntar si alguien puede hablar y entender llamadas.',
        intro: {
          explanation:
            '方便 es «cómodo, conveniente»: 你现在方便吗？ (¿podés hablar ahora?). 有事 es «tener algo que hacer o que decir»: 我有事. Para que el otro hable: 你说吧 (dale, decime).',
          examples: [
            { target: '你现在方便吗？', base: '¿Podés hablar ahora?' },
            { target: '对不起，我今天有事。', base: 'Perdón, hoy tengo algo que hacer.' },
          ],
        },
        takeaways: [
          'Preguntás si es buen momento con 方便吗？',
          'Entendés quién hace qué en una llamada.',
        ],
        exercises: [
          ex.translationChoice(
            '方便',
            'conveniente (cómodo)',
            ['ocupado', 'barato', 'cerca'],
            ['zh-fangbian'],
            { id: 'zh.ex.b8ars7nzmlyrtz' },
          ),
          ex.listenChoice(
            '你现在方便吗？',
            ['你现在忙吗？', '你明天方便吗？', '你现在有事吗？'],
            ['zh-fangbian'],
            { id: 'zh.ex.7geh2z56xksl1n' },
          ),
          ex.fillBlank(
            '对不起，我今天___，不能去。',
            'Perdón, hoy tengo algo que hacer: no puedo ir.',
            '有事',
            ['方便', '马上', '一会儿'],
            ['zh-youshi'],
            {
              id: 'zh.ex.9g1z6w76syxcgi',
              skill: 'vocabulary',
            },
          ),
          question(
            'zh.ex.4bobkb0d0c5mgk',
            TELEFONO,
            '¿Qué está haciendo Zhang Li?',
            'Se está bañando',
            ['Está durmiendo', 'Está corriendo', 'Está en la escuela'],
            ['zh-zhengzai', 'zh-xizao'],
            'La mamá dice: «她正在洗澡呢».',
          ),
          question(
            'zh.ex.30ajg7yf9dm4hu',
            TELEFONO,
            '¿Qué va a pasar después?',
            'Zhang Li va a llamar a Wang Ming en un rato',
            [
              'Wang Ming va a volver a llamar mañana',
              'Wang Ming va a ir a la casa',
              'La mamá le va a escribir',
            ],
            ['zh-dadianhua', 'zh-yihuir'],
            'La mamá dice: «她一会儿给你打电话».',
          ),
          question(
            'zh.ex.9x0sq579j8bvx0',
            VIDEOLLAMADA,
            '¿Qué está haciendo Anna?',
            'Está corriendo y está medio cansada',
            ['Está jugando a un juego', 'Está descansando', 'Está corriendo y está muy bien'],
            ['zh-paobu', 'zh-zhengzai'],
            'Anna dice: «我正在跑步，有点儿累».',
          ),
          question(
            'zh.ex.af09novcbtxsgk',
            VIDEOLLAMADA,
            '¿Por qué pregunta Anna si Li Hua puede hablar?',
            'Porque tiene algo que decirle',
            ['Porque está aburrida', 'Porque quiere jugar con él', 'Porque está muy cansada'],
            ['zh-fangbian', 'zh-youshi'],
            'Anna dice: «你现在方便吗？我有事».',
          ),
          reply(
            '你现在方便吗？',
            '¿Podés hablar ahora? (Respondé que sí, que te diga.)',
            'fāngbiàn, nǐ shuō ba',
            '方便，你说吧',
            ['zh-fangbian'],
            { id: 'zh.ex.sbfna11wqt8nzr', accepted: ['fāngbiàn', '方便', 'nǐ shuō ba', '你说吧'] },
          ),
          write('Hoy tengo algo que hacer.', 'wǒ jīntiān yǒu shì', '我今天有事', ['zh-youshi'], {
            id: 'zh.ex.zomqd5v2sssst4',
            accepted: ['jīntiān wǒ yǒu shì', '今天我有事'],
          }),
        ],
      },
    ],
  },
};

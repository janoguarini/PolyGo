import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U3 «Restaurante y hotel» (docs/ZH_A1_A2.md): el menú, pedir (点菜, 来一碗…), 请 y 给,
 * sabores, la reduplicación de verbos (尝尝), pedir la cuenta y reservar un hotel.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RESTAURANTE = dialogue('zh.stim.a2-u3-dianci', 'Zhang Li pide en un restaurante.', [
  ['服务员', '你们好！这是菜单。'],
  ['张丽', '这个鱼辣吗？'],
  ['服务员', '不辣，有点儿甜。'],
  ['张丽', '好，我们要这个鱼和两碗米饭。'],
  ['服务员', '还要别的吗？'],
  ['张丽', '不要了，谢谢！'],
]);

const MENU = reading(
  'zh.stim.a2-u3-caidan',
  'menu',
  'El menú de un restaurante chico.',
  ['鱼 58块', '鸡蛋面条 18块', '米饭 2块一碗', '茶 10块一杯'],
  { title: '菜单' },
);

const HOTEL = dialogue('zh.stim.a2-u3-binguan', 'Anna llega a un hotel.', [
  ['安娜', '你好，我预订了一个房间。我叫安娜。'],
  ['服务员', '你好！请给我你的护照。'],
  ['安娜', '在这儿。'],
  ['服务员', '谢谢。你的房间是五二六号。'],
]);

export const ZH_A2_U03: ZhUnitDef = {
  names: ['张丽', '安娜'],
  support: ['还', '别的'],
  unit: {
    position: 3,
    title: 'Restaurante y hotel',
    titleEn: '饭馆 Restaurants and hotels',
    description:
      'Leer un menú, pedir, decir cómo es la comida, pedir la cuenta y llegar a un hotel.',
    emoji: '🍜',
    objective:
      'Puedes leer un menú sencillo, pedir con 来 y 请, decir si algo es picante o dulce, pedir la cuenta y hacer el check-in en un hotel.',
    grammar: {
      title: '请 · 给 + persona · 来 + cantidad · verbo repetido',
      explanation:
        '请 + verbo es «por favor»: 请给我菜单. 给 es «dar» y, antes de una persona, «a / para»: 给我一双筷子. En un restaurante, 来 + cantidad es pedir: 来一碗米饭. El verbo repetido suaviza: 尝尝 (prueba un poco).',
      examples: [
        { target: '请给我菜单。', base: 'El menú, por favor.' },
        { target: '来两碗米饭。', base: 'Dos platos de arroz, por favor.' },
        { target: '你尝尝！', base: '¡Prueba un poco!' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U3). Sin revisión nativa: revisar 来一碗, 买单 y el registro con el mesero y en el hotel.',
    },
    words: [
      w(
        'zh-cai',
        '菜',
        'cài',
        'plato (de comida)',
        '这个菜很好吃。',
        'Este plato es muy rico.',
        ['food'],
        {
          acceptedTranslations: ['comida', 'plato'],
        },
      ),
      w('zh-caidan', '菜单', 'càidān', 'menú', '这是菜单。', 'Este es el menú.', ['food'], {
        acceptedTranslations: ['carta'],
        emoji: '📋',
      }),
      w(
        'zh-diancai',
        '点菜',
        'diǎn cài',
        'pedir (comida)',
        '服务员，我们点菜！',
        '¡Mesero, queremos pedir!',
        ['food'],
        {
          acceptedTranslations: ['pedir', 'ordenar'],
        },
      ),
      w(
        'zh-yu',
        '鱼',
        'yú',
        'pescado',
        '我不吃肉，我吃鱼。',
        'No como carne, como pescado.',
        ['food'],
        {
          acceptedTranslations: ['pez'],
          emoji: '🐟',
        },
      ),
      w('zh-rou', '肉', 'ròu', 'carne', '我不吃肉。', 'No como carne.', ['food'], { emoji: '🥩' }),
      w(
        'zh-jidan',
        '鸡蛋',
        'jīdàn',
        'huevo',
        '我要鸡蛋面条。',
        'Quiero fideos con huevo.',
        ['food'],
        {
          emoji: '🥚',
        },
      ),
      w(
        'zh-la',
        '辣',
        'là',
        'picante',
        '这个菜有点儿辣。',
        'Este plato es medio picante.',
        ['food', 'adjectives'],
        {
          emoji: '🌶️',
        },
      ),
      w('zh-tian', '甜', 'tián', 'dulce', '这个鱼有点儿甜。', 'Este pescado es un poco dulce.', [
        'food',
        'adjectives',
      ]),
      w(
        'zh-chang-probar',
        '尝',
        'cháng',
        'probar (comida)',
        '你尝尝！',
        '¡Prueba un poco!',
        ['verbs', 'food'],
        {
          acceptedTranslations: ['probar', 'degustar'],
        },
      ),
      w(
        'zh-wan-tazon',
        '碗',
        'wǎn',
        'tazón (clasificador)',
        '来两碗米饭。',
        'Dos platos de arroz, por favor.',
        ['food', 'measure'],
        {
          acceptedTranslations: ['tazón', 'bol', 'plato hondo'],
          emoji: '🍚',
        },
      ),
      w(
        'zh-qing',
        '请',
        'qǐng',
        'por favor (invitar)',
        '请给我菜单。',
        'El menú, por favor.',
        ['courtesy'],
        {
          acceptedTranslations: ['por favor', 'invitar'],
        },
      ),
      w(
        'zh-gei',
        '给',
        'gěi',
        'dar (a, para)',
        '请给我一双筷子。',
        'Por favor, dame unos palitos.',
        ['verbs'],
        {
          acceptedTranslations: ['dar', 'para'],
        },
      ),
      w(
        'zh-kuaizi',
        '筷子',
        'kuàizi',
        'palitos',
        '请给我一双筷子。',
        'Por favor, dame unos palitos.',
        ['food'],
        {
          acceptedTranslations: ['palillos'],
          emoji: '🥢',
        },
      ),
      w(
        'zh-maidan',
        '买单',
        'mǎidān',
        'la cuenta (pagar)',
        '服务员，买单！',
        '¡Mesero, la cuenta!',
        ['food'],
        {
          acceptedTranslations: ['la cuenta', 'pagar la cuenta'],
        },
      ),
      w(
        'zh-binguan',
        '宾馆',
        'bīnguǎn',
        'hotel',
        '我在宾馆。',
        'Estoy en el hotel.',
        ['places', 'travel'],
        {
          emoji: '🏨',
        },
      ),
      w(
        'zh-yuding',
        '预订',
        'yùdìng',
        'reservar',
        '我预订了一个房间。',
        'Reservé una habitación.',
        ['verbs', 'travel'],
        {
          acceptedTranslations: ['hacer una reserva'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '菜单',
        objective: 'Leer los platos básicos de un menú.',
        intro: {
          explanation:
            '菜 es un plato de comida (y también la verdura); 菜单 es el menú. Algunos platos: 鱼 (pescado), 肉 (carne), 鸡蛋 (huevo).',
          examples: [
            { target: '这是菜单。', base: 'Este es el menú.' },
            { target: '我不吃肉，我吃鱼。', base: 'No como carne, como pescado.' },
          ],
        },
        takeaways: ['Reconoces 鱼, 肉 y 鸡蛋 en un menú.', 'Dices qué comes y qué no.'],
        exercises: [
          ex.imageChoice('🐟', '鱼', ['肉', '鸡蛋', '米饭'], ['zh-yu'], {
            id: 'zh.ex.z2slvhm0rmm8rc',
          }),
          ex.imageChoice('🥚', '鸡蛋', ['鱼', '肉', '面条'], ['zh-jidan'], {
            id: 'zh.ex.rlfx214jvb5809',
          }),
          ex.translationChoice(
            '菜单',
            'menú',
            ['plato (de comida)', 'carne', 'huevo'],
            ['zh-caidan'],
            { id: 'zh.ex.5jb7eecvx3htgr' },
          ),
          ex.listenChoice(
            '我不吃肉，我吃鱼。',
            ['我不吃鱼，我吃肉。', '我不吃肉，我吃鸡蛋。', '我吃肉，也吃鱼。'],
            ['zh-rou', 'zh-yu'],
            { id: 'zh.ex.s4o6kpmymnafen' },
          ),
          ex.fillBlank(
            '这个饭馆的___很好吃。',
            'La comida de este restaurante es muy rica.',
            '菜',
            ['菜单', '名字', '颜色'],
            ['zh-cai'],
            {
              id: 'zh.ex.50tu08mfxjgzdw',
              skill: 'vocabulary',
            },
          ),
          tone('鱼', 'yú', ['yū', 'yǔ', 'yù'], ['zh-yu'], { id: 'zh.ex.l5o9hxvgng209m' }),
          ex.matchPairs(
            [
              ['鱼', 'pescado'],
              ['肉', 'carne'],
              ['鸡蛋', 'huevo'],
              ['菜单', 'menú'],
            ],
            ['zh-yu', 'zh-rou', 'zh-jidan', 'zh-caidan'],
            { id: 'zh.ex.52vlvmfihxno9r' },
          ),
          reply(
            '你吃肉吗？',
            '¿Comes carne? (Responde que no, que comes pescado.)',
            'bù chī, wǒ chī yú',
            '不吃，我吃鱼',
            ['zh-rou', 'zh-yu'],
            {
              id: 'zh.ex.uhv3t2xj2mxxvp',
              accepted: [
                'wǒ bù chī ròu, wǒ chī yú',
                '我不吃肉，我吃鱼',
                'wǒ chī yú',
                '我吃鱼',
                'bù, wǒ chī yú',
                '不，我吃鱼',
              ],
            },
          ),
          write('Este plato es muy rico.', 'zhège cài hěn hǎochī', '这个菜很好吃', ['zh-cai'], {
            id: 'zh.ex.ogloon3ez25vyb',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '点菜',
        objective: 'Pedir en un restaurante.',
        intro: {
          explanation:
            'Para llamar al mesero y pedir: 服务员，我们点菜！ 请 + verbo es «por favor»: 请给我菜单. En un restaurante, 来 + cantidad es pedir algo: 来一碗米饭. 碗 es el tazón o plato hondo y se usa para contar arroz, fideos y sopa.',
          examples: [
            { target: '服务员，我们点菜！', base: '¡Mesero, queremos pedir!' },
            { target: '来两碗米饭。', base: 'Dos platos de arroz, por favor.' },
          ],
        },
        takeaways: ['Pides con 来 + cantidad.', 'Usas 请 para pedir con cortesía.'],
        exercises: [
          ex.translationChoice(
            '点菜',
            'pedir (comida)',
            ['probar (comida)', 'reservar', 'la cuenta (pagar)'],
            ['zh-diancai'],
            {
              id: 'zh.ex.mp83txr57d5ghx',
            },
          ),
          ex.translationChoice(
            '请',
            'por favor (invitar)',
            ['gracias', 'perdón', 'de nada'],
            ['zh-qing'],
            { id: 'zh.ex.uh8ozmbc94zo69' },
          ),
          ex.listenChoice(
            '来两碗米饭。',
            ['来一碗米饭。', '来两碗面条。', '来两杯茶。'],
            ['zh-wan-tazon'],
            { id: 'zh.ex.r619r2t0h0yqfs' },
          ),
          ex.fillBlank(
            '___给我菜单。',
            'El menú, por favor.',
            '请',
            ['来', '在', '有'],
            ['zh-qing', 'zh-caidan', 'zh-gei'],
            { id: 'zh.ex.08l7x1n3q694rx' },
          ),
          ex.fillBlank(
            '我要一___面条。',
            'Quiero un plato de fideos.',
            '碗',
            ['本', '件', '张'],
            ['zh-wan-tazon'],
            {
              id: 'zh.ex.a94nv5o57hqgm8',
              explanation: 'El arroz, los fideos y la sopa se cuentan con 碗.',
            },
          ),
          ex.orderWords(
            '服务员， 我们 点菜。',
            '¡Mesero, queremos pedir!',
            ['zh-diancai', 'zh-fuwuyuan'],
            { id: 'zh.ex.ybtjeg6nll0p5a' },
          ),
          tone('请', 'qǐng', ['qīng', 'qíng', 'qìng'], ['zh-qing'], { id: 'zh.ex.dox2ab23cdfmdu' }),
          reply(
            '你们要什么？',
            '¿Qué van a pedir? (Pide un plato de fideos.)',
            'lái yì wǎn miàntiáo',
            '来一碗面条',
            ['zh-wan-tazon'],
            {
              id: 'zh.ex.txr5h8ouage45l',
              accepted: ['wǒ yào yì wǎn miàntiáo', '我要一碗面条', 'yì wǎn miàntiáo', '一碗面条'],
            },
          ),
          write(
            'Dos platos de arroz, por favor.',
            'qǐng lái liǎng wǎn mǐfàn',
            '请来两碗米饭',
            ['zh-qing', 'zh-wan-tazon'],
            {
              id: 'zh.ex.wv11m3iukltr8w',
              accepted: [
                'lái liǎng wǎn mǐfàn',
                '来两碗米饭',
                'wǒ yào liǎng wǎn mǐfàn',
                '我要两碗米饭',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '辣、甜、尝尝',
        objective: 'Decir cómo es la comida y ofrecer probar.',
        intro: {
          explanation:
            '辣 es picante y 甜, dulce. 尝 es probar comida; repetido (尝尝) suena más suave: «prueba un poquito». Muchos verbos se repiten así: 看看 (mira un poco).',
          examples: [
            { target: '这个菜有点儿辣。', base: 'Este plato es medio picante.' },
            { target: '你尝尝！', base: '¡Prueba un poco!' },
          ],
        },
        takeaways: ['Dices si algo es picante o dulce.', 'Suavizas un verbo repitiéndolo: 尝尝.'],
        exercises: [
          ex.translationChoice('辣', 'picante', ['dulce', 'frío', 'caro'], ['zh-la'], {
            id: 'zh.ex.lmsyjaz4895rup',
          }),
          ex.translationChoice(
            '甜',
            'dulce',
            ['picante', 'barato', 'rico (de comer)'],
            ['zh-tian'],
            { id: 'zh.ex.tm8wihgdb00fit' },
          ),
          ex.listenChoice(
            '这个菜不辣。',
            ['这个菜很辣。', '这个菜不甜。', '那个菜不辣。'],
            ['zh-la'],
            { id: 'zh.ex.j0zzbdxk2vthti' },
          ),
          ex.fillBlank(
            '你尝___，很好吃！',
            'Prueba un poquito: ¡es muy rico!',
            '尝',
            ['看', '吃', '喝'],
            ['zh-chang-probar'],
            {
              id: 'zh.ex.hbcx6t6mtwu5du',
              explanation: 'El verbo repetido suaviza el pedido: 尝尝 = «prueba un poco».',
            },
          ),
          ex.fillBlank(
            '我不能吃___的。',
            'No puedo comer cosas picantes.',
            '辣',
            ['菜单', '碗', '请'],
            ['zh-la'],
            {
              id: 'zh.ex.z28tqjia9k1c8t',
              skill: 'vocabulary',
            },
          ),
          tone('甜', 'tián', ['tiān', 'tiǎn', 'tiàn'], ['zh-tian'], { id: 'zh.ex.bb2r6n8y1sxe3y' }),
          ex.matchPairs(
            [
              ['辣', 'picante'],
              ['甜', 'dulce'],
              ['尝', 'probar (comida)'],
              ['碗', 'tazón (clasificador)'],
            ],
            ['zh-la', 'zh-tian', 'zh-chang-probar', 'zh-wan-tazon'],
            { id: 'zh.ex.nm7fqxby7n5z1x' },
          ),
          reply(
            '这个菜辣吗？',
            '¿Este plato es picante? (Responde que es medio picante.)',
            'yǒudiǎnr là',
            '有点儿辣',
            ['zh-la'],
            { id: 'zh.ex.m13hf43in7oss0', accepted: ['zhège cài yǒudiǎnr là', '这个菜有点儿辣'] },
          ),
          write('Prueba esto.', 'nǐ chángchang zhège', '你尝尝这个', ['zh-chang-probar'], {
            id: 'zh.ex.0dc9ymztquwsrx',
            accepted: ['chángchang zhège', '尝尝这个'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '给我… · 买单！',
        objective: 'Pedir cosas en la mesa y pedir la cuenta.',
        intro: {
          explanation:
            '给 es «dar»; antes de una persona es «a / para»: 请给我一双筷子 (dame unos palitos), 妈妈给我做饭 (mamá cocina para mí). Para pedir la cuenta: 服务员，买单！ En China quien invita suele pagar todo: dividir la cuenta es menos común.',
          examples: [
            { target: '请给我一双筷子。', base: 'Por favor, dame unos palitos.' },
            { target: '服务员，买单！', base: '¡Mesero, la cuenta!' },
          ],
        },
        takeaways: ['Pides cosas con 给我….', 'Pides la cuenta con 买单.'],
        exercises: [
          ex.imageChoice('🥢', '筷子', ['碗', '菜单', '鸡蛋'], ['zh-kuaizi'], {
            id: 'zh.ex.0kqtgbn1gi9bkt',
          }),
          ex.translationChoice(
            '买单',
            'la cuenta (pagar)',
            ['menú', 'pedir (comida)', 'reservar'],
            ['zh-maidan'],
            { id: 'zh.ex.eqgoypifxme26p' },
          ),
          ex.listenChoice(
            '服务员，买单！',
            ['服务员，点菜！', '服务员，菜单！', '服务员，你好！'],
            ['zh-maidan'],
            { id: 'zh.ex.1lk07pvvq761kt' },
          ),
          ex.fillBlank(
            '请___我一双筷子。',
            'Por favor, dame unos palitos.',
            '给',
            ['跟', '在', '从'],
            ['zh-gei', 'zh-kuaizi'],
            {
              id: 'zh.ex.ltkj06q3wrkuaf',
            },
          ),
          ex.fillBlank(
            '妈妈___我做饭。',
            'Mamá cocina para mí.',
            '给',
            ['比', '从', '往'],
            ['zh-gei'],
            {
              id: 'zh.ex.brplg7nycygjfc',
              explanation: '给 + persona antes del verbo: «para alguien».',
            },
          ),
          tone('筷子', 'kuàizi', ['kuāizi', 'kuáizi', 'kuǎizi'], ['zh-kuaizi'], {
            id: 'zh.ex.5es9mb6yoezug6',
          }),
          question(
            'zh.ex.whopu3ge9hk4rx',
            MENU,
            '¿Cuánto cuesta el pescado?',
            '58 yuanes',
            ['18 yuanes', '10 yuanes', '2 yuanes'],
            ['zh-yu'],
            'El menú dice: «鱼 58块».',
          ),
          question(
            'zh.ex.nkwjmtsqony7n4',
            MENU,
            '¿Cuánto salen dos platos de arroz?',
            '4 yuanes',
            ['2 yuanes', '10 yuanes', '18 yuanes'],
            ['zh-wan-tazon'],
            'El menú dice «米饭 2块一碗»: dos platos son 4 yuanes.',
          ),
          reply('你们还要什么？', '¿Algo más? (Pide la cuenta.)', 'mǎidān', '买单', ['zh-maidan'], {
            id: 'zh.ex.dujqngo67318r6',
            accepted: ['fúwùyuán, mǎidān', '服务员，买单', 'wǒmen mǎidān', '我们买单'],
          }),
          write(
            'Dame el menú, por favor.',
            'qǐng gěi wǒ càidān',
            '请给我菜单',
            ['zh-gei', 'zh-qing', 'zh-caidan'],
            {
              id: 'zh.ex.vxubu3cffmlig9',
              accepted: ['gěi wǒ càidān', '给我菜单'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '在宾馆',
        objective: 'Hacer el check-in y entender una charla en un restaurante.',
        intro: {
          explanation:
            '宾馆 es el hotel. 预订 es reservar: 我预订了一个房间. En el mostrador te van a pedir el pasaporte: 请给我你的护照. Los números de habitación se leen cifra por cifra: 526 = 五二六.',
          examples: [
            { target: '我预订了一个房间。', base: 'Reservé una habitación.' },
            { target: '请给我你的护照。', base: 'Su pasaporte, por favor.' },
          ],
        },
        takeaways: ['Haces el check-in en un hotel.', 'Entiendes un pedido en un restaurante.'],
        exercises: [
          ex.translationChoice(
            '宾馆',
            'hotel',
            ['restaurante', 'aeropuerto', 'hospital'],
            ['zh-binguan'],
            { id: 'zh.ex.xtnhvr31nfgkgs' },
          ),
          ex.translationChoice(
            '预订',
            'reservar',
            ['pedir (comida)', 'la cuenta (pagar)', 'probar (comida)'],
            ['zh-yuding'],
            {
              id: 'zh.ex.g25y1y9lujcmrz',
            },
          ),
          ex.listenChoice(
            '我预订了一个房间。',
            ['我预订了两个房间。', '我没预订房间。', '我预订了一张票。'],
            ['zh-yuding'],
            {
              id: 'zh.ex.vqx8rhxnnxbfy5',
            },
          ),
          question(
            'zh.ex.dj9hl7opp0mm12',
            HOTEL,
            '¿Qué número de habitación tiene Anna?',
            '526',
            ['256', '562', '625'],
            ['zh-binguan'],
            'El empleado dice: «你的房间是五二六号».',
          ),
          question(
            'zh.ex.r192y8lnj6r2eo',
            HOTEL,
            '¿Qué le pide el empleado a Anna?',
            'El pasaporte',
            ['Dinero', 'Su número de teléfono', 'El nombre del hotel'],
            ['zh-qing', 'zh-gei'],
            'El empleado dice: «请给我你的护照».',
          ),
          question(
            'zh.ex.7r0o0xz844whv7',
            RESTAURANTE,
            '¿Cómo es el pescado, según el mesero?',
            'No es picante; es un poco dulce',
            ['Es muy picante', 'Es medio picante', 'No es dulce'],
            ['zh-la', 'zh-tian'],
            'El mesero dice: «不辣，有点儿甜».',
          ),
          question(
            'zh.ex.7bt2sfo89mq6df',
            RESTAURANTE,
            '¿Qué pide Zhang Li?',
            'El pescado y dos platos de arroz',
            ['El pescado y dos platos de fideos', 'Carne y arroz', 'Sólo el pescado'],
            ['zh-yu', 'zh-wan-tazon'],
            'Zhang Li dice: «我们要这个鱼和两碗米饭».',
          ),
          reply(
            '你预订房间了吗？',
            '¿Reservaste la habitación? (Responde que sí, que ya reservaste.)',
            'wǒ yǐjīng yùdìng le',
            '我已经预订了',
            ['zh-yuding'],
            {
              id: 'zh.ex.c9m3e8l41fr01q',
              accepted: ['yùdìng le', '预订了', 'yǐjīng yùdìng le', '已经预订了'],
            },
          ),
          write(
            'Reservé una habitación en el hotel.',
            'wǒ zài bīnguǎn yùdìng le yí ge fángjiān',
            '我在宾馆预订了一个房间',
            ['zh-binguan', 'zh-yuding'],
            {
              id: 'zh.ex.077x7juuxxet7o',
            },
          ),
        ],
      },
    ],
  },
};

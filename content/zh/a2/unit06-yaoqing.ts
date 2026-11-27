import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U6 «Invitaciones y planes» (docs/ZH_A1_A2.md): preguntas A-不-A (去不去, 有没有空), 打算,
 * 还是 en preguntas, aceptar (当然) y rechazar (可惜…下次吧) y los complementos de dirección básicos
 * (进来, 出去, 回来, 上来).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const INVITACION = dialogue('zh.stim.a2-u6-juhui', 'Anna llama a Wang Ming para invitarlo.', [
  ['安娜', '王明，你这个星期六有没有空？'],
  ['王明', '有空。你打算做什么？'],
  ['安娜', '我家有个聚会，你想不想来？'],
  ['王明', '当然想！几点？'],
  ['安娜', '晚上七点。'],
]);

const RECHAZO = reading(
  'zh.stim.a2-u6-kexi',
  'message',
  'Li Hua le contesta a Anna.',
  ['安娜，谢谢你请我参加聚会！', '可惜星期六我有事，不能去。', '下次我们一起出去玩吧！'],
  { from: '李华', to: '安娜' },
);

const VISITA = dialogue('zh.stim.a2-u6-huanying', 'Wang Ming llega a la casa de Anna.', [
  ['安娜', '欢迎，欢迎！请进来！'],
  ['王明', '谢谢！这是给你的。'],
  ['安娜', '太好了！你喝茶还是喝咖啡？'],
  ['王明', '茶吧，谢谢。'],
]);

export const ZH_A2_U06: ZhUnitDef = {
  names: ['安娜', '李华'],
  support: ['有没有', '空'],
  unit: {
    position: 6,
    title: 'Invitaciones y planes',
    titleEn: '邀请 Invitations',
    description:
      'Preguntar si alguien puede, contar planes, invitar, aceptar o rechazar y recibir visitas.',
    emoji: '🎉',
    objective:
      'Puedes preguntar si alguien tiene tiempo, contar tus planes, invitar, aceptar o rechazar con amabilidad y recibir a alguien en tu casa.',
    grammar: {
      title: 'A-不-A · 打算 · 还是 · 进来 / 出去',
      explanation:
        'Se pregunta repitiendo el verbo con 不 (去不去, 想不想) o con 没 si es 有 (有没有空), sin 吗. 打算 + verbo es un plan. 还是 es «o» en preguntas. Después de un verbo de movimiento, 来 indica hacia quien habla y 去, hacia afuera: 进来, 出去, 回来, 上来.',
      examples: [
        { target: '你有没有空？', base: '¿Tienes tiempo?' },
        { target: '你喝茶还是喝咖啡？', base: '¿Tomas té o café?' },
        { target: '欢迎，欢迎！请进来！', base: '¡Bienvenido! ¡Pasa!' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U6). Sin revisión nativa: revisar 还是 frente a 或者 (no enseñado) y los complementos de dirección.',
    },
    words: [
      w(
        'zh-youkong',
        '有空',
        'yǒu kòng',
        'tener tiempo libre',
        '你明天有没有空？',
        '¿Mañana tienes tiempo?',
        ['social', 'time'],
        {
          acceptedTranslations: ['estar libre'],
        },
      ),
      w('zh-shijian', '时间', 'shíjiān', 'tiempo', '我今天没有时间。', 'Hoy no tengo tiempo.', [
        'time',
      ]),
      w(
        'zh-xia-ge-xingqi',
        '下个星期',
        'xià ge xīngqī',
        'la semana que viene',
        '下个星期我有时间。',
        'La semana que viene tengo tiempo.',
        ['time'],
        {
          acceptedTranslations: ['semana que viene', 'la próxima semana'],
        },
      ),
      w(
        'zh-dasuan',
        '打算',
        'dǎsuan',
        'pensar hacer (planear)',
        '周末你打算做什么？',
        '¿Qué tienes pensado hacer el fin de semana?',
        ['verbs'],
        {
          acceptedTranslations: ['planear', 'tener pensado'],
        },
      ),
      w(
        'zh-juhui',
        '聚会',
        'jùhuì',
        'reunión (juntada)',
        '我家有个聚会。',
        'Hay una reunión en mi casa.',
        ['social'],
        {
          acceptedTranslations: ['reunión', 'juntada', 'fiesta'],
          emoji: '🎉',
        },
      ),
      w(
        'zh-canjia',
        '参加',
        'cānjiā',
        'participar (ir a)',
        '我想参加你的聚会。',
        'Quiero ir a tu reunión.',
        ['verbs', 'social'],
        {
          acceptedTranslations: ['participar'],
        },
      ),
      w(
        'zh-haishi',
        '还是',
        'háishi',
        'o (en preguntas)',
        '你喝茶还是喝咖啡？',
        '¿Tomas té o café?',
        ['grammar'],
        {
          acceptedTranslations: ['o'],
        },
      ),
      w('zh-dangran', '当然', 'dāngrán', 'claro', '当然想！', '¡Claro que quiero!', ['social'], {
        acceptedTranslations: ['por supuesto', 'obvio'],
      }),
      w(
        'zh-kexi',
        '可惜',
        'kěxī',
        'qué lástima',
        '可惜我有事。',
        'Qué lástima, tengo algo que hacer.',
        ['social'],
        {
          acceptedTranslations: ['lástima', 'qué pena'],
        },
      ),
      w(
        'zh-huanying',
        '欢迎',
        'huānyíng',
        'bienvenido',
        '欢迎，欢迎！',
        '¡Bienvenido!',
        ['courtesy'],
        {
          acceptedTranslations: ['bienvenida', 'bienvenidos'],
        },
      ),
      w(
        'zh-jinlai',
        '进来',
        'jìnlái',
        'pasar (entrar)',
        '请进来！',
        '¡Pasa!',
        ['verbs', 'directions'],
        {
          acceptedTranslations: ['entrar', 'pasá', 'pasa'],
        },
      ),
      w('zh-chuqu', '出去', 'chūqù', 'salir', '我们出去吃饭吧。', 'Salgamos a comer.', [
        'verbs',
        'directions',
      ]),
      w(
        'zh-huilai',
        '回来',
        'huílái',
        'volver (aquí)',
        '妈妈，你几点回来？',
        'Mamá, ¿a qué hora vuelves?',
        ['verbs', 'directions'],
        {
          acceptedTranslations: ['regresar', 'volver (acá)'],
        },
      ),
      w(
        'zh-shanglai',
        '上来',
        'shànglái',
        'subir (aquí)',
        '我在三楼，你上来吧！',
        'Estoy en el tercer piso, ¡sube!',
        ['verbs', 'directions'],
        {
          acceptedTranslations: ['subir', 'subir (acá)'],
        },
      ),
      w(
        'zh-xiaci',
        '下次',
        'xià cì',
        'la próxima vez',
        '下次我们一起去吧！',
        '¡La próxima vez vamos juntos!',
        ['time'],
        {
          acceptedTranslations: ['próxima vez'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '你有没有空？',
        objective: 'Preguntar si alguien tiene tiempo.',
        intro: {
          explanation:
            'Una forma muy común de preguntar es repetir el verbo con 不 en el medio: 你去不去？ (¿vas o no?), 你想不想来？ Con 有 se usa 没: 你有没有空？ Estas preguntas no llevan 吗.',
          examples: [
            { target: '你下个星期有没有空？', base: '¿La semana que viene tienes tiempo?' },
            { target: '你想不想去？', base: '¿Quieres ir?' },
          ],
        },
        takeaways: ['Preguntas con 去不去 y 有没有.', 'Hablas de tu tiempo libre con 有空.'],
        exercises: [
          ex.translationChoice(
            '有空',
            'tener tiempo libre',
            ['tener algo que hacer', 'estar cansado', 'tener hambre'],
            ['zh-youkong'],
            {
              id: 'zh.ex.fvg5ey94ngzq72',
            },
          ),
          ex.translationChoice(
            '时间',
            'tiempo',
            ['año', 'hora (de duración)', 'semana'],
            ['zh-shijian'],
            { id: 'zh.ex.c0e4w0z97uk1qf' },
          ),
          ex.listenChoice(
            '你下个星期有没有空？',
            ['你这个星期有没有空？', '你下个星期有空吗？', '你下个星期忙不忙？'],
            ['zh-youkong', 'zh-xia-ge-xingqi'],
            { id: 'zh.ex.el3bzlncga9ek9' },
          ),
          ex.fillBlank(
            '你有___有时间？',
            '¿Tienes tiempo?',
            '没',
            ['不', '也', '了'],
            ['zh-shijian'],
            {
              id: 'zh.ex.pa104v4s5l2rw8',
              explanation: 'Con 有 la pregunta es 有没有; con otros verbos, 去不去, 想不想.',
            },
          ),
          ex.fillBlank('你想___想去？', '¿Quieres ir?', '不', ['没', '吗', '也'], ['zh-xiang'], {
            id: 'zh.ex.k3j5l4bvg79uqq',
            explanation: 'Pregunta A-不-A: 想不想, sin 吗 al final.',
          }),
          tone('时间', 'shíjiān', ['shījiān', 'shǐjiǎn', 'shìjiàn'], ['zh-shijian'], {
            id: 'zh.ex.2se9nu7p6fc2e8',
          }),
          ex.matchPairs(
            [
              ['有空', 'tener tiempo libre'],
              ['时间', 'tiempo'],
              ['下个星期', 'la semana que viene'],
              ['上个星期', 'la semana pasada'],
            ],
            ['zh-youkong', 'zh-shijian', 'zh-xia-ge-xingqi', 'zh-shang-ge-xingqi'],
            { id: 'zh.ex.y0k3lfe29er4km' },
          ),
          reply(
            '你明天有没有空？',
            '¿Mañana tienes tiempo? (Responde que sí.)',
            'yǒu kòng',
            '有空',
            ['zh-youkong'],
            {
              id: 'zh.ex.9k31zavfnwwlwv',
              accepted: ['wǒ míngtiān yǒu kòng', '我明天有空', 'wǒ yǒu kòng', '我有空'],
            },
          ),
          write(
            'La semana que viene tengo tiempo.',
            'xià ge xīngqī wǒ yǒu shíjiān',
            '下个星期我有时间',
            ['zh-xia-ge-xingqi', 'zh-shijian'],
            {
              id: 'zh.ex.bsqx8q2lfq27aj',
              accepted: [
                'xià ge xīngqī wǒ yǒu kòng',
                '下个星期我有空',
                'wǒ xià ge xīngqī yǒu shíjiān',
                '我下个星期有时间',
                'wǒ xià ge xīngqī yǒu kòng',
                '我下个星期有空',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '你打算做什么？',
        objective: 'Contar planes y hablar de reuniones.',
        intro: {
          explanation:
            '打算 + verbo es «tener pensado, planear»: 我打算去北京. 聚会 es una reunión o juntada, y 参加 es ir a algo organizado o participar: 参加聚会.',
          examples: [
            { target: '周末你打算做什么？', base: '¿Qué tienes pensado hacer el fin de semana?' },
            { target: '我想参加你的聚会。', base: 'Quiero ir a tu reunión.' },
          ],
        },
        takeaways: ['Cuentas planes con 打算.', 'Dices que vas a una reunión con 参加.'],
        exercises: [
          ex.translationChoice(
            '聚会',
            'reunión (juntada)',
            ['clase', 'viaje', 'trabajo'],
            ['zh-juhui'],
            { id: 'zh.ex.rdsu0jzebuttb0' },
          ),
          ex.translationChoice(
            '参加',
            'participar (ir a)',
            ['reservar', 'esperar', 'volver'],
            ['zh-canjia'],
            { id: 'zh.ex.fic20ic4r55slt' },
          ),
          ex.listenChoice(
            '周末你打算做什么？',
            ['周末你想做什么？', '明天你打算做什么？', '周末你做什么了？'],
            ['zh-dasuan'],
            {
              id: 'zh.ex.3al8c1fz3ignvc',
            },
          ),
          ex.fillBlank(
            '我___明年去中国学习。',
            'Tengo pensado ir a estudiar a China el año que viene.',
            '打算',
            ['参加', '聚会', '有空'],
            ['zh-dasuan'],
            {
              id: 'zh.ex.ruckh0v0a33fi9',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '你想___我们的聚会吗？',
            '¿Quieres venir a nuestra reunión?',
            '参加',
            ['打算', '有空', '时间'],
            ['zh-canjia', 'zh-juhui'],
            {
              id: 'zh.ex.w5wyssllo4xnrh',
              skill: 'vocabulary',
            },
          ),
          tone('聚会', 'jùhuì', ['jūhuì', 'jùhuí', 'jǔhuǐ'], ['zh-juhui'], {
            id: 'zh.ex.7cjrpa9ucunh8x',
          }),
          ex.orderWords(
            '我 打算 星期六 去 爬山。',
            'Tengo pensado ir a la montaña el sábado.',
            ['zh-dasuan', 'zh-pashan'],
            {
              id: 'zh.ex.lnz3kumubv11sb',
            },
          ),
          reply(
            '周末你打算做什么？',
            '¿Qué tienes pensado hacer el fin de semana? (Responde que vas a ir a una reunión.)',
            'wǒ dǎsuan qù cānjiā jùhuì',
            '我打算去参加聚会',
            ['zh-dasuan', 'zh-canjia', 'zh-juhui'],
            {
              id: 'zh.ex.s8i3djh78ogezu',
              accepted: [
                'wǒ dǎsuan cānjiā jùhuì',
                '我打算参加聚会',
                'qù cānjiā jùhuì',
                '去参加聚会',
                'cānjiā jùhuì',
                '参加聚会',
              ],
            },
          ),
          write('Tengo pensado descansar.', 'wǒ dǎsuan xiūxi', '我打算休息', ['zh-dasuan'], {
            id: 'zh.ex.rwk4jljpb9jcay',
            accepted: ['wǒ dǎsuan zài jiā xiūxi', '我打算在家休息'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '还是、当然、可惜',
        objective: 'Elegir entre opciones, aceptar y rechazar.',
        intro: {
          explanation:
            '还是 es «o» en una pregunta con dos opciones: 你喝茶还是喝咖啡？ Para aceptar: 当然！ (¡claro!). Para rechazar con amabilidad: 可惜我有事 (qué lástima, tengo algo que hacer).',
          examples: [
            { target: '你喝茶还是喝咖啡？', base: '¿Tomas té o café?' },
            { target: '可惜我星期六有事。', base: 'Qué lástima, el sábado tengo algo que hacer.' },
          ],
        },
        takeaways: ['Ofreces opciones con 还是.', 'Aceptas con 当然 y rechazas con 可惜.'],
        exercises: [
          ex.translationChoice('还是', 'o (en preguntas)', ['y', 'con', 'también'], ['zh-haishi'], {
            id: 'zh.ex.m0a9fiihy4q2mw',
          }),
          ex.translationChoice(
            '可惜',
            'qué lástima',
            ['claro', '¡buenísimo!', 'de nada'],
            ['zh-kexi'],
            { id: 'zh.ex.iblbjvznflwojy' },
          ),
          ex.listenChoice(
            '你喝茶还是喝咖啡？',
            ['你喝茶还是喝水？', '你喝茶吗？', '你喝咖啡还是喝茶？'],
            ['zh-haishi'],
            {
              id: 'zh.ex.k7k309ryolakln',
            },
          ),
          ex.fillBlank(
            '你今天去___明天去？',
            '¿Vas hoy o mañana?',
            '还是',
            ['和', '跟', '也'],
            ['zh-haishi'],
            {
              id: 'zh.ex.57jy3c5to7p4hk',
              explanation: 'En una pregunta con dos opciones, «o» es 还是; 和 une cosas («y»).',
            },
          ),
          ex.fillBlank(
            'A：你想来吗？ B：___想！',
            'A: ¿Quieres venir? B: ¡Claro que sí!',
            '当然',
            ['可惜', '还是', '打算'],
            ['zh-dangran'],
            {
              id: 'zh.ex.48oo22q1o71yot',
              skill: 'vocabulary',
            },
          ),
          tone('可惜', 'kěxī', ['kēxī', 'kéxí', 'kèxì'], ['zh-kexi'], {
            id: 'zh.ex.s17j7hk7t80qvj',
          }),
          ex.matchPairs(
            [
              ['还是', 'o (en preguntas)'],
              ['当然', 'claro'],
              ['可惜', 'qué lástima'],
              ['打算', 'pensar hacer (planear)'],
            ],
            ['zh-haishi', 'zh-dangran', 'zh-kexi', 'zh-dasuan'],
            { id: 'zh.ex.bfg8x1pj1a795w' },
          ),
          reply(
            '你喝茶还是喝咖啡？',
            '¿Tomas té o café? (Responde que té.)',
            'wǒ hē chá',
            '我喝茶',
            ['zh-haishi'],
            {
              id: 'zh.ex.b1o1q02bk4y6wr',
              accepted: ['hē chá', '喝茶', 'chá', '茶', 'chá ba', '茶吧'],
            },
          ),
          write(
            'Qué lástima, el sábado tengo algo que hacer.',
            'kěxī xīngqīliù wǒ yǒu shì',
            '可惜星期六我有事',
            ['zh-kexi', 'zh-youshi'],
            {
              id: 'zh.ex.0bgowuplas7q2a',
              accepted: ['kěxī wǒ xīngqīliù yǒu shì', '可惜我星期六有事'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '进来、出去',
        objective: 'Recibir visitas e indicar movimientos.',
        intro: {
          explanation:
            'Después de un verbo de movimiento, 来 indica hacia quien habla y 去, hacia afuera o lejos: 进来 (pasa, entra aquí), 出去 (salir), 回来 (volver aquí), 上来 (sube). Al recibir a alguien: 欢迎！请进来！',
          examples: [
            { target: '欢迎，欢迎！请进来！', base: '¡Bienvenido! ¡Pasa!' },
            { target: '我们出去吃饭吧。', base: 'Salgamos a comer.' },
          ],
        },
        takeaways: ['Recibes con 欢迎 y 请进来.', 'Usas 来 y 去 según la dirección.'],
        exercises: [
          ex.translationChoice(
            '欢迎',
            'bienvenido',
            ['adiós', 'perdón', 'gracias'],
            ['zh-huanying'],
            { id: 'zh.ex.0twda6861evbyk' },
          ),
          ex.translationChoice(
            '出去',
            'salir',
            ['pasar (entrar)', 'volver (aquí)', 'subir (aquí)'],
            ['zh-chuqu'],
            { id: 'zh.ex.hjghs6plmgc9i3' },
          ),
          ex.listenChoice('请进来！', ['请出去！', '请上来！', '请回来！'], ['zh-jinlai'], {
            id: 'zh.ex.0gnge4cw0icd1h',
          }),
          ex.fillBlank(
            '我在三楼，你___吧！',
            'Estoy en el tercer piso, ¡sube!',
            '上来',
            ['出去', '进来', '回来'],
            ['zh-shanglai'],
            {
              id: 'zh.ex.yrnoupltcd05ye',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '妈妈，你几点___？',
            'Mamá, ¿a qué hora vuelves?',
            '回来',
            ['出去', '上来', '进来'],
            ['zh-huilai'],
            {
              id: 'zh.ex.6xxkt5tdq3bsjr',
              skill: 'vocabulary',
            },
          ),
          tone('欢迎', 'huānyíng', ['huányíng', 'huānyīng', 'huànyìng'], ['zh-huanying'], {
            id: 'zh.ex.kdw5qrye3d6pdw',
          }),
          question(
            'zh.ex.l3rmylg2hltqj8',
            VISITA,
            '¿Qué le ofrece Anna a Wang Ming?',
            'Té o café',
            ['Té o agua', 'Café o leche', 'Algo de comer'],
            ['zh-haishi'],
            'Anna pregunta: «你喝茶还是喝咖啡？».',
          ),
          question(
            'zh.ex.ei8l0od0ivrytv',
            VISITA,
            '¿Qué elige Wang Ming?',
            'Té',
            ['Café', 'Agua', 'Nada'],
            ['zh-haishi'],
            'Wang Ming dice: «茶吧，谢谢».',
          ),
          reply(
            '我们出去吃饭吧？',
            '¿Salimos a comer? (Responde que bueno, que salgan.)',
            'hǎo, wǒmen chūqù chīfàn ba',
            '好，我们出去吃饭吧',
            ['zh-chuqu'],
            { id: 'zh.ex.9jiyfikjksxlfe', accepted: ['hǎo', '好', 'hǎo, chūqù ba', '好，出去吧'] },
          ),
          write(
            '¡Bienvenido! ¡Pasa!',
            'huānyíng, qǐng jìnlái',
            '欢迎，请进来',
            ['zh-huanying', 'zh-jinlai'],
            {
              id: 'zh.ex.k9xg4d2pchq6b9',
              accepted: [
                'huānyíng huānyíng, qǐng jìnlái',
                '欢迎欢迎，请进来',
                'huānyíng, jìnlái ba',
                '欢迎，进来吧',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '下次吧',
        objective: 'Entender invitaciones y respuestas.',
        intro: {
          explanation:
            '下次 es «la próxima vez»: 下次我们一起去吧. Para invitar: 你想不想来…？; para aceptar: 当然！; para rechazar sin cortar el plan: 可惜我有事，下次吧.',
          examples: [
            { target: '下次我们一起去吧！', base: '¡La próxima vez vamos juntos!' },
            {
              target: '可惜我有事，下次吧。',
              base: 'Qué lástima, tengo algo que hacer; la próxima.',
            },
          ],
        },
        takeaways: ['Propones otra vez con 下次.', 'Entiendes si alguien acepta o rechaza.'],
        exercises: [
          ex.translationChoice(
            '下次',
            'la próxima vez',
            ['la semana que viene', 'hace un rato', 'enseguida'],
            ['zh-xiaci'],
            {
              id: 'zh.ex.xuw2wgrzihbjci',
            },
          ),
          ex.listenChoice(
            '可惜我有事，下次吧。',
            ['可惜我很忙，下次吧。', '我有事，明天吧。', '当然，下次吧。'],
            ['zh-xiaci', 'zh-kexi'],
            {
              id: 'zh.ex.999ggg8l3j3hpb',
            },
          ),
          question(
            'zh.ex.2nzeu0iye1396l',
            INVITACION,
            '¿Para qué llama Anna a Wang Ming?',
            'Para invitarlo a una reunión en su casa',
            [
              'Para pedirle ayuda',
              'Para ir juntos a la montaña',
              'Para invitarlo a un restaurante',
            ],
            ['zh-juhui', 'zh-youkong'],
            'Anna dice: «我家有个聚会，你想不想来？».',
          ),
          question(
            'zh.ex.wpr86fxmtxf5ls',
            INVITACION,
            '¿A qué hora es la reunión?',
            'A las siete de la noche',
            ['A las siete de la mañana', 'A las seis de la tarde', 'A las ocho de la noche'],
            ['zh-juhui'],
            'Anna dice: «晚上七点».',
          ),
          question(
            'zh.ex.l19cccw6i08q2x',
            INVITACION,
            '¿Qué responde Wang Ming a la invitación?',
            'Que claro que quiere ir',
            ['Que no puede', 'Que tal vez', 'Que la próxima vez'],
            ['zh-dangran'],
            'Wang Ming dice: «当然想！».',
          ),
          question(
            'zh.ex.a4qd1idupdzqsj',
            RECHAZO,
            '¿Va Li Hua a la reunión?',
            'No, porque el sábado tiene algo que hacer',
            ['Sí, llega a las siete', 'No, porque está enfermo', 'Sí, con un amigo'],
            ['zh-kexi', 'zh-canjia'],
            'Li Hua escribe: «可惜星期六我有事，不能去».',
          ),
          question(
            'zh.ex.x6m5uq0py4z05e',
            RECHAZO,
            '¿Qué propone Li Hua?',
            'Salir juntos otra vez',
            ['Ir a la próxima reunión de Anna', 'Llamarla mañana', 'Comer juntos el sábado'],
            ['zh-xiaci', 'zh-chuqu'],
            'Li Hua escribe: «下次我们一起出去玩吧！».',
          ),
          reply(
            '星期六你来不来我家？',
            '¿Vienes el sábado a mi casa? (Rechaza con amabilidad: qué lástima, tienes algo que hacer, la próxima.)',
            'kěxī wǒ yǒu shì, xià cì ba',
            '可惜我有事，下次吧',
            ['zh-kexi', 'zh-xiaci'],
            {
              id: 'zh.ex.dua08zp8xnlkko',
              accepted: [
                'kěxī wǒ yǒu shì',
                '可惜我有事',
                'kěxī, wǒ xīngqīliù yǒu shì',
                '可惜，我星期六有事',
              ],
            },
          ),
          write(
            'La próxima vez vamos juntos.',
            'xià cì wǒmen yìqǐ qù',
            '下次我们一起去',
            ['zh-xiaci', 'zh-yiqi'],
            {
              id: 'zh.ex.szzxibja703gx0',
              accepted: ['xià cì wǒmen yìqǐ qù ba', '下次我们一起去吧'],
            },
          ),
        ],
      },
    ],
  },
};

import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U5 «Salud y bienestar» (docs/ZH_A1_A2.md): partes del cuerpo + 疼, 感冒了 / 生病了 (了 de
 * cambio), 不舒服, ir al médico y tomar remedios (吃药), consejos con 应该 y 多 + verbo y
 * prohibiciones con 别.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MEDICO = dialogue('zh.stim.a2-u5-yisheng', 'Li Hua va al médico.', [
  ['医生', '你哪儿不舒服？'],
  ['李华', '我头疼，嗓子也疼。'],
  ['医生', '发烧吗？'],
  ['李华', '有点儿发烧。'],
  ['医生', '你感冒了。你应该多喝水，多休息。今天和明天别工作了。'],
]);

const NOTA = reading(
  'zh.stim.a2-u5-qingjia',
  'message',
  'Anna le escribe a su profesor.',
  ['陈老师，您好！', '我生病了，发烧，今天不能来学校。', '对不起！'],
  { from: '安娜', to: '陈老师' },
);

const CONSEJOS = reading(
  'zh.stim.a2-u5-jiankang',
  'post',
  'Una publicación con consejos de salud.',
  ['你想身体健康吗？', '每天运动半个小时。', '多喝水，早睡觉。', '别每天玩游戏！'],
  { title: '健康' },
);

export const ZH_A2_U05: ZhUnitDef = {
  names: ['李华', '安娜', '陈'],
  support: [],
  unit: {
    position: 5,
    title: 'Salud y bienestar',
    titleEn: '身体 Health',
    description: 'Decir qué te duele, contar que te enfermaste, ir al médico y dar consejos.',
    emoji: '🩺',
    objective:
      'Podés decir qué te duele y cómo te sentís, avisar que estás enfermo, entender al médico y dar consejos con 应该 y 别.',
    grammar: {
      title: 'Parte del cuerpo + 疼 · 应该 · 别 · 多 + verbo',
      explanation:
        'Lo que duele va antes de 疼: 我头疼. 感冒了 / 生病了 cuentan un cambio (me resfrié, me enfermé). 应该 + verbo es un consejo (deberías); 别 + verbo pide que no se haga algo; 多 + verbo es «hacé más…»: 多喝水.',
      examples: [
        { target: '我头疼，嗓子也疼。', base: 'Me duele la cabeza y también la garganta.' },
        { target: '你应该多休息。', base: 'Deberías descansar más.' },
        { target: '别吃辣的！', base: '¡No comas picante!' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U5). Sin revisión nativa: revisar 吃药, 看病 (paciente y médico) y el mensaje al profesor.',
    },
    words: [
      w('zh-tou', '头', 'tóu', 'cabeza', '我头疼。', 'Me duele la cabeza.', ['body']),
      w(
        'zh-duzi',
        '肚子',
        'dùzi',
        'panza',
        '我肚子有点儿疼。',
        'Me duele un poco la panza.',
        ['body'],
        {
          acceptedTranslations: ['estómago', 'barriga'],
        },
      ),
      w('zh-sangzi', '嗓子', 'sǎngzi', 'garganta', '我嗓子疼。', 'Me duele la garganta.', ['body']),
      w('zh-teng', '疼', 'téng', 'doler', '我头疼。', 'Me duele la cabeza.', ['health'], {
        acceptedTranslations: ['dolor', 'duele'],
      }),
      w('zh-ganmao', '感冒', 'gǎnmào', 'resfriado', '我感冒了。', 'Me resfrié.', ['health'], {
        acceptedTranslations: ['resfrío', 'resfriarse', 'gripe'],
      }),
      w(
        'zh-fashao',
        '发烧',
        'fāshāo',
        'tener fiebre',
        '我有点儿发烧。',
        'Tengo un poco de fiebre.',
        ['health'],
        {
          acceptedTranslations: ['fiebre'],
          emoji: '🤒',
        },
      ),
      w(
        'zh-shengbing',
        '生病',
        'shēngbìng',
        'enfermarse',
        '我生病了。',
        'Me enfermé.',
        ['health'],
        {
          acceptedTranslations: ['estar enfermo', 'enfermo'],
        },
      ),
      w(
        'zh-shufu',
        '舒服',
        'shūfu',
        'cómodo (sentirse bien)',
        '我今天不舒服。',
        'Hoy me siento mal.',
        ['health'],
        {
          acceptedTranslations: ['cómodo', 'a gusto'],
        },
      ),
      w(
        'zh-yao-remedio',
        '药',
        'yào',
        'remedio',
        '你吃药了吗？',
        '¿Tomaste el remedio?',
        ['health'],
        {
          acceptedTranslations: ['medicamento', 'medicina'],
          emoji: '💊',
        },
      ),
      w(
        'zh-kanbing',
        '看病',
        'kànbìng',
        'ir al médico',
        '我去医院看病。',
        'Voy al hospital a que me vea un médico.',
        ['health'],
        {
          acceptedTranslations: ['ver al médico', 'consultar al médico'],
        },
      ),
      w(
        'zh-shenti',
        '身体',
        'shēntǐ',
        'cuerpo (la salud)',
        '你身体好吗？',
        '¿Cómo andás de salud?',
        ['body', 'health'],
        {
          acceptedTranslations: ['cuerpo', 'salud'],
        },
      ),
      w(
        'zh-yinggai',
        '应该',
        'yīnggāi',
        'deber (consejo)',
        '你应该多休息。',
        'Deberías descansar más.',
        ['grammar'],
        {
          acceptedTranslations: ['deberías', 'tener que'],
        },
      ),
      w(
        'zh-bie',
        '别',
        'bié',
        'no (prohibición)',
        '别吃辣的！',
        '¡No comas picante!',
        ['grammar'],
        {
          acceptedTranslations: ['no hagas'],
        },
      ),
      w(
        'zh-yundong',
        '运动',
        'yùndòng',
        'hacer ejercicio',
        '我每天运动。',
        'Hago ejercicio todos los días.',
        ['health', 'free-time'],
        {
          acceptedTranslations: ['deporte', 'ejercicio'],
        },
      ),
      w(
        'zh-jiankang',
        '健康',
        'jiànkāng',
        'sano (la salud)',
        '他身体很健康。',
        'Él es muy sano.',
        ['health'],
        {
          acceptedTranslations: ['sano', 'saludable'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '我头疼',
        objective: 'Decir qué te duele.',
        intro: {
          explanation:
            'Para decir que algo duele: parte del cuerpo + 疼: 我头疼 («yo, la cabeza duele»). Con 有点儿 es «me duele un poco»: 我肚子有点儿疼.',
          examples: [
            { target: '我头疼。', base: 'Me duele la cabeza.' },
            { target: '我肚子有点儿疼。', base: 'Me duele un poco la panza.' },
          ],
        },
        takeaways: ['Nombrás la cabeza, la panza y la garganta.', 'Decís qué te duele con 疼.'],
        exercises: [
          ex.translationChoice('头', 'cabeza', ['panza', 'garganta', 'ojos'], ['zh-tou'], {
            id: 'zh.ex.xpsuf80el869sl',
          }),
          ex.translationChoice(
            '疼',
            'doler',
            ['enfermarse', 'tener fiebre', 'descansar'],
            ['zh-teng'],
            { id: 'zh.ex.00j7lxjr8fclcw' },
          ),
          ex.listenChoice(
            '我头疼。',
            ['我肚子疼。', '我嗓子疼。', '我不疼。'],
            ['zh-tou', 'zh-teng'],
            { id: 'zh.ex.c1w7vitjw1mlcz' },
          ),
          ex.fillBlank(
            '我嗓子有点儿___。',
            'Me duele un poco la garganta.',
            '疼',
            ['高', '冷', '忙'],
            ['zh-sangzi', 'zh-teng'],
            {
              id: 'zh.ex.lj49thviqfujpz',
              skill: 'vocabulary',
            },
          ),
          tone('肚子', 'dùzi', ['dūzi', 'dúzi', 'dǔzi'], ['zh-duzi'], {
            id: 'zh.ex.m1tfmy5dzt551h',
          }),
          ex.matchPairs(
            [
              ['头', 'cabeza'],
              ['肚子', 'panza'],
              ['嗓子', 'garganta'],
              ['疼', 'doler'],
            ],
            ['zh-tou', 'zh-duzi', 'zh-sangzi', 'zh-teng'],
            { id: 'zh.ex.4bq2e9v2sbpcni' },
          ),
          ex.orderWords(
            '我 肚子 有点儿 疼。',
            'Me duele un poco la panza.',
            ['zh-duzi', 'zh-teng'],
            { id: 'zh.ex.u25x7d5g4a43ba' },
          ),
          reply(
            '你哪儿疼？',
            '¿Qué te duele? (Respondé que la cabeza.)',
            'wǒ tóu téng',
            '我头疼',
            ['zh-tou', 'zh-teng'],
            {
              id: 'zh.ex.ouv45rutzj573z',
              accepted: ['tóu téng', '头疼', 'tóu', '头'],
            },
          ),
          write('Me duele la garganta.', 'wǒ sǎngzi téng', '我嗓子疼', ['zh-sangzi', 'zh-teng'], {
            id: 'zh.ex.7an5mp50qn1t9x',
            accepted: ['sǎngzi téng', '嗓子疼', 'wǒ de sǎngzi téng', '我的嗓子疼'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '我感冒了',
        objective: 'Contar que te enfermaste y cómo te sentís.',
        intro: {
          explanation:
            '感冒 es el resfrío y 发烧, tener fiebre. Con 了 se cuenta el cambio: 我感冒了 (me resfrié), 我生病了 (me enfermé). 不舒服 es «sentirse mal».',
          examples: [
            { target: '我感冒了。', base: 'Me resfrié.' },
            { target: '我今天不舒服。', base: 'Hoy me siento mal.' },
          ],
        },
        takeaways: ['Contás que te enfermaste con 了.', 'Decís que te sentís mal con 不舒服.'],
        exercises: [
          ex.translationChoice(
            '感冒',
            'resfriado',
            ['tener fiebre', 'dolor de cabeza', 'remedio'],
            ['zh-ganmao'],
            {
              id: 'zh.ex.gbp1j8wdufr6bk',
            },
          ),
          ex.translationChoice(
            '舒服',
            'cómodo (sentirse bien)',
            ['enfermo', 'cansado', 'ocupado'],
            ['zh-shufu'],
            {
              id: 'zh.ex.y59toek8sksn4m',
            },
          ),
          ex.listenChoice(
            '我感冒了，有点儿发烧。',
            ['我感冒了，不发烧。', '我生病了，有点儿发烧。', '我感冒了，有点儿头疼。'],
            ['zh-ganmao', 'zh-fashao'],
            { id: 'zh.ex.n0lvoe2ejbhkaa' },
          ),
          ex.fillBlank(
            '我今天不___，不想吃饭。',
            'Hoy me siento mal: no tengo ganas de comer.',
            '舒服',
            ['发烧', '感冒', '生病'],
            ['zh-shufu'],
            {
              id: 'zh.ex.kxl2xvezq8ol30',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '她生病___，今天不能来。',
            'Se enfermó y hoy no puede venir.',
            '了',
            ['吗', '吧', '过'],
            ['zh-shengbing', 'zh-le'],
            {
              id: 'zh.ex.6fxwucgmu0i294',
              explanation: '了 cuenta el cambio: antes estaba bien y ahora está enferma.',
            },
          ),
          tone('发烧', 'fāshāo', ['fáshāo', 'fāsháo', 'fàshào'], ['zh-fashao'], {
            id: 'zh.ex.8bjt3jrqz6z0nk',
          }),
          ex.matchPairs(
            [
              ['感冒', 'resfriado'],
              ['发烧', 'tener fiebre'],
              ['生病', 'enfermarse'],
              ['舒服', 'cómodo (sentirse bien)'],
            ],
            ['zh-ganmao', 'zh-fashao', 'zh-shengbing', 'zh-shufu'],
            { id: 'zh.ex.az0i74y4myh5xn' },
          ),
          reply(
            '你今天怎么不来学校？',
            '¿Cómo es que hoy no venís a la escuela? (Respondé que te resfriaste.)',
            'wǒ gǎnmào le',
            '我感冒了',
            ['zh-ganmao'],
            {
              id: 'zh.ex.c93r0w7k0w2uyf',
              accepted: ['gǎnmào le', '感冒了', 'wǒ shēngbìng le', '我生病了'],
            },
          ),
          write('Me siento mal.', 'wǒ bù shūfu', '我不舒服', ['zh-shufu'], {
            id: 'zh.ex.rkqnplc09h0gaa',
            accepted: ['wǒ hěn bù shūfu', '我很不舒服'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '看病和吃药',
        objective: 'Ir al médico y hablar de remedios.',
        intro: {
          explanation:
            '看病 es ir al médico (y, si lo dice el médico, atender). 药 es el remedio; «tomar un remedio» se dice 吃药 («comer remedio»). 身体 es el cuerpo y, en general, la salud: 你身体好吗？',
          examples: [
            { target: '我去医院看病。', base: 'Voy al hospital a que me vea un médico.' },
            { target: '你吃药了吗？', base: '¿Tomaste el remedio?' },
          ],
        },
        takeaways: ['Decís que vas al médico con 看病.', 'Decís «tomar un remedio» con 吃药.'],
        exercises: [
          ex.translationChoice('药', 'remedio', ['comida', 'agua', 'té'], ['zh-yao-remedio'], {
            id: 'zh.ex.nxixbikipgdcj2',
          }),
          ex.translationChoice(
            '看病',
            'ir al médico',
            ['ir de compras', 'visitar a un amigo', 'estudiar'],
            ['zh-kanbing'],
            {
              id: 'zh.ex.pylhgaq4n7bz8i',
            },
          ),
          ex.listenChoice(
            '你吃药了吗？',
            ['你吃饭了吗？', '你喝水了吗？', '你看病了吗？'],
            ['zh-yao-remedio'],
            { id: 'zh.ex.xd9wbfjoyxzenl' },
          ),
          ex.fillBlank(
            '我每天___两次药。',
            'Tomo el remedio dos veces por día.',
            '吃',
            ['做', '看', '写'],
            ['zh-yao-remedio', 'zh-ci'],
            {
              id: 'zh.ex.w4td7h63adfxgd',
              explanation: 'Los remedios «se comen»: 吃药.',
            },
          ),
          ex.fillBlank(
            '你___好吗？',
            '¿Cómo andás de salud?',
            '身体',
            ['肚子', '药', '嗓子'],
            ['zh-shenti'],
            {
              id: 'zh.ex.7ldl392vvnj405',
              skill: 'vocabulary',
            },
          ),
          tone('药', 'yào', ['yāo', 'yáo', 'yǎo'], ['zh-yao-remedio'], {
            id: 'zh.ex.1am4w0tla3gowa',
          }),
          ex.orderWords('我 去 医院 看病。', 'Voy al hospital a ver al médico.', ['zh-kanbing'], {
            id: 'zh.ex.yrzereptckdfeo',
          }),
          reply(
            '你身体怎么样？',
            '¿Cómo andás de salud? (Respondé que muy bien.)',
            'hěn hǎo',
            '很好',
            ['zh-shenti'],
            {
              id: 'zh.ex.jb0po0ahs2pm6z',
              accepted: [
                'wǒ shēntǐ hěn hǎo',
                '我身体很好',
                'shēntǐ hěn hǎo',
                '身体很好',
                'fēicháng hǎo',
                '非常好',
              ],
            },
          ),
          write('Tomé el remedio.', 'wǒ chī yào le', '我吃药了', ['zh-yao-remedio'], {
            id: 'zh.ex.ow4iwph2vwxjit',
            accepted: ['wǒ chī le yào', '我吃了药', 'chī yào le', '吃药了'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '应该 y 别',
        objective: 'Dar consejos y pedir que no hagan algo.',
        intro: {
          explanation:
            '应该 + verbo es un consejo, «deberías»: 你应该多休息. 别 + verbo pide que alguien no haga algo: 别去！ 多 + verbo es «hacé más…»: 多喝水 (tomá mucha agua).',
          examples: [
            { target: '你应该多喝水。', base: 'Deberías tomar mucha agua.' },
            { target: '别吃辣的！', base: '¡No comas picante!' },
          ],
        },
        takeaways: ['Aconsejás con 应该 y 多 + verbo.', 'Pedís que no hagan algo con 别.'],
        exercises: [
          ex.translationChoice(
            '应该',
            'deber (consejo)',
            ['poder (tener permiso)', 'tener ganas de', 'saber (hacer algo)'],
            ['zh-yinggai'],
            {
              id: 'zh.ex.4nl5j95ynwovwy',
            },
          ),
          ex.translationChoice(
            '别',
            'no (prohibición)',
            ['no (en pasado)', 'todavía no', 'también'],
            ['zh-bie'],
            { id: 'zh.ex.xlyjdqkpln1ges' },
          ),
          ex.listenChoice(
            '你应该多休息。',
            ['你应该多喝水。', '你应该早睡觉。', '我应该多休息。'],
            ['zh-yinggai'],
            { id: 'zh.ex.raxjeca8tawj6w' },
          ),
          ex.fillBlank(
            '你发烧了，___去学校了。',
            'Tenés fiebre: no vayas a la escuela.',
            '别',
            ['没', '不是', '还没'],
            ['zh-bie'],
            {
              id: 'zh.ex.yo3zxrz86o0pe3',
              explanation: '别 + verbo pide que alguien no haga algo.',
            },
          ),
          ex.fillBlank(
            '你感冒了，___多喝水。',
            'Estás resfriado: deberías tomar mucha agua.',
            '应该',
            ['别', '没', '已经'],
            ['zh-yinggai'],
            {
              id: 'zh.ex.3d2x7tf3vtlcht',
            },
          ),
          tone('应该', 'yīnggāi', ['yínggāi', 'yǐnggài', 'yìnggāi'], ['zh-yinggai'], {
            id: 'zh.ex.xi47941yjuia9q',
          }),
          question(
            'zh.ex.p8akoxk0bhkecc',
            MEDICO,
            '¿Qué le duele a Li Hua?',
            'La cabeza y la garganta',
            ['La panza', 'La cabeza y la panza', 'Sólo la garganta'],
            ['zh-tou', 'zh-sangzi'],
            'Li Hua dice: «我头疼，嗓子也疼».',
          ),
          question(
            'zh.ex.xtag785429r6d9',
            MEDICO,
            '¿Qué le aconseja el médico?',
            'Tomar mucha agua, descansar y no trabajar dos días',
            ['Tomar un remedio y trabajar', 'Hacer ejercicio', 'Comer mucho'],
            ['zh-yinggai', 'zh-bie'],
            'El médico dice: «你应该多喝水，多休息。今天和明天别工作了».',
          ),
          reply(
            '我感冒了。',
            'Estoy resfriado. (Aconsejale que descanse más.)',
            'nǐ yīnggāi duō xiūxi',
            '你应该多休息',
            ['zh-yinggai'],
            {
              id: 'zh.ex.holpfn7e3sgr5q',
              accepted: [
                'yīnggāi duō xiūxi',
                '应该多休息',
                'nǐ yīnggāi xiūxi',
                '你应该休息',
                'duō xiūxi',
                '多休息',
                'nǐ duō xiūxi ba',
                '你多休息吧',
              ],
            },
          ),
          write('¡No comas picante!', 'bié chī là de', '别吃辣的', ['zh-bie'], {
            id: 'zh.ex.3wv81n1omioyrk',
            accepted: ['nǐ bié chī là de', '你别吃辣的'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '健康',
        objective: 'Hablar de hábitos sanos y entender avisos y consejos.',
        intro: {
          explanation:
            '运动 es hacer ejercicio o deporte, y 健康, sano o la salud: 他身体很健康. Hábitos sanos: 每天运动, 多喝水, 早睡觉.',
          examples: [
            { target: '我每天运动半个小时。', base: 'Hago ejercicio media hora por día.' },
            { target: '他身体很健康。', base: 'Él es muy sano.' },
          ],
        },
        takeaways: ['Hablás de hábitos sanos.', 'Entendés un aviso de enfermedad y consejos.'],
        exercises: [
          ex.translationChoice(
            '运动',
            'hacer ejercicio',
            ['descansar', 'dormir', 'enfermarse'],
            ['zh-yundong'],
            { id: 'zh.ex.3uksy7ayqvl7rz' },
          ),
          ex.listenChoice(
            '他身体很健康。',
            ['他身体不太好。', '他头很疼。', '他身体很不舒服。'],
            ['zh-jiankang', 'zh-shenti'],
            {
              id: 'zh.ex.3sgxd3zv5szixu',
            },
          ),
          ex.fillBlank(
            '我每天___半个小时。',
            'Hago ejercicio media hora por día.',
            '运动',
            ['健康', '生病', '感冒'],
            ['zh-yundong'],
            {
              id: 'zh.ex.p4ch2jipkkn6g4',
              skill: 'vocabulary',
            },
          ),
          question(
            'zh.ex.c5nj6uvm9z2vll',
            NOTA,
            '¿Por qué Anna no va a la escuela?',
            'Se enfermó y tiene fiebre',
            ['Le duele la panza', 'Tiene que trabajar', 'Se quedó dormida'],
            ['zh-shengbing', 'zh-fashao'],
            'Anna escribe: «我生病了，发烧，今天不能来学校».',
          ),
          question(
            'zh.ex.rixx3dvqy8p80w',
            NOTA,
            '¿A quién le escribe Anna?',
            'Al profesor Chen',
            ['A su mamá', 'A Li Hua', 'Al médico'],
            ['zh-shengbing'],
            'El mensaje empieza: «陈老师，您好！».',
          ),
          question(
            'zh.ex.627y2wcx9b6ekq',
            CONSEJOS,
            '¿Cuánto ejercicio recomienda la publicación?',
            'Media hora por día',
            ['Una hora por día', 'Media hora por semana', 'Dos horas por día'],
            ['zh-yundong'],
            'La publicación dice: «每天运动半个小时».',
          ),
          question(
            'zh.ex.0mtu6sicfoqhd5',
            CONSEJOS,
            '¿Qué pide la publicación que NO hagas?',
            'Jugar videojuegos todos los días',
            ['Tomar agua', 'Dormir temprano', 'Hacer ejercicio'],
            ['zh-bie', 'zh-jiankang'],
            'La publicación dice: «别每天玩游戏！».',
          ),
          reply(
            '你每天运动吗？',
            '¿Hacés ejercicio todos los días? (Respondé que sí, media hora.)',
            'wǒ měitiān yùndòng bàn ge xiǎoshí',
            '我每天运动半个小时',
            ['zh-yundong'],
            {
              id: 'zh.ex.bzvwo55un2ov3b',
              accepted: [
                'bàn ge xiǎoshí',
                '半个小时',
                'yùndòng',
                '运动',
                'měitiān yùndòng bàn ge xiǎoshí',
                '每天运动半个小时',
              ],
            },
          ),
          write(
            'Mi mamá es muy sana.',
            'wǒ māma shēntǐ hěn jiànkāng',
            '我妈妈身体很健康',
            ['zh-jiankang', 'zh-shenti'],
            {
              id: 'zh.ex.wyslcsmfrq2dhq',
              accepted: ['wǒ māma hěn jiànkāng', '我妈妈很健康'],
            },
          ),
        ],
      },
    ],
  },
};

import type { ZhUnitDef } from '../../zh-course';
import { dialogue, ex, question, reading, reply, tone, w, write } from '../helpers';

/**
 * Chino A2 U12 «Opiniones, problemas y soluciones» (docs/ZH_A1_A2.md): opinar con 觉得, 但是 y
 * 同意, problemas (怎么了？, 丢了, 坏了, 忘了), la pasiva con 被, buscar soluciones (怎么办？, 办法,
 * 修, 可能) y condiciones con 如果…就….
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PROBLEMA = dialogue('zh.stim.a2-u12-shouji', 'A Anna le pasó algo en un café.', [
  ['张丽', '安娜，你怎么了？'],
  ['安娜', '我的手机被偷了！怎么办？'],
  ['张丽', '别担心。我们先去问问服务员吧。'],
  ['安娜', '好。如果没有手机，我就不能工作了。'],
]);

const OPINION = reading(
  'zh.stim.a2-u12-wangshang',
  'post',
  'Li Hua opina sobre las compras por internet.',
  [
    '我觉得在网上买东西很方便。',
    '但是有的时候东西是坏的。',
    '如果东西坏了，就可以换。',
    '你们同意吗？',
  ],
  { from: '李华' },
);

const ARREGLO = dialogue(
  'zh.stim.a2-u12-diannao',
  'Wang Ming tiene un problema con la computadora.',
  [
    ['王明', '我的电脑坏了，不能开了。'],
    ['李华', '你觉得是什么问题？'],
    ['王明', '不知道。可能是充电的问题。'],
    ['李华', '我有个办法：我们去找我哥哥，他会修电脑。'],
  ],
);

export const ZH_A2_U12: ZhUnitDef = {
  names: ['张丽', '安娜', '李华'],
  support: ['问', '知道'],
  unit: {
    position: 12,
    title: 'Opiniones, problemas y soluciones',
    titleEn: '问题和办法 Problems and solutions',
    description:
      'Dar tu opinión, contar un problema (se rompió, lo perdí, me lo robaron) y buscar una solución.',
    emoji: '🛠️',
    objective:
      'Puedes dar tu opinión y decir si estás de acuerdo, contar qué te pasó (丢了, 坏了, 被偷了), proponer una solución y hablar de condiciones con 如果…就….',
    grammar: {
      title: '觉得 · 但是 · 被 · 如果…就…',
      explanation:
        '觉得 da una opinión (我觉得…) y 但是 es «pero». Con 被 algo sufre la acción, casi siempre algo malo: 我的手机被偷了. 如果…就… es «si…, (entonces)…»: 如果下雨，我就不去; 就 va antes del verbo. 怎么了？ es «¿qué pasó?» y 怎么办？, «¿qué hago?».',
      examples: [
        {
          target: '我觉得这个很好，但是有点儿贵。',
          base: 'Me parece muy bueno, pero es medio caro.',
        },
        { target: '我的手机被偷了！', base: '¡Me robaron el celular!' },
        { target: '如果下雨，我就不去。', base: 'Si llueve, no voy.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U12). Sin revisión nativa: revisar 被 con 了, 如果…就 y la naturalidad de los diálogos de problemas.',
    },
    words: [
      w(
        'zh-juede',
        '觉得',
        'juéde',
        'parecer (opinar)',
        '我觉得这个很好。',
        'Me parece que este está muy bien.',
        ['verbs', 'opinion'],
        {
          acceptedTranslations: ['opinar', 'creer', 'parecer'],
        },
      ),
      w(
        'zh-danshi',
        '但是',
        'dànshì',
        'pero',
        '我同意，但是很贵。',
        'Estoy de acuerdo, pero es caro.',
        ['grammar'],
        {
          acceptedTranslations: ['sin embargo'],
        },
      ),
      w('zh-tongyi', '同意', 'tóngyì', 'estar de acuerdo', '我同意。', 'Estoy de acuerdo.', [
        'opinion',
      ]),
      w(
        'zh-zenmele',
        '怎么了',
        'zěnme le',
        '¿qué pasó?',
        '你怎么了？',
        '¿Qué te pasa?',
        ['questions'],
        {
          acceptedTranslations: ['qué pasó', '¿qué te pasa?'],
        },
      ),
      w(
        'zh-diu',
        '丢',
        'diū',
        'perder',
        '我的护照丢了！',
        '¡Perdí el pasaporte!',
        ['verbs', 'problems'],
        {
          acceptedTranslations: ['perderse'],
        },
      ),
      w(
        'zh-huai',
        '坏',
        'huài',
        'roto (romperse)',
        '我的电脑坏了。',
        'Se me rompió la computadora.',
        ['problems'],
        {
          acceptedTranslations: ['roto', 'romperse', 'malo'],
        },
      ),
      w(
        'zh-wang-olvidar',
        '忘',
        'wàng',
        'olvidar',
        '我忘了。',
        'Me olvidé.',
        ['verbs', 'problems'],
        {
          acceptedTranslations: ['olvidarse'],
        },
      ),
      w(
        'zh-bei-pasiva',
        '被',
        'bèi',
        'partícula pasiva (被)',
        '我的手机被偷了。',
        'Me robaron el celular.',
        ['particle', 'grammar'],
        {
          acceptedTranslations: ['partícula 被'],
        },
      ),
      w('zh-tou-robar', '偷', 'tōu', 'robar', '我的手机被偷了。', 'Me robaron el celular.', [
        'verbs',
        'problems',
      ]),
      w(
        'zh-zenmeban',
        '怎么办',
        'zěnme bàn',
        '¿qué hago?',
        '我的电脑坏了，怎么办？',
        'Se me rompió la computadora, ¿qué hago?',
        ['questions', 'problems'],
        {
          acceptedTranslations: ['qué hago', '¿qué hacemos?'],
        },
      ),
      w(
        'zh-banfa',
        '办法',
        'bànfǎ',
        'solución (manera)',
        '我有一个办法。',
        'Tengo una solución.',
        ['problems'],
        {
          acceptedTranslations: ['solución', 'manera', 'forma'],
        },
      ),
      w(
        'zh-xiu',
        '修',
        'xiū',
        'arreglar',
        '我哥哥会修电脑。',
        'Mi hermano sabe arreglar computadoras.',
        ['verbs'],
        {
          acceptedTranslations: ['reparar'],
          emoji: '🔧',
        },
      ),
      w(
        'zh-keneng',
        '可能',
        'kěnéng',
        'tal vez',
        '可能是充电的问题。',
        'Tal vez es un problema de carga.',
        ['opinion'],
        {
          acceptedTranslations: ['quizás', 'puede ser', 'posible'],
        },
      ),
      w(
        'zh-ruguo',
        '如果',
        'rúguǒ',
        'si (condición)',
        '如果下雨，我就不去。',
        'Si llueve, no voy.',
        ['grammar'],
        {
          acceptedTranslations: ['si'],
        },
      ),
      w(
        'zh-jiu-entonces',
        '就',
        'jiù',
        'entonces (就)',
        '如果下雨，我就不去。',
        'Si llueve, no voy.',
        ['grammar'],
        {
          acceptedTranslations: ['entonces', 'enseguida'],
        },
      ),
      w('zh-danxin', '担心', 'dānxīn', 'preocuparse', '别担心！', '¡No te preocupes!', ['verbs'], {
        acceptedTranslations: ['estar preocupado', 'preocupación'],
      }),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '我觉得…',
        objective: 'Dar tu opinión y decir si estás de acuerdo.',
        intro: {
          explanation:
            '觉得 es «parecer, opinar»: 我觉得这个很好 (me parece que está muy bien). 但是 es «pero» (un poco más fuerte que 可是). 同意 es estar de acuerdo: 我同意 / 我不同意.',
          examples: [
            { target: '我觉得中文很有意思。', base: 'Me parece que el chino es muy interesante.' },
            { target: '我同意，但是有点儿贵。', base: 'Estoy de acuerdo, pero es medio caro.' },
          ],
        },
        takeaways: [
          'Opinas con 我觉得….',
          'Dices si estás de acuerdo con 同意 y matizas con 但是.',
        ],
        exercises: [
          ex.translationChoice(
            '觉得',
            'parecer (opinar)',
            ['entender', 'olvidar', 'saber (hacer algo)'],
            ['zh-juede'],
            { id: 'zh.ex.8wr45rxfbiy543' },
          ),
          ex.translationChoice(
            '同意',
            'estar de acuerdo',
            ['preocuparse', 'olvidar', 'arreglar'],
            ['zh-tongyi'],
            { id: 'zh.ex.1qd5ww5gr7qlal' },
          ),
          ex.listenChoice(
            '我觉得这个很好。',
            ['我觉得这个不好。', '我觉得那个很好。', '我觉得这个很贵。'],
            ['zh-juede'],
            { id: 'zh.ex.xws5zm6my7oe6m' },
          ),
          ex.fillBlank(
            '这件衣服很漂亮，___有点儿贵。',
            'Esta ropa es muy linda, pero medio cara.',
            '但是',
            ['所以', '因为', '还是'],
            ['zh-danshi'],
            {
              id: 'zh.ex.3im1lcm0qlsol3',
            },
          ),
          ex.fillBlank(
            'A：我觉得网上买东西很方便。 B：我___。',
            'A: Me parece que comprar por internet es muy práctico. B: Estoy de acuerdo.',
            '同意',
            ['觉得', '但是', '可以'],
            ['zh-tongyi'],
            { id: 'zh.ex.ctcfmehewly8d5', skill: 'vocabulary' },
          ),
          tone('觉得', 'juéde', ['juēde', 'juěde', 'juède'], ['zh-juede'], {
            id: 'zh.ex.ip5wo7ejzxnedk',
          }),
          ex.matchPairs(
            [
              ['觉得', 'parecer (opinar)'],
              ['但是', 'pero'],
              ['同意', 'estar de acuerdo'],
              ['所以', 'por eso'],
            ],
            ['zh-juede', 'zh-danshi', 'zh-tongyi', 'zh-suoyi'],
            { id: 'zh.ex.fyzvw6n4eeno3v' },
          ),
          reply(
            '你觉得中文怎么样？',
            '¿Qué te parece el chino? (Responde que te parece muy interesante.)',
            'wǒ juéde hěn yǒu yìsi',
            '我觉得很有意思',
            ['zh-juede'],
            {
              id: 'zh.ex.lkn55j1dfq5f6h',
              accepted: [
                'hěn yǒu yìsi',
                '很有意思',
                'wǒ juéde Zhōngwén hěn yǒu yìsi',
                '我觉得中文很有意思',
              ],
            },
          ),
          write(
            'Estoy de acuerdo, pero es caro.',
            'wǒ tóngyì, dànshì hěn guì',
            '我同意，但是很贵',
            ['zh-tongyi', 'zh-danshi'],
            {
              id: 'zh.ex.z7ph7m1yqhjk1b',
              accepted: ['wǒ tóngyì, dànshì tài guì le', '我同意，但是太贵了'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '你怎么了？',
        objective: 'Preguntar qué pasó y contar un problema.',
        intro: {
          explanation:
            '怎么了？ es «¿qué pasó?, ¿qué te pasa?». Los problemas se cuentan con 了 (cambio): 我的护照丢了 (perdí el pasaporte), 电脑坏了 (se rompió la computadora), 我忘了 (me olvidé).',
          examples: [
            { target: '你怎么了？——我的护照丢了！', base: '¿Qué te pasa? — ¡Perdí el pasaporte!' },
            { target: '我的电脑坏了。', base: 'Se me rompió la computadora.' },
          ],
        },
        takeaways: [
          'Preguntas 怎么了？',
          'Cuentas que algo se perdió, se rompió o te lo olvidaste.',
        ],
        exercises: [
          ex.translationChoice(
            '怎么了',
            '¿qué pasó?',
            ['¿por qué?', '¿cuándo?', '¿dónde?'],
            ['zh-zenmele'],
            { id: 'zh.ex.tdxgfjfaxmrog0' },
          ),
          ex.translationChoice(
            '坏',
            'roto (romperse)',
            ['viejo (cosas)', 'nuevo', 'barato'],
            ['zh-huai'],
            { id: 'zh.ex.zqg2ahoptnfwy6' },
          ),
          ex.listenChoice(
            '我的护照丢了！',
            ['我的手机丢了！', '我的护照坏了！', '我的护照在这儿！'],
            ['zh-diu'],
            { id: 'zh.ex.4pi03uc12neelp' },
          ),
          ex.fillBlank(
            '我的电脑___了，不能开了。',
            'Se me rompió la computadora: ya no prende.',
            '坏',
            ['丢', '忘', '旧'],
            ['zh-huai'],
            {
              id: 'zh.ex.hjnkbottm11x9o',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '对不起，我___了你的名字。',
            'Perdón, me olvidé tu nombre.',
            '忘',
            ['丢', '坏', '换'],
            ['zh-wang-olvidar'],
            {
              id: 'zh.ex.g89m0h0kmfz58f',
              skill: 'vocabulary',
            },
          ),
          tone('丢', 'diū', ['diú', 'diǔ', 'diù'], ['zh-diu'], { id: 'zh.ex.amq3tjg3qf52ga' }),
          ex.orderWords('我 的 手机 坏 了。', 'Se me rompió el celular.', ['zh-huai'], {
            id: 'zh.ex.0k9gj270kh65d4',
          }),
          reply(
            '你怎么了？',
            '¿Qué te pasa? (Responde que perdiste el pasaporte.)',
            'wǒ de hùzhào diū le',
            '我的护照丢了',
            ['zh-diu', 'zh-zenmele'],
            {
              id: 'zh.ex.potuaigjr1s0bb',
              accepted: ['hùzhào diū le', '护照丢了', 'wǒ diū le hùzhào', '我丢了护照'],
            },
          ),
          write('Me olvidé.', 'wǒ wàng le', '我忘了', ['zh-wang-olvidar'], {
            id: 'zh.ex.pf5qfjbv0skmu6',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '被偷了',
        objective: 'Contar algo malo que te pasó con 被.',
        intro: {
          explanation:
            'Con 被 la cosa sufre la acción, casi siempre algo malo: 我的手机被偷了 (me robaron el celular). Estructura: cosa + 被 (+ quién) + verbo + 了: 我的月饼被弟弟吃了.',
          examples: [
            { target: '我的手机被偷了。', base: 'Me robaron el celular.' },
            { target: '我的月饼被弟弟吃了。', base: 'Mi hermano se comió mi pastel de luna.' },
          ],
        },
        takeaways: ['Cuentas algo que te hicieron con 被.', 'Usas 被 + (quién) + verbo + 了.'],
        exercises: [
          ex.translationChoice('偷', 'robar', ['perder', 'comprar', 'vender'], ['zh-tou-robar'], {
            id: 'zh.ex.yqef2yfmzaoamt',
          }),
          ex.listenChoice(
            '我的手机被偷了。',
            ['我的手机丢了。', '我的电脑被偷了。', '我的手机坏了。'],
            ['zh-bei-pasiva', 'zh-tou-robar'],
            {
              id: 'zh.ex.9icasbv8stzw2r',
            },
          ),
          ex.fillBlank(
            '我的钱___偷了！',
            '¡Me robaron el dinero!',
            '被',
            ['把', '给', '跟'],
            ['zh-bei-pasiva'],
            {
              id: 'zh.ex.xaloerp0cmp6wp',
              explanation: 'Con 被 la cosa sufre la acción: 我的钱被偷了.',
            },
          ),
          ex.fillBlank(
            '我的月饼被弟弟吃___。',
            'Mi hermano se comió mi pastel de luna.',
            '了',
            ['吗', '过', '呢'],
            ['zh-bei-pasiva'],
            {
              id: 'zh.ex.m3r0d1fxvbs40u',
              explanation: 'Con 被 el verbo termina con 了: 被吃了.',
            },
          ),
          ex.orderWords(
            '我 的 电脑 被 偷 了。',
            'Me robaron la computadora.',
            ['zh-bei-pasiva', 'zh-tou-robar'],
            { id: 'zh.ex.te1mozf3ysg4qy' },
          ),
          tone('偷', 'tōu', ['tóu', 'tǒu', 'tòu'], ['zh-tou-robar'], {
            id: 'zh.ex.dso97ij3flusm8',
          }),
          ex.matchPairs(
            [
              ['被', 'partícula pasiva (被)'],
              ['偷', 'robar'],
              ['丢', 'perder'],
              ['坏', 'roto (romperse)'],
            ],
            ['zh-bei-pasiva', 'zh-tou-robar', 'zh-diu', 'zh-huai'],
            { id: 'zh.ex.pckrmfmgy3ipv4' },
          ),
          reply(
            '你的手机呢？',
            '¿Y tu celular? (Responde que te lo robaron.)',
            'bèi tōu le',
            '被偷了',
            ['zh-bei-pasiva', 'zh-tou-robar'],
            {
              id: 'zh.ex.489ipsagecirpu',
              accepted: [
                'wǒ de shǒujī bèi tōu le',
                '我的手机被偷了',
                'shǒujī bèi tōu le',
                '手机被偷了',
              ],
            },
          ),
          write(
            'Me robaron el pasaporte.',
            'wǒ de hùzhào bèi tōu le',
            '我的护照被偷了',
            ['zh-bei-pasiva'],
            { id: 'zh.ex.v3tepantom6t0j' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '怎么办？',
        objective: 'Pedir y proponer una solución.',
        intro: {
          explanation:
            '怎么办？ es «¿qué hago?, ¿qué hacemos?». 办法 es la solución o la manera: 我有一个办法. 修 es arreglar. 可能 es «tal vez, puede ser»: 可能是充电的问题.',
          examples: [
            { target: '我的电脑坏了，怎么办？', base: 'Se me rompió la computadora, ¿qué hago?' },
            { target: '我有一个办法。', base: 'Tengo una solución.' },
          ],
        },
        takeaways: ['Pides ayuda con 怎么办？', 'Propones una solución con 办法 y 修.'],
        exercises: [
          ex.translationChoice(
            '办法',
            'solución (manera)',
            ['pregunta', 'regalo', 'examen'],
            ['zh-banfa'],
            { id: 'zh.ex.izkestsn1vg5gq' },
          ),
          ex.translationChoice('修', 'arreglar', ['romper', 'cambiar', 'perder'], ['zh-xiu'], {
            id: 'zh.ex.c368hj621m1rz1',
          }),
          ex.listenChoice(
            '我的电脑坏了，怎么办？',
            ['我的电脑坏了，怎么了？', '我的手机坏了，怎么办？', '我的电脑丢了，怎么办？'],
            ['zh-zenmeban'],
            { id: 'zh.ex.40rjmb11sl8j8t' },
          ),
          ex.fillBlank(
            '我哥哥会___电脑。',
            'Mi hermano sabe arreglar computadoras.',
            '修',
            ['坏', '丢', '偷'],
            ['zh-xiu'],
            {
              id: 'zh.ex.dq4gy67uhy62nv',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            '他没来，___生病了。',
            'No vino: tal vez está enfermo.',
            '可能',
            ['还是', '一起', '所以'],
            ['zh-keneng'],
            {
              id: 'zh.ex.kyk7erynuyzxpm',
              skill: 'vocabulary',
            },
          ),
          tone('办法', 'bànfǎ', ['bānfǎ', 'bánfá', 'bǎnfà'], ['zh-banfa'], {
            id: 'zh.ex.h3cdk5qggkwhmz',
          }),
          question(
            'zh.ex.0h458eg1yruk97',
            ARREGLO,
            '¿Qué problema tiene Wang Ming?',
            'Se le rompió la computadora y no prende',
            ['Perdió la computadora', 'Le robaron la computadora', 'No sabe usar la computadora'],
            ['zh-huai'],
            'Wang Ming dice: «我的电脑坏了，不能开了».',
          ),
          question(
            'zh.ex.d6lu9wstub5hy1',
            ARREGLO,
            '¿Qué solución propone Li Hua?',
            'Ir a ver a su hermano, que sabe arreglar computadoras',
            ['Comprar una computadora nueva', 'Cargar la computadora', 'Llamar a la tienda'],
            ['zh-banfa', 'zh-xiu'],
            'Li Hua dice: «我有个办法：我们去找我哥哥，他会修电脑».',
          ),
          reply(
            '我的手机坏了，怎么办？',
            'Se me rompió el celular, ¿qué hago? (Aconséjale que lo lleve a arreglar.)',
            'nǐ qù xiū ba',
            '你去修吧',
            ['zh-xiu', 'zh-zenmeban'],
            {
              id: 'zh.ex.p4mwuwdm7all4g',
              accepted: [
                'xiū ba',
                '修吧',
                'nǐ yīnggāi qù xiū',
                '你应该去修',
                'qù xiū ba',
                '去修吧',
              ],
            },
          ),
          write('Tengo una solución.', 'wǒ yǒu yí ge bànfǎ', '我有一个办法', ['zh-banfa'], {
            id: 'zh.ex.6cnb2s1b5tpyv5',
            accepted: ['wǒ yǒu bànfǎ', '我有办法', 'wǒ yǒu ge bànfǎ', '我有个办法'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '如果…就…',
        objective: 'Hablar de condiciones y tranquilizar a alguien.',
        intro: {
          explanation:
            '如果…就… es «si…, (entonces)…»: 如果下雨，我就不去 (si llueve, no voy). 就 va después de la persona y antes del verbo. 担心 es preocuparse: 别担心 (no te preocupes).',
          examples: [
            { target: '如果下雨，我就不去。', base: 'Si llueve, no voy.' },
            { target: '别担心，我有办法。', base: 'No te preocupes, tengo una solución.' },
          ],
        },
        takeaways: ['Dices condiciones con 如果…就….', 'Tranquilizas a alguien con 别担心.'],
        exercises: [
          ex.translationChoice(
            '担心',
            'preocuparse',
            ['estar de acuerdo', 'olvidar', 'arreglar'],
            ['zh-danxin'],
            { id: 'zh.ex.j6yvw9ewv4csk7' },
          ),
          ex.translationChoice(
            '如果',
            'si (condición)',
            ['porque', 'pero', 'cuando'],
            ['zh-ruguo'],
            { id: 'zh.ex.2ma87cuealtj6q' },
          ),
          ex.listenChoice(
            '如果下雨，我就不去。',
            ['如果下雨，我就去。', '因为下雨，我不去。', '如果不下雨，我就去。'],
            ['zh-ruguo', 'zh-jiu-entonces'],
            {
              id: 'zh.ex.7q0esd3ps6xpf1',
            },
          ),
          ex.fillBlank(
            '如果你有空，我们___一起去吧。',
            'Si tienes tiempo, vamos juntos.',
            '就',
            ['被', '把', '比'],
            ['zh-jiu-entonces', 'zh-ruguo'],
            {
              id: 'zh.ex.6x6do2eu01a75w',
              explanation: 'En 如果…就…, 就 va antes del verbo de la segunda parte.',
            },
          ),
          question(
            'zh.ex.exbjchwut30zoa',
            PROBLEMA,
            '¿Qué le pasó a Anna?',
            'Le robaron el celular',
            ['Perdió el pasaporte', 'Se le rompió el celular', 'Se olvidó el celular en casa'],
            ['zh-bei-pasiva', 'zh-tou-robar'],
            'Anna dice: «我的手机被偷了！».',
          ),
          question(
            'zh.ex.4zfo6f256px946',
            PROBLEMA,
            '¿Qué hacen primero, según Zhang Li?',
            'Preguntarle al mesero',
            ['Ir a comprar otro celular', 'Volver a casa', 'Llamar a la mamá de Anna'],
            ['zh-danxin', 'zh-xian'],
            'Zhang Li dice: «别担心。我们先去问问服务员吧».',
          ),
          question(
            'zh.ex.dhhg44djk2ncym',
            PROBLEMA,
            '¿Por qué está preocupada Anna?',
            'Porque sin celular no puede trabajar',
            ['Porque el celular era nuevo', 'Porque tenía fotos', 'Porque era de su hermana'],
            ['zh-ruguo', 'zh-jiu-entonces'],
            'Anna dice: «如果没有手机，我就不能工作了».',
          ),
          question(
            'zh.ex.nglv9kmioxyvew',
            OPINION,
            '¿Qué opina Li Hua de comprar por internet?',
            'Que es práctico, pero a veces las cosas llegan rotas; se pueden cambiar',
            [
              'Que es caro y peligroso',
              'Que nunca hay problemas',
              'Que no se pueden cambiar las cosas',
            ],
            ['zh-juede', 'zh-danshi'],
            'Li Hua escribe: «我觉得在网上买东西很方便。但是有的时候东西是坏的。如果东西坏了，就可以换».',
          ),
          reply(
            '如果明天下雨，你去吗？',
            'Si mañana llueve, ¿vas? (Responde que si llueve, no vas.)',
            'rúguǒ xià yǔ, wǒ jiù bú qù',
            '如果下雨，我就不去',
            ['zh-ruguo', 'zh-jiu-entonces'],
            {
              id: 'zh.ex.3gg0ugtqnsh78p',
              accepted: [
                'wǒ jiù bú qù',
                '我就不去',
                'bú qù',
                '不去',
                'rúguǒ xià yǔ, wǒ bú qù',
                '如果下雨，我不去',
              ],
            },
          ),
          write('No te preocupes.', 'bié dānxīn', '别担心', ['zh-danxin', 'zh-bie'], {
            id: 'zh.ex.pcdg3jpn5jvmsn',
            accepted: ['nǐ bié dānxīn', '你别担心'],
          }),
        ],
      },
    ],
  },
};

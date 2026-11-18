import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U1 «What did you do on the weekend?» (docs/ES_A1_A2.md): contar qué hiciste ayer, anoche
 * y el fin de semana pasado con el pretérito indefinido (regulares -ar, -er, -ir e irregulares hacer,
 * ir / ser, ver), preguntarlo con vos y usar ya / todavía no con las tareas de la casa.
 * Pronunciación: la sílaba acentuada cambia el tiempo (hablo, presente, frente a habló, pasado).
 * Cultura: el asado del domingo en familia; en la Argentina el pasado de todos los días es el
 * indefinido (hoy comí, ya terminé), no el pretérito perfecto (he comido), que se ve en la U11.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LUNES = dialogue(
  'es.stim.a2-u1-lunes',
  'Monday morning at the office. Two coworkers talk about their weekend.',
  [
    ['Martín', '¡Hola, Lucía! ¿Qué hiciste el finde?'],
    [
      'Lucía',
      'El sábado fui al cine con mi hermana. Vimos una película argentina muy divertida. ¿Y vos?',
    ],
    [
      'Martín',
      'Yo no hice nada. Dormí mucho y leí un libro. El domingo comí un asado con mi familia.',
    ],
    ['Lucía', '¡Qué lindo! ¿Y ya terminaste el trabajo para hoy?'],
    ['Martín', 'No, todavía no. ¡Anoche miré fútbol!'],
  ],
);

const CASA = dialogue(
  'es.stim.a2-u1-casa',
  'Saturday afternoon. Ana asks her son Mateo about the housework.',
  [
    ['Ana', 'Mateo, ¿ya limpiaste el baño?'],
    ['Mateo', 'Sí, ya limpié el baño y la cocina.'],
    ['Ana', '¡Muy bien! ¿Y ya ordenaste tu dormitorio?'],
    ['Mateo', 'No, todavía no. Primero hice las compras.'],
    ['Ana', '¿Compraste pan?'],
    ['Mateo', 'Sí, compré pan, queso y leche. Ahora voy a ordenar mi dormitorio.'],
  ],
);

const MENSAJE = reading(
  'es.stim.a2-u1-mensaje',
  'message',
  'A message from Sofía to her friend Tomás on Monday.',
  [
    '¡Hola, Tomás! ¿Cómo estás?',
    'El fin de semana pasado fui a Rosario a visitar a mis abuelos.',
    'El sábado hablé mucho con mi abuela y tomé mate con mi abuelo.',
    'El domingo comimos un asado en familia.',
    'Anoche dormí diez horas. ¡Estoy muy contenta!',
    'Sofía',
  ],
  { from: 'Sofía', to: 'Tomás' },
);

export const ES_A2_U01: EsUnitDef = {
  names: [
    'Lucía',
    'Martín',
    'Sofía',
    'Tomás',
    'Ana',
    'Mateo',
    'Camila',
    'Diego',
    'Rosario',
    'Córdoba',
    'Mendoza',
    'Bariloche',
    'Palermo',
  ],
  support: [
    'miró',
    'habló',
    'hablaste',
    'tomaste',
    'comiste',
    'comió',
    'comimos',
    'dormiste',
    'durmió',
    'leíste',
    'hiciste',
    'hizo',
    'fue',
    'fuiste',
    'viste',
    'vio',
    'vimos',
    'terminaste',
    'limpié',
    'limpiaste',
    'ordené',
    'ordenaste',
    'compré',
    'compraste',
    'asado',
  ],
  unit: {
    position: 1,
    title: 'What did you do on the weekend?',
    titleEn: '¿Qué hiciste el finde?',
    description:
      'Talk about yesterday, last night and last weekend with the simple past (regular verbs and hacer, ir, ser, ver), and use ya and todavía no with housework.',
    emoji: '📅',
    objective:
      'You can say what you did yesterday, last night and last weekend, ask a friend what they did, and say what you have already done or not done yet.',
    grammar: {
      title: 'The simple past (pretérito indefinido)',
      explanation:
        'To talk about finished actions, Argentines use the simple past, even for things that happened today (hoy comí, ya terminé); the form he comido exists but is much less common in Argentina. Regular -ar verbs: hablé, hablaste (vos), habló (él, ella, usted), hablamos, hablaron. Regular -er and -ir verbs: comí, comiste, comió, comimos, comieron. The yo and él forms carry a written accent on the last syllable, and that stress is the whole difference between hablo (I speak, now) and habló (he spoke). Three very common verbs are irregular and have no accent: hacer → hice, hiciste, hizo; ir → fui, fuiste, fue (ser has the same forms: fue muy lindo, it was really nice); ver → vi, viste, vio. Ya means already and todavía no means not yet: where English says “Have you eaten yet?”, Argentines say ¿Ya comiste?',
      examples: [
        { target: 'Ayer hablé con mi mamá.', base: 'Yesterday I talked to my mom.' },
        {
          target: '¿Qué comiste anoche? — Comí pescado.',
          base: 'What did you eat last night? — I ate fish.',
        },
        {
          target: '¿Ya hiciste las compras? — No, todavía no.',
          base: 'Have you done the shopping yet? — No, not yet.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U1). Sin revisión nativa. Revisar: «miré fútbol» (también se dice «vi el partido»); «hice las compras» para el súper; el «vos» en pasado sin acento (comiste) y sin la -s final coloquial (comistes), que no se enseña; «fui» sólo como «I went» (también es el pasado de ser: se explica en la gramática); «leí» con la aclaración «(in the past)» para separarlo del presente en inglés.',
    },
    words: [
      w(
        'es-ayer',
        'ayer',
        'yesterday',
        'Ayer comí con mi familia.',
        'Yesterday I ate with my family.',
        ['time'],
      ),
      w(
        'es-el-fin-de-semana-pasado',
        'el fin de semana pasado',
        'last weekend',
        'El fin de semana pasado fui a Córdoba.',
        'Last weekend I went to Córdoba.',
        ['time'],
        { acceptedTexts: ['el finde pasado'] },
      ),
      w(
        'es-anoche',
        'anoche',
        'last night',
        'Anoche dormí muy bien.',
        'Last night I slept very well.',
        ['time'],
      ),
      w(
        'es-comi',
        'comí',
        'I ate',
        'Hoy comí pescado con verduras.',
        'Today I ate fish with vegetables.',
        ['past'],
      ),
      w(
        'es-hable',
        'hablé',
        'I spoke',
        'Ayer hablé con mi mamá.',
        'Yesterday I talked to my mom.',
        ['past'],
        {
          acceptedTranslations: ['I talked'],
        },
      ),
      w(
        'es-mire',
        'miré',
        'I watched',
        'Anoche miré una película.',
        'Last night I watched a film.',
        ['past'],
        { acceptedTranslations: ['I looked at'] },
      ),
      w(
        'es-termine',
        'terminé',
        'I finished',
        'Ya terminé el trabajo.',
        'I’ve already finished the work.',
        ['past'],
      ),
      w(
        'es-dormi',
        'dormí',
        'I slept',
        'El domingo dormí toda la tarde.',
        'On Sunday I slept all afternoon.',
        ['past'],
      ),
      w(
        'es-hice',
        'hice',
        'I did',
        'El sábado no hice nada.',
        'On Saturday I didn’t do anything.',
        ['past'],
        {
          acceptedTranslations: ['I made'],
        },
      ),
      w(
        'es-vi',
        'vi',
        'I saw',
        'Ayer vi a Martín en el cine.',
        'Yesterday I saw Martín at the cinema.',
        ['past'],
      ),
      w(
        'es-tome',
        'tomé',
        'I drank',
        'Esta mañana tomé un café con leche.',
        'This morning I had a coffee with milk.',
        ['past'],
        { acceptedTranslations: ['I took'] },
      ),
      w(
        'es-lei',
        'leí',
        'I read (in the past)',
        'El verano pasado leí un libro muy largo.',
        'Last summer I read a very long book.',
        ['past'],
      ),
      w(
        'es-fui',
        'fui',
        'I went',
        'Anoche fui al cine con Sofía.',
        'Last night I went to the cinema with Sofía.',
        ['past'],
      ),
      w(
        'es-ya',
        'ya',
        'already',
        '¿Ya comiste? — Sí, ya comí.',
        'Have you eaten yet? — Yes, I’ve already eaten.',
        ['time'],
      ),
      w(
        'es-todavia-no',
        'todavía no',
        'not yet',
        '¿Ya terminaste? — No, todavía no.',
        'Have you finished yet? — No, not yet.',
        ['time'],
      ),
      w(
        'es-ordenar',
        'ordenar',
        'to tidy up',
        'El sábado quiero ordenar la casa.',
        'On Saturday I want to tidy up the house.',
        ['chores'],
        { acceptedTranslations: ['to tidy'] },
      ),
      w(
        'es-hacer-las-compras',
        'hacer las compras',
        'to do the shopping',
        'Mañana voy a hacer las compras.',
        'Tomorrow I’m going to do the shopping.',
        ['chores'],
        { acceptedTranslations: ['to go grocery shopping'], emoji: '🛒' },
      ),
      w(
        'es-limpiar',
        'limpiar',
        'to clean',
        'Odio limpiar el baño.',
        'I hate cleaning the bathroom.',
        ['chores'],
        { emoji: '🧽' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ayer, anoche, el finde pasado',
        objective: 'Say what you did yesterday with regular -ar verbs.',
        intro: {
          explanation:
            'For a finished action in the past, -ar verbs take -é in the yo form, with the stress on the last syllable: hablar → hablé, mirar → miré, tomar → tomé, terminar → terminé. Useful time words: ayer (yesterday), anoche (last night) and el fin de semana pasado (last weekend, or el finde pasado). Listen to the stress: hablo (I speak) is stressed on the first syllable; hablé (I spoke) and habló (he spoke) on the last one.',
          examples: [
            { target: 'Ayer hablé con mi mamá.', base: 'Yesterday I talked to my mom.' },
            { target: 'Anoche miré fútbol.', base: 'Last night I watched football.' },
          ],
        },
        takeaways: [
          'You form the past of -ar verbs with -é: hablé, miré, tomé, terminé.',
          'You place actions in the past with ayer, anoche and el fin de semana pasado.',
        ],
        exercises: [
          ex.translationChoice(
            'ayer',
            'yesterday',
            ['last night', 'today', 'tomorrow'],
            ['es-ayer'],
            {
              id: 'es.ex.jbw6djs8ouzcpi',
            },
          ),
          ex.matchPairs(
            [
              ['ayer', 'yesterday'],
              ['anoche', 'last night'],
              ['hablé', 'I spoke'],
              ['miré', 'I watched'],
            ],
            ['es-ayer', 'es-anoche', 'es-hable', 'es-mire'],
            { id: 'es.ex.b150vurm35p4c3' },
          ),
          ex.fillBlank(
            'Ayer ___ con mi papá.',
            'Yesterday I talked to my dad.',
            'hablé',
            ['hablo', 'miré', 'tomé'],
            ['es-hable', 'es-ayer'],
            {
              id: 'es.ex.i9gwm0vrdkcxnk',
              explanation:
                'Ayer places the action in the past, so you need hablé (stress on the last syllable). Hablo is the present: I speak.',
            },
          ),
          ex.listenChoice(
            'Anoche miré fútbol.',
            ['Ayer miré fútbol.', 'Anoche tomé mate.', 'Anoche miró fútbol.'],
            ['es-anoche', 'es-mire'],
            { id: 'es.ex.i5zqh6ewc12r9r' },
          ),
          ex.translationChoice(
            'el fin de semana pasado',
            'last weekend',
            ['this weekend', 'next week', 'every day'],
            ['es-el-fin-de-semana-pasado'],
            { id: 'es.ex.wncqdyx41rjzhs' },
          ),
          ex.fillBlank(
            'Esta mañana ___ un café con leche.',
            'This morning I had a coffee with milk.',
            'tomé',
            ['tomo', 'terminé', 'hablé'],
            ['es-tome'],
            {
              id: 'es.ex.b3ibr5mnn9xq7p',
              explanation:
                'Tomé is the past of tomar (to drink, to have). Argentines use the simple past for things that happened earlier today too: esta mañana tomé…',
            },
          ),
          ex.orderWords(
            'Ayer terminé el trabajo.',
            'Yesterday I finished the work.',
            ['es-ayer', 'es-termine'],
            {
              id: 'es.ex.kolka5j4ta6d95',
            },
          ),
          ex.listenChoice(
            'El fin de semana pasado tomé mate.',
            [
              'El fin de semana pasado hablé mucho.',
              'Este fin de semana tomo mate.',
              'El fin de semana pasado tomé café.',
            ],
            ['es-el-fin-de-semana-pasado', 'es-tome'],
            { id: 'es.ex.howiefqqv07wt3' },
          ),
          ex.translateWrite(
            'Last night I talked to Lucía.',
            'Anoche hablé con Lucía.',
            ['es-anoche', 'es-hable'],
            {
              id: 'es.ex.ftrw3nmprxx9qa',
              acceptedAnswers: ['Anoche yo hablé con Lucía.', 'Hablé con Lucía anoche.'],
            },
          ),
          ex.translateWrite(
            'Last weekend I watched football.',
            'El fin de semana pasado miré fútbol.',
            ['es-el-fin-de-semana-pasado', 'es-mire'],
            {
              id: 'es.ex.iuz5eyp68wvibq',
              acceptedAnswers: [
                'El finde pasado miré fútbol.',
                'Miré fútbol el fin de semana pasado.',
                'El fin de semana pasado vi fútbol.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Comí, dormí, leí',
        objective: 'Talk about the past with -er and -ir verbs and ask a friend with vos.',
        intro: {
          explanation:
            'With -er and -ir verbs, yo ends in -í: comer → comí, dormir → dormí, leer → leí. To ask a friend (vos), add -aste to -ar verbs and -iste to -er and -ir verbs: ¿hablaste?, ¿comiste?, ¿dormiste? In the past the vos form has no special accent, and it never ends in s (you may hear comistes, but it is not standard). For él, ella and usted: habló, comió, and dormir changes its vowel: durmió.',
          examples: [
            {
              target: '¿Qué comiste ayer? — Comí pescado.',
              base: 'What did you eat yesterday? — I ate fish.',
            },
            {
              target: '¿Dormiste bien? — Sí, dormí mucho.',
              base: 'Did you sleep well? — Yes, I slept a lot.',
            },
          ],
        },
        takeaways: [
          'You say comí, dormí, leí and ask ¿comiste?, ¿dormiste?',
          'You use habló, comió for él, ella and usted.',
        ],
        exercises: [
          ex.translationChoice('comí', 'I ate', ['I eat', 'I slept', 'I drank'], ['es-comi'], {
            id: 'es.ex.7q3sm79jf0vcri',
          }),
          ex.fillBlank(
            'Anoche ___ muy bien: ¡diez horas!',
            'Last night I slept very well: ten hours!',
            'dormí',
            ['dormiste', 'comí', 'leí'],
            ['es-dormi', 'es-anoche'],
            {
              id: 'es.ex.rjx3qxomg5t6by',
              explanation: 'Dormí is I slept. Dormiste is the vos form: you slept.',
            },
          ),
          ex.listenChoice(
            '¿Qué comiste ayer?',
            ['¿Qué comió ayer?', '¿Qué comí ayer?', '¿Qué tomaste ayer?'],
            ['es-comi', 'es-ayer'],
            { id: 'es.ex.awf8zwr7q5ptaz' },
          ),
          ex.matchPairs(
            [
              ['comí', 'I ate'],
              ['dormí', 'I slept'],
              ['leí', 'I read (in the past)'],
              ['tomé', 'I drank'],
            ],
            ['es-comi', 'es-dormi', 'es-lei', 'es-tome'],
            { id: 'es.ex.x5o2deyleh0mut' },
          ),
          ex.fillBlank(
            'Ayer Lucía ___ con su mamá.',
            'Yesterday Lucía talked to her mom.',
            'habló',
            ['hablé', 'hablaste', 'comió'],
            ['es-hable', 'es-ayer'],
            {
              id: 'es.ex.osxhnxx07hppvt',
              explanation:
                'With él, ella and usted the past of -ar verbs ends in a stressed -ó: habló. Hablé is yo; hablaste is vos.',
            },
          ),
          ex.fillBlank(
            '¿Vos ___ bien anoche?',
            'Did you sleep well last night?',
            'dormiste',
            ['dormí', 'durmió', 'leíste'],
            ['es-dormi', 'es-anoche'],
            {
              id: 'es.ex.kdcwo71hlaphd7',
              explanation:
                'With vos, -er and -ir verbs take -iste in the past: dormiste, comiste, leíste.',
            },
          ),
          ex.translationChoice(
            'leí',
            'I read (in the past)',
            ['I eat', 'I spoke', 'I slept'],
            ['es-lei'],
            {
              id: 'es.ex.pi2l8dgtk3zgym',
            },
          ),
          ex.orderWords(
            'Anoche leí un libro muy divertido.',
            'Last night I read a very funny book.',
            ['es-anoche', 'es-lei'],
            { id: 'es.ex.snvqmfnlcrmjay' },
          ),
          ex.shortAnswer(
            '¿Qué comiste ayer?',
            'Say you ate meat yesterday (start with «Ayer comí»).',
            'Ayer comí carne.',
            ['Comí carne.', 'Comí carne ayer.', 'Ayer yo comí carne.'],
            ['es-comi', 'es-ayer'],
            { id: 'es.ex.g66jqkixxrkmvt' },
          ),
          ex.translateWrite(
            'Did you sleep well? — Yes, I slept a lot.',
            '¿Dormiste bien? — Sí, dormí mucho.',
            ['es-dormi'],
            {
              id: 'es.ex.e5w1fwlujofp4c',
              acceptedAnswers: [
                '¿Dormiste bien? Sí, dormí mucho.',
                '¿Vos dormiste bien? — Sí, dormí mucho.',
                '¿Durmió bien? — Sí, dormí mucho.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Hice, fui, vi',
        objective: 'Use the irregular pasts of hacer, ir, ser and ver.',
        intro: {
          explanation:
            'Some of the most common verbs are irregular in the past and have no written accent. Hacer (to do, to make): hice, hiciste, hizo. Ir (to go): fui, fuiste, fue; ser (to be) has exactly the same forms, so fue muy lindo means it was really nice. Ver (to see): vi, viste, vio. The classic Monday question is ¿Qué hiciste el finde? Notice the double negative: no hice nada (I didn’t do anything).',
          examples: [
            {
              target: '¿Qué hiciste el finde? — Fui al cine.',
              base: 'What did you do at the weekend? — I went to the cinema.',
            },
            { target: 'Vi una película muy divertida.', base: 'I saw a really funny film.' },
          ],
        },
        takeaways: [
          'You use hice, fui and vi, and ask ¿qué hiciste?, ¿fuiste?, ¿viste?',
          'You say no hice nada with two negatives.',
        ],
        exercises: [
          ex.translationChoice('hice', 'I did', ['I went', 'I saw', 'I have'], ['es-hice'], {
            id: 'es.ex.cymjhg1d9d9e2k',
          }),
          ex.fillBlank(
            'El sábado ___ al cine con Sofía.',
            'On Saturday I went to the cinema with Sofía.',
            'fui',
            ['fue', 'vi', 'hice'],
            ['es-fui'],
            {
              id: 'es.ex.xl9fi4alnoklzo',
              explanation: 'Fui is I went (ir). Fue is he or she went; vi is I saw.',
            },
          ),
          ex.listenChoice(
            '¿Qué hiciste el finde?',
            ['¿Qué hizo el finde?', '¿Qué hice el finde?', '¿Qué viste el finde?'],
            ['es-hice'],
            { id: 'es.ex.tvww40wo10woi2' },
          ),
          ex.matchPairs(
            [
              ['hice', 'I did'],
              ['fui', 'I went'],
              ['vi', 'I saw'],
              ['comí', 'I ate'],
            ],
            ['es-hice', 'es-fui', 'es-vi', 'es-comi'],
            { id: 'es.ex.ovjsi0qndmcxbn' },
          ),
          ex.fillBlank(
            'Anoche ___ una película argentina.',
            'Last night I saw an Argentine film.',
            'vi',
            ['fui', 'vio', 'hice'],
            ['es-vi', 'es-anoche'],
            {
              id: 'es.ex.jognkmr2i4hw0y',
              explanation: 'Vi is I saw (ver). Vio is he or she saw.',
            },
          ),
          ex.fillBlank(
            '¿Vos ___ a Bariloche el verano pasado?',
            'Did you go to Bariloche last summer?',
            'fuiste',
            ['fui', 'fue', 'viste'],
            ['es-fui'],
            {
              id: 'es.ex.jgqv5mnvnl5cxz',
              explanation: 'With vos: fuiste. Fui is yo and fue is él, ella or usted.',
            },
          ),
          ex.orderWords(
            'El sábado no hice nada.',
            'On Saturday I didn’t do anything.',
            ['es-hice'],
            {
              id: 'es.ex.5k8tgr85tsraj9',
            },
          ),
          ex.listenChoice(
            'Fui a Mendoza con mi familia.',
            [
              'Fue a Mendoza con su familia.',
              'Fui a Córdoba con mi familia.',
              'Voy a Mendoza con mi familia.',
            ],
            ['es-fui'],
            { id: 'es.ex.3opwlnuo05l8t7' },
          ),
          ex.translateWrite(
            'What did you do last weekend?',
            '¿Qué hiciste el fin de semana pasado?',
            ['es-hice', 'es-el-fin-de-semana-pasado'],
            {
              id: 'es.ex.vgm1m4m933hy83',
              acceptedAnswers: [
                '¿Qué hiciste el finde pasado?',
                '¿Qué hiciste vos el fin de semana pasado?',
                '¿Qué hizo el fin de semana pasado?',
              ],
            },
          ),
          ex.translateWrite(
            'Yesterday I saw Martín at the cinema.',
            'Ayer vi a Martín en el cine.',
            ['es-vi', 'es-ayer'],
            {
              id: 'es.ex.taa4xsfzfhyblf',
              acceptedAnswers: ['Vi a Martín en el cine ayer.', 'Ayer en el cine vi a Martín.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '¿Ya limpiaste?',
        objective: 'Talk about housework and say what you have already done or not done yet.',
        intro: {
          explanation:
            'Ya + past means already: ya limpié (I’ve already cleaned). Todavía no + past means not yet: todavía no terminé. Where English uses the present perfect (Have you cleaned yet?), Argentines use the simple past: ¿Ya limpiaste? Housework: limpiar (to clean), ordenar (to tidy up) and hacer las compras (to do the food shopping; in the past, hice las compras). After quiero, odio or voy a, the verb stays in the infinitive: quiero ordenar.',
          examples: [
            {
              target: '¿Ya limpiaste la cocina? — Sí, ya limpié.',
              base: 'Have you cleaned the kitchen yet? — Yes, I already did.',
            },
            {
              target: '¿Ya hiciste las compras? — No, todavía no.',
              base: 'Have you done the shopping yet? — No, not yet.',
            },
          ],
        },
        takeaways: [
          'You say ya for already and todavía no for not yet, with the simple past.',
          'You talk about housework with limpiar, ordenar and hacer las compras.',
        ],
        exercises: [
          ex.translationChoice(
            'todavía no',
            'not yet',
            ['already', 'always', 'sometimes'],
            ['es-todavia-no'],
            { id: 'es.ex.6nrk4nejtpnd4w' },
          ),
          ex.matchPairs(
            [
              ['limpiar', 'to clean'],
              ['ordenar', 'to tidy up'],
              ['hacer las compras', 'to do the shopping'],
              ['ya', 'already'],
            ],
            ['es-limpiar', 'es-ordenar', 'es-hacer-las-compras', 'es-ya'],
            { id: 'es.ex.42qhxpinhzjpqg' },
          ),
          ex.fillBlank(
            '¿___ comiste? — Sí, comí a las doce.',
            'Have you eaten yet? — Yes, I ate at twelve.',
            'Ya',
            ['Todavía', 'Siempre', 'Mañana'],
            ['es-ya', 'es-comi'],
            {
              id: 'es.ex.j6hleis48krmw7',
              explanation:
                '¿Ya comiste? asks if something has already happened. Todavía on its own does not work here; you need todavía no (not yet).',
            },
          ),
          ex.listenChoice(
            'Todavía no limpié el baño.',
            ['Ya limpié el baño.', 'Todavía no limpié la cocina.', 'Todavía no ordené el baño.'],
            ['es-todavia-no', 'es-limpiar'],
            { id: 'es.ex.5i4nzmzwmcfocy' },
          ),
          ex.fillBlank(
            'El sábado ___ las compras en el supermercado.',
            'On Saturday I did the shopping at the supermarket.',
            'hice',
            ['hizo', 'fui', 'vi'],
            ['es-hacer-las-compras', 'es-hice'],
            {
              id: 'es.ex.4er2leo2bblhc1',
              explanation:
                'Hacer las compras in the past: hice las compras (yo). Hizo is él or ella.',
            },
          ),
          question(
            'es.ex.4l6jyanwe3h0fn',
            CASA,
            'What hasn’t Mateo done yet?',
            'Tidied up his bedroom',
            ['Cleaned the bathroom', 'Cleaned the kitchen', 'Done the shopping'],
            ['es-todavia-no', 'es-ordenar'],
            'When his mother asks “¿Y ya ordenaste tu dormitorio?”, Mateo answers “No, todavía no”.',
          ),
          question(
            'es.ex.1ljjizlzeioenl',
            CASA,
            'What did Mateo buy?',
            'Bread, cheese and milk',
            ['Bread, cheese and wine', 'Meat and vegetables', 'Coffee and milk'],
            ['es-hacer-las-compras'],
            'Mateo says “compré pan, queso y leche”.',
          ),
          ex.orderWords(
            'Hoy quiero ordenar mi dormitorio.',
            'Today I want to tidy up my bedroom.',
            ['es-ordenar'],
            {
              id: 'es.ex.i0u0o6u6iojq14',
            },
          ),
          ex.shortAnswer(
            '¿Ya hiciste las compras?',
            'Say no, not yet (start with «No, todavía no»).',
            'No, todavía no.',
            [
              'Todavía no.',
              'No, todavía no hice las compras.',
              'Todavía no hice las compras.',
              'No, todavía no las hice.',
            ],
            ['es-todavia-no', 'es-hacer-las-compras'],
            { id: 'es.ex.wnascmggg2085s' },
          ),
          ex.translateWrite(
            'I have already cleaned the kitchen.',
            'Ya limpié la cocina.',
            ['es-ya', 'es-limpiar'],
            {
              id: 'es.ex.tsiupznrebveuy',
              acceptedAnswers: [
                'Yo ya limpié la cocina.',
                'Limpié la cocina ya.',
                'Ya he limpiado la cocina.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿Qué hiciste el finde?',
        objective: 'Understand people telling you about their weekend and tell them about yours.',
        intro: {
          explanation:
            'On Monday, everyone asks ¿Qué hiciste el finde? (finde is the everyday short form of fin de semana). A typical Argentine Sunday: a long lunch with the family, often an asado (a barbecue), and football in the afternoon. To tell a story, list the days and join the actions with y and después. To sum it up: fue muy lindo (it was really nice).',
          examples: [
            {
              target: 'El sábado fui al cine y el domingo comí un asado.',
              base: 'On Saturday I went to the cinema and on Sunday I had an asado.',
            },
            { target: 'Fue muy lindo.', base: 'It was really nice.' },
          ],
        },
        takeaways: [
          'You understand a story about the weekend told in the simple past.',
          'You tell what you did on different days with the simple past.',
        ],
        exercises: [
          question(
            'es.ex.q3fdhjvtefan6t',
            LUNES,
            'Where did Lucía go on Saturday?',
            'To the cinema with her sister',
            ['To the cinema with a friend', 'To a football match', 'To her grandparents’ house'],
            ['es-fui'],
            'Lucía says “El sábado fui al cine con mi hermana”.',
          ),
          question(
            'es.ex.2u93nauvxudmn5',
            LUNES,
            'What did Martín eat on Sunday?',
            'An asado with his family',
            ['Pizza with some friends', 'Fish with vegetables', 'Nothing at all'],
            ['es-comi'],
            'Martín says “El domingo comí un asado con mi familia”.',
          ),
          question(
            'es.ex.sdk8k8bps4lyjx',
            LUNES,
            'Has Martín finished the work for today?',
            'No, not yet',
            ['Yes, he finished it on Saturday', 'Yes, he finished it last night', 'He doesn’t say'],
            ['es-todavia-no', 'es-ya', 'es-termine'],
            'Lucía asks “¿Y ya terminaste el trabajo para hoy?” and Martín answers “No, todavía no”.',
          ),
          question(
            'es.ex.8cf6lvd7fs6lmd',
            MENSAJE,
            'Where did Sofía go last weekend?',
            'To Rosario, to visit her grandparents',
            [
              'To Córdoba, to visit her parents',
              'To Rosario, to visit her sister',
              'To the cinema with Tomás',
            ],
            ['es-el-fin-de-semana-pasado', 'es-fui'],
            'Sofía writes “El fin de semana pasado fui a Rosario a visitar a mis abuelos”.',
          ),
          question(
            'es.ex.aq3c8xmpxj44bq',
            MENSAJE,
            'What did Sofía do with her grandfather?',
            'She drank mate with him',
            [
              'She talked a lot with him',
              'She watched football with him',
              'She cooked an asado with him',
            ],
            ['es-tome'],
            'She writes “tomé mate con mi abuelo”; she talked a lot with her grandmother.',
          ),
          ex.listenChoice(
            'El domingo comí un asado con mi familia.',
            [
              'El domingo comió un asado con su familia.',
              'El sábado comí un asado con mi familia.',
              'El domingo comí pescado con mi familia.',
            ],
            ['es-comi'],
            { id: 'es.ex.xwklaq14x6i6bg' },
          ),
          ex.fillBlank(
            'El sábado ___ muy divertido.',
            'Saturday was a lot of fun.',
            'fue',
            ['fui', 'hizo', 'vio'],
            ['es-fui'],
            {
              id: 'es.ex.jfvnnuk1m6a7rb',
              explanation:
                'Fue is the past of ser as well as ir: el sábado fue muy divertido (Saturday was a lot of fun).',
            },
          ),
          ex.shortAnswer(
            '¿Qué hiciste el finde?',
            'Say that on Saturday you went to the cinema (start with «El sábado fui»).',
            'El sábado fui al cine.',
            ['Fui al cine el sábado.', 'El sábado yo fui al cine.'],
            ['es-fui', 'es-hice'],
            { id: 'es.ex.fz5qddqvr8g5kg' },
          ),
          ex.translateWrite(
            'Last night I watched a film and I slept a lot.',
            'Anoche miré una película y dormí mucho.',
            ['es-anoche', 'es-mire', 'es-dormi'],
            {
              id: 'es.ex.j9klg2vle13q51',
              acceptedAnswers: [
                'Anoche vi una película y dormí mucho.',
                'Anoche miré una peli y dormí mucho.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

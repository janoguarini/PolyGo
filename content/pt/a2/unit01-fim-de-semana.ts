import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U1 «¿Qué hiciste el fin de semana?» (docs/PT_A1_A2.md): el pretérito perfeito de los verbos
 * regulares (-ar: falei, falou; -er: comi, comeu; -ir: saí, saiu), ontem, a semana passada, já y
 * ainda não. Con nós, -ar coincide con el presente (falamos): el contexto lo aclara.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SEGUNDA = dialogue('pt.stim.a2-u1-segunda', 'Lunes a la mañana, en la oficina.', [
  ['Renata', 'Bom dia, Fábio! Como foi o fim de semana?'],
  ['Fábio', 'Ótimo! No sábado eu joguei futebol com uns amigos e depois a gente comeu uma pizza.'],
  ['Renata', 'Que legal! E no domingo?'],
  ['Fábio', 'No domingo eu dormi até meio-dia e assisti a um filme. E você?'],
  ['Renata', 'Eu estudei o dia todo. Tenho prova amanhã!'],
]);

const MENSAGEM = reading(
  'pt.stim.a2-u1-mensagem',
  'message',
  'Camila le escribe a su hermano un domingo a la noche.',
  [
    'Oi, Dani! Você já falou com a mamãe hoje?',
    'Eu liguei, mas ela não atendeu.',
    'Ontem à noite eu saí com a Lia e a gente voltou tarde.',
    'Ainda não comi nada hoje! Vamos jantar juntos?',
  ],
  { from: 'Camila', to: 'Dani' },
);

const FERIADO = reading(
  'pt.stim.a2-u1-feriado',
  'post',
  'Una publicación sobre un fin de semana largo.',
  [
    'Feriado prolongado em casa!',
    'Na sexta eu trabalhei até tarde e no sábado eu só descansei.',
    'No domingo a gente cozinhou uma feijoada para a família toda.',
    'Todo mundo comeu muito e ninguém saiu de casa. Perfeito!',
  ],
  { from: 'Márcio', title: 'Meu feriado' },
);

export const PT_A2_U01: PtUnitDef = {
  names: ['Renata', 'Fábio', 'Camila', 'Dani', 'Lia', 'Márcio'],
  support: [
    'estudou',
    'falar',
    'falamos',
    'jogou',
    'fez',
    'saio',
    'pizza',
    'cedo',
    'sair',
    'ótimo',
    'assistiu',
    'bebeu',
    'bebo',
    'foi',
    'feriado',
    'prova',
    'comemos',
    'saímos',
    'come',
    'mamãe',
    'liguei',
    'atendeu',
    'voltou',
    'almoçou',
    'passado',
    'próxima',
    'comeram',
    'estudamos',
    'estudaram',
    'prolongado',
    'só',
    'descansei',
    'cozinhou',
    'feijoada',
    'mundo',
    'ninguém',
    'perfeito',
    'saíram',
    'fizeram',
    'jogamos',
  ],
  unit: {
    position: 1,
    title: '¿Qué hiciste el fin de semana?',
    titleEn: 'O fim de semana',
    description:
      'El pretérito perfeito de los verbos regulares (falei, comi, saí), ontem, a semana passada, já y ainda não.',
    emoji: '🗓️',
    objective:
      'Podés contar qué hiciste ayer o el fin de semana, preguntarle a otro qué hizo y decir lo que ya hiciste y lo que todavía no.',
    grammar: {
      title: 'Pretérito perfeito regular',
      explanation:
        'Para acciones terminadas. -ar: eu falei, você / ele falou, nós falamos, eles falaram. -er: eu comi, ele comeu, nós comemos, eles comeram. -ir: eu saí, ele saiu, nós saímos, eles saíram. Ojo: con -ar, nós falamos es igual en presente y en pasado. Já es «ya» y ainda não, «todavía no».',
      examples: [
        { target: 'Ontem eu trabalhei até tarde.', base: 'Ayer trabajé hasta tarde.' },
        { target: 'Você já comeu?', base: '¿Ya comiste?' },
        { target: 'No sábado eles saíram.', base: 'El sábado ellos salieron.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 nuevo (U1). Sin revisión nativa: revisar las formas del perfeito y assistir a.',
    },
    words: [
      w('pt-ontem', 'ontem', 'ayer', 'Ontem eu estudei muito.', 'Ayer estudié mucho.', ['time']),
      w(
        'pt-ontem-a-noite',
        'ontem à noite',
        'anoche',
        'Ontem à noite eu saí.',
        'Anoche salí.',
        ['time'],
        {
          acceptedTranslations: ['ayer a la noche'],
        },
      ),
      w(
        'pt-semana-passada',
        'semana passada',
        'la semana pasada',
        'Na semana passada eu trabalhei muito.',
        'La semana pasada trabajé mucho.',
        ['time'],
        { acceptedTexts: ['a semana passada'], acceptedTranslations: ['semana pasada'] },
      ),
      w('pt-ja', 'já', 'ya', 'Você já comeu?', '¿Ya comiste?', ['time']),
      w(
        'pt-ainda-nao',
        'ainda não',
        'todavía no',
        'Ainda não estudei.',
        'Todavía no estudié.',
        ['time'],
        {
          acceptedTranslations: ['aún no'],
        },
      ),
      w(
        'pt-falei',
        'falei',
        'hablé',
        'Ontem eu falei com a minha mãe.',
        'Ayer hablé con mi mamá.',
        ['past'],
      ),
      w(
        'pt-falou',
        'falou',
        'habló / hablaste (con você)',
        'Você falou com ele?',
        '¿Hablaste con él?',
        ['past'],
        {
          acceptedTranslations: ['habló', 'hablaste'],
        },
      ),
      w('pt-trabalhei', 'trabalhei', 'trabajé', 'Trabalhei até tarde.', 'Trabajé hasta tarde.', [
        'past',
        'work',
      ]),
      w('pt-estudei', 'estudei', 'estudié', 'Estudei o dia todo.', 'Estudié todo el día.', [
        'past',
      ]),
      w(
        'pt-joguei',
        'joguei',
        'jugué',
        'No sábado eu joguei futebol.',
        'El sábado jugué al fútbol.',
        ['past'],
      ),
      w('pt-comi', 'comi', 'comí', 'Comi uma pizza.', 'Comí una pizza.', ['past', 'food']),
      w(
        'pt-comeu',
        'comeu',
        'comió / comiste (con você)',
        'Você já comeu?',
        '¿Ya comiste?',
        ['past', 'food'],
        {
          acceptedTranslations: ['comió', 'comiste'],
        },
      ),
      w(
        'pt-bebi',
        'bebi',
        'bebí / tomé (una bebida)',
        'Bebi muita água.',
        'Tomé mucha agua.',
        ['past', 'food'],
        {
          acceptedTranslations: ['bebí'],
        },
      ),
      w('pt-sai', 'saí', 'salí', 'Ontem à noite eu saí com amigos.', 'Anoche salí con amigos.', [
        'past',
      ]),
      w(
        'pt-saiu',
        'saiu',
        'salió / saliste (con você)',
        'Ela saiu cedo.',
        'Ella salió temprano.',
        ['past'],
        {
          acceptedTranslations: ['salió', 'saliste'],
        },
      ),
      w('pt-dormi', 'dormi', 'dormí', 'Dormi até meio-dia.', 'Dormí hasta el mediodía.', ['past']),
      w(
        'pt-assisti',
        'assisti',
        'vi / miré (una película, la tele)',
        'Assisti a um filme ótimo.',
        'Vi una película buenísima.',
        ['past'],
        {
          acceptedTranslations: ['vi', 'miré'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ontem eu trabalhei',
        objective: 'Contar qué hiciste ayer con verbos en -ar.',
        intro: {
          explanation:
            'El pretérito perfeito cuenta acciones terminadas. Los verbos en -ar hacen eu -ei y você / ele -ou: falar → eu falei, ele falou; trabalhar → trabalhei, trabalhou. Ontem es «ayer».',
          examples: [
            { target: 'Ontem eu trabalhei até tarde.', base: 'Ayer trabajé hasta tarde.' },
            { target: 'Você falou com a professora?', base: '¿Hablaste con la profesora?' },
          ],
        },
        takeaways: [
          'Contás qué hiciste con -ei: falei, trabalhei.',
          'Preguntás con -ou: você falou?',
        ],
        exercises: [
          ex.translationChoice(
            'ontem',
            'ayer',
            ['mañana (el día siguiente)', 'hoy', 'anoche'],
            ['pt-ontem'],
            {
              id: 'pt.ex.36hku7yrk5rxqs',
            },
          ),
          ex.translationChoice(
            'trabalhei',
            'trabajé',
            ['trabajo', 'trabajamos', 'trabajan'],
            ['pt-trabalhei'],
            {
              id: 'pt.ex.k5nlpcte8d8xiq',
            },
          ),
          ex.listenChoice(
            'Ontem eu estudei muito.',
            ['Hoje eu estudo muito.', 'Ontem ele estudou muito.', 'Ontem eu trabalhei muito.'],
            ['pt-ontem', 'pt-estudei'],
            { id: 'pt.ex.ih0pu6kcgnowcz' },
          ),
          ex.fillBlank(
            'Ontem eu ___ com a minha mãe.',
            'Ayer hablé con mi mamá.',
            'falei',
            ['falo', 'falou', 'falar'],
            ['pt-falei', 'pt-ontem'],
            { id: 'pt.ex.cmmblu1ju7c97u', explanation: 'Pasado de eu en -ar: -ei → falei.' },
          ),
          ex.fillBlank(
            'Você ___ com o Fábio ontem?',
            '¿Hablaste con Fábio ayer?',
            'falou',
            ['falei', 'fala', 'falamos'],
            ['pt-falou', 'pt-ontem'],
            {
              id: 'pt.ex.ljzreemadsr4sb',
              explanation: 'Pasado de você / ele en -ar: -ou → falou.',
            },
          ),
          ex.fillBlank(
            'No sábado eu ___ futebol.',
            'El sábado jugué al fútbol.',
            'joguei',
            ['jogo', 'jogou', 'jogar'],
            ['pt-joguei', 'pt-futebol'],
            {
              id: 'pt.ex.opnatpukp5ny5v',
              explanation: 'Jogar → joguei: se agrega u para conservar el sonido de la g.',
            },
          ),
          ex.matchPairs(
            [
              ['falei', 'hablé'],
              ['trabalhei', 'trabajé'],
              ['estudei', 'estudié'],
              ['joguei', 'jugué'],
            ],
            ['pt-falei', 'pt-trabalhei', 'pt-estudei', 'pt-joguei'],
            { id: 'pt.ex.kidy6d8ie5a65j' },
          ),
          ex.orderWords(
            'Ontem eu trabalhei até tarde.',
            'Ayer trabajé hasta tarde.',
            ['pt-ontem', 'pt-trabalhei'],
            {
              id: 'pt.ex.depup0a5apmk4m',
            },
          ),
          ex.shortAnswer(
            'O que você fez ontem? (estudar)',
            '¿Qué hiciste ayer? (Respondé que estudiaste mucho.)',
            'Eu estudei muito.',
            ['Estudei muito.', 'Ontem eu estudei muito.', 'Ontem estudei muito.'],
            ['pt-estudei'],
            { id: 'pt.ex.7creqet25fxasv' },
          ),
          ex.translateWrite(
            'Ayer hablé con mi papá.',
            'Ontem eu falei com o meu pai.',
            ['pt-ontem', 'pt-falei'],
            {
              id: 'pt.ex.loqcytblgd1x4h',
              acceptedAnswers: [
                'Ontem falei com o meu pai.',
                'Ontem eu falei com meu pai.',
                'Ontem falei com meu pai.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Comi, bebi, saí',
        objective: 'Contar qué hiciste con verbos en -er y en -ir.',
        intro: {
          explanation:
            'En -er y en -ir, eu termina en -i: comi, bebi, saí, dormi. Con você / ele: comeu, bebeu, saiu, dormiu. Assistir a es «ver» una película o la tele: assisti a um filme.',
          examples: [
            { target: 'Ontem à noite eu saí com amigos.', base: 'Anoche salí con amigos.' },
            { target: 'Você comeu a pizza?', base: '¿Comiste la pizza?' },
          ],
        },
        takeaways: [
          'Contás con -i: comi, saí, dormi.',
          'Preguntás con -eu / -iu: você comeu? você saiu?',
        ],
        exercises: [
          ex.translationChoice(
            'ontem à noite',
            'anoche',
            ['ayer', 'esta noche', 'a la noche'],
            ['pt-ontem-a-noite'],
            {
              id: 'pt.ex.czhwwq77dtpxeh',
            },
          ),
          ex.translationChoice(
            'saí',
            'salí',
            ['salió / saliste (con você)', 'salgo', 'dormí'],
            ['pt-sai'],
            {
              id: 'pt.ex.3007iy8355nknm',
            },
          ),
          ex.listenChoice(
            'Ontem à noite eu saí.',
            ['Ontem à noite ela saiu.', 'Ontem à noite eu dormi.', 'Hoje à noite eu saio.'],
            ['pt-ontem-a-noite', 'pt-sai'],
            { id: 'pt.ex.1xu0hfskrfm3h7' },
          ),
          ex.fillBlank(
            'Eu ___ uma pizza ontem.',
            'Comí una pizza ayer.',
            'comi',
            ['comeu', 'como', 'comer'],
            ['pt-comi', 'pt-comeu'],
            { id: 'pt.ex.z6eurlodd0uk8l' },
          ),
          ex.fillBlank(
            'A Lia ___ cedo hoje.',
            'Lia salió temprano hoy.',
            'saiu',
            ['saí', 'saímos', 'sair'],
            ['pt-saiu'],
            { id: 'pt.ex.1u3l4kg8bzmkav', explanation: 'Pasado de ela en -ir: -iu → saiu.' },
          ),
          ex.fillBlank(
            'Ontem eu ___ a um filme ótimo.',
            'Ayer vi una película buenísima.',
            'assisti',
            ['assistiu', 'assisto', 'assistimos'],
            ['pt-assisti'],
            {
              id: 'pt.ex.vm2phuqc50mk9p',
              explanation: 'Ver una película: assistir a → eu assisti a um filme.',
            },
          ),
          ex.fillBlank(
            'Eu ___ muita água depois do futebol.',
            'Tomé mucha agua después del fútbol.',
            'bebi',
            ['bebeu', 'bebo', 'comi'],
            ['pt-bebi', 'pt-agua'],
            { id: 'pt.ex.u49lffbvugycpe' },
          ),
          ex.orderWords(
            'No domingo eu dormi até meio-dia.',
            'El domingo dormí hasta el mediodía.',
            ['pt-dormi', 'pt-meio-dia'],
            {
              id: 'pt.ex.ptqx4y20xriumy',
            },
          ),
          ex.shortAnswer(
            'Você saiu ontem à noite?',
            '¿Saliste anoche? (Respondé que no, que te quedaste: viste una película.)',
            'Não, eu assisti a um filme.',
            [
              'Não, assisti a um filme.',
              'Não. Eu assisti a um filme.',
              'Não, eu assisti um filme.',
              'Não, assisti um filme.',
            ],
            ['pt-assisti'],
            { id: 'pt.ex.i7bih42v8i38y4' },
          ),
          ex.translateWrite(
            'Anoche salí con amigos.',
            'Ontem à noite eu saí com amigos.',
            ['pt-ontem-a-noite', 'pt-sai'],
            {
              id: 'pt.ex.wpm6413uy8y8wa',
              acceptedAnswers: [
                'Ontem à noite saí com amigos.',
                'Ontem à noite eu saí com uns amigos.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Como foi o fim de semana?',
        objective: 'Preguntar y contar cómo fue el fin de semana.',
        intro: {
          explanation:
            'Como foi o fim de semana? es la pregunta de cada lunes («¿cómo fue el fin de semana?»). Se responde con el perfeito: joguei futebol, dormi muito, a gente comeu uma pizza.',
          examples: [
            {
              target: 'Como foi o fim de semana? — Ótimo!',
              base: '¿Cómo fue el fin de semana? — ¡Buenísimo!',
            },
            { target: 'No sábado a gente comeu uma pizza.', base: 'El sábado comimos una pizza.' },
          ],
        },
        takeaways: ['Preguntás cómo fue el fin de semana.', 'Contás varias cosas en orden.'],
        exercises: [
          ex.listenChoice(
            'Como foi o fim de semana?',
            ['Como é o fim de semana?', 'Como foi o feriado?', 'Como vai o fim de semana?'],
            ['pt-fim-de-semana'],
            { id: 'pt.ex.w56p5hxum4vrmp' },
          ),
          question(
            'pt.ex.cmxrhhrsyu1wsg',
            SEGUNDA,
            '¿Qué hizo Fábio el sábado?',
            'Jugó al fútbol y después comió pizza',
            ['Durmió hasta el mediodía', 'Estudió todo el día', 'Vio una película con amigos'],
            ['pt-joguei', 'pt-comeu'],
            'Fábio dice: «No sábado eu joguei futebol… e depois a gente comeu uma pizza».',
          ),
          question(
            'pt.ex.b6ba0nafzvmb1i',
            SEGUNDA,
            '¿Qué hizo el domingo?',
            'Durmió hasta el mediodía y vio una película',
            ['Jugó al fútbol', 'Estudió para una prueba', 'Salió con amigos'],
            ['pt-dormi', 'pt-assisti'],
            'Fábio dice: «No domingo eu dormi até meio-dia e assisti a um filme».',
          ),
          question(
            'pt.ex.kwkkzgwp3ibn4d',
            SEGUNDA,
            '¿Por qué Renata estudió todo el día?',
            'Porque tiene una prueba mañana',
            [
              'Porque no tiene trabajo',
              'Porque le gusta estudiar el domingo',
              'Porque tuvo una prueba el sábado',
            ],
            ['pt-estudei'],
            'Renata dice: «Eu estudei o dia todo. Tenho prova amanhã!».',
          ),
          ex.fillBlank(
            'No sábado a gente ___ uma pizza.',
            'El sábado comimos una pizza.',
            'comeu',
            ['comi', 'comemos', 'como'],
            ['pt-comeu', 'pt-a-gente'],
            {
              id: 'pt.ex.5joken1b9bbma4',
              explanation: 'A gente lleva el verbo como ele: a gente comeu.',
            },
          ),
          ex.fillBlank(
            'Você ___ com quem no sábado?',
            '¿Con quién saliste el sábado?',
            'saiu',
            ['saí', 'saímos', 'sair'],
            ['pt-saiu'],
            { id: 'pt.ex.oxf01rjdffgd0m' },
          ),
          ex.orderWords(
            'Você jogou futebol no sábado?',
            '¿Jugaste al fútbol el sábado?',
            ['pt-futebol'],
            {
              id: 'pt.ex.nsethwvbn0v07a',
            },
          ),
          ex.shortAnswer(
            'Como foi o seu domingo? (dormir muito)',
            '¿Cómo fue tu domingo? (Respondé que dormiste mucho.)',
            'Eu dormi muito.',
            [
              'Dormi muito.',
              'Foi ótimo, eu dormi muito.',
              'Foi bom, dormi muito.',
              'No domingo eu dormi muito.',
            ],
            ['pt-dormi'],
            { id: 'pt.ex.wvz2uaha96fbno' },
          ),
          ex.translateWrite(
            'El sábado jugué al fútbol.',
            'No sábado eu joguei futebol.',
            ['pt-joguei'],
            {
              id: 'pt.ex.1gjotxbwewtidr',
              acceptedAnswers: ['No sábado joguei futebol.', 'Sábado eu joguei futebol.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Já ou ainda não?',
        objective: 'Decir lo que ya hiciste y lo que todavía no.',
        intro: {
          explanation:
            'Já es «ya»: você já comeu? En la respuesta se repite el verbo: já, comi! «Todavía no» es ainda não: ainda não comi. En portugués no hace falta otro tiempo verbal: alcanza con el perfeito.',
          examples: [
            {
              target: 'Você já falou com a mamãe? — Já!',
              base: '¿Ya hablaste con mamá? — ¡Sí, ya!',
            },
            { target: 'Ainda não comi nada hoje.', base: 'Todavía no comí nada hoy.' },
          ],
        },
        takeaways: ['Preguntás con já: você já comeu?', 'Respondés ainda não + perfeito.'],
        exercises: [
          ex.translationChoice(
            'ainda não',
            'todavía no',
            ['ya', 'nunca', 'ahora no'],
            ['pt-ainda-nao'],
            {
              id: 'pt.ex.zd1iisi67ixtpk',
            },
          ),
          ex.translationChoice(
            'comeu',
            'comió / comiste (con você)',
            ['comí', 'como', 'comemos'],
            ['pt-comeu'],
            {
              id: 'pt.ex.v68j68gr1lz5jv',
            },
          ),
          ex.listenChoice(
            'Você já comeu?',
            ['Você já saiu?', 'Você ainda não comeu?', 'Você come aqui?'],
            ['pt-ja', 'pt-comeu'],
            { id: 'pt.ex.aii8uxxe4xczyp' },
          ),
          ex.fillBlank(
            'Você ___ falou com ela? — Já!',
            '¿Ya hablaste con ella? — ¡Sí!',
            'já',
            ['ainda', 'não', 'muito'],
            ['pt-ja', 'pt-falou'],
            { id: 'pt.ex.lmykmk45ecuael' },
          ),
          ex.fillBlank(
            '___ não estudei para a prova.',
            'Todavía no estudié para la prueba.',
            'Ainda',
            ['Já', 'Ontem', 'Muito'],
            ['pt-ainda-nao', 'pt-estudei'],
            { id: 'pt.ex.ayf91fiwm236wo' },
          ),
          question(
            'pt.ex.jeolp2a1f2e81m',
            MENSAGEM,
            '¿Qué le pregunta Camila a su hermano primero?',
            'Si ya habló con la mamá',
            ['Si ya comió', 'Si salió anoche', 'Dónde está la mamá'],
            ['pt-ja', 'pt-falou'],
            'Camila escribe: «Você já falou com a mamãe hoje?».',
          ),
          question(
            'pt.ex.dozmbc3ps3an65',
            MENSAGEM,
            '¿Qué hizo Camila anoche?',
            'Salió con Lia y volvió tarde',
            ['Llamó a su mamá', 'Comió con su hermano', 'Se quedó en casa'],
            ['pt-ontem-a-noite', 'pt-sai'],
            'Escribe: «Ontem à noite eu saí com a Lia e a gente voltou tarde».',
          ),
          question(
            'pt.ex.9d3tyuhx0akm0t',
            MENSAGEM,
            '¿Qué propone al final?',
            'Cenar juntos, porque todavía no comió',
            ['Llamar a la mamá', 'Salir con Lia', 'Ver una película'],
            ['pt-ainda-nao', 'pt-comi'],
            'El mensaje dice: «Ainda não comi nada hoje! Vamos jantar juntos?».',
          ),
          ex.shortAnswer(
            'Você já almoçou?',
            '¿Ya almorzaste? (Respondé que todavía no.)',
            'Ainda não.',
            ['Não, ainda não.', 'Ainda não almocei.', 'Não, ainda não almocei.'],
            ['pt-ainda-nao'],
            { id: 'pt.ex.r8suoxqdyl4yg1' },
          ),
          ex.translateWrite('¿Ya comiste?', 'Você já comeu?', ['pt-ja', 'pt-comeu'], {
            id: 'pt.ex.m5fpemlbxmkif6',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'A semana passada',
        objective: 'Contar qué hicieron varias personas y cuándo.',
        intro: {
          explanation:
            'En plural: nós falamos, comemos, saímos; eles falaram, comeram, saíram. A semana passada es «la semana pasada»: na semana passada.',
          examples: [
            {
              target: 'Na semana passada nós trabalhamos muito.',
              base: 'La semana pasada trabajamos mucho.',
            },
            { target: 'Eles saíram tarde ontem.', base: 'Ellos salieron tarde ayer.' },
          ],
        },
        takeaways: [
          'Contás en plural: falamos, falaram.',
          'Ubicás en el tiempo: ontem, na semana passada.',
        ],
        exercises: [
          ex.translationChoice(
            'semana passada',
            'la semana pasada',
            ['la semana que viene', 'el fin de semana', 'ayer'],
            ['pt-semana-passada'],
            {
              id: 'pt.ex.8x940j5n5cp4it',
            },
          ),
          ex.fillBlank(
            'Na semana ___ eu trabalhei muito.',
            'La semana pasada trabajé mucho.',
            'passada',
            ['passado', 'próxima', 'toda'],
            ['pt-semana-passada', 'pt-trabalhei'],
            { id: 'pt.ex.zzz6cqrclp2stl', explanation: 'Semana es femenino: a semana passada.' },
          ),
          ex.fillBlank(
            'Ontem eles ___ uma pizza.',
            'Ayer ellos comieron una pizza.',
            'comeram',
            ['comemos', 'comeu', 'comi'],
            ['pt-comeu', 'pt-eles'],
            { id: 'pt.ex.7nw4ng1jhwygv9', explanation: 'Con eles en -er: -eram → comeram.' },
          ),
          ex.listenChoice(
            'Na semana passada nós estudamos muito.',
            [
              'Na semana passada eles estudaram muito.',
              'No fim de semana nós estudamos muito.',
              'Na semana passada nós trabalhamos muito.',
            ],
            ['pt-semana-passada', 'pt-nos'],
            { id: 'pt.ex.t7eb7ox8q055y5' },
          ),
          question(
            'pt.ex.cgj9zjldye8ou8',
            FERIADO,
            '¿Por qué Márcio descansó el sábado?',
            'Porque el viernes trabajó hasta tarde',
            [
              'Porque estaba enfermo',
              'Porque salió el viernes a la noche',
              'Porque cocinó todo el día',
            ],
            ['pt-trabalhei'],
            'Márcio escribe: «Na sexta eu trabalhei até tarde, então no sábado eu só descansei».',
          ),
          question(
            'pt.ex.d5j74v61xljp3f',
            FERIADO,
            '¿Qué hizo la familia el domingo?',
            'Cocinó una feijoada y nadie salió de casa',
            ['Comió en un restaurante', 'Salió a pasear', 'Vio una película en el cine'],
            ['pt-comeu', 'pt-saiu'],
            'Dice: «a gente cozinhou uma feijoada… ninguém saiu de casa».',
          ),
          ex.orderWords(
            'Eles saíram tarde ontem.',
            'Ellos salieron tarde ayer.',
            ['pt-saiu', 'pt-ontem'],
            {
              id: 'pt.ex.mfy93aupttry3h',
            },
          ),
          ex.shortAnswer(
            'O que vocês fizeram no sábado? (jogar futebol)',
            '¿Qué hicieron ustedes el sábado? (Respondé que jugaron al fútbol.)',
            'Nós jogamos futebol.',
            ['Jogamos futebol.', 'A gente jogou futebol.', 'No sábado nós jogamos futebol.'],
            ['pt-joguei', 'pt-nos'],
            { id: 'pt.ex.tykd940d72sgcg' },
          ),
          ex.translateWrite(
            'La semana pasada trabajé mucho.',
            'Na semana passada eu trabalhei muito.',
            ['pt-semana-passada', 'pt-trabalhei'],
            {
              id: 'pt.ex.5nlqw823cqd7oz',
              acceptedAnswers: [
                'Na semana passada trabalhei muito.',
                'Semana passada eu trabalhei muito.',
                'Semana passada trabalhei muito.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

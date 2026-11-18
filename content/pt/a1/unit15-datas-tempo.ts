import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, PT_A1_RATE, question, reading, w } from '../helpers';

/**
 * PT-BR A1 U15 «Fechas, meses y clima» (docs/PT_A1_A2.md): los meses, la fecha (dia 5 de maio),
 * em + mes, el cumpleaños (aniversário) y el clima con fazer (faz calor, faz frio) y chover. Brasil
 * está en el hemisferio sur: el verano es en diciembre, como en la Argentina.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ANIVERSARIO = dialogue(
  'pt.stim.a1-u15-aniversario',
  'Dos compañeros de trabajo hablan en el almuerzo.',
  [
    ['Paula', 'Quando é o seu aniversário, Caio?'],
    ['Caio', 'É no dia vinte e cinco de julho. E o seu?'],
    ['Paula', 'O meu é em dezembro, no dia dois.'],
    ['Caio', 'Em dezembro? No verão! Que legal.'],
  ],
  PT_A1_RATE,
);

const CLIMA = reading(
  'pt.stim.a1-u15-clima',
  'post',
  'Una chica de Porto Alegre escribe sobre el clima de su ciudad.',
  [
    'Eu moro em Porto Alegre, no sul do Brasil.',
    'Aqui o inverno é de junho a agosto e faz muito frio.',
    'No verão faz muito calor e chove pouco.',
    'Eu adoro o verão!',
  ],
  { from: 'Bia', title: 'O tempo em Porto Alegre' },
);

const JUNINA = reading(
  'pt.stim.a1-u15-junina',
  'notice',
  'Un aviso en la escuela de un barrio.',
  [
    'Festa Junina da escola!',
    'Sábado, dia vinte e quatro de junho, às seis horas.',
    'Comida, música e dança.',
    'Se chover, a festa é no domingo.',
  ],
  { title: 'Festa Junina' },
);

export const PT_A1_U15: PtUnitDef = {
  names: ['Paula', 'Caio', 'Porto Alegre', 'Bia', 'Festa Junina', 'Natal', 'Carnaval'],
  support: [
    'vem',
    'dela',
    'tempo',
    'sul',
    'aqui',
    'música',
    'dança',
    'chover',
    'favorito',
    'começa',
  ],
  unit: {
    position: 15,
    title: 'Fechas, meses y clima',
    titleEn: 'Datas e tempo',
    description:
      'Los meses, la fecha y el cumpleaños, em + mes y el clima con faz calor, faz frio y chove.',
    emoji: '📅',
    objective:
      'Podés decir la fecha y cuándo es tu cumpleaños, nombrar los meses y las estaciones y contar qué tiempo hace.',
    grammar: {
      title: 'La fecha · em + mes · fazer para el clima',
      explanation:
        'La fecha: dia + número + de + mes (dia cinco de maio). Con meses va em: em março; con un día, no dia: no dia dez. El clima se dice con fazer: faz calor, faz frio; «llueve» es chove. Los meses van con minúscula.',
      examples: [
        { target: 'Hoje é dia dez de maio.', base: 'Hoy es 10 de mayo.' },
        { target: 'O meu aniversário é em março.', base: 'Mi cumpleaños es en marzo.' },
        { target: 'No inverno faz frio.', base: 'En invierno hace frío.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U15). Sin revisión nativa: revisar fechas, faz calor y el aviso de la Festa Junina.',
    },
    words: [
      w('pt-mes', 'mês', 'mes', 'Qual é o seu mês favorito?', '¿Cuál es tu mes favorito?', [
        'time',
      ]),
      w('pt-janeiro', 'janeiro', 'enero', 'Em janeiro faz calor.', 'En enero hace calor.', [
        'months',
      ]),
      w(
        'pt-fevereiro',
        'fevereiro',
        'febrero',
        'O Carnaval é em fevereiro.',
        'El Carnaval es en febrero.',
        ['months'],
      ),
      w(
        'pt-marco',
        'março',
        'marzo',
        'O meu aniversário é em março.',
        'Mi cumpleaños es en marzo.',
        ['months'],
      ),
      w('pt-abril', 'abril', 'abril', 'Em abril chove muito.', 'En abril llueve mucho.', [
        'months',
      ]),
      w('pt-maio', 'maio', 'mayo', 'Hoje é dia dez de maio.', 'Hoy es 10 de mayo.', ['months']),
      w(
        'pt-junho',
        'junho',
        'junio',
        'A Festa Junina é em junho.',
        'La Festa Junina es en junio.',
        ['months'],
      ),
      w('pt-julho', 'julho', 'julio', 'Em julho faz frio.', 'En julio hace frío.', ['months']),
      w(
        'pt-agosto',
        'agosto',
        'agosto',
        'Em agosto eu trabalho muito.',
        'En agosto trabajo mucho.',
        ['months'],
      ),
      w(
        'pt-setembro',
        'setembro',
        'septiembre',
        'A escola começa em setembro?',
        '¿La escuela empieza en septiembre?',
        ['months'],
        {
          acceptedTranslations: ['setiembre'],
        },
      ),
      w('pt-outubro', 'outubro', 'octubre', 'Em outubro faz calor.', 'En octubre hace calor.', [
        'months',
      ]),
      w(
        'pt-novembro',
        'novembro',
        'noviembre',
        'O aniversário dela é em novembro.',
        'El cumpleaños de ella es en noviembre.',
        ['months'],
      ),
      w(
        'pt-dezembro',
        'dezembro',
        'diciembre',
        'O Natal é em dezembro.',
        'La Navidad es en diciembre.',
        ['months'],
      ),
      w(
        'pt-aniversario',
        'aniversário',
        'cumpleaños',
        'Quando é o seu aniversário?',
        '¿Cuándo es tu cumpleaños?',
        ['time'],
        { emoji: '🎂', acceptedTranslations: ['aniversario'] },
      ),
      w(
        'pt-faz-calor',
        'faz calor',
        'hace calor',
        'No verão faz calor.',
        'En verano hace calor.',
        ['weather'],
        {
          emoji: '☀️',
        },
      ),
      w(
        'pt-faz-frio',
        'faz frio',
        'hace frío',
        'Hoje faz muito frio.',
        'Hoy hace mucho frío.',
        ['weather'],
        {
          emoji: '🥶',
        },
      ),
      w(
        'pt-chove',
        'chove',
        'llueve',
        'Em abril chove muito.',
        'En abril llueve mucho.',
        ['weather'],
        {
          emoji: '🌧️',
        },
      ),
      w('pt-verao', 'verão', 'verano', 'Eu adoro o verão.', 'Me encanta el verano.', ['weather'], {
        emoji: '🏖️',
      }),
      w(
        'pt-inverno',
        'inverno',
        'invierno',
        'O inverno é de junho a agosto.',
        'El invierno es de junio a agosto.',
        ['weather'],
        {
          emoji: '❄️',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'De janeiro a junho',
        objective: 'Nombrar los primeros meses del año.',
        intro: {
          explanation:
            'Los meses se parecen al español, pero cambian algunas letras: janeiro (enero), fevereiro (febrero), março (marzo). Se escriben con minúscula. Mês es «mes».',
          examples: [
            { target: 'O Carnaval é em fevereiro.', base: 'El Carnaval es en febrero.' },
            { target: 'O meu aniversário é em março.', base: 'Mi cumpleaños es en marzo.' },
          ],
        },
        takeaways: ['Nombrás los meses de enero a junio.', 'Usás em con los meses: em março.'],
        exercises: [
          ex.translationChoice('janeiro', 'enero', ['junio', 'julio', 'febrero'], ['pt-janeiro'], {
            id: 'pt.ex.ztw2k5zna6c2e9',
          }),
          ex.translationChoice('maio', 'mayo', ['marzo', 'junio', 'abril'], ['pt-maio'], {
            id: 'pt.ex.a0af60o1wkk4dh',
          }),
          ex.matchPairs(
            [
              ['fevereiro', 'febrero'],
              ['março', 'marzo'],
              ['maio', 'mayo'],
              ['junho', 'junio'],
            ],
            ['pt-fevereiro', 'pt-marco', 'pt-maio', 'pt-junho'],
            { id: 'pt.ex.vihvbasu2niriq' },
          ),
          ex.listenChoice(
            'O Carnaval é em fevereiro.',
            ['O Carnaval é em janeiro.', 'O Carnaval é em março.', 'O Natal é em fevereiro.'],
            ['pt-fevereiro'],
            { id: 'pt.ex.rzg6qxbp6bumjk' },
          ),
          ex.fillBlank(
            'O meu aniversário é ___ abril.',
            'Mi cumpleaños es en abril.',
            'em',
            ['no', 'de', 'à'],
            ['pt-abril', 'pt-aniversario'],
            { id: 'pt.ex.q574lksobx6dro', explanation: 'Con los meses va em: em abril.' },
          ),
          ex.fillBlank(
            'Depois de janeiro vem ___.',
            'Después de enero viene febrero.',
            'fevereiro',
            ['março', 'junho', 'maio'],
            ['pt-janeiro', 'pt-fevereiro'],
            { id: 'pt.ex.6ypr627yqxrm95', skill: 'vocabulary' },
          ),
          ex.orderWords('Em março eu estudo muito.', 'En marzo estudio mucho.', ['pt-marco'], {
            id: 'pt.ex.ivury314w6zqgy',
          }),
          ex.shortAnswer(
            'Qual é o mês depois de maio?',
            '¿Cuál es el mes después de mayo?',
            'Junho.',
            ['É junho.', 'junho'],
            ['pt-junho', 'pt-mes'],
            { id: 'pt.ex.5ojpk7736e3edo' },
          ),
          ex.translateWrite(
            'El Carnaval es en febrero.',
            'O Carnaval é em fevereiro.',
            ['pt-fevereiro'],
            {
              id: 'pt.ex.a3dg0ddsdtg3ca',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'De julho a dezembro',
        objective: 'Nombrar los meses del segundo semestre.',
        intro: {
          explanation:
            'Julho es «julio» y junho, «junio»: cuidado, se parecen. Setembro, outubro, novembro y dezembro terminan en -bro, como en español.',
          examples: [
            { target: 'O Natal é em dezembro.', base: 'La Navidad es en diciembre.' },
            { target: 'Em julho eu trabalho muito.', base: 'En julio trabajo mucho.' },
          ],
        },
        takeaways: [
          'Nombrás los meses de julio a diciembre.',
          'Distinguís junho (junio) y julho (julio).',
        ],
        exercises: [
          ex.translationChoice('julho', 'julio', ['junio', 'enero', 'abril'], ['pt-julho'], {
            id: 'pt.ex.5ufymr5mmhm85b',
            explanation: 'Julho es julio; junho, junio.',
          }),
          ex.translationChoice(
            'outubro',
            'octubre',
            ['agosto', 'noviembre', 'septiembre'],
            ['pt-outubro'],
            {
              id: 'pt.ex.p31005cm6cwy6l',
            },
          ),
          ex.listenChoice('Em julho.', ['Em junho.', 'Em janeiro.', 'Em abril.'], ['pt-julho'], {
            id: 'pt.ex.regr4dv4w198uh',
          }),
          ex.matchPairs(
            [
              ['setembro', 'septiembre'],
              ['outubro', 'octubre'],
              ['novembro', 'noviembre'],
              ['dezembro', 'diciembre'],
            ],
            ['pt-setembro', 'pt-outubro', 'pt-novembro', 'pt-dezembro'],
            { id: 'pt.ex.3w18zqzenvwlva' },
          ),
          ex.fillBlank(
            'O Natal é em ___.',
            'La Navidad es en diciembre.',
            'dezembro',
            ['novembro', 'setembro', 'agosto'],
            ['pt-dezembro'],
            { id: 'pt.ex.djd7ym8o94d9ny', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Depois de julho vem ___.',
            'Después de julio viene agosto.',
            'agosto',
            ['junho', 'outubro', 'maio'],
            ['pt-julho', 'pt-agosto'],
            { id: 'pt.ex.icfaf9sw9cjj9g', skill: 'vocabulary' },
          ),
          ex.orderWords(
            'O aniversário dela é em novembro.',
            'El cumpleaños de ella es en noviembre.',
            ['pt-novembro'],
            {
              id: 'pt.ex.3cibsdgjo133s5',
            },
          ),
          ex.shortAnswer(
            'Qual é o mês do Natal?',
            '¿Cuál es el mes de Navidad?',
            'Dezembro.',
            ['É dezembro.', 'O Natal é em dezembro.', 'Em dezembro.'],
            ['pt-dezembro', 'pt-mes'],
            { id: 'pt.ex.ct3drgiqnhid3z' },
          ),
          ex.translateWrite(
            'En octubre estudio mucho.',
            'Em outubro eu estudo muito.',
            ['pt-outubro'],
            {
              id: 'pt.ex.jj6lgpmpglye5i',
              acceptedAnswers: ['Em outubro estudo muito.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Que dia é hoje?',
        objective: 'Decir la fecha y cuándo es tu cumpleaños.',
        intro: {
          explanation:
            'La fecha: dia + número + de + mes: hoje é dia dez de maio. «El 10» de un mes es no dia dez. Aniversário es «cumpleaños» (también «aniversario»).',
          examples: [
            { target: 'Hoje é dia dez de maio.', base: 'Hoy es 10 de mayo.' },
            {
              target: 'O meu aniversário é no dia cinco de março.',
              base: 'Mi cumpleaños es el 5 de marzo.',
            },
          ],
        },
        takeaways: [
          'Decís la fecha: dia dez de maio.',
          'Preguntás y decís cuándo es el cumpleaños.',
        ],
        exercises: [
          ex.translationChoice(
            'aniversário',
            'cumpleaños',
            ['mes', 'fiesta', 'semana'],
            ['pt-aniversario'],
            {
              id: 'pt.ex.0pabbxhpvh3pwx',
              explanation: 'En Brasil, aniversário es sobre todo el cumpleaños.',
            },
          ),
          ex.imageChoice('🎂', 'aniversário', ['mês', 'julho', 'maio'], ['pt-aniversario'], {
            id: 'pt.ex.11e70ebhy5nywc',
          }),
          ex.listenChoice(
            'Hoje é dia dez de maio.',
            ['Hoje é dia dois de maio.', 'Hoje é dia dez de março.', 'Hoje é dia doze de maio.'],
            ['pt-maio', 'pt-dez', 'pt-hoje'],
            { id: 'pt.ex.3q7td8zzqa9f75' },
          ),
          ex.fillBlank(
            'O meu aniversário é ___ dia cinco de março.',
            'Mi cumpleaños es el 5 de marzo.',
            'no',
            ['em', 'na', 'de'],
            ['pt-aniversario', 'pt-marco'],
            { id: 'pt.ex.k8356egnh1k1im', explanation: 'Con un día: no dia cinco.' },
          ),
          ex.fillBlank(
            'Hoje é dia vinte ___ abril.',
            'Hoy es 20 de abril.',
            'de',
            ['em', 'no', 'da'],
            ['pt-abril', 'pt-vinte'],
            { id: 'pt.ex.xywck4on7y3yeq' },
          ),
          question(
            'pt.ex.p6x1mdw34h1eac',
            ANIVERSARIO,
            '¿Cuándo es el cumpleaños de Caio?',
            'El 25 de julio',
            ['El 25 de junio', 'El 2 de diciembre', 'El 5 de julio'],
            ['pt-aniversario', 'pt-julho'],
            'Caio dice: «É no dia vinte e cinco de julho».',
          ),
          question(
            'pt.ex.9o6bs4tsptectu',
            ANIVERSARIO,
            '¿Por qué a Caio le gusta la fecha del cumpleaños de Paula?',
            'Porque es en diciembre, en verano',
            [
              'Porque es en julio, en vacaciones',
              'Porque es el mismo día',
              'Porque es en invierno',
            ],
            ['pt-dezembro', 'pt-verao'],
            'Paula dice que es «em dezembro» y Caio responde: «No verão!».',
          ),
          ex.orderWords(
            'Quando é o seu aniversário?',
            '¿Cuándo es tu cumpleaños?',
            ['pt-aniversario', 'pt-quando'],
            {
              id: 'pt.ex.j2ealwe0ujp99t',
            },
          ),
          ex.shortAnswer(
            'Quando é o seu aniversário? (5/3)',
            '¿Cuándo es tu cumpleaños? (Respondé que es el 5 de marzo.)',
            'É no dia cinco de março.',
            [
              'O meu aniversário é no dia cinco de março.',
              'Meu aniversário é no dia cinco de março.',
              'No dia cinco de março.',
              'Dia cinco de março.',
              'É dia cinco de março.',
            ],
            ['pt-aniversario', 'pt-marco'],
            { id: 'pt.ex.cxhb24ei126ixp' },
          ),
          ex.translateWrite('Hoy es 10 de mayo.', 'Hoje é dia dez de maio.', ['pt-maio'], {
            id: 'pt.ex.e3mwf1hk0ii7zg',
            acceptedAnswers: ['Hoje é dez de maio.', 'Hoje é dia 10 de maio.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Faz calor, faz frio',
        objective: 'Decir qué tiempo hace.',
        intro: {
          explanation:
            'El clima se dice con fazer, como en español con «hacer»: faz calor, faz frio. «Llueve» es chove. Las estaciones: o verão, o inverno; no verão = «en verano».',
          examples: [
            { target: 'Hoje faz muito calor.', base: 'Hoy hace mucho calor.' },
            { target: 'No inverno chove muito.', base: 'En invierno llueve mucho.' },
          ],
        },
        takeaways: [
          'Decís qué tiempo hace: faz calor, faz frio, chove.',
          'Hablás de verão e inverno.',
        ],
        exercises: [
          ex.imageChoice('☀️', 'faz calor', ['faz frio', 'chove', 'inverno'], ['pt-faz-calor'], {
            id: 'pt.ex.hj9slbwdll3dwc',
          }),
          ex.imageChoice('🌧️', 'chove', ['faz calor', 'verão', 'faz frio'], ['pt-chove'], {
            id: 'pt.ex.tkzcjhtda2us3p',
          }),
          ex.translationChoice(
            'verão',
            'verano',
            ['invierno', 'primavera', 'vacaciones'],
            ['pt-verao'],
            {
              id: 'pt.ex.9wcdl200v5ogyl',
            },
          ),
          ex.listenChoice(
            'Hoje faz muito frio.',
            ['Hoje faz muito calor.', 'Hoje chove muito.', 'Amanhã faz muito frio.'],
            ['pt-faz-frio', 'pt-hoje'],
            { id: 'pt.ex.6ijch0a3ma8hc6' },
          ),
          ex.fillBlank(
            'No verão ___ calor.',
            'En verano hace calor.',
            'faz',
            ['é', 'tem', 'está'],
            ['pt-faz-calor', 'pt-verao'],
            { id: 'pt.ex.qv0g3nk4rd1jv5', explanation: 'El clima se dice con fazer: faz calor.' },
          ),
          ex.fillBlank(
            'Em julho faz frio: é ___.',
            'En julio hace frío: es invierno.',
            'inverno',
            ['verão', 'calor', 'Natal'],
            ['pt-inverno', 'pt-julho', 'pt-faz-frio'],
            { id: 'pt.ex.yoku09c6238iuo', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.wf541jycqreq34',
            CLIMA,
            '¿Cómo es el invierno en Porto Alegre?',
            'De junio a agosto y hace mucho frío',
            ['De diciembre a febrero y hace calor', 'Llueve todos los días', 'No hace frío'],
            ['pt-inverno', 'pt-faz-frio'],
            'Bia escribe: «o inverno é de junho a agosto e faz muito frio».',
          ),
          question(
            'pt.ex.8jwzrm778lrnqu',
            CLIMA,
            '¿Qué pasa en verano?',
            'Hace mucho calor y llueve poco',
            ['Hace frío y llueve mucho', 'Llueve mucho', 'Hace calor y llueve todos los días'],
            ['pt-verao', 'pt-faz-calor', 'pt-chove'],
            'El texto dice: «No verão faz muito calor e chove pouco».',
          ),
          ex.shortAnswer(
            'Faz frio hoje?',
            '¿Hace frío hoy? (Respondé que no, que hace calor.)',
            'Não, faz calor.',
            ['Não, hoje faz calor.', 'Faz calor.', 'Não. Faz calor.', 'Não, faz muito calor.'],
            ['pt-faz-calor'],
            { id: 'pt.ex.lt2wy1g5pi1s60' },
          ),
          ex.translateWrite(
            'En invierno hace frío.',
            'No inverno faz frio.',
            ['pt-inverno', 'pt-faz-frio'],
            {
              id: 'pt.ex.16wnfevu6d0abf',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'O ano no Brasil',
        objective: 'Combinar fechas, meses y clima.',
        intro: {
          explanation:
            'Brasil está en el hemisferio sur: em dezembro faz calor (o Natal é no verão) y em julho é inverno. En junio se hacen las festas juninas, con comida y música.',
          examples: [
            { target: 'O Natal é no verão.', base: 'La Navidad es en verano.' },
            { target: 'Em junho faz frio no sul.', base: 'En junio hace frío en el sur.' },
          ],
        },
        takeaways: [
          'Hablás del año: meses, fiestas y clima.',
          'Entendés un aviso con fecha y hora.',
        ],
        exercises: [
          ex.fillBlank(
            'O Natal é em dezembro, no ___.',
            'La Navidad es en diciembre, en verano.',
            'verão',
            ['inverno', 'mês', 'frio'],
            ['pt-verao', 'pt-dezembro'],
            { id: 'pt.ex.n34l12bfz06b7d', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Em abril chove muito.',
            ['Em agosto chove muito.', 'Em abril chove pouco.', 'Em abril faz muito calor.'],
            ['pt-abril', 'pt-chove'],
            { id: 'pt.ex.1tpse128vvr9d4' },
          ),
          question(
            'pt.ex.it6uw7ws0k578s',
            JUNINA,
            '¿Cuándo es la Festa Junina?',
            'El sábado 24 de junio a las seis',
            ['El domingo 24 de junio', 'El sábado 4 de julio', 'El viernes 24 de junio a las seis'],
            ['pt-junho'],
            'El aviso dice: «Sábado, dia vinte e quatro de junho, às seis horas».',
          ),
          question(
            'pt.ex.gdx2k3eznmmpmq',
            JUNINA,
            '¿Qué pasa si llueve?',
            'La fiesta pasa al domingo',
            ['No hay fiesta', 'La fiesta es en la escuela', 'La fiesta empieza más tarde'],
            ['pt-chove'],
            'El aviso dice: «Se chover, a festa é no domingo».',
          ),
          ex.matchPairs(
            [
              ['faz calor', 'hace calor'],
              ['faz frio', 'hace frío'],
              ['chove', 'llueve'],
              ['inverno', 'invierno'],
            ],
            ['pt-faz-calor', 'pt-faz-frio', 'pt-chove', 'pt-inverno'],
            { id: 'pt.ex.ckrpxw51ui3pkx' },
          ),
          ex.orderWords(
            'Em dezembro faz muito calor no Brasil.',
            'En diciembre hace mucho calor en Brasil.',
            ['pt-dezembro', 'pt-faz-calor'],
            {
              id: 'pt.ex.go8etag2opf085',
            },
          ),
          ex.shortAnswer(
            'Qual é o seu mês favorito?',
            '¿Cuál es tu mes favorito? (Respondé que es enero, porque hace calor.)',
            'É janeiro, porque faz calor.',
            [
              'Janeiro, porque faz calor.',
              'O meu mês favorito é janeiro, porque faz calor.',
              'Meu mês favorito é janeiro, porque faz calor.',
            ],
            ['pt-janeiro', 'pt-mes', 'pt-faz-calor'],
            { id: 'pt.ex.grzbhvfpo5cl63' },
          ),
          ex.translateWrite('La Navidad es en verano.', 'O Natal é no verão.', ['pt-verao'], {
            id: 'pt.ex.nabx0yyf0vgdnb',
          }),
        ],
      },
    ],
  },
};

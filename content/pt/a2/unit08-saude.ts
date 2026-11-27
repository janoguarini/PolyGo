import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U8 «Salud y bienestar» (docs/PT_A1_A2.md): estar com dor de… («me duele»), partes del
 * cuerpo, síntomas, la farmacia y el imperativo para dar indicaciones y consejos (tome, beba,
 * descanse, evite; não coma). Falso amigo: costas es la «espalda» (no la costa).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CONSULTA = dialogue('pt.stim.a2-u8-consulta', 'En el consultorio de una médica.', [
  ['Médica', 'Bom dia! O que você está sentindo?'],
  ['Pedro', 'Estou com dor de garganta e um pouco de febre desde ontem.'],
  ['Médica', 'É um resfriado. Tome este remédio de oito em oito horas e beba muita água.'],
  ['Pedro', 'Posso ir trabalhar?'],
  ['Médica', 'Não. Descanse em casa por dois dias.'],
]);

const BULA = reading(
  'pt.stim.a2-u8-bula',
  'notice',
  'Las indicaciones de un remedio para el dolor.',
  [
    'Para dor de cabeça, dor nas costas e febre.',
    'Adultos: tome um comprimido de seis em seis horas.',
    'Não tome mais de quatro comprimidos por dia.',
    'Evite bebidas alcoólicas. Crianças: consulte um médico.',
  ],
  { title: 'Como usar' },
);

const MENSAGEM = reading(
  'pt.stim.a2-u8-mensagem',
  'message',
  'Clara le escribe a su compañera de trabajo.',
  [
    'Oi, Lu! Hoje não vou trabalhar. Estou com uma dor de barriga horrível.',
    'Acho que comi alguma coisa estragada ontem.',
    'Já marquei uma consulta para as onze. Avisa a chefe, por favor?',
  ],
  { from: 'Clara', to: 'Lu' },
);

const DENTISTA = dialogue('pt.stim.a2-u8-dentista', 'Una llamada a un consultorio odontológico.', [
  ['Recepção', 'Consultório Sorriso, bom dia.'],
  ['Hugo', 'Bom dia. Eu gostaria de marcar uma consulta. Estou com muita dor de dente.'],
  ['Recepção', 'Hoje às quatro da tarde está bom para o senhor?'],
  ['Hugo', 'Está ótimo. Obrigado!'],
]);

export const PT_A2_U08: PtUnitDef = {
  names: ['Médica', 'Pedro', 'Clara', 'Lu', 'Recepção', 'Sorriso', 'Hugo'],
  support: [
    'desde',
    'graus',
    'sentindo',
    'este',
    'horrível',
    'acho',
    'estragada',
    'marquei',
    'avisa',
    'bebe',
    'usar',
    'adultos',
    'comprimido',
    'evita',
    'alcoólicas',
    'consulte',
    'esquina',
    'compro',
    'fique',
    'doce',
    'pegar',
    'consultório',
    'dói',
    'doente',
  ],
  unit: {
    position: 8,
    title: 'Salud y bienestar',
    titleEn: 'Saúde',
    description:
      'Estar com dor de…, el cuerpo, los síntomas, la farmacia, pedir una cita y el imperativo para indicaciones y consejos.',
    emoji: '🩺',
    objective:
      'Puedes decir qué te duele y qué síntomas tienes, pedir una cita, entender indicaciones de un remedio y dar consejos de salud.',
    grammar: {
      title: 'Imperativo · estar com dor de',
      explanation:
        '«Me duele la cabeza» se dice estou com dor de cabeça. Para indicaciones y consejos se usa el imperativo (con você): -ar → -e (tome, descanse, evite); -er / -ir → -a (beba, coma, abra). Negativo: não tome. Entre amigos también se oye toma, bebe.',
      examples: [
        { target: 'Estou com dor de cabeça.', base: 'Me duele la cabeza.' },
        {
          target: 'Tome este remédio e beba muita água.',
          base: 'Toma este remedio y toma mucha agua.',
        },
        { target: 'Não coma muito hoje.', base: 'No comas mucho hoy.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U8). Sin revisión nativa: revisar las indicaciones del remedio y el imperativo.',
    },
    words: [
      w('pt-dor', 'dor', 'dolor', 'Estou com dor de cabeça.', 'Me duele la cabeza.', ['health'], {
        emoji: '🤕',
      }),
      w('pt-cabeca', 'cabeça', 'cabeza', 'A minha cabeça dói.', 'Me duele la cabeza.', [
        'health',
        'body',
      ]),
      w(
        'pt-barriga',
        'barriga',
        'panza / barriga',
        'Estou com dor de barriga.',
        'Me duele la panza.',
        ['health', 'body'],
        {
          acceptedTranslations: ['panza', 'estómago'],
        },
      ),
      w(
        'pt-garganta',
        'garganta',
        'garganta',
        'Estou com dor de garganta.',
        'Me duele la garganta.',
        ['health', 'body'],
      ),
      w('pt-costas', 'costas', 'espalda', 'Estou com dor nas costas.', 'Me duele la espalda.', [
        'health',
        'body',
      ]),
      w(
        'pt-dente',
        'dente',
        'diente',
        'Estou com dor de dente.',
        'Me duele una muela.',
        ['health', 'body'],
        {
          acceptedTranslations: ['muela'],
          emoji: '🦷',
        },
      ),
      w('pt-febre', 'febre', 'fiebre', 'Ele está com febre.', 'Él tiene fiebre.', ['health'], {
        emoji: '🤒',
      }),
      w(
        'pt-resfriado',
        'resfriado',
        'resfrío',
        'Estou com um resfriado.',
        'Estoy resfriado.',
        ['health'],
        {
          acceptedTranslations: ['resfriado', 'resfriada'],
          emoji: '🤧',
        },
      ),
      w(
        'pt-remedio',
        'remédio',
        'remedio / medicamento',
        'Tome o remédio depois do almoço.',
        'Toma el remedio después del almuerzo.',
        ['health'],
        {
          acceptedTranslations: ['remedio', 'medicamento'],
          emoji: '💊',
        },
      ),
      w(
        'pt-farmacia',
        'farmácia',
        'farmacia',
        'A farmácia fica na esquina.',
        'La farmacia está en la esquina.',
        ['health', 'places'],
        {
          emoji: '⚕️',
        },
      ),
      w(
        'pt-tome',
        'tome',
        'toma / tome',
        'Tome um comprimido.',
        'Toma una pastilla.',
        ['health', 'imperative'],
        {
          acceptedTranslations: ['tomá', 'tomá / tome', 'toma'],
        },
      ),
      w(
        'pt-beba',
        'beba',
        'toma (un líquido) / bebe',
        'Beba muita água.',
        'Toma mucha agua.',
        ['health', 'imperative'],
        {
          acceptedTranslations: ['bebé', 'tomá (un líquido) / bebé', 'bebe'],
        },
      ),
      w(
        'pt-descanse',
        'descanse',
        'descansa / descanse',
        'Descanse em casa.',
        'Descansa en casa.',
        ['health', 'imperative'],
        {
          acceptedTranslations: ['descansá', 'descansá / descanse', 'descansa'],
        },
      ),
      w(
        'pt-evite',
        'evite',
        'evita / evite',
        'Evite café à noite.',
        'Evita el café por la noche.',
        ['health', 'imperative'],
        {
          acceptedTranslations: ['evitá', 'evitá / evite', 'evita'],
        },
      ),
      w(
        'pt-melhoras',
        'melhoras!',
        '¡que te mejores!',
        'Você está doente? Melhoras!',
        '¿Estás enfermo? ¡Que te mejores!',
        ['health', 'courtesy'],
        {
          acceptedTexts: ['melhoras'],
          acceptedTranslations: ['que te mejores', '¡que se mejore!'],
        },
      ),
      w(
        'pt-consulta',
        'consulta',
        'cita (médica)',
        'Marquei uma consulta para amanhã.',
        'Pedí cita para mañana.',
        ['health'],
        {
          acceptedTranslations: ['turno', 'cita médica', 'turno (médico)', 'cita'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Estou com dor de cabeça',
        objective: 'Decir qué te duele.',
        intro: {
          explanation:
            '«Me duele…» se dice estou com dor de…: estou com dor de cabeça, de garganta, de dente. Con la espalda va nas: estou com dor nas costas. Falso amigo: costas es la «espalda».',
          examples: [
            { target: 'Estou com dor de cabeça.', base: 'Me duele la cabeza.' },
            { target: 'Ele está com dor nas costas.', base: 'A él le duele la espalda.' },
          ],
        },
        takeaways: ['Dices qué te duele: estou com dor de…', 'Sabes que costas es «espalda».'],
        exercises: [
          ex.translationChoice(
            'costas',
            'espalda',
            ['costa', 'costillas', 'cuello'],
            ['pt-costas'],
            {
              id: 'pt.ex.8pmmph0d1dautt',
              explanation: 'Falso amigo: costas es la espalda.',
            },
          ),
          ex.translationChoice('dor', 'dolor', ['fiebre', 'resfrío', 'remedio'], ['pt-dor'], {
            id: 'pt.ex.3axxh6ahhcflc1',
          }),
          ex.imageChoice('🦷', 'dente', ['cabeça', 'barriga', 'costas'], ['pt-dente'], {
            id: 'pt.ex.vxhq6c2jik86er',
          }),
          ex.matchPairs(
            [
              ['cabeça', 'cabeza'],
              ['barriga', 'panza / barriga'],
              ['costas', 'espalda'],
              ['dente', 'diente'],
            ],
            ['pt-cabeca', 'pt-barriga', 'pt-costas', 'pt-dente'],
            { id: 'pt.ex.4mkixjeimwdgqx' },
          ),
          ex.listenChoice(
            'Estou com dor de garganta.',
            [
              'Estou com dor de barriga.',
              'Ela está com dor de garganta.',
              'Estou com dor de cabeça.',
            ],
            ['pt-dor', 'pt-garganta'],
            { id: 'pt.ex.cz7w26geqp7og6' },
          ),
          ex.fillBlank(
            'Estou com ___ de cabeça.',
            'Me duele la cabeza.',
            'dor',
            ['dente', 'costas', 'barriga'],
            ['pt-dor', 'pt-cabeca'],
            { id: 'pt.ex.dp793rmqufx2wr' },
          ),
          ex.fillBlank(
            'Ele está com dor ___ costas.',
            'A él le duele la espalda.',
            'nas',
            ['de', 'na', 'das'],
            ['pt-costas'],
            { id: 'pt.ex.rjnpmge6afk6nm', explanation: 'Con la espalda: dor nas costas.' },
          ),
          ex.orderWords(
            'Estou com dor de barriga.',
            'Me duele la panza.',
            ['pt-dor', 'pt-barriga'],
            { id: 'pt.ex.ekgdbll0mg7lhd' },
          ),
          ex.shortAnswer(
            'O que você tem? (🤕)',
            '¿Qué te pasa? (Responde que te duele la cabeza.)',
            'Estou com dor de cabeça.',
            ['Eu estou com dor de cabeça.', 'Dor de cabeça.', 'Tô com dor de cabeça.'],
            ['pt-dor', 'pt-cabeca'],
            { id: 'pt.ex.mszuge0feo57gb' },
          ),
          ex.translateWrite(
            'Me duele la espalda.',
            'Estou com dor nas costas.',
            ['pt-costas', 'pt-dor'],
            {
              id: 'pt.ex.1ok0b4feltc4b2',
              acceptedAnswers: ['Eu estou com dor nas costas.', 'Tô com dor nas costas.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Febre e resfriado',
        objective: 'Contar tus síntomas.',
        intro: {
          explanation:
            'Con estar com se dicen los síntomas: estou com febre (tengo fiebre), estou com um resfriado (estoy resfriado). En Brasil gripe es una gripe fuerte; un resfrío común es um resfriado.',
          examples: [
            { target: 'Estou com febre desde ontem.', base: 'Tengo fiebre desde ayer.' },
            { target: 'Acho que é um resfriado.', base: 'Creo que es un resfrío.' },
          ],
        },
        takeaways: ['Cuentas síntomas con estou com…', 'Distingues resfriado y gripe.'],
        exercises: [
          ex.imageChoice('🤒', 'febre', ['resfriado', 'dor', 'remédio'], ['pt-febre'], {
            id: 'pt.ex.ap8b19rdho9wsh',
          }),
          ex.imageChoice('🤧', 'resfriado', ['febre', 'dente', 'dor'], ['pt-resfriado'], {
            id: 'pt.ex.wuzhy3cat879ec',
          }),
          ex.listenChoice(
            'Estou com febre desde ontem.',
            [
              'Estou com febre desde hoje.',
              'Ele está com febre desde ontem.',
              'Estou com dor desde ontem.',
            ],
            ['pt-febre'],
            { id: 'pt.ex.cxt5nn8zi21guu' },
          ),
          ex.fillBlank(
            'A minha filha está com ___: 38 graus.',
            'Mi hija tiene fiebre: 38 grados.',
            'febre',
            ['dor', 'costas', 'consulta'],
            ['pt-febre'],
            { id: 'pt.ex.5drq20benoj20x', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.oduvd6w5pll1xq',
            CONSULTA,
            '¿Qué síntomas tiene Pedro?',
            'Dolor de garganta y un poco de fiebre',
            ['Dolor de cabeza y de espalda', 'Dolor de panza', 'Mucha fiebre y tos'],
            ['pt-garganta', 'pt-febre', 'pt-dor'],
            'Pedro dice: «Estou com dor de garganta e um pouco de febre desde ontem».',
          ),
          question(
            'pt.ex.yasb00q2t4gvv4',
            CONSULTA,
            '¿Qué tiene Pedro según la médica?',
            'Un resfrío',
            ['Una gripe fuerte', 'Una infección grave', 'Nada'],
            ['pt-resfriado', 'pt-tome', 'pt-descanse', 'pt-remedio'],
            'La médica dice: «É um resfriado».',
          ),
          question(
            'pt.ex.7ii5g7kixd2sfj',
            MENSAGEM,
            '¿Por qué Clara no va a trabajar?',
            'Le duele mucho la panza',
            ['Tiene fiebre', 'Le duele la espalda', 'Tiene que ir al dentista'],
            ['pt-barriga', 'pt-dor', 'pt-consulta'],
            'Clara escribe: «Estou com uma dor de barriga horrível».',
          ),
          ex.orderWords('Acho que é um resfriado.', 'Creo que es un resfrío.', ['pt-resfriado'], {
            id: 'pt.ex.5ge27bhfk62qel',
          }),
          ex.shortAnswer(
            'Como você está? (🤒 febre)',
            '¿Cómo estás? (Responde que tienes fiebre.)',
            'Estou com febre.',
            ['Eu estou com febre.', 'Tô com febre.', 'Não estou bem, estou com febre.'],
            ['pt-febre'],
            { id: 'pt.ex.hnwwuw428dc1lb' },
          ),
          ex.translateWrite(
            'Tengo fiebre desde ayer.',
            'Estou com febre desde ontem.',
            ['pt-febre'],
            {
              id: 'pt.ex.a81kjfa426b92w',
              acceptedAnswers: ['Eu estou com febre desde ontem.', 'Tô com febre desde ontem.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Tome o remédio',
        objective: 'Entender y dar indicaciones con el imperativo.',
        intro: {
          explanation:
            'El imperativo con você: los verbos en -ar terminan en -e (tomar → tome) y los en -er / -ir, en -a (beber → beba). Remédio es «remedio» o «medicamento». Se compra na farmácia.',
          examples: [
            {
              target: 'Tome um comprimido de oito em oito horas.',
              base: 'Toma una pastilla cada ocho horas.',
            },
            { target: 'Beba muita água.', base: 'Toma mucha agua.' },
          ],
        },
        takeaways: ['Entiendes indicaciones: tome, beba.', 'Compras un remedio en la farmacia.'],
        exercises: [
          ex.translationChoice(
            'remédio',
            'remedio / medicamento',
            ['receta', 'médico', 'farmacia'],
            ['pt-remedio'],
            { id: 'pt.ex.sl60j318orippl' },
          ),
          ex.imageChoice('💊', 'remédio', ['farmácia', 'febre', 'dente'], ['pt-remedio'], {
            id: 'pt.ex.zm937ss2fm0r5h',
          }),
          ex.listenChoice(
            'Tome o remédio e beba muita água.',
            [
              'Tomei o remédio e bebi muita água.',
              'Tome o remédio e beba pouca água.',
              'Tome o remédio depois do almoço.',
            ],
            ['pt-tome', 'pt-beba', 'pt-remedio'],
            { id: 'pt.ex.17ffb274v0uvls' },
          ),
          ex.fillBlank(
            '___ este remédio de oito em oito horas.',
            'Toma este remedio cada ocho horas.',
            'Tome',
            ['Toma', 'Tomei', 'Beba'],
            ['pt-tome', 'pt-remedio'],
            { id: 'pt.ex.e4w4v8mq84w8jp', explanation: 'Imperativo con você de tomar: tome.' },
          ),
          ex.fillBlank(
            '___ muita água, por favor.',
            'Toma mucha agua, por favor.',
            'Beba',
            ['Bebe', 'Tome', 'Bebi'],
            ['pt-beba'],
            { id: 'pt.ex.7z00dmepyxocax', explanation: 'Imperativo de beber con você: beba.' },
          ),
          question(
            'pt.ex.n5q4qps1twsx16',
            BULA,
            '¿Cada cuánto se toma el remedio?',
            'Cada seis horas',
            ['Cada ocho horas', 'Una vez por día', 'Cuatro veces por hora'],
            ['pt-tome', 'pt-remedio'],
            'Las indicaciones dicen: «tome um comprimido de seis em seis horas».',
          ),
          question(
            'pt.ex.ts9pomea7n94kn',
            BULA,
            '¿Qué hay que hacer con los chicos?',
            'Consultar a un médico',
            ['Darles medio comprimido', 'Darles el remedio con agua', 'Nada especial'],
            ['pt-remedio', 'pt-evite'],
            'Dice: «Crianças: consulte um médico».',
          ),
          ex.orderWords(
            'A farmácia fica na esquina.',
            'La farmacia está en la esquina.',
            ['pt-farmacia'],
            { id: 'pt.ex.bc7doxl030e5lj' },
          ),
          ex.shortAnswer(
            'Onde eu compro o remédio?',
            '¿Dónde compro el remedio? (Responde que en la farmacia.)',
            'Na farmácia.',
            ['Compre na farmácia.', 'Você compra na farmácia.', 'Na farmácia da esquina.'],
            ['pt-farmacia', 'pt-remedio'],
            { id: 'pt.ex.8j10q4fab6x20j' },
          ),
          ex.translateWrite('Toma mucha agua.', 'Beba muita água.', ['pt-beba'], {
            id: 'pt.ex.1wg55esz9lj3it',
            acceptedAnswers: ['Bebe muita água.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Descanse e evite café',
        objective: 'Dar consejos de salud (y en negativo).',
        intro: {
          explanation:
            'Para aconsejar: descanse (descansa), evite (evita), coma frutas. En negativo se agrega não: não tome café, não coma doce. A alguien enfermo se le dice melhoras! («¡que te mejores!»).',
          examples: [
            {
              target: 'Descanse e evite café à noite.',
              base: 'Descansa y evita el café por la noche.',
            },
            {
              target: 'Não coma muito hoje. Melhoras!',
              base: 'No comas mucho hoy. ¡Que te mejores!',
            },
          ],
        },
        takeaways: ['Das consejos: descanse, evite.', 'Saludas a un enfermo: melhoras!'],
        exercises: [
          ex.translationChoice(
            'melhoras!',
            '¡que te mejores!',
            ['¡mejor!', '¡qué mal!', '¡buen provecho!'],
            ['pt-melhoras'],
            { id: 'pt.ex.70xrg9fmdta7c0' },
          ),
          ex.translationChoice(
            'evite',
            'evita / evite',
            ['invita', 'espera', 'come'],
            ['pt-evite'],
            { id: 'pt.ex.g1xfkwdn8cbhk2' },
          ),
          ex.listenChoice(
            'Descanse em casa por dois dias.',
            [
              'Descanse em casa por três dias.',
              'Descansei em casa por dois dias.',
              'Fique em casa por dois dias.',
            ],
            ['pt-descanse'],
            { id: 'pt.ex.ad15psdo6mvew6' },
          ),
          ex.fillBlank(
            '___ café à noite.',
            'Evita el café por la noche.',
            'Evite',
            ['Evita', 'Descanse', 'Beba'],
            ['pt-evite'],
            { id: 'pt.ex.m9ioxiezls607r' },
          ),
          ex.fillBlank(
            'Não ___ doce, você está com dor de dente.',
            'No comas dulces, te duele una muela.',
            'coma',
            ['come', 'comi', 'beba'],
            ['pt-dente'],
            { id: 'pt.ex.mn0eycgcn87uw3', explanation: 'Imperativo negativo de comer: não coma.' },
          ),
          question(
            'pt.ex.zfudn7ralrrro4',
            CONSULTA,
            '¿Qué le dice la médica sobre ir a trabajar?',
            'Que no vaya: que descanse dos días en casa',
            [
              'Que puede ir a trabajar',
              'Que vaya solo por la tarde',
              'Que vuelva al consultorio mañana',
            ],
            ['pt-descanse'],
            'La médica dice: «Não. Descanse em casa por dois dias».',
          ),
          question(
            'pt.ex.zdj88ktf7p2jl0',
            BULA,
            '¿Qué hay que evitar?',
            'Las bebidas alcohólicas',
            ['El café', 'Comer después del remedio', 'Tomar agua'],
            ['pt-evite'],
            'Dice: «Evite bebidas alcoólicas».',
          ),
          ex.matchPairs(
            [
              ['tome', 'toma / tome'],
              ['beba', 'toma (un líquido) / bebe'],
              ['descanse', 'descansa / descanse'],
              ['evite', 'evita / evite'],
            ],
            ['pt-tome', 'pt-beba', 'pt-descanse', 'pt-evite'],
            { id: 'pt.ex.4pijuw2p0gv9pw' },
          ),
          ex.shortAnswer(
            'Estou com um resfriado.',
            'Estoy resfriado. (Aconseja: descansa y toma mucha agua.)',
            'Descanse e beba muita água.',
            [
              'Descanse e beba muita água. Melhoras!',
              'Beba muita água e descanse.',
              'Descansa e bebe muita água.',
            ],
            ['pt-descanse', 'pt-beba'],
            { id: 'pt.ex.frh3cipvwbmhk3' },
          ),
          ex.translateWrite(
            'Descansa en casa. ¡Que te mejores!',
            'Descanse em casa. Melhoras!',
            ['pt-descanse', 'pt-melhoras'],
            {
              id: 'pt.ex.mlq7ydxlhlsxsc',
              acceptedAnswers: ['Descansa em casa. Melhoras!'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Marcar uma consulta',
        objective: 'Pedir un turno y avisar que estás enfermo.',
        intro: {
          explanation:
            'Una consulta es la «cita» con el médico; «pedir cita» es marcar uma consulta. Por teléfono: eu gostaria de marcar uma consulta. Para avisar: hoje não vou trabalhar, estou doente.',
          examples: [
            { target: 'Eu gostaria de marcar uma consulta.', base: 'Quisiera pedir una cita.' },
            {
              target: 'Já marquei uma consulta para as onze.',
              base: 'Ya pedí cita para las once.',
            },
          ],
        },
        takeaways: ['Pides una cita: marcar uma consulta.', 'Avisas que no vas a trabajar.'],
        exercises: [
          ex.translationChoice(
            'consulta',
            'cita (médica)',
            ['pregunta', 'cuenta', 'receta'],
            ['pt-consulta'],
            { id: 'pt.ex.4eii22per04bz9' },
          ),
          ex.listenChoice(
            'Eu gostaria de marcar uma consulta.',
            [
              'Eu gostaria de marcar um café.',
              'Ela gostaria de marcar uma consulta.',
              'Eu marquei uma consulta.',
            ],
            ['pt-consulta', 'pt-marcar'],
            { id: 'pt.ex.wwqbvnfohbdost' },
          ),
          ex.fillBlank(
            'Eu gostaria de ___ uma consulta para amanhã.',
            'Quisiera pedir una cita para mañana.',
            'marcar',
            ['tomar', 'fazer', 'pegar'],
            ['pt-consulta', 'pt-marcar'],
            { id: 'pt.ex.lfuqa7368qu03v' },
          ),
          question(
            'pt.ex.ws4idt701kpwa7',
            DENTISTA,
            '¿Por qué llama Hugo?',
            'Para pedir cita: le duele mucho una muela',
            ['Para cancelar una cita', 'Para preguntar un precio', 'Para comprar un remedio'],
            ['pt-consulta', 'pt-dente'],
            'Hugo dice: «Eu gostaria de marcar uma consulta. Estou com muita dor de dente».',
          ),
          question(
            'pt.ex.mifdz2loajz8np',
            DENTISTA,
            '¿Para cuándo es la cita?',
            'Para hoy a las cuatro de la tarde',
            ['Para mañana a las cuatro', 'Para hoy a las once', 'Para el lunes'],
            ['pt-consulta'],
            'En la recepción dicen: «Hoje às quatro da tarde está bom para o senhor?».',
          ),
          question(
            'pt.ex.9silfpziao7b1j',
            MENSAGEM,
            '¿Qué le pide Clara a Lu?',
            'Que le avise a la jefa',
            ['Que le compre un remedio', 'Que la lleve al médico', 'Que trabaje por ella'],
            ['pt-consulta'],
            'Clara escribe: «Já marquei uma consulta para as onze. Avisa a chefe, por favor?».',
          ),
          ex.orderWords(
            'Já marquei uma consulta para amanhã.',
            'Ya pedí cita para mañana.',
            ['pt-consulta'],
            { id: 'pt.ex.ipsnxhiafz3qbe' },
          ),
          ex.shortAnswer(
            'Consultório, bom dia!',
            'Consultorio, ¡buenos días! (Pide una cita para mañana.)',
            'Bom dia, eu gostaria de marcar uma consulta para amanhã.',
            [
              'Eu gostaria de marcar uma consulta para amanhã.',
              'Bom dia! Gostaria de marcar uma consulta para amanhã.',
              'Gostaria de marcar uma consulta para amanhã.',
            ],
            ['pt-consulta', 'pt-gostaria-de'],
            { id: 'pt.ex.kb3m06uvmz4v3g' },
          ),
          ex.translateWrite(
            'Hoy no voy a trabajar: me duele la garganta.',
            'Hoje eu não vou trabalhar: estou com dor de garganta.',
            ['pt-dor'],
            {
              id: 'pt.ex.e58d06tp4pwi8j',
              acceptedAnswers: [
                'Hoje não vou trabalhar: estou com dor de garganta.',
                'Hoje eu não vou trabalhar, estou com dor de garganta.',
                'Hoje não vou trabalhar, estou com dor de garganta.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

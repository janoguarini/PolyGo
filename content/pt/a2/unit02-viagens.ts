import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U2 «Viajes» (docs/PT_A1_A2.md): el perfeito de los irregulares más frecuentes (ser / ir:
 * fui, foi; fazer: fiz, fez; ter: tive; estar: estive), conhecer un lugar y el vocabulario del viaje.
 * Falsos amigos: mala es la «valija»; a viagem es femenino.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const FERIAS = dialogue(
  'pt.stim.a2-u2-ferias',
  'Dos amigas se encuentran después de las vacaciones.',
  [
    ['Carol', 'Oi, Bete! Como foram as férias?'],
    ['Bete', 'Maravilhosas! Eu fui para Salvador com o meu namorado.'],
    ['Carol', 'Que legal! Vocês foram de avião?'],
    [
      'Bete',
      'Fomos. O voo foi rápido, só duas horas. Lá a gente conheceu o Pelourinho e foi à praia todo dia.',
    ],
  ],
);

const POSTAL = reading(
  'pt.stim.a2-u2-postal',
  'postcard',
  'Una postal que Bete le manda a su abuela.',
  [
    'Querida vovó,',
    'Estou em Salvador! Ontem eu conheci o centro histórico e comi acarajé.',
    'Fez muito calor, mas eu adorei.',
    'Hoje a gente vai à praia. Beijos!',
  ],
  { from: 'Bete', to: 'Vovó' },
);

const AVISO = dialogue('pt.stim.a2-u2-aviso', 'Un anuncio en el aeropuerto.', [
  [
    'Aeroporto',
    'Atenção, passageiros do voo 302 para Recife: o embarque é no portão 8. Por favor, tenham o passaporte ou a identidade na mão.',
  ],
]);

const MALA = reading(
  'pt.stim.a2-u2-mala',
  'post',
  'Un viajero cuenta un problema en un foro de viajes.',
  [
    'Ontem eu tive um problema no aeroporto de Lisboa.',
    'A minha mala não chegou! Eu estive duas horas no balcão da companhia aérea.',
    'No final, eles acharam a mala e mandaram para o meu hotel.',
    'Dica: leve sempre uma roupa na mochila.',
  ],
  { from: 'Rodrigo', title: 'Mala perdida!' },
);

export const PT_A2_U02: PtUnitDef = {
  names: [
    'Carol',
    'Bete',
    'Salvador',
    'Pelourinho',
    'Vovó',
    'Recife',
    'Lisboa',
    'Rodrigo',
    'Aeroporto',
  ],
  support: [
    'fomos',
    'foram',
    'longa',
    'maravilhosas',
    'namorado',
    'lá',
    'conheceu',
    'táxi',
    'pego',
    'hotel',
    'atenção',
    'passageiros',
    'embarque',
    'portão',
    'tenham',
    'identidade',
    'mão',
    'tomei',
    'querida',
    'histórico',
    'acarajé',
    'adorei',
    'beijos',
    'fotos',
    'problema',
    'teve',
    'chegou',
    'balcão',
    'companhia',
    'aérea',
    'final',
    'acharam',
    'mandaram',
    'dica',
    'leve',
    'roupa',
    'mochila',
    'esteve',
    'vezes',
    'viajo',
    'viajou',
    'conheço',
    'perdida',
  ],
  unit: {
    position: 2,
    title: 'Viajes',
    titleEn: 'Viagens',
    description:
      'El perfeito irregular (fui, foi, fiz, fez, tive, estive), conhecer un lugar, el aeropuerto y el falso amigo mala.',
    emoji: '✈️',
    objective:
      'Puedes contar un viaje (adónde fuiste, qué hiciste, qué conociste), entender un aviso del aeropuerto y explicar un problema de viaje.',
    grammar: {
      title: 'Perfeito irregular: fui, fiz, tive, estive',
      explanation:
        'Ser e ir tienen el mismo pasado: eu fui, você / ele foi, nós fomos, eles foram (fui a Salvador; foi ótimo). Fazer: fiz, fez. Ter: tive, teve. Estar: estive, esteve. Conhecer es «conocer», también un lugar: conheci o Rio.',
      examples: [
        { target: 'Eu fui para Salvador nas férias.', base: 'Fui a Salvador en las vacaciones.' },
        { target: 'A viagem foi ótima.', base: 'El viaje fue buenísimo.' },
        {
          target: 'Ontem eu tive um problema no aeroporto.',
          base: 'Ayer tuve un problema en el aeropuerto.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U2). Sin revisión nativa: revisar el aviso del aeropuerto y el foro de viajes.',
    },
    words: [
      w('pt-fui', 'fui', 'fui', 'Eu fui ao Rio no ano passado.', 'Fui a Río el año pasado.', [
        'past',
      ]),
      w('pt-foi', 'foi', 'fue', 'A viagem foi ótima.', 'El viaje fue buenísimo.', ['past']),
      w('pt-fiz', 'fiz', 'hice', 'Eu fiz muitas fotos.', 'Saqué muchas fotos.', ['past'], {
        acceptedTranslations: ['saqué'],
      }),
      w(
        'pt-fez',
        'fez',
        'hizo / hiciste (con você)',
        'O que você fez nas férias?',
        '¿Qué hiciste en las vacaciones?',
        ['past'],
        {
          acceptedTranslations: ['hizo', 'hiciste'],
        },
      ),
      w(
        'pt-tive',
        'tive',
        'tuve',
        'Tive um problema com a mala.',
        'Tuve un problema con la maleta.',
        ['past'],
      ),
      w(
        'pt-estive',
        'estive',
        'estuve',
        'Eu estive em Recife em julho.',
        'Estuve en Recife en julio.',
        ['past'],
      ),
      w(
        'pt-viagem',
        'viagem',
        'el viaje',
        'A viagem foi longa.',
        'El viaje fue largo.',
        ['travel'],
        { emoji: '🧳' },
      ),
      w('pt-viajei', 'viajei', 'viajé', 'Viajei de avião.', 'Viajé en avión.', ['travel', 'past']),
      w(
        'pt-ferias',
        'férias',
        'vacaciones',
        'Nas férias eu fui à praia.',
        'En las vacaciones fui a la playa.',
        ['travel'],
        {
          emoji: '🏝️',
        },
      ),
      w(
        'pt-aeroporto',
        'aeroporto',
        'aeropuerto',
        'O aeroporto é longe do centro.',
        'El aeropuerto queda lejos del centro.',
        ['travel'],
        {
          emoji: '🛫',
        },
      ),
      w('pt-voo', 'voo', 'vuelo', 'O voo foi rápido.', 'El vuelo fue rápido.', ['travel']),
      w('pt-mala', 'mala', 'maleta', 'A minha mala é azul.', 'Mi maleta es azul.', ['travel'], {
        acceptedTranslations: ['maleta', 'valija'],
        emoji: '🧳',
      }),
      w(
        'pt-passaporte',
        'passaporte',
        'pasaporte',
        'Você tem o passaporte?',
        '¿Tienes el pasaporte?',
        ['travel'],
        {
          emoji: '🛂',
        },
      ),
      w(
        'pt-conheci',
        'conheci',
        'conocí',
        'Conheci o Rio no ano passado.',
        'Conocí Río el año pasado.',
        ['travel', 'past'],
      ),
      w(
        'pt-ano-passado',
        'ano passado',
        'el año pasado',
        'No ano passado eu viajei muito.',
        'El año pasado viajé mucho.',
        ['time'],
        {
          acceptedTexts: ['o ano passado'],
          acceptedTranslations: ['año pasado'],
        },
      ),
      w(
        'pt-peguei',
        'peguei',
        'agarré / tomé (un transporte)',
        'Peguei um táxi para o hotel.',
        'Tomé un taxi al hotel.',
        ['travel', 'past'],
        {
          acceptedTranslations: ['agarré'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Fui para Salvador',
        objective: 'Contar adónde fuiste y cómo fue con fui y foi.',
        intro: {
          explanation:
            'Ir y ser comparten el pasado: eu fui, você / ele foi, nós fomos, eles foram. Fui para Salvador («fui a Salvador») y a viagem foi ótima («el viaje fue buenísimo»). Ojo: a viagem es femenino.',
          examples: [
            {
              target: 'Nas férias eu fui para Salvador.',
              base: 'En las vacaciones fui a Salvador.',
            },
            { target: 'Como foi a viagem?', base: '¿Cómo fue el viaje?' },
          ],
        },
        takeaways: ['Cuentas adónde fuiste: fui para…', 'Dices cómo fue: foi ótimo.'],
        exercises: [
          ex.translationChoice(
            'férias',
            'vacaciones',
            ['feriado', 'fiesta', 'viaje'],
            ['pt-ferias'],
            { id: 'pt.ex.08ml2sfys6hqa8' },
          ),
          ex.translationChoice(
            'viagem',
            'viaje',
            ['maleta', 'vuelo', 'vacaciones'],
            ['pt-viagem'],
            { id: 'pt.ex.ovrkukhopa992i' },
          ),
          ex.listenChoice(
            'Eu fui para Salvador.',
            ['Ele foi para Salvador.', 'Eu vou para Salvador.', 'Eu fui para Recife.'],
            ['pt-fui'],
            { id: 'pt.ex.ytbuirmk79u6yv' },
          ),
          ex.fillBlank(
            'Nas férias eu ___ para o Rio.',
            'En las vacaciones fui a Río.',
            'fui',
            ['foi', 'vou', 'fomos'],
            ['pt-fui', 'pt-ferias'],
            { id: 'pt.ex.93gxh4msbhry75' },
          ),
          ex.fillBlank(
            'A viagem ___ ótima!',
            '¡El viaje fue buenísimo!',
            'foi',
            ['fui', 'é', 'foram'],
            ['pt-foi', 'pt-viagem'],
            { id: 'pt.ex.jb2ui2vam9xrua', explanation: 'Ser en pasado, con ela: foi.' },
          ),
          ex.fillBlank(
            'A ___ foi longa, mas legal.',
            'El viaje fue largo, pero lindo.',
            'viagem',
            ['férias', 'foi', 'fui'],
            ['pt-viagem'],
            {
              id: 'pt.ex.c7zrc96c5da28j',
              skill: 'vocabulary',
              explanation: 'A viagem es femenino en portugués.',
            },
          ),
          question(
            'pt.ex.e812w39rhege0k',
            FERIAS,
            '¿Adónde fue Bete en las vacaciones?',
            'A Salvador, con su novio',
            ['A Recife, con su familia', 'A Salvador, sola', 'A Río, con Carol'],
            ['pt-fui', 'pt-ferias', 'pt-voo'],
            'Bete dice: «Eu fui para Salvador com o meu namorado».',
          ),
          ex.orderWords(
            'Como foram as suas férias?',
            '¿Cómo fueron tus vacaciones?',
            ['pt-ferias', 'pt-foi'],
            {
              id: 'pt.ex.2f22lu9kimvuxt',
            },
          ),
          ex.shortAnswer(
            'Como foi a viagem? (😀)',
            '¿Cómo fue el viaje? (Responde que fue buenísimo.)',
            'Foi ótima!',
            [
              'Foi ótima.',
              'A viagem foi ótima!',
              'A viagem foi ótima.',
              'Foi muito boa!',
              'Foi muito boa.',
            ],
            ['pt-foi', 'pt-viagem'],
            { id: 'pt.ex.t7dss70bn5nwij' },
          ),
          ex.translateWrite(
            'En las vacaciones fui a Río.',
            'Nas férias eu fui para o Rio.',
            ['pt-ferias'],
            {
              id: 'pt.ex.6i4v1j5r5sif1b',
              acceptedAnswers: [
                'Nas férias fui para o Rio.',
                'Nas férias eu fui ao Rio.',
                'Nas férias fui ao Rio.',
                'Nas férias eu fui pro Rio.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'No aeroporto',
        objective: 'Moverte en el aeropuerto.',
        intro: {
          explanation:
            'En el aeropuerto: o voo (el vuelo), o passaporte, a mala. Falso amigo: mala es la «maleta», no algo malo. Pegar un transporte es «tomarlo»: peguei um táxi.',
          examples: [
            { target: 'A minha mala é azul.', base: 'Mi maleta es azul.' },
            { target: 'Peguei um táxi para o aeroporto.', base: 'Tomé un taxi al aeropuerto.' },
          ],
        },
        takeaways: ['Nombras lo que llevas a un viaje.', 'Sabes que mala es «maleta».'],
        exercises: [
          ex.translationChoice(
            'mala',
            'maleta',
            ['mala (adjetivo)', 'mochila', 'cartera'],
            ['pt-mala'],
            {
              id: 'pt.ex.8lrb22ge78y8zx',
              explanation: 'Falso amigo: mala es la maleta.',
            },
          ),
          ex.imageChoice('🛂', 'passaporte', ['mala', 'voo', 'aeroporto'], ['pt-passaporte'], {
            id: 'pt.ex.on12qn2c6tgfq8',
          }),
          ex.imageChoice('🛫', 'aeroporto', ['viagem', 'passaporte', 'estação'], ['pt-aeroporto'], {
            id: 'pt.ex.6a61mfw1zx9u92',
          }),
          ex.translationChoice('voo', 'vuelo', ['viaje', 'avión', 'maleta'], ['pt-voo'], {
            id: 'pt.ex.vphx4g4bh5x2ob',
          }),
          ex.listenChoice(
            'Peguei um táxi para o aeroporto.',
            [
              'Peguei um ônibus para o aeroporto.',
              'Pego um táxi para o aeroporto.',
              'Peguei um táxi para o hotel.',
            ],
            ['pt-peguei', 'pt-aeroporto'],
            { id: 'pt.ex.p4gkbory849rwo' },
          ),
          question(
            'pt.ex.mpiusc2ah52ick',
            AVISO,
            '¿A quiénes habla el anuncio?',
            'A los pasajeros del vuelo a Recife',
            [
              'A los pasajeros que llegan de Recife',
              'A los que perdieron una maleta',
              'A los empleados del aeropuerto',
            ],
            ['pt-voo'],
            'El anuncio dice: «passageiros do voo 302 para Recife».',
          ),
          question(
            'pt.ex.a6sn6nknbyu0bj',
            AVISO,
            '¿Qué tienen que tener en la mano?',
            'El pasaporte o el documento',
            ['El pasaje impreso', 'La maleta', 'El celular'],
            ['pt-passaporte'],
            'Dice: «tenham o passaporte ou a identidade na mão».',
          ),
          ex.fillBlank(
            'Eu ___ um táxi para o hotel.',
            'Tomé un taxi al hotel.',
            'peguei',
            ['tomei', 'pego', 'fui'],
            ['pt-peguei'],
            {
              id: 'pt.ex.vx2apol6n6q98w',
              explanation: 'Un transporte se «agarra»: pegar → peguei.',
            },
          ),
          ex.shortAnswer(
            'Você tem o passaporte?',
            '¿Tienes el pasaporte? (Responde que sí, que está en la maleta.)',
            'Sim, está na mala.',
            [
              'Tenho, está na mala.',
              'Sim, o passaporte está na mala.',
              'Sim, está na minha mala.',
              'Tenho. Está na mala.',
            ],
            ['pt-passaporte', 'pt-mala'],
            { id: 'pt.ex.26euil7oo6moub' },
          ),
          ex.translateWrite('Mi maleta es azul.', 'A minha mala é azul.', ['pt-mala'], {
            id: 'pt.ex.xvborg2w9oi5ik',
            acceptedAnswers: ['Minha mala é azul.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'O que você fez?',
        objective: 'Contar qué hiciste con fiz y fez.',
        intro: {
          explanation:
            'Fazer en pasado: eu fiz, você / ele fez, nós fizemos, eles fizeram. O que você fez? es «¿qué hiciste?». Fazer fotos (o tirar fotos) es «sacar fotos».',
          examples: [
            { target: 'O que você fez nas férias?', base: '¿Qué hiciste en las vacaciones?' },
            { target: 'Eu fiz muitas fotos.', base: 'Saqué muchas fotos.' },
          ],
        },
        takeaways: ['Preguntas o que você fez?', 'Cuentas qué hiciste con fiz.'],
        exercises: [
          ex.translationChoice(
            'fiz',
            'hice',
            ['hizo / hiciste (con você)', 'hago', 'fui'],
            ['pt-fiz'],
            { id: 'pt.ex.n0iuzei16wsf7s' },
          ),
          ex.listenChoice(
            'O que você fez ontem?',
            ['O que você faz hoje?', 'O que ele fez ontem?', 'O que vocês fizeram ontem?'],
            ['pt-fez', 'pt-ontem'],
            { id: 'pt.ex.752o54i622zloj' },
          ),
          ex.fillBlank(
            'Ontem eu ___ o jantar.',
            'Ayer hice la cena.',
            'fiz',
            ['fez', 'faço', 'fazer'],
            ['pt-fiz'],
            { id: 'pt.ex.p915060tvjnhza', explanation: 'Fazer en pasado, con eu: fiz.' },
          ),
          ex.fillBlank(
            'O que a Bete ___ em Salvador?',
            '¿Qué hizo Bete en Salvador?',
            'fez',
            ['fiz', 'faz', 'foi'],
            ['pt-fez'],
            { id: 'pt.ex.rn23iprhlk2pvc' },
          ),
          ex.matchPairs(
            [
              ['fez', 'hizo'],
              ['fiz', 'hice'],
              ['tive', 'tuve'],
              ['estive', 'estuve'],
            ],
            ['pt-fez', 'pt-fiz', 'pt-tive', 'pt-estive'],
            { id: 'pt.ex.vg1a9a8wvsn7zc' },
          ),
          question(
            'pt.ex.9u6e8hq4q5b9hx',
            FERIAS,
            '¿Qué hicieron Bete y su novio en Salvador?',
            'Conocieron el Pelourinho y fueron a la playa todos los días',
            ['Fueron a la playa una vez', 'Se quedaron en el hotel', 'Conocieron Recife'],
            ['pt-conheci', 'pt-foi'],
            'Bete cuenta: «a gente conheceu o Pelourinho e foi à praia todo dia».',
          ),
          question(
            'pt.ex.nrfo7bucvnwr2l',
            POSTAL,
            '¿Qué hizo Bete ayer?',
            'Conoció el centro histórico y comió acarajé',
            ['Fue a la playa', 'Visitó a su abuela', 'Tomó un vuelo'],
            ['pt-conheci', 'pt-comi'],
            'La postal dice: «Ontem eu conheci o centro histórico e comi acarajé».',
          ),
          ex.orderWords(
            'Eu fiz muitas fotos na viagem.',
            'Saqué muchas fotos en el viaje.',
            ['pt-fiz', 'pt-viagem'],
            {
              id: 'pt.ex.am2fwoxdthwk6w',
            },
          ),
          ex.shortAnswer(
            'O que você fez no sábado? (o jantar)',
            '¿Qué hiciste el sábado? (Responde que hiciste la cena.)',
            'Eu fiz o jantar.',
            ['Fiz o jantar.', 'No sábado eu fiz o jantar.', 'No sábado fiz o jantar.'],
            ['pt-fiz'],
            { id: 'pt.ex.rh6vq65mdl3icg' },
          ),
          ex.translateWrite(
            '¿Qué hiciste en las vacaciones?',
            'O que você fez nas férias?',
            ['pt-fez', 'pt-ferias'],
            {
              id: 'pt.ex.xr6c5oeq2ppm5d',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Tive um problema',
        objective: 'Contar un problema de viaje con tive y estive.',
        intro: {
          explanation:
            'Ter en pasado: eu tive, ele teve («tuve un problema»). Estar en pasado: eu estive, ele esteve («estuve en Recife»). Estive sirve para decir en qué lugares estuviste.',
          examples: [
            { target: 'Eu tive um problema com a mala.', base: 'Tuve un problema con la maleta.' },
            { target: 'Já estive em Recife duas vezes.', base: 'Ya estuve en Recife dos veces.' },
          ],
        },
        takeaways: ['Cuentas un problema con tive.', 'Dices dónde estuviste con estive.'],
        exercises: [
          ex.translationChoice('estive', 'estuve', ['tuve', 'estoy', 'fui'], ['pt-estive'], {
            id: 'pt.ex.y8lvj2wn1hjd01',
          }),
          ex.fillBlank(
            'Ontem eu ___ um problema no aeroporto.',
            'Ayer tuve un problema en el aeropuerto.',
            'tive',
            ['tenho', 'teve', 'estive'],
            ['pt-tive', 'pt-aeroporto'],
            { id: 'pt.ex.ec8yiivbmb87yv' },
          ),
          ex.fillBlank(
            'Eu já ___ em Recife.',
            'Ya estuve en Recife.',
            'estive',
            ['tive', 'estou', 'fiz'],
            ['pt-estive', 'pt-ja'],
            { id: 'pt.ex.a9wdd0z37pbpj9', explanation: 'Estar en un lugar, en pasado: estive.' },
          ),
          ex.listenChoice(
            'Eu tive um problema com a mala.',
            [
              'Ele teve um problema com a mala.',
              'Eu tenho um problema com a mala.',
              'Eu tive um problema com o voo.',
            ],
            ['pt-tive', 'pt-mala'],
            { id: 'pt.ex.w9u8stygvq7awx' },
          ),
          question(
            'pt.ex.hozuya7ak1pweh',
            MALA,
            '¿Qué problema tuvo Rodrigo?',
            'Su maleta no llegó',
            ['Perdió el vuelo', 'Perdió el pasaporte', 'El hotel estaba cerrado'],
            ['pt-tive', 'pt-mala'],
            'Rodrigo escribe: «A minha mala não chegou!».',
          ),
          question(
            'pt.ex.kv90uxvw2g6kfg',
            MALA,
            '¿Cómo terminó el problema?',
            'Encontraron la maleta y la mandaron al hotel',
            [
              'Nunca encontraron la maleta',
              'Rodrigo volvió al aeropuerto al otro día',
              'La compañía le dio otra maleta',
            ],
            ['pt-mala'],
            'Dice: «eles acharam a mala e mandaram para o meu hotel».',
          ),
          question(
            'pt.ex.ixm9483vnzpcmb',
            MALA,
            '¿Qué consejo da Rodrigo?',
            'Llevar siempre ropa en la mochila',
            ['Llegar dos horas antes', 'Viajar sin maleta', 'Llevar el pasaporte en la mano'],
            ['pt-mala'],
            'Su consejo: «leve sempre uma roupa na mochila».',
          ),
          ex.orderWords(
            'Eu estive duas horas no aeroporto.',
            'Estuve dos horas en el aeropuerto.',
            ['pt-estive', 'pt-aeroporto'],
            {
              id: 'pt.ex.3vqcuylzaa1r6q',
            },
          ),
          ex.shortAnswer(
            'Você já esteve em Salvador?',
            '¿Ya estuviste en Salvador? (Responde que sí, el año pasado.)',
            'Sim, eu estive em Salvador no ano passado.',
            [
              'Sim, estive lá no ano passado.',
              'Já, no ano passado.',
              'Sim, no ano passado.',
              'Estive, no ano passado.',
            ],
            ['pt-estive', 'pt-ano-passado'],
            { id: 'pt.ex.qdlm9ewkgml6l6' },
          ),
          ex.translateWrite(
            'Tuve un problema con el pasaporte.',
            'Eu tive um problema com o passaporte.',
            ['pt-tive'],
            {
              id: 'pt.ex.4l3irefii1bwch',
              acceptedAnswers: ['Tive um problema com o passaporte.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Conheci o Rio',
        objective: 'Contar un viaje completo.',
        intro: {
          explanation:
            'Conhecer un lugar es visitarlo por primera vez: conheci o Rio no ano passado. Viajar en pasado: eu viajei, ele viajou. Para ordenar el relato: primeiro… depois…',
          examples: [
            {
              target: 'No ano passado eu viajei para o Brasil.',
              base: 'El año pasado viajé a Brasil.',
            },
            { target: 'Lá eu conheci o Rio e Salvador.', base: 'Allá conocí Río y Salvador.' },
          ],
        },
        takeaways: ['Cuentas un viaje: viajei, conheci, fui.', 'Ubicas el viaje: no ano passado.'],
        exercises: [
          ex.translationChoice(
            'conheci',
            'conocí',
            ['conozco', 'conoció', 'viajé'],
            ['pt-conheci'],
            { id: 'pt.ex.og322sbn75loj8' },
          ),
          ex.fillBlank(
            'No ano passado eu ___ para Recife.',
            'El año pasado viajé a Recife.',
            'viajei',
            ['viajo', 'viajou', 'viagem'],
            ['pt-viajei', 'pt-ano-passado'],
            { id: 'pt.ex.66kuut3o4843cw' },
          ),
          ex.fillBlank(
            'Na viagem eu ___ o centro histórico.',
            'En el viaje conocí el centro histórico.',
            'conheci',
            ['conheço', 'conheceu', 'fiz'],
            ['pt-conheci'],
            { id: 'pt.ex.abbq32jrgoq4mj' },
          ),
          ex.listenChoice(
            'No ano passado eu viajei muito.',
            [
              'Na semana passada eu viajei muito.',
              'No ano passado eu trabalhei muito.',
              'No ano passado ele viajou muito.',
            ],
            ['pt-ano-passado', 'pt-viajei'],
            { id: 'pt.ex.i7cu89r1cqsfa4' },
          ),
          question(
            'pt.ex.6zeraiksgyteyv',
            POSTAL,
            '¿Cómo estuvo el tiempo?',
            'Hizo mucho calor, pero a Bete le encantó',
            ['Llovió todo el día', 'Hizo frío', 'Hizo calor y no le gustó'],
            ['pt-viagem'],
            'La postal dice: «Fez muito calor, mas eu adorei».',
          ),
          question(
            'pt.ex.evvozlo4xf14k0',
            FERIAS,
            '¿Cómo fue el vuelo?',
            'Rápido: solo dos horas',
            ['Largo: diez horas', 'Tuvo un problema', 'Fueron en autobús'],
            ['pt-voo', 'pt-foi'],
            'Bete dice: «O voo foi rápido, só duas horas».',
          ),
          ex.orderWords(
            'Eu conheci Salvador no ano passado.',
            'Conocí Salvador el año pasado.',
            ['pt-conheci', 'pt-ano-passado'],
            {
              id: 'pt.ex.b09zwumr62kkom',
            },
          ),
          ex.shortAnswer(
            'Para onde você viajou no ano passado? (Recife)',
            '¿Adónde viajaste el año pasado? (Responde que a Recife.)',
            'Eu viajei para Recife.',
            [
              'Viajei para Recife.',
              'Para Recife.',
              'No ano passado eu viajei para Recife.',
              'Fui para Recife.',
            ],
            ['pt-viajei'],
            { id: 'pt.ex.b3i1if3ipyyr1b' },
          ),
          ex.translateWrite(
            'El año pasado conocí Salvador.',
            'No ano passado eu conheci Salvador.',
            ['pt-ano-passado', 'pt-conheci'],
            {
              id: 'pt.ex.ifq0b3ulsx016x',
              acceptedAnswers: [
                'No ano passado conheci Salvador.',
                'Ano passado eu conheci Salvador.',
                'Eu conheci Salvador no ano passado.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

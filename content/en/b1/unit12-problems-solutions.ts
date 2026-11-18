import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U12 «Problemas y soluciones» (docs/B1_EN.md): deducir con must be, might be y can't be; cosas que
 * se rompen o se acaban (break down, run out of, fix, replace); reclamos (complaint, refund, receipt);
 * conectores de causa, consecuencia y contraste (because of, therefore, although, however); resolver
 * problemas (sort out, solution). Cierra el B1 repasando los dos condicionales.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const KEYS = dialogue(
  'en.stim.b1-u12-keys',
  'Dos compañeros encuentran unas llaves en la oficina.',
  [
    ['Emma', 'Whose keys are these? They were on my desk.'],
    ['Leo', "They can't be mine. I have mine here."],
    ['Emma', 'They must be Tom’s. He sits next to me.'],
    ['Leo', "They might be the manager's. She was here this morning."],
  ],
);

const CAR = dialogue('en.stim.b1-u12-car', 'Ben llama a Lucy desde la ruta.', [
  ['Ben', "Lucy, I'm going to be late. My car has broken down."],
  ['Lucy', 'Oh no! Have you run out of gas again?'],
  ['Ben', 'No, I have plenty of gas. It must be the battery.'],
  ['Lucy', "Call the mechanic. I'm sure he can fix it."],
]);

const COMPLAINT = reading(
  'en.stim.b1-u12-complaint',
  'email',
  'Kate escribe a una tienda para reclamar.',
  [
    'Dear Sir or Madam,',
    'I bought some headphones from your website on May 3rd. They were expensive, but they stopped working after a week.',
    'I would like a refund, or could you replace them, please? I have attached the receipt.',
    'I look forward to hearing from you.',
    'Kate Brown',
  ],
  { from: 'Kate Brown', title: 'Complaint: broken headphones' },
);

const STORM = reading(
  'en.stim.b1-u12-storm',
  'notice',
  'Un aviso en la estación de tren.',
  [
    'Because of the storm, all trains to the coast are canceled today.',
    'However, there are extra buses every hour from the main entrance.',
    'Tickets for today can be used on the buses. Therefore, you do not need to buy a new ticket.',
    'We are sorry for any problems.',
  ],
  { title: 'Important information' },
);

export const EN_B1_U12: B1UnitDef = {
  names: ['Emma', 'Leo', 'Tom', 'Ben', 'Lucy', 'Kate', 'Brown'],
  support: [
    'whose',
    'desk',
    'mine',
    'gas',
    'plenty',
    'mechanic',
    'headphones',
    'attached',
    'rd',
    'coast',
    'extra',
    'entrance',
    'information',
    'heating',
  ],
  unit: {
    position: 12,
    title: 'Problemas y soluciones',
    titleEn: 'Problems and solutions',
    description:
      "Deducir qué pasa (must be, can't be), cosas que se rompen, reclamos, causas y contrastes (because of, although, however) y soluciones.",
    emoji: '🛠️',
    objective:
      'Podés explicar un problema, sacar conclusiones, hacer un reclamo formal y proponer una solución.',
    grammar: {
      title: 'Deducción y conectores',
      explanation:
        "Must be: estás casi seguro de que es así; can't be: estás casi seguro de que no; might be: es posible. Conectores: because of + sustantivo (causa), therefore (consecuencia), although + oración y however al empezar otra oración (contraste).",
      examples: [
        {
          target: "They can't be mine. They must be Tom's.",
          base: 'No pueden ser mías. Deben ser de Tom.',
        },
        {
          target: 'Because of the storm, the trains are canceled.',
          base: 'Por la tormenta, los trenes están cancelados.',
        },
        {
          target: 'Although it was expensive, it broke after a week.',
          base: 'Aunque era caro, se rompió a la semana.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-must-be',
        'must be',
        'debe ser / seguro que es',
        '/ˈmʌst bi/',
        undefined,
        'You must be tired after the trip.',
        'Debés estar cansado después del viaje.',
        ['deduction', 'modals'],
        ['debe ser', 'seguro que es', 'debe estar'],
      ),
      w(
        'en-cant-be',
        "can't be",
        'no puede ser',
        '/ˈkænt bi/',
        undefined,
        "That can't be true!",
        '¡Eso no puede ser cierto!',
        ['deduction', 'modals'],
        ['no puede estar'],
      ),
      w(
        'en-problem',
        'problem',
        'problema',
        '/ˈprɑbləm/',
        undefined,
        'We have a problem with the heating.',
        'Tenemos un problema con la calefacción.',
        ['problems'],
      ),
      w(
        'en-solution',
        'solution',
        'solución',
        '/səˈluʃən/',
        '💡',
        'There is a solution for every problem.',
        'Hay una solución para cada problema.',
        ['problems'],
      ),
      w(
        'en-break-down',
        'break down',
        'romperse / descomponerse (una máquina)',
        '/ˈbreɪk ˈdaʊn/',
        '🚗',
        'My car broke down on the road.',
        'Se me rompió el auto en la ruta.',
        ['problems', 'phrasal-verbs'],
        ['romperse', 'descomponerse'],
      ),
      w(
        'en-run-out-of',
        'run out of',
        'quedarse sin',
        '/ˈrʌn ˈaʊt əv/',
        undefined,
        'We have run out of milk.',
        'Nos quedamos sin leche.',
        ['problems', 'phrasal-verbs'],
      ),
      w(
        'en-fix',
        'fix',
        'arreglar / reparar',
        '/fɪks/',
        '🔧',
        'Can you fix my bike?',
        '¿Podés arreglar mi bici?',
        ['problems', 'verbs'],
        ['arreglar', 'reparar'],
      ),
      w(
        'en-replace',
        'replace',
        'reemplazar / cambiar',
        '/rɪˈpleɪs/',
        undefined,
        'We need to replace the battery.',
        'Tenemos que cambiar la batería.',
        ['problems', 'verbs'],
        ['reemplazar', 'cambiar'],
      ),
      w(
        'en-sort-out',
        'sort out',
        'resolver / solucionar',
        '/ˈsɔrt ˈaʊt/',
        undefined,
        "Don't worry, we'll sort it out.",
        'No te preocupes, lo vamos a resolver.',
        ['problems', 'phrasal-verbs'],
        ['resolver', 'solucionar'],
      ),
      w(
        'en-complain',
        'complain',
        'quejarse / reclamar',
        '/kəmˈpleɪn/',
        '😠',
        'He complained about the noise.',
        'Se quejó por el ruido.',
        ['problems', 'verbs'],
        ['quejarse', 'reclamar'],
      ),
      w(
        'en-complaint',
        'complaint',
        'queja / reclamo',
        '/kəmˈpleɪnt/',
        undefined,
        'I would like to make a complaint.',
        'Quisiera hacer un reclamo.',
        ['problems'],
        ['queja', 'reclamo'],
      ),
      w(
        'en-refund',
        'refund',
        'reembolso / devolución (del dinero)',
        '/ˈriˌfʌnd/',
        '💸',
        'Can I have a refund, please?',
        '¿Me pueden devolver el dinero, por favor?',
        ['problems', 'shopping'],
        ['reembolso', 'devolución'],
      ),
      w(
        'en-receipt',
        'receipt',
        'ticket / recibo',
        '/rɪˈsit/',
        '🧾',
        'Do you have the receipt?',
        '¿Tiene el ticket?',
        ['problems', 'shopping'],
        ['recibo', 'comprobante'],
      ),
      w(
        'en-because-of',
        'because of',
        'por / a causa de',
        '/bɪˈkɔz əv/',
        undefined,
        'The flight was late because of the snow.',
        'El vuelo se atrasó por la nieve.',
        ['connectors'],
        ['a causa de', 'debido a'],
      ),
      w(
        'en-therefore',
        'therefore',
        'por lo tanto',
        '/ˈðɛrˌfɔr/',
        undefined,
        'It is late. Therefore, the shops are closed.',
        'Es tarde. Por lo tanto, los negocios están cerrados.',
        ['connectors'],
        ['por eso', 'por consiguiente'],
      ),
      w(
        'en-although',
        'although',
        'aunque',
        '/ɔlˈðoʊ/',
        undefined,
        'Although it was cold, we went to the beach.',
        'Aunque hacía frío, fuimos a la playa.',
        ['connectors'],
      ),
      w(
        'en-however',
        'however',
        'sin embargo',
        '/haʊˈɛvər/',
        undefined,
        'The hotel was nice. However, it was expensive.',
        'El hotel era lindo. Sin embargo, era caro.',
        ['connectors'],
        ['no obstante'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Debe ser…',
        objective: "Sacar conclusiones con must be, might be y can't be.",
        intro: {
          explanation:
            "Para deducir: must be (estás casi seguro de que sí), might be (es posible) y can't be (estás casi seguro de que no). You must be tired = seguro que estás cansado. That can't be true = eso no puede ser cierto.",
          examples: [
            {
              target: 'You must be tired after the trip.',
              base: 'Debés estar cansado después del viaje.',
            },
            { target: "That can't be true!", base: '¡Eso no puede ser cierto!' },
          ],
        },
        takeaways: [
          "Sacás conclusiones con must be y can't be.",
          'Decís lo que es posible con might be.',
        ],
        exercises: [
          ex.fillBlank(
            'You worked all day. You ___ be tired.',
            'Trabajaste todo el día. Debés estar cansado.',
            'must',
            ["can't", 'should', 'have to'],
            ['en-must-be', 'en-tired'],
            {
              id: 'en.ex.oklnlxw6m2a5lu',
              explanation: 'Must be: casi seguro de que sí (por lo que sabés).',
            },
          ),
          ex.fillBlank(
            'She is in Spain this week. That ___ be her in the street.',
            'Esta semana está en España. No puede ser ella la de la calle.',
            "can't",
            ['must', 'might', 'should'],
            ['en-cant-be'],
            {
              id: 'en.ex.svdaa28jwls0r3',
              explanation: "Can't be: casi seguro de que no.",
            },
          ),
          ex.fillBlank(
            "I'm not sure where Tom is. He ___ be at the gym.",
            'No sé dónde está Tom. Puede que esté en el gimnasio.',
            'might',
            ["can't", 'must', 'does'],
            ['en-might', 'en-gym'],
            { id: 'en.ex.0pqro5djkr0k1r' },
          ),
          question(
            'en.ex.oxu3p5wbmyhkpz',
            KEYS,
            '¿Por qué Leo dice que las llaves no son suyas?',
            'Porque tiene las suyas con él',
            ['Porque no tiene llaves', 'Porque son de Emma', 'Porque son de otro color'],
            ['en-cant-be'],
            "Leo dice: «They can't be mine. I have mine here».",
          ),
          question(
            'en.ex.keyeoj71a191o8',
            KEYS,
            '¿De quién cree Emma que son las llaves?',
            'De Tom, que se sienta al lado',
            ['De la gerente', 'De Leo', 'De ella'],
            ['en-must-be'],
            'Emma dice: «They must be Tom’s. He sits next to me».',
          ),
          ex.listenChoice(
            "That can't be true!",
            ['That must be true!', "That can't be you!", "This can't be true!"],
            ['en-cant-be'],
            { id: 'en.ex.w99melfchvk0so' },
          ),
          ex.orderWords(
            'You must be very happy.',
            'Debés estar muy contento.',
            ['en-must-be', 'en-happy'],
            { id: 'en.ex.o6th0270c2ybzi' },
          ),
          ex.shortAnswer(
            'Whose phone is this? (seguro que es de Ana)',
            '¿De quién es este teléfono?',
            "It must be Ana's.",
            ["It must be Ana's phone.", "It's Ana's.", "Ana's."],
            ['en-must-be'],
            { id: 'en.ex.t1gsqdduym6sda' },
          ),
          ex.translateWrite('¡Eso no puede ser cierto!', "That can't be true!", ['en-cant-be'], {
            id: 'en.ex.04pvv4ujz67woj',
            acceptedAnswers: ['That cannot be true!', "It can't be true!"],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Se rompió',
        objective: 'Explicar que algo se rompió o se acabó y pedir que lo arreglen.',
        intro: {
          explanation:
            'Break down es romperse una máquina (un auto, una heladera): My car has broken down. Run out of es quedarse sin algo: We have run out of milk. Fix es arreglar y replace, reemplazar.',
          examples: [
            { target: 'My car has broken down.', base: 'Se me rompió el auto.' },
            { target: 'We have run out of milk.', base: 'Nos quedamos sin leche.' },
          ],
        },
        takeaways: [
          'Explicás que algo se rompió o se acabó.',
          'Pedís que lo arreglen o lo cambien: fix, replace.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['break down', 'romperse / descomponerse (una máquina)'],
              ['run out of', 'quedarse sin'],
              ['fix', 'arreglar / reparar'],
              ['replace', 'reemplazar / cambiar'],
            ],
            ['en-break-down', 'en-run-out-of', 'en-fix', 'en-replace'],
            { id: 'en.ex.8w2p18v8aqfsnb' },
          ),
          ex.imageChoice('🔧', 'fix', ['replace', 'break down', 'run out of'], ['en-fix'], {
            id: 'en.ex.qcbr1pl72w889t',
          }),
          ex.fillBlank(
            'My car has broken ___ again.',
            'Se me rompió el auto otra vez.',
            'down',
            ['up', 'out', 'off'],
            ['en-break-down', 'en-car'],
            { id: 'en.ex.bx15oj58hfkq8w', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'We have run out ___ coffee.',
            'Nos quedamos sin café.',
            'of',
            ['from', 'for', 'with'],
            ['en-run-out-of', 'en-coffee'],
            { id: 'en.ex.zrxhe3btwhn4fk', skill: 'vocabulary' },
          ),
          question(
            'en.ex.bbfa3r9b9of8tb',
            CAR,
            '¿Qué le pasó a Ben?',
            'Se le rompió el auto',
            ['Se quedó sin nafta', 'Perdió el tren', 'Tuvo un accidente'],
            ['en-break-down'],
            'Ben dice: «My car has broken down».',
          ),
          question(
            'en.ex.b60367na275qf8',
            CAR,
            '¿Cuál cree Ben que es el problema?',
            'La batería',
            ['La nafta', 'Las ruedas', 'El motor'],
            ['en-must-be', 'en-problem'],
            'Ben dice: «I have plenty of gas. It must be the battery».',
          ),
          ex.listenChoice(
            'We need to replace the battery.',
            [
              'We need to replace the screen.',
              'We need to charge the battery.',
              'You need to replace the battery.',
            ],
            ['en-replace', 'en-battery'],
            { id: 'en.ex.7rn7zftwe8rruj' },
          ),
          ex.translateWrite(
            '¿Podés arreglar mi bici?',
            'Can you fix my bike?',
            ['en-fix', 'en-bike'],
            {
              id: 'en.ex.5hxvncc8070w8l',
              acceptedAnswers: [
                'Could you fix my bike?',
                'Can you fix my bicycle?',
                'Could you fix my bicycle?',
              ],
            },
          ),
          ex.translateWrite(
            'Nos quedamos sin leche.',
            'We have run out of milk.',
            ['en-run-out-of', 'en-milk'],
            {
              id: 'en.ex.dhsoglq7y7x25h',
              acceptedAnswers: ["We've run out of milk.", 'We ran out of milk.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Hacer un reclamo',
        objective: 'Reclamar con cortesía y pedir un reembolso o un cambio.',
        intro: {
          explanation:
            'Complain es quejarse y a complaint, un reclamo. Para reclamar con cortesía: I would like to make a complaint. Could you replace it? I would like a refund (que te devuelvan el dinero). The receipt es el ticket.',
          examples: [
            { target: 'I would like to make a complaint.', base: 'Quisiera hacer un reclamo.' },
            {
              target: 'Can I have a refund, please?',
              base: '¿Me pueden devolver el dinero, por favor?',
            },
          ],
        },
        takeaways: [
          'Hacés un reclamo con cortesía.',
          'Pedís un reembolso o un cambio y mostrás el ticket.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['complaint', 'queja / reclamo'],
              ['refund', 'reembolso / devolución (del dinero)'],
              ['receipt', 'ticket / recibo'],
              ['complain', 'quejarse / reclamar'],
            ],
            ['en-complaint', 'en-refund', 'en-receipt', 'en-complain'],
            { id: 'en.ex.palo07xumy7n0q' },
          ),
          ex.fillBlank(
            'I would like to make a ___.',
            'Quisiera hacer un reclamo.',
            'complaint',
            ['complain', 'receipt', 'problem'],
            ['en-complaint'],
            {
              id: 'en.ex.7rc94b948c30bp',
              skill: 'vocabulary',
              explanation:
                'Complaint es el sustantivo (un reclamo); complain, el verbo (quejarse).',
            },
          ),
          ex.fillBlank(
            'Do you have the ___? — Yes, here it is.',
            '¿Tiene el ticket? — Sí, acá está.',
            'receipt',
            ['refund', 'complaint', 'problem'],
            ['en-receipt'],
            { id: 'en.ex.heuvravmoy3rsr', skill: 'vocabulary' },
          ),
          question(
            'en.ex.xdyvijgy85lpvy',
            COMPLAINT,
            '¿Qué problema tienen los auriculares de Kate?',
            'Dejaron de funcionar a la semana',
            ['Llegaron rotos', 'Eran del color equivocado', 'Nunca llegaron'],
            ['en-complaint'],
            'Kate escribe: «they stopped working after a week».',
          ),
          question(
            'en.ex.3mw6a7e34hg3qe',
            COMPLAINT,
            '¿Qué pide Kate?',
            'Que le devuelvan el dinero o que se los cambien',
            ['Unos auriculares más caros', 'Que la llamen', 'Un descuento'],
            ['en-refund', 'en-replace'],
            'Kate escribe: «I would like a refund, or could you replace them, please?».',
          ),
          ex.listenChoice(
            'He complained about the noise.',
            [
              'He complained about the food.',
              'She complained about the noise.',
              'He complains about the noise.',
            ],
            ['en-complain', 'en-noise'],
            { id: 'en.ex.uz5byy2vz5o017' },
          ),
          ex.orderWords(
            'Can I have a refund please?',
            '¿Me pueden devolver el dinero, por favor?',
            ['en-refund'],
            { id: 'en.ex.z041pggn3hp5ja' },
          ),
          ex.shortAnswer(
            'How can I help you? (querés hacer un reclamo)',
            '¿En qué lo puedo ayudar?',
            'I would like to make a complaint.',
            ["I'd like to make a complaint.", 'I want to make a complaint.'],
            ['en-complaint'],
            { id: 'en.ex.bm8v2dmstdsb8b' },
          ),
          ex.translateWrite(
            '¿Podría cambiarlo, por favor?',
            'Could you replace it, please?',
            ['en-replace'],
            {
              id: 'en.ex.oyvxrlvm1p5evm',
              acceptedAnswers: [
                'Could you replace it please?',
                'Can you replace it, please?',
                'Please could you replace it?',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Causas y contrastes',
        objective: 'Explicar causas, consecuencias y contrastes con conectores.',
        intro: {
          explanation:
            'Because of va con un sustantivo (because of the storm); because, con una oración. Therefore (por lo tanto) da la consecuencia. Although (aunque) une dos ideas en una oración; however (sin embargo) empieza la oración siguiente.',
          examples: [
            {
              target: 'Because of the storm, the trains are canceled.',
              base: 'Por la tormenta, los trenes están cancelados.',
            },
            {
              target: 'The hotel was nice. However, it was expensive.',
              base: 'El hotel era lindo. Sin embargo, era caro.',
            },
          ],
        },
        takeaways: [
          'Explicás causas con because of y consecuencias con therefore.',
          'Mostrás contrastes con although y however.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['although', 'aunque'],
              ['however', 'sin embargo'],
              ['because of', 'por / a causa de'],
              ['therefore', 'por lo tanto'],
            ],
            ['en-although', 'en-however', 'en-because-of', 'en-therefore'],
            { id: 'en.ex.1y8uf4oeb6p21p' },
          ),
          ex.fillBlank(
            'The flight was late ___ the snow.',
            'El vuelo se atrasó por la nieve.',
            'because of',
            ['because', 'although', 'however'],
            ['en-because-of', 'en-snow'],
            {
              id: 'en.ex.i78j82ut1li71w',
              explanation:
                'Because of + sustantivo (the snow); because + oración (because it snowed).',
            },
          ),
          ex.fillBlank(
            '___ it was cold, we went to the beach.',
            'Aunque hacía frío, fuimos a la playa.',
            'Although',
            ['However', 'Because of', 'Therefore'],
            ['en-although', 'en-cold'],
            { id: 'en.ex.6iza83vjuyllxb', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'The hotel was nice. ___, it was expensive.',
            'El hotel era lindo. Sin embargo, era caro.',
            'However',
            ['Although', 'Because of', 'Unless'],
            ['en-however', 'en-expensive'],
            { id: 'en.ex.4jra4kafo4hosx', skill: 'vocabulary' },
          ),
          question(
            'en.ex.ze3x72boay2pkt',
            STORM,
            '¿Por qué se cancelaron los trenes?',
            'Por la tormenta',
            ['Por un accidente', 'Por obras', 'Por falta de pasajeros'],
            ['en-because-of'],
            'El aviso dice: «Because of the storm, all trains to the coast are canceled today».',
          ),
          question(
            'en.ex.q8lzsavk7cjs4b',
            STORM,
            '¿Hace falta comprar un pasaje nuevo para el colectivo?',
            'No: los pasajes de hoy sirven en los colectivos',
            ['Sí, en la entrada', 'Sí, más caro', 'No, el colectivo es gratis para todos'],
            ['en-therefore', 'en-however'],
            'El aviso dice: «Tickets for today can be used on the buses. Therefore, you do not need to buy a new ticket».',
          ),
          ex.listenChoice(
            'Although it was cold, we went to the beach.',
            [
              'Although it was hot, we went to the beach.',
              'Because it was cold, we went to the beach.',
              'Although it was cold, we went to the park.',
            ],
            ['en-although', 'en-beach'],
            { id: 'en.ex.8zxg6akayhnnz7' },
          ),
          ex.translateWrite(
            'El hotel era lindo. Sin embargo, era caro.',
            'The hotel was nice. However, it was expensive.',
            ['en-however', 'en-hotel'],
            {
              id: 'en.ex.k94rajiho0uegw',
              acceptedAnswers: [
                'The hotel was beautiful. However, it was expensive.',
                'The hotel was nice. However it was expensive.',
              ],
            },
          ),
          ex.translateWrite(
            'Aunque estaba cansado, fui a trabajar.',
            'Although I was tired, I went to work.',
            ['en-although', 'en-tired'],
            {
              id: 'en.ex.cg18d5upszq3zf',
              acceptedAnswers: [
                'I went to work although I was tired.',
                'Although he was tired, he went to work.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Buscar soluciones',
        objective: 'Proponer soluciones con los condicionales y sort out.',
        intro: {
          explanation:
            "Sort out es resolver un problema: Don't worry, we'll sort it out. Para proponer soluciones usás los dos condicionales: If we call the mechanic, he will fix it (posible). If I had more money, I would buy a new car (imaginario).",
          examples: [
            {
              target: "Don't worry, we'll sort it out.",
              base: 'No te preocupes, lo vamos a resolver.',
            },
            {
              target: 'There is a solution for every problem.',
              base: 'Hay una solución para cada problema.',
            },
          ],
        },
        takeaways: ['Proponés soluciones con if.', "Tranquilizás a alguien: We'll sort it out."],
        exercises: [
          ex.translationChoice(
            'solution',
            'solución',
            ['problema', 'reclamo', 'ticket / recibo'],
            ['en-solution'],
            { id: 'en.ex.n9l9k68g4ofeu0' },
          ),
          ex.fillBlank(
            "Don't worry, we'll sort it ___.",
            'No te preocupes, lo vamos a resolver.',
            'out',
            ['up', 'off', 'down'],
            ['en-sort-out'],
            { id: 'en.ex.or6puatrlpuo0e', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'If you call the mechanic, he ___ fix it today.',
            'Si llamás al mecánico, lo va a arreglar hoy.',
            'will',
            ['would', 'did', 'was'],
            ['en-fix', 'en-if'],
            {
              id: 'en.ex.w39q9hgxzwv7w3',
              explanation: 'Primer condicional (posible): if + presente, will.',
            },
          ),
          ex.fillBlank(
            'If I had more money, I ___ buy a new car.',
            'Si tuviera más plata, me compraría un auto nuevo.',
            'would',
            ['will', 'can', 'am'],
            ['en-car', 'en-if'],
            {
              id: 'en.ex.1va9pbqp8knq9m',
              explanation: 'Segundo condicional (imaginario): if + pasado, would.',
            },
          ),
          question(
            'en.ex.du5d6fl2ah7lku',
            CAR,
            '¿Qué le aconseja Lucy a Ben?',
            'Que llame al mecánico',
            ['Que cargue nafta', 'Que vuelva caminando', 'Que compre otro auto'],
            ['en-fix', 'en-solution'],
            "Lucy dice: «Call the mechanic. I'm sure he can fix it».",
          ),
          ex.listenChoice(
            'There is a solution for every problem.',
            [
              'There is a solution for this problem.',
              'There is a problem for every solution.',
              'There was a solution for every problem.',
            ],
            ['en-solution', 'en-problem'],
            { id: 'en.ex.850tjc1sk9kubt' },
          ),
          ex.orderWords(
            'We have a problem with the internet.',
            'Tenemos un problema con internet.',
            ['en-problem'],
            { id: 'en.ex.gwywc43u8s7gvi' },
          ),
          ex.shortAnswer(
            "The internet isn't working. What should we do? (llamar a la empresa)",
            'Internet no funciona. ¿Qué hacemos?',
            'We should call the company.',
            [
              'Call the company.',
              "Let's call the company.",
              'We should call the internet company.',
            ],
            ['en-problem', 'en-solution'],
            { id: 'en.ex.e8s3xs7jgbcze8' },
          ),
          ex.translateWrite(
            'No te preocupes, lo vamos a resolver.',
            "Don't worry, we'll sort it out.",
            ['en-sort-out'],
            {
              id: 'en.ex.wxoo48pzeqmdvs',
              acceptedAnswers: [
                "Don't worry, we will sort it out.",
                'Do not worry, we will sort it out.',
                "Don't worry. We'll sort it out.",
              ],
            },
          ),
        ],
      },
    ],
  },
};

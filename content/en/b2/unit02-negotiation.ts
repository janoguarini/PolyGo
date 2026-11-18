import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U2 «Trabajo, liderazgo y negociación» (docs/B2_EN.md): negociar un acuerdo y ceder (deal,
 * compromise, meet halfway); poner condiciones con as long as, provided that, otherwise e in case;
 * liderar un equipo (delegate, take on, workload) y rechazar con cortesía (turn down).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SUPPLIER = dialogue(
  'en.stim.b2-u2-supplier',
  'Una gerente negocia con un proveedor el precio y la fecha de entrega.',
  [
    [
      'Rachel',
      'Thanks for the proposal, Daniel. To be honest, the price is higher than we expected.',
    ],
    ['Daniel', 'I understand. What if we kept the price but delivered two weeks earlier?'],
    ['Rachel', 'Time is not our main priority. The budget is. Could you go down five percent?'],
    ['Daniel', 'Five is difficult. I could offer three, as long as you sign a two-year contract.'],
    [
      'Rachel',
      "Two years is a long time. Let's meet halfway: four percent and an eighteen-month contract.",
    ],
    ['Daniel', 'That sounds fair. Provided that my director agrees, we have a deal.'],
    ['Rachel', 'Great. Please send me the new terms in writing.'],
  ],
);

const OFFER = reading(
  'en.stim.b2-u2-offer',
  'email',
  'Una candidata responde a una oferta de trabajo.',
  [
    'Dear Mr. Patel,',
    'Thank you very much for the job offer. I am very excited about joining the team.',
    'Before I accept, I would like to discuss one point. In my current job I work from home two days a week, and this flexibility is important to me.',
    'I would be happy to accept a slightly lower salary, provided that I can keep those two days at home. Otherwise, I am afraid I would have to turn the offer down.',
    'I hope we can reach an agreement. I am free to talk at any time this week.',
    'Kind regards,',
    'Laura Kim',
  ],
  { from: 'Laura Kim', to: 'Mr. Patel', title: 'Job offer' },
);

const TEAM = dialogue(
  'en.stim.b2-u2-team',
  'Una líder de equipo habla con un empleado que está desbordado.',
  [
    ['Grace', 'Omar, you look exhausted. Is your workload too heavy at the moment?'],
    [
      'Omar',
      "Honestly, yes. I took on the new client last month, and I'm still doing my old projects.",
    ],
    ['Grace', 'You should have told me. A good leader needs to know these things.'],
    ['Omar', "I didn't want to turn down the client. I thought it was a good opportunity."],
    ['Grace', "It is, but you can't do everything. Let's delegate the reports to Ben."],
    ['Omar', 'Are you sure? He is quite new.'],
    ['Grace', "That's fine. I'll help him at the beginning, in case he has questions."],
  ],
);

const LEADER_ARTICLE = reading(
  'en.stim.b2-u2-leader',
  'post',
  'Un artículo de revista sobre el liderazgo.',
  [
    'What makes a good leader? Many people imagine someone who gives orders and never changes their mind. Research shows the opposite.',
    'The best leaders are flexible. They listen first, and they are willing to compromise when a better idea appears.',
    'They also know how to delegate. Instead of doing everything themselves, they give people responsibility and trust them to do the job.',
    'Finally, they persuade rather than order. When a team understands the reason for a decision, it works harder to make it succeed.',
  ],
  { title: 'Leaders, not bosses' },
);

export const EN_B2_U02: B2UnitDef = {
  names: ['Rachel', 'Daniel', 'Patel', 'Laura', 'Kim', 'Grace', 'Omar', 'Ben'],
  support: [
    'expected',
    'kept',
    'delivered',
    'budget',
    'percent',
    'contract',
    'director',
    'fair',
    'terms',
    'discuss',
    'current',
    'flexibility',
    'slightly',
    'lower',
    'regards',
    'exhausted',
    'heavy',
    'client',
    'opportunity',
    'quite',
    'beginning',
    'imagine',
    'mind',
    'research',
    'opposite',
    'willing',
    'appears',
    'themselves',
    'responsibility',
    'reason',
    'succeed',
    'sign',
    'high',
    'careful',
    'someone',
    'customer',
    'borrow',
    'task',
  ],
  unit: {
    position: 2,
    title: 'Trabajo, liderazgo y negociación',
    titleEn: 'Work, leadership and negotiation',
    description:
      'Negociar y ceder, poner condiciones (as long as, provided that, otherwise, in case), liderar un equipo y decir que no con cortesía.',
    emoji: '🤝',
    objective:
      'Podés negociar un acuerdo con condiciones, repartir tareas en un equipo y rechazar una propuesta con cortesía.',
    grammar: {
      title: 'Condiciones: as long as, provided that, otherwise, in case',
      explanation:
        'As long as y provided that ponen una condición (siempre que, siempre y cuando) y van con presente aunque hablen del futuro. Otherwise (si no, de lo contrario) dice qué pasa si la condición no se cumple. In case (por si) habla de una precaución: hacés algo antes por si pasa otra cosa. Unless (a menos que) ya lo conocés del B1.',
      examples: [
        {
          target: 'I could offer three percent, as long as you sign a two-year contract.',
          base: 'Podría ofrecer un tres por ciento, siempre que firmen un contrato de dos años.',
        },
        {
          target: 'Send me the terms in writing, in case anything changes.',
          base: 'Mandame las condiciones por escrito, por si algo cambia.',
        },
        {
          target: 'Hurry up. Otherwise, we will miss the train.',
          base: 'Apurate. Si no, vamos a perder el tren.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-negotiate',
        'negotiate',
        'negociar',
        '/nɪˈɡoʊʃiˌeɪt/',
        '🤝',
        'We need to negotiate a better price.',
        'Tenemos que negociar un mejor precio.',
        ['work', 'negotiation', 'verbs'],
      ),
      w(
        'en-deal',
        'deal',
        'trato / acuerdo (comercial)',
        '/dil/',
        undefined,
        'If you agree, we have a deal.',
        'Si estás de acuerdo, trato hecho.',
        ['work', 'negotiation'],
        ['trato', 'acuerdo comercial'],
      ),
      w(
        'en-proposal',
        'proposal',
        'propuesta',
        '/prəˈpoʊzəl/',
        '📄',
        'Thanks for the proposal. We will read it carefully.',
        'Gracias por la propuesta. La vamos a leer con atención.',
        ['work', 'negotiation'],
      ),
      w(
        'en-reach-an-agreement',
        'reach an agreement',
        'llegar a un acuerdo',
        '/ˈritʃ ən əˈɡrimənt/',
        undefined,
        'After two hours, we reached an agreement.',
        'Después de dos horas, llegamos a un acuerdo.',
        ['work', 'negotiation', 'collocations'],
      ),
      w(
        'en-compromise',
        'compromise',
        'concesión / término medio',
        '/ˈkɑmprəˌmaɪz/',
        '⚖️',
        'Nobody got everything, but it was a good compromise.',
        'Nadie consiguió todo, pero fue un buen término medio.',
        ['work', 'negotiation'],
        ['concesión', 'término medio', 'ceder'],
      ),
      w(
        'en-meet-halfway',
        'meet halfway',
        'ceder cada uno un poco / encontrarse a mitad de camino',
        '/ˈmit ˌhæfˈweɪ/',
        undefined,
        "You want ten, I want six. Let's meet halfway at eight.",
        'Vos querés diez y yo seis. Cedamos los dos: ocho.',
        ['negotiation', 'collocations'],
        ['ceder cada uno un poco', 'encontrarse a mitad de camino'],
      ),
      w(
        'en-flexible',
        'flexible',
        'flexible',
        '/ˈflɛksəbəl/',
        undefined,
        'My boss is flexible about working hours.',
        'Mi jefe es flexible con los horarios de trabajo.',
        ['work', 'adjectives'],
      ),
      w(
        'en-priority',
        'priority',
        'prioridad',
        '/praɪˈɔrəti/',
        '🔝',
        'Our main priority is the customer.',
        'Nuestra prioridad principal es el cliente.',
        ['work'],
      ),
      w(
        'en-as-long-as',
        'as long as',
        'siempre que / mientras',
        '/æz ˈlɔŋ æz/',
        undefined,
        'You can borrow my car as long as you drive carefully.',
        'Podés usar mi auto siempre que manejes con cuidado.',
        ['conditions', 'connectors'],
        ['siempre que', 'mientras'],
      ),
      w(
        'en-provided-that',
        'provided that',
        'siempre y cuando / con la condición de que',
        '/prəˈvaɪdɪd ðæt/',
        undefined,
        'We will sign, provided that the price stays the same.',
        'Vamos a firmar, siempre y cuando el precio siga igual.',
        ['conditions', 'connectors'],
        ['siempre y cuando', 'con la condición de que'],
      ),
      w(
        'en-otherwise',
        'otherwise',
        'si no / de lo contrario',
        '/ˈʌðərˌwaɪz/',
        undefined,
        'Hurry up. Otherwise, we will miss the train.',
        'Apurate. Si no, vamos a perder el tren.',
        ['conditions', 'connectors'],
        ['si no', 'de lo contrario'],
      ),
      w(
        'en-in-case',
        'in case',
        'por si (acaso)',
        '/ɪn ˈkeɪs/',
        '☂️',
        'Take an umbrella in case it rains.',
        'Llevá un paraguas por si llueve.',
        ['conditions', 'connectors'],
        ['por si', 'por si acaso'],
      ),
      w(
        'en-leader',
        'leader',
        'líder',
        '/ˈlidər/',
        '🧭',
        'A good leader listens to the team.',
        'Un buen líder escucha al equipo.',
        ['work', 'leadership'],
      ),
      w(
        'en-delegate',
        'delegate',
        'delegar',
        '/ˈdɛləˌɡeɪt/',
        undefined,
        'You should delegate some tasks to your team.',
        'Deberías delegar algunas tareas en tu equipo.',
        ['work', 'leadership', 'verbs'],
      ),
      w(
        'en-workload',
        'workload',
        'carga de trabajo',
        '/ˈwɜrkˌloʊd/',
        '📚',
        'My workload is too heavy this month.',
        'Este mes tengo demasiado trabajo.',
        ['work'],
      ),
      w(
        'en-take-on',
        'take on',
        'asumir / hacerse cargo de',
        '/ˈteɪk ˈɑn/',
        undefined,
        'She took on a new project last week.',
        'La semana pasada asumió un proyecto nuevo.',
        ['work', 'phrasal-verbs'],
        ['asumir', 'hacerse cargo de'],
      ),
      w(
        'en-persuade',
        'persuade',
        'convencer / persuadir',
        '/pərˈsweɪd/',
        undefined,
        'I persuaded my boss to give me a day off.',
        'Convencí a mi jefe de que me diera un día libre.',
        ['work', 'leadership', 'verbs'],
        ['convencer', 'persuadir'],
      ),
      w(
        'en-turn-down',
        'turn down',
        'rechazar',
        '/ˈtɜrn ˈdaʊn/',
        '🙅',
        'He turned down the job because the salary was too low.',
        'Rechazó el trabajo porque el sueldo era muy bajo.',
        ['work', 'phrasal-verbs'],
        ['no aceptar'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Sentarse a negociar',
        objective: 'Presentar una propuesta, negociar un precio y cerrar un trato.',
        intro: {
          explanation:
            'Para negociar: negotiate a price (negociar un precio), make a proposal (hacer una propuesta) y, al final, reach an agreement (llegar a un acuerdo). We have a deal significa trato hecho. Para sugerir algo con suavidad, What if we…? va con el pasado: What if we kept the price?',
          examples: [
            {
              target: 'We need to negotiate a better price.',
              base: 'Tenemos que negociar un mejor precio.',
            },
            { target: 'If you agree, we have a deal.', base: 'Si estás de acuerdo, trato hecho.' },
          ],
        },
        takeaways: [
          'Presentás y discutís una propuesta.',
          'Cerrás una negociación: We have a deal, we reached an agreement.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['negotiate', 'negociar'],
              ['deal', 'trato / acuerdo (comercial)'],
              ['proposal', 'propuesta'],
              ['reach an agreement', 'llegar a un acuerdo'],
            ],
            ['en-negotiate', 'en-deal', 'en-proposal', 'en-reach-an-agreement'],
            { id: 'en.ex.ppn3dbm2t9ouj4' },
          ),
          ex.fillBlank(
            'After two hours, we ___ an agreement.',
            'Después de dos horas, llegamos a un acuerdo.',
            'reached',
            ['made', 'did', 'took'],
            ['en-reach-an-agreement'],
            {
              id: 'en.ex.fqmt9dekc8zwg9',
              skill: 'vocabulary',
              explanation: 'Collocation: reach an agreement (llegar a un acuerdo).',
            },
          ),
          ex.fillBlank(
            'If you agree, we have a ___.',
            'Si estás de acuerdo, trato hecho.',
            'deal',
            ['proposal', 'price', 'meeting'],
            ['en-deal'],
            { id: 'en.ex.78dlf1y8lptwcg', skill: 'vocabulary' },
          ),
          question(
            'en.ex.ruab8prfbzh501',
            SUPPLIER,
            '¿Qué le preocupa a Rachel de la propuesta?',
            'El precio, más alto de lo que esperaban',
            ['La fecha de entrega', 'La calidad del producto', 'La duración del contrato'],
            ['en-proposal', 'en-negotiate', 'en-priority'],
            'Rachel dice: «the price is higher than we expected» y «Time is not our main priority. The budget is».',
          ),
          question(
            'en.ex.fpzdqd6cinl19k',
            SUPPLIER,
            '¿Cómo termina la negociación?',
            'Con un trato, siempre y cuando el director de Daniel esté de acuerdo',
            ['Sin acuerdo', 'Con un trato firmado ese mismo día', 'Con una nueva reunión'],
            ['en-deal', 'en-provided-that', 'en-meet-halfway'],
            'Daniel dice: «Provided that my director agrees, we have a deal».',
          ),
          ex.listenChoice(
            'We need to negotiate a better price.',
            [
              'We need to negotiate a better deal.',
              'We want to negotiate a better price.',
              "We don't need to negotiate the price.",
            ],
            ['en-negotiate'],
            { id: 'en.ex.qtj4fxnqeo61q0' },
          ),
          ex.orderWords(
            'Thanks for the proposal we will read it carefully.',
            'Gracias por la propuesta, la vamos a leer con atención.',
            ['en-proposal'],
            { id: 'en.ex.6hybrazv6df1r5' },
          ),
          ex.shortAnswer(
            'So, do we agree on the price? (sí, trato hecho)',
            'Entonces, ¿estamos de acuerdo con el precio?',
            'Yes, we have a deal.',
            ["Yes, it's a deal.", 'Yes. We have a deal.', 'We have a deal.'],
            ['en-deal'],
            { id: 'en.ex.m6yrun10spsttg' },
          ),
          ex.translateWrite(
            'Después de dos horas, llegamos a un acuerdo.',
            'After two hours, we reached an agreement.',
            ['en-reach-an-agreement'],
            {
              id: 'en.ex.0wfzn48dyrp5vi',
              acceptedAnswers: [
                'After two hours we reached an agreement.',
                'We reached an agreement after two hours.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Ceder un poco',
        objective: 'Buscar un término medio y decir qué es lo más importante para vos.',
        intro: {
          explanation:
            'En una negociación nadie consigue todo: a compromise es un término medio. Let’s meet halfway propone que los dos cedan un poco. Para explicar qué te importa más: Our main priority is… Y si podés adaptarte, sos flexible.',
          examples: [
            {
              target: "You want ten, I want six. Let's meet halfway at eight.",
              base: 'Vos querés diez y yo seis. Cedamos los dos: ocho.',
            },
            {
              target: 'Our main priority is the customer.',
              base: 'Nuestra prioridad principal es el cliente.',
            },
          ],
        },
        takeaways: [
          'Proponés un término medio: Let’s meet halfway.',
          'Explicás tus prioridades y si podés ser flexible.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['compromise', 'concesión / término medio'],
              ['meet halfway', 'ceder cada uno un poco / encontrarse a mitad de camino'],
              ['flexible', 'flexible'],
              ['priority', 'prioridad'],
            ],
            ['en-compromise', 'en-meet-halfway', 'en-flexible', 'en-priority'],
            { id: 'en.ex.srq9796rabf8vy' },
          ),
          ex.fillBlank(
            "You want ten, I want six. Let's ___ halfway at eight.",
            'Vos querés diez y yo seis. Cedamos los dos: ocho.',
            'meet',
            ['go', 'make', 'find'],
            ['en-meet-halfway'],
            { id: 'en.ex.4c9rzrzjo7nqbz', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Nobody got everything, but it was a good ___.',
            'Nadie consiguió todo, pero fue un buen término medio.',
            'compromise',
            ['deal', 'proposal', 'contract'],
            ['en-compromise'],
            {
              id: 'en.ex.nnv97s0tkr1sea',
              skill: 'vocabulary',
              explanation:
                'Compromise no es «compromiso» (promesa): es una concesión, un punto medio.',
            },
          ),
          question(
            'en.ex.4lttqco0wtlv6b',
            SUPPLIER,
            '¿Cómo terminan cediendo los dos?',
            'Un cuatro por ciento de descuento y un contrato de dieciocho meses',
            [
              'Un cinco por ciento y dos años',
              'Un tres por ciento y un año',
              'Sin descuento y entrega antes',
            ],
            ['en-meet-halfway', 'en-compromise'],
            'Rachel propone: «Let’s meet halfway: four percent and an eighteen-month contract», y Daniel acepta.',
          ),
          ex.listenChoice(
            'Our main priority is the customer.',
            [
              'Our main priority is the budget.',
              'Our first priority is the customer.',
              'Your main priority is the customer.',
            ],
            ['en-priority'],
            { id: 'en.ex.ef5cev4upzrcof' },
          ),
          ex.orderWords(
            'My boss is flexible about working hours.',
            'Mi jefe es flexible con los horarios de trabajo.',
            ['en-flexible'],
            { id: 'en.ex.v97s8ivt52p9e9' },
          ),
          ex.shortAnswer(
            'What is more important for you, time or money? (el dinero es tu prioridad)',
            '¿Qué es más importante para vos, el tiempo o el dinero?',
            'Money is my priority.',
            [
              'Money is my main priority.',
              'My priority is money.',
              'Money is my priority, not time.',
            ],
            ['en-priority'],
            { id: 'en.ex.ndnt9fn93xtxp9' },
          ),
          ex.translateWrite(
            'Nadie consiguió todo, pero fue un buen término medio.',
            'Nobody got everything, but it was a good compromise.',
            ['en-compromise'],
            {
              id: 'en.ex.vek4eldy9dfaip',
              acceptedAnswers: [
                'Nobody got everything but it was a good compromise.',
                'No one got everything, but it was a good compromise.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Con una condición',
        objective:
          'Poner condiciones y precauciones con as long as, provided that, otherwise e in case.',
        intro: {
          explanation:
            'As long as y provided that ponen una condición y van con presente: I’ll sign, provided that the price stays the same. Otherwise dice qué pasa si no se cumple. In case es una precaución: llevás un paraguas in case it rains (por si llueve, aunque no sepas si va a llover).',
          examples: [
            {
              target: 'You can borrow my car as long as you drive carefully.',
              base: 'Podés usar mi auto siempre que manejes con cuidado.',
            },
            {
              target: 'Take an umbrella in case it rains.',
              base: 'Llevá un paraguas por si llueve.',
            },
          ],
        },
        takeaways: [
          'Ponés condiciones con as long as y provided that.',
          'Hablás de precauciones con in case y de consecuencias con otherwise.',
        ],
        exercises: [
          ex.fillBlank(
            'You can borrow my car ___ you drive carefully.',
            'Podés usar mi auto siempre que manejes con cuidado.',
            'as long as',
            ['in case', 'otherwise', 'although'],
            ['en-as-long-as'],
            {
              id: 'en.ex.cf0i7p8xeig8tc',
              explanation: 'As long as + presente: la condición para que algo pase.',
            },
          ),
          ex.fillBlank(
            'Take an umbrella ___ it rains.',
            'Llevá un paraguas por si llueve.',
            'in case',
            ['as long as', 'otherwise', 'unless'],
            ['en-in-case'],
            {
              id: 'en.ex.op4wwztgtm8r5b',
              explanation: 'In case: hacés algo antes, como precaución.',
            },
          ),
          ex.fillBlank(
            'Hurry up. ___, we will miss the train.',
            'Apurate. Si no, vamos a perder el tren.',
            'Otherwise',
            ['Provided that', 'In case', 'As long as'],
            ['en-otherwise'],
            { id: 'en.ex.jaxuohe4ol4ct4' },
          ),
          ex.fillBlank(
            'We will sign, provided that the price ___ the same.',
            'Vamos a firmar, siempre y cuando el precio siga igual.',
            'stays',
            ['will stay', 'stayed', 'would stay'],
            ['en-provided-that'],
            {
              id: 'en.ex.6hw4q9enovkr5u',
              explanation:
                'Después de provided that (como después de if) va presente, aunque hables del futuro.',
            },
          ),
          question(
            'en.ex.8htzjmpx7hp1qm',
            OFFER,
            '¿Qué condición pone Laura para aceptar la oferta?',
            'Seguir trabajando dos días por semana desde su casa',
            ['Un sueldo más alto', 'Empezar el mes que viene', 'Tener su propio equipo'],
            ['en-provided-that'],
            'Laura escribe: «I would be happy to accept a slightly lower salary, provided that I can keep those two days at home».',
          ),
          question(
            'en.ex.7jr3hepvuvykak',
            OFFER,
            '¿Qué pasa si la empresa no acepta su condición?',
            'Laura va a rechazar la oferta',
            [
              'Laura va a aceptar igual',
              'Laura va a pedir más tiempo',
              'Laura va a hablar con su jefe actual',
            ],
            ['en-otherwise', 'en-turn-down'],
            'Laura escribe: «Otherwise, I am afraid I would have to turn the offer down».',
          ),
          ex.listenChoice(
            'Send me the terms in writing, in case anything changes.',
            [
              'Send me the terms in writing, as long as nothing changes.',
              'Send me the terms by email, in case anything changes.',
              'Send them the terms in writing, in case anything changes.',
            ],
            ['en-in-case'],
            { id: 'en.ex.oa737dfydfqlsg' },
          ),
          ex.orderWords(
            'I will help you as long as you help me.',
            'Te voy a ayudar siempre que vos me ayudes.',
            ['en-as-long-as'],
            { id: 'en.ex.s7h0o11k5rnt6x' },
          ),
          ex.shortAnswer(
            'Why are you taking a jacket? (por si hace frío)',
            '¿Por qué llevás una campera?',
            'In case it gets cold.',
            [
              "In case it's cold.",
              'I am taking it in case it gets cold.',
              "I'm taking a jacket in case it gets cold.",
            ],
            ['en-in-case'],
            { id: 'en.ex.om05s1amsvknxd' },
          ),
          ex.translateWrite(
            'Apurate. Si no, vamos a perder el tren.',
            'Hurry up. Otherwise, we will miss the train.',
            ['en-otherwise'],
            {
              id: 'en.ex.jr9k41lauplp7d',
              acceptedAnswers: [
                "Hurry up. Otherwise, we'll miss the train.",
                'Hurry up. Otherwise we will miss the train.',
                "Hurry up, otherwise we'll miss the train.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Liderar un equipo',
        objective: 'Repartir tareas, hablar de la carga de trabajo y convencer.',
        intro: {
          explanation:
            'A leader no hace todo: delegate es delegar tareas en otros. Si tenés demasiado trabajo, tu workload es demasiado grande. Take on es asumir una tarea nueva. Persuade someone to do something es convencer a alguien de hacer algo.',
          examples: [
            {
              target: 'You should delegate some tasks to your team.',
              base: 'Deberías delegar algunas tareas en tu equipo.',
            },
            {
              target: 'She took on a new project last week.',
              base: 'La semana pasada asumió un proyecto nuevo.',
            },
          ],
        },
        takeaways: [
          'Hablás de la carga de trabajo y de asumir tareas nuevas.',
          'Delegás y convencés con persuade.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['leader', 'líder'],
              ['delegate', 'delegar'],
              ['workload', 'carga de trabajo'],
              ['persuade', 'convencer / persuadir'],
            ],
            ['en-leader', 'en-delegate', 'en-workload', 'en-persuade'],
            { id: 'en.ex.f0p6v0z74oc5q4' },
          ),
          ex.fillBlank(
            'She took ___ a new project last week.',
            'La semana pasada asumió un proyecto nuevo.',
            'on',
            ['up', 'off', 'down'],
            ['en-take-on'],
            { id: 'en.ex.0nvh5ces6eh8n9', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I persuaded my boss ___ me a day off.',
            'Convencí a mi jefe de que me diera un día libre.',
            'to give',
            ['giving', 'give', 'gave'],
            ['en-persuade'],
            { id: 'en.ex.cps9ad73m0n71j', explanation: 'Persuade someone to + verbo.' },
          ),
          question(
            'en.ex.ray5vgwnz4o3cw',
            TEAM,
            '¿Por qué Omar tiene tanto trabajo?',
            'Asumió un cliente nuevo y sigue con sus proyectos de antes',
            [
              'Un compañero renunció',
              'Está aprendiendo un trabajo nuevo',
              'Su jefa le dio los informes de Ben',
            ],
            ['en-take-on', 'en-workload'],
            'Omar dice: «I took on the new client last month, and I’m still doing my old projects».',
          ),
          question(
            'en.ex.vhemx4zw5tm3i3',
            TEAM,
            '¿Qué solución propone Grace?',
            'Delegar los informes en Ben y ayudarlo al principio',
            [
              'Rechazar al cliente nuevo',
              'Contratar a otra persona',
              'Que Omar trabaje el fin de semana',
            ],
            ['en-delegate', 'en-leader'],
            'Grace dice: «Let’s delegate the reports to Ben… I’ll help him at the beginning».',
          ),
          question(
            'en.ex.3fjo29awx4lybu',
            LEADER_ARTICLE,
            'Según el artículo, ¿por qué conviene convencer en vez de dar órdenes?',
            'Porque un equipo que entiende la razón trabaja más para que la decisión funcione',
            [
              'Porque las órdenes son ilegales',
              'Porque así el líder trabaja menos',
              'Porque el equipo siempre tiene razón',
            ],
            ['en-persuade', 'en-leader'],
            'El artículo dice: «When a team understands the reason for a decision, it works harder to make it succeed».',
          ),
          ex.listenChoice(
            'A good leader listens to the team.',
            [
              'A good leader talks to the team.',
              'A good leader listens to the client.',
              'The good leaders listen to the team.',
            ],
            ['en-leader'],
            { id: 'en.ex.g10u1snbuqi7ui' },
          ),
          question(
            'en.ex.sig8lziw0h8ka5',
            LEADER_ARTICLE,
            'Según el artículo, ¿cómo son los mejores líderes?',
            'Flexibles: escuchan y ceden si aparece una idea mejor',
            [
              'Firmes: nunca cambian de opinión',
              'Exigentes: dan órdenes claras',
              'Independientes: hacen todo solos',
            ],
            ['en-flexible', 'en-compromise'],
            'El artículo dice: «The best leaders are flexible. They listen first, and they are willing to compromise».',
          ),
          ex.shortAnswer(
            'How is work at the moment? (tenés demasiado trabajo)',
            '¿Cómo va el trabajo?',
            'My workload is too heavy.',
            [
              'My workload is too heavy at the moment.',
              'I have too much work.',
              'My workload is very heavy.',
            ],
            ['en-workload'],
            { id: 'en.ex.kc1i9j411ja4u3' },
          ),
          ex.translateWrite(
            'La semana pasada asumió un proyecto nuevo.',
            'She took on a new project last week.',
            ['en-take-on'],
            {
              id: 'en.ex.epqpprr8tx19mb',
              acceptedAnswers: [
                'Last week she took on a new project.',
                'He took on a new project last week.',
                'Last week he took on a new project.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Decir que no con cortesía',
        objective: 'Rechazar una oferta o una tarea sin cerrar la puerta.',
        intro: {
          explanation:
            'Turn down es rechazar (una oferta, una invitación, un trabajo). Para decir que no con cortesía, suavizás: I’m afraid I’ll have to turn it down (me temo que…), I’d love to, but… Y si querés seguir negociando, ofrecés una alternativa con as long as o provided that.',
          examples: [
            {
              target: 'He turned down the job because the salary was too low.',
              base: 'Rechazó el trabajo porque el sueldo era muy bajo.',
            },
            {
              target: "I'm afraid I'll have to turn it down.",
              base: 'Me temo que voy a tener que rechazarlo.',
            },
          ],
        },
        takeaways: [
          'Rechazás algo con cortesía: I’m afraid I’ll have to turn it down.',
          'Ofrecés una alternativa con una condición.',
        ],
        exercises: [
          ex.translationChoice(
            'turn down',
            'rechazar',
            ['asumir / hacerse cargo de', 'delegar', 'negociar'],
            ['en-turn-down'],
            { id: 'en.ex.hy82nyxsgwiiei' },
          ),
          ex.fillBlank(
            'He turned ___ the job because the salary was too low.',
            'Rechazó el trabajo porque el sueldo era muy bajo.',
            'down',
            ['on', 'off', 'up'],
            ['en-turn-down'],
            {
              id: 'en.ex.3t7kaniu2ahoab',
              skill: 'vocabulary',
              explanation: 'Turn down (rechazar); turn on / off es prender / apagar.',
            },
          ),
          ex.fillBlank(
            "I'm ___ I'll have to turn it down.",
            'Me temo que voy a tener que rechazarlo.',
            'afraid',
            ['sorry', 'scared', 'worried'],
            ['en-turn-down'],
            {
              id: 'en.ex.fvpe3gv9g9k6vc',
              explanation: 'I’m afraid… suaviza una mala noticia (me temo que).',
            },
          ),
          question(
            'en.ex.twj5ykpk0do58g',
            TEAM,
            '¿Por qué Omar no rechazó al cliente nuevo?',
            'Porque le pareció una buena oportunidad',
            ['Porque se lo ordenó Grace', 'Porque necesitaba más sueldo', 'Porque Ben no podía'],
            ['en-turn-down'],
            'Omar dice: «I didn’t want to turn down the client. I thought it was a good opportunity».',
          ),
          question(
            'en.ex.uexht7e5d00my5',
            OFFER,
            '¿Qué tono tiene el correo de Laura?',
            'Amable y abierto a negociar',
            ['Enojado y exigente', 'Triste y resignado', 'Informal y gracioso'],
            ['en-reach-an-agreement', 'en-flexible'],
            'Laura agradece la oferta, explica su condición y termina con «I hope we can reach an agreement».',
          ),
          ex.listenChoice(
            "I'm afraid I'll have to turn it down.",
            [
              "I'm afraid I'll have to take it on.",
              "I'm sure I'll have to turn it down.",
              "I'm afraid I had to turn it down.",
            ],
            ['en-turn-down'],
            { id: 'en.ex.433w3k3bqc8rcv' },
          ),
          ex.orderWords(
            'She turned down the offer because of the hours.',
            'Rechazó la oferta por los horarios.',
            ['en-turn-down'],
            { id: 'en.ex.e5u2d7soyzij7q' },
          ),
          ex.shortAnswer(
            'Did you accept the job? (no, lo rechazaste porque el sueldo era bajo)',
            '¿Aceptaste el trabajo?',
            'No, I turned it down because the salary was low.',
            [
              'No, I turned it down.',
              'No, I turned it down because the salary was too low.',
              'I turned it down because the salary was low.',
            ],
            ['en-turn-down'],
            { id: 'en.ex.euzq2qxon7ijvr' },
          ),
          ex.translateWrite(
            'Te voy a ayudar, siempre y cuando me avises antes.',
            'I will help you, provided that you tell me before.',
            ['en-provided-that'],
            {
              id: 'en.ex.khv8hsv00ebvft',
              acceptedAnswers: [
                "I'll help you, provided that you tell me before.",
                'I will help you provided that you tell me before.',
                "I'll help you provided that you tell me first.",
                'I will help you, provided that you tell me first.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

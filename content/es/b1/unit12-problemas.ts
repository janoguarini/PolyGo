import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U12 «Problems and solutions» (docs/ES_B1.md §3), la última del nivel: explicar un
 * problema con conectores de causa (ya que), consecuencia (por lo tanto) y concesión (aunque +
 * indicativo, a pesar de + sustantivo o infinitivo); hacer hipótesis sobre la causa (a lo mejor +
 * indicativo, quizás + subjuntivo, seguramente = «probablemente»); presentar una queja formal con usted
 * y ustedes (Estimados señores:, Les escribo para quejarme de…, Solicito un reembolso, Atentamente) y
 * negociar una solución. «Aunque + subjuntivo» (aunque llueva) queda para B2: sólo se menciona.
 * Reutiliza el A2 U12 (el problema, la solución, devolver, el dinero, sin embargo, por eso, me dijo
 * que) y el U11 (si tuviera…, en cambio, el respeto).
 * Variante: español neutro de Latinoamérica: usted con el servicio al cliente y en la queja escrita, tú
 * entre vecinos y amigos. Léxico: la lavadora, el celular, la computadora, el piso (suelo), arreglar
 * (en México también «componer»). Escenarios: una tienda de electrodomésticos (llamada), un hotel de
 * Mérida (correo de queja), un edificio de vecinos (ruido), un celular dañado.
 * Pronunciación: la u muda de que en queja / quejarse (KE-ja, ke-JAR-se) con la j fuerte, la g suave
 * de garantía (ga-ran-TÍ-a), el acento de técnico (TÉC-ni-co) y las frases fijas dichas como una sola
 * unidad (a lo mejor = a-lo-me-JOR).
 * Cultura: la queja formal se escribe con fórmulas fijas y usted; en la llamada, el agente abre con
 * «¿En qué le puedo ayudar?». Ningún dato de contacto (ni correos ni teléfonos) en los textos.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CELULAR = reading(
  'es.stim.b1-u12-celular',
  'message',
  'Sofía sends a message to her friend Nico about her phone.',
  [
    '¡Hola, Nico! Ayer se me cayó el celular y ahora la pantalla está dañada.',
    'Ya que tiene garantía, fui a la tienda.',
    'Aunque el técnico fue muy simpático, me dijo que la garantía no incluye la pantalla.',
    'Por lo tanto, tengo que pagar mil pesos para arreglar la pantalla.',
    'A pesar de eso, estoy contenta: ¡no perdí nada!',
  ],
  { from: 'Sofía', to: 'Nico' },
);

const VECINOS = dialogue(
  'es.stim.b1-u12-vecinos',
  'Jorge knocks on his neighbor Marta’s door to talk about a problem.',
  [
    ['Jorge', 'Hola, Marta. Perdón, ¿tienes un momento? Quiero hablar contigo del ruido.'],
    ['Marta', '¿El ruido? A lo mejor es la música de mi hijo. Toca la guitarra todas las noches.'],
    [
      'Jorge',
      'Sí. Ya que trabajo muy temprano, me acuesto a las diez. Por lo tanto, la guitarra es un problema para mí.',
    ],
    ['Marta', 'Lo siento mucho. Quizás pueda tocar en la sala, que está más lejos de tu cuarto.'],
    ['Jorge', 'Gracias. Aunque toca muy bien, a las diez ya estoy en la cama.'],
    [
      'Marta',
      'Tienes razón. Seguramente podemos encontrar una solución: ¿hasta las nueve y media está bien?',
    ],
    ['Jorge', '¡Perfecto! Muchas gracias, Marta.'],
  ],
  ES_B1_RATE,
);

const LLAMADA = dialogue(
  'es.stim.b1-u12-llamada',
  'Elena calls a store’s customer service about a washing machine.',
  [
    ['Agente', 'Servicio al cliente, buenas tardes. ¿En qué le puedo ayudar?'],
    ['Elena', 'Buenas tardes. Llamo porque compré una lavadora hace dos semanas y llegó dañada.'],
    ['Agente', 'Lo siento mucho. ¿Qué problema tiene?'],
    ['Elena', 'La puerta está dañada y hay agua en el piso. Aunque es nueva, no funciona.'],
    [
      'Agente',
      'Entiendo. Ya que tiene garantía, un técnico puede ir a su casa el jueves para arreglar la puerta.',
    ],
    [
      'Elena',
      'El jueves trabajo. Prefiero una lavadora nueva o un reembolso, ya que la compré hace muy poco.',
    ],
    ['Agente', 'De acuerdo. Seguramente le podemos mandar una lavadora nueva esta semana.'],
    ['Elena', 'Perfecto, muchas gracias.'],
  ],
  ES_B1_RATE,
);

const HOTEL = reading(
  'es.stim.b1-u12-hotel',
  'email',
  'Laura writes to a hotel after her stay.',
  [
    'Estimados señores:',
    'Les escribo para quejarme de mi estadía en su hotel de Mérida del 3 al 5 de mayo.',
    'No había agua caliente en el baño y la ventana de la habitación estaba dañada.',
    'Aunque llamé tres veces, nadie resolvió el problema.',
    'A pesar de tener una reserva, tuve que esperar tres horas por mi habitación.',
    'Por lo tanto, solicito un reembolso de la primera noche.',
    'Atentamente,',
  ],
  { title: 'Queja por mi estadía', from: 'Laura' },
);

const TIENDA = reading(
  'es.stim.b1-u12-tienda',
  'email',
  'The store answers Elena some days after her call.',
  [
    'Estimada Elena:',
    'Gracias por su mensaje y disculpe el problema con su lavadora.',
    'El técnico vio la lavadora el lunes y nos dijo que no se puede arreglar.',
    'Ya que la lavadora tiene garantía, le vamos a devolver todo el dinero.',
    'Va a recibir el reembolso en su tarjeta en cinco días.',
    'Si prefiere una lavadora nueva, puede llamar al servicio al cliente.',
    'Atentamente,',
  ],
  { title: 'Su reembolso', to: 'Elena' },
);

export const ES_B1_U12: EsUnitDef = {
  names: ['Sofía', 'Nico', 'Jorge', 'Marta', 'Elena', 'Laura', 'Mérida', 'Bogotá'],
  support: [
    'lavadora',
    'quejarme',
    'quejo',
    'caliente',
    'resolvió',
    'resuelvo',
    'solicito',
    'poder',
    'cayó',
    'incluye',
  ],
  unit: {
    position: 12,
    title: 'Problems and solutions',
    titleEn: 'Problemas y soluciones',
    description:
      'Explain a problem with connectors of cause, consequence and concession, guess what is happening with a lo mejor, quizás and seguramente, make a formal complaint and negotiate a solution with customer service or a neighbor.',
    emoji: '🛠️',
    objective:
      'You can explain a problem and its causes, make a formal complaint politely and firmly, ask for a refund or a repair and negotiate a solution.',
    grammar: {
      title: 'Ya que · por lo tanto · aunque / a pesar de · a lo mejor, quizás, seguramente',
      explanation:
        'Connectors make a problem easy to follow. Cause: ya que (since, because) gives a reason the listener knows or can accept and often opens the sentence (ya que tiene garantía, el técnico va a arreglarla); porque is more neutral and usually comes after the main idea. Consequence: por lo tanto (therefore) is more formal than por eso and typical of emails and complaints; in the middle of a sentence it goes between a semicolon or comma and a comma. Concession: aunque + indicative admits a real fact that does not change the result (aunque es nueva, no funciona); a pesar de (in spite of, despite) is followed by a noun or an infinitive, never a conjugated verb (a pesar de la lluvia, a pesar de tener una reserva), and de + el contracts: a pesar del precio. Aunque + subjunctive (“even if”: aunque llueva) comes at the next level. Probability: a lo mejor (maybe) always takes the indicative (a lo mejor es el vecino); quizás (perhaps, also written quizá) usually takes the subjunctive when it comes before the verb (quizás pueda, quizás sea él), although the indicative is also heard; seguramente looks like “surely” but means probably, most likely, and takes the indicative (seguramente está en la oficina). In a formal complaint, use usted / ustedes and set phrases: Estimados señores: (Dear Sir or Madam), Les escribo para quejarme de… (I am writing to complain about…), Solicito un reembolso (I request a refund), Atentamente (Yours faithfully / Sincerely). Quejarse is reflexive and takes de: me quejo del ruido.',
      examples: [
        {
          target: 'Aunque la lavadora es nueva, no funciona.',
          base: 'Although the washing machine is new, it doesn’t work.',
        },
        {
          target: 'A lo mejor el técnico viene mañana.',
          base: 'Maybe the technician is coming tomorrow.',
        },
        {
          target: 'La lavadora llegó dañada; por lo tanto, solicito un reembolso.',
          base: 'The washing machine arrived damaged; therefore, I request a refund.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U12), borrador del 2026-11-27. Sin revisión nativa: revisar (1) «quizás + subjuntivo» presentado como la opción segura (también se oye con indicativo; «quizá» se menciona sólo en inglés); (2) «seguramente» traducido como «probably, surely»: se explica que en español expresa probabilidad alta, no certeza; (3) «reclamar» como «to claim, to complain» (en el Cono Sur también es quejarse en general; en México «poner una queja» es frecuente y no se enseña); (4) «a pesar que» sin «de» marcado como no estándar en una explicación; (5) «ya que» frente a «como» para causas al inicio de la oración (sólo se acepta «como» en las respuestas); (6) «se me cayó el celular» (se accidental) sin explicación gramatical propia: va como apoyo; (7) «el piso» como «floor» (en España sería «el suelo»; «piso» allí es apartamento); (8) el registro de la queja escrita (Estimados señores:, Les escribo para…, Atentamente,) y «disculpe el problema» en la respuesta de la tienda; (9) «Llamo porque…» en vez de «Le llamo porque…» (leísmo de cortesía frecuente en España y partes de América); (10) cifras: mil pesos por una pantalla, sin país concreto. Ningún dato de contacto en el correo de queja.',
    },
    words: [
      w(
        'es-aunque',
        'aunque',
        'although',
        'Aunque estoy cansado, voy a la fiesta.',
        'Although I’m tired, I’m going to the party.',
        ['b1', 'connectors'],
        { acceptedTranslations: ['even though'] },
      ),
      w(
        'es-por-lo-tanto',
        'por lo tanto',
        'therefore',
        'No tengo garantía; por lo tanto, tengo que pagar.',
        'I don’t have a warranty; therefore, I have to pay.',
        ['b1', 'connectors'],
        { acceptedTranslations: ['so', 'consequently'] },
      ),
      w(
        'es-ya-que',
        'ya que',
        'since, because',
        'Ya que llueve, nos quedamos en casa.',
        'Since it’s raining, we’re staying at home.',
        ['b1', 'connectors'],
        { acceptedTranslations: ['since', 'as'] },
      ),
      w(
        'es-a-pesar-de',
        'a pesar de',
        'in spite of',
        'A pesar de la lluvia, salimos.',
        'In spite of the rain, we went out.',
        ['b1', 'connectors'],
        { acceptedTranslations: ['despite'] },
      ),
      w(
        'es-a-lo-mejor',
        'a lo mejor',
        'maybe',
        'A lo mejor llueve mañana.',
        'Maybe it will rain tomorrow.',
        ['b1', 'probability'],
      ),
      w(
        'es-quizas',
        'quizás',
        'perhaps',
        'Quizás pueda ir el sábado.',
        'Perhaps I can go on Saturday.',
        ['b1', 'probability'],
        { acceptedTexts: ['quizá'] },
      ),
      w(
        'es-seguramente',
        'seguramente',
        'probably, surely',
        'Seguramente está en la oficina.',
        'She’s probably at the office.',
        ['b1', 'probability'],
        { acceptedTranslations: ['probably', 'most likely'] },
      ),
      w(
        'es-la-queja',
        'la queja',
        'complaint',
        'Mi vecino tiene una queja: hay mucho ruido.',
        'My neighbor has a complaint: there is a lot of noise.',
        ['b1', 'complaints'],
        { acceptedTranslations: ['the complaint'] },
      ),
      w(
        'es-quejarse',
        'quejarse',
        'to complain',
        'Mi abuelo siempre se queja del clima.',
        'My grandfather always complains about the weather.',
        ['b1', 'complaints'],
      ),
      w(
        'es-reclamar',
        'reclamar',
        'to claim, to complain',
        'Voy a reclamar mi dinero.',
        'I’m going to claim my money back.',
        ['b1', 'complaints'],
        { acceptedTranslations: ['to claim', 'to demand'] },
      ),
      w(
        'es-el-reembolso',
        'el reembolso',
        'refund',
        'Solicito un reembolso.',
        'I request a refund.',
        ['b1', 'complaints'],
        { acceptedTranslations: ['the refund'], emoji: '💸' },
      ),
      w(
        'es-la-garantia',
        'la garantía',
        'warranty',
        'La garantía es de un año.',
        'The warranty lasts one year.',
        ['b1', 'complaints'],
        { acceptedTranslations: ['guarantee', 'the warranty'] },
      ),
      w(
        'es-arreglar',
        'arreglar',
        'to fix',
        'El técnico va a arreglar la lavadora.',
        'The technician is going to fix the washing machine.',
        ['b1', 'problems'],
        { acceptedTranslations: ['to repair'], emoji: '🔧' },
      ),
      w(
        'es-resolver',
        'resolver',
        'to solve',
        'Quiero resolver el problema.',
        'I want to solve the problem.',
        ['b1', 'problems'],
        { acceptedTranslations: ['to resolve', 'to sort out'] },
      ),
      w(
        'es-el-tecnico',
        'el técnico',
        'technician',
        'El técnico viene el jueves.',
        'The technician is coming on Thursday.',
        ['b1', 'problems'],
        { acceptedTranslations: ['the technician', 'repairman'], emoji: '🧑‍🔧' },
      ),
      w('es-danado', 'dañado', 'damaged', 'Mi celular está dañado.', 'My cell phone is damaged.', [
        'b1',
        'problems',
      ]),
      w(
        'es-el-servicio-al-cliente',
        'el servicio al cliente',
        'customer service',
        'Llamé al servicio al cliente.',
        'I called customer service.',
        ['b1', 'complaints'],
        { acceptedTexts: ['la atención al cliente'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ya que · por lo tanto',
        objective: 'Explain the cause and the consequence of a problem.',
        intro: {
          explanation:
            'Ya que (since, because) introduces a cause the listener knows or can accept, and it often opens the sentence: ya que llueve, nos quedamos en casa. Porque does a similar job but usually comes after the main idea. Por lo tanto (therefore) introduces the consequence; it is more formal than por eso and very common in emails and complaints. In the middle of a sentence, put a semicolon or a comma before it and a comma after it: está dañado; por lo tanto, no funciona. Dañado (damaged) agrees like any adjective: el celular está dañado, la puerta está dañada. Arreglar means to fix or repair; in Mexico you will also hear componer.',
          examples: [
            {
              target: 'Ya que la computadora está dañada, no puedo trabajar.',
              base: 'Since the computer is damaged, I can’t work.',
            },
            {
              target: 'El carro está dañado; por lo tanto, voy en autobús.',
              base: 'The car is damaged; therefore, I’m going by bus.',
            },
          ],
        },
        takeaways: [
          'You explain a cause with ya que and a consequence with por lo tanto.',
          'You say that something is dañado and needs to be fixed (arreglar).',
        ],
        exercises: [
          ex.translationChoice(
            'ya que',
            'since, because',
            ['therefore', 'although', 'in spite of'],
            ['es-ya-que'],
            { id: 'es.ex.lhknh8ghe18vvt' },
          ),
          ex.translationChoice(
            'arreglar',
            'to fix',
            ['to complain', 'to break', 'to buy'],
            ['es-arreglar'],
            { id: 'es.ex.owwnlu709py9g2' },
          ),
          ex.matchPairs(
            [
              ['ya que', 'since, because'],
              ['por lo tanto', 'therefore'],
              ['dañado', 'damaged'],
              ['arreglar', 'to fix'],
            ],
            ['es-ya-que', 'es-por-lo-tanto', 'es-danado', 'es-arreglar'],
            { id: 'es.ex.zuj4ougboid9cr' },
          ),
          ex.fillBlank(
            'La puerta está ___.',
            'The door is damaged.',
            'dañada',
            ['dañado', 'dañados'],
            ['es-danado'],
            {
              id: 'es.ex.nz7zky8uq429x4',
              explanation:
                'Dañado is an adjective, so it agrees with the noun: la puerta is feminine and singular, so dañada.',
            },
          ),
          ex.fillBlank(
            '___ que llueve, nos quedamos en casa.',
            'Since it’s raining, we’re staying at home.',
            'Ya',
            ['Por', 'Si', 'Lo'],
            ['es-ya-que'],
            {
              id: 'es.ex.xymugz9m9hi4a6',
              explanation:
                'Ya que (since) introduces a cause and often opens the sentence. Si would be a condition and doesn’t take que.',
            },
          ),
          ex.listenChoice(
            'El celular está dañado; por lo tanto, no funciona.',
            [
              'El celular está dañado; por eso no funciona.',
              'La computadora está dañada; por lo tanto, no funciona.',
              'El celular no está dañado; por lo tanto, funciona.',
            ],
            ['es-danado', 'es-por-lo-tanto'],
            { id: 'es.ex.ln1dktp5ngj3ss' },
          ),
          ex.fillBlank(
            'No tengo dinero; ___, no voy de vacaciones.',
            'I don’t have any money; therefore, I’m not going on vacation.',
            'por lo tanto',
            ['ya que', 'porque'],
            ['es-por-lo-tanto', 'es-ya-que'],
            {
              id: 'es.ex.9ofphzemcs1rn3',
              explanation:
                'The second part is the consequence, so you need por lo tanto (therefore). Ya que and porque introduce a cause.',
            },
          ),
          ex.orderWords(
            'Mi hermano puede arreglar tu bicicleta.',
            'My brother can fix your bike.',
            ['es-arreglar'],
            { id: 'es.ex.yymmt39khasm9d' },
          ),
          ex.translateWrite(
            'Since my cell phone is damaged, I can’t call you.',
            'Ya que mi celular está dañado, no te puedo llamar.',
            ['es-ya-que', 'es-danado'],
            {
              id: 'es.ex.r8l6pch2uadt0b',
              acceptedAnswers: [
                'Ya que mi celular está dañado, no puedo llamarte.',
                'Ya que mi celular está dañado no te puedo llamar.',
                'Ya que mi celular está dañado no puedo llamarte.',
                'Como mi celular está dañado, no te puedo llamar.',
                'Como mi celular está dañado, no puedo llamarte.',
                'Ya que mi teléfono está dañado, no te puedo llamar.',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu computadora está dañada. ¿Qué vas a hacer?',
            'Say that you are going to fix it (use «voy a arreglar…»).',
            'Voy a arreglar la computadora.',
            [
              'Voy a arreglarla.',
              'La voy a arreglar.',
              'Voy a arreglar mi computadora.',
              'Voy a arreglar la computadora mañana.',
              'Voy a arreglar la compu.',
              'Voy a arreglar la computadora',
            ],
            ['es-arreglar', 'es-danado'],
            { id: 'es.ex.x99bbb0spultyx' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Aunque · a pesar de',
        objective:
          'Admit a fact that doesn’t change the result, and talk about warranties and repairs.',
        intro: {
          explanation:
            'Aunque (although) + indicative admits a real fact that does not change the result: aunque es nueva, la lavadora no funciona. The aunque part can go first or second: no funciona, aunque es nueva. A pesar de (in spite of, despite) is followed by a noun or an infinitive, never by a conjugated verb: a pesar de la lluvia, a pesar de tener garantía. De + el contracts here too: a pesar del precio. El técnico (la técnica for a woman) is the person who repairs appliances, computers or phones. La garantía is the warranty: tiene un año de garantía, la garantía no incluye la pantalla (the warranty doesn’t cover the screen). Pronunciation: garantía has a hard g, as in go (g before a, o, u), and the written accent puts the stress on the í: ga-ran-TÍ-a. Técnico is stressed on the first syllable: TÉC-ni-co.',
          examples: [
            {
              target: 'Aunque es nueva, la lavadora no funciona.',
              base: 'Although it’s new, the washing machine doesn’t work.',
            },
            {
              target: 'A pesar de la garantía, tengo que pagar.',
              base: 'In spite of the warranty, I have to pay.',
            },
          ],
        },
        takeaways: [
          'You admit a fact that doesn’t change the result with aunque + indicative.',
          'You use a pesar de + a noun or an infinitive, and talk about el técnico and la garantía.',
        ],
        exercises: [
          ex.translationChoice(
            'aunque',
            'although',
            ['therefore', 'since', 'maybe'],
            ['es-aunque'],
            { id: 'es.ex.wwqn81laqge4n4' },
          ),
          ex.translationChoice(
            'la garantía',
            'warranty',
            ['refund', 'complaint', 'receipt'],
            ['es-la-garantia'],
            { id: 'es.ex.b075dzpr1045r8' },
          ),
          ex.fillBlank(
            '___ estoy cansado, voy a la fiesta.',
            'Although I’m tired, I’m going to the party.',
            'Aunque',
            ['Ya que', 'Por lo tanto'],
            ['es-aunque', 'es-ya-que'],
            {
              id: 'es.ex.14pwkuvwetff7v',
              explanation:
                'Being tired is a reason not to go, but you go anyway: that’s a concession, so aunque. Ya que would give a cause, and por lo tanto a consequence.',
            },
          ),
          ex.fillBlank(
            'A pesar ___ precio, compré la computadora.',
            'In spite of the price, I bought the computer.',
            'del',
            ['de el', 'que', 'con'],
            ['es-a-pesar-de'],
            {
              id: 'es.ex.du1bz2sjv4gahe',
              explanation:
                'A pesar de + el precio contracts to a pesar del precio. “A pesar que” without de is heard in speech, but it isn’t standard.',
            },
          ),
          ex.listenChoice(
            'El técnico viene el jueves.',
            [
              'El técnico viene el martes.',
              'El técnico vino el jueves.',
              'La técnica viene el jueves.',
            ],
            ['es-el-tecnico'],
            { id: 'es.ex.2lvfht5s00ahfi' },
          ),
          ex.matchPairs(
            [
              ['aunque', 'although'],
              ['a pesar de', 'in spite of'],
              ['el técnico', 'technician'],
              ['la garantía', 'warranty'],
            ],
            ['es-aunque', 'es-a-pesar-de', 'es-el-tecnico', 'es-la-garantia'],
            { id: 'es.ex.g5090hco9bbuou' },
          ),
          question(
            'es.ex.alli8lwckztuoj',
            CELULAR,
            'What happened to Sofía’s phone?',
            'She dropped it and the screen is damaged',
            ['Someone stole it', 'The battery stopped working', 'She lost it on the bus'],
            ['es-danado'],
            'Sofía writes “Ayer se me cayó el celular y ahora la pantalla está dañada”: se me cayó means I dropped it (by accident).',
          ),
          question(
            'es.ex.p68timqsi5fp3r',
            CELULAR,
            'Why does Sofía have to pay to fix her phone?',
            'The warranty doesn’t cover the screen',
            [
              'The warranty is over',
              'The technician was rude',
              'She bought the phone in another store',
            ],
            ['es-la-garantia', 'es-aunque', 'es-por-lo-tanto'],
            'She writes “me dijo que la garantía no incluye la pantalla. Por lo tanto, tengo que pagar mil pesos”.',
          ),
          ex.translateWrite(
            'In spite of the rain, we went out.',
            'A pesar de la lluvia, salimos.',
            ['es-a-pesar-de'],
            {
              id: 'es.ex.r0565gjvroa348',
              acceptedAnswers: [
                'A pesar de la lluvia salimos.',
                'Salimos a pesar de la lluvia.',
                'A pesar de la lluvia, nosotros salimos.',
                'A pesar de la lluvia, salimos de casa.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Tu celular tiene garantía?',
            'Say yes, it has a one-year warranty (use «tiene un año de garantía»).',
            'Sí, tiene un año de garantía.',
            [
              'Tiene un año de garantía.',
              'Sí, tiene garantía de un año.',
              'Sí, la garantía es de un año.',
              'Sí, tiene un año de garantía',
              'Sí, mi celular tiene un año de garantía.',
            ],
            ['es-la-garantia'],
            { id: 'es.ex.30relbt1frfc0q' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'A lo mejor, quizás, seguramente',
        objective: 'Guess the cause of a problem and say how likely a solution is.',
        intro: {
          explanation:
            'To guess, Spanish has several options. A lo mejor (maybe) is very common in conversation and always takes the indicative: a lo mejor es el vecino. Quizás (perhaps; also written quizá) usually takes the subjunctive when it comes before the verb: quizás pueda (perhaps I can), quizás sea el vecino (perhaps it’s the neighbor), although you will also hear the indicative. Seguramente looks like “surely”, but it really means probably, most likely: seguramente es la música (it’s probably the music). Resolver (to solve) changes o to ue in the present (resuelvo, resuelves, resuelve) and has a regular preterite: resolvió. A lo mejor is said as one unit, with the stress at the end: a-lo-me-JOR.',
          examples: [
            {
              target: 'A lo mejor es la música del vecino.',
              base: 'Maybe it’s the neighbor’s music.',
            },
            {
              target: 'Seguramente el técnico puede resolver el problema.',
              base: 'The technician can probably solve the problem.',
            },
          ],
        },
        takeaways: [
          'You guess with a lo mejor (+ indicative), quizás (+ subjunctive) and seguramente.',
          'You talk about how to resolver un problema.',
        ],
        exercises: [
          ex.translationChoice(
            'seguramente',
            'probably, surely',
            ['certainly not', 'never', 'therefore'],
            ['es-seguramente'],
            { id: 'es.ex.j921mfh0kmo4kp' },
          ),
          ex.matchPairs(
            [
              ['a lo mejor', 'maybe'],
              ['quizás', 'perhaps'],
              ['seguramente', 'probably, surely'],
              ['resolver', 'to solve'],
            ],
            ['es-a-lo-mejor', 'es-quizas', 'es-seguramente', 'es-resolver'],
            { id: 'es.ex.fyfeifagwf7do8' },
          ),
          ex.fillBlank(
            'A lo mejor ___ la música del vecino.',
            'Maybe it’s the neighbor’s music.',
            'es',
            ['sea', 'fuera'],
            ['es-a-lo-mejor'],
            {
              id: 'es.ex.ztfnzq0p3r5fec',
              explanation:
                'A lo mejor always takes the indicative: a lo mejor es… The subjunctive sea goes with quizás (quizás sea…), and fuera is for unreal conditions (si fuera…).',
            },
          ),
          ex.fillBlank(
            'Quizás ___ ir a tu fiesta el sábado.',
            'Perhaps I can go to your party on Saturday.',
            'pueda',
            ['poder', 'puedes'],
            ['es-quizas'],
            {
              id: 'es.ex.a6vle1fqx87cbc',
              explanation:
                'Before the verb, quizás usually takes the subjunctive: puedo → pueda (yo). Puedes is “you can” and poder is the infinitive.',
            },
          ),
          ex.listenChoice(
            'Seguramente está en la oficina.',
            [
              'Seguramente está en la cocina.',
              'Seguramente estás en la oficina.',
              'Seguramente estaba en la oficina.',
            ],
            ['es-seguramente'],
            { id: 'es.ex.b58p3ngnd25ojz' },
          ),
          ex.fillBlank(
            'Seguramente el técnico va a ___ el problema.',
            'The technician is probably going to solve the problem.',
            'resolver',
            ['resolvió', 'resuelvo'],
            ['es-resolver', 'es-el-tecnico', 'es-seguramente'],
            {
              id: 'es.ex.8v6rnd8iag0syi',
              explanation:
                'After va a, use the infinitive: va a resolver. Resolvió is the preterite (he solved) and resuelvo the yo form of the present, with o → ue.',
            },
          ),
          question(
            'es.ex.u3bjryt8v5wud1',
            VECINOS,
            'According to Marta, what might be causing the noise?',
            'Her son playing the guitar',
            ['A party next door', 'The neighbor’s dog', 'The television'],
            ['es-a-lo-mejor'],
            'Marta guesses “A lo mejor es la música de mi hijo. Toca la guitarra todas las noches”.',
          ),
          question(
            'es.ex.kdgfej8znmgjkf',
            VECINOS,
            'Why is the noise a problem for Jorge?',
            'He works very early, so he goes to bed at ten',
            ['He works from home at night', 'He is sick', 'He is studying for an exam'],
            ['es-ya-que', 'es-por-lo-tanto'],
            'Jorge says “Ya que trabajo muy temprano, me acuesto a las diez. Por lo tanto, la guitarra es un problema para mí”.',
          ),
          ex.translateWrite(
            'Maybe it will rain tomorrow.',
            'A lo mejor llueve mañana.',
            ['es-a-lo-mejor'],
            {
              id: 'es.ex.maz8l5esusramz',
              acceptedAnswers: [
                'A lo mejor mañana llueve.',
                'Quizás llueva mañana.',
                'Quizá llueva mañana.',
                'Quizás mañana llueva.',
                'A lo mejor va a llover mañana.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Por qué no vino el técnico?',
            'Guess a reason with «a lo mejor» (for example, he is sick).',
            'A lo mejor está enfermo.',
            [
              'A lo mejor está enfermo',
              'Quizás esté enfermo.',
              'Seguramente está enfermo.',
              'A lo mejor tiene mucho trabajo.',
              'A lo mejor está cansado.',
              'A lo mejor no tiene tiempo.',
              'A lo mejor se olvidó.',
            ],
            ['es-a-lo-mejor'],
            { id: 'es.ex.cb38rwaw8rj12t' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Les escribo para quejarme',
        objective: 'Make a formal complaint and ask for a refund.',
        intro: {
          explanation:
            'Quejarse (to complain) is reflexive and takes de: me quejo, te quejas, se queja del ruido; with an infinitive, the pronoun goes at the end: para quejarme. In a formal email or call, use usted (one person) or ustedes (a company, a hotel) and fixed phrases: Estimados señores: (Dear Sir or Madam), Les escribo para quejarme de… (I am writing to complain about…), Solicito un reembolso (I request a refund) and Atentamente (Sincerely) before your name. La queja is the complaint itself. Reclamar means to claim what you are owed (reclamar un reembolso, reclamar el dinero) and, in many countries, to complain formally; you usually do it at el servicio al cliente (customer service). Be firm but polite: give the facts, the cause (ya que…) and what you want (por lo tanto, solicito…).',
          examples: [
            {
              target: 'Les escribo para quejarme del servicio.',
              base: 'I am writing to complain about the service.',
            },
            {
              target: 'Solicito un reembolso, ya que la lavadora llegó dañada.',
              base: 'I request a refund, since the washing machine arrived damaged.',
            },
          ],
        },
        takeaways: [
          'You make a formal complaint with usted and the set phrases of a complaint email.',
          'You ask for un reembolso and deal with el servicio al cliente.',
        ],
        exercises: [
          ex.fillBlank(
            'Si la lavadora está dañada, puedes ___ un reembolso.',
            'If the washing machine is damaged, you can claim a refund.',
            'reclamar',
            ['quejarse', 'arreglar'],
            ['es-reclamar', 'es-el-reembolso'],
            {
              id: 'es.ex.l3u29r6a0shk4l',
              explanation:
                'You reclamar something you are owed: reclamar un reembolso. Quejarse doesn’t take a direct object (and with tú it would be quejarte), and you arreglar a machine, not a refund.',
            },
          ),
          ex.matchPairs(
            [
              ['la queja', 'complaint'],
              ['reclamar', 'to claim, to complain'],
              ['el reembolso', 'refund'],
              ['el servicio al cliente', 'customer service'],
            ],
            ['es-la-queja', 'es-reclamar', 'es-el-reembolso', 'es-el-servicio-al-cliente'],
            { id: 'es.ex.xxpm4iy498ssrf' },
          ),
          ex.fillBlank(
            'Les escribo para ___ del servicio.',
            'I am writing to complain about the service.',
            'quejarme',
            ['quejarse', 'queja'],
            ['es-quejarse'],
            {
              id: 'es.ex.k5e7am06468ltr',
              explanation:
                'The pronoun matches the person: I am complaining, so quejarme (me attached to the infinitive). Quejarse is for él / ella / usted, and la queja is the noun.',
            },
          ),
          ex.fillBlank(
            'Mi vecino siempre se ___ del ruido.',
            'My neighbor always complains about the noise.',
            'queja',
            ['quejo', 'quejas'],
            ['es-quejarse', 'es-la-queja'],
            {
              id: 'es.ex.onz7pr8tjqd7pk',
              explanation:
                'Se queja is the él / ella form of quejarse (it looks just like the noun la queja). Me quejo is yo and te quejas is tú.',
            },
          ),
          ex.listenChoice(
            'Quiero hablar con el servicio al cliente.',
            [
              'Quiero hablar con el técnico.',
              'Quiero llamar al servicio al cliente.',
              'Puedo hablar con el servicio al cliente.',
            ],
            ['es-el-servicio-al-cliente'],
            { id: 'es.ex.d0v2gpgi7xn50y' },
          ),
          question(
            'es.ex.le1b2bvww90tm3',
            LLAMADA,
            'What is wrong with Elena’s washing machine?',
            'The door is damaged and there is water on the floor',
            ['It makes a lot of noise', 'It is the wrong color', 'It never arrived'],
            ['es-danado', 'es-el-servicio-al-cliente'],
            'Elena says “La puerta está dañada y hay agua en el piso”. In Latin America, el piso is the floor.',
          ),
          question(
            'es.ex.uyc8m0ava8ioin',
            HOTEL,
            'Why is Laura writing to the hotel?',
            'To complain about her stay',
            ['To make a new reservation', 'To thank the staff', 'To ask about prices'],
            ['es-la-queja', 'es-quejarse'],
            'The subject is “Queja por mi estadía”, and she writes “Les escribo para quejarme de mi estadía”.',
          ),
          question(
            'es.ex.1xfnvc6lh8g1zu',
            HOTEL,
            'What does Laura ask for?',
            'A refund for the first night',
            ['A free night', 'A bigger room', 'A new reservation in May'],
            ['es-el-reembolso', 'es-por-lo-tanto'],
            'She ends with “Por lo tanto, solicito un reembolso de la primera noche”.',
          ),
          ex.translateWrite('I request a refund.', 'Solicito un reembolso.', ['es-el-reembolso'], {
            id: 'es.ex.gl9okia9pavo1y',
            acceptedAnswers: [
              'Solicito el reembolso.',
              'Pido un reembolso.',
              'Quisiera un reembolso.',
              'Quiero un reembolso.',
              'Solicito un reembolso',
            ],
          }),
          ex.shortAnswer(
            'Servicio al cliente, buenas tardes. ¿En qué le puedo ayudar?',
            'Say that you are calling to complain about a damaged washing machine (use «quejarme»).',
            'Llamo para quejarme de una lavadora dañada.',
            [
              'Llamo para quejarme de una lavadora dañada',
              'Buenas tardes, llamo para quejarme de una lavadora dañada.',
              'Llamo para quejarme de mi lavadora, que llegó dañada.',
              'Le llamo para quejarme de una lavadora dañada.',
              'Quiero quejarme de una lavadora dañada.',
              'Llamo para quejarme porque la lavadora llegó dañada.',
            ],
            ['es-quejarse', 'es-danado'],
            { id: 'es.ex.az7sv78azbkybg' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Negociar una solución',
        objective: 'Explain a problem, negotiate a solution and reach an agreement politely.',
        intro: {
          explanation:
            'To negotiate, describe the problem (llegó dañado, no funciona), give the reason for your request (ya que…), admit what is fair (aunque…, a pesar de…) and say what you want (por lo tanto, solicito… / prefiero…). Listen to the other side and guess or propose politely: a lo mejor…, quizás…, seguramente podemos… Customer service usually speaks to you with usted, and you should answer the same way; with a neighbor or a friend, use tú. A soft opening (perdón, disculpe, ¿tiene un momento?) makes the conversation easier, and you already know how to accept a proposal: de acuerdo, perfecto, tienes razón.',
          examples: [
            {
              target: 'Aunque tiene garantía, prefiero un reembolso.',
              base: 'Although it has a warranty, I prefer a refund.',
            },
            {
              target: 'A lo mejor podemos encontrar una solución.',
              base: 'Maybe we can find a solution.',
            },
          ],
        },
        takeaways: [
          'You explain a problem and negotiate a solution with connectors.',
          'You choose usted or tú, and guess or propose politely.',
        ],
        exercises: [
          question(
            'es.ex.kmo24f4pom4r34',
            LLAMADA,
            'Why doesn’t Elena accept the technician’s visit?',
            'She works on Thursday and prefers a new machine or a refund',
            [
              'The technician can only come next month',
              'She doesn’t trust the technician',
              'The warranty is over',
            ],
            ['es-el-reembolso', 'es-ya-que', 'es-el-tecnico'],
            'Elena says “El jueves trabajo. Prefiero una lavadora nueva o un reembolso, ya que la compré hace muy poco”.',
          ),
          question(
            'es.ex.amyrk8npexvvph',
            TIENDA,
            'What did the technician say about the washing machine?',
            'It can’t be fixed',
            ['It is easy to fix', 'It isn’t damaged', 'It only needs a new door'],
            ['es-el-tecnico', 'es-arreglar'],
            'The store writes “El técnico vio la lavadora el lunes y nos dijo que no se puede arreglar”.',
          ),
          question(
            'es.ex.qlct9mbe5jts63',
            TIENDA,
            'How will Elena get her money back?',
            'On her card, in five days',
            ['In cash at the store', 'In one month', 'As a discount on a new washing machine'],
            ['es-el-reembolso', 'es-la-garantia', 'es-ya-que'],
            'The store writes “Va a recibir el reembolso en su tarjeta en cinco días”, because the machine has a warranty (ya que…).',
          ),
          question(
            'es.ex.ry2kty7gmhwvfj',
            VECINOS,
            'What solution do Jorge and Marta agree on?',
            'Her son will play only until half past nine',
            [
              'Her son will stop playing the guitar',
              'Jorge will move to another room',
              'Her son will play only on weekends',
            ],
            ['es-seguramente', 'es-quizas'],
            'Marta proposes “¿hasta las nueve y media está bien?” and Jorge answers “¡Perfecto!”.',
          ),
          question(
            'es.ex.4xu6e1mr4gy7p0',
            HOTEL,
            'What happened even though Laura had a reservation?',
            'She had to wait three hours for her room',
            ['She had to pay twice', 'She got a smaller room', 'She had to change hotels'],
            ['es-a-pesar-de', 'es-aunque'],
            'Laura writes “A pesar de tener una reserva, tuve que esperar tres horas por mi habitación”.',
          ),
          ex.fillBlank(
            '___ es nueva, la lavadora no funciona.',
            'Although it’s new, the washing machine doesn’t work.',
            'Aunque',
            ['A pesar de', 'Por lo tanto'],
            ['es-aunque', 'es-a-pesar-de'],
            {
              id: 'es.ex.r5az9jfqr621t1',
              explanation:
                'Aunque is followed by a conjugated verb: aunque es nueva. A pesar de needs a noun or an infinitive (a pesar de ser nueva), and por lo tanto introduces a consequence.',
            },
          ),
          ex.orderWords(
            'Seguramente el técnico viene mañana.',
            'The technician is probably coming tomorrow.',
            ['es-seguramente', 'es-el-tecnico'],
            { id: 'es.ex.2d5byb4eh4mj25' },
          ),
          ex.listenChoice(
            'Aunque tiene garantía, prefiero un reembolso.',
            [
              'Ya que tiene garantía, prefiero un reembolso.',
              'Aunque tiene garantía, prefiero una lavadora nueva.',
              'Aunque no tiene garantía, prefiero un reembolso.',
            ],
            ['es-aunque', 'es-el-reembolso', 'es-la-garantia'],
            { id: 'es.ex.kv4gywqw0g3j3a' },
          ),
          ex.translateWrite(
            'The washing machine arrived damaged; therefore, I request a refund.',
            'La lavadora llegó dañada; por lo tanto, solicito un reembolso.',
            ['es-por-lo-tanto', 'es-danado', 'es-el-reembolso'],
            {
              id: 'es.ex.8n4qxzq6y8zg38',
              acceptedAnswers: [
                'La lavadora llegó dañada, por lo tanto, solicito un reembolso.',
                'La lavadora llegó dañada; por lo tanto solicito un reembolso.',
                'La lavadora llegó dañada. Por lo tanto, solicito un reembolso.',
                'La lavadora llegó dañada, por lo tanto solicito un reembolso.',
                'La lavadora llegó dañada; por lo tanto, solicito el reembolso.',
              ],
            },
          ),
          ex.shortAnswer(
            'El técnico no puede ir hasta el lunes. ¿Qué prefiere usted?',
            'Say that you prefer a refund, since you can’t wait (use «ya que» and «esperar»).',
            'Prefiero un reembolso, ya que no puedo esperar.',
            [
              'Prefiero un reembolso ya que no puedo esperar.',
              'Ya que no puedo esperar, prefiero un reembolso.',
              'Prefiero un reembolso, ya que no puedo esperar hasta el lunes.',
              'Ya que no puedo esperar hasta el lunes, prefiero un reembolso.',
              'Prefiero el reembolso, ya que no puedo esperar.',
              'Prefiero un reembolso, ya que no puedo esperar',
            ],
            ['es-ya-que', 'es-el-reembolso'],
            { id: 'es.ex.elefg4k88jm6kk' },
          ),
        ],
      },
    ],
  },
};

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `You write at least ${minSentences} sentences`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Each sentence starts with a capital letter', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'You end with a full stop, an exclamation mark or a question mark',
    kind: 'end_punctuation',
  },
];

const base = { language: 'es', allowInvented: true as const, maxChars: 1500 };

/** Tareas de escritura de la unidad (docs/ES_B1.md): la guiada de L5 y la libre del final del B1. */
export const ES_B1_U12_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.queja-formal',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u12-l05',
    title: 'A formal complaint',
    instructions:
      'Write a formal complaint to a store, a hotel or a company (invent the details; no real names, addresses or contact data). Use usted / ustedes, explain the problem and why it happened, admit a fact with aunque or a pesar de, and say what you want.',
    prompts: ['¿Qué problema tuvo?', '¿Qué solicita?'],
    requirements: [
      {
        id: 'greeting',
        label: 'You open formally (Estimados señores:, Estimada señora…)',
        kind: 'pattern',
        patterns: [['estimado|estimada|estimados|estimadas']],
      },
      {
        id: 'complaint',
        label: 'You say why you are writing (les escribo para quejarme de…, una queja…)',
        kind: 'pattern',
        patterns: [['quejarme'], ['queja'], ['reclamar']],
      },
      {
        id: 'cause-consequence',
        label: 'You give a cause or a consequence (ya que, por lo tanto)',
        kind: 'pattern',
        patterns: [
          ['ya', 'que'],
          ['por', 'lo', 'tanto'],
        ],
      },
      {
        id: 'concession',
        label: 'You admit a fact with aunque or a pesar de',
        kind: 'pattern',
        patterns: [['aunque'], ['a', 'pesar', 'de|del']],
      },
      {
        id: 'request',
        label: 'You say what you want (solicito un reembolso, prefiero…, quisiera…)',
        kind: 'pattern',
        patterns: [['solicito'], ['reembolso'], ['prefiero'], ['quisiera']],
      },
      ...common(5),
    ],
    model:
      'Estimados señores: Les escribo para quejarme de una computadora que compré en su tienda el mes pasado. Aunque es nueva, la pantalla llegó dañada y no funciona. Ya que tiene un año de garantía, llamé al servicio al cliente dos veces, pero nadie resolvió el problema. Por lo tanto, solicito un reembolso de todo el dinero. Muchas gracias.',
    checklist: [
      'I use usted / ustedes all the way through (les escribo, su tienda).',
      'I open with Estimados señores: and can close with Atentamente before my name.',
      'I use aunque + a conjugated verb, and a pesar de + a noun or an infinitive.',
    ],
  },
  {
    ...base,
    id: 'es.b1.wt.libre-problema',
    kind: 'free',
    codes: [],
    lesson: 'es-b1-u12-final',
    block: 1,
    title: 'Free writing: a problem you solved',
    instructions:
      'Write about a problem you had (with a purchase, a trip, a neighbor, at work…): what happened, why, what you did and how it was solved in the end. There is no right answer: compare your text with the model and go through the checklist.',
    prompts: ['¿Qué pasó?', '¿Cómo se resolvió el problema?'],
    requirements: [
      {
        id: 'connectors',
        label: 'Tip: link your ideas (ya que, por lo tanto, aunque, a pesar de)',
        kind: 'pattern',
        patterns: [['ya', 'que'], ['por', 'lo', 'tanto'], ['aunque'], ['a', 'pesar', 'de|del']],
        optional: true,
      },
      {
        id: 'guess',
        label: 'Tip: guess a cause (a lo mejor, quizás, seguramente)',
        kind: 'pattern',
        patterns: [['a', 'lo', 'mejor'], ['quizás|quizá'], ['seguramente']],
        optional: true,
      },
      { id: 'words', label: 'Tip: about 80 words', kind: 'min_words', min: 80, optional: true },
    ],
    model:
      'El año pasado tuve un problema con un vuelo a Bogotá. Llegué al aeropuerto muy temprano, pero el vuelo no salió. A lo mejor fue por la tormenta, pero nadie nos dijo nada. Aunque estuve cinco horas en el aeropuerto, no había otro vuelo. Por lo tanto, llamé al servicio al cliente para reclamar un reembolso. Ya que tenía mi boleto, la empresa me devolvió todo el dinero en una semana. A pesar del susto, al final todo salió bien. Para mí, es importante reclamar con respeto.',
    checklist: [
      'I tell the events in the preterite and describe the situation in the imperfect.',
      'I explain causes and consequences with ya que and por lo tanto.',
      'I end by saying how the problem was solved and what I learned.',
    ],
  },
];

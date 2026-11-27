import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U6 «Planes e invitaciones» (docs/IT_A1_A2.md): invitar (ti va di…?, che ne dici di…?),
 * aceptar y rechazar (volentieri, d'accordo, mi dispiace, devo…), el futuro semplice (andrò, farò,
 * sarà, verrò), prossimo y tra (tra due giorni = dentro de dos días), y el aperitivo.
 * Falsos amigos: magari es «ojalá / quizás»; mi dispiace es «lo siento» (no «me disgusta»).
 * Expresión regional identificada: daje (Roma) = «¡dale!».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const INVITO = dialogue('it.stim.a2-u6-invito', 'Chiara le deja un mensaje de voz a Marco.', [
  ['Chiara', 'Ciao Marco, sono Chiara! Sabato prossimo faccio una festa per il mio compleanno.'],
  ['Chiara', 'Ti va di venire? Sarà a casa mia, alle nove. Porta anche Sara, se vuole!'],
  ['Chiara', 'Fammi sapere. Ciao!'],
]);

const RISPOSTE = reading(
  'it.stim.a2-u6-risposte',
  'message',
  'Las respuestas en el grupo de amigos de Chiara.',
  [
    'Marco: Volentieri! Verrò con Sara. Porto il dolce?',
    'Luca: Mi dispiace, sabato non posso: devo lavorare.',
    'Giulia: Magari! Ma sono a Torino fino a domenica…',
    'Chiara: Che peccato! Allora ci vediamo la prossima volta.',
  ],
  { title: 'Festa di Chiara 🎉' },
);

const APERITIVO = dialogue(
  'it.stim.a2-u6-aperitivo',
  'Dos compañeros de trabajo de Roma arreglan para salir.',
  [
    ['Valerio', 'Che ne dici di un aperitivo dopo il lavoro?'],
    ['Francesca', 'D’accordo! Dove andiamo?'],
    ['Valerio', 'C’è un bar nuovo in piazza Navona. Daje, andiamo lì!'],
    ['Francesca', 'Perfetto. Ci vediamo alle sette?'],
    ['Valerio', 'Alle sette e mezza, va bene?'],
  ],
);

const PROGRAMMI = reading(
  'it.stim.a2-u6-programmi',
  'post',
  'Sofia cuenta sus planes para el verano.',
  [
    'L’estate prossima farò un viaggio in Puglia con i miei amici.',
    'Andremo al mare tutti i giorni e mangeremo tanto pesce.',
    'Partiremo tra due mesi: non vedo l’ora!',
  ],
  { from: 'Sofia', title: 'Estate in Puglia' },
);

export const IT_A2_U06: ItUnitDef = {
  names: [
    'Chiara',
    'Marco',
    'Sara',
    'Luca',
    'Giulia',
    'Torino',
    'Valerio',
    'Francesca',
    'Navona',
    'Sofia',
    'Puglia',
  ],
  support: [
    'se',
    'vuole',
    'fammi',
    'sapere',
    'porto',
    'peccato',
    'daje',
    'lì',
    'nuovo',
    'andremo',
    'mangeremo',
    'partiremo',
    'vedo',
    'vieni',
    'studiare',
    'farai',
    'giornata',
    'bellissima',
    'tanto',
    'lavorare',
    'parto',
    'prendere',
  ],
  unit: {
    position: 6,
    title: 'Planes e invitaciones',
    titleEn: 'Inviti e programmi',
    description:
      'Invitar, aceptar y rechazar con amabilidad, ponerse de acuerdo para salir y contar planes con el futuro (andrò, farò, sarà).',
    emoji: '🥂',
    objective:
      'Puedes invitar a alguien (ti va di…?, che ne dici di…?), aceptar o rechazar con amabilidad, arreglar día y hora, y contar tus planes con el futuro.',
    grammar: {
      title: 'Invitar y responder · futuro semplice',
      explanation:
        'Para invitar: ti va di + infinitivo? (¿tienes ganas de…?) o che ne dici di…? (¿qué te parece…?). Aceptar: volentieri!, d’accordo. Rechazar: mi dispiace, non posso: devo lavorare. El futuro: -are / -ere → -erò, -ire → -irò; irregulares frecuentes: andrò, farò, sarò / sarà, verrò. Para planes cercanos alcanza el presente: domani vado al mare. Tra due giorni es «dentro de dos días». Ojo: magari es «¡ojalá!» o «quizás».',
      examples: [
        { target: 'Ti va di venire alla festa?', base: '¿Tienes ganas de venir a la fiesta?' },
        {
          target: 'Mi dispiace, non posso: devo lavorare.',
          base: 'Lo siento, no puedo: tengo que trabajar.',
        },
        {
          target: 'L’estate prossima andrò in Puglia.',
          base: 'El verano que viene voy a ir a Puglia.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U6). Sin revisión nativa: revisar daje (romano), el registro del grupo de mensajes y el futuro con planes cercanos.',
    },
    words: [
      w(
        'it-ti-va-di',
        'ti va di…?',
        '¿tienes ganas de…?',
        'Ti va di venire al cinema?',
        '¿Tienes ganas de venir al cine?',
        ['invitations'],
        {
          acceptedTexts: ['ti va di?'],
          acceptedTranslations: ['¿te pinta…?', '¿querés…?', '¿quieres…?', '¿tenés ganas de…?'],
        },
      ),
      w(
        'it-che-ne-dici',
        'che ne dici?',
        '¿qué te parece?',
        'Che ne dici di un aperitivo?',
        '¿Qué te parece un aperitivo?',
        ['invitations', 'questions'],
      ),
      w('it-invitare', 'invitare', 'invitar', 'Voglio invitare Marco.', 'Quiero invitar a Marco.', [
        'invitations',
        'verbs',
      ]),
      w(
        'it-festa',
        'festa',
        'fiesta',
        'Sabato faccio una festa.',
        'El sábado hago una fiesta.',
        ['invitations', 'free-time'],
        { emoji: '🎉' },
      ),
      w(
        'it-volentieri',
        'volentieri',
        'con gusto',
        'Volentieri, grazie!',
        '¡Con gusto, gracias!',
        ['invitations'],
        {
          acceptedTranslations: ['con mucho gusto', 'encantado', 'encantada'],
        },
      ),
      w(
        'it-mi-dispiace',
        'mi dispiace',
        'lo siento',
        'Mi dispiace, non posso.',
        'Lo siento, no puedo.',
        ['invitations', 'polite'],
        {
          acceptedTranslations: ['qué lástima'],
        },
      ),
      w('it-devo', 'devo', 'tengo que', 'Devo lavorare.', 'Tengo que trabajar.', ['verbs'], {
        acceptedTranslations: ['debo'],
      }),
      w(
        'it-magari',
        'magari',
        'ojalá',
        'Magari! Ma non posso.',
        '¡Ojalá! Pero no puedo.',
        ['invitations'],
        {
          acceptedTranslations: ['quizás', 'a lo mejor'],
        },
      ),
      w(
        'it-d-accordo',
        "d'accordo",
        'de acuerdo',
        "D'accordo, a domani!",
        '¡De acuerdo, hasta mañana!',
        ['invitations'],
        {
          acceptedTexts: ['d’accordo'],
          acceptedTranslations: ['dale', 'está bien'],
        },
      ),
      w(
        'it-ci-vediamo',
        'ci vediamo',
        'nos vemos',
        'Ci vediamo alle sette.',
        'Nos vemos a las siete.',
        ['invitations'],
      ),
      w(
        'it-prossimo',
        'prossimo',
        'que viene',
        'Sabato prossimo vado al mare.',
        'El sábado que viene voy al mar.',
        ['time'],
        {
          acceptedTexts: ['prossima'],
          acceptedTranslations: ['próximo', 'próxima'],
        },
      ),
      w(
        'it-tra',
        'tra',
        'dentro de (… tiempo)',
        'Parto tra due giorni.',
        'Me voy dentro de dos días.',
        ['time'],
        {
          acceptedTexts: ['fra'],
          acceptedTranslations: ['dentro de', 'en'],
        },
      ),
      w(
        'it-andro',
        'andrò',
        'iré',
        'Domani andrò al mare.',
        'Mañana voy a ir al mar.',
        ['verbs', 'future'],
        {
          acceptedTranslations: ['voy a ir'],
        },
      ),
      w(
        'it-faro',
        'farò',
        'haré',
        'Farò un viaggio.',
        'Voy a hacer un viaje.',
        ['verbs', 'future'],
        {
          acceptedTranslations: ['voy a hacer'],
        },
      ),
      w(
        'it-sara',
        'sarà',
        'será',
        'Sarà una bella festa.',
        'Va a ser una linda fiesta.',
        ['verbs', 'future'],
        {
          acceptedTranslations: ['va a ser'],
        },
      ),
      w(
        'it-verro',
        'verrò',
        'vendré',
        'Verrò con Sara.',
        'Voy a ir con Sara.',
        ['verbs', 'future'],
        {
          acceptedTranslations: ['voy a venir'],
        },
      ),
      w(
        'it-aperitivo',
        'aperitivo',
        'aperitivo',
        'Prendiamo un aperitivo?',
        '¿Tomamos un aperitivo?',
        ['food', 'free-time'],
        {
          emoji: '🍹',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ti va di…?',
        objective: 'Invitar a alguien y aceptar una invitación.',
        intro: {
          explanation:
            'Para invitar: ti va di + infinitivo? (¿tienes ganas de…?) o che ne dici di…? (¿qué te parece…?). Para aceptar: volentieri! (¡con gusto!). Ojo: «invitar a Marco» es invitare Marco, sin a.',
          examples: [
            { target: 'Ti va di venire alla festa?', base: '¿Tienes ganas de venir a la fiesta?' },
            { target: 'Volentieri, grazie!', base: '¡Con gusto, gracias!' },
          ],
        },
        takeaways: ['Invitas con ti va di…? y che ne dici di…?', 'Aceptas con volentieri.'],
        exercises: [
          ex.translationChoice(
            'ti va di…?',
            '¿tienes ganas de…?',
            ['¿te vas de…?', '¿te gusta…?', '¿vas a…?'],
            ['it-ti-va-di'],
            {
              id: 'it.ex.e90arlt68i79u4',
            },
          ),
          ex.translationChoice(
            'che ne dici?',
            '¿qué te parece?',
            ['¿cuántos tienes?', '¿qué hora es?', '¿de qué hablas?'],
            ['it-che-ne-dici'],
            {
              id: 'it.ex.gmxikclo4y7irs',
            },
          ),
          ex.listenChoice(
            'Ti va di venire alla festa?',
            ['Ti va di venire al cinema?', 'Vuoi venire alla festa?', 'Ti piace la festa?'],
            ['it-ti-va-di', 'it-festa'],
            { id: 'it.ex.5j27eeed1tdmnt' },
          ),
          ex.fillBlank(
            'Che ne ___ di un aperitivo?',
            '¿Qué te parece un aperitivo?',
            'dici',
            ['dice', 'fai', 'vai'],
            ['it-che-ne-dici', 'it-aperitivo'],
            {
              id: 'it.ex.6u2khbqrtl4kwq',
            },
          ),
          ex.fillBlank(
            'Sabato faccio una ___ a casa mia.',
            'El sábado hago una fiesta en mi casa.',
            'festa',
            ['spesa', 'partita', 'vacanza'],
            ['it-festa'],
            {
              id: 'it.ex.22ozg7ahzo36ad',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.wuvwgx3y792mnd',
            INVITO,
            '¿Para qué llama Chiara a Marco?',
            'Para invitarlo a su fiesta de cumpleaños el sábado',
            [
              'Para pedirle ayuda con una fiesta',
              'Para cancelar la fiesta',
              'Para invitarlo a cenar el domingo',
            ],
            ['it-ti-va-di', 'it-invitare', 'it-prossimo'],
            'Chiara dice: «Sabato prossimo faccio una festa per il mio compleanno. Ti va di venire?».',
          ),
          question(
            'it.ex.g91ud6sk71njdf',
            INVITO,
            '¿Dónde y a qué hora es la fiesta?',
            'En la casa de Chiara, a las nueve',
            [
              'En un bar, a las nueve',
              'En la casa de Sara, a las ocho',
              'En la casa de Marco, a las diez',
            ],
            ['it-sara', 'it-festa'],
            'Chiara dice: «Sarà a casa mia, alle nove».',
          ),
          ex.shortAnswer(
            'Ti va di andare al cinema?',
            '¿Tienes ganas de ir al cine? (Responde que sí, con gusto.)',
            'Sì, volentieri!',
            ['Volentieri!', 'Sì, volentieri.', 'Volentieri, grazie!'],
            ['it-volentieri'],
            { id: 'it.ex.r7f887n93o94gi' },
          ),
          ex.translateWrite(
            'Quiero invitar a Marco.',
            'Voglio invitare Marco.',
            ['it-invitare', 'it-voglio'],
            {
              id: 'it.ex.fynt84j6rm18mf',
              acceptedAnswers: ['Voglio invitare Marco alla festa.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Volentieri! Mi dispiace…',
        objective: 'Aceptar y rechazar con amabilidad.',
        intro: {
          explanation:
            'Para aceptar: d’accordo (de acuerdo, vale). Para rechazar: mi dispiace (lo siento), non posso, devo lavorare (tengo que trabajar). Ojo: magari! es «¡ojalá!» (y magari solo, «quizás»).',
          examples: [
            {
              target: 'Mi dispiace, non posso: devo lavorare.',
              base: 'Lo siento, no puedo: tengo que trabajar.',
            },
            { target: 'Magari! Ma sono a Torino.', base: '¡Ojalá! Pero estoy en Turín.' },
          ],
        },
        takeaways: ['Rechazas con mi dispiace y devo…', 'Sabes que magari es «ojalá».'],
        exercises: [
          ex.translationChoice(
            'magari',
            'ojalá',
            ['mágicamente', 'nunca', 'a veces'],
            ['it-magari'],
            {
              id: 'it.ex.u99dm05n4ihxqf',
              explanation: 'Falso amigo: magari! es «¡ojalá!»; magari vengo es «quizás vengo».',
            },
          ),
          ex.translationChoice(
            'mi dispiace',
            'lo siento',
            ['me disgusta', 'no me gusta', 'me da igual'],
            ['it-mi-dispiace'],
            {
              id: 'it.ex.l5zwwo2tsah9qb',
              explanation: 'Mi dispiace es «lo siento» o «qué lástima», no «me disgusta».',
            },
          ),
          ex.fillBlank(
            'Mi dispiace, non posso: ___ lavorare.',
            'Lo siento, no puedo: tengo que trabajar.',
            'devo',
            ['voglio', 'posso', 'vado'],
            ['it-devo', 'it-mi-dispiace'],
            {
              id: 'it.ex.tmfc8rkq17fyi3',
            },
          ),
          ex.listenChoice(
            "D'accordo, ci vediamo sabato.",
            [
              "D'accordo, ci vediamo domenica.",
              'Mi dispiace, sabato non posso.',
              "D'accordo, a sabato.",
            ],
            ['it-d-accordo', 'it-ci-vediamo'],
            { id: 'it.ex.3acb8kmdsjvomw' },
          ),
          question(
            'it.ex.ult2yngec4slbg',
            RISPOSTE,
            '¿Quién no puede ir y por qué?',
            'Luca, porque tiene que trabajar',
            [
              'Marco, porque está con Sara',
              'Giulia, porque está enferma',
              'Luca, porque no le gustan las fiestas',
            ],
            ['it-devo', 'it-mi-dispiace'],
            'Luca escribe: «Mi dispiace, sabato non posso: devo lavorare».',
          ),
          question(
            'it.ex.eiwkp56ox99ptv',
            RISPOSTE,
            '¿Qué quiere decir Giulia con «Magari!»?',
            'Que le encantaría ir, pero está en Turín',
            ['Que tal vez vaya', 'Que no tiene ganas', 'Que va a llegar tarde'],
            ['it-magari'],
            'Giulia escribe: «Magari! Ma sono a Torino fino a domenica…».',
          ),
          question(
            'it.ex.1sc9ks4zbrptdi',
            RISPOSTE,
            '¿Qué ofrece llevar Marco?',
            'El postre',
            ['Las bebidas', 'Música', 'Nada'],
            ['it-verro', 'it-il-dolce'],
            'Marco escribe: «Verrò con Sara. Porto il dolce?».',
          ),
          ex.shortAnswer(
            'Vieni alla festa sabato?',
            '¿Vienes a la fiesta el sábado? (Di que lo sientes, que no puedes porque tienes que trabajar.)',
            'Mi dispiace, non posso: devo lavorare.',
            [
              'Mi dispiace, non posso. Devo lavorare.',
              'Mi dispiace, devo lavorare.',
              'Non posso, devo lavorare.',
              'Mi dispiace, non posso, devo lavorare.',
            ],
            ['it-mi-dispiace', 'it-devo'],
            { id: 'it.ex.494zk6x9nmdjmb' },
          ),
          ex.translateWrite(
            'Lo siento, tengo que estudiar.',
            'Mi dispiace, devo studiare.',
            ['it-mi-dispiace', 'it-devo'],
            {
              id: 'it.ex.s51l04qnnjrgpa',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Sabato prossimo, tra due giorni',
        objective: 'Arreglar día y hora para encontrarse.',
        intro: {
          explanation:
            'Prossimo es «que viene»: sabato prossimo, la settimana prossima. Tra (o fra) + tiempo es «dentro de»: tra due giorni. Para despedirse con una cita: ci vediamo alle sette (nos vemos a las siete).',
          examples: [
            { target: 'Ci vediamo sabato prossimo.', base: 'Nos vemos el sábado que viene.' },
            { target: 'Parto tra due giorni.', base: 'Me voy dentro de dos días.' },
          ],
        },
        takeaways: ['Dices sabato prossimo y tra due giorni.', 'Arreglas una cita con ci vediamo…'],
        exercises: [
          ex.translationChoice(
            'tra due giorni',
            'dentro de dos días',
            ['hace dos días', 'cada dos días', 'entre dos días'],
            ['it-tra'],
            {
              id: 'it.ex.dvetvz0v35tjg8',
              explanation:
                'Tra + tiempo mira al futuro: «dentro de». Hace dos días es due giorni fa.',
            },
          ),
          ex.fillBlank(
            'Sabato ___ vado al mare.',
            'El sábado que viene voy al mar.',
            'prossimo',
            ['prossima', 'scorso', 'tra'],
            ['it-prossimo'],
            {
              id: 'it.ex.2uirbk71ykk3q0',
            },
          ),
          ex.fillBlank(
            'La settimana ___ vado a Roma.',
            'La semana que viene voy a Roma.',
            'prossima',
            ['prossimo', 'scorsa', 'fa'],
            ['it-prossimo'],
            {
              id: 'it.ex.r734rvdu6ef4y7',
              explanation: 'Settimana es femenino: la settimana prossima.',
            },
          ),
          ex.listenChoice(
            'Ci vediamo tra un’ora.',
            ['Ci vediamo tra due ore.', 'Ci vediamo alle otto.', 'Ci vediamo un’ora fa.'],
            ['it-ci-vediamo', 'it-tra'],
            { id: 'it.ex.al971np7u143ju' },
          ),
          question(
            'it.ex.zlq8w00aotgjzm',
            APERITIVO,
            '¿Qué propone Valerio?',
            'Tomar un aperitivo después del trabajo',
            ['Cenar en su casa', 'Ir al cine', 'Almorzar en la plaza'],
            ['it-che-ne-dici', 'it-aperitivo'],
            'Valerio dice: «Che ne dici di un aperitivo dopo il lavoro?».',
          ),
          question(
            'it.ex.2o3cbz4k8z9988',
            APERITIVO,
            '¿Qué significa «Daje» en lo que dice Valerio?',
            '«¡Vamos!», una expresión típica de Roma',
            ['«Déjalo»', '«Te doy»', '«Despacio»'],
            ['it-d-accordo'],
            'Valerio dice «Daje, andiamo lì!»: daje es una expresión romana para animar, como «¡vamos!».',
          ),
          question(
            'it.ex.gb9n7v3dc9zsd2',
            APERITIVO,
            '¿A qué hora se encuentran al final?',
            'A las siete y media',
            ['A las siete', 'A las ocho', 'A las seis y media'],
            ['it-ci-vediamo'],
            'Valerio propone: «Alle sette e mezza, va bene?».',
          ),
          ex.shortAnswer(
            'Quando ci vediamo?',
            '¿Cuándo nos vemos? (Responde que el sábado que viene.)',
            'Ci vediamo sabato prossimo.',
            ['Sabato prossimo.', 'Ci vediamo sabato prossimo!'],
            ['it-ci-vediamo', 'it-prossimo'],
            { id: 'it.ex.y8lrca7tkkdz97' },
          ),
          ex.translateWrite(
            'Nos vemos dentro de una semana.',
            'Ci vediamo tra una settimana.',
            ['it-ci-vediamo', 'it-tra'],
            {
              id: 'it.ex.zkgltxg12y02qn',
              acceptedAnswers: ['Ci vediamo fra una settimana.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Andrò, farò, sarà',
        objective: 'Contar planes con el futuro.',
        intro: {
          explanation:
            'El futuro semplice: -are / -ere → -erò (parlerò), -ire → -irò (partirò); con noi, -emo (andremo, partiremo). Irregulares frecuentes: andrò, farò, sarò / sarà, verrò. Para planes cercanos también sirve el presente: domani vado al mare.',
          examples: [
            {
              target: 'L’estate prossima andrò in Puglia.',
              base: 'El verano que viene voy a ir a Puglia.',
            },
            { target: 'Sarà una bella festa.', base: 'Va a ser una linda fiesta.' },
          ],
        },
        takeaways: ['Usas andrò, farò, sarà y verrò.', 'Cuentas planes de las vacaciones.'],
        exercises: [
          ex.translationChoice('farò', 'haré', ['hice', 'hago', 'hacía'], ['it-faro'], {
            id: 'it.ex.xhcs65n2gy99qr',
          }),
          ex.matchPairs(
            [
              ['andrò', 'iré'],
              ['farò', 'haré'],
              ['sarà', 'será'],
              ['verrò', 'vendré'],
            ],
            ['it-andro', 'it-faro', 'it-sara', 'it-verro'],
            { id: 'it.ex.pzo8d4w2m4h0nw' },
          ),
          ex.listenChoice(
            'L’estate prossima andrò in Puglia.',
            [
              'L’estate scorsa sono andato in Puglia.',
              'L’estate prossima andrò in Sicilia.',
              'L’inverno prossimo andrò in Puglia.',
            ],
            ['it-andro', 'it-prossimo'],
            { id: 'it.ex.l1q2u0svdso8iw' },
          ),
          ex.fillBlank(
            'Domani ___ una bella giornata.',
            'Mañana va a ser un lindo día.',
            'sarà',
            ['era', 'è stata', 'siamo'],
            ['it-sara'],
            {
              id: 'it.ex.j1el91m57d3p5o',
            },
          ),
          ex.fillBlank(
            'Sabato ___ alla festa con Sara.',
            'El sábado voy a ir a la fiesta con Sara.',
            'andrò',
            ['andavo', 'sono andato', 'vanno'],
            ['it-andro', 'it-festa'],
            {
              id: 'it.ex.9m0oq8wtnv748z',
            },
          ),
          question(
            'it.ex.xla01tbdh464p2',
            PROGRAMMI,
            '¿Qué va a hacer Sofia el verano que viene?',
            'Un viaje a Puglia con sus amigos',
            ['Un viaje a Sicilia con su familia', 'Trabajar en la playa', 'Quedarse en casa'],
            ['it-faro', 'it-viaggio'],
            'Sofia escribe: «L’estate prossima farò un viaggio in Puglia con i miei amici».',
          ),
          question(
            'it.ex.me6b2htemifw85',
            PROGRAMMI,
            '¿Cuándo se van?',
            'Dentro de dos meses',
            ['Hace dos meses', 'En dos semanas', 'El mes que viene'],
            ['it-tra'],
            'Sofia escribe: «Partiremo tra due mesi».',
          ),
          question(
            'it.ex.b6rfkuuw5wxxra',
            PROGRAMMI,
            '¿Qué quiere decir «non vedo l’ora»?',
            'Que tiene muchas ganas (como «no veo la hora»)',
            ['Que no sabe la hora', 'Que no tiene tiempo', 'Que llega tarde'],
            ['it-andro'],
            '«Non vedo l’ora» es igual que nuestro «no veo la hora»: tiene muchas ganas.',
          ),
          ex.shortAnswer(
            'Cosa farai domani?',
            '¿Qué vas a hacer mañana? (Responde que vas a ir al mar.)',
            'Domani andrò al mare.',
            ['Andrò al mare.', 'Domani vado al mare.', 'Vado al mare.'],
            ['it-andro', 'it-mare'],
            { id: 'it.ex.480crhkxkby6h6' },
          ),
          ex.translateWrite(
            'Mañana voy a hacer las compras.',
            'Domani farò la spesa.',
            ['it-faro', 'it-la-spesa'],
            {
              id: 'it.ex.6aajln9ukp01yp',
              acceptedAnswers: ['Domani faccio la spesa.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: "Un aperitivo? D'accordo!",
        objective: 'Organizar una salida de principio a fin.',
        intro: {
          explanation:
            'En Italia, l’aperitivo es una costumbre: después del trabajo se toma algo con picoteo antes de cenar, como nuestra previa. Para organizar: propones (che ne dici…?), arreglas (ci vediamo alle…) y confirmas (d’accordo!).',
          examples: [
            { target: 'Che ne dici di un aperitivo?', base: '¿Qué te parece un aperitivo?' },
            { target: "D'accordo, alle sette!", base: '¡De acuerdo, a las siete!' },
          ],
        },
        takeaways: [
          'Organizas una salida: propones, arreglas y confirmas.',
          'Conoces la costumbre del aperitivo.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['volentieri', 'con gusto'],
              ['mi dispiace', 'lo siento'],
              ["d'accordo", 'de acuerdo'],
              ['magari', 'ojalá'],
            ],
            ['it-volentieri', 'it-mi-dispiace', 'it-d-accordo', 'it-magari'],
            { id: 'it.ex.szc5vkwaxrekb1' },
          ),
          ex.fillBlank(
            'Ti va di prendere un ___ dopo il lavoro?',
            '¿Tienes ganas de tomar un aperitivo después del trabajo?',
            'aperitivo',
            ['pranzo', 'volo', 'dolce'],
            ['it-aperitivo', 'it-ti-va-di'],
            { id: 'it.ex.etjhox52fhieu2', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Che ne dici di sabato prossimo?',
            [
              'Che ne dici di sabato scorso?',
              'Che ne dici di domenica prossima?',
              'Che fai sabato prossimo?',
            ],
            ['it-che-ne-dici', 'it-prossimo'],
            { id: 'it.ex.q36uwsejh4i7c4' },
          ),
          question(
            'it.ex.axv0efmins6k2m',
            INVITO,
            '¿A quién más invita Chiara?',
            'A Sara, si quiere ir',
            ['A Luca y a Giulia', 'A toda la familia de Marco', 'A nadie más'],
            ['it-invitare'],
            'Chiara dice: «Porta anche Sara, se vuole!».',
          ),
          ex.orderWords(
            'Sarà una festa bellissima.',
            'Va a ser una fiesta buenísima.',
            ['it-sara', 'it-festa'],
            { id: 'it.ex.dl9b0p57qosq4v' },
          ),
          ex.shortAnswer(
            'Che ne dici di un aperitivo?',
            '¿Qué te parece un aperitivo? (Acepta y propón las siete.)',
            "D'accordo, alle sette!",
            [
              'D’accordo, alle sette.',
              'Volentieri, alle sette!',
              "D'accordo! Ci vediamo alle sette.",
              'D’accordo, alle sette!',
            ],
            ['it-d-accordo'],
            { id: 'it.ex.pvj0zbyazdnjak' },
          ),
          ex.translateWrite(
            '¿Tienes ganas de venir a la fiesta?',
            'Ti va di venire alla festa?',
            ['it-ti-va-di', 'it-festa'],
            { id: 'it.ex.pw4jxrg8edpqmw' },
          ),
        ],
      },
    ],
  },
};

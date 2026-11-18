import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, IT_A1_RATE, question, reading, w } from '../helpers';

/**
 * Italiano A1 U16 «Transporte, tiempo libre y ayer» (docs/IT_A1_A2.md), cierre del A1: in treno /
 * a piedi, a + artículo (al, alla), andare en plural (andiamo, vanno) y un primer passato prossimo
 * (ho mangiato, ho visto, sono andato) que el A2 U1 retoma completo.
 * Falsos amigos: macchina es el auto (no la máquina) y guardare es «mirar» (no «guardar»).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const VIAGGIO = dialogue(
  'it.stim.a1-u16-viaggio',
  'Anna le pregunta a Marco cómo van a Roma con su familia.',
  [
    ['Anna', 'Come andate a Roma, in macchina?'],
    ['Marco', 'No, andiamo in treno. È più comodo.'],
    ['Anna', 'E alla stazione come andate?'],
    ['Marco', 'A piedi! È vicino.'],
  ],
  IT_A1_RATE,
);

const WEEKEND = reading(
  'it.stim.a1-u16-weekend',
  'post',
  'Luca cuenta en sus redes los planes del fin de semana.',
  [
    'Sabato io e Sara andiamo al mare in bicicletta.',
    'Domenica i miei genitori vanno in montagna, ma io vado al cinema.',
    'E voi, dove andate?',
  ],
  { from: 'Luca', title: 'Il nostro fine settimana' },
);

const IERI = dialogue(
  'it.stim.a1-u16-ieri',
  'El lunes, dos compañeros de trabajo hablan del domingo.',
  [
    ['Giulia', 'Ciao Paolo! Cosa hai fatto ieri?'],
    ['Paolo', 'Sono andato al cinema e ho visto un film italiano.'],
    ['Giulia', 'Bello! Io ho mangiato una pizza con mia sorella.'],
    ['Paolo', 'E dopo?'],
    ['Giulia', 'Dopo abbiamo guardato la TV a casa.'],
  ],
  IT_A1_RATE,
);

export const IT_A1_U16: ItUnitDef = {
  names: ['Anna', 'Marco', 'Luca', 'Sara', 'Giulia', 'Paolo'],
  support: ['più', 'comodo', 'andate', 'dopo', 'guardato', 'tv'],
  unit: {
    position: 16,
    title: 'Transporte, tiempo libre y ayer',
    titleEn: 'Trasporti e tempo libero',
    description:
      'Decir cómo vas a los lugares, adónde vas el fin de semana (al mare, alla stazione) y contar algo que hiciste ayer.',
    emoji: '🚆',
    objective:
      'Podés decir cómo vas a un lugar (in treno, a piedi), adónde van vos y otros (andiamo al mare, vanno in montagna) y contar en pocas palabras qué hiciste ayer (ho mangiato, sono andato).',
    grammar: {
      title: 'In treno · al / alla · un primer passato prossimo',
      explanation:
        'El transporte va con in y sin artículo: in treno, in autobus, in macchina; pero a piedi. «Tomar» el colectivo es prendere: prendo l’autobus. A + il = al, a + la = alla: vado al cinema, alla stazione; pero in montagna. Andare: vado, vai, va, andiamo, andate, vanno. Para contar lo que hiciste: avere + participio (ho mangiato, ho visto); con andare se usa essere y el participio concuerda: sono andato / sono andata.',
      examples: [
        { target: 'Andiamo a Roma in treno.', base: 'Vamos a Roma en tren.' },
        { target: 'Sabato vado al mare.', base: 'El sábado voy al mar.' },
        { target: 'Ieri sono andata al cinema.', base: 'Ayer fui al cine.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U16). Sin revisión nativa: revisar in / a con el transporte, ad agosto / in agosto y el passato prossimo introductorio.',
    },
    words: [
      w(
        'it-treno',
        'treno',
        'tren',
        'Andiamo a Roma in treno.',
        'Vamos a Roma en tren.',
        ['transport'],
        { emoji: '🚆' },
      ),
      w(
        'it-autobus',
        'autobus',
        'colectivo',
        'Prendo l’autobus ogni giorno.',
        'Tomo el colectivo todos los días.',
        ['transport'],
        {
          acceptedTranslations: ['autobús', 'ómnibus', 'bus'],
          emoji: '🚌',
        },
      ),
      w(
        'it-macchina',
        'macchina',
        'auto',
        'Mio padre va in macchina.',
        'Mi papá va en auto.',
        ['transport'],
        {
          acceptedTranslations: ['coche', 'carro'],
          emoji: '🚗',
        },
      ),
      w(
        'it-bicicletta',
        'bicicletta',
        'bicicleta',
        'Vado a scuola in bicicletta.',
        'Voy a la escuela en bicicleta.',
        ['transport'],
        {
          acceptedTranslations: ['bici'],
          emoji: '🚲',
        },
      ),
      w(
        'it-a-piedi',
        'a piedi',
        'a pie',
        'Vado a casa a piedi.',
        'Voy a casa a pie.',
        ['transport'],
        {
          acceptedTranslations: ['caminando'],
          emoji: '🚶',
        },
      ),
      w('it-andiamo', 'andiamo', 'vamos', 'Andiamo al mare!', '¡Vamos al mar!', [
        'verbs',
        'transport',
      ]),
      w(
        'it-vanno',
        'vanno',
        'van',
        'I miei genitori vanno in montagna.',
        'Mis papás van a la montaña.',
        ['verbs', 'transport'],
      ),
      w('it-al', 'al', 'al (a + il)', 'Vado al cinema.', 'Voy al cine.', ['prepositions']),
      w('it-alla', 'alla', 'a la (a + la)', 'Andiamo alla stazione.', 'Vamos a la estación.', [
        'prepositions',
      ]),
      w(
        'it-mare',
        'mare',
        'mar',
        "D'estate vado al mare.",
        'En verano voy al mar.',
        ['places', 'free-time'],
        {
          acceptedTranslations: ['playa'],
          emoji: '🌊',
        },
      ),
      w(
        'it-montagna',
        'montagna',
        'montaña',
        'Domenica vanno in montagna.',
        'El domingo van a la montaña.',
        ['places', 'free-time'],
        {
          emoji: '⛰️',
        },
      ),
      w(
        'it-cinema',
        'cinema',
        'cine',
        'Stasera andiamo al cinema.',
        'Esta noche vamos al cine.',
        ['places', 'free-time'],
        {
          emoji: '🎬',
        },
      ),
      w(
        'it-guardare',
        'guardare',
        'mirar',
        'Mi piace guardare la TV.',
        'Me gusta mirar la tele.',
        ['verbs', 'free-time'],
        {
          acceptedTranslations: ['ver'],
        },
      ),
      w('it-ieri', 'ieri', 'ayer', 'Ieri ho mangiato una pizza.', 'Ayer comí una pizza.', ['time']),
      w('it-ho-mangiato', 'ho mangiato', 'comí', 'Ho mangiato un panino.', 'Comí un sándwich.', [
        'verbs',
        'past',
      ]),
      w('it-ho-visto', 'ho visto', 'vi', 'Ho visto un film.', 'Vi una película.', [
        'verbs',
        'past',
      ]),
      w(
        'it-sono-andato',
        'sono andato',
        'fui',
        'Ieri sono andato al mare.',
        'Ayer fui al mar.',
        ['verbs', 'past'],
        {
          acceptedTexts: ['sono andata'],
          acceptedTranslations: ['me fui'],
        },
      ),
      w(
        'it-cosa-hai-fatto',
        'cosa hai fatto?',
        '¿qué hiciste?',
        'Cosa hai fatto ieri?',
        '¿Qué hiciste ayer?',
        ['questions', 'past'],
        {
          acceptedTexts: ['che cosa hai fatto?'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'In treno, a piedi',
        objective: 'Decir cómo vas a los lugares.',
        intro: {
          explanation:
            'El transporte va con in y sin artículo: in treno, in autobus, in macchina, in bicicletta; caminando es a piedi. Ojo: macchina es el auto (no una máquina). «Tomar» el colectivo es prendere: prendo l’autobus.',
          examples: [
            { target: 'Vado a scuola a piedi.', base: 'Voy a la escuela a pie.' },
            { target: 'Prendo l’autobus ogni giorno.', base: 'Tomo el colectivo todos los días.' },
          ],
        },
        takeaways: [
          'Decís cómo vas: in treno, in macchina, a piedi.',
          'Sabés que macchina es «auto».',
        ],
        exercises: [
          ex.imageChoice('🚆', 'treno', ['autobus', 'macchina', 'bicicletta'], ['it-treno'], {
            id: 'it.ex.n6928htp7jewxd',
          }),
          ex.translationChoice('macchina', 'auto', ['máquina', 'moto', 'camión'], ['it-macchina'], {
            id: 'it.ex.13cwmo4qfxi484',
            explanation: 'Falso amigo: macchina es el auto. Vado in macchina = voy en auto.',
          }),
          ex.matchPairs(
            [
              ['treno', 'tren'],
              ['autobus', 'colectivo'],
              ['macchina', 'auto'],
              ['a piedi', 'a pie'],
            ],
            ['it-treno', 'it-autobus', 'it-macchina', 'it-a-piedi'],
            { id: 'it.ex.2bu2j9rqippftx' },
          ),
          ex.listenChoice(
            'Vado a scuola a piedi.',
            ['Vado a scuola in autobus.', 'Vai a scuola a piedi?', 'Vado a casa a piedi.'],
            ['it-a-piedi', 'it-vado'],
            { id: 'it.ex.v3y2m90zj3fpkp' },
          ),
          ex.fillBlank(
            'Vado in ufficio ___ macchina.',
            'Voy a la oficina en auto.',
            'in',
            ['a', 'da', 'su'],
            ['it-macchina', 'it-ufficio'],
            {
              id: 'it.ex.617qpy34e2n9qz',
              explanation: 'Con el transporte se usa in sin artículo: in macchina.',
            },
          ),
          ex.fillBlank(
            'Vado a scuola ___ piedi.',
            'Voy a la escuela a pie.',
            'a',
            ['in', 'con', 'da'],
            ['it-a-piedi'],
            {
              id: 'it.ex.138n3o78e243pd',
              explanation: 'Caminando es a piedi (no «in piedi», que es «de pie»).',
            },
          ),
          ex.orderWords(
            'Prendo l’autobus ogni giorno.',
            'Tomo el colectivo todos los días.',
            ['it-autobus', 'it-prendo'],
            {
              id: 'it.ex.bc1ufcxs97vefa',
            },
          ),
          ex.shortAnswer(
            'Come vai in ufficio?',
            '¿Cómo vas a la oficina? (Respondé que vas en colectivo.)',
            'Vado in autobus.',
            [
              'Vado in ufficio in autobus.',
              'In autobus.',
              'Prendo l’autobus.',
              "Prendo l'autobus.",
            ],
            ['it-autobus', 'it-vado'],
            { id: 'it.ex.ajmcjurkigao5f' },
          ),
          ex.translateWrite(
            'Voy a la escuela en bicicleta.',
            'Vado a scuola in bicicletta.',
            ['it-bicicletta', 'it-vado'],
            {
              id: 'it.ex.3bqyp0s75dwtb6',
              acceptedAnswers: ['Vado a scuola in bici.', 'Io vado a scuola in bicicletta.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Al mare, alla stazione',
        objective: 'Decir adónde vas con al y alla.',
        intro: {
          explanation:
            'A + il = al y a + la = alla: vado al cinema, al mare, alla stazione. Con la montaña se usa in: vado in montagna. Andiamo es «vamos»: andiamo al mare!',
          examples: [
            { target: 'Sabato vado al mare.', base: 'El sábado voy al mar.' },
            { target: 'Andiamo alla stazione.', base: 'Vamos a la estación.' },
          ],
        },
        takeaways: ['Usás al y alla para decir adónde vas.', 'Decís in montagna y al mare.'],
        exercises: [
          ex.fillBlank(
            'Vado ___ cinema.',
            'Voy al cine.',
            'al',
            ['alla', 'in', 'a'],
            ['it-al', 'it-cinema'],
            {
              id: 'it.ex.n8fk6scihxh1d0',
              explanation: 'Cinema es masculino: a + il cinema = al cinema.',
            },
          ),
          ex.fillBlank(
            'Andiamo ___ stazione.',
            'Vamos a la estación.',
            'alla',
            ['al', 'alle', 'in'],
            ['it-alla', 'it-andiamo', 'it-stazione'],
            {
              id: 'it.ex.rm81n0c4jkkt3p',
              explanation: 'Stazione es femenino: a + la stazione = alla stazione.',
            },
          ),
          ex.imageChoice('🌊', 'mare', ['montagna', 'cinema', 'treno'], ['it-mare'], {
            id: 'it.ex.aqtznd8vv0ujie',
          }),
          ex.listenChoice(
            'Domenica vado al mare.',
            ['Domenica vado al cinema.', 'Domenica andiamo al mare.', 'Domani vado al mare.'],
            ['it-al', 'it-mare'],
            { id: 'it.ex.d49l58itxzyv1z' },
          ),
          ex.fillBlank(
            "D'estate andiamo ___ montagna.",
            'En verano vamos a la montaña.',
            'in',
            ['al', 'alla', 'a'],
            ['it-montagna', 'it-andiamo'],
            { id: 'it.ex.03f97l52zypad5', explanation: 'Con la montaña se dice in montagna.' },
          ),
          ex.translationChoice('andiamo', 'vamos', ['van', 'andamos', 'voy'], ['it-andiamo'], {
            id: 'it.ex.qrgi7hvobgggji',
            explanation: 'Andiamo es «vamos» (de andare, «ir»), no «andamos».',
          }),
          ex.orderWords(
            'Sabato andiamo al mare.',
            'El sábado vamos al mar.',
            ['it-andiamo', 'it-al', 'it-mare'],
            {
              id: 'it.ex.ddjrm752nj9kkh',
            },
          ),
          ex.shortAnswer(
            'Dove vai stasera?',
            '¿Adónde vas esta noche? (Respondé que vas al cine.)',
            'Vado al cinema.',
            ['Stasera vado al cinema.', 'Al cinema.'],
            ['it-al', 'it-cinema'],
            { id: 'it.ex.2zz47hx432zxg2' },
          ),
          ex.translateWrite(
            'Vamos a la estación.',
            'Andiamo alla stazione.',
            ['it-andiamo', 'it-alla', 'it-stazione'],
            {
              id: 'it.ex.rgkn9am025m5zt',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Andiamo, andate, vanno',
        objective: 'Conjugar andare en plural y entender cómo viaja un grupo.',
        intro: {
          explanation:
            'Andare es irregular: vado, vai, va, andiamo, andate, vanno. Con noi y voi vuelve la raíz and-: andiamo, andate. Con loro: vanno.',
          examples: [
            { target: 'I miei genitori vanno in montagna.', base: 'Mis papás van a la montaña.' },
            { target: 'Voi andate al mare?', base: '¿Ustedes van al mar?' },
          ],
        },
        takeaways: ['Conjugás andare: andiamo, andate, vanno.', 'Entendés cómo viaja un grupo.'],
        exercises: [
          ex.translationChoice('vanno', 'van', ['vamos', 'va', 'vas'], ['it-vanno'], {
            id: 'it.ex.hghef30bmcrjco',
          }),
          ex.fillBlank(
            'I miei genitori ___ in montagna.',
            'Mis papás van a la montaña.',
            'vanno',
            ['andiamo', 'vado', 'va'],
            ['it-vanno', 'it-montagna'],
            { id: 'it.ex.m0zx2qo33qoqzw' },
          ),
          ex.fillBlank(
            'Voi ___ al mare?',
            '¿Ustedes van al mar?',
            'andate',
            ['andiamo', 'vanno', 'vai'],
            ['it-voi', 'it-mare'],
            {
              id: 'it.ex.09pkm9um5ecj7m',
              explanation: 'Con voi: andate.',
            },
          ),
          ex.listenChoice(
            'Andiamo a Roma in treno.',
            ['Vanno a Roma in treno.', 'Andiamo a Roma in macchina.', 'Andiamo a casa in treno.'],
            ['it-andiamo', 'it-treno'],
            { id: 'it.ex.4xuhfcuvb8szc0' },
          ),
          question(
            'it.ex.xbdkzzkb96i1ph',
            VIAGGIO,
            '¿Cómo va Marco a Roma con su familia?',
            'En tren, porque es más cómodo',
            ['En auto', 'En colectivo', 'En bicicleta'],
            ['it-treno', 'it-andiamo'],
            'Marco dice: «No, andiamo in treno. È più comodo».',
          ),
          question(
            'it.ex.n6ily21h6nhf17',
            VIAGGIO,
            '¿Y cómo van a la estación?',
            'A pie, porque está cerca',
            ['En auto, porque está lejos', 'En colectivo', 'En tren'],
            ['it-a-piedi', 'it-alla'],
            'Marco responde: «A piedi! È vicino».',
          ),
          ex.orderWords(
            'Loro vanno al cinema in autobus.',
            'Ellos van al cine en colectivo.',
            ['it-vanno', 'it-autobus'],
            {
              id: 'it.ex.tco6cdc0osx8fo',
            },
          ),
          ex.shortAnswer(
            'Come andate a Roma?',
            '¿Cómo van ustedes a Roma? (Respondé que van en tren.)',
            'Andiamo in treno.',
            ['Andiamo a Roma in treno.', 'In treno.', 'Noi andiamo in treno.'],
            ['it-andiamo', 'it-treno'],
            { id: 'it.ex.3x41upqe9giiax' },
          ),
          ex.translateWrite(
            'Ellos van al mar en auto.',
            'Loro vanno al mare in macchina.',
            ['it-vanno', 'it-mare', 'it-macchina'],
            {
              id: 'it.ex.55b65v5xv6z7fo',
              acceptedAnswers: ['Vanno al mare in macchina.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Ieri ho mangiato…',
        objective: 'Contar en pocas palabras qué hiciste ayer.',
        intro: {
          explanation:
            'Para contar lo que hiciste se usa avere + participio: ho mangiato (comí), ho visto (vi). Ieri es «ayer». Para preguntar: cosa hai fatto? (¿qué hiciste?). En la U1 del A2 lo vas a ver completo.',
          examples: [
            { target: 'Ieri ho mangiato una pizza.', base: 'Ayer comí una pizza.' },
            { target: 'Cosa hai fatto ieri?', base: '¿Qué hiciste ayer?' },
          ],
        },
        takeaways: ['Preguntás cosa hai fatto?', 'Contás algo de ayer con ho mangiato y ho visto.'],
        exercises: [
          ex.translationChoice('ieri', 'ayer', ['hoy', 'mañana', 'después'], ['it-ieri'], {
            id: 'it.ex.zye33j1mcfiiov',
          }),
          ex.translationChoice(
            'ho mangiato',
            'comí',
            ['como', 'comemos', 'vas a comer'],
            ['it-ho-mangiato'],
            { id: 'it.ex.ik7bei5jy4ygxh' },
          ),
          ex.translationChoice(
            'cosa hai fatto?',
            '¿qué hiciste?',
            ['¿qué hacés?', '¿qué querés?', '¿dónde estás?'],
            ['it-cosa-hai-fatto'],
            {
              id: 'it.ex.it7ovtfxsasvun',
            },
          ),
          ex.listenChoice(
            'Ieri ho visto un film.',
            ['Ieri ho visto un amico.', 'Ieri ho mangiato una pizza.', 'Oggi ho visto un film.'],
            ['it-ieri', 'it-ho-visto'],
            { id: 'it.ex.ashy81n5b0o1rs' },
          ),
          ex.fillBlank(
            'Ieri ___ mangiato una pizza.',
            'Ayer comí una pizza.',
            'ho',
            ['sono', 'è', 'hai'],
            ['it-ho-mangiato', 'it-ieri'],
            {
              id: 'it.ex.n8tg1huvifaw2w',
              explanation: 'Mangiare forma el pasado con avere: ho mangiato.',
            },
          ),
          ex.fillBlank(
            'Ieri ho ___ un film.',
            'Ayer vi una película.',
            'visto',
            ['mangiato', 'andato', 'fatto'],
            ['it-ho-visto'],
            {
              id: 'it.ex.h5p8k4n1thtenp',
            },
          ),
          question(
            'it.ex.5x3rrmw8pgfve1',
            IERI,
            '¿Qué hizo Paolo ayer?',
            'Fue al cine y vio una película italiana',
            ['Comió una pizza con su hermana', 'Fue al mar', 'Miró la tele en casa'],
            ['it-sono-andato', 'it-ho-visto'],
            'Paolo dice: «Sono andato al cinema e ho visto un film italiano».',
          ),
          question(
            'it.ex.uaq5r7px0iiso6',
            IERI,
            '¿Qué hizo Giulia?',
            'Comió una pizza con su hermana',
            ['Fue al cine con Paolo', 'Vio una película italiana', 'Fue a la montaña'],
            ['it-ho-mangiato'],
            'Giulia dice: «Io ho mangiato una pizza con mia sorella».',
          ),
          ex.shortAnswer(
            'Cosa hai fatto ieri?',
            '¿Qué hiciste ayer? (Respondé que comiste una pizza.)',
            'Ieri ho mangiato una pizza.',
            ['Ho mangiato una pizza.', 'Ho mangiato una pizza ieri.'],
            ['it-ho-mangiato', 'it-cosa-hai-fatto'],
            { id: 'it.ex.gj22ljtia8hmpc' },
          ),
          ex.translateWrite(
            'Ayer vi una película.',
            'Ieri ho visto un film.',
            ['it-ieri', 'it-ho-visto'],
            {
              id: 'it.ex.klmtcajo6f6cq7',
              acceptedAnswers: ['Ho visto un film ieri.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Sono andato al cinema',
        objective: 'Contar adónde fuiste y entender planes de fin de semana.',
        intro: {
          explanation:
            'Con andare el pasado va con essere, y el participio concuerda con quien habla: sono andato (varón), sono andata (mujer). Y ojo: guardare es «mirar», no «guardar»: guardo la TV, ho guardato un film.',
          examples: [
            { target: 'Ieri sono andata al mare.', base: 'Ayer fui al mar.' },
            { target: 'Mi piace guardare la TV.', base: 'Me gusta mirar la tele.' },
          ],
        },
        takeaways: [
          'Decís adónde fuiste: sono andato / sono andata.',
          'Sabés que guardare es «mirar».',
        ],
        exercises: [
          ex.translationChoice(
            'guardare',
            'mirar',
            ['guardar', 'esperar', 'buscar'],
            ['it-guardare'],
            {
              id: 'it.ex.bze1rmqxc8ezog',
              explanation: 'Falso amigo: guardare es «mirar». Guardo la TV = miro la tele.',
            },
          ),
          ex.fillBlank(
            'Ieri sono ___ al mare.',
            'Ayer fui al mar. (Habla una mujer.)',
            'andata',
            ['andato', 'andiamo', 'vado'],
            ['it-sono-andato', 'it-mare'],
            {
              id: 'it.ex.qp1xdkojhb3bil',
              explanation: 'Con essere el participio concuerda: una mujer dice sono andata.',
            },
          ),
          ex.listenChoice(
            'Sono andato al cinema.',
            ['Sono andato al mare.', 'Sono andata al cinema.', 'Vado al cinema.'],
            ['it-sono-andato', 'it-cinema'],
            { id: 'it.ex.39i2noyer5re9u' },
          ),
          question(
            'it.ex.ybmr8ylgaf1as5',
            IERI,
            '¿Qué hizo Giulia después de comer?',
            'Miró la tele en casa',
            ['Fue al cine', 'Fue a la montaña', 'Guardó la pizza'],
            ['it-guardare'],
            'Giulia dice: «Dopo abbiamo guardato la TV a casa» (guardare = mirar).',
          ),
          question(
            'it.ex.z4tjmzugysjyzl',
            WEEKEND,
            '¿Qué hacen Luca y Sara el sábado?',
            'Van al mar en bicicleta',
            ['Van al cine', 'Van a la montaña en auto', 'Van al mar en tren'],
            ['it-andiamo', 'it-bicicletta'],
            'Luca escribe: «Sabato io e Sara andiamo al mare in bicicletta».',
          ),
          question(
            'it.ex.l22sh5y54iiuur',
            WEEKEND,
            '¿Adónde van los papás de Luca el domingo?',
            'A la montaña',
            ['Al cine', 'Al mar', 'A la estación'],
            ['it-vanno', 'it-montagna'],
            'Luca escribe: «Domenica i miei genitori vanno in montagna».',
          ),
          ex.orderWords(
            'Mi piace guardare la TV la sera.',
            'Me gusta mirar la tele a la noche.',
            ['it-guardare', 'it-mi-piace'],
            {
              id: 'it.ex.61e5tbneoukt2e',
            },
          ),
          ex.shortAnswer(
            'Dove sei andato ieri?',
            '¿Adónde fuiste ayer? (Respondé que fuiste a la montaña.)',
            'Sono andato in montagna.',
            [
              'Sono andata in montagna.',
              'Ieri sono andato in montagna.',
              'Ieri sono andata in montagna.',
              'In montagna.',
            ],
            ['it-sono-andato', 'it-montagna'],
            { id: 'it.ex.ksuwq0cobq7i2k' },
          ),
          ex.translateWrite(
            'Ayer fui al cine.',
            'Ieri sono andato al cinema.',
            ['it-ieri', 'it-sono-andato', 'it-cinema'],
            {
              id: 'it.ex.5mjdfs65ectczc',
              acceptedAnswers: [
                'Ieri sono andata al cinema.',
                'Sono andato al cinema ieri.',
                'Sono andata al cinema ieri.',
              ],
            },
          ),
        ],
      },
    ],
  },
};

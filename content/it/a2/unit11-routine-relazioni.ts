import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U11 «Rutina y relaciones» (docs/IT_A1_A2.md): los reflexivos en todas las personas (ti
 * alzi, si alza, ci alziamo) y en pasado (mi sono alzato / alzata), los recíprocos (ci siamo
 * conosciuti, si sono sposati, ci sentiamo), ci de lugar (ci vado) y la frecuencia (spesso, qualche
 * volta, non… mai). Falso amigo: spesso es «seguido» (no «espeso»).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const GIORNATA = dialogue(
  'it.stim.a2-u11-giornata',
  'Una radio entrevista a Lucia, cocinera de un restaurante.',
  [
    ['Giornalista', 'Lucia, a che ora ti alzi la mattina?'],
    ['Lucia', 'Presto, alle sei. Mi lavo, mi vesto e vado al mercato.'],
    ['Giornalista', 'E la sera?'],
    ['Lucia', 'Torno a casa tardi, a mezzanotte. Mio marito mi aspetta sempre con un tè.'],
    ['Giornalista', 'Vai spesso in vacanza?'],
    ['Lucia', 'Qualche volta, d’estate. Ma non mi riposo mai!'],
  ],
);

const MESSAGGIO = reading(
  'it.stim.a2-u11-messaggio',
  'message',
  'Laura le escribe a su marido a media mañana.',
  [
    'Amore, stamattina mi sono alzata tardi e sono uscita di corsa.',
    'Stasera ceniamo dai miei genitori, ti ricordi?',
    'Ci vediamo alle otto. Baci!',
  ],
  { from: 'Laura', to: 'Paolo' },
);

const STORIA = reading(
  'it.stim.a2-u11-storia',
  'post',
  'Elisa cuenta en sus redes cómo conoció a su marido.',
  [
    'Io e Marco ci siamo conosciuti dieci anni fa a una festa.',
    'Poi ci siamo visti spesso e dopo due anni ci siamo fidanzati.',
    'Ci siamo sposati a Verona, la città di Romeo e Giulietta!',
  ],
  { from: 'Elisa', title: 'Dieci anni insieme' },
);

const PALESTRA = dialogue('it.stim.a2-u11-palestra', 'Anna y Davide hablan del gimnasio.', [
  ['Anna', 'Vai ancora in palestra?'],
  ['Davide', 'Sì, ci vado tre volte a settimana.'],
  ['Anna', 'Io ci vado raramente… Ci andiamo insieme domani?'],
  ['Davide', 'D’accordo! Ci sentiamo stasera per l’orario.'],
]);

export const IT_A2_U11: ItUnitDef = {
  names: [
    'Giornalista',
    'Lucia',
    'Laura',
    'Paolo',
    'Elisa',
    'Marco',
    'Verona',
    'Romeo',
    'Giulietta',
    'Anna',
    'Davide',
  ],
  support: [
    'torno',
    'mezzanotte',
    'riposo',
    'amore',
    'corsa',
    'ceniamo',
    'ricordi',
    'visti',
    'fidanzati',
    'palestra',
    'raramente',
    'fretta',
    'vi',
    'vestito',
  ],
  unit: {
    position: 11,
    title: 'Rutina y relaciones',
    titleEn: 'Routine e relazioni',
    description:
      'Contar tu rutina con los reflexivos en presente y en pasado, decir con qué frecuencia haces algo y hablar de pareja y familia.',
    emoji: '💞',
    objective:
      'Puedes contar tu rutina y la de otros (si alza, ci alziamo), lo que hiciste esta mañana (mi sono alzata tardi), cada cuánto haces algo y cómo se conocieron dos personas.',
    grammar: {
      title: 'Reflexivos y recíprocos · ci de lugar · frecuencia',
      explanation:
        'Los reflexivos llevan mi, ti, si, ci, vi, si antes del verbo: mi alzo, ti alzi, si alza, ci alziamo. En pasado van con essere y el participio concuerda: mi sono alzato / alzata, ci siamo alzati. Con ci / si también se dice lo que hacen dos personas entre sí: ci siamo conosciuti (nos conocimos), si sono sposati (se casaron), ci sentiamo (hablamos). Ci reemplaza un lugar: Vai in palestra? — Sì, ci vado. Frecuencia: sempre, spesso (seguido), qualche volta (a veces), non… mai (nunca).',
      examples: [
        { target: 'Mio padre si alza alle sei.', base: 'Mi papá se levanta a las seis.' },
        { target: 'Stamattina mi sono alzata tardi.', base: 'Esta mañana me levanté tarde.' },
        {
          target: 'Vai in palestra? — Sì, ci vado spesso.',
          base: '¿Vas al gimnasio? — Sí, voy seguido.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U11). Sin revisión nativa: revisar fidanzato (novio / prometido), dai miei genitori y el registro del mensaje.',
    },
    words: [
      w(
        'it-ti-alzi',
        'ti alzi',
        'te levantas',
        'A che ora ti alzi?',
        '¿A qué hora te levantas?',
        ['verbs', 'routine'],
        { acceptedTranslations: ['te levantás'] },
      ),
      w(
        'it-si-alza',
        'si alza',
        'se levanta',
        'Mio padre si alza alle sei.',
        'Mi papá se levanta a las seis.',
        ['verbs', 'routine'],
      ),
      w(
        'it-ci-alziamo',
        'ci alziamo',
        'nos levantamos',
        'Ci alziamo presto.',
        'Nos levantamos temprano.',
        ['verbs', 'routine'],
      ),
      w('it-mi-lavo', 'mi lavo', 'me lavo', 'Mi lavo e mi vesto.', 'Me lavo y me visto.', [
        'verbs',
        'routine',
      ]),
      w(
        'it-mi-vesto',
        'mi vesto',
        'me visto',
        'Mi vesto in cinque minuti.',
        'Me visto en cinco minutos.',
        ['verbs', 'routine'],
      ),
      w('it-presto', 'presto', 'temprano', 'Mi alzo presto.', 'Me levanto temprano.', [
        'time',
        'routine',
      ]),
      w('it-tardi', 'tardi', 'tarde', 'Torno a casa tardi.', 'Vuelvo tarde a casa.', [
        'time',
        'routine',
      ]),
      w(
        'it-spesso',
        'spesso',
        'seguido',
        'Vado spesso al cinema.',
        'Voy seguido al cine.',
        ['time'],
        {
          acceptedTranslations: ['a menudo', 'frecuentemente'],
        },
      ),
      w(
        'it-qualche-volta',
        'qualche volta',
        'a veces',
        'Qualche volta vado al mare.',
        'A veces voy al mar.',
        ['time'],
        {
          acceptedTranslations: ['algunas veces'],
        },
      ),
      w(
        'it-marito',
        'marito',
        'marido',
        'Mio marito è medico.',
        'Mi marido es médico.',
        ['family'],
        { acceptedTranslations: ['esposo'] },
      ),
      w(
        'it-moglie',
        'moglie',
        'esposa',
        'Sua moglie è italiana.',
        'Su esposa es italiana.',
        ['family'],
        { acceptedTranslations: ['mujer'] },
      ),
      w(
        'it-mi-sono-alzato',
        'mi sono alzato',
        'me levanté',
        'Mi sono alzato tardi.',
        'Me levanté tarde.',
        ['verbs', 'past', 'routine'],
        {
          acceptedTexts: ['mi sono alzata'],
        },
      ),
      w(
        'it-fidanzato',
        'fidanzato',
        'novio',
        'Il mio fidanzato si chiama Luca.',
        'Mi novio se llama Luca.',
        ['family'],
        {
          acceptedTexts: ['fidanzata'],
          acceptedTranslations: ['novia', 'prometido', 'prometida'],
        },
      ),
      w(
        'it-ci-siamo-conosciuti',
        'ci siamo conosciuti',
        'nos conocimos',
        'Ci siamo conosciuti a una festa.',
        'Nos conocimos en una fiesta.',
        ['past', 'family'],
        {
          acceptedTexts: ['ci siamo conosciute'],
        },
      ),
      w(
        'it-si-sono-sposati',
        'si sono sposati',
        'se casaron',
        'I miei genitori si sono sposati a Roma.',
        'Mis papás se casaron en Roma.',
        ['past', 'family'],
      ),
      w(
        'it-ci-sentiamo',
        'ci sentiamo',
        'hablamos (más tarde)',
        'Ci sentiamo stasera!',
        '¡Hablamos esta noche!',
        ['invitations'],
        {
          acceptedTranslations: ['hablamos', 'nos hablamos'],
        },
      ),
      w(
        'it-ci-vado',
        'ci vado',
        'voy (ahí)',
        'Ci vado ogni giorno.',
        'Voy todos los días.',
        ['pronouns'],
        {
          acceptedTranslations: ['voy'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ti alzi, si alza',
        objective: 'Conjugar los reflexivos para contar la rutina de otros.',
        intro: {
          explanation:
            'Los reflexivos cambian el pronombre con cada persona: mi alzo, ti alzi, si alza, ci alziamo, vi alzate, si alzano. Igual con lavarsi y vestirsi: mi lavo, mi vesto.',
          examples: [
            { target: 'A che ora ti alzi?', base: '¿A qué hora te levantas?' },
            { target: 'Mio padre si alza alle sei.', base: 'Mi papá se levanta a las seis.' },
          ],
        },
        takeaways: [
          'Conjugas los reflexivos: ti alzi, si alza, ci alziamo.',
          'Cuentas la rutina de la mañana.',
        ],
        exercises: [
          ex.translationChoice(
            'si alza',
            'se levanta',
            ['se lava', 'te levantas', 'me levanto'],
            ['it-si-alza'],
            { id: 'it.ex.jansgxg7rrhcgc' },
          ),
          ex.matchPairs(
            [
              ['ti alzi', 'te levantas'],
              ['si alza', 'se levanta'],
              ['ci alziamo', 'nos levantamos'],
              ['mi vesto', 'me visto'],
            ],
            ['it-ti-alzi', 'it-si-alza', 'it-ci-alziamo', 'it-mi-vesto'],
            { id: 'it.ex.ytta3rt4azl9mv' },
          ),
          ex.listenChoice(
            'A che ora ti alzi?',
            ['A che ora si alza?', 'A che ora ti svegli?', 'A che ora mi alzo?'],
            ['it-ti-alzi', 'it-a-che-ora'],
            { id: 'it.ex.bhtjftya23tb5x' },
          ),
          ex.fillBlank(
            'Mio padre ___ alza alle sei.',
            'Mi papá se levanta a las seis.',
            'si',
            ['mi', 'ti', 'ci'],
            ['it-si-alza'],
            { id: 'it.ex.wpnrwzqpr4f88p' },
          ),
          ex.fillBlank(
            'Noi ci ___ alle sette.',
            'Nos levantamos a las siete.',
            'alziamo',
            ['alzo', 'alzi', 'alza'],
            ['it-ci-alziamo'],
            {
              id: 'it.ex.zk89slynbap7he',
            },
          ),
          question(
            'it.ex.7521hmtbxbv3fb',
            GIORNATA,
            '¿A qué hora se levanta Lucia?',
            'Temprano, a las seis',
            ['Tarde, a las diez', 'A medianoche', 'A las siete'],
            ['it-ti-alzi', 'it-presto', 'it-tardi', 'it-marito'],
            'Lucia dice: «Presto, alle sei».',
          ),
          question(
            'it.ex.vgvl7eeofdo412',
            GIORNATA,
            '¿Qué hace Lucia antes de ir al mercado?',
            'Se lava y se viste',
            ['Desayuna con su marido', 'Va al gimnasio', 'Cocina'],
            ['it-mi-lavo', 'it-mi-vesto', 'it-spesso', 'it-qualche-volta'],
            'Lucia dice: «Mi lavo, mi vesto e vado al mercato».',
          ),
          ex.shortAnswer(
            'A che ora ti alzi?',
            '¿A qué hora te levantas? (Responde que a las siete.)',
            'Mi alzo alle sette.',
            ['Alle sette.', 'Di solito mi alzo alle sette.'],
            ['it-ti-alzi', 'it-mi-alzo'],
            { id: 'it.ex.vkfoimpdfxibsp' },
          ),
          ex.translateWrite(
            'Me lavo y me visto.',
            'Mi lavo e mi vesto.',
            ['it-mi-lavo', 'it-mi-vesto'],
            { id: 'it.ex.zrbvw6nv7nl252' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Presto, tardi, spesso',
        objective: 'Decir cuándo y cada cuánto haces algo.',
        intro: {
          explanation:
            'Presto es «temprano» (y a presto, «hasta pronto»); tardi, «tarde». Para la frecuencia: sempre, spesso (seguido; no «espeso»), qualche volta (a veces), non… mai (nunca): non vado mai al cinema.',
          examples: [
            { target: 'Torno a casa tardi.', base: 'Vuelvo tarde a casa.' },
            { target: 'Qualche volta vado al mare.', base: 'A veces voy al mar.' },
          ],
        },
        takeaways: [
          'Dices presto y tardi.',
          'Dices cada cuánto: sempre, spesso, qualche volta, mai.',
        ],
        exercises: [
          ex.translationChoice(
            'presto',
            'temprano',
            ['préstamo', 'tarde', 'después'],
            ['it-presto'],
            {
              id: 'it.ex.j7105zdir66nkd',
              explanation: 'Presto es «temprano» (y en a presto, «pronto»).',
            },
          ),
          ex.translationChoice('spesso', 'seguido', ['espeso', 'siempre', 'nunca'], ['it-spesso'], {
            id: 'it.ex.zd0o98mr1osf4i',
            explanation: 'Falso amigo: spesso es «seguido, a menudo». «Espeso» es denso.',
          }),
          ex.fillBlank(
            'Torno a casa ___, a mezzanotte.',
            'Vuelvo a casa tarde, a medianoche.',
            'tardi',
            ['presto', 'spesso', 'già'],
            ['it-tardi'],
            {
              id: 'it.ex.vlioc66ch7wg2x',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            'Non vado ___ al cinema.',
            'No voy nunca al cine.',
            'mai',
            ['sempre', 'spesso', 'presto'],
            ['it-spesso'],
            {
              id: 'it.ex.vkf1scme0c1r3e',
              explanation: '«Nunca» es non… mai: el non va antes del verbo y mai, después.',
            },
          ),
          ex.listenChoice(
            'Qualche volta vado al mare.',
            ['Spesso vado al mare.', 'Qualche volta vado al cinema.', 'Non vado mai al mare.'],
            ['it-qualche-volta', 'it-mare'],
            { id: 'it.ex.uy4itbcu1xx57f' },
          ),
          question(
            'it.ex.oiht79t4wfu1e9',
            GIORNATA,
            '¿Cómo termina el día de Lucia?',
            'Vuelve tarde y su marido la espera con un té',
            [
              'Vuelve temprano y cocina para su marido',
              'Se queda en el restaurante',
              'Va al gimnasio',
            ],
            ['it-tardi', 'it-marito'],
            'Lucia dice: «Torno a casa tardi, a mezzanotte. Mio marito mi aspetta sempre con un tè».',
          ),
          question(
            'it.ex.3nbjhbwbaliouj',
            GIORNATA,
            '¿Va seguido de vacaciones?',
            'A veces, en verano',
            ['Sí, todos los meses', 'Nunca', 'Siempre en invierno'],
            ['it-spesso', 'it-qualche-volta'],
            'Lucia dice: «Qualche volta, d’estate».',
          ),
          ex.shortAnswer(
            'Vai spesso al cinema?',
            '¿Vas seguido al cine? (Responde que a veces.)',
            'Qualche volta.',
            ['Ci vado qualche volta.', 'Sì, qualche volta.', 'Vado al cinema qualche volta.'],
            ['it-qualche-volta'],
            { id: 'it.ex.sizoopjbr0mxhy' },
          ),
          ex.translateWrite(
            'Mi marido se levanta temprano.',
            'Mio marito si alza presto.',
            ['it-marito', 'it-si-alza', 'it-presto'],
            {
              id: 'it.ex.g3cxqytlpvp2af',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Mi sono alzata tardi',
        objective: 'Contar tu mañana con los reflexivos en pasado.',
        intro: {
          explanation:
            'Los reflexivos forman el pasado con essere, y el participio concuerda: mi sono alzato (él), mi sono alzata (ella), ci siamo alzati. Mi sono vestito, si è lavata…',
          examples: [
            { target: 'Stamattina mi sono alzata tardi.', base: 'Esta mañana me levanté tarde.' },
            { target: 'Ci siamo alzati alle otto.', base: 'Nos levantamos a las ocho.' },
          ],
        },
        takeaways: [
          'Cuentas tu mañana: mi sono alzato / alzata.',
          'Haces concordar el participio.',
        ],
        exercises: [
          ex.translationChoice(
            'mi sono alzato',
            'me levanté',
            ['me levanto', 'me lavé', 'me acosté'],
            ['it-mi-sono-alzato'],
            { id: 'it.ex.240egpyf37w0hq' },
          ),
          ex.fillBlank(
            'Stamattina mi sono ___ tardi.',
            'Esta mañana me levanté tarde. (Habla una mujer.)',
            'alzata',
            ['alzato', 'alzati', 'alza'],
            ['it-mi-sono-alzato', 'it-tardi'],
            {
              id: 'it.ex.slnl4r17uthr3j',
              explanation: 'Con essere el participio concuerda: una mujer dice mi sono alzata.',
            },
          ),
          ex.fillBlank(
            'Ieri ___ sono vestito in fretta.',
            'Ayer me vestí rápido.',
            'mi',
            ['ti', 'si', 'ci'],
            ['it-mi-vesto'],
            {
              id: 'it.ex.d0oe97u2vtesn8',
            },
          ),
          ex.listenChoice(
            'Ci siamo alzati alle otto.',
            ['Ci alziamo alle otto.', 'Mi sono alzato alle otto.', 'Ci siamo alzati alle sette.'],
            ['it-mi-sono-alzato', 'it-ci-alziamo'],
            { id: 'it.ex.8ppn53yrnqmidp' },
          ),
          ex.translationChoice('moglie', 'esposa', ['muela', 'novia', 'hija'], ['it-moglie'], {
            id: 'it.ex.ia5e1w97e2l7gz',
          }),
          question(
            'it.ex.ui14itvedny9ik',
            MESSAGGIO,
            '¿Qué le pasó a Laura esta mañana?',
            'Se levantó tarde y salió corriendo',
            [
              'Se levantó temprano y fue al gimnasio',
              'No salió de casa',
              'Se quedó dormida en el autobús',
            ],
            ['it-mi-sono-alzato', 'it-tardi', 'it-moglie'],
            'Laura escribe: «stamattina mi sono alzata tardi e sono uscita di corsa».',
          ),
          question(
            'it.ex.a1siq06mvdfts4',
            MESSAGGIO,
            '¿Qué planes tienen a la noche?',
            'Cenar en lo de los padres de Laura',
            ['Ir al cine', 'Cenar en un restaurante', 'Quedarse en casa'],
            ['it-ci-vado'],
            'Laura escribe: «Stasera ceniamo dai miei genitori, ti ricordi?».',
          ),
          ex.shortAnswer(
            'A che ora ti sei alzato?',
            '¿A qué hora te levantaste? (Responde que a las nueve.)',
            'Mi sono alzato alle nove.',
            ['Mi sono alzata alle nove.', 'Alle nove.'],
            ['it-mi-sono-alzato'],
            { id: 'it.ex.vvxa6n9bpxjvke' },
          ),
          ex.translateWrite(
            'Ayer me levanté temprano.',
            'Ieri mi sono alzato presto.',
            ['it-mi-sono-alzato', 'it-presto'],
            {
              id: 'it.ex.648hgaidcdj5oe',
              acceptedAnswers: ['Ieri mi sono alzata presto.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Ci siamo conosciuti',
        objective: 'Contar cómo se conoció una pareja.',
        intro: {
          explanation:
            'Con ci y si se dice lo que hacen dos personas entre sí: ci siamo conosciuti (nos conocimos), si sono sposati (se casaron). Il fidanzato / la fidanzata es el novio o la novia (también el prometido); il marito y la moglie, el marido y la esposa.',
          examples: [
            { target: 'Ci siamo conosciuti a una festa.', base: 'Nos conocimos en una fiesta.' },
            {
              target: 'I miei genitori si sono sposati a Roma.',
              base: 'Mis papás se casaron en Roma.',
            },
          ],
        },
        takeaways: [
          'Cuentas cómo se conocieron: ci siamo conosciuti.',
          'Nombras fidanzato, marito y moglie.',
        ],
        exercises: [
          ex.translationChoice(
            'fidanzato',
            'novio',
            ['fiador', 'amigo', 'vecino'],
            ['it-fidanzato'],
            { id: 'it.ex.71m1qozpmuekje' },
          ),
          ex.matchPairs(
            [
              ['fidanzato', 'novio'],
              ['marito', 'marido'],
              ['moglie', 'esposa'],
              ['si sono sposati', 'se casaron'],
            ],
            ['it-fidanzato', 'it-marito', 'it-moglie', 'it-si-sono-sposati'],
            { id: 'it.ex.8cfofn0nwdfibq' },
          ),
          ex.listenChoice(
            'Ci siamo conosciuti a una festa.',
            [
              'Ci siamo conosciuti a scuola.',
              'Si sono conosciuti a una festa.',
              'Ci vediamo a una festa.',
            ],
            ['it-ci-siamo-conosciuti', 'it-festa'],
            { id: 'it.ex.ufn8vzd4yzp01x' },
          ),
          ex.fillBlank(
            'I miei genitori si sono ___ nel 1990.',
            'Mis papás se casaron en 1990.',
            'sposati',
            ['conosciuti', 'alzati', 'arrivati'],
            ['it-si-sono-sposati'],
            { id: 'it.ex.re7c64z6kjcjkh', skill: 'vocabulary' },
          ),
          question(
            'it.ex.5qlfjzp4px9mnv',
            STORIA,
            '¿Dónde y cuándo se conocieron Elisa y Marco?',
            'En una fiesta, hace diez años',
            ['En la universidad, hace dos años', 'En Verona, hace diez años', 'En el trabajo'],
            ['it-ci-siamo-conosciuti', 'it-spesso', 'it-fidanzato'],
            'Elisa escribe: «ci siamo conosciuti dieci anni fa a una festa».',
          ),
          question(
            'it.ex.d1q6atc87tatmf',
            STORIA,
            '¿Dónde se casaron?',
            'En Verona',
            ['En Roma', 'En la fiesta', 'Todavía no se casaron'],
            ['it-si-sono-sposati'],
            'Elisa escribe: «Ci siamo sposati a Verona».',
          ),
          question(
            'it.ex.jh94o0kjyvecld',
            STORIA,
            '¿Por qué es especial esa ciudad?',
            'Es la ciudad de Romeo y Julieta',
            ['Es la ciudad de Marco', 'Es donde se conocieron', 'Es la capital de Italia'],
            ['it-si-sono-sposati'],
            'Elisa escribe: «Verona, la città di Romeo e Giulietta!».',
          ),
          ex.shortAnswer(
            'Dove vi siete conosciuti?',
            '¿Dónde se conocieron? (Responde que se conocieron en la universidad.)',
            "Ci siamo conosciuti all'università.",
            [
              'Ci siamo conosciuti all’università.',
              'All’università.',
              "All'università.",
              'Ci siamo conosciute all’università.',
            ],
            ['it-ci-siamo-conosciuti', 'it-universita'],
            { id: 'it.ex.qxvw9jxbsxljqi' },
          ),
          ex.translateWrite(
            'Nos conocimos en Roma.',
            'Ci siamo conosciuti a Roma.',
            ['it-ci-siamo-conosciuti'],
            {
              id: 'it.ex.lzx2ok1tv0rjfc',
              acceptedAnswers: ['Ci siamo conosciute a Roma.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Ci vado spesso',
        objective: 'Usar ci para no repetir un lugar.',
        intro: {
          explanation:
            'Ci reemplaza un lugar ya nombrado: Vai in palestra? — Sì, ci vado tre volte a settimana. Y con amigos: ci sentiamo (hablamos más tarde) y ci vediamo (nos vemos).',
          examples: [
            {
              target: 'Vai in palestra? — Sì, ci vado spesso.',
              base: '¿Vas al gimnasio? — Sí, voy seguido.',
            },
            { target: 'Ci sentiamo stasera!', base: '¡Hablamos esta noche!' },
          ],
        },
        takeaways: ['Usas ci en vez de repetir el lugar.', 'Te despides con ci sentiamo.'],
        exercises: [
          ex.translationChoice(
            'ci vado',
            'voy (ahí)',
            ['nos vamos', 'nos vemos', 'me voy'],
            ['it-ci-vado'],
            { id: 'it.ex.rs0pf91iikwd7q' },
          ),
          ex.fillBlank(
            'Vai in palestra? — Sì, ___ vado ogni giorno.',
            '¿Vas al gimnasio? — Sí, voy todos los días.',
            'ci',
            ['ne', 'lo', 'mi'],
            ['it-ci-vado'],
            {
              id: 'it.ex.cl0u5sg0be518e',
              explanation: 'Ci reemplaza el lugar (in palestra): ci vado.',
            },
          ),
          ex.fillBlank(
            '___ sentiamo stasera!',
            '¡Hablamos esta noche!',
            'Ci',
            ['Si', 'Vi', 'Mi'],
            ['it-ci-sentiamo'],
            { id: 'it.ex.bp7s9hjruzmu4i' },
          ),
          ex.listenChoice(
            'Ci vado tre volte a settimana.',
            [
              'Ci vado due volte a settimana.',
              'Ci andiamo tre volte a settimana.',
              'Ci vado tre volte al mese.',
            ],
            ['it-ci-vado'],
            { id: 'it.ex.g8mhfdr4dq3r3f' },
          ),
          question(
            'it.ex.9szysq0zblpk9t',
            PALESTRA,
            '¿Cada cuánto va Davide al gimnasio?',
            'Tres veces por semana',
            ['Todos los días', 'Pocas veces', 'Una vez al mes'],
            ['it-ci-vado'],
            'Davide dice: «Sì, ci vado tre volte a settimana».',
          ),
          question(
            'it.ex.o70a2338guzszp',
            PALESTRA,
            '¿Qué propone Anna?',
            'Ir juntos mañana',
            ['Ir esta noche', 'Dejar el gimnasio', 'Hablar mañana'],
            ['it-ci-vado', 'it-spesso'],
            'Anna dice: «Io ci vado raramente… Ci andiamo insieme domani?».',
          ),
          question(
            'it.ex.so8t0wfd5f2vqs',
            PALESTRA,
            '¿Cuándo van a arreglar el horario?',
            'Esta noche, por teléfono o mensaje',
            ['Mañana en el gimnasio', 'Ahora mismo', 'El fin de semana'],
            ['it-ci-sentiamo'],
            'Davide dice: «Ci sentiamo stasera per l’orario».',
          ),
          ex.shortAnswer(
            'Vai spesso al mare?',
            '¿Vas seguido al mar? (Responde que sí, que vas todos los veranos.)',
            'Sì, ci vado ogni estate.',
            ['Ci vado ogni estate.', 'Sì, ci vado tutte le estati.'],
            ['it-ci-vado', 'it-spesso'],
            { id: 'it.ex.oxboth2b2cp53e' },
          ),
          ex.translateWrite('Mañana voy (ahí).', 'Ci vado domani.', ['it-ci-vado', 'it-domani'], {
            id: 'it.ex.eam34nelilhxvn',
            acceptedAnswers: ['Domani ci vado.'],
          }),
        ],
      },
    ],
  },
};

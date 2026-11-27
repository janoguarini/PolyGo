import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, IT_A1_RATE, question, reading, w } from '../helpers';

/**
 * Italiano A1 U13 «Profesiones y trabajo» (docs/IT_A1_A2.md): los pronombres plurales (noi, voi,
 * loro), essere y los verbos en -are en plural, nostro / nostra y las profesiones.
 * Falsos amigos: siete es «ustedes son» (el número 7 es sette) y negozio es la tienda.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const FESTA = dialogue(
  'it.stim.a1-u13-festa',
  'Dos personas se conocen en una fiesta.',
  [
    ['Giulia', 'Ciao, io sono Giulia. Che lavoro fai?'],
    ['Matteo', 'Sono infermiere. Lavoro in ospedale, la sera.'],
    ['Giulia', "Anch'io lavoro la sera! Sono cameriera in un ristorante."],
    ['Matteo', 'Allora lavoriamo tutti e due la sera!'],
  ],
  IT_A1_RATE,
);

const POST = reading(
  'it.stim.a1-u13-trattoria',
  'post',
  'Una pareja presenta su restaurante en las redes.',
  [
    'Ciao a tutti! Noi siamo Anna e Pietro.',
    'Abbiamo un piccolo ristorante a Bologna.',
    'Pietro è il cuoco e io sono la cameriera.',
    'Il nostro ristorante è aperto ogni giorno, ma non il lunedì.',
  ],
  { from: 'Anna', title: 'Il nostro ristorante' },
);

const GENITORI = dialogue(
  'it.stim.a1-u13-genitori',
  'Luca habla de su familia con una compañera de clase.',
  [
    ['Sara', 'Luca, che lavoro fanno i tuoi genitori?'],
    ['Luca', 'Mia madre è medico e mio padre è commesso in un negozio.'],
    ['Sara', 'E i tuoi fratelli?'],
    ['Luca', 'Loro sono studenti, come noi.'],
  ],
  IT_A1_RATE,
);

export const IT_A1_U13: ItUnitDef = {
  names: ['Giulia', 'Matteo', 'Anna', 'Pietro', 'Bologna', 'Luca', 'Sara', 'Rex'],
  support: [
    'allora',
    'tutti',
    'abbiamo',
    'aperto',
    'ma',
    'fanno',
    'lavorate',
    'lavora',
    'insieme',
    'tuoi',
  ],
  unit: {
    position: 13,
    title: 'Profesiones y trabajo',
    titleEn: 'Lavoro',
    description:
      'Noi, voi y loro; essere y los verbos en -are en plural; nostro y nostra; profesiones y lugares de trabajo.',
    emoji: '💼',
    objective:
      'Puedes decir de qué trabajas tú y otras personas, hablar en plural (noi lavoriamo, loro lavorano) y presentar a tu grupo.',
    grammar: {
      title: 'Pronombres plurales · essere y -are en plural',
      explanation:
        'Noi (nosotros), voi (ustedes) y loro (ellos, ellas). Essere: noi siamo, voi siete, loro sono. Ojo: siete no es el número 7 (sette), es «ustedes son». Los verbos en -are: noi lavoriamo, voi lavorate, loro lavorano (el acento va en la-vó-ra-no). La profesión va sin artículo con essere (sono medico) y con artículo con fare (faccio il medico).',
      examples: [
        { target: 'Noi siamo studenti.', base: 'Somos estudiantes.' },
        { target: 'Loro lavorano in un ristorante.', base: 'Ellos trabajan en un restaurante.' },
        { target: 'Faccio il cuoco.', base: 'Soy cocinero.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U13). Sin revisión nativa: revisar medico para mujeres, faccio il / sono y el registro de voi.',
    },
    words: [
      w('it-noi', 'noi', 'nosotros / nosotras', 'Noi siamo amici.', 'Somos amigos.', ['pronouns'], {
        acceptedTranslations: ['nosotros', 'nosotras'],
      }),
      w(
        'it-voi',
        'voi',
        'ustedes',
        'Voi siete italiani?',
        '¿Ustedes son italianos?',
        ['pronouns'],
        {
          acceptedTranslations: ['vosotros', 'vosotras'],
        },
      ),
      w(
        'it-loro',
        'loro',
        'ellos / ellas',
        'Loro sono di Roma.',
        'Ellos son de Roma.',
        ['pronouns'],
        {
          acceptedTranslations: ['ellos', 'ellas'],
        },
      ),
      w('it-siamo', 'siamo', 'somos', 'Noi siamo studenti.', 'Somos estudiantes.', ['verbs']),
      w(
        'it-voi-siete',
        'voi siete',
        'ustedes son',
        'Voi siete argentini?',
        '¿Ustedes son argentinos?',
        ['verbs'],
        { acceptedTranslations: ['vosotros sois'] },
      ),
      w(
        'it-lavoriamo',
        'lavoriamo',
        'trabajamos',
        'Noi lavoriamo la mattina.',
        'Trabajamos a la mañana.',
        ['verbs', 'work'],
      ),
      w(
        'it-lavorano',
        'lavorano',
        'trabajan',
        'Loro lavorano la sera.',
        'Ellos trabajan a la noche.',
        ['verbs', 'work'],
      ),
      w(
        'it-che-lavoro-fai',
        'che lavoro fai?',
        '¿de qué trabajas?',
        'Che lavoro fai? — Sono insegnante.',
        '¿De qué trabajas? — Soy docente.',
        ['work', 'questions'],
        {
          acceptedTranslations: [
            '¿a qué te dedicás?',
            '¿a qué te dedicas?',
            '¿en qué trabajás?',
            '¿en qué trabajas?',
            '¿de qué trabajás?',
          ],
        },
      ),
      w('it-medico', 'medico', 'médico', 'Mio padre è medico.', 'Mi papá es médico.', ['work'], {
        acceptedTranslations: ['médica', 'doctor', 'doctora'],
        emoji: '🩺',
      }),
      w(
        'it-infermiere',
        'infermiere',
        'enfermero',
        'Lei è infermiera.',
        'Ella es enfermera.',
        ['work'],
        { acceptedTexts: ['infermiera'], acceptedTranslations: ['enfermera'], emoji: '🧑‍⚕️' },
      ),
      w(
        'it-cameriere',
        'cameriere',
        'mesero',
        'La cameriera è italiana.',
        'La mesera es italiana.',
        ['work', 'food'],
        {
          acceptedTexts: ['cameriera'],
          acceptedTranslations: ['moza', 'camarero', 'camarera', 'mesero', 'mozo'],
          emoji: '🤵',
        },
      ),
      w(
        'it-cuoco',
        'cuoco',
        'cocinero',
        'Il cuoco è in cucina.',
        'El cocinero está en la cocina.',
        ['work', 'food'],
        {
          acceptedTexts: ['cuoca'],
          acceptedTranslations: ['cocinera'],
          emoji: '🧑‍🍳',
        },
      ),
      w(
        'it-insegnante',
        'insegnante',
        'docente',
        'Mia sorella è insegnante.',
        'Mi hermana es docente.',
        ['work'],
        { acceptedTranslations: ['maestro', 'maestra'], emoji: '🧑‍🏫' },
      ),
      w(
        'it-commesso',
        'commesso',
        'vendedor (de tienda)',
        'Il commesso lavora in un negozio.',
        'El vendedor trabaja en una tienda.',
        ['work', 'shopping'],
        { acceptedTexts: ['commessa'], acceptedTranslations: ['vendedor', 'vendedora'] },
      ),
      w(
        'it-impiegato',
        'impiegato',
        'empleado (de oficina)',
        'Mio fratello è impiegato.',
        'Mi hermano es empleado.',
        ['work'],
        { acceptedTexts: ['impiegata'], acceptedTranslations: ['empleado', 'empleada'] },
      ),
      w(
        'it-ufficio',
        'ufficio',
        'oficina',
        'Lavoro in ufficio.',
        'Trabajo en una oficina.',
        ['work', 'places'],
        {
          emoji: '🏢',
        },
      ),
      w(
        'it-negozio',
        'negozio',
        'tienda',
        'Il negozio è vicino.',
        'La tienda está cerca.',
        ['places', 'shopping'],
        {
          acceptedTranslations: ['local', 'comercio'],
          emoji: '🏪',
        },
      ),
      w('it-nostro', 'nostro', 'nuestro', 'Il nostro cane è nero.', 'Nuestro perro es negro.', [
        'possessives',
      ]),
      w('it-nostra', 'nostra', 'nuestra', 'La nostra casa è piccola.', 'Nuestra casa es chica.', [
        'possessives',
      ]),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Noi, voi, loro',
        objective: 'Hablar de varias personas con essere.',
        intro: {
          explanation:
            'Para hablar de varias personas: noi (nosotros), voi (ustedes) y loro (ellos, ellas). Essere: noi siamo, voi siete, loro sono. Ojo con siete: no es el número 7 (sette), es «ustedes son».',
          examples: [
            { target: 'Noi siamo amici.', base: 'Somos amigos.' },
            { target: 'Voi siete italiani?', base: '¿Ustedes son italianos?' },
          ],
        },
        takeaways: ['Usas noi, voi y loro.', 'Conjugas essere en plural: siamo, siete, sono.'],
        exercises: [
          ex.translationChoice(
            'loro',
            'ellos / ellas',
            ['ustedes', 'nosotros / nosotras', 'él'],
            ['it-loro'],
            {
              id: 'it.ex.qexg3tcpp6tz54',
            },
          ),
          ex.translationChoice(
            'voi siete',
            'ustedes son',
            ['ustedes son siete', 'somos', 'ellos son'],
            ['it-voi-siete', 'it-voi'],
            {
              id: 'it.ex.klf9zkgub4re9m',
              explanation:
                'Falso amigo: siete es essere con voi («ustedes son»); el número 7 es sette.',
            },
          ),
          ex.matchPairs(
            [
              ['noi', 'nosotros / nosotras'],
              ['voi', 'ustedes'],
              ['loro', 'ellos / ellas'],
              ['siamo', 'somos'],
            ],
            ['it-noi', 'it-voi', 'it-loro', 'it-siamo'],
            { id: 'it.ex.8xnkjp9ffmifh4' },
          ),
          ex.listenChoice(
            'Noi siamo amici.',
            ['Loro sono amici.', 'Noi siamo italiani.', 'Voi siete amici?'],
            ['it-noi', 'it-siamo'],
            { id: 'it.ex.w4if7mk1r59ys0' },
          ),
          ex.fillBlank(
            'Noi ___ argentini.',
            'Somos argentinos.',
            'siamo',
            ['siete', 'sono', 'sei'],
            ['it-noi', 'it-siamo'],
            {
              id: 'it.ex.e7y6ia3mglyl2z',
              explanation: 'Con noi, essere es siamo.',
            },
          ),
          ex.fillBlank(
            'Voi ___ italiani?',
            '¿Ustedes son italianos?',
            'siete',
            ['siamo', 'sette', 'è'],
            ['it-voi-siete'],
            {
              id: 'it.ex.4p75ro3rvoxay7',
              explanation: 'Con voi, essere es siete (sette es el número 7).',
            },
          ),
          ex.fillBlank(
            'Marco e Anna ___ studenti.',
            'Marco y Anna son estudiantes.',
            'sono',
            ['siamo', 'siete', 'è'],
            ['it-loro'],
            {
              id: 'it.ex.jsyu2e51ydf3wv',
              explanation: 'Con loro (o dos personas), essere es sono, igual que con io.',
            },
          ),
          ex.orderWords('Loro sono di Napoli.', 'Ellos son de Nápoles.', ['it-loro'], {
            id: 'it.ex.mta9oy3s3a9obl',
          }),
          ex.shortAnswer(
            'Voi siete argentini?',
            '¿Ustedes son argentinos? (Responde que sí, que son argentinos.)',
            'Sì, noi siamo argentini.',
            [
              'Sì, siamo argentini.',
              'Siamo argentini.',
              'Noi siamo argentini.',
              'Sì, siamo argentine.',
            ],
            ['it-noi', 'it-siamo'],
            { id: 'it.ex.of4iefa3u16hwz' },
          ),
          ex.translateWrite('Ellos son amigos.', 'Loro sono amici.', ['it-loro'], {
            id: 'it.ex.dylxkxllcweyj2',
            acceptedAnswers: ['Sono amici.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lavoriamo, lavorano',
        objective: 'Conjugar los verbos en -are en plural.',
        intro: {
          explanation:
            'En plural, los verbos en -are terminan en -iamo (noi), -ate (voi) y -ano (loro): lavoriamo, lavorate, lavorano. En lavorano el acento va atrás: la-vó-ra-no, nunca «lavoranó».',
          examples: [
            { target: 'Noi lavoriamo la mattina.', base: 'Trabajamos a la mañana.' },
            { target: 'Loro lavorano a casa.', base: 'Ellos trabajan en casa.' },
          ],
        },
        takeaways: [
          'Conjugas -are en plural: lavoriamo, lavorate, lavorano.',
          'Dices cuándo y dónde trabaja un grupo.',
        ],
        exercises: [
          ex.translationChoice(
            'lavoriamo',
            'trabajamos',
            ['trabajan', 'trabajo', 'trabajas'],
            ['it-lavoriamo'],
            {
              id: 'it.ex.2q6l9ksg5is79q',
            },
          ),
          ex.fillBlank(
            'Noi ___ in un ristorante.',
            'Trabajamos en un restaurante.',
            'lavoriamo',
            ['lavorano', 'lavoro', 'lavori'],
            ['it-noi', 'it-lavoriamo'],
            { id: 'it.ex.4lnlgjqvvzjs2p' },
          ),
          ex.fillBlank(
            'Loro ___ la sera.',
            'Ellos trabajan a la noche.',
            'lavorano',
            ['lavoriamo', 'lavoro', 'lavori'],
            ['it-loro', 'it-lavorano'],
            { id: 'it.ex.xgjfn4w02x3c2n' },
          ),
          ex.fillBlank(
            'Voi ___ oggi?',
            '¿Ustedes trabajan hoy?',
            'lavorate',
            ['lavoriamo', 'lavorano', 'lavoro'],
            ['it-voi'],
            {
              id: 'it.ex.rdf5fpb1wr3hhl',
              explanation: 'Con voi, los verbos en -are terminan en -ate: lavorate.',
            },
          ),
          ex.listenChoice(
            'Lavoriamo ogni giorno.',
            ['Lavorano ogni giorno.', 'Lavoriamo oggi.', 'Lavoro ogni giorno.'],
            ['it-lavoriamo', 'it-ogni-giorno'],
            { id: 'it.ex.92ljenorpceuvc' },
          ),
          ex.translationChoice(
            'lavorano',
            'trabajan',
            ['trabajamos', 'trabaja', 'trabajo'],
            ['it-lavorano'],
            {
              id: 'it.ex.nekz8dpi58tfhp',
            },
          ),
          ex.orderWords(
            'Loro lavorano a casa.',
            'Ellos trabajan en casa.',
            ['it-loro', 'it-lavorano', 'it-a-casa'],
            {
              id: 'it.ex.ziw26v4bfa9trf',
            },
          ),
          ex.shortAnswer(
            'Voi lavorate la sera?',
            '¿Ustedes trabajan a la noche? (Responde que no, que trabajan a la mañana.)',
            'No, noi lavoriamo la mattina.',
            ['No, lavoriamo la mattina.', 'Lavoriamo la mattina.', 'Noi lavoriamo la mattina.'],
            ['it-noi', 'it-lavoriamo', 'it-la-mattina'],
            { id: 'it.ex.erbhdacddqydp1' },
          ),
          ex.translateWrite(
            'Trabajamos en casa.',
            'Lavoriamo a casa.',
            ['it-lavoriamo', 'it-a-casa'],
            {
              id: 'it.ex.nwr2xsjge1x5rd',
              acceptedAnswers: ['Noi lavoriamo a casa.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Che lavoro fai?',
        objective: 'Preguntar y decir de qué trabaja alguien.',
        intro: {
          explanation:
            'Che lavoro fai? es «¿de qué trabajas?». Se responde con sono y la profesión sin artículo (sono medico) o con faccio y artículo (faccio il cuoco). En femenino, -o pasa a -a (cuoca) y -iere a -iera (infermiera); insegnante no cambia.',
          examples: [
            {
              target: 'Che lavoro fai? — Sono infermiera.',
              base: '¿De qué trabajas? — Soy enfermera.',
            },
            { target: 'Faccio il cuoco.', base: 'Soy cocinero.' },
          ],
        },
        takeaways: [
          'Preguntas la profesión con che lavoro fai?',
          'Dices profesiones con sono o con faccio il / la.',
        ],
        exercises: [
          ex.imageChoice('🩺', 'medico', ['cuoco', 'insegnante', 'infermiere'], ['it-medico'], {
            id: 'it.ex.0qigmqseov9shr',
          }),
          ex.imageChoice('🧑‍🍳', 'cuoco', ['medico', 'insegnante', 'infermiere'], ['it-cuoco'], {
            id: 'it.ex.k9hukjxanyntjl',
          }),
          ex.translationChoice(
            'che lavoro fai?',
            '¿de qué trabajas?',
            ['¿dónde vives?', '¿cómo te llamas?', '¿qué hora es?'],
            ['it-che-lavoro-fai'],
            { id: 'it.ex.fhayws66t1wnox' },
          ),
          ex.listenChoice(
            'Mia sorella è infermiera.',
            ['Mia sorella è insegnante.', 'Mio fratello è infermiere.', 'Mia sorella è cuoca.'],
            ['it-infermiere', 'it-sorella'],
            { id: 'it.ex.u4vz6ec0itdgz8' },
          ),
          ex.fillBlank(
            'Mia madre è ___.',
            'Mi mamá es enfermera.',
            'infermiera',
            ['infermiere', 'un infermiere', 'la infermiera'],
            ['it-infermiere', 'it-madre'],
            {
              id: 'it.ex.wyoryq8jaf6oyo',
              explanation:
                'Con essere la profesión va sin artículo; en femenino, -iere pasa a -iera.',
            },
          ),
          ex.fillBlank(
            'Faccio ___ cuoco.',
            'Soy cocinero.',
            'il',
            ['lo', 'la', 'un'],
            ['it-cuoco'],
            {
              id: 'it.ex.jpegs21jbcsvqv',
              explanation:
                'Con fare la profesión lleva artículo: faccio il cuoco, faccio la cameriera.',
            },
          ),
          ex.matchPairs(
            [
              ['medico', 'médico'],
              ['cuoco', 'cocinero'],
              ['insegnante', 'docente'],
              ['infermiere', 'enfermero'],
            ],
            ['it-medico', 'it-cuoco', 'it-insegnante', 'it-infermiere'],
            { id: 'it.ex.e6pa9t02b7ifbr' },
          ),
          ex.shortAnswer(
            'Che lavoro fai?',
            '¿De qué trabajas? (Responde que eres estudiante.)',
            'Sono studente.',
            [
              'Sono studentessa.',
              'Io sono studente.',
              'Io sono studentessa.',
              'Studente.',
              'Studentessa.',
            ],
            ['it-che-lavoro-fai', 'it-studente'],
            { id: 'it.ex.qmha4ie8optkdr' },
          ),
          ex.translateWrite(
            'Mi papá es enfermero.',
            'Mio padre è infermiere.',
            ['it-infermiere', 'it-mio'],
            {
              id: 'it.ex.5dal20da05j8sw',
              acceptedAnswers: ['Mio padre fa l’infermiere.', "Mio padre fa l'infermiere."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'In ufficio, in negozio',
        objective: 'Decir dónde trabaja cada uno.',
        intro: {
          explanation:
            'Se dice lavoro in ufficio, in negozio, in ospedale (sin artículo). Ojo: negozio es la tienda, el local; el cameriere (el mesero) no tiene nada que ver con la camera (la habitación).',
          examples: [
            { target: 'Lavoro in ufficio.', base: 'Trabajo en una oficina.' },
            {
              target: 'Mio fratello è commesso in un negozio.',
              base: 'Mi hermano es vendedor en una tienda.',
            },
          ],
        },
        takeaways: [
          'Dices dónde trabajas: in ufficio, in negozio.',
          'Nombras trabajos de la tienda y del restaurante.',
        ],
        exercises: [
          ex.translationChoice(
            'negozio',
            'tienda',
            ['oficina', 'empresa', 'mercado'],
            ['it-negozio'],
            {
              id: 'it.ex.3hfvx4bshk634o',
              explanation: 'Negozio es la tienda, el local donde se compra.',
            },
          ),
          ex.translationChoice(
            'ufficio',
            'oficina',
            ['tienda', 'escuela', 'hospital'],
            ['it-ufficio'],
            {
              id: 'it.ex.5ff7okm1k36sdm',
            },
          ),
          ex.imageChoice('🤵', 'cameriere', ['cuoco', 'commesso', 'medico'], ['it-cameriere'], {
            id: 'it.ex.uvh38pxvufcogf',
          }),
          ex.listenChoice(
            'Il cameriere lavora in un ristorante.',
            [
              'Il cuoco lavora in un ristorante.',
              'Il cameriere lavora in un ufficio.',
              'Il commesso lavora in un negozio.',
            ],
            ['it-cameriere', 'it-ristorante'],
            { id: 'it.ex.0ehstb44qhoemt' },
          ),
          ex.fillBlank(
            'Mio fratello è ___ in un negozio.',
            'Mi hermano es vendedor en una tienda.',
            'commesso',
            ['cuoco', 'medico', 'insegnante'],
            ['it-commesso', 'it-negozio'],
            { id: 'it.ex.xjh82wqnz3ndqb', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "L'impiegato lavora in ___.",
            'El empleado trabaja en la oficina.',
            'ufficio',
            ['cucina', 'scuola', 'ospedale'],
            ['it-impiegato', 'it-ufficio'],
            { id: 'it.ex.yk8mhyz52kzvv2', skill: 'vocabulary' },
          ),
          question(
            'it.ex.bwjm3o7we4g9lf',
            FESTA,
            '¿Dónde trabaja Matteo?',
            'En un hospital, a la noche',
            ['En un restaurante, a la mañana', 'En una oficina', 'En una tienda'],
            ['it-infermiere'],
            'Matteo dice: «Sono infermiere. Lavoro in ospedale, la sera».',
          ),
          question(
            'it.ex.56lsl01lp4fyi4',
            FESTA,
            '¿Qué tienen en común Giulia y Matteo?',
            'Los dos trabajan a la noche',
            [
              'Los dos son enfermeros',
              'Los dos trabajan en un restaurante',
              'Los dos son estudiantes',
            ],
            ['it-lavoriamo', 'it-cameriere'],
            'Giulia es moza y dice «Anch’io lavoro la sera!»; Matteo responde «lavoriamo tutti e due la sera!».',
          ),
          ex.shortAnswer(
            'Dove lavori?',
            '¿Dónde trabajas? (Responde que en una oficina.)',
            'Lavoro in ufficio.',
            ['In ufficio.', 'Lavoro in un ufficio.', 'Io lavoro in ufficio.'],
            ['it-ufficio'],
            { id: 'it.ex.5vcx9abfgdqjfd' },
          ),
          ex.translateWrite(
            'Ella es moza en un restaurante.',
            'Lei è cameriera in un ristorante.',
            ['it-cameriere', 'it-ristorante'],
            {
              id: 'it.ex.z9a91kiuh720v8',
              acceptedAnswers: [
                'È cameriera in un ristorante.',
                'Lei fa la cameriera in un ristorante.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Il nostro lavoro',
        objective: 'Usar nostro y nostra y entender la presentación de un grupo.',
        intro: {
          explanation:
            'Nostro y nostra son «nuestro» y «nuestra». En italiano llevan artículo: il nostro ristorante, la nostra casa. Concuerdan con la cosa, no con las personas que hablan.',
          examples: [
            { target: 'Il nostro ufficio è piccolo.', base: 'Nuestra oficina es chica.' },
            { target: 'La nostra famiglia è grande.', base: 'Nuestra familia es grande.' },
          ],
        },
        takeaways: [
          'Usas il nostro y la nostra según la cosa.',
          'Entiendes una presentación de un grupo.',
        ],
        exercises: [
          ex.fillBlank(
            'La ___ casa è grande.',
            'Nuestra casa es grande.',
            'nostra',
            ['nostro', 'noi', 'loro'],
            ['it-nostra'],
            {
              id: 'it.ex.8mkhkx7d4ro4bh',
              explanation: 'Casa es femenino: la nostra casa.',
            },
          ),
          ex.fillBlank(
            'Il ___ cane si chiama Rex.',
            'Nuestro perro se llama Rex.',
            'nostro',
            ['nostra', 'noi', 'voi'],
            ['it-nostro', 'it-cane'],
            { id: 'it.ex.otlg1t5kmzkkuf' },
          ),
          ex.listenChoice(
            'La nostra famiglia è grande.',
            [
              'La nostra famiglia è piccola.',
              'Il nostro figlio è grande.',
              'La mia famiglia è grande.',
            ],
            ['it-nostra', 'it-famiglia'],
            { id: 'it.ex.l53tjquuzjydaa' },
          ),
          question(
            'it.ex.gbzly7kmzowpsz',
            POST,
            '¿Qué hacen Anna y Pietro en el restaurante?',
            'Pietro es cocinero y Anna es moza',
            ['Los dos son cocineros', 'Anna es cocinera y Pietro es mesero', 'Los dos son meseros'],
            ['it-cuoco', 'it-cameriere'],
            'Anna escribe: «Pietro è il cuoco e io sono la cameriera».',
          ),
          question(
            'it.ex.pz725yfwmgtnrf',
            POST,
            '¿Qué día está cerrado el restaurante?',
            'El lunes',
            ['El domingo', 'Ningún día', 'El sábado'],
            ['it-nostro'],
            'La publicación dice: «aperto ogni giorno, ma non il lunedì».',
          ),
          question(
            'it.ex.7y0ax7eh1lqgx6',
            GENITORI,
            '¿A qué se dedica el papá de Luca?',
            'Es vendedor en una tienda',
            ['Es médico', 'Es docente', 'Es cocinero'],
            ['it-commesso', 'it-negozio'],
            'Luca dice: «mio padre è commesso in un negozio».',
          ),
          question(
            'it.ex.mg1vlc0iikn2fk',
            GENITORI,
            '¿Qué son los hermanos de Luca?',
            'Estudiantes, como Luca y Sara',
            ['Médicos, como su mamá', 'Vendedores', 'Docentes'],
            ['it-loro', 'it-noi'],
            'Luca dice: «Loro sono studenti, come noi».',
          ),
          ex.orderWords(
            'Il nostro ufficio è piccolo.',
            'Nuestra oficina es chica.',
            ['it-nostro', 'it-ufficio'],
            {
              id: 'it.ex.t1tb1d7hzhdr1w',
            },
          ),
          ex.shortAnswer(
            'Lavorate insieme?',
            '¿Trabajan juntos? (Responde que sí, que trabajan en su restaurante.)',
            'Sì, lavoriamo nel nostro ristorante.',
            [
              'Sì, noi lavoriamo nel nostro ristorante.',
              'Lavoriamo nel nostro ristorante.',
              'Sì, lavoriamo insieme.',
            ],
            ['it-lavoriamo', 'it-nostro'],
            { id: 'it.ex.e2owfp2tg4fb7v' },
          ),
          ex.translateWrite(
            'Nuestra familia es grande.',
            'La nostra famiglia è grande.',
            ['it-nostra', 'it-famiglia'],
            {
              id: 'it.ex.jsqspb6qnf3mj0',
            },
          ),
        ],
      },
    ],
  },
};

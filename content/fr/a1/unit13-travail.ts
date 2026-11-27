import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U13 «Trabajo y estudios» (docs/FR_A1_A2.md): preguntar y decir a qué se dedica
 * alguien y dónde trabaja; profesiones con género (serveur / serveuse, vendeur / vendeuse,
 * infirmier / infirmière, boulanger / boulangère; médecin invariable); la profesión sin artículo con
 * être (elle est médecin) frente a c'est un médecin; être y avoir en plural (nous sommes, ils sont,
 * nous avons, ils ont); je commence y un verbo en -ir (je finis, il finit).
 * Pronunciación: liaison ils‿ont con sonido z frente a ils sont con s; la r final suena en el
 * femenino (boulangère) y no en el masculino (boulanger). Falso amigo: le bureau es la oficina.
 * Cultura: la jornada legal en Francia es de 35 horas semanales.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SOIREE = dialogue(
  'fr.stim.a1-u13-soiree',
  'Sarah y Karim se conocen en una fiesta y hablan de su trabajo.',
  [
    ['Sarah', "Qu'est-ce que tu fais dans la vie, Karim?"],
    ['Karim', "Je suis infirmier. Je travaille à l'hôpital."],
    ['Sarah', 'Moi, je suis ingénieure. Je travaille dans une entreprise à Lyon.'],
    ['Karim', 'Tu aimes ton travail?'],
    ['Sarah', 'Oui, beaucoup! Et mon bureau est près de la gare.'],
  ],
  FR_A1_RATE,
);

const FAMILLE = reading(
  'fr.stim.a1-u13-famille',
  'description',
  'Una chica describe en qué trabaja cada uno en su familia.',
  [
    'Nous sommes la famille Martin.',
    'Mon père est boulanger: il commence à quatre heures du matin!',
    'Ma mère est professeure dans une école.',
    'Moi, je suis vendeuse dans un magasin. Je finis à sept heures.',
  ],
  { title: 'Le travail dans ma famille' },
);

export const FR_A1_U13: FrUnitDef = {
  names: ['Sarah', 'Karim', 'Martin', 'Lyon', 'Claire', 'Marc', 'Léa'],
  support: ['finit'],
  unit: {
    position: 13,
    title: 'Trabajo y estudios',
    titleEn: 'Le travail',
    description:
      'Profesiones con género, la profesión sin artículo con être, être y avoir en plural (ils‿ont / ils sont), je commence y je finis. Falso amigo: le bureau.',
    emoji: '💼',
    objective:
      'Puedes preguntar y decir a qué se dedica alguien, dónde trabaja y a qué hora empieza y termina, y hablar de tu familia en plural.',
    grammar: {
      title: 'Je suis médecin · nous sommes, ils ont · je finis',
      explanation:
        "Con être, la profesión va sin artículo: elle est médecin, je suis professeur (nunca «je suis un professeur»); con c'est, en cambio, sí: c'est un médecin. Muchas profesiones tienen femenino: serveur → serveuse, vendeur → vendeuse, infirmier → infirmière, boulanger → boulangère. Être y avoir en plural: nous sommes, vous êtes, ils sont; nous avons, vous avez, ils ont. Ojo con la liaison: en ils ont la s se une a la vocal con un sonido z; en ils sont se oye una s. Finir es un verbo en -ir: je finis, tu finis, il finit (suenan igual).",
      examples: [
        { target: 'Elle est médecin.', base: 'Ella es médica.' },
        {
          target: 'Nous sommes professeurs et nous avons deux enfants.',
          base: 'Somos profesores y tenemos dos hijos.',
        },
        {
          target: 'Je commence à neuf heures et je finis à cinq heures.',
          base: 'Empiezo a las nueve y termino a las cinco.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U13). Sin revisión nativa: se usa el femenino «professeure» e «ingénieure» (uso actual en Francia); revisar «Nous sommes la famille Martin» y «Le travail dans ma famille» como título.',
    },
    words: [
      w(
        'fr-le-travail',
        'le travail',
        'el trabajo',
        "J'aime mon travail.",
        'Me gusta mi trabajo.',
        ['work', 'm'],
        {
          emoji: '💼',
        },
      ),
      w(
        'fr-le-metier',
        'le métier',
        'la profesión',
        'Quel est ton métier?',
        '¿Cuál es tu profesión?',
        ['work', 'm'],
        {
          acceptedTranslations: ['el oficio'],
        },
      ),
      w(
        'fr-qu-est-ce-que-tu-fais-dans-la-vie',
        "qu'est-ce que tu fais dans la vie?",
        '¿a qué te dedicas?',
        "Qu'est-ce que tu fais dans la vie? — Je suis professeur.",
        '¿A qué te dedicas? — Soy profesor.',
        ['work', 'questions'],
        {
          acceptedTranslations: ['¿a qué te dedicás?', '¿de qué trabajás?', '¿de qué trabajas?'],
          acceptedTexts: ["qu'est-ce que tu fais dans la vie?"],
        },
      ),
      w(
        'fr-le-medecin',
        'le médecin',
        'el médico',
        'Ma sœur est médecin.',
        'Mi hermana es médica.',
        ['work', 'm'],
        {
          acceptedTranslations: ['la médica', 'el doctor', 'la doctora'],
          emoji: '🩺',
        },
      ),
      w(
        'fr-l-infirmier',
        "l'infirmier",
        'el enfermero',
        "Il est infirmier à l'hôpital.",
        'Es enfermero en el hospital.',
        ['work'],
        {
          acceptedTranslations: ['la enfermera'],
          acceptedTexts: ["l'infirmière"],
        },
      ),
      w(
        'fr-le-serveur',
        'le serveur',
        'el mesero',
        'Le serveur travaille le soir.',
        'El mesero trabaja por la noche.',
        ['work'],
        {
          acceptedTranslations: ['la moza', 'el camarero', 'la camarera', 'el mozo', 'la mesera'],
          acceptedTexts: ['la serveuse'],
        },
      ),
      w(
        'fr-le-vendeur',
        'le vendeur',
        'el vendedor',
        'Ma mère est vendeuse dans un magasin.',
        'Mi mamá es vendedora en una tienda.',
        ['work'],
        {
          acceptedTranslations: ['la vendedora'],
          acceptedTexts: ['la vendeuse'],
        },
      ),
      w(
        'fr-le-professeur',
        'le professeur',
        'el profesor',
        'Le professeur de français est de Paris.',
        'El profesor de francés es de París.',
        ['work'],
        {
          acceptedTranslations: ['la profesora', 'el docente'],
        },
      ),
      w(
        'fr-l-ingenieur',
        "l'ingénieur",
        'el ingeniero',
        'Mon frère est ingénieur.',
        'Mi hermano es ingeniero.',
        ['work'],
        {
          acceptedTranslations: ['la ingeniera'],
        },
      ),
      w(
        'fr-le-boulanger',
        'le boulanger',
        'el panadero',
        'Le boulanger commence à quatre heures.',
        'El panadero empieza a las cuatro.',
        ['work'],
        {
          acceptedTranslations: ['la panadera'],
          acceptedTexts: ['la boulangère'],
        },
      ),
      w(
        'fr-le-bureau',
        'le bureau',
        'la oficina',
        'Le bureau est près de la gare.',
        'La oficina está cerca de la estación.',
        ['work', 'places', 'm'],
        {
          acceptedTranslations: ['el escritorio'],
          emoji: '🏢',
        },
      ),
      w(
        'fr-l-hopital',
        "l'hôpital",
        'el hospital',
        "L'hôpital est à gauche.",
        'El hospital está a la izquierda.',
        ['work', 'places', 'm'],
        {
          emoji: '🏥',
        },
      ),
      w(
        'fr-l-ecole',
        "l'école",
        'la escuela',
        "Les enfants vont à l'école.",
        'Los chicos van a la escuela.',
        ['places', 'f'],
        {
          acceptedTranslations: ['el colegio'],
          emoji: '🏫',
        },
      ),
      w(
        'fr-nous-sommes',
        'nous sommes',
        'somos',
        'Nous sommes étudiants.',
        'Somos estudiantes.',
        ['verbs'],
        {
          acceptedTranslations: ['nosotros somos'],
        },
      ),
      w('fr-ils-sont', 'ils sont', 'ellos son', 'Ils sont serveurs.', 'Son meseros.', ['verbs'], {
        acceptedTranslations: ['ellas son'],
        acceptedTexts: ['elles sont'],
      }),
      w(
        'fr-nous-avons',
        'nous avons',
        'tenemos',
        'Nous avons deux enfants.',
        'Tenemos dos hijos.',
        ['verbs'],
        {
          acceptedTranslations: ['nosotros tenemos'],
        },
      ),
      w(
        'fr-ils-ont',
        'ils ont',
        'ellos tienen',
        'Ils ont un chien.',
        'Tienen un perro.',
        ['verbs'],
        {
          acceptedTranslations: ['ellas tienen'],
          acceptedTexts: ['elles ont'],
        },
      ),
      w(
        'fr-l-entreprise',
        "l'entreprise",
        'la empresa',
        'Je travaille dans une grande entreprise.',
        'Trabajo en una empresa grande.',
        ['work', 'f'],
      ),
      w(
        'fr-je-commence',
        'je commence',
        'empiezo',
        'Je commence à neuf heures.',
        'Empiezo a las nueve.',
        ['verbs', 'work'],
        {
          acceptedTranslations: ['comienzo'],
        },
      ),
      w(
        'fr-je-finis',
        'je finis',
        'termino',
        'Je finis le travail à six heures.',
        'Termino el trabajo a las seis.',
        ['verbs', 'work'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "Qu'est-ce que tu fais dans la vie?",
        objective: 'Preguntar y decir a qué se dedica alguien.',
        intro: {
          explanation:
            "Para preguntar la profesión: qu'est-ce que tu fais dans la vie? (literalmente, «¿qué haces en la vida?»). Se responde con je suis + profesión, sin artículo: je suis médecin, nunca «je suis un médecin». Con c'est, en cambio, sí va el artículo: c'est un médecin. Médecin sirve también para una mujer: elle est médecin.",
          examples: [
            {
              target: "Qu'est-ce que tu fais dans la vie? — Je suis professeur.",
              base: '¿A qué te dedicas? — Soy profesor.',
            },
            { target: 'Ma sœur est médecin.', base: 'Mi hermana es médica.' },
          ],
        },
        takeaways: [
          "Preguntas la profesión con qu'est-ce que tu fais dans la vie?",
          "Dices je suis médecin sin artículo, pero c'est un médecin.",
        ],
        exercises: [
          ex.translationChoice(
            'le médecin',
            'el médico',
            ['el enfermero', 'el profesor', 'el ingeniero'],
            ['fr-le-medecin'],
            { id: 'fr.ex.ip95crs0nznmx0' },
          ),
          ex.translationChoice(
            "qu'est-ce que tu fais dans la vie?",
            '¿a qué te dedicas?',
            ['¿cómo te llamas?', '¿de dónde eres?', '¿qué haces hoy?'],
            ['fr-qu-est-ce-que-tu-fais-dans-la-vie'],
            { id: 'fr.ex.e6eejqj863to4v' },
          ),
          ex.matchPairs(
            [
              ['le médecin', 'el médico'],
              ['le professeur', 'el profesor'],
              ["l'ingénieur", 'el ingeniero'],
              ['le métier', 'la profesión'],
            ],
            ['fr-le-medecin', 'fr-le-professeur', 'fr-l-ingenieur', 'fr-le-metier'],
            { id: 'fr.ex.50r099fsla6n14' },
          ),
          ex.fillBlank(
            'Ma sœur est ___.',
            'Mi hermana es médica.',
            'médecin',
            ['un médecin', 'la médecin', 'une médecin'],
            ['fr-le-medecin'],
            {
              id: 'fr.ex.821ulnykoahcuw',
              explanation: 'Con être, la profesión va sin artículo: elle est médecin.',
            },
          ),
          ex.listenChoice(
            'Je suis professeur.',
            ['Je suis ingénieur.', 'Il est professeur.', 'Tu es professeur?'],
            ['fr-le-professeur'],
            { id: 'fr.ex.gbir5r2m7qk86x' },
          ),
          ex.fillBlank(
            "Qu'est-ce que tu fais dans la ___? — Je suis ingénieur.",
            '¿A qué te dedicas? — Soy ingeniero.',
            'vie',
            ['ville', 'famille', 'semaine'],
            ['fr-qu-est-ce-que-tu-fais-dans-la-vie', 'fr-l-ingenieur'],
            {
              id: 'fr.ex.k5i9sjyqlbufaz',
              skill: 'vocabulary',
              explanation: 'La vie es la vida; no la confundas con la ville, la ciudad.',
            },
          ),
          ex.fillBlank(
            'Mon père? ___ un médecin.',
            '¿Mi papá? Es médico.',
            "C'est",
            ['Il est', 'Je suis', 'Tu es'],
            ['fr-le-medecin'],
            {
              id: 'fr.ex.v2k2pyetn8cxzi',
              explanation:
                "Con artículo se usa c'est: c'est un médecin. Sin artículo, il est médecin.",
            },
          ),
          ex.orderWords('Quel est ton métier?', '¿Cuál es tu profesión?', ['fr-le-metier'], {
            id: 'fr.ex.9fmmqnp456zdj7',
          }),
          ex.translateWrite('Soy profesor.', 'Je suis professeur.', ['fr-le-professeur'], {
            id: 'fr.ex.yzdfwxtlfvk8pl',
            acceptedAnswers: ['Je suis professeure.'],
          }),
          ex.shortAnswer(
            "Qu'est-ce que tu fais dans la vie?",
            '¿A qué te dedicas? (Responde que eres ingeniero.)',
            'Je suis ingénieur.',
            ['Je suis ingénieure.', 'Moi, je suis ingénieur.'],
            ['fr-l-ingenieur', 'fr-qu-est-ce-que-tu-fais-dans-la-vie'],
            { id: 'fr.ex.aie6u73c588rqv' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Serveur, serveuse',
        objective: 'Decir profesiones en masculino y femenino.',
        intro: {
          explanation:
            'Muchas profesiones cambian en femenino: -eur pasa a -euse (serveur, serveuse; vendeur, vendeuse), -ier a -ière (infirmier, infirmière) y -er a -ère (boulanger, boulangère). En el femenino la r final suena: boulangère, infirmière; en boulanger e infirmier, no. Médecin no cambia.',
          examples: [
            {
              target: 'Il est serveur et elle est serveuse.',
              base: 'Él es mesero y ella es mesera.',
            },
            { target: 'Mon père est boulanger.', base: 'Mi papá es panadero.' },
          ],
        },
        takeaways: [
          'Formas el femenino: serveuse, vendeuse, infirmière, boulangère.',
          'Oyes la r final en el femenino: boulangère.',
        ],
        exercises: [
          ex.translationChoice(
            'le serveur',
            'el mesero',
            ['el vendedor', 'el panadero', 'el enfermero'],
            ['fr-le-serveur'],
            {
              id: 'fr.ex.hcudcdwk0634gx',
            },
          ),
          ex.matchPairs(
            [
              ['le serveur', 'el mesero'],
              ['le vendeur', 'el vendedor'],
              ["l'infirmier", 'el enfermero'],
              ['le boulanger', 'el panadero'],
            ],
            ['fr-le-serveur', 'fr-le-vendeur', 'fr-l-infirmier', 'fr-le-boulanger'],
            { id: 'fr.ex.cevu2bs71rhb0d' },
          ),
          ex.fillBlank(
            'Ma mère est ___ dans un magasin.',
            'Mi mamá es vendedora en una tienda.',
            'vendeuse',
            ['vendeur', 'vendeure', 'serveuse'],
            ['fr-le-vendeur'],
            {
              id: 'fr.ex.vn811fnwh1va4h',
              explanation: 'Vendeur pasa a vendeuse en femenino (-eur → -euse).',
            },
          ),
          ex.fillBlank(
            'Claire est ___.',
            'Claire es enfermera.',
            'infirmière',
            ['infirmier', 'infirmières'],
            ['fr-l-infirmier'],
            {
              id: 'fr.ex.8mp1qlrp21ec43',
              explanation: 'Claire es una mujer, en singular: infirmière (-ier → -ière).',
            },
          ),
          ex.listenChoice(
            'Elle est boulangère.',
            ['Il est boulanger.', 'Elle est vendeuse.', 'Elle est serveuse.'],
            ['fr-le-boulanger'],
            {
              id: 'fr.ex.zxpcax84fwljgq',
              explanation: 'En boulangère la r final suena; en boulanger, no.',
            },
          ),
          ex.translationChoice(
            'le vendeur',
            'el vendedor',
            ['el mesero', 'el panadero', 'el médico'],
            ['fr-le-vendeur'],
            {
              id: 'fr.ex.vdci5xvstkmleh',
            },
          ),
          ex.fillBlank(
            'Il est serveur et elle est ___.',
            'Él es mesero y ella es mesera.',
            'serveuse',
            ['serveur', 'serveure', 'vendeur'],
            ['fr-le-serveur'],
            { id: 'fr.ex.b0ov8v4wcskpqp', explanation: 'Serveur pasa a serveuse en femenino.' },
          ),
          ex.orderWords('Mon père est boulanger.', 'Mi papá es panadero.', ['fr-le-boulanger'], {
            id: 'fr.ex.8cw3q37nnc1foz',
          }),
          ex.translateWrite(
            'Mi hermana es vendedora.',
            'Ma sœur est vendeuse.',
            ['fr-le-vendeur'],
            {
              id: 'fr.ex.2q94u3cv6xjb8l',
            },
          ),
          ex.shortAnswer(
            'Ta mère est infirmière?',
            '¿Tu mamá es enfermera? (Responde que sí, que es enfermera.)',
            'Oui, elle est infirmière.',
            ['Oui, ma mère est infirmière.', 'Oui, elle est infirmière!'],
            ['fr-l-infirmier'],
            { id: 'fr.ex.gieipeowwur8zn' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "Au bureau, à l'hôpital",
        objective: 'Decir dónde trabaja alguien.',
        intro: {
          explanation:
            "Para el lugar de trabajo: à l'hôpital, à l'école, au bureau (à + le = au) o dans une entreprise. Falso amigo: le bureau es la oficina (y también el escritorio). Delante de h muda hay elisión: l'hôpital. Le travail es el trabajo; je travaille, trabajo.",
          examples: [
            { target: 'Je travaille au bureau.', base: 'Trabajo en la oficina.' },
            { target: "Il est infirmier à l'hôpital.", base: 'Es enfermero en el hospital.' },
          ],
        },
        takeaways: [
          "Dices dónde trabajas: au bureau, à l'hôpital, dans une entreprise.",
          'Recuerdas que le bureau es la oficina.',
        ],
        exercises: [
          ex.translationChoice(
            'le bureau',
            'la oficina',
            ['la escuela', 'el hospital', 'la empresa'],
            ['fr-le-bureau'],
            {
              id: 'fr.ex.6p1xsrfleidjaf',
              explanation: 'Falso amigo: le bureau es la oficina (o el escritorio).',
            },
          ),
          ex.matchPairs(
            [
              ['le travail', 'el trabajo'],
              ["l'hôpital", 'el hospital'],
              ["l'école", 'la escuela'],
              ["l'entreprise", 'la empresa'],
            ],
            ['fr-le-travail', 'fr-l-hopital', 'fr-l-ecole', 'fr-l-entreprise'],
            { id: 'fr.ex.aosn890meyswjb' },
          ),
          ex.fillBlank(
            'Je travaille ___ bureau.',
            'Trabajo en la oficina.',
            'au',
            ['à la', "à l'", 'du'],
            ['fr-le-bureau'],
            {
              id: 'fr.ex.tgi51qtqzc79q0',
              explanation: 'Le bureau es masculino: à + le = au bureau.',
            },
          ),
          ex.fillBlank(
            "L'infirmier travaille à ___.",
            'El enfermero trabaja en el hospital.',
            "l'hôpital",
            ["l'école", 'la banque', 'la gare'],
            ['fr-l-hopital', 'fr-l-infirmier'],
            { id: 'fr.ex.11wtxpat8x76r6', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Je travaille dans une entreprise.',
            [
              'Je travaille dans une école.',
              'Je travaille dans un bureau.',
              'Il travaille dans une entreprise.',
            ],
            ['fr-l-entreprise'],
            { id: 'fr.ex.f2c062o4ey4mg5' },
          ),
          question(
            'fr.ex.o8pnv8m787sov4',
            SOIREE,
            '¿A qué se dedica Karim?',
            'Es enfermero en un hospital.',
            ['Es médico en un hospital.', 'Es ingeniero en Lyon.', 'Es profesor en una escuela.'],
            ['fr-l-infirmier', 'fr-l-hopital', 'fr-qu-est-ce-que-tu-fais-dans-la-vie'],
            "Karim responde «Je suis infirmier. Je travaille à l'hôpital».",
          ),
          question(
            'fr.ex.0tu635wx8rvqzs',
            SOIREE,
            '¿Dónde trabaja Sarah?',
            'En una empresa en Lyon.',
            ['En el hospital, con Karim.', 'En una escuela de Lyon.', 'En una estación de tren.'],
            ['fr-l-entreprise', 'fr-l-ingenieur'],
            'Sarah dice «Je suis ingénieure. Je travaille dans une entreprise à Lyon».',
          ),
          ex.translationChoice(
            'le travail',
            'el trabajo',
            ['la profesión', 'la empresa', 'la oficina'],
            ['fr-le-travail'],
            {
              id: 'fr.ex.p1hh3r0g9jzyg6',
            },
          ),
          ex.translateWrite(
            'Los chicos van a la escuela.',
            "Les enfants vont à l'école.",
            ['fr-l-ecole'],
            {
              id: 'fr.ex.wcm0rqsapi3ykc',
            },
          ),
          ex.shortAnswer(
            'Tu travailles où?',
            '¿Dónde trabajas? (Responde que trabajas en una empresa.)',
            'Je travaille dans une entreprise.',
            ['Dans une entreprise.', 'Je travaille dans une grande entreprise.'],
            ['fr-l-entreprise'],
            { id: 'fr.ex.xq1k9koqws944a' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Nous sommes, ils ont',
        objective: 'Usar être y avoir en plural.',
        intro: {
          explanation:
            "Être: je suis, tu es, il est, nous sommes, vous êtes, ils sont. Avoir: j'ai, tu as, il a, nous avons, vous avez, ils ont. Con elles es igual: elles sont, elles ont. Ojo con la liaison: en ils ont y en nous avons, la s se une a la vocal con un sonido z; en ils sont se oye una s. La profesión sigue sin artículo en plural: ils sont serveurs.",
          examples: [
            { target: 'Nous sommes étudiants.', base: 'Somos estudiantes.' },
            { target: 'Ils ont deux enfants.', base: 'Tienen dos hijos.' },
          ],
        },
        takeaways: [
          'Conjugas être y avoir con nous, ils y elles.',
          'Distingues ils ont (sonido z) de ils sont (sonido s).',
        ],
        exercises: [
          ex.translationChoice(
            'nous sommes',
            'somos',
            ['tenemos', 'ellos son', 'vamos'],
            ['fr-nous-sommes'],
            {
              id: 'fr.ex.dredzw2fh6j6ml',
            },
          ),
          ex.matchPairs(
            [
              ['nous sommes', 'somos'],
              ['ils sont', 'ellos son'],
              ['nous avons', 'tenemos'],
              ['ils ont', 'ellos tienen'],
            ],
            ['fr-nous-sommes', 'fr-ils-sont', 'fr-nous-avons', 'fr-ils-ont'],
            { id: 'fr.ex.juwdiu7iqypean' },
          ),
          ex.listenChoice(
            'Ils ont deux enfants.',
            ['Ils sont deux enfants.', 'Il a deux enfants.', 'Elles ont deux enfants.'],
            ['fr-ils-ont', 'fr-ils-sont'],
            {
              id: 'fr.ex.l6ta3kbvx408r9',
              explanation: 'En ils ont, la liaison suena como una z; en ils sont, se oye una s.',
            },
          ),
          ex.fillBlank(
            'Nous ___ étudiants.',
            'Somos estudiantes.',
            'sommes',
            ['avons', 'sont', 'êtes'],
            ['fr-nous-sommes'],
            {
              id: 'fr.ex.slgkv1pdfl3uhl',
              explanation: 'Con nous: nous sommes. Vous êtes y ils sont son otras personas.',
            },
          ),
          ex.fillBlank(
            'Ils ___ un chien et un chat.',
            'Tienen un perro y un gato.',
            'ont',
            ['sont', 'avons', 'a'],
            ['fr-ils-ont'],
            {
              id: 'fr.ex.rbt8aaa8qmmrnk',
              explanation: 'Tener es avoir: ils ont. Ils sont es «son».',
            },
          ),
          ex.fillBlank(
            'Mes parents ___ médecins.',
            'Mis padres son médicos.',
            'sont',
            ['ont', 'sommes', 'est'],
            ['fr-ils-sont', 'fr-le-medecin'],
            {
              id: 'fr.ex.j323mg510x8ax5',
              explanation:
                'Mes parents = ils: ils sont. La profesión va sin artículo también en plural.',
            },
          ),
          question(
            'fr.ex.lweo785d11gxua',
            SOIREE,
            '¿A Sarah le gusta su trabajo?',
            'Sí, mucho.',
            ['No, para nada.', 'Prefiere trabajar en el hospital.', 'No lo dice.'],
            ['fr-le-travail', 'fr-le-bureau'],
            'Karim pregunta «Tu aimes ton travail?» y Sarah responde «Oui, beaucoup!».',
          ),
          ex.orderWords(
            "Elles sont infirmières à l'hôpital.",
            'Ellas son enfermeras en el hospital.',
            ['fr-ils-sont', 'fr-l-infirmier'],
            { id: 'fr.ex.cozx4pvsctserr' },
          ),
          ex.translateWrite('Tenemos dos hijos.', 'Nous avons deux enfants.', ['fr-nous-avons'], {
            id: 'fr.ex.cv29phw3mx6eva',
            acceptedAnswers: ['Nous avons deux fils.', 'On a deux enfants.'],
          }),
          ex.translateWrite(
            'Somos profesores.',
            'Nous sommes professeurs.',
            ['fr-nous-sommes', 'fr-le-professeur'],
            {
              id: 'fr.ex.479mh31rrd4nxs',
              acceptedAnswers: ['Nous sommes professeures.', 'On est professeurs.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Je commence, je finis',
        objective: 'Decir a qué hora empiezas y terminas de trabajar.',
        intro: {
          explanation:
            'Je commence es un verbo en -er, como je parle. Je finis es un verbo en -ir: je finis, tu finis, il finit; las tres formas suenan igual. Con la hora: je commence à neuf heures, je finis à cinq heures. En Francia, la jornada legal es de 35 horas por semana.',
          examples: [
            { target: 'Je commence à neuf heures.', base: 'Empiezo a las nueve.' },
            { target: 'Il finit à six heures.', base: 'Él termina a las seis.' },
          ],
        },
        takeaways: [
          'Dices a qué hora empiezas con je commence à…',
          'Conjugas je finis, tu finis, il finit.',
        ],
        exercises: [
          ex.translationChoice(
            'je finis',
            'termino',
            ['empiezo', 'trabajo', 'tengo'],
            ['fr-je-finis'],
            {
              id: 'fr.ex.ibsmifant9y1xz',
            },
          ),
          ex.translationChoice(
            'je commence',
            'empiezo',
            ['termino', 'me levanto', 'busco'],
            ['fr-je-commence'],
            {
              id: 'fr.ex.t7ucr7aalq6gyy',
            },
          ),
          ex.fillBlank(
            'Je ___ le travail à neuf heures.',
            'Empiezo el trabajo a las nueve.',
            'commence',
            ['commences', 'finit'],
            ['fr-je-commence'],
            { id: 'fr.ex.hlzt2r0rljw6p6', explanation: 'Con je: je commence, sin s.' },
          ),
          ex.fillBlank(
            'Il ___ à six heures.',
            'Él termina a las seis.',
            'finit',
            ['finis', 'commences'],
            ['fr-je-finis'],
            {
              id: 'fr.ex.lylkhki05xux9q',
              explanation:
                'Con il: il finit, con t. Je finis y tu finis llevan s. Las tres suenan igual.',
            },
          ),
          ex.listenChoice(
            'Je finis à cinq heures.',
            [
              'Je finis à cinq heures et demie.',
              'Je commence à cinq heures.',
              'Je finis à quinze heures.',
            ],
            ['fr-je-finis'],
            { id: 'fr.ex.a5odueym9lzr5h' },
          ),
          question(
            'fr.ex.6dhrqthto7z01r',
            FAMILLE,
            '¿A qué hora empieza a trabajar el papá?',
            'A las cuatro de la mañana.',
            ['A las cuatro de la tarde.', 'A las siete.', 'A las nueve de la mañana.'],
            ['fr-le-boulanger', 'fr-je-commence'],
            'El texto dice «il commence à quatre heures du matin».',
          ),
          question(
            'fr.ex.0dhh12yplrkq24',
            FAMILLE,
            '¿Dónde trabaja la mamá?',
            'En una escuela.',
            ['En un hospital.', 'En una tienda.', 'En una panadería.'],
            ['fr-le-professeur', 'fr-l-ecole'],
            'El texto dice «Ma mère est professeure dans une école».',
          ),
          question(
            'fr.ex.8f9baf6wrzfxlz',
            FAMILLE,
            '¿Qué hace la chica que escribe?',
            'Es vendedora en una tienda.',
            ['Es profesora.', 'Es panadera.', 'Es mesera.'],
            ['fr-le-vendeur', 'fr-je-finis'],
            'Escribe «Moi, je suis vendeuse dans un magasin».',
          ),
          ex.translateWrite(
            'Empiezo a las ocho y termino a las cinco.',
            'Je commence à huit heures et je finis à cinq heures.',
            ['fr-je-commence', 'fr-je-finis'],
            {
              id: 'fr.ex.cmv1vye9zgr5y3',
              acceptedAnswers: ['Je commence à huit heures, je finis à cinq heures.'],
            },
          ),
          ex.shortAnswer(
            'Tu commences à quelle heure?',
            '¿A qué hora empiezas? (Responde que empiezas a las nueve.)',
            'Je commence à neuf heures.',
            ['À neuf heures.', 'Je commence le travail à neuf heures.'],
            ['fr-je-commence'],
            { id: 'fr.ex.bf24unry9thh7g' },
          ),
        ],
      },
    ],
  },
};

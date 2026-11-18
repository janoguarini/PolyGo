import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U8 «Mi día» (docs/FR_A1_A2.md): contar la rutina con los momentos del día, los verbos
 * en -er en presente (je travaille… ils travaillent), nous / ils / on, los verbos pronominales
 * (je me lève, je me couche), d'abord / ensuite y la frecuencia (toujours, souvent, tous les jours).
 * Pronunciación: -e, -es y -ent finales no suenan (travaille, travailles, travaillent suenan igual);
 * liaison nous‿écoutons, ils‿écoutent con sonido z. Falso amigo: le déjeuner es el almuerzo.
 * Cultura: en Francia se almuerza cerca del mediodía y se cena alrededor de las ocho.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SOEUR = dialogue(
  'fr.stim.a1-u8-famille',
  'Julie y Marc hablan de lo que hace cada uno durante el día.',
  [
    ['Julie', 'Marc, tu travailles le matin?'],
    ['Marc', "Oui, je travaille le matin. L'après-midi, j'écoute de la musique."],
    ['Julie', 'Et ta sœur?'],
    ['Marc', 'Ma sœur et mon frère travaillent le soir. Le matin, ils regardent la télé.'],
    ['Julie', 'Nous, on regarde la télé le soir.'],
  ],
  FR_A1_RATE,
);

const BLOG = reading(
  'fr.stim.a1-u8-journee',
  'description',
  'Camille cuenta su día en un blog.',
  [
    "D'abord, je me lève et je bois un café.",
    'Au petit-déjeuner, je mange un croissant.',
    'Ensuite, je travaille.',
    'Au déjeuner, je mange du poisson.',
    'Le soir, je regarde la télé.',
  ],
  { title: 'Ma journée', from: 'Camille' },
);

const RYTHME = dialogue(
  'fr.stim.a1-u8-rythme',
  'Léa y Nicolas comparan sus costumbres.',
  [
    ['Léa', 'Nicolas, tu travailles tous les jours?'],
    ['Nicolas', 'Oui, et le soir, je travaille souvent.'],
    ['Léa', 'Tu regardes la télé?'],
    ['Nicolas', "Non, j'écoute toujours la radio. Et toi?"],
    ['Léa', 'Je regarde souvent la télé le soir.'],
  ],
  FR_A1_RATE,
);

export const FR_A1_U08: FrUnitDef = {
  names: ['Julie', 'Marc', 'Camille', 'Nicolas', 'Léa', 'Lyon', 'Paris', 'Hugo', 'Claire'],
  support: [
    'tard',
    'journée',
    'télé',
    'radio',
    'musique',
    'se',
    'travaillons',
    'travaillez',
    'travaillent',
    'écoutons',
    'écoutez',
    'écoutent',
    'regardons',
    'regardent',
  ],
  unit: {
    position: 8,
    title: 'Mi día',
    titleEn: 'Ma journée',
    description:
      "Rutina y momentos del día; verbos en -er en presente, nous / ils / on; je me lève, je me couche; d'abord, ensuite; toujours, souvent. -e, -es, -ent mudas y liaison ils‿écoutent.",
    emoji: '⏰',
    objective:
      'Podés contar tu rutina: a qué momento del día hacés cada cosa, en qué orden y con qué frecuencia, y lo que hacen otras personas.',
    grammar: {
      title: 'Verbos en -er en presente',
      explanation:
        'Los verbos en -er (travailler, regarder, écouter) cambian la terminación: je travaille, tu travailles, il / elle / on travaille, nous travaillons, vous travaillez, ils / elles travaillent. Las terminaciones -e, -es y -ent no se pronuncian: travaille, travailles y travaillent suenan igual; sólo nous (-ons) y vous (-ez) suenan distinto. On (nosotros, informal) va con el verbo como il: on travaille. Delante de vocal hay liaison con sonido z: nous‿écoutons, ils‿écoutent. Los pronominales llevan me / te / se: je me lève, tu te lèves, il se lève.',
      examples: [
        { target: 'Je travaille le matin.', base: 'Trabajo a la mañana.' },
        { target: 'Nous travaillons à Lyon.', base: 'Trabajamos en Lyon.' },
        { target: 'Ils écoutent la radio le soir.', base: 'Ellos escuchan la radio a la noche.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U8). Sin revisión nativa: revisar «on» traducido como «nosotros, informal», el uso de la télé (registro coloquial pero estándar) y el orden de los adverbios de frecuencia (je bois toujours un café).',
    },
    words: [
      w(
        'fr-le-matin',
        'le matin',
        'la mañana',
        'Le matin, je bois un café.',
        'A la mañana tomo un café.',
        ['time', 'm'],
        { emoji: '🌅' },
      ),
      w(
        'fr-l-apres-midi',
        "l'après-midi",
        'la tarde',
        "L'après-midi, je travaille.",
        'A la tarde trabajo.',
        ['time'],
        { acceptedTexts: ["l'après-midi"] },
      ),
      w(
        'fr-le-soir',
        'le soir',
        'la noche',
        'Le soir, je regarde la télé.',
        'A la noche miro la tele.',
        ['time', 'm'],
        { emoji: '🌙' },
      ),
      w(
        'fr-je-me-leve',
        'je me lève',
        'me levanto',
        "D'abord, je me lève. Ensuite, je bois un café.",
        'Primero me levanto. Después tomo un café.',
        ['routine', 'verbs'],
      ),
      w(
        'fr-je-me-couche',
        'je me couche',
        'me acuesto',
        'Le soir, je me couche tard.',
        'A la noche me acuesto tarde.',
        ['routine', 'verbs'],
      ),
      w(
        'fr-je-travaille',
        'je travaille',
        'trabajo',
        'Je travaille à Lyon.',
        'Trabajo en Lyon.',
        ['verbs', 'work'],
        { acceptedTranslations: ['yo trabajo'] },
      ),
      w(
        'fr-je-regarde',
        'je regarde',
        'miro',
        'Le soir, je regarde la télé.',
        'A la noche miro la tele.',
        ['verbs'],
        { acceptedTranslations: ['yo miro'] },
      ),
      w(
        'fr-j-ecoute',
        "j'écoute",
        'escucho',
        "J'écoute la radio le matin.",
        'Escucho la radio a la mañana.',
        ['verbs'],
        { acceptedTranslations: ['yo escucho'], acceptedTexts: ["j'écoute"] },
      ),
      w(
        'fr-nous',
        'nous',
        'nosotros',
        'Nous travaillons à Paris.',
        'Trabajamos en París.',
        ['pronouns'],
        { acceptedTranslations: ['nosotras'] },
      ),
      w(
        'fr-ils',
        'ils',
        'ellos',
        'Ils écoutent la radio le soir.',
        'Ellos escuchan la radio a la noche.',
        ['pronouns'],
      ),
      w(
        'fr-on',
        'on',
        'nosotros, informal',
        'Le soir, on regarde la télé.',
        'A la noche miramos la tele.',
        ['pronouns'],
        { acceptedTranslations: ['se', 'uno'] },
      ),
      w(
        'fr-d-abord',
        "d'abord",
        'primero',
        "D'abord, je me lève.",
        'Primero me levanto.',
        ['sequence'],
        { acceptedTexts: ["d'abord"] },
      ),
      w(
        'fr-ensuite',
        'ensuite',
        'después',
        'Je mange, ensuite je travaille.',
        'Como y después trabajo.',
        ['sequence'],
        { acceptedTranslations: ['luego'] },
      ),
      w(
        'fr-tous-les-jours',
        'tous les jours',
        'todos los días',
        'Je travaille tous les jours.',
        'Trabajo todos los días.',
        ['frequency'],
      ),
      w(
        'fr-le-petit-dejeuner',
        'le petit-déjeuner',
        'el desayuno',
        'Au petit-déjeuner, je mange un croissant.',
        'En el desayuno como una medialuna.',
        ['food', 'm'],
        { emoji: '🥐' },
      ),
      w(
        'fr-le-dejeuner',
        'le déjeuner',
        'el almuerzo',
        'Au déjeuner, je mange de la viande.',
        'En el almuerzo como carne.',
        ['food', 'm'],
      ),
      w(
        'fr-le-diner',
        'le dîner',
        'la cena',
        "Au dîner, je bois de l'eau.",
        'En la cena tomo agua.',
        ['food', 'm'],
      ),
      w(
        'fr-souvent',
        'souvent',
        'seguido',
        'Je regarde souvent la télé.',
        'Miro la tele seguido.',
        ['frequency'],
        { acceptedTranslations: ['a menudo', 'frecuentemente'] },
      ),
      w(
        'fr-toujours',
        'toujours',
        'siempre',
        'Le matin, je bois toujours un café.',
        'A la mañana siempre tomo un café.',
        ['frequency'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Le matin, le soir',
        objective: 'Decir en qué momento del día te levantás y te acostás.',
        intro: {
          explanation:
            "Le matin es la mañana; l'après-midi, la tarde; le soir, la noche. Para decir «a la mañana» no hace falta preposición: le matin, je me lève. Se lever y se coucher son pronominales, como s'appeler: je me lève, tu te lèves, il / elle se lève. La s de tu te lèves no suena: lève y lèves se pronuncian igual.",
          examples: [
            { target: 'Le matin, je me lève.', base: 'A la mañana me levanto.' },
            { target: 'Le soir, je me couche tard.', base: 'A la noche me acuesto tarde.' },
          ],
        },
        takeaways: [
          "Nombrás los momentos del día: le matin, l'après-midi, le soir.",
          "Decís je me lève y je me couche, con me como en je m'appelle.",
        ],
        exercises: [
          ex.translationChoice(
            'le matin',
            'la mañana',
            ['la tarde', 'la noche', 'me levanto'],
            ['fr-le-matin'],
            { id: 'fr.ex.ufcpyirx4rrup0' },
          ),
          ex.matchPairs(
            [
              ['le matin', 'la mañana'],
              ["l'après-midi", 'la tarde'],
              ['le soir', 'la noche'],
              ['je me lève', 'me levanto'],
            ],
            ['fr-le-matin', 'fr-l-apres-midi', 'fr-le-soir', 'fr-je-me-leve'],
            { id: 'fr.ex.gmdx6rf4eswban' },
          ),
          ex.listenChoice(
            'Le soir, je me couche.',
            ['Le matin, je me lève.', 'Le soir, je me lève.', "L'après-midi, je me couche."],
            ['fr-le-soir', 'fr-je-me-couche'],
            { id: 'fr.ex.kp9oe15h1v23ch' },
          ),
          ex.fillBlank(
            'Le soir, je me ___ tard.',
            'A la noche me acuesto tarde.',
            'couche',
            ['lève', 'couches', 'appelle'],
            ['fr-je-me-couche'],
            {
              id: 'fr.ex.tc64md5rey6yvb',
              explanation:
                'Me acuesto es je me couche. Con je, la terminación es -e; couches es para tu.',
            },
          ),
          ex.fillBlank(
            'Le matin, je ___ lève.',
            'A la mañana me levanto.',
            'me',
            ['te', 'se', 'ma'],
            ['fr-je-me-leve', 'fr-le-matin'],
            {
              id: 'fr.ex.mfd8uuramv1xyg',
              explanation: 'Con je va me: je me lève. Te es para tu y se, para il o elle.',
            },
          ),
          ex.translationChoice(
            "l'après-midi",
            'la tarde',
            ['la mañana', 'la noche', 'me acuesto'],
            ['fr-l-apres-midi'],
            { id: 'fr.ex.ahdfjunlheb7bw' },
          ),
          ex.listenChoice(
            'Tu te lèves le matin?',
            ['Tu te couches le matin?', 'Je me lève le matin.', 'Tu te lèves le soir?'],
            ['fr-je-me-leve', 'fr-le-matin'],
            {
              id: 'fr.ex.hbh93olb35x2ac',
              explanation: 'La s final de lèves no suena: lo que cambia es el pronombre tu te.',
            },
          ),
          ex.orderWords(
            'Je me couche tard le soir.',
            'A la noche me acuesto tarde.',
            ['fr-je-me-couche', 'fr-le-soir'],
            { id: 'fr.ex.tbg3axm939xh0y' },
          ),
          ex.translateWrite(
            'A la mañana me levanto.',
            'Le matin, je me lève.',
            ['fr-le-matin', 'fr-je-me-leve'],
            { id: 'fr.ex.lef0s7lo3kdibf', acceptedAnswers: ['Je me lève le matin.'] },
          ),
          ex.shortAnswer(
            'Tu te couches tard le soir?',
            '¿Te acostás tarde a la noche? (Respondé que sí.)',
            'Oui, je me couche tard.',
            ['Oui, je me couche tard le soir.', 'Oui, le soir, je me couche tard.'],
            ['fr-je-me-couche', 'fr-le-soir'],
            { id: 'fr.ex.8pmwgappvey86g' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Je travaille, je regarde',
        objective: 'Contar qué hacés con verbos en -er (je, tu, il, elle).',
        intro: {
          explanation:
            "Travailler, regarder y écouter son verbos en -er. En singular: je travaille, tu travailles, il / elle travaille. Las tres formas suenan igual, porque la -e y la -es finales no se pronuncian. Delante de vocal, je se vuelve j': j'écoute. Regarder es mirar (la télé, un livre).",
          examples: [
            { target: "J'écoute la radio le matin.", base: 'Escucho la radio a la mañana.' },
            { target: 'Elle regarde la télé.', base: 'Ella mira la tele.' },
          ],
        },
        takeaways: [
          'Conjugás un verbo en -er con je, tu, il y elle.',
          "Sabés que travaille y travailles suenan igual y que je se vuelve j' delante de vocal.",
        ],
        exercises: [
          ex.translationChoice(
            'je travaille',
            'trabajo',
            ['miro', 'escucho', 'me acuesto'],
            ['fr-je-travaille'],
            { id: 'fr.ex.2ewx3clyr2l5n2' },
          ),
          ex.matchPairs(
            [
              ['je travaille', 'trabajo'],
              ['je regarde', 'miro'],
              ["j'écoute", 'escucho'],
              ['je me couche', 'me acuesto'],
            ],
            ['fr-je-travaille', 'fr-je-regarde', 'fr-j-ecoute', 'fr-je-me-couche'],
            { id: 'fr.ex.idlbgc3rrqayzo' },
          ),
          ex.fillBlank(
            'Tu ___ la radio?',
            '¿Escuchás la radio?',
            'écoutes',
            ['écoute', 'regardes', 'travailles'],
            ['fr-j-ecoute'],
            {
              id: 'fr.ex.n49vr30vcev38h',
              explanation: 'Con tu, el verbo termina en -es (que no suena): tu écoutes.',
            },
          ),
          ex.listenChoice(
            'Elle travaille à Paris.',
            ['Elle habite à Paris.', 'Je travaille à Paris.', 'Elle travaille à Lyon.'],
            ['fr-je-travaille'],
            { id: 'fr.ex.376ml8tezllhkk' },
          ),
          ex.fillBlank(
            'Le soir, je ___ la télé.',
            'A la noche miro la tele.',
            'regarde',
            ['écoute', 'travaille', 'mange'],
            ['fr-je-regarde', 'fr-le-soir'],
            {
              id: 'fr.ex.3z0smzfwjg7u8y',
              skill: 'vocabulary',
              explanation: 'Mirar es regarder: je regarde la télé.',
            },
          ),
          ex.translationChoice(
            "j'écoute",
            'escucho',
            ['miro', 'trabajo', 'hablo'],
            ['fr-j-ecoute'],
            {
              id: 'fr.ex.xus1yz6q6alvig',
              explanation: "Je se vuelve j' delante de vocal: j'écoute.",
            },
          ),
          ex.fillBlank(
            'Il ___ à Lyon.',
            'Él trabaja en Lyon.',
            'travaille',
            ['travailles', 'regarde', 'habites'],
            ['fr-je-travaille'],
            {
              id: 'fr.ex.0e2juz5yttetrz',
              explanation: 'Con il o elle, igual que con je: il travaille. La -es es de tu.',
            },
          ),
          ex.orderWords(
            "J'écoute la radio le matin.",
            'Escucho la radio a la mañana.',
            ['fr-j-ecoute', 'fr-le-matin'],
            { id: 'fr.ex.bduyqtcgihyokd' },
          ),
          ex.translateWrite(
            'Trabajo a la tarde.',
            "Je travaille l'après-midi.",
            ['fr-je-travaille', 'fr-l-apres-midi'],
            { id: 'fr.ex.vd6tsl1s3e5qbw', acceptedAnswers: ["L'après-midi, je travaille."] },
          ),
          ex.shortAnswer(
            'Tu écoutes la radio le matin?',
            '¿Escuchás la radio a la mañana? (Respondé que sí.)',
            "Oui, j'écoute la radio le matin.",
            ["Oui, j'écoute la radio.", "Oui, le matin, j'écoute la radio."],
            ['fr-j-ecoute', 'fr-le-matin'],
            { id: 'fr.ex.eujnpd22p8mg8a' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Nous, ils, on',
        objective: 'Contar qué hacen otras personas con nous, vous, ils y on.',
        intro: {
          explanation:
            'En plural: nous travaillons, vous travaillez, ils / elles travaillent. La -ent de ils travaillent no suena: se pronuncia igual que il travaille. On es muy común en lo oral y significa nosotros; va con el verbo como il: on regarde. Delante de vocal hay liaison con sonido z: nous‿écoutons, ils‿écoutent. Así se distingue ils écoutent de il écoute.',
          examples: [
            { target: 'Nous travaillons le matin.', base: 'Trabajamos a la mañana.' },
            { target: 'Ils écoutent la radio.', base: 'Ellos escuchan la radio.' },
          ],
        },
        takeaways: [
          'Conjugás con nous (-ons), vous (-ez) e ils (-ent, que no suena).',
          'Usás on como nosotros, con el verbo como il.',
        ],
        exercises: [
          ex.translationChoice(
            'nous',
            'nosotros',
            ['ellos', 'nosotros, informal', 'usted'],
            ['fr-nous'],
            { id: 'fr.ex.leudpxvqqq011p' },
          ),
          ex.fillBlank(
            'Nous ___ à Paris.',
            'Trabajamos en París.',
            'travaillons',
            ['travaillez', 'travaillent', 'travaille'],
            ['fr-nous', 'fr-je-travaille'],
            {
              id: 'fr.ex.ani5fffl7zyjp5',
              explanation: 'Con nous, la terminación es -ons: nous travaillons.',
            },
          ),
          ex.fillBlank(
            'Ils ___ la télé le soir.',
            'Ellos miran la tele a la noche.',
            'regardent',
            ['regardons', 'regardes', 'regarde'],
            ['fr-ils', 'fr-je-regarde'],
            {
              id: 'fr.ex.e71ic7rpefl1gi',
              explanation: 'Con ils, la terminación es -ent, aunque no suena: ils regardent.',
            },
          ),
          ex.listenChoice(
            'Ils écoutent la radio.',
            ['Il écoute la radio.', 'Nous écoutons la radio.', 'Vous écoutez la radio.'],
            ['fr-ils', 'fr-j-ecoute'],
            {
              id: 'fr.ex.oty7vwf7d48psi',
              explanation:
                'En ils écoutent la s se une a la vocal con sonido z (liaison); en il écoute no hay z.',
            },
          ),
          ex.matchPairs(
            [
              ['nous', 'nosotros'],
              ['ils', 'ellos'],
              ['on', 'nosotros, informal'],
              ["j'écoute", 'escucho'],
            ],
            ['fr-nous', 'fr-ils', 'fr-on', 'fr-j-ecoute'],
            { id: 'fr.ex.otugzo9o3vbse6' },
          ),
          ex.fillBlank(
            'Le soir, ___ regarde la télé.',
            'A la noche miramos la tele.',
            'on',
            ['nous', 'ils', 'vous'],
            ['fr-on'],
            {
              id: 'fr.ex.e6m0dq7xtovgdk',
              explanation:
                'Regarde va con on (como con il). Con nous sería nous regardons; con ils, ils regardent.',
            },
          ),
          question(
            'fr.ex.efna1p6vtoi5em',
            SOEUR,
            '¿Cuándo trabaja Marc?',
            'A la mañana.',
            ['A la tarde.', 'A la noche.', 'No trabaja.'],
            ['fr-je-travaille', 'fr-le-matin'],
            'Marc responde «Oui, je travaille le matin».',
          ),
          question(
            'fr.ex.x6g40f2aa4bar0',
            SOEUR,
            '¿Qué hacen los hermanos de Marc a la mañana?',
            'Miran la tele.',
            ['Trabajan.', 'Escuchan música.', 'Se acuestan.'],
            ['fr-ils', 'fr-je-regarde'],
            'Marc dice «Le matin, ils regardent la télé»; trabajan a la noche.',
          ),
          ex.translateWrite(
            'Trabajamos a la mañana.',
            'Nous travaillons le matin.',
            ['fr-nous', 'fr-je-travaille', 'fr-le-matin'],
            {
              id: 'fr.ex.dq1kgvpr5g1q8u',
              acceptedAnswers: [
                'On travaille le matin.',
                'Le matin, nous travaillons.',
                'Le matin, on travaille.',
              ],
            },
          ),
          ex.shortAnswer(
            'Vous travaillez le soir?',
            '¿Ustedes trabajan a la noche? (Respondé que no, que trabajan a la tarde.)',
            "Non, nous travaillons l'après-midi.",
            ["Non, on travaille l'après-midi.", "Non, l'après-midi."],
            ['fr-nous', 'fr-l-apres-midi'],
            { id: 'fr.ex.uztvuopsrh443t' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "D'abord, ensuite",
        objective: 'Nombrar las comidas del día y contar las cosas en orden.',
        intro: {
          explanation:
            "Ojo con el falso amigo: le petit-déjeuner es el desayuno, le déjeuner es el almuerzo (en Francia, cerca del mediodía) y le dîner es la cena (alrededor de las ocho). «En el desayuno» se dice au petit-déjeuner (à + le = au). Para ordenar: d'abord (primero), ensuite (después). Desayunar se puede decir je prends le petit-déjeuner.",
          examples: [
            {
              target: "D'abord, je me lève. Ensuite, je prends le petit-déjeuner.",
              base: 'Primero me levanto. Después desayuno.',
            },
            { target: 'Au déjeuner, je mange du poisson.', base: 'En el almuerzo como pescado.' },
          ],
        },
        takeaways: [
          'Distinguís le petit-déjeuner, le déjeuner (el almuerzo) y le dîner.',
          "Contás tu día en orden con d'abord y ensuite.",
        ],
        exercises: [
          ex.translationChoice(
            'le déjeuner',
            'el almuerzo',
            ['el desayuno', 'la cena', 'la mañana'],
            ['fr-le-dejeuner'],
            {
              id: 'fr.ex.qq220c7wykb4v8',
              explanation:
                'Falso amigo: le déjeuner es el almuerzo; el desayuno es le petit-déjeuner.',
            },
          ),
          ex.matchPairs(
            [
              ['le petit-déjeuner', 'el desayuno'],
              ['le déjeuner', 'el almuerzo'],
              ['le dîner', 'la cena'],
              ['ensuite', 'después'],
            ],
            ['fr-le-petit-dejeuner', 'fr-le-dejeuner', 'fr-le-diner', 'fr-ensuite'],
            { id: 'fr.ex.39l35evh95bznj' },
          ),
          ex.fillBlank(
            'Au ___, je mange un croissant et je bois un café.',
            'En el desayuno como una medialuna y tomo un café.',
            'petit-déjeuner',
            ['déjeuner', 'dîner', 'soir'],
            ['fr-le-petit-dejeuner'],
            {
              id: 'fr.ex.4va9x1jrws2y5v',
              skill: 'vocabulary',
              explanation: 'El desayuno es le petit-déjeuner; le déjeuner es el almuerzo.',
            },
          ),
          ex.listenChoice(
            "D'abord, je mange. Ensuite, je travaille.",
            [
              "D'abord, je travaille. Ensuite, je mange.",
              "D'abord, je mange. Ensuite, je regarde la télé.",
              'Je mange, je travaille.',
            ],
            ['fr-d-abord', 'fr-ensuite'],
            { id: 'fr.ex.o4g7kx8xlivigi' },
          ),
          ex.fillBlank(
            '___, je me lève. Ensuite, je bois un café.',
            'Primero me levanto. Después tomo un café.',
            "D'abord",
            ['Ensuite', 'Le soir', 'Au revoir'],
            ['fr-d-abord'],
            {
              id: 'fr.ex.jcxkqm32byxs2c',
              skill: 'vocabulary',
              explanation: "Primero es d'abord; ensuite es después.",
            },
          ),
          ex.orderWords(
            'Je mange du poisson au déjeuner.',
            'En el almuerzo como pescado.',
            ['fr-le-dejeuner'],
            { id: 'fr.ex.v28kv81z6bpxjv' },
          ),
          question(
            'fr.ex.8obmdcd8ggk0e1',
            BLOG,
            '¿Qué come Camille en el desayuno?',
            'Una medialuna.',
            ['Pescado.', 'Pan con queso.', 'Nada, sólo toma café.'],
            ['fr-le-petit-dejeuner'],
            'Escribe «Au petit-déjeuner, je mange un croissant».',
          ),
          question(
            'fr.ex.wcfnlbke2fdfuf',
            BLOG,
            '¿Qué hace Camille después del desayuno?',
            'Trabaja.',
            ['Se acuesta.', 'Mira la tele.', 'Almuerza pescado.'],
            ['fr-ensuite', 'fr-le-diner'],
            'Después del croissant escribe «Ensuite, je travaille»; la tele es a la noche.',
          ),
          ex.translateWrite(
            'Primero desayuno. Después trabajo.',
            "D'abord, je prends le petit-déjeuner. Ensuite, je travaille.",
            ['fr-d-abord', 'fr-le-petit-dejeuner', 'fr-ensuite'],
            {
              id: 'fr.ex.95wcy2wdmj1sv4',
              acceptedAnswers: [
                "D'abord je prends le petit-déjeuner, ensuite je travaille.",
                "D'abord, je prends le petit-déjeuner, ensuite je travaille.",
              ],
            },
          ),
          ex.shortAnswer(
            'Au dîner, tu bois du vin?',
            '¿En la cena tomás vino? (Respondé que no, que tomás agua.)',
            "Non, je bois de l'eau.",
            ["Non, au dîner, je bois de l'eau.", "Non, de l'eau."],
            ['fr-le-diner'],
            { id: 'fr.ex.79wqlsp7wxe29u' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Toujours, souvent',
        objective: 'Decir con qué frecuencia hacés las cosas.',
        intro: {
          explanation:
            'Toujours (siempre) y souvent (seguido) van después del verbo: je bois toujours un café, il regarde souvent la télé. Tous les jours (todos los días) suele ir al final. En tous les jours, la s de tous no suena; no confundas tous les jours con toujours.',
          examples: [
            {
              target: 'Je bois toujours un café le matin.',
              base: 'Siempre tomo un café a la mañana.',
            },
            { target: 'Nous travaillons tous les jours.', base: 'Trabajamos todos los días.' },
          ],
        },
        takeaways: [
          'Ponés toujours y souvent después del verbo.',
          'Distinguís toujours (siempre) de tous les jours (todos los días).',
        ],
        exercises: [
          ex.translationChoice(
            'souvent',
            'seguido',
            ['siempre', 'todos los días', 'después'],
            ['fr-souvent'],
            { id: 'fr.ex.0u2rna4tr3yjzf' },
          ),
          ex.matchPairs(
            [
              ['tous les jours', 'todos los días'],
              ['souvent', 'seguido'],
              ['toujours', 'siempre'],
              ["d'abord", 'primero'],
            ],
            ['fr-tous-les-jours', 'fr-souvent', 'fr-toujours', 'fr-d-abord'],
            { id: 'fr.ex.atp226eazd4p5v' },
          ),
          ex.listenChoice(
            'Je travaille toujours le soir.',
            [
              'Je travaille tous les jours.',
              'Je travaille souvent le soir.',
              'Je travaille toujours le matin.',
            ],
            ['fr-toujours', 'fr-le-soir'],
            {
              id: 'fr.ex.y3ymjey7du45gn',
              explanation:
                'Toujours (siempre) es una sola palabra; en tous les jours la s de tous no suena.',
            },
          ),
          ex.fillBlank(
            'Je bois ___ un café le matin.',
            'Siempre tomo un café a la mañana.',
            'toujours',
            ['souvent', 'ensuite', "d'abord"],
            ['fr-toujours'],
            {
              id: 'fr.ex.5ljdbgtfxbbgz0',
              skill: 'vocabulary',
              explanation: 'Siempre es toujours y va después del verbo.',
            },
          ),
          ex.fillBlank(
            'Il regarde ___ la télé.',
            'Él mira la tele seguido.',
            'souvent',
            ['toujours', 'ensuite', "d'abord"],
            ['fr-souvent'],
            {
              id: 'fr.ex.5e1dfjr1vbe73v',
              skill: 'vocabulary',
              explanation: 'Seguido es souvent; toujours es siempre.',
            },
          ),
          ex.orderWords(
            'Nous travaillons tous les jours.',
            'Trabajamos todos los días.',
            ['fr-tous-les-jours', 'fr-nous'],
            { id: 'fr.ex.5a09ip640byl0d' },
          ),
          question(
            'fr.ex.qafj0f57rgktmp',
            RYTHME,
            '¿Qué hace Nicolas todos los días?',
            'Trabaja.',
            ['Mira la tele.', 'Escucha música.', 'Se acuesta tarde.'],
            ['fr-tous-les-jours'],
            'Léa pregunta «tu travailles tous les jours?» y Nicolas responde «Oui».',
          ),
          question(
            'fr.ex.lga27e0thdtwrb',
            RYTHME,
            '¿Qué hace Léa a la noche?',
            'Mira la tele seguido.',
            ['Escucha siempre la radio.', 'Trabaja seguido.', 'Nunca mira la tele.'],
            ['fr-souvent', 'fr-toujours'],
            'Léa dice «Je regarde souvent la télé le soir»; la radio es de Nicolas.',
          ),
          ex.translateWrite(
            'Escucho la radio todos los días.',
            "J'écoute la radio tous les jours.",
            ['fr-j-ecoute', 'fr-tous-les-jours'],
            { id: 'fr.ex.ohix7nko7u31lb', acceptedAnswers: ["Tous les jours, j'écoute la radio."] },
          ),
          ex.shortAnswer(
            'Tu bois souvent du café?',
            '¿Tomás café seguido? (Respondé que sí, todos los días.)',
            'Oui, je bois du café tous les jours.',
            ['Oui, tous les jours.', 'Oui, tous les jours, je bois du café.'],
            ['fr-souvent', 'fr-tous-les-jours'],
            { id: 'fr.ex.xzyg0v7vauupzj' },
          ),
        ],
      },
    ],
  },
};

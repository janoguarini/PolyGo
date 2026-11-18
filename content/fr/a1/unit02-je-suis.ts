import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U2 «Soy argentino: être y nacionalidades» (docs/FR_A1_A2.md): être en singular y
 * vous êtes, nacionalidades con género, decir de dónde sos (je suis de), dónde vivís (j'habite à) y
 * qué idiomas hablás (je parle), y la negación ne… pas.
 * Pronunciación: en el femenino la consonante final suena (argentine, française, étudiante), liaison
 * vous‿êtes, h muda (j'habite). Cultura: los idiomas y las nacionalidades van en minúscula.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CAFE = dialogue(
  'fr.stim.a1-u2-cafe',
  'Dos estudiantes se conocen en un bar de Lyon.',
  [
    ['Julien', "Salut! Tu es d'où?"],
    ['Martina', 'Je suis de Rosario. Je suis argentine.'],
    ['Julien', "Rosario? C'est une ville d'Argentine?"],
    ['Martina', 'Oui. Et toi?'],
    ['Julien', "Je suis de Lyon. J'habite à Lyon aussi."],
  ],
  FR_A1_RATE,
);

const PROFIL = reading(
  'fr.stim.a1-u2-profil',
  'post',
  'Giulia se presenta en un foro de estudiantes.',
  [
    "Bonjour! Je m'appelle Giulia.",
    'Je suis italienne, de Rome.',
    "Je suis étudiante et j'habite à Lyon.",
    'Je parle italien, français et anglais.',
    'Je ne parle pas espagnol.',
  ],
  { from: 'Giulia' },
);

export const FR_A1_U02: FrUnitDef = {
  names: [
    'Martina',
    'Julien',
    'Giulia',
    'Pedro',
    'Diego',
    'Rosario',
    'Córdoba',
    'Buenos Aires',
    'Lyon',
    'Paris',
    'Rome',
    'Madrid',
    'Brésil',
  ],
  support: ['n', 'c', 'une', 'mais', 'anglais', 'parles', 'habites'],
  unit: {
    position: 2,
    title: 'Soy argentino: être y nacionalidades',
    titleEn: 'Je suis argentin',
    description:
      "Être en singular y vous êtes, nacionalidades con género, je suis de, j'habite à, je parle y ne… pas. Liaison vous‿êtes y consonante final del femenino.",
    emoji: '🌎',
    objective:
      'Podés decir quién sos, tu nacionalidad, de dónde sos, dónde vivís y qué idiomas hablás, y preguntárselo a otra persona.',
    grammar: {
      title: 'Être · nacionalidades · ne… pas',
      explanation:
        "El verbo être (ser) en singular: je suis, tu es, il est, elle est, y vous êtes para usted. Las nacionalidades concuerdan con la persona: il est argentin, elle est argentine; en el femenino la consonante final sí suena (argentine, française, étudiante). Con una profesión no va artículo: je suis étudiant. Para el origen: je suis de + ciudad; para dónde vivís: j'habite à + ciudad. La negación rodea al verbo: je ne suis pas, je ne parle pas; delante de vocal, ne se vuelve n': il n'est pas. Los idiomas y las nacionalidades se escriben en minúscula.",
      examples: [
        { target: 'Je suis argentine.', base: 'Soy argentina.' },
        { target: "Vous êtes d'où?", base: '¿De dónde es usted?' },
        { target: 'Je ne parle pas italien.', base: 'No hablo italiano.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A1 nuevo (U2). Sin revisión nativa: revisar «une ville d'Argentine» en el diálogo y que el femenino de nacionalidades (argentine) también nombra al país con mayúscula (l'Argentine).",
    },
    words: [
      w(
        'fr-je-suis',
        'je suis',
        'soy',
        'Je suis Ana. Je suis argentine.',
        'Soy Ana. Soy argentina.',
        ['verbs'],
        {
          acceptedTranslations: ['yo soy'],
        },
      ),
      w('fr-tu-es', 'tu es', 'sos', 'Tu es étudiant?', '¿Sos estudiante?', ['verbs'], {
        acceptedTranslations: ['eres', 'tú eres', 'vos sos'],
      }),
      w('fr-il-est', 'il est', 'él es', 'Hugo? Il est français.', '¿Hugo? Es francés.', ['verbs']),
      w('fr-elle-est', 'elle est', 'ella es', 'Elle est italienne.', 'Es italiana.', ['verbs']),
      w(
        'fr-vous-etes',
        'vous êtes',
        'usted es',
        "Vous êtes d'où, madame?",
        '¿De dónde es usted, señora?',
        ['verbs'],
        { acceptedTranslations: ['ustedes son'] },
      ),
      w(
        'fr-argentin',
        'argentin',
        'argentino',
        'Martina est argentine.',
        'Martina es argentina.',
        ['nationalities'],
        { acceptedTranslations: ['argentina'], acceptedTexts: ['argentine'], emoji: '🇦🇷' },
      ),
      w(
        'fr-francais',
        'français',
        'francés',
        'Je parle français.',
        'Hablo francés.',
        ['nationalities', 'languages'],
        { acceptedTranslations: ['francesa'], acceptedTexts: ['française'], emoji: '🇫🇷' },
      ),
      w(
        'fr-espagnol',
        'espagnol',
        'español',
        'Diego parle espagnol.',
        'Diego habla español.',
        ['nationalities', 'languages'],
        { acceptedTranslations: ['española'], acceptedTexts: ['espagnole'], emoji: '🇪🇸' },
      ),
      w(
        'fr-italien',
        'italien',
        'italiano',
        'Giulia est italienne, de Rome.',
        'Giulia es italiana, de Roma.',
        ['nationalities', 'languages'],
        { acceptedTranslations: ['italiana'], acceptedTexts: ['italienne'], emoji: '🇮🇹' },
      ),
      w(
        'fr-bresilien',
        'brésilien',
        'brasileño',
        'Pedro est brésilien.',
        'Pedro es brasileño.',
        ['nationalities'],
        { acceptedTranslations: ['brasileña'], acceptedTexts: ['brésilienne'], emoji: '🇧🇷' },
      ),
      w(
        'fr-tu-es-d-ou',
        "tu es d'où?",
        '¿de dónde sos?',
        "Salut! Tu es d'où?",
        '¡Hola! ¿De dónde sos?',
        ['questions'],
        { acceptedTranslations: ['¿de dónde eres?'] },
      ),
      w(
        'fr-je-suis-de',
        'je suis de',
        'soy de',
        'Je suis de Buenos Aires.',
        'Soy de Buenos Aires.',
        ['introductions'],
      ),
      w('fr-j-habite-a', "j'habite à", 'vivo en', "J'habite à Lyon.", 'Vivo en Lyon.', [
        'introductions',
      ]),
      w(
        'fr-je-parle',
        'je parle',
        'hablo',
        'Je parle espagnol et français.',
        'Hablo español y francés.',
        ['verbs', 'languages'],
      ),
      w(
        'fr-la-ville',
        'la ville',
        'la ciudad',
        'Rosario est une ville argentine.',
        'Rosario es una ciudad argentina.',
        ['places', 'f'],
        { emoji: '🏙️' },
      ),
      w(
        'fr-le-pays',
        'le pays',
        'el país',
        "Le pays de Pedro? C'est le Brésil.",
        '¿El país de Pedro? Es Brasil.',
        ['places', 'm'],
        { emoji: '🗺️' },
      ),
      w(
        'fr-etudiant',
        'étudiant',
        'estudiante',
        'Léa est étudiante.',
        'Léa es estudiante.',
        ['people'],
        { acceptedTexts: ['étudiante'], emoji: '🎓' },
      ),
      w(
        'fr-ne-pas',
        'ne… pas',
        'no (con el verbo)',
        'Je ne suis pas française.',
        'No soy francesa.',
        ['negation'],
      ),
      w(
        'fr-aussi',
        'aussi',
        'también',
        'Je suis étudiant. — Moi aussi!',
        'Soy estudiante. — ¡Yo también!',
        ['basics'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Je suis, tu es',
        objective: 'Decir quién sos y qué hacés con el verbo être.',
        intro: {
          explanation:
            'Être es ser: je suis, tu es, il est (él), elle est (ella). Tu es e il est suenan igual: la s y la t finales no se pronuncian. Con una profesión no va artículo: je suis étudiant (soy estudiante). En el femenino se agrega una e y la t final sí suena: étudiante. Para decir «yo también»: moi aussi.',
          examples: [
            { target: 'Je suis Ana.', base: 'Soy Ana.' },
            { target: 'Il est étudiant.', base: 'Él es estudiante.' },
          ],
        },
        takeaways: [
          'Decís quién sos con je suis y hablás de otro con il est o elle est.',
          'Sabés que en étudiante la t final suena y en étudiant no.',
        ],
        exercises: [
          ex.translationChoice('je suis', 'soy', ['sos', 'él es', 'ella es'], ['fr-je-suis'], {
            id: 'fr.ex.5n9ore5ewx9bui',
          }),
          ex.translationChoice(
            'elle est',
            'ella es',
            ['él es', 'soy', 'sos'],
            ['fr-elle-est', 'fr-il-est'],
            { id: 'fr.ex.kqrduwkez1vmg1', explanation: 'Il es él; elle, ella.' },
          ),
          ex.matchPairs(
            [
              ['je suis', 'soy'],
              ['tu es', 'sos'],
              ['il est', 'él es'],
              ['elle est', 'ella es'],
            ],
            ['fr-je-suis', 'fr-tu-es', 'fr-il-est', 'fr-elle-est'],
            { id: 'fr.ex.1honl4u9e418wx' },
          ),
          ex.listenChoice(
            'Elle est étudiante.',
            ['Il est étudiant.', 'Je suis étudiante.', 'Tu es étudiante?'],
            ['fr-elle-est', 'fr-etudiant'],
            {
              id: 'fr.ex.f2aw88zf8x4o7m',
              explanation: 'En étudiante (femenino) la t final suena; en étudiant, no.',
            },
          ),
          ex.fillBlank(
            'Je ___ étudiant.',
            'Soy estudiante.',
            'suis',
            ['es', 'est', 'va'],
            ['fr-je-suis', 'fr-etudiant'],
            {
              id: 'fr.ex.89rsjejcpjs16a',
              explanation: 'Con je: je suis. Y sin artículo delante de la profesión.',
            },
          ),
          ex.fillBlank(
            'Tu ___ étudiante?',
            '¿Sos estudiante?',
            'es',
            ['suis', 'est', 'va'],
            ['fr-tu-es'],
            {
              id: 'fr.ex.yfa7052qrkvvne',
              explanation: 'Con tu: tu es. Suena igual que il est, pero se escribe sin t.',
            },
          ),
          ex.fillBlank(
            'Hugo est étudiant. Et Léa? ___ est étudiante aussi.',
            'Hugo es estudiante. ¿Y Léa? Ella también es estudiante.',
            'Elle',
            ['Il', 'Je', 'Tu'],
            ['fr-elle-est', 'fr-aussi'],
            {
              id: 'fr.ex.3096yixc7gpzn1',
              explanation:
                'Léa es mujer: elle est. En francés el pronombre no se omite: «est étudiante» solo no alcanza.',
            },
          ),
          ex.orderWords(
            'Je suis étudiante aussi.',
            'Yo también soy estudiante.',
            ['fr-je-suis', 'fr-etudiant', 'fr-aussi'],
            { id: 'fr.ex.rxjyarr64sdfsk' },
          ),
          ex.translateWrite(
            'Ella es estudiante.',
            'Elle est étudiante.',
            ['fr-elle-est', 'fr-etudiant'],
            { id: 'fr.ex.kp6pbkc9tnllof' },
          ),
          ex.shortAnswer(
            'Je suis étudiant. Et toi?',
            'Soy estudiante. ¿Y vos? (Respondé que vos también sos estudiante; sos mujer.)',
            'Moi aussi, je suis étudiante.',
            [
              'Moi aussi!',
              'Moi aussi.',
              'Je suis étudiante aussi.',
              'Je suis aussi étudiante.',
              'Moi aussi, je suis étudiante!',
            ],
            ['fr-aussi', 'fr-je-suis', 'fr-etudiant'],
            { id: 'fr.ex.lkq1egkzvg00b3' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Je suis argentin',
        objective: 'Decir tu nacionalidad y preguntar la de otra persona con vous êtes.',
        intro: {
          explanation:
            'Las nacionalidades concuerdan con la persona: argentin / argentine, français / française, italien / italienne, brésilien / brésilienne, espagnol / espagnole. En el femenino la consonante final suena: en argentin la n no suena (vocal nasal), en argentine sí; en français la s es muda, en française suena como z. Con vous êtes hay liaison: la s de vous se une a êtes con un sonido z. Ojo: en francés las nacionalidades van en minúscula.',
          examples: [
            { target: 'Je suis argentin.', base: 'Soy argentino.' },
            { target: 'Vous êtes française?', base: '¿Usted es francesa?' },
          ],
        },
        takeaways: [
          'Decís tu nacionalidad en masculino o en femenino.',
          'Preguntás con vous êtes y unís vous‿êtes con un sonido z.',
        ],
        exercises: [
          ex.translationChoice(
            'argentin',
            'argentino',
            ['brasileño', 'italiano', 'francés'],
            ['fr-argentin'],
            { id: 'fr.ex.kgvd32767vh9v3' },
          ),
          ex.matchPairs(
            [
              ['français', 'francés'],
              ['espagnol', 'español'],
              ['italien', 'italiano'],
              ['brésilien', 'brasileño'],
            ],
            ['fr-francais', 'fr-espagnol', 'fr-italien', 'fr-bresilien'],
            { id: 'fr.ex.j60ly0e8b86n0u' },
          ),
          ex.listenChoice(
            'Elle est argentine.',
            ['Il est argentin.', 'Elle est italienne.', 'Il est italien.'],
            ['fr-argentin', 'fr-elle-est'],
            {
              id: 'fr.ex.jf3709okr1l0i9',
              explanation: 'En argentine la n final suena; en argentin, no: es una vocal nasal.',
            },
          ),
          ex.fillBlank(
            'Léa est ___.',
            'Léa es francesa.',
            'française',
            ['français', 'espagnol', 'brésilien'],
            ['fr-francais'],
            {
              id: 'fr.ex.w0ot4hrkv50j8y',
              explanation:
                'Léa es mujer: française, con e. La s, que en français es muda, ahora suena.',
            },
          ),
          ex.fillBlank(
            'Vous ___ français, monsieur?',
            '¿Usted es francés, señor?',
            'êtes',
            ['es', 'est', 'suis'],
            ['fr-vous-etes', 'fr-francais'],
            {
              id: 'fr.ex.m0wprml01cp3y2',
              explanation:
                'Con vous: vous êtes. Se pronuncia con liaison: vous‿êtes, con sonido z.',
            },
          ),
          ex.listenChoice(
            'Vous êtes italien?',
            ['Tu es italien?', 'Vous êtes italienne?', 'Il est italien?'],
            ['fr-vous-etes', 'fr-italien'],
            {
              id: 'fr.ex.mhw072mp1q7nwa',
              explanation: 'Italien termina en vocal nasal; italienne, en una n que suena.',
            },
          ),
          ex.translationChoice(
            'vous êtes',
            'usted es',
            ['sos', 'soy', 'ella es'],
            ['fr-vous-etes'],
            {
              id: 'fr.ex.bgjfk3jd6cwhq8',
              explanation: 'Vous êtes es usted es (o ustedes son); tu es, sos.',
            },
          ),
          ex.fillBlank(
            'Pedro est ___.',
            'Pedro es brasileño.',
            'brésilien',
            ['brésilienne', 'argentine', 'française'],
            ['fr-bresilien'],
            {
              id: 'fr.ex.r8us3gtf35gdnp',
              explanation: 'Pedro es hombre: brésilien, sin la terminación -enne del femenino.',
            },
          ),
          ex.translateWrite('Soy argentina.', 'Je suis argentine.', ['fr-je-suis', 'fr-argentin'], {
            id: 'fr.ex.lr6qj4pn3zi837',
          }),
          ex.translateWrite(
            '¿Usted es español?',
            'Vous êtes espagnol?',
            ['fr-vous-etes', 'fr-espagnol'],
            { id: 'fr.ex.sw3y64k3dkc5ly', acceptedAnswers: ['Êtes-vous espagnol?'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "Tu es d'où?",
        objective: 'Decir de dónde sos y en qué ciudad vivís.',
        intro: {
          explanation:
            "Para preguntar el origen: tu es d'où? (o vous êtes d'où?). Se responde je suis de + ciudad. Para la ciudad donde vivís: j'habite à + ciudad (nunca «en» delante de una ciudad). La h de habite es muda: je se vuelve j' y se dice como si empezara con vocal. La ville es la ciudad y le pays, el país (la s final no suena).",
          examples: [
            {
              target: "Tu es d'où? — Je suis de Rosario.",
              base: '¿De dónde sos? — Soy de Rosario.',
            },
            { target: "J'habite à Paris.", base: 'Vivo en París.' },
          ],
        },
        takeaways: [
          'Decís de dónde sos con je suis de.',
          "Decís dónde vivís con j'habite à + ciudad.",
        ],
        exercises: [
          ex.translationChoice(
            "tu es d'où?",
            '¿de dónde sos?',
            ['¿cómo te llamás?', '¿cómo va?', 'soy de'],
            ['fr-tu-es-d-ou'],
            { id: 'fr.ex.0qy0tftepbnpu3' },
          ),
          ex.matchPairs(
            [
              ["tu es d'où?", '¿de dónde sos?'],
              ['je suis de', 'soy de'],
              ["j'habite à", 'vivo en'],
              ['le pays', 'el país'],
            ],
            ['fr-tu-es-d-ou', 'fr-je-suis-de', 'fr-j-habite-a', 'fr-le-pays'],
            { id: 'fr.ex.vvywrod7f4hrap' },
          ),
          ex.listenChoice(
            "J'habite à Lyon.",
            ["J'habite à Rome.", 'Je suis de Lyon.', 'Tu habites à Lyon?'],
            ['fr-j-habite-a'],
            {
              id: 'fr.ex.htuwbodz0uisvz',
              explanation: "La h de habite es muda: se dice j'habite, todo junto.",
            },
          ),
          ex.fillBlank(
            "Je suis de Rosario, mais j'habite ___ Paris.",
            'Soy de Rosario, pero vivo en París.',
            'à',
            ['de', 'au', 'et'],
            ['fr-j-habite-a', 'fr-je-suis-de'],
            {
              id: 'fr.ex.elskkkigeid9a4',
              explanation:
                "Con una ciudad: j'habite à Paris. De es para el origen: je suis de Rosario.",
            },
          ),
          question(
            'fr.ex.yjzxfdey7ai3u6',
            CAFE,
            '¿De dónde es Martina?',
            'De Rosario, en Argentina.',
            ['De Lyon.', 'De Buenos Aires.', 'No lo dice.'],
            ['fr-je-suis-de', 'fr-tu-es-d-ou'],
            'Martina responde «Je suis de Rosario. Je suis argentine».',
          ),
          question(
            'fr.ex.n2v23lmcvu73ha',
            CAFE,
            '¿Dónde vive Julien?',
            'En Lyon.',
            ['En Rosario.', 'En París.', 'No lo dice.'],
            ['fr-j-habite-a'],
            "Julien dice «Je suis de Lyon. J'habite à Lyon aussi».",
          ),
          question(
            'fr.ex.fh4l7l7tv5y3v5',
            CAFE,
            '¿Martina es francesa?',
            'No, es argentina.',
            ['Sí, es de Lyon.', 'No, es italiana.', 'No lo dice.'],
            ['fr-argentin'],
            'Martina dice «Je suis argentine».',
          ),
          ex.orderWords(
            'Rosario est une ville argentine.',
            'Rosario es una ciudad argentina.',
            ['fr-la-ville', 'fr-argentin'],
            { id: 'fr.ex.3l0gaqtdf6xr18' },
          ),
          ex.translateWrite(
            'Soy de Córdoba, pero vivo en Buenos Aires.',
            "Je suis de Córdoba, mais j'habite à Buenos Aires.",
            ['fr-je-suis-de', 'fr-j-habite-a'],
            { id: 'fr.ex.ho36kn0u1er130' },
          ),
          ex.shortAnswer(
            "Tu es d'où?",
            '¿De dónde sos? (Respondé que sos de Rosario.)',
            'Je suis de Rosario.',
            ['Je suis de Rosario!', 'Moi, je suis de Rosario.'],
            ['fr-je-suis-de'],
            { id: 'fr.ex.5hmyqwpbsx47x5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Je parle, je ne parle pas',
        objective: 'Decir qué idiomas hablás y negar con ne… pas.',
        intro: {
          explanation:
            "Je parle + idioma: je parle espagnol (la e final de parle no suena). El idioma es igual a la nacionalidad en masculino y va en minúscula: français, espagnol, italien, anglais. Para negar, ne… pas rodea al verbo: je ne parle pas italien, je ne suis pas française. Delante de vocal, ne se vuelve n': il n'est pas. Non sirve para responder solo; con un verbo, ne… pas.",
          examples: [
            { target: 'Je parle espagnol.', base: 'Hablo español.' },
            { target: 'Je ne suis pas italien.', base: 'No soy italiano.' },
          ],
        },
        takeaways: [
          'Decís qué idiomas hablás con je parle.',
          "Negás con ne… pas alrededor del verbo (n' delante de vocal).",
        ],
        exercises: [
          ex.translationChoice('je parle', 'hablo', ['vivo en', 'soy', 'soy de'], ['fr-je-parle'], {
            id: 'fr.ex.tpq6h0qjincho8',
          }),
          ex.fillBlank(
            'Je parle ___.',
            'Hablo español.',
            'espagnol',
            ['espagnole', 'argentin', 'argentine'],
            ['fr-je-parle', 'fr-espagnol'],
            {
              id: 'fr.ex.exzesqz8fnstby',
              skill: 'vocabulary',
              explanation:
                'El idioma va en masculino: espagnol. En Argentina se habla espagnol: «argentin» no es un idioma.',
            },
          ),
          ex.listenChoice(
            'Je ne parle pas italien.',
            ['Je parle italien.', 'Je ne parle pas anglais.', 'Il ne parle pas italien.'],
            ['fr-ne-pas', 'fr-je-parle'],
            { id: 'fr.ex.soxi2en8ovkwsw' },
          ),
          ex.fillBlank(
            'Je ne suis ___ française.',
            'No soy francesa.',
            'pas',
            ['non', 'ne', 'aussi'],
            ['fr-ne-pas'],
            {
              id: 'fr.ex.l7569xfab9hsx1',
              explanation: 'La negación tiene dos partes: ne antes del verbo y pas después.',
            },
          ),
          ex.fillBlank(
            'Pedro? Il ___ pas espagnol.',
            '¿Pedro? No es español.',
            "n'est",
            ['ne est', 'est', 'non est'],
            ['fr-ne-pas', 'fr-il-est'],
            {
              id: 'fr.ex.1qolu7a3tc3ht8',
              explanation: "Delante de vocal, ne pierde la e (elisión): il n'est pas.",
            },
          ),
          ex.matchPairs(
            [
              ['je parle', 'hablo'],
              ['ne… pas', 'no (con el verbo)'],
              ['aussi', 'también'],
              ['vous êtes', 'usted es'],
            ],
            ['fr-je-parle', 'fr-ne-pas', 'fr-aussi', 'fr-vous-etes'],
            { id: 'fr.ex.49n6s066dl87md' },
          ),
          ex.translationChoice(
            'ne… pas',
            'no (con el verbo)',
            ['también', 'sí', 'hablo'],
            ['fr-ne-pas'],
            { id: 'fr.ex.sqerrz37on5u4e' },
          ),
          ex.orderWords(
            'Je ne parle pas anglais.',
            'No hablo inglés.',
            ['fr-ne-pas', 'fr-je-parle'],
            {
              id: 'fr.ex.hmd7meo7mk0l4y',
            },
          ),
          ex.translateWrite(
            'Hablo español y francés.',
            'Je parle espagnol et français.',
            ['fr-je-parle', 'fr-espagnol', 'fr-francais'],
            { id: 'fr.ex.lepxwnaq3afp2d', acceptedAnswers: ['Je parle français et espagnol.'] },
          ),
          ex.shortAnswer(
            'Tu parles italien?',
            '¿Hablás italiano? (Respondé que no, que no hablás italiano.)',
            'Non, je ne parle pas italien.',
            ['Non. Je ne parle pas italien.', 'Je ne parle pas italien.'],
            ['fr-ne-pas', 'fr-je-parle'],
            { id: 'fr.ex.2ig4xg8tuffdin' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Me presento',
        objective: 'Presentarte con nacionalidad, ciudad e idiomas, y entender una presentación.',
        intro: {
          explanation:
            "Una presentación completa: je m'appelle…, je suis + nacionalidad, je suis de…, j'habite à…, je parle… Para preguntar a un amigo: tu es d'où? tu habites où? tu parles français? Con vous: vous êtes d'où? Recordá: tu habites, tu parles llevan una s final que no suena.",
          examples: [
            {
              target: "Je m'appelle Diego. Je suis argentin.",
              base: 'Me llamo Diego. Soy argentino.',
            },
            { target: 'Tu habites où?', base: '¿Dónde vivís?' },
          ],
        },
        takeaways: [
          'Te presentás con nombre, nacionalidad, ciudad e idiomas.',
          'Entendés una presentación corta escrita.',
        ],
        exercises: [
          question(
            'fr.ex.fwzk82cd9obr1w',
            PROFIL,
            '¿De dónde es Giulia?',
            'De Roma.',
            ['De Lyon.', 'De Madrid.', 'De Rosario.'],
            ['fr-italien', 'fr-je-suis-de'],
            'Escribe «Je suis italienne, de Rome».',
          ),
          question(
            'fr.ex.60v38hgne9it6q',
            PROFIL,
            '¿Qué idiomas habla Giulia?',
            'Italiano, francés e inglés.',
            ['Italiano y español.', 'Solo italiano.', 'Francés y español.'],
            ['fr-je-parle', 'fr-ne-pas'],
            'Escribe «Je parle italien, français et anglais» y «Je ne parle pas espagnol».',
          ),
          question(
            'fr.ex.2mv0bcyev5chq7',
            PROFIL,
            '¿Qué hace Giulia en Lyon?',
            'Vive ahí y es estudiante.',
            ['Está de vacaciones.', 'Es profesora.', 'No vive en Lyon.'],
            ['fr-etudiant', 'fr-j-habite-a'],
            "Escribe «Je suis étudiante et j'habite à Lyon».",
          ),
          ex.listenChoice(
            "Vous êtes d'où, madame?",
            ["Tu es d'où, Léa?", 'Vous êtes française, madame?', 'Vous êtes italienne, madame?'],
            ['fr-vous-etes', 'fr-tu-es-d-ou'],
            { id: 'fr.ex.s3o6owzm8vqtey' },
          ),
          ex.fillBlank(
            'Tu ___ où?',
            '¿Dónde vivís?',
            'habites',
            ['habite', 'parles', 'suis'],
            ['fr-j-habite-a'],
            {
              id: 'fr.ex.cug0m7cyz9xh2z',
              explanation: 'Con tu: tu habites, con una s que no se pronuncia.',
            },
          ),
          ex.translationChoice(
            'la ville',
            'la ciudad',
            ['el país', 'vivo en', 'también'],
            ['fr-la-ville'],
            { id: 'fr.ex.aha0iam3793yi8' },
          ),
          ex.matchPairs(
            [
              ['française', 'francesa'],
              ['italienne', 'italiana'],
              ['brésilienne', 'brasileña'],
              ['espagnole', 'española'],
            ],
            ['fr-francais', 'fr-italien', 'fr-bresilien', 'fr-espagnol'],
            { id: 'fr.ex.xajegensqcxqzw' },
          ),
          ex.orderWords(
            'Elle parle français aussi.',
            'Ella también habla francés.',
            ['fr-je-parle', 'fr-aussi', 'fr-francais'],
            { id: 'fr.ex.05thuncgql75ly' },
          ),
          ex.translateWrite(
            'Me llamo Diego. Soy argentino y vivo en París.',
            "Je m'appelle Diego. Je suis argentin et j'habite à Paris.",
            ['fr-je-suis', 'fr-argentin', 'fr-j-habite-a'],
            { id: 'fr.ex.bhsp37x03aq0qp' },
          ),
          ex.shortAnswer(
            'Vous êtes française?',
            '¿Usted es francesa? (Respondé que no, que sos argentina.)',
            'Non, je ne suis pas française. Je suis argentine.',
            [
              'Non, je suis argentine.',
              'Non. Je suis argentine.',
              'Non, je ne suis pas française, je suis argentine.',
            ],
            ['fr-ne-pas', 'fr-argentin'],
            { id: 'fr.ex.0b73yqfrghh6wn' },
          ),
        ],
      },
    ],
  },
};

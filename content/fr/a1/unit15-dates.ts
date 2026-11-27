import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U15 «Meses, fechas y cumpleaños» (docs/FR_A1_A2.md): los meses (en minúscula, en + mes),
 * preguntar y decir la fecha (quelle est la date? — nous sommes le 3 mars, con el número cardinal
 * salvo le premier), el mes y el año, y el cumpleaños (falso amigo: l'anniversaire; joyeux
 * anniversaire!). Pronunciación: la s final de mars sí suena, août (sólo la vocal ou), juin (nasal) /
 * juillet, deux / douze. Cultura: el 14 de julio (fiesta nacional) y la Fête de la musique (21 de
 * junio); las clases empiezan en septiembre.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ANNIVERSAIRE = dialogue(
  'fr.stim.a1-u15-anniversaire',
  'Léa y Hugo hablan de sus cumpleaños.',
  [
    ['Léa', "Hugo, c'est quand, ton anniversaire?"],
    ['Hugo', "C'est le deux juin. Et toi?"],
    ['Léa', "Moi, c'est en décembre, le douze."],
    ['Hugo', "Le douze décembre? Mais c'est aujourd'hui! Joyeux anniversaire!"],
    ['Léa', 'Merci, Hugo!'],
  ],
  FR_A1_RATE,
);

const INVITATION = reading(
  'fr.stim.a1-u15-invitation',
  'message',
  'Un mensaje de Marie a su amigo Paul.',
  [
    'Salut, Paul!',
    "Samedi 21 juin, c'est la Fête de la musique et c'est aussi mon anniversaire!",
    'On mange à la maison à huit heures?',
    'Après, on va écouter de la musique dans la rue.',
    'Marie',
  ],
  { from: 'Marie', to: 'Paul' },
);

export const FR_A1_U15: FrUnitDef = {
  names: [
    'Léa',
    'Hugo',
    'Paul',
    'Marie',
    'Paris',
    'Lyon',
    'Marseille',
    'France',
    'Noël',
    'Fête de la musique',
  ],
  support: ['en', 'écouter'],
  unit: {
    position: 15,
    title: 'Meses, fechas y cumpleaños',
    titleEn: 'Les dates',
    description:
      "Los meses (en minúscula, en + mes), la fecha (le 14 juillet, pero le premier mai), le mois, l'année y l'anniversaire (cumpleaños). El 14 de julio y la Fête de la musique.",
    emoji: '📅',
    objective:
      'Puedes decir los meses, preguntar y decir la fecha, y hablar de cumpleaños y fechas importantes.',
    grammar: {
      title: 'La fecha: le + número + mes',
      explanation:
        "Los meses se escriben con minúscula y son masculinos. «En mayo» es en mai. La fecha se dice le + número + mes, sin «de»: le 14 juillet (el 14 de julio). Sólo el día 1 cambia: le premier mai (el primero de mayo). Para preguntar la fecha: quelle est la date? Se responde nous sommes le 3 mars o c'est le 3 mars. Falso amigo: l'anniversaire es el cumpleaños.",
      examples: [
        { target: 'Nous sommes le premier avril.', base: 'Hoy es primero de abril.' },
        { target: "C'est le 14 juillet.", base: 'Es 14 de julio.' },
        { target: "Mon anniversaire, c'est en mai.", base: 'Mi cumpleaños es en mayo.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U15). Sin revisión nativa: revisar la pronunciación de août (sin t final, la variante con t existe), «Nous sommes le…» frente a «On est le…» y «Mon anniversaire est le 3 mars».',
    },
    words: [
      w(
        'fr-janvier',
        'janvier',
        'enero',
        "Mon anniversaire, c'est le 3 janvier.",
        'Mi cumpleaños es el 3 de enero.',
        ['months'],
      ),
      w(
        'fr-fevrier',
        'février',
        'febrero',
        'Il y a 28 jours en février.',
        'Febrero tiene 28 días.',
        ['months'],
      ),
      w('fr-mars', 'mars', 'marzo', 'Nous sommes le 10 mars.', 'Hoy es 10 de marzo.', ['months']),
      w('fr-avril', 'avril', 'abril', 'Je vais à Paris en avril.', 'Voy a París en abril.', [
        'months',
      ]),
      w(
        'fr-mai',
        'mai',
        'mayo',
        'Le premier mai, je ne travaille pas.',
        'El primero de mayo no trabajo.',
        ['months'],
      ),
      w(
        'fr-juin',
        'juin',
        'junio',
        "Le 21 juin, c'est la Fête de la musique.",
        'El 21 de junio es la Fiesta de la Música.',
        ['months'],
      ),
      w(
        'fr-juillet',
        'juillet',
        'julio',
        'Le 14 juillet, je suis à Paris.',
        'El 14 de julio estoy en París.',
        ['months'],
      ),
      w(
        'fr-aout',
        'août',
        'agosto',
        'En août, nous allons à Marseille.',
        'En agosto vamos a Marsella.',
        ['months'],
      ),
      w(
        'fr-septembre',
        'septembre',
        'septiembre',
        "En France, l'école commence en septembre.",
        'En Francia, las clases empiezan en septiembre.',
        ['months'],
      ),
      w(
        'fr-octobre',
        'octobre',
        'octubre',
        'Mon frère a vingt ans en octobre.',
        'Mi hermano cumple veinte años en octubre.',
        ['months'],
      ),
      w(
        'fr-novembre',
        'novembre',
        'noviembre',
        'Je travaille beaucoup en novembre.',
        'En noviembre trabajo mucho.',
        ['months'],
      ),
      w(
        'fr-decembre',
        'décembre',
        'diciembre',
        "Le 25 décembre, c'est Noël.",
        'El 25 de diciembre es Navidad.',
        ['months'],
      ),
      w(
        'fr-le-mois',
        'le mois',
        'el mes',
        'Il y a douze mois dans une année.',
        'Un año tiene doce meses.',
        ['time', 'm'],
      ),
      w('fr-l-annee', "l'année", 'el año', 'Bonne année!', '¡Feliz año nuevo!', ['time', 'f']),
      w(
        'fr-l-anniversaire',
        "l'anniversaire",
        'el cumpleaños',
        "C'est quand, ton anniversaire?",
        '¿Cuándo es tu cumpleaños?',
        ['time', 'm'],
      ),
      w(
        'fr-le-premier',
        'le premier',
        'el primero',
        'Nous sommes le premier mars.',
        'Hoy es primero de marzo.',
        ['time'],
        { acceptedTranslations: ['el uno'] },
      ),
      w(
        'fr-joyeux-anniversaire',
        'joyeux anniversaire!',
        '¡feliz cumpleaños!',
        'Joyeux anniversaire, Léa!',
        '¡Feliz cumpleaños, Léa!',
        ['greetings'],
      ),
      w(
        'fr-quelle-est-la-date',
        'quelle est la date?',
        '¿qué fecha es?',
        "Quelle est la date aujourd'hui?",
        '¿Qué fecha es hoy?',
        ['questions', 'time'],
        { acceptedTranslations: ['¿a qué fecha estamos?'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'De janvier à juin',
        objective: 'Decir los meses de enero a junio y usar en + mes.',
        intro: {
          explanation:
            'Los meses en francés son masculinos y se escriben con minúscula: janvier, février, mars, avril, mai, juin. «En mayo» es en mai, sin artículo. Pronunciación: en mars la s final sí suena (es una excepción), y en avril también suena la l. Juin termina en vocal nasal. Le mois es el mes.',
          examples: [
            { target: 'Je vais à Paris en avril.', base: 'Voy a París en abril.' },
            { target: 'Mai est un beau mois.', base: 'Mayo es un mes lindo.' },
          ],
        },
        takeaways: [
          'Dices los meses de janvier a juin, con minúscula.',
          'Usas en + mes: en mai, en juin.',
        ],
        exercises: [
          ex.translationChoice('janvier', 'enero', ['junio', 'febrero', 'mayo'], ['fr-janvier'], {
            id: 'fr.ex.s9zxpj28oj468n',
          }),
          ex.matchPairs(
            [
              ['février', 'febrero'],
              ['mars', 'marzo'],
              ['avril', 'abril'],
              ['mai', 'mayo'],
            ],
            ['fr-fevrier', 'fr-mars', 'fr-avril', 'fr-mai'],
            { id: 'fr.ex.ubeinyrhaq0kny' },
          ),
          ex.listenChoice(
            'Je vais à Paris en mars.',
            ['Je vais à Paris en mai.', 'Je vais à Paris en avril.', 'Je vais à Lyon en mars.'],
            ['fr-mars', 'fr-mai'],
            {
              id: 'fr.ex.szute74ejvhvtj',
              explanation: 'En mars se oye la s final; mai termina en vocal.',
            },
          ),
          ex.fillBlank(
            'Je vais à Paris ___ juin.',
            'Voy a París en junio.',
            'en',
            ['au', 'le', 'de'],
            ['fr-juin'],
            {
              id: 'fr.ex.tfkttd72j2i7vw',
              explanation: 'Con los meses se usa en, sin artículo: en juin.',
            },
          ),
          ex.translationChoice(
            'le mois',
            'el mes',
            ['el año', 'la semana', 'el día'],
            ['fr-le-mois'],
            {
              id: 'fr.ex.9b917ktscqlwlk',
            },
          ),
          ex.fillBlank(
            'Mai est un beau ___.',
            'Mayo es un mes lindo.',
            'mois',
            ['semaine', 'heure'],
            ['fr-le-mois', 'fr-mai'],
            {
              id: 'fr.ex.l2ziegw53tsq2i',
              explanation:
                'Mes es mois (masculino: un beau mois). Mois termina en s también en singular.',
            },
          ),
          ex.orderWords(
            'Je travaille beaucoup en février.',
            'En febrero trabajo mucho.',
            ['fr-fevrier'],
            {
              id: 'fr.ex.4tnh468vld5max',
            },
          ),
          ex.translationChoice('avril', 'abril', ['mayo', 'marzo', 'enero'], ['fr-avril'], {
            id: 'fr.ex.8twxeln75piqk8',
          }),
          ex.translateWrite('Voy a Lyon en enero.', 'Je vais à Lyon en janvier.', ['fr-janvier'], {
            id: 'fr.ex.a230j1o85s8pjh',
            acceptedAnswers: ['En janvier, je vais à Lyon.'],
          }),
          ex.shortAnswer(
            'Tu vas à Paris quand?',
            '¿Cuándo vas a París? (Responde que vas en junio.)',
            'Je vais à Paris en juin.',
            ['En juin.', 'Je vais en juin.', 'En juin, je vais à Paris.'],
            ['fr-juin'],
            { id: 'fr.ex.m2uw23i0pigrw2' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'De juillet à décembre',
        objective: 'Decir los meses de julio a diciembre y hablar del año.',
        intro: {
          explanation:
            "Los otros seis meses: juillet, août, septembre, octobre, novembre, décembre. En août no suenan la a ni, casi siempre, la t final: sólo se oye la vocal ou. En juillet la t final no suena. L'année es el año (femenino: une année); con números se usa an: vingt ans. En Francia las vacaciones de verano son en julio y agosto, y las clases empiezan en septiembre.",
          examples: [
            { target: 'En août, nous allons à Marseille.', base: 'En agosto vamos a Marsella.' },
            { target: 'Il y a douze mois dans une année.', base: 'Un año tiene doce meses.' },
          ],
        },
        takeaways: ['Dices los meses de juillet a décembre.', "Usas le mois y l'année."],
        exercises: [
          ex.translationChoice('août', 'agosto', ['julio', 'octubre', 'abril'], ['fr-aout'], {
            id: 'fr.ex.4vhspyw1qkifia',
          }),
          ex.matchPairs(
            [
              ['juillet', 'julio'],
              ['septembre', 'septiembre'],
              ['octobre', 'octubre'],
              ['novembre', 'noviembre'],
            ],
            ['fr-juillet', 'fr-septembre', 'fr-octobre', 'fr-novembre'],
            { id: 'fr.ex.b7ufvtjiu92bkq' },
          ),
          ex.listenChoice(
            'Nous allons à Marseille en juillet.',
            [
              'Nous allons à Marseille en juin.',
              'Nous allons à Marseille en août.',
              'Nous allons à Paris en juillet.',
            ],
            ['fr-juillet', 'fr-juin', 'fr-aout'],
            {
              id: 'fr.ex.npgp0cwqg48rjs',
              explanation:
                'Juin termina en vocal nasal; en juillet, después de la ll se oye una e.',
            },
          ),
          ex.fillBlank(
            'Il y a douze mois dans une ___.',
            'Un año tiene doce meses.',
            'année',
            ['semaine', 'heure'],
            ['fr-l-annee', 'fr-le-mois'],
            {
              id: 'fr.ex.g0v0ylsvq9mhkt',
              explanation: 'Año es année (femenino: une année). Con números se dice an: vingt ans.',
            },
          ),
          ex.translationChoice(
            'décembre',
            'diciembre',
            ['noviembre', 'septiembre', 'enero'],
            ['fr-decembre'],
            { id: 'fr.ex.w8jy4k8wzwrz6f' },
          ),
          ex.fillBlank(
            "Le 25 ___, c'est Noël.",
            'El 25 de diciembre es Navidad.',
            'décembre',
            ['novembre', 'octobre', 'juillet'],
            ['fr-decembre'],
            { id: 'fr.ex.ri3xx4rgsoe74l', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "En France, l'école commence en ___.",
            'En Francia, las clases empiezan en septiembre.',
            'septembre',
            ['juillet', 'août', 'décembre'],
            ['fr-septembre'],
            {
              id: 'fr.ex.8nxhyc5izco4d9',
              skill: 'vocabulary',
              explanation:
                'En Francia las vacaciones de verano son en julio y agosto; la escuela empieza en septiembre.',
            },
          ),
          ex.orderWords(
            'Nous allons à Marseille en août.',
            'En agosto vamos a Marsella.',
            ['fr-aout'],
            {
              id: 'fr.ex.e3fj6z4zgwh5pk',
            },
          ),
          ex.translateWrite(
            'Un año tiene doce meses.',
            'Il y a douze mois dans une année.',
            ['fr-l-annee', 'fr-le-mois'],
            {
              id: 'fr.ex.06sva0ycc9uydg',
              acceptedAnswers: ['Une année a douze mois.', "L'année a douze mois."],
            },
          ),
          ex.shortAnswer(
            'Tu vas à Marseille en juillet?',
            '¿Vas a Marsella en julio? (Responde que no, que vas en agosto.)',
            'Non, je vais à Marseille en août.',
            ['Non, en août.', 'Non, je vais en août.', 'Non, je vais à Marseille en août.'],
            ['fr-aout', 'fr-juillet'],
            { id: 'fr.ex.7w93ryhdz9jgcl' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Quelle est la date?',
        objective: 'Preguntar y decir la fecha.',
        intro: {
          explanation:
            "Para preguntar la fecha: quelle est la date? Se responde nous sommes le + número + mes, o c'est le…: nous sommes le 10 mars. No va «de» entre el número y el mes. Sólo el día 1 es distinto: le premier (el primero): le premier mai. Ojo con deux y douze: en douze la vocal es como una u y la z final suena.",
          examples: [
            {
              target: 'Quelle est la date? — Nous sommes le 3 mars.',
              base: '¿Qué fecha es? — Es 3 de marzo.',
            },
            { target: "C'est le premier mai.", base: 'Es primero de mayo.' },
          ],
        },
        takeaways: [
          'Preguntas quelle est la date? y respondes nous sommes le…',
          'Dices le premier para el día 1 y el número para los demás.',
        ],
        exercises: [
          ex.translationChoice(
            'quelle est la date?',
            '¿qué fecha es?',
            ['¿qué hora es?', '¿cuántos años tienes?', '¿cuándo vas?'],
            ['fr-quelle-est-la-date'],
            { id: 'fr.ex.jtr260nd7tp61a' },
          ),
          ex.listenChoice(
            'Nous sommes le deux mai.',
            ['Nous sommes le douze mai.', 'Nous sommes le deux mars.', 'Nous sommes le dix mai.'],
            ['fr-mai'],
            {
              id: 'fr.ex.aj5vnt5m0ejsae',
              explanation: 'Deux termina en vocal; en douze se oye la z final.',
            },
          ),
          ex.fillBlank(
            "C'est le ___ mai.",
            'Es primero de mayo.',
            'premier',
            ['un', 'une', 'première'],
            ['fr-le-premier'],
            {
              id: 'fr.ex.7jm5ndilczcn73',
              explanation: 'El día 1 se dice le premier. Mai es masculino: premier, no première.',
            },
          ),
          ex.fillBlank(
            'Nous sommes ___ 14 juillet.',
            'Hoy es 14 de julio.',
            'le',
            ['la', 'en', 'de'],
            ['fr-juillet'],
            {
              id: 'fr.ex.a5sk6un1yz6jz6',
              explanation: 'La fecha se dice le + número + mes, sin «de»: le 14 juillet.',
            },
          ),
          ex.matchPairs(
            [
              ['le premier mars', 'el 1 de marzo'],
              ['le 14 juillet', 'el 14 de julio'],
              ['le 2 août', 'el 2 de agosto'],
              ['le 12 octobre', 'el 12 de octubre'],
            ],
            ['fr-le-premier', 'fr-mars', 'fr-juillet', 'fr-octobre'],
            { id: 'fr.ex.b4liural7cuet3' },
          ),
          ex.translationChoice(
            'le premier',
            'el primero',
            ['el segundo', 'el mes', 'el año'],
            ['fr-le-premier'],
            { id: 'fr.ex.3xk3wtqvs2kwpd' },
          ),
          ex.orderWords(
            "Quelle est la date aujourd'hui?",
            '¿Qué fecha es hoy?',
            ['fr-quelle-est-la-date'],
            { id: 'fr.ex.uw6kym4r2mbqj6' },
          ),
          ex.fillBlank(
            'Quelle est la ___? — Nous sommes le 5 mars.',
            '¿Qué fecha es? — Es 5 de marzo.',
            'date',
            ['heure', 'mois', 'année'],
            ['fr-quelle-est-la-date', 'fr-mars'],
            { id: 'fr.ex.ccv3n44idiaff4', skill: 'vocabulary' },
          ),
          ex.translateWrite(
            'Hoy es primero de junio.',
            "Aujourd'hui, c'est le premier juin.",
            ['fr-le-premier', 'fr-juin'],
            {
              id: 'fr.ex.sjo2b26chdp0uh',
              acceptedAnswers: [
                'Nous sommes le premier juin.',
                "Aujourd'hui, nous sommes le premier juin.",
                "C'est le premier juin.",
              ],
            },
          ),
          ex.shortAnswer(
            'Quelle est la date?',
            '¿Qué fecha es? (Responde que es 12 de octubre.)',
            'Nous sommes le douze octobre.',
            [
              "C'est le douze octobre.",
              'Le douze octobre.',
              'Nous sommes le 12 octobre.',
              "C'est le 12 octobre.",
              'Le 12 octobre.',
            ],
            ['fr-quelle-est-la-date', 'fr-octobre'],
            { id: 'fr.ex.cruphcawmglheb' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Joyeux anniversaire!',
        objective: 'Preguntar y decir cuándo es un cumpleaños y saludar.',
        intro: {
          explanation:
            "Falso amigo: l'anniversaire es el cumpleaños (masculino, con elisión: l'anniversaire; mi cumpleaños es mon anniversaire). Para preguntar: c'est quand, ton anniversaire? Se responde c'est le 3 mars o c'est en mars. Para saludar a quien cumple años: joyeux anniversaire!",
          examples: [
            {
              target: "C'est quand, ton anniversaire? — C'est le deux juin.",
              base: '¿Cuándo es tu cumpleaños? — Es el 2 de junio.',
            },
            { target: 'Joyeux anniversaire, Léa!', base: '¡Feliz cumpleaños, Léa!' },
          ],
        },
        takeaways: [
          "Preguntas c'est quand, ton anniversaire? y respondes con la fecha.",
          'Saludas con joyeux anniversaire!',
        ],
        exercises: [
          ex.translationChoice(
            "l'anniversaire",
            'el cumpleaños',
            ['el año', 'el mes', 'la fecha'],
            ['fr-l-anniversaire'],
            {
              id: 'fr.ex.wyc6sxb48vcrjf',
              explanation: "Falso amigo: l'anniversaire es el cumpleaños.",
            },
          ),
          ex.translationChoice(
            'joyeux anniversaire!',
            '¡feliz cumpleaños!',
            ['¡feliz año nuevo!', '¡hasta pronto!', '¡muchas gracias!'],
            ['fr-joyeux-anniversaire'],
            { id: 'fr.ex.20322ivh0hq49v' },
          ),
          ex.listenChoice(
            'Joyeux anniversaire, Hugo!',
            ['Joyeux anniversaire, Léa!', 'Au revoir, Hugo!', 'Merci, Hugo!'],
            ['fr-joyeux-anniversaire'],
            { id: 'fr.ex.1vo9hzofzy66d7' },
          ),
          ex.fillBlank(
            "C'est quand, ___ anniversaire?",
            '¿Cuándo es tu cumpleaños?',
            'ton',
            ['ta', 'tu', 'te'],
            ['fr-l-anniversaire'],
            {
              id: 'fr.ex.jrawzabe1mi18y',
              explanation: 'Anniversaire es masculino y empieza con vocal: ton anniversaire.',
            },
          ),
          question(
            'fr.ex.3fhg4kvcmonbs1',
            ANNIVERSAIRE,
            '¿Cuándo es el cumpleaños de Hugo?',
            'El 2 de junio.',
            ['El 12 de junio.', 'El 2 de julio.', 'El 12 de diciembre.'],
            ['fr-l-anniversaire', 'fr-juin'],
            "Hugo responde «C'est le deux juin».",
          ),
          question(
            'fr.ex.82i8em82fvia9f',
            ANNIVERSAIRE,
            '¿Cuándo es el cumpleaños de Léa?',
            'El 12 de diciembre.',
            ['El 2 de diciembre.', 'El 12 de noviembre.', 'El 2 de junio.'],
            ['fr-decembre'],
            "Léa dice «Moi, c'est en décembre, le douze».",
          ),
          question(
            'fr.ex.pqv2dzu887apeq',
            ANNIVERSAIRE,
            '¿Por qué Hugo le dice «Joyeux anniversaire!» a Léa?',
            'Porque hoy es su cumpleaños.',
            [
              'Porque mañana es su cumpleaños.',
              'Porque es el cumpleaños de Hugo.',
              'Porque es año nuevo.',
            ],
            ['fr-joyeux-anniversaire'],
            "Hugo se da cuenta: «Le douze décembre? Mais c'est aujourd'hui!».",
          ),
          ex.orderWords(
            'Mon anniversaire est le 3 mars.',
            'Mi cumpleaños es el 3 de marzo.',
            ['fr-l-anniversaire'],
            {
              id: 'fr.ex.dkwmez24qtk52t',
            },
          ),
          ex.translateWrite(
            '¡Feliz cumpleaños, Marie!',
            'Joyeux anniversaire, Marie!',
            ['fr-joyeux-anniversaire'],
            { id: 'fr.ex.l53m4qxa1bpzgs' },
          ),
          ex.shortAnswer(
            "C'est quand, ton anniversaire?",
            '¿Cuándo es tu cumpleaños? (Responde que es el 1 de agosto.)',
            "C'est le premier août.",
            [
              'Le premier août.',
              "Mon anniversaire, c'est le premier août.",
              'Mon anniversaire est le premier août.',
            ],
            ['fr-l-anniversaire', 'fr-le-premier', 'fr-aout'],
            { id: 'fr.ex.bflduyjxwwatkv' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Fechas francesas',
        objective: 'Entender y decir fechas importantes del año en Francia.',
        intro: {
          explanation:
            'Dos fechas muy francesas: le 14 juillet, la fiesta nacional, con desfile y fuegos artificiales, y le 21 juin, la Fête de la musique, con música gratis en las calles de todo el país. Repaso: en + mes (en juin), le + número + mes (le 21 juin) y le premier para el día 1.',
          examples: [
            {
              target: 'Le 14 juillet, nous sommes à Paris.',
              base: 'El 14 de julio estamos en París.',
            },
            {
              target: "Le 21 juin, c'est la Fête de la musique.",
              base: 'El 21 de junio es la Fiesta de la Música.',
            },
          ],
        },
        takeaways: [
          'Conoces el 14 de julio y la Fête de la musique.',
          'Lees y escribes fechas con le, en y le premier.',
        ],
        exercises: [
          question(
            'fr.ex.b3ay5ej1cutl6s',
            INVITATION,
            '¿Qué día es la fiesta de Marie?',
            'El sábado 21 de junio.',
            ['El domingo 21 de junio.', 'El sábado 1 de junio.', 'El sábado 21 de julio.'],
            ['fr-juin'],
            'El mensaje dice «Samedi 21 juin».',
          ),
          question(
            'fr.ex.6f00a7j36sek9s',
            INVITATION,
            '¿Qué festeja Marie ese día, además de la Fête de la musique?',
            'Su cumpleaños.',
            ['El año nuevo.', 'La fiesta nacional.', 'Nada más.'],
            ['fr-l-anniversaire'],
            "Marie escribe «c'est aussi mon anniversaire!».",
          ),
          question(
            'fr.ex.ap50fwanp6x5bo',
            INVITATION,
            '¿Por qué van a escuchar música en la calle?',
            'Porque el 21 de junio es la Fête de la musique.',
            ['Porque es el cumpleaños de Paul.', 'Porque es el 14 de julio.', 'Porque es domingo.'],
            ['fr-juin'],
            "El 21 de junio, «c'est la Fête de la musique»: hay música en las calles.",
          ),
          ex.listenChoice(
            'Mon anniversaire est le premier juillet.',
            [
              'Mon anniversaire est le premier juin.',
              'Mon anniversaire est le douze juillet.',
              'Mon anniversaire est en juillet.',
            ],
            ['fr-le-premier', 'fr-juillet'],
            { id: 'fr.ex.jrd8oyci2tlwjp' },
          ),
          ex.fillBlank(
            "Le 21 ___, c'est la Fête de la musique.",
            'El 21 de junio es la Fiesta de la Música.',
            'juin',
            ['juillet', 'janvier', 'mai'],
            ['fr-juin'],
            { id: 'fr.ex.uc6tud5zzac3un', skill: 'vocabulary' },
          ),
          ex.matchPairs(
            [
              ['janvier', 'enero'],
              ['avril', 'abril'],
              ['août', 'agosto'],
              ['décembre', 'diciembre'],
            ],
            ['fr-janvier', 'fr-avril', 'fr-aout', 'fr-decembre'],
            { id: 'fr.ex.aaf2h98lxv47a2' },
          ),
          ex.fillBlank(
            'Mon anniversaire est ___ novembre.',
            'Mi cumpleaños es en noviembre.',
            'en',
            ['le', 'au', 'de'],
            ['fr-novembre', 'fr-l-anniversaire'],
            {
              id: 'fr.ex.3yzd4wiy6o2edh',
              explanation: 'Con el mes solo, en: en novembre. Con el día, le: le 3 novembre.',
            },
          ),
          ex.orderWords(
            'Nous sommes le premier septembre.',
            'Hoy es primero de septiembre.',
            ['fr-le-premier', 'fr-septembre'],
            { id: 'fr.ex.nervk8u6mui397' },
          ),
          ex.translateWrite(
            'El 14 de julio estamos en París.',
            'Le 14 juillet, nous sommes à Paris.',
            ['fr-juillet'],
            {
              id: 'fr.ex.hv4er2yw24he1b',
              acceptedAnswers: [
                'Le 14 juillet nous sommes à Paris.',
                'Nous sommes à Paris le 14 juillet.',
              ],
            },
          ),
          ex.shortAnswer(
            "C'est quand, la Fête de la musique?",
            '¿Cuándo es la Fiesta de la Música? (Responde con la fecha.)',
            "C'est le 21 juin.",
            [
              'Le 21 juin.',
              'Le vingt et un juin.',
              "C'est le vingt et un juin.",
              "La Fête de la musique, c'est le 21 juin.",
            ],
            ['fr-juin'],
            { id: 'fr.ex.9zsrb5v9xbuex2' },
          ),
        ],
      },
    ],
  },
};

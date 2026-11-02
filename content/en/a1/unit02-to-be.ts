import { ex } from '../../builders';
import type { UnitDef } from '../../types';

export const unit02: UnitDef = {
  position: 2,
  title: 'Pronombres y verbo to be',
  titleEn: 'Pronouns and the verb to be',
  description: 'Yo, vos, él, ella… y cómo decir quién sos y cómo estás.',
  emoji: '🧍',
  objective:
    'Podés usar los pronombres y el verbo to be para decir quién sos, cómo estás y hablar de otras personas.',
  grammar: {
    title: 'To be: am, is, are',
    explanation:
      'To be es «ser» y «estar» a la vez. I am; you, we y they are; he, she e it is. Para negar se agrega not y para preguntar el verbo va primero.',
    examples: [
      { target: "I'm a student.", base: 'Soy estudiante.' },
      { target: 'She is not tired.', base: 'Ella no está cansada.' },
      { target: 'Are you happy?', base: '¿Estás feliz?' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Estándar nuevo (bloque 1). Pendiente de revisión por alguien con dominio del inglés.',
  },
  words: [
    {
      id: 'en-i',
      text: 'I',
      translation: 'yo',
      ipa: '/aɪ/',
      exampleEn: 'I am Ana.',
      exampleEs: 'Yo soy Ana.',
      tags: ['pronouns'],
    },
    {
      id: 'en-you',
      text: 'you',
      translation: 'tú / vos / usted',
      acceptedTranslations: ['tú', 'vos', 'usted', 'ustedes'],
      ipa: '/ju/',
      exampleEn: 'You are my friend.',
      exampleEs: 'Sos mi amigo.',
      tags: ['pronouns'],
    },
    {
      id: 'en-he',
      text: 'he',
      translation: 'él',
      ipa: '/hi/',
      emoji: '👨',
      exampleEn: 'He is a teacher.',
      exampleEs: 'Él es profesor.',
      tags: ['pronouns'],
    },
    {
      id: 'en-she',
      text: 'she',
      translation: 'ella',
      ipa: '/ʃi/',
      emoji: '👩',
      exampleEn: 'She is happy.',
      exampleEs: 'Ella está feliz.',
      tags: ['pronouns'],
    },
    {
      id: 'en-it',
      text: 'it',
      translation: 'eso / ello (cosa o animal)',
      acceptedTranslations: ['eso'],
      ipa: '/ɪt/',
      emoji: '📱',
      exampleEn: 'It is my phone.',
      exampleEs: 'Es mi teléfono.',
      tags: ['pronouns'],
    },
    {
      id: 'en-we',
      text: 'we',
      translation: 'nosotros / nosotras',
      acceptedTranslations: ['nosotros', 'nosotras'],
      ipa: '/wi/',
      exampleEn: 'We are friends.',
      exampleEs: 'Somos amigos.',
      tags: ['pronouns'],
    },
    {
      id: 'en-they',
      text: 'they',
      translation: 'ellos / ellas',
      acceptedTranslations: ['ellos', 'ellas'],
      ipa: '/ðeɪ/',
      exampleEn: 'They are students.',
      exampleEs: 'Ellos son estudiantes.',
      tags: ['pronouns'],
    },
    {
      id: 'en-am',
      text: 'am',
      translation: 'soy / estoy (con I)',
      ipa: '/æm/',
      exampleEn: 'I am tired.',
      exampleEs: 'Estoy cansado.',
      tags: ['to-be'],
    },
    {
      id: 'en-is',
      text: 'is',
      translation: 'es / está (con he, she, it)',
      ipa: '/ɪz/',
      exampleEn: 'She is a student.',
      exampleEs: 'Ella es estudiante.',
      tags: ['to-be'],
    },
    {
      id: 'en-are',
      text: 'are',
      translation: 'sos / son / están (con you, we, they)',
      ipa: '/ɑr/',
      exampleEn: 'We are happy.',
      exampleEs: 'Estamos felices.',
      tags: ['to-be'],
    },
    {
      id: 'en-not',
      text: 'not',
      translation: 'negación (is not, am not)',
      acceptedTranslations: ['no'],
      ipa: '/nɑt/',
      exampleEn: 'I am not tired.',
      exampleEs: 'No estoy cansado.',
      tags: ['to-be', 'grammar'],
    },
    {
      id: 'en-happy',
      text: 'happy',
      translation: 'feliz',
      acceptedTranslations: ['contento', 'contenta'],
      ipa: '/ˈhæpi/',
      emoji: '😀',
      exampleEn: 'I am happy today.',
      exampleEs: 'Hoy estoy feliz.',
      tags: ['adjectives', 'feelings'],
    },
    {
      id: 'en-tired',
      text: 'tired',
      translation: 'cansado / cansada',
      acceptedTranslations: ['cansado', 'cansada'],
      ipa: '/ˈtaɪərd/',
      emoji: '😴',
      exampleEn: 'You are tired.',
      exampleEs: 'Estás cansado.',
      tags: ['adjectives', 'feelings'],
    },
    {
      id: 'en-student',
      text: 'student',
      translation: 'estudiante',
      ipa: '/ˈstudənt/',
      emoji: '🎓',
      exampleEn: 'She is a student.',
      exampleEs: 'Ella es estudiante.',
      tags: ['people', 'jobs'],
    },
    {
      id: 'en-teacher',
      text: 'teacher',
      translation: 'profesor / profesora',
      acceptedTranslations: ['profesor', 'profesora', 'maestro', 'maestra'],
      ipa: '/ˈtitʃər/',
      emoji: '🧑‍🏫',
      exampleEn: 'He is a teacher.',
      exampleEs: 'Él es profesor.',
      tags: ['people', 'jobs'],
    },
    {
      id: 'en-friend',
      text: 'friend',
      translation: 'amigo / amiga',
      acceptedTranslations: ['amigo', 'amiga'],
      ipa: '/frɛnd/',
      emoji: '🧑‍🤝‍🧑',
      exampleEn: 'Tom is my friend.',
      exampleEs: 'Tom es mi amigo.',
      tags: ['people'],
    },
  ],
  lessons: [
    {
      title: 'Yo, vos, él, ella',
      objective: 'Usar los pronombres I, you, he y she.',
      intro: {
        explanation:
          'I es «yo» y siempre va con mayúscula. You sirve para vos, tú y usted. He es «él» y she, «ella».',
        examples: [
          { target: 'I am Ana.', base: 'Yo soy Ana.' },
          { target: 'She is my friend.', base: 'Ella es mi amiga.' },
        ],
      },
      takeaways: ['Usás I, you, he y she.', 'Escribís I siempre con mayúscula.'],
      exercises: [
        ex.imageChoice('👩', 'she', ['he', 'I', 'you'], ['en-she']),
        ex.imageChoice('👨', 'he', ['she', 'we', 'it'], ['en-he']),
        ex.translationChoice('I', 'yo', ['tú / vos / usted', 'él', 'ella'], ['en-i']),
        ex.translationChoice('you', 'tú / vos / usted', ['yo', 'ella', 'nosotros'], ['en-you'], {
          explanation: 'You sirve para tú, vos, usted y ustedes.',
        }),
        ex.matchPairs(
          [
            ['I', 'yo'],
            ['you', 'tú / vos'],
            ['he', 'él'],
            ['she', 'ella'],
          ],
          ['en-i', 'en-you', 'en-he', 'en-she'],
        ),
        ex.listenChoice('she', ['he', 'I', 'you'], ['en-she']),
        ex.translateWrite('Ella', 'she', ['en-she']),
        ex.translateWrite('Él', 'he', ['en-he']),
      ],
    },
    {
      title: 'Nosotros, ellos y cosas',
      objective: 'Usar we, they e it.',
      intro: {
        explanation:
          'We es «nosotros» y they, «ellos» o «ellas». Para una cosa o un animal se usa it, que en español no se dice.',
        examples: [
          { target: 'We are friends.', base: 'Somos amigos.' },
          { target: 'It is a cat.', base: 'Es un gato.' },
        ],
      },
      takeaways: ['Usás we y they para varias personas.', 'Usás it para cosas y animales.'],
      exercises: [
        ex.translationChoice(
          'we',
          'nosotros / nosotras',
          ['ellos / ellas', 'ella', 'eso'],
          ['en-we'],
        ),
        ex.translationChoice(
          'they',
          'ellos / ellas',
          ['nosotros / nosotras', 'yo', 'él'],
          ['en-they'],
        ),
        ex.imageChoice('📱', 'it', ['he', 'she', 'we'], ['en-it'], {
          explanation: 'Para cosas se usa it.',
        }),
        ex.fillBlank(
          'Ana and I = ___',
          'Ana y yo = nosotras',
          'we',
          ['they', 'he', 'she'],
          ['en-we'],
        ),
        ex.fillBlank(
          'Tom and Ana = ___',
          'Tom y Ana = ellos',
          'they',
          ['we', 'he', 'it'],
          ['en-they'],
        ),
        ex.matchPairs(
          [
            ['we', 'nosotros'],
            ['they', 'ellos'],
            ['it', 'eso (cosa)'],
          ],
          ['en-we', 'en-they', 'en-it'],
        ),
        ex.listenChoice('they', ['we', 'he', 'it'], ['en-they']),
        ex.translateWrite('Nosotros', 'we', ['en-we']),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.translateWrite('Ellos', 'they', ['en-they'], { consolidate: false }),
      ],
    },
    {
      title: 'I am, you are',
      objective: 'Decir cómo estás con am y are.',
      intro: {
        explanation:
          'Con I va am (I am) y con you, are (you are). Al hablar se contraen: I’m, you’re. To be sirve tanto para «ser» como para «estar».',
        examples: [
          { target: 'I am happy.', base: 'Estoy feliz.' },
          { target: "You're tired.", base: 'Estás cansado.' },
        ],
      },
      takeaways: ['Usás I am y you are.', 'Sabés que to be es «ser» y «estar».'],
      exercises: [
        ex.fillBlank(
          'I ___ happy.',
          'Estoy feliz.',
          'am',
          ['is', 'are', 'be'],
          ['en-am', 'en-i', 'en-happy'],
          {
            explanation: 'Con I siempre va am.',
          },
        ),
        ex.fillBlank(
          'You ___ tired.',
          'Estás cansado.',
          'are',
          ['am', 'is', 'be'],
          ['en-are', 'en-you', 'en-tired'],
        ),
        ex.imageChoice('😀', 'happy', ['tired', 'fine', 'sorry'], ['en-happy']),
        ex.imageChoice('😴', 'tired', ['happy', 'good', 'student'], ['en-tired']),
        ex.orderWords('I am happy.', 'Estoy feliz.', ['en-i', 'en-am', 'en-happy']),
        ex.translateWrite('Estoy cansado.', 'I am tired.', ['en-am', 'en-tired']),
        ex.fillBlank(
          'We ___ happy.',
          'Estamos felices.',
          'are',
          ['am', 'is', 'be'],
          ['en-are', 'en-we'],
        ),
        ex.matchPairs(
          [
            ['I', 'am'],
            ['he', 'is'],
            ['they', 'are'],
          ],
          ['en-am', 'en-is', 'en-are'],
          {
            explanation: 'I am · he/she/it is · you/we/they are.',
          },
        ),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.listenChoice(
          "I'm tired",
          ["I'm happy", "you're tired", "I'm a student"],
          ['en-am', 'en-tired'],
          { consolidate: false },
        ),
        ex.translateWrite('Estoy feliz.', "I'm happy.", ['en-am', 'en-happy'], {
          acceptedAnswers: ['I am happy.'],
          consolidate: false,
        }),
        ex.translateWrite('Estás cansada.', "You're tired.", ['en-are', 'en-tired'], {
          acceptedAnswers: ['You are tired.'],
          consolidate: false,
        }),
      ],
    },
    {
      title: 'He is, she is',
      objective: 'Hablar de otras personas con is.',
      intro: {
        explanation:
          'Con he, she e it el verbo es is: he is, she is, it is. Al hablar se contrae: he’s, she’s.',
        examples: [
          { target: 'He is a teacher.', base: 'Él es profesor.' },
          { target: "She's my friend.", base: 'Ella es mi amiga.' },
        ],
      },
      takeaways: ['Usás is con he, she e it.', 'Presentás a otra persona con he is o she is.'],
      exercises: [
        ex.fillBlank(
          'She ___ a teacher.',
          'Ella es profesora.',
          'is',
          ['am', 'are', 'be'],
          ['en-is', 'en-she', 'en-teacher'],
        ),
        ex.fillBlank(
          'He ___ my friend.',
          'Él es mi amigo.',
          'is',
          ['am', 'are', 'be'],
          ['en-is', 'en-he', 'en-friend'],
        ),
        ex.imageChoice('🎓', 'student', ['teacher', 'friend', 'name'], ['en-student']),
        ex.imageChoice('🧑‍🏫', 'teacher', ['student', 'friend', 'happy'], ['en-teacher']),
        ex.translationChoice(
          'friend',
          'amigo / amiga',
          ['profesor / profesora', 'estudiante', 'nombre'],
          ['en-friend'],
        ),
        ex.orderWords(
          'She is a student.',
          'Ella es estudiante.',
          ['en-she', 'en-is', 'en-student'],
          {
            explanation: 'En inglés se pone a antes de una profesión: a student, a teacher.',
          },
        ),
        ex.translateWrite('Él es profesor.', 'He is a teacher.', ['en-he', 'en-is', 'en-teacher'], {
          explanation: 'No olvides el artículo: a teacher.',
        }),
        ex.listenChoice(
          'He is my friend.',
          ['She is my friend.', 'He is a teacher.', 'I am your friend.'],
          ['en-he', 'en-friend'],
        ),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.translateWrite(
          'Ella es profesora.',
          'She is a teacher.',
          ['en-she', 'en-is', 'en-teacher'],
          { acceptedAnswers: ["She's a teacher."], consolidate: false },
        ),
        ex.translateWrite('Él es mi amigo.', 'He is my friend.', ['en-he', 'en-is', 'en-friend'], {
          acceptedAnswers: ["He's my friend."],
          consolidate: false,
        }),
      ],
    },
    {
      title: 'Negar y preguntar',
      objective: 'Formar oraciones negativas y preguntas con to be.',
      intro: {
        explanation:
          'Para negar, not va después de to be: I am not, she is not (isn’t). Para preguntar, el verbo va primero: Are you tired?',
        examples: [
          { target: "I'm not tired.", base: 'No estoy cansado.' },
          { target: 'Is she a student?', base: '¿Ella es estudiante?' },
        ],
      },
      takeaways: [
        'Negás con not después de am, is o are.',
        'Preguntás poniendo el verbo primero: Are you…?',
      ],
      exercises: [
        ex.fillBlank(
          'I am ___ tired.',
          'No estoy cansado.',
          'not',
          ['no', 'yes', 'is'],
          ['en-not'],
          {
            explanation: 'Para negar con to be se usa not después del verbo: I am not.',
          },
        ),
        ex.orderWords(
          'She is not a teacher.',
          'Ella no es profesora.',
          ['en-not', 'en-she', 'en-teacher'],
          {
            acceptedAnswers: ["She isn't a teacher."],
          },
        ),
        ex.translateWrite('Él no es estudiante.', 'He is not a student.', ['en-not', 'en-student']),
        ex.fillBlank(
          '___ you happy?',
          '¿Estás feliz?',
          'Are',
          ['Is', 'Am', 'Do'],
          ['en-are', 'en-happy'],
          {
            explanation: 'En las preguntas el verbo va antes del sujeto: Are you…?',
          },
        ),
        ex.orderWords('Are you a student?', '¿Sos estudiante?', ['en-are', 'en-student']),
        ex.shortAnswer(
          'Are you a teacher?',
          '¿Sos profesor/a? (respondé sí o no con una respuesta corta)',
          'No, I am not.',
          ['Yes, I am.', "No, I'm not."],
          ['en-am', 'en-not'],
          {
            explanation: 'En respuestas cortas se repite el verbo: Yes, I am / No, I am not.',
          },
        ),
        ex.translationChoice('not', 'negación (is not, am not)', ['sí', 'y', 'de'], ['en-not']),
        ex.listenChoice(
          'Is she happy?',
          ['She is happy.', 'Is he happy?', 'Are you happy?'],
          ['en-is', 'en-happy'],
        ),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.translateWrite('No estoy cansado.', "I'm not tired.", ['en-am', 'en-not', 'en-tired'], {
          acceptedAnswers: ['I am not tired.'],
          consolidate: false,
        }),
        ex.translateWrite('¿Sos estudiante?', 'Are you a student?', ['en-are', 'en-student'], {
          consolidate: false,
        }),
      ],
    },
  ],
};

import { ex } from '../../builders';
import type { PlannedWrittenUnitDef, WordDef } from '../../types';
import { EN_A1_PLANNED_UNITS } from './context-planned';

/**
 * Fase C.3 (docs/LEARNING_PHASE_C.md §C3): lecciones escritas L1–L5 de U13 «Letras y datos
 * personales» (docs/polygo-ingles-a1-mapa-curricular.md §3, bloque 1: va después de U3).
 *
 * Vocabulario previo: U1–U3. Lo demás lo enseña la unidad: sus palabras y cinco que reutiliza de
 * unidades ya cargadas porque el mapa las adelanta (`borrowed`): `what` y los idiomas `Spanish` y
 * `English` (U12), `city` (U10) y `email` (A2 U10). Todos los datos personales son de la persona
 * ficticia del catálogo (Sofia Ruiz, content/personas.ts): nunca se piden datos del alumno (P4).
 *
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni de hablantes nativos. Se carga sin publicar.
 */

const meta = EN_A1_PLANNED_UNITS.find((u) => u.position === 13)!;

/** Persona ficticia cuyos datos (nombre, ciudad, teléfono, correo) aparecen en L4 y L5. */
const GUEST = { persona: 'en.persona.sofia-ruiz' } as const;

const words: WordDef[] = [
  {
    id: 'en-alphabet',
    text: 'alphabet',
    translation: 'alfabeto',
    acceptedTranslations: ['abecedario'],
    ipa: '/ˈælfəˌbɛt/',
    emoji: '🔤',
    exampleEn: 'A, B, C: the alphabet.',
    exampleEs: 'A, B, C: el alfabeto.',
    tags: ['alphabet'],
  },
  {
    id: 'en-letter',
    text: 'letter',
    translation: 'letra',
    ipa: '/ˈlɛtər/',
    emoji: '🅰️',
    exampleEn: 'A is a letter.',
    exampleEs: 'La A es una letra.',
    tags: ['alphabet'],
  },
  {
    id: 'en-spell',
    text: 'spell',
    translation: 'deletrear',
    ipa: '/spɛl/',
    exampleEn: 'Please spell your name.',
    exampleEs: 'Por favor, deletreá tu nombre.',
    tags: ['alphabet', 'verbs'],
  },
  {
    id: 'en-how-do-you-spell-it',
    text: 'how do you spell it',
    translation: '¿cómo se escribe?',
    acceptedTranslations: ['¿cómo se deletrea?'],
    ipa: '/haʊ du ju ˈspɛl ɪt/',
    exampleEn: 'Garcia? How do you spell it?',
    exampleEs: '¿García? ¿Cómo se escribe?',
    tags: ['alphabet', 'questions'],
  },
  {
    id: 'en-double',
    text: 'double',
    translation: 'doble',
    ipa: '/ˈdʌbəl/',
    exampleEn: 'Ross is R-O-double S.',
    exampleEs: 'Ross se escribe R-O-doble S.',
    tags: ['alphabet'],
  },
  {
    id: 'en-nationality',
    text: 'nationality',
    translation: 'nacionalidad',
    ipa: '/ˌnæʃəˈnæləti/',
    emoji: '🛂',
    exampleEn: 'What is your nationality?',
    exampleEs: '¿Cuál es tu nacionalidad?',
    tags: ['nationalities', 'personal-details'],
  },
  {
    id: 'en-argentinian',
    text: 'Argentinian',
    translation: 'argentino / argentina',
    acceptedTranslations: ['argentino'],
    acceptedTexts: ['Argentine'],
    ipa: '/ˌɑrdʒənˈtɪniən/',
    exampleEn: 'Pedro is Argentinian.',
    exampleEs: 'Pedro es argentino.',
    tags: ['nationalities'],
  },
  {
    id: 'en-mexican',
    text: 'Mexican',
    translation: 'mexicano / mexicana',
    acceptedTranslations: ['mexicano'],
    ipa: '/ˈmɛksɪkən/',
    exampleEn: 'We are Mexican.',
    exampleEs: 'Somos mexicanos.',
    tags: ['nationalities'],
  },
  {
    id: 'en-american',
    text: 'American',
    translation: 'estadounidense',
    acceptedTranslations: ['norteamericano', 'norteamericana'],
    ipa: '/əˈmɛrɪkən/',
    exampleEn: 'Tom is American.',
    exampleEs: 'Tom es estadounidense.',
    tags: ['nationalities'],
  },
  {
    id: 'en-number',
    text: 'number',
    translation: 'número',
    ipa: '/ˈnʌmbər/',
    emoji: '🔢',
    exampleEn: 'Seven is a number.',
    exampleEs: 'El siete es un número.',
    tags: ['personal-details', 'numbers'],
  },
  {
    id: 'en-phone-number',
    text: 'phone number',
    translation: 'número de teléfono',
    ipa: '/ˈfoʊn ˌnʌmbər/',
    emoji: '📞',
    exampleEn: 'What is your phone number?',
    exampleEs: '¿Cuál es tu número de teléfono?',
    tags: ['personal-details'],
  },
  {
    id: 'en-address',
    text: 'address',
    translation: 'dirección',
    acceptedTranslations: ['domicilio'],
    ipa: '/ˈædrɛs/',
    emoji: '🏠',
    exampleEn: 'What is your address?',
    exampleEs: '¿Cuál es tu dirección?',
    tags: ['personal-details'],
  },
  {
    id: 'en-form',
    text: 'form',
    translation: 'formulario',
    ipa: '/fɔrm/',
    emoji: '📝',
    exampleEn: 'Form: name, surname, nationality.',
    exampleEs: 'Formulario: nombre, apellido, nacionalidad.',
    tags: ['personal-details'],
  },
  {
    id: 'en-first-name',
    text: 'first name',
    translation: 'nombre de pila',
    ipa: '/ˈfɜrst ˌneɪm/',
    exampleEn: 'My first name is Ana.',
    exampleEs: 'Mi nombre de pila es Ana.',
    tags: ['personal-details'],
  },
  {
    id: 'en-surname',
    text: 'surname',
    translation: 'apellido',
    acceptedTexts: ['last name'],
    ipa: '/ˈsɜrˌneɪm/',
    exampleEn: 'My surname is Garcia.',
    exampleEs: 'Mi apellido es García.',
    tags: ['personal-details'],
  },
  {
    id: 'en-age',
    text: 'age',
    translation: 'edad',
    ipa: '/eɪdʒ/',
    exampleEn: 'Age: twenty.',
    exampleEs: 'Edad: veinte.',
    tags: ['personal-details'],
  },
];

export const EN_A1_U13: PlannedWrittenUnitDef = {
  borrowed: ['en-what', 'en-spanish', 'en-english', 'en-email', 'en-city'],
  names: ['ana', 'tom', 'pedro', 'ross', 'garcia', 'sofia', 'ruiz', 'puebla', 'example', 'com'],
  curriculum: [
    { primary: ['v02'], secondary: ['cL01'] },
    { primary: ['v02'], secondary: ['cL02'] },
    { primary: ['v02'], secondary: ['g02'] },
    { primary: ['v02', 'v03'], secondary: [] },
    { primary: ['p01'], secondary: ['cR01'] },
  ],
  unit: {
    position: meta.position,
    title: meta.title,
    titleEn: meta.titleEn,
    description: meta.description,
    emoji: meta.emoji,
    objective: meta.objective,
    review: {
      status: 'draft',
      notes:
        'Fase C.3: L1–L5 nuevas del mapa curricular. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words,
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'El alfabeto',
        objective: 'Reconocer las letras del alfabeto inglés por su nombre.',
        intro: {
          explanation:
            'Las letras se escriben igual que en español, pero sus nombres suenan distinto: la A se dice «éi», la E «i» y la I «ái». Las que más se confunden son la E y la I, y la G («yi») y la J («yéi»).',
          examples: [
            { target: 'A, E, I.', base: 'A, E, I (se dicen «éi», «i», «ái»).' },
            { target: 'My name is Ana: A-N-A.', base: 'Me llamo Ana: A-N-A.' },
          ],
        },
        takeaways: [
          'Reconocés las letras del alfabeto inglés por su nombre.',
          'Distinguís de oído la E de la I y la G de la J.',
        ],
        exercises: [
          ex.translationChoice(
            'alphabet',
            'alfabeto',
            ['letra', 'nombre', 'número'],
            ['en-alphabet'],
            {
              id: 'en.ex.vkxgh06r6bc6iw',
            },
          ),
          ex.translationChoice(
            'letter',
            'letra',
            ['palabra', 'alfabeto', 'nombre'],
            ['en-letter'],
            {
              id: 'en.ex.9gnev60wc9ou3m',
            },
          ),
          ex.matchPairs(
            [
              ['A', '«éi»'],
              ['E', '«i»'],
              ['I', '«ái»'],
              ['Y', '«uái»'],
            ],
            ['en-letter'],
            { id: 'en.ex.kacsnw4t7r6as3' },
          ),
          ex.listenChoice('E', ['I', 'A', 'Y'], ['en-letter'], {
            id: 'en.ex.myq2dyfc3v9qf2',
            explanation: 'En inglés la E se dice «i» y la I se dice «ái».',
          }),
          ex.listenChoice('G', ['J', 'E', 'C'], ['en-letter'], {
            id: 'en.ex.t8iu38nfjt4s3a',
            explanation: 'La G se dice «yi» y la J, «yéi».',
          }),
          ex.listenChoice('A, E, I', ['E, A, I', 'I, E, A', 'A, I, E'], ['en-letter'], {
            id: 'en.ex.57k3ig4wn5vwpq',
          }),
          ex.fillBlank('A, B, C, ___, E', 'A, B, C, D, E', 'D', ['G', 'T', 'P'], ['en-alphabet'], {
            id: 'en.ex.05xbv9khql67m7',
            skill: 'vocabulary',
          }),
          ex.completeWord('al_h_b_t', 'alphabet', 'alfabeto', ['en-alphabet'], {
            id: 'en.ex.n9mgpmg6wo0vme',
            explanation: 'Alphabet se escribe con ph, que suena como f.',
          }),
          ex.translateWrite('Letra', 'letter', ['en-letter'], { id: 'en.ex.nyzbfdx3wsv1g7' }),
          ex.translateWrite('El alfabeto', 'the alphabet', ['en-alphabet'], {
            id: 'en.ex.14uvnxsmqm2k1s',
            acceptedAnswers: ['alphabet'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Deletrear',
        objective: 'Pedir que alguien deletree y entender un nombre deletreado.',
        intro: {
          explanation:
            'Para pedir que te deletreen una palabra se pregunta How do you spell it? (¿cómo se escribe?). Se responde letra por letra, y dos letras iguales seguidas se dicen con double: Ross es R-O-double S.',
          examples: [
            { target: 'How do you spell it?', base: '¿Cómo se escribe?' },
            { target: 'Ross: R-O-double S.', base: 'Ross: R-O-doble S.' },
          ],
        },
        takeaways: [
          'Preguntás cómo se escribe algo con How do you spell it?',
          'Deletreás un nombre y usás double para las letras repetidas.',
        ],
        exercises: [
          ex.translationChoice(
            'How do you spell it?',
            '¿Cómo se escribe?',
            ['¿Cómo estás?', '¿Cuántos años tenés?', '¿De dónde sos?'],
            ['en-how-do-you-spell-it'],
            { id: 'en.ex.94ynk81pklno83' },
          ),
          ex.translationChoice('spell', 'deletrear', ['leer', 'escuchar', 'contar'], ['en-spell'], {
            id: 'en.ex.376fkb71f2dbn2',
          }),
          ex.listenChoice(
            'How do you spell it?',
            ['How old are you?', 'How are you?', 'Where are you from?'],
            ['en-how-do-you-spell-it'],
            { id: 'en.ex.9x7nlu68ef1nzn' },
          ),
          ex.listenChoice(
            'G-A-R-C-I-A',
            ['J-A-R-C-I-A', 'G-A-R-S-I-A', 'G-E-R-C-I-A'],
            ['en-spell'],
            {
              id: 'en.ex.a7x6v0spde0crk',
              explanation: 'G se dice «yi» y J, «yéi»; C se dice «si» y S, «es».',
            },
          ),
          ex.fillBlank(
            'How do you ___ it?',
            '¿Cómo se escribe?',
            'spell',
            ['name', 'meet', 'from'],
            ['en-spell', 'en-how-do-you-spell-it'],
            { id: 'en.ex.9ard87z629uh6b' },
          ),
          ex.fillBlank(
            'Ross: R-O-___ S.',
            'Ross: R-O-doble S.',
            'double',
            ['two', 'spell', 'letter'],
            ['en-double'],
            {
              id: 'en.ex.anlxoplzrjrsrj',
              explanation: 'Dos letras iguales seguidas se dicen con double: double S.',
            },
          ),
          ex.matchPairs(
            [
              ['spell', 'deletrear'],
              ['letter', 'letra'],
              ['double', 'doble'],
              ['alphabet', 'alfabeto'],
            ],
            ['en-spell', 'en-letter', 'en-double', 'en-alphabet'],
            { id: 'en.ex.opfcvcer5erc92' },
          ),
          ex.orderWords(
            'How do you spell your name?',
            '¿Cómo se escribe tu nombre?',
            ['en-how-do-you-spell-it', 'en-your', 'en-name'],
            { id: 'en.ex.ocm9nsdscf4aqx' },
          ),
          ex.shortAnswer(
            'My name is Ana. How do you spell it?',
            'Me llamo Ana. ¿Cómo se escribe?',
            'A-N-A',
            ['A N A', 'ANA'],
            ['en-spell', 'en-how-do-you-spell-it'],
            { id: 'en.ex.jtaylxtvyixy55', explanation: 'Se deletrea letra por letra: A-N-A.' },
          ),
          ex.translateWrite(
            '¿Cómo se escribe tu nombre?',
            'How do you spell your name?',
            ['en-how-do-you-spell-it', 'en-your', 'en-name'],
            { id: 'en.ex.852p8cgm11hisx' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Nacionalidades',
        objective: 'Decir la nacionalidad y preguntar la de otra persona.',
        intro: {
          explanation:
            'El país es Mexico; la nacionalidad, Mexican. En inglés las nacionalidades van siempre con mayúscula: I am Argentinian. Spanish y English son también los nombres de los idiomas. Para preguntarla: What is your nationality?',
          examples: [
            { target: 'I am Mexican.', base: 'Soy mexicano.' },
            { target: 'She is from Spain. She is Spanish.', base: 'Es de España. Es española.' },
            { target: 'What is your nationality?', base: '¿Cuál es tu nacionalidad?' },
          ],
        },
        takeaways: [
          'Decís la nacionalidad con to be y mayúscula: I am Argentinian.',
          'Preguntás la nacionalidad con What is your nationality?',
        ],
        exercises: [
          ex.translationChoice(
            'nationality',
            'nacionalidad',
            ['país', 'nombre', 'ciudad'],
            ['en-nationality'],
            { id: 'en.ex.slizuckm185lp7' },
          ),
          ex.fillBlank(
            'I am from Argentina. I am ___.',
            'Soy de Argentina. Soy argentino.',
            'Argentinian',
            ['Argentina', 'Mexican', 'American'],
            ['en-argentinian'],
            {
              id: 'en.ex.w7su3bq4cby6rh',
              explanation: 'Argentina es el país; Argentinian, la nacionalidad.',
            },
          ),
          ex.fillBlank(
            'Tom is from the United States. He is ___.',
            'Tom es de Estados Unidos. Es estadounidense.',
            'American',
            ['English', 'Mexican', 'Spanish'],
            ['en-american'],
            { id: 'en.ex.3xay6j8gricwwb' },
          ),
          ex.translationChoice(
            'Spanish',
            'español',
            ['inglés', 'mexicano', 'argentino'],
            ['en-spanish'],
            {
              id: 'en.ex.7b4u59oxhwnlm2',
              explanation: 'Spanish es la nacionalidad (español, española) y también el idioma.',
            },
          ),
          ex.listenChoice(
            'She is English.',
            ['She is Spanish.', 'He is English.', 'She is American.'],
            ['en-english'],
            { id: 'en.ex.4lzmfy0pxgsvbe' },
          ),
          ex.listenChoice(
            'We are Mexican.',
            ['We are from Mexico.', 'They are Mexican.', 'We are American.'],
            ['en-mexican'],
            { id: 'en.ex.nsnmbca7fil16l' },
          ),
          ex.matchPairs(
            [
              ['Mexican', 'mexicano'],
              ['Argentinian', 'argentino'],
              ['American', 'estadounidense'],
              ['Spanish', 'español'],
            ],
            ['en-mexican', 'en-argentinian', 'en-american', 'en-spanish'],
            { id: 'en.ex.ze7vtv6jjljnoz' },
          ),
          ex.orderWords(
            'What is your nationality?',
            '¿Cuál es tu nacionalidad?',
            ['en-what', 'en-nationality', 'en-your'],
            {
              id: 'en.ex.wojmqecv53b8oz',
              explanation:
                'What is your…? pide un dato: What is your name? What is your nationality?',
            },
          ),
          ex.shortAnswer(
            'Pedro is from Argentina. Is he Argentinian?',
            'Pedro es de Argentina. ¿Es argentino?',
            'Yes, he is.',
            ['Yes.', 'Yes, he is Argentinian.', "Yes, he's Argentinian."],
            ['en-argentinian'],
            { id: 'en.ex.gt29gwdkwt14qj' },
          ),
          ex.translateWrite('Soy mexicano.', 'I am Mexican.', ['en-mexican'], {
            id: 'en.ex.7art88kkf5hl5d',
            acceptedAnswers: ["I'm Mexican."],
            explanation: 'Las nacionalidades van con mayúscula y con to be: I am Mexican.',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Teléfono, email y dirección',
        objective: 'Entender y pedir un número de teléfono, un correo y una dirección.',
        intro: {
          explanation:
            'Para pedir un dato se usa What is your…?: What is your phone number? What is your email? What is your address? Los números de teléfono se dicen cifra por cifra. Los datos de esta lección son de Sofia Ruiz, una persona inventada.',
          examples: [
            { target: 'What is your phone number?', base: '¿Cuál es tu número de teléfono?' },
            { target: 'What is your email?', base: '¿Cuál es tu correo electrónico?' },
          ],
        },
        takeaways: [
          'Pedís un teléfono, un correo o una dirección con What is your…?',
          'Reconocés un número de teléfono y un correo en un texto.',
        ],
        exercises: [
          ex.translationChoice(
            'phone number',
            'número de teléfono',
            ['dirección', 'correo electrónico', 'nombre'],
            ['en-phone-number'],
            { id: 'en.ex.ztxvamaddo6itx' },
          ),
          ex.translationChoice(
            'address',
            'dirección',
            ['número', 'país', 'nacionalidad'],
            ['en-address'],
            {
              id: 'en.ex.gc095jxk1p44x9',
            },
          ),
          ex.translationChoice(
            'number',
            'número',
            ['letra', 'nombre', 'dirección'],
            ['en-number'],
            {
              id: 'en.ex.0er5newwnz1p8e',
            },
          ),
          ex.fillBlank(
            'Sofia: My ___ is 555-0142.',
            'Sofia: Mi número de teléfono es 555-0142.',
            'phone number',
            ['email', 'address', 'nationality'],
            ['en-phone-number'],
            { id: 'en.ex.x9jwhytdddkyvq', personalData: GUEST },
          ),
          ex.fillBlank(
            'Sofia: My ___ is sofia.ruiz@example.com.',
            'Sofia: Mi correo electrónico es sofia.ruiz@example.com.',
            'email',
            ['phone number', 'address', 'name'],
            ['en-email'],
            { id: 'en.ex.nliill22f8stt5', personalData: GUEST },
          ),
          ex.listenChoice(
            'What is your phone number?',
            ['What is your address?', 'What is your email?', 'What is your name?'],
            ['en-phone-number', 'en-what'],
            { id: 'en.ex.j7a4d5hat6odi1' },
          ),
          ex.listenChoice(
            'What is your address?',
            ['What is your nationality?', 'Where are you from?', 'What is your number?'],
            ['en-address', 'en-what'],
            { id: 'en.ex.s6jvjjpj881doh' },
          ),
          ex.orderWords(
            'What is your email?',
            '¿Cuál es tu correo electrónico?',
            ['en-what', 'en-email'],
            {
              id: 'en.ex.f7whne290hik42',
            },
          ),
          ex.shortAnswer(
            "Phone: 555-0142. What is Sofia's phone number?",
            'Teléfono: 555-0142. ¿Cuál es el número de teléfono de Sofia?',
            '555-0142',
            ['5550142', '555 0142', 'It is 555-0142.', "It's 555-0142."],
            ['en-phone-number'],
            { id: 'en.ex.tt7idydf6irslm', personalData: GUEST },
          ),
          ex.translateWrite(
            '¿Cuál es tu dirección?',
            'What is your address?',
            ['en-what', 'en-address'],
            {
              id: 'en.ex.skjjunh35uiitu',
              acceptedAnswers: ["What's your address?"],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Completar un formulario',
        objective: 'Completar y leer un formulario con datos personales.',
        intro: {
          explanation:
            'Un formulario (form) pide los datos campo por campo: First name es el nombre de pila; Surname, el apellido; Age, la edad, y City, la ciudad. Se completa con el dato solo, sin oración: Surname: Ruiz. Practicás con el formulario de Sofia Ruiz, una persona inventada.',
          examples: [
            { target: 'First name: Sofia. Surname: Ruiz.', base: 'Nombre: Sofia. Apellido: Ruiz.' },
            { target: 'What is your surname?', base: '¿Cuál es tu apellido?' },
          ],
        },
        takeaways: [
          'Entendés los campos de un formulario: first name, surname, age, city.',
          'Sacás de un formulario el dato que te piden.',
        ],
        exercises: [
          ex.translationChoice(
            'surname',
            'apellido',
            ['nombre de pila', 'edad', 'ciudad'],
            ['en-surname'],
            { id: 'en.ex.uqvcn5xnsqvs5k' },
          ),
          ex.translationChoice('form', 'formulario', ['carta', 'letra', 'dirección'], ['en-form'], {
            id: 'en.ex.hmdechufyks3ue',
          }),
          ex.matchPairs(
            [
              ['first name', 'nombre de pila'],
              ['surname', 'apellido'],
              ['age', 'edad'],
              ['city', 'ciudad'],
            ],
            ['en-first-name', 'en-surname', 'en-age', 'en-city'],
            { id: 'en.ex.phu3juifvi8c2k' },
          ),
          ex.fillBlank(
            'First name: Sofia. ___: Ruiz.',
            'Nombre de pila: Sofia. Apellido: Ruiz.',
            'Surname',
            ['City', 'Age', 'Country'],
            ['en-surname'],
            { id: 'en.ex.wkh0334zpoc1io', personalData: GUEST },
          ),
          ex.fillBlank(
            'Sofia Ruiz. ___: 29. City: Puebla.',
            'Sofia Ruiz. Edad: 29. Ciudad: Puebla.',
            'Age',
            ['Phone number', 'Surname', 'Nationality'],
            ['en-age'],
            { id: 'en.ex.9wxaqh7tjknq9o', personalData: GUEST },
          ),
          ex.listenChoice(
            'What is your first name?',
            ['What is your surname?', 'What is your nationality?', 'What is your phone number?'],
            ['en-first-name', 'en-what'],
            { id: 'en.ex.5wrj7pu0qga1aw' },
          ),
          ex.completeWord('su_n_m_', 'surname', 'apellido', ['en-surname'], {
            id: 'en.ex.kjtbaibza6gba2',
          }),
          ex.shortAnswer(
            'First name: Sofia. Surname: Ruiz. City: Puebla. Country: Mexico. Where is Sofia from?',
            'Nombre: Sofia. Apellido: Ruiz. Ciudad: Puebla. País: México. ¿De dónde es Sofia?',
            'She is from Puebla, Mexico.',
            [
              'She is from Puebla.',
              "She's from Puebla.",
              "She's from Puebla, Mexico.",
              'From Puebla.',
              'From Puebla, Mexico.',
              'Puebla.',
              'Puebla, Mexico.',
              'She is from Mexico.',
              'From Mexico.',
            ],
            ['en-city'],
            {
              id: 'en.ex.w24m529yyy0beg',
              personalData: GUEST,
              explanation: 'City: Puebla y Country: Mexico. Sofia es de Puebla, en México.',
            },
          ),
          ex.shortAnswer(
            "First name: Sofia. Surname: Ruiz. Age: 29. What is Sofia's surname?",
            'Nombre: Sofia. Apellido: Ruiz. Edad: 29. ¿Cuál es el apellido de Sofia?',
            'Ruiz.',
            ['It is Ruiz.', "It's Ruiz.", 'Her surname is Ruiz.'],
            ['en-surname', 'en-first-name'],
            {
              id: 'en.ex.ak43krdblu5duu',
              personalData: GUEST,
              explanation: 'Surname es el apellido (Ruiz); First name, el nombre de pila (Sofia).',
            },
          ),
          ex.translateWrite(
            '¿Cuál es tu apellido?',
            'What is your surname?',
            ['en-what', 'en-surname'],
            {
              id: 'en.ex.bml6gy5yc5jqyh',
              acceptedAnswers: [
                "What's your surname?",
                'What is your last name?',
                "What's your last name?",
              ],
            },
          ),
        ],
      },
    ],
  },
};

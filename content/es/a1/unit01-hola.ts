import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U1 «Greetings and introductions» (docs/ES_A1_A2.md): saludar y despedirse según la hora,
 * agradecer, preguntar cómo está alguien con vos o con usted y presentarse con me llamo.
 * Pronunciación: las cinco vocales (cortas y siempre iguales) y la h muda (hola, hasta luego).
 * Cultura: en la Argentina se saluda con un beso en la mejilla, también entre hombres.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const KIOSCO = dialogue(
  'es.stim.a1-u1-kiosco',
  'A customer walks into a small corner shop in the morning.',
  [
    ['Lucía', '¡Buen día, señor!'],
    ['Juan', 'Buen día, señora. ¿Cómo está?'],
    ['Lucía', 'Muy bien, gracias. ¿Y usted?'],
    ['Juan', 'Bien, gracias.'],
  ],
  ES_A1_RATE,
);

const FIESTA = dialogue(
  'es.stim.a1-u1-fiesta',
  'Two young people meet at a friend’s party.',
  [
    ['Martín', '¡Hola! Me llamo Martín. ¿Cómo te llamás?'],
    ['Sofía', 'Hola, Martín. Me llamo Sofía.'],
    ['Martín', '¡Mucho gusto, Sofía! ¿Cómo estás?'],
    ['Sofía', 'Muy bien. ¿Y vos?'],
    ['Martín', 'Bien, bien.'],
  ],
  ES_A1_RATE,
);

const MENSAJE = reading(
  'es.stim.a1-u1-mensaje',
  'message',
  'A text message from Camila to her friend Tomás.',
  ['¡Hola, Tomás!', '¿Cómo estás?', '¡Muchas gracias!', 'Hasta luego.', 'Camila'],
  { from: 'Camila', to: 'Tomás' },
);

export const ES_A1_U01: EsUnitDef = {
  names: [
    'Lucía',
    'Juan',
    'Martín',
    'Sofía',
    'Camila',
    'Tomás',
    'Ana',
    'Diego',
    'Mateo',
    'Valentina',
  ],
  support: ['muy', 'está', 'estoy'],
  unit: {
    position: 1,
    title: 'Greetings and introductions',
    titleEn: '¡Hola!',
    description:
      'Say hello and goodbye at any time of day, say thank you and please, ask how someone is with vos or usted, and say your name.',
    emoji: '👋',
    objective:
      'You can greet people and say goodbye depending on the time and the person, ask how someone is, introduce yourself and say your name.',
    grammar: {
      title: 'Vos and usted · me llamo',
      explanation:
        'Spanish has two ways of saying “you”. In Argentina you use vos with friends, family and people your age (¿cómo estás?, ¿y vos?) and usted with strangers, older people or in a shop (¿cómo está?, ¿y usted?), often together with señor or señora. In Spain and in much of Latin America people say tú instead of vos; you will understand it, but this course teaches vos, the form you hear in Buenos Aires. To say your name: me llamo + name. Spanish vowels are short and always sound the same (a, e, i, o, u), and the letter h is never pronounced: hola, hasta luego.',
      examples: [
        {
          target: '¡Hola! ¿Cómo estás? — Bien, ¿y vos?',
          base: 'Hi! How are you? — Fine, and you?',
        },
        { target: 'Buen día, señora. ¿Cómo está?', base: 'Good morning, madam. How are you?' },
        { target: 'Me llamo Ana. Mucho gusto.', base: 'My name is Ana. Nice to meet you.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U1). Sin revisión nativa: revisar «buen día» (lo habitual en la Argentina, frente a «buenos días», que se acepta) y el uso de «chau» también para saludar al pasar.',
    },
    words: [
      w('es-hola', 'hola', 'hello', '¡Hola, Martín!', 'Hi, Martín!', ['greetings'], {
        acceptedTranslations: ['hi'],
        emoji: '👋',
      }),
      w(
        'es-buen-dia',
        'buen día',
        'good morning',
        'Buen día, señora.',
        'Good morning, madam.',
        ['greetings'],
        { acceptedTexts: ['buenos días'], emoji: '🌅' },
      ),
      w(
        'es-buenas-tardes',
        'buenas tardes',
        'good afternoon',
        'Buenas tardes, señor.',
        'Good afternoon, sir.',
        ['greetings'],
      ),
      w(
        'es-buenas-noches',
        'buenas noches',
        'good evening',
        'Buenas noches, señora.',
        'Good evening, madam.',
        ['greetings'],
        { acceptedTranslations: ['good night'], emoji: '🌙' },
      ),
      w('es-chau', 'chau', 'bye', 'Chau, Sofía.', 'Bye, Sofía.', ['greetings'], {
        acceptedTranslations: ['goodbye'],
      }),
      w(
        'es-hasta-luego',
        'hasta luego',
        'see you later',
        'Chau, Juan. ¡Hasta luego!',
        'Bye, Juan. See you later!',
        ['greetings'],
      ),
      w(
        'es-gracias',
        'gracias',
        'thank you',
        '¡Muchas gracias, señor!',
        'Thank you very much, sir!',
        ['courtesy'],
        { acceptedTranslations: ['thanks'], emoji: '🙏' },
      ),
      w(
        'es-de-nada',
        'de nada',
        "you're welcome",
        '¡Gracias! — De nada.',
        'Thank you! — You’re welcome.',
        ['courtesy'],
      ),
      w('es-por-favor', 'por favor', 'please', 'Sí, por favor.', 'Yes, please.', ['courtesy']),
      w('es-si', 'sí', 'yes', 'Sí, gracias.', 'Yes, thank you.', ['basics'], { emoji: '👍' }),
      w('es-no', 'no', 'no', 'No, gracias.', 'No, thank you.', ['basics'], { emoji: '👎' }),
      w(
        'es-como-estas',
        '¿cómo estás?',
        'how are you?',
        '¡Hola, Camila! ¿Cómo estás?',
        'Hi, Camila! How are you?',
        ['greetings', 'questions'],
        { acceptedTranslations: ['how are you doing?'] },
      ),
      w(
        'es-bien',
        'bien',
        'fine',
        '¿Cómo estás? — Estoy bien.',
        'How are you? — I’m fine.',
        ['greetings'],
        { acceptedTranslations: ['well', 'good'] },
      ),
      w(
        'es-y-vos',
        '¿y vos?',
        'and you?, informal',
        'Muy bien, ¿y vos?',
        'Very well, and you?',
        ['greetings', 'voseo'],
        { acceptedTexts: ['¿y tú?'] },
      ),
      w(
        'es-y-usted',
        '¿y usted?',
        'and you?, formal',
        'Bien, gracias. ¿Y usted?',
        'Fine, thank you. And you?',
        ['greetings'],
      ),
      w(
        'es-me-llamo',
        'me llamo',
        'my name is',
        'Hola, me llamo Diego.',
        'Hi, my name is Diego.',
        ['introductions'],
        { acceptedTranslations: ["I'm called"] },
      ),
      w(
        'es-como-te-llamas',
        '¿cómo te llamás?',
        "what's your name?",
        '¡Hola! ¿Cómo te llamás?',
        'Hi! What’s your name?',
        ['introductions', 'questions', 'voseo'],
        { acceptedTranslations: ['what is your name?'], acceptedTexts: ['¿cómo te llamas?'] },
      ),
      w(
        'es-mucho-gusto',
        'mucho gusto',
        'nice to meet you',
        'Me llamo Valentina. — ¡Mucho gusto!',
        'My name is Valentina. — Nice to meet you!',
        ['introductions'],
        { acceptedTranslations: ['pleased to meet you'], emoji: '🤝' },
      ),
      w('es-senor', 'señor', 'sir', 'Gracias, señor.', 'Thank you, sir.', ['courtesy'], {
        acceptedTranslations: ['Mr.', 'mister'],
      }),
      w(
        'es-senora',
        'señora',
        'madam',
        'Buenas tardes, señora.',
        'Good afternoon, madam.',
        ['courtesy'],
        { acceptedTranslations: ['Mrs.', "ma'am"] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Hola, buen día, chau',
        objective: 'Say hello and goodbye depending on the time of day.',
        intro: {
          explanation:
            'Hola works at any time of day. To be more polite, use the time of day: buen día in the morning (in Argentina people say buen día rather than buenos días), buenas tardes in the afternoon and buenas noches in the evening, both when you arrive and when you leave. To say goodbye: chau or hasta luego. With a stranger, add señor or señora. The h in hola and hasta is silent.',
          examples: [
            { target: 'Buen día, señora.', base: 'Good morning, madam.' },
            { target: 'Chau, Martín. ¡Hasta luego!', base: 'Bye, Martín. See you later!' },
          ],
        },
        takeaways: [
          'You greet with hola, buen día, buenas tardes or buenas noches.',
          'You say goodbye with chau or hasta luego.',
        ],
        exercises: [
          ex.translationChoice(
            'hola',
            'hello',
            ['bye', 'see you later', 'good evening'],
            ['es-hola'],
            {
              id: 'es.ex.06btcqkcfwdk80',
            },
          ),
          ex.translationChoice(
            'chau',
            'bye',
            ['good morning', 'good afternoon', 'hello'],
            ['es-chau'],
            { id: 'es.ex.gcpscrdzv4lgeu' },
          ),
          ex.matchPairs(
            [
              ['buen día', 'good morning'],
              ['buenas tardes', 'good afternoon'],
              ['buenas noches', 'good evening'],
              ['hasta luego', 'see you later'],
            ],
            ['es-buen-dia', 'es-buenas-tardes', 'es-buenas-noches', 'es-hasta-luego'],
            { id: 'es.ex.zuw65f3f34xnm1' },
          ),
          ex.listenChoice(
            'Buenas tardes, señora.',
            ['Buenas noches, señora.', 'Buenas tardes, señor.', 'Buen día, señora.'],
            ['es-buenas-tardes', 'es-senora'],
            { id: 'es.ex.mre1e08ts7vsob' },
          ),
          ex.fillBlank(
            '¡___, Martín!',
            'Hi, Martín!',
            'Hola',
            ['Chau', 'Señor', 'Señora'],
            ['es-hola'],
            {
              id: 'es.ex.y6wjo6k6uxhzxz',
              skill: 'vocabulary',
              explanation:
                'Hola is the everyday greeting, at any time of day. Chau means bye. The h is never pronounced.',
            },
          ),
          ex.fillBlank(
            'Buen día, ___.',
            'Good morning, sir.',
            'señor',
            ['señora', 'chau', 'hola'],
            ['es-buen-dia', 'es-senor'],
            {
              id: 'es.ex.763mpp4qrs3yn2',
              skill: 'vocabulary',
              explanation: 'Señor is sir and señora is madam. The ñ sounds like the ny in canyon.',
            },
          ),
          ex.translationChoice(
            'hasta luego',
            'see you later',
            ['good evening', 'hello', 'good afternoon'],
            ['es-hasta-luego'],
            { id: 'es.ex.0c0mjlljxl8y66' },
          ),
          ex.listenChoice(
            'Chau, señor. ¡Hasta luego!',
            ['Chau, señora. ¡Hasta luego!', 'Hola, señor. ¡Buen día!', 'Buenas noches, señor.'],
            ['es-chau', 'es-hasta-luego'],
            { id: 'es.ex.maq6tnvu3x454h' },
          ),
          ex.translateWrite(
            'Good morning, madam.',
            'Buen día, señora.',
            ['es-buen-dia', 'es-senora'],
            { id: 'es.ex.gvri902iwpby2w', acceptedAnswers: ['Buenos días, señora.'] },
          ),
          ex.translateWrite(
            'Good evening, sir.',
            'Buenas noches, señor.',
            ['es-buenas-noches', 'es-senor'],
            { id: 'es.ex.74a3fvkvxokvtt' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Gracias, por favor',
        objective: 'Say thank you, please, yes and no.',
        intro: {
          explanation:
            'Gracias is thank you and the answer is de nada (you’re welcome). Por favor is please. Sí (with an accent) is yes; no is no. Every vowel is pronounced, short and clear: gra-cias, fa-vor.',
          examples: [
            { target: 'Gracias, señora. — De nada.', base: 'Thank you, madam. — You’re welcome.' },
            { target: 'No, gracias.', base: 'No, thank you.' },
          ],
        },
        takeaways: [
          'You say thank you with gracias and answer de nada.',
          'You ask politely with por favor.',
        ],
        exercises: [
          ex.translationChoice(
            'gracias',
            'thank you',
            ['please', "you're welcome", 'yes'],
            ['es-gracias'],
            { id: 'es.ex.br9d08vvur9k2u' },
          ),
          ex.matchPairs(
            [
              ['gracias', 'thank you'],
              ['de nada', "you're welcome"],
              ['por favor', 'please'],
              ['sí', 'yes'],
            ],
            ['es-gracias', 'es-de-nada', 'es-por-favor', 'es-si'],
            { id: 'es.ex.vtyiv81kcui429' },
          ),
          ex.fillBlank(
            'Gracias, señora. — De ___.',
            'Thank you, madam. — You’re welcome.',
            'nada',
            ['favor', 'luego', 'día'],
            ['es-de-nada'],
            {
              id: 'es.ex.6uld0bxyq4920l',
              skill: 'vocabulary',
              explanation: 'The answer to gracias is de nada.',
            },
          ),
          ex.listenChoice(
            'Sí, gracias.',
            ['No, gracias.', 'Sí, por favor.', 'Hola, señora.'],
            ['es-si', 'es-gracias'],
            { id: 'es.ex.3rvu7lqteb4vqq' },
          ),
          ex.translationChoice(
            'por favor',
            'please',
            ['thank you', 'no', 'bye'],
            ['es-por-favor'],
            {
              id: 'es.ex.04l6aertkc0lam',
            },
          ),
          ex.fillBlank('___, gracias.', 'No, thank you.', 'No', ['Sí', 'Hola', 'Chau'], ['es-no'], {
            id: 'es.ex.gzwysgo1ldzrx5',
            skill: 'vocabulary',
            explanation: 'No is no. Sí, gracias would be yes, thank you.',
          }),
          ex.listenChoice(
            'Por favor, señor.',
            ['Por favor, señora.', 'Gracias, señor.', 'De nada, señor.'],
            ['es-por-favor', 'es-senor'],
            { id: 'es.ex.g2lj426ifqujwm' },
          ),
          ex.translationChoice('sí', 'yes', ['no', 'please', 'hello'], ['es-si'], {
            id: 'es.ex.mm0nl2wspiw6uy',
          }),
          ex.translateWrite('Yes, please.', 'Sí, por favor.', ['es-si', 'es-por-favor'], {
            id: 'es.ex.v4kpcr1oeiok1o',
          }),
          ex.translateWrite(
            'No, thank you, madam.',
            'No, gracias, señora.',
            ['es-no', 'es-gracias', 'es-senora'],
            { id: 'es.ex.4rkngvv7dylq7a', acceptedAnswers: ['No, gracias señora.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Cómo estás?',
        objective: 'Ask how someone is with vos or usted, and answer.',
        intro: {
          explanation:
            'With a friend: ¿cómo estás? and, to ask back, ¿y vos? With someone you treat formally (usted), the verb loses its final s: ¿cómo está? and ¿y usted? A typical answer: bien or muy bien, gracias. In other countries you will hear ¿y tú?; in Argentina people say ¿y vos?',
          examples: [
            { target: '¿Cómo estás? — Bien, ¿y vos?', base: 'How are you? — Fine, and you?' },
            { target: 'Muy bien, gracias. ¿Y usted?', base: 'Very well, thank you. And you?' },
          ],
        },
        takeaways: [
          'You ask a friend ¿cómo estás? and ¿y vos?',
          'You use ¿cómo está? and ¿y usted? with señor and señora.',
        ],
        exercises: [
          ex.translationChoice('bien', 'fine', ['yes', 'please', 'bye'], ['es-bien'], {
            id: 'es.ex.8tdvni01pigbni',
          }),
          ex.listenChoice(
            '¿Cómo estás?',
            ['¿Cómo está?', '¿Y vos?', '¿Y usted?'],
            ['es-como-estas'],
            { id: 'es.ex.vf68c7ewjiaanz' },
          ),
          ex.fillBlank(
            'Bien, gracias. ¿Y ___?',
            'Fine, thanks. And you? (to a friend)',
            'vos',
            ['usted', 'señor', 'señora'],
            ['es-y-vos'],
            {
              id: 'es.ex.m2pgsh435gzzet',
              explanation:
                'With a friend you use vos. ¿Y usted? is for someone you treat formally.',
            },
          ),
          ex.fillBlank(
            'Muy bien, gracias. ¿Y ___, señor?',
            'Very well, thank you. And you, sir?',
            'usted',
            ['vos', 'bien', 'chau'],
            ['es-y-usted', 'es-senor'],
            {
              id: 'es.ex.z84rz3m2ww4ikt',
              explanation: 'With señor or señora you use usted, the formal you.',
            },
          ),
          ex.matchPairs(
            [
              ['¿cómo estás?', 'how are you?'],
              ['bien', 'fine'],
              ['¿y vos?', 'and you?, informal'],
              ['¿y usted?', 'and you?, formal'],
            ],
            ['es-como-estas', 'es-bien', 'es-y-vos', 'es-y-usted'],
            { id: 'es.ex.w4sn2w9ieyvaiy' },
          ),
          question(
            'es.ex.ql4m2xxkg7qsij',
            KIOSCO,
            'How is Lucía?',
            'Very well',
            ['Not very well', 'Tired', 'She doesn’t say'],
            ['es-bien'],
            'Lucía answers “Muy bien, gracias”: very well, thank you.',
          ),
          question(
            'es.ex.tbdg2jcmu8t031',
            KIOSCO,
            'Why does Lucía say “¿Y usted?” and not “¿Y vos?”?',
            'She is speaking formally to the shopkeeper',
            ['She is talking to a close friend', 'She is asking his name', 'She is saying goodbye'],
            ['es-y-usted', 'es-senor'],
            'She calls him señor and uses usted, the formal you, as people do in a shop.',
          ),
          ex.listenChoice(
            'Muy bien. ¿Y vos?',
            ['Muy bien. ¿Y usted?', 'Bien, gracias.', 'No muy bien.'],
            ['es-bien', 'es-y-vos'],
            { id: 'es.ex.w3vlxjxyccd8fc' },
          ),
          ex.shortAnswer(
            '¿Cómo estás?',
            'A friend asks you. Say you are fine and ask back (e.g. «Bien, ¿y vos?»).',
            'Bien, ¿y vos?',
            [
              'Bien. ¿Y vos?',
              'Muy bien, ¿y vos?',
              'Muy bien. ¿Y vos?',
              'Bien, gracias, ¿y vos?',
              'Bien, gracias. ¿Y vos?',
              'Muy bien, gracias. ¿Y vos?',
              'Muy bien, gracias, ¿y vos?',
            ],
            ['es-bien', 'es-y-vos'],
            { id: 'es.ex.in13925d0tv3ms' },
          ),
          ex.translateWrite(
            'How are you? — Fine, thanks.',
            '¿Cómo estás? — Bien, gracias.',
            ['es-como-estas', 'es-bien', 'es-gracias'],
            {
              id: 'es.ex.n9k20rcmhjszkf',
              acceptedAnswers: ['¿Cómo estás? Bien, gracias.', '¿Cómo está? — Bien, gracias.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Me llamo…',
        objective: 'Say your name and ask someone else’s.',
        intro: {
          explanation:
            'To say your name: me llamo + name. To ask a friend: ¿cómo te llamás? With vos the stress falls on the last syllable (lla-MÁS), which is why it has an accent. When you meet someone, say mucho gusto. In Buenos Aires the ll of llamo sounds like the sh in shoe or the s in measure.',
          examples: [
            { target: 'Me llamo Sofía.', base: 'My name is Sofía.' },
            {
              target: '¿Cómo te llamás? — Me llamo Martín.',
              base: 'What’s your name? — My name is Martín.',
            },
          ],
        },
        takeaways: [
          'You introduce yourself with me llamo and ask ¿cómo te llamás?',
          'You answer an introduction with mucho gusto.',
        ],
        exercises: [
          ex.translationChoice(
            'me llamo',
            'my name is',
            ['nice to meet you', 'see you later', 'how are you?'],
            ['es-me-llamo'],
            { id: 'es.ex.61148jebafi26z' },
          ),
          ex.orderWords('Me llamo Sofía.', 'My name is Sofía.', ['es-me-llamo'], {
            id: 'es.ex.xq977xcwcl0gvn',
          }),
          ex.fillBlank(
            '¿Cómo te ___?',
            'What’s your name?',
            'llamás',
            ['llamo', 'estás', 'bien'],
            ['es-como-te-llamas'],
            {
              id: 'es.ex.97r0q0yai10879',
              explanation: 'With vos: ¿cómo te llamás? To answer, you say me llamo…',
            },
          ),
          ex.listenChoice(
            'Me llamo Martín.',
            ['Me llamo Mateo.', 'Me llamo Valentina.', '¿Cómo te llamás?'],
            ['es-me-llamo'],
            { id: 'es.ex.ujs1sx8gwj6pen' },
          ),
          ex.translationChoice(
            'mucho gusto',
            'nice to meet you',
            ['my name is', "you're welcome", 'good evening'],
            ['es-mucho-gusto'],
            { id: 'es.ex.he5vgjm1bqddmv' },
          ),
          question(
            'es.ex.87ocutzyv9xc6a',
            FIESTA,
            'What is the woman’s name?',
            'Sofía',
            ['Lucía', 'Camila', 'Valentina'],
            ['es-me-llamo'],
            'She says “Me llamo Sofía”.',
          ),
          question(
            'es.ex.76pdrrl35ej1jy',
            FIESTA,
            'What does Martín say when he hears her name?',
            'That it’s nice to meet her',
            ['Goodbye', 'Thank you', 'Good evening'],
            ['es-mucho-gusto'],
            'Martín says “¡Mucho gusto, Sofía!”: nice to meet you.',
          ),
          question(
            'es.ex.ogkrkoe3f0ay9r',
            FIESTA,
            'How do Martín and Sofía speak to each other?',
            'Informally, with vos',
            ['Formally, with usted', 'With señor and señora', 'We can’t tell'],
            ['es-como-te-llamas', 'es-y-vos'],
            'They ask “¿Cómo te llamás?” and “¿Y vos?”: the informal vos.',
          ),
          ex.translateWrite(
            'Hi! My name is Ana. What’s your name?',
            '¡Hola! Me llamo Ana. ¿Cómo te llamás?',
            ['es-hola', 'es-me-llamo', 'es-como-te-llamas'],
            {
              id: 'es.ex.0bdy3g4ilfxgf2',
              acceptedAnswers: [
                'Hola, me llamo Ana. ¿Cómo te llamás?',
                '¡Hola! Me llamo Ana, ¿cómo te llamás?',
                'Hola. Me llamo Ana. ¿Cómo te llamas?',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo te llamás?',
            'Answer with the name Diego (start with «Me llamo»).',
            'Me llamo Diego.',
            ['Me llamo Diego', 'Hola, me llamo Diego.', 'Mucho gusto, me llamo Diego.'],
            ['es-me-llamo'],
            { id: 'es.ex.j72fwn4gib041q' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Hola, ¿cómo estás?',
        objective: 'Understand short greetings in a conversation and a message.',
        intro: {
          explanation:
            'In Argentina, friends and family greet each other with one kiss on the cheek, also between men. A short chat between friends: ¡Hola! ¿Cómo estás? — Bien, ¿y vos? In a message, you can close with chau or hasta luego.',
          examples: [
            { target: '¡Hola, Tomás! ¿Cómo estás?', base: 'Hi, Tomás! How are you?' },
            { target: '¡Muchas gracias! Hasta luego.', base: 'Thanks a lot! See you later.' },
          ],
        },
        takeaways: [
          'You understand a greeting, a thank-you and a goodbye in a message.',
          'You choose vos or usted depending on the person.',
        ],
        exercises: [
          question(
            'es.ex.mc9r7cgm0e693s',
            MENSAJE,
            'What does Camila do in her message?',
            'She thanks Tomás',
            ['She introduces herself', 'She asks Tomás his name', 'She says good night'],
            ['es-gracias'],
            'Camila writes “¡Muchas gracias!”: thanks a lot.',
          ),
          question(
            'es.ex.hdbg42zk6y4l24',
            MENSAJE,
            'How does Camila end her message?',
            'She says see you later',
            ['She says good morning', 'She says please', 'She says you’re welcome'],
            ['es-hasta-luego'],
            'Before her name she writes “Hasta luego”.',
          ),
          question(
            'es.ex.ok7og6uszs5swc',
            KIOSCO,
            'When does this conversation take place?',
            'In the morning',
            ['In the afternoon', 'In the evening', 'We can’t tell'],
            ['es-buen-dia'],
            'They greet each other with “Buen día”, the morning greeting.',
          ),
          ex.listenChoice(
            '¡Hola! ¿Cómo estás?',
            ['¡Hola! ¿Cómo te llamás?', '¡Chau! ¿Cómo estás?', '¡Hola! ¿Y usted?'],
            ['es-hola', 'es-como-estas'],
            { id: 'es.ex.p8y5jfx8u8abcu' },
          ),
          ex.matchPairs(
            [
              ['hola', 'hello'],
              ['chau', 'bye'],
              ['por favor', 'please'],
              ['mucho gusto', 'nice to meet you'],
            ],
            ['es-hola', 'es-chau', 'es-por-favor', 'es-mucho-gusto'],
            { id: 'es.ex.igp0zo19mlyuba' },
          ),
          ex.fillBlank(
            'Buenas noches, señor. ¿Cómo ___?',
            'Good evening, sir. How are you?',
            'está',
            ['estás', 'llamás', 'vos'],
            ['es-buenas-noches', 'es-como-estas'],
            {
              id: 'es.ex.y5eokpekfxhazg',
              explanation:
                'With usted (señor, señora) the verb has no final s: ¿cómo está? With vos: ¿cómo estás?',
            },
          ),
          ex.translationChoice(
            '¿y usted?',
            'and you?, formal',
            ['and you?, informal', 'how are you?', 'please'],
            ['es-y-usted'],
            { id: 'es.ex.fcs0rukl4fbw0j' },
          ),
          ex.translateWrite(
            'Good afternoon, madam. How are you?',
            'Buenas tardes, señora. ¿Cómo está?',
            ['es-buenas-tardes', 'es-senora'],
            {
              id: 'es.ex.1m1p9k5h2rm2lv',
              acceptedAnswers: [
                'Buenas tardes, señora. ¿Cómo está usted?',
                'Buenas tardes, señora, ¿cómo está?',
              ],
            },
          ),
          ex.shortAnswer(
            '¡Muchas gracias!',
            'Answer politely (you’re welcome).',
            'De nada.',
            ['De nada', '¡De nada!'],
            ['es-de-nada'],
            { id: 'es.ex.ap5q12tf27155n' },
          ),
        ],
      },
    ],
  },
};

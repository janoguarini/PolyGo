import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U1 «Greetings and introductions» (docs/ES_A1_A2.md): saludar y despedirse según la hora,
 * agradecer, preguntar cómo está alguien con tú o con usted y presentarse con me llamo. Variante:
 * español neutro de Latinoamérica (tú, usted, ustedes); buenos días y adiós.
 * Pronunciación: las cinco vocales (cortas y siempre iguales), la h muda (hola, hasta luego) y la ll
 * como la y inglesa de yes (me llamo).
 * Cultura: en gran parte de Latinoamérica se saluda con un beso en la mejilla (entre mujeres y entre
 * hombre y mujer; los hombres suelen darse la mano o un abrazo); en España, dos besos.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const KIOSCO = dialogue(
  'es.stim.a1-u1-kiosco',
  'A customer walks into a small corner shop in the morning.',
  [
    ['Lucía', '¡Buenos días, señor!'],
    ['Juan', 'Buenos días, señora. ¿Cómo está?'],
    ['Lucía', 'Muy bien, gracias. ¿Y usted?'],
    ['Juan', 'Bien, gracias.'],
  ],
  ES_A1_RATE,
);

const FIESTA = dialogue(
  'es.stim.a1-u1-fiesta',
  'Two young people meet at a friend’s party.',
  [
    ['Martín', '¡Hola! Me llamo Martín. ¿Cómo te llamas?'],
    ['Sofía', 'Hola, Martín. Me llamo Sofía.'],
    ['Martín', '¡Mucho gusto, Sofía! ¿Cómo estás?'],
    ['Sofía', 'Muy bien. ¿Y tú?'],
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
      'Say hello and goodbye at any time of day, say thank you and please, ask how someone is with tú or usted, and say your name.',
    emoji: '👋',
    objective:
      'You can greet people and say goodbye depending on the time and the person, ask how someone is, introduce yourself and say your name.',
    grammar: {
      title: 'Tú and usted · me llamo',
      explanation:
        'Spanish has two ways of saying “you” to one person. Tú is informal: for friends, family, children and people your age (¿cómo estás?, ¿y tú?). Usted is formal: for strangers, older people, in a shop or at work (¿cómo está?, ¿y usted?), often together with señor or señora. With usted the verb loses the final s: estás → está. This course teaches the neutral Spanish of Latin America, understood everywhere. To say your name: me llamo + name. Spanish vowels are short and always sound the same (a, e, i, o, u), and the letter h is never pronounced: hola, hasta luego.',
      examples: [
        {
          target: '¡Hola! ¿Cómo estás? — Bien, ¿y tú?',
          base: 'Hi! How are you? — Fine, and you?',
        },
        { target: 'Buenos días, señora. ¿Cómo está?', base: 'Good morning, madam. How are you?' },
        { target: 'Me llamo Ana. Mucho gusto.', base: 'My name is Ana. Nice to meet you.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U1), convertido al español neutro con tú. Sin revisión nativa: revisar «adiós» como despedida base (en el Cono Sur se dice más «chau», que se acepta, igual que «chao» y «buen día») y la nota cultural sobre el beso en la mejilla.',
    },
    words: [
      w('es-hola', 'hola', 'hello', '¡Hola, Martín!', 'Hi, Martín!', ['greetings'], {
        acceptedTranslations: ['hi'],
        emoji: '👋',
      }),
      w(
        'es-buenos-dias',
        'buenos días',
        'good morning',
        'Buenos días, señora.',
        'Good morning, madam.',
        ['greetings'],
        { acceptedTexts: ['buen día'], emoji: '🌅' },
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
      w('es-adios', 'adiós', 'goodbye', 'Adiós, Sofía.', 'Goodbye, Sofía.', ['greetings'], {
        acceptedTranslations: ['bye'],
        acceptedTexts: ['chau', 'chao'],
      }),
      w(
        'es-hasta-luego',
        'hasta luego',
        'see you later',
        'Gracias, Juan. ¡Hasta luego!',
        'Thank you, Juan. See you later!',
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
        'es-y-tu',
        '¿y tú?',
        'and you?, informal',
        'Muy bien, ¿y tú?',
        'Very well, and you?',
        ['greetings'],
        { acceptedTexts: ['¿y vos?'] },
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
        '¿cómo te llamas?',
        "what's your name?",
        '¡Hola! ¿Cómo te llamas?',
        'Hi! What’s your name?',
        ['introductions', 'questions'],
        { acceptedTranslations: ['what is your name?'], acceptedTexts: ['¿cómo te llamás?'] },
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
        title: 'Hola, buenos días, adiós',
        objective: 'Say hello and goodbye depending on the time of day.',
        intro: {
          explanation:
            'Hola works at any time of day. To be more polite, use the time of day: buenos días in the morning, buenas tardes in the afternoon and buenas noches in the evening, both when you arrive and when you leave. To say goodbye: adiós, or the friendly hasta luego (see you later), which people use all the time, even if they won’t see you again that day. With a stranger, add señor or señora. The h in hola and hasta is silent.',
          examples: [
            { target: 'Buenos días, señora.', base: 'Good morning, madam.' },
            { target: 'Adiós, Martín. ¡Hasta luego!', base: 'Goodbye, Martín. See you later!' },
          ],
        },
        takeaways: [
          'You greet with hola, buenos días, buenas tardes or buenas noches.',
          'You say goodbye with adiós or hasta luego.',
        ],
        exercises: [
          ex.translationChoice(
            'hola',
            'hello',
            ['goodbye', 'see you later', 'good evening'],
            ['es-hola'],
            {
              id: 'es.ex.06btcqkcfwdk80',
            },
          ),
          ex.translationChoice(
            'adiós',
            'goodbye',
            ['good morning', 'good afternoon', 'hello'],
            ['es-adios'],
            { id: 'es.ex.hzb8w2pyv3yhx5' },
          ),
          ex.matchPairs(
            [
              ['buenos días', 'good morning'],
              ['buenas tardes', 'good afternoon'],
              ['buenas noches', 'good evening'],
              ['hasta luego', 'see you later'],
            ],
            ['es-buenos-dias', 'es-buenas-tardes', 'es-buenas-noches', 'es-hasta-luego'],
            { id: 'es.ex.zgnx8n87ffur8b' },
          ),
          ex.listenChoice(
            'Buenas tardes, señora.',
            ['Buenas noches, señora.', 'Buenas tardes, señor.', 'Buenos días, señora.'],
            ['es-buenas-tardes', 'es-senora'],
            { id: 'es.ex.mre1e08ts7vsob' },
          ),
          ex.fillBlank(
            '¡___, Martín!',
            'Hi, Martín!',
            'Hola',
            ['Adiós', 'Señor', 'Señora'],
            ['es-hola'],
            {
              id: 'es.ex.y6wjo6k6uxhzxz',
              skill: 'vocabulary',
              explanation:
                'Hola is the everyday greeting, at any time of day. Adiós means goodbye. The h is never pronounced.',
            },
          ),
          ex.fillBlank(
            'Buenos días, ___.',
            'Good morning, sir.',
            'señor',
            ['señora', 'adiós', 'hola'],
            ['es-buenos-dias', 'es-senor'],
            {
              id: 'es.ex.xuceqy0uridmct',
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
            'Adiós, señor. ¡Hasta luego!',
            ['Adiós, señora. ¡Hasta luego!', 'Hola, señor. ¡Buenos días!', 'Buenas noches, señor.'],
            ['es-adios', 'es-hasta-luego'],
            { id: 'es.ex.dfff2ulza090he' },
          ),
          ex.translateWrite(
            'Good morning, madam.',
            'Buenos días, señora.',
            ['es-buenos-dias', 'es-senora'],
            { id: 'es.ex.z3fqggif54dvil', acceptedAnswers: ['Buen día, señora.'] },
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
            ['thank you', 'no', 'goodbye'],
            ['es-por-favor'],
            {
              id: 'es.ex.04l6aertkc0lam',
            },
          ),
          ex.fillBlank(
            '___, gracias.',
            'No, thank you.',
            'No',
            ['Sí', 'Hola', 'Adiós'],
            ['es-no'],
            {
              id: 'es.ex.gzwysgo1ldzrx5',
              skill: 'vocabulary',
              explanation: 'No is no. Sí, gracias would be yes, thank you.',
            },
          ),
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
        objective: 'Ask how someone is with tú or usted, and answer.',
        intro: {
          explanation:
            'With a friend (tú): ¿cómo estás? and, to ask back, ¿y tú? With someone you treat formally (usted), the verb loses its final s: ¿cómo está? and ¿y usted? A typical answer: bien or muy bien, gracias. Use tú with friends, family and people your age, and usted with strangers, older people and in shops. Spanish usually leaves out tú (¿cómo estás?, not ¿cómo estás tú?), but you say it in ¿y tú?, where it carries the meaning. Tú has an accent; tu without one means your.',
          examples: [
            { target: '¿Cómo estás? — Bien, ¿y tú?', base: 'How are you? — Fine, and you?' },
            { target: 'Muy bien, gracias. ¿Y usted?', base: 'Very well, thank you. And you?' },
          ],
        },
        takeaways: [
          'You ask a friend ¿cómo estás? and ¿y tú?',
          'You use ¿cómo está? and ¿y usted? with señor and señora.',
        ],
        exercises: [
          ex.translationChoice('bien', 'fine', ['yes', 'please', 'bye'], ['es-bien'], {
            id: 'es.ex.8tdvni01pigbni',
          }),
          ex.listenChoice(
            '¿Cómo estás?',
            ['¿Cómo está?', '¿Y tú?', '¿Y usted?'],
            ['es-como-estas'],
            { id: 'es.ex.vf68c7ewjiaanz' },
          ),
          ex.fillBlank(
            'Bien, gracias. ¿Y ___?',
            'Fine, thanks. And you? (to a friend)',
            'tú',
            ['usted', 'señor', 'señora'],
            ['es-y-tu'],
            {
              id: 'es.ex.synzaoc14vqcin',
              explanation:
                'With a friend you use tú (with an accent). ¿Y usted? is for someone you treat formally.',
            },
          ),
          ex.fillBlank(
            'Muy bien, gracias. ¿Y ___, señor?',
            'Very well, thank you. And you, sir?',
            'usted',
            ['tú', 'bien', 'adiós'],
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
              ['¿y tú?', 'and you?, informal'],
              ['¿y usted?', 'and you?, formal'],
            ],
            ['es-como-estas', 'es-bien', 'es-y-tu', 'es-y-usted'],
            { id: 'es.ex.hoo0013oj1l794' },
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
            'Why does Lucía say “¿Y usted?” and not “¿Y tú?”?',
            'She is speaking formally to the shopkeeper',
            ['She is talking to a close friend', 'She is asking his name', 'She is saying goodbye'],
            ['es-y-usted', 'es-senor'],
            'She calls him señor and uses usted, the formal you, as people do in a shop.',
          ),
          ex.listenChoice(
            'Muy bien. ¿Y tú?',
            ['Muy bien. ¿Y usted?', 'Bien, gracias.', 'No muy bien.'],
            ['es-bien', 'es-y-tu'],
            { id: 'es.ex.hsve2ptylkni70' },
          ),
          ex.shortAnswer(
            '¿Cómo estás?',
            'A friend asks you. Say you are fine and ask back (e.g. «Bien, ¿y tú?»).',
            'Bien, ¿y tú?',
            [
              'Bien. ¿Y tú?',
              'Muy bien, ¿y tú?',
              'Muy bien. ¿Y tú?',
              'Bien, gracias, ¿y tú?',
              'Bien, gracias. ¿Y tú?',
              'Muy bien, gracias. ¿Y tú?',
              'Muy bien, gracias, ¿y tú?',
              'Bien, ¿y vos?',
              'Bien, gracias. ¿Y vos?',
              'Muy bien, gracias. ¿Y vos?',
            ],
            ['es-bien', 'es-y-tu'],
            { id: 'es.ex.u08iv9he8k7upy' },
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
            'To say your name: me llamo + name (literally “I call myself”). To ask a friend: ¿cómo te llamas? — the same verb, now ending in -as for tú: yo me llamo, tú te llamas. When you meet someone, say mucho gusto. The ll of llamo sounds like the y in yes: YA-mo.',
          examples: [
            { target: 'Me llamo Sofía.', base: 'My name is Sofía.' },
            {
              target: '¿Cómo te llamas? — Me llamo Martín.',
              base: 'What’s your name? — My name is Martín.',
            },
          ],
        },
        takeaways: [
          'You introduce yourself with me llamo and ask ¿cómo te llamas?',
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
            'llamas',
            ['llamo', 'estás', 'bien'],
            ['es-como-te-llamas'],
            {
              id: 'es.ex.97r0q0yai10879',
              explanation:
                'With tú the verb ends in -as: ¿cómo te llamas? To answer, you say me llamo…',
            },
          ),
          ex.listenChoice(
            'Me llamo Martín.',
            ['Me llamo Mateo.', 'Me llamo Valentina.', '¿Cómo te llamas?'],
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
            'es.ex.9jdwggkvo8a2no',
            FIESTA,
            'How do Martín and Sofía speak to each other?',
            'Informally, with tú',
            ['Formally, with usted', 'With señor and señora', 'We can’t tell'],
            ['es-como-te-llamas', 'es-y-tu'],
            'They ask “¿Cómo te llamas?” and “¿Y tú?”: the informal tú.',
          ),
          ex.translateWrite(
            'Hi! My name is Ana. What’s your name?',
            '¡Hola! Me llamo Ana. ¿Cómo te llamas?',
            ['es-hola', 'es-me-llamo', 'es-como-te-llamas'],
            {
              id: 'es.ex.0bdy3g4ilfxgf2',
              acceptedAnswers: [
                'Hola, me llamo Ana. ¿Cómo te llamas?',
                '¡Hola! Me llamo Ana, ¿cómo te llamas?',
                'Hola. Me llamo Ana. ¿Cómo te llamas?',
                '¡Hola! Me llamo Ana. ¿Cómo te llamás?',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo te llamas?',
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
            'In much of Latin America, friends and family greet each other with one kiss on the cheek (between women, and between a man and a woman); men usually shake hands or hug. In Spain it is two kisses. A short chat between friends: ¡Hola! ¿Cómo estás? — Bien, ¿y tú? In a message, you can close with adiós or hasta luego.',
          examples: [
            { target: '¡Hola, Tomás! ¿Cómo estás?', base: 'Hi, Tomás! How are you?' },
            { target: '¡Muchas gracias! Hasta luego.', base: 'Thanks a lot! See you later.' },
          ],
        },
        takeaways: [
          'You understand a greeting, a thank-you and a goodbye in a message.',
          'You choose tú or usted depending on the person.',
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
            'es.ex.tl0oanrnc8pvbf',
            KIOSCO,
            'When does this conversation take place?',
            'In the morning',
            ['In the afternoon', 'In the evening', 'We can’t tell'],
            ['es-buenos-dias'],
            'They greet each other with “Buenos días”, the morning greeting.',
          ),
          ex.listenChoice(
            '¡Hola! ¿Cómo estás?',
            ['¡Hola! ¿Cómo te llamas?', '¡Adiós! ¿Cómo estás?', '¡Hola! ¿Y usted?'],
            ['es-hola', 'es-como-estas'],
            { id: 'es.ex.p8y5jfx8u8abcu' },
          ),
          ex.matchPairs(
            [
              ['hola', 'hello'],
              ['adiós', 'goodbye'],
              ['por favor', 'please'],
              ['mucho gusto', 'nice to meet you'],
            ],
            ['es-hola', 'es-adios', 'es-por-favor', 'es-mucho-gusto'],
            { id: 'es.ex.4rxkvdttlwydl3' },
          ),
          ex.fillBlank(
            'Buenas noches, señor. ¿Cómo ___?',
            'Good evening, sir. How are you?',
            'está',
            ['estás', 'llamas', 'tú'],
            ['es-buenas-noches', 'es-como-estas'],
            {
              id: 'es.ex.y5eokpekfxhazg',
              explanation:
                'With usted (señor, señora) the verb has no final s: ¿cómo está? With tú: ¿cómo estás?',
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

import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U2 «Where are you from?» (docs/ES_A1_A2.md): pronombres personales y ser en singular
 * (yo soy, vos sos, él / ella / usted es), nacionalidades con género (argentino / argentina, inglés /
 * inglesa), soy de, vivo en, hablo + idioma y la negación con no delante del verbo.
 * Pronunciación: la sílaba tónica y la tilde (inglés, francés, país) y el seseo (ciudad, francés).
 * Cultura: el voseo frente al tuteo de otros países; Buenos Aires como ciudad de estudiantes extranjeros.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CLASE = dialogue(
  'es.stim.a1-u2-clase',
  'Two students meet on the first day of a Spanish class in Buenos Aires.',
  [
    ['Lucía', '¡Hola! Me llamo Lucía. ¿Y vos?'],
    ['Kevin', 'Me llamo Kevin. Mucho gusto.'],
    ['Lucía', '¿De dónde sos, Kevin?'],
    ['Kevin', 'Soy estadounidense, de Nueva York. ¿Vos sos de Buenos Aires?'],
    ['Lucía', 'No, soy de Rosario, una ciudad de Argentina.'],
  ],
  ES_A1_RATE,
);

const PERFIL = reading(
  'es.stim.a1-u2-perfil',
  'post',
  'Marco’s profile on a language exchange app.',
  [
    '¡Hola! Me llamo Marco y soy italiano, de Roma.',
    'Vivo en Buenos Aires y soy estudiante.',
    'Hablo italiano, inglés y un poco de español.',
    'No hablo francés.',
  ],
  { title: 'Marco', from: 'Marco' },
);

export const ES_A1_U02: EsUnitDef = {
  names: [
    'Lucía',
    'Martín',
    'Diego',
    'Sofía',
    'Kevin',
    'Emma',
    'Marco',
    'Claire',
    'Thiago',
    'Argentina',
    'Brasil',
    'Italia',
    'Francia',
    'Inglaterra',
    'Estados Unidos',
    'Buenos Aires',
    'Rosario',
    'Córdoba',
    'Mendoza',
    'Roma',
    'París',
    'Londres',
    'Nueva York',
  ],
  support: [
    'español',
    'portugués',
    'vive',
    'vivís',
    'hablás',
    'habla',
    'pero',
    'un',
    'una',
    'qué',
    'poco',
  ],
  contrast: ['tú', 'eres'],
  unit: {
    position: 2,
    title: 'Where are you from?',
    titleEn: 'Soy argentino',
    description:
      'Say who you are with ser (yo soy, vos sos, él / ella / usted es), your nationality, where you are from, where you live and which languages you speak.',
    emoji: '🌎',
    objective:
      'You can say who you are, your nationality, where you are from, where you live and which languages you speak, and ask other people the same.',
    grammar: {
      title: 'Ser in the singular · nationalities · no',
      explanation:
        'Ser (to be) in the singular: yo soy, vos sos, él es, ella es, usted es. In Argentina people say vos sos; in Spain and much of Latin America you will hear tú eres, which you only need to understand. Spanish often drops the pronoun: soy estudiante (I am a student) — and notice there is no word for “a” before a job or role. Nationalities are not capitalized and change for women: argentino → argentina, italiano → italiana, inglés → inglesa, francés → francesa (the accent disappears because the stress no longer falls on the last syllable). Words ending in -e stay the same: estadounidense. To say no, put no before the verb: no hablo francés. The c in ciudad and francés sounds like an s.',
      examples: [
        {
          target: 'Yo soy estudiante. ¿Vos también sos estudiante?',
          base: 'I am a student. Are you a student too?',
        },
        {
          target: 'Él es argentino y ella es inglesa.',
          base: 'He is Argentine and she is English.',
        },
        {
          target: 'Vos sos de Rosario. (Tú eres de Rosario.)',
          base: 'You are from Rosario. (The tú form is used in Spain and much of Latin America.)',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U2). Sin revisión nativa: revisar «de Argentina» frente a «de la Argentina» (las dos se oyen; usamos la forma sin artículo), «estadounidense» como gentilicio de EE. UU. (en el habla se oye también «norteamericano») y el ejemplo de contraste con tú eres en la gramática.',
    },
    words: [
      w(
        'es-yo-soy',
        'yo soy',
        'I am',
        'Yo soy estudiante.',
        'I am a student.',
        ['verbs', 'pronouns'],
        {
          acceptedTranslations: ["I'm"],
          acceptedTexts: ['soy'],
        },
      ),
      w(
        'es-vos-sos',
        'vos sos',
        'you are, informal',
        '¿Vos sos Martín?',
        'Are you Martín?',
        ['verbs', 'pronouns', 'voseo'],
        { acceptedTranslations: ["you're, informal"], acceptedTexts: ['sos'] },
      ),
      w(
        'es-el-es',
        'él es',
        'he is',
        'Él es argentino.',
        'He is Argentine.',
        ['verbs', 'pronouns'],
        {
          acceptedTranslations: ["he's"],
        },
      ),
      w(
        'es-ella-es',
        'ella es',
        'she is',
        'Ella es italiana.',
        'She is Italian.',
        ['verbs', 'pronouns'],
        { acceptedTranslations: ["she's"] },
      ),
      w(
        'es-usted-es',
        'usted es',
        'you are, formal',
        '¿Usted es de Rosario?',
        'Are you from Rosario?',
        ['verbs', 'pronouns'],
        { acceptedTranslations: ["you're, formal"] },
      ),
      w(
        'es-argentino',
        'argentino',
        'Argentine',
        'Soy argentino, de Buenos Aires.',
        'I’m Argentine, from Buenos Aires.',
        ['nationalities'],
        { acceptedTranslations: ['Argentinian'], acceptedTexts: ['argentina'], emoji: '🇦🇷' },
      ),
      w(
        'es-ingles',
        'inglés',
        'English',
        'Emma es inglesa y habla inglés.',
        'Emma is English and speaks English.',
        ['nationalities', 'languages'],
        { acceptedTexts: ['inglesa'] },
      ),
      w(
        'es-estadounidense',
        'estadounidense',
        'American',
        'Kevin es estadounidense.',
        'Kevin is American.',
        ['nationalities'],
        { acceptedTranslations: ['from the US'] },
      ),
      w(
        'es-brasileno',
        'brasileño',
        'Brazilian',
        'Thiago es brasileño y habla portugués.',
        'Thiago is Brazilian and speaks Portuguese.',
        ['nationalities'],
        { acceptedTexts: ['brasileña'] },
      ),
      w(
        'es-italiano',
        'italiano',
        'Italian',
        'Marco es italiano, de Roma.',
        'Marco is Italian, from Rome.',
        ['nationalities', 'languages'],
        { acceptedTexts: ['italiana'] },
      ),
      w(
        'es-frances',
        'francés',
        'French',
        'Claire es francesa, de París.',
        'Claire is French, from Paris.',
        ['nationalities', 'languages'],
        { acceptedTexts: ['francesa'] },
      ),
      w(
        'es-de-donde-sos',
        '¿de dónde sos?',
        'where are you from?',
        '¡Hola! ¿De dónde sos?',
        'Hi! Where are you from?',
        ['questions', 'voseo'],
        { acceptedTexts: ['¿de dónde eres?'] },
      ),
      w(
        'es-soy-de',
        'soy de',
        "I'm from",
        'Soy de Mendoza.',
        'I’m from Mendoza.',
        ['introductions'],
        {
          acceptedTranslations: ['I am from'],
        },
      ),
      w('es-vivo-en', 'vivo en', 'I live in', 'Vivo en Buenos Aires.', 'I live in Buenos Aires.', [
        'verbs',
      ]),
      w('es-hablo', 'hablo', 'I speak', 'Hablo inglés y español.', 'I speak English and Spanish.', [
        'verbs',
        'languages',
      ]),
      w(
        'es-el-pais',
        'el país',
        'the country',
        '¿De qué país sos?',
        'What country are you from?',
        ['places'],
        { acceptedTranslations: ['country'] },
      ),
      w(
        'es-la-ciudad',
        'la ciudad',
        'the city',
        'Rosario es una ciudad argentina.',
        'Rosario is an Argentine city.',
        ['places'],
        { acceptedTranslations: ['city'], emoji: '🏙️' },
      ),
      w(
        'es-tambien',
        'también',
        'also',
        'Yo también soy estudiante.',
        'I’m a student too.',
        ['basics'],
        { acceptedTranslations: ['too'] },
      ),
      w('es-estudiante', 'estudiante', 'student', 'Soy estudiante.', 'I’m a student.', ['people'], {
        emoji: '🎓',
      }),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Yo soy, vos sos',
        objective: 'Say who you are and who other people are with ser.',
        intro: {
          explanation:
            'Ser means to be. Yo soy (I am), vos sos (you are, to a friend), él es (he is), ella es (she is) and usted es (you are, formal). In Argentina people say vos sos; in Spain and much of Latin America they say tú eres. Spanish usually drops yo: soy estudiante. And there is no “a” before a role: soy estudiante = I am a student.',
          examples: [
            { target: 'Yo soy estudiante.', base: 'I am a student.' },
            { target: 'Ella es Lucía. Él es Diego.', base: 'She is Lucía. He is Diego.' },
          ],
        },
        takeaways: [
          'You use yo soy, vos sos, él es, ella es and usted es.',
          'You say soy estudiante without a word for “a”.',
        ],
        exercises: [
          ex.translationChoice(
            'yo soy',
            'I am',
            ['you are, informal', 'he is', 'she is'],
            ['es-yo-soy'],
            { id: 'es.ex.sfbb8v3ztvfgzp' },
          ),
          ex.translationChoice(
            'vos sos',
            'you are, informal',
            ['you are, formal', 'I am', 'she is'],
            ['es-vos-sos'],
            { id: 'es.ex.6xg6o8p4z8ekqh' },
          ),
          ex.matchPairs(
            [
              ['yo soy', 'I am'],
              ['vos sos', 'you are, informal'],
              ['él es', 'he is'],
              ['ella es', 'she is'],
            ],
            ['es-yo-soy', 'es-vos-sos', 'es-el-es', 'es-ella-es'],
            { id: 'es.ex.xcojiwbzx60n21' },
          ),
          ex.fillBlank(
            'Yo ___ estudiante.',
            'I am a student.',
            'soy',
            ['sos', 'es', 'está'],
            ['es-yo-soy', 'es-estudiante'],
            {
              id: 'es.ex.0l92ng5teryie8',
              explanation:
                'With yo the verb is soy. Sos goes with vos and es with él, ella or usted. Notice: no word for “a” before estudiante.',
            },
          ),
          ex.listenChoice(
            'Vos sos estudiante.',
            ['Yo soy estudiante.', 'Ella es estudiante.', 'Usted es estudiante.'],
            ['es-vos-sos', 'es-estudiante'],
            { id: 'es.ex.wtq7ew3802onjt' },
          ),
          ex.fillBlank(
            'Buen día, señora. ¿Usted ___ Lucía?',
            'Good morning, madam. Are you Lucía?',
            'es',
            ['sos', 'soy', 'estás'],
            ['es-usted-es'],
            {
              id: 'es.ex.qo5rncw1956msw',
              explanation:
                'Usted takes the same verb as él and ella: usted es. Sos is for vos, a friend.',
            },
          ),
          ex.translationChoice(
            'usted es',
            'you are, formal',
            ['you are, informal', 'he is', 'I am'],
            ['es-usted-es'],
            { id: 'es.ex.pi81f7ok2vw5kd' },
          ),
          ex.orderWords(
            'Ella es estudiante.',
            'She is a student.',
            ['es-ella-es', 'es-estudiante'],
            {
              id: 'es.ex.lo5t5ci9mojwro',
            },
          ),
          ex.translateWrite(
            'He is a student.',
            'Él es estudiante.',
            ['es-el-es', 'es-estudiante'],
            {
              id: 'es.ex.z5xt1uz9gkgnf1',
              acceptedAnswers: ['Es estudiante.'],
            },
          ),
          ex.shortAnswer(
            '¿Vos sos estudiante?',
            'Answer yes and say you are a student (e.g. «Sí, soy estudiante»).',
            'Sí, soy estudiante.',
            ['Sí, soy estudiante', 'Sí, yo soy estudiante.', 'Sí. Soy estudiante.'],
            ['es-yo-soy', 'es-estudiante'],
            { id: 'es.ex.fz12iyc0046cj2' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Argentino, argentina',
        objective: 'Say your nationality and other people’s, for a man or a woman.',
        intro: {
          explanation:
            'Nationalities are written with a small letter and change for women: argentino → argentina, italiano → italiana, brasileño → brasileña. Inglés and francés lose their accent in the feminine: inglesa, francesa. The written accent marks the stressed syllable: in-GLÉS, fran-CÉS. Estadounidense (from the US) is the same for men and women. The c in francés sounds like an s.',
          examples: [
            {
              target: 'Martín es argentino. Lucía es argentina.',
              base: 'Martín is Argentine. Lucía is Argentine.',
            },
            { target: 'Emma es inglesa.', base: 'Emma is English.' },
          ],
        },
        takeaways: [
          'You change -o to -a for a woman: italiano, italiana.',
          'You write inglesa and francesa without an accent.',
        ],
        exercises: [
          ex.translationChoice(
            'argentino',
            'Argentine',
            ['Brazilian', 'Italian', 'French'],
            ['es-argentino'],
            { id: 'es.ex.ycjkmprs2bxitv' },
          ),
          ex.matchPairs(
            [
              ['inglés', 'English'],
              ['brasileño', 'Brazilian'],
              ['italiano', 'Italian'],
              ['francés', 'French'],
            ],
            ['es-ingles', 'es-brasileno', 'es-italiano', 'es-frances'],
            { id: 'es.ex.xyrk5g4b14je2k' },
          ),
          ex.fillBlank(
            'Lucía es ___.',
            'Lucía is Argentine.',
            'argentina',
            ['argentino', 'italiano', 'brasileño'],
            ['es-argentino'],
            {
              id: 'es.ex.g8m49egcgilfp9',
              explanation: 'Lucía is a woman, so argentino becomes argentina.',
            },
          ),
          ex.listenChoice(
            'Él es inglés.',
            ['Ella es inglesa.', 'Él es francés.', 'Él es italiano.'],
            ['es-ingles', 'es-el-es'],
            { id: 'es.ex.t4qyyx0hqxybu5' },
          ),
          ex.fillBlank(
            'Emma es ___.',
            'Emma is English.',
            'inglesa',
            ['inglés', 'francesa', 'italiana'],
            ['es-ingles'],
            {
              id: 'es.ex.if5a7v9u16bhlo',
              explanation:
                'For a woman: inglesa. The accent of inglés disappears because the stress no longer falls on the last syllable.',
            },
          ),
          ex.translationChoice(
            'estadounidense',
            'American',
            ['English', 'Argentine', 'Brazilian'],
            ['es-estadounidense'],
            { id: 'es.ex.g8ksixvwgyx2nq' },
          ),
          ex.fillBlank(
            'Ella es ___, de Nueva York.',
            'She is American, from New York.',
            'estadounidense',
            ['brasileña', 'italiana', 'francesa'],
            ['es-estadounidense'],
            {
              id: 'es.ex.9t26wrriiz3qqx',
              skill: 'vocabulary',
              explanation:
                'Someone from the US is estadounidense, for a man or a woman: words ending in -e do not change.',
            },
          ),
          ex.orderWords(
            'Marco es italiano y Claire es francesa.',
            'Marco is Italian and Claire is French.',
            ['es-italiano', 'es-frances'],
            { id: 'es.ex.bjil7jov6w00rq' },
          ),
          ex.translateWrite(
            'She is Brazilian.',
            'Ella es brasileña.',
            ['es-brasileno', 'es-ella-es'],
            {
              id: 'es.ex.arj5vi0t47umwi',
              acceptedAnswers: ['Es brasileña.'],
            },
          ),
          ex.shortAnswer(
            '¿Martín es argentino?',
            'Answer yes (e.g. «Sí, es argentino»).',
            'Sí, es argentino.',
            ['Sí, es argentino', 'Sí, él es argentino.', 'Sí, Martín es argentino.'],
            ['es-argentino', 'es-el-es'],
            { id: 'es.ex.mv3ntp2ikxojht' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿De dónde sos?',
        objective: 'Ask where someone is from and say your country and city.',
        intro: {
          explanation:
            'To ask a friend: ¿de dónde sos? With usted: ¿de dónde es usted? To answer: soy de + place. El país (the country) is masculine and la ciudad (the city) is feminine: the article tells you the gender. In país the stress falls on the í, and in ciudad the c sounds like an s.',
          examples: [
            {
              target: '¿De dónde sos? — Soy de Córdoba.',
              base: 'Where are you from? — I’m from Córdoba.',
            },
            { target: '¿De dónde es usted, señor?', base: 'Where are you from, sir?' },
          ],
        },
        takeaways: ['You ask ¿de dónde sos? and answer soy de…', 'You say el país and la ciudad.'],
        exercises: [
          ex.translationChoice(
            '¿de dónde sos?',
            'where are you from?',
            ['how are you?', "what's your name?", 'and you?, informal'],
            ['es-de-donde-sos'],
            { id: 'es.ex.3qatkp7u4wqfkd' },
          ),
          ex.fillBlank(
            '¿De dónde ___? — Soy de Mendoza.',
            'Where are you from? — I’m from Mendoza.',
            'sos',
            ['soy', 'llamás', 'estás'],
            ['es-de-donde-sos', 'es-soy-de'],
            {
              id: 'es.ex.mdqdzp40vxfiw9',
              explanation:
                'To ask where a friend is from, use ser: ¿de dónde sos? Estás is for how someone is.',
            },
          ),
          ex.listenChoice(
            'Soy de Córdoba.',
            ['Soy de Rosario.', 'Soy de Roma.', 'Sos de Córdoba.'],
            ['es-soy-de'],
            { id: 'es.ex.dt2zrddoyq5qyl' },
          ),
          ex.matchPairs(
            [
              ['el país', 'the country'],
              ['la ciudad', 'the city'],
              ['soy de', "I'm from"],
              ['¿de dónde sos?', 'where are you from?'],
            ],
            ['es-el-pais', 'es-la-ciudad', 'es-soy-de', 'es-de-donde-sos'],
            { id: 'es.ex.c5xndynymaeigv' },
          ),
          ex.fillBlank(
            'Rosario es una ___ argentina.',
            'Rosario is an Argentine city.',
            'ciudad',
            ['país', 'señora', 'estudiante'],
            ['es-la-ciudad'],
            {
              id: 'es.ex.mu9bfgv3k3tq43',
              skill: 'vocabulary',
              explanation:
                'Rosario is a city: una ciudad. Notice the adjective comes after the noun: una ciudad argentina.',
            },
          ),
          ex.fillBlank(
            'Brasil es ___ país.',
            'Brazil is a country.',
            'un',
            ['una', 'la', 'de'],
            ['es-el-pais'],
            {
              id: 'es.ex.l2w5kzfm9x290n',
              explanation:
                'País is masculine (el país), so “a country” is un país. Ciudad is feminine: una ciudad.',
            },
          ),
          question(
            'es.ex.fr17yim909uk36',
            CLASE,
            'Where is Kevin from?',
            'New York',
            ['Buenos Aires', 'Rosario', 'London'],
            ['es-de-donde-sos', 'es-soy-de'],
            'Kevin says “Soy estadounidense, de Nueva York”.',
          ),
          question(
            'es.ex.yruhwllu3w9ij5',
            CLASE,
            'Is Lucía from Buenos Aires?',
            'No, she is from Rosario',
            ['Yes, she is', 'No, she is from New York', 'No, she is from Córdoba'],
            ['es-soy-de', 'es-la-ciudad'],
            'Lucía answers “No, soy de Rosario, una ciudad de Argentina”.',
          ),
          ex.translateWrite("I'm from Buenos Aires.", 'Soy de Buenos Aires.', ['es-soy-de'], {
            id: 'es.ex.vh2ql1fjt6b9ch',
            acceptedAnswers: ['Yo soy de Buenos Aires.'],
          }),
          ex.shortAnswer(
            '¿De dónde sos?',
            'Say you are from Mendoza (start with «Soy de»).',
            'Soy de Mendoza.',
            ['Soy de Mendoza', 'Yo soy de Mendoza.'],
            ['es-soy-de', 'es-de-donde-sos'],
            { id: 'es.ex.5qmbh8418emyvj' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Vivo en…, hablo…',
        objective: 'Say where you live and which languages you speak, and say no.',
        intro: {
          explanation:
            'Vivo en + place: I live in. Hablo + language: I speak. Languages are not capitalized: inglés, español, italiano. To say no, put no before the verb: no hablo francés. También means also or too: yo también hablo inglés. Careful: vivo is I live, vive is he or she lives.',
          examples: [
            {
              target: 'Vivo en Buenos Aires. Hablo inglés y español.',
              base: 'I live in Buenos Aires. I speak English and Spanish.',
            },
            { target: 'No hablo francés.', base: 'I don’t speak French.' },
          ],
        },
        takeaways: [
          'You say where you live with vivo en and your languages with hablo.',
          'You make a sentence negative with no before the verb.',
        ],
        exercises: [
          ex.translationChoice(
            'vivo en',
            'I live in',
            ["I'm from", 'I speak', 'I am'],
            ['es-vivo-en'],
            { id: 'es.ex.reg8b2vteudxx4' },
          ),
          ex.translationChoice('hablo', 'I speak', ['I live in', 'I am', 'also'], ['es-hablo'], {
            id: 'es.ex.unks9chrkx3e0a',
          }),
          ex.fillBlank(
            '___ en Córdoba.',
            'I live in Córdoba.',
            'Vivo',
            ['Vive', 'Hablo', 'Soy'],
            ['es-vivo-en'],
            {
              id: 'es.ex.zu7p5u9x43u1x1',
              explanation: 'I live is vivo. Vive means he or she lives. Soy en is not correct.',
            },
          ),
          ex.listenChoice(
            'Vivo en Rosario.',
            ['Vive en Rosario.', 'Vivís en Rosario.', 'Soy de Rosario.'],
            ['es-vivo-en'],
            { id: 'es.ex.cy2f1y8rwach74' },
          ),
          ex.fillBlank(
            'Emma ___ inglés y español.',
            'Emma speaks English and Spanish.',
            'habla',
            ['hablo', 'hablás', 'vive'],
            ['es-hablo'],
            {
              id: 'es.ex.7n6aahc278lgxd',
              explanation:
                'With Emma (she) the verb ends in -a: habla. Hablo is I speak and hablás is you speak (vos).',
            },
          ),
          ex.fillBlank(
            'Soy argentina, pero ___ vivo en Argentina.',
            'I’m Argentine, but I don’t live in Argentina.',
            'no',
            ['sí', 'también', 'muy'],
            ['es-vivo-en', 'es-argentino'],
            {
              id: 'es.ex.9jh6dp45ivir0o',
              explanation: 'To say no, put no right before the verb: no vivo.',
            },
          ),
          ex.orderWords(
            'Yo también hablo italiano.',
            'I speak Italian too.',
            ['es-tambien', 'es-hablo', 'es-italiano'],
            { id: 'es.ex.myetbeihaa4m7q' },
          ),
          ex.listenChoice(
            'No hablo francés.',
            ['Hablo francés.', 'No hablo inglés.', 'Yo también hablo francés.'],
            ['es-hablo', 'es-frances'],
            { id: 'es.ex.o56dpziqrgnxdg' },
          ),
          ex.translateWrite(
            "I don't speak Italian.",
            'No hablo italiano.',
            ['es-hablo', 'es-italiano'],
            {
              id: 'es.ex.cdjraungqmzaim',
              acceptedAnswers: ['Yo no hablo italiano.'],
            },
          ),
          ex.shortAnswer(
            '¿Hablás inglés?',
            'Say yes, and that you also speak Spanish (e.g. «Sí, y también hablo español»).',
            'Sí, y también hablo español.',
            [
              'Sí, y también hablo español',
              'Sí, hablo inglés y también hablo español.',
              'Sí, y yo también hablo español.',
              'Sí. Y también hablo español.',
            ],
            ['es-hablo', 'es-tambien'],
            { id: 'es.ex.arkgf50xymtn6z' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿De dónde es Marco?',
        objective: 'Understand a short introduction and a profile, and introduce yourself.',
        intro: {
          explanation:
            'Buenos Aires has many foreign students, and on a language exchange app people introduce themselves like this: name, nationality, city and languages. Remember: un poco de español means a little Spanish.',
          examples: [
            {
              target: 'Me llamo Marco y soy italiano, de Roma.',
              base: 'My name is Marco and I’m Italian, from Rome.',
            },
            {
              target: 'Hablo inglés y un poco de español.',
              base: 'I speak English and a little Spanish.',
            },
          ],
        },
        takeaways: [
          'You understand a short profile with name, nationality, city and languages.',
          'You introduce yourself in two or three sentences.',
        ],
        exercises: [
          question(
            'es.ex.nw4xz4o6q9qcev',
            PERFIL,
            'Where is Marco from?',
            'Rome, in Italy',
            ['Buenos Aires', 'Paris, in France', 'London'],
            ['es-italiano'],
            'Marco writes “soy italiano, de Roma”.',
          ),
          question(
            'es.ex.nfsyrxquf3hz8c',
            PERFIL,
            'Where does Marco live?',
            'In Buenos Aires',
            ['In Rome', 'In Paris', 'In Rosario'],
            ['es-vivo-en'],
            'He writes “Vivo en Buenos Aires”.',
          ),
          question(
            'es.ex.pt73piez955lsy',
            PERFIL,
            'Which language does Marco NOT speak?',
            'French',
            ['Italian', 'English', 'Spanish'],
            ['es-hablo', 'es-frances'],
            'He writes “No hablo francés”.',
          ),
          question(
            'es.ex.cx4jfi73c89bb2',
            PERFIL,
            'What does Marco do?',
            'He is a student',
            ['He is a teacher', 'He is a tourist', 'He doesn’t say'],
            ['es-estudiante'],
            'He writes “soy estudiante”.',
          ),
          question(
            'es.ex.th3d1en27s8azi',
            CLASE,
            'What nationality is Kevin?',
            'American',
            ['English', 'Argentine', 'Italian'],
            ['es-estadounidense'],
            'Kevin says “Soy estadounidense”: he is from the US.',
          ),
          ex.listenChoice(
            'Ella es francesa.',
            ['Él es francés.', 'Ella es inglesa.', 'Ella es italiana.'],
            ['es-frances', 'es-ella-es'],
            { id: 'es.ex.w4a1g3lcjpufc5' },
          ),
          ex.fillBlank(
            'Kevin es de Nueva York. ___ estadounidense.',
            'Kevin is from New York. He is American.',
            'Es',
            ['Sos', 'Soy', 'Está'],
            ['es-el-es', 'es-estadounidense'],
            {
              id: 'es.ex.7oyai4of5s1b5v',
              explanation:
                'Spanish often drops él: es estadounidense = he is American. Está is not used for nationality.',
            },
          ),
          ex.translateWrite(
            'My name is Marco. I am Italian and I live in Buenos Aires.',
            'Me llamo Marco. Soy italiano y vivo en Buenos Aires.',
            ['es-yo-soy', 'es-italiano', 'es-vivo-en'],
            {
              id: 'es.ex.28qyagtx1qamlj',
              acceptedAnswers: [
                'Me llamo Marco. Yo soy italiano y vivo en Buenos Aires.',
                'Me llamo Marco, soy italiano y vivo en Buenos Aires.',
                'Me llamo Marco. Soy italiano, y vivo en Buenos Aires.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿De dónde es usted?',
            'Someone asks you formally. Say you are from London (start with «Soy de»).',
            'Soy de Londres.',
            ['Soy de Londres', 'Yo soy de Londres.'],
            ['es-soy-de', 'es-usted-es'],
            { id: 'es.ex.crwc38p5mdhxho' },
          ),
        ],
      },
    ],
  },
};

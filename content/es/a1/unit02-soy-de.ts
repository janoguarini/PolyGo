import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U2 «Where are you from?» (docs/ES_A1_A2.md): pronombres personales y ser en singular
 * (yo soy, tú eres, él / ella / usted es), nacionalidades con género (mexicano / mexicana, inglés /
 * inglesa), soy de, vivo en, hablo + idioma y la negación con no delante del verbo. Variante: español
 * neutro de Latinoamérica (tú, usted, ustedes).
 * Pronunciación: la sílaba tónica y la tilde (inglés, francés, país) y el seseo (ciudad, francés).
 * Cultura: la única mención del voseo del curso (vos sos = tú eres, en la gramática, declarado en
 * contrast); Ciudad de México, Bogotá y Buenos Aires como ciudades de estudiantes extranjeros.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CLASE = dialogue(
  'es.stim.a1-u2-clase',
  'Two students meet on the first day of a Spanish class in Mexico City.',
  [
    ['Lucía', '¡Hola! Me llamo Lucía. ¿Y tú?'],
    ['Kevin', 'Me llamo Kevin. Mucho gusto.'],
    ['Lucía', '¿De dónde eres, Kevin?'],
    ['Kevin', 'Soy estadounidense, de Nueva York. ¿Eres de la Ciudad de México?'],
    ['Lucía', 'No, soy de Guadalajara, una ciudad de México.'],
  ],
  ES_A1_RATE,
);

const PERFIL = reading(
  'es.stim.a1-u2-perfil',
  'post',
  'Marco’s profile on a language exchange app.',
  [
    '¡Hola! Me llamo Marco y soy italiano, de Roma.',
    'Vivo en Bogotá y soy estudiante.',
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
    'México',
    'Buenos Aires',
    'Guadalajara',
    'Bogotá',
    'Lima',
    'Rosario',
    'Córdoba',
    'Mendoza',
    'Roma',
    'París',
    'Londres',
    'Nueva York',
  ],
  support: ['español', 'portugués', 'vive', 'habla', 'pero', 'un', 'una', 'qué', 'poco'],
  contrast: ['vos', 'sos'],
  unit: {
    position: 2,
    title: 'Where are you from?',
    titleEn: '¿De dónde eres?',
    description:
      'Say who you are with ser (yo soy, tú eres, él / ella / usted es), your nationality, where you are from, where you live and which languages you speak.',
    emoji: '🌎',
    objective:
      'You can say who you are, your nationality, where you are from, where you live and which languages you speak, and ask other people the same.',
    grammar: {
      title: 'Ser in the singular · nationalities · no',
      explanation:
        'Ser (to be) in the singular: yo soy, tú eres, él es, ella es, usted es. Ser is irregular, so learn the forms as a set. Usted takes the same form as él and ella: usted es. Spanish often drops the pronoun, because the verb already tells you who: soy estudiante, eres estudiante — and notice there is no word for “a” before a job or role. In Argentina, Uruguay and parts of Central America you’ll also hear vos (vos sos = tú eres); you only need to understand it. Nationalities are not capitalized and change for women: mexicano → mexicana, italiano → italiana, inglés → inglesa, francés → francesa (the accent disappears because the stress no longer falls on the last syllable). Words ending in -e stay the same: estadounidense. To say no, put no before the verb: no hablo francés. The c in ciudad and francés sounds like an s.',
      examples: [
        {
          target: 'Yo soy estudiante. ¿Tú también eres estudiante?',
          base: 'I am a student. Are you a student too?',
        },
        {
          target: 'Él es argentino y ella es inglesa.',
          base: 'He is Argentine and she is English.',
        },
        {
          target: 'Tú eres de Rosario. (Vos sos de Rosario.)',
          base: 'You are from Rosario. (The vos form, heard in Argentina and Uruguay.)',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U2), convertido al español neutro con tú. Sin revisión nativa: revisar «de Argentina» frente a «de la Argentina» (las dos se oyen; usamos la forma sin artículo), «estadounidense» como gentilicio de EE. UU. (en el habla se oye también «norteamericano»), la palabra nueva «mexicano» y la única mención del voseo del curso (vos sos = tú eres, en la gramática, declarada en contrast).',
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
        'es-tu-eres',
        'tú eres',
        'you are, informal',
        'Yo soy Lucía. ¿Tú eres Martín?',
        'I’m Lucía. Are you Martín?',
        ['verbs', 'pronouns'],
        { acceptedTranslations: ["you're, informal"], acceptedTexts: ['eres', 'vos sos', 'sos'] },
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
        'es-mexicano',
        'mexicano',
        'Mexican',
        'Lucía es mexicana, de Guadalajara.',
        'Lucía is Mexican, from Guadalajara.',
        ['nationalities'],
        { acceptedTexts: ['mexicana'], emoji: '🇲🇽' },
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
        'es-de-donde-eres',
        '¿de dónde eres?',
        'where are you from?',
        '¡Hola! ¿De dónde eres?',
        'Hi! Where are you from?',
        ['questions'],
        { acceptedTexts: ['¿de dónde sos?'] },
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
      w('es-vivo-en', 'vivo en', 'I live in', 'Vivo en Lima.', 'I live in Lima.', ['verbs']),
      w('es-hablo', 'hablo', 'I speak', 'Hablo inglés y español.', 'I speak English and Spanish.', [
        'verbs',
        'languages',
      ]),
      w(
        'es-el-pais',
        'el país',
        'the country',
        '¿De qué país eres?',
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
        title: 'Yo soy, tú eres',
        objective: 'Say who you are and who other people are with ser.',
        intro: {
          explanation:
            'Ser means to be, and it is irregular: yo soy (I am), tú eres (you are, to a friend), él es (he is), ella es (she is) and usted es (you are, formal). Spanish usually drops the pronoun: soy estudiante, ¿eres estudiante? And there is no “a” before a role: soy estudiante = I am a student.',
          examples: [
            { target: 'Yo soy estudiante.', base: 'I am a student.' },
            { target: 'Ella es Lucía. Él es Diego.', base: 'She is Lucía. He is Diego.' },
          ],
        },
        takeaways: [
          'You use yo soy, tú eres, él es, ella es and usted es.',
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
            'tú eres',
            'you are, informal',
            ['you are, formal', 'I am', 'she is'],
            ['es-tu-eres'],
            { id: 'es.ex.1qkzdd0o5kc3g4' },
          ),
          ex.matchPairs(
            [
              ['yo soy', 'I am'],
              ['tú eres', 'you are, informal'],
              ['él es', 'he is'],
              ['ella es', 'she is'],
            ],
            ['es-yo-soy', 'es-tu-eres', 'es-el-es', 'es-ella-es'],
            { id: 'es.ex.mqp67lgx6jr0gv' },
          ),
          ex.fillBlank(
            'Yo ___ estudiante.',
            'I am a student.',
            'soy',
            ['eres', 'es', 'está'],
            ['es-yo-soy', 'es-estudiante'],
            {
              id: 'es.ex.0l92ng5teryie8',
              explanation:
                'With yo the verb is soy. Eres goes with tú and es with él, ella or usted. Notice: no word for “a” before estudiante.',
            },
          ),
          ex.listenChoice(
            'Tú eres estudiante.',
            ['Yo soy estudiante.', 'Ella es estudiante.', 'Usted es estudiante.'],
            ['es-tu-eres', 'es-estudiante'],
            { id: 'es.ex.4xt1hpuxcur5k0' },
          ),
          ex.fillBlank(
            'Buenos días, señora. ¿Usted ___ Lucía?',
            'Good morning, madam. Are you Lucía?',
            'es',
            ['eres', 'soy', 'estás'],
            ['es-usted-es'],
            {
              id: 'es.ex.qo5rncw1956msw',
              explanation:
                'Usted takes the same verb as él and ella: usted es. Eres is for tú, a friend.',
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
            '¿Eres estudiante?',
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
        title: 'Mexicano, mexicana',
        objective: 'Say your nationality and other people’s, for a man or a woman.',
        intro: {
          explanation:
            'Nationalities are written with a small letter and change for women: mexicano → mexicana, argentino → argentina, italiano → italiana, brasileño → brasileña. Inglés and francés lose their accent in the feminine: inglesa, francesa. The written accent marks the stressed syllable: in-GLÉS, fran-CÉS. Estadounidense (from the US) is the same for men and women. The c in francés sounds like an s.',
          examples: [
            {
              target: 'Martín es argentino. Lucía es mexicana.',
              base: 'Martín is Argentine. Lucía is Mexican.',
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
            'Lucía is Mexican.',
            'mexicana',
            ['mexicano', 'italiano', 'brasileño'],
            ['es-mexicano'],
            {
              id: 'es.ex.nf8hc2lc4q5515',
              explanation: 'Lucía is a woman, so mexicano becomes mexicana.',
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
            ['English', 'Mexican', 'Brazilian'],
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
        title: '¿De dónde eres?',
        objective: 'Ask where someone is from and say your country and city.',
        intro: {
          explanation:
            'To ask a friend: ¿de dónde eres? With usted: ¿de dónde es usted? To answer: soy de + place. El país (the country) is masculine and la ciudad (the city) is feminine: the article tells you the gender. In país the stress falls on the í, and in ciudad the c sounds like an s.',
          examples: [
            {
              target: '¿De dónde eres? — Soy de Bogotá.',
              base: 'Where are you from? — I’m from Bogotá.',
            },
            { target: '¿De dónde es usted, señor?', base: 'Where are you from, sir?' },
          ],
        },
        takeaways: ['You ask ¿de dónde eres? and answer soy de…', 'You say el país and la ciudad.'],
        exercises: [
          ex.translationChoice(
            '¿de dónde eres?',
            'where are you from?',
            ['how are you?', "what's your name?", 'and you?, informal'],
            ['es-de-donde-eres'],
            { id: 'es.ex.si63pbi7959lom' },
          ),
          ex.fillBlank(
            '¿De dónde ___? — Soy de Mendoza.',
            'Where are you from? — I’m from Mendoza.',
            'eres',
            ['soy', 'llamas', 'estás'],
            ['es-de-donde-eres', 'es-soy-de'],
            {
              id: 'es.ex.jmk7gwobky8vtm',
              explanation:
                'To ask where a friend is from, use ser: ¿de dónde eres? Estás is for how someone is.',
            },
          ),
          ex.listenChoice(
            'Soy de Córdoba.',
            ['Soy de Rosario.', 'Soy de Roma.', 'Es de Córdoba.'],
            ['es-soy-de'],
            { id: 'es.ex.dt2zrddoyq5qyl' },
          ),
          ex.matchPairs(
            [
              ['el país', 'the country'],
              ['la ciudad', 'the city'],
              ['soy de', "I'm from"],
              ['¿de dónde eres?', 'where are you from?'],
            ],
            ['es-el-pais', 'es-la-ciudad', 'es-soy-de', 'es-de-donde-eres'],
            { id: 'es.ex.1nz4mfo6w5qvu3' },
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
            'es.ex.y57ox013wzhglt',
            CLASE,
            'Where is Kevin from?',
            'New York',
            ['Mexico City', 'Guadalajara', 'London'],
            ['es-de-donde-eres', 'es-soy-de'],
            'Kevin says “Soy estadounidense, de Nueva York”.',
          ),
          question(
            'es.ex.yruhwllu3w9ij5',
            CLASE,
            'Is Lucía from Mexico City?',
            'No, she is from Guadalajara',
            ['Yes, she is', 'No, she is from New York', 'No, she is from Bogotá'],
            ['es-soy-de', 'es-la-ciudad'],
            'Lucía answers “No, soy de Guadalajara, una ciudad de México”.',
          ),
          ex.translateWrite("I'm from Buenos Aires.", 'Soy de Buenos Aires.', ['es-soy-de'], {
            id: 'es.ex.vh2ql1fjt6b9ch',
            acceptedAnswers: ['Yo soy de Buenos Aires.'],
          }),
          ex.shortAnswer(
            '¿De dónde eres?',
            'Say you are from Mendoza (start with «Soy de»).',
            'Soy de Mendoza.',
            ['Soy de Mendoza', 'Yo soy de Mendoza.'],
            ['es-soy-de', 'es-de-donde-eres'],
            { id: 'es.ex.sjd9j4xge8iust' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Vivo en…, hablo…',
        objective: 'Say where you live and which languages you speak, and say no.',
        intro: {
          explanation:
            'Vivo en + place: I live in. Hablo + language: I speak. Languages are not capitalized: inglés, español, italiano. To say no, put no before the verb: no hablo francés. También means also or too: yo también hablo inglés. Careful with the endings: vivo is I live, vive is he or she lives; hablo is I speak, habla is he or she speaks.',
          examples: [
            {
              target: 'Vivo en Bogotá. Hablo inglés y español.',
              base: 'I live in Bogotá. I speak English and Spanish.',
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
            ['Vive en Rosario.', 'Vives en Rosario.', 'Soy de Rosario.'],
            ['es-vivo-en'],
            { id: 'es.ex.cy2f1y8rwach74' },
          ),
          ex.fillBlank(
            'Emma ___ inglés y español.',
            'Emma speaks English and Spanish.',
            'habla',
            ['hablo', 'hablas', 'vive'],
            ['es-hablo'],
            {
              id: 'es.ex.7n6aahc278lgxd',
              explanation:
                'With Emma (she) the verb ends in -a: habla. Hablo is I speak and hablas is you speak (tú).',
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
            '¿Hablas inglés?',
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
            'Cities like Mexico City, Bogotá and Buenos Aires have many foreign students, and on a language exchange app people introduce themselves like this: name, nationality, city and languages. Remember: un poco de español means a little Spanish.',
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
            ['Bogotá', 'Paris, in France', 'London'],
            ['es-italiano'],
            'Marco writes “soy italiano, de Roma”.',
          ),
          question(
            'es.ex.nfsyrxquf3hz8c',
            PERFIL,
            'Where does Marco live?',
            'In Bogotá',
            ['In Rome', 'In Paris', 'In Lima'],
            ['es-vivo-en'],
            'He writes “Vivo en Bogotá”.',
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
            ['English', 'Mexican', 'Italian'],
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
            ['Eres', 'Soy', 'Está'],
            ['es-el-es', 'es-estadounidense'],
            {
              id: 'es.ex.7oyai4of5s1b5v',
              explanation:
                'Spanish often drops él: es estadounidense = he is American. Está is not used for nationality.',
            },
          ),
          ex.translateWrite(
            'My name is Marco. I am Italian and I live in Bogotá.',
            'Me llamo Marco. Soy italiano y vivo en Bogotá.',
            ['es-yo-soy', 'es-italiano', 'es-vivo-en'],
            {
              id: 'es.ex.28qyagtx1qamlj',
              acceptedAnswers: [
                'Me llamo Marco. Yo soy italiano y vivo en Bogotá.',
                'Me llamo Marco, soy italiano y vivo en Bogotá.',
                'Me llamo Marco. Soy italiano, y vivo en Bogotá.',
                'Me llamo Marco. Soy italiano y vivo en Bogota.',
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

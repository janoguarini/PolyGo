import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U15 «Months and dates» (docs/ES_A1_A2.md): los meses (en minúscula), en + mes, la fecha
 * con el + número + de + mes (el 9 de julio, el primero de mayo; también «el uno»), ¿qué fecha es hoy?,
 * el cumpleaños y nací (primer pasado, como fórmula; nació y naciste, de tú, en el apoyo). Español
 * neutro de Latinoamérica (tú y ustedes).
 * Cultura: fechas patrias de varios países (16 de septiembre en México, 20 de julio en Colombia, 28 de
 * julio en el Perú, 9 de julio en la Argentina); las estaciones dependen del hemisferio.
 * Pronunciación: la y de mayo (como la y inglesa de yes) y la j de junio y julio (h fuerte); junio /
 * julio.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CUMPLE = dialogue(
  'es.stim.a1-u15-cumple',
  'Camila and Tomás talk about their birthdays at school.',
  [
    ['Tomás', 'Camila, ¿cuándo es tu cumpleaños?'],
    ['Camila', 'Es el 9 de julio. ¿Y tú?'],
    ['Tomás', 'Yo nací el primero de marzo.'],
    ['Camila', '¿Qué fecha es hoy?'],
    ['Tomás', 'Hoy es el 28 de febrero.'],
    ['Camila', '¡Mañana es tu cumpleaños!'],
  ],
  ES_A1_RATE,
);

const POSTEO = reading(
  'es.stim.a1-u15-posteo',
  'post',
  'Lucía writes a post on social media.',
  [
    '¡Hoy es mi cumpleaños!',
    'Nací el 15 de octubre en Guadalajara.',
    'Hoy tengo veinte años.',
    'El sábado hay una fiesta con mi familia.',
    '¡Gracias a todos!',
    'Lucía',
  ],
  { from: 'Lucía' },
);

export const ES_A1_U15: EsUnitDef = {
  names: [
    'Lucía',
    'Camila',
    'Tomás',
    'Sofía',
    'Martín',
    'Guadalajara',
    'Cusco',
    'Cartagena',
    'Bogotá',
    'México',
  ],
  support: ['cuándo', 'nació', 'naciste', 'fiesta', 'patria', 'navidad'],
  unit: {
    position: 15,
    title: 'Months and dates',
    titleEn: 'Fechas y cumpleaños',
    description:
      'Learn the months, say and ask the date, talk about birthdays and say when and where you were born.',
    emoji: '🎂',
    objective:
      'You can say the months and the date, ask what the date is, talk about birthdays and say when and where you were born.',
    grammar: {
      title: 'Dates: el + number + de + month',
      explanation:
        'Months are written with a lowercase letter: enero, julio, diciembre. In a month = en + month: en diciembre. A date is el + number + de + month, with the day first: el 9 de julio (July 9). For the first day of the month most of Latin America says el primero (el primero de mayo); in Spain and some other places people say el uno. To ask the date: ¿qué fecha es hoy? — Hoy es el 20 de junio. To ask a friend about their birthday: ¿cuándo es tu cumpleaños? — Es el 3 de marzo. Nací means I was born: nací el 3 de marzo, nací en Bogotá (he or she was born: nació; you were born, with tú: naciste — ¿cuándo naciste?). The months don’t tell you the season everywhere: diciembre is summer in Chile and Argentina, but winter in Mexico and Spain.',
      examples: [
        { target: 'Hoy es el 9 de julio.', base: 'Today is July 9.' },
        { target: 'Nací el primero de marzo.', base: 'I was born on March 1.' },
        { target: 'Mi cumpleaños es en diciembre.', base: 'My birthday is in December.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U15), convertido al español neutro de Latinoamérica con tú (2026-11-21). Sin revisión nativa: revisar «el primero» frente a «el uno» (ambos se aceptan), «fecha patria» para las independencias (16 de septiembre en México, 20 de julio en Colombia, 28 de julio en el Perú, 9 de julio en la Argentina), «el 10 de mayo» como Día de la Madre en México, «el cumple» como forma informal aceptada, y «setiembre» como grafía aceptada. Las fechas van en cifras en ejercicios y estímulos (salvo los pares de escucha ocho / once y doce / dos).',
    },
    words: [
      w(
        'es-enero',
        'enero',
        'January',
        'Mi cumpleaños es en enero.',
        'My birthday is in January.',
        ['months'],
      ),
      w(
        'es-febrero',
        'febrero',
        'February',
        'Febrero es un mes corto.',
        'February is a short month.',
        ['months'],
      ),
      w('es-marzo', 'marzo', 'March', 'Nací el 3 de marzo.', 'I was born on March 3.', ['months']),
      w('es-abril', 'abril', 'April', 'En abril estudio mucho.', 'In April I study a lot.', [
        'months',
      ]),
      w(
        'es-mayo',
        'mayo',
        'May',
        'El 10 de mayo es el Día de la Madre en México.',
        'May 10 is Mother’s Day in Mexico.',
        ['months'],
      ),
      w(
        'es-junio',
        'junio',
        'June',
        'En junio tengo mucho trabajo.',
        'In June I have a lot of work.',
        ['months'],
      ),
      w(
        'es-julio',
        'julio',
        'July',
        'Mi hermana nació el 9 de julio.',
        'My sister was born on July 9.',
        ['months'],
      ),
      w('es-agosto', 'agosto', 'August', 'En agosto voy a Cusco.', 'In August I go to Cusco.', [
        'months',
      ]),
      w(
        'es-septiembre',
        'septiembre',
        'September',
        'Nací en septiembre.',
        'I was born in September.',
        ['months'],
        { acceptedTexts: ['setiembre'] },
      ),
      w(
        'es-octubre',
        'octubre',
        'October',
        'Mi abuela nació en octubre.',
        'My grandmother was born in October.',
        ['months'],
      ),
      w(
        'es-noviembre',
        'noviembre',
        'November',
        'Hoy es el 14 de noviembre.',
        'Today is November 14.',
        ['months'],
      ),
      w(
        'es-diciembre',
        'diciembre',
        'December',
        'El 25 de diciembre es Navidad.',
        'December 25 is Christmas.',
        ['months'],
        { emoji: '🎄' },
      ),
      w(
        'es-el-mes',
        'el mes',
        'the month',
        'Trabajo todo el mes.',
        'I work the whole month.',
        ['time'],
        { acceptedTranslations: ['month'] },
      ),
      w(
        'es-el-cumpleanos',
        'el cumpleaños',
        'the birthday',
        '¿Cuándo es tu cumpleaños?',
        'When is your birthday?',
        ['celebrations'],
        { acceptedTranslations: ['birthday'], acceptedTexts: ['el cumple'], emoji: '🎂' },
      ),
      w(
        'es-feliz-cumpleanos',
        '¡feliz cumpleaños!',
        'happy birthday!',
        '¡Feliz cumpleaños, Sofía!',
        'Happy birthday, Sofía!',
        ['celebrations'],
        { emoji: '🎉' },
      ),
      w(
        'es-que-fecha-es-hoy',
        '¿qué fecha es hoy?',
        "what's the date today?",
        '¿Qué fecha es hoy? — Es el 2 de mayo.',
        'What’s the date today? — It’s May 2.',
        ['time', 'questions'],
        { acceptedTranslations: ["what is today's date?", "what's today's date?"] },
      ),
      w(
        'es-el-primero',
        'el primero',
        'the first',
        'Hoy es el primero de junio.',
        'Today is June 1.',
        ['dates'],
        { acceptedTranslations: ['the 1st'] },
      ),
      w('es-naci', 'nací', 'I was born', 'Nací en Guadalajara.', 'I was born in Guadalajara.', [
        'verbs',
      ]),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Enero, febrero, marzo…',
        objective: 'Say the months from January to June and use en + month.',
        intro: {
          explanation:
            'Spanish months are written with a lowercase letter: enero, febrero, marzo, abril, mayo, junio. To say “in” a month, use en: en marzo. The j in junio sounds like a strong h, and the y in mayo sounds like the y in English yes. The school year doesn’t start in the same month everywhere: in Mexico it starts in agosto, but in Chile and Argentina it starts in marzo, after the southern summer holidays.',
          examples: [
            { target: 'En enero no trabajo.', base: 'I don’t work in January.' },
            { target: 'Febrero es un mes corto.', base: 'February is a short month.' },
          ],
        },
        takeaways: [
          'You know the months from enero to junio, written in lowercase.',
          'You say “in” a month with en: en marzo.',
        ],
        exercises: [
          ex.translationChoice('enero', 'January', ['June', 'February', 'May'], ['es-enero'], {
            id: 'es.ex.wkroh84be52kaq',
          }),
          ex.matchPairs(
            [
              ['enero', 'January'],
              ['febrero', 'February'],
              ['marzo', 'March'],
              ['abril', 'April'],
            ],
            ['es-enero', 'es-febrero', 'es-marzo', 'es-abril'],
            { id: 'es.ex.1mzvtx9ns99ee1' },
          ),
          ex.listenChoice('mayo', ['marzo', 'junio'], ['es-mayo', 'es-junio'], {
            id: 'es.ex.jzp8yb88aov1ng',
            explanation:
              'In mayo the y sounds like the y in yes; in junio the j is a strong h; marzo has an r and a z (said like s).',
          }),
          ex.fillBlank(
            'Febrero es un ___ corto.',
            'February is a short month.',
            'mes',
            ['año', 'día', 'semana'],
            ['es-el-mes', 'es-febrero'],
            {
              id: 'es.ex.eju4fcl74fobil',
              skill: 'vocabulary',
              explanation: 'El mes is the month; el año is the year and la semana is the week.',
            },
          ),
          ex.translationChoice('junio', 'June', ['July', 'January', 'May'], ['es-junio'], {
            id: 'es.ex.qqmq0yce250lca',
          }),
          ex.fillBlank(
            'Estudio mucho ___ abril.',
            'I study a lot in April.',
            'en',
            ['de', 'el', 'a'],
            ['es-abril'],
            {
              id: 'es.ex.7is36yuqs0h4j3',
              explanation: 'In + month = en + month, with no article: en abril.',
            },
          ),
          ex.translationChoice('mayo', 'May', ['March', 'June', 'April'], ['es-mayo'], {
            id: 'es.ex.f3ml1x74l6d5dk',
          }),
          ex.listenChoice(
            'En marzo trabajo mucho.',
            ['En mayo trabajo mucho.', 'En marzo estudio mucho.', 'En abril trabajo mucho.'],
            ['es-marzo', 'es-mayo'],
            { id: 'es.ex.imecnvq1vmwblr' },
          ),
          ex.translateWrite('I work a lot in June.', 'Trabajo mucho en junio.', ['es-junio'], {
            id: 'es.ex.zhmg7voe3uqdvn',
            acceptedAnswers: ['En junio trabajo mucho.', 'Yo trabajo mucho en junio.'],
          }),
          ex.translateWrite(
            'February is a short month.',
            'Febrero es un mes corto.',
            ['es-febrero', 'es-el-mes'],
            { id: 'es.ex.41ir7ziv4s3j38' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Julio, agosto…',
        objective: 'Say the months from July to December.',
        intro: {
          explanation:
            'The second half of the year: julio, agosto, septiembre (also written setiembre), octubre, noviembre, diciembre. Junio and julio differ only in n and l, so listen carefully. Seasons depend on the hemisphere: in Mexico and Spain julio is summer and diciembre is winter, but in Chile and Argentina it is the other way round, so Christmas there is hot!',
          examples: [
            { target: 'En julio voy a Cusco.', base: 'In July I go to Cusco.' },
            { target: 'En diciembre no trabajo.', base: 'I don’t work in December.' },
          ],
        },
        takeaways: [
          'You know the months from julio to diciembre.',
          'You can hear the difference between junio and julio.',
        ],
        exercises: [
          ex.translationChoice('julio', 'July', ['June', 'August', 'January'], ['es-julio'], {
            id: 'es.ex.3nj7wr2qmxsmlc',
          }),
          ex.listenChoice('julio', ['junio', 'mayo'], ['es-julio', 'es-junio'], {
            id: 'es.ex.kmcgcrjv1nygxp',
            explanation: 'Julio has an l; junio has an n. Both start with a strong h sound (j).',
          }),
          ex.matchPairs(
            [
              ['agosto', 'August'],
              ['septiembre', 'September'],
              ['octubre', 'October'],
              ['noviembre', 'November'],
            ],
            ['es-agosto', 'es-septiembre', 'es-octubre', 'es-noviembre'],
            { id: 'es.ex.nq07ek99q0kp92' },
          ),
          ex.fillBlank(
            'En ___ voy a Cusco.',
            'In July I go to Cusco.',
            'julio',
            ['junio', 'agosto', 'enero'],
            ['es-julio'],
            {
              id: 'es.ex.cx59w2dgqf3hyb',
              skill: 'vocabulary',
              explanation: 'July is julio; junio is June.',
            },
          ),
          ex.translationChoice(
            'diciembre',
            'December',
            ['November', 'September', 'October'],
            ['es-diciembre'],
            { id: 'es.ex.kbyvwggj4x5h02' },
          ),
          ex.listenChoice(
            'En octubre estudio mucho.',
            [
              'En agosto estudio mucho.',
              'En octubre trabajo mucho.',
              'En noviembre estudio mucho.',
            ],
            ['es-octubre', 'es-agosto', 'es-noviembre'],
            { id: 'es.ex.rw891ax43vxj9b' },
          ),
          ex.orderWords(
            'En diciembre voy a Cartagena.',
            'In December I go to Cartagena.',
            ['es-diciembre'],
            {
              id: 'es.ex.z1q6om0ohzlo0s',
            },
          ),
          ex.fillBlank(
            'Septiembre, octubre y ___.',
            'September, October and November.',
            'noviembre',
            ['diciembre', 'agosto', 'julio'],
            ['es-noviembre', 'es-septiembre'],
            {
              id: 'es.ex.3f6kpypv5ykfu1',
              skill: 'vocabulary',
              explanation: 'After octubre comes noviembre.',
            },
          ),
          ex.translateWrite("I don't work in August.", 'No trabajo en agosto.', ['es-agosto'], {
            id: 'es.ex.02mtqybe8jc2gc',
            acceptedAnswers: ['En agosto no trabajo.', 'Yo no trabajo en agosto.'],
          }),
          ex.translateWrite(
            'My sister goes to Bogotá in September.',
            'Mi hermana va a Bogotá en septiembre.',
            ['es-septiembre'],
            {
              id: 'es.ex.nqikkve47zn4qc',
              acceptedAnswers: [
                'Mi hermana va a Bogotá en setiembre.',
                'En septiembre mi hermana va a Bogotá.',
                'En setiembre mi hermana va a Bogotá.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: '¿Qué fecha es hoy?',
        objective: 'Ask and say the date.',
        intro: {
          explanation:
            'To ask the date: ¿qué fecha es hoy? Answer with el + number + de + month: hoy es el 9 de julio. Unlike English, the day comes before the month. For the first day of the month say el primero: el primero de mayo (in Spain and some other places people also say el uno de mayo). From the 2nd on, use the normal numbers: el dos, el tres…',
          examples: [
            {
              target: '¿Qué fecha es hoy? — Es el 20 de junio.',
              base: 'What’s the date today? — It’s June 20.',
            },
            { target: 'Hoy es el primero de octubre.', base: 'Today is October 1.' },
          ],
        },
        takeaways: [
          'You ask the date with ¿qué fecha es hoy?',
          'You say a date with el + number + de + month, and el primero for the 1st.',
        ],
        exercises: [
          ex.translationChoice(
            '¿qué fecha es hoy?',
            "what's the date today?",
            ['what time is it?', 'how old are you?', "what's this?"],
            ['es-que-fecha-es-hoy'],
            { id: 'es.ex.k9d3tahpylppj3' },
          ),
          ex.fillBlank(
            'Hoy es el 9 ___ julio.',
            'Today is July 9.',
            'de',
            ['en', 'a', 'el'],
            ['es-julio'],
            {
              id: 'es.ex.phca5fsfzxuwrc',
              explanation: 'A date is el + number + de + month: el 9 de julio.',
            },
          ),
          ex.listenChoice(
            'Hoy es el ocho de mayo.',
            ['Hoy es el once de mayo.', 'Hoy es el ocho de marzo.', 'Hoy es el doce de mayo.'],
            ['es-mayo', 'es-marzo'],
            { id: 'es.ex.hk50hc5hi6jsht' },
          ),
          ex.fillBlank(
            'Hoy es el ___ de mayo.',
            'Today is the first of May.',
            'primero',
            ['dos', 'diez', 'doce'],
            ['es-el-primero', 'es-mayo'],
            {
              id: 'es.ex.pv3b5mzp3tf5lx',
              skill: 'vocabulary',
              explanation: 'The first day of the month is el primero (also el uno).',
            },
          ),
          ex.translationChoice(
            'el primero',
            'the first',
            ['the month', 'the year', 'the week'],
            ['es-el-primero'],
            { id: 'es.ex.1s8xkzpdolwie2' },
          ),
          ex.orderWords(
            'Hoy es el primero de abril.',
            'Today is April 1.',
            ['es-el-primero', 'es-abril'],
            {
              id: 'es.ex.jsr9zxqows8vpf',
            },
          ),
          ex.listenChoice(
            'Es el doce de diciembre.',
            ['Es el dos de diciembre.', 'Es el doce de noviembre.', 'Es el diez de diciembre.'],
            ['es-diciembre', 'es-noviembre'],
            { id: 'es.ex.vmm6ctebl6wctf' },
          ),
          ex.fillBlank(
            '¿Qué ___ es hoy? — Es el 15 de agosto.',
            'What’s the date today? — It’s August 15.',
            'fecha',
            ['hora', 'mes', 'año'],
            ['es-que-fecha-es-hoy', 'es-agosto'],
            {
              id: 'es.ex.92r60kqo96zezx',
              skill: 'vocabulary',
              explanation:
                'The answer is a date, so the question is ¿qué fecha es hoy? ¿Qué hora es? asks the time.',
            },
          ),
          ex.shortAnswer(
            '¿Qué fecha es hoy?',
            'Answer: today is March 3 (start with «Hoy es…»).',
            'Hoy es el 3 de marzo.',
            [
              'Hoy es el tres de marzo.',
              'Es el 3 de marzo.',
              'Es el tres de marzo.',
              'Hoy es 3 de marzo.',
              'Hoy es tres de marzo.',
            ],
            ['es-que-fecha-es-hoy', 'es-marzo'],
            { id: 'es.ex.m3gnsauorm6to8' },
          ),
          ex.translateWrite(
            'Today is May 1.',
            'Hoy es el primero de mayo.',
            ['es-el-primero', 'es-mayo'],
            {
              id: 'es.ex.vh37kbpvamioxy',
              acceptedAnswers: [
                'Hoy es el uno de mayo.',
                'Hoy es el 1 de mayo.',
                'Hoy es 1 de mayo.',
                'Hoy es primero de mayo.',
                'Es el primero de mayo.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'El cumpleaños',
        objective: 'Talk about birthdays and say when and where you were born.',
        intro: {
          explanation:
            'To ask a friend about their birthday: ¿cuándo es tu cumpleaños? — Es el 9 de julio (or es en julio). Informally, many people say el cumple. On the day you say ¡feliz cumpleaños! To say when or where you were born: nací el 3 de marzo, nací en Bogotá. For another person (or usted): nació; to ask a friend (tú): ¿cuándo naciste?',
          examples: [
            {
              target: '¿Cuándo es tu cumpleaños? — Es el 9 de julio.',
              base: 'When is your birthday? — It’s July 9.',
            },
            { target: 'Nací en Bogotá, en octubre.', base: 'I was born in Bogotá, in October.' },
          ],
        },
        takeaways: [
          'You ask ¿cuándo es tu cumpleaños? and say ¡feliz cumpleaños!',
          'You say when and where you were born with nací.',
        ],
        exercises: [
          ex.translationChoice(
            'el cumpleaños',
            'the birthday',
            ['the month', 'the year', 'the week'],
            ['es-el-cumpleanos'],
            { id: 'es.ex.t2l1xyv7zxyoko' },
          ),
          ex.fillBlank(
            '¿Cuándo es tu ___?',
            'When is your birthday?',
            'cumpleaños',
            ['mes', 'año', 'primero'],
            ['es-el-cumpleanos'],
            {
              id: 'es.ex.zu6p0bl3ukro3h',
              skill: 'vocabulary',
              explanation: 'Birthday is el cumpleaños.',
            },
          ),
          ex.listenChoice(
            '¡Feliz cumpleaños, Sofía!',
            ['¡Feliz cumpleaños, Lucía!', '¡Hola, Sofía!', '¡Gracias, Sofía!'],
            ['es-feliz-cumpleanos'],
            { id: 'es.ex.7c0qn52dx5roic' },
          ),
          ex.fillBlank(
            '___ en Bogotá, en abril.',
            'I was born in Bogotá, in April.',
            'Nací',
            ['Nació', 'Naciste', 'Tengo'],
            ['es-naci', 'es-abril'],
            {
              id: 'es.ex.eb3ppapmvy42r8',
              explanation:
                'Nací = I was born. Nació is he, she or usted was born; naciste is you were born (tú).',
            },
          ),
          ex.translationChoice(
            'nací',
            'I was born',
            ['I live in', 'I have', 'I work'],
            ['es-naci'],
            { id: 'es.ex.f4x95qm8mqesp4' },
          ),
          ex.matchPairs(
            [
              ['el cumpleaños', 'the birthday'],
              ['¡feliz cumpleaños!', 'happy birthday!'],
              ['nací', 'I was born'],
              ['el mes', 'the month'],
            ],
            ['es-el-cumpleanos', 'es-feliz-cumpleanos', 'es-naci', 'es-el-mes'],
            { id: 'es.ex.az431xirpilpap' },
          ),
          ex.listenChoice(
            'Mi abuela nació en junio.',
            ['Mi abuela nació en julio.', 'Mi abuelo nació en junio.', 'Mi abuela nació en enero.'],
            ['es-naci', 'es-junio'],
            { id: 'es.ex.jf17frw0exijqx' },
          ),
          question(
            'es.ex.bwjbcsyk0ntv3t',
            CUMPLE,
            'When is Camila’s birthday?',
            'July 9',
            ['March 1', 'February 28', 'May 25'],
            ['es-el-cumpleanos', 'es-julio'],
            'Tomás asks “¿Cuándo es tu cumpleaños?” and Camila answers “Es el 9 de julio”.',
          ),
          ex.translateWrite(
            'I was born on March 1.',
            'Nací el primero de marzo.',
            ['es-naci', 'es-el-primero', 'es-marzo'],
            {
              id: 'es.ex.iofmun8dxgjulo',
              acceptedAnswers: [
                'Nací el uno de marzo.',
                'Nací el 1 de marzo.',
                'Yo nací el primero de marzo.',
                'Yo nací el uno de marzo.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cuándo es tu cumpleaños?',
            'Answer: it is in December (start with «Es en…»).',
            'Es en diciembre.',
            ['Mi cumpleaños es en diciembre.', 'En diciembre.'],
            ['es-el-cumpleanos', 'es-diciembre'],
            { id: 'es.ex.jm2icxednbqfu8' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Fechas patrias',
        objective: 'Understand dates and birthdays in a conversation and a post.',
        intro: {
          explanation:
            'Every Spanish-speaking country has its own fechas patrias (national holidays). Independence Day is el 16 de septiembre in Mexico, el 20 de julio in Colombia, el 28 de julio in Peru and el 9 de julio in Argentina. Many countries also have a holiday on el primero de mayo (Labor Day). Remember: dates are el + number + de + month, and months go in lowercase.',
          examples: [
            {
              target: 'El 16 de septiembre es una fecha patria en México.',
              base: 'September 16 is a national holiday in Mexico.',
            },
            { target: 'El 9 de julio no trabajo.', base: 'I don’t work on July 9.' },
          ],
        },
        takeaways: [
          'You understand dates and birthdays in a conversation and a post.',
          'You know some national holidays of Spanish-speaking countries.',
        ],
        exercises: [
          question(
            'es.ex.c35djluq2l5ejr',
            POSTEO,
            'When is Lucía’s birthday?',
            'October 15',
            ['May 15', 'October 5', 'December 15'],
            ['es-el-cumpleanos', 'es-octubre'],
            'She writes “¡Hoy es mi cumpleaños!” and “Nací el 15 de octubre”.',
          ),
          question(
            'es.ex.7s6eqszsjj75dk',
            POSTEO,
            'Where was Lucía born?',
            'In Guadalajara',
            ['In Bogotá', 'In Cusco', 'In Cartagena'],
            ['es-naci'],
            'She writes “Nací el 15 de octubre en Guadalajara”.',
          ),
          question(
            'es.ex.ubjfnnkkqgbcar',
            POSTEO,
            'How old is Lucía today?',
            'Twenty',
            ['Twelve', 'Fifteen', 'Thirty'],
            ['es-el-cumpleanos'],
            'She writes “Hoy tengo veinte años”.',
          ),
          question(
            'es.ex.xueky1owgsr3yx',
            CUMPLE,
            'When was Tomás born?',
            'On March 1',
            ['On February 28', 'On July 9', 'On May 1'],
            ['es-naci', 'es-el-primero', 'es-marzo'],
            'Tomás says “Yo nací el primero de marzo”.',
          ),
          question(
            'es.ex.76yiogydgla0ok',
            CUMPLE,
            'What is the date in the conversation?',
            'February 28',
            ['March 1', 'July 9', 'December 28'],
            ['es-que-fecha-es-hoy', 'es-febrero'],
            'Camila asks “¿Qué fecha es hoy?” and Tomás answers “Hoy es el 28 de febrero”.',
          ),
          ex.listenChoice(
            'El nueve de julio no trabajo.',
            [
              'El nueve de junio no trabajo.',
              'El nueve de julio trabajo.',
              'El diez de julio no trabajo.',
            ],
            ['es-julio', 'es-junio'],
            { id: 'es.ex.yricdqqmqy8jp3' },
          ),
          ex.fillBlank(
            'Mi cumpleaños es ___ noviembre.',
            'My birthday is in November.',
            'en',
            ['de', 'el', 'a'],
            ['es-noviembre', 'es-el-cumpleanos'],
            {
              id: 'es.ex.02e3uvex8qt4jo',
              explanation: 'In a month = en: en noviembre. With a day: el 3 de noviembre.',
            },
          ),
          ex.matchPairs(
            [
              ['julio', 'July'],
              ['junio', 'June'],
              ['enero', 'January'],
              ['agosto', 'August'],
            ],
            ['es-julio', 'es-junio', 'es-enero', 'es-agosto'],
            { id: 'es.ex.gwtnk1mdt4m7om' },
          ),
          ex.translateWrite(
            'Happy birthday, Martín!',
            '¡Feliz cumpleaños, Martín!',
            ['es-feliz-cumpleanos'],
            {
              id: 'es.ex.nanpgtdirb673o',
              acceptedAnswers: ['Feliz cumpleaños, Martín.', '¡Feliz cumple, Martín!'],
            },
          ),
          ex.shortAnswer(
            '¿Cuándo naciste?',
            'Answer: you were born on July 9 (start with «Nací…»).',
            'Nací el 9 de julio.',
            ['Nací el nueve de julio.', 'Yo nací el 9 de julio.', 'Yo nací el nueve de julio.'],
            ['es-naci', 'es-julio'],
            { id: 'es.ex.f10at1lts5x0zf' },
          ),
        ],
      },
    ],
  },
};

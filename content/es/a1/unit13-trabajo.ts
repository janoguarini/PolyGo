import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U13 «Work and studies» (docs/ES_A1_A2.md): preguntar a qué se dedica alguien (¿a qué te
 * dedicás?) y contestar con ser + profesión sin artículo (soy médica, no «soy una médica»), con
 * masculino y femenino (el médico / la médica, el profesor / la profesora); lugares de trabajo y de
 * estudio (la oficina, el hospital, la escuela, la facultad); el plural de ser y tener (somos, son;
 * tenemos, tienen) y empiezo (e → ie; vos empezás), termino, estudio.
 * Vocabulario rioplatense: el mozo (en España, camarero), la facultad.
 * Pronunciación: la j de trabajo (una h fuerte) y la g suave delante de e / i (ingeniero), que suena
 * igual que la j.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const FIESTA = dialogue(
  'es.stim.a1-u13-fiesta',
  'Two people meet at a party and talk about their jobs.',
  [
    ['Camila', 'Hola, me llamo Camila. ¿A qué te dedicás?'],
    ['Tomás', 'Soy profesor. ¿Y vos?'],
    ['Camila', 'Soy abogada, como mi papá.'],
    ['Tomás', '¡Mi mamá es abogada también!'],
  ],
  ES_A1_RATE,
);

const FAMILIA = dialogue(
  'es.stim.a1-u13-familia',
  'Ana asks Martín about his family.',
  [
    ['Ana', 'Martín, ¿tus padres son médicos?'],
    ['Martín', 'No, son abogados. Tienen una oficina en Palermo.'],
    ['Ana', '¿Y tus hermanos?'],
    ['Martín', 'Somos estudiantes. Mi hermana estudia en la facultad y yo, en la escuela.'],
  ],
  ES_A1_RATE,
);

const VALENTINA = reading(
  'es.stim.a1-u13-valentina',
  'description',
  'Valentina describes her work day.',
  [
    'Me llamo Valentina y soy enfermera.',
    'Trabajo en un hospital en Córdoba.',
    'Empiezo a las siete de la mañana y termino a las tres de la tarde.',
    'Después estudio inglés en la facultad.',
    '¡Me encanta mi trabajo!',
  ],
  { title: 'Mi trabajo' },
);

export const ES_A1_U13: EsUnitDef = {
  names: ['Camila', 'Tomás', 'Ana', 'Martín', 'Valentina', 'Lucía', 'Juan', 'Palermo', 'Córdoba'],
  support: ['dedica', 'estudia', 'empezás', 'empieza', 'terminás', 'termina'],
  unit: {
    position: 13,
    title: 'Work and studies',
    titleEn: 'Trabajo y estudios',
    description:
      'Ask what someone does and say your job (soy médica, with no article), talk about where you work or study, use somos, son, tenemos and tienen, and say when you start and finish.',
    emoji: '💼',
    objective:
      'You can ask someone what they do, say your job and where you work or study, talk about other people’s jobs and say what time you start and finish.',
    grammar: {
      title: 'Ser + profession · somos, son · tenemos, tienen',
      explanation:
        'After ser, a profession goes without an article: soy médica, él es profesor (English says “a doctor”; Spanish doesn’t say soy una médica). Most professions have a masculine and a feminine form: médico / médica, enfermero / enfermera, profesor / profesora, vendedor / vendedora. To ask a friend: ¿a qué te dedicás? The plural of ser is nosotros somos and ellos / ellas / ustedes son; of tener, tenemos and tienen. In Argentina ustedes is the only plural “you”. Empezar (to start) changes e to ie: empiezo, but vos empezás; terminar and estudiar are regular: termino, estudio.',
      examples: [
        { target: 'Soy médica. Él es profesor.', base: 'I’m a doctor. He’s a teacher.' },
        {
          target: 'Somos ingenieros. Ellos son abogados.',
          base: 'We are engineers. They are lawyers.',
        },
        {
          target: 'Empiezo a las nueve y termino a las seis.',
          base: 'I start at nine and finish at six.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U13). Sin revisión nativa: revisar «la facultad» traducida como college / university (en la Argentina es la palabra habitual para la universidad), «el vendedor» como shop assistant, «el mozo / la moza» (rioplatense; en España, camarero) y «¿a qué se dedica tu hermana?» con se dedica sólo como apoyo.',
    },
    words: [
      w(
        'es-el-trabajo',
        'el trabajo',
        'the job',
        'Mi trabajo está cerca de mi casa.',
        'My job is near my house.',
        ['work'],
        { acceptedTranslations: ['work'], emoji: '💼' },
      ),
      w(
        'es-a-que-te-dedicas',
        '¿a qué te dedicás?',
        'what do you do for a living?',
        '¿A qué te dedicás? — Soy profesora.',
        'What do you do? — I’m a teacher.',
        ['work', 'questions', 'voseo'],
        { acceptedTranslations: ['what do you do?'], acceptedTexts: ['¿a qué te dedicas?'] },
      ),
      w(
        'es-el-medico',
        'el médico',
        'the doctor',
        'Mi mamá es médica.',
        'My mom is a doctor.',
        ['work'],
        { acceptedTexts: ['la médica'], emoji: '🩺' },
      ),
      w(
        'es-el-enfermero',
        'el enfermero',
        'the nurse',
        'Mi hermano es enfermero.',
        'My brother is a nurse.',
        ['work'],
        { acceptedTexts: ['la enfermera'] },
      ),
      w(
        'es-el-mozo',
        'el mozo',
        'the waiter',
        '¡Mozo, un café, por favor!',
        'Waiter, a coffee, please!',
        ['work', 'argentina'],
        { acceptedTranslations: ['the waitress'], acceptedTexts: ['la moza'] },
      ),
      w(
        'es-el-vendedor',
        'el vendedor',
        'the shop assistant',
        'Mi papá es vendedor.',
        'My dad is a shop assistant.',
        ['work'],
        { acceptedTranslations: ['the salesperson'], acceptedTexts: ['la vendedora'] },
      ),
      w(
        'es-el-profesor',
        'el profesor',
        'the teacher',
        'La profesora es argentina.',
        'The teacher is Argentine.',
        ['work'],
        { acceptedTexts: ['la profesora'] },
      ),
      w(
        'es-el-ingeniero',
        'el ingeniero',
        'the engineer',
        'Mi esposa es ingeniera.',
        'My wife is an engineer.',
        ['work'],
        { acceptedTexts: ['la ingeniera'] },
      ),
      w('es-el-abogado', 'el abogado', 'the lawyer', 'Él es abogado.', 'He’s a lawyer.', ['work'], {
        acceptedTexts: ['la abogada'],
      }),
      w(
        'es-la-oficina',
        'la oficina',
        'the office',
        'Trabajo en una oficina.',
        'I work in an office.',
        ['work', 'places'],
        { emoji: '🏢' },
      ),
      w(
        'es-el-hospital',
        'el hospital',
        'the hospital',
        'La enfermera trabaja en el hospital.',
        'The nurse works at the hospital.',
        ['work', 'places'],
        { emoji: '🏥' },
      ),
      w(
        'es-la-escuela',
        'la escuela',
        'the school',
        'Mi hijo va a la escuela.',
        'My son goes to school.',
        ['studies', 'places'],
        { emoji: '🏫' },
      ),
      w(
        'es-la-facultad',
        'la facultad',
        'college',
        'Estudio en la facultad.',
        'I study at university.',
        ['studies', 'places'],
        { acceptedTranslations: ['university', 'the faculty'] },
      ),
      w('es-somos', 'somos', 'we are', 'Somos argentinos.', 'We are Argentine.', ['verbs']),
      w('es-ellos-son', 'ellos son', 'they are', 'Ellos son mis padres.', 'They are my parents.', [
        'verbs',
      ]),
      w('es-tenemos', 'tenemos', 'we have', 'Tenemos dos hijos.', 'We have two children.', [
        'verbs',
      ]),
      w(
        'es-tienen',
        'tienen',
        'they have',
        'Ellos tienen un perro.',
        'They have a dog.',
        ['verbs'],
        {
          acceptedTranslations: ['you all have'],
        },
      ),
      w('es-empiezo', 'empiezo', 'I start', 'Empiezo a las nueve.', 'I start at nine.', ['verbs'], {
        acceptedTranslations: ['I begin'],
      }),
      w('es-termino', 'termino', 'I finish', 'Termino a las cinco.', 'I finish at five.', [
        'verbs',
      ]),
      w('es-estudio', 'estudio', 'I study', 'Estudio inglés.', 'I study English.', [
        'verbs',
        'studies',
      ]),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿A qué te dedicás?',
        objective: 'Ask what someone does and say your job.',
        intro: {
          explanation:
            'To ask a friend what they do: ¿a qué te dedicás? (with usted: ¿a qué se dedica?). Answer with soy + profession and no article: soy médico, soy profesora. English says “I’m a doctor”, but in Spanish un or una is wrong here. El trabajo is your job or work. The j in trabajo sounds like a strong English h, from the back of the throat.',
          examples: [
            {
              target: '¿A qué te dedicás? — Soy abogado.',
              base: 'What do you do? — I’m a lawyer.',
            },
            { target: 'Mi papá es médico.', base: 'My dad is a doctor.' },
          ],
        },
        takeaways: [
          'You ask ¿a qué te dedicás? and answer soy + profession.',
          'You don’t use un or una before a profession after ser.',
        ],
        exercises: [
          ex.translationChoice(
            'el trabajo',
            'the job',
            ['the office', 'the school', 'the doctor'],
            ['es-el-trabajo'],
            { id: 'es.ex.ghnvew4e9a2w3j' },
          ),
          ex.translationChoice(
            '¿a qué te dedicás?',
            'what do you do for a living?',
            ['where do you live?', 'how old are you?', 'what is your name?'],
            ['es-a-que-te-dedicas'],
            { id: 'es.ex.vngboah3z9e3nt' },
          ),
          ex.matchPairs(
            [
              ['el médico', 'the doctor'],
              ['el profesor', 'the teacher'],
              ['el abogado', 'the lawyer'],
              ['el trabajo', 'the job'],
            ],
            ['es-el-medico', 'es-el-profesor', 'es-el-abogado', 'es-el-trabajo'],
            { id: 'es.ex.gazcy5c8afbt6m' },
          ),
          ex.fillBlank(
            'Soy ___.',
            'I’m a doctor.',
            'médico',
            ['un médico', 'el médico', 'médicos'],
            ['es-el-medico'],
            {
              id: 'es.ex.fq1oa6ihqttxew',
              explanation:
                'After ser, the profession goes without an article: soy médico (not soy un médico).',
            },
          ),
          ex.listenChoice(
            '¿A qué te dedicás?',
            ['¿A qué hora?', '¿Qué es esto?', '¿De dónde sos?'],
            ['es-a-que-te-dedicas'],
            { id: 'es.ex.b8k68qyulr7g68' },
          ),
          ex.fillBlank(
            'Mi mamá es ___.',
            'My mom is a teacher.',
            'profesora',
            ['profesor', 'una profesora', 'profesoras'],
            ['es-el-profesor'],
            {
              id: 'es.ex.cc00xk6h27lpk5',
              explanation:
                'Profesor becomes profesora for a woman, and there is no article after es: mi mamá es profesora.',
            },
          ),
          question(
            'es.ex.3k90w1jmtaa6np',
            FIESTA,
            'What does Tomás do?',
            'He’s a teacher',
            ['He’s a lawyer', 'He’s a doctor', 'He’s a student'],
            ['es-el-profesor', 'es-a-que-te-dedicas'],
            'Camila asks “¿A qué te dedicás?” and Tomás answers “Soy profesor”.',
          ),
          question(
            'es.ex.yzgnvjr9nxr2nv',
            FIESTA,
            'What do Camila and her dad have in common?',
            'They are both lawyers',
            ['They are both teachers', 'They work together', 'They are both doctors'],
            ['es-el-abogado'],
            'Camila says “Soy abogada, como mi papá”: I’m a lawyer, like my dad.',
          ),
          ex.translateWrite('I’m a lawyer.', 'Soy abogado.', ['es-el-abogado'], {
            id: 'es.ex.d2wwx681h2h7uh',
            acceptedAnswers: ['Soy abogada.', 'Yo soy abogado.', 'Yo soy abogada.'],
          }),
          ex.shortAnswer(
            '¿A qué te dedicás?',
            'Answer that you are a doctor (e.g. «Soy médico.» or «Soy médica.»).',
            'Soy médico.',
            ['Soy médica.', 'Yo soy médico.', 'Yo soy médica.'],
            ['es-el-medico', 'es-a-que-te-dedicas'],
            { id: 'es.ex.zsplsy6idiley5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Enfermero, enfermera',
        objective: 'Say jobs in the masculine and the feminine.',
        intro: {
          explanation:
            'Most jobs change -o to -a for a woman: enfermero / enfermera, ingeniero / ingeniera, mozo / moza. Jobs ending in -or add -a: vendedor / vendedora, profesor / profesora. El mozo is the Argentine word for waiter (in Spain: camarero). In ingeniero, the g before e sounds like the Spanish j, a strong h.',
          examples: [
            { target: 'Mi hermana es enfermera.', base: 'My sister is a nurse.' },
            { target: '¡Mozo, un café, por favor!', base: 'Waiter, a coffee, please!' },
          ],
        },
        takeaways: [
          'You change -o to -a, or add -a after -or, for a woman’s job.',
          'You call the waiter el mozo, as people do in Argentina.',
        ],
        exercises: [
          ex.translationChoice(
            'el mozo',
            'the waiter',
            ['the nurse', 'the shop assistant', 'the engineer'],
            ['es-el-mozo'],
            { id: 'es.ex.u4hcpnat0fwrvy' },
          ),
          ex.matchPairs(
            [
              ['el enfermero', 'the nurse'],
              ['el vendedor', 'the shop assistant'],
              ['el ingeniero', 'the engineer'],
              ['el mozo', 'the waiter'],
            ],
            ['es-el-enfermero', 'es-el-vendedor', 'es-el-ingeniero', 'es-el-mozo'],
            { id: 'es.ex.qwxjcgfvy0i40u' },
          ),
          ex.fillBlank(
            'Lucía es ___.',
            'Lucía is an engineer.',
            'ingeniera',
            ['ingeniero', 'una ingeniera', 'ingenieros'],
            ['es-el-ingeniero'],
            {
              id: 'es.ex.m9h8a8dksvmnwd',
              explanation: 'Lucía is a woman, so ingeniera, with no article after es.',
            },
          ),
          ex.listenChoice(
            'Ella es enfermera.',
            ['Él es enfermero.', 'Ella es vendedora.', 'Ella es ingeniera.'],
            ['es-el-enfermero'],
            { id: 'es.ex.2cfcfrhibsmc16' },
          ),
          ex.fillBlank(
            'Juan es ___ en un negocio.',
            'Juan is a shop assistant in a shop.',
            'vendedor',
            ['vendedora', 'un vendedor', 'profesora'],
            ['es-el-vendedor'],
            {
              id: 'es.ex.aubtdv927w7e9n',
              explanation:
                'Juan is a man: vendedor (vendedora is for a woman), with no article after es.',
            },
          ),
          ex.translationChoice(
            'el ingeniero',
            'the engineer',
            ['the lawyer', 'the doctor', 'the nurse'],
            ['es-el-ingeniero'],
            { id: 'es.ex.d60rztpzi859pg' },
          ),
          ex.listenChoice(
            'Soy ingeniero.',
            ['Soy enfermero.', 'Soy ingeniera.', 'Soy vendedor.'],
            ['es-el-ingeniero'],
            { id: 'es.ex.ckrbbu2mohyt7n' },
          ),
          ex.orderWords('Mi esposa es enfermera.', 'My wife is a nurse.', ['es-el-enfermero'], {
            id: 'es.ex.jc1gricnoyy0gq',
          }),
          ex.translateWrite(
            'Waiter, a coffee, please!',
            '¡Mozo, un café, por favor!',
            ['es-el-mozo'],
            {
              id: 'es.ex.4h7kci7ew3oeu9',
              acceptedAnswers: ['Mozo, un café, por favor.', '¡Mozo, un café por favor!'],
            },
          ),
          ex.shortAnswer(
            '¿A qué se dedica tu hermana?',
            'Answer that she is a nurse (e.g. «Es enfermera.»).',
            'Es enfermera.',
            ['Mi hermana es enfermera.', 'Ella es enfermera.'],
            ['es-el-enfermero'],
            { id: 'es.ex.erobgqnlvaq31u' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'En la oficina, en el hospital',
        objective: 'Say where you work or study.',
        intro: {
          explanation:
            'Trabajo en + place: trabajo en una oficina, en un hospital. Estudio means I study. La escuela is school (for children); in Argentina people say la facultad for university, because a university is made of facultades. English says “at school” or “at university”; Spanish uses en.',
          examples: [
            { target: 'Trabajo en una oficina.', base: 'I work in an office.' },
            { target: 'Estudio en la facultad.', base: 'I study at university.' },
          ],
        },
        takeaways: [
          'You say where you work with trabajo en…',
          'You say where you study with estudio en…',
        ],
        exercises: [
          ex.translationChoice(
            'la oficina',
            'the office',
            ['the hospital', 'the school', 'the job'],
            ['es-la-oficina'],
            { id: 'es.ex.vvjiq2b7xmy27d' },
          ),
          ex.matchPairs(
            [
              ['la oficina', 'the office'],
              ['el hospital', 'the hospital'],
              ['la escuela', 'the school'],
              ['la facultad', 'college'],
            ],
            ['es-la-oficina', 'es-el-hospital', 'es-la-escuela', 'es-la-facultad'],
            { id: 'es.ex.giss3raoz2i1gl' },
          ),
          ex.fillBlank(
            'La médica trabaja en el ___.',
            'The doctor works at the hospital.',
            'hospital',
            ['escuela', 'oficina', 'facultad'],
            ['es-el-hospital', 'es-el-medico'],
            {
              id: 'es.ex.n68o5v4ko82075',
              explanation:
                'The article el tells you the word is masculine: el hospital. Escuela, oficina and facultad go with la.',
            },
          ),
          ex.listenChoice(
            'Estudio en la facultad.',
            ['Estudio en la escuela.', 'Trabajo en la facultad.', 'Estudio en la oficina.'],
            ['es-estudio', 'es-la-facultad'],
            { id: 'es.ex.cdwps42apqzls4' },
          ),
          ex.translationChoice(
            'estudio',
            'I study',
            ['I work', 'I start', 'I finish'],
            ['es-estudio'],
            { id: 'es.ex.vyay9fx10jl54z' },
          ),
          ex.fillBlank(
            'Mi hijo va a la ___.',
            'My son goes to school.',
            'escuela',
            ['hospital', 'trabajo', 'negocio'],
            ['es-la-escuela'],
            {
              id: 'es.ex.rvttinq9gvhgua',
              skill: 'vocabulary',
              explanation: 'School is la escuela. Hospital, trabajo and negocio go with el.',
            },
          ),
          ex.orderWords(
            'El profesor trabaja en una escuela.',
            'The teacher works at a school.',
            ['es-el-profesor', 'es-la-escuela'],
            { id: 'es.ex.efzur8k1vdp54p' },
          ),
          ex.listenChoice(
            'Trabajo en un hospital.',
            ['Trabajo en una oficina.', 'Trabajo en una escuela.', 'Estudio en un hospital.'],
            ['es-el-hospital', 'es-la-oficina'],
            { id: 'es.ex.ka9hpc7v5m38yu' },
          ),
          ex.translateWrite(
            'I study at university.',
            'Estudio en la facultad.',
            ['es-estudio', 'es-la-facultad'],
            { id: 'es.ex.dcran5bgueippa', acceptedAnswers: ['Yo estudio en la facultad.'] },
          ),
          ex.shortAnswer(
            '¿Dónde trabajás?',
            'Answer that you work in an office (e.g. «Trabajo en una oficina.»).',
            'Trabajo en una oficina.',
            ['En una oficina.', 'Yo trabajo en una oficina.'],
            ['es-la-oficina'],
            { id: 'es.ex.ptpqtm19wzf9n9' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Somos, tenemos',
        objective: 'Talk about two or more people with somos, son, tenemos and tienen.',
        intro: {
          explanation:
            'Ser in the plural: nosotros somos (we are), ellos / ellas son (they are). Tener: tenemos (we have), tienen (they have). Ustedes (you, plural) uses the same forms as ellos: ustedes son, ustedes tienen; in Argentina ustedes is the only plural “you”. Jobs go plural too: somos médicos, son profesoras.',
          examples: [
            { target: 'Somos estudiantes.', base: 'We are students.' },
            {
              target: 'Ellos son ingenieros. Tienen dos hijos.',
              base: 'They are engineers. They have two children.',
            },
          ],
        },
        takeaways: [
          'You say we are and they are with somos and son.',
          'You say we have and they have with tenemos and tienen.',
        ],
        exercises: [
          ex.translationChoice(
            'somos',
            'we are',
            ['they are', 'we have', 'they have'],
            ['es-somos'],
            { id: 'es.ex.33j6nz7b4og1dt' },
          ),
          ex.fillBlank(
            'Nosotros ___ argentinos.',
            'We are Argentine.',
            'somos',
            ['son', 'soy', 'tenemos'],
            ['es-somos'],
            {
              id: 'es.ex.yef6hf5dquoc7b',
              explanation: 'With nosotros: somos. Son is for ellos or ustedes, soy for yo.',
            },
          ),
          ex.fillBlank(
            'Ellos ___ un perro y un gato.',
            'They have a dog and a cat.',
            'tienen',
            ['tenemos', 'tiene', 'son'],
            ['es-tienen'],
            {
              id: 'es.ex.rolbud57eyochf',
              explanation: 'With ellos: tienen. Tenemos is for nosotros and tiene for él or ella.',
            },
          ),
          ex.listenChoice(
            'Tenemos dos hijos.',
            ['Tienen dos hijos.', 'Tengo dos hijos.', 'Tenés dos hijos.'],
            ['es-tenemos', 'es-tienen'],
            { id: 'es.ex.exvyuiansb3aeq' },
          ),
          ex.matchPairs(
            [
              ['somos', 'we are'],
              ['ellos son', 'they are'],
              ['tenemos', 'we have'],
              ['tienen', 'they have'],
            ],
            ['es-somos', 'es-ellos-son', 'es-tenemos', 'es-tienen'],
            { id: 'es.ex.x6g6sp8ony3cef' },
          ),
          ex.fillBlank(
            'Ustedes ___ estudiantes, ¿no?',
            'You’re students, aren’t you?',
            'son',
            ['somos', 'sos', 'tienen'],
            ['es-ellos-son'],
            {
              id: 'es.ex.egkyukpm9vgt5g',
              explanation:
                'Ustedes uses the same verb form as ellos: ustedes son. Sos is for vos, one person.',
            },
          ),
          question(
            'es.ex.mg60t6tz4i2516',
            FAMILIA,
            'What do Martín’s parents do?',
            'They are lawyers',
            ['They are doctors', 'They are teachers', 'They are students'],
            ['es-ellos-son', 'es-el-abogado'],
            'Ana asks if they are doctors and Martín says “No, son abogados”.',
          ),
          question(
            'es.ex.8iu29wd97s75ox',
            FAMILIA,
            'Where is his parents’ office?',
            'In Palermo',
            ['In Córdoba', 'Next to the school', 'At the university'],
            ['es-tienen', 'es-la-oficina'],
            'Martín says “Tienen una oficina en Palermo”.',
          ),
          ex.translateWrite(
            'They are doctors.',
            'Ellos son médicos.',
            ['es-ellos-son', 'es-el-medico'],
            {
              id: 'es.ex.xkbuiu2kf1t9j8',
              acceptedAnswers: ['Son médicos.', 'Ellas son médicas.', 'Son médicas.'],
            },
          ),
          ex.shortAnswer(
            '¿Cuántos hijos tienen ustedes?',
            'Answer that you have two children (e.g. «Tenemos dos hijos.»).',
            'Tenemos dos hijos.',
            ['Nosotros tenemos dos hijos.', 'Tenemos dos.', 'Dos hijos.'],
            ['es-tenemos'],
            { id: 'es.ex.vzcig1v9mkdu43' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Empiezo a las nueve',
        objective:
          'Say what time you start and finish, and understand people talking about their work.',
        intro: {
          explanation:
            'Empezar (to start) changes e to ie: empiezo; with vos it doesn’t: empezás; for he or she: empieza. Terminar (to finish) and estudiar (to study) are regular: termino, terminás; estudio, estudiás. With a time, use a las: empiezo a las nueve, termino a las cinco.',
          examples: [
            {
              target: 'Empiezo a las nueve y termino a las seis.',
              base: 'I start at nine and finish at six.',
            },
            { target: '¿A qué hora empezás?', base: 'What time do you start?' },
          ],
        },
        takeaways: [
          'You say when you start and finish with empiezo and termino.',
          'You understand a short text about someone’s job and studies.',
        ],
        exercises: [
          ex.translationChoice(
            'empiezo',
            'I start',
            ['I finish', 'I study', 'I work'],
            ['es-empiezo'],
            { id: 'es.ex.2avhpc1jcxdxub' },
          ),
          ex.fillBlank(
            '¿A qué hora ___ vos?',
            'What time do you start?',
            'empezás',
            ['empiezo', 'empieza', 'termino'],
            ['es-empiezo'],
            {
              id: 'es.ex.zklcqlur6yxaep',
              explanation:
                'With vos the vowel doesn’t change: empezás. Empiezo is for yo and empieza for él, ella or usted.',
            },
          ),
          ex.listenChoice(
            'Termino a las cinco.',
            ['Empiezo a las cinco.', 'Termino a las once.', 'Termino a las doce.'],
            ['es-termino', 'es-empiezo'],
            { id: 'es.ex.9peovpnjj2g547' },
          ),
          question(
            'es.ex.mhsacp13lwed1r',
            VALENTINA,
            'What is Valentina’s job?',
            'She’s a nurse',
            ['She’s a doctor', 'She’s a teacher', 'She’s an engineer'],
            ['es-el-enfermero'],
            'She writes “soy enfermera” and “Trabajo en un hospital”.',
          ),
          question(
            'es.ex.4cy4vza5ibkknd',
            VALENTINA,
            'What time does Valentina finish work?',
            'At three in the afternoon',
            ['At seven in the morning', 'At five in the afternoon', 'At three in the morning'],
            ['es-termino'],
            'She writes “termino a las tres de la tarde”.',
          ),
          question(
            'es.ex.skwkj87iiccuui',
            VALENTINA,
            'What does she do after work?',
            'She studies English at university',
            [
              'She teaches English at a school',
              'She goes back to the hospital',
              'She goes out with friends',
            ],
            ['es-estudio', 'es-la-facultad'],
            'She writes “Después estudio inglés en la facultad”.',
          ),
          question(
            'es.ex.u358fcfsva0xcy',
            FAMILIA,
            'Where does Martín study?',
            'At school',
            ['At university', 'In an office', 'He doesn’t study'],
            ['es-somos', 'es-la-escuela'],
            'He says “Mi hermana estudia en la facultad y yo, en la escuela”.',
          ),
          ex.fillBlank(
            'Yo ___ a las seis de la tarde.',
            'I finish at six in the evening.',
            'termino',
            ['terminás', 'termina', 'empiezo'],
            ['es-termino'],
            {
              id: 'es.ex.01k9zku3r333qx',
              explanation: 'With yo: termino. Terminás is for vos and termina for él or ella.',
            },
          ),
          ex.translateWrite(
            'I start at nine and I finish at five.',
            'Empiezo a las nueve y termino a las cinco.',
            ['es-empiezo', 'es-termino'],
            {
              id: 'es.ex.g32nfpklyzv8nx',
              acceptedAnswers: ['Yo empiezo a las nueve y termino a las cinco.'],
            },
          ),
          ex.shortAnswer(
            '¿A qué te dedicás y dónde trabajás?',
            'Answer that you are a waiter in a café (e.g. «Soy mozo y trabajo en un café.»).',
            'Soy mozo y trabajo en un café.',
            [
              'Soy moza y trabajo en un café.',
              'Soy mozo. Trabajo en un café.',
              'Soy moza. Trabajo en un café.',
            ],
            ['es-el-mozo', 'es-a-que-te-dedicas'],
            { id: 'es.ex.ukbqzce0y82xz3' },
          ),
        ],
      },
    ],
  },
};

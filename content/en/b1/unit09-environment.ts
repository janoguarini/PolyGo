import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U9 «Medioambiente y sociedad» (docs/B1_EN.md): la voz pasiva en presente (is/are + participio) y
 * en pasado (was/were + participio, by + quien lo hace); reciclar y reducir residuos; energía y
 * transporte; proyectos de la comunidad.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RECYCLING = reading(
  'en.stim.b1-u9-recycling',
  'notice',
  'Un aviso del edificio sobre el reciclaje.',
  [
    'Recycling in our building',
    'Paper and plastic are collected on Mondays.',
    'Glass bottles are collected on Thursdays.',
    'Food waste is not collected here: please use the green bins in the street.',
    'Thank you for helping to protect the environment!',
  ],
  { title: 'Recycling' },
);

const BRIDGE = dialogue('en.stim.b1-u9-bridge', 'Una guía habla en un paseo por la ciudad.', [
  ['Guide', 'This bridge was built in 1890.'],
  ['Guide', 'It was designed by a famous engineer, and it was made of iron.'],
  ['Tourist', 'Is it still used today?'],
  ['Guide', 'Yes, but only by people on foot and bikes. Cars are not allowed.'],
]);

const PARK = reading(
  'en.stim.b1-u9-park',
  'post',
  'Una vecina cuenta un proyecto del barrio.',
  [
    'Last Saturday our park was cleaned by fifty volunteers!',
    'More than two hundred bags of trash were collected.',
    'Then a hundred new trees were planted by children from the local school.',
    'Our community has worked really hard. Thank you, everyone!',
  ],
  { from: 'Rosa', title: 'A cleaner park' },
);

const TRANSPORT = dialogue('en.stim.b1-u9-transport', 'Dos amigos discuten cómo ir al trabajo.', [
  ['Ben', 'I always drive to work. It is much faster.'],
  ['Emma', 'But cars produce a lot of pollution. Why don’t you use public transport?'],
  ['Ben', 'The bus takes an hour!'],
  ['Emma', 'What about a bike? If more people ride bikes, the air will be cleaner.'],
  ['Ben', 'Maybe you are right. I will try it next week.'],
]);

export const EN_B1_U09: B1UnitDef = {
  names: ['Guide', 'Tourist', 'Rosa', 'Ben', 'Emma', 'Colombia'],
  support: [
    'recycling',
    'paper',
    'collected',
    'bin',
    'building',
    'bridge',
    'designed',
    'iron',
    'used',
    'trees',
    'planted',
    'air',
    'cleaner',
    'dishes',
    'produce',
    'build',
  ],
  unit: {
    position: 9,
    title: 'Medioambiente y sociedad',
    titleEn: 'The environment and society',
    description:
      'El planeta y la contaminación, la voz pasiva (is made, was built), reciclar, ahorrar energía y proyectos de la comunidad.',
    emoji: '🌱',
    objective:
      'Puedes hablar de problemas del medioambiente, explicar cómo se hace algo con la voz pasiva y proponer soluciones simples.',
    grammar: {
      title: 'Voz pasiva',
      explanation:
        'La pasiva pone el foco en lo que recibe la acción: be + participio. Presente: Paper is recycled. Pasado: The bridge was built in 1890. Si importa quién lo hizo, va con by: It was designed by a famous engineer.',
      examples: [
        {
          target: 'Plastic bottles are recycled here.',
          base: 'Aquí se reciclan las botellas de plástico.',
        },
        { target: 'This house was built in 1950.', base: 'Esta casa fue construida en 1950.' },
        {
          target: 'The park was cleaned by volunteers.',
          base: 'El parque fue limpiado por voluntarios.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-environment',
        'environment',
        'medioambiente',
        '/ɪnˈvaɪrənmənt/',
        '🌍',
        'We have to protect the environment.',
        'Tenemos que cuidar el medioambiente.',
        ['environment'],
        ['medio ambiente'],
      ),
      w(
        'en-pollution',
        'pollution',
        'contaminación',
        '/pəˈluʃən/',
        '🏭',
        'There is a lot of pollution in big cities.',
        'Hay mucha contaminación en las ciudades grandes.',
        ['environment'],
      ),
      w(
        'en-climate-change',
        'climate change',
        'cambio climático',
        '/ˈklaɪmət ˈtʃeɪndʒ/',
        '🌡️',
        'Climate change is a big problem.',
        'El cambio climático es un gran problema.',
        ['environment'],
      ),
      w(
        'en-planet',
        'planet',
        'planeta',
        '/ˈplænɪt/',
        '🪐',
        'We only have one planet.',
        'Tenemos un solo planeta.',
        ['environment'],
      ),
      w(
        'en-forest',
        'forest',
        'bosque',
        '/ˈfɔrɪst/',
        '🌲',
        'We walked in the forest.',
        'Caminamos por el bosque.',
        ['environment', 'places'],
        ['selva'],
      ),
      w(
        'en-recycle',
        'recycle',
        'reciclar',
        '/riˈsaɪkəl/',
        '♻️',
        'We recycle paper and glass.',
        'Reciclamos papel y vidrio.',
        ['environment', 'verbs'],
      ),
      w(
        'en-plastic',
        'plastic',
        'plástico',
        '/ˈplæstɪk/',
        undefined,
        'Plastic bottles are bad for the sea.',
        'Las botellas de plástico son malas para el mar.',
        ['environment'],
      ),
      w(
        'en-trash',
        'trash',
        'basura',
        '/træʃ/',
        '🗑️',
        'Please put your trash in the bin.',
        'Por favor, tira la basura en el tacho.',
        ['environment'],
        ['residuos'],
      ),
      w(
        'en-waste',
        'waste',
        'desperdiciar / desperdicio',
        '/weɪst/',
        undefined,
        "Don't waste water.",
        'No desperdicies agua.',
        ['environment'],
        ['desperdiciar', 'desperdicio', 'malgastar'],
      ),
      w(
        'en-made-of',
        'made of',
        'hecho de',
        '/ˈmeɪd əv/',
        undefined,
        'This bag is made of paper.',
        'Esta bolsa está hecha de papel.',
        ['environment', 'passive'],
        ['hecha de'],
      ),
      w(
        'en-built',
        'built',
        'construido / construyó (build)',
        '/bɪlt/',
        '🏗️',
        'This house was built in 1950.',
        'Esta casa fue construida en 1950.',
        ['passive', 'participle'],
        ['construido', 'construida', 'construyó'],
      ),
      w(
        'en-produced',
        'produced',
        'producido / produjo',
        '/prəˈdust/',
        undefined,
        'This coffee is produced in Colombia.',
        'Este café se produce en Colombia.',
        ['passive', 'participle'],
        ['producido', 'producida', 'produjo'],
      ),
      w(
        'en-energy',
        'energy',
        'energía',
        '/ˈɛnərdʒi/',
        '⚡',
        'We should save energy at home.',
        'Deberíamos ahorrar energía en casa.',
        ['environment'],
      ),
      w(
        'en-reduce',
        'reduce',
        'reducir',
        '/rɪˈdus/',
        '📉',
        'We want to reduce our trash.',
        'Queremos reducir nuestra basura.',
        ['environment', 'verbs'],
        ['disminuir'],
      ),
      w(
        'en-protect',
        'protect',
        'proteger / cuidar',
        '/prəˈtɛkt/',
        '🛡️',
        'We must protect the forests.',
        'Tenemos que proteger los bosques.',
        ['environment', 'verbs'],
        ['proteger', 'cuidar'],
      ),
      w(
        'en-public-transport',
        'public transport',
        'transporte público',
        '/ˈpʌblɪk ˈtrænspɔrt/',
        '🚌',
        'I use public transport every day.',
        'Uso el transporte público todos los días.',
        ['environment', 'transport'],
      ),
      w(
        'en-community',
        'community',
        'comunidad',
        '/kəˈmjunəti/',
        '🏘️',
        'Our community has a big garden.',
        'Nuestra comunidad tiene una huerta grande.',
        ['society'],
      ),
      w(
        'en-volunteer',
        'volunteer',
        'voluntario / voluntaria',
        '/ˌvɑlənˈtɪr/',
        '🙋',
        'She works as a volunteer at the hospital.',
        'Trabaja de voluntaria en el hospital.',
        ['society'],
        ['voluntario', 'voluntaria', 'hacer voluntariado'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'El planeta',
        objective: 'Hablar de problemas del medioambiente.',
        intro: {
          explanation:
            'Palabras para hablar del planeta: the environment (el medioambiente), pollution (la contaminación), climate change (el cambio climático), forest (bosque). Con have to y must dices lo que hay que hacer: We have to protect the planet.',
          examples: [
            {
              target: 'There is a lot of pollution in big cities.',
              base: 'Hay mucha contaminación en las ciudades grandes.',
            },
            {
              target: 'Climate change is a big problem.',
              base: 'El cambio climático es un gran problema.',
            },
          ],
        },
        takeaways: [
          'Nombras problemas del medioambiente.',
          'Dices qué hay que hacer: We have to protect the planet.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['environment', 'medioambiente'],
              ['pollution', 'contaminación'],
              ['planet', 'planeta'],
              ['forest', 'bosque'],
            ],
            ['en-environment', 'en-pollution', 'en-planet', 'en-forest'],
            { id: 'en.ex.xsc9a41yly3c5x' },
          ),
          ex.imageChoice('🌲', 'forest', ['planet', 'pollution', 'environment'], ['en-forest'], {
            id: 'en.ex.gb3ra0l5t2r000',
          }),
          ex.fillBlank(
            'There is a lot of ___ in big cities.',
            'Hay mucha contaminación en las ciudades grandes.',
            'pollution',
            ['forest', 'planet', 'environment'],
            ['en-pollution', 'en-city'],
            { id: 'en.ex.dklewum22l4o03', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            '___ change is a big problem for the planet.',
            'El cambio climático es un gran problema para el planeta.',
            'Climate',
            ['Weather', 'Season', 'Planet'],
            ['en-climate-change', 'en-planet'],
            { id: 'en.ex.x07eq5z3mxuvxx', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'We only have one planet.',
            ['We only have one forest.', 'We all have one planet.', 'We only had one planet.'],
            ['en-planet'],
            { id: 'en.ex.7qraouznd4v0ny' },
          ),
          ex.orderWords(
            'We have to protect the environment.',
            'Tenemos que cuidar el medioambiente.',
            ['en-environment', 'en-protect', 'en-have-to'],
            { id: 'en.ex.k6ivbi0fqkxikp' },
          ),
          ex.shortAnswer(
            'What is a big problem in your city? (la contaminación)',
            '¿Cuál es un gran problema en tu ciudad?',
            'Pollution.',
            ['Pollution is a big problem.', 'The pollution.', 'There is a lot of pollution.'],
            ['en-pollution'],
            { id: 'en.ex.j1fovwonigbtcs' },
          ),
          ex.translateWrite(
            'El cambio climático es un gran problema.',
            'Climate change is a big problem.',
            ['en-climate-change'],
            {
              id: 'en.ex.js6iqnev2jvpyq',
              acceptedAnswers: ['Climate change is a great problem.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Se recicla…',
        objective: 'Explicar cómo se hace algo con la pasiva en presente.',
        intro: {
          explanation:
            'La pasiva en presente: is/are + participio. Paper is recycled (se recicla el papel). Plastic bottles are collected on Mondays (las botellas se recogen los lunes). Made of: hecho de (This bag is made of paper).',
          examples: [
            {
              target: 'Plastic bottles are recycled here.',
              base: 'Aquí se reciclan las botellas de plástico.',
            },
            { target: 'This bag is made of paper.', base: 'Esta bolsa está hecha de papel.' },
          ],
        },
        takeaways: [
          'Explicas cómo se hace algo: is/are + participio.',
          'Dices de qué está hecho algo: made of.',
        ],
        exercises: [
          ex.fillBlank(
            'Paper ___ recycled in this building.',
            'En este edificio se recicla el papel.',
            'is',
            ['are', 'was', 'has'],
            ['en-recycle', 'en-is'],
            {
              id: 'en.ex.c59hnfywj2raqi',
              explanation: 'Pasiva en presente: is/are + participio. Paper es singular: is.',
            },
          ),
          ex.fillBlank(
            'Plastic bottles are ___ here.',
            'Aquí se reciclan las botellas de plástico.',
            'recycled',
            ['recycle', 'recycling', 'recycles'],
            ['en-recycle', 'en-plastic'],
            { id: 'en.ex.r8jq5l8rnn9mav' },
          ),
          ex.fillBlank(
            'This bag is made ___ paper.',
            'Esta bolsa está hecha de papel.',
            'of',
            ['by', 'in', 'from the'],
            ['en-made-of'],
            { id: 'en.ex.npedvb259p0mwp', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "Don't ___ water when you wash the dishes.",
            'No desperdicies agua cuando lavas los platos.',
            'waste',
            ['save', 'recycle', 'protect'],
            ['en-waste', 'en-water'],
            { id: 'en.ex.zie0dob8ntnqys', skill: 'vocabulary' },
          ),
          question(
            'en.ex.i7jdg9wlu3ulxc',
            RECYCLING,
            '¿Qué días se recogen el papel y el plástico?',
            'Los lunes',
            ['Los jueves', 'Todos los días', 'Los lunes y los jueves'],
            ['en-plastic', 'en-recycle'],
            'El aviso dice: «Paper and plastic are collected on Mondays».',
          ),
          question(
            'en.ex.2r9fk9tjcw9lfi',
            RECYCLING,
            '¿Qué hay que hacer con los restos de comida?',
            'Tirarlos en los contenedores verdes de la calle',
            ['Dejarlos con el papel', 'Dejarlos los jueves', 'Tirarlos con el vidrio'],
            ['en-waste', 'en-trash'],
            'El aviso dice: «Food waste is not collected here: please use the green bins in the street».',
          ),
          ex.listenChoice(
            'Please put your trash in the bin.',
            [
              'Please put your bag in the bin.',
              'Please take your trash home.',
              'Please put the trash in the bin.',
            ],
            ['en-trash'],
            { id: 'en.ex.5wi75slcy8k1p2' },
          ),
          ex.translateWrite(
            'Esta bolsa está hecha de plástico.',
            'This bag is made of plastic.',
            ['en-made-of', 'en-plastic', 'en-bag'],
            {
              id: 'en.ex.oy8z00cvka6gly',
              acceptedAnswers: ["This bag's made of plastic."],
            },
          ),
          ex.translateWrite(
            'Aquí se recicla el vidrio.',
            'Glass is recycled here.',
            ['en-recycle'],
            {
              id: 'en.ex.a2uzkw09m81e7v',
              acceptedAnswers: ['Here glass is recycled.', 'Glass is recycled here too.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Fue construido…',
        objective: 'Contar la historia de algo con la pasiva en pasado y by.',
        intro: {
          explanation:
            'La pasiva en pasado: was/were + participio. The bridge was built in 1890 (fue construido). Si importa quién lo hizo: by. It was designed by a famous engineer. Build: built; produce: produced.',
          examples: [
            { target: 'This house was built in 1950.', base: 'Esta casa fue construida en 1950.' },
            {
              target: 'The park was cleaned by volunteers.',
              base: 'El parque fue limpiado por voluntarios.',
            },
          ],
        },
        takeaways: [
          'Cuentas la historia de un lugar: It was built in…',
          'Dices quién lo hizo con by.',
        ],
        exercises: [
          ex.translationChoice(
            'built',
            'construido / construyó (build)',
            ['producido / produjo', 'hecho de', 'reciclar'],
            ['en-built'],
            { id: 'en.ex.k75v6q4mfa5t48' },
          ),
          ex.fillBlank(
            'This bridge ___ built in 1890.',
            'Este puente fue construido en 1890.',
            'was',
            ['is', 'were', 'has'],
            ['en-built'],
            {
              id: 'en.ex.vzi6jgh68m297q',
              explanation: 'Pasiva en pasado: was/were + participio.',
            },
          ),
          ex.fillBlank(
            'These cars were ___ in Japan.',
            'Estos autos fueron producidos en Japón.',
            'produced',
            ['produce', 'producing', 'produces'],
            ['en-produced', 'en-car'],
            { id: 'en.ex.hkwi9m3m9oguv5' },
          ),
          ex.fillBlank(
            'The park was cleaned ___ fifty volunteers.',
            'El parque fue limpiado por cincuenta voluntarios.',
            'by',
            ['of', 'for', 'from'],
            ['en-volunteer'],
            {
              id: 'en.ex.dmumcjxu1ptx2z',
              explanation: 'En la pasiva, quien hace la acción va con by.',
            },
          ),
          question(
            'en.ex.2v26c9u0ba2cp0',
            BRIDGE,
            '¿Cuándo se construyó el puente?',
            'En 1890',
            ['En 1980', 'En 1819', 'El año pasado'],
            ['en-built'],
            'La guía dice: «This bridge was built in 1890».',
          ),
          question(
            'en.ex.z3evfy2xy2pfnp',
            BRIDGE,
            '¿Quién puede usar el puente hoy?',
            'Sólo la gente a pie y en bici',
            ['Todos, también los autos', 'Nadie', 'Sólo los autobuses'],
            ['en-allowed-to'],
            'La guía dice: «only by people on foot and bikes. Cars are not allowed».',
          ),
          ex.listenChoice(
            'This house was built in 1950.',
            [
              'This house was built in 1915.',
              'This hotel was built in 1950.',
              'This house is built in 1950.',
            ],
            ['en-built', 'en-house'],
            { id: 'en.ex.4t2wj2n455s69o' },
          ),
          ex.orderWords(
            'The museum was built by a famous engineer.',
            'El museo fue construido por un ingeniero famoso.',
            ['en-built', 'en-museum', 'en-engineer'],
            { id: 'en.ex.6edv25a13usl6s' },
          ),
          ex.shortAnswer(
            'When was this bridge built? (en 1890)',
            '¿Cuándo se construyó este puente?',
            'It was built in 1890.',
            ['In 1890.', 'It was built in eighteen ninety.', 'The bridge was built in 1890.'],
            ['en-built'],
            { id: 'en.ex.yiaqlcrwenzqr1' },
          ),
          ex.translateWrite(
            'Esta casa fue construida en 1950.',
            'This house was built in 1950.',
            ['en-built', 'en-house'],
            {
              id: 'en.ex.laln2hgossnal8',
              acceptedAnswers: ['This house was built in nineteen fifty.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '¿Qué podemos hacer?',
        objective:
          'Proponer soluciones: reducir, proteger, ahorrar energía, usar transporte público.',
        intro: {
          explanation:
            'Para proponer soluciones: reduce (reducir), protect (proteger), save energy (ahorrar energía), use public transport. Con el primer condicional muestras el resultado: If more people ride bikes, the air will be cleaner.',
          examples: [
            {
              target: 'We should save energy at home.',
              base: 'Deberíamos ahorrar energía en casa.',
            },
            {
              target: 'If we use public transport, there will be less pollution.',
              base: 'Si usamos el transporte público, habrá menos contaminación.',
            },
          ],
        },
        takeaways: [
          'Propones soluciones con should y have to.',
          'Muestras el resultado con if + will.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['reduce', 'reducir'],
              ['protect', 'proteger / cuidar'],
              ['energy', 'energía'],
              ['waste', 'desperdiciar / desperdicio'],
            ],
            ['en-reduce', 'en-protect', 'en-energy', 'en-waste'],
            { id: 'en.ex.bhhph5694f3pru' },
          ),
          ex.fillBlank(
            'We should save ___ at home.',
            'Deberíamos ahorrar energía en casa.',
            'energy',
            ['pollution', 'trash', 'plastic'],
            ['en-energy', 'en-save'],
            { id: 'en.ex.ecycy8d5s2it4g', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'We want to ___ the plastic we use.',
            'Queremos reducir el plástico que usamos.',
            'reduce',
            ['produce', 'waste', 'build'],
            ['en-reduce', 'en-plastic'],
            { id: 'en.ex.cztbz0n0lgf6vp', skill: 'vocabulary' },
          ),
          question(
            'en.ex.hkdncpwhgriinz',
            TRANSPORT,
            '¿Por qué Ben va al trabajo en auto?',
            'Porque es mucho más rápido',
            ['Porque no hay autobuses', 'Porque vive lejos', 'Porque llueve'],
            ['en-public-transport'],
            'Ben dice: «I always drive to work. It is much faster».',
          ),
          question(
            'en.ex.f68y1oaq8foi6e',
            TRANSPORT,
            '¿Qué le propone Emma?',
            'Ir en bici',
            ['Ir caminando', 'Tomar el tren', 'Trabajar desde casa'],
            ['en-pollution', 'en-bike'],
            'Emma dice: «What about a bike? If more people ride bikes, the air will be cleaner».',
          ),
          ex.listenChoice(
            'I use public transport every day.',
            [
              'I use public transport every week.',
              'I used public transport every day.',
              'I take public transport every day.',
            ],
            ['en-public-transport'],
            { id: 'en.ex.r0qsrqawaodp3x' },
          ),
          ex.orderWords(
            'We must protect the forests.',
            'Tenemos que proteger los bosques.',
            ['en-protect', 'en-forest', 'en-must'],
            { id: 'en.ex.fmxpzqym9xnelu' },
          ),
          ex.shortAnswer(
            'How can we reduce pollution? (usando el transporte público)',
            '¿Cómo podemos reducir la contaminación?',
            'We can use public transport.',
            [
              'By using public transport.',
              'Use public transport.',
              'We should use public transport.',
            ],
            ['en-reduce', 'en-public-transport'],
            { id: 'en.ex.ss5imuzb8fxsbb' },
          ),
          ex.translateWrite(
            'Si usamos el transporte público, habrá menos contaminación.',
            'If we use public transport, there will be less pollution.',
            ['en-public-transport', 'en-pollution', 'en-if'],
            {
              id: 'en.ex.vxjgyejom9n51k',
              acceptedAnswers: [
                "If we use public transport, there'll be less pollution.",
                'There will be less pollution if we use public transport.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'En comunidad',
        objective: 'Contar un proyecto de la comunidad con la pasiva y con voluntarios.',
        intro: {
          explanation:
            'Community es la comunidad (los vecinos, el barrio). Volunteer es voluntario y también hacer voluntariado. Para contar un proyecto se usa mucho la pasiva: The park was cleaned, a hundred trees were planted.',
          examples: [
            {
              target: 'She works as a volunteer at the hospital.',
              base: 'Trabaja de voluntaria en el hospital.',
            },
            {
              target: 'Our community has a big garden.',
              base: 'Nuestra comunidad tiene una huerta grande.',
            },
          ],
        },
        takeaways: [
          'Cuentas un proyecto de tu comunidad.',
          'Usas la pasiva para contar qué se hizo.',
        ],
        exercises: [
          ex.translationChoice(
            'community',
            'comunidad',
            ['vecino / vecina', 'barrio', 'familia'],
            ['en-community'],
            { id: 'en.ex.ceh4p40hjqni0w' },
          ),
          question(
            'en.ex.bj6io4vyzxvbnv',
            PARK,
            '¿Quién limpió el parque?',
            'Cincuenta voluntarios',
            ['Los chicos de la escuela', 'La municipalidad', 'Rosa sola'],
            ['en-volunteer'],
            'Rosa escribe: «Last Saturday our park was cleaned by fifty volunteers!».',
          ),
          question(
            'en.ex.bk17ndaihj82ks',
            PARK,
            '¿Qué hicieron los chicos de la escuela?',
            'Plantaron cien árboles',
            ['Juntaron la basura', 'Limpiaron el parque', 'Reciclaron botellas'],
            ['en-community'],
            'Rosa escribe: «a hundred new trees were planted by children from the local school».',
          ),
          ex.fillBlank(
            'More than two hundred bags of trash ___ collected.',
            'Se juntaron más de doscientas bolsas de basura.',
            'were',
            ['was', 'are', 'did'],
            ['en-trash'],
            {
              id: 'en.ex.okdbxlfd1e1qec',
              explanation: 'Bags es plural: were + participio.',
            },
          ),
          ex.fillBlank(
            'She works as a ___ at the hospital.',
            'Trabaja de voluntaria en el hospital.',
            'volunteer',
            ['community', 'tourist', 'driver'],
            ['en-volunteer', 'en-hospital'],
            { id: 'en.ex.uvdhdv93237570', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Our community has a big garden.',
            [
              'Our community has a big park.',
              'Our community had a big garden.',
              'Our family has a big garden.',
            ],
            ['en-community', 'en-garden'],
            { id: 'en.ex.opcldpz0yapsii' },
          ),
          ex.orderWords(
            'The trees were planted by volunteers.',
            'Los árboles fueron plantados por voluntarios.',
            ['en-volunteer'],
            { id: 'en.ex.r4tewpnjn99prr' },
          ),
          ex.shortAnswer(
            'Have you ever worked as a volunteer? (sí, en una escuela)',
            '¿Alguna vez trabajaste de voluntario?',
            'Yes, I have. I worked at a school.',
            [
              'Yes, at a school.',
              'Yes, I have worked as a volunteer at a school.',
              'Yes, I worked as a volunteer at a school.',
              'Yes, I have.',
            ],
            ['en-volunteer', 'en-ever'],
            { id: 'en.ex.wmn8b0iuz3ee4t' },
          ),
          ex.translateWrite(
            'El parque fue limpiado por voluntarios.',
            'The park was cleaned by volunteers.',
            ['en-volunteer', 'en-park'],
            {
              id: 'en.ex.j3rb1ls8ym49ww',
              acceptedAnswers: ['Volunteers cleaned the park.'],
            },
          ),
        ],
      },
    ],
  },
};

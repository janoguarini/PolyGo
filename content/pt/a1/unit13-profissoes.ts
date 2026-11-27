import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, PT_A1_RATE, question, reading, w } from '../helpers';

/**
 * PT-BR A1 U13 «Profesiones y trabajo» (docs/PT_A1_A2.md): los pronombres plurales (nós, eles, elas,
 * vocês y a gente), ser y los verbos en -ar en plural, posesivos nosso/nossa y las profesiones.
 * Falsos amigos: escritório es «oficina» y motorista es quien maneja (no un motociclista).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CAFE = dialogue(
  'pt.stim.a1-u13-cafe',
  'Dos personas se conocen en una fiesta.',
  [
    ['Bruna', 'Oi! Eu sou a Bruna. O que você faz?'],
    ['Diego', 'Eu sou engenheiro. Trabalho em um escritório no centro.'],
    ['Bruna', 'Que legal! Eu sou enfermeira. Trabalho à noite.'],
    ['Diego', 'À noite? Você trabalha muito!'],
  ],
  PT_A1_RATE,
);

const PERFIL = reading(
  'pt.stim.a1-u13-perfil',
  'post',
  'Una pareja se presenta en la página de su restaurante.',
  [
    'Oi, gente! Nós somos a Rita e o Caio.',
    'A gente mora em Salvador e trabalha no nosso restaurante.',
    'O Caio é cozinheiro e eu sou garçonete.',
    'Nossa comida é muito gostosa!',
  ],
  { from: 'Rita', title: 'Nosso restaurante' },
);

const FAMILIA = dialogue(
  'pt.stim.a1-u13-familia',
  'Lucas habla de su familia con una compañera de clase.',
  [
    ['Júlia', 'Lucas, os seus pais trabalham?'],
    ['Lucas', 'Sim. Minha mãe é médica e meu pai é motorista de ônibus.'],
    ['Júlia', 'E os seus irmãos?'],
    ['Lucas', 'Eles são estudantes, como nós.'],
  ],
  PT_A1_RATE,
);

export const PT_A1_U13: PtUnitDef = {
  names: ['Bruna', 'Diego', 'Rita', 'Caio', 'Salvador', 'Lucas', 'Júlia', 'Rex'],
  support: ['centro', 'comida', 'moram', 'moramos'],
  unit: {
    position: 13,
    title: 'Profesiones y trabajo',
    titleEn: 'Profissões',
    description:
      'Nós, eles, elas, vocês y a gente; ser y los verbos en -ar en plural; nosso y nossa; profesiones y lugares de trabajo.',
    emoji: '💼',
    objective:
      'Puedes decir a qué te dedicas tú y otras personas, hablar en plural (nós trabalhamos, eles trabalham) y usar a gente como en Brasil.',
    grammar: {
      title: 'Pronombres plurales · ser y -ar en plural',
      explanation:
        'Nós (nosotros), eles / elas (ellos, ellas) y vocês (ustedes). Ser: nós somos, eles são, vocês são. Los verbos en -ar: nós trabalhamos, eles trabalham. En el habla de Brasil se dice mucho a gente («nosotros») con el verbo como ele: a gente trabalha. La profesión va sin artículo: ela é médica.',
      examples: [
        { target: 'Nós somos estudantes.', base: 'Somos estudiantes.' },
        { target: 'Eles trabalham em um restaurante.', base: 'Ellos trabajan en un restaurante.' },
        { target: 'A gente trabalha em casa.', base: 'Trabajamos en casa.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U13). Sin revisión nativa: revisar a gente, garçom / garçonete y los falsos amigos.',
    },
    words: [
      w(
        'pt-nos',
        'nós',
        'nosotros / nosotras',
        'Nós somos amigos.',
        'Somos amigos.',
        ['pronouns'],
        {
          acceptedTranslations: ['nosotras'],
        },
      ),
      w('pt-eles', 'eles', 'ellos', 'Eles são brasileiros.', 'Ellos son brasileños.', ['pronouns']),
      w('pt-elas', 'elas', 'ellas', 'Elas são professoras.', 'Ellas son profesoras.', ['pronouns']),
      w('pt-voces', 'vocês', 'ustedes', 'Vocês são argentinos?', '¿Ustedes son argentinos?', [
        'pronouns',
      ]),
      w(
        'pt-a-gente',
        'a gente',
        'nosotros (coloquial)',
        'A gente mora no Rio.',
        'Vivimos en Río.',
        ['pronouns'],
      ),
      w('pt-somos', 'somos', 'somos', 'Nós somos estudantes.', 'Somos estudiantes.', ['verbs']),
      w(
        'pt-trabalhamos',
        'trabalhamos',
        'trabajamos',
        'Nós trabalhamos de manhã.',
        'Trabajamos por la mañana.',
        ['verbs', 'work'],
      ),
      w(
        'pt-trabalham',
        'trabalham',
        'trabajan',
        'Eles trabalham à noite.',
        'Ellos trabajan por la noche.',
        ['verbs', 'work'],
      ),
      w('pt-nosso', 'nosso', 'nuestro', 'O nosso cachorro é preto.', 'Nuestro perro es negro.', [
        'possessives',
      ]),
      w('pt-nossa', 'nossa', 'nuestra', 'A nossa casa é pequena.', 'Nuestra casa es chica.', [
        'possessives',
      ]),
      w(
        'pt-o-que-voce-faz',
        'o que você faz?',
        '¿a qué te dedicas?',
        'O que você faz? — Sou professora.',
        '¿A qué te dedicas? — Soy profesora.',
        ['work', 'questions'],
        {
          acceptedTranslations: [
            '¿qué hacés?',
            '¿de qué trabajás?',
            '¿a qué te dedicás?',
            '¿qué haces?',
            '¿de qué trabajas?',
          ],
        },
      ),
      w('pt-medico', 'médico', 'médico', 'Meu pai é médico.', 'Mi papá es médico.', ['work'], {
        acceptedTexts: ['médica'],
        acceptedTranslations: ['médica'],
        emoji: '🩺',
      }),
      w(
        'pt-enfermeiro',
        'enfermeiro',
        'enfermero',
        'Ela é enfermeira.',
        'Ella es enfermera.',
        ['work'],
        { acceptedTexts: ['enfermeira'], acceptedTranslations: ['enfermera'], emoji: '🧑‍⚕️' },
      ),
      w(
        'pt-engenheiro',
        'engenheiro',
        'ingeniero',
        'Eu sou engenheiro.',
        'Soy ingeniero.',
        ['work'],
        { acceptedTexts: ['engenheira'], acceptedTranslations: ['ingeniera'], emoji: '👷' },
      ),
      w(
        'pt-garcom',
        'garçom',
        'mesero',
        'O garçom é muito legal.',
        'El mesero es muy simpático.',
        ['work', 'food'],
        {
          acceptedTexts: ['garçonete'],
          acceptedTranslations: ['camarero', 'mesero', 'moza', 'mozo'],
          emoji: '🤵',
        },
      ),
      w(
        'pt-cozinheiro',
        'cozinheiro',
        'cocinero',
        'O cozinheiro trabalha na cozinha.',
        'El cocinero trabaja en la cocina.',
        ['work', 'food'],
        { acceptedTexts: ['cozinheira'], acceptedTranslations: ['cocinera'], emoji: '🧑‍🍳' },
      ),
      w(
        'pt-motorista',
        'motorista',
        'conductor / chofer',
        'Meu pai é motorista de ônibus.',
        'Mi papá es chofer de autobús.',
        ['work', 'transport'],
        { acceptedTranslations: ['conductor', 'chofer', 'conductora'], emoji: '🚌' },
      ),
      w(
        'pt-escritorio',
        'escritório',
        'oficina',
        'Eu trabalho em um escritório.',
        'Trabajo en una oficina.',
        ['work', 'places'],
        { emoji: '🏢' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Nós, eles, vocês',
        objective: 'Hablar de varias personas con ser.',
        intro: {
          explanation:
            'Para hablar de varias personas: nós (nosotros), eles (ellos), elas (ellas) y vocês (ustedes). En Brasil vocês es «ustedes» también entre amigos. Ser: nós somos, eles são, vocês são.',
          examples: [
            { target: 'Nós somos estudantes.', base: 'Somos estudiantes.' },
            { target: 'Elas são brasileiras.', base: 'Ellas son brasileñas.' },
          ],
        },
        takeaways: ['Usas nós, eles, elas y vocês.', 'Conjugas ser en plural: somos, são.'],
        exercises: [
          ex.translationChoice(
            'eles',
            'ellos',
            ['ellas', 'ustedes', 'nosotros / nosotras'],
            ['pt-eles'],
            {
              id: 'pt.ex.kqbdiufdsh8oy9',
            },
          ),
          ex.translationChoice(
            'vocês',
            'ustedes',
            ['ellos', 'nosotros / nosotras', 'ellas'],
            ['pt-voces'],
            {
              id: 'pt.ex.msc6w92ibjczjr',
              explanation: 'Vocês es «ustedes»; en Brasil se usa también entre amigos.',
            },
          ),
          ex.matchPairs(
            [
              ['nós', 'nosotros / nosotras'],
              ['eles', 'ellos'],
              ['elas', 'ellas'],
              ['vocês', 'ustedes'],
            ],
            ['pt-nos', 'pt-eles', 'pt-elas', 'pt-voces'],
            { id: 'pt.ex.e1446gtjyfocfn' },
          ),
          ex.listenChoice(
            'Nós somos amigos.',
            ['Eles são amigos.', 'Nós somos argentinos.', 'Vocês são amigos?'],
            ['pt-nos', 'pt-somos'],
            { id: 'pt.ex.q5blcxjnu6hmk6' },
          ),
          ex.fillBlank(
            'Nós ___ estudantes.',
            'Somos estudiantes.',
            'somos',
            ['são', 'sou', 'é'],
            ['pt-nos', 'pt-somos'],
            { id: 'pt.ex.vv3gnsfy6wdjfa', explanation: 'Con nós, ser es somos.' },
          ),
          ex.fillBlank(
            'Elas ___ brasileiras.',
            'Ellas son brasileñas.',
            'são',
            ['somos', 'é', 'sou'],
            ['pt-elas'],
            { id: 'pt.ex.2e9b93t80lysbl', explanation: 'Con eles, elas y vocês, ser es são.' },
          ),
          ex.orderWords('Vocês são professores?', '¿Ustedes son profesores?', ['pt-voces'], {
            id: 'pt.ex.fw8zv5ofsa0385',
          }),
          ex.shortAnswer(
            'Vocês são argentinos?',
            '¿Ustedes son argentinos? (Responde que sí, que son argentinos.)',
            'Sim, nós somos argentinos.',
            ['Sim, somos argentinos.', 'Somos argentinos.', 'Nós somos argentinos.', 'Sim, somos.'],
            ['pt-nos', 'pt-somos'],
            { id: 'pt.ex.osxebjiwnnt13r' },
          ),
          ex.translateWrite('Ellos son amigos.', 'Eles são amigos.', ['pt-eles'], {
            id: 'pt.ex.8dtkracgoh20yc',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Nós trabalhamos, a gente trabalha',
        objective: 'Conjugar los verbos en -ar en plural y usar a gente.',
        intro: {
          explanation:
            'En plural, los verbos en -ar terminan en -amos (nós) y en -am (eles, elas, vocês): nós trabalhamos, eles trabalham. En Brasil se dice mucho a gente en lugar de nós, con el verbo como ele: a gente trabalha.',
          examples: [
            { target: 'Nós trabalhamos de manhã.', base: 'Trabajamos por la mañana.' },
            { target: 'A gente trabalha em casa.', base: 'Trabajamos en casa.' },
          ],
        },
        takeaways: [
          'Conjugas -ar en plural: trabalhamos, trabalham.',
          'Dices «nosotros» como en Brasil: a gente + verbo en singular.',
        ],
        exercises: [
          ex.translationChoice(
            'a gente',
            'nosotros (coloquial)',
            ['la familia', 'ellos', 'ustedes'],
            ['pt-a-gente'],
            {
              id: 'pt.ex.b2zp9sj82gb00z',
              explanation:
                'A gente es «nosotros» en el habla de todos los días; el verbo va en singular.',
            },
          ),
          ex.fillBlank(
            'Nós ___ em um restaurante.',
            'Trabajamos en un restaurante.',
            'trabalhamos',
            ['trabalham', 'trabalha', 'trabalho'],
            ['pt-nos', 'pt-trabalhamos'],
            { id: 'pt.ex.7cewjwepfrex9u' },
          ),
          ex.fillBlank(
            'Eles ___ à noite.',
            'Ellos trabajan por la noche.',
            'trabalham',
            ['trabalhamos', 'trabalho', 'trabalha'],
            ['pt-eles', 'pt-trabalham', 'pt-a-noite'],
            { id: 'pt.ex.xt6y5ra31bp9sb' },
          ),
          ex.fillBlank(
            'A gente ___ em casa.',
            'Trabajamos en casa.',
            'trabalha',
            ['trabalhamos', 'trabalham', 'trabalho'],
            ['pt-a-gente', 'pt-em-casa'],
            {
              id: 'pt.ex.eukplxvv3phyp6',
              explanation: 'Con a gente el verbo va como con ele: a gente trabalha.',
            },
          ),
          ex.listenChoice(
            'Vocês trabalham hoje?',
            ['Vocês trabalham amanhã?', 'Nós trabalhamos hoje.', 'Eles trabalham longe?'],
            ['pt-voces', 'pt-trabalham', 'pt-hoje'],
            { id: 'pt.ex.fpc39axkb0ofbn' },
          ),
          ex.translationChoice(
            'trabalhamos',
            'trabajamos',
            ['trabajan', 'trabajo', 'trabaja'],
            ['pt-trabalhamos'],
            {
              id: 'pt.ex.mcl54zif1sedl0',
            },
          ),
          ex.orderWords(
            'Elas trabalham de manhã.',
            'Ellas trabajan por la mañana.',
            ['pt-elas', 'pt-trabalham'],
            {
              id: 'pt.ex.c87wp40dim86zk',
            },
          ),
          ex.shortAnswer(
            'Vocês trabalham à noite?',
            '¿Ustedes trabajan por la noche? (Responde que no, que trabajan por la mañana.)',
            'Não, nós trabalhamos de manhã.',
            [
              'Não, trabalhamos de manhã.',
              'Não, a gente trabalha de manhã.',
              'Nós trabalhamos de manhã.',
              'Trabalhamos de manhã.',
            ],
            ['pt-nos', 'pt-trabalhamos', 'pt-de-manha'],
            { id: 'pt.ex.trsmybkfjl9gz0' },
          ),
          ex.translateWrite(
            'Trabajamos en casa.',
            'Nós trabalhamos em casa.',
            ['pt-nos', 'pt-trabalhamos'],
            {
              id: 'pt.ex.k5nuq7elxdfw19',
              acceptedAnswers: ['Trabalhamos em casa.', 'A gente trabalha em casa.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'O que você faz?',
        objective: 'Preguntar y decir a qué se dedica alguien.',
        intro: {
          explanation:
            'O que você faz? es «¿a qué te dedicas?». La profesión va sin artículo: sou médico, ela é enfermeira. Muchas tienen femenino en -a: o engenheiro, a engenheira.',
          examples: [
            {
              target: 'O que você faz? — Sou engenheira.',
              base: '¿A qué te dedicas? — Soy ingeniera.',
            },
            { target: 'Meu pai é médico.', base: 'Mi papá es médico.' },
          ],
        },
        takeaways: [
          'Preguntas la profesión con o que você faz?',
          'Dices profesiones sin artículo y en femenino.',
        ],
        exercises: [
          ex.imageChoice('🩺', 'médico', ['enfermeiro', 'engenheiro', 'professor'], ['pt-medico'], {
            id: 'pt.ex.9n4z3uhj34ajpo',
          }),
          ex.imageChoice(
            '🧑‍🍳',
            'cozinheiro',
            ['enfermeiro', 'professor', 'engenheiro'],
            ['pt-cozinheiro'],
            {
              id: 'pt.ex.64i49bnif5t1kh',
            },
          ),
          ex.translationChoice(
            'o que você faz?',
            '¿a qué te dedicas?',
            ['¿dónde vives?', '¿cómo te llamas?', '¿de dónde eres?'],
            ['pt-o-que-voce-faz'],
            { id: 'pt.ex.5r2palfdur6879' },
          ),
          ex.listenChoice(
            'Ela é enfermeira.',
            ['Ela é engenheira.', 'Ele é enfermeiro.', 'Ela é professora.'],
            ['pt-enfermeiro', 'pt-ela'],
            { id: 'pt.ex.zjzbxvo9lu34qa' },
          ),
          ex.fillBlank(
            'Minha mãe é ___.',
            'Mi mamá es ingeniera.',
            'engenheira',
            ['engenheiro', 'uma engenheiro', 'a engenheira'],
            ['pt-engenheiro', 'pt-minha', 'pt-mae'],
            {
              id: 'pt.ex.xgpvns9ijcnslj',
              explanation: 'Profesión de una mujer, sin artículo: é engenheira.',
            },
          ),
          ex.matchPairs(
            [
              ['enfermeiro', 'enfermero'],
              ['engenheiro', 'ingeniero'],
              ['cozinheiro', 'cocinero'],
              ['professor', 'profesor'],
            ],
            ['pt-enfermeiro', 'pt-engenheiro', 'pt-cozinheiro', 'pt-professor'],
            { id: 'pt.ex.bagsipby3sfvfp' },
          ),
          ex.orderWords('O que você faz?', '¿A qué te dedicas?', ['pt-o-que-voce-faz'], {
            id: 'pt.ex.97kq5pgp2z4bbm',
          }),
          ex.shortAnswer(
            'O que você faz?',
            '¿A qué te dedicas? (Responde que eres estudiante.)',
            'Eu sou estudante.',
            ['Sou estudante.', 'Estudante.'],
            ['pt-o-que-voce-faz', 'pt-estudante'],
            { id: 'pt.ex.ydrjbpzcjgc4jt' },
          ),
          ex.translateWrite(
            'Mi papá es ingeniero.',
            'Meu pai é engenheiro.',
            ['pt-engenheiro', 'pt-meu', 'pt-pai'],
            {
              id: 'pt.ex.4f6q6o66ischig',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'No escritório, no restaurante',
        objective: 'Decir dónde trabaja cada uno y evitar falsos amigos.',
        intro: {
          explanation:
            'Falsos amigos: escritório es la «oficina» (el escritorio, el mueble, es mesa) y motorista es quien maneja un auto o un autobús. En el restaurante trabajan o garçom / a garçonete (el mesero, la mesera) y o cozinheiro.',
          examples: [
            { target: 'Eu trabalho em um escritório.', base: 'Trabajo en una oficina.' },
            { target: 'Ele é motorista de ônibus.', base: 'Él es chofer de autobús.' },
          ],
        },
        takeaways: [
          'Sabes que escritório es «oficina».',
          'Nombras trabajos del restaurante y del transporte.',
        ],
        exercises: [
          ex.translationChoice(
            'escritório',
            'oficina',
            ['escritorio', 'escuela', 'librería'],
            ['pt-escritorio'],
            {
              id: 'pt.ex.z1kfoyzb54pf6w',
              explanation: 'Falso amigo: escritório es la oficina.',
            },
          ),
          ex.translationChoice(
            'motorista',
            'conductor / chofer',
            ['motociclista', 'mecánico', 'mesero'],
            ['pt-motorista'],
            {
              id: 'pt.ex.voq05pvbxtmet2',
              explanation: 'Motorista es quien maneja: un chofer o conductor.',
            },
          ),
          ex.imageChoice('🤵', 'garçom', ['cozinheiro', 'motorista', 'médico'], ['pt-garcom'], {
            id: 'pt.ex.wkegamkt3gnb9o',
          }),
          ex.listenChoice(
            'O garçom trabalha no restaurante.',
            [
              'O cozinheiro trabalha no restaurante.',
              'O garçom trabalha no escritório.',
              'O garçom mora no Rio.',
            ],
            ['pt-garcom'],
            { id: 'pt.ex.ed9bj3yn2jxns4' },
          ),
          ex.fillBlank(
            'Ela trabalha em um ___ no centro.',
            'Ella trabaja en una oficina en el centro.',
            'escritório',
            ['cozinha', 'garçom', 'motorista'],
            ['pt-escritorio'],
            { id: 'pt.ex.woe8zm0tdjgoaj', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'O ___ trabalha na cozinha.',
            'El cocinero trabaja en la cocina.',
            'cozinheiro',
            ['motorista', 'médico', 'engenheiro'],
            ['pt-cozinheiro', 'pt-cozinha'],
            { id: 'pt.ex.hh8rzc3ju36z5d', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.xnekvkra0n3f5g',
            CAFE,
            '¿Dónde trabaja Diego?',
            'En una oficina del centro',
            ['En un hospital', 'En un restaurante', 'En su casa'],
            ['pt-escritorio', 'pt-engenheiro'],
            'Diego dice: «Trabalho em um escritório no centro».',
          ),
          question(
            'pt.ex.meeng6pl5gdn7z',
            CAFE,
            '¿Qué hace Bruna?',
            'Es enfermera y trabaja de noche',
            ['Es ingeniera y trabaja de mañana', 'Es moza en un restaurante', 'Es estudiante'],
            ['pt-enfermeiro', 'pt-a-noite'],
            'Bruna dice: «Eu sou enfermeira. Trabalho à noite».',
          ),
          ex.shortAnswer(
            'Onde você trabalha?',
            '¿Dónde trabajas? (Responde que en una oficina.)',
            'Eu trabalho em um escritório.',
            [
              'Trabalho em um escritório.',
              'Em um escritório.',
              'Num escritório.',
              'Trabalho num escritório.',
            ],
            ['pt-escritorio', 'pt-trabalho'],
            { id: 'pt.ex.w69ygpsd8w0mdg' },
          ),
          ex.translateWrite(
            'Él es chofer de autobús.',
            'Ele é motorista de ônibus.',
            ['pt-motorista', 'pt-onibus'],
            {
              id: 'pt.ex.skirwqtkargy8k',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Nosso trabalho',
        objective: 'Usar nosso y nossa y presentar a un grupo.',
        intro: {
          explanation:
            'Nosso y nossa son «nuestro» y «nuestra»; en Brasil suelen llevar artículo: o nosso restaurante, a nossa casa. Concuerdan con la cosa, no con las personas.',
          examples: [
            { target: 'O nosso restaurante é pequeno.', base: 'Nuestro restaurante es chico.' },
            { target: 'A nossa família é grande.', base: 'Nuestra familia es grande.' },
          ],
        },
        takeaways: ['Usas nosso y nossa según la cosa.', 'Entiendes una presentación de un grupo.'],
        exercises: [
          ex.fillBlank(
            'A ___ casa é grande.',
            'Nuestra casa es grande.',
            'nossa',
            ['nosso', 'nós', 'a gente'],
            ['pt-nossa'],
            { id: 'pt.ex.rrjwopddzbv2ga', explanation: 'Casa es femenino: a nossa casa.' },
          ),
          ex.fillBlank(
            'O ___ cachorro se chama Rex.',
            'Nuestro perro se llama Rex.',
            'nosso',
            ['nossa', 'nós', 'eles'],
            ['pt-nosso', 'pt-cachorro'],
            { id: 'pt.ex.qgw3ft7xs8ahd8' },
          ),
          ex.listenChoice(
            'A nossa família é grande.',
            ['A nossa família é pequena.', 'O nosso filho é grande.', 'A minha família é grande.'],
            ['pt-nossa', 'pt-familia'],
            { id: 'pt.ex.kzd6seapgq2ad4' },
          ),
          question(
            'pt.ex.etq1w407h29ziw',
            PERFIL,
            '¿Qué hacen Rita y Caio?',
            'Caio es cocinero y Rita es moza',
            ['Los dos son cocineros', 'Rita es cocinera y Caio es mesero', 'Son médicos'],
            ['pt-cozinheiro', 'pt-garcom'],
            'La publicación dice: «O Caio é cozinheiro e eu sou garçonete».',
          ),
          question(
            'pt.ex.mmb0rz1yurtima',
            PERFIL,
            '¿Dónde trabajan?',
            'En su propio restaurante, en Salvador',
            ['En una oficina en Río', 'En un hospital de Salvador', 'En una panadería'],
            ['pt-nosso', 'pt-a-gente'],
            'Escriben: «A gente mora em Salvador e trabalha no nosso restaurante».',
          ),
          question(
            'pt.ex.gmulbwiq4zp2zk',
            FAMILIA,
            '¿A qué se dedica el papá de Lucas?',
            'Es chofer de autobús',
            ['Es médico', 'Es estudiante', 'Es ingeniero'],
            ['pt-motorista'],
            'Lucas dice: «meu pai é motorista de ônibus».',
          ),
          question(
            'pt.ex.8fpmynpc10d01a',
            FAMILIA,
            '¿Qué son los hermanos de Lucas?',
            'Estudiantes, como Lucas y Júlia',
            ['Médicos, como su mamá', 'Choferes', 'Profesores'],
            ['pt-eles', 'pt-nos'],
            'Lucas dice: «Eles são estudantes, como nós».',
          ),
          ex.orderWords(
            'O nosso escritório é pequeno.',
            'Nuestra oficina es chica.',
            ['pt-nosso', 'pt-escritorio'],
            {
              id: 'pt.ex.xhcyympgvmspxg',
            },
          ),
          ex.shortAnswer(
            'Onde vocês moram?',
            '¿Dónde viven ustedes? (Responde que viven en Córdoba.)',
            'Nós moramos em Córdoba.',
            ['Moramos em Córdoba.', 'A gente mora em Córdoba.', 'Em Córdoba.'],
            ['pt-nos', 'pt-a-gente'],
            { id: 'pt.ex.f7cy8i20130cx7' },
          ),
          ex.translateWrite(
            'Nuestra familia es grande.',
            'A nossa família é grande.',
            ['pt-nossa'],
            {
              id: 'pt.ex.ep3rjyyzjot2k2',
              acceptedAnswers: ['Nossa família é grande.'],
            },
          ),
        ],
      },
    ],
  },
};

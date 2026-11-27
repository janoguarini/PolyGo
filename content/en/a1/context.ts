import { A1_LISTENING_RATE, listeningQuestions, readingQuestions } from '../../context-builders';
import type { ContextLessonDef } from '../../types';

/**
 * Lecciones «En contexto» de inglés A1 (fase C, docs/LEARNING_PHASE_C.md): una por unidad cargada
 * (U1–U12), con un texto para leer y un mensaje oral, y preguntas sobre su significado.
 *
 * ESTADO EDITORIAL: borrador. Cotejado con el mapa curricular (docs/polygo-ingles-a1-mapa-curricular.md
 * §3) en la fase C.1: número de lección, objetivos principales (`curriculum`) y objetivo de cada
 * estímulo (`stimulusObjectives`). Sin revisión pedagógica ni de hablantes nativos. Se carga sin
 * publicar. U13 (datos personales) y U14 (precios y compras) están en ./context-planned.ts (fase
 * C.2): sus unidades todavía no tienen lecciones escritas.
 *
 * Reglas de redacción:
 * - Preguntas y opciones en español: se mide si entendiste el mensaje en inglés, no el enunciado.
 * - Ninguna pregunta se resuelve reconociendo una palabra suelta: exige ubicar un dato, relacionar dos
 *   o entender la intención (quién, dónde, cuándo, qué quiere, qué pasó).
 * - Personas ficticias con nombre de pila, sin datos de contacto ni datos del estudiante (§13.2).
 * - `untaught`: palabras del estímulo que el currículo todavía no enseñó en esa unidad.
 */
export const EN_A1_CONTEXT_LESSONS: ContextLessonDef[] = [
  // ---------------------------------------------------------------------------------------- U1
  {
    unit: 1,
    status: 'draft',
    title: 'En contexto: un primer encuentro',
    objective: 'Entender un saludo escrito y una presentación oral.',
    intro: {
      explanation:
        'Vas a leer un mensaje y a escuchar a dos personas que se conocen. No hace falta entender cada palabra: busca quién habla, cuándo y qué quiere.',
      examples: [
        { target: 'Nice to meet you.', base: 'Encantado de conocerte.' },
        { target: 'Fine, thank you. And you?', base: 'Bien, gracias. ¿Y tú?' },
      ],
    },
    takeaways: ['Ahora puedes entender quién saluda, cuándo y qué pregunta en un mensaje corto.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cL05', 'cR02'], secondary: ['v01'] },
    stimulusObjectives: {
      'en.stim.a1-u01-welcome-message': 'cR02',
      'en.stim.a1-u01-first-meeting': 'cL05',
    },
    names: ['Ana', 'Tom', 'Lucy'],
    untaught: ['is'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u01-welcome-message',
          document: 'message',
          setting: 'Un mensaje en el chat de un curso nuevo.',
          lines: ['Good morning, Tom!', 'My name is Ana. Nice to meet you.', 'How are you?'],
        },
        [
          {
            id: 'en.ex.tuumsd72l6c3z4',
            question: '¿Quién escribe el mensaje?',
            answer: 'Ana',
            wrong: ['Tom', 'El profesor del curso'],
            concepts: ['en-my', 'en-name'],
            why: 'Dice «My name is Ana»: la que escribe es Ana, y le escribe a Tom.',
          },
          {
            id: 'en.ex.vhn7fj647m1j63',
            question: '¿En qué momento del día escribe?',
            answer: 'A la mañana',
            wrong: ['A la tarde', 'A la noche'],
            concepts: ['en-good-morning'],
            why: '«Good morning» se usa a la mañana.',
          },
          {
            id: 'en.ex.h4tpmsouob27lg',
            question: '¿Qué le pregunta Ana a Tom?',
            answer: 'Cómo está',
            wrong: ['Cómo se llama', 'Dónde vive'],
            concepts: ['en-how-are-you'],
            why: '«How are you?» es «¿Cómo estás?».',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u01-first-meeting',
          setting: 'Dos personas se encuentran por primera vez.',
          speakers: [
            { name: 'Tom', voice: 'a' },
            { name: 'Lucy', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Tom', text: 'Good afternoon! My name is Tom.' },
            { speaker: 'Lucy', text: 'Hi, Tom. My name is Lucy. Nice to meet you.' },
            { speaker: 'Tom', text: 'Nice to meet you, Lucy. How are you?' },
            { speaker: 'Lucy', text: 'Fine, thank you. And you?' },
          ],
        },
        [
          {
            id: 'en.ex.gg7te3qb8dedhz',
            question: '¿Qué están haciendo Tom y Lucy?',
            answer: 'Se presentan por primera vez',
            wrong: ['Se despiden hasta mañana', 'Se piden perdón'],
            concepts: ['en-nice-to-meet-you', 'en-name'],
            why: 'Dicen sus nombres y «Nice to meet you»: se están conociendo.',
          },
          {
            id: 'en.ex.219wdbpf8gqsaf',
            question: '¿Cómo está Lucy?',
            answer: 'Bien',
            wrong: ['Mal', 'No responde'],
            concepts: ['en-fine', 'en-how-are-you'],
            why: 'Lucy responde «Fine, thank you»: está bien.',
          },
          {
            id: 'en.ex.a94yfn4b29jiua',
            question: '¿En qué momento del día se encuentran?',
            answer: 'A la tarde',
            wrong: ['A la mañana', 'A la noche'],
            concepts: ['en-good-afternoon'],
            why: 'Tom saluda con «Good afternoon», que se usa a la tarde.',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U2
  {
    unit: 2,
    status: 'draft',
    title: 'En contexto: ¿quién es quién?',
    objective: 'Entender una ficha sobre personas y preguntas con «to be» dirigidas a ti.',
    intro: {
      explanation:
        'Vas a leer una ficha sobre dos personas y a escuchar a una profesora que te hace preguntas. Fíjate en quién es quién y en qué te preguntan a ti.',
      examples: [
        { target: 'He is not happy.', base: 'Él no está contento.' },
        { target: 'Are you a student?', base: '¿Eres estudiante?' },
      ],
    },
    takeaways: [
      'Ahora puedes entender quién es quién en un texto corto y qué te preguntan con «to be».',
    ],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR03', 'cL02'], secondary: ['g02'] },
    stimulusObjectives: {
      'en.stim.a1-u02-class-card': 'cR03',
      'en.stim.a1-u02-teacher-questions': 'cL02',
    },
    names: ['Sam', 'Mia', 'Kate'],
    untaught: ['a', 'class', 'our'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u02-class-card',
          document: 'description',
          setting: 'Una ficha sobre dos personas de una clase.',
          title: 'Our class',
          lines: [
            'Sam is a teacher.',
            'Mia is a student. She is happy.',
            'Sam is not happy. He is tired.',
            'Mia and Sam are friends.',
          ],
        },
        [
          {
            id: 'en.ex.5mescl5ctl2qsd',
            question: '¿Quién es el profesor?',
            answer: 'Sam',
            wrong: ['Mia', 'Los dos'],
            concepts: ['en-teacher', 'en-is'],
            why: '«Sam is a teacher»; Mia es estudiante.',
          },
          {
            id: 'en.ex.xfo5v2fs6uxwlg',
            question: '¿Cómo está Sam?',
            answer: 'Cansado',
            wrong: ['Contento', 'Bien'],
            concepts: ['en-tired', 'en-not'],
            why: '«Sam is not happy. He is tired»: está cansado.',
          },
          {
            id: 'en.ex.1u7ghbt2e5dalj',
            question: '¿Qué relación hay entre Mia y Sam?',
            answer: 'Son amigos',
            wrong: ['Son hermanos', 'No se conocen'],
            concepts: ['en-friend', 'en-are'],
            why: '«Mia and Sam are friends».',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u02-teacher-questions',
          setting: 'Primer día de clase: la profesora te habla a ti.',
          speakers: [{ name: 'Kate', voice: 'a' }],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Kate', text: 'Hello! My name is Kate. I am your teacher.' },
            { speaker: 'Kate', text: 'Are you a student?' },
            { speaker: 'Kate', text: 'And are you tired?' },
          ],
        },
        [
          {
            id: 'en.ex.yadb7e867nggc5',
            question: '¿Quién te habla?',
            answer: 'Tu profesora',
            wrong: ['Una estudiante nueva', 'Una amiga tuya'],
            concepts: ['en-teacher', 'en-your'],
            why: 'Dice «I am your teacher»: es tu profesora.',
          },
          {
            id: 'en.ex.xi7fc124gjv0hs',
            question: '¿Qué te pregunta Kate primero?',
            answer: 'Si eres estudiante',
            wrong: ['Si estás cansado', 'Cómo te llamas'],
            concepts: ['en-are', 'en-student'],
            why: 'Primero pregunta «Are you a student?»; después, si estás cansado.',
          },
          {
            id: 'en.ex.t3ed5escjrqnxr',
            question: '¿Qué respuesta corresponde a la segunda pregunta de Kate?',
            answer: 'No, I am not.',
            wrong: ['No, she is not.', 'No, you are not.'],
            concepts: ['en-am', 'en-not', 'en-tired'],
            why: 'Te pregunta a ti («Are you tired?»): se responde con «I am» o «I am not».',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U3
  {
    unit: 3,
    status: 'draft',
    title: 'En contexto: tarjetas de jugadores',
    objective: 'Entender datos de jugadores: número, edad y país.',
    intro: {
      explanation:
        'Vas a leer las tarjetas de tres jugadores de un equipo infantil y a escuchar a un entrenador hablar con un chico nuevo. Presta atención a los números.',
      examples: [
        { target: 'I am from Mexico.', base: 'Soy de México.' },
        { target: 'He is twelve years old.', base: 'Tiene doce años.' },
      ],
    },
    takeaways: ['Ahora puedes encontrar y comparar números, edades y países en un texto corto.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR01', 'cL03'], secondary: ['v03'] },
    stimulusObjectives: {
      'en.stim.a1-u03-player-cards': 'cR01',
      'en.stim.a1-u03-new-player': 'cL03',
    },
    names: ['Lucas', 'Emma', 'Pablo', 'Ray', 'Max', 'Leo'],
    untaught: ['number', 'ok', 'players', 'team'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u03-player-cards',
          document: 'notice',
          setting: 'Las tarjetas de tres jugadores de un equipo de fútbol infantil.',
          title: 'Team players',
          lines: [
            'Lucas: number 7. From Argentina. 12 years old.',
            'Emma: number 10. From England. 11 years old.',
            'Pablo: number 3. From Spain. 12 years old.',
          ],
        },
        [
          {
            id: 'en.ex.0jjnh4hvbthl7q',
            question: '¿De dónde es el jugador número 3?',
            answer: 'De España',
            wrong: ['De Argentina', 'De Inglaterra'],
            concepts: ['en-three', 'en-spain', 'en-from'],
            why: 'La tarjeta del 3 es la de Pablo: «From Spain».',
          },
          {
            id: 'en.ex.qwexkp1092dw0d',
            question: '¿Quién es el más chico de los tres?',
            answer: 'Emma',
            wrong: ['Lucas', 'Pablo'],
            concepts: ['en-eleven', 'en-twelve', 'en-old'],
            why: 'Emma tiene 11 años; Lucas y Pablo tienen 12.',
          },
          {
            id: 'en.ex.x3c9la7vcndzth',
            question: '¿Qué tienen en común Lucas y Pablo?',
            answer: 'La edad',
            wrong: ['El país', 'El número'],
            concepts: ['en-twelve', 'en-year', 'en-old'],
            why: 'Los dos tienen 12 años, pero son de países distintos y tienen otro número.',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u03-new-player',
          setting: 'Un entrenador habla con un chico nuevo del equipo.',
          speakers: [
            { name: 'Ray', voice: 'a' },
            { name: 'Max', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Ray', text: 'Hello, Max! Where are you from?' },
            { speaker: 'Max', text: 'I am from Mexico.' },
            { speaker: 'Ray', text: 'How old are you?' },
            { speaker: 'Max', text: 'I am ten. My friend Leo is eleven.' },
            { speaker: 'Ray', text: 'OK, Max. Your number is eight.' },
          ],
        },
        [
          {
            id: 'en.ex.w9usv0y8bxovtv',
            question: '¿Quién es mayor, Max o su amigo Leo?',
            answer: 'Leo',
            wrong: ['Max', 'Tienen la misma edad'],
            concepts: ['en-ten', 'en-eleven', 'en-how-old'],
            why: 'Max dice «I am ten» y su amigo Leo tiene «eleven»: Leo es mayor.',
          },
          {
            id: 'en.ex.o0nb12tb9hlw7c',
            question: '¿Cuántos años tiene el amigo de Max?',
            answer: 'Once',
            wrong: ['Diez', 'Ocho'],
            concepts: ['en-eleven', 'en-how-old'],
            why: 'Max tiene diez; su amigo Leo, «eleven»: once.',
          },
          {
            id: 'en.ex.snz6n9x61zrxi5',
            question: '¿Qué número le da el entrenador a Max?',
            answer: 'El 8',
            wrong: ['El 10', 'El 11'],
            concepts: ['en-eight'],
            why: 'Ray dice «Your number is eight».',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U4
  {
    unit: 4,
    status: 'draft',
    title: 'En contexto: la familia de Ana',
    objective: 'Entender una descripción y una conversación sobre una familia.',
    intro: {
      explanation:
        'Vas a leer cómo describe Ana a su familia y a escuchar una conversación sobre una foto. Fíjate en las relaciones: quién es hermano, abuela o bebé de quién.',
      examples: [
        { target: 'My sister has a baby.', base: 'Mi hermana tiene un bebé.' },
        { target: 'Who is he?', base: '¿Quién es él?' },
      ],
    },
    takeaways: ['Ahora puedes entender quién es quién en una familia descripta en inglés.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR03', 'cL05'], secondary: ['v04'] },
    stimulusObjectives: {
      'en.stim.a1-u04-ana-family': 'cR03',
      'en.stim.a1-u04-family-photo': 'cL05',
    },
    names: ['Ana', 'Rosa', 'Carlos', 'Elena', 'Tom', 'Julia'],
    untaught: ['a', 'big'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u04-ana-family',
          document: 'post',
          setting: 'Ana publica un texto sobre su familia.',
          from: 'Ana',
          lines: [
            'My family is big.',
            'My mother is Rosa and my father is Carlos.',
            'I have two brothers and a sister.',
            'My sister has a baby. Her baby is a girl.',
            'Our grandmother is Elena.',
          ],
        },
        [
          {
            id: 'en.ex.89v556xn97eggf',
            question: '¿Cuántos hermanos varones tiene Ana?',
            answer: 'Dos',
            wrong: ['Uno', 'Tres'],
            concepts: ['en-brother', 'en-have', 'en-two'],
            why: '«I have two brothers and a sister»: dos hermanos y una hermana.',
          },
          {
            id: 'en.ex.ig0t74gjdkpqj9',
            question: '¿Quién tiene un bebé?',
            answer: 'La hermana de Ana',
            wrong: ['La madre de Ana', 'Ana'],
            concepts: ['en-sister', 'en-has', 'en-baby'],
            why: '«My sister has a baby».',
          },
          {
            id: 'en.ex.1rpruw1owiplpj',
            question: '¿Quién es Elena?',
            answer: 'La abuela de Ana',
            wrong: ['La madre de Ana', 'La hermana de Ana'],
            concepts: ['en-grandmother', 'en-our'],
            why: '«Our grandmother is Elena»; la madre se llama Rosa.',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u04-family-photo',
          setting: 'Tom mira una foto de la familia de Ana y le pregunta.',
          speakers: [
            { name: 'Tom', voice: 'a' },
            { name: 'Ana', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Tom', text: 'Who is he?' },
            { speaker: 'Ana', text: 'He is my grandfather.' },
            { speaker: 'Tom', text: 'And who is she?' },
            { speaker: 'Ana', text: 'She is my sister, Julia. She has a baby girl.' },
            { speaker: 'Tom', text: 'Is Julia a teacher?' },
            { speaker: 'Ana', text: 'Yes, she is.' },
          ],
        },
        [
          {
            id: 'en.ex.gyg00ys9o4bqrr',
            question: '¿Quién es el hombre de la foto?',
            answer: 'El abuelo de Ana',
            wrong: ['El padre de Ana', 'El hermano de Ana'],
            concepts: ['en-grandfather', 'en-who'],
            why: 'Ana responde «He is my grandfather».',
          },
          {
            id: 'en.ex.crow2piwoxwkxj',
            question: '¿Qué tiene Julia?',
            answer: 'Una hija bebé',
            wrong: ['Un hijo bebé', 'Dos hermanas'],
            concepts: ['en-has', 'en-baby', 'en-girl'],
            why: '«She has a baby girl»: una beba.',
          },
          {
            id: 'en.ex.64yf5x33msgw8h',
            question: '¿A qué se dedica Julia?',
            answer: 'Es profesora',
            wrong: ['Es estudiante', 'No trabaja'],
            concepts: ['en-teacher'],
            why: 'A «Is Julia a teacher?» Ana responde «Yes, she is».',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U5
  {
    unit: 5,
    status: 'draft',
    title: 'En contexto: ¿cuál es el tuyo?',
    objective: 'Entender mensajes sobre objetos: de quién son, cómo son.',
    intro: {
      explanation:
        'Vas a leer un mensaje y escuchar una conversación sobre cosas que alguien encontró. Fíjate en el color, el tamaño y de quién es cada cosa.',
      examples: [
        { target: 'Is this your book?', base: '¿Este es tu libro?' },
        { target: 'That phone is black.', base: 'Ese teléfono es negro.' },
      ],
    },
    takeaways: ['Ahora puedes entender de quién es un objeto y cómo es, en un mensaje corto.'],
    curriculumLesson: 7,
    plannedBefore: ['U5 L6 Uno, dos, muchos (plurales, g05)'],
    curriculum: { primary: ['cR05', 'cL01'], secondary: ['g06'] },
    stimulusObjectives: {
      'en.stim.a1-u05-found-objects': 'cR05',
      'en.stim.a1-u05-whose-cup': 'cL01',
    },
    names: ['Mia', 'Ben', 'Leo', 'Kim'],
    untaught: [],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u05-found-objects',
          document: 'message',
          setting: 'Mia encontró cosas en el aula y le escribe a Ben.',
          from: 'Mia',
          to: 'Ben',
          lines: [
            'Hi, Ben! Is this your book?',
            'It is a big blue book.',
            'That black pen is my pen.',
            'And these keys? Are they your keys?',
          ],
        },
        [
          {
            id: 'en.ex.lv5rt52nmulf7h',
            question: '¿Cómo es el libro que encontró Mia?',
            answer: 'Grande y azul',
            wrong: ['Chico y azul', 'Grande y negro'],
            concepts: ['en-big', 'en-blue', 'en-book'],
            why: '«It is a big blue book».',
          },
          {
            id: 'en.ex.tc8m7y4n9igolj',
            question: '¿De quién es el bolígrafo negro?',
            answer: 'De Mia',
            wrong: ['De Ben', 'De la profesora'],
            concepts: ['en-black', 'en-pen', 'en-my'],
            why: 'Mia escribe «That black pen is my pen».',
          },
          {
            id: 'en.ex.6ofuuuoxxo5l2v',
            question: '¿Qué quiere saber Mia sobre las llaves?',
            answer: 'Si son de Ben',
            wrong: ['Dónde están', 'De qué color son'],
            concepts: ['en-these', 'en-key', 'en-your'],
            why: 'Pregunta «Are they your keys?»: si son de Ben.',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u05-whose-cup',
          setting: 'Leo y Kim ordenan la mesa después de una reunión.',
          speakers: [
            { name: 'Leo', voice: 'a' },
            { name: 'Kim', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Leo', text: 'Kim, is that your phone?' },
            { speaker: 'Kim', text: 'No, my phone is white. That phone is black.' },
            { speaker: 'Leo', text: 'And this cup?' },
            { speaker: 'Kim', text: 'Yes, it is my cup. Thank you!' },
          ],
        },
        [
          {
            id: 'en.ex.01z3goz26no6ql',
            question: '¿De qué color es el teléfono de Kim?',
            answer: 'Blanco',
            wrong: ['Negro', 'Rojo'],
            concepts: ['en-white', 'en-phone'],
            why: 'Kim dice «my phone is white»; el negro no es suyo.',
          },
          {
            id: 'en.ex.6ogg7zvav05663',
            question: '¿Qué objeto es de Kim?',
            answer: 'La taza',
            wrong: ['El teléfono negro', 'La computadora'],
            concepts: ['en-this', 'en-cup'],
            why: 'A «And this cup?» responde «Yes, it is my cup».',
          },
          {
            id: 'en.ex.uqc13r04m42y2e',
            question: '¿Cómo termina la conversación?',
            answer: 'Kim le agradece a Leo',
            wrong: ['Kim le pide perdón a Leo', 'Leo se despide de Kim'],
            concepts: ['en-thank-you'],
            why: 'Kim termina con «Thank you!».',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U6
  {
    unit: 6,
    status: 'draft',
    title: 'En contexto: un apartamento en alquiler',
    objective: 'Entender un aviso de alquiler y dónde está cada cosa.',
    intro: {
      explanation:
        'Vas a leer un aviso de un apartamento y a escuchar a la dueña mostrarlo. Busca cuántas habitaciones hay y dónde está cada cosa.',
      examples: [
        { target: 'There are two bedrooms.', base: 'Hay dos dormitorios.' },
        { target: 'The keys are on the table.', base: 'Las llaves están sobre la mesa.' },
      ],
    },
    takeaways: ['Ahora puedes entender qué tiene una casa y dónde está cada cosa.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR03', 'cL04'], secondary: ['p04'] },
    stimulusObjectives: {
      'en.stim.a1-u06-rental-ad': 'cR03',
      'en.stim.a1-u06-house-tour': 'cL04',
    },
    names: ['Nora', 'Sara'],
    untaught: [],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u06-rental-ad',
          document: 'ad',
          setting: 'Un aviso de un apartamento en alquiler.',
          title: 'Apartment',
          lines: [
            'Small apartment.',
            'There are two bedrooms and one bathroom.',
            'There is a big kitchen.',
            'There is a sofa in the living room.',
            'There is no garden.',
          ],
        },
        [
          {
            id: 'en.ex.j57dtqsdfox60t',
            question: '¿Cuántos dormitorios tiene el apartamento?',
            answer: 'Dos',
            wrong: ['Uno', 'Tres'],
            concepts: ['en-there-are', 'en-bedroom'],
            why: '«There are two bedrooms».',
          },
          {
            id: 'en.ex.0rfgsc91m7fo0f',
            question: '¿Qué mueble hay en la sala?',
            answer: 'Un sofá',
            wrong: ['Una cama', 'Una mesa'],
            concepts: ['en-sofa', 'en-living-room', 'en-in'],
            why: '«There is a sofa in the living room».',
          },
          {
            id: 'en.ex.2m8bfcvwaniuia',
            question: '¿Tiene jardín?',
            answer: 'No, no tiene',
            wrong: ['Sí, uno grande', 'Sí, uno chico'],
            concepts: ['en-there-is', 'en-garden'],
            why: '«There is no garden»: no tiene.',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u06-house-tour',
          setting: 'Nora le muestra el apartamento a Sara.',
          speakers: [
            { name: 'Nora', voice: 'a' },
            { name: 'Sara', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            {
              speaker: 'Nora',
              text: 'This is the living room. The kitchen is next to the living room.',
            },
            { speaker: 'Sara', text: 'Where is the bathroom?' },
            { speaker: 'Nora', text: 'The bathroom is next to the bedroom.' },
            { speaker: 'Sara', text: 'And the keys?' },
            { speaker: 'Nora', text: 'They are on the table, in the kitchen.' },
          ],
        },
        [
          {
            id: 'en.ex.djri0furyacy0t',
            question: '¿Dónde está la cocina?',
            answer: 'Al lado de la sala',
            wrong: ['Al lado del dormitorio', 'Al lado del baño'],
            concepts: ['en-kitchen', 'en-next-to', 'en-living-room'],
            why: '«The kitchen is next to the living room».',
          },
          {
            id: 'en.ex.xddb6eaxfr4nlp',
            question: '¿Qué quiere saber Sara primero?',
            answer: 'Dónde está el baño',
            wrong: ['Cuántos dormitorios hay', 'Dónde está el jardín'],
            concepts: ['en-bathroom'],
            why: 'Su primera pregunta es «Where is the bathroom?».',
          },
          {
            id: 'en.ex.exkwfmpibg0jkq',
            question: '¿Dónde están las llaves?',
            answer: 'Sobre la mesa de la cocina',
            wrong: ['Debajo de la mesa', 'En el dormitorio'],
            concepts: ['en-on', 'en-table', 'en-kitchen'],
            why: '«They are on the table, in the kitchen».',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U7
  {
    unit: 7,
    status: 'draft',
    title: 'En contexto: en el café',
    objective: 'Entender un menú y un pedido en un café.',
    intro: {
      explanation:
        'Vas a leer el menú de un café y a escuchar a una clienta pedir. Fíjate qué hay en cada comida del día y qué pide ella.',
      examples: [
        { target: 'I want eggs and bread, please.', base: 'Quiero huevos y pan, por favor.' },
        { target: 'Are you hungry?', base: '¿Tienes hambre?' },
      ],
    },
    takeaways: ['Ahora puedes entender un menú sencillo y un pedido en un café.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR01', 'cL05'], secondary: ['p10'] },
    stimulusObjectives: {
      'en.stim.a1-u07-cafe-menu': 'cR01',
      'en.stim.a1-u07-cafe-order': 'cL05',
    },
    names: ['Paul', 'Emma'],
    untaught: ['menu', 'ok', 'or', 'with'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u07-cafe-menu',
          document: 'menu',
          setting: 'El menú de un café.',
          title: 'Menu',
          lines: [
            'BREAKFAST',
            'Coffee or tea with milk',
            'Bread and cheese',
            'Eggs',
            'Apple juice',
            'LUNCH',
            'Chicken and rice',
            'Water',
          ],
        },
        [
          {
            id: 'en.ex.yle3210esacq1g',
            question: '¿Qué se puede comer en el almuerzo?',
            answer: 'Pollo con arroz',
            wrong: ['Huevos', 'Pan con queso'],
            concepts: ['en-lunch', 'en-chicken', 'en-rice'],
            why: 'Debajo de «LUNCH» dice «Chicken and rice»; los huevos y el pan son del desayuno.',
          },
          {
            id: 'en.ex.z9wm3r1m3n8tae',
            question: '¿Qué se puede tomar en el almuerzo?',
            answer: 'Agua',
            wrong: ['Jugo de manzana', 'Té con leche'],
            concepts: ['en-lunch', 'en-water'],
            why: 'Debajo de «LUNCH» sólo hay «Water»; el jugo y el té son del desayuno.',
          },
          {
            id: 'en.ex.ftskfow70ilagr',
            question: '¿Qué comida del día no aparece en el menú?',
            answer: 'La cena',
            wrong: ['El desayuno', 'El almuerzo'],
            concepts: ['en-breakfast', 'en-lunch', 'en-dinner'],
            why: 'Sólo hay «BREAKFAST» y «LUNCH»: no hay cena (dinner).',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u07-cafe-order',
          setting: 'Paul atiende a Emma en un café.',
          speakers: [
            { name: 'Paul', voice: 'a' },
            { name: 'Emma', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Paul', text: 'Good morning! Are you hungry?' },
            { speaker: 'Emma', text: 'Yes, I am. I want eggs and bread, please.' },
            { speaker: 'Paul', text: 'And to drink?' },
            { speaker: 'Emma', text: 'Tea with milk, please. No coffee.' },
            { speaker: 'Paul', text: 'OK. Eggs, bread and tea.' },
          ],
        },
        [
          {
            id: 'en.ex.maprpinsxp3niw',
            question: '¿Qué quiere comer Emma?',
            answer: 'Huevos con pan',
            wrong: ['Pollo con arroz', 'Pan con queso'],
            concepts: ['en-want', 'en-egg', 'en-bread'],
            why: 'Emma dice «I want eggs and bread, please».',
          },
          {
            id: 'en.ex.pdlt0fpkbstqrs',
            question: '¿Qué quiere tomar?',
            answer: 'Té con leche',
            wrong: ['Café con leche', 'Agua'],
            concepts: ['en-tea', 'en-milk', 'en-drink'],
            why: '«Tea with milk, please. No coffee».',
          },
          {
            id: 'en.ex.agflnq59cif1la',
            question: '¿Qué le pregunta Paul a Emma al principio?',
            answer: 'Si tiene hambre',
            wrong: ['Si tiene sed', 'Si quiere café'],
            concepts: ['en-hungry'],
            why: 'Paul pregunta «Are you hungry?».',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U8
  {
    unit: 8,
    status: 'draft',
    title: 'En contexto: la semana de Tom',
    objective: 'Entender un mensaje escrito y uno de voz sobre rutinas.',
    intro: {
      explanation:
        'Vas a leer un mensaje de Tom sobre su rutina y a escuchar un mensaje de voz que le deja a su mamá. Fíjate qué hace siempre, qué no hace y dónde.',
      examples: [
        { target: 'I never watch TV.', base: 'Nunca miro televisión.' },
        { target: "She doesn't work.", base: 'Ella no trabaja.' },
      ],
    },
    takeaways: ['Ahora puedes entender qué hace alguien todos los días y qué no hace nunca.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR02', 'cL06'], secondary: ['g12'] },
    stimulusObjectives: {
      'en.stim.a1-u08-tom-message': 'cR02',
      'en.stim.a1-u08-voice-message': 'cL06',
    },
    names: ['Tom', 'Sam'],
    untaught: ['at', 'english', 'mom', 'tv'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u08-tom-message',
          document: 'message',
          setting: 'Tom le escribe a su amigo Sam.',
          from: 'Tom',
          to: 'Sam',
          lines: [
            'Hi, Sam!',
            'I work every day and I study English at home.',
            'At home, I usually read. I never watch TV.',
            "My sister doesn't work. She studies at school.",
          ],
        },
        [
          {
            id: 'en.ex.so9vaxk9qglb07',
            question: '¿Qué hace Tom en casa?',
            answer: 'Estudia inglés y lee',
            wrong: ['Mira televisión', 'Trabaja con su hermana'],
            concepts: ['en-study', 'en-home', 'en-read', 'en-usually'],
            why: '«I study English at home» y «At home, I usually read».',
          },
          {
            id: 'en.ex.jqs34j04qp7oda',
            question: '¿Qué no hace nunca Tom?',
            answer: 'Mirar televisión',
            wrong: ['Leer', 'Trabajar'],
            concepts: ['en-never', 'en-watch'],
            why: '«I never watch TV».',
          },
          {
            id: 'en.ex.52brx89hm6sab2',
            question: '¿Qué hace la hermana de Tom?',
            answer: 'Estudia en la escuela',
            wrong: ['Trabaja todos los días', 'Estudia en casa'],
            concepts: ['en-doesnt', 'en-work', 'en-school'],
            why: "«My sister doesn't work. She studies at school».",
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u08-voice-message',
          setting: 'Tom le deja un mensaje de voz a su mamá.',
          speakers: [{ name: 'Tom', voice: 'a' }],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Tom', text: "Hi, Mom. It's Tom." },
            { speaker: 'Tom', text: 'I live in a small apartment. I work at home.' },
            { speaker: 'Tom', text: "I always get up and read. I don't watch TV." },
            { speaker: 'Tom', text: 'Bye!' },
          ],
        },
        [
          {
            id: 'en.ex.i94dczua9ctapi',
            question: '¿Dónde vive Tom?',
            answer: 'En un apartamento chico',
            wrong: ['En una casa grande', 'En un apartamento grande'],
            concepts: ['en-live', 'en-small', 'en-apartment'],
            why: '«I live in a small apartment».',
          },
          {
            id: 'en.ex.weoj0ufwy26a85',
            question: '¿Dónde trabaja Tom?',
            answer: 'En su casa',
            wrong: ['En la escuela', 'En una oficina'],
            concepts: ['en-work', 'en-home'],
            why: '«I work at home».',
          },
          {
            id: 'en.ex.ybbrxlsaql3eut',
            question: '¿Qué hace siempre Tom después de levantarse?',
            answer: 'Lee',
            wrong: ['Mira televisión', 'Vuelve a dormir'],
            concepts: ['en-always', 'en-get-up', 'en-read'],
            why: '«I always get up and read»; televisión no mira.',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U9
  {
    unit: 9,
    status: 'draft',
    title: 'En contexto: el programa del museo',
    objective: 'Entender un horario y un anuncio con días y horas.',
    intro: {
      explanation:
        'Vas a leer el horario de un museo y a escuchar un anuncio. Busca qué días abre, a qué hora y cuándo cierra.',
      examples: [
        { target: "The museum opens at nine o'clock.", base: 'El museo abre a las nueve.' },
        { target: 'at half past ten', base: 'a las diez y media' },
      ],
    },
    takeaways: ['Ahora puedes encontrar días y horarios en un programa y en un anuncio.'],
    curriculumLesson: 7,
    plannedBefore: ['U9 L6 Meses y fechas (v09)'],
    curriculum: { primary: ['cR01', 'cL03'], secondary: ['v09'] },
    stimulusObjectives: {
      'en.stim.a1-u09-museum-hours': 'cR01',
      'en.stim.a1-u09-museum-announcement': 'cL03',
    },
    names: [],
    untaught: ['children', 'closes', 'for', 'museum', 'opens', 'tour', 'visits'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u09-museum-hours',
          document: 'schedule',
          setting: 'El horario de un museo, en la puerta de entrada.',
          title: 'The museum',
          lines: [
            "Tuesday to Friday: 10 o'clock to 6 o'clock",
            "Saturday and Sunday: 9 o'clock to 5 o'clock",
            'Monday: no visits',
            'Tour for children: Saturday at half past ten',
          ],
        },
        [
          {
            id: 'en.ex.k15s4zk6j0tj6u',
            question: '¿Qué día no se puede visitar el museo?',
            answer: 'El lunes',
            wrong: ['El sábado', 'El domingo'],
            concepts: ['en-monday'],
            why: '«Monday: no visits».',
          },
          {
            id: 'en.ex.boclhyjohh7pt0',
            question: '¿A qué hora abre el sábado?',
            answer: 'A las 9',
            wrong: ['A las 10', 'A las 5'],
            concepts: ['en-saturday', 'en-oclock'],
            why: "«Saturday and Sunday: 9 o'clock to 5 o'clock»: abre a las 9 y cierra a las 5.",
          },
          {
            id: 'en.ex.i60vjk21r8ybso',
            question: '¿Cuándo es la visita para chicos?',
            answer: 'El sábado a las 10:30',
            wrong: ['El domingo a las 10:30', 'El sábado a las 9'],
            concepts: ['en-saturday', 'en-half-past', 'en-at'],
            why: '«Saturday at half past ten»: el sábado a las diez y media.',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u09-museum-announcement',
          setting: 'Un anuncio por los parlantes del museo.',
          speakers: [{ name: 'Anuncio', voice: 'a' }],
          rate: A1_LISTENING_RATE,
          lines: [
            {
              speaker: 'Anuncio',
              text: "Good afternoon. Today the museum closes at five o'clock.",
            },
            { speaker: 'Anuncio', text: "Tomorrow, Sunday, the museum opens at nine o'clock." },
            { speaker: 'Anuncio', text: 'Thank you.' },
          ],
        },
        [
          {
            id: 'en.ex.7am24aykkg3b7q',
            question: '¿A qué hora cierra hoy el museo?',
            answer: 'A las 5',
            wrong: ['A las 9', 'A las 6'],
            concepts: ['en-today', 'en-five', 'en-oclock'],
            why: "«Today the museum closes at five o'clock».",
          },
          {
            id: 'en.ex.gcyrko2vbwvha5',
            question: '¿Qué día es mañana?',
            answer: 'Domingo',
            wrong: ['Sábado', 'Lunes'],
            concepts: ['en-tomorrow', 'en-sunday'],
            why: '«Tomorrow, Sunday»: mañana es domingo (hoy, sábado).',
          },
          {
            id: 'en.ex.fy6kord4mv6ek2',
            question: '¿Qué pasa mañana a las 9?',
            answer: 'Abre el museo',
            wrong: ['Cierra el museo', 'Empieza una visita para chicos'],
            concepts: ['en-tomorrow', 'en-nine', 'en-at'],
            why: "«The museum opens at nine o'clock».",
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U10
  {
    unit: 10,
    status: 'draft',
    title: 'En contexto: ¿cómo llego?',
    objective: 'Entender carteles e indicaciones para llegar a un lugar.',
    intro: {
      explanation:
        'Vas a leer un cartel, escuchar a alguien que pide indicaciones en la calle y seguir unas indicaciones escritas. Fíjate hacia dónde hay que ir y si queda cerca o lejos.',
      examples: [
        { target: 'Go straight on and turn left.', base: 'Sigue derecho y dobla a la izquierda.' },
        { target: 'The hotel is far.', base: 'El hotel queda lejos.' },
      ],
    },
    takeaways: ['Ahora puedes entender indicaciones sencillas para llegar a un lugar.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR06', 'cL04', 'cR01'], secondary: ['g19'] },
    stimulusObjectives: {
      'en.stim.a1-u10-street-sign': 'cR01',
      'en.stim.a1-u10-asking-the-way': 'cL04',
      'en.stim.a1-u10-way-to-the-museum': 'cR06',
    },
    names: ['Ann', 'Joe'],
    untaught: ['take'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u10-street-sign',
          document: 'sign',
          setting: 'Un cartel en una esquina de la ciudad.',
          lines: [
            'Station: turn left.',
            'Park: turn right.',
            'Hospital: go straight on.',
            'Library: next to the bank.',
          ],
        },
        [
          {
            id: 'en.ex.py9y4uvzvfe4wc',
            question: 'Si quieres ir al parque, ¿hacia dónde tienes que doblar?',
            answer: 'A la derecha',
            wrong: ['A la izquierda', 'No hay que doblar: es derecho'],
            concepts: ['en-park', 'en-turn', 'en-right'],
            why: '«Park: turn right».',
          },
          {
            id: 'en.ex.n0ph5t5jwipsee',
            question: '¿Dónde está la biblioteca?',
            answer: 'Al lado del banco',
            wrong: ['Al lado del hospital', 'Lejos del banco'],
            concepts: ['en-library', 'en-bank'],
            why: '«Library: next to the bank».',
          },
          {
            id: 'en.ex.85cci9c0dx9c21',
            question: '¿Qué lugar queda hacia la izquierda?',
            answer: 'La estación',
            wrong: ['El parque', 'El hospital'],
            concepts: ['en-station', 'en-left'],
            why: '«Station: turn left».',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u10-asking-the-way',
          setting: 'Ann pide indicaciones en la calle.',
          speakers: [
            { name: 'Ann', voice: 'a' },
            { name: 'Joe', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Ann', text: 'Excuse me. Where is the cinema, please?' },
            {
              speaker: 'Joe',
              text: 'The cinema is near. Go straight on and turn left. It is next to the supermarket.',
            },
            { speaker: 'Ann', text: 'And the hotel?' },
            { speaker: 'Joe', text: 'The hotel is far. Take the bus.' },
            { speaker: 'Ann', text: 'Thank you!' },
          ],
        },
        [
          {
            id: 'en.ex.aqkmo48m12v67c',
            question: '¿Qué lugar busca Ann primero?',
            answer: 'El cine',
            wrong: ['El supermercado', 'El hotel'],
            concepts: ['en-where', 'en-cinema'],
            why: 'Su primera pregunta es «Where is the cinema, please?».',
          },
          {
            id: 'en.ex.vnpfm05s1qx28q',
            question: '¿Cómo se llega al cine?',
            answer: 'Derecho y después a la izquierda',
            wrong: ['Derecho y después a la derecha', 'En autobús'],
            concepts: ['en-straight-on', 'en-turn', 'en-left'],
            why: '«Go straight on and turn left».',
          },
          {
            id: 'en.ex.0911px10w8v7to',
            question: '¿Qué le aconseja Joe para ir al hotel?',
            answer: 'Tomar el autobús, porque queda lejos',
            wrong: ['Ir caminando, porque queda cerca', 'Doblar a la izquierda en el cine'],
            concepts: ['en-far', 'en-bus', 'en-hotel'],
            why: '«The hotel is far. Take the bus».',
          },
        ],
      ),
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u10-way-to-the-museum',
          document: 'directions',
          setting: 'Indicaciones escritas para ir caminando de la estación al museo.',
          lines: [
            'From the station, go straight on.',
            'Turn left at the supermarket.',
            'Go straight on. The museum is on the right, next to the library.',
          ],
        },
        [
          {
            id: 'en.ex.h8fx8ulyxyuui6',
            question: 'Al salir de la estación, ¿qué hay que hacer primero?',
            answer: 'Seguir derecho',
            wrong: ['Doblar a la izquierda', 'Doblar a la derecha'],
            concepts: ['en-station', 'en-straight-on'],
            why: 'La primera indicación es «From the station, go straight on».',
          },
          {
            id: 'en.ex.eyi8sw0cqq9la0',
            question: '¿Dónde hay que doblar a la izquierda?',
            answer: 'En el supermercado',
            wrong: ['En la biblioteca', 'En la estación'],
            concepts: ['en-turn', 'en-left', 'en-supermarket'],
            why: '«Turn left at the supermarket».',
          },
          {
            id: 'en.ex.pnu0pk38xjc3bv',
            question: '¿Dónde está el museo?',
            answer: 'A la derecha, al lado de la biblioteca',
            wrong: [
              'A la izquierda, al lado de la biblioteca',
              'A la derecha, al lado del supermercado',
            ],
            concepts: ['en-museum', 'en-right', 'en-next-to', 'en-library'],
            why: '«The museum is on the right, next to the library».',
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U11
  {
    unit: 11,
    status: 'draft',
    title: 'En contexto: una publicación sobre hobbies',
    objective: 'Entender una publicación y una conversación sobre gustos.',
    intro: {
      explanation:
        'Vas a leer lo que cuenta Lily sobre sus pasatiempos y a escuchar a dos amigos hablar de lo que les gusta. Fíjate qué les encanta, qué odian y qué saben hacer.',
      examples: [
        { target: "I can't play football.", base: 'No sé jugar al fútbol.' },
        { target: 'My favorite sport is swimming.', base: 'Mi deporte favorito es la natación.' },
      ],
    },
    takeaways: ['Ahora puedes entender qué le gusta a alguien, qué odia y qué sabe hacer.'],
    curriculumLesson: 6,
    plannedBefore: [],
    curriculum: { primary: ['cR02', 'cL05'], secondary: ['p06'] },
    stimulusObjectives: {
      'en.stim.a1-u11-hobbies-post': 'cR02',
      'en.stim.a1-u11-likes-chat': 'cL05',
    },
    names: ['Lily', 'Dan', 'Rose'],
    untaught: ["can't", 'cooking', 'swimming'],
    exercises: [
      ...readingQuestions(
        {
          kind: 'reading',
          id: 'en.stim.a1-u11-hobbies-post',
          document: 'post',
          setting: 'Lily publica algo sobre sus pasatiempos.',
          from: 'Lily',
          lines: [
            'I love music. I sing every day.',
            "I like sport, but I can't play football.",
            'My favorite sport is swimming. I can swim very well.',
            'But I hate cooking!',
          ],
        },
        [
          {
            id: 'en.ex.ui7ki8awu75e6w',
            question: '¿Cuál es el deporte favorito de Lily?',
            answer: 'La natación',
            wrong: ['El fútbol', 'El baile'],
            concepts: ['en-favorite', 'en-sport', 'en-swim'],
            why: '«My favorite sport is swimming».',
          },
          {
            id: 'en.ex.zg68bj47l5wegm',
            question: '¿Qué no sabe hacer Lily?',
            answer: 'Jugar al fútbol',
            wrong: ['Nadar', 'Cantar'],
            concepts: ['en-can', 'en-football', 'en-but'],
            why: "«I can't play football»; en cambio, nada muy bien y canta todos los días.",
          },
          {
            id: 'en.ex.4a6l6g4jc1omw4',
            question: '¿Qué odia Lily?',
            answer: 'Cocinar',
            wrong: ['Cantar', 'Viajar'],
            concepts: ['en-hate', 'en-cook'],
            why: '«I hate cooking!».',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u11-likes-chat',
          setting: 'Dan y Rose charlan sobre lo que les gusta.',
          speakers: [
            { name: 'Dan', voice: 'a' },
            { name: 'Rose', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Dan', text: 'Do you like movies?' },
            { speaker: 'Rose', text: 'Yes, I love movies! And you?' },
            { speaker: 'Dan', text: 'I like movies, but I love games. Can you play football?' },
            { speaker: 'Rose', text: "No, I can't. But I can dance!" },
          ],
        },
        [
          {
            id: 'en.ex.ekbtz4esf5a5vm',
            question: '¿Qué le encanta a Rose?',
            answer: 'Las películas',
            wrong: ['Los juegos', 'El fútbol'],
            concepts: ['en-love', 'en-movie'],
            why: 'Rose dice «I love movies!».',
          },
          {
            id: 'en.ex.lu03ig82ylwwha',
            question: '¿Qué le gusta más a Dan?',
            answer: 'Los juegos',
            wrong: ['Las películas', 'El baile'],
            concepts: ['en-like', 'en-love', 'en-game', 'en-but'],
            why: '«I like movies, but I love games»: los juegos le gustan más.',
          },
          {
            id: 'en.ex.b3oad92w3dhnjz',
            question: '¿Qué sabe hacer Rose?',
            answer: 'Bailar',
            wrong: ['Jugar al fútbol', 'Cantar'],
            concepts: ['en-can', 'en-dance'],
            why: "«No, I can't. But I can dance!».",
          },
        ],
      ),
    ],
  },

  // ---------------------------------------------------------------------------------------- U12
  {
    unit: 12,
    status: 'draft',
    title: 'En contexto: una conversación completa',
    objective: 'Entender una conversación en clase y las preguntas que te hacen a ti.',
    intro: {
      explanation:
        'Vas a escuchar a una profesora que te habla a ti y una conversación en clase. Fíjate qué te pregunta, qué te pide y qué problema tiene cada uno.',
      examples: [
        { target: "I don't understand.", base: 'No entiendo.' },
        {
          target: 'Can you speak slowly, please?',
          base: '¿Puedes hablar más despacio, por favor?',
        },
      ],
    },
    takeaways: ['Ahora puedes entender cuándo alguien no entiende y qué pide para resolverlo.'],
    curriculumLesson: 7,
    plannedBefore: ['U12 L6 Mensajes y postales (p09, cR02)'],
    curriculum: { primary: ['cL02', 'cL05'], secondary: ['v12'] },
    stimulusObjectives: {
      'en.stim.a1-u12-teacher-to-you': 'cL02',
      'en.stim.a1-u12-in-class': 'cL05',
    },
    names: ['Park', 'Ben'],
    untaught: ['course', 'of'],
    exercises: [
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u12-teacher-to-you',
          setting: 'En clase, la profesora te habla a ti.',
          speakers: [{ name: 'Ms. Park', voice: 'b' }],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Ms. Park', text: 'Good morning! What is your name?' },
            { speaker: 'Ms. Park', text: 'Do you speak Spanish?' },
            { speaker: 'Ms. Park', text: 'Please repeat the word slowly.' },
          ],
        },
        [
          {
            id: 'en.ex.y258gw5mlmpoxl',
            question: '¿Qué te pregunta primero la profesora?',
            answer: 'Cómo te llamas',
            wrong: ['Cómo estás', 'De dónde eres'],
            concepts: ['en-what', 'en-your', 'en-name'],
            why: 'Primero pregunta «What is your name?».',
          },
          {
            id: 'en.ex.ndkm8lkntoaigw',
            question: '¿Qué respuesta corresponde a su segunda pregunta?',
            answer: 'Yes, I do.',
            wrong: ['Yes, I am.', 'Yes, it is.'],
            concepts: ['en-do', 'en-speak', 'en-spanish'],
            why: "A «Do you speak Spanish?» se responde con «do»: «Yes, I do» o «No, I don't».",
          },
          {
            id: 'en.ex.umf74h75lqm3r1',
            question: '¿Qué te pide que hagas al final?',
            answer: 'Que repitas la palabra despacio',
            wrong: ['Que escribas la palabra', 'Que traduzcas la palabra al español'],
            concepts: ['en-repeat', 'en-word', 'en-slowly'],
            why: '«Please repeat the word slowly».',
          },
        ],
      ),
      ...listeningQuestions(
        {
          kind: 'listening',
          id: 'en.stim.a1-u12-in-class',
          setting: 'Ben y su profesora conversan en clase.',
          speakers: [
            { name: 'Ben', voice: 'a' },
            { name: 'Ms. Park', voice: 'b' },
          ],
          rate: A1_LISTENING_RATE,
          lines: [
            { speaker: 'Ben', text: "Sorry, I don't understand. Can you speak slowly, please?" },
            { speaker: 'Ms. Park', text: 'Of course. How many books do you have?' },
            { speaker: 'Ben', text: 'Three books.' },
            { speaker: 'Ms. Park', text: 'Good. Which book is your favorite?' },
            { speaker: 'Ben', text: 'The English book, because it is fun.' },
          ],
        },
        [
          {
            id: 'en.ex.i4k6xono6jfhrq',
            question: '¿Qué le pide Ben a la profesora?',
            answer: 'Que hable más despacio',
            wrong: ['Que repita la respuesta', 'Que le preste un libro'],
            concepts: ['en-speak', 'en-slowly'],
            why: '«Can you speak slowly, please?».',
          },
          {
            id: 'en.ex.u6nmu7kirzcfow',
            question: '¿Cuántos libros tiene Ben?',
            answer: 'Tres',
            wrong: ['Dos', 'Uno'],
            concepts: ['en-how-many'],
            why: 'A «How many books do you have?» responde «Three books».',
          },
          {
            id: 'en.ex.w31d8lnao3mmeq',
            question: '¿Por qué el libro de inglés es su favorito?',
            answer: 'Porque es divertido',
            wrong: ['Porque es grande', 'Porque es nuevo'],
            concepts: ['en-which', 'en-because'],
            why: '«The English book, because it is fun».',
          },
        ],
      ),
    ],
  },
];

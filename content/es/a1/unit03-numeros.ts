import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U3 «Numbers and age» (docs/ES_A1_A2.md): los números del 1 al 12 y el 20, tener en
 * singular (yo tengo, tú tienes, él / ella / usted tiene: g en la primera persona y diptongo e → ie) y
 * la edad con tener (tengo veinte años, nunca «soy veinte»), ¿cuántos años tienes? y la apócope uno →
 * un año. Variante: español neutro de Latinoamérica (tú, usted, ustedes).
 * Pronunciación: la r suave (tres, cuatro) frente a la r fuerte al principio (Rosario, Roma); la v
 * suena igual que la b (veinte, nueve); el falso amigo once (eleven).
 * Cultura: en casi todos los países hispanohablantes la primaria empieza a los seis años.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PLAZA = dialogue(
  'es.stim.a1-u3-plaza',
  'Two mothers talk at a playground in Lima while their children play.',
  [
    ['Ana', '¡Hola! Ella es Valentina. Tiene seis años.'],
    ['Camila', 'Hola, Valentina. Él es Mateo. Tiene ocho años.'],
    ['Ana', '¿Y él? ¿Cuántos años tiene?'],
    ['Camila', 'Él es Tomás. Tiene tres años.'],
  ],
  ES_A1_RATE,
);

const EDAD = dialogue(
  'es.stim.a1-u3-edad',
  'Kevin, an exchange student, talks to Mateo, the young son of his host family.',
  [
    ['Kevin', '¡Hola! ¿Cómo te llamas?'],
    ['Mateo', 'Mateo. ¿Cuántos años tienes?'],
    ['Kevin', 'Tengo veinte años. ¿Y tú, Mateo?'],
    ['Mateo', 'Yo tengo siete. ¡Veinte son muchos!'],
  ],
  ES_A1_RATE,
);

const FICHA = reading(
  'es.stim.a1-u3-ficha',
  'form',
  'A registration form for a Spanish course for children in Bogotá.',
  [
    'Nombre: Claire',
    'Nacionalidad: francesa',
    'Edad: once años',
    'Ciudad: París',
    'Idiomas: francés, inglés y un poco de español',
  ],
  { title: 'Curso de español' },
);

export const ES_A1_U03: EsUnitDef = {
  names: [
    'Ana',
    'Camila',
    'Valentina',
    'Mateo',
    'Tomás',
    'Thiago',
    'Sofía',
    'Diego',
    'Kevin',
    'Claire',
    'Lima',
    'París',
  ],
  support: ['idiomas', 'meses', 'son', 'nombre', 'nacionalidad', 'edad', 'curso'],
  unit: {
    position: 3,
    title: 'Numbers and age',
    titleEn: 'Números y edad',
    description:
      'Count from one to twelve and say twenty, use tener (tengo, tienes, tiene) and say and ask how old someone is.',
    emoji: '🔢',
    objective:
      'You can count from one to twelve, say twenty, say how old you are and ask other people how old they are.',
    grammar: {
      title: 'Tener · age with tener · un año',
      explanation:
        'Tener (to have) in the singular: yo tengo, tú tienes, él / ella / usted tiene. It is irregular in two ways: yo has a g (tengo), and in tienes and tiene the e of the stem becomes ie (ten- → tien-). In Spanish you “have” years: tengo veinte años (I am twenty years old) — never soy veinte. To ask a friend: ¿cuántos años tienes?; with usted: ¿cuántos años tiene? Uno becomes un before a masculine noun: un año, but uno, dos, tres when you count. Año has an ñ (like the ny in canyon): always write it. The v in veinte and nueve sounds exactly like a b, and the r in tres and cuatro is a quick tap, like the tt in American butter.',
      examples: [
        { target: 'Tengo veinte años.', base: 'I am twenty years old.' },
        {
          target: '¿Cuántos años tienes? — Tengo doce.',
          base: 'How old are you? — I’m twelve.',
        },
        { target: 'Thiago tiene un año.', base: 'Thiago is one year old.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U3), convertido al español neutro con tú (tienes, ¿cuántos años tienes?). Sin revisión nativa: revisar «Dos y dos son cuatro» (también se oye «dos más dos, cuatro»), el diálogo con un chico («¡Veinte son muchos!») y la ficha de inscripción (nombre, nacionalidad, edad, idiomas van como apoyo, sin practicarse). Las edades de adultos se limitan a veinte porque sólo se enseña del 1 al 12 y el 20.',
    },
    words: [
      w('es-uno', 'uno', 'one', 'Thiago tiene un año.', 'Thiago is one year old.', ['numbers'], {
        acceptedTexts: ['un', 'una'],
        emoji: '1️⃣',
      }),
      w('es-dos', 'dos', 'two', 'Hablo dos idiomas.', 'I speak two languages.', ['numbers'], {
        emoji: '2️⃣',
      }),
      w('es-tres', 'tres', 'three', 'Tomás tiene tres años.', 'Tomás is three years old.', [
        'numbers',
      ]),
      w('es-cuatro', 'cuatro', 'four', 'Dos y dos son cuatro.', 'Two and two are four.', [
        'numbers',
      ]),
      w(
        'es-cinco',
        'cinco',
        'five',
        'Valentina tiene cinco años.',
        'Valentina is five years old.',
        ['numbers'],
      ),
      w('es-seis', 'seis', 'six', 'Mateo tiene seis años.', 'Mateo is six years old.', ['numbers']),
      w('es-siete', 'siete', 'seven', 'Sofía tiene siete años.', 'Sofía is seven years old.', [
        'numbers',
      ]),
      w('es-ocho', 'ocho', 'eight', 'Diego tiene ocho años.', 'Diego is eight years old.', [
        'numbers',
      ]),
      w('es-nueve', 'nueve', 'nine', 'Camila tiene nueve años.', 'Camila is nine years old.', [
        'numbers',
      ]),
      w('es-diez', 'diez', 'ten', 'Ella tiene diez años.', 'She is ten years old.', ['numbers'], {
        emoji: '🔟',
      }),
      w('es-once', 'once', 'eleven', 'Claire tiene once años.', 'Claire is eleven years old.', [
        'numbers',
      ]),
      w('es-doce', 'doce', 'twelve', 'Un año tiene doce meses.', 'A year has twelve months.', [
        'numbers',
      ]),
      w('es-veinte', 'veinte', 'twenty', 'Tengo veinte años.', 'I’m twenty years old.', [
        'numbers',
      ]),
      w(
        'es-tengo',
        'tengo',
        'I have',
        'Tengo veinte años y soy estudiante.',
        'I’m twenty years old and I’m a student.',
        ['verbs'],
      ),
      w(
        'es-tienes',
        'tienes',
        'you have, informal',
        '¿Tienes doce años?',
        'Are you twelve years old?',
        ['verbs'],
        { acceptedTexts: ['tenés'] },
      ),
      w(
        'es-tiene',
        'tiene',
        'he has',
        'Él tiene once años.',
        'He is eleven years old.',
        ['verbs'],
        {
          acceptedTranslations: ['she has', 'you have, formal'],
        },
      ),
      w(
        'es-cuantos-anos-tienes',
        '¿cuántos años tienes?',
        'how old are you?',
        '¡Hola! ¿Cuántos años tienes?',
        'Hi! How old are you?',
        ['questions'],
        { acceptedTexts: ['¿cuántos años tenés?'] },
      ),
      w(
        'es-el-ano',
        'el año',
        'the year',
        'Un año tiene doce meses.',
        'A year has twelve months.',
        ['time'],
        { acceptedTranslations: ['year'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Uno, dos, tres',
        objective: 'Count from one to six.',
        intro: {
          explanation:
            'One to six: uno, dos, tres, cuatro, cinco, seis. Every vowel is pronounced: cu-a-tro. The r in tres and cuatro is a quick tap of the tongue, like the tt in American butter. The ei in seis sounds like the ey in they.',
          examples: [
            {
              target: 'Uno, dos, tres, cuatro, cinco, seis.',
              base: 'One, two, three, four, five, six.',
            },
            { target: 'Hablo dos idiomas.', base: 'I speak two languages.' },
          ],
        },
        takeaways: ['You count from one to six.', 'You say a number before a noun: dos idiomas.'],
        exercises: [
          ex.imageChoice('3️⃣', 'tres', ['dos', 'seis', 'cinco'], ['es-tres'], {
            id: 'es.ex.32h7sbtk7ntpzo',
          }),
          ex.translationChoice('cinco', 'five', ['four', 'six', 'three'], ['es-cinco'], {
            id: 'es.ex.ejodpyxgt9h2hv',
          }),
          ex.matchPairs(
            [
              ['uno', 'one'],
              ['dos', 'two'],
              ['cuatro', 'four'],
              ['seis', 'six'],
            ],
            ['es-uno', 'es-dos', 'es-cuatro', 'es-seis'],
            { id: 'es.ex.pch9pd36hlfxsv' },
          ),
          ex.fillBlank(
            'Uno, dos, ___, cuatro.',
            'One, two, three, four.',
            'tres',
            ['seis', 'cinco', 'dos'],
            ['es-tres', 'es-uno', 'es-dos', 'es-cuatro'],
            {
              id: 'es.ex.wr3ugw4w6g78uq',
              skill: 'vocabulary',
              explanation: 'Uno, dos, tres, cuatro: one, two, three, four.',
            },
          ),
          ex.listenChoice(
            'Hablo dos idiomas.',
            ['Hablo tres idiomas.', 'Hablo seis idiomas.', 'Hablo cinco idiomas.'],
            ['es-dos'],
            { id: 'es.ex.g51pelbe7zlrww' },
          ),
          ex.imageChoice('5️⃣', 'cinco', ['cuatro', 'seis', 'uno'], ['es-cinco'], {
            id: 'es.ex.0pe2jcyysbep5o',
          }),
          ex.fillBlank(
            'Dos y dos son ___.',
            'Two and two are four.',
            'cuatro',
            ['cinco', 'tres', 'seis'],
            ['es-cuatro'],
            {
              id: 'es.ex.tullqnv9noqg2l',
              skill: 'vocabulary',
              explanation: 'Dos y dos son cuatro: 2 + 2 = 4.',
            },
          ),
          ex.listenChoice(
            'Tres y tres son seis.',
            ['Tres y dos son cinco.', 'Dos y dos son cuatro.', 'Uno y dos son tres.'],
            ['es-tres', 'es-seis'],
            { id: 'es.ex.br51e85y3czs0y' },
          ),
          ex.translateWrite('I speak two languages.', 'Hablo dos idiomas.', ['es-dos'], {
            id: 'es.ex.nv3jxk7by7a6jn',
            acceptedAnswers: ['Yo hablo dos idiomas.'],
          }),
          ex.shortAnswer(
            'Uno, dos, tres, cuatro, cinco…',
            'Write the next number in words.',
            'seis',
            ['Seis'],
            ['es-seis'],
            { id: 'es.ex.bt28qeugj3kwmf' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Siete, ocho… ¡veinte!',
        objective: 'Count from seven to twelve and say twenty.',
        intro: {
          explanation:
            'Seven to twelve: siete, ocho, nueve, diez, once, doce. And twenty: veinte. Careful: once is not the English word once — it means eleven. The v in nueve and veinte sounds exactly like a b, and the z in diez sounds like an s. Doce (twelve) has two syllables and dos (two) has one: listen for the e at the end.',
          examples: [
            { target: 'Siete, ocho, nueve, diez.', base: 'Seven, eight, nine, ten.' },
            { target: 'Once, doce… ¡veinte!', base: 'Eleven, twelve… twenty!' },
          ],
        },
        takeaways: [
          'You count from seven to twelve and say veinte.',
          'You remember that once means eleven.',
        ],
        exercises: [
          ex.translationChoice('once', 'eleven', ['twelve', 'one', 'ten'], ['es-once'], {
            id: 'es.ex.6umdawksfhs80g',
            explanation: 'Once is a false friend: it means eleven.',
          }),
          ex.matchPairs(
            [
              ['siete', 'seven'],
              ['ocho', 'eight'],
              ['nueve', 'nine'],
              ['diez', 'ten'],
            ],
            ['es-siete', 'es-ocho', 'es-nueve', 'es-diez'],
            { id: 'es.ex.jkz5v27ejgfmqz' },
          ),
          ex.imageChoice('🔟', 'diez', ['doce', 'dos', 'nueve'], ['es-diez', 'es-doce'], {
            id: 'es.ex.1fh0xfeni0mer0',
          }),
          ex.listenChoice('doce', ['dos', 'diez', 'once'], ['es-doce'], {
            id: 'es.ex.74r3jvvxmee0ps',
          }),
          ex.fillBlank(
            'Ocho, nueve, ___, once.',
            'Eight, nine, ten, eleven.',
            'diez',
            ['doce', 'siete', 'veinte'],
            ['es-diez', 'es-ocho', 'es-nueve', 'es-once'],
            {
              id: 'es.ex.fxz1lh8m26abs8',
              skill: 'vocabulary',
              explanation: 'Ocho, nueve, diez, once: 8, 9, 10, 11.',
            },
          ),
          ex.listenChoice('ocho', ['once', 'doce', 'cuatro'], ['es-ocho'], {
            id: 'es.ex.bvypz6raiaifsy',
          }),
          ex.fillBlank(
            'Diez y diez son ___.',
            'Ten and ten are twenty.',
            'veinte',
            ['doce', 'once', 'nueve'],
            ['es-veinte'],
            {
              id: 'es.ex.spzvtcvx0qx4o2',
              skill: 'vocabulary',
              explanation: 'Diez y diez son veinte: 10 + 10 = 20. The v sounds like a b.',
            },
          ),
          ex.translationChoice('veinte', 'twenty', ['twelve', 'eleven', 'seven'], ['es-veinte'], {
            id: 'es.ex.ihr8cstz9uexyg',
          }),
          ex.translateWrite('twelve students', 'doce estudiantes', ['es-doce'], {
            id: 'es.ex.vtz2dqqfwk64jo',
          }),
          ex.shortAnswer(
            'Nueve, diez, once…',
            'Write the next number in words.',
            'doce',
            ['Doce'],
            ['es-doce'],
            { id: 'es.ex.y42z7amcvmry27' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Tengo veinte años',
        objective: 'Say how old you are with tener.',
        intro: {
          explanation:
            'In English you are twenty; in Spanish you have twenty years: tengo veinte años. Never say soy veinte. Tengo means I have. Año (year) has an ñ, like the ny in canyon: always write it. For one year, uno becomes un: tengo un año.',
          examples: [
            { target: 'Tengo veinte años.', base: 'I am twenty years old.' },
            {
              target: 'Soy estudiante y tengo veinte años.',
              base: 'I’m a student and I’m twenty.',
            },
          ],
        },
        takeaways: ['You say your age with tengo + number + años.', 'You say un año, not uno año.'],
        exercises: [
          ex.translationChoice('tengo', 'I have', ['I am', 'I speak', 'I live in'], ['es-tengo'], {
            id: 'es.ex.305pgomrler5xc',
          }),
          ex.fillBlank(
            'Yo ___ veinte años.',
            'I’m twenty years old.',
            'tengo',
            ['soy', 'estoy', 'hablo'],
            ['es-tengo', 'es-veinte'],
            {
              id: 'es.ex.jedhyqt0yn6c0x',
              explanation:
                'Age goes with tener, not ser or estar: tengo veinte años (literally, I have twenty years).',
            },
          ),
          ex.translationChoice(
            'el año',
            'the year',
            ['the country', 'the city', 'the student'],
            ['es-el-ano'],
            { id: 'es.ex.ak87k3rqh3kjo0' },
          ),
          ex.listenChoice(
            'Tengo doce años.',
            ['Tengo dos años.', 'Tengo diez años.', 'Tengo once años.'],
            ['es-tengo', 'es-doce'],
            { id: 'es.ex.c0ruciuorygv74' },
          ),
          ex.orderWords(
            'Tengo veinte años y soy estudiante.',
            'I’m twenty years old and I’m a student.',
            ['es-tengo', 'es-veinte'],
            { id: 'es.ex.6dsqppsmm21lsn' },
          ),
          ex.fillBlank(
            'Tengo un ___.',
            'I’m one year old.',
            'año',
            ['años', 'país', 'ciudad'],
            ['es-el-ano', 'es-uno'],
            {
              id: 'es.ex.ppvstbkyxnnkmw',
              explanation:
                'One year is singular: un año. Uno becomes un before a masculine noun. Años is the plural.',
            },
          ),
          ex.matchPairs(
            [
              ['tengo', 'I have'],
              ['el año', 'the year'],
              ['veinte', 'twenty'],
              ['doce', 'twelve'],
            ],
            ['es-tengo', 'es-el-ano', 'es-veinte', 'es-doce'],
            { id: 'es.ex.6iagqw07x8eo3t' },
          ),
          ex.listenChoice(
            'Tengo un año.',
            ['Tengo once años.', 'Tengo nueve años.', 'Tengo cinco años.'],
            ['es-tengo', 'es-uno'],
            { id: 'es.ex.5obt3zx590koz5' },
          ),
          ex.translateWrite("I'm eight years old.", 'Tengo ocho años.', ['es-tengo', 'es-ocho'], {
            id: 'es.ex.ojxfrmgu1qcfdy',
            acceptedAnswers: ['Yo tengo ocho años.'],
          }),
          ex.translateWrite(
            "I'm a student and I'm twenty years old.",
            'Soy estudiante y tengo veinte años.',
            ['es-tengo', 'es-veinte'],
            {
              id: 'es.ex.l4phkd402jt28b',
              acceptedAnswers: [
                'Yo soy estudiante y tengo veinte años.',
                'Soy estudiante y tengo veinte.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '¿Cuántos años tienes?',
        objective: 'Ask how old someone is with tú or usted, and talk about other people’s age.',
        intro: {
          explanation:
            'Tener with other people: tú tienes (to a friend) and él, ella and usted tiene. Notice the change: tengo has a g, and in tienes and tiene the e becomes ie. The only difference between tienes and tiene is the final s: listen for it. To ask a friend: ¿cuántos años tienes? With usted: ¿cuántos años tiene?',
          examples: [
            {
              target: '¿Cuántos años tienes? — Tengo veinte.',
              base: 'How old are you? — I’m twenty.',
            },
            { target: 'Valentina tiene seis años.', base: 'Valentina is six years old.' },
          ],
        },
        takeaways: [
          'You ask a friend ¿cuántos años tienes?',
          'You say yo tengo, tú tienes and él, ella or usted tiene.',
        ],
        exercises: [
          ex.translationChoice(
            '¿cuántos años tienes?',
            'how old are you?',
            ['where are you from?', "what's your name?", 'how are you?'],
            ['es-cuantos-anos-tienes'],
            { id: 'es.ex.grx3y9u5h2h3zz' },
          ),
          ex.fillBlank(
            '¿Cuántos años ___, Sofía?',
            'How old are you, Sofía? (to a friend)',
            'tienes',
            ['tengo', 'tiene', 'eres'],
            ['es-tienes', 'es-cuantos-anos-tienes'],
            {
              id: 'es.ex.fa6csb7u4s8yi3',
              explanation:
                'To a friend you use tú: ¿cuántos años tienes? Tiene (no final s) is for él, ella or usted.',
            },
          ),
          ex.fillBlank(
            'Valentina ___ seis años.',
            'Valentina is six years old.',
            'tiene',
            ['tienes', 'tengo', 'es'],
            ['es-tiene', 'es-seis'],
            {
              id: 'es.ex.2zap6gmnzqhmp1',
              explanation: 'With ella (Valentina) the verb is tiene. Age always goes with tener.',
            },
          ),
          ex.listenChoice(
            '¿Cuántos años tienes?',
            ['¿Cuántos años tiene?', '¿De dónde eres?', '¿Cómo te llamas?'],
            ['es-cuantos-anos-tienes'],
            { id: 'es.ex.ca7ph8zttit91b' },
          ),
          question(
            'es.ex.9f669x28ezhgbn',
            PLAZA,
            'How old is Valentina?',
            'Six',
            ['Eight', 'Three', 'Seven'],
            ['es-seis', 'es-tiene'],
            'Ana says “Ella es Valentina. Tiene seis años”.',
          ),
          question(
            'es.ex.bvgxhuxz9txapb',
            PLAZA,
            'How old is Mateo?',
            'Eight',
            ['Six', 'Three', 'Eleven'],
            ['es-ocho', 'es-tiene'],
            'Camila says “Él es Mateo. Tiene ocho años”.',
          ),
          question(
            'es.ex.npnciags9d5egp',
            PLAZA,
            'Who is three years old?',
            'Tomás',
            ['Valentina', 'Mateo', 'Camila'],
            ['es-tres', 'es-tiene'],
            'Camila says “Él es Tomás. Tiene tres años”.',
          ),
          ex.listenChoice(
            'Tengo cinco años.',
            ['Tienes cinco años.', 'Tiene cinco años.', 'Tengo cuatro años.'],
            ['es-tengo', 'es-tienes', 'es-cinco'],
            { id: 'es.ex.9zn8idfj7inbp0' },
          ),
          ex.translateWrite(
            'She is ten years old.',
            'Ella tiene diez años.',
            ['es-tiene', 'es-diez'],
            {
              id: 'es.ex.d5txgg1et984f4',
              acceptedAnswers: ['Tiene diez años.'],
            },
          ),
          ex.shortAnswer(
            '¿Cuántos años tienes?',
            'Say you are twenty (e.g. «Tengo veinte años»).',
            'Tengo veinte años.',
            ['Tengo veinte años', 'Tengo veinte.', 'Yo tengo veinte años.'],
            ['es-tengo', 'es-veinte'],
            { id: 'es.ex.0oydziqmripwxa' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Uno, dos, tres… ¡veinte!',
        objective: 'Understand ages and numbers in a conversation and a form.',
        intro: {
          explanation:
            'In almost every Spanish-speaking country children start primary school at six. On a form you often see nombre (name), nacionalidad (nationality) and edad (age). And remember: un año tiene doce meses — a year has twelve months.',
          examples: [
            { target: 'Un año tiene doce meses.', base: 'A year has twelve months.' },
            { target: 'Mateo tiene siete años.', base: 'Mateo is seven years old.' },
          ],
        },
        takeaways: [
          'You understand ages in a short conversation and on a form.',
          'You ask and answer about age with tú and with usted.',
        ],
        exercises: [
          question(
            'es.ex.fcmn9jc1d5ljdv',
            EDAD,
            'How old is Mateo?',
            'Seven',
            ['Six', 'Eleven', 'Twenty'],
            ['es-siete', 'es-tengo'],
            'Mateo says “Yo tengo siete”.',
          ),
          question(
            'es.ex.ba355v7ife5emb',
            EDAD,
            'How old is Kevin?',
            'Twenty',
            ['Twelve', 'Seven', 'Ten'],
            ['es-veinte'],
            'Kevin says “Tengo veinte años”.',
          ),
          question(
            'es.ex.8542ozy7ddiw44',
            EDAD,
            'What does Mateo ask Kevin?',
            'How old he is',
            ['Where he is from', 'How he is', 'What his name is'],
            ['es-cuantos-anos-tienes'],
            'Mateo asks “¿Cuántos años tienes?”.',
          ),
          question(
            'es.ex.ckbkxymriqxu7o',
            FICHA,
            'How old is Claire?',
            'Eleven',
            ['One', 'Twelve', 'Twenty'],
            ['es-once', 'es-el-ano'],
            'The form says “Edad: once años”. Once means eleven, not one.',
          ),
          question(
            'es.ex.i5t40mgo6f9b8u',
            FICHA,
            'How many languages does Claire speak?',
            'Three',
            ['Two', 'One', 'Four'],
            ['es-tres'],
            'The form says “francés, inglés y un poco de español”: three languages.',
          ),
          ex.fillBlank(
            'Un año tiene ___ meses.',
            'A year has twelve months.',
            'doce',
            ['diez', 'once', 'veinte'],
            ['es-el-ano', 'es-doce'],
            {
              id: 'es.ex.s3w7oqyaanc6xu',
              skill: 'vocabulary',
              explanation: 'A year has twelve months: doce meses.',
            },
          ),
          ex.listenChoice(
            'Tiene nueve años.',
            ['Tiene once años.', 'Tienes nueve años.', 'Tiene nueve meses.'],
            ['es-nueve', 'es-tiene'],
            { id: 'es.ex.nosfcadugkwjwr' },
          ),
          ex.translateWrite(
            'Claire is eleven years old.',
            'Claire tiene once años.',
            ['es-tiene', 'es-once'],
            { id: 'es.ex.y24tp7my0ho94g', acceptedAnswers: ['Claire tiene 11 años.'] },
          ),
          ex.shortAnswer(
            '¿Cuántos años tiene usted?',
            'A man asks you formally. Say you are twenty (e.g. «Tengo veinte años»).',
            'Tengo veinte años.',
            ['Tengo veinte años', 'Tengo veinte.', 'Yo tengo veinte años.'],
            ['es-tengo', 'es-veinte'],
            { id: 'es.ex.c8nzx0e7q3fduu' },
          ),
        ],
      },
    ],
  },
};

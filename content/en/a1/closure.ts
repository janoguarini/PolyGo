import { ex } from '../../builders';
import type { ContextStimulus } from '../../../shared/exercises';
import type { ExerciseDef, UnitSupplementDef, WordDef } from '../../types';

/**
 * Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): lo que el mapa curricular
 * (docs/polygo-ingles-a1-mapa-curricular.md §3 y §6) agrega a las unidades que ya tienen lecciones.
 *
 * - `appendices`: ejercicios al final de una lección cargada («M: agregar …»). No cambian sus
 *   ejercicios cargados ni la consolidación generada (no están en `UnitDef.lessons`).
 * - `lessons`: las lecciones nuevas del mapa en unidades cargadas (U5 L6, U9 L6, U12 L6).
 * - Correspondencia de los formatos del mapa con los tipos que existen (sin tipos nuevos):
 *     PW  (escribir a partir de una imagen o una situación) → short_answer: la «imagen» es una escena
 *         con emojis en `question` (la app no la pronuncia) y la línea en español describe la tarea,
 *         nunca la frase a traducir. Respuestas enumeradas (normalized_text.v1).
 *     TR  (transformación) → short_answer con la oración original y la consigna en español.
 *     SIT (situación → fórmula) → fill_blank: la situación en español, las fórmulas como opciones.
 *     LM  (escuchar → significado) y RQ (texto → pregunta) → context_choice, como en la fase C.
 *     LD  (dictado), FF (formulario validado por campo), GW con datos propios y FW: no tienen tipo
 *         de ejercicio corregible en el servidor. GW y FW van en content/en/a1/writing.ts
 *         (autoevaluación en el dispositivo, sin enviar el texto); LD y FF, en el documento.
 *
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni de hablantes nativos. Se carga sin publicar.
 */

const NARROW = 'Escribe en inglés lo que muestra la imagen.';

const listening = (
  id: string,
  setting: string,
  speaker: string,
  text: string,
): ContextStimulus => ({
  kind: 'listening',
  id,
  setting,
  speakers: [{ name: speaker, voice: 'a' }],
  rate: 0.85,
  lines: [{ speaker, text }],
});

const contextQuestion = (
  id: string,
  stimulus: ContextStimulus,
  question: string,
  answer: string,
  distractors: string[],
  concepts: string[],
  explanation: string,
): ExerciseDef => ({
  id,
  type: 'context_choice',
  skill: stimulus.kind === 'reading' ? 'reading' : 'listening',
  prompt: stimulus.kind === 'reading' ? 'Lee y responde' : 'Escucha y responde',
  payload: { type: 'context_choice', stimulus, question, options: [answer, ...distractors] },
  answer,
  words: [],
  concepts,
  explanation,
  recommendedSeconds: 30,
});

const word = (
  id: string,
  text: string,
  translation: string,
  ipa: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, ipa, exampleEn, exampleEs, tags, ...extra });

const month = (id: string, text: string, translation: string, ipa: string, example: string) =>
  word(id, text, translation, ipa, example, `(${translation})`, ['months'], { emoji: '📅' });

// ---------------------------------------------------------------- U1 Saludos
const U1: UnitSupplementDef = {
  unit: 1,
  words: [],
  names: ['Ana', 'Tom'],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u01-l01',
      mapChange: 'C. Agregar SIT y LM',
      curriculum: { primary: ['v01'], secondary: ['cL01'] },
      exercises: [
        ex.fillBlank(
          '___, Ana!',
          'Situación: llegas a clase y ves a tu amiga Ana. ¿Qué le dices?',
          'Hello',
          ['Goodbye', 'Thank you', "You're welcome"],
          ['en-hello'],
          {
            id: 'en.ex.c10rahqtzepich',
            skill: 'vocabulary',
            explanation: 'Al llegar se saluda: Hello (o Hi). Goodbye es para irse.',
          },
        ),
        ex.fillBlank(
          '___, Tom!',
          'Situación: te vas de la casa de Tom. ¿Qué le dices?',
          'Bye',
          ['Hello', 'Sorry', 'Please'],
          ['en-bye'],
          {
            id: 'en.ex.fad656othcatl8',
            skill: 'vocabulary',
            explanation: 'Al irse se dice Bye o Goodbye.',
          },
        ),
        contextQuestion(
          'en.ex.hiw0f512gznbfk',
          listening('en.stim.a1-u01-lm-goodbye', 'Tom sale de la clase.', 'Tom', 'Goodbye!'),
          '¿Qué significa lo que dice Tom?',
          'Adiós',
          ['Hola', 'Gracias', 'Perdón'],
          ['en-goodbye'],
          'Tom dice «Goodbye!»: es una despedida (adiós).',
        ),
      ],
    },
    {
      lesson: 'a1-u01-l02',
      mapChange: 'C. Agregar SIT (qué saludo corresponde a cada hora)',
      curriculum: { primary: ['v01'], secondary: ['v09'] },
      exercises: [
        ex.fillBlank(
          '___, Ana!',
          'Situación: son las 9 de la mañana y entras a la oficina. ¿Cómo saludas a Ana?',
          'Good morning',
          ['Good night', 'Good evening', 'Goodbye'],
          ['en-good-morning'],
          {
            id: 'en.ex.1fov8w5jfx75k6',
            skill: 'vocabulary',
            explanation: 'A la mañana: Good morning. Good night es para despedirse a la noche.',
          },
        ),
        ex.fillBlank(
          '___, Tom!',
          'Situación: son las 11 de la noche y te vas a dormir. ¿Qué le dices a Tom?',
          'Good night',
          ['Good morning', 'Good afternoon', 'Hello'],
          ['en-good-night'],
          {
            id: 'en.ex.tdn0y0799xsqq7',
            skill: 'vocabulary',
            explanation: 'Good night se usa para despedirse a la noche o antes de dormir.',
          },
        ),
        ex.shortAnswer(
          '🌙 😴',
          'Situación: es de noche y te vas a dormir. Escribe en inglés qué le dices a tu familia.',
          'Good night.',
          ['Goodnight.', 'Good night, everyone.'],
          ['en-good-night'],
          {
            id: 'en.ex.1nellcptfi1np5',
            explanation: 'Antes de dormir se dice Good night (no Good evening, que es un saludo).',
          },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U2 To be
const U2: UnitSupplementDef = {
  unit: 2,
  words: [],
  names: [],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u02-l04',
      mapChange: 'C. Sumar 3 o 4 profesiones (v15)',
      curriculum: { primary: ['g02'], secondary: ['v15'] },
      exercises: [
        ex.imageChoice('🧑‍⚕️', 'doctor', ['teacher', 'student', 'friend'], ['en-doctor'], {
          id: 'en.ex.ttam5lt9olzqm6',
        }),
        ex.matchPairs(
          [
            ['doctor', 'médico / médica'],
            ['nurse', 'enfermero / enfermera'],
            ['engineer', 'ingeniero / ingeniera'],
            ['waiter', 'mozo / moza'],
          ],
          ['en-doctor', 'en-nurse', 'en-engineer', 'en-waiter'],
          { id: 'en.ex.3i21gxxq0mw9lz' },
        ),
        ex.listenChoice(
          'She is a nurse.',
          ['She is a teacher.', 'He is a nurse.', 'She is a doctor.'],
          ['en-nurse', 'en-doctor', 'en-she', 'en-is'],
          { id: 'en.ex.x2dkk73ahifpeb' },
        ),
        ex.translationChoice(
          'engineer',
          'ingeniero / ingeniera',
          ['médico / médica', 'mozo / moza', 'profesor / profesora'],
          ['en-engineer'],
          { id: 'en.ex.2v88izrqwoieqc' },
        ),
        ex.shortAnswer(
          '👨‍🏫',
          'Escribe en inglés qué es este hombre. Empieza con He.',
          'He is a teacher.',
          ["He's a teacher."],
          ['en-he', 'en-is', 'en-teacher'],
          {
            id: 'en.ex.1l6b6mjk2aefl4',
            explanation: 'Profesión con to be y a: He is a teacher.',
          },
        ),
      ],
    },
    {
      lesson: 'a1-u02-l05',
      mapChange: 'M: agregar TR',
      curriculum: { primary: ['g03'], secondary: ['g16'] },
      exercises: [
        ex.shortAnswer(
          'I am tired.',
          'Escribe la oración en negativa.',
          'I am not tired.',
          ["I'm not tired."],
          ['en-am', 'en-not', 'en-tired'],
          {
            id: 'en.ex.l0g7l3i1llk6xm',
            explanation: 'Negativa: am + not → I am not (I’m not) tired.',
          },
        ),
        ex.shortAnswer(
          'She is a teacher.',
          'Escribe la oración como pregunta.',
          'Is she a teacher?',
          [],
          ['en-is', 'en-she', 'en-teacher'],
          {
            id: 'en.ex.s7d2hvokytqq21',
            explanation: 'Pregunta con to be: el verbo va primero. Is she…?',
          },
        ),
        ex.shortAnswer(
          'They are students.',
          'Escribe la oración en negativa.',
          'They are not students.',
          ["They aren't students.", "They're not students."],
          ['en-are', 'en-not', 'en-student'],
          { id: 'en.ex.1puxv3gfsq0279', explanation: 'They are not = they aren’t = they’re not.' },
        ),
        ex.shortAnswer(
          'You are happy.',
          'Escribe la oración como pregunta.',
          'Are you happy?',
          [],
          ['en-are', 'en-you', 'en-happy'],
          {
            id: 'en.ex.wnczcyje3ef3bc',
            explanation: 'Are va antes de you en la pregunta: Are you happy?',
          },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U3 Números
const teen = (
  id: string,
  text: string,
  translation: string,
  ipa: string,
  exampleEn: string,
  exampleEs: string,
) => word(id, text, translation, ipa, exampleEn, exampleEs, ['numbers']);

const U3: UnitSupplementDef = {
  unit: 3,
  words: [
    word('en-zero', 'zero', 'cero', '/ˈzɪroʊ/', 'Zero, one, two.', 'Cero, uno, dos.', ['numbers'], {
      emoji: '0️⃣',
    }),
    teen('en-thirteen', 'thirteen', 'trece', '/θɜrˈtin/', 'She is thirteen.', 'Ella tiene trece.'),
    teen(
      'en-fourteen',
      'fourteen',
      'catorce',
      '/fɔrˈtin/',
      'I am fourteen.',
      'Tengo catorce años.',
    ),
    teen(
      'en-sixteen',
      'sixteen',
      'dieciséis',
      '/sɪkˈstin/',
      'He is sixteen.',
      'Él tiene dieciséis.',
    ),
    teen(
      'en-seventeen',
      'seventeen',
      'diecisiete',
      '/ˌsɛvənˈtin/',
      'She is seventeen.',
      'Ella tiene diecisiete.',
    ),
    teen(
      'en-eighteen',
      'eighteen',
      'dieciocho',
      '/eɪˈtin/',
      'I am eighteen years old.',
      'Tengo dieciocho años.',
    ),
    teen(
      'en-nineteen',
      'nineteen',
      'diecinueve',
      '/ˌnaɪnˈtin/',
      'She is nineteen.',
      'Ella tiene diecinueve.',
    ),
  ],
  names: [],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u03-l03',
      mapChange: 'M: completar el 0, el 13, el 14 y del 16 al 19 y agregar LD',
      curriculum: { primary: ['v03'], secondary: ['cL01'] },
      exercises: [
        ex.imageChoice('0️⃣', 'zero', ['ten', 'one', 'two'], ['en-zero'], {
          id: 'en.ex.ooe1mwno2h715p',
        }),
        ex.translationChoice(
          'thirteen',
          'trece',
          ['tres', 'catorce', 'dieciséis'],
          ['en-thirteen'],
          { id: 'en.ex.3ydta6e3g0zfk6' },
        ),
        ex.matchPairs(
          [
            ['fourteen', 'catorce'],
            ['sixteen', 'dieciséis'],
            ['eighteen', 'dieciocho'],
            ['nineteen', 'diecinueve'],
          ],
          ['en-fourteen', 'en-sixteen', 'en-eighteen', 'en-nineteen'],
          { id: 'en.ex.inqvhldbde5k5k' },
        ),
        ex.listenChoice('seventeen', ['seven', 'eleven', 'sixteen'], ['en-seventeen'], {
          id: 'en.ex.5vuehrmzh2rxkz',
          explanation: 'Del 13 al 19 terminan en -teen, con el acento al final: seven-TEEN.',
        }),
        ex.listenChoice('fourteen', ['four', 'fifteen', 'nineteen'], ['en-fourteen'], {
          id: 'en.ex.0ekoqbhb4wl8ea',
        }),
        ex.fillBlank(
          'nine + nine = ___',
          'nueve + nueve = dieciocho',
          'eighteen',
          ['eight', 'nineteen', 'seventeen'],
          ['en-eighteen', 'en-nine'],
          { id: 'en.ex.tqum23vlrwd49r', skill: 'vocabulary' },
        ),
        ex.fillBlank(
          'ten + six = ___',
          'diez + seis = dieciséis',
          'sixteen',
          ['six', 'seventeen', 'fourteen'],
          ['en-sixteen', 'en-ten', 'en-six'],
          { id: 'en.ex.fg7kv7tnb5y5u2', skill: 'vocabulary' },
        ),
        // PW (cifra → palabra): el mapa evalúa v03 así.
        ex.shortAnswer(
          '13',
          'Escribe el número en letras, en inglés.',
          'thirteen',
          [],
          ['en-thirteen'],
          { id: 'en.ex.l3msnl9xtitww7', explanation: '13 = thirteen (no «threeteen»).' },
        ),
        ex.shortAnswer('0', 'Escribe el número en letras, en inglés.', 'zero', [], ['en-zero'], {
          id: 'en.ex.k3c9w3en4n9fbm',
        }),
        ex.shortAnswer(
          '19',
          'Escribe el número en letras, en inglés.',
          'nineteen',
          [],
          ['en-nineteen'],
          { id: 'en.ex.xhiflh8qyvbun6' },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U4 Familia
const U4: UnitSupplementDef = {
  unit: 4,
  words: [],
  names: ['Ana', 'Tom', 'Lucy', 'Rosa', 'Maria', 'Juan'],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u04-l04',
      mapChange: "M: agregar 's (al final, con consolidate:false)",
      curriculum: { primary: ['g07'], secondary: ['g08'] },
      exercises: [
        ex.fillBlank(
          '___ mother is a teacher.',
          'La madre de Ana es profesora.',
          "Ana's",
          ['Ana', 'Ana is', 'Ana has'],
          ['en-mother', 'en-teacher'],
          {
            id: 'en.ex.r18n91isotrepr',
            explanation:
              "La posesión de una persona se dice con 's: Ana's mother = la madre de Ana.",
          },
        ),
        ex.fillBlank(
          'Tom is ___ brother.',
          'Tom es el hermano de Lucy.',
          "Lucy's",
          ['Lucy', 'Lucy is', 'Lucy has'],
          ['en-brother'],
          {
            id: 'en.ex.plf7inusyqfgcy',
            explanation: "Lucy's brother: el dueño + 's + la persona.",
          },
        ),
        ex.listenChoice(
          "Ana's brother is a student.",
          ['Ana is a student.', "Ana's sister is a student.", "Ana's brother is a teacher."],
          ['en-brother', 'en-student'],
          { id: 'en.ex.f0m33j9yhxljrk' },
        ),
        ex.orderWords(
          "My father's name is Juan.",
          'El nombre de mi papá es Juan.',
          ['en-father', 'en-name', 'en-my'],
          { id: 'en.ex.lbo5ehlkrkgwv3' },
        ),
        // PW (árbol familiar): el mapa evalúa g08 así.
        ex.shortAnswer(
          '👵 Rosa\n⬇️\n👩 Maria\n⬇️\n👧 Ana',
          "Mira el árbol y escribe quién es Rosa para Ana. Usa 's.",
          "Rosa is Ana's grandmother.",
          ["She is Ana's grandmother.", "She's Ana's grandmother."],
          ['en-grandmother'],
          {
            id: 'en.ex.n6yj52uoqh7r8g',
            explanation: "Rosa es la madre de la madre de Ana: Ana's grandmother.",
          },
        ),
        ex.translateWrite('El hermano de Ana', "Ana's brother", ['en-brother'], {
          id: 'en.ex.gpfzntmgs9xyjq',
          explanation: "«De Ana» va antes de la persona, con 's: Ana's brother.",
        }),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U5 Objetos
const U5: UnitSupplementDef = {
  unit: 5,
  words: [
    word('en-the', 'the', 'el / la / los / las', '/ðə/', 'The book is blue.', 'El libro es azul.', [
      'articles',
    ]),
    word('en-men', 'men', 'hombres', '/mɛn/', 'The men are happy.', 'Los hombres están felices.', [
      'plurals',
      'people',
    ]),
    word(
      'en-women',
      'women',
      'mujeres',
      '/ˈwɪmɪn/',
      'Two women are teachers.',
      'Dos mujeres son profesoras.',
      ['plurals', 'people'],
    ),
    word(
      'en-children',
      'children',
      'niños / chicos',
      '/ˈtʃɪldrən/',
      'The children are tired.',
      'Los chicos están cansados.',
      ['plurals', 'people'],
      { acceptedTranslations: ['niños', 'chicos', 'hijos'] },
    ),
    word(
      'en-people',
      'people',
      'personas / gente',
      '/ˈpipəl/',
      'We are four people.',
      'Somos cuatro personas.',
      ['plurals', 'people'],
      { acceptedTranslations: ['personas', 'gente'] },
    ),
  ],
  names: ['Tom', 'Leo', 'Ana', 'Kate'],
  appendices: [
    {
      lesson: 'a1-u05-l02',
      mapChange: 'M: agregar the',
      curriculum: { primary: ['g04'], secondary: [] },
      exercises: [
        ex.translationChoice(
          'the',
          'el / la / los / las',
          ['un / una', 'este / esta', 'esos / esas'],
          ['en-the'],
          { id: 'en.ex.nha1tw1zz2zm9z' },
        ),
        ex.fillBlank(
          'I have a bag and a phone. ___ phone is red.',
          'Tengo un bolso y un teléfono. El teléfono es rojo.',
          'The',
          ['A', 'An', 'These'],
          ['en-the', 'en-phone', 'en-red'],
          {
            id: 'en.ex.oznu1qfmp3ws50',
            explanation:
              'La primera vez se dice a phone; cuando ya sabemos de qué teléfono hablamos, the phone.',
          },
        ),
        ex.orderWords('The book is blue.', 'El libro es azul.', ['en-the', 'en-book', 'en-blue'], {
          id: 'en.ex.9jrwpn7qegi95w',
        }),
        ex.listenChoice(
          'the red bag',
          ['a red bag', 'the red bags', 'the blue bag'],
          ['en-the', 'en-red', 'en-bag'],
          { id: 'en.ex.bf3qhyj3stsxz4' },
        ),
        // PW (imagen → palabra con artículo): el mapa evalúa g04 con FB y PW.
        ex.shortAnswer(
          '📱',
          'Escribe en inglés qué es, con a o an.',
          'a phone',
          ['It is a phone.', "It's a phone."],
          ['en-a', 'en-phone'],
          { id: 'en.ex.a9mywreclbu26a' },
        ),
        ex.shortAnswer(
          '💻',
          'Escribe en inglés qué es, con a o an.',
          'a computer',
          ['It is a computer.', "It's a computer."],
          ['en-a', 'en-computer'],
          { id: 'en.ex.urqwz0pf4e3hgu' },
        ),
      ],
    },
  ],
  lessons: [
    {
      id: 'a1-u05-l06',
      curriculumLesson: 6,
      curriculum: { primary: ['g05'], secondary: ['v05'] },
      title: 'Uno, dos, muchos',
      objective: 'Formar plurales regulares e irregulares frecuentes.',
      intro: {
        explanation:
          'Casi siempre el plural se forma con -s: one book, two books. Algunas palabras muy usadas cambian: man → men, woman → women. Children (niños) y people (personas) ya son plurales.',
        examples: [
          { target: 'one pen, three pens', base: 'un bolígrafo, tres bolígrafos' },
          { target: 'These women are teachers.', base: 'Estas mujeres son profesoras.' },
        ],
      },
      takeaways: ['Formas el plural con -s: books, keys.', 'Usas men, women, children y people.'],
      exercises: [
        ex.fillBlank(
          'one book, two ___',
          'un libro, dos libros',
          'books',
          ['book', 'bookes', 'a book'],
          ['en-book', 'en-two'],
          { id: 'en.ex.pti2wqyhdw15nb', explanation: 'Plural regular: book → books.' },
        ),
        ex.translationChoice(
          'children',
          'niños / chicos',
          ['hombres', 'mujeres', 'personas / gente'],
          ['en-children'],
          { id: 'en.ex.usyfx2ytwfsfuu' },
        ),
        ex.matchPairs(
          [
            ['men', 'hombres'],
            ['women', 'mujeres'],
            ['children', 'niños / chicos'],
            ['people', 'personas / gente'],
          ],
          ['en-men', 'en-women', 'en-children', 'en-people'],
          { id: 'en.ex.2hpr6fvk8fxrpc' },
        ),
        ex.fillBlank(
          'Tom and Leo are ___.',
          'Tom y Leo son hombres.',
          'men',
          ['man', 'mans', 'a man'],
          ['en-men', 'en-man'],
          {
            id: 'en.ex.5o5fmu5qfiyqb0',
            explanation: 'Man es irregular: un hombre = a man; dos = two men.',
          },
        ),
        ex.fillBlank(
          'Ana and Kate are ___.',
          'Ana y Kate son mujeres.',
          'women',
          ['woman', 'womans', 'a woman'],
          ['en-women', 'en-woman'],
          {
            id: 'en.ex.rkl1d84bv9rbjj',
            explanation: 'Woman → women: cambia la vocal y se pronuncia «uímin».',
          },
        ),
        ex.listenChoice(
          'The children are happy.',
          ['The children are tired.', 'The women are happy.', 'The men are happy.'],
          ['en-children', 'en-happy'],
          { id: 'en.ex.vsakbsjs7ew4dd' },
        ),
        ex.orderWords(
          'These women are teachers.',
          'Estas mujeres son profesoras.',
          ['en-these', 'en-women', 'en-teacher'],
          { id: 'en.ex.ey55dsei58cctq' },
        ),
        ex.fillBlank(
          'We are four ___.',
          'Somos cuatro personas.',
          'people',
          ['peoples', 'a people', 'one people'],
          ['en-people', 'en-four', 'en-we'],
          { id: 'en.ex.1d3znk9mwvip77', explanation: 'People ya es plural: no lleva -s.' },
        ),
        // PW (imagen de varios): el mapa evalúa g05 así.
        ex.shortAnswer(
          '🔑 🔑 🔑',
          'Escribe en inglés cuántas hay y qué son.',
          'three keys',
          ['3 keys', 'They are three keys.', "They're three keys."],
          ['en-three', 'en-key'],
          { id: 'en.ex.kekfbiyviolxxn', explanation: 'Plural regular: key → keys.' },
        ),
        ex.translateWrite(
          'Dos mujeres y tres niños',
          'two women and three children',
          ['en-women', 'en-children', 'en-two', 'en-three', 'en-and'],
          {
            id: 'en.ex.rd4z36qk0ox3ex',
            explanation: 'Women y children son plurales irregulares: sin -s.',
          },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U6 Casa
const U6: UnitSupplementDef = {
  unit: 6,
  words: [],
  names: [],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u06-l04',
      mapChange: 'Cobertura de g10: PW (imagen de una habitación)',
      curriculum: { primary: ['g10'], secondary: ['p04'] },
      exercises: [
        ex.shortAnswer(
          '🛏️ 🛏️ 🪑',
          'Mira la habitación y escribe qué hay, con there is o there are.',
          'There are two beds and a chair.',
          [
            'There are two beds and one chair.',
            'There is a chair and two beds.',
            'There is one chair and two beds.',
          ],
          ['en-there-are', 'en-bed', 'en-chair', 'en-two'],
          {
            id: 'en.ex.rq589pppqrgtt4',
            explanation: 'There are + plural (two beds); there is + singular (a chair).',
          },
        ),
      ],
    },
    {
      lesson: 'a1-u06-l05',
      mapChange: 'M: PW sobre una escena',
      curriculum: { primary: ['g11'], secondary: ['p04'] },
      exercises: [
        ex.shortAnswer(
          '📕\n🛏️',
          'Mira la escena y escribe dónde está el libro.',
          'The book is on the bed.',
          ['It is on the bed.', "It's on the bed.", 'On the bed.'],
          ['en-book', 'en-on', 'en-bed'],
          {
            id: 'en.ex.ye6jczst2ebbky',
            explanation: 'Arriba de algo, tocándolo: on. The book is on the bed.',
          },
        ),
        ex.shortAnswer(
          '🪑\n🔑',
          'Mira la escena y escribe dónde está la llave.',
          'The key is under the chair.',
          ['It is under the chair.', "It's under the chair.", 'Under the chair.'],
          ['en-key', 'en-under', 'en-chair'],
          { id: 'en.ex.8r8g3mgpvuggpj', explanation: 'Debajo: under. The key is under the chair.' },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U7 Comida
const U7: UnitSupplementDef = {
  unit: 7,
  words: [],
  names: ['Ana'],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u07-l04',
      mapChange: "M: agregar I'd like y SIT",
      curriculum: { primary: ['g23'], secondary: ['p10'] },
      exercises: [
        ex.translationChoice(
          "I'd like",
          'quisiera',
          ['me gusta', 'tengo', 'odio'],
          ['en-id-like'],
          {
            id: 'en.ex.5ygseezwjnga88',
            explanation: "I'd like = I would like: una forma amable de pedir.",
          },
        ),
        ex.fillBlank(
          '___ a coffee, please.',
          'Quisiera un café, por favor.',
          "I'd like",
          ['I like', 'I am', 'I have'],
          ['en-id-like', 'en-coffee', 'en-please'],
          {
            id: 'en.ex.e4wjrhuok0auvk',
            explanation: "Para pedir: I'd like a coffee. I like coffee = me gusta el café.",
          },
        ),
        ex.fillBlank(
          '___ a tea, please.',
          'Situación: estás en un café y pides un té con cortesía.',
          "I'd like",
          ['I am', 'I like', 'I have'],
          ['en-id-like', 'en-tea'],
          {
            id: 'en.ex.kbek7hd3u7ojm8',
            explanation: "Para pedir con cortesía: I'd like…, please.",
          },
        ),
        ex.listenChoice(
          "I'd like a juice, please.",
          ['I like juice.', "I'd like a tea, please.", "I'd like milk, please."],
          ['en-id-like', 'en-juice'],
          { id: 'en.ex.7oxkid11bzwdso' },
        ),
        // PW (situación): el mapa evalúa p10 así.
        ex.shortAnswer(
          '🍵',
          'Situación: estás en un café. Pide esto en inglés, con cortesía.',
          "I'd like a tea, please.",
          [
            "I'd like tea, please.",
            'I would like a tea, please.',
            'I would like tea, please.',
            'I want a tea, please.',
            'A tea, please.',
          ],
          ['en-id-like', 'en-tea', 'en-please'],
          { id: 'en.ex.tpr5z2phcp8u6k', explanation: "I'd like + lo que quieres + please." },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U8 Rutinas
const U8: UnitSupplementDef = {
  unit: 8,
  words: [],
  names: [],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u08-l02',
      mapChange: 'Cobertura de v08: PW (imagen de una acción)',
      curriculum: { primary: ['v08'], secondary: [] },
      exercises: [
        ex.shortAnswer(
          '😴 🛏️',
          'Escribe en inglés la acción (un verbo).',
          'sleep',
          ['to sleep', 'I sleep.'],
          ['en-sleep'],
          { id: 'en.ex.kk97gb4gvuau33' },
        ),
        ex.shortAnswer(
          '📖 👀',
          'Escribe en inglés la acción (un verbo).',
          'read',
          ['to read', 'I read.'],
          ['en-read'],
          { id: 'en.ex.1nniilta5zo6rh' },
        ),
      ],
    },
    {
      lesson: 'a1-u08-l04',
      mapChange: 'M: agregar TR',
      curriculum: { primary: ['g13'], secondary: [] },
      exercises: [
        ex.shortAnswer(
          'I drink coffee.',
          'Escribe la oración en negativa.',
          "I don't drink coffee.",
          ['I do not drink coffee.'],
          ['en-dont', 'en-drink', 'en-coffee'],
          {
            id: 'en.ex.qyx01x7gtimwg7',
            explanation: "Negativa: don't + verbo. I don't drink coffee.",
          },
        ),
        ex.shortAnswer(
          'She works at home.',
          'Escribe la oración en negativa.',
          "She doesn't work at home.",
          ['She does not work at home.'],
          ['en-doesnt', 'en-work', 'en-home'],
          {
            id: 'en.ex.uotqiaj0dmoddf',
            explanation: "Con he/she: doesn't + verbo sin -s. She doesn't work.",
          },
        ),
        ex.shortAnswer(
          'You live in Spain.',
          'Escribe la oración como pregunta.',
          'Do you live in Spain?',
          [],
          ['en-do', 'en-live', 'en-spain'],
          { id: 'en.ex.ivcnvn4eetwry7', explanation: 'Pregunta: Do + you + verbo. Do you live…?' },
        ),
        ex.shortAnswer(
          'He reads every day.',
          'Escribe la oración como pregunta.',
          'Does he read every day?',
          [],
          ['en-does', 'en-read', 'en-every-day'],
          {
            id: 'en.ex.4958cogv2woack',
            explanation: 'Con he/she: Does + verbo sin -s. Does he read…? (no «Does he reads»).',
          },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U9 Horarios
const U9: UnitSupplementDef = {
  unit: 9,
  words: [
    month('en-january', 'January', 'enero', '/ˈdʒænjuˌɛri/', 'I work in January.'),
    month('en-february', 'February', 'febrero', '/ˈfɛbruˌɛri/', 'We study in February.'),
    month('en-march', 'March', 'marzo', '/mɑrtʃ/', 'I go to Spain in March.'),
    month('en-april', 'April', 'abril', '/ˈeɪprəl/', 'My birthday is in April.'),
    month('en-may', 'May', 'mayo', '/meɪ/', 'We study in May.'),
    month('en-june', 'June', 'junio', '/dʒun/', 'I study in June.'),
    month('en-july', 'July', 'julio', '/dʒʊˈlaɪ/', 'They go to Spain in July.'),
    month('en-august', 'August', 'agosto', '/ˈɔɡəst/', 'We go to England in August.'),
    month('en-september', 'September', 'septiembre', '/sɛpˈtɛmbər/', 'I study in September.'),
    month('en-october', 'October', 'octubre', '/ɑkˈtoʊbər/', 'Her birthday is in October.'),
    month('en-november', 'November', 'noviembre', '/noʊˈvɛmbər/', 'I work in November.'),
    month('en-december', 'December', 'diciembre', '/dɪˈsɛmbər/', 'We go home in December.'),
    word('en-first', 'first', 'primero / primera', '/fɜrst/', 'May first', 'el primero de mayo', [
      'ordinals',
    ]),
    word('en-second', 'second', 'segundo / segunda', '/ˈsɛkənd/', 'June second', 'el 2 de junio', [
      'ordinals',
    ]),
    word('en-third', 'third', 'tercero / tercera', '/θɜrd/', 'March third', 'el 3 de marzo', [
      'ordinals',
    ]),
    word('en-fourth', 'fourth', 'cuarto / cuarta', '/fɔrθ/', 'July fourth', 'el 4 de julio', [
      'ordinals',
    ]),
    word('en-fifth', 'fifth', 'quinto / quinta', '/fɪfθ/', 'April fifth', 'el 5 de abril', [
      'ordinals',
    ]),
  ],
  names: ['Ana', 'Tom'],
  appendices: [
    {
      lesson: 'a1-u09-l03',
      mapChange: 'M: agregar in the morning y on Monday',
      curriculum: { primary: ['v09', 'g15'], secondary: [] },
      exercises: [
        ex.fillBlank(
          'We go to school ___ Monday.',
          'Vamos a la escuela el lunes.',
          'on',
          ['in', 'at', 'to'],
          ['en-monday', 'en-go', 'en-school'],
          { id: 'en.ex.mg0dc0mxki5bsx', explanation: 'Días: on. On Monday, on Friday.' },
        ),
        ex.fillBlank(
          'She works ___ the afternoon.',
          'Ella trabaja a la tarde.',
          'in',
          ['on', 'at', 'to'],
          ['en-afternoon', 'en-work'],
          {
            id: 'en.ex.ekdgx1hsxbptfe',
            explanation: 'Partes del día: in the morning, in the afternoon.',
          },
        ),
        ex.fillBlank(
          "School is ___ eight o'clock.",
          'La escuela es a las ocho.',
          'at',
          ['on', 'in', 'to'],
          ['en-at', 'en-school', 'en-oclock'],
          { id: 'en.ex.zg6lngbt7gt44y', explanation: "La hora: at. At eight o'clock." },
        ),
        ex.listenChoice(
          'See you on Friday in the evening.',
          [
            'See you on Friday in the morning.',
            'See you on Sunday in the evening.',
            'See you on Friday at eight.',
          ],
          ['en-friday', 'en-evening'],
          { id: 'en.ex.8asl0h87vl360n' },
        ),
        ex.orderWords(
          'I study on Monday and Wednesday.',
          'Estudio los lunes y los miércoles.',
          ['en-study', 'en-monday', 'en-wednesday'],
          { id: 'en.ex.cv3eb5k0o8m8np' },
        ),
        // PW (calendario → texto)
        ex.shortAnswer(
          '📅 Saturday · 🌅',
          'Escribe cuándo es: el día y la parte del día, con on e in.',
          'on Saturday in the morning',
          ['On Saturday morning', 'In the morning on Saturday'],
          ['en-saturday', 'en-morning'],
          {
            id: 'en.ex.0mgmdsfm7qck35',
            explanation: 'On + día; in + parte del día: on Saturday in the morning.',
          },
        ),
      ],
    },
    {
      lesson: 'a1-u09-l04',
      mapChange:
        'M: agregar LD (sin tipo de dictado: se cubre con PW reloj → texto; ver el documento)',
      curriculum: { primary: ['v09'], secondary: ['cL03'] },
      exercises: [
        ex.shortAnswer(
          '🕒',
          'Escribe la hora en inglés.',
          "It is three o'clock.",
          ["It's three o'clock.", "three o'clock", 'It is three.', "It's three."],
          ['en-oclock', 'en-three'],
          { id: 'en.ex.9zennp03b86gtm' },
        ),
        ex.shortAnswer(
          '🕥',
          'Escribe la hora en inglés.',
          'It is half past ten.',
          ["It's half past ten.", 'half past ten'],
          ['en-half-past', 'en-ten'],
          { id: 'en.ex.vryhpoaieot93n', explanation: '10:30 = half past ten.' },
        ),
      ],
    },
  ],
  lessons: [
    {
      id: 'a1-u09-l06',
      curriculumLesson: 6,
      curriculum: { primary: ['v09'], secondary: ['p01'] },
      title: 'Meses y fechas',
      objective: 'Decir los meses y las fechas, y preguntar cuándo es algo.',
      intro: {
        explanation:
          'Los meses se escriben con mayúscula. Con el mes solo se usa in (in May); con la fecha, on (on May third). En la fecha se dice el número ordinal: first, second, third, fourth, fifth… (del 4 en adelante, casi siempre -th).',
        examples: [
          { target: 'My birthday is in May.', base: 'Mi cumpleaños es en mayo.' },
          { target: 'It is on May third.', base: 'Es el 3 de mayo.' },
        ],
      },
      takeaways: [
        'Dices los doce meses.',
        'Usas in con el mes y on con la fecha.',
        'Dices una fecha con first, second, third…',
      ],
      exercises: [
        ex.matchPairs(
          [
            ['January', 'enero'],
            ['February', 'febrero'],
            ['March', 'marzo'],
            ['April', 'abril'],
          ],
          ['en-january', 'en-february', 'en-march', 'en-april'],
          { id: 'en.ex.4mezu2tbc6helo' },
        ),
        ex.matchPairs(
          [
            ['May', 'mayo'],
            ['June', 'junio'],
            ['July', 'julio'],
            ['August', 'agosto'],
          ],
          ['en-may', 'en-june', 'en-july', 'en-august'],
          { id: 'en.ex.dcvwofo4nohzwi' },
        ),
        ex.matchPairs(
          [
            ['September', 'septiembre'],
            ['October', 'octubre'],
            ['November', 'noviembre'],
            ['December', 'diciembre'],
          ],
          ['en-september', 'en-october', 'en-november', 'en-december'],
          { id: 'en.ex.5o4qd9xkr7p4pk' },
        ),
        ex.translationChoice('month', 'mes', ['semana', 'año', 'día'], ['en-month'], {
          id: 'en.ex.99buq72ou03ane',
        }),
        ex.matchPairs(
          [
            ['first', 'primero / primera'],
            ['second', 'segundo / segunda'],
            ['third', 'tercero / tercera'],
            ['fifth', 'quinto / quinta'],
          ],
          ['en-first', 'en-second', 'en-third', 'en-fifth'],
          { id: 'en.ex.7meuk4w5pj9lvm' },
        ),
        ex.fillBlank(
          'My birthday is ___ May.',
          'Mi cumpleaños es en mayo.',
          'in',
          ['on', 'at', 'to'],
          ['en-birthday', 'en-may'],
          { id: 'en.ex.7r7dnlp7hrsy4u', explanation: 'Con el mes solo: in. In May.' },
        ),
        ex.fillBlank(
          'Her birthday is ___ April second.',
          'Su cumpleaños es el 2 de abril.',
          'on',
          ['in', 'at', 'to'],
          ['en-birthday', 'en-april', 'en-second'],
          {
            id: 'en.ex.fkap2z7qf3sbu6',
            explanation: 'Con la fecha (mes + día): on. On April second.',
          },
        ),
        ex.listenChoice(
          'My birthday is on October third.',
          [
            'My birthday is on October first.',
            'My birthday is in November.',
            'My birthday is on December third.',
          ],
          ['en-birthday', 'en-october', 'en-third'],
          { id: 'en.ex.sgb14j5m4cmjj8' },
        ),
        // PW (calendario → texto)
        ex.shortAnswer(
          '📅 February 4 · 🎂 Ana',
          'Mira el calendario y escribe cuándo es el cumpleaños de Ana.',
          'It is on February fourth.',
          [
            "It's on February fourth.",
            'On February fourth.',
            'February fourth.',
            'It is on February 4.',
            "It's on February 4.",
            'On February 4.',
            'It is on the fourth of February.',
            "It's on the fourth of February.",
            'On the fourth of February.',
            'Her birthday is on February fourth.',
            "Ana's birthday is on February fourth.",
          ],
          ['en-february', 'en-fourth', 'en-birthday'],
          {
            id: 'en.ex.gs7h02g8py44r5',
            explanation: 'Fecha con on y el ordinal: on February fourth.',
          },
        ),
        ex.translateWrite(
          'Mi cumpleaños es en julio.',
          'My birthday is in July.',
          ['en-birthday', 'en-july'],
          { id: 'en.ex.7zo1y0gruju7fm', acceptedAnswers: ["My birthday's in July."] },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U10 Ciudad
const U10: UnitSupplementDef = {
  unit: 10,
  words: [],
  names: [],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u10-l02',
      mapChange: 'Cobertura de v10: PW (imagen → palabra)',
      curriculum: { primary: ['v10'], secondary: [] },
      exercises: [
        ex.shortAnswer(
          '🏦',
          NARROW,
          'a bank',
          ['bank', 'It is a bank.', "It's a bank."],
          ['en-bank'],
          { id: 'en.ex.nd15wks0znkaj3' },
        ),
        ex.shortAnswer(
          '🏥',
          NARROW,
          'a hospital',
          ['hospital', 'It is a hospital.', "It's a hospital."],
          ['en-hospital'],
          { id: 'en.ex.la53pi2d76r9jz' },
        ),
      ],
    },
    {
      lesson: 'a1-u10-l05',
      mapChange: 'Cobertura de g19: PW (dar una indicación sobre un mapa)',
      curriculum: { primary: ['g19'], secondary: ['v10'] },
      exercises: [
        ex.shortAnswer(
          '🧍 ⬆️ ⬆️ ➡️ 🏦',
          'Mira las flechas y escribe cómo llegar al banco: primero una indicación y después otra.',
          'Go straight on and turn right.',
          [
            'Go straight on, then turn right.',
            'Go straight on and then turn right.',
            'Straight on and turn right.',
            'Go straight and turn right.',
          ],
          ['en-straight-on', 'en-turn', 'en-right'],
          { id: 'en.ex.h5s2ozxvl3tvxz', explanation: 'Imperativo: Go straight on… turn right.' },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U11 Gustos
const U11: UnitSupplementDef = {
  unit: 11,
  words: [
    word('en-me', 'me', 'me / a mí', '/mi/', 'Can you help me?', '¿Me puedes ayudar?', [
      'pronouns',
    ]),
    word(
      'en-them',
      'them',
      'los / las (a ellos, a ellas)',
      '/ðɛm/',
      'I love them.',
      'Me encantan. / Los quiero.',
      ['pronouns'],
    ),
  ],
  names: [],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u11-l02',
      mapChange: 'M: agregar I like it/them (g21)',
      curriculum: { primary: ['g18'], secondary: ['g21'] },
      exercises: [
        ex.fillBlank(
          'Football is fun. I love ___.',
          'El fútbol es divertido. Me encanta.',
          'it',
          ['them', 'me', 'they'],
          ['en-it', 'en-love', 'en-football'],
          { id: 'en.ex.zbbg22rikx0w5c', explanation: 'Una cosa: it. I love it = me encanta.' },
        ),
        ex.fillBlank(
          'I love apples. I eat ___ every day.',
          'Me encantan las manzanas. Las como todos los días.',
          'them',
          ['it', 'they', 'me'],
          ['en-them', 'en-apple'],
          { id: 'en.ex.6gpjf8o4q0ajmp', explanation: 'Varias cosas: them. I eat them = las como.' },
        ),
        ex.fillBlank(
          'Can you help ___, please?',
          '¿Me puedes ayudar, por favor?',
          'me',
          ['my', 'I', 'them'],
          ['en-me', 'en-help', 'en-can'],
          { id: 'en.ex.t4hm7526yo8lt1', explanation: 'Después del verbo: me (no I). Help me.' },
        ),
        ex.listenChoice(
          'I hate it.',
          ['I hate them.', 'I love it.', 'I like it.'],
          ['en-hate', 'en-it'],
          { id: 'en.ex.wfskxpy2kfiz43' },
        ),
        ex.orderWords(
          'I like them very much.',
          'Me gustan mucho.',
          ['en-like', 'en-them', 'en-very-much'],
          { id: 'en.ex.41cw9v45yzhail' },
        ),
        ex.shortAnswer(
          'Do you like movies? (Sí, me encantan.)',
          '¿Te gustan las películas?',
          'Yes, I love them.',
          ['Yes, I love them!', 'I love them.'],
          ['en-love', 'en-them', 'en-movie'],
          { id: 'en.ex.csghjlicofre2b', explanation: 'Movies es plural: I love them.' },
        ),
      ],
    },
    {
      lesson: 'a1-u11-l03',
      mapChange: 'Cobertura de v11: PW (imagen → palabra)',
      curriculum: { primary: ['v11'], secondary: [] },
      exercises: [
        ex.shortAnswer(
          '🏊',
          'Escribe en inglés la actividad (un verbo).',
          'swim',
          ['to swim', 'swimming'],
          ['en-swim'],
          { id: 'en.ex.jfzbjixkrgddxe' },
        ),
        ex.shortAnswer(
          '🎤 🎶',
          'Escribe en inglés la actividad (un verbo).',
          'sing',
          ['to sing', 'singing'],
          ['en-sing'],
          { id: 'en.ex.2kr4ehgzjsgqq2' },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U12 Preguntas
const NOTE = {
  kind: 'reading',
  id: 'en.stim.a1-u12-back-at-five',
  document: 'message',
  setting: 'Una nota en la puerta del refrigerador.',
  from: 'Ana',
  to: 'Tom',
  lines: ['Tom,', 'I am at the supermarket.', 'Back at five.', 'Ana'],
} as const satisfies ContextStimulus;

const POSTCARD = {
  kind: 'reading',
  id: 'en.stim.a1-u12-postcard',
  document: 'postcard',
  setting: 'Ana le manda una postal a Tom desde un viaje.',
  title: 'Hi from London!',
  from: 'Ana',
  to: 'Tom',
  lines: [
    'Hi Tom!',
    'I am in London. The city is very big and the people are nice.',
    'I go to a museum every day.',
    'See you on Sunday!',
    'Love, Ana',
  ],
} as const satisfies ContextStimulus;

const U12: UnitSupplementDef = {
  unit: 12,
  words: [
    word(
      'en-postcard',
      'postcard',
      'postal',
      '/ˈpoʊstˌkɑrd/',
      'I have a postcard from Ana.',
      'Tengo una postal de Ana.',
      ['messages'],
      { emoji: '🏞️' },
    ),
    word(
      'en-see-you',
      'see you',
      'nos vemos',
      '/ˈsi ju/',
      'See you on Monday!',
      '¡Nos vemos el lunes!',
      ['messages', 'greetings'],
    ),
    word(
      'en-back-at',
      'back at',
      'vuelvo a las / de vuelta a las',
      '/bæk æt/',
      'Back at five.',
      'Vuelvo a las cinco.',
      ['messages'],
      { acceptedTranslations: ['vuelvo a las', 'de vuelta a las'] },
    ),
  ],
  names: ['Ana', 'Tom', 'Ben', 'London'],
  appendices: [
    {
      lesson: 'a1-u12-l03',
      mapChange: 'M: SIT en un chat',
      curriculum: { primary: ['v12'], secondary: ['p11'] },
      exercises: [
        ex.fillBlank(
          'You: ___',
          'Situación (chat): Ben te escribe una palabra que no conoces. ¿Qué le respondes?',
          'What does it mean?',
          ['How are you?', 'Nice to meet you.', "You're welcome."],
          ['en-what', 'en-mean'],
          { id: 'en.ex.tujis0364epnw9', skill: 'vocabulary' },
        ),
        ex.fillBlank(
          'You: ___',
          'Situación (chat): Ben te manda un mensaje largo y no entiendes nada.',
          "Sorry, I don't understand.",
          ['Thank you!', 'Good night!', 'I am fine.'],
          ['en-sorry', 'en-understand'],
          { id: 'en.ex.r9xq9yt1pnas6p', skill: 'vocabulary' },
        ),
        ex.fillBlank(
          'You: ___',
          'Situación: en clase, la profesora habla muy rápido.',
          'Can you speak slowly, please?',
          ['Can you speak English?', 'Where are you from?', 'What time is it?'],
          ['en-speak', 'en-slowly', 'en-please'],
          { id: 'en.ex.7i3djfwimxx8gr', skill: 'vocabulary' },
        ),
      ],
    },
  ],
  lessons: [
    {
      id: 'a1-u12-l06',
      curriculumLesson: 6,
      curriculum: { primary: ['p09'], secondary: ['cR02'] },
      title: 'Mensajes y postales',
      objective: 'Leer y escribir mensajes muy breves, notas y postales.',
      intro: {
        explanation:
          'Un mensaje o una nota va al grano: dónde estás y cuándo vuelves («Back at five»). Una postal saluda, cuenta algo y se despide («See you on Sunday! Love, Ana»).',
        examples: [
          {
            target: 'I am at the bank. Back at four.',
            base: 'Estoy en el banco. Vuelvo a las cuatro.',
          },
          { target: 'See you on Sunday!', base: '¡Nos vemos el domingo!' },
        ],
      },
      takeaways: [
        'Entiendes notas, mensajes y postales breves.',
        'Escribes una nota del tipo «Back at five».',
      ],
      exercises: [
        ex.translationChoice('postcard', 'postal', ['carta', 'foto', 'libro'], ['en-postcard'], {
          id: 'en.ex.1ixut5t4tsq6b5',
        }),
        ex.translationChoice(
          'see you',
          'nos vemos',
          ['de vuelta', 'gracias', 'perdón'],
          ['en-see-you'],
          { id: 'en.ex.zwxd1tpus1msqf' },
        ),
        contextQuestion(
          'en.ex.3s2y8vhaovshgb',
          NOTE,
          '¿Cuándo vuelve Ana?',
          'A las cinco',
          ['A las cuatro', 'Mañana', 'El sábado'],
          ['en-back-at', 'en-five', 'en-at'],
          'La nota dice «Back at five»: vuelve a las cinco.',
        ),
        contextQuestion(
          'en.ex.5p299mr9nz6jnr',
          NOTE,
          '¿Dónde está Ana ahora?',
          'En el supermercado',
          ['En el banco', 'En casa', 'En la escuela'],
          ['en-supermarket', 'en-at'],
          'La nota dice «I am at the supermarket».',
        ),
        contextQuestion(
          'en.ex.dpxqe3k7xylrgy',
          POSTCARD,
          '¿Qué hace Ana todos los días?',
          'Va a un museo',
          ['Va al parque', 'Trabaja', 'Estudia inglés'],
          ['en-museum', 'en-every-day', 'en-go'],
          'La postal dice «I go to a museum every day».',
        ),
        contextQuestion(
          'en.ex.cc14aq2rji32hr',
          POSTCARD,
          '¿Cuándo se van a ver Ana y Tom?',
          'El domingo',
          ['El sábado', 'Mañana', 'Hoy'],
          ['en-see-you', 'en-sunday'],
          'La postal termina con «See you on Sunday!».',
        ),
        ex.listenChoice(
          'Ben here. Back at seven.',
          ['Ben here. Back at eleven.', 'Ben here. Bye at seven.', 'Tom here. Back at seven.'],
          ['en-back-at', 'en-seven'],
          { id: 'en.ex.pujzpevdum9w42' },
        ),
        ex.fillBlank(
          '___ you on Monday!',
          '¡Nos vemos el lunes!',
          'See',
          ['Go', 'Have', 'Do'],
          ['en-see-you', 'en-monday'],
          { id: 'en.ex.c7d46q4dbo3c35' },
        ),
        // GW guiada con datos dados (p09): nota del tipo «back at 5».
        ex.shortAnswer(
          '📝 🛒 Supermarket · 🕔 5:00',
          'Escribe una nota breve para tu familia: dónde estás y a qué hora vuelves.',
          'I am at the supermarket. Back at five.',
          [
            "I'm at the supermarket. Back at five.",
            'At the supermarket. Back at five.',
            'Supermarket. Back at five.',
            'I am at the supermarket. Back at 5.',
            "I'm at the supermarket. Back at 5.",
            'At the supermarket. Back at 5.',
            'Supermarket. Back at 5.',
          ],
          ['en-supermarket', 'en-back-at', 'en-five'],
          {
            id: 'en.ex.tl3nqgwbrkjgyz',
            explanation:
              'Una nota breve: dónde estás (at the supermarket) y cuándo vuelves (back at five).',
          },
        ),
        ex.translateWrite(
          '¡Nos vemos el sábado!',
          'See you on Saturday!',
          ['en-see-you', 'en-saturday'],
          { id: 'en.ex.0s11r58hds3vyq', acceptedAnswers: ['See you Saturday!'] },
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------- U14 Precios (planificada, fase C.3)
const U14: UnitSupplementDef = {
  unit: 14,
  words: [],
  names: [],
  lessons: [],
  appendices: [
    {
      lesson: 'a1-u14-l01',
      mapChange: 'Cobertura de v03: PW (cifra → palabra) hasta 100',
      curriculum: { primary: ['v03'], secondary: [] },
      exercises: [
        ex.shortAnswer(
          '45',
          'Escribe el número en letras, en inglés.',
          'forty-five',
          ['forty five'],
          ['en-forty', 'en-five'],
          {
            id: 'en.ex.3ruibv4mqqdqe4',
            explanation: 'Forty se escribe sin u (no «fourty»): forty-five.',
          },
        ),
        ex.shortAnswer(
          '99',
          'Escribe el número en letras, en inglés.',
          'ninety-nine',
          ['ninety nine'],
          ['en-ninety', 'en-nine'],
          { id: 'en.ex.3sq1c7bh7av6w6' },
        ),
      ],
    },
  ],
};

export const EN_A1_SUPPLEMENTS: readonly UnitSupplementDef[] = [
  U1,
  U2,
  U3,
  U4,
  U5,
  U6,
  U7,
  U8,
  U9,
  U10,
  U11,
  U12,
  U14,
];

import type { ContextStimulus } from '../../../shared/exercises';
import { ex } from '../../builders';
import type { MapFormat } from '../../curriculum-map';
import type { ExerciseDef } from '../../types';

/**
 * Bancos de práctica de inglés A1 por bloque (CP1–CP4) y de repaso general (formas A y B), sacados de
 * los puntos de control y la evaluación final del mapa curricular (§4). En PolyGo son MATERIAL DE
 * PRÁCTICA OPCIONAL: no son exámenes, no certifican nada, no se aprueban ni desbloquean contenido, y no
 * están conectados al flujo ni cargados en la base (docs/A1_EN_CLOSURE.md §7). Se pueden ofrecer más
 * adelante como repasos opcionales con las rutas de repaso existentes.
 *
 * Se conservan validados (content/assessment-checks.ts): ítems distintos de los de las lecciones,
 * vocabulario A1 enseñado, sin ambigüedad y con la corrección del servidor. Cada ítem declara el
 * objetivo del mapa que practica, como referencia interna.
 *
 * ESTADO EDITORIAL: borrador.
 */

export type AssessmentSection = 'vocabulary' | 'grammar' | 'comprehension' | 'production';

export interface AssessmentItemDef {
  /** Estable y única en todos los bancos: `<forma>-<código>[-n]`. */
  key: string;
  code: string;
  format: MapFormat;
  exercise: ExerciseDef;
}

export interface AssessmentFormDef {
  id: string;
  kind: 'checkpoint' | 'final';
  /** CP: bloque del mapa. */
  block?: number;
  /** Final: forma paralela. */
  form?: 'A' | 'B';
  title: string;
  /** Última unidad (orden de la ruta v2) cuyo vocabulario puede usar. */
  upToUnit: number;
  items: AssessmentItemDef[];
  /** Tareas de escritura (FW y GW con datos propios) que completan la sección Production. */
  writing: string[];
}

const SOFIA = { persona: 'en.persona.sofia-ruiz' } as const;

const pw = (
  question: string,
  task: string,
  answer: string,
  accepted: string[],
  words: string[],
  extra: Partial<ExerciseDef> = {},
) => ex.shortAnswer(question, task, answer, accepted, words, extra);

const fb = (
  sentence: string,
  translation: string,
  answer: string,
  distractors: string[],
  words: string[],
) => ex.fillBlank(sentence, translation, answer, distractors, words);

const sit = (
  situation: string,
  sentence: string,
  answer: string,
  distractors: string[],
  words: string[],
) =>
  ex.fillBlank(sentence, `Situación: ${situation}`, answer, distractors, words, {
    skill: 'vocabulary',
  });

const read = (
  id: string,
  document: Extract<ContextStimulus, { kind: 'reading' }>['document'],
  setting: string,
  lines: string[],
  extra: { title?: string; from?: string; to?: string } = {},
): ContextStimulus => ({ kind: 'reading', id, document, setting, lines, ...extra });

const hear = (
  id: string,
  setting: string,
  lines: [string, string][],
  voices: Record<string, 'a' | 'b'>,
): ContextStimulus => ({
  kind: 'listening',
  id,
  setting,
  speakers: Object.entries(voices).map(([name, voice]) => ({ name, voice })),
  rate: 0.85,
  lines: lines.map(([speaker, text]) => ({ speaker, text })),
});

const q = (
  stimulus: ContextStimulus,
  question: string,
  answer: string,
  distractors: string[],
  concepts: string[],
  explanation: string,
): ExerciseDef => ({
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

const item = (key: string, code: string, format: MapFormat, exercise: ExerciseDef) => ({
  key,
  code,
  format,
  exercise,
});

const NUM = 'Escribe el número en letras, en inglés.';
const NEG = 'Escribe la oración en negativa.';
const ASK = 'Escribe la oración como pregunta.';

// =========================================================================== CP1 (U1–U3, U13, U4)
const CP1_CARD = read(
  'en.stim.a1-cp1-club-card',
  'form',
  'La ficha de un chico en un club de fútbol.',
  ['First name: Leo', 'Surname: Gomez', 'Age: 14', 'Country: Argentina', 'Number: 9'],
);
const CP1_MSG = read(
  'en.stim.a1-cp1-hello-message',
  'message',
  'Kate le escribe a una compañera nueva.',
  ['Hi Mia!', 'I am Kate. I am fifteen and I am from England.', 'Are you from Spain?'],
  { from: 'Kate', to: 'Mia' },
);
const CP1_DESC = read(
  'en.stim.a1-cp1-my-family',
  'description',
  'Tom describe una foto de su familia.',
  ['My mother is Rosa. She is happy.', 'I have one brother. His name is Max. He is ten.'],
  { from: 'Tom' },
);
const CP1_TALK = hear(
  'en.stim.a1-cp1-new-student',
  'Dos chicos se conocen en la escuela.',
  [
    ['Sam', 'Hi! I am Sam. And you?'],
    ['Lily', 'Hello, Sam. My name is Lily. Nice to meet you.'],
    ['Sam', 'Nice to meet you, Lily. Where are you from?'],
    ['Lily', 'I am from Mexico.'],
  ],
  { Sam: 'a', Lily: 'b' },
);
const CP1_TO_YOU = hear(
  'en.stim.a1-cp1-receptionist',
  'En la recepción de un hotel, el recepcionista te habla a ti.',
  [['Paul', 'Good evening! Your surname, please? And how do you spell it?']],
  { Paul: 'a' },
);
const CP1_NUMBER = hear(
  'en.stim.a1-cp1-room-number',
  'El recepcionista te dice el número de tu habitación.',
  [['Paul', 'Good evening. Your number is seventeen.']],
  { Paul: 'a' },
);
const CP1_WORD = hear(
  'en.stim.a1-cp1-thank-you',
  'Una chica te da tu bolígrafo.',
  [['Lily', 'Thank you!']],
  { Lily: 'a' },
);

export const CP1: AssessmentFormDef = {
  id: 'en.a1.cp1',
  kind: 'checkpoint',
  block: 1,
  title: 'Punto de control 1: Yo y las personas',
  upToUnit: 4,
  writing: ['en.a1.wt.block1-introduce', 'en.a1.wt.how-are-you', 'en.a1.wt.my-age'],
  items: [
    item(
      'cp1-v01',
      'v01',
      'SIT',
      sit(
        'una amiga te ayuda con la tarea.',
        '___, Ana!',
        'Thank you',
        ['Sorry', 'Hello', 'Good night'],
        ['en-thank-you'],
      ),
    ),
    item(
      'cp1-v02',
      'v02',
      'FF',
      pw(
        '📝 Form\nSofia Ruiz · Puebla, Mexico\nNationality: ?',
        'Completa el campo del formulario con el dato de Sofia.',
        'Mexican',
        [],
        ['en-mexican', 'en-nationality'],
        { personalData: SOFIA },
      ),
    ),
    item('cp1-v03', 'v03', 'PW', pw('16', NUM, 'sixteen', [], ['en-sixteen'])),
    item(
      'cp1-v04',
      'v04',
      'PW',
      pw(
        '👨 + 👩 = 👪\n👨 = ?',
        'Escribe en inglés quién es el hombre en esta familia (una palabra).',
        'father',
        ['the father', 'dad'],
        ['en-father'],
      ),
    ),
    item(
      'cp1-g01',
      'g01',
      'FB',
      fb(
        'Tom and I are friends. ___ are happy.',
        'Tom y yo somos amigos. Estamos felices.',
        'We',
        ['They', 'You', 'I'],
        ['en-we'],
      ),
    ),
    item(
      'cp1-g02',
      'g02',
      'FB',
      fb(
        'My sister ___ a student.',
        'Mi hermana es estudiante.',
        'is',
        ['am', 'are', 'be'],
        ['en-is', 'en-sister'],
      ),
    ),
    item(
      'cp1-g03',
      'g03',
      'TR',
      pw('He is from England.', ASK, 'Is he from England?', [], ['en-is', 'en-from']),
    ),
    item(
      'cp1-g07',
      'g07',
      'FB',
      fb(
        'Kate and Tom are teachers. ___ students are happy.',
        'Kate y Tom son profesores. Sus alumnos están felices.',
        'Their',
        ['His', 'Her', 'Our'],
        ['en-their'],
      ),
    ),
    item(
      'cp1-g08',
      'g08',
      'PW',
      pw(
        '👴 Juan\n⬇️\n👨 Max\n⬇️\n👦 Leo',
        "Mira el árbol y escribe quién es Juan para Leo. Usa 's.",
        "Juan is Leo's grandfather.",
        ["He is Leo's grandfather.", "He's Leo's grandfather."],
        ['en-grandfather'],
      ),
    ),
    item(
      'cp1-g09',
      'g09',
      'FB',
      fb(
        'My father ___ two brothers.',
        'Mi papá tiene dos hermanos.',
        'has',
        ['have', 'is', 'are'],
        ['en-has', 'en-brother'],
      ),
    ),
    item(
      'cp1-g16',
      'g16',
      'GW',
      pw(
        '"I am twelve."',
        'Escribe la pregunta que corresponde a esta respuesta.',
        'How old are you?',
        [],
        ['en-how-old'],
      ),
    ),
    item(
      'cp1-cl01',
      'cL01',
      'LM',
      q(
        CP1_WORD,
        '¿Qué significa lo que dice Lily?',
        'Gracias',
        ['Perdón', 'De nada', 'Hola'],
        ['en-thank-you'],
        'Lily dice «Thank you!»: agradece.',
      ),
    ),
    item(
      'cp1-cl02',
      'cL02',
      'LQ',
      q(
        CP1_TO_YOU,
        '¿Qué te pide Paul después de preguntarte el apellido?',
        'Que lo deletrees',
        ['Que digas tu edad', 'Que des tu teléfono', 'Que digas de dónde eres'],
        ['en-surname', 'en-how-do-you-spell-it'],
        '«How do you spell it?» pide deletrear el apellido.',
      ),
    ),
    item(
      'cp1-cl03',
      'cL03',
      'LQ',
      q(
        CP1_NUMBER,
        '¿Cuál es el número de tu habitación?',
        '17',
        ['7', '70', '16'],
        ['en-seventeen', 'en-number'],
        'Paul dice «number seventeen»: 17.',
      ),
    ),
    item(
      'cp1-cl05',
      'cL05',
      'LQ',
      q(
        CP1_TALK,
        '¿De dónde es Lily?',
        'De México',
        ['De España', 'De Inglaterra', 'De Argentina'],
        ['en-mexico', 'en-from'],
        'Lily responde «I am from Mexico».',
      ),
    ),
    item(
      'cp1-cl05-2',
      'cL05',
      'LQ',
      q(
        CP1_TALK,
        '¿Quién dice su nombre primero?',
        'Sam',
        ['Lily', 'Los dos a la vez', 'Nadie'],
        ['en-name'],
        'Sam empieza: «Hi! I am Sam».',
      ),
    ),
    item(
      'cp1-cr01',
      'cR01',
      'RQ',
      q(
        CP1_CARD,
        '¿Cuántos años tiene Leo?',
        '14',
        ['9', '4', '40'],
        ['en-age', 'en-fourteen'],
        'La ficha dice «Age: 14»; el 9 es su número de camiseta.',
      ),
    ),
    item(
      'cp1-cr02',
      'cR02',
      'RQ',
      q(
        CP1_MSG,
        '¿Qué quiere saber Kate?',
        'Si Mia es de España',
        ['Cuántos años tiene Mia', 'El nombre de Mia', 'Si Mia es profesora'],
        ['en-spain', 'en-from'],
        'Kate pregunta «Are you from Spain?».',
      ),
    ),
    item(
      'cp1-cr03',
      'cR03',
      'RQ',
      q(
        CP1_DESC,
        '¿Quién es Max?',
        'El hermano de Tom',
        ['El padre de Tom', 'Un amigo de Tom', 'El profesor de Tom'],
        ['en-brother', 'en-his'],
        '«I have one brother. His name is Max.»',
      ),
    ),
    item(
      'cp1-p01',
      'p01',
      'FF',
      pw(
        '📝 Form\nSofia Ruiz · 29 · Puebla, Mexico\nFirst name: ?',
        'Completa el campo del formulario con el dato de Sofia.',
        'Sofia',
        [],
        ['en-first-name'],
        { personalData: SOFIA },
      ),
    ),
    item(
      'cp1-p03',
      'p03',
      'PW',
      pw(
        '👩‍🏫 Rosa · 😊',
        'Escribe dos datos de Rosa: qué es y cómo está (usa she).',
        'She is a teacher and she is happy.',
        [
          'She is a teacher. She is happy.',
          "She's a teacher and she's happy.",
          "She's a teacher. She's happy.",
          'Rosa is a teacher and she is happy.',
          'Rosa is a teacher. She is happy.',
        ],
        ['en-teacher', 'en-happy'],
      ),
    ),
  ],
};

// =========================================================================== CP2 (U5–U7, U14)
const CP2_AD = read('en.stim.a1-cp2-flat-ad', 'ad', 'Un aviso de un apartamento en alquiler.', [
  'Small apartment',
  'Two bedrooms, a kitchen and a bathroom.',
  'There is a sofa in the living room.',
  'There is no garden.',
]);
const CP2_MENU = read('en.stim.a1-cp2-cafe-menu', 'menu', 'El menú de un café.', [
  'Coffee $3',
  'Tea $2',
  'Juice $4',
  'Cheese and bread $6',
  'Apple $1',
]);
const CP2_LINE = read(
  'en.stim.a1-cp2-whose-bag',
  'message',
  'Un mensaje en el chat de la clase.',
  ['That black bag is my bag.'],
  { from: 'Leo' },
);
const CP2_SHOP = hear(
  'en.stim.a1-cp2-at-the-shop',
  'Un cliente compra en una tienda.',
  [
    ['Nina', 'Hello!'],
    ['Jack', "Hi! I'd like a bottle of water, please."],
    ['Nina', 'Here you are. It is two dollars.'],
    ['Jack', 'Thank you!'],
  ],
  { Nina: 'b', Jack: 'a' },
);
const CP2_WHERE = hear(
  'en.stim.a1-cp2-where-are-the-keys',
  'Una amiga te dice dónde están tus llaves.',
  [['Kim', 'Your keys are on the table, next to the computer.']],
  { Kim: 'a' },
);
const CP2_PRICE = hear(
  'en.stim.a1-cp2-supermarket',
  'Un anuncio por los parlantes de un supermercado.',
  [['Voice', 'A kilo of apples is forty cents!']],
  { Voice: 'a' },
);
const CP2_WORD = hear(
  'en.stim.a1-cp2-cup',
  'Tu amigo te pide algo en la cocina.',
  [['Tom', 'A cup, please.']],
  { Tom: 'a' },
);

export const CP2: AssessmentFormDef = {
  id: 'en.a1.cp2',
  kind: 'checkpoint',
  block: 2,
  title: 'Punto de control 2: Mis cosas, mi casa, mi comida',
  upToUnit: 14,
  writing: ['en.a1.wt.block2-room-and-order'],
  items: [
    item(
      'cp2-v03',
      'v03',
      'PW',
      pw('72', NUM, 'seventy-two', ['seventy two'], ['en-seventy', 'en-two']),
    ),
    item(
      'cp2-v05',
      'v05',
      'PW',
      pw(
        '🔑',
        'Escribe en inglés qué es (una palabra).',
        'key',
        ['a key', 'It is a key.', "It's a key."],
        ['en-key'],
      ),
    ),
    item(
      'cp2-v06',
      'v06',
      'PW',
      pw(
        '🛋️',
        'Escribe en inglés qué es (una palabra).',
        'sofa',
        ['a sofa', 'It is a sofa.', "It's a sofa."],
        ['en-sofa'],
      ),
    ),
    item(
      'cp2-v07',
      'v07',
      'PW',
      pw(
        '🧀',
        'Escribe en inglés qué es (una palabra).',
        'cheese',
        ['It is cheese.', "It's cheese."],
        ['en-cheese'],
      ),
    ),
    item(
      'cp2-g04',
      'g04',
      'FB',
      fb(
        'I want ___ egg, please.',
        'Quiero un huevo, por favor.',
        'an',
        ['a', 'the', 'these'],
        ['en-an', 'en-egg'],
      ),
    ),
    item(
      'cp2-g05',
      'g05',
      'PW',
      pw(
        '👶 👶 👶',
        'Escribe en inglés cuántos son y qué son (plural).',
        'three children',
        ['3 children', 'They are three children.'],
        ['en-children', 'en-three'],
      ),
    ),
    item(
      'cp2-g06',
      'g06',
      'FB',
      fb(
        '___ are my keys, there.',
        'Esas son mis llaves, allá.',
        'Those',
        ['This', 'That', 'It'],
        ['en-those', 'en-key'],
      ),
    ),
    item(
      'cp2-g10',
      'g10',
      'TR',
      pw(
        'There is a chair in the kitchen.',
        ASK,
        'Is there a chair in the kitchen?',
        [],
        ['en-there-is', 'en-chair', 'en-kitchen'],
      ),
    ),
    item(
      'cp2-g11',
      'g11',
      'PW',
      pw(
        '🛏️\n👜',
        'Mira la escena y escribe dónde está el bolso.',
        'The bag is under the bed.',
        ['It is under the bed.', "It's under the bed.", 'Under the bed.'],
        ['en-bag', 'en-under', 'en-bed'],
      ),
    ),
    item(
      'cp2-g20',
      'g20',
      'PW',
      pw(
        '📕 (red, big)',
        'Escribe en inglés: «a» + los dos adjetivos + el objeto.',
        'a big red book',
        [],
        ['en-big', 'en-red', 'en-book'],
      ),
    ),
    item(
      'cp2-g23',
      'g23',
      'SIT',
      sit(
        'en un café pides un jugo con cortesía.',
        '___ a juice, please.',
        "I'd like",
        ['I like', 'I have', 'I am'],
        ['en-id-like', 'en-juice'],
      ),
    ),
    item(
      'cp2-cl01',
      'cL01',
      'LM',
      q(
        CP2_WORD,
        '¿Qué te pide Tom?',
        'Una taza',
        ['Un vaso de agua', 'Un bolígrafo', 'Una llave'],
        ['en-cup'],
        'Tom dice «A cup, please».',
      ),
    ),
    item(
      'cp2-cl03',
      'cL03',
      'LQ',
      q(
        CP2_PRICE,
        '¿Cuánto cuesta hoy un kilo de manzanas?',
        '40 centavos',
        ['14 centavos', '4 dólares', '40 dólares'],
        ['en-forty', 'en-cent', 'en-a-kilo-of'],
        '«A kilo of apples is forty cents».',
      ),
    ),
    item(
      'cp2-cl04',
      'cL04',
      'LQ',
      q(
        CP2_WHERE,
        '¿Dónde están tus llaves?',
        'Sobre la mesa, al lado de la computadora',
        ['Debajo de la mesa', 'En la computadora', 'Al lado de la puerta'],
        ['en-key', 'en-on', 'en-next-to'],
        '«on the table, next to the computer».',
      ),
    ),
    item(
      'cp2-cl05',
      'cL05',
      'LQ',
      q(
        CP2_SHOP,
        '¿Cuánto paga Jack?',
        'Dos dólares',
        ['Doce dólares', 'Veinte dólares', 'Tres dólares'],
        ['en-dollar', 'en-two'],
        'Nina dice «It is two dollars».',
      ),
    ),
    item(
      'cp2-cr01',
      'cR01',
      'RQ',
      q(
        CP2_MENU,
        '¿Qué es lo más barato del menú?',
        'La manzana',
        ['El té', 'El café', 'El jugo'],
        ['en-apple', 'en-tea', 'en-coffee'],
        'Apple $1 es el precio más bajo.',
      ),
    ),
    item(
      'cp2-cr03',
      'cR03',
      'RQ',
      q(
        CP2_AD,
        '¿Qué NO tiene el apartamento?',
        'Jardín',
        ['Sofá', 'Cocina', 'Baño'],
        ['en-garden', 'en-there-is'],
        '«There is no garden».',
      ),
    ),
    item(
      'cp2-cr05',
      'cR05',
      'RQ',
      q(
        CP2_LINE,
        '¿Qué dice Leo?',
        'Que el bolso negro es suyo',
        ['Que tiene un bolso nuevo', 'Que busca un bolso negro', 'Que el bolso es de su amigo'],
        ['en-black', 'en-bag', 'en-my'],
        '«That black bag is my bag» = ese bolso negro es mío.',
      ),
    ),
    item(
      'cp2-p04',
      'p04',
      'PW',
      pw(
        '🛏️ 🪑 🪑',
        'Escribe qué hay en la habitación, con there is o there are.',
        'There is a bed and two chairs.',
        [
          'There is one bed and two chairs.',
          'There are two chairs and a bed.',
          'There are two chairs and one bed.',
        ],
        ['en-there-is', 'en-bed', 'en-chair'],
      ),
    ),
    item(
      'cp2-p10',
      'p10',
      'PW',
      pw(
        '🥛 🍎',
        'Situación: en un café. Pide leche y una manzana, con cortesía.',
        "I'd like milk and an apple, please.",
        [
          "I'd like a milk and an apple, please.",
          'I would like milk and an apple, please.',
          'Milk and an apple, please.',
        ],
        ['en-id-like', 'en-milk', 'en-apple'],
      ),
    ),
  ],
};

// =========================================================================== CP3 (U8–U9)
const CP3_SCHEDULE = read(
  'en.stim.a1-cp3-pool-hours',
  'schedule',
  'El horario de una escuela de idiomas.',
  ['School: Monday to Friday, 8 to 12', 'Saturday and Sunday: no school'],
);
const CP3_MSG = read(
  'en.stim.a1-cp3-plan-message',
  'message',
  'Un amigo te propone un plan.',
  [
    'Hi! I play every Saturday in the morning.',
    'Do you want to play this Saturday?',
    'We play at ten.',
  ],
  { from: 'Dan' },
);
const CP3_VOICE = hear(
  'en.stim.a1-cp3-voice-message',
  'Un mensaje de voz de tu amiga Emma.',
  [
    [
      'Emma',
      "Hi, it's Emma. I don't work on Friday. I study at home in the morning and I go to school in the evening. Bye!",
    ],
  ],
  { Emma: 'a' },
);
const CP3_TIME = hear(
  'en.stim.a1-cp3-train-time',
  'Un anuncio en la escuela.',
  [['Voice', 'Today, school is at half past eight.']],
  { Voice: 'a' },
);

export const CP3: AssessmentFormDef = {
  id: 'en.a1.cp3',
  kind: 'checkpoint',
  block: 3,
  title: 'Punto de control 3: Mi día y mi semana',
  upToUnit: 9,
  writing: ['en.a1.wt.block3-week-and-note', 'en.a1.wt.my-routine'],
  items: [
    item(
      'cp3-v08',
      'v08',
      'PW',
      pw(
        '🏃 ⚽',
        'Escribe en inglés la acción (un verbo).',
        'play',
        ['to play', 'play football', 'I play football.'],
        ['en-play'],
      ),
    ),
    item(
      'cp3-v09',
      'v09',
      'PW',
      pw(
        '🕗',
        'Escribe la hora en inglés.',
        "It is eight o'clock.",
        ["It's eight o'clock.", "eight o'clock", 'It is eight.', "It's eight."],
        ['en-oclock', 'en-eight'],
      ),
    ),
    item(
      'cp3-g12',
      'g12',
      'FB',
      fb(
        'My father ___ in a school.',
        'Mi papá trabaja en una escuela.',
        'works',
        ['work', 'working', 'is work'],
        ['en-work', 'en-father'],
      ),
    ),
    item(
      'cp3-g13',
      'g13',
      'TR',
      pw(
        'They live in England.',
        NEG,
        "They don't live in England.",
        ['They do not live in England.'],
        ['en-dont', 'en-live'],
      ),
    ),
    item(
      'cp3-g14',
      'g14',
      'PW',
      pw(
        'I / get up / at seven ✔✔✔ (siempre)',
        'Escribe la oración con el adverbio de frecuencia en su lugar.',
        'I always get up at seven.',
        [],
        ['en-always', 'en-get-up'],
      ),
    ),
    item(
      'cp3-g15',
      'g15',
      'FB',
      fb(
        "We have lunch ___ one o'clock.",
        'Almorzamos a la una.',
        'at',
        ['on', 'in', 'to'],
        ['en-at', 'en-lunch'],
      ),
    ),
    item(
      'cp3-cl03',
      'cL03',
      'LQ',
      q(
        CP3_TIME,
        '¿A qué hora es hoy la escuela?',
        'A las 8:30',
        ['A las 8:00', 'A las 9:30', 'A las 2:30'],
        ['en-half-past', 'en-eight'],
        '«half past eight» = 8:30.',
      ),
    ),
    item(
      'cp3-cl06',
      'cL06',
      'LQ',
      q(
        CP3_VOICE,
        '¿Qué hace Emma el viernes a la noche?',
        'Va a la escuela',
        ['Estudia en casa', 'Trabaja', 'Duerme'],
        ['en-school', 'en-evening'],
        '«I go to school in the evening»; en casa estudia a la mañana.',
      ),
    ),
    item(
      'cp3-cl06-2',
      'cL06',
      'LQ',
      q(
        CP3_VOICE,
        '¿Emma trabaja el viernes?',
        'No, no trabaja',
        ['Sí, a la mañana', 'Sí, a la noche', 'Sí, todo el día'],
        ['en-dont', 'en-work', 'en-friday'],
        "«I don't work on Friday».",
      ),
    ),
    item(
      'cp3-cr01',
      'cR01',
      'RQ',
      q(
        CP3_SCHEDULE,
        '¿Qué días no hay clases?',
        'Sábado y domingo',
        ['Lunes y martes', 'Viernes y sábado', 'Sólo el domingo'],
        ['en-saturday', 'en-sunday', 'en-school'],
        '«Saturday and Sunday: no school».',
      ),
    ),
    item(
      'cp3-cr02',
      'cR02',
      'RQ',
      q(
        CP3_MSG,
        '¿A qué hora es el partido del sábado?',
        'A las diez',
        ['A las dos', 'A las doce', 'A las siete'],
        ['en-ten', 'en-at', 'en-saturday'],
        '«We play at ten».',
      ),
    ),
  ],
};

// =========================================================================== CP4 (U10–U12)
const CP4_DIRECTIONS = read(
  'en.stim.a1-cp4-to-the-library',
  'directions',
  'Indicaciones para ir de la estación a la biblioteca.',
  [
    'From the station, go straight on.',
    'Turn left at the bank.',
    'The library is next to the park.',
  ],
  { title: 'To the library' },
);
const CP4_POST = read(
  'en.stim.a1-cp4-weekend-post',
  'post',
  'Una publicación de Rose para sus amigos.',
  [
    'I love music and I can sing.',
    'This Sunday I sing at the city park at five.',
    'Do you want to go?',
  ],
  { from: 'Rose' },
);
const CP4_TEACHER = hear(
  'en.stim.a1-cp4-teacher',
  'La profesora te habla a ti en clase.',
  [['Ms. Park', 'Please read the question again, slowly.']],
  { 'Ms. Park': 'a' },
);
const CP4_STREET = hear(
  'en.stim.a1-cp4-in-the-street',
  'Alguien te explica cómo llegar al cine.',
  [['Joe', 'The cinema? Go straight on and turn right. It is near the hotel.']],
  { Joe: 'a' },
);
const CP4_TALK = hear(
  'en.stim.a1-cp4-weekend-plans',
  'Dos amigos hablan de lo que les gusta.',
  [
    ['Dan', 'Do you like football, Ann?'],
    ['Ann', "No, I don't. I love music."],
    ['Dan', 'Me too! I can sing very well.'],
  ],
  { Dan: 'a', Ann: 'b' },
);

export const CP4: AssessmentFormDef = {
  id: 'en.a1.cp4',
  kind: 'checkpoint',
  block: 4,
  title: 'Punto de control 4: Por la ciudad y con los demás',
  upToUnit: 12,
  writing: ['en.a1.wt.block4-post-and-postcard', 'en.a1.wt.my-likes', 'en.a1.wt.ask-and-answer'],
  items: [
    item(
      'cp4-v10',
      'v10',
      'PW',
      pw(
        '🚌',
        'Escribe en inglés qué es (una palabra).',
        'bus',
        ['a bus', 'It is a bus.', "It's a bus."],
        ['en-bus'],
      ),
    ),
    item(
      'cp4-v11',
      'v11',
      'PW',
      pw(
        '💃 🎶',
        'Escribe en inglés la actividad (un verbo).',
        'dance',
        ['to dance', 'dancing'],
        ['en-dance'],
      ),
    ),
    item(
      'cp4-v12',
      'v12',
      'SIT',
      sit(
        'no entendiste lo que dijo la profesora.',
        '___, please.',
        'Repeat that',
        ['Nice to meet you', 'See you', 'Good morning'],
        ['en-repeat'],
      ),
    ),
    item(
      'cp4-g16',
      'g16',
      'GW',
      pw(
        'Answer: "The bank is near the park."',
        'Escribe la pregunta que corresponde a esta respuesta.',
        'Where is the bank?',
        [],
        ['en-where', 'en-bank'],
      ),
    ),
    item(
      'cp4-g17',
      'g17',
      'TR',
      pw(
        'She can swim.',
        NEG,
        "She can't swim.",
        ['She cannot swim.', 'She can not swim.'],
        ['en-can', 'en-swim'],
      ),
    ),
    item(
      'cp4-g18',
      'g18',
      'GW',
      pw(
        'Do you like music? (Sí, me encanta.)',
        'Responde con love y un pronombre.',
        'Yes, I love it.',
        ['I love it.', 'Yes, I love music.'],
        ['en-love', 'en-music'],
      ),
    ),
    item(
      'cp4-g19',
      'g19',
      'PW',
      pw(
        '🧍 ⬅️ 🏥',
        'Mira la flecha y escribe la indicación para llegar al hospital.',
        'Turn left.',
        ['Turn left to the hospital.', 'Go left.'],
        ['en-turn', 'en-left'],
      ),
    ),
    item(
      'cp4-g21',
      'g21',
      'FB',
      fb(
        'These are my friends. I like ___ very much.',
        'Estos son mis amigos. Me caen muy bien.',
        'them',
        ['they', 'it', 'me'],
        ['en-them'],
      ),
    ),
    item(
      'cp4-g22',
      'g22',
      'GW',
      pw(
        "I like tea. I don't like coffee.",
        'Une las dos oraciones en una sola con but.',
        "I like tea, but I don't like coffee.",
        ['I like tea but I do not like coffee.'],
        ['en-but'],
      ),
    ),
    item(
      'cp4-cl02',
      'cL02',
      'LQ',
      q(
        CP4_TEACHER,
        '¿Qué te pide la profesora?',
        'Que leas la pregunta otra vez, despacio',
        ['Que respondas la pregunta', 'Que hables más rápido', 'Que leas un libro nuevo'],
        ['en-read', 'en-question', 'en-again'],
        '«Please read the question again, slowly».',
      ),
    ),
    item(
      'cp4-cl04',
      'cL04',
      'LQ',
      q(
        CP4_STREET,
        '¿Dónde está el cine?',
        'Cerca del hotel',
        ['Al lado del banco', 'Lejos del hotel', 'A la izquierda'],
        ['en-near', 'en-hotel', 'en-cinema'],
        '«It is near the hotel».',
      ),
    ),
    item(
      'cp4-cl05',
      'cL05',
      'LQ',
      q(
        CP4_TALK,
        '¿Qué le encanta a Ann?',
        'La música',
        ['El fútbol', 'Nadar', 'Bailar'],
        ['en-love', 'en-music'],
        '«I love music».',
      ),
    ),
    item(
      'cp4-cr02',
      'cR02',
      'RQ',
      q(
        CP4_POST,
        '¿Qué propone Rose?',
        'Ir a escucharla cantar el domingo en el parque',
        ['Ir a nadar el domingo', 'Cantar juntos en su casa', 'Ir al cine el sábado'],
        ['en-sing', 'en-sunday', 'en-park'],
        '«This Sunday I sing at the city park… Do you want to come?»',
      ),
    ),
    item(
      'cp4-cr06',
      'cR06',
      'RQ',
      q(
        CP4_DIRECTIONS,
        '¿Dónde hay que doblar a la izquierda?',
        'En el banco',
        ['En el parque', 'En la estación', 'En la biblioteca'],
        ['en-left', 'en-bank', 'en-turn'],
        '«Turn left at the bank».',
      ),
    ),
    item(
      'cp4-p07',
      'p07',
      'GW',
      pw(
        '👦 Tom · 📞 ?',
        'Escribe la pregunta para saber el número de teléfono de Tom.',
        'What is your phone number?',
        ["What's your phone number?", "What is Tom's phone number?", "What's Tom's phone number?"],
        ['en-what', 'en-phone-number'],
      ),
    ),
    item(
      'cp4-p11',
      'p11',
      'SIT',
      sit(
        'en un chat Ben usa una palabra que no conoces.',
        'You: ___',
        'What does it mean?',
        ['How old are you?', 'Where is it?', 'I am fine, thank you.'],
        ['en-mean'],
      ),
    ),
  ],
};

// =========================================================================== Evaluación final (formas A y B)
const FA_SIGN = read(
  'en.stim.a1-fa-museum-sign',
  'notice',
  'Un cartel en la puerta de un museo.',
  ['Tuesday to Sunday: 10 to 6', 'Monday: 🚫'],
  { title: 'City Museum' },
);
const FA_MSG = read(
  'en.stim.a1-fa-cinema-plan',
  'message',
  'Una amiga te propone un plan.',
  [
    'Hi! Do you want to go to the cinema on Friday?',
    'The movie is at eight.',
    'See you at the station at half past seven!',
  ],
  { from: 'Lucy' },
);
const FA_DESC = read(
  'en.stim.a1-fa-my-house',
  'description',
  'Ben describe su casa.',
  [
    'My house is small. It has two bedrooms.',
    'The kitchen is next to the living room.',
    'There is a big garden. There is a table in the garden.',
  ],
  { from: 'Ben' },
);
const FA_LINE = read(
  'en.stim.a1-fa-one-line',
  'message',
  'Un mensaje breve.',
  ['These keys are not my keys.'],
  { from: 'Kim' },
);
const FA_DIR = read(
  'en.stim.a1-fa-to-the-bank',
  'directions',
  'Indicaciones para ir del hotel al banco.',
  [
    'From the hotel, turn right.',
    'Go straight on to the park.',
    'The bank is on the left, next to the cinema.',
  ],
  { title: 'To the bank' },
);
const FA_SHOP = hear(
  'en.stim.a1-fa-bakery',
  'Una clienta compra en una panadería.',
  [
    ['Max', 'Good morning! Can I help you?'],
    ['Emma', "Yes, I'd like two kilos of bread, please."],
    ['Max', 'Anything else?'],
    ['Emma', "No, that's all. How much is it?"],
    ['Max', 'Six dollars, please.'],
  ],
  { Max: 'a', Emma: 'b' },
);
const FA_TEACHER = hear(
  'en.stim.a1-fa-teacher',
  'El profesor te habla a ti.',
  [['Mr. Lee', 'Hello! Where are you from? And how old are you?']],
  { 'Mr. Lee': 'a' },
);
const FA_TIME = hear(
  'en.stim.a1-fa-shop-closes',
  'Un anuncio en una tienda.',
  [['Voice', 'Today, coffee is three dollars and tea is two dollars.']],
  { Voice: 'a' },
);
const FA_DIRS = hear(
  'en.stim.a1-fa-where-is-the-bank',
  'Alguien te dice dónde está el banco.',
  [['Ann', 'The bank? Turn left. It is next to the supermarket.']],
  { Ann: 'a' },
);
const FA_VOICE = hear(
  'en.stim.a1-fa-voice-message',
  'Un mensaje de voz de tu amigo Tom.',
  [['Tom', "Hi, it's Tom. I usually work on Saturday, but this Saturday I don't. See you!"]],
  { Tom: 'a' },
);
const FA_WORD = hear('en.stim.a1-fa-sorry', 'Alguien te pisa sin querer.', [['Max', 'Sorry!']], {
  Max: 'a',
});

const FB_SIGN = read(
  'en.stim.a1-fb-pool-sign',
  'notice',
  'Un cartel en la puerta de una piscina.',
  ['Monday to Saturday: 8 to 8', 'Children: two dollars'],
  {},
);
const FB_MSG = read(
  'en.stim.a1-fb-park-plan',
  'message',
  'Un amigo te propone un plan.',
  [
    'Hi! Do you want to play football on Sunday?',
    'We play at four in the park.',
    'See you at the bus station at half past three!',
  ],
  { from: 'Dan' },
);
const FB_DESC = read(
  'en.stim.a1-fb-my-apartment',
  'description',
  'Ana describe su apartamento.',
  [
    'My apartment is big. It has three bedrooms.',
    'The bathroom is next to the kitchen.',
    'There is a small sofa in the living room.',
  ],
  { from: 'Ana' },
);
const FB_LINE = read(
  'en.stim.a1-fb-one-line',
  'message',
  'Un mensaje breve.',
  ['That red phone is not my phone.'],
  { from: 'Leo' },
);
const FB_DIR = read(
  'en.stim.a1-fb-to-the-museum',
  'directions',
  'Indicaciones para ir de la estación al museo.',
  [
    'From the station, turn left.',
    'Go straight on to the bank.',
    'The museum is on the right, next to the library.',
  ],
  { title: 'To the museum' },
);
const FB_SHOP = hear(
  'en.stim.a1-fb-fruit-shop',
  'Un cliente compra en una frutería.',
  [
    ['Nina', 'Hello! Can I help you?'],
    ['Paul', "Yes, I'd like a kilo of apples, please."],
    ['Nina', 'Anything else?'],
    ['Paul', "No, that's all. How much is it?"],
    ['Nina', 'Four dollars, please.'],
  ],
  { Nina: 'b', Paul: 'a' },
);
const FB_TEACHER = hear(
  'en.stim.a1-fb-teacher',
  'La profesora te habla a ti.',
  [['Ms. Park', 'Good morning! What is your name? And how do you spell it?']],
  { 'Ms. Park': 'a' },
);
const FB_TIME = hear(
  'en.stim.a1-fb-bank-closes',
  'Un anuncio en un banco.',
  [['Voice', 'Today, tea is two dollars and coffee is four dollars.']],
  { Voice: 'a' },
);
const FB_DIRS = hear(
  'en.stim.a1-fb-where-is-the-park',
  'Alguien te dice dónde está el parque.',
  [['Joe', 'The park? Turn right. It is next to the hospital.']],
  { Joe: 'a' },
);
const FB_VOICE = hear(
  'en.stim.a1-fb-voice-message',
  'Un mensaje de voz de tu amiga Kate.',
  [['Kate', "Hi, it's Kate. I never work on Monday, but this Monday I do. I am at the bank. Bye!"]],
  { Kate: 'a' },
);
const FB_WORD = hear(
  'en.stim.a1-fb-excuse-me',
  'Alguien quiere pasar en el autobús.',
  [['Kim', 'Excuse me!']],
  { Kim: 'a' },
);

const FINAL_WRITING = [
  'en.a1.wt.block1-introduce',
  'en.a1.wt.block3-week-and-note',
  'en.a1.wt.block4-post-and-postcard',
  'en.a1.wt.how-are-you',
  'en.a1.wt.my-routine',
];

export const FINAL_A: AssessmentFormDef = {
  id: 'en.a1.final.a',
  kind: 'final',
  form: 'A',
  title: 'Evaluación final A1 · forma A',
  upToUnit: 12,
  writing: FINAL_WRITING,
  items: [
    // Vocabulary
    item(
      'fa-v01',
      'v01',
      'SIT',
      sit(
        'te vas a dormir y saludas a tu familia.',
        '___, Tom!',
        'Good night',
        ['Good morning', 'Hello', 'Thank you'],
        ['en-good-night'],
      ),
    ),
    item(
      'fa-v02',
      'v02',
      'FF',
      pw(
        '📝 Form\nSofia Ruiz · 29 · Puebla, Mexico\nSurname: ?',
        'Completa el campo del formulario con el dato de Sofia.',
        'Ruiz',
        [],
        ['en-surname'],
        { personalData: SOFIA },
      ),
    ),
    item(
      'fa-v03',
      'v03',
      'PW',
      pw('58', NUM, 'fifty-eight', ['fifty eight'], ['en-fifty', 'en-eight']),
    ),
    item(
      'fa-v04',
      'v04',
      'PW',
      pw(
        '👵',
        'Escribe en inglés quién es en una familia (una palabra).',
        'grandmother',
        ['a grandmother', 'the grandmother', 'grandma'],
        ['en-grandmother'],
      ),
    ),
    item(
      'fa-v05',
      'v05',
      'PW',
      pw(
        '📱',
        'Escribe en inglés qué es (una palabra).',
        'phone',
        ['a phone', 'It is a phone.', "It's a phone."],
        ['en-phone'],
      ),
    ),
    item(
      'fa-v06',
      'v06',
      'PW',
      pw(
        '🚪',
        'Escribe en inglés qué es (una palabra).',
        'door',
        ['a door', 'It is a door.', "It's a door."],
        ['en-door'],
      ),
    ),
    item(
      'fa-v07',
      'v07',
      'PW',
      pw(
        '🍌',
        'Escribe en inglés qué es (una palabra).',
        'banana',
        ['a banana', 'It is a banana.', "It's a banana."],
        ['en-banana'],
      ),
    ),
    item(
      'fa-v08',
      'v08',
      'PW',
      pw(
        '👨‍🍳 🍳',
        'Escribe en inglés la acción (un verbo).',
        'cook',
        ['to cook', 'cooking'],
        ['en-cook'],
      ),
    ),
    item(
      'fa-v09',
      'v09',
      'PW',
      pw(
        '📅 March 3',
        'Escribe la fecha en inglés con el ordinal.',
        'March third',
        ['March 3rd', 'the third of March', 'on March third'],
        ['en-march', 'en-third'],
      ),
    ),
    item(
      'fa-v10',
      'v10',
      'PW',
      pw(
        '🏨',
        'Escribe en inglés qué es (una palabra).',
        'hotel',
        ['a hotel', 'It is a hotel.', "It's a hotel."],
        ['en-hotel'],
      ),
    ),
    item(
      'fa-v11',
      'v11',
      'PW',
      pw(
        '⚽',
        'Escribe en inglés qué deporte es.',
        'football',
        ['It is football.', "It's football.", 'soccer'],
        ['en-football'],
      ),
    ),
    item(
      'fa-v12',
      'v12',
      'SIT',
      sit(
        'alguien te habla muy rápido.',
        '___, please.',
        'Slowly',
        ['Hello', 'Again', 'Goodbye'],
        ['en-slowly'],
      ),
    ),
    item(
      'fa-v14',
      'v14',
      'PW',
      pw(
        '😴',
        'Escribe cómo está esta persona (I am…).',
        'I am tired.',
        ["I'm tired.", 'tired'],
        ['en-tired'],
      ),
    ),
    item(
      'fa-v15',
      'v15',
      'PW',
      pw(
        '🧑‍⚕️',
        'Escribe en inglés qué es (una profesión).',
        'doctor',
        ['a doctor', 'He is a doctor.', 'She is a doctor.'],
        ['en-doctor'],
      ),
    ),
    // Grammar
    item(
      'fa-g01',
      'g01',
      'FB',
      fb(
        'Ana is my friend. ___ is from Spain.',
        'Ana es mi amiga. Ella es de España.',
        'She',
        ['He', 'It', 'They'],
        ['en-she'],
      ),
    ),
    item(
      'fa-g02',
      'g02',
      'TR',
      pw(
        'I am not a teacher.',
        'Escribe la oración en afirmativa.',
        'I am a teacher.',
        ["I'm a teacher."],
        ['en-am', 'en-teacher'],
      ),
    ),
    item(
      'fa-g03',
      'g03',
      'TR',
      pw('They are happy.', ASK, 'Are they happy?', [], ['en-are', 'en-happy']),
    ),
    item(
      'fa-g04',
      'g04',
      'FB',
      fb(
        'I have a computer. ___ computer is black.',
        'Tengo una computadora. La computadora es negra.',
        'The',
        ['A', 'An', 'These'],
        ['en-the', 'en-computer'],
      ),
    ),
    item(
      'fa-g05',
      'g05',
      'PW',
      pw(
        '👩 👩',
        'Escribe en inglés cuántas son y qué son (plural).',
        'two women',
        ['2 women', 'They are two women.'],
        ['en-women', 'en-two'],
      ),
    ),
    item(
      'fa-g06',
      'g06',
      'FB',
      fb(
        '___ is my bag, here.',
        'Este es mi bolso, aquí.',
        'This',
        ['These', 'Those', 'They'],
        ['en-this'],
      ),
    ),
    item(
      'fa-g07',
      'g07',
      'FB',
      fb(
        'We have a house. ___ house is big.',
        'Tenemos una casa. Nuestra casa es grande.',
        'Our',
        ['Their', 'His', 'Your'],
        ['en-our'],
      ),
    ),
    item(
      'fa-g08',
      'g08',
      'PW',
      pw(
        '👩 Rosa ➜ 📕',
        "Escribe de quién es el libro. Usa 's.",
        "It is Rosa's book.",
        ["It's Rosa's book.", "Rosa's book", "The book is Rosa's."],
        ['en-book'],
      ),
    ),
    item(
      'fa-g09',
      'g09',
      'TR',
      pw(
        'He has a sister.',
        NEG,
        "He doesn't have a sister.",
        ['He does not have a sister.', 'He has no sister.'],
        ['en-has', 'en-sister'],
      ),
    ),
    item(
      'fa-g10',
      'g10',
      'TR',
      pw(
        'There are two chairs in the room.',
        ASK,
        'Are there two chairs in the room?',
        [],
        ['en-there-are', 'en-chair', 'en-room'],
      ),
    ),
    item(
      'fa-g11',
      'g11',
      'PW',
      pw(
        '🛏️\n📱',
        'Mira la escena y escribe dónde está el teléfono.',
        'The phone is under the bed.',
        ['It is under the bed.', "It's under the bed.", 'Under the bed.'],
        ['en-phone', 'en-under', 'en-bed'],
      ),
    ),
    item(
      'fa-g12',
      'g12',
      'FB',
      fb(
        'She ___ English every day.',
        'Ella estudia inglés todos los días.',
        'studies',
        ['study', 'studys', 'is study'],
        ['en-study'],
      ),
    ),
    item(
      'fa-g13',
      'g13',
      'TR',
      pw('He plays football.', ASK, 'Does he play football?', [], ['en-does', 'en-play']),
    ),
    item(
      'fa-g14',
      'g14',
      'PW',
      pw(
        'She / is / tired ❌❌❌ (nunca)',
        'Escribe la oración con el adverbio de frecuencia en su lugar.',
        'She is never tired.',
        ["She's never tired."],
        ['en-never', 'en-tired'],
      ),
    ),
    item(
      'fa-g15',
      'g15',
      'FB',
      fb(
        'My birthday is ___ June.',
        'Mi cumpleaños es en junio.',
        'in',
        ['on', 'at', 'to'],
        ['en-june', 'en-birthday'],
      ),
    ),
    item(
      'fa-g16',
      'g16',
      'GW',
      pw(
        'Answer: "I live in London."',
        'Escribe la pregunta que corresponde a esta respuesta.',
        'Where do you live?',
        [],
        ['en-where', 'en-live'],
      ),
    ),
    item(
      'fa-g17',
      'g17',
      'TR',
      pw('You can sing.', ASK, 'Can you sing?', [], ['en-can', 'en-sing']),
    ),
    item(
      'fa-g18',
      'g18',
      'GW',
      pw(
        'Do you like movies? (No, las odio.)',
        'Responde con hate y un pronombre.',
        'No, I hate them.',
        ['I hate them.', 'No, I hate movies.'],
        ['en-hate', 'en-them'],
      ),
    ),
    item(
      'fa-g19',
      'g19',
      'PW',
      pw(
        '🧍 ⬆️ 🏦',
        'Mira la flecha y escribe la indicación para llegar al banco.',
        'Go straight on.',
        ['Go straight.', 'Straight on.'],
        ['en-straight-on'],
      ),
    ),
    item(
      'fa-g20',
      'g20',
      'PW',
      pw(
        '📱 (black, small)',
        'Escribe en inglés: «a» + los dos adjetivos + el objeto.',
        'a small black phone',
        [],
        ['en-small', 'en-black', 'en-phone'],
      ),
    ),
    item(
      'fa-g21',
      'g21',
      'FB',
      fb(
        "I can't do it. Can you help ___?",
        'No puedo hacerlo. ¿Me ayudas?',
        'me',
        ['my', 'I', 'they'],
        ['en-me', 'en-help'],
      ),
    ),
    item(
      'fa-g22',
      'g22',
      'GW',
      pw(
        'I study English. I like it.',
        'Une las dos oraciones con because.',
        'I study English because I like it.',
        [],
        ['en-because'],
      ),
    ),
    item(
      'fa-g23',
      'g23',
      'SIT',
      sit(
        'en un café pides agua con cortesía.',
        '___ a glass of water, please.',
        "I'd like",
        ['I like', 'I have', 'I am'],
        ['en-id-like', 'en-a-glass-of'],
      ),
    ),
    // Comprehension
    item(
      'fa-cl01',
      'cL01',
      'LM',
      q(
        FA_WORD,
        '¿Qué te dice Max?',
        'Perdón',
        ['Gracias', 'Por favor', 'De nada'],
        ['en-sorry'],
        '«Sorry!» es una disculpa.',
      ),
    ),
    item(
      'fa-cl02',
      'cL02',
      'LQ',
      q(
        FA_TEACHER,
        '¿Qué dos cosas te pregunta el profesor?',
        'De dónde eres y cuántos años tienes',
        ['Tu nombre y tu edad', 'Dónde vives y tu teléfono', 'Tu nombre y cómo se escribe'],
        ['en-where', 'en-how-old'],
        '«Where are you from? And how old are you?»',
      ),
    ),
    item(
      'fa-cl03',
      'cL03',
      'LQ',
      q(
        FA_TIME,
        '¿Cuánto cuesta hoy el café?',
        'Tres dólares',
        ['Dos dólares', 'Trece dólares', 'Treinta dólares'],
        ['en-coffee', 'en-three', 'en-dollar'],
        '«coffee is three dollars».',
      ),
    ),
    item(
      'fa-cl04',
      'cL04',
      'LQ',
      q(
        FA_DIRS,
        '¿Dónde está el banco?',
        'A la izquierda, al lado del supermercado',
        [
          'A la derecha, al lado del supermercado',
          'A la izquierda, lejos del supermercado',
          'En el supermercado',
        ],
        ['en-left', 'en-next-to', 'en-supermarket'],
        '«Turn left. It is next to the supermarket».',
      ),
    ),
    item(
      'fa-cl05',
      'cL05',
      'LQ',
      q(
        FA_SHOP,
        '¿Cuánto paga Emma?',
        'Seis dólares',
        ['Dos dólares', 'Dieciséis dólares', 'Sesenta dólares'],
        ['en-dollar', 'en-six'],
        '«Six dollars, please».',
      ),
    ),
    item(
      'fa-cl06',
      'cL06',
      'LQ',
      q(
        FA_VOICE,
        '¿Qué pasa este sábado con Tom?',
        'No trabaja',
        ['Trabaja como siempre', 'Trabaja a la tarde', 'Está enfermo'],
        ['en-usually', 'en-saturday', 'en-dont'],
        "«I usually work on Saturday, but this Saturday I don't».",
      ),
    ),
    item(
      'fa-cr01',
      'cR01',
      'RQ',
      q(
        FA_SIGN,
        '¿Qué día no se puede visitar el museo?',
        'El lunes',
        ['El martes', 'El domingo', 'El sábado'],
        ['en-monday', 'en-museum'],
        'El cartel abre de martes a domingo; el lunes está tachado.',
      ),
    ),
    item(
      'fa-cr02',
      'cR02',
      'RQ',
      q(
        FA_MSG,
        '¿Dónde se encuentran antes del cine?',
        'En la estación, a las 7:30',
        ['En el cine, a las 8', 'En la estación, a las 8', 'En el cine, a las 7:30'],
        ['en-station', 'en-half-past'],
        '«See you at the station at half past seven!»',
      ),
    ),
    item(
      'fa-cr03',
      'cR03',
      'RQ',
      q(
        FA_DESC,
        '¿Qué hay en el jardín?',
        'Una mesa',
        ['Un sofá', 'Dos dormitorios', 'Una cocina'],
        ['en-garden', 'en-table'],
        '«There is a table in the garden».',
      ),
    ),
    item(
      'fa-cr05',
      'cR05',
      'RQ',
      q(
        FA_LINE,
        '¿Qué dice Kim?',
        'Que esas llaves no son suyas',
        ['Que perdió sus llaves', 'Que tiene llaves nuevas', 'Que las llaves son de Kim'],
        ['en-these', 'en-key', 'en-not'],
        '«These keys are not my keys».',
      ),
    ),
    item(
      'fa-cr06',
      'cR06',
      'RQ',
      q(
        FA_DIR,
        '¿Dónde está el banco?',
        'A la izquierda, al lado del cine',
        ['A la derecha, al lado del cine', 'Al lado del hotel', 'En el parque'],
        ['en-left', 'en-next-to', 'en-cinema'],
        '«The bank is on the left, next to the cinema».',
      ),
    ),
    // Production
    item(
      'fa-p01',
      'p01',
      'FF',
      pw(
        '📝 Form\nSofia Ruiz · 29 · Puebla, Mexico\nCity: ?',
        'Completa el campo del formulario con el dato de Sofia.',
        'Puebla',
        [],
        ['en-city'],
        { personalData: SOFIA },
      ),
    ),
    item(
      'fa-p03',
      'p03',
      'PW',
      pw(
        '👨‍🏫 Tom · 🇬🇧',
        'Escribe dos datos de Tom: qué es y de dónde es (usa he).',
        'He is a teacher and he is from England.',
        [
          'He is a teacher. He is from England.',
          "He's a teacher and he's from England.",
          "He's a teacher. He's from England.",
          'Tom is a teacher and he is from England.',
          'Tom is a teacher. He is from England.',
        ],
        ['en-teacher', 'en-england'],
      ),
    ),
    item(
      'fa-p04',
      'p04',
      'PW',
      pw(
        '🛋️ 🪑',
        'Escribe qué hay en la sala, con there is.',
        'There is a sofa and a chair.',
        [
          'There is a chair and a sofa.',
          'There is a sofa and a chair in the living room.',
          'There is a sofa and one chair.',
        ],
        ['en-there-is', 'en-sofa', 'en-chair'],
      ),
    ),
    item(
      'fa-p07',
      'p07',
      'GW',
      pw(
        '👧 Ana · 🎂 ?',
        'Escribe la pregunta para saber la edad de Ana.',
        'How old are you?',
        ['How old is Ana?', 'How old is she?'],
        ['en-how-old'],
      ),
    ),
    item(
      'fa-p10',
      'p10',
      'PW',
      pw(
        '🍵 🍞',
        'Situación: en un café. Pide un té y pan, con cortesía.',
        "I'd like a tea and bread, please.",
        [
          "I'd like tea and bread, please.",
          'I would like a tea and bread, please.',
          'I would like tea and bread, please.',
          'A tea and bread, please.',
        ],
        ['en-id-like', 'en-tea', 'en-bread'],
      ),
    ),
    item(
      'fa-p11',
      'p11',
      'SIT',
      sit(
        'en un chat no entiendes lo que escribió Ben.',
        'You: ___',
        "Sorry, I don't understand.",
        ['Nice to meet you.', 'See you on Monday!', 'I am fine.'],
        ['en-understand'],
      ),
    ),
  ],
};

export const FINAL_B: AssessmentFormDef = {
  id: 'en.a1.final.b',
  kind: 'final',
  form: 'B',
  title: 'Evaluación final A1 · forma B',
  upToUnit: 12,
  writing: [
    'en.a1.wt.block1-introduce',
    'en.a1.wt.block2-room-and-order',
    'en.a1.wt.block3-week-and-note',
    'en.a1.wt.block4-post-and-postcard',
    'en.a1.wt.my-age',
    'en.a1.wt.my-likes',
  ],
  items: [
    // Vocabulary
    item(
      'fb-v01',
      'v01',
      'SIT',
      sit(
        'llegas a la oficina a las 8 de la mañana.',
        '___, Mr. Lee!',
        'Good morning',
        ['Good night', 'Goodbye', "You're welcome"],
        ['en-good-morning'],
      ),
    ),
    item(
      'fb-v02',
      'v02',
      'FF',
      pw(
        '📝 Form\nSofia Ruiz · 29 · Puebla, Mexico\nCountry: ?',
        'Completa el campo del formulario con el dato de Sofia.',
        'Mexico',
        [],
        ['en-country', 'en-mexico'],
        { personalData: SOFIA },
      ),
    ),
    item(
      'fb-v03',
      'v03',
      'PW',
      pw('83', NUM, 'eighty-three', ['eighty three'], ['en-eighty', 'en-three']),
    ),
    item(
      'fb-v04',
      'v04',
      'PW',
      pw(
        '👴',
        'Escribe en inglés quién es en una familia (una palabra).',
        'grandfather',
        ['a grandfather', 'the grandfather', 'grandpa'],
        ['en-grandfather'],
      ),
    ),
    item(
      'fb-v05',
      'v05',
      'PW',
      pw(
        '📕',
        'Escribe en inglés qué es (una palabra).',
        'book',
        ['a book', 'It is a book.', "It's a book."],
        ['en-book'],
      ),
    ),
    item(
      'fb-v06',
      'v06',
      'PW',
      pw(
        '🪟',
        'Escribe en inglés qué es (una palabra).',
        'window',
        ['a window', 'It is a window.', "It's a window."],
        ['en-window'],
      ),
    ),
    item(
      'fb-v07',
      'v07',
      'PW',
      pw(
        '🥚',
        'Escribe en inglés qué es (una palabra).',
        'egg',
        ['an egg', 'It is an egg.', "It's an egg."],
        ['en-egg'],
      ),
    ),
    item(
      'fb-v08',
      'v08',
      'PW',
      pw(
        '🍽️ 😋',
        'Escribe en inglés la acción (un verbo).',
        'eat',
        ['to eat', 'eating'],
        ['en-eat'],
      ),
    ),
    item(
      'fb-v09',
      'v09',
      'PW',
      pw(
        '📅 July 2',
        'Escribe la fecha en inglés con el ordinal.',
        'July second',
        ['July 2nd', 'the second of July', 'on July second'],
        ['en-july', 'en-second'],
      ),
    ),
    item(
      'fb-v10',
      'v10',
      'PW',
      pw(
        '🏥',
        'Escribe en inglés qué es (una palabra).',
        'hospital',
        ['a hospital', 'It is a hospital.', "It's a hospital."],
        ['en-hospital'],
      ),
    ),
    item(
      'fb-v11',
      'v11',
      'PW',
      pw(
        '🎵 🎧',
        'Escribe en inglés qué es (una palabra).',
        'music',
        ['It is music.', "It's music."],
        ['en-music'],
      ),
    ),
    item(
      'fb-v12',
      'v12',
      'SIT',
      sit(
        'no sabes qué significa una palabra.',
        'What does it ___?',
        'mean',
        ['speak', 'know', 'help'],
        ['en-mean'],
      ),
    ),
    item(
      'fb-v14',
      'v14',
      'PW',
      pw(
        '😀',
        'Escribe cómo está esta persona (I am…).',
        'I am happy.',
        ["I'm happy.", 'happy'],
        ['en-happy'],
      ),
    ),
    item(
      'fb-v15',
      'v15',
      'PW',
      pw(
        '👩‍⚕️ 💉',
        'Escribe en inglés qué es (una profesión del hospital, no doctor).',
        'nurse',
        ['a nurse', 'She is a nurse.'],
        ['en-nurse'],
      ),
    ),
    // Grammar
    item(
      'fb-g01',
      'g01',
      'FB',
      fb(
        'Tom and Leo are brothers. ___ are from England.',
        'Tom y Leo son hermanos. Ellos son de Inglaterra.',
        'They',
        ['We', 'He', 'You'],
        ['en-they'],
      ),
    ),
    item(
      'fb-g02',
      'g02',
      'TR',
      pw(
        'She is not tired.',
        'Escribe la oración en afirmativa.',
        'She is tired.',
        ["She's tired."],
        ['en-is', 'en-tired'],
      ),
    ),
    item(
      'fb-g03',
      'g03',
      'TR',
      pw('You are a student.', ASK, 'Are you a student?', [], ['en-are', 'en-student']),
    ),
    item(
      'fb-g04',
      'g04',
      'FB',
      fb(
        'I have ___ apple in my bag.',
        'Tengo una manzana en mi bolso.',
        'an',
        ['a', 'the', 'these'],
        ['en-an', 'en-apple'],
      ),
    ),
    item(
      'fb-g05',
      'g05',
      'PW',
      pw(
        '👨 👨 👨',
        'Escribe en inglés cuántos son y qué son (plural).',
        'three men',
        ['3 men', 'They are three men.'],
        ['en-men', 'en-three'],
      ),
    ),
    item(
      'fb-g06',
      'g06',
      'FB',
      fb(
        '___ are my keys, here.',
        'Estas son mis llaves, aquí.',
        'These',
        ['This', 'That', 'It'],
        ['en-these'],
      ),
    ),
    item(
      'fb-g07',
      'g07',
      'FB',
      fb(
        'Tom has a sister. ___ sister is a nurse.',
        'Tom tiene una hermana. Su hermana es enfermera.',
        'His',
        ['Her', 'Their', 'Our'],
        ['en-his'],
      ),
    ),
    item(
      'fb-g08',
      'g08',
      'PW',
      pw(
        '👦 Leo ➜ 🎒',
        "Escribe de quién es el bolso (bag). Usa 's.",
        "It is Leo's bag.",
        ["It's Leo's bag.", "Leo's bag", "The bag is Leo's."],
        ['en-bag'],
      ),
    ),
    item(
      'fb-g09',
      'g09',
      'TR',
      pw('They have a garden.', ASK, 'Do they have a garden?', [], ['en-have', 'en-garden']),
    ),
    item(
      'fb-g10',
      'g10',
      'TR',
      pw(
        'There is a sofa in the living room.',
        ASK,
        'Is there a sofa in the living room?',
        [],
        ['en-there-is', 'en-sofa', 'en-living-room'],
      ),
    ),
    item(
      'fb-g11',
      'g11',
      'PW',
      pw(
        '🔑 📕',
        'Mira la escena y escribe dónde está la llave (con next to).',
        'The key is next to the book.',
        ['It is next to the book.', "It's next to the book.", 'Next to the book.'],
        ['en-key', 'en-next-to'],
      ),
    ),
    item(
      'fb-g12',
      'g12',
      'FB',
      fb(
        'My brother ___ books in the evening.',
        'Mi hermano lee libros a la noche.',
        'reads',
        ['read', 'reades', 'is read'],
        ['en-read'],
      ),
    ),
    item(
      'fb-g13',
      'g13',
      'TR',
      pw(
        'She likes tea.',
        NEG,
        "She doesn't like tea.",
        ['She does not like tea.'],
        ['en-doesnt', 'en-like'],
      ),
    ),
    item(
      'fb-g14',
      'g14',
      'PW',
      pw(
        'We / play / football ✔✔ (normalmente)',
        'Escribe la oración con el adverbio de frecuencia en su lugar.',
        'We usually play football.',
        [],
        ['en-usually'],
      ),
    ),
    item(
      'fb-g15',
      'g15',
      'FB',
      fb(
        'They play football ___ Monday.',
        'Juegan al fútbol el lunes.',
        'on',
        ['in', 'at', 'to'],
        ['en-monday'],
      ),
    ),
    item(
      'fb-g16',
      'g16',
      'GW',
      pw(
        'Answer: "My name is Kate."',
        'Escribe la pregunta que corresponde a esta respuesta.',
        'What is your name?',
        ["What's your name?"],
        ['en-what', 'en-name'],
      ),
    ),
    item(
      'fb-g17',
      'g17',
      'TR',
      pw(
        'He can dance.',
        NEG,
        "He can't dance.",
        ['He cannot dance.', 'He can not dance.'],
        ['en-can', 'en-dance'],
      ),
    ),
    item(
      'fb-g18',
      'g18',
      'GW',
      pw(
        'Do you like apples? (Sí, me encantan.)',
        'Responde con love y un pronombre.',
        'Yes, I love them.',
        ['I love them.', 'Yes, I love apples.'],
        ['en-love', 'en-them'],
      ),
    ),
    item(
      'fb-g19',
      'g19',
      'PW',
      pw(
        '🧍 ➡️ 🏨',
        'Mira la flecha y escribe la indicación para llegar al hotel.',
        'Turn right.',
        ['Turn right to the hotel.', 'Go right.'],
        ['en-turn', 'en-right'],
      ),
    ),
    item(
      'fb-g20',
      'g20',
      'PW',
      pw(
        '👜 (big, white)',
        'Escribe en inglés: «a» + los dos adjetivos + el objeto.',
        'a big white bag',
        [],
        ['en-big', 'en-white', 'en-bag'],
      ),
    ),
    item(
      'fb-g21',
      'g21',
      'FB',
      fb(
        'I have a black computer. I love ___.',
        'Tengo una computadora negra. Me encanta.',
        'it',
        ['them', 'me', 'they'],
        ['en-it'],
      ),
    ),
    item(
      'fb-g22',
      'g22',
      'GW',
      pw(
        "I can swim. I can't dance.",
        'Une las dos oraciones con but.',
        "I can swim, but I can't dance.",
        ['I can swim but I cannot dance.'],
        ['en-but'],
      ),
    ),
    item(
      'fb-g23',
      'g23',
      'SIT',
      sit(
        'en una tienda pides una botella de agua con cortesía.',
        '___ a bottle of water, please.',
        "I'd like",
        ['I like', 'I am', 'I have'],
        ['en-id-like', 'en-a-bottle-of'],
      ),
    ),
    // Comprehension
    item(
      'fb-cl01',
      'cL01',
      'LM',
      q(
        FB_WORD,
        '¿Qué quiere decir Kim?',
        'Disculpe / permiso',
        ['Gracias', 'Hola', 'Hasta mañana'],
        ['en-excuse-me'],
        '«Excuse me!» pide permiso para pasar.',
      ),
    ),
    item(
      'fb-cl02',
      'cL02',
      'LQ',
      q(
        FB_TEACHER,
        '¿Qué te pide la profesora después de tu nombre?',
        'Que lo deletrees',
        ['Que digas tu edad', 'Que digas de dónde eres', 'Que lo repitas despacio'],
        ['en-name', 'en-how-do-you-spell-it'],
        '«And how do you spell it?»',
      ),
    ),
    item(
      'fb-cl03',
      'cL03',
      'LQ',
      q(
        FB_TIME,
        '¿Cuánto cuesta hoy el té?',
        'Dos dólares',
        ['Cuatro dólares', 'Doce dólares', 'Veinte dólares'],
        ['en-tea', 'en-two', 'en-dollar'],
        '«tea is two dollars».',
      ),
    ),
    item(
      'fb-cl04',
      'cL04',
      'LQ',
      q(
        FB_DIRS,
        '¿Dónde está el parque?',
        'A la derecha, al lado del hospital',
        [
          'A la izquierda, al lado del hospital',
          'A la derecha, lejos del hospital',
          'En el hospital',
        ],
        ['en-right', 'en-next-to', 'en-hospital'],
        '«Turn right. It is next to the hospital».',
      ),
    ),
    item(
      'fb-cl05',
      'cL05',
      'LQ',
      q(
        FB_SHOP,
        '¿Qué compra Paul?',
        'Un kilo de manzanas',
        ['Dos kilos de manzanas', 'Un kilo de bananas', 'Cuatro manzanas'],
        ['en-a-kilo-of', 'en-apple'],
        "«I'd like a kilo of apples, please».",
      ),
    ),
    item(
      'fb-cl06',
      'cL06',
      'LQ',
      q(
        FB_VOICE,
        '¿Dónde está Kate ahora?',
        'En el banco',
        ['En casa', 'En el trabajo de siempre', 'En el parque'],
        ['en-bank'],
        "«I'm at the bank».",
      ),
    ),
    item(
      'fb-cr01',
      'cR01',
      'RQ',
      q(
        FB_SIGN,
        '¿Cuánto paga un chico para entrar?',
        'Dos dólares',
        ['Nada', 'Ocho dólares', 'Doce dólares'],
        ['en-children', 'en-dollar'],
        '«Children: two dollars».',
      ),
    ),
    item(
      'fb-cr02',
      'cR02',
      'RQ',
      q(
        FB_MSG,
        '¿Dónde se encuentran antes del partido?',
        'En la estación de autobuses, a las 3:30',
        ['En el parque, a las 4', 'En la estación, a las 4', 'En el parque, a las 3:30'],
        ['en-station', 'en-half-past', 'en-bus'],
        '«See you at the bus station at half past three!»',
      ),
    ),
    item(
      'fb-cr03',
      'cR03',
      'RQ',
      q(
        FB_DESC,
        '¿Qué está al lado de la cocina?',
        'El baño',
        ['La sala', 'Un dormitorio', 'El sofá'],
        ['en-bathroom', 'en-next-to', 'en-kitchen'],
        '«The bathroom is next to the kitchen».',
      ),
    ),
    item(
      'fb-cr05',
      'cR05',
      'RQ',
      q(
        FB_LINE,
        '¿Qué dice Leo?',
        'Que ese teléfono rojo no es suyo',
        ['Que su teléfono es rojo', 'Que quiere un teléfono rojo', 'Que perdió su teléfono'],
        ['en-that', 'en-phone', 'en-not'],
        '«That red phone is not my phone».',
      ),
    ),
    item(
      'fb-cr06',
      'cR06',
      'RQ',
      q(
        FB_DIR,
        '¿Dónde está el museo?',
        'A la derecha, al lado de la biblioteca',
        ['A la izquierda, al lado de la biblioteca', 'Al lado del banco', 'En la estación'],
        ['en-right', 'en-next-to', 'en-library'],
        '«The museum is on the right, next to the library».',
      ),
    ),
    // Production
    item(
      'fb-p01',
      'p01',
      'FF',
      pw(
        '📝 Form\nSofia Ruiz · 29 · Puebla, Mexico\nAge: ?',
        'Completa el campo del formulario con el dato de Sofia.',
        '29',
        ['twenty-nine', 'twenty nine'],
        ['en-age'],
        { personalData: SOFIA },
      ),
    ),
    item(
      'fb-p03',
      'p03',
      'PW',
      pw(
        '👩‍⚕️ Ana · 😴',
        'Escribe dos datos de Ana: qué es y cómo está (usa she).',
        'She is a nurse and she is tired.',
        [
          'She is a nurse. She is tired.',
          "She's a nurse and she's tired.",
          "She's a nurse. She's tired.",
          'Ana is a nurse and she is tired.',
          'Ana is a nurse. She is tired.',
        ],
        ['en-nurse', 'en-tired'],
      ),
    ),
    item(
      'fb-p04',
      'p04',
      'PW',
      pw(
        '🛏️ 🛏️ 🪟',
        'Escribe qué hay en el dormitorio, con there are y there is.',
        'There are two beds and a window.',
        [
          'There are two beds and one window.',
          'There is a window and two beds.',
          'There is one window and two beds.',
        ],
        ['en-there-are', 'en-bed', 'en-window'],
      ),
    ),
    item(
      'fb-p07',
      'p07',
      'GW',
      pw(
        '👦 Tom · 🌍 ?',
        'Escribe la pregunta para saber de dónde es Tom.',
        'Where are you from?',
        ['Where is Tom from?', 'Where is he from?'],
        ['en-where', 'en-from'],
      ),
    ),
    item(
      'fb-p10',
      'p10',
      'PW',
      pw(
        '🧃 🍎',
        'Situación: en un café. Pide un jugo y una manzana, con cortesía.',
        "I'd like a juice and an apple, please.",
        [
          "I'd like juice and an apple, please.",
          'I would like a juice and an apple, please.',
          'A juice and an apple, please.',
        ],
        ['en-id-like', 'en-juice', 'en-apple'],
      ),
    ),
    item(
      'fb-p11',
      'p11',
      'SIT',
      sit(
        'en un chat Ben escribe muy rápido.',
        'You: ___',
        'Can you repeat that, please?',
        ['Can you help me, please?', 'Where are you from?', 'What time is it?'],
        ['en-repeat'],
      ),
    ),
  ],
};

export const EN_A1_ASSESSMENTS: readonly AssessmentFormDef[] = [
  CP1,
  CP2,
  CP3,
  CP4,
  FINAL_A,
  FINAL_B,
];

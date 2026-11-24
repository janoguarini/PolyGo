/**
 * Catálogo A1 del mapa curricular de inglés (docs/polygo-ingles-a1-mapa-curricular.md §2), copiado
 * tal cual: códigos, objetivo, formatos de «Practicar» y de «Evaluar». Lo usan el cierre de A1
 * (content/supplement-checks.ts) y los bancos de evaluación (content/en/a1/assessment.ts) para
 * validar que todo código usado existe, que los retirados no vuelven y que cada ítem evalúa con un
 * formato que el mapa permite. No crea objetivos en la base (docs/A1_EN_CLOSURE.md §D).
 *
 * Sin imports a propósito (lo usan los tipos y los validadores).
 */

export type MapDimension = 'V' | 'G' | 'C' | 'P';

/** Formatos del mapa (§2, «Códigos de tipos de ejercicio»). */
export type MapFormat =
  | 'IC'
  | 'TC'
  | 'MP'
  | 'FB'
  | 'LC'
  | 'CW'
  | 'TW'
  | 'OW'
  | 'SA'
  | 'SIT'
  | 'LM'
  | 'LD'
  | 'LQ'
  | 'RQ'
  | 'TR'
  | 'PW'
  | 'FF'
  | 'GW'
  | 'FW';

export interface MapObjective {
  code: string;
  dimension: MapDimension;
  objective: string;
  practice: readonly MapFormat[];
  assess: readonly MapFormat[];
}

const o = (
  code: string,
  dimension: MapDimension,
  objective: string,
  practice: MapFormat[],
  assess: MapFormat[],
): MapObjective => ({ code, dimension, objective, practice, assess });

export const EN_A1_MAP: readonly MapObjective[] = [
  o(
    'v01',
    'V',
    'Usar saludos, despedidas y fórmulas de cortesía según la situación',
    ['IC', 'TC', 'MP', 'LC', 'SIT'],
    ['SIT', 'PW'],
  ),
  o(
    'v02',
    'V',
    'Manejar el alfabeto, deletrear y dar datos personales',
    ['LC', 'LD', 'CW', 'FF'],
    ['LD', 'FF'],
  ),
  o(
    'v03',
    'V',
    'Manejar números del 0 al 100, cantidades y precios',
    ['IC', 'LC', 'LD', 'TW'],
    ['LD', 'PW', 'LQ'],
  ),
  o('v04', 'V', 'Nombrar a la familia y a las personas', ['IC', 'TC', 'MP', 'TW'], ['PW', 'TW']),
  o('v05', 'V', 'Nombrar objetos cotidianos, colores y tamaños', ['IC', 'MP', 'CW'], ['PW', 'LM']),
  o('v06', 'V', 'Nombrar las partes de la casa y los muebles', ['IC', 'MP', 'CW'], ['PW', 'LM']),
  o('v07', 'V', 'Nombrar comida, bebida y comidas del día', ['IC', 'MP', 'TC'], ['PW', 'LM']),
  o('v08', 'V', 'Nombrar las acciones de la rutina', ['IC', 'TC', 'MP'], ['PW', 'LM']),
  o(
    'v09',
    'V',
    'Expresar el tiempo: días, partes del día, la hora, meses y fechas',
    ['TC', 'LC', 'IC', 'LD'],
    ['LD', 'PW'],
  ),
  o(
    'v10',
    'V',
    'Nombrar lugares de la ciudad, transportes y palabras para dar indicaciones',
    ['IC', 'MP', 'TC'],
    ['PW', 'LM'],
  ),
  o('v11', 'V', 'Nombrar actividades de ocio', ['IC', 'MP', 'TC'], ['PW', 'LM']),
  o('v12', 'V', 'Usar fórmulas para manejar la comunicación', ['TC', 'SIT'], ['SIT']),
  o('v14', 'V', 'Describir personas y estados con adjetivos básicos', ['IC', 'TC'], ['PW']),
  o('v15', 'V', 'Decir a qué se dedica (repertorio mínimo de profesiones)', ['IC', 'TC'], ['PW']),
  o('g01', 'G', 'Pronombres sujeto', ['FB', 'MP'], ['FB', 'PW']),
  o('g02', 'G', 'To be afirmativo y contracciones', ['FB', 'OW'], ['FB', 'TR', 'PW']),
  o(
    'g03',
    'G',
    'To be negativo, interrogativo y respuestas cortas',
    ['FB', 'OW', 'TR'],
    ['TR', 'GW'],
  ),
  o('g04', 'G', 'Artículos a/an/the', ['FB'], ['FB', 'PW']),
  o('g05', 'G', 'Plurales regulares e irregulares frecuentes', ['FB', 'CW'], ['FB', 'PW']),
  o('g06', 'G', 'This/that/these/those', ['FB', 'IC'], ['FB', 'PW']),
  o('g07', 'G', 'Adjetivos posesivos', ['FB', 'MP'], ['FB', 'PW']),
  o('g08', 'G', "Posesión con 's", ['FB'], ['PW']),
  o('g09', 'G', 'Have/has', ['FB', 'OW'], ['FB', 'TR', 'GW']),
  o('g10', 'G', 'There is/are y how many', ['FB', 'OW'], ['PW', 'TR']),
  o('g11', 'G', 'Preposiciones de lugar', ['FB', 'IC'], ['PW', 'LM']),
  o(
    'g12',
    'G',
    'Presente simple afirmativo, con la -s de tercera persona',
    ['FB', 'OW'],
    ['FB', 'PW', 'TR'],
  ),
  o(
    'g13',
    'G',
    'Presente simple negativo, preguntas con do/does y respuestas cortas',
    ['FB', 'OW', 'TR'],
    ['TR', 'GW'],
  ),
  o('g14', 'G', 'Adverbios de frecuencia y su posición', ['OW', 'FB'], ['PW', 'GW']),
  o('g15', 'G', 'Preposiciones de tiempo at/on/in', ['FB'], ['FB', 'PW']),
  o('g16', 'G', 'Preguntas wh-', ['FB', 'OW', 'MP'], ['GW', 'RQ']),
  o('g17', 'G', "Can/can't para capacidad y para pedir", ['FB', 'OW'], ['TR', 'GW']),
  o('g18', 'G', 'Like/love/hate + sustantivo o -ing', ['FB', 'OW'], ['GW']),
  o('g19', 'G', 'Imperativo', ['FB', 'OW'], ['PW']),
  o('g20', 'G', 'Adjetivo + sustantivo', ['OW', 'FB'], ['PW']),
  o('g21', 'G', 'Pronombres objeto (en frases fijas)', ['FB'], ['FB', 'PW']),
  o('g22', 'G', 'And/but/because', ['FB'], ['GW', 'FW']),
  o('g23', 'G', "I want / I'd like + sustantivo, y cantidades", ['FB', 'SIT'], ['SIT', 'PW']),
  o(
    'cL01',
    'C',
    'Entender el significado de palabras y frases familiares dichas despacio',
    ['LM', 'LC'],
    ['LM'],
  ),
  o('cL02', 'C', 'Entender preguntas e instrucciones dirigidas al alumno', ['LQ', 'LM'], ['LQ']),
  o(
    'cL03',
    'C',
    'Captar números, precios y horas en anuncios y mensajes',
    ['LD', 'LQ'],
    ['LD', 'LQ'],
  ),
  o('cL04', 'C', 'Seguir indicaciones breves y entender dónde está algo', ['LQ'], ['LQ']),
  o('cL05', 'C', 'Entender una conversación simple entre otras personas', ['LQ'], ['LQ']),
  o('cL06', 'C', 'Sacar datos concretos de grabaciones breves (mensaje de voz)', ['LQ'], ['LQ']),
  o(
    'cR01',
    'C',
    'Entender avisos, carteles, menús, horarios, folletos e información práctica',
    ['RQ'],
    ['RQ'],
  ),
  o('cR02', 'C', 'Entender mensajes breves que proponen qué hacer, cuándo y dónde', ['RQ'], ['RQ']),
  o('cR03', 'C', 'Entender textos descriptivos breves con apoyo visual', ['RQ'], ['RQ']),
  o('cR05', 'C', 'Entender el significado de oraciones sueltas', ['RQ', 'FB'], ['RQ']),
  o('cR06', 'C', 'Seguir indicaciones escritas para ir de un lugar a otro', ['RQ'], ['RQ']),
  o('p01', 'P', 'Completar un formulario con sus datos', ['FF'], ['FF']),
  o('p02', 'P', 'Presentarse en oraciones simples con información propia', ['GW'], ['GW', 'FW']),
  o('p03', 'P', 'Describir a personas reales o imaginarias', ['PW', 'GW'], ['PW', 'FW']),
  o('p04', 'P', 'Describir una habitación y objetos', ['PW'], ['PW']),
  o('p05', 'P', 'Contar su rutina y horarios', ['GW'], ['GW', 'FW']),
  o('p06', 'P', 'Escribir sobre aficiones y gustos', ['GW'], ['FW']),
  o('p07', 'P', 'Pedir datos personales por escrito', ['GW'], ['GW']),
  o('p08', 'P', 'Dar datos propios respondiendo a preguntas', ['GW'], ['GW']),
  o(
    'p09',
    'P',
    'Escribir una postal, un mensaje de texto o una nota del tipo "back at 5"',
    ['GW', 'FW'],
    ['FW'],
  ),
  o('p10', 'P', 'Pedir cosas (comida, compras) en un intercambio escrito', ['SIT', 'PW'], ['PW']),
  o('p11', 'P', 'Pedir aclaraciones en un chat', ['SIT'], ['SIT']),
];

/** Retirados o diferidos por el mapa: nunca se usan (v13, cR04, p12; g24 pasa a A2). */
export const EN_A1_RETIRED_CODES: readonly string[] = ['v13', 'cR04', 'p12', 'g24'];

/** Competencias orales: registradas, NO evaluadas (mapa §2). */
export const EN_A1_UNASSESSED_CODES: readonly string[] = ['o01', 'o02', 'o03'];

export const mapObjective = (code: string) => EN_A1_MAP.find((m) => m.code === code);

/** Bloques del mapa (§3): unidades en el orden de la ruta v2 y objetivos de su punto de control. */
export const EN_A1_BLOCKS = [
  {
    block: 1,
    title: 'Yo y las personas',
    units: [1, 2, 3, 13, 4],
    checkpoint: [
      'v01',
      'v02',
      'v03',
      'v04',
      'g01',
      'g02',
      'g03',
      'g07',
      'g08',
      'g09',
      'g16',
      'cL01',
      'cL02',
      'cL03',
      'cL05',
      'cR01',
      'cR02',
      'cR03',
      'p01',
      'p02',
      'p03',
      'p08',
    ],
    writing: ['p02', 'p03'],
  },
  {
    block: 2,
    title: 'Mis cosas, mi casa, mi comida',
    units: [5, 6, 7, 14],
    checkpoint: [
      'v03',
      'v05',
      'v06',
      'v07',
      'g04',
      'g05',
      'g06',
      'g10',
      'g11',
      'g20',
      'g23',
      'cL01',
      'cL03',
      'cL04',
      'cL05',
      'cR01',
      'cR03',
      'cR05',
      'p04',
      'p10',
    ],
    writing: ['p04', 'p10'],
  },
  {
    block: 3,
    title: 'Mi día y mi semana',
    units: [8, 9],
    checkpoint: [
      'v08',
      'v09',
      'g12',
      'g13',
      'g14',
      'g15',
      'cL03',
      'cL06',
      'cR01',
      'cR02',
      'p05',
      'p09',
    ],
    writing: ['p05', 'p09'],
  },
  {
    block: 4,
    title: 'Por la ciudad y con los demás',
    units: [10, 11, 12],
    checkpoint: [
      'v10',
      'v11',
      'v12',
      'g16',
      'g17',
      'g18',
      'g19',
      'g21',
      'g22',
      'cL02',
      'cL04',
      'cL05',
      'cR02',
      'cR06',
      'p06',
      'p07',
      'p09',
      'p11',
    ],
    writing: ['p06', 'p07', 'p09'],
  },
] as const;

/** Orden de las unidades en la ruta v2 (U13 después de U3, U14 después de U7: mapa §5). */
export const EN_A1_ROUTE_ORDER: readonly number[] = EN_A1_BLOCKS.flatMap((b) => [...b.units]);

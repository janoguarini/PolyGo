import type { ExercisePayload, ExerciseType, Skill } from '../shared/exercises';
import type { AssessmentMode } from './catalog';
import type { ComprehensionCode } from './comprehension-map';

/**
 * Formato de autoría del currículo (estándar en docs/CONTENT_STANDARD.md).
 * scripts/build-content-sql.ts lo convierte en una migración SQL; content/__tests__/content.test.ts
 * valida su integridad.
 *
 * Organización: idioma → nivel → unidad → lección → ejercicios (content/<idioma>/<nivel>/).
 * IDs: palabra "<idioma>-<slug>". Unidad, lección y ejercicio llevan el prefijo del idioma salvo en
 * inglés, que conserva los ids históricos para no perder el progreso de nadie:
 *   inglés   a1-u01, a1-u01-l01, a1-u01-l01-e01
 *   italiano it-a1-u01, it-a1-u01-l01, it-a1-u01-l01-e01
 */

/** Niveles del MCER con contenido (la base admite los mismos en curriculum_units.level). */
export type Level = 'A1' | 'A2' | 'B1' | 'B2';

/** Estado de la revisión lingüística: lo redactado sin revisión humana queda en 'draft'. */
export type ReviewStatus = 'draft' | 'in_review' | 'reviewed';

export interface WordDef {
  id: string;
  /** La palabra o frase en el idioma que se aprende (en chino, en caracteres). */
  text: string;
  translation: string;
  /** Otras traducciones válidas al español. */
  acceptedTranslations?: string[];
  /** Otras formas válidas en el idioma al escribirla (p. ej. «a lot» para «very much»). */
  acceptedTexts?: string[];
  /** Transcripción fonética (en inglés, general americano). Opcional en los demás idiomas. */
  ipa?: string;
  /** Chino: pinyin con marcas de tono («nǐ hǎo»). Es lo que se escribe en los ejercicios. */
  romanization?: string;
  emoji?: string;
  /** Ejemplo en el idioma que se aprende (la columna se llama example_en por historia). */
  exampleEn: string;
  exampleEs: string;
  difficulty?: number;
  tags: string[];
}

export interface ExerciseDef {
  /**
   * Id del ítem que evalúa (arquitectura de datos §5; docs/LEARNING_CATALOG_PHASE1.md §2). Los
   * ejercicios ya publicados no lo declaran: su id es el actual, por posición, congelado en
   * content/ids.lock.json. Los nuevos lo declaran siempre: se escribe el marcador
   * `'<idioma>.ex.new'` y `npm run content:ids` lo reemplaza por `<idioma>.ex.<14 [0-9a-z]>` y lo
   * registra. Un ejercicio publicado que se mueve declara su id por posición para conservarlo. Si
   * cambia el tipo, el modo, los conceptos target o la privacidad, es un ítem nuevo y necesita un
   * id nuevo; la redacción, las opciones y la respuesta no cambian el ítem.
   */
  id?: string;
  type: ExerciseType;
  skill: Skill;
  prompt: string;
  payload: ExercisePayload;
  answer: string;
  acceptedAnswers?: string[];
  explanation?: string;
  /** IDs de palabras que el ejercicio practica (alimentan la repetición espaciada). */
  words: string[];
  /**
   * Conceptos target del ítem cuando no son `words` (arquitectura de datos §4.3). Sólo los ejercicios
   * de comprensión en contexto (`context_choice`) lo usan: sus `words` quedan vacías para que no
   * entren en `exercise_words` ni en el SRS léxico v1, y sus conceptos target salen de acá.
   */
  concepts?: string[];
  /**
   * Modo de evaluación explícito (arquitectura de datos §4.4). Si falta, el script de contenido lo
   * deduce del tipo (content/catalog.ts). Tiene que ser compatible con el formato del tipo.
   */
  mode?: AssessmentMode;
  /**
   * Datos personales que pide el ejercicio (§13.2). `{ persona }`: de una persona ficticia de
   * content/personas.ts (en texto libre, privacidad `fictional`). `'learner'`: del propio usuario,
   * que no se publica mientras P4 siga pendiente (el catálogo lo rechaza). Sin este campo, el texto
   * libre es `open_text` aunque mencione un nombre propio.
   */
  personalData?: { persona: string } | 'learner';
  difficulty?: number;
  recommendedSeconds?: number;
  /**
   * false: no se reutiliza en las lecciones de consolidación. Para ejercicios agregados a una unidad
   * ya cargada: así la consolidación generada (y sus vínculos con palabras) no cambia.
   */
  consolidate?: boolean;
}

/** Ejemplo natural: en el idioma que se aprende y en español. */
export interface ExampleDef {
  target: string;
  base: string;
  note?: string;
}

/** Introducción breve de la lección: se muestra antes del primer ejercicio y no puntúa. */
export interface LessonIntro {
  explanation: string;
  examples: ExampleDef[];
}

export interface LessonDef {
  title: string;
  objective: string;
  intro?: LessonIntro;
  /** Cierre: qué aprendiste («Ahora podés…»). Se muestra en los resultados. */
  takeaways?: string[];
  exercises: ExerciseDef[];
}

/**
 * Lección «En contexto» (fase C, docs/LEARNING_PHASE_C.md): comprensión lectora y auditiva de una
 * unidad ya cargada. Vive fuera de `UnitDef.lessons` para no cambiar la consolidación generada ni los
 * ids publicados, y se carga sin publicar (`is_published = false`) hasta su revisión pedagógica.
 */
export interface ContextLessonDef extends LessonDef {
  /** Posición de la unidad (1-based) en su nivel: a1-u01 = 1. */
  unit: number;
  /** Estado editorial. Sólo `draft`: el paso a publicado exige revisión pedagógica real (P8). */
  status: 'draft';
  /**
   * Número de lección en el mapa curricular (docs/polygo-ingles-a1-mapa-curricular.md §3): 6, o 7
   * cuando el mapa agrega antes una lección nueva (`plannedBefore`). NO es `lessons.position` (la
   * posición en el camino, que incluye repasos y consolidación) ni se usa para construir ids.
   */
  curriculumLesson: 6 | 7;
  /** Lecciones nuevas del mapa que van antes de esta y todavía no existen (p. ej. U5 L6). */
  plannedBefore: string[];
  /**
   * Objetivos de la lección según el mapa: los principales de comprensión (códigos `cL…`/`cR…`,
   * content/comprehension.ts) y los secundarios tal como los nombra el mapa (v01, g02, p04…: sólo
   * documentación; esos objetivos todavía no existen en la base y no se inventan).
   */
  curriculum: { primary: ComprehensionCode[]; secondary: string[] };
  /**
   * Persona ficticia del catálogo (content/personas.ts, `content_personas`) cuyos datos muestran los
   * estímulos (fase C.2: la huésped de U13). Sólo los datos de contacto de esa persona pueden
   * aparecer en un estímulo, y cada pregunta de la lección la cita con `personalData: { persona }`.
   * La respuesta sigue siendo una opción (`closed`): el alumno nunca escribe datos, propios ni ajenos.
   */
  persona?: string;
  /** Objetivo de comprensión que evalúa cada estímulo (por `stimulus.id`); uno de `primary`. */
  stimulusObjectives: Record<string, ComprehensionCode>;
  /**
   * Nombres de pila ficticios que aparecen en los estímulos (personajes, nunca datos de contacto).
   * Explícitos para la revisión de privacidad (§13.2); no cuentan como vocabulario.
   */
  names: string[];
  /**
   * Palabras de los estímulos que el currículo todavía no enseñó hasta esta unidad (sin contar
   * `names`). Explícitas para la revisión pedagógica; un test exige que estén todas.
   */
  untaught: string[];
}

export interface UnitDef {
  /** 1-based dentro de su nivel; define el id a1-uNN / it-a1-uNN. */
  position: number;
  title: string;
  titleEn: string;
  description: string;
  emoji: string;
  /** Objetivo comunicativo («Podés…»). */
  objective?: string;
  /** Estructura principal de la unidad, cuando corresponde. */
  grammar?: { title: string; explanation: string; examples: ExampleDef[] };
  review?: { status: ReviewStatus; reviewer?: string; notes?: string };
  words: WordDef[];
  lessons: LessonDef[];
}

/**
 * Unidad del mapa curricular sin lecciones escritas todavía (fase C.2: U13 y U14), que existe sólo
 * para su lección «En contexto». Se carga sin publicar, sin palabras ni lecciones, fuera de COURSES y
 * de CURRICULUM_PATH (content/comprehension.ts).
 */
export interface PlannedUnitDef extends Omit<UnitDef, 'words' | 'lessons' | 'review' | 'grammar'> {
  /** Unidad escrita tras la que la intercala el mapa: el vocabulario enseñado se mide hasta ella. */
  after: number;
  /**
   * Posiciones de lección reservadas para las lecciones escritas y su consolidación (las de una
   * unidad de 5 lecciones). La «En contexto» va en la siguiente, como en las unidades escritas.
   */
  reservedPositions: number;
  /**
   * Lecciones del mapa que van antes de la «En contexto». Desde la fase C.3 están escritas
   * (`PlannedWrittenUnitDef`, content/planned.ts) con estos títulos y objetivos principales.
   */
  plannedLessons: string[];
}

/**
 * Lecciones escritas L1–L5 de una unidad planificada (fase C.3, docs/LEARNING_PHASE_C.md §C3): U13 y
 * U14 de inglés A1. Siguen fuera de COURSES y de CURRICULUM_PATH (content/planned.ts) y se cargan sin
 * publicar hasta que se decida el orden del mapa y el desbloqueo.
 */
export interface PlannedWrittenUnitDef {
  /** La unidad completa: misma posición, títulos y objetivo que su `PlannedUnitDef`. */
  unit: UnitDef;
  /**
   * Palabras de unidades ya cargadas (posteriores en el mapa, o de A2) que esta unidad introduce
   * antes según el mapa (p. ej. `how much` de U12 en U14 L3). Se reutiliza la palabra (su concepto y
   * su id): no se duplica. Cuentan como enseñadas desde la primera lección que las practica.
   */
  borrowed: string[];
  /** Nombres propios y fragmentos de datos ficticios (correo) que no son vocabulario. */
  names: string[];
  /** Objetivos de cada lección según el mapa (§3): códigos tal como los nombra (v02, cL01, p01…). */
  curriculum: { primary: string[]; secondary: string[] }[];
}

export interface LevelDef {
  level: Level;
  units: UnitDef[];
}

/** Curso de un idioma (desde español). */
export interface CourseDef {
  language: string;
  levels: LevelDef[];
}

/**
 * Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): lo que el mapa curricular marca como «M» (agregar) o
 * «N» (lección nueva) en una unidad que ya tiene lecciones cargadas (U1–U12, o U13/U14 de la fase C.3).
 * Todo se carga SIN publicar y con los ítems en `draft` (scripts/build-a1-closure-sql.ts): ni la
 * consolidación generada, ni los ids publicados, ni lo que ve la app cambian hasta publicarlo.
 */
export interface CurriculumCodes {
  /** Códigos del mapa tal como los nombra (§2): v01…v15, g01…g23, cL01…cR06, p01…p11. */
  primary: string[];
  secondary: string[];
}

/** Ejercicios que el mapa agrega al final de una lección ya cargada («M: agregar …»). */
export interface LessonAppendixDef {
  /** Id de la lección cargada (a1-u04-l04). Sus ejercicios cargados no cambian. */
  lesson: string;
  /** Qué pide el mapa para esa lección (§3, columna «Estado y cambios»), para la revisión. */
  mapChange: string;
  curriculum: CurriculumCodes;
  exercises: ExerciseDef[];
}

/** Lección nueva del mapa en una unidad cargada (U5 L6, U9 L6, U12 L6). */
export interface SupplementLessonDef extends LessonDef {
  /** Id estable: el de la unidad + `-lNN` con el número de lección del mapa (a1-u09-l06). */
  id: string;
  /** Número de lección en el mapa (§3). No es la posición en el camino. */
  curriculumLesson: number;
  curriculum: CurriculumCodes;
}

export interface UnitSupplementDef {
  /** Posición de la unidad en su nivel (a1-u09 = 9; U13 y U14 son las planificadas). */
  unit: number;
  /** Palabras nuevas que la unidad necesita (p. ej. los meses). Se cargan sin publicar. */
  words: WordDef[];
  appendices: LessonAppendixDef[];
  lessons: SupplementLessonDef[];
  /** Nombres propios ficticios (no son vocabulario). */
  names: string[];
}

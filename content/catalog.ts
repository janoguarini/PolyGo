import { answerKindFor, type ExerciseType } from '../shared/exercises';
import { AUTHORED_ID, LEGACY_AUTHORED_ID, NEW_ID_PLACEHOLDER } from './ids-lock';
import { COURSES, type PathUnit } from './index';
import {
  LEARNING_OBJECTIVES,
  objectiveProblems,
  type CefrActivity,
  type LessonObjectiveRole,
  type ObjectiveConceptRole,
  type ObjectiveDef,
  type ObjectiveScope,
  type ObjectiveStatus,
} from './objectives';
import { lessonExerciseIndex, pathExerciseId } from './path';
import { CONTENT_PERSONAS, personaProblems, type PersonaDef } from './personas';
import type { ExerciseDef, Level, WordDef } from './types';

/**
 * Catálogo de aprendizaje derivado de content/ (arquitectura de datos rev. 8, §4.3–§4.5 y §5):
 * conceptos léxicos, ítems y sus conceptos por dimensión. Lo usan los generadores de migraciones
 * (scripts/content-sql.ts); la base valida lo mismo con FK, CHECK y triggers
 * (supabase/migrations/20261107130000_learning_items.sql). Las decisiones de identidad y de
 * privacidad están en docs/LEARNING_CATALOG_PHASE1.md.
 */

/** Modos de evaluación (§4.2, tabla `ref_assessment_modes`). */
export const ASSESSMENT_MODES = [
  'recognition',
  'cued_recall',
  'guided_construction',
  'free_recall',
  'controlled_production',
  'free_production',
  'listening_comprehension',
  'reading_comprehension',
] as const;
export type AssessmentMode = (typeof ASSESSMENT_MODES)[number];

export type ResponseFormat = 'select' | 'pairs' | 'typed' | 'tiles' | 'speech';
/** Canal de entrada (§4.2, tabla `ref_input_modalities`). */
export const INPUT_MODALITIES = ['text', 'audio', 'image', 'audio_text'] as const;
export type InputModality = (typeof INPUT_MODALITIES)[number];
/** §13.2 (tabla `ref_response_privacy`). No hay valor para datos del propio usuario (P4). */
export type ResponsePrivacy = 'closed' | 'fictional' | 'open_text';
export type PolygoDimension = 'vocabulary' | 'grammar' | 'comprehension' | 'production';

/** Formatos válidos de cada modo (§4.2, tabla `ref_mode_formats`). */
export const MODE_FORMATS: Record<AssessmentMode, readonly ResponseFormat[]> = {
  recognition: ['select', 'pairs'],
  cued_recall: ['typed'],
  guided_construction: ['tiles'],
  free_recall: ['typed', 'speech'],
  controlled_production: ['typed', 'speech'],
  free_production: ['typed', 'speech'],
  listening_comprehension: ['select', 'typed'],
  reading_comprehension: ['select', 'typed'],
};

/** Dimensión de habilidad que alimenta cada modo (§4.2, columna «Alimenta»). */
export const MODE_SKILL: Record<AssessmentMode, PolygoDimension | null> = {
  recognition: null,
  cued_recall: null,
  guided_construction: null,
  free_recall: null,
  controlled_production: 'production',
  free_production: 'production',
  listening_comprehension: 'comprehension',
  reading_comprehension: 'comprehension',
};

/**
 * Clasificación de los tipos actuales (§4.4). `translate_write` depende de la respuesta: es
 * `free_recall` si es una palabra del currículo y `controlled_production` si no.
 */
const TYPE_CLASSIFICATION: Record<
  ExerciseType,
  {
    mode: AssessmentMode | 'by_answer' | 'by_stimulus';
    format: ResponseFormat;
    input: InputModality | 'by_stimulus';
  }
> = {
  image_choice: { mode: 'recognition', format: 'select', input: 'image' },
  translation_choice: { mode: 'recognition', format: 'select', input: 'text' },
  listen_choice: { mode: 'recognition', format: 'select', input: 'audio' },
  match_pairs: { mode: 'recognition', format: 'pairs', input: 'text' },
  fill_blank: { mode: 'recognition', format: 'select', input: 'text' },
  complete_word: { mode: 'cued_recall', format: 'typed', input: 'text' },
  order_words: { mode: 'guided_construction', format: 'tiles', input: 'text' },
  translate_write: { mode: 'by_answer', format: 'typed', input: 'text' },
  short_answer: { mode: 'controlled_production', format: 'typed', input: 'audio_text' },
  // Fase C: decide el estímulo. Texto → reading_comprehension con entrada text; audio →
  // listening_comprehension con entrada audio (§4.2: el canal es una columna aparte del modo).
  context_choice: { mode: 'by_stimulus', format: 'select', input: 'by_stimulus' },
};

/** Modo y entrada que corresponden al estímulo de un `context_choice`. */
export function stimulusClass(e: Pick<ExerciseDef, 'payload'>): {
  mode: AssessmentMode;
  input: InputModality;
} {
  if (e.payload.type !== 'context_choice') throw new Error(`${e.payload.type} no tiene estímulo`);
  return e.payload.stimulus.kind === 'reading'
    ? { mode: 'reading_comprehension', input: 'text' }
    : { mode: 'listening_comprehension', input: 'audio' };
}

const normalized = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[¿?¡!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Formas escritas de una palabra (texto, otras formas y, en chino, pinyin). */
const formsOf = (w: WordDef) =>
  [w.text, ...(w.acceptedTexts ?? []), ...(w.romanization ? [w.romanization] : [])].map(normalized);

/** Formas escritas de las palabras del currículo de cada idioma. */
const WORD_FORMS = new Map<string, Set<string>>(
  COURSES.map(({ language, levels }) => [
    language,
    new Set(levels.flatMap((l) => l.units.flatMap((u) => u.words)).flatMap(formsOf)),
  ]),
);

/** Nivel curricular de cada palabra: el de su unidad. */
const WORD_LEVEL = new Map<string, Level>(
  COURSES.flatMap(({ levels }) =>
    levels.flatMap(({ level, units }) =>
      units.flatMap((u) => u.words.map((w) => [w.id, level] as const)),
    ),
  ),
);

/** Orden de los niveles (`ref_levels.position`). */
const LEVEL_POSITION: Record<Level, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };

export interface ItemClass {
  assessment_mode: AssessmentMode;
  response_format: ResponseFormat;
  input_modality: InputModality;
  response_privacy: ResponsePrivacy;
}

/**
 * Privacidad de la respuesta (§13.2), explícita y comprobable:
 * - `closed`: la respuesta es una opción, fichas o parejas: no puede contener texto libre. Aunque
 *   el ejercicio cite una persona ficticia, sigue siendo `closed`.
 * - `fictional`: texto libre sobre una persona ficticia del catálogo, citada con
 *   `ExerciseDef.personalData = { persona }` (tiene que existir en content/personas.ts y ser del
 *   mismo idioma).
 * - `open_text`: el resto del texto libre, con respuesta esperada (traducciones, `short_answer`).
 *   Mencionar un nombre propio no lo vuelve `fictional`: hace falta la persona del catálogo.
 * - Datos del propio usuario (`personalData: 'learner'`, self_disclosure): no existe ese valor y el
 *   contenido no se publica mientras P4 siga pendiente.
 */
export function responsePrivacyOf(
  e: Pick<ExerciseDef, 'type' | 'personalData'>,
  language: string,
  personas: readonly PersonaDef[] = CONTENT_PERSONAS,
): ResponsePrivacy {
  const data = e.personalData;
  if (data === 'learner') {
    throw new Error(
      `${e.type}: pide datos personales del usuario (self_disclosure). No se publica: P4 sigue pendiente (§13.2)`,
    );
  }
  if (data) {
    const persona = personas.find((p) => p.id === data.persona);
    if (!persona) throw new Error(`Persona ${data.persona} inexistente en content/personas.ts`);
    if (persona.language !== language) {
      throw new Error(`Persona ${persona.id} es de ${persona.language}, no de ${language}`);
    }
  }
  if (answerKindFor(e.type) !== 'text') return 'closed';
  return data ? 'fictional' : 'open_text';
}

/** Modo (explícito en el contenido o deducido por §4.4), formato, entrada y privacidad (§13.2). */
export function classifyExercise(
  e: ExerciseDef,
  language: string,
  /** Formas de palabras que todavía no están en COURSES (contenido nuevo de un tramo). */
  extraForms: ReadonlySet<string> = new Set(),
  personas: readonly PersonaDef[] = CONTENT_PERSONAS,
): ItemClass {
  const c = TYPE_CLASSIFICATION[e.type];
  const answer = normalized(e.answer);
  const byStimulus = c.mode === 'by_stimulus' ? stimulusClass(e) : null;
  const deduced: AssessmentMode = byStimulus
    ? byStimulus.mode
    : c.mode !== 'by_answer' && c.mode !== 'by_stimulus'
      ? c.mode
      : WORD_FORMS.get(language)?.has(answer) || extraForms.has(answer)
        ? 'free_recall'
        : 'controlled_production';
  const mode = e.mode ?? deduced;
  // Un texto no se declara de escucha ni un audio de lectura: el modo dice qué se comprende.
  if (byStimulus && mode !== byStimulus.mode) {
    throw new Error(`Modo ${mode} incompatible con el estímulo (${byStimulus.mode}) de ${e.type}`);
  }
  if (!MODE_FORMATS[mode].includes(c.format)) {
    throw new Error(`Modo ${mode} incompatible con el formato ${c.format} de ${e.type}`);
  }
  return {
    assessment_mode: mode,
    response_format: c.format,
    input_modality: byStimulus ? byStimulus.input : (c.input as InputModality),
    response_privacy: responsePrivacyOf(e, language, personas),
  };
}

/** Dimensiones de cada concepto target léxico (§4.3, pasos 1 y 2). */
export function targetDimensions(mode: AssessmentMode): PolygoDimension[] {
  const skill = MODE_SKILL[mode];
  return skill ? ['vocabulary', skill] : ['vocabulary'];
}

export interface ConceptRow {
  id: string;
  language_code: string;
  level: Level;
}

/**
 * Fila de `exercise_items`. No lleva `cefr_activity`: queda nula mientras el contenido no declare
 * una actividad del MCER (no se deduce de `input_modality`), ni `status`: la migración la carga
 * `active` y nunca la cambia (no se retira un ítem por faltar en una recarga).
 */
export interface ItemRow extends ItemClass {
  id: string;
  language_code: string;
  level: Level;
  origin: 'authored' | 'generated';
  type: ExerciseType;
}

export interface ItemConceptRow {
  item_id: string;
  concept_id: string;
  dimension: PolygoDimension;
  /** Sólo target: los conceptos context y distractor no dan filas (§4.3, paso 3). */
  role: 'target';
  language_code: string;
}

/** Ejercicio de la base (`exercises.id`) → ítem que evalúa. */
export interface Placement {
  exercise_id: string;
  item_id: string;
  /** authored: el ejercicio escrito; copy: su copia en la consolidación; generated: plantilla. */
  kind: 'authored' | 'copy' | 'generated';
}

/** Fila de `content_personas` (§13.2). `fictional` lo pone la base (siempre true). */
export interface PersonaRow {
  id: string;
  language_code: string;
  display_name: string;
  age: number;
  city: string;
  country: string;
  phone: string;
  email: string;
}

/** Fila de `learning_objectives` (§4.5). */
export interface ObjectiveRow {
  id: string;
  language_code: string;
  level: Level;
  cefr_activity: CefrActivity;
  can_do_es: string;
  description_es: string | null;
  cefr_ref: string | null;
  group_key: string | null;
  position: number;
  status: ObjectiveStatus;
}

export interface ObjectiveConceptRow {
  objective_id: string;
  concept_id: string;
  role: ObjectiveConceptRole;
  language_code: string;
}

export interface LessonObjectiveRow {
  lesson_id: string;
  objective_id: string;
  role: LessonObjectiveRole;
}

export interface ItemObjectiveRow {
  item_id: string;
  objective_id: string;
  language_code: string;
}

export interface Catalog {
  concepts: ConceptRow[];
  items: ItemRow[];
  item_concepts: ItemConceptRow[];
  /** Todas las ubicaciones del tramo: cada ejercicio tiene exactamente un ítem. */
  placements: Placement[];
  /** Lecciones del tramo (alcance de lesson_objectives al comparar la base con el contenido). */
  lessons: string[];
  /** Personas ficticias de los idiomas del tramo (content/personas.ts). */
  personas: PersonaRow[];
  /** Objetivos de los idiomas y niveles del tramo (content/objectives.ts) y sus relaciones. */
  objectives: ObjectiveRow[];
  objective_concepts: ObjectiveConceptRow[];
  /** Sólo las lecciones del tramo. */
  lesson_objectives: LessonObjectiveRow[];
  /** Sólo los ítems del tramo. */
  item_objectives: ItemObjectiveRow[];
}

/** Lecciones escritas a mano: las del camino y las «En contexto» (fase C). */
const isAuthoredLesson = (kind: string) => kind === 'lesson' || kind === 'context';

/**
 * Conceptos target de un ejercicio (§4.3): `concepts` si los declara (comprensión en contexto, que no
 * alimenta exercise_words) y si no, sus palabras.
 */
export const targetConceptsOf = (e: Pick<ExerciseDef, 'words' | 'concepts'>) =>
  e.concepts ?? e.words;

const contentKey = (e: ExerciseDef) => JSON.stringify([e.type, e.payload, e.answer]);

/** Id determinista de un ítem generado de una palabra (§5): `en.gen.translate_write.en-hello`. */
export const generatedItemId = (language: string, type: ExerciseType, wordId: string) =>
  `${language}.gen.${type}.${wordId}`;

/** Id de palabra: `<idioma>-<slug>`, sin `.` ni `+` (separadores de las plantillas). */
const WORD_ID = /^([a-z]{2,3})-[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Id determinista de un ítem generado de un conjunto de palabras (match_pairs de la consolidación):
 * `en.gen.match_pairs.set.en-a+en-b+en-c+en-d`. Las palabras se deduplican y se ordenan por código
 * de unidad UTF-16 (no por configuración regional), así que el orden de las parejas no cambia el id
 * y otro conjunto da otro id. Algoritmo y espacio de nombres: docs/LEARNING_CATALOG_PHASE1.md, §1.
 */
export function generatedSetItemId(
  language: string,
  type: ExerciseType,
  wordIds: readonly string[],
) {
  const set = [...new Set(wordIds)].sort();
  if (set.length < 2) throw new Error(`Un ítem de conjunto necesita 2 o más palabras (${type})`);
  for (const w of set) {
    const m = WORD_ID.exec(w);
    if (!m || m[1] !== language)
      throw new Error(`Palabra ${w} inválida para un ítem de ${language}`);
  }
  return `${language}.gen.${type}.set.${set.join('+')}`;
}

/**
 * Id de ítem de un ejercicio escrito (§5): el id actual congelado (por posición, `location`) o el
 * declarado en `ExerciseDef.id`: `<idioma>.ex.<14 [0-9a-z]>` para los nuevos, o un id por posición
 * ya publicado si el ejercicio se movió. content/ids.lock.json valida que esté registrado.
 */
function authoredItemId(e: ExerciseDef, language: string, location: string): string {
  if (e.id === undefined) return location;
  if (NEW_ID_PLACEHOLDER.test(e.id)) {
    throw new Error(`${location}: el id ${e.id} es un marcador. Corré npm run content:ids`);
  }
  const m = AUTHORED_ID.exec(e.id);
  if (m && m[1] !== language) throw new Error(`${location}: el id ${e.id} no es de ${language}`);
  if (!m && !LEGACY_AUTHORED_ID.test(e.id)) {
    throw new Error(
      `${location}: id ${e.id} inválido (tiene que ser ${language}.ex.<14 [0-9a-z]>)`,
    );
  }
  return e.id;
}

/** Conceptos, lecciones e ítems de un tramo con su idioma: alcance de `objectiveProblems`. */
export function objectiveScopeOf(
  path: readonly PathUnit[],
  catalog: Pick<Catalog, 'concepts' | 'items'> = buildCatalog(path),
): ObjectiveScope {
  return {
    concepts: new Map(catalog.concepts.map((c) => [c.id, c.language_code])),
    lessons: new Map(path.flatMap((p) => p.lessons.map((l) => [l.id, p.language] as const))),
    items: new Map(catalog.items.map((i) => [i.id, i.language_code])),
  };
}

/**
 * Catálogo de un tramo del currículo. Ítems escritos: su id (authoredItemId); las copias que la
 * consolidación hace de un ejercicio escrito (`unitPath`, set `used`) son ubicaciones del mismo
 * ítem. Ítems generados: plantilla tipo × palabra con el nivel de la palabra, o tipo × conjunto de
 * palabras (match_pairs) con el nivel más alto del conjunto.
 */
export function buildCatalog(
  path: readonly PathUnit[],
  personas: readonly PersonaDef[] = CONTENT_PERSONAS,
  objectives: readonly ObjectiveDef[] = LEARNING_OBJECTIVES,
): Catalog {
  const concepts: ConceptRow[] = path.flatMap(({ language, level, unit }) =>
    unit.words.map((w: WordDef) => ({ id: w.id, language_code: language, level })),
  );

  const items = new Map<string, ItemRow>();
  const targets = new Map<string, string[]>();
  const placements: Placement[] = [];
  /** Ítem escrito → su ejercicio escrito: un id no puede ser de dos ejercicios. */
  const authoredAt = new Map<string, string>();

  const add = (row: ItemRow, words: readonly string[]) => {
    const wordSet = [...new Set(words)].sort();
    const prev = items.get(row.id);
    if (prev) {
      if (
        JSON.stringify(prev) !== JSON.stringify(row) ||
        targets.get(row.id)!.join() !== wordSet.join()
      ) {
        throw new Error(`El ítem ${row.id} sale con dos definiciones distintas`);
      }
      return;
    }
    items.set(row.id, row);
    targets.set(row.id, wordSet);
  };

  // Palabras del tramo: el contenido nuevo todavía puede no estar en COURSES.
  const levelOf = new Map(WORD_LEVEL);
  const extraForms = new Map<string, Set<string>>();
  for (const { language, level, unit } of path) {
    for (const w of unit.words) {
      levelOf.set(w.id, level);
      const forms = extraForms.get(language) ?? new Set<string>();
      formsOf(w).forEach((x) => forms.add(x));
      extraForms.set(language, forms);
    }
  }
  const wordLevel = (exerciseId: string, wordId: string) => {
    const l = levelOf.get(wordId);
    if (!l) throw new Error(`${exerciseId}: palabra ${wordId} inexistente`);
    return l;
  };

  for (const { language, level, lessons } of path) {
    // Copia = mismo tipo, payload y respuesta que un ejercicio escrito de la unidad (§1, inventario:
    // 948). Casi todas son el mismo objeto reutilizado por unitPath; una coincide por contenido.
    const authored = new Map<string, string | null>();
    for (const l of lessons) {
      if (!isAuthoredLesson(l.kind)) continue;
      l.exercises.forEach((e, i) => {
        const location = pathExerciseId(l.id, lessonExerciseIndex(l, i));
        const itemId = authoredItemId(e, language, location);
        const other = authoredAt.get(itemId);
        if (other) throw new Error(`Id de ítem duplicado: ${itemId} en ${other} y en ${location}`);
        authoredAt.set(itemId, location);
        const key = contentKey(e);
        // Dos escritos iguales: una copia no sabría de cuál es (null = ambiguo).
        authored.set(key, authored.has(key) ? null : itemId);
      });
    }
    for (const l of lessons) {
      l.exercises.forEach((e, i) => {
        const exerciseId = pathExerciseId(l.id, lessonExerciseIndex(l, i));
        const authoredId = isAuthoredLesson(l.kind)
          ? authoredItemId(e, language, exerciseId)
          : authored.get(contentKey(e));
        if (authoredId === null)
          throw new Error(`${exerciseId} copia un ejercicio escrito repetido`);
        const cls = classifyExercise(e, language, extraForms.get(language), personas);
        const wordSet = [...new Set(targetConceptsOf(e))].sort();
        let row: ItemRow;
        let kind: Placement['kind'];
        if (authoredId) {
          row = {
            id: authoredId,
            language_code: language,
            level,
            origin: 'authored',
            type: e.type,
            ...cls,
          };
          kind = isAuthoredLesson(l.kind) ? 'authored' : 'copy';
        } else if (wordSet.length === 1) {
          const wordId = wordSet[0]!;
          row = {
            id: generatedItemId(language, e.type, wordId),
            language_code: language,
            level: wordLevel(exerciseId, wordId),
            origin: 'generated',
            type: e.type,
            ...cls,
          };
          kind = 'generated';
        } else if (e.type === 'match_pairs' && wordSet.length > 1) {
          // Nivel: el más alto de sus palabras. Un ítem que exige una palabra de A2 es trabajo de A2
          // (§13.5: level_scope = greatest(nivel del ítem, nivel activo)).
          const top = wordSet
            .map((w) => wordLevel(exerciseId, w))
            .reduce((a, b) => (LEVEL_POSITION[b] > LEVEL_POSITION[a] ? b : a));
          row = {
            id: generatedSetItemId(language, e.type, wordSet),
            language_code: language,
            level: top,
            origin: 'generated',
            type: e.type,
            ...cls,
          };
          kind = 'generated';
        } else {
          throw new Error(
            `${exerciseId}: ejercicio generado ${e.type} con ${wordSet.length} palabras sin plantilla de id`,
          );
        }
        add(row, wordSet);
        placements.push({ exercise_id: exerciseId, item_id: row.id, kind });
      });
    }
  }

  const itemRows = [...items.values()];
  const item_concepts: ItemConceptRow[] = itemRows.flatMap((item) =>
    targets.get(item.id)!.flatMap((concept) =>
      targetDimensions(item.assessment_mode).map((dimension) => ({
        item_id: item.id,
        concept_id: concept,
        dimension,
        role: 'target' as const,
        language_code: item.language_code,
      })),
    ),
  );

  const languages = new Set(path.map((p) => p.language));
  const levels = new Set(path.map((p) => `${p.language}|${p.level}`));
  const lessons = path.flatMap((p) => p.lessons.map((l) => l.id));
  const lessonLanguage = new Map(
    path.flatMap((p) => p.lessons.map((l) => [l.id, p.language] as const)),
  );

  const personaRows: PersonaRow[] = personas
    .filter((p) => languages.has(p.language))
    .map((p) => {
      const problems = personaProblems(p);
      if (problems.length) throw new Error(problems.join('; '));
      return {
        id: p.id,
        language_code: p.language,
        display_name: p.displayName,
        age: p.age,
        city: p.city,
        country: p.country,
        phone: p.phone,
        email: p.email,
      };
    });

  // Objetivos: validación propia de cada uno; las relaciones se validan contra el currículo completo
  // en los generadores (scripts/ids-lock-file.ts) y en las pruebas. Acá sólo se filtran al tramo.
  const inTranche = objectives.filter((o) => levels.has(`${o.language}|${o.level}`));
  const intrinsic = objectiveProblems(inTranche);
  if (intrinsic.length) throw new Error(intrinsic.join('; '));
  const itemLanguage = new Map(itemRows.map((i) => [i.id, i.language_code]));
  for (const o of inTranche) {
    for (const { lesson } of o.lessons) {
      const l = lessonLanguage.get(lesson);
      if (l && l !== o.language) throw new Error(`${o.id}: la lección ${lesson} es de ${l}`);
    }
    for (const item of o.items) {
      const l = itemLanguage.get(item);
      if (l && l !== o.language) throw new Error(`${o.id}: el ítem ${item} es de ${l}`);
    }
  }

  return {
    concepts,
    items: itemRows,
    item_concepts,
    placements,
    lessons,
    personas: personaRows,
    objectives: inTranche.map((o) => ({
      id: o.id,
      language_code: o.language,
      level: o.level,
      cefr_activity: o.cefrActivity,
      can_do_es: o.canDo,
      description_es: o.description ?? null,
      cefr_ref: o.cefrRef ?? null,
      group_key: o.groupKey ?? null,
      position: o.position,
      status: o.status,
    })),
    objective_concepts: inTranche.flatMap((o) =>
      o.concepts.map((c) => ({
        objective_id: o.id,
        concept_id: c.concept,
        role: c.role,
        language_code: o.language,
      })),
    ),
    lesson_objectives: inTranche.flatMap((o) =>
      o.lessons
        .filter((l) => lessonLanguage.has(l.lesson))
        .map((l) => ({ lesson_id: l.lesson, objective_id: o.id, role: l.role })),
    ),
    item_objectives: inTranche.flatMap((o) =>
      o.items
        .filter((i) => itemLanguage.has(i))
        .map((i) => ({ item_id: i, objective_id: o.id, language_code: o.language })),
    ),
  };
}

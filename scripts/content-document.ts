import { CURRICULUM_PATH, unitId, type PathUnit } from '../content';
import { buildCatalog } from '../content/catalog';
import { buildOptionSets } from '../content/option-sets';
import { buildVersions } from '../content/versions';
import type { ObjectiveDef } from '../content/objectives';
import type { PersonaDef } from '../content/personas';
import { lessonExerciseIndex, pathExerciseId } from '../content/path';

/** Definiciones del catálogo que no salen del camino: por defecto, las de content/. */
export interface CatalogDefs {
  personas?: readonly PersonaDef[];
  objectives?: readonly ObjectiveDef[];
  /**
   * Ítems con las opciones fuera de la versión (V5 (a)). Por defecto, content/variable-options.ts.
   * Sólo las pruebas con unidades de prueba pasan otra lista: los generadores usan siempre la
   * congelada.
   */
  variableOptions?: readonly string[];
}

/**
 * Contenido del currículo con la forma de las filas de la base. Lo usan los generadores de
 * migraciones (scripts/build-content-sql.ts, scripts/build-content-diff-sql.ts) y el test que
 * compara la base con content/. `catalog`: conceptos léxicos, ítems y sus conceptos, ubicaciones,
 * personas y objetivos (content/catalog.ts).
 */
export function contentRows(path: readonly PathUnit[] = CURRICULUM_PATH, defs: CatalogDefs = {}) {
  return {
    units: path.map(({ language, level, unit: u }) => ({
      id: unitId(language, level, u),
      language_code: language,
      level,
      position: u.position,
      title_es: u.title,
      title_en: u.titleEn,
      description_es: u.description,
      emoji: u.emoji,
      objective_es: u.objective ?? null,
      grammar: u.grammar ?? null,
      review_status: u.review?.status ?? 'draft',
    })),
    words: path.flatMap(({ language, level, unit: u }) =>
      u.words.map((w) => ({
        id: w.id,
        language_code: language,
        unit_id: unitId(language, level, u),
        text: w.text,
        translation_es: w.translation,
        accepted_translations: w.acceptedTranslations ?? [],
        ipa: w.ipa ?? null,
        romanization: w.romanization ?? null,
        emoji: w.emoji ?? null,
        example_en: w.exampleEn,
        example_es: w.exampleEs,
        difficulty: w.difficulty ?? 1,
        tags: w.tags,
      })),
    ),
    // Camino completo: lecciones escritas + consolidación generada (content/path.ts).
    lessons: path.flatMap(({ language, level, unit, lessons }) =>
      lessons.map((l) => ({
        id: l.id,
        unit_id: unitId(language, level, unit),
        position: l.position,
        title_es: l.title,
        objective_es: l.objective,
        intro: l.intro ?? null,
        takeaways: l.takeaways ?? [],
      })),
    ),
    exercises: path.flatMap(({ lessons }) =>
      lessons.flatMap((l) =>
        l.exercises.map((e, ei) => ({
          id: pathExerciseId(l.id, lessonExerciseIndex(l, ei)),
          lesson_id: l.id,
          position: lessonExerciseIndex(l, ei) + 1,
          type: e.type,
          skill: e.skill,
          prompt_es: e.prompt,
          payload: e.payload,
          answer: e.answer,
          accepted_answers: e.acceptedAnswers ?? [],
          explanation_es: e.explanation ?? null,
          difficulty: e.difficulty ?? 1,
          recommended_seconds: e.recommendedSeconds ?? 20,
          words: e.words,
        })),
      ),
    ),
    catalog: buildCatalog(path, defs.personas, defs.objectives),
  };
}

/**
 * Palabras con las que se arma el diccionario de lecturas de los conjuntos de opciones: las del
 * currículo completo de los idiomas del tramo más las del tramo (como la app, que usa todas las
 * palabras del idioma). Así el conjunto de una ubicación no depende de qué tramo se genere.
 */
function readingWords(path: readonly PathUnit[]) {
  const languages = new Set(path.map((p) => p.language));
  const all = [...CURRICULUM_PATH.filter((p) => languages.has(p.language)), ...path];
  const seen = new Set<string>();
  return all.flatMap(({ language, unit }) =>
    unit.words.flatMap((w) => {
      if (seen.has(w.id)) return [];
      seen.add(w.id);
      return [{ language_code: language, text: w.text, romanization: w.romanization ?? null }];
    }),
  );
}

/**
 * Documento completo: contenido, catálogo, versiones de los ítems (content/versions.ts) y conjuntos de
 * opciones (content/option-sets.ts) del tramo. Las versiones y los conjuntos salen de las filas de
 * `exercises` del documento: son su copia exacta.
 */
export function contentDocument(
  path: readonly PathUnit[] = CURRICULUM_PATH,
  defs: CatalogDefs = {},
) {
  const doc = contentRows(path, defs);
  const versions = buildVersions(doc.catalog, doc.exercises, defs.variableOptions);
  const optionSets = buildOptionSets(doc.catalog, doc.exercises, versions, readingWords(path));
  return { ...doc, versions, optionSets };
}

export type ContentDocument = ReturnType<typeof contentDocument>;

import { CURRICULUM_PATH, unitId, type PathUnit } from '../content';
import { pathExerciseId } from '../content/path';

/**
 * Contenido del currículo con la forma de las filas de la base. Lo usan los generadores de
 * migraciones (scripts/build-content-sql.ts, scripts/build-content-diff-sql.ts) y el test que
 * compara la base con content/.
 */
export function contentDocument(path: readonly PathUnit[] = CURRICULUM_PATH) {
  return {
    units: path.map(({ level, unit: u }) => ({
      id: unitId(level, u),
      level,
      position: u.position,
      title_es: u.title,
      title_en: u.titleEn,
      description_es: u.description,
      emoji: u.emoji,
    })),
    words: path.flatMap(({ level, unit: u }) =>
      u.words.map((w) => ({
        id: w.id,
        unit_id: unitId(level, u),
        text: w.text,
        translation_es: w.translation,
        accepted_translations: w.acceptedTranslations ?? [],
        ipa: w.ipa,
        emoji: w.emoji ?? null,
        example_en: w.exampleEn,
        example_es: w.exampleEs,
        difficulty: w.difficulty ?? 1,
        tags: w.tags,
      })),
    ),
    // Camino completo: lecciones escritas + consolidación generada (content/path.ts).
    lessons: path.flatMap(({ level, unit, lessons }) =>
      lessons.map((l) => ({
        id: l.id,
        unit_id: unitId(level, unit),
        position: l.position,
        title_es: l.title,
        objective_es: l.objective,
      })),
    ),
    exercises: path.flatMap(({ lessons }) =>
      lessons.flatMap((l) =>
        l.exercises.map((e, ei) => ({
          id: pathExerciseId(l.id, ei),
          lesson_id: l.id,
          position: ei + 1,
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
  };
}

export type ContentDocument = ReturnType<typeof contentDocument>;

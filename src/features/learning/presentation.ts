import type { GradedAttemptInput, LessonPresentation } from './api';
import type { PlayerState } from './player';

/**
 * Fase 2 (docs/LEARNING_ATTEMPTS_PHASE2.md): las presentaciones registradas por el servidor se usan
 * sólo si cubren exactamente los ejercicios cargados y con la misma versión de ítem. Si no (contenido
 * cambiado entre la lectura y el registro, o una respuesta incompleta), la lección se juega y se
 * guarda por la ruta vieja: nada se corrige con una versión distinta de la mostrada.
 */
export function matchPresentations(
  presentations: LessonPresentation[] | undefined,
  content: { exercises: { id: string }[]; versions: Record<string, number | null> } | undefined,
) {
  if (!presentations || !content) return null;
  const byExercise = new Map(presentations.map((p) => [p.exercise_id, p]));
  const covers =
    byExercise.size === content.exercises.length &&
    content.exercises.every((e) => {
      const p = byExercise.get(e.id);
      return p !== undefined && Number(p.item_version_id) === content.versions[e.id];
    });
  if (!covers) return null;
  const shownOptions: Record<string, readonly string[] | null> = {};
  for (const p of presentations) shownOptions[p.exercise_id] = p.options_shown;
  return { byExercise, shownOptions };
}

/** Intentos para la corrección del servidor (null si alguno no tiene la respuesta estructurada). */
export function toGradedAttempts(
  state: PlayerState,
  byExercise: Map<string, LessonPresentation>,
): GradedAttemptInput[] | undefined {
  const out: GradedAttemptInput[] = [];
  for (const a of state.attempts) {
    const p = byExercise.get(a.exerciseId);
    if (!p || !a.response) return undefined;
    out.push({
      presentationId: p.presentation_id,
      answer: a.response,
      clientVerdict: a.correct ? 'correct' : 'incorrect',
      responseMs: a.responseMs,
      ...(a.assists ? { assists: a.assists } : {}),
    });
  }
  return out;
}

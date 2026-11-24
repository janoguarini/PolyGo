// Ejercicios de prueba completos, como los carga content:sql: cada ubicación con su ítem, su versión
// vigente y, si es de elección, su conjunto de opciones (V8 y V8.1, migración
// 20261108140000_learning_versions_required.sql). Los hashes salen de las mismas funciones que usan
// los generadores (content/versions.ts, content/option-sets.ts), así los fixtures son válidos y no
// esquivan ninguna restricción.
//
// Todo va en un solo texto SQL: db.exec lo corre en una transacción y los triggers diferidos (versión
// vigente obligatoria, regla de §4.3, FK diferidas) se comprueban al confirmarla.
import { classifyExercise } from '../../content/catalog.ts';
import { OPTION_SET_FORMAT, isChoiceType, optionSetHash } from '../../content/option-sets.ts';
import { versionHash } from '../../content/versions.ts';
import { gradingSpecFor } from '../../shared/grading.ts';

const lit = (v) =>
  v === null || v === undefined ? 'null' : `'${String(v).replaceAll("'", "''")}'`;
const textArray = (a) => `array[${a.map(lit).join(', ')}]::text[]`;

/**
 * SQL de ejercicios escritos (`origin = 'authored'`) completos. `language` es el del curso de la
 * unidad (el del ítem); `level`, el de la unidad.
 *
 * @param {{ id: string, lesson_id: string, position: number, type: string, skill: string,
 *   prompt_es?: string, payload: object, answer: string, accepted_answers?: string[],
 *   explanation_es?: string | null, difficulty?: number, recommended_seconds?: number,
 *   is_published?: boolean, language: string, level: string }[]} rows
 */
export function exercisesFixtureSql(rows) {
  return rows
    .map((r) => {
      const content = {
        prompt_es: r.prompt_es ?? 'p',
        payload: r.payload,
        answer: r.answer,
        accepted_answers: r.accepted_answers ?? [],
        explanation_es: r.explanation_es ?? null,
        difficulty: r.difficulty ?? 1,
        recommended_seconds: r.recommended_seconds ?? 20,
      };
      const cls = classifyExercise({ type: r.type, answer: r.answer }, r.language);
      const spec = gradingSpecFor(r.type, cls.assessment_mode);
      const hash = versionHash(content, spec);
      const versionOf = `(select v.id from public.exercise_item_versions v
        where v.item_id = ${lit(r.id)} and v.content_hash = ${lit(hash)})`;
      let setSql = '';
      let setOf = 'null';
      if (isChoiceType(r.type)) {
        const set = {
          format: OPTION_SET_FORMAT,
          options: r.payload.options.map((text) => ({
            text,
            reading: null,
            audio: null,
            image: null,
          })),
          answer_index: r.payload.options.indexOf(r.answer),
        };
        const optionsHash = optionSetHash(set);
        setSql = `
  insert into public.exercise_option_sets (item_id, item_version_id, options_hash, format, options,
    answer_index, origin)
  values (${lit(r.id)}, ${versionOf}, ${lit(optionsHash)}, ${lit(set.format)},
    ${lit(JSON.stringify(set.options))}::jsonb, ${set.answer_index}, 'catalog');`;
        setOf = `(select s.id from public.exercise_option_sets s
          where s.item_version_id = ${versionOf} and s.options_hash = ${lit(optionsHash)})`;
      }
      return `
  insert into public.exercise_items (id, language_code, level, origin, type, assessment_mode,
    response_format, input_modality, response_privacy, status)
  values (${lit(r.id)}, ${lit(r.language)}, ${lit(r.level)}, 'authored', ${lit(r.type)},
    ${lit(cls.assessment_mode)}, ${lit(cls.response_format)}, ${lit(cls.input_modality)},
    ${lit(cls.response_privacy)}, 'active');
  insert into public.exercise_item_versions (item_id, version, content_hash, prompt_es, payload, answer,
    accepted_answers, explanation_es, difficulty, recommended_seconds, grading_spec)
  values (${lit(r.id)}, 1, ${lit(hash)}, ${lit(content.prompt_es)}, ${lit(JSON.stringify(content.payload))}::jsonb,
    ${lit(content.answer)}, ${textArray(content.accepted_answers)}, ${lit(content.explanation_es)},
    ${content.difficulty}, ${content.recommended_seconds}, ${lit(JSON.stringify(spec))}::jsonb);
  update public.exercise_items set current_version_id = ${versionOf} where id = ${lit(r.id)};${setSql}
  insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer,
    accepted_answers, explanation_es, difficulty, recommended_seconds, is_published,
    item_id, item_version_id, option_set_id)
  values (${lit(r.id)}, ${lit(r.lesson_id)}, ${r.position}, ${lit(r.type)}, ${lit(r.skill)},
    ${lit(content.prompt_es)}, ${lit(JSON.stringify(content.payload))}::jsonb, ${lit(content.answer)},
    ${textArray(content.accepted_answers)}, ${lit(content.explanation_es)}, ${content.difficulty},
    ${content.recommended_seconds}, ${r.is_published ?? true}, ${lit(r.id)}, ${versionOf}, ${setOf});`;
    })
    .join('\n');
}

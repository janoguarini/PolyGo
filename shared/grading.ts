import { verdictForText, type AnswerVerdict, type TextRules } from './answers';
import type { ExerciseType, UserAnswer } from './exercises';

/**
 * Cómo se corrige una versión de ítem (`exercise_item_versions.grading_spec`, arquitectura de datos
 * §5 y §8; decisiones V1, V2 y V7 de docs/EXERCISE_ITEM_VERSIONS_PENDING.md).
 *
 * `grading_spec` define el MÉTODO de corrección; no repite `answer`, `accepted_answers` ni lo que ya
 * está en `payload`: el corrector los lee de la versión. Tres modos:
 * - `exact_option`: la opción elegida es igual, carácter por carácter, a `answer` (por valor: las
 *   opciones se barajan al mostrarse).
 * - `normalized_text`: el texto (o las fichas unidas con un espacio) normalizado con el normalizador
 *   indicado es igual a `answer` o a una de `accepted_answers`; con `typo_tolerance`, además, la
 *   regla de tipeo del normalizador. El orden de las fichas cuenta.
 * - `pair_set`: el mismo conjunto de parejas que `payload.pairs`.
 *
 * `polygo.answers.v1` es el comportamiento de shared/answers.ts congelado (V2): CONTRACTIONS, las
 * equivalencias del chino y del pinyin, y el tipeo (distancia 1 desde 8 caracteres). Cambiar ese
 * comportamiento exige un normalizador nuevo (`polygo.answers.v2`), un esquema nuevo del modo y
 * pruebas de compatibilidad; las versiones ya publicadas conservan su veredicto.
 * shared/__tests__/grading.test.ts congela la huella de v1.
 *
 * `free_production` no tiene modo: queda bloqueado hasta que existan rúbricas editoriales (V1).
 */

export const NORMALIZER_V1 = 'polygo.answers.v1';

export type GradingSpec =
  | { mode: 'exact_option'; mode_version: 1 }
  | {
      mode: 'normalized_text';
      mode_version: 1;
      normalizer: typeof NORMALIZER_V1;
      typo_tolerance: boolean;
    }
  | { mode: 'pair_set'; mode_version: 1 };

export type GradingModeName = GradingSpec['mode'];

/** Subconjunto de JSON Schema (draft 2020-12) que usan los esquemas de los modos. */
export interface JsonSchema {
  $schema?: string;
  $id?: string;
  type?: 'object' | 'boolean' | 'integer' | 'string';
  const?: unknown;
  enum?: readonly unknown[];
  properties?: Record<string, JsonSchema>;
  required?: readonly string[];
  additionalProperties?: false;
}

export interface GradingModeDef {
  /** `<modo>.v<versión>`: clave de `ref_grading_modes`. */
  id: string;
  mode: GradingModeName;
  version: number;
  schema: JsonSchema;
}

const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

/**
 * Esquemas de `ref_grading_modes` (migración 20261108120000_learning_grading_modes.sql, que los
 * carga con este mismo texto; supabase/tests/versions.test.mjs lo comprueba). Un esquema usado por
 * una versión no se modifica nunca: un cambio es una fila nueva (`<modo>.v2`).
 */
export const GRADING_MODES: readonly GradingModeDef[] = [
  {
    id: 'exact_option.v1',
    mode: 'exact_option',
    version: 1,
    schema: {
      $schema: DRAFT,
      $id: 'polygo.grading.exact_option.v1',
      type: 'object',
      properties: { mode: { const: 'exact_option' }, mode_version: { const: 1 } },
      required: ['mode', 'mode_version'],
      additionalProperties: false,
    },
  },
  {
    id: 'normalized_text.v1',
    mode: 'normalized_text',
    version: 1,
    schema: {
      $schema: DRAFT,
      $id: 'polygo.grading.normalized_text.v1',
      type: 'object',
      properties: {
        mode: { const: 'normalized_text' },
        mode_version: { const: 1 },
        normalizer: { const: NORMALIZER_V1 },
        typo_tolerance: { type: 'boolean' },
      },
      required: ['mode', 'mode_version', 'normalizer', 'typo_tolerance'],
      additionalProperties: false,
    },
  },
  {
    id: 'pair_set.v1',
    mode: 'pair_set',
    version: 1,
    schema: {
      $schema: DRAFT,
      $id: 'polygo.grading.pair_set.v1',
      type: 'object',
      properties: { mode: { const: 'pair_set' }, mode_version: { const: 1 } },
      required: ['mode', 'mode_version'],
      additionalProperties: false,
    },
  },
];

/** Errores de `value` contra `schema` (sólo las palabras clave de JsonSchema). Vacío = válido. */
export function schemaProblems(schema: JsonSchema, value: unknown, at = '$'): string[] {
  const problems: string[] = [];
  if ('const' in schema && JSON.stringify(value) !== JSON.stringify(schema.const)) {
    problems.push(`${at}: debe ser ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some((v) => JSON.stringify(v) === JSON.stringify(value))) {
    problems.push(`${at}: fuera de ${JSON.stringify(schema.enum)}`);
  }
  switch (schema.type) {
    case 'object': {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        problems.push(`${at}: debe ser un objeto`);
        return problems;
      }
      const obj = value as Record<string, unknown>;
      for (const key of schema.required ?? []) {
        if (!(key in obj)) problems.push(`${at}.${key}: falta`);
      }
      for (const [key, v] of Object.entries(obj)) {
        const sub = schema.properties?.[key];
        if (sub) problems.push(...schemaProblems(sub, v, `${at}.${key}`));
        else if (schema.additionalProperties === false) problems.push(`${at}.${key}: no permitido`);
      }
      break;
    }
    case 'boolean':
      if (typeof value !== 'boolean') problems.push(`${at}: debe ser booleano`);
      break;
    case 'integer':
      if (!Number.isInteger(value)) problems.push(`${at}: debe ser entero`);
      break;
    case 'string':
      if (typeof value !== 'string') problems.push(`${at}: debe ser texto`);
      break;
  }
  return problems;
}

/** Problemas de un `grading_spec` contra el esquema de su modo y versión. */
export function gradingSpecProblems(spec: unknown): string[] {
  const s = spec as { mode?: unknown; mode_version?: unknown } | null;
  const def = GRADING_MODES.find((m) => s && m.mode === s.mode && m.version === s.mode_version);
  if (!def) return [`modo de corrección desconocido: ${JSON.stringify(spec)}`];
  return schemaProblems(def.schema, spec);
}

/** Id de `ref_grading_modes` de un spec (`exact_option.v1`). */
export const gradingModeId = (spec: GradingSpec) => `${spec.mode}.v${spec.mode_version}`;

/**
 * `grading_spec` de un tipo, igual a lo que hace hoy `checkAnswer` (V1):
 * opciones → exact_option; order_words y complete_word → normalized_text sin tipeo;
 * translate_write y short_answer → normalized_text con tipeo; match_pairs → pair_set.
 */
export function gradingSpecFor(type: ExerciseType, assessmentMode?: string): GradingSpec {
  if (assessmentMode === 'free_production') {
    throw new Error(
      'free_production no tiene grading_spec: bloqueado hasta las rúbricas editoriales',
    );
  }
  switch (type) {
    case 'image_choice':
    case 'translation_choice':
    case 'fill_blank':
    case 'listen_choice':
    case 'context_choice':
      return { mode: 'exact_option', mode_version: 1 };
    case 'order_words':
    case 'complete_word':
      return {
        mode: 'normalized_text',
        mode_version: 1,
        normalizer: NORMALIZER_V1,
        typo_tolerance: false,
      };
    case 'translate_write':
    case 'short_answer':
      return {
        mode: 'normalized_text',
        mode_version: 1,
        normalizer: NORMALIZER_V1,
        typo_tolerance: true,
      };
    case 'match_pairs':
      return { mode: 'pair_set', mode_version: 1 };
  }
}

/** Lo que el corrector lee de la versión. */
export interface GradedContent {
  answer: string;
  accepted_answers: readonly string[];
  payload: unknown;
}

/** Tipo de respuesta que acepta cada modo. Otro tipo es `invalid_response` (§9), no un veredicto. */
const KINDS: Record<GradingModeName, readonly UserAnswer['kind'][]> = {
  exact_option: ['option'],
  normalized_text: ['text', 'tokens'],
  pair_set: ['pairs'],
};

export class InvalidResponseError extends Error {}

/**
 * Corrige una respuesta con el `grading_spec` de la versión. Mismo veredicto que `checkAnswer` para
 * toda respuesta del tipo que corresponde al ejercicio (shared/__tests__/grading.test.ts y
 * content/__tests__/versions.test.ts lo comprueban con todas las versiones). Una respuesta de otro
 * tipo se rechaza antes de corregir (§9: `invalid_response`).
 */
export function gradeWithSpec(
  spec: GradingSpec,
  content: GradedContent,
  answer: UserAnswer,
  /** Reglas de la versión del corrector (learningSession.ts); sin ellas, las de la app. */
  rules?: TextRules,
): AnswerVerdict {
  const problems = gradingSpecProblems(spec);
  if (problems.length) throw new Error(`grading_spec inválido: ${problems.join('; ')}`);
  if (!KINDS[spec.mode].includes(answer.kind)) {
    throw new InvalidResponseError(`${spec.mode} no acepta respuestas ${answer.kind}`);
  }
  const display = content.answer;
  const verdict = (ok: boolean): AnswerVerdict =>
    ok ? { correct: true, typo: false, expected: display } : { correct: false, expected: display };

  switch (spec.mode) {
    case 'exact_option':
      return verdict(answer.kind === 'option' && answer.value === content.answer);

    case 'normalized_text': {
      const given =
        answer.kind === 'tokens'
          ? answer.value.join(' ')
          : answer.kind === 'text'
            ? answer.value
            : '';
      return verdictForText(
        given,
        [content.answer, ...content.accepted_answers],
        spec.typo_tolerance,
        rules,
      );
    }

    case 'pair_set': {
      const payload = content.payload as {
        type?: string;
        pairs?: { left: string; right: string }[];
      };
      if (payload?.type !== 'match_pairs' || !payload.pairs || answer.kind !== 'pairs') {
        return verdict(false);
      }
      const solution = new Map(payload.pairs.map((p) => [p.left, p.right]));
      return verdict(
        answer.value.length === solution.size &&
          answer.value.every((p) => solution.get(p.left) === p.right),
      );
    }
  }
}

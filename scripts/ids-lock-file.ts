import { CURRICULUM_PATH } from '../content';
import { buildCatalog, objectiveScopeOf, type Catalog } from '../content/catalog';
import { registryCatalog } from '../content/comprehension';
import { LEARNING_OBJECTIVES, objectiveProblems } from '../content/objectives';
import { CONTENT_PERSONAS, personaPrivacyProblems } from '../content/personas';
import { PRACTICE_SOURCES, practiceSourceProblems } from '../content/practice-sources';
import { INLINE_OPTION_ITEMS } from '../content/inline-option-items';
import { isChoiceType } from '../content/option-sets';
import { VARIABLE_OPTION_ITEMS } from '../content/variable-options';
import { contentDocument } from './content-document';
import { checkIdsLock } from '../content/ids-lock';
import { readIdsLock } from './ids-lock-io';

export { IDS_LOCK_FILE, readIdsLock, writeIdsLock } from './ids-lock-io';

/**
 * Lo que los generadores (content:sql, content:diff, content:catalog) exigen al currículo completo
 * antes de escribir una migración: el registro de ids (assertIdsLock), objetivos con relaciones
 * existentes y del mismo idioma, personas válidas y sin repetidos ni coincidencias con la lista de
 * exclusión, orígenes de práctica que cumplen G1, y versiones construibles en todo el currículo (un
 * contenido por ítem, sin contar payload.options en los de distractores variables, NFC y grading_spec
 * válido; content/versions.ts) y conjuntos de opciones construibles (content/option-sets.ts), porque
 * un tramo sólo ve sus propias ubicaciones.
 */
export function assertContentCatalog(catalog: Catalog = buildCatalog(CURRICULUM_PATH)) {
  // El registro cubre también las lecciones «En contexto» de la fase C (content/comprehension.ts).
  assertIdsLock(registryCatalog(catalog));
  contentDocument(CURRICULUM_PATH); // buildVersions y buildOptionSets fallan con el motivo
  for (const id of VARIABLE_OPTION_ITEMS) {
    if (!catalog.items.some((i) => i.id === id)) {
      throw new Error(`content/variable-options.ts: ${id} no es un ítem del currículo`);
    }
  }
  // Los generados de elección que conservan las opciones en su versión: ítems existentes, generados,
  // de elección y fuera de la lista de distractores variables.
  const variable = new Set(VARIABLE_OPTION_ITEMS);
  for (const id of INLINE_OPTION_ITEMS) {
    const item = catalog.items.find((i) => i.id === id);
    if (!item || item.origin !== 'generated' || !isChoiceType(item.type) || variable.has(id)) {
      throw new Error(
        `content/inline-option-items.ts: ${id} no es un ítem generado de elección del currículo fuera de content/variable-options.ts`,
      );
    }
  }
  const problems = [
    ...objectiveProblems(LEARNING_OBJECTIVES, objectiveScopeOf(CURRICULUM_PATH, catalog)),
    ...personaPrivacyProblems(CONTENT_PERSONAS),
    ...practiceSourceProblems(PRACTICE_SOURCES),
  ];
  if (problems.length) {
    throw new Error(`El catálogo no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
  }
}

export function assertIdsLock(catalog: Catalog = registryCatalog()) {
  const problems = checkIdsLock(catalog, readIdsLock());
  if (problems.length) {
    const shown = problems.slice(0, 30).map((p) => `- ${p.message}`);
    if (problems.length > 30) shown.push(`- … y ${problems.length - 30} más`);
    throw new Error(`Los ids de ítem no coinciden con content/ids.lock.json:\n${shown.join('\n')}`);
  }
}

/**
 * Personas ficticias del catálogo (arquitectura de datos rev. 8, §13.1–§13.2: `content_personas`).
 *
 * Un ejercicio de texto libre que pide datos de una persona (nombre, edad, ciudad, país, teléfono,
 * correo) tiene que citar una de estas personas con `ExerciseDef.personalData = { persona: id }`, y
 * entonces su privacidad es `fictional`. Ningún ejercicio puede pedir datos del propio usuario
 * (`personalData: 'learner'`, P4): el catálogo de ítems lo rechaza.
 *
 * Hay una sola, la huésped de U13 «En contexto» (fase C.2), citada por preguntas de opción
 * (`closed`). No se inventan personas para el backfill de la fase 1 (docs/LEARNING_CATALOG_PHASE1.md,
 * §4): §13.2 dice que esas respuestas se clasifican como `closed` u `open_text`. Los generadores cargan estas
 * personas en `content_personas` (migración 20261107180000_content_personas.sql, que valida id,
 * idioma, correo @example.com y `fictional = true`); `personaPrivacyProblems` valida además
 * repetidos y la lista de exclusión (§13.2), y content/__tests__/phase1.test.ts la usa con los
 * usuarios de prueba. Qué falta para cargar la primera persona: docs/LEARNING_CATALOG_PHASE1.md §10.
 */

export interface PersonaDef {
  /** `<idioma>.persona.<slug>` (p. ej. `en.persona.lucia-gomez`). */
  id: string;
  language: string;
  displayName: string;
  age: number;
  city: string;
  country: string;
  phone: string;
  /** Siempre en el dominio reservado `example.com`. */
  email: string;
}

export const CONTENT_PERSONAS: readonly PersonaDef[] = [
  /**
   * Fase C.2 (docs/LEARNING_PHASE_C.md §C2): la huésped de U13 «En contexto: registro en un hotel».
   * Inventada: nombre común sin figura pública asociada, teléfono del rango 555-01xx (reservado para
   * ficción en el plan de numeración norteamericano) y correo @example.com. Sus datos aparecen en la
   * ficha y el audio de esa lección; las preguntas son de opción (`closed`), así que ningún texto
   * libre la cita todavía. No se usa para los 13 candidatos `open_text` de la fase 1 (§10).
   */
  {
    id: 'en.persona.sofia-ruiz',
    language: 'en',
    displayName: 'Sofia Ruiz',
    age: 29,
    city: 'Puebla',
    country: 'Mexico',
    phone: '555-0142',
    email: 'sofia.ruiz@example.com',
  },
];

const PERSONA_ID = /^([a-z]{2,3})\.persona\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Problemas de una persona (vacío si es válida). */
export function personaProblems(p: PersonaDef): string[] {
  const problems: string[] = [];
  const m = PERSONA_ID.exec(p.id);
  if (!m) problems.push(`${p.id}: el id tiene que ser <idioma>.persona.<slug>`);
  else if (m[1] !== p.language) problems.push(`${p.id}: el prefijo no es el idioma ${p.language}`);
  if (!/^[a-z0-9._%+-]+@example\.com$/.test(p.email))
    problems.push(`${p.id}: el correo tiene que ser @example.com`);
  if (!Number.isInteger(p.age) || p.age <= 0) problems.push(`${p.id}: edad inválida`);
  for (const k of ['displayName', 'city', 'country', 'phone'] as const) {
    if (!p[k].trim()) problems.push(`${p.id}: falta ${k}`);
  }
  return problems;
}

/**
 * Figuras públicas que ninguna persona puede imitar (§13.2: «lista de exclusión»). Vacía: la lista
 * es editorial y no está escrita (docs/LEARNING_CATALOG_PHASE1.md, §10). Mientras no haya personas
 * no se necesita; antes de cargar la primera, hay que completarla.
 */
export const PUBLIC_FIGURE_EXCLUSIONS: readonly string[] = [];

const norm = (s: string) => s.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Problemas de privacidad de un conjunto de personas (§13.2), además de los de cada una
 * (`personaProblems`): ids, correos, teléfonos y nombres repetidos, y coincidencias con datos de
 * usuarios de prueba o con la lista de exclusión (nombre, correo o teléfono).
 */
export function personaPrivacyProblems(
  personas: readonly PersonaDef[],
  excluded: readonly string[] = PUBLIC_FIGURE_EXCLUSIONS,
): string[] {
  const problems = personas.flatMap(personaProblems);
  const blocked = new Set(excluded.map(norm));
  for (const field of ['id', 'email', 'phone', 'displayName'] as const) {
    const seen = new Map<string, string>();
    for (const p of personas) {
      const v = norm(p[field]);
      const other = seen.get(v);
      if (other) problems.push(`${p.id}: ${field} repetido con ${other}`);
      seen.set(v, p.id);
    }
  }
  for (const p of personas) {
    for (const field of ['displayName', 'email', 'phone'] as const) {
      if (blocked.has(norm(p[field])))
        problems.push(
          `${p.id}: ${field} coincide con la lista de exclusión o un usuario de prueba`,
        );
    }
  }
  return problems;
}

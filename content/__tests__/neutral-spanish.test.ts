import { voseoIn } from '../../shared/neutralSpanish';
import { snapshot } from '../../scripts/build-neutral-spanish-sql';

/**
 * Español neutro en todo el contenido de los cursos que se enseñan desde el español
 * (docs/NEUTRAL_SPANISH.md): consignas, explicaciones, títulos, objetivos, traducciones y ejemplos.
 *
 * Fuera del recorrido, a propósito:
 * - El curso de español para angloparlantes (tramo `es`): el español es el idioma que se enseña y el
 *   voseo aparece para enseñar a reconocerlo (content/es-checks.ts lo controla aparte).
 * - Las respuestas aceptadas (`accepted_translations`, `accepted_answers`, `acceptedTexts`): conservan
 *   las formas con voseo para que quien responde así siga acertando.
 * - Ids y texto del idioma que se enseña (no son español).
 */

/** Excepciones justificadas: dónde, qué texto y por qué. */
const EXCEPTIONS: { where: RegExp; text: RegExp; reason: string }[] = [
  {
    where: /^curriculum:/,
    text: /You sirve para tú, vos(,| y) usted/,
    reason:
      'Explica que «you» equivale a tú, vos y usted: nombra el pronombre como dato del idioma, no le habla de vos al usuario.',
  },
];

/** Claves con respuestas aceptadas: se dejan fuera (conservan el voseo a propósito). */
const ACCEPTED_KEYS = /(^|\.)(accepted_?[a-zA-Z]*|acceptedTexts)$/;

type Hit = string;

function scan(value: unknown, where: string, instruction: boolean, out: Hit[]) {
  if (typeof value === 'string') {
    const hits = voseoIn(value, { instruction });
    if (hits.length && !EXCEPTIONS.some((e) => e.where.test(where) && e.text.test(value)))
      out.push(`${where}: ${hits.map((h) => h.form).join(', ')} — «${value.slice(0, 120)}»`);
  } else if (Array.isArray(value)) value.forEach((v) => scan(v, where, instruction, out));
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) {
      if (ACCEPTED_KEYS.test(k)) continue;
      // Dentro de un payload, las traducciones y ejemplos no son instrucciones.
      const sub = /^(translation|source|base|options|pairs|right|left|examples|target)$/.test(k)
        ? false
        : instruction;
      scan(v, `${where}.${k}`, sub, out);
    }
}

describe('español neutro en el contenido de los cursos', () => {
  const snap = snapshot();

  it('consignas, explicaciones, títulos, objetivos, traducciones y ejemplos sin voseo', () => {
    const problems: Hit[] = [];
    let texts = 0;
    for (const [tranche, doc] of Object.entries(snap)) {
      if (tranche === 'es') continue;
      for (const u of doc.units) {
        texts++;
        scan(
          {
            title_es: u.title_es,
            description_es: u.description_es,
            objective_es: u.objective_es,
            grammar: u.grammar,
          },
          `${tranche}:${u.id}`,
          true,
          problems,
        );
      }
      for (const l of doc.lessons) {
        texts++;
        scan(
          {
            title_es: l.title_es,
            objective_es: l.objective_es,
            intro: l.intro,
            takeaways: l.takeaways,
          },
          `${tranche}:${l.id}`,
          true,
          problems,
        );
      }
      for (const w of doc.words) {
        texts++;
        scan(
          { translation: w.translation_es, example: w.example_es },
          `${tranche}:${w.id}`,
          false,
          problems,
        );
      }
      for (const e of doc.exercises) {
        texts++;
        scan(
          { prompt_es: e.prompt_es, explanation_es: e.explanation_es },
          `${tranche}:${e.id}`,
          true,
          problems,
        );
        scan(e.payload, `${tranche}:${e.id}.payload`, false, problems);
      }
      for (const o of doc.catalog.objectives)
        scan(o.can_do_es, `${tranche}:${o.id}`, true, problems);
    }
    expect(texts).toBeGreaterThan(15000);
    expect([...new Set(problems)]).toEqual([]);
  });

  it('cada excepción sigue haciendo falta (si el texto cambió, se borra)', () => {
    for (const e of EXCEPTIONS) {
      const used = Object.entries(snap).some(
        ([t, d]) =>
          e.where.test(`${t}:`) && JSON.stringify([d.lessons, d.exercises]).match(e.text) !== null,
      );
      expect([e.reason, used]).toEqual([e.reason, true]);
    }
  });
});

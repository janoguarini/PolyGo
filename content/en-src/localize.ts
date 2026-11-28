import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { flatEnglish, type FlatUnit } from './flat';
import { buildCatalog, supportId } from './strings';
import { mapSupport } from './support';

/**
 * Curso localizado (docs/EN_MULTI_SOURCE.md §2): el inglés A1–B1 aplanado con la capa de apoyo
 * reemplazada por las traducciones de content/en-src/<idioma>/<unidad>.json, más sus problemas.
 */

export const EN_SOURCES = ['pt', 'it', 'fr'] as const;
export type EnSource = (typeof EN_SOURCES)[number];

export interface UnitTranslation {
  unit: string;
  strings: Record<string, string>;
  accepted?: Record<string, string[]>;
  notes?: string;
}

const dirOf = (source: EnSource) => join(__dirname, source);

export function readTranslation(source: EnSource, unit: string): UnitTranslation | undefined {
  const file = join(dirOf(source), `${unit}.json`);
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as UnitTranslation) : undefined;
}

/** Restos del español que no existen en el idioma de apoyo (heurística, por idioma). */
// Palabra entera: sin letras ni guion al lado (en portugués «inventá-los» es correcto).
const words = (list: string) => new RegExp(`[ñ¿¡]|(?<![-\\p{L}])(${list})(?![-\\p{L}])`, 'iu');
const SPANISH: Record<EnSource, RegExp> = {
  pt: words('y|el|los|las|usted|ustedes|tú|muy|pero|también|hola|gracias|puedes|usas|dices|hay'),
  it: words('y|el|los|las|usted|ustedes|tú|muy|pero|también|hola|gracias|puedes|usas|dices|hay|está'),
  // En francés «y» existe (il y a).
  fr: words('el|los|las|usted|ustedes|tú|muy|pero|también|hola|gracias|puedes|usas|dices|hay|está'),
};

/** Quita lo que está en inglés citado (*…*, “…”, «…») para no confundirlo con español. */
const unquoted = (s: string) => s.replace(/\*[^*]*\*|“[^”]*”|«[^»]*»|"[^"]*"/g, ' ');

export interface Localized {
  units: FlatUnit[];
  problems: string[];
  /** Unidades sin archivo de traducción todavía. */
  missing: string[];
}

export function localize(source: EnSource, only?: readonly string[]): Localized {
  const catalogs = new Map(buildCatalog().map((c) => [c.unit, c]));
  // Cada texto se traduce en la unidad donde aparece primero; las demás lo reusan.
  const all = new Map<string, string>();
  const problems: string[] = [];
  const missing: string[] = [];
  for (const [unit, catalog] of catalogs) {
    const t = readTranslation(source, unit);
    if (!t) {
      missing.push(unit);
      continue;
    }
    if (t.unit !== unit) problems.push(`${unit}: el archivo dice unit=${t.unit}`);
    const ids = new Set(catalog.strings.map((s) => s.id));
    for (const s of catalog.strings) {
      const v = t.strings[s.id];
      // Una variante aceptada que sólo existe en español (chau, vos) puede quedar vacía: se descarta.
      const dropOk = s.kinds.every((k) => k === 'word.accepted');
      if (v === '' && dropOk) {
        all.set(s.id, '');
        continue;
      }
      if (typeof v !== 'string' || !v.trim()) {
        problems.push(`${unit} ${s.id}: falta la traducción de «${s.es}»`);
        continue;
      }
      if (SPANISH[source].test(unquoted(v)) && v !== s.es)
        problems.push(`${unit} ${s.id}: ¿queda español? «${v}»`);
      all.set(s.id, v);
    }
    for (const id of Object.keys(t.strings))
      if (!ids.has(id)) problems.push(`${unit} ${id}: id que no está en el catálogo`);
  }

  const units = flatEnglish()
    .filter((u) => !missing.includes(u.source) && (!only || only.includes(u.source)))
    .map((u) => {
      const accepted = readTranslation(source, u.source)?.accepted ?? {};
      const unit = mapSupport(u.unit, (text) => all.get(supportId(text)) ?? text);
      unit.words = unit.words.map((w) => {
        const extra = accepted[w.text] ?? [];
        const list = [...new Set([...(w.acceptedTranslations ?? []), ...extra])].filter(
          (x) => x !== '' && x !== w.translation,
        );
        return list.length ? { ...w, acceptedTranslations: list } : { ...w, acceptedTranslations: undefined };
      });
      for (const [i, l] of unit.lessons.entries()) {
        for (const [j, e] of l.exercises.entries()) {
          const where = `${u.source} L${i + 1} E${j + 1} (${e.type})`;
          const p = e.payload;
          const options = 'options' in p ? p.options : [];
          if (new Set(options).size !== options.length)
            problems.push(`${where}: opciones repetidas tras traducir: ${options.join(' / ')}`);
          if (p.type === 'match_pairs') {
            const rights = p.pairs.map((x) => x.right);
            if (new Set(rights).size !== rights.length)
              problems.push(`${where}: pares repetidos tras traducir: ${rights.join(' / ')}`);
          }
        }
      }
      return { ...u, unit };
    });
  return { units, problems, missing };
}

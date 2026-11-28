import { createHash } from 'node:crypto';

import type { ContextStimulus } from '../../shared/exercises';
import { flatEnglish, type FlatUnit } from './flat';
import { mapSupport, type SupportKind } from './support';
import { enWritingTasks, mapWritingSupport } from './writing';

/**
 * Catálogo de textos a localizar (docs/EN_MULTI_SOURCE.md §4): cada texto de apoyo único del inglés
 * desde español, con un id estable (hash del texto), qué es y el inglés al que acompaña. Cada texto se
 * asigna a la primera unidad donde aparece: el traductor trabaja unidad por unidad, en orden.
 *
 * Las traducciones viven en content/en-src/<idioma>/<unidad>.json como `{ id: texto }`.
 */

export const supportId = (text: string) =>
  createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 10);

export interface CatalogString {
  id: string;
  es: string;
  kinds: SupportKind[];
  /** El inglés que acompaña al texto (o el id del estímulo, en comprensión). */
  en?: string;
}

export interface UnitCatalog {
  unit: string;
  level: string;
  titleEn: string;
  strings: CatalogString[];
  /** Estímulos de comprensión de la unidad, para leer las preguntas en contexto. */
  stimuli: Record<string, { setting: string; lines: string[] }>;
}

function stimuliOf(u: FlatUnit) {
  const out: UnitCatalog['stimuli'] = {};
  for (const l of u.unit.lessons) {
    for (const e of l.exercises) {
      if (e.payload.type !== 'context_choice') continue;
      const s: ContextStimulus = e.payload.stimulus;
      out[s.id] = {
        setting: s.setting,
        lines: s.kind === 'listening' ? s.lines.map((l) => `${l.speaker}: ${l.text}`) : s.lines,
      };
    }
  }
  return out;
}

export function buildCatalog(): UnitCatalog[] {
  const seen = new Map<string, CatalogString>();
  const catalogs = flatEnglish().map((u) => {
    const strings: CatalogString[] = [];
    const add = (text: string, kind: SupportKind, context?: string) => {
      const id = supportId(text);
      const prev = seen.get(id);
      if (prev) {
        if (prev.es !== text) throw new Error(`colisión de hash: «${prev.es}» / «${text}»`);
        if (!prev.kinds.includes(kind)) prev.kinds.push(kind);
        return text;
      }
      const entry: CatalogString = { id, es: text, kinds: [kind], ...(context ? { en: context } : {}) };
      seen.set(id, entry);
      strings.push(entry);
      return text;
    };
    mapSupport(u.unit, add);
    for (const task of enWritingTasks().filter((t) => t.unit === u.source)) {
      mapWritingSupport(task.task, add);
    }
    return {
      unit: u.source,
      level: u.level,
      titleEn: u.unit.titleEn,
      strings,
      stimuli: stimuliOf(u),
    };
  });
  return catalogs;
}

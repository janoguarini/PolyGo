import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

import { __setInterfaceLanguageForTests, getStrings, type StringsDef } from '..';

/**
 * Todos los textos de la interfaz (docs/MULTILINGUAL_ONBOARDING_PLAN.md §3.3): los archivos
 * `src/i18n/screens/*.ts` y cada `strings.ts` dentro de `src/`. TypeScript ya exige la misma forma; esto
 * lo comprueba en ejecución (claves, tipos y aridad) y busca restos de español en el inglés.
 */

const SRC = join(__dirname, '../..');

function stringFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === '__tests__') continue;
      stringFiles(full, out);
    } else if (
      name === 'strings.ts' ||
      (full.includes(join('i18n', 'screens')) && name.endsWith('.ts'))
    ) {
      out.push(full);
    }
  }
  return out;
}

const isDef = (v: unknown): v is StringsDef<unknown> =>
  typeof v === 'object' && v !== null && 'es' in v && 'en' in v && Object.keys(v).length === 2;

/** Lo que delata español en un texto en inglés. Los nombres propios (Español) se permiten aparte. */
const SPANISH = /[¿¡ñ]|\b(el|los|las|para|tu|tus|que|con|una|del|está|más|también|acá|tocá|elegí|ganá|jugá)\b/i;
const ALLOWED_IN_EN = [/Español/, /\bTu\b(?= nombre)/];

function compare(es: unknown, en: unknown, path: string, problems: string[]) {
  if (typeof es !== typeof en) {
    problems.push(`${path}: tipo distinto (${typeof es} / ${typeof en})`);
    return;
  }
  if (typeof es === 'function') {
    const fn = en as (...a: unknown[]) => unknown;
    if ((es as (...a: unknown[]) => unknown).length !== fn.length)
      problems.push(`${path}: aridad distinta`);
    return;
  }
  if (typeof es === 'string') {
    if (!(en as string).trim()) problems.push(`${path}: vacío en inglés`);
    const cleaned = ALLOWED_IN_EN.reduce((s, re) => s.replace(re, ''), en as string);
    if (SPANISH.test(cleaned)) problems.push(`${path}: parece español: «${en as string}»`);
    return;
  }
  if (Array.isArray(es)) {
    if (!Array.isArray(en) || en.length !== es.length) problems.push(`${path}: lista distinta`);
    else es.forEach((x, i) => compare(x, (en as unknown[])[i], `${path}[${i}]`, problems));
    return;
  }
  if (es && typeof es === 'object') {
    const a = Object.keys(es).sort();
    const b = Object.keys(en as object).sort();
    if (a.join() !== b.join()) problems.push(`${path}: claves distintas`);
    for (const k of a)
      compare(
        (es as Record<string, unknown>)[k],
        (en as Record<string, unknown>)[k],
        `${path}.${k}`,
        problems,
      );
  }
}

describe('textos de la interfaz', () => {
  const files = stringFiles(SRC);

  it('hay al menos un archivo de textos', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('el inglés tiene la misma forma que el español y no deja restos en español', () => {
    const problems: string[] = [];
    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require(file) as Record<string, unknown>;
      const defs = Object.entries(mod).filter(([, v]) => isDef(v));
      if (!defs.length) problems.push(`${relative(SRC, file)}: no exporta defineStrings`);
      for (const [name, def] of defs) {
        const d = def as StringsDef<unknown>;
        compare(d.es, d.en, `${relative(SRC, file)}:${name}`, problems);
      }
    }
    expect(problems).toEqual([]);
  });

  it('getStrings sigue el idioma actual', () => {
    const def = { es: { a: 'hola' }, en: { a: 'hello' } };
    __setInterfaceLanguageForTests('en');
    expect(getStrings(def).a).toBe('hello');
    __setInterfaceLanguageForTests('es');
    expect(getStrings(def).a).toBe('hola');
  });
});

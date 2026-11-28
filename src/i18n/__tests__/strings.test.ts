import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

import {
  INTERFACE_LANGUAGES,
  __setInterfaceLanguageForTests,
  getStrings,
  pick,
  stringsFor,
  type InterfaceLanguage,
  type StringsDef,
} from '..';

/**
 * Todos los textos de la interfaz (docs/MULTILINGUAL_ONBOARDING_PLAN.md §3.3): los archivos
 * `src/i18n/screens/*.ts` y cada `strings.ts` / `*Strings.ts` dentro de `src/`. TypeScript ya exige la
 * misma forma; esto lo comprueba en ejecución (claves, tipos, largo de listas y aridad) para los cinco
 * idiomas, y busca restos de español en en, pt-BR, it y fr, también en lo que devuelven las funciones.
 */

const SRC = join(__dirname, '../..');
const TARGETS = INTERFACE_LANGUAGES.filter((l) => l !== 'es');

function stringFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === '__tests__') continue;
      stringFiles(full, out);
    } else if (
      name === 'strings.ts' ||
      /^[a-z][A-Za-z]*Strings\.ts$/.test(name) ||
      (full.includes(join('i18n', 'screens')) && name.endsWith('.ts'))
    ) {
      out.push(full);
    }
  }
  return out;
}

const isDef = (v: unknown): v is StringsDef<unknown> =>
  typeof v === 'object' &&
  v !== null &&
  INTERFACE_LANGUAGES.every((l) => l in v) &&
  Object.keys(v).length === INTERFACE_LANGUAGES.length;

/**
 * Lo que delata español en cada idioma. Portugués, italiano y francés comparten muchas palabras con
 * el español («para», «que», «una», «del», «está»; en francés «que», «tu», «y», «es»), así que sólo
 * cuentan las que no existen en ese idioma.
 */
const VOSEO =
  'querés|tenés|podés|sabés|tocá|elegí|ganá|jugá|probá|revisá|seguí|volvé|hacé|abrí|actualizá|desafiá|aprendé|competí|subí|acá|vos';
/** «vos» también es un posesivo francés: para fr queda fuera del voseo. */
const VOSEO_FR = VOSEO.replace(/\|vos$/, '');
const SPANISH: Record<Exclude<InterfaceLanguage, 'es'>, RegExp> = {
  en: new RegExp(
    `[¿¡ñ]|\\b(el|los|las|para|tu|tus|que|con|una|del|está|más|también|${VOSEO})\\b`,
    'i',
  ),
  'pt-BR': new RegExp(
    // (?<!-): los pronombres pegados del portugués («treiná-las») no son el artículo español.
    `[¿¡ñ]|(?<!-)\\b(el|los|las|del|una|unos|unas|y|más|también|ahora|todavía|hoy|aquí|${VOSEO})\\b`,
    'i',
  ),
  it: new RegExp(
    `[¿¡ñ]|(?<!-)\\b(el|los|las|unos|unas|y|más|también|está|ahora|todavía|hoy|aquí|${VOSEO})\\b`,
    'i',
  ),
  // Sin «y», «que», «tu», «es», «con» ni «vos», que también son francés («il y a», «tu es», «vos amis»).
  // Límites con letras acentuadas: \b no las ve, y «réel» o «hélas» no son «el» ni «las».
  fr: new RegExp(
    `[¿¡ñ]|(?<![\\wÀ-ÿœ’'-])(el|los|las|del|una|unos|unas|para|más|también|está|ahora|todavía|hoy|aquí|${VOSEO_FR})(?![\\wÀ-ÿœ])`,
    'i',
  ),
};
/** Nombres propios en su propia lengua (selector de idioma, países). */
const ALLOWED = [/Español/g, /\bTu\b(?= nombre)/g, /Polygo|PolyGo/g];

const SAMPLE_ARGS: unknown[][] = [
  [2, 2, 2, 2, 2],
  ['Zed', 'Zed', 'Zed', 'Zed', 'Zed'],
  [1, 1, 1, 1, 1],
];

function checkText(
  lang: Exclude<InterfaceLanguage, 'es'>,
  text: string,
  path: string,
  problems: string[],
) {
  if (!text.trim()) problems.push(`${path}: vacío en ${lang}`);
  const cleaned = ALLOWED.reduce((s, re) => s.replace(re, ''), text);
  if (SPANISH[lang].test(cleaned)) problems.push(`${path}: parece español en ${lang}: «${text}»`);
}

function compare(
  lang: Exclude<InterfaceLanguage, 'es'>,
  es: unknown,
  other: unknown,
  path: string,
  problems: string[],
) {
  if (typeof es !== typeof other) {
    problems.push(`${path}: tipo distinto en ${lang} (${typeof es} / ${typeof other})`);
    return;
  }
  if (typeof es === 'function') {
    const fn = other as (...a: unknown[]) => unknown;
    if ((es as (...a: unknown[]) => unknown).length !== fn.length)
      problems.push(`${path}: aridad distinta en ${lang}`);
    // Lo que devuelve la función con argumentos de prueba también tiene que estar traducido.
    for (const args of SAMPLE_ARGS) {
      let out: unknown;
      let base: unknown;
      try {
        out = fn(...args);
        base = (es as (...a: unknown[]) => unknown)(...args);
      } catch {
        continue;
      }
      // Si el español también da vacío (p. ej. un nivel desconocido), no es un texto faltante.
      if (typeof base === 'string' && !base.trim()) continue;
      if (typeof out === 'string') checkText(lang, out, `${path}(${args[0]})`, problems);
    }
    return;
  }
  if (typeof es === 'string') {
    checkText(lang, other as string, path, problems);
    return;
  }
  if (Array.isArray(es)) {
    if (!Array.isArray(other) || other.length !== es.length)
      problems.push(`${path}: lista distinta en ${lang}`);
    else es.forEach((x, i) => compare(lang, x, (other as unknown[])[i], `${path}[${i}]`, problems));
    return;
  }
  if (es && typeof es === 'object') {
    const a = Object.keys(es).sort();
    const b = Object.keys(other as object).sort();
    if (a.join() !== b.join()) problems.push(`${path}: claves distintas en ${lang}`);
    for (const k of a)
      compare(
        lang,
        (es as Record<string, unknown>)[k],
        (other as Record<string, unknown>)[k],
        `${path}.${k}`,
        problems,
      );
  }
}

/** Hojas (textos y funciones) de un idioma. */
function leaves(v: unknown): number {
  if (typeof v === 'string' || typeof v === 'function') return 1;
  if (Array.isArray(v)) return v.reduce((n: number, x) => n + leaves(x), 0);
  if (v && typeof v === 'object')
    return Object.values(v).reduce((n: number, x) => n + leaves(x), 0);
  return 0;
}

function loadDefs() {
  const defs: { file: string; name: string; def: StringsDef<unknown> }[] = [];
  const missing: string[] = [];
  for (const file of stringFiles(SRC)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(file) as Record<string, unknown>;
    const found = Object.entries(mod).filter(([, v]) => isDef(v));
    if (!found.length) missing.push(relative(SRC, file));
    for (const [name, def] of found)
      defs.push({ file: relative(SRC, file), name, def: def as StringsDef<unknown> });
  }
  return { defs, missing };
}

describe('textos de la interfaz', () => {
  const { defs, missing } = loadDefs();

  it('hay archivos de textos y todos exportan defineStrings con los cinco idiomas', () => {
    expect(defs.length).toBeGreaterThan(80);
    expect(missing).toEqual([]);
  });

  it.each(TARGETS)('%s tiene la misma forma que el español y no deja restos en español', (lang) => {
    const problems: string[] = [];
    for (const { file, name, def } of defs)
      compare(lang, def.es, def[lang], `${file}:${name}`, problems);
    expect(problems).toEqual([]);
  });

  it('cobertura: cada idioma tiene tantas entradas como el español (100 %)', () => {
    const total = (lang: InterfaceLanguage) => defs.reduce((n, d) => n + leaves(d.def[lang]), 0);
    const es = total('es');
    expect(es).toBeGreaterThan(1800);
    for (const lang of TARGETS)
      expect({ lang, entries: total(lang) }).toEqual({ lang, entries: es });
  });

  it('las interpolaciones conservan los valores', () => {
    // Las funciones de cada idioma reciben y muestran los mismos datos (un número de prueba).
    const problems: string[] = [];
    const walk = (es: unknown, other: unknown, path: string, lang: string) => {
      if (typeof es === 'function' && typeof other === 'function') {
        let a: unknown;
        let b: unknown;
        try {
          a = (es as (...x: unknown[]) => unknown)(7357, 7357, 7357, 7357, 7357);
          b = (other as (...x: unknown[]) => unknown)(7357, 7357, 7357, 7357, 7357);
        } catch {
          return;
        }
        if (typeof a === 'string' && typeof b === 'string') {
          const uses = (s: string) => /7[.,\s]?357/.test(s);
          if (uses(a) !== uses(b)) problems.push(`${path} (${lang})`);
        }
        return;
      }
      if (es && typeof es === 'object' && other && typeof other === 'object')
        for (const k of Object.keys(es))
          walk(
            (es as Record<string, unknown>)[k],
            (other as Record<string, unknown>)[k],
            `${path}.${k}`,
            lang,
          );
    };
    for (const { file, name, def } of defs)
      for (const lang of TARGETS) walk(def.es, def[lang], `${file}:${name}`, lang);
    expect(problems).toEqual([]);
  });

  it('getStrings sigue el idioma actual', () => {
    const def = {
      es: { a: 'hola' },
      en: { a: 'hello' },
      'pt-BR': { a: 'olá' },
      it: { a: 'ciao' },
      fr: { a: 'salut' },
    };
    for (const [lang, text] of [
      ['en', 'hello'],
      ['pt-BR', 'olá'],
      ['it', 'ciao'],
      ['fr', 'salut'],
      ['es', 'hola'],
    ] as const) {
      __setInterfaceLanguageForTests(lang);
      expect(getStrings(def).a).toBe(text);
    }
  });

  it('stringsFor y pick caen en español sólo si falta el idioma (objeto armado a mano)', () => {
    const partial = { es: { a: 'hola' }, en: { a: 'hello' } } as unknown as StringsDef<{
      a: string;
    }>;
    expect(stringsFor(partial, 'it').a).toBe('hola');
    expect(stringsFor(partial, 'fr').a).toBe('hola');
    expect(stringsFor(partial, 'en').a).toBe('hello');
    expect(pick('pt-BR', { es: 1, en: 2, 'pt-BR': 3, it: 4, fr: 5 })).toBe(3);
    expect(pick('it', { es: 1, en: 2, 'pt-BR': 3, it: 4, fr: 5 })).toBe(4);
    expect(pick('fr', { es: 1, en: 2, 'pt-BR': 3, it: 4, fr: 5 })).toBe(5);
  });
});

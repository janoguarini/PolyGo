import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

import { ACHIEVEMENT_FAMILIES, achievementRows } from '@shared/achievements';
import { voseoIn } from '@shared/neutralSpanish';

import { challengeMessage } from '../../../supabase/functions/notify-battle-invite/message';
import { type StringsDef } from '..';

/**
 * Español neutro en todo el texto visible de la app (docs/NEUTRAL_SPANISH.md): catálogos (`es`),
 * textos compartidos con la base, widgets, configuración nativa y el aviso de desafío. El contenido de
 * los cursos lo recorre content/__tests__/neutral-spanish.test.ts.
 *
 * Excepciones: sólo las de EXCEPTIONS, cada una con su motivo.
 */

const ROOT = join(__dirname, '../../..');
const SRC = join(ROOT, 'src');

const EXCEPTIONS: { where: RegExp; text: RegExp; reason: string }[] = [
  // (vacío a propósito: si aparece una forma que no es voseo, se corrige el detector con su motivo)
];

const allowed = (where: string, text: string) =>
  EXCEPTIONS.some((e) => e.where.test(where) && e.text.test(text));

function walk(dir: string, test: (f: string) => boolean, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === '__tests__') continue;
      walk(full, test, out);
    } else if (test(full)) out.push(full);
  }
  return out;
}

/** Textos de un valor del catálogo: strings y lo que devuelven las funciones con datos de prueba. */
function texts(v: unknown, path: string, out: [string, string][] = []): [string, string][] {
  if (typeof v === 'string') out.push([path, v]);
  else if (typeof v === 'function') {
    for (const args of [
      [2, 2, 2, 2, 2],
      [1, 1, 1, 1, 1],
      ['Zed', 'Zed', 'Zed', 'Zed', 'Zed'],
    ]) {
      try {
        const r = (v as (...a: unknown[]) => unknown)(...args);
        if (typeof r === 'string') out.push([`${path}(${args[0]})`, r]);
      } catch {
        // Funciones que necesitan objetos: sus textos fijos los cubre el recorrido de literales.
      }
    }
  } else if (Array.isArray(v)) v.forEach((x, i) => texts(x, `${path}[${i}]`, out));
  else if (v && typeof v === 'object')
    for (const [k, x] of Object.entries(v)) texts(x, `${path}.${k}`, out);
  return out;
}

const problems = (list: [string, string][]) =>
  list.flatMap(([where, text]) =>
    voseoIn(text).length && !allowed(where, text)
      ? [
          `${where}: ${voseoIn(text)
            .map((h) => h.form)
            .join(', ')} — «${text.slice(0, 120)}»`,
        ]
      : [],
  );

/** Literales de texto de un archivo de código (comillas y plantillas), sin comentarios. */
function literals(file: string): [string, string][] {
  const src = readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  const out: [string, string][] = [];
  const re =
    /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`|>([^<>{}]*[\p{L}][^<>{}]*)</gu;
  for (const m of src.matchAll(re)) {
    const text = m[1] ?? m[2] ?? m[3] ?? m[4] ?? '';
    const line = src.slice(0, m.index).split('\n').length;
    out.push([`${relative(ROOT, file)}:${line}`, text]);
  }
  return out;
}

describe('español neutro en la interfaz', () => {
  it('los bloques `es` de todos los catálogos', () => {
    const files = walk(
      SRC,
      (f) =>
        /[\\/]strings\.ts$/.test(f) ||
        /[\\/][a-z][A-Za-z]*Strings\.ts$/.test(f) ||
        (f.includes(join('i18n', 'screens')) && f.endsWith('.ts')),
    );
    const list: [string, string][] = [];
    for (const f of files) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require(f) as Record<string, unknown>;
      for (const [name, def] of Object.entries(mod)) {
        if (!def || typeof def !== 'object' || !('es' in def) || !('it' in def)) continue;
        texts((def as StringsDef<unknown>).es, `${relative(ROOT, f)}:${name}.es`, list);
      }
    }
    expect(list.length).toBeGreaterThan(1800);
    expect(problems(list)).toEqual([]);
  });

  it('los textos fijos en español del código (pantallas, componentes, widgets)', () => {
    const files = walk(
      SRC,
      (f) => /\.tsx?$/.test(f) && !/[\\/]i18n[\\/]/.test(f) && !/strings\.ts$|Strings\.ts$/.test(f),
    );
    expect(problems(files.flatMap(literals))).toEqual([]);
  });

  it('los textos de shared/ que también guarda la base o ve el usuario', () => {
    const shared = [
      'achievements',
      'missions',
      'referrals',
      'friendChallenges',
      'cosmetics',
      'profile',
    ].map((n) => join(ROOT, 'shared', `${n}.ts`));
    expect(problems(shared.flatMap(literals))).toEqual([]);
    const rows = achievementRows().map((r): [string, string] => [r.id, r.description_es]);
    expect(rows.length).toBeGreaterThan(50);
    expect(problems(rows)).toEqual([]);
    expect(
      problems(ACHIEVEMENT_FAMILIES.map((f): [string, string] => [f.metric, f.title])),
    ).toEqual([]);
  });

  it('el aviso de desafío en español, en todas sus variantes', () => {
    const list: [string, string][] = [];
    for (const h2h of [
      null,
      { host_wins: 1, invitee_wins: 2 },
      { host_wins: 2, invitee_wins: 1 },
      { host_wins: 1, invitee_wins: 1 },
    ])
      for (const pick of [0, 1] as const) {
        const m = challengeMessage({ host: 'x', interfaceLanguage: 'es', h2h }, pick);
        list.push(
          [`challenge.${m.variant}.title`, m.title],
          [`challenge.${m.variant}.body`, m.body],
        );
      }
    expect(problems(list)).toEqual([]);
  });

  it('la configuración nativa en español (app.json y locales/es.json)', () => {
    const strings = (v: unknown, path: string, out: [string, string][] = []) => {
      if (typeof v === 'string') out.push([path, v]);
      else if (v && typeof v === 'object')
        for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
      return out;
    };
    const app = JSON.parse(readFileSync(join(ROOT, 'app.json'), 'utf8'));
    const es = JSON.parse(readFileSync(join(ROOT, 'locales', 'es.json'), 'utf8'));
    expect(problems([...strings(app, 'app.json'), ...strings(es, 'locales/es.json')])).toEqual([]);
  });
});

describe('el detector', () => {
  it.each([
    ['Podés jugar cuando quieras', ['Podés']],
    ['Tocá para seguir', ['Tocá']],
    ['¿Y vos?', ['vos']],
    ['Elegí una opción', ['Elegí']],
    ['Tocala y listo', ['Tocala']],
    ['Fijate en el acento', ['Fijate']],
    ['Mantené apretado', ['Mantené']],
  ])('marca «%s»', (text, forms) => {
    expect(voseoIn(text).map((h) => h.form)).toEqual(forms);
  });

  it.each([
    'Puedes jugar cuando quieras',
    'Ya elegí mi curso.',
    'Ayer compré pan y llegué tarde.',
    'Está en inglés, francés y portugués.',
    'Será mañana; mamá tomó café.',
    'Estás al día. Después lo verás.',
    'Olá! Perché non vieni?',
    'Aquí tienes tu racha.',
  ])('no marca «%s»', (text) => {
    expect(voseoIn(text)).toEqual([]);
  });
});

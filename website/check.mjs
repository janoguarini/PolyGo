// Revisa website/dist después del build (node website/check.mjs):
// - cada página tiene el <html lang> de su carpeta, su canonical y, si existe en varios idiomas,
//   los hreflang de todas las versiones (+ x-default) y recíprocos;
// - todos los enlaces internos (href/src) llevan a un archivo que existe en dist, y los #ancla a un id;
// - el sitemap lista todas las páginas (salvo la 404) y nada que no exista;
// - en francés, espacio fino/duro antes de ? ! : ; y dentro de « » (no un espacio común).
// Sale con código 1 si encuentra algún problema.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LOCALES } from './i18n.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const config = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
const siteUrl = (process.env.SITE_URL || config.siteUrl).replace(/\/+$/, '');
const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);
const storePlaceholders = new Set();

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(dist).map((p) => relative(dist, p).split('\\').join('/'));
const htmlFiles = files.filter((f) => f.endsWith('.html'));

/** Ruta pública de un archivo: «pt/index.html» → «/pt/», «pt/termos.html» → «/pt/termos». */
const urlPath = (file) => `/${file.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}`;
/** Archivo de dist para una ruta pública, o null si no existe. */
function fileFor(path) {
  const clean = decodeURIComponent(path.replace(/^\/+/, ''));
  for (const candidate of [clean, `${clean}.html`, `${clean.replace(/\/?$/, '/')}index.html`]) {
    if (candidate && files.includes(candidate.replace(/^\//, '')))
      return candidate.replace(/^\//, '');
  }
  if (clean === '') return files.includes('index.html') ? 'index.html' : null;
  return null;
}

const pages = new Map(htmlFiles.map((f) => [f, readFileSync(join(dist, f), 'utf8')]));
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const localeOf = (file) => LOCALES.find((l) => l.dir && file.startsWith(`${l.dir}/`)) ?? LOCALES[0];

for (const [file, html] of pages) {
  const path = urlPath(file);
  const locale = localeOf(file);
  const is404 = file === '404.html';
  const isBlog = file.startsWith('blog/');

  // Idioma y canonical.
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  if (!isBlog && lang !== locale.lang)
    fail(file, `<html lang="${lang}"> y se esperaba "${locale.lang}"`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!is404 && canonical !== `${siteUrl}${path}`)
    fail(file, `canonical ${canonical} ≠ ${siteUrl}${path}`);
  if (html.includes('[completar:')) fail(file, 'tiene un dato sin completar ([completar: …])');

  // hreflang: todas las versiones + x-default, y cada una apunta de vuelta a esta.
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
    (m) => [m[1], m[2]],
  );
  if (!is404 && !isBlog) {
    const langs = alts.map(([l]) => l);
    for (const l of [...LOCALES.map((x) => x.lang), 'x-default']) {
      if (langs.filter((x) => x === l).length !== 1)
        fail(file, `hreflang "${l}" aparece ${langs.filter((x) => x === l).length} veces`);
    }
    if (!alts.some(([l, href]) => l === locale.lang && href === `${siteUrl}${path}`))
      fail(file, 'falta el hreflang propio');
    for (const [l, href] of alts) {
      const target = fileFor(href.slice(siteUrl.length));
      if (!target) fail(file, `hreflang ${l} → ${href} no existe`);
      else if (!pages.get(target).includes(`href="${siteUrl}${path}"`))
        fail(file, `hreflang ${l} → ${href} no apunta de vuelta`);
    }
  }

  // Enlaces internos.
  const ids = idsOf(html);
  for (const [tag, attr, raw] of html.matchAll(/\s(href|src)="([^"]+)"[^>]*/g)) {
    // Botón de tienda sin enlace (el build ya avisa «Falta el enlace de …»): se cuenta aparte.
    if (raw === '#descargar' && tag.includes('data-store=')) {
      storePlaceholders.add(file);
      continue;
    }
    let ref = raw.replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    if (/^https?:\/\//.test(ref)) {
      if (!ref.startsWith(`${siteUrl}/`) && ref !== siteUrl) continue;
      ref = ref.slice(siteUrl.length) || '/';
    }
    const [pathPart, hash] = ref.split('#');
    const resolved = pathPart === '' ? path : new URL(pathPart, `https://x${path}`).pathname;
    const target = resolved === path && pathPart === '' ? file : fileFor(resolved.split('?')[0]);
    if (!target) {
      fail(file, `${attr}="${raw}" no existe en dist`);
      continue;
    }
    if (
      hash &&
      target.endsWith('.html') &&
      !(target === file ? ids : idsOf(pages.get(target))).has(hash)
    ) {
      fail(file, `${attr}="${raw}": no hay id="${hash}" en ${target}`);
    }
  }

  // Tipografía francesa: nada de espacio común antes de ? ! : ; ni dentro de « ».
  if (locale.code === 'fr') {
    const text = html
      .replace(/<(script|style)[\s\S]*?<\/\1>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/https?:\/\/\S+/g, '');
    for (const m of text.matchAll(/[^\s\u00a0\u202f(]( [?!:;]|« | »)/g))
      fail(file, `espacio común en «${m[0]}» (usar &nbsp;)`);
    const attrs = [...html.matchAll(/\s(?:content|alt|aria-label|title)="([^"]*)"/g)]
      .map((m) => m[1])
      .join('\n');
    for (const m of attrs.matchAll(/[^\s\u00a0\u202f]( [?!:;]|« | »)/g))
      fail(file, `atributo con espacio común en «${m[0]}»`);
  }
}

// Sitemap: todas las páginas, y sólo páginas que existen.
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs)
  if (!fileFor(loc.slice(siteUrl.length))) fail('sitemap.xml', `${loc} no existe`);
for (const file of htmlFiles) {
  if (file === '404.html') continue;
  if (!locs.includes(`${siteUrl}${urlPath(file)}`))
    fail('sitemap.xml', `falta ${siteUrl}${urlPath(file)}`);
}
for (const [, href] of sitemap.matchAll(/<xhtml:link [^>]*href="([^"]+)"/g)) {
  if (!fileFor(href.slice(siteUrl.length))) fail('sitemap.xml', `alternate ${href} no existe`);
}

if (!existsSync(join(dist, 'index.html'))) fail('dist', 'no hay index.html: ¿corriste el build?');
for (const p of problems) console.error(`✗ ${p}`);
if (storePlaceholders.size) {
  console.warn(
    `⚠ ${storePlaceholders.size} página(s) con el botón de una tienda sin enlace todavía (site.config.json)`,
  );
}
console.log(
  problems.length
    ? `${problems.length} problema(s) en ${pages.size} páginas`
    : `✓ ${pages.size} páginas: lang, canonical, hreflang, enlaces internos y sitemap en orden`,
);
process.exit(problems.length ? 1 : 0);

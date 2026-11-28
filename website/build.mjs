// Arma el sitio estático de PolyGo (website/dist) sin dependencias: sólo Node.
//   node website/build.mjs
// Configuración en website/site.config.json; cada campo se puede pisar con una variable de entorno
// (SITE_URL, APP_STORE_URL, PLAY_STORE_URL, CONTACT_EMAIL, OWNER_NAME), útil para que Netlify y
// GitHub Pages publiquen cada uno con su dirección.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { HEAD_EXTRA, indexJsonLd, indexSource, llmsTxt, loadPosts, postJsonLd, postSource } from './blog.mjs';
import { LOCALES, PAGE_META, pageFile, pagePath } from './i18n.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const out = join(root, 'dist');

const file = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
const config = {
  ...file,
  siteUrl: (process.env.SITE_URL || file.siteUrl).replace(/\/+$/, ''),
  appStoreUrl: process.env.APP_STORE_URL || file.appStoreUrl,
  playStoreUrl: process.env.PLAY_STORE_URL || file.playStoreUrl,
  contactEmail: process.env.CONTACT_EMAIL || file.contactEmail,
  ownerName: process.env.OWNER_NAME || file.ownerName,
  // false hasta tener el dominio definitivo: los buscadores no indexan la dirección provisoria.
  indexable: file.indexable !== false,
};

/** Páginas del sitio: archivo fuente, ruta pública, título y descripción (SEO). */
const PAGES = [
  {
    key: 'home',
    file: 'index.html',
    path: '/',
    title: 'PolyGo · Aprende idiomas jugando y compite en vivo',
    description:
      'Aprende inglés, italiano, portugués, francés y chino jugando: lecciones cortas, repaso inteligente y partidas 1 contra 1 de 60 segundos con ELO y rangos. Gratis en iPhone y Android.',
    priority: '1.0',
  },
  {
    key: 'privacy',
    file: 'privacidad.html',
    path: '/privacidad',
    title: 'Política de privacidad · PolyGo',
    description: 'Qué datos guarda PolyGo, para qué los usa y cómo borrar tu cuenta.',
    priority: '0.3',
  },
  {
    key: 'delete',
    file: 'borrar-cuenta.html',
    path: '/borrar-cuenta',
    title: 'Borrar tu cuenta · PolyGo',
    description: 'Cómo eliminar tu cuenta de PolyGo y todos tus datos, desde la app o por email.',
    priority: '0.3',
  },
  {
    key: 'terms',
    file: 'terminos.html',
    path: '/terminos',
    title: 'Términos y condiciones · PolyGo',
    description:
      'Las reglas de uso de PolyGo: tu cuenta, juego limpio, Ranked, Polys, la suscripción PolyGo Plus y cómo cancelarla.',
    priority: '0.3',
  },
  {
    key: 'support',
    file: 'soporte.html',
    path: '/soporte',
    title: 'Soporte · PolyGo',
    description:
      'Ayuda con PolyGo: contacto, contraseña, cancelar o restaurar PolyGo Plus, reembolsos y cómo borrar tu cuenta.',
    priority: '0.4',
  },
];

// Traducciones (pt-BR, it, fr): las mismas páginas, en /pt/, /it/ y /fr/ (website/i18n.mjs).
const ES = LOCALES[0];
for (const page of PAGES) page.locale = ES;
const ES_PAGES = PAGES.filter((p) => p.key);
for (const locale of LOCALES.slice(1)) {
  for (const es of ES_PAGES) {
    const meta = PAGE_META[locale.code][es.key];
    PAGES.push({
      key: es.key,
      locale,
      file: pageFile(locale, es.key),
      path: pagePath(locale, es.key),
      title: meta.title,
      description: meta.description,
      priority: es.priority,
    });
  }
}

// Blog (sólo en español): índice y un artículo por entrada de src/blog/posts.json.
const POSTS = loadPosts(src);
PAGES.push({
  out: 'blog/index.html',
  source: indexSource(POSTS),
  path: '/blog/',
  title: 'Blog de PolyGo · Guías para aprender idiomas',
  description:
    'Guías para aprender inglés, italiano, portugués, francés y chino mandarín: vocabulario, pronunciación, frases clave, métodos de estudio y cómo practicar compitiendo.',
  priority: '0.8',
  base: '/',
  headExtra: HEAD_EXTRA,
  blogIndex: true,
});
for (const post of POSTS) {
  PAGES.push({
    out: `blog/${post.slug}.html`,
    source: postSource(post, POSTS),
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    priority: '0.7',
    lastmod: post.updated || post.date,
    base: '/',
    headExtra: `${HEAD_EXTRA}\n    <meta name="keywords" content="${post.keywords.join(', ')}" />\n    <meta property="article:published_time" content="${post.date}" />`,
    post,
  });
}

const warnings = [];
const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Datos que la política necesita: si faltan, se ve un aviso en la página y en la consola. */
function required(key, label, locale = ES) {
  if (config[key] && key === 'contactEmail') {
    return `<a href="mailto:${escape(config[key])}">${escape(config[key])}</a>`;
  }
  // Fechas traducidas: «privacyUpdatedLocalized»: { "pt-BR": "…" } en site.config.json.
  if (locale !== ES && key === 'privacyUpdated') {
    const value = config.privacyUpdatedLocalized?.[locale.code];
    if (value) return escape(value);
    warnings.push(`Falta "privacyUpdatedLocalized.${locale.code}" (${label}) en website/site.config.json`);
    return `<mark>[completar: ${label}]</mark>`;
  }
  if (config[key]) return escape(config[key]);
  warnings.push(`Falta "${key}" (${label}) en website/site.config.json`);
  return `<mark>[completar: ${label}]</mark>`;
}

const APPLE_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.8-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>';
const PLAY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#00C3FF" d="M3.6 2.2 13.6 12 3.6 21.8c-.3-.3-.4-.8-.4-1.3V3.5c0-.5.1-1 .4-1.3z"/><path fill="#00E676" d="M3.6 2.2c.4-.4 1-.4 1.7 0l11.6 6.6-3.3 3.2z"/><path fill="#FF3D57" d="M3.6 21.8c.4.4 1 .4 1.7 0l11.6-6.6-3.3-3.2z"/><path fill="#FFD500" d="m16.9 8.8 3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2.1-3.3-3.2z"/></svg>';

function storeButton(url, store, icon, small, big) {
  const inner = `${icon}<span><small>${small}</small><strong>${big}</strong></span>`;
  if (url) {
    return `<a class="store" href="${escape(url)}" rel="noopener" data-store="${store}">${inner}</a>`;
  }
  // Sin enlace configurado: el botón igual se ve (lleva a la sección de descarga) y el build avisa.
  warnings.push(`Falta el enlace de ${big} (site.config.json)`);
  return `<a class="store" href="#descargar" data-store="${store}">${inner}</a>`;
}

// Botón de Instagram de las portadas traducidas (la española lo tiene escrito en su HTML).
const INSTAGRAM_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>';
const instagramHtml = (locale) =>
  `<a class="store store-ig" href="https://www.instagram.com/polygo.idiomas/" target="_blank" rel="noopener" aria-label="${locale.t.instagramAria}">${INSTAGRAM_ICON}<span><small>${locale.t.instagramSmall}</small><strong>Instagram</strong></span></a>`;

const storesHtml = (locale) =>
  `<div class="stores">${storeButton(config.appStoreUrl, 'ios', APPLE_ICON, locale.t.appStoreSmall, 'App Store')}${storeButton(config.playStoreUrl, 'android', PLAY_ICON, locale.t.playSmall, 'Google Play')}</div>`;

/** Texto plano de un fragmento HTML (para los datos estructurados): sin etiquetas ni entidades. */
const textOf = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&amp;/g, '&')
    .trim();

function jsonLd(page) {
  const scripts = (docs) =>
    docs.map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`).join('\n    ');
  if (page.post) return scripts(postJsonLd(page.post, config.siteUrl));
  if (page.blogIndex) return scripts(indexJsonLd(POSTS, config.siteUrl));
  if (page.key !== 'home') return '';
  const faq = [...readFileSync(join(src, page.file), 'utf8').matchAll(
    /<details class="faq-item">\s*<summary>(.*?)<\/summary>\s*<p>(.*?)<\/p>/gs,
  )].map(([, q, a]) => ({
    '@type': 'Question',
    name: textOf(q),
    acceptedAnswer: { '@type': 'Answer', text: textOf(a) },
  }));
  const app = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'PolyGo',
    operatingSystem: 'iOS, Android',
    applicationCategory: 'EducationalApplication',
    inLanguage: page.locale.lang,
    description: page.description,
    url: `${config.siteUrl}${page.path}`,
    image: `${config.siteUrl}/assets/img/og.png`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    sameAs: ['https://www.instagram.com/polygo.idiomas/', config.appStoreUrl, config.playStoreUrl].filter(Boolean),
  };
  const faqPage = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq };
  return [app, faqPage]
    .map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`)
    .join('\n    ');
}

/** Enlace relativo de la página «from» a la ruta «to» (así anda también bajo /PolyGo/ en GitHub Pages). */
function relHref(from, to) {
  const a = from.slice(0, from.lastIndexOf('/') + 1).split('/').filter(Boolean);
  const b = to.split('/').filter(Boolean);
  const toIsDir = to.endsWith('/');
  let i = 0;
  while (i < a.length && i < b.length - (toIsDir ? 0 : 1) && a[i] === b[i]) i++;
  const rel = '../'.repeat(a.length - i) + b.slice(i).join('/') + (toIsDir && b.length > i ? '/' : '');
  return rel || './';
}

/** Versiones de la misma página en cada idioma (para hreflang, el selector y el sitemap). */
const alternatesOf = (page) => (page.key ? PAGES.filter((p) => p.key === page.key) : []);

function render(page) {
  const locale = page.locale ?? ES;
  const partial = (name) => readFileSync(join(src, 'partials', `${name}.html`), 'utf8');
  const canonical = `${config.siteUrl}${page.path === '/' ? '/' : page.path}`;
  // La 404 se sirve en cualquier ruta: enlaces absolutos. El resto, relativos (GitHub Pages usa /PolyGo/).
  const fixedBase = page.base ?? (page.file === '404.html' ? `${config.siteUrl}/` : null);
  const base = fixedBase ?? '../'.repeat(page.path.split('/').length - 2);
  // Enlace a otra página del sitio: con base fija (404, blog) desde la raíz; si no, relativo a la página.
  const link = (to) => (fixedBase != null ? `${fixedBase}${to.slice(1) || './'}` : relHref(page.path, to));
  const alternates = alternatesOf(page);
  const hreflang = alternates.length
    ? [
        ...alternates.map((p) => `<link rel="alternate" hreflang="${p.locale.lang}" href="${config.siteUrl}${p.path}" />`),
        `<link rel="alternate" hreflang="x-default" href="${config.siteUrl}${alternates[0].path}" />`,
        ...alternates
          .filter((p) => p !== page)
          .map((p) => `<meta property="og:locale:alternate" content="${p.locale.ogLocale}" />`),
      ]
        .map((tag) => `\n    ${tag}`)
        .join('')
    : '';
  // Selector de idioma: la misma página en otro idioma o, si no existe (blog, 404), su portada.
  const langSwitch = LOCALES.map((l) => {
    const target = alternates.find((p) => p.locale === l)?.path ?? pagePath(l, 'home');
    const current = l === locale && alternates.length > 0;
    return `<a href="${link(target)}" hreflang="${l.lang}" lang="${l.lang}"${current ? ' aria-current="page"' : ''}>${l.name}</a>`;
  }).join('\n          ');
  const t = Object.fromEntries(Object.entries(locale.t).map(([k, v]) => [`t.${k}`, v]));
  const vars = {
    ...t,
    lang: locale.lang,
    ogLocale: locale.ogLocale,
    hreflang,
    langSwitch,
    home: link(pagePath(locale, 'home')),
    privacyUrl: link(pagePath(locale, 'privacy')),
    termsUrl: link(pagePath(locale, 'terms')),
    supportUrl: link(pagePath(locale, 'support')),
    deleteUrl: link(pagePath(locale, 'delete')),
    country: escape(config.countryLocalized?.[locale.code] ?? config.country),
    title: escape(page.title),
    description: escape(page.description),
    canonical,
    siteUrl: config.siteUrl,
    year: String(new Date().getFullYear()),
    jsonLd: jsonLd(page),
    stores: storesHtml(locale),
    instagram: instagramHtml(locale),
    base,
    headExtra: page.headExtra ?? '',
    robots: config.indexable ? '' : '<meta name="robots" content="noindex, nofollow" />',
  };
  let html = page.source ?? readFileSync(join(src, page.file), 'utf8');
  html = html.replace(/\{\{> (\w+)\}\}/g, (_, name) => partial(name));
  html = html.replace(/\{\{> (\w+)\}\}/g, (_, name) => partial(name));
  html = html.replace(/\{\{required:(\w+):([^}]+)\}\}/g, (_, key, label) => required(key, label, locale));
  html = html.replace(/\{\{([\w.]+)\}\}/g, (m, key) => {
    if (key in vars) return vars[key];
    if (key in config) return escape(config[key]);
    throw new Error(`${page.file ?? page.out}: variable desconocida ${m}`);
  });
  return html;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(src, 'assets'), join(out, 'assets'), { recursive: true });

mkdirSync(join(out, 'blog'), { recursive: true });
for (const locale of LOCALES) if (locale.dir) mkdirSync(join(out, locale.dir), { recursive: true });
for (const page of PAGES) writeFileSync(join(out, page.out ?? page.file), render(page));
if (existsSync(join(src, '404.html'))) {
  writeFileSync(join(out, '404.html'), render({ ...PAGES[0], key: undefined, file: '404.html', path: '/404', title: 'Página no encontrada · PolyGo' }));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${PAGES.map((p) => {
    // Páginas con versión en otros idiomas: cada URL lista todas (hreflang), como pide Google.
    const alternates = alternatesOf(p);
    const links = alternates.length
      ? [...alternates.map((a) => [a.locale.lang, a.path]), ['x-default', alternates[0].path]]
          .map(([lang, path]) => `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${config.siteUrl}${path}"/>`)
          .join('')
      : '';
    return `  <url><loc>${config.siteUrl}${p.path}</loc>${links}${links ? '\n    ' : ''}<lastmod>${p.lastmod ?? today}</lastmod><priority>${p.priority}</priority></url>`;
  }).join('\n')}\n</urlset>\n`,
);
writeFileSync(
  join(out, 'robots.txt'),
  config.indexable
    ? // Buscadores y asistentes de IA (ChatGPT, Claude, Perplexity, Gemini) pueden leer todo.
      `${['*', 'Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']
        .map((ua) => `User-agent: ${ua}\nAllow: /`)
        .join('\n\n')}\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`
    : // Se deja rastrear para que vean el noindex de cada página.
      'User-agent: *\nAllow: /\n',
);
// Resumen para asistentes de IA (llmstxt.org).
writeFileSync(join(out, 'llms.txt'), llmsTxt(POSTS, config.siteUrl));
// AdMob: app-ads.txt en la raíz del dominio de desarrollador declarado en las tiendas.
if (existsSync(join(src, 'app-ads.txt'))) cpSync(join(src, 'app-ads.txt'), join(out, 'app-ads.txt'));
// GitHub Pages: no procesar con Jekyll.
writeFileSync(join(out, '.nojekyll'), '');
// GitHub Pages con dominio propio: el archivo CNAME dice cuál (no aplica a *.github.io ni a Netlify).
const host = new URL(config.siteUrl).hostname;
if (!host.endsWith('.github.io') && !host.endsWith('.netlify.app')) {
  writeFileSync(join(out, 'CNAME'), `${host}\n`);
}

for (const w of [...new Set(warnings)]) console.warn(`⚠ ${w}`);
console.log(`Sitio listo en ${out} (${PAGES.length} páginas) para ${config.siteUrl}${config.indexable ? '' : ' · sin indexar (noindex)'}`);

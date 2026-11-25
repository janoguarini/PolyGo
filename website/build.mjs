// Arma el sitio estático de Polygo (website/dist) sin dependencias: sólo Node.
//   node website/build.mjs
// Configuración en website/site.config.json; cada campo se puede pisar con una variable de entorno
// (SITE_URL, APP_STORE_URL, PLAY_STORE_URL, CONTACT_EMAIL, OWNER_NAME), útil para que Netlify y
// GitHub Pages publiquen cada uno con su dirección.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { HEAD_EXTRA, indexJsonLd, indexSource, llmsTxt, loadPosts, postJsonLd, postSource } from './blog.mjs';

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
    file: 'index.html',
    path: '/',
    title: 'Polygo · Aprendé idiomas jugando y competí en vivo',
    description:
      'Aprendé inglés, italiano, portugués, francés y chino jugando: lecciones cortas, repaso inteligente y partidas 1 contra 1 de 60 segundos con ELO y rangos. Gratis en iPhone y Android.',
    priority: '1.0',
  },
  {
    file: 'privacidad.html',
    path: '/privacidad',
    title: 'Política de privacidad · Polygo',
    description: 'Qué datos guarda Polygo, para qué los usa y cómo borrar tu cuenta.',
    priority: '0.3',
  },
  {
    file: 'borrar-cuenta.html',
    path: '/borrar-cuenta',
    title: 'Borrar tu cuenta · Polygo',
    description: 'Cómo eliminar tu cuenta de Polygo y todos tus datos, desde la app o por email.',
    priority: '0.3',
  },
];

// Blog: índice y un artículo por entrada de src/blog/posts.json.
const POSTS = loadPosts(src);
PAGES.push({
  out: 'blog/index.html',
  source: indexSource(POSTS),
  path: '/blog/',
  title: 'Blog de Polygo · Guías para aprender idiomas',
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
function required(key, label) {
  if (config[key] && key === 'contactEmail') {
    return `<a href="mailto:${escape(config[key])}">${escape(config[key])}</a>`;
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

const storesHtml = `<div class="stores">${storeButton(config.appStoreUrl, 'ios', APPLE_ICON, 'Descargar en el', 'App Store')}${storeButton(config.playStoreUrl, 'android', PLAY_ICON, 'DISPONIBLE EN', 'Google Play')}</div>`;

function jsonLd(page) {
  const scripts = (docs) =>
    docs.map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`).join('\n    ');
  if (page.post) return scripts(postJsonLd(page.post, config.siteUrl));
  if (page.blogIndex) return scripts(indexJsonLd(POSTS, config.siteUrl));
  if (page.path !== '/') return '';
  const faq = [...readFileSync(join(src, 'index.html'), 'utf8').matchAll(
    /<details class="faq-item">\s*<summary>(.*?)<\/summary>\s*<p>(.*?)<\/p>/gs,
  )].map(([, q, a]) => ({
    '@type': 'Question',
    name: q.trim(),
    acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '').trim() },
  }));
  const app = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Polygo',
    operatingSystem: 'iOS, Android',
    applicationCategory: 'EducationalApplication',
    inLanguage: 'es',
    description: page.description,
    url: `${config.siteUrl}/`,
    image: `${config.siteUrl}/assets/img/og.png`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    sameAs: ['https://www.instagram.com/polygo.idiomas/', config.appStoreUrl, config.playStoreUrl].filter(Boolean),
  };
  const faqPage = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq };
  return [app, faqPage]
    .map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`)
    .join('\n    ');
}

function render(page) {
  const partial = (name) => readFileSync(join(src, 'partials', `${name}.html`), 'utf8');
  const canonical = `${config.siteUrl}${page.path === '/' ? '/' : page.path}`;
  const vars = {
    title: escape(page.title),
    description: escape(page.description),
    canonical,
    siteUrl: config.siteUrl,
    year: String(new Date().getFullYear()),
    jsonLd: jsonLd(page),
    stores: storesHtml,
    // La 404 se sirve en cualquier ruta: enlaces absolutos. El resto, relativos (GitHub Pages usa /PolyGo/).
    base: page.base ?? (page.file === '404.html' ? `${config.siteUrl}/` : ''),
    headExtra: page.headExtra ?? '',
    robots: config.indexable ? '' : '<meta name="robots" content="noindex, nofollow" />',
  };
  let html = page.source ?? readFileSync(join(src, page.file), 'utf8');
  html = html.replace(/\{\{> (\w+)\}\}/g, (_, name) => partial(name));
  html = html.replace(/\{\{> (\w+)\}\}/g, (_, name) => partial(name));
  html = html.replace(/\{\{required:(\w+):([^}]+)\}\}/g, (_, key, label) => required(key, label));
  html = html.replace(/\{\{(\w+)\}\}/g, (m, key) => {
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
for (const page of PAGES) writeFileSync(join(out, page.out ?? page.file), render(page));
if (existsSync(join(src, '404.html'))) {
  writeFileSync(join(out, '404.html'), render({ ...PAGES[0], file: '404.html', path: '/404', title: 'Página no encontrada · Polygo' }));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map(
    (p) =>
      `  <url><loc>${config.siteUrl}${p.path}</loc><lastmod>${p.lastmod ?? today}</lastmod><priority>${p.priority}</priority></url>`,
  ).join('\n')}\n</urlset>\n`,
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
// GitHub Pages: no procesar con Jekyll.
writeFileSync(join(out, '.nojekyll'), '');
// GitHub Pages con dominio propio: el archivo CNAME dice cuál (no aplica a *.github.io ni a Netlify).
const host = new URL(config.siteUrl).hostname;
if (!host.endsWith('.github.io') && !host.endsWith('.netlify.app')) {
  writeFileSync(join(out, 'CNAME'), `${host}\n`);
}

for (const w of [...new Set(warnings)]) console.warn(`⚠ ${w}`);
console.log(`Sitio listo en ${out} (${PAGES.length} páginas) para ${config.siteUrl}${config.indexable ? '' : ' · sin indexar (noindex)'}`);

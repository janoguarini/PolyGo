// Arma el sitio estático de Polygo (website/dist) sin dependencias: sólo Node.
//   node website/build.mjs
// Configuración en website/site.config.json; cada campo se puede pisar con una variable de entorno
// (SITE_URL, APP_STORE_URL, PLAY_STORE_URL, CONTACT_EMAIL, OWNER_NAME), útil para que Netlify y
// GitHub Pages publiquen cada uno con su dirección.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
};

/** Páginas del sitio: archivo fuente, ruta pública, título y descripción (SEO). */
const PAGES = [
  {
    file: 'index.html',
    path: '/',
    title: 'Polygo · Aprendé inglés compitiendo',
    description:
      'Aprendé inglés desde cero con lecciones cortas, repaso inteligente y partidas 1 contra 1 en vivo con ELO y rangos. App gratis para iPhone y Android.',
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

const warnings = [];
const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Datos que la política necesita: si faltan, se ve un aviso en la página y en la consola. */
function required(key, label) {
  if (config[key]) return escape(config[key]);
  warnings.push(`Falta "${key}" (${label}) en website/site.config.json`);
  return `<mark>[completar: ${label}]</mark>`;
}

const APPLE_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.8-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>';
const PLAY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 2.8v18.4c0 .5.5.8.9.6l10.4-9.2c.3-.3.3-.8 0-1.1L4.9 2.2c-.4-.2-.9.1-.9.6zm12.7 6.6L6.6 3.6l10.9 6.2-.8-.4zm0 5.2-1 .6-10.1 5.8 11.1-6.4zm1.6-3.6 2.4 1.4c.5.3.5 1 0 1.3l-2.4 1.4-2.3-2.1 2.3-2z"/></svg>';

function storeButton(url, store, icon, small, big) {
  const inner = `${icon}<span><small>${small}</small><strong>${big}</strong></span>`;
  if (url) {
    return `<a class="store" href="${escape(url)}" rel="noopener" data-store="${store}">${inner}</a>`;
  }
  return `<span class="store store-soon" aria-label="${big}: próximamente">${inner}<em>Próximamente</em></span>`;
}

const storesHtml = `<div class="stores">${storeButton(config.appStoreUrl, 'ios', APPLE_ICON, 'Descargala en', 'App Store')}${storeButton(config.playStoreUrl, 'android', PLAY_ICON, 'Disponible en', 'Google Play')}</div>`;

function jsonLd(page) {
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
    ...(config.appStoreUrl || config.playStoreUrl
      ? { sameAs: [config.appStoreUrl, config.playStoreUrl].filter(Boolean) }
      : {}),
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
    base: page.file === '404.html' ? `${config.siteUrl}/` : '',
  };
  let html = readFileSync(join(src, page.file), 'utf8');
  html = html.replace(/\{\{> (\w+)\}\}/g, (_, name) => partial(name));
  html = html.replace(/\{\{> (\w+)\}\}/g, (_, name) => partial(name));
  html = html.replace(/\{\{required:(\w+):([^}]+)\}\}/g, (_, key, label) => required(key, label));
  html = html.replace(/\{\{(\w+)\}\}/g, (m, key) => {
    if (key in vars) return vars[key];
    if (key in config) return escape(config[key]);
    throw new Error(`${page.file}: variable desconocida ${m}`);
  });
  return html;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(src, 'assets'), join(out, 'assets'), { recursive: true });

for (const page of PAGES) writeFileSync(join(out, page.file), render(page));
if (existsSync(join(src, '404.html'))) {
  writeFileSync(join(out, '404.html'), render({ ...PAGES[0], file: '404.html', path: '/404', title: 'Página no encontrada · Polygo' }));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map(
    (p) =>
      `  <url><loc>${config.siteUrl}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`,
  ).join('\n')}\n</urlset>\n`,
);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
// GitHub Pages: no procesar con Jekyll.
writeFileSync(join(out, '.nojekyll'), '');

for (const w of [...new Set(warnings)]) console.warn(`⚠ ${w}`);
console.log(`Sitio listo en ${out} (${PAGES.length} páginas) para ${config.siteUrl}`);

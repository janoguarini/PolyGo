// Blog de Polygo: artículos en src/blog/posts/<slug>.html y sus datos en src/blog/posts.json.
// Cada artículo sale como página propia (/blog/<slug>) con datos estructurados para Google
// (BlogPosting, BreadcrumbList y FAQPage a partir de sus <details class="faq-item">).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function longDate(iso, lang) {
  const [y, m, d] = iso.split('-').map(Number);
  return lang === 'en' ? `${MONTHS_EN[m - 1]} ${d}, ${y}` : `${d} de ${MONTHS[m - 1]} de ${y}`;
}

const UI = {
  es: { home: 'Inicio', blog: 'Blog', updated: 'Actualizado el', read: 'min de lectura', related: 'Seguí leyendo', cta: 'Probá Polygo gratis', ctaBody: 'Lecciones de 5 minutos, repaso inteligente y partidas 1 contra 1 de 60 segundos. En iPhone y Android.', faq: 'Preguntas frecuentes' },
  en: { home: 'Home', blog: 'Blog', updated: 'Updated', read: 'min read', related: 'Keep reading', cta: 'Try Polygo for free', ctaBody: 'Five-minute lessons, smart review and 60-second 1v1 matches. On iPhone and Android.', faq: 'FAQ' },
};

export function loadPosts(src) {
  const posts = JSON.parse(readFileSync(join(src, 'blog', 'posts.json'), 'utf8'));
  return posts.map((p) => ({
    ...p,
    lang: p.lang || 'es',
    body: readFileSync(join(src, 'blog', 'posts', `${p.slug}.html`), 'utf8'),
  }));
}

const HEAD_EXTRA = `<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,600;0,700;0,800;0,900;1,900&display=swap" />
    <link rel="stylesheet" href="/assets/home.css" />
    <link rel="stylesheet" href="/assets/blog.css" />`;

function card(p) {
  return `<a class="post-card" href="/blog/${p.slug}">
            <img src="/assets/img/fox/${p.fox}.webp" alt="" width="110" height="127" loading="lazy" />
            <span class="post-card-cat">${esc(p.category)}</span>
            <strong>${esc(p.h1)}</strong>
            <span class="post-card-ex">${esc(p.excerpt)}</span>
            <span class="post-card-meta">${p.minutes} min</span>
          </a>`;
}

/** Página de un artículo (pasa después por el mismo armado que el resto: partials y variables). */
export function postSource(p, posts) {
  const t = UI[p.lang] || UI.es;
  const related = (p.related || [])
    .map((s) => posts.find((x) => x.slug === s))
    .filter(Boolean)
    .slice(0, 3);
  return `<!doctype html>
<html lang="${p.lang}">
  <head>
{{> head}}
  </head>
  <body class="home blog">
{{> nav}}
    <main>
      <article class="post">
        <header class="post-hero">
          <div class="aurora soft" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
          <div class="wrap post-hero-grid">
            <div>
              <nav class="crumbs" aria-label="Migas de pan"><a href="/">${t.home}</a><span>›</span><a href="/blog/">${t.blog}</a><span>›</span><span>${esc(p.category)}</span></nav>
              <h1>${esc(p.h1)}</h1>
              <p class="lead">${esc(p.excerpt)}</p>
              <p class="post-meta">${t.updated} ${longDate(p.updated || p.date, p.lang)} · ${p.minutes} ${t.read}</p>
            </div>
            <img class="post-fox" src="/assets/img/fox/${p.fox}.webp" alt="" width="220" height="255" />
          </div>
        </header>
        <div class="wrap post-layout">
          <div class="prose">
${p.takeaways ? `            <div class="tldr"><span class="tldr-t">⚡ ${p.lang === 'en' ? 'IN 30 SECONDS' : 'EN 30 SEGUNDOS'}</span><ul>${p.takeaways.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>\n` : ''}${p.body}
          </div>
          <aside class="post-cta">
            <img src="/assets/img/icon-192.png" alt="" width="72" height="72" />
            <strong>${t.cta}</strong>
            <p>${t.ctaBody}</p>
            {{stores}}
          </aside>
        </div>
      </article>
      ${
        related.length
          ? `<section class="wrap related" aria-label="${t.related}">
        <h2>${t.related}</h2>
        <div class="post-grid">
          ${related.map(card).join('\n          ')}
        </div>
      </section>`
          : ''
      }
    </main>
{{> footer}}
  </body>
</html>
`;
}

/** Índice del blog, agrupado por sección. */
export function indexSource(posts) {
  const groups = [];
  for (const p of posts) {
    let g = groups.find((x) => x.name === p.section);
    if (!g) groups.push((g = { name: p.section, posts: [] }));
    g.posts.push(p);
  }
  return `<!doctype html>
<html lang="es">
  <head>
{{> head}}
  </head>
  <body class="home blog">
{{> nav}}
    <main>
      <header class="post-hero blog-hero">
        <div class="aurora soft" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
        <div class="wrap post-hero-grid">
          <div>
            <p class="kicker">BLOG DE POLYGO</p>
            <h1>Aprender idiomas, <span class="grad">sin vueltas</span></h1>
            <p class="lead">Guías para aprender inglés, italiano, portugués, francés y chino mandarín: vocabulario, pronunciación, frases clave y métodos que funcionan de verdad.</p>
          </div>
          <img class="post-fox" src="/assets/img/fox/wave.webp" alt="" width="220" height="255" />
        </div>
      </header>
      ${groups
        .map(
          (g) => `<section class="wrap blog-group">
        <h2>${esc(g.name)}</h2>
        <div class="post-grid">
          ${g.posts.map(card).join('\n          ')}
        </div>
      </section>`,
        )
        .join('\n      ')}
    </main>
{{> footer}}
  </body>
</html>
`;
}

export function postJsonLd(p, siteUrl) {
  const url = `${siteUrl}/blog/${p.slug}`;
  const org = { '@type': 'Organization', name: 'Polygo', url: `${siteUrl}/`, logo: `${siteUrl}/assets/img/icon-512.png` };
  const faq = [...p.body.matchAll(/<details class="faq-item">\s*<summary>(.*?)<\/summary>\s*<p>(.*?)<\/p>/gs)].map(
    ([, q, a]) => ({
      '@type': 'Question',
      name: q.replace(/<[^>]+>/g, '').trim(),
      acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '').trim() },
    }),
  );
  const docs = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.h1,
      description: p.description,
      inLanguage: p.lang,
      datePublished: p.date,
      dateModified: p.updated || p.date,
      keywords: p.keywords.join(', '),
      image: `${siteUrl}/assets/img/og.png`,
      author: org,
      publisher: org,
      mainEntityOfPage: url,
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog/` },
        { '@type': 'ListItem', position: 3, name: p.h1, item: url },
      ],
    },
  ];
  if (faq.length) docs.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq });
  return docs;
}

export function indexJsonLd(posts, siteUrl) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog de Polygo',
      url: `${siteUrl}/blog/`,
      inLanguage: 'es',
      blogPost: posts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.h1,
        url: `${siteUrl}/blog/${p.slug}`,
        datePublished: p.date,
        inLanguage: p.lang,
      })),
    },
  ];
}

/** /llms.txt: resumen del sitio para asistentes de IA (formato llmstxt.org). */
export function llmsTxt(posts, siteUrl) {
  return `# Polygo

> Polygo es una app gratuita para iPhone y Android para aprender idiomas jugando: lecciones cortas, repaso con repetición espaciada y partidas competitivas 1 contra 1 en vivo (Word Rush, 60 segundos) con ELO y rangos de Bronce a Gran Maestro.

Datos clave:
- Idiomas: inglés, italiano, portugués, chino mandarín y francés para hispanohablantes; español para angloparlantes. Cursos desde cero (A1) y A2; inglés también B1 y B2.
- Aprender: un camino de lecciones de unos 5 minutos (elegir, escuchar, escribir, unir parejas); sin errores la lección queda dorada con 3 estrellas.
- Repasar: las palabras vuelven justo antes de olvidarlas (repetición espaciada) y hay una palabra del día.
- Competir: Word Rush, partidas en vivo de 60 segundos con 4 microjuegos (Swipe Battle, Connect, Audio Blitz y Sentence Rush), combos y «Frenesí» (puntos dobles los últimos 15 segundos). Ranking por ELO en cada idioma, 8 rangos y clasificación global.
- Hábito: racha diaria con protector, misiones diarias, logros, niveles de experiencia y colección de skins de zorro.
- Precio: gratis; PolyGo Plus es opcional.
- Web: ${siteUrl}/

## Guías del blog

${posts.map((p) => `- [${p.h1}](${siteUrl}/blog/${p.slug}): ${p.description}`).join('\n')}

## Páginas

- [Inicio](${siteUrl}/): qué es Polygo y cómo funciona.
- [Blog](${siteUrl}/blog/): todas las guías.
- [Privacidad](${siteUrl}/privacidad)
- [Términos y condiciones](${siteUrl}/terminos)
- [Soporte](${siteUrl}/soporte)
- [Borrar cuenta](${siteUrl}/borrar-cuenta)
`;
}

export { HEAD_EXTRA };

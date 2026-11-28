# Sitio web de Polygo

Sitio **informativo y estático** en `website/`: explica la app, posiciona en buscadores y lleva a App Store / Google Play. No es la app en el navegador (la app es sólo para teléfono).

- Páginas: portada (`/`), política de privacidad (`/privacidad`), términos (`/terminos`), soporte (`/soporte`) y borrar cuenta (`/borrar-cuenta`), más el blog (`/blog/`, sólo en español) y `404.html`. Privacidad y borrar cuenta son las URL que piden las tiendas.
- Traducciones: las mismas cinco páginas en portugués de Brasil (`/pt/`), italiano (`/it/`) y francés (`/fr/`), para quien quiere aprender **inglés** desde su idioma (cursos `en-from-pt`, `en-from-it`, `en-from-fr`). Ver «Traducciones» abajo.
- HTML y CSS puros, sin frameworks ni fuentes externas: carga rápido y Google lee todo el texto.
- SEO: título y descripción por página, URL canónica, Open Graph (imagen `assets/img/og.png`), datos estructurados (`MobileApplication` y `FAQPage`, armados a partir de las preguntas de la portada), `sitemap.xml` y `robots.txt` generados.

## Estructura

```
website/
  site.config.json   dirección del sitio, links de las tiendas y datos de la política
  build.mjs          arma website/dist (sólo Node, sin dependencias)
  i18n.mjs           idiomas: rutas de cada página, textos del menú/pie y título/descripción traducidos
  check.mjs          revisa dist: lang, canonical, hreflang, enlaces internos, sitemap y tipografía francesa
  src/               páginas en español (.html), pt/, it/ y fr/ (traducciones), partials/ (head, nav, footer, legalnav) y assets/
```

Las páginas usan `{{variable}}` (de `site.config.json` o calculadas), `{{> partial}}` y `{{required:campo:etiqueta}}` para los datos obligatorios de la política: si falta alguno, el build avisa y la página lo marca en naranja.

```bash
npm run website:build     # o: node website/build.mjs  → website/dist
npm run website:check     # build + node website/check.mjs (sale con error si algo no cuadra)
npm run website:emblems   # regenera los SVG de rangos desde la geometría de la app
```

`npm run check` (y el CI) también arma el sitio, así que una página rota se detecta antes de publicar.

## Configuración (`website/site.config.json`)

| Campo | Qué es |
| --- | --- |
| `siteUrl` | Dirección **canónica** del sitio (sin `/` final). Ver "Netlify y GitHub Pages" abajo. |
| `appStoreUrl`, `playStoreUrl` | Links de las tiendas. Vacíos = botones "Próximamente". |
| `contactEmail`, `ownerName`, `country`, `privacyUpdated` | Datos de la política de privacidad y de borrar cuenta. |
| `privacyUpdatedLocalized`, `countryLocalized` | La fecha de actualización y el país escritos en cada idioma (`"pt-BR"`, `"it"`, `"fr"`). Al cambiar `privacyUpdated`, cambiar también estas fechas: si falta una, el build avisa. |
| `indexable` | `false` = todas las páginas con `noindex` y sin sitemap en `robots.txt`. Hoy está en `false` hasta tener dominio propio. |

Cada campo se puede pisar con una variable de entorno en el hosting: `SITE_URL`, `APP_STORE_URL`, `PLAY_STORE_URL`, `CONTACT_EMAIL`, `OWNER_NAME`.

Cuando las apps estén publicadas, reemplazar los botones por los distintivos oficiales de Apple y Google (tienen reglas de uso propias).

## Traducciones

El español queda en la raíz con sus URL de siempre. Cada traducción vive en su carpeta, con rutas propias (estables: no cambiarlas, están en el sitemap y en los hreflang):

| Página | Español | Português (pt-BR) | Italiano (it) | Français (fr) |
| --- | --- | --- | --- | --- |
| Portada | `/` | `/pt/` | `/it/` | `/fr/` |
| Privacidad | `/privacidad` | `/pt/privacidade` | `/it/privacy` | `/fr/confidentialite` |
| Términos | `/terminos` | `/pt/termos` | `/it/termini` | `/fr/conditions` |
| Soporte | `/soporte` | `/pt/suporte` | `/it/assistenza` | `/fr/assistance` |
| Borrar cuenta | `/borrar-cuenta` | `/pt/excluir-conta` | `/it/elimina-account` | `/fr/supprimer-compte` |

Cómo funciona:

- `website/i18n.mjs` tiene, por idioma, el código (`lang`), la carpeta, `og:locale`, la ruta de cada página (`slugs`) y los textos de menú, pie, botones de tienda e Instagram (`t`). `PAGE_META` tiene el título y la descripción (SEO) de cada página traducida; los del español siguen en `build.mjs`.
- Los partials son los mismos para todos los idiomas: usan `{{t.clave}}` para los textos y `{{home}}`, `{{privacyUrl}}`, `{{termsUrl}}`, `{{supportUrl}}`, `{{deleteUrl}}` para los enlaces (relativos, así anda también bajo `/PolyGo/`). `{{base}}` lleva a la raíz (`../` dentro de `/pt/`) para los assets.
- Cada página traducida es un HTML propio en `src/<carpeta>/` (no una plantilla): se adapta, no se calca. Las portadas traducidas hablan sólo del curso de inglés (textos y datos de docs/STORE_LISTINGS.md), no tienen la galería de pantallas (las capturas están en español) y suman una sección de PolyGo Plus.
- El build agrega a cada página que existe en varios idiomas los `<link rel="alternate" hreflang>` de todas las versiones (+ `x-default` = español) y `og:locale:alternate`; el sitemap lista cada URL con sus `xhtml:link` alternativos. El pie trae un selector de idioma que lleva a la misma página en el otro idioma (en el blog y la 404, a la portada de cada idioma).
- Los datos estructurados (`MobileApplication` + `FAQPage`) de cada portada salen de sus propias preguntas frecuentes, con `inLanguage` del idioma.
- El blog es sólo en español: no está en el menú ni en el pie de las traducciones.
- La 404 es una sola (GitHub Pages sirve `/404.html` para cualquier ruta) y trae el selector de idioma.
- Tipografía: pt-BR con «você» y comillas “ ”; italiano con «tu» y « »; francés con «tu», espacio duro (`&nbsp;`) antes de `? ! : ;` y dentro de « » (`check.mjs` lo controla) y apóstrofo tipográfico (’).
- **Al cambiar un texto legal en español** (privacidad, términos, soporte, borrar cuenta), cambiar lo mismo en `src/pt/`, `src/it/` y `src/fr/`, y la fecha en `privacyUpdatedLocalized`. En privacidad, cada traducción suma, después de la línea de Argentina, la autoridad del país principal: ANPD (Brasil), Garante per la protezione dei dati personali (Italia), CNIL (Francia).
- Pendiente: revisión de un hablante nativo de cada idioma, una imagen `og.png` por idioma (hoy es la misma) y capturas de la app en cada idioma.

**Agregar un idioma** (por ejemplo, alemán):

1. `website/i18n.mjs`: sumar una entrada a `LOCALES` (`code`, `lang`, `dir`, `ogLocale`, `name`, `slugs` de las cinco páginas y todos los textos `t`, copiando las claves de otro idioma) y su bloque en `PAGE_META`.
2. `website/site.config.json`: la fecha en `privacyUpdatedLocalized` y el país en `countryLocalized`.
3. `website/src/<dir>/`: `index.html` y las cuatro páginas legales con los nombres de `slugs` (copiar las de otro idioma: `<html lang>`, `{{base}}assets/…`, enlaces entre páginas por su slug).
4. `npm run website:check` y revisar en el navegador (`npx serve website/dist`).

## Publicar (rama gh-pages)

Hoy polygoidiomas.com lo sirve GitHub Pages desde la rama `gh-pages` del repo, que tiene **sólo** el contenido de `website/dist` (sin historial del código). Nunca tocar `main`.

1. `npm run website:check` (build + revisión).
2. Copiar `website/dist` a una carpeta temporal fuera del repo, `git init` ahí, y hacer el commit con una identidad genérica (usuario «Polygo Web», email `web@polygoidiomas.com`).
3. Traer la rama publicada y ponerse encima (GitHub a veces agrega commits «Create CNAME»): `git fetch https://github.com/janoguarini/PolyGo.git gh-pages` y `git rebase FETCH_HEAD` (o publicar forzado si hace falta).
4. `git push https://github.com/janoguarini/PolyGo.git HEAD:gh-pages`. Pages redespliega solo; el dominio sale del archivo `CNAME` que genera el build.
5. Después de publicar traducciones nuevas: en Google Search Console, volver a enviar `https://polygoidiomas.com/sitemap.xml`.

## Netlify y GitHub Pages

El mismo sitio funciona en los dos. Para Google conviene **una sola dirección principal**: las dos copias usan la misma `siteUrl` como canónica, así la otra no cuenta como contenido duplicado.

**Netlify** (`netlify.toml` ya configurado: base `website`, comando `node build.mjs`, publica `dist`):
1. app.netlify.com → Add new site → Import an existing project → GitHub → `janoguarini/PolyGo`.
2. Dejar la configuración que lee de `netlify.toml` y publicar. Se actualiza solo con cada push a `main`.
3. Elegir el nombre del sitio (Site configuration → Change site name) y poner esa dirección en `siteUrl`.

**GitHub Pages** (`.github/workflows/website.yml`):
1. GitHub → repo → Settings → Pages → Source: **GitHub Actions**.
2. Settings → Secrets and variables → Actions → Variables: crear `DEPLOY_PAGES` = `true`.
3. Actions → "Sitio web" → Run workflow (o hacer push en `website/`). Queda en `https://janoguarini.github.io/PolyGo/`.

Sin `DEPLOY_PAGES`, el workflow sólo verifica que el sitio compile.

**Dominio propio** (recomendado para SEO): se compra aparte y se conecta en el hosting principal; después actualizar `siteUrl`.

## Estado actual

- Publicado en Netlify: **https://polygoidiomas.netlify.app** (dirección provisoria, sin indexar).
- Privacidad: https://polygoidiomas.netlify.app/privacidad · Borrar cuenta: https://polygoidiomas.netlify.app/borrar-cuenta
- La app toma la URL de privacidad de `eas.json` (todas las builds) y de `.env` (desarrollo).

## Al comprar el dominio propio

1. Conectarlo en Netlify (Domain management → Add a domain).
2. `website/site.config.json`: `siteUrl` = el dominio nuevo e `indexable` = `true`.
3. Cambiar `EXPO_PUBLIC_PRIVACY_POLICY_URL` en `eas.json` y `.env`, y las URL en App Store Connect y Play Console.
4. Google Search Console: agregar el dominio y enviar `https://<dominio>/sitemap.xml`.
5. Netlify redirige la dirección `.netlify.app` al dominio principal, así que los links viejos siguen andando.

## Después de publicar (con dominio)

- Google Search Console: agregar el sitio y enviar `https://<sitio>/sitemap.xml`.
- `EXPO_PUBLIC_PRIVACY_POLICY_URL` = `https://<sitio>/privacidad` (el enlace aparece en Ajustes de la app).
- Play Console → Seguridad de los datos: URL de borrado = `https://<sitio>/borrar-cuenta`. App Store Connect: URL de privacidad.

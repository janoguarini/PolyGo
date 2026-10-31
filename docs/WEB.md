# Sitio web de Polygo

Sitio **informativo y estático** en `website/`: explica la app, posiciona en buscadores y lleva a App Store / Google Play. No es la app en el navegador (la app es sólo para teléfono).

- Páginas: portada (`/`), política de privacidad (`/privacidad`) y borrar cuenta (`/borrar-cuenta`), más `404.html`. Las dos últimas son las URL que piden las tiendas.
- HTML y CSS puros, sin frameworks ni fuentes externas: carga rápido y Google lee todo el texto.
- SEO: título y descripción por página, URL canónica, Open Graph (imagen `assets/img/og.png`), datos estructurados (`MobileApplication` y `FAQPage`, armados a partir de las preguntas de la portada), `sitemap.xml` y `robots.txt` generados.

## Estructura

```
website/
  site.config.json   dirección del sitio, links de las tiendas y datos de la política
  build.mjs          arma website/dist (sólo Node, sin dependencias)
  src/               páginas (.html), partials/ (head, nav, footer) y assets/
```

Las páginas usan `{{variable}}` (de `site.config.json` o calculadas), `{{> partial}}` y `{{required:campo:etiqueta}}` para los datos obligatorios de la política: si falta alguno, el build avisa y la página lo marca en naranja.

```bash
npm run website:build     # o: node website/build.mjs  → website/dist
npm run website:emblems   # regenera los SVG de rangos desde la geometría de la app
```

`npm run check` (y el CI) también arma el sitio, así que una página rota se detecta antes de publicar.

## Configuración (`website/site.config.json`)

| Campo | Qué es |
| --- | --- |
| `siteUrl` | Dirección **canónica** del sitio (sin `/` final). Ver "Netlify y GitHub Pages" abajo. |
| `appStoreUrl`, `playStoreUrl` | Links de las tiendas. Vacíos = botones "Próximamente". |
| `contactEmail`, `ownerName`, `country`, `privacyUpdated` | Datos de la política de privacidad y de borrar cuenta. |
| `indexable` | `false` = todas las páginas con `noindex` y sin sitemap en `robots.txt`. Hoy está en `false` hasta tener dominio propio. |

Cada campo se puede pisar con una variable de entorno en el hosting: `SITE_URL`, `APP_STORE_URL`, `PLAY_STORE_URL`, `CONTACT_EMAIL`, `OWNER_NAME`.

Cuando las apps estén publicadas, reemplazar los botones por los distintivos oficiales de Apple y Google (tienen reglas de uso propias).

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

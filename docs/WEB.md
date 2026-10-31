# Polygo en la web

La web es la misma app de Expo exportada para navegador (`react-native-web`), no un proyecto aparte:

- **Sin sesión**, `/` muestra la página de presentación (`src/features/landing/LandingPage.tsx`, ruta `src/app/(auth)/index.web.tsx`). En el teléfono, `/` sigue siendo la bienvenida de siempre (`index.tsx`).
- **Con sesión**, es la app completa con la misma cuenta de Supabase: lecciones, repaso, ranked, desafíos, vocabulario y perfil. En pantallas anchas las pestañas van en una barra lateral y el contenido en una columna centrada (`Screen` usa `ScreenMaxWidth`; las pantallas de acceso, 460 px).
- No hay en la web: widgets, recordatorios (notificaciones locales) ni vibración. La sesión se guarda en `localStorage`.
- Los links de desafío también abren en el navegador: `https://<dominio>/challenge/<código>`.
- Título, descripción y vista previa para redes: `public/index.html`.

## Probar en local

```bash
npx expo start --web          # desarrollo
npx expo export -p web        # build de producción en dist/
npx expo serve                # sirve dist/ en http://localhost:8081
```

## Publicar en Cloudflare Pages (gratis)

`app.json` tiene `web.output: "single"` (una sola página; el enrutado lo hace la app). Cloudflare Pages sirve `index.html` en cualquier ruta si no hay `404.html`, así que `/ranked` o `/challenge/ABC234` funcionan sin reglas extra.

1. dash.cloudflare.com → Workers & Pages → Create → Pages → **Connect to Git** → repositorio `janoguarini/PolyGo`, rama `main`.
2. Configuración de build:
   - Framework preset: **None**
   - Build command: `npx expo export -p web`
   - Build output directory: `dist`
3. Variables de entorno (para Production y Preview):
   - `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`: los mismos valores del `.env` (son públicos: viajan dentro de la app).
   - `NODE_VERSION` = `22`
   - No cargar `EXPO_PUBLIC_BATTLE_SERVER_URL` mientras no exista el servidor de partidas.
4. Deploy. Queda en `https://<proyecto>.pages.dev` y se vuelve a publicar solo con cada push a `main` (cada rama tiene su URL de vista previa).
5. Supabase → Authentication → URL Configuration: agregar `https://<proyecto>.pages.dev/**` en **Redirect URLs** (si no, los emails de confirmación y de recuperar contraseña no vuelven a la web). Con dominio propio, agregarlo también y ponerlo como Site URL.

Dominio propio: Pages → Custom domains (gratis; el dominio se compra aparte).

Alternativa: EAS Hosting (`npx eas-cli@latest deploy --prod` después de exportar).

## Pendiente

- Si un link de desafío se abre sin sesión, después de entrar hay que escribir el código a mano.
- En Windows, las banderas de los idiomas del perfil se ven como letras (GB, BR): Windows no dibuja emojis de banderas.

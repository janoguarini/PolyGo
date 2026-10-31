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

## Publicar (EAS Hosting, recomendado por Expo)

`app.json` tiene `web.output: "single"` (una sola página; el enrutado lo hace la app).

```bash
npx expo export -p web
npx eas-cli@latest deploy             # vista previa con URL propia
npx eas-cli@latest deploy --prod      # producción
```

Dominio propio: se configura en expo.dev → proyecto → Hosting. Después, agregar esa URL en Supabase → Authentication → URL Configuration (Site URL y Redirect URLs) para que los emails de confirmación y recuperación vuelvan a la web.

Otras opciones (Netlify, Vercel, Cloudflare Pages) sirven igual subiendo `dist/`, con una regla que mande todas las rutas a `/index.html`.

## Pendiente

- Probar con sesión iniciada en la compu (lecciones, ranked, desafío, perfil) y ajustar lo que se vea mal.
- Si un link de desafío se abre sin sesión, después de entrar hay que escribir el código a mano.

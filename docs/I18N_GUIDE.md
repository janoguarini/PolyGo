# Interfaz en dos idiomas (es / en): guía

Decisión del dueño (2026-11-21): toda la app en inglés además de en español, antes del onboarding
nuevo. Infraestructura en `src/i18n/` (sin dependencias). Plan: [MULTILINGUAL_ONBOARDING_PLAN.md](MULTILINGUAL_ONBOARDING_PLAN.md).

## Conceptos

- **Idioma de la interfaz** (`es` | `en`): el de los botones, pantallas y mensajes. `useInterfaceLanguage()`.
- **Idioma de origen**: desde el que se aprende (lo define el curso).
- **Idioma que se aprende**: `profiles.target_language`.

El contenido de un curso (títulos de unidades, consignas, explicaciones, traducciones) viene de la base
y está en el idioma de origen del curso: **no se traduce en la interfaz**.

## Cómo se escribe

```ts
// src/features/learning/strings.ts (o src/i18n/screens/<ruta>.ts para pantallas de src/app)
import { defineStrings } from '@/i18n';

export const feedbackStrings = defineStrings({
  es: {
    correct: '¡Correcto!',
    lessonsLeft: (n: number) => (n === 1 ? 'Queda 1 lección' : `Quedan ${n} lecciones`),
  },
  en: {
    correct: 'Correct!',
    lessonsLeft: (n: number) => (n === 1 ? '1 lesson left' : `${n} lessons left`),
  },
});

// En un componente
const t = useStrings(feedbackStrings);
<Text>{t.correct}</Text>

// Fuera de React (hooks de datos, utilidades, alertas)
const t = getStrings(feedbackStrings);
```

- Archivo `strings.ts` junto al código de la feature, o `src/i18n/screens/<pantalla>.ts` para las rutas
  de `src/app` (ahí solo van pantallas). Un archivo puede exportar varios `defineStrings`.
- El test `src/i18n/__tests__/strings.test.ts` recorre esos archivos: misma forma en `es` y `en`, nada
  vacío y sin restos de español en el inglés.
- Plurales e interpolación: funciones con la misma aridad en los dos idiomas.
- Fechas y números: `useLocale()` / `getLocale()` en lugar de `'es'` fijo.
- Nombres de idiomas: `useLanguageName()` / `languageName(code, ui)` de `src/i18n/languages.ts`.
- Etiquetas de accesibilidad, placeholders, alertas (`Alert.alert`) y textos de error también.

## Estilo del inglés

- Inglés estadounidense, frases cortas, tono cálido y directo (segunda persona). Mayúscula solo al
  inicio («Start lesson», no «Start Lesson»). Etiquetas en mayúsculas («YOUR ANSWER») se mantienen si el
  español las tiene en mayúsculas.
- No traducir literalmente: «Seguí practicando» → «Keep practicing»; «¡Bien! Ojo con la ortografía» →
  «Nice! Watch your spelling».
- Marca y nombres propios: Polygo, Polygo Plus, Polys, Ranked, Word Rush quedan igual.

## Qué no se toca

- `shared/` que usa el servidor o los generadores SQL (corrección, logros que se generan en migraciones,
  protocolo de batalla): no se cambian sus textos ni su comportamiento. Para mostrarlos en inglés se
  agrega un mapa en el cliente, por id estable (p. ej. id de logro, código de misión, rango).
- Comportamiento, estilos, layout, `testID`, navegación y llamadas a la API.
- Los tests existentes corren en español (idioma inicial `es`): deben seguir pasando.
- `src/app/onboarding.tsx` y el tutorial (`AppTour`): se rehacen en las fases 3–5.

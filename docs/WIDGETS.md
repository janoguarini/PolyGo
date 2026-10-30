# Widgets nativos

> **Estado: implementado (Fase 5), sin probar todavía en un dispositivo.** Requiere una
> development build (EAS); en Expo Go los widgets no existen y la app funciona igual.

## Tecnología

[`expo-widgets`](https://docs.expo.dev/versions/v58.0.0/sdk/widgets/) (SDK 58) + Expo UI: los widgets se escriben en TypeScript con componentes SwiftUI (`@expo/ui/swift-ui`) en iOS y Jetpack Compose/Glance (`@expo/ui/jetpack-compose`) en Android. El config plugin genera la extensión de WidgetKit, el App Group (`group.com.polygoidioma.app`) y los `AppWidgetProvider` de Android. No hay código Swift ni Kotlin propio.

| Archivo | Qué es |
| --- | --- |
| `src/widgets/PolygoWord.{ios,android}.tsx` | Layout del widget «Palabra» |
| `src/widgets/PolygoQuiz.{ios,android}.tsx` | Layout del widget «Pregunta rápida» |
| `src/widgets/*.d.ts` | Tipos de `@/widgets/PolygoWord` (Metro elige el archivo por plataforma) |
| `src/features/widgets/content.ts` | Contenido: orden de palabras, timeline, ronda de preguntas (lógica pura) |
| `src/features/widgets/sync.ts` | Publica el contenido en los widgets; no-op en Expo Go/web |
| `src/features/widgets/useWidgetSync.ts` | Sincroniza al cargar datos, al cambiar y al volver a primer plano |
| `app.json` → plugin `expo-widgets` | Nombres, tamaños, `initialLayout`, `enableAndroid` |

## Widgets

| Widget | iOS | Android | Contenido | Toque |
| --- | --- | --- | --- | --- |
| **Palabra** (`PolygoWord`) | pequeño, mediano | 3×2 | Palabra del día → tus palabras para repasar (vencidas y con más errores primero) → palabras nuevas publicadas. Palabra, IPA, traducción y ejemplo | iOS: abre Vocabulario (`polygo://vocabulary`). Android: sin deep link (expo-widgets no lo expone) |
| **Pregunta rápida** (`PolygoQuiz`) | mediano, grande (botones: iOS 17+) | 4×3 | Ronda de 10 preguntas de 4 opciones (generador de Word Rush) con tus palabras estudiadas o, si tenés menos de 8, el currículo | Responder, ver la corrección, siguiente, resultado y «Otra ronda», **sin abrir la app** |

## Reglas del runtime de widgets

El componente marcado con `'widget'` se convierte en un string (plugin de Babel) y corre aislado en la extensión:

- Sólo componentes y modificadores de Expo UI; en Android, un subconjunto (ver la doc de expo-widgets).
- Nada de hooks, estado, async ni **constantes de módulo**: colores y helpers van dentro de la función.
- Todos los datos llegan como props JSON planas. Los botones devuelven las props nuevas (`onPress` en iOS, `onClick` en Android) y el runtime las guarda y redibuja.

`src/widgets/__tests__/layouts.test.ts` compila los layouts con el mismo plugin, los evalúa con componentes stub y simula toques: falla si un layout depende del módulo o si la ronda no avanza bien.

## Frecuencia de actualización

- **iOS:** timeline de 12 entradas, una por hora (la primera, ahora). iOS decide cuándo redibuja; **no se promete** el minuto exacto. Al abrir la app se reprograma.
- **Android:** no hay timeline (limitación de expo-widgets): la palabra se renueva cada vez que se abre la app.
- **Pregunta rápida:** la ronda cambia una vez por día o cuando cambian tus palabras estudiadas; abrir la app no pisa una ronda a medias.

## Privacidad y seguridad

- El widget sólo guarda contenido de vocabulario en el App Group / almacenamiento del widget: nada de tokens, emails, rating ni la `service_role` key.
- Al cerrar sesión se reemplaza el contenido por la tarjeta «Abrí Polygo» (no quedan palabras de la cuenta anterior).
- Las respuestas del widget son práctica: no se envían al servidor, no tocan el repaso espaciado ni el ELO.

## Cómo probarlos

1. Una vez: `npx eas-cli@latest login` y `npx eas-cli@latest init` (vincula el proyecto a la cuenta `lichigap` y agrega `extra.eas.projectId` a `app.json`).
2. Android: `npx eas-cli@latest build --profile development --platform android`, instalar el APK desde el link de EAS.
3. iOS (dispositivo): requiere cuenta de Apple Developer paga; registrar el iPhone con `npx eas-cli@latest device:create` y luego `npx eas-cli@latest build --profile development --platform ios`. En simulador (sin cuenta paga, desde una Mac): perfil `development-simulator`.
4. `npx expo start` (modo development build) y abrir la build instalada. Para seguir usando Expo Go: `npx expo start --go`.
5. Abrir Vocabulario o Inicio con sesión iniciada (sincroniza) y agregar los widgets desde la pantalla de inicio.

## Fuera del MVP

- Widgets de pantalla bloqueada (`accessory*` en iOS) y Live Activities (p. ej. partida ranked en curso).
- Sincronizar las respuestas del widget con el repaso espaciado (hoy son sólo práctica: Android no permite leer el estado del widget desde la app).
- Widget configurable (elegir unidad o tipo de contenido).

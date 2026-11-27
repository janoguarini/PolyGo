# Interfaz en cuatro idiomas (es / en / pt-BR / it): guía

Decisión del dueño (2026-11-21): toda la app en inglés además de en español. Ampliación (2026-11-26):
portugués de Brasil e italiano. Infraestructura en `src/i18n/` (sin dependencias). Plan:
[MULTILINGUAL_ONBOARDING_PLAN.md](MULTILINGUAL_ONBOARDING_PLAN.md).

## Conceptos

- **Idioma de la interfaz** (`es` | `en` | `pt-BR` | `it`): el de los botones, pantallas y mensajes.
  `useInterfaceLanguage()`. Son los mismos códigos que guarda `profiles.interface_language`.
- **Idioma de origen**: desde el que se aprende (lo define el curso: hoy `es` o `en`).
- **Idioma que se aprende**: `profiles.target_language`.

El contenido de un curso (títulos de unidades, consignas, explicaciones, traducciones) viene de la base
y está en el idioma de origen del curso: **no se traduce en la interfaz**. Tener un curso de italiano no
es tener la interfaz en italiano, ni al revés.

## Qué idioma ve cada usuario

1. Lo guardado en el teléfono (`polygo.interface-language`): elección en el registro o en Ajustes, o
   lo que trajo el perfil. Siempre gana.
2. Si no hay nada guardado, el primer idioma preferido del sistema que se soporta
   (`expo-localization`, con `Intl` de respaldo): `es*` → es, `en*` → en, `pt*` → pt-BR, `it*` → it.
   El resto, español.
3. El perfil (`profiles.interface_language`) se aplica al abrir la app y en cada recarga (la misma
   cuenta en otro teléfono ve el mismo idioma), **salvo que haya una elección pendiente de esa cuenta**.

Elección pendiente (`src/features/courses/interfaceLanguageSync.ts`, clave
`polygo.interface-language.pending` = `{ lang, owner }`):

- Toda elección manual (Ajustes o fin del registro) se aplica en el acto y se marca como pendiente
  **antes** de llamar a `set_interface_language`. Mientras esté marcada, el perfil no la pisa; un
  refresco del perfil que ya estaba en curso se cancela antes de escribir el caché.
- Si el guardado falla (sin conexión, error del servidor, o pt-BR / it sin la migración
  `20270103120000_interface_languages_pt_it`), la marca queda y se reintenta: en cada recarga del
  perfil (como mucho cada 30 s; si la base rechazó el idioma, no se insiste en la sesión) y siempre al
  volver la app a primer plano. Con el guardado confirmado, la marca se borra.
- Los guardados van en fila: con dos elecciones seguidas, la última es la que queda en la base; una
  elección que quedó vieja antes de enviarse no se manda.
- La marca es de una cuenta (`owner`): si entra otra, se descarta y manda el perfil de la nueva.
  Sobrevive al reinicio de la app; si no coincide con el idioma guardado, se descarta.

El registro guarda el idioma de la interfaz en el perfil al terminar: el servidor lo usa para escribir
los push (aviso de desafío) en ese idioma.

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
  'pt-BR': {
    correct: 'Correto!',
    lessonsLeft: (n: number) => (n === 1 ? 'Falta 1 lição' : `Faltam ${n} lições`),
  },
  it: {
    correct: 'Corretto!',
    lessonsLeft: (n: number) => (n === 1 ? 'Manca 1 lezione' : `Mancano ${n} lezioni`),
  },
});

// En un componente
const t = useStrings(feedbackStrings);
<Text>{t.correct}</Text>

// Fuera de React (hooks de datos, utilidades, alertas)
const t = getStrings(feedbackStrings);

// Un caso aislado, sin declarar un área
pick(ui, { es: 'Hola', en: 'Hi', 'pt-BR': 'Oi', it: 'Ciao' });
```

- Archivo `strings.ts` (o `<algo>Strings.ts`) junto al código de la feature, o
  `src/i18n/screens/<pantalla>.ts` para las rutas de `src/app`. Un archivo puede exportar varios
  `defineStrings`.
- TypeScript exige los cuatro idiomas con la misma forma. El test `src/i18n/__tests__/strings.test.ts`
  lo comprueba en ejecución: mismas claves, tipos, largo de listas y aridad; nada vacío; sin restos de
  español en en / pt-BR / it (también en lo que devuelven las funciones); cobertura 100 %; y que las
  interpolaciones muestren los mismos datos.
- Plurales e interpolación: funciones con la misma aridad en todos los idiomas.
- Fechas y números: `useLocale()` / `getLocale()` en lugar de `'es'` fijo.
- Nombres de idiomas: `useLanguageName()` / `languageName(code, ui)` de `src/i18n/languages.ts` (con
  mayúscula inicial; dentro de una frase, en minúscula salvo en inglés).
- Rangos: `useRankLabels()` / `getRankLabel()` de `src/features/ranked/strings.ts`, nunca
  `getRank().label` (es el español de `shared/ranking.ts`).
- Etiquetas de accesibilidad, placeholders, alertas (`Alert.alert`) y textos de error también.

## Estilo

- Inglés estadounidense, frases cortas, tono cálido y directo (segunda persona). Mayúscula solo al
  inicio («Start lesson»). Etiquetas en mayúsculas se mantienen si el español las tiene.
- Español neutro con tuteo (puedes, toca, elige; nunca voseo): docs/NEUTRAL_SPANISH.md. Lo controla
  `shared/neutralSpanish.ts` en los tests.
- Portugués de Brasil con «você», tono de app de juegos. Italiano informal («tu»).
- No traducir literalmente: «Seguí practicando» → «Keep practicing» / «Continue praticando» /
  «Continua a esercitarti».
- Marca: siempre **PolyGo** (también PolyGo Plus). Polys, Ranked, Word Rush, ELO, XP quedan igual. Los
  identificadores técnicos no cambian: `slug` / `scheme` `polygo`, bundle id, paquete, ids de widget
  `PolygoWord` / `PolygoQuiz`.
- Glosario:

  | es                    | pt-BR                                                                  | it                                                                       |
  | --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
  | racha                 | sequência                                                              | serie                                                                    |
  | rango                 | rank                                                                   | rango                                                                    |
  | logros                | conquistas                                                             | traguardi                                                                |
  | cofre                 | baú                                                                    | forziere                                                                 |
  | repaso                | revisão                                                                | ripasso                                                                  |
  | camino                | trilha                                                                 | percorso                                                                 |
  | Bronce … Gran Maestro | Bronze, Prata, Ouro, Platina, Esmeralda, Diamante, Mestre, Grão-Mestre | Bronzo, Argento, Oro, Platino, Smeraldo, Diamante, Maestro, Gran Maestro |

## Qué no se toca

- `shared/` que usa el servidor o los generadores SQL (corrección, logros que se generan en migraciones,
  protocolo de batalla, `shared/ranking.ts`): no se cambian sus textos ni su comportamiento. Para
  mostrarlos traducidos se agrega un mapa en el cliente, por id estable (id de logro, código de
  misión, rango, nivel de inicio).
- Comportamiento, estilos, layout, `testID`, navegación y llamadas a la API.
- Los tests existentes corren en español (idioma inicial `es`): deben seguir pasando.

## Pendiente (requiere build nativa o servidor)

- Nombres y descripciones de los widgets en la galería del sistema: siguen en español («Palabra»,
  «Pregunta rápida») en todos los idiomas. Mientras tanto, las instrucciones de Práctica citan esos
  nombres tal como los muestra el sistema, con la traducción entre paréntesis. Propuesta (requiere
  build nativa y QA en los dos sistemas):
  - Android: config plugin local que, después de `expo-widgets`, escriba `res/values-en/`,
    `values-pt-rBR/` y `values-it/` con `polygo_word_display_name`, `polygo_word_description`,
    `polygo_quiz_display_name` y `polygo_quiz_description` (los mismos nombres de recurso que genera el
    plugin, que los deja en `values/` con el texto en español). Simple: `withDangerousMod` sobre
    `android/app/src/main/res`.
  - iOS: el plugin genera `.configurationDisplayName("Palabra")` como literal en Swift, que SwiftUI
    resuelve como `LocalizedStringKey`. Hace falta agregar `es/en/pt-BR/it.lproj/Localizable.strings`
    (`"Palabra" = "Palavra";`…) al target de la extensión de widgets en el proyecto Xcode (grupo de
    variantes, fase de recursos y `knownRegions`). Es manipulación del proyecto nativo de la
    extensión: no se puede validar sin prebuild y build.
  - Hacer los dos juntos (si sólo se localiza Android, las instrucciones no pueden coincidir con iOS).
    Al tenerlo, sacar las aclaraciones entre paréntesis de `src/i18n/screens/practice.ts`.
- Textos de respaldo dentro de los widgets («Abrí PolyGo…»): sólo aparecen en widgets instalados antes de
  la versión que manda los textos (`props.ui`); quedan en español.
- Los logros del feed de amigos llegan como texto en español sin id: se traducen reconociendo
  «Familia · Nivel N» (`achievementTitleFromEs`). Si un día cambia ese formato, quedan en español.

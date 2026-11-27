# Español neutro en toda PolyGo

Decisión de producto (2026-11-27): el español de PolyGo deja el voseo rioplatense y pasa a **español
neutro con tuteo**, comprensible en Latinoamérica y España. Vale para la interfaz, los textos que guarda
la base, los avisos, los widgets, el sitio y el contenido de los cursos que se enseñan desde el español.

Estado: implementado en local (rama `i18n/neutral-spanish`), **sin aplicar en producción, sin deploy
y sin build**.

## Criterio

- Verbos: tuteo (puedes, tienes, eres; imperativos toca, elige, mantén; con pronombre, tócala, súmate).
- Pronombres: tú / ti / contigo. «tu» (posesivo) no cambia.
- «acá» → «aquí».
- Léxico rioplatense marcado → latinoamericano general (colectivo → autobús, departamento →
  apartamento, remera → camiseta, pileta → piscina, plata (dinero) → dinero, chau → chao/adiós, «Buen
  día» → «Buenos días», mozo → mesero…). Las palabras generales de Latinoamérica se quedan
  (computadora, celular, auto, jugo, papa, manejar, lindo).
- La marca es **PolyGo**.

## Qué cambió

| Superficie | Dónde | Cómo llega a producción |
| --- | --- | --- |
| Interfaz (bloques `es`) | `src/**/strings.ts`, `src/i18n/screens/*.ts` | build de la app |
| Textos fijos de la app | widgets (`src/widgets/*`), `app.json`, `locales/es.json`, panel de admin | build de la app |
| Textos compartidos | `shared/achievements.ts`, `missions.ts`, `referrals.ts`, `friendChallenges.ts`, `cosmetics.ts`, `profile.ts` | build + migración de logros |
| Aviso de desafío (push) | `supabase/functions/notify-battle-invite/message.ts` | deploy de la Edge Function |
| Aviso de «actualizar la app» | `app_client_policy.message_es` | migración `20270104120200` |
| Logros | `public.achievements` (generado de `shared/achievements.ts`) | migración `20270104120100` |
| Contenido de los cursos | `content/**` (todos los tramos menos el curso de español) | migración `20270104120000` |
| Test de nivel | `content/placement/banks.generated.ts` (viaja con la app) | build de la app |
| Banco de Word Rush | `content/word-rush/en.ts` → `supabase/pending/20261227120100_word_rush_bank_data.sql` (regenerado) | `supabase/pending/20270104120300` (a mano, después del banco) |
| Sitio | `website/src/**`, `website/build.mjs`, `website/blog.mjs` | publicar el sitio |

## Progreso y repaso espaciado (por qué no se pierde nada)

La identidad del contenido no depende del texto (content/ids-lock.ts: «la redacción, las opciones y la
respuesta no son identidad»):

- **Ubicaciones** (`exercises.id`, el id de `user_lesson_progress` y de los intentos): mismas.
- **Ítems** (`exercise_items.id`): mismos. Un texto nuevo es una **versión nueva** del mismo ítem
  (`exercise_item_versions`, version = máx + 1), que pasa a ser la vigente. Las versiones anteriores
  quedan: los intentos y las presentaciones guardados siguen apuntando a la que se respondió.
- **Repaso espaciado**: `user_word_progress` (por palabra) y `user_concept_state` (por concepto) no
  dependen del texto. Las palabras y los conceptos no cambian de id.
- Publicación (`is_published`) y estado (`status`) de unidades, lecciones, palabras, ítems y objetivos:
  no se tocan.

`scripts/build-neutral-spanish-sql.ts` genera la migración comparando una foto previa de todos los
tramos con el contenido actual, y **aborta** si cambia algo fuera de los textos: altas o bajas, un
ejercicio que cambia de tipo o habilidad, una ubicación que pasa a otro ítem, un ítem que aparece o
desaparece (p. ej. una traducción que vuelve ambiguo un ejercicio generado). Sin DELETE; reaplicable.

Pruebas: `supabase/tests/neutralSpanish.test.mjs` (PGlite) siembra progreso, repaso, una sesión con
intentos y las presentaciones exactas que se respondieron, aplica la corrección y comprueba que todo
queda igual, que el texto nuevo es una versión nueva del mismo ítem, que las versiones viejas quedan, que
las respuestas de antes se siguen aceptando y que reaplicarla no cambia nada.

## Respuestas: quien escribe con voseo sigue acertando

Cuando la respuesta es en español (traducciones de palabras, ejercicios de respuesta escrita), la forma
canónica pasa a tuteo y **la forma anterior queda entre las aceptadas** (`¿cómo te llamas?` canónica,
`¿cómo te llamás?` aceptada; `autobús` canónica, `colectivo` aceptada). Ninguna aceptada se quitó salvo
las que quedaron iguales a la nueva canónica. En opciones y parejas, la opción y la respuesta cambian
juntas. El test de PGlite corrige cada respuesta de antes con el corrector real (`gradeWithSpec`).

## Detector y excepciones

`shared/neutralSpanish.ts` (`voseoIn`) detecta voseo sin marcar pretéritos de «yo» («Ya elegí»,
«Recibí tu mensaje»), futuros de tuteo («verás», «podrás»), pinyin ni palabras de otros idiomas. Lo
usan:

- `src/i18n/__tests__/neutralSpanish.test.ts`: bloques `es` de todos los catálogos (también lo que
  devuelven las funciones), textos fijos del código, `shared/`, el aviso de desafío, `app.json` y
  `locales/es.json`.
- `content/__tests__/neutral-spanish.test.ts`: todo el contenido de los cursos.
- `content/word-rush/checks.ts`: las traducciones del banco de Word Rush.

Excepciones justificadas (no son voseo dirigido al usuario o son a propósito):

| Dónde | Qué | Por qué |
| --- | --- | --- |
| Curso de español para angloparlantes (`content/es/**`) | «vos sos = tú eres», `¿y vos?` aceptado, «acá» en oraciones | El español es lo que se enseña: el curso enseña a reconocer el voseo y acepta esas respuestas |
| Inglés A1 (`content/en/a1/unit02-to-be.ts`) | «You sirve para tú, vos y usted» | Explica el pronombre inglés: nombra «vos» como dato, no le habla de vos al usuario |
| Respuestas aceptadas en todos los cursos | `chau`, `colectivo`, `¿cómo te llamás?`, `vos`, `sos`… | Compatibilidad: quien responde así sigue acertando |
| Checklists de escritura en primera persona | «Saludé», «Escribí tres oraciones», «Pedí…» | Son pretéritos de «yo», no voseo |
| `pt-camiseta` y `pt-metro` | canónica «camiseta / remera» y «metro / subte» (aceptadas «remera», «playera», «subte») | La palabra neutra va primero. Sola («camiseta», «metro») sería igual a la portuguesa: el generador la trata como cognado y deja de producir sus 10 ejercicios de traducción, parejas y pista (cambiaría el catálogo de ítems). Con la barra, mismo formato que «a pie / caminando», los ítems y los ids no cambian |
| `fr-toi` | canónica «ti» | No es voseo: «ti» es el pronombre tónico del español estándar («para ti», «a ti»), que es lo que es «toi». «vos» queda entre las aceptadas. Con «tú» coincidiría con `fr-ton-ta` («tu») sin tilde y el generador perdería dos ítems |
| `ranked_legacy_guard` (20261209120000) | «actualizá la app» en el HINT | La app no lo muestra (traduce el código) y es parte del corte del Ranked viejo |
| `ids.lock.json`, ids | «es-de-donde-sos», «en.ex.2sosb…» | Son ids, no texto |

## Pendiente de autorización (en este orden)

1. Revisión del diff y commit.
2. Migraciones (todas idempotentes; ninguna borra filas):
   - `20270104120000_neutral_spanish_content.sql` (contenido, ~22 MB).
   - `20270104120100_achievements_neutral_spanish.sql` (logros).
   - `20270104120200_neutral_spanish_texts.sql` (aviso de actualizar la app, sólo si sigue el texto por defecto).
   - `supabase/pending/20270104120300_word_rush_neutral_spanish.sql` (banco de Word Rush, si está cargado).
   Antes, comparar en producción (sólo lectura) que las cargas de contenido coincidan con el repo.
3. Deploy de `notify-battle-invite`.
4. Build de la app (interfaz, widgets, test de nivel, `app.json`).
5. Publicar el sitio.

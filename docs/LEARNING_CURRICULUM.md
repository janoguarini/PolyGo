# Currículo de inglés A1

> **Estado: planificado (Fase 2). Sin contenido cargado todavía.**
> Referencia: nivel A1 del MCER. Completar unidades no equivale a una certificación oficial.

## Unidades propuestas

| # | Unidad | Objetivos |
| --- | --- | --- |
| 1 | Saludos y presentaciones | hello/goodbye, my name is, nice to meet you |
| 2 | Pronombres y verbo *to be* | I am, you are, he/she/it is, negativas y preguntas |
| 3 | Números, edades y países | 0–100, how old, where are you from |
| 4 | Familia y personas | mother, brother, friend; posesivos my/your |
| 5 | Objetos cotidianos | chair, table, phone; this/that, a/an |
| 6 | Casa y habitaciones | kitchen, bedroom; there is / there are |
| 7 | Comida y bebidas | apple, water; I like / I don't like |
| 8 | Rutinas y presente simple | wake up, work; 3ª persona -s |
| 9 | Horarios y días | days, time, at/on/in |
| 10 | Lugares de la ciudad | bank, park; where is |
| 11 | Gustos y preferencias | love, hate, prefer |
| 12 | Preguntas y conversaciones básicas | wh- questions, pedir y responder |

5–8 lecciones por unidad. El MVP cargará primero las unidades 1–3 con revisión editorial y luego el resto.

## Tipos de ejercicio

Imagen→palabra, palabra→traducción, traducción ES→EN, completar palabra, completar frase, ordenar palabras, palabra en contexto, audio→respuesta, relacionar pares, respuesta breve.

## Validación de respuestas abiertas

Normalización: `trim`, colapsar espacios, minúsculas, ignorar puntuación final, unificar apóstrofos (`'`/`’`). Se aceptan sólo las variantes listadas en `accepted_variants` (p. ej. *I'm* / *I am*). Tolerancia tipográfica, si se agrega, será explícita y documentada (p. ej. distancia de Levenshtein ≤ 1 para palabras de ≥ 6 letras, nunca en el ejercicio que evalúa la ortografía).

## Repetición espaciada (v1)

Intervalos configurables 1 → 3 → 7 días; un fallo vuelve al inicio y prioriza la palabra. "Dominada" exige ≥ 3 aciertos consecutivos espaciados, no un solo acierto.

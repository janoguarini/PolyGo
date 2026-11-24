# A1 + A2 y Ranked en los seis cursos (2026-11-23)

Estado: **migración APLICADA en producción el 2026-11-24 (~03:20Z, historial 137→138, `created_by` «claude-code via mcp execute_sql»). Cliente en local, sin commit ni build.** Verificación: backup físico 2355598525 (2026-11-23 13:31Z) COMPLETED; PRECHECK OK; ensayo con ROLLBACK OK; POSTCHECK: los 6 idiomas available + Ranked, 1 rating inicial nuevo (fr, 100), ratings, historial, perfiles e inscripciones previos idénticos (md5).

## 1. Punto de partida (lectura de producción, proyecto `wtymosvsymzoosxscnxi`, 2026-11-23)

| Curso        | Estado    | Ranked | Unidades publicadas                                       | Palabras publicadas | Cliente (`shared/languages.ts`) |
| ------------ | --------- | ------ | --------------------------------------------------------- | ------------------- | ------------------------------- |
| `en-from-es` | available | sí     | A1 12 · A2 17 · B1 12 · B2 12 (+ A1 U13–U14 sin publicar) | 993                 | A1, A2 · Ranked                 |
| `fr-from-es` | available | **no** | A1 17 · A2 13                                             | 548                 | A1, A2 · **sin Ranked**         |
| `it-from-es` | available | sí     | A1 16 · A2 12                                             | 496                 | **sólo A1**                     |
| `pt-from-es` | available | sí     | A1 16 · A2 12                                             | 479                 | **sólo A1**                     |
| `zh-from-es` | available | sí     | A1 16 · A2 12                                             | 430                 | **sólo A1**                     |
| `es-from-en` | **soon**  | **no** | A1 17 · A2 12                                             | 533                 | **soon, sin niveles**           |

El contenido A1 + A2 ya estaba completo, cargado y publicado en los seis idiomas: **no se generó ni se
regeneró contenido**. Lo que faltaba era coherencia entre base, cliente, test de nivel y Ranked.

Ranked ya era independiente por idioma: `player_ratings` (PK `user_id, language_code`), `rating_history`
y `battles.language_code`; el servidor de partidas sólo empareja jugadores del mismo idioma
(`server/src/matchmaking.ts`). Hoy cada idioma de destino tiene un único curso (`courses.is_default`), así
que «por idioma» = «por curso».

## 2. Cambios

### Base de datos (preparado, **sin aplicar**)

`supabase/pending/20261226120000_ranked_all_courses.sql` (vive en `pending/` como `enable_fr`, porque
depende de las publicaciones de fr y es, que en este repo también están en `pending/`):

1. Guardas: fr y es con A1 y A2 publicados, ≥ 4 palabras publicadas, modelo de cursos presente.
2. `ranked_available = true` en fr y es.
3. `content_status = 'available'` en es (sólo si estaba en `soon`).
4. Rating inicial (100, sin posicionar) para quien ya tiene fr o es como idioma actual o inscripto.
5. Comprobación final. No toca ratings existentes, historial, partidas ni progreso. Idempotente.

Reversión manual: `supabase/rollback/20261226120000_ranked_all_courses.down.sql` (apaga fr/es y vuelve es
a `soon`; no borra ratings; se niega si hay perfiles estudiando español).

### Cliente

- `shared/languages.ts`: it/pt/zh con `['A1', 'A2']`; fr con Ranked; es `available`, `['A1', 'A2']`, Ranked.
- Test de nivel para los seis cursos: `content/placement/select.ts` (fuentes de it/pt/zh/es),
  `content/placement/banks.generated.ts` regenerado (`npm run content:placement`). En chino el banco trae
  el pinyin de sus preguntas (`PlacementBank.readings`, `shared/placement.ts`) y la pantalla
  `src/app/placement/[code].tsx` lo muestra.
- Ranked: la consigna «Elegí la traducción al español» pasa a usar el idioma de apoyo del curso
  (`chooseTranslation`, `src/features/battle/strings.ts`): en el curso de español pide la traducción **al
  inglés**.
- Onboarding (`src/app/onboarding.tsx`, en español): sólo ofrece cursos que se enseñan desde el español. El
  de español (desde inglés) se empieza desde «Tus cursos» (grupo «Para hablantes de inglés»).

### Verificación contra producción (sólo lectura)

Las 72 preguntas de los seis bancos existen en producción, publicadas y con la misma respuesta.

## 3. Glicko / Stage 3

Glicko-1 (Etapa 2) y la Etapa 3 están diseñados e implementados **sólo en el repositorio original**
(`PolyGo`, rama `feature/ranked-server-authority`, sin commit): 10 migraciones `20261210…`–`20261212200000`,
`shared/glicko.ts`, cambios en `server/src/settlement.ts` y un proceso batch. Nada de eso está en producción
(sin columnas de Glicko, sin esquemas de la Etapa 3) ni en este repositorio. Glicko corre en paralelo
(sombra) y su paso a sistema visible, ρ, épocas y backfills son decisiones pendientes del dueño
(`docs/RANKED_GLICKO.md` §9, `docs/RANKED_STAGE3_SPEC.md` del original).

Su diseño ya es por `(user_id, language_code)`, así que es compatible con Ranked en los seis cursos. **No se
integró en este trabajo**: no hace falta para que cada curso tenga rating, historial y estadísticas
independientes (el ELO actual ya lo cumple), y portarlo implica migraciones, servidor y batch que requieren
autorización y revisión aparte. No se creó un segundo sistema de rating.

## 4. Pendiente

- Aplicar la migración en producción (con autorización, backup vigente y PRECHECK).
- Build de tienda: ninguna versión publicada tiene estos cambios del cliente (no hay `expo-updates`). Sin
  build, la app actual sigue leyendo su `shared/languages.ts`: ve es como «Próximamente» y fr sin Ranked
  aunque la base ya lo permita (sin romper nada: sólo no lo ofrece).
- Registro en inglés para quien no habla español (Fase 5 de `MULTILINGUAL_ONBOARDING_PLAN.md`).
- Inglés A1 U13–U14: cargadas sin publicar a la espera de la decisión D2 (desbloqueo) de
  `docs/A1_EN_CLOSURE.md`. El A1 publicado (12 unidades) no cambia.
- Inglés B1/B2 publicados en la base pero no en `shared/languages.ts` (fuera del alcance A1–A2).
- Glicko / Stage 3 (§3).

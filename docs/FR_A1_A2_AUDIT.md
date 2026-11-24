# Francés A1–A2: auditoría (Fase 0)

Fecha: 2026-11-21. Solo lectura: no se modificó ningún archivo de `Polygo-client` ni de `PolyGo`. Este
documento es lo único que se agregó. No se aplicaron migraciones ni se hicieron builds, despliegues o
commits.

## Conclusión

**El curso de francés A1–A2 ya está implementado en el cliente.** Se hizo el 2026-11-14, con la
arquitectura del italiano, y está documentado en [FR_A1_A2.md](FR_A1_A2.md). No hay que escribirlo de
nuevo. Lo que se pedía como «piloto a preservar» es en realidad el curso completo: A1 U1–U17 y A2 U1–U12.

Diferencias con lo pedido en la consigna:

1. **Migraciones fuera del cliente.** `20261202120000_fr_a1_a2.sql` y
   `pending/20261203120000_publish_fr_a1_a2.sql` existen solo en `PolyGo`. En el cliente no están porque
   forman parte de las migraciones `NOT_APPLIED` que se dejaron fuera a propósito en A1.3, hasta decidir
   su orden. El generador las reproduce byte a byte (§4).
2. **Dos temas del programa pedido sin una enseñanza explícita** (§5): los pronombres tónicos y el
   imperativo con _tu_ y _nous_.

## 1. Contenido francés existente

| Qué         | Estado                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Unidades    | 29: A1 U1–U17 y A2 U1–U12 (`content/fr/a1`, `content/fr/a2`)                                                                     |
| Lecciones   | 290: 145 escritas y 145 repasos generados por `unitPath` (rev1, rev2, listen, words, final)                                      |
| Ejercicios  | 2898: 1448 escritos y 1450 generados                                                                                             |
| Palabras    | 528 (A1 322, A2 206), con ids `fr-…`                                                                                             |
| Apoyo       | 229 formas (A1 63, A2 166)                                                                                                       |
| Comprensión | 188 preguntas `context_choice` sobre 69 estímulos de audio y texto (inventario de FR_A1_A2.md, validado por `fr.test`)           |
| Escritura   | 24 tareas (`content/fr/writing.ts`): 21 guiadas y 3 libres                                                                       |
| Ids         | 2351 ítems en `content/ids.lock.json`; ids de lección `fr-a1-u01-l01` … `fr-a2-u12-final`, únicos                                |
| Idioma      | `shared/languages.ts`: `fr`, `status: 'hidden'`, `ranked: false`, `levels: []`, `fr-FR`; la app usa `VISIBLE_LANGUAGES`          |
| Validador   | `content/fr-checks.ts` y `scripts/fr-check.ts`                                                                                   |
| SQL         | `scripts/build-fr-sql.ts` (carga) y `scripts/build-fr-publish-sql.ts` (publicación); `npm run content:fr` / `content:fr-publish` |
| Pruebas     | `content/__tests__/fr.test.ts` (25) y `supabase/tests/frContent.test.mjs` (8, en PGlite)                                         |

Para comparar: el italiano tiene 80 lecciones escritas y 1540 ejercicios en lo que agregó; el francés
tiene 145 lecciones escritas y 1448 ejercicios escritos.

**Igual al original.** Todos los archivos de francés y de integración del cliente son idénticos byte a
byte a los de `PolyGo`: `content/fr/`, `fr-course.ts`, `fr-checks.ts`, las pruebas, los scripts,
`shared/languages.ts`, `content/writing.ts`, `content/comprehension.ts`, `content/ids.lock.json`,
`content/path.ts` y `FR_A1_A2.md`.

## 2. Arquitectura (reutilizada, sin motores nuevos)

- **Camino propio.** `FR_PATH`, fuera de `COURSES` y de `CURRICULUM_PATH`, igual que el italiano, el
  portugués y el chino. Cada unidad es un `ExpansionUnitDef` más `support`.
- **Repasos.** Los genera `unitPath(…, { unitWordsOnly: true })`, el mismo generador de los demás idiomas.
- **Registro.** `FR_PATH` entra en el registro de ítems y en el catálogo (`content/comprehension.ts`). La
  escritura entra en `content/writing.ts`.
- **Base de datos.** Se usa la plantilla _add-only_ de carga: todo nace `is_published = false` y los ítems
  en `draft`. La publicación es aparte y solo hace `UPDATE` de estado.
- **Motores.** El Learning Machine, SRS, Mastery, Adaptive, Ranked, ELO y XP no tienen nada específico del
  francés.

## 3. Archivos que harían falta

- **Archivos nuevos:** ninguno para el curso actual.
- **Archivos existentes a modificar:** ninguno para el curso actual.
- **Si se cubren las lagunas del §5:** contenido nuevo en `content/fr/`, ids nuevos en `ids.lock.json`
  (`npm run content:ids`), migración regenerada (cambia su SHA-256) y ajuste de los recuentos esperados en
  `fr.test.ts`, `frContent.test.mjs` y `FR_A1_A2.md`.

## 4. Migraciones

| Archivo                                       | En `PolyGo` | En el cliente | Regenerada desde el cliente            |
| --------------------------------------------- | ----------- | ------------- | -------------------------------------- |
| `migrations/20261202120000_fr_a1_a2.sql`      | sí          | **no**        | idéntica, SHA-256 `e2417402…0ad4e12`   |
| `pending/20261203120000_publish_fr_a1_a2.sql` | sí          | **no**        | idéntica, SHA-256 `168f080e…6ab0229ee` |

- **Carga:** 29 unidades, 290 lecciones, 528 palabras, 2898 ejercicios y 2351 ítems en `draft`.
- **Publicación:** 2163 ítems activos; los 188 `context_choice` quedan en `draft`.

La carga depende de las migraciones de contenido anteriores, que tampoco están en el cliente:
`20261113120300_planned_lessons…`, `a1_en_closure`, `a2_en_completion`, `b1_en`, `b2_en`, `pt_a1_a2`,
`it_a1_a2` y `zh_a1_a2`. Por eso copiar solo la del francés no alcanza. Incorporarla es parte de la
reconciliación pendiente de `migrations/`, que necesita autorización aparte.

## 5. Programa: cobertura frente a la consigna

Están cubiertos con explicación explícita en español y ejercicios:

- presentaciones, alfabeto y pronunciación (vocales nasales, _liaison_, elisión, consonantes mudas);
- números, fechas y hora;
- género, artículos y partitivos;
- _être_, _avoir_, _aller_ y _faire_, y los verbos en _-er_;
- negación y las tres formas de preguntar;
- posesivos, adjetivos (concordancia y posición) y _c'est un médecin_ frente a _elle est médecin_;
- falsos amigos (_les parents, la chambre, rester_…);
- _passé composé_ con _avoir_ y con _être_ (con concordancia) y futuro próximo;
- _imparfait_ y futur simple;
- comparativo y superlativo (_meilleur, la plus chère du magasin_);
- frecuencia (_toujours, souvent_) y pronominales (también en pasado);
- pronombres complemento (_le / la / les, lui / leur, en, y_) e imperativo con _vous_;
- los temas de transporte, salud, trabajo, vivienda, compras, tecnología, relaciones y opiniones.

**Lagunas:**

| Tema pedido              | Situación                                                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Pronombres tónicos       | _moi, toi_ aparecen solo en fórmulas (_et toi?_). _Lui, eux, elles_ como tónicos y _chez moi, avec eux, moi aussi / moi non plus_ no se enseñan |
| Imperativo con tu / nous | Solo se enseña el de _vous_ (A1 U10 _tournez, allez_; A2 U8 _reposez-vous_). Falta _prends, viens, regarde_ (sin la _s_ en _-er_) y _allons-y_  |

Detalle menor: el comentario de `content/fr-course.ts` dice «A1 U1–U16», pero el curso tiene A1 U1–U17.
No se corrigió.

## 6. Validación ejecutada (2026-11-21)

| Prueba                                          | Resultado       | Dónde                                                   |
| ----------------------------------------------- | --------------- | ------------------------------------------------------- |
| `npx tsx scripts/fr-check.ts`                   | OK, 0 problemas | cliente                                                 |
| `npm run typecheck` (app y scripts)             | OK              | cliente                                                 |
| `eslint` sobre los archivos de francés          | OK              | cliente                                                 |
| `jest content/__tests__/fr.test.ts`             | 25/25           | copia temporal con la migración regenerada              |
| `node --test supabase/tests/frContent.test.mjs` | 8/8             | copia temporal con la cadena de `PolyGo`                |
| `jest content` (19 suites)                      | 6026/6026       | copia temporal con migraciones y `pending/` de `PolyGo` |

- **En el cliente real,** `fr.test.ts` no llega a ejecutarse: lee `supabase/migrations/20261202120000_fr_a1_a2.sql`,
  que no está (§4). Las suites de los otros idiomas (`it`, `pt`, `zh`, `es`, `b1`, `b2`) fallan por la
  misma razón. Es preexistente y no tiene relación con el francés.
- **Copia temporal:** se hizo en el directorio temporal de la sesión, con un enlace a `node_modules` y sin
  `.env`. Se borró al terminar, y el cliente no tiene ningún archivo modificado por esta auditoría.
- **No se ejecutó:** no hubo instalaciones, migraciones contra Supabase, `db push`, builds, despliegues ni
  commits.

## 7. Cómo se probará desde el perfil (cuando se autorice)

Ya está descrito en [FR_A1_A2.md §6](FR_A1_A2.md). En resumen:

1. Reconciliar `migrations/` y aplicar las cargas en orden, como mínimo hasta `20261202120000_fr_a1_a2.sql`.
2. Mover la publicación de `pending/` a `migrations/`, correr `npm run test:db` y aplicarla.
3. Habilitarlo **solo para testers**, con el mecanismo beta que ya existe (`content_testers`; hoy ningún idioma está en `beta` en `shared/languages.ts`):
   - crear la fila `fr` en `public.languages` con `content_status = 'beta'`;
   - en `shared/languages.ts`, pasar `fr` de `hidden` a `beta` y definir `levels`;
   - agregar la cuenta de prueba a `public.content_testers`.

   Con eso, `is_content_tester()` le permite a esa cuenta elegir el francés en el selector de idiomas del
   perfil (`isSelectable` en el cliente y `set_target_language` en el servidor), y el resto de los
   usuarios lo ve como «Próximamente». El cambio en `shared/languages.ts` necesita una build nueva.
   Pasarlo a `available` lo abriría para todos.

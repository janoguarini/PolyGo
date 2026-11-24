# Perfil 2.0: XP, niveles, compatibilidad de cosméticos y rediseño

Estado al 2026-11-21: **implementado en el cliente (sin commit) y backend preparado SIN aplicar**.
Ninguna migración, función ni dato de producción fue modificado. No se instaló ninguna dependencia.

Continúa [PROFILE_CUSTOMIZATION.md](PROFILE_CUSTOMIZATION.md) (Personalización v2 + invitaciones), cuyas dos
migraciones (`20261222120000`, `20261222120100`) también siguen sin aplicar. Las dos migraciones de este
documento van **después** de esas.

---

# QA visual segura: modo PREVIEW de XP (fase 3 — 2026-11-21)

Objetivo: ver en el development build de iOS el nivel, el XP, la barra, el «+N XP», la subida de nivel, la
tarjeta del jugador, los próximos objetivos y la compatibilidad de cosméticos, aunque `sync_xp` no exista en
producción. Sin migraciones, sin SQL contra Supabase, sin dependencias, sin cambios de EAS, sin commit.

## Q1. Cómo se activa

Hace falta **las dos cosas**: Metro en modo desarrollo (`__DEV__`) **y** la variable `EXPO_PUBLIC_XP_PREVIEW=1`.

```powershell
# PowerShell, en C:\Users\janog\Desktop\Polygo-client
$env:EXPO_PUBLIC_XP_PREVIEW='1'; npx expo start --clear
```

```bash
# bash
EXPO_PUBLIC_XP_PREVIEW=1 npx expo start --clear
```

`--clear` es necesario al prender o apagar el modo: Metro guarda en caché el valor ya incrustado. Para
apagarlo: cerrar Metro y volver a iniciarlo **sin** la variable (y con `--clear`; en PowerShell, abrir una
terminal nueva o `Remove-Item Env:EXPO_PUBLIC_XP_PREVIEW`). No hay que tocar `.env` ni `eas.json`, ni rehacer
el build (el build de desarrollo toma el JS del Metro local).

Con el modo activo, el perfil muestra arriba un panel con borde naranja punteado **«PREVIEW · XP de ejemplo»**,
la barra de nivel lleva la etiqueta **PREVIEW** y la celebración dice **«PREVIEW · ¡SUBISTE DE NIVEL!»**.

## Q2. Cómo probar los escenarios

En el panel del perfil:

| Botón | Qué muestra |
|---|---|
| **Nivel 12 · progreso bajo** | nivel 12, 15 % de la barra (al abrir, es el escenario inicial) |
| **Nivel 32 · avanzado** | nivel 32, 70 % de la barra |
| **Nivel 50 · por subir** | nivel 50, 95 % de la barra |
| **+20 XP** | aviso flotante «+20 XP · Lección completada», etiqueta dorada «+20 XP» en la tarjeta y la barra avanzando; si alcanza, sube de nivel |
| **Subir de nivel** | suma lo que falta + 10 y abre la celebración (rombo con zoom, «Nivel N», «+N XP», barra del nuevo nivel, háptica y sonido si los efectos están activados) |

Los valores salen de la curva real (`shared/xp.ts`). Cambiar de escenario no celebra (no es XP ganado) y
permite repetir la celebración (por ejemplo: «Nivel 50» → «Subir de nivel», varias veces). Probar también con
**Ajustes del iPhone → Accesibilidad → Movimiento → Reducir movimiento**: sin zoom ni deslizamientos, la barra
aparece directamente en su valor. «Próximos objetivos» muestra «Llegar al nivel N+1» con los datos de ejemplo.
La compatibilidad se prueba en **Editar perfil → Avatares** (elegir Ninja, Explorador, Académico o Cyber) y
después **Marcos / Fondos**: la grilla se filtra y la nota indica cuántos quedaron ocultos.

## Q3. Qué no escribe nada y qué queda deshabilitado

* **XP**: con PREVIEW la consulta real ni se monta: **no se llama a `sync_xp`**. Los datos viven en memoria y se
  pierden al recargar. El módulo no importa el cliente de Supabase ni `pendingRpc` (un test lo garantiza).
* **Deshabilitado en PREVIEW** (las escrituras que se disparan desde el perfil y la personalización):
  * **Guardar cambios** en Editar perfil (`profiles.update` y `equip_cosmetic`): botón inactivo con el aviso
    «PREVIEW: guardar está deshabilitado». Probar avatares, marcos y fondos en la vista previa sigue funcionando.
  * **Comprar cosméticos** («Desbloquear por N», en Personalización y en la tienda; `buy_cosmetic`): inactivo.
  * **Cambiar de idioma** desde «Mis idiomas» (`set_target_language`): avisa y no hace nada; «Gestionar» se
    oculta.
* **No se deshabilitan** (no son del perfil, o tocarlos cambiaría Polys, que está fuera de alcance). Conviene
  saberlo porque la build usa producción:
  * `sync_polys` al abrir la app y al refrescar (chip de Polys): sólo acredita lo que la base ya decidió que
    ganaste; no crea actividad.
  * `sync_cosmetics`, `sync_referral` y `get_profile_flair` al abrir: **no existen en producción** (migraciones
    sin aplicar) y la app las ignora (`PGRST202`): no escriben nada.
  * Fuera del perfil todo funciona normal y **sí escribe**: lecciones y repasos, partidas, cofre de misiones,
    tienda de protectores, Ajustes, amigos y notificaciones. Para la QA conviene quedarse en el perfil y en
    Editar perfil, idealmente con una cuenta de prueba.

## Q4. Por qué no puede activarse en producción

* La compuerta (`src/features/xp/previewGate.ts`) exige `__DEV__ && process.env.EXPO_PUBLIC_XP_PREVIEW === '1'`,
  escrito literalmente junto al `require('./preview')`. En un bundle de release `__DEV__` es `false`.
* **Verificado**: se exportó localmente un bundle de release de iOS (`expo export`, a una carpeta temporal fuera
  del proyecto, ya borrada; no es un build de EAS ni se subió nada) **con `EXPO_PUBLIC_XP_PREVIEW=1` puesto a
  propósito**. En ese bundle la compuerta quedó como `var n=null,t=!1` con la lista de dependencias vacía, y no
  aparece ningún texto del módulo («XP de ejemplo», `preview-`, el nombre de la variable): el modo **no está en
  el binario**. En el bundle de desarrollo (control positivo) el módulo sí aparece.
* Además, `.env` no viaja a EAS (está en `.gitignore`) y no se agregó la variable a `eas.json`.
* Tests: `isXpPreviewAllowed(false, '1') === false` y, sin la variable, `xpPreview === null` y `qaReadOnly === false`.

## Q5. Compatibilidad: decisiones pendientes (matriz sin cambios)

| Combinación | Estado | A favor | En contra |
|---|---|---|---|
| **Ninja + Cristal** (marco) | pendiente de decisión | completa 3 marcos con arte para el Ninja | cristales azules facetados: poco «oriental/sigilo» |
| **Ninja + Ciudad Neón** (fondo) | pendiente de decisión | cerezo en flor y noche; combina con el violeta del Ninja | escenario urbano moderno, más «Cyber» que «Ninja» |

Si se quitan, el Ninja queda con 2 marcos con arte (Hoja, Élite) y 2 fondos con arte (Bosque, Montaña; Templo
no tiene arte). `cosmeticCompatibility.test.mjs` exige hoy al menos 3 de cada uno por skin: habría que ajustarlo
junto con la decisión. El cambio sería una migración nueva más `SKIN_COMPATIBILITY`; no se tocó nada.

## Q6. Validación

| Validación | Resultado |
|---|---|
| TypeScript (`tsc --noEmit`) | 0 errores |
| Lint (`expo lint`) | 0 problemas |
| Jest XP, perfil, cosméticos y design system | **174/174** (incluye los nuevos `preview.test.ts` y `api.test.ts`) |
| PREVIEW fuera de producción | bundle de release sin el módulo, aun con la variable puesta (Q4) |
| Sincronización real intacta | `useXp` es la consulta real (`useServerXp`); `sync_xp` se llama sin parámetros; sin la migración devuelve `null` (tests) |
| Base de datos (PGlite, en serie) | xp, cosmeticCompatibility y shop: **31/31** |
| Migraciones y rollbacks | sin cambios (hash idéntico al de la fase 2) |

## Q7. Archivos de esta fase

* Nuevos: `src/features/xp/previewGate.ts`, `src/features/xp/preview.tsx`,
  `src/features/xp/__tests__/preview.test.ts`, `src/features/xp/__tests__/api.test.ts`.
* Modificados: `src/features/xp/api.ts` (`useXp` elige real o PREVIEW; tipo `XpQuery`; campo `preview`),
  `src/features/xp/XpCelebration.tsx` (escucha el panel en PREVIEW; marca PREVIEW),
  `src/features/xp/LevelProgress.tsx` (etiqueta PREVIEW), `src/app/(tabs)/profile.tsx` (panel),
  `src/app/edit-profile.tsx` (guardar deshabilitado), `src/features/cosmetics/CosmeticTiles.tsx` (comprar
  deshabilitado), `src/features/profile/components/ProfileSections.tsx` (cambiar de idioma deshabilitado),
  `docs/PROFILE_XP_LEVELS.md`.

Producción: **no se modificó nada**. No se aplicaron migraciones, no se ejecutó SQL contra Supabase, no se
cambiaron credenciales ni `eas.json`, no se instalaron dependencias, no hubo build de EAS ni commit.

---

# Revisión, ajuste y QA (fase 2 — 2026-11-21)

**Estado: READY FOR DEVELOPMENT BUILD.** Quedan dos decisiones (curva para el objetivo casual y cómo
ver el XP en el iPhone, §R8) que **no** bloquean el build: el build de desarrollo carga el JS desde el
Metro local, así que cualquier ajuste posterior no requiere otro build.

No se aplicaron migraciones, no se ejecutó SQL contra Supabase, no se instalaron dependencias, no hubo
commits. Fórmula y valores de XP **sin cambios**.

## R1. Auditoría del XP

| Verificación | Resultado | Evidencia |
|---|---|---|
| El cliente no puede asignarse XP | ✅ `sync_xp()` no tiene parámetros; `xp_events`/`player_xp` sin INSERT/UPDATE para la app; `xp_grant` sin EXECUTE | `xp.test.mjs` «permisos» |
| El servidor calcula desde eventos reales | ✅ sólo lee `learning_sessions`, `battles`/`battle_players` (inmutables, migración 209) y `user_mission_rewards` | código de `sync_xp` |
| Una actividad no da XP dos veces | ✅ `unique (user_id, source, ref)` | `xp.test.mjs`, PG17 X1–X4 |
| Topes diarios con solicitudes simultáneas | ✅ `select … for update` sobre `player_xp`. **Verificado con PostgreSQL 17 real** (nuevo `supabase/tests/pg17/xp-concurrency.mjs`): 2 dispositivos en la primera sincronización (una sola es la inicial, sin duplicados); 12 repasos y 3 dispositivos → exactamente 5; 15 victorias y 4 dispositivos → exactamente 10; sesión registrada durante una sincronización → contada una vez. **4/4.** | clúster desechable local, no Supabase |
| Abandonos no dan XP | ✅ `bp.result = 'win' or not bp.forfeited` | `xp.test.mjs` «ranked» |
| Repasos y repeticiones respetan topes | ✅ 5 y 10 por día | `xp.test.mjs` «topes diarios» |
| No altera registros originales | ✅ `sync_xp` sólo escribe en `xp_events`, `player_xp`, `player_level_ups` | código |
| Niveles iguales en TS y SQL | ✅ niveles 1–499 y `xp_progress` en 10 totales | `xp.test.mjs` |

Inconsistencias encontradas: **ninguna en el modelo**. Sí había dos problemas de cliente, corregidos (§R4).
Riesgos residuales (sin cambios): lo registrado > 7 días después de la última sincronización no suma;
alternar zonas horarias entre sesiones puede duplicar un tope un día puntual (nunca infinito).

## R2. Curvas comparadas

Simulación día a día con el contenido finito modelado (~700 lecciones nuevas por curso de inglés
A1–B2; al agotarse, las lecciones pasan a ser repeticiones de 5 XP). Perfiles:

* **Casual** (~62 XP/día el 1.er año, ~47 después): 5 días por semana; 2 lecciones, 1 repaso, 1 ranked
  (gana la mitad), desafío diario 2 de cada 5 días.
* **Activo** (~244 XP/día el 1.er año, ~215 después; 290 mientras hay lecciones nuevas): todos los días; 5
  lecciones, 3 repasos, 6 ranked (gana la mitad), desafío diario.
* **Muy activo** (~389 XP/día el 1.er año, ~360 después): todos los días; 8 lecciones, 5 repasos (tope),
  10 ranked (tope) ganando el 60 %, desafío diario.

| Nivel | **A (actual)** XP | Casual | Activo | Muy activo | B XP | Casual | Activo | Muy activo | C XP | Casual | Activo | Muy activo |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 0 | — | — | — | 0 | — | — | — | 0 | — | — | — |
| 5 | 265 | 3 d | 1 d | 1 d | 245 | 3 d | 1 d | 1 d | 215 | 2 d | 1 d | 1 d |
| 10 | 905 | 15 d | 4 d | 2 d | 795 | 12 d | 3 d | 2 d | 655 | 10 d | 3 d | 2 d |
| 20 | 3.465 | 57 d | 12 d | 8 d | 2.895 | 46 d | 10 d | 7 d | 2.255 | 36 d | 8 d | 5 d |
| 25 | 5.455 | 2,9 m | 19 d | 12 d | 4.495 | 2,4 m | 16 d | 10 d | 3.445 | 57 d | 12 d | 8 d |
| 50 | 23.380 | 12,5 m | 2,7 m | 49 d | 18.710 | 10 m | 2,1 m | 39 d | 13.835 | 7,4 m | 48 d | 29 d |
| 75 | 55.930 | 3,1 a | 7 m | 4,2 m | 44.285 | 2,3 a | 5,2 m | 3,1 m | 32.345 | 18 m | 3,7 m | 2,2 m |
| 100 | 104.380 | **6,4 a** | **14,4 m** ✅ | 8,6 m | 82.240 | 4,9 a | 11 m | 6,6 m | 59.685 | 3,4 a | 7,5 m | 4,5 m |

A = `50 + 9·(L−1)^1,2` · B = `50 + 7·(L−1)^1,2` · C = `45 + 5·(L−1)^1,2` (todas redondeadas a 5).

**Conclusión: ninguna curva puede cumplir a la vez «activo 12–18 meses» y «casual 2–3 años».** Con
las recompensas actuales el casual gana ~4–4,5 veces menos XP por día que el activo, y el tiempo
para llegar a un total fijo es proporcional al ritmo: si el activo tarda 12–18 meses, el casual tarda
4,5–6,5 años con **cualquier** curva. Bajar la curva para que el casual llegue en 3 años (C) hace que
el activo llegue en 7,5 meses y el muy activo en 4,5 (se queda sin metas). Cumplir ambos objetivos
exige cambiar el **reparto** de XP entre perfiles (p. ej. un bono por la primera actividad del día, o
topes más bajos que frenen al muy activo), lo que esta auditoría no autoriza.

## R3. Recomendación de fórmula y equilibrio

* **Mantener A** (sin cambios): cumple el objetivo del jugador activo (14,4 meses con el contenido
  agotándose), sube casi a diario al principio (nivel 10 en 2 semanas para un casual) y deja el 100 como
  meta de veterano. Para el casual, el hito motivador realista es **nivel 50 en ~1 año**.
* Si el objetivo casual de 2–3 años es firme: decidir un cambio de reparto (no de curva). Ver §R8.
* Equilibrio de actividades: razonable, sin cambios. Observación: en el perfil activo el ranked aporta
  ~41 % del XP (120 de 290) y en el muy activo ~47 %; el aprendizaje (lecciones, repasos, desafío) sigue
  siendo la mayoría. Si se quisiera reforzar el estudio, la palanca menos invasiva sería bajar el tope de
  ranked con XP de 10 a 6 por día (decisión del dueño; no aplicado).

## R4. Cambios visuales y correcciones de esta fase

* **Jerarquía del perfil** reordenada como se pidió: identidad → nivel + XP + lo que falta → rango y ELO
  → estadísticas → **próximos objetivos** (subieron) → idiomas → logros → Plus.
* **Tarjeta de rango**: el ELO pasó a la fila del nombre del rango (antes era una columna aparte con
  divisor). Cálculo a 320 pt: la columna del nombre medía ~43 pt y cortaba «Platino II»; ahora ~170 pt.
  «Faltan N ELO para X» admite 2 líneas en vez de cortarse. Emblema de 60 pt (52 pt en < 360 pt).
* **Tarjeta del jugador**: avatar 16 pt más chico en pantallas < 360 pt (más espacio para el nombre).
* **Barra de XP**: al subir de nivel se rearma y se llena desde cero (antes retrocedía animada de 90 % a
  10 %). Nueva etiqueta dorada **«+N XP»** junto a los números con lo ganado en la última sincronización
  (entrada con zoom; estática con «Reducir movimiento»). Sin sonidos nuevos ni animaciones constantes.
* **Próximos objetivos**: el título ocupa todo el ancho y debajo van la barra y el detalle (antes título
  y detalle compartían fila y el título se cortaba a 320 pt).
* **Espaciado**: 12 pt entre secciones del perfil (16 en el resto de la app).
* **Bug corregido (Personalización)**: probar una skin ajena con la que tu marco/fondo no combina los
  ponía en «ninguno» en la vista previa, y al guardar **se quitaba tu marco/fondo real** aunque la skin
  no se guardara. Ahora sólo se guarda lo elegido a mano; los ajustes automáticos de la vista previa no.
* **Explicación de la compatibilidad**: la nota dice cuántos ítems quedaron ocultos: «Marcos que combinan
  con Ninja. 3 más combinan con otros avatares; lo que ya tenés sigue en tu inventario.»
* (Fin de la fase 1) `XpCelebration` escucha la caché de consultas en vez de hacer `setState` dentro de
  un efecto (regla `react-hooks/set-state-in-effect`).

## R5. Auditoría de compatibilidad de cosméticos

Revisada contra el arte real (`assets/profile/`). Universales y neutros sin cambios (§6).

| Skin | Ítem | Confianza | Motivo |
|---|---|---|---|
| Ninja | Hoja, Élite, Bosque, Montaña | alta | naturaleza nocturna, filos |
| Ninja | Ciudad Neón | media | tiene un cerezo y es de noche, pero es urbano |
| Ninja | Cristal | **media-baja** | cristales azules; elegido porque sólo 2 marcos con arte encajan claramente |
| Ninja | Templo | sin verificar | sin arte; figura por la dirección artística del pedido (no se puede equipar) |
| Explorador | Hoja, Estelar, Montaña, Bosque, Aurora, Dimensión (ruinas) | alta | aventura al aire libre |
| Explorador | Cristal | media | cuevas/minerales |
| Académico | Hoja (laureles), Maestro (corona dorada), Galaxia, Espacial, Dimensión | alta | dorados, astronomía, saber antiguo |
| Académico | Estelar, Aurora | media | — |
| Cyber | Ciudad Neón, Estelar, Cristal, Élite, Espacial, Galaxia, Dimensión | alta | neón, energía, futuro |

Comportamiento verificado por tests: los temáticos se filtran por avatar (incluidos los bloqueados
compatibles, con precio); lo gratuito, ganado y retirado sigue accesible; cambiar de avatar no borra nada
del inventario (sólo desequipa lo incompatible); la base rechaza cualquier combinación incompatible,
también por UPDATE directo con `service_role`; la vista previa y las fichas muestran el avatar elegido.
**Decisión pendiente:** confirmar o quitar Ninja + Cristal y Ninja + Ciudad Neón; Marco Diamante y las
skins sin arte quedan sin asignar hasta ver su arte.

## R6. Tests (ejecución controlada, en serie)

* TypeScript (`tsc --noEmit` y `-p scripts`): **0 errores**. Lint (`expo lint`): **0 problemas**.
* Jest completo: **6.734/6.734 tests pasan**; 9 suites de `content/__tests__` no llegan a correr
  (ENOENT: buscan migraciones de idiomas que no están en `supabase/migrations/`; igual antes de este
  trabajo).
* PostgreSQL 17 real: `xp-concurrency.mjs` **4/4**.
* Base (PGlite), cada archivo por separado y en serie (en paralelo se queda sin memoria):

| Categoría | Archivos | Resultado |
|---|---|---|
| Propios | xp 10/10, cosmeticCompatibility 8/8 | ✅ |
| Afectados | shop 13/13, referrals 8/8, profile 17/17, polys 9/9, core 16/16, missions 7/7, battle 12/12, rankedserver 8/8, energy 6/6 | ✅ |
| Resto sin relación | attempts, blocks, botmatch, challenge, concepts, friends, humanmatch, jobs, languages, leaderboard, mastery, phase4, phase4close, phase5, push, review, srs2, stalesweep, tutorial | ✅ todos pasan |
| Fallan por migraciones de contenido ausentes (ENOENT) | a1Closure, a2Completion, b1Content, b2Content, esContent, frContent, itContent, ptContent, zhContent, planned | ❌ preexistente |
| Fallan por contenido no cargado (sin ENOENT) | a2Publish, catalog, clientCompatibility, comprehension, curriculumIsolation, curriculumPropagation, curriculumRoutes, learning, legacyReviewRetirement, presentations, routeVocabulary, versions | ❌ preexistente |
| Sin memoria (OOM) | items | ❌ no concluyente |

**Control**: esos 13 archivos se corrieron también **sin** las dos migraciones de este trabajo (apartadas
temporalmente y restauradas con hash verificado): fallan exactamente igual. **Fallos por cambios propios:
ninguno.**

## R7. EAS y development build para iPhone

Inspeccionado:

* `eas.json`: perfil `development` con `developmentClient: true` y `distribution: internal` → correcto
  para instalar en un iPhone registrado. Exige **EAS CLI ≥ 27.1.0**.
* **EAS CLI instalado globalmente: 21.0.2 → incompatible** con `eas.json`. Hay que usar `npx eas-cli@latest`
  (lo que indica AGENTS.md) o actualizar el global; no lo actualicé (sería instalar sin autorización).
* `expo` 58.0.21, `expo-dev-client` 58.0.17 instalado; sin `ios/` ni `android/` (CNG, los genera EAS).
  `expo config` resuelve sin errores (SDK 58, `com.polygoidioma.app`).
* Extensión de widgets `ExpoWidgetsTarget` con App Group `group.com.polygoidioma.app`, Sign in with Apple y
  notificaciones remotas: EAS crea las credenciales; puede pedir confirmar la creación del App Group y del
  bundle id de la extensión.
* AdMob usa los App IDs de **prueba** de Google en `app.json`: correcto para desarrollo (no tocado).
* El perfil `development` no define variables de Supabase: **no hacen falta**, porque el build de desarrollo
  toma el JS del Metro local, que lee el `.env` local.

Pasos (en `C:\Users\janog\Desktop\Polygo-client`):

```bash
npx eas-cli@latest login                     # cuenta dueña del proyecto (owner: lichigap)
npx eas-cli@latest device:create             # registrar el iPhone (abrir el enlace en el iPhone)
npx eas-cli@latest build --profile development --platform ios
```

Requisitos: cuenta paga de Apple Developer (EAS la pide durante el build). En el iPhone: instalar desde el
enlace/QR que da EAS y activar **Ajustes → Privacidad y seguridad → Modo de desarrollador**. Después, en la PC
(misma red Wi-Fi que el iPhone): `npx expo start` y abrir el proyecto desde la app instalada.

Notas: el archivo que sube EAS sale del árbol de trabajo (incluye los cambios sin commit y ~60 MB de PNG
originales sin seguimiento de la raíz; no rompe nada, sólo pesa). No usar `--profile production` ni `submit`.

## R8. Riesgos y decisiones pendientes

1. **El XP no se va a ver en el iPhone tal como está**: el build usa la base de producción, donde
   `sync_xp` no existe (migración sin aplicar). Se verá el perfil nuevo (encabezado, tarjeta, rango,
   estadísticas, objetivos de rango y logros) y el filtrado de compatibilidad, pero **no** el nivel, la
   barra de XP ni la celebración. Tampoco se pueden comprar ni equipar skins (catálogo v2 sin aplicar);
   sí probarlas en la vista previa. Opciones (requieren decisión): (a) un proyecto Supabase de staging con
   las 4 migraciones; (b) un modo de vista previa sólo en `__DEV__` con datos de XP de ejemplo (código
   nuevo, no hecho). Ninguna requiere rehacer el build.
2. El build de desarrollo apunta a **producción** (Supabase y Battle Server): usarlo genera datos reales en
   tu cuenta (lecciones, partidas ranked contra jugadores reales).
3. Curva: objetivo casual 2–3 años incompatible con el activo 12–18 meses (§R2).
4. Matriz: confirmar Ninja + Cristal / Ciudad Neón (§R5).
5. Sin QA visual real todavía: las mejoras de espacio se razonaron con medidas en código, no se vieron.

## R9. Archivos

Modificados en esta fase:
`src/features/profile/components/ProfileHeader.tsx`, `src/features/profile/components/ProfileSections.tsx`,
`src/app/(tabs)/profile.tsx`, `src/features/xp/LevelProgress.tsx`, `src/app/edit-profile.tsx`,
`docs/PROFILE_XP_LEVELS.md`. Nuevo: `supabase/tests/pg17/xp-concurrency.mjs`.

Todo el Perfil 2.0 (fases 1 y 2):

* Nuevos: `shared/xp.ts`, `shared/cosmeticCompatibility.ts`, `src/features/xp/{api.ts, announce.ts,
  LevelBadge.tsx, LevelProgress.tsx, XpCelebration.tsx}`, `src/features/xp/__tests__/{announce.test.ts,
  LevelProgress.test.tsx}`, `shared/__tests__/xp.test.ts`, `src/features/cosmetics/__tests__/compatibility.test.ts`,
  `supabase/migrations/20261222120200_player_xp.sql`, `supabase/migrations/20261222120300_cosmetic_compatibility.sql`,
  `supabase/rollback/20261222120200_player_xp.down.sql`, `supabase/rollback/20261222120300_cosmetic_compatibility.down.sql`,
  `supabase/tests/xp.test.mjs`, `supabase/tests/cosmeticCompatibility.test.mjs`,
  `supabase/tests/pg17/xp-concurrency.mjs`, `docs/PROFILE_XP_LEVELS.md`.
* Modificados (sobre cambios previos sin commit, preservados): `src/app/(tabs)/profile.tsx`,
  `src/app/edit-profile.tsx`, `src/app/_layout.tsx`, `src/features/profile/components/ProfileHeader.tsx`,
  `src/features/profile/components/ProfileSections.tsx`, `src/features/cosmetics/CosmeticTiles.tsx`,
  `src/features/cosmetics/api.ts`, `src/design-system/components/ProgressBar.tsx`,
  `src/features/battle/useBattleSession.ts`, `src/features/battle/useLocalBattleSession.ts`,
  `src/lib/pendingRpc.ts`, `src/lib/errors.ts`, `supabase/tests/shop.test.mjs` (2 aserciones),
  `docs/PROFILE_CUSTOMIZATION.md` (nota de referencia).

---

# Fase 1 — implementación

## 1. Auditoría: qué existía y qué se reutilizó

| Pieza | Estado previo | Decisión |
|---|---|---|
| XP / niveles de jugador | No existía nada (el perfil lo decía explícitamente) | Nuevo: `shared/xp.ts` + migración `20261222120200_player_xp` |
| Patrón de recompensas idempotentes | Polys: `poly_transactions` con clave única `(user_id, reason, ref)` y `sync_polys()` que **deriva** lo ganado de lo que el servidor ya registró | **Reutilizado como patrón** (no la tabla: el XP no es moneda y no debe mezclarse con el saldo). `xp_events` + `sync_xp()` funcionan igual. |
| Lecciones y repasos | `learning_sessions` (kind `lesson`/`review`, `local_date`), insertadas sólo por el servidor (Learning Machine / edge function) | Sólo se **leen**. Ningún trigger, columna ni cambio en Learning Machine. |
| Ranked | `battles`/`battle_players` (resultado inmutable por `battles_result_immutable`, migración 209), escritas por el servidor de partidas | Sólo se **leen**. No se toca ELO, emparejamiento, temporadas ni `settlement.ts`. |
| Desafío diario | 3 misiones diarias + cofre: `user_mission_rewards (user_id, mission_date)` | El cofre abierto = desafío diario cumplido (1 por día por PK). |
| Logros | Familias con niveles (`shared/achievements.ts`, `get_my_achievements`), carrusel con progreso | Reutilizado; «Próximos objetivos» elige el logro más avanzado con `familyProgress`. |
| Rangos | `shared/ranking.ts` (`getRank` con `nextStepMin`) | Reutilizado para «faltan N ELO para Plata I». |
| Cosméticos | Catálogo v2 (`shared/cosmetics.ts` ↔ `cosmetic_items`), skins en `profiles.avatar_id`, `equip_cosmetic`, `buy_cosmetic`, trigger de skins, grilla de 3 por fila, filtros de rareza y estados | Extendido con compatibilidad (tabla + función + trigger). Sin cambiar ids, precios, rarezas ni reglas de compra. |
| Perfil | `ProfileTopBar`, `ProfileHeader` (compartido con perfil público y vista previa), `StatsRow`, `LanguagesCard`, `AchievementsCard`, `PlusCard` | Rediseñados en el lugar (no se duplicó ningún componente). |
| Animación | `react-native-reanimated` (ya instalado), `useReducedMotion`; `ProgressBar` animada | `ProgressBar` ahora respeta «Reducir movimiento» (beneficia a toda la app). |
| Sonido | `playSound` con la preferencia «Efectos de sonido» | Reutilizado (`complete`) en la subida de nivel. |
| Avisos | `PolysToast` en el layout raíz | Mismo patrón para `XpCelebration`. |
| RPC pendientes | `src/lib/pendingRpc.ts` (degrada con `PGRST202`) | `sync_xp` agregada: sin la migración, el nivel simplemente no se muestra. |

## 2. Cómo funciona el XP

```
Lección / repaso ─► learning_sessions ┐
Ranked ──────────► battles/players    ├─► sync_xp() ─► xp_events (único por source+ref, topes por día)
Cofre del día ───► user_mission_rewards┘                 └─► player_xp (total, nivel) + player_level_ups
```

* **El cliente nunca informa XP.** La app sólo llama `sync_xp()` (sin parámetros). La base mira lo que el
  servidor ya guardó y acredita lo que falte.
* La app la llama al abrir y cuando se invalida `['learning']` (al terminar lección, repaso o cofre) o
  `['learning','xp']` (al terminar una partida).
* Si nunca se llama, no se pierde nada: se deriva la próxima vez (margen de 7 días; la primera vez, toda
  la historia).
* Independiente del ELO, global para la cuenta (todos los idiomas), y sin efectos económicos.

### Valores

| Actividad | XP | Clave única (`ref`) | Tope diario |
|---|---:|---|---|
| Completar una lección **por primera vez** | 20 | id de la lección | — (el contenido es finito) |
| Repetir una lección ya completada | 5 | id de la sesión | 10 por día local |
| Completar un repaso | 10 | id de la sesión | 5 por día local |
| Ganar una ranked (también si el rival abandona) | 30 | id de la partida | 10 partidas ranked por día UTC (compartido) |
| Perder/empatar una ranked jugándola hasta el final | 10 | id de la partida | (mismo tope) |
| Abandonar una ranked | 0 | — | — |
| Desafío diario (3 misiones + cofre) | 40 | fecha | 1 por día |
| Partidas amistosas, canceladas | 0 | — | — |

Cambios respecto de la propuesta inicial (todos para evitar abuso, ninguno cambia el espíritu):

1. «Completar una lección +20» se aplica **una vez por lección**; repetirla vale 5 con tope. Sin esto,
   repetir la lección más corta sería la forma más rápida de subir.
2. Perder da 10 sólo si se jugó hasta el final: entrar y abandonar al instante no da XP.
3. Tope diario en repasos y ranked.

Máximo diario sin lecciones nuevas: 50 (repeticiones) + 50 (repasos) + 300 (ranked) + 40 (desafío) =
**440 XP**. Las lecciones nuevas suman 20 cada una pero se agotan con el curso.

## 3. Curva de niveles

**XP para pasar del nivel L al L+1 = redondeo a múltiplo de 5 de `50 + 9·(L−1)^1,2`.** Sin tope práctico
(techo técnico 500). La misma fórmula está en `shared/xp.ts` y `public.xp_level_need()`; un test compara los
niveles 1–499.

Se eligió ajustando (a, b, p) contra objetivos explícitos, no a ojo: casual llega al 10 en ~2 semanas y al
50 en ~1 año; activo llega al 100 en ~1 año.

| Nivel | XP para el siguiente | XP acumulada para llegar |
|---:|---:|---:|
| 1 | 50 | 0 |
| 2 | 60 | 50 |
| 3 | 70 | 110 |
| 4 | 85 | 180 |
| 5 | 100 | 265 |
| 10 | 175 | 905 |
| 15 | 265 | 1.960 |
| 20 | 360 | 3.465 |
| 25 | 460 | 5.455 |
| 30 | 560 | 7.955 |
| 40 | 780 | 14.550 |
| 50 | 1.010 | 23.380 |
| 60 | 1.250 | 34.555 |
| 75 | 1.625 | 55.930 |
| 100 | 2.285 | 104.380 |

### Simulación (fase 1, sin modelar que el contenido se agota — reemplazada por §R2)

| Perfil | Qué hace | XP/día (promedio semanal) |
|---|---|---:|
| Casual | 5 días por semana: 2 lecciones nuevas, 1 repaso, 1 ranked (gana la mitad) y el desafío diario 2 de cada 5 días | ~61 |
| Activo | Todos los días: 5 lecciones nuevas, 3 repasos, 6 ranked (gana la mitad) y el desafío diario | 290 |

| Nivel | XP total | Casual | Activo |
|---:|---:|---:|---:|
| 2 | 50 | día 1 | día 1 |
| 5 | 265 | ~5 días | día 1 |
| 10 | 905 | ~15 días | ~4 días |
| 25 | 5.455 | ~3 meses (89 días) | ~3 semanas (19 días) |
| 50 | 23.380 | ~1 año (381 días) | ~2,7 meses (81 días) |
| 100 | 104.380 | ~4,7 años | ~1 año (360 días) |

Lectura: la primera sesión ya sube al nivel 2 (2–3 lecciones); al principio se sube casi a diario; el 50
es una meta de un año para alguien casual; el 100 es el objetivo de largo plazo del jugador activo.
Limitación de la simulación: supone lecciones nuevas todo el tiempo. Cuando un jugador activo termina el
contenido de su idioma su ritmo baja a ~215 XP/día (el 100 pasaría a ~16 meses). Recalibrar con datos
reales después del lanzamiento; la curva vive en un solo lugar (shared/xp.ts + xp_level_need).

## 4. Prevención de duplicados y farming

| Riesgo | Mitigación |
|---|---|
| Cobrar dos veces lo mismo | `unique (user_id, source, ref)` en `xp_events`; `on conflict do nothing`. |
| Dos dispositivos sincronizando a la vez | `select … for update` sobre `player_xp` serializa las sincronizaciones del usuario (topes exactos). |
| El cliente inventa XP | No hay parámetro de XP: `sync_xp()` sólo lee tablas que escribe el servidor. `xp_events`/`player_xp` sin INSERT/UPDATE para `authenticated`; `xp_grant` sin EXECUTE para la app. |
| Repetir la lección más corta | lesson_first una vez por lección; repeticiones a 5 XP con tope de 10/día. |
| Repasos en bucle | Tope de 5/día (además el repaso lo arma el servidor). |
| Entrar y abandonar ranked | Abandonar da 0. |
| Win-trading entre dos cuentas | Tope de 10 ranked/día con XP (máx. 300). El ELO ya tiene sus propias defensas (multiplicador de rival repetido). |
| Cambiar la zona horaria para reiniciar topes | Los topes se cuentan en `xp_events.day`: para lecciones y repasos, el `local_date` que quedó fijado al registrar la sesión (no lo que manda la app al sincronizar: `sync_xp` no recibe zona horaria); para ranked, día UTC. Residual: como `local_date` sale de una zona horaria válida, alternar zonas entre sesiones puede repartir actividad entre dos fechas contiguas (como mucho duplica un tope un día puntual, nunca lo vuelve infinito). |
| Total desviado | `total_xp` se recalcula como `sum(amount)` de los eventos en cada sincronización. |
| Resultados de partidas alterados | `battles`/`battle_players` son inmutables tras terminar (migración 209). |

Riesgo residual documentado: lo registrado más de 7 días después de la última sincronización no suma
(cola sin conexión muy vieja). Es raro y no se puede abusar (sólo resta).

## 5. Subida de nivel

* `sync_xp()` devuelve `level_before` y `level`. Si subió, `XpCelebration` (layout raíz) abre una tarjeta
  modal: rombo dorado con el nivel (entrada con zoom), «Nivel N», «+X XP», barra hacia el siguiente nivel y
  «Continuar». Háptica de éxito y sonido `complete` (respeta «Efectos de sonido»).
* Si no subió, aviso discreto «+20 XP · Lección completada» debajo del de Polys (2,4 s, no bloquea toques).
* Con «Reducir movimiento»: sin zoom, sin deslizamientos, la barra aparece en su valor.
* La primera sincronización (historia) **no** se celebra. Cada nivel se celebra una sola vez por sesión.
* Recompensas por nivel: **no hay**. `player_level_ups (user_id, level)` registra cada nivel alcanzado
  una vez: es la clave idempotente para premios futuros (p. ej. `poly_credit(…, 'level', N)`) y
  `XP.levelRewards`/`xp_config().levelRewards` están vacíos a propósito. Requiere aprobación.

## 6. Compatibilidad de cosméticos

Reglas (iguales en `shared/cosmeticCompatibility.ts` y `public.cosmetic_compatible()`):

1. Sólo se filtran los ítems **temáticos**: los que se venden por Polys en el catálogo vigente.
2. **Universales**: lo gratuito (Básico, Sólido), lo ganado (marco de rango, Plus, invitaciones, evento,
   temporada) y lo retirado. Nadie pierde algo que ganó o compró antes de esto.
3. **Avatares neutros** (combinan con todo): Clásico, los zorros/animales básicos, la foto propia y las
   skins todavía sin arte.

Matriz (decidida mirando el arte real de `assets/profile/`):

| Skin | Arte | Marcos | Fondos |
|---|---|---|---|
| Ninja | violeta nocturno, bandana 狐, katana | Hoja, Cristal, Élite | Bosque, Montaña, Ciudad Neón (cerezo + noche), Templo* |
| Explorador | gafas, mochila, montañas | Hoja, Estelar (estrella-brújula), Cristal | Montaña, Bosque, Aurora, Dimensión (ruinas) |
| Académico | birrete, libros, globo, dorados | Hoja (laureles), Estelar, Maestro (corona dorada) | Aurora, Espacial, Galaxia (astronomía), Dimensión (saber antiguo) |
| Cyber | visor, neón, rascacielos | Estelar (energía), Cristal, Élite (filos) | Ciudad Neón, Espacial, Galaxia, Dimensión |

\* Templo no tiene arte todavía (no se vende ni se equipa); figura porque la dirección artística del
pedido lo asocia explícitamente al Ninja. **Marco Diamante** (sin arte) no se asignó a ninguna skin: no se
puede juzgar sin verlo. Todos los marcos/fondos temáticos con arte combinan con al menos una skin (test).

Comportamiento:

* **Personalización**: al elegir avatar, las pestañas Marcos y Fondos muestran sólo lo compatible
  (incluidos los bloqueados compatibles, con precio) y una nota «Marcos que combinan con Ninja».
  La selección se mantiene si sigue siendo válida; si no, vuelve al predeterminado.
* **Base** (no depende de la app): trigger `profiles_guard_compat` en `profiles`:
  elegir a mano un marco/fondo incompatible → error `cosmetic_incompatible` (también por `service_role`
  o UPDATE directo); cambiar de avatar → lo incompatible vuelve a null (predeterminado).
* **Compra**: precio, cobro y reglas idénticos. Si el ítem no combina con el avatar actual, se compra
  igual y queda en el inventario (`equipped: false`); la app lo explica y muestra «Combina con…».
* Guardado en Personalización: primero el avatar, después marco y fondo (la base valida contra el
  avatar ya guardado).

**Escalar**: nuevo personaje = fila en `shared/cosmetics.ts` + entrada en `SKIN_COMPATIBILITY` + las mismas
filas en una migración nueva. Nuevo marco/fondo = agregarlo a las listas de las skins con las que combine.
Los tests verifican que ambos lados coincidan.

## 7. Rediseño del perfil

Orden nuevo: (1) encabezado compacto en **una** fila: avatar, nombre (oculto en < 360 pt), racha, Polys,
Ajustes; (2–3) tarjeta del jugador sobre su fondo equipado: avatar con marco, nombre, bandera, @usuario,
insignias y, dentro, nivel + barra de XP + «340 / 520 XP» + «Faltan 180 XP para el nivel 12»; (4) liga y
ELO con «Faltan N ELO para X»; (5) estadísticas en una sola franja de 3 columnas (antes 3 tarjetas
altas); (6) Mis idiomas; (7) Logros + **Próximos objetivos** (próximo nivel, próximo escalón de ranked o
«Entrar al ranking», logro más avanzado; cada uno con barra y acceso); (8) Plus. Debajo, lo que ya había
(estadísticas por período, aprendizaje, historial competitivo).

El texto dentro de la tarjeta del jugador usa colores claros fijos: los fondos del perfil son siempre
oscuros, así que ahora se lee también en tema claro (antes usaba tokens del tema).

Personalización: vista previa con fila «Avatar · Marco · Fondo», nota de compatibilidad, grilla filtrada
por avatar (ya era de 3 por fila con filtros de rareza y estados equipado/desbloqueado/precio/bloqueado/
próximamente), las fichas de marcos muestran el avatar elegido.

## 8. Migraciones preparadas (NO aplicadas)

### `supabase/migrations/20261222120200_player_xp.sql`
* Tablas: `player_xp` (PK user_id; total, nivel, initialized, synced_at), `xp_events` (identity; único
  `(user_id, source, ref)`; `day`; `amount > 0`), `player_level_ups` (PK user_id+level).
* Índice: `xp_events_user_day_idx (user_id, day, source)` para los topes.
* RLS: lectura sólo del dueño; sin INSERT/UPDATE/DELETE para `anon`/`authenticated`. Borrado en cascada
  con la cuenta.
* Funciones: `xp_config()`, `xp_level_need(int)`, `xp_progress(int)` (puras), `xp_grant(...)` (interna, sin
  EXECUTE para la app), `sync_xp()` (`security definer`, `auth.uid()`; EXECUTE sólo `authenticated`).
* Aditiva: no reemplaza ni altera nada existente. Rollback: `supabase/rollback/20261222120200_player_xp.down.sql`.

### `supabase/migrations/20261222120300_cosmetic_compatibility.sql`
* Requiere `20261222120000_profile_customization` (skins, `is_retired`).
* Tabla `cosmetic_compatibility (skin_id, item_id)` con FK a `cosmetic_items`, lectura para `authenticated`.
* Función `cosmetic_compatible(avatar, item)`; trigger `profiles_guard_compat` (BEFORE INSERT/UPDATE OF
  avatar_id, frame_id, background_id).
* Reemplaza `buy_cosmetic` (misma lógica de 120000 + `equipped`).
* Rollback: `supabase/rollback/20261222120300_cosmetic_compatibility.down.sql` (quita trigger/función/tabla
  y restaura `buy_cosmetic` copiado literal de 120000).
* Datos actuales: producción (consulta de sólo lectura del 2026-11-21 en PROFILE_CUSTOMIZATION.md) no tiene
  marcos/fondos equipados ni skins, así que no hay combinaciones previas a corregir. El trigger no toca filas
  existentes hasta que cambien.

### Plan de aplicación (requiere autorización explícita)
1. Backup verificado inmediatamente antes.
2. Aplicar en una base desechable/staging en orden: 120000 → 120100 → 120200 → 120300, y correr
   `npm run test:db` contra esa base.
3. Producción, mismo orden.
4. Regenerar `src/lib/database.generated.ts`, reemplazar `callPendingRpc('sync_xp')` por la llamada tipada.
5. Publicar el cliente (requiere build).
6. Primera vez que cada usuario abre la app: `sync_xp` acredita su historia sin celebrarla.

## 9. Pruebas

* `supabase/tests/xp.test.mjs` (PGlite): espejo de config y curva (niveles 1–499), primera vez/repetición,
  topes diarios, ranked (ganar/perder/empate/abandono/amistosa/cancelada y tope compartido), desafío
  diario, historia inicial, subida de nivel, margen de 7 días, permisos (no escribir, no leer ajeno, anon),
  borrado en cascada.
* `supabase/tests/cosmeticCompatibility.test.mjs`: espejo de la matriz, `cosmetic_compatible` = app para
  cada avatar × ítem, cobertura de la matriz, equipar incompatible rechazado, cambio de avatar, universales,
  compra incompatible (cobra, guarda, no equipa), UPDATE directo por `service_role` rechazado.
* `supabase/tests/shop.test.mjs`: la respuesta de `buy_cosmetic` incluye `equipped`.
* Jest: `shared/__tests__/xp.test.ts`, `src/features/cosmetics/__tests__/compatibility.test.ts`,
  `src/features/xp/__tests__/announce.test.ts`, `src/features/xp/__tests__/LevelProgress.test.tsx`.
* Limitación: PGlite tiene una sola conexión; la serialización real entre dos dispositivos (`for update`)
  debe verificarse en staging.

## 10. Pendientes

* QA visual en dispositivo (320 pt, 375 pt, 430 pt; Android e iOS; tema claro): **no se pudo ver** la app
  en este entorno (sin dispositivo, y el perfil exige iniciar sesión contra producción).
* Mostrar el nivel en el perfil público y la clasificación (necesita una RPC de lectura pública; fuera de
  este alcance).
* Recompensas por nivel (económicas o cosméticas): sin definir, requieren aprobación.
* Arte faltante (Templo, Marco Diamante, skins sin arte) y su lugar en la matriz.
* Recalibrar curva y topes con datos reales.

# PolyGo — Auditoría técnica de AdMob (Fase 0, solo lectura)

> **Fecha:** 2026-11-21 · **Alcance:** auditoría y diseño. **No se implementó nada.**
> Este es el único archivo creado. No se instalaron dependencias, no se ejecutó SQL, no se tocó
> Supabase, Expo, EAS, la web ni la política de privacidad. El repositorio original
> (`C:\Users\janog\Desktop\PolyGo`) solo se consultó para comparar.
>
> **Resultado:** `ADMOB PHASE 0 — AUDIT COMPLETE`. La integración **no** está hecha.

---

## 1. Estado inicial de Git

| Dato | Valor |
|---|---|
| Repositorio | `C:\Users\janog\Desktop\Polygo-client` (worktree del repo `PolyGo`) |
| Branch | `client/stage0` (local, sin push) |
| HEAD | `b2b136c7d567f8fd1415d6493026dbc273a88f90` — «learning-session v4: despliegue aislado de la corrección instantánea» |
| Otro worktree | `C:/Users/janog/Desktop/Polygo` en `52de70f` [`feature/ranked-server-authority`] |
| Cambios sin commit | 305 entradas en `git status --short` (modificados, un borrado y muchos sin seguimiento) |

Los cambios previos más relevantes para AdMob:

- `app.json` modificado: agrega `ios.usesAppleSignIn` y los plugins `expo-web-browser` y `expo-apple-authentication` (login social pendiente).
- `package.json` modificado: agrega `expo-apple-authentication`, `expo-crypto` y `expo-web-browser`.
- Sin seguimiento: 31 PNG en la raíz (`Zorro *.png`, `Marco *.png`, `Fondo *.png`). Parecen arte de futuras skins. No están integrados en el código.
- Sin seguimiento: migraciones, `supabase/functions/learning-session/`, docs y scripts de las fases de aprendizaje.

No se limpió ni se revirtió nada. Este informe es el único cambio nuevo.

## 2. Package name de Android (verificado)

`com.polygoidioma.app`. Fuente: `app.json` → `expo.android.package`.

## 3. Bundle ID de iOS (verificado)

`com.polygoidioma.app`. Fuente: `app.json` → `expo.ios.bundleIdentifier`.
Extensión de widgets: `com.polygoidioma.app.ExpoWidgetsTarget`, App Group `group.com.polygoidioma.app`
(`expo.extra.eas.build.experimental.ios.appExtensions`).

> El nombre del paquete es `polygoidioma` (singular). El sitio provisorio es `polygoidiomas.netlify.app`
> (plural). Las dos cosas son coherentes por separado, pero conviene tener presente la diferencia al
> cargar la web del desarrollador en las tiendas (ver §8 de app-ads.txt, más abajo).

## 4. Configuración actual de Expo y EAS

**Hay una sola fuente de configuración: `app.json`.** No existe `app.config.js` ni `app.config.ts`, así
que lo que dice `app.json` es lo que se usa en todos los perfiles, también en producción.

| Campo | Valor |
|---|---|
| Nombre | `Polygo` |
| Slug / owner | `polygo` / `lichigap` |
| Versión (`expo.version`) | `0.1.0` |
| `package.json` version | `1.0.0` (no se usa para las tiendas) |
| Número de build | `eas.json` → `cli.appVersionSource: "remote"` y `production.autoIncrement: true`. EAS lo guarda en sus servidores; no está en el repo. |
| EAS projectId | `017ba1de-9d78-4f94-8cbb-d3ef3654629c` |
| Scheme | `polygo` |
| Expo SDK | `expo ~58.0.21` |
| React Native | `0.88.1`. React `19.3.0` |
| `expo-dev-client` | `~58.0.17` (ya instalado) |
| `ios/` y `android/` | No existen. Se generan con CNG (prebuild). |
| Plugins | `expo-router`, `expo-secure-store`, `expo-splash-screen`, `expo-widgets` (iOS + Android), `expo-audio`, `expo-asset`, `expo-image-picker`, `expo-notifications`, `expo-web-browser`, `expo-apple-authentication` |
| Permisos Android | `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`. Bloqueados: `SYSTEM_ALERT_WINDOW`, `READ/WRITE_EXTERNAL_STORAGE` |

**Perfiles de `eas.json`:**

| Perfil | Uso | Variables |
|---|---|---|
| `development` | `developmentClient: true`, distribución interna | `EXPO_PUBLIC_PRIVACY_POLICY_URL` |
| `development-simulator` | igual, simulador iOS | heredadas |
| `preview` | interna | privacidad + `EXPO_PUBLIC_BATTLE_SERVER_URL` (Railway) |
| `production` | tiendas, `autoIncrement` | privacidad + Battle Server |
| `submit.production` | vacío | — |

El perfil `production` es el que usan las tiendas. No hay variantes por entorno (`APP_VARIANT`) ni
IDs distintos para preview. Según el registro del proyecto, `preview` también apunta a la base de producción.

Variables de entorno locales (solo los nombres; no se leyeron los valores): `EXPO_PUBLIC_SUPABASE_URL`,
`EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_BATTLE_SERVER_URL`, `EXPO_PUBLIC_PRIVACY_POLICY_URL`.

## 5. Dependencias relacionadas con publicidad

**No hay ninguna.** No están `react-native-google-mobile-ads`, `expo-tracking-transparency`, ningún SDK
de UMP, `expo-build-properties`, `react-native-purchases` ni `expo-iap`. Tampoco aparecen en
`node_modules`. En el código no existe la palabra AdMob, ni anuncios intersticiales o bonificados.

Lo que la app dice hoy sobre publicidad:

- `src/app/plus.tsx:98-99`: «Sin publicidad — Hoy Polygo no muestra anuncios. Si algún día los suma, con Plus no vas a verlos.»
- `docs/PLUS.md` §Pendiente 2: «No hay SDK de anuncios. Si se agrega, mostrarlos solo con `plus === false`, nunca en batallas.»
- `website/src/privacidad.html:70-71` y `docs/PRIVACY_POLICY.md`: «**No** mostramos publicidad… **no** usamos herramientas de analítica ni de seguimiento entre apps». **Esto deja de ser cierto con AdMob** (ver §9).

## 6. Arquitectura actual de energía y skins

### 6.1 Autenticación, perfil y estado

- **Auth:** Supabase Auth (`src/features/auth/AuthProvider.tsx`, `useAuth()` → `session`). Login social Google y Apple implementado sin commit.
- **Perfil:** `useMyProfile()` (`src/features/profile/hooks.ts`). `profile.onboarding_completed_at` controla la navegación.
- **Estado del servidor:** TanStack Query (`src/lib/queryClient.ts`). **Estado local:** Zustand, hoy solo en `src/features/battle/store.ts`.
- **Navegación:** Expo Router. `src/app/_layout.tsx` usa `Stack.Protected` en tres grupos: `(auth)`, `onboarding` y la app (`(tabs)`, `lesson/[id]`, `review`, `battle`, `shop`, `plus`…). `lesson/[id]`, `review` y `battle` se abren con `slide_from_bottom` y `gestureEnabled: false`.

### 6.2 Energía (`supabase/migrations/20261102004033_energy_plus.sql`, `shared/energy.ts`)

- Máximo 5. Completar una lección cuesta 1. Recarga 1 unidad cada 3 h. Todo con `now()` del servidor.
- Tabla `user_energy(user_id, units, anchor_at)`. El cliente solo tiene `SELECT` sobre su fila (RLS).
- La energía actual es `min(5, units + ⌊(now − anchor_at)/3 h⌋)`, calculada por `energy_now()`.
- Gasto: `consume_lesson_energy()`, con `FOR UPDATE`. Solo lo llama `submit_learning_session` para `kind='lesson'`. Si no alcanza, lanza `no_energy`.
- La app lee `get_energy()` (`src/features/plus/api.ts` → `useEnergy()`, refresco cada 5 min). La respuesta incluye `plus`.
- Sin energía: `src/features/plus/components/NoEnergyState.tsx` reemplaza al reproductor en `src/app/lesson/[id].tsx:96`.

**Implicancia para Rewarded Energy:** `energy_now()` recorta todo a `max`. Una unidad «adicional»
otorgada con la energía llena se perdería. Hay dos opciones:

1. **(Recomendada) Ofrecer el video solo si `energy < max` y otorgar `units = min(max, actual + 1)`.** El ancla de recarga se conserva, así no se pierde el tiempo parcial. Es el caso real de uso, porque el botón vive en `NoEnergyState`. No hace falta cambiar el esquema de energía.
2. Permitir superar el máximo, con una columna `bonus_units` que se gaste primero. Cambia `energy_now`, `consume_lesson_energy`, `get_energy` y `shared/energy.ts`. Es más riesgoso y no lo pide la regla de producto.

### 6.3 Polys y cosméticos (`20261031193836_polys_economy.sql`, `20261101025309_polys_shop.sql`, `shared/cosmetics.ts`)

- `poly_transactions` tiene `unique (user_id, reason, ref)`. Es el patrón de idempotencia que ya usa el proyecto. Conviene copiarlo, pero no reutilizar la tabla: `reason` tiene un CHECK cerrado y es una billetera.
- Catálogo `cosmetic_items(id, kind ∈ {frame, background}, rarity, price, source ∈ {polys, season, premium})` con CHECKs: solo `source='polys'` tiene precio, y un legendario nunca tiene precio.
- Inventario `user_cosmetics(user_id, item_id, source ∈ {polys, season, premium, gift}, acquired_at)`, con **PK `(user_id, item_id)`**. La misma skin no puede repetirse a nivel de base. La permanencia ya existe: no hay vencimiento ni borrado, salvo por el borrado de la cuenta en cascada.
- RPCs: `buy_cosmetic` (inserta con `on conflict do nothing` y lanza `item_owned`) y `equip_cosmetic` (exige ser dueño).
- Cliente: `src/features/cosmetics/api.ts` (`useOwnedCosmetics`, `useBuyCosmetic`, `useEquipCosmetic`) y pantalla `src/app/shop.tsx`.

**Qué es una «skin»: falta definirlo.** Hoy hay tres sistemas distintos:

| Sistema | Inventario con dueño | Dónde |
|---|---|---|
| Marcos (`frame_*`) y fondos (`bg_*`) | **Sí** (`user_cosmetics`) | `shared/cosmetics.ts`, base |
| Avatares predefinidos (zorro, panda, perro, gato, león × 3 colores) | **No**: todos son gratis, solo hay un CHECK de ids válidos | `shared/profile.ts` `AVATARS` |
| Arte nuevo sin integrar (`Zorro Ninja.png`, `Marco Elite.png`, `Fondo Aurora.png`…) | — | PNG sueltos en la raíz |

Si la recompensa es un marco o un fondo, encaja en `user_cosmetics` agregando una fuente nueva (`ad`).
Si es una variante del zorro, hace falta un tipo nuevo de cosmético con dueño. Hoy los avatares no
tienen inventario.

**Diferencia detectada (no es de AdMob, pero afecta las skins):** `shared/profile.ts:105` cita la
migración `20261206120000_avatar_animals`. Esa migración existe en `PolyGo/supabase/migrations`, pero
**no está en `Polygo-client/supabase/migrations`**. Tampoco están `20261202…fr_a1_a2`,
`20261204…es_a1_a2` ni `20261208…leaderboard_best_language`. Hay que conciliarlo antes de diseñar las
migraciones de skins.

### 6.4 Recompensas y Edge Functions existentes

| Función | Qué hace | ¿Sirve para SSV? |
|---|---|---|
| `delete-account` | Borra la cuenta. `verify_jwt=false` y valida el token con `auth.getUser`. Usa `secretKey()` (`SUPABASE_SECRET_KEYS` → `SUPABASE_SERVICE_ROLE_KEY`) | Sirve el patrón: cliente admin, `secretKey()` y respuestas JSON. La lógica no. |
| `notify-battle-invite` | Push de invitación a un amistoso | No |
| `learning-session` (v4 en producción, v5 local) | Sesiones de aprendizaje | No. **No mezclar.** |

No hay ninguna Edge Function de webhooks ni de verificación de firmas. **SSV necesita una función nueva.**

## 7. Estado de Plus y Ad-Free

| | Estado |
|---|---|
| Tabla `user_entitlements` | Existe. `entitlement` tiene un CHECK que **solo acepta `'plus'`**. `source ∈ {app_store, play_store, manual}`. Solo escribe `service_role`. |
| `has_plus(uid)` | Existe (`security definer`). No es ejecutable por los clientes. |
| `get_energy().plus` | La app sabe si hay Plus por acá (`usePlus()`). |
| Compra de Plus | **No integrada.** `src/features/plus/purchases.ts` devuelve `store_not_integrated`. El producto previsto es `polygo_plus_monthly`. Hoy Plus solo se otorga a mano por SQL. |
| **Ad-Free (USD 0,99)** | **No existe en ningún lado**: ni producto, ni entitlement, ni UI, ni docs. |
| Proveedor de compras | Sin decidir. `docs/PLUS.md` recomienda RevenueCat (`react-native-purchases`) o `expo-iap`. |

**Consecuencia:** para excluir de los anuncios a Plus y Ad-Free hace falta:

1. Ampliar el CHECK de `user_entitlements` a `('plus','ad_free')`. Ad-Free es compra única, así que `expires_at = null`.
2. Una función del servidor `ads_eligibility()` (o un campo `ads_free` en `get_energy()`) que devuelva `true` si hay Plus vigente **o** Ad-Free.
3. El webhook de la tienda, que ya estaba pendiente para Plus, ahora también para el producto Ad-Free.

**Mientras no existan las compras, nadie puede ser Ad-Free.** Solo funciona el otorgamiento manual.
El SSV también debe rechazar recompensas a usuarios excluidos si el propietario decide que no ven ni
siquiera los anuncios bonificados (ver §16).

## 8. Arquitectura recomendada de AdMob

### 8.1 Módulo cliente (fuera de `src/app/`)

```
src/features/ads/
  config.ts          IDs por plataforma (Platform.select) + TestIds en __DEV__/preview
  AdsProvider.tsx    orquesta: elegibilidad → consentimiento (UMP) → initialize() una sola vez
  eligibility.ts     useAdsEligibility(): false si Plus/Ad-Free o desconocido (undefined ⇒ sin anuncios)
  consent.ts         UMP: gatherConsent, canRequestAds, formulario de opciones de privacidad
  interstitial.ts    precarga + reglas de frecuencia (store Zustand en memoria)
  rewarded.ts        startReward(kind, itemId?) → nonce del servidor → load/show con SSV → espera confirmación
  policy.ts          reglas puras y testeables: cooldown, tope por sesión, primera sesión, pantallas prohibidas
```

Principios:

- **Sin elegibilidad confirmada, no hay anuncios.** `usePlus()` devuelve `undefined` mientras carga. En ese caso no se pide nada y el SDK ni se inicializa. A un usuario Plus o Ad-Free jamás se le inicializa el SDK.
- **Una sola inicialización** (`mobileAds().initialize()`), después de UMP y con `canRequestAds === true`.
- Reglas de frecuencia **en el cliente**. Para el interstitial no da plata ni ventajas, así que no hace falta el servidor. Las recompensas sí se validan **solo en el servidor**.
- En `__DEV__` y en `preview` se usan `TestIds.INTERSTITIAL` y `TestIds.REWARDED`. Los IDs reales van solo en `production`, decididos por una variable `EXPO_PUBLIC_ADS_MODE` o `EXPO_PUBLIC_APP_ENV` en `eas.json`. **Nunca se prueba con IDs reales** (riesgo de suspensión de la cuenta de AdMob).

IDs (para `config.ts`; los App IDs van en el config plugin):

| | Android | iOS |
|---|---|---|
| App ID | `ca-app-pub-6557649928705174~1682321055` | `ca-app-pub-6557649928705174~8435431668` |
| Interstitial | `ca-app-pub-6557649928705174/1222391710` | `ca-app-pub-6557649928705174/5759121261` |
| Rewarded Energy | `ca-app-pub-6557649928705174/1141007378` | `ca-app-pub-6557649928705174/4446039596` |
| Rewarded Skin | `ca-app-pub-6557649928705174/8827925703` | `ca-app-pub-6557649928705174/3224245233` |

Los App IDs y los IDs de unidad no son secretos: viajan dentro del binario. No se verificaron contra
el panel de AdMob porque no hay acceso. Se tomaron tal como los dio el propietario. Sí se verificó que
corresponden a una app con identificadores `com.polygoidioma.app` en `app.json`. Falta confirmar en el
panel de AdMob que cada App ID está vinculado a ese package o bundle.

### 8.2 Interstitial: dónde y cuándo

Reglas de producto (no se cambian): solo en transiciones naturales; nunca en lecciones, ejercicios,
matchmaking ni Ranked; cooldown de 3–5 min; como máximo unos 4 por sesión; nunca en la primera sesión.

| Punto | Archivo | ¿Apto? |
|---|---|---|
| Salir de los resultados de una lección → camino (`onPrimary` cuando es «Volver al camino», con `router.dismissTo('/')`, y `onExit`) | `src/app/lesson/[id].tsx:142-147` | **Sí.** La lección ya terminó y se guardó. Se muestra *después* de que `submit.isSuccess` sea true y *después* de la celebración (`celebration.guard`). |
| «Siguiente lección» (`router.replace` a otra lección) | `src/app/lesson/[id].tsx:144` | **No en v1.** Encadena lecciones y se siente como dentro del flujo de aprendizaje. |
| Salir de los resultados de un repaso (`onPrimary` y `onExit`) | `src/app/review.tsx:483-484` | **Sí**, con las mismas condiciones. |
| `NoEnergyState` | `src/features/plus/components/NoEnergyState.tsx` | **No.** Ahí va el bonificado, que es voluntario. |
| Pantalla de batalla en cualquier fase (`queue`, `playing`, `finished`) | `src/app/battle.tsx` | **No.** |
| Salir del resultado de una batalla (`leaveScreen`) | `src/app/battle.tsx:285-288` | **Pendiente del propietario.** Técnicamente es una transición, pero va pegada a Ranked. Recomendación: no en v1. |
| Lecciones de escritura, `lesson-intro`, onboarding, auth, compras, `plus`, `settings` | — | **No.** |

Política (en `policy.ts`, con tests):

- `cooldownMs = 4 min` (dentro del rango 3–5) desde el último interstitial **y** desde el último bonificado, así nunca aparecen dos anuncios seguidos.
- `maxPerSession = 4`. «Sesión» = desde que la app pasa a primer plano hasta que pasa más de 30 min en segundo plano. Se detecta con `AppState`, que ya se usa en `src/lib/supabase.ts` y `useWidgetSync.ts`.
- **Primera sesión:** ningún interstitial en la sesión en la que se completó el onboarding. Tampoco antes de N lecciones o repasos terminados (p. ej. 2) ni antes de 24 h desde que se creó la cuenta. La fuente confiable es `onboarding_completed_at` del servidor. Una marca local (`expo-secure-store` o el almacenamiento existente) ayuda a separar la sesión, pero **no alcanza sola**: con una reinstalación se pierde.
- Solo se muestra si ya está cargado. Nunca se bloquea la navegación esperando un anuncio. Si no hay anuncio listo, se navega igual.
- Después de mostrar uno, se precarga el siguiente.

### 8.3 Rewarded Energy

- **UI:** un botón nuevo en `NoEnergyState`: «Mirar un video: +1 energía (te quedan X hoy)». Opcionalmente también en el panel de energía (`src/features/plus/components/Energy.tsx`, componente `EnergyPanel`) cuando `energy < max`. Nunca dentro del reproductor.
- **Flujo:** `start_ad_reward('energy')` → nonce → `RewardedAd.createForAdRequest(unit, { serverSideVerificationOptions: { userId: uid, customData: nonce } })` → `show()` → en `EARNED_REWARD` el cliente muestra «acreditando…» y relee `get_energy()` hasta que el servidor confirme. **El evento del cliente nunca acredita nada.**
- El límite de 3 por día se valida en el servidor (§10). El cliente solo muestra cuántas quedan.
- Plus: la energía es ilimitada, así que el botón nunca aparece.

### 8.4 Rewarded Skin

- **UI:** en `src/app/shop.tsx`, en los ítems marcados como «se consigue mirando un video» (fuente nueva `ad`). Botón «Mirar un video para desbloquear». Si el usuario ya la tiene, el botón no aparece. El servidor igual lo rechaza.
- **Flujo:** `start_ad_reward('skin', item_id)` valida que el ítem exista, que tenga `source='ad'` y que el usuario no lo tenga. Devuelve un nonce atado a ese ítem. Después, SSV, y el ítem se inserta en `user_cosmetics` con `on conflict do nothing`. Al final la app invalida `['cosmetics']` y `['profile']`.

## 9. Plan de integración de UMP y ATT

**Nada de esto está implementado.**

### 9.1 UMP (Google User Messaging Platform)

Viene dentro de `react-native-google-mobile-ads` (`AdsConsent`). Orden de arranque, solo para usuarios elegibles:

1. Se confirma la elegibilidad (sin Plus ni Ad-Free).
2. `AdsConsent.gatherConsent()`, que hace `requestInfoUpdate` y muestra el formulario cuando hace falta. Lo exige el EEE, el Reino Unido y Suiza, y en algunos estados de EE. UU. se usan los mensajes de regulaciones estatales.
3. `AdsConsent.getConsentInfo()` → si `canRequestAds` es true, recién ahí se llama a `mobileAds().initialize()`.
4. Si `canRequestAds` es false, no se piden anuncios. Los bonificados se muestran como «no disponibles» y el resto de la app sigue igual.

Hay que activar `delayAppMeasurementInit: true` en el plugin para que no se mida nada antes del consentimiento.

**Administración posterior:** una fila nueva en `src/app/settings.tsx`, «Privacidad de anuncios», visible solo cuando el SDK diga que hace falta. Abre el formulario de opciones de privacidad. **Falta confirmar** el nombre exacto del método en la versión que se instale: en las páginas consultadas no aparecían `showPrivacyOptionsForm` ni `privacyOptionsRequirementStatus`. Hay que leer los tipos del paquete antes de implementarlo.

**Requisitos en el panel (los hace el propietario):** crear en AdMob → Privacy & messaging un mensaje de GDPR (y, si corresponde, de regulaciones de EE. UU.) para las dos apps. El mensaje necesita la URL de la política de privacidad.

QA: `debugGeography: EEA` y `testDeviceIdentifiers` en builds de desarrollo, y `AdsConsent.reset()` para repetir la prueba.

### 9.2 ATT (iOS)

- **Corresponde evaluarlo.** AdMob usa el IDFA si el usuario lo permite. Sin ATT, en iOS solo hay anuncios no personalizados por IDFA, que normalmente pagan menos.
- **Recomendación:** que UMP maneje ATT. Se configura en AdMob un **mensaje explicativo del IDFA** y UMP muestra la explicación y después la alerta del sistema. Así hay una sola secuencia y se evitan dos pedidos.
- Requiere `NSUserTrackingUsageDescription`. Con el plugin de AdMob se define con `userTrackingUsageDescription`. **No** hace falta `expo-tracking-transparency` si UMP muestra la alerta. Si se instala igual (por ejemplo para leer el estado), usa otra clave (`userTrackingPermission`) que escribe el mismo campo del Info.plist: **no configurar las dos**.
- Si no se quiere ATT (decisión del propietario), no se agrega la descripción ni el mensaje de IDFA. Los anuncios funcionan igual, sin IDFA.
- `skAdNetworkItems`: hay que cargar la lista de Google, que empieza con `cstr6suwn9.skadnetwork`, más la de cada red de mediación si se suma alguna.
- **App Store Connect → Privacidad de la app:** hoy `docs/LAUNCH_CHECKLIST.md:65` declara solo datos de funcionalidad. Con AdMob cambia: identificadores de dispositivo, datos de uso y publicidad de terceros, y «tracking» si se usa IDFA.
- Revisión de Apple 3.2.2(vi): no condicionar funciones al consentimiento de seguimiento.

### 9.3 Android

- `com.google.android.gms.permission.AD_ID`: lo agrega el SDK de anuncios. Android 13+ lo exige para leer el identificador de publicidad.
- Play Console: «App content → Ads: Yes» y actualizar la sección **Data safety** (identificadores de dispositivo y datos de publicidad compartidos con Google).
- Familias o menores: el borrador de la política dice «no dirigido a menores de [13]». Si se declara público infantil, hay que usar `tagForChildDirectedTreatment` o `maxAdContentRating`. **Es una decisión del propietario.**

### 9.4 Exclusión de Plus y Ad-Free

- No se inicializa el SDK ni se muestra UMP a usuarios Plus o Ad-Free.
- Si un usuario compra Plus o Ad-Free con la app abierta: `invalidate(['learning','energy'])` → la elegibilidad pasa a false → se descartan los anuncios precargados y no se muestran más.
- Si Plus vence: vuelve a ser elegible desde la siguiente lectura de `get_energy()`, que se hace cada 5 min o al volver a primer plano.

### 9.5 Política de privacidad

- `eas.json` ya define `EXPO_PUBLIC_PRIVACY_POLICY_URL = https://polygoidiomas.netlify.app/privacidad` en todos los perfiles. `docs/LAUNCH_CHECKLIST.md:14` la llama «provisoria». La URL **no se inventó: está en la configuración**. Su contenido (`website/src/privacidad.html`) **afirma lo contrario de lo que va a hacer la app** («No mostramos publicidad… no usamos seguimiento»).
- Antes de publicar una build con anuncios hay que **reescribir** la política de PolyGo, sin reutilizar la de SpotMe, y que alguien con conocimiento legal la revise. Tiene que mencionar Google AdMob como tercero, los identificadores de publicidad, el consentimiento (UMP/GDPR), ATT, la verificación de recompensas (se guardan `transaction_id` e ids de usuario) y los derechos de exclusión.
- El responsable de los datos, el email de contacto, el país y la edad mínima siguen entre corchetes en el borrador (`docs/PRIVACY_POLICY.md`).

## 10. Diseño propuesto de SSV

### 10.1 Flujo

```
App (autenticada)                         Supabase                               Google AdMob
──────────────────                        ────────                               ────────────
1. rpc start_ad_reward(kind, item?) ───▶  valida elegibilidad, límite, ítem
                                          crea ad_reward_intents(nonce, uid, kind, item,
                                          expires_at = now()+1h)  ◀── devuelve nonce
2. RewardedAd(customData = nonce,
   userId = uid).show()  ─────────────────────────────────────────────────────▶ el usuario mira el video
                                                                                 │
3.                                        Edge Function admob-ssv  ◀── GET callback firmado
                                          verifica la firma → otorga (idempotente) → 200
4. relee get_energy / user_cosmetics ──▶  ve la recompensa (o el estado del intent)
```

### 10.2 Edge Function nueva `admob-ssv`

- `verify_jwt = false`: Google llama sin JWT. La autenticidad la da **solo** la firma.
- Método `GET`. Se trabaja con **la query string cruda** (`new URL(req.url).search` sin el `?`), sin reordenarla ni decodificarla.
- **Verificación** (según https://developers.google.com/admob/android/ssv):
  1. `signature` y `key_id` son siempre los dos últimos parámetros. El contenido firmado es todo lo que está antes de `&signature=`.
  2. Las claves públicas se bajan de `https://gstatic.com/admob/reward/verifier-keys.json` (`keys[].keyId`, `keys[].base64`). Caché en memoria de **24 h como máximo**. Si `key_id` no aparece, se vuelve a bajar una sola vez.
  3. ECDSA P-256 + SHA-256. La firma viene en **DER** y en base64 URL-safe. WebCrypto (`crypto.subtle.verify`) espera el formato `r‖s` de 64 bytes, así que hay que convertirla de DER a `r‖s`. Este es el punto más propenso a errores y necesita tests con vectores reales.
  4. Firma inválida → `400` y no se registra nada. Google no debería reintentar nada válido.
- **Validaciones después de la firma:**
  - `ad_unit` pertenece a la lista permitida de las 4 unidades bonificadas, que se mapean a `kind` (`1141007378`/`4446039596` = energía; `8827925703`/`3224245233` = skin). Si el `kind` del intent no coincide con la unidad, se rechaza.
  - `custom_data` (decodificado) = nonce existente, no vencido y no consumido. `user_id` coincide con `intent.user_id`.
  - `timestamp` no está más de, por ejemplo, 2 h en el futuro ni es demasiado viejo (ventana configurable).
- **Escritura:** una sola RPC `security definer` (`grant_ad_reward(p_transaction_id, p_nonce, p_ad_unit, p_raw jsonb)`) ejecutable **solo por `service_role`**. Hace todo en una transacción:
  1. `insert into ad_reward_events (transaction_id, …) on conflict (transaction_id) do nothing`. Si ya existía → devuelve `duplicate` → **200**. Esto cubre los reintentos de Google (hasta 5 a 1 s) y las repeticiones.
  2. Bloquea el intent (`FOR UPDATE`) y lo marca `consumed`.
  3. Energía: bloquea `user_energy` como en `consume_lesson_energy`, cuenta las recompensas de energía del día y otorga `units = min(max, actual+1)` si hay menos de 3. Si ya hay 3, registra `rejected_limit` y no otorga nada.
  4. Skin: `insert into user_cosmetics (…, source='ad') on conflict do nothing`. Si ya la tenía, registra `already_owned`.
  5. Usuario Plus o Ad-Free, si se decide excluirlos: `rejected_ineligible`.
- **Respuesta:** `200` para todo callback con firma válida, aunque se haya rechazado por regla de negocio. Si no, Google reintenta en vano. `500` solo ante un error transitorio de la base, así Google reintenta y la idempotencia protege.
- Verificación DNS inversa del origen: opcional. La firma alcanza. Google la sugiere, pero en Deno Deploy no es práctica.

### 10.3 Amenazas cubiertas

| Amenaza | Defensa |
|---|---|
| Callback falsificado | Firma ECDSA con las claves de Google |
| Repetir un callback | `unique(transaction_id)` |
| El cliente se autoacredita | No hay ninguna RPC de cliente que otorgue. Solo `service_role` puede llamar a `grant_ad_reward` |
| `user_id` ajeno en el SSV | El nonce está atado a `auth.uid()` en `start_ad_reward`. Si `user_id` ≠ dueño del nonce → se rechaza |
| Usar una unidad de skin para cobrar energía | La unidad tiene que coincidir con el `kind` |
| Pedir intents en masa | `start_ad_reward` limita los intents abiertos (p. ej. 1 por tipo a la vez, y no emite si ya llegó al límite del día) |
| Callback atrasado | El intent vale 1 h. Si llega más tarde: `expired` → 200, sin otorgar. La UI muestra «no pudimos confirmarlo» y no promete nada |
| Que el cliente diga que vio el video sin haberlo visto | Al cliente no se le cree nunca. Solo el callback firmado otorga |

### 10.4 Límite de 3 por día: qué cuenta como «día»

`submit_learning_session` ya usa la zona horaria del cliente (`safe_time_zone`) para las rachas. Hay
dos opciones:

1. **Día UTC.** Simple y no se puede manipular, pero el «día» se corta a una hora rara para el usuario.
2. Zona horaria guardada del usuario. `start_ad_reward` la recibe y la **fija en el intent**, así el callback cuenta con la misma zona. Para que no se pueda trampear cambiando la zona, hay que usar la última zona conocida del perfil, no la que manda cada pedido.

**La decide el propietario. Recomendación: la opción 1 para v1.**

## 11. Requisitos de Supabase (diseño; no se creó nada)

Migración futura, numerada después de la última aplicada en producción y conciliada con el desfase
de §6.3:

- `ad_reward_intents(nonce uuid pk, user_id fk profiles on delete cascade, kind text check in ('energy','skin'), item_id text null fk cosmetic_items, platform text, created_at, expires_at, status text check in ('open','granted','rejected','expired'))`. RLS activado. El cliente puede leer **sus propias** filas para consultar el estado, pero no escribirlas.
- `ad_reward_events(transaction_id text pk, nonce uuid, user_id, kind, ad_unit, ad_network, reward_amount, reward_item, google_ts timestamptz, outcome text, created_at)`. Sin acceso de cliente.
- Índice `(user_id, kind, created_at)` para contar el límite diario.
- `cosmetic_items.source`: agregar `'ad'`, y ajustar el CHECK de precio (`source='ad'` ⇒ `price is null`). `user_cosmetics.source`: agregar `'ad'`.
- `user_entitlements.entitlement`: agregar `'ad_free'`. Función `has_ad_free(uid)` y `ads_eligibility()` (o un campo en `get_energy()`, que obliga a regenerar los tipos y a tocar el test de espejo con `shared/energy.ts`).
- RPC de cliente: `start_ad_reward(p_kind, p_item_id, p_platform) → {nonce, remaining_today}` y `get_ad_reward_status(p_nonce)`.
- RPC solo para `service_role`: `grant_ad_reward(...)`.
- Configuración espejo: `ad_reward_config()` con `{ energyDailyLimit: 3, intentTtlSeconds: 3600 }` y su par en `shared/ads.ts`, con un test que compare ambos (igual que en energía y Polys).
- Tests en `supabase/tests/` con el arnés existente (`harness.mjs`, PGlite): idempotencia, límite, skin repetida, ítem no `ad`, intent vencido, usuario Plus.
- Edge Function `supabase/functions/admob-ssv/` con `verify_jwt=false` y el patrón `secretKey()`. Sin secretos nuevos: la clave pública se baja de Google.
- `src/lib/database.generated.ts`: regenerarlo.

**Recordatorio de seguridad del proyecto:** en este proyecto la integración GitHub–Supabase está
activa. Un merge o push puede aplicar migraciones en producción. Todo esto se ensaya en local
primero, y se aplica solo con autorización explícita y después de verificar el backup.

## 12. Compatibilidad con Expo y EAS

| Tema | Resultado |
|---|---|
| Librería | `react-native-google-mobile-ads`. La última versión vista es v17.4.0 (releases de GitHub, 2026-10-21). **No se verificó en npm.** Se instala con `npx expo install react-native-google-mobile-ads` para que Expo resuelva la versión. |
| React Native | La documentación pide RN ≥ 0.86. PolyGo usa 0.88.1 → **compatible**. (Las notas de v17.0.0 decían 0.76+. Vale la documentación actual.) |
| New Architecture | **Obligatoria** en la librería. Expo SDK 58 la usa por defecto, y `app.json` no la desactiva → compatible. |
| Expo Go | **No funciona** (código nativo). Hace falta una development build. `expo-dev-client` ya está instalado. |
| Config plugin | Sí. Entrada en `plugins` de `app.json`: `["react-native-google-mobile-ads", { "androidAppId": "…~1682321055", "iosAppId": "…~8435431668", "delayAppMeasurementInit": true, "userTrackingUsageDescription": "…" (solo si hay ATT), "skAdNetworkItems": [ … ] }]`. Usar el formato de plugin, **no** el bloque raíz `"react-native-google-mobile-ads"` en snake_case. No mezclarlos. |
| iOS mínimo | 15.1 (librería). Expo SDK 58 ya usa una versión igual o mayor. |
| Android minSdk | 24 (librería). Expo SDK 58 ya usa una versión igual o mayor. |
| ProGuard/R8 | Si se activa minificación: regla `-keep class com.google.android.gms.internal.consent_sdk.** { *; }` con `expo-build-properties` (no está instalado). Hoy no hay minificación configurada. |
| EAS Build | Sin cambios en `eas.json` para el SDK. Sí conviene agregar una variable `EXPO_PUBLIC_ADS_MODE` (`test` en development y preview, `live` en production). Cambiar los App IDs o el plugin exige una build nativa nueva. **`eas update` no alcanza.** |
| `ios/` y `android/` | Siguen sin versionarse (CNG). Nada se edita a mano. |
| Expo docs | El índice `llms.txt` de Expo no tiene una guía propia de AdMob. Para ATT existe `expo-tracking-transparency` (~58.1.0), pero no hace falta si UMP muestra ATT. |

Posibles conflictos:

1. **`expo-widgets` + extensión iOS `ExpoWidgetsTarget`:** el SDK de anuncios tiene que enlazarse solo en el target de la app, no en la extensión. Hay que comprobarlo en el primer prebuild de iOS (Podfile generado). Es el riesgo de integración más concreto del proyecto.
2. **Estado de la New Architecture en Android:** el README de la librería marca como «To-Do» los métodos del SDK y los formatos de pantalla completa en Android con la New Architecture, aunque dice que la API de JavaScript no cambia. Eso sugiere que funcionan por la capa de compatibilidad (interop). **Interstitial y Rewarded en Android tienen que probarse en un dispositivo antes de comprometerse.**
3. **`expo-notifications` y `expo-audio`:** al cerrar un anuncio de video, la sesión de audio puede quedar alterada (sonidos y TTS). Después de `CLOSED` hay que llamar de nuevo a `configureAudio()` de `src/lib/sounds.ts`.
4. **Xcode reciente:** la documentación de la librería menciona un ajuste `post_install` del Podfile para Xcode 27. Con CNG eso necesitaría un config plugin propio. Se verifica en la primera build de iOS. **No se probó.**
5. **Web (`react-native-web`, Netlify):** la librería no funciona en web. Hace falta un `src/features/ads/*.web.ts` vacío (no-op) para que la build web no se rompa.
6. **Jest:** hay que mockear `react-native-google-mobile-ads` en `jest.setup.ts`.

## 13. Riesgos técnicos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R1 | La política de privacidad publicada dice «sin publicidad ni seguimiento» | Rechazo de la tienda o incumplimiento legal | Reescribirla **antes** de cualquier build con anuncios |
| R2 | No hay compras: Ad-Free no se puede comprar y Plus solo es manual | Regla «Plus/Ad-Free sin anuncios» incompleta | Integrar las compras antes o junto con los anuncios. Mientras tanto, solo exclusión manual |
| R3 | Formatos de pantalla completa en Android con la New Architecture marcados como «To-Do» | Fallos o crashes en Android | Prueba temprana en un dispositivo real con TestIds (Fase 1) |
| R4 | Convertir la firma DER a `r‖s` en Deno | Recompensas rechazadas o aceptadas por error | Tests con callbacks reales de prueba y con callbacks adulterados |
| R5 | Probar con IDs reales | Suspensión de la cuenta de AdMob | TestIds por variable de entorno y dispositivos de prueba registrados |
| R6 | Desfase de migraciones entre el cliente y PolyGo/producción (`avatar_animals` y otras) | Migraciones de skins mal numeradas o en conflicto | Conciliar antes de crear la migración de anuncios |
| R7 | Integración GitHub–Supabase activa | Un push o merge aplica migraciones en producción | Nada de push ni merge sin autorización. Ensayo local con PGlite |
| R8 | Energía con tope de 5 | Una recompensa con la energía llena se pierde | Ofrecer el video solo si `energy < max` |
| R9 | No está definido qué es una «skin» | Alcance de la migración incierto | Decisión del propietario (§16) |
| R10 | El SDK enlazado en la extensión de widgets de iOS | Build rota o rechazo | Revisar el Podfile generado en el prebuild |
| R11 | El audio después de un anuncio | Se pierden los sonidos y el TTS | Volver a llamar a `configureAudio()` en `CLOSED` |
| R12 | Doble pedido de ATT (UMP + `expo-tracking-transparency`) | Mala experiencia o rechazo | Usar solo uno: UMP |
| R13 | `preview` apunta a producción | Recompensas de QA en datos reales | TestIds en preview. Los callbacks SSV de unidades de prueba no llegan al endpoint real, así que el QA de SSV se hace aparte |
| R14 | Callback de SSV atrasado | El usuario mira el video y no ve la recompensa | Estado «acreditando…» con consulta del intent y un mensaje honesto si vence |

## 14. Archivos que habría que modificar en una implementación futura

**Configuración**
- `package.json` / `package-lock.json`: con `npx expo install react-native-google-mobile-ads` (y `expo-build-properties` solo si hace falta ProGuard).
- `app.json`: entrada del plugin `react-native-google-mobile-ads` (App IDs, `delayAppMeasurementInit`, `skAdNetworkItems`, y `userTrackingUsageDescription` si hay ATT).
- `eas.json`: `EXPO_PUBLIC_ADS_MODE` por perfil.
- `.env.example`, `docs/ENVIRONMENT.md`, `scripts/check-env.ts`, `src/lib/env.ts` / `shared/publicEnv.ts`: la variable nueva.
- `jest.setup.ts`: mock del SDK.

**Cliente (nuevos)**
- `src/features/ads/{config,AdsProvider,eligibility,consent,interstitial,rewarded,policy}.ts(x)` y sus `*.web.ts` no-op.
- `src/features/ads/__tests__/*` (política, elegibilidad).
- `shared/ads.ts` (config espejo) + `shared/__tests__/ads.test.ts`.

**Cliente (modificados)**
- `src/app/_layout.tsx`: montar `AdsProvider` debajo de `AuthProvider` y `QueryClientProvider`.
- `src/app/lesson/[id].tsx`: interstitial al salir de los resultados.
- `src/app/review.tsx`: interstitial al salir de los resultados.
- `src/features/plus/components/NoEnergyState.tsx` (y quizás `Energy.tsx`): botón de Rewarded Energy.
- `src/app/shop.tsx` + `src/features/cosmetics/api.ts`: Rewarded Skin.
- `shared/cosmetics.ts`: `CosmeticSource` agrega `'ad'` e ítems nuevos.
- `src/features/plus/api.ts`: exponer la elegibilidad de anuncios (Plus o Ad-Free).
- `src/features/plus/purchases.ts`: producto Ad-Free (cuando haya compras).
- `src/app/plus.tsx`: el texto «Hoy Polygo no muestra anuncios» deja de ser cierto.
- `src/app/settings.tsx`: «Privacidad de anuncios» (formulario de UMP).
- `src/lib/sounds.ts`: reconfigurar el audio después de un anuncio (o llamarlo desde `ads`).
- `src/lib/database.generated.ts` / `database.types.ts`: regenerar.

**Servidor**
- `supabase/migrations/<nueva>_ad_rewards.sql`: tablas, CHECKs y RPCs de §11.
- `supabase/functions/admob-ssv/index.ts` (+ tests de firma).
- `supabase/tests/ad_rewards.test.mjs`, y ajustar `supabase/tests/energy.test.mjs` si cambia `get_energy`.
- (Compras) `supabase/functions/<store-webhook>/index.ts` para Plus y Ad-Free.

**Documentación y web** (requieren autorización aparte)
- `website/src/privacidad.html`, `website/site.config.json` (fecha), `docs/PRIVACY_POLICY.md`.
- `website/src/app-ads.txt` (o donde corresponda según el dominio elegido) + `website/build.mjs` para copiarlo a la raíz.
- `docs/PLUS.md`, `docs/LAUNCH_CHECKLIST.md` (etiquetas de privacidad, Data safety), `docs/SECURITY.md`, `docs/DATABASE.md`.

## 15. Orden recomendado de implementación

1. **Fase 1 — SDK + consentimiento con TestIds, sin servidor.** Instalar, configurar el plugin, `AdsProvider` con elegibilidad (Plus = sin SDK), UMP y un interstitial de prueba en una pantalla. Development build en Android e iOS. Objetivo: validar R3, R10, R11 y la secuencia UMP + ATT. Sin migraciones ni IDs reales.
2. **Fase 2 — Política de interstitial.** `policy.ts` con tests, integración en `lesson/[id]` y `review`, sesión con `AppState` y regla de primera sesión.
3. **Fase 3 — SSV en local.** Migración + `admob-ssv` + tests con PGlite y vectores de firma. Ensayo en local, sin producción.
4. **Fase 4 — Rewarded Energy** (cliente + servidor), primero con TestIds. Después, QA del SSV real con una unidad real en un dispositivo de prueba registrado, con un endpoint autorizado.
5. **Fase 5 — Rewarded Skin**, una vez definido el catálogo de skins.
6. **Fase 6 — Compras (Plus + Ad-Free)** y webhook. Exclusión total. Puede ir en paralelo desde la Fase 2, pero es **requisito** para lanzar.
7. **Fase 7 — Legal y tiendas:** política de privacidad, app-ads.txt, etiquetas de Apple, Data safety y declaración de anuncios en Play.
8. **Fase 8 — Aplicar en producción** (migración y función) con backup verificado y autorización explícita. Después, build `production`.

## 16. Tareas que dependen del propietario

1. **Definir «skin»:** marco o fondo (encaja en `user_cosmetics`), variante del zorro (tipo nuevo) o los PNG nuevos de la raíz. Indicar qué ítems se consiguen con video.
2. **Usuarios Plus y Ad-Free y los bonificados:** ¿no ven ningún anuncio, ni siquiera opcional? Si no lo ven, ¿cómo consiguen las skins «de video»? (gratis, por Polys u otra vía).
3. **Interstitial al salir de una batalla terminada:** sí o no. Recomendación: no en v1.
4. **«Día» del límite de 3 energías:** UTC (recomendado) o la zona del usuario.
5. **ATT sí o no** en iOS (y el texto de `NSUserTrackingUsageDescription`).
6. **Panel de AdMob:** confirmar que los App IDs están vinculados a `com.polygoidioma.app` en cada tienda, configurar la **URL de callback SSV** en las 4 unidades bonificadas (cuando exista el endpoint), crear los mensajes de GDPR, de regulaciones de EE. UU. y de IDFA en Privacy & messaging, y registrar dispositivos de prueba.
7. **Compras:** elegir RevenueCat o `expo-iap` y crear `polygo_plus_monthly` y el producto Ad-Free (ID a definir, USD 0,99, no consumible) en App Store Connect y Play Console.
8. **Política de privacidad nueva de PolyGo** (no la de SpotMe): responsable, país, email, edad mínima y la sección de publicidad. Revisión legal. Decidir si la URL definitiva sigue siendo `polygoidiomas.netlify.app/privacidad` o un dominio propio.
9. **app-ads.txt:**
   - Línea: `google.com, pub-6557649928705174, DIRECT, f08c47fec0942fa0`.
   - El archivo tiene que estar en la **raíz del dominio que figure como «sitio web del desarrollador»** en las fichas de Google Play y del App Store de PolyGo. AdMob lo busca ahí.
   - `spotmeappfit.com` solo sirve si **esa** es la web de desarrollador declarada en las fichas de PolyGo. Hoy no hay evidencia de eso, y es el dominio de otra app.
   - Candidatos que salen del repo: `polygoidiomas.netlify.app` (el sitio de `website/`, desplegado en Netlify) o un dominio propio. **No se verificó** cómo trata el rastreador de AdMob un subdominio compartido como `*.netlify.app`. Un dominio propio evita la duda.
   - **Información que falta:** qué URL de desarrollador se va a cargar en cada tienda, si hay un dominio propio comprado y si las cuentas de desarrollador de Google y Apple de PolyGo son las mismas que las de SpotMe.
10. **Edad o público infantil:** confirmar que PolyGo no se dirige a menores (afecta la configuración de anuncios y de Play Families).
11. **Autorizaciones:** cada fase que toque `app.json`, dependencias, migraciones, Edge Functions, la web o producción necesita una autorización explícita aparte.

---

## Estado final

| Componente | Estado |
|---|---|
| App IDs | Verificados contra configuración (package/bundle `com.polygoidioma.app` en `app.json`; vínculo en el panel de AdMob a confirmar por el propietario) |
| Ad Unit IDs | Disponibles |
| SDK | Pendiente |
| UMP | Pendiente |
| ATT | Pendiente de evaluación |
| Interstitial | Pendiente |
| Rewarded Energy | Pendiente |
| Rewarded Skin | Pendiente |
| SSV | Pendiente |
| Exclusión Plus / Ad-Free | Pendiente |
| QA Android | Pendiente |
| QA iOS | Pendiente |
| Política de privacidad | Pendiente |
| app-ads.txt | Pendiente |

**ADMOB PHASE 0 — AUDIT COMPLETE.** La integración no está implementada.

# PolyGo — AdMob Fase 1: SDK + UMP + anuncios de prueba (implementación local)

> **Fecha:** 2026-11-21 · **Rama:** `client/stage0` (HEAD `b2b136c`, sin commit) · **Base:** `docs/ADMOB_TECHNICAL_AUDIT.md`
>
> Implementación **local y de desarrollo**. Solo usa los anuncios de prueba oficiales de Google. No hay
> recompensas reales, ni SSV, ni cambios de energía o inventario, ni monetización. No se ejecutó SQL,
> no se tocó Supabase, no se generó ningún build nativo ni de EAS y no se modificó ninguna configuración
> de producción (`eas.json` no cambió). **Nada de esto se probó todavía en un dispositivo** (ver §10).

---

## 1. Arquitectura implementada

Todo vive en `src/features/ads/`. Las pantallas no importan nunca `react-native-google-mobile-ads`
directamente, y el módulo no tiene relación con la energía, las lecciones ni las batallas (esos
módulos no lo importan).

```
src/features/ads/
  config.ts         modo (test/off), App IDs y unidades de PRUEBA, guardia anti-IDs reales, opciones de pedido
  consentDebug.ts   ajustes de QA de UMP (geografía forzada, dispositivos de prueba); vacíos por defecto
  eligibility.ts    regla pura «Plus || Ad-Free ⇒ ningún anuncio» + estado Ad-Free (sin fuente: ver §9)
  types.ts          contrato entre la lógica y el SDK nativo (AdsNativeAdapter, FullscreenAdHandle)
  native.ts         ÚNICO archivo que importa react-native-google-mobile-ads (iOS/Android)
  native.web.ts     variante web sin SDK (Metro la elige para web)
  state.ts          estado de disponibilidad (store de Zustand) y adsCanServe()
  consent.ts        gestión de UMP: gatherConsent, último estado conocido, formulario de opciones
  sdk.ts            mobileAds().initialize() una sola vez (promesa compartida; reintenta si falla)
  controller.ts     orquestación: elegibilidad → UMP → canRequestAds → initialize
  fullscreen.ts     «lugar» de anuncio a pantalla completa (precarga, show, descarte)
  interstitial.ts   servicio de interstitial
  rewarded.ts       servicio de rewarded (una instancia por lugar: energía / marco)
  index.ts          instancias únicas (store, controlador, 3 servicios) + useAdsState()
  AdsBootstrap.tsx  conecta sesión, onboarding, Plus y Ad-Free con el controlador (no dibuja nada)
  AdsSettings.tsx   «Privacidad de anuncios» (UMP) + panel de prueba (solo __DEV__)
  __tests__/ads.test.ts
```

### Flujo de arranque

1. `src/app/_layout.tsx` monta `<AdsBootstrap />` **solo si `adsEnabled`** (ver §4). Queda montado mientras está habilitado, así cerrar sesión o pasar a Plus apagan los anuncios.
2. `AdsBootstrap` calcula la elegibilidad con `resolveAdsEligibility()`, a partir de la sesión (`useAuth`), el onboarding (`useMyProfile`), Plus (`usePlus()`, que viene de `get_energy()` en el servidor) y Ad-Free (`currentAdFreeStatus()`).
3. `adsController.setEligibility()`:
   - `excluded` / `unknown`: **no se hace nada**. No se muestra UMP, no se inicializa el SDK y se descarta todo lo precargado.
   - `eligible`: estado `consent` → `AdsConsent.requestInfoUpdate()` + `loadAndShowConsentFormIfRequired()`.
4. Si `canRequestAds` es false → estado `unavailable`. No se pide ningún anuncio.
5. Si `canRequestAds` es true y el usuario sigue siendo elegible → `initializing` → `mobileAds().initialize()` (una sola vez) → `ready`.
6. Los servicios solo cargan o muestran si `adsCanServe()` es true, es decir: `status === 'ready'`, `eligibility === 'eligible'` y `canRequestAds === true`.

**No se asume consentimiento por defecto:** el estado inicial es `canRequestAds: false`. Si UMP falla
y no hay un consentimiento anterior que lo permita, no hay anuncios.

## 2. Dependencias y versiones

| Paquete                          | Versión                                  | Cómo                                                                               |
| -------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `react-native-google-mobile-ads` | **17.4.0** (`^17.4.0` en `package.json`) | `npx expo install react-native-google-mobile-ads` (npm, según `package-lock.json`) |
| `@iabtcf/core`                   | 1.5.6                                    | dependencia transitiva                                                             |
| `use-deep-compare-effect`        | 1.8.1                                    | dependencia transitiva                                                             |
| `dequal`                         | 2.0.3                                    | dependencia transitiva                                                             |

Verificación previa: `npm view` → `latest = 17.4.0`, `peerDependencies: react-native >=0.86.0, expo >=47`.
PolyGo usa **React Native 0.88.1** y **Expo SDK 58** (`expo ~58.0.21`) → compatible. No se actualizó
Expo, React Native ni ningún otro paquete. En `package-lock.json` solo se agregaron esas 4 entradas.

`npx expo install` reformateó `app.json` al agregar el plugin. El archivo se restauró desde el
respaldo previo y el plugin se agregó a mano, para que el diff sea solo el bloque del plugin.

## 3. Configuración de Expo

`app.json` → `expo.plugins` (única entrada nueva):

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-3940256099942544~3347511713",
    "iosAppId": "ca-app-pub-3940256099942544~1458002511",
    "delayAppMeasurementInit": true
  }
]
```

Qué genera el plugin. Se verificó con `npx expo config --type introspect`, que no crea `ios/` ni `android/`:

| Plataforma                       | Resultado                                                                                                                                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| iOS `Info.plist` (app principal) | `GADApplicationIdentifier = ca-app-pub-3940256099942544~1458002511`, `GADDelayAppMeasurementInit = true`. **Sin** `NSUserTrackingUsageDescription`. Sin `SKAdNetworkItems`.                                                          |
| Android `AndroidManifest.xml`    | `com.google.android.gms.ads.APPLICATION_ID = ca-app-pub-3940256099942544~3347511713`, `DELAY_APP_MEASUREMENT_INIT = true`, `flag.OPTIMIZE_INITIALIZATION = true`, `flag.OPTIMIZE_AD_LOADING = true` (valores por defecto del plugin) |

- No se usa el bloque raíz `"react-native-google-mobile-ads"` en snake_case (configuración bare): solo el formato de config plugin.
- New Architecture: Expo SDK 58 la usa por defecto y `app.json` no la desactiva. La librería v17 la exige.
- `ios/` y `android/` siguen sin existir (CNG). No se editó ningún archivo nativo a mano.
- **No hay perfiles por entorno.** `app.json` es el mismo para todos los perfiles de EAS, así que una build de preview o producción también llevaría el SDK y el App ID de prueba. Para que eso no implique anuncios, el JS los apaga fuera de `__DEV__` (§4). Igual, **no se debe generar una build de preview ni de producción con esta configuración** hasta la fase de IDs reales.
- **No se agregó** `skAdNetworkItems` (no hace falta para anuncios de prueba) ni `expo-build-properties` (solo haría falta con minificación R8/ProGuard, que hoy no está activada).

## 4. Modo de anuncios e IDs de prueba

`src/features/ads/config.ts`:

- `ADS_MODE = __DEV__ ? 'test' : 'off'`. No existe un modo `live`.
- `adsEnabled = ADS_MODE !== 'off' && AD_UNITS !== null && nativeAds.supported`. En web y en builds de release (preview o producción) es `false`: `AdsBootstrap` no se monta, el SDK nunca se inicializa y no se pide nada.
- App IDs de prueba oficiales: Android `ca-app-pub-3940256099942544~3347511713`, iOS `ca-app-pub-3940256099942544~1458002511`.
- Unidades de prueba oficiales (las mismas que `TestIds` de la librería v17.4.0, copiadas para poder validarlas sin el módulo nativo):

| Lugar            | Android                                  | iOS                                      |
| ---------------- | ---------------------------------------- | ---------------------------------------- |
| Interstitial     | `ca-app-pub-3940256099942544/1033173712` | `ca-app-pub-3940256099942544/4411468910` |
| Rewarded energía | `ca-app-pub-3940256099942544/5224354917` | `ca-app-pub-3940256099942544/1712485313` |
| Rewarded marco   | `ca-app-pub-3940256099942544/5224354917` | `ca-app-pub-3940256099942544/1712485313` |

- **Guardia:** `assertTestAdUnit()` corre en `native.ts` antes de crear cualquier anuncio y lanza `ads_non_test_unit_blocked` si el ID no es del publisher de prueba de Google.
- Todo pedido sale con `requestNonPersonalizedAdsOnly: true`: sin ATT y sin publicidad personalizada.
- Para reemplazar los IDs en el futuro: solo `config.ts` y el bloque del plugin en `app.json`.

## 5. Flujo UMP

- Lo implementa `consent.ts` sobre `AdsConsent` de la librería:
  - `requestInfoUpdate()` + `loadAndShowConsentFormIfRequired()`. El formulario aparece solo si UMP lo exige, por ejemplo en el EEE o el Reino Unido.
  - Si la actualización falla (sin red), vale lo que recuerde `getConsentInfo()`, pero **solo** si dice `canRequestAds: true`. Si no, el estado queda en `error` y se reintenta al volver a primer plano.
  - `privacyOptionsRequirementStatus === REQUIRED` → aparece la fila **«Privacidad de anuncios»** en Ajustes (sección Privacidad), que abre `showPrivacyOptionsForm()`. Si el usuario retira el consentimiento, se dejan de servir anuncios y se descarta lo precargado.
- A los usuarios excluidos (Plus, Ad-Free, sin sesión o sin onboarding) **nunca** se les muestra UMP.
- QA: `consentDebug.ts` permite forzar `EEA` / `NOT_EEA` y registrar ids de dispositivos de prueba. Solo se aplica con `__DEV__` y viene vacío.
- **UMP no es ATT.** UMP gestiona el consentimiento de publicidad (GDPR y regulaciones de EE. UU.). ATT es el permiso de seguimiento de Apple, y no se usa (§6).
- **Pendiente del panel de AdMob:** los mensajes de GDPR y de EE. UU. se crean en AdMob → Privacy & messaging para las apps reales. Con el App ID de prueba **no se sabe todavía** qué devuelve UMP; se confirma en el dispositivo (§10).

## 6. Ausencia de ATT

- No se instaló `expo-tracking-transparency`.
- No hay `NSUserTrackingUsageDescription` (lo confirman el introspect y un test).
- No se llama a ninguna API de ATT.
- Sin esa clave, iOS no puede mostrar la alerta de ATT. **No hay que configurar en AdMob un mensaje de IDFA (ATT) para iOS:** si UMP intentara mostrar ATT sin esa clave, la app podría fallar. Queda anotado como requisito para el panel.
- Sin ATT, iOS no comparte el IDFA, y además los pedidos son no personalizados.

## 7. Exclusión de la extensión de widgets de iOS

Verificado con análisis estático. **Falta confirmarlo con un prebuild y `pod install` en macOS** (§10).

- `expo-widgets` crea el target `ExpoWidgetsTarget` en el Podfile con `use_expo_modules_widgets!`. Ese método excluye todos los módulos de Expo salvo `expo`, `expo-widgets` y `@expo/ui` (`packages_to_exclude = all_packages - used_packages`, en `node_modules/expo-widgets/scripts/autolinking.rb`). Después, `use_expo_native_module!` filtra los paquetes de React Native y deja solo `expo` (`config[:ios_packages].select! { |package| package[:name] == "expo" }`). **El pod `RNGoogleMobileAds` no se enlaza en la extensión.**
- El plugin de AdMob escribe con `withInfoPlist`, que solo afecta el `Info.plist` de la app principal. El `Info.plist` de la extensión lo genera `expo-widgets` por separado.
- Los widgets (`src/widgets/*`) no importan nada de `src/features/ads`.

## 8. Manejo de errores

- Ningún error de anuncios se propaga a la app. `controller.ts` traduce todo a estados (`error`, `unavailable`) y guarda un código corto en `lastError`.
- `sdk.ts`: si `initialize()` falla, la próxima llamada reintenta. Llamadas simultáneas comparten la misma promesa: no hay inicializaciones duplicadas (hay un test que lo cubre).
- Reintento automático solo desde `error` y solo al volver a primer plano (`AppState` → `retryIfFailed()`). No hay bucles.
- Servicios:
  - `show()` sin anuncio cargado devuelve `not_ready` al instante y pide una carga: **nunca bloquea la navegación**.
  - Un error de carga no se reintenta solo. Lo vuelve a intentar el próximo `preload()`.
  - Si el usuario pasa a Plus mientras ve un anuncio, ese anuncio termina de mostrarse y se descarta al cerrarse. La promesa de `show()` no queda colgada.
- La elegibilidad desconocida (Plus o perfil cargando, o `get_energy()` con error) cuenta como «sin anuncios».

## 9. Servicios creados y reglas de suscripción

| Servicio           | Qué hace                                                                                     | Qué NO hace (todavía)                                                                                                                                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interstitialAd`   | `preload()`, `show()` → `closed` / `not_ready` / `blocked` / `error`, `discard()`, `isReady` | Ninguna pantalla lo llama. La política (al salir de los resultados de una lección o un repaso; cooldown; tope por sesión; nunca en la primera sesión; nunca en lecciones, ejercicios, matchmaking, batallas ni después de una batalla) es la Fase 2. |
| `rewardedEnergyAd` | igual. `show()` → `watched` (con `clientReward`) / `dismissed` / …                           | **No acredita energía.** `watched` es un evento del cliente: nunca debe usarse para otorgar nada. Falta ofrecerlo solo con energía por debajo del máximo, el límite de 3 por día UTC y la validación SSV.                                            |
| `rewardedSkinAd`   | igual que el anterior                                                                        | **No otorga marcos.** Falta el inventario `frame` permanente e idempotente, y SSV.                                                                                                                                                                   |

**Plus || Ad-Free ⇒ ningún anuncio**, incluidos los rewarded opcionales. `resolveAdsEligibility()`
devuelve `excluded` en cuanto uno de los dos es `true`, aunque falte saber lo demás.

**Limitación de Ad-Free (documentada, no resuelta):** Ad-Free no existe. No hay producto en las
tiendas, ni compras integradas, y `user_entitlements` solo acepta `'plus'`. **No se inventó** un
entitlement `ad_free`. `currentAdFreeStatus()` devuelve `false` porque hoy ninguna cuenta puede ser
Ad-Free. Cuando exista la fuente real (fase de compras), se conecta ahí sin tocar los servicios.

## 10. Cómo probar interstitial y rewarded (requiere development build; **no se ejecutó**)

1. Generar una development build (§12) e instalarla en un dispositivo o emulador.
2. `npx expo start --dev-client` y abrir la app con una cuenta **gratuita** que ya completó el onboarding.
3. Ir a **Ajustes**. En la sección Privacidad aparece la tarjeta **«Anuncios de prueba (solo desarrollo)»**, que muestra el estado, la elegibilidad, `canRequestAds`, el estado de UMP y el último error.
4. Esperar el estado `ready`.
   - Para probar el formulario de UMP fuera de Europa: `consentDebug.ts` → `geography: 'EEA'` + el id de dispositivo de prueba que UMP imprime en el log nativo. Después, recargar.
5. «Cargar anuncios» → esperar unos segundos → «Interstitial», «Rewarded energía» o «Rewarded marco». Tiene que aparecer el rótulo **«Test Ad»** de Google.
   - En rewarded: al completar el video, la tarjeta dice «video completo (evento del cliente). No se acreditó nada».
6. Exclusión: con una cuenta Plus (otorgada a mano en un entorno de prueba, **no** en producción), el estado debe quedar en `idle` con elegibilidad `excluded`, sin formulario de UMP y con los botones devolviendo `blocked`.

**Pruebas pendientes en dispositivo real** (ninguna se ejecutó):

| #   | Prueba                                                                                                                                               | iOS       | Android   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- |
| D1  | La app compila con el SDK (development build)                                                                                                        | pendiente | pendiente |
| D2  | La extensión de widgets compila y no enlaza `RNGoogleMobileAds` (revisar el Podfile generado y `Pods`)                                               | pendiente | n/a       |
| D3  | UMP con el App ID de prueba: qué devuelve `requestInfoUpdate`, y si aparece el formulario con `debugGeography: EEA`                                  | pendiente | pendiente |
| D4  | `mobileAds().initialize()` resuelve                                                                                                                  | pendiente | pendiente |
| D5  | Se carga y muestra un interstitial de prueba («Test Ad»)                                                                                             | pendiente | pendiente |
| D6  | Se carga y muestra un rewarded de prueba, y llega `EARNED_REWARD`                                                                                    | pendiente | pendiente |
| D7  | Android con New Architecture: los anuncios de pantalla completa funcionan por la capa de interop (el README marca su port a Turbo Module como To-Do) | n/a       | pendiente |
| D8  | El audio de la app (efectos y TTS) suena bien después de cerrar un anuncio de video                                                                  | pendiente | pendiente |
| D9  | No aparece ninguna alerta de ATT                                                                                                                     | pendiente | n/a       |
| D10 | Una cuenta Plus no ve UMP ni anuncios                                                                                                                | pendiente | pendiente |
| D11 | Sin red al abrir: estado `error` y la app funciona normal; al volver con red, reintenta                                                              | pendiente | pendiente |
| D12 | El manifiesto final incluye `com.google.android.gms.permission.AD_ID` (lo agrega el SDK al combinar manifiestos; no se ve en el introspect)          | n/a       | pendiente |

## 11. Limitaciones y riesgos conocidos

1. **Ad-Free sin fuente real** (§9). Para lanzar con monetización hacen falta compras y entitlement.
2. **`app.json` es el mismo para todos los perfiles:** una build de release llevaría el SDK y el App ID de prueba (sin anuncios, porque el JS los apaga). No generar preview ni producción hasta la fase de IDs reales y política de privacidad.
3. **Android + New Architecture:** según el README, los métodos del SDK, los anuncios de pantalla completa y UMP en Android funcionan por la capa de interoperabilidad de React Native («Every surface below works on the New Architecture»); su port nativo está pendiente en la librería. Falta validarlo en dispositivo (D7).
4. **Audio después de los anuncios:** `configureAudio()` (`src/lib/sounds.ts`) está memoizado y no se puede volver a llamar para reconfigurar. Si D8 falla, hará falta un cambio en `sounds.ts`, que esta fase no tocó.
5. **Xcode reciente:** la documentación de la librería menciona un ajuste `post_install` del Podfile para Xcode 27 (targets de UMP/GMA con un mínimo de 15.1). Se verá en D1/D2. Con CNG haría falta un config plugin propio.
6. **UMP con el App ID de prueba:** hay que ver en el dispositivo cómo se comporta (D3). Con las apps reales hacen falta los mensajes configurados en AdMob.
7. **Panel de prueba:** vive en Ajustes y solo existe con `__DEV__`. Muestra un interstitial fuera de las transiciones de producto _solo para QA_. No es una ubicación de producto.
8. **Política de privacidad publicada:** sigue diciendo «sin publicidad ni seguimiento». No se modificó (regla de esta fase). Bloquea cualquier build pública con anuncios.
9. **`app-ads.txt`:** no se configuró. El dominio propio está pendiente.
10. **Versiones de Expo desactualizadas, previas a esta fase:** `expo-doctor` marca 18 paquetes del SDK 58 con parches o minors más nuevos (p. ej. `expo ~58.0.26`, `react-native-safe-area-context ~5.11.1`). No se actualizaron (regla de esta fase). No involucra a la librería de anuncios.

## 12. Development build en una fase posterior (no ejecutado; requiere autorización)

Con EAS (sin Xcode ni Android Studio locales):

```bash
npx eas-cli@latest build --profile development --platform android
npx eas-cli@latest build --profile development --platform ios      # dispositivo físico (requiere firma)
npx eas-cli@latest build --profile development-simulator --platform ios
```

O local: `npx expo run:android` / `npx expo run:ios` (genera `ios/` y `android/` con prebuild; no
versionarlos).

Antes de compilar:

- Confirmar que el perfil `development` (`developmentClient: true`) es el elegido. Ese perfil no define `EXPO_PUBLIC_BATTLE_SERVER_URL`.
- Revisar en el log de `pod install` que `RNGoogleMobileAds` y `Google-Mobile-Ads-SDK` aparecen solo en el target de la app (D2).
- No usar los perfiles `preview` ni `production`.

## 13. Validaciones ejecutadas

| Validación                                                                                               | Resultado                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck` (`tsc --noEmit` + `-p scripts`)                                                      | **OK** (exit 0)                                                                                                                                                                                                                                                                                                                  |
| `npx expo lint`                                                                                          | **OK** (exit 0, sin advertencias)                                                                                                                                                                                                                                                                                                |
| `npx prettier --check` (app.json, `src/features/ads`, `_layout.tsx`, `settings.tsx`)                     | **OK**                                                                                                                                                                                                                                                                                                                           |
| `npx jest src/features/ads`                                                                              | **22/22 OK**                                                                                                                                                                                                                                                                                                                     |
| `npx jest --ci` (suite completa)                                                                         | **6691/6691 tests OK**. 9 suites fallan al cargar por un problema **previo y ajeno**: `content/__tests__/{a1-closure,a2-expansion,b1,b2,es,fr,it,pt,zh}.test.ts` (sin seguimiento) leen migraciones que no están en el cliente (`ENOENT …20261119120000_a1_en_closure.sql`, etc.; es el desfase de migraciones de la auditoría). |
| `npx expo config --type introspect`                                                                      | **OK**: claves nativas de §3; sin ATT; sin ID real                                                                                                                                                                                                                                                                               |
| `npx expo-doctor`                                                                                        | 19/20. El que falla son las versiones de Expo desactualizadas (previo, §11.10). La librería de anuncios no aparece marcada.                                                                                                                                                                                                      |
| `npx expo install --check`                                                                               | Mismos paquetes desactualizados previos. `react-native-google-mobile-ads` no aparece marcado.                                                                                                                                                                                                                                    |
| `npx expo export --platform android --platform ios --platform web` (al scratchpad, bundle JS de release) | **OK** en las 3. Web: 0 bundles con el módulo nativo de anuncios (usa `native.web.ts`). iOS/Android: incluyen el módulo.                                                                                                                                                                                                         |
| Búsqueda del publisher real `6557649928705174`                                                           | 0 apariciones en los bundles, `app.json` y el introspect. En el código solo aparece en `ads.test.ts`, que verifica que **no** esté.                                                                                                                                                                                              |

Lo que **no** se validó, porque requiere build o dispositivo: ver la tabla D1–D12 de §10.

## 14. Archivos

**Creados:** `src/features/ads/{config,consentDebug,eligibility,types,native,native.web,state,consent,sdk,controller,fullscreen,interstitial,rewarded,index}.ts`,
`src/features/ads/{AdsBootstrap,AdsSettings}.tsx`, `src/features/ads/__tests__/ads.test.ts`, este documento.

**Modificados:** `package.json` (+1 dependencia), `package-lock.json` (+4 paquetes), `app.json` (+ bloque
del plugin), `src/app/_layout.tsx` (monta `AdsBootstrap` si `adsEnabled`), `src/app/settings.tsx` (fila de
privacidad de UMP + panel de prueba de desarrollo).

**Sin cambios:** `eas.json`, `jest.setup.ts`, `supabase/**`, `website/**`, la política de privacidad,
energía (`shared/energy.ts`, `src/features/plus/**`), lecciones, repasos, batallas y widgets.

---

**Estado:** `ADMOB PHASE 1 — LOCAL IMPLEMENTATION COMPLETE`. Es implementación local: queda pendiente
toda la validación en dispositivo (D1–D12). No se avanza a la Fase 2 sin autorización.

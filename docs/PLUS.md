# Energía y PolyGo Plus

> **Estado (2026-11-25):** la energía y el control de Plus funcionan en producción
> (`20261102004033_energy_plus`). La tienda (RevenueCat), «Sin publicidad» y el Coach están
> implementados **en local, sin aplicar ni desplegar**: migración `20261230120000_plus_store_coach`,
> Edge Function `plus-store` y `learning-session` con el foco `coach`. Sin las claves de RevenueCat la
> pantalla `/plus` dice «compras no habilitadas» y nada se rompe. Ver «Tienda y derechos» y
> «Pendiente».

## Principios

- Ranked es gratis e ilimitado para todos. Pagar nunca da ELO, multiplicadores ni ventajas en las partidas.
- La energía solo limita **completar lecciones guiadas**. Repasos, ranked, Amigos y widgets nunca la usan.
- Equivocarse no gasta energía. Entrar a una lección o abandonarla tampoco.
- Con 0 de energía la app sigue funcionando: la lección muestra alternativas gratis (repaso, ranked) y un link discreto a Plus.

## Energía

Los valores están en `shared/energy.ts` y la base los replica en `energy_config()` (un test compara ambos):

|                              |                                    |
| ---------------------------- | ---------------------------------- |
| Máximo (gratis)              | 5                                  |
| Costo por lección completada | 1                                  |
| Recarga                      | 1 unidad cada 3 h, hasta el máximo |

**Cómo se calcula.** `user_energy` guarda `units` (la energía que había en `anchor_at`). La energía actual es `min(5, units + ⌊(now() − anchor_at) / 3 h⌋)`. Al gastar, el ancla avanza solo las recargas ya cumplidas, así que el tiempo parcial no se pierde. Sin fila, la energía está llena. Cuando se llena, el reloj se detiene y vuelve a arrancar en el próximo gasto.

**Dónde se gasta.** Dentro de `submit_learning_session`, después del chequeo de idempotencia, únicamente para `kind = 'lesson'` (`consume_lesson_energy`, con `FOR UPDATE` para que dos dispositivos no gasten la misma unidad). Si no alcanza, lanza `no_energy` y revierte la sesión entera. Reenviar la misma sesión no gasta otra vez.

**Por qué no se puede trampear.** Todo usa `now()` del servidor. El cliente no puede escribir `user_energy` ni `user_entitlements`, ni ejecutar `consume_lesson_energy` o `has_plus`. La app solo lee `get_energy()`: energía, `next_unit_at`, `full_at` y `server_now`. Con `server_now` calcula el desfase de reloj, y la cuenta regresiva (`projectEnergy`) usa la hora del servidor. Cambiar la hora del teléfono no recarga nada.

**En la app.**

- Chip ⚡ en Aprender. Al tocarlo se abre una explicación. Con 0 aparece un aviso compacto.
- El popover de cada lección indica el costo.
- `lesson/[id]` decide al entrar si se puede jugar. Si se termina con la última unidad, el resultado no se reemplaza por el cartel. Si la energía no se pudo leer, se juega igual y decide el servidor.
- Estados contemplados: cargando, error (con reintento), datos desactualizados (sin conexión), sin energía y Plus (∞).

## Gratis vs. Plus

|                                                  | Gratis                                   | Plus                                           |
| ------------------------------------------------ | ---------------------------------------- | ---------------------------------------------- |
| Ranked, amistosos, Amigos                        | ✔ ilimitado                              | ✔ igual (sin ventajas)                         |
| Lecciones                                        | 5 de energía, 1 cada 3 h                 | ilimitadas                                     |
| Repaso espaciado, práctica libre, puntos débiles | ✔ ilimitado, sin energía                 | ✔                                              |
| Repaso inteligente                               | —                                        | ✔ ilimitado                                    |
| Coach: diagnóstico e historial                   | ✔                                        | ✔                                              |
| Coach: sesiones personalizadas (~3 min)          | 2 de prueba por cuenta                   | ✔ sin límite                                   |
| Repaso por tema (elegir una unidad)              | —                                        | ✔                                              |
| Widgets «Palabra» y «Pregunta rápida»            | ✔ (contenido «Variado»)                  | ✔ + elegir contenido de «Palabra»              |
| Publicidad                                       | moderada (AdMob, aún sólo en desarrollo) | nunca (también «Sin publicidad», compra única) |

**Repaso inteligente** (`src/features/plus/smartReview.ts`): son reglas fijas sobre `user_word_progress`, sin IA ni modelo adaptativo. Toma, en este orden, palabras vencidas, con 2 o más errores, difíciles (≥ ⅓ de errores o que siguen en etapa 0 después de 3 vistas) y por olvidar (vencen en 24 h), hasta 15. Se guarda como repaso. Un acierto antes de tiempo no adelanta la palabra (regla de `apply_word_result`) y un error la trae de vuelta.

**Repaso por tema** (`src/features/plus/topicReview.ts`, pantalla `/review-topics`): elegís una unidad con palabras estudiadas y se arma una sesión de hasta 15 de esas palabras (vencidas, después las de más errores, después las de etapa más baja). Se guarda como repaso y no usa energía. El acceso, igual que el inteligente, se controla en la app.

**Widget personalizado:** las opciones son Variado, Para repasar, Tus errores y Palabras nuevas. Se guarda en el dispositivo (`polygo.widget-content`) y solo se aplica si el servidor dice que hay Plus. Vale para todos los widgets «Palabra» del teléfono, porque expo-widgets no permite configurar cada widget por separado. El idioma es inglés, el único del currículo.

## Permisos centralizados

`shared/plus.ts` es la única tabla de «qué da cada plan» (`resolveEntitlements`) y de los límites gratis
(`FREE_LIMITS.coachTrialSessions = 2`, `COACH.sessionSize = 8`). En la app se consulta con
`useEntitlements()` (`src/features/plus/entitlements.ts`): `isPlus`, `unlimitedEnergy`, `noAds`,
`smartReview`, `unlimitedCoach`, `advancedStats`, `personalizedWidgets`, `plusCosmetics`. `undefined` =
todavía no se sabe (la UI no asume ninguno). No existe ningún permiso de Ranked.

La condición siempre la decide el servidor: Plus = `has_plus` (lo lee `get_energy`), Sin publicidad =
`has_ad_free` (lo lee `get_entitlements`). Sin conexión, React Query conserva el último estado confirmado.
Los beneficios que importan los vuelve a comprobar el servidor: energía (`submit_learning_session`),
repasos Plus y Coach (`learning_start_focus_review`).

## Tienda y derechos (RevenueCat)

1. La app configura el SDK con `appUserID = user.id` (`PurchasesBootstrap`): la compra queda en la cuenta,
   no en el teléfono, y se restaura en otro dispositivo.
2. Precios: los del offering actual de RevenueCat (`priceString` localizado). El ahorro del anual se
   calcula con esos precios (`annualSavings`) y no se muestra si las monedas difieren o no hay ahorro.
   Cambiar un precio en App Store Connect / Play Console no requiere una versión nueva.
3. Compra o restauración → la app llama a `plus-store` (`{action: 'sync'}`) → la función pide el estado a
   la API de RevenueCat con la clave secreta → `store_sync_entitlements` (sólo `service_role`). El webhook
   de RevenueCat entra por la misma función y hace lo mismo (del evento sólo toma qué cuentas mirar).
4. Estados: compra/renovación (vence = fin del período), cancelación (`will_renew = false`, acceso hasta
   el vencimiento), período de gracia (el vencimiento incluye la gracia y `billing_issue_at` avisa),
   reembolso (vence en la fecha del reembolso), revocación (la tienda ya no lo tiene → vence ahora).
   Un Plus manual o por invitación vigente más largo que el de la tienda no se pisa.
5. Nunca se activa nada por el resultado local de la compra ni por lo que mande la app.

## Coach (primera versión, sin IA generativa)

- Diagnóstico (`shared/coach.ts`, `diagnose`): reglas fijas sobre `user_word_progress` agrupado por unidad.
  Con menos de 8 palabras estudiadas, mensaje neutral. Una unidad es débil con ≥ 3 palabras, ≥ 2 errores,
  ≥ 20 % de errores y al menos una palabra que cuesta. Hasta 3 áreas. Los números que se muestran son
  los reales.
- Sesión: `/review?mode=coach&units=…` → `learning-session` arma el plan (`buildFocusPlan` con foco
  `coach`: palabras con errores de esas unidades, hasta 8, por turnos entre unidades) con ítems ya
  publicados del catálogo; se corrige y se guarda como cualquier repaso.
- Pruebas: `learning_start_focus_review` llama a `coach_claim_session` en la misma transacción que crea la
  sesión. Sin Plus, descuenta una de las 2 (de por vida de la cuenta; `coach_sessions.trial`). Si la
  sesión no se crea, no descuenta; repetir el inicio de la misma sesión no descuenta otra; dos teléfonos
  a la vez se serializan con un candado por cuenta. `get_coach_status()` informa usadas, restantes e
  historial (resultado = `learning_sessions` del mismo id).
- Límite conocido: **Ranked no guarda qué palabra se respondió** (sólo totales en `battle_players`), así que
  el Coach todavía no analiza partidas. Hacerlo requiere que el Battle Server registre el id de palabra
  de cada respuesta (cambio en el servidor de partidas, fuera de esta fase).

## Pendiente

1. **Revisar y aplicar** `20261230120000_plus_store_coach.sql` (con autorización) y desplegar
   `learning-session` (incluye el foco `coach`) y `plus-store` con `--no-verify-jwt`.
2. **Tiendas:** crear en App Store Connect y Play Console las suscripciones `polygo_plus_monthly` y
   `polygo_plus_annual` (un grupo de suscripción) y el producto único `polygo_remove_ads`. Ids propuestos:
   si cambian, se cambian sólo en `src/features/plus/storeConfig.ts`.
3. **RevenueCat:** proyecto con las dos apps; entitlements `polygo_pro` (= Plus, con los productos mensual y
   anual) y `ad_free` (con el producto Lifetime = «Sin publicidad», compra única: NO es Plus de por vida);
   offering «current» con `$rc_monthly`, `$rc_annual` y `$rc_lifetime`; webhook a
   `https://<ref>.supabase.co/functions/v1/plus-store` con una cabecera Authorization propia.
4. **Secretos/variables (no configurados):** Edge Functions → `REVENUECAT_SECRET_API_KEY`,
   `REVENUECAT_WEBHOOK_AUTH`. EAS → `EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`
   (claves públicas del SDK).
5. **Build nueva** (development primero): `react-native-purchases` trae código nativo; Expo Go no compra.
6. **Términos de uso** propios para Android (en iOS se enlaza la EULA estándar de Apple).
7. **Anuncios:** AdMob sigue en modo prueba (`ADS_MODE`); la exclusión de Plus y Sin publicidad ya usa
   `useEntitlements().noAds`. Antes de anuncios reales: política de privacidad y Fase 2 (ver
   `docs/ADMOB_PHASE1_IMPLEMENTATION.md`).
8. **Estadísticas avanzadas, plan semanal y widgets por error:** no implementados (el permiso
   `advancedStats` existe para cuando se construyan). Widgets: ver `docs/WIDGETS.md`.

## Otorgar Plus a mano (pruebas)

En el SQL Editor del dashboard:

```sql
insert into public.user_entitlements (user_id, entitlement, source, expires_at)
select id, 'plus', 'manual', now() + interval '30 days' from auth.users where email = '<email>'
on conflict (user_id, entitlement) do update set expires_at = excluded.expires_at, updated_at = now();
```

Para quitarlo, poner `expires_at = now()`.

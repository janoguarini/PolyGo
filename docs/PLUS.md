# Energía y PolyGo Plus

> **Estado:** la energía y el control de Plus funcionan de punta a punta en Supabase
> (migración `20261102004033_energy_plus`, aplicada). **La compra de Plus no está integrada**:
> la pantalla `/plus` lo dice y el botón está deshabilitado. Hoy Plus solo se puede otorgar a mano
> (ver más abajo).

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

|                                                  | Gratis                   | Plus                              |
| ------------------------------------------------ | ------------------------ | --------------------------------- |
| Ranked, amistosos, Amigos                        | ✔ ilimitado              | ✔ igual (sin ventajas)            |
| Lecciones                                        | 5 de energía, 1 cada 3 h | ilimitadas                        |
| Repaso espaciado, práctica libre, puntos débiles | ✔ ilimitado, sin energía | ✔                                 |
| Repaso inteligente                               | —                        | ✔ ilimitado                       |
| Repaso por tema (elegir una unidad)              | —                        | ✔                                 |
| Widgets «Palabra» y «Pregunta rápida»            | ✔ (contenido «Variado»)  | ✔ + elegir contenido de «Palabra» |
| Publicidad                                       | hoy no hay anuncios      | nunca                             |

**Repaso inteligente** (`src/features/plus/smartReview.ts`): son reglas fijas sobre `user_word_progress`, sin IA ni modelo adaptativo. Toma, en este orden, palabras vencidas, con 2 o más errores, difíciles (≥ ⅓ de errores o que siguen en etapa 0 después de 3 vistas) y por olvidar (vencen en 24 h), hasta 15. Se guarda como repaso. Un acierto antes de tiempo no adelanta la palabra (regla de `apply_word_result`) y un error la trae de vuelta.

**Repaso por tema** (`src/features/plus/topicReview.ts`, pantalla `/review-topics`): elegís una unidad con palabras estudiadas y se arma una sesión de hasta 15 de esas palabras (vencidas, después las de más errores, después las de etapa más baja). Se guarda como repaso y no usa energía. El acceso, igual que el inteligente, se controla en la app.

**Widget personalizado:** las opciones son Variado, Para repasar, Tus errores y Palabras nuevas. Se guarda en el dispositivo (`polygo.widget-content`) y solo se aplica si el servidor dice que hay Plus. Vale para todos los widgets «Palabra» del teléfono, porque expo-widgets no permite configurar cada widget por separado. El idioma es inglés, el único del currículo.

## Pendiente (integraciones reales)

1. **Compras.** Falta elegir entre RevenueCat (`react-native-purchases`, recomendado: un webhook unifica App Store y Google Play) o `expo-iap`. Requiere una build nueva. Pasos:
   - Crear el producto `polygo_plus_monthly` (USD 4,99/mes) en App Store Connect y Google Play Console.
   - Implementar `getPlusOffer` / `purchasePlus` / `restorePurchases` en `src/features/plus/purchases.ts`, con el precio localizado de la tienda.
   - Crear una Edge Function de webhook (verifica la firma y usa `service_role`) que haga upsert en `user_entitlements` (`source`, `external_id`, `expires_at`) en compras, renovaciones, cancelaciones y reembolsos.
   - La app activa Plus recién cuando `get_energy().plus` es true. Nunca por el resultado local de la compra.
2. **Anuncios.** No hay SDK de anuncios. Si se agrega, mostrarlos solo con `plus === false`, nunca en batallas.
3. **Widgets.** Falta la configuración por widget (App Intents en iOS, actividad de configuración en Android) y el deep link en Android (expo-widgets no lo expone). Ver `docs/WIDGETS.md`.
4. **Repaso inteligente y por tema.** El acceso se controla en la app. El servidor acepta cualquier repaso válido, porque son datos propios del usuario y no dan ventajas. Si hiciera falta, se puede agregar un `kind` propio validado con `has_plus`.

## Otorgar Plus a mano (pruebas)

En el SQL Editor del dashboard:

```sql
insert into public.user_entitlements (user_id, entitlement, source, expires_at)
select id, 'plus', 'manual', now() + interval '30 days' from auth.users where email = '<email>'
on conflict (user_id, entitlement) do update set expires_at = excluded.expires_at, updated_at = now();
```

Para quitarlo, poner `expires_at = now()`.

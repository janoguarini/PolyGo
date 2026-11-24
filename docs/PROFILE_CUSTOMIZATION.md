# Personalización del perfil, tienda de cosméticos e invitaciones

Estado al 2026-11-21: **implementado en el cliente (sin commit) y backend preparado SIN aplicar**.
Ninguna migración, función ni dato de producción fue modificado.

> Continuación: [PROFILE_XP_LEVELS.md](PROFILE_XP_LEVELS.md) (Perfil 2.0) agrega `20261222120200_player_xp` y
> `20261222120300_cosmetic_compatibility`, que se aplican después de las dos de este documento. La segunda
> vuelve a definir `buy_cosmetic` (mismas reglas y precios; sólo equipa si el ítem combina con el avatar).

## 1. Auditoría: qué existía y qué se reutilizó

| Pieza | Ya existía | Decisión |
|---|---|---|
| Moneda | Polys (`poly_wallets`, `poly_transactions` con clave única `(user_id, reason, ref)`, `poly_credit`/`poly_debit`) | Reutilizada. Los precios de la especificación ("monedas") son Polys. Nuevo motivo `referral`. |
| Catálogo | `cosmetic_items` + `user_cosmetics` + `profiles.frame_id/background_id`, RPC `buy_cosmetic`/`equip_cosmetic`, espejo en `shared/cosmetics.ts` con test | Extendido (no duplicado): skins, rarezas/orígenes nuevos, `is_available`, `is_retired`. |
| Arte | Marcos y fondos dibujados en código (SVG/degradés) | Catálogo nuevo con las imágenes aprobadas; lo dibujado queda sólo para lo retirado y para Básico/Sólido. |
| Avatares | `profiles.avatar_id` (zorros + animales, CHECK en la base) y foto propia (`avatar_path`) | Las skins se guardan en `avatar_id` (`skin-*`), que ya viaja en perfil, clasificación, amigos y servidor de partidas: **no se tocó ninguna RPC ni código de Ranked**. Un trigger valida la propiedad. |
| Personalización | `edit-profile`: pestañas Avatar/Marcos/Fondos, vista previa, probar, "Guardar cambios" sólo con cambios | Extendida (no se creó otra pantalla). |
| Tienda | `shop.tsx` con probador | Extendida con pestaña Avatares, estados y escalera de rangos. |
| Rangos | `shared/ranking.ts` (TIERS, `getRank`, `isPlaced`), `player_ratings` | Reutilizado: el marco competitivo sale del ELO real; no hay sistema paralelo. |
| Plus | `user_entitlements` (sólo service_role escribe), `has_plus()` en el servidor, `usePlus()` lee `get_energy` | Reutilizado para todo lo exclusivo de Plus. Sin tocar precio, facturación ni integración. |
| Código de amigo | `profiles.public_code` (`PG-XXXXXX`), único, permanente, generado por el servidor | **Es** el código de invitación. No se creó otra estructura de códigos. |
| Invitaciones/referidos | No existía nada | Nuevo (migración 20261222120100). |
| Verificación | `auth.users.email_confirmed_at` (Google/Apple llegan verificados) | Condición de validez de una invitación. |
| Onboarding | `profiles.onboarding_completed_at` | Condición de validez. |
| Actividad real | `learning_sessions` (lección o repaso registrados por el servidor) y `user_daily_activity.sessions_completed` | Condición de validez. Ni ELO ni Ranked cuentan. |
| Anti-abuso | No había señales de dispositivo | No se agregaron identificadores invasivos (ver §6). |
| Portapapeles | No hay librería (`expo-clipboard` no está instalado) | El código es seleccionable (mantener presionado → Copiar) y se comparte con el menú nativo. Ver pendientes. |

Producción (consulta de sólo lectura, 2026-11-21): 1 perfil; un único cosmético comprado (`bg_ocean`); 1 entitlement; ningún `frame_id`/`background_id` puesto; la restricción de avatares con animales ya aplicada (`profiles_avatar_check`). No existen tablas de referidos ni insignias.

## 2. Assets

Fuente: PNG en la raíz de `Polygo-client` (sin tocar). Derivados optimizados en `assets/profile/` (WebP, 1,8 MB en total contra ~60 MB de PNG):

```
assets/profile/avatars/            classic, ninja, explorer, academic, cyber        (384×384)
assets/profile/avatars/pending/    aztec, diamond, dragon, king, titan              (sin asignar)
assets/profile/frames/cosmetic/    leaf, stellar, crystal, elite, master            (512×468)
assets/profile/frames/exclusive/   plus                                             (512×468)
assets/profile/frames/elo/         bronze … grandmaster (8)                         (512×468)
assets/profile/backgrounds/        mountain, forest, aurora, neon-city, space, galaxy, dimension (1200×400)
```

Verificación: dimensiones y alfa medidos por script. Los 8 marcos de rango venían con el **centro opaco** (disco violeta oscuro, alfa ≈ 250): en los derivados se recortó ese disco (sólo píxeles oscuros dentro del aro, así no se pierde el brillo del borde). El hueco de cada marco se midió con un ajuste de círculo sobre el borde interior y la geometría quedó en `src/features/cosmetics/assets.ts`; el avatar se dibuja en ese hueco y el marco encima, sin deformarse. Se verificó visualmente con una hoja de contacto de los 14 marcos con un avatar adentro.

Mapeo de archivos:

| Archivo | Uso |
|---|---|
| Zorro Clasico/Ninja/Explorador/Academico/Cyberpunk | skins Clásico, Ninja, Explorador, Académico, Cyber |
| Marco Hoja/Estelar/Cristal/Elite | marcos Hoja, Estelar, Cristal, Élite |
| Marco de perfil maestro (corona, centro transparente) | marco cosmético Maestro |
| Marco Polygo PLUS | marco Plus |
| Marco Bronce/Plata/Oro/Platino/Esmeralda/Diamante/Maestro/Gran Maestro (centro opaco, misma serie) | marcos de rango |
| Fondo Montaña/Bosque/Aurora/Ciudad Neon/Espacial/Galaxia/Dimension | fondos homónimos |

### Assets faltantes (el ítem existe en el catálogo con `available: false`: no se vende ni se equipa)

- Skins **Samurái**, **Guardián**, **Omega**, **Explorador Social**, **Leyenda del Equipo**.
- Marcos **Básico** (se dibuja en código: aro violeta; aceptable por ser el gratuito), **Diamante cosmético** (el `Marco Diamante.png` pertenece a la serie de rango y no se reutilizó para no mezclar categorías), **Leyenda** (invitaciones), **Evento**.
- Fondos **Sólido** (se dibuja en código: el violeta por defecto) y **Templo**.
- No hay fondo exclusivo de Plus entre las imágenes: no se inventó ninguno.

**Sin asignar** (no figuran en la especificación): Zorro Azteca, Diamante, Dragón, Rey, Titán. Están optimizados en `avatars/pending/` pero no se usan. Decisión pendiente del dueño (¿alguno es Samurái/Guardián/Omega?).

## 3. Catálogo

Fuente única `shared/cosmetics.ts` ↔ `cosmetic_items` (test `shop.test.mjs` compara ambos lados).

| Tipo | Ítem | Rareza | Precio (Polys) / desbloqueo | Arte |
|---|---|---|---:|---|
| Skin | Clásico | Gratis | Gratis | ✅ |
| Skin | Ninja | Común | 250 | ✅ |
| Skin | Explorador | Común | 250 | ✅ |
| Skin | Académico | Rara | 500 | ✅ |
| Skin | Samurái | Épica | 850 | ❌ |
| Skin | Cyber | Épica | 850 | ✅ |
| Skin | Guardián | Legendaria | 1.300 | ❌ |
| Skin | Omega | Mítica | 2.000 | ❌ |
| Skin | Explorador Social | Exclusiva | 5 amigos válidos | ❌ |
| Skin | Leyenda del Equipo | Exclusiva | 10 amigos válidos | ❌ |
| Marco | Básico | Gratis | Gratis | código |
| Marco | Hoja | Común | 150 | ✅ |
| Marco | Estelar | Común | 250 | ✅ |
| Marco | Cristal | Rara | 400 | ✅ |
| Marco | Élite | Épica | 700 | ✅ |
| Marco | Diamante | Legendaria | 1.100 | ❌ |
| Marco | Maestro | Legendaria | 1.500 | ✅ |
| Marco | PolyGo Plus | Exclusiva | Plus activo | ✅ |
| Marco | Leyenda | Exclusiva | 10 amigos válidos | ❌ |
| Marco | Evento | Limitada | Evento | ❌ |
| Marco | Marco de rango | — | Ganar una ranked (muestra el tier del ELO real) | ✅ ×8 |
| Fondo | Sólido | Gratis | Gratis | código |
| Fondo | Montaña | Común | 150 | ✅ |
| Fondo | Bosque | Común | 200 | ✅ |
| Fondo | Aurora | Rara | 400 | ✅ |
| Fondo | Ciudad Neón | Épica | 650 | ✅ |
| Fondo | Espacial | Épica | 850 | ✅ |
| Fondo | Templo | Legendaria | 1.100 | ❌ |
| Fondo | Galaxia | Legendaria | 1.400 | ✅ |
| Fondo | Dimensión | Mítica | 2.000 | ✅ |

Catálogo anterior (Menta, Coral, Fuego, Mar profundo…): retirado. No se vende ni se muestra, pero quien lo tiene lo conserva y lo puede usar. Bosque, Galaxia y Neón conservan su id con arte nuevo.

Rarezas (color de etiqueta y brillo de la ficha): Gratis gris-violeta, Común verde, Rara azul, Épica violeta, Legendaria dorado, Mítica magenta→cian, Exclusiva violeta-celeste, Limitada naranja.

Estados en la UI: Disponible (precio) · Bloqueado · Desbloqueado/comprado · Equipado · Exclusivo Plus · Recompensa de invitación · Recompensa de evento · Ranked · Próximamente (sin arte). Lo que no se compra nunca muestra precio.

## 4. Backend preparado (sin aplicar)

### `supabase/migrations/20261222120000_profile_customization.sql`
- Reemplaza los CHECK de `cosmetic_items`/`user_cosmetics` por CHECK con nombre (tipos, rarezas, orígenes, "sólo Polys tiene precio", "exclusivo ⇔ Plus/invitación", ids de skin).
- Inserta el catálogo v2, retira el viejo, reordena.
- `profiles_avatar_check` acepta las skins (`^skin-…`); compatible con producción (que ya tiene el CHECK de animales) y con bases viejas.
- `profiles.suspended_cosmetics` (jsonb) para pausar exclusivos de Plus sin borrar nada.
- `cosmetic_unlocked`/`cosmetic_lock_reason` (internas): gratis, rango (ganó una ranked en su idioma), Plus (`has_plus`), resto por propiedad; sin arte, nada.
- Trigger `profiles_guard_skin`: `avatar_id` es editable desde la app; una skin sólo entra si existe y es tuya.
- `buy_cosmetic`: además rechaza retirados y sin arte; equipa skins.
- `equip_cosmetic`: acepta `skin`; errores `plus_required`, `rank_required`, `item_unavailable`, `item_not_owned`.
- `reconcile_plus_cosmetics` + `sync_cosmetics()` (la app lo llama al abrir) + trigger en `user_entitlements` (alta/renovación/reembolso/baja): al vencer Plus el marco pasa a `suspended_cosmetics` y vuelve solo al renovar si el lugar sigue libre. Nunca se borran compras ni historial.

### `supabase/migrations/20261222120100_referrals.sql`
- `referral_attributions` (PK = invitado → un referente, una vez; `invitee <> referrer`; sin UPDATE/DELETE para la app; sin lectura directa).
- `referral_rewards` (PK usuario+hito: historial y anti-duplicado), `user_badges`.
- `referral_config()` espejo de `shared/referrals.ts` (desde 20261225120100_referral_plus_days): 3 → 7 días de Plus + Reclutador; 5 → 750 Polys + Embajador PolyGo + skin Explorador Social; 10 → 30 días de Plus + Leyenda del Equipo + marco Leyenda + Invitador Élite (aura dorada). Los días se suman en `user_entitlements` con `grant_plus_days` (source `referral`); un Plus manual sin vencimiento no cambia. Cuando exista el webhook de la tienda, debe respetar los días sumados encima de una suscripción.
- `claim_referral(code)`: código normalizado; rechaza auto-invitación, código inexistente o de cuenta sin onboarding, segunda atribución, cuentas de más de 7 días y referentes más nuevos que el invitado.
- `refresh_referrals` (interna): `pg_advisory_xact_lock` por referente; pasa a válidas las pendientes que cumplen; por cada hito alcanzado inserta en `referral_rewards` y **sólo si la fila es nueva** acredita Polys (`poly_credit` con clave `referral/milestone:N`), insignia y cosméticos. Una transacción: todo o nada, nunca dos veces.
- `get_referral_status()` (pantalla; sólo usuario público y estado de cada invitado, sin emails ni ids), `sync_referral()` (lado del invitado), `get_profile_flair(user)` (Plus activo e insignias, visible en perfiles).

### Plan de aplicación (requiere autorización explícita)
1. Backup verificado inmediatamente antes de aplicar.
2. Aplicar primero en una base desechable/staging y correr `npm run test:db -- shop referrals` contra ella.
3. Aplicar 20261222120000 y luego 20261222120100 en producción.
4. Regenerar `src/lib/database.generated.ts` y reemplazar `callPendingRpc` (src/lib/pendingRpc.ts) por llamadas tipadas.
5. Publicar el cliente (requiere build: hay assets nuevos).
Rollback: las dos migraciones son aditivas salvo los CHECK reemplazados; el rollback es dropear las funciones/tablas nuevas, restaurar las definiciones anteriores de `buy_cosmetic`/`equip_cosmetic` (20261101025309) y borrar las filas nuevas de `cosmetic_items` que nadie posea.

El cliente degrada solo si la migración no está: `sync_cosmetics`, `get_profile_flair` y la tarjeta de invitaciones detectan `PGRST202` y no muestran nada.

## 5. Economía (valores reales de `shared/polys.ts` y `shared/friendChallenges.ts`)

Ingreso diario estimado (sin contar premios únicos: hitos de racha, logros, rangos de temporada, unidades):

| Perfil | Qué hace | Polys/día |
|---|---|---:|
| Casual | 3 misiones + cofre 5 días/semana + bonus semanal | ~30 |
| Regular | Todos los días: misiones (15) + cofre (≈16,75) + semanal (≈7) + lecciones perfectas/unidades (≈4) + misiones de amigos parciales (≈20) + 2 victorias ranked (6) | ~69 |
| Comprometido | Todo lo anterior al máximo: misiones de amigos completas (35) y tope ranked (15) | ~94 |

Días para desbloquear cada precio:

| Precio | Casual | Regular | Comprometido |
|---:|---:|---:|---:|
| 150 | 6 | 3 | 2 |
| 250 | 9 | 4 | 3 |
| 400 | 14 | 6 | 5 |
| 500 | 17 | 8 | 6 |
| 650 | 22 | 10 | 7 |
| 700 | 24 | 11 | 8 |
| 850 | 29 | 13 | 10 |
| 1.100 | 37 | 16 | 12 |
| 1.300 | 44 | 19 | 14 |
| 1.400 | 47 | 21 | 15 |
| 1.500 | 51 | 22 | 16 |
| 2.000 | 68 | 30 | 22 |

Colección completa a la venta hoy (con arte): 10.500 Polys ≈ 153 días de un jugador regular; con todo el catálogo planeado, 16.850 ≈ 245 días. Los premios únicos (bienvenida 100, rachas 7/14/30 días = 140, logros) adelantan la primera compra común a la primera semana.

Conclusión: **los precios propuestos son coherentes** con la economía actual y no se cambiaron recompensas diarias, misiones ni logros. Comunes en menos de una semana de juego regular, míticos en un mes: deseables sin ser imposibles. Los premios de invitación (500 + 750) equivalen a 7 y 11 días de juego regular: atractivos como costo de adquisición sin romper la tienda. A observar después del lanzamiento: el protector de racha (100) y la recuperación (250/400) compiten por los mismos Polys.

## 6. Seguridad y anti-abuso

- Nada se otorga desde el cliente: precios, propiedad, Plus, rango, validez de invitaciones y premios los decide la base (`security definer`, `auth.uid()`).
- La app no puede escribir `frame_id`/`background_id` (sin GRANT) y `avatar_id` está protegido por trigger.
- Exclusivos: CHECK en la base (exclusivo ⇒ sin precio) + `buy_cosmetic` rechaza.
- Invitaciones: atribución única por PK, ventana de 7 días, referente más antiguo, email verificado + onboarding + actividad real, idempotencia por PK + clave única de Polys + lock por referente.
- Riesgo residual: una persona puede crear varias cuentas con emails reales distintos y completar una lección en cada una. No hay forma de evitarlo sin identificadores de dispositivo (descartados por la especificación). Mitigaciones posibles a futuro: revisión manual (`status = 'rejected'` vía service_role), tope diario de validaciones por referente, exigir N días de actividad.

## 7. Pruebas

- `supabase/tests/shop.test.mjs` (actualizado) y `supabase/tests/referrals.test.mjs` (nuevo), PGlite local: compra, saldo insuficiente sin efectos parciales, equipar comprado, no equipar bloqueado, skins con trigger, marco de rango sólo posicionado, marco Plus con/sin entitlement y vencimiento (trigger y sincronización perezosa), conservación de compras, catálogo retirado, invitación válida, duplicada, auto-invitación, registro incompleto, activación al completar la primera actividad, hitos 3/5/10, no duplicación, persistencia, insignias en el perfil. **21/21.**
- Jest: `src/features/cosmetics/__tests__/catalog.test.ts` (arte ↔ catálogo, rangos de precio, marcos de rango ↔ TIERS) y `state.test.ts` (estados de UI).
- Limitación: PGlite tiene una sola conexión; la concurrencia real (dos dispositivos a la vez) la serializa `pg_advisory_xact_lock` y debe verificarse en staging.

## 8. Pendientes

- Arte faltante (§2) y decisión sobre las 5 skins sin asignar.
- `expo-clipboard` para un botón "Copiar" real (dependencia nativa: requiere build de desarrollo).
- Enlace web `https://polygo.app/invite/<código>`: el deep link `polygo://invite/<código>` ya funciona; para el https hacen falta Universal Links/App Links (`associatedDomains`/`intentFilters` en app.json + archivos en el sitio) y una página en el sitio que redirija a las tiendas.
- Plus vencido sin que la app se abra: el marco sigue visible para otros hasta que el usuario abre la app o cambia la fila del entitlement. Opcional: un job diario (pg_cron) que llame `reconcile_plus_cosmetics` para los vencidos.
- QA en dispositivo (Android/iOS, pantallas chicas, rendimiento de las imágenes en listas largas).

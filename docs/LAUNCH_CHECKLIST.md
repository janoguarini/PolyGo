# Checklist de lanzamiento

Estado al 2026-10-29 (Fase 6). ✅ hecho y verificado · ⬜ pendiente. "Vos" = requiere tu cuenta, tu
dispositivo o una decisión de producto; el resto está en el repo.

## 1. Bloqueantes de tienda

| | Ítem | Quién | Dónde / cómo |
| --- | --- | --- | --- |
| ✅ | Borrado de cuenta dentro de la app (Apple 5.1.1(v), Google Play) | — | Perfil → Ajustes → Eliminar cuenta · Edge Function `delete-account` (borra también la foto de perfil de Storage) |
| ✅ | Fotos de perfil subidas por usuarios (Apple 1.2): reportar fotos | — | Perfil de otro jugador → "Reportar foto" (motivo obligatorio, anónimo, hasta 20 por día). Con 3 reportantes distintos la foto se oculta sola. Revisión manual: ver "Moderación de fotos" abajo |
| ✅ | Apple 1.2 también pide poder bloquear a un usuario abusivo y un contacto publicado | — | Perfil de otro jugador → Bloquear (no se cruzan en ranked, no entra a tus desafíos, no aparece en la clasificación); Ajustes → Usuarios bloqueados para desbloquear. Contacto: polygocontacto@gmail.com (ponerlo también como email de soporte en las fichas) |
| ✅ | URL web para pedir el borrado sin la app (Google Play la exige) | — | https://polygoidiomas.netlify.app/borrar-cuenta (provisoria hasta el dominio propio; ver [WEB.md](WEB.md)). Cargarla en Play Console → Seguridad de los datos |
| ✅ | Política de privacidad publicada en una URL | — | https://polygoidiomas.netlify.app/privacidad (provisoria). Ya cargada en `eas.json` como `EXPO_PUBLIC_PRIVACY_POLICY_URL`. Falta ponerla en ambas tiendas y, antes del lanzamiento, que la revise alguien con conocimiento legal |
| ✅ | Currículo A1 completo: 12 unidades, 60 lecciones, 244 palabras, 457 ejercicios | — | Cargado y verificado por checksum contra Supabase |
| ⬜ | Revisión editorial humana del contenido A1 (`review_status = 'draft'`) | Vos | Ver LEARNING_CURRICULUM.md |
| ✅ | Bundle ID / package definitivos: `com.polygoidioma.app` | Vos | `app.json`; cambiarlo después de publicar no es posible |
| ⬜ | Ícono, splash y capturas definitivas | Vos | `assets/`; capturas para la ficha de cada tienda |

## 2. Cuentas y builds

| | Ítem | Quién | Cómo |
| --- | --- | --- | --- |
| ⬜ | Vincular el proyecto a EAS | Vos | `npx eas-cli@latest login` + `npx eas-cli@latest init` |
| ⬜ | Cuenta de Apple Developer (paga) y de Google Play Console | Vos | Necesarias para builds de dispositivo iOS y para publicar |
| ✅ | Perfiles de build (`development`, `development-simulator`, `preview`, `production`) con versión remota y `autoIncrement` | — | `eas.json` |
| ⬜ | Build de producción | Vos | `npx eas-cli@latest build --profile production --platform all` |
| ⬜ | Subir a las tiendas | Vos | `npx eas-cli@latest submit --platform ios|android` (TestFlight / prueba interna primero) |
| ⬜ | Versión `1.0.0` en `app.json` al publicar (hoy `0.1.0`) | Vos | El número de build lo maneja EAS (`appVersionSource: remote`) |

## 3. Configuración de producción

| | Ítem | Estado |
| --- | --- | --- |
| ✅ | iOS: `usesNonExemptEncryption: false` (sólo HTTPS estándar; evita la pregunta de exportación en cada build) | `app.json` |
| ✅ | Android: permisos mínimos. Sólo `INTERNET` y `VIBRATE`; bloqueados `SYSTEM_ALERT_WINDOW` y almacenamiento externo | Verificado en el manifest generado |
| ✅ | Pantalla de error global (Expo Router `ErrorBoundary`) en vez de pantalla en blanco | `src/app/_layout.tsx` |
| ⬜ | Supabase Redirect URLs: dejar sólo `polygo://auth-callback` (sacar las `exp://`) | Vos, en el dashboard |
| ⬜ | SMTP propio en Supabase Auth (el incluido tiene límites muy bajos) | Vos |
| ⬜ | Protección de contraseñas filtradas (HaveIBeenPwned) | Vos: decidir; puede requerir plan Pro |
| ⬜ | CAPTCHA en registro si aparece abuso (no hay confirmación de email) | Vos, si hace falta |
| ⬜ | Servidor de partidas desplegado con HTTPS (`wss://`) y `EXPO_PUBLIC_BATTLE_SERVER_URL` apuntando ahí | Vos: elegir hosting (DEPLOYMENT.md) |
| ✅ | Parche `react-native` 0.88.1 (expo-doctor 20/20) | 2026-10-30 |

## 4. Calidad

| | Ítem | Estado |
| --- | --- | --- |
| ✅ | CI en GitHub Actions: typecheck, lint, Jest, SQL + RLS y servidor en cada push y PR | `.github/workflows/ci.yml` |
| ✅ | Contraste WCAG AA de todos los colores de texto (test automático) | `src/design-system/__tests__/contrast.test.ts`. Corregidos: placeholders (2,1:1 → 3,5:1) y feedback de respuestas en batalla (2,5:1 → 5,5:1) |
| ✅ | Elementos tocables con rol y etiqueta para lectores de pantalla; zonas táctiles ≥ 44 pt | Auditoría de todos los `Pressable` |
| ✅ | Texto escalable (Dynamic Type / tamaño de fuente del sistema) hasta 1,6× | `Text` (`maxFontSizeMultiplier`) |
| ✅ | Advisors de Supabase: sin avisos nuevos (los 4 `SECURITY DEFINER` son intencionales y están documentados en SECURITY.md) | 2026-10-29 |
| ✅ | `npm audit`: servidor 0 vulnerabilidades. App: el único aviso alto es `zod@3` dentro de `@expo/cli` (herramienta de build, no viaja en la app); `audit fix --force` bajaría Expo a SDK 51, así que se acepta | 2026-10-29 |
| ⬜ | Pasada manual en dispositivos reales (iPhone y Android): registro → onboarding → lección → repaso → ranked → widgets → editar perfil → eliminar cuenta | Vos. Guion en la sección 6 |
| ⬜ | Pasada con VoiceOver (iOS) y TalkBack (Android) por los flujos principales | Vos |
| ⬜ | Monitoreo de errores en producción (p. ej. Sentry) | Decisión pendiente: requiere cuenta; hoy sólo hay logs del servidor |

## 5. Fichas de tienda

- **Apple → Privacidad de la app:** datos vinculados al usuario: email (cuenta), nombre de usuario (identificador), contenido del usuario (progreso de aprendizaje, partidas). Uso: funcionalidad de la app. **Sin** seguimiento, **sin** publicidad, **sin** analítica de terceros.
- **Google Play → Seguridad de los datos:** lo mismo. Datos cifrados en tránsito (HTTPS). El usuario puede pedir el borrado (en la app y en la URL web de la sección 1).
- **Clasificación por edad:** sin contenido sensible; hay interacción entre usuarios limitada (nombre de usuario y avatar visibles en clasificación y partidas, sin chat).
- **Categoría:** Educación.

## 6. Guion de prueba manual

1. Registro con un email nuevo → onboarding → llega a Inicio.
2. Lección 1 completa: logros "Primer paso" (y "Impecable" si es perfecta); se desbloquea la lección 2; la racha aparece en Inicio.
3. Repaso de palabras vencidas (o forzar con una palabra recién estudiada al día siguiente).
4. Ranked con dos cuentas en dos dispositivos: buscar, confirmar, jugar, resultado con ELO; cortar el Wi-Fi de uno 5 s (vuelve a la partida) y 20 s (pierde por abandono). Práctica sin ELO.
5. Widgets: agregar «Palabra» y «Pregunta rápida», responder una ronda completa, cerrar sesión (los widgets pasan a «Abrí Polygo»).
6. Perfil: editar nombre/avatar, cambiar privacidad, ver logros e historial, abrir el perfil de otro jugador.
7. Eliminar cuenta: el botón sólo se habilita con el usuario exacto; después vuelve a la bienvenida y no se puede iniciar sesión con esa cuenta.
8. Modo avión en Inicio y en una lección: mensajes de "sin conexión", sin pantallas en blanco.

## Moderación de fotos

Los reportes quedan en `public.avatar_reports` (sólo visible desde el dashboard). Para revisarlos, en el SQL Editor:

```sql
select r.reported_id, p.username, r.avatar_path, count(*) as reportes,
       array_agg(distinct r.reason) as motivos, max(r.created_at) as ultimo
from public.avatar_reports r join public.profiles p on p.id = r.reported_id
where r.reviewed_at is null
group by r.reported_id, p.username, r.avatar_path
order by reportes desc, ultimo desc;
```

- La foto está en Storage → bucket `avatars` → carpeta del `reported_id` → `avatar.jpg`.
- Si es inapropiada: `update public.profiles set avatar_path = null where id = '<reported_id>';` y borrar el archivo desde Storage (con 3 reportes ya se ocultó sola, pero el archivo sigue ahí hasta que lo borres o el usuario suba otra).
- Marcar los reportes como revisados: `update public.avatar_reports set reviewed_at = now() where reported_id = '<reported_id>' and reviewed_at is null;`

# Variables de entorno de la app

Sólo variables públicas `EXPO_PUBLIC_*`: Expo las **empaqueta dentro de la app** (cualquiera puede
leerlas del binario). Nunca una clave secreta. La lista y sus reglas viven en `shared/publicEnv.ts`.

| Variable                         | Obligatoria | Uso actual                                                                                                       | Ejemplo (sin secretos)                 |
| -------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`       | Siempre     | `src/lib/supabase.ts`: cliente de Supabase (auth, PostgREST, RPC, Edge Functions)                                | `https://YOUR-PROJECT-REF.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`  | Siempre     | `src/lib/supabase.ts`: clave pública. **Nunca** `service_role` ni `sb_secret_…` (la app y el script la rechazan) | `your-publishable-anon-key`            |
| `EXPO_PUBLIC_BATTLE_SERVER_URL`  | Producción  | `src/features/battle/client.ts`: servidor de partidas Ranked. Ver «Servidor de partidas» abajo                   | `https://battle.example.org`           |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Producción  | `src/app/settings.tsx`: enlace a la política de privacidad (exigida por las tiendas). Hoy en `eas.json`          | `https://example.org/privacidad`       |

En producción las URL tienen que ser `https`. En desarrollo se admite `http` (por ejemplo, el servidor de
partidas en la red local).

## Validaciones

- **En la app** (`src/lib/env.ts`): si falta o es inválida una variable de Supabase, la app muestra
  `ConfigMissing` con los nombres (nunca los valores) en lugar de fingir un backend. Las URL opcionales
  se validan aparte: una URL inválida del servidor de partidas o de la política de privacidad apaga
  sólo esa función, nunca el resto de la app.
- **Antes de una build** (`scripts/check-env.ts`):

  ```bash
  npm run env:check                    # entorno del proceso + .env, reglas de desarrollo
  npm run env:check -- --production    # reglas de producción (las cuatro obligatorias, https)
  npm run env:check -- --file otro.env
  npm run env:check -- --profile preview   # valores de ese perfil de eas.json, sin .env local
  ```

  Imprime sólo nombres y estado (`ok`, `falta`, `inválida`, `ES UNA CLAVE SECRETA`) y sale con código 1
  si hay problemas.

## Servidor de partidas

`shared/publicEnv.ts` (`resolveBattleServer`, `rankedBackendFor`) decide quién atiende Ranked y
Práctica. Los desafíos con amigos no dependen de esto: van siempre por Supabase y no mueven el ELO.

| `EXPO_PUBLIC_BATTLE_SERVER_URL` | Desarrollo (`__DEV__`)           | Preview / production           |
| ------------------------------- | -------------------------------- | ------------------------------ |
| https válida                    | Servidor de partidas             | Servidor de partidas           |
| http válida                     | Servidor de partidas (red local) | Ranked deshabilitado con aviso |
| Vacía                           | Ranked legacy por Supabase       | Ranked deshabilitado con aviso |
| Inválida                        | Ranked deshabilitado con aviso   | Ranked deshabilitado con aviso |

Una build de preview o production nunca cae en silencio al Ranked legacy.

## Producción (EAS): cada variable en un solo lugar

- **En `eas.json` (versionado):** las URL públicas que no cambian entre máquinas,
  `EXPO_PUBLIC_PRIVACY_POLICY_URL` (todos los perfiles) y `EXPO_PUBLIC_BATTLE_SERVER_URL` (sólo
  `preview` y `production`; `development` usa el `.env` local porque el JS sale de Metro).
- **En el entorno de EAS (no versionado):** `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
  Las builds de EAS **no** leen el `.env` local (está en `.gitignore`); una build sin ellas arranca en
  `ConfigMissing`.
- No definir la misma variable en los dos lugares: la documentación de EAS no fija cuál gana.

| Variable                         | `development`                 | `preview`             | `production`             |
| -------------------------------- | ----------------------------- | --------------------- | ------------------------ |
| `EXPO_PUBLIC_SUPABASE_URL`       | `.env` local (Metro)          | entorno EAS `preview` | entorno EAS `production` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`  | `.env` local (Metro)          | entorno EAS `preview` | entorno EAS `production` |
| `EXPO_PUBLIC_BATTLE_SERVER_URL`  | `.env` local (vacía = legacy) | `eas.json`            | `eas.json`               |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | `eas.json`                    | `eas.json`            | `eas.json`               |

La clave de Supabase de la app es la **anon / publishable** (`sb_publishable_…` o un JWT con
`role: anon`). La `service_role` / `sb_secret_…` es del servidor de partidas y del batch: nunca va en
EAS para la app (aunque se marque «secret», `EXPO_PUBLIC_*` se empaqueta en el binario). La app y
`npm run env:check` la rechazan.

Antes de cada build: `npm run env:check -- --profile <perfil>` (las de Supabase aparecen como
«falta» porque el script no lee el entorno de EAS; se comprueban exportándolas con `--file`).

## Riesgo: preview usa producción

`preview` apunta al **mismo** servidor de partidas (Railway) y al **mismo** proyecto de Supabase que
`production`. Una partida Ranked jugada en una build de preview es una partida real: mueve el ELO y el
historial de cuentas reales y entra en la clasificación.

Hasta que exista un entorno aislado (servidor de partidas y base de pruebas) o una estrategia de
pruebas segura acordada, **no distribuir builds de preview para probar Ranked**. Las pruebas de
Ranked se hacen con la build de `development` y cuentas de prueba, sabiendo que también escriben en
producción.

## Lo que no es una variable

- La **versión instalada** sale de `version` en `app.json` (`Constants.expoConfig.version`).
- El **nivel curricular** de la build es la constante `CURRICULUM_API` de `src/lib/clientInfo.ts`.
- La **versión mínima** se configura en el servidor (`app_client_policy`), no en la app. Ver
  `docs/LEARNING_PHASE_C.md` §C5.
- El servidor de partidas (`server/`) usa `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `PORT`
  (`docs/DEPLOYMENT.md`); esas sí son secretas y nunca van en la app.

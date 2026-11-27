import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Extiende app.json con el SDK de Meta (eventos de la app para Meta Ads).
 *
 * El plugin sólo se agrega si hay META_APP_ID y META_CLIENT_TOKEN (eas.json → env de cada perfil, o
 * .env en local). Sin ellos la app se arma igual que antes y src/lib/metaEvents.ts no hace nada.
 *
 * - isAutoInitEnabled: false → la app inicia el SDK ella misma (metaEvents.initMeta), así respeta el
 *   interruptor de analítica de Ajustes antes de mandar nada.
 * - autoLogAppEventsEnabled: true → instalación y apertura (las que usa Meta para atribuir).
 * - advertiserIDCollectionEnabled: false → el IDFA / Advertising ID se activa en tiempo de ejecución
 *   sólo si la persona no apagó la analítica (y en iOS, si aceptó el aviso de rastreo).
 *
 * Las compras se registran a mano (logPurchase): en el panel de Meta hay que apagar «Registrar
 * compras dentro de la app automáticamente» en las tarjetas de iOS y Android para no contarlas dos
 * veces.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const appID = process.env.META_APP_ID?.trim();
  const clientToken = process.env.META_CLIENT_TOKEN?.trim();
  const meta = Boolean(appID && clientToken);
  const base = config as ExpoConfig;
  return {
    ...base,
    plugins: [
      ...(base.plugins ?? []),
      ...(meta
        ? [
            [
              'react-native-fbsdk-next',
              {
                appID,
                clientToken,
                displayName: 'PolyGo',
                scheme: `fb${appID}`,
                isAutoInitEnabled: false,
                autoLogAppEventsEnabled: true,
                advertiserIDCollectionEnabled: false,
              },
            ] as [string, Record<string, unknown>],
          ]
        : []),
    ],
    extra: { ...base.extra, metaEnabled: meta },
  };
};

import type { AdsNativeAdapter } from './types';

/**
 * Inicialización del SDK de Google Mobile Ads: una sola vez por proceso.
 * Llamadas simultáneas comparten la misma promesa; si falla, la próxima llamada reintenta.
 */
export function createSdkInitializer(adapter: AdsNativeAdapter) {
  let done = false;
  let inflight: Promise<void> | null = null;
  return {
    get initialized() {
      return done;
    },
    initialize(): Promise<void> {
      if (done) return Promise.resolve();
      inflight ??= adapter
        .initialize()
        .then(() => {
          done = true;
        })
        .finally(() => {
          inflight = null;
        });
      return inflight;
    },
  };
}

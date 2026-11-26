import type PostHog from 'posthog-react-native';

/**
 * Analítica de producto (PostHog, región US). Un solo punto de entrada para toda la app:
 *
 * - Sin EXPO_PUBLIC_POSTHOG_KEY, en desarrollo (salvo EXPO_PUBLIC_POSTHOG_DEV=1) y en los tests no se
 *   crea el cliente y todo esto no hace nada.
 * - Se identifica sólo con el id interno de la cuenta (nunca email ni nombre) y propiedades del
 *   producto (idioma, nivel, Plus).
 * - El usuario puede apagarla en Ajustes (optOut): PostHog guarda esa elección en el teléfono.
 * - Sin grabación de sesiones. Los eventos viajan en tandas y, sin red, esperan en el teléfono.
 *
 * Los nombres de eventos van en snake_case y en inglés (como los de PostHog): ver AnalyticsEvent.
 */

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY?.trim() || undefined;
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';
const DEV_ENABLED = process.env.EXPO_PUBLIC_POSTHOG_DEV === '1';

/** Eventos del producto (el embudo de registro, el aprendizaje, Ranked y Plus). */
export type AnalyticsEvent =
  | 'onboarding_step_viewed'
  | 'onboarding_completed'
  | 'username_suggestion_used'
  | 'tutorial_completed'
  | 'tutorial_skipped'
  | 'push_delivered'
  | 'push_opened'
  | 'push_permission'
  | 'lesson_started'
  | 'lesson_completed'
  | 'review_started'
  | 'review_completed'
  | 'battle_started'
  | 'battle_finished'
  | 'plus_viewed'
  | 'purchase_started'
  | 'purchase_completed'
  | 'purchase_failed';

type Props = Record<string, string | number | boolean | null | undefined>;

let client: PostHog | null | undefined;

function enabledHere(): boolean {
  if (!KEY) return false;
  if (process.env.NODE_ENV === 'test') return false;
  return !__DEV__ || DEV_ENABLED;
}

/** El cliente (se crea la primera vez); null si la analítica está apagada en esta build. */
function ph(): PostHog | null {
  if (client !== undefined) return client;
  if (!enabledHere()) {
    client = null;
    return client;
  }
  try {
    // require diferido: sin key (tests, desarrollo) ni se carga el SDK.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: PostHogClient } = require('posthog-react-native') as {
      default: typeof PostHog;
    };
    client = new PostHogClient(KEY!, {
      host: HOST,
      captureAppLifecycleEvents: true,
      enableSessionReplay: false,
    });
  } catch {
    client = null;
  }
  return client;
}

const clean = (props?: Props) =>
  props
    ? (Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) as Record<
        string,
        string | number | boolean | null
      >)
    : undefined;

/** ¿Hay analítica en esta build? (para mostrar el interruptor de Ajustes). */
export function analyticsAvailable(): boolean {
  return enabledHere();
}

/** Arranca el cliente al abrir la app (registra «Application Opened» cuanto antes). */
export function initAnalytics(): void {
  ph();
}

export function track(event: AnalyticsEvent, props?: Props): void {
  try {
    ph()?.capture(event, clean(props));
  } catch {
    // La analítica nunca rompe la app.
  }
}

/** Pantalla vista; `name` es la ruta con sus parámetros como plantilla (/lesson/[id]). */
export function trackScreen(name: string): void {
  try {
    ph()?.screen(name);
  } catch {
    // Ídem.
  }
}

/** Asocia los eventos a la cuenta (sólo el id interno) y guarda propiedades del producto. */
export function identifyUser(userId: string, props?: Props): void {
  try {
    const p = ph();
    if (!p) return;
    p.identify(userId, { $set: clean(props) ?? {} });
  } catch {
    // Ídem.
  }
}

/** Al cerrar sesión: lo que pase después ya no se asocia a esa cuenta. */
export function resetAnalytics(): void {
  try {
    ph()?.reset();
  } catch {
    // Ídem.
  }
}

/** Interruptor de Ajustes. */
export function setAnalyticsEnabled(enabled: boolean): void {
  try {
    const p = ph();
    if (!p) return;
    if (enabled) void p.optIn();
    else void p.optOut();
  } catch {
    // Ídem.
  }
}

export function analyticsEnabled(): boolean {
  const p = ph();
  return p ? !p.optedOut : false;
}

/** Sólo para tests. */
export function __resetAnalyticsClient(next?: PostHog | null): void {
  client = next;
}

/**
 * Payload de un feature flag de PostHog (configuración remota: p. ej. la prioridad del push
 * inteligente, «smart-push-priority»). undefined sin analítica, sin el flag o si todavía no cargó.
 */
export function flagPayload(key: string): unknown {
  try {
    return ph()?.getFeatureFlagResult(key)?.payload;
  } catch {
    return undefined;
  }
}

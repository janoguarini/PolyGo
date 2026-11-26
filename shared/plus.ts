/**
 * PolyGo Plus: qué permite cada plan y los límites de la versión gratis. Fuente única para la app
 * (useEntitlements) y para las pruebas; el servidor replica los límites en coach_config() y un test
 * compara ambos (supabase/tests/plusStore.test.mjs).
 *
 * La CONDICIÓN (¿tiene Plus? ¿compró Sin publicidad?) nunca la decide la app: sale del servidor
 * (get_entitlements(), sobre user_entitlements, que el cliente no puede escribir). Este archivo sólo
 * traduce esa condición a permisos concretos, para que ninguna pantalla repita reglas sueltas.
 *
 * Ranked no aparece acá a propósito: es igual para todos y pagar nunca da ventajas.
 */

/** Límites de la versión gratis. Cambiarlos acá (y en coach_config() si es del Coach). */
export const FREE_LIMITS = {
  /** Sesiones personalizadas del Coach que tiene cada cuenta gratis, de por vida. */
  coachTrialSessions: 2,
} as const;

/** Sesiones de Coach: ~3 minutos (8 ejercicios a 20–28 s). */
export const COACH = {
  sessionSize: 8,
  /** Áreas débiles que trabaja una sesión (y que muestra el plan de mejora). */
  maxAreas: 3,
} as const;

/** Lo que el servidor dice del usuario. undefined = todavía no se sabe. */
export interface EntitlementFacts {
  plus: boolean | undefined;
  /** Compra única «Sin publicidad». */
  adFree: boolean | undefined;
}

/**
 * Permisos de la app. `undefined` = todavía no se sabe: la UI no debe asumir ninguno de los dos
 * (ni mostrar el muro ni dar el beneficio).
 */
export interface Entitlements {
  isPlus: boolean | undefined;
  /** Las lecciones no gastan energía (lo aplica submit_learning_session con has_plus). */
  unlimitedEnergy: boolean | undefined;
  /** Ningún anuncio, tampoco los opcionales con recompensa. Plus o Sin publicidad. */
  noAds: boolean | undefined;
  /** Repaso inteligente y por tema (lo exige learning_start_focus_review con has_plus). */
  smartReview: boolean | undefined;
  /** Coach sin límite de sesiones; sin Plus quedan las de prueba (coach_claim_session). */
  unlimitedCoach: boolean | undefined;
  /** Historial y rendimiento por tema completos. */
  advancedStats: boolean | undefined;
  /** Elegir el contenido del widget «Palabra». */
  personalizedWidgets: boolean | undefined;
  /** Cosméticos exclusivos de Plus (marco PLUS, zorros Plus). */
  plusCosmetics: boolean | undefined;
}

export type EntitlementKey = keyof Entitlements;

/** Permisos que da Plus (todos menos noAds, que también da Sin publicidad). */
const PLUS_FEATURES = [
  'isPlus',
  'unlimitedEnergy',
  'smartReview',
  'unlimitedCoach',
  'advancedStats',
  'personalizedWidgets',
  'plusCosmetics',
] as const satisfies readonly EntitlementKey[];

export function resolveEntitlements(facts: EntitlementFacts): Entitlements {
  const plus = facts.plus;
  const out = {} as Entitlements;
  for (const key of PLUS_FEATURES) out[key] = plus;
  // Un plan pago confirmado alcanza aunque falte saber el otro.
  out.noAds =
    plus === true || facts.adFree === true
      ? true
      : plus === undefined || facts.adFree === undefined
        ? undefined
        : false;
  return out;
}

/** Sesiones de prueba del Coach que le quedan a una cuenta gratis (nunca negativo). */
export function coachTrialRemaining(used: number, limit: number = FREE_LIMITS.coachTrialSessions) {
  return Math.max(0, limit - Math.max(0, used));
}

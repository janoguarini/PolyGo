/**
 * Energía de las lecciones guiadas. Fuente única de los valores: la base los replica en
 * public.energy_config() (migración energy_plus) y un test compara ambos lados.
 *
 * Sólo completar una lección guiada gasta energía. Equivocarse, entrar o abandonar una lección,
 * ranked, los repasos y lo social nunca la usan. Con PolyGo Plus es ilimitada.
 * La autoridad es el servidor: la recarga se calcula con su reloj, no con el del teléfono.
 */
export const ENERGY = {
  /** Máximo para cuentas gratuitas. */
  max: 5,
  /** Segundos para recuperar una unidad (3 horas). */
  regenSeconds: 3 * 60 * 60,
  /** Lo que gasta completar una lección. */
  lessonCost: 1,
} as const;

/** Lo que devuelve public.get_energy(). Fechas en ISO. */
export interface EnergySnapshot {
  plus: boolean;
  plus_expires_at: string | null;
  energy: number;
  max: number;
  regen_seconds: number;
  lesson_cost: number;
  /** Cuándo se recupera la próxima unidad (null si está llena o con Plus). */
  next_unit_at: string | null;
  /** Cuándo vuelve al máximo (null si ya está llena o con Plus). */
  full_at: string | null;
  server_now: string;
}

export interface EnergyView {
  plus: boolean;
  energy: number;
  max: number;
  /** Milisegundos hasta la próxima unidad (null si está llena o con Plus). */
  msToNext: number | null;
  /** Milisegundos hasta llenarse (null si está llena o con Plus). */
  msToFull: number | null;
  canStartLesson: boolean;
}

/**
 * Proyecta una lectura del servidor a `serverNowMs` (la hora del servidor estimada con el desfase
 * medido al pedirla) para que la cuenta regresiva avance sin volver a consultar. Es sólo visual:
 * el servidor recalcula todo al guardar una lección.
 */
export function projectEnergy(snapshot: EnergySnapshot, serverNowMs: number): EnergyView {
  if (snapshot.plus) {
    return {
      plus: true,
      energy: snapshot.max,
      max: snapshot.max,
      msToNext: null,
      msToFull: null,
      canStartLesson: true,
    };
  }
  const regenMs = snapshot.regen_seconds * 1000;
  let energy = snapshot.energy;
  let nextAt = snapshot.next_unit_at ? new Date(snapshot.next_unit_at).getTime() : null;
  if (nextAt !== null && serverNowMs >= nextAt) {
    const gained = Math.floor((serverNowMs - nextAt) / regenMs) + 1;
    energy = Math.min(snapshot.max, energy + gained);
    nextAt = energy >= snapshot.max ? null : nextAt + gained * regenMs;
  }
  const msToNext = nextAt === null ? null : Math.max(0, nextAt - serverNowMs);
  const msToFull =
    msToNext === null ? null : msToNext + Math.max(0, snapshot.max - energy - 1) * regenMs;
  return {
    plus: false,
    energy,
    max: snapshot.max,
    msToNext,
    msToFull,
    canStartLesson: energy >= snapshot.lesson_cost,
  };
}

/** «2 h 15 min», «40 min», «menos de 1 min». Redondea hacia arriba los minutos. */
export function formatEnergyWait(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  if (minutes <= 0) return 'menos de 1 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

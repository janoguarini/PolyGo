/**
 * Experiencia (XP) y nivel global del jugador. Fuente única de los valores: la base los replica en
 * public.xp_config() y public.xp_level_need() (migración 20261222120200_player_xp) y
 * supabase/tests/xp.test.mjs compara ambos lados.
 *
 * - El XP mide experiencia acumulada en toda la cuenta (todos los idiomas). El nivel sale del XP.
 * - Es independiente del ELO: un nivel 35 en Bronce III es perfectamente posible.
 * - Lo otorga sólo la base, derivándolo de lo que el servidor ya registró (learning_sessions,
 *   battles/battle_players y user_mission_rewards). La app nunca dice cuánto XP ganó.
 * - Cada ganancia tiene una clave única (source, ref): acreditar dos veces lo mismo es imposible.
 * - Los topes diarios se cuentan en el propio registro de XP (no dependen de la zona horaria que
 *   mande la app), así que repetir actividades no genera XP infinito.
 * - No da Polys, no cambia el ELO ni el emparejamiento. Las recompensas por nivel están previstas
 *   (`levelRewards`) pero vacías hasta que se aprueben.
 */

export type XpSource =
  /** Primera vez que completás una lección (una vez por lección, para siempre). */
  | 'lesson_first'
  /** Repetir una lección ya completada (práctica): poco XP y con tope diario. */
  | 'lesson_repeat'
  /** Repaso completado. */
  | 'review'
  /** Partida ranked ganada (también si el rival abandona). */
  | 'ranked_win'
  /** Partida ranked perdida o empatada jugándola hasta el final (abandonar no da XP). */
  | 'ranked_loss'
  /** Las 3 misiones del día completas (cofre abierto). */
  | 'daily_challenge';

export const XP = {
  amounts: {
    lesson_first: 20,
    lesson_repeat: 5,
    review: 10,
    ranked_win: 30,
    ranked_loss: 10,
    daily_challenge: 40,
  } satisfies Record<XpSource, number>,
  /**
   * Topes por día (día local de la sesión para lecciones y repasos; día UTC para ranked). Las
   * ganancias de ranked comparten un único tope: las primeras N partidas del día dan XP.
   * lesson_first no tiene tope: el contenido es finito. daily_challenge es 1 por día por su clave.
   */
  dailyCaps: {
    lesson_repeat: 10,
    review: 5,
    ranked: 10,
  },
  /**
   * Margen (días) que vuelve a mirar cada sincronización: cubre sesiones y partidas que se
   * registran tarde (cola sin conexión). Lo que llegue después de este margen no suma XP.
   */
  lookbackDays: 7,
  /** Curva: XP para pasar del nivel L al L+1 = redondeo a 5 de (base + factor·(L−1)^exponent). */
  curve: { base: 50, factor: 9, exponent: 1.2 },
  /** Nivel máximo calculable (techo técnico, inalcanzable en la práctica: ~2,4 M de XP). */
  maxLevel: 500,
  /** Premios por nivel: previstos, sin definir. No agregar sin aprobación. */
  levelRewards: [] as readonly { level: number }[],
} as const;

/** XP necesaria para pasar del nivel `level` al siguiente. */
export function xpForNextLevel(level: number): number {
  const { base, factor, exponent } = XP.curve;
  const l = Math.max(1, Math.floor(level));
  return Math.round((base + factor * Math.pow(l - 1, exponent)) / 5) * 5;
}

/** XP acumulada necesaria para llegar a `level` (nivel 1 = 0). */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < Math.min(level, XP.maxLevel); l++) total += xpForNextLevel(l);
  return total;
}

export interface XpProgress {
  total: number;
  level: number;
  /** XP ganada dentro del nivel actual. */
  into: number;
  /** XP que hace falta para completar el nivel actual. */
  need: number;
  /** Cuánto falta para el siguiente nivel. */
  remaining: number;
  /** 0..1 dentro del nivel actual. */
  ratio: number;
}

/** Nivel y progreso dentro del nivel para un total de XP. */
export function xpProgress(rawTotal: number): XpProgress {
  const total = Math.max(0, Math.floor(rawTotal));
  let level = 1;
  let floor = 0;
  while (level < XP.maxLevel) {
    const need = xpForNextLevel(level);
    if (total < floor + need) break;
    floor += need;
    level += 1;
  }
  const need = level < XP.maxLevel ? xpForNextLevel(level) : 0;
  const into = total - floor;
  return {
    total,
    level,
    into,
    need,
    remaining: Math.max(0, need - into),
    ratio: need > 0 ? Math.min(1, into / need) : 1,
  };
}

/** Texto corto de cada ganancia, para el aviso de "+20 XP". */
export function xpSourceLabel(source: XpSource): string {
  switch (source) {
    case 'lesson_first':
      return 'Lección completada';
    case 'lesson_repeat':
      return 'Práctica de lección';
    case 'review':
      return 'Repaso completado';
    case 'ranked_win':
      return 'Victoria ranked';
    case 'ranked_loss':
      return 'Partida ranked';
    case 'daily_challenge':
      return 'Desafío diario';
  }
}

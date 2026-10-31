/**
 * Economía de Polys, la moneda de la app. Fuente única de los valores: la base los replica en
 * public.poly_config() (migración 20261031193836_polys_economy) y un test compara ambos lados.
 *
 * Se ganan volviendo todos los días (misiones, cofre, racha) y se gastan en cuidar la racha y en
 * cosméticos. Nunca dan ventaja en ranked. Los legendarios no se compran con Polys.
 */

export const POLYS = {
  /** Regalo al empezar (alcanza para el primer protector). */
  welcome: 100,
  /** Cada misión diaria completada. */
  mission: 5,
  /** Cofre del día al completar las 3 misiones: entre min y max, o jackpot con esa probabilidad. */
  chest: { min: 10, max: 20, jackpot: 50, jackpotChance: 0.05 },
  /** Cofre abierto `days` días de la misma semana (lunes a domingo). */
  weekly: { days: 5, bonus: 50 },
  /** Lección con 3★ por primera vez. */
  lessonPerfect: 2,
  /** Unidad terminada (todas sus lecciones), una sola vez. */
  unit: 20,
  /** Victoria ranked, con tope diario. */
  rankedWin: 3,
  rankedWinsPerDay: 5,
  /** Primera vez que llegás a cada rango en la temporada. */
  rankReached: {
    silver: 50,
    gold: 75,
    platinum: 100,
    emerald: 150,
    diamond: 200,
    master: 250,
    grandmaster: 300,
  },
  /** Hitos de racha (mejor racha de la vida, una sola vez cada uno). */
  streakMilestones: [
    { days: 7, polys: 25 },
    { days: 14, polys: 40 },
    { days: 30, polys: 75 },
    { days: 50, polys: 100 },
    { days: 100, polys: 200 },
    { days: 365, polys: 500 },
  ],
  /** Subir un logro al nivel N da min(N × perLevel, max). */
  achievement: { perLevel: 10, max: 50 },
  /** Precios de la tienda. */
  prices: { streakFreeze: 100 },
} as const;

export type PolyReason =
  | 'welcome'
  | 'mission'
  | 'chest'
  | 'weekly'
  | 'lesson_perfect'
  | 'unit'
  | 'ranked_win'
  | 'rank'
  | 'streak'
  | 'achievement'
  | 'shop_freeze';

/** Texto corto de cada movimiento, para el aviso de "+5 Polys". */
export function polyReasonLabel(reason: PolyReason): string {
  switch (reason) {
    case 'welcome':
      return 'Regalo de bienvenida';
    case 'mission':
      return 'Misión completada';
    case 'chest':
      return 'Cofre del día';
    case 'weekly':
      return 'Bonus semanal';
    case 'lesson_perfect':
      return 'Lección perfecta';
    case 'unit':
      return 'Unidad terminada';
    case 'ranked_win':
      return 'Victoria ranked';
    case 'rank':
      return 'Nuevo rango';
    case 'streak':
      return 'Hito de racha';
    case 'achievement':
      return 'Logro desbloqueado';
    case 'shop_freeze':
      return 'Protector de racha';
  }
}

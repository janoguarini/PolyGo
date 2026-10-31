import { TIERS } from './ranking';

/**
 * Catálogo de logros por familias con niveles (como Duolingo): cada familia mide una métrica y
 * sube de nivel al pasar cada umbral. Fuente única: la migración del catálogo se genera desde acá
 * (scripts/build-achievements-sql.ts) y un test compara la base con este archivo.
 *
 * Los ids de niveles ya existentes no cambian: los logros desbloqueados se conservan.
 */

export type AchievementCategory = 'learning' | 'vocabulary' | 'streak' | 'competitive';

export interface AchievementTier {
  id: string;
  threshold: number;
  description: string;
}

export interface AchievementFamilyDef {
  /** Métrica de achievement_metrics(); identifica a la familia. */
  metric: string;
  title: string;
  /** Nombre de ícono (lucide) que la app resuelve. */
  icon: string;
  category: AchievementCategory;
  /** Degradado del distintivo: [claro, oscuro]. */
  colors: readonly [string, string];
  tiers: readonly AchievementTier[];
}

const tiers = (
  prefix: string,
  thresholds: readonly number[],
  describe: (n: number) => string,
  ids: Record<number, string> = {},
): AchievementTier[] =>
  thresholds.map((n) => ({
    id: ids[n] ?? `${prefix}_${n}`,
    threshold: n,
    description: describe(n),
  }));

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const ACHIEVEMENT_FAMILIES: readonly AchievementFamilyDef[] = [
  {
    metric: 'best_streak_days',
    title: 'En llamas',
    icon: 'flame',
    category: 'streak',
    colors: ['#FB923C', '#C2410C'],
    tiers: tiers('streak', [3, 7, 14, 30, 60, 100, 180, 365], (n) => `Estudiá ${n} días seguidos.`),
  },
  {
    metric: 'goal_days',
    title: 'Objetivo cumplido',
    icon: 'target',
    category: 'streak',
    colors: ['#34D399', '#047857'],
    tiers: tiers(
      'goal',
      [1, 5, 15, 30, 60, 100, 200],
      (n) => `Cumplí tu objetivo diario ${n} ${plural(n, 'día', 'días')}.`,
    ),
  },
  {
    metric: 'lessons_completed',
    title: 'Erudito',
    icon: 'book-open',
    category: 'learning',
    colors: ['#60A5FA', '#1D4ED8'],
    tiers: tiers(
      'lessons',
      [1, 5, 15, 30, 60, 120],
      (n) => (n === 1 ? 'Completá tu primera lección.' : `Completá ${n} lecciones distintas.`),
      { 1: 'first_lesson' },
    ),
  },
  {
    metric: 'perfect_lessons',
    title: 'Perfeccionista',
    icon: 'crown',
    category: 'learning',
    colors: ['#F5C542', '#A16207'],
    tiers: tiers(
      'perfect',
      [1, 5, 15, 25, 50, 100],
      (n) =>
        n === 1
          ? 'Terminá una lección sin errores (lección dorada).'
          : `Terminá ${n} lecciones distintas sin errores.`,
      { 1: 'perfect_lesson', 25: 'golden_25' },
    ),
  },
  {
    metric: 'stars_earned',
    title: 'Coleccionista',
    icon: 'star',
    category: 'learning',
    colors: ['#FDE047', '#CA8A04'],
    tiers: tiers(
      'stars',
      [10, 30, 75, 120, 200, 300],
      (n) => `Juntá ${n} estrellas en el camino de lecciones.`,
    ),
  },
  {
    metric: 'fast_answers',
    title: 'Rayo',
    icon: 'zap',
    category: 'learning',
    colors: ['#A78BFA', '#6D28D9'],
    tiers: tiers(
      'fast',
      [10, 50, 150, 400, 1000],
      (n) => `Respondé bien ${n} veces en menos de 2 segundos.`,
    ),
  },
  {
    metric: 'words_seen',
    title: 'Explorador',
    icon: 'eye',
    category: 'vocabulary',
    colors: ['#22D3EE', '#0E7490'],
    tiers: tiers('words', [25, 50, 100, 200], (n) => `Estudiá ${n} palabras.`),
  },
  {
    metric: 'words_mastered',
    title: 'Memoria de elefante',
    icon: 'brain',
    category: 'vocabulary',
    colors: ['#F472B6', '#BE185D'],
    tiers: tiers(
      'mastered',
      [10, 25, 50, 100, 200],
      (n) => `Dominá ${n} palabras con repasos espaciados.`,
    ),
  },
  {
    metric: 'reviews_completed',
    title: 'Repasador',
    icon: 'repeat',
    category: 'vocabulary',
    colors: ['#2DD4BF', '#0F766E'],
    tiers: tiers('reviews', [1, 5, 15, 40, 100], (n) =>
      n === 1 ? 'Completá tu primer repaso.' : `Completá ${n} repasos.`,
    ),
  },
  {
    metric: 'games_played',
    title: 'Gladiador',
    icon: 'shield',
    category: 'competitive',
    colors: ['#94A3B8', '#475569'],
    tiers: tiers('games', [5, 25, 50, 100, 250, 500], (n) => `Jugá ${n} partidas ranked.`, {
      5: 'placement_done',
    }),
  },
  {
    metric: 'wins',
    title: 'Campeón',
    icon: 'trophy',
    category: 'competitive',
    colors: ['#FBBF24', '#B45309'],
    tiers: tiers(
      'wins',
      [1, 10, 25, 50, 100, 250],
      (n) => (n === 1 ? 'Ganá una partida ranked.' : `Ganá ${n} partidas ranked.`),
      { 1: 'first_win' },
    ),
  },
  {
    metric: 'best_win_streak',
    title: 'Imparable',
    icon: 'trending-up',
    category: 'competitive',
    colors: ['#F87171', '#B91C1C'],
    tiers: tiers('win_streak', [3, 5, 10, 15, 20], (n) => `Ganá ${n} partidas ranked seguidas.`),
  },
  {
    metric: 'peak_rating',
    title: 'Escalador',
    icon: 'gem',
    category: 'competitive',
    colors: ['#818CF8', '#4338CA'],
    // Un nivel por rango desde Plata: el umbral es el ELO mínimo del rango.
    tiers: TIERS.filter((t) => t.minRating > 0).map((t) => ({
      id: `peak_${t.id}`,
      threshold: t.minRating,
      description: `Llegá a ${t.name} (${t.minRating} de ELO).`,
    })),
  },
];

/** Título de un nivel tal como se guarda en la base (lo muestran los avisos de desbloqueo). */
export const tierTitle = (family: AchievementFamilyDef, level: number) =>
  `${family.title} · Nivel ${level}`;

/** Filas del catálogo en el orden de la base (la posición ordena familias y niveles). */
export function achievementRows() {
  let position = 0;
  return ACHIEVEMENT_FAMILIES.flatMap((family) =>
    family.tiers.map((tier, i) => ({
      id: tier.id,
      category: family.category,
      metric: family.metric,
      threshold: tier.threshold,
      title_es: tierTitle(family, i + 1),
      description_es: tier.description,
      icon: family.icon,
      position: ++position,
    })),
  );
}

export const familyByMetric = (metric: string) =>
  ACHIEVEMENT_FAMILIES.find((f) => f.metric === metric);

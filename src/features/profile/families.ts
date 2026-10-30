import {
  ACHIEVEMENT_FAMILIES,
  type AchievementFamilyDef,
  type AchievementTier,
} from '@shared/achievements';

import type { Achievement } from './api';

/** Estado de una familia de logros para un usuario: nivel actual y avance al siguiente. */
export interface FamilyProgress {
  family: AchievementFamilyDef;
  /** Niveles desbloqueados (0 = ninguno). */
  level: number;
  maxLevel: number;
  /** Último nivel alcanzado; null si todavía ninguno. */
  current: AchievementTier | null;
  /** Próximo nivel; null si ya está completa. */
  next: AchievementTier | null;
  /** Valor actual de la métrica, tope en el umbral del próximo nivel. */
  value: number;
  /** 0..1 desde el umbral del nivel actual hasta el del próximo (1 si está completa). */
  ratio: number;
  /** Fecha del último desbloqueo de la familia. */
  lastUnlockedAt: string | null;
}

const tierIndex = new Map(
  ACHIEVEMENT_FAMILIES.flatMap((family) => family.tiers.map((tier) => [tier.id, family] as const)),
);

export const familyOfAchievement = (id: string) => tierIndex.get(id) ?? null;

/** Agrupa los niveles (filas de get_my_achievements) en familias, en el orden del catálogo. */
export function familyProgress(achievements: readonly Achievement[]): FamilyProgress[] {
  const byId = new Map(achievements.map((a) => [a.id, a]));
  return ACHIEVEMENT_FAMILIES.flatMap((family) => {
    const rows = family.tiers.map((tier) => ({ tier, row: byId.get(tier.id) }));
    if (rows.every((r) => !r.row)) return [];
    const unlocked = rows.filter((r) => r.row?.unlockedAt);
    const level = unlocked.length;
    const next = rows.find((r) => !r.row?.unlockedAt) ?? null;
    const current = level > 0 ? unlocked[level - 1]!.tier : null;
    const from = current?.threshold ?? 0;
    const value = next ? (next.row?.progress ?? 0) : family.tiers.at(-1)!.threshold;
    const ratio = next
      ? Math.min(1, Math.max(0, (value - from) / Math.max(1, next.tier.threshold - from)))
      : 1;
    const lastUnlockedAt =
      unlocked
        .map((r) => r.row!.unlockedAt!)
        .sort()
        .at(-1) ?? null;
    return [
      {
        family,
        level,
        maxLevel: family.tiers.length,
        current,
        next: next?.tier ?? null,
        value,
        ratio,
        lastUnlockedAt,
      },
    ];
  });
}

/** Niveles por familia a partir de ids desbloqueados (perfil de otro jugador). */
export function familyLevels(unlockedIds: readonly string[]) {
  const ids = new Set(unlockedIds);
  return ACHIEVEMENT_FAMILIES.flatMap((family) => {
    const level = family.tiers.filter((t) => ids.has(t.id)).length;
    return level > 0
      ? [{ family, level, current: family.tiers[level - 1]!, maxLevel: family.tiers.length }]
      : [];
  });
}

/**
 * Familias para destacar en el perfil: primero las que subieron de nivel más recientemente,
 * después las más cerca del próximo nivel.
 */
export function featuredFamilies(families: readonly FamilyProgress[], count: number) {
  const started = families.filter((f) => f.level > 0);
  const pending = families.filter((f) => f.level === 0);
  return [
    ...started.sort((a, b) => (b.lastUnlockedAt ?? '').localeCompare(a.lastUnlockedAt ?? '')),
    ...pending.sort((a, b) => b.ratio - a.ratio),
  ].slice(0, count);
}

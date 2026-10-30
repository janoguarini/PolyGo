import {
  Award,
  BookOpen,
  Brain,
  Crown,
  Eye,
  Flame,
  Gem,
  Lock,
  Repeat,
  Shield,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';

import type { AchievementFamilyDef } from '@shared/achievements';

import { ProgressBar, Text, colors, radii, spacing } from '@/design-system';

import { familyOfAchievement, type FamilyProgress } from '../families';

/** Los íconos se guardan por nombre (shared/achievements.ts); uno desconocido cae en Award. */
const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  target: Target,
  'book-open': BookOpen,
  crown: Crown,
  star: Star,
  zap: Zap,
  eye: Eye,
  brain: Brain,
  repeat: Repeat,
  shield: Shield,
  trophy: Trophy,
  'trending-up': TrendingUp,
  gem: Gem,
};

const LOCKED = ['#3A3566', '#221E42'] as const;

/** Octógono regular en un viewBox de 100×100. */
const OCTAGON = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI / 8) * (2 * i + 1);
  return `${50 + 48 * Math.cos(a)},${50 + 48 * Math.sin(a)}`;
}).join(' ');
const INNER = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI / 8) * (2 * i + 1);
  return `${50 + 39 * Math.cos(a)},${50 + 39 * Math.sin(a)}`;
}).join(' ');

/**
 * Distintivo de una familia de logros: octógono con el degradado de la familia, su ícono y una
 * cinta con el nivel. Sin niveles se ve apagado con un candado.
 */
export function FamilyBadge({
  family,
  level,
  size = 64,
}: {
  family: Pick<AchievementFamilyDef, 'icon' | 'colors'>;
  level: number;
  size?: number;
}) {
  const id = useId().replace(/:/g, '');
  const locked = level === 0;
  const [light, dark] = locked ? LOCKED : family.colors;
  const Icon = locked ? Lock : (ICONS[family.icon] ?? Award);

  return (
    <View
      style={{ width: size, height: size + size * 0.12 }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={light} />
            <Stop offset="1" stopColor={dark} />
          </LinearGradient>
        </Defs>
        <Polygon points={OCTAGON} fill={`url(#b${id})`} />
        <Polygon
          points={INNER}
          fill="none"
          stroke={locked ? colors.borderStrong : 'rgba(255,255,255,0.35)'}
          strokeWidth={3}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center, { height: size }]}>
        <Icon
          color={locked ? colors.textSubtle : colors.textStrong}
          size={size * 0.42}
          strokeWidth={2.4}
        />
      </View>
      {locked ? null : (
        <View style={[styles.ribbon, { backgroundColor: dark, borderColor: light }]}>
          <Text
            variant="overline"
            color="textStrong"
            style={{ fontSize: Math.max(9, size * 0.15) }}
          >
            {`NIV ${level}`}
          </Text>
        </View>
      )}
    </View>
  );
}

/** Distintivo de un nivel recién desbloqueado (resultados de lección o partida). */
export function TierBadge({ id, size = 44 }: { id: string; size?: number }) {
  const family = familyOfAchievement(id);
  if (!family)
    return <FamilyBadge family={{ icon: 'award', colors: LOCKED }} level={1} size={size} />;
  const level = family.tiers.findIndex((t) => t.id === id) + 1;
  return <FamilyBadge family={family} level={level} size={size} />;
}

/** Fila de familia: distintivo, nivel y avance al próximo. Los competitivos dependen de Ranked. */
export function FamilyRow({
  progress,
  rankedAvailable,
}: {
  progress: FamilyProgress;
  rankedAvailable: boolean;
}) {
  const { family, level, maxLevel, next, value, ratio, current } = progress;
  const pendingRanked = family.category === 'competitive' && !rankedAvailable && level === 0;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${family.title}, nivel ${level} de ${maxLevel}. ${
        next ? `Próximo: ${next.description} Progreso ${value} de ${next.threshold}.` : 'Completo.'
      }`}
    >
      <FamilyBadge family={family} level={level} size={56} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong" color={level > 0 ? 'textStrong' : 'text'} style={styles.flex}>
            {family.title}
          </Text>
          <Text variant="caption">
            Nivel {level}/{maxLevel}
          </Text>
        </View>
        {next ? (
          <Text variant="caption">{next.description}</Text>
        ) : (
          <Text variant="caption" color="gold">
            ¡Completo! {current?.description}
          </Text>
        )}
        {pendingRanked ? (
          <Text variant="caption" color="textMuted">
            Disponible cuando abra Ranked
          </Text>
        ) : next ? (
          <View style={styles.progress}>
            <View style={styles.flex}>
              <ProgressBar
                value={ratio}
                colors={family.colors}
                accessibilityLabel={`Progreso de ${family.title}`}
              />
            </View>
            <Text variant="caption">
              {value}/{next.threshold}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  ribbon: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  body: { flex: 1, gap: spacing.xxs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxs },
});

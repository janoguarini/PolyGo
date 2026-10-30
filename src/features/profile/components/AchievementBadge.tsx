import {
  Award,
  BookOpen,
  Brain,
  CalendarCheck,
  Crown,
  Eye,
  Flame,
  Footprints,
  Gem,
  GraduationCap,
  Library,
  Lock,
  Medal,
  Orbit,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ProgressBar, Text, colors, spacing } from '@/design-system';

import type { Achievement } from '../api';
import { achievementRatio } from '../stats';

/** Los iconos se guardan por nombre en la base de datos; uno desconocido cae en Award. */
const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  sparkles: Sparkles,
  target: Target,
  eye: Eye,
  brain: Brain,
  library: Library,
  flame: Flame,
  'calendar-check': CalendarCheck,
  zap: Zap,
  shield: Shield,
  swords: Swords,
  trophy: Trophy,
  'trending-up': TrendingUp,
  gem: Gem,
  crown: Crown,
  star: Star,
  medal: Medal,
  orbit: Orbit,
};

export function AchievementIcon({
  icon,
  unlocked,
  size = 44,
}: {
  icon: string;
  unlocked: boolean;
  size?: number;
}) {
  const Icon = unlocked ? (ICONS[icon] ?? Award) : Lock;
  return (
    <View
      style={[
        styles.icon,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: unlocked ? colors.gold : colors.borderStrong,
          backgroundColor: unlocked ? `${colors.gold}22` : colors.surfaceRaised,
        },
      ]}
    >
      <Icon color={unlocked ? colors.gold : colors.textSubtle} size={size * 0.48} />
    </View>
  );
}

const dateFormat = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Fila de logro con progreso. Los competitivos explican que dependen de Ranked. */
export function AchievementRow({
  achievement,
  rankedAvailable,
}: {
  achievement: Achievement;
  rankedAvailable: boolean;
}) {
  const unlocked = Boolean(achievement.unlockedAt);
  const ratio = achievementRatio(achievement);
  const pendingRanked = !unlocked && achievement.category === 'competitive' && !rankedAvailable;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${achievement.title}. ${achievement.description} ${
        unlocked ? 'Desbloqueado.' : `Progreso ${achievement.progress} de ${achievement.threshold}.`
      }`}
    >
      <AchievementIcon icon={achievement.icon} unlocked={unlocked} />
      <View style={styles.body}>
        <Text variant="bodyStrong" color={unlocked ? 'textStrong' : 'text'}>
          {achievement.title}
        </Text>
        <Text variant="caption">{achievement.description}</Text>
        {unlocked ? (
          <Text variant="caption" color="gold">
            Desbloqueado el {dateFormat.format(new Date(achievement.unlockedAt!))}
          </Text>
        ) : pendingRanked ? (
          <Text variant="caption" color="textMuted">
            Disponible cuando abra Ranked
          </Text>
        ) : (
          <View style={styles.progress}>
            <ProgressBar value={ratio} accessibilityLabel={`Progreso de ${achievement.title}`} />
            <Text variant="caption">
              {achievement.progress}/{achievement.threshold}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  body: { flex: 1, gap: spacing.xxs },
  progress: { gap: spacing.xxs, marginTop: spacing.xxs },
});

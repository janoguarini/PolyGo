import { CheckCircle2, Info, MapPin } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import type { PlacementBank, PlacementResult } from '@shared/placement';

import {
  BrandCard,
  Button,
  Mascot,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { levelColor } from '@/features/profile/levelColor';
import { useStrings } from '@/i18n';

import { placementStrings } from '../strings';

export type SaveStatus = 'idle' | 'saving' | 'error' | 'unsupported';

/**
 * Resultado del test: el nivel estimado, qué significa, por qué, desde dónde empieza y los botones para
 * confirmar. Nada se guardó todavía: «Comenzar curso» guarda; si falla, el resultado sigue en pantalla
 * para reintentar.
 */
export function PlacementResultView({
  result,
  bank,
  status,
  onStart,
  onStartFromA1,
  onRetake,
}: {
  result: PlacementResult;
  bank: PlacementBank;
  status: SaveStatus;
  onStart: () => void;
  onStartFromA1: () => void;
  onRetake: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(placementStrings);
  const info = bank.levels.find((l) => l.level === result.level);
  const firstLevel = bank.levels[0]!.level;
  const saving = status === 'saving';
  const name = t.levelName(result.level);

  return (
    <View style={styles.wrapper}>
      <Animated.View entering={FadeInDown.duration(320)}>
        <BrandCard glow highlight contentStyle={styles.hero}>
          <View style={styles.mascot} pointerEvents="none">
            <Mascot pose="pointUp" height={110} />
          </View>
          <Text variant="overline" color="primarySoft">
            {t.resultOverline}
          </Text>
          <View
            accessible
            accessibilityRole="header"
            accessibilityLabel={t.levelA11y(result.level, name)}
          >
            <Text variant="heading" color="textStrong">
              {t.estimated}
            </Text>
            <Animated.View
              entering={FadeInUp.delay(150).duration(360)}
              style={[styles.levelBadge, { backgroundColor: levelColor(result.level) }]}
            >
              <Text style={styles.levelText} color="onPrimary">
                {result.level}
              </Text>
            </Animated.View>
            <Text variant="title" color="textStrong">
              {name}
            </Text>
          </View>
          <Text color="text">{t.levelMeaning(result.level)}</Text>
          <View style={styles.score}>
            <CheckCircle2 color={colors.success} size={16} />
            <Text variant="caption" color="text">
              {t.score(result.correct, result.answered)}
            </Text>
          </View>
        </BrandCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(300)} style={styles.card}>
        <Text color="text">{t.explain(result)}</Text>
        {info ? (
          <View style={styles.startPoint} accessible>
            <MapPin color={colors.primaryBright} size={20} />
            <View style={styles.flex}>
              <Text variant="overline">{t.startPoint}</Text>
              <Text variant="bodyStrong" color="textStrong">
                {t.startUnit(result.level, info.firstUnitTitle)}
              </Text>
            </View>
          </View>
        ) : null}
      </Animated.View>

      <View style={styles.disclaimer}>
        <Info color={colors.textMuted} size={16} />
        <Text variant="caption" style={styles.flex}>
          {t.disclaimer}
        </Text>
      </View>

      {status === 'error' || status === 'unsupported' ? (
        <View style={styles.error} accessibilityLiveRegion="polite">
          <Text color="danger">{status === 'error' ? t.saveError : t.saveUnsupported}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        {status !== 'unsupported' ? (
          <Button
            label={status === 'error' ? t.retry : saving ? t.saving : t.startCourse}
            size="lg"
            loading={saving}
            disabled={saving}
            onPress={onStart}
          />
        ) : null}
        {result.level !== firstLevel || status === 'unsupported' ? (
          <Button
            label={t.startFromA1}
            variant="secondary"
            disabled={saving}
            onPress={onStartFromA1}
          />
        ) : null}
        <Button label={t.retake} variant="ghost" disabled={saving} onPress={onRetake} />
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrapper: { gap: spacing.lg },
    flex: { flex: 1, gap: spacing.xxs },
    hero: { gap: spacing.sm, overflow: 'hidden' },
    mascot: { position: 'absolute', right: -spacing.sm, bottom: -spacing.md },
    levelBadge: {
      alignSelf: 'flex-start',
      minWidth: 96,
      alignItems: 'center',
      marginVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xs,
      borderRadius: radii.lg,
    },
    levelText: { fontSize: 44, lineHeight: 52, fontWeight: '900', letterSpacing: -1 },
    score: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    card: {
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    startPoint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surfaceRaised,
    },
    disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    error: {
      padding: spacing.md,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.dangerStrong,
      backgroundColor: 'rgba(239,68,68,0.08)',
    },
    actions: { gap: spacing.sm },
  }),
);

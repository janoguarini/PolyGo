import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Card, Text, colors, spacing, themedStyles } from '@/design-system';
import { useCountUp } from '@/features/learning/useCountUp';
import { useLocale, useStrings } from '@/i18n';
import { playSound } from '@/lib/sounds';

import { suppressXpAnnouncements } from './announce';
import { useXp, type XpState } from './api';
import { LevelBadge } from './LevelBadge';
import { XP_BAR_COLORS } from './LevelProgress';
import { xpStrings } from './strings';

/** Si el servidor tarda, se muestra lo que haya (nunca se queda «sumando» para siempre). */
const SETTLE_FALLBACK_MS = 6_000;
const FILL_MS = 1_300;

const ratioOf = (xp: XpState) => (xp.need > 0 ? Math.min(1, xp.into / xp.need) : 1);

/**
 * La experiencia que dio la sesión, en los resultados: «+20 XP» que sube contando y la barra del nivel
 * que se va llenando desde donde estaba. Si subís de nivel, la barra se completa, el nivel salta con
 * vibración y sonido, y se vuelve a llenar en el nivel nuevo.
 *
 * La XP la decide el servidor (sync_xp, después de guardar la sesión): mientras tanto se ve
 * «Sumando experiencia…» con la barra donde estaba. Mientras esta tarjeta está a la vista, el aviso
 * global de XP no se superpone (suppressXpAnnouncements).
 */
export function XpRewardCard({
  before,
  saved,
  compact = false,
}: {
  /** XP antes de la sesión (null: el servidor todavía no tiene XP; undefined: no se leyó). */
  before: XpState | null | undefined;
  /** La sesión ya se guardó (recién ahí el servidor acredita la XP). */
  saved: boolean;
  /** Versión baja (resultado de Ranked): una fila con la ganancia, la barra y el nivel. */
  compact?: boolean;
}) {
  const styles = useStyles();
  const t = useStrings(xpStrings);
  const nf = new Intl.NumberFormat(useLocale());
  const reduceMotion = useReducedMotion();
  const xp = useXp();
  const [after, setAfter] = useState<XpState | null>(null);
  // Nivel nuevo una vez que la barra lo alcanzó (con animación, a mitad de camino).
  const [reachedLevel, setReachedLevel] = useState<number | null>(null);
  const fill = useSharedValue(before ? ratioOf(before) : 0);

  useEffect(() => suppressXpAnnouncements(), []);

  // La respuesta nueva de sync_xp (llega después de guardar) es el «después»; se fija una vez.
  if (!after && saved && before && xp.data && xp.data !== before) setAfter(xp.data);
  // Si el servidor tarda, se muestra lo que haya.
  useEffect(() => {
    if (after || !saved || !before) return;
    const timer = setTimeout(() => setAfter(xp.data ?? before), SETTLE_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [after, saved, before, xp.data]);

  const up = Boolean(after && before && after.level > before.level);
  // Con «reducir movimiento» el nivel nuevo se ve enseguida; si no, cuando la barra lo alcanza.
  const levelUp = up ? (reduceMotion ? after!.level : reachedLevel) : null;
  const shownLevel = levelUp ?? before?.level ?? 1;

  useEffect(() => {
    if (!after || !before) return;
    const target = ratioOf(after);
    if (reduceMotion) {
      fill.value = target;
      return;
    }
    const ease = { duration: FILL_MS, easing: Easing.out(Easing.cubic) };
    if (!up) {
      fill.value = withDelay(350, withTiming(target, ease));
      return;
    }
    // Sube de nivel: completa la barra, salta el nivel y vuelve a llenarse en el nuevo.
    fill.value = withDelay(
      350,
      withSequence(
        withTiming(1, { duration: 750, easing: Easing.in(Easing.quad) }),
        withTiming(0, { duration: 0 }),
        withTiming(target, { duration: 900, easing: Easing.out(Easing.cubic) }),
      ),
    );
    const timer = setTimeout(() => {
      setReachedLevel(after.level);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound('streak3');
    }, 1_100);
    return () => clearTimeout(timer);
  }, [after, before, fill, reduceMotion, up]);

  const gained = after && before ? Math.max(0, after.total - before.total) : 0;
  const shownGain = useCountUp(gained, { enabled: Boolean(after), delay: 150, duration: 900 });
  const bar = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  if (!before) return null;
  const current = after ?? before;
  const maxed = current.need === 0;

  const badge = (size: number) => (
    <Animated.View
      key={shownLevel}
      entering={levelUp && !reduceMotion ? ZoomIn.springify().damping(8) : undefined}
    >
      <LevelBadge level={shownLevel} size={size} />
    </Animated.View>
  );
  const track = (
    <View style={[styles.track, compact && styles.trackCompact]}>
      <Animated.View style={[styles.fill, bar]}>
        <LinearGradient
          colors={XP_BAR_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
  const progress = maxed
    ? t.maxReached
    : `${nf.format(current.into)} / ${nf.format(current.need)} XP`;

  if (compact) {
    return (
      <Animated.View
        entering={reduceMotion ? undefined : FadeInUp.delay(200).duration(400)}
        accessible
        accessibilityLabel={after ? t.rewardA11y(gained, current.level) : t.rewardAdding}
      >
        <Card style={[styles.card, styles.cardCompact]}>
          {badge(40)}
          <View style={styles.flex}>
            <View style={styles.compactTop}>
              {after ? (
                <View style={[styles.gainRow, styles.gainRowCompact]}>
                  <Sparkles color={colors.gold} size={16} />
                  <Text style={styles.gainCompact}>+{nf.format(shownGain)} XP</Text>
                </View>
              ) : (
                <View style={[styles.gainRow, styles.gainRowCompact]}>
                  <ActivityIndicator color={colors.gold} size="small" />
                  <Text variant="caption" color="text">
                    {t.rewardAdding}
                  </Text>
                </View>
              )}
              <Text variant="caption" color={levelUp ? 'gold' : 'text'} style={styles.tabular}>
                {levelUp ? t.rewardLevelUp(levelUp) : t.level(shownLevel)}
              </Text>
            </View>
            {track}
            <Text variant="caption" style={styles.tabular}>
              {progress}
            </Text>
          </View>
        </Card>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInUp.delay(200).duration(400)}
      accessible
      accessibilityLabel={after ? t.rewardA11y(gained, current.level) : t.rewardAdding}
    >
      <Card style={styles.card}>
        <View style={styles.top}>
          <View style={styles.flex}>
            <Text variant="overline" color="gold">
              {t.rewardTitle}
            </Text>
            {after ? (
              <View style={styles.gainRow}>
                <Sparkles color={colors.gold} size={22} />
                <Text style={styles.gain}>+{nf.format(shownGain)} XP</Text>
              </View>
            ) : (
              <View style={styles.gainRow}>
                <ActivityIndicator color={colors.gold} size="small" />
                <Text variant="caption" color="text">
                  {t.rewardAdding}
                </Text>
              </View>
            )}
          </View>
          {badge(54)}
        </View>

        {track}
        <View style={styles.bottom}>
          <Text variant="caption" color="textStrong" style={styles.tabular}>
            {t.level(shownLevel)}
          </Text>
          <Text variant="caption" color="text" style={styles.tabular}>
            {progress}
          </Text>
        </View>

        {levelUp ? (
          <Animated.View
            entering={reduceMotion ? undefined : ZoomIn.springify().damping(9)}
            style={styles.levelUp}
          >
            <Text style={styles.levelUpText}>{t.rewardLevelUp(levelUp)}</Text>
          </Animated.View>
        ) : null}
      </Card>
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    card: { gap: spacing.sm, borderColor: colors.goldStrong },
    top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flex: { flex: 1, gap: spacing.xxs },
    gainRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minHeight: 40 },
    gain: {
      color: colors.gold,
      fontSize: 34,
      lineHeight: 40,
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
    },
    cardCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    compactTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    gainCompact: {
      color: colors.gold,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
    },
    trackCompact: { height: 8 },
    gainRowCompact: { minHeight: 26 },
    track: {
      height: 14,
      borderRadius: 999,
      backgroundColor: colors.inset,
      overflow: 'hidden',
    },
    fill: { height: '100%', borderRadius: 999, overflow: 'hidden' },
    bottom: { flexDirection: 'row', justifyContent: 'space-between' },
    tabular: { fontVariant: ['tabular-nums'] },
    levelUp: {
      alignSelf: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.gold,
    },
    levelUpText: { color: '#1A1033', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  }),
);

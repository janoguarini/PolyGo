import { ArrowDown, ArrowUp, Flame, Target } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  Text,
  colors,
  elevation,
  radii,
  spacing,
} from '@/design-system';
import { LessonPath } from '@/features/learning/components/LessonPath';
import { useCurriculum, useLearningSummary } from '@/features/learning/hooks';
import { useMyProfile } from '@/features/profile/hooks';

/** Fracción del alto visible donde queda la lección actual al centrarla. */
const FOCUS_RATIO = 0.4;

/**
 * Inicio: el camino de lecciones. Se abre centrado en la lección que toca y, si te alejás
 * scrolleando, aparece un botón para volver a ella.
 */
export default function HomeScreen() {
  const me = useMyProfile();
  const summary = useLearningSummary();
  const curriculum = useCurriculum();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { height } = useWindowDimensions();
  // Posición del nodo actual en el contenido y alto visible del scroll (medidos).
  const currentY = useRef<number | null>(null);
  const viewport = useRef(height * 0.7);
  // Hacia dónde quedó tu lección cuando no se ve; null si está en pantalla.
  const [away, setAway] = useState<'up' | 'down' | null>(null);

  const scrollToCurrent = (animated: boolean) => {
    if (currentY.current === null) return;
    const y = Math.max(0, currentY.current - viewport.current * FOCUS_RATIO);
    scrollRef.current?.scrollTo({ y, animated });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    viewport.current = layoutMeasurement.height;
    const y = currentY.current;
    const next =
      y === null
        ? null
        : y < contentOffset.y
          ? 'up'
          : y > contentOffset.y + layoutMeasurement.height
            ? 'down'
            : null;
    if (next !== away) setAway(next);
  };

  if (me.isPending || curriculum.isPending) return <LoadingState label="Cargando tu camino…" />;
  if (me.isError || !me.data) return <ErrorState onRetry={() => void me.refetch()} />;
  if (curriculum.isError || !curriculum.data) {
    return <ErrorState onRetry={() => void curriculum.refetch()} />;
  }

  const { profile } = me.data;
  const { units } = curriculum.data;
  const total = units.reduce((n, u) => n + u.lessons.length, 0);
  const completed = units.reduce((n, u) => n + u.completedCount, 0);
  const todayMinutes = Math.floor((summary.data?.today_seconds ?? 0) / 60);
  const goalMet = todayMinutes >= profile.daily_goal_minutes;
  const streak = summary.data?.streak_days ?? 0;

  const header = (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Text variant="overline" color="primarySoft">
            INGLÉS · A1
          </Text>
          <Text variant="heading">Tu camino</Text>
        </View>
        <View style={styles.chip} accessible accessibilityLabel={`Racha de ${streak} días`}>
          <Flame color={summary.data?.active_today ? colors.streak : colors.textSubtle} size={20} />
          <Text variant="bodyStrong" color={summary.data?.active_today ? 'streak' : 'textMuted'}>
            {streak}
          </Text>
        </View>
        <View
          style={styles.chip}
          accessible
          accessibilityLabel={`Objetivo diario: ${Math.min(todayMinutes, profile.daily_goal_minutes)} de ${profile.daily_goal_minutes} minutos`}
        >
          <Target color={goalMet ? colors.success : colors.info} size={20} />
          <Text variant="bodyStrong" color={goalMet ? 'success' : 'text'}>
            {Math.min(todayMinutes, profile.daily_goal_minutes)}/{profile.daily_goal_minutes}
          </Text>
        </View>
      </View>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <ProgressBar
            value={total ? completed / total : 0}
            accessibilityLabel={`Progreso del curso: ${completed} de ${total} lecciones`}
          />
        </View>
        <Text variant="caption">
          {completed}/{total} · {total ? Math.round((completed / total) * 100) : 0}%
        </Text>
      </View>
    </View>
  );

  return (
    <Screen
      header={header}
      scrollRef={scrollRef}
      onRefresh={() => {
        void summary.refetch();
        void curriculum.refetch();
      }}
      refreshing={curriculum.isRefetching}
      contentStyle={styles.content}
      onScroll={handleScroll}
      overlay={
        away ? (
          <Animated.View
            entering={FadeInDown.duration(180)}
            exiting={FadeOutDown.duration(140)}
            style={styles.fabWrap}
            pointerEvents="box-none"
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ir a mi lección actual"
              onPress={() => scrollToCurrent(true)}
              style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            >
              {away === 'up' ? (
                <ArrowUp color={colors.onPrimary} size={20} strokeWidth={3} />
              ) : (
                <ArrowDown color={colors.onPrimary} size={20} strokeWidth={3} />
              )}
              <Text variant="bodyStrong" color="onPrimary">
                Mi lección
              </Text>
            </Pressable>
          </Animated.View>
        ) : null
      }
    >
      {units.length === 0 ? (
        <EmptyState title="Todavía no hay unidades publicadas" />
      ) : (
        <LessonPath
          units={units}
          onCurrentLayout={(y) => {
            const first = currentY.current === null;
            currentY.current = y;
            // Al abrir salta directo; si cambió (terminaste una lección), se desliza hasta la nueva.
            scrollToCurrent(!first);
          }}
        />
      )}
      <Text variant="caption" align="center">
        El contenido sigue el nivel A1 del MCER como referencia; completarlo no equivale a una
        certificación oficial.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  content: { paddingBottom: spacing.huge },
  fabWrap: { position: 'absolute', bottom: spacing.lg, left: 0, right: 0, alignItems: 'center' },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryBright,
    ...elevation.glow,
  },
  fabPressed: { backgroundColor: colors.primaryPressed, transform: [{ scale: 0.97 }] },
});

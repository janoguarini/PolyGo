import { router } from 'expo-router';
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Flame,
  ListChecks,
  Snowflake,
  Target,
} from 'lucide-react-native';
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
import { daysLabel, streakAtRisk } from '@/features/learning/streak';
import { useDailyMissions } from '@/features/missions/api';
import { useTabPressScroll } from '@/lib/useTabPressScroll';
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
  const missions = useDailyMissions();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { height } = useWindowDimensions();
  // Posición del nodo actual en el contenido y alto visible del scroll (medidos).
  const currentY = useRef<number | null>(null);
  const viewport = useRef(height * 0.7);
  // Hacia dónde quedó tu lección cuando no se ve; null si está en pantalla.
  const [away, setAway] = useState<'up' | 'down' | null>(null);
  // Nivel elegido en el selector; null = el nivel con el que empezaste.
  const [chosenLevel, setChosenLevel] = useState<string | null>(null);

  const scrollToCurrent = (animated: boolean) => {
    if (currentY.current === null) return;
    const y = Math.max(0, currentY.current - viewport.current * FOCUS_RATIO);
    scrollRef.current?.scrollTo({ y, animated });
  };

  // Tocar la pestaña te devuelve a tu lección (el "inicio" del camino).
  useTabPressScroll(scrollRef, scrollToCurrent);

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
  const levels = [...new Set(curriculum.data.units.map((u) => u.level))];
  const level =
    chosenLevel ??
    (levels.includes(profile.start_level) ? profile.start_level : (levels[0] ?? 'A1'));
  const units = curriculum.data.units.filter((u) => u.level === level);
  const total = units.reduce((n, u) => n + u.lessons.length, 0);
  const completed = units.reduce((n, u) => n + u.completedCount, 0);
  const todayMinutes = Math.floor((summary.data?.today_seconds ?? 0) / 60);
  const goalMet = todayMinutes >= profile.daily_goal_minutes;
  const streak = summary.data?.streak_days ?? 0;
  const atRisk = summary.data ? streakAtRisk(summary.data) : false;
  const currentLesson = curriculum.data.currentByLevel[level] ?? null;
  const freezes = summary.data?.streak_freezes ?? 0;
  const missionList = missions.data?.missions ?? [];
  const missionsTotal = missionList.length || 3;
  const missionsDone = missionList.filter((m) => m.done).length;
  const claimable = Boolean(missions.data?.all_done && !missions.data.claimed);
  // Protectores que ya van a cubrir días que faltaste no te salvan si hoy tampoco estudiás.
  const pendingFreezes = summary.data?.freeze_pending ?? 0;
  const riskMessage =
    pendingFreezes > 0
      ? `Un protector cubre ${pendingFreezes === 1 ? 'el día que faltaste' : 'los días que faltaste'}. Hacé una lección hoy para seguir.`
      : freezes > 0
        ? 'Hacé una lección hoy. Si no, se usa un protector y la racha sigue.'
        : 'Hacé una lección hoy para no perderla.';

  const header = (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <View style={styles.levels} accessibilityRole="tablist">
            <Text variant="overline" color="primarySoft">
              INGLÉS
            </Text>
            {levels.map((l) => (
              <Pressable
                key={l}
                accessibilityRole="tab"
                accessibilityState={{ selected: l === level }}
                accessibilityLabel={`Nivel ${l}`}
                hitSlop={8}
                onPress={() => {
                  if (l === level) return;
                  // El camino nuevo vuelve a centrarse en su lección actual, sin animar.
                  currentY.current = null;
                  setAway(null);
                  setChosenLevel(l);
                }}
                style={[styles.level, l === level && styles.levelActive]}
              >
                <Text variant="overline" color={l === level ? 'onPrimary' : 'textMuted'}>
                  {l}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text variant="heading">Tu camino</Text>
        </View>
        <Pressable
          style={styles.chip}
          accessibilityRole="button"
          accessibilityLabel={`Misiones del día: ${missionsDone} de ${missionsTotal}`}
          onPress={() => router.push('/missions')}
        >
          <ListChecks
            color={missionsDone === missionsTotal ? colors.success : colors.info}
            size={20}
          />
          <Text variant="bodyStrong" color={missionsDone === missionsTotal ? 'success' : 'text'}>
            {missionsDone}/{missionsTotal}
          </Text>
        </Pressable>
        <View
          style={styles.chip}
          accessible
          accessibilityLabel={`Racha de ${streak} días${freezes ? `, ${freezes} ${freezes === 1 ? 'protector' : 'protectores'}` : ''}`}
        >
          <Flame color={summary.data?.active_today ? colors.streak : colors.textSubtle} size={20} />
          <Text variant="bodyStrong" color={summary.data?.active_today ? 'streak' : 'textMuted'}>
            {streak}
          </Text>
          {freezes ? (
            <View style={styles.freezeBadge}>
              <Snowflake color={colors.info} size={12} />
              <Text variant="caption" color="info">
                {freezes}
              </Text>
            </View>
          ) : null}
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
      {claimable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Completaste las misiones del día. Reclamá tu protector de racha."
          onPress={() => router.push('/missions')}
          style={({ pressed }) => [styles.banner, styles.claim, pressed && styles.riskPressed]}
        >
          <Snowflake color={colors.info} size={22} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="info">
              ¡Misiones completas!
            </Text>
            <Text variant="caption">Reclamá tu protector de racha.</Text>
          </View>
          <ChevronRight color={colors.info} size={20} />
        </Pressable>
      ) : null}
      {atRisk ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Tu racha de ${daysLabel(streak)} está en riesgo. Hacé una lección hoy para mantenerla.`}
          disabled={!currentLesson}
          onPress={() =>
            currentLesson &&
            router.push({ pathname: '/lesson/[id]', params: { id: currentLesson.id } })
          }
          style={({ pressed }) => [styles.banner, styles.risk, pressed && styles.riskPressed]}
        >
          <Flame color={colors.streak} size={22} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="streak">
              Tu racha de {daysLabel(streak)} está en riesgo
            </Text>
            <Text variant="caption">{riskMessage}</Text>
          </View>
          {currentLesson ? <ChevronRight color={colors.streak} size={20} /> : null}
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <Screen
      header={header}
      scrollRef={scrollRef}
      onRefresh={() => {
        void summary.refetch();
        void curriculum.refetch();
        void missions.refetch();
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
          key={level}
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
        El contenido sigue el nivel {level} del MCER como referencia; completarlo no equivale a una
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
  levels: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  level: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelActive: { backgroundColor: colors.primary, borderColor: colors.primaryBright },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    backgroundColor: colors.surfaceRaised,
  },
  risk: { borderColor: colors.streak },
  claim: { borderColor: colors.info },
  freezeBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 2 },
  riskPressed: { opacity: 0.85 },
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

import { router } from 'expo-router';
import { ArrowDown, ArrowUp, ChevronRight, Flame, Snowflake } from 'lucide-react-native';
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
import { daysLabel } from '@/features/learning/streak';
import { useDailyMissions } from '@/features/missions/api';
import { EnergyChip, EnergyPanel } from '@/features/plus/components/Energy';
import { useEnergy } from '@/features/plus/api';
import { PolysChip } from '@/features/polys/PolysChip';
import { useStreakRepair } from '@/features/polys/api';
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
  const streakRepair = useStreakRepair();
  const energy = useEnergy();
  const [energyOpen, setEnergyOpen] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { height } = useWindowDimensions();
  // Posición del nodo actual en el contenido y alto visible del scroll (medidos).
  const currentY = useRef<number | null>(null);
  const viewport = useRef(height * 0.7);
  // Hacia dónde quedó tu lección cuando no se ve; null si está en pantalla.
  const [away, setAway] = useState<'up' | 'down' | null>(null);
  // Lección con el recuadro abierto: se cierra al tocar cualquier otra parte o al scrollear.
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const closeLesson = () => setOpenLesson(null);

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
  // Sin selector de nivel: el camino es el primer nivel sin terminar desde el que empezaste.
  const allUnits = curriculum.data.units;
  const levels = [...new Set(allUnits.map((u) => u.level))];
  const reachable = levels.slice(Math.max(0, levels.indexOf(profile.start_level)));
  const level =
    reachable.find((l) =>
      allUnits.some((u) => u.level === l && u.completedCount < u.lessons.length),
    ) ??
    reachable[reachable.length - 1] ??
    'A1';
  const units = allUnits.filter((u) => u.level === level);
  const total = units.reduce((n, u) => n + u.lessons.length, 0);
  const completed = units.reduce((n, u) => n + u.completedCount, 0);
  const streak = summary.data?.streak_days ?? 0;
  const activeToday = Boolean(summary.data?.active_today);
  const freezes = summary.data?.streak_freezes ?? 0;
  const claimable = Boolean(missions.data?.all_done && !missions.data.claimed);
  const outOfEnergy = Boolean(energy.view && !energy.view.plus && energy.view.energy === 0);

  const header = (
    <View style={styles.header} onTouchStart={openLesson ? closeLesson : undefined}>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Text variant="overline" color="primarySoft">
            INGLÉS
          </Text>
          <Text variant="heading">Tu camino</Text>
        </View>
        <EnergyChip open={energyOpen} onPress={() => setEnergyOpen((o) => !o)} />
        <PolysChip />
        <View
          style={[styles.streak, activeToday && styles.streakActive]}
          accessible
          accessibilityLabel={`Racha de ${streak} días${activeToday ? '' : ', todavía no estudiaste hoy'}${freezes ? `, ${freezes} ${freezes === 1 ? 'protector' : 'protectores'}` : ''}`}
        >
          <Flame
            color={activeToday ? colors.streak : colors.textSubtle}
            fill={activeToday ? colors.streak : 'transparent'}
            size={22}
          />
          <Text
            variant="heading"
            color={activeToday ? 'streak' : 'textMuted'}
            style={styles.tabular}
          >
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
      {energyOpen || outOfEnergy ? <EnergyPanel compact={!energyOpen} /> : null}
      {streakRepair.data ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Perdiste tu racha de ${daysLabel(streakRepair.data.lost_streak)}. Recuperala en la tienda.`}
          onPress={() => router.push('/shop')}
          style={({ pressed }) => [styles.banner, styles.risk, pressed && styles.riskPressed]}
        >
          <Flame color={colors.streak} size={22} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="streak">
              Perdiste tu racha de {daysLabel(streakRepair.data.lost_streak)}
            </Text>
            <Text variant="caption">Todavía la podés recuperar con Polys.</Text>
          </View>
          <ChevronRight color={colors.streak} size={20} />
        </Pressable>
      ) : null}
      {claimable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Completaste las misiones del día. Abrí tu cofre de Polys."
          onPress={() => router.push('/missions')}
          style={({ pressed }) => [styles.banner, styles.claim, pressed && styles.riskPressed]}
        >
          <Snowflake color={colors.info} size={22} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="info">
              ¡Misiones completas!
            </Text>
            <Text variant="caption">Abrí tu cofre y ganá Polys.</Text>
          </View>
          <ChevronRight color={colors.info} size={20} />
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
      onScrollBeginDrag={openLesson ? closeLesson : undefined}
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
          selected={openLesson}
          onSelectedChange={setOpenLesson}
          onCurrentLayout={(y) => {
            const first = currentY.current === null;
            currentY.current = y;
            // Al abrir salta directo; si cambió (terminaste una lección), se desliza hasta la nueva.
            scrollToCurrent(!first);
          }}
        />
      )}
      <Text variant="caption" align="center">
        El contenido sigue el MCER como referencia; completarlo no equivale a una certificación
        oficial.
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
  // Racha: apagada mientras no estudiaste hoy, encendida en naranja cuando ya cumpliste.
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakActive: { backgroundColor: 'rgba(251,146,60,0.14)', borderColor: colors.streak },
  tabular: { fontVariant: ['tabular-nums'] },
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

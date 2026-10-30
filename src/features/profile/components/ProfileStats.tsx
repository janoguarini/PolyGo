import { ChartNoAxesColumn, ChevronDown, Check, Flame, Target, Zap } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Card, ErrorState, Text, colors, radii, spacing } from '@/design-system';
import type { PlayerRatingRow } from '@/lib/database.types';

import { useCompetitiveStats } from '../hooks';

const winRate = (wins: number, games: number) =>
  games > 0 ? `${Math.round((wins / games) * 100)}%` : '—';

/** Totales de la carrera competitiva: partidas, porcentaje de victorias y mejor racha. */
export function CareerStats({ rating }: { rating: PlayerRatingRow | null }) {
  const games = rating?.games_played ?? 0;
  const items = [
    { label: 'Partidas', value: String(games) },
    { label: 'Win rate', value: winRate(rating?.wins ?? 0, games) },
    { label: 'Racha máx.', value: String(rating?.best_win_streak ?? 0) },
  ];
  return (
    <Card style={styles.career}>
      {items.map((item, i) => (
        <View
          key={item.label}
          style={[styles.careerItem, i > 0 && styles.divider]}
          accessible
          accessibilityLabel={`${item.label}: ${item.value}`}
        >
          <Text variant="heading" color="textStrong">
            {item.value}
          </Text>
          <Text variant="caption">{item.label}</Text>
        </View>
      ))}
    </Card>
  );
}

const PERIODS: { label: string; days: number | null }[] = [
  { label: 'Últimos 7 días', days: 7 },
  { label: 'Últimos 30 días', days: 30 },
  { label: 'Desde siempre', days: null },
];

/** Encabezado + 4 estadísticas competitivas del período elegido. */
export function PeriodStats() {
  const [period, setPeriod] = useState(PERIODS[1]!);
  const [open, setOpen] = useState(false);
  const stats = useCompetitiveStats(period.days);
  const s = stats.data;

  const delta = s?.rating_delta ?? 0;
  const tiles: { label: string; value: string; icon: ReactNode; tint: string; color?: string }[] = [
    {
      label: 'Partidas',
      value: s ? String(s.games) : '–',
      icon: <Zap color={colors.gold} size={20} fill={colors.gold} />,
      tint: colors.gold,
    },
    {
      label: 'Victorias',
      value: s ? winRate(s.wins, s.games) : '–',
      icon: <Target color={colors.danger} size={20} />,
      tint: colors.danger,
    },
    {
      label: 'ELO',
      value: s ? `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${Math.abs(delta)}` : '–',
      icon: <ChartNoAxesColumn color={colors.infoAlt} size={20} strokeWidth={2.6} />,
      tint: colors.infoAlt,
      color: delta > 0 ? colors.success : delta < 0 ? colors.danger : undefined,
    },
    {
      label: 'Racha máx.',
      value: s ? String(s.best_win_streak) : '–',
      icon: <Flame color={colors.streak} size={20} fill={colors.streak} />,
      tint: colors.streak,
    },
  ];

  return (
    <View style={styles.gap}>
      <View style={styles.sectionRow}>
        <Text variant="heading">Estadísticas</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Período: ${period.label}. Cambiar`}
          onPress={() => setOpen(true)}
          style={styles.select}
        >
          <Text variant="caption" color="text">
            {period.label}
          </Text>
          <ChevronDown color={colors.textMuted} size={16} />
        </Pressable>
      </View>
      {stats.isError ? (
        <ErrorState
          message="No pudimos cargar tus estadísticas."
          onRetry={() => void stats.refetch()}
        />
      ) : (
        <View style={styles.tiles}>
          {tiles.map((t) => (
            <View
              key={t.label}
              style={styles.tile}
              accessible
              accessibilityLabel={`${t.label}: ${t.value}`}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${t.tint}26` }]}>{t.icon}</View>
              <Text
                variant="heading"
                color="textStrong"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={t.color ? { color: t.color } : undefined}
              >
                {t.value}
              </Text>
              <Text variant="caption" numberOfLines={1}>
                {t.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={styles.backdrop}
          accessibilityLabel="Cerrar"
          onPress={() => setOpen(false)}
        >
          <Card style={styles.menu}>
            <Text variant="overline">PERÍODO</Text>
            {PERIODS.map((p) => {
              const selected = p.label === period.label;
              return (
                <Pressable
                  key={p.label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setPeriod(p);
                    setOpen(false);
                  }}
                  style={styles.option}
                >
                  <Text
                    variant="bodyStrong"
                    color={selected ? 'primarySoft' : 'text'}
                    style={styles.flex}
                  >
                    {p.label}
                  </Text>
                  {selected ? <Check color={colors.primarySoft} size={18} /> : null}
                </Pressable>
              );
            })}
          </Card>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  career: { flexDirection: 'row', paddingVertical: spacing.md, paddingHorizontal: 0 },
  careerItem: { flex: 1, alignItems: 'center', gap: spacing.xxs },
  divider: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.borderStrong },
  gap: { gap: spacing.md },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    minHeight: 32,
  },
  tiles: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  menu: { gap: spacing.xs },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  flex: { flex: 1 },
});

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  ErrorState,
  LoadingState,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';

import { AdminError, PRESETS, useAdminPrefs, type Json } from './api';
import { deltaPct, fmtInt, num } from './format';

/** Tarjeta de indicador: valor, comparación con el período anterior y «Sin datos» con motivo. */
export function Kpi({
  label,
  value,
  previous,
  format = fmtInt,
  invert = false,
  unavailable,
  hint,
}: {
  label: string;
  value: unknown;
  previous?: unknown;
  format?: (v: unknown) => string;
  invert?: boolean;
  unavailable?: string;
  hint?: string;
}) {
  const styles = useStyles();
  const noData = unavailable !== undefined || value === null || value === undefined;
  const d = previous === undefined || noData ? null : deltaPct(value, previous);
  const good = d === null ? null : invert ? d < 0 : d > 0;
  return (
    <View
      style={styles.kpi}
      accessible
      accessibilityLabel={`${label}: ${noData ? 'sin datos' : format(value)}`}
    >
      <Text variant="overline" numberOfLines={2} style={styles.kpiLabel}>
        {label.toUpperCase()}
      </Text>
      {noData ? (
        <Text variant="bodyStrong" color="textSubtle">
          Sin datos
        </Text>
      ) : (
        <Text variant="stat" numberOfLines={1} adjustsFontSizeToFit>
          {format(value)}
        </Text>
      )}
      {d !== null ? (
        <Text variant="caption" color={d === 0 ? 'textMuted' : good ? 'success' : 'danger'}>
          {d > 0 ? '▲' : d < 0 ? '▼' : '■'} {Math.abs(d).toLocaleString('es-AR')} % vs{' '}
          {format(previous)}
        </Text>
      ) : previous !== undefined && !noData ? (
        <Text variant="caption">anterior: {format(previous)}</Text>
      ) : null}
      {hint ? <Text variant="caption">{hint}</Text> : null}
    </View>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <View style={layout.grid}>{children}</View>;
}

export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Card style={layout.section}>
      <Text variant="heading">{title}</Text>
      {hint ? <Text variant="caption">{hint}</Text> : null}
      <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>{children}</View>
    </Card>
  );
}

export function Overline({ children }: { children: string }) {
  return (
    <Text variant="overline" style={{ marginTop: spacing.md }}>
      {children.toUpperCase()}
    </Text>
  );
}

/** Barras horizontales con el valor escrito (distribuciones). */
export function BarList({
  items,
  format = fmtInt,
  max: maxItems = 10,
  empty = 'Sin datos.',
}: {
  items: { key: string; label: string; value: number }[];
  format?: (v: unknown) => string;
  max?: number;
  empty?: string;
}) {
  const styles = useStyles();
  if (!items.length) return <Text variant="caption">{empty}</Text>;
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const shown = sorted.slice(0, maxItems);
  const rest = sorted.slice(maxItems);
  if (rest.length)
    shown.push({
      key: '__o',
      label: `Otros (${rest.length})`,
      value: rest.reduce((a, b) => a + b.value, 0),
    });
  const top = Math.max(1, ...shown.map((i) => i.value));
  return (
    <View style={{ gap: spacing.sm }}>
      {shown.map((i) => (
        <View key={i.key} style={styles.barRow}>
          <Text variant="caption" numberOfLines={1} style={styles.barLabel}>
            {i.label}
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${(i.value / top) * 100}%` }]} />
          </View>
          <Text variant="caption" color="text" style={styles.barValue}>
            {format(i.value)}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Barras verticales de una serie (días, horas). Mantener presionada una barra muestra su valor. */
export function Columns({
  data,
  height = 120,
  format = fmtInt,
}: {
  data: { label: string; value: number }[];
  height?: number;
  format?: (v: unknown) => string;
}) {
  const styles = useStyles();
  if (!data.length) return <Text variant="caption">Sin datos.</Text>;
  const top = Math.max(0, ...data.map((d) => d.value));
  const total = data.reduce((a, b) => a + b.value, 0);
  const first = data[0];
  const last = data[data.length - 1];
  return (
    <View>
      <View style={[styles.cols, { height }]}>
        {data.map((d, i) => (
          <View
            key={`${d.label}-${i}`}
            style={styles.colSlot}
            accessible
            accessibilityLabel={`${d.label}: ${format(d.value)}`}
          >
            <View
              style={[
                styles.col,
                { height: top > 0 ? Math.max(d.value > 0 ? 3 : 0, (d.value / top) * height) : 0 },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.colAxis}>
        <Text variant="caption">{first?.label}</Text>
        <Text variant="caption">
          máx. {format(top)} · total {format(total)}
        </Text>
        <Text variant="caption">{last?.label}</Text>
      </View>
    </View>
  );
}

/** Lista de filas clave → valor (tablas chicas). */
export function Rows({
  rows,
  empty = 'Sin datos.',
}: {
  rows: { key: string; label: ReactNode; value: ReactNode; sub?: string; onPress?: () => void }[];
  empty?: string;
}) {
  const styles = useStyles();
  if (!rows.length) return <Text variant="caption">{empty}</Text>;
  return (
    <View>
      {rows.map((r, i) => {
        const body = (
          <View style={[styles.row, i > 0 && styles.rowBorder]}>
            <View style={{ flex: 1, minWidth: 0 }}>
              {typeof r.label === 'string' ? (
                <Text variant="bodyStrong" numberOfLines={1}>
                  {r.label}
                </Text>
              ) : (
                r.label
              )}
              {r.sub ? (
                <Text variant="caption" numberOfLines={2}>
                  {r.sub}
                </Text>
              ) : null}
            </View>
            {typeof r.value === 'string' ? (
              <Text variant="bodyStrong" style={{ fontVariant: ['tabular-nums'] }}>
                {r.value}
              </Text>
            ) : (
              r.value
            )}
          </View>
        );
        return r.onPress ? (
          <Pressable
            key={r.key}
            accessibilityRole="button"
            onPress={r.onPress}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            {body}
          </Pressable>
        ) : (
          <View key={r.key}>{body}</View>
        );
      })}
    </View>
  );
}

/** Lo que falta medir (los textos vienen de la base). */
export function Unavailable({ items }: { items: Record<string, string> | null | undefined }) {
  const entries = Object.entries(items ?? {});
  if (!entries.length) return null;
  return (
    <Section title="Sin datos todavía" hint="Métricas sin una fuente confiable hoy.">
      {entries.map(([k, v]) => (
        <Text key={k} variant="caption">
          • {v}
        </Text>
      ))}
    </Section>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const styles = useStyles();
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.id)}
            style={[styles.chip, on && styles.chipOn]}
          >
            <Text variant="caption" color={on ? 'onPrimary' : 'text'}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Período y Free/Plus: los mismos para todos los módulos del panel. */
export function PeriodBar() {
  const { preset, setPreset, plan, setPlan } = useAdminPrefs();
  return (
    <View style={{ gap: spacing.sm }}>
      <Chips options={PRESETS} value={preset} onChange={setPreset} />
      <Chips
        options={[
          { id: '', label: 'Free y Plus' },
          { id: 'free', label: 'Sólo Free' },
          { id: 'plus', label: 'Sólo Plus' },
        ]}
        value={plan}
        onChange={setPlan}
      />
      <Text variant="caption">Sin cuentas internas · hora de Buenos Aires</Text>
    </View>
  );
}

/** Carga / error / datos de una RPC del panel. */
export function AdminAsync({
  query,
  children,
}: {
  query: { data: Json; error: unknown; isPending: boolean; refetch: () => unknown };
  children: (data: Json) => ReactNode;
}) {
  if (query.isPending) return <LoadingState />;
  if (query.error) {
    const denied = query.error instanceof AdminError && query.error.denied;
    return denied ? (
      <Text variant="body" color="danger">
        La base negó el acceso. Cierra sesión y vuelve a entrar.
      </Text>
    ) : (
      <ErrorState onRetry={() => void query.refetch()} />
    );
  }
  return <>{children(query.data)}</>;
}

export const pctOf = (a: unknown, b: unknown) => {
  const x = num(a);
  const y = num(b);
  return x !== null && y ? Math.round((x / y) * 1000) / 10 : null;
};

const layout = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  section: { gap: spacing.xs },
});

const useStyles = themedStyles(() =>
  StyleSheet.create({
    kpi: {
      flexGrow: 1,
      flexBasis: '45%',
      minWidth: 140,
      padding: spacing.md,
      gap: 2,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    kpiLabel: { color: colors.textMuted },
    barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    barLabel: { width: 96 },
    barTrack: {
      flex: 1,
      height: 10,
      borderRadius: 4,
      backgroundColor: colors.surfaceRaised,
      overflow: 'hidden',
    },
    barFill: { height: '100%', borderRadius: 4, backgroundColor: colors.primaryBright },
    barValue: { minWidth: 48, textAlign: 'right', fontVariant: ['tabular-nums'] },
    cols: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
    colSlot: { flex: 1, justifyContent: 'flex-end', height: '100%' },
    col: { backgroundColor: colors.primaryBright, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
    colAxis: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surface,
    },
    chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  }),
);

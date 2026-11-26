import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/design-system';

/** Anillo de progreso (0–100) con contenido centrado. Lo usan el Coach y el repaso inteligente. */
export function ProgressRing(props: {
  percent: number;
  size: number;
  stroke: number;
  color?: string;
  track?: string;
  accessibilityLabel?: string;
  children?: ReactNode;
}) {
  const { size, stroke } = props;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, props.percent));
  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible={Boolean(props.accessibilityLabel)}
      accessibilityLabel={props.accessibilityLabel}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={props.track ?? 'rgba(255,255,255,0.14)'}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={props.color ?? colors.gold}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${(c * p) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {props.children}
      </View>
    </View>
  );
}

/**
 * Anillo dividido en tramos de colores proporcionales (p. ej. dominadas / para repasar / te cuestan).
 * Los tramos en cero no se dibujan; con más de uno queda una pequeña separación entre ellos.
 */
export function SegmentRing(props: {
  segments: { value: number; color: string }[];
  size: number;
  stroke: number;
  track?: string;
  accessibilityLabel?: string;
  children?: ReactNode;
}) {
  const { size, stroke } = props;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = props.segments.reduce((n, s) => n + Math.max(0, s.value), 0);
  const visible = props.segments.filter((s) => s.value > 0);
  const gap = visible.length > 1 ? stroke * 0.9 : 0;
  let start = 0;
  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible={Boolean(props.accessibilityLabel)}
      accessibilityLabel={props.accessibilityLabel}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={props.track ?? 'rgba(255,255,255,0.14)'}
          strokeWidth={stroke}
          fill="none"
        />
        {total > 0
          ? visible.map((s, i) => {
              const len = (c * s.value) / total;
              const arc = Math.max(0.01, len - gap);
              const angle = -90 + (start / c) * 360;
              start += len;
              return (
                <Circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                  fill="none"
                  strokeDasharray={`${arc} ${c}`}
                  transform={`rotate(${angle} ${size / 2} ${size / 2})`}
                />
              );
            })
          : null}
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {props.children}
      </View>
    </View>
  );
}

/** Colores de los grupos de palabras (iguales en toda la app). */
export const WORD_GROUP_COLORS = {
  mastered: '#22C55E',
  due: '#FB923C',
  struggling: '#FB7185',
} as const;

const styles = StyleSheet.create({
  center: { position: 'absolute', alignItems: 'center' },
});

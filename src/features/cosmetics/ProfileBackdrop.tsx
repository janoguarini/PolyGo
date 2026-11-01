import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { colors, radii, spacing } from '@/design-system';

import { backgroundStyle, type BackgroundStyle } from './visuals';

// Posiciones fijas (en %) para que el dibujo no cambie entre renders.
const STARS = [
  [6, 18, 1.4],
  [14, 72, 1],
  [22, 40, 1.8],
  [31, 88, 1.1],
  [38, 12, 1],
  [47, 58, 1.5],
  [55, 26, 1],
  [63, 80, 1.7],
  [71, 46, 1.1],
  [79, 14, 1.6],
  [86, 66, 1],
  [93, 34, 1.3],
  [97, 90, 1],
] as const;

/**
 * Fondo del perfil que el jugador tiene puesto. Sin fondo devuelve el contenido tal cual, para que
 * el perfil se vea igual que siempre.
 */
export function ProfileBackdrop({
  backgroundId,
  children,
  style,
}: {
  backgroundId: string | null | undefined;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = backgroundStyle(backgroundId);
  if (!bg) return <View style={style}>{children}</View>;
  return (
    <LinearGradient
      colors={bg.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      <BackdropPattern bg={bg} />
      {children}
    </LinearGradient>
  );
}

export function BackdropPattern({ bg }: { bg: BackgroundStyle }) {
  const accent = bg.accent ?? '#FFFFFF';
  if (!bg.pattern) return null;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      {bg.pattern === 'stars'
        ? STARS.map(([x, y, r], i) => (
            <Circle key={i} cx={`${x}%`} cy={`${y}%`} r={r} fill={accent} opacity={0.75} />
          ))
        : null}
      {bg.pattern === 'sparkles'
        ? STARS.filter((_, i) => i % 2 === 0).map(([x, y, r], i) => (
            <Circle key={i} cx={`${x}%`} cy={`${y}%`} r={r * 1.6} fill={accent} opacity={0.35} />
          ))
        : null}
      {bg.pattern === 'grid'
        ? [20, 40, 60, 80].flatMap((p) => [
            <Line
              key={`h${p}`}
              x1="0"
              x2="100%"
              y1={`${p}%`}
              y2={`${p}%`}
              stroke={accent}
              strokeOpacity={0.14}
              strokeWidth={1}
            />,
            <Line
              key={`v${p}`}
              y1="0"
              y2="100%"
              x1={`${p}%`}
              x2={`${p}%`}
              stroke={accent}
              strokeOpacity={0.14}
              strokeWidth={1}
            />,
          ])
        : null}
      {bg.pattern === 'waves'
        ? [0, 1, 2].map((i) => (
            <Path
              key={i}
              d={`M0 ${70 + i * 18} C 80 ${50 + i * 18}, 160 ${95 + i * 18}, 260 ${68 + i * 18} S 420 ${60 + i * 18}, 520 ${80 + i * 18}`}
              stroke={accent}
              strokeOpacity={0.12 + i * 0.04}
              strokeWidth={2}
              fill="none"
            />
          ))
        : null}
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});

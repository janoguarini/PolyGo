import { useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { Text, colors, spacing } from '@/design-system';

import {
  areaPath,
  chartGeometry,
  formatDelta,
  linePath,
  nearestIndex,
  type RatingPoint,
} from '../stats';

const HEIGHT = 160;
const AXIS_WIDTH = 40;
const PADDING = { top: 12, bottom: 12, left: 8, right: 12 };

const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' });

/**
 * Evolución del ELO: una sola serie (sin leyenda; el título la nombra), línea de 2 px con lavado
 * de área al 10 %, punto final con anillo del color de superficie y líneas guía recesivas.
 * Tocar o arrastrar inspecciona cada partida.
 */
export function RatingChart({ series }: { series: readonly RatingPoint[] }) {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const plotWidth = Math.max(width - AXIS_WIDTH, 0);
  const geo = chartGeometry(series, plotWidth, HEIGHT, PADDING);
  const last = series.length - 1;
  const active = selected ?? last;
  const point = series[active]!;
  const first = series[0]!;
  const total = series[last]!.rating - first.rating;
  const games = series.filter((p) => p.reason === 'battle').length;

  const inspect = (e: GestureResponderEvent) =>
    setSelected(nearestIndex(geo.points, e.nativeEvent.locationX));

  const yFor = (value: number) =>
    PADDING.top +
    (1 - (value - geo.min) / (geo.max - geo.min)) * (HEIGHT - PADDING.top - PADDING.bottom);

  return (
    <View style={styles.wrapper}>
      <View style={styles.readout} accessibilityLiveRegion="polite">
        <Text variant="stat">{point.rating}</Text>
        <Text variant="caption">
          {active === 0 && point.reason === 'initial'
            ? `Inicio · ${dateFormat.format(new Date(point.at))}`
            : `${formatDelta(point.delta)} · ${dateFormat.format(new Date(point.at))}`}
        </Text>
      </View>

      <View
        style={styles.chart}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Evolución del ELO en ${games} partidas: de ${first.rating} a ${series[last]!.rating}, ${formatDelta(total)}.`}
      >
        {width > 0 ? (
          <>
            <View
              style={{ width: plotWidth, height: HEIGHT }}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={inspect}
              onResponderMove={inspect}
              onResponderRelease={() => setSelected(null)}
              onResponderTerminate={() => setSelected(null)}
            >
              <Svg width={plotWidth} height={HEIGHT}>
                {geo.ticks.map((t) => (
                  <Line
                    key={t}
                    x1={0}
                    x2={plotWidth}
                    y1={yFor(t)}
                    y2={yFor(t)}
                    stroke={colors.border}
                    strokeWidth={1}
                  />
                ))}
                <Path
                  d={areaPath(geo.points, HEIGHT - PADDING.bottom)}
                  fill={colors.primaryBright}
                  fillOpacity={0.1}
                />
                <Path
                  d={linePath(geo.points)}
                  stroke={colors.primaryBright}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />
                {selected !== null ? (
                  <Line
                    x1={geo.points[active]!.x}
                    x2={geo.points[active]!.x}
                    y1={PADDING.top}
                    y2={HEIGHT - PADDING.bottom}
                    stroke={colors.textSubtle}
                    strokeWidth={1}
                  />
                ) : null}
                <Circle
                  cx={geo.points[active]!.x}
                  cy={geo.points[active]!.y}
                  r={5}
                  fill={colors.primaryBright}
                  stroke={colors.surface}
                  strokeWidth={2}
                />
              </Svg>
            </View>
            <View style={styles.axis} pointerEvents="none">
              {geo.ticks.map((t) => (
                <Text key={t} variant="caption" style={[styles.tick, { top: yFor(t) - 9 }]}>
                  {t}
                </Text>
              ))}
            </View>
          </>
        ) : null}
      </View>
      <Text variant="caption">
        {games} {games === 1 ? 'partida' : 'partidas'} · {formatDelta(total)} en total · tocá el
        gráfico para ver cada una
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  readout: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  chart: { flexDirection: 'row', height: HEIGHT },
  axis: { width: AXIS_WIDTH, height: HEIGHT },
  tick: { position: 'absolute', right: 0, textAlign: 'right' },
});

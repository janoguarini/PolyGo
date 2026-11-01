import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/design-system';

const PIECES = 36;
const PALETTE = [
  colors.primaryBright,
  colors.gold,
  colors.info,
  colors.success,
  '#F472B6',
  '#C4B5FD',
];

/** Pseudoaleatorio fijo por índice: la lluvia es variada pero el render es puro. */
function rand(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Lluvia de confeti que cae una vez sobre toda la pantalla. No intercepta toques. */
export function Confetti() {
  const reduceMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  if (reduceMotion) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PIECES }, (_, i) => (
        <Piece key={i} index={i} width={width} height={height} />
      ))}
    </View>
  );
}

function Piece({ index, width, height }: { index: number; width: number; height: number }) {
  const t = useSharedValue(0);
  const x = rand(index, 1) * width;
  const drift = (rand(index, 2) - 0.5) * 120;
  const spin = (rand(index, 3) > 0.5 ? 1 : -1) * (360 + rand(index, 4) * 540);
  const w = 6 + rand(index, 5) * 6;
  const h = w * (rand(index, 6) > 0.5 ? 1.8 : 1);
  const delay = rand(index, 7) * 900;
  const duration = 2200 + rand(index, 8) * 1600;
  const color = PALETTE[index % PALETTE.length];

  useEffect(() => {
    t.value = withDelay(delay, withTiming(1, { duration, easing: Easing.in(Easing.quad) }));
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => ({
    opacity: t.value === 0 ? 0 : 1 - Math.max(0, t.value - 0.85) / 0.15,
    transform: [
      { translateY: -40 + t.value * (height + 80) },
      { translateX: drift * t.value },
      { rotate: `${spin * t.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { left: x, width: w, height: h, backgroundColor: color, borderRadius: w / 4 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0 },
});

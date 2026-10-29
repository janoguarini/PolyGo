import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, durations, gradients, radii } from '../tokens';

export interface ProgressBarProps {
  /** 0..1 */
  value: number;
  height?: number;
  colors?: readonly [string, string, ...string[]];
  accessibilityLabel?: string;
}

export function ProgressBar({
  value,
  height = 8,
  colors: fill = gradients.primary,
  accessibilityLabel,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: durations.slow });
  }, [clamped, progress]);

  const animated = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2 }]}
    >
      <Animated.View style={[styles.fill, animated]}>
        <LinearGradient
          colors={fill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.surfaceHighlight, overflow: 'hidden', width: '100%' },
  fill: { height: '100%', borderRadius: radii.pill, overflow: 'hidden' },
});

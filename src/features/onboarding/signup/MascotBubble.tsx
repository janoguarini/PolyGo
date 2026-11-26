import { StyleSheet, View } from 'react-native';
import Animated, { FadeInLeft, ZoomIn } from 'react-native-reanimated';

import {
  Mascot,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
  type MascotPose,
} from '@/design-system';

/** El zorro hace la pregunta del paso en un globito: menos texto suelto, más personaje. */
export function MascotBubble({
  pose,
  title,
  hint,
}: {
  pose: MascotPose;
  title: string;
  hint?: string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <Animated.View entering={ZoomIn.springify().damping(12)}>
        <Mascot pose={pose} height={104} />
      </Animated.View>
      <Animated.View entering={FadeInLeft.delay(120).springify().damping(14)} style={styles.bubble}>
        <View style={styles.tail} />
        <Text variant="heading" color="textStrong" accessibilityRole="header">
          {title}
        </Text>
        {hint ? (
          <Text variant="caption" color="textMuted">
            {hint}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
    bubble: {
      flex: 1,
      gap: spacing.xxs,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: 1.5,
      borderColor: colors.brandBorder,
      backgroundColor: colors.surfaceRaised,
    },
    tail: {
      position: 'absolute',
      left: -8,
      top: '50%',
      marginTop: -7,
      width: 14,
      height: 14,
      transform: [{ rotate: '45deg' }],
      borderLeftWidth: 1.5,
      borderBottomWidth: 1.5,
      borderColor: colors.brandBorder,
      backgroundColor: colors.surfaceRaised,
    },
  }),
);

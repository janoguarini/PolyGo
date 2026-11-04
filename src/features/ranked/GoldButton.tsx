import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text, palette, radii, spacing } from '@/design-system';

/** El botón principal de Ranked: dorado, grande y con brillo, para que "jugar" sea lo obvio. */
export function GoldButton({
  label,
  onPress,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={() => {
        if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => [styles.glow, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={['#FFE89A', palette.gold400, palette.gold500]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fill}
      >
        {/* Reflejo superior. */}
        <View style={styles.shine} pointerEvents="none" />
        <Play color={palette.ink900} fill={palette.ink900} size={24} />
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glow: {
    borderRadius: radii.pill,
    shadowColor: palette.gold400,
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  fill: {
    minHeight: 64,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 2,
    borderColor: '#FFF1B8',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: spacing.xl,
    right: spacing.xl,
    height: 22,
    borderBottomLeftRadius: radii.pill,
    borderBottomRightRadius: radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  label: {
    color: palette.ink900,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.3,
  },
});

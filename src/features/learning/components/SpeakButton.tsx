import { Volume2 } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { MIN_TOUCH, colors, radii } from '@/design-system';

import { speakEnglish } from '../speech';

export function SpeakButton({ text, size = 'md' }: { text: string; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 88 : MIN_TOUCH;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Escuchar pronunciación (voz sintetizada)`}
      onPress={() => speakEnglish(text)}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        { width: dimension, height: dimension, borderRadius: size === 'lg' ? radii.xl : radii.md },
        pressed && styles.pressed,
      ]}
    >
      <Volume2 color={colors.info} size={size === 'lg' ? 40 : 22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
});

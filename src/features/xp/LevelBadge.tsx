import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Text, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { xpStrings } from './strings';

/**
 * Distintivo del nivel global: número sobre un rombo dorado con borde violeta (se lee como "nivel de
 * cuenta", distinto del emblema de rango competitivo). Tamaño en puntos.
 */
export function LevelBadge({ level, size = 44 }: { level: number; size?: number }) {
  const styles = useStyles();
  const t = useStrings(xpStrings);
  // El rombo rotado ocupa la diagonal: se dibuja más chico para que entre en `size`.
  const diamond = Math.round(size * 0.74);
  const digits = String(level).length;
  const fontSize = Math.round(size * (digits >= 3 ? 0.3 : 0.38));
  return (
    <View
      style={[styles.wrap, { width: size, height: size }]}
      accessible
      accessibilityLabel={t.level(level)}
    >
      <View
        style={[
          styles.glow,
          { width: diamond, height: diamond, borderRadius: Math.round(size * 0.14) },
        ]}
      >
        <LinearGradient
          colors={['#FDE68A', '#F59E0B', '#B45309']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.diamond, { borderRadius: Math.round(size * 0.14) }]}
        />
      </View>
      <Text
        style={[styles.number, { fontSize, lineHeight: Math.round(fontSize * 1.15) }]}
        accessible={false}
        numberOfLines={1}
      >
        {level}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrap: { alignItems: 'center', justifyContent: 'center' },
    glow: {
      position: 'absolute',
      transform: [{ rotate: '45deg' }],
      borderWidth: 2,
      borderColor: '#C4B5FD',
      overflow: 'hidden',
      shadowColor: '#F59E0B',
      shadowOpacity: 0.7,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
    },
    diamond: { flex: 1 },
    // Siempre sobre dorado, en ambos temas: marrón casi negro (contraste > 7:1 con #F59E0B).
    number: {
      color: '#2A0E02',
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
    },
  }),
);

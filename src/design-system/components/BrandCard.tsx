import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { themedStyles } from '../theme';
import { colors, elevation, gradients, radii, spacing } from '../tokens';

/**
 * Tarjeta de marca: degradé violeta, borde fino iluminado y, si es lo importante de la pantalla,
 * brillo (`glow`). Es la base visual del perfil, las recompensas y las invitaciones. Con `onPress`
 * se vuelve un botón accesible.
 */
export function BrandCard({
  children,
  glow,
  highlight,
  onPress,
  accessibilityLabel,
  style,
  contentStyle,
}: {
  children: ReactNode;
  /** Brillo violeta alrededor (usar en uno o dos elementos por pantalla). */
  glow?: boolean;
  /** Borde más intenso (elemento activo, recompensa disponible). */
  highlight?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  const body = (
    <LinearGradient
      colors={gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, highlight && styles.highlight, contentStyle]}
    >
      {children}
    </LinearGradient>
  );
  const wrap = [styles.shell, glow && styles.glow, style];
  if (!onPress) return <View style={wrap}>{body}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [...wrap, pressed && styles.pressed]}
    >
      {body}
    </Pressable>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    // La sombra va en el contenedor: el degradé recorta con sus bordes redondeados.
    shell: { borderRadius: radii.xl, backgroundColor: colors.brandSolid },
    glow: { ...elevation.glow },
    card: {
      borderRadius: radii.xl,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.brandBorder,
      overflow: 'hidden',
    },
    highlight: { borderWidth: 1.5, borderColor: colors.primaryBright },
    pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  }),
);

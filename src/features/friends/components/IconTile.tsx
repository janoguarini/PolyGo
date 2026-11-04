import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radii } from '@/design-system';

/** Cuadrado redondeado y translúcido con un ícono al centro (tarjetas de Amigos). */
export function IconTile({ children, size = 48 }: { children: ReactNode; size?: number }) {
  return (
    <View style={[styles.tile, { width: size, height: size }]} accessible={false}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: 'rgba(167, 139, 250, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.22)',
  },
});

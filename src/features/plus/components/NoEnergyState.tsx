import { router } from 'expo-router';
import { Dumbbell, Swords, Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ENERGY, formatEnergyWait, type EnergyView } from '@shared/energy';

import { Button, Screen, Text, colors, spacing } from '@/design-system';

import { EnergyPanel } from './Energy';

/**
 * En lugar del reproductor cuando no queda energía. No es un muro: propone lo que sigue siendo
 * gratis (repaso, ranked) y deja Plus como una opción más, sin insistir.
 */
export function NoEnergyState({ view }: { view: EnergyView }) {
  const wait = view.msToNext === null ? null : formatEnergyWait(view.msToNext);
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <Zap color={colors.textSubtle} size={52} />
        <Text variant="title" align="center" accessibilityRole="header">
          Te quedaste sin energía
        </Text>
        <Text color="textMuted" align="center">
          {wait
            ? `Recuperás 1 en ${wait} y vas a poder seguir con esta lección.`
            : 'Ya se está recargando.'}{' '}
          Mientras tanto, el repaso y ranked son gratis y no usan energía.
        </Text>
      </View>
      <EnergyPanel compact />
      <View style={styles.actions}>
        <Button
          label="Repasar gratis"
          size="lg"
          icon={<Dumbbell color={colors.onPrimary} size={18} />}
          onPress={() => router.dismissTo('/practice')}
        />
        <Button
          label="Jugar ranked"
          variant="secondary"
          icon={<Swords color={colors.text} size={18} />}
          onPress={() => router.dismissTo('/ranked')}
        />
        <Button label="Volver al camino" variant="ghost" onPress={() => router.back()} />
      </View>
      <Text variant="caption" align="center">
        Completar una lección usa {ENERGY.lessonCost} de energía; equivocarte no gasta más.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xxl },
  actions: { gap: spacing.sm },
});

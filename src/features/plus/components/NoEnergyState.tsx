import { router } from 'expo-router';
import { Dumbbell, Swords, Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ENERGY, type EnergyView } from '@shared/energy';

import { Button, Screen, Text, colors, spacing, useTheme } from '@/design-system';
import { useStrings } from '@/i18n';

import { energyStrings, energyWait } from '../strings';
import { EnergyPanel } from './Energy';

/**
 * En lugar del reproductor cuando no queda energía. No es un muro: propone lo que sigue siendo
 * gratis (repaso, ranked) y deja Plus como una opción más, sin insistir.
 */
export function NoEnergyState({ view }: { view: EnergyView }) {
  useTheme();
  const t = useStrings(energyStrings);
  const wait = view.msToNext === null ? null : energyWait(view.msToNext);
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <Zap color={colors.textSubtle} size={52} />
        <Text variant="title" align="center" accessibilityRole="header">
          {t.outTitle}
        </Text>
        <Text color="textMuted" align="center">
          {wait ? t.outWait(wait) : t.outRecharging} {t.outMeanwhile}
        </Text>
      </View>
      <EnergyPanel compact />
      <View style={styles.actions}>
        <Button
          label={t.reviewFree}
          size="lg"
          icon={<Dumbbell color={colors.onPrimary} size={18} />}
          onPress={() => router.dismissTo('/practice')}
        />
        <Button
          label={t.playRanked}
          variant="secondary"
          icon={<Swords color={colors.text} size={18} />}
          onPress={() => router.dismissTo('/ranked')}
        />
        <Button label={t.backToPath} variant="ghost" onPress={() => router.back()} />
      </View>
      <Text variant="caption" align="center">
        {t.outFooter(ENERGY.lessonCost)}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xxl },
  actions: { gap: spacing.sm },
});

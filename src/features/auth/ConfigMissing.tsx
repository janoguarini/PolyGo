import { Settings } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, Screen, Text, colors, spacing, useTheme } from '@/design-system';
import { useStrings } from '@/i18n';

import { authStrings } from './strings';

/** Se muestra si faltan variables de entorno: nunca se finge un backend que no existe. */
export function ConfigMissing({ missing }: { missing: string[] }) {
  useTheme();
  const t = useStrings(authStrings).configMissing;
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Settings color={colors.primaryBright} size={40} />
        <Text variant="title" align="center">
          {t.title}
        </Text>
        <Text color="textMuted" align="center">
          {t.message}
        </Text>
      </View>
      <Card>
        <Text variant="overline">{t.missingVariables}</Text>
        {missing.map((name) => (
          <Text key={name} variant="bodyStrong" color="danger" style={styles.mono}>
            {name}
          </Text>
        ))}
      </Card>
      <Card>
        <Text variant="bodyStrong">{t.howToFix}</Text>
        <Text color="textMuted">{t.step1}</Text>
        <Text color="textMuted">{t.step2}</Text>
        <Text color="textMuted">{t.step3}</Text>
        <Text color="textMuted">{t.step4}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  mono: { fontFamily: 'monospace' },
});

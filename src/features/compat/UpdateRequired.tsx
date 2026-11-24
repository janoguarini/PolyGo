import * as Linking from 'expo-linking';
import { Download } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Screen, Text, colors, spacing, useTheme } from '@/design-system';
import { useInterfaceLanguage, useStrings } from '@/i18n';

import type { ClientCompatibility } from './status';
import { compatStrings } from './strings';

/** Aviso de actualización obligatoria (versión o nivel curricular por debajo del mínimo del servidor). */
export function UpdateRequired({
  compat,
  onRetry,
}: {
  compat: ClientCompatibility;
  onRetry: () => void;
}) {
  useTheme();
  const t = useStrings(compatStrings);
  // El mensaje del servidor (app_client_status) está escrito en español: en inglés va el propio.
  const message = useInterfaceLanguage() === 'es' ? compat.message : t.defaultMessage;
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Download color={colors.primaryBright} size={40} />
        <Text variant="title" align="center">
          {t.title}
        </Text>
        <Text color="textMuted" align="center">
          {message}
        </Text>
      </View>
      <Card>
        <Text variant="overline">{t.yourVersion}</Text>
        <Text variant="bodyStrong">{compat.installedVersion ?? t.unknownVersion}</Text>
        {compat.minVersion ? (
          <>
            <Text variant="overline">{t.minVersion}</Text>
            <Text variant="bodyStrong">{compat.minVersion}</Text>
          </>
        ) : null}
      </Card>
      {compat.updateUrl ? (
        <Button label={t.goToStore} onPress={() => void Linking.openURL(compat.updateUrl!)} />
      ) : null}
      <Button label={t.retry} variant="ghost" onPress={onRetry} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
});

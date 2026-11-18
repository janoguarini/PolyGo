import * as Linking from 'expo-linking';
import { Download } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Screen, Text, colors, spacing, useTheme } from '@/design-system';

import type { ClientCompatibility } from './status';

/** Aviso de actualización obligatoria (versión o nivel curricular por debajo del mínimo del servidor). */
export function UpdateRequired({
  compat,
  onRetry,
}: {
  compat: ClientCompatibility;
  onRetry: () => void;
}) {
  useTheme();
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Download color={colors.primaryBright} size={40} />
        <Text variant="title" align="center">
          Actualizá PolyGo
        </Text>
        <Text color="textMuted" align="center">
          {compat.message}
        </Text>
      </View>
      <Card>
        <Text variant="overline">TU VERSIÓN</Text>
        <Text variant="bodyStrong">{compat.installedVersion ?? 'desconocida'}</Text>
        {compat.minVersion ? (
          <>
            <Text variant="overline">VERSIÓN MÍNIMA</Text>
            <Text variant="bodyStrong">{compat.minVersion}</Text>
          </>
        ) : null}
      </Card>
      {compat.updateUrl ? (
        <Button label="Ir a la tienda" onPress={() => void Linking.openURL(compat.updateUrl!)} />
      ) : null}
      <Button label="Ya actualicé, reintentar" variant="ghost" onPress={onRetry} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
});

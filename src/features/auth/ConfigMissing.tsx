import { Settings } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, Screen, Text, colors, spacing } from '@/design-system';

/** Se muestra si faltan variables de entorno: nunca se finge un backend que no existe. */
export function ConfigMissing({ missing }: { missing: string[] }) {
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Settings color={colors.primaryBright} size={40} />
        <Text variant="title" align="center">
          Falta configurar el backend
        </Text>
        <Text color="textMuted" align="center">
          Polygo necesita un proyecto de Supabase para registrar usuarios y guardar el progreso.
        </Text>
      </View>
      <Card>
        <Text variant="overline">VARIABLES FALTANTES O INVÁLIDAS</Text>
        {missing.map((name) => (
          <Text key={name} variant="bodyStrong" color="danger" style={styles.mono}>
            {name}
          </Text>
        ))}
      </Card>
      <Card>
        <Text variant="bodyStrong">Cómo resolverlo</Text>
        <Text color="textMuted">1. Copiá .env.example a .env en la raíz del proyecto.</Text>
        <Text color="textMuted">2. Completá la URL y la anon key de tu proyecto Supabase.</Text>
        <Text color="textMuted">3. Aplicá las migraciones de supabase/migrations.</Text>
        <Text color="textMuted">4. Reiniciá con: npx expo start --clear</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  mono: { fontFamily: 'monospace' },
});

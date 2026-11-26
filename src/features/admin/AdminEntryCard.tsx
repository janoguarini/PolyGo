import { router, type Href } from 'expo-router';
import { ChevronRight, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, Text, colors, spacing, useTheme } from '@/design-system';

import { useIsSuperadminAccount } from './api';

/**
 * Botón «Panel de administración» del perfil. Sólo se dibuja en la cuenta de janitogap (comparando
 * el UID de la sesión): es una decisión visual, el acceso a los datos lo valida la base con MFA.
 */
export function AdminEntryCard() {
  useTheme();
  const visible = useIsSuperadminAccount();
  if (!visible) return null;
  return (
    <Card onPress={() => router.push('/admin' as Href)} accessibilityLabel="Panel de administración">
      <View style={styles.row}>
        <ShieldCheck color={colors.primaryBright} size={24} />
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">Panel de administración</Text>
          <Text variant="caption">Usuarios, aprendizaje, Ranked, retención, negocio y salud</Text>
        </View>
        <ChevronRight color={colors.textMuted} size={20} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});

import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { LogOut, Pencil } from 'lucide-react-native';
import { Platform, StyleSheet, Switch, View } from 'react-native';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  SelectCard,
  Text,
  colors,
  spacing,
} from '@/design-system';
import { signOut } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { BlockedUsersSection } from '@/features/blocks/BlockedUsersSection';
import { useSetSoundEffects, useSoundEffectsPref } from '@/features/preferences/soundEffects';
import { useMyProfile, useUpdateSettings } from '@/features/profile/hooks';
import { ReminderSettings } from '@/features/reminders/ReminderSettings';
import type { ProfileVisibility } from '@/lib/database.types';
import { env } from '@/lib/env';
import { toUserMessage } from '@/lib/errors';

const VISIBILITY: {
  id: ProfileVisibility;
  title: string;
  description: string;
}[] = [
  { id: 'public', title: 'Público', description: 'Cualquier jugador ve tu perfil y estadísticas.' },
  { id: 'friends', title: 'Sólo amigos', description: 'Se aplicará cuando existan los amigos.' },
  {
    id: 'private',
    title: 'Privado',
    description: 'Los demás sólo ven tu nombre, avatar y rango; no tus estadísticas ni logros.',
  },
];

/** Ajustes: recordatorio, sonido, privacidad, usuarios bloqueados y cuenta. */
export default function SettingsScreen() {
  const { data, isPending, isError, refetch } = useMyProfile();
  const updateSettings = useUpdateSettings();
  const logout = useMutation({ mutationFn: signOut });
  const soundPref = useSoundEffectsPref();
  const setSound = useSetSoundEffects();

  if (isPending) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const { settings, profile } = data;

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Ajustes" onBack={() => router.back()} />

      {/* Los recordatorios son notificaciones del teléfono: no existen en la web. */}
      {Platform.OS === 'web' ? null : (
        <>
          <Text variant="overline">RECORDATORIO</Text>
          <ReminderSettings />
        </>
      )}

      <Text variant="overline" style={styles.section}>
        SONIDO
      </Text>
      <Card style={styles.switchRow}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Efectos de sonido</Text>
          <Text variant="caption">
            Sonidos de acierto, error y fin de lección o partida. La pronunciación siempre suena.
          </Text>
        </View>
        <Switch
          accessibilityLabel="Efectos de sonido"
          value={soundPref.data ?? true}
          disabled={soundPref.data === undefined || setSound.isPending}
          onValueChange={(enabled) => setSound.mutate(enabled)}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </Card>

      <Text variant="overline" style={styles.section}>
        PRIVACIDAD
      </Text>
      {VISIBILITY.map((option) => (
        <SelectCard
          key={option.id}
          title={option.title}
          description={option.description}
          selected={settings?.profile_visibility === option.id}
          disabled={updateSettings.isPending}
          onPress={() => updateSettings.mutate({ profile_visibility: option.id })}
        />
      ))}
      <Card style={styles.switchRow}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Mostrar mi país</Text>
          <Text variant="caption">
            {profile.region
              ? 'La bandera aparece en tu perfil público.'
              : 'Elegí tu país en Editar perfil.'}
          </Text>
        </View>
        <Switch
          accessibilityLabel="Mostrar mi país en el perfil público"
          value={settings?.show_region ?? false}
          disabled={updateSettings.isPending || !profile.region}
          onValueChange={(show) => updateSettings.mutate({ show_region: show })}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </Card>
      {updateSettings.isError ? (
        <FormMessage tone="error" message={toUserMessage(updateSettings.error)} />
      ) : null}

      <Text variant="overline" style={styles.section}>
        USUARIOS BLOQUEADOS
      </Text>
      <BlockedUsersSection />

      <Text variant="overline" style={styles.section}>
        CUENTA
      </Text>
      <Button
        label="Editar perfil"
        variant="secondary"
        icon={<Pencil color={colors.text} size={16} />}
        onPress={() => router.push('/edit-profile')}
      />
      {logout.isError ? <FormMessage tone="error" message={toUserMessage(logout.error)} /> : null}
      <Button
        label="Cerrar sesión"
        variant="danger"
        loading={logout.isPending}
        icon={<LogOut color={colors.danger} size={18} />}
        onPress={() => logout.mutate()}
      />
      <Button
        label="Eliminar cuenta"
        variant="ghost"
        accessibilityHint="Abre la pantalla para borrar tu cuenta y tus datos"
        onPress={() => router.push('/delete-account')}
      />
      {env?.privacyPolicyUrl ? (
        <Button
          label="Política de privacidad"
          variant="ghost"
          accessibilityHint="Abre la política de privacidad en el navegador"
          onPress={() => void Linking.openURL(env!.privacyPolicyUrl!)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
});

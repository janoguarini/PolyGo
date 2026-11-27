import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { GraduationCap, LogOut, Pencil } from 'lucide-react-native';
import { useState } from 'react';
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
  useTheme,
  useThemePreference,
  type ThemePreference,
} from '@/design-system';
import { AdsDebugPanel, AdsPrivacyOptionsButton } from '@/features/ads/AdsSettings';
import { signOut } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { BlockedUsersSection } from '@/features/blocks/BlockedUsersSection';
import { useChangeInterfaceLanguage } from '@/features/courses/hooks';
import { useEnablePush, usePushPermission } from '@/features/friends/components/PushPromptCard';
import { useReplayTour } from '@/features/onboarding/tour';
import { useSetSoundEffects, useSoundEffectsPref } from '@/features/preferences/soundEffects';
import { useMyProfile, useUpdateSettings } from '@/features/profile/hooks';
import { ReminderSettings } from '@/features/reminders/ReminderSettings';
import {
  INTERFACE_LANGUAGE_LABELS,
  INTERFACE_LANGUAGES,
  useInterfaceLanguage,
  useStrings,
} from '@/i18n';
import { settingsStrings } from '@/i18n/screens/settings';
import type { ProfileVisibility } from '@/lib/database.types';
import { analyticsAvailable, analyticsEnabled, setAnalyticsEnabled } from '@/lib/analytics';
import { setMetaEnabled } from '@/lib/metaEvents';
import { env } from '@/lib/env';
import { toUserMessage } from '@/lib/errors';

const VISIBILITY: readonly ProfileVisibility[] = ['public', 'friends', 'private'];

const APPEARANCE: readonly ThemePreference[] = ['dark', 'light', 'system'];

/** Cuentas que ven «Rehacer el tutorial» (para revisar cómo quedó). */
const TUTORIAL_TESTERS = ['janitogap'];

/** Ajustes: recordatorio, apariencia, sonido, privacidad, usuarios bloqueados y cuenta. */
export default function SettingsScreen() {
  useTheme();
  const t = useStrings(settingsStrings);
  const { data, isPending, isError, refetch } = useMyProfile();
  const updateSettings = useUpdateSettings();
  const logout = useMutation({ mutationFn: signOut });
  const soundPref = useSoundEffectsPref();
  const setSound = useSetSoundEffects();
  // Analítica (PostHog): el interruptor sólo aparece en builds que la tienen.
  const [usageData, setUsageData] = useState(analyticsEnabled);
  const replayTour = useReplayTour(data?.profile.id);
  const theme = useThemePreference();
  const interfaceLanguage = useInterfaceLanguage();
  const changeLanguage = useChangeInterfaceLanguage();

  if (isPending) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const { settings, profile } = data;

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title={t.title} onBack={() => router.back()} />

      {/* Los recordatorios son notificaciones del teléfono: no existen en la web. */}
      {Platform.OS === 'web' ? null : (
        <>
          <Text variant="overline">{t.reminder}</Text>
          <ReminderSettings />
        </>
      )}

      <Text variant="overline" style={styles.section}>
        {t.appearance}
      </Text>
      {APPEARANCE.map((id) => (
        <SelectCard
          key={id}
          title={t.themes[id].title}
          description={t.themes[id].description}
          selected={theme.preference === id}
          onPress={() => theme.setPreference(id)}
        />
      ))}

      <Text variant="overline" style={styles.section}>
        {t.interfaceLanguage}
      </Text>
      <Text variant="caption">{t.interfaceLanguageHint}</Text>
      {INTERFACE_LANGUAGES.map((id) => (
        <SelectCard
          key={id}
          title={INTERFACE_LANGUAGE_LABELS[id]}
          selected={interfaceLanguage === id}
          onPress={() => changeLanguage.mutate(id)}
        />
      ))}

      <Text variant="overline" style={styles.section}>
        {t.sound}
      </Text>
      <Card style={styles.switchRow}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">{t.soundEffects}</Text>
          <Text variant="caption">{t.soundEffectsHint}</Text>
        </View>
        <Switch
          accessibilityLabel={t.soundEffects}
          value={soundPref.data ?? true}
          disabled={soundPref.data === undefined || setSound.isPending}
          onValueChange={(enabled) => setSound.mutate(enabled)}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </Card>

      <Text variant="overline" style={styles.section}>
        {t.privacy}
      </Text>
      {analyticsAvailable() ? (
        <Card style={styles.switchRow}>
          <View style={styles.flex}>
            <Text variant="bodyStrong">{t.usageData}</Text>
            <Text variant="caption">{t.usageDataHint}</Text>
          </View>
          <Switch
            accessibilityLabel={t.usageData}
            value={usageData}
            onValueChange={(enabled) => {
              setAnalyticsEnabled(enabled);
              setMetaEnabled(enabled);
              setUsageData(enabled);
            }}
            trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
            thumbColor={colors.textStrong}
          />
        </Card>
      ) : null}
      {VISIBILITY.map((id) => (
        <SelectCard
          key={id}
          title={t.visibility[id].title}
          description={t.visibility[id].description}
          selected={settings?.profile_visibility === id}
          disabled={updateSettings.isPending}
          onPress={() => updateSettings.mutate({ profile_visibility: id })}
        />
      ))}
      <Card style={styles.switchRow}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">{t.showCountry}</Text>
          <Text variant="caption">{profile.region ? t.showCountryOn : t.showCountryNone}</Text>
        </View>
        <Switch
          accessibilityLabel={t.showCountryA11y}
          value={settings?.show_region ?? false}
          disabled={updateSettings.isPending || !profile.region}
          onValueChange={(show) => updateSettings.mutate({ show_region: show })}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </Card>
      <Card style={styles.switchRow}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">{t.showOnline}</Text>
          <Text variant="caption">{t.showOnlineHint}</Text>
        </View>
        <Switch
          accessibilityLabel={t.showOnlineA11y}
          value={settings?.show_online ?? true}
          disabled={updateSettings.isPending}
          onValueChange={(show) => updateSettings.mutate({ show_online: show })}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </Card>
      <ChallengePushSetting
        enabled={settings?.notify_challenges ?? true}
        disabled={updateSettings.isPending}
        onChange={(on) => updateSettings.mutate({ notify_challenges: on })}
      />
      {updateSettings.isError ? (
        <FormMessage tone="error" message={toUserMessage(updateSettings.error)} />
      ) : null}
      <AdsPrivacyOptionsButton />
      <AdsDebugPanel />

      <Text variant="overline" style={styles.section}>
        {t.blocked}
      </Text>
      <BlockedUsersSection />

      <Text variant="overline" style={styles.section}>
        {t.account}
      </Text>
      <Button
        label={t.editProfile}
        variant="secondary"
        icon={<Pencil color={colors.text} size={16} />}
        onPress={() => router.push('/edit-profile')}
      />
      {profile.username && TUTORIAL_TESTERS.includes(profile.username) ? (
        <Button
          label={t.replayTutorial}
          variant="secondary"
          icon={<GraduationCap color={colors.text} size={16} />}
          onPress={() => {
            replayTour();
            router.navigate('/');
          }}
        />
      ) : null}
      {logout.isError ? <FormMessage tone="error" message={toUserMessage(logout.error)} /> : null}
      <Button
        label={t.signOut}
        variant="danger"
        loading={logout.isPending}
        icon={<LogOut color={colors.danger} size={18} />}
        onPress={() => logout.mutate()}
      />
      <Button
        label={t.deleteAccount}
        variant="ghost"
        accessibilityHint={t.deleteAccountHint}
        onPress={() => router.push('/delete-account')}
      />
      {env?.privacyPolicyUrl ? (
        <Button
          label={t.privacyPolicy}
          variant="ghost"
          accessibilityHint={t.privacyPolicyHint}
          onPress={() => void Linking.openURL(env!.privacyPolicyUrl!)}
        />
      ) : null}
      {env?.termsUrl ? (
        <Button
          label={t.terms}
          variant="ghost"
          accessibilityHint={t.termsHint}
          onPress={() => void Linking.openURL(env!.termsUrl!)}
        />
      ) : null}
      {env?.supportUrl ? (
        <Button
          label={t.support}
          variant="ghost"
          accessibilityHint={t.supportHint}
          onPress={() => void Linking.openURL(env!.supportUrl!)}
        />
      ) : null}
    </Screen>
  );
}

/** Avisos de desafíos: la preferencia vive en la cuenta; el permiso, en el teléfono. */
function ChallengePushSetting({
  enabled,
  disabled,
  onChange,
}: {
  enabled: boolean;
  disabled: boolean;
  onChange: (on: boolean) => void;
}) {
  useTheme();
  const t = useStrings(settingsStrings);
  const permission = usePushPermission();
  const enable = useEnablePush();
  const phone = permission.data;
  return (
    <Card style={styles.switchRow}>
      <View style={styles.flex}>
        <Text variant="bodyStrong">{t.challengePush}</Text>
        <Text variant="caption">
          {phone === 'blocked'
            ? t.pushBlocked
            : phone === 'unsupported'
              ? t.pushUnsupported
              : t.pushOn}
        </Text>
        {phone === 'blocked' && enabled ? (
          <Button
            label={t.openPhoneSettings}
            variant="ghost"
            onPress={() => void Linking.openSettings()}
          />
        ) : null}
      </View>
      <Switch
        accessibilityLabel={t.challengePushA11y}
        value={enabled}
        disabled={disabled || enable.isPending}
        onValueChange={(on) => {
          onChange(on);
          if (on && phone === 'undetermined') enable.mutate();
        }}
        trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
        thumbColor={colors.textStrong}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
});

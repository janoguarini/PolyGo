import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AVATARS, DAILY_GOALS } from '@shared/profile';

import {
  Avatar,
  Button,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  SelectCard,
  Text,
  TextField,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useMyProfile, useUpdateProfile } from '@/features/profile/hooks';
import { toUserMessage } from '@/lib/errors';

// Mismo límite que el CHECK de profiles.display_name.
const MAX_NAME = 40;

export default function EditProfileScreen() {
  const me = useMyProfile();
  if (me.isPending) return <LoadingState />;
  if (me.isError || !me.data) return <ErrorState onRetry={() => void me.refetch()} />;
  const { profile } = me.data;
  return (
    <EditProfileForm
      initial={{
        displayName: profile.display_name ?? profile.username ?? '',
        avatarId: profile.avatar_id,
        dailyGoal: profile.daily_goal_minutes,
      }}
    />
  );
}

function EditProfileForm({
  initial,
}: {
  initial: { displayName: string; avatarId: string; dailyGoal: number };
}) {
  const update = useUpdateProfile();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [avatarId, setAvatarId] = useState(initial.avatarId);
  const [dailyGoal, setDailyGoal] = useState(initial.dailyGoal);

  const trimmed = displayName.trim();
  const nameError = trimmed.length === 0 ? 'El nombre no puede quedar vacío.' : undefined;
  const changed =
    trimmed !== initial.displayName ||
    avatarId !== initial.avatarId ||
    dailyGoal !== initial.dailyGoal;

  const save = () =>
    update.mutate(
      { display_name: trimmed, avatar_id: avatarId, daily_goal_minutes: dailyGoal },
      { onSuccess: () => router.back() },
    );

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          {update.isError ? (
            <FormMessage tone="error" message={toUserMessage(update.error)} />
          ) : null}
          <Button
            label="Guardar cambios"
            size="lg"
            disabled={!changed || Boolean(nameError)}
            loading={update.isPending}
            onPress={save}
          />
        </>
      }
    >
      <ScreenHeader title="Editar perfil" onBack={() => router.back()} />

      <TextField
        label="Nombre visible"
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={MAX_NAME}
        autoCapitalize="words"
        error={nameError}
        hint="Tu nombre de usuario y tu código no cambian."
      />

      <Text variant="overline">AVATAR</Text>
      <View style={styles.avatarGrid}>
        {AVATARS.map((a) => (
          <Pressable
            key={a.id}
            accessibilityRole="radio"
            accessibilityLabel={`Avatar ${a.id}`}
            accessibilityState={{ selected: avatarId === a.id }}
            onPress={() => setAvatarId(a.id)}
            style={[styles.avatarCell, avatarId === a.id && styles.avatarSelected]}
          >
            <Avatar avatarId={a.id} size={56} />
          </Pressable>
        ))}
      </View>

      <Text variant="overline">OBJETIVO DIARIO</Text>
      {DAILY_GOALS.map((g) => (
        <SelectCard
          key={g}
          title={`${g} minutos al día`}
          selected={dailyGoal === g}
          onPress={() => setDailyGoal(g)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  avatarCell: {
    padding: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceRaised },
});

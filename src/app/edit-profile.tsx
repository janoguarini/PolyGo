import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ImagePlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AVATARS, COUNTRIES, DAILY_GOALS, flagEmoji } from '@shared/profile';

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
import { useAuth } from '@/features/auth/AuthProvider';
import { FormMessage } from '@/features/auth/FormMessage';
import { pickAvatarPhoto, uploadAvatarPhoto } from '@/features/profile/avatarUpload';
import { useMyProfile, useUpdateProfile } from '@/features/profile/hooks';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
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
        avatarPath: profile.avatar_path,
        dailyGoal: profile.daily_goal_minutes,
        region: profile.region,
      }}
    />
  );
}

function EditProfileForm({
  initial,
}: {
  initial: {
    displayName: string;
    avatarId: string;
    avatarPath: string | null;
    dailyGoal: number;
    region: string | null;
  };
}) {
  const update = useUpdateProfile();
  const { session } = useAuth();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [avatarId, setAvatarId] = useState(initial.avatarId);
  const [dailyGoal, setDailyGoal] = useState(initial.dailyGoal);
  const [region, setRegion] = useState(initial.region);
  // Foto propia: la actual (URL pública), una elegida de la galería sin subir todavía, o ninguna.
  const initialPhoto = avatarPhotoUrl(initial.avatarPath);
  const [photo, setPhoto] = useState<{ uri: string; local: boolean } | null>(
    initialPhoto ? { uri: initialPhoto, local: false } : null,
  );
  const photoChanged = Boolean(photo?.local) || (photo === null) !== (initial.avatarPath === null);

  const choosePhoto = async () => {
    const uri = await pickAvatarPhoto();
    if (uri) setPhoto({ uri, local: true });
  };

  const trimmed = displayName.trim();
  const nameError = trimmed.length === 0 ? 'El nombre no puede quedar vacío.' : undefined;
  const changed =
    trimmed !== initial.displayName ||
    avatarId !== initial.avatarId ||
    dailyGoal !== initial.dailyGoal ||
    region !== initial.region ||
    photoChanged;

  // La foto se sube recién al guardar; si falla, no se toca el perfil.
  const save = useMutation({
    mutationFn: async () => {
      let avatarPath = initial.avatarPath;
      if (photo?.local) avatarPath = await uploadAvatarPhoto(session!.user.id, photo.uri);
      else if (!photo) avatarPath = null;
      await update.mutateAsync({
        display_name: trimmed,
        avatar_id: avatarId,
        avatar_path: avatarPath,
        daily_goal_minutes: dailyGoal,
        region,
      });
    },
    onSuccess: () => router.back(),
  });

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          {save.isError ? <FormMessage tone="error" message={toUserMessage(save.error)} /> : null}
          <Button
            label="Guardar cambios"
            size="lg"
            disabled={!changed || Boolean(nameError)}
            loading={save.isPending}
            onPress={() => save.mutate()}
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
        {AVATARS.map((a) => {
          const selected = !photo && avatarId === a.id;
          return (
            <Pressable
              key={a.id}
              accessibilityRole="radio"
              accessibilityLabel={a.name}
              accessibilityState={{ selected }}
              onPress={() => {
                setAvatarId(a.id);
                setPhoto(null);
              }}
              style={[styles.avatarCell, selected && styles.avatarSelected]}
            >
              <Avatar avatarId={a.id} size={64} />
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="radio"
          accessibilityLabel={
            photo ? 'Tu foto. Tocá para elegir otra' : 'Elegir una foto de la galería'
          }
          accessibilityState={{ selected: Boolean(photo) }}
          onPress={() => void choosePhoto()}
          style={[styles.avatarCell, photo && styles.avatarSelected]}
        >
          {photo ? (
            <Avatar avatarId={avatarId} photoUrl={photo.uri} size={64} />
          ) : (
            <View style={styles.addPhoto}>
              <ImagePlus color={colors.primarySoft} size={24} />
              <Text variant="caption" color="primarySoft">
                Galería
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      {photo ? (
        <Button label="Quitar foto" variant="ghost" onPress={() => setPhoto(null)} />
      ) : (
        <Text variant="caption" align="center">
          Elegí un zorro o subí una foto tuya.
        </Text>
      )}

      <Text variant="overline">PAÍS</Text>
      <Text variant="caption">
        Aparece junto a tu nombre. En tu perfil público sólo se ve si lo activás en Ajustes.
      </Text>
      <View style={styles.countries} accessibilityRole="radiogroup" accessibilityLabel="País">
        {[{ code: null, name: 'Sin país' }, ...COUNTRIES].map((c) => {
          const selected = region === c.code;
          return (
            <Pressable
              key={c.code ?? 'none'}
              accessibilityRole="radio"
              accessibilityLabel={c.name}
              accessibilityState={{ selected }}
              onPress={() => setRegion(c.code)}
              style={[styles.country, selected && styles.countrySelected]}
            >
              <Text variant="caption" color={selected ? 'textStrong' : 'text'}>
                {c.code ? `${flagEmoji(c.code)} ` : ''}
                {c.name}
              </Text>
            </Pressable>
          );
        })}
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
  addPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  countries: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  country: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  countrySelected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
});

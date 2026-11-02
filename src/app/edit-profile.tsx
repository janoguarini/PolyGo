import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ImagePlus, Paintbrush, ScanFace, Smile } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { COSMETICS, type CosmeticKind } from '@shared/cosmetics';
import { AVATARS, COUNTRIES, DAILY_GOALS, flagEmoji } from '@shared/profile';

import {
  Avatar,
  Button,
  ErrorState,
  LoadingState,
  PolyCoin,
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
import { BuyCosmeticButton, ItemTile, NoneTile } from '@/features/cosmetics/CosmeticTiles';
import { equipCosmetic, useOwnedCosmetics } from '@/features/cosmetics/api';
import { usePolys } from '@/features/polys/api';
import { pickAvatarPhoto, uploadAvatarPhoto } from '@/features/profile/avatarUpload';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { useMyProfile, useUpdateProfile } from '@/features/profile/hooks';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import type { PlayerRatingRow, ProfileRow } from '@/lib/database.types';
import { toUserMessage } from '@/lib/errors';

// Mismo límite que el CHECK de profiles.display_name.
const MAX_NAME = 40;

type Tab = 'avatar' | CosmeticKind;

const TABS: { id: Tab; label: string; Icon: typeof Smile }[] = [
  { id: 'avatar', label: 'Avatar', Icon: Smile },
  { id: 'frame', label: 'Marcos', Icon: ScanFace },
  { id: 'background', label: 'Fondos', Icon: Paintbrush },
];

export default function EditProfileScreen() {
  const me = useMyProfile();
  const owned = useOwnedCosmetics();
  const polys = usePolys();
  if (me.isPending || owned.isPending) return <LoadingState />;
  if (me.isError || owned.isError || !me.data) {
    return (
      <ErrorState
        onRetry={() => {
          void me.refetch();
          void owned.refetch();
        }}
      />
    );
  }
  return (
    <EditProfileForm
      profile={me.data.profile}
      rating={me.data.rating}
      owned={new Set(owned.data)}
      balance={polys.data?.balance ?? 0}
    />
  );
}

/**
 * Arriba, tu encabezado de perfil como vista previa: todo lo que tocás (avatar, marco, fondo, nombre,
 * país) se ve ahí al instante. Lo propio se aplica con "Guardar cambios"; lo que no es tuyo se puede
 * comprar desde acá mismo.
 */
function EditProfileForm({
  profile,
  rating,
  owned,
  balance,
}: {
  profile: ProfileRow;
  rating: PlayerRatingRow | null;
  owned: Set<string>;
  balance: number;
}) {
  const update = useUpdateProfile();
  const qc = useQueryClient();
  const { session } = useAuth();
  const [tab, setTab] = useState<Tab>('avatar');
  const [displayName, setDisplayName] = useState(profile.display_name ?? profile.username ?? '');
  const [avatarId, setAvatarId] = useState(profile.avatar_id);
  const [frameId, setFrameId] = useState(profile.frame_id);
  const [backgroundId, setBackgroundId] = useState(profile.background_id);
  const [dailyGoal, setDailyGoal] = useState(profile.daily_goal_minutes);
  const [region, setRegion] = useState(profile.region);
  const [initial] = useState(() => ({
    displayName: profile.display_name ?? profile.username ?? '',
    avatarId: profile.avatar_id,
    avatarPath: profile.avatar_path,
    dailyGoal: profile.daily_goal_minutes,
    region: profile.region,
  }));
  // Foto propia: la actual (URL pública), una elegida de la galería sin subir todavía, o ninguna.
  const initialPhoto = avatarPhotoUrl(initial.avatarPath);
  const [photo, setPhoto] = useState<{ uri: string; local: boolean } | null>(
    initialPhoto ? { uri: initialPhoto, local: false } : null,
  );
  const photoChanged = Boolean(photo?.local) || (photo === null) !== (initial.avatarPath === null);

  // Marco y fondo se comparan con lo puesto ahora (comprar ya lo pone). Lo ajeno sólo se prueba.
  const usable = (id: string | null) => id === null || owned.has(id);
  const frameChanged = frameId !== profile.frame_id && usable(frameId);
  const backgroundChanged = backgroundId !== profile.background_id && usable(backgroundId);
  const tryingOn = [frameId, backgroundId]
    .filter((id): id is string => id !== null && !owned.has(id))
    .map((id) => COSMETICS.find((c) => c.id === id)?.name)
    .filter(Boolean);

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
    photoChanged ||
    frameChanged ||
    backgroundChanged;

  // La foto se sube recién al guardar; si falla, no se toca el perfil.
  const save = useMutation({
    mutationFn: async () => {
      let avatarPath = initial.avatarPath;
      if (photo?.local) avatarPath = await uploadAvatarPhoto(session!.user.id, photo.uri);
      else if (!photo) avatarPath = null;
      if (frameChanged) await equipCosmetic('frame', frameId);
      if (backgroundChanged) await equipCosmetic('background', backgroundId);
      await update.mutateAsync({
        display_name: trimmed,
        avatar_id: avatarId,
        avatar_path: avatarPath,
        daily_goal_minutes: dailyGoal,
        region,
      });
      if (frameChanged || backgroundChanged) {
        await qc.invalidateQueries({ queryKey: ['cosmetics'] });
      }
    },
    onSuccess: () => router.back(),
  });

  const previewProfile: ProfileRow = {
    ...profile,
    display_name: trimmed || profile.username,
    avatar_id: avatarId,
    frame_id: frameId,
    background_id: backgroundId,
    region,
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          {save.isError ? <FormMessage tone="error" message={toUserMessage(save.error)} /> : null}
          {tryingOn.length > 0 ? (
            <Text variant="caption" align="center">
              Estás probando {tryingOn.join(' y ')}:{' '}
              {tryingOn.length > 1
                ? 'compralos para que se guarden.'
                : 'compralo para que se guarde.'}
            </Text>
          ) : null}
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
      <View style={styles.header}>
        <View style={styles.flex}>
          <ScreenHeader title="Editar perfil" onBack={() => router.back()} />
        </View>
        <View style={styles.balance} accessibilityLabel={`Tenés ${balance} Polys`}>
          <PolyCoin size={20} />
          <Text variant="bodyStrong" color="gold" style={styles.tabular}>
            {balance}
          </Text>
        </View>
      </View>

      <View accessibilityLabel="Vista previa de tu perfil">
        <ProfileHeader
          profile={previewProfile}
          rating={rating}
          preview
          photoUrl={photo?.uri ?? null}
        />
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map(({ id, label, Icon }) => {
          const active = id === tab;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setTab(id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Icon color={active ? colors.onPrimary : colors.textMuted} size={16} />
              <Text variant="bodyStrong" color={active ? 'onPrimary' : 'textMuted'}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'avatar' ? (
        <>
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
        </>
      ) : (
        <CosmeticPicker
          kind={tab}
          selectedId={tab === 'frame' ? frameId : backgroundId}
          equippedId={tab === 'frame' ? profile.frame_id : profile.background_id}
          onSelect={tab === 'frame' ? setFrameId : setBackgroundId}
          owned={owned}
          balance={balance}
          avatarId={avatarId}
          photoUrl={photo?.uri ?? null}
        />
      )}

      <TextField
        label="Nombre visible"
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={MAX_NAME}
        autoCapitalize="words"
        error={nameError}
        hint="Tu nombre de usuario y tu código no cambian."
      />

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

/** Grilla de marcos o fondos: tocar uno lo prueba en la vista previa; si no es tuyo, se compra acá. */
function CosmeticPicker({
  kind,
  selectedId,
  equippedId,
  onSelect,
  owned,
  balance,
  avatarId,
  photoUrl,
}: {
  kind: CosmeticKind;
  selectedId: string | null;
  equippedId: string | null;
  onSelect: (id: string | null) => void;
  owned: Set<string>;
  balance: number;
  avatarId: string;
  photoUrl: string | null;
}) {
  const items = COSMETICS.filter((c) => c.kind === kind);
  const selected = items.find((c) => c.id === selectedId);
  const pick = (id: string | null) => {
    void Haptics.selectionAsync();
    onSelect(id);
  };
  return (
    <>
      <View style={styles.grid}>
        <NoneTile
          selected={selectedId === null}
          equipped={equippedId === null}
          onPress={() => pick(null)}
        />
        {items.map((item) => (
          <ItemTile
            key={item.id}
            item={item}
            avatarId={avatarId}
            photoUrl={photoUrl}
            selected={item.id === selectedId}
            owned={owned.has(item.id)}
            equipped={item.id === equippedId}
            onPress={() => pick(item.id)}
          />
        ))}
      </View>
      {selected && !owned.has(selected.id) ? (
        <BuyCosmeticButton key={selected.id} item={selected} balance={balance} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabular: { fontVariant: ['tabular-nums'] },
  tabs: {
    flexDirection: 'row',
    padding: spacing.xs,
    gap: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 40,
    borderRadius: radii.pill,
  },
  tabActive: { backgroundColor: colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
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

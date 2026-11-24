import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Crown, ImagePlus, Lock, Paintbrush, ScanFace, Smile } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  cosmeticById,
  isSkinId,
  visibleCosmetics,
  type CosmeticKind,
  type CosmeticRarity,
} from '@shared/cosmetics';
import {
  compatibilityFor,
  isCosmeticCompatible,
  keepIfCompatible,
} from '@shared/cosmeticCompatibility';
import { AVATARS, COUNTRIES, DAILY_GOALS, DEFAULT_AVATAR, flagEmoji } from '@shared/profile';

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
  elevation,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { FormMessage } from '@/features/auth/FormMessage';
import {
  CosmeticAction,
  EquippedBadge,
  ItemTile,
  NoneTile,
  RankLadder,
  useCosmeticContext,
} from '@/features/cosmetics/CosmeticTiles';
import { equipCosmetic, useOwnedCosmetics } from '@/features/cosmetics/api';
import { cosmeticStatus, isUnlocked } from '@/features/cosmetics/state';
import { cosmeticStrings } from '@/features/cosmetics/strings';
import { usePolys } from '@/features/polys/api';
import { pickAvatarPhoto, uploadAvatarPhoto } from '@/features/profile/avatarUpload';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { useMyProfile, useUpdateProfile } from '@/features/profile/hooks';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import type { PlayerRatingRow, ProfileRow } from '@/lib/database.types';
import { useXp } from '@/features/xp/api';
import { PlayerTitle } from '@/features/xp/PlayerTitle';
import { qaReadOnly } from '@/features/xp/previewGate';
import { STARTING_XP, xpOrStart } from '@/features/xp/startingXp';
import {
  LEVEL_TITLES,
  isTitleUnlocked,
  levelTitle,
  setTitleChoice,
  useTitleChoice,
} from '@/features/xp/titles';
import { xpStrings } from '@/features/xp/strings';
import { useStrings } from '@/i18n';
import { editProfileStrings } from '@/i18n/screens/editProfile';
import { toUserMessage } from '@/lib/errors';

// Mismo límite que el CHECK de profiles.display_name.
const MAX_NAME = 40;

type Tab = 'avatar' | CosmeticKind;

const TABS: { id: Exclude<Tab, 'skin'>; Icon: typeof Smile }[] = [
  { id: 'avatar', Icon: Smile },
  { id: 'frame', Icon: ScanFace },
  { id: 'background', Icon: Paintbrush },
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
  const styles = useStyles();
  const t = useStrings(editProfileStrings);
  const ct = useStrings(cosmeticStrings);
  const xt = useStrings(xpStrings);
  const update = useUpdateProfile();
  const qc = useQueryClient();
  const { session } = useAuth();
  const ctx = useCosmeticContext(owned);
  const [tab, setTab] = useState<Tab>('avatar');
  const [displayName, setDisplayName] = useState(profile.display_name ?? profile.username ?? '');
  const [avatarId, setAvatarIdRaw] = useState(profile.avatar_id);
  const [frameId, setFrameId] = useState(profile.frame_id);
  const [backgroundId, setBackgroundId] = useState(profile.background_id);
  // Sólo se guarda el marco/fondo que el jugador eligió a mano. Los ajustes automáticos de la vista
  // previa (al probar un avatar con el que no combina) no se guardan: si el avatar que se prueba no
  // es suyo, su marco y fondo reales tienen que quedar como estaban.
  const [frameTouched, setFrameTouched] = useState(false);
  const [backgroundTouched, setBackgroundTouched] = useState(false);
  const chooseFrame = (id: string | null) => {
    setFrameId(id);
    setFrameTouched(true);
  };
  const chooseBackground = (id: string | null) => {
    setBackgroundId(id);
    setBackgroundTouched(true);
  };
  // Cambiar de avatar conserva el marco y el fondo si siguen combinando; si no, vuelven al
  // predeterminado. Es lo mismo que hace la base (trigger profiles_guard_compat).
  const setAvatarId = (id: string) => {
    setAvatarIdRaw(id);
    if (keepIfCompatible(id, frameId) !== frameId) {
      setFrameId(null);
      setFrameTouched(false);
    }
    if (keepIfCompatible(id, backgroundId) !== backgroundId) {
      setBackgroundId(null);
      setBackgroundTouched(false);
    }
  };
  // Título: el nivel global decide cuáles están desbloqueados (nivel 0 si el servidor no tiene XP).
  const level = xpOrStart(useXp().data)?.level ?? 0;
  const userId = session?.user.id;
  const storedTitle = useTitleChoice(userId);
  const [titleChoice, setTitleChoiceDraft] = useState(storedTitle);
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

  // Lo bloqueado se puede probar en la vista previa, pero nunca se guarda: sólo lo que el jugador
  // puede usar (comprado, gratis, Plus activo o rango alcanzado). La base lo vuelve a validar.
  const usable = (id: string | null) => {
    if (id === null) return true;
    const item = cosmeticById(id);
    return item ? isUnlocked(item, ctx) : !isSkinId(id);
  };
  // El avatar que queda guardado (una skin que se está probando sin tenerla no se guarda).
  const savedAvatar = usable(avatarId) ? avatarId : profile.avatar_id;
  // Marco y fondo se comparan con lo puesto ahora (comprar ya lo pone) y tienen que combinar con el
  // avatar que se guarda: la base rechaza una combinación incompatible.
  const savable = (id: string | null) => usable(id) && isCosmeticCompatible(savedAvatar, id);
  const frameChanged = frameTouched && frameId !== profile.frame_id && savable(frameId);
  const backgroundChanged =
    backgroundTouched && backgroundId !== profile.background_id && savable(backgroundId);
  const avatarChanged = avatarId !== profile.avatar_id && usable(avatarId);
  // Combinan con la skin que se está probando, pero no con el avatar que se guardaría.
  const blockedByAvatar = [frameTouched && frameId, backgroundTouched && backgroundId].some(
    (id) => typeof id === 'string' && usable(id) && !savable(id),
  );
  const tryingOn = [avatarId, frameId, backgroundId]
    .filter((id): id is string => id !== null && !usable(id))
    .map((id) => {
      const item = cosmeticById(id);
      return item ? ct.name(item) : undefined;
    })
    .filter((name): name is string => Boolean(name));
  // Un avatar común para volver desde una skin a la foto o a los zorros de siempre.
  const [lastBasicAvatar, setLastBasicAvatar] = useState(
    isSkinId(profile.avatar_id) ? DEFAULT_AVATAR : profile.avatar_id,
  );
  const skinOn = isSkinId(avatarId);

  const choosePhoto = async () => {
    if (photo && skinOn) {
      setAvatarId(lastBasicAvatar);
      return;
    }
    const uri = await pickAvatarPhoto();
    if (uri) {
      setPhoto({ uri, local: true });
      if (skinOn) setAvatarId(lastBasicAvatar);
    }
  };

  const trimmed = displayName.trim();
  const nameError = trimmed.length === 0 ? t.nameEmpty : undefined;
  const profileChanged =
    trimmed !== initial.displayName ||
    avatarChanged ||
    dailyGoal !== initial.dailyGoal ||
    region !== initial.region ||
    photoChanged ||
    frameChanged ||
    backgroundChanged;
  // El título se guarda en este teléfono, no en la base: cambiar sólo el título no escribe en Supabase.
  const titleChanged = titleChoice !== storedTitle;
  const changed = profileChanged || titleChanged;

  // La foto se sube recién al guardar; si falla, no se toca el perfil.
  const save = useMutation({
    mutationFn: async () => {
      if (titleChanged && userId) setTitleChoice(userId, titleChoice);
      if (!profileChanged) return;
      let avatarPath = initial.avatarPath;
      if (photo?.local) avatarPath = await uploadAvatarPhoto(session!.user.id, photo.uri);
      else if (!photo) avatarPath = null;
      // Primero el avatar: la base valida marco y fondo contra el avatar que ya quedó guardado.
      await update.mutateAsync({
        display_name: trimmed,
        // Lo que se está probando sin tenerlo no se guarda: queda el avatar actual.
        avatar_id: savedAvatar,
        avatar_path: avatarPath,
        daily_goal_minutes: dailyGoal,
        region,
      });
      if (frameChanged) await equipCosmetic('frame', frameId);
      if (backgroundChanged) await equipCosmetic('background', backgroundId);
      if (frameChanged || backgroundChanged) {
        await Promise.all([
          qc.invalidateQueries({ queryKey: ['cosmetics'] }),
          qc.invalidateQueries({ queryKey: ['profile'] }),
        ]);
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
              {t.tryingOn(tryingOn)}
            </Text>
          ) : blockedByAvatar ? (
            <Text variant="caption" align="center">
              {t.blockedByAvatar}
            </Text>
          ) : null}
          {qaReadOnly ? (
            <Text variant="caption" align="center">
              {t.previewSave}
            </Text>
          ) : null}
          <Button
            label={t.save}
            size="lg"
            disabled={qaReadOnly || !changed || Boolean(nameError)}
            loading={save.isPending}
            onPress={() => save.mutate()}
          />
        </>
      }
    >
      <View style={styles.header}>
        <View style={styles.flex}>
          <ScreenHeader title={t.title} onBack={() => router.back()} />
        </View>
        <View style={styles.balance} accessibilityLabel={t.balanceA11y(balance)}>
          <PolyCoin size={20} />
          <Text variant="bodyStrong" color="gold" style={styles.tabular}>
            {balance}
          </Text>
        </View>
      </View>

      <View accessibilityLabel={t.previewA11y}>
        <ProfileHeader
          profile={previewProfile}
          rating={rating}
          preview
          showRank={false}
          subtitle={<PlayerTitle xp={{ ...STARTING_XP, level }} choice={titleChoice} />}
          photoUrl={photo?.uri ?? null}
          footer={<Loadout avatarId={avatarId} frameId={frameId} backgroundId={backgroundId} />}
        />
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map(({ id, Icon }) => {
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
                {t.tabs[id]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'avatar' ? (
        <>
          <CosmeticPicker
            kind="skin"
            title={t.collection}
            selectedId={skinOn ? avatarId : null}
            equippedId={profile.avatar_id}
            onSelect={(id) => id && setAvatarId(id)}
            ctx={ctx}
            balance={balance}
            avatarId={avatarId}
            photoUrl={null}
          />
          <Text variant="overline">{t.basicAvatars}</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((a) => {
              const selected = !photo && avatarId === a.id;
              return (
                <Pressable
                  key={a.id}
                  accessibilityRole="radio"
                  accessibilityLabel={t.avatarName(a.id, a.name)}
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setAvatarId(a.id);
                    setLastBasicAvatar(a.id);
                    setPhoto(null);
                  }}
                  style={[styles.avatarCell, selected && styles.avatarSelected]}
                >
                  <Avatar avatarId={a.id} size={64} />
                  {a.id === profile.avatar_id && !profile.avatar_path ? <EquippedBadge /> : null}
                </Pressable>
              );
            })}
            <Pressable
              accessibilityRole="radio"
              accessibilityLabel={t.photoA11y(Boolean(photo))}
              accessibilityState={{ selected: Boolean(photo) && !skinOn }}
              onPress={() => void choosePhoto()}
              style={[styles.avatarCell, photo && !skinOn && styles.avatarSelected]}
            >
              {photo ? (
                <Avatar avatarId={lastBasicAvatar} photoUrl={photo.uri} size={64} />
              ) : (
                <View style={styles.addPhoto}>
                  <ImagePlus color={colors.primarySoft} size={24} />
                  <Text variant="caption" color="primarySoft">
                    {t.gallery}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          {photo && !skinOn ? (
            <Button label={t.removePhoto} variant="ghost" onPress={() => setPhoto(null)} />
          ) : (
            <Text variant="caption" align="center">
              {skinOn ? t.skinPhotoHint : t.avatarHint}
            </Text>
          )}
        </>
      ) : (
        <CosmeticPicker
          kind={tab}
          selectedId={tab === 'frame' ? frameId : backgroundId}
          equippedId={tab === 'frame' ? profile.frame_id : profile.background_id}
          onSelect={tab === 'frame' ? chooseFrame : chooseBackground}
          ctx={ctx}
          balance={balance}
          avatarId={avatarId}
          photoUrl={photo?.uri ?? null}
        />
      )}

      <TextField
        label={t.displayName}
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={MAX_NAME}
        autoCapitalize="words"
        error={nameError}
        hint={t.displayNameHint}
      />

      <Text variant="overline">{t.titleCaps}</Text>
      <Text variant="caption">{t.titleHint}</Text>
      <View
        style={styles.countries}
        accessibilityRole="radiogroup"
        accessibilityLabel={t.titleA11y}
      >
        {[{ title: null, minLevel: 0 }, ...LEVEL_TITLES].map((option) => {
          const selected = titleChoice === option.title;
          const unlocked = option.title === null || isTitleUnlocked(option.title, level);
          return (
            <Pressable
              key={option.title ?? 'auto'}
              accessibilityRole="radio"
              accessibilityLabel={
                option.title === null
                  ? t.autoA11y(xt.title(levelTitle(level)))
                  : unlocked
                    ? xt.title(option.title)
                    : t.lockedTitleA11y(xt.title(option.title), option.minLevel)
              }
              accessibilityState={{ selected, disabled: !unlocked }}
              disabled={!unlocked}
              onPress={() => {
                void Haptics.selectionAsync();
                setTitleChoiceDraft(option.title);
              }}
              style={[
                styles.country,
                styles.titleChip,
                selected && styles.countrySelected,
                !unlocked && styles.titleLocked,
              ]}
            >
              {unlocked ? (
                <Crown
                  color={colors.gold}
                  fill={selected ? colors.gold : 'transparent'}
                  size={12}
                />
              ) : (
                <Lock color={colors.textMuted} size={12} />
              )}
              <Text variant="caption" color={selected ? 'textStrong' : 'text'}>
                {option.title === null ? t.auto : xt.title(option.title)}
                {unlocked ? '' : t.levelShort(option.minLevel)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="overline">{t.countryCaps}</Text>
      <Text variant="caption">{t.countryHint}</Text>
      <View
        style={styles.countries}
        accessibilityRole="radiogroup"
        accessibilityLabel={t.countryA11y}
      >
        {[{ code: null, name: t.noCountry }, ...COUNTRIES].map((c) => {
          const selected = region === c.code;
          const name = c.code ? t.countryName(c.code, c.name) : c.name;
          return (
            <Pressable
              key={c.code ?? 'none'}
              accessibilityRole="radio"
              accessibilityLabel={name}
              accessibilityState={{ selected }}
              onPress={() => setRegion(c.code)}
              style={[styles.country, selected && styles.countrySelected]}
            >
              <Text variant="caption" color={selected ? 'textStrong' : 'text'}>
                {c.code ? `${flagEmoji(c.code)} ` : ''}
                {name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="overline">{t.dailyGoal}</Text>
      {DAILY_GOALS.map((g) => (
        <SelectCard
          key={g}
          title={t.minutesPerDay(g)}
          selected={dailyGoal === g}
          onPress={() => setDailyGoal(g)}
        />
      ))}
    </Screen>
  );
}

/**
 * Grilla de skins, marcos o fondos: tocar uno lo prueba en la vista previa (también lo bloqueado);
 * abajo se ve qué hace falta para conseguirlo o el botón para desbloquearlo con Polys.
 * Los marcos se agrupan en cosméticos, exclusivos y competitivos (no se mezclan).
 */
function CosmeticPicker({
  kind,
  title,
  selectedId,
  equippedId,
  onSelect,
  ctx,
  balance,
  avatarId,
  photoUrl,
}: {
  kind: CosmeticKind;
  title?: string;
  selectedId: string | null;
  equippedId: string | null;
  onSelect: (id: string | null) => void;
  ctx: ReturnType<typeof useCosmeticContext>;
  balance: number;
  avatarId: string;
  photoUrl: string | null;
}) {
  const styles = useStyles();
  const t = useStrings(editProfileStrings);
  const ct = useStrings(cosmeticStrings);
  // Marcos y fondos: sólo los que combinan con el avatar elegido (también los bloqueados que
  // combinan, para que se vea qué se puede conseguir). Cambia al instante al cambiar de avatar.
  const catalog = visibleCosmetics(kind, ctx.owned);
  const all = catalog.filter((c) => kind === 'skin' || isCosmeticCompatible(avatarId, c.id));
  // Cuántos quedan ocultos: así se entiende que no desaparecieron, sino que combinan con otro avatar.
  const hidden = catalog.length - all.length;
  const themedFor = kind === 'skin' ? null : compatibilityFor(avatarId);
  const [rarity, setRarity] = useState<CosmeticRarity | 'all'>('all');
  // Filtros sólo con las rarezas que hay en este catálogo.
  const filters = RARITY_FILTERS.filter((f) => f === 'all' || all.some((c) => c.rarity === f));
  const items = rarity === 'all' ? all : all.filter((c) => c.rarity === rarity);
  const selected = all.find((c) => c.id === selectedId);
  const pick = (id: string | null) => {
    void Haptics.selectionAsync();
    onSelect(id);
  };
  const tile = (item: (typeof items)[number]) => (
    <ItemTile
      key={item.id}
      item={item}
      status={cosmeticStatus(item, ctx, equippedId)}
      avatarId={avatarId}
      photoUrl={photoUrl}
      rating={ctx.rating}
      selected={item.id === selectedId}
      onPress={() => pick(item.id)}
    />
  );
  const groups =
    kind === 'frame' && rarity === 'all'
      ? [
          {
            label: t.groups.cosmetic,
            items: items.filter((c) => !isExclusive(c) && c.source !== 'rank'),
          },
          { label: t.groups.exclusive, items: items.filter(isExclusive) },
          { label: t.groups.competitive, items: items.filter((c) => c.source === 'rank') },
        ]
      : [{ label: title?.toUpperCase(), items }];
  return (
    <>
      {themedFor ? (
        <View style={styles.compatNote} accessible accessibilityRole="text">
          <Text variant="caption" color="text">
            {t.compatPrefix(kind === 'frame' ? 'frame' : 'background')}
            <Text variant="caption" color="textStrong" style={styles.bold}>
              {(() => {
                const skin = cosmeticById(avatarId);
                return skin ? ct.name(skin) : t.yourAvatar;
              })()}
            </Text>
            . {t.compatHidden(hidden)}
          </Text>
        </View>
      ) : null}
      {kind !== 'skin' && filters.length > 2 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          accessibilityRole="tablist"
        >
          {filters.map((f) => {
            const active = f === rarity;
            return (
              <Pressable
                key={f}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setRarity(f)}
                style={[styles.filter, active && styles.filterActive]}
              >
                <Text
                  variant="caption"
                  color={active ? 'onPrimary' : 'text'}
                  style={styles.filterText}
                >
                  {t.rarityFilters[f]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
      {groups.map((g, i) => (
        <View key={g.label ?? i} style={styles.group}>
          {g.label ? <Text variant="overline">{g.label}</Text> : null}
          <View style={styles.grid}>
            {i === 0 && kind !== 'skin' && rarity === 'all' ? (
              <NoneTile
                selected={selectedId === null}
                equipped={equippedId === null}
                onPress={() => pick(null)}
              />
            ) : null}
            {g.items.map(tile)}
          </View>
        </View>
      ))}
      {items.length === 0 ? (
        <Text variant="caption" align="center">
          {t.noRarity}
        </Text>
      ) : null}
      {kind === 'frame' && rarity === 'all' ? <RankLadder rating={ctx.rating} /> : null}
      {selected ? (
        <CosmeticAction
          key={selected.id}
          item={selected}
          status={cosmeticStatus(selected, ctx, equippedId)}
          balance={balance}
        />
      ) : null}
    </>
  );
}

const isExclusive = (c: { rarity: string }) => c.rarity === 'exclusive' || c.rarity === 'limited';

/** Lo que llevás puesto en la vista previa: avatar · marco · fondo. */
function Loadout({
  avatarId,
  frameId,
  backgroundId,
}: {
  avatarId: string;
  frameId: string | null;
  backgroundId: string | null;
}) {
  const styles = useStyles();
  const t = useStrings(editProfileStrings);
  const ct = useStrings(cosmeticStrings);
  const nameOf = (id: string) => {
    const item = cosmeticById(id);
    return item ? ct.name(item) : '–';
  };
  const parts = [
    { label: t.loadout.avatar, value: isSkinId(avatarId) ? nameOf(avatarId) : t.basic },
    { label: t.loadout.frame, value: frameId ? nameOf(frameId) : t.basic },
    { label: t.loadout.background, value: backgroundId ? nameOf(backgroundId) : t.solid },
  ];
  return (
    <View
      style={styles.loadout}
      accessible
      accessibilityLabel={parts.map((p) => `${p.label}: ${p.value}`).join(', ')}
    >
      {parts.map((p) => (
        <View key={p.label} style={styles.loadoutCell}>
          <Text variant="overline" style={styles.loadoutLabel} numberOfLines={1}>
            {p.label.toUpperCase()}
          </Text>
          <Text variant="caption" style={styles.loadoutValue} numberOfLines={1}>
            {p.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const RARITY_FILTERS: readonly (CosmeticRarity | 'all')[] = [
  'all',
  'common',
  'rare',
  'epic',
  'legendary',
  'mythic',
  'exclusive',
];

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      minHeight: 46,
      borderRadius: radii.md,
    },
    tabActive: { backgroundColor: colors.primary, ...elevation.glow },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    group: { gap: spacing.sm },
    filters: { gap: spacing.sm, paddingVertical: spacing.xxs },
    filter: {
      paddingHorizontal: spacing.md,
      minHeight: 34,
      justifyContent: 'center',
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    filterActive: { backgroundColor: colors.primary, borderColor: colors.primaryBright },
    filterText: { fontWeight: '700' },
    avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      justifyContent: 'center',
    },
    avatarCell: {
      padding: spacing.sm,
      borderRadius: radii.lg,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
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
    bold: { fontWeight: '700' },
    compatNote: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    loadout: { flexDirection: 'row', gap: spacing.xs },
    loadoutCell: { flex: 1, minWidth: 0, alignItems: 'center' },
    // Sobre el fondo del perfil (siempre oscuro): colores claros fijos.
    loadoutLabel: { color: '#C4B5FD' },
    loadoutValue: { color: '#FFFFFF', fontWeight: '700' },
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
    countrySelected: {
      borderColor: colors.primaryBright,
      backgroundColor: colors.surfaceHighlight,
    },
    titleChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    titleLocked: { opacity: 0.5 },
  }),
);

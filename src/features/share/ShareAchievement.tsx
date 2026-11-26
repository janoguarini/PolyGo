import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { Share2 } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { SHARE_REWARD_POLYS, type ShareAchievement } from '@shared/share';

import { PolyCoin } from '@/design-system';
import { Confetti } from '@/features/battle/components/Confetti';
import { useMyProfile } from '@/features/profile/hooks';
import { useReferralStatus } from '@/features/referrals/api';
import { useStrings } from '@/i18n';
import { playSound } from '@/lib/sounds';

import { useClaimShareReward, wasShareClaimed } from './api';
import { CARD_HEIGHT, CARD_WIDTH, ShareCard } from './ShareCard';
import { shareStrings } from './strings';

/** Compartir imágenes necesita la app nativa (en la web no hay hoja de compartir de archivos). */
export const canShareImages = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Pantalla completa con la tarjeta del logro: entra girando como una carta, le pasa un brillo, cae
 * confeti y abajo están «Compartir · +20» y «Ahora no». Al compartir se saca la foto de la tarjeta y
 * se abre la hoja del sistema (Instagram, WhatsApp…); si se compartió, la base paga el premio una
 * vez por logro. Es una vista, no un Modal: se puede montar dentro de otro Modal (p. ej. el ascenso
 * de rango) sin apilar modales. Para usarla sola, `ShareAchievementModal`.
 */
export function ShareAchievementView({
  achievement,
  title,
  onClose,
}: {
  achievement: ShareAchievement;
  /** Título en lugar de «¡Contale a tus amigos!» (p. ej. «¡Terminaste A1!»). */
  title?: string;
  onClose: () => void;
}) {
  const t = useStrings(shareStrings);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const profile = useMyProfile().data?.profile;
  const code = useReferralStatus().data?.code ?? null;
  const claim = useClaimShareReward();
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const [settled, setSettled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    let alive = true;
    void wasShareClaimed(achievement).then((done) => alive && setClaimed(done));
    return () => {
      alive = false;
    };
  }, [achievement]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    playSound('complete');
  }, []);

  const onSettled = useCallback(() => setSettled(true), []);

  // La tarjeta se achica en pantallas chicas; la foto sale siempre en su tamaño de diseño.
  const scale = Math.min(
    1,
    (width - 48) / CARD_WIDTH,
    (height - insets.top - insets.bottom - 230) / CARD_HEIGHT,
  );

  const share = async () => {
    if (busy || !cardRef.current) return;
    setBusy(true);
    setError(false);
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
      let shared: boolean;
      if (Platform.OS === 'ios') {
        // iOS: imagen + texto con el enlace; avisa si se canceló.
        const result = await Share.share({ url: uri, message: t.shareMessage(code) });
        shared = result.action === Share.sharedAction;
      } else {
        // Android no confirma si se compartió: cerrar la hoja cuenta.
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t.shareDialogTitle });
        shared = true;
      }
      if (shared) {
        await claim(achievement);
        setClaimed(true);
        onClose();
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <Animated.View entering={FadeIn.duration(250)} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#1A0B3DF7', '#0B0618FA']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={{ width: CARD_WIDTH * scale, height: CARD_HEIGHT * scale }}>
        <FlipIn scale={scale} reduceMotion={reduceMotion}>
          {/* Sólo esto sale en la foto: el brillo va por encima, afuera de la captura. */}
          <View ref={cardRef} collapsable={false}>
            <ShareCard
              achievement={achievement}
              username={profile?.username ?? null}
              code={code}
              avatarId={profile?.avatar_id}
              onSettled={onSettled}
            />
          </View>
          {!reduceMotion ? <Shine /> : null}
        </FlipIn>
      </View>

      <Animated.View
        entering={reduceMotion ? undefined : FadeInUp.delay(900).duration(350)}
        style={styles.actions}
      >
        <Text style={styles.title}>{title ?? t.shareTitle}</Text>
        <Text style={styles.body}>
          {error ? t.shareError : claimed ? t.shareBodyDone : t.shareBody(SHARE_REWARD_POLYS)}
        </Text>
        {canShareImages ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !settled || busy, busy }}
            disabled={!settled || busy}
            onPress={() => void share()}
            style={({ pressed }) => [
              styles.button,
              (!settled || busy) && styles.buttonWaiting,
              pressed && styles.pressed,
            ]}
          >
            {busy ? (
              <ActivityIndicator color="#1A1033" />
            ) : (
              <>
                <Share2 color="#1A1033" size={20} strokeWidth={2.6} />
                <Text style={styles.buttonText}>
                  {claimed ? t.shareButtonDone : t.shareButton(SHARE_REWARD_POLYS)}
                </Text>
                {claimed ? null : <PolyCoin size={22} />}
              </>
            )}
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          hitSlop={8}
          style={({ pressed }) => [styles.later, pressed && styles.pressed]}
        >
          <Text style={styles.laterText}>{t.notNow}</Text>
        </Pressable>
      </Animated.View>

      {!reduceMotion ? <Confetti pieces={50} /> : null}
    </View>
  );
}

/** La tarjeta usada sola, a pantalla completa. */
export function ShareAchievementModal({
  achievement,
  title,
  onClose,
}: {
  achievement: ShareAchievement | null;
  title?: string;
  onClose: () => void;
}) {
  if (!achievement) return null;
  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <ShareAchievementView achievement={achievement} title={title} onClose={onClose} />
    </Modal>
  );
}

/** Entra como una carta que se da vuelta (y se achica si la pantalla es chica). */
function FlipIn({
  scale,
  reduceMotion,
  children,
}: {
  scale: number;
  reduceMotion: boolean;
  children: ReactNode;
}) {
  const turn = useSharedValue(reduceMotion ? 0 : -100);
  const grow = useSharedValue(reduceMotion ? 1 : 0.6);
  useEffect(() => {
    if (reduceMotion) return;
    turn.value = withSpring(0, { damping: 11, stiffness: 90 });
    grow.value = withSpring(1, { damping: 9, stiffness: 110 });
  }, [grow, reduceMotion, turn]);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: (CARD_WIDTH * (scale - 1)) / 2 },
      { translateY: (CARD_HEIGHT * (scale - 1)) / 2 },
      { perspective: 900 },
      { scale: scale * grow.value },
      { rotateY: `${turn.value}deg` },
    ],
  }));
  return <Animated.View style={[styles.flip, style]}>{children}</Animated.View>;
}

/** Brillo que cruza la tarjeta en diagonal cada tanto. */
function Shine() {
  const x = useSharedValue(-1);
  useEffect(() => {
    x.value = withDelay(
      1_200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withDelay(2_200, withTiming(-1, { duration: 0 })),
        ),
        -1,
      ),
    );
  }, [x]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * (CARD_WIDTH + 120) }, { rotate: '20deg' }],
  }));
  return (
    <View pointerEvents="none" style={styles.shineClip}>
      <Animated.View style={[styles.shine, style]}>
        <LinearGradient
          colors={['#FFFFFF00', '#FFFFFF59', '#FFFFFF00']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 24 },
  flip: { width: CARD_WIDTH, height: CARD_HEIGHT },
  shineClip: { ...StyleSheet.absoluteFill, borderRadius: 28, overflow: 'hidden' },
  shine: {
    position: 'absolute',
    top: -80,
    left: CARD_WIDTH / 2 - 40,
    width: 80,
    height: CARD_HEIGHT + 160,
  },
  actions: { alignItems: 'center', gap: 8, alignSelf: 'stretch' },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  body: { color: '#C9BCEB', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  button: {
    marginTop: 6,
    alignSelf: 'stretch',
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: '#FFC83D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    shadowColor: '#FFC83D',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  buttonWaiting: { opacity: 0.6 },
  buttonText: { color: '#1A1033', fontSize: 18, fontWeight: '900' },
  later: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16 },
  laterText: { color: '#B9A9E0', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
});

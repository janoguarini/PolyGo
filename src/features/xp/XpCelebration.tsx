import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Sparkles } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOutUp,
  useReducedMotion,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';
import { playSound } from '@/lib/sounds';

import { nextXpAnnouncement } from './announce';
import { useXp, type XpState } from './api';
import { LevelBadge } from './LevelBadge';
import { LevelProgress } from './LevelProgress';
import { xpPreview } from './previewGate';
import { xpStrings } from './strings';

const TOAST_MS = 2400;

/**
 * Va en el layout raíz (como el aviso de Polys) para verse también sobre lecciones y partidas:
 * «+20 XP» al completar una actividad y, si subiste de nivel, una celebración que hay que cerrar.
 */
export function XpCelebration() {
  const styles = useStyles();
  const t = useStrings(xpStrings);
  const xp = useXp();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [toast, setToast] = useState<{ id: number; total: number; label: string } | null>(null);
  const [levelUp, setLevelUp] = useState<{ level: number; gained: number } | null>(null);
  const counter = useRef(0);

  const data = xp.data;
  const qc = useQueryClient();

  // Cada respuesta nueva de sync_xp (al abrir, tras una lección, un repaso o una partida) decide qué
  // anunciar. Se escucha la caché de consultas: el aviso sale del resultado, no del render.
  useEffect(() => {
    const announce = (state: XpState) => {
      const next = nextXpAnnouncement(state);
      if (!next) return;
      if (next.kind === 'level') {
        // El modal tapa cualquier aviso de +XP que siga visible.
        setLevelUp({ level: next.level, gained: next.gained });
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playSound('complete');
      } else {
        counter.current += 1;
        setToast({ id: counter.current, total: next.total, label: next.label });
      }
    };
    // Modo PREVIEW (sólo desarrollo): lo anuncia el panel de ejemplo, no sync_xp.
    if (xpPreview) return xpPreview.subscribePreviewAnnouncements(announce);
    return qc.getQueryCache().subscribe((event) => {
      if (event.type !== 'updated' || event.action.type !== 'success') return;
      const key = event.query.queryKey;
      if (key[0] !== 'learning' || key[1] !== 'xp') return;
      const state = event.query.state.data as XpState | null | undefined;
      if (state) announce(state);
    });
  }, [qc]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      {toast ? (
        // Debajo del aviso de Polys: pueden llegar juntos (una victoria da las dos cosas).
        <View
          pointerEvents="none"
          style={[styles.toastWrap, { top: insets.top + spacing.sm + 60 }]}
        >
          <Animated.View
            key={toast.id}
            entering={reduceMotion ? undefined : FadeInUp.springify().damping(14)}
            exiting={reduceMotion ? undefined : FadeOutUp.duration(200)}
            style={styles.toast}
            accessible
            accessibilityLiveRegion="polite"
            accessibilityLabel={t.toastA11y(!!data?.preview, toast.total, toast.label)}
          >
            <Sparkles color={colors.primarySoft} size={20} />
            <Text variant="bodyStrong" color="textStrong" style={styles.tabular}>
              +{toast.total} XP
            </Text>
            <Text variant="caption" color="text" numberOfLines={1} style={styles.toastLabel}>
              {toast.label}
            </Text>
          </Animated.View>
        </View>
      ) : null}
      <Modal
        visible={levelUp !== null}
        transparent
        animationType={reduceMotion ? 'none' : 'fade'}
        statusBarTranslucent
        onRequestClose={() => setLevelUp(null)}
      >
        {levelUp ? (
          <View style={styles.overlay}>
            <Animated.View
              entering={reduceMotion ? undefined : FadeIn.duration(250)}
              style={styles.card}
              accessibilityViewIsModal
              accessibilityLiveRegion="assertive"
            >
              <Text variant="overline" color="gold" align="center">
                {t.levelUp(!!data?.preview)}
              </Text>
              <Animated.View entering={reduceMotion ? undefined : ZoomIn.springify().damping(11)}>
                <LevelBadge level={levelUp.level} size={112} />
              </Animated.View>
              <Text variant="display" color="textStrong" align="center">
                {t.level(levelUp.level)}
              </Text>
              {levelUp.gained > 0 ? (
                <Text variant="heading" color="gold" align="center" style={styles.tabular}>
                  +{levelUp.gained} XP
                </Text>
              ) : null}
              <View style={styles.next}>
                <LevelProgress xp={data ?? null} compact />
              </View>
              <Text variant="caption" color="text" align="center">
                {t.levelUpHint}
              </Text>
              <Button label={t.continue} size="lg" onPress={() => setLevelUp(null)} />
            </Animated.View>
          </View>
        ) : null}
      </Modal>
    </>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    tabular: { fontVariant: ['tabular-nums'] },
    toastWrap: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      alignItems: 'center',
      zIndex: 99,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      maxWidth: '100%',
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1.5,
      borderColor: colors.primaryBright,
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 7,
    },
    toastLabel: { flexShrink: 1 },
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 380,
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.xl,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.brandBorder,
    },
    next: { alignSelf: 'stretch' },
  }),
);

import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { polyReasonLabel } from '@shared/polys';

import { PolyCoin, Text, colors, radii, spacing } from '@/design-system';

import { usePolys, type PolyGrant } from './api';

/** Ganancias ya anunciadas en esta sesión (la misma respuesta puede volver del caché). */
const announced = new Set<string>();

const VISIBLE_MS = 2800;

/** Resume varias ganancias en una línea: "Misión completada ×3" o "Recompensas". */
export function grantSummary(grants: PolyGrant[]): { total: number; label: string } {
  const total = grants.reduce((n, g) => n + g.amount, 0);
  const reasons = [...new Set(grants.map((g) => g.reason))];
  const label =
    reasons.length === 1
      ? `${polyReasonLabel(reasons[0]!)}${grants.length > 1 ? ` ×${grants.length}` : ''}`
      : 'Recompensas';
  return { total, label };
}

/**
 * Aviso flotante arriba de todo cuando la base acredita Polys (después de una lección, una
 * partida o al abrir la app). Va en el layout raíz para verse también sobre lecciones y partidas.
 */
export function PolysToast() {
  const polys = usePolys();
  const insets = useSafeAreaInsets();
  const [shown, setShown] = useState<{ id: number; total: number; label: string } | null>(null);
  const counter = useRef(0);

  const granted = polys.data?.granted;
  useEffect(() => {
    const fresh = (granted ?? []).filter((g) => !announced.has(`${g.reason}:${g.ref}`));
    if (fresh.length === 0) return;
    for (const g of fresh) announced.add(`${g.reason}:${g.ref}`);
    counter.current += 1;
    setShown({ id: counter.current, ...grantSummary(fresh) });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [granted]);

  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(null), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [shown]);

  if (!shown) return null;
  return (
    <View pointerEvents="none" style={[styles.wrap, { top: insets.top + spacing.sm }]}>
      <Animated.View
        key={shown.id}
        entering={FadeInUp.springify().damping(14)}
        exiting={FadeOutUp.duration(200)}
        style={styles.toast}
        accessible
        accessibilityLiveRegion="polite"
        accessibilityLabel={`Ganaste ${shown.total} Polys: ${shown.label}`}
      >
        <PolyCoin size={30} />
        <View>
          <Text variant="bodyStrong" color="gold">
            +{shown.total} Polys
          </Text>
          <Text variant="caption" color="text">
            {shown.label}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1.5,
    borderColor: colors.goldStrong,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});

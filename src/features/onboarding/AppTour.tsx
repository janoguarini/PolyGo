import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Mascot, Text, colors, radii, spacing, type MascotPose } from '@/design-system';

interface TourStep {
  route: Href;
  pose: MascotPose;
  /** Dónde va el zorro con su caja: arriba deja ver lo de abajo y al revés. */
  place: 'top' | 'bottom';
  title: string;
  body: string;
}

const STEPS: TourStep[] = [
  {
    route: '/',
    pose: 'pointDown',
    place: 'top',
    title: 'Tu camino de lecciones',
    body: 'Acá abajo están tus lecciones. Tocá la que brilla para empezar; sin errores ganás 3 estrellas y queda dorada.',
  },
  {
    route: '/practice',
    pose: 'thinking',
    place: 'top',
    title: 'Repaso',
    body: '¿Se te olvidó alguna palabra? Acá repasás lo que ya aprendiste y ves tu palabra del día.',
  },
  {
    route: '/ranked',
    pose: 'pointUp',
    place: 'bottom',
    title: 'Ranked',
    body: 'Enfrentá a otros jugadores en partidas rápidas, ganá ELO y subí de rango hasta la cima.',
  },
  {
    route: '/',
    pose: 'wave',
    place: 'bottom',
    title: '¡Todo listo!',
    body: 'Ya conocés Polygo. Hacé tu primera lección y arrancá tu racha.',
  },
];

/** Alto aproximado de la barra de pestañas (sin la safe area). */
const TAB_BAR = 56;

/**
 * Tutorial sobre las pantallas reales: oscurece la app (que se sigue viendo detrás), muestra al
 * zorro a la izquierda con una caja de texto y va cambiando de pestaña en cada paso.
 * Bloquea los toques a la app mientras está abierto.
 */
export function AppTour({
  onFinish,
  navigate = (route) => router.navigate(route),
}: {
  onFinish: () => void;
  /** Para mostrar el tutorial sin navegar (vista previa). */
  navigate?: (route: Href) => void;
}) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const step = STEPS[index]!;
  const isLast = index === STEPS.length - 1;

  useEffect(() => {
    navigate(step.route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const placement =
    step.place === 'top'
      ? { top: insets.top + 120 }
      : { bottom: insets.bottom + TAB_BAR + spacing.lg };

  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <View style={[styles.row, placement]}>
        <Mascot pose={step.pose} height={170} />
        <Animated.View key={index} entering={FadeIn.duration(200)} style={styles.bubble}>
          <View style={styles.tail} />
          <Text variant="overline" color="primarySoft">
            {index + 1} DE {STEPS.length}
          </Text>
          <Text variant="heading">{step.title}</Text>
          <Text color="text">{step.body}</Text>
          <View style={styles.actions}>
            {isLast ? null : (
              <Pressable
                accessibilityRole="button"
                onPress={onFinish}
                hitSlop={12}
                style={styles.skip}
              >
                <Text variant="caption" color="textMuted">
                  Saltar
                </Text>
              </Pressable>
            )}
            <View style={styles.flex}>
              <Button
                label={isLast ? '¡A jugar!' : 'Siguiente'}
                onPress={() => (isLast ? onFinish() : setIndex((i) => i + 1))}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(7, 6, 15, 0.62)',
    zIndex: 100,
  },
  row: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: 560,
  },
  bubble: {
    flex: 1,
    gap: spacing.xs,
    marginLeft: -spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.primaryBright,
    backgroundColor: colors.surfaceRaised,
  },
  // Piquito de la caja apuntando al zorro.
  tail: {
    position: 'absolute',
    left: -9,
    bottom: 28,
    width: 16,
    height: 16,
    backgroundColor: colors.surfaceRaised,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primaryBright,
    transform: [{ rotate: '45deg' }],
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  skip: { paddingHorizontal: spacing.xs },
  flex: { flex: 1 },
});

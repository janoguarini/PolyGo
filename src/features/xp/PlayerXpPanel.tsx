import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { ProgressBar, Text, spacing, themedStyles } from '@/design-system';
import { useLocale, useStrings } from '@/i18n';

import type { XpState } from './api';
import { LevelBadge } from './LevelBadge';
import { xpStrings } from './strings';
import { XP_BAR_COLORS } from './LevelProgress';

/**
 * Bloque de nivel y XP dentro de la tarjeta del jugador (perfil propio): a la izquierda el distintivo
 * del nivel con la etiqueta NIVEL; a la derecha «Experiencia», XP del nivel, la barra a todo el ancho y
 * lo que falta. Sólo presentación: los mismos datos y reglas que `LevelProgress` (mismo `XpState`,
 * misma condición para el «+XP» recién ganado y la misma etiqueta PREVIEW en el modo de QA).
 * Va siempre sobre el fondo del perfil (oscuro): colores claros fijos en ambos temas.
 * `xp` undefined = cargando (reserva el alto); null = el servidor todavía no tiene XP: no se muestra.
 */
export function PlayerXpPanel({ xp }: { xp: XpState | null | undefined }) {
  const styles = useStyles();
  const reduceMotion = useReducedMotion();
  const t = useStrings(xpStrings);
  const nf = new Intl.NumberFormat(useLocale());
  if (xp === null) return null;
  if (xp === undefined) return <View style={styles.placeholder} />;
  const maxed = xp.need === 0;
  const ratio = maxed ? 1 : xp.into / xp.need;
  const gained = !xp.initial && xp.granted_total > 0 ? xp.granted_total : 0;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={
        maxed ? t.levelMaxA11y(xp.level) : t.levelA11y(xp.level, xp.into, xp.need, xp.remaining)
      }
    >
      <View style={styles.levelCol}>
        <LevelBadge level={xp.level} size={50} />
        <Text variant="caption" style={styles.levelLabel} numberOfLines={1}>
          {t.levelCaps}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="caption" style={styles.title} numberOfLines={1}>
            {t.experience}
          </Text>
          {xp.preview ? (
            <View style={styles.previewTag} accessibilityLabel={t.sampleData}>
              <Text variant="caption" style={styles.previewText}>
                PREVIEW
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.numbersRow}>
          <Text variant="heading" style={[styles.numbers, styles.tabular]} numberOfLines={1}>
            {maxed
              ? `${nf.format(xp.total)} XP`
              : `${nf.format(xp.into)} / ${nf.format(xp.need)} XP`}
          </Text>
          {gained ? (
            <Animated.View
              // Una ganancia nueva vuelve a animar la entrada.
              key={`${xp.total}`}
              entering={reduceMotion ? undefined : ZoomIn.springify().damping(12)}
              style={styles.gain}
            >
              <Text variant="caption" style={styles.gainText}>
                +{nf.format(gained)} XP
              </Text>
            </Animated.View>
          ) : null}
        </View>
        <ProgressBar key={xp.level} value={ratio} height={10} colors={XP_BAR_COLORS} />
        <Text variant="caption" style={styles.soft} numberOfLines={1}>
          {maxed ? t.maxReached : t.remaining(nf.format(xp.remaining), xp.level + 1)}
        </Text>
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    levelCol: { alignItems: 'center', gap: spacing.xxs },
    levelLabel: { color: '#FDE68A', fontWeight: '900', letterSpacing: 1.5, fontSize: 11 },
    body: { flex: 1, minWidth: 0, gap: spacing.xxs + 1 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    title: {
      flexShrink: 1,
      color: '#C4B5FD',
      fontWeight: '800',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    // XP actual / necesario: el dato principal del bloque. Si no entra junto al «+XP», el chip baja.
    numbersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      columnGap: spacing.sm,
      rowGap: spacing.xxs,
    },
    numbers: { color: '#FFFFFF', flexShrink: 1, fontSize: 17, lineHeight: 22 },
    tabular: { fontVariant: ['tabular-nums'] },
    soft: { color: '#DDD6FE' },
    gain: {
      paddingHorizontal: spacing.xs + 2,
      borderRadius: 999,
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(251, 191, 36, 0.75)',
    },
    gainText: { color: '#FDE68A', fontWeight: '800', fontVariant: ['tabular-nums'] },
    // Naranja sólido con texto oscuro, como en `LevelProgress`.
    previewTag: {
      paddingHorizontal: spacing.xs + 2,
      borderRadius: 999,
      backgroundColor: '#FB923C',
    },
    previewText: { color: '#1C0A00', fontWeight: '900', letterSpacing: 0.5 },
    placeholder: { height: 70 },
  }),
);

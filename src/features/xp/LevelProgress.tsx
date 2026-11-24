import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { ProgressBar, Text, spacing, themedStyles } from '@/design-system';
import { useLocale, useStrings } from '@/i18n';

import type { XpState } from './api';
import { LevelBadge } from './LevelBadge';
import { xpStrings } from './strings';

/** Degradé de la barra de XP: dorado → violeta (el nivel es dorado; la marca, violeta). */
export const XP_BAR_COLORS = ['#FBBF24', '#F472B6', '#A78BFA'] as const;

/**
 * Nivel global y barra de XP: «Nivel 12 · 340 / 520 XP · Faltan 180 XP para el nivel 13».
 * `xp` undefined = cargando (reserva el alto para que la tarjeta no salte); null = el servidor
 * todavía no tiene XP (migración sin aplicar): no se muestra nada.
 * Después de ganar XP muestra «+20 XP» junto a los números hasta la próxima sincronización, y la barra
 * se llena hasta el valor nuevo (al subir de nivel se rearma y se llena desde cero, no retrocede).
 */
export function LevelProgress({
  xp,
  compact,
  onDark,
}: {
  xp: XpState | null | undefined;
  compact?: boolean;
  /** Sobre el fondo del perfil (siempre oscuro): colores claros fijos en ambos temas. */
  onDark?: boolean;
}) {
  const styles = useStyles();
  const reduceMotion = useReducedMotion();
  const t = useStrings(xpStrings);
  const nf = new Intl.NumberFormat(useLocale());
  if (xp === null) return null;
  if (xp === undefined)
    return <View style={compact ? styles.placeholderCompact : styles.placeholder} />;
  const maxed = xp.need === 0;
  const ratio = maxed ? 1 : xp.into / xp.need;
  // Sólo sobre fondo oscuro (la tarjeta del jugador): el dorado claro no se lee en tema claro.
  const gained = onDark && !compact && !xp.initial && xp.granted_total > 0 ? xp.granted_total : 0;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={
        maxed ? t.levelMaxA11y(xp.level) : t.levelA11y(xp.level, xp.into, xp.need, xp.remaining)
      }
    >
      <LevelBadge level={xp.level} size={compact ? 36 : 42} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text
            variant="bodyStrong"
            color="textStrong"
            numberOfLines={1}
            style={[styles.flex, onDark && styles.strong]}
          >
            {t.level(xp.level)}
          </Text>
          {xp.preview ? (
            <View style={styles.previewTag} accessibilityLabel={t.sampleData}>
              <Text variant="caption" style={styles.previewText}>
                PREVIEW
              </Text>
            </View>
          ) : null}
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
          <Text
            variant="caption"
            color="textStrong"
            style={[styles.tabular, onDark && styles.strong]}
            numberOfLines={1}
          >
            {maxed
              ? `${nf.format(xp.total)} XP`
              : `${nf.format(xp.into)} / ${nf.format(xp.need)} XP`}
          </Text>
        </View>
        <ProgressBar key={xp.level} value={ratio} height={compact ? 7 : 9} colors={XP_BAR_COLORS} />
        {compact ? null : (
          <Text variant="caption" color="text" numberOfLines={1} style={onDark && styles.soft}>
            {maxed ? t.maxReached : t.remaining(nf.format(xp.remaining), xp.level + 1)}
          </Text>
        )}
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    body: { flex: 1, gap: spacing.xxs + 1 },
    top: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
    flex: { flex: 1 },
    tabular: { fontVariant: ['tabular-nums'] },
    strong: { color: '#FFFFFF' },
    soft: { color: '#DDD6FE' },
    gain: {
      paddingHorizontal: spacing.xs + 2,
      borderRadius: 999,
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(251, 191, 36, 0.75)',
    },
    // Dorado claro: se usa sobre fondos oscuros (tarjeta del jugador y modal).
    gainText: { color: '#FDE68A', fontWeight: '800', fontVariant: ['tabular-nums'] },
    // Naranja sólido con texto oscuro: se lee sobre la tarjeta oscura y en el modal.
    previewTag: {
      paddingHorizontal: spacing.xs + 2,
      borderRadius: 999,
      backgroundColor: '#FB923C',
    },
    previewText: { color: '#1C0A00', fontWeight: '900', letterSpacing: 0.5 },
    placeholder: { height: 50 },
    placeholderCompact: { height: 36 },
  }),
);

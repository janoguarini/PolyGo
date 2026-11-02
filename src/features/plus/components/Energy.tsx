import { router } from 'expo-router';
import { ChevronRight, CloudOff, Infinity as InfinityIcon, Zap } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { ENERGY, formatEnergyWait, type EnergyView } from '@shared/energy';

import { Button, Card, Text, colors, radii, spacing } from '@/design-system';

import { useEnergy } from '../api';
import { PlusBadge } from './PlusBadge';

const REGEN_HOURS = ENERGY.regenSeconds / 3600;

/** Texto de estado: «Llena», «Próxima en 2 h 10 min». */
export function energyStatusText(view: EnergyView): string {
  if (view.plus) return 'Ilimitada con PolyGo Plus';
  if (view.msToNext === null) return 'Energía llena';
  const next = `Próxima en ${formatEnergyWait(view.msToNext)}`;
  return view.energy === 0 ? `Sin energía · ${next}` : next;
}

export function energyA11yLabel(view: EnergyView): string {
  if (view.plus) return 'Energía ilimitada con PolyGo Plus';
  return `Energía ${view.energy} de ${view.max}. ${energyStatusText(view)}`;
}

/** Chip de energía del encabezado de Aprender. Al tocarlo abre/cierra la explicación. */
export function EnergyChip({ open, onPress }: { open: boolean; onPress: () => void }) {
  const { view, isError } = useEnergy();
  const empty = view && !view.plus && view.energy === 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={view ? energyA11yLabel(view) : 'Energía'}
      accessibilityHint={open ? 'Oculta los detalles' : 'Muestra cómo funciona la energía'}
      accessibilityState={{ expanded: open }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        empty && styles.chipEmpty,
        open && styles.chipOpen,
        pressed && styles.pressed,
      ]}
    >
      <Zap
        color={empty ? colors.textSubtle : colors.info}
        fill={empty ? 'transparent' : colors.info}
        size={18}
      />
      {view?.plus ? (
        <InfinityIcon color={colors.info} size={18} />
      ) : (
        <Text variant="bodyStrong" color={empty ? 'textMuted' : 'info'} style={styles.amount}>
          {view ? view.energy : isError ? '!' : '–'}
        </Text>
      )}
    </Pressable>
  );
}

/** Barra de unidades (5 segmentos). */
function EnergyPips({ view }: { view: EnergyView }) {
  return (
    <View style={styles.pips} importantForAccessibility="no-hide-descendants">
      {Array.from({ length: view.max }, (_, i) => (
        <View key={i} style={[styles.pip, i < view.energy && styles.pipOn]} />
      ))}
    </View>
  );
}

/**
 * Explicación de la energía: cuánta hay, cuándo vuelve y qué no la usa. Con 0 lo dice claro y
 * sugiere qué hacer mientras tanto; el link a Plus es discreto.
 */
export function EnergyPanel({ compact = false }: { compact?: boolean }) {
  const { view, isPending, isError, isStale, refetch } = useEnergy();

  if (isPending) {
    return (
      <Card style={styles.panel}>
        <Text color="textMuted">Cargando tu energía…</Text>
      </Card>
    );
  }
  if (isError || !view) {
    return (
      <Card style={styles.panel}>
        <View style={styles.row}>
          <CloudOff color={colors.danger} size={20} />
          <Text variant="bodyStrong" color="danger" style={styles.flex}>
            No pudimos leer tu energía
          </Text>
        </View>
        <Text variant="caption">
          Podés seguir usando Polygo: al guardar una lección el servidor la verifica igual.
        </Text>
        <Button label="Reintentar" variant="secondary" onPress={refetch} />
      </Card>
    );
  }

  return (
    <Card style={styles.panel}>
      <View style={styles.row} accessible accessibilityLabel={energyA11yLabel(view)}>
        <Zap color={colors.info} fill={colors.info} size={22} />
        <View style={styles.flex}>
          <Text variant="heading">
            {view.plus ? 'Energía ilimitada' : `Energía ${view.energy} de ${view.max}`}
          </Text>
          <Text variant="caption" color={view.energy === 0 && !view.plus ? 'streak' : 'textMuted'}>
            {energyStatusText(view)}
          </Text>
        </View>
        {view.plus ? <PlusBadge /> : null}
      </View>
      {view.plus ? null : <EnergyPips view={view} />}
      {isStale ? (
        <View style={styles.row}>
          <CloudOff color={colors.textMuted} size={16} />
          <Text variant="caption" style={styles.flex}>
            Sin conexión: puede no estar al día.
          </Text>
        </View>
      ) : null}
      {compact ? null : (
        <Text variant="caption">
          {view.plus
            ? 'Completá todas las lecciones que quieras.'
            : `Completar una lección usa ${ENERGY.lessonCost}. Equivocarte, entrar o salir de una lección no gasta nada. Recuperás 1 cada ${REGEN_HOURS} horas hasta ${ENERGY.max}. Ranked, el repaso y Amigos nunca usan energía.`}
        </Text>
      )}
      {view.plus ? null : (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Conocé PolyGo Plus: energía ilimitada"
          onPress={() => router.push('/plus')}
          hitSlop={8}
          style={({ pressed }) => [styles.plusLink, pressed && styles.pressed]}
        >
          <Text variant="caption" color="primarySoft" style={styles.flex}>
            ¿No querés esperar? Conocé PolyGo Plus
          </Text>
          <ChevronRight color={colors.primarySoft} size={16} />
        </Pressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipEmpty: { borderColor: colors.borderStrong },
  chipOpen: { borderColor: colors.info },
  amount: { fontVariant: ['tabular-nums'] },
  pressed: { opacity: 0.75 },
  panel: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  pips: { flexDirection: 'row', gap: spacing.xs },
  pip: {
    flex: 1,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceHighlight,
  },
  pipOn: { backgroundColor: colors.info },
  plusLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minHeight: 32 },
});

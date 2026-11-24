import { FlaskConical } from 'lucide-react-native';
import { useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { totalXpForLevel, xpForNextLevel, xpProgress, type XpSource } from '@shared/xp';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';

import { resetXpAnnouncements } from './announce';
import type { XpGrant, XpQuery, XpState } from './api';

/**
 * Modo PREVIEW de XP: datos FICTICIOS en memoria para la QA visual en un build de desarrollo.
 * Sólo se carga a través de ./previewGate (nunca importar este archivo directamente).
 *
 * - No llama a Supabase ni a ninguna RPC: no importa el cliente ni pendingRpc.
 * - No toca el XP real del usuario ni ningún dato de producción.
 * - Todo lo que produce lleva `preview: true` y la interfaz lo marca como PREVIEW.
 * - Se pierde al recargar la app (no se guarda en ningún lado).
 */

export const PREVIEW_SCENARIOS = [
  { id: 'low', label: 'Nivel 12', detail: 'progreso bajo', level: 12, ratio: 0.15 },
  { id: 'advanced', label: 'Nivel 32', detail: 'avanzado', level: 32, ratio: 0.7 },
  { id: 'near', label: 'Nivel 50', detail: 'por subir', level: 50, ratio: 0.95 },
] as const;

export type PreviewScenarioId = (typeof PREVIEW_SCENARIOS)[number]['id'];

/** XP total de un escenario: inicio del nivel + la fracción pedida de lo que pide ese nivel. */
export function scenarioTotal(level: number, ratio: number): number {
  return totalXpForLevel(level) + Math.floor(xpForNextLevel(level) * ratio);
}

/** Estado con la misma forma que devuelve sync_xp, calculado con la curva real (shared/xp.ts). */
export function previewState(total: number, levelBefore: number, granted: XpGrant[]): XpState {
  const p = xpProgress(total);
  return {
    total: p.total,
    level: p.level,
    into: p.into,
    need: p.need,
    remaining: p.remaining,
    level_before: levelBefore,
    initial: false,
    granted,
    granted_total: granted.reduce((n, g) => n + g.amount, 0),
    preview: true,
  };
}

function scenarioState(id: PreviewScenarioId): XpState {
  const s = PREVIEW_SCENARIOS.find((x) => x.id === id)!;
  const total = scenarioTotal(s.level, s.ratio);
  return previewState(total, xpProgress(total).level, []);
}

let current: XpState = scenarioState('low');
let currentScenario: PreviewScenarioId = 'low';
let grants = 0;
const stateListeners = new Set<() => void>();
const announceListeners = new Set<(state: XpState) => void>();

function publish(state: XpState, announce: boolean) {
  current = state;
  for (const l of stateListeners) l();
  if (announce) for (const l of announceListeners) l(state);
}

/** Estado actual (para tests). */
export function previewSnapshot(): XpState {
  return current;
}

export function previewScenario(): PreviewScenarioId {
  return currentScenario;
}

/** Cambia de escenario sin celebrar (es un salto de la QA, no XP ganado). */
export function selectPreviewScenario(id: PreviewScenarioId) {
  currentScenario = id;
  // Permite volver a celebrar el mismo nivel después de cambiar de escenario.
  resetXpAnnouncements();
  publish(scenarioState(id), false);
}

/** Simula ganar XP: aviso «+N XP» o, si alcanza, la subida de nivel. */
export function gainPreviewXp(amount = 20, source: XpSource = 'lesson_first') {
  grants += 1;
  const before = current;
  publish(
    previewState(before.total + amount, before.level, [
      { source, ref: `preview-${grants}`, amount },
    ]),
    true,
  );
}

/** Simula lo justo para subir un nivel (+10 XP de sobra) y muestra la celebración. */
export function levelUpPreview() {
  gainPreviewXp(current.remaining + 10, 'ranked_win');
}

/** La celebración escucha acá en vez de la caché de sync_xp. */
export function subscribePreviewAnnouncements(listener: (state: XpState) => void): () => void {
  announceListeners.add(listener);
  return () => announceListeners.delete(listener);
}

function subscribeState(listener: () => void): () => void {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
}

/** Reemplaza a la consulta de sync_xp mientras el modo está activo: nunca toca la red. */
export function usePreviewXpQuery(): XpQuery {
  const data = useSyncExternalStore(subscribeState, previewSnapshot, previewSnapshot);
  return { data, isError: false, refetch: () => Promise.resolve(data) };
}

/**
 * Panel de la QA en el perfil: elegir escenario, ganar XP y subir de nivel. Va sólo con PREVIEW activo
 * y deja claro que los datos son de ejemplo.
 */
export function XpPreviewPanel() {
  const styles = useStyles();
  const scenario = useSyncExternalStore(subscribeState, previewScenario, previewScenario);
  return (
    <View style={styles.panel} accessibilityLabel="Panel de vista previa de XP, datos de ejemplo">
      <View style={styles.head}>
        <FlaskConical color={colors.streak} size={18} />
        <Text variant="bodyStrong" color="streak" style={styles.flex}>
          PREVIEW · XP de ejemplo
        </Text>
      </View>
      <Text variant="caption" color="text">
        Sólo en desarrollo. No se guarda ni se envía nada; guardar el perfil, comprar y cambiar de
        idioma están deshabilitados.
      </Text>
      <View style={styles.row}>
        {PREVIEW_SCENARIOS.map((s) => {
          const active = s.id === scenario;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Escenario ${s.label}, ${s.detail}`}
              onPress={() => selectPreviewScenario(s.id)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                variant="caption"
                color={active ? 'onPrimary' : 'textStrong'}
                style={styles.bold}
              >
                {s.label}
              </Text>
              <Text variant="caption" color={active ? 'onPrimary' : 'text'} numberOfLines={1}>
                {s.detail}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          onPress={() => gainPreviewXp(20)}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text variant="caption" color="textStrong" style={styles.bold}>
            +20 XP
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={levelUpPreview}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text variant="caption" color="textStrong" style={styles.bold}>
            Subir de nivel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    panel: {
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.streak,
      backgroundColor: colors.surface,
    },
    head: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    flex: { flex: 1 },
    bold: { fontWeight: '800' },
    row: { flexDirection: 'row', gap: spacing.xs },
    chip: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surfaceRaised,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primaryBright },
    action: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.brandBorder,
      backgroundColor: colors.inset,
    },
    pressed: { opacity: 0.75 },
  }),
);

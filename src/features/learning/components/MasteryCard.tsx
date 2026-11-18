import { StyleSheet, View } from 'react-native';

import { Card, ProgressBar, Text, spacing } from '@/design-system';

import type { LearningMastery, MasteryCounts } from '../api';

/**
 * Dominio estimado por el Mastery Engine (ADAPTIVE_LEARNING_DESIGN 14, AL12). Sólo se muestra con datos
 * del motor (`available`). Cada unidad está en un único estado y se distingue la ausencia de evidencia
 * («Sin evidencia», «Evidencia insuficiente») del rendimiento bajo («Punto débil»).
 */

const STATES: { key: keyof MasteryCounts; label: string; hint: string }[] = [
  { key: 'mastered', label: 'Dominadas', hint: 'demostradas sin ayuda en el nivel objetivo' },
  { key: 'in_progress', label: 'En progreso', hint: 'con evidencia suficiente' },
  { key: 'weak', label: 'Puntos débiles', hint: 'rendimiento bajo' },
  { key: 'insufficient', label: 'Evidencia insuficiente', hint: 'todavía no alcanza para estimar' },
  { key: 'no_evidence', label: 'Sin evidencia', hint: 'vistas, sin respuestas que cuenten' },
];

const DIMENSIONS: Record<string, string> = {
  vocabulary: 'Vocabulario',
  production: 'Producción',
  grammar: 'Gramática',
  comprehension: 'Comprensión',
};

export function totalCounts(m: LearningMastery): MasteryCounts {
  const out: MasteryCounts = {
    no_evidence: 0,
    insufficient: 0,
    weak: 0,
    in_progress: 0,
    mastered: 0,
  };
  for (const c of Object.values(m.dimensions ?? {})) {
    for (const s of STATES) out[s.key] += c[s.key] ?? 0;
  }
  return out;
}

const pct = (x: number) => `${Math.round(x * 100)} %`;

export function MasteryCard({ mastery }: { mastery: LearningMastery }) {
  if (!mastery.available) return null;
  const dims = Object.entries(mastery.dimensions ?? {});
  const units = (mastery.units ?? []).filter((u) => u.total - u.not_seen > 0);
  const total = totalCounts(mastery);
  const any = STATES.some((s) => total[s.key] > 0);

  return (
    <Card style={styles.gap} accessibilityLabel="Dominio estimado">
      <Text variant="overline">DOMINIO</Text>
      {!any ? (
        <Text color="textMuted">
          Todavía no hay evidencia para estimar tu dominio. Completá lecciones y repasos.
        </Text>
      ) : (
        dims.map(([dim, counts]) => (
          <View key={dim} style={styles.gap}>
            {dims.length > 1 ? <Text variant="bodyStrong">{DIMENSIONS[dim] ?? dim}</Text> : null}
            {STATES.filter((s) => counts[s.key] > 0).map((s) => (
              <View key={s.key} style={styles.row}>
                <View style={styles.flex}>
                  <Text>{s.label}</Text>
                  <Text variant="caption">{s.hint}</Text>
                </View>
                <Text variant="bodyStrong">{counts[s.key]}</Text>
              </View>
            ))}
          </View>
        ))
      )}
      {mastery.retention && mastery.retention.units > 0 && mastery.retention.mean !== null ? (
        <Text variant="caption">
          Retención estimada: {pct(mastery.retention.mean)} (sobre {mastery.retention.units} con
          repasos espaciados suficientes).
        </Text>
      ) : null}
      {mastery.speed && mastery.speed.units > 0 && mastery.speed.median !== null ? (
        <Text variant="caption">
          Velocidad de recuperación: respondés en {pct(mastery.speed.median)} del tiempo recomendado
          (mediana de {mastery.speed.units}).
        </Text>
      ) : null}
      {mastery.pending_recompute ? (
        <Text variant="caption">Algunas estimaciones se están actualizando.</Text>
      ) : null}

      {units.length > 0 ? (
        <View style={styles.gap}>
          <Text variant="overline">PROGRESO POR UNIDAD</Text>
          {units.map((u) => (
            <View key={u.unit_id} style={styles.unit}>
              <View style={styles.row}>
                <Text variant="bodyStrong" style={styles.flex}>
                  {u.title}
                </Text>
                <Text variant="caption">
                  {u.mastered} / {u.total} dominadas
                  {u.weak > 0 ? ` · ${u.weak} débiles` : ''}
                </Text>
              </View>
              <ProgressBar
                value={u.total ? u.mastered / u.total : 0}
                accessibilityLabel={`Dominadas en ${u.title}`}
              />
            </View>
          ))}
        </View>
      ) : null}

      {mastery.weak && mastery.weak.length > 0 ? (
        <View style={styles.gap}>
          <Text variant="overline">PARA REFORZAR</Text>
          {mastery.weak.map((w) => (
            <Text key={`${w.concept_id}|${w.dimension}`}>
              <Text variant="bodyStrong" color="textStrong">
                {w.text ?? w.concept_id}
              </Text>
              {w.translation ? ` · ${w.translation}` : ''}
              {w.dimension !== 'vocabulary' ? (
                <Text variant="caption"> ({DIMENSIONS[w.dimension] ?? w.dimension})</Text>
              ) : null}
            </Text>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  unit: { gap: spacing.xs },
});

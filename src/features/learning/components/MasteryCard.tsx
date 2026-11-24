import { StyleSheet, View } from 'react-native';

import { Card, ProgressBar, Text, spacing } from '@/design-system';
import { useStrings } from '@/i18n';

import type { LearningMastery, MasteryCounts } from '../api';
import { masteryStrings } from '../strings';

/**
 * Dominio estimado por el Mastery Engine (ADAPTIVE_LEARNING_DESIGN 14, AL12). Sólo se muestra con datos
 * del motor (`available`). Cada unidad está en un único estado y se distingue la ausencia de evidencia
 * («Sin evidencia», «Evidencia insuficiente») del rendimiento bajo («Punto débil»).
 */

/** Estados en el orden en que se muestran (los textos, en masteryStrings). */
const STATES: { key: keyof MasteryCounts }[] = [
  { key: 'mastered' },
  { key: 'in_progress' },
  { key: 'weak' },
  { key: 'insufficient' },
  { key: 'no_evidence' },
];

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
  const t = useStrings(masteryStrings);
  if (!mastery.available) return null;
  const dims = Object.entries(mastery.dimensions ?? {});
  const units = (mastery.units ?? []).filter((u) => u.total - u.not_seen > 0);
  const total = totalCounts(mastery);
  const any = STATES.some((s) => total[s.key] > 0);

  return (
    <Card style={styles.gap} accessibilityLabel={t.a11y}>
      <Text variant="overline">{t.overline}</Text>
      {!any ? (
        <Text color="textMuted">{t.none}</Text>
      ) : (
        dims.map(([dim, counts]) => (
          <View key={dim} style={styles.gap}>
            {dims.length > 1 ? <Text variant="bodyStrong">{t.dimensions[dim] ?? dim}</Text> : null}
            {STATES.filter((s) => counts[s.key] > 0).map((s) => (
              <View key={s.key} style={styles.row}>
                <View style={styles.flex}>
                  <Text>{t.states[s.key].label}</Text>
                  <Text variant="caption">{t.states[s.key].hint}</Text>
                </View>
                <Text variant="bodyStrong">{counts[s.key]}</Text>
              </View>
            ))}
          </View>
        ))
      )}
      {mastery.retention && mastery.retention.units > 0 && mastery.retention.mean !== null ? (
        <Text variant="caption">
          {t.retention(pct(mastery.retention.mean), mastery.retention.units)}
        </Text>
      ) : null}
      {mastery.speed && mastery.speed.units > 0 && mastery.speed.median !== null ? (
        <Text variant="caption">{t.speed(pct(mastery.speed.median), mastery.speed.units)}</Text>
      ) : null}
      {mastery.pending_recompute ? <Text variant="caption">{t.updating}</Text> : null}

      {units.length > 0 ? (
        <View style={styles.gap}>
          <Text variant="overline">{t.byUnit}</Text>
          {units.map((u) => (
            <View key={u.unit_id} style={styles.unit}>
              <View style={styles.row}>
                <Text variant="bodyStrong" style={styles.flex}>
                  {u.title}
                </Text>
                <Text variant="caption">
                  {t.unitMastered(u.mastered, u.total)}
                  {u.weak > 0 ? t.unitWeak(u.weak) : ''}
                </Text>
              </View>
              <ProgressBar
                value={u.total ? u.mastered / u.total : 0}
                accessibilityLabel={t.masteredIn(u.title)}
              />
            </View>
          ))}
        </View>
      ) : null}

      {mastery.weak && mastery.weak.length > 0 ? (
        <View style={styles.gap}>
          <Text variant="overline">{t.toReinforce}</Text>
          {mastery.weak.map((w) => (
            <Text key={`${w.concept_id}|${w.dimension}`}>
              <Text variant="bodyStrong" color="textStrong">
                {w.text ?? w.concept_id}
              </Text>
              {w.translation ? ` · ${w.translation}` : ''}
              {w.dimension !== 'vocabulary' ? (
                <Text variant="caption"> ({t.dimensions[w.dimension] ?? w.dimension})</Text>
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

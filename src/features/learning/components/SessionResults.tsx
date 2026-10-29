import { CloudOff, RotateCcw, Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import type { Exercise } from '@shared/exercises';

import { Button, Card, Screen, StatTile, Text, colors, spacing } from '@/design-system';
import { AchievementIcon } from '@/features/profile/components/AchievementBadge';
import { toUserMessage } from '@/lib/errors';

import type { WordRow } from '../api';
import type { SessionStats } from '../player';

interface Props {
  title: string;
  stats: SessionStats;
  durationSeconds: number;
  words: Record<string, WordRow>;
  saving: boolean;
  saveError: unknown;
  saved: boolean;
  /** Logros que desbloqueó esta sesión según el servidor. */
  achievements: { id: string; title: string; icon: string }[];
  onRetrySave: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  onExit: () => void;
}

function headline(accuracy: number) {
  if (accuracy === 1) return '¡Perfecto!';
  if (accuracy >= 0.8) return '¡Muy bien!';
  if (accuracy >= 0.5) return 'Buen trabajo';
  return 'Seguí practicando';
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} min ${s} s` : `${s} s`;
}

export function SessionResults(props: Props) {
  const { stats, words } = props;
  const mistakeWords = uniqueWords(stats.mistakes, words);

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          <Button
            label={props.primaryLabel}
            size="lg"
            disabled={!props.saved}
            onPress={props.onPrimary}
          />
          <Button label="Volver" variant="ghost" onPress={props.onExit} />
        </>
      }
    >
      <Animated.View entering={FadeInUp.duration(400)} style={styles.hero}>
        <Trophy color={stats.accuracy >= 0.8 ? colors.gold : colors.primaryBright} size={56} />
        <Text variant="display" align="center">
          {headline(stats.accuracy)}
        </Text>
        <Text color="textMuted" align="center">
          {props.title}
        </Text>
      </Animated.View>

      <View style={styles.grid}>
        <StatTile
          label="Precisión"
          value={`${Math.round(stats.accuracy * 100)}%`}
          hint="en el primer intento"
        />
        <StatTile label="Correctas" value={`${stats.firstTryCorrect}/${stats.total}`} />
        <StatTile label="Tiempo" value={formatDuration(props.durationSeconds)} />
      </View>

      {props.saving ? (
        <Text variant="caption" align="center">
          Guardando tu progreso…
        </Text>
      ) : null}
      {props.saveError ? (
        <Card style={styles.error}>
          <View style={styles.row}>
            <CloudOff color={colors.danger} size={22} />
            <Text variant="bodyStrong" color="danger">
              No se pudo guardar
            </Text>
          </View>
          <Text color="textMuted">
            {toUserMessage(props.saveError)} Tu sesión no se perdió: podés reintentar.
          </Text>
          <Button
            label="Reintentar"
            variant="secondary"
            icon={<RotateCcw color={colors.text} size={18} />}
            onPress={props.onRetrySave}
          />
        </Card>
      ) : null}

      {props.achievements.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Card style={[styles.gap, styles.achievements]} accessibilityLabel="Logros nuevos">
            <Text variant="overline" color="gold">
              {props.achievements.length === 1 ? 'LOGRO DESBLOQUEADO' : 'LOGROS DESBLOQUEADOS'}
            </Text>
            {props.achievements.map((a) => (
              <View key={a.id} style={styles.row}>
                <AchievementIcon icon={a.icon} unlocked size={36} />
                <Text variant="bodyStrong" color="textStrong">
                  {a.title}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      ) : null}

      {mistakeWords.length > 0 ? (
        <Card style={styles.gap}>
          <Text variant="overline">PALABRAS PARA REPASAR</Text>
          {mistakeWords.map((w) => (
            <Text key={w.id}>
              <Text variant="bodyStrong" color="textStrong">
                {w.text}
              </Text>{' '}
              · {w.translation_es}
            </Text>
          ))}
          <Text variant="caption">Van a aparecer en tus repasos para que las fijes.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

function uniqueWords(exercises: Exercise[], words: Record<string, WordRow>): WordRow[] {
  const seen = new Map<string, WordRow>();
  for (const e of exercises) {
    for (const id of e.wordIds) {
      const w = words[id];
      if (w) seen.set(id, w);
    }
  }
  return [...seen.values()];
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  error: { gap: spacing.sm, borderColor: colors.dangerStrong },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  gap: { gap: spacing.sm },
  achievements: { borderColor: colors.goldStrong },
});

import { Star } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { SKILL_LABELS, SKILLS, type Skill } from '@shared/exercises';

import {
  Card,
  ErrorState,
  ProgressBar,
  StatTile,
  Text,
  colors,
  gradients,
  spacing,
} from '@/design-system';

import { useCurriculum, useLearningSummary } from '../hooks';
import { starTotals } from '../path';

function formatMinutes(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

/** Estadísticas educativas reales del perfil. Independientes del rating competitivo. */
export function LearningStats({ level }: { level: string }) {
  const summary = useLearningSummary();
  const curriculum = useCurriculum();
  const stars = curriculum.data ? starTotals(curriculum.data.units) : null;

  if (summary.isError)
    return (
      <ErrorState message="No pudimos cargar tu progreso." onRetry={() => void summary.refetch()} />
    );
  if (!summary.data) return <Text variant="caption">Cargando progreso…</Text>;
  const s = summary.data;

  const skills = SKILLS.map((skill) => {
    const row = s.skills.find((x) => x.skill === skill);
    return { skill, answers: row?.answers ?? 0, correct: row?.correct ?? 0 };
  }).filter((x) => x.answers > 0);

  return (
    <View style={styles.wrapper}>
      <Text variant="caption">Nivel {level} · en curso</Text>
      {stars ? (
        <Card
          gradient={gradients.hero}
          style={styles.stars}
          accessibilityLabel={`${stars.earned} de ${stars.max} estrellas, ${stars.golden} lecciones doradas`}
        >
          <View style={styles.starsRow}>
            <Star color={colors.gold} fill={colors.gold} size={32} />
            <View style={styles.flex}>
              <Text variant="stat">
                {stars.earned}
                <Text variant="heading" color="textMuted">
                  {' '}
                  / {stars.max}
                </Text>
              </Text>
              <Text variant="caption">
                estrellas · {stars.golden}{' '}
                {stars.golden === 1 ? 'lección dorada' : 'lecciones doradas'}
              </Text>
            </View>
          </View>
          <ProgressBar
            value={stars.max ? stars.earned / stars.max : 0}
            colors={gradients.gold}
            accessibilityLabel="Estrellas conseguidas"
          />
          <Text variant="caption">
            Cada lección da hasta 3 estrellas: la tercera, sólo si la hacés sin ningún error.
          </Text>
        </Card>
      ) : null}
      <View style={styles.grid}>
        <StatTile label="Lecciones" value={String(s.lessons_completed)} />
        <StatTile label="Racha" value={`${s.streak_days} d`} />
        <StatTile label="Estudiadas" value={String(s.words_seen)} hint="palabras vistas" />
        <StatTile label="Dominadas" value={String(s.words_mastered)} hint="repasos espaciados" />
        <StatTile label="Para repasar" value={String(s.words_due)} />
        <StatTile label="Tiempo" value={formatMinutes(s.seconds_learning)} />
      </View>

      <Card style={styles.gap}>
        <Text variant="overline">PRECISIÓN POR HABILIDAD</Text>
        {skills.length === 0 ? (
          <Text color="textMuted">Completá una lección para ver tu precisión por habilidad.</Text>
        ) : (
          skills.map(({ skill, answers, correct }) => (
            <View key={skill} style={styles.skill}>
              <View style={styles.skillHeader}>
                <Text variant="bodyStrong">{SKILL_LABELS[skill as Skill]}</Text>
                <Text variant="caption">
                  {Math.round((correct / answers) * 100)}% · {answers} resp.
                </Text>
              </View>
              <ProgressBar
                value={correct / answers}
                accessibilityLabel={`Precisión en ${SKILL_LABELS[skill as Skill]}`}
              />
            </View>
          ))
        )}
        <Text variant="caption">Calculada sobre el primer intento de cada ejercicio.</Text>
      </Card>

      {s.frequent_mistakes.length > 0 ? (
        <Card style={styles.gap}>
          <Text variant="overline">ERRORES FRECUENTES</Text>
          {s.frequent_mistakes.map((m) => (
            <Text key={m.word_id}>
              <Text variant="bodyStrong" color="textStrong">
                {m.text}
              </Text>{' '}
              · {m.translation} <Text variant="caption">({m.incorrect} errores)</Text>
            </Text>
          ))}
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  stars: { gap: spacing.sm },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gap: { gap: spacing.sm },
  skill: { gap: spacing.xs },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between' },
});

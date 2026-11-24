import { Star } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { SKILLS, type Skill } from '@shared/exercises';

import {
  Card,
  ErrorState,
  ProgressBar,
  StatTile,
  Text,
  colors,
  gradients,
  spacing,
  useTheme,
} from '@/design-system';
import { useStrings } from '@/i18n';

import { useCurriculum, useLearningMastery, useLearningSummary } from '../hooks';
import { MasteryCard, totalCounts } from './MasteryCard';
import { starTotals } from '../path';
import { statsStrings } from '../strings';

function formatMinutes(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

/** Estadísticas educativas reales del perfil. Independientes del rating competitivo. */
export function LearningStats({ level }: { level: string }) {
  useTheme();
  const t = useStrings(statsStrings);
  const summary = useLearningSummary();
  // Fase 4: «Dominadas» sólo del motor (AL12) y «Para repasar» del SRS vigente (v2 si está encendido).
  const mastery = useLearningMastery();
  const curriculum = useCurriculum();
  const stars = curriculum.data ? starTotals(curriculum.data.units) : null;

  if (summary.isError)
    return <ErrorState message={t.loadError} onRetry={() => void summary.refetch()} />;
  if (!summary.data) return <Text variant="caption">{t.loading}</Text>;
  const s = summary.data;

  const skills = SKILLS.map((skill) => {
    const row = s.skills.find((x) => x.skill === skill);
    return { skill, answers: row?.answers ?? 0, correct: row?.correct ?? 0 };
  }).filter((x) => x.answers > 0);

  return (
    <View style={styles.wrapper}>
      <Text variant="caption">{t.levelInProgress(level)}</Text>
      {stars ? (
        <Card
          gradient={gradients.hero}
          style={styles.stars}
          accessibilityLabel={t.starsA11y(stars.earned, stars.max, stars.golden)}
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
              <Text variant="caption">{t.starsCaption(stars.golden)}</Text>
            </View>
          </View>
          <ProgressBar
            value={stars.max ? stars.earned / stars.max : 0}
            colors={gradients.gold}
            accessibilityLabel={t.starsProgress}
          />
          <Text variant="caption">{t.starsExplain}</Text>
        </Card>
      ) : null}
      <View style={styles.grid}>
        <StatTile label={t.lessons} value={String(s.lessons_completed)} />
        <StatTile label={t.streak} value={t.streakValue(s.streak_days)} />
        <StatTile label={t.studied} value={String(s.words_seen)} hint={t.wordsSeen} />
        {mastery.data?.available ? (
          <StatTile
            label={t.mastered}
            value={String(totalCounts(mastery.data).mastered)}
            hint={t.byEvidence}
          />
        ) : null}
        <StatTile
          label={t.toReview}
          value={String(mastery.data ? mastery.data.review.due_now : s.words_due)}
        />
        <StatTile label={t.time} value={formatMinutes(s.seconds_learning)} />
      </View>

      {mastery.data ? <MasteryCard mastery={mastery.data} /> : null}

      <Card style={styles.gap}>
        <Text variant="overline">{t.accuracyBySkill}</Text>
        {skills.length === 0 ? (
          <Text color="textMuted">{t.noSkills}</Text>
        ) : (
          skills.map(({ skill, answers, correct }) => (
            <View key={skill} style={styles.skill}>
              <View style={styles.skillHeader}>
                <Text variant="bodyStrong">{t.skills[skill as Skill]}</Text>
                <Text variant="caption">
                  {t.skillAnswers(Math.round((correct / answers) * 100), answers)}
                </Text>
              </View>
              <ProgressBar
                value={correct / answers}
                accessibilityLabel={t.accuracyIn(t.skills[skill as Skill])}
              />
            </View>
          ))
        )}
        <Text variant="caption">{t.firstAttempt}</Text>
      </Card>

      {s.frequent_mistakes.length > 0 ? (
        <Card style={styles.gap}>
          <Text variant="overline">{t.frequentMistakes}</Text>
          {s.frequent_mistakes.map((m) => (
            <Text key={m.word_id}>
              <Text variant="bodyStrong" color="textStrong">
                {m.text}
              </Text>{' '}
              · {m.translation} <Text variant="caption">{t.mistakesCount(m.incorrect)}</Text>
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

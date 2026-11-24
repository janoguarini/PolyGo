import { router } from 'expo-router';
import { BookOpen, ChevronRight, Library } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Text,
  colors,
  spacing,
  useTheme,
} from '@/design-system';
import { useCurriculum, useMyWords } from '@/features/learning/hooks';
import { useEnergy } from '@/features/plus/api';
import { PlusBadge } from '@/features/plus/components/PlusBadge';
import { topicSummaries, type TopicSummary } from '@/features/plus/topicReview';
import { useStrings } from '@/i18n';
import { reviewTopicsStrings } from '@/i18n/screens/review';

/**
 * Repaso por tema (PolyGo Plus): elegís una unidad que ya estudiaste y repasás sólo sus palabras.
 * Se guarda como repaso espaciado y no usa energía.
 */
export default function ReviewTopicsScreen() {
  useTheme();
  const t = useStrings(reviewTopicsStrings);
  const energy = useEnergy();
  const words = useMyWords();
  const curriculum = useCurriculum();
  const [now] = useState(() => Date.now());
  const plus = energy.view?.plus;

  const header = <ScreenHeader title={t.title} onBack={() => router.back()} />;

  if (energy.isPending || (plus && (words.isPending || curriculum.isPending))) {
    return <LoadingState label={t.loading} />;
  }
  if (energy.isError) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        {header}
        <ErrorState message={t.verifyError} onRetry={energy.refetch} />
      </Screen>
    );
  }
  if (!plus) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        {header}
        <EmptyState
          icon={<Library color={colors.primarySoft} size={44} />}
          title={t.plusTitle}
          message={t.plusMessage}
        />
        <Button label={t.discoverPlus} onPress={() => router.replace('/plus')} />
      </Screen>
    );
  }
  if (words.isError || curriculum.isError || !words.data || !curriculum.data) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        {header}
        <ErrorState
          message={t.loadError}
          onRetry={() => {
            void words.refetch();
            void curriculum.refetch();
          }}
        />
      </Screen>
    );
  }

  const topics = topicSummaries(curriculum.data.units, words.data, now);
  if (topics.length === 0) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        {header}
        <EmptyState
          icon={<BookOpen color={colors.textMuted} size={44} />}
          title={t.emptyTitle}
          message={t.emptyMessage}
        />
        <Button label={t.goToPath} onPress={() => router.dismissTo('/')} />
      </Screen>
    );
  }

  const levels = [...new Set(topics.map((topic) => topic.unit.level))];
  return (
    <Screen edges={['top', 'bottom']}>
      {header}
      <View style={styles.intro}>
        <PlusBadge />
        <Text color="textMuted">{t.intro}</Text>
      </View>
      {levels.map((level) => (
        <View key={level} style={styles.group}>
          <Text variant="overline">{t.level(level)}</Text>
          {topics
            .filter((topic) => topic.unit.level === level)
            .map((topic) => (
              <TopicCard key={topic.unit.id} topic={topic} />
            ))}
        </View>
      ))}
    </Screen>
  );
}

function TopicCard({ topic }: { topic: TopicSummary }) {
  useTheme();
  const t = useStrings(reviewTopicsStrings);
  const parts = [t.words(topic.studied)];
  if (topic.due > 0) parts.push(t.due(topic.due));
  if (topic.withMistakes > 0) parts.push(t.withMistakes(topic.withMistakes));
  const caption = parts.join(' · ');
  return (
    <Card
      onPress={() =>
        router.push({ pathname: '/review', params: { mode: 'topic', unit: topic.unit.id } })
      }
      accessibilityLabel={`${topic.unit.title}. ${caption}`}
      style={styles.card}
    >
      <Text style={styles.emoji}>{topic.unit.emoji}</Text>
      <View style={styles.flex}>
        <Text variant="bodyStrong" color="textStrong">
          {topic.unit.title}
        </Text>
        <Text variant="caption" color={topic.due > 0 ? 'primarySoft' : 'textMuted'}>
          {caption}
        </Text>
      </View>
      <ChevronRight color={colors.textMuted} size={20} />
    </Card>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  group: { gap: spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  emoji: { fontSize: 24, lineHeight: 30 },
  flex: { flex: 1, gap: spacing.xxs },
});

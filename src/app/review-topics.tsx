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
} from '@/design-system';
import { useCurriculum, useMyWords } from '@/features/learning/hooks';
import { useEnergy } from '@/features/plus/api';
import { PlusBadge } from '@/features/plus/components/PlusBadge';
import { topicSummaries, type TopicSummary } from '@/features/plus/topicReview';

/**
 * Repaso por tema (PolyGo Plus): elegís una unidad que ya estudiaste y repasás sólo sus palabras.
 * Se guarda como repaso espaciado y no usa energía.
 */
export default function ReviewTopicsScreen() {
  const energy = useEnergy();
  const words = useMyWords();
  const curriculum = useCurriculum();
  const [now] = useState(() => Date.now());
  const plus = energy.view?.plus;

  const header = <ScreenHeader title="Repaso por tema" onBack={() => router.back()} />;

  if (energy.isPending || (plus && (words.isPending || curriculum.isPending))) {
    return <LoadingState label="Buscando tus temas…" />;
  }
  if (energy.isError) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        {header}
        <ErrorState message="No pudimos verificar tu suscripción." onRetry={energy.refetch} />
      </Screen>
    );
  }
  if (!plus) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        {header}
        <EmptyState
          icon={<Library color={colors.primarySoft} size={44} />}
          title="Repaso por tema es de PolyGo Plus"
          message="Elegí una unidad que ya estudiaste y repasá sólo sus palabras, empezando por las que te tocan y las que más te costaron. El repaso espaciado y la práctica libre siguen siendo gratis."
        />
        <Button label="Conocé PolyGo Plus" onPress={() => router.replace('/plus')} />
      </Screen>
    );
  }
  if (words.isError || curriculum.isError || !words.data || !curriculum.data) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        {header}
        <ErrorState
          message="No pudimos cargar tus temas."
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
          title="Todavía no hay temas"
          message="Completá lecciones: cada unidad en la que estudies palabras aparece acá para repasarla."
        />
        <Button label="Ir a mi camino" onPress={() => router.dismissTo('/')} />
      </Screen>
    );
  }

  const levels = [...new Set(topics.map((t) => t.unit.level))];
  return (
    <Screen edges={['top', 'bottom']}>
      {header}
      <View style={styles.intro}>
        <PlusBadge />
        <Text color="textMuted">
          Hasta 15 palabras del tema: primero las que te tocan repasar y las que más te costaron.
          Cuenta para tu repaso espaciado y no usa energía.
        </Text>
      </View>
      {levels.map((level) => (
        <View key={level} style={styles.group}>
          <Text variant="overline">NIVEL {level}</Text>
          {topics
            .filter((t) => t.unit.level === level)
            .map((t) => (
              <TopicCard key={t.unit.id} topic={t} />
            ))}
        </View>
      ))}
    </Screen>
  );
}

function TopicCard({ topic }: { topic: TopicSummary }) {
  const parts = [`${topic.studied} ${topic.studied === 1 ? 'palabra' : 'palabras'}`];
  if (topic.due > 0) parts.push(`${topic.due} para repasar`);
  if (topic.withMistakes > 0) parts.push(`${topic.withMistakes} con errores`);
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

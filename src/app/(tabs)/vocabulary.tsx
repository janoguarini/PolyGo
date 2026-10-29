import { router } from 'expo-router';
import { Layers, Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SRS_CONFIG, WORD_STATUS_LABELS, wordStatus, type WordStatus } from '@shared/srs';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  StatTile,
  Text,
  colors,
  gradients,
  radii,
  spacing,
} from '@/design-system';
import { SpeakButton } from '@/features/learning/components/SpeakButton';
import { useMyWords, useWordOfTheDay } from '@/features/learning/hooks';

const STATUS_COLOR: Record<WordStatus, keyof typeof colors> = {
  new: 'textMuted',
  learning: 'info',
  mastered: 'success',
};

export default function VocabularyScreen() {
  const words = useMyWords();
  const wordOfDay = useWordOfTheDay();
  // Referencia temporal fija por montaje de la pantalla (se actualiza al refrescar).
  const [now, setNow] = useState(() => Date.now());

  if (words.isPending) return <LoadingState />;
  if (words.isError || !words.data) return <ErrorState onRetry={() => void words.refetch()} />;

  const entries = words.data;
  const due = entries.filter((e) => e.nextReviewAt && new Date(e.nextReviewAt).getTime() <= now);
  const counts = entries.reduce(
    (acc, e) => {
      acc[wordStatus(e.stage, e.seenCount)] += 1;
      return acc;
    },
    { new: 0, learning: 0, mastered: 0 } as Record<WordStatus, number>,
  );

  return (
    <Screen
      onRefresh={() => {
        setNow(Date.now());
        void words.refetch();
      }}
      refreshing={words.isRefetching}
    >
      <Text variant="title">Vocabulario</Text>

      <Card gradient={gradients.ranked} style={styles.review}>
        <View style={styles.row}>
          <Layers color={colors.primarySoft} size={24} />
          <Text variant="heading">
            {due.length > 0 ? `${due.length} palabras para repasar` : 'Estás al día'}
          </Text>
        </View>
        <Text color="textMuted">
          Repetición espaciada: cada acierto aleja el próximo repaso (
          {SRS_CONFIG.intervalsDays.join(', ')} días) y un error lo trae de vuelta enseguida.
        </Text>
        <Button
          label="Repasar ahora"
          size="lg"
          disabled={due.length === 0}
          onPress={() => router.push('/review')}
        />
      </Card>

      <View style={styles.grid}>
        <StatTile label="Aprendiendo" value={String(counts.learning)} />
        <StatTile
          label="Dominadas"
          value={String(counts.mastered)}
          hint={`${SRS_CONFIG.masteredStage} repasos espaciados correctos`}
        />
      </View>

      <Text variant="overline">TUS PALABRAS</Text>
      {entries.length === 0 ? (
        <EmptyState
          title="Todavía no estudiaste palabras"
          message="Completá tu primera lección y tus palabras aparecerán acá."
          actionLabel="Ir a Aprender"
          onAction={() => router.navigate('/learn')}
        />
      ) : (
        <Card style={styles.list}>
          {entries.map((entry) => {
            const status = wordStatus(entry.stage, entry.seenCount);
            return (
              <View key={entry.word.id} style={styles.wordRow}>
                <SpeakButton text={entry.word.text} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong" color="textStrong">
                    {entry.word.text}
                  </Text>
                  <Text variant="caption">{entry.word.translation_es}</Text>
                </View>
                <Text variant="overline" color={STATUS_COLOR[status]}>
                  {WORD_STATUS_LABELS[status].toUpperCase()}
                </Text>
              </View>
            );
          })}
        </Card>
      )}

      <Text variant="overline">WIDGET · VISTA PREVIA</Text>
      {wordOfDay.data ? (
        <Card gradient={gradients.hero} style={styles.widget}>
          <View style={styles.widgetTop}>
            <Text variant="overline" color="primarySoft">
              PALABRA DEL DÍA
            </Text>
            <SpeakButton text={wordOfDay.data.text} />
          </View>
          <Text variant="display">
            {wordOfDay.data.emoji ? `${wordOfDay.data.emoji} ` : ''}
            {wordOfDay.data.text}
          </Text>
          <Text color="textMuted">
            {wordOfDay.data.ipa} · {wordOfDay.data.translation_es}
          </Text>
          {wordOfDay.data.example_en ? (
            <Text variant="caption">“{wordOfDay.data.example_en}”</Text>
          ) : null}
        </Card>
      ) : null}
      <Card style={styles.status}>
        <View style={styles.row}>
          <Smartphone color={colors.info} size={22} />
          <Text variant="bodyStrong">Widget de pantalla de inicio</Text>
        </View>
        <Text color="textMuted">
          El widget nativo para iOS y Android todavía no está instalado (Fase 5). La tarjeta de
          arriba muestra la palabra del día real, pero sólo dentro de la app.
        </Text>
        <View style={styles.pill}>
          <Text variant="overline" color="streak">
            ESTADO: PENDIENTE
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  review: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  list: { gap: spacing.md },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  widget: { gap: spacing.xs },
  widgetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { gap: spacing.sm },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(251,146,60,0.12)',
  },
});

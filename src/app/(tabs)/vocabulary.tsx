import { router } from 'expo-router';
import { ChevronRight, Layers, Smartphone } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Platform, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { SRS_CONFIG, WORD_STATUS_LABELS, wordStatus, type WordStatus } from '@shared/srs';

import {
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
import { useTabPressScroll } from '@/lib/useTabPressScroll';
import { widgetsSupported } from '@/features/widgets/sync';

const STATUS_COLOR: Record<WordStatus, keyof typeof colors> = {
  new: 'textMuted',
  learning: 'info',
  mastered: 'success',
};

export default function VocabularyScreen() {
  const words = useMyWords();
  const wordOfDay = useWordOfTheDay();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
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
      scrollRef={scrollRef}
      onRefresh={() => {
        setNow(Date.now());
        void words.refetch();
      }}
      refreshing={words.isRefetching}
    >
      <View style={styles.header}>
        <Text variant="title">Vocabulario</Text>
        <Text color="textMuted">Las palabras que fuiste aprendiendo en el camino.</Text>
      </View>

      <View style={styles.grid}>
        <StatTile label="Estudiadas" value={String(entries.length)} />
        <StatTile label="Aprendiendo" value={String(counts.learning)} />
        <StatTile
          label="Dominadas"
          value={String(counts.mastered)}
          hint={`${SRS_CONFIG.masteredStage} repasos espaciados correctos`}
        />
      </View>

      {due.length > 0 ? (
        <Card
          onPress={() => router.navigate('/practice')}
          accessibilityLabel={`${due.length} palabras para repasar. Ir a Repaso`}
          style={styles.dueRow}
        >
          <Layers color={colors.primarySoft} size={22} />
          <Text variant="bodyStrong" color="textStrong" style={styles.flex}>
            {due.length} palabras para repasar
          </Text>
          <ChevronRight color={colors.textMuted} size={20} />
        </Card>
      ) : null}

      <Text variant="overline">TUS PALABRAS</Text>
      {entries.length === 0 ? (
        <EmptyState
          title="Todavía no estudiaste palabras"
          message="Completá tu primera lección y tus palabras aparecerán acá."
          actionLabel="Ir a las lecciones"
          onAction={() => router.navigate('/')}
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

      <Text variant="overline">PALABRA DEL DÍA</Text>
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
          <Text variant="bodyStrong">Widgets de pantalla de inicio</Text>
        </View>
        <Text color="textMuted">
          «Palabra» muestra la palabra del día y tus palabras para repasar. «Pregunta rápida» te
          deja responder sin abrir la app (es práctica: no cambia tus repasos ni tu ELO).
        </Text>
        {widgetsSupported ? (
          <Text color="textMuted">
            {Platform.OS === 'ios'
              ? 'Mantené apretada la pantalla de inicio → Editar → Agregar widget → Polygo. La palabra cambia cada hora; iOS decide el momento exacto.'
              : 'Mantené apretada la pantalla de inicio → Widgets → Polygo. La palabra se renueva cada vez que abrís la app.'}
          </Text>
        ) : (
          <View style={styles.pill}>
            <Text variant="overline" color="streak">
              NO DISPONIBLE EN EXPO GO · HACE FALTA UNA BUILD DE LA APP
            </Text>
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xxs },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
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

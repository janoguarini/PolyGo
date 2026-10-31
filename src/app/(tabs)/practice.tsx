import { router } from 'expo-router';
import { ChevronRight, Layers, RotateCcw, Target, Zap } from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { SRS_CONFIG } from '@shared/srs';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  colors,
  gradients,
  spacing,
} from '@/design-system';
import { useCurriculum, useMyWords } from '@/features/learning/hooks';
import { useTabPressScroll } from '@/lib/useTabPressScroll';
import { lessonStars } from '@/features/learning/path';

/** Lecciones completadas que conviene repetir (las de peor precisión primero). */
const REPLAY_COUNT = 4;

export default function PracticeScreen() {
  const words = useMyWords();
  const curriculum = useCurriculum();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
  // Referencia temporal fija por montaje de la pantalla (se actualiza al refrescar).
  const [now, setNow] = useState(() => Date.now());

  if (words.isPending || curriculum.isPending) return <LoadingState />;
  if (words.isError || !words.data) return <ErrorState onRetry={() => void words.refetch()} />;

  const entries = words.data;
  const due = entries.filter((e) => e.nextReviewAt && new Date(e.nextReviewAt).getTime() <= now);
  const mistakes = entries.filter((e) => e.incorrectCount > 0);
  const replay = (curriculum.data?.units ?? [])
    .flatMap((u) => u.lessons.map((l) => ({ ...l, unitEmoji: u.emoji })))
    .filter((l) => l.status === 'completed' && (l.bestAccuracy ?? 0) < 1)
    .sort((a, b) => (a.bestAccuracy ?? 0) - (b.bestAccuracy ?? 0))
    .slice(0, REPLAY_COUNT);

  return (
    <Screen
      scrollRef={scrollRef}
      onRefresh={() => {
        setNow(Date.now());
        void words.refetch();
        void curriculum.refetch();
      }}
      refreshing={words.isRefetching}
    >
      <View style={styles.header}>
        <Text variant="title">Repaso</Text>
        <Text color="textMuted">Sesiones cortas para fijar lo que ya aprendiste.</Text>
      </View>

      <Card gradient={gradients.ranked} style={styles.gap}>
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

      <Text variant="overline">PRÁCTICA RÁPIDA</Text>
      <PracticeOption
        icon={<Zap color={colors.gold} size={22} />}
        title="Práctica libre"
        caption={
          entries.length > 0
            ? '10 palabras al azar de las que ya estudiaste · no cambia tus repasos'
            : 'Completá una lección para desbloquearla'
        }
        disabled={entries.length === 0}
        onPress={() => router.push({ pathname: '/review', params: { mode: 'practice' } })}
      />
      <PracticeOption
        icon={<Target color={colors.danger} size={22} />}
        title="Tus puntos débiles"
        caption={
          mistakes.length > 0
            ? `${mistakes.length} palabras en las que te equivocaste · no cambia tus repasos`
            : 'Todavía no tenés errores registrados'
        }
        disabled={mistakes.length === 0}
        onPress={() => router.push({ pathname: '/review', params: { mode: 'mistakes' } })}
      />

      {replay.length > 0 ? (
        <>
          <Text variant="overline">REPETIR LECCIONES</Text>
          {replay.map((lesson) => {
            const stars = lessonStars(lesson.bestAccuracy);
            return (
              <PracticeOption
                key={lesson.id}
                icon={<Text style={styles.emoji}>{lesson.unitEmoji}</Text>}
                title={lesson.title}
                caption={`Mejor precisión ${Math.round((lesson.bestAccuracy ?? 0) * 100)}% · ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`}
                onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })}
                trailing={<RotateCcw color={colors.textMuted} size={18} />}
              />
            );
          })}
        </>
      ) : null}
    </Screen>
  );
}

function PracticeOption(props: {
  icon: ReactNode;
  title: string;
  caption: string;
  disabled?: boolean;
  onPress: () => void;
  trailing?: ReactNode;
}) {
  return (
    <Card
      onPress={props.disabled ? undefined : props.onPress}
      accessibilityLabel={`${props.title}. ${props.caption}`}
      style={[styles.option, props.disabled && styles.disabled]}
    >
      {props.icon}
      <View style={styles.flex}>
        <Text variant="bodyStrong" color="textStrong">
          {props.title}
        </Text>
        <Text variant="caption">{props.caption}</Text>
      </View>
      {props.disabled
        ? null
        : (props.trailing ?? <ChevronRight color={colors.textMuted} size={20} />)}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xxs },
  gap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  disabled: { opacity: 0.55 },
  flex: { flex: 1, gap: spacing.xxs },
  emoji: { fontSize: 22, lineHeight: 28 },
});

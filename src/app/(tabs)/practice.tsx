import { router } from 'expo-router';
import {
  ChevronRight,
  Layers,
  ListChecks,
  RotateCcw,
  Smartphone,
  Target,
  Zap,
} from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { SRS_CONFIG, wordStatus, type WordStatus } from '@shared/srs';

import {
  Button,
  Card,
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
import { useCurriculum, useMyWords, useWordOfTheDay } from '@/features/learning/hooks';
import { useDailyMissions } from '@/features/missions/api';
import { useTabPressScroll } from '@/lib/useTabPressScroll';
import { lessonStars } from '@/features/learning/path';
import { widgetsSupported } from '@/features/widgets/sync';

/** Lecciones completadas que conviene repetir (las de peor precisión primero). */
const REPLAY_COUNT = 4;

export default function PracticeScreen() {
  const words = useMyWords();
  const curriculum = useCurriculum();
  const wordOfDay = useWordOfTheDay();
  const missions = useDailyMissions();
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
  const counts = entries.reduce(
    (acc, e) => {
      acc[wordStatus(e.stage, e.seenCount)] += 1;
      return acc;
    },
    { new: 0, learning: 0, mastered: 0 } as Record<WordStatus, number>,
  );
  const missionList = missions.data?.missions ?? [];
  const missionsTotal = missionList.length || 3;
  const missionsDone = missionList.filter((m) => m.done).length;

  return (
    <Screen
      scrollRef={scrollRef}
      onRefresh={() => {
        setNow(Date.now());
        void words.refetch();
        void curriculum.refetch();
        void missions.refetch();
      }}
      refreshing={words.isRefetching}
    >
      <View style={styles.header}>
        <Text variant="title">Repaso</Text>
        <Text color="textMuted">Sesiones cortas para fijar lo que ya aprendiste.</Text>
      </View>

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

      <View style={styles.grid}>
        <StatTile label="Estudiadas" value={String(entries.length)} />
        <StatTile label="Aprendiendo" value={String(counts.learning)} />
        <StatTile
          label="Dominadas"
          value={String(counts.mastered)}
          hint={`${SRS_CONFIG.masteredStage} repasos espaciados correctos`}
        />
      </View>

      <Text variant="overline">HOY</Text>
      <PracticeOption
        icon={
          <ListChecks
            color={missionsDone === missionsTotal ? colors.success : colors.info}
            size={22}
          />
        }
        title="Misiones del día"
        caption={
          missions.data?.all_done && !missions.data.claimed
            ? '¡Completas! Abrí tu cofre de Polys'
            : `${missionsDone} de ${missionsTotal} completas · ganá Polys y protectores`
        }
        onPress={() => router.push('/missions')}
      />

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

      <Card style={styles.gap}>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  widget: { gap: spacing.xs },
  widgetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(251,146,60,0.12)',
  },
});

import { router } from 'expo-router';
import {
  BookOpen,
  ChartNoAxesColumn,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Layers,
  Library,
  Play,
  Smartphone,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { wordStatus, type WordStatus } from '@shared/srs';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  colors,
  gradients,
  radii,
  spacing,
} from '@/design-system';
import { SpeakButton } from '@/features/learning/components/SpeakButton';
import { useCurriculum, useMyWords, useWordOfTheDay } from '@/features/learning/hooks';
import { useTabPressScroll } from '@/lib/useTabPressScroll';
import { usePlus } from '@/features/plus/api';
import { PlusBadge } from '@/features/plus/components/PlusBadge';
import { pickSmartReview } from '@/features/plus/smartReview';
import { topicSummaries } from '@/features/plus/topicReview';
import { WidgetContentPicker } from '@/features/widgets/WidgetContentPicker';
import { widgetsSupported } from '@/features/widgets/sync';

/** Palabras por sesión de práctica libre. */
const PRACTICE_SIZE = 10;

export default function PracticeScreen() {
  const words = useMyWords();
  const curriculum = useCurriculum();
  const wordOfDay = useWordOfTheDay();
  const plus = usePlus();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
  // Referencia temporal fija por montaje de la pantalla (se actualiza al refrescar).
  const [now, setNow] = useState(() => Date.now());

  if (words.isPending || curriculum.isPending) return <LoadingState />;
  if (words.isError || !words.data) return <ErrorState onRetry={() => void words.refetch()} />;

  const entries = words.data;
  const due = entries.filter((e) => e.nextReviewAt && new Date(e.nextReviewAt).getTime() <= now);
  const mistakes = entries.filter((e) => e.incorrectCount > 0);
  const counts = entries.reduce(
    (acc, e) => {
      acc[wordStatus(e.stage, e.seenCount)] += 1;
      return acc;
    },
    { new: 0, learning: 0, mastered: 0 } as Record<WordStatus, number>,
  );
  const smartCount = pickSmartReview(entries, now).length;
  const topicCount = topicSummaries(curriculum.data?.units ?? [], entries, now).length;

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

      {wordOfDay.data ? (
        <Card gradient={gradients.hero} style={styles.widget}>
          <View style={styles.speak}>
            <SpeakButton text={wordOfDay.data.text} />
          </View>
          <Text variant="overline" color="primarySoft" align="center">
            PALABRA DEL DÍA
          </Text>
          <Text variant="title" align="center" style={styles.word}>
            {wordOfDay.data.emoji ? `${wordOfDay.data.emoji} ` : ''}
            {wordOfDay.data.text}
          </Text>
          <Text variant="caption" align="center">
            {wordOfDay.data.ipa} · {wordOfDay.data.translation_es}
          </Text>
          {wordOfDay.data.example_en ? (
            <HighlightedExample sentence={wordOfDay.data.example_en} word={wordOfDay.data.text} />
          ) : null}
        </Card>
      ) : null}

      <Card gradient={gradients.ranked} style={styles.reviewCard}>
        <View style={styles.row}>
          <Layers color={colors.primarySoft} size={20} />
          <Text variant="bodyStrong" color="textStrong" style={styles.flex}>
            {due.length > 0
              ? 'Tenés repasos'
              : entries.length === 0
                ? 'Nada para repasar'
                : 'Estás al día'}
          </Text>
          {entries.length > 0 ? (
            <View style={styles.statusPill}>
              {due.length === 0 ? <CircleCheck color={colors.success} size={16} /> : null}
              <Text variant="caption" color="textStrong">
                {due.length} {due.length === 1 ? 'pendiente' : 'pendientes'}
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="caption">
          {entries.length === 0
            ? 'Completá una lección y sus palabras aparecen acá.'
            : 'Repasá justo antes de olvidar cada palabra.'}
        </Text>
        {entries.length === 0 ? (
          <Button label="Ir a mi primera lección" onPress={() => router.navigate('/')} />
        ) : (
          <Button
            label="Repasar ahora"
            icon={<Play color={colors.onPrimary} fill={colors.onPrimary} size={16} />}
            disabled={due.length === 0}
            onPress={() => router.push('/review')}
          />
        )}
      </Card>

      <View style={styles.grid}>
        <MiniStat
          label="Estudiadas"
          value={entries.length}
          icon={<BookOpen color={colors.primarySoft} size={14} />}
        />
        <MiniStat
          label="Aprendiendo"
          value={counts.learning}
          icon={<ChartNoAxesColumn color={colors.primarySoft} size={14} />}
        />
        <MiniStat
          label="Dominadas"
          value={counts.mastered}
          icon={<Target color={colors.primarySoft} size={14} />}
        />
      </View>

      <Text variant="heading">Hoy</Text>
      <View style={styles.list}>
        <PracticeOption
          icon={<Zap color={colors.primarySoft} size={18} />}
          title="Práctica libre"
          count={Math.min(entries.length, PRACTICE_SIZE)}
          disabled={entries.length === 0}
          onPress={() => router.push({ pathname: '/review', params: { mode: 'practice' } })}
        />
        <PracticeOption
          icon={<CircleAlert color={colors.primarySoft} size={18} />}
          title="Puntos débiles"
          count={mistakes.length}
          disabled={mistakes.length === 0}
          onPress={() => router.push({ pathname: '/review', params: { mode: 'mistakes' } })}
        />
        <PracticeOption
          icon={<Sparkles color={colors.primarySoft} size={18} />}
          title="Repaso inteligente"
          count={plus === true ? smartCount : undefined}
          disabled={plus === true && smartCount === 0}
          onPress={() =>
            plus === true
              ? router.push({ pathname: '/review', params: { mode: 'smart' } })
              : router.push('/plus')
          }
          badge={plus === true ? undefined : <PlusBadge />}
        />
        <PracticeOption
          icon={<Library color={colors.primarySoft} size={18} />}
          title="Repaso por tema"
          count={plus === true ? topicCount : undefined}
          countLabel={topicCount === 1 ? 'tema' : 'temas'}
          disabled={plus === true && topicCount === 0}
          onPress={() => router.push(plus === true ? '/review-topics' : '/plus')}
          badge={plus === true ? undefined : <PlusBadge />}
        />
      </View>

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
        {widgetsSupported ? <WidgetContentPicker /> : null}
      </Card>
    </Screen>
  );
}

/** Ejemplo con la palabra del día resaltada (sin distinguir mayúsculas). */
function HighlightedExample({ sentence, word }: { sentence: string; word: string }) {
  const at = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (at < 0) return <Text align="center">“{sentence}”</Text>;
  return (
    <Text align="center">
      “{sentence.slice(0, at)}
      <Text variant="bodyStrong" color="textStrong" style={styles.highlight}>
        {` ${sentence.slice(at, at + word.length)} `}
      </Text>
      {sentence.slice(at + word.length)}”
    </Text>
  );
}

/** Estadística compacta: tres entran en una fila sin cortar la etiqueta. */
function MiniStat({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.statLabel}>
        {icon}
        <Text variant="caption" numberOfLines={1} adjustsFontSizeToFit style={styles.flex}>
          {label}
        </Text>
      </View>
      <Text variant="heading" color="textStrong">
        {value}
      </Text>
    </View>
  );
}

function PracticeOption(props: {
  icon: ReactNode;
  title: string;
  /** Cantidad disponible; sin valor (o en 0) no se muestra la píldora. */
  count?: number;
  countLabel?: string;
  disabled?: boolean;
  onPress: () => void;
  badge?: ReactNode;
}) {
  const count = props.count ?? 0;
  const countText = `${count} ${props.countLabel ?? (count === 1 ? 'palabra' : 'palabras')}`;
  return (
    <Card
      onPress={props.disabled ? undefined : props.onPress}
      accessibilityLabel={count > 0 ? `${props.title}. ${countText}` : props.title}
      style={[styles.option, props.disabled && styles.disabled]}
    >
      <View style={styles.iconTile}>{props.icon}</View>
      <Text variant="bodyStrong" color="textStrong" style={styles.flex}>
        {props.title}
      </Text>
      {props.badge ??
        (count > 0 ? (
          <View style={styles.countPill}>
            <Text variant="caption" color="primarySoft" style={styles.countText}>
              {countText}
            </Text>
          </View>
        ) : null)}
      {props.disabled ? null : <ChevronRight color={colors.textMuted} size={18} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xxs },
  gap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  list: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  disabled: { opacity: 0.55 },
  flex: { flex: 1 },
  grid: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    flex: 1,
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  widget: {
    gap: spacing.xxs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.huge + spacing.sm,
    alignItems: 'center',
  },
  word: { fontSize: 28, lineHeight: 34 },
  speak: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  reviewCard: { gap: spacing.sm, padding: spacing.md },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  countPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(139,92,246,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.35)',
  },
  countText: { fontWeight: '700' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'rgba(7,6,15,0.35)',
  },
  highlight: { backgroundColor: 'rgba(139,92,246,0.35)' },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(251,146,60,0.12)',
  },
});

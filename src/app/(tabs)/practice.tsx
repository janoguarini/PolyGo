import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Brain,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Layers,
  Play,
  Smartphone,
  Target,
  Zap,
} from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import {
  BrandCard,
  Button,
  Card,
  ErrorState,
  LoadingState,
  Mascot,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { SpeakButton } from '@/features/learning/components/SpeakButton';
import { useMyWords, useWordOfTheDay } from '@/features/learning/hooks';
import { usePlus } from '@/features/plus/api';
import { PlusCrownPill } from '@/features/plus/components/PlusCrownPill';
import { WidgetContentPicker } from '@/features/widgets/WidgetContentPicker';
import { widgetsSupported } from '@/features/widgets/sync';
import { useStrings } from '@/i18n';
import { practiceStrings } from '@/i18n/screens/practice';
import { useTabPressScroll } from '@/lib/useTabPressScroll';

/**
 * Repaso: palabra del día, los repasos que tocan hoy y los cuatro entrenamientos. Repaso
 * inteligente abre su presentación (/smart-review), que muestra qué va a trabajar la sesión.
 */
export default function PracticeScreen() {
  const styles = useStyles();
  const t = useStrings(practiceStrings);
  const words = useMyWords();
  const wordOfDay = useWordOfTheDay();
  const plus = usePlus();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
  // Referencia temporal fija por montaje de la pantalla (se actualiza al refrescar).
  const [now, setNow] = useState(() => Date.now());

  if (words.isPending) return <LoadingState />;
  if (words.isError || !words.data) return <ErrorState onRetry={() => void words.refetch()} />;

  const entries = words.data;
  const due = entries.filter((e) => e.nextReviewAt && new Date(e.nextReviewAt).getTime() <= now);
  const mistakes = entries.filter((e) => e.incorrectCount > 0);
  const empty = entries.length === 0;

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
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Brain color={colors.primarySoft} size={34} />
            <Text variant="title" accessibilityRole="header">
              {t.title}
            </Text>
          </View>
          <Text color="text">{t.subtitle}</Text>
        </View>
        <View style={styles.mascot} pointerEvents="none">
          <Mascot pose="thinking" height={128} />
        </View>
      </View>

      {wordOfDay.data ? (
        <BrandCard contentStyle={styles.wordCard}>
          <View style={styles.wordTop}>
            <View style={styles.overlinePill}>
              <Text variant="overline" color="textStrong">
                {t.wordOfDay}
              </Text>
            </View>
            <SpeakButton text={wordOfDay.data.text} />
          </View>
          <View style={styles.wordBody}>
            <View style={styles.flex}>
              <Text variant="title" color="textStrong" style={styles.word} numberOfLines={2}>
                {wordOfDay.data.emoji ? `${wordOfDay.data.emoji} ` : ''}
                {wordOfDay.data.text}
              </Text>
              <Text color="text" style={styles.ipa}>
                {wordOfDay.data.ipa} · {wordOfDay.data.translation_es}
              </Text>
            </View>
            {wordOfDay.data.example_en ? (
              <>
                <View style={styles.divider} />
                <View style={styles.flex}>
                  <HighlightedExample
                    sentence={wordOfDay.data.example_en}
                    word={wordOfDay.data.text}
                  />
                </View>
              </>
            ) : null}
          </View>
        </BrandCard>
      ) : null}

      <BrandCard glow={due.length > 0} contentStyle={styles.todayCard}>
        <View style={styles.todayTop}>
          <View style={styles.chip}>
            <CalendarDays color={colors.textStrong} size={16} />
            <Text variant="bodyStrong" color="textStrong">
              {t.forToday}
            </Text>
          </View>
          {!empty ? (
            <View style={[styles.chip, styles.chipAccent]}>
              {due.length === 0 ? <CircleCheck color={colors.success} size={14} /> : null}
              <Text variant="caption" color="primarySoft" style={styles.bold}>
                {t.pending(due.length)}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.todayBody}>
          <View style={styles.todayText}>
            <Text variant="heading" color="textStrong">
              {due.length > 0 ? t.haveReviews : empty ? t.nothingToReview : t.upToDate}
            </Text>
            <Text color="text">
              {empty ? t.emptyCaption : due.length > 0 ? t.reviewCaption : t.upToDateCaption}
            </Text>
          </View>
          <TargetArt />
        </View>
        {empty ? (
          <Button label={t.firstLesson} onPress={() => router.navigate('/')} />
        ) : (
          <Button
            label={t.reviewNow}
            size="lg"
            icon={<Play color={colors.onPrimary} fill={colors.onPrimary} size={18} />}
            disabled={due.length === 0}
            onPress={() => router.push('/review')}
          />
        )}
      </BrandCard>

      <View style={styles.sectionTitle}>
        <Zap color={colors.primarySoft} size={22} />
        <Text variant="heading" color="textStrong">
          {t.training}
        </Text>
      </View>
      <View style={styles.grid}>
        <TrainingTile
          icon={<Brain color={colors.primarySoft} size={30} />}
          title={t.smartReview}
          subtitle={t.smartReviewSub}
          highlight
          badge={<PlusCrownPill label={t.plus} a11y={t.plusA11y} />}
          disabled={empty}
          onPress={() => router.push('/smart-review')}
        />
        <TrainingTile
          icon={<Zap color={colors.primarySoft} size={30} />}
          title={t.freePractice}
          subtitle={t.freePracticeSub}
          disabled={empty}
          onPress={() => router.push({ pathname: '/review', params: { mode: 'practice' } })}
        />
        <TrainingTile
          icon={<Target color={colors.primarySoft} size={30} />}
          title={t.weakSpots}
          subtitle={t.weakSpotsSub}
          disabled={mistakes.length === 0}
          onPress={() => router.push({ pathname: '/review', params: { mode: 'mistakes' } })}
        />
        <TrainingTile
          icon={<Layers color={colors.primarySoft} size={30} />}
          title={t.topicReview}
          subtitle={t.topicReviewSub}
          badge={plus === true ? undefined : <PlusCrownPill label={t.plus} a11y={t.plusA11y} />}
          disabled={empty}
          onPress={() => router.push(plus === true ? '/review-topics' : '/plus')}
        />
      </View>

      <Card style={styles.widgets}>
        <View style={styles.row}>
          <Smartphone color={colors.info} size={22} />
          <Text variant="bodyStrong">{t.widgetsTitle}</Text>
        </View>
        <Text color="textMuted">{t.widgetsBody}</Text>
        {widgetsSupported ? (
          <Text color="textMuted">{Platform.OS === 'ios' ? t.widgetsIos : t.widgetsAndroid}</Text>
        ) : (
          <View style={styles.pill}>
            <Text variant="overline" color="streak">
              {t.widgetsUnavailable}
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
  const styles = useStyles();
  const at = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (at < 0) {
    return (
      <Text variant="bodyStrong" color="textStrong" style={styles.example}>
        “{sentence}”
      </Text>
    );
  }
  // Resalta la palabra completa donde aparece («running» para «run»).
  const end = at + (/^[\p{L}'’-]+/u.exec(sentence.slice(at))?.[0].length ?? word.length);
  return (
    <Text variant="bodyStrong" color="textStrong" style={styles.example}>
      “{sentence.slice(0, at)}
      <Text variant="bodyStrong" color="primarySoft" style={styles.highlight}>
        {sentence.slice(at, end)}
      </Text>
      {sentence.slice(end)}”
    </Text>
  );
}

/** Diana con degradé violeta (el ícono del diseño, sin imagen). */
function TargetArt() {
  const styles = useStyles();
  return (
    <LinearGradient
      colors={[colors.primaryBright, colors.primaryPressed]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.target}
    >
      <Target color={colors.onPrimary} size={52} strokeWidth={2.2} />
    </LinearGradient>
  );
}

function TrainingTile(props: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  badge?: ReactNode;
  highlight?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  return (
    <BrandCard
      highlight={props.highlight && !props.disabled}
      glow={props.highlight && !props.disabled}
      onPress={props.disabled ? undefined : props.onPress}
      accessibilityLabel={`${props.title}. ${props.subtitle}`}
      style={[styles.tile, props.disabled && styles.disabled]}
      contentStyle={styles.tileContent}
    >
      <View style={styles.tileTop}>
        {props.icon}
        {props.badge}
      </View>
      <View style={styles.tileTitleRow}>
        <Text variant="bodyStrong" color="textStrong" style={[styles.flex, styles.tileTitle]}>
          {props.title}
        </Text>
        {props.disabled ? null : <ChevronRight color={colors.textMuted} size={20} />}
      </View>
      <Text variant="caption" color="text" numberOfLines={2}>
        {props.subtitle}
      </Text>
    </BrandCard>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    bold: { fontWeight: '700' },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    header: { flexDirection: 'row', alignItems: 'center', minHeight: 128 },
    headerText: { flex: 1, gap: spacing.xs, zIndex: 1 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    mascot: { marginRight: -spacing.md, marginLeft: -spacing.lg },
    wordCard: { gap: spacing.sm, padding: spacing.lg },
    wordTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    overlinePill: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xxs,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(139,92,246,0.28)',
    },
    wordBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    word: { fontSize: 30, lineHeight: 36 },
    ipa: { marginTop: spacing.xxs },
    divider: { width: 1, alignSelf: 'stretch', backgroundColor: colors.brandBorder },
    example: { lineHeight: 24 },
    highlight: { backgroundColor: 'rgba(139,92,246,0.35)' },
    todayCard: { gap: spacing.md, padding: spacing.lg },
    todayTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    chipAccent: {
      paddingVertical: spacing.xxs,
      backgroundColor: 'rgba(139,92,246,0.18)',
      borderColor: 'rgba(139,92,246,0.45)',
    },
    todayBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    todayText: { flex: 1, gap: spacing.xs },
    target: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.18)',
    },
    sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    // Dos por fila: casi la mitad del ancho; flexGrow reparte el resto entre columnas.
    tile: { width: '45%', flexGrow: 1 },
    tileContent: { gap: spacing.xs, padding: spacing.md, minHeight: 132 },
    tileTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    tileTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
    tileTitle: { fontSize: 17, lineHeight: 21 },
    disabled: { opacity: 0.55 },
    widgets: { gap: spacing.md },
    pill: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(251,146,60,0.12)',
    },
  }),
);

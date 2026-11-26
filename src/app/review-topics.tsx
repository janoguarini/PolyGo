import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BookOpen, ChevronLeft, Crown, Layers, Lock, Play, Star } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { wordGroups, type WordGroups } from '@shared/smartOverview';

import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useCurriculum, useMyWords, useWordPool } from '@/features/learning/hooks';
import { usePlus } from '@/features/plus/api';
import { GoldButton, PLUS_INK } from '@/features/plus/components/GoldButton';
import { WORD_GROUP_COLORS } from '@/features/plus/components/ProgressRing';
import { topicSummaries, type TopicSummary } from '@/features/plus/topicReview';
import { useInterfaceLanguage, useStrings } from '@/i18n';
import { reviewTopicsStrings } from '@/i18n/screens/review';

interface Topic {
  /** Unidad del curso (con el título en el idioma de la interfaz). */
  summary: TopicSummary;
  groups: WordGroups;
  /** ¿Ya estudió palabras de esta unidad? Las demás se muestran «por empezar». */
  started: boolean;
  /** Palabras publicadas de la unidad (del banco del idioma), o null si no se pudo leer. */
  totalWords: number | null;
  lessons: number;
}

/**
 * Repaso por tema. Lo ven todos (con sus datos reales): con Plus, tocás un tema y lo repasás; sin
 * Plus, cada tema tiene candado y lleva a Plus. El servidor vuelve a exigir Plus al armar la sesión
 * (learning_start_focus_review), así que la pantalla sólo decide qué mostrar.
 */
export default function ReviewTopicsScreen() {
  const styles = useStyles();
  const t = useStrings(reviewTopicsStrings);
  const ui = useInterfaceLanguage();
  const plus = usePlus();
  const words = useMyWords();
  const curriculum = useCurriculum();
  // Banco de palabras del idioma: cuántas palabras tiene cada tema aunque todavía no lo empezó.
  const pool = useWordPool();
  const [now] = useState(() => Date.now());

  const topics = useMemo<Topic[]>(() => {
    if (!words.data || !curriculum.data) return [];
    const units = curriculum.data.units.map((u) => ({
      id: u.id,
      level: u.level,
      emoji: u.emoji,
      title: ui === 'en' && u.titleEn ? u.titleEn : u.title,
    }));
    const studied = new Map(topicSummaries(units, words.data, now).map((x) => [x.unit.id, x]));
    const poolCount = new Map<string, number>();
    for (const w of pool.data ?? []) {
      if (w.is_published && w.unit_id)
        poolCount.set(w.unit_id, (poolCount.get(w.unit_id) ?? 0) + 1);
    }
    // TODOS los temas del curso, en el orden del currículo (en cualquier idioma: es el curso activo).
    return units.map((unit, i) => {
      const summary = studied.get(unit.id) ?? { unit, studied: 0, due: 0, withMistakes: 0 };
      return {
        summary,
        groups: wordGroups(
          words.data!.filter((e) => e.word.unit_id === unit.id),
          now,
        ),
        started: studied.has(unit.id),
        totalWords: pool.data ? (poolCount.get(unit.id) ?? 0) : null,
        lessons: curriculum.data!.units[i]!.lessons.length,
      };
    });
  }, [words.data, curriculum.data, pool.data, ui, now]);

  // El que más cuesta (después, el que más palabras tiene para hoy).
  const recommended = useMemo(() => {
    const ranked = [...topics]
      .filter((x) => x.groups.struggling + x.groups.due > 0)
      .sort((a, b) => b.groups.struggling - a.groups.struggling || b.groups.due - a.groups.due);
    return ranked[0] ?? null;
  }, [topics]);

  const header = (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.title}
        hitSlop={8}
        onPress={() => router.back()}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <ChevronLeft color={colors.textStrong} size={26} />
      </Pressable>
      <View style={styles.headerTitle}>
        <Layers color={colors.primarySoft} size={22} />
        <Text variant="heading" color="textStrong" accessibilityRole="header" numberOfLines={1}>
          {t.title}
        </Text>
      </View>
      <View style={styles.plusPill}>
        <Crown color={PLUS_INK} fill={PLUS_INK} size={12} />
        <Text style={styles.plusPillText}>{t.plus}</Text>
      </View>
    </View>
  );

  if (words.isPending || curriculum.isPending) return <LoadingState />;
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

  const locked = plus !== true;
  const weakCount = topics.filter((x) => x.groups.struggling + x.groups.due > 0).length;
  const startedCount = topics.filter((x) => x.started).length;
  const levels = [...new Set(topics.map((x) => x.summary.unit.level))];
  // Sin Plus → Plus. Con Plus: un tema empezado se repasa; uno sin empezar se empieza en Aprender
  // (el repaso por tema sólo usa palabras que ya estudiaste).
  const open = (topic: Topic) => {
    if (locked) router.push('/plus');
    else if (!topic.started) router.dismissTo('/');
    else
      router.push({ pathname: '/review', params: { mode: 'topic', unit: topic.summary.unit.id } });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      {header}

      <LinearGradient
        colors={['#6D36E0', '#3F1D9E', '#241258']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle} color="textStrong">
          {t.heroTitle}
        </Text>
        <Text color="text" style={styles.bold}>
          {t.heroStats(topics.length, startedCount, weakCount)}
        </Text>
        <Legend />
      </LinearGradient>

      {recommended ? (
        <View style={styles.group}>
          <View style={styles.row}>
            <Star color={colors.gold} fill={colors.gold} size={16} />
            <Text variant="caption" color="textStrong" style={styles.bold}>
              {t.recommended}
            </Text>
          </View>
          <TopicCard
            topic={recommended}
            locked={locked}
            highlight
            onPress={() => open(recommended)}
          />
        </View>
      ) : null}

      {locked ? (
        <GoldButton label={t.unlock} sublabel={t.unlockSub} onPress={() => router.push('/plus')} />
      ) : null}

      {levels.map((level) => (
        <View key={level} style={styles.group}>
          <Text variant="overline">{t.level(level)}</Text>
          {topics
            .filter((x) => x.summary.unit.level === level)
            .map((x) => (
              <TopicCard
                key={x.summary.unit.id}
                topic={x}
                locked={locked}
                onPress={() => open(x)}
              />
            ))}
        </View>
      ))}

      <Text variant="caption" color="textMuted" align="center">
        {t.note}
      </Text>
    </Screen>
  );
}

/** Qué significa cada color de las barras (mismos grupos que el repaso inteligente). */
function Legend() {
  const styles = useStyles();
  const t = useStrings(reviewTopicsStrings);
  return (
    <View style={styles.legend}>
      {(['mastered', 'due', 'struggling'] as const).map((k) => (
        <View key={k} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: WORD_GROUP_COLORS[k] }]} />
          <Text variant="caption" color="textStrong" style={styles.bold}>
            {t.legend[k]}
          </Text>
        </View>
      ))}
    </View>
  );
}

function TopicCard({
  topic,
  locked,
  highlight = false,
  onPress,
}: {
  topic: Topic;
  locked: boolean;
  highlight?: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(reviewTopicsStrings);
  const { summary, groups, started } = topic;
  // La barra mide todo el tema: lo que falta estudiar queda en gris.
  const total = Math.max(1, summary.studied, topic.totalWords ?? 0);
  const detail = (
    started
      ? [
          topic.totalWords
            ? t.wordsOf(summary.studied, topic.totalWords)
            : t.words(summary.studied),
          groups.struggling > 0 ? t.struggling(groups.struggling) : null,
          groups.due > 0 ? t.dueToday(groups.due) : null,
          groups.struggling + groups.due === 0 ? t.allGood : null,
        ]
      : [
          topic.totalWords ? t.words(topic.totalWords) : null,
          topic.lessons > 0 ? t.lessons(topic.lessons) : null,
          t.notStarted,
        ]
  )
    .filter(Boolean)
    .join(' · ');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.cardA11y(summary.unit.title, detail, locked)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        highlight && styles.cardHighlight,
        !started && styles.cardNew,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.emojiBox, !started && styles.emojiBoxNew]}>
        <Text style={styles.emoji}>{summary.unit.emoji}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
          {summary.unit.title}
        </Text>
        <View style={styles.bar}>
          {(['mastered', 'due', 'struggling'] as const).map((k) =>
            groups[k] > 0 ? (
              <View
                key={k}
                style={{ flex: groups[k] / total, backgroundColor: WORD_GROUP_COLORS[k] }}
              />
            ) : null,
          )}
        </View>
        <Text variant="caption" color="text" numberOfLines={1}>
          {detail}
        </Text>
      </View>
      <View
        style={[
          styles.action,
          locked && styles.actionLocked,
          !locked && !started && styles.actionNew,
        ]}
      >
        {locked ? (
          <Lock color={PLUS_INK} size={16} />
        ) : started ? (
          <Play color={colors.onPrimary} fill={colors.onPrimary} size={15} />
        ) : (
          <BookOpen color={colors.textStrong} size={16} />
        )}
      </View>
    </Pressable>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    bold: { fontWeight: '700' },
    pressed: { opacity: 0.8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    back: { width: 36, height: 44, justifyContent: 'center' },
    headerTitle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    plusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
    },
    plusPillText: { color: PLUS_INK, fontWeight: '900', fontSize: 13 },
    hero: {
      gap: spacing.xs,
      padding: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: 1,
      borderColor: 'rgba(233,213,255,0.35)',
      shadowColor: '#A855F7',
      shadowOpacity: 0.5,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    heroTitle: { fontSize: 22, lineHeight: 26, fontWeight: '900', fontStyle: 'italic' },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: spacing.md,
      rowGap: 4,
      marginTop: spacing.xs,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    group: { gap: spacing.sm },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    cardHighlight: {
      borderWidth: 2,
      borderColor: colors.gold,
      backgroundColor: 'rgba(251,191,36,0.06)',
    },
    emojiBox: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(139,92,246,0.18)',
    },
    emoji: { fontSize: 24, lineHeight: 30 },
    cardBody: { flex: 1, gap: 5 },
    bar: {
      flexDirection: 'row',
      height: 8,
      gap: 2,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    action: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    actionLocked: { backgroundColor: colors.gold },
    actionNew: { backgroundColor: colors.inset },
    cardNew: { backgroundColor: 'rgba(255,255,255,0.03)' },
    emojiBoxNew: { backgroundColor: 'rgba(255,255,255,0.06)' },
  }),
);

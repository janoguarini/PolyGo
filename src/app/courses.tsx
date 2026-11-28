import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ChevronRight, Plus, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { languageConfig } from '@shared/languages';

import {
  BrandCard,
  Button,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  ScreenHeader,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import type { CourseEntry } from '@/features/courses/catalog';
import { CoursePicker } from '@/features/courses/CoursePicker';
import { useSwitchCourse } from '@/features/courses/hooks';
import { buildCoursePicker, type PickerCourse } from '@/features/courses/picker';
import { coursePickerStrings } from '@/features/courses/strings';
import { useCourseList } from '@/features/courses/useCourseList';
import { levelColor } from '@/features/profile/levelColor';
import { usePrefetchLanguagePaths } from '@/features/profile/components/LanguagesRow';
import { useInterfaceLanguage, useStrings } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';
import { coursesStrings } from '@/i18n/screens/courses';

/**
 * Tus cursos (Fase 3, docs/MULTILINGUAL_ONBOARDING_PLAN.md): el curso que estudiás, desde qué idioma y
 * su nivel, y tus otros cursos con su propio nivel y progreso (se llega tocando el idioma en Aprender o
 * desde Perfil). «Agregar curso» abre el selector agrupado por idioma de origen (CoursePicker, el mismo
 * del registro): tocar un curso tuyo te pasa a ese curso; uno nuevo abre «Empezar un curso nuevo»
 * (src/app/course-start/[code].tsx, Fase 4): test de nivel o desde A1. Cambiar de curso no borra ni
 * mezcla nada: cada curso conserva su nivel, progreso, repasos y ELO, y el XP es global.
 */
export default function CoursesScreen() {
  const styles = useStyles();
  const t = useStrings(coursesStrings);
  const pt = useStrings(coursePickerStrings);
  const ui = useInterfaceLanguage();
  const languageName = useLanguageName();
  const { list, isTester, isPending, isError, progressError, refetch } = useCourseList();
  const switchCourse = useSwitchCourse();
  const [adding, setAdding] = useState(false);
  usePrefetchLanguagePaths(list?.active.course.target);
  const sections = useMemo(
    () =>
      list
        ? buildCoursePicker({
            ui,
            isTester,
            mine: new Set(list.mine.map((e) => e.course.code)),
            activeCode: list.active.course.code,
          })
        : [],
    [list, ui, isTester],
  );

  if (isPending) return <LoadingState label={t.loading} />;
  if (isError || !list) return <ErrorState message={t.loadError} onRetry={refetch} />;

  const choose = (entry: CourseEntry, haptic = true) => {
    if (entry.active || !entry.selectable || switchCourse.isPending) return;
    if (haptic) void Haptics.selectionAsync();
    switchCourse.mutate(entry.course, {
      onError: () => Alert.alert(t.switchErrorTitle, t.switchErrorMessage),
    });
    // El cambio es optimista: Aprender ya muestra el curso nuevo.
    router.back();
  };

  // El selector ya vibra al tocar: tus cursos se eligen, uno nuevo abre por dónde empezar.
  const pick = (c: PickerCourse) => {
    if (c.active) return router.back();
    const entry = list.mine.find((e) => e.course.code === c.course.code);
    if (entry) return choose(entry, false);
    router.push({ pathname: '/course-start/[code]', params: { code: c.course.code } });
  };

  const { active } = list;
  const sourceName = (entry: CourseEntry) => languageName(entry.course.source);
  const activeLevel = active.progress?.level ?? active.startLevel;

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <ScreenHeader title={t.title} onBack={() => router.back()} />

      <Animated.View entering={FadeInDown.duration(300)}>
        <BrandCard glow highlight>
          <Text variant="overline" color="primarySoft">
            {t.studyingNow}
          </Text>
          <View
            style={styles.heroRow}
            accessible
            accessibilityLabel={t.activeA11y(
              languageName(active.course.target),
              sourceName(active),
              activeLevel,
            )}
          >
            <View style={styles.heroFlag}>
              <Text style={styles.heroFlagText}>{active.language.flag}</Text>
            </View>
            <View style={styles.flex}>
              <Text variant="title" color="textStrong" numberOfLines={1}>
                {languageName(active.course.target)}
              </Text>
              <SourceChip
                flag={languageConfig(active.course.source).flag}
                label={t.fromLanguage(sourceName(active))}
              />
            </View>
            <LevelPill level={activeLevel} />
          </View>
          {active.progress ? (
            <View style={styles.progress}>
              <ProgressBar
                value={active.progress.ratio}
                accessibilityLabel={t.levelProgress(
                  active.progress.level,
                  active.progress.completed,
                  active.progress.total,
                )}
              />
              <Text variant="caption" color="text">
                {t.levelProgress(
                  active.progress.level,
                  active.progress.completed,
                  active.progress.total,
                )}
              </Text>
            </View>
          ) : progressError ? (
            <Pressable accessibilityRole="button" onPress={refetch}>
              <Text variant="caption">{t.progressError}</Text>
            </Pressable>
          ) : null}
          <Button label={t.keepLearning} size="lg" onPress={() => router.back()} />
          <View style={styles.xpNote}>
            <Sparkles color={colors.gold} size={14} />
            <Text variant="caption" style={styles.flex}>
              {t.xpNote}
            </Text>
          </View>
        </BrandCard>
      </Animated.View>

      {list.mine.length > 0 ? (
        <>
          <Text variant="overline" style={styles.section}>
            {t.myCourses}
          </Text>
          {list.mine.map((entry, i) => (
            <Animated.View key={entry.course.code} entering={FadeInDown.delay(60 * (i + 1))}>
              <CourseRow
                entry={entry}
                onPress={() => choose(entry)}
                detail={entry.selectable ? null : t.unavailable}
                hint={t.switchHint}
              />
            </Animated.View>
          ))}
        </>
      ) : null}

      {adding ? (
        <Animated.View entering={FadeInDown.duration(250)} style={styles.picker}>
          <Text variant="overline" style={styles.section}>
            {t.available}
          </Text>
          <CoursePicker sections={sections} onPick={pick} />
        </Animated.View>
      ) : (
        <Button
          label={pt.addCourse}
          variant="secondary"
          size="lg"
          accessibilityHint={pt.addCourseHint}
          icon={<Plus color={colors.primaryBright} size={18} strokeWidth={2.6} />}
          style={styles.add}
          onPress={() => {
            void Haptics.selectionAsync();
            setAdding(true);
          }}
        />
      )}
    </Screen>
  );
}

function CourseRow({
  entry,
  onPress,
  detail,
  hint,
}: {
  entry: CourseEntry;
  onPress: () => void;
  /** Línea extra (p. ej. «Empezás desde A1»); null = el progreso del nivel. */
  detail: string | null;
  hint: string;
}) {
  const styles = useStyles();
  const t = useStrings(coursesStrings);
  const languageName = useLanguageName();
  const target = languageName(entry.course.target);
  const source = languageName(entry.course.source);
  const level = entry.progress?.level ?? entry.startLevel;
  const percent = entry.progress ? Math.round(entry.progress.ratio * 100) : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.courseA11y(target, source, level, percent)}
      accessibilityHint={entry.selectable ? hint : undefined}
      accessibilityState={{ disabled: !entry.selectable }}
      disabled={!entry.selectable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !entry.selectable && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.flagBox}>
        <Text style={styles.flagText}>{entry.language.flag}</Text>
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
          {target}
        </Text>
        <Text variant="caption" color="primarySoft" numberOfLines={1}>
          {t.fromLanguage(source)}
          {detail ? ` · ${detail}` : ''}
        </Text>
        {percent !== null ? (
          <View style={styles.rowBar}>
            <ProgressBar value={entry.progress!.ratio} accessibilityLabel={t.levelOnly(level)} />
          </View>
        ) : null}
      </View>
      <LevelPill level={level} />
      {entry.selectable ? <ChevronRight color={colors.textMuted} size={18} /> : null}
    </Pressable>
  );
}

function LevelPill({ level }: { level: string }) {
  const styles = useStyles();
  return (
    <View style={[styles.levelPill, { backgroundColor: levelColor(level) }]}>
      <Text variant="caption" color="onPrimary" style={styles.levelText}>
        {level}
      </Text>
    </View>
  );
}

function SourceChip({ flag, label }: { flag: string; label: string }) {
  const styles = useStyles();
  return (
    <View style={styles.sourceChip}>
      <Text style={styles.sourceFlag}>{flag}</Text>
      <Text variant="caption" color="primarySoft">
        {label}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    section: { marginTop: spacing.lg },
    picker: { gap: spacing.sm },
    add: { marginTop: spacing.lg },
    heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    heroFlag: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
      borderWidth: 2,
      borderColor: colors.primaryBright,
    },
    heroFlagText: { fontSize: 40, lineHeight: 48 },
    sourceChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceHighlight,
    },
    sourceFlag: { fontSize: 14, lineHeight: 18 },
    progress: { gap: spacing.xs },
    xpNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: 64,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    disabled: { opacity: 0.55 },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    flagBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
    },
    flagText: { fontSize: 28, lineHeight: 34 },
    rowBar: { marginTop: spacing.xs },
    levelPill: {
      minWidth: 36,
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.sm,
    },
    levelText: { fontWeight: '800' },
  }),
);

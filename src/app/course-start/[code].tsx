import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronRight,
  Flag,
  Layers,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
} from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Alert, Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { courseByCode, courseLanguage, courseLevels, isCourseSelectable } from '@shared/courses';
import { languageConfig } from '@shared/languages';
import { maxQuestions } from '@shared/placement';

import {
  BrandCard,
  EmptyState,
  ErrorState,
  LoadingState,
  Mascot,
  Screen,
  ScreenHeader,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { LANGUAGE_BACKGROUND_RATIO, languageBackground } from '@/design-system/languageImages';
import { useMyCourses, useSwitchCourse } from '@/features/courses/hooks';
import { goToLearn } from '@/features/placement/navigation';
import { placementBankFor } from '@/features/placement/session';
import { useStartCourse } from '@/features/placement/startCourse';
import { courseStartStrings } from '@/features/placement/strings';
import { useIsContentTester } from '@/features/profile/hooks';
import { useStrings } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';

/**
 * Empezar un curso nuevo (Fase 4, docs/PLACEMENT_TEST.md): hacer el test de nivel o empezar desde A1.
 * Se llega desde «Empezar un curso nuevo» en «Tus cursos». Empezar desde A1 guarda la inscripción en
 * A1 (sin heredar el nivel de otro curso) y deja el curso activo; el test no guarda nada hasta que se
 * confirma el resultado. Un curso en el que ya está inscripto no se vuelve a empezar.
 */
export default function CourseStartScreen() {
  const styles = useStyles();
  const t = useStrings(courseStartStrings);
  const languageName = useLanguageName();
  const { code } = useLocalSearchParams<{ code: string }>();
  const course = courseByCode(code);
  const tester = useIsContentTester();
  const courses = useMyCourses();
  const start = useStartCourse();
  const switchCourse = useSwitchCourse();

  if (!course) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ScreenHeader title={t.title} onBack={() => router.back()} />
        <EmptyState
          title={t.notFoundTitle}
          message={t.notFoundMessage}
          actionLabel={t.back}
          onAction={() => router.back()}
        />
      </Screen>
    );
  }
  if (courses.isPending || tester.isPending) return <LoadingState label={t.loading} />;
  if (courses.isError) return <ErrorState onRetry={() => void courses.refetch()} />;

  const language = courseLanguage(course);
  const levels = courseLevels(course);
  const target = languageName(course.target);
  const source = languageName(course.source);
  // Niveles y disponibilidad del curso (un curso oculto no se empieza ni por enlace).
  const firstLevel = levels[0];
  if (!firstLevel || !isCourseSelectable(course, tester.data ?? false)) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ScreenHeader title={t.title} onBack={() => router.back()} />
        <EmptyState
          title={t.notFoundTitle}
          message={t.notFoundMessage}
          actionLabel={t.back}
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  // null = modelo de cursos sin aplicar: no hay dónde guardar un resultado por curso.
  const enrollments = courses.data;
  const enrolled = enrollments?.find((e) => e.course_code === course.code);
  const bank = placementBankFor(course);
  const testReady = Boolean(bank) && enrollments !== null;
  const firstUnit = bank?.levels[0]?.firstUnitTitle;
  const photo = languageBackground(course.target);
  const testBody =
    bank && testReady
      ? t.testBody(bank.levels.map((l) => l.level).join(' – '), maxQuestions(bank))
      : t.testSoon;

  if (enrolled) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ScreenHeader title={t.title} onBack={() => router.back()} />
        <EmptyState
          icon={<Text style={styles.flagText}>{language.flag}</Text>}
          title={t.alreadyTitle}
          message={t.alreadyMessage(enrolled.start_level)}
          actionLabel={t.goToCourse}
          onAction={() => {
            switchCourse.mutate(course);
            goToLearn();
          }}
        />
      </Screen>
    );
  }

  const startFromBeginning = () => {
    if (start.isPending) return;
    void Haptics.selectionAsync();
    start.mutate(
      { course, startLevel: firstLevel, placement: null },
      {
        onSuccess: () => goToLearn(),
        onError: () =>
          Alert.alert(t.startErrorTitle, t.startErrorMessage, [
            { text: t.cancel, style: 'cancel' },
            { text: t.retry, onPress: startFromBeginning },
          ]),
      },
    );
  };

  const openTest = () => {
    if (!testReady || start.isPending) return;
    void Haptics.selectionAsync();
    router.push({ pathname: '/placement/[code]', params: { code: course.code } });
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <ScreenHeader title={t.title} onBack={() => router.back()} />

      {photo ? (
        <Animated.View entering={FadeInDown.duration(280)}>
          <CourseHero photo={photo}>
            <View style={styles.heroFlag}>
              <Text style={styles.heroFlagText}>{language.flag}</Text>
            </View>
            <View style={styles.flex}>
              <Text variant="overline" style={styles.onDarkSoft}>
                {t.heroOverline}
              </Text>
              <Text variant="display" style={styles.onDark} numberOfLines={1} adjustsFontSizeToFit>
                {target}
              </Text>
              <View style={styles.sourceChip}>
                <Text style={styles.sourceFlag}>{languageConfig(course.source).flag}</Text>
                <Text variant="caption" style={styles.onDark}>
                  {t.fromLanguage(source)}
                </Text>
              </View>
            </View>
          </CourseHero>
        </Animated.View>
      ) : (
        // Idioma sin escena todavía: la portada predeterminada (bandera en un círculo, centrada).
        <Animated.View entering={FadeInDown.duration(280)} style={styles.hero}>
          <View style={styles.plainFlag}>
            <Text style={styles.plainFlagText}>{language.flag}</Text>
          </View>
          <Text variant="overline" color="primarySoft">
            {t.heroOverline}
          </Text>
          <Text variant="display" color="textStrong" align="center">
            {target}
          </Text>
          <View style={[styles.sourceChip, styles.plainSourceChip]}>
            <Text style={styles.sourceFlag}>{languageConfig(course.source).flag}</Text>
            <Text variant="caption" color="primarySoft">
              {t.fromLanguage(source)}
            </Text>
          </View>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(40).duration(280)} style={styles.facts}>
        <Fact
          icon={<Layers color={colors.primaryBright} size={18} />}
          label={t.levelsLabel}
          value={levels.join(' – ')}
        />
        <Fact
          icon={<Swords color={language.ranked ? colors.gold : colors.textMuted} size={18} />}
          label={t.rankedLabel}
          value={language.ranked ? t.rankedYes : t.rankedNo}
        />
      </Animated.View>

      <Text variant="heading" color="textStrong" accessibilityRole="header">
        {t.question}
      </Text>

      {bank ? (
        <Animated.View entering={FadeInDown.delay(80).duration(280)}>
          <BrandCard
            glow={testReady}
            highlight={testReady}
            onPress={testReady ? openTest : undefined}
            accessibilityLabel={`${t.testTitle}. ${testBody}`}
            style={!testReady ? styles.disabled : undefined}
          >
            <View
              style={styles.optionRow}
              // Sin test disponible no es un botón: se lee como texto.
              accessible={!testReady}
              accessibilityLabel={!testReady ? `${t.testTitle}. ${testBody}` : undefined}
            >
              <View style={styles.optionIcon}>
                <Target color={colors.gold} size={26} />
              </View>
              <View style={styles.flex}>
                <Text variant="overline" color="gold">
                  {t.testBadge}
                </Text>
                <Text variant="heading" color="textStrong">
                  {t.testTitle}
                </Text>
                <Text variant="caption" color="text">
                  {testBody}
                </Text>
              </View>
              {testReady ? <ChevronRight color={colors.textMuted} size={20} /> : null}
              <View style={styles.mascot} pointerEvents="none">
                <Mascot pose="thinking" height={84} />
              </View>
            </View>
          </BrandCard>
        </Animated.View>
      ) : (
        <View style={styles.note}>
          <Sparkles color={colors.primarySoft} size={16} />
          <Text variant="caption" style={styles.flex}>
            {t.singleLevel(firstLevel)}
          </Text>
        </View>
      )}

      <Animated.View entering={FadeInDown.delay(140).duration(280)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.fromStartTitle(firstLevel)}
          accessibilityHint={t.fromStartHint}
          accessibilityState={{ busy: start.isPending, disabled: start.isPending }}
          disabled={start.isPending}
          onPress={startFromBeginning}
          style={({ pressed }) => [styles.option, pressed && styles.pressed]}
        >
          <View style={styles.optionIconPlain}>
            <Flag color={colors.primaryBright} size={22} />
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="textStrong">
              {start.isPending ? t.starting : t.fromStartTitle(firstLevel)}
            </Text>
            <Text variant="caption">
              {firstUnit ? t.fromStartBody(firstUnit) : t.fromStartBodyPlain}
            </Text>
          </View>
          <ChevronRight color={colors.textMuted} size={20} />
        </Pressable>
      </Animated.View>

      <View style={styles.spacer} />
      <View style={styles.keep}>
        <ShieldCheck color={colors.textMuted} size={16} />
        <Text variant="caption" style={styles.keepText}>
          {t.keepNote}
        </Text>
      </View>
    </Screen>
  );
}

const HERO_HEIGHT = 236;
/** Qué franja de la escena (vertical) queda a la vista: 0 arriba, 1 abajo. Muestra el monumento. */
const HERO_FOCUS = 0.3;

/** Portada del curso: la escena del idioma, oscurecida abajo para el nombre y la bandera. */
function CourseHero({ photo, children }: { photo: ImageSourcePropType; children: ReactNode }) {
  const styles = useStyles();
  const [width, setWidth] = useState(0);
  const photoHeight = width * LANGUAGE_BACKGROUND_RATIO;
  return (
    <View style={styles.heroCard} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <Image
          source={photo}
          fadeDuration={0}
          style={{
            position: 'absolute',
            left: 0,
            width,
            height: photoHeight,
            top: -(photoHeight - HERO_HEIGHT) * HERO_FOCUS,
          }}
        />
      ) : null}
      <LinearGradient
        colors={['rgba(10,7,32,0)', 'rgba(10,7,32,0.35)', 'rgba(10,7,32,0.92)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.heroBody}>{children}</View>
    </View>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  const styles = useStyles();
  return (
    <View style={styles.fact} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.factIcon}>{icon}</View>
      <View style={styles.flex}>
        <Text variant="overline" numberOfLines={1}>
          {label.toUpperCase()}
        </Text>
        <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1, gap: spacing.xxs },
    heroCard: {
      height: HERO_HEIGHT,
      borderRadius: radii.xl,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
    },
    heroBody: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.lg,
    },
    heroFlag: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(10,7,32,0.55)',
      borderWidth: 2,
      borderColor: colors.primaryBright,
    },
    heroFlagText: { fontSize: 38, lineHeight: 46 },
    // Portada predeterminada (idioma sin escena): la de siempre.
    hero: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
    plainFlag: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
      borderWidth: 2,
      borderColor: colors.primaryBright,
      marginBottom: spacing.xs,
    },
    plainFlagText: { fontSize: 52, lineHeight: 62 },
    plainSourceChip: {
      alignSelf: 'center',
      marginTop: 0,
      backgroundColor: colors.surfaceHighlight,
    },
    onDark: { color: '#FFFFFF' },
    onDarkSoft: { color: '#DDD6FE' },
    facts: { flexDirection: 'row', gap: spacing.sm },
    fact: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    factIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
    },
    flagText: { fontSize: 44, lineHeight: 54 },
    sourceChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.xxs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    sourceFlag: { fontSize: 14, lineHeight: 18 },
    optionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 84 },
    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.inset,
    },
    mascot: { position: 'absolute', right: -spacing.sm, bottom: -spacing.lg, opacity: 0.22 },
    disabled: { opacity: 0.6 },
    note: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surfaceRaised,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: 72,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionIconPlain: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
    },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    spacer: { flexGrow: 1 },
    keep: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    keepText: { flexShrink: 1 },
  }),
);
